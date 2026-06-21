import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as Cesium from 'cesium';

@customElement('cesium-viewer')
export class CesiumViewer extends LitElement {

  private viewer?: Cesium.Viewer;

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.viewer = new Cesium.Viewer('cesiumContainer', {

      // 🎯 3D only
      sceneMode: Cesium.SceneMode.SCENE3D,

      // ❌ UI deaktivieren
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

      // ⚡ Performance
      shouldAnimate: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity
    });
  }

  disconnectedCallback() {
    this.viewer?.destroy();
    this.viewer = undefined;
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div id="cesiumContainer"></div>

      <style>
        #cesiumContainer {
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      </style>
    `;
  }
}