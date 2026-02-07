from marshmallow import Schema, fields, validate, validates, ValidationError
import re

class UserRegistrationSchema(Schema):
    """Schema for user registration"""
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    phone = fields.Str(validate=validate.Length(max=20))
    age = fields.Int(validate=validate.Range(min=12, max=120))
    role = fields.Str(validate=validate.OneOf(['client', 'admin']))

class UserLoginSchema(Schema):
    """Schema for user login"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class UserUpdateSchema(Schema):
    """Schema for user profile update"""
    name = fields.Str(validate=validate.Length(min=2, max=100))
    phone = fields.Str(validate=validate.Length(max=20))
    age = fields.Int(validate=validate.Range(min=12, max=120))
    membership = fields.Str()
    membership_status = fields.Str(validate=validate.OneOf(['active', 'expired', 'trial', 'inactive']))
    expiry_date = fields.DateTime()

class MembershipSchema(Schema):
    """Schema for membership plans"""
    name = fields.Str(required=True, validate=validate.Length(min=2, max=50))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    duration = fields.Int(required=True, validate=validate.Range(min=1, max=36))
    features = fields.List(fields.Str(), required=True)
    description = fields.Str(validate=validate.Length(max=500))
    is_active = fields.Bool()

class BookingSchema(Schema):
    """Schema for trial bookings"""
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    phone = fields.Str(validate=validate.Length(max=20))
    date = fields.Date(required=True)
    time = fields.Str(required=True)
    notes = fields.Str(validate=validate.Length(max=500))
    
    @validates('time')
    def validate_time(self, value):
        """Validate time format HH:MM"""
        if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', value):
            raise ValidationError('Time must be in HH:MM format')

class FeedbackSchema(Schema):
    """Schema for feedback"""
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    category = fields.Str(validate=validate.Length(max=50))
    comment = fields.Str(validate=validate.Length(max=1000))
    suggestions = fields.Str(validate=validate.Length(max=1000))

class MessageSchema(Schema):
    """Schema for chat messages"""
    receiver_id = fields.Str(required=True)
    message = fields.Str(required=True, validate=validate.Length(min=1, max=1000))

# Initialize schemas
user_registration_schema = UserRegistrationSchema()
user_login_schema = UserLoginSchema()
user_update_schema = UserUpdateSchema()
membership_schema = MembershipSchema()
booking_schema = BookingSchema()
feedback_schema = FeedbackSchema()
message_schema = MessageSchema()
