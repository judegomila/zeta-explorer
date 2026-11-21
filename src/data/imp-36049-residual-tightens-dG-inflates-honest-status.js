/**
 * @module imp-36049-residual-tightens-dG-inflates-honest-status
 * @fileoverview imp-36049 -- standalone HONEST-STATUS note (imp-36130-style restatement
 *   pattern) recording the imp-35969 finding that, of the two Krawczyk-operator difference
 *   nodes on the imp-34714a K(m) = m - [F-prime]^{-1} F(m) map, the residual node [F(m)] has
 *   an outward-rounded enclosure width that is A-INDEPENDENT (a few ULP of the operand
 *   magnitude m, essentially flat across N = 1e13 .. 1e21) while the imp-35810/imp-35855
 *   dG surplus-split node relative width INFLATES ~ (4/a) eps and DIVERGES as a(N) -> 0.
 *   Read-only note: imports the imp-35969 module verbatim (no re-derivation, no new
 *   numerics) and states the honesty boundary plainly for a reader who lands on this ticket
 *   without reading imp-35969/imp-35885/imp-35810 in full -- the imp-34714a certificate cost
 *   lives entirely in the dG node, not the residual node.
 *
 *   Ticket: imp-36049 (content, low). Note only; re-reads nothing new; changes no bound;
 *   imp-34714a REMAINS OPEN; C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed
 *   ; NO QED.
 *
 *   @see imp-35969-krawczyk-residual-directed-rounding-width.js (source module this note restates)
 *   @see imp-35885-krawczyk-node-cancellation-audit (NODE B: asserted the residual is a small tightening interval)
 *   @see imp-35810-cancellation-onset-height (the eps_mach/a dG departure envelope)
 *   @see imp-34714-krawczyk-fixed-point-map-enclosure (Krawczyk lemma; sub-gap imp-34714a)
 *   @see imp-36130-naive-vs-compensated-conditioning-growth-honest-status.js (the restatement pattern this note follows)
 */

import { IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH } from './imp-35969-krawczyk-residual-directed-rounding-width.js';

const M = IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH.measurement;

export const IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS = Object.freeze({
  id: 'imp-36049',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-34714a Krawczyk residual node [F(m)] enclosure width is ' +
    'a-INDEPENDENT (tightening) while the dG surplus-split node width INFLATES ~ (4/a) eps',
  sourceModule: 'imp-35969-krawczyk-residual-directed-rounding-width.js',

  residualRelWidthAtBottom: M.rel_width_at_bottom,
  residualRelWidthAtTop: M.rel_width_at_top,
  residualRelWidthMaxInEps: M.rel_width_max_in_eps,
  dGRelWidthAtBottom: M.dG_rel_width_at_bottom,
  dGRelWidthAtTop: M.dG_rel_width_at_top,
  dGToResidualRatioAtTop: M.dG_to_residual_rel_width_ratio_at_top,
  marginDecadesAtBottom: M.margin_decades_below_envelope_at_bottom,
  marginDecadesAtTop: M.margin_decades_below_envelope_at_top,

  honestyBoundary:
    'The imp-35969 sweep of both imp-34714a Krawczyk difference nodes over the same height axis ' +
    '(N = 1e13 .. 1e21) shows the residual node [F(m)] holding a relative enclosure width flat at ' +
    'a few machine epsilon (' +
    M.rel_width_max_in_eps.toFixed(1) +
    ' eps at most) -- TIGHTENING, not inflating, as a(N) -> 0 -- while the (imp-35855-de-cancelled) ' +
    'dG surplus-split node relative width grows ~ (4/a) eps, from ~ ' +
    M.dG_rel_width_at_bottom.toExponential(2) +
    ' at N~1e13 to ~ ' +
    M.dG_rel_width_at_top.toExponential(2) +
    ' at N~1e21 -- a divergence over ' +
    M.dG_to_residual_rel_width_ratio_at_top.toExponential(2) +
    'x the residual width at the top of the axis. This is a statement about WHICH node an ' +
    'imp-34687a directed-rounding certificate must actually pay for, not a new bound: the residual ' +
    'node is cheap and a-independent everywhere measured, so the entire certificate cost of ' +
    'imp-34714a lives in the dG node.',

  conclusion:
    'imp-35969 quantified the imp-35885 assertion that a directed-rounding residual F(m) would be ' +
    'a small nonzero tightening interval, confirming it numerically and contrasting it against the ' +
    'imp-35810 dG-node eps_mach/a departure envelope, whose margin WIDENS from ~ ' +
    M.margin_decades_below_envelope_at_bottom.toFixed(1) +
    ' to ~ ' +
    M.margin_decades_below_envelope_at_top.toFixed(1) +
    ' decades up the axis. The residual node is not where the imp-34714a certificate difficulty ' +
    'resides; the dG node is. This does not discharge imp-34714a and instantiates no certified ' +
    'interval.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    isNewMeasurement: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35969: the imp-34714a Krawczyk residual node [F(m)] ' +
    'outward-rounded enclosure width stays a-INDEPENDENT and flat at a few eps (max ~ ' +
    M.rel_width_max_in_eps.toFixed(1) +
    ' eps) across N = 1e13 .. 1e21, far below the imp-35810 eps_mach/a dG departure envelope, ' +
    'while the de-cancelled dG surplus-split node relative width DIVERGES ~ (4/a) eps over the same ' +
    'axis. The imp-34714a certificate cost lives entirely in the dG node, not the residual node. ' +
    'Restatement only; changes no bound; imp-34714a REMAINS OPEN; C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
});

export const IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36049-residual-width-flat-and-small',
    why: 'The core claim is that the residual node relative width stays small (a few eps) across the axis.',
    holds: () => IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.residualRelWidthMaxInEps < 16,
  },
  {
    id: 'imp36049-dG-width-diverges',
    why: 'The dG node relative width must grow substantially up the same axis, unlike the residual node.',
    holds: () =>
      IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.dGRelWidthAtTop >
      10 * IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.dGRelWidthAtBottom,
  },
  {
    id: 'imp36049-dG-dwarfs-residual-at-top',
    why: 'At the deepest a -> 0 point the dG node width must dwarf the residual node width, locating the cost.',
    holds: () => IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.dGToResidualRatioAtTop > 1e6,
  },
  {
    id: 'imp36049-margin-widens',
    why: 'The residual node margin below the dG envelope must widen up the axis, confirming tightening not inflation.',
    holds: () =>
      IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.marginDecadesAtTop >
      IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.marginDecadesAtBottom,
  },
  {
    id: 'imp36049-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim a new measurement or a bound change.',
    holds: () =>
      IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.honestCaveat.isNewMeasurement === false &&
      IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36049-verdict-no-qed-and-open',
    why: 'The verdict must record NO QED and that imp-34714a remains open, matching the standing no-refereed-bound-change caveat.',
    holds: () =>
      /NO QED/.test(IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.verdict) &&
      /imp-34714a REMAINS OPEN/.test(IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36049-residual-tightens-dG-inflates-honest-status assertion failed: ${assertion.id}`
    );
  }
}

export default IMP36049_RESIDUAL_TIGHTENS_DG_INFLATES_HONEST_STATUS;
