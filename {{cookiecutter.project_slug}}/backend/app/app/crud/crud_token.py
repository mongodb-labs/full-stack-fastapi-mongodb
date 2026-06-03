from __future__ import annotations
from pymongo.asynchronous.database import AsyncDatabase

from app.crud.base import CRUDBase
from app.models import User, Token
from app.schemas import RefreshTokenCreate, RefreshTokenUpdate
from app.core.config import settings


class CRUDToken(CRUDBase[Token, RefreshTokenCreate, RefreshTokenUpdate]):
    # Everything is user-dependent
    async def create(self, db: AsyncDatabase, *, obj_in: str, user_obj: User) -> Token:
        db_obj = await self._collection(db).find_one({"token": obj_in})
        if db_obj:
            db_obj = self._from_mongo(db_obj)
            if db_obj.authenticates_id != user_obj.id:
                raise ValueError("Token mismatch between key and user.")
            return db_obj
        else:
            new_token = self.model(token=obj_in, authenticates_id=user_obj.id)
            user_obj.refresh_tokens.append(new_token.id)
            await self._collection(db).insert_one(self._to_mongo(new_token))
            await db[User.__collection__].replace_one({"_id": user_obj.id}, user_obj.to_mongo())
            return new_token

    async def get(self, db: AsyncDatabase, *, user: User, token: str) -> Token | None:
        doc = await self._collection(db).find_one({"token": token, "authenticates_id": user.id})
        return self._from_mongo(doc) if doc else None

    async def get_multi(self, db: AsyncDatabase, *, user: User, page: int = 0, page_break: bool = False) -> list[Token]:
        offset = {"skip": page * settings.MULTI_MAX, "limit": settings.MULTI_MAX} if page_break else {}
        return [self._from_mongo(doc) async for doc in self._collection(db).find({"authenticates_id": user.id}, **offset)]

    async def remove(self, db: AsyncDatabase, *, db_obj: Token) -> None:
        async for user in db[User.__collection__].find({"refresh_tokens": db_obj.id}):
            user = User.model_validate(user)
            user.refresh_tokens.remove(db_obj.id)
            await db[User.__collection__].replace_one({"_id": user.id}, user.to_mongo())
        await self._collection(db).delete_one({"_id": db_obj.id})


token = CRUDToken(Token)
