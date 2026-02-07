import os
from services.common import create_base_app
from routes.feedback_messages import feedback_bp, messages_bp


def create_app():
    app = create_base_app('feedback-service')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5005))
    app.run(host='0.0.0.0', port=port, debug=False)
