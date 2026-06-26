from flask import Blueprint, request, jsonify
from shared.models.membership import Membership
from shared.schemas import membership_schema
from marshmallow import ValidationError
from shared.middleware.auth import jwt_required_custom, admin_required

memberships_bp = Blueprint('memberships', __name__)

@memberships_bp.route('/', methods=['GET'])
def get_all_memberships():
    """Get all active membership plans (public)"""
    try:
        memberships = Membership.get_all()
        return jsonify({'memberships': memberships}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get memberships'}), 500

@memberships_bp.route('/<membership_id>', methods=['GET'])
def get_membership(membership_id):
    """Get membership by ID (public)"""
    try:
        membership = Membership.find_by_id(membership_id)
        
        if not membership:
            return jsonify({'error': 'Membership not found'}), 404
        
        return jsonify({'membership': membership}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get membership'}), 500

@memberships_bp.route('/', methods=['POST'])
@admin_required
def create_membership():
    """Create new membership plan (admin only)"""
    try:
        # Validate data
        data = membership_schema.load(request.json)
        
        # Create membership
        membership_id = Membership.create(data)
        
        return jsonify({
            'message': 'Membership created successfully',
            'membership_id': membership_id
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to create membership'}), 500

@memberships_bp.route('/<membership_id>', methods=['PUT'])
@admin_required
def update_membership(membership_id):
    """Update membership plan (admin only)"""
    try:
        # Validate data
        data = membership_schema.load(request.json, partial=True)
        
        # Update membership
        success = Membership.update(membership_id, data)
        
        if not success:
            return jsonify({'error': 'Membership not found'}), 404
        
        # Get updated membership
        membership = Membership.find_by_id(membership_id)
        
        return jsonify({
            'message': 'Membership updated successfully',
            'membership': membership
        }), 200
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to update membership'}), 500

@memberships_bp.route('/<membership_id>', methods=['DELETE'])
@admin_required
def delete_membership(membership_id):
    """Delete (deactivate) membership plan (admin only)"""
    try:
        success = Membership.delete(membership_id)
        
        if not success:
            return jsonify({'error': 'Membership not found'}), 404
        
        return jsonify({'message': 'Membership deactivated successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete membership'}), 500

@memberships_bp.route('/distribution', methods=['GET'])
@admin_required
def get_membership_distribution():
    """Get membership distribution statistics (admin only)"""
    try:
        distribution = Membership.get_distribution()
        return jsonify({'distribution': distribution}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get distribution'}), 500
