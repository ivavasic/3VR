import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { calculate3vrCoordinates, validateEquirectangularDimensions } from "./coordinate-math.js";

const cases = JSON.parse(fs.readFileSync(new URL("../test-fixtures/coordinate-cases.json", import.meta.url), "utf8"));

test("preserves 3VR coordinate outputs for shared fixtures", () => {
  for (const fixture of cases) {
    const result = calculate3vrCoordinates({
      panDegrees: fixture.panDegrees,
      tiltDegrees: fixture.tiltDegrees,
      fovDegrees: fixture.fovDegrees,
      imageWidth: fixture.imageWidth,
      imageHeight: fixture.imageHeight,
      panoId: "test",
    });

    for (const [key, expectedValue] of Object.entries(fixture.expected)) {
      assert.equal(result[key], expectedValue, `${fixture.id}.${key}`);
    }
  }
});

test("validates equirectangular dimensions without blocking the demo", () => {
  assert.equal(validateEquirectangularDimensions(2048, 1024).isEquirectangular, true);
  assert.equal(validateEquirectangularDimensions(1600, 1000).isEquirectangular, false);
});
