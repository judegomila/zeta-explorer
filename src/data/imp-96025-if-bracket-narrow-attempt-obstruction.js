/**
 * @module imp-96025-if-bracket-narrow-attempt-obstruction
 *
 * imp-96025 -- ATTEMPT to narrow the rigorous pair-correlation integral bracket
 *     I_F = INT_1^inf F(alpha)/alpha^2 d(alpha),   rigorously (2/3 - eps, 2) under RH,
 * toward the Montgomery-conjectural I_F = 1 using the in-repo Montgomery/GUE pair-correlation
 * data (imp-1098), OR record the precise obstruction (which part of F(alpha) is unconstrained
 * without the full conjecture). RESULT: the bracket is NOT narrowed; the obstruction is recorded
 * precisely, in three named parts. Assessment / measurement only; changes no bound; NO QED.
 *
 * SETUP (imp-95984 / imp-96006). Chan (arXiv:math/0305339 Thm 1.1, refining Goldston 1987 via
 * Montgomery pair correlation) writes the Var S(T) constant as b = I_F + M + P2 with the arithmetic
 * core M + P2 = 0.400968 pinned to O(1e-12); the imp-95964 boundary constant K is EXACTLY the pair-
 * correlation integral I_F. Under RH, I_F is rigorously bracketed only in (2/3 - eps, 2); the
 * Montgomery pair-correlation conjecture pins F(alpha) -> 1 for alpha >= 1, giving I_F = 1,
 * a_0 = -0.176248 and the imp-96006 conditional anchor T_x = 8.54e19. The imp-95940 crossing range
 * [~5.8e17, ~1.36e28] collapses ONLY if the (2/3, 2) bracket tightens -- hence this attempt.
 *
 * THE FORM FACTOR AND ITS RIGOROUS ENVELOPE. Montgomery F(alpha) is the connected structure factor,
 * i.e. the Fourier transform of the pair correlation R2(r): F(alpha) = 1 - hatY2(alpha), where
 * Y2(r) = sinc^2(pi r) is the GUE cluster function. Rigorously, under RH:
 *   (i)  F(alpha) >= 0 for all alpha  (Montgomery nonnegativity), and
 *   (ii) F(alpha) = |alpha| (1 + o(1)) for |alpha| <= 1  (Montgomery, uniform under RH).
 * On [1, inf) RH supplies NOTHING beyond (i): no upper envelope and no positive lower envelope.
 * The value F(alpha) -> 1 on [1, inf) is EXACTLY the Montgomery pair-correlation conjecture
 * (equivalent to GUE, a quantitative twin-prime input). So the entire (2/3, 2) -> {1} narrowing lives
 * in the alpha >= 1 tail of F, which is precisely the unconstrained region.
 *
 * THE ATTEMPT (in-repo data) AND WHY IT CANNOT NARROW THE BRACKET. imp-1098 ships the empirical
 * pair CORRELATION function R2(r) of the first N = 1000 Odlyzko zeros vs the GUE form
 * 1 - sinc^2(pi r), on the grid |r| <= 3 step 0.05, KS ~ 0.094 (finite-N). Three obstructions, named:
 *
 *   (A) WRONG FOURIER SIDE. The in-repo data is R2(r) (the correlation FUNCTION), the Fourier DUAL
 *       of the form factor F(alpha) that I_F integrates. F(alpha) = 1 for alpha >= 1 is equivalent to
 *       hatY2(alpha) = 0 for alpha >= 1, a statement about the transform of Y2(r) over ALL r,
 *       dominated by the large-r (large-spacing) tail of R2. Resolving F just above alpha = 1 needs
 *       R2(r) to high accuracy at LARGE r -- exactly the long-range spacing correlations a finite-N,
 *       finite-height (gamma_1000 ~ 1419) sample cannot pin.
 *   (B) GRID TRUNCATION carries the tail mass. Under the conjecture F == 1 the integrand mass splits
 *       INT_1^3 1/alpha^2 = 2/3 (head, inside the in-repo alpha <= 3 grid) and INT_3^inf = 1/3 (tail,
 *       beyond the grid). A full one third of the conjectural I_F sits past the grid ceiling, invisible
 *       to any heuristic read-off of the in-repo data.
 *   (C) NO RIGOR FROM AN EMPIRICAL FIT. The empirical R2 plateau near alpha >= 1 sits at mean ~0.96
 *       (vs GUE 1) with KS ~ 0.094; that is a finite-N estimate, not a rigorous bound on F, and it is
 *       on the wrong Fourier side (A) anyway. It confirms GUE qualitatively; it constrains I_F NOT AT ALL.
 *
 * OBSERVATION (flagged, NOT an identity). The rigorous lower endpoint 2/3 numerically equals the head
 * INT_1^3 1/alpha^2 = 2/3 of the conjectural (F == 1) integrand. This is recorded as a coincidence of
 * the grid ceiling alpha = 3 with the endpoint value, NOT a claimed derivation of the 2/3 lower bound.
 *
 * VERDICT. ASSESSMENT / BRACKET NOT NARROWED, OBSTRUCTION RECORDED (frontier, NOT rigorous). Under RH,
 * F(alpha) is pinned only as F ~ |alpha| on [0,1] and F >= 0 elsewhere; on [1, inf) it is rigorously
 * unconstrained above and below (beyond >= 0), so the pair-correlation integral I_F stays bracketed in
 * (2/3 - eps, 2) and does not tighten. The in-repo Montgomery/GUE data (imp-1098) cannot narrow it
 * because (A) it is the correlation function R2(r), the Fourier DUAL of the form factor F that I_F
 * integrates, and reading F just above alpha = 1 needs the large-r tail of R2 that a finite-N sample
 * cannot resolve; (B) one third of the conjectural I_F mass (INT_3^inf 1/alpha^2) lies beyond the
 * in-repo alpha <= 3 grid; (C) the empirical R2 is a finite-N estimate (KS ~ 0.094), not a rigorous
 * bound, and on the wrong Fourier side. The narrowing of (2/3, 2) to {1} IS the Montgomery pair-
 * correlation conjecture (quantitative twin prime); no finite-N form-factor data supplies it. So the
 * imp-95940 crossing range [~5.8e17, ~1.36e28] does not collapse. Assessment only; changes no bound;
 * NO QED; I_F = 1 conjectural (Montgomery pair correlation, bracket (2/3 - eps, 2)); Catalan G
 * irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the zero-side route stays
 * PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The head/tail split is integrated live from
 * 1/alpha^2; the three imp-1098 empirical R2 plateau values (alpha = 1, 2, 3) are baked literals.
 *
 * @see imp-95984-fujii-varS-constant-literature-locate (K = I_F; rigorous bracket (2/3-eps, 2))
 * @see imp-96006-if1-crossing-height-conditional-anchor (I_F = 1 conditional anchor; no collapse)
 * @see pair-correlation-montgomery-numerical (imp-1098 empirical R2(r) vs GUE 1 - sinc^2, KS ~ 0.094)
 */

// rigorous RH bracket (imp-95984 / Chan Thm 1.1) and the Montgomery-conjectural value
const IF_LOWER_RH = 2 / 3; // (2/3 - eps) under RH
const IF_UPPER_RH = 2; // under RH
const IF_CONJECTURAL = 1; // Montgomery pair correlation: F(alpha) -> 1 for alpha >= 1
const BRACKET_WIDTH = IF_UPPER_RH - IF_LOWER_RH; // 4/3 ~ 1.333

// in-repo pair-correlation grid ceiling (imp-1098: |alpha| <= 3, step 0.05)
const GRID_ALPHA_MAX = 3;

// conjectural (F == 1) integrand head/tail split at the in-repo grid ceiling
// head = INT_1^GRID 1/alpha^2 (visible to the grid); tail = INT_GRID^inf 1/alpha^2 (beyond it)
function integrateInverseSquare(lo, hi) {
  // live fine-rectangle integral of 1/alpha^2 on [lo, hi] (exact primitive is -1/alpha)
  const steps = 2_000_000;
  const dx = (hi - lo) / steps;
  let s = 0;
  for (let i = 0; i < steps; i++) {
    const a = lo + (i + 0.5) * dx;
    s += (1 / (a * a)) * dx;
  }
  return s;
}
const HEAD_MASS = integrateInverseSquare(1, GRID_ALPHA_MAX); // ~2/3 (inside grid)
const TAIL_MASS = 1 - HEAD_MASS; // ~1/3 (beyond grid; exact INT_3^inf 1/a^2 = 1/3)
const GRID_VISIBLE_FRACTION = HEAD_MASS / IF_CONJECTURAL; // 2/3 of the conjectural I_F mass

// imp-1098 empirical R2(r) plateau values near alpha >= 1 (grid indices 80, 100, 120 = alpha 1,2,3)
const EMP_R2_PLATEAU = [0.943553, 0.98122, 0.955348]; // GUE plateau value is 1; KS ~ 0.094 finite-N
const EMP_R2_PLATEAU_MEAN =
  EMP_R2_PLATEAU.reduce((a, b) => a + b, 0) / EMP_R2_PLATEAU.length; // ~0.960
const IMP1098_KS = 0.094; // imp-1098 Kolmogorov sup-norm |R2_emp - R2_GUE| on |alpha| <= 1 (finite-N)

export const IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION = {
  ticket: 'imp-96025',
  proofSection: 'S-frontier',
  question:
    'Narrow the rigorous pair-correlation integral bracket I_F = INT_1^inf F(alpha)/alpha^2 in ' +
    '(2/3 - eps, 2) toward the Montgomery-conjectural I_F = 1 using the in-repo Montgomery/GUE ' +
    'pair-correlation data (imp-1098), or record the precise obstruction. Assessment only; NO QED.',
  method:
    'Identify the rigorous RH envelope on the form factor F(alpha) (F >= 0 everywhere; F ~ |alpha| ' +
    'on [0,1]; nothing on [1, inf) beyond >= 0); attempt a heuristic read-off from the imp-1098 ' +
    'empirical pair-correlation function; split the conjectural (F == 1) integrand into a grid-visible ' +
    'head INT_1^3 and a beyond-grid tail INT_3^inf; and name the parts of F that stay unconstrained.',
  bracket: {
    rigorousRH: [IF_LOWER_RH, IF_UPPER_RH], // (2/3 - eps, 2)
    width: BRACKET_WIDTH, // 4/3 ~ 1.333
    conjectural: IF_CONJECTURAL, // 1 (Montgomery pair correlation)
    narrowed: false,
    note:
      'The bracket is NOT narrowed. Under RH, F(alpha) is pinned only as F ~ |alpha| on [0,1] and ' +
      'F >= 0 elsewhere; on [1, inf) it is rigorously unconstrained above and below (beyond >= 0).',
  },
  rigorousEnvelope: {
    nonnegativity: 'F(alpha) >= 0 for all alpha (Montgomery)',
    lowUnitPinning: 'F(alpha) = |alpha| (1 + o(1)) for |alpha| <= 1 (Montgomery, uniform under RH)',
    tailUnconstrained:
      'On [1, inf) RH gives only F >= 0: no upper envelope, no positive lower envelope. F -> 1 there ' +
      'IS the Montgomery pair-correlation conjecture (equivalent to GUE / quantitative twin prime).',
  },
  headTailSplit: {
    gridAlphaMax: GRID_ALPHA_MAX, // 3 (imp-1098 grid ceiling)
    headMass: HEAD_MASS, // INT_1^3 1/alpha^2 ~ 0.6667 (grid-visible, conjectural F == 1)
    tailMass: TAIL_MASS, // INT_3^inf 1/alpha^2 ~ 0.3333 (beyond grid)
    gridVisibleFraction: GRID_VISIBLE_FRACTION, // 2/3 of the conjectural I_F mass
    note:
      'Under the conjecture F == 1, one third of the I_F mass lies past the in-repo alpha <= 3 grid ' +
      'and is invisible to any heuristic read-off of the in-repo data.',
  },
  empiricalAttempt: {
    source: 'imp-1098 pair-correlation-montgomery-numerical (first N = 1000 Odlyzko zeros)',
    quantityShipped: 'R2(r) = pair correlation FUNCTION (GUE form 1 - sinc^2(pi r)), NOT F(alpha)',
    r2PlateauValues: EMP_R2_PLATEAU, // near alpha = 1, 2, 3
    r2PlateauMean: EMP_R2_PLATEAU_MEAN, // ~0.960 (GUE plateau is 1)
    ksFiniteN: IMP1098_KS, // ~0.094 finite-N residual on |alpha| <= 1
    constrainsIF: false,
    note:
      'The empirical plateau confirms GUE qualitatively but constrains I_F not at all: it is a ' +
      'finite-N estimate (not a rigorous bound) AND it is the Fourier dual of the form factor.',
  },
  obstruction: {
    A_wrongFourierSide:
      'The in-repo data is R2(r), the Fourier DUAL of the form factor F(alpha) that I_F integrates. ' +
      'F(alpha) = 1 for alpha >= 1 is equivalent to hatY2(alpha) = 0 there, a statement about the ' +
      'transform of Y2(r) over ALL r, dominated by the large-r tail of R2; reading F just above ' +
      'alpha = 1 needs R2 at large r -- the long-range spacing correlations a finite-N sample cannot pin.',
    B_gridTruncation:
      'One third of the conjectural I_F mass (INT_3^inf 1/alpha^2 = 1/3) lies beyond the in-repo ' +
      'alpha <= 3 grid ceiling and cannot be read off at all.',
    C_notRigorous:
      'The empirical R2 (KS ~ 0.094) is a finite-N estimate, not a rigorous bound on F, and on the ' +
      'wrong Fourier side; it cannot move the rigorous (2/3, 2) endpoints.',
    unconstrainedPart:
      'The unconstrained part is exactly the alpha >= 1 tail of the form factor F. Narrowing ' +
      '(2/3, 2) to {1} IS the Montgomery pair-correlation conjecture; no finite-N data supplies it.',
  },
  lowerEndpointCoincidence: {
    rigorousLower: IF_LOWER_RH, // 2/3
    conjecturalHeadMass: HEAD_MASS, // ~2/3
    isClaimedIdentity: false,
    note:
      'The rigorous lower endpoint 2/3 numerically equals the grid-visible head INT_1^3 1/alpha^2 = ' +
      '2/3 of the conjectural (F == 1) integrand. Recorded as a coincidence of the alpha = 3 grid ' +
      'ceiling with the endpoint value, NOT a claimed derivation of the 2/3 lower bound.',
  },
  findings: {
    bracketNotNarrowed:
      'The rigorous I_F bracket (2/3 - eps, 2) does not tighten: on [1, inf) RH constrains F only by ' +
      'F >= 0, so I_F is rigorously unconstrained within the bracket.',
    obstructionNamed:
      'Three parts: (A) in-repo data is R2(r), the Fourier dual of F; (B) 1/3 of the conjectural I_F ' +
      'mass lies beyond the alpha <= 3 grid; (C) the empirical R2 is a finite-N estimate, not a bound.',
    conjectureIsTheGap:
      'The alpha >= 1 tail of F is the unconstrained part; pinning it to 1 IS the Montgomery pair-' +
      'correlation conjecture (quantitative twin prime), not something finite-N data can furnish.',
    noCollapse:
      'Because the bracket does not tighten, the imp-95940 crossing range [~5.8e17, ~1.36e28] does ' +
      'not collapse (imp-95987 discipline preserved).',
  },
  isRigorous: false,
  isConjectural: true,
  decision:
    'BRACKET NOT NARROWED, OBSTRUCTION RECORDED. Under RH the form factor F(alpha) is pinned only as ' +
    'F ~ |alpha| on [0,1] and F >= 0 elsewhere; on [1, inf) it is rigorously unconstrained above and ' +
    'below (beyond >= 0), so I_F stays in (2/3 - eps, 2). The in-repo Montgomery/GUE data (imp-1098) ' +
    'cannot narrow it: (A) it is the correlation function R2(r), the Fourier dual of the form factor F ' +
    'that I_F integrates, and reading F just above alpha = 1 needs the large-r tail of R2 a finite-N ' +
    'sample cannot resolve; (B) one third of the conjectural I_F mass lies beyond the alpha <= 3 grid; ' +
    '(C) the empirical R2 (KS ~ 0.094) is a finite-N estimate, not a rigorous bound. Narrowing ' +
    '(2/3, 2) to {1} IS the Montgomery pair-correlation conjecture; the imp-95940 crossing range does ' +
    'not collapse.',
  verdict:
    'ASSESSMENT / BRACKET NOT NARROWED, OBSTRUCTION RECORDED (frontier, NOT rigorous). Under RH, ' +
    'F(alpha) is pinned only as F ~ |alpha| on [0,1] and F >= 0 elsewhere; on [1, inf) it is ' +
    'rigorously unconstrained above and below (beyond >= 0), so the pair-correlation integral ' +
    'I_F = INT_1^inf F(alpha)/alpha^2 stays bracketed in (2/3 - eps, 2) and does not tighten. The ' +
    'in-repo Montgomery/GUE data (imp-1098) cannot narrow it because (A) it is the correlation ' +
    'function R2(r), the Fourier DUAL of the form factor F that I_F integrates, and reading F just ' +
    'above alpha = 1 needs the large-r tail of R2 that a finite-N sample cannot resolve; (B) one third ' +
    'of the conjectural I_F mass (INT_3^inf 1/alpha^2) lies beyond the in-repo alpha <= 3 grid; (C) the ' +
    'empirical R2 (KS ~ 0.094) is a finite-N estimate, not a rigorous bound, and on the wrong Fourier ' +
    'side. The narrowing of (2/3, 2) to {1} IS the Montgomery pair-correlation conjecture (quantitative ' +
    'twin prime); no finite-N form-factor data supplies it. So the imp-95940 crossing range ' +
    '[~5.8e17, ~1.36e28] does not collapse. Assessment only; changes no bound; NO QED; I_F = 1 ' +
    'conjectural (Montgomery pair correlation, bracket (2/3 - eps, 2)); Catalan G irrationality OPEN; ' +
    'Sun arXiv:2609.04176 single-author unrefereed; the zero-side route stays PCC / GRH-gated; ' +
    'no refereed bound is changed.',
  citation:
    'imp-95984 (K = I_F; rigorous bracket (2/3-eps, 2); Chan arXiv:math/0305339 Thm 1.1); imp-96006 ' +
    '(I_F = 1 conditional anchor); imp-1098 (empirical R2(r) vs GUE 1 - sinc^2, KS ~ 0.094); ' +
    'Montgomery 1973 (pair correlation); Dyson 1962 (GUE).',
};

// --- self-executing internal-consistency assertions (live recomputation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the conjectural (F == 1) integrand splits 2/3 (head, in grid) + 1/3 (tail, beyond grid) = 1.
  if (!approx(HEAD_MASS, 2 / 3, 1e-6))
    throw new Error('imp-96025: grid-visible head INT_1^3 1/alpha^2 must equal 2/3');
  if (!approx(TAIL_MASS, 1 / 3, 1e-6))
    throw new Error('imp-96025: beyond-grid tail INT_3^inf 1/alpha^2 must equal 1/3');
  if (!approx(HEAD_MASS + TAIL_MASS, IF_CONJECTURAL, 1e-9))
    throw new Error('imp-96025: head + tail must equal the conjectural I_F = 1');
  // a full third of the conjectural mass lies beyond the in-repo alpha <= 3 grid.
  if (!(TAIL_MASS > 0.3))
    throw new Error('imp-96025: >30% of the conjectural I_F mass must lie beyond the grid ceiling');
  if (!(GRID_VISIBLE_FRACTION < 1))
    throw new Error('imp-96025: the in-repo grid cannot see the full conjectural I_F mass');
  // the conjectural value 1 lies strictly inside the un-narrowed rigorous bracket (2/3, 2).
  if (!(IF_LOWER_RH < IF_CONJECTURAL && IF_CONJECTURAL < IF_UPPER_RH))
    throw new Error('imp-96025: conjectural I_F = 1 must lie inside the rigorous bracket (2/3, 2)');
  if (!approx(BRACKET_WIDTH, 4 / 3, 1e-12))
    throw new Error('imp-96025: rigorous bracket width must be 4/3');
  // NO-NARROWING guard: the bracket flag must stay false (the attempt did not succeed).
  if (IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION.bracket.narrowed !== false)
    throw new Error('imp-96025: bracket must be recorded as NOT narrowed');
  if (IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION.empiricalAttempt.constrainsIF !== false)
    throw new Error('imp-96025: the empirical attempt must be recorded as not constraining I_F');
  // the lower-endpoint coincidence is flagged as NOT a claimed identity.
  if (IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION.lowerEndpointCoincidence.isClaimedIdentity !== false)
    throw new Error('imp-96025: the 2/3 lower-endpoint coincidence must not be claimed as an identity');
  // the empirical R2 plateau sits near (but below) the GUE plateau value 1, with finite-N residual.
  if (!(EMP_R2_PLATEAU_MEAN > 0.9 && EMP_R2_PLATEAU_MEAN < 1))
    throw new Error('imp-96025: empirical R2 plateau mean must sit near (below) the GUE value 1');
  // HONESTY gates: assessment only, conjectural, no false pin, no refereed bound is changed.
  if (IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION.isRigorous !== false)
    throw new Error('imp-96025: isRigorous must be false');
  if (!/NO QED/.test(IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION.verdict))
    throw new Error('imp-96025: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION.verdict))
    throw new Error('imp-96025: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96025_IF_BRACKET_NARROW_ATTEMPT_OBSTRUCTION;
