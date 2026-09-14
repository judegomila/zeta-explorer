/**
 * viz-freeze-flow-phasors.js — the 25 REAL defect packets D_j (eq. 13 telescope)
 * at the window-1 pilot sup witness, baked as literals for /viz-freeze-flow.
 *
 * PROVENANCE (2026-09-14, this machine): produced by the project's own Gate-2
 * Lane-A native evaluator (native/gate2-lane-a/main.c, `point` mode — the
 * same eval_fast path pilotg3 used for the imp-95205 first-window pilot),
 * evaluated at the recorded pilot sup witness of
 * native/gate2-lane-a/pilotg3-300001-result.json:
 *
 *   ./gate2 point 0.524470030380 0        (chart M = 690988, side 0)
 *   x = 4π(N² − t0/16 + w(2N+1)) = 6.00000391660880176e12 (dd, lo −4.861e−4)
 *
 * Every number below is copied verbatim from that evaluation:
 *   - D[j] = the 25 complex defect packets of the eq-(13) telescope
 *     Σ_j D_j = E97 (descending primes: j = 1 ↔ p = 97, …, j = 25 ↔ p = 2);
 *   - pilot = Σ_j |D_j| (modulus-FIRST aggregation — the wrong order);
 *   - E97   = Σ_j D_j, |E97| (recombine-first, modulus-LAST — the eq-42
 *     normal-form order);
 *   - telescope identity verified at the evaluation to 2.55e-14; the fast
 *     path cross-checked against the independent eval_E97 path to 0 / 5.6e-17.
 *
 * The page renders the modulus-barrier ordering rule (paper eq. 7,
 * |Σ z_j| ≤ Σ |z_j|) with THESE packets, so the two displayed bars and their
 * ratio are true computed numbers, not illustrations. At this point the
 * wrong-order bar equals the sampled window sup (0.24375414 — the witness was
 * found by maximizing exactly that quantity); the normal-form bar is |E97| =
 * 0.18149721 there. Both are below Rex = 0.2796881955526244. Sampled dd
 * measurement (grade: measured); proves no bound, no RH claim, NO QED.
 */

// witness coordinates (verbatim from pilotg3-300001-result.json + point mode)
export const FREEZE_FLOW_WITNESS = Object.freeze({
  source: 'native/gate2-lane-a pilotg3 (imp-95205) supPilot witness',
  N: 690988,
  side: 0,
  chartM: 690988,
  w: 0.524470030380,
  xHi: 6.00000391660880176e12,
  xLo: -4.86139054735625878e-4,
  sigmaB: 1.42165799300016271,
  sigmaA: 1.24075799300016287,
  gamma: 8.81477158526011301e-2,
  telescopeErr: 2.551993e-14,
  crossCheckDAbsE97: 0.0,
  crossCheckDPilot: 5.551115e-17,
  rexExact: 0.2796881955526244,
  supPilotRecorded: 0.2437541384450471, // the pilot JSON's zoomed sup literal
});

// the 25 complex defect packets [re, im], j = 1..25 (j = 1 ↔ p = 97 … j = 25 ↔ p = 2)
export const DEFECT_PACKETS = Object.freeze([
  Object.freeze([3.10435109983544372e-4, -4.72441330248262641e-4]), // p = 97
  Object.freeze([-7.85288227407461277e-5, -8.85193126166321687e-4]), // p = 89
  Object.freeze([-6.18765728621471496e-4, -1.87069913321685907e-4]), // p = 83
  Object.freeze([2.99081121916596642e-4, 9.68798642787937125e-4]), // p = 79
  Object.freeze([-6.98605745410477304e-4, -5.37646993811908441e-4]), // p = 73
  Object.freeze([-4.03811008442862688e-4, -9.9487853873287996e-4]), // p = 71
  Object.freeze([-5.38425955701716695e-4, 7.75475513327235182e-4]), // p = 67
  Object.freeze([-4.88197640902682869e-4, -1.12923568573681968e-3]), // p = 61
  Object.freeze([5.89355082722170108e-4, -1.03811350082222377e-3]), // p = 59
  Object.freeze([-6.61768785791839228e-4, 1.0561093823598152e-3]), // p = 53
  Object.freeze([-1.03913071810868393e-3, 7.85720529828592084e-4]), // p = 47
  Object.freeze([-1.32234150113462565e-3, 5.42136966580043138e-4]), // p = 43
  Object.freeze([-1.11317216853307394e-3, -1.45288978936596621e-3]), // p = 41
  Object.freeze([-1.33235601441105003e-4, 1.97802847842161933e-3]), // p = 37
  Object.freeze([7.05061676114130493e-4, -2.28290735680524099e-3]), // p = 31
  Object.freeze([-5.42340493937086532e-4, -2.54024343872676344e-3]), // p = 29
  Object.freeze([-3.01862738645539185e-3, 2.45099756386281821e-4]), // p = 23
  Object.freeze([-3.69224397009670999e-3, 1.50054932461564307e-3]), // p = 19
  Object.freeze([-1.62558349588368231e-3, 3.90701791379149607e-3]), // p = 17
  Object.freeze([3.2650617409227512e-3, 6.52330457602816067e-3]), // p = 13
  Object.freeze([1.3016628185326918e-3, 5.99915652944272085e-3]), // p = 11
  Object.freeze([1.12157415969759353e-2, 1.23545160640272118e-2]), // p = 7
  Object.freeze([1.96818857923227071e-2, 1.27523290029750228e-2]), // p = 5
  Object.freeze([5.60030880150761134e-2, 2.06012459562207109e-2]), // p = 3
  Object.freeze([9.75300352048947272e-2, -1.00755779342939274e-2]), // p = 2
]);

// descending-prime labels for j = 1..25 (the eq-(13) telescope order)
export const PACKET_PRIMES = Object.freeze([
  97, 89, 83, 79, 73, 71, 67, 61, 59, 53, 47, 43, 41, 37, 31, 29, 23, 19, 17, 13, 11, 7, 5, 3, 2,
]);

// the two aggregations, verbatim from the evaluator
export const MODULUS_FIRST = 0.243754142526558443; // Σ|D_j| (wrong order)
export const E97_COMPLEX = Object.freeze({
  re: 0.174926629136234468,
  im: 4.83932910287542956e-2,
});
export const MODULUS_LAST = 0.181497207134323213; // |Σ D_j| (normal-form order)

// the computed ordering-rule ratio (displayed on the page)
export const ORDER_RATIO = MODULUS_FIRST / MODULUS_LAST; // 1.34302...

// ── self-checks (import-light; throw on violation) ───────────────────────────
export const VIZ_FREEZE_FLOW_ASSERTIONS = [
  {
    id: 'vizff-telescope-identity',
    description: 'Σ D_j reproduces the evaluator E97 (re, im) to the dd noise floor',
    holds: () => {
      let re = 0;
      let im = 0;
      for (const [a, b] of DEFECT_PACKETS) {
        re += a;
        im += b;
      }
      return (
        Math.abs(re - E97_COMPLEX.re) < 1e-13 &&
        Math.abs(im - E97_COMPLEX.im) < 1e-13 &&
        Math.abs(Math.hypot(re, im) - MODULUS_LAST) < 1e-13
      );
    },
  },
  {
    id: 'vizff-pilot-identity',
    description: 'Σ |D_j| reproduces the evaluator pilot literal',
    holds: () => {
      let s = 0;
      for (const [a, b] of DEFECT_PACKETS) s += Math.hypot(a, b);
      return Math.abs(s - MODULUS_FIRST) < 1e-14;
    },
  },
  {
    id: 'vizff-triangle-inequality-strict',
    description: 'the ordering rule with real data: |ΣD| < Σ|D| < Rex, ratio in (1.34, 1.35)',
    holds: () =>
      MODULUS_LAST < MODULUS_FIRST &&
      MODULUS_FIRST < FREEZE_FLOW_WITNESS.rexExact &&
      ORDER_RATIO > 1.34 &&
      ORDER_RATIO < 1.35,
  },
  {
    id: 'vizff-witness-matches-pilot-sup',
    description: 'the re-evaluated Σ|D_j| matches the recorded zoomed sup to the witness rounding (< 5e-9)',
    holds: () => Math.abs(MODULUS_FIRST - FREEZE_FLOW_WITNESS.supPilotRecorded) < 5e-9,
  },
  {
    id: 'vizff-25-packets',
    description: '25 packets, 25 primes, all finite',
    holds: () =>
      DEFECT_PACKETS.length === 25 &&
      PACKET_PRIMES.length === 25 &&
      DEFECT_PACKETS.every(([a, b]) => Number.isFinite(a) && Number.isFinite(b)),
  },
];

for (const a of VIZ_FREEZE_FLOW_ASSERTIONS) {
  if (!a.holds()) throw new Error(`viz-freeze-flow-phasors assertion failed: ${a.id}`);
}
