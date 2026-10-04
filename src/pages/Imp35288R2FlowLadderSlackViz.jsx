import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import WithinStepStepoverExplainer from '../components/WithinStepStepoverExplainer.jsx';
import { ED } from '../styles/tokens.js';

// Baked literals from the imp-35150 / imp-35190 / imp-35221 / imp-35235 /
// imp-35324 / imp-35278 data modules (src/data/imp-35150-r2-ladder-assessment.js,
// src/data/imp-35190-r2-n500-flow-reference.js,
// src/data/imp-35221-r2-n1000-flow-reference.js,
// src/data/imp-35235-r2-n2000-flow-reference.js,
// src/data/imp-35324-r2-n2000-finer-grid-reference.js,
// src/data/imp-35278-r2-n2000-gatefree-flow-reference.js). Reused verbatim;
// no new computation. The N=2000 rung reflects the imp-35324 finer-base-grid
// (tauC/4000) re-run, which RESOLVES the imp-35235 DP45 dt/2 gate-skip: all
// four references now clear t_c_hi, worst-case slack +6.16e-8 (razor-thin).
// imp-35278 (gate-free signed-crossing, same tauC/1000 grid) confirms this is
// a WITHIN-STEP step-over, not an endpoint-gate artifact -- a dt/2 stage can
// pass through the collision inside a single step, invisible to any endpoint
// event. The ladder therefore stays robustly certified only through N=1000.
const RUNGS = [
  { N: 50, t_c_flow: 0.096, t_c_hi: 0.096, status: 'met', note: 'structural (gate == t_c_hi)' },
  { N: 100, t_c_flow: 0.0705, t_c_hi: 0.076, status: 'met', note: 'clean slack' },
  { N: 200, t_c_flow: 0.033, t_c_hi: 0.033, status: 'met', note: 'structural (gate == t_c_hi)' },
  { N: 500, t_c_flow: 0.012396301260, t_c_hi: 0.0124, status: 'met', note: 'worst-case cross-family/cross-grid' },
  { N: 1000, t_c_flow: 0.0033027720310, t_c_hi: 0.0034, status: 'met', note: 'last robustly-certified rung' },
  {
    N: 2000,
    t_c_flow: 0.0011999384320,
    t_c_hi: 0.0012,
    status: 'provisional-clear',
    note: 'imp-35324 finer grid (tauC/4000) resolves the imp-35235 DP45 dt/2 gate-skip: worst case (DP45 dt/2) clears t_c_hi at slack +6.16e-8 (razor-thin, ~1600x below one map cell); imp-35278 confirms a within-step step-over, not an endpoint artifact',
    cleanMax: 0.0011923626880,
  },
].map((r) => ({ ...r, slack: r.t_c_hi - r.t_c_flow }));

function LadderChart() {
  const svgW = 700;
  const padL = 70;
  const padR = 24;
  const padT = 44;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  // Log-x across N (50..2000), log-y across t_c (values span ~0.001 to 0.1).
  const xMin = Math.log10(40);
  const xMax = Math.log10(2400);
  const yMin = Math.log10(0.0009);
  const yMax = Math.log10(0.12);

  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const flowPath = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.t_c_flow)}`).join(' ');
  const hiPath = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.t_c_hi)}`).join(' ');

  const yTicks = [0.001, 0.003, 0.01, 0.03, 0.1];
  const xTicks = [50, 100, 200, 500, 1000, 2000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        R2 one-sided true-flow bound: t_c_flow(N) vs t_c_hi(N) across the tested ladder
      </text>

      {hiPath && <path d={hiPath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />}
      {flowPath && <path d={flowPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />}

      {RUNGS.map((r) => (
        <circle
          key={`flow-${r.N}`}
          cx={xOf(r.N)}
          cy={yOf(r.t_c_flow)}
          r={r.status !== 'met' ? 5.5 : 4}
          fill={r.status !== 'met' ? ED.series4 : ED.brassDeco}
        />
      ))}
      {/* imp-35324 finer-grid best estimate (RK4 dt/2), shown as an open marker below the worst-case point */}
      <circle cx={xOf(2000)} cy={yOf(RUNGS[5].cleanMax)} r={4} fill="none" stroke={ED.series3} strokeWidth={1.75} />
      <text x={xOf(2000) + 8} y={yOf(RUNGS[5].cleanMax) + 3} fill={ED.series3} fontSize={8.5}>
        finer-grid best (imp-35324)
      </text>

      <text
        x={xOf(1000)}
        y={yOf(RUNGS[4].t_c_flow) - 12}
        textAnchor="middle"
        fill={ED.brass}
        fontSize={9}
      >
        N=1000: last certified
      </text>
      <text
        x={xOf(2000)}
        y={yOf(RUNGS[5].t_c_flow) - 12}
        textAnchor="middle"
        fill={ED.series4}
        fontSize={9}
      >
        N=2000: marginal clear
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {N}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (log scale)
      </text>

      {yTicks.map((v) => (
        <text key={v} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      <g>
        <line x1={padL + 4} y1={padT - 12} x2={padL + 24} y2={padT - 12} stroke={ED.series5} strokeWidth={2.25} />
        <text x={padL + 30} y={padT - 8} fill={ED.series5} fontSize={8.5}>
          t_c_flow (worst-case)
        </text>
        <line x1={padL + 150} y1={padT - 12} x2={padL + 170} y2={padT - 12} stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />
        <text x={padL + 176} y={padT - 8} fill={ED.series2} fontSize={8.5}>
          t_c_hi (map bracket)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35288R2FlowLadderSlackViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="R2 One-Sided True-Flow Ladder: t_c_flow vs t_c_hi Slack (imp-35288)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35104 R2 requirement (t_c_flow(N) &le; t_c_hi(N), the one-sided map-to-flow bound
        from imp-2528) has been tested rung by rung across N = 50, 100, 200 (imp-35150), 500
        (imp-35190), 1000 (imp-35221), and 2000 (imp-35235, superseded by imp-35324/imp-35278). The
        worst-case order-robust flow collision stays below the imp-857 map-bracket upper endpoint
        through N = 1000. At N = 2000 the original tauC/1000 grid produced a DP45 dt/2 gate-skip
        &mdash; a spurious t_c = 1.3238e-3 exceeding t_c_hi = 1.2e-3. The imp-35324 finer base grid
        (tauC/4000) resolves this as a grid-resolution artifact: all four references now clear
        t_c_hi, worst-case slack +6.16e-8 (razor-thin). imp-35278&apos;s gate-free signed-crossing
        check confirms the skip was a genuine WITHIN-STEP step-over &mdash; the collision completes
        inside a single dt/2 stage, invisible to any endpoint gate &mdash; not a spurious artifact.
      </p>

      <WithinStepStepoverExplainer />

      <LadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c_flow (worst-case)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c_hi (map bracket)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slack</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>status</th>
          </tr>
        </thead>
        <tbody>
          {RUNGS.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.t_c_flow.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.t_c_hi.toExponential(6)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.slack >= 0 ? 'var(--series-3)' : 'var(--series-2)',
                }}
              >
                {r.slack.toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--series-3)' }}>MET</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The R2 ladder&apos;s largest robustly-certified rung is N = 1000 (worst-case slack{' '}
        {RUNGS[4].slack.toExponential(3)}). At N = 2000 the imp-35324 finer-grid (tauC/4000)
        re-run clears t_c_hi at all four references: worst case (DP45 dt/2) slack{' '}
        {RUNGS[5].slack.toExponential(3)} (razor-thin, ~1600x below one imp-857 map cell), clean
        best estimate (RK4 dt/2) slack {(RUNGS[5].t_c_hi - RUNGS[5].cleanMax).toExponential(3)}.
        imp-35278 confirms this is a within-step step-over, not an endpoint-gate artifact, so
        N = 2000 is marginally MET rather than failing &mdash; though the razor-thin margin keeps
        it flagged PROVISIONAL relative to the robustly-certified N = 1000 rung.
      </p>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the
        imp-35150/imp-35190/imp-35221/imp-35235 baked t_c literals verbatim (no new computation).
        Measurement/certification only; C_mb stays GUE-conditional (imp-486); changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
        <br />
        <br />
        <strong style={{ color: 'var(--ink-soft)' }}>imp-35416 cross-check:</strong> an independent RK4 +
        cubic-Hermite dense output reproduces the within-step pair-1495 crossing behind the
        N = 2000 rung at the same step and pair, t_c agreeing to &sim;4.5e-5 relative &mdash; the
        crossing itself is scheme-invariant. But the endpoint-positivity flag differs by scheme
        (DP45 dt/2 positive, RK4 dt/2 negative), so that flag is a DP45-specific knife-edge, not a
        property of the flow. This cross-check does not advance the ladder past N = 1000: RUNGS[5]
        still bakes the imp-35412 endpoint DP45 dt/2 worst-case as the reported slack &mdash; per
        imp-35412&apos;s KEEP verdict, a one-sided upper bound (t_c_flow &le; t_c_hi) must report the
        LARGEST tested collision time as its worst case, so the more-faithful but earlier dense
        interior crossing (imp-35351) is recorded only as a diagnostic, never adopted in the slack
        denominator.
        <br />
        <br />
        <strong style={{ color: 'var(--ink-soft)' }}>imp-35477 third-family corroboration:</strong> a
        THIRD, distinct integrator family &mdash; Bogacki-Shampine BS3 (order 3, FSAL) with a
        natural cubic-Hermite dense output &mdash; independently catches the identical step
        (1004 at dt, 2007 at dt/2) and identical pair (1495), with t_c agreeing to within
        &sim;1e-4 relative of both the DP45 (order 5) and RK4 (order 4) families. The within-step
        crossing is therefore scheme-invariant across integrator orders 3, 4, and 5, not an
        artifact of any single high-order scheme. As with imp-35416, this strengthens the
        crossing&apos;s scheme-independence only &mdash; it does not change the reported worst-case
        slack, which per imp-35412&apos;s KEEP verdict still bakes the DP45 dt/2 endpoint value.
      </div>
    </div>
  );
}
