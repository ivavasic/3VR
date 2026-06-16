import "./styles.css";
import { checkBackendHealth, hasBackendConfigured } from "./api-client.js";
import { calculate3vrCoordinates, validateEquirectangularDimensions } from "./coordinate-math.js";
import { OverlayMap } from "./overlay-map.js";
import { loadImageDimensions, loadPanoramaManifest } from "./sample-store.js";
import { PanoramaViewer } from "./viewer-three.js";

const state = {
  panoramas: [],
  activePanorama: null,
  imageWidth: 1,
  imageHeight: 1,
  isTracking: false,
  samples: [],
  samplingTimer: null,
  latestPoint: null,
};

const elements = {
  panoramaSelect: document.querySelector("#panorama-select"),
  trackingToggle: document.querySelector("#tracking-toggle"),
  clearPoints: document.querySelector("#clear-points"),
  downloadJson: document.querySelector("#download-json"),
  downloadCsv: document.querySelector("#download-csv"),
  backendCheck: document.querySelector("#backend-check"),
  trackingStatus: document.querySelector("#tracking-status"),
  backendStatus: document.querySelector("#backend-status"),
  viewerReadout: document.querySelector("#viewer-readout"),
  sampleCount: document.querySelector("#sample-count"),
  sampleTotal: document.querySelector("#sample-total"),
  dockPanorama: document.querySelector("#dock-panorama"),
  metricPan: document.querySelector("#metric-pan"),
  metricTilt: document.querySelector("#metric-tilt"),
  metricFov: document.querySelector("#metric-fov"),
  metricXy: document.querySelector("#metric-xy"),
  metricCanvas: document.querySelector("#metric-canvas"),
  samplesBody: document.querySelector("#samples-body"),
};

const viewer = new PanoramaViewer({
  container: document.querySelector("#viewer"),
});

const overlay = new OverlayMap({
  stageElement: document.querySelector("#map-stage"),
  imageElement: document.querySelector("#map-image"),
  canvasElement: document.querySelector("#map-canvas"),
});

function formatNumber(value) {
  return Number.isFinite(value) ? `${Math.round(value * 100) / 100}` : "-";
}

function setTrackingStatus() {
  elements.trackingStatus.textContent = state.isTracking ? "Tracking active" : "Tracking idle";
  elements.trackingToggle.textContent = state.isTracking ? "Stop tracking" : "Start tracking";
}

function setSampleCount() {
  const count = state.samples.length;
  elements.sampleCount.textContent = `${count} ${count === 1 ? "point" : "points"}`;
  elements.sampleTotal.textContent = `${count} stored`;
}

function updateCurrentMetrics(point) {
  const activeTitle = state.activePanorama?.title ?? "No panorama";
  elements.dockPanorama.textContent = `${activeTitle} · ${state.imageWidth}x${state.imageHeight}`;

  if (!point) {
    elements.metricPan.textContent = "-";
    elements.metricTilt.textContent = "-";
    elements.metricFov.textContent = "-";
    elements.metricXy.textContent = "- / -";
    elements.metricCanvas.textContent = "- / -";
    return;
  }

  elements.metricPan.textContent = formatNumber(point.panDegrees);
  elements.metricTilt.textContent = formatNumber(point.tiltDegrees);
  elements.metricFov.textContent = `${formatNumber((point.fov * 180) / Math.PI)} deg`;
  elements.metricXy.textContent = `${formatNumber(point.x)} / ${formatNumber(point.y)}`;
  elements.metricCanvas.textContent = `${formatNumber(point.canvasX)} / ${formatNumber(point.canvasY)}`;
}

function renderSamplesTable() {
  const rows = state.samples.slice(-8).reverse();

  if (rows.length === 0) {
    elements.samplesBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="7">No tracked coordinates yet.</td>
      </tr>
    `;
    return;
  }

  elements.samplesBody.innerHTML = rows
    .map(
      (point) => `
        <tr>
          <td>${point.timestamp.slice(11, 19)}</td>
          <td>${point.panoId}</td>
          <td>${formatNumber(point.panDegrees)}</td>
          <td>${formatNumber(point.tiltDegrees)}</td>
          <td>${formatNumber(point.x)}</td>
          <td>${formatNumber(point.y)}</td>
          <td>${formatNumber((point.fov * 180) / Math.PI)}</td>
        </tr>
      `,
    )
    .join("");
}

function syncWindowDebug() {
  window.__3vrDemo = {
    get samples() {
      return state.samples;
    },
    get latestPoint() {
      return state.latestPoint;
    },
    get panorama() {
      return state.activePanorama;
    },
  };
}

function triggerDownload(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadJson() {
  triggerDownload(
    `${state.activePanorama?.id ?? "panorama"}-samples.json`,
    JSON.stringify(state.samples, null, 2),
    "application/json",
  );
}

function downloadCsv() {
  const headers = ["timestamp", "panoId", "panDegrees", "tiltDegrees", "fov", "x", "y", "canvasX", "canvasY"];
  const lines = [
    headers.join(","),
    ...state.samples.map((point) => headers.map((key) => JSON.stringify(point[key] ?? "")).join(",")),
  ];

  triggerDownload(`${state.activePanorama?.id ?? "panorama"}-samples.csv`, `${lines.join("\n")}\n`, "text/csv");
}

function currentPointFromViewer() {
  const viewState = viewer.getViewState();
  const point = calculate3vrCoordinates({
    ...viewState,
    imageWidth: state.imageWidth,
    imageHeight: state.imageHeight,
    panoId: state.activePanorama.id,
  });

  state.latestPoint = point;
  elements.viewerReadout.textContent = `Pan ${point.panDegrees} / Tilt ${point.tiltDegrees} / FoV ${Math.round(viewState.fovDegrees)}`;
  overlay.setCurrentPoint(point);
  updateCurrentMetrics(point);
  return point;
}

function samplePoint() {
  const point = {
    ...currentPointFromViewer(),
    timestamp: new Date().toISOString(),
  };

  state.samples.push(point);
  overlay.addPoint(point);
  setSampleCount();
  renderSamplesTable();
}

function startTracking() {
  if (state.isTracking) {
    return;
  }

  state.isTracking = true;
  samplePoint();
  state.samplingTimer = window.setInterval(samplePoint, 1000);
  setTrackingStatus();
}

function stopTracking() {
  state.isTracking = false;
  window.clearInterval(state.samplingTimer);
  state.samplingTimer = null;
  setTrackingStatus();
}

async function setActivePanorama(panoramaId) {
  const panorama = state.panoramas.find((item) => item.id === panoramaId);
  if (!panorama) {
    throw new Error(`Unknown panorama id: ${panoramaId}`);
  }

  const dimensions = await loadImageDimensions(panorama.src);
  const validation = validateEquirectangularDimensions(dimensions.imageWidth, dimensions.imageHeight);

  if (!validation.isEquirectangular) {
    console.warn(`Panorama ${panorama.id} is not close to a 2:1 equirectangular ratio.`);
  }

  stopTracking();
  state.activePanorama = panorama;
  state.imageWidth = dimensions.imageWidth;
  state.imageHeight = dimensions.imageHeight;
  state.samples = [];
  setSampleCount();
  renderSamplesTable();

  await Promise.all([
    viewer.setPanorama(panorama.src),
    overlay.setPanorama({
      src: panorama.src,
      imageWidth: state.imageWidth,
      imageHeight: state.imageHeight,
    }),
  ]);

  currentPointFromViewer();
}

function setupBackendControls() {
  if (!hasBackendConfigured()) {
    elements.backendStatus.textContent = "Backend not configured";
    elements.backendCheck.disabled = true;
    return;
  }

  elements.backendStatus.textContent = "Backend configured";
  elements.backendCheck.disabled = false;
  elements.backendCheck.addEventListener("click", async () => {
    elements.backendStatus.textContent = "Checking backend...";
    const result = await checkBackendHealth();
    elements.backendStatus.textContent = result.ok ? "Backend online" : "Backend unavailable";
  });
}

async function init() {
  setTrackingStatus();
  setSampleCount();
  renderSamplesTable();
  updateCurrentMetrics(null);
  setupBackendControls();
  syncWindowDebug();

  state.panoramas = await loadPanoramaManifest();
  for (const panorama of state.panoramas) {
    const option = document.createElement("option");
    option.value = panorama.id;
    option.textContent = panorama.title;
    elements.panoramaSelect.appendChild(option);
  }

  elements.panoramaSelect.addEventListener("change", (event) => {
    setActivePanorama(event.target.value).catch((error) => {
      console.error(error);
      elements.trackingStatus.textContent = "Panorama load failed";
    });
  });

  elements.trackingToggle.addEventListener("click", () => {
    if (state.isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  });

  elements.clearPoints.addEventListener("click", () => {
    state.samples = [];
    overlay.clear();
    currentPointFromViewer();
    setSampleCount();
    renderSamplesTable();
  });

  elements.downloadJson.addEventListener("click", downloadJson);
  elements.downloadCsv.addEventListener("click", downloadCsv);

  viewer.setOnViewChange(() => {
    if (state.activePanorama) {
      currentPointFromViewer();
    }
  });

  await setActivePanorama(state.panoramas[0].id);
}

init().catch((error) => {
  console.error(error);
  elements.trackingStatus.textContent = "Demo initialization failed";
});
