import os
import sys
import pytest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

os.environ['FLASK_ENV'] = 'testing'
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-for-testing'
os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/test_gym_crm'
os.environ['ADMIN_SETUP_TOKEN'] = 'test-admin-token'


@pytest.fixture(autouse=True)
def mock_db():
    with patch('shared.database.get_db') as mock_get_db:
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        yield mock_db


@pytest.fixture
def app():
    from apps.services.auth.app import create_app as create_auth_app
    app = create_auth_app()
    app.config['TESTING'] = True
    return app


@pytest.fixture
def client(app):
    return app.test_client()
