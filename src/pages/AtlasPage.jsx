import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';

/* The Atlas — a high-level portal into the attack surface. Every line of attack
   on RH / Λ, grouped by the five route-map clusters, each a card that drops you
   into that part of the app. The dense route table lives on /route-map; this is
   the map above it. Rendered under .ed-root so the editorial theme applies. */

// Per-cluster framing + a few curated entry-point pages (the cluster rows in the
// route map are descriptions, not links, so these are the real doors into each area).
const AREAS = [
  {
    key: 'lambdaUpper', wireframe: 'wave',
    title: 'Λ Upper-Bound Routes',
    blurb: 'Every route that tries to push the de Bruijn–Newman bound Λ below the Platt–Trudgian 0.2 — the barrier method, the finite-N beat, the Burgers lim-sup, and where each one funnels into the C_H wall.',
    entryPoints: [
      { to: '/lambda-bounds', label: 'The bounds ledger' },
      { to: '/verified-height-lever', label: 'The one lever below 0.2' },
      { to: '/theorem-b-threshold', label: 'Theorem-B threshold' },
      { to: '/pt-floor-audit', label: 'What binds the floor' },
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
};

function statusCounts(rows) {
  const counts = {};
  for (const r of rows) counts[r.status] = (counts[r.status] || 0) + 1;
  // Order by a fixed priority so the chips read consistently across cards.
  const order = ['RIGOROUS-SOTA', 'RH-EQUIVALENT', 'OPEN-HARD', 'CONDITIONAL', 'ESTIMATE', 'DEAD-END-FORNOW', 'REFUTED'];
  return order.filter((s) => counts[s]).map((s) => ({ status: s, n: counts[s] }));
}

export default function AtlasPage() {
  const clusters = FULL_ROUTE_MAP.clusters;
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>the atlas · {FULL_ROUTE_MAP.totalRoutes} routes · 5 areas</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the attack surface</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          The Atlas
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: '52rem', lineHeight: 1.6 }}>
          Every line of attack on the Riemann Hypothesis and the de Bruijn–Newman constant Λ, grouped into
          five areas. Each area is a door into that part of the app; the full route-by-route table — with
          status and the exact split point of each — lives on the{' '}
          <Link to="/route-map">wall map</Link>. For how the wider community is attacking RH and where this
          program engages each line, see the <Link to="/state-of-field">state of the field</Link>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 26 }} className="ed-atlas-grid">
          {AREAS.map((area) => {
            const rows = clusters[area.key] || [];
            return (
              <section
                key={area.key}
                style={{
                  border: '1px solid var(--hairline)',
                  borderRadius: 10,
                  background: 'var(--paper2)',
                  padding: '18px 20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--paper)' }}>
                  <WireframeAnim kind={area.wireframe} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                  <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 20, margin: 0, color: 'var(--ink)' }}>
                    {area.title}
                  </h2>
                  <span className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)', whiteSpace: 'nowrap' }}>
                    {rows.length} routes
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {statusCounts(rows).map(({ status, n }) => (
                    <span
                      key={status}
                      className="ed-mono"
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                        color: STATUS_COLOR[status] || 'var(--ink-soft)',
                        border: `1px solid ${STATUS_COLOR[status] || 'var(--hairline)'}`,
                        borderRadius: 4,
                        padding: '1px 6px',
                      }}
                    >
                      {n}× {status}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '12px 0 14px' }}>
                  {area.blurb}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <div className="ed-lbl" style={{ marginBottom: 6 }}>enter</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
                    {area.entryPoints.map((ep) => (
                      <Link key={ep.to} to={ep.to} style={{ fontSize: 13.5, fontWeight: 600 }}>
                        {ep.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          {/* The wall map card — the dense route-by-route table under this atlas. */}
          <Link
            to="/route-map"
            style={{
              border: '1px dashed var(--hairline)',
              borderRadius: 10,
              background: 'transparent',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 6,
            }}
          >
            <div className="ed-lbl">all of it</div>
            <div style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 20, color: 'var(--ink)' }}>
              The wall map →
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              All {FULL_ROUTE_MAP.totalRoutes} routes across the five areas, each classified by status and
              where exactly it splits.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
