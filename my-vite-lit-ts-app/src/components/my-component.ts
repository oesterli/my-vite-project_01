import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@/components/my-inner-component';
import '@/components/my-inner-slot-component';

@customElement('my-component')
export class MyComponent extends LitElement {
  // createRenderRoot() {
  //   return this;
  // }

  @state() private x = 1230;
  @state() private y = 100;

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

  static styles = css`
    .panel_00 {
      position: absolute;
      width: 260px;
      background: #b2efb5;
      color: black;
      border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      user-select: none;
    }

    .header_00 {
      background: #5d5fe8;
      padding: 8px;
      cursor: grab;
      font-weight: bold;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }

    .header_00:active {
      cursor: grabbing;
    }

    .content_00 {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: blue;
      background-color: #f2ef82;
    }
  `;

  render() {
    return html`
      <div class="panel_00" style="left:${this.x}px; top:${this.y}px">
        <!-- HEADER (drag handle) -->
        <div class="header_00" @mousedown=${this.onMouseDown}>⚙️ My-Component</div>

        <!-- CONTENT -->
        <div class="content_00">
          Hello from my-component.ts
          <my-inner-component>
            <my-inner-slot-component></my-inner-slot-component>
          </my-inner-component>
          <!-- <slot></slot> -->
          <my-inner-slot-component></my-inner-slot-component>
        </div>
      </div>
    `;
  }
}
