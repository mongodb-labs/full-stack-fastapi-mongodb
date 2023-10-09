import asyncio
import logging

from app.db.init_db import init_db
from app.db.session import MongoDatabase

from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def populate_db() -> None:
    await init_db(MongoDatabase())
    # Place any code after this line to add any db population steps


async def main() -> None:
    logger.info("Creating initial data")
    await populate_db()
    logger.info("Initial data created")


if __name__ == "__main__":
    asyncio.run(main())
