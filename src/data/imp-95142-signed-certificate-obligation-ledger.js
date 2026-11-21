/**
 * imp-95142-signed-certificate-obligation-ledger — single-reference roll-up
 * of the currency legs of obligation (2) (sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port) in the signed-certificate
 * chain imp-95221..95226, extended with seam chain legs 24-25.
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * produces no new certificate; it re-states the per-leg verdicts already
 * recorded in imp-95224, imp-95225, imp-95226, imp-95133, imp-95249, and
 * imp-95250 as one table.
 * The COUNT leg is TERMINAL (exact Nevanlinna-Pick optimum, imp-95226).
 * The CROSS-OCTAVE/LATTICE leg is delivered only on the geometric-lattice
 * skeleton (imp-95226 COROLLARY BL-LAT); in-octave multiplicity and
 * off-lattice rates were named residuals of that leg. Seam chain leg 24
 * (imp-95249) FENCES the in-octave twin-pair residual with an explicit
 * collar; seam chain leg 25 (imp-95250) extends that fence to a twin pair
 * in every octave at unbounded octave count (m-uniform). Neither closes
 * the residual as a block Riesz-basis statement, and >= 3 rates per
 * octave stays a separate open residual. The WEIGHT and MODULUS/PHASE
 * legs remain OPEN. No bound of the Lambda program changes here. NO QED.
 * No refereed bound is changed.
 *
 * Source: imp-95224 (COROLLARY DC-NOGO), imp-95225 (THEOREM SGN-C),
 * imp-95226 (LEMMA PICK-ID, THEOREM NP-CERT, THEOREM SGN-NP, THEOREM
 * SGN-2X, COROLLARY COAL-2, PROP BL, COROLLARY BL-LAT), imp-95133
 * (WP-A / WP-B weight-leg scoping), imp-95249 (THEOREM SPLIT-2, THEOREM
 * ANG-PENCIL, LEMMA ANG-DET, COROLLARY IN-OCT), imp-95250 (LEMMA LOO,
 * THEOREM SPLIT-LOO, COROLLARY EV-OCT, COROLLARY EV-OCT-UNIF).
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
  {
    leg: 'IN-OCTAVE PAIR (seam leg 24)',
    role: 'fences the in-octave-multiplicity residual of CROSS-OCTAVE (LATTICE) for a single tight twin pair',
    status: 'FENCED',
    grade:
      'imp-95249 THEOREM SPLIT-2 + THEOREM ANG-PENCIL + LEMMA ANG-DET + ' +
      'COROLLARY IN-OCT: subspace-angle split prices the pair nu_2 = r ' +
      'nu_1, r -> 1+, that drives the raw BL bound to infinity ' +
      '(imp-95232 FINDING 3); coalescent fence = 0.9998618, split collar ' +
      '(1 - fence)^(-1) = 7236, certificate fires (< 1) only for ' +
      'x > xStarSplit = 7.101831 vs the twin-free BL onset 4.24 -- ' +
      'honest scope is a single tight pair, not general multiplicity',
    subGap: null,
  },
  {
    leg: 'EVERY-OCTAVE MULTIPLICITY (seam leg 25)',
    role: 'extends the leg-24 fence to a twin pair in every octave at unbounded octave count',
    status: 'FENCED',
    grade:
      'imp-95250 LEMMA LOO + THEOREM SPLIT-LOO + COROLLARY EV-OCT + ' +
      'COROLLARY EV-OCT-UNIF: leave-one-out additive split makes the ' +
      'twin-pair fence m-uniform (onset x = 11.31664319 at m = 6) and ' +
      'm-and-r-uniform (onset x = 27.035582) via the imp-95251 N-fold ' +
      'coalescence law; collar is large (~1.6e4x above the exact pencil ' +
      'at m = 6, r = 1.05, x = 12); >= 3 rates per octave and the ' +
      'abstract m-uniform block Riesz-basis bound remain separate open ' +
      'residuals, not closed here',
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
  fenced: ['IN-OCTAVE PAIR (seam leg 24)', 'EVERY-OCTAVE MULTIPLICITY (seam leg 25)'],
  deadCount: 1,
  terminalCount: 1,
  deliveredCount: 1,
  openCount: 2,
  fencedCount: 2,
  totalCount: 7,
  certifiesPaperPackets: false,
  qed: false,
};

export const IMP_95142_SIGNED_CERTIFICATE_OBLIGATION_LEDGER = {
  id: 'imp-95142-signed-certificate-obligation-ledger',
  title:
    'imp-95226 signed-certificate chain, obligation (2) ledger: ' +
    'DEPTH-ONLY DEAD (imp-95224 DC-NOGO), COUNT TERMINAL (imp-95226 ' +
    'SGN-NP exact Pick optimum), CROSS-OCTAVE/LATTICE delivered on the ' +
    'lattice skeleton only (imp-95226 BL-LAT), its two named residuals ' +
    'FENCED at seam legs 24-25 (imp-95249 in-octave pair, imp-95250 ' +
    'every-octave multiplicity), WEIGHT and MODULUS/PHASE OPEN ' +
    '(imp-95133 scoping); does not certify the width-law paper packets',
  ledger: SIGNED_CERTIFICATE_OBLIGATION_LEDGER,
  summary: SIGNED_CERTIFICATE_OBLIGATION_SUMMARY,
  note:
    'consolidates imp-95224, imp-95225, imp-95226, imp-95133, imp-95249, ' +
    'imp-95250 per the imp-95226 ROUTING paragraph and the imp-95212-' +
    'subgap-fresnel-airy-envelope-port obligation (2) currency ledger',
};

// ── assertions (import-light; exact-literal consistency only) ───────────────
export const IMP_95142_ASSERTIONS = [
  {
    id: 'imp-95142-seven-legs-exhaustive',
    holds: () => SIGNED_CERTIFICATE_OBLIGATION_LEDGER.length === 7,
    why: 'the signed-certificate obligation (2) ledger has exactly seven currency/seam legs after the imp-95249/imp-95250 leg-24/leg-25 extension, no more, no fewer.',
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
      const fenced = byStatus((o) => o.status === 'FENCED');
      const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
      return (
        sameSet(dead, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.dead) &&
        sameSet(terminal, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.terminal) &&
        sameSet(delivered, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.delivered) &&
        sameSet(open, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.open) &&
        sameSet(fenced, SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.fenced) &&
        dead.length + terminal.length + delivered.length + open.length + fenced.length ===
          SIGNED_CERTIFICATE_OBLIGATION_SUMMARY.totalCount
      );
    },
    why: 'DEPTH-ONLY must be exactly the DEAD leg, COUNT exactly TERMINAL, CROSS-OCTAVE (LATTICE) exactly DELIVERED, WEIGHT/MODULUS-PHASE exactly the OPEN pair, and the leg-24/leg-25 seam extension exactly the FENCED pair, per imp-95224/95225/95226/95133/95249/95250.',
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
    id: 'imp-95142-seam-leg-onset-ordering',
    holds: () => {
      const xStarBL = 4.24;
      const xStarSplit = 7.101831;
      const xStarEvOct = 11.31664319;
      const xStarUnif = 27.035582;
      return xStarBL < xStarSplit && xStarSplit < xStarEvOct && xStarEvOct < xStarUnif;
    },
    why: 'the leg-24/leg-25 fences delay the certificate firing onset monotonically past the twin-free BL onset: BL (4.24) < single-pair SPLIT-2 (7.101831) < m-uniform EV-OCT at m = 6 (11.31664319) < m-and-r-uniform EV-OCT-UNIF (27.035582), matching the honest-collar language recorded in imp-95249 and imp-95250.',
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
