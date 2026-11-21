// Cayley–Schur diagnostic: floating-point samples of Theta_a(i*t).
// X(w)=xi(1/2+w), E_a(z)=X(a-iz), E_a#(z)=X(-a-iz).
// The argument domain is the upper half-plane, not the range unit disk.
// Here -i*(i*t)=t, so the xi arguments and exact trajectory are real.
// A finite plot neither establishes Schur-class membership nor refutes RH.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { sampleTheta, sampleLabel } from '../math/cayley-schur.mjs';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

// Editorial (warm) theme retained for the numerical diagnostic.
// Canvas colors are literal warm hex (canvas fill/stroke can't use CSS vars):
// paper2 #f6f1e7, ink #1c1814, hairline #d5c9b2, blue #3f6b86,
// green #4c7a4a, terra-dk #c23a1c.

// ── Page component ──────────────────────────────────────────────────────────
export default function CayleySchurTrajectoryPage() {
  const canvasRef = useRef(null);

  // UI state
  const [aValue, setAValue] = useState(0.05);
  const [animating, setAnimating] = useState(true);
  const [frame, setFrame] = useState(0);

  // Keep failed samples in the grid: their position and reason stay visible.
  const allSamples = useMemo(() => Object.fromEntries(
    [0.001, 0.05, 0.5].map(a => [a, sampleTheta(a, 100, 150)])
  ), []);
  const run = allSamples[aValue];
  const samples = run.samples;

  // Animation loop
  useEffect(() => {
    if (!animating || run.validCount === 0 || samples.length < 2) return;
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % samples.length);
    }, 50);
    return () => clearInterval(interval);
  }, [animating, samples, run.validCount]);

  // Draw unit disk with trajectory
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const center = w / 2;
    const scale = Math.min(w, h) / 2.5; // Leave margin

    // Clear canvas
    ctx.fillStyle = ED.paper2;
    ctx.fillRect(0, 0, w, h);

    // Draw the unit-modulus reference circle (not a class-membership test).
    ctx.strokeStyle = ED.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, scale, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw real and imaginary axes
    ctx.strokeStyle = ED.rule;
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
    ctx.strokeStyle = ED.series1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let connected = false;
    for (let i = 0; i <= frame && i < samples.length; i++) {
      const s = samples[i];
      const x = center + s.x * scale;
      const y = center - s.y * scale;
      if (s.status !== 'approximate' || !Number.isFinite(x) || !Number.isFinite(y)) {
        connected = false;
        continue;
      }
      if (connected) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
      connected = true;
    }
    ctx.stroke();

    const s = samples[frame];
    if (s) {
      if (s.status === 'approximate') {
        const x = center + s.x * scale;
        const y = center - s.y * scale;
        ctx.fillStyle = s.modulusClass === 'below-one' ? ED.series3
          : s.modulusClass === 'above-one' ? ED.series2 : ED.series1;
        if (Number.isFinite(x) && Number.isFinite(y)) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      ctx.fillStyle = ED.ink;
      ctx.font = '12px sans-serif';
      ctx.fillText(s.status === 'approximate'
        ? `t = ${s.t.toFixed(2)}, sampled |Θ| = ${s.abs.toFixed(4)}`
        : `t = ${s.t.toFixed(2)}: ${s.reason}`, 10, 20);
    }
  }, [samples, frame]);

  const currentSample = samples[frame];

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>Cayley&#8211;Schur Transform: Sampled Modulus Diagnostic</h1>

        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
          A Herglotz Weyl m-function has a disk-valued Cayley transform. Below we
          sample a proposed xi quotient, not a constructed canonical-system
          m-function. Its identification with such a system remains conditional;
          this floating-point plot is neither a Schur-class certificate nor an RH test.
        </p>

        <BlockMath math={String.raw`
\Theta_a(z) = \frac{E_a^{\#}(z)}{E_a(z)}, \quad
E_a(z) := X(a - iz), \quad
E_a^{\#}(z) := X(-a - iz), \quad
X(w) := \xi\!\left(\tfrac{1}{2} + w\right)
        `} />

        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
          Plot shows <InlineMath math="\Theta_a(it)" /> for{' '}
          <InlineMath math="t \in [0, 100]" /> as <InlineMath math="a" /> varies.
          Since <InlineMath math="-i(it)=t" />, the xi arguments are real:
          <InlineMath math="\tfrac12-a+t" /> and <InlineMath math="\tfrac12+a+t" />.
          This is not a sweep of imaginary zeta height; the exact trajectory lies
          on the real axis. The point at <InlineMath math="t=0" /> is a boundary
          value, with <InlineMath math="\Theta_a(0)=1" /> when the quotient is defined.
        </p>

        {/* Controls */}
        <div
          className="card"
          style={{
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            borderLeft: '3px solid var(--brass)',
            borderRadius: 8,
            padding: '14px 18px',
            marginBottom: 20,
          }}
        >
          <label style={{ color: 'var(--ink)', fontSize: 13 }}>
            <strong>Parameter a:</strong>{' '}
            <select
              value={aValue}
              onChange={e => { setAValue(parseFloat(e.target.value)); setFrame(0); }}
              style={{
                background: 'var(--paper)',
                color: 'var(--ink)',
                border: '1px solid var(--hairline)',
                borderRadius: 4,
                padding: '2px 6px',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
              }}
            >
              <option value={0.001}>0.001</option>
              <option value={0.05}>0.05</option>
              <option value={0.5}>0.5</option>
            </select>
          </label>
          <label style={{ marginLeft: '20px', color: 'var(--ink)', fontSize: 13 }}>
            <input
              type="checkbox"
              checked={animating}
              onChange={e => setAnimating(e.target.checked)}
            />
            {' '}Animate
          </label>
          {currentSample && (
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-soft)' }}>
              t = {currentSample.t.toFixed(2)},{' '}
              {currentSample.status === 'approximate' && <>|&#920;_a(it)| ≈ {currentSample.abs.toFixed(6)}{' '}</>}
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                {sampleLabel(currentSample)}
              </span>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div style={{
          border: '1px solid var(--hairline)',
          borderRadius: 8,
          display: 'inline-block',
          overflow: 'hidden',
        }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            style={{ display: 'block' }}
            aria-label="Approximate real-axis xi quotient trajectory with a unit-modulus reference circle"
          >
            The sampled modulus and numerical status are reported above and below this plot.
          </canvas>
        </div>

        {/* Approximation status is separate from the sampled modulus comparison. */}
        <div role="status" style={{ color: 'var(--ink-soft)', fontSize: 13, maxWidth: 760 }}>
          <p>
            {run.status === 'empty' ? 'No samples requested; no numerical evidence.'
              : run.status === 'invalid-input' ? run.message
              : run.status === 'all-invalid' ? 'All requested evaluations are unavailable; no numerical evidence.'
              : `${run.validCount} of ${samples.length} finite approximate samples; ${run.invalidCount} unavailable.`}
            {' '}Numerical status: {run.status}. Invalid inputs: {run.invalidInputCount}.
          </p>
          <p>
            Evaluator: 50-term accelerated eta sum and Lanczos Gamma, restricted here
            to real xi arguments in [0, 101]. Xi(0) = xi(1) = 1/2 is used exactly;
            other arguments within 10⁻⁶ of the pole after reflection are marked
            ill-conditioned, not silently replaced by zero. Failed samples leave
            gaps in the trace. There is no certified error enclosure or uniform
            digit guarantee. “Modulus ≈ 1” uses a display tolerance of 10⁻¹⁰;
            neither a value below nor above 1 proves a global mathematical claim.
          </p>
        </div>

        {/* Mathematics Section */}
        <div
          className="card"
          style={{
            marginTop: 32,
            background: 'var(--paper2)',
            border: '1px solid var(--hairline)',
            borderLeft: '3px solid var(--blue)',
            borderRadius: 8,
            padding: '18px 20px',
          }}
        >
          <h3 style={{ color: 'var(--ink)', marginTop: 0 }}>de Branges-Krein Theory</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55 }}>
            The canonical-system Weyl m-function (on the upper half-plane{' '}
            <InlineMath math="\mathbb{C}_+" />) is related to a Schur class
            function taking values in the unit disk via the Cayley transform:
          </p>
          <BlockMath math={String.raw`
\Theta(z) = \frac{m(z) - i}{m(z) + i}
          `} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55 }}>
            This changes the range, not the argument domain: z remains in the upper
            half-plane. For Im(m(z)) &gt; 0, the identity
            <InlineMath math="1-|\Theta(z)|^2=4\,\operatorname{Im}m(z)/|m(z)+i|^2" />
            gives |Θ(z)| &lt; 1. A disk-domain version would require a separate
            conformal change of variable. Canonical-system/de Branges
            correspondences have additional hypotheses; this plot does not
            construct the arithmetic Hamiltonian or establish those hypotheses.
          </p>

          <h4 style={{ color: 'var(--ink)' }}>References</h4>
          <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            <li>Krein, M. G. (1955). On defect numbers of linear operators.</li>
            <li>de Branges, L. (1968). Hilbert spaces of entire functions. Thm 40.</li>
            <li>Romanov, R. (2010). Canonical systems and de Branges spaces.</li>
            <li>Winkler, H. (1995). The inverse spectral problem for canonical systems.</li>
          </ul>

          <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
            <strong style={{ color: 'var(--ink)' }}>Relevant to:</strong>{' '}
            <Link to="/collapse-chain" style={{ color: 'var(--brass-dk)' }}>Collapse Chain (imp-1258)</Link>,{' '}
            <Link to="/hidden-square-program" style={{ color: 'var(--brass-dk)' }}>Hidden-Square Program (§25&#8211;27)</Link>,{' '}
            <Link to="/paper-audit-dashboard" style={{ color: 'var(--brass-dk)' }}>Paper Audit Dashboard</Link>
          </p>
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
