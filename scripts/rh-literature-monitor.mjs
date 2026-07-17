#!/usr/bin/env node
/**
 * rh-literature-monitor.mjs
 *
 * Scans arXiv math.NT for NEW papers that could be a genuine input escaping the
 * RH obstruction seam (PROVABLE ∩ SUFFICIENT = ∅). The seam analysis pre-refutes
 * every re-roll of the mapped frameworks, so the ONLY thing worth re-attacking on
 * is genuinely new external mathematics — specifically an UNCONDITIONAL advance on
 * wide-support Montgomery pair-correlation / the min-gap shock C_H, or a fixed
 * sub-½ zero-free strip. This monitor surfaces exactly those.
 *
 * Dedupes against scripts/.rh-lit-seen.json; appends hits to
 * scripts/logs/rh-lit-digest.md; prints a summary and exits non-zero ONLY on a
 * hard error (a clean "no new hits" is exit 0). Designed to be run periodically
 * (weekly cron / the scan-and-attack wake).
 *
 * Usage: node scripts/rh-literature-monitor.mjs [--days N] [--max M]
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SEEN_FILE = join(ROOT, 'scripts', '.rh-lit-seen.json');
const DIGEST = join(ROOT, 'scripts', 'logs', 'rh-lit-digest.md');
const args = process.argv.slice(2);
const getArg = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const MAX = parseInt(getArg('--max', '120'), 10);

// Relevance keywords (any hit = surfaced); HIGH-priority = a potential seam escape.
const REL = [
  'pair correlation', 'montgomery', 'de bruijn', 'newman constant', 'zero-free',
  'zero free region', 'zero density', 'large values', 'dirichlet polynomial', 'gue',
  'random matrix', 'additive energy', 'guth', 'maynard', 'simple zeros', 'critical line',
  'explicit formula', 'weil positivity', 'form factor', 'riemann hypothesis', 'riemann zeta',
];
// HIGH = unconditional advance on the sufficient (RH-hard) side of the seam.
function highPriority(text) {
  const t = text.toLowerCase();
  const uncond = t.includes('unconditional') || t.includes('without assuming') || t.includes('we prove');
  const wideOrGap = /wide[- ]support|pair correlation|zero[- ]free (region|strip)|de bruijn|min(imal|imum)?[- ]gap|form factor/.test(t);
  const sufficientSide = /support.{0,20}(>|greater|beyond|all)|alpha\s*>\s*1|\bsub[- ]?half\b|delta\s*<\s*1\/?2/.test(t);
  return (uncond && wideOrGap) || sufficientSide;
}

async function fetchArxiv() {
  const url = 'http://export.arxiv.org/api/query?search_query=cat:math.NT'
    + `&sortBy=submittedDate&sortOrder=descending&max_results=${MAX}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'rh-literature-monitor/1.0' } });
  if (!res.ok) throw new Error(`arXiv HTTP ${res.status}`);
  const xml = await res.text();
  const entries = [];
  for (const block of xml.split('<entry>').slice(1)) {
    const pick = (tag) => { const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };
    const idRaw = pick('id');
    const id = (idRaw.match(/abs\/([^\s]+?)(v\d+)?$/) || [, idRaw])[1];
    entries.push({ id, title: pick('title'), summary: pick('summary'), published: pick('published') });
  }
  return entries;
}

function main() {
  mkdirSync(dirname(DIGEST), { recursive: true });
  const seen = existsSync(SEEN_FILE) ? new Set(JSON.parse(readFileSync(SEEN_FILE, 'utf8'))) : new Set();

  return fetchArxiv().then((entries) => {
    const fresh = entries.filter((e) => e.id && !seen.has(e.id));
    const hits = fresh
      .map((e) => {
        const text = `${e.title} ${e.summary}`;
        const matched = REL.filter((k) => text.toLowerCase().includes(k));
        return { ...e, matched, high: highPriority(text) };
      })
      .filter((e) => e.matched.length > 0);

    // record ALL fresh ids as seen (so we don't reprocess non-hits either)
    fresh.forEach((e) => seen.add(e.id));
    writeFileSync(SEEN_FILE, JSON.stringify([...seen].slice(-5000), null, 0));

    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + 'Z';
    if (hits.length) {
      let out = `\n## Scan ${stamp} — ${hits.length} relevant / ${fresh.length} new math.NT\n`;
      for (const h of hits.sort((a, b) => (b.high - a.high))) {
        out += `- ${h.high ? '**[HIGH — possible seam escape]** ' : ''}[${h.id}](https://arxiv.org/abs/${h.id}) — ${h.title}\n`
             + `  - matched: ${h.matched.join(', ')}\n`;
      }
      appendFileSync(DIGEST, out);
    }
    const highN = hits.filter((h) => h.high).length;
    console.log(`[rh-lit-monitor ${stamp}] ${fresh.length} new math.NT, ${hits.length} relevant, ${highN} HIGH (possible seam escape).`);
    if (highN) {
      console.log('HIGH hits (evaluate against the obstruction seam, consider firing an attack round):');
      hits.filter((h) => h.high).forEach((h) => console.log(`  https://arxiv.org/abs/${h.id}  ${h.title}`));
    }
    return { fresh: fresh.length, hits: hits.length, high: highN };
  });
}

main().catch((e) => { console.error('[rh-lit-monitor] error:', e.message); process.exit(1); });
