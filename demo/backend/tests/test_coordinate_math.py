import json
import sys
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
DEMO_DIR = BACKEND_DIR.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.coordinate_math import calculate_3vr_coordinates, validate_equirectangular_dimensions


class CoordinateMathTest(unittest.TestCase):
    def test_matches_shared_coordinate_fixtures(self):
        fixtures = json.loads((DEMO_DIR / "test-fixtures" / "coordinate-cases.json").read_text())

        for fixture in fixtures:
            with self.subTest(fixture=fixture["id"]):
                result = calculate_3vr_coordinates(
                    pan_degrees=fixture["panDegrees"],
                    tilt_degrees=fixture["tiltDegrees"],
                    fov_degrees=fixture["fovDegrees"],
                    image_width=fixture["imageWidth"],
                    image_height=fixture["imageHeight"],
                    pano_id="test",
                )

                for key, expected_value in fixture["expected"].items():
                    self.assertEqual(result[key], expected_value)

    def test_validates_ratio(self):
        self.assertTrue(validate_equirectangular_dimensions(2048, 1024)["isEquirectangular"])
        self.assertFalse(validate_equirectangular_dimensions(1600, 1000)["isEquirectangular"])


if __name__ == "__main__":
    unittest.main()
