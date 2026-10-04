import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

/**
 * DysonVerifierPage (imp-589)
 *
 * In-browser Dyson ODE collision-time verifier.
 * Runs the backward RK4 + Kahan-compensated integration entirely in the browser.
 * The visitor can explore the finite-N t_c(N) collision-time diagnostic
 * from the older Dyson lane (related to, but not the proof of, the
 * Polymath 15 / PT 2021 Lambda bound) and verify that backward heat flow
 * causes zero-pair collisions at a finite time.
 *
 * WASM sub-gap: WAT source is at src/wasm/dyson-rk4/dyson_rk4.wat.
 * Run "wat2wasm src/wasm/dyson-rk4/dyson_rk4.wat -o public/dyson_rk4.wasm"
 * to enable native WASM path (requires wabt toolchain).
 *
 * Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
 * verifier logic and numbers, literal warm-palette hex in place of the
 * dark slate palette.
 */

// ── Kahan-compensated Dyson derivatives ────────────────────────────────────
function dysonDerivatives(gammas, N, direction) {
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0, c = 0;
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gammas[n] - gammas[k];
      if (Math.abs(diff) < 1e-15) continue;
      const term = 1.0 / diff;
      const t = sum + term;
      c += Math.abs(sum) >= Math.abs(term) ? (sum - t) + term : (term - t) + sum;
      sum = t;
    }
    dg[n] = direction * 2.0 * (sum + c);
  }
  return dg;
}

// ── RK4 step ───────────────────────────────────────────────────────────────
function rk4Step(gammas, N, dt, direction) {
  const k1 = dysonDerivatives(gammas, N, direction);
  const y1 = new Float64Array(N);
  for (let i = 0; i < N; i++) y1[i] = gammas[i] + (dt / 2) * k1[i];
  const k2 = dysonDerivatives(y1, N, direction);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + (dt / 2) * k2[i];
  const k3 = dysonDerivatives(y2, N, direction);
  const y3 = new Float64Array(N);
  for (let i = 0; i < N; i++) y3[i] = gammas[i] + dt * k3[i];
  const k4 = dysonDerivatives(y3, N, direction);
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    result[i] = gammas[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return result;
}

// ── Minimum spacing and which pair ─────────────────────────────────────────
function minSpacing(gammas, N) {
  let minS = Infinity, idx = -1;
  for (let i = 0; i < N - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; idx = i; }
  }
  return { spacing: minS, index: idx };
}

// ── Chunked async backward integration ─────────────────────────────────────
// Yields control every CHUNK_STEPS steps so the browser stays responsive.
const CHUNK_STEPS = 50;

async function runBackwardCollision({ N, dt, maxSteps, onProgress }) {
  let gammas = Float64Array.from(ZETA_ZEROS.slice(0, N));
  const { spacing: initSpacing, index: initIdx } = minSpacing(gammas, N);

  // Report initial state immediately so UI shows real spacing before first chunk
  onProgress({
    step: 0,
    t: 0,
    spacing: +initSpacing.toFixed(6),
    pair_index: initIdx,
    done: false,
    collision: null,
    initSpacing: +initSpacing.toFixed(6),
  });

  let step = 0;
  let collision = null;

  while (step < maxSteps && !collision) {
    // Process CHUNK_STEPS steps then yield
    const chunkEnd = Math.min(step + CHUNK_STEPS, maxSteps);
    while (step < chunkEnd) {
      const { spacing, index } = minSpacing(gammas, N);
      if (spacing < 1e-4) {
        collision = {
          t_c: +(step * dt).toFixed(6),
          pair_index: index,
          gamma_a: +gammas[index].toFixed(6),
          gamma_b: +(index + 1 < N ? gammas[index + 1] : gammas[index]).toFixed(6),
          spacing,
        };
        break;
      }
      gammas = rk4Step(gammas, N, dt, -1);
      step++;
    }

    const { spacing: curSpacing, index: curIdx } = minSpacing(gammas, N);
    onProgress({
      step,
      t: +(step * dt).toFixed(5),
      spacing: +curSpacing.toFixed(6),
      pair_index: curIdx,
      done: !!collision || step >= maxSteps,
      collision,
      initSpacing: +initSpacing.toFixed(6),
    });

    if (!collision && step < maxSteps) {
      // Yield to event loop so UI can update
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return {
    collision,
    initSpacing: +initSpacing.toFixed(6),
    initIdx,
    totalSteps: step,
    finalT: +(step * dt).toFixed(4),
  };
}

// ── Styles (editorial warm palette, literal hex — no var()) ────────────────
const S = {
  subtitle: { color: ED.inkFaint, fontSize: 14, marginBottom: 28, lineHeight: 1.6 },
  card: {
    background: ED.paper2,
    border: '1px solid var(--rule)',
    borderRadius: 10,
    padding: '20px 24px',
    marginBottom: 20,
  },
  row: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 },
  label: { color: ED.inkFaint, fontSize: 13, minWidth: 90 },
  val: { color: ED.ink, fontSize: 13 },
  btn: {
    background: ED.brassDeco,
    border: 'none',
    borderRadius: 6,
    color: ED.paper,
    fontFamily: 'var(--ed-mono, var(--font-mono))',
    fontSize: 14,
    padding: '8px 20px',
    cursor: 'pointer',
  },
  btnStop: {
    background: ED.series2,
    border: 'none',
    borderRadius: 6,
    color: ED.paper,
    fontFamily: 'var(--ed-mono, var(--font-mono))',
    fontSize: 14,
    padding: '8px 20px',
    cursor: 'pointer',
  },
  progress: {
    background: ED.paper3,
    border: '1px solid var(--rule-soft)',
    borderRadius: 6,
    padding: '12px 16px',
    fontSize: 13,
    lineHeight: 1.8,
    color: ED.inkSoft,
  },
  collision: {
    background: alpha(ED.series3, 0.1),
    border: '1px solid var(--series-3)',
    borderRadius: 8,
    padding: '16px 20px',
  },
  noCollision: {
    background: alpha(ED.brassDeco, 0.1),
    border: '1px solid var(--brass-deco)',
    borderRadius: 8,
    padding: '16px 20px',
  },
  sectionTitle: { color: ED.brass, fontSize: 14, fontWeight: 600, marginBottom: 10 },
  note: {
    background: alpha(ED.inkFaint, 0.08),
    border: '1px solid var(--rule)',
    borderRadius: 6,
    padding: '12px 16px',
    fontSize: 12,
    color: ED.inkFaint,
    lineHeight: 1.7,
  },
  select: {
    background: ED.paper,
    border: '1px solid var(--rule)',
    borderRadius: 6,
    color: ED.ink,
    fontSize: 13,
    padding: '5px 10px',
    fontFamily: 'var(--ed-mono, var(--font-mono))',
  },
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function DysonVerifierPage() {
  const [N, setN] = useState(30);
  const [dtKey, setDtKey] = useState('5e-4');
  const [maxSteps, setMaxSteps] = useState(6000);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const cancelRef = useRef(false);

  const dtOptions = [
    { label: '5e-4 (default)', value: '5e-4' },
    { label: '1e-3 (faster, coarser)', value: '1e-3' },
    { label: '2e-4 (slower, finer)', value: '2e-4' },
  ];

  const handleRun = useCallback(async () => {
    cancelRef.current = false;
    setRunning(true);
    setResult(null);
    setProgress({ step: 0, t: 0, spacing: null, pair_index: null, done: false, collision: null });

    const dt = parseFloat(dtKey);

    try {
      const res = await runBackwardCollision({
        N,
        dt,
        maxSteps,
        onProgress: (p) => {
          if (!cancelRef.current) setProgress(p);
        },
      });

      if (!cancelRef.current) {
        setResult(res);
        setProgress(p => ({ ...p, done: true }));
      }
    } finally {
      setRunning(false);
    }
  }, [N, dtKey, maxSteps]);

  const handleStop = useCallback(() => {
    cancelRef.current = true;
    setRunning(false);
    setProgress(p => p ? { ...p, done: true } : p);
  }, []);

  const dt = parseFloat(dtKey);
  const maxT = (maxSteps * dt).toFixed(2);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>Dyson Collision Verifier</h1>
        <p style={S.subtitle}>
          In-browser RK4 integration of the backward Dyson ODE — explores the finite-N Dyson collision
          mechanism related to the Polymath 15 / PT 2021 Lambda bound (the collision-time diagnostic used
          in the older Dyson lane, not the bound's proof). Runs entirely in your browser (pure JavaScript).
          &nbsp;<Link to="/rh-attack" style={{ color: 'var(--accent)' }}>RH Approach page</Link> has context.
        </p>

        <AnimationEmbed id="colliding-zeros" />

        {/* Theory card */}
        <div style={S.card}>
          <div style={S.sectionTitle}>Theory: How collisions relate to Lambda</div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>
            The de Bruijn-Newman constant Lambda is defined as the infimum of all t for which
            H&#x209C;(z) = 0 implies Im(z) &gt;= 0. Under backward heat flow (t decreasing),
            the zeros of H&#x209C; evolve by the <em>deterministic Dyson ODE</em>:
          </p>
          <pre style={{ background: 'var(--paper-3)', border: '1px solid var(--rule-soft)', padding: '10px 14px', borderRadius: 6,
            fontSize: 13, color: 'var(--brass)', margin: '12px 0 8px', overflowX: 'auto' }}>
{`dγ_n/dt = -2 · Σ_{k≠n} 1/(γ_n - γ_k)   [backward: attraction]`}
          </pre>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>
            Zeros attract until a pair <em>collides</em> at time t&#x2099;. A finite-N collision at
            t&#x2099; &lt; 0 does <em>not</em> by itself give a rigorous upper bound on Lambda: the
            bracket is Lambda &lt;= -t&#x2099; + E(N), where E(N) is a truncation/coupling error whose
            constant (C_H) remains undischarged — see{' '}
            <Link to="/rh-proof-state" style={{ color: 'var(--accent)' }}>RH Proof State</Link>.
            The Platt-Trudgian 2021 theorem Lambda &lt;= 0.2 is an independent barrier argument that
            binds on the verified zero height, not on this simulation; this page illustrates the
            collision mechanism but does not reproduce or confirm that bound.
          </p>
        </div>

        {/* Controls */}
        <div style={S.card}>
          <div style={S.sectionTitle}>Computation Parameters</div>
          <div style={S.row}>
            <span style={S.label}>N (zeros):</span>
            <input
              type="range"
              min={10} max={Math.min(100, ZETA_ZEROS.length)} step={5}
              value={N}
              onChange={e => setN(+e.target.value)}
              style={{ width: 160 }}
              disabled={running}
            />
            <span style={S.val}>{N}</span>
          </div>
          <div style={S.row}>
            <span style={S.label}>Step size dt:</span>
            <select
              value={dtKey}
              onChange={e => setDtKey(e.target.value)}
              style={S.select}
              disabled={running}
            >
              {dtOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div style={S.row}>
            <span style={S.label}>Max steps:</span>
            <select
              value={maxSteps}
              onChange={e => setMaxSteps(+e.target.value)}
              style={S.select}
              disabled={running}
            >
              <option value={2000}>2,000 (t up to {(2000 * dt).toFixed(2)})</option>
              <option value={6000}>6,000 (t up to {(6000 * dt).toFixed(2)})</option>
              <option value={15000}>15,000 (t up to {(15000 * dt).toFixed(2)})</option>
            </select>
          </div>
          <div style={S.row}>
            <span style={S.label}></span>
            <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>
              N={N}, dt={dtKey}, max t = {maxT} — O(N^2 * steps) = ~{(N * N * maxSteps / 1e6).toFixed(1)}M ops
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {!running ? (
              <button style={S.btn} onClick={handleRun}>Run in Browser</button>
            ) : (
              <button style={S.btnStop} onClick={handleStop}>Stop</button>
            )}
          </div>
        </div>

        {/* Progress */}
        {progress && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Live Progress</div>
            <div style={S.progress}>
              <div>Step: <span style={{ color: 'var(--brass)' }}>{progress.step.toLocaleString()}</span>
                {' / '}{maxSteps.toLocaleString()} &nbsp;|&nbsp;
                t = <span style={{ color: 'var(--brass)' }}>{progress.t}</span>
              </div>
              {progress.spacing != null && (
                <div>Min spacing: <span style={{
                  color: progress.spacing < 0.01 ? 'var(--accent)' : progress.spacing < 0.1 ? 'var(--brass)' : 'var(--series-3)',
                  fontWeight: 600,
                }}>{progress.spacing}</span>
                {' '}&nbsp;(pair index {progress.pair_index})
                {progress.initSpacing != null && progress.initSpacing > 0 && (
                  <span style={{ color: 'var(--series-1)', marginLeft: 10 }}>
                    — {Math.max(0, (1 - progress.spacing / progress.initSpacing) * 100).toFixed(1)}% closed
                    <span style={{ color: 'var(--ink-faint)' }}> (init: {progress.initSpacing})</span>
                  </span>
                )}
                </div>
              )}
              {running && (
                <div style={{ color: 'var(--ink-faint)', marginTop: 4 }}>
                  {progress.spacing != null && progress.spacing < 0.1
                    ? 'Zeros closing in — collision imminent...'
                    : 'Integrating backward...'}
                </div>
              )}
              {progress.done && !result && (
                <div style={{ color: 'var(--ink-faint)' }}>Computation stopped.</div>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Result</div>
            {result.collision ? (
              <div style={S.collision}>
                <div style={{ color: 'var(--series-3)', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
                  Collision detected!
                </div>
                <div style={S.row}>
                  <span style={S.label}>t&#x2099; =</span>
                  <span style={{ ...S.val, color: 'var(--series-3)', fontSize: 15 }}>{result.collision.t_c}</span>
                </div>
                <div style={S.row}>
                  <span style={S.label}>|t&#x2099;| =</span>
                  <span style={{ ...S.val, color: 'var(--series-3)', fontSize: 15 }}>
                    {Math.abs(parseFloat(result.collision.t_c)).toFixed(4)}
                  </span>
                  <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>
                    (bracket Lambda &lt;= |t&#x2099;| + E(N); not rigorous — C_H undischarged)
                  </span>
                </div>
                <div style={S.row}>
                  <span style={S.label}>Pair index:</span>
                  <span style={S.val}>{result.collision.pair_index}</span>
                </div>
                <div style={S.row}>
                  <span style={S.label}>gamma_a =</span>
                  <span style={S.val}>{result.collision.gamma_a}</span>
                </div>
                <div style={S.row}>
                  <span style={S.label}>gamma_b =</span>
                  <span style={S.val}>{result.collision.gamma_b}</span>
                </div>
                <div style={S.row}>
                  <span style={S.label}>Steps taken:</span>
                  <span style={S.val}>{result.totalSteps.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div style={S.noCollision}>
                <div style={{ color: 'var(--brass)', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                  No collision found in t in [0, {result.finalT}]
                </div>
                <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  Increase max steps, decrease dt, or increase N to search further backward.
                  The tightest Lehmer pair (around zero index 453) typically collides at
                  t around 0.9 for N=50, requiring t &lt;= 2.
                </p>
              </div>
            )}

            <div style={{ marginTop: 14, color: 'var(--ink-faint)', fontSize: 12 }}>
              Initial conditions: N={N} lowest zeros of zeta, initial min spacing = {result.initSpacing}
              (pair {result.initIdx}).
            </div>
          </div>
        )}

        {/* WASM note */}
        <div style={S.note}>
          <strong style={{ color: 'var(--ink-faint)' }}>WASM sub-gap (imp-589):</strong>{' '}
          This page uses pure JavaScript (RK4 + Kahan-compensated summation from{' '}
          <code>src/math/dyson-ode-integrator.js</code>). A WebAssembly port would
          run ~5-10x faster and allow verification at N up to 500+ without noticeable lag.
          WAT source lives at{' '}
          <code>src/wasm/dyson-rk4/dyson_rk4.wat</code> (to be added).
          Compile with: <code>wat2wasm src/wasm/dyson-rk4/dyson_rk4.wat -o public/dyson_rk4.wasm</code>
          (requires{' '}
          <a href="https://github.com/WebAssembly/wabt" style={{ color: 'var(--series-1)' }}
            target="_blank" rel="noreferrer">wabt toolchain</a>).
        </div>

        {/* Related pages */}
        <div className="card" style={{ ...S.card, marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--ink-faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/rh-attack" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              → RH Approach
            </Link>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/viz-winding-dyson-flow" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → Winding / Dyson-flow visualization
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
