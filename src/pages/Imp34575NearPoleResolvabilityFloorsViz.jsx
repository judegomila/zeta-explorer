import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34405_RESID_EXP_NEAR_POLE_DIGIT_LOSS } from '../data/imp-34405-resid-exp-near-pole-digit-loss.js';
import { ED } from '../styles/tokens.js';

const {
  kStar,
  approach,
  kStarUlp,
  dStore,
  bindingFloor,
  floorHeadroomDecades,
} = IMP34405_RESID_EXP_NEAR_POLE_DIGIT_LOSS;

// sig(d) = log10(d / dk_star) is a straight line of slope 1 in log10(d) -- sample it
// densely from just below the storage floor up to the farthest approach rung.
const LOG_D_MIN = Math.log10(dStore) - 0.6;
const LOG_D_MAX = Math.log10(approach[0].distanceToPole) + 0.3;
const CURVE_SAMPLES = 60;
const sigCurve = Array.from({ length: CURVE_SAMPLES + 1 }, (_, i) => {
  const logD = LOG_D_MIN + ((LOG_D_MAX - LOG_D_MIN) * i) / CURVE_SAMPLES;
  return { logD, sig: logD - Math.log10(kStarUlp) };
});

function ResolvabilityFloorChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 32;
  const padT = 30;
  const padB = 48;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = LOG_D_MIN;
  const xMax = LOG_D_MAX;
  const yVals = sigCurve.map((p) => p.sig);
  const yMin = Math.min(...yVals, 0) - 0.4;
  const yMax = Math.max(...yVals) + 0.4;

  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const linePts = sigCurve.map((p) => `${xS(p.logD)},${yS(p.sig)}`).join(' ');

  const logKStarUlp = Math.log10(kStarUlp);
  const logDStore = Math.log10(dStore);

  const xTicks = [xMin, logKStarUlp, logDStore, xMax].sort((a, b) => a - b);
  const yTicks = [yMin, 0, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t, ti) => (
        <g key={'yt' + ti}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((t, ti) => (
        <text key={'xt' + ti} x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      {/* zero-crossing: the pole-location floor dk_star, where sig(d) hits 0 */}
      <line
        x1={xS(logKStarUlp)}
        y1={padT}
        x2={xS(logKStarUlp)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />
      <text x={xS(logKStarUlp) + 6} y={padT + 12} fill={ED.series2} fontSize={9}>
        dk_star = {kStarUlp.toExponential(1)} (sig=0)
      </text>

      {/* storage/cancellation floor d_store, well below dk_star */}
      <line
        x1={xS(logDStore)}
        y1={padT}
        x2={xS(logDStore)}
        y2={padT + cH}
        stroke={ED.series3}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <text x={xS(logDStore) + 6} y={padT + cH - 8} fill={ED.series3} fontSize={9}>
        d_store = {dStore.toExponential(2)}
      </text>

      {/* sig(d) = log10(d / dk_star) */}
      <polyline points={linePts} fill="none" stroke={ED.series1} strokeWidth={2} />

      {approach.map((r, i) => (
        <g key={'pt' + i}>
          <circle cx={xS(Math.log10(r.distanceToPole))} cy={yS(r.sigDigits)} r={4.5} fill={ED.series1} />
          <text
            x={xS(Math.log10(r.distanceToPole))}
            y={yS(r.sigDigits) - 10}
            textAnchor="middle"
            fill={ED.series1}
            fontSize={9}
          >
            k={r.k.toFixed(2)}: {r.sigDigits.toFixed(2)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(endpoint distance d = k* - kEnd), k* = {kStar.toFixed(5)}
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        sig(d) = log10(d / dk_star)
      </text>
    </svg>
  );
}

export default function Imp34575NearPoleResolvabilityFloorsViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Near-Pole resid_exp Resolvability Floors (imp-34405)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        As the fixed-band endpoint kEnd approaches the surrogate pole k* ~ {kStar.toFixed(5)}, the
        significant-digit count of resid_exp -- sig(d) = log10(d / dk_star) -- falls linearly in
        log10(d) and hits zero at the POLE-LOCATION floor d = dk_star = {kStarUlp.toExponential(1)}
        (the reported-k* rounding ULP). The independent STORAGE/CANCELLATION floor
        d_store ~ {dStore.toExponential(2)} (green) sits ~{floorHeadroomDecades.toFixed(2)} decades
        below it, so the binding wall on resolvability is the {bindingFloor} floor, not storage.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sig(d) vs log10(endpoint distance) -- zero-crossing at dk_star, storage floor d_store marked
      </p>
      <ResolvabilityFloorChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>distance to k*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>resid_exp</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sig(d)</th>
          </tr>
        </thead>
        <tbody>
          {approach.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.k.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.distanceToPole.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residExp.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.sigDigits.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only -- a
        precision-budget read of the inherited surrogate resid_exp near the inherited pole
        k* ~ {kStar.toFixed(5)}, reusing the imp-34310 linear near-pole model. The component model
        is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
