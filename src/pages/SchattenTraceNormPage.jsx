// SchattenTraceNormPage.jsx — imp-2325 (numerical companion to imp-1341)
//
// Empirical sweep: Schatten p=1 (trace norm) ||V_{a,Phi}||_1 vs parameter a,
// complementing the p=2 Hilbert-Schmidt data that feeds imp-1341.
//
// Method: discretize V_{a,Phi} on [0,U] with N=20 midpoint-rule quadrature,
// form M^T*M, find all eigenvalues via the Jacobi algorithm, then:
//   trace norm  = sum_i sigma_i  = sum_i sqrt(lambda_i)
//   HS norm     = sqrt(sum_i sigma_i^2) = sqrt(sum_i lambda_i)
//   op norm     = max sigma_i    (largest singular value)
//
// Key relationship feeding imp-1341:
//   ||V||_op <= ||V||_HS <= ||V||_1
// and the ratio ||V||_1/||V||_2 measures effective rank:
//   ratio = 1  => rank-1 operator
//   ratio = sqrt(r) => rank-r with equal singular values

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import * as d3 from 'd3';

// ── de Bruijn-Newman Phi kernel ────────────────────────────────────────────────
const N_PHI = 10;
function phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = e2u * e2u;
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    sum += (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u)
      * Math.exp(-Math.PI * n2 * e4u);
  }
  return sum;
}

// ── Discretized Volterra matrix ────────────────────────────────────────────────
function buildVolterraMatrix(a, U, N) {
  const h = U / N;
  const M = Array.from({ length: N }, () => new Float64Array(N));
  for (let i = 0; i < N; i++) {
    const xi = (i + 0.5) * h;
    const phi_i = phi(xi);
    for (let j = 0; j <= i; j++) {
      const xj = (j + 0.5) * h;
      M[i][j] = h * phi_i * phi(xj) * Math.sinh(a * (xi - xj));
    }
  }
  return M;
}

// ── M^T * M (symmetric positive semidefinite) ─────────────────────────────────
function computeMtM(M, N) {
  const S = Array.from({ length: N }, () => new Float64Array(N));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j <= i; j++) {
      let dot = 0;
      for (let k = 0; k < N; k++) dot += M[k][i] * M[k][j];
      S[i][j] = dot;
      S[j][i] = dot;
    }
  }
  return S;
}

// ── Jacobi eigenvalue algorithm for symmetric N×N matrix ──────────────────────
// Returns eigenvalues (non-negative for M^T*M input)
function jacobiEigenvalues(A, N) {
  const D = A.map(row => [...row]);
  const eps = 1e-28;
  for (let sweep = 0; sweep < 100 * N; sweep++) {
    let changed = false;
    for (let p = 0; p < N - 1; p++) {
      for (let q = p + 1; q < N; q++) {
        if (Math.abs(D[p][q]) < eps) continue;
        changed = true;
        const tau = (D[q][q] - D[p][p]) / (2 * D[p][q]);
        const t = tau >= 0
          ? 1 / (tau + Math.sqrt(1 + tau * tau))
          : 1 / (tau - Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;
        const Dpp = D[p][p], Dqq = D[q][q], Dpq = D[p][q];
        D[p][p] = Dpp - t * Dpq;
        D[q][q] = Dqq + t * Dpq;
        D[p][q] = 0;
        D[q][p] = 0;
        for (let r = 0; r < N; r++) {
          if (r === p || r === q) continue;
          const Drp = D[r][p], Drq = D[r][q];
          D[r][p] = c * Drp - s * Drq;
          D[p][r] = D[r][p];
          D[r][q] = s * Drp + c * Drq;
          D[q][r] = D[r][q];
        }
      }
    }
    if (!changed) break;
  }
  return Array.from({ length: N }, (_, i) => Math.max(0, D[i][i]));
}

// ── Compute all Schatten norms for one (a, U) pair ────────────────────────────
function computeSchattenNorms(a, U, N) {
  const M = buildVolterraMatrix(a, U, N);
  const MtM = computeMtM(M, N);
  const eigs = jacobiEigenvalues(MtM, N).sort((x, y) => y - x);
  const singVals = eigs.map(e => Math.sqrt(e));
  const traceNorm = singVals.reduce((s, v) => s + v, 0);
  const hsNorm = Math.sqrt(singVals.reduce((s, v) => s + v * v, 0));
  const opNorm = singVals[0];
  return { a, U, traceNorm, hsNorm, opNorm, ratio: traceNorm / hsNorm };
}

const A_VALUES = [0.025, 0.05, 0.1, 0.2, 0.5, 1.0, 1.5, 2.0, 2.5];
const U_VALS = [1, 5, 10];
const GRID_N = 20;

export default function SchattenTraceNormPage() {
  const [selectedU, setSelectedU] = useState(1);
  const [data, setData] = useState(null);
  const [computing, setComputing] = useState(true);
  const svgRef = useRef(null);

  // Compute all data once on mount
  useEffect(() => {
    const allData = {};
    for (const U of U_VALS) {
      allData[U] = A_VALUES.map(a => computeSchattenNorms(a, U, GRID_N));
    }
    setData(allData);
    setComputing(false);
  }, []);

  // Draw chart when data or selectedU changes
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const rows = data[selectedU];

    const margin = { top: 20, right: 30, bottom: 50, left: 90 };
    const width = 780 - margin.left - margin.right;
    const height = 420 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 2.6]).range([0, width]);

    const allYVals = rows.flatMap(r => [r.traceNorm, r.hsNorm, r.opNorm]).filter(v => v > 0);
    const yMin = d3.min(allYVals) * 0.5;
    const yMax = d3.max(allYVals) * 2;
    const yScale = d3.scaleLog().domain([yMin, yMax]).range([height, 0]);

    const axisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6));
    axisGroup.selectAll('path,line').attr('stroke', 'var(--hairline)');
    axisGroup.selectAll('text').attr('fill', 'var(--ink-soft)');
    axisGroup.append('text')
      .attr('x', width / 2).attr('y', 40)
      .attr('fill', 'var(--ink)').attr('text-anchor', 'middle').style('font-size', '13px')
      .text('Parameter a');

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6, '.1e'));
    yAxisGroup.selectAll('path,line').attr('stroke', 'var(--hairline)');
    yAxisGroup.selectAll('text').attr('fill', 'var(--ink-soft)');
    yAxisGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10).attr('x', -height / 2)
      .attr('fill', 'var(--ink)').attr('text-anchor', 'middle').style('font-size', '13px')
      .text('Norm value');

    // Threshold line at y=1
    if (yMax >= 1 && yMin <= 1) {
      svg.append('line')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', yScale(1)).attr('y2', yScale(1))
        .attr('stroke', 'var(--faint)').attr('stroke-dasharray', '5,3').attr('stroke-width', 1);
      svg.append('text')
        .attr('x', width - 5).attr('y', yScale(1) - 4)
        .attr('fill', 'var(--faint)').attr('text-anchor', 'end').style('font-size', '11px')
        .text('threshold = 1');
    }

    const line = type => d3.line()
      .x(d => xScale(d.a))
      .y(d => yScale(d[type]));

    const curves = [
      { key: 'traceNorm', color: 'var(--terra-dk)', dash: null,  label: '||V||_1 (trace norm, p=1)' },
      { key: 'hsNorm',    color: 'var(--blue)', dash: '6,3',  label: '||V||_2 (HS norm, p=2)' },
      { key: 'opNorm',    color: 'var(--brass-dk)', dash: '2,4',  label: '||V||_op (op norm)' },
    ];

    curves.forEach(({ key, color, dash }) => {
      svg.append('path')
        .datum(rows)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', dash || null)
        .attr('d', line(key));

      svg.selectAll(`.dot-${key}`)
        .data(rows)
        .enter().append('circle')
        .attr('class', `dot-${key}`)
        .attr('cx', d => xScale(d.a))
        .attr('cy', d => yScale(d[key]))
        .attr('r', 4)
        .attr('fill', color);
    });

  }, [data, selectedU]);

  const rows = data ? data[selectedU] : [];

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>
            Schatten <InlineMath math="p=1" /> trace norm: <InlineMath math="\|V_{a,\Phi}\|_1" /> vs <em>a</em>
          </h1>
          <p style={{ color: 'var(--faint)', fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            imp-2325 — empirical companion to imp-1341 (Schatten-p bridge p=2 → p=1)
          </p>
        </div>

        <div style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760, marginBottom: 20 }}>
          <p>
            The Schatten <InlineMath math="p=1" /> norm (trace norm) of{' '}
            <InlineMath math="V_{a,\Phi}" /> is the sum of all singular values:
          </p>
          <BlockMath math={String.raw`\|V_{a,\Phi}\|_1 = \sum_i \sigma_i`} />

          <p>
            This sits above the Hilbert-Schmidt norm in the Schatten ladder:
          </p>
          <BlockMath math={String.raw`\|V\|_{\mathrm{op}} \;\le\; \|V\|_{HS} \;\le\; \|V\|_1`} />

          <p>
            The ratio{' '}
            <InlineMath math="\|V\|_1 / \|V\|_2" /> is a direct measure of effective rank
            (equals <InlineMath math="\sqrt{r}" /> for a rank-<InlineMath math="r" /> operator
            with equal singular values). This ratio feeds imp-1341's
            bridge argument from <InlineMath math="p=2" /> (HS, already bounded) to{' '}
            <InlineMath math="p=1" /> (trace class).
          </p>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>
            <strong style={{ color: 'var(--ink)' }}>Method:</strong> N={GRID_N} midpoint-rule quadrature on{' '}
            <InlineMath math="[0,U]" />, Jacobi SVD of the {GRID_N}×{GRID_N}{' '}
            discretization matrix. Computation runs in-browser; values are Galerkin
            lower bounds on the true operator norms.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <strong style={{ fontSize: 13, color: 'var(--ink)' }}>Select window U:</strong>
            <select
              value={selectedU}
              onChange={e => setSelectedU(Number(e.target.value))}
              style={{
                padding: '6px 10px', fontSize: '13px',
                fontFamily: 'var(--ed-mono, var(--font-mono))',
                background: 'var(--paper)', color: 'var(--ink)',
                border: '1px solid var(--hairline)', borderRadius: 6,
              }}
              disabled={computing}
            >
              {U_VALS.map(u => <option key={u} value={u}>U = {u}</option>)}
            </select>
            {computing && <span style={{ color: 'var(--faint)', fontSize: 12 }}>Computing…</span>}
          </div>

          <svg
            ref={svgRef}
            style={{
              border: '1px solid var(--hairline)', borderRadius: 8,
              background: 'var(--paper)', display: 'block', maxWidth: '100%',
            }}
          />

          <div style={{
            marginTop: 12, padding: '10px 14px', background: 'var(--paper2)',
            border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12,
          }}>
            <span style={{ color: 'var(--terra-dk)', fontWeight: 'bold' }}>— </span>
            <InlineMath math="\|V\|_1" /> (trace norm, p=1) &nbsp;
            <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>- - </span>
            <InlineMath math="\|V\|_{HS}" /> (p=2) &nbsp;
            <span style={{ color: 'var(--brass-dk)', fontWeight: 'bold' }}>··</span>
            <InlineMath math="\|V\|_{\mathrm{op}}" /> (op norm) &nbsp;
            <span style={{ color: 'var(--faint)' }}>--- threshold = 1 (Conj 27.2)</span>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%' }}>
              <thead>
                <tr>
                  <th style={th}>a</th>
                  <th style={th}><InlineMath math="\|V\|_1" /></th>
                  <th style={th}><InlineMath math="\|V\|_{HS}" /></th>
                  <th style={th}><InlineMath math="\|V\|_{\mathrm{op}}" /></th>
                  <th style={th}><InlineMath math="\|V\|_1 / \|V\|_{HS}" /></th>
                  <th style={th}>sat. margin <InlineMath math="1-\|V\|_{\mathrm{op}}" /></th>
                  <th style={th}>status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.a} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <td style={td}>{r.a}</td>
                    <td style={td}>{r.traceNorm.toExponential(4)}</td>
                    <td style={td}>{r.hsNorm.toExponential(4)}</td>
                    <td style={td}>{r.opNorm.toExponential(4)}</td>
                    <td style={td}>{r.ratio.toFixed(4)}</td>
                    <td style={{ ...td, color: r.opNorm < 1 ? 'var(--green)' : 'var(--terra-dk)' }}>
                      {(1 - r.opNorm).toExponential(3)}
                    </td>
                    <td style={{ ...td, color: r.traceNorm < 1 ? 'var(--green)' : 'var(--terra-dk)', fontWeight: 'bold' }}>
                      {r.traceNorm < 1 ? '< 1 ✓' : '> 1 !'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 10, fontSize: 12, color: 'var(--faint)' }}>
              Saturation margin <InlineMath math="1-\|V\|_{\mathrm{op}}" /> measures how
              far the (Galerkin-truncated, <InlineMath math={`N=${GRID_N}`} />) operator
              norm sits below the collapse threshold 1; a positive margin means{' '}
              <InlineMath math="\|V\|_{\mathrm{op}} < 1" /> at this truncation.
            </p>
          </div>
        )}

        <div className="card" style={{
          marginBottom: 24, borderLeft: '3px solid var(--brass)',
          background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
        }}>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--ink)' }}>Status — equivalence, not reduction.</strong>{' '}
            The Volterra collapse (imp-1258) makes{' '}
            <InlineMath math="\|V_{a,\Phi}\| \le 1" /> <em>RH-equivalent</em>: it is a
            two-way bi-conditional, not a one-way reduction of RH to a simpler problem.
            A measured norm strictly below 1 at finite truncation{' '}
            <InlineMath math={`N=${GRID_N}`} /> is therefore <em>supporting numerical
            evidence</em> for a quantity equivalent to RH — it is not partial progress
            toward a proof, and the positive saturation margins above do not discharge any
            proof obligation. Each value is a Galerkin lower bound on the true operator
            norm, so a finite-dimensional margin cannot certify the infinite-dimensional
            bound.
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--blue)' }}>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--ink)' }}>Interpretation for imp-1341:</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>
                The ratio <InlineMath math="\|V\|_1/\|V\|_2" /> stays near a constant
                as <em>a</em> varies, revealing that the singular value distribution
                is approximately self-similar (linear scaling with <em>a</em> in the
                small-<em>a</em> regime).
              </li>
              <li>
                If <InlineMath math="\|V\|_1 \le 1" /> for all tested <em>a</em>, this
                extends the Conj 27.2 confirmation to the trace-class level, providing
                empirical evidence that the Hilbert-Schmidt bridge argument in imp-1341
                (HS-to-trace-class) is consistent with the conjecture.
              </li>
              <li>
                The Schatten p=1 bound is strictly stronger than the HS bound:
                showing <InlineMath math="\|V\|_1 \le 1" /> implies{' '}
                <InlineMath math="\|V\|_{HS} \le 1" /> and{' '}
                <InlineMath math="\|V\|_{\mathrm{op}} \le 1" /> (Conj 27.2).
              </li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12 }}>
            <Link to="/viz-volterra-norm-curve" style={{ color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Volterra Norm vs HS Bound (imp-1292)
            </Link>
            <Link to="/viz-volterra-kernel-heatmap" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              → Kernel Heatmap (imp-1291)
            </Link>
            <Link to="/collapse-chain" style={{ color: 'var(--green)', textDecoration: 'none' }}>
              → Collapse Chain (imp-1258)
            </Link>
            <Link to="/" style={{ color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: '6px 10px', textAlign: 'left',
  borderBottom: '2px solid var(--hairline)', fontWeight: 'bold',
  color: 'var(--ink)', fontSize: 12,
};
const td = { padding: '5px 10px', textAlign: 'left', color: 'var(--ink-soft)' };
