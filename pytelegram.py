"""
Отдельный запуск Telegram-ботов проекта.
"""

import asyncio
import signal
import logging

from shared.routes.telegram.bot import bot_controller

logger = logging.getLogger(__name__)


async def _run() -> None:
    await bot_controller.start_all_bots()
    logger.info("Все активные Telegram-боты запущены")

    stop_event = asyncio.Event()

    def _stop_handler(*_args):
        stop_event.set()

    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, _stop_handler)
        except NotImplementedError:
            # Например, на некоторых платформах loop может не поддерживать сигналы.
            pass

    await stop_event.wait()
    await bot_controller.stop_all_bots()
    logger.info("Telegram-боты корректно остановлены")


if __name__ == "__main__":
    try:
        asyncio.run(_run())
    except KeyboardInterrupt:
        pass
