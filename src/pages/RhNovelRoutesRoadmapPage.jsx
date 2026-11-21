// RhNovelRoutesRoadmapPage.jsx -- imp-96009
// Reading page for src/data/rh-novel-routes-roadmap-2026-09-23.js (RH_NOVEL_ROUTES),
// which previously had no JSX consumer. Renders routes A-G with idea / first test /
// payoff / status, plus the module's own honest no-results note. Presentation-only;
// all facts (including route statuses) live in the data module.

import React from 'react';
import { SnapshotBanner } from '../components/ProgramStatus.jsx';
import { Link } from 'react-router-dom';
import { RH_NOVEL_ROUTES } from '../data/rh-novel-routes-roadmap-2026-09-23.js';
import { RH_ROUTE_H_CONNES_SCALING_SITE as ROUTE_H } from '../data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';
import { RH_ROUTE_H_SEMILOCAL_SONINE as ROUTE_H_SONINE } from '../data/rh-route-h-semilocal-sonine-identity-attempt-2026-09-23.js';
import { RH_ROUTE_I_SEMILOCAL_SONINE_TRACE as ROUTE_I } from '../data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import { RH_ROUTE_I_PENCIL_HIGHRES_MAP as ROUTE_I_HIGHRES } from '../data/rh-route-i-pencil-highres-map-2026-09-23.js';
import { RH_ROUTE_I_SONINE_EXCESS_PORT as ROUTE_I_SONINE_PORT } from '../data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js';
import { RH_ROUTE_I_UNCERTAINTY_CONCENTRATION_CERTIFICATE as ROUTE_I_UC_CERT } from '../data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';
import { IMP_96225_CORR23_DENSITY_ASSESSMENT as CORR23_STATUS } from '../data/imp-96225-route-i-corr23-termwise-uniform-density-assessment.js';
import { IMP_96130_CROSSING_UNIFORMITY } from '../data/imp-96130-route-i-crossing-uniformity-vs-constrained-subfamily-assessment.js';
import { RH_CROSS_ROUTE_WALL_MAP } from '../data/rh-novel-routes-sweep-synthesis-2026-09-23.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

const R = RH_NOVEL_ROUTES;
const mono = 'var(--ed-mono, var(--font-mono))';

// imp-96081: sup_{2a <= ln3} mu_max(a; k) at a = (ln 3)/2, k = number of vanishing moments
// (pole-free {hhat(+-i/2) = 0} plus k moments), read from
// RH_ROUTE_I_PENCIL_HIGHRES_MAP.constraintLever in rh-route-i-pencil-highres-map-2026-09-23.js.
const ROUTE_I_MU_MAX_LADDER = [
  { k: 0, muMax: 0.99716 },
  { k: 1, muMax: 0.93162 },
  { k: 2, muMax: 0.46061 },
  { k: 3, muMax: 0.22802 },
  { k: 4, muMax: 0.19039 },
  { k: 5, muMax: 0.19039 },
  { k: 6, muMax: 0.17320 },
  { k: 7, muMax: 0.12253 },
  { k: 8, muMax: 0.09604 },
];

function RouteIConstraintLadderTable() {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
        Constraint ladder: sup&#8321;&#8322;&#8210;&#8734; mu_max(a; k) at a = (ln 3)/2, by vanishing-moment count k (N = 128)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>k (moments)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>mu_max</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>margin (1 &minus; mu_max)</th>
            </tr>
          </thead>
          <tbody>
            {ROUTE_I_MU_MAX_LADDER.map((row) => (
              <tr key={row.k} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--faint)' }}>{row.k}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{row.muMax.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: row.muMax < 1 ? 'var(--ink-soft)' : 'var(--accent)' }}>
                  {(1 - row.muMax).toFixed(5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8, lineHeight: 1.6 }}>
        Two vanishing moments (k = 2) buy a uniform margin of 0.539 versus 0.068 for one moment (k = 1); k = 4 and
        k = 5 give the same value (added moment has the wrong parity for the current extremal). Not a bound or a
        proof — a finite-N (N = 128) Rayleigh&ndash;Ritz reading of the pencil eigenvalue ladder; RH open.
      </p>
    </div>
  );
}

// imp-96102: per-t-window contribution to the pole-free k=0 extremal quadratic form W(h),
// at the tested supports a in [0.30, (ln3)/2] (N = 96), read from
// RH_ROUTE_I_PENCIL_HIGHRES_MAP.forTheProof / PENCIL_HIGHRES_LITERALS.extremalWindowSplitVsA
// in rh-route-i-pencil-highres-map-2026-09-23.js. archPart = window [0, 3.597); i1Part =
// first p = 2 resonance window (8.145, 9.875); both as a share of L_S(h).
const ROUTE_I_WINDOW_SPLIT = [
  { a: 0.30, archPart: -0.00086, i1Part: -0.17534, archOverLS: -0.0010, i1OverLS: -0.1987 },
  { a: 0.34, archPart: -0.00160, i1Part: -0.24774, archOverLS: -0.0020, i1OverLS: -0.3102 },
  { a: 0.38, archPart: -0.00307, i1Part: -0.30612, archOverLS: -0.0047, i1OverLS: -0.4662 },
  { a: 0.42, archPart: -0.00457, i1Part: -0.33390, archOverLS: -0.0091, i1OverLS: -0.6667 },
  { a: 0.46, archPart: -0.00615, i1Part: -0.34985, archOverLS: -0.0149, i1OverLS: -0.8461 },
  { a: 0.50, archPart: -0.00775, i1Part: -0.35038, archOverLS: -0.0214, i1OverLS: -0.9657 },
  { a: 0.54, archPart: -0.00904, i1Part: -0.34271, archOverLS: -0.0269, i1OverLS: -1.0203 },
  { a: Math.log(3) / 2, archPart: -0.00922, i1Part: -0.34120, archOverLS: -0.0277, i1OverLS: -1.0250 },
];

function RouteIWindowDecompositionTable() {
  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
        Window decomposition: k = 0 pole-free extremal, contribution to W(h) by t-window vs L_S(h), across the
        tested supports a (N = 96)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>a</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>arch [0, 3.6)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>I&#8321; (8.15, 9.88)</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>arch / L_S</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>I&#8321; / L_S</th>
            </tr>
          </thead>
          <tbody>
            {ROUTE_I_WINDOW_SPLIT.map((row) => (
              <tr key={row.a} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--faint)' }}>{row.a.toFixed(4)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{row.archPart.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{row.i1Part.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{(row.archOverLS * 100).toFixed(2)}%</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: row.i1OverLS < -1 ? 'var(--accent)' : 'var(--ink-soft)' }}>
                  {(row.i1OverLS * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8, lineHeight: 1.6 }}>
        The archimedean window stays under 3% of L_S(h) across the whole tested range; the first p = 2 resonance
        window I&#8321; carries the negativity, rising from ~20% at a = 0.30 to past 100% at (ln 3)/2 (the extremal
        peak migrates inward from t &#8776; 12.3 to t &#8776; 7.5 as a rises). Not uniform in a — measurement only,
        N = 96 Rayleigh&ndash;Ritz; RH open; NO QED.
      </p>
    </div>
  );
}

// imp-96159: mu_max(a; k) tracked past the crossing 2a* = 1.1316, from
// IMP_96130_CROSSING_UNIFORMITY.pastCrossingGrid in
// imp-96130-route-i-crossing-uniformity-vs-constrained-subfamily-assessment.js (rows are
// [a, 2a, mu_max(k=0), mu_max(k=1), mu_max(k=2), mu_max(k=3)]).
const ROUTE_I_CROSSING_GRID = IMP_96130_CROSSING_UNIFORMITY.pastCrossingGrid;

function RouteICrossingLadderTable() {
  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginBottom: 6 }}>
        Crossing ladder: mu_max(a; k) tracked past 2a* = 1.1316 (= ln 3 + 0.033), by vanishing-moment
        count k (N = 128)
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>2a</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>k = 0</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>k = 1</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>k = 2</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>k = 3</th>
              <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>margin (k &ge; 2)</th>
            </tr>
          </thead>
          <tbody>
            {ROUTE_I_CROSSING_GRID.map(([a, twoA, k0, k1, k2, k3]) => (
              <tr key={a} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--faint)' }}>{twoA.toFixed(2)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: k0 < 1 ? 'var(--ink-soft)' : 'var(--accent)' }}>{k0.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: k1 < 1 ? 'var(--ink-soft)' : 'var(--accent)' }}>{k1.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{k2.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{k3.toFixed(5)}</td>
                <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--ink-soft)' }}>{(1 - k2).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8, lineHeight: 1.6 }}>
        Past the crossing (2a = 1.16, 1.20) the unconstrained k &le; 1 eigenvalue exceeds 1, but the
        k &ge; 2 vanishing-moment sub-family stays strictly below 1 (margin &ge; 0.29). By the
        min-over-subset identity (min over a constrained subspace is &ge; the min over the whole
        space), this larger margin is the absence of the crossing direction from the sub-family, not
        evidence about it — certifying D_S &le; L_S on k &ge; 2 certifies nothing about the full-space
        inequality. Not a bound or a proof; RH open; NO QED.
      </p>
    </div>
  );
}

// imp-96061: J/K/L/M (non-stat-mech batch, rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js)
// have no "to-test / first-test-done / refuted-as-lever" status string of their own -- they are read
// off the already-committed cross-route wall map (route, name, wall, note) and folded into the
// dashboard as extra rows so the "at a glance" table covers all thirteen A-M routes, not just A-G.
const NON_STAT_MECH_ROUTE_KEYS = ['J', 'K', 'L', 'M'];

function statusTheme(status) {
  if (/^to-test$/.test(status)) {
    return { fg: 'var(--faint)', bg: alpha(ED.inkFaint, 0.1), border: 'var(--faint)', label: 'to test' };
  }
  if (/^refuted-as-lever/.test(status)) {
    return { fg: ED.accent, bg: alpha(ED.series2, 0.1), border: ED.accent, label: 'refuted as lever' };
  }
  if (/^first-test-done/.test(status)) {
    return { fg: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.14), border: 'var(--brass-dk)', label: 'first test done' };
  }
  return { fg: 'var(--blue)', bg: alpha(ED.series1, 0.1), border: 'var(--blue)', label: 'status' };
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
    return { label: 'refuted / no lever', fg: ED.accent, bg: alpha(ED.series2, 0.1), border: ED.accent };
  }
  if (/^first-test-done/.test(status)) {
    return { label: 'first test done', fg: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.14), border: 'var(--brass-dk)' };
  }
  if (/^to-test$/.test(status)) {
    return { label: 'to test', fg: 'var(--faint)', bg: alpha(ED.inkFaint, 0.1), border: 'var(--faint)' };
  }
  return { label: 'tested — see detail', fg: 'var(--blue)', bg: alpha(ED.series1, 0.1), border: 'var(--blue)' };
}

function RouteStatusDashboard({ routes, extraRows = [] }) {
  const hasExtra = extraRows.length > 0;
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
              {hasExtra && <th style={{ padding: '4px 8px', fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>Wall</th>}
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
                  {hasExtra && <td style={{ padding: '6px 8px', color: 'var(--faint)' }}>—</td>}
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
            {extraRows.map((row) => {
              const t = classifyRouteStatus(row.status);
              return (
                <tr key={row.key} style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <td style={{ padding: '6px 8px', fontFamily: mono, color: 'var(--faint)' }}>{row.key}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--ink-soft)' }}>{row.name}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--faint)' }}>—</td>
                  <td style={{ padding: '6px 8px', color: 'var(--blue)', fontFamily: mono, fontSize: 12 }}>{row.wall}</td>
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
        Legend: <strong style={{ color: 'var(--accent)' }}>refuted / no lever</strong> — a test (first pass or a later pass) closed
        the route as an RH lever; <strong style={{ color: 'var(--brass-dk)' }}>first test done</strong> — a concrete test
        ran with an open follow-on; <strong style={{ color: 'var(--faint)' }}>to test</strong> — no test run yet;{' '}
        <strong style={{ color: 'var(--blue)' }}>tested — see detail</strong> — tested with a nuanced finding, read the
        card below. Derived directly from each route&apos;s status string; no new verdicts.
        {hasExtra && ' The J/K/L/M rows (non-stat-mech batch) carry a Wall column read from the cross-route wall map below instead of a Payoff.'}
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
          <SnapshotBanner date="2026-10-06">The route records on this page are dated 2026-09-23 to 2026-10-06.</SnapshotBanner>
          <p style={{ fontFamily: mono, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>{R.frame}</p>
          <p style={{ fontFamily: mono, fontSize: 12, color: 'var(--faint)', marginTop: 8 }}>
            {R.date} · {R.routes.length} routes (A–G) · {R.status}
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8 }}>
            Current roadmap: <Link to="/routes-roadmap">fifty research routes (2026-10-06)</Link>, grouped A–J with status per route.
          </p>
        </div>

        <RouteStatusDashboard
          routes={R.routes}
          extraRows={RH_CROSS_ROUTE_WALL_MAP
            .filter((e) => NON_STAT_MECH_ROUTE_KEYS.includes(e.route))
            .map((e) => ({ key: e.route, name: e.name, wall: e.wall, status: `refuted-as-lever — ${e.note}` }))}
        />

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

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Route I — the Connes–Consani Sonine refinement ported to S = &#123;∞, 2&#125;: excess computed exactly, obstruction located</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{ROUTE_I_SONINE_PORT.status}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Decomposition:</strong> {ROUTE_I_SONINE_PORT.decomposition}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Semilocal prolate spectrum:</strong> {ROUTE_I_SONINE_PORT.spectrum}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Cusp allocation:</strong> {ROUTE_I_SONINE_PORT.cuspTheorem}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Obstruction:</strong> {ROUTE_I_SONINE_PORT.obstruction}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>The Weil form on the window:</strong> {ROUTE_I_SONINE_PORT.weilWindow}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}>{ROUTE_I_SONINE_PORT.verdict}</p>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            data: src/data/{ROUTE_I_SONINE_PORT.id}.js · limits: {ROUTE_I_SONINE_PORT.honestLimits}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8, borderLeft: '2px solid var(--brass-dk)', paddingLeft: 10 }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Honest status — mixed &#123;∞, 2, 3&#125; extension (imp-96225):</strong> {CORR23_STATUS.verdict}
          </p>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Route I — the D_S &le; L_S full-symbol certificate, all 2a &le; ln 3</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{ROUTE_I_UC_CERT.status}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Theorem:</strong> {ROUTE_I_UC_CERT.theorem}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8, borderLeft: '2px solid var(--brass-dk)', paddingLeft: 10 }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Honest status — verification level:</strong> {ROUTE_I_UC_CERT.honestLimits}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8, borderLeft: '2px solid var(--brass-dk)', paddingLeft: 10 }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Literature — external claims, UNVERIFIED here:</strong> {ROUTE_I_UC_CERT.literature}
          </p>
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            data: src/data/{ROUTE_I_UC_CERT.id}.js
          </p>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 8 }}>Route I — numerics companion: high-resolution pencil map</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>{ROUTE_I_HIGHRES.status}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Crossing past ln 3:</strong> {ROUTE_I_HIGHRES.crossing}</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, marginTop: 8 }}><strong style={{ color: 'var(--brass-dk)' }}>Honest limits:</strong> {ROUTE_I_HIGHRES.honestLimits}</p>
          <RouteIConstraintLadderTable />
          <RouteIWindowDecompositionTable />
          <RouteICrossingLadderTable />
          <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            data: src/data/{ROUTE_I_HIGHRES.id}.js
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
            <Link to="/routes-roadmap" style={{ color: 'var(--blue)', fontSize: 13 }}>Fifty research routes (2026-10-06)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
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
