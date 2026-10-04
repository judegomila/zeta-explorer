import React from 'react';
import { ED, alpha } from '../styles/tokens.js';

// DeBruijnDepartureViz
// ---------------------------------------------------------------------------
// EXACT finite-degree de Bruijn heat flow on a real-rooted polynomial proxy.
//
// The de Bruijn–Newman flow is H_t = e^{-t ∂_z²} H_0, i.e. the coefficient ODE
//     ċ_k = -(k+1)(k+2) c_{k+2}.
// On a degree-d polynomial this is a finite, upper-triangular, exactly
// integrable linear system — no numerical PDE, no ill-posedness, stable in
// BOTH time directions. The closed form is
//     c_k(t) = Σ_j (-t)^j / j! · a_{k+2j} · (k+2j)!/k!
// (a_n = coefficients of H_0), finite because a_n = 0 for n > d.
//
// Sanity check (z²−1):  H_t = z² − (1+2t).  Increasing t spreads the two real
// roots apart (more-real, the anti-diffusive Newman direction); DECREASING t
// past −½ collides them at 0 and splits them into a conjugate pair ±i√|1+2t| —
// a real→complex "zero departure" in negative de Bruijn time.
//
// SCOPE: this is a proxy. Its zeros are NOT the zeros of ξ, there is no
// degree-uniform control, and at finite degree there is no ill-posedness. It
// illustrates the departure mechanism; it proves NOTHING about Λ.

// ── complex arithmetic ──────────────────────────────────────────────────────
const cAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cMul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cDiv = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const cAbs = (a) => Math.hypot(a[0], a[1]);

// H_0 coefficients (ascending, a_0..a_d) from a list of real roots.
function coeffsFromRoots(roots) {
  let poly = [1]; // constant 1
  for (const r of roots) {
    const next = new Array(poly.length + 1).fill(0);
    for (let i = 0; i < poly.length; i++) {
      next[i] += poly[i] * -r; // (z - r): multiply existing by -r
      next[i + 1] += poly[i]; //           and shift up by one (·z)
    }
    poly = next;
  }
  return poly; // ascending powers, monic (a_d = 1)
}

// c_k(t) via the exact heat-operator closed form.
function flowCoeffs(a, t) {
  const d = a.length - 1;
  const c = new Array(d + 1).fill(0);
  for (let k = 0; k <= d; k++) {
    let sum = 0;
    let factor = 1; // (k+2j)!/k! at j=0
    let tpow = 1; // (-t)^j / j! at j=0
    for (let j = 0; k + 2 * j <= d; j++) {
      if (j > 0) {
        // advance factor by the two new descending terms, and tpow by (-t)/j
        const m = k + 2 * j;
        factor *= (m - 1) * m;
        tpow *= -t / j;
      }
      sum += tpow * a[k + 2 * j] * factor;
    }
    c[k] = sum;
  }
  return c;
}

// Durand–Kerner (Weierstrass) simultaneous root finder for a real-coeff poly
// given in ascending order. Returns d complex roots.
function findRoots(cAsc) {
  let d = cAsc.length - 1;
  while (d > 0 && Math.abs(cAsc[d]) < 1e-14) d--; // drop ~zero leading terms
  if (d <= 0) return [];
  const lead = cAsc[d];
  const mon = cAsc.slice(0, d + 1).map((x) => x / lead); // monic, ascending

  const evalPoly = (z) => {
    // Horner, descending
    let acc = [mon[d], 0];
    for (let i = d - 1; i >= 0; i--) acc = cAdd(cMul(acc, z), [mon[i], 0]);
    return acc;
  };

  // spread initial guesses off the real axis so conjugate pairs separate
  const roots = [];
  const seed = [0.4, 0.9];
  let p = [1, 0];
  for (let i = 0; i < d; i++) {
    p = cMul(p, seed);
    roots.push([p[0], p[1]]);
  }

  for (let iter = 0; iter < 120; iter++) {
    let maxDelta = 0;
    for (let i = 0; i < d; i++) {
      let denom = [1, 0];
      for (let j = 0; j < d; j++) {
        if (j === i) continue;
        denom = cMul(denom, cSub(roots[i], roots[j]));
      }
      const delta = cDiv(evalPoly(roots[i]), denom);
      roots[i] = cSub(roots[i], delta);
      maxDelta = Math.max(maxDelta, cAbs(delta));
    }
    if (maxDelta < 1e-13) break;
  }
  return roots;
}

const PRESETS = {
  'six-real': { label: 'Six real roots', roots: [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5] },
  'lehmer': { label: 'Close Lehmer pair', roots: [-3, -1.2, -0.18, 0.18, 1.2, 3] },
  'eight-real': { label: 'Eight real roots', roots: [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5] },
  'quartet': { label: 'Two close pairs', roots: [-1.6, -1.2, 1.2, 1.6] },
};

const T_MIN = -1.6;
const T_MAX = 0.8;
const IM_EPS = 1e-6;

export default function DeBruijnDepartureViz() {
  const canvasRef = React.useRef(null);
  const [presetKey, setPresetKey] = React.useState('six-real');
  const [t, setT] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const rafRef = React.useRef(0);
  const dirRef = React.useRef(-1); // sweep toward negative time first

  const a0 = React.useMemo(() => coeffsFromRoots(PRESETS[presetKey].roots), [presetKey]);
  const originalRoots = PRESETS[presetKey].roots;

  const { roots, nReal, nPairs } = React.useMemo(() => {
    const rts = findRoots(flowCoeffs(a0, t));
    let real = 0;
    for (const r of rts) if (Math.abs(r[1]) < IM_EPS) real++;
    return { roots: rts, nReal: real, nPairs: (rts.length - real) / 2 };
  }, [a0, t]);

  // animation: ping-pong t between T_MIN and T_MAX
  React.useEffect(() => {
    if (!playing) return;
    let last = null;
    const step = (ts) => {
      if (last == null) last = ts;
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      setT((prev) => {
        let next = prev + dirRef.current * dt * 0.5;
        if (next <= T_MIN) { next = T_MIN; dirRef.current = 1; }
        else if (next >= T_MAX) { next = T_MAX; dirRef.current = -1; }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  // draw
  React.useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const scale = 42; // px per unit
    const ox = W / 2, oy = H / 2;
    const toPx = (re, im) => [ox + re * scale, oy - im * scale];

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, W, H);

    // imaginary-axis band shading (off-line = departed)
    ctx.fillStyle = alpha(ED.series2, 0.05);
    ctx.fillRect(0, 0, W, oy - 3);
    ctx.fillRect(0, oy + 3, W, H - oy - 3);

    // grid
    ctx.strokeStyle = alpha(ED.rule, 0.12);
    ctx.lineWidth = 1;
    for (let g = -6; g <= 6; g++) {
      const [gx] = toPx(g, 0);
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      const [, gy] = toPx(0, g);
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    // real axis ("critical line" analogue) — bright
    ctx.strokeStyle = alpha(ED.series1, 0.55);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
    ctx.fillStyle = alpha(ED.series1, 0.7);
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('Im = 0  (real axis)', 8, oy - 8);

    // ghost markers: original t=0 real roots
    ctx.fillStyle = alpha(ED.series8, 0.35);
    for (const r of originalRoots) {
      const [px, py] = toPx(r, 0);
      ctx.beginPath(); ctx.moveTo(px, py - 5); ctx.lineTo(px, py + 5); ctx.stroke();
      ctx.fillRect(px - 1, py - 5, 2, 10);
    }

    // current roots
    for (const [re, im] of roots) {
      const [px, py] = toPx(re, im);
      const departed = Math.abs(im) >= 1e-3;
      ctx.beginPath();
      ctx.arc(px, py, departed ? 6 : 5, 0, Math.PI * 2);
      if (departed) {
        ctx.fillStyle = alpha(ED.series2, 0.9);
        ctx.shadowColor = alpha(ED.series2, 0.8);
        ctx.shadowBlur = 14;
      } else {
        ctx.fillStyle = alpha(ED.series1, 0.95);
        ctx.shadowColor = alpha(ED.series1, 0.7);
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      // connect a complex root to its conjugate with a faint vertical thread
      if (departed && im > 0) {
        const [, py2] = toPx(re, -im);
        ctx.strokeStyle = alpha(ED.series2, 0.3);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py2); ctx.stroke();
      }
    }
  }, [roots, originalRoots]);

  const pct = ((t - T_MIN) / (T_MAX - T_MIN)) * 100;

  return (
    <div style={{ background: 'var(--paper)', borderRadius: 12, padding: 16, border: '1px solid var(--rule-soft)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <select
          value={presetKey}
          onChange={(e) => setPresetKey(e.target.value)}
          style={{ background: 'var(--paper-3)', color: 'var(--ink)', border: '1px solid var(--rule)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}
        >
          {Object.entries(PRESETS).map(([k, v]) => (
            <option key={k} value={k}>{v.label} (deg {PRESETS[k].roots.length})</option>
          ))}
        </select>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{ background: playing ? 'var(--tint-terra)' : 'var(--tint-green)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}
        >
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <div style={{ color: 'var(--ink-soft)', fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>
          t = <span style={{ color: t < 0 ? 'var(--series-2)' : 'var(--series-1)' }}>{t.toFixed(3)}</span>
          {t < 0 ? '  (smoothing / departure direction)' : t > 0 ? '  (anti-diffusive / more-real)' : ''}
        </div>
      </div>

      <input
        type="range" min={T_MIN} max={T_MAX} step={0.005} value={t}
        onChange={(e) => { setPlaying(false); setT(parseFloat(e.target.value)); }}
        style={{ width: '100%', marginBottom: 4 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-faint)', fontSize: 11, marginBottom: 12, fontFamily: 'ui-monospace, monospace' }}>
        <span>t = {T_MIN} (deep negative time)</span>
        <span>t = 0 (real-rooted proxy)</span>
        <span>t = {T_MAX}</span>
      </div>

      <canvas
        ref={canvasRef} width={720} height={420}
        style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
      />

      <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 13, fontFamily: 'ui-monospace, monospace', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--series-1)' }}>● real zeros: {nReal}</span>
        <span style={{ color: 'var(--series-2)' }}>● departed (complex pairs): {nPairs}</span>
        <span style={{ color: 'var(--ink-soft)' }}>│ ghosts = t=0 root positions</span>
      </div>
      <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
        Sweep <span style={{ fontFamily: 'monospace' }}>t</span> toward negative time: adjacent real zeros
        collide on the axis and <span style={{ color: 'var(--series-2)' }}>depart</span> into conjugate pairs — the
        exact same real→complex bifurcation the parabolic flow undergoes, computed here in closed form
        (<span style={{ fontFamily: 'monospace' }}>c_k(t)=Σ_j (−t)^j/j! · a_{'{k+2j}'} · (k+2j)!/k!</span>),
        stable in both directions. Increasing <span style={{ fontFamily: 'monospace' }}>t</span> recombines them
        (the anti-diffusive, reality-improving Newman direction).
      </p>
    </div>
  );
}
