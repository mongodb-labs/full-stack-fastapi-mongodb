from __future__ import annotations

from typing import TYPE_CHECKING
from beanie.odm.fields import PydanticObjectId

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User  # noqa: F401


# Consider reworking to consolidate information to a userId. This may not work well
class Token(Base):
    token: str
    authenticates_id: PydanticObjectId
