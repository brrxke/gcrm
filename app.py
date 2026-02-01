from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from database import init_db
from db_init import init_collections, check_first_run
import os

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    jwt = JWTManager(app)
    
    print("\n🔌 Connecting to MongoDB...")
    if not init_db(app):
        print("❌ Warning: Could not connect to database")
        print("   Please check your MongoDB connection in .env file")
        print("   MONGODB_URI:", os.getenv('MONGODB_URI', 'Not set'))
    else:
        print("📊 Database connection established")
        
        if check_first_run():
            print("\n🔧 First run detected. Initializing collections...")
            init_collections()
        else:
            print("\n✅ Collections already exist. Skipping initialization.")
    
from routes.auth import auth_bp
from routes.users import users_bp
from routes.memberships import memberships_bp
from routes.bookings import bookings_bp
from routes.feedback_messages import feedback_bp, messages_bp
from routes.analytics import analytics_bp
from routes.telegram.routes import telegram_bp
from routes.telegram.routes import telegram_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(memberships_bp, url_prefix='/api/memberships')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(telegram_bp, url_prefix='/api/telegram')
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed'}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Missing authorization token'}), 401
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Gym CRM API is running'
        }), 200
    
    @app.route('/api/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        return '', 204
    
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'Welcome to Gym CRM API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'users': '/api/users',
                'memberships': '/api/memberships',
                'bookings': '/api/bookings',
                'feedback': '/api/feedback',
                'messages': '/api/messages',
                'analytics': '/api/analytics'
            }
        }), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
