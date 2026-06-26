from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from shared.database import get_db

def safe_object_id(id_str):
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None

class Membership:
    collection_name = 'memberships'

    @staticmethod
    def create(data):
        db = get_db()
        collection = db.get_collection(Membership.collection_name)
        membership_data = {
            'name': data['name'],
            'price': data['price'],
            'duration': data['duration'],
            'features': data['features'],
            'description': data.get('description', ''),
            'is_active': data.get('is_active', True),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = collection.insert_one(membership_data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        db = get_db()
        collection = db.get_collection(Membership.collection_name)
        memberships = list(collection.find({'is_active': True}))
        for membership in memberships:
            membership['_id'] = str(membership['_id'])
        return memberships

    @staticmethod
    def find_by_id(membership_id):
        obj_id = safe_object_id(membership_id)
        if not obj_id:
            return None
        db = get_db()
        collection = db.get_collection(Membership.collection_name)
        membership = collection.find_one({'_id': obj_id})
        if membership:
            membership['_id'] = str(membership['_id'])
        return membership

    @staticmethod
    def update(membership_id, data):
        obj_id = safe_object_id(membership_id)
        if not obj_id:
            return False
        db = get_db()
        collection = db.get_collection(Membership.collection_name)
        update_data = {'updated_at': datetime.utcnow()}
        allowed_fields = ['name', 'price', 'duration', 'features', 'description', 'is_active']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        result = collection.update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        return result.modified_count > 0

    @staticmethod
    def delete(membership_id):
        obj_id = safe_object_id(membership_id)
        if not obj_id:
            return False
        db = get_db()
        collection = db.get_collection(Membership.collection_name)
        result = collection.update_one(
            {'_id': obj_id},
            {'$set': {'is_active': False, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0

    @staticmethod
    def get_distribution():
        db = get_db()
        users_collection = db.get_collection('users')
        pipeline = [
            {'$match': {'role': 'client', 'membership': {'$ne': None}}},
            {'$group': {'_id': '$membership', 'count': {'$sum': 1}}}
        ]
        distribution = list(users_collection.aggregate(pipeline))
        return distribution
