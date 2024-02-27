from typing import Optional
from pydantic import BaseModel, SecretStr


class NewTOTP(BaseModel):
    secret: Optional[SecretStr] = None
    key: str
    uri: str


class EnableTOTP(BaseModel):
    claim: str
    uri: str
    password: Optional[SecretStr] = None
