import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-crap-element')
export class MyCrapElement extends LitElement {

  render() {
    return html`
        <div>
            hallo crap!!
        </div>
    `
  }
}