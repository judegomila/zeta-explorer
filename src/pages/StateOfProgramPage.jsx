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
import { PROGRAM_STATUS_SUMMARY, SUPERSEDED_HEADLINES } from '../data/program-status-current.js';
import { AsOfLine, CurrentStatusList } from '../components/ProgramStatus.jsx';

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
          <AsOfLine />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55 }}>
            One summary of where this RH / de&nbsp;Bruijn-Newman Λ program stands. Each statement in the first
            list names the file of the repository that supports it. Reconciled on{' '}
            <strong>{STATE_OF_PROGRAM_SUMMARY_DATE}</strong>. <strong>{PROGRAM_STATUS_SUMMARY}</strong>
          </p>
        </div>

        <h2 className="ed-h2" style={{ marginBottom: 12 }}>Current status</h2>
        <CurrentStatusList />

        <section className="card" aria-labelledby="arithmetic-theta-update" style={{ marginTop: 20 }}>
          <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11 }}>RESEARCH UPDATE · 20 NOVEMBER 2026</div>
          <h2 id="arithmetic-theta-update" className="ed-h2">Arithmetic lattices and twin-ladder geometry</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.65 }}>
            A new note proves the finite frame and projection estimates, the singular Schur
            squared-distance identity, and lattice and packing lemmas, then states the arithmetic
            cost estimate needed for the proposed RH route. That estimate remains open.
            The 20 exact finite checks validate algebra and normalizations; they are not a full Lean replay.
          </p>
          <Link to="/rh-arithmetic-theta-geometry">Read the results, manuscripts and remaining proof obligation →</Link>
        </section>

        <h2 className="ed-h2" style={{ marginTop: 28, marginBottom: 12 }}>Values shown as leading on older pages</h2>
        <div className="card" style={{ marginBottom: 16 }}>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            {SUPERSEDED_HEADLINES.map((h) => (
              <li key={h.value}><strong style={{ color: 'var(--ink)' }}>{h.value}</strong> — {h.was}. Now: {h.now}.</li>
            ))}
          </ul>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 28, marginBottom: 6 }}>Graded statements</h2>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0 }}>
          The first four cards were added on {STATE_OF_PROGRAM_SUMMARY_DATE}. The others were written between
          2026-08-24 and 2026-09-30 and are kept; they refer to the{' '}
          <Link to="/route-map">route map</Link> ({FULL_ROUTE_MAP.date}, {FULL_ROUTE_MAP.totalRoutes} routes).
        </p>

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
          { to: '/key-results', label: 'Key results' },
          { to: '/lambda-0116091', label: 'Conditional 0.116091' },
          { to: '/rh-research-modules', label: 'RH research modules' },
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
