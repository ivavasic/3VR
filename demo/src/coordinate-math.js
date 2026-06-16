const DEFAULT_RATIO_TOLERANCE = 0.03;

export function validateEquirectangularDimensions(imageWidth, imageHeight) {
  if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight)) {
    throw new Error("Panorama dimensions must be finite numbers.");
  }

  if (imageWidth <= 0 || imageHeight <= 0) {
    throw new Error("Panorama dimensions must be greater than zero.");
  }

  const ratio = imageWidth / imageHeight;
  const isEquirectangular = Math.abs(ratio - 2) <= DEFAULT_RATIO_TOLERANCE;

  return {
    imageWidth,
    imageHeight,
    ratio,
    isEquirectangular,
  };
}

function fixed2Number(value) {
  return Number(value.toFixed(2));
}

export function calculate3vrCoordinates({
  panDegrees,
  tiltDegrees,
  fovDegrees,
  imageWidth,
  imageHeight,
  panoId = "panorama-fribourg-street",
}) {
  validateEquirectangularDimensions(imageWidth, imageHeight);

  const W = imageWidth;
  const H = imageHeight;
  const pi_rad = Math.PI;
  const theta_x = fixed2Number(Math.round(panDegrees) * (pi_rad / 180));
  const theta_y = fixed2Number(Math.round(tiltDegrees) * (pi_rad / 180));
  const fov = fixed2Number(fovDegrees * (pi_rad / 180));

  let x = Math.abs(Math.round((theta_x * H) / pi_rad));
  let y = Math.abs(Math.round((theta_y * H) / pi_rad));

  // Preserves the sign and wrapping cases from IVA_main.js.
  if (theta_x < 0 && theta_x > -pi_rad) {
    x = Math.abs(x);
  }
  if (theta_x < 0 && theta_x < -pi_rad) {
    x = -(Math.abs(2 * H - x));
  }
  if (theta_x > 0 && theta_x < pi_rad) {
    x = -(Math.abs(x));
  }
  if (theta_x > 0 && theta_x > pi_rad) {
    x = Math.abs(2 * H - x);
  }
  if (theta_y > 0 && theta_y < pi_rad / 2) {
    y = Math.abs(y);
  }
  if (theta_y < 0 && theta_y > -(pi_rad / 2)) {
    y = -y;
  }

  const canvasX = W / 2 + x;
  const canvasY = H / 2 + y;

  return {
    panoId,
    panDegrees: Math.round(panDegrees),
    tiltDegrees: Math.round(tiltDegrees),
    fov,
    x,
    y,
    canvasX,
    canvasY,
    imageWidth,
    imageHeight,
  };
}

export function fovToImageRegion({ fov, canvasX, canvasY, imageHeight }) {
  const fovPercent = fov * (100 / Math.PI);
  const size = Math.round(fovPercent * (imageHeight / 100));

  return {
    x: Math.round(canvasX - size / 2),
    y: Math.round(canvasY - size / 2),
    width: size,
    height: size,
  };
}
