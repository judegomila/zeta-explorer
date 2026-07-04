/**
 * @module imp-33237-eps-field-robust-transfer-modulus-viz-data
 *
 * imp-33237 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-3933 eps'-field-robust plateau-domination bootstrap transfer modulus.
 * Per-plateau field-channel slope C_field = W(1) - W(0) runs 9.502858e-8
 * (plateau 0) monotonically DOWN to 4.962059e-11 (plateau 9) across the 10
 * H_raw plateaus of N in [1e4, 1e6], tracking the analytic slope 3*H^4/64 to
 * within ~0.6% on every plateau. The full transfer width at unit field-error
 * (W(1)) tops out at 5.17164627e-7 (plateau 1) -- ~1.77e5x tighter than the
 * C_H-route E_coll placeholder 0.0913 at N* = 1e4.
 *
 * Reference literals are baked from the imp-3933 certified table -- no
 * re-derivation here.
 *
 * @see imp-3933-eps-field-robust-bootstrap.js (source module: EPS_FIELD_ROWS, EPS_FIELD_ROBUST_BOOTSTRAP)
 *
 * Ticket: imp-33237 (ux, low). Presentation only, RH-free; the W_1-channel
 * C_Lip impossibility proofs are untouched; NO QED.
 */

export const IMP33237_PLATEAUS = [
  { plateauIndex: 0, H: 0.0376985, cFieldSlope: 9.502858e-8, analytic3H4Over64: 9.467549e-8, w0: 3.1551985e-7, w1: 4.10548433e-7 },
  { plateauIndex: 1, H: 0.03530732, cFieldSlope: 7.327278e-8, analytic3H4Over64: 7.284509e-8, w0: 4.43891849e-7, w1: 5.17164627e-7 },
  { plateauIndex: 2, H: 0.02953763, cFieldSlope: 3.579063e-8, analytic3H4Over64: 3.568156e-8, w0: 1.60607652e-7, w1: 1.96398282e-7 },
  { plateauIndex: 3, H: 0.02583928, cFieldSlope: 2.09616e-8, analytic3H4Over64: 2.089599e-8, w0: 1.27309053e-7, w1: 1.48270656e-7 },
  { plateauIndex: 4, H: 0.0208495, cFieldSlope: 8.878897e-9, analytic3H4Over64: 8.857759e-9, w0: 6.32351372e-8, w1: 7.21140346e-8 },
  { plateauIndex: 5, H: 0.01948463, cFieldSlope: 6.769568e-9, analytic3H4Over64: 6.756316e-9, w0: 4.53525171e-8, w1: 5.21220848e-8 },
  { plateauIndex: 6, H: 0.01470148, cFieldSlope: 2.191989e-9, analytic3H4Over64: 2.189704e-9, w0: 1.37271093e-8, w1: 1.59190978e-8 },
  { plateauIndex: 7, H: 0.01305322, cFieldSlope: 1.362729e-9, analytic3H4Over64: 1.360855e-9, w0: 1.44113689e-8, w1: 1.57740976e-8 },
  { plateauIndex: 8, H: 0.00863639, cFieldSlope: 2.609083e-10, analytic3H4Over64: 2.607776e-10, w0: 2.2914189e-9, w1: 2.55232717e-9 },
  { plateauIndex: 9, H: 0.00570371, cFieldSlope: 4.962059e-11, analytic3H4Over64: 4.961021e-11, w0: 4.23757546e-10, w1: 4.73378132e-10 },
];

export const IMP33237_TRANSFER = {
  maxWidthAtEps1: 5.17164627e-7, // plateau 1: the tightest-side worst-case W(1) across all 10 plateaus
  eCollCHRouteN1e4: 0.0913, // C_H-route E_coll placeholder at N* = 1e4
  transferAdvantageFactor: 0.0913 / 5.17164627e-7, // ~1.77e5
};

export const IMP33237_LADDER_TIGHTENING_RATIO =
  IMP33237_PLATEAUS[0].cFieldSlope / IMP33237_PLATEAUS[9].cFieldSlope; // ~1915x, plateau0 vs plateau9 slope
