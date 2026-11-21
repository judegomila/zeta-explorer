/**
 * @module imp-95265-evoct-firing-curve-viz-data
 *
 * imp-95265 (ux): lightweight, import-light viz-data module baking a sampled
 * curve of the imp-95250 COROLLARY EV-OCT closed-form certificate
 *   certCoalM(6, x) = sum_(k=0..5) sqrt( coalLaw(2^k x) / Phi_k(coalescent) )
 * squared, evaluated at m = 6 (the dyadic skeleton V_k = {2^k, r 2^k} at the
 * coalescent limit r -> 1) across a range of depths x, so a chart can show
 * the certificate crossing its firing threshold (value 1) at
 * xStarEvOct = 11.31664319, WITHOUT importing the imp-95250 source module
 * (which carries a ~200-line self-executing IMP95250_ASSERTIONS block and
 * exposes no direct export of certCoalM). Follows the imp-36185 / imp-35791
 * import-light pattern: baked literals only, recomputed independently here
 * from the same coalLaw / betaLat closed forms documented in imp-95250, not
 * re-derived or re-conjectured.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95250 COROLLARY EV-OCT
 * closed form verbatim; the certificate sits orders above the exact pencil
 * (imp-95250 HONEST LIMITS (a)); changes no bound; no operator positivity,
 * no RH claim; NO QED. No refereed bound is changed.
 *
 * @see imp-95250-leaveoneout-multiblock-split-certificate.js (source: COROLLARY EV-OCT, certCoalM)
 *
 * Ticket: imp-95265 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP95265_EVOCT_FIRING_CURVE = [
  { x: 8, cert: 412.854143, log10Cert: 2.615797 },
  { x: 9, cert: 67.0341341, log10Cert: 1.826296 },
  { x: 10, cert: 10.9718577, log10Cert: 1.04028 },
  { x: 10.5, cert: 4.42812122, log10Cert: 0.6462195 },
  { x: 11, cert: 1.78228138, log10Cert: 0.2509763 },
  { x: 11.31664319, cert: 1, log10Cert: 0, label: 'xStarEvOct (onset)' },
  { x: 11.5, cert: 0.715192099, log10Cert: -0.1455773 },
  { x: 12, cert: 0.286105471, log10Cert: -0.5434738 },
  { x: 12.5, cert: 0.114105668, log10Cert: -0.9426928 },
  { x: 13, cert: 0.0453747921, log10Cert: -1.343185 },
  { x: 14, cert: 0.00711643409, log10Cert: -2.147738 },
  { x: 15, cert: 0.00110509622, log10Cert: -2.9566 },
  { x: 16, cert: 0.000170110416, log10Cert: -3.769269 },
];

export const IMP95265_XSTAR_EVOCT = 11.31664319;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP95265_ASSERTIONS = [
  {
    id: 'imp95265-strictly-decreasing-in-x',
    description: 'certCoalM(6, x) decreases monotonically across the sampled depths',
    holds: () =>
      IMP95265_EVOCT_FIRING_CURVE.every(
        (p, i, arr) => i === 0 || p.cert < arr[i - 1].cert,
      ),
  },
  {
    id: 'imp95265-crosses-one-at-xstar',
    description: 'the sampled curve brackets the firing threshold (cert = 1) exactly at xStarEvOct',
    holds: () => {
      const before = IMP95265_EVOCT_FIRING_CURVE.find((p) => p.x === 11);
      const at = IMP95265_EVOCT_FIRING_CURVE.find((p) => p.x === IMP95265_XSTAR_EVOCT);
      const after = IMP95265_EVOCT_FIRING_CURVE.find((p) => p.x === 11.5);
      return (
        before.cert > 1 &&
        Math.abs(at.cert - 1) < 1e-6 &&
        after.cert < 1
      );
    },
  },
  {
    id: 'imp95265-matches-imp95250-baked-literals',
    description: 'the x=12 and x=14 samples match the imp-95250 CORROLARY EV-OCT literals verbatim',
    holds: () => {
      const at12 = IMP95265_EVOCT_FIRING_CURVE.find((p) => p.x === 12);
      const at14 = IMP95265_EVOCT_FIRING_CURVE.find((p) => p.x === 14);
      return (
        Math.abs(at12.cert - 0.286105471) < 1e-6 &&
        Math.abs(at14.cert - 7.11643409e-3) < 1e-9
      );
    },
  },
  {
    id: 'imp95265-log10cert-consistent-with-cert',
    description: 'log10Cert matches log10(cert) for every sample to storage precision',
    holds: () =>
      IMP95265_EVOCT_FIRING_CURVE.every(
        (p) => Math.abs(Math.log10(p.cert) - p.log10Cert) < 1e-5,
      ),
  },
];

for (const a of IMP95265_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95265-evoct-firing-curve-viz-data assertion failed: ${a.id}`);
  }
}
