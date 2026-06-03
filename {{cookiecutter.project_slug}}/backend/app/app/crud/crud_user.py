from typing import Any, Dict, Union

from pymongo.asynchronous.database import AsyncDatabase

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, UserUpdate
from app.schemas.totp import NewTOTP


# ODM, Schema, Schema
class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncDatabase, *, email: str) -> User | None: # noqa
        doc = await self._collection(db).find_one({"email": email})
        return self._from_mongo(doc) if doc else None

    async def create(self, db: AsyncDatabase, *, obj_in: UserCreate) -> User: # noqa
        # TODO: Figure out what happens when you have a unique key like 'email'
        user_data = {
            **obj_in.model_dump(),
            "email": obj_in.email,
            "hashed_password": get_password_hash(obj_in.password) if obj_in.password is not None else None, # noqa
            "full_name": obj_in.full_name,
            "is_superuser": obj_in.is_superuser,
        }
        db_obj = User(**user_data)
        await self._collection(db).insert_one(self._to_mongo(db_obj))
        return db_obj

    async def update(self, db: AsyncDatabase, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]) -> User: # noqa
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        if update_data.get("email") and db_obj.email != update_data["email"]:
            update_data["email_validated"] = False
        return await super().update(db, db_obj=db_obj, obj_in=update_data)

    async def authenticate(self, db: AsyncDatabase, *, email: str, password: str) -> User | None: # noqa
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(plain_password=password, hashed_password=user.hashed_password): # noqa
            return None
        return user

    async def validate_email(self, db: AsyncDatabase, *, db_obj: User) -> User: # noqa
        obj_in = UserUpdate(**UserInDB.model_validate(db_obj).model_dump())
        obj_in.email_validated = True
        return await self.update(db=db, db_obj=db_obj, obj_in=obj_in)

    async def activate_totp(self, db: AsyncDatabase, *, db_obj: User, totp_in: NewTOTP) -> User: # noqa
        obj_in = UserUpdate(**UserInDB.model_validate(db_obj).model_dump())
        obj_in = obj_in.model_dump(exclude_unset=True)
        obj_in["totp_secret"] = totp_in.secret
        return await self.update(db=db, db_obj=db_obj, obj_in=obj_in)

    async def deactivate_totp(self, db: AsyncDatabase, *, db_obj: User) -> User: # noqa
        obj_in = UserUpdate(**UserInDB.model_validate(db_obj).model_dump())
        obj_in = obj_in.model_dump(exclude_unset=True)
        obj_in["totp_secret"] = None
        obj_in["totp_counter"] = None
        return await self.update(db=db, db_obj=db_obj, obj_in=obj_in)

    async def update_totp_counter(self, db: AsyncDatabase, *, db_obj: User, new_counter: int) -> User:  # noqa
        obj_in = UserUpdate(**UserInDB.model_validate(db_obj).model_dump())
        obj_in = obj_in.model_dump(exclude_unset=True)
        obj_in["totp_counter"] = new_counter
        return await self.update(db=db, db_obj=db_obj, obj_in=obj_in)

    async def toggle_user_state(self, db: AsyncDatabase, *, obj_in: Union[UserUpdate, Dict[str, Any]]) -> User: # noqa
        db_obj = await self.get_by_email(db, email=obj_in.email)
        if not db_obj:
            return None
        return await self.update(db=db, db_obj=db_obj, obj_in=obj_in)

    @staticmethod
    def has_password(user: User) -> bool:
        return user.hashed_password is not None

    @staticmethod
    def is_active(user: User) -> bool:
        return user.is_active

    @staticmethod
    def is_superuser(user: User) -> bool:
        return user.is_superuser

    @staticmethod
    def is_email_validated(user: User) -> bool:
        return user.email_validated


user = CRUDUser(User)
