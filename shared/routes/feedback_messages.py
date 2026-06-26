from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from shared.models.feedback import Feedback
from shared.models.message import Message
from shared.schemas import feedback_schema, message_schema
from marshmallow import ValidationError
from shared.middleware.auth import jwt_required_custom, admin_required

# Feedback routes
feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/', methods=['POST'])
@jwt_required_custom
def create_feedback():
    """Create new feedback"""
    try:
        user_id = get_jwt_identity()
        
        # Validate data
        data = feedback_schema.load(request.json)
        data['user_id'] = user_id
        
        # Create feedback
        feedback_id = Feedback.create(data)
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback_id': feedback_id
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to create feedback'}), 500

@feedback_bp.route('/my-feedback', methods=['GET'])
@jwt_required_custom
def get_my_feedback():
    """Get current user's feedback"""
    try:
        user_id = get_jwt_identity()
        feedback_list = Feedback.get_by_user(user_id)
        
        return jsonify({
            'feedback': feedback_list,
            'total': len(feedback_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get feedback'}), 500

@feedback_bp.route('/', methods=['GET'])
@admin_required
def get_all_feedback():
    """Get all feedback (admin only)"""
    try:
        filters = {}
        
        # Get query parameters
        rating = request.args.get('rating')
        category = request.args.get('category')
        
        if rating:
            filters['rating'] = rating
        if category:
            filters['category'] = category
        
        feedback_list = Feedback.get_all(filters)
        
        return jsonify({
            'feedback': feedback_list,
            'total': len(feedback_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get feedback'}), 500

@feedback_bp.route('/average-rating', methods=['GET'])
def get_average_rating():
    """Get average rating (public)"""
    try:
        stats = Feedback.get_average_rating()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get rating'}), 500


# Message routes
messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/', methods=['POST'])
@jwt_required_custom
def send_message():
    """Send a message"""
    try:
        sender_id = get_jwt_identity()
        
        # Validate data
        data = message_schema.load(request.json)
        data['sender_id'] = sender_id
        
        # Create message
        message_id = Message.create(data)
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_id': message_id
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to send message'}), 500

@messages_bp.route('/conversation/<other_user_id>', methods=['GET'])
@jwt_required_custom
def get_conversation(other_user_id):
    """Get conversation with another user"""
    try:
        user_id = get_jwt_identity()
        messages = Message.get_conversation(user_id, other_user_id)
        
        return jsonify({
            'messages': messages,
            'total': len(messages)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get conversation'}), 500

@messages_bp.route('/mark-read', methods=['POST'])
@jwt_required_custom
def mark_messages_read():
    """Mark messages as read"""
    try:
        data = request.json
        message_ids = data.get('message_ids', [])
        
        if not message_ids:
            return jsonify({'error': 'message_ids required'}), 400
        
        count = Message.mark_as_read(message_ids)
        
        return jsonify({
            'message': f'{count} messages marked as read'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to mark messages'}), 500

@messages_bp.route('/unread-count', methods=['GET'])
@jwt_required_custom
def get_unread_count():
    """Get unread message count"""
    try:
        user_id = get_jwt_identity()
        count = Message.get_unread_count(user_id)
        
        return jsonify({'unread_count': count}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get count'}), 500
