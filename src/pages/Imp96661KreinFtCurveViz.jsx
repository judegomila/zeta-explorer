import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96661_CURVE_090,
  IMP96661_CURVE_096,
  IMP96661_ZOOM_096,
  IMP96661_MARKERS,
} from '../data/imp-96661-krein-ft-curve-viz-data.js';
import { ED } from '../styles/tokens.js';

// full-range panel: log10(F) vs t over [0,60], both certificates overlaid
function FullRangePanel() {
  const svgW = 720;
  const padL = 46;
  const padR = 16;
  const svgH = 300;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMax = 60;
  const xOf = (t) => padL + (t / tMax) * plotW;

  const logMin = 0.85; // log10(7)
  const logMax = 8;
  const yOf = (f) => padT + plotH - ((Math.log10(Math.max(f, 1)) - logMin) / (logMax - logMin)) * plotH;

  const pathFor = (curve) => curve.map(([t, f], i) => `${i === 0 ? 'M' : 'L'} ${xOf(t)} ${yOf(f)}`).join(' ');

  const xTicks = [0, 10, 20, 30, 40, 50, 60];
  const logTicks = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {logTicks.map((v) => (
        <g key={`l${v}`}>
          <line x1={padL} y1={yOf(10 ** v)} x2={padL + plotW} y2={yOf(10 ** v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(10 ** v) + 3} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
            1e{v}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={xOf(t)} y1={padT} x2={xOf(t)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(t)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {t}
          </text>
        </g>
      ))}

      <path d={pathFor(IMP96661_CURVE_090)} fill="none" stroke={ED.series1} strokeWidth={1.2} />
      <path d={pathFor(IMP96661_CURVE_096)} fill="none" stroke={ED.series4} strokeWidth={1.2} />

      {/* worst-point markers */}
      <circle cx={xOf(IMP96661_MARKERS.cert090.worstAt)} cy={yOf(IMP96661_MARKERS.cert090.worstF)} r={4} fill={ED.series1} />
      <circle cx={xOf(IMP96661_MARKERS.cert096.worstAt)} cy={yOf(IMP96661_MARKERS.cert096.worstF)} r={4} fill={ED.series4} />
      <circle cx={xOf(IMP96661_MARKERS.cert096.dipAt)} cy={yOf(IMP96661_MARKERS.cert096.dipF)} r={3.5} fill={ED.brassDeco} />

      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        t
      </text>
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        F(t) = sigma_2(t) + nu(t) [log scale]
      </text>
    </svg>
  );
}

// zoom panel: linear F vs t over [8,11.6], cert096 only, the sigma_2/nu near-cancellation window
function ZoomPanel() {
  const svgW = 720;
  const padL = 46;
  const padR = 16;
  const svgH = 240;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMin = 8;
  const tMax = 11.6;
  const xOf = (t) => padL + ((t - tMin) / (tMax - tMin)) * plotW;

  const fMin = 0;
  const fMax = 46;
  const yOf = (f) => padT + plotH - ((f - fMin) / (fMax - fMin)) * plotH;

  const path = IMP96661_ZOOM_096.map(([t, f], i) => `${i === 0 ? 'M' : 'L'} ${xOf(t)} ${yOf(f)}`).join(' ');

  const yTicks = [0, 8, 20, 30, 40];
  const xTicks = [8, 9, 10, 11];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={xOf(t)} y1={padT} x2={xOf(t)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xOf(t)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {t}
          </text>
        </g>
      ))}

      {/* nominal design margin eps=8 */}
      <line x1={padL} y1={yOf(8)} x2={padL + plotW} y2={yOf(8)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + plotW - 4} y={yOf(8) - 4} textAnchor="end" fill={ED.series2} fontSize={8}>
        eps = 8 design margin
      </text>

      <path d={path} fill="none" stroke={ED.series4} strokeWidth={1.4} />

      <circle cx={xOf(IMP96661_MARKERS.cert096.dipAt)} cy={yOf(IMP96661_MARKERS.cert096.dipF)} r={4} fill={ED.brassDeco} />
      <text x={xOf(IMP96661_MARKERS.cert096.dipAt)} y={yOf(IMP96661_MARKERS.cert096.dipF) - 10} textAnchor="middle" fill={ED.brass} fontSize={8.5}>
        dip t=9.025
      </text>
      <circle cx={xOf(IMP96661_MARKERS.cert096.worstAt)} cy={yOf(IMP96661_MARKERS.cert096.worstF)} r={4} fill={ED.series4} />
      <text x={xOf(IMP96661_MARKERS.cert096.worstAt)} y={yOf(IMP96661_MARKERS.cert096.worstF) - 10} textAnchor="middle" fill={ED.series4} fontSize={8.5}>
        worst t=11.095
      </text>

      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        t
      </text>
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        F(t) [linear]
      </text>
    </svg>
  );
}

export default function Imp96661KreinFtCurveViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krein sigma2 Certificate Positivity Margin: F(t) Over t in [0,60]" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        F(t) = sigma_2(t) + nu(t), the pointwise quantity each interval-verified Route I Krein
        certificate proves is positive on all of R, plotted for both certificates: 2a = 0.9 (blue,
        eps = 20) and 2a = 0.96 (orange, eps = 8). Both curves stay strictly positive across the
        full [0,60] range sampled here; the 2a = 0.96 curve dips to a minimum of{' '}
        {IMP96661_MARKERS.cert096.dipF.toFixed(4)} near t = {IMP96661_MARKERS.cert096.dipAt}, briefly
        below its nominal design margin eps = 8 (a cosmetic design-margin observation, not a
        positivity failure — see imp-96651).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Full range, log scale (blue: 2a=0.9, orange: 2a=0.96)
      </h3>
      <FullRangePanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Zoom: sigma_2 / nu near-cancellation window, 2a = 0.96, t in [8, 11.6]
      </h3>
      <ZoomPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the reported worst points
        (imp-96633) are marked with filled circles — cert090 at t = {IMP96661_MARKERS.cert090.worstAt}
        {' '}(F = {IMP96661_MARKERS.cert090.worstF.toFixed(2)}) and cert096 at t = {IMP96661_MARKERS.cert096.worstAt}
        {' '}(F = {IMP96661_MARKERS.cert096.worstF.toFixed(4)}, single-abscissa value — the certificate's own
        verifier field worstFm = 7.394 there is a mixed-abscissa monitor artifact, not a real point
        value, per imp-96633). The zoom panel shows why t &asymp; 11 is delicate for cert096: sigma_2(t)
        &asymp; +6218 and nu(t) &asymp; -6204 nearly cancel there, so F oscillates rapidly across a
        narrow window instead of varying smoothly, unlike the cert090 curve (flat at 20 across the same
        range).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page. Every sample was generated
        offline (tmp/imp-96661-sample-curve.mjs) from the already-committed double-precision
        certificateF/sigma2 (rh-route-i-toeplitz-krein-certificate-2026-09-24.js) against the two baked
        certificate coefficient tables; the results are baked as literals in the imp-96661 viz-data leaf,
        never imported at runtime. Presentation only; changes no bound; establishes no new operator
        positivity; the interval-verified conclusion (T_a[sigma_2] &gt;= 0 for 2a &lt;= 0.96) is
        unaffected. RH open. NO QED.
      </div>
    </div>
  );
}
