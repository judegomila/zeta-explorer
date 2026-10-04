import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33682_GAP_VS_HEIGHT_CORRELATION } from '../data/imp-33682-gap-vs-height-correlation-n400-1200.js';
import { ED } from '../styles/tokens.js';

const POINT_COLOR = ED.series1;
const FIT_COLOR = ED.series4;

const { measured } = IMP33682_GAP_VS_HEIGHT_CORRELATION;
const gaps = measured.gaps;
const peakHeights = measured.peakHeights;
// primary alignment: each gap g_i paired with the MEAN of its two adjacent peak heights
const meanHeights = gaps.map((g, i) => 0.5 * (peakHeights[i] + peakHeights[i + 1]));

function leastSquares(xs, ys) {
  const m = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const mx = sx / m;
  const my = sy / m;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < m; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  return { slope, intercept: my - slope * mx };
}

const { slope, intercept } = leastSquares(gaps, meanHeights);

function ScatterChart() {
  const svgW = 700;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  const gMin = Math.min(...gaps);
  const gMax = Math.max(...gaps);
  const hMin = Math.min(...meanHeights);
  const hMax = Math.max(...meanHeights);
  const gPad = (gMax - gMin) * 0.1 || 1;
  const hPad = (hMax - hMin) * 0.1 || 1;

  const xS = (g) => padL + ((g - (gMin - gPad)) / (gMax - gMin + 2 * gPad)) * cW;
  const yS = (h) => padT + cH * (1 - (h - (hMin - hPad)) / (hMax - hMin + 2 * hPad));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {/* near-zero regression line */}
      <line
        x1={xS(gMin)}
        y1={yS(intercept + slope * gMin)}
        x2={xS(gMax)}
        y2={yS(intercept + slope * gMax)}
        stroke={FIT_COLOR}
        strokeWidth={1.3}
        strokeDasharray="5,3"
      />

      {gaps.map((g, i) => (
        <circle key={`pt-${g}-${meanHeights[i].toFixed(1)}`} cx={xS(g)} cy={yS(meanHeights[i])} r={3.8} fill={POINT_COLOR} />
      ))}

      {[gMin, Math.round((gMin + gMax) / 2), gMax].map((g) => (
        <text key={g} x={xS(g)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {g}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        inter-peak gap (rungs)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        mean-adjacent peak height (ULP)
      </text>

      <text x={padL + 8} y={padT + 16} fill={FIT_COLOR} fontSize={9}>
        |r| &le; 0.30, R&sup2; &le; 0.09 (all four alignments)
      </text>
    </svg>
  );
}

export default function Imp33715GapVsHeightIndependenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Gap-vs-Height Independence, n in [400,1200] (imp-33682)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33682 tested whether the imp-33661 fifteen inter-peak GAPS predict the imp-33660 sixteen
        cluster-peak HEIGHTS at the shared [400,1200] band-clearing peaks -- a cross-check neither sibling
        ran. The scatter below plots each gap against the mean of its two adjacent peak heights (the
        primary alignment), with the least-squares fit line overlaid.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        gap (rungs) vs. mean-adjacent peak height (ULP), fifteen points
      </p>
      <ScatterChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The primary mean-adjacent-height alignment gives Pearson r ~{measured.corrMean.pearsonR >= 0 ? '+' : ''}
        {measured.corrMean.pearsonR.toFixed(2)} (R&sup2; ~{measured.corrMean.pearsonR2.toFixed(3)}, Spearman
        &rho; ~{measured.corrMean.spearmanRho.toFixed(2)}), and every one of the four alignments tested
        (left/right/mean/max) stays below |r| ~{measured.maxPearsonAbs.toFixed(2)} and R&sup2; ~
        {measured.maxR2.toFixed(3)}. The tallest peak (n ~{measured.tallestN}, h ~{measured.heightMax.toFixed(1)}{' '}
        ULP) sits at a NARROW {measured.tallestInboundGap}-rung inbound gap, below the ~{measured.gapMean.toFixed(1)}-rung
        mean -- taller peaks do not sit at wider spacings.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the near-flat fit line and the
        scattered points with no visible trend illustrate the GAP-AND-HEIGHT-INDEPENDENT-NO-CORRELATION
        verdict -- the imp-33661 spacing irregularity and the imp-33660 weak height growth do not share a
        detectable common lattice driver at this sample. Fifteen paired points is a small sample; exact
        per-rung ULP values are jittery arithmetic-floor lattice hits, so the robust reading is the
        qualitative independence conclusion, not the precise fit coefficients.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> accuracy/rule-design measurement only. It
        changes no bound and patches no literal. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
