#!/usr/bin/env node
// imp-1142: API channel engine -- one cycle.
//
// Invoked by scripts/auto-improve-api.sh in lieu of `claude --print`.
// Reads ANTHROPIC_API_KEY from env and dispatches one improvement turn
// against the Anthropic REST API via @anthropic-ai/sdk. This is the 5th
// engine variant in the harness (alongside the 4 subscription-channel
// engines that drive claude --print).
//
// Honest scope:
//   - If ANTHROPIC_API_KEY is absent, exit code 78 (EX_CONFIG) with a
//     documented message. The shell wrapper interprets this as "no key"
//     and stops cleanly without burning further loop iterations.
//   - If the SDK is not installed, exit code 79.
//   - On the FIRST run of an engine process, perform a small preflight
//     (token-count of a 1-line prompt) so we fail before consuming any
//     completion quota. Subsequent runs skip the preflight.
//
// Output contract:
//   - Print the model assistant reply text to stdout (so the shell can
//     tee it into the run log just like claude --print does).
//   - Print an "Input tokens: N" + "Output tokens: M" footer so the
//     existing engine-channel-hook.sh logger can pick the counts up
//     without code changes.
//
// IMPORTANT: this script DOES NOT edit files itself. It only sends a
// prompt to the API and prints the reply. The reply may contain edit
// instructions; the model is asked to ALSO commit changes via tool
// invocations, but the SDK call here is text-only. For the engine to
// actually mutate files, the planned follow-on imp-1142-sub-tool-use
// will wire up tool_use with bash/read/edit tools. THIS first cut
// validates the API plumbing without that complexity.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PROJECT_DIR = path.dirname(__dirname);

// imp-1280: single source of truth for the engine model string. Precedence:
// env API_ENGINE_MODEL > scripts/engine-model.json > hardcoded default.
function readConfiguredModel() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'engine-model.json'), 'utf8'));
    return typeof cfg.model === 'string' && cfg.model.trim() ? cfg.model.trim() : null;
  } catch {
    return null;
  }
}
const MODEL = process.env.API_ENGINE_MODEL || readConfiguredModel() || 'claude-opus-4-8';
const PREFLIGHT_MARKER = path.join(__dirname, '.api-engine-preflighted');
const MAX_TOKENS = parseInt(process.env.API_ENGINE_MAX_TOKENS || '4096', 10);

function logStderr(msg) {
  process.stderr.write(`[engine-api-cycle] ${msg}\n`);
}

function logStdout(msg) {
  process.stdout.write(`${msg}\n`);
}

if (!process.env.ANTHROPIC_API_KEY) {
  logStdout('API_ENGINE: ANTHROPIC_API_KEY not set in env. Engine cannot run.');
  logStdout('API_ENGINE: To enable, export ANTHROPIC_API_KEY=sk-ant-... and restart the engine.');
  logStdout('API_ENGINE: Documented honest-scope partial closure for imp-1142.');
  logStderr('exit 78: no ANTHROPIC_API_KEY');
  process.exit(78);
}

let Anthropic;
try {
  ({ default: Anthropic } = await import('@anthropic-ai/sdk'));
} catch (e) {
  logStdout('API_ENGINE: @anthropic-ai/sdk not installed. Run: npm install @anthropic-ai/sdk');
  logStdout(`API_ENGINE: error ${e.message}`);
  logStderr('exit 79: SDK not installed');
  process.exit(79);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// One-time preflight: a token-count call on a tiny prompt. Token-count
// does not consume completion quota and lets us fail loudly if the key
// is invalid (401) BEFORE we burn a single completion token.
async function preflight() {
  if (fs.existsSync(PREFLIGHT_MARKER)) return true;
  try {
    const r = await client.messages.countTokens({
      model: MODEL,
      messages: [{ role: 'user', content: 'ping' }],
    });
    logStdout(`API_ENGINE: preflight OK. countTokens for ping = ${r.input_tokens}`);
    fs.writeFileSync(PREFLIGHT_MARKER, new Date().toISOString());
    return true;
  } catch (e) {
    logStdout(`API_ENGINE: preflight FAILED for model=${MODEL}. error=${e.message}`);
    logStdout('API_ENGINE: NOT proceeding with completion call (saves quota).');
    logStderr(`preflight failed: ${e.message}`);
    return false;
  }
}

// Same skeleton as auto-improve.sh IMPROVE_PROMPT but rewritten for the
// API-channel context. Key differences from the subscription prompt:
//   - The API engine cannot itself read or edit files; its job here is
//     to PROPOSE the next ticket pick + a short plan. The shell wrapper
//     records the response; tool-using execution is a follow-on ticket.
//   - We pick from byChannel.api FIRST (which is currently empty), with
//     fallback to byChannel.untagged, then byChannel.subscription head
//     so the engine has something to chew on while ticket re-tagging
//     catches up.
const PROMPT = `You are the API-CHANNEL tier of the ZPO Explorer / RH-attack auto-improvement engine. Your runtime is the Anthropic REST API (NOT the Claude Code CLI). You CANNOT read or edit files in this turn -- this turn is for PLANNING ONLY.

TOKEN BUDGET DISCIPLINE: do NOT ask to read the giant monolith files (improvements.js ~280K, improvement-queue.js ~87K, IMPROVEMENTS.md ~60K). Use only the snippet of scripts/queue-index.json that the shell wrapper has included below.

YOUR TASK FOR THIS TURN:
1. From the queue-index snippet, identify the highest-priority pending ticket whose channel === "api". If byChannel.api is empty, fall back to byChannel.untagged, then to the head of byChannel.subscription.
2. State the pick in this format: "API QUEUE: imp-NNN (priority X, category Y)".
3. Write a 3-5 bullet PLAN naming exactly which source files would be touched, what the smallest atomic change is, and what 5+ tripwires would prove the closure honest.
4. If NO eligible tickets exist (all three fallback buckets empty), state "API: no eligible tickets -- exiting cleanly" so the wrapper can increment the idle counter.

SYNTAX GOTCHAS for any code you propose (the shell wrapper will reject your reply on commit otherwise):
- DO NOT use star-slash inside JSDoc -- it terminates the comment block early. Use brace notation k_{*} not k*.
- DO NOT use apostrophes inside single-quoted JS strings.

Keep your reply under 1000 tokens. This is a planning-only turn; the actual edits are scheduled for a follow-on tool-use turn (imp-1142-sub-tool-use).
`;

function loadQueueIndexSnippet() {
  const p = path.join(__dirname, 'queue-index.json');
  if (!fs.existsSync(p)) return null;
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  // Keep the snippet small -- only the buckets we route on.
  const snippet = {
    generatedAt: raw.generatedAt,
    nextImprovementId: raw.nextImprovementId,
    totalPending: raw.totalPending,
    byChannel: {
      api: raw.byChannel?.api || [],
      untagged: raw.byChannel?.untagged || [],
      subscription_head: (raw.byChannel?.subscription || []).slice(0, 5),
    },
    criticalPending_head: (raw.criticalPending || []).slice(0, 3),
  };
  return snippet;
}

async function main() {
  logStdout(`=== API engine cycle starting at ${new Date().toISOString()} ===`);
  logStdout(`API_ENGINE: model=${MODEL}`);

  const ok = await preflight();
  if (!ok) {
    logStdout('API_ENGINE: preflight failed -- exiting with code 80 (no quota consumed).');
    process.exit(80);
  }

  const snippet = loadQueueIndexSnippet();
  if (!snippet) {
    logStdout('API_ENGINE: queue-index.json not found. Run scripts/build-queue-index.mjs first.');
    process.exit(81);
  }

  const userMsg = [
    'queue-index snippet (subset):',
    '```json',
    JSON.stringify(snippet, null, 2),
    '```',
    '',
    'Now follow the task above.',
  ].join('\n');

  let response;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    });
  } catch (e) {
    logStdout(`API_ENGINE: API call failed. error=${e.message}`);
    if (e.status === 429) {
      logStdout('API_ENGINE: rate-limited (429) -- shell wrapper will back off.');
    }
    process.exit(82);
  }

  const text = (response.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  logStdout('--- assistant reply ---');
  logStdout(text);
  logStdout('--- end reply ---');

  const usage = response.usage || {};
  logStdout(`Input tokens: ${usage.input_tokens || 0}`);
  logStdout(`Output tokens: ${usage.output_tokens || 0}`);
  logStdout(`stop_reason: ${response.stop_reason || 'unknown'}`);
  logStdout(`=== API engine cycle complete at ${new Date().toISOString()} ===`);
}

main().catch((e) => {
  logStdout(`API_ENGINE: uncaught error ${e.message}`);
  logStderr(e.stack || String(e));
  process.exit(1);
});
