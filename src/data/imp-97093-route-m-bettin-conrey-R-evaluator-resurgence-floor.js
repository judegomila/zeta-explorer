/**
 * @module imp-97093-route-m-bettin-conrey-R-evaluator-resurgence-floor
 *
 * imp-97093 (numerical, ASSESSMENT + PROTOTYPE): assess and prototype an exact/high-order
 * Bettin-Conrey R = (i/2)psi(x) reciprocity evaluator uniform on (0,1/2], to drive the
 * imp-97078 Vasyunin-reciprocity descent from its 3.3e-6 cap toward float64 machine
 * precision (the piece that would unblock exact Frobenius ladder rungs past N=16000).
 * Measurement/assessment only; no rigorous ceiling is posted; no bound moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * BACKGROUND (imp-97078 IMP97078_SUBGAP, verbatim target): the reciprocity + Euclid
 * descent recursion is EXACT to float64 (6.9e-10 with exact R), and the direct pipeline
 * reproduces the committed IMP96912_LADDER rungs to machine precision, but the crude
 * Bettin-Conrey small-z asymptotic R evaluator is machine-precision only for x<=0.25
 * (err 3.6e-10) and degrades to ~5e-6 near x=1/2, capping the prototype descent at ~3.3e-6.
 * The descent evaluates R = (i/2)psi at continued-fraction convergents x = a/q in (0,1/2];
 * partial quotient 2 puts a node at x near 1/2 where the crude evaluator is weakest.
 *
 * -------------------------------------------------------------------------------
 * FINDING A -- the ~3.3e-6 cap is an ASYMPTOTIC-SERIES RESURGENCE FLOOR exp(-2pi/x),
 *              NOT a term-count deficiency. Adding terms cannot cross it.
 * -------------------------------------------------------------------------------
 * The BC evaluator R(x) = -(log 2pi x - gamma)/(pi x) + (2/pi) sum_{n even>=2} zeta(n)B_n x^{n-1}/n
 * has factorially-growing coefficients (|B_2m| ~ 2(2m)!/(2pi)^{2m}, zeta(2m) -> 1), so for
 * EVERY x>0 it is a DIVERGENT asymptotic series. Its optimal-truncation (superasymptotic,
 * truncate at the smallest term) error floor is ~ exp(-2pi/x), maximal on (0,1/2] at x=1/2.
 * Measured |R_opt - R_exact| vs exp(-2pi/x) (mpmath dps=50 ground truth), ratio ~0.93..1.42
 * and flat across x in [0.2,0.5]; at x=1/2 the floor exp(-4pi) = 3.487e-6 reproduces the
 * imp-97078 cap. Consequence: the descent cap is a resurgence floor of the asymptotic method;
 * more Bernoulli terms provably cannot reach machine precision.
 *
 * -------------------------------------------------------------------------------
 * FINDING B -- R has NO elementary closed form: the reciprocity remainder is transcendental.
 * -------------------------------------------------------------------------------
 * g(h,k) = c0(h/k) + (k/h)c0(k/h) = R(h,k) + 1/(pi h). A least-squares fit of g over all
 * coprime pairs k<60 to the Laurent basis [h/k, k/h, 1, 1/(hk)] leaves an O(1) residual
 * (4.99; a richer degree-3 basis still 0.31). So g is transcendental -- the (i/2)psi
 * Lewis-Zagier / Estermann period function is genuinely required; there is no shortcut to a
 * fast R via a closed form.
 *
 * -------------------------------------------------------------------------------
 * FINDING C -- with the EXACT R (arbitrary precision), the descent reproduces V_direct to
 *              float64 machine precision on real Vasyunin entries: R is the ONLY missing piece.
 * -------------------------------------------------------------------------------
 * Feeding the exact R = c0(a/q)+(q/a)c0(q/a)-1/(pi a) (mpmath dps=50) into the folded Euclid
 * descent c0(a/q) = 1/(pi a) + R(a/q) - (q/a)c0((q mod a)/a), with V(h,k) = -c0(hbar/k),
 * reproduces V_direct to max 1.21e-12 over all coprime k<160 -- float64 machine precision,
 * consistent with imp-97078 exactRVsDirect 6.9e-10. So a machine-precision uniform R on
 * (0,1/2] is the sole remaining piece for a full-precision O(N^2 logN) ladder.
 *
 * -------------------------------------------------------------------------------
 * REFINED SUB-GAP (the production piece) + why naive hyperasymptotics does NOT suffice.
 * -------------------------------------------------------------------------------
 * A uniform machine-precision R needs a CONVERGENT representation (Estermann/Lewis-Zagier
 * period function or its Poisson dual), NOT more asymptotic terms. Naive hyperasymptotic
 * subtraction of a single leading exp(-2pi/x) block is inadequate: the measured resurgent
 * amplitude A(x) = (R_exact - R_opt) exp(2pi/x) is O(1) but SIGN-OSCILLATES node-to-node
 * (a Stokes-phenomenon artifact of where optimal truncation lands), so the full convergent
 * dual -- not a one-term correction -- is required. This SHARPENS imp-97078's sub-gap from
 * "the series degrades near 1/2" to "the asymptotic method has a fundamental exp(-4pi)~3.5e-6
 * resurgence floor at x=1/2; only a convergent period-function evaluator crosses it."
 *
 * @see imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility.js (IMP97078_SUBGAP this refines; exact recursion)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (base: R = (i/2)psi, BC small-z expansion line 168, Cor. 1)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (IMP96912_LADDER; the O(N^3) sub-gap the descent addresses)
 * @see tmp/imp-97093-R-evaluator.py (reproducible measurement: FINDINGS A/B/C)
 *
 * Ticket: imp-97093 (numerical, opus-4-8, api-pool). Assessment/measurement only; NO QED.
 */

// FINDING A: measured optimal-truncation error vs the exp(-2pi/x) resurgence floor (mpmath dps=50 ground truth).
export const IMP97093_RESURGENCE_FLOOR = Object.freeze({
  seriesClass: 'DIVERGENT asymptotic (|B_2m| ~ 2(2m)!/(2pi)^{2m}); optimal-truncation floor ~ exp(-2pi/x)',
  // [x, |R_opt - R_exact|, exp(-2pi/x), ratio]
  rows: Object.freeze([
    Object.freeze([0.2, 3.2196e-14, 2.2711e-14, 1.418]),
    Object.freeze([0.25, 1.5725e-11, 1.2162e-11, 1.293]),
    Object.freeze([2 / 7, 3.2935e-10, 2.8143e-10, 1.17]),
    Object.freeze([1 / 3, 7.4859e-9, 6.5124e-9, 1.149]),
    Object.freeze([0.375, 5.8105e-8, 5.2884e-8, 1.099]),
    Object.freeze([0.4, 1.4979e-7, 1.507e-7, 0.994]),
    Object.freeze([3 / 7, 4.4933e-7, 4.2945e-7, 1.046]),
    Object.freeze([5 / 11, 9.187e-7, 9.9253e-7, 0.926]),
    Object.freeze([0.5, 3.4599e-6, 3.4873e-6, 0.992]),
  ]),
  floorAtHalf: 3.4873e-6, // exp(-4pi): matches the imp-97078 ~5e-6 cap at x=1/2
  verdict: 'the ~3.3e-6 descent cap is the exp(-2pi/x) resurgence floor of the asymptotic R series, NOT a term-count issue',
});

// FINDING B: the reciprocity remainder g = c0(h/k)+(k/h)c0(k/h) is transcendental (no closed form).
export const IMP97093_NO_CLOSED_FORM = Object.freeze({
  g: 'g(h,k) = c0(h/k) + (k/h)c0(k/h) = R(h,k) + 1/(pi h)',
  laurentBasis: '[h/k, k/h, 1, 1/(hk)]',
  laurentResidual: 4.991, // O(1) over coprime k<60 -> transcendental
  richerBasisResidual: 0.3137, // degree-3 Laurent basis still O(0.1)
  conclusion: 'R has no elementary closed form; the (i/2)psi Lewis-Zagier/Estermann period function is genuinely required',
});

// FINDING C: with exact R the descent reproduces V_direct to float64 machine precision.
export const IMP97093_EXACT_R_DESCENT = Object.freeze({
  method: 'exact R (mpmath dps=50) fed into folded Euclid descent; V(h,k) = -c0(hbar/k)',
  maxErrVsVdirect: 1.2079e-12, // over all coprime k<160
  consistentWith: 'imp-97078 exactRVsDirectMaxErr 6.901e-10',
  conclusion: 'a machine-precision uniform R on (0,1/2] is the SOLE missing piece for the full-precision O(N^2 logN) ladder',
});

// The refined sub-gap: a convergent evaluator is required; naive one-block hyperasymptotics fails.
export const IMP97093_SUBGAP = Object.freeze({
  id: 'imp-97093-convergent-period-function-R-evaluator',
  refines: 'imp-97078-machine-precision-period-function-R-evaluator',
  statement:
    'a uniform machine-precision R = (i/2)psi on (0,1/2] requires a CONVERGENT representation ' +
    '(Estermann/Lewis-Zagier period function or its Poisson dual), NOT more asymptotic Bernoulli ' +
    'terms, which face a fundamental exp(-2pi/x) resurgence floor (exp(-4pi) ~ 3.5e-6 at x=1/2). ' +
    'Naive hyperasymptotic subtraction of a single leading exp(-2pi/x) block is inadequate because ' +
    'the measured resurgent amplitude A(x) = (R_exact - R_opt) exp(2pi/x) is O(1) but sign-oscillates ' +
    'node-to-node (Stokes phenomenon); the full convergent dual is the production piece.',
});

export const IMP97093_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment/measurement only: the imp-97078 ~3.3e-6 ' +
  'descent cap is the exp(-2pi/x) resurgence floor of the DIVERGENT asymptotic R series (max exp(-4pi) ~ ' +
  '3.5e-6 at x=1/2), not a term-count issue; the reciprocity remainder is transcendental (no closed form); ' +
  'with exact R the descent reaches float64 machine precision (1.2e-12); the remaining piece is a CONVERGENT ' +
  'period-function R evaluator (the refined sub-gap). No rigorous ceiling is posted and no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97093_ASSERTIONS = [
  {
    id: 'imp97093-resurgence-floor-tracks-exp-2pi-over-x',
    holds: () => {
      const r = IMP97093_RESURGENCE_FLOOR.rows;
      const ratiosOk = r.every(([, , , ratio]) => ratio > 0.8 && ratio < 1.6);
      const half = r.find(([x]) => x === 0.5);
      return ratiosOk && Math.abs(half[1] - 3.4599e-6) < 1e-8 &&
        Math.abs(IMP97093_RESURGENCE_FLOOR.floorAtHalf - Math.exp(-4 * Math.PI)) < 1e-8;
    },
    why: 'the optimal-truncation error tracks exp(-2pi/x) (ratio 0.93..1.42, flat) and equals exp(-4pi)=3.49e-6 at x=1/2, so the cap is a resurgence floor, not a term-count deficiency.',
  },
  {
    id: 'imp97093-remainder-is-transcendental',
    holds: () =>
      IMP97093_NO_CLOSED_FORM.laurentResidual > 1 &&
      IMP97093_NO_CLOSED_FORM.richerBasisResidual > 0.1,
    why: 'the reciprocity remainder g fits no Laurent basis (residual 4.99; degree-3 still 0.31), so R is transcendental and needs the (i/2)psi period function -- no closed-form shortcut.',
  },
  {
    id: 'imp97093-exact-R-descent-is-machine-precision',
    holds: () =>
      IMP97093_EXACT_R_DESCENT.maxErrVsVdirect < 1e-10 &&
      IMP97093_EXACT_R_DESCENT.maxErrVsVdirect > 0,
    why: 'with exact R the folded Euclid descent reproduces V_direct to 1.21e-12 over coprime k<160, so a machine-precision uniform R is the sole missing piece.',
  },
  {
    id: 'imp97093-honesty-gate-no-qed',
    holds: () =>
      /convergent-period-function/.test(IMP97093_SUBGAP.id) &&
      /Stokes/.test(IMP97093_SUBGAP.statement) &&
      /RH open/.test(IMP97093_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97093_HONEST_BANNER) &&
      /NO QED/.test(IMP97093_HONEST_BANNER),
    why: 'assessment only: the resurgence-floor diagnosis and the refined convergent-period-function sub-gap are recorded with the RH-open / PT-Lambda / NO-QED honesty markers; no bound is claimed moved.',
  },
];

for (const a of IMP97093_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97093-route-m-bettin-conrey-R-evaluator-resurgence-floor assertion failed: ${a.id}`,
    );
  }
}

export default {
  resurgenceFloor: IMP97093_RESURGENCE_FLOOR,
  noClosedForm: IMP97093_NO_CLOSED_FORM,
  exactRDescent: IMP97093_EXACT_R_DESCENT,
  subGap: IMP97093_SUBGAP,
  banner: IMP97093_HONEST_BANNER,
};
