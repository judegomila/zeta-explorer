import React, { useEffect, useRef } from 'react';
import { zetaCriticalStrip } from '../math/zeta.js';

/**
 * ZetaStripLive — compact reusable version of the animated ζ domain coloring
 * (the 404-page field): σ ∈ [0.02, 1.65], t ∈ [1, 33] (first five zeros as
 * rainbow phase vortices, the pole blaze at s = 1), with the twin-ladder
 * interferometer rails breathing across the σ ↔ 1−σ mirror. Progressive field
 * computation (Borwein-accelerated η, visual accuracy), cheap hue-cycle
 * animation; pauses when hidden; respects prefers-reduced-motion.
 */

const SIG_MIN = 0.02, SIG_MAX = 1.65;
const T_MIN = 1.0, T_MAX = 33.0;
const FW = 220, FH = 320;
const ZEROS_T = [14.134725, 21.02204, 25.010858, 30.424876, 32.935062];

export default function ZetaStripLive({ height = 380 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const field = document.createElement('canvas');
    field.width = FW; field.height = FH;
    const fctx = field.getContext('2d');
    const img = fctx.createImageData(FW, FH);
    const argA = new Float32Array(FW * FH);
    const lmagA = new Float32Array(FW * FH);
    let rowsDone = 0;

    const sigAt = (px) => SIG_MIN + (px / (FW - 1)) * (SIG_MAX - SIG_MIN);
    const tAt = (py) => T_MAX - (py / (FH - 1)) * (T_MAX - T_MIN);

    function computeRows(n) {
      const end = Math.min(rowsDone + n, FH);
      for (let py = rowsDone; py < end; py++) {
        const t = tAt(py);
        for (let px = 0; px < FW; px++) {
          const z = zetaCriticalStrip([sigAt(px), t], 24);
          const i = py * FW + px;
          argA[i] = Math.atan2(z[1], z[0]);
          lmagA[i] = Math.log(Math.hypot(z[0], z[1]) + 1e-12);
        }
      }
      rowsDone = end;
    }

    const rgb = [0, 0, 0];
    function hslToRgb(h, s, l, out) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      for (let k = 0; k < 3; k++) {
        let tc = h + (1 - k) / 3;
        tc -= Math.floor(tc);
        let c;
        if (tc < 1 / 6) c = p + (q - p) * 6 * tc;
        else if (tc < 1 / 2) c = q;
        else if (tc < 2 / 3) c = p + (q - p) * (2 / 3 - tc) * 6;
        else c = p;
        out[k] = (c * 255) | 0;
      }
    }

    function recolor(time) {
      const hueShift = time * 0.00004;
      const ripple = time * 0.0011;
      const d = img.data;
      for (let i = 0; i < rowsDone * FW; i++) {
        const h = argA[i] / (2 * Math.PI) + 0.5 + hueShift;
        const lm = lmagA[i];
        const ring = 0.5 + 0.5 * Math.sin(3.0 * lm - ripple);
        let l = 0.24 + 0.30 * Math.tanh(0.55 * lm + 0.35) + 0.16 * ring * ring;
        if (l > 0.92) l = 0.92;
        hslToRgb(h - Math.floor(h), 0.95, l, rgb);
        const j = i * 4;
        d[j] = rgb[0]; d[j + 1] = rgb[1]; d[j + 2] = rgb[2]; d[j + 3] = 255;
      }
      for (let i = rowsDone * FW; i < FW * FH; i++) {
        const j = i * 4;
        d[j] = 10; d[j + 1] = 10; d[j + 2] = 15; d[j + 3] = 255;
      }
      fctx.putImageData(img, 0, 0);
    }

    const sx = (sig, W) => ((sig - SIG_MIN) / (SIG_MAX - SIG_MIN)) * W;
    const sy = (t, H) => ((T_MAX - t) / (T_MAX - T_MIN)) * H;

    function drawOverlay(time, W, H) {
      const sig0 = 0.5 + 0.19 * Math.sin(time * 0.0001 + 1.2);
      const sigA = Math.min(sig0, 1 - sig0);
      const sigB = 1 - sigA;
      const xA = sx(sigA, W), xB = sx(sigB, W), xC = sx(0.5, W);
      const NR = 36;
      ctx.lineWidth = 1;
      for (let r = 0; r < NR; r++) {
        const t = T_MIN + ((r + 0.5) / NR) * (T_MAX - T_MIN);
        const za = zetaCriticalStrip([sigA, t], 18);
        const zb = zetaCriticalStrip([sigB, t], 18);
        const sre = za[0] + zb[0], sim = za[1] + zb[1];
        const inten = (sre * sre + sim * sim) / 4;
        const a = Math.min(0.6, 0.05 + 0.2 * inten);
        const hue = ((Math.atan2(sim, sre) / (2 * Math.PI) + 0.5 + time * 0.00005) % 1) * 360;
        const y = sy(t, H);
        ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${a})`;
        ctx.beginPath(); ctx.moveTo(xA, y); ctx.lineTo(xB, y); ctx.stroke();
      }
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath(); ctx.moveTo(xC, 0); ctx.lineTo(xC, H); ctx.stroke();
      ctx.setLineDash([]);
      for (const tz of ZEROS_T) {
        const y = sy(tz, H);
        const pulse = 3.5 + 1.8 * Math.sin(time * 0.002 + tz);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.arc(xC, y, pulse, 0, 2 * Math.PI); ctx.stroke();
      }
    }

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    function frame(time) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (rowsDone < FH) computeRows(16);
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
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height, display: 'block', borderRadius: 8, background: 'var(--paper)' }}
      />
      <div className="ed-mono" style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 7, lineHeight: 1.5 }}>
        ζ(σ+it) on σ∈[0.02, 1.65], t∈[1, 33] · hue = phase · vortices = the first five zeros (pulsing rings) ·
        pole blaze at σ=1 · rails: twin-ladder interferometer |ζ(σ₀+it)+ζ(1−σ₀+it)|² breathing across the
        σ ↔ 1−σ mirror · visual-accuracy rendering (Borwein η), not certified numerics
      </div>
    </div>
  );
}
