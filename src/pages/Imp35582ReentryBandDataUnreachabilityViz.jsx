import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35582_LOG10_N_MARKERS,
  IMP35582_SUMMARY,
} from '../data/imp-35582-reentry-band-data-unreachability-viz-data.js';
import { ED } from '../styles/tokens.js';

function Log10NMarkerChart() {
  const w = 720;
  const h = 200;
  const padL = 56;
  const padR = 16;
  const padT = 24;
  const padB = 48;
  const plotW = w - padL - padR;

  const minLog10N = 0;
  const maxLog10N = Math.max(...IMP35582_LOG10_N_MARKERS.map((m) => m.log10N)) * 1.06;

  const xPix = (v) => padL + (v / (maxLog10N - minLog10N)) * plotW;

  const xTicks = [0, 10, 20, 30, 40];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={w - padR} y1={h - padB} y2={h - padB} stroke={ED.rule} strokeWidth={1} />
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xPix(t)} x2={xPix(t)} y1={padT} y2={h - padB} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xPix(t)} y={h - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
            {t}
          </text>
        </g>
      ))}
      {/* the reentry-band span, drawn as a highlighted bracket above the axis */}
      <line
        x1={xPix(IMP35582_LOG10_N_MARKERS[1].log10N)}
        x2={xPix(IMP35582_LOG10_N_MARKERS[2].log10N)}
        y1={padT + 18}
        y2={padT + 18}
        stroke={ED.series4}
        strokeWidth={4}
      />
      {IMP35582_LOG10_N_MARKERS.map((m) => {
        const color = m.key === 'pt' ? ED.series1 : ED.series4;
        return (
          <g key={m.key}>
            <line x1={xPix(m.log10N)} x2={xPix(m.log10N)} y1={padT} y2={h - padB} stroke={color} strokeWidth={2} />
            <circle cx={xPix(m.log10N)} cy={padT + 18} r={4} fill={color} />
            <text x={xPix(m.log10N)} y={padT + 8} textAnchor="middle" fill={ED.ink} fontSize={10}>
              {m.log10N.toFixed(2)}
            </text>
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N)
      </text>
    </svg>
  );
}

export default function Imp35582ReentryBandDataUnreachabilityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Reentry-Band Data Unreachability: log10(N) vs the Verified Frontier (imp-35582)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35537 Part D scoped what closing the OPEN R1t true-dynamic residue (certificate
        imp-35243a) requires, and found that route&nbsp;(ii) -- a direct data-anchored fidelity
        check at the reentry-band heights -- is INFEASIBLE: the band N-range
        [10^27.08, 10^37.17] sits ~14.6-24.7 decades ABOVE the ~3e12 Platt-Trudgian verified
        frontier, unlike the imp-35475 sigma landmarks whose two heights both sit below that
        frontier and so admit a feasible unconditional route&nbsp;(ii). This chart places the
        verified frontier and the reentry-band edges on a shared log10(N) axis.
      </p>

      <Log10NMarkerChart />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10(N)</th>
          </tr>
        </thead>
        <tbody>
          {IMP35582_LOG10_N_MARKERS.map((m) => (
            <tr key={m.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{m.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {m.log10N.toFixed(6)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The reentry edge sits ~{IMP35582_SUMMARY.reentryDecadesAboveT_PT} decades, and the exit
        edge ~{IMP35582_SUMMARY.exitDecadesAboveT_PT} decades, above the Platt-Trudgian verified
        frontier (T=3e12) -- so no verified zero exists anywhere near the band, and route&nbsp;(ii)
        direct measurement is infeasible by a wide margin (imp-35559 tabulates the exact
        per-endpoint gaps).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Presentation only of the
        imp-35537 Part D / imp-35243 D2 data-unreachability figures (no fresh derivation, no
        heavy data-module import); the reentry band is a diagnostic of a surrogate
        iterate-COUNT, not a Lambda input, so even a perfect R1t closure would move no bound;
        R1t and the imp-35243a certificate stay OPEN; C_mb GUE-conditional per imp-486
        UNTOUCHED; this page derives no remainder, discharges nothing, changes no bound,
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
