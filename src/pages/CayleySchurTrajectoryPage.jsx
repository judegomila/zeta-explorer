// CayleySchurTrajectoryPage.jsx -- imp-1294 (MEDIUM COMPLEXITY)
//
// Visualization of the Cayley transform of the canonical-system m-function,
// yielding the Schur function Θ_a(z) in the unit disk. The Cayley-Schur
// connection is the de Branges-Krein bijection (Krein 1955, de Branges 1968,
// Romanov 2010, Winkler 1995): canonical-system Weyl m-function ↦ unit-disk
// Schur class via Cayley(m) = (m - i)/(m + i).
//
// The Schur function is computed as Θ_a(z) = E_a^#(z) / E_a(z), where:
//   X(w) := ξ(1/2 + w)     [completed Riemann xi at 1/2 + w]
//   E_a(z) := X(a - iz)
//   E_a^#(z) := X(-a - iz)
//
// Plot: animated unit-disk visualization of Θ_a(it) for t ∈ [0, 100],
// a ∈ {0.001, 0.05, 0.5}. The trajectory winds around the disk as t
// increases; membership in |z| < 1 (Schur class) is the open content of
// Conjecture 27.2. Cites Krein 1955, de Branges 1968 Thm 40.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { zetaCriticalStrip, cAbs, cDiv, cSub, cAdd, cMul, cLog, cExp } from '../math/zeta.js';

// ── Gamma function approximation (Lanczos) for Re(z) > 0 ────────────────────
// Approximates Γ(z) to ~15 decimal places using Lanczos coefficients.
function gammaLanczos(z) {
  // Lanczos coefficients (g = 7, N = 9)
  const coef = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  const g = 7;
  const z_val = z;
  if (z_val[0] < 0.5) {
    // Use reflection formula: Γ(z)Γ(1-z) = π/sin(πz)
    const oneMinusZ = cSub([1, 0], z_val);
    const gammaOneMinusZ = gammaLanczos(oneMinusZ);
    const sinArg = cMul([Math.PI, 0], z_val);
    const sinVal = [Math.sin(sinArg[0]) * Math.cosh(sinArg[1]),
                    Math.cos(sinArg[0]) * Math.sinh(sinArg[1])];
    const piOverSin = cDiv([Math.PI, 0], sinVal);
    return cDiv(piOverSin, gammaOneMinusZ);
  }
  const z_minus_1 = cSub(z_val, [1, 0]);
  let x = [coef[0], 0];
  for (let i = 1; i < coef.length; i++) {
    x = cAdd(x, cDiv([coef[i], 0], cAdd(z_minus_1, [i, 0])));
  }
  const t = cAdd(z_minus_1, [g + 0.5, 0]);
  const sqrt2Pi = Math.sqrt(2 * Math.PI);
  const term1 = cMul([sqrt2Pi, 0], cExp(cMul(cAdd(z_minus_1, [0.5, 0]), cLog(t))));
  const term2 = cExp(cSub(t, [0, 0]));
  return cMul(term1, cMul(x, term2));
}

// ── Compute ξ(s) = (1/2)·s·(s-1)·π^(-s/2)·Γ(s/2)·ζ(s) ────────────────────────
function xiFunction(s) {
  const zeta = zetaCriticalStrip(s, 50);
  const half = [0.5, 0];
  const sPow = cMul(s, cMul(cSub(s, [1, 0]), half));
  const logPi = Math.log(Math.PI);
  const sPowerNegative = cMul(cMul(s, [-0.5, 0]), [logPi, 0]);
  const piPart = cExp(sPowerNegative);
  const sDiv2 = cMul(s, [0.5, 0]);
  const gammaVal = gammaLanczos(sDiv2);
  return cMul(sPow, cMul(piPart, cMul(gammaVal, zeta)));
}

// ── Compute Θ_a(z) = E_a^#(z) / E_a(z) ───────────────────────────────────────
function thetaA(z, a) {
  const aComplex = [a, 0];
  const zNegI = cMul(z, [0, -1]);
  // E_a(z) = X(a - iz)
  const eaArg = cAdd(aComplex, zNegI);
  const ea = xiFunction(eaArg);
  // E_a^#(z) = X(-a - iz)
  const eaSharpArg = cAdd(cMul(aComplex, [-1, 0]), zNegI);
  const eaSharp = xiFunction(eaSharpArg);
  // Θ_a(z) = E_a^#(z) / E_a(z)
  return cDiv(eaSharp, ea);
}

// ── Sample Θ_a(it) on a grid for animation ─────────────────────────────────────
function sampleTheta(aValue, tMax = 100, nSamples = 200) {
  const samples = [];
  const dt = tMax / (nSamples - 1);
  for (let i = 0; i < nSamples; i++) {
    const t = i * dt;
    const z = [0, t];
    try {
      const theta = thetaA(z, aValue);
      const abs = cAbs(theta);
      samples.push({
        t,
        x: theta[0],
        y: theta[1],
        abs,
        inSchur: abs < 1,
      });
    } catch (e) {
      // Skip samples with numerical issues
    }
  }
  return samples;
}

// ── Page component ──────────────────────────────────────────────────────────
export default function CayleySchurTrajectoryPage() {
  const canvasRef = useRef(null);

  // UI state
  const [aValue, setAValue] = useState(0.05);
  const [animating, setAnimating] = useState(true);
  const [frame, setFrame] = useState(0);

  // Sampling state
  const [samples, setSamples] = useState(null);
  const [sampleStatus, setSampleStatus] = useState('idle'); // idle|computing|done|error

  // Precomputed samples for three a values
  const allSamples = useMemo(() => {
    const result = {};
    const aValues = [0.001, 0.05, 0.5];
    for (const a of aValues) {
      try {
        result[a] = sampleTheta(a, 100, 150);
      } catch (e) {
        result[a] = [];
      }
    }
    return result;
  }, []);

  useEffect(() => {
    setSamples(allSamples[aValue] || []);
    setSampleStatus('done');
  }, [aValue, allSamples]);

  // Animation loop
  useEffect(() => {
    if (!animating || !samples || samples.length === 0) return;
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % samples.length);
    }, 50);
    return () => clearInterval(interval);
  }, [animating, samples]);

  // Draw unit disk with trajectory
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !samples || samples.length === 0) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const center = w / 2;
    const scale = Math.min(w, h) / 2.5; // Leave margin

    // Clear canvas
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, w, h);

    // Draw unit circle (Schur class boundary)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, scale, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw real and imaginary axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, center);
    ctx.lineTo(w, center);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, h);
    ctx.stroke();

    // Draw trajectory up to current frame
    ctx.strokeStyle = '#1f77b4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const firstSample = samples[0];
    if (firstSample) {
      ctx.moveTo(center + firstSample.x * scale, center - firstSample.y * scale);
    }
    for (let i = 1; i <= frame && i < samples.length; i++) {
      const s = samples[i];
      ctx.lineTo(center + s.x * scale, center - s.y * scale);
    }
    ctx.stroke();

    // Draw current point
    if (frame < samples.length) {
      const s = samples[frame];
      const x = center + s.x * scale;
      const y = center - s.y * scale;
      ctx.fillStyle = s.inSchur ? '#2ca02c' : '#d62728';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw info text
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(`t = ${s.t.toFixed(2)}, |Θ| = ${s.abs.toFixed(4)}`, 10, 20);
    }
  }, [samples, frame]);

  const currentSample = frame < samples.length ? samples[frame] : null;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Cayley-Schur Transform: Unit Disk Trajectory</h1>

      <p>
        The Cayley transform of the canonical-system m-function yields a Schur
        function <InlineMath math="\Theta_a" /> in the unit disk. This is the
        de Branges-Krein bijection (Krein 1955, de Branges 1968 Thm 40, Romanov
        2010).
      </p>

      <BlockMath math={String.raw`
\Theta_a(z) = \frac{E_a^{\#}(z)}{E_a(z)}, \quad
E_a(z) := X(a - iz), \quad
E_a^{\#}(z) := X(-a - iz), \quad
X(w) := \xi\!\left(\tfrac{1}{2} + w\right)
      `} />

      <p>
        Plot shows <InlineMath math="\Theta_a(it)" /> for
        <InlineMath math="t \in [0, 100]" /> as <InlineMath math="a" /> varies.
        The trajectory must remain in <InlineMath math="|z| < 1" /> (Schur class)
        for Conj 27.2 to hold.
      </p>

      {/* Controls */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Parameter a:</strong>{' '}
          <select
            value={aValue}
            onChange={e => setAValue(parseFloat(e.target.value))}
          >
            <option value={0.001}>0.001</option>
            <option value={0.05}>0.05</option>
            <option value={0.5}>0.5</option>
          </select>
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="checkbox"
            checked={animating}
            onChange={e => setAnimating(e.target.checked)}
          />
          {' '}Animate
        </label>
        {currentSample && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            t = {currentSample.t.toFixed(2)},{' '}
            |Θ_a(it)| = {currentSample.abs.toFixed(4)}{' '}
            <span style={{ color: currentSample.inSchur ? '#2ca02c' : '#d62728' }}>
              {currentSample.inSchur ? '✓ in Schur class' : '✗ outside Schur class'}
            </span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div style={{ border: '1px solid #ccc', display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          style={{ display: 'block' }}
        />
      </div>

      {/* Status */}
      {sampleStatus === 'computing' && <p>Computing samples...</p>}
      {sampleStatus === 'error' && <p style={{ color: 'red' }}>Error computing samples</p>}

      {/* Mathematics Section */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h3>de Branges-Krein Theory</h3>
        <p>
          The canonical-system Weyl m-function (on the upper half-plane{' '}
          <InlineMath math="\mathbb{C}_+" />) is related to a Schur class
          function (on the unit disk) via the Cayley transform:
        </p>
        <BlockMath math={String.raw`
\Theta(z) = \frac{m(z) - i}{m(z) + i}
        `} />
        <p>
          This establishes a bijection between canonical (Hamiltonian) systems on
          the half-line and certain de Branges reproducing kernel Hilbert spaces.
        </p>

        <h4>References</h4>
        <ul>
          <li>Krein, M. G. (1955). On defect numbers of linear operators.</li>
          <li>de Branges, L. (1968). Hilbert spaces of entire functions. Thm 40.</li>
          <li>Romanov, R. (2010). Canonical systems and de Branges spaces.</li>
          <li>Winkler, H. (1995). The inverse spectral problem for canonical systems.</li>
        </ul>

        <p>
          <strong>Relevant to:</strong>{' '}
          <Link to="/collapse-chain">Collapse Chain (imp-1258)</Link>,{' '}
          <Link to="/hidden-square-program">Hidden-Square Program (§25–27)</Link>,{' '}
          <Link to="/paper-audit-dashboard">Paper Audit Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
