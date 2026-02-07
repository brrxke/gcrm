import os
from apps.services.common import create_base_app
from shared.routes.memberships import memberships_bp


def create_app():
    app = create_base_app('memberships-service')
    app.register_blueprint(memberships_bp, url_prefix='/api/memberships')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5003))
    app.run(host='0.0.0.0', port=port, debug=False)
