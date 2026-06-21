import * as Cesium from 'cesium';

class CesiumService {
  private static instance: CesiumService;
  private viewer?: Cesium.Viewer;

  static getInstance() {
    if (!CesiumService.instance) {
      CesiumService.instance = new CesiumService();
    }
    return CesiumService.instance;
  }

  init(containerId: string) {
    if (this.viewer) return this.viewer;

    this.viewer = new Cesium.Viewer(containerId, {
      terrain: Cesium.Terrain.fromWorldTerrain(), // 🔥 wichtig für echtes Terrain

      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false
    });

      // 👉 HIER kommt dein Underground Code hin
      const viewer = this.viewer;

      // 🌍 Terrain durchsichtig machen
      viewer.scene.globe.translucency.enabled = false;
      viewer.scene.globe.translucency.frontFaceAlpha = 0.5;
      viewer.scene.globe.translucency.backFaceAlpha = 0.5;

      // 👁 Objekte unter Terrain sichtbar machen
      viewer.scene.globe.depthTestAgainstTerrain = false;

      // 🚀 Kamera darf durch Terrain
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;

      // ❌ keine echte Sonnenbeleuchtung mehr
      //viewer.scene.globe.enableLighting = false;
      //viewer.scene.skyAtmosphere.show = false;
      //viewer.scene.fog.enabled = false;
      viewer.scene.skyBox = undefined;
      viewer.scene.backgroundColor = Cesium.Color.GREY;
      //viewer.scene.highDynamicRange = false;
      //viewer.scene.gamma = 1.5; // oder 1.8 testen
      viewer.imageryLayers.get(0).brightness = 1.3;
      viewer.imageryLayers.get(0).contrast = 1.1;



      // Add a red point at Bern, Switzerland
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(7.44, 46.95, -1000),
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED
        }
      });

    return this.viewer;
  }

  private getViewer() {
    if (!this.viewer) throw new Error('Viewer not initialized');
    return this.viewer;
  }

  // 
setLighting(enabled: boolean) {
  const viewer = this.getViewer();
  viewer.scene.globe.enableLighting = enabled;
}

setAtmosphere(enabled: boolean) {
  const viewer = this.getViewer();
  viewer.scene.skyAtmosphere.show = enabled;
}

setFog(enabled: boolean) {
  const viewer = this.getViewer();
  viewer.scene.fog.enabled = enabled;
}

setFogStrength(value: number) {
  const viewer = this.getViewer();
  viewer.scene.fog.density = value;
}

setHDR(enabled: boolean) {
  const viewer = this.getViewer();
  viewer.scene.highDynamicRange = enabled;
}

setGamma(value: number) {
  const viewer = this.getViewer();
  viewer.scene.gamma = value;
}

setBrightness(value: number) {
  const viewer = this.getViewer();
  const layer = viewer.imageryLayers.get(0);
  if (layer) layer.brightness = value;
}

setContrast(value: number) {
  const viewer = this.getViewer();
  const layer = viewer.imageryLayers.get(0);
  if (layer) layer.contrast = value;
}

  // 🎯 CAMERA ACTIONS

  flyToBern() {
    this.getViewer().camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(7.4474, 46.9480, 15000)
    });
  }

  flyToNewYork() {
    this.getViewer().camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-74.0060, 40.7128, 20000)
    });
  }

  zoomIn() {
    this.getViewer().camera.zoomIn(50000);
  }

  zoomOut() {
    this.getViewer().camera.zoomOut(50000);
  }

  rotateLeft() {
    this.getViewer().camera.rotateLeft(Cesium.Math.toRadians(10));
  }

  rotateRight() {
    this.getViewer().camera.rotateRight(Cesium.Math.toRadians(10));
  }
}

export const cesiumService = CesiumService.getInstance();