import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from shared.config import config
from shared.database import init_db
from shared.db_init import init_collections, check_first_run

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)


def create_base_app(service_name: str, config_name: str = None, enable_db_init: bool = False):
    config_name = config_name or os.getenv('FLASK_ENV', 'development')

    app = Flask(service_name)
    app.config.from_object(config[config_name])

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config['CORS_ORIGINS'],
                "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
            }
        },
    )

    JWTManager(app)

    limiter = Limiter(
        key_func=get_remote_address,
        app=app,
        default_limits=[app.config.get('RATELIMIT_DEFAULT', '200 per day;50 per hour')],
        storage_uri=app.config.get('RATELIMIT_STORAGE_URI', 'memory://'),
    )

    sentry_dsn = app.config.get('SENTRY_DSN', '')
    if sentry_dsn:
        try:
            import sentry_sdk
            from sentry_sdk.integrations.flask import FlaskIntegration
            sentry_sdk.init(
                dsn=sentry_dsn,
                integrations=[FlaskIntegration()],
                traces_sample_rate=0.1,
            )
            logger.info(f"[{service_name}] Sentry initialized")
        except ImportError:
            logger.warning(f"[{service_name}] sentry-sdk not installed, skipping Sentry init")

    try:
        from prometheus_flask_exporter import PrometheusMetrics
        metrics = PrometheusMetrics(app)
        metrics.info('app_info', 'Application info', version='1.0.0')
    except ImportError:
        pass

    if not init_db(app):
        logger.error(f"[{service_name}] Could not connect to database")
        logger.error(f"   MONGODB_URI: {os.getenv('MONGODB_URI', 'Not set')[:30]}...")
    else:
        logger.info(f"[{service_name}] Database connection established")
        if enable_db_init and check_first_run():
            logger.info(f"[{service_name}] First run detected. Initializing collections...")
            init_collections()

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({
            'error': 'Rate limit exceeded',
            'message': str(e.description)
        }), 429

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': service_name
        }), 200

    @app.route('/metrics')
    def metrics_endpoint():
        return '', 404

    return app
