#!/usr/bin/env node
// scripts/snapshot-thinking.mjs
//
// Snapshot subagent transcripts from the Claude Code temp directory into
// thinking/transcripts/ so they survive /private/tmp reboots and can be
// re-read from inside the repo when needed.
//
// Usage:
//   node scripts/snapshot-thinking.mjs --all
//   node scripts/snapshot-thinking.mjs --recent 5
//   node scripts/snapshot-thinking.mjs --ticket imp-1241
//   node scripts/snapshot-thinking.mjs --recent 5 --dry-run
//
// Output names: thinking/transcripts/YYYY-MM-DD-<ticket-or-taskid>.jsonl

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const TRANSCRIPTS_OUT = path.join(ROOT, 'thinking', 'transcripts');
const HARNESS_TMP_BASE = '/private/tmp/claude-501/-Users-USER-Documents-GitHub-mathexplorer';

function findAllTasksDirs() {
  if (!fs.existsSync(HARNESS_TMP_BASE)) return [];
  return fs.readdirSync(HARNESS_TMP_BASE)
    .map((d) => path.join(HARNESS_TMP_BASE, d))
    .filter((p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } })
    .map((p) => path.join(p, 'tasks'))
    .filter((p) => fs.existsSync(p));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { all: false, ticket: null, recent: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--all') opts.all = true;
    else if (args[i] === '--dry-run') opts.dryRun = true;
    else if (args[i].startsWith('--ticket=')) opts.ticket = args[i].slice('--ticket='.length);
    else if (args[i] === '--ticket') opts.ticket = args[++i];
    else if (args[i].startsWith('--recent=')) opts.recent = parseInt(args[i].slice('--recent='.length), 10);
    else if (args[i] === '--recent') opts.recent = parseInt(args[++i], 10);
  }
  return opts;
}

function listAllTranscripts(tasksDirs) {
  const out = [];
  for (const tasksDir of tasksDirs) {
    for (const f of fs.readdirSync(tasksDir)) {
      if (!f.endsWith('.output')) continue;
      const fp = path.join(tasksDir, f);
      const st = fs.statSync(fp);
      if (st.size === 0) continue;
      out.push({ name: f, path: fp, mtime: st.mtimeMs, size: st.size });
    }
  }
  return out.sort((a, b) => b.mtime - a.mtime);
}

function extractTicketFromHead(transcriptPath, headBytes = 8192) {
  try {
    const fd = fs.openSync(transcriptPath, 'r');
    const buf = Buffer.alloc(headBytes);
    const bytesRead = fs.readSync(fd, buf, 0, headBytes, 0);
    fs.closeSync(fd);
    const head = buf.toString('utf8', 0, bytesRead);
    const m = head.match(/imp-(\d{3,5})/);
    return m ? `imp-${m[1]}` : null;
  } catch {
    return null;
  }
}

function isoDate(ms) { return new Date(ms).toISOString().slice(0, 10); }

function snapshot(transcript, opts) {
  const ticket = extractTicketFromHead(transcript.path) || transcript.name.replace('.output', '');
  const dateStr = isoDate(transcript.mtime);
  const outName = `${dateStr}-${ticket}.jsonl`;
  const outPath = path.join(TRANSCRIPTS_OUT, outName);
  if (opts.dryRun) {
    console.error(`[dry-run] ${transcript.name} (${(transcript.size / 1024).toFixed(1)} KB) -> thinking/transcripts/${outName}`);
    return;
  }
  fs.copyFileSync(transcript.path, outPath);
  console.error(`copied ${transcript.name} (${(transcript.size / 1024).toFixed(1)} KB) -> thinking/transcripts/${outName}`);
}

function main() {
  const opts = parseArgs();
  if (!opts.all && !opts.ticket && !opts.recent) {
    console.error('usage: snapshot-thinking.mjs (--all | --ticket imp-NNNN | --recent N) [--dry-run]');
    process.exit(2);
  }
  const tasksDirs = findAllTasksDirs();
  if (tasksDirs.length === 0) {
    console.error('No tasks directories found under ' + HARNESS_TMP_BASE);
    process.exit(2);
  }
  console.error(`scanning ${tasksDirs.length} tasks dir(s)`);

  if (!fs.existsSync(TRANSCRIPTS_OUT)) fs.mkdirSync(TRANSCRIPTS_OUT, { recursive: true });

  const all = listAllTranscripts(tasksDirs);
  console.error(`found ${all.length} non-empty transcripts total`);
  let pick = [];
  if (opts.all) pick = all;
  else if (opts.recent) pick = all.slice(0, opts.recent);
  else if (opts.ticket) {
    pick = all.filter((t) => extractTicketFromHead(t.path) === opts.ticket);
    if (pick.length === 0) {
      console.error(`no transcripts found matching ticket ${opts.ticket}`);
      process.exit(1);
    }
  }
  console.error(`snapshotting ${pick.length} transcript(s)`);
  for (const t of pick) snapshot(t, opts);
  console.error('done');
}

main();
