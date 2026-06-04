import asyncio

from app.core.config import settings
from app.__version__ import __version__
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.driver_info import DriverInfo

DRIVER_INFO = DriverInfo(name="full-stack-fastapi-mongodb", version=__version__)


class _MongoClientSingleton:
    _instances: dict = {}

    def __new__(cls):
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None
        loop_id = id(loop)
        if loop_id not in cls._instances:
            instance = super().__new__(cls)
            instance.mongo_client = AsyncMongoClient(
                settings.MONGO_DATABASE_URI, driver=DRIVER_INFO
            )
            cls._instances[loop_id] = instance
        return cls._instances[loop_id]


def MongoDatabase() -> AsyncDatabase:
    return _MongoClientSingleton().mongo_client[settings.MONGO_DATABASE]


async def ping():
    await MongoDatabase().command("ping")


__all__ = ["MongoDatabase", "ping"]
