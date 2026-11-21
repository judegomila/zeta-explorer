/**
 * @module imp-95305-splitrz-vs-evoctunif-onset-viz-data
 *
 * imp-95305 (ux): lightweight, import-light viz-data module bakes sampled
 * curves of the imp-95252 COROLLARY SPLIT-RZ every-octave-twin certificate
 *   certSplitRz(x, r) = [ sum_{k>=0} coalLaw(2^k x) ] / A_blk(rho, r)
 * against the imp-95250 COROLLARY EV-OCT-UNIF certificate
 *   certUnif(x) = [ e^(-x)(1 + 2x) + 2 e^(-3x/2) ]^2 / PhiUnif,
 * both at unbounded octave count (every m), over x = 8..32 at window ratio
 * r = 1.3, rho = 2. SPLIT-RZ fires (< 1) at xStarRz = 15.981584, roughly
 * eleven depth units earlier than EV-OCT-UNIF's xStarUnif = 27.035582 --
 * the onset drop this ticket asks to be pictured.
 *
 * All curve values are recomputed here independently from the closed forms
 * documented in imp-95252-muniform-block-riesz-seam-pencil.js (coalLaw,
 * aTwin, aBlk, certSplitRz) and imp-95250-leaveoneout-multiblock-split-certificate.js
 * (envelope, PhiUnif, certUnif) -- no new derivation, no heavy import, no
 * re-import of the source modules (each carries its own self-executing
 * assertions). Follows the imp-95303 / imp-95304 import-light viz-data
 * pattern.
 *
 * PRESENTATION POINT. Both certificates are strictly decreasing in x and
 * eventually cross the fires-at-1 threshold; SPLIT-RZ crosses first
 * (xStarRz = 15.981584) because its m-uniform Riesz-basis denominator
 * A_blk, while tiny in absolute terms, avoids the double exponential
 * decay penalty that PhiUnif pays for depth-suppressing every higher
 * octave -- the two certificates trade a fixed denominator constant
 * against a numerator envelope, and here the fixed-constant route wins by
 * roughly eleven depth units at unbounded octave count.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95252 / imp-95250 closed
 * forms verbatim; changes no bound, no operator positivity, no RH claim;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-95252-muniform-block-riesz-seam-pencil.js (source: COROLLARY
 *   SPLIT-RZ certificate, A_blk, coalLaw)
 * @see imp-95250-leaveoneout-multiblock-split-certificate.js (source:
 *   COROLLARY EV-OCT-UNIF certificate, PhiUnif, envelope)
 *
 * Ticket: imp-95305 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

// window ratio / lattice base used throughout (imp-95252 convention)
export const IMP95305_WINDOW_RATIO = 1.3;
export const IMP95305_LATTICE_BASE = 2;

// firing onsets (bisected, documented in the source modules)
export const IMP95305_XSTAR_SPLITRZ = 15.981584;
export const IMP95305_XSTAR_EVOCTUNIF = 27.035582;

// certSplitRz(x, 1.3) vs certUnif(x), x = 8..32
export const IMP95305_CURVES = [
  { x: 8, splitRz: 2.1586422134e6, evOctUnif: 3.2735229185e15 },
  { x: 10, splitRz: 6.1604541776e4, evOctUnif: 9.1214903346e13 },
  { x: 12, splitRz: 1.6223254204e3, evOctUnif: 2.3656164091e12 },
  { x: 14, splitRz: 4.0406883006e1, evOctUnif: 5.8286069933e10 },
  { x: 15.981584, splitRz: 1.0000002088e0, evOctUnif: 1.4308954139e9 },
  { x: 16, splitRz: 9.6605650169e-1, evOctUnif: 1.3822346194e9 },
  { x: 18, splitRz: 2.2384741659e-2, evOctUnif: 3.1824936212e7 },
  { x: 20, splitRz: 5.0601345713e-4, evOctUnif: 7.1573129836e5 },
  { x: 22, splitRz: 1.1211802883e-5, evOctUnif: 1.5791672062e4 },
  { x: 24, splitRz: 2.4434479396e-7, evOctUnif: 3.4293901380e2 },
  { x: 26, splitRz: 5.2516246046e-9, evOctUnif: 7.3484949895e0 },
  { x: 27.035582, splitRz: 7.1564759629e-10, evOctUnif: 1.0000001086e0 },
  { x: 28, splitRz: 1.1154263737e-10, evOctUnif: 1.5567482930e-1 },
  { x: 30, splitRz: 2.3450589325e-12, evOctUnif: 3.2655054477e-3 },
  { x: 32, splitRz: 4.8865695769e-14, evOctUnif: 6.7910905707e-5 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, lnrho) => (2 * Math.PI) / lnrho / Math.cosh((Math.PI * w) / lnrho);
function aTwinExact(lnrho, lnr) {
  const tau = lnr / lnrho;
  const s2 = Math.sin(Math.PI * tau) ** 2;
  const Ppi = kernelP(Math.PI, lnrho);
  const P2pi = kernelP(2 * Math.PI, lnrho);
  return (4 * s2 * Ppi * P2pi) / (Ppi + 2 * P2pi);
}
function aBlkExact(lnrho, lnr) {
  return aTwinExact(lnrho, lnr) / (1 + sechHalf(lnr));
}
function coalLaw(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}
function certSplitRzExact(x, r) {
  let num = 0;
  for (let k = 0; k < 60; k++) num += coalLaw(2 ** k * x);
  return num / aBlkExact(Math.log(IMP95305_LATTICE_BASE), Math.log(r));
}
const PHI_UNIF = 9.977927681809e-21;
function envelope(x) {
  return Math.exp(-x) * (1 + 2 * x) + 2 * Math.exp(-1.5 * x);
}
function certUnifExact(x) {
  return envelope(x) ** 2 / PHI_UNIF;
}

const IMP95305_ASSERTIONS = [
  {
    id: 'imp95305-splitrz-matches-closed-form',
    description:
      'every baked certSplitRz(x, 1.3) value matches the imp-95252 closed form to 1e-6 relative',
    holds: () =>
      IMP95305_CURVES.every((p) => {
        const expected = certSplitRzExact(p.x, IMP95305_WINDOW_RATIO);
        return Math.abs(p.splitRz - expected) / expected < 1e-6;
      }),
  },
  {
    id: 'imp95305-evoctunif-matches-closed-form',
    description:
      'every baked certUnif(x) value matches the imp-95250 closed form to 1e-6 relative',
    holds: () =>
      IMP95305_CURVES.every((p) => {
        const expected = certUnifExact(p.x);
        return Math.abs(p.evOctUnif - expected) / expected < 1e-6;
      }),
  },
  {
    id: 'imp95305-splitrz-onset-brackets-one',
    description:
      'certSplitRz(x, 1.3) brackets 1 at xStarSplitRz = 15.981584 (+-1e-3 bisection)',
    holds: () =>
      certSplitRzExact(IMP95305_XSTAR_SPLITRZ - 1e-3, IMP95305_WINDOW_RATIO) > 1 &&
      certSplitRzExact(IMP95305_XSTAR_SPLITRZ + 1e-3, IMP95305_WINDOW_RATIO) < 1,
  },
  {
    id: 'imp95305-evoctunif-onset-brackets-one',
    description: 'certUnif(x) brackets 1 at xStarEvOctUnif = 27.035582 (+-1e-3 bisection)',
    holds: () =>
      certUnifExact(IMP95305_XSTAR_EVOCTUNIF - 1e-3) > 1 &&
      certUnifExact(IMP95305_XSTAR_EVOCTUNIF + 1e-3) < 1,
  },
  {
    id: 'imp95305-splitrz-fires-first',
    description:
      'the SPLIT-RZ onset sits strictly below the EV-OCT-UNIF onset (the ~11 depth-unit drop this ticket pictures)',
    holds: () => IMP95305_XSTAR_SPLITRZ < IMP95305_XSTAR_EVOCTUNIF,
  },
  {
    id: 'imp95305-both-monotone-decreasing',
    description: 'both baked curves are strictly decreasing in x over the sampled range',
    holds: () =>
      IMP95305_CURVES.every(
        (p, i) =>
          i === 0 ||
          (p.splitRz < IMP95305_CURVES[i - 1].splitRz && p.evOctUnif < IMP95305_CURVES[i - 1].evOctUnif),
      ),
  },
];

for (const a of IMP95305_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95305-splitrz-vs-evoctunif-onset-viz-data assertion failed: ${a.id}`);
  }
}
