"""
Основной модуль Telegram ботов для технической поддержки
"""

import logging
from typing import Optional, Dict, Any
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
from .config import bot_manager, TelegramBotConfig

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class SupportTelegramBot:
    """Класс для работы с Telegram ботом технической поддержки"""
    
    def __init__(self, config: TelegramBotConfig):
        self.config = config
        self.application: Optional[Application] = None
        self.bot: Optional[Bot] = None
    
    async def start(self):
        """Запуск бота"""
        try:
            self.application = Application.builder().token(self.config.token).build()
            self.bot = self.application.bot
            
            # Регистрация обработчиков
            self._register_handlers()
            
            # Запуск бота
            await self.application.initialize()
            await self.application.start()
            logger.info(f"Бот {self.config.name} запущен")
            
        except Exception as e:
            logger.error(f"Ошибка при запуске бота {self.config.name}: {e}")
            raise
    
    async def stop(self):
        """Остановка бота"""
        if self.application:
            await self.application.stop()
            await self.application.shutdown()
            logger.info(f"Бот {self.config.name} остановлен")
    
    def _register_handlers(self):
        """Регистрация обработчиков команд и сообщений"""
        # Обработчик команды /start
        self.application.add_handler(CommandHandler("start", self._start_command))
        
        # Обработчик текстовых сообщений
        self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self._text_message))
        
        # Обработчик всех остальных сообщений
        self.application.add_handler(MessageHandler(filters.ALL, self._unknown_message))
    
    async def _start_command(self, update: Update, context: CallbackContext):
        """Обработчик команды /start"""
        user = update.effective_user
        await update.message.reply_text(
            f"Привет, {user.first_name}! Я бот технической поддержки. "
            f"Чем я могу вам помочь?"
        )
    
    async def _text_message(self, update: Update, context: CallbackContext):
        """Обработчик текстовых сообщений"""
        text = update.message.text
        chat_id = update.effective_chat.id
        user = update.effective_user
        
        # Логирование сообщения
        logger.info(f"Получено сообщение от {user.username or user.first_name}: {text}")
        
        # Простой ответ
        await update.message.reply_text(
            f"Спасибо за ваше сообщение! Мы обработаем его как можно скорее."
        )
    
    async def _unknown_message(self, update: Update, context: CallbackContext):
        """Обработчик неизвестных сообщений"""
        await update.message.reply_text("Извините, я не понимаю эту команду.")
    
    async def send_admin_message(self, message: str):
        """Отправка сообщения администратору"""
        if self.config.admin_chat_id and self.bot:
            try:
                await self.bot.send_message(
                    chat_id=self.config.admin_chat_id,
                    text=message
                )
                return True
            except Exception as e:
                logger.error(f"Ошибка при отправке сообщения администратору: {e}")
                return False
        return False
    
    async def send_support_message(self, message: str):
        """Отправка сообщения в чат поддержки"""
        if self.config.support_chat_id and self.bot:
            try:
                await self.bot.send_message(
                    chat_id=self.config.support_chat_id,
                    text=message
                )
                return True
            except Exception as e:
                logger.error(f"Ошибка при отправке сообщения в поддержку: {e}")
                return False
        return False

class TelegramBotController:
    """Контроллер для управления всеми ботами"""
    
    def __init__(self):
        self.bots: Dict[str, SupportTelegramBot] = {}
        self._load_bots()
    
    def _load_bots(self):
        """Загрузка и инициализация всех ботов"""
        for bot_config in bot_manager.get_active_bots():
            try:
                bot = SupportTelegramBot(bot_config)
                self.bots[bot_config.name] = bot
                logger.info(f"Бот {bot_config.name} загружен")
            except Exception as e:
                logger.error(f"Ошибка при загрузке бота {bot_config.name}: {e}")
    
    async def start_all_bots(self):
        """Запуск всех ботов"""
        for bot_name, bot in self.bots.items():
            try:
                await bot.start()
            except Exception as e:
                logger.error(f"Ошибка при запуске бота {bot_name}: {e}")
    
    async def stop_all_bots(self):
        """Остановка всех ботов"""
        for bot_name, bot in self.bots.items():
            try:
                await bot.stop()
            except Exception as e:
                logger.error(f"Ошибка при остановке бота {bot_name}: {e}")
    
    def get_bot(self, bot_name: str) -> Optional[SupportTelegramBot]:
        """Получить бота по имени"""
        return self.bots.get(bot_name)
    
    def get_active_bots(self) -> Dict[str, SupportTelegramBot]:
        """Получить все активные боты"""
        return self.bots

# Глобальный экземпляр контроллера ботов
bot_controller = TelegramBotController()
