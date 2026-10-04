import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { zetaCriticalStrip } from '../math/zeta.js';

/**
 * 404 — a full-bleed animated domain coloring of ζ(s) over the most interesting
 * cut of the complex plane the strip evaluator can honestly render:
 *   σ ∈ [0.02, 1.65], t ∈ [1.0, 36.5]
 * which contains the pole at s = 1 (a white blaze) and the first five
 * nontrivial zeros on the critical line (rainbow phase vortices at
 * t ≈ 14.13, 21.02, 25.01, 30.42, 32.94). Hue = arg ζ (cycling), lightness =
 * log|ζ| with breathing contour rings.
 *
 * Overlaid: a twin-ladder interferometer — two rails at σ₀ and 1−σ₀ (σ₀ drifts
 * slowly), with rungs whose brightness is the two-channel interference
 * intensity |ζ(σ₀+it) + ζ(1−σ₀+it)|²; the critical line is the balance axis.
 *
 * Visual-accuracy rendering (Borwein-accelerated η), not certified numerics.
 * The field is computed once (progressively, row chunks per frame) and cached
 * as arg/log|ζ| arrays; animation is a cheap recolor pass.
 */

// Field window (kept where the eta-acceleration is honest: Re s > 0).
const SIG_MIN = 0.02, SIG_MAX = 1.65;
const T_MIN = 1.0, T_MAX = 36.5;
const FW = 300, FH = 520; // field resolution (upscaled with smoothing)
const ZEROS_T = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062];

export default function NotFoundPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    // Offscreen field buffer.
    const field = document.createElement('canvas');
    field.width = FW; field.height = FH;
    const fctx = field.getContext('2d');
    const img = fctx.createImageData(FW, FH);

    // Cached field data: arg and log|zeta| per pixel.
    const argA = new Float32Array(FW * FH);
    const lmagA = new Float32Array(FW * FH);
    let rowsDone = 0;

    const sigAt = (px) => SIG_MIN + (px / (FW - 1)) * (SIG_MAX - SIG_MIN);
    const tAt = (py) => T_MAX - (py / (FH - 1)) * (T_MAX - T_MIN); // t upward

    function computeRows(n) {
      const end = Math.min(rowsDone + n, FH);
      for (let py = rowsDone; py < end; py++) {
        const t = tAt(py);
        for (let px = 0; px < FW; px++) {
          const z = zetaCriticalStrip([sigAt(px), t], 28);
          const i = py * FW + px;
          argA[i] = Math.atan2(z[1], z[0]);
          lmagA[i] = Math.log(Math.hypot(z[0], z[1]) + 1e-12);
        }
      }
      rowsDone = end;
    }

    // HSL -> RGB (h,s,l in [0,1]) — small and allocation-free.
    function hslToRgb(h, s, l, out) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      for (let k = 0; k < 3; k++) {
        let tc = h + (1 - k) / 3; // r,g,b via k=0,1,2
        tc -= Math.floor(tc);
        let c;
        if (tc < 1 / 6) c = p + (q - p) * 6 * tc;
        else if (tc < 1 / 2) c = q;
        else if (tc < 2 / 3) c = p + (q - p) * (2 / 3 - tc) * 6;
        else c = p;
        out[k] = (c * 255) | 0;
      }
    }

    const rgb = [0, 0, 0];
    function recolor(time) {
      const hueShift = time * 0.000045; // slow full-rainbow drift
      const ripple = time * 0.0012;
      const d = img.data;
      for (let i = 0; i < rowsDone * FW; i++) {
        const h = argA[i] / (2 * Math.PI) + 0.5 + hueShift;
        const lm = lmagA[i];
        // breathing log-|zeta| contour rings + brightness from magnitude
        const ring = 0.5 + 0.5 * Math.sin(3.0 * lm - ripple);
        let l = 0.24 + 0.30 * Math.tanh(0.55 * lm + 0.35) + 0.16 * ring * ring;
        if (l > 0.92) l = 0.92; // clamp the pole blaze
        hslToRgb(h - Math.floor(h), 0.95, l, rgb);
        const j = i * 4;
        d[j] = rgb[0]; d[j + 1] = rgb[1]; d[j + 2] = rgb[2]; d[j + 3] = 255;
      }
      // rows not yet computed: near-black
      for (let i = rowsDone * FW; i < FW * FH; i++) {
        const j = i * 4;
        d[j] = 8; d[j + 1] = 9; d[j + 2] = 14; d[j + 3] = 255;
      }
      fctx.putImageData(img, 0, 0);
    }

    // Map field coords -> screen.
    function sx(sig, W) { return ((sig - SIG_MIN) / (SIG_MAX - SIG_MIN)) * W; }
    function sy(t, H) { return ((T_MAX - t) / (T_MAX - T_MIN)) * H; }

    const railVals = { sig0: 0.3, top: [], n: 0 }; // cached rail interference

    function drawOverlay(time, W, H) {
      const sig0 = 0.5 + 0.205 * Math.sin(time * 0.00011 + 1.2); // drifts 0.295..0.705
      const sigA = Math.min(sig0, 1 - sig0);
      const sigB = 1 - sigA;
      const xA = sx(sigA, W), xB = sx(sigB, W), xC = sx(0.5, W);

      // rungs: interference intensity |ζ(a) + ζ(b)|² across t
      const NR = 64;
      ctx.lineWidth = 1.2;
      for (let r = 0; r < NR; r++) {
        const t = T_MIN + ((r + 0.5) / NR) * (T_MAX - T_MIN);
        const za = zetaCriticalStrip([sigA, t], 22);
        const zb = zetaCriticalStrip([sigB, t], 22);
        const sre = za[0] + zb[0], sim = za[1] + zb[1];
        const inten = (sre * sre + sim * sim) / 4; // 0..~few
        const a = Math.min(0.75, 0.06 + 0.24 * inten);
        const hue = ((Math.atan2(sim, sre) / (2 * Math.PI) + 0.5 + time * 0.00005) % 1) * 360;
        const y = sy(t, H);
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${a})`;
        ctx.beginPath(); ctx.moveTo(xA, y); ctx.lineTo(xB, y); ctx.stroke();
      }

      // rails
      const railGrad = (x) => {
        const g = ctx.createLinearGradient(x, 0, x, H);
        g.addColorStop(0, 'rgba(255,255,255,0.0)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.55)');
        g.addColorStop(1, 'rgba(255,255,255,0.0)');
        return g;
      };
      ctx.lineWidth = 2;
      ctx.strokeStyle = railGrad(xA);
      ctx.beginPath(); ctx.moveTo(xA, 0); ctx.lineTo(xA, H); ctx.stroke();
      ctx.strokeStyle = railGrad(xB);
      ctx.beginPath(); ctx.moveTo(xB, 0); ctx.lineTo(xB, H); ctx.stroke();

      // the critical line — the interferometer's balance axis
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.beginPath(); ctx.moveTo(xC, 0); ctx.lineTo(xC, H); ctx.stroke();
      ctx.setLineDash([]);

      // zero vortices: pulsing rings on the critical line
      for (const tz of ZEROS_T) {
        const y = sy(tz, H);
        const pulse = 4.5 + 2.2 * Math.sin(time * 0.002 + tz);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.arc(xC, y, pulse, 0, 2 * Math.PI); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath(); ctx.arc(xC, y, pulse + 5, 0, 2 * Math.PI); ctx.stroke();
      }

      // pole marker at s = 1 (t -> just below our window floor; annotate at edge)
      const xP = sx(1.0, W);
      ctx.font = '11px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('σ=1 (pole below)', xP + 6, H - 10);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`σ₀=${sigA.toFixed(2)} ↔ ${sigB.toFixed(2)} · |ζ(σ₀+it)+ζ(1−σ₀+it)|² rungs`, 12, H - 10);
    }

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    function frame(time) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (rowsDone < FH) computeRows(12); // progressive field development
      if (reduced && rowsDone >= FH && time - last < 100000 && last !== 0) return;
      last = time;
      const W = canvas.width = canvas.clientWidth;
      const H = canvas.height = canvas.clientHeight;
      recolor(reduced ? 0 : time);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(field, 0, 0, W, H);
      drawOverlay(reduced ? 0 : time, W, H);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 56px)', overflow: 'hidden', background: 'var(--paper)' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
      {/* content overlay */}
      <div style={{
        position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)',
        textAlign: 'center', padding: '40px 20px', pointerEvents: 'none',
      }}>
        <h1 style={{
          fontSize: 96, fontWeight: 800, margin: 0, lineHeight: 1,
          fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink)',
          textShadow: '0 2px 30px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9)',
        }}>404</h1>
        <p style={{
          fontSize: 17, color: 'var(--ink)', margin: '14px 0 22px', maxWidth: 560,
          textShadow: '0 1px 14px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.95)',
        }}>
          Not found — you've wandered off every mapped route. Behind this page:
          ζ(s) over the critical strip, hue = phase, vortices = the first five
          nontrivial zeros, with a twin-ladder interferometer breathing across
          the σ ↔ 1−σ mirror.
        </p>
        <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" style={btn}>Home</Link>
          <Link to="/atlas" style={btn}>The atlas</Link>
          <Link to="/zeta" style={btn}>Zeta landscape</Link>
          <button
            type="button"
            style={{ ...btn, cursor: 'pointer' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          >
            Search ⌘K
          </button>
        </div>
        <p style={{
          position: 'absolute', bottom: 34, left: 0, right: 0, margin: '0 auto', maxWidth: 720,
          fontSize: 11, color: 'color-mix(in srgb, var(--ink) 75%, transparent)', fontFamily: 'var(--font-mono, monospace)',
          textShadow: '0 1px 8px rgba(0,0,0,0.9)', pointerEvents: 'none', padding: '0 16px',
        }}>
          domain coloring of ζ(σ+it), σ∈[0.02,1.65], t∈[1,36.5] · Borwein-accelerated η —
          visual-accuracy rendering, not certified numerics · rung brightness = two-channel
          interference |ζ(σ₀+it)+ζ(1−σ₀+it)|²
        </p>
      </div>
    </div>
  );
}

const btn = {
  padding: '10px 18px',
  borderRadius: 8,
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.45)',
  color: '#fff',
  fontSize: 14,
  fontWeight: 600,
  textDecoration: 'none',
  backdropFilter: 'blur(6px)',
  textShadow: '0 1px 6px rgba(0,0,0,0.8)',
};
