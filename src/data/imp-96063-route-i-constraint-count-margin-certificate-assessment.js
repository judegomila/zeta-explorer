/**
 * imp-96063 — ASSESSMENT: can the two-vanishing-moment uniform Weil-positivity margin be turned into a
 *   FINITE-CONSTRAINT CERTIFICATE that controls the p = 2 resonance window I_1 = (8.145, 9.875) and closes
 *   D_S <= L_S on the WHOLE pole-free subspace of L^2(-a, a) (semilocal S = {oo, 2}), for 2a <= ln 3?
 *
 * Companion assessment for rh-route-i-pencil-highres-map-2026-09-23.js forTheProof item (c) + constraintLever.
 * The high-res map MEASURED (N = 64/96/128 Legendre-Galerkin): on the pole-free space with k vanishing moments
 *   int u^j h(u) du = 0 (j < k, i.e. hhat vanishing to order k at t = 0), the normalized Weil-positivity margin
 *   m(k) = 1 - mu_max(a; k) = min_h W_S(h) / L_S(h) (W_S = Arch - P_2 = L_S - D_S) climbs sharply with k, and
 *   two moments already buy m(2) >= 0.539 UNIFORMLY on a in [0.30, (ln 3)/2]. This module does NOT re-run the
 *   pencil; it bakes the frozen high-res literals and answers the QUALITATIVE certificate question analytically.
 * Import-light: no imports, no zeros bundle; literals baked from rh-route-i-pencil-highres-map-2026-09-23.js.
 * RH open; no refereed bound is changed; NO QED; no bound moved; this is an assessment, not a proof.
 *
 * ============================ 1. THE CONSTRAINT-COUNT-VS-MARGIN RELATION ============================
 * At a = (ln 3)/2 (the sup over a <= (ln 3)/2 of mu_max for every column; all columns monotone in a), N = 96:
 *   k (moments) : mu_max      margin m(k) = 1 - mu_max     dominant negative window of the extremal
 *     0         : 0.9971589   0.0028411                    I_1 (peak t = 7.55, even; I_1 carries ~102% of L_S)
 *     1         : 0.9315457   0.0684543                    I_1 (peak t = 9.0, odd)
 *     2         : 0.4605021   0.5394979                    I_1 / I_2 boundary (peak t = 10.35, even)
 *     3         : 0.2279864   0.7720136                    I_2 (peak t = 18.75, odd)
 *     4         : 0.1903956   0.8096044                    outer
 *     5         : 0.1903956   0.8096044                    (unchanged: added moment has the wrong parity)
 *     6         : 0.1731696   0.8268304
 *     7         : 0.1225070   0.8774930
 *     8         : 0.0960235   0.9039765
 * STRUCTURE OF THE RELATION (measured, not conjectured to a formula):
 *  (i) The single large jump is k = 1 -> 2 (m: 0.068 -> 0.539): the SECOND moment removes the last low-order
 *      even/odd concentration mode that can still sit on I_1 with the bandwidth pi/a ~ 5.72 (a = (ln 3)/2).
 *  (ii) Beyond k = 2 the margin grows by DIMINISHING, parity-gated steps (k = 4 -> 5 is flat): each matched-parity
 *      pair of moments pushes the extremal ONE resonance window outward (I_1 -> I_2 -> ...), and the marginal gain
 *      tracks the decay of the window budget int_{I_k} |w| (see section 2). So the relation is a WINDOW LADDER, not
 *      an exponential in k: the margin is governed by WHICH window the extremal is forced into, not by k directly.
 *  (iii) Moments are near-optimal but not optimal: at (ln 3)/2 the k = 2 constraint (moments 0.4605) is within a
 *      factor ~1.72 of the optimal 2-constraint set (W|pf eigenvectors, 0.2674) and beats the Slepian band count.
 *
 * ============================ 2. WHY THE WINDOW LADDER (the uncertainty mechanism) ============================
 * w(t) = 2 theta'(t) - m_2(t) (symbol of Arch - P_2 = L_S - D_S) is < 0 exactly on the archimedean band [0, 3.597)
 * and on the p = 2 resonance windows I_k around t_k = 2 pi k / ln 2. Their budgets DECAY monotonically:
 *   window : center t_k : width delta_k : min w : int_{I_k} w : half-width time-bandwidth c_k = a * delta_k / 2 (a = (ln3)/2)
 *     I_1  :  9.0647     :  1.730       : -2.981 : -2.432      :  0.4752
 *     I_2  : 18.1294     :  1.157       : -2.286 : -1.451      :  0.3178
 *     I_3  : 27.1941     :  0.943       : -1.881 : -1.027      :  0.2590
 *     I_4  : 36.2588     :  0.814       : -1.594 : -0.775      :  0.2236
 *     I_5  : 45.3235     :  0.723       : -1.371 : -0.603      :  0.1986
 *     I_6  : 54.3882     :  0.650       : -1.188 : -0.478      :  0.1785
 * Since h is supported in [-a, a], hhat is entire of exponential type a, so its energy CANNOT concentrate into a
 * window of width delta_k tighter than the prolate limit set by c_k = a * delta_k / 2 (every c_k < 1/2 here, well
 * inside the "one degree of freedom per window" regime pi/a ~ 5.72 >> delta_k). Vanishing moments delete the
 * lowest-order hhat behaviour at t = 0; because the flanking positive windows [3.597, 8.145) and [9.875, 17.542)
 * are wide (int w = +0.540 and +1.414), an extremal that must vanish to order k at 0 is pushed into an OUTER I_j,
 * where both the depth and int_{I_j} |w| are smaller -- hence the ladder. This is the CORRECT mechanism for the
 * measured relation; it is NOT a rigorous margin bound (the prolate constant and the cross-window balance are only
 * indicated, not certified), which is exactly the residual named in section 3.
 *
 * ============================ 3. VERDICT ON THE CERTIFICATE QUESTION ============================
 * DOES A FINITE COUNT OF MOMENT/SUPPORT CONSTRAINTS SUFFICE TO CERTIFY D_S <= L_S ON THE WHOLE POLE-FREE SPACE?
 *   VERDICT: NO on its own -- but a finite count gives a rigorous REDUCTION, not a closure. Here is the honest
 *   structure. Split any pole-free h = h_perp + h_par, where h_perp lies in the codimension-k subspace V_k with k
 *   vanishing moments and h_par lies in the k-dimensional "low-moment corner" C_k = span of the deleted directions
 *   (the exp(-u/2), exp(u/2) pole-free generators plus u^0, ..., u^{k-2}). Then, with W_S the Weil form,
 *       W_S(h) = W_S(h_perp) + 2 Re W_S(h_perp, h_par) + W_S(h_par).
 *   The high-res map certifies (numerically, and plausibly rigorously via section 2) a LARGE margin on the first
 *   term: W_S(h_perp) >= 0.539 * L_S(h_perp) for k = 2 uniformly on [0.30, (ln 3)/2]. But:
 *    (A) THE CORNER DOES NOT IMPROVE WITH k. The full-space margin is m(0) = 0.00284 and it lives ON the corner
 *        directions (the k = 0 extremal is even with hhat(0) != 0, i.e. nonzero 0th moment -- precisely a C_k
 *        direction). No number of added moments touches W_S on C_k; adding constraints REMOVES the hard directions
 *        from V_k, it does not make them positive. The corner check must reproduce the unconstrained 2.8e-3, so the
 *        constraint lever RELOCATES the difficulty into a fixed finite-dimensional block, it does not remove it.
 *    (B) THE CROSS TERM IS UNCONTROLLED. 2 Re W_S(h_perp, h_par) is not sign-definite; a certificate must bound it
 *        (e.g. by a Cauchy-Schwarz / completing-the-square argument that spends part of the 0.539 subspace margin
 *        against the ~0.003 corner margin). Whether the subspace surplus can absorb both the corner and the cross
 *        term is the entire remaining question, and it is NOT answered by the size of m(k) alone.
 *   CONSEQUENCE. A finite constraint count (k = 2 suffices for the subspace) reduces "D_S <= L_S on all pole-free h,
 *   2a <= ln 3" to a FIXED, k-dimensional, a-uniform positivity check on the corner C_k plus a cross-term bound --
 *   a genuine and useful reduction (the residual is finite-dimensional, not a family), but it does NOT close the
 *   problem, and the residual margin it must certify is the unconstrained 2.8e-3, NOT the comfortable 0.539.
 *
 * NAMED SUB-GAP (imp-96063-corner): the k-dimensional low-moment corner positivity + cross-term bound. It carries
 * the full unconstrained hardness (margin 2.8e-3 at (ln 3)/2, shrinking to ~0 as 2a -> ln 3); the finite-constraint
 * lever provably CANNOT reduce this residual below the k = 0 margin. Any certificate route through vanishing moments
 * must close imp-96063-corner separately (an explicit few-parameter positivity argument), and that argument -- not
 * the margin ladder -- is where a proof of the semilocal inequality would actually be won or lost. Nothing here is
 * a proof; the p = 2-only inequality is in any case Weil positivity only for 2a < ln 3 (it fails at 2a* = ln 3 +
 * 0.033 in the odd sector, rescued only by -P_3), so no support-free operator inequality can exist. RH open; NO QED.
 */

const LN3 = Math.log(3);

// ---- baked frozen literals (from rh-route-i-pencil-highres-map-2026-09-23.js; single source of truth there)
export const IMP_96063_CONSTRAINT_MARGIN = Object.freeze({
  id: 'imp-96063-route-i-constraint-count-margin-certificate-assessment',
  route: 'I (assessment) — constraint-count-vs-margin relation for the semilocal pencil D_S <= L_S, and whether a finite constraint count certifies I_1 control on the whole pole-free space',
  parents: ['src/data/rh-route-i-pencil-highres-map-2026-09-23.js'],
  a: 'ln3/2',
  N: 96,
  /** mu_max(a=(ln3)/2; k) for k = 0..8 (frozen from PENCIL_HIGHRES_LITERALS.constraintFamiliesLn3Half.moments) */
  muMax: Object.freeze([0.9971589, 0.9315457, 0.4605021, 0.2279864, 0.1903956, 0.1903956, 0.1731696, 0.1225070, 0.0960235]),
  /** the p = 2 resonance windows: [center t_k, width delta_k, min w, int_{I_k} w] (frozen resonanceWindows) */
  windows: Object.freeze([
    Object.freeze({ k: 1, tk: 9.0647, width: 1.730, minW: -2.981, intW: -2.432 }),
    Object.freeze({ k: 2, tk: 18.1294, width: 1.157, minW: -2.286, intW: -1.451 }),
    Object.freeze({ k: 3, tk: 27.1941, width: 0.943, minW: -1.881, intW: -1.027 }),
    Object.freeze({ k: 4, tk: 36.2588, width: 0.814, minW: -1.594, intW: -0.775 }),
    Object.freeze({ k: 5, tk: 45.3235, width: 0.723, minW: -1.371, intW: -0.603 }),
    Object.freeze({ k: 6, tk: 54.3882, width: 0.650, minW: -1.188, intW: -0.478 }),
  ]),
  /** extremal dominant window vs k (frozen extremalAnatomy.aLn3Half peakT) */
  extremalPeakT: Object.freeze([7.55, 9.0, 10.35, 18.75]),
  I1: Object.freeze({ lo: 8.145, hi: 9.875 }),
  unconstrainedMargin: 0.0028411, // m(0) at (ln3)/2 -- the residual any full-space certificate must reproduce
  twoMomentUniformMargin: 0.539, // m(2) >= 0.539 uniformly on a in [0.30, (ln3)/2]
  verdict: 'A finite moment/support-constraint count does NOT by itself certify D_S <= L_S on the WHOLE pole-free space. It reduces the problem to a FIXED k-dimensional low-moment corner positivity + cross-term bound (sub-gap imp-96063-corner), whose residual margin is the unconstrained 2.8e-3, NOT the comfortable subspace 0.539. Two moments buy a large margin only ON the constrained subspace; the deleted corner carries the full hardness and cannot be improved by adding moments. Assessment only; NO QED; RH open; no refereed bound is changed.',
  subGap: 'imp-96063-corner: k-dimensional low-moment corner positivity + cross term; carries the 2.8e-3 unconstrained residual (-> 0 as 2a -> ln 3); provably not reducible by more moments; must be closed by a separate explicit few-parameter argument.',
});

// ---- self-executing assertions (arithmetic on baked literals only; no pencil recompute, no heavy imports)
const D = IMP_96063_CONSTRAINT_MARGIN;
const margin = (k) => 1 - D.muMax[k];
const approx = (x, y, tol) => Math.abs(x - y) < tol;

export const IMP_96063_CONSTRAINT_MARGIN_ASSERTIONS = Object.freeze([
  {
    id: 'imp-96063-margin-ladder-monotone-with-flat-parity-step',
    description: 'the margin m(k) = 1 - mu_max is non-decreasing in k, its single large jump is k = 1 -> 2 (Delta m > 0.45), and k = 4 -> 5 is flat (wrong-parity moment)',
    holds: () => {
      const nonDec = D.muMax.every((_, k) => k === 0 || margin(k) >= margin(k - 1) - 1e-12);
      const jump12 = margin(2) - margin(1);
      const otherJumps = [0, 2, 3, 4, 5, 6, 7].map((k) => margin(k + 1) - margin(k));
      const flat45 = approx(margin(5), margin(4), 1e-9);
      return nonDec && jump12 > 0.45 && otherJumps.every((d) => d < jump12) && flat45;
    },
  },
  {
    id: 'imp-96063-two-moment-margin-exceeds-half',
    description: 'two vanishing moments give m(2) >= 0.539 (matches the high-res uniform lever) while one moment gives only m(1) ~ 0.068 and zero moments the residual m(0) ~ 0.00284',
    holds: () => margin(2) >= 0.539 && approx(margin(2), 0.5394979, 1e-6)
      && approx(margin(1), 0.0684543, 1e-6) && approx(margin(0), D.unconstrainedMargin, 1e-6),
  },
  {
    id: 'imp-96063-window-budget-decays',
    description: 'the p = 2 resonance windows I_k have strictly decreasing width, |min w|, |int_{I_k} w|, and time-bandwidth c_k = a * delta_k / 2 (a = (ln3)/2), each c_k < 1/2 (one-DOF-per-window regime), and I_1 = (8.145, 9.875) has width ~1.73',
    holds: () => {
      const a = LN3 / 2;
      const w = D.windows;
      const decW = w.every((r, i) => i === 0 || r.width < w[i - 1].width);
      const decDepth = w.every((r, i) => i === 0 || Math.abs(r.minW) < Math.abs(w[i - 1].minW));
      const decInt = w.every((r, i) => i === 0 || Math.abs(r.intW) < Math.abs(w[i - 1].intW));
      const c = w.map((r) => a * r.width / 2);
      const cSmall = c.every((ck) => ck < 0.5) && c.every((ck, i) => i === 0 || ck < c[i - 1]);
      const i1width = approx(D.I1.hi - D.I1.lo, w[0].width, 5e-3);
      return decW && decDepth && decInt && cSmall && i1width && approx(c[0], 0.4752, 1e-3);
    },
  },
  {
    id: 'imp-96063-extremal-migrates-outward',
    description: 'as moments are added the extremal peak migrates from I_1 (t ~ 7.5-9) at k = 0, 1 outward to the I_2 region (t ~ 18.75) at k = 3, matching the window-ladder mechanism',
    holds: () => {
      const p = D.extremalPeakT;
      const inI1 = p[0] < 11 && p[1] < 11 && p[2] < 12;
      const outToI2 = p[3] > 15 && p[3] > 1.5 * D.windows[0].tk;
      return inI1 && outToI2 && p.every((_, i) => i === 0 || p[i] >= p[i - 1] - 1e-9);
    },
  },
  {
    id: 'imp-96063-verdict-honesty',
    description: 'the record states the finite-constraint count does NOT close the whole space, names the imp-96063-corner sub-gap carrying the 2.8e-3 residual, and keeps RH open / NO QED',
    holds: () => /does NOT/.test(D.verdict) && /NO QED/.test(D.verdict) && /RH open/.test(D.verdict)
      && /imp-96063-corner/.test(D.subGap) && /2\.8e-3|2\.8e-3 unconstrained/.test(D.subGap)
      && D.unconstrainedMargin < 0.01 && D.twoMomentUniformMargin > 0.5,
  },
]);

export default IMP_96063_CONSTRAINT_MARGIN;
