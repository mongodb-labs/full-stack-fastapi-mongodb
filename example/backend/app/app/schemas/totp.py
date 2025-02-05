from pydantic import BaseModel, SecretStr


class NewTOTP(BaseModel):
    secret: SecretStr | None = None
    key: str
    uri: str


class EnableTOTP(BaseModel):
    claim: str
    uri: str
    password: SecretStr | None = None
