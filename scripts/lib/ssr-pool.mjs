// scripts/lib/ssr-pool.mjs
// imp-1193: lazy-warmed in-process pool of Vite SSR servers.
//
// Each Vite middleware-mode server holds its own module graph. A single server
// already serves concurrent ssrLoadModule calls (see imp-1171), but the module
// graph mutex inside Vite serialises some cache-miss work. Holding N parallel
// servers lets concurrent workers parse + transform different modules without
// contending on the same internal lock.
//
// API:
//   const pool = createPool({ cap: 4, viteOptions: {...} });
//   const slot = await pool.acquire();   // returns { server, slotId, reused }
//   await slot.server.ssrLoadModule(...);
//   pool.release(slot);
//   await pool.drain();                  // closes all servers
//   pool.stats() => { created, reuseCount, inUse, free, cap, waiters }
//
// Backward-compat surface: only used when run-assertions.mjs is invoked with
// --ssr-pool=N. Default code path remains the single createServer() call.

import { createServer } from 'vite';

export function createPool({ cap = 1, viteOptions = {} } = {}) {
  if (!Number.isFinite(cap) || cap < 1) {
    throw new Error('createPool: cap must be >= 1');
  }

  /** @type {Array<{ id: number, server: any, inUse: boolean }>} */
  const slots = [];
  /** @type {Array<(slot: any) => void>} */
  const waiters = [];
  // pendingCount = number of slots currently being created (inFlight). We
  // increment SYNCHRONOUSLY before awaiting createServer so concurrent
  // acquire() callers see the under-construction count and don't race past
  // the cap. Without this, N concurrent acquire() calls when slots=0 all
  // see slots.length<cap and all kick off createServer.
  let pendingCount = 0;
  let created      = 0;
  let reuseCount   = 0;
  let drained      = false;

  async function acquire() {
    if (drained) throw new Error('ssr-pool: acquire() after drain()');

    // 1) Free slot? Hand it out, count a reuse.
    const free = slots.find((s) => !s.inUse);
    if (free) {
      free.inUse = true;
      reuseCount++;
      return { server: free.server, slotId: free.id, reused: true };
    }

    // 2) Under cap (counting in-flight creates)? Lazy-create a new slot.
    if (slots.length + pendingCount < cap) {
      const id = slots.length + pendingCount;
      pendingCount++;
      let server;
      try {
        // ws:false silences the "Port 24678 is already in use" warning that
        // Vite emits when N>1 SSR middleware-mode servers run concurrently
        // in the same process (each tries to bind a default HMR WebSocket
        // port). SSR ssrLoadModule does not need HMR or WS; we strip them
        // by default but allow viteOptions.server to override.
        const serverOpts = viteOptions.server ?? { middlewareMode: true, ws: false };
        server = await createServer({
          root:     viteOptions.root,
          logLevel: viteOptions.logLevel ?? 'error',
          appType:  viteOptions.appType  ?? 'custom',
          server:   serverOpts,
          ...viteOptions.extra,
        });
      } finally {
        pendingCount--;
      }
      const slot = { id, server, inUse: true };
      slots.push(slot);
      created++;
      return { server, slotId: id, reused: false };
    }

    // 3) At cap, all busy: queue a waiter.
    return new Promise((resolve) => waiters.push(resolve));
  }

  function release(slot) {
    const target = slots.find((s) => s.id === slot.slotId);
    if (!target) return;
    target.inUse = false;
    const next   = waiters.shift();
    if (next) {
      target.inUse = true;
      reuseCount++;
      next({ server: target.server, slotId: target.id, reused: true });
    }
  }

  async function drain() {
    drained = true;
    // Reject any still-pending waiters so callers don't hang.
    while (waiters.length > 0) {
      const w = waiters.shift();
      w(Promise.reject(new Error('ssr-pool: drained while waiting')));
    }
    await Promise.all(slots.map((s) => s.server.close().catch(() => {})));
    slots.length = 0;
  }

  function stats() {
    return {
      created,
      reuseCount,
      cap,
      pending: pendingCount,
      inUse:   slots.filter((s) => s.inUse).length,
      free:    slots.filter((s) => !s.inUse).length,
      waiters: waiters.length,
    };
  }

  return { acquire, release, drain, stats };
}
