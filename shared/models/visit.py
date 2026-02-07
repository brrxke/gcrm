from bson.objectid import ObjectId
from datetime import datetime, timedelta
from shared.database import get_db

class Visit:
    """Gym visit tracking for analytics"""
    
    collection_name = 'visits'
    
    @staticmethod
    def create(user_id):
        """Record a gym visit"""
        db = get_db()
        collection = db.get_collection(Visit.collection_name)
        
        visit_data = {
            'user_id': user_id,
            'timestamp': datetime.utcnow(),
            'date': datetime.utcnow().date().isoformat(),
            'hour': datetime.utcnow().hour
        }
        
        result = collection.insert_one(visit_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_today_visits():
        """Get today's visit count"""
        db = get_db()
        collection = db.get_collection(Visit.collection_name)
        
        today = datetime.utcnow().date().isoformat()
        count = collection.count_documents({'date': today})
        return count
    
    @staticmethod
    def get_weekly_visits():
        """Get visits for the past 7 days"""
        db = get_db()
        collection = db.get_collection(Visit.collection_name)
        
        days_data = []
        for i in range(7):
            date = (datetime.utcnow() - timedelta(days=6-i)).date().isoformat()
            count = collection.count_documents({'date': date})
            days_data.append({
                'date': date,
                'visits': count
            })
        
        return days_data
    
    @staticmethod
    def get_popular_hours():
        """Get visit distribution by hour"""
        db = get_db()
        collection = db.get_collection(Visit.collection_name)
        
        pipeline = [
            {'$group': {
                '_id': '$hour',
                'count': {'$sum': 1}
            }},
            {'$sort': {'_id': 1}}
        ]
        
        result = list(collection.aggregate(pipeline))
        hours_data = []
        for item in result:
            hours_data.append({
                'hour': item['_id'],
                'count': item['count']
            })
        
        return hours_data
    
    @staticmethod
    def get_user_visit_history(user_id, limit=30):
        """Get visit history for a specific user"""
        db = get_db()
        collection = db.get_collection(Visit.collection_name)
        
        visits = list(collection.find(
            {'user_id': user_id}
        ).sort('timestamp', -1).limit(limit))
        
        for visit in visits:
            visit['_id'] = str(visit['_id'])
        
        return visits
