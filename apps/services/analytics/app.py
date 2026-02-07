import os
from apps.services.common import create_base_app
from shared.routes.analytics import analytics_bp


def create_app():
    app = create_base_app('analytics-service')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5006))
    app.run(host='0.0.0.0', port=port, debug=False)
