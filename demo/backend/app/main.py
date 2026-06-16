from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .image_analysis import analyze_panorama, analyze_regions
from .schemas import PanoramaAnalysisRequest, RegionAnalysisRequest


app = FastAPI(title="3VR Demo Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "3vr-demo-backend"}


@app.post("/analyze/panorama")
def analyze_whole_panorama(request: PanoramaAnalysisRequest) -> dict:
    return analyze_panorama(request)


@app.post("/analyze/regions")
def analyze_viewed_regions(request: RegionAnalysisRequest) -> dict:
    return analyze_regions(request)
