import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHANNELS_DEFAULTS, CHANNELS_VIEW_NAMES, normalizeChannelsConfig,
  createChannelsPresets, toLabState, fromLabState,
} from '../dist/channels-state.js';
import { LAB_DEFAULTS, normalizeLabState } from '../dist/experiments/zero-channels.js';
import { QUARTIC_COLLISION_TAU } from '../dist/zero-channels-math.js';
import { encodeViewURL, decodeViewURL, ViewURLController } from '../dist/view-url.js';

const origin = 'https://zeta-view.vercel.app/';
const defaults = {
  ...CHANNELS_DEFAULTS, researchMode: 'off', dynamicsMode: 'off', fiberMode: 'off',
  projective: false, geometry: 'plane', function: 'xi', height: 1.1,
  playing: false, autoRotate: false, packets: false,
};
const channelPresets = createChannelsPresets(defaults);
const presets = {
  ...channelPresets,
  critical: { settings: { ...defaults } },
  sphere: { settings: { ...defaults, geometry: 'sphere' } },
  klein: { settings: { ...defaults, geometry: 'klein', projective: true } },
  annulus: { settings: { ...defaults, geometry: 'annulus', projective: true } },
  bridgeShear: { settings: { ...defaults, researchMode: 'shear' } },
};
const validate = state => ({ ...state, ...normalizeChannelsConfig(state), playing: false });
const options = { defaults, presets, validate };

test('main-app channel controls cover every standalone lab setting without importing transient state', () => {
  assert.deepEqual(toLabState(CHANNELS_DEFAULTS), LAB_DEFAULTS);
  const raw = normalizeLabState({
    view: 'newton', model: 'quartic', frame: 124.8, end: -.25, branch: 3,
    direction: 'increase', radiusScale: 1.1220185, spread: .4, seed: 94,
    newtonTime: 12.75, seedCount: 20, perturbationTime: .5, travel: .37,
  });
  const app = fromLabState({ ...raw, playing: true, notes: 'private', camera: { distance: 7 } });
  assert.deepEqual(Object.keys(app), Object.keys(CHANNELS_DEFAULTS));
  assert.deepEqual(toLabState(app), raw);
  assert.equal(app.channelsMode, 'newton');
  assert.equal(Object.hasOwn(app, 'playing'), false);
  assert.equal(Object.hasOwn(app, 'notes'), false);
  assert.equal(Object.hasOwn(app, 'camera'), false);
  assert.equal(CHANNELS_DEFAULTS.channelsMode, 'off');
});

test('each channel preset has a short root-app URL and leaves other workbenches inactive', () => {
  for (const [name, entry] of Object.entries(channelPresets)) {
    const href = encodeViewURL(origin, { state: entry.settings }, { ...options, name });
    assert.equal(href, origin + '?view=' + name);
    const decoded = decodeViewURL(href, options);
    assert.equal(decoded.valid, true);
    assert.deepEqual(decoded.session.state, entry.settings);
    for (const key of ['researchMode', 'dynamicsMode', 'fiberMode']) assert.equal(entry.settings[key], 'off');
    assert.equal(entry.settings.projective, false);
    assert.equal(entry.settings.geometry, 'plane');
    assert.equal(entry.settings.playing, false);
  }
  for (const [mode, name] of Object.entries(CHANNELS_VIEW_NAMES)) {
    assert.equal(channelPresets[name].settings.channelsMode, mode);
  }
  const quartet = decodeViewURL(origin + '?view=channelsQuartet', options).session.state;
  assert.equal(quartet.channelsFrame, 124.8);
  assert.equal(quartet.channelsEnd, -.25);
  assert.equal(quartet.channelsModel, 'quartic');
});

test('all selected channel parameters survive a canonical app URL with exact fractional quartet time', () => {
  const state = {
    ...channelPresets.newton.settings,
    ...fromLabState({
      view: 'newton', model: 'quartic', frame: 124.8, branch: 3,
      radiusScale: .34123456789012345, direction: 'increase', spread: .65,
      seed: 678, seedCount: 16, newtonTime: 14.125,
      perturbationTime: .75, travel: .4321987654321,
    }),
    playing: true, channelsPlaying: true, notes: 'exclude this',
  };
  const href = encodeViewURL(origin, { state }, { ...options, name: 'newton' });
  const decoded = decodeViewURL(href, options);
  assert.equal(decoded.valid, true);
  for (const key of Object.keys(CHANNELS_DEFAULTS)) assert.equal(decoded.session.state[key], state[key], key);
  assert.equal(decoded.session.state.playing, false);
  assert.equal(Object.hasOwn(decoded.session.state, 'channelsPlaying'), false);
  assert.equal(Object.hasOwn(decoded.session.state, 'notes'), false);
  assert.equal(decoded.session.state.channelsFrame, 124.8);
  assert.equal(encodeViewURL(href, decoded.session, { ...options, name: decoded.name }), href);
});

test('collision checkpoints remain algebraic and cannot leak into actual theta state', () => {
  const state = {
    ...channelPresets.coupling.settings,
    ...fromLabState({ view: 'coupling', model: 'quartic', checkpoint: 'collision', frame: 240 }),
  };
  const href = encodeViewURL(origin, { state }, { ...options, name: 'coupling' });
  const restored = decodeViewURL(href, options).session.state;
  assert.equal(restored.channelsCheckpoint, 'collision');
  assert.equal(restored.channelsFrame, -960 * QUARTIC_COLLISION_TAU);
  assert.equal(restored.channelsEnd, -.25);
  const theta = normalizeChannelsConfig({ ...restored, channelsModel: 'theta', channelsFrame: 61.7 });
  assert.equal(theta.channelsCheckpoint, '');
  assert.equal(theta.channelsFrame, 62);
  assert.equal(theta.channelsEnd, -.2);
});

test('invalid URL controls cannot create modes, unbounded work or a forged collision', () => {
  const bad = JSON.parse('{"channelsMode":"missing","channelsModel":"theta","channelsFrame":1e300,"channelsEnd":-0.25,"channelsBranch":99,"channelsDirection":"sideways","channelsRadiusScale":-2,"channelsSeed":0,"channelsSeedCount":100000,"channelsNewtonTime":999,"channelsCheckpoint":"collision","channelsTravel":4,"channelsPlaying":true,"__proto__":{"polluted":true}}');
  const href = origin + '?' + new URLSearchParams({ view: 'channels', state: JSON.stringify(bad) });
  const decoded = decodeViewURL(href, options);
  assert.equal(decoded.valid, true);
  const s = decoded.session.state;
  assert.equal(s.channelsMode, 'off');
  assert.equal(s.channelsFrame, 240);
  assert.equal(s.channelsEnd, -.2);
  assert.equal(s.channelsBranch, 2);
  assert.equal(s.channelsDirection, 'decrease');
  assert.equal(s.channelsRadiusScale, .1);
  assert.equal(s.channelsSeed, 1);
  assert.equal(s.channelsSeedCount, 24);
  assert.equal(s.channelsNewtonTime, 18);
  assert.equal(s.channelsCheckpoint, '');
  assert.equal(s.channelsTravel, 1);
  assert.equal(Object.hasOwn(s, 'channelsPlaying'), false);
  assert.equal({}.polluted, undefined);
  for (const suffix of ['?view=channels&view=newton', '?view=channels&state=[]', '?view=channels&state={bad']) {
    assert.equal(decodeViewURL(origin + suffix, options).valid, false);
  }
  const clean = normalizeChannelsConfig({ channelsFrame: NaN, channelsRadiusScale: Infinity, channelsSeed: '7' });
  assert.equal(clean.channelsFrame, 0);
  assert.equal(clean.channelsRadiusScale, 1);
  assert.equal(clean.channelsSeed, 1);
});

test('automatic URL naming follows the active channel view while existing app modes retain their names', () => {
  for (const mode of ['channels', 'coupling', 'newton']) {
    const state = { ...defaults, channelsMode: mode, channelsFrame: 239, channelsTravel: .03, channelsSeed: 991, height: .2 };
    const decoded = decodeViewURL(encodeViewURL(origin, { state }, options), options);
    assert.equal(decoded.name, mode);
    assert.equal(decoded.session.state.channelsMode, mode);
  }
  for (const name of ['sphere', 'klein', 'annulus', 'bridgeShear']) {
    const state = { ...presets[name].settings, channelsFrame: 60, channelsSeed: 177 };
    const decoded = decodeViewURL(encodeViewURL(origin, { state }, options), options);
    assert.equal(decoded.name, name);
    assert.equal(decoded.session.state.channelsMode, 'off');
  }
});

class HistoryWindow {
  constructor(href) {
    this.location = { href }; this.entries = [href]; this.index = 0; this.events = new Map();
    this.setTimeout = setTimeout; this.clearTimeout = clearTimeout;
    const write = (push, _, __, url) => {
      if (push) { this.entries.splice(++this.index); this.entries.push(url); }
      else this.entries[this.index] = url;
      this.location.href = url;
    };
    this.history = { pushState: (...args) => write(true, ...args), replaceState: (...args) => write(false, ...args) };
  }
  addEventListener(name, callback) { this.events.set(name, callback); }
  removeEventListener(name) { this.events.delete(name); }
  async back() { if (this.index > 0) { this.location.href = this.entries[--this.index]; await this.events.get('popstate')?.(); } }
}

test('browser Back restores channel settings after a surface view without adding another history entry', async () => {
  const win = new HistoryWindow(origin);
  let state = { ...channelPresets.channels.settings };
  const restored = [];
  const controller = new ViewURLController({
    window: win, ...options, syncAfterRestore: true,
    getSnapshot: () => ({ state }),
    onRestore: session => { state = validate(session.state); restored.push(state); },
  });
  controller.sync({ name: 'channels', immediate: true });
  state = { ...channelPresets.newton.settings, channelsFrame: 60, channelsSeed: 7 };
  controller.sync({ name: 'newton', mode: 'push', immediate: true });
  state = { ...state, channelsFrame: 61, channelsTravel: .4 };
  controller.sync({ name: 'newton', immediate: true });
  state = { ...presets.sphere.settings };
  controller.sync({ name: 'sphere', mode: 'push', immediate: true });
  const count = win.entries.length;
  await win.back();
  assert.equal(state.channelsMode, 'newton');
  assert.equal(state.channelsFrame, 61);
  assert.equal(state.channelsSeed, 7);
  assert.equal(state.channelsTravel, .4);
  assert.equal(state.playing, false);
  assert.equal(win.entries.length, count);
  await win.back();
  assert.equal(state.channelsMode, 'channels');
  assert.equal(state.channelsFrame, 0);
  assert.equal(restored.length, 2);
  controller.dispose();
});
