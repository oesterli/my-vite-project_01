import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('draggable-window')
export class DraggableWindow extends LitElement {
  @property({ type: String }) title = 'Fenster';

  // Neu: Boolsches Property, um das Fenster ein-/auszublenden
  @property({ type: Boolean, reflect: true }) open = true;

  @state() private _posX = 50;
  @state() private _posY = 50;
  @state() private _isDragging = false;

  private _dragStartX = 0;
  private _dragStartY = 0;

  static override styles = css`
    :host {
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
    }

    /* Wenn open=false ist, wird das Element im DOM komplett versteckt */
    :host(:not([open])) {
      display: none;
    }

    .window {
      width: 500px;
      max-height: 550px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      border: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    }

    /* Draggable Header */
    .header {
      background: #2c3e50;
      color: white;
      padding: 10px 16px;
      cursor: grab;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .header:active {
      cursor: grabbing;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Schließen-Button */
    .close-btn {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      padding: 0 4px;
      border-radius: 4px;
      opacity: 0.8;
      transition:
        opacity 0.2s,
        background-color 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.2);
    }

    /* Inhaltsbereich */
    .content {
      padding: 16px;
      overflow-y: auto;
      flex-grow: 1;
    }
  `;

  // Fenster schließen
  private _closeWindow() {
    this.open = false;

    // Optional: Event feuern, damit Elternkomponenten wissen, dass geschlossen wurde
    this.dispatchEvent(
      new CustomEvent('window-closed', {
        bubbles: true,
        composed: true,
      })
    );
  }

  // Start des Ziehvorgangs
  private _onMouseDown(e: MouseEvent) {
    // Verhindert, dass das Ziehen startet, wenn man auf den Schließen-Button klickt
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    this._isDragging = true;
    this._dragStartX = e.clientX - this._posX;
    this._dragStartY = e.clientY - this._posY;

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
  }

  private _onMouseMove = (e: MouseEvent) => {
    if (!this._isDragging) return;
    this._posX = e.clientX - this._dragStartX;
    this._posY = e.clientY - this._dragStartY;
  };

  private _onMouseUp = () => {
    this._isDragging = false;
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
  };

  override render() {
    // Wenn nicht offen, gar nichts rendern
    if (!this.open) return html``;

    return html`
      <div class="window" style="transform: translate(${this._posX}px, ${this._posY}px);">
        <div class="header" @mousedown="${this._onMouseDown}">
          <span>${this.title}</span>

          <div class="header-controls">
            <span style="font-size: 0.8rem; opacity: 0.7;">⤭ Ziehen</span>
            <button class="close-btn" @click="${this._closeWindow}" title="Fenster schließen">
              &times;
            </button>
          </div>
        </div>

        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draggable-window': DraggableWindow;
  }
}
