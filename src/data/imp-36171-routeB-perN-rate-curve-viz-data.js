/**
 * @module imp-36171-routeB-perN-rate-curve-viz-data
 *
 * imp-36171 (ux, low): lightweight, import-light viz-data module for a chart of
 * the imp-36082 Route-B per-N rate curve. Exposes, per ladder rung N, the
 * deterministic discrepancy bound D(N) = Theta(log gamma_N * N^{-1/2}) and the
 * Whitham-composed shock-time deviation rate r(N) = Theta(sqrt(log gamma_N) *
 * N^{-1/4}), both strictly decreasing and vanishing as N grows across eleven
 * decades (N = 1e2 .. 1e12).
 *
 * Reference literals are baked from the imp-36082 measured ladder -- no
 * re-derivation here. Presentation only: carries no RH verdict, closes no gap,
 * the imp-36082 CONSUMABLE-MODULO-ANCHOR status is untouched.
 *
 * @see imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (source module: RATE_LADDER)
 *
 * Ticket: imp-36171 (ux, low). Presentation only, RH-free; NO QED.
 */

export const IMP36171_C_PRIME = 1.9390570935241955; // imp-36082 C_prime = C_W sqrt(pi C_Selberg / sqrt(2 pi))

export const IMP36171_RATE_CURVE = [
  { N: 1e2, gammaN: 238.36665536251618, D_N: 2.0581210588113983, r_N: 1.4346152999363273 },
  { N: 1e3, gammaN: 1421.1115236089381, D_N: 0.8631169243962837, r_N: 0.9290408626084665 },
  { N: 1e4, gammaN: 9878.803411747636, D_N: 0.3458450178048457, r_N: 0.5880858932204085 },
  { N: 1e5, gammaN: 74921.81145539443, D_N: 0.1334555387420717, r_N: 0.3653156699925035 },
  { N: 1e6, gammaN: 600270.3913438587, D_N: 0.05002654320646322, r_N: 0.22366614228904477 },
  { N: 1e7, gammaN: 4992381.746455863, D_N: 0.01833842280159492, r_N: 0.13541943288019972 },
  { N: 1e8, gammaN: 42653550.3226956, D_N: 0.006605700348668559, r_N: 0.08127545969521525 },
  { N: 1e9, gammaN: 371870204.53354794, D_N: 0.0023463756183930685, r_N: 0.04843940150737897 },
  { N: 1e10, gammaN: 3293531632.6892166, D_N: 0.0008239998872215942, r_N: 0.028705398224403614 },
  { N: 1e11, gammaN: 29538618432.20116, D_N: 0.00028665514949958705, r_N: 0.01693089334617601 },
  { N: 1e12, gammaN: 267653395649.09848, D_N: 0.00009893520932700819, r_N: 0.009946617984370779 },
];
