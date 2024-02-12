import asyncio
from typing import Dict, Generator

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from motor.core import AgnosticDatabase

from app.core.config import settings
from app.db.init_db import init_db
from app.main import app
from app.db.session import MongoDatabase, _MongoClientSingleton
from app.tests.utils.user import authentication_token_from_email
from app.tests.utils.utils import get_superuser_token_headers

TEST_DATABASE = "test"
settings.MONGO_DATABASE = TEST_DATABASE


@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def db() -> Generator:
    db = MongoDatabase()
    _MongoClientSingleton.instance.mongo_client.get_io_loop = asyncio.get_event_loop
    await init_db(db)
    yield db


@pytest.fixture(scope="session")
def client(db) -> Generator:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    return get_superuser_token_headers(client)


@pytest_asyncio.fixture(scope="module")
async def normal_user_token_headers(client: TestClient, db: AgnosticDatabase) -> Dict[str, str]:
    return await authentication_token_from_email(client=client, email=settings.EMAIL_TEST_USER, db=db)
