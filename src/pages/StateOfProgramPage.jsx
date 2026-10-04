import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  STATE_OF_PROGRAM_SUMMARY_DATE,
  STATE_OF_PROGRAM_TRUTHS,
} from '../data/state-of-program-truths.js';
import { CAUGHT_OVERCLAIMS, OVERCLAIM_COUNT } from '../data/overclaim-ledger.js';
import { ED } from '../styles/tokens.js';

// The, single canonical top-of-funnel summary. Facts are sourced from
// the shared STATE_OF_PROGRAM_TRUTHS data module, reconciled against the route
// map and the fixed-height certificate packages, so this page and DashboardPage
// cannot drift.
// No heavy zeros-bundle import.
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.

const TRUTHS = STATE_OF_PROGRAM_TRUTHS;

// Render-site badge label (2026-08-28 currency pass): the data module keeps the
// badge string 'UNREVIEWED CANDIDATE' because build assertions
// (imp-2967-state-of-program-overclaim-cross-check.js) key on it; the displayed
// label reflects the current review status — reviewed by Dan Romik, unrefereed.
function displayBadge(badge) {
  return badge === 'UNREVIEWED CANDIDATE' ? 'UNREFEREED CANDIDATE' : badge;
}

export default function StateOfProgramPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>State of the Program</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55 }}>
            One, plain-language summary of where this RH / de&nbsp;Bruijn-Newman Λ approach actually stands.
            The truth is otherwise scattered across the route map, dashboards and self-correction notes — this page
            exists so a reader cannot over-read any single partial page. The summary was reconciled on{' '}
            <strong>{STATE_OF_PROGRAM_SUMMARY_DATE}</strong> against the{' '}
            <strong>full route map ({FULL_ROUTE_MAP.date}, {FULL_ROUTE_MAP.totalRoutes} routes)</strong>,
            the public fixed-height package, and the standalone private candidate package. The one-line truth:{' '}
            <strong>Λ ≤ 0.1787854 is a computer-assisted candidate for an unconditional proof (reviewed by Dan Romik, publicly posted (judegomila.com/posts/riemann-lambda-0.1787854)), and a sharper four-gate candidate reaches Λ ≤ 0.1758354; neither bound is established or refereed, and neither is RH. A further Λ ≤ 0.14 statement is a conditional completion contract with one open family, not a bound.</strong>{' '}
            Since 2026-09 the frontier has moved past this summary's reconciliation date: a
            Λ ≤ 0.17759432 y-thaw package (candidate-unrefereed; 4/8 obligations closed, O1 at Aristotle;
            a package value, not a bound) and a Route VII derived compute floor U ≈ 0.145–0.150 — current
            status at <Link to="/frontier-dag" style={{ color: 'var(--brass-dk)' }}>/frontier-dag</Link>.
          </p>
        </div>

        {TRUTHS.map((t, i) => (
          <div className="card" key={i} style={{ marginBottom: 16, borderLeft: `3px solid ${t.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--ed-mono, var(--font-mono))',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: t.color,
                  border: `1px solid ${t.color}`,
                  borderRadius: 4,
                  padding: '2px 7px',
                }}
              >
                {displayBadge(t.badge)}
              </span>
              <strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>{t.title}</strong>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{t.body}</div>
            {t.route && (
              <div style={{ marginTop: 8, fontSize: 12.5 }}>
                <Link to={t.route}>{t.routeLabel || t.route} →</Link>
              </div>
            )}
          </div>
        ))}

        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: 'var(--terra-dk)',
                border: '1px solid var(--terra-dk)',
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              CORRECTIONS LOG
            </span>
            <strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>
              {OVERCLAIM_COUNT} claims overreached the evidence and were corrected
            </strong>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 0 }}>
            Bound directly to the canonical <code>overclaim-ledger.js</code> registry (not duplicated prose), so
            this record cannot drift from the source of truth.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CAUGHT_OVERCLAIMS.map((o) => (
              <div
                key={o.id}
                style={{
                  borderLeft: '2px solid var(--terra-dk)',
                  paddingLeft: 10,
                  fontSize: 12.5,
                  color: 'var(--ink-soft)',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>
                    #{o.n} · {o.id}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--ed-mono, var(--font-mono))',
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--terra-dk)',
                      border: '1px solid var(--terra-dk)',
                      borderRadius: 3,
                      padding: '1px 5px',
                    }}
                  >
                    {o.status}
                  </span>
                </div>
                <div style={{ color: 'var(--ink)' }}>{o.claim}</div>
                <div style={{ fontSize: 11.5, marginTop: 2 }}>
                  <em>Caught by:</em> {o.caughtBy}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
            For the full route-by-route classification ({FULL_ROUTE_MAP.totalRoutes} routes across 5 clusters,
            with status badges and ranked genuine opportunities), see the{' '}
            <Link to="/route-map">Route Map</Link>.
          </p>
        </div>

        <RelatedLinks links={[
          { to: '/route-map', label: 'Route Map' },
          { to: '/rh-dag', label: 'Proof DAG' },
          { to: '/lambda-bounds', label: 'Lambda Bounds' },
          { to: '/rigor-dashboard', label: 'Rigor Dashboard' },
          { to: '/research-journal', label: 'Research Journal', color: ED.series3 },
        ]} />

        <div className="card" style={{ marginTop: 16 }}>
          <Link to="/">← the atlas</Link>
        </div>
      </div>
    </div>
  );
}
