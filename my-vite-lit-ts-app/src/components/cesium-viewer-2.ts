import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cesiumService } from '@/cesium/cesium-service';

import './layer-control'; // 👈 Import der neuen Steuerungskomponente

@customElement('cesium-viewer-2')
export class CesiumViewer2 extends LitElement {
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

      <!-- Die Layer-Steuerung schwebt darüber -->
      <layer-control></layer-control>

      <style>
        #cesiumContainer {
          width: 100%;
          height: 100%;
        }
      </style>
    `;
  }
}
