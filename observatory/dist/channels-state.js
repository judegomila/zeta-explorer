/** Main-app state for the shared zero-channels laboratory.
 *
 * The app owns history, saved sessions, and the active workbench. The lab keeps
 * its existing short field names; only these allowlisted controls cross that
 * boundary. Playback itself is local and is never part of a shared session.
 */
import { normalizeChannelState } from './zero-channels-math.js';

export const CHANNELS_DEFAULTS = Object.freeze({
  channelsMode: 'off', channelsModel: 'theta', channelsFrame: 0,
  channelsEnd: -.2, channelsBranch: 0, channelsDirection: 'decrease',
  channelsRadiusScale: 1, channelsSpread: .25, channelsSeed: 1,
  channelsNewtonTime: 16, channelsSeedCount: 12, channelsPerturbationTime: 1,
  channelsCheckpoint: '', channelsTravel: 1,
});

export const CHANNELS_ENUMS = Object.freeze({
  channelsMode: ['off', 'channels', 'coupling', 'newton'],
  channelsModel: ['theta', 'quartic'],
  channelsEnd: [-.25, -.2, .2],
  channelsDirection: ['decrease', 'increase'],
  channelsCheckpoint: ['', 'collision'],
});

export const CHANNELS_LIMITS = Object.freeze({
  channelsFrame: [0, 240, 1], channelsBranch: [0, 3, 1],
  channelsRadiusScale: [.1, 10, .05], channelsSpread: [.05, 1, .05],
  channelsSeed: [1, 9999, 1], channelsNewtonTime: [.1, 18, .1],
  channelsSeedCount: [4, 24, 1], channelsPerturbationTime: [0, 2, .25],
  channelsTravel: [0, 1, .01],
});

export const CHANNELS_VIEW_NAMES = Object.freeze({
  channels: 'channels', coupling: 'coupling', newton: 'newton',
});

const fields = Object.freeze({
  channelsModel: 'model', channelsFrame: 'frame', channelsEnd: 'end',
  channelsBranch: 'branch', channelsDirection: 'direction',
  channelsRadiusScale: 'radiusScale', channelsSpread: 'spread',
  channelsSeed: 'seed', channelsNewtonTime: 'newtonTime',
  channelsSeedCount: 'seedCount', channelsPerturbationTime: 'perturbationTime',
  channelsCheckpoint: 'checkpoint', channelsTravel: 'travel',
});
const own = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

/** Return prefixed controls only. Other app modes remain the app's decision. */
export function normalizeChannelsConfig(input = {}) {
  const out = { ...CHANNELS_DEFAULTS };
  for (const key of Object.keys(out)) {
    const value = input?.[key];
    if (CHANNELS_ENUMS[key]) {
      if (CHANNELS_ENUMS[key].includes(value)) out[key] = value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      const [min, max] = CHANNELS_LIMITS[key];
      out[key] = Math.max(min, Math.min(max, value));
    }
  }
  const raw = { view: out.channelsMode === 'off' ? 'channels' : out.channelsMode };
  for (const [appKey, labKey] of Object.entries(fields)) raw[labKey] = out[appKey];
  // Keep the same family-dependent frame, branch and collision rules as the
  // numerical engine. A fractional quartet frame must never be rounded away.
  const normalized = normalizeChannelState(raw);
  for (const [appKey, labKey] of Object.entries(fields)) {
    if (labKey !== 'travel') out[appKey] = normalized[labKey];
  }
  return out;
}

export function toLabState(appState = {}) {
  const clean = normalizeChannelsConfig(appState);
  const out = { view: clean.channelsMode === 'off' ? 'channels' : clean.channelsMode };
  for (const [appKey, labKey] of Object.entries(fields)) out[labKey] = clean[appKey];
  return out;
}

/** Convert a lab callback to a complete, allowlisted app-state patch. */
export function fromLabState(labState = {}) {
  const patch = {
    channelsMode: own(CHANNELS_VIEW_NAMES, labState?.view) ? labState.view : 'channels',
  };
  for (const [appKey, labKey] of Object.entries(fields)) {
    if (own(labState, labKey)) patch[appKey] = labState[labKey];
  }
  return normalizeChannelsConfig(patch);
}

/** Starting points share the main app's saved-session and URL schema. */
export function createChannelsPresets(defaults = {}) {
  const base = {
    ...defaults, ...CHANNELS_DEFAULTS,
    researchMode: 'off', dynamicsMode: 'off', fiberMode: 'off',
    projective: false, geometry: 'plane', function: 'xi',
    playing: false, autoRotate: false, packets: false,
  };
  return {
    channels: {
      settings: { ...base, channelsMode: 'channels' },
      note: 'Follow moving zero channels and inspect their one-zero certificates in the actual theta family and an exact quartet.',
    },
    coupling: {
      settings: { ...base, channelsMode: 'coupling' },
      note: 'Inspect inverse squared gap coupling and the direction-dependent growth of a frozen perturbation.',
    },
    newton: {
      settings: { ...base, channelsMode: 'newton' },
      note: 'Guide reproducible probes through a fixed analytic field toward its existing zeros.',
    },
    channelsQuartet: {
      settings: { ...base, channelsMode: 'channels', channelsModel: 'quartic', channelsFrame: 124.8, channelsEnd: -.25 },
      note: 'Four disjoint certified channels at τ = −0.13, before the exact quartet collision.',
    },
  };
}
