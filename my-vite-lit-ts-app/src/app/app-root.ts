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
      <cesium-viewer></cesium-viewer>
    `;
  }
}
