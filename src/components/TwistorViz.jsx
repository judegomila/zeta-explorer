import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import * as d3 from 'd3';
import { getPrimes } from '../math/primes.js';
import { cAbs, ZETA_ZEROS } from '../math/zeta.js';
import { losslessBridge } from '../math/oscillators.js';
import {
  twistorFromS, dualTwistorFromS, intertwiner,
  incidenceRelation, twistorCorrespondence, penroseTransformScan,
} from '../math/twistor.js';
import ThermoBar from './ThermoBar.jsx';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

const TABS = [
  { id: 'correspondence', label: 'Correspondence' },
  { id: 'penrose', label: 'Penrose Transform' },
  { id: 'incidence', label: 'Incidence Relation' },
  { id: 'dualPair', label: 'Dual Pair' },
];

// ─── Tab 1: Correspondence (SVG) ────────────────────────────────────
// Shows s-plane on the left, twistor space on the right, with connecting arcs.
function CorrespondenceTab({ sigma, t, numPrimes }) {
  const svgRef = useRef();

  const data = useMemo(() => {
    const s = [sigma, t];
    const Z = twistorFromS(s);
    const W = dualTwistorFromS(s);
    const I = intertwiner(Z, s);
    const inc = incidenceRelation(Z, W);
    const bridge = losslessBridge(s);
    return { Z, W, I, inc, bridge };
  }, [sigma, t]);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 900;
    const height = 480;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const { Z, W, I, inc, bridge } = data;
    const midX = width / 2;

    // ── Left Panel: s-plane ──
    const sPlaneX = width * 0.22;
    const sPlaneY = height * 0.45;
    const sPlaneR = Math.min(width * 0.18, 140);

    // s-plane circle
    svg.append('circle').attr('cx', sPlaneX).attr('cy', sPlaneY).attr('r', sPlaneR)
      .attr('fill', TK_ALPHA(ED.paper2, 0.6)).attr('stroke', ED.rule).attr('stroke-width', 1);

    // Critical line at σ=0.5
    const critX = sPlaneX + ((0.5 - 0.5) / 1.0) * sPlaneR; // centered at σ=0.5
    svg.append('line')
      .attr('x1', sPlaneX).attr('y1', sPlaneY - sPlaneR)
      .attr('x2', sPlaneX).attr('y2', sPlaneY + sPlaneR)
      .attr('stroke', ED.series3).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.6);

    svg.append('text').attr('x', sPlaneX + 4).attr('y', sPlaneY - sPlaneR - 6)
      .attr('fill', ED.series3).attr('font-size', 9).text('σ = ½');

    // Axes
    svg.append('line')
      .attr('x1', sPlaneX - sPlaneR).attr('y1', sPlaneY)
      .attr('x2', sPlaneX + sPlaneR).attr('y2', sPlaneY)
      .attr('stroke', ED.rule).attr('stroke-width', 0.5);
    svg.append('text').attr('x', sPlaneX + sPlaneR + 4).attr('y', sPlaneY + 4)
      .attr('fill', ED.inkFaint).attr('font-size', 9).text('σ');
    svg.append('text').attr('x', sPlaneX - 12).attr('y', sPlaneY - sPlaneR - 6)
      .attr('fill', ED.inkFaint).attr('font-size', 9).text('t');

    // Plot s point
    const sNormSig = Math.max(-1, Math.min(1, (sigma - 0.5) / 0.5));
    const sNormT = Math.max(-1, Math.min(1, t / 60));
    const sPx = sPlaneX + sNormSig * sPlaneR;
    const sPy = sPlaneY - sNormT * sPlaneR;
    svg.append('circle').attr('cx', sPx).attr('cy', sPy).attr('r', 6)
      .attr('fill', ED.series1).attr('stroke', '#fff').attr('stroke-width', 1.5);
    svg.append('text').attr('x', sPx + 10).attr('y', sPy + 4)
      .attr('fill', ED.series1).attr('font-size', 10).attr('font-weight', 600)
      .text(`s = ${sigma.toFixed(2)} + ${t.toFixed(1)}i`);

    // Plot 1-s point
    const dualSig = -sNormSig;
    const dualT = -sNormT;
    const dPx = sPlaneX + dualSig * sPlaneR;
    const dPy = sPlaneY - dualT * sPlaneR;
    svg.append('circle').attr('cx', dPx).attr('cy', dPy).attr('r', 5)
      .attr('fill', ED.brassDeco).attr('stroke', '#fff').attr('stroke-width', 1.5);
    svg.append('text').attr('x', dPx + 10).attr('y', dPy + 4)
      .attr('fill', ED.brass).attr('font-size', 10).attr('font-weight', 600)
      .text(`1−s`);

    // Title
    svg.append('text').attr('x', sPlaneX).attr('y', 24)
      .attr('text-anchor', 'middle').attr('fill', ED.ink)
      .attr('font-size', 13).attr('font-weight', 600).text('s-Plane');

    // ── Right Panel: Twistor Space ──
    const twistX = width * 0.75;
    const twistY = height * 0.45;
    const twistR = Math.min(width * 0.2, 160);

    svg.append('text').attr('x', twistX).attr('y', 24)
      .attr('text-anchor', 'middle').attr('fill', ED.ink)
      .attr('font-size', 13).attr('font-weight', 600).text('Twistor Space');

    // Background
    svg.append('circle').attr('cx', twistX).attr('cy', twistY).attr('r', twistR)
      .attr('fill', TK_ALPHA(ED.paper2, 0.6)).attr('stroke', ED.rule).attr('stroke-width', 1);

    // Twistor Z as vector
    const zScale = Math.min(twistR * 0.8, twistR * 0.8 / Math.max(Z.norm, 0.5));
    const zOmegaX = twistX + Z.omega[0] * zScale;
    const zOmegaY = twistY - Z.omega[1] * zScale;

    // Arrow for Z
    svg.append('line')
      .attr('x1', twistX).attr('y1', twistY)
      .attr('x2', zOmegaX).attr('y2', zOmegaY)
      .attr('stroke', ED.series1).attr('stroke-width', 2.5)
      .attr('marker-end', 'url(#arrowBlue)');
    svg.append('circle').attr('cx', zOmegaX).attr('cy', zOmegaY).attr('r', 4)
      .attr('fill', ED.series1);
    svg.append('text')
      .attr('x', zOmegaX + 8).attr('y', zOmegaY - 6)
      .attr('fill', ED.series1).attr('font-size', 11).attr('font-weight', 700)
      .text('Z');

    // Dual twistor W as vector
    const wOmegaX = twistX + W.omega[0] * zScale;
    const wOmegaY = twistY - W.omega[1] * zScale;

    svg.append('line')
      .attr('x1', twistX).attr('y1', twistY)
      .attr('x2', wOmegaX).attr('y2', wOmegaY)
      .attr('stroke', ED.brassDeco).attr('stroke-width', 2.5)
      .attr('marker-end', 'url(#arrowGold)');
    svg.append('circle').attr('cx', wOmegaX).attr('cy', wOmegaY).attr('r', 4)
      .attr('fill', ED.brassDeco);
    svg.append('text')
      .attr('x', wOmegaX + 8).attr('y', wOmegaY - 6)
      .attr('fill', ED.brass).attr('font-size', 11).attr('font-weight', 700)
      .text('W');

    // Intertwiner arc between Z and W endpoints
    const arcColor = inc.satisfied ? ED.series3 : ED.series2;
    const arcMidX = (zOmegaX + wOmegaX) / 2;
    const arcMidY = (zOmegaY + wOmegaY) / 2 - 20;
    svg.append('path')
      .attr('d', `M${zOmegaX},${zOmegaY} Q${arcMidX},${arcMidY} ${wOmegaX},${wOmegaY}`)
      .attr('fill', 'none').attr('stroke', arcColor).attr('stroke-width', 2)
      .attr('stroke-dasharray', inc.satisfied ? 'none' : '4,3');

    svg.append('text')
      .attr('x', arcMidX).attr('y', arcMidY - 6)
      .attr('text-anchor', 'middle').attr('fill', arcColor)
      .attr('font-size', 10).attr('font-weight', 600)
      .text(inc.satisfied ? 'INCIDENT (Z·W ≈ 0)' : `|Z·W| = ${inc.magnitude.toFixed(3)}`);

    // ── Connecting arrow s-plane → twistor ──
    svg.append('path')
      .attr('d', `M${sPlaneX + sPlaneR + 15},${sPlaneY} Q${midX},${sPlaneY - 30} ${twistX - twistR - 15},${twistY}`)
      .attr('fill', 'none').attr('stroke', ED.series5).attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('marker-end', 'url(#arrowPurple)');

    svg.append('text').attr('x', midX).attr('y', sPlaneY - 36)
      .attr('text-anchor', 'middle').attr('fill', ED.series5)
      .attr('font-size', 10).attr('font-weight', 600)
      .text('Twistor Map');

    // ── Arrow markers ──
    const defs = svg.append('defs');
    [['arrowBlue', ED.series1], ['arrowGold', ED.series4], ['arrowPurple', ED.series5]].forEach(([id, color]) => {
      defs.append('marker').attr('id', id)
        .attr('viewBox', '0 0 10 6').attr('refX', 10).attr('refY', 3)
        .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
        .append('path').attr('d', 'M0,0 L10,3 L0,6 Z').attr('fill', color);
    });

    // ── Stats panel at bottom ──
    const statsY = height - 60;
    const stats = [
      [`||Z|| = ${Z.norm.toFixed(3)}`, ED.series1],
      [`||W|| = ${W.norm.toFixed(3)}`, ED.series4],
      [`|χ(s)| = ${bridge.magnitude.toFixed(3)}`, ED.series5],
      [`|Z·W| = ${inc.magnitude.toFixed(4)}`, arcColor],
      [`h_Z = ${Z.helicity.toFixed(3)}`, ED.series6],
      [`h_W = ${W.helicity.toFixed(3)}`, ED.series7],
    ];

    stats.forEach(([txt, color], i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      svg.append('text')
        .attr('x', 30 + col * (width / 3))
        .attr('y', statsY + row * 18)
        .attr('fill', color).attr('font-size', 11)
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(txt);
    });

  }, [data, sigma, t]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return <svg ref={svgRef} style={{ width: '100%', height: 480 }} />;
}

// ─── Tab 2: Penrose Transform (Canvas) ──────────────────────────────
function PenroseTransformTab({ sigma, t, numPrimes }) {
  const canvasRef = useRef();

  const scanData = useMemo(() =>
    penroseTransformScan(t, [0.1, 2.0], 120, numPrimes),
    [t, numPrimes]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.parentElement.clientWidth;
    const H = 460;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    const { sigmas, fieldValues, zetaValues, correlation } = scanData;
    const n = sigmas.length;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const chartW = W - margin.left - margin.right;
    const panelH = (H - margin.top - margin.bottom - 30) / 2;

    // Find max values for scaling
    let maxField = 0.001, maxZeta = 0.001;
    for (let i = 0; i < n; i++) {
      maxField = Math.max(maxField, fieldValues[i]);
      maxZeta = Math.max(maxZeta, zetaValues[i]);
    }

    // ── Top panel: Penrose Transform field ──
    const topY = margin.top;
    ctx.fillStyle = 'rgba(26,31,54,0.4)';
    ctx.fillRect(margin.left, topY, chartW, panelH);

    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = ED.series6;
    ctx.textAlign = 'left';
    ctx.fillText('Penrose Transform Field (twistor-weighted Euler product)', margin.left + 8, topY + 16);

    // Y-axis ticks for top panel
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'right';
    ctx.strokeStyle = TK_ALPHA(ED.rule, 0.2);
    ctx.lineWidth = 0.5;
    for (let frac = 0; frac <= 1; frac += 0.25) {
      const val = maxField * frac;
      const y = topY + panelH - frac * (panelH - 24);
      ctx.fillText(val.toFixed(2), margin.left - 6, y + 3);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartW, y);
      ctx.stroke();
    }

    ctx.strokeStyle = ED.series6;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = margin.left + (i / (n - 1)) * chartW;
      const y = topY + panelH - (fieldValues[i] / maxField) * (panelH - 24);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Rotated y-axis label for top panel
    ctx.save();
    ctx.translate(14, topY + panelH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series6;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Field amplitude', 0, 0);
    ctx.restore();

    // ── Bottom panel: |ζ(s)| ──
    const botY = topY + panelH + 30;
    ctx.fillStyle = 'rgba(26,31,54,0.4)';
    ctx.fillRect(margin.left, botY, chartW, panelH);

    ctx.fillStyle = ED.series5;
    ctx.textAlign = 'left';
    ctx.fillText('|ζ(s)| (Euler product magnitude)', margin.left + 8, botY + 16);

    // Y-axis ticks for bottom panel
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'right';
    ctx.strokeStyle = TK_ALPHA(ED.rule, 0.2);
    ctx.lineWidth = 0.5;
    for (let frac = 0; frac <= 1; frac += 0.25) {
      const val = maxZeta * frac;
      const y = botY + panelH - frac * (panelH - 24);
      ctx.fillText(val.toFixed(2), margin.left - 6, y + 3);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartW, y);
      ctx.stroke();
    }

    ctx.strokeStyle = ED.series5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = margin.left + (i / (n - 1)) * chartW;
      const y = botY + panelH - (zetaValues[i] / maxZeta) * (panelH - 24);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Rotated y-axis label for bottom panel
    ctx.save();
    ctx.translate(14, botY + panelH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series5;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('|ζ(s)|', 0, 0);
    ctx.restore();

    // ── Vertical line at current σ ──
    const sigmaFrac = (sigma - 0.1) / (2.0 - 0.1);
    if (sigmaFrac >= 0 && sigmaFrac <= 1) {
      const lx = margin.left + sigmaFrac * chartW;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(lx, topY);
      ctx.lineTo(lx, botY + panelH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = ED.ink;
      ctx.textAlign = 'center';
      ctx.fillText(`σ = ${sigma.toFixed(2)}`, lx, topY - 6);
    }

    // Critical line marker at σ=0.5
    const critFrac = (0.5 - 0.1) / (2.0 - 0.1);
    const critLx = margin.left + critFrac * chartW;
    ctx.strokeStyle = TK_ALPHA(ED.series3, 0.4);
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(critLx, topY);
    ctx.lineTo(critLx, botY + panelH);
    ctx.stroke();
    ctx.setLineDash([]);

    // σ axis labels
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    [0.2, 0.5, 1.0, 1.5, 2.0].forEach(s => {
      const frac = (s - 0.1) / (2.0 - 0.1);
      if (frac >= 0 && frac <= 1) {
        ctx.fillText(`σ=${s}`, margin.left + frac * chartW, botY + panelH + 16);
      }
    });

    // Correlation badge
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = correlation > 0.8 ? ED.series3 : correlation > 0.5 ? ED.series4 : ED.series2;
    ctx.fillText(`Correlation: ${correlation.toFixed(3)}`, W - margin.right, topY + 16);

  }, [scanData, sigma]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width: '100%', borderRadius: 8 }} />;
}

// ─── Tab 3: Incidence Relation (Canvas heatmap) ─────────────────────
function IncidenceRelationTab({ sigma, t }) {
  const canvasRef = useRef();

  const heatData = useMemo(() => {
    const sigmaSteps = 80;
    const tSteps = 60;
    const sigmaRange = [0.0, 1.0];
    const tRange = [1, 50];
    const grid = [];
    let maxVal = 0;

    for (let si = 0; si <= sigmaSteps; si++) {
      const row = [];
      const sig = sigmaRange[0] + si * (sigmaRange[1] - sigmaRange[0]) / sigmaSteps;
      for (let ti = 0; ti <= tSteps; ti++) {
        const tv = tRange[0] + ti * (tRange[1] - tRange[0]) / tSteps;
        const s = [sig, tv];
        const Z = twistorFromS(s);
        const W = dualTwistorFromS(s);
        const inc = incidenceRelation(Z, W);
        row.push(inc.magnitude);
        maxVal = Math.max(maxVal, inc.magnitude);
      }
      grid.push(row);
    }

    return { grid, maxVal, sigmaRange, tRange, sigmaSteps, tSteps };
  }, []);

  // Pre-render heatmap to an offscreen canvas so it doesn't need to be
  // redrawn (4,941 fillRect calls) on every sigma/t slider change
  const heatmapImage = useMemo(() => {
    const { grid, maxVal, sigmaSteps, tSteps } = heatData;
    const w = sigmaSteps + 1;
    const h = tSteps + 1;
    const offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    const octx = offscreen.getContext('2d');
    const imgData = octx.createImageData(w, h);
    const d = imgData.data;
    for (let si = 0; si <= sigmaSteps; si++) {
      for (let ti = 0; ti <= tSteps; ti++) {
        const norm = Math.min(grid[si][ti] / Math.max(maxVal, 0.01), 1);
        const idx = (ti * w + si) * 4;
        d[idx]     = Math.floor(norm * 255);
        d[idx + 1] = Math.floor(norm * 200);
        d[idx + 2] = Math.floor((1 - norm) * 80);
        d[idx + 3] = 255;
      }
    }
    octx.putImageData(imgData, 0, 0);
    return offscreen;
  }, [heatData]);

  // Memoize filtered zeta zeros to avoid re-filtering ZETA_ZEROS array on every
  // draw call (sigma/t slider change, window resize). Only depends on tRange.
  const zerosInRange = useMemo(() => {
    const { tRange } = heatData;
    return ZETA_ZEROS.filter(z => z >= tRange[0] && z <= tRange[1]);
  }, [heatData]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.parentElement.clientWidth;
    const H = 460;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    const { maxVal, sigmaRange, tRange, sigmaSteps, tSteps } = heatData;
    const margin = { top: 50, right: 80, bottom: 50, left: 60 };
    const chartW = W - margin.left - margin.right;
    const chartH = H - margin.top - margin.bottom;

    // Blit pre-rendered heatmap image (scaled to chart area)
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(heatmapImage, margin.left, margin.top, chartW, chartH);
    ctx.imageSmoothingEnabled = true;

    // Mark known zeta zeros on σ=0.5 line
    const critSi = ((0.5 - sigmaRange[0]) / (sigmaRange[1] - sigmaRange[0])) * chartW;
    zerosInRange.forEach(z => {
      const tFrac = (z - tRange[0]) / (tRange[1] - tRange[0]);
      const zx = margin.left + critSi;
      const zy = margin.top + tFrac * chartH;
      // Dark halo for contrast against bright heatmap regions
      ctx.beginPath();
      ctx.arc(zx, zy, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();
      // Green filled marker
      ctx.beginPath();
      ctx.arc(zx, zy, 5, 0, Math.PI * 2);
      ctx.fillStyle = ED.series3;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Mark current position
    const curSigFrac = (sigma - sigmaRange[0]) / (sigmaRange[1] - sigmaRange[0]);
    const curTFrac = (t - tRange[0]) / (tRange[1] - tRange[0]);
    if (curSigFrac >= 0 && curSigFrac <= 1 && curTFrac >= 0 && curTFrac <= 1) {
      const cx = margin.left + curSigFrac * chartW;
      const cy = margin.top + curTFrac * chartH;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }

    // Axis labels
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    [0, 0.25, 0.5, 0.75, 1.0].forEach(s => {
      const x = margin.left + s * chartW;
      ctx.fillText(`${s.toFixed(2)}`, x, H - margin.bottom + 16);
    });
    ctx.fillText('σ', margin.left + chartW / 2, H - 10);

    ctx.textAlign = 'right';
    [1, 10, 20, 30, 40, 50].forEach(tv => {
      const frac = (tv - tRange[0]) / (tRange[1] - tRange[0]);
      ctx.fillText(`${tv}`, margin.left - 8, margin.top + frac * chartH + 4);
    });
    ctx.save();
    ctx.translate(14, margin.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('t (Im s)', 0, 0);
    ctx.restore();

    // Title
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = ED.ink;
    ctx.textAlign = 'center';
    ctx.fillText('Incidence Relation |Z · W| over (σ, t)', W / 2, 20);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = ED.series8;
    ctx.fillText('Dark = incidence satisfied (Z·W ≈ 0), green dots = known zeta zeros', W / 2, 36);

    // Color bar (low at bottom, high at top — standard scientific convention)
    const cbX = W - margin.right + 12;
    const cbW = 16;
    for (let y = 0; y < chartH; y++) {
      const norm = 1 - y / chartH;
      const r = Math.floor(norm * 255);
      const g = Math.floor(norm * 200);
      const b = Math.floor((1 - norm) * 80);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(cbX, margin.top + y, cbW, 1);
    }
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'left';
    ctx.fillText(`${maxVal.toFixed(2)}`, cbX + cbW + 4, margin.top + 8);
    ctx.fillText('0', cbX + cbW + 4, margin.top + chartH);
    ctx.fillText('|Z·W|', cbX, margin.top - 6);

  }, [heatData, heatmapImage, sigma, t, zerosInRange]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width: '100%', borderRadius: 8 }} />;
}

// ─── Tab 4: Dual Pair (Canvas, animated) ────────────────────────────
function DualPairTab({ sigma, t, numPrimes, playing }) {
  const canvasRef = useRef();
  const animRef = useRef();
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.parentElement.clientWidth;
    const H = 460;
    const needW = W * dpr;
    const needH = H * dpr;
    // Only reallocate canvas buffer when dimensions actually change
    if (canvas.width !== needW || canvas.height !== needH) {
      canvas.width = needW;
      canvas.height = needH;
      canvas.style.height = H + 'px';
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    const time = timeRef.current;
    const tAnimated = t + time * 2; // sweep t with animation

    const s = [sigma, tAnimated];
    const Z = twistorFromS(s);
    const W2 = dualTwistorFromS(s);
    const I = intertwiner(Z, s);
    const inc = incidenceRelation(Z, W2);
    const bridge = losslessBridge(s);

    const panelW = W * 0.35;
    const centerX = W / 2;
    const centerY = H / 2;

    // ── Left: Twistor Z ──
    const zCx = panelW / 2 + 20;
    const zCy = centerY;
    const radius = Math.min(panelW * 0.4, 120);

    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(zCx, zCy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Twistor vector rotating with t
    const zAngle = Math.atan2(Z.omega[1], Z.omega[0]);
    const zLen = Math.min(Z.norm * radius * 0.8, radius * 0.9);
    const zEndX = zCx + Math.cos(zAngle) * zLen;
    const zEndY = zCy + Math.sin(zAngle) * zLen;

    ctx.strokeStyle = ED.series1;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(zCx, zCy);
    ctx.lineTo(zEndX, zEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(zEndX, zEndY, 5, 0, Math.PI * 2);
    ctx.fillStyle = ED.series1;
    ctx.fill();

    // Trace arc (last rotation)
    ctx.strokeStyle = TK_ALPHA(ED.series1, 0.15);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(zCx, zCy, zLen, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = ED.series1;
    ctx.textAlign = 'center';
    ctx.fillText('Twistor Z', zCx, 30);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.fillText(`||Z|| = ${Z.norm.toFixed(3)}`, zCx, H - 50);
    ctx.fillText(`h = ${Z.helicity.toFixed(3)}`, zCx, H - 34);

    // ── Right: Dual Twistor W ──
    const wCx = W - panelW / 2 - 20;
    const wCy = centerY;

    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(wCx, wCy, radius, 0, Math.PI * 2);
    ctx.stroke();

    const wAngle = Math.atan2(W2.omega[1], W2.omega[0]);
    const wLen = Math.min(W2.norm * radius * 0.8, radius * 0.9);
    const wEndX = wCx + Math.cos(wAngle) * wLen;
    const wEndY = wCy + Math.sin(wAngle) * wLen;

    ctx.strokeStyle = ED.brassDeco;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wCx, wCy);
    ctx.lineTo(wEndX, wEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(wEndX, wEndY, 5, 0, Math.PI * 2);
    ctx.fillStyle = ED.series4;
    ctx.fill();

    ctx.strokeStyle = TK_ALPHA(ED.brassDeco, 0.15);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(wCx, wCy, wLen, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = ED.series4;
    ctx.textAlign = 'center';
    ctx.fillText('Dual Twistor W', wCx, 30);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.fillText(`||W|| = ${W2.norm.toFixed(3)}`, wCx, H - 50);
    ctx.fillText(`h = ${W2.helicity.toFixed(3)}`, wCx, H - 34);

    // ── Center: Intertwiner coupling ──
    const couplingR = 30 + bridge.magnitude * 30;

    // Coupling strength ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, couplingR, 0, Math.PI * 2);
    ctx.strokeStyle = bridge.isUnitary ? ED.series3 : ED.series2;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = bridge.isUnitary ? TK_ALPHA(ED.series3, 0.15) : TK_ALPHA(ED.series2, 0.15);
    ctx.fill();

    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = bridge.isUnitary ? ED.series3 : ED.series2;
    ctx.textAlign = 'center';
    ctx.fillText('I', centerX, centerY + 4);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = ED.series8;
    ctx.fillText(`|χ| = ${bridge.magnitude.toFixed(3)}`, centerX, centerY + couplingR + 16);

    // Phase lock indicator
    const phaseDiff = Math.abs(Z.helicity - W2.helicity);
    const locked = phaseDiff < 0.1;
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = locked ? ED.series3 : ED.series4;
    ctx.fillText(locked ? 'PHASE-LOCKED' : `Δh = ${phaseDiff.toFixed(3)}`, centerX, centerY + couplingR + 32);

    // Connecting lines Z → I → W
    ctx.strokeStyle = TK_ALPHA(ED.series5, 0.4);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(zCx + radius + 5, zCy);
    ctx.lineTo(centerX - couplingR - 5, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + couplingR + 5, centerY);
    ctx.lineTo(wCx - radius - 5, wCy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated t value
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = ED.ink;
    ctx.textAlign = 'center';
    ctx.fillText(`t = ${tAnimated.toFixed(1)}`, centerX, 30);

    // Incidence
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = inc.satisfied ? ED.series3 : ED.series2;
    ctx.fillText(
      inc.satisfied ? 'Z · W ≈ 0 (incident)' : `|Z · W| = ${inc.magnitude.toFixed(3)}`,
      centerX, H - 18
    );

  }, [sigma, t, numPrimes]);

  useEffect(() => {
    if (playing) {
      const animate = () => {
        timeRef.current += 0.03;
        draw();
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw();
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw, playing]);

  // Redraw on window resize when animation is paused (playing handles it via rAF loop)
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width: '100%', borderRadius: 8 }} />;
}

// ─── Main TwistorViz Component ──────────────────────────────────────
export default function TwistorViz() {
  const [tab, setTab] = useState('correspondence');
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(8);
  const [playing, setPlaying] = useState(true);

  const sigmaColor = Math.abs(sigma - 0.5) < 0.02 ? ED.series3
    : Math.abs(sigma - 0.5) < 0.15 ? ED.series4 : ED.series2;

  const incidenceStatus = useMemo(() => {
    const Z = twistorFromS([sigma, t]);
    const W = dualTwistorFromS([sigma, t]);
    return incidenceRelation(Z, W);
  }, [sigma, t]);

  return (
    <div>
      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <label style={{ color: sigmaColor, fontWeight: 600 }}>
            <InlineMath tex={"\\sigma = \\operatorname{Re}(s)"} />
          </label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
          <span style={{ fontSize: 10, color: sigmaColor, opacity: 0.8, marginLeft: 4, fontFamily: 'var(--font-mono)' }}
            title={Math.abs(sigma - 0.5) < 0.03 ? 'Critical line Re(s) = ½ — twistor incidence relation vanishes'
              : sigma < 0.5 ? 'Left half of critical strip — dual ladder dominates'
              : 'Right half of critical strip — direct ladder dominates'}
          >{Math.abs(sigma - 0.5) < 0.03 ? 'critical line' : sigma < 0.5 ? 'critical strip (σ<½)' : 'critical strip (σ>½)'}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex={"t = \\operatorname{Im}(s)"} /></label>
          <input type="range" min="1" max="60" step="0.1" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
          {(() => {
            let bestIdx = 0, bestDist = Math.abs(t - ZETA_ZEROS[0]);
            for (let i = 1; i < ZETA_ZEROS.length; i++) {
              const d = Math.abs(t - ZETA_ZEROS[i]);
              if (d < bestDist) { bestDist = d; bestIdx = i; }
              if (ZETA_ZEROS[i] > t + 2) break;
            }
            return bestDist < 1 ? (
              <span style={{
                marginLeft: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
                color: bestDist < 0.3 ? 'var(--series-3)' : 'var(--ink-faint)',
                cursor: 'pointer', borderBottom: '1px dashed currentColor',
              }}
                title={`Click to snap t to γ${bestIdx + 1} = ${ZETA_ZEROS[bestIdx].toFixed(6)}`}
                onClick={() => setT(ZETA_ZEROS[bestIdx])}
              >
                {'\u2248 \u03B3'}{String(bestIdx + 1).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}={ZETA_ZEROS[bestIdx].toFixed(1)}
              </span>
            ) : null;
          })()}
        </div>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="3" max="20" step="1" value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes} <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
        </div>
        <div className="control-group">
          <button
            className={`tab-btn ${playing ? 'tab-active' : ''}`}
            onClick={() => setPlaying(p => !p)}
            style={{ minWidth: 70 }}
          >{playing ? 'Pause' : 'Play'}</button>
        </div>
      </div>

      <ThermoBar sigma={sigma} t={t} numPrimes={numPrimes} />

      {/* Incidence status */}
      <div style={{
        padding: '6px 14px', marginBottom: 12, borderRadius: 8,
        background: incidenceStatus.satisfied ? 'color-mix(in srgb, var(--series-3) 10%, transparent)' : 'color-mix(in srgb, var(--series-2) 10%, transparent)',
        border: `1px solid ${incidenceStatus.satisfied ? ED.series3 : ED.series2}33`,
        fontSize: 12, color: incidenceStatus.satisfied ? 'var(--series-3)' : 'var(--series-2)', fontWeight: 500,
        textAlign: 'center',
      }}>
        {incidenceStatus.satisfied
          ? 'Z · W ≈ 0 — Incidence relation satisfied: twistor and dual twistor are incident (σ ≈ 0.5)'
          : `|Z · W| = ${incidenceStatus.magnitude.toFixed(4)} — Incidence relation violated: twistors are not incident`
        }
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {TABS.map(tb => (
          <button key={tb.id}
            className={`tab-btn ${tab === tb.id ? 'tab-active' : ''}`}
            onClick={() => setTab(tb.id)}
          >{tb.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="viz-container" style={{ marginTop: 12 }}>
        {tab === 'correspondence' && (
          <>
            <div className="tab-explainer accent-blue">
              <p style={{ margin: '0 0 8px' }}>
                <strong>Twistor Correspondence:</strong> The s-plane (left) maps to twistor space (right):
              </p>
              <BlockMath tex={"Z^{\\alpha} = (\\omega^A,\\, \\pi_{A'}) \\quad \\text{(direct)}, \\qquad W_{\\alpha} \\quad \\text{(dual)}, \\qquad Z \\cdot W = 0 \\;\\Leftrightarrow\\; \\text{incident}"} />
              <p style={{ margin: '8px 0 0' }}>
                The twistor (blue) encodes the direct ladder, the dual twistor (gold) encodes the dual ladder.
                At <InlineMath tex={"\\sigma = 0.5"} />, Z and W are related by the lossless bridge.
              </p>
            </div>
            <CorrespondenceTab sigma={sigma} t={t} numPrimes={numPrimes} />
          </>
        )}
        {tab === 'penrose' && (
          <>
            <div className="tab-explainer accent-cyan">
              <strong>Penrose Transform:</strong> The Penrose transform maps twistor cohomology to spacetime fields.
              Here, the twistor-weighted Euler product (top, cyan) is compared with the raw <InlineMath tex={"|\\zeta(s)|"} /> (bottom, purple).
              High correlation indicates the twistor framework faithfully encodes zeta behavior.
            </div>
            <PenroseTransformTab sigma={sigma} t={t} numPrimes={numPrimes} />
          </>
        )}
        {tab === 'incidence' && (
          <>
            <div className="tab-explainer accent-green">
              <strong>Incidence Relation:</strong> Heatmap of <InlineMath tex={"|Z \\cdot W|"} /> over
              the <InlineMath tex={"(\\sigma, t)"} /> plane. Dark regions satisfy the incidence relation
              (twistors are null-separated). Green dots mark known zeta zeros on the critical line.
              The incidence locus near <InlineMath tex={"\\sigma = 0.5"} /> mirrors the zero distribution.
              <strong> Look for:</strong> a dark vertical band along <InlineMath tex={"\\sigma = 0.5"} /> where incidence is nearly satisfied; green dots sitting in the darkest pockets where <InlineMath tex={"|Z \\cdot W| \\approx 0"} />.
            </div>
            <IncidenceRelationTab sigma={sigma} t={t} />
          </>
        )}
        {tab === 'dualPair' && (
          <>
            <div className="tab-explainer accent-orange">
              <strong>Dual Pair:</strong> Watch the twistor Z (blue, left) and dual twistor W (gold, right) rotate
              as t sweeps forward. The central intertwiner I shows coupling strength. When the helicities match
              and <InlineMath tex={"|Z \\cdot W| \\approx 0"} />, the pair is phase-locked at equilibrium.
            </div>
            <DualPairTab sigma={sigma} t={t} numPrimes={numPrimes} playing={playing} />
          </>
        )}
      </div>
    </div>
  );
}
