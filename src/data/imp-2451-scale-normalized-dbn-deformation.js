/**
 * @module imp-2451-scale-normalized-dbn-deformation
 * @fileoverview imp-2451 - Scale-normalized de Bruijn-Newman deformation of the
 *   §27 Volterra contraction. Closes sub-gap B of imp-2435 (the scale/zero
 *   confound): isolate any residual zero-location signal in ||V_{a,Phi_t}||
 *   once the exp(t u^2) kernel L^2 scale is divided out.
 *
 *   THE CONFOUND imp-2435 LEFT OPEN
 *   -------------------------------
 *   imp-2435 swept the dBN deformation Phi_t(u) = exp(t u^2) Phi(u) and found
 *   ||V_{a,Phi_t}|| MONOTONE INCREASING in t -- the norm tracked the kernel
 *   L^2 scale exp(t u^2), NOT zero location, and the rigorously RH-violating
 *   side (t<0, where H_t provably has off-line zeros) was not separated from
 *   t>=0. That sweep confounded two effects: the GLOBAL L^2 scale of Phi_t and
 *   the SHAPE change that carries the zero-location content.
 *
 *   THE ONE-LINE CHANGE THAT ISOLATES SHAPE
 *   ---------------------------------------
 *   The operator entry V[i,j] = h Phi(t_i) Phi(t_j) sinh(a(t_j-t_i)) is exactly
 *   QUADRATIC in Phi, so rescaling Phi -> c Phi scales the whole operator by
 *   c^2 and the norm by c^2. Renormalizing the discrete L^2 norm
 *   ||Phi_t||_2 = 1 BEFORE assembling V therefore divides the exp(t u^2) global
 *   scale out exactly, leaving only the kernel SHAPE (the zero-location signal)
 *   in the operator. We re-ran the imp-2435 sweep with that single change.
 *
 *   HEADLINE RESULT -- CONFIRMED NULL
 *   ---------------------------------
 *   Sweeping t in {-0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5} (first three rigorously
 *   RH-VIOLATING) at a in {0.5, 0.1}, U=10, N=1100, ||Phi_t||_2=1:
 *
 *     * All 14 normalized norms sit in [3.53e-3, 1.78e-2] -- far below 1.
 *     * Total relative spread of the norm across the ENTIRE t-sweep is only
 *       ~0.90% (per a). The dominant ~5x scale swing imp-2435 saw is gone;
 *       what remains is a residue smaller by two orders of magnitude.
 *     * The t<0 (RH-violating) mean vs the t>=0 mean differ by only ~0.47%
 *       (per a) -- below a 1% separation threshold: NO clean side separation.
 *     * Critically, the residual is STILL monotone INCREASING in t -- the same
 *       WRONG direction as imp-2435. The faint shape-residue, like the scale,
 *       favours larger t, not the RH-violating regime.
 *
 *   VERDICT (honest, no overclaim)
 *   ------------------------------
 *   confirmed-null-no-residual-zero-location-signal. Removing the L^2-scale
 *   confound does NOT reveal a hidden zero-location signal: the scale-normalized
 *   Volterra operator norm still fails to separate the provably RH-violating
 *   side, and what little residual movement survives points the wrong way. The
 *   imp-2435 finding is thus NOT a pure scale artifact masking a real signal --
 *   the operator norm genuinely does not see off-line zeros, scale-in or
 *   scale-out.
 *
 *   WHAT THIS DOES AND DOES NOT IMPLY
 *   ---------------------------------
 *   This does NOT refute the §27 program. As imp-2435 argued, that program
 *   never claims ||V||<=1 is a kernel-agnostic oracle; its RH-equivalence is
 *   derived for the ONE self-dual Riemann kernel via the §25-27
 *   commutator/positivity chain that uses the functional equation structurally.
 *   The null here sharpens scope further: even the cleanest scale-isolated form
 *   of the free-standing operator norm carries no portable off-line-zero
 *   detector. The RH-content lives in the derivation tied to the genuine
 *   self-dual Phi, full stop.
 *
 *   NAMED SUB-GAP (honest partial closure)
 *   --------------------------------------
 *   GAP-2451-SHAPE-DEFORMATION-IS-GAUSSIAN-ONLY:
 *     The shape change isolated here is the one induced by the SPECIFIC dBN
 *     Gaussian multiplier exp(t u^2). A more aggressive deformation that moves
 *     zeros off-line WITHOUT a near-pure-scale Gaussian factor (e.g. a
 *     compactly-supported multiplier, or a direct manipulation of the Hadamard
 *     zero set) could in principle imprint a larger shape-residue on the norm.
 *     This sweep tests only the dBN-Gaussian channel; a non-Gaussian
 *     zero-moving deformation was not built here.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp-2451-scale-normalized-dbn.mjs, run 2026-06-04.
 *
 *   RELATED
 *   -------
 *   - imp-2435 (src/data/imp-2435-beurling-volterra-stress-test.js) -- the
 *     un-normalized sweep this closes sub-gap B of.
 *   - imp-1240 (src/data/imp-1240-volterra-norm-pilot.js) -- baseline pilot.
 *   - imp-1248 (src/data/imp-1248-volterra-norm-rescan.js) -- adaptive-N mesh.
 *
 *   Ticket: imp-2451 (numerical, high). Confirmed null; honest partial closure.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * 14 frozen rows from the 2026-06-04 scale-normalized dBN sweep.
 *   norm = ||V_{a,Phi_t,U,N}||_2 with ||Phi_t||_2 renormalized to 1 before
 *   assembly, U=10, N=1100, Phi_t(u) = exp(t u^2) Phi(u) pre-normalization.
 * rhViolating = (t < 0): the regime where H_t provably has off-line zeros.
 */
const FROZEN_ROWS = Object.freeze([
  Object.freeze({ t: -0.5, a: 0.5, norm: 0.017665326879926425, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.5, a: 0.1, norm: 0.0035315703696889235, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.3, a: 0.5, norm: 0.0176969194219292, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.3, a: 0.1, norm: 0.003537880755366066, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.1, a: 0.5, norm: 0.017728685076267518, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.1, a: 0.1, norm: 0.003544225690620571, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: 0, a: 0.5, norm: 0.01774463330372893, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0, a: 0.1, norm: 0.003547411210693497, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.1, a: 0.5, norm: 0.01776062539140673, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.1, a: 0.1, norm: 0.003550605484250618, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.3, a: 0.5, norm: 0.017792741934558202, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.3, a: 0.1, norm: 0.0035570204487898683, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.5, a: 0.5, norm: 0.01782503629195951, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.5, a: 0.1, norm: 0.003563470900563231, exceedsOne: false, rhViolating: false }),
]);

const _norms = FROZEN_ROWS.map((r) => r.norm);

// Per-a side separation: |mean(t<0) - mean(t>=0)| / mean(t>=0), max over a.
function _sideSeparation() {
  const byA = new Map();
  for (const r of FROZEN_ROWS) {
    if (!byA.has(r.a)) byA.set(r.a, []);
    byA.get(r.a).push(r);
  }
  let maxSep = 0;
  for (const arr of byA.values()) {
    const viol = arr.filter((r) => r.rhViolating).map((r) => r.norm);
    const tru = arr.filter((r) => !r.rhViolating).map((r) => r.norm);
    const mv = viol.reduce((s, v) => s + v, 0) / viol.length;
    const mt = tru.reduce((s, v) => s + v, 0) / tru.length;
    maxSep = Math.max(maxSep, Math.abs(mv - mt) / Math.max(mt, 1e-300));
  }
  return maxSep;
}

// Per-a relative spread of the norm across the whole t-sweep, max over a.
function _relSpread() {
  const byA = new Map();
  for (const r of FROZEN_ROWS) {
    if (!byA.has(r.a)) byA.set(r.a, []);
    byA.get(r.a).push(r.norm);
  }
  let maxSpread = 0;
  for (const arr of byA.values()) {
    const lo = Math.min(...arr);
    const hi = Math.max(...arr);
    maxSpread = Math.max(maxSpread, (hi - lo) / Math.max(hi, 1e-300));
  }
  return maxSpread;
}

export const IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION = Object.freeze({
  id: 'imp-2451-scale-normalized-dbn-deformation',
  ticket: 'imp-2451',
  generatedAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['§27'],
  relatedTickets: ['imp-2435', 'imp-1240', 'imp-1248'],

  summary:
    'Closes sub-gap B of imp-2435 (scale/zero confound). The imp-2435 dBN ' +
    'sweep found ||V_{a,Phi_t}|| rising with t, tracking the exp(t u^2) ' +
    'kernel L^2 scale, not zero location. Because V is quadratic in Phi, ' +
    'renormalizing ||Phi_t||_2 = 1 before assembly divides that scale out ' +
    'exactly, leaving only kernel shape. Re-running the 14-row sweep ' +
    '(t in {-0.5..0.5}, a in {0.5,0.1}, U=10, N=1100) with that one change: ' +
    'the ~5x scale swing collapses to a ~0.9% residual spread, the t<0 vs ' +
    't>=0 means differ by only ~0.47% (below a 1% threshold), and the residue ' +
    'is STILL monotone increasing in t (the wrong direction for a detector). ' +
    'Verdict: confirmed null -- removing the scale confound reveals no hidden ' +
    'zero-location signal. The imp-2435 result is genuine, not a scale ' +
    'artifact; the free-standing operator norm does not see off-line zeros.',

  method: Object.freeze({
    operatorEntry:
      'V[i,j] = h Phi_t(t_i) Phi_t(t_j) sinh(a (t_j - t_i)) for j > i; 0 otherwise',
    deformedKernel: 'Phi_t(u) = exp(t u^2) Phi(u)',
    scaleNormalization:
      'Renormalize discrete ||Phi_t||_2 = sqrt(sum_i h Phi_t(t_i)^2) to 1 ' +
      'BEFORE assembling V. Since V is quadratic in Phi, this divides out the ' +
      'exp(t u^2) global L^2 scale exactly and leaves only kernel shape.',
    baseKernel:
      'de Bruijn-Newman: sum_{n=1..N_PHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: 10,
    U: 10,
    N: 1100,
    discretizationRule: 'midpoint, mesh h = U/N = 1/110',
    normEstimator: 'power iteration on V^T V (Rayleigh quotient)',
    powerIterTol: 1e-10,
    seededRNG: 'LCG seed 0x12345678 for reproducibility',
    rhViolatingRegime:
      't < 0: H_t = int exp(t u^2) Phi(u) cos(z u) du provably has non-real ' +
      '(off-line) zeros (de Bruijn 1950; de Bruijn-Newman constant in [0, 0.2]).',
  }),

  sweep: Object.freeze({
    t_grid: Object.freeze([-0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5]),
    a_grid: Object.freeze([0.5, 0.1]),
    nRows: 14,
    targetL2: 1,
  }),

  rows: FROZEN_ROWS,

  summary_stats: Object.freeze({
    nRows: FROZEN_ROWS.length,
    nExceedsOne: FROZEN_ROWS.filter((r) => r.exceedsOne).length,
    minNorm: Math.min(..._norms),
    maxNorm: Math.max(..._norms),
    meanNorm: _norms.reduce((s, v) => s + v, 0) / _norms.length,
    maxRelSpreadInT: _relSpread(),
    maxSideSeparation: _sideSeparation(),
    normMonotoneIncreasingInT: true,
    verdict: 'confirmed-null-no-residual-zero-location-signal',
  }),

  interpretation: Object.freeze({
    flagsRhViolation: false,
    residualSignalSurvives: false,
    reason:
      'After dividing out the exp(t u^2) L^2 scale, the operator norm still ' +
      'does not cross 1, the t<0 side is not separated from t>=0 (~0.47%), ' +
      'and the tiny residual movement is still increasing in t -- the same ' +
      'wrong direction as the un-normalized imp-2435 sweep.',
    imp2435WasScaleArtifact: false,
    imp2435Reason:
      'The imp-2435 monotone-in-t finding is NOT a pure scale artifact that ' +
      'was masking a real zero signal: with the scale removed there is still ' +
      'no separation. The operator norm genuinely does not detect off-line ' +
      'zeros, scale-in or scale-out.',
    refutesSect27: false,
    refutesReason:
      'The §27 program does not claim ||V||<=1 is a kernel-agnostic oracle. ' +
      'Its RH-equivalence is derived for the single self-dual Riemann kernel ' +
      'via the §25-27 commutator/positivity chain using the functional ' +
      'equation structurally. This null only sharpens scope.',
  }),

  subGaps: Object.freeze([
    Object.freeze({
      id: 'GAP-2451-SHAPE-DEFORMATION-IS-GAUSSIAN-ONLY',
      open: true,
      statement:
        'The shape change isolated here is the one induced by the specific ' +
        'dBN Gaussian multiplier exp(t u^2). A non-Gaussian zero-moving ' +
        'deformation (compactly-supported multiplier, or direct manipulation ' +
        'of the Hadamard zero set) could imprint a larger shape-residue on ' +
        'the norm; only the dBN-Gaussian channel was tested here.',
    }),
  ]),

  honestScope: Object.freeze({
    isNumericalProbe: true,
    isProof: false,
    isLiteralBeurlingConstruction: false,
    surrogateCaveat:
      'This tests the scale-normalized de Bruijn-Newman t-deformation of the ' +
      'Riemann kernel, NOT a literal Beurling generalized-prime system. The ' +
      'dBN family is used because it is the closest in-framework system with ' +
      'rigorously known off-line zeros.',
    truncationCaveat:
      'Phi truncated at n=10 (tail << 1e-30 for u >= 0.1); discretized ' +
      'matrix norm is a lower bound on the continuous L^2 norm. The scale ' +
      'normalization is applied to the same discrete mesh, so the ratio is ' +
      'robust to the truncation.',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    computeScript: 'scripts/compute-imp-2451-scale-normalized-dbn.mjs',
    unnormalizedSweep: 'src/data/imp-2435-beurling-volterra-stress-test.js',
    baselinePilot: 'src/data/imp-1240-volterra-norm-pilot.js',
    adaptiveMesh: 'src/data/imp-1248-volterra-norm-rescan.js',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION_ASSERTIONS = [
  {
    id: 'imp2451-row-count-14',
    why:
      'The 7 x 2 (t, a) sweep must produce exactly 14 rows. A mis-count means ' +
      'the grid or freeze step dropped or duplicated rows.',
    holds: () => IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.rows.length === 14,
  },
  {
    id: 'imp2451-no-row-exceeds-one',
    why:
      'After scale normalization every norm must still stay below 1. A row ' +
      'crossing 1 would mean the normalized operator suddenly flags a regime, ' +
      'contradicting the confirmed-null headline.',
    holds: () =>
      IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.rows.every(
        (r) => !r.exceedsOne && r.norm < 1,
      ),
  },
  {
    id: 'imp2451-side-separation-below-one-percent',
    why:
      'The load-bearing null: once the L^2 scale is divided out the t<0 ' +
      '(RH-violating) mean and the t>=0 mean differ by under 1% per a. If ' +
      'this separation grows, a residual zero-location signal would have ' +
      'appeared and the confirmed-null verdict would be wrong.',
    holds: () =>
      IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.summary_stats.maxSideSeparation < 0.01,
  },
  {
    id: 'imp2451-scale-confound-collapsed',
    why:
      'The whole point of the normalization: the ~5x scale swing of imp-2435 ' +
      'must collapse. The residual relative spread across the t-sweep must be ' +
      'under 2% (it is ~0.9%). If it reverts to order-unity the scale was not ' +
      'actually divided out.',
    holds: () =>
      IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.summary_stats.maxRelSpreadInT < 0.02,
  },
  {
    id: 'imp2451-residual-still-monotone-increasing-in-t',
    why:
      'The diagnostic that kills the detector hypothesis: even the residual ' +
      'moves the WRONG way (up with t), so it cannot be flagging the t<0 ' +
      'RH-violating side. If this flips, the interpretation changes.',
    holds: () => {
      const byA = new Map();
      for (const r of IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.rows) {
        if (!byA.has(r.a)) byA.set(r.a, []);
        byA.get(r.a).push({ t: r.t, norm: r.norm });
      }
      for (const arr of byA.values()) {
        arr.sort((x, y) => x.t - y.t);
        for (let i = 1; i < arr.length; i++) {
          if (arr[i].norm < arr[i - 1].norm) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp2451-honest-scope-not-proof',
    why:
      'The probe must not overclaim: it is a numerical surrogate, not a proof ' +
      'and not a literal Beurling construction. If these flags flip the file ' +
      'is overstating its result.',
    holds: () => {
      const s = IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.honestScope;
      return s.isNumericalProbe === true && s.isProof === false &&
        s.isLiteralBeurlingConstruction === false;
    },
  },
  {
    id: 'imp2451-sub-gap-named-and-open',
    why:
      'Honest partial closure requires the named non-Gaussian-deformation ' +
      'sub-gap to remain recorded as open. Silently closing it would ' +
      'misrepresent the scope of the null.',
    holds: () => {
      const g = IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION.subGaps;
      return g.length === 1 && g.every((x) => x.open === true);
    },
  },
];

export default IMP2451_SCALE_NORMALIZED_DBN_DEFORMATION;
