import React from 'react';
import { Link } from 'react-router-dom';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { SECTION26_MUPASS_OPERATOR_VERDICT } from '../data/section26-mupass-operator-verdict-2026-06-30.js';

/*
 * What We Know — the consolidated, honest artifact of everything this project has
 * established about zeta, RH, and the primes. Reads the verdict modules; authored
 * connective prose. The discipline is calibrated honesty: no RH proof, no beat of
 * the Lambda record -- but a rigorously honest MAP of where the walls are and why.
 */

const ROUTE_COUNT = FULL_ROUTE_MAP.totalRoutes;

function Card({ children, accent, title }) {
  return (
    <div className="card" style={{ marginBottom: 16, borderLeft: accent ? `3px solid ${accent}` : undefined }}>
      {title && <h3 style={{ marginTop: 0, color: accent || '#e2e8f0' }}>{title}</h3>}
      {children}
    </div>
  );
}

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
    <div className="page">
      <div className="page-header">
        <h1>What We Know</h1>
        <p className="page-subtitle">
          The consolidated, honest state of what this project has actually figured out about
          ζ, the Riemann Hypothesis, and the primes. The discipline throughout is calibrated
          honesty — so the headline first: <strong>RH is not proved. The root repository proves
          Λ ≤ 0.1787854 by an unpublished, unpeer-reviewed computer-assisted argument, while
          Λ ≤ 0.2 (Platt–Trudgian) remains the peer-reviewed benchmark.</strong> Across{' '}
          <strong>{ROUTE_COUNT} mapped routes</strong>, every surviving route from a positive
          Newman bound to RH is still open, RH-equivalent, or dead.
        </p>
      </div>

      <Card accent="#10b981" title="① The rigorous floor — what is actually proven">
        <ul style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          <li><strong>Repository Newman theorem:</strong> <strong>Λ ≤ 0.1787854</strong>, from a closed compact slab, final-time half-strip, full material replay, corrected errors, and exact Polymath weld. Computer-assisted, unpublished, and unpeer-reviewed.</li>
          <li><strong>Literature grades:</strong> <strong>Λ ≥ 0</strong> (Rodgers–Tao 2020) and the peer-reviewed upper benchmark <strong>Λ ≤ 0.2</strong> (Platt–Trudgian 2021). RH ⟺ Λ = 0.</li>
          <li><strong>Route B (Burgers / Koksma–Hlawka lim-sup):</strong> an unconditional, GUE-free, pair-correlation-free proof that lim supₙ |t_c(N)| = 0 for the N-particle Calogero–Moser/Dyson flow that models the zeros. This subsidiary theorem does not close the bridge to RH.</li>
          <li><strong>The Θ-trap theorems:</strong> Θ ≤ 1/4 as an unconditional flow invariant; the exact identity dg/ds = −(4/g)(1−Θ); Corollary A1 (t_c^part ≤ g_min²/6). Rigorous CM-flow algebra.</li>
          <li><strong>The R2-T isolation constant</strong> closed in closed form: c* = √(2+√3) − 1 ≈ 0.9319 (the single-shell case) — the one deterministic frontier residual, resolved.</li>
        </ul>
      </Card>

      <Card accent="#a78bfa" title="② The two frontier walls — fully characterized">
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 0 }}>
          Every surviving mapped route seeking to drive the positive bound all the way to
          Λ = 0 funnels into one of two RH-hard objects. Both have been driven to ground by
          deliberate adversarial assault.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.05em', marginBottom: 5 }}>
              C_H WALL — {CH_WALL_FRONTIER.verdict}
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
              The finite-height attack reduces to one constant, C_Lip (gap-Lipschitz at the
              zero-collision). The Lipschitz route to bounding it is <strong>provably closed three ways</strong>:
              a Hölder-½ lower bound C_Lip ≥ C_shock/(2√W₁) → ∞; a linear-N norm-mismatch
              (the metric W₁ dilutes a 2-particle collision across all N); and every surrogate refuted.
              <strong style={{ color: '#10b981' }}> Genuine fallout:</strong> the famous ∫2/g² divergence is a
              pure coordinate artifact — in h = g² it cancels exactly to C_shock².
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 5 }}>
              §26 μ^pass / VOLTERRA — RH-EQUIVALENT
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
              The elegant "7+ conjectures collapse to one operator-norm bound ‖V‖≤1" idea is
              <strong> PCC-free</strong> (real, surprising) but <strong>not a reduction</strong>: the collapse
              identity was refuted, and the surviving target is RH-equivalent — confirmed now at the
              <em> operator</em> level. The endpoint-bridge measure is mass-feasible (budget 2,400–20,000× the
              deficit) but the required <em>sign-positivity</em>, derived from Φ alone, <strong>is</strong> K_a ≥ 0 itself.
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, marginTop: 10 }}>
          Detail: <Link to="/route-map" style={{ color: '#3b82f6' }}>Route Map</Link> ·{' '}
          <Link to="/rigor-dashboard" style={{ color: '#3b82f6' }}>Rigor Dashboard</Link>
        </div>
      </Card>

      <Card accent="#22d3ee" title="③ The meta-finding (the most valuable result)">
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
          Across {ROUTE_COUNT} routes, a uniform pattern: <strong>every promising route, under
          adversarial scrutiny, turns out to be either not rigorous (the C_H wall) or RH-equivalent
          (a reformulation).</strong> There is no hidden shortcut below RH anywhere in the map — only
          elegant restatements, each as hard as RH, and they all ultimately meet the same
          two-sided pair-correlation / GUE wall. Knowing <em>precisely</em> where the walls are,
          and that they are all the same wall, is the project's hardest-won knowledge.
        </p>
      </Card>

      <Card accent="#f59e0b" title="④ The verification discipline — six overclaims caught and withdrawn">
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 0 }}>
          The map is trustworthy because confident-looking claims were adversarially refuted
          <em> before</em> they became results. The ledger:
        </p>
        <div style={{ display: 'grid', gap: 6 }}>
          {OVERCLAIMS.map(([claim, why]) => (
            <div key={claim} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10, fontSize: 12, padding: '5px 8px', background: 'rgba(245,158,11,0.05)', borderRadius: 4 }}>
              <span style={{ color: '#fbbf24', textDecoration: 'line-through', textDecorationColor: 'rgba(251,191,36,0.5)' }}>{claim}</span>
              <span style={{ color: '#94a3b8' }}>{why}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="#ec4899" title="⑤ About the primes specifically">
        <ul style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          <li><strong>Caustics = multiplicative resonances.</strong> In the log-phase field θ = t·log n, bright bands form where log(p_i/p_j) ≈ 2πk/t — the same oscillatory structure as the explicit formula's x^ρ kernel.</li>
          <li><strong>Prime rigidity is demonstrable.</strong> Real primes produce coherent caustics; randomize the logs and they dissolve into noise — a vivid face of "the primes are arithmetic, not random." <Link to="/prime-rigidity" style={{ color: '#3b82f6' }}>(see it)</Link></li>
          <li><strong>Zeros are phase vortices</strong> of V_t = H_t′/H_t; winding ±1 = the argument principle; vortex-exclusion ⟺ RH. The winding-as-order-parameter re-derives Λ ≥ 0 cleanly but, honestly, does not go past it. <Link to="/vortex-field" style={{ color: '#3b82f6' }}>(see it)</Link></li>
        </ul>
      </Card>

      <div className="card" style={{ background: 'rgba(59,130,246,0.04)', fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>
        <strong>One-sentence version.</strong> The root repository now proves the subsidiary bound
        <strong> Λ ≤ 0.1787854</strong>, while the exact global Twin Ladder residual inequality
        remains equivalent to RH; Platt–Trudgian <strong>Λ ≤ 0.2</strong> remains the peer-reviewed
        benchmark, and RH itself remains open.
      </div>
    </div>
  );
}
