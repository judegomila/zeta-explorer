import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97413_EXPONENT_LADDER,
  IMP97413_EXPONENT_ASYMPTOTE,
  IMP97413_KNEE_MARKER,
} from '../data/imp-97413-sigma-ladder-subdecade-knee-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { exponent: ED.series1, asymptote: ED.series7, knee: ED.series4 };

function LadderWithKneeChart() {
  const svgW = 640;
  const padL = 44;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const loD = IMP97413_EXPONENT_LADDER[0].loD;
  const hiD = IMP97413_EXPONENT_LADDER[IMP97413_EXPONENT_LADDER.length - 1].hiD;
  const xS = (d) => padL + ((d - loD) / (hiD - loD)) * cW;
  const yMax = IMP97413_EXPONENT_ASYMPTOTE + 0.05;
  const yS = (p) => padT + cH * (1 - p / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <line
        x1={padL}
        y1={yS(IMP97413_EXPONENT_ASYMPTOTE)}
        x2={padL + cW}
        y2={yS(IMP97413_EXPONENT_ASYMPTOTE)}
        stroke={COLORS.asymptote}
        strokeWidth={1}
        strokeDasharray="4,2"
      />
      <text x={padL + cW - 2} y={yS(IMP97413_EXPONENT_ASYMPTOTE) - 5} textAnchor="end" fill={COLORS.asymptote} fontSize={8.5}>
        imp-3463 far-tail asymptote 1/2
      </text>

      {IMP97413_EXPONENT_LADDER.map((r) => {
        const x0 = xS(r.loD);
        const x1 = xS(r.hiD);
        const y = yS(r.p_local);
        return (
          <g key={r.decade}>
            <rect x={x0 + 2} y={y} width={x1 - x0 - 4} height={padT + cH - y} fill={COLORS.exponent} opacity={0.85} />
            <text x={(x0 + x1) / 2} y={y - 6} textAnchor="middle" fill={ED.series1} fontSize={9}>
              {r.p_local}
            </text>
            <text x={(x0 + x1) / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {r.decade}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <line
        x1={xS(IMP97413_KNEE_MARKER.log10Nstar)}
        y1={padT}
        x2={xS(IMP97413_KNEE_MARKER.log10Nstar)}
        y2={padT + cH}
        stroke={COLORS.knee}
        strokeWidth={1.5}
      />
      <circle
        cx={xS(IMP97413_KNEE_MARKER.log10Nstar)}
        cy={yS(0.236)}
        r={5.5}
        fill="none"
        stroke={COLORS.knee}
        strokeWidth={2}
      />
      <text
        x={xS(IMP97413_KNEE_MARKER.log10Nstar) + 6}
        y={padT + 14}
        fill={COLORS.knee}
        fontSize={9}
      >
        imp-33721 knee N* &sim; 3.38e9
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        p_local
      </text>
    </svg>
  );
}

export default function Imp97413SigmaLadderSubdecadeKneeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Decay-Exponent Ladder with the Sub-Decade Knee (imp-33582 / imp-33721 / imp-97413)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-33582 per-decade local decay exponent of sigma(N) = E_coll/E(N) ramps monotonely
        from &sim;0.0105 just past the interior peak to &sim;0.4310 by N &sim; 1e12, approaching the
        imp-3463 far-tail 1/2 asymptote from below. Overlaid on the same log10-N axis is the imp-33721
        sub-decade curvature knee: the single ramp-acceleration sign change, refined to N* &sim; 3.38e9
        &mdash; inside the [1e9,1e10] decade bar, a full decade below the coarse [1e10,1e11] bracket
        imp-33701 originally reported, and landing essentially where sigma crosses one half.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-decade local decay exponent, with the imp-33721 sub-decade knee marked on the same axis
      </p>
      <LadderWithKneeChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization only -- no
        proof, no reduction below RH. sigma(N) is the inherited imp-3220/imp-3406 extrapolation model,
        NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is untouched; changes no
        bound; establishes no operator positivity; imp-3066 K_a &ge; 0 remains untouched. No RH
        verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33607-sigma-postpeak-decay" style={{ color: 'var(--series-5)' }}>
          Sigma(N) Post-Peak Decay Past the PATH-1 Ceiling (imp-33607)
        </Link>
      </div>
    </div>
  );
}
