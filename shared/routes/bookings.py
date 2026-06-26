from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from shared.models.booking import Booking
from shared.schemas import booking_schema
from marshmallow import ValidationError
from shared.middleware.auth import jwt_required_custom, admin_required

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/', methods=['POST'])
@jwt_required_custom
def create_booking():
    """Create a new trial booking"""
    try:
        user_id = get_jwt_identity()
        
        # Validate data
        data = booking_schema.load(request.json)
        
        # Check availability
        if not Booking.check_availability(data['date'].isoformat(), data['time']):
            return jsonify({'error': 'Time slot is not available'}), 400
        
        # Add user_id to booking data
        data['user_id'] = user_id
        data['date'] = data['date'].isoformat()
        
        # Create booking
        booking_id = Booking.create(data)
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking_id': booking_id
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400
    except Exception:
        return jsonify({'error': 'Failed to create booking'}), 500

@bookings_bp.route('/my-bookings', methods=['GET'])
@jwt_required_custom
def get_my_bookings():
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        bookings = Booking.get_by_user(user_id)
        total = len(bookings)
        start = (page - 1) * per_page
        end = start + per_page
        paginated = bookings[start:end] if start < total else []
        
        return jsonify({
            'bookings': paginated,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }), 200
        
    except Exception:
        return jsonify({'error': 'Failed to get bookings'}), 500

@bookings_bp.route('/', methods=['GET'])
@admin_required
def get_all_bookings():
    try:
        filters = {}
        
        status = request.args.get('status')
        date = request.args.get('date')
        
        if status:
            filters['status'] = status
        if date:
            filters['date'] = date
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        bookings = Booking.get_all(filters)
        total = len(bookings)
        start = (page - 1) * per_page
        end = start + per_page
        paginated = bookings[start:end] if start < total else []
        
        return jsonify({
            'bookings': paginated,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }), 200
        
    except Exception:
        return jsonify({'error': 'Failed to get bookings'}), 500

@bookings_bp.route('/<booking_id>', methods=['GET'])
@jwt_required_custom
def get_booking(booking_id):
    try:
        booking = Booking.find_by_id(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        return jsonify({'booking': booking}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to get booking'}), 500

@bookings_bp.route('/<booking_id>/status', methods=['PATCH'])
@admin_required
def update_booking_status(booking_id):
    """Update booking status (admin only)"""
    try:
        data = request.json
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status is required'}), 400
        
        if status not in ['pending', 'confirmed', 'completed', 'cancelled']:
            return jsonify({'error': 'Invalid status'}), 400
        
        success = Booking.update_status(booking_id, status)
        
        if not success:
            return jsonify({'error': 'Booking not found'}), 404
        
        return jsonify({'message': 'Booking status updated successfully'}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to update status'}), 500

@bookings_bp.route('/<booking_id>', methods=['DELETE'])
@jwt_required_custom
def delete_booking(booking_id):
    """Delete booking"""
    try:
        user_id = get_jwt_identity()
        
        # Get booking to check ownership
        booking = Booking.find_by_id(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Only allow user to delete their own booking or admin to delete any
        from shared.models.user import User
        user = User.find_by_id(user_id)
        if booking['user_id'] != user_id and user['role'] != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        success = Booking.delete(booking_id)
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to delete booking'}), 500

@bookings_bp.route('/check-availability', methods=['POST'])
def check_availability():
    """Check if a time slot is available (public)"""
    try:
        data = request.json
        date = data.get('date')
        time = data.get('time')
        
        if not date or not time:
            return jsonify({'error': 'Date and time are required'}), 400
        
        available = Booking.check_availability(date, time)
        
        return jsonify({'available': available}), 200
        
    except Exception:
        return jsonify({'error': 'Failed to check availability'}), 500
