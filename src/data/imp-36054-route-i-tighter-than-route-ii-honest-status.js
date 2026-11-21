/**
 * @module imp-36054-route-i-tighter-than-route-ii-honest-status
 * @fileoverview imp-36054 -- standalone HONEST-STATUS note (imp-36005-style banner pattern)
 *   recording the imp-35988 finding that, of the two admissible derivative-error-cap routes
 *   imp-35832 named for certifying B = sup|H_t prime| (the imp-35777 I2 panel cap numerator),
 *   Route I (the separate additive cap C_t prime = E_A prime + E_B prime + E_{C_0} prime,
 *   with the finite main terms A_t + B_t differentiated EXACTLY termwise) is PROVABLY TIGHTER
 *   than Route II (the Cauchy estimate sup_disk|H_t|/r) on all three structural axes: (1) exact
 *   termwise main terms beat the coarser Cauchy-analytic 1/r bound; (2) the EXACT identity
 *   log N = w - (1/2) log 2 makes Route II's frequency factor w LARGER than Route I's log N by
 *   half a nat (w/logN ~ 1.0265, ~2.65% at T_PT); (3) Route II's uniform 1/r fold over a 2D disk
 *   sup is a third same-signed penalty Route I avoids. Read-only note: imports the imp-35988
 *   module verbatim (no re-derivation, no new numerics) and states the honesty boundary plainly
 *   for a reader who lands on this ticket without reading imp-35988 in full -- the panel-count
 *   cost of the looser Route II is only MARGINAL (a few percent), not an order of magnitude, so
 *   Route II remains the pragmatic default unless panel count is the binding constraint.
 *
 *   Ticket: imp-36054 (content, low). Note only; re-reads nothing new; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35988-i2-derivative-cap-route-comparison.js (source module this note restates)
 *   @see imp-35832-i2-derivative-bound-from-i1-enclosure-scope (named the two routes, OOM-consistent only)
 *   @see imp-35845-d2-differentiated-truncation-cap-amplification (route I sharp constant A_amp = log N)
 *   @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap L_panel . (B/delta) < pi; B = sup|H_t prime|)
 *   @see imp-36040-route-ii-optimal-cauchy-radius.js (assesses whether an optimal r rescues Route II -- it does not)
 *   @see imp-36005-i2-derivative-bound-new-ingredient-honest-status.js (the banner pattern this note follows)
 */

import { IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON } from './imp-35988-i2-derivative-cap-route-comparison.js';

const SRC = IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON;

export const IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS = Object.freeze({
  id: 'imp-36054',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: Route I (separate additive derivative-error cap) is PROVABLY TIGHTER ' +
    'than Route II (Cauchy estimate) for the imp-35777 I2 sup|H_t prime| cap, on all three ' +
    'structural axes, with the exact identity log N = w - (1/2) log 2 driving a ~2.65% frequency ' +
    'gap at T_PT',
  sourceModule: 'imp-35988-i2-derivative-cap-route-comparison.js',

  tightnessOrdering: SRC.tightnessOrdering,
  slackSourceCount: SRC.slackSources.length,
  frequencyFloor: Object.freeze({
    routeI_logN: SRC.frequencyFloor.routeI_logN,
    routeII_w: SRC.frequencyFloor.routeII_w,
    exactGap_halfLog2: SRC.frequencyFloor.exactGap_halfLog2,
    bRatioFreqFloor: SRC.frequencyFloor.bRatioFreqFloor,
    extraPanelPct: SRC.frequencyFloor.extraPanelPct,
  }),
  isRigorous: SRC.isRigorous,

  honestyBoundary:
    'Route I and Route II AGREE only to order of magnitude (both ~ |H_t| . w, imp-35832); the ' +
    'sharp comparison breaks the tie for Route I on three same-signed axes. (1) MAIN-TERM ' +
    'SHARPNESS: Route I differentiates the finite A_t + B_t Dirichlet sum EXACTLY termwise, the ' +
    'sharpest possible derivative bound, while Route II bounds the same main terms by the coarser ' +
    '1/r Cauchy-analytic inflation it applies to everything. (2) FREQUENCY CONSTANT: Route I ' +
    'amplifies its error cap by log N (the imp-35845 tail-weighted constant); Route II inflates by ' +
    '1/r = w at the natural gap-fraction radius; the EXACT identity log N = w - (1/2) log 2 makes ' +
    'Route II larger by half a nat, so w/logN ~ 1.0265 -- a ~2.65% frequency-factor gap at T_PT ' +
    '(N ~ 4.886e5). (3) UNIFORM-FOLD + DISK-SUP: Route II applies its single 1/r inflation to the ' +
    'ENTIRE sup|H_t| (main and error folded together) over a 2D disk, whose sup is >= the 1D ' +
    'boundary-segment value; Route I applies the large factor only to the small error half. All ' +
    'three point the same way, so B_I <= B_II structurally.',

  panelCostCaveat:
    'The tightness gap is MARGINAL, not an order of magnitude: since L_panel = pi/(B/delta) makes ' +
    'panel count n scale LINEARLY with B (delta shared by both routes), the panel-count ratio ' +
    'n_II/n_I = B_II/B_I has a frequency-factor floor of w/logN ~ 1.0265 -- Route II costs only ' +
    '~2.65% MORE panels from the constant alone (strictly more once the neighbourhood slack is ' +
    'added). Because Route I must re-run an independent Polymath15 differentiated-tail budget ' +
    '(E_A prime + E_B prime + E_{C_0} prime) while Route II reuses the I1 value machinery on a ' +
    'disk with no new estimates, the cheaper Route II remains the pragmatic default unless panel ' +
    'count is the binding constraint.',

  conclusion:
    'imp-35988 shows the two admissible derivative-error-cap routes for the imp-35777 I2 panel ' +
    'cap are not interchangeable in tightness: Route I (separate additive cap) is strictly tighter ' +
    'on three same-signed structural axes, and the exact identity log N = w - (1/2) log 2 pins the ' +
    'frequency-factor gap at exactly half a nat (~2.65% at T_PT). The resulting panel-count cost of ' +
    'choosing the looser-but-cheaper Route II is only marginal. It certifies no cap, instantiates ' +
    'no enclosure, and changes no bound. I2 remains GREENFIELD downstream of W1.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    certifiesDerivativeBoundB: false,
    certifiesI2Cap: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35988: Route I (the separate additive derivative-error ' +
    'cap C_t prime) is provably TIGHTER than Route II (the Cauchy estimate) on all three ' +
    'structural axes -- exact termwise main terms, a smaller frequency constant (log N versus w, ' +
    'exactly half a nat apart via log N = w - (1/2) log 2), and no uniform-fold + disk-sup penalty. ' +
    'The resulting panel-count cost of the looser Route II is MARGINAL (~2.65% more panels from the ' +
    'frequency floor alone), not an order of magnitude, so Route II remains the pragmatic default ' +
    'unless panel count binds. Restatement only; changes no bound; C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
});

export const IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36054-source-is-not-rigorous',
    why: 'The core claim is a structural ordering assessment, not a certified free result -- the source module must itself be marked isRigorous:false.',
    holds: () =>
      IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.isRigorous === false && SRC.isRigorous === false,
  },
  {
    id: 'imp36054-three-slack-sources',
    why: 'The note must record exactly the three same-signed Route-II slack sources the source module identifies.',
    holds: () => IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.slackSourceCount === 3,
  },
  {
    id: 'imp36054-frequency-floor-matches-source',
    why: 'The recorded frequency-floor numbers (log N, w, exact gap, ratio, extra-panel pct) must match the imp-35988 source verbatim.',
    holds: () => {
      const f = IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.frequencyFloor;
      return (
        f.routeI_logN === SRC.frequencyFloor.routeI_logN &&
        f.routeII_w === SRC.frequencyFloor.routeII_w &&
        f.exactGap_halfLog2 === SRC.frequencyFloor.exactGap_halfLog2 &&
        f.bRatioFreqFloor === SRC.frequencyFloor.bRatioFreqFloor &&
        f.extraPanelPct === SRC.frequencyFloor.extraPanelPct &&
        f.bRatioFreqFloor > 1.02 && f.bRatioFreqFloor < 1.03
      );
    },
  },
  {
    id: 'imp36054-honesty-boundary-mentions-exact-identity',
    why: 'The honesty-boundary text must plainly name the exact identity driving the frequency gap, not just an approximate figure.',
    holds: () =>
      /log N = w - \(1\/2\) log 2/.test(IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.honestyBoundary) &&
      /B_I <= B_II structurally/.test(IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.honestyBoundary),
  },
  {
    id: 'imp36054-panel-cost-caveat-marginal',
    why: 'The note must record that the tightness gap translates to only a marginal panel-count cost, not an order of magnitude.',
    holds: () => /MARGINAL/.test(IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.panelCostCaveat),
  },
  {
    id: 'imp36054-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim it certifies B or the I2 cap, nor claim a bound change.',
    holds: () =>
      IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.honestCaveat.certifiesDerivativeBoundB === false &&
      IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.honestCaveat.certifiesI2Cap === false &&
      IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36054-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36054-route-i-tighter-than-route-ii-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36054_ROUTE_I_TIGHTER_THAN_ROUTE_II_HONEST_STATUS;
