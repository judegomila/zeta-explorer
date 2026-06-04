/**
 * @module imp-2432-phillips-sarnak-cuspidal-density-gap
 * @fileoverview imp-2432 - Wave-2 numerical follow-on to the imp-1297 NEGATIVE
 *   verdict on the Selberg-trace route to bypassing Montgomery PCC.
 *
 *   GOAL (from the ticket)
 *   ----------------------
 *   Numerically estimate the cuspidal eigenvalue density for SL(2, Z) \ H and
 *   quantify EXACTLY how much stronger-than-known the Phillips-Sarnak
 *   conjectural cuspidal density would need to be for the Selberg-trace 2-point
 *   route to MATCH the Montgomery PCC bound on the ESY-closure test function.
 *   Report the gap as a CONCRETE FACTOR.
 *
 *   PARENT
 *   ------
 *   imp-1297 (src/data/imp-1297-selberg-trace-pcc-route.js) classified the
 *   Selberg-trace route as
 *     VERDICT: selberg-requires-cuspidal-density-conjecture.
 *   Its Section C, question (b), established the load-bearing analytic fact this
 *   ticket quantifies: in the (sigma greater than 1) Fourier-support regime where
 *   the ESY-closure Poisson kernel lives, the trace-formula 2-point bound DEGRADES
 *   relative to Montgomery PCC by a multiplicative factor (log T)^(1/2), arising
 *   from the elliptic + parabolic geometric-side contributions that interfere
 *   with the cuspidal spectral sum.
 *
 *   HEADLINE NUMBER
 *   ---------------
 *   The Phillips-Sarnak cuspidal density would have to EXCEED the Weyl law by a
 *   factor (log T)^(1/2) to close the gap. At the heights of interest this is a
 *   concrete factor of roughly 2.1x (T = 1e2) growing to 5.3x (T = 1e12) and
 *   DIVERGING as T -> infinity. Because the Weyl law for SL(2, Z) \ H is an
 *   asymptotic EQUALITY (Selberg / Hejhal), and its known secondary correction
 *   is NEGATIVE (the continuous-spectrum winding subtracts order T log T), NO
 *   such enhancement is available: the cuspidal density sits AT or slightly
 *   BELOW the leading Weyl term, never above it. The required factor therefore
 *   cannot be supplied at any height, and the deficit grows without bound.
 *
 *   VERDICT: cuspidal-density-gap-quantified-unbridgeable
 *
 *   This SHARPENS (does not overturn) the imp-1297 negative verdict: the
 *   Selberg-trace route is not merely "waiting on a near-miss input" -- the
 *   input it would need (cuspidal density a growing factor above Weyl) is
 *   forbidden by the Weyl law itself.
 *
 *   HONEST SCOPE
 *   ------------
 *   - This is a NUMERICAL quantification of an analytic gap already identified
 *     in imp-1297. It is NOT a new closure and NOT a new unconditional bound.
 *   - The (log T)^(1/2) degradation factor is imported from imp-1297 Section C
 *     (Iwaniec-Sarnak 2000 trace-formula admissibility); this file does not
 *     re-derive it, it quantifies its consequence for the density requirement.
 *   - The Weyl-law density numbers are the standard Selberg / Hejhal asymptotic
 *     for the modular surface; the secondary term is kept to its leading order
 *     and sign (order T log T, negative) rather than an exact constant.
 *
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *
 *   Ticket: imp-2432 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - WEYL-LAW CUSPIDAL EIGENVALUE DENSITY FOR SL(2, Z) \ H.
// =========================================================================
//
// Laplace eigenvalues lambda = 1/4 + r^2 on X = SL(2, Z) \ H. The cuspidal
// counting function (Selberg / Hejhal "Eigenvalues of the Laplacian for
// PSL(2, Z)", LNM 1001) obeys Weyl's law
//
//   N_cusp(T) = #{ r_j cuspidal : 0 < r_j <= T }
//             = (Area(X) / (4 pi)) T^2  -  (T / pi) log T  +  c T  +  O(T / log T)
//
// with Area(X) = pi / 3, so the leading coefficient is (pi/3)/(4 pi) = 1/12:
//
//   N_cusp(T) ~ T^2 / 12.
//
// Two facts make this a genuine, two-sided EQUALITY rather than a one-sided
// lower bound (this is the crux of the gap argument):
//   (i)  SL(2, Z) is arithmetic, so the cusp forms are abundant and Weyl's
//        law is PROVEN here (unlike the generic cofinite surface where
//        Phillips-Sarnak shows cusp forms can dissolve under deformation).
//   (ii) The secondary term is NEGATIVE: the continuous-spectrum winding
//        M(T) = -(1/(4 pi)) integral_{-T}^{T} phi prime / phi (1/2 + i r) dr
//        contributes order +(T/pi) log T to the COMBINED count, so the
//        discrete cuspidal count sits at or slightly BELOW the leading
//        T^2 / 12 term, never above it.
//
// Local density (eigenvalues per unit r near height T):
//
//   n_cusp(T) = d N_cusp / d T  ~  (Area / (2 pi)) T  =  T / 6.

const AREA_OVER_4PI = (Math.PI / 3) / (4 * Math.PI); // = 1/12

function weylLeadingCount(T) {
  return AREA_OVER_4PI * T * T;
}

function weylSecondaryTerm(T) {
  // Leading secondary correction, sign NEGATIVE (continuous-spectrum winding).
  return -(T / Math.PI) * Math.log(T);
}

function weylLocalDensity(T) {
  // d/dT of the leading term: 2 * (1/12) * T = T / 6.
  return 2 * AREA_OVER_4PI * T;
}

// =========================================================================
// SECTION B - THE PCC-MATCHING REQUIREMENT.
// =========================================================================
//
// imp-1297 Section C(b): on the ESY-closure Poisson-kernel test function
// (Fourier support sigma greater than 1), the Selberg-trace 2-point bound is
// weaker than Montgomery PCC by a multiplicative factor (log T)^(1/2). The
// trace-route bound has the right RATE (matching Selberg 1944 mean-square) but
// loses the sharp sine-kernel SHAPE, and the loss is exactly (log T)^(1/2).
//
// The trace-route 2-point bound scales linearly with the available cuspidal
// spectral mass in the height-T window (the spectral side is a sum over the
// cuspidal r_j). Hence to COMPENSATE the (log T)^(1/2) loss and match PCC, the
// cuspidal density would have to be larger than the Weyl law by precisely
//
//   g_match(T) = (log T)^(1/2).
//
// This is the "concrete factor" the ticket asks for. The "available" excess
// over Weyl is 1 (no excess: Weyl is an equality with a negative correction),
// so the DEFICIT equals g_match(T) itself.

function requiredDensityFactor(T) {
  return Math.sqrt(Math.log(T));
}

// =========================================================================
// SECTION C - NUMERICAL TABLE: THE GAP AS A CONCRETE FACTOR.
// =========================================================================
//
// Heights T are Maass spectral parameters; under the arithmetic-quantum-chaos
// heuristic these match zeta-zero ordinates gamma at the same height. We span
// the project-relevant range (the ESY-closure works at zero-ordinate heights
// from ~1e2 up to the limits of the project's zero tables).

const SAMPLE_HEIGHTS = Object.freeze([1e2, 1e3, 1e6, 1e9, 1e12]);

function buildGapRow(T) {
  const lead = weylLeadingCount(T);
  const sec = weylSecondaryTerm(T);
  const required = requiredDensityFactor(T);
  return Object.freeze({
    T,
    logT: Math.log(T),
    weylCuspCountLeading: lead,
    weylSecondaryTerm: sec,
    // Actual cuspidal count is leading + (negative) secondary -> below leading.
    weylCuspCountWithCorrection: lead + sec,
    localDensityPerUnitR: weylLocalDensity(T),
    // Available multiplicative excess of cuspidal density over Weyl leading:
    // none (Weyl is an equality, secondary term is negative).
    availableExcessOverWeyl: 1.0,
    // Concrete factor by which density would need to EXCEED Weyl to match PCC.
    requiredExcessToMatchPCC: required,
    // Deficit = required / available.
    deficitFactor: required / 1.0,
  });
}

const GAP_TABLE = Object.freeze(SAMPLE_HEIGHTS.map(buildGapRow));

// Convenience scalars (rounded) for the headline.
const GAP_AT_1E2 = requiredDensityFactor(1e2);   // ~2.146
const GAP_AT_1E6 = requiredDensityFactor(1e6);   // ~3.717
const GAP_AT_1E12 = requiredDensityFactor(1e12); // ~5.257

// =========================================================================
// SECTION D - WHY THE GAP IS UNBRIDGEABLE (NOT A NEAR-MISS).
// =========================================================================
//
// The ticket frames the question as "how much stronger-than-known would the
// Phillips-Sarnak conjectural density need to be". The quantified answer:
//
//   - A factor (log T)^(1/2) STRONGER than the Weyl law, at every height T.
//   - This factor DIVERGES as T -> infinity (slowly, but without bound).
//   - Crucially the Weyl law is an asymptotic EQUALITY for the arithmetic
//     surface SL(2, Z) \ H, and its secondary correction is NEGATIVE. So the
//     cuspidal density CANNOT exceed the Weyl leading term by any growing
//     factor -- the ceiling is exactly the Weyl term.
//
// Therefore the requirement is not a "near-miss" that a sharper Phillips-Sarnak
// statement might one day supply. It is FORBIDDEN by the Weyl law itself: you
// would need more cuspidal eigenvalues in a window than the surface has. The
// imp-1297 verdict "requires cuspidal density conjecture" is sharpened to
// "requires a cuspidal density that the Weyl law proves does not exist".

const GAP_INTERPRETATION = Object.freeze({
  requiredFactorForm: '(log T)^(1/2)',
  requiredFactorDiverges: true,
  weylIsAsymptoticEquality: true,
  weylSecondaryTermSign: 'negative (continuous-spectrum winding subtracts)',
  availableExcessOverWeyl: 1.0,
  conclusion:
    'The cuspidal density would need to exceed the Weyl law by a DIVERGING ' +
    'factor (log T)^(1/2). Since the Weyl law is an asymptotic equality with a ' +
    'negative secondary correction, no such excess exists at any height. The ' +
    'gap is unbridgeable, not a near-miss.',
  sharpensImp1297:
    'imp-1297 verdict selberg-requires-cuspidal-density-conjecture is sharpened: ' +
    'the needed density is forbidden by the Weyl law, so the trace route is ' +
    'hopeless rather than merely conjectural.',
});

// =========================================================================
// SECTION E - EXPORTED RECORD.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'cuspidal-density-gap-quantified-unbridgeable',
  'cuspidal-density-gap-quantified-near-miss',
  'cuspidal-density-route-reopened',
  'approach-eliminated',
]);

const VERDICT = 'cuspidal-density-gap-quantified-unbridgeable';

export const IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP = Object.freeze({
  id: 'imp-2432-phillips-sarnak-cuspidal-density-gap',
  ticket: 'imp-2432',
  category: 'numerical',
  builtAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze(['imp-1297', 'imp-1184', 'imp-1247']),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,

  weylLaw: Object.freeze({
    surface: 'SL(2, Z) \\ H',
    area: 'pi / 3',
    leadingCoefficient: AREA_OVER_4PI, // 1/12
    countingLaw: 'N_cusp(T) ~ T^2 / 12 - (T / pi) log T + c T + O(T / log T)',
    localDensity: 'n_cusp(T) ~ T / 6',
    isAsymptoticEquality: true,
    secondaryTermSign: 'negative',
  }),

  pccMatchingRequirement: Object.freeze({
    traceRouteDegradationFactor: '(log T)^(1/2)',
    degradationSource:
      'imp-1297 Section C(b): elliptic + parabolic geometric-side terms in the ' +
      'sigma greater than 1 regime where the ESY-closure Poisson kernel lives',
    requiredDensityExcessOverWeyl: '(log T)^(1/2)',
  }),

  gapTable: GAP_TABLE,
  concreteFactors: Object.freeze({
    at_T_1e2: GAP_AT_1E2,
    at_T_1e6: GAP_AT_1E6,
    at_T_1e12: GAP_AT_1E12,
  }),

  interpretation: GAP_INTERPRETATION,

  honestScope: Object.freeze([
    'NUMERICAL quantification of the cuspidal-density gap identified in imp-1297; ' +
    'NOT a new closure or unconditional bound.',
    'The concrete gap factor is (log T)^(1/2): about 2.1x at T = 1e2, 3.7x at ' +
    'T = 1e6, 5.3x at T = 1e12, diverging as T -> infinity.',
    'The (log T)^(1/2) trace-route degradation factor is imported from imp-1297 ' +
    'Section C(b) (Iwaniec-Sarnak 2000), not re-derived here.',
    'The gap is UNBRIDGEABLE: the Weyl law for SL(2, Z) \\ H is an asymptotic ' +
    'equality with a NEGATIVE secondary correction, so the cuspidal density ' +
    'cannot exceed its leading term by any growing factor.',
    'This SHARPENS the imp-1297 negative verdict (selberg-requires-cuspidal-' +
    'density-conjecture) into selberg-route-density-forbidden-by-Weyl-law.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    hejhal1983:
      'Hejhal, "The Selberg Trace Formula for PSL(2, R) Vol. 2", ' +
      'Lecture Notes in Math. 1001, Springer 1983 (Weyl law for the modular surface)',
    iwaniec2002:
      'Iwaniec, "Spectral Methods of Automorphic Forms", 2nd ed., AMS GSM 53, 2002, ch. 11 (Weyl law)',
    iwaniecSarnak2000:
      'Iwaniec, Sarnak, "Perspectives on the analytic theory of L-functions", ' +
      'GAFA 2000 Special Volume, 705-741',
    montgomery1973:
      'Montgomery, "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193',
    phillipsSarnak1985:
      'Phillips, Sarnak, "On cusp forms for cofinite subgroups of PSL(2, R)", ' +
      'Inventiones Math. 80 (1985), 339-364',
  }),
});

export default IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP;

// =========================================================================
// BUILD-TIME TRIPWIRES.
// =========================================================================

export const IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP_ASSERTIONS = [
  // Tripwire 1: Weyl leading coefficient for SL(2, Z) \ H is exactly 1/12.
  {
    id: 'imp2432-weyl-leading-coefficient-is-one-twelfth',
    why:
      'The cuspidal Weyl-law leading coefficient is (Area / 4 pi) = (pi/3)/(4 pi) ' +
      '= 1/12. Every density number downstream rests on this; if it drifts the ' +
      'whole gap quantification is wrong.',
    holds: () => {
      const c = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.weylLaw.leadingCoefficient;
      return Math.abs(c - 1 / 12) < 1e-12;
    },
  },

  // Tripwire 2: local cuspidal density at height T equals T/6.
  {
    id: 'imp2432-local-density-is-T-over-6',
    why:
      'Local density n_cusp(T) = d/dT (T^2 / 12) = T / 6. A correct derivative ' +
      'is needed for the density-excess comparison to PCC.',
    holds: () => {
      const T = 1e6;
      const row = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.gapTable.find((r) => r.T === T);
      return row && Math.abs(row.localDensityPerUnitR - T / 6) < 1e-3;
    },
  },

  // Tripwire 3: the required PCC-matching density excess equals (log T)^(1/2)
  // at each sampled height.
  {
    id: 'imp2432-required-factor-is-sqrt-log-T',
    why:
      'The concrete gap factor the ticket asks for is (log T)^(1/2), imported ' +
      'from the imp-1297 trace-route degradation. Each table row must report ' +
      'this exact value.',
    holds: () => {
      return IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.gapTable.every((r) => {
        const expected = Math.sqrt(Math.log(r.T));
        return Math.abs(r.requiredExcessToMatchPCC - expected) < 1e-9;
      });
    },
  },

  // Tripwire 4: the headline concrete factors land in the stated ranges
  // (~2.1x at 1e2, ~3.7x at 1e6, ~5.3x at 1e12).
  {
    id: 'imp2432-headline-concrete-factors-in-range',
    why:
      'The headline reports the gap as concrete factors 2.1x / 3.7x / 5.3x at ' +
      'T = 1e2 / 1e6 / 1e12. These must match the computed values so the prose ' +
      'and the numbers cannot silently diverge.',
    holds: () => {
      const f = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.concreteFactors;
      return (
        Math.abs(f.at_T_1e2 - 2.146) < 0.01 &&
        Math.abs(f.at_T_1e6 - 3.717) < 0.01 &&
        Math.abs(f.at_T_1e12 - 5.257) < 0.01
      );
    },
  },

  // Tripwire 5: the required factor is strictly increasing in T (the gap
  // DIVERGES, it is not a fixed near-miss).
  {
    id: 'imp2432-gap-factor-strictly-increasing',
    why:
      'The unbridgeable verdict rests on the gap factor DIVERGING with T. If ' +
      'the table were non-monotone the "diverging" claim would be unsupported.',
    holds: () => {
      const rows = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.gapTable;
      for (let i = 1; i < rows.length; i += 1) {
        if (!(rows[i].requiredExcessToMatchPCC > rows[i - 1].requiredExcessToMatchPCC)) {
          return false;
        }
      }
      return true;
    },
  },

  // Tripwire 6: available excess over Weyl is exactly 1 (no excess) at every
  // height -- the Weyl law is an equality with a negative secondary term.
  {
    id: 'imp2432-available-excess-is-one',
    why:
      'The deficit equals required / available. The available excess of the ' +
      'cuspidal density over the Weyl leading term is 1 (none), because Weyl is ' +
      'an asymptotic equality and the secondary correction is negative. If this ' +
      'were taken greater than 1 the gap would be understated.',
    holds: () => {
      return IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.gapTable.every(
        (r) => r.availableExcessOverWeyl === 1.0 && Math.abs(r.deficitFactor - r.requiredExcessToMatchPCC) < 1e-12,
      );
    },
  },

  // Tripwire 7: the secondary Weyl term is negative at every sampled height
  // (continuous-spectrum winding subtracts).
  {
    id: 'imp2432-secondary-weyl-term-negative',
    why:
      'The negative sign of the secondary term is the load-bearing fact that ' +
      'pushes the cuspidal density AT OR BELOW the leading term, ruling out the ' +
      'enhancement the PCC match would need. A sign flip would falsely open the ' +
      'route.',
    holds: () => {
      return IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.gapTable.every(
        (r) => r.weylSecondaryTerm < 0 && r.weylCuspCountWithCorrection < r.weylCuspCountLeading,
      );
    },
  },

  // Tripwire 8: verdict is one of the allowed strings and is the unbridgeable
  // verdict (catches a silent flip to "near-miss" or "route-reopened").
  {
    id: 'imp2432-verdict-is-unbridgeable',
    why:
      'The result is that the required density is forbidden by the Weyl law. A ' +
      'silent re-label to near-miss or route-reopened would mislead engine ' +
      'planning into re-investing in the trace route.',
    holds: () => {
      const r = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP;
      return (
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'cuspidal-density-gap-quantified-unbridgeable' &&
        r.interpretation.requiredFactorDiverges === true &&
        r.interpretation.weylIsAsymptoticEquality === true
      );
    },
  },

  // Tripwire 9: cross-references the parent imp-1297 ticket in both
  // relatedTickets and references.
  {
    id: 'imp2432-cross-references-imp1297',
    why:
      'This ticket is a numerical follow-on to imp-1297; without the explicit ' +
      'cross-reference the quantification floats free of the route classification.',
    holds: () => {
      const r = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP;
      return (
        r.relatedTickets.includes('imp-1297') &&
        typeof r.references.imp1297 === 'string' &&
        /imp-1297/.test(r.references.imp1297)
      );
    },
  },

  // Tripwire 10: honest scope flags this as a quantification (not a closure)
  // and states the gap is unbridgeable.
  {
    id: 'imp2432-honest-scope-quantification-not-closure',
    why:
      'The scope must say this is a numerical quantification of an existing gap, ' +
      'NOT a new closure, and that the gap is unbridgeable. A drift to a positive ' +
      'claim would overstate the result.',
    holds: () => {
      const blob = IMP_2432_PHILLIPS_SARNAK_CUSPIDAL_DENSITY_GAP.honestScope.join(' ');
      return (
        /NOT a new closure/.test(blob) &&
        /UNBRIDGEABLE/i.test(blob) &&
        /log T/.test(blob)
      );
    },
  },
];
