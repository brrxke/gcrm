from pymongo import MongoClient
from bson.objectid import ObjectId
import os

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self, uri):
        """Connect to MongoDB"""
        try:
            self.client = MongoClient(uri)
            self.db = self.client.get_database()
            # Test connection
            self.client.admin.command('ping')
            print("✅ Successfully connected to MongoDB!")
            return True
        except Exception as e:
            print(f"❌ Error connecting to MongoDB: {e}")
            return False

    def get_collection(self, collection_name):
        """Get a collection from the database"""
        if self.db is None:
            raise Exception("Database not connected")
        return self.db[collection_name]

    def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            print("Database connection closed")

# Create global database instance
db_instance = Database()

def get_db():
    """Get database instance"""
    return db_instance

def init_db(app):
    """Initialize database with app config"""
    uri = app.config['MONGODB_URI']
    return db_instance.connect(uri)
