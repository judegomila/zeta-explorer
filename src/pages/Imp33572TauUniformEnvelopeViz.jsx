import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33572_HEIGHT_SERIES,
  IMP33572_ENVELOPE_ULP,
  IMP33572_BINDING_HEIGHT,
} from '../data/imp-33572-tau-uniform-envelope-viz-data.js';

const BAR_COLOR = '#38bdf8';
const BIND_COLOR = '#facc15';
const ENVELOPE_LINE_COLOR = '#f472b6';

function EnvelopeMarginChart() {
  const svgW = 660;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 66;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const yMax = 12;
  const yS = (v) => padT + cH * (1 - v / yMax);

  const n = IMP33572_HEIGHT_SERIES.length;
  const bandW = cW / n;
  const barW = bandW * 0.45;

  const yTicks = [0, 2, 4, 6, 8, 10, 12];

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
        y1={yS(IMP33572_ENVELOPE_ULP)}
        x2={padL + cW}
        y2={yS(IMP33572_ENVELOPE_ULP)}
        stroke={ENVELOPE_LINE_COLOR}
        strokeWidth={1.3}
        strokeDasharray="6,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33572_ENVELOPE_ULP) - 4} textAnchor="end" fill="#f9a8d4" fontSize={9}>
        envelope E ~= {IMP33572_ENVELOPE_ULP.toFixed(2)} ULP
      </text>

      {IMP33572_HEIGHT_SERIES.map((h, i) => {
        const cx = padL + bandW * (i + 0.5);
        const barX = cx - barW / 2;
        const barTopY = yS(h.ceilingUlp);
        return (
          <g key={h.tau}>
            <line
              x1={cx}
              y1={barTopY}
              x2={cx}
              y2={yS(IMP33572_ENVELOPE_ULP)}
              stroke="#475569"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <rect
              x={barX}
              y={barTopY}
              width={barW}
              height={padT + cH - barTopY}
              fill={h.isBinding ? BIND_COLOR : BAR_COLOR}
              opacity={0.85}
              rx={2}
            />
            <text x={cx} y={barTopY - 6} textAnchor="middle" fill="#e2e8f0" fontSize={9.5}>
              {h.ceilingUlp.toFixed(2)}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              tau={h.tau}
            </text>
            <text x={cx} y={padT + cH + 29} textAnchor="middle" fill="#64748b" fontSize={8.5}>
              {h.isBinding ? 'binding, margin 0' : `margin ${h.marginUlp.toFixed(2)} (${(h.marginFraction * 100).toFixed(0)}%)`}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 48} textAnchor="middle" fill="#64748b" fontSize={10}>
        height tau (imp-33312 per-height band, tau in {'{7..10}'})
      </text>

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}
      >
        band ceiling (ULP)
      </text>
    </svg>
  );
}

export default function Imp33572TauUniformEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Tau-Uniform Envelope Constant (imp-33538 / imp-33572)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33312 showed the imp-33296 min-node graded-GL lattice-jitter band COLLAPSES with
        height and named the tau-uniform ceiling only qualitatively ("~11 ULP, set by the
        lowest heights"). imp-33538 derived that ceiling as the explicit constant
        E = max_tau maxUlp(tau) &asymp; {IMP33572_ENVELOPE_ULP.toFixed(2)} ULP, BINDING at
        tau={IMP33572_BINDING_HEIGHT}, and measured how far inside it every other height sits.
        The chart below plots each height&apos;s band ceiling against that envelope, with the
        slack margin (E &minus; ceiling) annotated per bar.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Per-height band ceiling vs the tau-uniform envelope, with slack margin annotated
      </p>
      <EnvelopeMarginChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> each bar is the
        imp-33312 measured per-height band ceiling (maxUlp) at that tau; the dashed pink line is
        the tau-uniform envelope E, the largest of the four ceilings. The gold bar (tau=8) sits
        ON the envelope with zero margin &mdash; it is the binding rung that sets the constant.
        tau=7 is nearly as tight (margin ~0.13 ULP, ~1% slack), while tau=9 and tau=10 sit
        hugely inside the envelope (~94% and ~100% slack respectively) &mdash; the imp-33312
        height-collapse expressed as a per-rung conservativeness margin.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy measurement /
        rule-design audit only. Naming and charting this envelope establishes no operator
        positivity; mass-feasibility is necessary-but-not-sufficient and the operator-level
        K_a &ge; 0 sign-positivity (imp-3066) remains untouched. The exact ULP digits are a
        single-lattice arithmetic-floor figure inherited from imp-33312 and can shift under
        cross-platform libm variation; the robust reading is the tight-at-low-tau,
        slack-at-high-tau margin shape. No RH verdict, NO QED. Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33571-deep-tail-jitter-envelope" style={{ color: '#7c3aed' }}>
          Deep-Tail Plateau Jitter Envelope (imp-33537 / imp-33571)
        </Link>
      </div>
    </div>
  );
}
