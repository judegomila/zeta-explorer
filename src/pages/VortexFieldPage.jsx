import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

/*
 * Prime-Log Vortex Field Near a Zeta Zero.
 *
 * The logarithmic derivative V(s) = xi'(s)/xi(s) (the Newman flow's phase
 * gradient, the analogue of V_t = H_t'(z)/H_t(z)) has a SIMPLE POLE at every
 * zero rho_k of xi -- a PHASE VORTEX. Around each, the winding number
 *   (1/2pi) oint_gamma V(s) . ds = +1
 * is exactly the argument principle: one enclosed zero per +1 of winding.
 *
 * We domain-color arg H(s) for the faithful local model H(s) = prod_k (s - rho_k)
 * over a window of nearby zeros: the phase wraps once around each vortex, so the
 * zeros ARE the vortices. Under RH every rho_k = 1/2 + i gamma_k, so every vortex
 * sits on the critical line Re s = 1/2 -- a vertical row. Push one off the line
 * (the slider) and you get an OFF-AXIS VORTEX: an off-axis zero, i.e. an RH
 * violation. "Vortex exclusion" (no off-axis vortices) is exactly RH.
 *
 * HONEST CEILING (per the project's route map + supercritical-winding-experiment):
 * the winding / vortex-exclusion picture re-derives Lambda >= 0 (Rodgers-Tao) and
 * makes RH visible, but it is NOT a new rigorous Lambda bound and does not beat
 * Platt-Trudgian Lambda <= 0.2. This is an exact, exploratory visualization.
 */

// First 25 nontrivial zeta zeros (imaginary parts). Light hardcode -- avoids the
// 16.7MB zeros bundle (pages must not import it).
const GAMMAS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719,
  43.327073, 48.005151, 49.773832, 52.970321, 56.446248, 59.347044, 60.831779,
  65.112544, 67.079811, 69.546402, 72.067158, 75.704691, 77.144840, 79.337375,
  82.910381, 84.735493, 87.425275, 88.809111,
];

const PX = 460;          // canvas pixel buffer (square)
const HALF_T = 9;        // half-window in t (imaginary direction)

function VortexCanvas({ centerIdx, tau, magContours, showStreamlines }) {
  const ref = useRef(null);

  // Vortex set. Under the de Bruijn-Newman flow, for heat-time tau >= Lambda all
  // vortices sit on Re s = 1/2; below Lambda (here Lambda_model = 0) the central
  // one is an OFF-AXIS conjugate pair sigma = 1/2 +- |tau| (an RH violation that
  // forward heat would coalesce onto the line). All others stay on the line.
  const zeros = useMemo(() => {
    const gc = GAMMAS[centerIdx];
    const others = GAMMAS
      .filter((g) => Math.abs(g - gc) <= HALF_T + 4 && Math.abs(g - gc) > 1e-9)
      .map((g) => ({ sigma: 0.5, gamma: g, role: 'other' }));
    const delta = tau < 0 ? -tau : 0;
    const central = delta > 1e-6
      ? [{ sigma: 0.5 + delta, gamma: gc, role: 'off' }, { sigma: 0.5 - delta, gamma: gc, role: 'off' }]
      : [{ sigma: 0.5, gamma: gc, role: 'central' }];
    return [...central, ...others];
  }, [centerIdx, tau]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(PX, PX);
    const data = img.data;
    const gc = GAMMAS[centerIdx];
    const sigMin = 0.5 - HALF_T, sigMax = 0.5 + HALF_T;
    const tMin = gc - HALF_T, tMax = gc + HALF_T;
    const zs = zeros;

    for (let py = 0; py < PX; py++) {
      const t = tMax - (py / (PX - 1)) * (tMax - tMin);
      for (let px = 0; px < PX; px++) {
        const sig = sigMin + (px / (PX - 1)) * (sigMax - sigMin);
        let phase = 0, logmag = 0;
        for (let k = 0; k < zs.length; k++) {
          const dx = sig - zs[k].sigma;
          const dy = t - zs[k].gamma;
          phase += Math.atan2(dy, dx);
          logmag += 0.5 * Math.log(dx * dx + dy * dy + 1e-12);
        }
        let ph = phase % (2 * Math.PI);
        if (ph < 0) ph += 2 * Math.PI;
        const hue = (ph / (2 * Math.PI)) * 360;
        let light = 0.5;
        if (magContours) {
          const frac = logmag - Math.floor(logmag);
          light = 0.34 + 0.30 * frac;
        }
        const [r, g, b] = hsl2rgb(hue, 0.85, light);
        const o = (py * PX + px) * 4;
        data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const toPx = (sig, t) => [
      ((sig - sigMin) / (sigMax - sigMin)) * (PX - 1),
      ((tMax - t) / (tMax - tMin)) * (PX - 1),
    ];
    const sigPerPx = (sigMax - sigMin) / (PX - 1);
    const tPerPx = (tMax - tMin) / (PX - 1);

    // V(s) = sum_k 1/(s - rho_k); draw its Polya vector field (Re V, -Im V)
    // streamlines (the Newman flow), seeded on a coarse grid.
    if (showStreamlines) {
      const polya = (sig, t) => {
        let vx = 0, vy = 0;
        for (let k = 0; k < zs.length; k++) {
          const dx = sig - zs[k].sigma, dy = t - zs[k].gamma;
          const D = dx * dx + dy * dy + 1e-6;
          vx += dx / D; vy += dy / D; // Polya field of 1/(s-rho)
        }
        return [vx, vy];
      };
      ctx.strokeStyle = 'rgba(255,255,255,0.42)';
      ctx.lineWidth = 1;
      const SEED = 13, STEPS = 22, hstep = 0.5;
      for (let i = 1; i < SEED; i++) {
        for (let j = 1; j < SEED; j++) {
          let sig = sigMin + (i / SEED) * (sigMax - sigMin);
          let t = tMin + (j / SEED) * (tMax - tMin);
          ctx.beginPath();
          let [sx, sy] = toPx(sig, t); ctx.moveTo(sx, sy);
          for (let st = 0; st < STEPS; st++) {
            const [vx, vy] = polya(sig, t);
            const mag = Math.hypot(vx, vy) + 1e-9;
            sig += (vx / mag) * hstep * sigPerPx * 4;
            t += (vy / mag) * hstep * tPerPx * 4;
            if (sig < sigMin || sig > sigMax || t < tMin || t > tMax) break;
            [sx, sy] = toPx(sig, t); ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
    }

    // critical line Re s = 1/2
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.5;
    const [lx] = toPx(0.5, 0);
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, PX); ctx.stroke();
    ctx.setLineDash([]);

    // vortex markers
    zs.forEach((z) => {
      const [vx, vy] = toPx(z.sigma, z.gamma);
      if (vy < -10 || vy > PX + 10) return;
      const central = z.role === 'central';
      const off = z.role === 'off';
      ctx.beginPath();
      ctx.arc(vx, vy, central || off ? 7.5 : 5.5, 0, 2 * Math.PI);
      ctx.lineWidth = central || off ? 3 : 2;
      ctx.strokeStyle = off ? '#ef4444' : central ? '#fde047' : '#ffffff';
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fill(); ctx.stroke();
    });
  }, [centerIdx, tau, magContours, showStreamlines, zeros]);

  return <canvas ref={ref} width={PX} height={PX} style={{ width: '100%', maxWidth: 560, borderRadius: 10, border: '1px solid #1e293b', display: 'block' }} />;
}

function hsl2rgb(h, s, l) {
  h /= 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// Phase color wheel legend
function PhaseWheel() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); const R = 56, C = 60;
    const img = ctx.createImageData(120, 120); const d = img.data;
    for (let y = 0; y < 120; y++) for (let x = 0; x < 120; x++) {
      const dx = x - C, dy = y - C, r = Math.hypot(dx, dy);
      const o = (y * 120 + x) * 4;
      if (r <= R && r >= R * 0.42) {
        let ph = Math.atan2(dy, dx); if (ph < 0) ph += 2 * Math.PI;
        const [rr, gg, bb] = hsl2rgb((ph / (2 * Math.PI)) * 360, 0.85, 0.5);
        d[o] = rr; d[o + 1] = gg; d[o + 2] = bb; d[o + 3] = 255;
      } else { d[o + 3] = 0; }
    }
    ctx.putImageData(img, 0, 0);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

export default function VortexFieldPage() {
  const [centerIdx, setCenterIdx] = useState(9); // gamma ~ 49.77 (matches the poster)
  const [tau, setTau] = useState(-4);
  const [magContours, setMagContours] = useState(true);
  const [showStreamlines, setShowStreamlines] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);
  const gc = GAMMAS[centerIdx];
  const offAxis = tau < -1e-6;

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    let last = null;
    const TAU_MIN = -4, TAU_MAX = 0, DURATION_MS = 6000;
    const step = (ts) => {
      if (last === null) last = ts;
      const elapsed = ts - last;
      last = ts;
      setTau((prev) => {
        const next = prev + (elapsed / DURATION_MS) * (TAU_MAX - TAU_MIN);
        if (next >= TAU_MAX) { setIsPlaying(false); return TAU_MAX; }
        return next;
      });
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Prime-Log Vortex Field</h1>
        <p className="page-subtitle">
          The log-derivative <code>V(s) = ξ′(s)/ξ(s)</code> (the Newman-flow phase
          gradient, analogue of <code>V_t = H_t′/H_t</code>) has a simple pole — a{' '}
          <strong>phase vortex</strong> — at every zero ρ. The phase{' '}
          <code>arg H(s)</code> winds once around each, so{' '}
          <strong>zeros ⟷ vortices</strong> with winding{' '}
          <code>(1/2π)∮V·ds = +1</code>. Under RH every vortex sits on the critical
          line <code>Re s = ½</code>. Push the central one off the line to see what an{' '}
          <em>off-axis zero</em> (an RH violation) would look like.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 480px' }}>
          <VortexCanvas centerIdx={centerIdx} tau={tau} magContours={magContours} showStreamlines={showStreamlines} />
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            window: Re s ∈ [½−{HALF_T}, ½+{HALF_T}], Im s ∈ [{(gc - HALF_T).toFixed(1)}, {(gc + HALF_T).toFixed(1)}] · central zero γ ≈ {gc.toFixed(4)}
          </div>
        </div>

        <div style={{ flex: '0 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Phase arg H(s) (mod 2π)</div>
            <PhaseWheel />
          </div>

          <div className="card">
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Central zero: γ ≈ {gc.toFixed(3)}
              <input type="range" min={1} max={GAMMAS.length - 2} value={centerIdx}
                     onChange={(e) => setCenterIdx(+e.target.value)} style={{ width: '100%', marginTop: 6 }} />
            </label>
          </div>

          <div className="card" style={{ borderLeft: `3px solid ${offAxis ? '#ef4444' : '#22c55e'}` }}>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Heat-flow t (de Bruijn–Newman): <strong style={{ color: offAxis ? '#ef4444' : '#22c55e' }}>{tau >= 0 ? '+' : ''}{tau.toFixed(2)}</strong>
              <input type="range" min={-4} max={4} step={0.05} value={tau}
                     onChange={(e) => { setIsPlaying(false); setTau(+e.target.value); }} style={{ width: '100%', marginTop: 6 }} />
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => {
                  if (tau >= 0) setTau(-4);
                  setIsPlaying((p) => !p);
                }}
                style={{ flex: 1, padding: '5px 0', fontSize: 12, background: isPlaying ? '#475569' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                {isPlaying ? '⏸ Pause' : tau >= 0 ? '↺ Replay' : '▶ Animate'}
              </button>
              <button
                onClick={() => { setIsPlaying(false); setTau(-4); }}
                style={{ padding: '5px 10px', fontSize: 12, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer' }}
              >
                ↺
              </button>
            </div>
            <div style={{ fontSize: 11, color: offAxis ? '#fca5a5' : '#86efac', marginTop: 6 }}>
              {offAxis
                ? 'BELOW Λ: the central vortex is an OFF-AXIS conjugate pair (σ = ½ ± |t|) — an RH violation.'
                : 'At/above Λ (t ≥ 0): every vortex on Re s = ½. Forward heat coalesces off-axis vortices onto the line.'}
            </div>
          </div>

          <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={showStreamlines} onChange={(e) => setShowStreamlines(e.target.checked)} />
            V<sub>t</sub> flow streamlines (Newman flow)
          </label>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={magContours} onChange={(e) => setMagContours(e.target.checked)} />
            |H(s)| level-contour banding
          </label>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>What you're looking at — and the honest ceiling</h3>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Vortices = zeros.</strong> Each colored singularity where all hues meet is a zero ρ of ξ; the phase winds +1 around it (the argument principle).</li>
          <li><strong>Vortex exclusion ⟺ RH.</strong> Under RH every vortex lies on the dashed line Re s = ½. An off-axis vortex (red) is an off-axis zero — exactly an RH violation.</li>
          <li><strong>Heat flow.</strong> The de Bruijn–Newman flow <code>H_t</code> drags vortices toward the line as t increases; Λ is the time below which off-axis vortices first appear. This is the same winding order parameter as the <Link to="/route-map">route map</Link>'s supercritical-winding thread.</li>
          <li style={{ color: '#94a3b8' }}><strong>Honest ceiling:</strong> this picture re-derives Λ ≥ 0 and makes RH visible, but it is <em>not</em> a new rigorous bound and does not beat Platt–Trudgian Λ ≤ 0.2. It's an exact, exploratory visualization — no false QED.</li>
        </ul>
        <div style={{ fontSize: 12, marginTop: 8 }}>
          Related: <Link to="/statistics" style={{ color: '#3b82f6' }}>Zero Statistics</Link> ·{' '}
          <Link to="/viz-prime-caustic" style={{ color: '#3b82f6' }}>Prime Caustics</Link> ·{' '}
          <Link to="/route-map" style={{ color: '#3b82f6' }}>Route Map</Link>
        </div>
      </div>
    </div>
  );
}
