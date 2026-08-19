import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull } from '../components/editorial/PostLayout.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';

/*
 * What We Know — the consolidated, artifact of everything this project has
 * established about zeta, RH, and the primes. Reads the verdict modules; authored
 * connective prose. The discipline is calibrated clarity: no RH proof, no beat of
 * the Lambda record -- but a rigorously MAP of where the walls are and why.
 *
 * Editorial (warm) restyle of the legacy dark page. Every claim, count, and status
 * label is preserved verbatim.
 */

const ROUTE_COUNT = FULL_ROUTE_MAP.totalRoutes;

const OVERCLAIMS = [
  ['Λ ≤ 0.0X at height 10¹³', 'frozen κ_T at T₀=3000 applied at 10¹³ — a height-mismatch artifact'],
  ['Wiener–Hopf ‖K_a‖ ≤ 1/a', '‖K_a‖ actually ~ e^{aT}; the bound was false'],
  ['§27 collapse identity', 'block-positivity ⟺ K_a-PSD refuted by a scale-invariance argument'],
  ['Volterra "5000× margin"', 'a homogeneity artifact — measuring a scale-miscalibrated operator'],
  ['finite-N*=10⁴ "beat"', 'an ESTIMATE, not rigorous — C_H is undischargeable'],
  ['the operator "collapse"', 'RH-equivalent, a reformulation — not a reduction'],
];

export default function WhatWeKnowPage() {
  return (
    <PostLayout
      grade="NO-GO"
      meta={[`${ROUTE_COUNT} mapped routes`, 'calibrated clarity']}
      title="What We Know"
      dek={
        <>The consolidated, state of what this project has actually figured out about
        ζ, the Riemann Hypothesis, and the primes — where the walls are and why.</>
      }
      byline={['mathexplorer', 'no RH proof · no beat of the Λ record']}
      ticker={<span>no-go map · Platt–Trudgian Λ ≤ 0.2 remains SOTA</span>}
      footer={<>
        Related: <Link to="/route-map">The wall map</Link>
        {' · '}<Link to="/rigor-dashboard">Rigor Dashboard</Link>
        {' · '}<Link to="/prime-rigidity">Prime rigidity</Link>
        {' · '}<Link to="/vortex-field">Vortex field</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <p className="lead">
        The discipline throughout is calibrated clarity — so the headline first:{' '}
        <strong>RH is not proved. The standalone repository presents
        Λ ≤ 0.1787854 as a computer-assisted candidate for an unconditional proof.
        The bound is not established, has been reviewed by Dan Romik, and is not RH. Λ ≤ 0.2
        (Platt–Trudgian) remains the peer-reviewed benchmark.</strong> Across{' '}
        <strong>{ROUTE_COUNT} mapped routes</strong>, every surviving route from a positive
        Newman bound to RH is still open, RH-equivalent, or dead.
      </p>

      <h2>① Established results and the separately graded candidate</h2>
      <ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>
        <li><strong>Standalone private-review Newman candidate:</strong> <strong>Λ ≤ 0.1787854</strong> is a computer-assisted candidate for an unconditional proof. Its package claims a compact-slab and final-time-half-strip closure, full material replay, corrected errors, and exact Polymath weld. The bound is not established, has been reviewed by Dan Romik, and is not RH.</li>
        <li><strong>Literature grades:</strong> <strong>Λ ≥ 0</strong> (Rodgers–Tao 2020) and the peer-reviewed upper benchmark <strong>Λ ≤ 0.2</strong> (Platt–Trudgian 2021). RH ⟺ Λ = 0.</li>
        <li><strong>Route B (Burgers / Koksma–Hlawka lim-sup):</strong> an unconditional, GUE-free, pair-correlation-free proof that lim supₙ |t_c(N)| = 0 for the N-particle Calogero–Moser/Dyson flow that models the zeros. This subsidiary theorem does not close the bridge to RH.</li>
        <li><strong>The Θ-trap theorems:</strong> Θ ≤ 1/4 as an unconditional flow invariant; the exact identity dg/ds = −(4/g)(1−Θ); Corollary A1 (t_c^part ≤ g_min²/6). Rigorous CM-flow algebra.</li>
        <li><strong>The R2-T isolation constant</strong> closed in closed form: c* = √(2+√3) − 1 ≈ 0.9319 (the single-shell case) — the one deterministic frontier residual, resolved.</li>
      </ul>

      <h2>② The two frontier walls — fully characterized</h2>
      <p>
        Every surviving mapped route seeking to drive the positive bound all the way to
        Λ = 0 funnels into one of two RH-hard objects. Both have been driven to ground by
        deliberate adversarial assault.
      </p>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra, #b5563f)' }}>
        <div className="tlab" style={{ color: 'var(--terra, #b5563f)' }}>
          C_H WALL — {CH_WALL_FRONTIER.verdict}
        </div>
        <div>
          The finite-height attack reduces to one constant, C_Lip (gap-Lipschitz at the
          zero-collision). The Lipschitz route to bounding it is <strong>provably closed three ways</strong>:
          a Hölder-½ lower bound C_Lip ≥ C_shock/(2√W₁) → ∞; a linear-N norm-mismatch
          (the metric W₁ dilutes a 2-particle collision across all N); and every surrogate refuted.
          <strong> Genuine fallout:</strong> the famous ∫2/g² divergence is a
          pure coordinate artifact — in h = g² it cancels exactly to C_shock².
        </div>
      </div>

      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">§26 μ^pass / VOLTERRA — RH-EQUIVALENT</div>
        <div>
          The elegant "7+ conjectures collapse to one operator-norm bound ‖V‖≤1" idea is
          <strong> PCC-free</strong> (real, surprising) but <strong>not a reduction</strong>: the collapse
          identity was refuted, and the surviving target is RH-equivalent — confirmed now at the
          <em> operator</em> level. The endpoint-bridge measure is mass-feasible (budget 2,400–20,000× the
          deficit) but the required <em>sign-positivity</em>, derived from Φ alone, <strong>is</strong> K_a ≥ 0 itself.
        </div>
      </div>

      <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
        Detail: <Link to="/route-map">Route Map</Link> · <Link to="/rigor-dashboard">Rigor Dashboard</Link>
      </p>

      <h2>③ The meta-finding (the most valuable result)</h2>
      <p>
        Across {ROUTE_COUNT} routes, a uniform pattern: <strong>every promising route, under
        adversarial scrutiny, turns out to be either not rigorous (the C_H wall) or RH-equivalent
        (a reformulation).</strong> There is no hidden shortcut below RH anywhere in the map — only
        elegant restatements, each as hard as RH, and they all ultimately meet the same
        two-sided pair-correlation / GUE wall. Knowing <em>precisely</em> where the walls are,
        and that they are all the same wall, is the project's hardest-won knowledge.
      </p>

      <Pull>
        There is no hidden shortcut below RH anywhere in the map — only elegant restatements,
        each as hard as RH, all meeting the same wall.
      </Pull>

      <h2>④ The verification discipline — six overclaims caught and withdrawn</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        The map is trustworthy because confident-looking claims were adversarially refuted
        <em> before</em> they became results. The ledger:
      </p>
      <div style={{ display: 'grid', gap: 6 }}>
        {OVERCLAIMS.map(([claim, why]) => (
          <div key={claim} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12, fontSize: 14, padding: '6px 10px', background: 'var(--faint)', borderRadius: 4 }}>
            <span style={{ color: 'var(--terra, #b5563f)', textDecoration: 'line-through' }}>{claim}</span>
            <span style={{ color: 'var(--ink-soft)' }}>{why}</span>
          </div>
        ))}
      </div>

      <h2>⑤ About the primes specifically</h2>
      <ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>
        <li><strong>Caustics = multiplicative resonances.</strong> In the log-phase field θ = t·log n, bright bands form where log(p_i/p_j) ≈ 2πk/t — the same oscillatory structure as the explicit formula's x^ρ kernel.</li>
        <li><strong>Prime rigidity is demonstrable.</strong> Real primes produce coherent caustics; randomize the logs and they dissolve into noise — a vivid face of "the primes are arithmetic, not random." <Link to="/prime-rigidity">(see it)</Link></li>
        <li><strong>Zeros are phase vortices</strong> of V_t = H_t′/H_t; winding ±1 = the argument principle; vortex-exclusion ⟺ RH. The winding-as-order-parameter re-derives Λ ≥ 0 cleanly but, does not go past it. <Link to="/vortex-field">(see it)</Link></li>
      </ul>

      <h2>One-sentence version</h2>
      <TheoremBox label="Bottom line">
        <p style={{ margin: 0 }}>
          The standalone repository presents
          <strong> Λ ≤ 0.1787854</strong> as a computer-assisted candidate for an
          unconditional proof; the bound is not established, has been reviewed by Dan Romik, and is not RH.
          The exact global Twin Ladder residual inequality remains equivalent to RH, Platt–Trudgian
          <strong> Λ ≤ 0.2</strong> remains the peer-reviewed benchmark, and RH itself remains open.
        </p>
      </TheoremBox>
    </PostLayout>
  );
}
