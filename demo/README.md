# 3VR Coordinate Demo

This folder contains the public demo app for the `demo-work` branch. It is separate from the paper scripts in the repository root.

## 🕹️ Live Demo

The browser demo is available at: https://ivavasic.github.io/3VR/docs/

This demo is not part of the paper’s core analysis workflow. It is provided as an interactive companion to visualize and understand the 3VR coordinate mapping process, and as a foundation for future extensions.


## What Runs Where

- Frontend: Vite + Three.js
- Backend: FastAPI, local or separately hosted later.
- Coordinate tracking: runs fully in the browser.
- AI image recognition: reserved for the backend (future works).

The browser demo does not collect IP addresses, browser fingerprints, Google Sheets data, or user metadata.

## Local Frontend

```bash
cd demo
npm install
npm run dev
```

## Local Backend

```bash
cd demo/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

To connect the frontend to the backend, set:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

If `VITE_API_BASE_URL` is not set, the panorama tracking demo still works.

## GitHub Pages

GitHub Pages can host only the built frontend:

```bash
cd demo
npm run build
```

The Python backend must be hosted separately if AI features are enabled later.

## Panorama source
- Panoramas are downloaded with https://svd360.com/
- Panoramas links:
    - `panorama-fribourg-street.jpg` from https://maps.app.goo.gl/LhVqpCUszx7QFnD38
    - `panorama-fribourg-bird.jpg` from https://maps.app.goo.gl/Vn6TWvboywMhnet77
    - `panorama-smart-living-lab.jpg` from https://maps.app.goo.gl/PwVAcyeXM6bbfTiKA
    - `panorama-elektronische-museum.jpg` from https://maps.app.goo.gl/ksEykMxp3f7hRrzW8
