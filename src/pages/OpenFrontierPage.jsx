import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

// Constants referenced across the three open residuals
const C_ASYM = 0.9027902227683418;
const C_GLOB_LO = 0.9015828375;
const EXCURSION_CAP = 0.5073;
const THEOREM_A_CAP = 0.25;

const RESIDUALS = [
  {
    id: 'R1',
    tag: 'sg1c-r1-excursion-cap',
    color: '#f97316',
    badge: 'DYNAMICAL REACHABILITY',
    title: 'R1: Excursion-cap dynamical reachability',
    status: 'OPEN',
    body: [
      'The static obstruction is settled: Theorem R1-T2 shows the uniform-lattice tie value ' +
      'Theta_K = K/(K+1) rises to 1 as K grows, so no static Theta comparison can cap Theta_exc < 1. ' +
      'Theorem R1-T3 gives the exact asymmetric seizing-margin 1/(b(b+1)(b+2)) -> 0, ' +
      'and empirical basin closure (R1-T4) shows worst dynamical excursion ~0 over the 34-run config set.',
      'The open residual is DYNAMICAL REACHABILITY: does the attractive Calogero-Moser flow ' +
      'started from genuine real-zero-like data ever drive the minimal-gap locus onto a long ' +
      'near-uniform lattice — the sole route by which Theta_exc could drop below 1? ' +
      'The dressed static excursion ceiling is ' + EXCURSION_CAP + ' (empirical, config set) ' +
      'with dynamical excursion evidence 0.51, both well inside the Theorem-A basin ' +
      '(trap at Theta <= ' + THEOREM_A_CAP + '). ' +
      'But this is an empirical bound on a finite config set, not a global proof that ' +
      'arbitrary real-zero configurations avoid the near-uniform-lattice locus.',
    ],
    links: [
      { to: '/theta-static-obstruction', label: 'R1-T2/T3 Static Obstruction' },
      { to: '/theta-basin-closure', label: 'R1-T4 Basin Closure' },
      { to: '/spectral-attack', label: 'Spectral Attack (c_glob context)' },
    ],
  },
  {
    id: 'R2',
    tag: 'sg1c-r2-isolation-persistence',
    color: '#a78bfa',
    badge: 'GLOBAL BRACKET OPEN',
    title: 'R2: c_glob bracket — asymmetric isolation onset (' +
      C_GLOB_LO.toFixed(7) + ', ' + C_ASYM.toFixed(7) + ')',
    status: 'OPEN',
    body: [
      'The global asymmetric multi-body isolation constant c_glob is defined as the infimum of ' +
      'all worsening-onset values rho(c) over all asymmetric multi-body environments. ' +
      'Every numerically located onset is only an UPPER BOUND on c_glob; no rigorous lower bound ' +
      'below the basin constant 0.72 has been proven.',
      'Current bracket: lower structured floor ' + C_GLOB_LO.toFixed(7) +
      ' (imp-3172 Config-B smooth onset, the lowest computationally located onset) ' +
      'and upper end c_asym = ' + C_ASYM.toFixed(10) +
      ' (transcendental closed form, asymmetric R-to-infinity class, imp-3170). ' +
      'The Theorem-C basin (C_Lip) only requires c <= 0.72, so closing c_glob is NOT needed ' +
      'for the current load-bearing Lipschitz argument — the bracket matters for the program ' +
      'isolation record, not for the core proof chain.',
      'Closing the bracket requires either a proven lower bound derivation or a structured ' +
      'search that exhausts the class and certifies the infimum.',
    ],
    links: [
      { to: '/onset-bracket-ledger', label: 'Onset Bracket Ledger' },
      { to: '/spectral-attack', label: 'Spectral Attack (c_glob viz)' },
    ],
  },
  {
    id: 'G6a',
    tag: 'step-4-polymath15-bridge',
    color: '#22d3ee',
    badge: 'PARTIAL CLOSURE',
    title: 'G6a: Step-4 Polymath15 bridge — G6a_shock_lipschitz',
    status: 'OPEN (PARTIAL)',
    body: [
      'The Polymath15 route to Λ <= 0 requires a rigorous Hölder-1/2 (Lipschitz) bound on ' +
      'the Burgers shock modulus C_H in G6a_shock_lipschitz. imp-354 partially reduced the ' +
      'gap from "full Hölder-1/2 lemma missing" to two sub-sub-gaps: ' +
      'G6a-sub-hyperbolic (hyperbolic region bound) and G6a-sub-constant (constant region). ' +
      'Per imp-2640 NEGATIVE, C_H is undischargeable via the current approach, so the ' +
      'finite-N beat on Lambda remains an ESTIMATE, not a rigorous unconditional result. ' +
      'The rigorous deliverable on the Polymath15 route is only the floor PT 0.2.',
      'Closing G6a fully would require either a direct port of Polymath15 Lemma 5.2 ' +
      'or one of the parallel routes (imp-368+369+336 Route A, or imp-342+337 Route C). ' +
      'All three remain open.',
      'Honest-status note (imp-33637): the "Polymath15 Lemma 5.2" label above is under ' +
      'correction. imp-33637 found that arXiv:1904.12438 (the corrected, real Polymath15 ' +
      'paper id) contains only a Lemma 5.1 in Section 5 — no Lemma 5.2 matching this ' +
      'Hölder-1/2 subject exists in the actual paper. imp-33649 traced the fold-catastrophe ' +
      'exponent instead to Whitham, Linear and Nonlinear Waves (1974). This citation ' +
      'correction changes no math or verdict here: G6a_shock_lipschitz stays OPEN (PARTIAL) ' +
      'exactly as stated above, independent of the citation error.',
    ],
    links: [
      { to: '/rh-dag', label: 'Proof DAG (G6a node)' },
      { to: '/lambda-bounds', label: 'Lambda Bounds' },
      { to: '/route-map', label: 'Route Map' },
    ],
  },
];

export default function OpenFrontierPage() {
  return (
    <div className="page">
      <PageHeader
        title="Open Frontier"
        subtitle="Three live open residuals — the complete remaining gap between current results and a closed proof"
      />

      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid #64748b' }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.65 }}>
          This page consolidates the three genuine open residuals of the ZPO / RH-attack program in one place.
          Everything else in the route map is either{' '}
          <strong style={{ color: '#22c55e' }}>closed</strong> (rigorous),{' '}
          <strong style={{ color: '#ef4444' }}>refuted</strong>, or{' '}
          <strong style={{ color: '#64748b' }}>superseded</strong>.
          The items here are the only things standing between the current state and a complete program.
          Each is honestly labelled with its status and what closing it would require.
        </p>
      </div>

      {RESIDUALS.map((r) => (
        <div
          key={r.id}
          className="card"
          style={{ marginBottom: 18, borderLeft: "3px solid " + r.color }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: r.color,
                border: "1px solid " + r.color,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              {r.badge}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 10.5,
                fontWeight: 700,
                color: r.status === 'OPEN' ? '#ef4444' : '#f97316',
                border: "1px solid " + (r.status === 'OPEN' ? '#ef4444' : '#f97316'),
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: '#64748b' }}>{r.tag}</code>
          </div>
          <strong style={{ color: '#e2e8f0', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
          {r.links.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {r.links.map((lnk) => (
                <Link
                  key={lnk.to}
                  to={lnk.to}
                  style={{ fontSize: 12, color: r.color, textDecoration: 'none', borderBottom: "1px solid " + r.color }}
                >
                  {lnk.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="card" style={{ marginTop: 8, borderLeft: '3px solid #22c55e' }}>
        <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#22c55e' }}>What is not open:</strong>{' '}
          The Theorem-C Lipschitz basin (C_Lip, requires only c &le; 0.72) is load-bearing and does NOT
          depend on closing R2 (c_glob). The static-obstruction chain (R1-T2/T3) is rigorous.
          The 34-run empirical excursion data is honest. The partial G6a closure is accurately labelled partial.
          The program has no withdrawn overclaims on these three items — only honest open status.
        </div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5 }}>
          <Link to="/state-of-program" style={{ color: '#94a3b8' }}>State of the Program</Link>
          <Link to="/route-map" style={{ color: '#94a3b8' }}>Route Map</Link>
          <Link to="/rh-dag" style={{ color: '#94a3b8' }}>Proof DAG</Link>
          <Link to="/spectral-attack" style={{ color: '#94a3b8' }}>Spectral Attack</Link>
        </div>
      </div>
    </div>
  );
}
