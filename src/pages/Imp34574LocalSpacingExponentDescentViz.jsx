import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT } from '../data/imp-34548-pole-leakage-local-spacing-exponent.js';
import { ED } from '../styles/tokens.js';

const {
  poleLocation,
  globalExponent,
  localExponents,
  nearFieldExponent,
  nearEdgeExponent,
  nearEdgeBelowGlobal,
  fallsTowardPole,
} = IMP34548_POLE_LEAKAGE_LOCAL_SPACING_EXPONENT;

function LocalExponentDescentChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 32;
  const padT = 30;
  const padB = 44;
  const svgH = 280;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = localExponents.map((e) => e.midPoleDist);
  const ys = localExponents.map((e) => e.pLocal);
  const xMin = Math.min(...xs) - 0.2;
  const xMax = Math.max(...xs) + 0.2;
  const yMin = Math.min(...ys, globalExponent) - 0.2;
  const yMax = Math.max(...ys, globalExponent) + 0.2;

  const xS = (v) => padL + cW - ((v - xMin) / (xMax - xMin)) * cW; // shrinking pole distance -> rightward = toward pole
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const linePts = localExponents.map((e) => `${xS(e.midPoleDist)},${yS(e.pLocal)}`).join(' ');

  const xTicks = [xMin, (xMin + xMax) / 2, xMax];
  const yTicks = [yMin, globalExponent, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t, ti) => (
        <g key={'yt' + ti}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(3)}
          </text>
        </g>
      ))}
      {xTicks.map((t, ti) => (
        <text key={'xt' + ti} x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      {/* global cubic exponent reference line */}
      <line
        x1={padL}
        y1={yS(globalExponent)}
        x2={padL + cW}
        y2={yS(globalExponent)}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />
      <text x={padL + 6} y={yS(globalExponent) - 6} fill={ED.brass} fontSize={9}>
        global cubic p ~ {globalExponent.toFixed(3)}
      </text>

      {/* the falling local-exponent path */}
      <polyline points={linePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      {localExponents.map((e, i) => {
        const belowGlobal = e.pLocal < globalExponent;
        return (
          <g key={'pt' + i}>
            <circle cx={xS(e.midPoleDist)} cy={yS(e.pLocal)} r={4.5} fill={belowGlobal ? ED.series2 : ED.series1} />
            <text
              x={xS(e.midPoleDist)}
              y={yS(e.pLocal) - 10}
              textAnchor="middle"
              fill={belowGlobal ? ED.series2 : ED.series1}
              fontSize={9}
            >
              {e.pLocal.toFixed(3)}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        pair-midpoint pole distance k* - k_mid (shrinking rightward, toward k* = {poleLocation.toFixed(5)})
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        local exponent p_local
      </text>
    </svg>
  );
}

export default function Imp34574LocalSpacingExponentDescentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Local Spacing-Exponent Descent Toward the Pole (imp-34548)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34530 fit the pole-leakage per-pp threshold spacing to a single GLOBAL power law with exponent
        p ~ {globalExponent.toFixed(3)}, but imp-34548 measured the LOCAL exponent between each adjacent pair
        of the four interval-midpoint spacing points and found it FALLS monotonically -- from
        p_local ~ {nearFieldExponent.toFixed(3)} farthest from the imp-34023 pole k* ~ {poleLocation.toFixed(5)}
        down to p_local ~ {nearEdgeExponent.toFixed(3)} nearest the 20% rung -- rather than rising toward the
        pole. The near-edge local exponent (red) sits below the global cubic reference line.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p_local vs pair-midpoint pole distance -- descent toward k*, global cubic as reference
      </p>
      <LocalExponentDescentChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>pair index</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>midpoint pole distance</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>p_local</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>vs global cubic</th>
          </tr>
        </thead>
        <tbody>
          {localExponents.map((e, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{i}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{e.midPoleDist.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{e.pLocal.toFixed(4)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: e.pLocal < globalExponent ? 'var(--series-2)' : 'var(--series-3)',
                }}
              >
                {e.pLocal < globalExponent ? 'below' : 'above'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only -- the local exponent
        {fallsTowardPole ? ' FALLS' : ' does not fall'} monotonically as the pole distance shrinks
        {nearEdgeBelowGlobal ? ', with the near-edge value below the global cubic (the imp-34530 R3 undershoot sign)' : ''}.
        Reuses the imp-34247 metric, imp-34188 y(k) surrogate, and imp-34023 pole verbatim; the component model
        is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
        per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a &ge; 0
        remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
