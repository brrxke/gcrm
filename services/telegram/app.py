import os
from services.common import create_base_app
from routes.telegram.routes import telegram_bp


def create_app():
    app = create_base_app('telegram-service')
    app.register_blueprint(telegram_bp, url_prefix='/api/telegram')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5007))
    app.run(host='0.0.0.0', port=port, debug=False)
