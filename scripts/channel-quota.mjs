#!/usr/bin/env node
// imp-880: channel quota telemetry.
//
// PURPOSE
// -------
// Engines (auto-improve*.sh) default to channel = "subscription" (the
// user's Max plan). When that channel is near its rolling-window cap, we
// want to downgrade to channel = "api" (pay-per-token ANTHROPIC_API_KEY)
// to keep work flowing rather than wait.
//
// This script maintains scripts/.channel-quota.json with a rough estimate
// of subscription token usage in a rolling 5-hour window (matches the
// documented Claude Pro / Max quota reset cadence).
//
// USAGE
// -----
//   node scripts/channel-quota.mjs log <tokensIn> <tokensOut>   # after a claude run
//   node scripts/channel-quota.mjs status                       # current state
//   node scripts/channel-quota.mjs recommend                    # prints 'subscription' or 'api'
//
// The engine scripts consult `recommend` before invoking claude and pass
// --api-key when the recommendation is 'api'.
//
// THRESHOLDS
// ----------
// Default 5-hour window, default cap 500K input tokens per window (placeholder).
// Override via env: CHANNEL_WINDOW_MIN, CHANNEL_CAP_INPUT, CHANNEL_CAP_OUTPUT.
// Real quota values depend on plan; tune after observing actual 429s.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const STATE_FILE = path.join(__dirname, '.channel-quota.json');

const WINDOW_MS         = parseInt(process.env.CHANNEL_WINDOW_MIN || '300', 10) * 60 * 1000;
const CAP_INPUT_TOKENS  = parseInt(process.env.CHANNEL_CAP_INPUT  || '500000', 10);
const CAP_OUTPUT_TOKENS = parseInt(process.env.CHANNEL_CAP_OUTPUT || '100000', 10);
const WARN_FRACTION     = 0.85;

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { entries: [], lastUpdatedAt: null };
  }
}

function pruneWindow(state) {
  const cutoff = Date.now() - WINDOW_MS;
  state.entries = state.entries.filter((e) => e.at >= cutoff);
  return state;
}

function sumWindow(state) {
  let tokensIn = 0, tokensOut = 0;
  for (const e of state.entries) { tokensIn += e.in; tokensOut += e.out; }
  return { tokensIn, tokensOut };
}

function save(state) {
  state.lastUpdatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function cmdLog(tokensIn, tokensOut) {
  const state = pruneWindow(loadState());
  state.entries.push({ at: Date.now(), in: tokensIn, out: tokensOut });
  save(state);
  const totals = sumWindow(state);
  const pctIn  = ((totals.tokensIn  / CAP_INPUT_TOKENS)  * 100).toFixed(1);
  const pctOut = ((totals.tokensOut / CAP_OUTPUT_TOKENS) * 100).toFixed(1);
  console.log(`logged in=${tokensIn} out=${tokensOut}; window: in=${totals.tokensIn} (${pctIn}%), out=${totals.tokensOut} (${pctOut}%)`);
}

function cmdStatus() {
  const state = pruneWindow(loadState());
  const totals = sumWindow(state);
  const pctIn  = (totals.tokensIn  / CAP_INPUT_TOKENS);
  const pctOut = (totals.tokensOut / CAP_OUTPUT_TOKENS);
  const windowMin = WINDOW_MS / 60000;
  console.log(JSON.stringify({
    windowMinutes:  windowMin,
    capInput:       CAP_INPUT_TOKENS,
    capOutput:      CAP_OUTPUT_TOKENS,
    usedInput:      totals.tokensIn,
    usedOutput:     totals.tokensOut,
    pctInput:       pctIn,
    pctOutput:      pctOut,
    warnFraction:   WARN_FRACTION,
    warn:           pctIn >= WARN_FRACTION || pctOut >= WARN_FRACTION,
    exhausted:      pctIn >= 1 || pctOut >= 1,
    entries:        state.entries.length,
    lastUpdatedAt:  state.lastUpdatedAt,
  }, null, 2));
}

function cmdRecommend() {
  const state = pruneWindow(loadState());
  const totals = sumWindow(state);
  const pctIn  = totals.tokensIn  / CAP_INPUT_TOKENS;
  const pctOut = totals.tokensOut / CAP_OUTPUT_TOKENS;
  if (pctIn >= 1 || pctOut >= 1) {
    // Exhausted — only option is API (if key available) or wait
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('api');
      process.exit(0);
    }
    console.log('wait');
    process.exit(0);
  }
  // Below cap — use subscription
  console.log('subscription');
  process.exit(0);
}

const cmd = process.argv[2];
switch (cmd) {
  case 'log':
    cmdLog(
      parseInt(process.argv[3] || '0', 10),
      parseInt(process.argv[4] || '0', 10),
    );
    break;
  case 'status':
    cmdStatus();
    break;
  case 'recommend':
    cmdRecommend();
    break;
  default:
    console.error('usage: channel-quota.mjs {log <in> <out> | status | recommend}');
    process.exit(2);
}
