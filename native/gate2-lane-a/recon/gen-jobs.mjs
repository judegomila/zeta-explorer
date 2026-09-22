// imp-95211 — Gate-2 family margin reconnaissance: job-list generator.
// Emits jobs-family.txt lines: N NPTS SIDES TOPK ZPTS TAG
// Tier policies keep the sampling configuration uniform within an N-tier so
// the sampled-sup bias is comparable across a tier (trend readable); the
// three depth probes calibrate the residual resolution bias vs N.
const NLO = 690988, NHI = 54799999;

// tier policy: [npts, topk, zpts]
function policy(N) {
  if (N <= 2e6) return [6144, 8, 64, 'L'];
  if (N <= 1e7) return [2048, 3, 64, 'M'];
  if (N <= 3e7) return [1536, 2, 32, 'H'];
  return [1024, 1, 32, 'T'];
}

// deterministic PRNG (mulberry32), seed = 95211
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(95211);

const jobs = new Map(); // N -> line (dedupe; later adders don't overwrite)
let terms = 0;
function zoomLevels(h0, N, zpts) {
  const osc = 1 / Math.log(N);
  const shrink = (zpts - 1) / 4;
  let lv = Math.ceil(Math.log(h0 / (0.25 * osc)) / Math.log(shrink));
  return Math.max(2, Math.min(8, lv));
}
function add(N, tag, opts = {}) {
  N = Math.round(N);
  if (N < NLO) N = NLO;
  if (N > NHI) N = NHI;
  if (jobs.has(N)) return;
  const [pn, pk, pz] = policy(N);
  const npts = opts.npts ?? pn;
  const topk = opts.topk ?? pk;
  const zpts = opts.zpts ?? pz;
  const sides = opts.sides ?? 1;
  const lv = zoomLevels((2 * N + 1) / (npts - 1), N, zpts);
  terms += (npts * sides + 2 * topk * lv * zpts) * N;
  jobs.set(N, `${N} ${npts} ${sides} ${topk} ${zpts} ${tag}`);
}

// 1) sentinels (headline windows, run first)
const sent = [];
function addSentinel(N, tag, opts) { add(N, tag, opts); sent.push(Math.round(N)); }
addSentinel(NLO, 'sentinel-lo', { sides: 2 });
addSentinel(NHI, 'sentinel-hi');
addSentinel(3840000, 'sentinel-3p84e6'); // selftest structural landmark
addSentinel(Math.floor(Math.sqrt(2 ** 50 / (4 * Math.PI))), 'sentinel-pow2-50');
addSentinel(20000000, 'sentinel-2e7');

// 2) log-spaced per tier
function logSpaced(lo, hi, n, tag) {
  for (let i = 0; i < n; i++) add(lo * Math.exp((Math.log(hi / lo) * i) / (n - 1)), tag);
}
logSpaced(NLO, 2e6, 48, 'log-L');
logSpaced(2.05e6, 1e7, 70, 'log-M');
logSpaced(1.03e7, 3e7, 26, 'log-H');
logSpaced(3.08e7, NHI, 12, 'log-T');

// 3) shallow scouts, log-uniform random in [NLO, 1e7]
for (let i = 0; i < 120; i++) {
  const N = NLO * Math.exp(rnd() * Math.log(1e7 / NLO));
  add(N, 'scout', { npts: 512, topk: 2, zpts: 48 });
}

// 4) low-edge cluster
for (let d = 1; d <= 9; d++) add(NLO + d, 'edge-lo');
for (const d of [20, 50, 100, 300, 1000, 3000, 10000, 30000, 100000, 300000])
  add(NLO + d, 'edge-lo');

// 5) high-edge cluster (family top = SPF sieve boundary region), lean policy
for (const d of [1, 2, 3, 4, 9, 20, 100, 1000, 30000, 1000000])
  add(NHI - d, 'edge-hi', { npts: 512, topk: 1, zpts: 32 });

// 6) power-of-2 x-crossings: x_N crosses 2^k, k = 43..55
for (let k = 43; k <= 55; k++) {
  const N = Math.floor(Math.sqrt(2 ** k / (4 * Math.PI)));
  if (N >= NLO && N <= NHI) add(N, `pow2-${k}`);
}

// 7) random full-family
for (let i = 0; i < 12; i++) {
  const N = NLO * Math.exp(rnd() * Math.log(NHI / NLO));
  add(N, 'random');
}

// 8) depth probes (resolution-bias calibration at large N)
add(Math.floor(Math.sqrt(2 ** 50 / (4 * Math.PI))) + 7, 'depth-9p5e6', { npts: 8192, topk: 4, zpts: 64 });
add(26800000, 'depth-2p68e7', { npts: 4096, topk: 2, zpts: 48 });
add(54799989, 'depth-top', { npts: 4096, topk: 2, zpts: 48 });

// 9) dual-side seam checks spread across tiers
for (const N of [800000, 1500000, 3000000, 6000000, 13000000, 22000000, 35000000, 46000000])
  add(N + 17, 'dual', { sides: 2 });

// order: sentinels first, rest deterministically shuffled (round-robin coverage
// if the run is stopped early)
const sentSet = new Set(sent);
const rest = [...jobs.keys()].filter((n) => !sentSet.has(n));
const rnd2 = mulberry32(422);
for (let i = rest.length - 1; i > 0; i--) {
  const j = Math.floor(rnd2() * (i + 1));
  [rest[i], rest[j]] = [rest[j], rest[i]];
}
const order = [...sent.filter((n, i) => sent.indexOf(n) === i), ...rest];
const lines = order.map((n) => jobs.get(n));
console.log(lines.join('\n'));
console.error(`windows: ${lines.length}, estimated terms: ${terms.toExponential(3)}, est wall @5.2e8/s: ${(terms / 5.2e8 / 3600).toFixed(2)} h`);
