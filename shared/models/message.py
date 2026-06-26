from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from shared.database import get_db

def safe_object_id(id_str):
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None

class Message:
    """Chat messages between clients and trainers"""
    
    collection_name = 'messages'
    
    @staticmethod
    def create(data):
        """Create a new message"""
        db = get_db()
        collection = db.get_collection(Message.collection_name)
        
        message_data = {
            'sender_id': data['sender_id'],
            'receiver_id': data['receiver_id'],
            'message': data['message'],
            'is_read': False,
            'created_at': datetime.utcnow()
        }
        
        result = collection.insert_one(message_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_conversation(user_id_1, user_id_2):
        """Get conversation between two users"""
        db = get_db()
        collection = db.get_collection(Message.collection_name)
        
        messages = list(collection.find({
            '$or': [
                {'sender_id': user_id_1, 'receiver_id': user_id_2},
                {'sender_id': user_id_2, 'receiver_id': user_id_1}
            ]
        }).sort('created_at', 1))
        
        for message in messages:
            message['_id'] = str(message['_id'])
        return messages
    
    @staticmethod
    def mark_as_read(message_ids):
        db = get_db()
        collection = db.get_collection(Message.collection_name)
        valid_ids = [safe_object_id(mid) for mid in message_ids if safe_object_id(mid)]
        if not valid_ids:
            return 0
        result = collection.update_many(
            {'_id': {'$in': valid_ids}},
            {'$set': {'is_read': True}}
        )
        return result.modified_count
    
    @staticmethod
    def get_unread_count(user_id):
        """Get count of unread messages for a user"""
        db = get_db()
        collection = db.get_collection(Message.collection_name)
        
        count = collection.count_documents({
            'receiver_id': user_id,
            'is_read': False
        })
        return count
