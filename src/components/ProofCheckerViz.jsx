import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  verifyFunctionalEquation, verifyBridgeUnitarity, verifyEulerProductConvergence,
  testHamiltonianMinimum, testImpedanceMatching, testEntropyMaximum,
  davenportHeilbronnZeta, davenportHeilbronnReport,
  stressTestLargeT, circularityCheck, implicationStrengthTest,
  fullProofCheck,
} from '../math/proof-checker.js';
import { ZETA_ZEROS, zetaCriticalStrip, cAbs } from '../math/zeta.js';
import { ED, alpha } from '../styles/tokens.js';

const TABS = ['Identity Tests', 'D-H Counterexample', 'Logic Gaps', 'Full Report'];
const TAB_COLORS = [ED.series3, ED.series2, ED.series4, ED.series5];

const statusBadge = (pass, label) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    background: pass ? 'color-mix(in srgb, var(--series-3) 15%, transparent)' : 'color-mix(in srgb, var(--series-2) 15%, transparent)',
    color: pass ? 'var(--series-3)' : 'var(--series-2)',
    border: `1px solid ${pass ? alpha(ED.series3, 0.25) : alpha(ED.series2, 0.25)}`,
  }}>{label || (pass ? 'PASS' : 'FAIL')}</span>
);

const warnBadge = (label) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    background: 'color-mix(in srgb, var(--brass-deco) 15%, transparent)',
    color: 'var(--brass)',
    border: '1px solid color-mix(in srgb, var(--brass-deco) 25%, transparent)',
  }}>{label || 'WARN'}</span>
);

const strengthBadge = (strength) => {
  const colors = {
    proof: ED.series3,
    strong: ED.series1,
    weak: ED.series4,
    circular: ED.series2,
    false: ED.series2,
  };
  const c = colors[strength] || ED.series8;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 10,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'var(--font-mono)',
      background: `${c}20`,
      color: c,
      border: `1px solid ${c}40`,
      textTransform: 'uppercase',
    }}>{strength}</span>
  );
};

// ===========================================================================
// Tab 1: Identity Tests
// ===========================================================================
function IdentityTestsTab({ numPrimes }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const results = useMemo(() => {
    const fe = verifyFunctionalEquation();
    const bu = verifyBridgeUnitarity();
    const ec = verifyEulerProductConvergence(undefined, numPrimes * 5);
    return { fe, bu, ec };
  }, [numPrimes]);

  const rows = useMemo(() => [
    {
      name: 'Functional Equation',
      points: results.fe.tests.length,
      maxError: results.fe.worstError,
      pass: results.fe.allPass,
      details: results.fe.tests,
      verdict: results.fe.verdict,
    },
    {
      name: 'Bridge Unitarity',
      points: results.bu.tests.length,
      maxError: results.bu.worstError,
      pass: results.bu.allPass,
      details: results.bu.tests,
      verdict: null,
    },
    {
      name: 'Euler Product Convergence',
      points: results.ec.tests.length,
      maxError: null,
      pass: true,
      details: results.ec.tests,
      verdict: `Convergence boundary at sigma ~ ${results.ec.convergenceBoundary.toFixed(2)}`,
    },
  ], [results]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        <p style={{ margin: '0 0 8px' }}>
          Numerical verification of three mathematical identities used by the Twin-Ladder Bridge model:
        </p>
        <BlockMath tex={"\\zeta(s) = \\chi(s)\\,\\zeta(1-s), \\qquad |\\chi(\\tfrac{1}{2}+it)| = 1, \\qquad \\prod_p (1 - p^{-s})^{-1} \\;\\text{for } \\operatorname{Re}(s) > 1"} />
        <p style={{ margin: '8px 0 0' }}>
          Click any row to expand details.
          <strong> These are known identities</strong> &mdash; passing confirms the numerics are correct, not that RH is proven.
        </p>
      </div>
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: 12,
        fontFamily: 'var(--font-mono)',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            {['Test', 'Points', 'Max Error', 'Status'].map(h => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: 'left', color: 'var(--ink-faint)',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <React.Fragment key={row.name}>
              <tr
                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                style={{
                  cursor: 'pointer', borderBottom: '1px solid var(--rule-soft)',
                  background: expandedRow === i ? 'var(--paper-2)' : 'transparent',
                }}
              >
                <td style={{ padding: '10px 12px', color: 'var(--ink)' }}>
                  <span style={{
                    display: 'inline-block', marginRight: 6, fontSize: 10, color: 'var(--ink-faint)',
                    transition: 'transform 0.2s', transform: expandedRow === i ? 'rotate(90deg)' : 'rotate(0)',
                  }}>&#9654;</span>
                  {row.name}
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--ink-soft)' }}>{row.points}</td>
                <td style={{ padding: '10px 12px', color: 'var(--ink-soft)' }}>
                  {row.maxError != null ? row.maxError.toExponential(3) : '--'}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  {statusBadge(row.pass)}
                </td>
              </tr>
              {expandedRow === i && (
                <tr>
                  <td colSpan={4} style={{ padding: '12px 16px', background: 'var(--paper)' }}>
                    {row.verdict && (
                      <div style={{
                        padding: '8px 12px', background: 'var(--paper-2)', borderRadius: 6,
                        fontSize: 11, color: 'var(--ink-soft)', marginBottom: 10, lineHeight: 1.6,
                      }}>{row.verdict}</div>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                          <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>#</th>
                          {row.name === 'Functional Equation' && (
                            <>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>s</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>Rel. Error</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>Status</th>
                            </>
                          )}
                          {row.name === 'Bridge Unitarity' && (
                            <>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>t</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>|chi|</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>Error</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>Status</th>
                            </>
                          )}
                          {row.name === 'Euler Product Convergence' && (
                            <>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>sigma</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>Converges</th>
                              <th style={{ padding: '4px 8px', textAlign: 'left', color: 'var(--ink-faint)' }}>Error vs true</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {row.details.map((d, j) => (
                          <tr key={j} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule-soft) 13%, transparent)' }}>
                            <td style={{ padding: '4px 8px', color: 'var(--ink-faint)' }}>{j + 1}</td>
                            {row.name === 'Functional Equation' && (
                              <>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>
                                  [{d.s[0].toFixed(2)}, {d.s[1].toFixed(1)}]
                                </td>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>
                                  {d.relativeError.toExponential(3)}
                                </td>
                                <td style={{ padding: '4px 8px' }}>
                                  {statusBadge(d.passes)}
                                </td>
                              </>
                            )}
                            {row.name === 'Bridge Unitarity' && (
                              <>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>{d.t}</td>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>{d.chiMagnitude.toFixed(6)}</td>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>{d.error.toExponential(3)}</td>
                                <td style={{ padding: '4px 8px' }}>{statusBadge(d.passes)}</td>
                              </>
                            )}
                            {row.name === 'Euler Product Convergence' && (
                              <>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>{d.sigma.toFixed(1)}</td>
                                <td style={{ padding: '4px 8px' }}>
                                  {statusBadge(d.converges, d.converges ? 'YES' : 'NO')}
                                </td>
                                <td style={{ padding: '4px 8px', color: 'var(--ink-soft)' }}>{d.error.toFixed(4)}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div style={{
        marginTop: 12, padding: '10px 14px', background: 'var(--paper-2)',
        borderRadius: 6, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6,
      }}>
        All three are <strong style={{ color: 'var(--series-3)' }}>known identities</strong> that hold for any
        function with a functional equation. They verify correctness of our implementation, but do{' '}
        <strong style={{ color: 'var(--series-2)' }}>not</strong> provide evidence for RH.
      </div>
    </div>
  );
}

// ===========================================================================
// Tab 2: Davenport-Heilbronn Counterexample (Canvas + HTML)
// ===========================================================================
function DHCounterexampleTab() {
  const canvasRef = useRef();
  const [testT, setTestT] = useState(20);

  // Precompute both curves for the canvas
  const curveData = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 60; i++) {
      const sigma = 0.1 + (0.8 * i / 60);
      const zetaVal = cAbs(zetaCriticalStrip([sigma, testT]));
      const dhVal = cAbs(davenportHeilbronnZeta([sigma, testT]));
      points.push({ sigma, zeta: zetaVal, dh: dhVal });
    }
    return points;
  }, [testT]);

  // Precompute the discriminator report (independent of testT)
  const report = useMemo(() => davenportHeilbronnReport(), []);

  const drawDH = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const points = curveData;

    // Compute scales
    const maxY = Math.max(
      ...points.map(p => p.zeta),
      ...points.map(p => p.dh),
      0.1
    ) * 1.15;

    const xScale = (sigma) => margin.left + ((sigma - 0.1) / 0.8) * plotW;
    const yScale = (v) => margin.top + plotH - (v / maxY) * plotH;

    // Grid
    ctx.strokeStyle = ED.ruleSoft;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (i / 5) * plotH;
      ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + plotW, y); ctx.stroke();
    }
    for (let s = 0.1; s <= 0.9; s += 0.1) {
      const x = xScale(s);
      ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
    }

    // sigma = 0.5 reference line
    const halfX = xScale(0.5);
    ctx.strokeStyle = alpha(ED.series3, 0.38);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(halfX, margin.top);
    ctx.lineTo(halfX, margin.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ED.series3;
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = \u00BD', halfX, margin.top - 8);

    // Draw zeta curve (blue)
    ctx.strokeStyle = ED.series1;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = xScale(p.sigma);
      const y = yScale(p.zeta);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under zeta
    ctx.lineTo(xScale(points[points.length - 1].sigma), margin.top + plotH);
    ctx.lineTo(xScale(points[0].sigma), margin.top + plotH);
    ctx.closePath();
    ctx.fillStyle = alpha(ED.series1, 0.06);
    ctx.fill();

    // Draw D-H curve (red)
    ctx.strokeStyle = ED.series2;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = xScale(p.sigma);
      const y = yScale(p.dh);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under D-H
    ctx.lineTo(xScale(points[points.length - 1].sigma), margin.top + plotH);
    ctx.lineTo(xScale(points[0].sigma), margin.top + plotH);
    ctx.closePath();
    ctx.fillStyle = alpha(ED.series2, 0.06);
    ctx.fill();

    // Axes
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotH);
    ctx.lineTo(margin.left + plotW, margin.top + plotH);
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = ED.series8;
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let s = 0.1; s <= 0.9; s += 0.1) {
      ctx.fillText(s.toFixed(1), xScale(s), margin.top + plotH + 16);
    }
    ctx.fillText('\u03C3', margin.left + plotW + 12, margin.top + plotH + 4);

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const val = (maxY * (5 - i) / 5);
      const y = margin.top + (i / 5) * plotH;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 4);
    }

    // Y-axis label
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series8;
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('|f(\u03C3 + it)|', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = ED.ink;
    ctx.font = 'bold 12px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText(`|\u03B6(\u03C3+${testT}i)| vs |f_DH(\u03C3+${testT}i)|`, margin.left + 4, margin.top - 10);

    // Legend
    const lx = margin.left + plotW - 180;
    const ly = margin.top + 8;
    ctx.fillStyle = 'rgba(10, 14, 26, 0.9)';
    ctx.strokeStyle = ED.ruleSoft;
    ctx.lineWidth = 1;
    ctx.fillRect(lx, ly, 175, 50);
    ctx.strokeRect(lx, ly, 175, 50);

    ctx.strokeStyle = ED.series1; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lx + 8, ly + 16); ctx.lineTo(lx + 30, ly + 16); ctx.stroke();
    ctx.fillStyle = ED.series8; ctx.font = '10px var(--font-mono)'; ctx.textAlign = 'left';
    ctx.fillText('|\u03B6(s)| Riemann zeta', lx + 36, ly + 20);

    ctx.strokeStyle = ED.series2; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lx + 8, ly + 34); ctx.lineTo(lx + 30, ly + 34); ctx.stroke();
    ctx.fillStyle = ED.series8;
    ctx.fillText('|f_DH(s)| Davenport-H.', lx + 36, ly + 38);
  }, [curveData, testT]);

  useEffect(() => { drawDH(); }, [drawDH]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => drawDH());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawDH]);

  return (
    <div>
      <div className="tab-explainer accent-red">
        The Davenport&ndash;Heilbronn zeta function satisfies a functional equation identical in form
        to Riemann&rsquo;s, yet has zeros <em>off</em> the critical line. This is the sharpest counterexample to any
        &ldquo;proof&rdquo; of RH that relies only on functional equation symmetry. The plot compares <InlineMath tex={"|\\zeta(\\tfrac{1}{2}+it)|"} /> (blue)
        against <InlineMath tex={"|f_{\\rm DH}(\\tfrac{1}{2}+it)|"} /> (red) &mdash; both dip at their zeros, but only <InlineMath tex={"\\zeta"} />&rsquo;s zeros
        are conjectured to all lie on the critical line.
      </div>
      {/* t slider */}
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ color: 'var(--ink-soft)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          t = {testT}
        </label>
        <input type="range" min={5} max={100} step={1} value={testT}
          onChange={e => setTestT(Number(e.target.value))}
          style={{ flex: 1 }} />
      </div>

      {/* Canvas: Zeta vs D-H */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%', height: 300, background: 'var(--paper)',
          borderRadius: 8, border: '1px solid var(--rule-soft)',
        }}
      />

      {/* Key message */}
      <div style={{
        marginTop: 12, padding: '10px 14px', background: 'var(--paper-2)',
        borderRadius: 6, border: '1px solid color-mix(in srgb, var(--series-2) 25%, transparent)',
        fontSize: 12, color: 'var(--ink)', lineHeight: 1.6, textAlign: 'center',
      }}>
        The <strong style={{ color: 'var(--series-1)' }}>Euler product / Darlington synthesis</strong> is the{' '}
        <strong style={{ color: 'var(--series-2)' }}>ONLY</strong> Twin-Ladder Bridge property that distinguishes{' '}
        <InlineMath tex={"\\zeta"} /> from Davenport-Heilbronn.
      </div>

      {/* Discriminator table */}
      <h4 style={{ color: 'var(--series-2)', fontSize: 13, marginTop: 20, marginBottom: 8 }}>
        Discriminator Analysis
      </h4>
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: 12,
        fontFamily: 'var(--font-mono)',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            {['Property', 'Holds for \u03B6?', 'Holds for D-H?', 'Discriminates?'].map(h => (
              <th key={h} style={{
                padding: '8px 10px', textAlign: 'left', color: 'var(--ink-faint)',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report.discriminators.map((d, i) => {
            const discriminates = d.zetaHas && d.dhLacks;
            return (
              <tr key={i} style={{
                borderBottom: '1px solid var(--rule-soft)',
                background: discriminates ? 'color-mix(in srgb, var(--series-3) 5%, transparent)' : 'color-mix(in srgb, var(--series-2) 3%, transparent)',
              }}>
                <td style={{ padding: '8px 10px', color: 'var(--ink)' }}>{d.property}</td>
                <td style={{ padding: '8px 10px' }}>
                  {statusBadge(d.zetaHas, d.zetaHas ? 'YES' : 'NO')}
                </td>
                <td style={{ padding: '8px 10px' }}>
                  {statusBadge(!d.dhLacks, d.dhLacks ? 'NO' : 'YES')}
                </td>
                <td style={{ padding: '8px 10px' }}>
                  {discriminates
                    ? statusBadge(true, 'YES')
                    : statusBadge(false, 'NO')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Bridge test summary */}
      <div style={{
        marginTop: 16, padding: '10px 14px', background: 'var(--paper-2)',
        borderRadius: 6, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6,
        borderLeft: '3px solid var(--series-2)',
      }}>
        <strong style={{ color: 'var(--series-2)' }}>Bridge Test:</strong>{' '}
        {report.bridgeTest.implication}
      </div>

      {/* Hamiltonian test summary */}
      <div style={{
        marginTop: 8, padding: '10px 14px', background: 'var(--paper-2)',
        borderRadius: 6, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6,
        borderLeft: '3px solid var(--brass-deco)',
      }}>
        <strong style={{ color: 'var(--brass)' }}>Hamiltonian Test:</strong>{' '}
        {report.hamiltonianTest.verdict}
      </div>

      {/* Conclusion */}
      <div style={{
        marginTop: 12, padding: '12px 14px', background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
        borderRadius: 6, fontSize: 12, color: 'var(--ink)', lineHeight: 1.7,
        border: '1px solid color-mix(in srgb, var(--series-2) 25%, transparent)',
      }}>
        <strong style={{ color: 'var(--series-2)' }}>Conclusion:</strong>{' '}
        {report.conclusion}
      </div>
    </div>
  );
}

// ===========================================================================
// Tab 3: Logic Gaps
// ===========================================================================
function LogicGapsTab({ numPrimes }) {
  const circResults = useMemo(() => circularityCheck(), []);
  const implResults = useMemo(() => implicationStrengthTest(5, numPrimes), [numPrimes]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        Automated analysis of logical gaps in the Twin-Ladder Bridge &ldquo;proof&rdquo; chain. The circularity checker traces
        which claims depend on which assumptions and flags circular reasoning. The implication strength
        tester evaluates whether each step is a rigorous proof, a strong heuristic, a weak analogy,
        or outright circular.
        <strong> Every gap found here</strong> is a place where the Twin-Ladder Bridge argument fails to constitute a proof.
      </div>
      {/* Circularity Check */}
      <h4 style={{ color: 'var(--brass)', fontSize: 13, marginBottom: 10 }}>
        Circularity Analysis
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {circResults.map((c, i) => (
          <div key={i} style={{
            padding: '10px 14px', background: 'var(--paper-2)', borderRadius: 6,
            borderLeft: `3px solid ${c.isCircular ? ED.series2 : ED.series3}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {statusBadge(!c.isCircular, c.isCircular ? 'CIRCULAR' : 'OK')}
              <span style={{ color: 'var(--ink)', fontSize: 12, fontWeight: 600 }}>{c.claim}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 4 }}>
              Depends on: {c.dependsOn.map((dep, j) => (
                <span key={j} style={{
                  display: 'inline-block', margin: '2px 4px 2px 0', padding: '1px 6px',
                  background: 'var(--paper-3)', borderRadius: 4, fontSize: 10, color: 'var(--ink-soft)',
                }}>{dep}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {c.explanation}
            </div>
          </div>
        ))}
      </div>

      {/* Implication Strength */}
      <h4 style={{ color: 'var(--brass)', fontSize: 13, marginBottom: 10 }}>
        Implication Strength Test
      </h4>
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: 12,
        fontFamily: 'var(--font-mono)',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            {['From \u2192 To', 'Strength', 'Evidence', 'Counterexample'].map(h => (
              <th key={h} style={{
                padding: '8px 10px', textAlign: 'left', color: 'var(--ink-faint)',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {implResults.implications.map((imp, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '8px 10px', color: 'var(--ink)', fontSize: 11 }}>
                {imp.from} <span style={{ color: 'var(--ink-faint)' }}>{'\u2192'}</span> {imp.to}
              </td>
              <td style={{ padding: '8px 10px' }}>
                {strengthBadge(imp.strength)}
              </td>
              <td style={{ padding: '8px 10px', color: 'var(--ink-soft)', fontSize: 11 }}>
                {imp.evidence}
              </td>
              <td style={{ padding: '8px 10px', color: 'var(--series-2)', fontSize: 11 }}>
                {imp.counterexample || '--'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Flow Diagram */}
      <h4 style={{ color: 'var(--brass)', fontSize: 13, marginTop: 24, marginBottom: 10 }}>
        Logical Flow Diagram
      </h4>
      <div style={{
        padding: 16, background: 'var(--paper)', borderRadius: 8,
        border: '1px solid var(--rule-soft)', overflow: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Premises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Premises</div>
            {['Functional Eq.', 'Euler Product', 'Selberg Class'].map(label => (
              <div key={label} style={{
                padding: '6px 12px', background: 'var(--paper-3)', borderRadius: 6,
                border: '1px solid var(--rule)', fontSize: 11, color: 'var(--series-1)',
                textAlign: 'center', minWidth: 100,
              }}>{label}</div>
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, paddingTop: 24 }}>
            <div style={{ color: 'var(--series-3)', fontSize: 18 }}>{'\u2192'}</div>
            <div style={{ color: 'var(--series-3)', fontSize: 18 }}>{'\u2192'}</div>
            <div style={{ color: 'var(--series-2)', fontSize: 18, textDecoration: 'line-through' }}>{'\u2192'}</div>
          </div>

          {/* Intermediate claims */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Claims</div>
            {[
              { label: 'Bridge Unitarity', color: ED.brass, status: 'identity' },
              { label: 'H min at \u03C3=\u00BD', color: ED.series2, status: 'circular' },
              { label: 'Impedance Match', color: ED.series2, status: 'circular' },
            ].map(c => (
              <div key={c.label} style={{
                padding: '6px 12px', background: c.color === '#ef4444' ? 'color-mix(in srgb, var(--series-2) 8%, transparent)' : 'var(--paper-3)',
                borderRadius: 6, border: `1px solid ${c.color}40`,
                fontSize: 11, color: c.color, textAlign: 'center', minWidth: 120,
              }}>
                {c.label}
                <div style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{c.status}</div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, paddingTop: 24 }}>
            <div style={{ color: 'var(--series-2)', fontSize: 18, textDecoration: 'line-through' }}>{'\u21CF'}</div>
            <div style={{ color: 'var(--series-2)', fontSize: 18, textDecoration: 'line-through' }}>{'\u21CF'}</div>
            <div style={{ color: 'var(--brass)', fontSize: 18 }}>?</div>
          </div>

          {/* Conclusion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Goal</div>
            <div style={{
              padding: '12px 16px', background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
              borderRadius: 6, border: '1px solid color-mix(in srgb, var(--series-2) 25%, transparent)',
              fontSize: 12, color: 'var(--series-2)', fontWeight: 600, textAlign: 'center',
            }}>
              All zeros on<br /><InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />
            </div>
            <div style={{
              padding: '6px 12px', background: 'color-mix(in srgb, var(--series-3) 8%, transparent)',
              borderRadius: 6, border: '1px solid color-mix(in srgb, var(--series-3) 25%, transparent)',
              fontSize: 11, color: 'var(--series-3)', textAlign: 'center',
            }}>
              Best path:<br />Euler product
            </div>
          </div>
        </div>
      </div>

      {/* Overall assessment */}
      <div style={{
        marginTop: 16, padding: '10px 14px', background: 'var(--paper-2)',
        borderRadius: 6, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6,
        borderLeft: '3px solid var(--brass-deco)',
      }}>
        <strong style={{ color: 'var(--brass)' }}>Overall:</strong>{' '}
        {implResults.overallAssessment}
      </div>
    </div>
  );
}

// ===========================================================================
// Tab 4: Full Report
// ===========================================================================
function FullReportTab({ numPrimes }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCheck = useCallback(() => {
    setLoading(true);
    // Use setTimeout to allow the spinner to render before the heavy computation
    setTimeout(() => {
      const result = fullProofCheck(numPrimes, 5);
      setReport(result);
      setLoading(false);
    }, 50);
  }, [numPrimes]);

  // Auto-run the check when the tab mounts
  useEffect(() => {
    if (!report && !loading) {
      runCheck();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!report && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 16 }}>
          Running full proof check...
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          display: 'inline-block', width: 32, height: 32,
          border: '3px solid var(--rule-soft)', borderTop: '3px solid var(--series-1)',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 12 }}>
          Running skeptical proof check...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const { summary, verdict, criticalFailures, whatWorks, whatFails } = report;

  const resultBadge = (status) => {
    if (status === 'PASS') return statusBadge(true);
    if (status === 'FAIL') return statusBadge(false);
    return warnBadge(status);
  };

  // Build flat list of all test sections
  const sections = [];

  // Identities
  const identityTests = [];
  report.identities.functionalEq.tests.forEach((t, i) => {
    identityTests.push({
      name: `Functional Eq #${i + 1} (s=[${t.s[0].toFixed(2)}, ${t.s[1].toFixed(1)}])`,
      result: t.passes ? 'PASS' : 'FAIL',
      detail: `Relative error: ${t.relativeError.toExponential(3)}`,
    });
  });
  report.identities.bridgeUnitarity.tests.forEach((t) => {
    identityTests.push({
      name: `Bridge unitarity (t=${t.t})`,
      result: t.passes ? 'PASS' : 'FAIL',
      detail: `|chi| = ${t.chiMagnitude.toFixed(6)}, error = ${t.error.toExponential(3)}`,
    });
  });
  sections.push({ label: 'Identities', color: ED.series3, tests: identityTests });

  // Model Claims
  const modelTests = [];
  report.modelClaims.hamiltonianMin.tests.forEach((t) => {
    modelTests.push({
      name: `H minimum (t=${t.t})`,
      result: t.isAtHalf ? 'PASS' : 'FAIL',
      detail: `Min sigma = ${t.minSigma}, deviation = ${t.deviation.toFixed(4)}`,
    });
  });
  report.modelClaims.impedanceMatch.tests.forEach((t) => {
    modelTests.push({
      name: `Impedance match (gamma=${t.gamma.toFixed(2)})`,
      result: t.nearZero ? 'PASS' : 'WARN',
      detail: `Mismatch = ${t.mismatch.toFixed(4)}`,
    });
  });
  report.modelClaims.entropyMax.tests.forEach((t) => {
    modelTests.push({
      name: `Entropy max (t=${t.t})`,
      result: t.isAtHalf ? 'PASS' : 'FAIL',
      detail: `Max entropy sigma = ${t.maxEntropySigma}, H = ${t.entropyAtMax.toFixed(3)}`,
    });
  });
  sections.push({ label: 'Model Claims', color: ED.series1, tests: modelTests });

  // Stress Tests
  const stressTests = [];
  report.stressTests.largeT.tests.forEach((t) => {
    const pass = t.bridgeOk && t.hamiltonianOk && t.zetaComputable;
    stressTests.push({
      name: `Large t = ${t.t}`,
      result: pass ? 'PASS' : 'WARN',
      detail: `Bridge: ${t.bridgeOk ? 'OK' : 'FAIL'}, H-min: ${t.hamiltonianOk ? 'OK' : 'FAIL'}, Computable: ${t.zetaComputable ? 'YES' : 'NO'}`,
    });
  });
  sections.push({ label: 'Stress Tests', color: ED.brass, tests: stressTests });

  // Logic
  const logicTests = [];
  report.logicCheck.circularity.forEach((c) => {
    logicTests.push({
      name: c.claim,
      result: c.isCircular ? 'FAIL' : 'PASS',
      detail: c.explanation,
    });
  });
  report.logicCheck.implicationStrength.implications.forEach((imp) => {
    const res = imp.strength === 'strong' || imp.strength === 'proof' ? 'PASS'
      : imp.strength === 'weak' ? 'WARN' : 'FAIL';
    logicTests.push({
      name: `${imp.from} => ${imp.to}`,
      result: res,
      detail: imp.evidence + (imp.counterexample ? ` Counterexample: ${imp.counterexample}` : ''),
    });
  });
  sections.push({ label: 'Logic', color: ED.series5, tests: logicTests });

  return (
    <div>
      <div className="tab-explainer accent-purple">
        Aggregated proof-checking report combining all identity tests, counterexample analysis, and logic
        gap detection into a single verdict. The score reflects how many checks pass, how many gaps remain,
        and how severe the circularity issues are.
        <strong> Result:</strong> the Twin-Ladder Bridge model is a pedagogical tool for visualizing RH &mdash; not a proof.
      </div>
      {/* Verdict box */}
      <div style={{
        padding: '16px 20px', marginBottom: 20, borderRadius: 8,
        background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
        border: '2px solid var(--series-2)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 16, fontWeight: 700, color: 'var(--series-2)',
          fontFamily: 'var(--font-mono)', marginBottom: 8,
        }}>
          NOT A PROOF -- gaps remain
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
          {verdict}
        </div>
      </div>

      {/* Summary counters */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8, marginBottom: 20,
      }}>
        <div style={{
          textAlign: 'center', padding: 12, background: 'var(--paper-2)', borderRadius: 6,
          border: '1px solid color-mix(in srgb, var(--series-3) 25%, transparent)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--series-3)', fontFamily: 'var(--font-mono)' }}>
            {summary.passed}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>PASSED</div>
        </div>
        <div style={{
          textAlign: 'center', padding: 12, background: 'var(--paper-2)', borderRadius: 6,
          border: '1px solid color-mix(in srgb, var(--series-2) 25%, transparent)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--series-2)', fontFamily: 'var(--font-mono)' }}>
            {summary.failed}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>FAILED</div>
        </div>
        <div style={{
          textAlign: 'center', padding: 12, background: 'var(--paper-2)', borderRadius: 6,
          border: '1px solid color-mix(in srgb, var(--brass-deco) 25%, transparent)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--brass)', fontFamily: 'var(--font-mono)' }}>
            {summary.warnings}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>WARNINGS</div>
        </div>
      </div>

      {/* Critical failures */}
      {criticalFailures.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: 'var(--series-2)', fontSize: 13, marginBottom: 8 }}>Critical Failures</h4>
          {criticalFailures.map((f, i) => (
            <div key={i} style={{
              padding: '8px 12px', marginBottom: 6, background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
              borderRadius: 6, borderLeft: '3px solid var(--series-2)',
              fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5,
            }}>
              <strong style={{ color: 'var(--series-2)' }}>{f.test}:</strong> {f.reason}
            </div>
          ))}
        </div>
      )}

      {/* What works / what fails */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div>
          <h4 style={{ color: 'var(--series-3)', fontSize: 13, marginBottom: 8 }}>What Works</h4>
          {whatWorks.map((w, i) => (
            <div key={i} style={{
              padding: '6px 10px', marginBottom: 4, background: 'var(--paper-2)',
              borderRadius: 4, borderLeft: '2px solid var(--series-3)',
              fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.4,
            }}>
              <strong style={{ color: 'var(--series-3)' }}>{w.claim}</strong>
              <div style={{ marginTop: 2 }}>{w.evidence}</div>
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ color: 'var(--series-2)', fontSize: 13, marginBottom: 8 }}>What Fails</h4>
          {whatFails.map((f, i) => (
            <div key={i} style={{
              padding: '6px 10px', marginBottom: 4, background: 'var(--paper-2)',
              borderRadius: 4, borderLeft: '2px solid var(--series-2)',
              fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.4,
            }}>
              <strong style={{ color: 'var(--series-2)' }}>{f.claim}</strong>
              <div style={{ marginTop: 2 }}>{f.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed sections */}
      {sections.map((section) => (
        <div key={section.label} style={{ marginBottom: 16 }}>
          <h4 style={{ color: section.color, fontSize: 13, marginBottom: 8 }}>
            {section.label}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {section.tests.map((t, i) => (
              <div key={i} style={{
                padding: '6px 10px', background: 'var(--paper-2)',
                borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10,
                borderLeft: `2px solid ${t.result === 'PASS' ? ED.series3 : t.result === 'FAIL' ? ED.series2 : ED.series4}`,
              }}>
                <div style={{ minWidth: 50 }}>{resultBadge(t.result)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink)' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===========================================================================
// Main Component
// ===========================================================================
export default function ProofCheckerViz() {
  const [activeTab, setActiveTab] = useState(0);
  const [numPrimes, setNumPrimes] = useState(12);

  const handleRunFullCheck = useCallback(() => {
    setActiveTab(3);
  }, []);

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{
            color: 'var(--ink-soft)', fontSize: 12, fontFamily: 'var(--font-mono)',
          }}>
            Primes: {numPrimes}
          </label>
          <input
            type="range" min={4} max={20} step={1} value={numPrimes}
            onChange={e => setNumPrimes(Number(e.target.value))}
            style={{ width: 120 }}
          />
        </div>
        <button
          onClick={handleRunFullCheck}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--series-1)',
            background: 'color-mix(in srgb, var(--series-1) 10%, transparent)', color: 'var(--series-1)',
            fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          Run Full Check
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 16,
        borderBottom: '1px solid var(--rule-soft)',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === i ? `2px solid ${TAB_COLORS[i]}` : '2px solid transparent',
              background: 'transparent',
              color: activeTab === i ? TAB_COLORS[i] : 'var(--ink-faint)',
              fontSize: 12,
              fontWeight: activeTab === i ? 600 : 400,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{
        padding: 16, background: 'var(--paper)', borderRadius: 8,
        border: '1px solid var(--rule-soft)',
      }}>
        {activeTab === 0 && <IdentityTestsTab numPrimes={numPrimes} />}
        {activeTab === 1 && <DHCounterexampleTab />}
        {activeTab === 2 && <LogicGapsTab numPrimes={numPrimes} />}
        {activeTab === 3 && <FullReportTab numPrimes={numPrimes} />}
      </div>
    </div>
  );
}
