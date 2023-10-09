from typing import Optional
from pydantic import BaseModel
from beanie.odm.fields import PydanticObjectId
from beanie import Document


class RefreshTokenBase(BaseModel):
    token: str
    authenticates: Optional[Document] = None


class RefreshTokenCreate(RefreshTokenBase):
    authenticates: Document


class RefreshTokenUpdate(RefreshTokenBase):
    pass


class RefreshToken(RefreshTokenUpdate):
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[PydanticObjectId] = None
    refresh: Optional[bool] = False
    totp: Optional[bool] = False


class MagicTokenPayload(BaseModel):
    sub: Optional[PydanticObjectId] = None
    fingerprint: Optional[PydanticObjectId] = None


class WebToken(BaseModel):
    claim: str
