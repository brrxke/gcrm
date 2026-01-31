from bson.objectid import ObjectId
from datetime import datetime
import bcrypt
from database import get_db

class User:
    """User model for authentication and profile management"""
    
    collection_name = 'users'
    
    @staticmethod
    def create(data):
        """Create a new user"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        
        # Hash password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        user_data = {
            'name': data['name'],
            'email': data['email'].lower(),
            'phone': data.get('phone', ''),
            'password': hashed_password,
            'role': data.get('role', 'client'),  # 'admin' or 'client'
            'membership': data.get('membership', None),
            'membership_status': data.get('membership_status', 'inactive'),
            'join_date': datetime.utcnow(),
            'expiry_date': data.get('expiry_date', None),
            'profile_image': data.get('profile_image', None),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        user = collection.find_one({'email': email.lower()})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        user = collection.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        """Verify password"""
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)
    
    @staticmethod
    def get_all_clients(filters=None):
        """Get all clients with optional filters"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        
        query = {'role': 'client'}
        if filters:
            if 'status' in filters and filters['status'] != 'all':
                query['membership_status'] = filters['status']
            if 'search' in filters:
                query['$or'] = [
                    {'name': {'$regex': filters['search'], '$options': 'i'}},
                    {'email': {'$regex': filters['search'], '$options': 'i'}}
                ]
        
        clients = list(collection.find(query))
        for client in clients:
            client['_id'] = str(client['_id'])
            client.pop('password', None)  # Remove password from response
        return clients
    
    @staticmethod
    def update(user_id, data):
        """Update user information"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        
        update_data = {
            'updated_at': datetime.utcnow()
        }
        
        # Only update provided fields
        allowed_fields = ['name', 'phone', 'membership', 'membership_status', 
                         'expiry_date', 'profile_image']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete(user_id):
        """Delete user"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        result = collection.delete_one({'_id': ObjectId(user_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def get_stats():
        """Get user statistics for admin dashboard"""
        db = get_db()
        collection = db.get_collection(User.collection_name)
        
        total_clients = collection.count_documents({'role': 'client'})
        active_members = collection.count_documents({
            'role': 'client',
            'membership_status': 'active'
        })
        expired_members = collection.count_documents({
            'role': 'client',
            'membership_status': 'expired'
        })
        trial_members = collection.count_documents({
            'role': 'client',
            'membership_status': 'trial'
        })
        
        return {
            'total_clients': total_clients,
            'active_members': active_members,
            'expired_members': expired_members,
            'trial_members': trial_members
        }
