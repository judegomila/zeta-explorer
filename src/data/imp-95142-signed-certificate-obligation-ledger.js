/**
 * imp-95142-signed-certificate-obligation-ledger — single-reference roll-up
 * of the five currency legs of obligation (2) (sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port) in the signed-certificate
 * chain imp-95221..95226.
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * produces no new certificate; it re-states the per-leg verdicts already
 * recorded in imp-95224, imp-95225, imp-95226, and imp-95133 as one table.
 * The COUNT leg is TERMINAL (exact Nevanlinna-Pick optimum, imp-95226).
 * The CROSS-OCTAVE/LATTICE leg is delivered only on the geometric-lattice
 * skeleton (imp-95226 COROLLARY BL-LAT); in-octave multiplicity and
 * off-lattice rates are named residuals of that leg, not separately
 * closed. The WEIGHT and MODULUS/PHASE legs remain OPEN. No bound of the
 * Lambda program changes here. NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * Source: imp-95224 (COROLLARY DC-NOGO), imp-95225 (THEOREM SGN-C),
 * imp-95226 (LEMMA PICK-ID, THEOREM NP-CERT, THEOREM SGN-NP, THEOREM
 * SGN-2X, COROLLARY COAL-2, PROP BL, COROLLARY BL-LAT), imp-95133
 * (WP-A / WP-B weight-leg scoping).
 */

export const SIGNED_CERTIFICATE_OBLIGATION_LEDGER = [
  {
    leg: 'DEPTH-ONLY',
    role: 'count-uniform depth-only signed certificate',
    status: 'DEAD',
    grade:
      'imp-95224 COROLLARY DC-NOGO: exact rational witness N = 2 (W = 3/8 ' +
      'vs T = 1/4, silver threshold 3 + 2 sqrt(2)) refutes signed ' +
      'multi-rate R <= e^(-y_min); co-centered signed sup R = 1/2 at ' +
      'every fixed depth, so no depth-only certificate exists',
    subGap: null,
  },
  {
    leg: 'COUNT',
    role: 'signed certificate at fixed rate count N, exact optimum',
    status: 'TERMINAL',
    grade:
      'imp-95225 THEOREM SGN-C delivered the first positive signed ' +
      'multi-rate certificate; imp-95226 LEMMA PICK-ID + THEOREM NP-CERT ' +
      '+ THEOREM SGN-NP prove it equals the exact Nevanlinna-Pick optimum ' +
      '(the seam pencil eigenvalue); N = 2 fence dissolved by the exact ' +
      'closed form THEOREM SGN-2X and exact COROLLARY COAL-2 coalescence ' +
      'law -- no multiplier, polynomial or not, can beat this value',
    subGap: null,
  },
  {
    leg: 'CROSS-OCTAVE (LATTICE)',
    role: 'signed certificate at unbounded rate count',
    status: 'DELIVERED (lattice skeleton only)',
    grade:
      'imp-95226 COROLLARY BL-LAT: Lambda <= c(rho)^4 e^(-2x) ' +
      '(1 + tau_rho(x))^2 on distinct sites of a geometric lattice ratio ' +
      'rho; c(2) = 8.255987935778, xStarBL(2) = 4.23623878476; near-sharp ' +
      '(ratio 1.028) at the dyadic row N = 10, x = 6, where the count-leg ' +
      'SGN-C cap is vacuous by five orders of magnitude -- HONEST SCOPE: ' +
      'exact lattice rates, one per site; in-octave multiplicity and ' +
      'off-lattice perturbation are named residuals, not separately closed',
    subGap: null,
  },
  {
    leg: 'WEIGHT',
    role: 'weight-discounted (not count-discounted) per-factor composition across octaves',
    status: 'OPEN',
    grade:
      'imp-95133 scoped two candidates: WP-A (naive per-octave-in-isolation ' +
      'product) REFUTED -- undershoots the true value by ~5x at one rate ' +
      'per octave; WP-B (coupling-aware H-inf product, pin-to-1 off octave) ' +
      'valid but VACUOUS -- loose by ~1.85e8, per-octave factors all far ' +
      'above 1; the tapered-split weight-discounted per-factor bound is ' +
      'the missing lemma',
    subGap: 'imp-95212-subgap-fresnel-airy-envelope-port',
  },
  {
    leg: 'MODULUS/PHASE',
    role: 'per-window modulus/phase currency, distinct from count and weight',
    status: 'OPEN',
    grade: 'unscoped -- no candidate certificate attempted yet',
    subGap: null,
  },
];

export const SIGNED_CERTIFICATE_OBLIGATION_SUMMARY = {
  obligation: '(2)',
  subGap: 'imp-95212-subgap-fresnel-airy-envelope-port',
  dead: ['DEPTH-ONLY'],
  terminal: ['COUNT'],
  delivered: ['CROSS-OCTAVE (LATTICE)'],
  open: ['WEIGHT', 'MODULUS/PHASE'],
  deadCount: 1,
  terminalCount: 1,
  deliveredCount: 1,
  openCount: 2,
  totalCount: 5,
  certifiesPaperPackets: false,
  qed: false,
};

export const IMP_95142_SIGNED_CERTIFICATE_OBLIGATION_LEDGER = {
  id: 'imp-95142-signed-certificate-obligation-ledger',
  title:
    'imp-95226 signed-certificate chain, obligation (2) five-leg ledger: ' +
    'DEPTH-ONLY DEAD (imp-95224 DC-NOGO), COUNT TERMINAL (imp-95226 ' +
    'SGN-NP exact Pick optimum), CROSS-OCTAVE/LATTICE delivered on the ' +
    'lattice skeleton only (imp-95226 BL-LAT), WEIGHT and MODULUS/PHASE ' +
    'OPEN (imp-95133 scoping); does not certify the width-law paper packets',
  ledger: SIGNED_CERTIFICATE_OBLIGATION_LEDGER,
  summary: SIGNED_CERTIFICATE_OBLIGATION_SUMMARY,
  note:
    'consolidates imp-95224, imp-95225, imp-95226, imp-95133 per the ' +
    'imp-95226 ROUTING paragraph and the imp-95212-subgap-fresnel-airy-' +
    'envelope-port obligation (2) currency ledger',
};

// ── assertions (import-light; exact-literal consistency only) ───────────────
export const IMP_95142_ASSERTIONS = [
  {
    id: 'imp-95142-five-legs-exhaustive',
    holds: () => SIGNED_CERTIFICATE_OBLIGATION_LEDGER.length === 5,
    why: 'the signed-certificate obligation (2) ledger has exactly five currency legs, no more, no fewer.',
  },
  {
    id: 'imp-95142-status-partition',
    holds: () => {
      const byStatus = (pred) =>
        SIGNED_CERTIFICATE_OBLIGATION_LEDGER.filter(pred).map((o) => o.leg);
      const dead = byStatus((o) => o.status === 'DEAD');
      const terminal = byStatus((o) => o.status === 'TERMINAL');
      const delivered = byStatus((o) => o.status.startsWith('DELIVERED'));
      const open = byStatus((o) => o.status === 'OPEN');
      const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
      return (
        sameSet(dead, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.dead) &&
        sameSet(terminal, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.terminal) &&
        sameSet(delivered, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.delivered) &&
        sameSet(open, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.open) &&
        dead.length + terminal.length + delivered.length + open.length ===
          SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.totalCount
      );
    },
    why: 'DEPTH-ONLY must be exactly the DEAD leg, COUNT exactly TERMINAL, CROSS-OCTAVE (LATTICE) exactly DELIVERED, and WEIGHT/MODULUS-PHASE exactly the OPEN pair, per imp-95224/95225/95226/95133.',
  },
  {
    id: 'imp-95142-silver-threshold-arithmetic',
    holds: () => {
      const silver = 3 + 2 * Math.sqrt(2);
      return Math.abs(silver - 5.82842712474619) < 1e-12;
    },
    why: 'the imp-95224 DC-NOGO silver threshold is exactly 3 + 2 sqrt(2), the constant that separates the N = 2 signed rational witness regimes.',
  },
  {
    id: 'imp-95142-dyadic-near-sharp-ratio',
    holds: () => {
      const lambdaExact = 4.101e-4;
      const blSquared = 4.217e-4;
      const ratio = blSquared / lambdaExact;
      return Math.abs(ratio - 1.028) < 0.002;
    },
    why: 'the imp-95226 BL-LAT dyadic demo (N = 10, x = 6) reports the lattice certificate near-sharp against the exact pencil value at ratio 1.028; this recomputes that ratio from the two recorded literals.',
  },
  {
    id: 'imp-95142-not-a-bound',
    holds: () =>
      SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.certifiesPaperPackets === false &&
      SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.qed === false &&
      SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.openCount > 0,
    why: 'with the WEIGHT and MODULUS/PHASE legs still open, the width-law paper packets remain uncertified; no QED is asserted anywhere in this module.',
  },
];
