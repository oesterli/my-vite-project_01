import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@/components/cesium-viewer';

@customElement('app-root')
export class AppRoot extends LitElement {

  createRenderRoot() {
    return this;
  }

render() {
  return html`
    <header>
      <h1>My Cesium App</h1>
    </header>

    <div class="content">
      <cesium-viewer></cesium-viewer>
    </div>

    <style>
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
      }

      header {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        background: #baf36a;
        color: white;
        flex-shrink: 0;
      }

      .content {
        flex: 1;
        display: flex;
        overflow: hidden;
        min-height: 0; /* important for flex children to not overflow */
      }
       canvas {
        display: block; /* removes default inline-block spacing */
        width: 100%;
      }

    </style>
  `;
}
}