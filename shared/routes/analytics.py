from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from shared.models.visit import Visit
from shared.models.user import User
from shared.models.membership import Membership
from shared.middleware.auth import jwt_required_custom, admin_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Get dashboard statistics (admin only)"""
    try:
        # Get user stats
        user_stats = User.get_stats()
        
        # Get visit stats
        today_visits = Visit.get_today_visits()
        weekly_visits = Visit.get_weekly_visits()
        popular_hours = Visit.get_popular_hours()
        
        # Get membership distribution
        membership_distribution = Membership.get_distribution()
        
        return jsonify({
            'user_stats': user_stats,
            'visit_stats': {
                'today_visits': today_visits,
                'weekly_visits': weekly_visits,
                'popular_hours': popular_hours
            },
            'membership_distribution': membership_distribution
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get dashboard stats'}), 500

@analytics_bp.route('/visits/record', methods=['POST'])
@jwt_required_custom
def record_visit():
    """Record a gym visit"""
    try:
        user_id = get_jwt_identity()
        visit_id = Visit.create(user_id)
        
        return jsonify({
            'message': 'Visit recorded successfully',
            'visit_id': visit_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to record visit'}), 500

@analytics_bp.route('/visits/today', methods=['GET'])
@admin_required
def get_today_visits():
    """Get today's visit count (admin only)"""
    try:
        count = Visit.get_today_visits()
        return jsonify({'today_visits': count}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get visits'}), 500

@analytics_bp.route('/visits/weekly', methods=['GET'])
@admin_required
def get_weekly_visits():
    """Get weekly visit data (admin only)"""
    try:
        data = Visit.get_weekly_visits()
        return jsonify({'weekly_visits': data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get visits'}), 500

@analytics_bp.route('/visits/popular-hours', methods=['GET'])
@admin_required
def get_popular_hours():
    """Get popular hours (admin only)"""
    try:
        data = Visit.get_popular_hours()
        return jsonify({'popular_hours': data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get hours'}), 500

@analytics_bp.route('/visits/my-history', methods=['GET'])
@jwt_required_custom
def get_my_visit_history():
    """Get current user's visit history"""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 30, type=int)
        
        visits = Visit.get_user_visit_history(user_id, limit)
        
        return jsonify({
            'visits': visits,
            'total': len(visits)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get history'}), 500

@analytics_bp.route('/revenue', methods=['GET'])
@admin_required
def get_revenue_stats():
    """Get revenue statistics (admin only)"""
    try:
        # This is a placeholder - implement based on payment system
        # For now, calculate based on active memberships
        from shared.database import get_db
        db = get_db()
        
        pipeline = [
            {
                '$match': {
                    'role': 'client',
                    'membership_status': 'active',
                    'membership': {'$ne': None}
                }
            },
            {
                '$lookup': {
                    'from': 'memberships',
                    'localField': 'membership',
                    'foreignField': 'name',
                    'as': 'membership_info'
                }
            },
            {
                '$unwind': '$membership_info'
            },
            {
                '$group': {
                    '_id': None,
                    'total_revenue': {'$sum': '$membership_info.price'},
                    'count': {'$sum': 1}
                }
            }
        ]
        
        users_collection = db.get_collection('users')
        result = list(users_collection.aggregate(pipeline))
        
        if result:
            return jsonify({
                'monthly_revenue': result[0]['total_revenue'],
                'active_subscriptions': result[0]['count']
            }), 200
        else:
            return jsonify({
                'monthly_revenue': 0,
                'active_subscriptions': 0
            }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get revenue'}), 500
