import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33571_WINDOW_SERIES,
  IMP33571_STRICT_BAR_ULP,
  IMP33571_DEEP_BAND_ULP,
} from '../data/imp-33571-deep-tail-jitter-envelope-viz-data.js';

const BAR_COLOR = '#38bdf8';
const CROSS_COLOR = '#f87171';
const STRICT_LINE_COLOR = '#facc15';
const DEEP_LINE_COLOR = '#f472b6';

function JitterEnvelopeChart() {
  const svgW = 660;
  const padL = 52;
  const padR = 24;
  const padT = 24;
  const padB = 70;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const yMax = 90;
  const yS = (v) => padT + cH * (1 - v / yMax);

  const n = IMP33571_WINDOW_SERIES.length;
  const bandW = cW / n;
  const barW = bandW * 0.45;

  const yTicks = [0, 15, 30, 45, 60, 75, 90];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33571_STRICT_BAR_ULP)}
        x2={padL + cW}
        y2={yS(IMP33571_STRICT_BAR_ULP)}
        stroke={STRICT_LINE_COLOR}
        strokeWidth={1.3}
        strokeDasharray="6,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33571_STRICT_BAR_ULP) - 4} textAnchor="end" fill="#fde047" fontSize={9}>
        strict bar (30 ULP)
      </text>

      <line
        x1={padL}
        y1={yS(IMP33571_DEEP_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33571_DEEP_BAND_ULP)}
        stroke={DEEP_LINE_COLOR}
        strokeWidth={1.3}
        strokeDasharray="2,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33571_DEEP_BAND_ULP) - 4} textAnchor="end" fill="#f9a8d4" fontSize={9}>
        deep band (64 ULP)
      </text>

      {IMP33571_WINDOW_SERIES.map((w, i) => {
        const cx = padL + bandW * (i + 0.5);
        const barX = cx - barW / 2;
        const barTopY = yS(w.worstUlp);
        const crosses = w.worstUlp > IMP33571_DEEP_BAND_ULP;
        return (
          <g key={w.label}>
            <rect
              x={barX}
              y={barTopY}
              width={barW}
              height={padT + cH - barTopY}
              fill={crosses ? CROSS_COLOR : BAR_COLOR}
              opacity={0.85}
              rx={2}
            />
            <text x={cx} y={barTopY - 6} textAnchor="middle" fill="#e2e8f0" fontSize={9.5}>
              {w.worstUlp.toFixed(1)}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {w.label}
            </text>
            <text x={cx} y={padT + cH + 29} textAnchor="middle" fill="#64748b" fontSize={8.5}>
              {w.exceedStrictCount}/{w.total} &gt;30, run {w.longestAboveBarRun}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 50} textAnchor="middle" fill="#64748b" fontSize={10}>
        window (dense width-31 integer scan, centred on the imp-33537 ticket rungs)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        worst-window ULP
      </text>
    </svg>
  );
}

export default function Imp33571DeepTailJitterEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deep-Tail Plateau Jitter Envelope (imp-33537 / imp-33571)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33316 carried the imp-33295 conservative grade4/400p (4000-node) graded plateau into
        the deep saddle tail on a coarse grid and read the plateau as staying inside a widened
        &lt; 64 ULP band at every deep rung, with one isolated n=300 spike above the strict 30-ULP
        bar. imp-33537 re-scored the SAME plateau rule on four DENSE width-31 integer windows
        centred on n~300, 395, 495, 595. RESULT: the n=300 spike is not a one-off &mdash;
        strict-bar exceedances recur at every deeper window and thicken into clusters, and the
        worst-window jitter grows from ~50 ULP (n=300) to ~79 ULP (n=510) and ~74 ULP (n=596),
        CROSSING the widened 64-ULP band the coarse grid never sampled.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Worst-window ULP per window, with the strict and deep bands marked
      </p>
      <JitterEnvelopeChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> each bar is the worst
        (largest) plateau-vs-A_log residual in ULP found anywhere in that window&apos;s 31
        consecutive integer rungs. W0 (the imp-33316 reference window) and W1 stay under the
        64-ULP deep band despite crossing the 30-ULP strict bar 6 times each; W2 and W3 (red bars)
        cross the deep band outright, and their above-bar counts (16/31 and 17/31) and run lengths
        (7 and 5 consecutive rungs) show the exceedances have thickened from an isolated spike into
        a dense cluster.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design
        measurement only. This corrects the imp-33316 constant-&lt;64-ULP-band reading as a
        coarse-grid artifact &mdash; the plateau band is a depth-growing jitter envelope, not a
        fixed constant &mdash; but does NOT overturn the imp-33316 plateau-holds/uniform-fails
        headline in relative terms (the uniform ladder sits ~1e5&ndash;1e6 ULP there). The exact
        per-rung ULP is a jittery arithmetic-floor lattice property that can shift under
        cross-platform libm variation; the robust reading is the qualitative recurrence and
        intensification with depth. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level K_a &ge; 0 sign-positivity (imp-3066) remains untouched. No RH verdict, NO
        QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33548-graded-plateau-deep-tail-node-budget" style={{ color: '#7c3aed' }}>
          Graded Plateau Deep-Tail Node Budget (imp-33316 / imp-33548)
        </Link>
      </div>
    </div>
  );
}
