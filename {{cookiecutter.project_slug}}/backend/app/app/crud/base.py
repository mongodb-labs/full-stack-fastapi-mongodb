from typing import Any, Dict, Generic, Type, TypeVar, Union

from pydantic import BaseModel
from pymongo.asynchronous.database import AsyncDatabase

from app.db.base_class import Base
from app.core.config import settings

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def _collection(self, db: AsyncDatabase):
        return db[self.model.__collection__]

    def _from_mongo(self, doc: dict) -> ModelType:
        return self.model.model_validate(doc)

    def _to_mongo(self, obj: ModelType) -> dict:
        return obj.to_mongo()

    async def get(self, db: AsyncDatabase, id: Any) -> ModelType | None:
        doc = await self._collection(db).find_one({"_id": id})
        return self._from_mongo(doc) if doc else None

    async def get_multi(self, db: AsyncDatabase, *, page: int = 0, page_break: bool = False) -> list[ModelType]: # noqa
        if page_break:
            cursor = self._collection(db).find({}, skip=page * settings.MULTI_MAX, limit=settings.MULTI_MAX)
        else:
            cursor = self._collection(db).find({})
        return [self._from_mongo(doc) async for doc in cursor]

    async def create(self, db: AsyncDatabase, *, obj_in: CreateSchemaType) -> ModelType: # noqa
        db_obj = self.model(**obj_in.model_dump())
        await self._collection(db).insert_one(self._to_mongo(db_obj))
        return db_obj

    async def update(
        self, db: AsyncDatabase, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]] # noqa
    ) -> ModelType:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in db_obj.model_dump():
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        # TODO: Check if this saves changes with the setattr calls
        await self._collection(db).replace_one({"_id": db_obj.id}, self._to_mongo(db_obj))
        return db_obj

    async def remove(self, db: AsyncDatabase, *, id: Any) -> ModelType | None:
        obj = await self.get(db, id=id)
        if obj:
            await self._collection(db).delete_one({"_id": id})
        return obj
