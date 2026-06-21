import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@/components/cesium-viewer';
import { cesiumService } from '@/cesium/cesium-service';
import '@/components/lighting-controls';

@customElement('app-root')
export class AppRoot extends LitElement {

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <header>
        <h3>Cesium GIS</h3>
      </header>

      <div class="layout">
        <aside class="sidebar">

          <h4>Camera Controls</h4>

          <button @click=${() => cesiumService.flyToBern()}>
            Fly to Bern 🇨🇭
          </button>

          <button @click=${() => cesiumService.flyToNewYork()}>
            Fly to New York 🗽
          </button>

          <hr />

          <button @click=${() => cesiumService.zoomIn()}>
            Zoom In +
          </button>

          <button @click=${() => cesiumService.zoomOut()}>
            Zoom Out -
          </button>

          <hr />

          <button @click=${() => cesiumService.rotateLeft()}>
            Rotate Left ⟲
          </button>

          <button @click=${() => cesiumService.rotateRight()}>
            Rotate Right ⟳
          </button>

        </aside>

        <main class="map">
          <cesium-viewer></cesium-viewer>
        </main>
      </div>

      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        header {
          height: 56px;
          background: #111;
          color: white;
          display: flex;
          align-items: center;
          padding: 0 12px;
        }

        .layout {
          flex: 1;
          display: flex;
          min-height: 0;
        }

        .sidebar {
          width: 240px;
          background: #1e1e1e;
          color: white;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        button {
          padding: 8px;
          cursor: pointer;
          background: #333;
          color: white;
          border: none;
        }

        button:hover {
          background: #444;
        }

        .map {
          flex: 1;
        }

        canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
      </style>
    `;
  }
}