from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from shared.models.user import User
from shared.schemas import user_update_schema
from marshmallow import ValidationError
from shared.middleware.auth import jwt_required_custom, admin_required
import os
from shared.utils.file_handler import save_file

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@admin_required
def get_all_users():
    try:
        filters = {}
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
        
    except Exception:
        return jsonify({'error': 'Failed to get users'}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required_custom
def get_user(user_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if current_user['role'] != 'admin' and current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.pop('password', None)
        
        return jsonify({'user': user}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to get user'}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required_custom
def update_user(user_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if current_user['role'] != 'admin' and current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = user_update_schema.load(request.json, partial=True)
        success = User.update(user_id, data)
        
        if not success:
            return jsonify({'error': 'User not found'}), 404
        
        user = User.find_by_id(user_id)
        user.pop('password', None)
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Failed to update user'}), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    try:
        success = User.delete(user_id)
        
        if not success:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to delete user'}), 500

@users_bp.route('/<user_id>/upload-photo', methods=['POST'])
@jwt_required_custom
def upload_profile_photo(user_id):
    try:
        current_user_id = get_jwt_identity()
        
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        upload_folder = os.path.join('uploads', 'profiles')
        filename = save_file(file, upload_folder, resize_image=True)
        
        if not filename:
            return jsonify({'error': 'Invalid file'}), 400
        
        User.update(user_id, {'profile_image': filename})
        
        return jsonify({
            'message': 'Profile photo uploaded successfully',
            'filename': filename
        }), 200
        
    except Exception:
        return jsonify({'error': 'Failed to upload photo'}), 500

@users_bp.route('/stats', methods=['GET'])
@admin_required
def get_user_stats():
    try:
        stats = User.get_stats()
        return jsonify(stats), 200
    except Exception:
        return jsonify({'error': 'Failed to get stats'}), 500

@users_bp.route('/<user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(user_id):
    try:
        data = request.json or {}
        role = data.get('role')
        if role not in ['admin', 'client']:
            return jsonify({'error': 'Invalid role'}), 400

        target_user = User.find_by_id(user_id)
        if not target_user:
            return jsonify({'error': 'User not found'}), 404

        if role != 'admin' and target_user.get('role') == 'admin' and User.count_admins() <= 1:
            return jsonify({'error': 'Cannot remove last admin'}), 400

        success = User.set_role(user_id, role)
        if not success:
            return jsonify({'error': 'Failed to update role'}), 500

        user = User.find_by_id(user_id)
        return jsonify({'message': 'Role updated successfully', 'user': user}), 200
    except Exception:
        return jsonify({'error': 'Failed to update role'}), 500
