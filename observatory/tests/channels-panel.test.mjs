import test from 'node:test';
import assert from 'node:assert/strict';
import { ChannelsPanel, resolveStyleURLs } from '../dist/channels-panel.js';
import { CHANNELS_DEFAULTS } from '../dist/channels-state.js';

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
class Element {
  constructor(tag = 'div') { this.tagName = tag; this.children = []; this.attributes = {}; this.textContent = ''; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attributes[key] = value; }
}
function harness({ fetcher, onChange = () => {} } = {}) {
  const standalone = {}, shadow = new Element(); shadow.getElementById = id => id === 'standalone-link' ? standalone : null;
  const doc = { createElement: tag => new Element(tag), defaultView: {} };
  const host = { ownerDocument: doc, attachShadow: () => shadow };
  const labs = [], requests = [], mounts = [];
  class TestPanel extends ChannelsPanel {
    _mountAssets(assets) { mounts.push(assets); return { scoped: true }; }
  }
  const panel = new TestPanel(host, {
    onChange,
    fetch: function (url) { requests.push(String(url)); return fetcher ? fetcher.call(this, url) : Promise.resolve({ ok: true, text: async () => 'asset' }); },
    createLab: options => {
      const lab = {
        options, ready: Promise.resolve(), state: options.initialState, destroyed: false, updates: [],
        update(state, meta) { this.state = state; this.updates.push({ state, meta }); },
        getState() { return this.state; }, getSnapshot() { return { state: this.state, sample: true }; },
        flush() { options.onChange(this.state, { mode: 'replace', immediate: true }); return this.state; },
        pause() { this.paused = true; }, togglePlay() { this.played = true; }, reset() { this.resetCalled = true; },
        destroy() { this.destroyed = true; },
      };
      labs.push(lab); return lab;
    },
  });
  return { panel, labs, requests, mounts, shadow, standalone, win: doc.defaultView };
}

test('asset and lab data fetches keep the native Window receiver', async () => {
  const receivers = [];
  const h = harness({ fetcher: function () {
    receivers.push(this);
    if (this !== h.win) throw new TypeError('Illegal invocation');
    return Promise.resolve({ ok: true, text: async () => 'asset', json: async () => ({ sample: true }) });
  } });
  await h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'channels' });
  assert.equal(h.labs.length, 1);
  const loadData = h.labs[0].options.fetch;
  await loadData(new URL('../dist/experiments/zero-confinement-theta.json', import.meta.url));
  await loadData(new URL('../dist/experiments/zero-channel-bounds.json', import.meta.url));
  assert.equal(receivers.length, 4);
  assert.ok(receivers.every(receiver => receiver === h.win));
  h.panel.destroy();
});

test('switching away during asset loading never mounts a hidden lab; reopening uses the latest state', async () => {
  const assets = deferred(), h = harness({ fetcher: () => assets.promise });
  const first = h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'channels', channelsFrame: 12 });
  h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'off' });
  assets.resolve({ ok: true, text: async () => 'asset' }); await first;
  assert.equal(h.labs.length, 0); assert.equal(h.mounts.length, 0);
  await h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'newton', channelsModel: 'quartic', channelsFrame: 144 });
  assert.equal(h.labs.length, 1); assert.equal(h.requests.length, 2);
  assert.equal(h.labs[0].options.initialState.view, 'newton'); assert.equal(h.labs[0].options.initialState.frame, 144);
  assert.equal(h.labs[0].options.manageURL, false); assert.deepEqual(h.labs[0].options.document, { scoped: true });
  h.panel.destroy();
});

test('deactivation terminates the lab and suppresses its late callbacks into the app URL state', async () => {
  const changes = [], h = harness({ onChange: (...args) => changes.push(args) });
  await h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'channels' });
  const first = h.labs[0]; first.options.onChange({ ...first.state, frame: 60 }, { mode: 'push' });
  assert.equal(changes.length, 1); assert.equal(changes[0][0].frame, 60);
  h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'off' }); assert.equal(first.destroyed, true);
  first.options.onChange({ ...first.state, frame: 120 }, { mode: 'replace' }); assert.equal(changes.length, 1);
  await h.panel.update({ ...CHANNELS_DEFAULTS, channelsMode: 'coupling' });
  assert.equal(h.labs.length, 2); assert.equal(h.labs[1].state.view, 'coupling');
  first.options.onChange({ ...first.state, frame: 180 }, { mode: 'replace' }); assert.equal(changes.length, 1);
  h.panel.destroy(); assert.equal(h.labs[1].destroyed, true); assert.equal(h.shadow.children.length, 0);
});

test('restore intent, playback commands, and exported state reach the current embedded lab', async () => {
  const h = harness(); const state = { ...CHANNELS_DEFAULTS, channelsMode: 'newton', channelsSeed: 8, channelsTravel: .4 };
  await h.panel.update(state); const lab = h.labs[0];
  h.panel.update(state, { restore: true }); assert.equal(lab.updates.at(-1).meta.restore, true);
  h.panel.togglePlay(); h.panel.pause(); h.panel.reset();
  assert.equal(lab.played, true); assert.equal(lab.paused, true); assert.equal(lab.resetCalled, true);
  const exported = h.panel.exportData();
  assert.equal(exported.state.view, 'newton'); assert.equal(exported.state.seed, 8); assert.equal(exported.state.travel, .4);
  assert.equal(exported.snapshot.sample, true); assert.match(exported.standaloneURL, /view=newton/); assert.match(h.standalone.href, /seed=8/);
  h.panel.destroy();
});

test('inlined lab styles keep their relative imports pointing at the stylesheet folder', () => {
  const base = 'https://example.test/observatory/experiments/zero-channels.css';
  assert.equal(resolveStyleURLs("@import url('./zero-confinement.css');a{b:url(../x.png)}", base),
    "@import url('https://example.test/observatory/experiments/zero-confinement.css');a{b:url(https://example.test/observatory/x.png)}");
  // Absolute, data and fragment references are left alone.
  const untouched = 'a{b:url(data:image/png;base64,AA)}c{d:url(#g)}e{f:url(https://example.test/y.css)}';
  assert.equal(resolveStyleURLs(untouched, base), untouched);
});
