from typing import Any, Dict, Generic, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from motor.core import AgnosticDatabase

from app.db.base_class import Base
from app.core.config import settings

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    async def get(self, db: AgnosticDatabase, id: Any) -> Optional[ModelType]:
        return await self.model.get(id)

    async def get_multi(self, db: AgnosticDatabase, *, page: int = 0, page_break: bool = False) -> list[ModelType]:
        offset = {"skip": page * settings.MULTI_MAX, "limit": settings.MULTI_MAX} if page_break else {}
        return await self.model.find_all(**offset).to_list()

    async def create(self, db: AgnosticDatabase, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)  # type: ignore
        return await db_obj.create()

    async def update(
        self, db: AgnosticDatabase, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        # TODO: Check if this saves changes with the setattr calls
        await db_obj.save()
        return db_obj

    async def remove(self, db: AgnosticDatabase, *, id: int) -> ModelType:
        obj = await self.model.get(id)
        if obj:
            await obj.delete()
        return obj
