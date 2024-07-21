import sentry_sdk
import asyncio

from app.core.celery_app import celery_app
from app.core.config import settings

client_sentry = sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)


@celery_app.task(acks_late=True)
async def test_celery(word: str) -> str:
    await asyncio.sleep(5)
    return f"test task return {word}"
