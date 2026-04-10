import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import { losslessBridge } from '../math/oscillators.js';
import { cMul, cDiv, cAbs, zetaCriticalStrip, ZETA_ZEROS } from '../math/zeta.js';
import ThermoBar from './ThermoBar.jsx';

/**
 * Nyquist plot: trace the loop transfer function L(jω) = χ(s)·ζ(1-s)/ζ(s)
 * around the Nyquist contour. Encirclements of -1 ↔ zeros off critical line.
 */
export default function NyquistBodeViz() {
  const nyquistRef = useRef();
  const bodeRef = useRef();
  const [sigma, setSigma] = useState(0.5);
  const [tRange, setTRange] = useState([1, 60]);
  const [mode, setMode] = useState('nyquist');

  // Color the sigma slider based on distance from critical line
  const sigmaDeviation = Math.abs(sigma - 0.5);
  const sigmaColor = sigmaDeviation < 0.02 ? '#10b981' : sigmaDeviation < 0.15 ? '#f59e0b' : '#ef4444';

  const computeLoopGain = useCallback((s) => {
    // L(s) = χ(s) * ζ(1-s) / ζ(s)
    // Use Borwein-accelerated zeta for accuracy in the critical strip
    const zetaS = zetaCriticalStrip(s);
    const zeta1mS = zetaCriticalStrip([1 - s[0], -s[1]]);
    const bridge = losslessBridge(s);
    const ratio = cDiv(zeta1mS, zetaS);
    return cMul(bridge.chi, ratio);
  }, []);

  // Memoize Nyquist contour data so resize events don't recompute 602 zeta evaluations
  const nyquistData = useMemo(() => {
    const points = [];
    const steps = 300;
    const dt = (tRange[1] - tRange[0]) / steps;
    for (let i = 0; i <= steps; i++) {
      const t = tRange[0] + i * dt;
      const L = computeLoopGain([sigma, t]);
      points.push({ t, re: L[0], im: L[1], mag: cAbs(L) });
    }
    // Negative frequency (mirror): by Schwarz reflection, L(σ−it) = conj(L(σ+it)),
    // so Re is unchanged and Im is negated — no need to recompute 301 expensive zeta evaluations
    const negPoints = points.map(p => ({ t: -p.t, re: p.re, im: -p.im }));
    return { points, negPoints };
  }, [sigma, tRange, computeLoopGain]);

  // Memoize Bode frequency response data so resize events don't recompute 502 zeta evaluations
  const bodeData = useMemo(() => {
    const points = [];
    const steps = 250;
    const logTMin = Math.log10(Math.max(0.5, tRange[0]));
    const logTMax = Math.log10(tRange[1]);
    const dLogT = (logTMax - logTMin) / steps;
    let prevRawPhase = null;
    let unwrapped = 0;
    for (let i = 0; i <= steps; i++) {
      const t = Math.pow(10, logTMin + i * dLogT);
      const L = computeLoopGain([sigma, t]);
      const mag = cAbs(L);
      const rawPhase = Math.atan2(L[1], L[0]) * 180 / Math.PI;
      // Unwrap phase: remove ±360° jumps between consecutive samples
      if (prevRawPhase !== null) {
        let delta = rawPhase - prevRawPhase;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        unwrapped += delta;
      } else {
        unwrapped = rawPhase;
      }
      prevRawPhase = rawPhase;
      points.push({ t, magdB: 20 * Math.log10(Math.max(1e-10, mag)), phase: unwrapped, mag });
    }
    return points;
  }, [sigma, tRange, computeLoopGain]);

  const drawNyquist = useCallback(() => {
    const svg = d3.select(nyquistRef.current);
    svg.selectAll('*').remove();
    const width = nyquistRef.current.clientWidth || 800;
    const height = 520;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const { points, negPoints } = nyquistData;

    let maxAbsRe = 0, maxAbsIm = 0;
    for (const p of points) {
      const ar = Math.abs(p.re), ai = Math.abs(p.im);
      if (ar > maxAbsRe) maxAbsRe = ar;
      if (ai > maxAbsIm) maxAbsIm = ai;
    }
    for (const p of negPoints) {
      const ar = Math.abs(p.re), ai = Math.abs(p.im);
      if (ar > maxAbsRe) maxAbsRe = ar;
      if (ai > maxAbsIm) maxAbsIm = ai;
    }
    const rBound = Math.max(3, maxAbsRe * 1.1);
    const iBound = Math.max(3, maxAbsIm * 1.1);
    const bound = Math.min(20, Math.max(rBound, iBound));

    const x = d3.scaleLinear().domain([-bound, bound]).range([0, w]);
    const y = d3.scaleLinear().domain([-bound, bound]).range([h, 0]);

    // Grid
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    g.append('g').call(d3.axisLeft(y).ticks(10))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    g.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Axes through origin
    g.append('line').attr('x1', 0).attr('y1', y(0)).attr('x2', w).attr('y2', y(0))
      .attr('stroke', '#2a3050').attr('stroke-width', 1);
    g.append('line').attr('x1', x(0)).attr('y1', 0).attr('x2', x(0)).attr('y2', h)
      .attr('stroke', '#2a3050').attr('stroke-width', 1);

    // Critical point at (-1, 0)
    g.append('circle')
      .attr('cx', x(-1)).attr('cy', y(0)).attr('r', 6)
      .attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2);
    g.append('text')
      .attr('x', x(-1)).attr('y', y(0) - 12)
      .attr('text-anchor', 'middle').attr('fill', '#ef4444').attr('font-size', 11).attr('font-weight', 600)
      .text('−1');

    // Unit circle reference
    const circlePoints = d3.range(0, 2 * Math.PI + 0.01, 0.02).map(a => [x(Math.cos(a)), y(Math.sin(a))]);
    g.append('path')
      .datum(circlePoints)
      .attr('d', d3.line())
      .attr('fill', 'none').attr('stroke', '#64748b').attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3');
    g.append('text')
      .attr('x', x(1)).attr('y', y(1) - 6)
      .attr('text-anchor', 'start').attr('fill', '#64748b').attr('font-size', 9)
      .text('|L|=1');

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w - 150}, 6)`);
    const legendBg = legend.append('rect')
      .attr('x', -8).attr('y', -6).attr('width', 156).attr('height', 72).attr('rx', 4)
      .attr('fill', '#0f1729').attr('fill-opacity', 0.85).attr('stroke', '#2a3050');
    const items = [
      { color: 'hsl(240, 80%, 55%)', label: 'Positive freq (ω > 0)', dash: null },
      { color: 'hsl(35, 80%, 55%)', label: 'Negative freq (ω < 0)', dash: null },
      { color: '#64748b', label: 'Unit circle |L|=1', dash: '4,3' },
      { color: '#ef4444', label: 'Critical point −1', dash: null },
    ];
    items.forEach((item, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 16 + 4})`);
      if (item.dash) {
        row.append('line').attr('x1', 0).attr('y1', 4).attr('x2', 16).attr('y2', 4)
          .attr('stroke', item.color).attr('stroke-width', 1.5).attr('stroke-dasharray', item.dash);
      } else if (item.color === '#ef4444') {
        row.append('circle').attr('cx', 8).attr('cy', 4).attr('r', 4)
          .attr('fill', 'none').attr('stroke', item.color).attr('stroke-width', 1.5);
      } else {
        row.append('line').attr('x1', 0).attr('y1', 4).attr('x2', 16).attr('y2', 4)
          .attr('stroke', item.color).attr('stroke-width', 2);
      }
      row.append('text').attr('x', 22).attr('y', 8)
        .attr('fill', '#94a3b8').attr('font-size', 10).text(item.label);
    });

    // Positive frequency contour (blue → cyan gradient)
    const posLine = d3.line().x(d => x(d.re)).y(d => y(d.im)).curve(d3.curveBasis);

    // Draw segments with color gradient based on t
    for (let i = 1; i < points.length; i++) {
      const frac = i / (points.length - 1);
      const hue = 210 + frac * 60; // blue to cyan
      g.append('line')
        .attr('x1', x(points[i-1].re)).attr('y1', y(points[i-1].im))
        .attr('x2', x(points[i].re)).attr('y2', y(points[i].im))
        .attr('stroke', `hsl(${hue}, 80%, 55%)`)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);
    }

    // Negative frequency contour (orange)
    for (let i = 1; i < negPoints.length; i++) {
      const frac = i / (negPoints.length - 1);
      const hue = 25 + frac * 20; // orange gradient
      g.append('line')
        .attr('x1', x(negPoints[i-1].re)).attr('y1', y(negPoints[i-1].im))
        .attr('x2', x(negPoints[i].re)).attr('y2', y(negPoints[i].im))
        .attr('stroke', `hsl(${hue}, 80%, 55%)`)
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    }

    // Direction arrows along contours (essential for encirclement counting)
    const drawArrows = (pts, xAccessor, yAccessor, hueBase, hueRange, arrowSize) => {
      const arrowCount = 4;
      for (let a = 0; a < arrowCount; a++) {
        const idx = Math.round((a + 1) * (pts.length - 2) / (arrowCount + 1));
        if (idx < 1 || idx >= pts.length - 1) continue;
        const px = xAccessor(pts[idx]);
        const py = yAccessor(pts[idx]);
        const dx = xAccessor(pts[idx + 1]) - xAccessor(pts[idx - 1]);
        const dy = yAccessor(pts[idx + 1]) - yAccessor(pts[idx - 1]);
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1e-6) continue;
        const ux = dx / len, uy = dy / len;
        const frac = idx / (pts.length - 1);
        const hue = hueBase + frac * hueRange;
        // Draw small filled triangle pointing in direction of travel
        const tipX = px + ux * arrowSize;
        const tipY = py + uy * arrowSize;
        const baseX1 = px - ux * arrowSize * 0.5 + uy * arrowSize * 0.6;
        const baseY1 = py - uy * arrowSize * 0.5 - ux * arrowSize * 0.6;
        const baseX2 = px - ux * arrowSize * 0.5 - uy * arrowSize * 0.6;
        const baseY2 = py - uy * arrowSize * 0.5 + ux * arrowSize * 0.6;
        g.append('polygon')
          .attr('points', `${tipX},${tipY} ${baseX1},${baseY1} ${baseX2},${baseY2}`)
          .attr('fill', `hsl(${hue}, 80%, 60%)`)
          .attr('stroke', '#0a0e1a').attr('stroke-width', 0.5);
      }
    };
    drawArrows(points, d => x(d.re), d => y(d.im), 210, 60, 6);
    drawArrows(negPoints, d => x(d.re), d => y(d.im), 25, 20, 5);

    // Start/end markers
    if (points.length > 0) {
      g.append('circle')
        .attr('cx', x(points[0].re)).attr('cy', y(points[0].im)).attr('r', 4)
        .attr('fill', '#3b82f6').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
      g.append('circle')
        .attr('cx', x(points[points.length-1].re)).attr('cy', y(points[points.length-1].im)).attr('r', 4)
        .attr('fill', '#06b6d4').attr('stroke', '#0a0e1a').attr('stroke-width', 2);
    }

    // Labels
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Re[L(s)]');
    svg.append('text')
      .attr('transform', `translate(14, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Im[L(s)]');

    svg.append('text').attr('x', margin.left + 4).attr('y', margin.top + 14)
      .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
      .text('Nyquist Plot of Loop Transfer Function L(s) = χ(s)·ζ(1−s)/ζ(s)');

    svg.append('text').attr('x', margin.left + 4).attr('y', margin.top + 30)
      .attr('fill', sigma === 0.5 ? '#10b981' : '#ef4444').attr('font-size', 11)
      .text(`σ = ${sigma.toFixed(2)} — ${sigma === 0.5 ? 'Critical line: expect 0 encirclements' : 'Off critical line'}`);

  }, [sigma, nyquistData]);

  const drawBode = useCallback(() => {
    const svg = d3.select(bodeRef.current);
    svg.selectAll('*').remove();
    const width = bodeRef.current.clientWidth || 800;
    const height = 520;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const w = width - margin.left - margin.right;
    const halfH = (height - margin.top - margin.bottom - 30) / 2;

    const points = bodeData;

    // Magnitude plot
    const gMag = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const xLog = d3.scaleLog().domain([Math.max(0.5, tRange[0]), tRange[1]]).range([0, w]);
    const yMagMax = d3.max(points, d => d.magdB) + 5;
    const yMagMin = d3.min(points, d => d.magdB) - 5;
    const yMag = d3.scaleLinear().domain([yMagMin, yMagMax]).range([halfH, 0]);

    gMag.append('g').attr('transform', `translate(0,${halfH})`)
      .call(d3.axisBottom(xLog).ticks(8, '~s'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gMag.append('g')
      .call(d3.axisLeft(yMag).ticks(6))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gMag.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Horizontal gridlines for magnitude
    const magGridG = gMag.append('g')
      .call(d3.axisLeft(yMag).ticks(6).tickSize(-w).tickFormat(''));
    magGridG.select('.domain').remove();
    magGridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

    // 0 dB line
    if (yMagMin < 0 && yMagMax > 0) {
      gMag.append('line')
        .attr('x1', 0).attr('y1', yMag(0)).attr('x2', w).attr('y2', yMag(0))
        .attr('stroke', '#ef4444').attr('stroke-width', 1).attr('stroke-dasharray', '4,4').attr('opacity', 0.5);
      gMag.append('text').attr('x', w - 4).attr('y', yMag(0) - 4)
        .attr('text-anchor', 'end').attr('fill', '#ef4444').attr('font-size', 10).text('0 dB');
    }

    const magLine = d3.line().x(d => xLog(d.t)).y(d => yMag(d.magdB)).curve(d3.curveBasis);
    gMag.append('path').datum(points).attr('d', magLine)
      .attr('fill', 'none').attr('stroke', '#3b82f6').attr('stroke-width', 2);

    gMag.append('text').attr('x', 0).attr('y', -8)
      .attr('fill', '#3b82f6').attr('font-size', 12).attr('font-weight', 600)
      .text('Magnitude (dB)');

    // Phase plot (dynamic domain from unwrapped phase)
    const gPhase = svg.append('g').attr('transform', `translate(${margin.left},${margin.top + halfH + 30})`);
    const phaseMin = d3.min(points, d => d.phase);
    const phaseMax = d3.max(points, d => d.phase);
    const phasePad = Math.max(10, (phaseMax - phaseMin) * 0.05);
    const yPhase = d3.scaleLinear().domain([phaseMin - phasePad, phaseMax + phasePad]).range([halfH, 0]);

    gPhase.append('g').attr('transform', `translate(0,${halfH})`)
      .call(d3.axisBottom(xLog).ticks(8, '~s'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gPhase.append('g')
      .call(d3.axisLeft(yPhase).ticks(6).tickFormat(d => d + '°'))
      .selectAll('text').attr('fill', '#64748b').attr('font-size', 9);
    gPhase.selectAll('.domain, .tick line').attr('stroke', '#2a3050');

    // Horizontal gridlines for phase
    const phaseGridG = gPhase.append('g')
      .call(d3.axisLeft(yPhase).ticks(6).tickSize(-w).tickFormat(''));
    phaseGridG.select('.domain').remove();
    phaseGridG.selectAll('.tick line')
      .attr('stroke', '#1e293b').attr('stroke-dasharray', '3,3').attr('stroke-width', 0.8);

    // -180° line (critical phase margin threshold) — only draw if visible in the dynamic domain
    if (phaseMin - phasePad <= -180 && phaseMax + phasePad >= -180) {
      gPhase.append('line')
        .attr('x1', 0).attr('y1', yPhase(-180)).attr('x2', w).attr('y2', yPhase(-180))
        .attr('stroke', '#ef4444').attr('stroke-width', 0.8).attr('stroke-dasharray', '4,4').attr('opacity', 0.5);
      gPhase.append('text').attr('x', w - 4).attr('y', yPhase(-180) - 4)
        .attr('text-anchor', 'end').attr('fill', '#ef4444').attr('font-size', 10).attr('opacity', 0.8).text('−180°');
    }

    const phaseLine = d3.line().x(d => xLog(d.t)).y(d => yPhase(d.phase)).curve(d3.curveLinear);
    gPhase.append('path').datum(points).attr('d', phaseLine)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2);

    gPhase.append('text').attr('x', 0).attr('y', -8)
      .attr('fill', '#f59e0b').attr('font-size', 12).attr('font-weight', 600)
      .text('Phase (degrees)');

    // Mark zeta zero frequencies on both magnitude and phase panels
    const visibleZeros = ZETA_ZEROS.filter(g => g >= Math.max(0.5, tRange[0]) && g <= tRange[1]);
    visibleZeros.forEach((gamma, i) => {
      const zx = xLog(gamma);
      // Magnitude panel
      gMag.append('line')
        .attr('x1', zx).attr('y1', 0).attr('x2', zx).attr('y2', halfH)
        .attr('stroke', '#ef4444').attr('stroke-width', 0.7)
        .attr('stroke-dasharray', '2,3').attr('opacity', 0.35);
      // Phase panel
      gPhase.append('line')
        .attr('x1', zx).attr('y1', 0).attr('x2', zx).attr('y2', halfH)
        .attr('stroke', '#ef4444').attr('stroke-width', 0.7)
        .attr('stroke-dasharray', '2,3').attr('opacity', 0.35);
      // Label first few visible zeros on magnitude panel using their true index in ZETA_ZEROS
      if (i < 8) {
        const trueIdx = ZETA_ZEROS.indexOf(gamma) + 1;
        gMag.append('text')
          .attr('x', zx).attr('y', halfH - 4)
          .attr('text-anchor', 'middle').attr('fill', '#ef4444')
          .attr('font-size', 8).attr('opacity', 0.6)
          .text(`γ${String(trueIdx).split('').map(c => String.fromCharCode(0x2080 + +c)).join('')}`);
      }
    });

    // Title
    svg.append('text').attr('x', width / 2).attr('y', height - 6)
      .attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', 12)
      .text('Frequency t (log scale)');

    svg.append('text').attr('x', margin.left + 4).attr('y', 16)
      .attr('fill', '#e2e8f0').attr('font-size', 13).attr('font-weight', 600)
      .text(`Bode Plot — σ = ${sigma.toFixed(2)}`);

  }, [sigma, tRange, bodeData]);

  useEffect(() => {
    if (mode === 'nyquist') drawNyquist();
    else drawBode();
  }, [mode, drawNyquist, drawBode]);

  useEffect(() => {
    const onResize = () => mode === 'nyquist' ? drawNyquist() : drawBode();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mode, drawNyquist, drawBode]);

  return (
    <div>
      {mode === 'nyquist' && (
        <div className="tab-explainer accent-blue">
          <p style={{ margin: '0 0 8px' }}>
            The Nyquist plot traces the loop transfer function in the complex plane as <InlineMath tex="t" /> varies:
          </p>
          <BlockMath tex={"L(s) = \\chi(s)\\,\\frac{\\zeta(1-s)}{\\zeta(s)}"} />
          <p style={{ margin: '8px 0 0' }}>
            By the Nyquist stability criterion, the number of clockwise encirclements of <InlineMath tex="-1" /> equals{' '}
            <InlineMath tex="Z - P" /> (zeros minus poles in the right half-plane). RH says: on the critical line{' '}
            (<InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />), there are <strong>zero encirclements</strong> &mdash; the system
            is marginally stable. Moving <InlineMath tex={"\\sigma"} /> off the critical line changes the winding number.
            <strong> Look for:</strong> the curve not encircling <InlineMath tex="-1" /> at <InlineMath tex={"\\sigma = 0.5"} />.
          </p>
        </div>
      )}
      {mode === 'bode' && (
        <div className="tab-explainer accent-orange">
          The Bode diagram shows the loop gain <InlineMath tex={"|L(j\\omega)|"} /> in dB (top) and
          phase <InlineMath tex={"\\angle L(j\\omega)"} /> in degrees (bottom) vs. frequency. Gain crossings (0 dB) correspond
          to potential instabilities; the <strong>gain margin</strong> measures how much amplification the loop can tolerate.
          The <strong>phase margin</strong> measures how much phase lag can be added. On the critical line, the system has
          infinite gain margin &mdash; the oscillator chain can never become unstable.
          <strong> Look for:</strong> gain peaks at zeta zero frequencies; adequate margins at <InlineMath tex={"\\sigma = 0.5"} />.
        </div>
      )}
      <div className="controls">
        <div className="control-group">
          <label>View</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="nyquist">Nyquist Plot</option>
            <option value="bode">Bode Diagram</option>
          </select>
        </div>
        <div className="control-group">
          <label style={{ color: sigmaColor, fontWeight: 600 }}><InlineMath tex={"\\sigma = \\operatorname{Re}(s)"} /></label>
          <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)}
            style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
          <span style={{ fontSize: 10, color: sigmaColor, opacity: 0.8, marginLeft: 4, fontFamily: 'var(--font-mono)' }}
            title={sigmaDeviation < 0.02 ? 'σ ≈ ½ — on the critical line where |χ| = 1 (lossless)'
              : sigmaDeviation < 0.15 ? 'Near the critical line — small reflection coefficient'
              : 'Far from σ = ½ — large gain imbalance between ζ(s) and ζ(1−s)'}
          >{sigmaDeviation < 0.02 ? 'critical line' : sigmaDeviation < 0.15 ? 'near critical' : 'off-axis'}</span>
        </div>
        <div className="control-group">
          <label>t max</label>
          <input type="range" min="10" max="100" step="1" value={tRange[1]}
            onChange={e => setTRange([tRange[0], +e.target.value])} />
          <span className="control-value">{tRange[1]} ({ZETA_ZEROS.filter(g => g >= tRange[0] && g <= tRange[1]).length} zeros in range)</span>
        </div>
      </div>
      <ThermoBar sigma={sigma} t={tRange[0]} numPrimes={10} />
      <div className="viz-container">
        {mode === 'nyquist'
          ? <svg ref={nyquistRef} style={{ width: '100%', height: 520 }} />
          : <svg ref={bodeRef} style={{ width: '100%', height: 520 }} />
        }
      </div>
    </div>
  );
}
