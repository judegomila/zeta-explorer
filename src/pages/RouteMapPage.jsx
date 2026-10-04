import React from 'react';
import { Link } from 'react-router-dom';
import {
  FULL_ROUTE_MAP,
  RANKED_OPPORTUNITIES,
  FULL_ROUTE_MAP_NEXT_MOVE,
  ROUTE_MAP_CROSS_CHECK,
} from '../data/full-route-map-2026-06-19.js';
import { CH_WALL_FRONTIER } from '../data/ch-wall-frontier-verdict-2026-06-26.js';
import { ECONN_METRIC_REARCH } from '../data/econn-metric-rearchitecture-verdict-2026-06-30.js';
import { C_SHOCK_CROSS_VALIDATION_IMP3026 } from '../data/imp-3026-c-shock-cross-validation.js';
import { C_SHOCK_N_DEPENDENCE_IMP3070 } from '../data/imp-3070-c-shock-n-dependence.js';
import { STATUS_COLOR, StatusTag, StatusLegend } from '../components/StatusLegend.jsx';
import { IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION } from '../data/imp-3066-offdiagonal-hankel-obstruction.js';
import { SG1C_ASYM_ISOLATION_CLOSED_FORM } from '../data/sg1c-asym-isolation-closed-form-2026-06-30.js';
import { CH_LIP_THREE_PROOFS } from '../data/ch-lip-three-proofs-table-2026-06-30.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { ED, alpha } from '../styles/tokens.js';

const CLUSTER_TITLES = {
  lambdaUpper: 'Λ Upper-Bound Routes',
  directRH: 'Direct-RH Routes (not via Λ)',
  machineryCrossvalLower: 'Machinery · Cross-Validation · Lower Bounds',
  literaturePCC: 'Literature Ports & the Montgomery-PCC Surface',
  originalIdeas: 'Original / Novel-Angle Ideas',
  permutationFreeze: 'Post-Freeze Frontier (permutation architecture)',
};

// Warm editorial card base — replaces the legacy dark `.card` shell.
const edCard = {
  background: 'var(--paper2)',
  border: '1px solid var(--hairline)',
  borderRadius: 10,
  padding: '16px 18px',
};

function OppDots({ score }) {
  return (
    <span title={`opportunity ${score}/10`} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: score >= 5 ? 'var(--brass-dk)' : score >= 3 ? 'var(--ink-soft)' : 'var(--faint)' }}>
      {score}/10
    </span>
  );
}

// imp-3118 — viz of the imp-3070 C_shock(N) monotone decay against the 1/3 cap,
// with the (1/3 - C_shock) margin band shaded and the worst-case N=2458 marked.
function CShockDecayViz() {
  const D = C_SHOCK_N_DEPENDENCE_IMP3070;
  const rows = D.table;
  const cap = D.cap;
  const W = 660, H = 300;
  const padL = 58, padR = 18, padT = 22, padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  // log-x over the assembly N-range, fixed y-window framing both the curve and the cap.
  const lxMin = Math.log10(D.nMin);
  const lxMax = Math.log10(D.nMax);
  const yMin = 0.20, yMax = 0.34;
  const xOf = (N) => padL + ((Math.log10(N) - lxMin) / (lxMax - lxMin)) * plotW;
  const yOf = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  const curve = rows.map((r) => `${xOf(r.N).toFixed(1)},${yOf(r.C_shock).toFixed(1)}`).join(' ');
  // Margin band = area between the C_shock(N) curve and the cap line.
  const bandTop = rows.map((r) => `${xOf(r.N).toFixed(1)},${yOf(cap).toFixed(1)}`);
  const bandBot = rows.map((r) => `${xOf(r.N).toFixed(1)},${yOf(r.C_shock).toFixed(1)}`).reverse();
  const bandPts = bandTop.concat(bandBot).join(' ');
  const worst = rows.find((r) => r.N === D.worstN) || rows[0];
  const xTicks = [2458, 1e4, 1e5, 1e6];
  const yTicks = [0.20, 0.24, 0.28, cap, 0.34];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="C_shock(N) monotone decay against the 1/3 cap with margin band shaded">
      {/* y grid + labels */}
      {yTicks.map((t, i) => (
        <g key={`y${i}`}>
          <line x1={padL} y1={yOf(t)} x2={W - padR} y2={yOf(t)} stroke={alpha(ED.rule, 0.18)} strokeWidth="1" />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fontSize="10"
            fill={Math.abs(t - cap) < 1e-9 ? 'var(--terra-dk)' : 'var(--ink-soft)'} fontFamily="var(--font-mono, monospace)">
            {Math.abs(t - cap) < 1e-9 ? '1/3' : t.toFixed(2)}
          </text>
        </g>
      ))}
      {/* x labels */}
      {xTicks.map((t, i) => (
        <text key={`x${i}`} x={xOf(t)} y={H - padB + 16} textAnchor="middle" fontSize="10"
          fill={ED.inkSoft} fontFamily="var(--font-mono, monospace)">
          {t >= 1e4 ? `${(t / 1000).toFixed(0)}k` : t}
        </text>
      ))}
      <text x={padL + plotW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill={ED.ink}>
        assembly level N (log scale)
      </text>
      {/* margin band */}
      <polygon points={bandPts} fill={alpha(ED.brassDeco, 0.14)} stroke="none" />
      {/* cap line */}
      <line x1={padL} y1={yOf(cap)} x2={W - padR} y2={yOf(cap)} stroke={ED.accent} strokeWidth="1.6" strokeDasharray="6 4" />
      <text x={W - padR} y={yOf(cap) - 5} textAnchor="end" fontSize="10.5" fill={ED.accent}>
        imp-2786 cap C_shock &lt; 1/3
      </text>
      {/* C_shock(N) curve */}
      <polyline points={curve} fill="none" stroke={ED.brassDeco} strokeWidth="2" />
      {rows.map((r, i) => (
        <circle key={`p${i}`} cx={xOf(r.N)} cy={yOf(r.C_shock)} r="2.6" fill={ED.brassDeco} />
      ))}
      {/* worst-case marker */}
      <circle cx={xOf(worst.N)} cy={yOf(worst.C_shock)} r="5.5" fill="none" stroke={ED.brassDeco} strokeWidth="2" />
      <text x={xOf(worst.N) + 10} y={yOf(worst.C_shock) - 8} fontSize="10.5" fill={ED.brass}
        fontFamily="var(--font-mono, monospace)">
        worst N={worst.N}: C_shock={worst.C_shock.toFixed(4)} (margin {worst.margin_to_cap.toFixed(4)})
      </text>
    </svg>
  );
}

export default function RouteMapPage() {
  const clusters = FULL_ROUTE_MAP.clusters;
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>the wall map · {FULL_ROUTE_MAP.totalRoutes} routes · {Object.keys(clusters).length} clusters</span>} />
      <div className="ed-full" style={{ padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24, borderBottom: '1px solid var(--hairline)', paddingBottom: 18 }}>
          <h1 style={{ margin: '0 0 10px', color: 'var(--ink)', fontFamily: 'var(--ed-display, Georgia, serif)', fontSize: 34, fontWeight: 600 }}>RH / Λ Route Map</h1>
          <div style={{ maxWidth: 460, border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', margin: '0 0 14px', background: 'var(--paper)' }}>
            <WireframeAnim kind="no-go-wall" />
          </div>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 'none' }}>
            The map of every route the project has tried —{' '}
            <strong>{FULL_ROUTE_MAP.totalRoutes} routes</strong> across {Object.keys(clusters).length} clusters
            ({FULL_ROUTE_MAP.date}), classified by status and genuine remaining opportunity.
            The five core clusters were frozen 2026-06-19 (full-route-map workflow); the sixth cluster
            records the post-freeze frontier — the{' '}
            <Link to="/permutation-architecture" style={{ color: 'var(--brass-dk)' }}>permutation architecture</Link>{' '}
            with its conditional Λ ≤ 0.14 completion contract (a contract, not a bound);
            for the frontier after 2026-08 (y-thaw package, Route VII floor) see{' '}
            <Link to="/frontier-dag" style={{ color: 'var(--brass-dk)' }}>/frontier-dag</Link>.
            The one-line truth of the frozen core: <strong>there is no shortcut below RH anywhere in it</strong> —
            the inherited Dyson/collision routes seeking to drive Λ to zero funnel into the{' '}
            <strong style={{ color: 'var(--brass)' }}>C_H Hölder-½ shock modulus</strong> (RH-hard at the
            modulus). The peer-reviewed benchmark is Platt–Trudgian Λ ≤ 0.2;
            the public 0.1875 certificate-package claim remains unrefereed. Separately, the standalone
            repository presents Λ ≤ 0.1787854 as a computer-assisted candidate for an
            unconditional proof (the bound is not established, has been reviewed by Dan Romik, and is not RH),
            and a sharper four-gate candidate reaches Λ ≤ 0.1758354 (unrefereed) —{' '}
            <Link to="/lambda-01758354-candidate" style={{ color: 'var(--brass-dk)' }}>candidate page</Link>.
          </p>
        </div>

        {/* Foreclosure notice — top-of-page anchor */}
        <div style={{ ...edCard, marginBottom: 20, borderColor: 'color-mix(in srgb, var(--accent) 50%, transparent)', background: 'color-mix(in srgb, var(--series-2) 5%, transparent)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--terra-dk)', letterSpacing: '0.06em', marginBottom: 5 }}>
                FORECLOSED — IMPOSSIBILITY
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 600, marginBottom: 3 }}>
                C_H Lipschitz Route
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                Three independent proofs that a finite global-W_1 C_Lip is foreclosed within the W_1 bridge:
                (1) Holder-1/2 lower bound C_Lip &ge; C_shock/(2&#x221A;W_1) &rarr; &infin;;
                (2) linear-N norm-mismatch (exact closed form); (3) all squared-gap surrogates refuted.
                CORRECTED (econn-metric-rearchitecture, 2026-06-30): the metric is <em>incidental</em>, not fundamental —
                a sup-norm re-architecture re-architectures C_Lip to N-uniform ~9.4e-3, so the earlier
                &ldquo;sup-norm foreclosed&rdquo; was an overclaim. But it is <em>futile</em>: the true wall is metric-invariant —
                the multi-body isolation D_rest — so swapping the norm relocates the obstruction without removing it.
              </div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 35%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', letterSpacing: '0.06em', marginBottom: 5 }}>
                SOLE DETERMINISTIC FORWARD MOVE
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 600, marginBottom: 3 }}>
                R2-T Multi-Body Isolation Constant (closed form)
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                Single-shell closed form: <em>c</em>* = &#x221A;(2+&#x221A;3)&minus;1 &#x2248; 0.9319 (imp-3005).
                Global multi-body <em>c</em> not yet in closed form; asymmetric configs worsen to ~0.927.
                Theorem C holds at <em>c</em> = 0.72. NOT RH-hard — a concrete analytic target.
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ ...edCard, marginBottom: 20 }}>
          <StatusLegend />
        </div>

        {/* Ranked opportunities — the actionable part */}
        <div style={{ ...edCard, marginBottom: 24, borderColor: 'color-mix(in srgb, var(--brass-deco) 40%, transparent)' }}>
          <h3 style={{ color: 'var(--brass-dk)', marginTop: 0 }}>Ranked Genuine Opportunities</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0 }}>
            Scored by upside that is <em>not</em> just another RH reformulation.
          </p>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {RANKED_OPPORTUNITIES.map((o) => (
              <li key={o.rank} style={{ marginBottom: 10 }}>
                <strong style={{ color: 'var(--ink)' }}>{o.target}</strong>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.55 }}>{o.why}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Route table by cluster */}
        {Object.entries(clusters).map(([key, routes]) => (
          <div style={{ ...edCard, marginBottom: 18 }} key={key}>
            <h3 style={{ color: 'var(--ink)', marginTop: 0, fontSize: 15 }}>{CLUSTER_TITLES[key] || key}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {routes.map((r) => (
                <div key={r.name} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'start',
                  padding: '8px 10px', borderRadius: 6, background: 'var(--paper3)',
                  border: '1px solid var(--hairline)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.5 }}>{r.note}</div>
                  </div>
                  <StatusTag status={r.status} />
                  <OppDots score={r.opp} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Frontier residuals: deterministic vs RH-hard */}
        <div style={{ ...edCard, marginBottom: 18, borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)' }}>
          <h3 style={{ color: 'var(--terra-dk)', marginTop: 0 }}>Frontier Push Verdict ({CH_WALL_FRONTIER.date})</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0, marginBottom: 14 }}>
            Status: <strong style={{ color: 'var(--terra-dk)' }}>{CH_WALL_FRONTIER.verdict}</strong> — the Lipschitz route is{' '}
            provably closed three independent ways. The only remaining forward move is deterministic.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 6, letterSpacing: '0.04em' }}>DETERMINISTIC RESIDUAL</div>
              <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
                sg1c R2-T isolation constant: symmetric single-shell{' '}
                <em>c*</em> = sqrt(2+sqrt(3))&minus;1 &asymp; 0.9319 (algebraic, imp-3005).
                Asymmetric R&rarr;&infin; class (imp-{SG1C_ASYM_ISOLATION_CLOSED_FORM.ticket.replace('imp-', '')}):
                transcendental closed form <em>c</em><sub>asym</sub> = {SG1C_ASYM_ISOLATION_CLOSED_FORM.cAsym.toFixed(7)},
                unique root of &psi;(g+1)+&gamma;+2g&minus;2/g&minus;1/(g+1)=0
                (digamma lattice tail irreducible;: BASIN-CONDITIONAL, not proven global infimum).
                Theorem C holds at <em>c</em> = {SG1C_ASYM_ISOLATION_CLOSED_FORM.basinIsolationRatio}; margin{' '}
                &asymp; {SG1C_ASYM_ISOLATION_CLOSED_FORM.preservedBasinMargin.toFixed(4)}.
                <strong style={{ color: 'var(--green)' }}> NOT RH-hard — a concrete analytic gap.</strong>
              </div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--terra-dk)', marginBottom: 6, letterSpacing: '0.04em' }}>RH-HARD WALLS (FORECLOSED)</div>
              <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
                <strong>Global-W_1 C_Lip:</strong> {CH_LIP_THREE_PROOFS.proofs.length} independent proofs it is foreclosed
                ({CH_LIP_THREE_PROOFS.proofs.map((p) => p.name).join('; ')}).
                Verdict: <em>{CH_LIP_THREE_PROOFS.verdict}</em>.
                <br />
                <strong>GUE cusp-spacing:</strong> two-sided Montgomery&ndash;PCC spacing content; no analytic bypass found.
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--faint)' }}>
            Sharpest diagnosis: {CH_WALL_FRONTIER.sharpestDiagnosis}
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 5, background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 30%, transparent)', fontSize: 12, color: 'var(--blue)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--blue)', letterSpacing: '0.04em' }}>TWO INDEPENDENT PUSHES — SAME TARGET.</strong>{' '}
            The C_H frontier ({CH_WALL_FRONTIER.date}) and the econn-metric rearchitecture ({ECONN_METRIC_REARCH.date})
            converge on the <em>same named deterministic target</em>:{' '}
            <strong>D_rest(t_c)</strong> — {ECONN_METRIC_REARCH.trueWall}.
          </div>
        </div>

        {/* imp-3026 — C_shock dual-appearance cross-validation (consistency, NOT a bound) */}
        <div style={{ ...edCard, marginBottom: 18, borderColor: 'color-mix(in srgb, var(--brass-deco) 35%, transparent)' }}>
          <h3 style={{ color: 'var(--brass-dk)', marginTop: 0 }}>
            C_shock dual-appearance identity (imp-3026 cross-validation)
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0, marginBottom: 12 }}>
            The constant <strong style={{ color: 'var(--ink)' }}>C_shock</strong> shows up TWICE in the
            frontier verdict above — once as the cusp-law prefactor g_min ≈ C_shock·W₁<sup>1/2</sup>{' '}
            (Hölder-½, capped &lt;&nbsp;1/3 by imp-2786) and once as the squared-gap surrogate
            constant C_shock²/8. Along the 1-parameter cusp family both appearances recover the SAME
            number, confirming they are one constant rather than two independently-fitted values.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--brass-deco) 7%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brass-dk)', marginBottom: 6, letterSpacing: '0.04em' }}>
                ROUTE A — cusp law (log-log fit)
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-mono, monospace)' }}>
                C_shock = {C_SHOCK_CROSS_VALIDATION_IMP3026.cShockRouteA_star.toFixed(6)}
              </div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--brass-deco) 7%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brass-dk)', marginBottom: 6, letterSpacing: '0.04em' }}>
                ROUTE B — √(8·C_shock²/8) from squared gap
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-mono, monospace)' }}>
                C_shock = {C_SHOCK_CROSS_VALIDATION_IMP3026.cShockRouteB_star.toFixed(6)}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
            At N* = {C_SHOCK_CROSS_VALIDATION_IMP3026.nStar.toLocaleString()} the two routes agree to{' '}
            |Δ| = {C_SHOCK_CROSS_VALIDATION_IMP3026.absDiffAB_star.toExponential(1)} (surrogate bounded
            constant C_shock²/8 ≈ {C_SHOCK_CROSS_VALIDATION_IMP3026.squaredGapBoundedConst_star.toFixed(5)}),
            both safely under the imp-2786 cap of 1/3.
          </div>
          <div style={{ padding: '9px 11px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--terra-dk)', marginBottom: 5, letterSpacing: '0.04em' }}>
              SCOPE — NOT A BOUND
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
              {C_SHOCK_CROSS_VALIDATION_IMP3026.surrogateStillRefuted} {C_SHOCK_CROSS_VALIDATION_IMP3026.honestNote}
            </div>
          </div>
        </div>

        {/* imp-3118 — viz of the imp-3070 C_shock(N) monotone decay vs the 1/3 cap */}
        <div style={{ ...edCard, marginBottom: 18, borderColor: 'color-mix(in srgb, var(--brass-deco) 35%, transparent)' }}>
          <h3 style={{ color: 'var(--brass-dk)', marginTop: 0 }}>
            C_shock(N) decay vs the 1/3 cap (imp-3070 uniformity, imp-3118 viz)
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0, marginBottom: 12 }}>
            imp-3070 tabulates C_shock(N) = √(2 / (3·log γ<sub>N</sub>)) across a 13-point log-spaced N
            grid. It is <strong style={{ color: 'var(--ink)' }}>strictly decreasing</strong> in N (the slow
            1/√(log γ<sub>N</sub>) factor), falling from ≈{C_SHOCK_N_DEPENDENCE_IMP3070.maxCShock.toFixed(4)}{' '}
            at N={C_SHOCK_N_DEPENDENCE_IMP3070.worstN.toLocaleString()} to ≈
            {C_SHOCK_N_DEPENDENCE_IMP3070.table[C_SHOCK_N_DEPENDENCE_IMP3070.table.length - 1].C_shock.toFixed(4)}{' '}
            at N=1e6. The cap C_shock &lt; 1/3 reduces to log γ<sub>N</sub> &gt; 6 ⟺ γ<sub>N</sub> &gt;
            e<sup>6</sup> ≈ 403, which every assembly height clears by an order of magnitude. The worst
            case (smallest margin {C_SHOCK_N_DEPENDENCE_IMP3070.minMargin.toFixed(4)}) is the smallest N.
          </p>
          <CShockDecayViz />
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 10, marginBottom: 12 }}>
            Brass curve: C_shock(N). Terra dashed line: the imp-2786 cap 1/3. Shaded band: the margin
            (1/3 − C_shock), widening monotonically as N grows. Ringed marker: the worst-case N=
            {C_SHOCK_N_DEPENDENCE_IMP3070.worstN.toLocaleString()} point.
          </div>
          <div style={{ padding: '9px 11px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--terra-dk)', marginBottom: 5, letterSpacing: '0.04em' }}>
              SCOPE — NOT A NEW BOUND
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
              {C_SHOCK_N_DEPENDENCE_IMP3070.honestNote} This viz certifies the uniformity of an
              already-proven cap; it does NOT close C_H. The separate public 0.1875 claim does not
              close this route either.
            </div>
          </div>
        </div>

        {/* imp-3093 / imp-3066 — lone operator-positivity obstruction the scalar cover leaves untouched */}
        <div style={{ ...edCard, marginBottom: 18, borderColor: 'color-mix(in srgb, var(--brass-deco) 45%, transparent)' }}>
          <h3 style={{ color: 'var(--brass-dk)', marginTop: 0 }}>
            Scalar Cover Route: Operator/Diagonal Gap — the Lone Open Obstruction (imp-3066)
          </h3>
          {/* imp-3101 — explicit route-step status annotation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 40%, transparent)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--green)', letterSpacing: '0.07em', marginBottom: 4 }}>
                NECESSARY STEP — CLOSED
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.55 }}>
                Degree-0 scalar overflow cover: residual deficit D_pass = 0 for all a (imp-3007, imp-3065).
                The scalar domination condition is fully satisfied.
              </div>
            </div>
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 45%, transparent)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--brass-dk)', letterSpacing: '0.07em', marginBottom: 4 }}>
                SUFFICIENCY STEP — OPEN
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.55 }}>
                Operator positivity K_a &ge; 0 not yet established: off-diagonal endpoint-Hankel
                cross-terms keep &#x2016;R&#x2016; &gt; max R_jj (imp-3066). Route verdict:
                necessary-step-complete, sufficiency-open.
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0, marginBottom: 12 }}>
            The degree-0 scalar mu^pass cover (imp-3007) drives the residual deficit to EXACTLY 0 — a
            necessary condition. But the RH-equivalent target is the OPERATOR positivity K_a &ge; 0,
            i.e. de-homogenized R = G_pass^&#x207B;&#xBD; G_shear G_pass^&#x207B;&#xBD; must be a
            contraction (&#x2016;R&#x2016; &le; 1). Scalar domination bounds only the{' '}
            <strong style={{ color: 'var(--ink)' }}>diagonal</strong> of R; the shear Gram G_shear is a
            genuine off-diagonal endpoint-Hankel form with non-zero cross-terms the scalar cover never
            sees. imp-3066 measures this gap on a degree-{IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.construction.degree} representative truncation:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 4, letterSpacing: '0.05em' }}>
                DIAGONAL max R_jj (scalar cover)
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>
                {IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured.rDiagMax.toFixed(6)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 3 }}>
                every diag &lt; 1 &rarr; scalar cover holds
              </div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--terra-dk)', marginBottom: 4, letterSpacing: '0.05em' }}>
                OPERATOR NORM &#x2016;R&#x2016; (Perron)
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>
                {IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured.operatorNorm.toFixed(6)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 3 }}>
                strictly exceeds diagonal max
              </div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 35%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brass-dk)', marginBottom: 4, letterSpacing: '0.05em' }}>
                OPERATOR/DIAGONAL GAP (Perron-Frobenius)
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>
                +{IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured.operatorDiagonalGap.toFixed(6)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 3 }}>
                off-diag Hankel contribution &gt; 0
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
            R has strictly positive entries, so by Perron-Frobenius its top eigenvalue strictly exceeds
            its largest diagonal. The gap (+{IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured.operatorDiagonalGap.toExponential(3)}) is fed entirely by the off-diagonal
            endpoint-Hankel cross-terms (min |H_jk| ={' '}
            {IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured.minOffDiagonalHankelCrossTerm.toExponential(4)},
            max |H_jk| ={' '}
            {IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.measured.maxOffDiagonalHankelCrossTerm.toExponential(4)}).
            This is the <strong style={{ color: 'var(--brass-dk)' }}>lone open obstruction</strong>: to close the
            scalar cover route one must additionally show &#x2016;R&#x2016; &le; 1, which requires
            bounding precisely these cross-terms.
          </div>
          <div style={{ padding: '9px 11px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 28%, transparent)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--terra-dk)', marginBottom: 4, letterSpacing: '0.05em' }}>
              SCOPE — REPRESENTATIVE TRUNCATION, NO RH VERDICT
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
              {IMP3066_OFFDIAGONAL_HANKEL_OBSTRUCTION.honestCaveat.opNormCarriesNoRHVerdict}
            </div>
          </div>
        </div>

        {/* Next move */}
        <div style={{ ...edCard, marginTop: 8, borderColor: 'color-mix(in srgb, var(--brass) 40%, transparent)' }}>
          <h3 style={{ color: 'var(--brass)', marginTop: 0 }}>Highest-Value Next Move</h3>
          <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--brass)' }}>Primary:</strong> {FULL_ROUTE_MAP_NEXT_MOVE.primary}
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Secondary:</strong> {FULL_ROUTE_MAP_NEXT_MOVE.secondary}
          </p>
          <p style={{ fontSize: 12.5, color: 'var(--terra-dk)', lineHeight: 1.6 }}>
            <strong>Do NOT invest:</strong> {FULL_ROUTE_MAP_NEXT_MOVE.doNotInvest}
          </p>
        </div>

        {/* Cross-check against the DAG and roadmap */}
        <div style={{ ...edCard, marginTop: 18, borderColor: 'color-mix(in srgb, var(--brass-deco) 40%, transparent)' }}>
          <h3 style={{ color: 'var(--brass-dk)', marginTop: 0 }}>Consistency Cross-Check (vs the DAG & roadmap)</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 0 }}>{ROUTE_MAP_CROSS_CHECK.netVerdict}</p>
          {ROUTE_MAP_CROSS_CHECK.inconsistencies.map((x, i) => (
            <div key={i} style={{ marginTop: 10, padding: '8px 10px', borderRadius: 6, background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 20%, transparent)' }}>
              <div style={{ fontSize: 12.5, color: 'var(--brass-dk)', fontWeight: 600, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <span>{x.view}</span>
                <StatusTag status={x.severity === 'high' ? 'DEAD-END-FORNOW' : 'CONDITIONAL'} />
                <span style={{
                  display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 10.5, fontWeight: 700,
                  fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
                  background: x.resolution === 'reconciled' ? 'color-mix(in srgb, var(--series-3) 14%, transparent)' : 'color-mix(in srgb, var(--series-2) 12%, transparent)',
                  border: x.resolution === 'reconciled' ? '1px solid color-mix(in srgb, var(--series-3) 45%, transparent)' : '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                  color: x.resolution === 'reconciled' ? 'var(--green)' : 'var(--terra-dk)',
                }}>{x.resolution === 'reconciled' ? 'RECONCILED' : 'OPEN'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink)', marginTop: 3 }}><strong>asserts:</strong> {x.asserts}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}><strong>map says:</strong> {x.mapVerdict}</div>
              <div style={{ fontSize: 12, color: 'var(--brass-dk)', marginTop: 2 }}><strong>fix:</strong> {x.fix}</div>
            </div>
          ))}
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: 'var(--faint)', fontSize: 12 }}>Views that ARE consistent ({ROUTE_MAP_CROSS_CHECK.consistent.length})</summary>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--ink-soft)' }}>
              {ROUTE_MAP_CROSS_CHECK.consistent.map((c, i) => <li key={i} style={{ marginBottom: 4 }}>{c}</li>)}
            </ul>
          </details>
        </div>

        <div style={{ ...edCard, marginTop: 18, background: 'color-mix(in srgb, var(--series-1) 6%, transparent)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10, marginTop: 0 }}>Related Views</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/rh-proof-state" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>RH Proof State</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rigor-dashboard" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Rigor Dashboard</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/lambda-bounds" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Λ Bounds</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rh-dag" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Proof DAG</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
