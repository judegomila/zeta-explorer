// VoroninUniversalityPage -- imp-1100
//
// Interactive exploration of Voronin's universality theorem (1975):
// for any nonvanishing analytic f on a compact K in the strip
// 1/2 < Re(s) < 1 and any epsilon > 0, there exist arbitrarily large
// tau with sup_{s in K} |zeta(s + i*tau) - f(s)| < epsilon.
//
// The page consumes VORONIN_UNIVERSALITY from
// src/data/voronin-universality-numerical.js and renders:
//   - a target-function selector (3 entries from the data file),
//   - a sweep plot of sup-norm vs tau for the selected target,
//   - the per-target best-approximation summary (tau*, infNorm),
//   - a 5x5 heatmap of |zeta(s + i*tau*) - f(s)| at the optimal tau,
//     so the user can see where on K the approximation is tightest.
//
// Pure SVG + React. No external chart library.

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { VORONIN_UNIVERSALITY } from '../data/voronin-universality-numerical.js';
import { zetaCriticalStrip } from '../math/zeta.js';

// ---------------------------------------------------------------------------
// Geometry.
// ---------------------------------------------------------------------------

const SWEEP_W = 720;
const SWEEP_H = 320;
const SWEEP_M = { top: 28, right: 28, bottom: 44, left: 64 };
const SWEEP_IW = SWEEP_W - SWEEP_M.left - SWEEP_M.right;
const SWEEP_IH = SWEEP_H - SWEEP_M.top - SWEEP_M.bottom;

const HEAT_CELL = 64;
const HEAT_PAD = 60;
const HEAT_GRID = 5;
const HEAT_W = HEAT_PAD + HEAT_CELL * HEAT_GRID + 40;
const HEAT_H = HEAT_PAD + HEAT_CELL * HEAT_GRID + 80;

// ---------------------------------------------------------------------------
// Style helpers.
// ---------------------------------------------------------------------------

const monoLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fill: '#94a3b8',
};

const monoTick = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fill: '#94a3b8',
};

// Color ramp for the heatmap: smaller values = greener (good), larger = redder (bad).
function heatColor(value, vMin, vMax) {
  if (vMax - vMin < 1e-12) return 'rgb(120,120,120)';
  const t = Math.max(0, Math.min(1, (value - vMin) / (vMax - vMin)));
  // green -> yellow -> red ramp.
  const r = Math.round(255 * Math.min(1, 2 * t));
  const g = Math.round(255 * Math.min(1, 2 * (1 - t)));
  const b = 60;
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// ---------------------------------------------------------------------------
// Pre-build per-target sweep arrays from the frozen data.
// ---------------------------------------------------------------------------

function sweepForTarget(targetName) {
  const rows = VORONIN_UNIVERSALITY.searchResults.filter((r) => r.targetName === targetName);
  // already in tau-ascending order by construction in the data module.
  return rows;
}

// ---------------------------------------------------------------------------
// At the optimal tau* for a target, recompute |zeta(s + i*tau*) - f(s)| at
// each of the 25 grid points so we can draw the heatmap. The data module
// only stores the sup over the grid; recomputing 25 zeta evals is cheap
// (< 5 ms) so we do it client-side rather than blowing up the data file.
// ---------------------------------------------------------------------------

// Mirror of TARGET_DEFS.evaluate in the data module. Kept here because the
// data module only exports {name, definition}, not the evaluator (which
// would couple the data file to its render layer).
const TARGET_EVAL = {
  exp_s: (s) => {
    const r = Math.exp(s[0]);
    return [r * Math.cos(s[1]), r * Math.sin(s[1])];
  },
  poly_s2_plus_1: (s) => {
    const re = s[0] * s[0] - s[1] * s[1] + 1;
    const im = 2 * s[0] * s[1];
    return [re, im];
  },
  sin_s: (s) => {
    const re = Math.sin(s[0]) * Math.cosh(s[1]);
    const im = Math.cos(s[0]) * Math.sinh(s[1]);
    return [re, im];
  },
};

function heatmapAt(targetName, tau) {
  const f = TARGET_EVAL[targetName];
  if (!f) return null;
  const cells = VORONIN_UNIVERSALITY.K.points.map((p) => {
    const s = [p.re, p.im];
    const z = zetaCriticalStrip([p.re, p.im + tau], 50);
    const fv = f(s);
    const dre = z[0] - fv[0];
    const dim = z[1] - fv[1];
    return {
      re: p.re,
      im: p.im,
      diffMag: Math.sqrt(dre * dre + dim * dim),
    };
  });
  let vMin = Infinity, vMax = -Infinity;
  for (const c of cells) {
    if (c.diffMag < vMin) vMin = c.diffMag;
    if (c.diffMag > vMax) vMax = c.diffMag;
  }
  return { cells, vMin, vMax };
}

// ---------------------------------------------------------------------------
// Component.
// ---------------------------------------------------------------------------

export default function VoroninUniversalityPage() {
  const targets = VORONIN_UNIVERSALITY.targetFunctions;
  const [selectedName, setSelectedName] = useState(targets[0].name);
  const [customTauStr, setCustomTauStr] = useState('');

  const sweep = useMemo(() => sweepForTarget(selectedName), [selectedName]);
  const best = VORONIN_UNIVERSALITY.bestApproximation[selectedName];

  const tauMin = VORONIN_UNIVERSALITY.tauGrid.min;
  const tauMax = VORONIN_UNIVERSALITY.tauGrid.max;
  const parsedCustomTau = customTauStr === '' ? null : parseFloat(customTauStr);
  const activeTau = (parsedCustomTau !== null && !isNaN(parsedCustomTau) && parsedCustomTau >= tauMin && parsedCustomTau <= tauMax)
    ? parsedCustomTau
    : best.tauStar;
  const isCustomActive = activeTau !== best.tauStar;

  const heat = useMemo(() => heatmapAt(selectedName, activeTau), [selectedName, activeTau]);

  // Sweep axes.
  const tauValues = sweep.map((r) => r.tau);
  const infNorms = sweep.map((r) => r.infNorm);
  const sweepTauMin = Math.min(...tauValues);
  const sweepTauMax = Math.max(...tauValues);
  const yMaxRaw = Math.max(...infNorms);
  const yMax = yMaxRaw * 1.08;
  const yMin = 0;

  function sx(tau) {
    return SWEEP_M.left + ((tau - sweepTauMin) / (sweepTauMax - sweepTauMin)) * SWEEP_IW;
  }
  function sy(v) {
    return SWEEP_M.top + (1 - (v - yMin) / (yMax - yMin)) * SWEEP_IH;
  }

  // Polyline points for the sweep.
  const polyPoints = sweep.map((r) => sx(r.tau) + ',' + sy(r.infNorm)).join(' ');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Voronin Universality (imp-1100)</h1>
        <p className="page-subtitle">
          Numerical witness of Voronin&apos;s 1975 universality theorem: for any
          nonvanishing analytic f on a compact K in the critical strip, the
          vertical translates zeta(s + i*tau) approximate f arbitrarily well
          for arbitrarily large tau. We scan tau in [{VORONIN_UNIVERSALITY.tauGrid.min},{' '}
          {VORONIN_UNIVERSALITY.tauGrid.max}] step {VORONIN_UNIVERSALITY.tauGrid.step}{' '}
          and report sup_{'{s in K}'} |zeta(s + i*tau) - f(s)| on a{' '}
          {VORONIN_UNIVERSALITY.K.gridSize}x{VORONIN_UNIVERSALITY.K.gridSize} grid in
          [{VORONIN_UNIVERSALITY.K.sigmaRange[0]}, {VORONIN_UNIVERSALITY.K.sigmaRange[1]}] x
          [{VORONIN_UNIVERSALITY.K.imRange[0]}, {VORONIN_UNIVERSALITY.K.imRange[1]}].
          The global epsilon achieved over all targets is{' '}
          <strong style={{ color: '#86efac' }}>{VORONIN_UNIVERSALITY.epsilonAchieved.toFixed(4)}</strong>{' '}
          (target {VORONIN_UNIVERSALITY.epsilonAchievedTarget}, tau* ={' '}
          {VORONIN_UNIVERSALITY.epsilonAchievedTau}).
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            &larr; back to home
          </Link>
        </div>
      </div>

      {/* Target selector. */}
      <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#cbd5e1', marginBottom: 8 }}>
          Target function f(s):
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {targets.map((t) => {
            const isSel = t.name === selectedName;
            return (
              <button
                key={t.name}
                onClick={() => setSelectedName(t.name)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  cursor: 'pointer',
                  background: isSel ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
                  color: isSel ? '#e9d5ff' : '#cbd5e1',
                  border: '1px solid ' + (isSel ? '#a855f7' : 'var(--border)'),
                }}
              >
                {t.definition}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#94a3b8' }}>
          Best for <strong style={{ color: '#e9d5ff' }}>{best.targetName}</strong>:{' '}
          tau* = <strong style={{ color: '#86efac' }}>{best.tauStar}</strong>,{' '}
          sup-norm = <strong style={{ color: '#86efac' }}>{best.infNormAchieved.toFixed(4)}</strong>.
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1' }}>
            Custom tau (heatmap):
          </label>
          <input
            type="number"
            min={tauMin}
            max={tauMax}
            step={VORONIN_UNIVERSALITY.tauGrid.step}
            value={customTauStr}
            onChange={(e) => setCustomTauStr(e.target.value)}
            placeholder={"e.g. " + best.tauStar}
            style={{
              width: 110,
              padding: '4px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              background: 'rgba(255,255,255,0.06)',
              color: '#e2e8f0',
              border: '1px solid ' + (isCustomActive ? '#a855f7' : 'var(--border)'),
              borderRadius: 4,
            }}
          />
          {customTauStr !== '' && (
            <button
              onClick={() => setCustomTauStr('')}
              style={{
                padding: '4px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                color: '#94a3b8',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
            >
              reset to tau*
            </button>
          )}
          {isCustomActive && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a855f7' }}>
              showing tau = {activeTau}
            </span>
          )}
          {customTauStr !== '' && parsedCustomTau !== null && !isNaN(parsedCustomTau) && (parsedCustomTau < tauMin || parsedCustomTau > tauMax) && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#fb7185' }}>
              out of range [{tauMin}, {tauMax}] — using tau*
            </span>
          )}
        </div>
      </div>

      {/* Sweep plot. */}
      <div style={{ marginTop: 18, overflowX: 'auto', padding: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 6 }}>
          sup_{'{s in K}'} |zeta(s + i*tau) - f(s)| as a function of tau
        </div>
        <svg width={SWEEP_W} height={SWEEP_H} role="img" aria-label="Voronin sup-norm vs tau">
          {/* Axes. */}
          <line x1={SWEEP_M.left} y1={SWEEP_M.top} x2={SWEEP_M.left} y2={SWEEP_M.top + SWEEP_IH} stroke="#475569" strokeWidth={1} />
          <line x1={SWEEP_M.left} y1={SWEEP_M.top + SWEEP_IH} x2={SWEEP_M.left + SWEEP_IW} y2={SWEEP_M.top + SWEEP_IH} stroke="#475569" strokeWidth={1} />

          {/* X ticks. */}
          {[10, 200, 400, 600, 800, 1000].map((tau) => (
            <g key={'xt-' + tau}>
              <line x1={sx(tau)} y1={SWEEP_M.top + SWEEP_IH} x2={sx(tau)} y2={SWEEP_M.top + SWEEP_IH + 4} stroke="#475569" />
              <text x={sx(tau)} y={SWEEP_M.top + SWEEP_IH + 16} textAnchor="middle" style={monoTick}>{tau}</text>
            </g>
          ))}
          <text x={SWEEP_M.left + SWEEP_IW / 2} y={SWEEP_H - 6} textAnchor="middle" style={monoLabel}>tau (Im(s)-shift)</text>

          {/* Y ticks. */}
          {[0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5].filter((v) => v <= yMax).map((v) => (
            <g key={'yt-' + v}>
              <line x1={SWEEP_M.left - 4} y1={sy(v)} x2={SWEEP_M.left} y2={sy(v)} stroke="#475569" />
              <text x={SWEEP_M.left - 8} y={sy(v) + 3} textAnchor="end" style={monoTick}>{v.toFixed(2)}</text>
            </g>
          ))}
          <text transform={'translate(16,' + (SWEEP_M.top + SWEEP_IH / 2) + ') rotate(-90)'} textAnchor="middle" style={monoLabel}>
            sup_K |zeta - f|
          </text>

          {/* Horizontal guide at 1.0 (the assertion threshold). */}
          {1.0 <= yMax && (
            <line x1={SWEEP_M.left} y1={sy(1.0)} x2={SWEEP_M.left + SWEEP_IW} y2={sy(1.0)} stroke="#fb7185" strokeWidth={1} strokeDasharray="3,3" />
          )}

          {/* Sweep polyline. */}
          <polyline points={polyPoints} fill="none" stroke="#a855f7" strokeWidth={1.5} />

          {/* Best-tau marker. */}
          <g>
            <line x1={sx(best.tauStar)} y1={SWEEP_M.top} x2={sx(best.tauStar)} y2={SWEEP_M.top + SWEEP_IH} stroke="#86efac" strokeWidth={1} strokeDasharray="4,3" />
            <circle cx={sx(best.tauStar)} cy={sy(best.infNormAchieved)} r={5} fill="#86efac" stroke="#0f172a" strokeWidth={1.5} />
            <text x={sx(best.tauStar) + 8} y={sy(best.infNormAchieved) - 8} style={{ ...monoLabel, fill: '#86efac' }}>
              tau* = {best.tauStar}, inf = {best.infNormAchieved.toFixed(3)}
            </text>
          </g>

          {/* Custom-tau marker (only when active). */}
          {isCustomActive && (
            <line x1={sx(activeTau)} y1={SWEEP_M.top} x2={sx(activeTau)} y2={SWEEP_M.top + SWEEP_IH} stroke="#a855f7" strokeWidth={1.5} strokeDasharray="6,3" />
          )}
        </svg>
      </div>

      {/* Heatmap at active tau (optimal tau* or custom input). */}
      <div style={{ marginTop: 18, padding: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 6 }}>
          5x5 grid heatmap of |zeta(s + i*tau) - f(s)| at tau = {activeTau}
          {isCustomActive ? (
            <span style={{ color: '#a855f7', marginLeft: 8 }}>(custom)</span>
          ) : (
            <span style={{ color: '#86efac', marginLeft: 8 }}>(optimal tau*)</span>
          )}
        </div>
        {heat ? (
          <svg width={HEAT_W} height={HEAT_H} role="img" aria-label="Voronin heatmap at optimal tau">
            {/* Cells. */}
            {heat.cells.map((c, i) => {
              const col = Math.round((c.re - VORONIN_UNIVERSALITY.K.sigmaRange[0])
                / (VORONIN_UNIVERSALITY.K.sigmaRange[1] - VORONIN_UNIVERSALITY.K.sigmaRange[0])
                * (HEAT_GRID - 1));
              const row = Math.round((c.im - VORONIN_UNIVERSALITY.K.imRange[0])
                / (VORONIN_UNIVERSALITY.K.imRange[1] - VORONIN_UNIVERSALITY.K.imRange[0])
                * (HEAT_GRID - 1));
              const x = HEAT_PAD + col * HEAT_CELL;
              // invert y so larger Im is upward visually.
              const y = HEAT_PAD + (HEAT_GRID - 1 - row) * HEAT_CELL;
              return (
                <g key={'cell-' + i}>
                  <rect x={x} y={y} width={HEAT_CELL - 2} height={HEAT_CELL - 2}
                        fill={heatColor(c.diffMag, heat.vMin, heat.vMax)} stroke="#0f172a" strokeWidth={1} />
                  <text x={x + (HEAT_CELL - 2) / 2} y={y + (HEAT_CELL - 2) / 2 + 4}
                        textAnchor="middle"
                        style={{ ...monoTick, fill: '#0f172a', fontWeight: 700 }}>
                    {c.diffMag.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Axis labels: sigma along bottom, im along left. */}
            {Array.from({ length: HEAT_GRID }, (_, i) => {
              const sigma = VORONIN_UNIVERSALITY.K.sigmaRange[0]
                + (VORONIN_UNIVERSALITY.K.sigmaRange[1] - VORONIN_UNIVERSALITY.K.sigmaRange[0]) * i / (HEAT_GRID - 1);
              return (
                <text key={'sx-' + i}
                      x={HEAT_PAD + i * HEAT_CELL + (HEAT_CELL - 2) / 2}
                      y={HEAT_PAD + HEAT_GRID * HEAT_CELL + 14}
                      textAnchor="middle" style={monoTick}>{sigma.toFixed(2)}</text>
              );
            })}
            <text x={HEAT_PAD + (HEAT_GRID * HEAT_CELL) / 2}
                  y={HEAT_PAD + HEAT_GRID * HEAT_CELL + 32}
                  textAnchor="middle" style={monoLabel}>Re(s)</text>

            {Array.from({ length: HEAT_GRID }, (_, i) => {
              const im = VORONIN_UNIVERSALITY.K.imRange[0]
                + (VORONIN_UNIVERSALITY.K.imRange[1] - VORONIN_UNIVERSALITY.K.imRange[0]) * i / (HEAT_GRID - 1);
              const y = HEAT_PAD + (HEAT_GRID - 1 - i) * HEAT_CELL + (HEAT_CELL - 2) / 2 + 4;
              return (
                <text key={'iy-' + i} x={HEAT_PAD - 8} y={y} textAnchor="end" style={monoTick}>{im.toFixed(2)}</text>
              );
            })}
            <text transform={'translate(16,' + (HEAT_PAD + (HEAT_GRID * HEAT_CELL) / 2) + ') rotate(-90)'}
                  textAnchor="middle" style={monoLabel}>Im(s)</text>

            {/* Colorbar label. */}
            <text x={HEAT_PAD} y={HEAT_PAD - 12} style={monoLabel}>
              min = {heat.vMin.toFixed(3)}   max = {heat.vMax.toFixed(3)}   (green = closer)
            </text>
          </svg>
        ) : (
          <div style={{ color: '#fb7185', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            heatmap evaluator unavailable
          </div>
        )}
      </div>

      {/* Per-target summary table. */}
      <div style={{ marginTop: 18, padding: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', marginBottom: 8 }}>
          Best approximation per target (over tau in [{VORONIN_UNIVERSALITY.tauGrid.min}, {VORONIN_UNIVERSALITY.tauGrid.max}])
        </div>
        <table style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#cbd5e1', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>target</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>f(s)</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>tau*</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>sup-norm achieved</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>max |f| on K</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t) => {
              const r = VORONIN_UNIVERSALITY.bestApproximation[t.name];
              const maxF = VORONIN_UNIVERSALITY.targetGridMagnitudes[t.name];
              return (
                <tr key={t.name} style={{ borderBottom: '1px solid rgba(71,85,105,0.3)' }}>
                  <td style={{ padding: '6px 8px', color: '#e9d5ff' }}>{t.name}</td>
                  <td style={{ padding: '6px 8px' }}>{t.definition}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.tauStar}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#86efac' }}>{r.infNormAchieved.toFixed(4)}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right' }}>{maxF.toFixed(3)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8', lineHeight: 1.6 }}>
          Honest scope: tau in [{VORONIN_UNIVERSALITY.tauGrid.min}, {VORONIN_UNIVERSALITY.tauGrid.max}] step{' '}
          {VORONIN_UNIVERSALITY.tauGrid.step} is a finite window. Voronin&apos;s theorem
          guarantees that for any epsilon &gt; 0 (no matter how small) the set of
          good tau has positive lower density -- extending the search would
          drive the sup-norm arbitrarily low. K extends below the strict
          Voronin strip (1/2 &lt; sigma &lt; 1) to 1/4 for visualisation purposes;
          the epsilon witness is reported as an empirical observation, not as
          evidence for the strict-strip statement.
        </div>
      </div>
    </div>
  );
}
