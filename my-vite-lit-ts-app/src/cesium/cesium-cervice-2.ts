// Falls du Cesium global eingebunden hast: declare const Cesium: any;
import * as Cesium from 'cesium';

class CesiumService {
  private static instance: CesiumService;
  private viewer?: Cesium.Viewer;

  // 🗂️ NEU: Speichert geladene Layer anhand einer eindeutigen ID
  private layers: Map<string, Cesium.ImageryLayer> = new Map();

  static getInstance() {
    if (!CesiumService.instance) {
      CesiumService.instance = new CesiumService();
    }
    return CesiumService.instance;
  }

  // ... deine bestehende init(), getViewer(), etc. ...

  // ==========================================
  // 🗺️ LAYER MANAGEMENT METHODS
  // ==========================================

  /**
   * 1. Cesium Ion Layer hinzufügen (z.B. Sentinel-2, Bing Maps, eigene Asset-IDs)
   */
  async addIonLayer(id: string, assetId: number, accessToken?: string) {
    const viewer = this.getViewer();
    this.removeLayer(id); // Falls Layer mit gleicher ID existiert, erst entfernen

    if (accessToken) {
      Cesium.Ion.defaultAccessToken = accessToken;
    }

    try {
      const provider = await Cesium.IonImageryProvider.fromAssetId(assetId);
      const layer = viewer.imageryLayers.addImageryProvider(provider);
      this.layers.set(id, layer);
      return layer;
    } catch (error) {
      console.error(`Fehler beim Laden des Ion-Assets (${assetId}):`, error);
    }
  }

  /**
   * 2. WMS Layer hinzufügen (Web Map Service - Raster/Kacheln vom GIS-Server)
   */
  addWmsLayer(id: string, url: string, layers: string, parameters: Record<string, any> = {}) {
    const viewer = this.getViewer();
    this.removeLayer(id);

    const provider = new Cesium.WebMapServiceImageryProvider({
      url: url,
      layers: layers,
      parameters: {
        transparent: true,
        format: 'image/png',
        ...parameters,
      },
    });

    const layer = viewer.imageryLayers.addImageryProvider(provider);
    this.layers.set(id, layer);
    return layer;
  }

  /**
   * 3. WMTS Layer hinzufügen (Web Map Tile Service - Vorgenerierte Kacheln)
   */
  addWmtsLayer(
    id: string,
    url: string,
    layerName: string,
    style: string = 'default',
    tileMatrixSetID: string = 'EPSG:3857'
  ) {
    const viewer = this.getViewer();
    this.removeLayer(id);

    const provider = new Cesium.WebMapTileServiceImageryProvider({
      url: url,
      layer: layerName,
      style: style,
      format: 'image/png',
      tileMatrixSetID: tileMatrixSetID,
    });

    const layer = viewer.imageryLayers.addImageryProvider(provider);
    this.layers.set(id, layer);
    return layer;
  }

  /**
   * Layer gezielt über seine ID entfernen
   */
  removeLayer(id: string) {
    const layer = this.layers.get(id);
    if (layer && this.viewer) {
      this.viewer.imageryLayers.remove(layer);
      this.layers.delete(id);
    }
  }

  /**
   * Transparenz/Alpha eines bestimmten Layers steuern (0.0 = unsichtbar, 1.0 = voll sichtbar)
   */
  setLayerAlpha(id: string, alpha: number) {
    const layer = this.layers.get(id);
    if (layer) {
      layer.alpha = alpha;
    }
  }

  /**
   * Sichtbarkeit eines Layers ein-/ausschalten
   */
  setLayerVisibility(id: string, show: boolean) {
    const layer = this.layers.get(id);
    if (layer) {
      layer.show = show;
    }
  }

  // 🧹 NEU: Beim Destroy auch die Map leeren
  destroy() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = undefined;
      this.layers.clear();
    }
  }
}

export const cesiumService = CesiumService.getInstance();
