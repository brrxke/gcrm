from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime
import bcrypt
from shared.database import get_db

def safe_object_id(id_str):
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None

class User:
    collection_name = 'users'

    @staticmethod
    def create(data):
        db = get_db()
        collection = db.get_collection(User.collection_name)
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        user_data = {
            'name': data['name'],
            'email': data['email'].lower(),
            'phone': data.get('phone', ''),
            'age': data.get('age', None),
            'password': hashed_password,
            'role': data.get('role', 'client'),
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
    def find_by_email(email, include_password=False):
        db = get_db()
        collection = db.get_collection(User.collection_name)
        projection = None if include_password else {'password': 0}
        user = collection.find_one({'email': email.lower()}, projection)
        if user:
            user['_id'] = str(user['_id'])
        return user

    @staticmethod
    def find_by_id(user_id):
        obj_id = safe_object_id(user_id)
        if not obj_id:
            return None
        db = get_db()
        collection = db.get_collection(User.collection_name)
        projection = {'password': 0}
        user = collection.find_one({'_id': obj_id}, projection)
        if user:
            user['_id'] = str(user['_id'])
        return user

    @staticmethod
    def verify_password(stored_password, provided_password):
        if stored_password is None:
            return False
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')
        try:
            return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)
        except (ValueError, TypeError):
            return False

    @staticmethod
    def get_all_clients(filters=None):
        db = get_db()
        collection = db.get_collection(User.collection_name)
        projection = {'password': 0}
        query = {'role': 'client'}
        if filters:
            if 'status' in filters and filters['status'] != 'all':
                query['membership_status'] = filters['status']
            if 'search' in filters:
                query['$or'] = [
                    {'name': {'$regex': filters['search'], '$options': 'i'}},
                    {'email': {'$regex': filters['search'], '$options': 'i'}}
                ]
        clients = list(collection.find(query, projection))
        for client in clients:
            client['_id'] = str(client['_id'])
        return clients

    @staticmethod
    def update(user_id, data):
        obj_id = safe_object_id(user_id)
        if not obj_id:
            return False
        db = get_db()
        collection = db.get_collection(User.collection_name)
        update_data = {'updated_at': datetime.utcnow()}
        allowed_fields = ['name', 'phone', 'membership', 'membership_status',
                         'expiry_date', 'profile_image', 'age', 'password']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        result = collection.update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        return result.modified_count > 0

    @staticmethod
    def delete(user_id):
        obj_id = safe_object_id(user_id)
        if not obj_id:
            return False
        db = get_db()
        collection = db.get_collection(User.collection_name)
        result = collection.delete_one({'_id': obj_id})
        return result.deleted_count > 0

    @staticmethod
    def get_stats():
        db = get_db()
        collection = db.get_collection(User.collection_name)
        pipeline = [
            {'$match': {'role': 'client'}},
            {'$group': {
                '_id': '$membership_status',
                'count': {'$sum': 1}
            }}
        ]
        result = list(collection.aggregate(pipeline))
        stats = {item['_id']: item['count'] for item in result}
        total_clients = sum(stats.values())
        return {
            'total_clients': total_clients,
            'active_members': stats.get('active', 0),
            'expired_members': stats.get('expired', 0),
            'trial_members': stats.get('trial', 0)
        }

    @staticmethod
    def count_admins():
        db = get_db()
        collection = db.get_collection(User.collection_name)
        return collection.count_documents({'role': 'admin'})

    @staticmethod
    def set_role(user_id, role):
        obj_id = safe_object_id(user_id)
        if not obj_id:
            return False
        db = get_db()
        collection = db.get_collection(User.collection_name)
        result = collection.update_one(
            {'_id': obj_id},
            {'$set': {'role': role, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
