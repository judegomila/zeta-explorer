import { InlineMath } from './KaTeXMath.jsx';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { energyLandscape } from '../math/oscillators.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import ThermoBar from './ThermoBar.jsx';

/**
 * 2D heatmap of the system energy landscape in the (σ, t) plane.
 * Shows the "valley" along σ = 1/2 where the Hamiltonian is minimized.
 */
export default function EnergyLandscapeViz() {
  const canvasRef = useRef();
  const [numPrimesDisplay, setNumPrimesDisplay] = useState(8);
  const [numPrimes, setNumPrimes] = useState(8);
  const debounceRef = useRef();
  const [tMax, setTMax] = useState(50);
  const [metric, setMetric] = useState('energy');
  const [hoverInfo, setHoverInfo] = useState(null);
  const landscapeRef = useRef(null);

  // Memoize the expensive landscape computation — only recompute when
  // numPrimes or tMax change, NOT when the metric dropdown changes.
  const landscape = useMemo(() => {
    const sigmaRange = [0.05, 0.95];
    const tRange = [0.5, tMax];
    const res = 60;
    return energyLandscape(sigmaRange, tRange, res, numPrimes);
  }, [numPrimes, tMax]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const dw = canvas.clientWidth;
    const dh = 440;
    canvas.width = dw * dpr;
    canvas.height = dh * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, dw, dh);

    const sigmaRange = [0.05, 0.95];
    const tRange = [0.5, tMax];
    const res = 60;
    landscapeRef.current = landscape;

    const cellW = dw / (res + 1);
    const cellH = dh / (res + 1);

    // Find min/max for normalization
    const values = landscape.data.map(d => {
      if (metric === 'energy') return d.energy;
      if (metric === 'mismatch') return d.mismatch;
      if (metric === 'directMag') return d.directMag;
      return d.dualMag;
    });
    const vMin = Math.min(...values);
    const vMax = Math.max(...values);
    const vRange = vMax - vMin || 1;

    // Draw heatmap
    for (const d of landscape.data) {
      const val = metric === 'energy' ? d.energy :
                  metric === 'mismatch' ? d.mismatch :
                  metric === 'directMag' ? d.directMag : d.dualMag;
      const norm = (val - vMin) / vRange;

      const i = Math.round((d.sigma - sigmaRange[0]) / (sigmaRange[1] - sigmaRange[0]) * res);
      const j = Math.round((d.t - tRange[0]) / (tRange[1] - tRange[0]) * res);

      // Colormap: dark blue → teal → yellow → red (for energy)
      // Or cool blue → white (for mismatch near 0)
      let r, g, b;
      if (metric === 'mismatch') {
        // Blue when matched (low), red when mismatched (high)
        if (norm < 0.3) {
          const t2 = norm / 0.3;
          r = 10 + t2 * 30; g = 40 + t2 * 80; b = 120 + t2 * 80;
        } else if (norm < 0.6) {
          const t2 = (norm - 0.3) / 0.3;
          r = 40 + t2 * 160; g = 120 + t2 * 80; b = 200 - t2 * 100;
        } else {
          const t2 = (norm - 0.6) / 0.4;
          r = 200 + t2 * 55; g = 200 - t2 * 150; b = 100 - t2 * 80;
        }
      } else {
        // Viridis-like
        if (norm < 0.25) {
          const t2 = norm / 0.25;
          r = 68 - t2 * 20; g = 1 + t2 * 50; b = 84 + t2 * 50;
        } else if (norm < 0.5) {
          const t2 = (norm - 0.25) / 0.25;
          r = 48 + t2 * 5; g = 51 + t2 * 80; b = 134 - t2 * 20;
        } else if (norm < 0.75) {
          const t2 = (norm - 0.5) / 0.25;
          r = 53 + t2 * 120; g = 131 + t2 * 50; b = 114 - t2 * 60;
        } else {
          const t2 = (norm - 0.75) / 0.25;
          r = 173 + t2 * 80; g = 181 + t2 * 30; b = 54 - t2 * 30;
        }
      }

      ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
      ctx.fillRect(i * cellW, (res - j) * cellH, cellW + 0.5, cellH + 0.5);
    }

    // Critical line σ = 0.5
    const critX = ((0.5 - sigmaRange[0]) / (sigmaRange[1] - sigmaRange[0])) * dw;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(critX, 0); ctx.lineTo(critX, dh); ctx.stroke();
    ctx.setLineDash([]);

    // Known zeros
    for (const gamma of ZETA_ZEROS) {
      if (gamma >= tRange[0] && gamma <= tRange[1]) {
        const zy = dh - ((gamma - tRange[0]) / (tRange[1] - tRange[0])) * dh;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(critX, zy, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
      }
    }

    // Axis labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px sans-serif';
    const titles = {
      energy: 'System Energy Landscape H(σ, t)',
      mismatch: 'Impedance Mismatch |Z_direct − Z_dual|',
      directMag: 'Direct Ladder |ζ(s)|',
      dualMag: 'Dual Ladder |ζ(1−s)|',
    };
    ctx.fillText(titles[metric], 10, 18);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Dashed line: σ = ½  |  Circles: zeta zeros', 10, 36);

    // σ tick labels along bottom edge
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (const s of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
      const tx = ((s - sigmaRange[0]) / (sigmaRange[1] - sigmaRange[0])) * dw;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tx, dh); ctx.lineTo(tx, dh - 4); ctx.stroke();
      ctx.fillStyle = 'rgba(17,24,39,0.75)';
      ctx.fillRect(tx - 12, dh - 17, 24, 13);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(s.toFixed(1), tx, dh - 6);
    }

    // t tick labels along left edge
    ctx.textAlign = 'left';
    ctx.font = '10px monospace';
    for (let k = 1; k <= 5; k++) {
      const tVal = tRange[0] + (k / 5) * (tRange[1] - tRange[0]);
      const ty = dh - (k / 5) * dh;
      if (ty < 50) continue;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(4, ty); ctx.stroke();
      const lbl = tVal.toFixed(0);
      ctx.fillStyle = 'rgba(17,24,39,0.75)';
      ctx.fillRect(5, ty - 6, lbl.length * 7 + 4, 12);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(lbl, 7, ty + 4);
    }
    ctx.textAlign = 'start';

    // Axis name labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('σ (Re s)', dw / 2, dh - 4);
    ctx.textAlign = 'start';

    ctx.save();
    ctx.translate(2, dh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('t (Im s)', 0, 10);
    ctx.restore();

    // Color bar
    const barX = dw - 30;
    const barH = dh - 20;
    for (let i = 0; i < barH; i++) {
      const norm = i / barH;
      let r, g, b;
      if (metric === 'mismatch') {
        if (norm < 0.3) { r = 10 + norm/0.3 * 30; g = 40 + norm/0.3 * 80; b = 120 + norm/0.3 * 80; }
        else if (norm < 0.6) { const t2 = (norm-0.3)/0.3; r = 40+t2*160; g = 120+t2*80; b = 200-t2*100; }
        else { const t2 = (norm-0.6)/0.4; r = 200+t2*55; g = 200-t2*150; b = 100-t2*80; }
      } else {
        if (norm < 0.25) { const t2 = norm/0.25; r = 68-t2*20; g = 1+t2*50; b = 84+t2*50; }
        else if (norm < 0.5) { const t2 = (norm-0.25)/0.25; r = 48+t2*5; g = 51+t2*80; b = 134-t2*20; }
        else if (norm < 0.75) { const t2 = (norm-0.5)/0.25; r = 53+t2*120; g = 131+t2*50; b = 114-t2*60; }
        else { const t2 = (norm-0.75)/0.25; r = 173+t2*80; g = 181+t2*30; b = 54-t2*30; }
      }
      ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
      ctx.fillRect(barX, barH - i + 10, 16, 1);
    }
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px monospace';
    ctx.fillText(vMax.toFixed(1), barX - 2, 18);
    ctx.fillText(vMin.toFixed(1), barX - 2, barH + 12);

    // Colorbar title label (rotated, beside the bar)
    const barLabels = {
      energy: 'H(σ,t)',
      mismatch: '|Z_dir − Z_dual|',
      directMag: '|ζ(s)|',
      dualMag: '|ζ(1−s)|',
    };
    ctx.save();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 10px sans-serif';
    ctx.translate(barX + 20, (barH + 10) / 2 + 5);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(barLabels[metric], 0, 0);
    ctx.restore();

  }, [landscape, tMax, metric]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleHover = useCallback((e) => {
    if (!landscapeRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const sigma = 0.05 + mx * 0.9;
    const t = 0.5 + (1 - my) * (tMax - 0.5);

    // Look up the nearest grid point to show the metric value
    const ls = landscapeRef.current;
    const res = ls.resolution;
    const gi = Math.round((sigma - ls.sigmaRange[0]) / (ls.sigmaRange[1] - ls.sigmaRange[0]) * res);
    const gj = Math.round((t - ls.tRange[0]) / (ls.tRange[1] - ls.tRange[0]) * res);
    const idx = Math.min(Math.max(gi, 0), res) * (res + 1) + Math.min(Math.max(gj, 0), res);
    const pt = ls.data[idx];
    const val = pt ? (metric === 'energy' ? pt.energy :
                      metric === 'mismatch' ? pt.mismatch :
                      metric === 'directMag' ? pt.directMag : pt.dualMag) : null;

    setHoverInfo({ sigma: sigma.toFixed(3), t: t.toFixed(2), value: val != null ? val.toFixed(4) : null });
  }, [tMax, metric]);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        The 2D heatmap shows the selected quantity over the <InlineMath tex="(\\sigma, t)" /> plane.
        <strong>System Energy</strong> shows <InlineMath tex="\\mathcal{H}(\\sigma+it)" /> with its valley along <InlineMath tex="\\sigma = 0.5" />.
        <strong>Impedance Mismatch</strong> shows <InlineMath tex="|Z_{\\text{dir}} - Z_{\\text{dual}}|" />, minimized (not zero) on the critical line where the impedances are conjugate-matched.
        The <strong>direct/dual magnitudes</strong> show <InlineMath tex="|\\zeta(s)|" /> and <InlineMath tex="|\\zeta(1-s)|" /> with their
        symmetric zero structure. White circles mark known zeta zeros <InlineMath tex="\\rho_n" />.
        <strong> Look for:</strong> the dark valley along <InlineMath tex="\\sigma = 0.5" /> and zeros sitting at valley floor.
      </div>
      <div className="controls">
        <div className="control-group">
          <label>Metric</label>
          <select value={metric} onChange={e => setMetric(e.target.value)}>
            <option value="energy">System Energy</option>
            <option value="mismatch">Impedance Mismatch</option>
            <option value="directMag">|ζ(s)| Direct</option>
            <option value="dualMag">|ζ(1-s)| Dual</option>
          </select>
        </div>
        <div className="control-group">
          <label>t max</label>
          <input type="range" min="10" max="80" step="5" value={tMax}
            onChange={e => setTMax(+e.target.value)} />
          <span className="control-value">{tMax} <span style={{ color: '#64748b', fontSize: 11 }}>({ZETA_ZEROS.filter(g => g <= tMax).length} zeros visible)</span></span>
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="3" max="30" step="1" value={numPrimesDisplay}
            onChange={e => {
              const v = +e.target.value;
              setNumPrimesDisplay(v);
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => setNumPrimes(v), 200);
            }} />
          <span className="control-value">{numPrimesDisplay} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimesDisplay)[numPrimesDisplay - 1]})</span></span>
        </div>
        {hoverInfo ? (
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#06b6d4' }}>
            <InlineMath tex="\\sigma" />={hoverInfo.sigma} <InlineMath tex="t" />={hoverInfo.t}
            {hoverInfo.value != null && (
              <span style={{ marginLeft: 8, color: '#f59e0b' }}>
                {metric === 'energy' ? 'H' : metric === 'mismatch' ? '|Z₁−Z₂|' : metric === 'directMag' ? '|ζ(s)|' : '|ζ(1−s)|'}={hoverInfo.value}
              </span>
            )}
          </div>
        ) : (
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
            Hover over heatmap to inspect values
          </div>
        )}
      </div>
      <ThermoBar sigma={0.5} t={tMax / 2} numPrimes={numPrimes} />
      <div className="viz-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 440, cursor: 'crosshair' }}
          onMouseMove={handleHover} onMouseLeave={() => setHoverInfo(null)} />
      </div>
    </div>
  );
}
