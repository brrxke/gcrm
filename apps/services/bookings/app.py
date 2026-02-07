import os
from apps.services.common import create_base_app
from shared.routes.bookings import bookings_bp


def create_app():
    app = create_base_app('bookings-service')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5004))
    app.run(host='0.0.0.0', port=port, debug=False)
