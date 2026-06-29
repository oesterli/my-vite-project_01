import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

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

  render() {
    return html` <div class="content-02">Hello from my-inner-slot-component.ts</div> `;
  }
}
