import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@/components/my-arrow';

@customElement('my-inner-component')
export class MyInnerComponent extends LitElement {
  // createRenderRoot() {
  //   return this;
  // }

  static styles = css`
    .content-01 {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: red;
      background-color: #7eedee;
      margin: 8px;
      padding: 8px;
    }
  `;

  render() {
    return html` <div class="content-01">
      Hello from my-inner-component.ts
      <slot></slot>
      <my-arrow></my-arrow>
    </div>`;
  }
}
