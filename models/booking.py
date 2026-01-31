from bson.objectid import ObjectId
from datetime import datetime
from database import get_db

class Booking:
    """Trial session booking model"""
    
    collection_name = 'bookings'
    
    @staticmethod
    def create(data):
        """Create a new booking"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        booking_data = {
            'user_id': data['user_id'],
            'name': data['name'],
            'email': data['email'],
            'phone': data.get('phone', ''),
            'date': data['date'],
            'time': data['time'],
            'status': data.get('status', 'pending'),  # pending, confirmed, completed, cancelled
            'notes': data.get('notes', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = collection.insert_one(booking_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_id(booking_id):
        """Find booking by ID"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        booking = collection.find_one({'_id': ObjectId(booking_id)})
        if booking:
            booking['_id'] = str(booking['_id'])
        return booking
    
    @staticmethod
    def get_by_user(user_id):
        """Get all bookings for a user"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        bookings = list(collection.find({'user_id': user_id}).sort('date', -1))
        for booking in bookings:
            booking['_id'] = str(booking['_id'])
        return bookings
    
    @staticmethod
    def get_all(filters=None):
        """Get all bookings with optional filters"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        query = {}
        if filters:
            if 'status' in filters and filters['status'] != 'all':
                query['status'] = filters['status']
            if 'date' in filters:
                query['date'] = filters['date']
        
        bookings = list(collection.find(query).sort('date', -1))
        for booking in bookings:
            booking['_id'] = str(booking['_id'])
        return bookings
    
    @staticmethod
    def update_status(booking_id, status):
        """Update booking status"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        result = collection.update_one(
            {'_id': ObjectId(booking_id)},
            {'$set': {'status': status, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete(booking_id):
        """Delete booking"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        result = collection.delete_one({'_id': ObjectId(booking_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def check_availability(date, time):
        """Check if a time slot is available"""
        db = get_db()
        collection = db.get_collection(Booking.collection_name)
        
        existing = collection.count_documents({
            'date': date,
            'time': time,
            'status': {'$in': ['pending', 'confirmed']}
        })
        
        # Allow max 5 bookings per time slot
        return existing < 5
