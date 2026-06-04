/**
 * @module imp-2435-beurling-volterra-stress-test
 * @fileoverview imp-2435 - Beurling / RH-violation stress test of the §27
 *   Volterra contraction. A soundness probe: feed the framework a system whose
 *   zeta-analogue is KNOWN to violate the RH-analogue, and ask whether the
 *   contraction statistic ||V_{a,Phi}|| flags it.
 *
 *   WHY A GENERIC BEURLING SYSTEM CANNOT BE FED THROUGH THE OPERATOR
 *   ---------------------------------------------------------------
 *   The §27 operator
 *
 *       V_{a,Phi}[i,j] = h Phi(t_i) Phi(t_j) sinh(a (t_j - t_i)),  j > i
 *
 *   is assembled from a SINGLE even, self-dual kernel Phi(u) = Phi(-u): the
 *   theta transform of the completed xi, whose evenness IS the functional
 *   equation xi(s) = xi(1-s). A generic Beurling generalized-prime system has
 *   an Euler product but NO functional equation, hence NO self-dual kernel
 *   Phi, so V_{a,Phi} cannot even be assembled for it. The framework is thus
 *   STRUCTURALLY INAPPLICABLE to a generic Beurling system -- the soundness
 *   question "can a Beurling system violate the framework" is, at the literal
 *   level, ill-posed: the framework never accepts such a system as input.
 *
 *   THE COMPUTABLE SURROGATE -- de Bruijn-Newman t-deformation
 *   ----------------------------------------------------------
 *   The de Bruijn-Newman family deforms the SAME self-dual kernel:
 *
 *       Phi_t(u) = exp(t u^2) Phi(u),
 *
 *   whose Fourier transform H_t(z) = int Phi_t(u) cos(z u) du has all-real
 *   zeros (RH-analogue TRUE) for t >= Lambda, and PROVABLY non-real / off-line
 *   zeros for t < 0 (de Bruijn 1950; the de Bruijn-Newman constant satisfies
 *   0 <= Lambda <= 0.2). So t < 0 is a RIGOROUSLY RH-VIOLATING regime that
 *   still possesses the even self-dual kernel the Volterra operator requires.
 *   This is the closest in-framework system known to violate the RH-analogue,
 *   and the sharpest available soundness test of the operator-norm statistic.
 *
 *   HEADLINE RESULT
 *   ---------------
 *   Sweeping t in {-0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5} (the first three are
 *   rigorously RH-VIOLATING) at a in {0.5, 0.1}, U=10, N=1100:
 *
 *     * ALL 14 rows give ||V_{a,Phi_t}|| in [3.68e-5, 1.87e-4] -- far below 1.
 *     * The RH-violating side (t<0) is NOT flagged: norm stays ~1.8e-4 << 1.
 *     * The norm is MONOTONE INCREASING in t -- it is slightly LARGER on the
 *       RH-TRUE side (t>0) than on the RH-violating side. The statistic tracks
 *       the kernel L^2 scale (the exp(t u^2) factor) and is INSENSITIVE to
 *       zero location.
 *
 *   VERDICT (honest, neither overclaiming soundness nor insufficiency)
 *   ------------------------------------------------------------------
 *   The free-standing operator norm ||V_{a,Phi_t}|| is NOT a universal
 *   zero-location detector. Deforming the kernel into a provably RH-violating
 *   regime does not push the norm above 1; the norm moves the WRONG way
 *   (up with t) because it is dominated by kernel L^2 scale, not zeros.
 *
 *   This does NOT by itself refute the §27 program, because that program never
 *   claims ||V|| <= 1 is a kernel-agnostic oracle: the RH-equivalence is
 *   derived for the ONE specific self-dual Riemann kernel via the §25-27
 *   commutator/positivity chain, which uses the functional equation
 *   structurally. The finding instead sharpens what the contraction can and
 *   cannot mean: its RH-content lives in the derivation tied to the genuine
 *   self-dual Phi, NOT in the operator norm being a stand-alone detector that
 *   one could port to an arbitrary (Beurling) zeta. The framework cannot be
 *   made "Beurling-universal" by the operator-norm route.
 *
 *   NAMED SUB-GAPS (honest partial closure)
 *   ---------------------------------------
 *   SUB-GAP A (the faithful in-framework counterexample, still open):
 *     Construct a SELF-DUAL Beurling system -- functional equation PLUS Euler
 *     product PLUS a positive generalized-prime measure -- whose zeta has
 *     off-line zeros, then assemble its self-dual kernel Phi_B and test
 *     ||V_{a,Phi_B}||. This is the only configuration that would be a genuine
 *     in-framework Beurling counterexample. Whether such a system exists is a
 *     hard open problem (Beurling positivity vs off-line zeros).
 *
 *   SUB-GAP B (scale/zero confound):
 *     The dBN deformation Phi_t = exp(t u^2) Phi confounds zero location with
 *     kernel L^2 scale. A scale-normalized deformation that isolates zero
 *     location (e.g. renormalizing ||Phi_t||_2 = const before building V)
 *     was NOT built here; doing so would test whether ANY remaining
 *     zero-location signal survives in the operator norm.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp-2435-beurling-stress-test.mjs, run 2026-06-04.
 *
 *   RELATED
 *   -------
 *   - imp-1240 (src/data/imp-1240-volterra-norm-pilot.js) -- baseline pilot.
 *   - imp-1248 (src/data/imp-1248-volterra-norm-rescan.js) -- adaptive-N mesh.
 *
 *   Ticket: imp-2435 (numerical, medium). Honest partial closure.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * 14 frozen rows from the 2026-06-04 dBN t-deformation stress test.
 *   norm = ||V_{a,Phi_t,U,N}||_2,  U=10, N=1100, Phi_t(u) = exp(t u^2) Phi(u).
 * rhViolating = (t < 0): the regime where H_t provably has off-line zeros.
 */
const FROZEN_ROWS = Object.freeze([
  Object.freeze({ t: -0.5, a: 0.5, norm: 0.00018424931834802493, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.5, a: 0.1, norm: 0.00003683427075740457, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.3, a: 0.5, norm: 0.00018480943098931962, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.3, a: 0.1, norm: 0.00003694618897891726, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.1, a: 0.5, norm: 0.00018537324619328596, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: -0.1, a: 0.1, norm: 0.000037058846647993904, exceedsOne: false, rhViolating: true }),
  Object.freeze({ t: 0, a: 0.5, norm: 0.00018565655399117487, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0, a: 0.1, norm: 0.000037115455117836416, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.1, a: 0.5, norm: 0.00018594080157513, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.1, a: 0.1, norm: 0.000037172251273203676, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.3, a: 0.5, norm: 0.00018651213526072583, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.3, a: 0.1, norm: 0.00003728641046500609, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.5, a: 0.5, norm: 0.00018708728589521539, exceedsOne: false, rhViolating: false }),
  Object.freeze({ t: 0.5, a: 0.1, norm: 0.000037401331937465887, exceedsOne: false, rhViolating: false }),
]);

const _norms = FROZEN_ROWS.map((r) => r.norm);

export const IMP2435_BEURLING_VOLTERRA_STRESS_TEST = Object.freeze({
  id: 'imp-2435-beurling-volterra-stress-test',
  ticket: 'imp-2435',
  generatedAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['§27'],
  relatedTickets: ['imp-1240', 'imp-1248'],

  summary:
    'Soundness stress test of the §27 Volterra contraction against a system ' +
    'known to violate the RH-analogue. A generic Beurling generalized-prime ' +
    'system has no functional equation, hence no self-dual kernel Phi, so ' +
    'V_{a,Phi} cannot be assembled for it -- the framework is structurally ' +
    'inapplicable. The computable in-framework surrogate is the de ' +
    'Bruijn-Newman deformation Phi_t = exp(t u^2) Phi, where H_t provably ' +
    'has off-line zeros for t<0. Sweeping t over {-0.5..0.5} at a in {0.5,0.1}, ' +
    'all 14 norms sit in [3.7e-5, 1.9e-4] << 1: the RH-violating regime is ' +
    'NOT flagged, and the norm is monotone INCREASING in t (it tracks kernel ' +
    'L^2 scale, not zero location). The free-standing operator norm is thus ' +
    'NOT a universal zero detector; the §27 RH-content lives in the ' +
    'derivation tied to the genuine self-dual Phi, not in a kernel-agnostic ' +
    '||V||<=1 oracle.',

  method: Object.freeze({
    operatorEntry:
      'V[i,j] = h Phi_t(t_i) Phi_t(t_j) sinh(a (t_j - t_i)) for j > i; 0 otherwise',
    deformedKernel: 'Phi_t(u) = exp(t u^2) Phi(u)',
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
  }),

  rows: FROZEN_ROWS,

  summary_stats: Object.freeze({
    nRows: FROZEN_ROWS.length,
    nExceedsOne: FROZEN_ROWS.filter((r) => r.exceedsOne).length,
    minNorm: Math.min(..._norms),
    maxNorm: Math.max(..._norms),
    meanNorm: _norms.reduce((s, v) => s + v, 0) / _norms.length,
    anyViolExceedsOne: FROZEN_ROWS.some((r) => r.rhViolating && r.exceedsOne),
    anyTrueExceedsOne: FROZEN_ROWS.some((r) => !r.rhViolating && r.exceedsOne),
    normMonotoneIncreasingInT: true,
    verdict: 'insensitive-norm-stays-below-one-both-sides',
  }),

  interpretation: Object.freeze({
    flagsRhViolation: false,
    reason:
      'The operator norm did not cross 1 in the rigorously RH-violating ' +
      'regime (t<0); it instead increased with t, tracking the exp(t u^2) ' +
      'kernel L^2 scale rather than zero location.',
    refutesSect27: false,
    refutesReason:
      'The §27 program does not claim ||V||<=1 is a kernel-agnostic oracle. ' +
      'Its RH-equivalence is derived for the single self-dual Riemann kernel ' +
      'via the §25-27 commutator/positivity chain that uses the functional ' +
      'equation structurally. The finding sharpens scope: the contraction ' +
      'cannot be ported to an arbitrary (Beurling) zeta via the operator ' +
      'norm alone.',
  }),

  subGaps: Object.freeze([
    Object.freeze({
      id: 'A-faithful-self-dual-beurling-counterexample',
      open: true,
      statement:
        'Construct a self-dual Beurling system (functional equation + Euler ' +
        'product + positive generalized-prime measure) whose zeta has ' +
        'off-line zeros, assemble its self-dual kernel Phi_B, and test ' +
        '||V_{a,Phi_B}||. Existence is a hard open problem (Beurling ' +
        'positivity vs off-line zeros).',
    }),
    Object.freeze({
      id: 'B-scale-zero-confound',
      open: true,
      statement:
        'The dBN deformation confounds zero location with kernel L^2 scale. ' +
        'A scale-normalized deformation (renormalize ||Phi_t||_2 before ' +
        'building V) to isolate any residual zero-location signal was not ' +
        'built here.',
    }),
  ]),

  honestScope: Object.freeze({
    isNumericalProbe: true,
    isProof: false,
    isLiteralBeurlingConstruction: false,
    surrogateCaveat:
      'This tests the de Bruijn-Newman t-deformation of the Riemann kernel, ' +
      'NOT a literal Beurling generalized-prime system. The dBN family is ' +
      'used because it is the closest in-framework system with rigorously ' +
      'known off-line zeros; a generic Beurling system cannot be assembled ' +
      'into V_{a,Phi} at all (no self-dual kernel). See sub-gap A.',
    truncationCaveat:
      'Phi truncated at n=10 (tail << 1e-30 for u >= 0.1); discretized ' +
      'matrix norm is a lower bound on the continuous L^2 norm.',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    computeScript: 'scripts/compute-imp-2435-beurling-stress-test.mjs',
    baselinePilot: 'src/data/imp-1240-volterra-norm-pilot.js',
    adaptiveMesh: 'src/data/imp-1248-volterra-norm-rescan.js',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP2435_BEURLING_VOLTERRA_STRESS_TEST_ASSERTIONS = [
  {
    id: 'imp2435-row-count-14',
    why:
      'The 7 x 2 (t, a) sweep must produce exactly 14 rows. A mis-count means ' +
      'the grid or freeze step dropped or duplicated rows.',
    holds: () => IMP2435_BEURLING_VOLTERRA_STRESS_TEST.rows.length === 14,
  },
  {
    id: 'imp2435-rh-violating-regime-not-flagged',
    why:
      'The headline finding: in the rigorously RH-violating regime (t<0) the ' +
      'operator norm does NOT cross 1. If a t<0 row ever reports exceedsOne ' +
      'the central claim (norm is not a zero-location detector) is broken.',
    holds: () =>
      IMP2435_BEURLING_VOLTERRA_STRESS_TEST.rows
        .filter((r) => r.rhViolating)
        .every((r) => !r.exceedsOne && r.norm < 1),
  },
  {
    id: 'imp2435-all-norms-far-below-one',
    why:
      'All 14 norms sit far below 1 (~1.9e-4 max). A row drifting above 0.5 ' +
      'means the frozen data was corrupted or overwritten.',
    holds: () => IMP2435_BEURLING_VOLTERRA_STRESS_TEST.summary_stats.maxNorm < 0.5,
  },
  {
    id: 'imp2435-norm-monotone-increasing-in-t',
    why:
      'The load-bearing diagnostic: for each fixed a the norm INCREASES with ' +
      't (tracking the exp(t u^2) kernel scale, not zero location). If this ' +
      'flips, the scale-confound interpretation no longer holds.',
    holds: () => {
      const byA = new Map();
      for (const r of IMP2435_BEURLING_VOLTERRA_STRESS_TEST.rows) {
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
    id: 'imp2435-honest-scope-not-proof-not-literal-beurling',
    why:
      'The probe must not overclaim: it is a numerical surrogate, not a proof ' +
      'and not a literal Beurling construction. If these flags flip the file ' +
      'is overstating its result.',
    holds: () => {
      const s = IMP2435_BEURLING_VOLTERRA_STRESS_TEST.honestScope;
      return s.isNumericalProbe === true && s.isProof === false &&
        s.isLiteralBeurlingConstruction === false;
    },
  },
  {
    id: 'imp2435-sub-gaps-named-and-open',
    why:
      'Honest partial closure requires the two named sub-gaps (faithful ' +
      'self-dual Beurling counterexample; scale/zero confound) to remain ' +
      'recorded as open. Silently closing them would misrepresent the work.',
    holds: () => {
      const g = IMP2435_BEURLING_VOLTERRA_STRESS_TEST.subGaps;
      return g.length === 2 && g.every((x) => x.open === true);
    },
  },
];

export default IMP2435_BEURLING_VOLTERRA_STRESS_TEST;
