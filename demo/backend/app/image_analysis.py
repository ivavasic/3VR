from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .schemas import PanoramaAnalysisRequest, RegionAnalysisRequest


def analyze_panorama(request: PanoramaAnalysisRequest) -> dict:
    return {
        "mode": "panorama",
        "panoId": request.pano_id,
        "imageWidth": request.image_width,
        "imageHeight": request.image_height,
        "status": "placeholder",
        "labels": [],
    }


def analyze_regions(request: RegionAnalysisRequest) -> dict:
    return {
        "mode": "regions",
        "panoId": request.pano_id,
        "imageWidth": request.image_width,
        "imageHeight": request.image_height,
        "status": "placeholder",
        "regionCount": len(request.points),
        "regions": [],
    }
