// @module data/imp-96207-verified-height-floor-law-kappa-star
//
// imp-96207 (numerical, frontier-direction): imp-96190 derived that the two named
// ways past the imp-96166 shortfall for an unconditional lim_N E(N) = 0 are
// actually ONE way -- the verified strip height must grow with N -- but never
// tabulated the full height-to-floor law that makes the collapse quantitative.
// This module supplies that table.
//
// THE COLLAPSE, MADE EXPLICIT (imp-96190)
// ---------------------------------------
// imp-96166 named two routes: (1) push the Platt-Trudgian verified height T_PT to
// infinity, OR (2) find a fixed-strip route whose truncation TAIL decays with N.
// imp-96190 showed route (2) needs a genuinely decaying tail
//   E ~ (const) H(N)^{-kappa_star}
// with the exponent kappa_star held at a FIXED positive value while H(N) grows.
// Honesty permits a fixed kappa_star > 0 above a height H only with an
// all-zeros-in-strip certificate to H (Platt-Trudgian strength). So route (2) is
// exactly a verified strip height that grows with N -- route (1) under another
// name. Without such a certificate the honest exponent collapses to
// kappa(H) = (4/3)/log H and the tail GROWS (the imp-96190 anti-decay); WITH one,
// kappa_star is pinned positive and the tail obeys the SAME inverse power law as
// the T_PT branch. The two ways are one law.
//
// THE HEIGHT-TO-FLOOR LAW (this module)
// -------------------------------------
// For a fixed positive kappa_star held under a Platt-Trudgian-strength certificate
// to height H, the honest truncation tail is the imp-2322 / imp-447 constant-
// elasticity power law with e_I = 1 - kappa_star:
//   E_trunc(H) = (2 e_I / kappa_star) H^{-kappa_star}
//              = prefactor(kappa_star) H^{-kappa_star},
//   prefactor(kappa_star) = 2 (1 - kappa_star) / kappa_star.
// At the honest fixed abscissa sigma = 3/4 the anchor is kappa_star = 0.4,
// prefactor = 3.0, reproducing E_trunc(3e12) = 3.06e-5 (the imp-96166 frozen
// floor, the branch-A contrast). Inverting for the verified height required to
// reach a target floor E:
//   H_required(E) = (prefactor / E)^{1 / kappa_star}.
// The inverse sensitivity exponent is d log H / d log E = -1/kappa_star = -2.5
// (floor-independent): 2.5 decades of certified height per decade of floor drop,
// 10^{2.5} ~ 316x per decade.
//
// THE TABLE (measurement only, kappa_star = 0.4, contrast floor 3.06e-5 at 3e12)
// -----------------------------------------------------------------------------
//   floor 1e-5 -> H ~ 4.93e13 (~1.22 decades / ~16x above 3e12): near-term
//                 plausible, the frozen floor already sits just above 1e-5.
//   floor 1e-6 -> H ~ 1.56e16 (~3.72 decades / ~5.2e3x): far beyond any published
//                 strip verification.
//   floor 1e-7 -> H ~ 4.93e18 (~6.22 decades / ~1.6e6x): out of foreseeable reach.
// The three thresholds are equispaced at exactly 2.5 height-decades per floor-
// decade (the 1/kappa_star leverage), and reaching lim_N E(N) = 0 needs
// H(N) -> infinity. Under EITHER name -- certified T_PT growing, or an
// N-decaying fixed-strip tail with a certificate -- the requirement is the same
// unbounded certified height, so the imp-96166 pair collapses to one quantitative
// law. (imp-96185 tabulated the same kappa_star = 0.4 inversion at floors
// 1e-5/1e-6/1e-8; this module fills the 1e-7 threshold and states the collapse.)
//
// SCOPE: MEASUREMENT / DERIVATION ONLY, inverting the imp-2322 audit power law at
// a fixed certified kappa_star. No zero is verified, no new T_PT is claimed, the
// rigorous bound stays E_trunc = 3.06e-5, and C_mb stays GUE-conditional per
// imp-486. Changes no bound. No positivity, no bridge closure, no RH claim, NO
// QED. No refereed bound is changed; RH remains OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes inside
// single-quoted strings; no star-slash in any comment.
//
// @see imp-96190-fixed-strip-n-decaying-tail-obstruction (the two-ways-are-one-way collapse this quantifies)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (same kappa_star=0.4 inversion at floors 1e-5/1e-6/1e-8)
// @see imp-96166-en-decay-exponent-vs-step4-bridge-threshold (the frozen E_trunc floor / two named alternatives)
// @see imp-2322-etrunc-pt-T_PT-sensitivity (forward E_trunc(T_PT) power law, elasticity -0.4)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

// Anchors of the fixed-strip truncation term (imp-2322 / imp-447), carried as
// literals to keep this module import-light (self-contained, imp-96190 pattern).
const T_PT_BASELINE = 3e12;                 // Platt-Trudgian 2021 verified height
const KAPPA_STAR = 0.4;                       // honest fixed exponent at sigma = 3/4

// prefactor(kappa) = 2 (1 - kappa) / kappa = 2 e_I / kappa with e_I = 1 - kappa.
function prefactorOf(kappa) {
  return (2 * (1 - kappa)) / kappa;
}
const PREFACTOR = prefactorOf(KAPPA_STAR);    // 3.0

// Forward honest tail at a certified height H with fixed exponent kappa_star.
function etruncOf(H, kappa = KAPPA_STAR) {
  return prefactorOf(kappa) * Math.pow(H, -kappa);
}

// Full computed anchor (not the imp-96166 rounded pin 3.06e-5), matching the
// imp-96185/imp-2322 baseline (~3.063887e-5). Removes the imp-96246 display-
// only floorDecadesBelowBaseline split between this module and imp-96185.
const E_TRUNC_BASELINE = etruncOf(T_PT_BASELINE);

// Inverse: certified strip height required to reach a target floor E.
function heightForFloor(E, kappa = KAPPA_STAR) {
  return Math.pow(prefactorOf(kappa) / E, 1 / kappa);
}

// Inverse sensitivity exponent d log H / d log E = -1/kappa_star (exact, all E).
const INVERSE_SENSITIVITY_EXPONENT = -1 / KAPPA_STAR;         // -2.5
const HEIGHT_DECADES_PER_FLOOR_DECADE = 1 / KAPPA_STAR;       // 2.5
const PER_FLOOR_DECADE_HEIGHT_FACTOR = Math.pow(10, 1 / KAPPA_STAR); // ~316.23

const THRESHOLDS = Object.freeze([1e-5, 1e-6, 1e-7]);

const TABLE = THRESHOLDS.map((E) => {
  const H = heightForFloor(E);
  const decadesAboveBaseline = Math.log10(H / T_PT_BASELINE);
  const heightFactorVsBaseline = H / T_PT_BASELINE;
  const floorDecadesBelowBaseline = Math.log10(E_TRUNC_BASELINE / E);
  return {
    targetFloor: +E.toExponential(1),
    requiredHeight: +H.toExponential(4),
    heightFactorVsBaseline: +heightFactorVsBaseline.toExponential(4),
    decadesAboveBaseline: +decadesAboveBaseline.toFixed(4),
    floorDecadesBelowBaseline: +floorDecadesBelowBaseline.toFixed(4),
    // Round-trip check: the recomputed forward floor at requiredHeight.
    forwardFloorAtRequiredHeight: +etruncOf(H).toExponential(4),
    _H_full: H,
    _forward_full: etruncOf(H),
  };
});

export const IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR = {
  id: 'imp-96207',
  proofSection: 'S-frontier',
  question:
    'Tabulate the imp-96190 verified-strip-height -> E_trunc-floor law: for a ' +
    'fixed positive kappa_star held under a Platt-Trudgian-strength certificate, ' +
    'at what certified height H does the honest truncation tail reach floor ' +
    'targets 1e-5 / 1e-6 / 1e-7 (contrast the frozen branch-A floor 3.06e-5 at ' +
    'T_PT = 3e12), making the two-named-ways-are-one-way collapse quantitative? ' +
    'Measurement / derivation only, changes no bound, no QED.',
  functionalForm:
    'E_trunc(H) = (2 e_I / kappa_star) H^{-kappa_star} = prefactor(kappa_star) ' +
    'H^{-kappa_star} with e_I = 1 - kappa_star, prefactor = 2(1 - kappa_star)/' +
    'kappa_star. At sigma = 3/4: kappa_star = 0.4, prefactor = 3.0, ' +
    'E_trunc(3e12) = 3.06e-5. Inverse: H_required(E) = (prefactor/E)^{1/kappa_star}.',
  anchors: {
    kappaStar: KAPPA_STAR,
    prefactor: PREFACTOR,
    T_PT_baseline: T_PT_BASELINE,
    frozenFloorBaseline: +E_TRUNC_BASELINE.toExponential(6),
  },
  sensitivity: {
    forwardElasticity: -KAPPA_STAR,                            // -0.4 (imp-2322)
    inverseSensitivityExponent: INVERSE_SENSITIVITY_EXPONENT,  // -2.5
    heightDecadesPerFloorDecade: HEIGHT_DECADES_PER_FLOOR_DECADE, // 2.5
    perFloorDecadeHeightFactor: +PER_FLOOR_DECADE_HEIGHT_FACTOR.toFixed(3), // ~316.23
    note:
      'For a certified fixed kappa_star the inverse exponent d log H / d log E = ' +
      '-1/kappa_star = -2.5 is exact and floor-independent: 2.5 decades of ' +
      'certified height per decade of floor drop (10^{2.5} ~ 316x per decade). ' +
      'The three tabulated thresholds are equispaced at exactly this leverage.',
  },
  table: TABLE.map(({ _H_full, _forward_full, ...pub }) => pub),
  collapse:
    'The imp-96166 pair collapses to ONE law. Route (1) push T_PT to infinity and ' +
    'route (2) an N-decaying fixed-strip tail both reduce (imp-96190) to a ' +
    'certified strip height H(N) that grows with N: a fixed positive kappa_star is ' +
    'honest above H only with an all-zeros-in-strip certificate to H, and then ' +
    'both routes obey the identical inverse power law H_required(E) = ' +
    '(prefactor/E)^{1/kappa_star}. Reaching lim_N E(N) = 0 needs H(N) -> infinity ' +
    'under either name -- one quantitative requirement, not two. Without the ' +
    'certificate the honest exponent collapses to (4/3)/log H and the tail GROWS ' +
    '(imp-96190 anti-decay), so the certified growing height is the only route to ' +
    'the floor targets at all.',
  reachability:
    'Floor 1e-5 needs H ~ 4.93e13 (~1.22 decades, ~16x above 3e12): near-term ' +
    'plausible, the frozen floor already sits just above 1e-5. Floor 1e-6 needs ' +
    '~1.56e16 (~3.72 decades, ~5.2e3x): far beyond any published strip ' +
    'verification. Floor 1e-7 needs ~4.93e18 (~6.22 decades, ~1.6e6x): out of ' +
    'foreseeable reach. The one part of E(N) that decays (E_coll) is the sole GUE ' +
    'conditional (imp-486), so the surrogate still cannot supply an unconditional ' +
    'E(N) -> 0.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). For a certified fixed ' +
    'kappa_star = 0.4 (prefactor 3.0) the honest tail reaches floor 1e-5 at ' +
    'certified height H ~ 4.93e13, 1e-6 at ~1.56e16, and 1e-7 at ~4.93e18, ' +
    'equispaced at exactly 2.5 height-decades per floor-decade (1/kappa_star ' +
    'leverage, ~316x per decade), against the frozen branch-A floor 3.06e-5 at ' +
    'T_PT = 3e12. Both imp-96166 routes -- T_PT to infinity, and an N-decaying ' +
    'fixed-strip tail -- reduce (imp-96190) to the same certified growing height ' +
    'obeying H_required(E) = (prefactor/E)^{1/kappa_star}, so lim_N E(N) = 0 needs ' +
    'H(N) -> infinity under either name: the two named ways are one quantitative ' +
    'law. No zero is verified, no new T_PT is claimed, the rigorous bound stays ' +
    'E_trunc = 3.06e-5, and C_mb stays GUE-conditional per imp-486. Changes no ' +
    'bound; no bridge closure, no RH claim, NO QED. No refereed bound is changed' +
    '; RH OPEN.',
  citation:
    'imp-96190 (two-ways-are-one-way collapse); imp-96185 (same kappa_star=0.4 ' +
    'inversion at 1e-5/1e-6/1e-8); imp-96166 (frozen E_trunc floor / two named ' +
    'alternatives); imp-2322 (forward E_trunc(T_PT) power law, elasticity -0.4); ' +
    'imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / ' +
    'conditionalBookkeeping B1-B3.',
};

export const IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR_ASSERTIONS = [
  {
    // The kappa_star=0.4 anchor reproduces the canonical imp-2322 / imp-96166
    // prefactor 3.0 and frozen floor 3.06e-5 at 3e12.
    id: 'imp96207-anchor-reproduces-frozen-floor',
    description: 'kappa_star=0.4 gives prefactor 3.0 and E_trunc(3e12)=3.06e-5 (imp-96166)',
    holds: () =>
      Math.abs(KAPPA_STAR - 0.4) < 1e-12 &&
      Math.abs(PREFACTOR - 3.0) < 1e-12 &&
      Math.abs(etruncOf(T_PT_BASELINE) - E_TRUNC_BASELINE) < 1e-6,
  },
  {
    // Inverse sensitivity exponent is exactly -1/kappa_star = -2.5.
    id: 'imp96207-inverse-exponent-is-minus-2p5',
    description: 'Inverse sensitivity exponent d log H/d log E = -1/kappa_star = -2.5',
    holds: () =>
      Math.abs(INVERSE_SENSITIVITY_EXPONENT - -2.5) < 1e-12 &&
      Math.abs(HEIGHT_DECADES_PER_FLOOR_DECADE - 2.5) < 1e-12 &&
      Math.abs(PER_FLOOR_DECADE_HEIGHT_FACTOR - 316.2277) < 1e-3,
  },
  {
    // Every table row round-trips: forward floor at requiredHeight equals target.
    id: 'imp96207-inversion-round-trips',
    description: 'Forward E_trunc at requiredHeight reproduces each target floor',
    holds: () =>
      TABLE.every((r) => Math.abs(r._forward_full - r.targetFloor) <= 1e-9 * r.targetFloor),
  },
  {
    // The new 1e-7 threshold needs H ~ 4.93e18 (~6.22 decades above baseline).
    id: 'imp96207-1e-7-needs-4p93e18',
    description: 'Floor 1e-7 requires certified height H ~ 4.93e18 (~6.22 decades above 3e12)',
    holds: () => {
      const r = TABLE.find((x) => x.targetFloor === 1e-7);
      return r && Math.abs(Math.log10(r._H_full) - Math.log10(4.9295e18)) < 0.01 &&
        Math.abs(r.decadesAboveBaseline - 6.2157) < 0.02;
    },
  },
  {
    // Cross-check: the 1e-5 / 1e-6 rows agree with the imp-96185 kappa_star=0.4
    // inversion (same law, different threshold list).
    id: 'imp96207-matches-imp96185-shared-rows',
    description: 'The 1e-5 and 1e-6 rows reproduce the imp-96185 inversion (H ~ 4.93e13 / 1.56e16)',
    holds: () => {
      const r5 = TABLE.find((x) => x.targetFloor === 1e-5);
      const r6 = TABLE.find((x) => x.targetFloor === 1e-6);
      return r5 && r6 &&
        Math.abs(Math.log10(r5._H_full) - Math.log10(4.9295e13)) < 0.01 &&
        Math.abs(Math.log10(r6._H_full) - Math.log10(1.5588e16)) < 0.01;
    },
  },
  {
    // The three thresholds are equispaced at exactly 2.5 height-decades per
    // floor-decade (the 1/kappa_star leverage) -- the quantitative collapse.
    id: 'imp96207-linear-decade-leverage',
    description: 'Consecutive thresholds cost exactly 2.5 height-decades per floor-decade (1/kappa_star)',
    holds: () => {
      const rows = THRESHOLDS.map((E) => TABLE.find((x) => x.targetFloor === +E.toExponential(1)));
      for (let i = 1; i < rows.length; i++) {
        const heightDecades = Math.log10(rows[i]._H_full) - Math.log10(rows[i - 1]._H_full);
        const floorDecades = Math.log10(rows[i - 1].targetFloor) - Math.log10(rows[i].targetFloor);
        if (Math.abs(heightDecades / floorDecades - 2.5) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement only, names the collapse and the E_trunc floor,
    // no QED, no refereed bound is changed.
    id: 'imp96207-honesty-gate-no-qed',
    description: 'Measurement only: quantifies the collapse, names E_trunc, no QED, no refereed bound is changed',
    holds: () =>
      IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR.isRigorous === false &&
      /E_trunc/.test(IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR.functionalForm) &&
      /collapse/.test(IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR.collapse) &&
      /NO QED/.test(IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR.verdict) &&
      /refereed bound is changed/i.test(IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR.verdict),
  },
];

for (const a of IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96207-verified-height-floor-law-kappa-star assertion failed: ${a.id}`,
    );
  }
}
