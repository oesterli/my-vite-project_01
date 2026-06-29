import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-arrow')
export class MyArrow extends LitElement {
  static styles = [
    css`
      .arrow {
        font-size: 24px;
        color: red;
        text-align: left;
        margin-top: 20px;
        background-color: #f0f0f0;
        padding: 10px;
      }
    `,
  ];
  render() {
    return html`<div class="arrow">&#8595;</div>`;
  }
}
