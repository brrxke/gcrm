from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from shared.models.user import User
from shared.schemas import user_registration_schema, user_login_schema
from marshmallow import ValidationError
from shared.middleware.auth import jwt_required_custom
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import re

auth_bp = Blueprint('auth', __name__)

limiter = Limiter(key_func=get_remote_address)

def validate_password(password):
    errors = []
    if len(password) < 8:
        errors.append('Password must be at least 8 characters')
    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain at least one uppercase letter')
    if not re.search(r'[a-z]', password):
        errors.append('Password must contain at least one lowercase letter')
    if not re.search(r'\d', password):
        errors.append('Password must contain at least one digit')
    return errors

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    try:
        data = user_registration_schema.load(request.json)

        pw_errors = validate_password(data['password'])
        if pw_errors:
            return jsonify({'error': 'Validation error', 'messages': {'password': pw_errors}}), 400

        data['role'] = 'client'
        existing_user = User.find_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400

        user_id = User.create(data)
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)

        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_id': user_id
        }), 201

    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/setup-admin', methods=['POST'])
@limiter.limit("3 per hour")
def setup_admin():
    try:
        setup_token = os.getenv('ADMIN_SETUP_TOKEN', '')
        provided_token = request.headers.get('X-Admin-Setup-Token', '')
        if not setup_token or provided_token != setup_token:
            return jsonify({'error': 'Unauthorized'}), 403

        if User.count_admins() > 0:
            return jsonify({'error': 'Admin already exists'}), 409

        data = user_registration_schema.load(request.json)

        pw_errors = validate_password(data['password'])
        if pw_errors:
            return jsonify({'error': 'Validation error', 'messages': {'password': pw_errors}}), 400

        data['role'] = 'admin'

        existing_user = User.find_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400

        user_id = User.create(data)
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        user = User.find_by_id(user_id)

        return jsonify({
            'message': 'Admin created successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user
        }), 201

    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Admin setup failed'}), 500

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute; 100 per hour")
def login():
    try:
        data = user_login_schema.load(request.json)
        user = User.find_by_email(data['email'], include_password=True)

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if not User.verify_password(user['password'], data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401

        access_token = create_access_token(identity=str(user['_id']))
        refresh_token = create_refresh_token(identity=str(user['_id']))
        user.pop('password', None)

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user
        }), 200

    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity)
        return jsonify({'access_token': access_token}), 200
    except Exception:
        return jsonify({'error': 'Token refresh failed'}), 500

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

        pw_errors = validate_password(new_password)
        if pw_errors:
            return jsonify({'error': 'Validation error', 'messages': {'new_password': pw_errors}}), 400

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
