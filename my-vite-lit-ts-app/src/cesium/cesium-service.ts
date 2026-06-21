import * as Cesium from 'cesium';

class CesiumService {
  private static instance: CesiumService;
  private viewer?: Cesium.Viewer;

  private constructor() {}

  static getInstance(): CesiumService {
    if (!CesiumService.instance) {
      CesiumService.instance = new CesiumService();
    }
    return CesiumService.instance;
  }

  /**
   * Initialisiert Cesium nur EINMAL
   */
  init(containerId: string): Cesium.Viewer {
    if (this.viewer) {
      return this.viewer;
    }

    this.viewer = new Cesium.Viewer(containerId, {
      sceneMode: Cesium.SceneMode.SCENE3D,

      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,

      shouldAnimate: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity
    });

    return this.viewer;
  }

  /**
   * Zugriff auf Viewer überall in der App
   */
  getViewer(): Cesium.Viewer {
    if (!this.viewer) {
      throw new Error('Cesium Viewer not initialized. Call init() first.');
    }
    return this.viewer;
  }

  /**
   * Safe cleanup
   */
  destroy(): void {
    this.viewer?.destroy();
    this.viewer = undefined;
  }
}

export const cesiumService = CesiumService.getInstance();