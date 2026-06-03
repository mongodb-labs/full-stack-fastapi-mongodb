from app.core.config import settings
from app.__version__ import __version__
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.driver_info import DriverInfo

DRIVER_INFO = DriverInfo(name="full-stack-fastapi-mongodb", version=__version__)


class _MongoClientSingleton:
    mongo_client: AsyncMongoClient | None

    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super(_MongoClientSingleton, cls).__new__(cls)
            cls.instance.mongo_client = AsyncMongoClient(
                settings.MONGO_DATABASE_URI, driver=DRIVER_INFO
            )
        return cls.instance


def MongoDatabase() -> AsyncDatabase:
    return _MongoClientSingleton().mongo_client[settings.MONGO_DATABASE]


async def ping():
    await MongoDatabase().command("ping")


__all__ = ["MongoDatabase", "ping"]
