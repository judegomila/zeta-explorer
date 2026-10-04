import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE } from '../data/imp-33828-sigma-decay-landmark-ladder-reference.js';
import { ED } from '../styles/tokens.js';

const { ladder } = IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE;

function SigmaDecayLandmarkLadderChart() {
  const svgW = 720;
  const padL = 40;
  const padR = 40;
  const axisY = 150;
  const svgH = 300;
  const cW = svgW - padL - padR;

  const logNMin = 5;
  const logNMax = 12;
  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;

  const xTicks = [1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((N) => (
        <g key={'tick' + N}>
          <line x1={xS(N)} y1={axisY - 4} x2={xS(N)} y2={axisY + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={axisY + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {N.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={axisY + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>

      {ladder.map((entry, i) => {
        const x = xS(entry.N);
        const above = i % 2 === 0;
        const labelY = above ? axisY - 20 : axisY + 54;
        const stemY2 = above ? axisY - 8 : axisY + 8;
        return (
          <g key={entry.name}>
            <line
              x1={x}
              y1={axisY}
              x2={x}
              y2={stemY2}
              stroke={ED.series5}
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <circle cx={x} cy={axisY} r={4.5} fill={ED.series5} stroke={ED.paper} strokeWidth={1} />
            <text
              x={x}
              y={above ? labelY - 22 : labelY + 22}
              textAnchor="middle"
              fill={ED.inkSoft}
              fontSize={9}
              fontWeight={600}
            >
              {entry.source}
            </text>
            <text x={x} y={labelY} textAnchor="middle" fill={ED.series5} fontSize={8.5}>
              {'N~' + entry.N.toExponential(2)}
            </text>
            <foreignObject x={x - 70} y={above ? labelY - 18 : labelY + 6} width={140} height={40}>
              <div
                style={{
                  fontSize: '7.5px',
                  lineHeight: 1.2,
                  color: 'var(--ink-faint)',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                }}
              >
                {entry.label}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp33830SigmaDecayLandmarkLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N)-Decay Landmark Ladder (imp-33828 / imp-33830)" />
      <p className="ed-lbl">Related: <Link to="/viz-imp35026-sigma-decay-landmark-ladder">later run (imp-35026)</Link></p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33828 tabulated the six sigma(N) = E_coll(N)/E(N) decay landmarks scattered across
        the lambda-roadmap.js currentStatus paragraph, in strict N-order, each tagged with the
        imp-id that established it. This page is the first consumer of that reference module:
        the six landmarks plotted on a single log-N axis, from the imp-3406 interior peak
        (N &sim; 9.22e5) out to the imp-33582/imp-33743 sigma&lt;0.1 far-tail landmark
        (N &sim; 3.21e11) -- a span of nearly six decades.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Six N-ordered landmarks, each tagged with its source imp-id
      </p>
      <SigmaDecayLandmarkLadderChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Source</th>
          </tr>
        </thead>
        <tbody>
          {ladder.map((entry) => (
            <tr key={entry.name} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {entry.N.toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{entry.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--series-5)' }}>{entry.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Share vs. total, do not conflate:</strong> every
        landmark above tracks the shrinking SHARE sigma(N) = E_coll(N)/E(N), not the total error
        E(N) itself. imp-35100 measured that the surrogate total E(N) = E_coll + E_trunc + E_flow
        does NOT tend to 0 -- it floors at the N-independent constant E_trunc = 3.06e-5 (imp-2631)
        as N &rarr; &infin;. So a shrinking sigma(N) reflects E_coll being outlived by the flat
        E_trunc floor, not the total error vanishing, and must not be misread as Step-4
        (E(N) &rarr; 0) progress.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> reference/visualization only
        -- imp-33828 changes no value and derives nothing new, and this page adds no new
        derivation either. It simply gives the six-landmark N-ordered cross-reference a visual
        surface. No bound changes; establishes no operator positivity; imp-3066 K_a &ge; 0
        remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
