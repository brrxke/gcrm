from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from models.user import User
from schemas import user_registration_schema, user_login_schema
from marshmallow import ValidationError
from middleware.auth import jwt_required_custom

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        # Validate request data
        data = user_registration_schema.load(request.json)
        
        # Check if user already exists
        existing_user = User.find_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user_id = User.create(data)
        
        # Create access token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': user_id
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        # Validate request data
        data = user_login_schema.load(request.json)
        
        # Find user
        user = User.find_by_email(data['email'])
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not User.verify_password(user['password'], data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Remove password from response
        user.pop('password', None)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Login failed', 'message': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required_custom
def get_current_user():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Remove password from response
        user.pop('password', None)
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user', 'message': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required_custom
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current and new password required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify current password
        if not User.verify_password(user['password'], current_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        import bcrypt
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        User.update(user_id, {'password': hashed_password})
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to change password', 'message': str(e)}), 500
