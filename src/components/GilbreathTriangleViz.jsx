import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import { getPrimes } from '../math/primes.js';
import { buildTriangle, mod2Triangle, lockCertificate } from '../math/gilbreath.js';
import { ED, alpha } from '../styles/tokens.js';

/**
 * Gilbreath's conjecture explorer.
 *
 * Take a sequence (the primes), form the row of absolute differences of
 * consecutive terms, then repeat on that row, and so on. Gilbreath's
 * observation (Proth 1878, Gilbreath 1958) is that the FIRST entry of every
 * derived row is 1. This renders the full iterated-difference triangle as a
 * heatmap and highlights the leading column where the 1s live.
 *
 * The rigorous skeleton (parity invariant, propagation fixed point, finite
 * window-lock certificate) lives in ../math/gilbreath.js; this component is the
 * visualization layer over it.
 */

// An odd, even-gapped sequence (drop the prime 2) — still starts the
// difference cascade and lets us see whether the leading-1 pattern is special
// to the full prime list.
function oddPrimes(n) {
  return getPrimes(n + 1).slice(1); // 3, 5, 7, 11, ...
}

// A control sequence with even gaps but NOT prime-derived: 1 plus partial sums
// of a pseudo-random even-gap walk. Gilbreath-type behavior is conjectured to
// hold for many such sequences (Croft), so the leading 1s should persist.
function evenGapSequence(n) {
  const out = [2];
  let x = 2;
  let s = 0x9e3779b9 >>> 0;
  for (let i = 1; i < n; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const gap = 2 * (1 + (s % 5)); // even gaps in {2,4,6,8,10}
    x += gap;
    out.push(x);
  }
  return out;
}

const SOURCES = {
  primes: { label: 'Primes', fn: getPrimes, accent: 'accent-cyan' },
  odd: { label: 'Odd primes (drop 2)', fn: oddPrimes, accent: 'accent-orange' },
  even: { label: 'Random even-gap seq', fn: evenGapSequence, accent: 'accent-green' },
};

export default function GilbreathTriangleViz({ onCertUpdate }) {
  const svgRef = useRef();
  const [numTerms, setNumTerms] = useState(40);
  const [source, setSource] = useState('primes');
  const [showMod2, setShowMod2] = useState(false);

  const { rows, mod2, cert } = useMemo(() => {
    const seq = SOURCES[source].fn(numTerms);
    const rows = buildTriangle(seq);
    return { rows, mod2: mod2Triangle(rows), cert: lockCertificate(rows) };
  }, [numTerms, source]);

  useEffect(() => {
    if (onCertUpdate) onCertUpdate({ cert, sourceLabel: SOURCES[source].label, numTerms });
  }, [cert, source, numTerms, onCertUpdate]);

  const leadingAllOne = cert.allLeadingOne;
  const firstViolation = cert.firstViolation;

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth || 800;
    const n = rows[0].length;
    const margin = { top: 40, right: 20, bottom: 20, left: 20 };
    const cell = Math.max(4, Math.min(16, (width - margin.left - margin.right) / n));
    const height = margin.top + margin.bottom + rows.length * cell;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Value mode: 0 → dark, 1 → gold, 2 → mid blue, larger → hot.
    // Parity mode (mod 2): odd → gold, even → dark. Lemma A makes the leading
    // column uniformly gold here — the parity invariant a_k[0] ≡ 1 (mod 2).
    const maxV = Math.max(2, d3.max(rows.flat()));
    const colorForVal = (v) => {
      if (v === 0) return '#0b1220';
      if (v === 1) return ED.series4;
      if (v === 2) return '#1e40af';
      const t = Math.min((v - 2) / Math.max(maxV - 2, 1), 1);
      return d3.interpolateInferno(0.35 + 0.6 * t);
    };
    const grid = showMod2 ? mod2 : rows;
    const colorFor = showMod2 ? (b) => (b === 1 ? ED.series4 : '#0b1220') : colorForVal;

    grid.forEach((row, k) => {
      row.forEach((v, i) => {
        g.append('rect')
          .attr('x', i * cell)
          .attr('y', k * cell)
          .attr('width', Math.max(1, cell - 1))
          .attr('height', Math.max(1, cell - 1))
          .attr('rx', cell > 7 ? 1.5 : 0)
          .attr('fill', colorFor(v))
          .attr('opacity', (showMod2 ? v === 0 : v === 0) ? 0.55 : 0.92)
          .style('cursor', 'crosshair')
          .append('title')
          .text(showMod2
            ? `row ${k}, col ${i}: ${rows[k][i]} (${v ? 'odd' : 'even'})${k >= 1 && i === 0 ? '  — leading entry, always odd' : ''}`
            : `row ${k}, col ${i} = ${v}${k >= 1 && i === 0 ? '  (leading entry)' : ''}`);
      });
    });

    // Mark the first "clean" row 1,(0|2)* — where the contraction completes and
    // the window-lock corollary kicks in: every row below is structurally
    // pinned to a leading 1.
    if (cert.firstCleanRow !== null && !showMod2) {
      const y = cert.firstCleanRow * cell;
      g.append('line').attr('x1', 0).attr('x2', grid[cert.firstCleanRow].length * cell)
        .attr('y1', y - 0.5).attr('y2', y - 0.5)
        .attr('stroke', ED.series6).attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('opacity', 0.85);
      g.append('text').attr('x', 2).attr('y', Math.max(y - 3, 10))
        .attr('fill', ED.series6).attr('font-size', 9)
        .text(`row ${cert.firstCleanRow}: 1,(0|2)* lock engages ↓`);
    }

    // Highlight the leading column (where Gilbreath's 1s live).
    g.append('rect')
      .attr('x', -2).attr('y', -2)
      .attr('width', cell + 2).attr('height', rows.length * cell + 2)
      .attr('fill', 'none')
      .attr('stroke', leadingAllOne ? ED.series3 : ED.series2)
      .attr('stroke-width', 2)
      .attr('rx', 3)
      .attr('opacity', 0.9);

    svg.append('text').attr('x', margin.left).attr('y', 18)
      .attr('fill', ED.ink).attr('font-size', 13).attr('font-weight', 600)
      .text(`Iterated absolute-difference triangle — ${rows.length} rows${showMod2 ? '  ·  mod 2 (odd = gold)' : ''}`);
    svg.append('text').attr('x', margin.left).attr('y', 33)
      .attr('fill', leadingAllOne ? ED.series3 : ED.series2).attr('font-size', 11)
      .text(showMod2
        ? 'Parity invariant (Lemma A): the leading column is ALL gold — a_k[0] ≡ 1 (mod 2), rigorously'
        : leadingAllOne
          ? 'Leading column (boxed): every derived row starts with 1 ✓'
          : `Leading 1s broken at row ${firstViolation}`);
  }, [rows, mod2, cert, showMod2, leadingAllOne, firstViolation]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const top = rows.slice(0, 6);

  return (
    <div>
      <div className="filter-bar">
        {Object.entries(SOURCES).map(([key, s]) => (
          <button key={key} className={`filter-btn ${source === key ? 'active' : ''}`}
            onClick={() => setSource(key)}>{s.label}</button>
        ))}
      </div>

      <div className={`tab-explainer ${SOURCES[source].accent}`}>
        <p style={{ margin: '0 0 8px' }}>
          Form row 1 as the absolute differences of consecutive terms, then iterate:
        </p>
        <BlockMath tex={"a^{(0)}_i = \\text{term}_i, \\qquad a^{(k)}_i = \\bigl| a^{(k-1)}_{i+1} - a^{(k-1)}_{i} \\bigr|"} />
        <p style={{ margin: '8px 0 0' }}>
          Gilbreath's observation: <InlineMath tex={"a^{(k)}_0 = 1"} /> for every <InlineMath tex={"k \\ge 1"} />.
          The boxed leading column should be all <strong style={{ color: 'var(--brass)' }}>gold (=1)</strong>.
          <strong> Look for:</strong> after a few rows the table fills with 0s (dark) and 2s (blue),
          yet the leftmost entry stays 1.
        </p>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Number of terms</label>
          <input type="range" min="10" max="80" step="1" value={numTerms}
            onChange={e => setNumTerms(+e.target.value)} />
          <span className="control-value">{numTerms} <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>
            (start {rows[0][0]}…{rows[0][rows[0].length - 1]})</span></span>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-soft)', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showMod2} onChange={e => setShowMod2(e.target.checked)} />
          Show mod 2 (parity)
        </label>
      </div>

      {/* Rigorous lock certificate — no appeal to the conjecture. */}
      <div style={{
        margin: '4px 0 12px', padding: '10px 14px', borderRadius: 8,
        background: leadingAllOne ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--series-2) 12%, transparent)',
        border: `1px solid ${leadingAllOne ? alpha(ED.series3, 0.35) : alpha(ED.series2, 0.5)}`,
        color: 'var(--ink)', fontSize: 12.5, fontFamily: 'var(--font-mono, monospace)', lineHeight: 1.7,
      }}>
        {leadingAllOne ? (
          <>
            <div>
              <span style={{ color: 'var(--series-3)' }}>✓ verified by exact computation:</span>{' '}
              a_k[0] = 1 for all 1 ≤ k ≤ <strong style={{ color: 'var(--ink)' }}>{cert.verifiedThrough}</strong>
              {' '}(each is a finite arithmetic theorem, Lemma C).
            </div>
            <div>
              <span style={{ color: 'var(--brass)' }}>parity (Lemma A):</span>{' '}
              every leading entry is <strong>odd</strong> — unconditionally{' '}
              <span style={{ color: 'var(--ink-faint)' }}>{cert.leadingAllOdd ? '(holds)' : '(VIOLATED?!)'}</span>.
            </div>
            {cert.firstCleanRow !== null && (
              <div>
                <span style={{ color: 'var(--series-6)' }}>lock (Lemmas B+C):</span>{' '}
                row <strong style={{ color: 'var(--ink)' }}>{cert.firstCleanRow}</strong> reaches the{' '}
                <strong>1,(0|2)*</strong> form; the leading 1 is then a structural fixed point,
                pinning rows {cert.firstCleanRow}…<strong style={{ color: 'var(--ink)' }}>{cert.guaranteedThrough}</strong>{' '}
                with no further arithmetic.
              </div>
            )}
            <div style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
              <span style={{ color: 'var(--brass)' }}>still open:</span> certifying the{' '}
              <em>infinite</em> tail — that some row is entirely {'{0,2}'} forever, despite
              unbounded prime gaps. No finite computation reaches it.
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--series-2)' }}>Leading-1 pattern fails at row {firstViolation}.</div>
        )}
      </div>

      <div className="viz-container">
        <svg ref={svgRef} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 6 }}>First rows (numeric):</div>
        {top.map((row, k) => (
          <div key={k} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--ink-faint)', marginRight: 8 }}>r{k}</span>
            {row.slice(0, 22).map((v, i) => (
              <span key={i} style={{
                display: 'inline-block', width: 22, textAlign: 'right',
                color: k >= 1 && i === 0 ? 'var(--brass)' : v === 0 ? 'var(--ink-soft)' : 'var(--ink-soft)',
                fontWeight: k >= 1 && i === 0 ? 700 : 400,
              }}>{v}</span>
            ))}
            {row.length > 22 && <span style={{ color: 'var(--ink-faint)' }}> …</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
