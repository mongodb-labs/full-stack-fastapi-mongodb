from typing import Optional
from pydantic import BaseModel, ConfigDict, SecretStr
from odmantic import Model, ObjectId


class RefreshTokenBase(BaseModel):
    token: SecretStr
    authenticates: Optional[Model] = None


class RefreshTokenCreate(RefreshTokenBase):
    authenticates: Model


class RefreshTokenUpdate(RefreshTokenBase):
    pass


class RefreshToken(RefreshTokenUpdate):
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: SecretStr
    refresh_token: Optional[SecretStr] = None
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[ObjectId] = None
    refresh: Optional[bool] = False
    totp: Optional[bool] = False


class MagicTokenPayload(BaseModel):
    sub: Optional[ObjectId] = None
    fingerprint: Optional[ObjectId] = None


class WebToken(BaseModel):
    claim: str
