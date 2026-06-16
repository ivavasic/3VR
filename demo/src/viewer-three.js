import * as THREE from "three";

const MIN_FOV = 15;
const MAX_FOV = 90;
const DIRECTION = new THREE.Vector3();

function normalizeDegrees(angle) {
  let normalized = angle;
  while (normalized <= -180) {
    normalized += 360;
  }
  while (normalized > 180) {
    normalized -= 360;
  }
  return normalized;
}

export class PanoramaViewer {
  constructor({ container }) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.lon = 0;
    this.lat = 0;
    this.isPointerDown = false;
    this.pointerStart = { x: 0, y: 0 };
    this.viewStart = { lon: 0, lat: 0 };
    this.mesh = null;
    this.texture = null;
    this.onViewChange = () => {};

    this.addEvents();
    this.resize();
    this.animate();
  }

  addEvents() {
    window.addEventListener("resize", () => this.resize());

    this.renderer.domElement.addEventListener("pointerdown", (event) => {
      this.isPointerDown = true;
      this.pointerStart = { x: event.clientX, y: event.clientY };
      this.viewStart = { lon: this.lon, lat: this.lat };
      this.renderer.domElement.setPointerCapture(event.pointerId);
    });

    this.renderer.domElement.addEventListener("pointermove", (event) => {
      if (!this.isPointerDown) {
        return;
      }

      const deltaX = event.clientX - this.pointerStart.x;
      const deltaY = event.clientY - this.pointerStart.y;
      this.lon = this.viewStart.lon - deltaX * 0.12;
      this.lat = Math.max(-85, Math.min(85, this.viewStart.lat + deltaY * 0.12));
      this.emitViewChange();
    });

    this.renderer.domElement.addEventListener("pointerup", (event) => {
      this.isPointerDown = false;
      this.renderer.domElement.releasePointerCapture(event.pointerId);
    });

    this.renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        this.camera.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, this.camera.fov + event.deltaY * 0.03));
        this.camera.updateProjectionMatrix();
        this.emitViewChange();
      },
      { passive: false },
    );
  }

  setOnViewChange(callback) {
    this.onViewChange = callback;
    this.emitViewChange();
  }

  async setPanorama(src) {
    const texture = await new THREE.TextureLoader().loadAsync(src);
    texture.colorSpace = THREE.SRGBColorSpace;

    if (this.texture) {
      this.texture.dispose();
    }
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }

    const geometry = new THREE.SphereGeometry(500, 96, 48);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.mesh = new THREE.Mesh(geometry, material);
    this.texture = texture;
    this.scene.add(this.mesh);
    this.lon = 0;
    this.lat = 0;
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    this.emitViewChange();
  }

  getViewState() {
    this.camera.getWorldDirection(DIRECTION);

    const panDegrees = normalizeDegrees(180 - THREE.MathUtils.radToDeg(Math.atan2(DIRECTION.z, DIRECTION.x)));
    const tiltDegrees = -THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(DIRECTION.y, -1, 1)));

    return {
      panDegrees,
      tiltDegrees,
      fovDegrees: this.camera.fov,
    };
  }

  emitViewChange() {
    this.onViewChange(this.getViewState());
  }

  resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.lat = Math.max(-85, Math.min(85, this.lat));

    const phi = THREE.MathUtils.degToRad(90 - this.lat);
    const theta = THREE.MathUtils.degToRad(this.lon);
    const target = new THREE.Vector3(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta),
    );

    this.camera.lookAt(target);
    this.renderer.render(this.scene, this.camera);
  }
}
