import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34203_ENDPOINT_PEAKS,
  IMP34203_ENDPOINT_FIT,
  IMP34203_FIXED_BAND_PEAKS,
  IMP34203_FIXED_BAND_FIT,
  IMP34203_SUMMARY,
} from '../data/imp-34203-endpoint-vs-fixed-band-peak-saturation-cross-viz-data.js';
import { ED } from '../styles/tokens.js';

// Overlay chart: both peak families vs kEnd on one panel, with the imp-34108
// bounded ceiling drawn as a dashed reference line the endpoint family (red)
// climbs toward, while the fixed-band family (blue) simply keeps rising past
// where the endpoint family would already be levelling off.
function PeakOverlayChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allKEnds = [...IMP34203_ENDPOINT_PEAKS.map((r) => r.kEnd), ...IMP34203_FIXED_BAND_PEAKS.map((r) => r.kEnd)];
  const minX = Math.min(...allKEnds) - 0.5;
  const maxX = Math.max(...allKEnds) + 0.5;
  const minY = 0;
  const maxY = IMP34203_ENDPOINT_FIT.ceiling + 0.1;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const endpointPath = IMP34203_ENDPOINT_PEAKS.map((r) => `${xAt(r.kEnd)},${yAt(r.peak)}`).join(' ');
  const fixedBandPath = IMP34203_FIXED_BAND_PEAKS.map((r) => `${xAt(r.kEnd)},${yAt(r.peak)}`).join(' ');

  const ceilingY = yAt(IMP34203_ENDPOINT_FIT.ceiling);

  const xTicks = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={ceilingY} x2={padL + cW} y2={ceilingY} stroke={ED.brassDeco} strokeWidth={1.25} strokeDasharray="5,3" />
      <text x={padL + cW - 4} y={ceilingY - 5} textAnchor="end" fill={ED.brass} fontSize={8.5}>
        {`endpoint fitted ceiling a=${IMP34203_ENDPOINT_FIT.ceiling}`}
      </text>

      <polyline points={endpointPath} fill="none" stroke={ED.series2} strokeWidth={2} />
      {IMP34203_ENDPOINT_PEAKS.map((r) => (
        <circle key={`ep-${r.kEnd}`} cx={xAt(r.kEnd)} cy={yAt(r.peak)} r={2.75} fill={ED.series2} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      <polyline points={fixedBandPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP34203_FIXED_BAND_PEAKS.map((r) => (
        <circle key={`fb-${r.kEnd}`} cx={xAt(r.kEnd)} cy={yAt(r.peak)} r={2.75} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      {xTicks.map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {t}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`yt-${t}`} x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {t.toFixed(1)}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (fit boundary)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 12, ${padT + cH / 2})`}
      >
        peak residual
      </text>
      <text x={padL + 6} y={padT + 12} fill={ED.series2} fontSize={9.5}>
        endpoint peak (imp-33917/imp-34108): SATURATES
      </text>
      <text x={padL + 6} y={padT + 24} fill={ED.series1} fontSize={9.5}>
        fixed-band peak (imp-33987/imp-34109): KEEPS CLIMBING
      </text>
    </svg>
  );
}

// Increment sub-panels: bars of the per-step rise for each family, side by side,
// so the reader sees the endpoint increments shrinking toward zero while the
// fixed-band increments bottom out near kEnd~18.5 then RE-ACCELERATE.
function IncrementSubPanels() {
  const epIncrements = [];
  for (let i = 1; i < IMP34203_ENDPOINT_PEAKS.length; i += 1) {
    epIncrements.push({
      kEnd: IMP34203_ENDPOINT_PEAKS[i].kEnd,
      inc: IMP34203_ENDPOINT_PEAKS[i].peak - IMP34203_ENDPOINT_PEAKS[i - 1].peak,
    });
  }
  const fbIncrements = [];
  for (let i = 1; i < IMP34203_FIXED_BAND_PEAKS.length; i += 1) {
    fbIncrements.push({
      kEnd: IMP34203_FIXED_BAND_PEAKS[i].kEnd,
      inc: IMP34203_FIXED_BAND_PEAKS[i].peak - IMP34203_FIXED_BAND_PEAKS[i - 1].peak,
    });
  }

  const maxInc = Math.max(...epIncrements.map((r) => r.inc), ...fbIncrements.map((r) => r.inc));

  function Bars({ rows, color, width }) {
    const barW = width / rows.length - 3;
    const chartH = 90;
    return (
      <svg width={width} height={chartH + 20} style={{ display: 'block' }}>
        {rows.map((r, i) => {
          const h = (r.inc / maxInc) * chartH;
          const x = i * (width / rows.length) + 1.5;
          return (
            <g key={`bar-${r.kEnd}`}>
              <rect x={x} y={chartH - h} width={barW} height={h} fill={color} opacity={0.8} />
              <text x={x + barW / 2} y={chartH + 12} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
                {r.kEnd}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
      <div>
        <p style={{ color: 'var(--series-2)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
          endpoint increments (decay monotonically toward zero)
        </p>
        <Bars rows={epIncrements} color={ED.series2} width={300} />
      </div>
      <div>
        <p style={{ color: 'var(--series-1)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
          fixed-band increments (bottom near kEnd~{IMP34203_FIXED_BAND_FIT.incrementMinimumKEnd}, then RE-ACCELERATE)
        </p>
        <Bars rows={fbIncrements} color={ED.series1} width={340} />
      </div>
    </div>
  );
}

export default function Imp34203EndpointVsFixedBandPeakSaturationCrossViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Endpoint vs Fixed-Band Peak Saturation Cross-Viz (imp-34108/imp-34109)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Two sibling boundary-residual peak families, fit with the SAME bounded
        saturating form peak = a - b/kEnd, reach OPPOSITE model-selection
        verdicts. The imp-33917 endpoint peak (red) selects the bounded form:
        imp-34108 extrapolates its fitted ceiling to a = {IMP34203_ENDPOINT_FIT.ceiling}
        {' '}(approached within 1% only at kEnd ~ {IMP34203_ENDPOINT_FIT.within1PercentKEnd},
        ~{IMP34203_ENDPOINT_FIT.reach1PercentWindows}x its kEnd = {IMP34203_ENDPOINT_FIT.fitWindowEndKEnd}{' '}
        fit window). The imp-33987 fixed-band peak (blue) instead selects an
        UNBOUNDED log form over the identical bounded fit: imp-34109 finds
        R2 = {IMP34203_FIXED_BAND_FIT.logR2} for the log form versus{' '}
        {IMP34203_FIXED_BAND_FIT.boundedR2} for the bounded fit -- no finite
        ceiling is supported within its kEnd = {IMP34203_FIXED_BAND_FIT.fitWindowEndKEnd} window.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        peak residual vs kEnd, both families on one panel
      </p>
      <PeakOverlayChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1rem', marginBottom: '0.25rem' }}>
        per-step increments (the curvature signature behind each verdict)
      </p>
      <IncrementSubPanels />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the contrast:</strong>{' '}
        {IMP34203_SUMMARY.contrast} The endpoint increments shrink monotonically
        toward zero (a genuine deceleration), while the fixed-band increments
        fall to a minimum near kEnd ~ {IMP34203_FIXED_BAND_FIT.incrementMinimumKEnd}{' '}
        and then RE-ACCELERATE -- the same "increments shrinking" signature that
        looked like saturation onset in imp-34040 turned out to be a transient,
        not a plateau approach, once the boundary was pushed one further decade
        (imp-34109).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        of two already-established measurements (imp-34108, imp-34109), no new
        computation on the underlying component model. Both peak families are
        descriptive re-selections of residuals from an inherited surrogate as
        the fit boundary recedes, NOT rigorous asymptotics; the imp-33843
        log-linear-vs-power-law FORM verdict is UNTOUCHED; C_mb GUE-conditional
        per imp-486 UNTOUCHED; changes no bound; establishes no operator
        positivity; imp-3066 K_a&gt;=0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
