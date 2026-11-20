import { createLab, normalizeLabState, writeLabURL } from './experiments/zero-channels.js';
import { toLabState } from './channels-state.js';

const LAB_URL = new URL('./experiments/zero-channels.html', import.meta.url);
const LAB_CSS_URL = new URL('./experiments/zero-channels.css', import.meta.url);

/**
 * The lab stylesheet is inlined into a shadow root, where its relative
 * url(...) references (including its @import of the shared base sheet) would
 * resolve against the page instead of the stylesheet. Make them absolute.
 */
export function resolveStyleURLs(css, base) {
  return String(css).replace(/url\((['"]?)(\.{1,2}\/[^'")]+)\1\)/g, (_, quote, path) => `url(${quote}${new URL(path, base).href}${quote})`);
}
const MODES = new Set(['channels', 'coupling', 'newton']);
const EMBEDDED_CSS = `
:host{display:block;width:100%;min-width:0;--bg:#09121c;--panel:#0e1c29;--panel-alt:#112330;--line:#2c4556;--text:#e1e9ed;--muted:#96aebd;--green:#c7e8a1;--blue:#83cddd;--orange:#e9b17b;--red:#ee9b9d;--purple:#c3a3e0;background:var(--bg);color:var(--text);font:14px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.embedded-lab{width:100%;min-width:0}.embedded-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--line);padding:0 24px}.embedded-toolbar .view-tabs{max-width:none;margin:0;padding:0;border:0;min-width:0}.embedded-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font:10px/1.5 ui-monospace,monospace}.embedded-actions button,.embedded-actions a{padding:10px 12px;white-space:nowrap}.embedded-actions button{font:inherit}.embedded-actions a{color:var(--muted)}
.lab-layout{max-width:none;padding:0 24px;grid-template-columns:240px minmax(0,1fr);gap:30px}.controls{top:64px;max-height:calc(100dvh - 72px);padding-top:26px}.experiment{padding-top:26px}.experiment-heading h2{font-size:clamp(27px,2.7vw,39px)}.primary-plot .svg-mount{height:clamp(440px,58dvh,660px);min-height:440px}.detail-grid{grid-template-columns:minmax(0,1.2fr) minmax(230px,.8fr)}.toast{position:fixed;z-index:80}
.embedded-status{margin:24px;padding:40px 28px;border:1px solid var(--line);border-radius:6px;background:var(--panel);min-height:320px;display:grid;place-content:center;text-align:center}.embedded-status h2{font:30px/1.2 Georgia,serif;font-weight:400;margin:0 0 12px}.embedded-status p{color:var(--muted);max-width:500px;margin:0 auto 18px}.embedded-status button{justify-self:center;padding:10px 16px}.embedded-status [role=status]{color:var(--green)}
@media(min-width:1500px){.lab-layout{grid-template-columns:260px minmax(0,1fr)}.primary-plot .svg-mount{height:640px}}
@media(max-width:1100px){.embedded-toolbar{align-items:flex-start;flex-direction:column;gap:0;padding-bottom:12px}.lab-layout{grid-template-columns:220px minmax(0,1fr);gap:20px}.detail-grid{grid-template-columns:1fr}.embedded-actions{gap:4px}.embedded-actions button,.embedded-actions a{padding:8px 10px}}
@media(max-width:760px){.embedded-toolbar{padding:0 12px 12px;gap:0;align-items:stretch}.embedded-toolbar .view-tabs{overflow:auto}.embedded-toolbar .view-tabs button{padding:15px 10px}.embedded-actions{justify-content:flex-start}.embedded-actions button,.embedded-actions a{font-size:9px;padding:8px}.lab-layout{display:flex;flex-direction:column;padding:0 16px;gap:0}.controls{position:static;max-height:none;padding-top:20px;grid-template-columns:1fr 1fr}.experiment{padding-top:22px}.primary-plot .svg-mount{height:440px;min-height:380px}.detail-grid{grid-template-columns:1fr}.embedded-status{margin:16px;padding:32px 18px}}
@media(max-width:390px){.lab-layout{padding:0 10px}.embedded-toolbar .view-tabs button{font-size:10px;padding:14px 8px}.primary-plot .svg-mount{height:400px;min-height:350px}}
`;

function scopedDocument(root, doc) {
  return {
    getElementById: id => root.getElementById(id),
    querySelectorAll: selector => root.querySelectorAll(selector),
    get hidden() { return doc.hidden; },
    addEventListener: (...args) => doc.addEventListener(...args),
    removeEventListener: (...args) => doc.removeEventListener(...args),
  };
}

/** A native main-app mode. The numerical UI is reused inside an isolated DOM;
 * its state is reported to the app, which alone owns history and shared URLs.
 */
export class ChannelsPanel {
  constructor(el, { onChange = () => {}, onCopyLink = null, onCommand = () => {},
    fetch: fetcher = globalThis.fetch, Worker: WorkerClass = globalThis.Worker,
    createLab: labFactory = createLab, DOMParser: Parser = globalThis.DOMParser } = {}) {
    this.el = el;
    this.doc = el.ownerDocument || document;
    this.win = this.doc.defaultView || window;
    this.root = el.shadowRoot || el.attachShadow({ mode: 'open' });
    this.onChange = onChange;
    this.onCopyLink = onCopyLink;
    this.onCommand = onCommand;
    // Native Window.fetch needs its Window receiver, including when passed on
    // to the shared lab as a standalone callback for JSON data loads.
    this.fetcher = fetcher.bind(this.win);
    this.WorkerClass = WorkerClass;
    this.labFactory = labFactory;
    this.Parser = Parser;
    this.lab = null;
    this.active = false;
    this.loading = false;
    this.destroyed = false;
    this.generation = 0;
    this.assetsPromise = null;
    this.settings = null;
    this.latestLabState = normalizeLabState();
    this.ready = Promise.resolve();
  }

  update(settings, { restore = false } = {}) {
    if (this.destroyed) return this.ready;
    this.settings = { ...settings };
    this.latestLabState = toLabState(settings);
    if (!MODES.has(settings?.channelsMode)) {
      this.deactivate();
      return this.ready;
    }
    this.active = true;
    if (this.lab) {
      this.lab.update(this.latestLabState, { restore });
      this._syncStandalone();
    } else if (!this.loading) this.ready = this._activate();
    return this.ready;
  }

  async _loadAssets() {
    const responses = await Promise.all([this.fetcher(LAB_URL), this.fetcher(LAB_CSS_URL)]);
    for (const response of responses) if (!response.ok) throw new Error(`Channel resources: HTTP ${response.status}`);
    const [html, css] = await Promise.all(responses.map(response => response.text()));
    return { html, css: resolveStyleURLs(css, LAB_CSS_URL) };
  }

  _status(title, message, retry = false) {
    const style = this.doc.createElement('style'); style.textContent = EMBEDDED_CSS;
    const box = this.doc.createElement('section'); box.className = 'embedded-status';
    const heading = this.doc.createElement('h2'); heading.textContent = title;
    const note = this.doc.createElement('p'); note.textContent = message; note.setAttribute('role', 'status');
    box.append(heading, note);
    if (retry) {
      const button = this.doc.createElement('button'); button.type = 'button'; button.textContent = 'Retry channels';
      button.onclick = () => { this.assetsPromise = null; if (this.active && !this.loading) this.ready = this._activate(); };
      box.append(button);
    }
    this.root.replaceChildren(style, box);
  }

  _mountAssets({ html, css }) {
    const source = new this.Parser().parseFromString(html, 'text/html');
    const layout = source.querySelector('.lab-layout'), tabs = source.querySelector('.view-tabs');
    const copy = source.getElementById('copy-link'), toast = source.getElementById('toast');
    if (!layout || !tabs || !copy || !toast) throw new Error('The channel interface template is incomplete.');

    const style = this.doc.createElement('style');
    // :root/body do not cross a ShadowRoot; the imported lab variables and base
    // typography therefore belong to :host instead. Other selectors stay local.
    style.textContent = css.replace(':root{', ':host{').replace('body{', ':host{') + '\n' + EMBEDDED_CSS;
    const wrapper = this.doc.createElement('div'); wrapper.className = 'embedded-lab';
    const toolbar = this.doc.createElement('div'); toolbar.className = 'embedded-toolbar';
    const actions = this.doc.createElement('div'); actions.className = 'embedded-actions';
    const exportButton = this.doc.createElement('button'); exportButton.type = 'button'; exportButton.textContent = 'Export session';
    exportButton.onclick = () => { this.flush(); this.onCommand('export-session'); };
    const standalone = this.doc.createElement('a'); standalone.textContent = 'Standalone lab ↗'; standalone.target = '_blank'; standalone.rel = 'noopener noreferrer';
    standalone.id = 'standalone-link';
    actions.append(this.doc.importNode(copy, true), exportButton, standalone);
    toolbar.append(this.doc.importNode(tabs, true), actions);
    wrapper.append(toolbar, this.doc.importNode(layout, true), this.doc.importNode(toast, true));
    for (const anchor of wrapper.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');
      if (href) anchor.setAttribute('href', new URL(href, LAB_URL).href);
    }
    this.root.replaceChildren(style, wrapper);
    this._syncStandalone();
    return scopedDocument(this.root, this.doc);
  }

  async _activate() {
    const generation = ++this.generation;
    this.loading = true;
    this._status('Loading zero channels.', 'Preparing the trajectories, coupling network, and channel certificates.');
    try {
      const assets = await (this.assetsPromise ||= this._loadAssets());
      if (this.destroyed || !this.active || generation !== this.generation) return;
      const doc = this._mountAssets(assets);
      const lab = this.labFactory({ window: this.win, document: doc, fetch: this.fetcher,
        Worker: this.WorkerClass, manageURL: false, initialState: this.latestLabState,
        onCopyLink: this.onCopyLink,
        onChange: (next, meta) => {
          if (this.destroyed || !this.active || this.lab !== lab) return;
          this.latestLabState = normalizeLabState(next);
          this._syncStandalone();
          this.onChange({ ...this.latestLabState }, meta);
        },
      });
      this.lab = lab;
      this.loading = false;
      await lab.ready;
    } catch (error) {
      if (this.destroyed || !this.active || generation !== this.generation) return;
      this.loading = false;
      this.assetsPromise = null;
      this.lab?.destroy(); this.lab = null;
      this._status('Channels could not load.', error.message || 'Reload this view to retry.', true);
    }
  }

  _syncStandalone() {
    const link = this.root.getElementById('standalone-link');
    if (link) link.href = writeLabURL(LAB_URL, this.latestLabState);
  }

  pause() { this.lab?.pause(); }
  flush() { return this.lab?.flush() || { ...this.latestLabState }; }
  togglePlay() { this.lab?.togglePlay(); }
  reset() { this.lab?.reset(); }
  getSnapshot() { return this.lab?.getSnapshot() || null; }
  getState() { return this.lab?.getState() || { ...this.latestLabState }; }
  exportData() {
    return { schema: 'zeta-observatory/zero-channels-session/1', state: this.getState(),
      snapshot: this.getSnapshot(), standaloneURL: writeLabURL(LAB_URL, this.getState()) };
  }

  deactivate() {
    if (!this.active && !this.lab && !this.loading) return;
    this.active = false;
    this.loading = false;
    this.generation++;
    this.lab?.destroy(); this.lab = null;
  }

  destroy() {
    if (this.destroyed) return;
    this.deactivate();
    this.destroyed = true;
    this.root.replaceChildren();
  }
}
