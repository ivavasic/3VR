import math
from decimal import Decimal, ROUND_HALF_UP


RATIO_TOLERANCE = 0.03


def js_round(value: float) -> int:
    return math.floor(value + 0.5)


def fixed2_number(value: float) -> float:
    return float(Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def validate_equirectangular_dimensions(image_width: float, image_height: float) -> dict:
    if not math.isfinite(image_width) or not math.isfinite(image_height):
        raise ValueError("Panorama dimensions must be finite numbers.")
    if image_width <= 0 or image_height <= 0:
        raise ValueError("Panorama dimensions must be greater than zero.")

    ratio = image_width / image_height
    return {
        "imageWidth": image_width,
        "imageHeight": image_height,
        "ratio": ratio,
        "isEquirectangular": abs(ratio - 2) <= RATIO_TOLERANCE,
    }


def calculate_3vr_coordinates(
    *,
    pan_degrees: float,
    tilt_degrees: float,
    fov_degrees: float,
    image_width: float,
    image_height: float,
    pano_id: str = "panorama-fribourg-street",
) -> dict:
    validate_equirectangular_dimensions(image_width, image_height)

    W = image_width
    H = image_height
    pi_rad = math.pi
    theta_x = fixed2_number(js_round(pan_degrees) * (pi_rad / 180))
    theta_y = fixed2_number(js_round(tilt_degrees) * (pi_rad / 180))
    fov = fixed2_number(fov_degrees * (pi_rad / 180))

    x = abs(js_round((theta_x * H) / pi_rad))
    y = abs(js_round((theta_y * H) / pi_rad))

    if theta_x < 0 and theta_x > -pi_rad:
        x = abs(x)
    if theta_x < 0 and theta_x < -pi_rad:
        x = -(abs(2 * H - x))
    if theta_x > 0 and theta_x < pi_rad:
        x = -(abs(x))
    if theta_x > 0 and theta_x > pi_rad:
        x = abs(2 * H - x)
    if theta_y > 0 and theta_y < pi_rad / 2:
        y = abs(y)
    if theta_y < 0 and theta_y > -(pi_rad / 2):
        y = -y

    return {
        "panoId": pano_id,
        "panDegrees": js_round(pan_degrees),
        "tiltDegrees": js_round(tilt_degrees),
        "fov": fov,
        "x": x,
        "y": y,
        "canvasX": W / 2 + x,
        "canvasY": H / 2 + y,
        "imageWidth": image_width,
        "imageHeight": image_height,
    }
