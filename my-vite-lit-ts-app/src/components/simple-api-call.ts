import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('simple-api-call')
export class SimpleApiCall extends LitElement {
  // Optionale Props für Authentifizierung
  @property({ type: String }) username = '';
  @property({ type: String }) password = '';

  // Zustand für die Endpunkt-Erweiterung (Standardwert)
  @state() private _urlExtension: string = '/collections';

  @state() private _jsonResult: string = '';
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

    /* Styling für die Eingabeleiste */
    .input-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    input[type='text'] {
      flex-grow: 1;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
    }

    input[type='text']:focus {
      outline: none;
      border-color: #0056b3;
    }

    button {
      padding: 8px 16px;
      background-color: #0056b3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    button:hover {
      background-color: #004085;
    }

    .status {
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .loading {
      background-color: #e3f2fd;
      color: #0d47a1;
    }

    .error {
      background-color: #fce8e6;
      color: #d93025;
    }

    /* Formatierter Code-Block für das JSON */
    pre {
      background-color: #1e1e1e;
      color: #75beff;
      padding: 12px;
      border-radius: 6px;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
      font-size: 0.85rem;
      line-height: 1.4;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this._fetchData();
  }

  // Wird aufgerufen, wenn der Benutzer im Input-Feld tippt
  private _onInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this._urlExtension = input.value;
  }

  // Wird beim Absenden des Formulars (Klick oder ENTER) ausgeführt
  private _handleSubmit(e: Event) {
    e.preventDefault(); // Verhindert Neuladen der Seite
    this._fetchData();
  }

  private async _fetchData(): Promise<void> {
    // Kombinierte URL aus Proxy-Basis und dynamischer Extension
    const url = `/api-swissgeol${this._urlExtension}`;

    try {
      this._loading = true;
      this._error = null;

      const headers: HeadersInit = {
        Accept: 'application/json',
      };

      if (this.username && this.password) {
        headers['Authorization'] = `Basic ${btoa(`${this.username}:${this.password}`)}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
      }

      const data = await response.json();
      this._jsonResult = JSON.stringify(data, null, 2);
    } catch (err) {
      console.error('API Fetch-Fehler:', err);
      this._error = err instanceof Error ? err.message : 'Fehler beim Laden';
    } finally {
      this._loading = false;
    }
  }

  override render() {
    return html`
      <!-- Formular für das Eingabefeld -->
      <form class="input-bar" @submit="${this._handleSubmit}">
        <input
          type="text"
          .value="${this._urlExtension}"
          @input="${this._onInputChange}"
          placeholder="/collections"
        />
        <button type="submit">Laden</button>
      </form>

      <!-- Statusmeldungen -->
      ${this._loading
        ? html`<div class="status loading">⏳ Lade ${this._urlExtension}...</div>`
        : ''}
      ${this._error ? html`<div class="status error">❌ Fehler: ${this._error}</div>` : ''}

      <!-- Roh-JSON Ergebnis -->
      ${!this._loading && !this._error ? html`<pre><code>${this._jsonResult}</code></pre>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-api-call': SimpleApiCall;
  }
}
