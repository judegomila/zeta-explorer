import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  Q0_VS_CONST_ROWS,
  Q0_SECTOR_SPREAD,
  CONST_SECTOR_SPREAD,
  IMP95771_SUMMARY,
} from '../data/imp-95771-q0-signal-vs-const-sector-viz-data.js';
import { Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION as CERT } from '../data/imp-95966-q0-recon-largem-certification-obstruction.js';
import { ED } from '../styles/tokens.js';

// Two stacked panels sharing an m-axis: the Q_0 zeta(3) sector (top, genuinely varying)
// against the const sector (bottom, pinned flat at 1.5) across the four tested moduli.
function Q0VsConstChart() {
  const svgW = 700;
  const padL = 64;
  const padR = 20;
  const padT = 18;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = 150;
  const gap = 34;
  const svgH = padT + plotH + gap + plotH + padB;

  const ms = Q0_VS_CONST_ROWS.map((r) => r.m);
  const xOf = (m) => padL + ((m - ms[0]) / (ms[ms.length - 1] - ms[0])) * plotW;

  // Top panel: Q0 sector, tight y-range around the measured spread.
  const q0Vals = Q0_VS_CONST_ROWS.map((r) => r.q0Sector);
  const q0Min = Math.min(...q0Vals) - 0.05e-5;
  const q0Max = Math.max(...q0Vals) + 0.05e-5;
  const yOfQ0 = (v) => padT + ((q0Max - v) / (q0Max - q0Min)) * plotH;

  // Bottom panel: const sector, y-range zoomed to +-2e-12 around 1.5 to show exact flatness.
  const constY0 = padT + plotH + gap;
  const constMin = 1.5 - 2e-12;
  const constMax = 1.5 + 2e-12;
  const yOfConst = (v) => constY0 + ((constMax - v) / (constMax - constMin)) * plotH;

  const q0Path = Q0_VS_CONST_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.m)} ${yOfQ0(r.q0Sector)}`).join(' ');
  const constPath = Q0_VS_CONST_ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.m)} ${yOfConst(r.constSector)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* Top panel: Q0 sector */}
      <text x={padL} y={padT - 4} fill={ED.inkSoft} fontSize={10}>Q&#8320; sector (genuine m-signal)</text>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <path d={q0Path} fill="none" stroke={ED.series7} strokeWidth={2} />
      {Q0_VS_CONST_ROWS.map((r) => (
        <circle key={`q0-${r.m}`} cx={xOf(r.m)} cy={yOfQ0(r.q0Sector)} r={3.5} fill={ED.series7} />
      ))}
      {[Math.min(...q0Vals), Math.max(...q0Vals)].map((v, i) => (
        <text key={`q0y${i}`} x={padL - 6} y={yOfQ0(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {v.toFixed(7)}
        </text>
      ))}

      {/* Bottom panel: const sector, flat at 1.5 */}
      <text x={padL} y={constY0 - 4} fill={ED.inkSoft} fontSize={10}>const sector (m-free, pinned at 3/2)</text>
      <line x1={padL} y1={constY0 + plotH} x2={padL + plotW} y2={constY0 + plotH} stroke={ED.rule} strokeWidth={1} />
      <path d={constPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {Q0_VS_CONST_ROWS.map((r) => (
        <circle key={`c-${r.m}`} cx={xOf(r.m)} cy={yOfConst(r.constSector)} r={3.5} fill={ED.series1} />
      ))}
      <text x={padL - 6} y={yOfConst(1.5) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>1.500000000000</text>

      {ms.map((m) => (
        <text key={`tx${m}`} x={xOf(m)} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          m={m}
        </text>
      ))}
    </svg>
  );
}

export default function Imp95771Q0SignalVsConstSectorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Q₀ m-Signal vs. m-Free Const Sector (imp-95771 / imp-95746)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/presentation-only page re-plotting the frozen imp-95746 four-moduli
        literals (no re-derivation, no new computation). It changes no bound and proves
        no RH-relevant theorem. Catalan G irrationality is OPEN; Sun arXiv:2609.04176
        remains single-author and unrefereed; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains state of the art. NO QED.
      </div>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Certification caveat (imp-95966):</strong> the
        wider Q&#8320;_RECON reconstruction this Q&#8320; sector belongs to is certified
        against Sun Prop-6.3 <strong>ONLY at m=20</strong> (via the (6.23) certified anchor).
        At m&gt;20 it is offset-certain double-precision, structurally transported, but rests
        on a single TIER-3 integrand-faithfulness hypothesis verified only at m=20 &mdash; the
        {' '}<strong>PIECE-A obstruction</strong>: no reconstruction-independent Prop-6.3
        target c_odd(1/m) exists at any m&gt;20, so the m&gt;20 value comes from the
        reconstruction itself, not an external check. {CERT.obstruction.routesToCertify}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95720 Prop-6.3 integrand splits into two sectors: an m-free const sector
        that carries the imp-95745 pure-rational +4 offset, and a Q&#8320; zeta(3) sector
        that genuinely depends on the modulus m. Re-running the faithful 238-cell machinery
        at m = 18, 19, 20, 21 makes the contrast visible directly: the Q&#8320; sector
        (top panel) traces out a real ~{Q0_SECTOR_SPREAD.toExponential(2)} range across the
        four moduli, while the const sector (bottom panel) sits at exactly 3/2 with zero
        measured spread ({CONST_SECTOR_SPREAD}) at every modulus.
      </p>

      <Q0VsConstChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>modulus m</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>Q&#8320; sector</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>const sector</th>
          </tr>
        </thead>
        <tbody>
          {Q0_VS_CONST_ROWS.map((r) => (
            <tr key={r.m} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.m}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-7)' }}>{r.q0Sector.toFixed(10)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{r.constSector.toFixed(12)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 30%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>spread</td>
            <td style={{ textAlign: 'right', color: 'var(--series-7)' }}>{Q0_SECTOR_SPREAD.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{CONST_SECTOR_SPREAD}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> {IMP95771_SUMMARY.reading}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95771_SUMMARY.verdict}
      </div>
    </div>
  );
}
