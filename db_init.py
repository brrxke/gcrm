from pymongo import ASCENDING
from database import get_db

def init_collections():
    db = get_db()
    
    collections = {
        'users': [
            [('email', ASCENDING)],
            [('role', ASCENDING)],
            [('membership_status', ASCENDING)],
        ],
        'memberships': [
            [('name', ASCENDING)],
            [('is_active', ASCENDING)],
        ],
        'bookings': [
            [('user_id', ASCENDING)],
            [('date', ASCENDING)],
            [('status', ASCENDING)],
        ],
        'feedback': [
            [('user_id', ASCENDING)],
            [('rating', ASCENDING)],
            [('category', ASCENDING)],
        ],
        'messages': [
            [('from_user_id', ASCENDING)],
            [('to_user_id', ASCENDING)],
            [('created_at', ASCENDING)],
        ],
        'visits': [
            [('user_id', ASCENDING)],
            [('date', ASCENDING)],
            [('timestamp', ASCENDING)],
        ],
    }
    
    initialized_count = 0
    
    for collection_name, indexes in collections.items():
        collection = db.get_collection(collection_name)
        existing_indexes = collection.index_information()
        
        for index_fields in indexes:
            index_name = '_'.join([field[0] for field in index_fields]) + '_1'
            
            if index_name not in existing_indexes:
                is_unique = (collection_name == 'users' and index_fields[0][0] == 'email')
                
                collection.create_index(
                    index_fields,
                    unique=is_unique,
                    name=index_name
                )
                initialized_count += 1
                print(f"  ✓ Created index '{index_name}' on '{collection_name}'")
    
    if initialized_count > 0:
        print(f"✅ Initialized {initialized_count} indexes")
    else:
        print("✅ All indexes already exist")

def check_first_run():
    db = get_db()
    existing_collections = db.db.list_collection_names()
    expected_collections = ['users', 'memberships', 'bookings', 'feedback', 'messages', 'visits']
    has_any = any(col in existing_collections for col in expected_collections)
    return not has_any
