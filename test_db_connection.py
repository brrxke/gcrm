#!/usr/bin/env python3
"""
MongoDB connection test script
Tests database connection and displays connection info
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Database
from dotenv import load_dotenv

def test_connection():
    """Test MongoDB connection"""
    print("\n🔌 Testing MongoDB connection...\n")
    
    # Load environment variables
    load_dotenv()
    
    # Get MongoDB URI from environment
    uri = os.getenv('MONGODB_URI')
    
    if not uri:
        print("MONGODB_URI not found in .env file")
        print("   Please set MONGODB_URI in your .env file")
        return False
    
    print(f"📍 Connection URI: {uri}")
    print()
    
    # Create database instance and connect
    db = Database()
    
    if db.connect(uri):
        print("\nConnection test PASSED!")
        print()
        
        # Get database info
        try:
            db_name = db.db.name
            collections = db.db.list_collection_names()
            
            print(f"📊 Database: {db_name}")
            print(f"📁 Collections: {len(collections)}")
            
            if collections:
                print("   Collections:")
                for collection in collections:
                    count = db.db[collection].count_documents({})
                    print(f"      - {collection}: {count} documents")
            else:
                print("   (empty database)")
        except Exception as e:
            print(f"⚠️  Could not get database info: {e}")
        
        print()
        db.close()
        return True
    else:
        print("\n❌ Connection test FAILED!")
        print("   Please check:")
        print("   1. MongoDB is running")
        print("   2. MONGODB_URI in .env is correct")
        print("   3. Network/firewall allows connection")
        print()
        return False

if __name__ == '__main__':
    success = test_connection()
    sys.exit(0 if success else 1)
