from __future__ import annotations
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import User, Token
from app.schemas import RefreshTokenCreate, RefreshTokenUpdate
from app.core.config import settings


class CRUDToken(CRUDBase[Token, RefreshTokenCreate, RefreshTokenUpdate]):
    # Everything is user-dependent
    def create(self, db: Session, *, obj_in: str, user_obj: User) -> Token:
        db_obj = db.query(self.model).filter(self.model.token == obj_in).first()
        if db_obj and db_obj.authenticates != user_obj:
            raise ValueError("Token mismatch between key and user.")
        obj_in = RefreshTokenCreate(**{"token": obj_in, "authenticates_id": user_obj.id})
        return super().create(db=db, obj_in=obj_in)

    def get(self, *, user: User, token: str) -> Token:
        return user.refresh_tokens.filter(self.model.token == token).first()

    def get_multi(self, *, user: User, page: int = 0, page_break: bool = False) -> list[Token]:
        db_objs = user.refresh_tokens
        if not page_break:
            if page > 0:
                db_objs = db_objs.offset(page * settings.MULTI_MAX)
            db_objs = db_objs.limit(settings.MULTI_MAX)
        return db_objs.all()

    def remove(self, db: Session, *, db_obj: Token) -> None:
        db.delete(db_obj)
        db.commit()
        return None

token = CRUDToken(Token)
