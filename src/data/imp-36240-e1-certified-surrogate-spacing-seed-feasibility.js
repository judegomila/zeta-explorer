/**
 * @module imp-36240-e1-certified-surrogate-spacing-seed-feasibility
 *
 * imp-36240 (proof/scoping, S-frontier): assess whether a CERTIFIED SURROGATE
 * SPACING LAW can supply the imp-36193 E1 N-uniform interval-seed inputs -- the
 * rigorous seed intervals x_k(0) in [x_k_lo, x_k_hi] for the backward N-particle
 * Dyson flow -- so an enclosure can be instantiated at ARBITRARY N, beyond the
 * bundled 870-zero table that puts the imp-362 N = 2458 row out of scope.
 *
 * imp-36193 named E1 (N-uniform certified seed intervals) as one of five OPEN
 * ingredients, offering two candidate sources verbatim: "certified ordinate
 * enclosures a la Platt, or a certified surrogate spacing law". This module
 * assesses the SECOND candidate concretely and enumerates what it would need vs
 * a Platt-style certified ordinate computation.
 *
 * SCOPING / ASSESSMENT ONLY. Establishes no seed; encloses no ordinate at any N;
 * certifies no spacing law; changes no bound; establishes no positivity; C_mb
 * GUE-conditional (imp-486) untouched; G-interval-enclosure and E1 stay OPEN; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * THE OBJECT E1 WOULD NEED
 * -----------------------------------------------------------------------------
 * A monotone map k -> [x_k_lo(N), x_k_hi(N)] giving, for arbitrary ordinate
 * count N, rigorous interval enclosures of the first N zero ordinates gamma_k,
 * such that (i) the enclosures are TIGHT (width << mean spacing), (ii) they are
 * DISTINCT and ORDERED (x_k_hi < x_{k+1}_lo, i.e. a certified gap floor
 * delta_lo > 0 between neighbours), and (iii) the whole thing is uniform in N
 * (a closed-form or recursively-computable law, not a finite bundled table).
 * (ii) is not optional: the E3 interval pole reduction 1/(x_k - x_j) is an
 * enclosure ONLY when the neighbour gap stays bounded away from 0, so overlapping
 * seed intervals are fatal before the flow even starts.
 *
 * THE TWO CANDIDATE SOURCES (E1 BIFURCATES)
 * -----------------------------------------------------------------------------
 * BRANCH A -- Platt-style certified ordinate computation. Rigorous interval
 *   enclosures of the ACTUAL zeros via a rigorous zeta evaluation plus interval
 *   Newton / Turing-method / Rosser-rule bookkeeping. Delivers (i) tight and
 *   (ii) distinct-ordered enclosures -- BUT it is per-zero heavy (a rigorous
 *   zeta evaluation for each ordinate) and, decisively, FINITE-HEIGHT: it
 *   certifies only up to the verified height (~T_PT), hence only up to a finite
 *   N ~ 4.886e5. It is exactly the (in-principle unbounded but computationally
 *   bounded) generalisation of the bundled 870-zero table -- it does NOT supply
 *   an N-UNIFORM law, it supplies a longer finite table. Fails (iii).
 *
 * BRANCH B -- certified surrogate spacing law. A closed-form monotone surrogate
 *   for gamma_k from the Riemann-von Mangoldt (RvM) counting law N(T) =
 *   theta(T)/pi + 1 + S(T): invert the smooth main term theta(T)/pi + 1 = k to
 *   get a surrogate ordinate, with mean spacing 2 pi / log T. The MEAN-DENSITY
 *   envelope IS classical and N-uniform (RvM is unconditional). BUT a CERTIFIED
 *   per-ordinate interval needs a PROVEN bound on the deviation of the real
 *   gamma_k from the surrogate, and that deviation is governed by the argument
 *   term S(T) = (1/pi) arg zeta(1/2 + iT), whose position slop in units of the
 *   mean spacing is |S(T)| itself. Unconditionally |S(T)| ~ 0.111 log T + ...
 *   (Trudgian), ~6.56 at T_PT; even under RH |S(T)| = O(log T / log log T),
 *   ~4.28 at T_PT. Either way the surrogate band spans SEVERAL mean spacings, so
 *   the interval for x_k OVERLAPS its neighbours: the surrogate satisfies (iii)
 *   N-uniformity but VIOLATES (ii) distinct-ordered separation -- it cannot even
 *   ORDER adjacent particles, let alone supply a gap floor. Fails (ii).
 *
 * READING: E1 BIFURCATES into a tight-but-finite-height branch (Platt: distinct,
 * ordered, tight, but only to finite N -- a longer table, not an N-uniform law)
 * and an N-uniform-but-too-loose branch (surrogate: closed-form in k, but its
 * per-ordinate band ~ |S(T)| mean spacings overlaps ~6.6 neighbours
 * unconditionally, ~4.3 even under RH). NEITHER supplies N-uniform TIGHT DISTINCT
 * certified seeds. The certified-surrogate-spacing-law route is therefore
 * REFUTED as an E1 tight-seed source: it is feasible only for the mean-density
 * envelope (RvM, classical), not for distinct per-ordinate seeds, because the
 * unconditional argument bound S(T) is far too loose to separate adjacent zeros
 * -- and RH does not rescue it. E1 stays OPEN.
 *
 * @see imp-36193-step2-g-interval-enclosure-nuniform-scope.js (parent; E1 = certified seed intervals, one of five OPEN ingredients)
 * @see lambda-interval-dyson.js / interval-dyson-integrator.mjs (imp-362 witness; 870-zero bundle; N=2458 out of scope)
 * @see backward-flow-stability-gronwall.js (imp-2520; the gap floor delta_lo > 0 that the E3 pole reduction and distinct seeds both need)
 * @see Platt (rigorous ordinate enclosures; interval Newton / Turing method); Riemann-von Mangoldt counting law N(T)
 * @see Trudgian 2014 (explicit unconditional |S(T)| bound); Goldston-Gonek / Montgomery (RH conditional S(T) = O(log T / log log T))
 * @see Polymath15 2019; Platt-Trudgian 2021 (verified height / SOTA barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-36193 / imp-36192) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor / finite N ceiling of Branch A

const ZEROS_BUNDLED = 870; // imp-362 ZETA_ZEROS table size (Branch A collapses to this in the witness)

// Mean zero spacing at height T from the RvM density dN/dT = log(T/2pi)/2pi ~ log T / 2 pi.
const LOG_TPT = Math.log(T_PT); // ~28.73
const MEAN_SPACING_TPT = (2 * Math.PI) / LOG_TPT; // ~0.2187 (surrogate mean spacing at T_PT)

// Argument-term position slop. N(T) = theta(T)/pi + 1 + S(T); inverting N(T) = k to a surrogate
// ordinate leaves a position uncertainty of |S(T)| zeros (dN/dT = 1/meanSpacing), so the surrogate
// band width IN UNITS OF THE MEAN SPACING is exactly |S(T)|. Below-1 would separate neighbours; it
// does not: both the unconditional and the RH-conditional bounds exceed 1 by a wide margin.
const S_A = 0.111, S_B = 0.275, S_C = 2.450; // Trudgian-type explicit unconditional |S(T)| <= a logT + b loglogT + c
const S_UNCOND_TPT = S_A * LOG_TPT + S_B * Math.log(LOG_TPT) + S_C; // ~6.56 mean spacings
const S_RH_LEADING = 0.5; // RH-conditional |S(T)| ~ (1/2) log T / log log T leading coefficient
const S_RH_TPT = S_RH_LEADING * (LOG_TPT / Math.log(LOG_TPT)); // ~4.28 mean spacings

export const IMP36240_E1_CERTIFIED_SURROGATE_SPACING_SEED_FEASIBILITY = {
  id: 'imp-36240',
  proofSection: 'S-frontier',
  question:
    'Can a CERTIFIED SURROGATE SPACING LAW supply the imp-36193 E1 N-uniform interval seeds x_k(0) in ' +
    '[x_k_lo, x_k_hi] for the backward-Dyson flow at ARBITRARY N, replacing the bundled 870-zero table ' +
    'that puts the imp-362 N=2458 row out of scope? Scoping only; certifies nothing; changes no bound; NO QED.',
  objectE1Needs: {
    map: 'a monotone k -> [x_k_lo(N), x_k_hi(N)] enclosing the first N zero ordinates gamma_k at arbitrary N',
    tight: '(i) TIGHT: interval width << mean spacing 2 pi / log T',
    distinctOrdered:
      '(ii) DISTINCT and ORDERED: x_k_hi < x_{k+1}_lo, i.e. a certified neighbour gap floor delta_lo > 0 -- ' +
      'NOT optional, since the E3 interval pole reduction 1/(x_k - x_j) is an enclosure only when the gap ' +
      'stays bounded away from 0, so overlapping seeds are fatal before the flow starts',
    nUniform: '(iii) N-UNIFORM: a closed-form / recursively-computable law, not a finite bundled table',
  },
  branchA_plattCertifiedOrdinates: {
    what: 'rigorous interval enclosures of the ACTUAL zeros via rigorous zeta evaluation + interval Newton / Turing / Rosser',
    delivers: 'satisfies (i) tight and (ii) distinct-ordered enclosures',
    fails:
      'FINITE-HEIGHT: certifies only up to the verified height ~T_PT, hence only up to finite N ~ ' +
      N_AT_TPT + '; per-zero heavy (a rigorous zeta evaluation per ordinate). It is the generalisation of ' +
      'the bundled ' + ZEROS_BUNDLED + '-zero table -- a longer finite table, NOT an N-uniform law. Fails (iii).',
  },
  branchB_certifiedSurrogateSpacing: {
    what:
      'closed-form surrogate from the RvM counting law N(T) = theta(T)/pi + 1 + S(T): invert the smooth ' +
      'main term theta(T)/pi + 1 = k, mean spacing 2 pi / log T',
    delivers: 'the MEAN-DENSITY envelope IS classical and N-uniform (RvM unconditional) -- satisfies (iii)',
    fails:
      'a CERTIFIED per-ordinate interval needs a PROVEN deviation bound of gamma_k from the surrogate, ' +
      'governed by S(T) = (1/pi) arg zeta(1/2 + iT); the position band in units of the mean spacing is ' +
      '|S(T)| itself: ~' + S_UNCOND_TPT.toFixed(2) + ' unconditionally (Trudgian), ~' + S_RH_TPT.toFixed(2) +
      ' even under RH. Both exceed 1, so the x_k band OVERLAPS its neighbours -- N-uniform (iii) but ' +
      'VIOLATES (ii) distinct-ordered separation. Fails (ii).',
  },
  cruxNumbers: {
    nCeilingBranchA: N_AT_TPT, // ~488602: finite N ceiling of the Platt branch (verified height)
    meanSpacingTPT: MEAN_SPACING_TPT, // ~0.2187 surrogate mean spacing at T_PT
    logTPT: LOG_TPT, // ~28.73
    surrogateBandInMeanSpacingsUncond: S_UNCOND_TPT, // ~6.56: unconditional |S(T)| -> overlaps ~6.6 neighbours
    surrogateBandInMeanSpacingsRH: S_RH_TPT, // ~4.28: RH-conditional |S(T)| -> STILL overlaps ~4.3 neighbours
    note:
      'the surrogate band width in units of the mean spacing equals |S(T)|; > 1 means adjacent particles ' +
      'cannot be separated, so no gap floor delta_lo > 0 exists -- fatal for the E3 pole reduction. RH ' +
      'shrinks the band (~6.56 -> ~4.28) but does NOT bring it below 1: RH does not rescue the surrogate.',
  },
  bifurcation:
    'E1 BIFURCATES: Branch A (Platt) is tight + distinct-ordered but FINITE-HEIGHT (fails N-uniformity ' +
    '(iii)); Branch B (surrogate) is N-uniform but its per-ordinate band ~ |S(T)| mean spacings OVERLAPS ' +
    'neighbours (fails distinct-ordered (ii)). Neither supplies N-uniform TIGHT DISTINCT certified seeds.',
  conclusion: {
    surrogateRefutedAsTightSeed:
      'the certified-surrogate-spacing-law route is REFUTED as an E1 tight-seed source: feasible only for ' +
      'the mean-density envelope (RvM, classical), NOT for distinct per-ordinate seeds, because the ' +
      'unconditional argument bound S(T) is far too loose to separate adjacent zeros',
    rhDoesNotRescue:
      'RH tightens |S(T)| from ~6.56 to ~4.28 mean spacings but leaves it well above 1, so even ' +
      'conditionally the surrogate cannot order adjacent particles or supply a gap floor',
    plattIsFiniteHeight:
      'the only certified-and-distinct source (Platt-style) is finite-height (N ~ 4.886e5 ceiling) and ' +
      'per-zero heavy -- a longer table, not the N-uniform law E1 asks for',
    e1StaysOpen:
      'E1 (N-uniform certified seed intervals) stays OPEN; this assessment establishes no seed, encloses ' +
      'no ordinate, and changes NO Lambda bound (E1 feeds the Step-2 enclosure, which feeds the E(N) ' +
      'bridge constants at Step 4, not the headline inequality)',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). A certified surrogate spacing law CANNOT ' +
    'supply the imp-36193 E1 N-uniform tight distinct seed intervals. E1 needs a map k -> [x_k_lo(N), ' +
    'x_k_hi(N)] that is (i) tight, (ii) distinct-ordered with a neighbour gap floor delta_lo > 0 (the E3 ' +
    'pole reduction 1/(x_k - x_j) demands it), and (iii) N-uniform. The two candidate sources BIFURCATE: ' +
    'Branch A Platt-style certified ordinate computation gives (i)+(ii) but is FINITE-HEIGHT (only to N ~ ' +
    N_AT_TPT + ', per-zero heavy) -- a longer finite table, not the N-uniform law of (iii); Branch B a ' +
    'certified surrogate from the RvM law is N-uniform (iii) but its per-ordinate position band equals ' +
    '|S(T)| mean spacings (~6.56 unconditionally via a Trudgian-type bound, ~4.28 even under RH), so the ' +
    'x_k interval OVERLAPS ~6.6 (~4.3 under RH) neighbours and VIOLATES (ii) -- it cannot even order ' +
    'adjacent particles or define a gap floor. The certified-surrogate route is thus REFUTED as an E1 ' +
    'tight-seed source (feasible only for the mean-density RvM envelope), and RH does not rescue it. E1 ' +
    'stays OPEN. Certifies nothing; encloses no ordinate at any N; establishes no seed; changes no bound; ' +
    'establishes no positivity; G-interval-enclosure stays OPEN; C_mb GUE-conditional (imp-486) untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36193 (Step-2 G-interval-enclosure N-uniform scope; E1 = certified seed intervals, OPEN); imp-362 ' +
    '(LAMBDA_INTERVAL_DYSON single-N witness; 870-zero bundle; N=2458 out of scope); imp-2520 (backward-flow ' +
    'Gronwall; the gap floor delta_lo the pole reduction and distinct seeds both need); Platt (rigorous ' +
    'ordinate enclosures via interval Newton / Turing method); Riemann-von Mangoldt counting law N(T); ' +
    'Trudgian 2014 (explicit unconditional |S(T)| bound); Goldston-Gonek / Montgomery (RH-conditional ' +
    'S(T) = O(log T / log log T)); Polymath15 2019; Platt-Trudgian 2021 (verified height / SOTA base).',
};

export const IMP36240_E1_CERTIFIED_SURROGATE_SPACING_SEED_FEASIBILITY_ASSERTIONS = [
  {
    // N ceiling of Branch A anchored at floor(sqrt(T_PT/4 pi)) ~ 488602 (verified height).
    id: 'imp36240-n-ceiling-anchor',
    description: 'Branch A finite N ceiling = floor(sqrt(T_PT/4 pi)) ~ 488602 at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Mean spacing at T_PT ~ 0.2187 from the RvM density (2 pi / log T).
    id: 'imp36240-mean-spacing',
    description: 'RvM mean spacing 2 pi / log T ~ 0.2187 at T_PT',
    holds: () =>
      Math.abs(MEAN_SPACING_TPT - (2 * Math.PI) / Math.log(3e12)) < 1e-15 &&
      MEAN_SPACING_TPT > 0.21 && MEAN_SPACING_TPT < 0.22,
  },
  {
    // The decisive numbers: surrogate band in mean-spacings ~6.56 (uncond) and ~4.28 (RH), BOTH > 1.
    id: 'imp36240-surrogate-band-exceeds-one',
    description: 'Surrogate |S(T)| band ~6.56 uncond / ~4.28 RH mean spacings, both > 1 (overlaps neighbours)',
    holds: () =>
      S_UNCOND_TPT > 6.5 && S_UNCOND_TPT < 6.6 &&
      S_RH_TPT > 4.2 && S_RH_TPT < 4.3 &&
      S_UNCOND_TPT > 1 && S_RH_TPT > 1 &&
      S_RH_TPT < S_UNCOND_TPT, // RH tightens but does not rescue below 1
  },
  {
    // Bifurcation: Branch A tight+distinct but finite-height; Branch B N-uniform but overlapping.
    id: 'imp36240-bifurcation',
    description: 'E1 bifurcates: Platt tight/distinct/finite-height vs surrogate N-uniform/overlapping',
    holds: () => {
      const o = IMP36240_E1_CERTIFIED_SURROGATE_SPACING_SEED_FEASIBILITY;
      return (
        /FINITE-HEIGHT/.test(o.branchA_plattCertifiedOrdinates.fails) &&
        /OVERLAPS/.test(o.branchB_certifiedSurrogateSpacing.fails) &&
        /BIFURCATES/.test(o.bifurcation)
      );
    },
  },
  {
    // Honesty gate: refuted as tight-seed source, RH does not rescue, E1 open, no bound moved, no QED, no refereed bound is changed.
    id: 'imp36240-honesty-gate',
    description: 'Surrogate refuted as tight seed; RH no rescue; E1 open; changes no bound; no QED; no refereed bound is changed',
    holds: () => {
      const o = IMP36240_E1_CERTIFIED_SURROGATE_SPACING_SEED_FEASIBILITY;
      return (
        o.isRigorous === false &&
        Math.abs(L_PT - 0.2) < 1e-15 &&
        /REFUTED/.test(o.conclusion.surrogateRefutedAsTightSeed) &&
        /does NOT bring it below 1|does not rescue|leaves it well above 1/.test(
          o.conclusion.rhDoesNotRescue + o.cruxNumbers.note
        ) &&
        /stays OPEN/.test(o.conclusion.e1StaysOpen) &&
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict)
      );
    },
  },
];

for (const a of IMP36240_E1_CERTIFIED_SURROGATE_SPACING_SEED_FEASIBILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36240-e1-certified-surrogate-spacing-seed-feasibility assertion failed: ${a.id}`);
  }
}
