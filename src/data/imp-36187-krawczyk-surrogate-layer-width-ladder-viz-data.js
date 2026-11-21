/**
 * @module imp-36187-krawczyk-surrogate-layer-width-ladder-viz-data
 *
 * imp-36187 (ux): lightweight, import-light viz-data module baking the imp-36166 /
 * imp-36017 Krawczyk residual-node surrogate-vs-layer width ladder as plain literals, so
 * an analysis tab can render the surrogate/layer comparison and its a-independent 2x ratio
 * WITHOUT importing the imp-36017 measurement module (which pulls in lambda-rh-height-mapping
 * and polymath15-constant-C-C) or the 16.7MB zeros bundle.
 *
 * The ten-rung ladder is the N_cross certificate-centre point (N ~ 3.28029e9, ratio ~ 1.8418)
 * followed by the imp-36017 N = 1e13 .. 1e21 axis sweep (step: one decade), showing the
 * surrogate-over-layer ratio W_surr/W_layer rising monotonically from ~1.9985 at N=1e13 and
 * locking to EXACTLY 2.0 by N=1e17 -- the bit-level nextafter surrogate applies 2 ULP of
 * outward-rounding slack per operation (nextUp AND nextDown on the same nearest value) versus
 * ~1 ULP for a correctly-rounded directed-rounding layer, so the composite converges to a clean
 * factor of two. The ratio is flat and a-independent: both widths scale with ULP(m), so the
 * gap is a fixed rounding-primitive property, not a 1/a effect.
 *
 * Follows the imp-36186 / imp-36185 / imp-35791 import-light pattern: baked literals only, no
 * re-derivation, no heavy import, no re-import of the imp-36017/imp-36166 chain.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-36017 per-rung literals verbatim;
 * changes no bound; imp-34714a (Krawczyk existence/uniqueness) and imp-34687a (directed-rounding
 * layer) REMAIN OPEN/UNIMPLEMENTED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * HONEST-STATUS BANNER (imp-36283). The "layer" column is an a-priori correctly-rounded
 * directed-rounding MODEL only -- NOT the unimplemented imp-34687a layer -- and the surrogate
 * column instantiates NO certified interval. The 2x ratio therefore shows the surrogate is a
 * NECESSARY conservative upper model at every ladder rung, not a SUFFICIENT machine certificate.
 *
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js (source: the surrogate/layer width sweep and N_cross figures)
 * @see imp-36166-residual-node-storyline-cross-reference.js (narrative assembling this ladder into the three-stage residual-node storyline)
 * @see imp-36186-kbn-kahan-two-episode-separation-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-36187 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER = [
  { N: 3.28029435e9, label: 'N_cross', wSurr: 1.9073e-6, wLayer: 1.0356e-6, ratio: 1.841825, atExactTwo: false },
  { N: 1e13, label: '1e13', wSurr: 3.90625e-3, wLayer: 1.954637e-3, ratio: 1.998452, atExactTwo: false },
  { N: 1e14, label: '1e14', wSurr: 3.125e-2, wLayer: 1.562651e-2, ratio: 1.999806, atExactTwo: false },
  { N: 1e15, label: '1e15', wSurr: 2.5e-1, wLayer: 1.250021e-1, ratio: 1.999967, atExactTwo: false },
  { N: 1e16, label: '1e16', wSurr: 4.0, wLayer: 2.000002, ratio: 1.999998, atExactTwo: false },
  { N: 1e17, label: '1e17', wSurr: 32.0, wLayer: 16.0, ratio: 2.0, atExactTwo: true },
  { N: 1e18, label: '1e18', wSurr: 256.0, wLayer: 128.0, ratio: 2.0, atExactTwo: true },
  { N: 1e19, label: '1e19', wSurr: 4096.0, wLayer: 2048.0, ratio: 2.0, atExactTwo: true },
  { N: 1e20, label: '1e20', wSurr: 32768.0, wLayer: 16384.0, ratio: 2.0, atExactTwo: true },
  { N: 1e21, label: '1e21', wSurr: 262144.0, wLayer: 131072.0, ratio: 2.0, atExactTwo: true },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36187_ASSERTIONS = [
  {
    id: 'imp36187-ten-rungs-ordered-by-N',
    description: 'Ten rungs (N_cross plus nine decade sweep points) sit in strictly increasing N order',
    holds: () =>
      IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER.length === 10 &&
      IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER.every(
        (r, i, arr) => i === 0 || r.N > arr[i - 1].N,
      ),
  },
  {
    id: 'imp36187-ratio-monotone-nondecreasing',
    description: 'The surrogate-over-layer ratio is monotone non-decreasing up the ladder',
    holds: () =>
      IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER.every(
        (r, i, arr) => i === 0 || r.ratio >= arr[i - 1].ratio,
      ),
  },
  {
    id: 'imp36187-ratio-bounded-below-two',
    description: 'Every ratio is > 1.5 and <= 2.0 (never exceeds the 2x ceiling)',
    holds: () =>
      IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER.every((r) => r.ratio > 1.5 && r.ratio <= 2.0 + 1e-9),
  },
  {
    id: 'imp36187-locks-to-exactly-two-from-1e17-up',
    description: 'From N=1e17 upward, every rung is flagged atExactTwo and has ratio exactly 2.0',
    holds: () => {
      const locked = IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER.filter((r) => r.N >= 1e17);
      return locked.length === 5 && locked.every((r) => r.atExactTwo === true && r.ratio === 2.0);
    },
  },
  {
    id: 'imp36187-n-cross-matches-imp36017-recorded-figure',
    description: 'The N_cross rung reproduces the imp-36017 recorded ratio_at_N_cross (~1.8418) figure',
    holds: () => {
      const cross = IMP36187_KRAWCZYK_SURROGATE_LAYER_WIDTH_LADDER[0];
      return cross.label === 'N_cross' && Math.abs(cross.ratio - 1.841825) < 1e-4;
    },
  },
];

for (const a of IMP36187_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36187-krawczyk-surrogate-layer-width-ladder-viz-data assertion failed: ${a.id}`);
  }
}
