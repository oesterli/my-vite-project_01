import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { cesiumService } from '@/cesium/cesium-service';

@customElement('layer-control')
export class LayerControl extends LitElement {
  @state() private ionActive = false;
  @state() private wmsActive = false;
  @state() private wmtsActive = false;

  static styles = css`
    :host {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(20, 20, 20, 0.85);
      backdrop-filter: blur(8px);
      color: #fff;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      min-width: 220px;
    }

    h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #aaa;
      border-bottom: 1px solid #333;
      padding-bottom: 6px;
    }

    .layer-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      cursor: pointer;
      font-size: 14px;
    }

    input[type='checkbox'] {
      margin-right: 10px;
      accent-color: #007acc;
      cursor: pointer;
    }
  `;

  // 1. Cesium Ion Layer schalten (z. B. Bing Maps Aerial = Asset ID 2)
  private async toggleIon(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.ionActive = checked;

    if (checked) {
      // Füge hier optional deinen Ion Access Token als 3. Parameter ein:
      await cesiumService.addIonLayer('ion-layer', 2);
    } else {
      cesiumService.removeLayer('ion-layer');
    }
  }

  // 2. WMS Layer schalten (Beispiel: Swisstopo WMS Geologie)
  private toggleWms(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.wmsActive = checked;

    if (checked) {
      cesiumService.addWmsLayer(
        'wms-geology',
        'https://wms.geo.admin.ch/',
        'ch.swisstopo.geologie-geologische_karte'
      );
    } else {
      cesiumService.removeLayer('wms-geology');
    }
  }

  // 3. WMTS Layer schalten (Beispiel: Swisstopo Pixelkarte)
  private toggleWmts(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.wmtsActive = checked;

    if (checked) {
      cesiumService.addWmtsLayer(
        'wmts-pixel',
        'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
        'ch.swisstopo.pixelkarte-farbe',
        'default',
        '2056'
      );
    } else {
      cesiumService.removeLayer('wmts-pixel');
    }
  }

  render() {
    return html`
      <h3>GIS Layer</h3>

      <label class="layer-row">
        <input type="checkbox" .checked=${this.ionActive} @change=${this.toggleIon} />
        Cesium Ion Aerial
      </label>

      <label class="layer-row">
        <input type="checkbox" .checked=${this.wmsActive} @change=${this.toggleWms} />
        WMS Geologie (CH)
      </label>

      <label class="layer-row">
        <input type="checkbox" .checked=${this.wmtsActive} @change=${this.toggleWmts} />
        WMTS Pixelkarte (CH)
      </label>
    `;
  }
}
