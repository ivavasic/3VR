from pydantic import BaseModel, Field


class PanoramaAnalysisRequest(BaseModel):
    pano_id: str = Field(..., alias="panoId")
    image_width: int = Field(..., alias="imageWidth", gt=0)
    image_height: int = Field(..., alias="imageHeight", gt=0)


class CoordinatePoint(BaseModel):
    pano_id: str = Field(..., alias="panoId")
    pan_degrees: float = Field(..., alias="panDegrees")
    tilt_degrees: float = Field(..., alias="tiltDegrees")
    fov: float
    x: float
    y: float
    canvas_x: float = Field(..., alias="canvasX")
    canvas_y: float = Field(..., alias="canvasY")
    image_width: int = Field(..., alias="imageWidth")
    image_height: int = Field(..., alias="imageHeight")


class RegionAnalysisRequest(BaseModel):
    pano_id: str = Field(..., alias="panoId")
    image_width: int = Field(..., alias="imageWidth", gt=0)
    image_height: int = Field(..., alias="imageHeight", gt=0)
    points: list[CoordinatePoint] = Field(default_factory=list)
