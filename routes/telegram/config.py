"""
Конфигурация Telegram ботов для технической поддержки
"""

import os
from typing import Dict, List, Optional
from dataclasses import dataclass
import os
from typing import Dict, List, Optional
from dataclasses import dataclass

# Загрузка переменных окружения
def load_env():
    """Загрузка переменных окружения"""
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass  # Если dotenv не установлен, просто пропускаем

load_env()

@dataclass
class TelegramBotConfig:
    """Класс конфигурации для отдельного Telegram бота"""
    name: str
    token: str
    admin_chat_id: Optional[int] = None
    support_chat_id: Optional[int] = None
    is_active: bool = True
    description: str = ""

class TelegramBotManager:
    """Менеджер для управления несколькими Telegram ботами"""
    
    def __init__(self):
        self.bots: Dict[str, TelegramBotConfig] = {}
        self._load_bots_from_env()
    
    def _load_bots_from_env(self):
        """Загрузка конфигурации ботов из переменных окружения"""
        bot_names = os.getenv("TELEGRAM_BOT_NAMES", "").split(",")
        
        for bot_name in bot_names:
            if not bot_name:
                continue
                
            token = os.getenv(f"TELEGRAM_{bot_name.upper()}_TOKEN")
            if not token:
                continue
                
            config = TelegramBotConfig(
                name=bot_name,
                token=token,
                admin_chat_id=int(os.getenv(f"TELEGRAM_{bot_name.upper()}_ADMIN_CHAT_ID", "0")) if os.getenv(f"TELEGRAM_{bot_name.upper()}_ADMIN_CHAT_ID") else None,
                support_chat_id=int(os.getenv(f"TELEGRAM_{bot_name.upper()}_SUPPORT_CHAT_ID", "0")) if os.getenv(f"TELEGRAM_{bot_name.upper()}_SUPPORT_CHAT_ID") else None,
                description=os.getenv(f"TELEGRAM_{bot_name.upper()}_DESCRIPTION", "")
            )
            self.bots[bot_name] = config
    
    def get_bot(self, bot_name: str) -> Optional[TelegramBotConfig]:
        """Получить конфигурацию бота по имени"""
        return self.bots.get(bot_name)
    
    def get_active_bots(self) -> List[TelegramBotConfig]:
        """Получить список активных ботов"""
        return [bot for bot in self.bots.values() if bot.is_active]
    
    def add_bot(self, config: TelegramBotConfig):
        """Добавить нового бота"""
        self.bots[config.name] = config
    
    def remove_bot(self, bot_name: str):
        """Удалить бота"""
        if bot_name in self.bots:
            del self.bots[bot_name]

# Глобальный экземпляр менеджера ботов
bot_manager = TelegramBotManager()
