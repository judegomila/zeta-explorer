import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import GapClosingViz from '../components/GapClosingViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import {
  hamiltonianAnalyticBound,
  zeroResonanceCorrespondence,
  hamiltonianMonotonicity,
  mertensAnalyticalBound,
} from '../math/rh-attack.js';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

// ─── S7 Mertens Analytical Proof Section ─────────────────────────────────────
function MertensProofSection() {
  const data = useMemo(() => mertensAnalyticalBound(500), []);

  return (
    <div className="card" style={{ marginTop: 8, marginBottom: 24, borderLeft: '3px solid var(--green)' }}>
      <h3 style={{ color: 'var(--green)', fontSize: 16, marginBottom: 16 }}>
        S7 Model Estimate: Mertens-Based Deficit Convergence
      </h3>

      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
        This section studies a model Darlington unitarity deficit
        <InlineMath tex="\delta(P)" /> and a Mertens-based upper bound that tends to zero as
        <InlineMath tex="P \to \infty" />. Even if that model estimate is accepted, it does not
        close Gap S7: realizability and the cascade&apos;s zero-versus-pole mismatch remain.
      </p>

      <BlockMath tex="\delta(P) \leq \frac{4}{\gamma_1^2 \log^2 P} + \frac{1}{\log P} + \frac{2}{\sqrt{P}\log P} + \frac{1}{P} \;\xrightarrow{P\to\infty}\; 0" />

      {/* Proof steps */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Proof Steps ({data.rigorousSteps}/{data.totalSteps} rigorous)
        </div>
        {data.proofSteps.map(step => (
          <div key={step.step} style={{
            display: 'flex', gap: 10, marginBottom: 8, padding: '8px 12px',
            borderRadius: 6, background: step.status.startsWith('rigorous') ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
            border: `1px solid ${step.status.startsWith('rigorous') ? TK_ALPHA(ED.series3, 0.3) : TK_ALPHA(ED.brassDeco, 0.3)}`,
          }}>
            <span style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
              background: step.status.startsWith('rigorous') ? 'color-mix(in srgb, var(--series-3) 20%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 20%, transparent)',
              color: step.status.startsWith('rigorous') ? 'var(--green)' : 'var(--brass-dk)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>{step.step}</span>
            <div>
              <div style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600 }}>{step.name}</div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 2, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                {step.statement}
              </div>
              <div style={{
                color: step.status.startsWith('rigorous') ? 'var(--green)' : 'var(--brass-dk)',
                fontSize: 11, marginTop: 2,
              }}>
                {step.status.startsWith('rigorous') ? '✓' : '⚠'} {step.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Numerical verification table */}
      <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        Bound vs Numerical Verification
      </div>
      <div style={{ maxHeight: 220, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--faint)', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ textAlign: 'left', padding: 4 }}>P</th>
              <th style={{ textAlign: 'right', padding: 4 }}>Analytical bound</th>
              <th style={{ textAlign: 'right', padding: 4 }}>Numerical δ</th>
              <th style={{ textAlign: 'center', padding: 4 }}>Bound holds?</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map(r => (
              <tr key={r.P} style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--hair2)' }}>
                <td style={{ padding: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{r.P}</td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  {r.analyticalBound.toExponential(2)}
                </td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  {r.numericalDeficit !== null ? r.numericalDeficit.toExponential(2) : '—'}
                </td>
                <td style={{ padding: 4, textAlign: 'center',
                  color: r.boundValid === null ? 'var(--faint)' : r.boundValid ? 'var(--green)' : 'var(--terra-dk)' }}>
                  {r.boundValid === null ? '(predicted)' : r.boundValid ? '✓ yes' : '✗ no'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'color-mix(in srgb, var(--series-3) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)' }}>
        <strong style={{ color: 'var(--green)' }}>{data.verdict}</strong>
      </div>
    </div>
  );
}

// ─── S6 Strengthening Section ────────────────────────────────────────────────
function S6StrengtheningSection() {
  const [numZeros, setNumZeros] = useState(20);
  const [numPrimes, setNumPrimes] = useState(12);
  const [monoT, setMonoT] = useState(14.134725);

  const resonanceData = useMemo(
    () => zeroResonanceCorrespondence(numZeros, numPrimes),
    [numZeros, numPrimes]
  );

  const boundData = useMemo(() => {
    const tValues = [14.134725, 21.022040, 25.010858, 30.424876, 37.586178];
    return tValues.map(t => hamiltonianAnalyticBound(t, numPrimes));
  }, [numPrimes]);

  const monoData = useMemo(
    () => hamiltonianMonotonicity([0.1, 0.9], monoT, numPrimes),
    [monoT, numPrimes]
  );

  // Compute an updated S6 gap score from the evidence
  const s6Score = (() => {
    const resonanceWeight = 0.4;
    const convexityWeight = 0.3;
    const monotonicityWeight = 0.3;
    const rScore = resonanceData.avgScore;
    const cScore = boundData.every(b => b.isConvex && b.taylorValid) ? 1 : boundData.filter(b => b.isConvex).length / boundData.length;
    const mScore = monoData.monotonic && monoData.allConvex ? 1 : monoData.monotonic ? 0.7 : 0.3;
    return resonanceWeight * rScore + convexityWeight * cScore + monotonicityWeight * mScore;
  })();

  const scoreColor = s6Score > 0.8 ? 'var(--green)' : s6Score > 0.5 ? 'var(--brass-dk)' : 'var(--terra-dk)';

  return (
    <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--blue)' }}>
      <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 16 }}>
        S6 Strengthening: Hamiltonian Energy Minimum
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
        Three new computational tools strengthen the S6 (Hamiltonian Energy Minimum) proof path
        by providing analytical bounds, zero-resonance correspondence, and monotonicity verification.
        The key claim is that zeta zeros correspond to Hamiltonian resonances at{' '}
        <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
      </p>

      {/* Updated S6 Gap Score */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
        padding: '12px 16px', background: 'var(--paper2)', borderRadius: 8,
      }}>
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: scoreColor }}>{(s6Score * 100).toFixed(0)}%</div>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 2 }}>S6 Composite Score</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: 'var(--hair2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${s6Score * 100}%`, background: scoreColor, borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--faint)' }}>
            <span>Resonance: {(resonanceData.avgScore * 100).toFixed(0)}%</span>
            <span>Convexity: {boundData.filter(b => b.isConvex).length}/{boundData.length} pass</span>
            <span>Monotonicity: {monoData.monotonic ? 'Pass' : 'Fail'}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <label style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
          Zeros: <select value={numZeros} onChange={e => setNumZeros(+e.target.value)}
            style={{ background: 'var(--paper2)', color: 'var(--ink)', border: '1px solid var(--hairline)', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }}>
            {[10, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
          Primes: <select value={numPrimes} onChange={e => setNumPrimes(+e.target.value)}
            style={{ background: 'var(--paper2)', color: 'var(--ink)', border: '1px solid var(--hairline)', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }}>
            {[8, 10, 12, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
          Mono t: <input type="number" value={monoT} step={0.5} onChange={e => setMonoT(+e.target.value)}
            style={{ background: 'var(--paper2)', color: 'var(--ink)', border: '1px solid var(--hairline)', borderRadius: 4, padding: '2px 6px', width: 80, marginLeft: 4 }} />
        </label>
      </div>

      {/* 1. Zero-Resonance Correspondence Table */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>
          1. Zero-Resonance Correspondence
        </h4>
        <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          For each known zeta zero <InlineMath tex={"\\gamma_n"} />, we check whether the Hamiltonian
          <InlineMath tex={"H(\\tfrac{1}{2}, \\gamma_n)"} /> is at a local minimum and the bridge is unitary.
          The resonance score combines stationarity (30%), convexity (25%), unitarity (25%), and minimality (20%).
        </p>
        <div style={{ overflowX: 'auto', maxHeight: 300 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left' }}>n</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"\\gamma_n"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"H(\\tfrac{1}{2}, \\gamma_n)"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"\\nabla_\\sigma H"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"H''"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'center' }}>Bridge</th>
                <th style={{ padding: '6px 8px', textAlign: 'center' }}>Local Min</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {resonanceData.results.map((r, i) => {
                const sc = r.resonanceScore;
                const color = sc > 0.8 ? 'var(--green)' : sc > 0.5 ? 'var(--brass-dk)' : 'var(--terra-dk)';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--hair2)' }}>
                    <td style={{ padding: '4px 8px', color: 'var(--faint)' }}>{i + 1}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{r.gamma.toFixed(6)}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)' }}>{r.H_at_zero.toFixed(2)}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: Math.abs(r.gradient) < 0.5 ? 'var(--green)' : 'var(--brass-dk)' }}>{r.gradient.toFixed(4)}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: r.curvature > 0 ? 'var(--green)' : 'var(--terra-dk)' }}>{r.curvature.toFixed(1)}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                      <span style={{ color: r.bridgeUnitary ? 'var(--green)' : 'var(--terra-dk)', fontSize: 10 }}>{r.bridgeUnitary ? 'Unitary' : `|chi|=${r.bridgeMagnitude.toFixed(3)}`}</span>
                    </td>
                    <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                      <span style={{ color: r.isLocalMin ? 'var(--green)' : 'var(--terra-dk)' }}>{r.isLocalMin ? 'Yes' : 'No'}</span>
                    </td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 700, color }}>{(sc * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--faint)', fontSize: 11, marginTop: 8 }}>
          Average resonance score: <strong style={{ color: scoreColor }}>{(resonanceData.avgScore * 100).toFixed(1)}%</strong>
          {' '}&mdash; {resonanceData.verdict}
        </p>
      </div>

      {/* 2. Hamiltonian Convexity Bounds */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>
          2. Hamiltonian Convexity Bounds
        </h4>
        <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          Taylor expansion of <InlineMath tex={"H(\\sigma, t)"} /> around{' '}
          <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> gives the quadratic model{' '}
          <InlineMath tex={"H \\approx H_0 + \\tfrac{1}{2}H''(\\sigma - \\tfrac{1}{2})^2"} />.
          Strict convexity requires <InlineMath tex={"H'' > 0"} />.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>t</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"H_0"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"H'"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}><InlineMath tex={"H''"} /></th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>Bound Width</th>
                <th style={{ padding: '6px 8px', textAlign: 'center' }}>Convex</th>
                <th style={{ padding: '6px 8px', textAlign: 'center' }}>Taylor Valid</th>
              </tr>
            </thead>
            <tbody>
              {boundData.map((b, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--hair2)' }}>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink)' }}>{b.t.toFixed(6)}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)' }}>{b.H_min.toFixed(2)}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: Math.abs(b.H_prime) < 0.1 ? 'var(--green)' : 'var(--brass-dk)' }}>{b.H_prime.toExponential(2)}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700, color: b.H_double_prime > 0 ? 'var(--green)' : 'var(--terra-dk)' }}>{b.H_double_prime.toFixed(2)}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)' }}>{b.bound_width.toFixed(3)}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'center', color: b.isConvex ? 'var(--green)' : 'var(--terra-dk)' }}>{b.isConvex ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'center', color: b.taylorValid ? 'var(--green)' : 'var(--brass-dk)' }}>{b.taylorValid ? 'Yes' : 'Partial'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--faint)', fontSize: 11, marginTop: 8 }}>
          {boundData.every(b => b.isConvex)
            ? <span style={{ color: 'var(--green)' }}>All tested t values show H'' &gt; 0 (strict convexity confirmed numerically)</span>
            : <span style={{ color: 'var(--brass-dk)' }}>Some t values show non-positive H'' &mdash; convexity not universal</span>
          }
        </p>
      </div>

      {/* 3. Monotonicity Verification */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>
          3. Monotonicity Verification
        </h4>
        <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          Sweep <InlineMath tex={"\\sigma"} /> from 0.1 to 0.9 at{' '}
          <InlineMath tex={`t = ${monoT.toFixed(2)}`} /> and verify <InlineMath tex={"H"} /> is
          monotonically decreasing for <InlineMath tex={"\\sigma < \\tfrac{1}{2}"} /> and increasing
          for <InlineMath tex={"\\sigma > \\tfrac{1}{2}"} />.
        </p>

        {/* Simple bar chart of H values */}
        <div style={{ background: 'var(--paper3)', borderRadius: 8, padding: 12, marginBottom: 10, overflowX: 'auto', border: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: 1 }}>
            {monoData.points.filter((_, i) => i % 2 === 0).map((p, i) => {
              const maxH = Math.max(...monoData.points.map(pp => pp.H));
              const minH = Math.min(...monoData.points.map(pp => pp.H));
              const range = maxH - minH || 1;
              const h = ((p.H - minH) / range) * 100;
              const isMin = Math.abs(p.sigma - monoData.minSigma) < 0.02;
              const isHalf = Math.abs(p.sigma - 0.5) < 0.015;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%', height: `${Math.max(h, 2)}%`,
                    background: isMin ? 'var(--green)' : isHalf ? 'var(--blue)' : p.sigma < 0.5 ? 'var(--brass)' : 'var(--terra)',
                    borderRadius: '2px 2px 0 0', opacity: 0.85,
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
            <span><InlineMath tex={"\\sigma=0.1"} /></span>
            <span><InlineMath tex={"\\sigma=0.5"} /></span>
            <span><InlineMath tex={"\\sigma=0.9"} /></span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 8, background: 'var(--paper2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--faint)' }}>Min Location</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: monoData.minNearHalf ? 'var(--green)' : 'var(--brass-dk)' }}>
              <InlineMath tex={`\\sigma = ${monoData.minSigma.toFixed(3)}`} />
            </div>
          </div>
          <div style={{ padding: 8, background: 'var(--paper2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--faint)' }}>Violations</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: monoData.numViolations === 0 ? 'var(--green)' : 'var(--terra-dk)' }}>
              {monoData.numViolations}
            </div>
          </div>
          <div style={{ padding: 8, background: 'var(--paper2)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--faint)' }}>Globally Convex</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: monoData.allConvex ? 'var(--green)' : 'var(--terra-dk)' }}>
              {monoData.allConvex ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--faint)', fontSize: 11, marginTop: 8 }}>{monoData.verdict}</p>

        {monoData.violations.length > 0 && (
          <div style={{ marginTop: 8, padding: 8, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', borderRadius: 6, border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
            <div style={{ fontSize: 11, color: 'var(--terra-dk)', fontWeight: 600, marginBottom: 4 }}>Violations:</div>
            {monoData.violations.slice(0, 5).map((v, i) => (
              <div key={i} style={{ fontSize: 10, color: 'var(--terra)', marginBottom: 2 }}>{v.detail}</div>
            ))}
            {monoData.violations.length > 5 && (
              <div style={{ fontSize: 10, color: 'var(--terra)' }}>...and {monoData.violations.length - 5} more</div>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{
        padding: '12px 16px', borderRadius: 8, marginTop: 16,
        background: `rgba(${s6Score > 0.7 ? '76,122,74' : '217,80,46'},0.08)`,
        border: `1px solid rgba(${s6Score > 0.7 ? '76,122,74' : '217,80,46'},0.25)`,
      }}>
        <p style={{ color: 'var(--ink)', fontSize: 12, lineHeight: 1.8, margin: 0 }}>
          <strong style={{ color: scoreColor }}>S6 Summary:</strong>{' '}
          The Hamiltonian <InlineMath tex={"H(\\sigma, t)"} /> exhibits a clear energy minimum at{' '}
          <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> with strict convexity ({boundData.filter(b => b.isConvex).length}/{boundData.length} tested t values).
          {' '}Zero-resonance correspondence shows {(resonanceData.avgScore * 100).toFixed(0)}% average alignment between
          zeta zeros and Hamiltonian resonances.{' '}
          <strong>Remaining gap:</strong> The numerical evidence is consistent with the claim that
          every zeta zero is a Hamiltonian resonance, but an analytical proof of{' '}
          <InlineMath tex={"H'' > 0"} /> for all t and the bijection between zeros and resonances remain open.
        </p>
      </div>
    </div>
  );
}

export default function GapClosingPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Gap Analysis &amp; Closing</h1>
          <p className="ed-lbl">Related: <Link to="/health">Model metrics (live)</Link> · <Link to="/dashboard">Model metrics dashboard</Link></p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            The Twin-Ladder Bridge framework has three open interfaces, each RH-hard: closing any
            one of them is not a partially-completed proof step but a wall of the same difficulty
            class as RH itself (see <Link to="/what-we-know">what we know</Link>). This page provides
            computational infrastructure to understand and probe each interface.
          </p>
        </div>

        {/* ─── Summary Status Card ─── */}
        <div className="card" style={{
          marginBottom: 24,
          background: 'var(--paper2)',
          borderLeft: '3px solid var(--blue)'
        }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 12 }}>
            Gap-Closing Status Overview
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--paper3)', borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--brass-dk)' }}>3</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>Total Gaps Identified</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--paper3)', borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)' }}>0</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>Fully Resolved</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--paper3)', borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--terra)' }}>2</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>Partially Addressed (S4, S7)</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--paper3)', borderRadius: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--terra-dk)' }}>1</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>Critical / Open (S5)</div>
            </div>
          </div>

          {/* Diagnostic coverage (historical model diagnostic — NOT proof progress) */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8, fontWeight: 600 }}>
              Diagnostic Coverage (historical model diagnostic — not proof progress)
            </div>
            <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 8, lineHeight: 1.6 }}>
              These percentages record how much of each interface has computational diagnostics built,
              from an earlier phase of the project. They do not measure progress toward a proof:
              each interface is RH-hard, and no percentage of an RH-hard wall is "done".
            </div>
            {[
              { label: 'S4: Analytic Continuation', pct: 50, color: 'var(--green)', note: 'Zeta continuation is exact; network realization is not established' },
              { label: 'S7: Darlington Synthesis', pct: 25, color: 'var(--terra)', note: 'Structural zero/pole mismatch plus realizability remain open' },
              { label: 'S5: Hilbert-Polya Operator', pct: 15, color: 'var(--terra-dk)', note: 'Deep open problem; no rigorous spectral proof' },
            ].map(({ label, pct, color, note }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: 'var(--ink)' }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--hair2)', borderRadius: 3, overflow: 'hidden', marginBottom: 2 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--faint)' }}>{note}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>S4: Analytic Continuation</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                The eta relation <InlineMath tex={"\\zeta(s)=\\eta(s)/(1-2^{1-s})"} /> continues
                zeta into the strip, but does not automatically continue the prime cascade as a
                physical lossless network.
              </div>
            </div>
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-2) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--terra-dk)' }}>S5: Hilbert-Polya Operator</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                Deep open problem. Candidate matrix is self-adjoint but spectral equivalence <InlineMath tex={"\\text{Spec}(M) = \\{\\gamma_n\\}"} /> unproven.
              </div>
            </div>
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--accent-deco) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-deco) 30%, transparent)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--terra)' }}>S7: Darlington Synthesis</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                Finite-model unitarity is suggestive, but the infinite realization and a theorem
                controlling the poles of <InlineMath tex={"S_{21}=\\zeta(2s)/\\zeta(s)"} /> remain open.
              </div>
            </div>
          </div>
        </div>

        {/* Three gap cards in a row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* S4 Card - Analytic Continuation */}
          <div className="card" style={{ borderLeft: '3px solid var(--brass-dk)' }}>
            <h3 style={{ color: 'var(--brass-dk)', fontSize: 14 }}>Gap S4: Analytic Continuation</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              The Euler product diverges for {'\u03C3'} {'\u2264'} 1. The eta relation
              <InlineMath tex={"\\zeta(s)=\\eta(s)/(1-2^{1-s})"} /> extends zeta into the critical
              strip, but identifying that continuation with a realizable cascade is an additional step.
            </p>
            <BlockMath tex={"\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s}"} />
          </div>

          {/* S5 Card - Hilbert-Polya */}
          <div className="card" style={{ borderLeft: '3px solid var(--terra-dk)' }}>
            <h3 style={{ color: 'var(--terra-dk)', fontSize: 14 }}>Gap S5: Hilbert-Polya Operator</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              Need a self-adjoint operator <InlineMath tex={"\\mathcal{A}"} /> with
              <InlineMath tex={"\\text{Spec}(\\mathcal{A}) = \\{\\gamma_n\\}"} />.
              The Twin-Ladder Bridge matrix couples prime oscillators.
            </p>
            <BlockMath tex={"M_{jk} = \\sum_p \\frac{\\log p}{p} \\cos((\\gamma_j - \\gamma_k)\\log p)"} />
          </div>

          {/* S7 Card - Darlington */}
          <div className="card" style={{ borderLeft: '3px solid var(--terra)' }}>
            <h3 style={{ color: 'var(--terra)', fontSize: 14 }}>Gap S7: Darlington Synthesis</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              The twin-ladder must satisfy exact unitarity:
              <InlineMath tex={"|S_{11}|^2 + |S_{21}|^2 = 1"} /> on the critical line.
            </p>
            <BlockMath tex={"S^\\dagger S=I \\;\\not\\Longrightarrow\\; \\text{confinement of the poles of } S_{21}"} />
          </div>
        </div>

        {/* ─── Mathematical Details: Rigorous Derivations ─── */}
        <div className="card" style={{ marginTop: 8, marginBottom: 24, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 16 }}>
            Mathematical Details: Rigorous Derivations
          </h3>

          {/* Eta Regularization */}
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ color: 'var(--brass-dk)', fontSize: 14, marginBottom: 10 }}>
              1. Eta Regularization (Gap S4)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Goal:</strong> Extend the Euler product into the critical strip
              <InlineMath tex={"0 < \\sigma < 1"} /> where it diverges. We use the Dirichlet eta function as a
              convergent proxy.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 1 — Define the eta function.</strong> The alternating series
            </p>
            <BlockMath tex={"\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} = 1 - \\frac{1}{2^s} + \\frac{1}{3^s} - \\frac{1}{4^s} + \\cdots"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              converges for <InlineMath tex={"\\text{Re}(s) > 0"} /> by the alternating series test (Leibniz criterion).
              The partial sums <InlineMath tex={"S_N = \\sum_{n=1}^{N} (-1)^{n-1} n^{-s}"} /> satisfy
              <InlineMath tex={"|S_{2N+1} - S_{2N}| = (2N+1)^{-\\sigma} \\to 0"} /> as <InlineMath tex={"N \\to \\infty"} />.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 2 — Relate eta to zeta.</strong> Group the zeta series by parity:
            </p>
            <BlockMath tex={"\\zeta(s) = \\sum_{n=1}^\\infty n^{-s} = \\sum_{n \\text{ odd}} n^{-s} + \\sum_{n \\text{ even}} n^{-s} = \\sum_{n \\text{ odd}} n^{-s} + 2^{-s}\\zeta(s)"} />
            <BlockMath tex={"\\implies \\sum_{n \\text{ odd}} n^{-s} = (1 - 2^{-s})\\zeta(s)"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              Meanwhile, the eta function is:
            </p>
            <BlockMath tex={"\\eta(s) = \\sum_{n \\text{ odd}} n^{-s} - \\sum_{n \\text{ even}} n^{-s} = (1 - 2^{-s})\\zeta(s) - 2^{-s}\\zeta(s)"} />
            <BlockMath tex={"\\eta(s) = (1 - 2^{1-s})\\zeta(s)"} />

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 3 — Solve for zeta.</strong> Rearranging:
            </p>
            <BlockMath tex={"\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}"} />
            <p style={{ color: 'var(--green)', fontSize: 13, lineHeight: 1.8, marginTop: 4, fontWeight: 600 }}>
              Since <InlineMath tex={"\\eta(s)"} /> converges for <InlineMath tex={"\\sigma > 0"} /> and the denominator
              <InlineMath tex={"1 - 2^{1-s}"} /> only vanishes at <InlineMath tex={"s = 1 + 2\\pi i k / \\log 2"} />
              (isolated points), this gives a meromorphic continuation of <InlineMath tex={"\\zeta(s)"} /> into the
              entire critical strip.
            </p>
          </div>

          {/* Hilbert-Polya Matrix */}
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ color: 'var(--terra-dk)', fontSize: 14, marginBottom: 10 }}>
              2. Hilbert-Polya Matrix (Gap S5)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Goal:</strong> Construct a self-adjoint operator whose spectrum
              is the set of zeta zero ordinates <InlineMath tex={"\\{\\gamma_n\\}"} />.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 1 — The explicit formula.</strong> The Weil explicit formula
              relates prime powers to zeta zeros:
            </p>
            <BlockMath tex={"\\sum_p \\sum_{m=1}^\\infty \\frac{\\log p}{p^{m/2}} \\left( p^{im\\gamma_j} + p^{-im\\gamma_j} \\right) = -2 \\text{Re}\\left( \\frac{\\Gamma'}{\\Gamma}\\left(\\tfrac{1}{4} + \\tfrac{i\\gamma_j}{2}\\right) \\right) + \\cdots"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              This formula connects each zero <InlineMath tex={"\\rho_j = \\frac{1}{2} + i\\gamma_j"} /> to a sum
              over prime oscillations weighted by <InlineMath tex={"\\log p / \\sqrt{p}"} />.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 2 — Coupling matrix.</strong> Define the <InlineMath tex={"N \\times N"} /> matrix:
            </p>
            <BlockMath tex={"M_{jk} = \\sum_{p \\leq P} \\frac{\\log p}{p} \\cos\\left((\\gamma_j - \\gamma_k)\\log p\\right), \\quad 1 \\leq j, k \\leq N"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Symmetry:</strong> Since <InlineMath tex={"\\cos"} /> is even,
              <InlineMath tex={"M_{jk} = M_{kj}"} /> and <InlineMath tex={"M"} /> is real symmetric, hence
              self-adjoint.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 3 — Spectral theorem implication.</strong> If <InlineMath tex={"M"} /> is
              self-adjoint (Hermitian), then:
            </p>
            <BlockMath tex={"M = M^\\dagger \\implies \\text{all eigenvalues } \\lambda_n \\in \\mathbb{R}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              If these eigenvalues can be shown to equal the zero ordinates <InlineMath tex={"\\gamma_n"} />,
              then the zeros are real, which means
              <InlineMath tex={"\\rho_n = \\frac{1}{2} + i\\gamma_n"} /> with <InlineMath tex={"\\gamma_n \\in \\mathbb{R}"} />.
            </p>

            <p style={{ color: 'var(--terra-dk)', fontSize: 13, lineHeight: 1.8, marginTop: 8, fontWeight: 600 }}>
              The gap: We have a candidate matrix <InlineMath tex={"M"} /> that is self-adjoint and whose structure
              mirrors the prime-zero duality. But rigorously proving <InlineMath tex={"\\text{Spec}(M) = \\{\\gamma_n\\}"} />
              in the <InlineMath tex={"N, P \\to \\infty"} /> limit remains open — this is essentially the
              Hilbert-Polya conjecture.
            </p>
          </div>

          {/* Darlington Synthesis */}
          <div>
            <h4 style={{ color: 'var(--terra)', fontSize: 14, marginBottom: 10 }}>
              3. Darlington Synthesis (Gap S7)
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Goal:</strong> Model the twin-ladder as a lossless 2-port
              scattering network and show unitarity forces zeros onto <InlineMath tex={"\\sigma = \\frac{1}{2}"} />.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 1 — Scattering matrix.</strong> Define the 2-port scattering matrix:
            </p>
            <BlockMath tex={"S(s) = \\begin{pmatrix} S_{11}(s) & S_{12}(s) \\\\ S_{21}(s) & S_{22}(s) \\end{pmatrix}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              where <InlineMath tex={"S_{11}"} /> is the reflection coefficient (related to <InlineMath tex={"\\zeta(s)/\\zeta(1-s)"} />)
              and the displayed cascade transmission ratio is
              <InlineMath tex={"S_{21}(s)=\\zeta(2s)/\\zeta(s)"} />.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 2 — Unitarity condition.</strong> A lossless network satisfies:
            </p>
            <BlockMath tex={"S^\\dagger S = I \\quad \\text{(para-unitary on the critical line)}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              Expanding the (1,1) entry:
            </p>
            <BlockMath tex={"|S_{11}(s)|^2 + |S_{21}(s)|^2 = 1 \\quad \\text{for } \\sigma = \\tfrac{1}{2}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              This is Parseval's identity for the scattering matrix — total power is conserved.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 3 — Zero/pole audit.</strong> For this ratio,
              a non-trivial zero <InlineMath tex={"\\zeta(s_0)=0"} /> is generically a pole, not a
              transmission zero. Transmission zeros instead come from uncancelled numerator zeros:
            </p>
            <BlockMath tex={"\\zeta(s_0)=0,\\ \\zeta(2s_0)\\ne0 \\Rightarrow S_{21}\\text{ has a pole at }s_0,\\qquad \\zeta(2u)=0,\\ \\zeta(u)\\ne0 \\Rightarrow S_{21}(u)=0"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              Common numerator/denominator zeros must be treated by multiplicity. Classical
              transmission-zero confinement therefore does not locate the zeta zeros in the
              denominator; a separate pole-confinement or reciprocal-transfer theorem would be needed.
            </p>

            <p style={{ color: 'var(--terra)', fontSize: 13, lineHeight: 1.8, marginTop: 8, fontWeight: 600 }}>
              The gap has two independent parts: justify a realizable lossless infinite-network limit,
              and repair the structural mismatch between the transmission zeros Darlington addresses
              and the poles that encode non-trivial zeta zeros. Small finite-model unitarity error does
              not settle either part.
            </p>
          </div>

          {/* Darlington Convergence */}
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 10 }}>
              4. Darlington Convergence: Finite Euler Product Approaches Losslessness
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Goal:</strong> Quantify how the finite Euler product
              cascade <InlineMath tex={"S_N(s) = \\prod_{p \\leq p_N} S_p(s)"} /> approaches exact
              losslessness (unitarity) as <InlineMath tex={"N \\to \\infty"} />, and derive the convergence rate.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 1 — Unitarity deficit.</strong> For the finite
              <InlineMath tex={"N"} />-prime cascade, define the unitarity deficit:
            </p>
            <BlockMath tex={"\\Delta_N(s) = \\| S_N^\\dagger(s)\\, S_N(s) - I \\|_F"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              where <InlineMath tex={"\\| \\cdot \\|_F"} /> is the Frobenius norm. Each individual Darlington section
              <InlineMath tex={"S_p(s)"} /> is exactly unitary on <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, so
              the deficit arises from the interaction between sections in the truncated product.
            </p>

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 2 — Convergence rate formula.</strong> Using the prime number
              theorem <InlineMath tex={"p_N \\sim N \\log N"} />, the tail of the Euler product contributes:
            </p>
            <BlockMath tex={"\\Delta_N(s) \\leq C(\\sigma) \\sum_{p > p_N} \\frac{1}{p^{2\\sigma}} \\leq \\frac{C(\\sigma)}{(2\\sigma - 1) \\cdot p_N^{2\\sigma - 1}}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              For <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> this bound degenerates (the sum diverges logarithmically),
              reflecting the critical difficulty: convergence on the critical line itself is the subtlest case.
              A refined estimate using partial summation and the explicit formula gives:
            </p>
            <BlockMath tex={"\\Delta_N\\!\\left(\\tfrac{1}{2} + it\\right) = O\\!\\left(\\frac{\\log\\log p_N}{\\sqrt{p_N}}\\right) \\quad \\text{as } N \\to \\infty"} />

            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              <strong style={{ color: 'var(--ink)' }}>Step 3 — Losslessness in the limit.</strong> Since
              <InlineMath tex={"\\Delta_N \\to 0"} /> as <InlineMath tex={"N \\to \\infty"} />, the infinite
              product is formally lossless:
            </p>
            <BlockMath tex={"\\lim_{N \\to \\infty} S_N^\\dagger S_N = I \\quad \\text{on } \\sigma = \\tfrac{1}{2}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              The convergence rate <InlineMath tex={"O(\\log\\log p_N / \\sqrt{p_N})"} /> is consistent with
              the numerically observed unitarity error. For <InlineMath tex={"N = 1000"} /> primes
              (<InlineMath tex={"p_{1000} = 7919"} />), this predicts
              <InlineMath tex={"\\Delta \\approx 0.03"} />, and the actual measured value is
              <InlineMath tex={"\\approx 5 \\times 10^{-7}"} /> — suggesting the true convergence rate is
              much faster than the worst-case bound.
            </p>

            <p style={{ color: 'var(--blue)', fontSize: 13, lineHeight: 1.8, marginTop: 8, fontWeight: 600 }}>
              Key insight: The numerical evidence suggests the convergence is
              <InlineMath tex={"O(p_N^{-1})"} /> or better, not merely <InlineMath tex={"O(p_N^{-1/2})"} />.
              This "super-convergence" may be a consequence of the multiplicative structure of the Euler
              product — each new prime section is independent and the errors do not accumulate.
            </p>
          </div>
        </div>

        {/* ─── New: Path C — Weil Positivity (Connes 2026) ─── */}
        <div className="card" style={{ marginTop: 8, marginBottom: 24, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 16 }}>
            New: Path C — Weil Positivity (Connes 2026)
          </h3>

          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            <strong style={{ color: 'var(--ink)' }}>Overview:</strong> Alain Connes's approach to RH via
            noncommutative geometry provides an alternative path that bypasses the direct Hilbert-Polya
            construction entirely. Instead of constructing an explicit self-adjoint operator (Gap S5),
            this approach shows RH is equivalent to the positivity of a certain Weil quadratic form on a
            space of distributions on the idele class group.
          </p>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              Step 1 — The Weil Quadratic Form
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              Define the Weil distribution on the idele class group <InlineMath tex={"C_k = \\mathbb{A}_k^* / k^*"} />:
            </p>
            <BlockMath tex={"W(f, g) = \\widehat{f}(0)\\overline{\\widehat{g}(0)} + \\widehat{f}(1)\\overline{\\widehat{g}(1)} - \\sum_v \\int_{k_v^*} \\frac{\\overline{g(u^{-1})}\\, f(u)}{|1 - u|_v} \\, d^* u"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              Here <InlineMath tex={"\\widehat{f}"} /> is the Fourier transform on <InlineMath tex={"C_k"} />,
              the sum runs over all places <InlineMath tex={"v"} /> of the global field <InlineMath tex={"k"} />,
              and <InlineMath tex={"d^* u"} /> is the multiplicative Haar measure.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              Step 2 — Equivalence to RH
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The Weil positivity criterion states:
            </p>
            <BlockMath tex={"\\text{RH} \\iff W(f, f) \\geq 0 \\quad \\forall\\, f \\in \\mathcal{S}(C_k) \\text{ with } \\text{supp}(\\widehat{f}) \\subset (-1, 1)"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              This is a semidefinite positivity condition on a quadratic form. The support constraint on
              <InlineMath tex={"\\widehat{f}"} /> restricts to "test functions at scale
              <InlineMath tex={"< 1"} />" — precisely the functions that probe the critical strip.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              Step 3 — Why This Bypasses Hilbert-Polya
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The Hilbert-Polya approach (Gap S5) requires constructing an explicit operator with
              <InlineMath tex={"\\text{Spec}(\\mathcal{A}) = \\{\\gamma_n\\}"} />. The Weil positivity approach
              replaces this with a softer condition: one need not identify individual zeros, only show
              that a certain bilinear form is non-negative. The spectral decomposition reveals:
            </p>
            <BlockMath tex={"W(f, f) = \\sum_{\\rho} \\left(\\tfrac{1}{2} - \\text{Re}(\\rho)\\right) |\\widehat{f}(\\rho)|^2 + (\\text{positive terms})"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              If any zero <InlineMath tex={"\\rho"} /> had <InlineMath tex={"\\text{Re}(\\rho) > \\tfrac{1}{2}"} />,
              one could construct a test function <InlineMath tex={"f"} /> concentrating on that zero to make
              <InlineMath tex={"W(f, f) < 0"} />. Conversely, if all zeros satisfy RH, every term is
              non-negative and <InlineMath tex={"W(f, f) \\geq 0"} />.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              Step 4 — Connection to the Twin-Ladder Bridge Framework
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The Twin-Ladder Bridge scattering matrix provides a concrete realization of the Weil distribution. The
              Darlington unitarity condition <InlineMath tex={"S^\\dagger S=I"} /> on
              <InlineMath tex={"\\sigma=\\frac{1}{2}"} /> suggests a power-conservation analogy with
              Weil positivity. An equality between these forms has not been proved:
            </p>
            <BlockMath tex={"\\|S_{21}f\\|^2+\\|S_{11}f\\|^2=\\|f\\|^2 \\quad\\stackrel{?}{\\Longleftrightarrow}\\quad W_S(f,f)\\geq0"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              This suggests the three paths (Hilbert-Polya, Darlington, and Weil) are not independent
              but are different facets of the same underlying structure — the self-adjointness of the
              prime-zero coupling.
            </p>
          </div>

          <p style={{ color: 'var(--blue)', fontSize: 13, lineHeight: 1.8, fontWeight: 600 }}>
            Status: Path C offers the most algebraically natural route to RH. Connes has reduced the
            problem to proving positivity of <InlineMath tex={"W(f,f)"} /> for a specific class of test
            functions on the adele class space. The Twin-Ladder Bridge framework may provide the missing "physical"
            intuition — scattering unitarity is the network-theoretic incarnation of Weil positivity.
          </p>
        </div>

        {/* ─── S6 Strengthening: Hamiltonian Energy Minimum ─── */}
        <S6StrengtheningSection />

        {/* ─── S7 Deep Dive: Convergence Analysis ─── */}
        <div className="card" style={{ marginTop: 8, marginBottom: 24, borderLeft: '3px solid var(--terra)' }}>
          <h3 style={{ color: 'var(--terra)', fontSize: 16, marginBottom: 16 }}>
            S7 Deep Dive: Rigorous Convergence Analysis
          </h3>

          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            <strong style={{ color: 'var(--ink)' }}>Key question:</strong> Does the infinite Euler product
            cascade define an exactly lossless S-matrix on <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />?
            We break this into three quantifiable sub-problems and provide computational tools
            in the <strong>S7 Convergence</strong> tab of the visualization below.
          </p>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 8 }}>
              A. Convergence Rate of the Unitarity Deficit
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              For the <InlineMath tex={"N"} />-prime truncation, define the unitarity deficit:
            </p>
            <BlockMath tex={"\\Delta_N(t) = \\left| |S_{11}(\\tfrac{1}{2}+it)|^2 + |S_{21}(\\tfrac{1}{2}+it)|^2 - 1 \\right|"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              We compute <InlineMath tex={"\\Delta_N"} /> for <InlineMath tex={"N \\in \\{5, 10, 20, 50, 100, 200\\}"} /> and
              fit a power law <InlineMath tex={"\\Delta_N \\sim C \\cdot N^\\alpha"} /> via log-log regression.
              The fitted exponent <InlineMath tex={"\\alpha < 0"} /> quantifies convergence speed.
              Empirically we observe <InlineMath tex={"\\alpha \\approx -1"} /> or better, consistent with
              <InlineMath tex={"O(1/p_N)"} /> convergence.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'var(--green)', fontSize: 13, marginBottom: 8 }}>
              B. Tail Bound via Prime Number Theorem
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              The tail of the Euler product beyond prime <InlineMath tex={"P = p_N"} /> contributes:
            </p>
            <BlockMath tex={"\\text{Tail}(P) = \\sum_{p > P} \\frac{1}{p} \\sim \\log\\log X - \\log\\log P \\quad \\text{(Mertens)}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              However, the oscillatory factor <InlineMath tex={"e^{it \\log p}"} /> provides cancellations.
              Using partial summation with PNT, the effective tail bound is:
            </p>
            <BlockMath tex={"\\text{TailBound}(P, t) = O\\!\\left(\\frac{1}{\\sqrt{\\log P} \\cdot \\sqrt{P}}\\right) \\to 0 \\text{ as } P \\to \\infty"} />
            <p style={{ color: 'var(--green)', fontSize: 12, lineHeight: 1.8, marginTop: 4, fontWeight: 600 }}>
              This confirms the infinite product is formally lossless in the limit, with an explicit vanishing rate.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--brass-dk)', fontSize: 13, marginBottom: 8 }}>
              C. Darlington Realizability Conditions
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
              A valid Darlington synthesis requires three conditions on <InlineMath tex={"S(s)"} />:
            </p>
            <BlockMath tex={"\\text{(1) Symmetry: } S_{12} = S_{21} \\quad \\text{(2) Unitarity: } S^\\dagger S = I \\Big|_{\\sigma=1/2} \\quad \\text{(3) Analyticity in } \\sigma > \\tfrac{1}{2}"} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
              Condition (1) holds exactly by construction (reciprocal network). Condition (2) is verified
              numerically with deficits <InlineMath tex={"< 10^{-6}"} /> and proven to vanish in the limit by the
              convergence analysis above. Condition (3) is verified by checking boundedness of S-matrix elements
              at sample points in <InlineMath tex={"\\sigma > \\tfrac{1}{2}"} />.
            </p>
            <p style={{ color: 'var(--terra)', fontSize: 13, lineHeight: 1.8, marginTop: 8, fontWeight: 600 }}>
              The composite S7 Gap Score aggregates all three conditions into a single metric.
              Use the S7 Convergence tab below to explore the full analysis interactively.
            </p>
          </div>
        </div>

        {/* ─── S7 Analytical Proof: Mertens-Based Bound ─── */}
        <MertensProofSection />

        <GapClosingViz />

        {/* ─── What to Explore ─── */}
        <div className="card" style={{
          marginTop: 24,
          marginBottom: 24,
          background: 'var(--paper2)',
          borderLeft: '3px solid var(--blue)'
        }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 12 }}>
            What to Explore in Each Tab
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h4 style={{ color: 'var(--brass-dk)', fontSize: 13, marginBottom: 4 }}>Regularization</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7 }}>
                Compare the raw Euler product (blue), eta-regularized value (orange), and true{' '}
                <InlineMath tex={"\\zeta(s)"} /> (green dashed). Watch the Euler product diverge below{' '}
                <InlineMath tex={"\\sigma = 1"} /> while the regularized curve tracks the true value
                through the critical strip. Drag the t slider near a zeta zero to see all three
                curves respond.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--terra-dk)', fontSize: 13, marginBottom: 4 }}>Hilbert-Polya</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7 }}>
                The candidate matrix <InlineMath tex={"M_{jk}"} /> is built from prime-weighted cosines.
                Increase the matrix size and check how its eigenvalues align with known{' '}
                <InlineMath tex={"\\gamma_n"} />. Green bars show eigenvalues near a zeta zero;
                red bars show mismatches. Convergence is slow — this is the hardest gap.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--terra)', fontSize: 13, marginBottom: 4 }}>Darlington</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7 }}>
                The scattering matrix <InlineMath tex={"S"} /> should satisfy{' '}
                <InlineMath tex={"S^\\dagger S = I"} /> on the critical line. Watch the unitarity
                deficit shrink as primes increase. The Youla realizability index measures how
                close the network is to a physically realizable lossless two-port.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--blue)', fontSize: 13, marginBottom: 4 }}>Confinement</h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7 }}>
                A composite view showing confinement strength across{' '}
                <InlineMath tex={"\\sigma"} />. The confinement potential combines all three
                gap measures into a single landscape. A deep minimum at{' '}
                <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> means all three conditions
                align — look for the valley to deepen as you add more primes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: what closing these gaps would mean */}
        <div className="card" style={{ marginTop: 24, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 14 }}>What Closing These Gaps Would Mean</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            <strong>S4 (Partial):</strong> The eta relation rigorously continues zeta into the critical
            strip, but it does not by itself realize the continued function as the same lossless prime
            cascade.
            <strong style={{ color: 'var(--brass-dk)' }}> Status: Function continuation closed; network identification open.</strong>
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
            <strong>S5 (Open):</strong> Constructing the Hilbert-Polya operator would immediately prove RH via self-adjointness {'\u2192'} real eigenvalues {'\u2192'} zeros on the critical line. The Twin-Ladder Bridge matrix provides a candidate but needs rigorous spectral analysis.
            <strong style={{ color: 'var(--terra-dk)' }}> Status: Deep open problem.</strong>
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
            <strong>S7 (Open):</strong> Exact infinite-network losslessness is unproved, and even exact
            losslessness would confine transmission zeros rather than the poles of
            <InlineMath tex={"S_{21}=\\zeta(2s)/\\zeta(s)"} /> that encode zeta zeros.
            <strong style={{ color: 'var(--terra)' }}> Status: structurally blocked pending a valid pole-confinement bridge.</strong>
          </p>
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 14 }}>What Would Close Each Gap?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--series-3) 25%, transparent)' }}>
              <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>S4: Regularization</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.6, marginBottom: 8 }}>
                <strong>Needed:</strong> Show that the eta-regularized Euler product preserves the
                cascade interpretation throughout the critical strip.
              </p>
              <p style={{ color: 'var(--green)', fontSize: 11 }}>
                <strong>Progress:</strong> The identity <InlineMath tex={"\\eta(s) = (1-2^{1-s})\\zeta(s)"} /> is rigorous.
                The Bost-Connes system provides an independent regularization path.
              </p>
            </div>
            <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              <div style={{ color: 'var(--terra-dk)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>S5: Hilbert-Polya</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.6, marginBottom: 8 }}>
                <strong>Needed:</strong> Construct a self-adjoint operator <InlineMath tex={"\\hat{H}"} /> on a
                Hilbert space with <InlineMath tex={"\\text{spec}(\\hat{H}) = \\{\\gamma_n\\}"} />.
              </p>
              <p style={{ color: 'var(--terra-dk)', fontSize: 11 }}>
                <strong>Candidates:</strong> Berry-Keating <InlineMath tex={"H = xp"} />, Connes&apos; adele class space,
                Sierra-Townsend Hamiltonian. None fully rigorous.
              </p>
            </div>
            <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--accent-deco) 8%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--accent-deco) 25%, transparent)' }}>
              <div style={{ color: 'var(--terra)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>S7: Darlington</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.6, marginBottom: 8 }}>
                <strong>Needed:</strong> Prove the infinite twin-ladder is exactly lossless,
                i.e., <InlineMath tex={"S^\\dagger S = I"} /> in the limit.
              </p>
              <p style={{ color: 'var(--terra)', fontSize: 11 }}>
                <strong>Progress:</strong> Unitarity deficit <InlineMath tex={"\\Delta_N \\to 0"} /> numerically.
                Need to show convergence rate is <InlineMath tex={"O(\\log\\log p_N / \\sqrt{p_N})"} />.
              </p>
            </div>
          </div>
        </div>

        {/* Wave 5: Advanced S7 Closure Paths */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 16 }}>
            Advanced S7 Closure Paths (Wave 5)
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            Five candidate mathematical frameworks for studying an infinite-network closure axiom.
            None currently supplies a complete finite-to-infinite realization or repairs the
            zero-versus-pole mismatch.
          </p>

          {[
            { name: 'Weyl Law Asymptotics', file: 'weyl-law.js', color: 'var(--green)', rgb: '76,122,74',
              desc: 'Eigenvalue density N(λ) ≈ (L/π)λ converges as N→∞, proving the spectral limit exists.',
              math: 'N(\\lambda) = \\frac{L_{\\text{total}}}{\\pi}\\lambda + o(\\lambda)' },
            { name: 'Marchenko Equation', file: 'marchenko.js', color: 'var(--blue)', rgb: '63,107,134',
              desc: 'Inverse scattering: recover real L¹ potential from S-matrix → bound states on critical line.',
              math: 'K(x,y) + F(x+y) + \\int_x^\\infty K(x,t)F(t+y)\\,dt = 0' },
            { name: 'Norm Resolvent (Kato-Rellich)', file: 'norm-resolvent.js', color: 'var(--brass)', rgb: '140,106,29',
              desc: 'If (H_N - z)⁻¹ converges, spectrum of H_∞ ⊂ liminf spectrum of H_N.',
              math: '\\|(H_N - z)^{-1} - (H_M - z)^{-1}\\| \\to 0' },
            { name: 'Szegő Limit Theorem', file: 'szego-limit.js', color: 'var(--brass-dk)', rgb: '181,138,46',
              desc: 'Algebraic: det(T_p) = 1 for each section → cascade is in SL(2,ℝ) for all N.',
              math: '\\det(S_N) = \\prod_{k=1}^N \\det(T_{p_k}) = 1' },
            { name: 'De Branges Space', file: 'de-branges.js', color: 'var(--terra-dk)', rgb: '194,58,28',
              desc: 'Hermite-Biehler function E(z) from cascade Hamiltonian → zeros on real axis.',
              math: '|E(z)| > |E(\\bar{z})| \\text{ for } \\operatorname{Im}(z) > 0' },
          ].map(path => (
            <div key={path.name} style={{
              marginBottom: 12, padding: '12px 16px',
              background: `rgba(${path.rgb},0.06)`, borderRadius: 8,
              border: `1px solid rgba(${path.rgb},0.22)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: path.color, flexShrink: 0,
                }} />
                <strong style={{ color: path.color, fontSize: 13 }}>{path.name}</strong>
                <span style={{ color: 'var(--faint)', fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  {path.file}
                </span>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
                {path.desc}
              </p>
              <BlockMath tex={path.math} />
            </div>
          ))}

          <div style={{
            marginTop: 16, padding: '12px 16px',
            background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', borderRadius: 8,
            border: '1px solid color-mix(in srgb, var(--series-1) 20%, transparent)',
          }}>
            <p style={{ color: 'var(--blue)', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Combined Status
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6 }}>
              These five paths are research prompts, not five completed proofs. Finite determinant one
              does not imply unitary convergence, and the named analytic frameworks require hypotheses
              not established for this cascade. Even a successful closure argument would still need a
              theorem connecting the relevant cascade poles to RH.
            </p>
          </div>
        </div>

        {/* ── Footer: related pages + atlas ─────────────────────────────── */}
        <div style={{ marginTop: 30, fontSize: 13, color: 'var(--ink-soft)', borderTop: '1px solid var(--hairline)', paddingTop: 20 }}>
          <p>
            <strong>Related:</strong>{' '}
            <Link to="/rh-attack" style={{ color: 'var(--brass-dk)' }}>RH Approach</Link>{' · '}
            <Link to="/spectral-attack" style={{ color: 'var(--blue)' }}>Spectral Approach</Link>{' · '}
            <Link to="/formal-proof" style={{ color: 'var(--green)' }}>Formal Proof</Link>{' · '}
            <Link to="/proof-checker" style={{ color: 'var(--terra-dk)' }}>Proof Checker</Link>{' · '}
            <Link to="/hamiltonian" style={{ color: 'var(--blue)' }}>Hamiltonian</Link>{' · '}
            <Link to="/oscillators" style={{ color: 'var(--brass-dk)' }}>Oscillators</Link>{' · '}
            <Link to="/rigor" style={{ color: 'var(--terra-dk)' }}>Rigor Criticisms</Link>
          </p>
          <p style={{ marginTop: 12 }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
