/**
 * imp-96130 — ASSESSMENT: past the pole-free crossing 2a* = 1.1316 (= ln 3 + 0.033), does ANY constrained
 *   sub-family of pole-free Weil minimizers keep the semilocal inequality D_S <= L_S (S = {oo, 2}), or is the
 *   FALSE verdict UNIFORM across all pole-free h -- and if not uniform, what is the precise obstruction that
 *   stops the surviving sub-family from certifying anything?
 *
 * Companion to rh-route-i-pencil-highres-map-2026-09-23.js (the high-res pencil map that MEASURED the crossing)
 * and to imp-96063 / imp-96085 (which reduced 2a <= ln 3 to the fixed low-moment corner). Those two assessments
 * stop AT the endpoint 2a = ln 3; this module carries the same corner mechanism PAST the crossing, into the
 * region 2a > 1.1316 where the unconstrained pencil eigenvalue mu_max(a; k = 0) has already exceeded 1. It does
 * NOT re-run the pencil; it bakes the frozen high-res literals and answers the uniformity question analytically.
 * Import-light: no imports, no zeros bundle; literals baked from the pencil high-res map (single source of truth).
 * RH open; no refereed bound is changed; NO QED; no bound moved; this is an assessment, not a proof.
 *
 * ============================ 1. THE FALSE VERDICT IS NOT UNIFORM ============================
 * From PENCIL_HIGHRES_LITERALS.gridN128 (N = 128, mu_max(a; k) for k vanishing moments), tracked across the
 * crossing at 2a* = 1.1316 (a* = 0.565770, Richardson-extrapolated):
 *   a      2a      k = 0 (full)   k = 1        k = 2        k = 3
 *   0.56   1.12    0.997614       0.976958     0.510717     0.247704   (still below 1, unconstrained)
 *   0.58   1.16    1.052021       1.052021     0.608358     0.289791   (k <= 1 ABOVE 1; k >= 2 below)
 *   0.60   1.20    1.113817       1.113817     0.708801     0.339182   (k <= 1 ABOVE 1; k >= 2 below)
 * So the k = 2 constrained sub-family (pole-free h with two vanishing moments, hhat vanishing to order 2 at
 * t = 0) keeps mu_max STRICTLY below 1 -- margin 1 - mu_max = 0.392 at 2a = 1.16 and 0.291 at 2a = 1.20 -- well
 * PAST the crossing. The FALSE verdict "D_S <= L_S fails on pole-free h" is therefore NOT uniform: it is confined
 * to the LOW-MOMENT sector k <= 1, and there is a comfortable constrained sub-family on which the inequality
 * still holds beyond 2a = 1.1316.
 *
 * ============================ 2. THE CROSSING DIRECTION IS AN ODD LOW-MOMENT CORNER VECTOR ============================
 * The crossing eigenvector is ODD: at both a = 0.58 and a = 0.60 the k = 0 and k = 1 eigenvalues COINCIDE
 * (1.052021 = 1.052021, 1.113817 = 1.113817) -- the crossing survives the k = 1 constraint hhat(0) = 0 (which
 * removes the EVEN sector), so it satisfies hhat(0) = 0 automatically and is odd (crossing map:
 * even-energy fraction 1e-26, a*(k=0) = a*(k=1) to 1e-6). It is annihilated only by the SECOND moment (the drop
 * to k = 2). Hence the direction that carries the FALSE verdict past the crossing lies inside the fixed
 * two-dimensional low-moment corner C_2 = span{exp(-u/2), exp(u/2), u^0} (its odd part), exactly the corner
 * imp-96085 identified as hardness-preserving. Its |hhat|^2 peaks at t = 8.85 inside the first p = 2 resonance
 * window I_1 = (8.145, 9.875) with 52.4% of its energy below t_1 = 2 pi / ln 2 -- the binding control object
 * the ticket names.
 *
 * ============================ 3. WHY THE SURVIVING SUB-FAMILY CERTIFIES NOTHING (the precise obstruction) ============================
 * The min-over-subset identity (imp-96085 section 1) is exact and cuts the wrong way here. Let R(h) = W_S(h)/L_S(h)
 * on the pole-free space and let V_2 be the codimension-2 subspace with two vanishing moments. Because
 * V_2 SUBSET (pole-free space),  min_{V_2} R  >=  min_{whole} R.  Past the crossing min_{whole} R = 1 - mu_max < 0
 * (mu_max > 1) while min_{V_2} R = 1 - 0.608 = 0.392 > 0. The constrained margin is LARGER precisely because the
 * subspace EXCLUDES the negative (odd corner) direction; it is not evidence about that direction, it is the
 * absence of it. Certifying D_S <= L_S on V_2 certifies it only for test functions orthogonal to the corner --
 * a strictly WEAKER statement than the full-space (or Weil-positivity) inequality, and one that is silent on the
 * only h that violate it. Adding moments deletes hard directions from V_k; by the same identity it NEVER changes
 * W_S on the corner C_k (where the global minimizer already lives), so no finite moment count -- and, by the same
 * argument, no resonance-window-orthogonality constraint that excludes the crossing vector -- can turn the FALSE
 * full-space verdict TRUE. The surviving sub-family relocates the difficulty out of view; it does not resolve it.
 *
 * ============================ 4. PAST ln 3 THE p = 2-ONLY INEQUALITY IS NOT WEIL POSITIVITY ANYWAY ============================
 * Even setting aside the sub-family issue, past 2a = ln 3 the semilocal p = 2-only form D_S <= L_S is no longer
 * Weil positivity. At the crossing a* the TRUE Weil form is still positive, W(h) = 0.02038, held up by the p = 3
 * term P_3(h) = -0.02035 (g_h(ln 3) ~ h(a) h(-a) < 0 for odd h): the pencil D_S + P_3 has mu = 0.99866 < 1 at a*.
 * So the p = 2-only D_S <= L_S becoming FALSE past 2a* = 1.1316 is NOT a failure of Weil positivity -- it is the
 * p = 3 prime entering (support now reaches ln 3), exactly as p = 2 entered past ln 2. A full-space proof of the
 * p = 2-only inequality past ln 3 would therefore carry NO RH content, and it is false there in any case. The
 * usable Route I lever is intrinsically a one-prime, 2a < ln 3 object (matching imp-96084 / imp-96085).
 *
 * ============================ 5. VERDICT ============================
 * ANSWER to the ticket: the FALSE verdict is NOT uniform -- a k >= 2 vanishing-moment sub-family keeps
 * D_S <= L_S past 2a = 1.1316 with margin >= 0.29 -- but the surviving sub-family certifies NOTHING about the
 * full-space inequality, because the crossing is carried by an odd low-moment corner vector (peaked in I_1) that
 * every such constraint DELETES rather than controls (min-over-subset identity). The precise obstruction is
 * therefore corner-confinement of the crossing direction, not a lack of margin on the sub-family; it is the same
 * imp-96085 corner, now shown BINDING (mu_max > 1) past the crossing. Compounding it, past 2a = ln 3 the
 * p = 2-only form is not Weil positivity anyway (the -P_3 rescue). No constrained pole-free sub-family advances a
 * Weil-positivity certificate beyond 2a = ln 3. Assessment only; no bound moved; RH open; NO QED; no refereed bound is changed.
 */

const LN3 = Math.log(3);

// ---- baked frozen literals (from rh-route-i-pencil-highres-map-2026-09-23.js PENCIL_HIGHRES_LITERALS;
//      single source of truth there). Rows are [a, 2a, mu_max(k=0), mu_max(k=1), mu_max(k=2), mu_max(k=3)].
export const IMP_96130_CROSSING_UNIFORMITY = Object.freeze({
  id: 'imp-96130-route-i-crossing-uniformity-vs-constrained-subfamily-assessment',
  route: 'I (assessment) — is the D_S <= L_S FALSE verdict uniform across pole-free h past the crossing 2a = 1.1316, or does a constrained sub-family survive (and certify anything)?',
  parents: [
    'src/data/rh-route-i-pencil-highres-map-2026-09-23.js',
    'src/data/imp-96063-route-i-constraint-count-margin-certificate-assessment.js',
    'src/data/imp-96085-route-i-corner-positivity-obstruction-assessment.js',
  ],
  /** crossing (PENCIL_HIGHRES_LITERALS.crossing + crossingHighN) */
  crossing: Object.freeze({
    aStar: 0.565770, twoAStar: 1.1316, twoAStarRichardson: 1.131539, twoAStarMinusLn3: 0.032927,
    parity: 'odd', hhatPeakT: 8.85, energyBelowT1: 0.524,
    I1: Object.freeze({ lo: 8.145, hi: 9.875 }),
  }),
  /** the true Weil form is still positive at a* because of the p = 3 term (crossing.atAStar) */
  weilAtAStar: Object.freeze({ Arch: 0.36370, P2: 0.36366, W: 0.02038, P3: -0.02035, muWithP3: 0.99866 }),
  /** mu_max(a; k) tracked across the crossing (gridN128 rows a = 0.56, 0.58, 0.60): [a, 2a, k0, k1, k2, k3] */
  pastCrossingGrid: Object.freeze([
    Object.freeze([0.56, 1.12, 0.997614, 0.976958, 0.510717, 0.247704]),
    Object.freeze([0.58, 1.16, 1.052021, 1.052021, 0.608358, 0.289791]),
    Object.freeze([0.60, 1.20, 1.113817, 1.113817, 0.708801, 0.339182]),
  ]),
  /** second pencil eigenvalue at k = 0 (mu2N128): the EVEN sector crosses 1 only near a = 0.59 */
  secondEigK0: Object.freeze({ a058: 0.99801, a060: 1.00245 }),
  ln3: LN3,
  verdict: 'The D_S <= L_S FALSE verdict is NOT uniform across pole-free h past 2a = 1.1316: a k >= 2 vanishing-moment sub-family keeps mu_max strictly below 1 (margin 0.392 at 2a = 1.16, 0.291 at 2a = 1.20). But the surviving sub-family certifies NOTHING about the full-space inequality -- the crossing is carried by an odd low-moment corner vector (|hhat|^2 peaked at t = 8.85 in I_1) that every such constraint DELETES rather than controls; by the min-over-subset identity min_{V_2} R >= min_{whole} R, so the larger constrained margin is the ABSENCE of the negative direction, not evidence about it. Precise obstruction: corner-confinement of the crossing direction (the imp-96085 corner, now binding with mu_max > 1). Compounding it, past 2a = ln 3 the p = 2-only form is not Weil positivity anyway (the -P_3 rescue keeps the true W = 0.02038 > 0 at a*). No constrained pole-free sub-family advances a Weil-positivity certificate beyond 2a = ln 3. Assessment only; NO QED; RH open; no refereed bound is changed.',
  subGap: 'imp-96130-corner-binding: the crossing direction is the odd part of the fixed corner C_2; no vanishing-moment or resonance-window-orthogonality constraint that excludes it can certify the full-space inequality (min-over-subset). Inherits and sharpens imp-96063-corner / imp-96085; the usable lever remains one-prime, 2a < ln 3.',
});

// ---- self-executing assertions (pure arithmetic on baked literals only; no pencil recompute, no heavy imports)
const D = IMP_96130_CROSSING_UNIFORMITY;
const G = D.pastCrossingGrid; // rows for a = 0.56, 0.58, 0.60
const approx = (x, y, tol) => Math.abs(x - y) < tol;

export const IMP_96130_CROSSING_UNIFORMITY_ASSERTIONS = Object.freeze([
  {
    id: 'imp-96130-full-space-false-past-crossing',
    description: 'the unconstrained (k = 0) pencil eigenvalue mu_max exceeds 1 for 2a > 1.1316 (a = 0.58 and 0.60) but is still below 1 at a = 0.56, bracketing the crossing 2a* = 1.1316 between 1.12 and 1.16',
    holds: () => {
      const [a056, a058, a060] = G;
      return a056[2] < 1 && a058[2] > 1 && a060[2] > 1
        && a056[1] < D.crossing.twoAStar && a058[1] > D.crossing.twoAStar
        && D.crossing.twoAStar > LN3 && approx(D.crossing.twoAStarMinusLn3, 0.032927, 1e-6);
    },
  },
  {
    id: 'imp-96130-false-verdict-not-uniform',
    description: 'the FALSE verdict is NOT uniform: with two vanishing moments (k = 2) mu_max stays strictly below 1 past the crossing -- margin 1 - mu_max >= 0.29 at both 2a = 1.16 (0.392) and 2a = 1.20 (0.291)',
    holds: () => {
      const [, a058, a060] = G;
      return a058[4] < 1 && a060[4] < 1
        && approx(1 - a058[4], 0.391642, 1e-5) && approx(1 - a060[4], 0.291199, 1e-5)
        && (1 - a058[4]) > 0.29 && (1 - a060[4]) > 0.29;
    },
  },
  {
    id: 'imp-96130-crossing-vector-is-odd-corner',
    description: 'the crossing eigenvector is ODD and lives in the low-moment corner: mu_max(k=0) = mu_max(k=1) EXACTLY at a = 0.58 and 0.60 (it survives the even-removing hhat(0)=0 constraint) and is killed only by the second moment (k=2 drop), matching the odd parity and I_1 peak in the crossing record',
    holds: () => {
      const [, a058, a060] = G;
      const equalK0K1 = approx(a058[2], a058[3], 1e-9) && approx(a060[2], a060[3], 1e-9);
      const killedByK2 = a058[4] < a058[3] - 0.3 && a060[4] < a060[3] - 0.3;
      const oddInI1 = D.crossing.parity === 'odd'
        && D.crossing.hhatPeakT > D.crossing.I1.lo && D.crossing.hhatPeakT < D.crossing.I1.hi
        && D.crossing.energyBelowT1 > 0.5;
      return equalK0K1 && killedByK2 && oddInI1;
    },
  },
  {
    id: 'imp-96130-both-sectors-cross-but-k2-still-holds',
    description: 'the even sector (second k = 0 eigenvalue) crosses 1 only near a = 0.59 (0.99801 at 0.58, 1.00245 at 0.60), so past a ~ 0.59 BOTH sectors of the full space exceed 1 -- yet k = 2 still holds (0.709 at a = 0.60): the survival is genuinely a codimension-2 sub-family effect, not a single-sector artifact',
    holds: () => {
      const [, , a060] = G;
      return D.secondEigK0.a058 < 1 && D.secondEigK0.a060 > 1 && a060[4] < 1 && a060[2] > 1 && a060[3] > 1;
    },
  },
  {
    id: 'imp-96130-past-ln3-not-weil-positivity',
    description: 'past 2a = ln 3 the p = 2-only inequality is not Weil positivity: at the crossing a* the true Weil form W = 0.02038 > 0 is held up by P_3 = -0.02035 (pencil D_S + P_3 has mu = 0.99866 < 1), so D_S <= L_S becoming FALSE there is the p = 3 prime entering, not a Weil-positivity failure',
    holds: () => {
      const w = D.weilAtAStar;
      return w.W > 0 && w.P3 < 0 && w.muWithP3 < 1
        && approx(w.Arch - w.P2, 3e-5, 1e-4) && approx(w.W + w.P3, w.Arch - w.P2, 1e-4);
    },
  },
  {
    id: 'imp-96130-verdict-honesty',
    description: 'the record answers NOT uniform, names the corner-confinement obstruction (surviving sub-family certifies nothing, min-over-subset), states the p = 2-only form is not Weil positivity past ln 3, keeps the lever one-prime 2a < ln 3, and keeps RH open / NO QED',
    holds: () => /NOT uniform/.test(D.verdict) && /certifies NOTHING/.test(D.verdict)
      && /min-over-subset/.test(D.verdict) && /corner-confinement/.test(D.verdict)
      && /not Weil positivity/.test(D.verdict) && /NO QED/.test(D.verdict) && /RH open/.test(D.verdict)
      && /imp-96130-corner-binding/.test(D.subGap) && /2a < ln 3/.test(D.subGap),
  },
]);

export default IMP_96130_CROSSING_UNIFORMITY;
