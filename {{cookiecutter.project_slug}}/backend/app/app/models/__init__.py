from beanie import Document
from .user import User
from .token import Token

MODELS: list[Document] = [User, Token]

for model in MODELS:
    model.model_rebuild()
