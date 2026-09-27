import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

load_dotenv()  # reads .env into environment variables

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
database = client.get_default_database()


async def init_db():
    """Runs once when the app starts. Registers every document model
    with Beanie so it knows which MongoDB collections exist."""
    from src.database import models  # imported here to avoid circular imports

    await init_beanie(
        database=database,
        document_models=[
            models.User,
            models.Complaint,
            models.ComplaintStatusHistory,
            models.AuditLog,
            models.ReviewerOverride,
            models.SlaRule,
        ],
    )