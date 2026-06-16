import { fovToImageRegion } from "./coordinate-math.js";

export class OverlayMap {
  constructor({ stageElement, imageElement, canvasElement }) {
    this.stageElement = stageElement;
    this.imageElement = imageElement;
    this.canvas = canvasElement;
    this.context = canvasElement.getContext("2d");
    this.points = [];
    this.currentPoint = null;
    this.imageWidth = 1;
    this.imageHeight = 1;

    window.addEventListener("resize", () => this.draw());
  }

  async setPanorama({ src, imageWidth, imageHeight }) {
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.points = [];
    this.currentPoint = null;

    await new Promise((resolve, reject) => {
      this.imageElement.onload = resolve;
      this.imageElement.onerror = () => reject(new Error(`Could not display map image: ${src}`));
      this.imageElement.src = src;
    });

    this.syncCanvasSize();
    this.draw();
  }

  setCurrentPoint(point) {
    this.currentPoint = point;
    this.draw();
  }

  addPoint(point) {
    this.points.push(point);
    this.currentPoint = point;
    this.draw();
  }

  clear() {
    this.points = [];
    this.currentPoint = null;
    this.draw();
  }

  syncCanvasSize() {
    const stageWidth = this.stageElement.clientWidth;
    const stageHeight = this.stageElement.clientHeight;
    this.canvas.width = Math.max(1, Math.round(stageWidth * window.devicePixelRatio));
    this.canvas.height = Math.max(1, Math.round(stageHeight * window.devicePixelRatio));
    this.context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  toDisplay(point) {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    return {
      x: (point.canvasX / this.imageWidth) * width,
      y: (point.canvasY / this.imageHeight) * height,
      width,
      height,
    };
  }

  drawPoint(point, options) {
    const { x, y, width, height } = this.toDisplay(point);
    const region = fovToImageRegion({
      fov: point.fov,
      canvasX: point.canvasX,
      canvasY: point.canvasY,
      imageHeight: this.imageHeight,
    });

    const regionX = (region.x / this.imageWidth) * width;
    const regionY = (region.y / this.imageHeight) * height;
    const regionWidth = (region.width / this.imageWidth) * width;
    const regionHeight = (region.height / this.imageHeight) * height;

    this.context.strokeStyle = options.regionColor;
    this.context.lineWidth = options.regionWidth;
    this.context.strokeRect(regionX, regionY, regionWidth, regionHeight);

    this.context.beginPath();
    this.context.fillStyle = options.pointColor;
    this.context.arc(x, y, options.radius, 0, Math.PI * 2);
    this.context.fill();
  }

  draw() {
    this.syncCanvasSize();
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    this.context.clearRect(0, 0, width, height);

    for (const point of this.points) {
      this.drawPoint(point, {
        pointColor: "rgba(201, 73, 47, 0.82)",
        regionColor: "rgba(255, 232, 92, 0.34)",
        regionWidth: 1,
        radius: 3,
      });
    }

    if (this.currentPoint) {
      this.drawPoint(this.currentPoint, {
        pointColor: "#ffe85c",
        regionColor: "rgba(255, 232, 92, 0.9)",
        regionWidth: 2,
        radius: 5,
      });
    }
  }
}
