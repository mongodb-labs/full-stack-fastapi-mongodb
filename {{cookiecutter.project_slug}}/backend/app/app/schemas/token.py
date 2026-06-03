from pydantic import BaseModel, ConfigDict, SecretStr

from app.db.base_class import PyObjectId


class RefreshTokenBase(BaseModel):
    token: SecretStr
    authenticates: BaseModel | None = None


class RefreshTokenCreate(RefreshTokenBase):
    authenticates: BaseModel


class RefreshTokenUpdate(RefreshTokenBase):
    pass


class RefreshToken(RefreshTokenUpdate):
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str


class TokenPayload(BaseModel):
    sub: PyObjectId | None = None
    refresh: bool | None = False
    totp: bool | None = False


class MagicTokenPayload(BaseModel):
    sub: PyObjectId | None = None
    fingerprint: PyObjectId | None = None


class WebToken(BaseModel):
    claim: str
