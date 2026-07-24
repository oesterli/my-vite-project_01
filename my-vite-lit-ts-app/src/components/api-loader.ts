import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

// Typendefinition für die OGC Collection (optional, aber typensicher)
interface Collection {
  id: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

interface ApiResponse {
  collections?: Collection[];
  [key: string]: unknown;
}

@customElement('api-loader')
export class ApiLoader extends LitElement {
  // 1. Offene Properties für den Login definieren (von außen setzbar)
  @property({ type: String }) username = '';
  @property({ type: String }) password = '';

  // Interne reaktive Zustände mit Type-Annotations
  @state()
  private _collections: Collection[] = [];

  @state()
  private _loading: boolean = true;

  @state()
  private _error: string | null = null;

  static override styles = css`
    :host {
      display: block;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      max-width: 800px;
      margin: 1rem auto;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    .error {
      color: #d93025;
      background-color: #fce8e6;
      padding: 12px;
      border-radius: 4px;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      padding: 10px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border-left: 4px solid #0056b3;
      border-radius: 2px;
    }

    li h3 {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
    }

    li p {
      margin: 0;
      color: #555;
      font-size: 0.9rem;
    }

    pre {
      background: #1e1e1e;
      color: #00ff66;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      max-height: 300px;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this._fetchCollections();
  }

  private async _fetchCollections(): Promise<void> {
    //const url = 'https://ogc-api.gst-viewer.swissgeol.ch/collections';
    // vite proxy configuration will redirect this to the actual API endpoint
    const url = '/api-swissgeol/collections';

    try {
      this._loading = true;
      this._error = null;

      // 2. HTTP Header aufbauen
      const headers: HeadersInit = {
        Accept: 'application/json',
      };

      // 3. Wenn Zugangsdaten vorhanden sind, den Authorization Header ergänzen
      if (this.username && this.password) {
        // btoa() kodiert den String 'username:password' in Base64
        const credentials = btoa(`${this.username}:${this.password}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }

      const response = await fetch(url, { headers });

      if (response.status === 401) {
        throw new Error('401 Unauthorized: Zugangsdaten falsch oder fehlend.');
      }

      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      this._collections = data.collections ?? [];
    } catch (err) {
      console.error('Fehler beim Laden der API-Daten:', err);
      this._error = err instanceof Error ? err.message : 'Unbekannter Fehler';
    } finally {
      this._loading = false;
    }
  }

  override render() {
    if (this._loading) {
      return html`<p>⏳ Lade OGC Collections von SwissGeol...</p>`;
    }

    if (this._error) {
      return html` <div class="error"><strong>Fehler beim Laden:</strong> ${this._error}</div> `;
    }

    return html`
      <h2>OGC API Collections (${this._collections.length})</h2>

      <ul>
        ${this._collections.map(
          (col) => html`
            <li>
              <h3>${col.title || col.id}</h3>
              <p>${col.description || 'Keine Beschreibung verfügbar.'}</p>
            </li>
          `
        )}
      </ul>

      <details>
        <summary>Roh-JSON anzeigen</summary>
        <pre><code>${JSON.stringify(this._collections, null, 2)}</code></pre>
      </details>
    `;
  }
}

// Globales Type-Mapping für TSX/HTML-Autovervollständigung (optional)
declare global {
  interface HTMLElementTagNameMap {
    'api-loader': ApiLoader;
  }
}
