import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from app.image_analysis import analyze_panorama, analyze_regions


class ImageAnalysisTest(unittest.TestCase):
    def test_panorama_placeholder_response(self):
        result = analyze_panorama(
            SimpleNamespace(pano_id="panorama-fribourg-street", image_width=2176, image_height=1088)
        )

        self.assertEqual(result["mode"], "panorama")
        self.assertEqual(result["status"], "placeholder")
        self.assertEqual(result["labels"], [])

    def test_region_placeholder_response(self):
        result = analyze_regions(
            SimpleNamespace(pano_id="panorama-fribourg-street", image_width=2176, image_height=1088, points=[1, 2])
        )

        self.assertEqual(result["mode"], "regions")
        self.assertEqual(result["regionCount"], 2)
        self.assertEqual(result["regions"], [])


if __name__ == "__main__":
    unittest.main()
