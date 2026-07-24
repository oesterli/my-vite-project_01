import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('draggable-window')
export class DraggableWindow extends LitElement {
  @property({ type: String }) title = 'Fenster';

  // Positionszustände für das Dragging
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

    .window {
      width: 450px;
      max-height: 500px;
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

    /* Scrollbarer Inhaltsbereich */
    .content {
      padding: 16px;
      overflow-y: auto; /* Vertikale Scrollbar */
      flex-grow: 1;
    }
  `;

  // Start des Ziehvorgangs
  private _onMouseDown(e: MouseEvent) {
    this._isDragging = true;
    this._dragStartX = e.clientX - this._posX;
    this._dragStartY = e.clientY - this._posY;

    // Globale Listener anhängen, damit das Ziehen flüssig bleibt
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
  }

  // Position während des Ziehens aktualisieren
  private _onMouseMove = (e: MouseEvent) => {
    if (!this._isDragging) return;
    this._posX = e.clientX - this._dragStartX;
    this._posY = e.clientY - this._dragStartY;
  };

  // Ziehvorgang beenden
  private _onMouseUp = () => {
    this._isDragging = false;
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
  };

  override render() {
    return html`
      <div class="window" style="transform: translate(${this._posX}px, ${this._posY}px);">
        <div class="header" @mousedown="${this._onMouseDown}">
          <span>${this.title}</span>
          <span style="font-size: 0.8rem; opacity: 0.7;">⤭ Ziehen</span>
        </div>

        <div class="content">
          <!-- Hier landet der Inhalt (z.B. deine API-Komponente) -->
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
