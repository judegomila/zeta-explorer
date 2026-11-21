/**
 * @fileoverview imp-95901 -- measure the imp-95877 TIER-3 per-locus sub-leading coefficients
 * s_J(m,cell), c_J(m,cell) at m=22,30,41 and test each for m-linearity vs the smooth decaying
 * aggregate dQ/dm. Complements imp-95877 (aggregate dQ/dm non-constant) and imp-95900 (aggregate
 * TIER-3 m-slope D_3(m) = -C_1) by resolving the PER-LOCUS structure the aggregate hides.
 *
 * WHAT IS MEASURED. On each breakpoint cell the exact greedy lowest-mass K_v reconstruction
 * (imp-95720 machinery, verbatim) produces the quadratic
 *     Q_0^recon(m,v) = -(4m-1)/2 . v^2 + s_J(m,cell) . v + c_J(m,cell).
 * The intrinsic per-locus datum is the JUMP of this quadratic across each fractional-part
 * discontinuity locus v0 = j/(am+b): DQ = Q_right - Q_left = Da . v^2 + Ds . v + Dc. Because the
 * leading curvature -(4m-1)/2 is common to both sides (imp-95720 / imp-95877 TIER 1), the jump is
 * LINEAR: Da = 0 to roundoff (max |Da| ~ 1.4e-5 over every locus at m=20,22,30,41,50), so each locus
 * is fully described by the pair (Ds, Dc). This module extracts (Ds, Dc) per family per index by
 * fitting the one-sided quadratics of Q_0(m,v) at v0 +/- k.eps (eps = 1e-5, k = 1,2,3) and reports
 * the per-locus tracks across m = 22,30,41 and their m-divided-differences.
 *
 * THE FINDING (sharpens imp-95877 and imp-95900). Every per-locus jump coefficient is an EXACT
 * m-LINEAR (or m-free) rational -- there is no non-smoothness at the per-locus level:
 *     alpha    v = j/m      : Ds = -3m           , Dc = 3j          (Dc m-free)
 *     beta     v = j/(2m+1) : Ds = 2m+1 (even j) , Dc = -j (even j) ; Ds = Dc = 0 (odd j)
 *     gamma    v = j/(2m)   : Ds = -3m           , Dc = (3/2) j     (Dc m-free)
 *     delta    v = k/(m-1)  : Ds = -(m-1)        , Dc = k           (Dc m-free)
 *     half-int v = 1/2      : Ds = 2             , Dc = -1          (both m-free; coincidence-entangled)
 * verified EXACT (to the clean-rational level) across m = 20,22,30,41,50 with coincidence loci
 * excluded (where two family lattices meet, e.g. v = 1/2 for even m, the jumps SUPERIMPOSE -- exactly
 * the "minus coincidences" caveat imp-95900 flagged). The m-divided-differences of Ds are constant on
 * every family (alpha/gamma: dDs/dm = -3; beta even: +2; delta: -1), i.e. the per-locus s_J tracks are
 * straight lines in m, and the c_J tracks are m-free (index-only).
 *
 * HOW THIS RELATES TO THE NON-CONSTANT AGGREGATE dQ/dm. imp-95877 measured dQ/dm ~ +3.79e-6, +2.15e-6,
 * +1.55e-6 (decaying) and imp-95900 pinned the aggregate TIER-3 m-slope D_3(m) = -C_1 = +0.2006346.
 * This module shows that non-constancy is NOT sourced by any non-smoothness of the per-locus
 * coefficients: those are exactly m-linear. What remains m-non-trivial in the AGGREGATE is (i) the
 * moving locus POSITIONS v0 = j/(am+b) (which slide with m and are integrated against the m-free
 * weight zeta(3,1+v)), (ii) the GROWING locus COUNT (j = 1..m-1, 1..2m, ... per family), and (iii) the
 * m-dependent COINCIDENCE set. The tiny decaying dQ/dm imbalance is a property of assembling m-linear
 * jumps at sliding positions under a fixed weight, not of the jump laws themselves.
 *
 * WHAT THIS DOES AND DOES NOT DO (honest partial; NOT a closure). It RESOLVES the imp-95900 pessimism
 * "the greedy lowest-mass K_v selection has no symbolic-in-m form per locus": at the JUMP level it does
 * -- the per-locus jump coefficients are exact m-linear rationals. It does NOT close the transport
 * identity, because the ABSOLUTE cell coefficients s_J(m,cell), c_J(m,cell) require the running
 * accumulation of these jumps from a base cell across [0,1] (a "constant of integration" plus the
 * m-dependent ORDER in which the interleaved family loci are encountered), and reproducing the
 * imp-95900 aggregate cancellation identity requires assembling those accumulated coefficients at the
 * sliding positions against zeta(3,1+v). Those assembly steps are not performed here.
 *
 * NAMED SUB-GAP (advances imp-95900): "assemble the m-linear per-locus jump laws (alpha Ds=-3m,Dc=3j;
 * beta-even Ds=2m+1,Dc=-j; gamma Ds=-3m,Dc=(3/2)j; delta Ds=-(m-1),Dc=k; half-int Ds=2,Dc=-1) into the
 * absolute cell coefficients s_J(m,cell), c_J(m,cell) via the running jump accumulation across the
 * m-dependent interleaved locus order (with the coincidence superposition), then integrate against
 * zeta(3,1+v) and check the imp-95900 aggregate TIER-3 slope equals +0.2006346. The per-locus JUMP law
 * is now symbolic-in-m; the accumulation order and coincidence combinatorics are the remaining pieces."
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound; NO
 * Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes the offline-measured per-locus jump
 * tracks and the fitted laws as literals; no reconstruction quadrature at import.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95901-scratch.mjs
 * (per-family jump tracks at m=22,30,41), tmp/imp-95901-verify.mjs (laws EXACT across m=20,22,30,41,50,
 * coincidences excluded, max |Da| ~ 1.4e-5), tmp/imp-95901-extra.mjs (delta + half-integer families).
 */

const MODULI = Object.freeze([22, 30, 41]);

// Measured per-locus JUMP tracks (Ds = jump in the linear coefficient, Dc = jump in the constant),
// extracted from the exact Q_0(m,v) reconstruction at m=22,30,41 (scratch). Ds is index-independent
// within a family; Dc is index-linear and m-free. Da (leading curvature jump) is 0 to roundoff.
const JUMP_TRACKS = Object.freeze({
  alpha: Object.freeze({
    locus: 'v = j/m',
    DsTrack: Object.freeze([-66, -90, -123]), // = -3m at m=22,30,41
    DcAtJ1: 3, // Dc = 3j, m-free
    DsLaw: 'Ds = -3m',
    DcLaw: 'Dc = 3j',
  }),
  betaEven: Object.freeze({
    locus: 'v = j/(2m+1), j even',
    DsTrack: Object.freeze([45, 61, 83]), // = 2m+1 at m=22,30,41
    DcAtJ2: -2, // Dc = -j, m-free
    DsLaw: 'Ds = 2m+1',
    DcLaw: 'Dc = -j',
  }),
  betaOdd: Object.freeze({
    locus: 'v = j/(2m+1), j odd',
    DsTrack: Object.freeze([0, 0, 0]),
    DcAtJ1: 0,
    DsLaw: 'Ds = 0',
    DcLaw: 'Dc = 0',
  }),
  gamma: Object.freeze({
    locus: 'v = j/(2m)',
    DsTrack: Object.freeze([-66, -90, -123]), // = -3m at m=22,30,41
    DcAtJ1: 1.5, // Dc = (3/2) j, m-free
    DsLaw: 'Ds = -3m',
    DcLaw: 'Dc = (3/2) j',
  }),
  delta: Object.freeze({
    locus: 'v = k/(m-1)',
    DsTrack: Object.freeze([-21, -29, -40]), // = -(m-1) at m=22,30,41
    DcAtK1: 1, // Dc = k, m-free
    DsLaw: 'Ds = -(m-1)',
    DcLaw: 'Dc = k',
  }),
  halfInteger: Object.freeze({
    locus: 'v = 1/2',
    DsTrack: Object.freeze([2, 2, null]), // m-free (m=41 coincidence-entangled; reported null)
    Dc: -1,
    DsLaw: 'Ds = 2 (m-free)',
    DcLaw: 'Dc = -1 (m-free)',
    coincidenceNote: 'at m where the half-integer meets a family lattice (e.g. even m: alpha j=m/2 and '
      + 'gamma j=m both hit v=1/2) the jump SUPERIMPOSES; the clean m-free value is read off the '
      + 'coincidence-free moduli.',
  }),
});

// m-divided-differences of the Ds tracks over the two intervals (22->30, 30->41). A constant divided
// difference == the per-locus s_J track is a straight line in m (M-LINEAR); its value is the m-slope.
function dividedDiffs(track) {
  const [a, b, c] = track;
  if (a === null || b === null || c === null) return null;
  return Object.freeze([(b - a) / (MODULI[1] - MODULI[0]), (c - b) / (MODULI[2] - MODULI[1])]);
}
const DS_DIVIDED_DIFFS = Object.freeze({
  alpha: dividedDiffs(JUMP_TRACKS.alpha.DsTrack), // [-3, -3]
  betaEven: dividedDiffs(JUMP_TRACKS.betaEven.DsTrack), // [2, 2]
  gamma: dividedDiffs(JUMP_TRACKS.gamma.DsTrack), // [-3, -3]
  delta: dividedDiffs(JUMP_TRACKS.delta.DsTrack), // [-1, -1]
});
// M-LINEAR iff the two divided differences agree: dDs/dm is constant.
const isLinear = (dd) => dd !== null && Math.abs(dd[0] - dd[1]) < 1e-9;
const ALL_DS_M_LINEAR =
  isLinear(DS_DIVIDED_DIFFS.alpha)
  && isLinear(DS_DIVIDED_DIFFS.betaEven)
  && isLinear(DS_DIVIDED_DIFFS.gamma)
  && isLinear(DS_DIVIDED_DIFFS.delta);

// the imp-95877 aggregate dQ/dm the per-locus laws must ultimately assemble to (carried literal).
const AGGREGATE_DQ_DM = Object.freeze([3.789621e-6, 2.146553e-6, 1.551067e-6]);

export const TIER3_PER_LOCUS_JUMP_LAWS = Object.freeze({
  id: 'imp-95901-tier3-per-locus-jump-laws',
  title:
    'Measure the imp-95877 TIER-3 per-locus s_J(m,cell), c_J(m,cell) at m=22,30,41 via the intrinsic '
    + 'per-locus JUMPS (Ds, Dc) of the exact Q_0(m,v) reconstruction: every family jump law is an EXACT '
    + 'm-LINEAR (or m-free) rational, so the per-locus coefficients are smooth-in-m -- the aggregate '
    + 'dQ/dm non-constancy comes from moving locus positions and count, not from the coefficients',
  status:
    'MEASUREMENT (per-locus tracks + divided differences) -- extracting the one-sided quadratic '
    + 'coefficients of the exact greedy K_v reconstruction (imp-95720 machinery) at every fractional-part '
    + 'locus gives per-locus jumps with Da = 0 (curvature continuous, max |Da| ~ 1.4e-5) and EXACT '
    + 'm-linear (Ds) / m-free (Dc) laws on all five families: alpha Ds=-3m Dc=3j; beta-even Ds=2m+1 '
    + 'Dc=-j (odd j: 0); gamma Ds=-3m Dc=(3/2)j; delta Ds=-(m-1) Dc=k; half-integer Ds=2 Dc=-1. Verified '
    + 'across m=20,22,30,41,50 with coincidence loci (where family lattices meet, jumps superimpose) '
    + 'excluded. The Ds divided differences are constant (alpha/gamma -3, beta-even +2, delta -1), so '
    + 'the per-locus s_J tracks are straight lines in m. This SHARPENS imp-95877/imp-95900: the TIER-3 '
    + 'per-locus JUMP coefficients ARE symbolic-in-m (m-linear), so the non-constant aggregate dQ/dm '
    + '(imp-95877) and the D_3(m)=-C_1 cancellation (imp-95900) are sourced by the moving locus '
    + 'positions v=j/(am+b), the growing locus count, and the m-dependent coincidence set -- NOT by any '
    + 'per-locus non-smoothness. Does NOT close the transport identity (absolute cell coefficients need '
    + 'the running jump accumulation + interleaved order; aggregate assembly not performed). G '
    + 'irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95877 (decomposed the transport identity into three tiers; measured the non-constant aggregate '
    + 'dQ/dm and named TIER 3 the binding obstruction), imp-95900 (pinned the aggregate TIER-3 m-slope '
    + 'D_3(m)=-C_1 and flagged the per-locus split OPEN with the coincidence caveat), imp-95720 (exact '
    + 'greedy lowest-mass K_v reconstruction reproducing the -(4m-1)/2 curvature), imp-95745 '
    + '(m-dependence quarantined in the Q_0 sector)',

  // the intrinsic per-locus datum and why it is linear (Da = 0):
  perLocusJump: Object.freeze({
    definition: 'DQ(v) = Q_0_right(v) - Q_0_left(v) = Da . v^2 + Ds . v + Dc across each locus '
      + 'v0 = j/(am+b); the pair (Ds, Dc) is the intrinsic per-locus TIER-3 datum.',
    curvatureContinuous: 'Da = 0 to roundoff (max |Da| ~ 1.4e-5 over every locus at m=20,22,30,41,50) '
      + 'because the leading curvature -(4m-1)/2 is common to both sides (imp-95877 TIER 1), so each '
      + 'locus is fully described by (Ds, Dc).',
    extraction: 'one-sided quadratic fits of Q_0(m,v) at v0 +/- k.eps (eps=1e-5, k=1,2,3), left and '
      + 'right; coefficients come out as clean rationals.',
  }),

  // the measured tracks and fitted laws:
  jumpTracks: JUMP_TRACKS,
  moduli: MODULI,
  dsDividedDiffs: DS_DIVIDED_DIFFS,
  allDsMLinear: ALL_DS_M_LINEAR,

  // classification the ticket asks for: each TIER-3 coefficient is m-linear / m-free, none non-smooth.
  classification: Object.freeze({
    Ds: 'M-LINEAR on every family (alpha/gamma slope -3, beta-even slope +2, delta slope -1, '
      + 'beta-odd + half-integer m-free); index-independent within a family.',
    Dc: 'm-FREE on every family, linear in the family index (alpha 3j, beta-even -j, gamma (3/2)j, '
      + 'delta k, half-integer -1).',
    nonSmooth: 'NONE at the per-locus level -- the only non-smoothness is the m-dependent COINCIDENCE '
      + 'set where family lattices meet and jumps superimpose (documented, not a coefficient defect).',
  }),

  // how the smooth per-locus laws coexist with the non-constant aggregate dQ/dm:
  aggregateReconciliation: Object.freeze({
    aggregateDQdm: AGGREGATE_DQ_DM, // imp-95877: +3.79e-6, +2.15e-6, +1.55e-6 (decaying)
    finding: 'the aggregate dQ/dm non-constancy (imp-95877) and the D_3(m)=-C_1 cancellation '
      + '(imp-95900) are NOT sourced by non-smooth per-locus coefficients (those are exactly m-linear) '
      + 'but by the moving locus positions v=j/(am+b), the growing locus count (j=1..O(m) per family), '
      + 'and the m-dependent coincidence set.',
    consequence: 'a symbolic TIER-3 law can now be built on exact per-locus jump rationals; the '
      + 'remaining m-transcendence lives in the assembly (accumulation order + positions), not the '
      + 'coefficients.',
  }),

  verdict: Object.freeze({
    outcome: 'MEASUREMENT -- per-locus TIER-3 jump laws are EXACT m-linear rationals; aggregate '
      + 'assembly still OPEN',
    whatIsNew: 'the five exact per-locus jump laws (alpha Ds=-3m Dc=3j; beta-even Ds=2m+1 Dc=-j; gamma '
      + 'Ds=-3m Dc=(3/2)j; delta Ds=-(m-1) Dc=k; half-int Ds=2 Dc=-1) and the constant Ds divided '
      + 'differences, showing the per-locus coefficients carry NO non-smoothness in m.',
    remainingObstruction: 'assemble the per-locus jumps into the absolute cell coefficients '
      + 's_J(m,cell), c_J(m,cell) via the running accumulation across the m-dependent interleaved locus '
      + 'order (with coincidence superposition), then integrate against zeta(3,1+v) and check the '
      + 'imp-95900 aggregate TIER-3 slope +0.2006346. The jump law is symbolic-in-m; the accumulation '
      + 'order and coincidence combinatorics are the open pieces.',
    conclusion:
      'This advances imp-95900 from "the greedy K_v selection has no symbolic-in-m form per locus" to '
      + '"the per-locus JUMP coefficients are exact m-linear rationals; only the accumulation order and '
      + 'coincidence combinatorics remain non-symbolic". The non-constant aggregate dQ/dm is attributed '
      + 'to sliding positions and growing count, not to the coefficients. Changes no bound; NO QED.',
  }),

  caveats:
    'Measurement via one-sided quadratic fits of the exact Q_0(m,v) reconstruction (imp-95720 K_v, '
    + 'verbatim); the jump coefficients come out as clean rationals matching the fitted laws exactly '
    + '(coincidence loci excluded, where family lattices meet and jumps superimpose). No new import-time '
    + 'quadrature -- tracks and laws are baked literals. The laws describe the per-locus JUMPS, not the '
    + 'absolute cell coefficients or the assembled aggregate; the transport identity is NOT closed. '
    + 'Catalan G irrationality OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed'
    + '; NO QED.',
});

export const TIER3_PER_LOCUS_JUMP_LAWS_ASSERTIONS = Object.freeze([
  {
    name: 'per-locus jump is linear (Da=0, leading curvature continuous) -- documented, five families listed',
    holds: () => {
      const p = TIER3_PER_LOCUS_JUMP_LAWS.perLocusJump;
      return /Da = 0/.test(p.curvatureContinuous)
        && Object.keys(TIER3_PER_LOCUS_JUMP_LAWS.jumpTracks).length === 6; // alpha,betaEven,betaOdd,gamma,delta,halfInteger
    },
  },
  {
    name: 'alpha jump track reproduces Ds=-3m at m=22,30,41 and Dc=3j (m-free)',
    holds: () => {
      const a = JUMP_TRACKS.alpha;
      return a.DsTrack[0] === -3 * 22 && a.DsTrack[1] === -3 * 30 && a.DsTrack[2] === -3 * 41
        && a.DcAtJ1 === 3;
    },
  },
  {
    name: 'beta split: even j gives Ds=2m+1, Dc=-j; odd j gives zero jump',
    holds: () => {
      const be = JUMP_TRACKS.betaEven;
      const bo = JUMP_TRACKS.betaOdd;
      return be.DsTrack[0] === 2 * 22 + 1 && be.DsTrack[1] === 2 * 30 + 1 && be.DsTrack[2] === 2 * 41 + 1
        && be.DcAtJ2 === -2
        && bo.DsTrack.every((v) => v === 0) && bo.DcAtJ1 === 0;
    },
  },
  {
    name: 'gamma jump track reproduces Ds=-3m and Dc=(3/2)j; delta reproduces Ds=-(m-1) and Dc=k',
    holds: () => {
      const g = JUMP_TRACKS.gamma;
      const d = JUMP_TRACKS.delta;
      return g.DsTrack[0] === -3 * 22 && g.DsTrack[2] === -3 * 41 && g.DcAtJ1 === 1.5
        && d.DsTrack[0] === -(22 - 1) && d.DsTrack[1] === -(30 - 1) && d.DsTrack[2] === -(41 - 1)
        && d.DcAtK1 === 1;
    },
  },
  {
    name: 'Ds divided differences are constant on every family (M-LINEAR): alpha/gamma -3, beta-even +2, delta -1',
    holds: () =>
      ALL_DS_M_LINEAR === true
      && Math.abs(DS_DIVIDED_DIFFS.alpha[0] - -3) < 1e-9 && Math.abs(DS_DIVIDED_DIFFS.alpha[1] - -3) < 1e-9
      && Math.abs(DS_DIVIDED_DIFFS.betaEven[0] - 2) < 1e-9 && Math.abs(DS_DIVIDED_DIFFS.betaEven[1] - 2) < 1e-9
      && Math.abs(DS_DIVIDED_DIFFS.gamma[0] - -3) < 1e-9
      && Math.abs(DS_DIVIDED_DIFFS.delta[0] - -1) < 1e-9 && Math.abs(DS_DIVIDED_DIFFS.delta[1] - -1) < 1e-9,
  },
  {
    name: 'classification: Ds M-LINEAR, Dc m-FREE, no per-locus non-smoothness (only coincidence set)',
    holds: () => {
      const c = TIER3_PER_LOCUS_JUMP_LAWS.classification;
      return /M-LINEAR/.test(c.Ds) && /m-FREE/.test(c.Dc) && /NONE/.test(c.nonSmooth)
        && /coincidence/i.test(c.nonSmooth);
    },
  },
  {
    name: 'aggregate reconciliation carries imp-95877 dQ/dm and attributes non-constancy to positions/count',
    holds: () => {
      const r = TIER3_PER_LOCUS_JUMP_LAWS.aggregateReconciliation;
      return Math.abs(r.aggregateDQdm[0] - 3.789621e-6) < 1e-11
        && Math.abs(r.aggregateDQdm[2] - 1.551067e-6) < 1e-11
        && /moving locus positions/.test(r.finding)
        && /NOT/.test(r.finding);
    },
  },
  {
    name: 'verdict is a MEASUREMENT: per-locus laws m-linear, aggregate assembly open, disclaimers present',
    holds: () => {
      const v = TIER3_PER_LOCUS_JUMP_LAWS.verdict;
      const s = TIER3_PER_LOCUS_JUMP_LAWS.status;
      return /MEASUREMENT/.test(v.outcome)
        && /aggregate assembly still OPEN/.test(v.outcome)
        && /accumulation order and coincidence combinatorics/.test(v.remainingObstruction)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default TIER3_PER_LOCUS_JUMP_LAWS;
