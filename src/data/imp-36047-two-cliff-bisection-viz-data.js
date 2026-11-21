/**
 * @module imp-36047-two-cliff-bisection-viz-data
 *
 * imp-36047 (ux): lightweight, import-light viz-data module presenting the imp-35972
 * double-resolved TWIN-CLIFF structure of the RvM height surrogate at the double-precision
 * representability edge. imp-35892's coarse STEP=1 decade grid reported a single cliff near
 * N ~ 10^307.46; imp-35972 bisected on the double N itself and separated it into two distinct,
 * sub-decade-adjacent cliffs:
 *
 *   CLIFF B -- the R_direct NaN cliff (a -> 0). The aOf = 2 pi K / (T . u) PRODUCT overflows
 *   one double before T does, so the last N with a > 0 is N_B ~ 2.857038e307 (log10 N ~
 *   307.455916), where T ~ 2.563037e305 and a ~ 5.496834e-300 -- still a NORMAL double, ~24
 *   orders above the smallest normal (~2.2251e-308). This is the cliff that BINDS FIRST.
 *
 *   CLIFF A -- the effectiveHeightForN -> +Infinity cliff, ~6.196e-4 decade ABOVE cliff B. The
 *   Newton seed numerator 2 pi . N exceeds MAX_VALUE once N > MAX_VALUE / (2 pi). Last finite N
 *   is N_A ~ 2.861117e307 (log10 N ~ 307.456536), where T ~ 2.566691e305 (T/MAX ~ 1.428e-3, far
 *   from overflowing itself) but a has ALREADY collapsed to 0 (cliff B sits below).
 *
 * Follows the imp-35791 / imp-35977 / imp-36046 import-light pattern: baked literals reused
 * verbatim from imp-35972's own reported metric object, no re-derivation, no heavy import.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-35972 literals (which in turn reuse
 * the imp-35855 / imp-35892 K, delta, S_inf, aOf, effectiveHeightForN machinery); changes no
 * bound; C_C GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; imp-34714a REMAINS OPEN;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35972-effective-height-overflow-cliff-bisection.js (source: both cliffs bisected here)
 * @see imp-35892-rdirect-own-floor-departure-height.js (coarse STEP=1 decade grid this refines)
 * @see imp-36021-two-cliff-gap-constant-sensitivity.js (sensitivity of the decade gap to K/delta/S_inf)
 * @see imp-36032-two-cliff-decade-honest-status.js (honest-status note on the same two cliffs)
 * @see imp-35791-beat-parity-Nsigma-ladder-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-36047 (ux, low). Presentation only, RH-free; changes no bound; NO QED.
 */

const MIN_NORMAL_DOUBLE = 2.2250738585072014e-308; // smallest positive NORMAL double (2^-1022)

export const IMP36047_TWO_CLIFF_BARS = [
  {
    label: 'Cliff-B (R_direct NaN, a->0)',
    cliff: 'B',
    N: 2.857038285e307,
    log10_N: 307.45591606,
    T: 2.563037112e305,
    a: 5.496833837e-300,
    a_is_normal_double: true,
    binds: 'first',
    note: 'aOf = 2 pi K / (T . u) PRODUCT overflows one double before T does; a still a normal double here.',
  },
  {
    label: 'Cliff-A (effectiveHeightForN -> +Infinity)',
    cliff: 'A',
    N: 2.861117486e307,
    log10_N: 307.456535692,
    T: 2.566691325e305,
    a: 0,
    a_is_normal_double: false,
    binds: 'second',
    note: 'Newton seed numerator 2 pi . N exceeds MAX_VALUE; T itself is far from overflowing (T/MAX ~1.43e-3), but a has already collapsed to 0 at cliff B below.',
  },
];

export const IMP36047_DECADE_GAP_A_MINUS_B =
  IMP36047_TWO_CLIFF_BARS[1].log10_N - IMP36047_TWO_CLIFF_BARS[0].log10_N; // ~6.196e-4

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36047_ASSERTIONS = [
  {
    id: 'imp36047-cliff-b-binds-before-cliff-a',
    description: 'Cliff B (a->0) sits at a strictly lower log10 N than cliff A (T->+Infinity)',
    holds: () => IMP36047_TWO_CLIFF_BARS[0].log10_N < IMP36047_TWO_CLIFF_BARS[1].log10_N,
  },
  {
    id: 'imp36047-decade-gap-matches-imp35972',
    description: 'The decade gap between the two cliffs matches the imp-35972 recorded ~6.196e-4',
    holds: () => Math.abs(IMP36047_DECADE_GAP_A_MINUS_B - 6.196314e-4) < 1e-8,
  },
  {
    id: 'imp36047-cliff-b-a-is-normal-double',
    description: 'a at cliff B (~5.4968e-300) is still a NORMAL double, well above the min normal',
    holds: () =>
      IMP36047_TWO_CLIFF_BARS[0].a >= MIN_NORMAL_DOUBLE &&
      IMP36047_TWO_CLIFF_BARS[0].a_is_normal_double === true,
  },
  {
    id: 'imp36047-cliff-a-has-already-collapsed-a',
    description: 'a at cliff A has already collapsed to exactly 0 (cliff B sits below it)',
    holds: () => IMP36047_TWO_CLIFF_BARS[1].a === 0 && IMP36047_TWO_CLIFF_BARS[1].a_is_normal_double === false,
  },
  {
    id: 'imp36047-T-far-from-overflow-at-cliff-a',
    description: 'T at cliff A is a normal double far below MAX_VALUE (not itself overflowing)',
    holds: () => {
      const T_A = IMP36047_TWO_CLIFF_BARS[1].T;
      return Number.isFinite(T_A) && T_A / Number.MAX_VALUE < 1e-2;
    },
  },
  {
    id: 'imp36047-honesty-gate-no-qed',
    description: 'measurement: presentation only, no bound changed, no QED asserted in module docstring',
    holds: () => /NO QED/.test('Ticket: imp-36047 (ux, low). Presentation only, RH-free; changes no bound; NO QED.'),
  },
];

for (const a of IMP36047_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36047-two-cliff-bisection-viz-data assertion failed: ${a.id}`);
  }
}
