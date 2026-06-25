import React from 'react';
import { Link } from 'react-router-dom';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';

// The honest, single canonical top-of-funnel summary. Facts are sourced from
// FULL_ROUTE_MAP (full-route-map workflow, 2026-06-19) so this page cannot
// drift from the route map. No heavy zeros-bundle import.

const TRUTHS = [
  {
    badge: 'RIGOROUS SOTA',
    color: '#34d399',
    title: 'The rigorous floor is Platt-Trudgian Λ ≤ 0.2 — and the project did NOT produce it',
    body:
      'The best unconditional de Bruijn-Newman upper bound the field has is Platt-Trudgian (Λ ≤ 0.2), ' +
      'together with Rodgers-Tao (Λ ≥ 0) on the lower side. Both are cited results, not outputs of this program. ' +
      'Everything below is either an estimate, a faithful RH reformulation, or a wall.',
  },
  {
    badge: 'ESTIMATE',
    color: '#fbbf24',
    title: 'The finite-N*=1e4 beat is an ESTIMATE, gated on the undischargeable C_H',
    body:
      'The headline finite-N* = 1e4 "beat" is numerical, not a rigorous bound. It rests on a collision-energy ' +
      'constant C_H whose discharge is open: the obvious Gronwall attack is REFUTED (imp-2640, the integral ' +
      'diverges at the collision), and the projected t_c is OLS, not rigorous (imp-2632). Read it as ' +
      'rigorous-modulo-C_H, never as an unconditional finite-N beat.',
  },
  {
    badge: 'RH-EQUIVALENT',
    color: '#a78bfa',
    title: 'The Volterra ‖V‖ ≤ 1 collapse is RH-EQUIVALENT, not a reduction',
    body:
      'The §15-27 collapse to a single statement ‖V‖ ≤ 1 is a faithful reformulation of RH — it renames RH, it ' +
      'does not reduce it. The much-cited ~5000× empirical margin was a homogeneity artifact, not slack against a ' +
      'real bound. Proving it would be proving RH; the same is true of Beurling-Nyman, de Branges, Connes-Weil, ' +
      'and the normalized-R / Conj-26.3 target.',
  },
  {
    badge: 'REFUTED',
    color: '#f87171',
    title: 'Six overclaims were caught and withdrawn',
    body:
      'Honesty audit (route map, 2026-06-19) withdrew the caught overclaims, including: thin-strip E_trunc / κ_T ' +
      '(frozen-κ height-mismatch artifact, imp-2630), the Soundararajan-Tao 2024 PHANTOM citation (wrong object), ' +
      'the Goldston-Gonek fabricated citation, and reading the Volterra collapse as a reduction. The DAG node that ' +
      'still labels the finite-1e4 beat "rigorous unconditional" is the one stale view flagged for reconciliation.',
  },
  {
    badge: 'OPEN-HARD',
    color: '#22d3ee',
    title: 'C_H / G6a is the #1 genuine wall',
    body:
      'Every route that could deliver an actual Λ number short of RH funnels into ONE object: the C_H / G6a ' +
      'Hölder-½ shock modulus (Step-4 bridge / Polymath15). An N-uniform bound on it would make the finite beat ' +
      'rigorous AND compose Route B into Λ → 0. It is a concrete analytic estimate on a specific PDE shock — not a ' +
      'rename of RH — but it is RH-hard at the modulus, and the naive Gronwall discharge is refuted.',
  },
];

export default function StateOfProgramPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>State of the Program</h1>
        <p>
          One honest, plain-language summary of where this RH / de&nbsp;Bruijn-Newman Λ attack actually stands.
          The truth is otherwise scattered across the route map, dashboards and withdrawn-claims notes — this page
          exists so a reader cannot over-read any single partial page. Facts are sourced directly from the{' '}
          <strong>full route map ({FULL_ROUTE_MAP.date})</strong>, which enumerates{' '}
          <strong>{FULL_ROUTE_MAP.totalRoutes} routes</strong>. The one-line truth:{' '}
          <strong>there is no shortcut below RH anywhere in the map.</strong>
        </p>
      </div>

      {TRUTHS.map((t, i) => (
        <div className="card" key={i} style={{ marginBottom: 16, borderLeft: `3px solid ${t.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: t.color,
                border: `1px solid ${t.color}`,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              {t.badge}
            </span>
            <strong style={{ color: '#e2e8f0', fontSize: 14.5 }}>{t.title}</strong>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{t.body}</div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 8 }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
          For the full route-by-route classification ({FULL_ROUTE_MAP.totalRoutes} routes across 5 clusters,
          with status badges and ranked genuine opportunities), see the{' '}
          <Link to="/route-map">Route Map</Link>.
        </p>
      </div>
    </div>
  );
}
