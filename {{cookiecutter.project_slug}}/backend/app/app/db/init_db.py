from pymongo.database import Database
from beanie import init_beanie

from app import crud, schemas
from app.core.config import settings
from app.models import MODELS


async def init_db(db: Database) -> None:
    await init_beanie(db, document_models=MODELS)
    user = await crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER)
    if not user:
        # Create user auth
        user_in = schemas.UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
            full_name=settings.FIRST_SUPERUSER,
        )
        user = await crud.user.create(db, obj_in=user_in)  # noqa: F841
