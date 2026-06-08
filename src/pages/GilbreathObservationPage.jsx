import React from 'react';
import { Link } from 'react-router-dom';
import GilbreathTriangleViz from '../components/GilbreathTriangleViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function GilbreathObservationPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Gilbreath's Observation Explorer</h1>
        <p>
          Write out the primes <InlineMath tex={"2, 3, 5, 7, 11, 13, \\ldots"} />, take the
          absolute differences of consecutive terms to form a new row, then repeat on that row,
          and so on. In 1958 Norman Gilbreath noticed (and Proth had observed in 1878) that the{' '}
          <strong>first entry of every derived row is always 1</strong>. Whether this holds
          forever is still an <strong style={{ color: '#f59e0b' }}>open conjecture</strong>. This
          explorer builds the iterated-difference triangle and boxes the leading column where the
          1s live.
        </p>
      </div>

      <BlockMath tex={"a^{(0)}_i = p_{i+1}, \\qquad a^{(k)}_i = \\bigl| a^{(k-1)}_{i+1} - a^{(k-1)}_{i} \\bigr|, \\qquad a^{(k)}_0 \\stackrel{?}{=} 1 \\;\\; \\forall k \\ge 1"} />

      <div style={{ marginTop: 32 }}>
        <GilbreathTriangleViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#06b6d4' }}>What the Triangle Shows</h3>
          <p style={{ marginTop: 8 }}>
            Row 0 is the prime sequence itself. Each subsequent row is the row of absolute
            differences of the one above it, so the triangle narrows by one cell per row. After
            just a few rows the entries collapse almost entirely into{' '}
            <strong style={{ color: '#334155' }}>0s</strong> and{' '}
            <strong style={{ color: '#3b82f6' }}>2s</strong> — yet the leftmost entry stubbornly
            stays at <strong style={{ color: '#fbbf24' }}>1</strong>. That persistent leading 1 is
            the entire content of Gilbreath's observation.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>Is It Really About Primes?</h3>
          <p style={{ marginTop: 8 }}>
            Surprisingly, perhaps not. Hallard Croft conjectured that the leading-1 phenomenon is
            not special to primes at all — it should hold for <em>any</em> sequence that starts
            with 1 (or 2), grows reasonably, and whose gaps are even and not too large. Use the
            source toggle above to test this: drop the prime 2, or switch to a{' '}
            <strong>random even-gap sequence</strong>, and watch the leading 1s persist anyway.
            This reframes Gilbreath's conjecture as a statement about difference dynamics rather
            than about primes specifically.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 12 }}>
          Status: Open, but Heavily Verified
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Gilbreath's conjecture has <strong>never been proved</strong>. However, Andrew Odlyzko
          verified in 1993 that the leading entry stays 1 for every derived row down to a depth
          determined by the primes up to <InlineMath tex={"\\pi(10^{13}) \\approx 3.4 \\times 10^{11}"} /> terms.
          A heuristic argument explains <em>why</em> we expect it to hold — once a row consists
          mostly of 0s and 2s, the difference operation tends to preserve a leading 1 — but
          turning that heuristic into a rigorous proof remains elusive, largely because it
          requires control over the fine structure of prime gaps.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderColor: '#3b82f6' }}>
        <h3 style={{ color: '#3b82f6' }}>Reading the Heatmap</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          Each cell is colored by its value:{' '}
          <strong style={{ color: '#334155' }}>0 is dark</strong>,{' '}
          <strong style={{ color: '#fbbf24' }}>1 is gold</strong>,{' '}
          <strong style={{ color: '#3b82f6' }}>2 is blue</strong>, and larger values fade into a
          hot inferno palette. The boxed leftmost column is drawn{' '}
          <strong style={{ color: '#22c55e' }}>green</strong> when every derived row begins with 1
          and <strong style={{ color: '#ef4444' }}>red</strong> if the pattern ever breaks. Slide
          the term count and switch sources to probe how robust the leading-1 column really is.
        </p>
      </div>

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/twin-ladder" style={{ color: '#8b5cf6', fontSize: 13 }}>Twin Ladder</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/mills-theorem" style={{ color: '#f59e0b', fontSize: 13 }}>Mills' Theorem</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/zeta" style={{ color: '#3b82f6', fontSize: 13 }}>Zeta Function</Link>
        </div>
      </div>
    </div>
  );
}
