import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import {
  lnN1Star,
  sc3FloorLnN1,
  MEASURED_POINTS,
  SCALING_LAW,
  SUBEXPONENTIAL_VERDICT,
  VERIFIED_HEIGHT_WALL,
  IMP95218_ROUTE7_COST_CURVE,
} from '../data/imp-95218-route7-cost-curve.js';
import { STATUS, ED, TINT } from '../styles/tokens.js';

/* /viz-cost-floor — the geometry of the program's floor (imp-95218 route-VII
   cost curve rendered as a (t, y) plane). ACCURACY RULE: every pixel of the
   contour field is the module's own calibrated law
     ln N1*(t, y) = (2·c0 − y)/t + L0,  c0 = 1.221852, L0 = 1.1676,
   evaluated per grid cell (no decorative geometry); every overlay curve is an
   exact level set of that law or of U = t + y²/2; every point is a frozen
   literal from the source module. Grade of the underlying law: ANALYSIS,
   2-point Arb calibration. This page derives no bound and closes no gap.
   NO QED. Import-light: the imp-95218 chain is ~92 KB of literals, no zeros
   bundle. */

// ── plane geometry (shared by canvas + SVG overlay) ──────────────────────────
const T_MIN = 0.02;
const T_MAX = 0.20;
const Y_MIN = 0.0;
const Y_MAX = 0.40;
const GRID = 300; // contour resolution per axis (exact formula per cell)
const PLOT_W = 680;
const PLOT_H = 520;
const PAD = { l: 58, r: 14, t: 12, b: 40 };
const CW = PLOT_W - PAD.l - PAD.r;
const CH = PLOT_H - PAD.t - PAD.b;

const N_SEAM = VERIFIED_HEIGHT_WALL.nSeam; // 690988 = sqrt(X/(4π)), the seam anchor

const xOfT = (t) => PAD.l + CW * ((t - T_MIN) / (T_MAX - T_MIN));
const yOfY = (y) => PAD.t + CH * (1 - (y - Y_MIN) / (Y_MAX - Y_MIN));
const tOfX = (px) => T_MIN + (T_MAX - T_MIN) * ((px - PAD.l) / CW);
const yOfPy = (py) => Y_MIN + (Y_MAX - Y_MIN) * (1 - (py - PAD.t) / CH);

// log10 of the lane row count N1*(t,y) − N_seam; null if the seam anchor
// already covers the lane (N1* ≤ N_seam — no rows needed at all).
function log10Rows(t, y) {
  const ln = lnN1Star(t, y);
  // rows = e^ln − N_seam; compute log10 safely for huge ln
  if (ln > 60) return ln / Math.LN10; // N_seam negligible beyond e^60
  const rows = Math.exp(ln) - N_SEAM;
  if (rows <= 0) return null;
  return Math.log10(rows);
}

// Warm sequential ramp over log10(rows). Stops chosen to resolve the working
// range (10^6–10^12 rows) while still separating the far wall (10^20+).
const RAMP = [
  [0, [246, 241, 231]], // paper2
  [6, [222, 203, 156]],
  [7.74, [181, 138, 46]], // brass at the K2 line 5.5e7
  [9, [199, 106, 42]],
  [12, [194, 58, 28]], // terra-dk at the 1e12 wall
  [16, [141, 42, 26]],
  [22, [92, 32, 26]],
  [32, [52, 24, 22]],
  [52, [28, 24, 20]], // ink
];
function rampColor(v) {
  if (v <= RAMP[0][0]) return RAMP[0][1];
  for (let i = 1; i < RAMP.length; i++) {
    if (v <= RAMP[i][0]) {
      const [v0, c0] = RAMP[i - 1];
      const [v1, c1] = RAMP[i];
      const f = (v - v0) / (v1 - v0);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * f));
    }
  }
  return RAMP[RAMP.length - 1][1];
}
const SEAM_COVERED_RGB = [205, 219, 201]; // muted green: lane already inside verified height

// iso-U level curves shown (labels are the achieved-bound values U = t + y²/2)
const ISO_U = [0.2, 0.1787854, 0.1758354, 0.14, 0.1, 0.05];
// budget-feasibility frontiers: lane rows R ⇒ straight line y = 2c0 − t·(ln(R+N_seam) − L0)
const BUDGETS = [
  { rows: 5.5e7, label: '5.5e7 rows — K2 economic line' },
  { rows: 1e9, label: '1e9 rows (~13,000 CPU-days)' },
  { rows: 1e12, label: '1e12 rows (~36 CPU-millennia)' },
];
const FLOOR_BAND = { uLo: 0.145, uHi: 0.15032 }; // reachableFloor stretch → conservative

const C0 = SCALING_LAW.c0;
const L0 = SCALING_LAW.L0;

function budgetLinePoints(rows) {
  const lnR = Math.log(rows + N_SEAM);
  const slope = lnR - L0; // y = 2c0 − t·slope
  const tAtY = (y) => (2 * C0 - y) / slope;
  return { p1: { t: tAtY(Y_MAX), y: Y_MAX }, p2: { t: tAtY(Y_MIN), y: Y_MIN } };
}

function isoUPath(U) {
  // t = U − y²/2 for y from 0 up to min(Y_MAX, sqrt(2U)) — exact parabola.
  const yTop = Math.min(Y_MAX, Math.sqrt(2 * U) - 1e-9);
  const pts = [];
  for (let i = 0; i <= 160; i++) {
    const y = (yTop * i) / 160;
    const t = U - (y * y) / 2;
    if (t < T_MIN || t > T_MAX) continue;
    pts.push(`${xOfT(t).toFixed(1)},${yOfY(y).toFixed(1)}`);
  }
  return pts.length >= 2 ? `M ${pts.join(' L ')}` : null;
}

// The exact frozen row coordinates (all literals from the source modules).
const ROWS = [
  {
    key: 'v3',
    t: MEASURED_POINTS[0].t, // 129/800
    y: MEASURED_POINTS[0].y, // sqrt(87677/2500000)
    label: '0.1787854 sealed row',
    detail: `Arb-measured N1 = 3.84e6 (calibration point A) · U = ${(MEASURED_POINTS[0].t + MEASURED_POINTS[0].y ** 2 / 2).toFixed(7)}`,
    kind: 'measured',
  },
  {
    key: 'fourgate',
    t: 129 / 800,
    y: 0.170795, // four-gate 0.1758354 package y (consistency check, not a fit point)
    label: '0.1758354 four-gate row',
    detail: 'chosen N* = 6e6 ≥ predicted min 4.25e6 (consistency check)',
    kind: 'attempted',
  },
  {
    key: 'contract014',
    t: SCALING_LAW.prediction014Row.t0, // 24727519/2e8
    y: SCALING_LAW.prediction014Row.y0, // 0.1809
    label: '0.14 contract row',
    detail: `predicted N1* = ${SCALING_LAW.prediction014Row.predictedN1Star.toExponential(3)} — 5.2x the K2 line (prediction, falsifiable)`,
    kind: 'contract',
  },
  {
    key: 'killed01399',
    t: MEASURED_POINTS[1].t, // 10103/80000
    y: MEASURED_POINTS[1].y, // 33/200
    label: '0.1399 row — RULED OUT',
    detail: 'Arb-measured N1* = 2.205e8 (calibration point B); K2 eliminate fired',
    kind: 'killed',
  },
];

const ROW_STYLE = {
  measured: { color: STATUS.measured.fg, shape: 'circle' },
  attempted: { color: ED.series1, shape: 'ring' },
  contract: { color: STATUS.neutral.fg, shape: 'square' },
  killed: { color: STATUS.refuted.fg, shape: 'x' },
};

function fmtRows(l10) {
  if (l10 === null) return '0 (seam-covered)';
  const e = Math.floor(l10);
  const m = Math.pow(10, l10 - e);
  return `${m.toFixed(2)}e${e}`;
}

export default function VizCostFloorPage() {
  const canvasRef = useRef(null);
  const [hover, setHover] = useState(null);

  // The contour field: GRID×GRID exact evaluations of the calibrated law.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = ED.paper;
    ctx.fillRect(0, 0, PLOT_W, PLOT_H);
    const img = ctx.createImageData(GRID, GRID);
    for (let iy = 0; iy < GRID; iy++) {
      const y = Y_MIN + (Y_MAX - Y_MIN) * (1 - iy / (GRID - 1));
      for (let ix = 0; ix < GRID; ix++) {
        const t = T_MIN + (T_MAX - T_MIN) * (ix / (GRID - 1));
        const v = log10Rows(t, y);
        const rgb = v === null ? SEAM_COVERED_RGB : rampColor(v);
        const o = 4 * (iy * GRID + ix);
        img.data[o] = rgb[0];
        img.data[o + 1] = rgb[1];
        img.data[o + 2] = rgb[2];
        img.data[o + 3] = 255;
      }
    }
    // draw the 300×300 field into the padded plot area (bilinear upscale)
    const off = document.createElement('canvas');
    off.width = GRID;
    off.height = GRID;
    off.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, PAD.l, PAD.t, CW, CH);
  }, []);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * PLOT_W;
    const py = ((e.clientY - rect.top) / rect.height) * PLOT_H;
    if (px < PAD.l || px > PLOT_W - PAD.r || py < PAD.t || py > PLOT_H - PAD.b) {
      setHover(null);
      return;
    }
    const t = tOfX(px);
    const y = yOfPy(py);
    const U = t + (y * y) / 2;
    const ln = lnN1Star(t, y);
    const l10 = log10Rows(t, y);
    const sc3 = sc3FloorLnN1(t) / Math.LN10; // unconditional SC3 floor, log10 N1*
    let status;
    if (l10 === null) status = 'no lane — seam anchor covers it';
    else if (Math.pow(10, l10) <= 5.5e7) status = 'inside the K2 economic line';
    else if (Math.pow(10, l10) <= 1e12) status = 'K2-dead (compute-blocked at project scale)';
    else status = 'unreachable (beyond any plausible budget)';
    setHover({ t, y, U, ln, l10, sc3, status, px, py });
  };

  const overlay = useMemo(() => {
    // floor band polygon between iso-U parabolas
    const bandPts = [];
    const sampleU = (U, rev) => {
      const yTop = Math.min(Y_MAX, Math.sqrt(2 * U) - 1e-9);
      const out = [];
      for (let i = 0; i <= 120; i++) {
        const y = (yTop * i) / 120;
        const t = U - (y * y) / 2;
        if (t < T_MIN || t > T_MAX) continue;
        out.push([xOfT(t), yOfY(y)]);
      }
      return rev ? out.reverse() : out;
    };
    bandPts.push(...sampleU(FLOOR_BAND.uHi, false), ...sampleU(FLOOR_BAND.uLo, true));
    return { bandPath: `M ${bandPts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')} Z` };
  }, []);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>route vii cost geometry · grade: derived analysis · 2-point calibration · NO QED</span>} />
      <div className="ed-full" style={{ maxWidth: '66rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">idea geometry · 1 of 3</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 36, lineHeight: 1.12, margin: '6px 0 12px', color: 'var(--ink)' }}>
          The Geometry of the Program&rsquo;s Floor
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: '58rem', lineHeight: 1.6 }}>
          Every complete Route-VII row at coordinates <InlineMath tex="(t, y)" /> proves{' '}
          <InlineMath tex="\Lambda \le U = t + y^2/2" /> — and costs a tail lane of{' '}
          <InlineMath tex="N_1^*(t,y) - N_{\mathrm{seam}}" /> rows. The color field below is the program&rsquo;s own
          calibrated cost law evaluated at every pixel; the overlays are its exact level sets. The picture{' '}
          <em>is</em> the strategic situation: the achieved-bound contours (iso-<InlineMath tex="U" /> parabolas) run
          almost parallel to the budget frontiers, so buying a lower <InlineMath tex="U" /> means crossing cost
          contours that are exponentially spaced.
        </p>
        <BlockMath tex={`\\ln N_1^*(t, y) \\;=\\; \\frac{2c_0 - y}{t} + L_0, \\qquad c_0 = ${C0.toFixed(6)},\\; L_0 = ${L0.toFixed(6)}`} />
        <BlockMath tex={'\\ln N_1^* \\;>\\; \\frac{1 + \\sqrt{1-2t}}{t} \\;\\xrightarrow[t\\to 0]{}\\; \\frac{2}{t} \\qquad \\text{(unconditional SC3 floor)}'} />

        <div style={{ position: 'relative', border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper)', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={PLOT_W}
            height={PLOT_H}
            style={{ width: '100%', display: 'block' }}
          />
          <svg
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            role="img"
            aria-label="Contour map of the Route VII complete-row cost over the (t, y) plane"
          >
            {/* axes */}
            {[0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2].map((t) => (
              <g key={`tx${t}`}>
                <line x1={xOfT(t)} y1={PLOT_H - PAD.b} x2={xOfT(t)} y2={PLOT_H - PAD.b + 5} stroke="var(--faint)" strokeWidth="1" />
                <text x={xOfT(t)} y={PLOT_H - PAD.b + 17} textAnchor="middle" style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">{t.toFixed(2)}</text>
              </g>
            ))}
            {[0, 0.1, 0.2, 0.3, 0.4].map((y) => (
              <g key={`yx${y}`}>
                <line x1={PAD.l - 5} y1={yOfY(y)} x2={PAD.l} y2={yOfY(y)} stroke="var(--faint)" strokeWidth="1" />
                <text x={PAD.l - 9} y={yOfY(y) + 3.5} textAnchor="end" style={{ font: '10px "IBM Plex Mono", monospace' }} fill="var(--faint)">{y.toFixed(1)}</text>
              </g>
            ))}
            <text x={PAD.l + CW / 2} y={PLOT_H - 6} textAnchor="middle" style={{ font: '600 11px "IBM Plex Mono", monospace' }} fill="var(--ink-soft)">t (heat time of the row)</text>
            <text x={13} y={PAD.t + CH / 2} textAnchor="middle" transform={`rotate(-90 13 ${PAD.t + CH / 2})`} style={{ font: '600 11px "IBM Plex Mono", monospace' }} fill="var(--ink-soft)">y (half-strip bottom)</text>

            {/* derived program-floor band U ≈ 0.145–0.150 */}
            <path d={overlay.bandPath} fill={ED.series3} opacity="0.16" />
            {isoUPath(FLOOR_BAND.uLo) && <path d={isoUPath(FLOOR_BAND.uLo)} fill="none" stroke={ED.series3} strokeWidth="1.4" strokeDasharray="2 3" opacity="0.85" />}
            {isoUPath(FLOOR_BAND.uHi) && <path d={isoUPath(FLOOR_BAND.uHi)} fill="none" stroke={ED.series3} strokeWidth="1.4" strokeDasharray="2 3" opacity="0.85" />}

            {/* iso-U level curves (label y-positions staggered to avoid collisions) */}
            {ISO_U.map((U) => {
              const d = isoUPath(U);
              if (!d) return null;
              const LABEL_Y = { 0.2: 0.385, 0.1787854: 0.31, 0.1758354: 0.245, 0.14: 0.385, 0.1: 0.32, 0.05: 0.2 };
              const yLab = Math.min(LABEL_Y[U] ?? Y_MAX - 0.012, Math.sqrt(2 * Math.max(U - T_MIN, 1e-9)) - 0.004);
              const tLab = U - (yLab * yLab) / 2;
              return (
                <g key={`u${U}`}>
                  <path d={d} fill="none" stroke="var(--ink)" strokeWidth="1.1" opacity="0.55" />
                  <text x={xOfT(Math.max(tLab, T_MIN)) + 4} y={yOfY(yLab) + 12} style={{ font: '600 10px "IBM Plex Mono", monospace' }} fill="var(--ink)" stroke={ED.paper} strokeWidth="2.5" paintOrder="stroke" opacity="0.9">
                    U={U}
                  </text>
                </g>
              );
            })}

            {/* budget-feasibility frontiers (straight lines of the law) */}
            {BUDGETS.map((b, i) => {
              const { p1, p2 } = budgetLinePoints(b.rows);
              return (
                <g key={b.rows}>
                  <line x1={xOfT(p1.t)} y1={yOfY(p1.y)} x2={xOfT(p2.t)} y2={yOfY(p2.y)} stroke={ED.paper} strokeWidth="3" opacity="0.5" />
                  <line x1={xOfT(p1.t)} y1={yOfY(p1.y)} x2={xOfT(p2.t)} y2={yOfY(p2.y)} stroke={STATUS.nogo.fg} strokeWidth="1.5" strokeDasharray="6 4" />
                  <text x={xOfT(p2.t) + 3} y={yOfY(0.015 + i * 0.0)} transform={`rotate(-86.5 ${xOfT(p2.t) + 3} ${yOfY(0.015)})`} style={{ font: '600 9.5px "IBM Plex Mono", monospace' }} fill={ED.paper} stroke={STATUS.refuted.fg} strokeWidth="0.2" paintOrder="stroke">
                    {b.label}
                  </text>
                </g>
              );
            })}

            {/* calibration band y ∈ [0.165, 0.19] */}
            {[0.165, 0.19].map((y) => (
              <line key={`cal${y}`} x1={PAD.l} y1={yOfY(y)} x2={PLOT_W - PAD.r} y2={yOfY(y)} stroke={ED.series1} strokeWidth="0.8" strokeDasharray="1.5 4" opacity="0.6" />
            ))}
            <text x={PAD.l + 8} y={yOfY(0.165) + 12} style={{ font: '9.5px "IBM Plex Mono", monospace' }} fill={TINT.blue} opacity="0.95">
              calibration band y ∈ [0.165, 0.19]
            </text>

            {/* the frozen rows */}
            {ROWS.map((r) => {
              const s = ROW_STYLE[r.kind];
              const cx = xOfT(r.t);
              const cy = yOfY(r.y);
              return (
                <g key={r.key}>
                  <title>{`${r.label} — t=${r.t.toFixed(7)}, y=${r.y.toFixed(6)} · ${r.detail}`}</title>
                  {s.shape === 'circle' && <circle cx={cx} cy={cy} r="5" fill={s.color} stroke={ED.paper} strokeWidth="1.5" />}
                  {s.shape === 'ring' && <circle cx={cx} cy={cy} r="5" fill="none" stroke={s.color} strokeWidth="2.2" />}
                  {s.shape === 'square' && <rect x={cx - 4.5} y={cy - 4.5} width="9" height="9" fill="none" stroke={s.color} strokeWidth="2" />}
                  {s.shape === 'x' && (
                    <g stroke={s.color} strokeWidth="2.4">
                      <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} />
                      <line x1={cx - 5} y1={cy + 5} x2={cx + 5} y2={cy - 5} />
                    </g>
                  )}
                  <text
                    x={r.key === 'killed01399' ? cx + 9 : cx - 8}
                    y={cy + (r.key === 'v3' ? -7 : r.key === 'fourgate' ? -7 : r.key === 'contract014' ? 18 : 16)}
                    textAnchor={r.key === 'killed01399' ? 'start' : 'end'}
                    style={{ font: '600 10px "IBM Plex Mono", monospace' }} fill={s.color} stroke={ED.paper} strokeWidth="2.5" paintOrder="stroke"
                  >
                    {r.label}
                  </text>
                </g>
              );
            })}

            {/* hover crosshair */}
            {hover && (
              <g pointerEvents="none">
                <line x1={hover.px} y1={PAD.t} x2={hover.px} y2={PLOT_H - PAD.b} stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
                <line x1={PAD.l} y1={hover.py} x2={PLOT_W - PAD.r} y2={hover.py} stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
              </g>
            )}
          </svg>
        </div>

        {/* hover readout */}
        <div className="ed-mono" style={{ marginTop: 8, border: '1px solid var(--hairline)', borderRadius: 8, background: 'var(--paper2)', padding: '10px 14px', fontSize: 12, color: 'var(--ink-soft)', minHeight: 44, lineHeight: 1.7 }}>
          {hover ? (
            <>
              t = {hover.t.toFixed(4)} · y = {hover.y.toFixed(4)} · <strong style={{ color: 'var(--ink)' }}>U = t + y²/2 = {hover.U.toFixed(5)}</strong> · ln N1* = {hover.ln.toFixed(2)} ·{' '}
              lane rows ≈ <strong style={{ color: 'var(--ink)' }}>{fmtRows(hover.l10)}</strong>
              {hover.l10 !== null && <> (log10 = {hover.l10.toFixed(2)})</>} · SC3 unconditional floor log10 N1* &gt; {hover.sc3.toFixed(2)} ·{' '}
              <span style={{ color: hover.status.startsWith('inside') || hover.status.startsWith('no lane') ? 'var(--series-3)' : 'var(--accent)', fontWeight: 700 }}>{hover.status}</span>
            </>
          ) : (
            <>hover the plane for the exact readout: (t, y, U = t + y²/2, log10 lane rows from the calibrated law, the SC3 unconditional floor, and the budget status)</>
          )}
        </div>

        {/* legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', alignItems: 'center', marginTop: 10 }}>
          <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)' }}>log10 lane rows:</span>
          {[6, 8, 10, 12, 16, 22].map((v) => {
            const c = rampColor(v);
            return (
              <span key={v} className="ed-mono" style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: `rgb(${c.join(',')})`, verticalAlign: '-2px', marginRight: 4, border: '1px solid var(--hairline)' }} />
                {v}
              </span>
            );
          })}
          <span className="ed-mono" style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: `rgb(${SEAM_COVERED_RGB.join(',')})`, verticalAlign: '-2px', marginRight: 4, border: '1px solid var(--hairline)' }} />
            no lane (verified height covers it)
          </span>
          <span className="ed-mono" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--series-3)' }}>▨ derived floor band U ≈ 0.145–0.150</span>
        </div>

        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.65, marginTop: 18, maxWidth: '58rem' }}>
          <strong>Why this is the single most strategic picture.</strong> The exponential wall{' '}
          <InlineMath tex="\mathrm{rows}_{\min}(U) \sim 2.14\, e^{2.4437/U}" /> means{' '}
          <strong>halving <InlineMath tex="U" /> squares the cost</strong> (up to the{' '}
          <InlineMath tex="e^{L_0}" /> prefactor) — the iso-<InlineMath tex="U" /> contours below the green band sit
          behind budget frontiers that no technology change reaches: lane technology moves the{' '}
          <em>prefactor</em> by up to ~1.6&times;10⁶&times; (tier-2 chirp vs landmark rows) but never the exponent, and
          verified zero height enters only <em>inside the same logarithm</em> (erasing the 0.1399 lane by height alone
          needs 1.02&times;10⁵&times; more verified zeros; 3.3&times;10⁵&times; more height buys only
          U: 0.150&nbsp;→&nbsp;0.135). Below the band, a <strong>new tail mechanism</strong> is required: a tail
          argument whose abscissa gain is not purchased by the heat lift <InlineMath tex="t \ln N" /> — i.e.{' '}
          <strong>arithmetic input</strong>, consistent with the <Link to="/flow-blindness-no-go">flow-blindness no-go</Link>.
        </p>

        {/* budget-floor table (frozen literals from the module) */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 22, margin: '26px 0 8px', color: 'var(--ink)' }}>
          The budget floors U<sub>floor</sub>(R) — frozen from the module
        </h2>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '7px 12px' }}>row budget R</th>
                <th style={{ padding: '7px 12px' }}>smallest reachable U</th>
                <th style={{ padding: '7px 12px' }}>scale</th>
              </tr>
            </thead>
            <tbody>
              {SUBEXPONENTIAL_VERDICT.budgetFloors.map((f) => (
                <tr key={f.rowBudget} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '6px 12px', fontFamily: 'var(--ed-mono)', fontSize: 12 }}>{f.rowBudget.toExponential(1)}</td>
                  <td style={{ padding: '6px 12px', fontFamily: 'var(--ed-mono)', fontSize: 12, color: 'var(--ink)', fontWeight: 600 }}>{f.uFloor}</td>
                  <td style={{ padding: '6px 12px' }}>{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '18px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest grade</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            The color field is a <strong>derived analysis</strong>: the law&rsquo;s form comes from the
            verify_tail_arb.c contraction structure (the SC3 gate makes the exponential-in-1/t floor unconditional
            within the architecture), but its two constants are calibrated on just <strong>two Arb-measured
            points</strong> ((t/2)&thinsp;ln&thinsp;N1* + y/2 constant to 1.6% across a 57&times; change in N1*). Both
            calibration points sit at y ∈ [0.165, 0.19]; below that band the G ~ N<sup>−y</sup> channel adds a second
            wall the law omits, so small-y colors <em>understate</em> cost. This page derives no bound, certifies
            nothing, and closes no gap — all rows are conditional-frontier objects. <strong>NO QED.</strong>{' '}
            Platt–Trudgian Λ ≤ 0.2 remains SOTA. Source: <span className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95218-route7-cost-curve.js</span> (grade: {IMP95218_ROUTE7_COST_CURVE.grade}).
          </p>
        </div>

        <div style={{ marginTop: 22, fontSize: 13.5 }}>
          <Link to="/frontier-dag">The Frontier DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/threads">Research threads (route-vii) →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/viz-window-landscape">The window-1 landscape →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/viz-freeze-flow">The freeze-flow normal form →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/visualizations">All visualizations →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
