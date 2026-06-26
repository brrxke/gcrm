"""
Telegram bot management API routes
"""

from flask import Blueprint, request, jsonify
import asyncio
import threading
from .config import bot_manager, TelegramBotConfig
from .bot import bot_controller
from .management import account_manager
from shared.middleware.auth import jwt_required_custom, admin_required
import logging

telegram_bp = Blueprint('telegram', __name__)
logger = logging.getLogger(__name__)

def _run_async(coro):
    """Run async coroutine in a new event loop (thread-safe for Flask sync routes)"""
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return loop.run_until_complete(coro)
    finally:
        loop.close()

@telegram_bp.route('/bots', methods=['GET'])
@admin_required
def get_bots():
    bots = []
    for bot_name, bot_config in bot_manager.bots.items():
        account_status = account_manager.get_account_status(bot_name)
        bots.append({
            'name': bot_config.name,
            'description': bot_config.description,
            'is_active': bot_config.is_active,
            'status': account_status['status'] if account_status else 'unknown',
            'last_error': account_status['last_error'] if account_status else None
        })
    return jsonify(bots)

@telegram_bp.route('/bots/<bot_name>/start', methods=['POST'])
@admin_required
def start_bot(bot_name):
    if bot_name not in bot_manager.bots:
        return jsonify({'error': 'Bot not found'}), 404

    started = _run_async(account_manager.start_account(bot_name))
    if not started:
        status = account_manager.get_account_status(bot_name)
        return jsonify({
            'error': f'Failed to start bot {bot_name}',
            'last_error': status['last_error'] if status else None
        }), 500
    return jsonify({'message': f'Bot {bot_name} started'})

@telegram_bp.route('/bots/<bot_name>/stop', methods=['POST'])
@admin_required
def stop_bot(bot_name):
    if bot_name not in bot_manager.bots:
        return jsonify({'error': 'Bot not found'}), 404

    stopped = _run_async(account_manager.stop_account(bot_name))
    if not stopped:
        status = account_manager.get_account_status(bot_name)
        return jsonify({
            'error': f'Failed to stop bot {bot_name}',
            'last_error': status['last_error'] if status else None
        }), 500
    return jsonify({'message': f'Bot {bot_name} stopped'})

@telegram_bp.route('/bots/<bot_name>/status', methods=['GET'])
@admin_required
def get_bot_status(bot_name):
    account_status = account_manager.get_account_status(bot_name)
    if not account_status:
        return jsonify({'error': 'Bot not found'}), 404
    
    return jsonify({
        'name': bot_name,
        'status': account_status['status'],
        'last_error': account_status['last_error'],
        'start_time': account_status['start_time'],
        'stop_time': account_status['stop_time']
    })

@telegram_bp.route('/bots', methods=['POST'])
@admin_required
def create_bot():
    data = request.get_json(silent=True) or {}
    required_fields = ['name', 'token']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    bot_name = data['name']
    if bot_name in bot_manager.bots:
        return jsonify({'error': 'Bot already exists'}), 400

    try:
        admin_chat_id = int(data['admin_chat_id']) if data.get('admin_chat_id') is not None else None
        support_chat_id = int(data['support_chat_id']) if data.get('support_chat_id') is not None else None
    except (TypeError, ValueError):
        return jsonify({'error': 'admin_chat_id and support_chat_id must be integers'}), 400
    
    config = TelegramBotConfig(
        name=bot_name,
        token=data['token'],
        description=data.get('description', ''),
        admin_chat_id=admin_chat_id,
        support_chat_id=support_chat_id
    )
    
    bot_manager.add_bot(config)
    return jsonify({'message': f'Bot {bot_name} created'}), 201

@telegram_bp.route('/bots/<bot_name>', methods=['DELETE'])
@admin_required
def delete_bot(bot_name):
    if bot_name not in bot_manager.bots:
        return jsonify({'error': 'Bot not found'}), 404
    
    bot_manager.remove_bot(bot_name)
    return jsonify({'message': f'Bot {bot_name} deleted'})
