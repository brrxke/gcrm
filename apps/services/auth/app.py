import os
from apps.services.common import create_base_app
from shared.routes.auth import auth_bp


def create_app():
    app = create_base_app('auth-service', enable_db_init=True)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
