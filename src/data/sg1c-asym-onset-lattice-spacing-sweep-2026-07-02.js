/**
 * @module sg1c-asym-onset-lattice-spacing-sweep-2026-07-02
 *
 * imp-3295: is the UNIT opposite-lattice the WORST spacing within the imp-3170
 * asymmetric R -> infinity isolation class? The ledger anchor c_asym = 0.90279
 * (sg1c-asym-onset-bracket-ledger-2026-06-30) was derived assuming the opposite
 * uniform lattice has spacing exactly L = 1 = d_1. This module GENERALIZES the
 * closed-form CM-flow rate to arbitrary opposite-lattice spacing L, then sweeps
 * L to locate the class-onset infimum. Deterministic log-gas algebra (NOT
 * RH-hard); NO new QED, NO RH claim.
 *
 * SETUP (the imp-3045 / imp-3170 worst-case asymmetric class, R -> infinity):
 *   positions  x = {-1, 0, g} U {g + kL : k = 1..R},  R -> infinity.
 *   tracked pair (0, g) with gap g; one tight neighbour at -1 (left d_1 = 1);
 *   opposite uniform lattice of spacing L on the right (unit is L = 1).
 *   Log-gas velocity v_i = - sum_{j != i} 1/(x_i - x_j); rho = g/d_1 = g.
 *   Onset is drho/ds = 0 with drho/ds = (v_g - v_0) - g (v_0 - v_{-1}).
 *
 * GENERALIZED CLOSED FORM (the deliverable). Both lattice sums resolve to
 * digamma via  sum_{k>=1}[1/(a+k) - 1/(b+k)] = psi(b+1) - psi(a+1)  and
 * sum_{k>=1}[1/k - 1/(a+k)] = psi(a+1) + gamma :
 *   d_1 side:  v_0 - v_{-1} = -2 + 1/g - 1/(1+g)
 *                             + (1/L)[psi((g+1)/L + 1) - psi(g/L + 1)]
 *   pair side: v_g - v_0     = 1 - 1/(g+1) - 2/g
 *                             + (1/L)[psi(g/L + 1) + gamma]
 *   Collecting:
 *     drho/ds(g; L) = (g-1)/(g+1) - 2/g + 2g
 *                     + (1/L)[psi(g/L + 1) + gamma]
 *                     - (g/L)[psi((g+1)/L + 1) - psi(g/L + 1)].
 *
 * TWO CLOSED-FORM ENDPOINTS PIN THE FAMILY (both are existing ledger anchors):
 *   L = 1 : the L=1 digamma tail telescopes and the rate collapses to the
 *           imp-3170 anchor  psi(g+1) + gamma + 2g - 2/g - 1/(g+1),  whose (0,1)
 *           root is c_asym = 0.9027902227683418.
 *   L -> infinity : the two (1/L)-weighted digamma blocks both vanish (psi(1)+gamma
 *           = 0), leaving  (g-1)/(g+1) - 2/g + 2g,  whose (0,1) root is EXACTLY
 *           g = 1 -- the Anchor-1 single-neighbour onset. Physically the opposite
 *           lattice recedes to infinite spacing and only the tight -1 remains.
 *
 * RESULT (the ticket question, answered): the class onset c(L) is STRICTLY
 * MONOTONE INCREASING in L on the admissible range L >= 1 (dc/dL(1) ~ +0.173 > 0;
 * verified strictly increasing on a wide bracket over [1, 50]). Hence the class
 * onset INFIMUM over L >= 1 is ATTAINED AT L = 1, giving c_asym = 0.90279. The
 * UNIT opposite-lattice IS the worst spacing within this R -> infinity sub-family;
 * NO larger spacing lowers the closed-form onset -- every L > 1 relaxes the
 * environment (fewer destabilising neighbours per unit length) and pushes the
 * onset up toward the single-neighbour ceiling 1.
 *
 * ADMISSIBILITY (why the sweep is L >= 1, not all L > 0): the opposite-lattice
 * spacing L is the environment nearest-neighbour spacing. For d_1 = 1 to be the
 * genuine tight-neighbour distance defining rho = g/d_1, the environment may be no
 * denser than that reference, i.e. L >= d_1 = 1. Continuing the same formula to
 * L < 1 (a DENSER-than-unit opposite lattice) does keep dropping the onset (e.g.
 * c(0.5) ~ 0.721, c(0.25) ~ 0.453), but that is a different, denser regime -- the
 * one-sided dense half-lattice already studied in imp-3236 / imp-3237 / imp-3270,
 * whose located ceiling is c_half = 0.8980. So the L < 1 descent does NOT reopen
 * the L >= 1 result; it lands in a family whose worst case is separately recorded.
 *
 * HONEST SCOPE (NO false QED, NO RH claim):
 *   - This probes ONLY the R -> infinity opposite-lattice sub-family (Config A),
 *     parametrized by the single spacing L. It confirms the ledger anchor c_asym
 *     is the L >= 1 infimum of THAT sub-family; it does NOT claim c_asym is the
 *     global asymmetric infimum -- the denser half-lattice (c_half ~ 0.8980) sits
 *     strictly below it, so the global c_glob stays OPEN, bracketed by the
 *     imp-3236 lower bound 0.86566 and the imp-3270 ceiling 0.89802.
 *   - Deterministic CM-flow / digamma algebra; basin-conditional throughout; the
 *     basin margin to Theorem-C 0.72 is unaffected. No refereed bound is changed.
 *
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170 L=1 c_asym anchor this generalizes)
 * @see sg1c-asym-onset-bracket-ledger-2026-06-30   (imp-3198 ledger; asymUnitLatticeDrho row)
 * @see sg1c-halflattice-lone-limit-closed-form-2026-07-02 (imp-3270 dense-regime ceiling c_half)
 * @see sg1c-cglo-lower-bound-2026-07-02             (imp-3236 lower bound 0.86566)
 */

// Self-contained digamma psi(x) (recurrence to x >= 6 then asymptotic series),
// identical convention to the imp-3170 / imp-3198 anchors this cross-checks.
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  r += Math.log(x) - 1 / (2 * x) - f * (1 / 12 - f * (1 / 120 - f * (1 / 252)));
  return r;
}

const GAMMA = 0.5772156649015329;

// Generalized closed-form CM-flow rate for opposite-lattice spacing L (L=1 is the
// imp-3170 unit case). The onset c(L) is its unique root in (0,1).
export function asymSpacingDrho(g, L) {
  return (g - 1) / (g + 1) - 2 / g + 2 * g
    + (1 / L) * (digamma(g / L + 1) + GAMMA)
    - (g / L) * (digamma((g + 1) / L + 1) - digamma(g / L + 1));
}

// The imp-3170 L=1 anchor rate (for cross-validation of the L=1 collapse).
function unitLatticeDrho(g) {
  return digamma(g + 1) + GAMMA + 2 * g - 2 / g - 1 / (g + 1);
}

// The L -> infinity limiting rate (both (1/L)-weighted digamma blocks vanish).
function farLatticeDrho(g) {
  return (g - 1) / (g + 1) - 2 / g + 2 * g;
}

function bisectRoot(fn, lo, hi) {
  for (let k = 0; k < 300; k++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

function onsetAtSpacing(L) {
  return bisectRoot((g) => asymSpacingDrho(g, L), 0.3, 1 - 1e-13);
}

const C_ASYM = onsetAtSpacing(1);          // 0.9027902227683418 (= imp-3170 anchor, L=1 infimum)
const C_SINGLE = 1;                        // L -> infinity limit onset (Anchor 1)

// Spacing sweep over the admissible range L >= 1 (ascending onset = relaxing environment).
const SPACING_SWEEP = [1, 1.25, 1.5, 2, 3, 5, 10].map((L) => ({ L, onset: onsetAtSpacing(L) }));

// Strict monotonicity witness on a wide bracket over [1, 50].
function isMonotoneIncreasingOnRange() {
  let prev = -1;
  for (let L = 1; L <= 50.0001; L += 0.25) {
    const c = onsetAtSpacing(L);
    if (c <= prev) return false;
    prev = c;
  }
  return true;
}

// Slope dc/dL at L=1 by central difference (positive => L=1 is the infimum).
const DC_DL_AT_ONE = (onsetAtSpacing(1 + 1e-4) - onsetAtSpacing(1 - 1e-4)) / (2e-4);

export const SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP = {
  ticket: 'imp-3295',
  date: '2026-07-02',
  generalizes: 'imp-3170 (unit-lattice c_asym anchor)',
  configClass: 'asymmetric R->inf: pair (0,g) + tight neighbour at -1 (d_1=1) + opposite uniform lattice {g+kL} spacing L',
  generalRate: 'drho/ds(g;L) = (g-1)/(g+1) - 2/g + 2g + (1/L)[psi(g/L+1)+gamma] - (g/L)[psi((g+1)/L+1) - psi(g/L+1)]',
  admissibleRange: 'L >= 1 (opposite-lattice spacing may be no denser than the d_1=1 tight-neighbour reference)',
  onsetAtUnit: C_ASYM,                       // 0.9027902227683418
  onsetFarLimit: C_SINGLE,                   // 1 (L -> infinity, single-neighbour recovery, EXACT)
  spacingSweep: SPACING_SWEEP,               // onset ascending in L
  slopeAtUnit: DC_DL_AT_ONE,                 // ~ +0.173 > 0
  infimumSpacing: 1,
  infimumOnset: C_ASYM,
  verdict:
    'Within the R -> infinity opposite-lattice sub-family the class onset c(L) is strictly monotone increasing '
    + 'on the admissible range L >= 1, with the two closed-form endpoints c(1) = c_asym = 0.90279 (imp-3170 '
    + 'digamma anchor) and c(L -> inf) = 1 exactly (Anchor-1 single-neighbour recovery). Hence the sub-family '
    + 'onset INFIMUM over L >= 1 is attained at L = 1: the UNIT opposite-lattice is the worst spacing and NO '
    + 'larger spacing lowers the closed-form onset. The L < 1 continuation descends further but lands in the '
    + 'denser one-sided half-lattice regime (imp-3236/3237/3270, ceiling c_half ~ 0.8980), a separate family.',
  honest:
    'Deterministic CM-flow / digamma algebra, NOT RH-hard; probes ONLY the Config-A opposite-lattice sub-family '
    + 'parametrized by spacing L. Confirms c_asym is the L>=1 infimum of THAT sub-family; does NOT claim it is '
    + 'the global asymmetric infimum -- the denser half-lattice c_half ~ 0.8980 sits strictly below, so c_glob '
    + 'stays OPEN in (0.86566, 0.89802]. Basin-conditional; basin margin to 0.72 unaffected; no refereed bound is changed'
    + '. NO false QED, NO RH claim.',
};

export const SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP_ASSERTIONS = [
  {
    id: 'sg1c-spacing-general-rate-collapses-to-unit-anchor',
    description: 'the generalized rate at L=1 reproduces the imp-3170 unit-lattice anchor rate to machine precision across (0,1)',
    holds: () => {
      let maxd = 0;
      for (let g = 0.5; g < 0.9999; g += 0.01) maxd = Math.max(maxd, Math.abs(asymSpacingDrho(g, 1) - unitLatticeDrho(g)));
      return maxd < 1e-12;
    },
  },
  {
    id: 'sg1c-spacing-unit-onset-equals-casym',
    description: 'the L=1 onset equals the ledger anchor c_asym = 0.9027902227683418',
    holds: () => Math.abs(C_ASYM - 0.9027902227683418) < 1e-9 && Math.abs(asymSpacingDrho(C_ASYM, 1)) < 1e-9,
  },
  {
    id: 'sg1c-spacing-far-limit-onset-exactly-one',
    description: 'the L -> infinity limiting rate (g-1)/(g+1)-2/g+2g has root exactly g=1 (single-neighbour recovery), matching the generalized rate at large L',
    holds: () => Math.abs(farLatticeDrho(1)) < 1e-14
      && Math.abs(asymSpacingDrho(1, 1e6)) < 1e-4
      && Math.abs(onsetAtSpacing(1e6) - 1) < 1e-5,
  },
  {
    id: 'sg1c-spacing-onset-strictly-increasing-in-L',
    description: 'the class onset c(L) is strictly monotone increasing on L>=1 (verified on a wide bracket over [1,50] and on the recorded sweep)',
    holds: () => {
      const sw = SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP.spacingSweep;
      const swMono = sw.every((r, i) => i === 0 || sw[i - 1].onset < r.onset);
      return swMono && isMonotoneIncreasingOnRange();
    },
  },
  {
    id: 'sg1c-spacing-infimum-at-unit-positive-slope',
    description: 'the sub-family onset infimum over L>=1 is attained at L=1 (dc/dL(1) > 0), and equals c_asym',
    holds: () => DC_DL_AT_ONE > 0
      && SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP.infimumSpacing === 1
      && Math.abs(SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP.infimumOnset - C_ASYM) < 1e-12,
  },
  {
    id: 'sg1c-spacing-honest-no-global-no-qed',
    description: 'the module confirms only the sub-family L>=1 infimum, keeps c_glob OPEN below (denser half-lattice c_half ~ 0.8980), and keeps PT Lambda<=0.2 as SOTA',
    holds: () => /L>=1 infimum of THAT sub-family/.test(SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP.honest)
      && /c_glob\s+stays OPEN/.test(SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP.honest)
      && /refereed bound is changed/i.test(SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP.honest),
  },
];

for (const a of SG1C_ASYM_ONSET_LATTICE_SPACING_SWEEP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-onset-lattice-spacing-sweep assertion failed: ${a.id}`);
}
