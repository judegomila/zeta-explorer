/**
 * @module imp-2865-en-ledger-storage-tolerance-audit
 *
 * imp-2865 (high, accuracy): cross-module storage-precision tolerance audit
 * across the E(N) ledger discharge modules.
 *
 * MEMORY flags a recurring red-build trap (imp-2546 / imp-2539): an assertion
 * that compares a LIVE full-precision value against a literal copied from a
 * toFixed(d) / toExponential(d) display field can flip if its tolerance is
 * TIGHTER than that field's half-ULP storage floor. imp-2643 added one such
 * guard (the 5e-8 floor on E_N); the E(N) ledger has since grown to ~10
 * discharge modules with no cross-module check.
 *
 * This module enumerates every storage-reconstruction comparison in the ledger
 * as a tuple (module, field, displayPrecision, reconstructFloor, tolerance) and
 * asserts tolerance >= floor for each. The floor is DERIVED from the declared
 * display precision (not hardcoded): for toFixed(d) it is 0.5e-d; for
 * toExponential(d) at a value of order 10^k it is 0.5 . 10^(k-d). If a future
 * edit tightens a listed tolerance below its derived floor (and updates this
 * table to match), the build breaks here.
 *
 * HONEST FINDING: every storage-reconstruction comparison in the audited
 * modules is SAFE -- the tightest margin is 20x (imp-2644 t_c, tol 1e-7 vs
 * floor 5e-9). NO too-tight tolerance was found, so no in-place widening was
 * required. The very tight tolerances elsewhere (1e-9 in imp-2700, 1e-12 in
 * imp-2633 / imp-2644) compare a live value against an EXACT mathematical
 * literal (e.g. 3.0 - 2.622, (1/8).sqrt(3 pi), C_G = 2.0), NOT a rounded
 * storage display, so they carry no storage floor and are correctly exempt;
 * they are listed in EXACT_ARITHMETIC_CHECKS for the record.
 *
 * @see imp-2643-honest-assembled-EN (imp2643-storage-tolerance-floor: the live
 *   per-module reconstruction guard this audit generalises across the ledger)
 * @see imp-2870-en-cert-liveness-tripwire (liveness of the same cert modules)
 */

// Half-ULP storage floor for a toFixed(d) display field.
const fixedFloor = (d) => 0.5 * Math.pow(10, -d);

// Half-ULP storage floor for a toExponential(d) display field whose value is of
// order repValue: the last retained mantissa place is 10^(k-d) with
// k = floor(log10(|repValue|)), so half a unit there is 0.5 . 10^(k-d).
const expFloor = (repValue, d) => {
  const k = Math.floor(Math.log10(Math.abs(repValue)));
  return 0.5 * Math.pow(10, k - d);
};

// Each row: a downstream assertion that compares a LIVE full-precision quantity
// against a literal mirroring a stored display field. `floor` is derived from
// `display`; `tolerance` is the literal tolerance used at the guard site.
// kind: dec = toFixed(digits); exp = toExponential(digits) at repValue.
export const EN_LEDGER_STORAGE_TOLERANCE_AUDIT = [
  // imp-2643 honest assembled E(N) -- already self-guarded (imp2643-storage-tolerance-floor).
  { module: 'imp-2643', field: 'E_N', kind: 'dec', digits: 7, tolerance: 1e-5, guardId: 'imp2643-EN-clears-PT' },

  // imp-2641 C_Selberg Trudgian discharge.
  { module: 'imp-2641', field: 'E_coll_placeholder', kind: 'dec', digits: 7, tolerance: 1e-5, guardId: 'imp2641-ecoll-placeholder' },
  { module: 'imp-2641', field: 'E_coll_rigorous', kind: 'dec', digits: 7, tolerance: 1e-5, guardId: 'imp2641-ecoll-rigorous' },
  { module: 'imp-2641', field: 'pointValueAtT0', kind: 'dec', digits: 4, tolerance: 5e-3, guardId: 'imp2641-trudgian-point' },
  { module: 'imp-2641', field: 'rigorousExplicit', kind: 'dec', digits: 4, tolerance: 1e-3, guardId: 'imp2641-cselberg-rigorous' },

  // imp-2633 L_cond constant discharge.
  { module: 'imp-2633', field: 'E_coll.value', kind: 'dec', digits: 7, tolerance: 1e-5, guardId: 'imp2633-ecoll' },
  { module: 'imp-2633', field: 'C_F', kind: 'dec', digits: 6, tolerance: 1e-4, guardId: 'imp2633-cf' },

  // imp-2644 E_flow Gronwall C_G discharge.
  { module: 'imp-2644', field: 'C_F', kind: 'dec', digits: 6, tolerance: 1e-4, guardId: 'imp2644-cf' },
  { module: 'imp-2644', field: 'prefactor', kind: 'exp', digits: 4, repValue: 1.2389e-3, tolerance: 1e-6, guardId: 'imp2644-prefactor' },
  { module: 'imp-2644', field: 'tc.value', kind: 'exp', digits: 4, repValue: 2.3686e-4, tolerance: 1e-7, guardId: 'imp2644-tc-a1' },

  // imp-2700 Erdos-Turan bridge discharge.
  { module: 'imp-2700', field: 'KS_bridge_coeff', kind: 'dec', digits: 5, tolerance: 1e-4, guardId: 'imp2700-ks-bridge' },
  { module: 'imp-2700', field: 'C_Selberg_eff', kind: 'dec', digits: 4, tolerance: 5e-3, guardId: 'imp2700-cselberg-eff' },

  // imp-2709 kappa_T interval certificate.
  { module: 'imp-2709', field: 'E_trunc.value', kind: 'dec', digits: 6, tolerance: 1e-5, guardId: 'imp2709-etrunc-floor' },

  // imp-2715 worst-case E(N) headroom audit.
  { module: 'imp-2715', field: 'E_N_worst', kind: 'dec', digits: 7, tolerance: 1e-5, guardId: 'imp2715-en-worst' },
  { module: 'imp-2715', field: 'E_trunc_value', kind: 'dec', digits: 6, tolerance: 1e-3, guardId: 'imp2715-etrunc-asymptotic' },
];

// Comparisons whose literal is an EXACT mathematical value (no rounded storage),
// so they carry no half-ULP floor and a sub-floor tolerance is legitimate.
// Recorded so a future reader does not mistake them for too-tight storage guards.
export const EXACT_ARITHMETIC_CHECKS = [
  { module: 'imp-2700', expr: 'HEADROOM = 3.0 - 2.622', tolerance: 1e-9 },
  { module: 'imp-2633', expr: 'C_C_PINNED = (1/8).sqrt(3 pi)', tolerance: 1e-12 },
  { module: 'imp-2644', expr: 'C_G_GRONWALL = 2.0; cGFromStrip(sqrt2) = 1.0', tolerance: 1e-12 },
];

// Attach the derived floor and the headroom factor to each row.
for (const row of EN_LEDGER_STORAGE_TOLERANCE_AUDIT) {
  row.reconstructFloor =
    row.kind === 'dec' ? fixedFloor(row.digits) : expFloor(row.repValue, row.digits);
  row.headroomFactor = row.tolerance / row.reconstructFloor;
  row.displayPrecision =
    row.kind === 'dec' ? `toFixed(${row.digits})` : `toExponential(${row.digits})`;
}

const tightest = EN_LEDGER_STORAGE_TOLERANCE_AUDIT.reduce(
  (m, r) => (r.headroomFactor < m.headroomFactor ? r : m),
  EN_LEDGER_STORAGE_TOLERANCE_AUDIT[0],
);

export const IMP2865_EN_LEDGER_STORAGE_TOLERANCE_AUDIT = {
  id: 'imp-2865',
  ticket: 'imp-2865',
  question:
    'Across the E(N) ledger discharge modules, does every assertion comparing a live value against a toFixed/toExponential-rounded literal use a tolerance at least the storage half-ULP floor?',
  rowsAudited: EN_LEDGER_STORAGE_TOLERANCE_AUDIT.length,
  modulesCovered: [...new Set(EN_LEDGER_STORAGE_TOLERANCE_AUDIT.map((r) => r.module))],
  tightestRow: {
    module: tightest.module,
    field: tightest.field,
    displayPrecision: tightest.displayPrecision,
    reconstructFloor: tightest.reconstructFloor,
    tolerance: tightest.tolerance,
    headroomFactor: +tightest.headroomFactor.toFixed(1),
  },
  exactArithmeticExemptions: EXACT_ARITHMETIC_CHECKS.length,
  verdict:
    'ALL SAFE. Every storage-reconstruction comparison in the audited E(N) ' +
    'ledger modules uses a tolerance at least its derived half-ULP floor ' +
    '(tightest margin ~20x at imp-2644 t_c). No too-tight tolerance found; no ' +
    'in-place widening required. Sub-floor tolerances elsewhere are exact-' +
    'arithmetic identities, not rounded-storage guards.',
};

export const IMP2865_EN_LEDGER_STORAGE_TOLERANCE_AUDIT_ASSERTIONS = [
  {
    id: 'imp2865-tolerance-at-least-floor',
    description:
      'Every audited storage-reconstruction comparison uses a tolerance >= its derived half-ULP storage floor (the imp-2546/imp-2539 red-build trap cannot fire).',
    holds: () =>
      EN_LEDGER_STORAGE_TOLERANCE_AUDIT.every((r) => r.tolerance >= r.reconstructFloor),
  },
  {
    id: 'imp2865-floor-derivation-sane',
    description:
      'Every derived floor is finite and strictly positive (display precision parsed correctly).',
    holds: () =>
      EN_LEDGER_STORAGE_TOLERANCE_AUDIT.every(
        (r) => Number.isFinite(r.reconstructFloor) && r.reconstructFloor > 0,
      ),
  },
  {
    id: 'imp2865-known-floors-pinned',
    description:
      'Sanity-pin the derived floors against the imp-2643 reference: toFixed(7) -> 5e-8, toExponential(4) at ~1.24e-3 -> 5e-8.',
    holds: () =>
      Math.abs(fixedFloor(7) - 5e-8) < 1e-20 &&
      Math.abs(expFloor(1.2389e-3, 4) - 5e-8) < 1e-20,
  },
  {
    id: 'imp2865-tightest-row-has-headroom',
    description:
      'Even the tightest audited row keeps a comfortable headroom factor (>= 10x) over its storage floor.',
    holds: () => tightest.headroomFactor >= 10,
  },
  {
    id: 'imp2865-covers-the-ledger',
    description:
      'The audit covers the named E(N) discharge modules (imp-2633/2641/2643/2644/2700/2709/2715).',
    holds: () => {
      const covered = new Set(EN_LEDGER_STORAGE_TOLERANCE_AUDIT.map((r) => r.module));
      return ['imp-2633', 'imp-2641', 'imp-2643', 'imp-2644', 'imp-2700', 'imp-2709', 'imp-2715'].every(
        (m) => covered.has(m),
      );
    },
  },
];

for (const a of IMP2865_EN_LEDGER_STORAGE_TOLERANCE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2865-en-ledger-storage-tolerance-audit assertion failed: ${a.id}`);
  }
}
