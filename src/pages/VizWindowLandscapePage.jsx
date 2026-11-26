import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath } from '../components/editorial/PostLayout.jsx';
import {
  W1_LANDSCAPE_META,
  PILOT_S0,
  E97_S0,
  PILOT_S1,
  E97_S1,
  ZOOM_W0,
  ZOOM_W1,
  ZOOM_PILOT_S0,
  ZOOM_E97_S0,
} from '../data/viz-window1-landscape-data.js';
import { CERTIFIED_SLICE } from '../data/imp-95213-tier-certifier-build.js';
import { ED } from '../styles/tokens.js';

/* /viz-window-landscape — the REAL first-window landscape. ACCURACY RULE:
   every plotted sample is a real dd evaluation of the frozen Gate-2 spec
   (eq-13 telescope verified at every point): the main curves are a
   max-preserving downsample of the deterministic 300,001-point pilotg3 grid
   (regenerated with the identical evaluator and gated on bit-exact
   reproduction of the recorded grid sups), drawn as per-bin min–max envelopes
   so no pixel interpolates; the zoom inset is a raw, unbinned 2,001-point
   stretch. Grade: sampled measurement. Only the shaded tier slice is
   interval-certified. See viz-window1-landscape-data.js for full provenance. */

const W = 920;
const H = 430;
const PAD = { l: 60, r: 16, t: 14, b: 40 };
const CW = W - PAD.l - PAD.r;
const CH = H - PAD.t - PAD.b;
const VMAX = 0.3;

const xOfW = (w) => PAD.l + CW * w;
const yOfV = (v) => PAD.t + CH * (1 - v / VMAX);

// envelope polygon (bin max forward, bin min backward) + max line
function envelopePaths(series) {
  const up = series.W.map((w, i) => `${xOfW(w).toFixed(1)},${yOfV(series.MX[i]).toFixed(2)}`);
  const dn = series.W.map((w, i) => `${xOfW(w).toFixed(1)},${yOfV(series.MN[i]).toFixed(2)}`).reverse();
  return {
    band: `M ${up.join(' L ')} L ${dn.join(' L ')} Z`,
    maxLine: `M ${up.join(' L ')}`,
  };
}

const COLORS = { pilot: ED.series1, e97: ED.series2 };

export default function VizWindowLandscapePage() {
  const [side, setSide] = useState(0);
  const meta = W1_LANDSCAPE_META;
  const rex = meta.rexExact;

  const paths = useMemo(
    () => ({
      0: { pilot: envelopePaths(PILOT_S0), e97: envelopePaths(E97_S0) },
      1: { pilot: envelopePaths(PILOT_S1), e97: envelopePaths(E97_S1) },
    }),
    []
  );

  // zoom inset geometry (raw stretch, x-unit offsets from the witness)
  const ZW = 920;
  const ZH = 250;
  const ZPAD = { l: 60, r: 16, t: 12, b: 36 };
  const X_PER_W = 4 * Math.PI * (2 * meta.N + 1); // ≈ 1.7367e7 x-units per unit w
  const wStar = meta.supPilot.w;
  const zx = (i) => {
    const w = ZOOM_W0 + ((ZOOM_W1 - ZOOM_W0) * i) / (ZOOM_PILOT_S0.length - 1);
    return ZPAD.l + (ZW - ZPAD.l - ZPAD.r) * ((w - ZOOM_W0) / (ZOOM_W1 - ZOOM_W0));
  };
  const zXUnits = (w) => (w - wStar) * X_PER_W;
  const zVLo = 0.0;
  const zVHi = 0.26;
  const zy = (v) => ZPAD.t + (ZH - ZPAD.t - ZPAD.b) * (1 - (v - zVLo) / (zVHi - zVLo));
  const zoomPaths = useMemo(
    () => ({
      pilot: `M ${ZOOM_PILOT_S0.map((v, i) => `${zx(i).toFixed(1)},${zy(v).toFixed(2)}`).join(' L ')}`,
      e97: `M ${ZOOM_E97_S0.map((v, i) => `${zx(i).toFixed(1)},${zy(v).toFixed(2)}`).join(' L ')}`,
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const p = paths[side];

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>window 1 of 54,109,012 · 600,002 dd evaluations · sampled measurement, slice-certified only</span>} />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">idea geometry · 2 of 3</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 36, lineHeight: 1.12, margin: '6px 0 12px', color: 'var(--ink)' }}>
          The Real First-Window Landscape
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '58rem', lineHeight: 1.6 }}>
          What the Gate-2 residual actually looks like on the complete first window (N = 690988,{' '}
          <InlineMath tex="x = 4\pi(N^2 - t_0/16 + w(2N+1))" />, w ∈ [0, 1]): the defect-telescope pilot{' '}
          <InlineMath tex="\sum_j |D_j|(w)" /> and the cocycle <InlineMath tex="|E_{97}|(w)" /> from the imp-95205
          pilot grid — 300,001 points per seam chart, telescope identity verified to 8×10⁻¹⁴ at every evaluation.
          Curves are drawn as per-bin min–max envelopes of a <strong>max-preserving</strong> downsample (3,000 bins;
          every local maximum shown is a real sample, and the plotted sups equal the full-grid sups exactly).
        </p>

        {/* seam-chart toggle */}
        <div style={{ display: 'flex', gap: 8, margin: '4px 0 10px' }}>
          {[0, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className="ed-mono"
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                border: `1.5px solid ${side === s ? 'var(--terra-dk)' : 'var(--hairline)'}`,
                background: side === s ? 'var(--paper3)' : 'var(--paper2)',
                color: side === s ? 'var(--terra-dk)' : 'var(--ink-soft)',
              }}
            >
              seam chart {s === 0 ? '690988 (own)' : '690989 (cross)'}
            </button>
          ))}
          <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', alignSelf: 'center' }}>
            the two charts agree to ~10⁻⁵ at every bin — the seam consistency the spec requires
          </span>
        </div>

        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img"
            aria-label="Window-1 landscape: pilot and |E97| versus w with the Rex line, sup witnesses, and the certified slice">
            {/* axes */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((w) => (
              <g key={`ax${w}`}>
                <line x1={xOfW(w)} y1={H - PAD.b} x2={xOfW(w)} y2={H - PAD.b + 5} stroke="var(--faint)" />
                <text x={xOfW(w)} y={H - PAD.b + 17} textAnchor="middle" style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">{w.toFixed(1)}</text>
              </g>
            ))}
            {[0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3].map((v) => (
              <g key={`ay${v}`}>
                <line x1={PAD.l - 5} y1={yOfV(v)} x2={PAD.l} y2={yOfV(v)} stroke="var(--faint)" />
                <text x={PAD.l - 8} y={yOfV(v) + 3.5} textAnchor="end" style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">{v.toFixed(2)}</text>
              </g>
            ))}
            <text x={PAD.l + CW / 2} y={H - 6} textAnchor="middle" style={{ font: '600 11px "IBM Plex Mono", monospace' }} fill="var(--ink-soft)">w (window coordinate)</text>

            {/* certified tier slice */}
            <rect
              x={xOfW(CERTIFIED_SLICE.wLo)}
              y={PAD.t}
              width={Math.max(2.5, xOfW(CERTIFIED_SLICE.wHi) - xOfW(CERTIFIED_SLICE.wLo))}
              height={CH}
              fill={ED.series3}
              opacity="0.22"
            />
            <text x={xOfW(CERTIFIED_SLICE.wHi) + 6} y={H - PAD.b - 10} style={{ font: '600 9.5px "IBM Plex Mono", monospace' }} fill={ED.series3} stroke={ED.paper} strokeWidth="3" paintOrder="stroke">
              ↑ interval-CERTIFIED slice u ∈ [{CERTIFIED_SLICE.uLo}, {CERTIFIED_SLICE.uHi}] — 0.058% of the window, both charts, 6.7e6 Taylor cells, 0 failures
            </text>

            {/* Rex line */}
            <line x1={PAD.l} y1={yOfV(rex)} x2={W - PAD.r} y2={yOfV(rex)} stroke="var(--ink)" strokeWidth="1.4" strokeDasharray="6 4" />
            <text x={W - PAD.r - 4} y={yOfV(rex) - 5} textAnchor="end" style={{ font: '600 10.5px "IBM Plex Mono", monospace' }} fill="var(--ink)" stroke={ED.paper} strokeWidth="3" paintOrder="stroke">
              Rex = {rex} (eq. 19 — the strict target every sample must stay below)
            </text>

            {/* envelopes + max lines */}
            <path d={p.pilot.band} fill={COLORS.pilot} opacity="0.28" />
            <path d={p.pilot.maxLine} fill="none" stroke={COLORS.pilot} strokeWidth="1" opacity="0.9" />
            <path d={p.e97.band} fill={COLORS.e97} opacity="0.26" />
            <path d={p.e97.maxLine} fill="none" stroke={COLORS.e97} strokeWidth="1" opacity="0.9" />

            {/* sup witnesses (zoom-refined literals from the pilot JSON) */}
            <g>
              <circle cx={xOfW(meta.supPilot.w)} cy={yOfV(meta.supPilot.value)} r="4" fill="none" stroke={COLORS.pilot} strokeWidth="2" />
              <text x={xOfW(meta.supPilot.w) - 9} y={yOfV(meta.supPilot.value) - 18} textAnchor="end" style={{ font: '600 10px "IBM Plex Mono", monospace' }} fill={COLORS.pilot} stroke={ED.paper} strokeWidth="3" paintOrder="stroke">
                sup Σ|D_j| = {meta.supPilot.value} — margin 12.8%
              </text>
              <text x={xOfW(meta.supPilot.w) - 9} y={yOfV(meta.supPilot.value) - 6} textAnchor="end" style={{ font: '600 9.5px "IBM Plex Mono", monospace' }} fill={COLORS.pilot} stroke={ED.paper} strokeWidth="3" paintOrder="stroke">
                (zoom-refined; w = {meta.supPilot.w}, side 0)
              </text>
              <circle cx={xOfW(meta.supE97.w)} cy={yOfV(meta.supE97.value)} r="4" fill="none" stroke={COLORS.e97} strokeWidth="2" />
              <text x={xOfW(meta.supE97.w) + 10} y={yOfV(0.222)} style={{ font: '600 10px "IBM Plex Mono", monospace' }} fill={COLORS.e97} stroke={ED.paper} strokeWidth="3" paintOrder="stroke">
                sup |E97| = {meta.supE97.value} — margin 30.8%
              </text>
              <text x={xOfW(meta.supE97.w) + 10} y={yOfV(0.222) + 12} style={{ font: '600 9.5px "IBM Plex Mono", monospace' }} fill={COLORS.e97} stroke={ED.paper} strokeWidth="3" paintOrder="stroke">
                (zoom-refined; w = {meta.supE97.w}, side 1)
              </text>
            </g>

            {/* legend (top-right, below the Rex label) */}
            <g>
              <rect x={W - PAD.r - 278} y={PAD.t + 36} width="262" height="40" rx="6" fill="var(--paper2)" stroke="var(--hairline)" />
              <line x1={W - PAD.r - 268} y1={PAD.t + 50} x2={W - PAD.r - 244} y2={PAD.t + 50} stroke={COLORS.pilot} strokeWidth="3" opacity="0.7" />
              <text x={W - PAD.r - 238} y={PAD.t + 54} style={{ font: '10.5px "IBM Plex Mono", monospace' }} fill="var(--ink-soft)">Σ|D_j|(w) — 25-defect pilot (envelope)</text>
              <line x1={W - PAD.r - 268} y1={PAD.t + 66} x2={W - PAD.r - 244} y2={PAD.t + 66} stroke={COLORS.e97} strokeWidth="3" opacity="0.7" />
              <text x={W - PAD.r - 238} y={PAD.t + 70} style={{ font: '10.5px "IBM Plex Mono", monospace' }} fill="var(--ink-soft)">|E97|(w) — residual cocycle (envelope)</text>
            </g>
          </svg>
        </div>

        {/* zoom inset */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '26px 0 6px', color: 'var(--ink)' }}>
          Phase-scale zoom at the pilot sup witness — raw, unbinned
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '58rem' }}>
          2,001 raw dd evaluations across ±17.4 x-units around the witness (step 0.017 x-units — ~60 samples per turn
          of the fastest ladder phase, which turns every ~1.07 x-units). This is the oscillation the certifier has to
          control: the grid above steps 57.9 x-units, so between its samples the cocycle turns ~62 times.
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${ZW} ${ZH}`} style={{ width: '100%', display: 'block' }} role="img"
            aria-label="Raw phase-scale zoom of the pilot and |E97| near the sup witness">
            {[-15, -10, -5, 0, 5, 10, 15].map((dx) => {
              const w = wStar + dx / X_PER_W;
              const x = ZPAD.l + (ZW - ZPAD.l - ZPAD.r) * ((w - ZOOM_W0) / (ZOOM_W1 - ZOOM_W0));
              return (
                <g key={`zax${dx}`}>
                  <line x1={x} y1={ZH - ZPAD.b} x2={x} y2={ZH - ZPAD.b + 5} stroke="var(--faint)" />
                  <text x={x} y={ZH - ZPAD.b + 17} textAnchor="middle" style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">{dx}</text>
                </g>
              );
            })}
            {[0, 0.1, 0.2].map((v) => (
              <g key={`zay${v}`}>
                <line x1={ZPAD.l - 5} y1={zy(v)} x2={ZPAD.l} y2={zy(v)} stroke="var(--faint)" />
                <text x={ZPAD.l - 8} y={zy(v) + 3.5} textAnchor="end" style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">{v.toFixed(1)}</text>
              </g>
            ))}
            <text x={ZPAD.l + (ZW - ZPAD.l - ZPAD.r) / 2} y={ZH - 5} textAnchor="middle" style={{ font: '600 11px "IBM Plex Mono", monospace' }} fill="var(--ink-soft)">
              x − x(witness) in x-units (witness w = {wStar})
            </text>
            <path d={zoomPaths.pilot} fill="none" stroke={COLORS.pilot} strokeWidth="1.1" />
            <path d={zoomPaths.e97} fill="none" stroke={COLORS.e97} strokeWidth="1.1" />
            {/* recorded sup + stretch max */}
            <line x1={ZPAD.l} y1={zy(meta.supPilot.value)} x2={ZW - ZPAD.r} y2={zy(meta.supPilot.value)} stroke={COLORS.pilot} strokeWidth="0.9" strokeDasharray="5 4" />
            <text x={ZW - ZPAD.r - 4} y={zy(meta.supPilot.value) - 5} textAnchor="end" style={{ font: '600 9.5px "IBM Plex Mono", monospace' }} fill={COLORS.pilot}>
              recorded zoom-refined sup {meta.supPilot.value} · this finer stretch peaks at {meta.zoomStretchSupPilot} (+{(meta.zoomStretchSupPilot - meta.supPilot.value).toExponential(2)} — a sampled sup, not a continuum bound)
            </text>
          </svg>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '18px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>data grade — read before quoting</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            <strong>Sampled dd measurement</strong> (grade: measured), regenerated deterministically from the
            evaluator of the imp-95205 pilot and gated on bit-exact reproduction of the recorded grid sups before
            baking; the pilot verdicts are sampled-sup statements, and the zoom shows why a finer sampling can move a
            recorded sup by ~10⁻⁵. The <span style={{ color: 'var(--series-3)', fontWeight: 700 }}>green band</span> is the
            only <em>certified</em> statement on this window (imp-95213: outward-rounded Taylor balls, both charts,
            0 failures on u ∈ [{CERTIFIED_SLICE.uLo}, {CERTIFIED_SLICE.uHi}]). The window-1 full continuum run
            (W1-CERT, tier-2) is in progress; 54,109,011 windows lie beyond window 1 either way. No bound is proved
            here, no RH claim. NO QED.
          </p>
        </div>

        <div style={{ marginTop: 22, fontSize: 13.5 }}>
          <Link to="/threads">The Gate-2 thread →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/permutation-architecture">Permutation Architecture →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/viz-freeze-flow">The freeze-flow normal form →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/viz-cost-floor">The cost floor →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/visualizations">All visualizations →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
