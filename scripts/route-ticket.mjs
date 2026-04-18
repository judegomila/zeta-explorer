// Routing rules for the ZPO Explorer auto-improve engine.
//
// Given a ticket's (category, priority, estimatedComplexity), returns the
// predicted {model, channel} pair the engine should use. Tickets can
// override both fields explicitly in improvement-queue.js.
//
// CHANNEL WATERFALL (priority order):
//   local        — only when an interactive Claude Code session is running
//                  the work directly (no API bill). Not reachable from cron.
//   subscription — Claude Code CLI uses the user's Max subscription until
//                  capped. This is the default engine channel.
//   api          — direct Anthropic API key. Falls through from subscription
//                  only when quota is exhausted.
//
// MODEL TIERS (cheap → expensive):
//   haiku-4-5    — mechanical bugs, UX polish, JSDoc, tiny content fixes
//   sonnet-4-6   — medium features, content writing, small proof refactors
//   opus-4-6     — medium proof work, chain cross-verifications
//   opus-4-7     — the heaviest critical proof work (research-grade)
//
// Usage as a library:
//   import { routeTicket, CHANNELS, MODELS } from './route-ticket.mjs';
//   const { model, channel } = routeTicket({category, priority, estimatedComplexity});

export const MODELS = {
  HAIKU: 'haiku-4-5',
  SONNET: 'sonnet-4-6',
  OPUS_46: 'opus-4-6',
  OPUS_47: 'opus-4-7',
};

export const CHANNELS = {
  LOCAL: 'local',
  SUBSCRIPTION: 'subscription',
  API: 'api',
};

// Tier ranking for comparison / downgrade logic.
export const MODEL_RANK = {
  [MODELS.HAIKU]: 0,
  [MODELS.SONNET]: 1,
  [MODELS.OPUS_46]: 2,
  [MODELS.OPUS_47]: 3,
};

export function routeTicket(ticket) {
  // Honor explicit tags — a maintainer knows better than the heuristic.
  if (ticket.model && ticket.channel) {
    return { model: ticket.model, channel: ticket.channel };
  }

  const category = ticket.category || '';
  const priority = ticket.priority || 'medium';
  const complexity = ticket.estimatedComplexity || 'medium';

  const model = ticket.model || pickModel({ category, priority, complexity });
  const channel = ticket.channel || pickChannel();
  return { model, channel };
}

function pickModel({ category, priority, complexity }) {
  // Mechanical work — always cheapest tier.
  if (['bug', 'ux', 'visual', 'performance', 'accuracy'].includes(category)) {
    return MODELS.HAIKU;
  }

  // Content / meta with small complexity — Sonnet is fine, often Haiku too.
  if (category === 'content') {
    return complexity === 'small' ? MODELS.HAIKU : MODELS.SONNET;
  }

  if (category === 'meta') {
    if (complexity === 'small') return MODELS.HAIKU;
    if (complexity === 'medium') return MODELS.SONNET;
    return MODELS.OPUS_46;
  }

  // Feature work — Sonnet for small, Opus-4.6 for medium, 4.7 only if large+critical.
  if (category === 'feature') {
    if (complexity === 'small') return MODELS.SONNET;
    if (complexity === 'medium') return MODELS.OPUS_46;
    // large feature — only bump to 4.7 if critical priority, else stay at 4.6.
    return priority === 'critical' ? MODELS.OPUS_47 : MODELS.OPUS_46;
  }

  // Proof work — the research core. 4.7 reserved for large+critical.
  if (category === 'proof' || category === 'proof-gap' || category === 'verification') {
    if (complexity === 'small') {
      // Small proof tasks are usually re-verify-assertions or JSDoc-like —
      // Sonnet is plenty.
      return MODELS.SONNET;
    }
    if (complexity === 'medium') {
      // Cross-verifications, finite-grid fills — Opus-4.6 is the default.
      return MODELS.OPUS_46;
    }
    // large. Only critical-priority large proof work earns Opus-4.7.
    return priority === 'critical' ? MODELS.OPUS_47 : MODELS.OPUS_46;
  }

  // Unknown category — conservative default.
  return MODELS.SONNET;
}

function pickChannel() {
  // Default to subscription. The engine scripts read a quota sentinel at
  // scripts/.channel-quota.json and downgrade to api if the subscription
  // token budget is exhausted. local is only used when a human-interactive
  // session is driving the work.
  return CHANNELS.SUBSCRIPTION;
}

// ── CLI mode: when invoked directly, tag every pending ticket in
// improvement-queue.js with the predicted model + channel. Safe to re-run:
// tickets that already have model AND channel are left alone.
//
// Usage:
//   node scripts/route-ticket.mjs --apply       # write tags
//   node scripts/route-ticket.mjs --dry         # print diffs, don't write

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);

async function cliMain() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const dry = args.includes('--dry') || !apply;

  const QUEUE_FILE = path.resolve(path.dirname(__filename), '..', 'src/data/improvement-queue.js');
  const text = fs.readFileSync(QUEUE_FILE, 'utf8');

  // Walk objects. We reuse the balanced-brace walker style from build-queue-index.mjs.
  const blocks = findObjectBlocks(text);

  let updated = text;
  let touched = 0;
  let diffs = [];

  // Walk from END to START so earlier offsets stay valid as we edit.
  for (const b of [...blocks].reverse()) {
    const chunk = updated.slice(b.start, b.end);
    if (!chunk.includes("id: 'imp-")) continue;
    if (!chunk.includes("status: 'pending'")) continue;
    if (/\bmodel:\s*'/.test(chunk) && /\bchannel:\s*'/.test(chunk)) continue; // already tagged

    const id = extractField(chunk, 'id');
    const category = extractField(chunk, 'category');
    const priority = extractField(chunk, 'priority');
    const complexity = extractField(chunk, 'estimatedComplexity');

    const ticket = { id, category, priority, estimatedComplexity: complexity };
    const { model, channel } = routeTicket(ticket);

    // Find the estimatedComplexity line and append model+channel after it.
    const insertAfter = chunk.match(/^(\s*)estimatedComplexity:\s*'[^']+',\s*$/m);
    if (!insertAfter) continue;
    const indent = insertAfter[1];
    const insertion = `${indent}model: '${model}',\n${indent}channel: '${channel}',\n`;
    const newChunk = chunk.replace(insertAfter[0] + '\n', insertAfter[0] + '\n' + insertion);
    if (newChunk === chunk) continue;

    updated = updated.slice(0, b.start) + newChunk + updated.slice(b.end);
    touched++;
    diffs.push(`  ${id}: model=${model}, channel=${channel}`);
  }

  if (dry) {
    console.log(`Would tag ${touched} pending ticket${touched === 1 ? '' : 's'}:`);
    diffs.forEach((d) => console.log(d));
    return;
  }
  if (!apply) return;

  fs.writeFileSync(QUEUE_FILE, updated);
  console.log(`Tagged ${touched} pending ticket${touched === 1 ? '' : 's'}:`);
  diffs.forEach((d) => console.log(d));
}

function findObjectBlocks(text) {
  const blocks = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    if (text[i] === '{') {
      const start = i;
      let depth = 1;
      i++;
      while (i < n && depth > 0) {
        const ch = text[i];
        if (ch === "'" && text[i - 1] !== '\\') {
          i++;
          while (i < n && !(text[i] === "'" && text[i - 1] !== '\\')) i++;
          i++;
          continue;
        }
        if (ch === '"' && text[i - 1] !== '\\') {
          i++;
          while (i < n && !(text[i] === '"' && text[i - 1] !== '\\')) i++;
          i++;
          continue;
        }
        if (ch === '`') {
          i++;
          while (i < n && text[i] !== '`') {
            if (text[i] === '\\') i++;
            i++;
          }
          i++;
          continue;
        }
        if (ch === '/' && text[i + 1] === '/') {
          while (i < n && text[i] !== '\n') i++;
          continue;
        }
        if (ch === '/' && text[i + 1] === '*') {
          i += 2;
          while (i < n - 1 && !(text[i] === '*' && text[i + 1] === '/')) i++;
          i += 2;
          continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        i++;
      }
      blocks.push({ start, end: i });
    } else {
      i++;
    }
  }
  return blocks;
}

function extractField(chunk, key) {
  const re = new RegExp(`${key}:\\s*'([^']*)'`);
  const m = chunk.match(re);
  return m ? m[1] : null;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  cliMain().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
