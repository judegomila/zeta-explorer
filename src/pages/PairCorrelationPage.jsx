// PairCorrelationPage - imp-1098
//
// Numerical visualization of the Montgomery-Dyson pair correlation conjecture:
// compare the empirical pair correlation form factor F_N(alpha) of the first
// N = 1000 Odlyzko zeros against the GUE prediction 1 - (sin(pi*alpha)/(pi*alpha))^2.
//
// Two stacked plots:
//   (top)    empirical F_N(alpha) vs GUE 1 - sinc^2 overlay
//   (bottom) residual F_N(alpha) - F_GUE(alpha) with horizontal zero line
//
// Pure SVG + React; d3-scale used for the linear axes.

import React from 'react';
import { Link } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { PAIR_CORRELATION_MONTGOMERY } from '../data/pair-correlation-montgomery-numerical.js';
import { IMP_2656_DIRECT_RH_CONJECTURE_MAP } from '../data/imp-2656-direct-rh-conjecture-map.js';
import RelatedLinks from '../components/RelatedLinks.jsx';

// Geometry.
const W = 920;
const H_TOP = 360;
const H_BOT = 200;
const M = { top: 36, right: 32, bottom: 36, left: 60 };
const IW = W - M.left - M.right;
const IH_TOP = H_TOP - M.top - M.bottom;
const IH_BOT = H_BOT - M.top - M.bottom;

const ALPHA_LO = -3;
const ALPHA_HI = 3;
const F_LO = 0;
const F_HI = 1.3;
const R_LO = -0.25;
const R_HI = 0.25;

const COLORS = {
  empirical: '#22d3ee',
  gue: '#a855f7',
  residual: '#f59e0b',
  zero: '#475569',
  grid: 'rgba(148, 163, 184, 0.18)',
  axis: '#94a3b8',
  text: '#cbd5e1',
};

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fill: COLORS.text,
};

const tickStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fill: COLORS.axis,
};

function buildPath(xs, ys, xScale, yScale) {
  let d = '';
  for (let i = 0; i < xs.length; i++) {
    const cmd = i === 0 ? 'M' : 'L';
    d += cmd + xScale(xs[i]).toFixed(2) + ',' + yScale(ys[i]).toFixed(2) + ' ';
  }
  return d.trim();
}

function pill(color, text) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      background: 'rgba(255,255,255,0.04)',
      color,
      border: '1px solid ' + color + '40',
      marginRight: 6,
    }}>{text}</span>
  );
}

export default function PairCorrelationPage() {
  const pcm = PAIR_CORRELATION_MONTGOMERY;
  const xs = pcm.alphaGrid;
  const yEmp = pcm.empiricalF;
  const yGue = pcm.gueF;
  const yRes = pcm.residual;

  const xTop = scaleLinear().domain([ALPHA_LO, ALPHA_HI]).range([0, IW]);
  const yTop = scaleLinear().domain([F_LO, F_HI]).range([IH_TOP, 0]);
  const xBot = scaleLinear().domain([ALPHA_LO, ALPHA_HI]).range([0, IW]);
  const yBot = scaleLinear().domain([R_LO, R_HI]).range([IH_BOT, 0]);

  const xTicks = [-3, -2, -1, 0, 1, 2, 3];
  const yTopTicks = [0, 0.25, 0.5, 0.75, 1.0, 1.25];
  const yBotTicks = [-0.25, -0.125, 0, 0.125, 0.25];

  const pathEmp = buildPath(xs, yEmp, xTop, yTop);
  const pathGue = buildPath(xs, yGue, xTop, yTop);
  const pathRes = buildPath(xs, yRes, xBot, yBot);

  // imp-2932: residual fit statistics split by the Montgomery-proved band
  // (|alpha| < 1, where the form factor is a theorem) vs the open band
  // (|alpha| > 1, finite-N numerical only), plus the global L2 residual norm.
  let maxResInside = 0;
  let maxResOutside = 0;
  let sumSqRes = 0;
  for (let i = 0; i < xs.length; i++) {
    const r = Math.abs(yRes[i]);
    if (Math.abs(xs[i]) < 1) {
      if (r > maxResInside) maxResInside = r;
    } else if (r > maxResOutside) {
      maxResOutside = r;
    }
    sumSqRes += yRes[i] * yRes[i];
  }
  const l2ResidualNorm = Math.sqrt(sumSqRes);

  const metricColor = pcm.agreementMetric === 'matches-montgomery-1973'
    ? '#34d399'
    : (pcm.agreementMetric === 'qualitative-agreement-finite-N' ? '#facc15' : '#f87171');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pair Correlation Conjecture (imp-1098)</h1>
        <p className="page-subtitle">
          Montgomery-Dyson numerical exploration: empirical pair correlation
          form factor F_N(alpha) of the first N = {pcm.N} Odlyzko Riemann
          zeros vs the GUE prediction 1 - (sin(pi*alpha) / (pi*alpha))^2 on
          the alpha grid [-3, 3] step 0.05.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            &larr; home
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 16,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 14,
      }}>
        <div style={{ marginBottom: 10 }}>
          {pill(COLORS.empirical, 'empirical F_N (smoothed)')}
          {pill(COLORS.gue, 'GUE 1 - sinc^2')}
          {pill(COLORS.residual, 'residual')}
          {pill(metricColor, 'KS = ' + pcm.kolmogorovDistance.toFixed(4) + ' (' + pcm.agreementMetric + ')')}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={H_TOP} role="img" aria-label="Empirical pair correlation vs GUE">
            <g transform={'translate(' + M.left + ',' + M.top + ')'}>
              {/* Montgomery PCC obstruction band: |alpha| > 1. Montgomery 1973
                  proved the form factor only for Fourier support in (-1, 1)
                  (i.e. |alpha| < 1); the pointwise sine-kernel needed by ESY
                  Route 1 lives at |alpha| ~ log N >> 1, where it is OPEN. The
                  shaded wings are exactly where the obstruction bites. */}
              <rect x={0} y={0} width={xTop(-1)} height={IH_TOP}
                    fill="rgba(239, 68, 68, 0.10)" />
              <rect x={xTop(1)} y={0} width={IW - xTop(1)} height={IH_TOP}
                    fill="rgba(239, 68, 68, 0.10)" />
              <text x={xTop(2)} y={IH_TOP - 8} textAnchor="middle"
                    style={{ ...tickStyle, fill: '#f87171', fontSize: 9 }}>
                PCC obstruction (Route 1, OPEN)
              </text>
              <text x={xTop(-2)} y={IH_TOP - 8} textAnchor="middle"
                    style={{ ...tickStyle, fill: '#f87171', fontSize: 9 }}>
                PCC obstruction (Route 1, OPEN)
              </text>
              {/* Background grid (horizontal). */}
              {yTopTicks.map((t) => (
                <line key={'gT-' + t}
                      x1={0} y1={yTop(t)} x2={IW} y2={yTop(t)}
                      stroke={COLORS.grid} strokeWidth={1} />
              ))}
              {/* Vertical grid at integer alpha. */}
              {xTicks.map((t) => (
                <line key={'gTx-' + t}
                      x1={xTop(t)} y1={0} x2={xTop(t)} y2={IH_TOP}
                      stroke={COLORS.grid} strokeWidth={1} />
              ))}

              {/* GUE curve (drawn first, behind empirical). */}
              <path d={pathGue} stroke={COLORS.gue} strokeWidth={2} fill="none"
                    strokeLinejoin="round" />
              {/* Empirical curve. */}
              <path d={pathEmp} stroke={COLORS.empirical} strokeWidth={1.8}
                    fill="none" strokeLinejoin="round" opacity={0.95} />

              {/* alpha = 1 vertical guide: Montgomery proved regime boundary. */}
              <line x1={xTop(1)} y1={0} x2={xTop(1)} y2={IH_TOP}
                    stroke="#facc15" strokeWidth={1} strokeDasharray="4,4" opacity={0.55} />
              <line x1={xTop(-1)} y1={0} x2={xTop(-1)} y2={IH_TOP}
                    stroke="#facc15" strokeWidth={1} strokeDasharray="4,4" opacity={0.55} />
              <text x={xTop(1) + 4} y={14} style={{ ...tickStyle, fill: '#facc15' }}>
                alpha = 1 (Montgomery proved)
              </text>

              {/* Y-axis labels. */}
              {yTopTicks.map((t) => (
                <text key={'yT-' + t} x={-8} y={yTop(t) + 3} textAnchor="end" style={tickStyle}>
                  {t.toFixed(2)}
                </text>
              ))}
              {/* X-axis labels. */}
              {xTicks.map((t) => (
                <text key={'xT-' + t} x={xTop(t)} y={IH_TOP + 14} textAnchor="middle" style={tickStyle}>
                  {t}
                </text>
              ))}

              {/* Axes. */}
              <line x1={0} y1={IH_TOP} x2={IW} y2={IH_TOP} stroke={COLORS.axis} strokeWidth={1.2} />
              <line x1={0} y1={0} x2={0} y2={IH_TOP} stroke={COLORS.axis} strokeWidth={1.2} />
              <text x={IW / 2} y={IH_TOP + 30} textAnchor="middle" style={labelStyle}>
                normalized pair-spacing alpha
              </text>
              <text x={-38} y={IH_TOP / 2} textAnchor="middle"
                    transform={'rotate(-90,' + (-38) + ',' + (IH_TOP / 2) + ')'}
                    style={labelStyle}>
                F_N(alpha)
              </text>
            </g>
          </svg>

          <svg width={W} height={H_BOT} role="img" aria-label="Residual F_N - F_GUE">
            <g transform={'translate(' + M.left + ',' + M.top + ')'}>
              {/* Horizontal grid + zero line. */}
              {yBotTicks.map((t) => (
                <line key={'gB-' + t}
                      x1={0} y1={yBot(t)} x2={IW} y2={yBot(t)}
                      stroke={t === 0 ? COLORS.axis : COLORS.grid}
                      strokeWidth={t === 0 ? 1.2 : 1}
                      strokeDasharray={t === 0 ? '' : '2,3'} />
              ))}
              {/* Vertical grid. */}
              {xTicks.map((t) => (
                <line key={'gBx-' + t}
                      x1={xBot(t)} y1={0} x2={xBot(t)} y2={IH_BOT}
                      stroke={COLORS.grid} strokeWidth={1} />
              ))}

              {/* Residual curve. */}
              <path d={pathRes} stroke={COLORS.residual} strokeWidth={1.8} fill="none"
                    strokeLinejoin="round" />

              {/* KS argmax marker. */}
              <line x1={xBot(pcm.kolmogorovDistanceArgmax)} y1={0}
                    x2={xBot(pcm.kolmogorovDistanceArgmax)} y2={IH_BOT}
                    stroke={metricColor} strokeWidth={1} strokeDasharray="3,3" opacity={0.7} />
              <text x={xBot(pcm.kolmogorovDistanceArgmax) + 4} y={12}
                    style={{ ...tickStyle, fill: metricColor }}>
                KS argmax alpha = {pcm.kolmogorovDistanceArgmax.toFixed(2)}
              </text>

              {/* Y labels. */}
              {yBotTicks.map((t) => (
                <text key={'yB-' + t} x={-8} y={yBot(t) + 3} textAnchor="end" style={tickStyle}>
                  {t.toFixed(3)}
                </text>
              ))}
              {/* X labels. */}
              {xTicks.map((t) => (
                <text key={'xB-' + t} x={xBot(t)} y={IH_BOT + 14} textAnchor="middle" style={tickStyle}>
                  {t}
                </text>
              ))}

              {/* Axes. */}
              <line x1={0} y1={IH_BOT} x2={IW} y2={IH_BOT} stroke={COLORS.axis} strokeWidth={1.2} />
              <line x1={0} y1={0} x2={0} y2={IH_BOT} stroke={COLORS.axis} strokeWidth={1.2} />
              <text x={IW / 2} y={IH_BOT + 30} textAnchor="middle" style={labelStyle}>
                alpha
              </text>
              <text x={-38} y={IH_BOT / 2} textAnchor="middle"
                    transform={'rotate(-90,' + (-38) + ',' + (IH_BOT / 2) + ')'}
                    style={labelStyle}>
                F_N - F_GUE
              </text>
            </g>
          </svg>
        </div>

        <div style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          <div style={{ padding: 10, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>KS sup-norm</div>
            <div style={{ fontSize: 22, color: metricColor, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {pcm.kolmogorovDistance.toFixed(4)}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              restricted to |alpha| &le; 1
            </div>
          </div>
          <div style={{ padding: 10, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>local pairs counted</div>
            <div style={{ fontSize: 22, color: COLORS.text, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {pcm.totalPairsCounted.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              window |j - k| &le; {pcm.K_WINDOW}
            </div>
          </div>
          <div style={{ padding: 10, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>agreement metric</div>
            <div style={{ fontSize: 14, color: metricColor, fontFamily: 'var(--font-mono)', fontWeight: 700, lineHeight: 1.3 }}>
              {pcm.agreementMetric}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              strict &lt; {pcm.agreementThresholdStrict}, qual &lt; {pcm.agreementThresholdQualitative}
            </div>
          </div>
          <div style={{ padding: 10, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>raw mean spacing</div>
            <div style={{ fontSize: 22, color: COLORS.text, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {pcm.meanSpacingRaw.toFixed(4)}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              rescaled to 1 before binning
            </div>
          </div>
        </div>

        {/* imp-2932: residual-statistics summary split by the Montgomery-proved
            band (|alpha| < 1) and the open band (|alpha| > 1), plus the global
            L2 residual norm. Quantifies the fit the shaded wings illustrate. */}
        <div style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}>
          <div style={{ padding: 10, background: 'rgba(34, 197, 94, 0.06)', borderRadius: 6, border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>max |residual|, |alpha| &lt; 1</div>
            <div style={{ fontSize: 22, color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {maxResInside.toFixed(4)}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              Montgomery-proved regime
            </div>
          </div>
          <div style={{ padding: 10, background: 'rgba(245, 158, 11, 0.06)', borderRadius: 6, border: '1px solid rgba(245,158,11,0.3)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>max |residual|, |alpha| &gt; 1</div>
            <div style={{ fontSize: 22, color: '#facc15', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {maxResOutside.toFixed(4)}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              open regime (finite-N only)
            </div>
          </div>
          <div style={{ padding: 10, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>L2 residual norm</div>
            <div style={{ fontSize: 22, color: COLORS.text, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {l2ResidualNorm.toFixed(4)}
            </div>
            <div style={{ fontSize: 10, color: COLORS.axis, fontFamily: 'var(--font-mono)' }}>
              over full grid [-3, 3]
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#facc15', lineHeight: 1.5, marginTop: 10, marginBottom: 0, fontFamily: 'var(--font-mono)' }}>
          Note: agreement for |alpha| &gt; 1 is finite-N numerical only
          (agreementMetric = {pcm.agreementMetric}); Montgomery 1973 proves the
          form factor identity only for Fourier support |alpha| &lt; 1.
        </p>
      </div>

      <div style={{
        marginTop: 16,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 14,
      }}>
        <h3 style={{ marginTop: 0, color: '#7dd3fc', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          Honest finite-N caveat
        </h3>
        <ul style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.55 }}>
          {pcm.honestScopeNotes.map((note, i) => (
            <li key={'note-' + i} style={{ marginBottom: 8 }}>{note}</li>
          ))}
        </ul>

        <h3 style={{ color: '#7dd3fc', fontFamily: 'var(--font-mono)', fontSize: 14, marginTop: 18 }}>
          References
        </h3>
        <ul style={{ fontSize: 12, color: COLORS.axis, lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
          {pcm.references.map((ref, i) => (
            <li key={'ref-' + i} style={{ marginBottom: 6 }}>{ref}</li>
          ))}
        </ul>
      </div>

      {/* Strategic obstruction panel: WHERE the shared PCC blocker bites and
          which direct-RH stream it does (and does not) stall. Grounds the
          imp-2656 conjecture-map visually against the shaded |alpha| > 1 band
          above. */}
      <div style={{
        marginTop: 16,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 14,
      }}>
        <h3 style={{ marginTop: 0, color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          Where the Montgomery PCC obstruction bites (imp-2656)
        </h3>
        <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.55 }}>
          The shaded wings <code>|alpha| &gt; 1</code> mark the
          {' '}<strong>Montgomery PCC obstruction region</strong>. Montgomery
          1973 proved the form factor only for Fourier support in
          {' '}<code>(-1, 1)</code>; the pointwise sine-kernel
          {' '}<code>rho_2 = 1 - K_sin^2</code> needed by ESY Route 1 lives at
          microscopic Fourier extent <code>~ log N &gt;&gt; 1</code>, deep in
          the shaded band, where the identity remains OPEN.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
          marginTop: 10,
        }}>
          <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.06)', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: 11, color: '#f87171', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4 }}>
              Stream A — Lambda-bound (PCC-BLOCKED)
            </div>
            <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>
              {IMP_2656_DIRECT_RH_CONJECTURE_MAP.montgomeryPccObstruction.scopeOfBlock}
            </div>
          </div>
          <div style={{ padding: 10, background: 'rgba(34, 197, 94, 0.06)', borderRadius: 6, border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ fontSize: 11, color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4 }}>
              Stream B — direct-RH via 27.2 (PCC-INDEPENDENT)
            </div>
            <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>
              {IMP_2656_DIRECT_RH_CONJECTURE_MAP.strategicRecommendation.streamSeparation}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: COLORS.axis, lineHeight: 1.5, marginTop: 12, marginBottom: 0, fontFamily: 'var(--font-mono)' }}>
          Closest novel target:
          {' '}{IMP_2656_DIRECT_RH_CONJECTURE_MAP.independentNovelRanking[0].shortName}
          {' '}(closeness {IMP_2656_DIRECT_RH_CONJECTURE_MAP.independentNovelRanking[0].closenessScore.toFixed(2)},
          PCC-blocked = {String(IMP_2656_DIRECT_RH_CONJECTURE_MAP.independentNovelRanking[0].blockedByMontgomeryPCC)}).
          Source: IMP_2656_DIRECT_RH_CONJECTURE_MAP (src/data/imp-2656-direct-rh-conjecture-map.js).
        </p>
      </div>

      <RelatedLinks links={[
        { to: '/statistics', label: 'Zero Statistics' },
        { to: '/gue-comparison', label: 'GUE Comparison' },
        { to: '/edge-rigidity', label: 'Edge Rigidity' },
        { to: '/gram-points', label: 'Gram Points' },
      ]} />
    </div>
  );
}
