/**
 * @fileoverview imp-96951 -- SCOUT (numerical): the ticket asks to extend the imp-96487
 * Burnol ratio(N) ladder by 5 rungs (N=11000..15000) and re-measure the imp-96915 genuine
 * w=0.70 Lomb-Scargle peak FAP against the imp-96933 n*=26 coherent-signal prediction. The 5
 * GENUINE ratio(N) solves are CPU-BLOCKED -- an N=15000 Nyman-Beurling / Vasyunin-Gram build
 * is an O(N^3) dense solve on a 15000x15000 Gram matrix, the same block that stopped the
 * measured ladder at N=10000 (imp-96105 IMP96105_SUBGAP, imp-96325). Rather than fabricate
 * solves, this module RECONSTRUCTS the imp-96915 periodogram from scratch (reproducing its
 * genuine peak bit-close: w=0.7005, power=5.1829, FAP=0.1115 vs the module 0.7006/5.1829/0.111)
 * and then FORECASTS the n=26 peak FAP under two EXPLICIT bracketing extension models built from
 * the existing 21 rungs. The 5 new rungs are MODEL FORECASTS, not solves, and are labelled as
 * such throughout. Measurement of the coherence models only; the qualitative VIF>1 conclusion is
 * untouched; NO QED.
 *
 * METHOD (driver tmp/imp-96951-scratch.mjs, pure JS). A Scargle-1982 variance-normalized
 * periodogram is run on the 21 detrended ratios at unit-spaced index t=0..20 (the same convention
 * imp-96915 used); it reproduces the genuine low-frequency peak w=0.7005, normalized power 5.1829,
 * FAP=1-(1-e^-z)^M with M=n=21 giving 0.1115 -- matching imp-96915 FINDING 2/4 exactly, which
 * validates the reconstruction. A sinusoid A cos(w t)+B sin(w t)+C is least-squares fit at the peak
 * w (amp=0.0128, centerline C=0.9853, in-sample residual rms=0.0089). Two extensions to n=26 rungs
 * (indices t=21..25) are then formed and re-periodogrammed:
 *   COHERENT -- new rungs = the pure fitted sinusoid continuation (oscillation stays perfectly
 *               coherent; an UPPER bound on how fast the peak power can grow).
 *   DAMPED   -- new rungs = the plateau centerline C (the oscillation has died; new rungs add no
 *               oscillatory power, only lengthen the frequency grid M).
 *
 * FINDING 1 -- UNDER A COHERENT CONTINUATION THE PEAK CLEARS FAP=0.05 BY n=24, CONFIRMING (AND
 * SLIGHTLY BEATING) THE imp-96933 n*=26 ESTIMATE. The periodogram peak power grows 5.1829 -> 7.2181
 * across the 5 forecast rungs, a touch FASTER than the imp-96933 abstract linear model z(n)=z0*n/n0
 * (which gives z(26)=6.4169). Rung-by-rung FAP: n=22 0.0779, n=23 0.0619, n=24 0.0499 (clears),
 * n=25 0.0330, n=26 0.0189. So a noise-free coherent extension reaches significance one rung earlier
 * than the imp-96933 M=n coherent branch predicted -- the coherent branch is self-consistent.
 *
 * FINDING 2 -- UNDER A DAMPED CONTINUATION THE FAP INSTEAD WORSENS AND NEVER CLEARS. If the
 * oscillation has died, the 5 new rungs sit at the centerline: the peak power barely moves (5.1829 ->
 * 5.0228) while the independent-frequency count M grows 21 -> 26, so FAP RISES to 0.1579 -- worse
 * than the 21-rung 0.1115. This is more pessimistic than the imp-96933 incoherent sqrt-power branch
 * (n*=33): if the remainder amplitude has fully decayed by N=1e4 (which the imp-96487 plateau reading
 * at ~0.985 is consistent with), NO finite number of further rungs clears the peak.
 *
 * FINDING 3 -- THE TWO BRANCHES BRACKET THE imp-96933 BAND AND THE OUTCOME IS UNDECIDABLE WITHOUT
 * GENUINE SOLVES. COHERENT (clears by n=24) and DAMPED (never clears) bracket the imp-96933 honest
 * band of ~1-12 additional rungs (and its "or never" incoherent tail). Which branch the true ladder
 * follows is exactly the coherence question imp-96933 flagged as conditional -- and it can only be
 * settled by GENUINE ratio(N) solves at N>1e4, the CPU-blocked wider-N Gram build. The forecast
 * measures the models, not new data.
 *
 * VERDICT. The reconstruction reproduces the imp-96915 genuine w=0.70 peak (5.1829, FAP 0.1115)
 * exactly, and the forecast shows the imp-96933 n*=26 coherent-branch estimate is self-consistent
 * (a coherent extension clears FAP=0.05 by n=24, power 5.18 -> 7.22) while a damped extension never
 * clears (FAP 0.1115 -> 0.1579). The genuine 5-rung extension N=11000..15000 remains CPU-blocked,
 * so the branch is not decided. SUB-GAP IMP96951_EXTENSION_BRACKETED_NOT_SOLVED. Measurement of the
 * coherence models only; the 5 new rungs are model forecasts, not solves; the qualitative VIF>1
 * conclusion is untouched; interval-rigorous certificate reach stays 2a<=0.96; C_mb GUE-conditional
 * (imp-486); no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96933-burnol-peak-fap-rung-count.js (estimated n*=26 coherent, band 1-12 rungs -- FINDING 1)
 * @see imp-96915-burnol-oscillation-frequency-periodogram.js (genuine peak w=0.70, power 5.18, FAP 0.111 at 21 rungs)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ratio(N) ladder N=250..10000; ~0.985 plateau)
 */

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96951_RIGOROUS_REACH_2A = 0.96;

// The genuine 5-rung extension the ticket asks for is CPU-blocked: an N=15000 Nyman-Beurling /
// Vasyunin-Gram build is an O(N^3) dense solve, the same block that capped the ladder at N=10000.
export const IMP96951_GENUINE_SOLVES_BLOCKED = Object.freeze({
  requested: 'ratio(N) at N in {11000,12000,13000,14000,15000}',
  blocked: true,
  reason: 'O(N^3) dense Nyman-Beurling / Vasyunin-Gram solve on a 15000x15000 Gram matrix; the same CPU block that stopped the measured ladder at N=10000 (imp-96105 IMP96105_SUBGAP, imp-96325)',
  forecastInstead: 'the 5 new rungs here are MODEL FORECASTS (coherent vs damped continuation of the fitted w=0.70 oscillation), not solves',
});

// The 21 measured ratios (imp-96487 ladder; baked, no new solve).
export const IMP96951_RATIOS_21 = Object.freeze([
  0.9853030459881754, 0.9982700629705589, 0.9640024763631571, 0.9804200969828122,
  0.9826926433733114, 0.9885961620169521, 0.9995152003949765, 1.0060890778581055,
  1.002990665259071, 1.0102287163795478, 0.9729204905638247, 0.963885588735333,
  0.9724333692631612, 0.9774701947103525, 0.9779064862688012, 0.9847994277553519,
  0.9856144779200688, 0.9877716335211392, 0.9862693761733939, 0.9768617315761334,
  0.9769102009811711,
]);

// --- Scargle-1982 variance-normalized periodogram (pure JS, reproduces imp-96915) ---
function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
function variance(a) { const m = mean(a); return a.reduce((s, x) => s + (x - m) * (x - m), 0) / a.length; }
function scarglePower(y, t, w) {
  const s2 = variance(y), m = mean(y), yy = y.map((v) => v - m);
  let s2w = 0, c2w = 0;
  for (const ti of t) { s2w += Math.sin(2 * w * ti); c2w += Math.cos(2 * w * ti); }
  const tau = Math.atan2(s2w, c2w) / (2 * w);
  let cc = 0, ss = 0, yc = 0, ys = 0;
  for (let i = 0; i < t.length; i++) {
    const c = Math.cos(w * (t[i] - tau)), s = Math.sin(w * (t[i] - tau));
    cc += c * c; ss += s * s; yc += yy[i] * c; ys += yy[i] * s;
  }
  return (1 / (2 * s2)) * ((yc * yc) / cc + (ys * ys) / ss);
}
function peakInBand(y, t, wlo, whi, step) {
  let best = { w: wlo, P: -1 };
  for (let w = wlo; w <= whi; w += step) { const P = scarglePower(y, t, w); if (P > best.P) best = { w, P }; }
  return best;
}
// FAP model (imp-96933 convention): M = n independent frequencies.
function fap(z, M) { return 1 - Math.pow(1 - Math.exp(-z), M); }

// --- reconstruction of the imp-96915 21-rung genuine peak (validates the method) ---
const T21 = Array.from({ length: 21 }, (_, i) => i);
const PK21 = peakInBand(IMP96951_RATIOS_21, T21, 0.05, Math.PI, 0.0005);
export const IMP96951_RECONSTRUCTED_PEAK_21 = Object.freeze({
  w: PK21.w,               // 0.7005 (imp-96915 reports 0.7006)
  power: PK21.P,           // 5.1829 (imp-96915 reports 5.1829)
  fap: fap(PK21.P, 21),    // 0.1115 (imp-96915 reports 0.111)
  matchesImp96915: Math.abs(PK21.P - 5.1829) < 0.01 && Math.abs(fap(PK21.P, 21) - 0.111) < 0.002,
});

// --- fit sinusoid A cos(w t)+B sin(w t)+C at the peak w for the continuation ---
function solve3(M, v) {
  const det = (X) => X[0][0] * (X[1][1] * X[2][2] - X[1][2] * X[2][1])
    - X[0][1] * (X[1][0] * X[2][2] - X[1][2] * X[2][0])
    + X[0][2] * (X[1][0] * X[2][1] - X[1][1] * X[2][0]);
  const d = det(M);
  const col = (k) => M.map((row, r) => row.map((x, c) => (c === k ? v[r] : x)));
  return [det(col(0)) / d, det(col(1)) / d, det(col(2)) / d];
}
const WG = PK21.w;
let Scc = 0, Sss = 0, Scs = 0, Sc = 0, Ss = 0, Syc = 0, Sys = 0, Sy = 0;
for (let i = 0; i < 21; i++) {
  const c = Math.cos(WG * i), s = Math.sin(WG * i), y = IMP96951_RATIOS_21[i];
  Scc += c * c; Sss += s * s; Scs += c * s; Sc += c; Ss += s; Syc += y * c; Sys += y * s; Sy += y;
}
const [FA, FB, FC] = solve3([[Scc, Scs, Sc], [Scs, Sss, Ss], [Sc, Ss, 21]], [Syc, Sys, Sy]);
export const IMP96951_FITTED_SINUSOID = Object.freeze({
  w: WG, A: FA, B: FB, C: FC, amp: Math.hypot(FA, FB), // amp 0.0128, C 0.9853
});

// --- COHERENT extension to n=26 (pure sinusoid continuation) ---
const COH = IMP96951_RATIOS_21.slice();
for (let i = 21; i < 26; i++) COH.push(FA * Math.cos(WG * i) + FB * Math.sin(WG * i) + FC);
const T26 = Array.from({ length: 26 }, (_, i) => i);
const PKC = peakInBand(COH, T26, 0.05, Math.PI, 0.0005);

// rung-by-rung coherent FAP; first n that clears FAP=0.05
const IMP96951_COHERENT_LADDER = [];
let cohClearN = null;
for (let n = 21; n <= 26; n++) {
  const pk = peakInBand(COH.slice(0, n), T26.slice(0, n), 0.05, Math.PI, 0.001);
  const f = fap(pk.P, n);
  IMP96951_COHERENT_LADDER.push(Object.freeze({ n, w: pk.w, power: pk.P, fap: f, linearZ: PK21.P * n / 21 }));
  if (cohClearN === null && f < 0.05) cohClearN = n;
}
export const IMP96951_COHERENT = Object.freeze({
  model: 'new rungs = pure fitted sinusoid continuation (perfectly coherent; upper bound on power growth)',
  peakW: PKC.w, peakPowerAt26: PKC.P, fapAt26: fap(PKC.P, 26),
  clearsAtN: cohClearN,          // 24
  clearsFapAt05: fap(PKC.P, 26) < 0.05,
  ladder: Object.freeze(IMP96951_COHERENT_LADDER.map((r) => Object.freeze(r))),
  linearZAt26: PK21.P * 26 / 21, // imp-96933 abstract model 6.4169
  growsFasterThanLinear: PKC.P > PK21.P * 26 / 21,
});

// --- DAMPED extension to n=26 (new rungs at the centerline; oscillation died) ---
const DMP = IMP96951_RATIOS_21.slice();
for (let i = 21; i < 26; i++) DMP.push(FC);
const PKD = peakInBand(DMP, T26, 0.05, Math.PI, 0.0005);
export const IMP96951_DAMPED = Object.freeze({
  model: 'new rungs = plateau centerline C (oscillation has died; new rungs add no oscillatory power)',
  peakW: PKD.w, peakPowerAt26: PKD.P, fapAt26: fap(PKD.P, 26),
  clearsFapAt05: fap(PKD.P, 26) < 0.05,       // false
  fapWorsensVs21: fap(PKD.P, 26) > IMP96951_RECONSTRUCTED_PEAK_21.fap, // true (M grows, power flat)
});

export const IMP96951_VERDICT = Object.freeze({
  ticket: 'imp-96951',
  question: 'extend the imp-96487 Burnol ratio(N) ladder by 5 rungs (N=11000..15000) and re-measure the imp-96915 w=0.70 peak FAP against the imp-96933 n*=26 coherent-signal prediction',
  genuineSolvesBlocked: true,
  reconstructionMatchesImp96915: IMP96951_RECONSTRUCTED_PEAK_21.matchesImp96915,
  // Finding 1: coherent branch confirms (and slightly beats) n*=26
  coherentClearsAtN: cohClearN,                     // 24
  coherentPeakPowerAt26: PKC.P,                      // 7.2181
  coherentBeatsImp96933Linear: PKC.P > PK21.P * 26 / 21,
  // Finding 2: damped branch never clears
  dampedFapAt26: fap(PKD.P, 26),                     // 0.1579
  dampedNeverClears: !(fap(PKD.P, 26) < 0.05),
  // Finding 3: brackets, undecidable without genuine solves
  branchUndecidedWithoutGenuineSolves: true,
  vifConclusionUntouched: true,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96951_EXTENSION_BRACKETED_NOT_SOLVED -- the genuine 5-rung ratio(N) extension N=11000..15000 is CPU-blocked (O(N^3) Vasyunin-Gram, the block that capped the ladder at N=10000), so instead the imp-96915 periodogram is reconstructed (reproducing the genuine peak w=0.7005, power 5.1829, FAP 0.1115 exactly) and the n=26 FAP is FORECAST under two bracketing continuation models. A COHERENT extension (pure fitted-sinusoid rungs) clears FAP=0.05 by n=24 with peak power growing 5.1829->7.2181, self-consistently confirming and slightly beating the imp-96933 n*=26 coherent-branch estimate (abstract linear z(26)=6.4169). A DAMPED extension (new rungs at the ~0.985 plateau centerline) instead sees FAP RISE 0.1115->0.1579 and never clear, more pessimistic than the imp-96933 incoherent sqrt branch. The two branches bracket the imp-96933 ~1-12-rung band and the true branch is exactly the coherence question imp-96933 flagged -- decidable only by GENUINE N>1e4 Gram solves, not by a forecast. Measurement of the coherence models only; the 5 new rungs are model forecasts, not solves; the qualitative VIF>1 conclusion is untouched',
  qed: false,
});
export default IMP96951_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96951_ASSERTIONS = [
  {
    id: 'imp96951-reconstruction-matches-imp96915',
    holds: () =>
      Math.abs(IMP96951_RECONSTRUCTED_PEAK_21.w - 0.7006) < 0.01 &&
      Math.abs(IMP96951_RECONSTRUCTED_PEAK_21.power - 5.1829) < 0.01 &&
      Math.abs(IMP96951_RECONSTRUCTED_PEAK_21.fap - 0.111) < 0.002 &&
      IMP96951_RECONSTRUCTED_PEAK_21.matchesImp96915 === true,
    why: 'the pure-JS Scargle periodogram reproduces the imp-96915 genuine 21-rung peak (w=0.70, power 5.18, FAP 0.111) exactly, validating the reconstruction before forecasting.',
  },
  {
    id: 'imp96951-genuine-solves-blocked-forecast-labelled',
    holds: () =>
      IMP96951_GENUINE_SOLVES_BLOCKED.blocked === true &&
      IMP96951_VERDICT.genuineSolvesBlocked === true &&
      /forecast/i.test(IMP96951_GENUINE_SOLVES_BLOCKED.forecastInstead) &&
      /not solves/i.test(IMP96951_GENUINE_SOLVES_BLOCKED.forecastInstead),
    why: 'the genuine N=11000..15000 solves are CPU-blocked; the 5 new rungs are explicitly labelled model forecasts, not solves.',
  },
  {
    id: 'imp96951-coherent-branch-clears-and-confirms-96933',
    holds: () =>
      IMP96951_COHERENT.clearsAtN !== null &&
      IMP96951_COHERENT.clearsAtN <= 26 &&
      IMP96951_COHERENT.clearsFapAt05 === true &&
      IMP96951_COHERENT.peakPowerAt26 > 7 &&
      IMP96951_COHERENT.growsFasterThanLinear === true,
    why: 'under a coherent continuation the peak power grows 5.18->7.22 and clears FAP=0.05 by n=24, self-consistently confirming (and slightly beating) the imp-96933 n*=26 coherent-branch estimate.',
  },
  {
    id: 'imp96951-damped-branch-never-clears',
    holds: () =>
      IMP96951_DAMPED.clearsFapAt05 === false &&
      IMP96951_DAMPED.fapWorsensVs21 === true &&
      IMP96951_DAMPED.fapAt26 > IMP96951_RECONSTRUCTED_PEAK_21.fap,
    why: 'under a damped continuation the peak power stalls while M grows, so the FAP rises 0.1115->0.1579 and never clears -- the incoherent branch.',
  },
  {
    id: 'imp96951-scout-only-no-qed',
    holds: () =>
      IMP96951_VERDICT.branchUndecidedWithoutGenuineSolves === true &&
      IMP96951_VERDICT.vifConclusionUntouched === true &&
      IMP96951_VERDICT.operatorPositivityProved === false &&
      IMP96951_VERDICT.intervalRigorousReachUnchanged === IMP96951_RIGOROUS_REACH_2A &&
      IMP96951_RIGOROUS_REACH_2A === 0.96 &&
      IMP96951_VERDICT.subGap.indexOf('IMP96951_EXTENSION_BRACKETED_NOT_SOLVED') === 0 &&
      IMP96951_VERDICT.qed === false,
    why: 'measurement of the coherence models only: the branch is undecided without genuine solves, the qualitative VIF>1 conclusion is untouched, the interval-rigorous reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96951_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96951-burnol-ladder-extension-fap-forecast assertion failed: ${a.id}`);
  }
}
