// RhNovelRoutesRoadmapPage.jsx -- imp-96009
// Reading page for src/data/rh-novel-routes-roadmap-2026-09-23.js (RH_NOVEL_ROUTES),
// which previously had no JSX consumer. Renders routes A-G with idea / first test /
// payoff / status, plus the module's own honest no-results note. Presentation-only;
// all facts (including route statuses) live in the data module.

import React from 'react';
import { Link } from 'react-router-dom';
import { RH_NOVEL_ROUTES } from '../data/rh-novel-routes-roadmap-2026-09-23.js';
import { RH_ROUTE_H_CONNES_SCALING_SITE as ROUTE_H } from '../data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';
import { RH_ROUTE_H_SEMILOCAL_SONINE as ROUTE_H_SONINE } from '../data/rh-route-h-semilocal-sonine-identity-attempt-2026-09-23.js';
import { RH_ROUTE_I_SEMILOCAL_SONINE_TRACE as ROUTE_I } from '../data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import { RH_CROSS_ROUTE_WALL_MAP } from '../data/rh-novel-routes-sweep-synthesis-2026-09-23.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

const R = RH_NOVEL_ROUTES;
const mono = 'var(--ed-mono, var(--font-mono))';

function statusTheme(status) {
  if (/^to-test$/.test(status)) {
    return { fg: 'var(--faint)', bg: 'rgba(120,113,108,0.10)', border: 'var(--faint)', label: 'to test' };
  }
  if (/^refuted-as-lever/.test(status)) {
    return { fg: '#c23a1c', bg: 'rgba(194,58,28,0.10)', border: '#c23a1c', label: 'refuted as lever' };
  }
  if (/^first-test-done/.test(status)) {
    return { fg: 'var(--brass-dk)', bg: 'rgba(181,138,46,0.14)', border: 'var(--brass-dk)', label: 'first test done' };
  }
  return { fg: 'var(--blue)', bg: 'rgba(63,107,134,0.10)', border: 'var(--blue)', label: 'status' };
}

function StatusBadge({ status }) {
  const t = statusTheme(status);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 4,
        color: t.fg,
        fontFamily: mono,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {t.label}
    </span>
  );
}

function classifyRouteStatus(status) {
  if (/NOT-A-LEVER|no lever|REFUTED|refuted|NO-GO|VERDICT NEGATIVE/i.test(status)) {
    return { label: 'refuted / no lever', fg: '#c23a1c', bg: 'rgba(194,58,28,0.10)', border: '#c23a1c' };
  }
  if (/^first-test-done/.test(status)) {
    return { label: 'first test done', fg: 'var(--brass-dk)', bg: 'rgba(181,138,46,0.14)', border: 'var(--brass-dk)' };
  }
  if (/^to-test$/.test(status)) {
    return { label: 'to test', fg: 'var(--faint)', bg: 'rgba(120,113,108,0.10)', border: 'var(--faint)' };
  }
  return { label: 'tested — see detail', fg: 'var(--blue)', bg: 'rgba(63,107,134,0.10)', border: 'var(--blue)' };
}

function RouteStatusDashboard({ routes }) {
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Route status at a glance</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Route</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Name</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Payoff</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => {
              const t = classifyRouteStatus(route.status);
              return (
                <tr key={route.key} style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--faint)' }}>{route.key}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--ink-soft)' }}>{route.name}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--ink-soft)' }}>{route.payoff}</td>
                  <td style={{ padding: '6px 8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        background: t.bg,
                        border: `1px solid ${t.border}`,
                        borderRadius: 4,
                        color: t.fg,
                        fontFamily: mono,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                      }}
                    >
                      {t.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 10, lineHeight: 1.6 }}>
        Legend: <strong style={{ color: '#c23a1c' }}>refuted / no lever</strong> — a test (first pass or a later pass) closed
        the route as an RH lever; <strong style={{ color: 'var(--brass-dk)' }}>first test done</strong> — a concrete test
        ran with an open follow-on; <strong style={{ color: 'var(--faint)' }}>to test</strong> — no test run yet;{' '}
        <strong style={{ color: 'var(--blue)' }}>tested — see detail</strong> — tested with a nuanced finding, read the
        card below. Derived directly from each route&apos;s status string; no new verdicts.
      </p>
    </div>
  );
}

function CrossRouteWallMap({ entries }) {
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Cross-route wall map (routes A–M)</h3>
      <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--faint)', marginBottom: 10, lineHeight: 1.6 }}>
        The single wall each of the thirteen 2026-09-23 routes lands on. Most reduce to Weil positivity;
        a few land on a distinct wall (zero-density, circularity, Jensen/integration, PCC, the mollifier lineage).
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Route</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Name</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Wall</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.route} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--faint)' }}>{e.route}</td>
                <td style={{ padding: '6px 8px', color: 'var(--ink-soft)' }}>{e.name}</td>
                <td style={{ padding: '6px 8px', color: 'var(--blue)', fontFamily: mono, fontSize: 12 }}>{e.wall}</td>
                <td style={{ padding: '6px 8px', color: 'var(--ink-soft)', fontSize: 12 }}>{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RouteCard({ route }) {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: mono, fontSize: 13, color: 'var(--faint)' }}>Route {route.key}</span>
        <h3 style={{ color: 'var(--blue)', margin: 0 }}>{route.name}</h3>
        <StatusBadge status={route.status} />
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>{route.idea}</p>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          First test
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>{route.firstTest}</p>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          Payoff
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>{route.payoff}</p>
      </div>
      {route.status !== 'to-test' && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Status detail
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>{route.status}</p>
        </div>
      )}
    </div>
  );
}

export default function RhNovelRoutesRoadmapPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner variant="REFUTED" />

        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>RH Novel-Routes Roadmap</h1>
          <p style={{ fontFamily: mono, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>{R.frame}</p>
          <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--faint)', marginTop: 8 }}>
            {R.date} · {R.routes.length} routes (A–G) · {R.status}
          </p>
        </div>

        <RouteStatusDashboard routes={R.routes} />

        {R.routes.map((route) => (
          <RouteCard key={route.key} route={route} />
        ))}

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Route H — the opening, tested (Connes–Consani scaling site)</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{ROUTE_H.status}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}>{ROUTE_H.verdict}</p>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            data: src/data/{ROUTE_H.id}.js · Test 2: {ROUTE_H.test2.aStar} · Test 1: {ROUTE_H.test1.compactCap}
          </p>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Route H — next step attempted: the semilocal S = &#123;∞, 2&#125; Sonine trace identity (g-support &lt; ln 3)</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{ROUTE_H_SONINE.status}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}>{ROUTE_H_SONINE.obstruction}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Sub-gap:</strong> {ROUTE_H_SONINE.subGap}</p>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            data: src/data/{ROUTE_H_SONINE.id}.js · p=2 structure: {ROUTE_H_SONINE.p2Structure}
          </p>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Route I — the exact semilocal S = &#123;∞, 2&#125; Sonine trace identity, written and tested</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{ROUTE_I.status}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Left side:</strong> {ROUTE_I.lhs}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Right side:</strong> {ROUTE_I.rhs}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Gap term:</strong> {ROUTE_I.gapTerm}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Positivity of the trace side:</strong> {ROUTE_I.positivity}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Saturation:</strong> {ROUTE_I.saturation}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Where the gap switches on:</strong> {ROUTE_I.switchOn}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Many primes:</strong> {ROUTE_I.manyPrimeObstruction}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Correction to the previous card:</strong> {ROUTE_I.correction}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}>{ROUTE_I.verdict}</p>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            data: src/data/{ROUTE_I.id}.js · limits: {ROUTE_I.honestLimits}
          </p>
        </div>

        <CrossRouteWallMap entries={RH_CROSS_ROUTE_WALL_MAP} />

        <div className="card" style={{ marginTop: 24, background: 'var(--paper2)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Honest note</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{R.honestNote}</p>
        </div>

        <div className="card" style={{ marginTop: 16, background: 'var(--paper2)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/rh-dag" style={{ color: 'var(--blue)', fontSize: 13 }}>RH DAG</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/three-attacks" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Three Approaches</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
