from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from beanie import init_beanie

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import MongoDatabase
from app.models import MODELS


app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
async def app_init():
    await init_beanie(MongoDatabase(), document_models=MODELS)
    app.include_router(api_router, prefix=settings.API_V1_STR)
