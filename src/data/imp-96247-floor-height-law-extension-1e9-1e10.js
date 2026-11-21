// @module data/imp-96247-floor-height-law-extension-1e9-1e10
//
// imp-96247 (numerical, frontier-direction): imp-96232 cross-validated the
// fixed-strip floor-to-height inversion at the honest anchor kappa_star = 0.4
// (prefactor 3.0) across floors 1e-5 / 1e-6 / 1e-7 / 1e-8, confirming an
// unbroken 2.5-height-decades-per-floor-decade leverage and a mantissa cycle
//   4.9295 -> 1.5588 -> 4.9295 -> 1.5588
// with a fixed 10^{2.5} step. This module EXTENDS the SAME law
//   H_required(E) = (prefactor / E)^{1 / kappa_star},  prefactor = 3.0,
// to the two next floor decades 1e-9 and 1e-10, checks that the exact 10^{2.5}
// step and the mantissa parity persist, and tabulates the height-decades above
// the Platt-Trudgian 3e12 baseline.
//
// THE TWO EXTENDED HEIGHTS (measurement only, kappa_star = 0.4)
// ------------------------------------------------------------
//   floor 1e-9  -> H ~ 4.9295e23 (~11.2157 decades above 3e12)   [mantissa 4.9295]
//   floor 1e-10 -> H ~ 1.5588e26 (~13.7157 decades above 3e12)   [mantissa 1.5588]
// Each consecutive step from the imp-96232 union (ending 1e-8 -> 1.5588e21)
// costs exactly 2.5 height-decades per floor-decade (10^{2.5} ~ 316.23x). The
// mantissa parity holds: an ODD floor exponent (1e-9) lands on 4.9295 (at
// 10^{23}), an EVEN floor exponent (1e-10) lands on 1.5588 (at 10^{26}) --
// exactly as imp-96232 predicted from 3^{2.5} = 15.588457 times a 10^{0.5}
// half-decade on odd exponents.
//
// WHY THE MANTISSA CYCLES
// -----------------------
// H_required(1e-n) = 3^{2.5} * 10^{2.5 n} = 15.588457 * 10^{2.5 n}. When n is
// EVEN, 2.5 n is an integer and the leading digits read 1.5588 * 10^{2.5 n};
// when n is ODD, 2.5 n = integer + 0.5, so 15.588457 * 10^{0.5} = 49.295 gives
// the leading digits 4.9295 one exponent higher. This is why 1e-9 (odd) reads
// 4.9295 and 1e-10 (even) reads 1.5588, continuing the cycle without break.
//
// SCOPE: MEASUREMENT / EXTENSION ONLY, re-inverting the imp-2322 audit power law
// at the fixed certified kappa_star. No zero is verified, no new T_PT is
// claimed, the rigorous bound stays E_trunc = 3.06e-5, and C_mb stays
// GUE-conditional per imp-486. Changes no bound. No positivity, no bridge
// closure, no RH claim, NO QED. No refereed bound is changed; RH
// remains OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes
// inside single-quoted strings; no star-slash in any comment.
//
// @see imp-96232-kappa-star-floor-height-cross-validation (floors 1e-5..1e-8)
// @see imp-96207-verified-height-floor-law-kappa-star (floors 1e-5/1e-6/1e-7)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (floors 1e-5/1e-6/1e-8)
// @see imp-2322-etrunc-pt-T_PT-sensitivity (forward E_trunc(T_PT) power law, elasticity -0.4)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

// Shared anchors of the fixed-strip truncation power law, carried as literals to
// keep this module import-light (self-contained, imp-96232 / imp-96190 pattern).
const KAPPA_STAR = 0.4;             // honest fixed exponent at sigma = 3/4
const PREFACTOR = 3.0;             // 2(1 - kappa_star)/kappa_star at kappa_star = 0.4
const T_PT_BASELINE = 3e12;        // Platt-Trudgian 2021 verified strip height

// Inverse height-to-floor law (imp-96185 / imp-96207 / imp-96232): the certified
// strip height required to reach a target floor E.
function heightForFloor(E, kappa = KAPPA_STAR, prefactor = PREFACTOR) {
  return Math.pow(prefactor / E, 1 / kappa);
}

// The imp-96232 union endpoint (last confirmed row) and the two new extensions.
const IMP96232_LAST_FLOOR = 1e-8;   // ends at H ~ 1.5588e21
const EXTENDED_FLOORS = Object.freeze([1e-9, 1e-10]);
const ALL_FLOORS = Object.freeze([1e-8, 1e-9, 1e-10]); // imp-96232 endpoint + extension

// Expected extension heights (for a literal cross-check of the recompute).
const EXPECTED = Object.freeze({
  '1e-9': 4.9295e23,
  '1e-10': 1.5588e26,
});

// Fresh independent recompute of the two extended heights.
const RECOMPUTED = EXTENDED_FLOORS.map((E) => {
  const H = heightForFloor(E);
  return {
    targetFloor: +E.toExponential(1),
    requiredHeight: +H.toExponential(4),
    decadesAboveBaseline: +Math.log10(H / T_PT_BASELINE).toFixed(4),
    _H_full: H,
  };
});

// log10 distance so tolerances read as fractions of a decade.
function logGap(a, b) {
  return Math.abs(Math.log10(a) - Math.log10(b));
}

// Consecutive-pair leverage across imp-96232 endpoint 1e-8 through 1e-10
// (must be exactly 2.5 height-decades per floor-decade).
const LEVERAGE = [];
for (let i = 1; i < ALL_FLOORS.length; i++) {
  const heightDecades =
    Math.log10(heightForFloor(ALL_FLOORS[i])) -
    Math.log10(heightForFloor(ALL_FLOORS[i - 1]));
  const floorDecades =
    Math.log10(ALL_FLOORS[i - 1]) - Math.log10(ALL_FLOORS[i]);
  LEVERAGE.push({
    from: ALL_FLOORS[i - 1].toExponential(0),
    to: ALL_FLOORS[i].toExponential(0),
    heightDecadesPerFloorDecade: +(heightDecades / floorDecades).toFixed(6),
  });
}

// Mantissa parity check: 3^{2.5} = 15.588457. Even floor exponent -> 1.5588,
// odd floor exponent -> 4.9295 (one exponent higher, via the 10^{0.5} half-decade).
const THREE_POW_2P5 = Math.pow(3, 2.5); // 15.588457...
function leadingMantissa(H) {
  const exp = Math.floor(Math.log10(H));
  return H / Math.pow(10, exp);
}
const MANTISSA_PARITY = EXTENDED_FLOORS.map((E) => {
  const n = -Math.round(Math.log10(E)); // floor is 1e-n
  const H = heightForFloor(E);
  return {
    floor: E.toExponential(0),
    floorExponentN: n,
    parity: n % 2 === 0 ? 'even' : 'odd',
    leadingMantissa: +leadingMantissa(H).toFixed(4),
    expectedMantissa: n % 2 === 0 ? 1.5588 : 4.9295,
  };
});

export const IMP96247_FLOOR_HEIGHT_LAW_EXTENSION = {
  id: 'imp-96247',
  proofSection: 'S-frontier',
  question:
    'Extending the fixed-strip floor-to-height law H_required(E) = ' +
    '(prefactor/E)^{1/kappa_star} (prefactor 3.0, kappa_star 0.4) from the ' +
    'imp-96232 union (floors 1e-5..1e-8) to floors 1e-9 and 1e-10: does the ' +
    'exact 10^{2.5}-per-floor-decade leverage continue, do the heights land on ' +
    '4.9295e23 (1e-9) and 1.5588e26 (1e-10), and does the mantissa parity ' +
    '(odd exponent -> 4.9295, even exponent -> 1.5588) persist? Extension / ' +
    'measurement only, changes no bound, no QED.',
  law:
    'H_required(E) = (prefactor/E)^{1/kappa_star}, prefactor = 3.0, ' +
    'kappa_star = 0.4 (sigma = 3/4). Inverse sensitivity d log H / d log E = ' +
    '-1/kappa_star = -2.5 (floor-independent): 2.5 certified-height decades per ' +
    'floor decade, 10^{2.5} ~ 316.23x per decade. Closed form ' +
    'H_required(1e-n) = 3^{2.5} * 10^{2.5 n} = 15.588457 * 10^{2.5 n}.',
  anchors: {
    kappaStar: KAPPA_STAR,
    prefactor: PREFACTOR,
    T_PT_baseline: T_PT_BASELINE,
    imp96232LastFloor: IMP96232_LAST_FLOOR,
    threePow2p5: +THREE_POW_2P5.toFixed(6),
  },
  extendedTable: RECOMPUTED.map(({ _H_full, ...pub }) => pub),
  leverage: LEVERAGE,
  mantissaParity: MANTISSA_PARITY,
  isRigorous: false,
  verdict:
    'CONFIRMED (extension, NOT rigorous). Extending H_required(E) = ' +
    '(3.0/E)^{2.5} from the imp-96232 union to floors 1e-9 and 1e-10 gives ' +
    '4.9295e23 (1e-9, ~11.2157 decades above 3e12) and 1.5588e26 (1e-10, ' +
    '~13.7157 decades). The 2.5-height-decades-per-floor-decade leverage ' +
    '(10^{2.5} ~ 316.23x) continues unbroken from the 1e-8 endpoint (1.5588e21), ' +
    'and the mantissa cycle 4.9295 -> 1.5588 persists: the odd floor exponent ' +
    '(1e-9) lands on 4.9295 and the even one (1e-10) on 1.5588, as 3^{2.5} = ' +
    '15.588457 with a 10^{0.5} half-decade on odd exponents dictates. No zero is ' +
    'verified, no new T_PT is claimed, the rigorous bound stays E_trunc = ' +
    '3.06e-5, C_mb stays GUE-conditional per imp-486. Changes no bound; no ' +
    'bridge closure, no RH claim, NO QED. No refereed bound is changed' +
    '; RH OPEN.',
  citation:
    'imp-96232 (floors 1e-5..1e-8 cross-validation); imp-96207 (floors ' +
    '1e-5/1e-6/1e-7); imp-96185 (floors 1e-5/1e-6/1e-8); imp-2322 (forward ' +
    'E_trunc(T_PT) power law, elasticity -0.4); imp-486 (C_mb GUE-conditional); ' +
    'lambda-roadmap Step 4 / conditionalBookkeeping B1-B3.',
};

export const IMP96247_FLOOR_HEIGHT_LAW_EXTENSION_ASSERTIONS = [
  {
    // The anchor reproduces prefactor 3.0 at kappa_star = 0.4.
    id: 'imp96247-anchor-prefactor-3',
    description: 'kappa_star = 0.4, prefactor = 3.0 (honest sigma = 3/4 anchor)',
    holds: () =>
      Math.abs(KAPPA_STAR - 0.4) < 1e-12 &&
      Math.abs(PREFACTOR - 3.0) < 1e-12,
  },
  {
    // The 1e-9 extension reproduces 4.9295e23 to < 0.01 decade.
    id: 'imp96247-1e-9-reproduces',
    description: 'Floor 1e-9 extension reproduces H ~ 4.9295e23',
    holds: () => logGap(heightForFloor(1e-9), EXPECTED['1e-9']) < 0.01,
  },
  {
    // The 1e-10 extension reproduces 1.5588e26 to < 0.01 decade.
    id: 'imp96247-1e-10-reproduces',
    description: 'Floor 1e-10 extension reproduces H ~ 1.5588e26',
    holds: () => logGap(heightForFloor(1e-10), EXPECTED['1e-10']) < 0.01,
  },
  {
    // The 2.5-height-decades-per-floor-decade leverage is unbroken through 1e-10.
    id: 'imp96247-leverage-unbroken',
    description: 'Every consecutive pair 1e-8..1e-10 costs exactly 2.5 height-decades per floor-decade',
    holds: () => LEVERAGE.every((r) => Math.abs(r.heightDecadesPerFloorDecade - 2.5) < 1e-6),
  },
  {
    // The height-decades above 3e12 continue the +2.5 ladder (8.7157 -> 11.2157 -> 13.7157).
    id: 'imp96247-decades-ladder',
    description: 'Decades above 3e12 continue the +2.5 ladder to 11.2157 (1e-9) and 13.7157 (1e-10)',
    holds: () =>
      Math.abs(Math.log10(heightForFloor(1e-9) / T_PT_BASELINE) - 11.2157) < 1e-3 &&
      Math.abs(Math.log10(heightForFloor(1e-10) / T_PT_BASELINE) - 13.7157) < 1e-3,
  },
  {
    // Mantissa parity: odd floor exponent -> 4.9295, even -> 1.5588.
    id: 'imp96247-mantissa-parity',
    description: 'Odd floor exponent (1e-9) lands on 4.9295, even (1e-10) on 1.5588',
    holds: () =>
      MANTISSA_PARITY.every((r) => Math.abs(r.leadingMantissa - r.expectedMantissa) < 1e-3),
  },
  {
    // Honesty gate: extension only, no QED, no refereed bound is changed, changes no bound.
    id: 'imp96247-honesty-gate-no-qed',
    description: 'Extension only: not rigorous, no QED, no refereed bound is changed, changes no bound',
    holds: () =>
      IMP96247_FLOOR_HEIGHT_LAW_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP96247_FLOOR_HEIGHT_LAW_EXTENSION.verdict) &&
      /RH OPEN/.test(IMP96247_FLOOR_HEIGHT_LAW_EXTENSION.verdict),
  },
];

for (const a of IMP96247_FLOOR_HEIGHT_LAW_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96247-floor-height-law-extension-1e9-1e10 assertion failed: ${a.id}`,
    );
  }
}
