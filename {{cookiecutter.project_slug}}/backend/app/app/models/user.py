from __future__ import annotations
from typing import TYPE_CHECKING, Any, Optional
from datetime import datetime
from pydantic import EmailStr
from odmantic import ObjectId, Field

from app.db.base_class import Base

if TYPE_CHECKING:
    from . import Token  # noqa: F401


def datetime_now_sec():
    return datetime.now().replace(microsecond=0)


class User(Base):
    created: datetime = Field(default_factory=datetime_now_sec)
    modified: datetime = Field(default_factory=datetime_now_sec)
    full_name: str = Field(default="")
    email: EmailStr
    hashed_password: Any = Field(default=None)
    totp_secret: Any = Field(default=None)
    totp_counter: Optional[int] = Field(default=None)
    email_validated: bool = Field(default=False)
    is_active: bool = Field(default=False)
    is_superuser: bool = Field(default=False)
    refresh_tokens: list[ObjectId] = Field(default_factory=list)
