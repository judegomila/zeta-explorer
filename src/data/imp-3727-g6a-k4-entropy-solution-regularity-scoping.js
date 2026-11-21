/**
 * @module imp-3727-g6a-k4-entropy-solution-regularity-scoping
 *
 * imp-3727 (proof, frontier-direction): SCOPE the imp-3714 candidate construction K4 -- what a
 * Burgers / Calogero-Moser ENTROPY-SOLUTION spatial-regularity estimate for the collision-time field
 * tau_c(x) would need as hypotheses to certify the open G6a_shock_lipschitz Hoelder-1/2 modulus C_Lip
 *   |tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2}
 * WITHOUT routing through the mesoscopic Gronwall floor. imp-3714 enumerated four candidate modulus
 * constructions; K4 is the ONE route that bypasses BOTH imp-3671 obstructions (S1 wrong type, S2 wrong
 * scale) by NOT being a reading of an existing mesoscopic field -- but imp-3714 flagged it WHOLLY NEW:
 * the repo contains no such regularity estimate. This module drills K4: it enumerates the hypotheses a
 * scalar-conservation-law regularity argument would require, checks which are already available from the
 * imp-3642 direct Calogero-Moser / Dyson RK4 flow machinery, and states honestly the gap between the repo
 * ingredients and an admissible C_Lip certificate. Literature-anchored scoping / derivation only; no
 * estimate shipped, no bridge closure, NO QED.
 *
 * THE PDE PICTURE K4 WOULD LIVE IN (literature anchor)
 * ----------------------------------------------------
 * The continuum limit of the attractive Dyson / Calogero-Moser gas dx_k/ds = -2 sum_{j} 1/(x_k - x_j)
 * is governed by the empirical Stieltjes transform m(z, s) = integral rho(x, s)/(x - z) dx, which under
 * the free-convolution / Dyson flow satisfies the COMPLEX INVISCID BURGERS equation
 *   partial_s m + m partial_z m = 0        (Biane / Voiculescu free-probability form; see also Menon-Pego,
 *                                            Rogers-Shi, Matytsin for the log-gas hydrodynamic limit).
 * Its real-line reduction is the scalar conservation law u_s + f(u)_x = 0 with a genuinely-nonlinear
 * (convex) flux; characteristics x + s v(x) are straight lines that CROSS, and the first crossing is the
 * SHOCK. The collision-time field tau_c(x) is exactly the first-crossing / caustic-envelope functional of
 * this flow: tau_c(x) = inf { s : the characteristic through x has entered a shock by time s }. So a
 * spatial-regularity estimate on tau_c(x) is, in the entropy-solution language, a regularity estimate on
 * the SHOCK-FORMATION / caustic map of a genuinely-nonlinear scalar conservation law -- a classical object
 * (Lax, Oleinik, Kruzhkov, Dafermos; Arnold caustic classification; Bec-Khanin Burgers-turbulence review).
 *
 * WHERE THE 1/2 EXPONENT WOULD COME FROM (literature anchor, NOT derived here)
 * ---------------------------------------------------------------------------
 * For a genuinely-nonlinear scalar law the GENERIC first singularity is a FOLD (A_2) of the Lagrangian
 * characteristic map, whose caustic branch opens as a SQUARE ROOT -- this is the structural origin of a
 * Hoelder-1/2 modulus for the first-crossing-time field near a fold point. (A higher-codimension cusp A_3,
 * the cube-root pre-shock u ~ x^{1/3}, would give a DIFFERENT local exponent, so the 1/2 is exponent is
 * tied to controlling the caustic TYPE, hypothesis H5 below -- it is not automatic.) This module does NOT
 * derive the exponent; it only records which hypotheses an argument that yields it must assume.
 *
 * THE HYPOTHESES SUCH AN ARGUMENT REQUIRES, ENUMERATED
 * ----------------------------------------------------
 *   H1 CONSERVATION-LAW / HAMILTON-JACOBI STRUCTURE FOR tau_c. tau_c(x) must be expressed as a first-crossing
 *      (caustic-envelope) functional of an entropy solution to a scalar conservation law u_s + f(u)_x = 0
 *      (equivalently the Hopf-Lax value function of a Hamilton-Jacobi equation). Without this the entropy /
 *      Oleinik / Kruzhkov machinery has nothing to act on.
 *   H2 GENUINE NONLINEARITY / CONVEX FLUX. The flux f must be uniformly convex (f'' bounded away from 0) so
 *      that Oleinik one-sided decay and Lax admissibility apply; this is the free-Burgers / semicircle
 *      genuine-nonlinearity property of the log-gas hydrodynamic flux.
 *   H3 ENTROPY ADMISSIBILITY (Lax / Kruzhkov). The relevant weak solution must be the UNIQUE entropy solution
 *      (characteristics enter shocks, never leave); only for it is the shock set a rectifiable curve and the
 *      first-crossing time well-defined and stable.
 *   H4 BV / OLEINIK ONE-SIDED (SEMICONCAVITY) BOUND. The core regularity input: the Oleinik one-sided
 *      inequality u_x(., s) <= 1/s (equivalently semiconcavity of the Hopf-Lax value function), which gives
 *      BV control of u and, at a fold, the square-root opening of the caustic that furnishes the 1/2 modulus.
 *   H5 CAUSTIC-TYPE CONTROL FOR THE 1/2 EXPONENT. The shock set must be shown to consist (along the relevant
 *      range of separations) of fold (A_2) points, so the local exponent is exactly 1/2 and not the A_3
 *      cusp exponent; this is what upgrades "some Hoelder modulus" to "Hoelder-1/2".
 *   H6 CHARACTERISTIC-SPEED / RANKINE-HUGONIOT CONTROL. Bounded characteristic speed v(x) and bounded shock
 *      speed (Rankine-Hugoniot with bounded flux), so the Lagrangian-to-Eulerian map is Lipschitz-invertible
 *      away from caustics and the modulus can be read across a RANGE of separations |x - x_prime| (this is
 *      the two-point x-difference structure imp-3714 REQ-i also demands, here supplied by the PDE flow map).
 *
 * WHICH HYPOTHESES ARE ALREADY AVAILABLE FROM THE imp-3642 CM-FLOW MACHINERY
 * -------------------------------------------------------------------------
 * imp-3642 supplies the DISCRETE attractive CM / Dyson flow dx_k/ds = -2 sum 1/(x_k - x_j), integrated by
 * RK4 on a seeded mesoscopic gas, and MEASURES the density floor V0 (shape 1/log gamma). Mapping that onto
 * H1-H6:
 *   - H6 (characteristic speed) is PARTIAL: the RK4 integrator advances the per-particle x_k, so the DISCRETE
 *     characteristic map is computed and its speeds are bounded numerically -- but no CONTINUUM Lipschitz
 *     shock-speed / Rankine-Hugoniot bound is derived.
 *   - H2 (genuine nonlinearity) is LATENT: the complex-Burgers structure with convex effective flux is the
 *     standard hydrodynamic limit of exactly this flow, but the repo NEVER writes the continuum PDE nor
 *     certifies f'' bounded below.
 *   - H1, H3, H4, H5 are ABSENT: the repo has no conservation-law formulation of tau_c(x) (H1), no entropy-
 *     admissibility statement (H3), no Oleinik one-sided / semiconcavity estimate (H4 -- and note the ONLY
 *     one-sided bound the repo owns, the imp-2520 Lemma B Gronwall floor, is the mesoscopic mechanism K4 is
 *     meant to BYPASS, so it does not discharge H4), and no caustic-type (fold vs cusp) classification (H5).
 *
 * THE HONEST GAP
 * --------------
 * K4 does bypass both imp-3671 obstructions -- it is not a reading of the strip-sup V0 scalar (dodging S1)
 * and it does not evaluate the mesoscopic Gronwall floor at the g_k -> 0 nearest-pair scale (dodging S2) --
 * but the price is that it must import an ENTIRE scalar-conservation-law regularity apparatus that the repo
 * does not possess. Of the six required hypotheses, exactly ONE (H6, characteristic-speed control) is even
 * partially present (as the discrete RK4 map), ONE (H2, genuine nonlinearity) is latent in the flow's known
 * hydrodynamic limit but unwritten, and FOUR (H1 conservation-law structure for tau_c, H3 entropy
 * admissibility, H4 the Oleinik one-sided / semiconcavity bound, H5 fold caustic-type control) are wholly
 * absent. Crucially the repo's single existing one-sided estimate is the Gronwall floor K4 is defined to
 * avoid, so it cannot be recycled to cover H4. So the gap between repo ingredients and an admissible C_Lip
 * certificate along the K4 route is essentially the whole Burgers/CM entropy-solution regularity theory
 * (Oleinik/Kruzhkov/Hopf-Lax semiconcavity plus Arnold fold-caustic classification); the imp-3642 machinery
 * contributes only the discrete characteristic map. K4 is therefore confirmed WHOLLY NEW, consistent with
 * the imp-3714 verdict, and G6a_shock_lipschitz stays OPEN. Literature-anchored scoping / derivation only;
 * no estimate shipped, no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3714-g6a-modulus-object-requirements (parent: enumerates K4 as bypassing both obstructions, marks it NEW)
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (names both S1 type and S2 scale obstructions)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (the mesoscopic Gronwall floor K4 is defined to bypass)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (direct RK4 attractive-Dyson flow; supplies the discrete map only)
 * @see backward-flow-stability-gronwall (imp-2520 Lemma B/C: the one-sided floor that CANNOT discharge H4 here)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// The hypotheses a Burgers / CM entropy-solution spatial-regularity argument for tau_c(x) would require,
// each tagged with its availability from the imp-3642 CM-flow machinery.
const HYPOTHESES = [
  {
    id: 'H1',
    name: 'conservation-law / Hamilton-Jacobi structure for tau_c',
    statement:
      'tau_c(x) expressed as a first-crossing (caustic-envelope) functional of an entropy solution to a ' +
      'scalar conservation law u_s + f(u)_x = 0 (equivalently the Hopf-Lax value function).',
    availability: 'absent',
    repoNote: 'repo carries the discrete flow but no continuum conservation-law formulation of tau_c(x)',
  },
  {
    id: 'H2',
    name: 'genuine nonlinearity / convex flux',
    statement:
      'flux f uniformly convex (f_prime_prime bounded away from 0) -- the free-Burgers / semicircle ' +
      'genuine-nonlinearity of the log-gas hydrodynamic flux -- so Oleinik decay and Lax admissibility apply.',
    availability: 'latent',
    repoNote: 'the complex-Burgers hydrodynamic limit of the imp-3642 flow is standard but never written / certified',
  },
  {
    id: 'H3',
    name: 'entropy admissibility (Lax / Kruzhkov)',
    statement:
      'the weak solution is the unique entropy solution (characteristics enter shocks, never leave), so the ' +
      'shock set is rectifiable and the first-crossing time well-defined and stable.',
    availability: 'absent',
    repoNote: 'no entropy-admissibility statement in the repo',
  },
  {
    id: 'H4',
    name: 'BV / Oleinik one-sided (semiconcavity) bound',
    statement:
      'the Oleinik one-sided inequality u_x(., s) <= 1/s (semiconcavity of the Hopf-Lax value function), the ' +
      'core input giving BV control and the square-root caustic opening behind the 1/2 modulus.',
    availability: 'absent',
    repoNote:
      'the ONLY one-sided bound the repo owns is the imp-2520 Lemma B Gronwall floor -- the mesoscopic ' +
      'mechanism K4 is defined to BYPASS -- so it cannot be recycled to discharge H4',
  },
  {
    id: 'H5',
    name: 'caustic-type control for the 1/2 exponent',
    statement:
      'the shock set consists of fold (A_2) points along the relevant separation range, so the local exponent ' +
      'is exactly 1/2 and not the A_3 cusp (cube-root pre-shock) exponent.',
    availability: 'absent',
    repoNote: 'no caustic-type (fold vs cusp) classification in the repo',
  },
  {
    id: 'H6',
    name: 'characteristic-speed / Rankine-Hugoniot control',
    statement:
      'bounded characteristic and shock speeds (Rankine-Hugoniot with bounded flux) so the ' +
      'Lagrangian-to-Eulerian map is Lipschitz-invertible away from caustics and the modulus reads across a ' +
      'range of separations |x - x_prime| (supplying the imp-3714 REQ-i two-point x-difference structure).',
    availability: 'partial',
    repoNote:
      'the imp-3642 RK4 advances the per-particle x_k so the DISCRETE characteristic map and its speeds are ' +
      'computed, but no continuum Lipschitz shock-speed / Rankine-Hugoniot bound is derived',
  },
];

const AVAILABILITY_TALLY = {
  partial: HYPOTHESES.filter((h) => h.availability === 'partial').map((h) => h.id), // ['H6']
  latent: HYPOTHESES.filter((h) => h.availability === 'latent').map((h) => h.id), // ['H2']
  absent: HYPOTHESES.filter((h) => h.availability === 'absent').map((h) => h.id), // ['H1','H3','H4','H5']
};

// The single existing one-sided bound the repo owns (the Gronwall floor) is exactly what K4 must avoid,
// so it does NOT discharge the Oleinik/semiconcavity hypothesis H4.
const GRONWALL_FLOOR_CANNOT_COVER_H4 = true;

export const IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING = {
  id: 'imp-3727',
  proofSection: 'S-frontier',
  question:
    'What hypotheses would a Burgers / Calogero-Moser entropy-solution spatial-regularity argument for the ' +
    'collision-time field tau_c(x) require to certify the G6a_shock_lipschitz Hoelder-1/2 modulus C_Lip ' +
    'WITHOUT routing through the mesoscopic Gronwall floor, and which are already available from the ' +
    'imp-3642 CM-flow machinery? Literature-anchored scoping / derivation only, no estimate, no QED.',
  candidate: 'K4',
  parentCandidateStatus: 'new', // imp-3714 marked K4 NEW: no ingredients present in repo
  hypotheses: HYPOTHESES,
  availabilityTally: AVAILABILITY_TALLY,
  gronwallFloorCannotCoverH4: GRONWALL_FLOOR_CANNOT_COVER_H4,
  pdeStructure:
    'continuum limit of the attractive Dyson / CM flow -> complex inviscid Burgers partial_s m + m partial_z m = 0 ' +
    '(free-probability / Menon-Pego log-gas hydrodynamics); tau_c(x) = first-crossing / caustic-envelope time of ' +
    'a genuinely-nonlinear scalar conservation law.',
  exponentOrigin:
    'a genuine-nonlinearity fold (A_2) caustic opens as a square root -> Hoelder-1/2; an A_3 cusp (cube-root ' +
    'pre-shock) gives a different exponent, so the 1/2 requires caustic-type control (H5). Exponent NOT derived here.',
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'SCOPING / DERIVATION (frontier-direction, NOT rigorous): K4 -- a direct Burgers / CM entropy-solution ' +
    'Hoelder-1/2 regularity bound on the collision-time field tau_c(x) -- lives in the complex inviscid Burgers ' +
    'hydrodynamic limit of the attractive Dyson / CM flow, where tau_c(x) is the first-crossing (caustic-envelope) ' +
    'time of a genuinely-nonlinear scalar conservation law and the 1/2 exponent is the square-root opening of a ' +
    'generic fold (A_2) caustic. Such an argument requires SIX hypotheses: H1 a conservation-law / Hamilton-Jacobi ' +
    'structure for tau_c, H2 genuine nonlinearity (convex flux), H3 entropy admissibility (Lax / Kruzhkov), H4 the ' +
    'Oleinik one-sided / semiconcavity BV bound, H5 fold caustic-type control fixing the 1/2 exponent, and H6 ' +
    'characteristic-speed / Rankine-Hugoniot control. Against the imp-3642 CM-flow machinery: only H6 is even ' +
    'PARTIAL (the RK4 map computes discrete characteristic speeds, but no continuum Lipschitz shock-speed bound), ' +
    'H2 is LATENT (the complex-Burgers limit is standard but unwritten / uncertified), and H1, H3, H4, H5 are ' +
    'ABSENT. Crucially the ONLY one-sided estimate the repo owns is the imp-2520 Lemma B Gronwall floor -- the ' +
    'mesoscopic mechanism K4 is defined to BYPASS -- so it cannot be recycled to discharge H4. The gap between repo ' +
    'ingredients and an admissible C_Lip certificate along K4 is therefore essentially the whole Burgers/CM ' +
    'entropy-solution regularity theory (Oleinik/Kruzhkov/Hopf-Lax semiconcavity plus Arnold fold-caustic ' +
    'classification); the imp-3642 machinery contributes only the discrete characteristic map. K4 is confirmed ' +
    'WHOLLY NEW, consistent with the imp-3714 verdict, and G6a_shock_lipschitz stays OPEN. Literature-anchored ' +
    'scoping / derivation only; no estimate shipped, no positivity, no bridge closure, no RH claim, NO QED. ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3714 (parent: enumerates K4 as the entropy-solution route bypassing both obstructions, marks it NEW); ' +
    'imp-3671 (S1 type / S2 scale obstructions); imp-3708 (the mesoscopic Gronwall floor K4 bypasses); ' +
    'imp-3642 (direct RK4 attractive-Dyson flow, supplies only the discrete characteristic map); ' +
    'literature: Lax / Oleinik / Kruzhkov entropy-solution theory, Hopf-Lax semiconcavity, Arnold caustic ' +
    '(A_2 fold / A_3 cusp) classification, Menon-Pego / Biane complex-Burgers log-gas hydrodynamics, ' +
    'Bec-Khanin Burgers-turbulence review; lambda-roadmap Step 4 (Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING_ASSERTIONS = [
  {
    // Exactly six hypotheses are enumerated, tagged H1..H6.
    id: 'imp3727-six-hypotheses-enumerated',
    description: 'six hypotheses H1..H6 are enumerated for the K4 entropy-solution route',
    holds: () =>
      HYPOTHESES.length === 6 &&
      HYPOTHESES.map((h) => h.id).join(',') === 'H1,H2,H3,H4,H5,H6',
  },
  {
    // Availability tally: one partial (H6), one latent (H2), four absent (H1,H3,H4,H5).
    id: 'imp3727-availability-tally',
    description: 'H6 partial, H2 latent, and H1/H3/H4/H5 absent from the imp-3642 machinery',
    holds: () =>
      AVAILABILITY_TALLY.partial.join(',') === 'H6' &&
      AVAILABILITY_TALLY.latent.join(',') === 'H2' &&
      AVAILABILITY_TALLY.absent.join(',') === 'H1,H3,H4,H5',
  },
  {
    // The repo Gronwall floor cannot discharge H4 -- it is the very mechanism K4 must bypass.
    id: 'imp3727-gronwall-floor-cannot-cover-h4',
    description: 'the imp-2520 Gronwall floor is the mechanism K4 bypasses, so it cannot discharge H4',
    holds: () =>
      GRONWALL_FLOOR_CANNOT_COVER_H4 === true &&
      HYPOTHESES.find((h) => h.id === 'H4').availability === 'absent' &&
      /BYPASS/.test(HYPOTHESES.find((h) => h.id === 'H4').repoNote),
  },
  {
    // K4 is confirmed wholly new (consistent with imp-3714) -- no hypothesis is fully available.
    id: 'imp3727-k4-confirmed-wholly-new',
    description: 'K4 confirmed wholly new: no hypothesis is fully available from the repo',
    holds: () =>
      IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.k4ConfirmedWhollyNew === true &&
      IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.parentCandidateStatus === 'new' &&
      HYPOTHESES.every((h) => h.availability !== 'available'),
  },
  {
    // Honesty gate: scoping only, no QED, no refereed bound is changed, imp-3066 untouched, G6a still open.
    id: 'imp3727-honesty-gate-no-qed',
    description: 'scoping/derivation only: no QED, no refereed bound is changed, imp-3066 untouched, G6a open',
    holds: () =>
      IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.isRigorous === false &&
      IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.g6aStillOpen === true &&
      /NO QED/.test(IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING.verdict),
  },
];

for (const a of IMP3727_G6A_K4_ENTROPY_SOLUTION_REGULARITY_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3727-g6a-k4-entropy-solution-regularity-scoping assertion failed: ${a.id}`);
  }
}
