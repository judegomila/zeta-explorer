import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

// Constants referenced by the separate Dyson / collision-flow research lane.
const C_ASYM = 0.9027902227683418;
const C_OBSERVED_MIN = 0.9015828375;
const EXCURSION_CAP = 0.5073;
const THEOREM_A_CAP = 0.25;

const GLOBAL_FRONTIER = {
  id: 'T3',
  tag: 'twin-ladder-exact-residual',
  color: '#ef4444',
  badge: 'SOLE GLOBAL RH FRONTIER',
  title: 'T3: exact Twin Ladder residual inequality',
  status: 'OPEN · RH-EQUIVALENT',
  body: [
    'For every a > 0 and every finite test in the upper half-plane C_+, prove the ' +
    'Hermitian-form inequality D_{a,R} + K_a^(S) ⪰ -K_{a,0}. Equivalently, the ' +
    'finite matrix associated to D_{a,R} + K_a^(S) + K_{a,0} must be positive ' +
    'semidefinite for every choice of test points and coefficients.',
    'The exact kernel decomposition is K_a = K_{a,0} + D_{a,R} + K_a^(S), where ' +
    'K_{a,0} ⪰ 0 is the genuine positive core. The residual D_{a,R} has a ' +
    'second-order cancellation through cos(ps) - 1, while K_a^(S) is the second ' +
    'indefinite channel. A crude absolute-value estimate spends the entire ' +
    'positive core, so the missing step is a cancellation-sensitive ' +
    'Volterra/derivative estimate controlling both channels together.',
    'This statement is equivalent to RH, not a strict reduction. Relabelling it ' +
    'as passivity, Schur contractivity, a determinant test, or positivity does ' +
    'not make the obligation smaller. Promotable progress must supply a new ' +
    'zeta-specific lemma, rigorously refute a proposed exact-kernel bridge, or ' +
    'replace T3 by a genuinely narrower statement with a complete implication proof.',
  ],
  links: [
    { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
    { to: '/closure-routes', label: 'Closure Routes' },
    { to: '/route-map', label: 'Route Map' },
  ],
};

const CHANNEL_SPLIT_CERTIFICATE = {
  status: 'RIGOROUS FINITE ROUTE COUNTEREXAMPLE',
  title: 'Independent scalar radial/shear budgets cannot close T3',
  configuration: 'a = 1/4,  z = (−1/2, 0, 1/2) + i/5',
  betaR: 'βR > 1.027286016',
  betaS: 'βS > 0.42200180358',
  betaSum: 'βR + βS > 1.449287819 > 1',
  method:
    '256-bit Arb · exact one-dimensional Laplace-product factorization · ' +
    'combined omission error < 10⁻²² · independent acb_dirichlet_xi cross-check',
};

const DYSON_LANE_RESIDUALS = [
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
      'with dynamical excursion evidence 0.51. Neither number is inside the ' +
      'stated Theorem-A trap Theta <= ' + THEOREM_A_CAP + ' on its face; any ' +
      'basin implication needs a separately proved map between the quantities. ' +
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
    badge: 'OBSERVED RANGE · NO LOWER BOUND',
    title: 'R2: sampled asymmetric isolation onsets (' +
      C_OBSERVED_MIN.toFixed(7) + ', ' + C_ASYM.toFixed(7) + ')',
    status: 'OPEN',
    body: [
      'The global asymmetric multi-body isolation constant c_glob is defined as the infimum of ' +
      'all worsening-onset values rho(c) over all asymmetric multi-body environments. ' +
      'Every numerically located onset is only an UPPER BOUND on c_glob; no rigorous lower bound ' +
      'below the basin constant 0.72 has been proven.',
      'Observed values include ' + C_OBSERVED_MIN.toFixed(7) +
      ' (imp-3172 Config-B smooth onset, the lowest computationally located ' +
      'onset) and c_asym = ' + C_ASYM.toFixed(10) +
      ' (the asymmetric R-to-infinity class, imp-3170). Both are witnesses ' +
      'that upper-bound the infimum; they are not a rigorous lower/upper bracket. ' +
      'The Theorem-C basin (C_Lip) only requires c <= 0.72, so closing c_glob is NOT needed ' +
      'for the current load-bearing Lipschitz argument — the observed range matters for the program ' +
      'isolation record, not for the core proof chain.',
      'Turning the observations into a bracket requires either a proven lower ' +
      'bound or a structured search that exhausts the class and certifies the infimum.',
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
      'The peer-reviewed benchmark remains Lambda <= 0.2; separately, this repository ' +
      'now proves the unreviewed computer-assisted theorem Lambda <= 0.1787854 through ' +
      'an independent sealed route. That theorem does not close G6a or descend to zero.',
      'Closing G6a fully requires the actual missing strip-uniform fold estimate or one ' +
      'of the parallel routes (imp-368+369+336 Route A, or imp-342+337 Route C). ' +
      'Those routes remain open.',
      'Citation audit (imp-33637): arXiv:1904.12438 contains only Lemma 5.1 in ' +
      'Section 5, not a Lemma 5.2 matching this Hölder-1/2 claim. imp-33649 ' +
      'traced the fold-catastrophe exponent instead to Whitham, Linear and ' +
      'Nonlinear Waves (1974). The nonexistent lemma is not a live closure ' +
      'route; G6a_shock_lipschitz remains OPEN (PARTIAL).',
      'Honest-status note (imp-33766): H4 (the strip-height fold-reading derivative m_prime) ' +
      'is NOT independently dischargeable -- the Holder-modulus back-conversion couples it to ' +
      'H3 (the curvature coefficient m_double_prime) through the same quadratic fold expansion, ' +
      'and H3 dominates H4 a fortiori. H4 and H3 therefore collapse into ONE coupled ' +
      'strip-height-uniformity object, load-bearing at the H3 rung; this is scoping only and ' +
      'discharges nothing, so G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Honest-status note (imp-33794): the measured finite-band C_ren(N) window (the renormalized ' +
      'fold-reading amplitude across the eps = y_N^sharp ladder) is CONSISTENT-WITH the H4 ' +
      'finite-window minimal-input requirement but does NOT DISCHARGE H4 -- the uniform bound needs ' +
      'the ANALYTIC tracking of C_ren through the fold-modulus back-conversion, not an empirical ' +
      'band checked on a finite ladder, and it says nothing about the coupled H3 curvature rung ' +
      '(imp-33786) that dominates and jointly governs discharge. Measurement only; ' +
      'G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Honest-status note (imp-35101, sharpening imp-3671): the direct-flow V0(gamma) route carries two ' +
      'INDEPENDENT obstructions, not one -- S1 (V0 is a strip-sup density scalar, the wrong TYPE of object for the ' +
      'required two-point spatial modulus |tau_c(x) - tau_c(x_prime)| <= C_Lip|x - x_prime|^{1/2}) and S2, now sharpened ' +
      'from merely Gronwall-vacuous to the wrong MONOTONE DIRECTION: tau_c is set by the nearest pair -- the ' +
      'HIGHEST-density region -- exactly where a density FLOOR carries no information. Retyping V0 to fix S1 does not ' +
      'fix S2; the only object fixing both is a minimal-gap LOWER bound, which is itself the RH-hard nearest-pair ' +
      'control (imp-2520/imp-348, GUE-conditional per imp-486). Separately, per imp-2640 the direct Gronwall discharge ' +
      'of C_H remains NEGATIVE, and the asymptotic modulo (imp-35056) persists regardless of route. No candidate ' +
      'closure via the density-floor measurement exists; G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above; ' +
      'changes no bound; NO QED.',
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
        subtitle="One exact global RH-equivalent frontier, with separate subsidiary research lanes"
      />

      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid #64748b' }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.65 }}>
          The canonical global frontier is the exact T3 residual below. It is the
          current full-strength Twin Ladder formulation of RH and is not yet a
          simplification of RH. The R1, R2, and G6a questions remain useful
          research inside a distinct Dyson / collision-flow lane, but they are
          not the complete global gap and do not replace T3.
        </p>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: `4px solid ${GLOBAL_FRONTIER.color}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: GLOBAL_FRONTIER.color,
              border: `1px solid ${GLOBAL_FRONTIER.color}`,
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {GLOBAL_FRONTIER.badge}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: 4,
              padding: '1px 6px',
            }}
          >
            {GLOBAL_FRONTIER.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>{GLOBAL_FRONTIER.tag}</code>
        </div>
        <strong style={{ color: '#f8fafc', fontSize: 15, display: 'block', marginBottom: 10 }}>
          {GLOBAL_FRONTIER.title}
        </strong>
        <div
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.07)',
            color: '#fecaca',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
          D<sub>a,R</sub> + K<sub>a</sub><sup>(S)</sup> ⪰ −K<sub>a,0</sub>
        </div>
        {GLOBAL_FRONTIER.body.map((para, i) => (
          <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
            {para}
          </p>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {GLOBAL_FRONTIER.links.map((lnk) => (
            <Link
              key={lnk.to}
              to={lnk.to}
              style={{ fontSize: 12, color: GLOBAL_FRONTIER.color, textDecoration: 'none', borderBottom: `1px solid ${GLOBAL_FRONTIER.color}` }}
            >
              {lnk.label} →
            </Link>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #f59e0b' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#fbbf24',
              border: '1px solid #f59e0b',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T11 · exact Riemann kernel</code>
        </div>
        <strong style={{ color: '#fde68a', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {CHANNEL_SPLIT_CERTIFICATE.title}
        </strong>
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          On the certified block <code>{CHANNEL_SPLIT_CERTIFICATE.configuration}</code>,
          the coupled matrix K<sub>a,0</sub> + D<sub>a,R</sub> +
          K<sub>a</sub><sup>(S)</sup> is positive definite. But any separate
          scalar-multiple estimates D<sub>a,R</sub> ⪰ −β<sub>R</sub>K<sub>a,0</sub> and
          K<sub>a</sub><sup>(S)</sup> ⪰ −β<sub>S</sub>K<sub>a,0</sub> must obey:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[CHANNEL_SPLIT_CERTIFICATE.betaR, CHANNEL_SPLIT_CERTIFICATE.betaS, CHANNEL_SPLIT_CERTIFICATE.betaSum].map((value) => (
            <code
              key={value}
              style={{
                padding: '8px 10px',
                borderRadius: 5,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fde68a',
                fontSize: 12,
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          These scalar bounds therefore need more than one copy of the single
          positive-core budget even though the exact coupled sum is positive.
          This refutes that precise scalar split, not structured non-scalar
          allocations, T3, or RH. The live target is now sharper: preserve
          radial/shear cancellation, add matrix structure, or find a different
          zeta-specific mechanism.
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '10px 0 0' }}>
          Certificate method: {CHANNEL_SPLIT_CERTIFICATE.method}.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid #38bdf8' }}>
        <strong style={{ color: '#7dd3fc', fontSize: 13 }}>Separate Dyson / collision-flow lane</strong>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0', lineHeight: 1.65 }}>
          The three records below track internal residuals of the dynamical
          de Bruijn–Newman program. They can sharpen subsidiary flow estimates
          or eliminate proposed mechanisms. Closing them would not, by itself,
          discharge the exact T3 kernel inequality or prove RH.
        </p>
      </div>

      {DYSON_LANE_RESIDUALS.map((r) => (
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

      <div className="card" style={{ marginTop: 8, borderLeft: '3px solid #64748b' }}>
        <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#cbd5e1' }}>Scope separation:</strong>{' '}
          The Theorem-C Lipschitz basin (C_Lip, requiring only c &le; 0.72) does
          not depend on closing R2. The static-obstruction chain inside R1 is
          rigorous, while the 34-run excursion study remains finite empirical
          evidence. G6a remains a subsidiary open flow estimate. None of these
          statements changes the global verdict: RH is open, and T3 is the sole
          exact global frontier recorded here.
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
