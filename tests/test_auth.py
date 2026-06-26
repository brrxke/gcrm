import pytest
from unittest.mock import patch, MagicMock


class TestAuth:
    def test_health_check(self, client):
        resp = client.get('/health')
        assert resp.status_code == 200
        data = resp.get_json()
        assert data['status'] == 'healthy'

    def test_register_success(self, client):
        with patch('shared.models.user.User.find_by_email', return_value=None), \
             patch('shared.models.user.User.create', return_value='507f1f77bcf86cd799439011'):
            resp = client.post('/api/auth/register', json={
                'name': 'Test User',
                'email': 'test@example.com',
                'password': 'StrongP@ss1'
            })
            assert resp.status_code == 201
            data = resp.get_json()
            assert 'access_token' in data
            assert 'refresh_token' in data

    def test_register_weak_password(self, client):
        resp = client.post('/api/auth/register', json={
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'short'
        })
        assert resp.status_code == 400
        data = resp.get_json()
        assert 'messages' in data

    def test_register_duplicate_email(self, client):
        with patch('shared.models.user.User.find_by_email', return_value={'_id': 'existing'}):
            resp = client.post('/api/auth/register', json={
                'name': 'Test User',
                'email': 'existing@example.com',
                'password': 'StrongP@ss1'
            })
            assert resp.status_code == 400
            data = resp.get_json()
            assert 'already registered' in data['error']

    def test_login_success(self, client):
        mock_user = {
            '_id': '507f1f77bcf86cd799439011',
            'email': 'test@example.com',
            'password': b'$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qlq5yHm5gQ5Ej5q5Z5q5Z5q5Z5q',
            'name': 'Test User',
            'role': 'client'
        }
        with patch('shared.models.user.User.find_by_email', return_value=mock_user), \
             patch('shared.models.user.User.verify_password', return_value=True):
            resp = client.post('/api/auth/login', json={
                'email': 'test@example.com',
                'password': 'StrongP@ss1'
            })
            assert resp.status_code == 200
            data = resp.get_json()
            assert 'access_token' in data
            assert 'refresh_token' in data
            assert 'user' in data
            assert 'password' not in data['user']

    def test_login_invalid_credentials(self, client):
        with patch('shared.models.user.User.find_by_email', return_value=None):
            resp = client.post('/api/auth/login', json={
                'email': 'wrong@example.com',
                'password': 'StrongP@ss1'
            })
            assert resp.status_code == 401

    def test_login_wrong_password(self, client):
        with patch('shared.models.user.User.find_by_email', return_value={'password': 'hash'}):
            with patch('shared.models.user.User.verify_password', return_value=False):
                resp = client.post('/api/auth/login', json={
                    'email': 'test@example.com',
                    'password': 'WrongP@ss1'
                })
                assert resp.status_code == 401
