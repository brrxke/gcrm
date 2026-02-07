import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from database import init_db
from db_init import init_collections, check_first_run


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

    if not init_db(app):
        print(f"❌ [{service_name}] Could not connect to database")
        print("   Please check your MongoDB connection in .env file")
        print("   MONGODB_URI:", os.getenv('MONGODB_URI', 'Not set'))
    else:
        print(f"✅ [{service_name}] Database connection established")
        if enable_db_init and check_first_run():
            print(f"🔧 [{service_name}] First run detected. Initializing collections...")
            init_collections()

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': service_name
        }), 200

    return app
