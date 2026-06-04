from __future__ import annotations
from typing import ClassVar

from app.db.base_class import Base, PyObjectId

from .user import User  # noqa: F401


# Consider reworking to consolidate information to a userId. This may not work well
class Token(Base):
    __collection__: ClassVar[str] = "token"
    token: str
    authenticates_id: PyObjectId
