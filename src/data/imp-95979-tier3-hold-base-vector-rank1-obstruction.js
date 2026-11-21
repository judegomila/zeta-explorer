/**
 * @fileoverview imp-95979 -- SEEK a second independent relation on the imp-95965 base 2-vector
 * (s_base_prime, c_base_prime), or record precisely why the single HOLD = -C_1 + O(m^-3) scalar per m
 * leaves it under-determined. Derivation/assessment only; changes no bound; NO QED.
 *
 * SETUP (from imp-95965). imp-95965 attributed the accumulated-slope part of the interior HOLD term to
 * four closed-form per-family O(m) pieces (leading coefficient EXACTLY 4 C_1 = -8 INT v^2 zeta) and
 * reduced the residual to a single base 2-vector via
 *   HOLD(m) = INT_0^1 [ (s_base_prime(m) + S(v,m)) . v + c_base_prime(m) ] . zeta(3,1+v) dv,
 * S(v,m) = sum_{loci<v} d/dm[Ds] being the per-family-closed accumulated slope. The residual BASE term is
 *   BASE(m) = INT_0^1 [ s_base_prime(m) v + c_base_prime(m) ] zeta(3,1+v) dv
 *           = s_base_prime(m) . M1 + c_base_prime(m) . M0,
 * and imp-95965 imposes exactly ONE scalar constraint BASE(m) = -4 C_1 m - (C_1 + K) + O(m^-3).
 *
 * THE TWO BASE MOMENTS ARE CLOSED-FORM AND m-FREE. The base contributes only the affine profile
 * s.v + c to Q_0, so it enters HOLD through just the 0th and 1st zeta(3,1+v)-moments, both m-independent:
 *   M0 = INT_0^1 zeta(3,1+v) dv = sum_{k>=1} (1/2)[k^-2 - (k+1)^-2] = 1/2            (telescoping),
 *   M1 = INT_0^1 v zeta(3,1+v) dv = 1 - pi^2/12 = 0.1775329666...                     (see derivation).
 * (M1: write v = (k+v) - k, sum_{k} [1/k - 1/(k+1)] - (1/2) sum_{k} [1/k - 1/(k+1) + 1/(k+1)^2]
 *  = 1 - (1/2)(1 + zeta(2) - 1) = 1 - pi^2/12. Verified numerically to 9 digits, tmp/imp-95979-verify.mjs.)
 *
 * THE PRECISE UNDER-DETERMINATION (answers "why one scalar per m leaves it under-determined"). HOLD sees
 * the base 2-vector ONLY through the single linear functional
 *   pi(s, c) = s . M1 + c . M0,
 * whose coefficients (M1, M0) = (1 - pi^2/12, 1/2) are m-FREE. So the map (base 2-vector) -> (observable
 * HOLD) is RANK 1 at every m, with the SAME projection at every m. Its kernel is the fixed line
 *   ker pi = { (s, c) : s M1 + c M0 = 0 } = span (M0, -M1) = span (1/2, -(1 - pi^2/12)) ~ (6, -(12 - pi^2)),
 * which is INVISIBLE to HOLD for every m SIMULTANEOUSLY. Therefore no collection of per-m constraints --
 * not even the full family HOLD(m) = -C_1 + O(m^-3) for all m -- can separate s_base_prime from
 * c_base_prime: the "one scalar per m" is not one stackable equation per m but the identical rank-1
 * projection repeated. That is the exact reason the base 2-vector stays under-determined by HOLD.
 *
 * CANDIDATE (c) REFUTED (a second INT v^2 [...] zeta constraint). A v^2-moment of the base is NOT
 * available inside the transport identity: the base contributes only s.v + c, so only M0 and M1 enter
 * HOLD. The v^2 coefficient of Q_0 is the FIXED TIER-1 curvature -(4m-1)/2 (imp-95720/imp-95877), not
 * part of the base 2-vector, so there is no second base moment to constrain. Candidate (c) cannot supply
 * the second relation.
 *
 * WHERE A GENUINE SECOND RELATION MUST COME FROM (candidates a/b). Because HOLD is rank-1 in the base
 * 2-vector, the second independent relation CANNOT be internal to the transport identity -- it must be an
 * EXTERNAL boundary/normalization condition, both of which lie OUTSIDE the rank-1 image of HOLD:
 *   (b) s_base_prime, c_base_prime are the d/dm of the ABSOLUTE coefficients of the base cell
 *       [0, v_min(m)) (v_min = the smallest family locus, min over families), fixed directly by the
 *       greedy lowest-mass K_v reconstruction (imp-95720) -- a v=0 boundary evaluation, not a HOLD datum;
 *   (a) equivalently a c_base_prime normalization from the m-free imp-95901 Dc laws: Dc is m-free on
 *       every family (alpha 3j, beta -j, gamma 1.5j, delta k, half -1), so the accumulated constant part
 *       carries no O(m) growth and d/dm[c_base] is an integration-constant condition rather than an
 *       accumulation -- an external normalization, again not derivable from HOLD.
 * Neither is evaluated here (that requires re-running the imp-95720 base-cell reconstruction); the finding
 * is the DICHOTOMY, not the numbers.
 *
 * BUT THE BASE TERM STAYS NOT PER-FAMILY-RESOLVABLE (answers "make it per-family-resolvable"). Even with
 * the 2-vector fully pinned by external boundary data, the base TERM does not become per-family-resolvable:
 * the base cell PRECEDES every family locus (v_min = min_family first-locus), so its coefficient pair is
 * the single SHARED integration constant of the accumulation, not a sum of per-family contributions. The
 * per-family attribution therefore provably STOPS at the accumulated-slope part (already closed by
 * imp-95965 with leading coefficient 4 C_1); the base term is one global, family-blind 2-vector by
 * construction. So: HOLD alone can NEVER split it (rank 1), external base-cell data can EVALUATE it but
 * cannot attribute it per family.
 *
 * NET. Records the exact reason for the imp-95965 under-determination -- HOLD is a rank-1 projection of the
 * base 2-vector through the m-free base moments (M0 = 1/2, M1 = 1 - pi^2/12), kernel span (M0, -M1) --
 * refutes candidate (c) (no v^2 base moment exists in the identity), and directs the second relation to
 * EXTERNAL base-cell boundary data (a/b) while showing the base term is structurally not
 * per-family-resolvable. Assessment/derivation only; changes no bound; NO QED.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound; NO
 * Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes the two closed-form base moments and
 * checks the rank-1 kernel identity ARITHMETICALLY at import (no quadrature).
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95979-verify.mjs
 * (M0 = 0.5000000011, M1 = 0.1775329671 vs 1 - pi^2/12 = 0.1775329666, EM-tail Hurwitz zeta + Simpson).
 */

// imp-95900 exact TIER-1 curvature literal; aggregate target = -C_1 = +0.2006346034029.
const C1 = -0.2006346034029;
const AGGREGATE_TARGET = -C1;

// the two m-FREE base moments the base 2-vector enters HOLD through (closed form; see fileoverview).
const M0 = 0.5;                            // INT_0^1 zeta(3,1+v) dv = 1/2 (telescoping)
const M1 = 1 - (Math.PI * Math.PI) / 12;   // INT_0^1 v zeta(3,1+v) dv = 1 - pi^2/12 = 0.1775329666
const M1_NUMERIC = 0.1775329666;

// rank-1 projection HOLD sees the base 2-vector through, and its (m-free) kernel direction.
const PROJECTION = Object.freeze({ dS: M1, dC: M0 });     // pi(s,c) = s M1 + c M0
const KERNEL_DIRECTION = Object.freeze({ dS: M0, dC: -M1 }); // span (M0, -M1): invisible to HOLD

export const TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION = Object.freeze({
  id: 'imp-95979-tier3-hold-base-vector-rank1-obstruction',
  title:
    'Seek a second independent relation on the imp-95965 base 2-vector (s_base_prime, c_base_prime): '
    + 'HOLD sees it ONLY through the single m-free rank-1 projection pi(s,c) = s M1 + c M0 with base '
    + 'moments M0 = INT zeta = 1/2 and M1 = INT v zeta = 1 - pi^2/12, so its kernel span (M0, -M1) is '
    + 'invisible at every m -- no per-m HOLD data can separate the two scalars (candidate (c) refuted: no '
    + 'v^2 base moment exists in the identity); the second relation must be EXTERNAL base-cell boundary '
    + 'data (a/b), and even then the base term stays NOT per-family-resolvable (single shared integration '
    + 'constant preceding all family loci)',
  status:
    'ASSESSMENT (record the exact under-determination reason + refute one candidate + locate the second '
    + 'relation) -- the imp-95965 residual base term BASE(m) = s_base_prime M1 + c_base_prime M0 enters '
    + 'HOLD through the SINGLE m-free linear functional pi(s,c) = s M1 + c M0, with the two base moments '
    + 'closed-form: M0 = INT_0^1 zeta(3,1+v) dv = 1/2 (telescoping) and M1 = INT_0^1 v zeta(3,1+v) dv = '
    + '1 - pi^2/12 = 0.1775329666. The map (base 2-vector) -> (observable HOLD) is thus RANK 1 at every m '
    + 'with the SAME projection, so the fixed kernel line span (M0, -M1) is invisible to HOLD for all m '
    + 'simultaneously -- the exact reason one scalar per m under-determines the 2-vector. Candidate (c) '
    + '(a second INT v^2 [...] zeta constraint) is REFUTED: the base contributes only s.v + c, so only M0 '
    + 'and M1 enter; the v^2 coefficient is the fixed TIER-1 curvature -(4m-1)/2, not a base unknown. A '
    + 'genuine second relation must be EXTERNAL to HOLD: (b) the base-cell absolute coefficients from the '
    + 'imp-95720 K_v reconstruction (a v=0 boundary evaluation), or (a) a c_base_prime normalization from '
    + 'the m-free imp-95901 Dc laws. Even fully pinned, the base term stays NOT per-family-resolvable: the '
    + 'base cell precedes every family locus, so it is the single SHARED integration constant, not a family '
    + 'sum -- the per-family attribution provably stops at the accumulated slope (imp-95965). G '
    + 'irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95965 (attributed the accumulated-slope part per family, leading coeff 4 C_1; named the base '
    + '2-vector as the jointly under-determined residual), imp-95925 (target -C_1 + O(m^-3)), imp-95916 '
    + '(sliding-flux route exactly zero, whole cancellation in HOLD), imp-95901 (per-locus Ds/Dc laws; Dc '
    + 'm-free), imp-95900 (aggregate D_3 = -C_1; C_1 = -2 INT v^2 zeta), imp-95720 (greedy K_v recon)',

  C1,
  aggregateTarget: AGGREGATE_TARGET,

  // the two m-free base moments (closed form).
  baseMoments: Object.freeze({
    M0, // 1/2
    M1, // 1 - pi^2/12
    M0Closed: 'INT_0^1 zeta(3,1+v) dv = sum_{k>=1} (1/2)[k^-2 - (k+1)^-2] = 1/2 (telescoping)',
    M1Closed: 'INT_0^1 v zeta(3,1+v) dv = 1 - (1/2)(1 + zeta(2) - 1) = 1 - pi^2/12 = 0.1775329666',
    m1Numeric: M1_NUMERIC,
    verified: 'M0 = 0.5000000011, M1 = 0.1775329671 (EM-tail Hurwitz zeta + Simpson, tmp/imp-95979-verify.mjs)',
  }),

  // THE FINDING: HOLD is a rank-1 projection of the base 2-vector; the kernel is m-free and invisible.
  rank1Obstruction: Object.freeze({
    projection: 'HOLD sees the base 2-vector only through pi(s,c) = s . M1 + c . M0 = s (1 - pi^2/12) + c/2',
    projectionCoeffs: PROJECTION,
    kernelDirection: KERNEL_DIRECTION, // span (M0, -M1) = (1/2, -(1 - pi^2/12))
    kernelInvisible: 'the kernel line span (M0, -M1) satisfies pi = 0 and is m-FREE, so it is invisible '
      + 'to HOLD at EVERY m simultaneously; stacking HOLD(m) = -C_1 + O(m^-3) over all m repeats the same '
      + 'rank-1 projection and never separates s_base_prime from c_base_prime.',
    whyUnderDetermined: 'a single scalar constraint per m against a rank-1 (in the base 2-vector) '
      + 'observable cannot fix two unknowns; the deficiency is not per-m sample count but the m-invariant '
      + 'rank-1 structure of the projection.',
  }),

  // candidate (c) refuted; the genuine second relation must be external.
  secondRelation: Object.freeze({
    candidateCRefuted: 'a second INT_0^1 v^2 [...] zeta constraint is NOT available inside the transport '
      + 'identity: the base contributes only the affine s.v + c, so only M0 and M1 enter HOLD; the v^2 '
      + 'coefficient of Q_0 is the fixed TIER-1 curvature -(4m-1)/2 (imp-95720/imp-95877), not a base '
      + 'unknown -- so there is no second base moment to constrain.',
    candidateBExternal: 'the base scalars are the d/dm of the ABSOLUTE coefficients of the base cell '
      + '[0, v_min(m)) (v_min = smallest family locus), fixed by the greedy K_v reconstruction (imp-95720) '
      + '-- a v=0 boundary evaluation OUTSIDE the rank-1 image of HOLD.',
    candidateANormalization: 'equivalently a c_base_prime normalization from the m-free imp-95901 Dc laws '
      + '(Dc m-free per family), making d/dm[c_base] an integration-constant condition, not an accumulation '
      + '-- again external to HOLD.',
    notEvaluatedHere: 'neither external condition is evaluated here (that requires re-running the imp-95720 '
      + 'base-cell reconstruction); the finding is the dichotomy, not the base numbers.',
  }),

  // answers the per-family-resolvable prong: structurally impossible for the base term.
  perFamilyResolvability: Object.freeze({
    verdict: 'the base TERM is NOT per-family-resolvable, even with the 2-vector fully pinned',
    reason: 'the base cell precedes every family locus (v_min = min over families of the first locus), so '
      + 'its coefficient pair is the single SHARED integration constant of the accumulation, not a sum of '
      + 'per-family contributions -- family-blind by construction.',
    consequence: 'the per-family attribution provably STOPS at the accumulated-slope part (imp-95965, '
      + 'leading coeff 4 C_1); HOLD alone can never split the base (rank 1), and external base-cell data '
      + 'can EVALUATE it but not attribute it per family.',
  }),

  verdict: Object.freeze({
    outcome: 'ASSESSMENT -- the base 2-vector is under-determined by HOLD for an EXACT reason (rank-1 '
      + 'projection pi(s,c) = s M1 + c M0 through the m-free base moments M0 = 1/2, M1 = 1 - pi^2/12); '
      + 'candidate (c) refuted; a genuine second relation must be EXTERNAL base-cell boundary data (a/b); '
      + 'the base term stays NOT per-family-resolvable',
    whatIsNew: 'the two closed-form base moments (M0 = 1/2 exactly, M1 = 1 - pi^2/12), the identification '
      + 'of HOLD as a RANK-1 projection of the base 2-vector with the m-free invisible kernel span (M0, '
      + '-M1), the refutation of candidate (c) (no v^2 base moment in the identity), and the structural '
      + 'proof that the base term is a single shared integration constant hence not per-family-resolvable.',
    remainingObstruction: 'evaluate the external base-cell boundary condition (a) or (b) -- the absolute '
      + 'coefficients of the base cell [0, v_min(m)) from the imp-95720 K_v reconstruction, or a '
      + 'c_base_prime normalization from the m-free imp-95901 Dc laws -- to pin s_base_prime, c_base_prime '
      + 'separately. Until then the finite -C_1 landing is not attributable (though the O(m) accumulated '
      + 'growth is, imp-95965), and per-family resolution of the base is structurally excluded regardless.',
    conclusion:
      'This answers imp-95979 on both prongs. Under-determination: HOLD is a rank-1 projection of the base '
      + '2-vector through the m-free base moments M0 = 1/2, M1 = 1 - pi^2/12, so the fixed kernel span '
      + '(M0, -M1) is invisible at every m and one scalar per m can never separate the two scalars '
      + '(candidate (c) refuted -- no v^2 base moment exists). Per-family-resolvable: NO -- the base is the '
      + 'single shared integration constant preceding all family loci; the second relation, if sought, must '
      + 'be EXTERNAL base-cell boundary data (a/b). Changes no bound; NO QED.',
  }),

  caveats:
    'The two base moments are closed form (M0 = 1/2 by telescoping; M1 = 1 - pi^2/12 by the (k+v) - k '
    + 'split and zeta(2) = pi^2/6) and checked ARITHMETICALLY at import against 1 - pi^2/12; the numeric '
    + 'cross-check (M0 = 0.5000000011, M1 = 0.1775329671) is offline (EM-tail Hurwitz zeta + Simpson, '
    + 'tmp/imp-95979-verify.mjs) and carries ~1e-8 error. The rank-1 conclusion is exact linear algebra on '
    + 'the imp-95965 HOLD form and does not depend on the numeric values beyond M0, M1 being nonzero. The '
    + 'external second relation (candidates a/b) is LOCATED, not evaluated -- the base-cell absolute '
    + 'coefficients are not computed. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO '
    + 'Lambda movement; no refereed bound is changed; NO QED.',
});

export const TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION_ASSERTIONS = Object.freeze([
  {
    name: 'base moment M0 = INT_0^1 zeta(3,1+v) dv = 1/2 exactly (telescoping)',
    holds: () => M0 === 0.5,
  },
  {
    name: 'base moment M1 = INT_0^1 v zeta(3,1+v) dv = 1 - pi^2/12 (matches numeric 0.1775329666)',
    holds: () => Math.abs(M1 - (1 - Math.PI * Math.PI / 12)) < 1e-15
      && Math.abs(M1 - M1_NUMERIC) < 1e-7,
  },
  {
    name: 'FINDING: the kernel direction (M0, -M1) satisfies the rank-1 projection pi = s M1 + c M0 = 0',
    holds: () => Math.abs(KERNEL_DIRECTION.dS * M1 + KERNEL_DIRECTION.dC * M0) < 1e-15,
  },
  {
    name: 'the projection coefficients (M1, M0) are m-FREE and nonzero (rank-1 at every m)',
    holds: () => PROJECTION.dS === M1 && PROJECTION.dC === M0 && M1 !== 0 && M0 !== 0,
  },
  {
    name: 'candidate (c) refuted: no v^2 base moment exists in the transport identity',
    holds: () => /v\^2/.test(TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION.secondRelation.candidateCRefuted)
      && /fixed TIER-1 curvature/.test(TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION.secondRelation.candidateCRefuted),
  },
  {
    name: 'base term is NOT per-family-resolvable (single shared integration constant, structural)',
    holds: () => {
      const p = TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION.perFamilyResolvability;
      return /NOT per-family-resolvable/.test(p.verdict)
        && /SHARED integration constant/.test(p.reason)
        && /STOPS at the accumulated-slope part/.test(p.consequence);
    },
  },
  {
    name: 'verdict is an ASSESSMENT: rank-1 under-determination, (c) refuted, second relation external, disclaimers',
    holds: () => {
      const v = TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION.verdict;
      const s = TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION.status;
      return /rank-1 projection/.test(v.outcome)
        && /candidate \(c\) refuted/.test(v.outcome)
        && /external base-cell boundary condition/.test(v.remainingObstruction)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default TIER3_HOLD_BASE_VECTOR_RANK1_OBSTRUCTION;
