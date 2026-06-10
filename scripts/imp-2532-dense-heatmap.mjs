// scripts/imp-2532-dense-heatmap.mjs
//
// imp-2532: execute the imp-899 dense (k0, phaseVel) heatmap at N = 500.
//
// Runs the full 5 x 4 grid named by the imp-894 / imp-899 sub-gap record in
// src/data/imp-857-resonance-tuning-sweep.js:
//   k0       in {pi/2, pi, 2*pi, pi/min_gap, 2*pi/min_gap}
//   phaseVel in {pi*rho_min, pi*rho_mean, pi*rho_max/2, pi*rho_max}
//   eps      in {0.01, 0.02, 0.05, 0.1}
// at N = 500, IMP857_NSTEPS = 200, dt = 0.0003 (prototype defaults), via the
// existing env-var infrastructure of src/math/imp-857-phase-locked-dyson.mjs.
//
// The prototype accepts exactly 3 eps values per invocation, so each cell is
// covered by two runs: {0, 0.01, 0.02} and {0, 0.05, 0.1}. The duplicated
// eps = 0 baseline doubles as a per-run sanity check (the baseline trace is
// independent of k0/omega, so every run must report the same baseline
// collision step and tau_c).
//
// IMPORTANT REGIME NOTE (discovered by the imp-2532 timing probe): at
// dt = 0.0003 the N = 500 backward flow COLLIDES at step ~45 (tau_c ~
// 0.0135), so "nSteps = 200" is run-to-collision — each trace terminates at
// its collision step with the imp-898 sub-step bisection refining tau_c.
// The per-cell observables harvested here are therefore:
//   (a) tau_c(eps) at sub-step resolution + the shift tau_c(eps) - tau_c(0),
//   (b) maxIntervalWidth at the collision step (the same "final state"
//       metric the prototype headline uses), and
//   (c) maxIntervalWidth at the pre-collision marks step 1 and step 10.
//
// Usage:
//   node scripts/imp-2532-dense-heatmap.mjs            # full 40-run sweep
//   IMP2532_CONCURRENCY=4 node scripts/imp-2532-dense-heatmap.mjs
//
// Results are persisted incrementally (after every completed run) to
// scripts/imp-2532-dense-heatmap-results.json so a partial sweep can be
// inspected or resumed-by-rerun without losing completed cells.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileP = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROTOTYPE = path.join(HERE, '..', 'src', 'math', 'imp-857-phase-locked-dyson.mjs');
const OUT_FILE = path.join(HERE, 'imp-2532-dense-heatmap-results.json');

// Calibration constants — must match CALIBRATION_N500 in
// src/data/imp-857-resonance-tuning-sweep.js (first 500 zeros).
const MIN_GAP = 0.3104307050000443;
const RHO_MIN = 0.14519447317754744;
const RHO_MEAN = 0.6260588787682543;
const RHO_MAX = 3.221330828082413;

const K0_GRID = [
  { label: 'pi/2', value: Math.PI / 2 },
  { label: 'pi', value: Math.PI },
  { label: '2pi', value: 2 * Math.PI },
  { label: 'pi/minGap', value: Math.PI / MIN_GAP },
  { label: '2pi/minGap', value: (2 * Math.PI) / MIN_GAP },
];

const PV_GRID = [
  { label: 'pi*rhoMin', value: Math.PI * RHO_MIN },
  { label: 'pi*rhoMean', value: Math.PI * RHO_MEAN },
  { label: 'pi*rhoMax/2', value: (Math.PI * RHO_MAX) / 2 },
  { label: 'pi*rhoMax', value: Math.PI * RHO_MAX },
];

const EPS_RUNS = [
  ['0', '0.01', '0.02'],
  ['0', '0.05', '0.1'],
];

const CONCURRENCY = Number(process.env.IMP2532_CONCURRENCY ?? 5);
const NSTEPS = 200;

// ---- stdout parser ----------------------------------------------------------

// Parse one prototype stdout into { finals, tauC, marks }.
//   finals: [{ regime, step, maxW, minGap }]   (three entries, R0/R1/R2)
//   tauC:   [{ eps, tauC, dtFrac } | null]     (per regime; null = no collision)
//   marks:  { '1': [w0, w1, w2], '10': [w0, w1, w2] }
function parseRun(stdout, epsTriple) {
  const lines = stdout.split('\n');
  const finals = [];
  const tauC = [null, null, null];
  const marks = {};

  for (const line of lines) {
    const fm = line.match(/^\s+R([012]) \(.*\)\s*: step=(\d+)\s+maxW=(\S+)\s+minGap=(\S+)/);
    if (fm) {
      finals[Number(fm[1])] = {
        eps: Number(epsTriple[Number(fm[1])]),
        step: Number(fm[2]),
        maxW: Number(fm[3]),
        minGap: Number(fm[4]),
      };
      continue;
    }
    const mm = line.match(/^\s*(\d+) \|\s+(\S+)\s+(\S+)\s+(\S+)\s+\|/);
    if (mm && (mm[1] === '1' || mm[1] === '10')) {
      marks[mm[1]] = [Number(mm[2]), Number(mm[3]), Number(mm[4])];
      continue;
    }
    const tm = line.match(/tau_c=([0-9.]+)\s+\(sub-step dt=([0-9.e+-]+), fraction=([0-9.]+)\)/);
    if (tm) {
      const em = line.match(/=([0-9.]+)/); // first "=num" is the eps label
      const epsVal = em ? Number(em[1]) : NaN;
      const idx = epsTriple.findIndex((e) => Number(e) === epsVal);
      if (idx >= 0) {
        tauC[idx] = { eps: epsVal, tauC: Number(tm[1]), dtFrac: Number(tm[3]) };
      }
    }
  }
  return { finals, tauC, marks };
}

// ---- job runner --------------------------------------------------------------

async function runJob(job) {
  const env = {
    ...process.env,
    IMP857_NSTEPS: String(NSTEPS),
    IMP857_K0: String(job.k0),
    IMP857_PHASEVEL: String(job.phaseVel),
    IMP857_EPSILONS: job.epsTriple.join(','),
  };
  const t0 = Date.now();
  const { stdout } = await execFileP('node', [PROTOTYPE], {
    env,
    maxBuffer: 16 * 1024 * 1024,
    timeout: 30 * 60 * 1000,
  });
  const parsed = parseRun(stdout, job.epsTriple);
  return {
    k0Label: job.k0Label,
    k0: job.k0,
    pvLabel: job.pvLabel,
    phaseVel: job.phaseVel,
    epsTriple: job.epsTriple.map(Number),
    wallSeconds: Math.round((Date.now() - t0) / 1000),
    ...parsed,
  };
}

function saveResults(results, meta) {
  const tmp = OUT_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify({ meta, results }, null, 1));
  fs.renameSync(tmp, OUT_FILE);
}

// ---- main ---------------------------------------------------------------------

const jobs = [];
for (const k0 of K0_GRID) {
  for (const pv of PV_GRID) {
    for (const epsTriple of EPS_RUNS) {
      jobs.push({
        k0Label: k0.label,
        k0: k0.value,
        pvLabel: pv.label,
        phaseVel: pv.value,
        epsTriple,
      });
    }
  }
}

const meta = {
  ticket: 'imp-2532',
  closes: ['imp-899', 'imp-894-sub-resonance-sweep', 'imp-899-sub-nstep200-grid'],
  N: 500,
  nSteps: NSTEPS,
  dt: 0.0003,
  k0Grid: K0_GRID,
  pvGrid: PV_GRID,
  epsRuns: EPS_RUNS,
  totalJobs: jobs.length,
  concurrency: CONCURRENCY,
};

const results = [];
let nextJob = 0;
let done = 0;

async function worker(wid) {
  for (;;) {
    const idx = nextJob++;
    if (idx >= jobs.length) return;
    const job = jobs[idx];
    const tag = `[w${wid}] ${job.k0Label} x ${job.pvLabel} eps={${job.epsTriple.join(',')}}`;
    console.log(`${tag} START (${idx + 1}/${jobs.length})`);
    try {
      const r = await runJob(job);
      results.push(r);
      done++;
      saveResults(results, meta);
      const t1 = r.tauC[1] ? r.tauC[1].tauC.toFixed(7) : 'none';
      const t2 = r.tauC[2] ? r.tauC[2].tauC.toFixed(7) : 'none';
      console.log(`${tag} DONE in ${r.wallSeconds}s  tau_c=[${t1}, ${t2}]  (${done}/${jobs.length})`);
    } catch (err) {
      results.push({ ...job, error: String(err && err.message ? err.message : err) });
      done++;
      saveResults(results, meta);
      console.log(`${tag} ERROR: ${err}`);
    }
  }
}

console.log(`imp-2532 dense heatmap: ${jobs.length} runs, concurrency ${CONCURRENCY}`);
await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
console.log(`All ${done} runs complete. Results: ${OUT_FILE}`);
