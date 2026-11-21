/**
 * @module imp-96577-route-i-certificate-constant-ladder-viz-data
 *
 * imp-96577 (ux): import-light viz-data leaf for the Route I D_S <= L_S
 * certificate floor-cost-vs-truncation ladder baked in
 * rh-route-i-uncertainty-concentration-certificate-2026-09-24.js
 * (UNCERTAINTY_CERTIFICATE_LITERALS.certificate.constantReconciliation),
 * which had no viz surface. The certified constant c(T) = m_T +
 * lambda_min(K_N|V_N) is a RIGOROUS lower bound on the true D_S <= L_S
 * constant C* = inf_h W(h)/||h||^2 for every finite T, and rises
 * monotonically with T because the minimizer has h(a) != 0 so its Fourier
 * tail decays like 1/t^2 (a floor loss of size ~C/T). Two independent
 * routes bracket C*: the from-below finite-T ladder (with a two-term
 * 1/T - 1/T^2 fit removing the positive-curvature bias of a naive 1/T
 * extrapolation) and the from-above Rayleigh-Ritz pencil-map value, and
 * they agree to < 0.05% once the 1/T^2 term is kept.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number here is copied verbatim
 * from the baked certificate literal (itself cross-checked by that
 * module's own assertions); no re-derivation, no fresh solve. Changes no
 * bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see rh-route-i-uncertainty-concentration-certificate-2026-09-24.js
 *   (UNCERTAINTY_CERTIFICATE_LITERALS.certificate, .constantReconciliation)
 *
 * Ticket: imp-96577 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { UNCERTAINTY_CERTIFICATE_LITERALS } from './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';

const CERT = UNCERTAINTY_CERTIFICATE_LITERALS.certificate;
const RECON = CERT.constantReconciliation;

// finite-T rigorous lower-bound ladder c(T) = m_T + lambda_min(K_N|V_N),
// values and N-pairing copied verbatim from the baked certificate.
export const IMP96577_LADDER = Object.freeze([
  { T: 200, N: 160, value: CERT.T200N160 },
  { T: 300, N: 240, value: CERT.T300N240 },
  { T: 400, N: 320, value: CERT.T400N320 },
  { T: 600, N: 440, value: CERT.T600N440 },
  { T: 800, N: 560, value: CERT.T800N560 },
]);

// naive two-point 1/T extrapolants (biased HIGH by positive curvature --
// they decrease monotonically toward the true constant as later, tail-safer
// T-pairs are used) vs. the two-term c(T) = C* - A/T - B/T^2 fit that
// removes the bias.
export const IMP96577_EXTRAPOLATION = Object.freeze({
  pure1overT: [
    { pair: '(200,400)', value: RECON.pure1overTExtrap.from200_400 },
    { pair: '(400,600)', value: RECON.pure1overTExtrap.from400_600 },
    { pair: '(600,800)', value: RECON.pure1overTExtrap.from600_800 },
  ],
  twoTermFit: {
    model: RECON.twoTermFit.model,
    on: RECON.twoTermFit.on,
    Cstar: RECON.twoTermFit.Cstar,
    altCstar: RECON.twoTermFit.altOn200_400_800Cstar,
  },
  ritzFromAbove: RECON.ritzFromAbove,
});

// the rigorous bracket on the true constant C*: from-below (largest finite-T
// certificate value) <= C* <= from-above (Rayleigh-Ritz pencil-map Ritz).
export const IMP96577_BRACKET = Object.freeze({
  lo: RECON.bracket.lo,
  hi: RECON.bracket.hi,
  widthPct: RECON.bracket.widthPct,
  bestEstimate: RECON.bracket.bestEstimate,
});

export const IMP96577_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every ladder value, extrapolant, and bracket endpoint plotted here is copied verbatim from the baked certificate constantReconciliation literal; no re-derivation, no fresh solve. c(T) is a rigorous (double-precision, non-interval) lower bound on C* for each finite T; the two-term fit and Ritz value are point estimates, not proved bounds themselves, but together they bracket C* into [9.2918e-4, 9.46e-4]. No bound is claimed beyond D_S <= L_S on pole-free h for 2a <= ln 3; nothing here localises a zero.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96577_ASSERTIONS = [
  {
    id: 'imp96577-ladder-is-five-points-monotone-increasing',
    holds: () =>
      IMP96577_LADDER.length === 5 &&
      IMP96577_LADDER.every((row, i) => i === 0 || row.value > IMP96577_LADDER[i - 1].value),
    why: 'the five finite-T certificate values must be present and strictly increasing with T (the floor cost shrinks as T grows).',
  },
  {
    id: 'imp96577-ladder-matches-baked-literal',
    holds: () =>
      IMP96577_LADDER[0].value === CERT.T200N160 &&
      IMP96577_LADDER[2].value === CERT.T400N320 &&
      IMP96577_LADDER[4].value === CERT.T800N560,
    why: 'ladder endpoints and midpoint must equal the baked certificate.T200N160/T400N320/T800N560 literals exactly.',
  },
  {
    id: 'imp96577-pure-1overt-extrapolants-decrease-toward-ritz',
    holds: () => {
      const [p1, p2, p3] = IMP96577_EXTRAPOLATION.pure1overT.map((p) => p.value);
      return p1 > p2 && p2 > p3 && p3 > IMP96577_EXTRAPOLATION.ritzFromAbove;
    },
    why: 'the naive 1/T extrapolants must decrease monotonically toward (but stay above) the from-above Ritz value, demonstrating the positive-curvature bias called out by the ticket.',
  },
  {
    id: 'imp96577-two-term-fit-agrees-with-ritz-under-half-percent',
    holds: () => {
      const rel = Math.abs(IMP96577_EXTRAPOLATION.twoTermFit.Cstar - IMP96577_EXTRAPOLATION.ritzFromAbove) /
        IMP96577_EXTRAPOLATION.ritzFromAbove;
      return rel < 0.0005;
    },
    why: 'the two-term (1/T - 1/T^2) fit constant must reconcile with the independent from-above Ritz value to < 0.05%, per the baked verdict.',
  },
  {
    id: 'imp96577-bracket-is-tight-and-ordered',
    holds: () =>
      IMP96577_BRACKET.lo < IMP96577_BRACKET.hi &&
      IMP96577_BRACKET.lo === IMP96577_LADDER[4].value &&
      IMP96577_BRACKET.widthPct > 0 && IMP96577_BRACKET.widthPct < 5,
    why: 'the rigorous bracket lower endpoint must equal the largest finite-T certificate value (T = 800), be strictly below the upper (Ritz) endpoint, and span less than 5% -- a tight bracket, not a hand-wave.',
  },
  {
    id: 'imp96577-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96577_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96577_HONEST_BANNER) &&
      /NO QED/.test(IMP96577_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96577_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96577-route-i-certificate-constant-ladder-viz-data assertion failed: ${a.id}`);
  }
}
