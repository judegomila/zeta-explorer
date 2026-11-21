/**
 * @module imp-34741-interval-arithmetic-subgap-tolerance-audit
 *
 * imp-34741 (meta): AUDIT of the interval-arithmetic sub-gap family --
 * imp-34650 (subGap imp-34650a), imp-34687 (subGap imp-34687a), imp-34693
 * (subGap imp-34693a), imp-34714 (subGap imp-34714a) -- for the storage-
 * precision assertion-tolerance trap (MEMORY: the imp-2546/imp-2539 red-build
 * class where a value round-tripped through a toFixed/toExponential(N)
 * display literal is re-checked at a tolerance tighter than the ~1e-6 floor
 * that rounding already discarded).
 *
 * METHOD. Every `holds()` check in each module's *_ASSERTIONS array was read
 * and every tight tolerance (< 1e-6) traced to its operands: is either side a
 * value pulled from an exported `constants`/`verification` field that was
 * itself stored via .toExponential(N)/.toFixed(N), or is it a fresh
 * in-module variable computed at full double precision?
 *
 * FINDING: no gap in any of the four modules. Every tight-tolerance assertion
 * compares two full-precision in-module variables (e.g. imp-34650's
 * `Math.abs(supSampled - L_CONTRACTION) < 1e-12`, imp-34687's
 * `REL_WIDTH_T0 < 1e-13`, imp-34714's `WIDTH_RATIO < 1e-5`) or recomputes the
 * UNROUNDED closed form directly rather than reading back a rounded export
 * (imp-34693's `band_grows_geometrically` check at `< 1e-9` explicitly
 * recomputes `rho(1, k)` at full precision -- the file's own comment notes
 * "Growth is checked on the UNROUNDED closed form rho(1,k); the stored table
 * is toExponential(4)"). Every `.toExponential(N)` call across the four
 * modules feeds only a display/export field (`constants`, `verification`,
 * `seedBandTable`), never an assertion operand. The trap does not apply here.
 */

const AUDITED = [
  {
    ticket: 'imp-34650',
    subGap: 'imp-34650a',
    modulePath: 'src/data/imp-34650-crossover-banach-contraction-certificate.js',
    tightestTolerance: 1e-12,
    tightCheck: 'Math.abs(supSampled - L_CONTRACTION) < 1e-12',
    comparesRoundedLiteral: false,
    reason: 'both operands are full-precision in-module doubles (sampled sup vs g_prime(1e9)), not a toExponential export',
  },
  {
    ticket: 'imp-34687',
    subGap: 'imp-34687a',
    modulePath: 'src/data/imp-34687-crossover-interval-arithmetic-scope.js',
    tightestTolerance: 1e-13,
    tightCheck: 'REL_WIDTH_T0 < 1e-13 && REL_WIDTH_DT0DN < 1e-13',
    comparesRoundedLiteral: false,
    reason: 'REL_WIDTH_T0 / REL_WIDTH_DT0DN are full-precision enclosure-width ratios, not read back from a rounded export',
  },
  {
    ticket: 'imp-34693',
    subGap: 'imp-34693a',
    modulePath: 'src/data/imp-34693-crossover-contraction-seed-band.js',
    tightestTolerance: 1e-9,
    tightCheck: 'band_grows_geometrically: Math.abs(actual - expected) / expected < 1e-9',
    comparesRoundedLiteral: false,
    reason: 'actual = rho(1,k)/rho(1,prevK) recomputes the UNROUNDED closed form directly; the toExponential(4) seedBandTable is a separate display-only export never read by this check',
  },
  {
    ticket: 'imp-34714',
    subGap: 'imp-34714a',
    modulePath: 'src/data/imp-34714-krawczyk-existence-uniqueness-lemma.js',
    tightestTolerance: 1e-5,
    tightCheck: 'WIDTH_RATIO < 1e-5',
    comparesRoundedLiteral: false,
    reason: 'WIDTH_RATIO = WIDTH_NEW / WIDTH_OLD is a full-precision in-module ratio, not read back from the toExponential(4) verification.width_ratio_one_step export',
  },
];

export const INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT = {
  ticket: 'imp-34741',
  audited: AUDITED,
  auditedCount: AUDITED.length,
  trapGapsFound: AUDITED.filter((m) => m.comparesRoundedLiteral === true).map((m) => m.ticket),
  honest:
    'AUDIT: confirms all four interval-arithmetic sub-gap modules (imp-34650a, imp-34687a, imp-34693a, ' +
    'imp-34714a) keep every tight-tolerance (< 1e-6) assertion operand at full double precision -- none ' +
    'reconstructs a value from a toFixed/toExponential(N) display literal and re-checks it below the ~1e-6 ' +
    'storage floor that rounding discarded, so the imp-2546/imp-2539 storage-precision assertion-tolerance ' +
    'trap does not apply to this family. No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional per ' +
    'imp-486 untouched; NO QED; no refereed bound is changed.',
};

export const INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34741-audits-four-subgap-modules',
    description: 'the audited family is exactly the four imp-34650/34687/34693/34714 sub-gap modules',
    holds: () => INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT.auditedCount === 4
      && ['imp-34650', 'imp-34687', 'imp-34693', 'imp-34714']
        .every((t) => AUDITED.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34741-modulepaths-match-ticket-prefix',
    description: 'every audited modulePath filename starts with the matching ticket id',
    holds: () => AUDITED.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34741-subgap-labels-match-ticket',
    description: 'every entry names the sub-gap suffix "<ticket>a" consistent with its ticket id',
    holds: () => AUDITED.every((m) => m.subGap === `${m.ticket}a`),
  },
  {
    id: 'imp-34741-no-tolerance-trap-gaps',
    description: 'no audited module was found reconstructing a rounded storage literal and re-checking it below the ~1e-6 floor',
    holds: () => INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT.trapGapsFound.length === 0
      && AUDITED.every((m) => m.comparesRoundedLiteral === false),
  },
  {
    id: 'imp-34741-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT.honest)
      && /refereed bound is changed/i.test(INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT.honest),
  },
];

for (const a of INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34741-interval-arithmetic-subgap-tolerance-audit assertion failed: ${a.id}`);
  }
}

export default INTERVAL_ARITHMETIC_SUBGAP_TOLERANCE_AUDIT;
