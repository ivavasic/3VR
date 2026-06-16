export async function loadPanoramaManifest() {
  const response = await fetch("./manifest.json");
  if (!response.ok) {
    throw new Error(`Could not load panorama manifest: ${response.status}`);
  }

  
  const manifest = await response.json();
  if (!Array.isArray(manifest.panoramas) || manifest.panoramas.length === 0) {
    throw new Error("Panorama manifest must contain at least one panorama.");
  }

  return manifest.panoramas;
}

export function loadImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        src,
        imageWidth: image.naturalWidth,
        imageHeight: image.naturalHeight,
      });
    };
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
}
