"""
Управление несколькими ботами Telegram
"""

from typing import List, Dict, Optional
from datetime import datetime
from .config import TelegramBotConfig, bot_manager
from .bot import SupportTelegramBot, bot_controller

class BotAccountManager:
    """Менеджер для управления ботами как отдельными аккаунтами"""
    
    def __init__(self):
        self.bot_accounts: Dict[str, Dict] = {}
        self._load_accounts()
    
    def _load_accounts(self):
        """Загрузка конфигураций ботов как аккаунтов"""
        for bot_name, bot_config in bot_manager.bots.items():
            self.bot_accounts[bot_name] = {
                'config': bot_config,
                'status': 'stopped',  # stopped, running, error
                'last_error': None,
                'start_time': None,
                'stop_time': None
            }
    
    def get_account_status(self, bot_name: str) -> Optional[Dict]:
        """Получить статус аккаунта бота"""
        return self.bot_accounts.get(bot_name)
    
    async def start_account(self, bot_name: str) -> bool:
        """Запуск аккаунта бота"""
        if bot_name not in self.bot_accounts:
            return False
        
        bot = bot_controller.get_bot(bot_name)
        if not bot:
            return False
        
        try:
            await bot.start()
            self.bot_accounts[bot_name]['status'] = 'running'
            self.bot_accounts[bot_name]['start_time'] = datetime.now()
            self.bot_accounts[bot_name]['last_error'] = None
            return True
        except Exception as e:
            self.bot_accounts[bot_name]['status'] = 'error'
            self.bot_accounts[bot_name]['last_error'] = str(e)
            return False
    
    async def stop_account(self, bot_name: str) -> bool:
        """Остановка аккаунта бота"""
        if bot_name not in self.bot_accounts:
            return False
        
        bot = bot_controller.get_bot(bot_name)
        if not bot:
            return False
        
        try:
            await bot.stop()
            self.bot_accounts[bot_name]['status'] = 'stopped'
            self.bot_accounts[bot_name]['stop_time'] = datetime.now()
            return True
        except Exception as e:
            self.bot_accounts[bot_name]['status'] = 'error'
            self.bot_accounts[bot_name]['last_error'] = str(e)
            return False
    
    def get_all_accounts(self) -> List[Dict]:
        """Получить список всех аккаунтов"""
        return list(self.bot_accounts.values())
    
    def get_active_accounts(self) -> List[Dict]:
        """Получить список активных аккаунтов"""
        return [account for account in self.bot_accounts.values() if account['status'] == 'running']
    
    def get_stopped_accounts(self) -> List[Dict]:
        """Получить список остановленных аккаунтов"""
        return [account for account in self.bot_accounts.values() if account['status'] == 'stopped']
    
    def get_error_accounts(self) -> List[Dict]:
        """Получить список аккаунтов с ошибками"""
        return [account for account in self.bot_accounts.values() if account['status'] == 'error']

# Глобальный экземпляр менеджера аккаунтов
account_manager = BotAccountManager()
