from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from models.user import User
from schemas import user_update_schema
from marshmallow import ValidationError
from middleware.auth import jwt_required_custom, admin_required
from utils.file_handler import save_file
import os

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@admin_required
def get_all_users():
    """Get all clients (admin only)"""
    try:
        filters = {}
        
        # Get query parameters
        status = request.args.get('status')
        search = request.args.get('search')
        
        if status:
            filters['status'] = status
        if search:
            filters['search'] = search
        
        clients = User.get_all_clients(filters)
        
        return jsonify({
            'clients': clients,
            'total': len(clients)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get users', 'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required_custom
def get_user(user_id):
    """Get user by ID"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        # Users can only view their own profile unless they're admin
        if current_user['role'] != 'admin' and current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.pop('password', None)
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user', 'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required_custom
def update_user(user_id):
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        # Users can only update their own profile unless they're admin
        if current_user['role'] != 'admin' and current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Validate data
        data = user_update_schema.load(request.json, partial=True)
        
        # Update user
        success = User.update(user_id, data)
        
        if not success:
            return jsonify({'error': 'User not found'}), 404
        
        # Get updated user
        user = User.find_by_id(user_id)
        user.pop('password', None)
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to update user', 'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Delete user (admin only)"""
    try:
        success = User.delete(user_id)
        
        if not success:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to delete user', 'message': str(e)}), 500

@users_bp.route('/<user_id>/upload-photo', methods=['POST'])
@jwt_required_custom
def upload_profile_photo(user_id):
    """Upload profile photo"""
    try:
        current_user_id = get_jwt_identity()
        
        # Users can only upload their own photo
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Save file
        upload_folder = os.path.join('uploads', 'profiles')
        filename = save_file(file, upload_folder, resize_image=True)
        
        if not filename:
            return jsonify({'error': 'Invalid file'}), 400
        
        # Update user profile
        User.update(user_id, {'profile_image': filename})
        
        return jsonify({
            'message': 'Profile photo uploaded successfully',
            'filename': filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to upload photo', 'message': str(e)}), 500

@users_bp.route('/stats', methods=['GET'])
@admin_required
def get_user_stats():
    """Get user statistics (admin only)"""
    try:
        stats = User.get_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get stats', 'message': str(e)}), 500
