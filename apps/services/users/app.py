import os
from apps.services.common import create_base_app
from shared.routes.users import users_bp


def create_app():
    app = create_base_app('users-service')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)
