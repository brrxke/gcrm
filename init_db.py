#!/usr/bin/env python3
"""
Initialize database collections and indexes
Run this script to create collections and indexes manually
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Database
from db_init import init_collections, check_first_run
from dotenv import load_dotenv

def main():
    """Initialize database"""
    print("\n🔧 Database Initialization Tool\n")
    
    # Load environment variables
    load_dotenv()
    
    # Get MongoDB URI from environment
    uri = os.getenv('MONGODB_URI')
    
    if not uri:
        print("❌ MONGODB_URI not found in .env file")
        return False
    
    # Connect to database
    db = Database()
    
    print(f"📍 Connecting to MongoDB...")
    print(f"   URI: {uri}\n")
    
    if not db.connect(uri):
        print("❌ Failed to connect to database")
        return False
    
    # Check if first run
    is_first_run = check_first_run()
    
    if is_first_run:
        print("🆕 First run detected. Creating collections and indexes...\n")
        init_collections()
    else:
        print("📋 Collections already exist. Updating indexes...\n")
        init_collections()

    print("\n Current collections:")
    collections = db.db.list_collection_names()
    for col in collections:
        count = db.db[col].count_documents({})
        print(f"   - {col}: {count} documents")
    
    print("\n✅ Database initialization complete!\n")
    db.close()
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
