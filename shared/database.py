from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson.objectid import ObjectId
import os

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self, uri, max_pool_size=100, min_pool_size=10):
        self.client = MongoClient(
            uri,
            maxPoolSize=max_pool_size,
            minPoolSize=min_pool_size,
            maxIdleTimeMS=60000,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            retryWrites=True,
            retryReads=True,
            w='majority'
        )
        try:
            self.client.admin.command('ping')
            db_name = os.getenv('MONGODB_DB', 'gcrm')
            self.db = self.client.get_database(db_name)
            return True
        except Exception:
            return False

    def get_collection(self, collection_name):
        if self.db is None:
            raise Exception("Database not connected")
        return self.db[collection_name]

    def close(self):
        if self.client:
            self.client.close()

db_instance = Database()

def get_db():
    return db_instance

def init_db(app):
    uri = app.config['MONGODB_URI']
    return db_instance.connect(uri)
