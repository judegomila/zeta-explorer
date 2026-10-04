import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK as D,
  IMP34947_RECURRENCE_WINDOWS as WINDOWS,
} from '../data/imp-34947-conjugate-pair-argument-theta-cross-check.js';
import { ED } from '../styles/tokens.js';

const THETA_SIGN_CYCLE = D.crossCheck.theta_signCycle_deg; // 40.000
const THETA_DEEP_MEDIAN = D.recurrenceRead.theta_median_deg; // ~39.043
const R_IMP34932 = D.crossCheck.imp34932_R; // ~78
const R_IMP34900 = D.crossCheck.imp34900_R; // 89.6
const K_LO = WINDOWS[0].k;
const K_HI = WINDOWS[WINDOWS.length - 1].k;

// theta_k versus window depth k -- shows the local Darboux recurrence angle read locking
// onto the imp-34932 sign-cycle grid value (40deg) and the deep-band median (~39deg) as k grows.
function ThetaVsDepthChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 44;
  const padR = 24;
  const padT = 20;
  const padB = 30;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;
  const yLo = 20;
  const yHi = 42;
  const xAt = (k) => padL + ((k - K_LO) / (K_HI - K_LO)) * cW;
  const yAt = (deg) => padT + cH - ((deg - yLo) / (yHi - yLo)) * cH;

  const yTicks = [20, 25, 30, 35, 40];
  const path = WINDOWS.map((w, i) => `${i === 0 ? 'M' : 'L'} ${xAt(w.k).toFixed(2)} ${yAt(w.theta_deg).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}&deg;
          </text>
        </g>
      ))}

      <line x1={padL} y1={yAt(THETA_SIGN_CYCLE)} x2={padL + cW} y2={yAt(THETA_SIGN_CYCLE)} stroke={ED.series7} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={padL + cW - 4} y={yAt(THETA_SIGN_CYCLE) - 4} textAnchor="end" fill={ED.series7} fontSize={9}>
        sign-cycle 40&deg;
      </text>

      <line x1={padL} y1={yAt(THETA_DEEP_MEDIAN)} x2={padL + cW} y2={yAt(THETA_DEEP_MEDIAN)} stroke={ED.series3} strokeWidth={1.5} strokeDasharray="2 3" />
      <text x={padL + 4} y={yAt(THETA_DEEP_MEDIAN) + 12} fill={ED.series3} fontSize={9}>
        deep-band median {THETA_DEEP_MEDIAN.toFixed(2)}&deg;
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {WINDOWS.map((w) => (
        <circle key={w.k} cx={xAt(w.k)} cy={yAt(w.theta_deg)} r={w.deep ? 3 : 2.2} fill={w.deep ? ED.series1 : '#475569'} />
      ))}

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        window depth k (recurrence solved on delta_(k-3)..delta_k)
      </text>
    </svg>
  );
}

// Polar / complex-plane view of R_k e^(+- i theta_k): each window's recurrence read placed as a
// point in the complex plane, with the imp-34932 (R~78) / imp-34900 (R~89.6) radius rings and the
// sign-cycle (40deg) / deep-band-median (~39deg) angular guides for reference.
function PolarTrajectoryChart() {
  const svgW = 420;
  const svgH = 420;
  const cx = svgW / 2;
  const cy = svgH / 2;
  const rMax = 110;
  const px = svgW / 2 - 30;
  const scale = px / rMax;
  const toXY = (R, thetaDeg) => {
    const th = (thetaDeg * Math.PI) / 180;
    return { x: cx + R * scale * Math.cos(th), y: cy - R * scale * Math.sin(th) };
  };

  const rings = [40, 78, 89.6, 110].map((r) => ({ r, label: r === 78 ? 'imp-34932 R~78' : r === 89.6 ? 'imp-34900 R~89.6' : null }));
  const angleGuides = [
    { deg: THETA_SIGN_CYCLE, color: ED.series7, label: 'sign-cycle 40°' },
    { deg: THETA_DEEP_MEDIAN, color: ED.series3, label: `median ${THETA_DEEP_MEDIAN.toFixed(1)}°` },
  ];

  const upper = WINDOWS.map((w) => ({ ...toXY(w.R, w.theta_deg), w }));
  const lower = WINDOWS.map((w) => ({ ...toXY(w.R, -w.theta_deg), w }));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={cx - px - 10} y1={cy} x2={cx + px + 10} y2={cy} stroke={ED.rule} strokeWidth={1} />
      <line x1={cx} y1={cy - px - 10} x2={cx} y2={cy + px + 10} stroke={ED.rule} strokeWidth={1} />

      {rings.map((ring) => (
        <g key={ring.r}>
          <circle cx={cx} cy={cy} r={ring.r * scale} fill="none" stroke={ring.r === 78 || ring.r === 89.6 ? ED.rule : ED.ruleSoft} strokeWidth={ring.r === 78 || ring.r === 89.6 ? 1.3 : 1} strokeDasharray={ring.r === 78 || ring.r === 89.6 ? '5 3' : undefined} />
          {ring.label && (
            <text x={cx + ring.r * scale + 3} y={cy - 3} fill={ED.inkSoft} fontSize={8}>
              {ring.label}
            </text>
          )}
        </g>
      ))}

      {angleGuides.map((g) => {
        const th = (g.deg * Math.PI) / 180;
        const x2 = cx + (px + 10) * Math.cos(th);
        const y2 = cy - (px + 10) * Math.sin(th);
        const y2b = cy + (px + 10) * Math.sin(th);
        return (
          <g key={g.label}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={g.color} strokeWidth={1} strokeDasharray="3 2" />
            <line x1={cx} y1={cy} x2={x2} y2={y2b} stroke={g.color} strokeWidth={1} strokeDasharray="3 2" />
            <text x={x2 + 4} y={y2} fill={g.color} fontSize={8}>
              {g.label}
            </text>
          </g>
        );
      })}

      {upper.map((p) => (
        <circle key={`u${p.w.k}`} cx={p.x} cy={p.y} r={p.w.deep ? 3 : 2} fill={p.w.deep ? ED.series1 : '#475569'} />
      ))}
      {lower.map((p) => (
        <circle key={`l${p.w.k}`} cx={p.x} cy={p.y} r={p.w.deep ? 3 : 2} fill={p.w.deep ? ED.series1 : '#475569'} fillOpacity={0.55} />
      ))}

      <text x={cx} y={16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        R_k e^(&plusmn;i theta_k), window depth k = {K_LO}..{K_HI}
      </text>
    </svg>
  );
}

export default function Imp35077ConjugatePairDarbouxTrajectoryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Conjugate-Pair Darboux Trajectory theta_k / R_k vs Depth (imp-35077 / imp-34947)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-34947 local 2-step linear-recurrence (Darboux) read solves the window (delta_(k-3)..delta_k)
        for a conjugate pole pair R_k e^(&plusmn;i theta_k) at every depth k = {K_LO}..{K_HI}. The early windows
        (k&nbsp;&lt;&nbsp;8, grey) are transient; the deep band (k&nbsp;&ge;&nbsp;8, blue) locks onto
        theta&nbsp;&asymp;&nbsp;{THETA_DEEP_MEDIAN.toFixed(2)}&deg; and R in the imp-34932 (~{R_IMP34932}) /
        imp-34900 (~{R_IMP34900}) band, converging toward -- but staying just below -- the imp-34932
        sign-cycle grid value of {THETA_SIGN_CYCLE.toFixed(1)}&deg;.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
        theta_k versus window depth k
      </p>
      <ThetaVsDepthChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        Polar / complex-plane view of R_k e^(&plusmn;i theta_k)
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PolarTrajectoryChart />
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34947
        per-window {'{k, theta_k, R_k}'} literals verbatim (baked via IMP34947_RECURRENCE_WINDOWS, no
        recomputation on this page). Measurement only on the inherited imp-3220/imp-3406 extrapolation
        surrogate; C_mb GUE-conditional per imp-486 untouched; changes no bound; establishes no operator
        positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
