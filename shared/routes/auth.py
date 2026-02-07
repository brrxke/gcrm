from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from shared.models.user import User
from shared.schemas import user_registration_schema, user_login_schema
from marshmallow import ValidationError
from shared.middleware.auth import jwt_required_custom
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = user_registration_schema.load(request.json)
        data['role'] = 'client'
        existing_user = User.find_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
        
        user_id = User.create(data)
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': user_id
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/setup-admin', methods=['POST'])
def setup_admin():
    try:
        setup_token = os.getenv('ADMIN_SETUP_TOKEN', '')
        provided_token = request.headers.get('X-Admin-Setup-Token', '')
        if not setup_token or provided_token != setup_token:
            return jsonify({'error': 'Unauthorized'}), 403

        if User.count_admins() > 0:
            return jsonify({'error': 'Admin already exists'}), 409

        data = user_registration_schema.load(request.json)
        data['role'] = 'admin'

        existing_user = User.find_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400

        user_id = User.create(data)
        access_token = create_access_token(identity=user_id)
        user = User.find_by_id(user_id)

        return jsonify({
            'message': 'Admin created successfully',
            'access_token': access_token,
            'user': user
        }), 201

    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Admin setup failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = user_login_schema.load(request.json)
        user = User.find_by_email(data['email'], include_password=True)
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not User.verify_password(user['password'], data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=str(user['_id']))
        user.pop('password', None)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required_custom
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.pop('password', None)
        return jsonify({'user': user}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to get user'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required_custom
def change_password():
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
        
        if not User.verify_password(user['password'], current_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        import bcrypt
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        User.update(user_id, {'password': hashed_password})
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to change password'}), 500
