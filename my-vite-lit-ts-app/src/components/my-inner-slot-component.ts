import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { loggeText } from '../utils/logger';

@customElement('my-inner-slot-component')
export class MyInnerSlotComponent extends LitElement {
  // createRenderRoot() {
  //   return this;
  // }

  static styles = css`
    .content-02 {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: blue;
      background-color: #e9a4eb;
      margin: 8px;
      padding: 8px;
    }
  `;

  _handleClick() {
    loggeText('Button wurde geklickt!');
  }

  firstUpdated() {
    loggeText('Lit-Komponente wurde erfolgreich geladen.');
  }

  render() {
    return html`
      <div class="content-02">Hello from my-inner-slot-component.ts</div>
      <button @click="${this._handleClick}">Klick mich</button>
    `;
  }
}
