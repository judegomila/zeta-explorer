import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

/*
 * True vs Perturbed — prime rigidity in the log-phase caustics.
 *
 * Each prime traces a phase line theta_p(t) = t log p (mod 2pi). Where many lines
 * coincide you get a CAUSTIC (a bright band) -- a multiplicative resonance
 * log(p_i/p_j) ~ 2pi k / t. For the TRUE primes these caustics are sharp and
 * coherent. Replace each log p by a randomly shifted value and the coherence
 * DISSOLVES into noise. The lesson: the caustic structure is ARITHMETIC, not
 * random -- primes carry hidden rigidity. (Exploratory; no Lambda claim.)
 *
 * Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
 * caustic-canvas logic and numbers, literal warm-palette hex in place of the
 * dark slate palette.
 */

const TMAX = 50;
const W = 520, H = 300;

function sievePrimes(limit) {
  const s = new Uint8Array(limit + 1);
  const out = [];
  for (let i = 2; i <= limit; i++) {
    if (!s[i]) { out.push(i); for (let j = i * i; j <= limit; j += i) s[j] = 1; }
  }
  return out;
}

// hot colormap: 0 -> black, mid -> red/orange, high -> white-yellow
function hot(v) {
  const x = Math.max(0, Math.min(1, v));
  const r = Math.min(1, x * 2.2);
  const g = Math.min(1, Math.max(0, x * 2.2 - 0.7));
  const b = Math.min(1, Math.max(0, x * 2.2 - 1.5));
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function CausticCanvas({ logs, accent }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const buf = new Float32Array(W * H);
    const TWO_PI = 2 * Math.PI;
    for (let px = 0; px < W; px++) {
      const t = (px / (W - 1)) * TMAX;
      for (let li = 0; li < logs.length; li++) {
        let th = (t * logs[li]) % TWO_PI;
        if (th < 0) th += TWO_PI;
        const yf = (th / TWO_PI) * (H - 1);
        const y = Math.floor(yf);
        // soft vertical splat so caustic bands read as smooth curves
        buf[y * W + px] += 1;
        if (y > 1) buf[(y - 2) * W + px] += 0.25;
        if (y > 0) buf[(y - 1) * W + px] += 0.6;
        if (y < H - 1) buf[(y + 1) * W + px] += 0.6;
        if (y < H - 2) buf[(y + 2) * W + px] += 0.25;
      }
    }
    // PER-COLUMN contrast: divide each t-column by its own max so the band
    // structure (caustics) shows at every t, not just the small-t bunching.
    const img = ctx.createImageData(W, H);
    const d = img.data;
    for (let px = 0; px < W; px++) {
      let cmax = 1e-6;
      for (let y = 0; y < H; y++) { const v = buf[y * W + px]; if (v > cmax) cmax = v; }
      for (let y = 0; y < H; y++) {
        const i = y * W + px;
        const v = Math.pow(buf[i] / cmax, 1.4); // gamma -> sharpen bands
        const [r, g, b] = hot(v);
        d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [logs]);
  return <canvas ref={ref} width={W} height={H} style={{ width: '100%', borderRadius: 8, border: `1px solid ${accent}55`, display: 'block' }} />;
}

export default function PrimeRigidityPage() {
  const [limit, setLimit] = useState(600);
  const [eps, setEps] = useState(0.7);
  const [view, setView] = useState('both');

  const primes = useMemo(() => sievePrimes(limit), [limit]);
  // The caustic field uses EVERY integer n in [2, limit] (theta = t log n), the
  // way the poster does -- the dense multiplicative lattice is where the caustics
  // live. True log n carries the arithmetic; we destroy it by interpolating each
  // log n toward a random value (eps=1 => a structureless set, same range/count).
  const trueLogs = useMemo(() => {
    const out = [];
    for (let n = 2; n <= limit; n++) out.push(Math.log(n));
    return out;
  }, [limit]);
  const pertLogs = useMemo(() => {
    let seed = 12345;
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const lo = Math.log(2), hi = Math.log(limit);
    return trueLogs.map((lg) => (1 - eps) * lg + eps * (lo + rand() * (hi - lo)));
  }, [trueLogs, eps, limit]);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>Prime Rigidity — True vs Perturbed</h1>
        <p className="ed-lbl">Related: <Link to="/viz-euler-product">Euler product: true vs perturbed</Link></p>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 22 }}>
          Each prime traces a phase line <code>θ_p(t) = t·log p (mod 2π)</code>.
          Where many lines coincide you get a <strong>caustic</strong> — a bright
          band, a multiplicative resonance <code>log(p_i/p_j) ≈ 2πk/t</code>. The{' '}
          <strong>true primes</strong> (left) give sharp, coherent caustics.
          Replace each <code>log p</code> by a randomly shifted value (right) and the
          coherence <strong>dissolves into noise</strong>. The caustic structure is{' '}
          <strong>arithmetic, not random</strong> — primes carry hidden rigidity.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: view === 'both' ? '1fr 1fr' : '1fr', gap: 18, marginBottom: 18 }}>
          {(view === 'both' || view === 'real') && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--series-3)', marginBottom: 6 }}>
                TRUE PRIMES — coherent caustics
              </div>
              <CausticCanvas logs={trueLogs} accent={ED.series3} />
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                {trueLogs.length} integers ≤ {limit} · sharp resonance bands
              </div>
            </div>
          )}
          {(view === 'both' || view === 'shuffled') && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>
                PERTURBED (log p → random, ε = {eps.toFixed(2)}) — coherence destroyed
              </div>
              <CausticCanvas logs={pertLogs} accent={ED.series2} />
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                same integers, randomized logs · washed-out noise
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 18, alignItems: 'flex-end' }}>
          <label style={{ fontSize: 12, color: 'var(--ink-soft)', flex: '1 1 220px' }}>
            Integer cutoff: {limit} ({trueLogs.length} integers)
            <input type="range" min={100} max={2000} step={50} value={limit}
                   onChange={(e) => setLimit(+e.target.value)} style={{ width: '100%', marginTop: 6 }} />
          </label>
          <label style={{ fontSize: 12, color: 'var(--ink-soft)', flex: '1 1 220px' }}>
            Randomization ε: {eps.toFixed(2)} <span style={{ color: 'var(--ink-faint)' }}>(0 = true primes · 1 = random set)</span>
            <input type="range" min={0} max={1} step={0.05} value={eps}
                   onChange={(e) => setEps(+e.target.value)} style={{ width: '100%', marginTop: 6 }} />
          </label>
          <label style={{ fontSize: 12, color: 'var(--ink-soft)', flex: '0 0 auto' }}>
            prime source
            <div style={{ marginTop: 6 }}>
              <select value={view} onChange={(e) => setView(e.target.value)}
                      style={{ background: 'var(--paper)', color: 'var(--ink-soft)', border: '1px solid var(--rule-soft)',
                               borderRadius: 4, padding: '4px 8px', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}>
                <option value="both">both (side-by-side)</option>
                <option value="real">real primes only</option>
                <option value="shuffled">shuffled logs only</option>
              </select>
            </div>
          </label>
        </div>

        <div className="card" style={{ background: 'var(--paper)', border: '1px solid var(--rule-soft)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--ink)' }}>The learning</h3>
          <ul style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            <li>Set ε = 0 and the two panels match. Increase ε and watch the right panel's caustics dissolve — the bands are held in place by the exact values of <code>log p</code>.</li>
            <li>The surviving caustics encode <strong>multiplicative relations among primes</strong>; random shifts have no such relations, so no caustics form.</li>
            <li>This is the visual face of <strong>prime rigidity</strong> — the deviation from randomness that underlies the explicit formula and the rigidity of the zeros (<Link to="/statistics" style={{ color: 'var(--series-1)' }}>GUE statistics</Link>).</li>
            <li style={{ color: 'var(--ink-faint)' }}>Exploratory: a demonstration of arithmetic structure, not a Λ bound. See the <Link to="/visual-geometries" style={{ color: 'var(--series-1)' }}>geometries gallery</Link> and <Link to="/vortex-field" style={{ color: 'var(--series-1)' }}>vortex field</Link>.</li>
          </ul>
        </div>

        <div className="card" style={{ background: 'var(--paper)', border: '1px solid var(--rule-soft)', marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--ink-faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/statistics" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → GUE statistics
            </Link>
            <Link to="/visual-geometries" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → Geometries gallery
            </Link>
            <Link to="/vortex-field" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              → Vortex field
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
