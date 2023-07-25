from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class RefreshTokenBase(BaseModel):
    token: str
    authenticates_id: Optional[UUID] = None


class RefreshTokenCreate(RefreshTokenBase):
    authenticates_id: UUID


class RefreshTokenUpdate(RefreshTokenBase):
    pass


class RefreshToken(RefreshTokenUpdate):
    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[UUID] = None
    refresh: Optional[bool] = False
    totp: Optional[bool] = False


class MagicTokenPayload(BaseModel):
    sub: Optional[UUID] = None
    fingerprint: Optional[UUID] = None


class WebToken(BaseModel):
    claim: str
