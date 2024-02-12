from __future__ import annotations

from odmantic import Reference

from app.db.base_class import Base

from .user import User  # noqa: F401


# Consider reworking to consolidate information to a userId. This may not work well
class Token(Base):
    token: str
    authenticates_id: User = Reference()
