import os
from werkzeug.utils import secure_filename
from PIL import Image
import uuid

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, upload_folder, resize_image=False):
    """
    Save uploaded file
    Args:
        file: Flask file object
        upload_folder: Folder to save file
        resize_image: Whether to resize image (for profile pictures)
    Returns:
        filename: Saved filename or None if error
    """
    if not file or file.filename == '':
        return None
    
    if not allowed_file(file.filename):
        return None
    
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(upload_folder, filename)
    
    # Create upload folder if it doesn't exist
    os.makedirs(upload_folder, exist_ok=True)
    
    # Save file
    file.save(filepath)
    
    # Resize image if needed
    if resize_image and ext in ['png', 'jpg', 'jpeg']:
        try:
            img = Image.open(filepath)
            # Resize to max 500x500 while maintaining aspect ratio
            img.thumbnail((500, 500), Image.Resampling.LANCZOS)
            img.save(filepath, quality=85, optimize=True)
        except Exception as e:
            print(f"Error resizing image: {e}")
    
    return filename

def delete_file(filename, upload_folder):
    """Delete a file"""
    if not filename:
        return False
    
    filepath = os.path.join(upload_folder, filename)
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            return True
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    return False

def validate_file_size(file):
    """Validate file size"""
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    return size <= MAX_FILE_SIZE
