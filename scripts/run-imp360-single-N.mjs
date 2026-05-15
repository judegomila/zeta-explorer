#!/usr/bin/env node
/**
 * scripts/run-imp360-single-N.mjs
 *
 * imp-360 / imp-423: Optimized one-ULP interval-RK4 runner for extended
 * Dyson backward-ODE ladder rows at large N.
 *
 * MATH: Identical to backwardCollisionInterval in
 * src/math/interval-dyson-integrator.mjs.  The only difference is the ULP
 * implementation: instead of allocating a fresh ArrayBuffer + BigInt64Array
 * on each call (the original approach, ~1 µs/op), we use a single module-
 * level ArrayBuffer shared across calls with Uint32Array for the 64-bit
 * increment (~5 ns/op).  The result is deterministic and bit-for-bit
 * identical to the BigInt version for all finite positive inputs.
 *
 * CORRECTNESS NOTE (endianness):
 * JavaScript typed-array views of the same ArrayBuffer use the platform's
 * native byte order, which is little-endian on all supported targets (x86,
 * x86-64, ARMv7, AArch64).  Float64 and Uint32 agree on little-endian byte
 * order.  Incrementing Uint32[0] (low 32 bits) with carry to Uint32[1] (high
 * 32 bits) is therefore identical to adding 1 to the 64-bit unsigned integer
 * representation of the float, which gives the next representable double.
 *
 * Usage:
 *   node scripts/run-imp360-single-N.mjs <N> <dt> <nSteps>
 *
 * Output: one JSON row on stdout, progress on stderr.
 */

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

// ── Fast ULP — pre-allocated shared buffers ────────────────────────────────
const _buf = new ArrayBuffer(8);
const _f64 = new Float64Array(_buf);
const _u32 = new Uint32Array(_buf);

function ulp(x) {
  if (!Number.isFinite(x)) return Number.POSITIVE_INFINITY;
  if (x === 0) return Number.MIN_VALUE;
  const a = Math.abs(x);
  _f64[0] = a;
  _u32[0]++;
  if (_u32[0] === 0) _u32[1]++;   // carry from low to high 32 bits
  return _f64[0] - a;
}

function inflate(lo, hi) {
  if (Number.isNaN(lo) || Number.isNaN(hi)) return [NaN, NaN];
  return [lo - ulp(lo), hi + ulp(hi)];
}

// ── Interval arithmetic primitives (same as interval-dyson-integrator.mjs) ──
function addInterval(a, b) {
  return inflate(a[0] + b[0], a[1] + b[1]);
}

function subInterval(a, b) {
  return inflate(a[0] - b[1], a[1] - b[0]);
}

function mulInterval(a, b) {
  const p1 = a[0] * b[0], p2 = a[0] * b[1];
  const p3 = a[1] * b[0], p4 = a[1] * b[1];
  return inflate(Math.min(p1, p2, p3, p4), Math.max(p1, p2, p3, p4));
}

function reciprocalInterval(a) {
  if (a[0] <= 0 && a[1] >= 0) return null;
  const r1 = 1 / a[0], r2 = 1 / a[1];
  return inflate(Math.min(r1, r2), Math.max(r1, r2));
}

function asInterval(x) { return inflate(x, x); }

const NEG_TWO = asInterval(-2);
const HALF    = asInterval(0.5);
const SIXTH   = asInterval(1 / 6);
const TWO     = asInterval(2);

// ── Dyson drift in interval arithmetic ───────────────────────────────────────
function dysonDriftVectorInterval(gammas, N) {
  const out = new Array(N);
  for (let k = 0; k < N; k++) {
    const gk = gammas[k];
    let sum = asInterval(0);
    for (let j = 0; j < N; j++) {
      if (j === k) continue;
      const diff = subInterval(gk, gammas[j]);
      const inv  = reciprocalInterval(diff);
      if (inv === null) return null;
      sum = addInterval(sum, inv);
    }
    out[k] = mulInterval(NEG_TWO, sum);
  }
  return out;
}

// ── Interval RK4 step ─────────────────────────────────────────────────────────
function rk4IntervalStep(gammas, N, dtI) {
  const k1 = dysonDriftVectorInterval(gammas, N);
  if (k1 === null) return null;

  const s2 = new Array(N);
  for (let i = 0; i < N; i++) {
    s2[i] = addInterval(gammas[i], mulInterval(mulInterval(HALF, dtI), k1[i]));
  }
  const k2 = dysonDriftVectorInterval(s2, N);
  if (k2 === null) return null;

  const s3 = new Array(N);
  for (let i = 0; i < N; i++) {
    s3[i] = addInterval(gammas[i], mulInterval(mulInterval(HALF, dtI), k2[i]));
  }
  const k3 = dysonDriftVectorInterval(s3, N);
  if (k3 === null) return null;

  const s4 = new Array(N);
  for (let i = 0; i < N; i++) {
    s4[i] = addInterval(gammas[i], mulInterval(dtI, k3[i]));
  }
  const k4 = dysonDriftVectorInterval(s4, N);
  if (k4 === null) return null;

  const next = new Array(N);
  for (let i = 0; i < N; i++) {
    const combined = addInterval(
      addInterval(k1[i], mulInterval(TWO, k2[i])),
      addInterval(mulInterval(TWO, k3[i]), k4[i]),
    );
    next[i] = addInterval(gammas[i], mulInterval(mulInterval(SIXTH, dtI), combined));
  }
  return next;
}

// ── Main integrator loop ──────────────────────────────────────────────────────
function runIntegrator(N, dt, nSteps) {
  const initial = ZEROS_EXTENDED.slice(0, N);

  // Compute initial minimum gap (H_raw)
  let H_raw = Infinity;
  for (let i = 1; i < N; i++) {
    const g = initial[i] - initial[i - 1];
    if (g < H_raw) H_raw = g;
  }
  const t_c_pair = (H_raw * H_raw) / 8;

  let gammas   = initial.map((g) => asInterval(g));
  const dtI    = asInterval(dt);
  let tAbs     = 0;
  let prevTAbs = 0;
  let maxIntervalWidth = 0;

  for (let step = 0; step < nSteps; step++) {
    // Measure max interval width and min-gap interval
    let minGapLo = Infinity;
    let kStar    = -1;
    for (let i = 0; i < N; i++) {
      const w = gammas[i][1] - gammas[i][0];
      if (w > maxIntervalWidth) maxIntervalWidth = w;
    }
    for (let i = 0; i < N - 1; i++) {
      const gap = subInterval(gammas[i + 1], gammas[i]);
      if (gap[0] < minGapLo) { minGapLo = gap[0]; kStar = i; }
    }

    process.stderr.write(
      `  step ${step}: tAbs=${tAbs.toFixed(8)}, minGapLo=${minGapLo.toExponential(3)}, ` +
      `maxW=${maxIntervalWidth.toExponential(3)}\n`,
    );

    if (minGapLo <= 0) {
      return { closed: true, steps: step, t_c_lo: prevTAbs, t_c_hi: tAbs,
               kStar, maxIntervalWidth, H_raw, t_c_pair,
               reason: 'gap-lower-bound-nonpositive' };
    }

    const next = rk4IntervalStep(gammas, N, dtI);
    if (next === null) {
      return { closed: true, steps: step, t_c_lo: tAbs, t_c_hi: tAbs + dt,
               kStar, maxIntervalWidth, H_raw, t_c_pair,
               reason: 'rk4-stage-zero-crossing' };
    }
    gammas   = next;
    prevTAbs = tAbs;
    tAbs    += dt;
  }

  // Budget exhausted
  return { closed: false, steps: nSteps, t_c_lo: tAbs, t_c_hi: Infinity,
           maxIntervalWidth, H_raw, t_c_pair, reason: 'budget-exhausted' };
}

// ── Entry point ────────────────────────────────────────────────────────────────
const argv   = process.argv.slice(2);
const N      = parseInt(argv[0] ?? '25000', 10);
const dt     = parseFloat(argv[1] ?? '1e-4');
const nSteps = parseInt(argv[2] ?? '50', 10);

process.stderr.write(`run-imp360-single-N  N=${N}  dt=${dt}  nSteps=${nSteps}\n`);
process.stderr.write(`  ZEROS_EXTENDED.length = ${ZEROS_EXTENDED.length}\n`);

if (ZEROS_EXTENDED.length < N) {
  process.stderr.write(`ERROR: only ${ZEROS_EXTENDED.length} zeros available; need ${N}\n`);
  process.exit(1);
}

const t0  = Date.now();
const res = runIntegrator(N, dt, nSteps);
const runtimeSec = (Date.now() - t0) / 1000;

const row = {
  N,
  dt,
  nStepsMax: nSteps,
  H_raw:            +res.H_raw.toFixed(7),
  t_c_pair:         +res.t_c_pair.toExponential(4),
  t_c_lo:           +res.t_c_lo.toFixed(8),
  t_c_hi:           Number.isFinite(res.t_c_hi) ? +res.t_c_hi.toFixed(8) : null,
  K_paper_cert_floor: +res.t_c_lo.toExponential(4),
  maxIntervalWidth: +res.maxIntervalWidth.toExponential(4),
  closed:           res.closed,
  steps:            res.steps,
  reason:           res.reason,
  runtimeSec:       +runtimeSec.toFixed(2),
  source:           'imp-360-one-ulp-interval-rk4-optimized',
  generatedAt:      new Date().toISOString(),
};

process.stdout.write(JSON.stringify(row, null, 2) + '\n');
process.stderr.write(`done: closed=${res.closed}, reason=${res.reason}, runtime=${runtimeSec.toFixed(1)}s\n`);
