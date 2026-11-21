/**
 * @module sg1c-asym-onset-bracket-ledger-2026-06-30
 *
 * imp-3198: assemble the scattered asymmetric-isolation worsening-onset chain
 * (accreted across imp-2596 / imp-3005 / imp-3021 / imp-3045 / imp-3170 / imp-3172
 * in sg1c-theta-trap-theorems and the four sg1c-asym-* reconcile modules) into a
 * SINGLE auditable, cross-validated ledger. Each row records: the onset value, the
 * configuration class it belongs to, the derivation method, its rigor status, and
 * whether/how it bounds the OPEN global asymmetric multi-body isolation constant.
 *
 * Bookkeeping / accuracy ONLY. NO new mathematics, NO QED. The global asymmetric
 * constant stays OPEN; this module only makes the existing prose chain auditable
 * and re-derives the three closed-form anchors (c = 1, c* algebraic, c_asym
 * transcendental) in place so the ledger is self-checked, not transcribed.
 *
 * ORIENTATION (read before the table):
 *   The global asymmetric multi-body isolation constant c_glob is the INFIMUM,
 *   over all admissible environment configurations, of the rho = g/d_1 worsening
 *   onset (the rho below which an isolated minimal pair provably keeps isolating).
 *   Because it is an infimum, EVERY genuinely-attained class onset is an UPPER
 *   bound on c_glob -- finding a config that worsens earlier only lowers the
 *   ceiling. None of the values below is a proven LOWER bound on c_glob; the only
 *   load-bearing lower reference is the Theorem-C basin constant 0.72, which sits
 *   >0.18 BELOW the lowest located onset, so the basin-conditional C_Lip (imp-3006)
 *   never depended on closing c_glob. No refereed bound is changed.
 *
 * STATUS TAXONOMY (the rigor column):
 *   closed-form-exact        -- an exact identity / algebraic / transcendental root
 *   certified-numerical-inf  -- a deterministic, reproducible infimum of a family
 *                               (a genuine smooth drho/ds zero), not a closed form
 *   random-scan              -- a Monte-Carlo / large-sweep infimum estimate (loose)
 *   selector-artifact        -- a bisection that locked onto a minimal-gap selector
 *                               index tie/flip discontinuity, NOT a smooth zero;
 *                               it does NOT validly bound c_glob (see imp-3045/3173/3194)
 *
 * @see sg1c-theta-trap-theorems            (the prose chain this ledger indexes)
 * @see sg1c-asym-isolation-closed-form-2026-06-30   (imp-3170 c_asym digamma root)
 * @see sg1c-asym-global-infimum-reconcile-2026-06-30 (imp-3172 Config A vs B gap)
 * @see sg1c-asym-mingap-configB-closedform-2026-06-30 (imp-3193 Config-B no closed form)
 */

// ---- Re-derive the three closed-form anchors in place (cross-validation, not transcription).

// Anchor 1: single nearest neighbour (Lemma R2-T, imp-2596). The EXACT identity
//   d(rho)/ds = (g - d_1)/d_1^2 * [2/(g+d_1) + 4(g+d_1)/(d_1 g)]
// has a strictly positive bracket, so sign(drho/ds) = sign(g - d_1): the onset is
// exactly rho = 1. Verify the bracket positivity and the sign law at a sample.
function singleNeighbourDrho(g, d1) {
  return ((g - d1) / (d1 * d1)) * (2 / (g + d1) + (4 * (g + d1)) / (d1 * g));
}
const C_SINGLE = 1; // exact single-neighbour onset

// Anchor 2: symmetric single-shell 4-body K=1 (Lemma R2-T2, imp-3005). Closed form
//   c* = sqrt(2 + sqrt(3)) - 1, the unique (0,1) root of rho^4+4rho^3+2rho^2-4rho-2
//   (substitute u = rho^2 + 2rho => u^2 - 2u - 2 = 0).
const C_STAR = Math.sqrt(2 + Math.sqrt(3)) - 1; // 0.93185165...
function quarticR2T2(rho) { return rho * rho * rho * rho + 4 * rho * rho * rho + 2 * rho * rho - 4 * rho - 2; }

// Anchor 3: asymmetric R->infinity opposite-UNIT-lattice class (imp-3170). Closed
// form is the unique (0,1) root of the transcendental rate
//   drho/ds(g) = psi(g+1) + gamma + 2g - 2/g - 1/(g+1).
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  r += Math.log(x) - 1 / (2 * x) - f * (1 / 12 - f * (1 / 120 - f * (1 / 252)));
  return r;
}
const GAMMA = 0.5772156649015329;
function asymUnitLatticeDrho(g) { return digamma(g + 1) + GAMMA + 2 * g - 2 / g - 1 / (g + 1); }
function bisectRoot(fn, lo, hi) {
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (fn(m) > 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}
const C_ASYM = bisectRoot(asymUnitLatticeDrho, 0.5, 0.9999); // 0.9027902227683418

// ---- imp-3291: independent high-precision digamma certification of c_asym.
// The digamma above shifts only to x >= 6 and truncates the Bernoulli tail at the
// 1/252 term; that leaves a ~7.8e-9 error in psi, which propagates into the root.
// Re-evaluate the same rate zero with a DISTINCT digamma: deep recurrence shift to
// x >= 50 plus an extended Bernoulli tail through B16, using
//   psi(x) ~ ln x - 1/(2x) - sum_{n>=1} B_{2n}/(2n x^{2n}),
//   B2=1/6, B4=-1/30, B6=1/42, B8=-1/30, B10=5/66, B12=-691/2730, B14=7/6, B16=-3617/510.
const BERNOULLI_2N = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510];
function digammaHP(x) {
  let r = 0;
  while (x < 50) { r -= 1 / x; x += 1; }
  const x2 = x * x;
  let xp = x2;
  r += Math.log(x) - 1 / (2 * x);
  for (let n = 1; n <= BERNOULLI_2N.length; n++) { r -= BERNOULLI_2N[n - 1] / (2 * n * xp); xp *= x2; }
  return r;
}
function asymUnitLatticeDrhoHP(g) { return digammaHP(g + 1) + GAMMA + 2 * g - 2 / g - 1 / (g + 1); }
const C_ASYM_HP = bisectRoot(asymUnitLatticeDrhoHP, 0.5, 0.9999); // 0.9027902226245005 (converged)
// FINDING: the independent HP digamma agrees with the ledger root only to ~10 sig
// figs. The quoted 0.9027902227683418 is therefore certified only through its first
// 10 digits (0.902790222); digits 11-16 (...7683418) are a shift-to-6 truncation
// artifact -- the true continuation is ...6245005 (root error ~1.44e-10). Harmless
// for the bracket role: 1.44e-10 is ~7 orders below the ~1.2e-3 open-bracket width.
const C_ASYM_ROOT_ERROR = Math.abs(C_ASYM - C_ASYM_HP); // ~1.44e-10
const C_ASYM_CERTIFIED_DIGITS = 10; // sig figs that survive the independent HP cross-check

// Certified-numerical infimum of the imp-3021 / imp-3172 Config-B structured family
// (minimal-spacing half-lattice + lone far neighbour). A genuine smooth drho/ds zero,
// selector stable -- recorded as a literal from sg1c-asym-global-infimum-reconcile.
const STRUCTURED_INF = 0.9015828375; // imp-3172 Config B smooth onset (lowest located)

// Theorem-C basin constant (the load-bearing lower reference; below all onsets).
const BASIN = 0.72;

export const SG1C_ASYM_ONSET_BRACKET_LEDGER = {
  ticket: 'imp-3198',
  date: '2026-06-30',
  indexes: ['imp-2596', 'imp-3005', 'imp-3021', 'imp-3045', 'imp-3170', 'imp-3172'],
  // The ledger, ordered by onset value ascending (lowest = tightest ceiling on c_glob).
  rows: [
    {
      value: STRUCTURED_INF, // 0.9015828
      configClass: 'asymmetric minimal-spacing half-lattice (right gaps = pair gap g) + lone far neighbour (Config B)',
      derivation: 'deterministic tune of first-gap and spacing-floor; a GENUINE smooth drho/ds zero, d_1 selector stable on the lone left neighbour (no flip)',
      status: 'certified-numerical-inf',
      boundsGlobal: 'above (tightest located ceiling on c_glob; the open bracket lower end)',
      ticket: 'imp-3021 (tuned) / imp-3172 (Config B re-run)',
    },
    {
      value: C_ASYM, // 0.9027902227683418
      configClass: 'asymmetric R->infinity, one tight neighbour at d_1 + opposite UNIT lattice {g+k} (Config A)',
      derivation: 'CLOSED FORM: unique (0,1) root of psi(g+1)+gamma+2g-2/g-1/(g+1)=0 (transcendental; d_1 side telescopes to 1/g-2, opposite tail carries the irreducible digamma)',
      status: 'closed-form-exact',
      boundsGlobal: 'above (class-specific onset; the open bracket upper end). Class-specific, NOT the global infimum',
      ticket: 'imp-3170',
    },
    {
      value: 0.927,
      configClass: 'asymmetric minimal-pair (random sample)',
      derivation: '2e6-config RANDOM minimal-pair scan infimum (just below c*); loose, later superseded by the structured tune',
      status: 'random-scan',
      boundsGlobal: 'above (loose; superseded by the structured ~0.9016 ceiling)',
      ticket: 'imp-3005',
    },
    {
      value: C_STAR, // 0.93185165
      configClass: 'symmetric single-shell 4-body, K=1 ({-(g/2+d),-g/2,g/2,g/2+d})',
      derivation: 'CLOSED FORM: c* = sqrt(2+sqrt(3))-1, unique (0,1) root of rho^4+4rho^3+2rho^2-4rho-2 (u=rho^2+2rho => u^2-2u-2=0). Worst within the symmetric K-shell family (onset rises with K)',
      status: 'closed-form-exact',
      boundsGlobal: 'above (symmetric-class onset; asymmetric configs worsen earlier)',
      ticket: 'imp-3005',
    },
    {
      value: 0.943,
      configClass: 'near-uniform multi-body lattice (up to 7 particles, both sides)',
      derivation: '3e6-config skeptical multi-body random scan infimum; the loosest (highest) recorded ceiling',
      status: 'random-scan',
      boundsGlobal: 'above (loosest ceiling; only near a uniform lattice)',
      ticket: 'imp-2596',
    },
    {
      value: C_SINGLE, // 1
      configClass: 'single nearest neighbour',
      derivation: 'CLOSED FORM: exact identity drho/ds = (g-d_1)/d_1^2 * [2/(g+d_1)+4(g+d_1)/(d_1 g)] with strictly positive bracket => sign(drho/ds)=sign(g-d_1), onset exactly rho=1',
      status: 'closed-form-exact',
      boundsGlobal: 'above (the benign single-neighbour threshold; margin self-improves for all rho<1)',
      ticket: 'imp-2596',
    },
  ],
  // Spurious values that LOOK like onsets but are minimal-gap selector index discontinuities,
  // logged here explicitly so they are never mistaken for smooth zeros that bound c_glob.
  selectorArtifacts: [
    {
      value: 0.90625, // 0.9062491875
      whatItIs: 'Config-A naive finite-R bisection (and the imp-3021 4-particle half-lattice convergence) lock onto a d_1=1 minimal-gap selector TIE, strictly ABOVE the smooth zero c_asym',
      status: 'selector-artifact',
      ticket: 'imp-3021 / imp-3172 / imp-3194',
    },
    {
      value: 0.9032364,
      whatItIs: 'imp-3045 finite-R bisection of the asymmetric class locked onto a selector index-FLIP near g~0.9029 (drho/ds=+0.00242>0 there), above the true continuous onset c_asym',
      status: 'selector-artifact',
      ticket: 'imp-3045 (diagnosed by imp-3170)',
    },
  ],
  closedFormAnchors: { singleNeighbour: C_SINGLE, symmetricKShell: C_STAR, asymUnitLatticeRinf: C_ASYM },
  // imp-3291: independent high-precision digamma certification of the c_asym literal.
  casymDigitCertification: {
    quoted: 0.9027902227683418,
    ledgerDigammaRoot: C_ASYM,          // reproduces the quoted literal (shift-to-6 digamma)
    independentHpRoot: C_ASYM_HP,       // 0.9027902226245005 (shift-to-50 + Bernoulli tail through B16)
    rootError: C_ASYM_ROOT_ERROR,       // ~1.44e-10 between the two independent evaluations
    certifiedSigDigits: C_ASYM_CERTIFIED_DIGITS, // only 10 digits survive the cross-check
    finding:
      'The independent HP digamma agrees with the ledger root to ~10 sig figs only. The quoted '
      + '0.9027902227683418 is certified through 0.902790222; digits 11-16 (...7683418) are a '
      + 'shift-to-6 digamma truncation artifact -- the true converged continuation is ...6245005. '
      + 'The ~1.44e-10 root error is ~7 orders below the ~1.2e-3 open-bracket width, so the '
      + 'constant stays fit-for-purpose as a bracket bound. Accuracy certification only, NO QED.',
  },
  openBracket: [STRUCTURED_INF, C_ASYM], // ~(0.9016, 0.9028); c_glob is conjectured here, proven only <= 0.9016
  basinConstant: BASIN, // 0.72 (Theorem-C); load-bearing lower reference, below every onset
  basinMargin: STRUCTURED_INF - BASIN, // 0.1816 > 0.18: the >0.18 basin margin made explicit
  globalConstantStatus: 'OPEN -- every located onset is only an UPPER bound; the exact c_glob and any closed form remain unproven',
  verdict:
    'The asymmetric isolation worsening-onset chain c=1 (single nb, exact) -> c*=0.93185 (symmetric, algebraic) '
    + '-> 0.943 / 0.927 (random scans, loose) -> c_asym=0.90279 (opposite-unit-lattice R->inf, transcendental) '
    + '-> 0.9016 (structured minimal-spacing tune, certified numerical infimum) is now a single cross-validated '
    + 'ledger. Every value is an UPPER bound on the OPEN global asymmetric constant; the lowest (0.9016) is the '
    + 'tightest ceiling and the open bracket is ~(0.9016, 0.9028). 0.90625 and 0.9032364 are selector artifacts, '
    + 'NOT smooth zeros. Basin margin 0.9016 - 0.72 = 0.1816 > 0.18 keeps the basin-conditional C_Lip independent '
    + 'of c_glob; no refereed bound is changed. Bookkeeping only, NO QED.',
};

export const SG1C_ASYM_ONSET_BRACKET_LEDGER_ASSERTIONS = [
  {
    id: 'sg1c-ledger-single-neighbour-onset-exactly-one',
    description: 'the single-neighbour rate has a strictly positive bracket so its onset is exactly rho=1: drho<0 below 1 and drho>0 above 1',
    holds: () => singleNeighbourDrho(0.8, 1) < 0 && singleNeighbourDrho(1.2, 1) > 0
      && Math.abs(singleNeighbourDrho(1, 1)) < 1e-12 && C_SINGLE === 1,
  },
  {
    id: 'sg1c-ledger-cstar-algebraic-anchor',
    description: 'c* = sqrt(2+sqrt(3))-1 ~ 0.93185165 is the unique (0,1) root of the imp-3005 quartic rho^4+4rho^3+2rho^2-4rho-2',
    holds: () => Math.abs(C_STAR - 0.93185165) < 1e-7 && Math.abs(quarticR2T2(C_STAR)) < 1e-9,
  },
  {
    id: 'sg1c-ledger-casym-transcendental-anchor',
    description: 'c_asym ~ 0.9027902227683418 is the digamma-rate zero (psi(g+1)+gamma+2g-2/g-1/(g+1)=0)',
    holds: () => Math.abs(C_ASYM - 0.9027902227683418) < 1e-9 && Math.abs(asymUnitLatticeDrho(C_ASYM)) < 1e-9,
  },
  {
    id: 'sg1c-ledger-casym-independent-hp-digamma-cross-check',
    description: 'imp-3291: an independent high-precision digamma (shift-to-50 + Bernoulli tail through B16) reproduces the c_asym root to ~10 sig figs; the quoted 16-digit literal is certified only through 0.902790222, digits 11-16 being a shift-to-6 truncation artifact (true continuation ...6245005), root error ~1.44e-10 << the ~1.2e-3 bracket width',
    holds: () => Math.abs(C_ASYM_HP - 0.9027902226245005) < 1e-13
      && C_ASYM_ROOT_ERROR > 1e-11 && C_ASYM_ROOT_ERROR < 1e-9
      && C_ASYM_CERTIFIED_DIGITS === 10
      && Math.abs(asymUnitLatticeDrhoHP(C_ASYM_HP)) < 1e-12,
  },
  {
    id: 'sg1c-ledger-chain-is-monotone-ordered',
    description: 'the ledger rows are ordered ascending and the chain obeys structuredInf < c_asym < 0.927 < c* < 0.943 < 1',
    holds: () => {
      const vals = SG1C_ASYM_ONSET_BRACKET_LEDGER.rows.map((r) => r.value);
      const sorted = vals.every((v, i) => i === 0 || vals[i - 1] <= v);
      return sorted
        && STRUCTURED_INF < C_ASYM && C_ASYM < 0.927 && 0.927 < C_STAR && C_STAR < 0.943 && 0.943 < C_SINGLE;
    },
  },
  {
    id: 'sg1c-ledger-selector-artifacts-above-smooth-zero',
    description: 'both logged selector artifacts (0.90625, 0.9032364) sit strictly ABOVE the true continuous onset c_asym and are flagged as artifacts, not smooth zeros',
    holds: () => SG1C_ASYM_ONSET_BRACKET_LEDGER.selectorArtifacts.every(
      (a) => a.value > C_ASYM && a.status === 'selector-artifact'
    ),
  },
  {
    id: 'sg1c-ledger-open-bracket-and-ceiling',
    description: 'the open bracket is [structuredInf, c_asym] ~ (0.9016, 0.9028), the structured infimum is the lowest located onset (tightest ceiling), and the global constant is reported OPEN',
    holds: () => {
      const [loB, hiB] = SG1C_ASYM_ONSET_BRACKET_LEDGER.openBracket;
      const lowest = Math.min(...SG1C_ASYM_ONSET_BRACKET_LEDGER.rows.map((r) => r.value));
      return Math.abs(loB - STRUCTURED_INF) < 1e-12 && Math.abs(hiB - C_ASYM) < 1e-12
        && Math.abs(lowest - STRUCTURED_INF) < 1e-12
        && /OPEN/.test(SG1C_ASYM_ONSET_BRACKET_LEDGER.globalConstantStatus);
    },
  },
  {
    id: 'sg1c-ledger-basin-margin-explicit',
    description: 'the basin margin structuredInf - 0.72 = 0.1816 > 0.18 is made explicit and every onset stays above the basin 0.72',
    holds: () => Math.abs(SG1C_ASYM_ONSET_BRACKET_LEDGER.basinMargin - 0.1815828375) < 1e-9
      && SG1C_ASYM_ONSET_BRACKET_LEDGER.basinMargin > 0.18
      && SG1C_ASYM_ONSET_BRACKET_LEDGER.rows.every((r) => r.value > BASIN),
  },
  {
    id: 'sg1c-ledger-every-row-has-status-and-bound',
    description: 'every ledger row carries a recognised rigor status and a global-bound annotation, and every value is an upper (never proven lower) bound on c_glob',
    holds: () => {
      const ok = new Set(['closed-form-exact', 'certified-numerical-inf', 'random-scan', 'selector-artifact']);
      return SG1C_ASYM_ONSET_BRACKET_LEDGER.rows.every(
        (r) => ok.has(r.status) && typeof r.boundsGlobal === 'string' && /^above/.test(r.boundsGlobal)
      );
    },
  },
];

for (const a of SG1C_ASYM_ONSET_BRACKET_LEDGER_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-onset-bracket-ledger assertion failed: ${a.id}`);
}
