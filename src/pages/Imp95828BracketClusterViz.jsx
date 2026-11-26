import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP } from '../data/imp-95806-number-variance-bracket-1p5e5-bump.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP;
const ROWS = DATA.rows;
const PEAK_T = DATA.peakT;

// r(T) across the nine-height cluster bracketing T=1.5e5: the isolated peak vs the
// bracket mean/max, showing the immediate neighbours sit in the baseline band.
function BracketClusterChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logT = (T) => Math.log10(T);
  const xMin = logT(ROWS[0].Tc);
  const xMax = logT(ROWS[ROWS.length - 1].Tc);
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 0.5;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const linePath = ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(logT(r.Tc))} ${yOf(r.varRatioMeasuredOverGUE)}`,
  ).join(' ');

  const meanY = yOf(DATA.decision.bracketMeanRatio);
  const maxY = yOf(DATA.decision.bracketMaxRatio);

  const xTicks = ROWS.map((r) => r.Tc);
  const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      {/* bracket mean and bracket max reference lines */}
      <line x1={padL} y1={meanY} x2={padL + plotW} y2={meanY} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="2 3" />
      <text x={padL + 4} y={meanY - 5} fill={ED.brass} fontSize={9}>
        bracket mean r&asymp;{DATA.decision.bracketMeanRatio.toFixed(4)}
      </text>
      <line x1={padL} y1={maxY} x2={padL + plotW} y2={maxY} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={maxY - 5} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        bracket max r={DATA.decision.bracketMaxRatio.toFixed(4)}
      </text>

      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ROWS.map((r) => {
        const isPeak = r.Tc === PEAK_T;
        return (
          <circle
            key={r.Tc}
            cx={xOf(logT(r.Tc))}
            cy={yOf(r.varRatioMeasuredOverGUE)}
            r={isPeak ? 5 : 3}
            fill={isPeak ? ED.series2 : ED.series1}
          />
        );
      })}
      <text x={xOf(logT(PEAK_T)) + 6} y={yOf(DATA.decision.peakVarRatio) - 8} fill={ED.series2} fontSize={9.5}>
        peak r={DATA.decision.peakVarRatio.toFixed(4)} (T=1.5e5)
      </text>

      {xTicks.map((v) => (
        <text key={`tx${v}`} x={xOf(logT(v))} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v.toExponential(1)}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(1)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        height T (log scale, nine centres bracketing 1.5e5)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        var. ratio r(T)
      </text>
    </svg>
  );
}

export default function Imp95828BracketClusterViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Nine-Height Bracket Cluster Around T=1.5e5: Isolated Spike vs Bracket Mean (imp-95806)" />

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
        measurement/presentation-only page re-plotting the frozen imp-95806
        nine-height bracket tabulation (no re-derivation, no new claim). The
        T&nbsp;=&nbsp;1.5e5 bump is shown to be ISOLATED to the single sampled
        height, not a genuine finite-height feature; the imp-95722 max-based
        C0&nbsp;=&nbsp;0.3337 is pinned by this artifact height, but since it
        is an upper envelope this only makes the true correction more
        conservative. It changes no bound and proves no RH-relevant theorem. NO
        QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95710/imp-95787 upward bump in the pointwise number-variance
        ratio r(T)&nbsp;=&nbsp;sd(C&minus;E)&sup2;&nbsp;/&nbsp;&Sigma;&sup2;(L)
        at T&nbsp;=&nbsp;1.5e5 (r&nbsp;=&nbsp;{DATA.decision.peakVarRatio.toFixed(4)})
        was re-measured across a nine-height cluster bracketing it, using the
        same imp-95562 windowing over the 10&sup6; Odlyzko ordinates. The peak
        sits strictly above every bracketing height: its immediate neighbours
        1.35e5 (r&nbsp;=&nbsp;{DATA.decision.lowerNeighbourVarRatio.toFixed(4)}) and
        1.65e5 (r&nbsp;=&nbsp;{DATA.decision.upperNeighbourVarRatio.toFixed(4)}) sit
        squarely in the baseline band, and the six interior probes average
        r&nbsp;&asymp;&nbsp;{DATA.decision.bracketMeanRatio.toFixed(4)}
        (peak/mean&nbsp;=&nbsp;{DATA.decision.peakOverBracketMean.toFixed(3)}). A
        lone spike flanked by baseline neighbours is the signature of a
        windowing/sampling artifact, not a genuine finite-height feature.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Variance ratio r(T) across the bracket cluster
      </h3>
      <BracketClusterChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>local count L</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured var</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r(T)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>windowing offset</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const isPeak = r.Tc === PEAK_T;
            return (
              <tr key={r.Tc} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
                <td style={{ padding: '3px 0', color: isPeak ? 'var(--series-2)' : undefined }}>
                  {r.Tc.toExponential(2)}
                  {isPeak ? ' ← peak' : ''}
                </td>
                <td style={{ textAlign: 'right' }}>{r.meanLocalCountL.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{r.measuredVariance.toFixed(4)}</td>
                <td style={{ textAlign: 'right', color: isPeak ? 'var(--series-2)' : 'var(--series-1)' }}>
                  {r.varRatioMeasuredOverGUE.toFixed(4)}
                </td>
                <td style={{ textAlign: 'right' }}>{r.windowingOffset.toFixed(4)}</td>
              </tr>
            );
          })}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        rendering the frozen imp-95806 tabulation (no re-derivation). Supplies
        no new bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
