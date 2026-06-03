import asyncio
from typing import AsyncGenerator, Dict, Generator

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from app.core.config import settings
from app.db.init_db import init_db
from app.main import app
from app.db.session import DRIVER_INFO, MongoDatabase
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers

TEST_DATABASE = "test"
settings.MONGO_DATABASE = TEST_DATABASE


@pytest.fixture(scope="session")
def event_loop_policy():
    return asyncio.DefaultEventLoopPolicy()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def _init_db() -> AsyncGenerator:
    """Seed the test database once per session."""
    db = MongoDatabase()
    await init_db(db)
    yield


@pytest_asyncio.fixture
async def db() -> AsyncGenerator:
    """Fresh per-test database handle with its own client to avoid cross-loop issues."""
    client = AsyncMongoClient(settings.MONGO_DATABASE_URI, driver=DRIVER_INFO)
    database = client[settings.MONGO_DATABASE]
    yield database
    await client.close()


@pytest.fixture(scope="session")
def client() -> Generator:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    return get_superuser_token_headers(client)


@pytest_asyncio.fixture
async def normal_user_token_headers(client: TestClient) -> Dict[str, str]:
    client_conn = AsyncMongoClient(settings.MONGO_DATABASE_URI, driver=DRIVER_INFO)
    db = client_conn[settings.MONGO_DATABASE]
    try:
        return await authentication_token_from_email(
            client=client, email=settings.EMAIL_TEST_USER, db=db
        )
    finally:
        await client_conn.close()
