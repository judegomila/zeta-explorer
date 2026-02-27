import React, { useRef, useEffect, useState, useCallback } from 'react';
import { riemannSiegelZ, ZETA_ZEROS, zetaCriticalStrip, cAbs } from '../math/zeta.js';

export default function ZetaLandscapeViz() {
  const canvasRef = useRef();
  const [mode, setMode] = useState('critical-line');
  const [tRange, setTRange] = useState([0, 50]);
  const [sigmaRange] = useState([0.05, 0.95]);

  const drawCriticalLine = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth * 2;
    const h = canvas.height = 400 * 2;
    ctx.scale(2, 2);
    const dw = w / 2;
    const dh = h / 2;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, dw, dh);

    const tMin = tRange[0];
    const tMax = tRange[1];
    const steps = Math.min(dw, 600);
    const dt = (tMax - tMin) / steps;

    // Compute Z(t) values
    const values = [];
    for (let i = 0; i <= steps; i++) {
      const t = tMin + i * dt;
      const z = t > 2 ? riemannSiegelZ(t) : 0;
      values.push({ t, z });
    }

    const maxAbs = Math.max(1, ...values.map(v => Math.abs(v.z)));
    const xScale = dw / steps;
    const yMid = dh / 2;
    const yScale = (dh / 2 - 20) / maxAbs;

    // Grid
    ctx.strokeStyle = '#1a1f36';
    ctx.lineWidth = 0.5;
    for (let t = Math.ceil(tMin); t <= tMax; t += 5) {
      const x = ((t - tMin) / (tMax - tMin)) * dw;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, dh); ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(`t=${t}`, x + 2, dh - 4);
    }

    // Zero line
    ctx.strokeStyle = '#2a3050';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, yMid); ctx.lineTo(dw, yMid); ctx.stroke();

    // Z(t) curve with gradient coloring
    for (let i = 1; i <= steps; i++) {
      const x0 = (i - 1) * xScale;
      const x1 = i * xScale;
      const y0 = yMid - values[i - 1].z * yScale;
      const y1 = yMid - values[i].z * yScale;

      // Color: blue when positive, orange when negative
      const val = values[i].z;
      const intensity = Math.min(1, Math.abs(val) / maxAbs);
      if (val >= 0) {
        ctx.strokeStyle = `rgba(59,130,246,${0.4 + intensity * 0.6})`;
      } else {
        ctx.strokeStyle = `rgba(245,158,11,${0.4 + intensity * 0.6})`;
      }
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Fill area
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = val >= 0 ? '#3b82f6' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(x0, yMid);
      ctx.lineTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1, yMid);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Mark zeta zeros
    for (const gamma of ZETA_ZEROS) {
      if (gamma >= tMin && gamma <= tMax) {
        const x = ((gamma - tMin) / (tMax - tMin)) * dw;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, yMid - 8); ctx.lineTo(x, yMid + 8); ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, yMid, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('Riemann-Siegel Z(t) on the Critical Line σ = ½', 12, 18);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('Red dots mark nontrivial zeta zeros (Z(t) = 0)', 12, 34);

  }, [tRange]);

  const drawHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth * 2;
    const h = canvas.height = 400 * 2;
    ctx.scale(2, 2);
    const dw = w / 2;
    const dh = h / 2;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, dw, dh);

    const res = 100;
    const tMin = tRange[0] || 0.5;
    const tMax = tRange[1] || 50;
    const sMin = sigmaRange[0];
    const sMax = sigmaRange[1];
    const cellW = dw / res;
    const cellH = dh / res;

    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const sigma = sMin + (i / res) * (sMax - sMin);
        const t = tMin + (j / res) * (tMax - tMin);
        const z = zetaCriticalStrip([sigma, t], 50);
        const mag = cAbs(z);
        const logMag = Math.log(1 + mag);
        const normalized = Math.min(1, logMag / 4);

        // Colormap: dark blue -> cyan -> yellow -> red
        let r, g, b;
        if (normalized < 0.25) {
          const t2 = normalized / 0.25;
          r = 10; g = 10 + t2 * 80; b = 60 + t2 * 140;
        } else if (normalized < 0.5) {
          const t2 = (normalized - 0.25) / 0.25;
          r = 10 + t2 * 50; g = 90 + t2 * 120; b = 200 - t2 * 40;
        } else if (normalized < 0.75) {
          const t2 = (normalized - 0.5) / 0.25;
          r = 60 + t2 * 190; g = 210 - t2 * 60; b = 160 - t2 * 130;
        } else {
          const t2 = (normalized - 0.75) / 0.25;
          r = 250; g = 150 - t2 * 100; b = 30 - t2 * 20;
        }

        ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
        ctx.fillRect(i * cellW, (res - 1 - j) * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // Critical line overlay
    const critX = ((0.5 - sMin) / (sMax - sMin)) * dw;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(critX, 0); ctx.lineTo(critX, dh); ctx.stroke();
    ctx.setLineDash([]);

    // Mark zeros
    for (const gamma of ZETA_ZEROS) {
      if (gamma >= tMin && gamma <= tMax) {
        const y = dh - ((gamma - tMin) / (tMax - tMin)) * dh;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(critX, y, 4, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // Axes labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    ctx.fillText('|ζ(σ + it)| Heatmap in the Critical Strip', 12, 18);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText(`σ: ${sMin} → ${sMax}`, 12, 34);
    ctx.fillText(`t: ${tMin} → ${tMax}`, 12, 48);
    ctx.fillText('White circles: known zeros on σ=½', 12, 62);
  }, [tRange, sigmaRange]);

  useEffect(() => {
    if (mode === 'critical-line') drawCriticalLine();
    else drawHeatmap();
  }, [mode, drawCriticalLine, drawHeatmap]);

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label>View Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="critical-line">Critical Line Z(t)</option>
            <option value="heatmap">|ζ(s)| Heatmap</option>
          </select>
        </div>
        <div className="control-group">
          <label>t range start</label>
          <input type="range" min="0" max="100" step="1" value={tRange[0]}
            onChange={e => setTRange([+e.target.value, tRange[1]])} />
          <span className="control-value">{tRange[0]}</span>
        </div>
        <div className="control-group">
          <label>t range end</label>
          <input type="range" min="10" max="150" step="1" value={tRange[1]}
            onChange={e => setTRange([tRange[0], +e.target.value])} />
          <span className="control-value">{tRange[1]}</span>
        </div>
      </div>
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 400 }} />
      </div>
    </div>
  );
}
