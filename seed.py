#!/usr/bin/env python3
"""
Database seeding script
This script populates the database with initial test data
"""

import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db, init_db
from models.user import User
from models.membership import Membership
from models.booking import Booking
from models.feedback import Feedback
from models.visit import Visit
from config import config

def seed_memberships():
    """Seed membership plans"""
    print("🏋️  Seeding memberships...")
    
    memberships = [
        {
            'name': 'Starter',
            'price': 29.0,
            'duration': 1,
            'features': [
                'Gym Access',
                'Basic Equipment',
                'Locker Room'
            ],
            'description': 'Perfect for beginners'
        },
        {
            'name': 'Premium',
            'price': 59.0,
            'duration': 1,
            'features': [
                'Gym Access',
                'All Equipment',
                'Locker Room',
                'Group Classes',
                'Personal Trainer (2 sessions/month)'
            ],
            'description': 'Most popular choice'
        },
        {
            'name': 'Elite',
            'price': 99.0,
            'duration': 1,
            'features': [
                'Gym Access',
                'All Equipment',
                'Locker Room',
                'Unlimited Group Classes',
                'Personal Trainer (unlimited)',
                'Nutrition Plan',
                'Sauna & Spa'
            ],
            'description': 'Premium experience'
        }
    ]
    
    for membership in memberships:
        try:
            Membership.create(membership)
            print(f"  ✓ Created {membership['name']} membership")
        except Exception as e:
            print(f"  ✗ Error creating {membership['name']}: {e}")

def seed_users():
    """Seed users"""
    print("👥 Seeding users...")
    
    users = [
        {
            'name': 'Admin User',
            'email': 'admin@gym.com',
            'password': 'admin123',
            'role': 'admin',
            'phone': '+1234567890'
        },
        {
            'name': 'John Warrior',
            'email': 'john@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+1234567891',
            'membership': 'Premium',
            'membership_status': 'active',
            'expiry_date': datetime.utcnow() + timedelta(days=180)
        },
        {
            'name': 'Sarah Strong',
            'email': 'sarah@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+1234567892',
            'membership': 'Elite',
            'membership_status': 'active',
            'expiry_date': datetime.utcnow() + timedelta(days=300)
        },
        {
            'name': 'Mike Power',
            'email': 'mike@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+1234567893',
            'membership': 'Starter',
            'membership_status': 'expired',
            'expiry_date': datetime.utcnow() - timedelta(days=30)
        },
        {
            'name': 'Emma Fitness',
            'email': 'emma@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+1234567894',
            'membership': 'Premium',
            'membership_status': 'active',
            'expiry_date': datetime.utcnow() + timedelta(days=120)
        },
        {
            'name': 'Alex Beast',
            'email': 'alex@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+1234567895',
            'membership': 'Trial',
            'membership_status': 'trial',
            'expiry_date': datetime.utcnow() + timedelta(days=7)
        }
    ]
    
    user_ids = []
    for user in users:
        try:
            user_id = User.create(user)
            user_ids.append(user_id)
            print(f"  ✓ Created user: {user['email']}")
        except Exception as e:
            print(f"  ✗ Error creating user {user['email']}: {e}")
    
    return user_ids

def seed_visits(user_ids):
    """Seed visit data"""
    print("📊 Seeding visits...")
    
    import random
    
    # Create visits for the past 7 days
    for i in range(7):
        day = datetime.utcnow() - timedelta(days=6-i)
        # Random number of visits per day (30-50)
        num_visits = random.randint(30, 50)
        
        for _ in range(num_visits):
            try:
                # Random user from client users (skip admin)
                user_id = random.choice(user_ids[1:])
                # Random hour between 6 and 22
                hour = random.randint(6, 22)
                
                # Override datetime for past days
                visit_time = day.replace(hour=hour, minute=random.randint(0, 59))
                
                db = get_db()
                collection = db.get_collection('visits')
                collection.insert_one({
                    'user_id': user_id,
                    'timestamp': visit_time,
                    'date': visit_time.date().isoformat(),
                    'hour': visit_time.hour
                })
            except Exception as e:
                pass
    
    print(f"  ✓ Created visit records")

def seed_feedback(user_ids):
    """Seed feedback"""
    print("💬 Seeding feedback...")
    
    feedback_data = [
        {
            'user_id': user_ids[1],
            'rating': 5,
            'category': 'equipment',
            'comment': 'Great equipment and facilities!',
            'suggestions': 'Maybe add more cardio machines'
        },
        {
            'user_id': user_ids[2],
            'rating': 4,
            'category': 'cleanliness',
            'comment': 'Very clean and well-maintained',
            'suggestions': ''
        },
        {
            'user_id': user_ids[4],
            'rating': 5,
            'category': 'staff',
            'comment': 'Staff is very helpful and professional',
            'suggestions': 'Everything is perfect'
        }
    ]
    
    for feedback in feedback_data:
        try:
            Feedback.create(feedback)
            print(f"  ✓ Created feedback")
        except Exception as e:
            print(f"  ✗ Error creating feedback: {e}")

def main():
    """Main seeding function"""
    print("\n🌱 Starting database seeding...\n")
    
    # Initialize database
    from app import create_app
    app = create_app()
    
    with app.app_context():
        # Seed data
        seed_memberships()
        user_ids = seed_users()
        seed_visits(user_ids)
        seed_feedback(user_ids)
    
    print("\n✅ Database seeding completed!\n")
    print("📝 Test credentials:")
    print("   Admin: admin@gym.com / admin123")
    print("   Client: john@example.com / password123")
    print("\n")

if __name__ == '__main__':
    main()
