from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from src.database.db import init_db
from src.security.limiter import limiter
from src.security.routes import router as auth_router
from src.complaint_processing.routes import router as complaints_router

app = FastAPI(title="SupportNova API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this to your real frontend URL once deployed
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(complaints_router)


@app.on_event("startup")
async def on_startup():
    """Connects Beanie to MongoDB Atlas and registers all document models."""
    await init_db()


@app.get("/health")
def health_check():
    return {"status": "ok"}