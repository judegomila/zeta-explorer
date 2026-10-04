import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA } from '../data/imp-35139-eflow-qeff-profile-viz-data.js';
import { ED } from '../styles/tokens.js';

const D = IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA;
const PROFILE = D.qEffProfile;

// q_eff(x) vs dex(=log10 N), rising monotonically toward 1, with the single upward 0.6
// crossing (far below the 1e9 band) and the E_coll profile (approaching 1/2) overlaid.
function QEffProfileChart() {
  const svgW = 680;
  const padL = 50;
  const padR = 20;
  const padT = 54;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = 0;
  const xMax = 300;
  const yMin = 0.4;
  const yMax = 1.02;
  const xOf = (dex) => padL + ((dex - xMin) / (xMax - xMin)) * plotW;
  const yOf = (q) => padT + plotH - ((q - yMin) / (yMax - yMin)) * plotH;

  const qEffPath = PROFILE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.dex)} ${yOf(p.qEff)}`).join(' ');
  const ecollPath = D.ecollProfile.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.dex)} ${yOf(p.qColl)}`).join(' ');
  const crossDex = D.dexAtQeff0p6;
  const bandDex = PROFILE[0].dex; // 9

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 38} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        E_flow local decay exponent q_eff(x) vs. E_coll log-derivative, dex(log10 N) in [0, 300] (imp-35039)
      </text>
      {[0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {/* crossing band start (N ~ 1e9) */}
      <line
        x1={xOf(bandDex)}
        y1={padT}
        x2={xOf(bandDex)}
        y2={padT + plotH}
        stroke={ED.series1}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={xOf(bandDex) + 4} y={padT + 10} fill={ED.series1} fontSize={8.5}>
        crossing band (1e9)
      </text>
      {/* the single upward 0.6 crossing, far below the band */}
      <line
        x1={xOf(crossDex)}
        y1={padT}
        x2={xOf(crossDex)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="2 3"
      />
      <circle cx={xOf(crossDex)} cy={yOf(0.6)} r={4} fill={ED.series2} />
      <text x={xOf(crossDex) + 6} y={yOf(0.6) - 6} fill={ED.series2} fontSize={8.5}>
        0.6 crossing (dex&nbsp;~{crossDex.toFixed(2)}, upward, below band)
      </text>
      <path d={qEffPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <path d={ecollPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6 3" />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 50, 100, 150, 200, 250, 300].map((dec) => (
        <text key={dec} x={xOf(dec)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{dec}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 10} r={3} fill={ED.series5} />
        <text x={padL + 12} y={padT - 6} fill={ED.series5} fontSize={8.5}>
          q_eff (E_flow) &rarr; 1
        </text>
        <circle cx={padL + 150} cy={padT - 10} r={3} fill={ED.brassDeco} />
        <text x={padL + 158} y={padT - 6} fill={ED.brass} fontSize={8.5}>
          E_coll log-derivative &rarr; 1/2
        </text>
      </g>
    </svg>
  );
}

export default function Imp35139EflowQeffProfileViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow q_eff Profile: Rising to 1, Not Descending to 1/2 (imp-35139 / imp-35039)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34950 measured the local E_flow decay exponent q_eff = -d ln R/dx at a single point
        (~0.855 at the N&nbsp;~&nbsp;1e9 crossing band), and the imp-34973 subGap proposed
        locating a turnover where q_eff descends toward the imp-3463 far-tail 1/2. imp-35039
        mapped the full profile and found the opposite: q_eff rises MONOTONICALLY toward 1 (no
        turnover), and the single q_eff&nbsp;=&nbsp;0.6 level is crossed only going UP, at
        N&nbsp;~&nbsp;1e3.22 &mdash; far below the crossing band, not on a descent above it. The
        1/2 asymptote belongs to a different term entirely: the E_coll log-derivative.
      </p>

      <QEffProfileChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dex (log10 N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>q_eff level</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--series-2)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.6 crossing (upward, below band)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{D.dexAtQeff0p6.toFixed(4)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>0.6</td>
          </tr>
          {D.upwardLadder.map((r) => (
            <tr key={r.level} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>upward ladder</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.dex.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        At the crossing band q_eff&nbsp;&asymp;&nbsp;{D.qEffBand.toFixed(4)}, rising to
        &asymp;&nbsp;{D.qEffFar.toFixed(4)} by N&nbsp;~&nbsp;1e300 (limit 1). Over the same span the
        E_coll log-derivative rises from &asymp;&nbsp;{D.ecollBand.toFixed(4)} to only
        &asymp;&nbsp;{D.ecollFar.toFixed(4)} (limit {D.farTailExponent}) &mdash; the imp-3463 far-tail
        exponent belongs to E_coll, not to E_flow's q_eff.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35039 q_eff(x) and E_coll-log-derivative literals verbatim (no new computation).
        Measurement on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 untouched; establishes no operator positivity; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
