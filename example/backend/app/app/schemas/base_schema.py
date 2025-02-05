from __future__ import annotations
from pydantic import ConfigDict, BaseModel, Field
from uuid import UUID
from datetime import date, datetime
import json

from app.schema_types import BaseEnum


class BaseSchema(BaseModel):
    @property
    def as_db_dict(self):
        to_db = self.model_dump(exclude_defaults=True, exclude_none=True, exclude={"identifier", "id"}) # noqa
        for key in ["id", "identifier"]:
            if key in self.model_dump().keys():
                to_db[key] = self.model_dump()[key].hex
        return to_db


class MetadataBaseSchema(BaseSchema):
    # Receive via API
    # https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#section-3
    title: str | None = Field(None, description="A human-readable title given to the resource.") # noqa
    description: str | None = Field(
        None,
        description="A short description of the resource.",
    )
    isActive: bool | None = Field(default=True, description="Whether the resource is still actively maintained.") # noqa
    isPrivate: bool | None = Field(
        default=True,
        description="Whether the resource is private to team members with appropriate authorisation.",  # noqa
    )


class MetadataBaseCreate(MetadataBaseSchema):
    pass


class MetadataBaseUpdate(MetadataBaseSchema):
    identifier: UUID = Field(..., description="Automatically generated unique identity for the resource.")


class MetadataBaseInDBBase(MetadataBaseSchema):
    # Identifier managed programmatically
    identifier: UUID = Field(..., description="Automatically generated unique identity for the resource.")
    created: date = Field(..., description="Automatically generated date resource was created.")
    isActive: bool = Field(..., description="Whether the resource is still actively maintained.")
    isPrivate: bool = Field(
        ...,
        description="Whether the resource is private to team members with appropriate authorisation.",
    )
    model_config = ConfigDict(from_attributes=True)
