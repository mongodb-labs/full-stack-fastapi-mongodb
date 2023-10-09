from typing import Optional
from pydantic import BaseModel, Field, EmailStr, constr, validator
from beanie import PydanticObjectId


class UserLogin(BaseModel):
    username: str
    password: str


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    email_validated: Optional[bool] = False
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    full_name: str = ""


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: Optional[constr(min_length=8, max_length=64)] = None


# Properties to receive via API on update
class UserUpdate(UserBase):
    original: Optional[constr(min_length=8, max_length=64)] = None
    password: Optional[constr(min_length=8, max_length=64)] = None


class UserInDBBase(UserBase):
    id: Optional[PydanticObjectId] = None

    class Config:
        from_attributes = True


# Additional properties to return via API
class User(UserInDBBase):
    hashed_password: bool = Field(default=False, alias="password")
    totp_secret: bool = Field(default=False, alias="totp")

    class Config:
        populate_by_name = True

    @validator("hashed_password", pre=True)
    def evaluate_hashed_password(cls, hashed_password):
        if hashed_password:
            return True
        return False

    @validator("totp_secret", pre=True)
    def evaluate_totp_secret(cls, totp_secret):
        if totp_secret:
            return True
        return False


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: Optional[str] = None
    totp_secret: Optional[str] = None
    totp_counter: Optional[int] = None
