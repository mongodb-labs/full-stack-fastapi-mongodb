from typing import Dict

from fastapi.testclient import TestClient
from motor.core import AgnosticDatabase
import pytest

from app import crud
from app.core.config import settings
from app.schemas.user import UserCreate
from app.tests.utils.utils import random_email, random_lower_string


@pytest.mark.asyncio
async def test_get_users_superuser_me(client: TestClient, superuser_token_headers: Dict[str, str]) -> None:
    r = client.get(f"{settings.API_V1_STR}/users/", headers=superuser_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["is_superuser"]
    assert current_user["email"] == settings.FIRST_SUPERUSER


@pytest.mark.asyncio
async def test_get_users_normal_user_me(client: TestClient, normal_user_token_headers: Dict[str, str]) -> None:
    r = client.get(f"{settings.API_V1_STR}/users/", headers=normal_user_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["is_superuser"] is False
    assert current_user["email"] == settings.EMAIL_TEST_USER


@pytest.mark.asyncio
async def test_create_user_new_email(client: TestClient, superuser_token_headers: dict, db: AgnosticDatabase) -> None:
    username = random_email()
    password = random_lower_string()
    data = {"email": username, "password": password}
    r = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json=data,
    )
    assert 200 <= r.status_code < 300
    created_user = r.json()
    user = await crud.user.get_by_email(db, email=username)
    assert user
    assert user.email == created_user["email"]


@pytest.mark.asyncio
async def test_create_user_existing_username(
    client: TestClient, superuser_token_headers: dict, db: AgnosticDatabase
) -> None:
    username = random_email()
    # username = email
    password = random_lower_string()
    user_in = UserCreate(email=username, password=password)
    await crud.user.create(db, obj_in=user_in)
    data = {"email": username, "password": password}
    r = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json=data,
    )
    created_user = r.json()
    assert r.status_code == 400
    assert "_id" not in created_user


@pytest.mark.asyncio
async def test_retrieve_users(client: TestClient, superuser_token_headers: dict, db: AgnosticDatabase) -> None:
    username = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=username, password=password)
    await crud.user.create(db, obj_in=user_in)

    username2 = random_email()
    password2 = random_lower_string()
    user_in2 = UserCreate(email=username2, password=password2)
    await crud.user.create(db, obj_in=user_in2)

    r = client.get(f"{settings.API_V1_STR}/users/all", headers=superuser_token_headers)
    all_users = r.json()

    assert len(all_users) > 1
    for item in all_users:
        assert "email" in item
