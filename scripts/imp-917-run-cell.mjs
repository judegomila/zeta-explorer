#!/usr/bin/env node
// imp-917 per-cell offline-worker driver for the phased-forcing grid sweep.
//
// imp-896 INFRASTRUCTURE-COMPLETE closure published RETUNING_CALIBRATION and a
// per-cell env-var invocation recipe for src/math/imp-857-phase-locked-dyson.mjs.
// imp-917 is the ~20 CPU-hour execution of the 14 remaining (N, eps) cells.
// This script is the thin driver that reads the retuning table by N, picks
// the (k0_star, phaseVel_star) pair, and spawns the prototype with the right
// IMP857_* env vars. Offline workers invoke it per cell; engine turns do not.
//
// Usage:
//   node scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1 [--nSteps 40] [--dt 1e-4]
//   node scripts/imp-917-run-cell.mjs --list
//
// --eps must be a comma-separated triple; the first entry is conventionally 0
// (baseline) so ratio rows can be computed against it. Defaults for nSteps/dt
// are taken from the MISSING_CELLS row of imp-896-retuning-calibration.js
// matching the requested N (imp-857-phased-forcing-sweep.js schedule).
//
// --list prints the full 6-invocation batch plan that packs the 14 missing
// cells into triple-runs (baseline eps=0 + two eps values per invocation),
// ready to be piped into GNU parallel / xargs by an offline worker. No
// --N/--eps required in this mode.
//
// On completion the prototype prints a three-row comparison table; copy the
// final-row maxIntervalWidth values into a new MEASURED_ROWS entry in
// src/data/imp-857-phased-forcing-sweep.js.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { IMP_896_RETUNING_CALIBRATION } from '../src/data/imp-896-retuning-calibration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
  const out = { N: null, eps: null, nSteps: null, dt: null, list: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--N') out.N = Number(argv[++i]);
    else if (a === '--eps') out.eps = argv[++i];
    else if (a === '--nSteps') out.nSteps = Number(argv[++i]);
    else if (a === '--dt') out.dt = Number(argv[++i]);
    else if (a === '--list') out.list = true;
    else if (a === '--help' || a === '-h') {
      console.log(
        'usage: node scripts/imp-917-run-cell.mjs --N <N> --eps <e0,e1,e2> [--nSteps <k>] [--dt <dt>]\n' +
          '       node scripts/imp-917-run-cell.mjs --list',
      );
      process.exit(0);
    } else {
      console.error('unknown arg:', a);
      process.exit(2);
    }
  }
  return out;
}

// Batch plan: the 14 MISSING_CELLS from imp-896-retuning-calibration.js pack
// into 6 triple-runs, each re-measuring the eps=0 baseline for internal
// consistency with the ratio. Emitted by --list as shell one-liners so an
// offline worker can pipe the list into GNU parallel / xargs without manual
// transcription. Each line carries a trailing `# <label>` comment for grep.
const BATCH_PLAN = [
  { N: 1000,  eps: [0, 0.02, 0.1],  label: 'N1000-eps-0p02-0p1' },
  { N: 2000,  eps: [0, 0.02, 0.1],  label: 'N2000-eps-0p02-0p1' },
  { N: 5000,  eps: [0, 0.01, 0.02], label: 'N5000-eps-0p01-0p02' },
  { N: 5000,  eps: [0, 0.05, 0.1],  label: 'N5000-eps-0p05-0p1' },
  { N: 10000, eps: [0, 0.01, 0.02], label: 'N10000-eps-0p01-0p02' },
  { N: 10000, eps: [0, 0.05, 0.1],  label: 'N10000-eps-0p05-0p1' },
];

const args = parseArgs(process.argv);

if (args.list) {
  for (const p of BATCH_PLAN) {
    console.log(
      `node scripts/imp-917-run-cell.mjs --N ${p.N} --eps ${p.eps.join(',')}  # ${p.label}`,
    );
  }
  process.exit(0);
}

if (!Number.isFinite(args.N)) {
  console.error('imp-917-run-cell: --N <integer> is required');
  process.exit(2);
}
if (!args.eps || args.eps.split(',').length !== 3) {
  console.error(
    'imp-917-run-cell: --eps <e0,e1,e2> is required (exactly 3 comma-separated numbers)',
  );
  process.exit(2);
}
const epsTriple = args.eps.split(',').map((s) => Number(s.trim()));
if (epsTriple.some((e) => !Number.isFinite(e))) {
  console.error('imp-917-run-cell: --eps values must all be finite numbers');
  process.exit(2);
}

const retuning = IMP_896_RETUNING_CALIBRATION.retuningTable.find(
  (r) => r.N === args.N,
);
if (!retuning) {
  console.error(
    `imp-917-run-cell: N=${args.N} not in RETUNING_CALIBRATION. Supported N: ` +
      IMP_896_RETUNING_CALIBRATION.retuningTable.map((r) => r.N).join(', '),
  );
  process.exit(2);
}

// Fill nSteps/dt defaults from the matching MISSING_CELLS row (imp-896 schedule).
// If no row matches (e.g. synthetic pilot N), require explicit --nSteps --dt.
const cellRow = IMP_896_RETUNING_CALIBRATION.missingCells.find(
  (c) => c.N === args.N,
);
const nSteps = args.nSteps ?? cellRow?.nSteps ?? null;
const dt = args.dt ?? cellRow?.dt ?? null;
if (!Number.isFinite(nSteps) || !Number.isFinite(dt)) {
  console.error(
    `imp-917-run-cell: no MISSING_CELLS default for N=${args.N}; pass --nSteps and --dt explicitly`,
  );
  process.exit(2);
}

const env = {
  ...process.env,
  IMP857_N: String(args.N),
  IMP857_NSTEPS: String(nSteps),
  IMP857_DT: String(dt),
  IMP857_K0: String(retuning.k0_star),
  IMP857_PHASEVEL: String(retuning.phaseVel_star),
  IMP857_EPSILONS: epsTriple.join(','),
};

const prototypePath = resolve(
  REPO_ROOT,
  'src/math/imp-857-phase-locked-dyson.mjs',
);

console.log('imp-917 cell:');
console.log(`  N         = ${args.N}`);
console.log(`  nSteps    = ${nSteps}`);
console.log(`  dt        = ${dt}`);
console.log(`  k0_star   = ${retuning.k0_star}`);
console.log(`  phaseVel* = ${retuning.phaseVel_star}`);
console.log(`  epsilons  = ${epsTriple.join(', ')}`);
console.log('spawning prototype:', prototypePath);
console.log('---');

const startedAt = Date.now();
const res = spawnSync('node', [prototypePath], {
  env,
  stdio: 'inherit',
  cwd: REPO_ROOT,
});
const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log('---');
console.log(`imp-917 cell finished in ${elapsedSec} s (status=${res.status})`);
if (res.status !== 0) process.exit(res.status ?? 1);
