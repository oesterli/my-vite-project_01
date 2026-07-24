import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './tree-item.js'; // <- TreeItem Registrierung importieren

@customElement('swissgeol-collections')
export class SwissgeolCollections extends LitElement {
  @property({ type: String }) username = '';
  @property({ type: String }) password = '';

  @state() private _collections: unknown[] = [];
  @state() private _loading: boolean = true;
  @state() private _error: string | null = null;

  static override styles = css`
    :host {
      display: block;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    }
    .error {
      color: #d93025;
      background-color: #fce8e6;
      padding: 12px;
      border-radius: 4px;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this._fetchCollections();
  }

  private async _fetchCollections(): Promise<void> {
    const url = '/api-swissgeol/collections';

    try {
      this._loading = true;
      this._error = null;

      const headers: HeadersInit = { Accept: 'application/json' };
      if (this.username && this.password) {
        headers['Authorization'] = `Basic ${btoa(`${this.username}:${this.password}`)}`;
      }

      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      this._collections = data.collections ?? [];
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Fehler beim Laden';
    } finally {
      this._loading = false;
    }
  }

  override render() {
    if (this._loading) return html`<p>⏳ Lade OGC Collections...</p>`;
    if (this._error) return html`<div class="error">${this._error}</div>`;

    return html`
      <h2>OGC Collections Tree View</h2>

      ${this._collections.map(
        (col, index) => html`
          <tree-item
            .label="${(col as Record<string, string>).title ||
            (col as Record<string, string>).id ||
            `Collection [${index}]`}"
            .data="${col}"
            .username="${this.username}"
            .password="${this.password}"
          >
          </tree-item>
        `
      )}
    `;
  }
}
