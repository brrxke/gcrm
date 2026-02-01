"""
API маршруты для управления Telegram ботами технической поддержки
"""

from flask import Blueprint, request, jsonify
from .config import bot_manager, TelegramBotConfig
from .bot import bot_controller
from .management import account_manager
import logging

telegram_bp = Blueprint('telegram', __name__)
logger = logging.getLogger(__name__)

@telegram_bp.route('/bots', methods=['GET'])
def get_bots():
    """Получить список всех ботов"""
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
def start_bot(bot_name):
    """Запустить бота"""
    # Здесь будет логика запуска бота
    return jsonify({'message': f'Бот {bot_name} запущен'})

@telegram_bp.route('/bots/<bot_name>/stop', methods=['POST'])
def stop_bot(bot_name):
    """Остановить бота"""
    # Здесь будет логика остановки бота
    return jsonify({'message': f'Бот {bot_name} остановлен'})

@telegram_bp.route('/bots/<bot_name>/status', methods=['GET'])
def get_bot_status(bot_name):
    """Получить статус бота"""
    account_status = account_manager.get_account_status(bot_name)
    if not account_status:
        return jsonify({'error': 'Бот не найден'}), 404
    
    return jsonify({
        'name': bot_name,
        'status': account_status['status'],
        'last_error': account_status['last_error'],
        'start_time': account_status['start_time'],
        'stop_time': account_status['stop_time']
    })

@telegram_bp.route('/bots', methods=['POST'])
def create_bot():
    """Создать нового бота"""
    data = request.json
    required_fields = ['name', 'token']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Отсутствуют обязательные поля'}), 400
    
    bot_name = data['name']
    if bot_name in bot_manager.bots:
        return jsonify({'error': 'Бот с таким именем уже существует'}), 400
    
    config = TelegramBotConfig(
        name=bot_name,
        token=data['token'],
        description=data.get('description', ''),
        admin_chat_id=data.get('admin_chat_id'),
        support_chat_id=data.get('support_chat_id')
    )
    
    bot_manager.add_bot(config)
    return jsonify({'message': f'Бот {bot_name} создан'}), 201

@telegram_bp.route('/bots/<bot_name>', methods=['DELETE'])
def delete_bot(bot_name):
    """Удалить бота"""
    if bot_name not in bot_manager.bots:
        return jsonify({'error': 'Бот не найден'}), 404
    
    bot_manager.remove_bot(bot_name)
    return jsonify({'message': f'Бот {bot_name} удален'})