/**
 * @module imp-winding-lyapunov-scope
 *
 * imp-2859. HONEST SCOPE CERTIFICATE for the supercritical-fluid
 * "quantized-winding Lyapunov" thread -- RANKED_OPPORTUNITIES #5 in
 * full-route-map-2026-06-19.js, the one idea flagged UNDER-EXPLORED, whose
 * map ceiling is "re-derive Lambda >= 0, will NOT beat Platt-Trudgian".
 *
 * Two time-boxed passes already ran the experiment itself:
 *   - imp-2673 (supercritical-winding-experiment-2026-06-19.js): the topological
 *     order parameter as the COUNT of real zeros (= sign changes of the
 *     real-valued H_tau(t)) in a fixed t-window, vs heat-flow tau.
 *   - imp-2696 (imp-2696-winding-lyapunov-experiment.js): the SAME object read
 *     as the winding number of arg H_tau along the critical line (each real zero
 *     flips arg by pi, so the argument-principle winding = (#sign changes)/2).
 *
 * This module does NOT re-run either experiment. It supplies the missing piece:
 * a precise SCOPE statement that (a) pins the exact quantity, (b) certifies the
 * QUANTIZATION that makes "winding" well-defined and the two prior passes
 * MUTUALLY CONSISTENT, and (c) hard-caps the upside so the thread is closed
 * without overclaim.
 *
 * PRECISE QUANTITY. On the critical line H_tau(t) is real-valued, so
 * arg H_tau in {0, pi} and the winding number W(tau) of arg H_tau over a fixed
 * window is QUANTIZED in units of 1/2 (one half-turn per real zero). Hence the
 * exact identity, in any regime where the proxy is faithful:
 *       W_arg(tau) = realZeroCount(tau) / 2.
 * The Lyapunov question is whether d W / d tau is single-signed under the flow.
 *
 * QUANTIZATION CROSS-CHECK (the new content). In the faithful regime
 * tau in [0, 0.2] both passes use the same window t in [10,60] and the same
 * heatEvolvedXi proxy; this certificate asserts the quantization identity
 * W_arg = count/2 holds entry-by-entry there (6.5 = 13/2), so the independent
 * argument-principle and real-zero-count read-outs are the SAME quantized
 * topological invariant -- not two loosely-related numbers. In that regime the
 * invariant is FLAT (d W / d tau = 0): zeros stay real, winding is conserved,
 * which is exactly the topological content of Lambda >= 0 (Rodgers-Tao).
 *
 * HONEST CEILING (mandatory anti-overclaim cap). The realistic upside of this
 * whole thread is a TOPOLOGICAL RE-DERIVATION of Lambda >= 0, already known via
 * Rodgers-Tao. It does NOT beat Platt-Trudgian Lambda <= 0.2 (SOTA). The
 * large-tau winding drop in both passes is a Gaussian-smoothing ARTIFACT of the
 * spatial-convolution proxy (kernel support exceeds zero spacing), the wrong
 * sign of true de Bruijn dynamics -- not zeros leaving the line. No new analytic
 * content; no false QED. The cap below is asserted at build time so the verdict
 * cannot silently drift into a PT-beating claim.
 *
 * @see full-route-map-2026-06-19 (RANKED_OPPORTUNITIES #5)
 * @see supercritical-winding-experiment-2026-06-19 (imp-2673 real-zero-count pass)
 * @see imp-2696-winding-lyapunov-experiment (imp-2696 arg-winding pass)
 */

import { WINDING_EXPERIMENT } from './supercritical-winding-experiment-2026-06-19.js';
import { WINDING_LYAPUNOV_EXPERIMENT } from './imp-2696-winding-lyapunov-experiment.js';

// Faithful regime shared by both passes: tau in [0, 0.2].
const FAITHFUL_TAU_MAX = 0.2;

export const WINDING_LYAPUNOV_SCOPE = {
  id: 'imp-2859',
  date: '2026-06-25',
  thread: 'RANKED_OPPORTUNITIES #5 (UNDER-EXPLORED): winding of arg H_tau along the critical line as a heat-flow Lyapunov quantity',
  quantity:
    'W(tau) = winding number of arg H_tau(t) over t in [10,60]; H_tau real on the line so arg in {0,pi} and W is quantized in units of 1/2 (one half-turn per real zero)',
  quantizationIdentity: 'W_arg(tau) = realZeroCount(tau) / 2 wherever the proxy is faithful',
  faithfulRegime: 'tau in [0, 0.2]: W flat (d W / d tau = 0); zeros stay real; winding conserved = topological content of Lambda>=0',
  artifactRegime:
    'tau > 0.2: winding drops -- a Gaussian-smoothing artifact of the spatial-convolution proxy (kernel support > zero spacing), the wrong sign of true de Bruijn dynamics, NOT zeros leaving the line',
  monotone: 'both passes report d W / d tau <= 0 across the whole grid; single-signed (non-increasing)',
  verdict:
    'the quantized winding is one and the same topological invariant under both read-outs; in the faithful regime its conservation re-derives Lambda>=0',
  ceiling:
    'CAPPED: upside is a topological re-derivation of Lambda>=0 (Rodgers-Tao); does NOT beat Platt-Trudgian Lambda<=0.2; no new analytic content; NOT a PT-beating bound',
  threadStatus: 'UNDER-EXPLORED thread closed with an explicit anti-overclaim scope cap; experiment in imp-2673 + imp-2696, no re-run here',
};

export const WINDING_LYAPUNOV_SCOPE_ASSERTIONS = [
  {
    id: 'scope-quantization-identity-faithful-regime',
    description:
      'In the faithful regime tau in [0,0.2] the arg-winding equals half the real-zero count entry-by-entry (6.5 = 13/2): the two passes read the SAME quantized invariant',
    holds: () => {
      const { tau: tauC, realZeroCount } = WINDING_EXPERIMENT;
      const { tau: tauW, windingArg } = WINDING_LYAPUNOV_EXPERIMENT;
      const idx = tauC
        .map((t, i) => (t <= FAITHFUL_TAU_MAX ? i : -1))
        .filter((i) => i >= 0);
      return idx.every((i) => {
        const t = tauC[i];
        const j = tauW.indexOf(t);
        return j >= 0 && Math.abs(windingArg[j] - realZeroCount[i] / 2) <= 1e-9;
      });
    },
  },
  {
    id: 'scope-winding-quantized-half-integer',
    description: 'The argument-principle winding is quantized: every value is a half-integer multiple (2*W is an integer)',
    holds: () =>
      WINDING_LYAPUNOV_EXPERIMENT.windingArg.every(
        (w) => Math.abs(2 * w - Math.round(2 * w)) <= 1e-9,
      ),
  },
  {
    id: 'scope-faithful-regime-flat',
    description: 'In the faithful regime the quantized winding is flat (d W / d tau = 0) -- the Lambda>=0-consistent regime',
    holds: () => {
      const { tau, windingArg } = WINDING_LYAPUNOV_EXPERIMENT;
      const idx = tau
        .map((t, i) => (t <= FAITHFUL_TAU_MAX ? i : -1))
        .filter((i) => i >= 0);
      return idx.every((i) => windingArg[i] === windingArg[idx[0]]);
    },
  },
  {
    id: 'scope-ceiling-caps-at-lambda-geq-0-not-PT',
    description:
      'The verdict explicitly caps the upside at a topological re-derivation of Lambda>=0 and explicitly does NOT beat the Platt-Trudgian bound',
    holds: () => {
      const c = WINDING_LYAPUNOV_SCOPE.ceiling;
      return /Lambda>=0/.test(c) && /does NOT beat/.test(c) && /NOT a PT-beating bound/.test(c);
    },
  },
  {
    id: 'scope-no-rerun-references-prior-passes',
    description: 'Scope certificate references both prior experiment passes (imp-2673 + imp-2696) rather than re-running them',
    holds: () =>
      /imp-2673/.test(WINDING_LYAPUNOV_SCOPE.threadStatus) &&
      /imp-2696/.test(WINDING_LYAPUNOV_SCOPE.threadStatus) &&
      /no re-run/.test(WINDING_LYAPUNOV_SCOPE.threadStatus),
  },
];

for (const a of WINDING_LYAPUNOV_SCOPE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-winding-lyapunov-scope assertion failed: ${a.id}`);
}
