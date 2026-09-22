// imp-95211 family-margin recon: analysis of family-recon.jsonl
// Usage: node analyze.mjs [path/to/family-recon.jsonl]
import { readFileSync } from 'node:fs';

const REX = 0.2796881955526244;
const path = process.argv[2] ?? new URL('./family-recon.jsonl', import.meta.url).pathname;
const rows = readFileSync(path, 'utf8')
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l))
  .sort((a, b) => a.N - b.N);

console.log(`windows: ${rows.length}`);

// dedupe by N (keep the deeper run if duplicated)
const byN = new Map();
for (const r of rows) {
  const prev = byN.get(r.N);
  if (!prev || r.evals > prev.evals) byN.set(r.N, r);
}
const W = [...byN.values()].sort((a, b) => a.N - b.N);

// global checks
let telMax = 0, telAt = 0;
for (const r of W) if (r.telMax > telMax) { telMax = r.telMax; telAt = r.N; }
console.log(`max telescope err: ${telMax.toExponential(3)} at N=${telAt}`);

// worst windows
const byP = [...W].sort((a, b) => b.supPilot.v - a.supPilot.v);
const byE = [...W].sort((a, b) => b.supE97.v - a.supE97.v);
console.log('\nTOP-8 by sampled sup pilot (ratio to Rex):');
for (const r of byP.slice(0, 8))
  console.log(
    `  N=${r.N} tag=${r.tag} supP=${r.supPilot.v.toFixed(6)} (${(100 * r.supPilot.v / REX).toFixed(2)}% of Rex) w=${r.supPilot.w.toFixed(4)} supE=${r.supE97.v.toFixed(6)} npts=${r.npts}`
  );
console.log('TOP-5 by sampled sup |E97|:');
for (const r of byE.slice(0, 5))
  console.log(
    `  N=${r.N} tag=${r.tag} supE=${r.supE97.v.toFixed(6)} (${(100 * r.supE97.v / REX).toFixed(2)}% of Rex) w=${r.supE97.w.toFixed(4)} npts=${r.npts}`
  );

// LOUD flag: anything within 5% of Rex
const flags = W.filter((r) => r.supPilot.v >= 0.95 * REX || r.supE97.v >= 0.95 * REX);
console.log(
  flags.length
    ? `\n*** LOUD FLAG: ${flags.length} window(s) within 5% of Rex: ${flags.map((r) => r.N).join(', ')} ***`
    : '\nno window within 5% of Rex (sampled)'
);

// trend fits per uniform-config series: sup = a + b * ln N
function fit(series, key) {
  const xs = series.map((r) => Math.log(r.N));
  const ys = series.map((r) => r[key].v);
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  const r2 = sxx && syy ? (sxy * sxy) / (sxx * syy) : 0;
  // residual scatter
  let ss = 0;
  for (let i = 0; i < n; i++) ss += (ys[i] - (a + b * xs[i])) ** 2;
  return { a, b, r2, rms: Math.sqrt(ss / n), n };
}
const seriesDefs = [
  ['scout (npts 512, N<=1e7)', (r) => r.tag === 'scout'],
  ['tier L (npts 6144)', (r) => r.npts === 6144],
  ['tier M (npts 2048)', (r) => r.npts === 2048],
  ['tier H (npts 1536)', (r) => r.npts === 1536],
  ['tier T (npts 1024)', (r) => r.npts === 1024],
  ['edge-hi (npts 512 @ top)', (r) => r.tag === 'edge-hi'],
];
console.log('\ntrend fits sup = a + b*lnN per uniform-config series:');
const fits = {};
for (const [name, sel] of seriesDefs) {
  const s = W.filter(sel);
  if (s.length < 4) continue;
  const fp = fit(s, 'supPilot');
  const fe = fit(s, 'supE97');
  fits[name] = { pilot: fp, e97: fe };
  console.log(
    `  ${name} [n=${s.length}]: pilot b=${fp.b.toExponential(3)}/lnN (r2=${fp.r2.toFixed(3)}, rms=${fp.rms.toFixed(4)}), ` +
    `E97 b=${fe.b.toExponential(3)}/lnN (r2=${fe.r2.toFixed(3)})`
  );
}

// zoom lift + subgrid (resolution-bias) statistics
const lifts = W.map((r) => r.supPilot.v / r.gridSupPilot.v - 1);
const sub4gap = W.map((r) => 1 - r.sub4SupPilot / r.gridSupPilot.v);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
console.log(`\nzoom lift (pilot): mean ${(100 * mean(lifts)).toFixed(2)}%, max ${(100 * Math.max(...lifts)).toFixed(2)}%`);
console.log(`stride-4 subgrid deficit (pilot): mean ${(100 * mean(sub4gap)).toFixed(2)}%`);

// w-location concentration
const wbins = new Array(10).fill(0);
for (const r of W) wbins[Math.min(9, Math.floor(r.supPilot.w * 10))]++;
console.log(`w-location histogram of pilot sup (deciles): ${wbins.join(' ')}`);

// dual-side seam agreement (from sides=2 windows: compare per-side top records)
const dual = W.filter((r) => r.sides === 2);
console.log(`\ndual-side windows: ${dual.map((r) => r.N).join(', ')}`);

// wall/eval totals
const wall = rows.reduce((s, r) => s + r.wall, 0);
const evals = rows.reduce((s, r) => s + r.evals, 0);
const terms = rows.reduce((s, r) => s + r.evals * r.N, 0);
console.log(`\ntotal window wall: ${(wall / 3600).toFixed(2)} h, evals: ${evals.toExponential(3)}, term-evals: ${terms.toExponential(3)}, throughput ${(terms / wall / 1e8).toFixed(2)}e8 terms/s`);

// compact table for the frozen JS module
const compact = {
  N: W.map((r) => r.N),
  tag: W.map((r) => r.tag),
  npts: W.map((r) => r.npts),
  supPilot: W.map((r) => Number(r.supPilot.v.toExponential(6))),
  supE97: W.map((r) => Number(r.supE97.v.toExponential(6))),
  wPilot: W.map((r) => Number(r.supPilot.w.toFixed(4))),
  wE97: W.map((r) => Number(r.supE97.w.toFixed(4))),
  gridSupPilot: W.map((r) => Number(r.gridSupPilot.v.toExponential(6))),
  sub4SupPilot: W.map((r) => Number(r.sub4SupPilot.toExponential(6))),
  telMax: W.map((r) => Number(r.telMax.toExponential(2))),
};
if (process.argv.includes('--emit-table')) {
  console.log('\n===COMPACT TABLE JSON===');
  console.log(JSON.stringify({ compact, fits }, null, 0));
}
