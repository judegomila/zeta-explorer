import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  Q0_VS_CONST_ROWS,
  Q0_SECTOR_SPREAD,
  CONST_SECTOR_SPREAD,
  IMP95771_SUMMARY,
} from '../data/imp-95771-q0-signal-vs-const-sector-viz-data.js';
import { Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION as CERT } from '../data/imp-95966-q0-recon-largem-certification-obstruction.js';

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
      <text x={padL} y={padT - 4} fill="#94a3b8" fontSize={10}>Q&#8320; sector (genuine m-signal)</text>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1} />
      <path d={q0Path} fill="none" stroke="#f472b6" strokeWidth={2} />
      {Q0_VS_CONST_ROWS.map((r) => (
        <circle key={`q0-${r.m}`} cx={xOf(r.m)} cy={yOfQ0(r.q0Sector)} r={3.5} fill="#f472b6" />
      ))}
      {[Math.min(...q0Vals), Math.max(...q0Vals)].map((v, i) => (
        <text key={`q0y${i}`} x={padL - 6} y={yOfQ0(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
          {v.toFixed(7)}
        </text>
      ))}

      {/* Bottom panel: const sector, flat at 1.5 */}
      <text x={padL} y={constY0 - 4} fill="#94a3b8" fontSize={10}>const sector (m-free, pinned at 3/2)</text>
      <line x1={padL} y1={constY0 + plotH} x2={padL + plotW} y2={constY0 + plotH} stroke="#64748b" strokeWidth={1} />
      <path d={constPath} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {Q0_VS_CONST_ROWS.map((r) => (
        <circle key={`c-${r.m}`} cx={xOf(r.m)} cy={yOfConst(r.constSector)} r={3.5} fill="#60a5fa" />
      ))}
      <text x={padL - 6} y={yOfConst(1.5) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>1.500000000000</text>

      {ms.map((m) => (
        <text key={`tx${m}`} x={xOf(m)} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
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
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a
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
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Certification caveat (imp-95966):</strong> the
        wider Q&#8320;_RECON reconstruction this Q&#8320; sector belongs to is certified
        against Sun Prop-6.3 <strong>ONLY at m=20</strong> (via the (6.23) certified anchor).
        At m&gt;20 it is offset-certain double-precision, structurally transported, but rests
        on a single TIER-3 integrand-faithfulness hypothesis verified only at m=20 &mdash; the
        {' '}<strong>PIECE-A obstruction</strong>: no reconstruction-independent Prop-6.3
        target c_odd(1/m) exists at any m&gt;20, so the m&gt;20 value comes from the
        reconstruction itself, not an external check. {CERT.obstruction.routesToCertify}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95720 Prop-6.3 integrand splits into two sectors: an m-free const sector
        that carries the imp-95745 pure-rational +4 offset, and a Q&#8320; zeta(3) sector
        that genuinely depends on the modulus m. Re-running the faithful 238-cell machinery
        at m = 18, 19, 20, 21 makes the contrast visible directly: the Q&#8320; sector
        (top panel) traces out a real ~{Q0_SECTOR_SPREAD.toExponential(2)} range across the
        four moduli, while the const sector (bottom panel) sits at exactly 3/2 with zero
        measured spread ({CONST_SECTOR_SPREAD}) at every modulus.
      </p>

      <Q0VsConstChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>modulus m</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>Q&#8320; sector</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>const sector</th>
          </tr>
        </thead>
        <tbody>
          {Q0_VS_CONST_ROWS.map((r) => (
            <tr key={r.m} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.m}</td>
              <td style={{ textAlign: 'right', color: '#f472b6' }}>{r.q0Sector.toFixed(10)}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{r.constSector.toFixed(12)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.3)' }}>
            <td style={{ padding: '3px 0' }}>spread</td>
            <td style={{ textAlign: 'right', color: '#f472b6' }}>{Q0_SECTOR_SPREAD.toExponential(3)}</td>
            <td style={{ textAlign: 'right', color: '#60a5fa' }}>{CONST_SECTOR_SPREAD}</td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> {IMP95771_SUMMARY.reading}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP95771_SUMMARY.verdict}
      </div>
    </div>
  );
}
