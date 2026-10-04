// GueComparisonPage — imp-1099
// Side-by-side visual + numeric comparison of the empirical nearest-neighbor
// spacing distribution of the first N = 10000 verified Odlyzko Riemann zeros
// against the GUE (Gaussian Unitary Ensemble) Wigner surmise
//   p(s) = (32 / pi^2) * s^2 * exp(-4 * s^2 / pi).
//
// Renders:
//   (1) Histogram of empirical unfolded spacings (50 bins on [0, 4]) as bars
//       with the GUE Wigner curve overlaid as a smooth line.
//   (2) Per-bin residual chart (empirical pdf minus GUE pdf at bin centers)
//       so localized deviations are visible.
//   (3) Numeric panel with KL divergence + Hellinger distance + mean
//       spacing + sample size.
//
// Pure SVG + React. d3-scale used for the x and y axes.
//
// Data source: pinned browser snapshot derived offline from
// src/data/gue-vs-zeros-comparison.js (GUE_VS_ZEROS_COMPARISON).
//
// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// data/geometry/logic; chrome recolored to the warm palette, SVG fill/stroke
// switched from the dark-slate literals to literal warm-palette hex (no
// var() inside the SVG). Claims/stats/caveats kept verbatim.

import React from 'react';
import { Link } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Browser-light snapshot of the offline first-10000-zero sweep. Keeping the
// 50 sufficient-statistic bins here avoids importing the 16.7 MB zero corpus;
// the analytic GUE curve and displayed residuals are rebuilt deterministically.
const SNAPSHOT_BIN_COUNTS = Object.freeze([
  2, 18, 61, 121, 243, 311, 490, 597, 696, 819,
  795, 809, 800, 740, 643, 578, 492, 416, 349, 239,
  208, 158, 133, 89, 59, 46, 38, 25, 11, 5,
  7, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

function makeGueComparisonSnapshot() {
  const nZerosUsed = 10000;
  const nSpacings = nZerosUsed - 1;
  const nBins = SNAPSHOT_BIN_COUNTS.length;
  const sMax = 4;
  const binWidth = sMax / nBins;
  const gueWigner = (s) => (
    (32 / (Math.PI * Math.PI)) * s * s * Math.exp((-4 * s * s) / Math.PI)
  );
  const binEdges = Array.from({ length: nBins + 1 }, (_, i) => i * binWidth);
  const binCenters = Array.from({ length: nBins }, (_, i) => (i + 0.5) * binWidth);
  const binPdfGue = binCenters.map(gueWigner);
  const sGrid = Array.from({ length: 401 }, (_, i) => (sMax * i) / 400);
  const p_s = sGrid.map(gueWigner);
  const empiricalPdf = SNAPSHOT_BIN_COUNTS.map((count) => count / nSpacings / binWidth);
  const residuals = empiricalPdf.map((p, i) => p - binPdfGue[i]);

  return Object.freeze({
    nZerosUsed,
    nSpacings,
    meanSpacingUnfolded: 0.9998987588864481,
    histogram: Object.freeze({
      binEdges: Object.freeze(binEdges),
      counts: SNAPSHOT_BIN_COUNTS,
      binWidth,
      nBins,
      sMax,
      inRange: nSpacings,
      total: nSpacings,
    }),
    gueWignerCurve: Object.freeze({
      sGrid: Object.freeze(sGrid),
      p_s: Object.freeze(p_s),
      binCenters: Object.freeze(binCenters),
      binPdfGue: Object.freeze(binPdfGue),
    }),
    empiricalPdf: Object.freeze(empiricalPdf),
    residuals: Object.freeze(residuals),
    residualMaxAbs: 0.1262433886634584,
    klDivergence: 0.008132830923779937,
    hellingerDistance: 0.04832497883222528,
  });
}

const GUE_VS_ZEROS_COMPARISON = makeGueComparisonSnapshot();

// ── SVG geometry for the histogram + GUE overlay ────────────────────────────

const W = 960;
const H = 420;
const M = { top: 30, right: 30, bottom: 60, left: 70 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

// Residual chart geometry.
const RW = 960;
const RH = 220;
const RM = { top: 20, right: 30, bottom: 50, left: 70 };
const RIW = RW - RM.left - RM.right;
const RIH = RH - RM.top - RM.bottom;

// ── Style helpers (literal warm-palette hex — no var() inside the SVG) ──────

const labelStyle = {
  fontFamily: 'IBM Plex Mono, ui-monospace, SFMono-Regular, monospace',
  fontSize: 11,
  fill: ED.inkSoft,
};

const tickStyle = {
  fontFamily: 'IBM Plex Mono, ui-monospace, SFMono-Regular, monospace',
  fontSize: 9,
  fill: ED.inkFaint,
};

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: 12,
  };
}

// ── Page component ──────────────────────────────────────────────────────────

export default function GueComparisonPage() {
  const D = GUE_VS_ZEROS_COMPARISON;
  const hist = D.histogram;
  const curve = D.gueWignerCurve;
  const pdfEmp = D.empiricalPdf;
  const residuals = D.residuals;
  const nBins = hist.nBins;
  const binWidth = hist.binWidth;
  const sMax = hist.sMax;

  // y-domain for the pdf chart: take the max of empirical and GUE pdfs.
  let pdfMax = 0;
  for (let i = 0; i < nBins; i++) {
    if (pdfEmp[i] > pdfMax) pdfMax = pdfEmp[i];
    if (curve.binPdfGue[i] > pdfMax) pdfMax = curve.binPdfGue[i];
  }
  for (let i = 0; i < curve.p_s.length; i++) {
    if (curve.p_s[i] > pdfMax) pdfMax = curve.p_s[i];
  }
  const yMax = Math.ceil(pdfMax * 10) / 10 + 0.05;

  const x = scaleLinear().domain([0, sMax]).range([0, IW]);
  const y = scaleLinear().domain([0, yMax]).range([IH, 0]);

  // y-domain for residuals chart.
  let rMax = 0;
  for (let i = 0; i < nBins; i++) {
    const a = Math.abs(residuals[i]);
    if (a > rMax) rMax = a;
  }
  const rCap = Math.max(rMax * 1.2, 0.05);
  const xR = scaleLinear().domain([0, sMax]).range([0, RIW]);
  const yR = scaleLinear().domain([-rCap, rCap]).range([RIH, 0]);

  const xTicks = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
  const yTicks = [];
  for (let v = 0; v <= yMax + 1e-9; v += 0.2) yTicks.push(v);

  // Build the GUE curve as an SVG polyline.
  const gueCurvePoints = curve.sGrid
    .map((s, i) => x(s) + ',' + y(curve.p_s[i]))
    .join(' ');

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz &middot; GUE comparison</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>GUE vs Riemann Zero Spacings (imp-1099)</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '58ch' }}>
          Empirical nearest-neighbor spacing distribution of the first
          {' '}{D.nZerosUsed.toLocaleString()} verified Odlyzko Riemann zeros,
          unfolded via the Riemann-von Mangoldt local density, compared to the
          GUE (Gaussian Unitary Ensemble) Wigner surmise
          {' '}<code>p(s) = (32 / pi^2) * s^2 * exp(-4 * s^2 / pi)</code>.
          GUE universality of the zeros is a deep and widely supported
          conjecture; this page exhibits the well-known numerical agreement.
        </p>
      <AnimationEmbed id="gue-3point" />

        <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'var(--ed-mono)' }}>
          <Link to="/statistics" style={{ color: 'var(--terra-dk)' }}>
            &larr; back to Zero Statistics &amp; Spectral Criteria
          </Link>
        </div>

        {/* Numeric summary cards. */}
        <div
          className="card-grid"
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          <SummaryCard
            label="KL divergence"
            value={D.klDivergence.toExponential(3)}
            tone="var(--green)"
            hint="KL(empirical || GUE), bin-by-bin"
          />
          <SummaryCard
            label="Hellinger distance"
            value={D.hellingerDistance.toFixed(4)}
            tone="var(--green)"
            hint="symmetric, lives in [0, 1]"
          />
          <SummaryCard
            label="mean unfolded spacing"
            value={D.meanSpacingUnfolded.toFixed(4)}
            tone="var(--blue)"
            hint="target = 1.0000 (unfolding gauge)"
          />
          <SummaryCard
            label="N zeros used"
            value={D.nZerosUsed.toLocaleString()}
            tone="var(--brass)"
            hint="pinned snapshot from the offline zero sweep"
          />
          <SummaryCard
            label="N spacings"
            value={D.nSpacings.toLocaleString()}
            tone="var(--brass)"
            hint="= N_zeros - 1"
          />
          <SummaryCard
            label="max |residual|"
            value={D.residualMaxAbs.toFixed(4)}
            tone="var(--brass-dk)"
            hint="max over bins of |pdf_emp - pdf_gue|"
          />
        </div>

        {/* Histogram + GUE overlay. */}
        <div
          style={{
            marginTop: 24,
            overflowX: 'auto',
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono)', color: 'var(--faint)', marginBottom: 8 }}>
            empirical histogram (bars) with GUE Wigner surmise overlay (line)
          </div>
          <svg width={W} height={H} role="img" aria-label="GUE vs zeros spacings histogram">
            <g transform={'translate(' + M.left + ',' + M.top + ')'}>
              {/* Histogram bars. */}
              {pdfEmp.map((p, i) => {
                const xLo = x(i * binWidth);
                const xHi = x((i + 1) * binWidth);
                const yTop = y(p);
                const h = IH - yTop;
                return (
                  <rect
                    key={'bar-' + i}
                    x={xLo + 0.5}
                    y={yTop}
                    width={Math.max(xHi - xLo - 1, 0.5)}
                    height={Math.max(h, 0)}
                    fill={alpha(ED.series1, 0.35)}
                    stroke={alpha(ED.series1, 0.9)}
                    strokeWidth={0.7}
                  >
                    <title>
                      {'bin [' + (i * binWidth).toFixed(2) + ', ' + ((i + 1) * binWidth).toFixed(2)
                        + '): empirical pdf = ' + p.toFixed(4)
                        + ', GUE pdf = ' + curve.binPdfGue[i].toFixed(4)
                        + ', residual = ' + (p - curve.binPdfGue[i]).toFixed(4)}
                    </title>
                  </rect>
                );
              })}

              {/* GUE Wigner overlay curve. */}
              <polyline
                points={gueCurvePoints}
                fill="none"
                stroke={ED.accentDeco}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Mean-spacing reference line at s = 1. */}
              <line x1={x(1)} x2={x(1)} y1={0} y2={IH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4,4" />
              <text x={x(1) + 4} y={12} style={{ ...labelStyle, fill: 'var(--brass-deco)' }}>
                mean spacing = 1
              </text>

              {/* x axis. */}
              <line x1={0} x2={IW} y1={IH} y2={IH} stroke={ED.inkSoft} />
              {xTicks.map((t) => (
                <g key={'xt-' + t} transform={'translate(' + x(t) + ',' + IH + ')'}>
                  <line y1={0} y2={5} stroke={ED.inkSoft} />
                  <text y={18} textAnchor="middle" style={tickStyle}>{t.toFixed(1)}</text>
                </g>
              ))}
              <text x={IW / 2} y={IH + 42} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
                unfolded spacing s
              </text>

              {/* y axis. */}
              <line x1={0} x2={0} y1={0} y2={IH} stroke={ED.inkSoft} />
              {yTicks.map((t) => (
                <g key={'yt-' + t.toFixed(2)} transform={'translate(0,' + y(t) + ')'}>
                  <line x1={-5} x2={0} stroke={ED.inkSoft} />
                  <text x={-8} y={3} textAnchor="end" style={tickStyle}>{t.toFixed(2)}</text>
                </g>
              ))}
              <text transform={'translate(-50,' + IH / 2 + ') rotate(-90)'} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
                probability density p(s)
              </text>

              {/* Legend. */}
              <g transform={'translate(' + (IW - 230) + ',6)'}>
                <rect x={-6} y={-4} width={236} height={42} rx={6} fill={alpha(ED.paper, 0.9)} stroke={alpha(ED.rule, 0.8)} />
                <rect x={0} y={4} width={14} height={10} fill={alpha(ED.series1, 0.35)} stroke={alpha(ED.series1, 0.9)} strokeWidth={0.7} />
                <text x={20} y={13} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
                  empirical histogram (10000 zeros)
                </text>
                <line x1={0} x2={14} y1={26} y2={26} stroke={ED.accentDeco} strokeWidth={2} />
                <text x={20} y={30} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
                  GUE Wigner surmise
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Per-bin residual chart. */}
        <div
          style={{
            marginTop: 24,
            overflowX: 'auto',
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 12, fontFamily: 'var(--ed-mono)', color: 'var(--faint)', marginBottom: 8 }}>
            per-bin residual (empirical pdf - GUE pdf)
          </div>
          <svg width={RW} height={RH} role="img" aria-label="per-bin residuals">
            <g transform={'translate(' + RM.left + ',' + RM.top + ')'}>
              {/* Zero line. */}
              <line x1={0} x2={RIW} y1={yR(0)} y2={yR(0)} stroke={ED.inkSoft} />

              {/* Residual bars. */}
              {residuals.map((r, i) => {
                const xLo = xR(i * binWidth);
                const xHi = xR((i + 1) * binWidth);
                const yTop = yR(Math.max(r, 0));
                const yBot = yR(Math.min(r, 0));
                const h = yBot - yTop;
                const positive = r >= 0;
                return (
                  <rect
                    key={'res-' + i}
                    x={xLo + 0.5}
                    y={yTop}
                    width={Math.max(xHi - xLo - 1, 0.5)}
                    height={Math.max(h, 0)}
                    fill={positive ? alpha(ED.series3, 0.55) : alpha(ED.accentDeco, 0.55)}
                    stroke={positive ? alpha(ED.series3, 0.95) : alpha(ED.accentDeco, 0.95)}
                    strokeWidth={0.7}
                  >
                    <title>
                      {'bin [' + (i * binWidth).toFixed(2) + ', ' + ((i + 1) * binWidth).toFixed(2)
                        + '): residual = ' + r.toFixed(4)}
                    </title>
                  </rect>
                );
              })}

              {/* x axis. */}
              <line x1={0} x2={RIW} y1={RIH} y2={RIH} stroke={ED.inkSoft} />
              {xTicks.map((t) => (
                <g key={'rxt-' + t} transform={'translate(' + xR(t) + ',' + RIH + ')'}>
                  <line y1={0} y2={5} stroke={ED.inkSoft} />
                  <text y={16} textAnchor="middle" style={tickStyle}>{t.toFixed(1)}</text>
                </g>
              ))}
              <text x={RIW / 2} y={RIH + 38} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
                unfolded spacing s
              </text>

              {/* y axis. */}
              <line x1={0} x2={0} y1={0} y2={RIH} stroke={ED.inkSoft} />
              {[-rCap, -rCap / 2, 0, rCap / 2, rCap].map((t, i) => (
                <g key={'ryt-' + i} transform={'translate(0,' + yR(t) + ')'}>
                  <line x1={-5} x2={0} stroke={ED.inkSoft} />
                  <text x={-8} y={3} textAnchor="end" style={tickStyle}>{t.toFixed(3)}</text>
                </g>
              ))}
              <text transform={'translate(-52,' + RIH / 2 + ') rotate(-90)'} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
                residual
              </text>
            </g>
          </svg>
        </div>

        {/* Method + interpretation cards. */}
        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card" style={{ ...cardBaseLeft('var(--blue)'), padding: 14 }}>
            <h3 style={{ marginTop: 0, color: 'var(--blue)' }}>Method</h3>
            <p style={{ fontSize: 13, lineHeight: 1.55 }}>
              For each consecutive pair of Riemann zeros
              {' '}<code>(gamma_k, gamma_(k+1))</code>{' '}
              we compute the <em>unfolded spacing</em>
            </p>
            <pre style={preStyle}>
{`s_k = (gamma_(k+1) - gamma_k) * (log(gamma_k / (2 * pi)) / (2 * pi))`}
            </pre>
            <p style={{ fontSize: 13, lineHeight: 1.55 }}>
              using the Riemann-von Mangoldt smooth density
              {' '}<code>rho(t) = (1 / (2 * pi)) * log(t / (2 * pi))</code>.
              By construction the mean unfolded spacing tends to 1, so
              distributions of <code>s_k</code> are directly comparable across
              different heights.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 0 }}>
              The empirical pdf is binned with {nBins} bins over <code>[0, {sMax.toFixed(1)}]</code>
              and the GUE Wigner surmise is evaluated at the bin centers. KL
              divergence and Hellinger distance are computed over the bin
              probability masses.
            </p>
          </div>
          <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), padding: 14 }}>
            <h3 style={{ marginTop: 0, color: 'var(--terra-dk)' }}>Interpretation</h3>
            <p style={{ fontSize: 13, lineHeight: 1.55 }}>
              The agreement is extraordinarily close. KL divergence
              {' '}<code>{D.klDivergence.toExponential(3)}</code>{' '}
              and Hellinger distance
              {' '}<code>{D.hellingerDistance.toFixed(4)}</code>{' '}
              are both well within the bounds expected of finite-sample noise at
              <code> N = {D.nZerosUsed.toLocaleString()}</code> zeros. The
              empirical histogram tracks the GUE Wigner curve including its
              quadratic small-<code>s</code> level repulsion and Gaussian-decay
              tail.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 0 }}>
              <strong>Scope:</strong> this is pure exploration. GUE
              universality of the Riemann zeros remains a conjecture; no rigorous
              proof exists. The visual agreement shown here is the well-known
              numerical signature first measured by Odlyzko and consistent with
              Montgomery&apos;s pair-correlation conjecture and the Rudnick-Sarnak
              theorem on higher correlations under suitable test-function
              restrictions.
            </p>
          </div>
        </div>

        {/* Source citation. */}
        <div style={{ marginTop: 16, fontSize: 11, color: 'var(--faint)', lineHeight: 1.6 }}>
          Browser data: pinned histogram snapshot derived offline from the first
          {' '}{D.nZerosUsed.toLocaleString()} Odlyzko zeros in ZEROS_EXTENDED
          (src/data/zeros-to-1e6.js) by GUE_VS_ZEROS_COMPARISON
          (src/data/gue-vs-zeros-comparison.js). This page does not import the
          raw zero corpus.
          Build-time tripwires: GUE_VS_ZEROS_COMPARISON_ASSERTIONS (7 checks,
          wired into scripts/run-assertions.mjs). Ticket: imp-1099.
        </div>

        {/* Related pages. */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Link to="/pair-correlation" style={{ color: 'var(--brass)', fontSize: 13 }}>Pair Correlation</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/statistics" style={{ color: 'var(--blue)', fontSize: 13 }}>Zero Statistics</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/edge-rigidity" style={{ color: 'var(--green)', fontSize: 13 }}>Edge Rigidity</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/angular-spacing-stats" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>Angular Spacing</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13 }}>&larr; the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small presentational components ─────────────────────────────────────────

function SummaryCard({ label, value, tone, hint }) {
  return (
    <div className="card" style={cardBaseLeft(tone)}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--ed-mono)', fontSize: 16, fontWeight: 700, color: tone, wordBreak: 'break-all' }}>
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4, lineHeight: 1.4 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

const preStyle = {
  background: 'var(--paper)',
  padding: '8px 10px',
  borderRadius: 6,
  fontSize: 11,
  fontFamily: 'var(--ed-mono)',
  color: 'var(--ink-soft)',
  overflowX: 'auto',
  border: '1px solid var(--hair2)',
  margin: '8px 0',
};
