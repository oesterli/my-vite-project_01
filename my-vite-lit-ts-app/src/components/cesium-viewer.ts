import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as Cesium from 'cesium';

@customElement('cesium-viewer')
export class CesiumViewer extends LitElement {

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    new Cesium.Viewer('cesiumContainer', {
      animation: false,
      timeline: false,
    });
  }

  render() {
    return html`
      <div id="cesiumContainer" style="width:100%; height:100vh;"></div>
    `;
  }
}