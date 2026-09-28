import asyncio
from beanie import init_beanie
from src.database.db import database
from src.database.models import SlaRule


async def seed():
    await init_beanie(database=database, document_models=[SlaRule])

    rules = [
        {"priority": "P0", "response_target_minutes": 15, "resolution_target_hours": 4},
        {"priority": "P1", "response_target_minutes": 60, "resolution_target_hours": 24},
        {"priority": "P2", "response_target_minutes": 240, "resolution_target_hours": 72},
        {"priority": "P3", "response_target_minutes": 480, "resolution_target_hours": 168},
    ]

    for r in rules:
        existing = await SlaRule.find_one(SlaRule.priority == r["priority"])
        if not existing:
            await SlaRule(**r).insert()

    print("SLA rules seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())