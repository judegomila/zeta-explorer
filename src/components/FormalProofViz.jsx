import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import {
  PROOF_SECTIONS, proofDependencyGraph, overallProofStatus,
  verifySection, computationalEvidence,
} from '../math/formal-proof.js';

const TABS = ['Proof Map', 'Verification', 'Evidence', 'Gaps'];
const TAB_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const STATUS_COLORS = {
  proven: '#10b981',
  conditional: '#f59e0b',
  gap: '#f97316',
  open: '#ef4444',
};

const STATUS_LABELS = {
  proven: 'Proven',
  conditional: 'Conditional',
  gap: 'Gap',
  open: 'Open',
};

// ─── Tab 1: Proof Map (SVG Dependency Graph) ─────────────────────────────────

function ProofMapTab({ numPrimes }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const svgRef = useRef();

  const graph = useMemo(() => proofDependencyGraph(), []);

  // Layout: arrange nodes in rows by dependency depth
  const layout = useMemo(() => {
    const depths = {};
    const visited = new Set();

    function computeDepth(id) {
      if (visited.has(id)) return depths[id] || 0;
      visited.add(id);
      const section = PROOF_SECTIONS.find(s => s.id === id);
      if (!section || section.dependencies.filter(d => d.startsWith('S')).length === 0) {
        depths[id] = 0;
        return 0;
      }
      let maxDep = 0;
      for (const dep of section.dependencies) {
        if (dep.startsWith('S')) {
          maxDep = Math.max(maxDep, computeDepth(dep) + 1);
        }
      }
      depths[id] = maxDep;
      return maxDep;
    }

    graph.nodes.forEach(n => computeDepth(n.id));

    // Group by depth
    const rows = {};
    let maxDepth = 0;
    graph.nodes.forEach(n => {
      const d = depths[n.id] || 0;
      if (!rows[d]) rows[d] = [];
      rows[d].push(n);
      maxDepth = Math.max(maxDepth, d);
    });

    // Assign positions
    const positions = {};
    const svgWidth = 760;
    const svgHeight = Math.max(400, (maxDepth + 1) * 90 + 60);
    const rowSpacing = svgHeight / (maxDepth + 2);

    for (let d = 0; d <= maxDepth; d++) {
      const row = rows[d] || [];
      const colSpacing = svgWidth / (row.length + 1);
      row.forEach((n, i) => {
        positions[n.id] = {
          x: colSpacing * (i + 1),
          y: rowSpacing * (d + 1),
        };
      });
    }

    return { positions, svgWidth, svgHeight };
  }, [graph]);

  const selectedSection = selectedNode
    ? PROOF_SECTIONS.find(s => s.id === selectedNode)
    : null;

  return (
    <div>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <svg
          ref={svgRef}
          width={layout.svgWidth}
          height={layout.svgHeight}
          style={{ background: '#0a0e1a', borderRadius: 8, border: '1px solid #1e293b', display: 'block', margin: '0 auto' }}
        >
          {/* Marker definition for arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#475569" />
            </marker>
          </defs>

          {/* Edges */}
          {graph.edges.map((e, i) => {
            const from = layout.positions[e.from];
            const to = layout.positions[e.to];
            if (!from || !to) return null;
            // Offset endpoints to node edge
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 1) return null;
            const nx = dx / dist;
            const ny = dy / dist;
            const r = 22;
            return (
              <line
                key={i}
                x1={from.x + nx * r}
                y1={from.y + ny * r}
                x2={to.x - nx * (r + 6)}
                y2={to.y - ny * (r + 6)}
                stroke="#475569"
                strokeWidth={1.5}
                markerEnd="url(#arrowhead)"
                opacity={0.6}
              />
            );
          })}

          {/* Nodes */}
          {graph.nodes.map(n => {
            const pos = layout.positions[n.id];
            if (!pos) return null;
            const color = STATUS_COLORS[n.status];
            const isSelected = selectedNode === n.id;
            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(isSelected ? null : n.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 26 : 22}
                  fill={color + '20'}
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text
                  x={pos.x}
                  y={pos.y - 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {n.id}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 36}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="sans-serif"
                >
                  {n.shortTitle}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          {Object.entries(STATUS_COLORS).map(([status, color], i) => (
            <g key={status} transform={`translate(12, ${12 + i * 18})`}>
              <circle cx={6} cy={6} r={5} fill={color + '30'} stroke={color} strokeWidth={1.5} />
              <text x={16} y={10} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                {STATUS_LABELS[status]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Selected node detail */}
      {selectedSection && (
        <div className="card" style={{
          borderLeft: `3px solid ${STATUS_COLORS[selectedSection.status]}`,
          marginTop: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
              background: STATUS_COLORS[selectedSection.status] + '20',
              color: STATUS_COLORS[selectedSection.status],
              textTransform: 'uppercase',
            }}>{STATUS_LABELS[selectedSection.status]}</span>
            <strong style={{ fontSize: 13, color: '#e2e8f0' }}>
              {selectedSection.id}: {selectedSection.title}
            </strong>
          </div>
          <div style={{ margin: '8px 0' }}>
            <InlineMath tex={selectedSection.statement} />
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, marginTop: 8 }}>
            <strong style={{ color: '#64748b' }}>Proof sketch:</strong>{' '}
            {selectedSection.proof.slice(0, 400)}{selectedSection.proof.length > 400 ? '...' : ''}
          </div>
          {selectedSection.dependencies.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
              <strong>Depends on:</strong>{' '}
              {selectedSection.dependencies.map(d => (
                <span
                  key={d}
                  style={{
                    display: 'inline-block', marginRight: 6, padding: '1px 6px',
                    borderRadius: 3, background: '#1e293b', color: '#e2e8f0',
                    cursor: d.startsWith('S') ? 'pointer' : 'default',
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                  }}
                  onClick={() => d.startsWith('S') && setSelectedNode(d)}
                >
                  {d}
                </span>
              ))}
            </div>
          )}
          <div style={{
            marginTop: 10, padding: '8px 12px', borderRadius: 6,
            background: 'rgba(239,68,68,0.06)', border: '1px solid #ef444430',
            fontSize: 11, color: '#f87171', lineHeight: 1.6,
          }}>
            <strong>Gap analysis:</strong> {selectedSection.gapAnalysis}
          </div>
        </div>
      )}

      {!selectedSection && (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 12, padding: 16 }}>
          Click a node to view section details
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Verification ─────────────────────────────────────────────────────

function VerificationTab({ numPrimes }) {
  const [runningId, setRunningId] = useState(null);
  const [results, setResults] = useState({});

  const handleVerify = useCallback((sectionId) => {
    setRunningId(sectionId);
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = verifySection(sectionId, numPrimes);
      setResults(prev => ({ ...prev, [sectionId]: result }));
      setRunningId(null);
    }, 50);
  }, [numPrimes]);

  const handleVerifyAll = useCallback(() => {
    setRunningId('all');
    setTimeout(() => {
      const allResults = {};
      for (const s of PROOF_SECTIONS) {
        allResults[s.id] = verifySection(s.id, numPrimes);
      }
      setResults(allResults);
      setRunningId(null);
    }, 50);
  }, [numPrimes]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          className="filter-btn active"
          onClick={handleVerifyAll}
          disabled={runningId !== null}
          style={{ fontSize: 11 }}
        >
          {runningId === 'all' ? 'Running...' : 'Verify All Sections'}
        </button>
      </div>

      <div style={{ maxHeight: 600, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 11, color: '#94a3b8', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', position: 'sticky', top: 0, background: '#0f172a' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#e2e8f0' }}>Section</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#e2e8f0' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#e2e8f0' }}>Pass</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#e2e8f0' }}>Fail</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#e2e8f0' }}>N/A</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#e2e8f0' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {PROOF_SECTIONS.map(section => {
              const r = results[section.id];
              const statusColor = STATUS_COLORS[section.status];
              return (
                <tr key={section.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '6px 8px' }}>
                    <span style={{ color: statusColor, fontWeight: 700, fontFamily: 'var(--font-mono)', marginRight: 6 }}>
                      {section.id}
                    </span>
                    {section.title.length > 30 ? section.title.slice(0, 27) + '...' : section.title}
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                      background: statusColor + '20', color: statusColor,
                      textTransform: 'uppercase',
                    }}>{STATUS_LABELS[section.status]}</span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 8px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {r ? r.summary.passCount : '-'}
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 8px', color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
                    {r ? r.summary.failCount : '-'}
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 8px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {r ? r.summary.naCount : '-'}
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                    <button
                      className="filter-btn"
                      onClick={() => handleVerify(section.id)}
                      disabled={runningId !== null}
                      style={{ fontSize: 9, padding: '3px 8px' }}
                    >
                      {runningId === section.id ? '...' : 'Run'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel for the most recently verified section */}
      {Object.keys(results).length > 0 && (() => {
        // Show the last section that was verified individually, or all
        const lastId = Object.keys(results).slice(-1)[0];
        const r = results[lastId];
        if (!r || !r.tests) return null;
        return (
          <div className="card" style={{ marginTop: 16, borderLeft: '3px solid #3b82f6' }}>
            <h4 style={{ color: '#3b82f6', fontSize: 12, marginBottom: 8 }}>
              {r.sectionId}: {r.title} — Test Details
            </h4>
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: 10, color: '#94a3b8', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    <th style={{ textAlign: 'left', padding: '3px 6px' }}>Test</th>
                    <th style={{ textAlign: 'center', padding: '3px 6px' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {r.tests.slice(0, 20).map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)' }}>{t.test}</td>
                      <td style={{ textAlign: 'center', padding: '3px 6px' }}>
                        {t.pass === true && <span style={{ color: '#10b981', fontWeight: 700 }}>PASS</span>}
                        {t.pass === false && <span style={{ color: '#ef4444', fontWeight: 700 }}>FAIL</span>}
                        {t.pass === null && <span style={{ color: '#64748b' }}>N/A</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Tab 3: Evidence (Charts) ────────────────────────────────────────────────

function EvidenceTab({ numPrimes, numZeros }) {
  const liCanvasRef = useRef();
  const hamiltonianCanvasRef = useRef();
  const zeroCanvasRef = useRef();

  const evidence = useMemo(
    () => computationalEvidence(numZeros, numPrimes),
    [numZeros, numPrimes]
  );

  // ── Li Coefficients Bar Chart ──
  const drawLi = useCallback(() => {
    const canvas = liCanvasRef.current;
    if (!canvas || !evidence.liCoefficients) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 45, right: 15, top: 24, bottom: 32 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const lambdas = evidence.liCoefficients.lambdas;
    if (lambdas.length === 0) return;

    const logValues = lambdas.map(l => l.logLambda !== null ? l.logLambda : -10);
    const minLog = Math.min(...logValues) - 0.5;
    const maxLog = Math.max(...logValues) + 0.5;
    const yRange = maxLog - minLog || 1;

    // Zero line
    const zeroY = h - margin.bottom - (0 - minLog) / yRange * plotH;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(w - margin.right, zeroY);
    ctx.strokeStyle = '#ef444460';
    ctx.stroke();
    ctx.setLineDash([]);

    // Bars
    const barW = Math.min(plotW / lambdas.length * 0.7, 24);
    lambdas.forEach((l, i) => {
      const x = margin.left + (i + 0.5) / lambdas.length * plotW;
      const logVal = l.logLambda !== null ? l.logLambda : -10;
      const barH = (logVal - minLog) / yRange * plotH;
      const barY = h - margin.bottom - barH;
      ctx.fillStyle = l.positive ? '#10b981' : '#ef4444';
      ctx.fillRect(x - barW / 2, barY, barW, barH);

      if (i % Math.max(1, Math.floor(lambdas.length / 10)) === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'center';
        ctx.fillText(`${l.n}`, x, h - margin.bottom + 12);
      }
    });

    // Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Li Coefficients log(lambda_n)', margin.left, margin.top - 8);

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = minLog + (i / 4) * yRange;
      const y = h - margin.bottom - (i / 4) * plotH;
      ctx.fillText(val.toFixed(1), margin.left - 4, y + 3);
    }
  }, [evidence]);

  // ── Hamiltonian Convexity Plot ──
  const drawHamiltonian = useCallback(() => {
    const canvas = hamiltonianCanvasRef.current;
    if (!canvas || !evidence.hamiltonianConvexity) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 45, right: 15, top: 24, bottom: 32 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const results = evidence.hamiltonianConvexity.results;
    if (results.length === 0) return;

    const tValues = results.map(r => r.t);
    const d2Values = results.map(r => r.d2H_dSigma2);
    const minT = Math.min(...tValues);
    const maxT = Math.max(...tValues);
    const maxD2 = Math.max(...d2Values.map(Math.abs), 1);

    // Zero line
    const midY = margin.top + plotH / 2;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(margin.left, midY);
    ctx.lineTo(w - margin.right, midY);
    ctx.strokeStyle = '#47556980';
    ctx.stroke();
    ctx.setLineDash([]);

    // d2H/dsigma2 curve
    ctx.beginPath();
    results.forEach((r, i) => {
      const x = margin.left + ((r.t - minT) / (maxT - minT || 1)) * plotW;
      const y = midY - (r.d2H_dSigma2 / maxD2) * plotH * 0.4;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    results.forEach(r => {
      const x = margin.left + ((r.t - minT) / (maxT - minT || 1)) * plotW;
      const y = midY - (r.d2H_dSigma2 / maxD2) * plotH * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = r.isMinimum ? '#10b981' : '#f59e0b';
      ctx.fill();
    });

    // Title
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Hamiltonian d^2H/dsigma^2 (convexity)', margin.left, margin.top - 8);

    // X label
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('t (imaginary part)', w / 2, h - 4);
  }, [evidence]);

  // ── Zero Deviation Scatter ──
  const drawZeros = useCallback(() => {
    const canvas = zeroCanvasRef.current;
    if (!canvas || !evidence.zeroDeviation) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 45, right: 15, top: 24, bottom: 32 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const zeros = evidence.zeroDeviation.zeros;
    if (zeros.length === 0) return;

    const gammas = zeros.map(z => z.gamma);
    const mags = zeros.map(z => z.zetaMag);
    const minG = Math.min(...gammas);
    const maxG = Math.max(...gammas);
    const maxMag = Math.max(...mags, 0.5);

    // Threshold line at |zeta| = 0.5
    const threshY = h - margin.bottom - (0.5 / maxMag) * plotH * 0.85;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(margin.left, threshY);
    ctx.lineTo(w - margin.right, threshY);
    ctx.strokeStyle = '#f59e0b60';
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('|zeta| = 0.5', margin.left + 4, threshY - 4);

    // Scatter points
    zeros.forEach(z => {
      const x = margin.left + ((z.gamma - minG) / (maxG - minG || 1)) * plotW;
      const y = h - margin.bottom - (z.zetaMag / maxMag) * plotH * 0.85;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = z.onLine ? '#10b981' : '#ef4444';
      ctx.fill();
    });

    // Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('|zeta(1/2 + i*gamma)| at known zeros', margin.left, margin.top - 8);

    // X label
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('gamma (zero location)', w / 2, h - 4);
  }, [evidence]);

  useEffect(() => { drawLi(); }, [drawLi]);
  useEffect(() => { drawHamiltonian(); }, [drawHamiltonian]);
  useEffect(() => { drawZeros(); }, [drawZeros]);

  // Redraw all canvases on window resize to prevent blurry/distorted display
  useEffect(() => {
    const handleResize = () => { drawLi(); drawHamiltonian(); drawZeros(); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawLi, drawHamiltonian, drawZeros]);

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <div style={{
          padding: '10px 12px', borderRadius: 8, background: '#0a0e1a',
          border: `1px solid ${evidence.liCoefficients?.allPositive ? '#10b981' : '#ef4444'}40`,
        }}>
          <div style={{
            color: evidence.liCoefficients?.allPositive ? '#10b981' : '#ef4444',
            fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)',
          }}>
            {evidence.liCoefficients?.allPositive ? 'ALL > 0' : 'FAIL'}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>Li Coefficients</div>
        </div>
        <div style={{
          padding: '10px 12px', borderRadius: 8, background: '#0a0e1a',
          border: `1px solid ${evidence.hamiltonianConvexity?.allMinima ? '#10b981' : '#f59e0b'}40`,
        }}>
          <div style={{
            color: evidence.hamiltonianConvexity?.allMinima ? '#10b981' : '#f59e0b',
            fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)',
          }}>
            {evidence.hamiltonianConvexity?.allMinima ? 'CONVEX' : 'PARTIAL'}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>H Convexity</div>
        </div>
        <div style={{
          padding: '10px 12px', borderRadius: 8, background: '#0a0e1a',
          border: `1px solid ${evidence.zeroDeviation?.allOnLine ? '#10b981' : '#ef4444'}40`,
        }}>
          <div style={{
            color: evidence.zeroDeviation?.allOnLine ? '#10b981' : '#ef4444',
            fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)',
          }}>
            {evidence.zeroDeviation?.onLineCount ?? 0}/{evidence.zeroDeviation?.count || 0}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>Zeros on line</div>
        </div>
        <div style={{
          padding: '10px 12px', borderRadius: 8, background: '#0a0e1a',
          border: `1px solid ${evidence.bridgeUnitarity?.allUnitary ? '#10b981' : '#f59e0b'}40`,
        }}>
          <div style={{
            color: evidence.bridgeUnitarity?.allUnitary ? '#10b981' : '#f59e0b',
            fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)',
          }}>
            {evidence.bridgeUnitarity?.allUnitary ? '|chi|=1' : 'APPROX'}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>Bridge unitarity</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <canvas
          ref={liCanvasRef}
          style={{ width: '100%', height: 200, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
        />
        <canvas
          ref={hamiltonianCanvasRef}
          style={{ width: '100%', height: 200, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
        />
        <canvas
          ref={zeroCanvasRef}
          style={{ width: '100%', height: 200, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
        />
      </div>
    </div>
  );
}

// ─── Tab 4: Gaps ─────────────────────────────────────────────────────────────

function GapsTab() {
  const gaps = PROOF_SECTIONS.filter(s => s.status === 'gap' || s.status === 'open');
  const conditionals = PROOF_SECTIONS.filter(s => s.status === 'conditional');

  const severityOrder = { open: 0, gap: 1, conditional: 2 };
  const allIssues = [...gaps, ...conditionals].sort(
    (a, b) => (severityOrder[a.status] || 3) - (severityOrder[b.status] || 3)
  );

  return (
    <div>
      {/* Severity summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16,
      }}>
        <div style={{
          padding: '12px 14px', borderRadius: 8, background: '#0a0e1a',
          border: '1px solid #ef444440',
        }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-mono)' }}>
            {PROOF_SECTIONS.filter(s => s.status === 'open').length}
          </div>
          <div style={{ color: '#ef4444', fontSize: 11, fontWeight: 600 }}>Open Problems</div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>
            No known path to resolution
          </div>
        </div>
        <div style={{
          padding: '12px 14px', borderRadius: 8, background: '#0a0e1a',
          border: '1px solid #f9731640',
        }}>
          <div style={{ color: '#f97316', fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-mono)' }}>
            {PROOF_SECTIONS.filter(s => s.status === 'gap').length}
          </div>
          <div style={{ color: '#f97316', fontSize: 11, fontWeight: 600 }}>Critical Gaps</div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>
            Specific obstacles identified
          </div>
        </div>
        <div style={{
          padding: '12px 14px', borderRadius: 8, background: '#0a0e1a',
          border: '1px solid #f59e0b40',
        }}>
          <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-mono)' }}>
            {PROOF_SECTIONS.filter(s => s.status === 'conditional').length}
          </div>
          <div style={{ color: '#f59e0b', fontSize: 11, fontWeight: 600 }}>Conditional Steps</div>
          <div style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>
            Depend on unproven hypotheses
          </div>
        </div>
      </div>

      {/* Gap details */}
      {allIssues.map(section => {
        const color = STATUS_COLORS[section.status];
        const severity = section.status === 'open'
          ? 'CRITICAL — Open Problem'
          : section.status === 'gap'
            ? 'HIGH — Specific Gap'
            : 'MODERATE — Conditional';
        return (
          <div
            key={section.id}
            className="card"
            style={{
              marginBottom: 10, borderLeft: `3px solid ${color}`,
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: color + '20', color,
                textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
              }}>{section.id}</span>
              <strong style={{ fontSize: 12, color: '#e2e8f0' }}>{section.title}</strong>
              <span style={{
                marginLeft: 'auto', fontSize: 9, fontWeight: 600,
                color, opacity: 0.8,
              }}>{severity}</span>
            </div>

            <div style={{
              fontSize: 11, color: '#f87171', lineHeight: 1.7,
              padding: '8px 12px', borderRadius: 6,
              background: 'rgba(239,68,68,0.05)', border: '1px solid #ef444420',
            }}>
              {section.gapAnalysis}
            </div>

            {section.references.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 10, color: '#64748b' }}>
                <strong>Key references:</strong>{' '}
                {section.references.slice(0, 3).join(' | ')}
              </div>
            )}
          </div>
        );
      })}

      {/* Critical path */}
      <div className="card" style={{ marginTop: 16, borderColor: '#8b5cf6', borderWidth: 2 }}>
        <h4 style={{ color: '#8b5cf6', fontSize: 13, marginBottom: 8 }}>
          Critical Path to Completion
        </h4>
        <ol style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#f97316' }}>S5 (Hilbert-Polya):</strong> Construct a self-adjoint
            operator whose eigenvalues are the zeta zeros. This is the most direct route but
            requires new mathematics.
          </li>
          <li>
            <strong style={{ color: '#f97316' }}>S7 (Darlington):</strong> Prove the ZPO twin-ladder
            is an exact Darlington synthesis for an infinite analytically-continued network.
            Requires extending classical circuit theory.
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>S8 (Confinement):</strong> Either S5 or S7 would
            unlock this step, confining all zeros to Re(s) = 1/2.
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>S10 (Completeness):</strong> Combining S8 with the
            known zero-free region would complete the proof.
          </li>
        </ol>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FormalProofViz() {
  const [tab, setTab] = useState(0);
  const [numPrimes, setNumPrimes] = useState(10);
  const [numZeros, setNumZeros] = useState(20);

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map((label, i) => (
          <button
            key={label}
            className={`filter-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
            style={{
              fontSize: 11,
              borderColor: tab === i ? TAB_COLORS[i] : undefined,
              color: tab === i ? TAB_COLORS[i] : undefined,
              background: tab === i ? TAB_COLORS[i] + '15' : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="viz-controls" style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>Primes</label>
          <input
            type="range" min="4" max="20" step="1"
            value={numPrimes}
            onChange={e => setNumPrimes(+e.target.value)}
          />
          <span className="control-value">{numPrimes}</span>
        </div>
        {(tab === 2 || tab === 1) && (
          <div className="control-group">
            <label>Zeros</label>
            <input
              type="range" min="5" max="100" step="5"
              value={numZeros}
              onChange={e => setNumZeros(+e.target.value)}
            />
            <span className="control-value">{numZeros}</span>
          </div>
        )}
      </div>

      {/* Tab explainers */}
      {tab === 0 && (
        <div className="tab-explainer accent-green">
          <strong>Proof Map:</strong> Dependency graph of the ZPO proof sections. Each node is a proof step
          (S1–S9) colored by status: <span style={{ color: '#10b981' }}>proven</span>, <span style={{ color: '#f59e0b' }}>conditional</span>,
          or <span style={{ color: '#ef4444' }}>open</span>. Arrows show logical dependencies — a section
          cannot be fully established until all its prerequisites are resolved.
          <strong> Click a node</strong> to see its description and dependencies.
        </div>
      )}
      {tab === 1 && (
        <div className="tab-explainer accent-blue">
          <strong>Verification:</strong> Run numerical checks on each proof section. Each section has a set of
          test assertions (e.g. Hamiltonian convexity, bridge unitarity, Li positivity) that are evaluated
          with the current number of primes and zeros.
          <strong> Look for:</strong> which sections pass all checks vs. which have failing assertions — failures indicate
          where the proof's claims don't hold numerically.
        </div>
      )}
      {tab === 2 && (
        <div className="tab-explainer accent-yellow">
          <strong>Evidence:</strong> Three diagnostic charts showing computational evidence for the ZPO model:
          Li coefficient positivity, Hamiltonian minimization at <InlineMath tex="\sigma = \tfrac{1}{2}" />,
          and zero confinement to the critical line. These support but do not prove the formal claims.
          <strong> Look for:</strong> how the evidence strengthens as you increase the number of primes and zeros.
        </div>
      )}
      {tab === 3 && (
        <div className="tab-explainer accent-red">
          <strong>Gaps:</strong> Catalog of unresolved proof gaps and conditional steps. Each entry describes
          what remains to be shown and why it matters for the overall argument. These are the hardest
          parts — analytic continuation of the cascade (S4), Hilbert–Polya operator construction (S5),
          and Darlington synthesis (S7).
          <strong> Look for:</strong> severity rankings and which gaps block the most downstream conclusions.
        </div>
      )}

      {/* Tab content */}
      {tab === 0 && <ProofMapTab numPrimes={numPrimes} />}
      {tab === 1 && <VerificationTab numPrimes={numPrimes} />}
      {tab === 2 && <EvidenceTab numPrimes={numPrimes} numZeros={numZeros} />}
      {tab === 3 && <GapsTab />}
    </div>
  );
}
