import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('tree-item')
export class TreeItem extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: Object }) data: unknown = null;

  // Auth-Credentials weiterreichen
  @property({ type: String }) username = '';
  @property({ type: String }) password = '';

  @state() private _isOpen = false;
  @state() private _isLoading = false;
  @state() private _fetchedChildren: unknown[] | null = null;
  @state() private _fetchError: string | null = null;

  static override styles = css`
    :host {
      display: block;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .node {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;
      border-radius: 4px;
      user-select: none;
      cursor: pointer;
    }

    .node:hover {
      background-color: #eef4fc;
    }

    .arrow {
      display: inline-block;
      width: 12px;
      font-size: 0.75rem;
      transition: transform 0.15s ease;
      color: #555;
    }

    .arrow.open {
      transform: rotate(90deg);
    }

    .label {
      font-weight: 600;
      color: #1a252f;
    }

    .value {
      color: #27ae60;
      word-break: break-all;
    }

    .children-container {
      margin-left: 18px;
      border-left: 2px solid #e0e0e0;
      padding-left: 8px;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: bold;
      color: #7f8c8d;
      text-transform: uppercase;
      margin: 6px 0 2px 4px;
    }

    .error {
      color: #d93025;
      font-size: 0.8rem;
    }
  `;

  private async _toggle(): void {
    this._isOpen = !this._isOpen;

    // Falls aufgeklappt wird und noch keine Kindelemente geladen/geholt wurden
    if (this._isOpen && !this._fetchedChildren && !this._hasDirectChildrenArray()) {
      await this._fetchChildNodes();
    }
  }

  // Prüft, ob direkt ein children-Array im Objekt existiert
  private _hasDirectChildrenArray(): boolean {
    if (!this._isRecord(this.data)) return false;
    return Array.isArray(this.data.children) && this.data.children.length > 0;
  }

  // Holt Kindelemente über API-Links, falls kein direktes Array vorliegt
  private async _fetchChildNodes(): Promise<void> {
    if (!this._isRecord(this.data)) return;

    // Suche nach OGC Child-Links
    const links = this.data.links;
    if (!Array.isArray(links)) return;

    const childLink = links.find(
      (l: Record<string, string>) => l.rel === 'child' || l.rel === 'children' || l.rel === 'items'
    );

    if (childLink && childLink.href) {
      await this._fetchFromUrl(childLink.href);
    }
  }

  private async _fetchFromUrl(url: string): Promise<void> {
    try {
      this._isLoading = true;
      this._fetchError = null;

      // URL über den Vite Proxy leiten
      const proxyUrl = url.replace('https://ogc-api.gst-viewer.swissgeol.ch', '/api-swissgeol');

      const headers: HeadersInit = { Accept: 'application/json' };
      if (this.username && this.password) {
        headers['Authorization'] = `Basic ${btoa(`${this.username}:${this.password}`)}`;
      }

      const response = await fetch(proxyUrl, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      // Mögliche OGC-Antwortstrukturen auflösen
      const items =
        result.collections ||
        result.children ||
        result.features ||
        (Array.isArray(result) ? result : null);

      if (items && Array.isArray(items)) {
        this._fetchedChildren = items;
      }
    } catch (err) {
      this._fetchError = err instanceof Error ? err.message : 'Fehler beim Nachladen';
    } finally {
      this._isLoading = false;
    }
  }

  private _isRecord(val: unknown): val is Record<string, unknown> {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  private _isObjectOrArray(val: unknown): boolean {
    return val !== null && typeof val === 'object';
  }

  override render() {
    const isExpandable = this._isObjectOrArray(this.data);

    return html`
      <div class="node" @click="${this._toggle}">
        <span class="arrow ${this._isOpen ? 'open' : ''}"> ${isExpandable ? '▶' : '•'} </span>

        <span class="label">${this.label}:</span>

        ${!isExpandable
          ? html`<span class="value">${String(this.data)}</span>`
          : html`<span style="color: #888; font-size: 0.8rem;">
              ${Array.isArray(this.data) ? `Array[${this.data.length}]` : 'Object'}
            </span>`}
      </div>

      ${this._isOpen
        ? html`
            <div class="children-container">
              ${this._isLoading ? html`<div>⏳ Lade Unterelemente...</div>` : ''}
              ${this._fetchError ? html`<div class="error">❌ ${this._fetchError}</div>` : ''}

              <!-- 1. Direkte Children aus der API (Array "children") -->
              ${this._renderDirectChildren()}

              <!-- 2. Dynamisch per URL nachgeladene Children -->
              ${this._renderFetchedChildren()}

              <!-- 3. Normales Attribute-Rendern (ohne das children-Array zu doppeln) -->
              ${this._renderProperties()}
            </div>
          `
        : ''}
    `;
  }

  // Rendert ein direktes data.children Array
  private _renderDirectChildren(): TemplateResult | string {
    if (!this._isRecord(this.data) || !Array.isArray(this.data.children)) return '';

    return html`
      <div class="section-title">Kind-Elemente (${this.data.children.length})</div>
      ${this.data.children.map(
        (child, idx) => html`
          <tree-item
            .label="${(child as Record<string, string>).title ||
            (child as Record<string, string>).id ||
            `Kind [${idx}]`}"
            .data="${child}"
            .username="${this.username}"
            .password="${this.password}"
          >
          </tree-item>
        `
      )}
    `;
  }

  // Rendert über HTTP nachgeladene Kindknoten
  private _renderFetchedChildren(): TemplateResult | string {
    if (!this._fetchedChildren) return '';

    return html`
      <div class="section-title">Nachgeladene Elemente (${this._fetchedChildren.length})</div>
      ${this._fetchedChildren.map(
        (child, idx) => html`
          <tree-item
            .label="${(child as Record<string, string>).title ||
            (child as Record<string, string>).id ||
            `Element [${idx}]`}"
            .data="${child}"
            .username="${this.username}"
            .password="${this.password}"
          >
          </tree-item>
        `
      )}
    `;
  }

  // Rendert alle übrigen Attribute des Objekts
  private _renderProperties(): TemplateResult[] | string {
    if (!this._isObjectOrArray(this.data)) return '';

    if (Array.isArray(this.data)) {
      return this.data.map(
        (item, index) => html`
          <tree-item
            .label="${`[${index}]`}"
            .data="${item}"
            .username="${this.username}"
            .password="${this.password}"
          >
          </tree-item>
        `
      );
    }

    // Wenn es ein Objekt ist, filtern wir 'children' heraus, da es oben separat gerendert wird
    const entries = Object.entries(this.data).filter(([key]) => key !== 'children');

    return entries.map(
      ([key, val]) => html`
        <tree-item
          .label="${key}"
          .data="${val}"
          .username="${this.username}"
          .password="${this.password}"
        >
        </tree-item>
      `
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tree-item': TreeItem;
  }
}
