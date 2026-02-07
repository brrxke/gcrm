from bson.objectid import ObjectId
from datetime import datetime
from shared.database import get_db

class Feedback:
    """Client feedback and survey model"""
    
    collection_name = 'feedback'
    
    @staticmethod
    def create(data):
        """Create new feedback"""
        db = get_db()
        collection = db.get_collection(Feedback.collection_name)
        
        feedback_data = {
            'user_id': data['user_id'],
            'rating': data['rating'],  # 1-5
            'category': data.get('category', 'general'),
            'comment': data.get('comment', ''),
            'suggestions': data.get('suggestions', ''),
            'created_at': datetime.utcnow()
        }
        
        result = collection.insert_one(feedback_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_by_user(user_id):
        """Get all feedback from a user"""
        db = get_db()
        collection = db.get_collection(Feedback.collection_name)
        
        feedback_list = list(collection.find({'user_id': user_id}).sort('created_at', -1))
        for feedback in feedback_list:
            feedback['_id'] = str(feedback['_id'])
        return feedback_list
    
    @staticmethod
    def get_all(filters=None):
        """Get all feedback with optional filters"""
        db = get_db()
        collection = db.get_collection(Feedback.collection_name)
        
        query = {}
        if filters:
            if 'rating' in filters:
                query['rating'] = int(filters['rating'])
            if 'category' in filters:
                query['category'] = filters['category']
        
        feedback_list = list(collection.find(query).sort('created_at', -1))
        for feedback in feedback_list:
            feedback['_id'] = str(feedback['_id'])
        return feedback_list
    
    @staticmethod
    def get_average_rating():
        """Get average rating"""
        db = get_db()
        collection = db.get_collection(Feedback.collection_name)
        
        pipeline = [
            {'$group': {
                '_id': None,
                'average_rating': {'$avg': '$rating'},
                'total_feedback': {'$sum': 1}
            }}
        ]
        
        result = list(collection.aggregate(pipeline))
        if result:
            return {
                'average_rating': round(result[0]['average_rating'], 2),
                'total_feedback': result[0]['total_feedback']
            }
        return {'average_rating': 0, 'total_feedback': 0}
