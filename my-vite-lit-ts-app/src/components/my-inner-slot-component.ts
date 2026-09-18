import { LitElement, css, html } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import { loggeText, getLogMessages } from '../utils/logger.ts';

@customElement('my-inner-slot-component')
export class MyInnerSlotComponent extends LitElement {

  @state()
  private logMessages: string[] = [];

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

    .logger {
      margin: 8px;
      padding: 8px;
      background-color: #222;
      color: white;
      font-family: monospace;
      max-height: 100px;
      overflow-y: auto;
      box-sizing: border-box;
    }

    .log-message {
      margin-bottom: 4px;
    }

  `;

  _handleClick() {

    loggeText('Button wurde geklickt!');

    this.logMessages = getLogMessages();

  }

  firstUpdated() {

    loggeText('Lit-Komponente wurde erfolgreich geladen.');

    this.logMessages = getLogMessages();

  }

  render() {

    return html`

      <div class="content-02">
        Hello from my-inner-slot-component.ts
      </div>

      <button @click="${this._handleClick}">
        Klick mich
      </button>

      <div class="logger">

        <strong>Logger</strong>

        ${this.logMessages.map(
          (message) => html`
            <div class="log-message">
              ${message}
            </div>
          `
        )}

      </div>

    `;

  }

}

