import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cesiumService } from '@/cesium/cesium-service';

@customElement('cesium-viewer')
export class CesiumViewer extends LitElement {
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    cesiumService.init('cesiumContainer');
  }

  disconnectedCallback() {
    cesiumService.destroy();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div id="cesiumContainer"></div>

      <style>
        #cesiumContainer {
          width: 100%;
          height: 100%;
        }
      </style>
    `;
  }
}
