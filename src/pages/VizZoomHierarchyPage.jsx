// VizZoomHierarchyPage.jsx -- imp-2679 (Visual Geometries poster, panel 10)
//
// Zoom Hierarchy of the log-phase prime spiral. Three side-by-side renders
// of the SAME embedding at three disjoint scales:
//
//     window A : p in [10^2, 10^3]
//     window B : p in [10^4, 10^5]
//     window C : p in [10^6, 10^7]
//
// The log-phase prime spiral places each prime p at
//
//     radius  r(p) = (log p - log lo) / (log hi - log lo)   in [0, 1]
//     angle   theta(p) = (phi0 * log p) mod 2*pi
//
// with phi0 = WIND * 2*pi / log 10, so the angular law completes exactly
// WIND full turns per decade. Because every window is one decade wide and
// the windows are separated by whole decades, the deterministic phase law
// is IDENTICAL across the three panels: the only thing that changes between
// scales is the (statistical) placement of the primes. By the prime number
// theorem the primes' log-density is asymptotically scale-invariant, so the
// three panels look APPROXIMATELY self-similar -- a renormalization-like
// picture of the prime spiral. This is a visual/empirical observation, not
// a theorem, and makes no Lambda or RH claim (see-scope card below).
//
// Primes are generated on the fly with a bounded segmented sieve (base
// primes up to sqrt(1e7) ~ 3163, then strided sampling capped per panel)
// so the page carries NO heavy data import.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

// Editorial (warm) re-theme: identical math/canvas logic, warm chrome.
// Canvas colors are literal warm hex (canvas fill/stroke can't use CSS vars):
// paper2 #f6f1e7, faint #877b67, hairline #d5c9b2. The per-prime radial
// color ramp (purple->teal->yellow) is a data-encoding scale, left unchanged,
// same treatment as the other viz pages' heatmap/spiral ramps.

const LN10 = Math.log(10);

// The three decade windows of the zoom hierarchy.
const WINDOWS = [
  { key: 'A', lo: 1e2, hi: 1e3, label: '[10^2, 10^3]' },
  { key: 'B', lo: 1e4, hi: 1e5, label: '[10^4, 10^5]' },
  { key: 'C', lo: 1e6, hi: 1e7, label: '[10^6, 10^7]' },
];

const RENDER_CAP = 2600; // max plotted primes per panel (keeps the draw light)
const PANEL = 300; // canvas px per panel

// Simple sieve of Eratosthenes returning all primes <= n.
function basePrimes(n) {
  const sieve = new Uint8Array(n + 1);
  const out = [];
  for (let i = 2; i <= n; i++) {
    if (!sieve[i]) {
      out.push(i);
      for (let j = i * i; j <= n; j += i) sieve[j] = 1;
    }
  }
  return out;
}

// Segmented sieve over [lo, hi]. Sweeps in fixed-size chunks so memory stays
// ~CHUNK bytes regardless of window width, and strides the survivors so at
// most ~cap primes are returned (estimated via the PNT count, then refined).
function sampledPrimesInWindow(lo, hi, base, cap) {
  // PNT estimate of the prime count in [lo, hi] picks the stride.
  const estCount = Math.max(
    1,
    Math.round(hi / Math.log(hi) - lo / Math.log(lo)),
  );
  const stride = Math.max(1, Math.ceil(estCount / cap));
  const CHUNK = 1 << 19; // 524288
  const seg = new Uint8Array(CHUNK);
  const primes = [];
  let seen = 0; // running index of primes found, for striding
  for (let segLo = lo; segLo <= hi; segLo += CHUNK) {
    const segHi = Math.min(segLo + CHUNK - 1, hi);
    seg.fill(0, 0, segHi - segLo + 1);
    for (let bi = 0; bi < base.length; bi++) {
      const p = base[bi];
      if (p * p > segHi) break;
      // First multiple of p within [segLo, segHi], and at least p*p.
      let start = Math.ceil(segLo / p) * p;
      if (start < p * p) start = p * p;
      for (let j = start; j <= segHi; j += p) seg[j - segLo] = 1;
    }
    for (let k = segLo; k <= segHi; k++) {
      if (!seg[k - segLo]) {
        if (seen % stride === 0) primes.push(k);
        seen++;
      }
    }
  }
  return { primes, totalApprox: seen, stride };
}

// Build all three panels once. Returns per-window {primes, totalApprox, stride}.
function buildHierarchy() {
  const base = basePrimes(Math.ceil(Math.sqrt(1e7)) + 1);
  return WINDOWS.map((w) => ({
    ...w,
    ...sampledPrimesInWindow(w.lo, w.hi, base, RENDER_CAP),
  }));
}

export default function VizZoomHierarchyPage() {
  const [wind, setWind] = useState(3); // turns per decade
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle|computing|done|error
  const canvasRefs = [useRef(null), useRef(null), useRef(null)];

  // Generate the three prime sets once (independent of the phase slider).
  useEffect(() => {
    let cancelled = false;
    setStatus('computing');
    const handle = setTimeout(() => {
      try {
        const h = buildHierarchy();
        if (!cancelled) {
          setData(h);
          setStatus('done');
        }
      } catch (e) {
        if (!cancelled) setStatus('error');
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, []);

  const phi0 = useMemo(() => (wind * 2 * Math.PI) / LN10, [wind]);

  // Draw each panel whenever data or the phase slider changes.
  useEffect(() => {
    if (!data) return;
    for (let pIdx = 0; pIdx < WINDOWS.length; pIdx++) {
      const canvas = canvasRefs[pIdx].current;
      if (!canvas) continue;
      const W = PANEL;
      const H = PANEL;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = ED.paper2;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const pad = 22;
      const rPx = Math.min(W, H) / 2 - pad;

      // Faint unit-disk boundary + spokes for the shared frame.
      ctx.strokeStyle = ED.rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, rPx * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      const win = data[pIdx];
      const logLo = Math.log(win.lo);
      const logHi = Math.log(win.hi);
      const span = logHi - logLo;

      for (let i = 0; i < win.primes.length; i++) {
        const lp = Math.log(win.primes[i]);
        const rNorm = (lp - logLo) / span; // [0, 1]
        let theta = (phi0 * lp) % (2 * Math.PI);
        if (theta < 0) theta += 2 * Math.PI;
        const r = rNorm * rPx;
        const x = cx + r * Math.cos(theta);
        const y = cy - r * Math.sin(theta);
        // Color by radius (viridis-ish purple->teal->yellow) so the
        // shared radial structure is comparable across panels.
        const u = rNorm;
        const cr = Math.round(68 + u * (253 - 68));
        const cg = Math.round(1 + u * (231 - 1));
        const cb = Math.round(84 + u * (37 - 84));
        ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',0.85)';
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Panel caption.
      ctx.fillStyle = ED.inkFaint;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('p ∈ ' + win.label, cx, H - 7);
    }
  }, [data, phi0, canvasRefs]);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz &middot; zoom hierarchy</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>Zoom Hierarchy of the Log-Phase Prime Spiral</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
          The same log-phase prime spiral rendered at three disjoint scales
          (p in [10&sup2;,10&sup3;], [10&#8308;,10&#8309;], [10&#8310;,10&#8311;]).
          Each window is one decade wide and the phase law winds a whole number
          of turns per decade, so the deterministic frame is identical across
          panels &mdash; only the prime placement changes, revealing the
          approximate (renormalization-like) self-similarity of the primes.
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link
            to="/visual-geometries"
            style={{ color: 'var(--blue)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}
          >
            &larr; Visual Geometries gallery
          </Link>
          <Link
            to="/visualizations"
            style={{ color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}
          >
            &larr; Visualizations index
          </Link>
          <Link
            to="/viz-hyperbolic-prime-spiral"
            style={{ color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}
          >
            &larr; Hyperbolic Prime Spiral
          </Link>
        </div>

      {/* Formula card */}
      <div
        className="card"
        style={{ marginTop: 18, padding: 14, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--blue)' }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--blue)',
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 10,
          }}
        >
          shared embedding
        </div>
        <div style={{ overflowX: 'auto' }}>
          <BlockMath tex={'r(p) = \\frac{\\log p - \\log p_{\\mathrm{lo}}}{\\log p_{\\mathrm{hi}} - \\log p_{\\mathrm{lo}}} \\in [0,1]'} />
          <BlockMath tex={'\\theta(p) = \\big(\\varphi_0\\,\\log p\\big) \\bmod 2\\pi, \\qquad \\varphi_0 = \\frac{2\\pi\\,W}{\\log 10}'} />
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
          With <InlineMath tex={'\\varphi_0 = 2\\pi W / \\log 10'} /> the angle
          advances by exactly <InlineMath tex={'2\\pi W'} /> (i.e.{' '}
          <InlineMath tex={'W'} /> whole turns) across one decade. Shifting{' '}
          <InlineMath tex={'\\log p'} /> by any whole number of decades leaves{' '}
          <InlineMath tex={'\\theta'} /> unchanged, so the three panels share an
          identical angular frame and differ only in where the primes land.
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--paper2)',
          border: '1px solid var(--hairline)',
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 18,
        }}
      >
        <label
          style={{
            fontSize: 11,
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            color: 'var(--ink-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          turns per decade W = {wind}
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={wind}
            onChange={(e) => setWind(Number(e.target.value))}
          />
        </label>
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            color:
              status === 'done'
                ? 'var(--green)'
                : status === 'computing'
                  ? 'var(--brass)'
                  : status === 'error'
                    ? 'var(--terra-dk)'
                    : 'var(--faint)',
          }}
        >
          status: {status}
          {data
            ? ' · ' +
              data.map((d) => '~' + d.totalApprox + 'p/' + d.primes.length + 'drawn').join(' · ')
            : ''}
        </span>
      </div>

      {/* Three panels */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--paper2)',
          border: '1px solid var(--hairline)',
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        {WINDOWS.map((w, i) => (
          <canvas
            key={w.key}
            ref={canvasRefs[i]}
            width={PANEL}
            height={PANEL}
            style={{
              width: PANEL,
              height: PANEL,
              maxWidth: '100%',
              display: 'block',
              background: 'var(--paper-2)',
              borderRadius: 6,
            }}
            role="img"
            aria-label={'Log-phase prime spiral for p in ' + w.label}
          />
        ))}
      </div>

      {/* Scope */}
      <div
        className="card"
        style={{ marginTop: 24, padding: 14, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--blue)' }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--blue)',
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          scope &amp; method
        </div>
        <ul
          style={{
            color: 'var(--ink-soft)',
            fontSize: 13,
            lineHeight: 1.7,
            paddingLeft: 18,
          }}
        >
          <li>
            <strong>What is exact.</strong> The phase frame is exactly periodic
            across decades by construction (integer turns per decade); the
            primes are exact (segmented sieve).
          </li>
          <li>
            <strong>What is approximate.</strong> The cross-scale resemblance
            is the prime number theorem&apos;s asymptotic scale-invariance of
            log-density made visible &mdash; an empirical, renormalization-like
            observation. It is <em>not</em> a theorem of exact self-similarity
            and proves nothing about the zeros, &Lambda;, or RH.
          </li>
          <li>
            <strong>Sampling.</strong> Each panel strides its window to at most{' '}
            {RENDER_CAP} plotted primes (the top decade-pair holds ~10&#8309;
            primes), so the dot <em>count</em> per panel is comparable while the
            underlying density grows with scale. The status line reports the
            approximate true count and the number actually drawn.
          </li>
          <li>
            <strong>No heavy import.</strong> Primes are generated in-browser by
            a bounded segmented sieve; this page imports no zero/prime data
            bundle.
          </li>
        </ul>
      </div>

      {/* Source footer */}
      <div
        style={{
          marginTop: 20,
          fontSize: 11,
          color: 'var(--faint)',
          lineHeight: 1.6,
          fontFamily: 'var(--ed-mono, var(--font-mono))',
        }}
      >
        embedding: r = log p (window-normalized), &theta; = (&phi;&#8320; log p) mod
        2&pi; &middot; primes: in-browser segmented sieve &middot; companion:
        /viz-hyperbolic-prime-spiral
      </div>

      {/* Footer */}
      <div style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
        <Link to="/" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>
          &larr; the atlas
        </Link>
      </div>
      </div>
    </div>
  );
}
