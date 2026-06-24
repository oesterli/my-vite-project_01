import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="content">Hello from my-component.ts</div>

      <style>
        .content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: blue;
        }
      </style>
    `;
  }
}
