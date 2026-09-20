from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import sync

app = FastAPI(
    title="FocusGuard Insights API",
    description="Privacy-preserving backend for FocusGuard attention fragmentation analytics and zero-knowledge backup.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sync.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "FocusGuard API",
        "version": "1.0.0",
        "compliance": ["DPDP_ACT_2023", "GDPR_READY"]
    }
