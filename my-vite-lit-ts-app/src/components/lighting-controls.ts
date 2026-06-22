import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { cesiumService } from '@/cesium/cesium-service';

@customElement('lighting-controls')
export class LightingControls extends LitElement {

  createRenderRoot() {
    return this;
  }

  @state() private x = 1230;
  @state() private y = 80;

  @state() private dragging = false;
  private offsetX = 0;
  private offsetY = 0;

  // 🎯 DRAG START
  private onMouseDown(e: MouseEvent) {
    this.dragging = true;
    this.offsetX = e.clientX - this.x;
    this.offsetY = e.clientY - this.y;

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  // 🎯 DRAG MOVE
  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;

    this.x = e.clientX - this.offsetX;
    this.y = e.clientY - this.offsetY;

    this.requestUpdate();
  };

  // 🎯 DRAG END
  private onMouseUp = () => {
    this.dragging = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  render() {
    return html`
      <div
        class="panel"
        style="left:${this.x}px; top:${this.y}px"
      >

        <!-- HEADER (drag handle) -->
        <div class="header"
          @mousedown=${this.onMouseDown}
        >
          ⚙️ Lighting Controls
        </div>

        <!-- CONTENT -->
        <div class="content">

         <label>
            <input type="checkbox"
              @change=${(e: any) =>
                cesiumService.setAtmosphere(e.target.checked)}>
            Atmosphere
          </label>

         <label>
            <input type="checkbox"
              @change=${(e: any) =>
                cesiumService.setFog(e.target.checked)}>
            Fog
         </label>

          <label>
            Fog Strength
            <input type="range" min="0" max="0.01" step="0.001"
              @input=${(e: any) =>
                cesiumService.setFogStrength(parseFloat(e.target.value))}>
          </label>

         <label>
            <input type="checkbox"
              @change=${(e: any) =>
                cesiumService.setHDR(e.target.checked)}>
            HDR
          </label>

          <label>
            <input type="checkbox"
              @change=${(e: any) =>
                cesiumService.setLighting(e.target.checked)}>
            Lighting
          </label>

          <label>
            Gamma
            <input type="range" min="0.5" max="3" step="0.1"
              @input=${(e: any) =>
                cesiumService.setGamma(parseFloat(e.target.value))}>
          </label>

          <label>
            Brightness
            <input type="range" min="0" max="3" step="0.1"
              @input=${(e: any) =>
                cesiumService.setBrightness(parseFloat(e.target.value))}>
          </label>

        </div>
      </div>

      <style>
        .panel {
          position: absolute;
          width: 260px;
          background: #b2efb5;
          color: black;
          border-radius: 6px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          user-select: none;
        }

        .header {
          background: #111;
          padding: 8px;
          cursor: grab;
          font-weight: bold;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }

        .header:active {
          cursor: grabbing;
        }

        .content {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        label {
          display: flex;
          flex-direction: column;
          font-size: 12px;
        }

        input[type="range"] {
          width: 100%;
        }
      </style>
    `;
  }
}