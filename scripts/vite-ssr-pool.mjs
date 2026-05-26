#!/usr/bin/env node
// scripts/vite-ssr-pool.mjs
// imp-1193: Long-lived pre-warmed Vite SSR server daemon for run-assertions.mjs.
//
// Each cold-start of run-assertions.mjs currently spins up a fresh Vite SSR
// server (about 1-2 s of overhead). Across ~50 commits/day x 4 engines that
// is 100-200 engine-seconds/day burned on Vite init. This daemon keeps one
// Vite SSR server warm and accepts assertion-sweep requests over a unix
// socket. Module cache stays warm across requests; second-and-later sweeps
// see only ssrLoadModule cache-hit cost.
//
// Protocol (JSON-per-line, NDJSON):
//   request:  { op: "ping" }
//   response: { ok: true, pid, uptimeMs, sweepsServed }
//
//   request:  { op: "sweep", modules: ["/src/...", ...], parallel: 4 }
//   response: { ok: true, results: [{ moduleName, arrayName,
//                                     assertions: [{id, ok, why}] }],
//                         loadErrors: [{moduleName, error}],
//                         stats: { passed, failed, loadErrorCount, elapsedMs } }
//
//   request:  { op: "invalidate" }   -- clear ssr module cache (for source edits)
//   response: { ok: true, modulesInvalidated: N }
//
//   request:  { op: "stop" }
//   response: { ok: true }            -- server exits after this reply
//
// Usage:
//   node scripts/vite-ssr-pool.mjs                  # start, default socket
//   node scripts/vite-ssr-pool.mjs --socket=PATH    # custom socket path
//   node scripts/vite-ssr-pool.mjs --stop           # send stop to running daemon
//   node scripts/vite-ssr-pool.mjs --ping           # probe running daemon
//
// Default socket: scripts/.vite-ssr-pool.sock (under repo root). The
// matching POOL_SOCK env var is honored by run-assertions.mjs to discover
// the daemon. If the socket is absent or stale, run-assertions.mjs falls
// back to the cold-start code path -- no behavior change for users who do
// not start this daemon.
//
// Exit codes:
//   0 -- normal shutdown (received {op:"stop"} or SIGTERM)
//   2 -- Vite server creation failed
//   3 -- socket bind failed (e.g. stale socket; remove it first)

import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SOCKET = path.join(__dirname, '.vite-ssr-pool.sock');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { socket: DEFAULT_SOCKET, mode: 'serve' };
  for (const a of args) {
    if (a === '--stop') out.mode = 'stop';
    else if (a === '--ping') out.mode = 'ping';
    else if (a.startsWith('--socket=')) out.socket = a.slice('--socket='.length);
  }
  if (process.env.POOL_SOCK) out.socket = process.env.POOL_SOCK;
  return out;
}

// ── Client helpers (for --stop and --ping subcommands) ────────────────────────

function sendOneShot(socket, request) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(socket);
    let buf = '';
    client.on('connect', () => {
      client.write(JSON.stringify(request) + '\n');
    });
    client.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      const nl = buf.indexOf('\n');
      if (nl >= 0) {
        const line = buf.slice(0, nl);
        client.end();
        try { resolve(JSON.parse(line)); } catch (e) { reject(e); }
      }
    });
    client.on('error', reject);
    client.on('close', () => {
      if (!buf) reject(new Error('socket closed before response'));
    });
  });
}

// ── Daemon main ──────────────────────────────────────────────────────────────

async function runDaemon(socketPath) {
  // Probe for an existing live daemon before stomping on the socket file.
  if (fs.existsSync(socketPath)) {
    try {
      const pong = await sendOneShot(socketPath, { op: 'ping' });
      if (pong && pong.ok) {
        console.error('FATAL: another vite-ssr-pool is already running on ' + socketPath +
          ' (pid ' + pong.pid + '). Stop it first with --stop.');
        process.exit(3);
      }
    } catch {
      // Stale socket -- safe to remove.
      try { fs.unlinkSync(socketPath); } catch {}
    }
  }

  let vite;
  try {
    vite = await createViteServer({
      root: ROOT,
      logLevel: 'error',
      appType: 'custom',
      server: { middlewareMode: true, hmr: false },
    });
  } catch (e) {
    console.error('FATAL: could not create Vite server:', e.message);
    process.exit(2);
  }

  const startedAt = Date.now();
  let sweepsServed = 0;

  async function processOne(modPath, results, loadErrors, stats) {
    let mod;
    try {
      mod = await vite.ssrLoadModule(modPath);
    } catch (e) {
      loadErrors.push({ moduleName: modPath, error: String(e.message || e).slice(0, 200) });
      stats.loadErrorCount++;
      stats.failed++;
      return;
    }
    const arrays = Object.entries(mod).filter(
      ([k, v]) => k.endsWith('_ASSERTIONS') && Array.isArray(v),
    );
    if (arrays.length === 0) return;
    for (const [arrayName, arr] of arrays) {
      const out = { moduleName: modPath, arrayName, assertions: [] };
      for (const a of arr) {
        let ok;
        let errMsg = null;
        try { ok = a.holds(); } catch (e) { ok = false; errMsg = String(e.message || e).slice(0, 200); }
        const id = a.id || '<unnamed>';
        const why = errMsg || (a.why ? String(a.why).slice(0, 200) : '');
        out.assertions.push({ id, ok: !!ok, why });
        if (ok) stats.passed++; else stats.failed++;
      }
      results.push(out);
    }
  }

  async function runSweep(modules, parallel) {
    const start = Date.now();
    const results = [];
    const loadErrors = [];
    const stats = { passed: 0, failed: 0, loadErrorCount: 0, elapsedMs: 0 };
    const par = Math.max(1, Math.min(16, parallel || 1));
    if (par === 1) {
      for (const m of modules) await processOne(m, results, loadErrors, stats);
    } else {
      const queue = [...modules];
      async function worker() {
        while (queue.length > 0) {
          const m = queue.shift();
          if (!m) return;
          await processOne(m, results, loadErrors, stats);
        }
      }
      await Promise.all(Array.from({ length: par }, () => worker()));
    }
    stats.elapsedMs = Date.now() - start;
    return { results, loadErrors, stats };
  }

  function invalidateAll() {
    // Walk the SSR module graph and invalidate every loaded module so the
    // next sweep re-evaluates fresh source. Vite exposes
    // moduleGraph.invalidateAll() in the dev server.
    let count = 0;
    const mg = vite.moduleGraph;
    if (mg && mg.idToModuleMap) {
      count = mg.idToModuleMap.size;
      mg.invalidateAll();
    }
    return count;
  }

  const server = net.createServer((socket) => {
    let buf = '';
    socket.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (!line) continue;
        let req;
        try { req = JSON.parse(line); } catch (e) {
          socket.write(JSON.stringify({ ok: false, error: 'bad json: ' + e.message }) + '\n');
          continue;
        }
        handleRequest(req, socket);
      }
    });
    socket.on('error', () => {}); // client may disconnect mid-write; ignore
  });

  async function handleRequest(req, socket) {
    try {
      if (req.op === 'ping') {
        socket.write(JSON.stringify({
          ok: true, pid: process.pid, uptimeMs: Date.now() - startedAt, sweepsServed,
        }) + '\n');
        return;
      }
      if (req.op === 'invalidate') {
        const n = invalidateAll();
        socket.write(JSON.stringify({ ok: true, modulesInvalidated: n }) + '\n');
        return;
      }
      if (req.op === 'sweep') {
        const sweep = await runSweep(req.modules || [], req.parallel || 1);
        sweepsServed++;
        socket.write(JSON.stringify({ ok: true, ...sweep }) + '\n');
        return;
      }
      if (req.op === 'stop') {
        socket.write(JSON.stringify({ ok: true }) + '\n');
        socket.end();
        setTimeout(() => shutdown(0), 50);
        return;
      }
      socket.write(JSON.stringify({ ok: false, error: 'unknown op: ' + req.op }) + '\n');
    } catch (e) {
      try {
        socket.write(JSON.stringify({ ok: false, error: String(e.message || e).slice(0, 300) }) + '\n');
      } catch {}
    }
  }

  async function shutdown(code) {
    try { server.close(); } catch {}
    try { fs.unlinkSync(socketPath); } catch {}
    try { await vite.close(); } catch {}
    process.exit(code);
  }

  server.on('error', (e) => {
    console.error('FATAL: socket server error:', e.message);
    shutdown(3);
  });

  server.listen(socketPath, () => {
    try { fs.chmodSync(socketPath, 0o600); } catch {}
    console.log('vite-ssr-pool listening on ' + socketPath + ' (pid ' + process.pid + ')');
  });

  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(sig, () => shutdown(0));
  }
}

async function main() {
  const { socket, mode } = parseArgs();
  if (mode === 'stop') {
    try {
      const r = await sendOneShot(socket, { op: 'stop' });
      console.log(JSON.stringify(r));
      process.exit(0);
    } catch (e) {
      console.error('stop failed: ' + e.message);
      process.exit(1);
    }
  }
  if (mode === 'ping') {
    try {
      const r = await sendOneShot(socket, { op: 'ping' });
      console.log(JSON.stringify(r));
      process.exit(r.ok ? 0 : 1);
    } catch (e) {
      console.error('ping failed: ' + e.message);
      process.exit(1);
    }
  }
  await runDaemon(socket);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(2);
});
