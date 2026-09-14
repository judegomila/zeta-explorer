import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';

/* The Atlas — a high-level portal into the attack surface. Every line of attack
   on RH / Λ, grouped by the six route-map clusters, each a card that drops you
   into that part of the app. The dense route table lives on /route-map; this is
   the map above it. Rendered under .ed-root so the editorial theme applies. */

// Per-cluster framing + a few curated entry-point pages (the cluster rows in the
// route map are descriptions, not links, so these are the real doors into each area).
const AREAS = [
  {
    key: 'lambdaUpper', wireframe: 'wave',
    title: 'Λ Upper-Bound Routes',
    blurb: 'Every route that tries to push the de Bruijn–Newman bound Λ below the Platt–Trudgian 0.2 — the barrier method, the finite-N beat, the Burgers lim-sup, and where each one funnels into the C_H wall. Newest: the permutation architecture, a fail-closed Λ ≤ 0.14 completion contract (a contract, not a bound) with one open coefficient family.',
    entryPoints: [
      { to: '/lambda-bounds', label: 'The bounds ledger' },
      { to: '/verified-height-lever', label: 'The one lever below 0.2' },
      { to: '/theorem-b-threshold', label: 'Theorem-B threshold' },
      { to: '/pt-floor-audit', label: 'What binds the floor' },
      { to: '/permutation-architecture', label: 'The freeze calculus & the 0.14 contract' },
    ],
  },
  {
    key: 'directRH', wireframe: 'twinladder',
    title: 'Direct-RH Routes',
    blurb: 'Reformulations that attack RH itself, not via Λ — Volterra ‖V‖ ≤ 1, Beurling–Nyman, de Branges, the hidden-square program. Most are information-preserving renames of RH, not shortcuts below it.',
    entryPoints: [
      { to: '/collapse-chain', label: 'The ‖V‖ ≤ 1 collapse' },
      { to: '/rh-equivalents', label: 'RH-equivalents' },
      { to: '/shift-bridge-positivity', label: 'Shift-bridge positivity' },
      { to: '/hidden-square-program', label: 'Hidden-square program' },
    ],
  },
  {
    key: 'machineryCrossvalLower', wireframe: 'oscillator',
    title: 'Machinery · Cross-Validation · Lower Bounds',
    blurb: 'The rigorous instruments — heat-discriminant t_c, the theta-trap algebra, independent integrators — plus the Rodgers–Tao Λ ≥ 0 lower side. Tools that sharpen constants without themselves closing RH.',
    entryPoints: [
      { to: '/dyson-verifier', label: 'Dyson verifier' },
      { to: '/theta-basin-closure', label: 'Theta-basin closure' },
      { to: '/rigor-dashboard', label: 'Rigor dashboard' },
    ],
  },
  {
    key: 'literaturePCC', wireframe: 'spectrum',
    title: 'Literature Ports & the Montgomery-PCC Surface',
    blurb: 'Ports of the published machinery — Guth–Maynard, Goldston–Gonek, Maynard sieve, Conrey–Snaith — and where each hits the 50-year pair-correlation-conjecture wall.',
    entryPoints: [
      { to: '/guth-maynard-scoping', label: 'Guth–Maynard scoping' },
      { to: '/pcc-route-exhaustion', label: 'PCC route exhaustion' },
      { to: '/literature', label: 'The literature' },
    ],
  },
  {
    key: 'originalIdeas', wireframe: 'lattice',
    title: 'Original / Novel-Angle Ideas',
    blurb: 'The project’s own angles and the classical Hilbert–Pólya family — Berry–Keating H = xp, Connes adelic / Weil positivity, Voronin universality, the supercritical-fluid thermodynamics.',
    entryPoints: [
      { to: '/berry-keating-xp', label: 'Berry–Keating H = xp' },
      { to: '/connes-adelic', label: 'Connes adelic' },
      { to: '/voronin-universality', label: 'Voronin universality' },
      { to: '/supercritical', label: 'Supercritical fluid' },
    ],
  },
  {
    key: 'permutationFreeze', wireframe: 'wave',
    title: 'Post-Freeze Frontier (permutation architecture)',
    blurb: 'The routes opened after the 2026-06-19 freeze by the permutation-architecture campaign: the fail-closed Λ ≤ 0.14 completion contract (a contract, not a bound) reduced to one open coefficient family |C_E,17| < 0.2797, the imp-95008 weld alias bracket, and the gate-ranked producer/probe lanes around it.',
    entryPoints: [
      { to: '/permutation-architecture', label: 'The freeze calculus & the 0.14 contract' },
      { to: '/lambda-bounds', label: 'The bounds ledger' },
    ],
  },
];

// Warm status-chip colors, mirroring the route map / status legend.
const STATUS_COLOR = {
  'RIGOROUS-SOTA': '#4c7a4a',
  'RH-EQUIVALENT': '#6d55b8',
  'CONDITIONAL': '#b58a2e',
  'ESTIMATE': '#3f6b86',
  'OPEN-HARD': '#3f6b86',
  'DEAD-END-FORNOW': '#877b67',
  'REFUTED': '#c23a1c',
  'UNDER-EXPLORED': '#3f6b86',
};

function statusCounts(rows) {
  const counts = {};
  for (const r of rows) counts[r.status] = (counts[r.status] || 0) + 1;
  // Order by a fixed priority so the chips read consistently across cards.
  const order = ['RIGOROUS-SOTA', 'RH-EQUIVALENT', 'OPEN-HARD', 'CONDITIONAL', 'ESTIMATE', 'UNDER-EXPLORED', 'DEAD-END-FORNOW', 'REFUTED'];
  return order.filter((s) => counts[s]).map((s) => ({ status: s, n: counts[s] }));
}

export default function AtlasPage() {
  const clusters = FULL_ROUTE_MAP.clusters;
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>the atlas · {FULL_ROUTE_MAP.totalRoutes} routes · {AREAS.length} areas</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the attack surface</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          The Atlas
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: '52rem', lineHeight: 1.6 }}>
          Every line of attack on the Riemann Hypothesis and the de Bruijn–Newman constant Λ, grouped into
          six areas. Each area is a door into that part of the app; the full route-by-route table — with
          status and the exact split point of each — lives on the{' '}
          <Link to="/route-map">wall map</Link>. For how the wider community is attacking RH and where this
          program engages each line, see the <Link to="/state-of-field">state of the field</Link>.
        </p>

        {AREAS.map((area, ai) => {
          const rows = [...(clusters[area.key] || [])];
          const order = ['RIGOROUS-SOTA', 'RH-EQUIVALENT', 'OPEN-HARD', 'CONDITIONAL', 'ESTIMATE', 'UNDER-EXPLORED', 'DEAD-END-FORNOW', 'REFUTED'];
          rows.sort((a, b) => (order.indexOf(a.status) - order.indexOf(b.status)) || ((b.opp || 0) - (a.opp || 0)));
          return (
            <section
              key={area.key}
              style={{
                borderTop: ai === 0 ? 'none' : '1px solid var(--hairline)',
                margin: ai === 0 ? '30px 0 0' : '26px 0 0',
                paddingTop: ai === 0 ? 0 : 26,
              }}
            >
              {/* header row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                <span className="ed-mono" style={{ fontSize: 13, color: 'var(--faint)' }}>{String(ai + 1).padStart(2, '0')}</span>
                <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: 0, color: 'var(--ink)' }}>
                  {area.title}
                </h2>
                <span className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{rows.length} routes</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {statusCounts(rows).map(({ status, n }) => (
                    <span key={status} className="ed-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, color: STATUS_COLOR[status] || 'var(--ink-soft)', border: `1px solid ${STATUS_COLOR[status] || 'var(--hairline)'}`, borderRadius: 4, padding: '1px 6px' }}>
                      {n}× {status}
                    </span>
                  ))}
                </span>
              </div>

              <div className="ed-atlas-breakout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 22, marginTop: 14 }}>
                {/* left: wireframe + blurb + doors */}
                <div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--paper)' }}>
                    <WireframeAnim kind={area.wireframe} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 10px' }}>
                    {area.blurb}
                  </p>
                  <div className="ed-lbl" style={{ marginBottom: 5 }}>enter</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {area.entryPoints.map((ep) => (
                      <Link key={ep.to} to={ep.to} style={{ fontSize: 13, fontWeight: 600 }}>
                        {ep.label} →
                      </Link>
                    ))}
                  </div>
                </div>

                {/* right: the full route breakout */}
                <div style={{ display: 'grid', gap: 0, alignContent: 'start' }}>
                  {rows.map((r) => (
                    <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--hair2)', alignItems: 'baseline' }}>
                      <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, color: STATUS_COLOR[r.status] || 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                        ● {r.status}
                      </span>
                      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--ink)' }}>{r.name}</strong>
                        {r.note && <span style={{ color: 'var(--ink-soft)' }}> — {r.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* the dense table below all sections */}
        <div style={{ marginTop: 30, paddingTop: 18, borderTop: '1px solid var(--hairline)', fontSize: 14 }}>
          <Link to="/route-map" style={{ fontWeight: 600 }}>
            The wall map → all {FULL_ROUTE_MAP.totalRoutes} routes as the dense table (split points, sub-gaps, provenance)
          </Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/frontier-dag">The frontier DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/no-gos">No-go index →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/state-of-field">State of the field →</Link>
        </div>
      </div>
    </div>
  );
}
