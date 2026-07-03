import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { getAllExplorations } from '../data/explorations.js';
import { getAllReferences } from '../data/literature.js';
import { PAPER_AUDIT_DASHBOARD } from '../data/paper-audit-dashboard.js';
import InsightDAG from '../components/InsightDAG.jsx';
import HeroSignalFlow from '../components/HeroSignalFlow.jsx';

/* ─── Inline SVG diagrams for model build-up ─── */

function SinglePrimeDiagram() {
  // Energy levels for the harmonic oscillator
  const levels = [
    { k: 0, label: '1',       color: '#94a3b8' },
    { k: 1, label: 'p\u207b\u02e2',    color: '#60a5fa' },
    { k: 2, label: 'p\u207b\u00b2\u02e2',   color: '#818cf8' },
    { k: 3, label: 'p\u207b\u00b3\u02e2',   color: '#a78bfa' },
    { k: 4, label: 'p\u207b\u2074\u02e2',   color: '#c4b5fd' },
  ];
  const wellX = 60, wellW = 160, wellCX = wellX + wellW / 2;
  const levelStartY = 198, levelSpacing = 36;

  return (
    <svg viewBox="0 0 520 260" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '16px auto' }}>
      <defs>
        <marker id="arrowGrayS" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#64748b" />
        </marker>
        <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#3b82f6" />
        </marker>
        <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Title */}
      <text x="260" y="14" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="var(--font-mono)">
        PRIME HARMONIC OSCILLATOR — DIRICHLET SERIES TERMS
      </text>

      {/* ════════ LEFT: Potential well + energy levels ════════ */}
      <rect x={wellX - 10} y="22" width={wellW + 20} height="230" rx="10"
            fill="rgba(59,130,246,0.03)" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,3" />

      {/* Parabolic potential well */}
      <path d={`M${wellX},30 Q${wellCX},220 ${wellX + wellW},30`}
            fill="url(#wellGrad)" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />

      {/* Energy levels */}
      {levels.map((lev, i) => {
        const y = levelStartY - i * levelSpacing;
        // Width narrows as we go up the well (parabolic shape)
        const halfW = wellW / 2 - i * 8;
        const x1 = wellCX - halfW;
        const x2 = wellCX + halfW;
        return (
          <React.Fragment key={`level-${lev.k}`}>
            {/* Energy line */}
            <line x1={x1} y1={y} x2={x2} y2={y}
                  stroke={lev.color} strokeWidth={i === 0 ? 2.5 : 1.8} />
            {/* k label (left) */}
            <text x={x1 - 8} y={y + 4} textAnchor="end" fill="#475569" fontSize="9" fontFamily="var(--font-mono)">
              k={lev.k}
            </text>
            {/* Dirichlet term (on the line) */}
            <text x={wellCX} y={y - 4} textAnchor="middle" fill={lev.color}
                  fontSize={i === 0 ? 11 : 10} fontWeight="600" fontFamily="var(--font-mono)">
              {lev.label}
            </text>
          </React.Fragment>
        );
      })}

      {/* Energy axis label */}
      <text x={wellX - 16} y={levelStartY - 2 * levelSpacing} textAnchor="middle" fill="#475569" fontSize="9"
            fontFamily="var(--font-mono)" transform={`rotate(-90,${wellX - 16},${levelStartY - 2 * levelSpacing})`}>
        E_k = k{'\u00B7'}log(p)
      </text>

      {/* Prime badge inside well */}
      <circle cx={wellCX} cy={levelStartY + 16} r="12" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      <text x={wellCX} y={levelStartY + 20} textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">p</text>

      {/* Well label */}
      <text x={wellCX} y={levelStartY + 38} textAnchor="middle" fill="#475569" fontSize="8" fontFamily="var(--font-mono)">
        V(x) = {'\u00BD'}k{'\u00B7'}x{'\u00B2'}
      </text>

      {/* ════════ CENTER: Summation arrow ════════ */}
      <line x1={wellX + wellW + 20} y1="125" x2={wellX + wellW + 55} y2="125"
            stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowGrayS)" />

      {/* Sigma symbol */}
      <text x={wellX + wellW + 38} y="115" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)">
        {'\u03A3'}
      </text>
      <text x={wellX + wellW + 38} y="145" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="var(--font-mono)">
        k=0,1,2...
      </text>

      {/* ════════ RIGHT: Geometric series = partition function ════════ */}
      <rect x="290" y="40" width="220" height="200" rx="10"
            fill="rgba(16,185,129,0.03)" stroke="#10b981" strokeWidth="1" strokeDasharray="4,3" />

      {/* Geometric series expansion */}
      <text x="400" y="62" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
        GEOMETRIC SERIES
      </text>

      {/* The sum */}
      <text x="400" y="85" textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="var(--font-mono)">
        1 + p{'\u207b\u02e2'} + p{'\u207b\u00b2\u02e2'} + p{'\u207b\u00b3\u02e2'} + {'\u00B7\u00B7\u00B7'}
      </text>

      {/* Equals sign */}
      <text x="400" y="108" textAnchor="middle" fill="#475569" fontSize="16" fontWeight="700">=</text>

      {/* Transfer function / partition function */}
      <rect x="330" y="114" width="140" height="44" rx="8"
            fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="2" />
      <text x="400" y="133" textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="700" fontFamily="var(--font-mono)">
        1/(1{'\u2212'}p{'\u207b\u02e2'})
      </text>
      <text x="400" y="152" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">
        = H_p(s)
      </text>

      {/* Dual interpretation labels */}
      <text x="400" y="178" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
        DUAL INTERPRETATION
      </text>

      {/* Physics side */}
      <rect x="300" y="188" width="90" height="40" rx="5"
            fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="0.8" />
      <text x="345" y="202" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">
        PARTITION FN
      </text>
      <text x="345" y="214" textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="var(--font-mono)">
        Z = Tr(e{'\u207b\u1D5D\u1D34'})
      </text>
      <text x="345" y="224" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="var(--font-mono)">
        {'\u03B2'} = s, E_k = k{'\u00B7'}log p
      </text>

      {/* Circuit side */}
      <rect x="400" y="188" width="100" height="40" rx="5"
            fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="450" y="202" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">
        TRANSFER FN
      </text>
      <text x="450" y="214" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="var(--font-mono)">
        H(s) = 1/(1{'\u2212'}p{'\u207b\u02e2'})
      </text>
      <text x="450" y="224" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="var(--font-mono)">
        Z{'\u2080'} = log p, {'\u03c9\u2080'} = 1
      </text>
    </svg>
  );
}

function OscillatorToCircuitDiagram() {
  const midX = 260;
  return (
    <svg viewBox="0 0 520 200" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '8px auto' }}>
      <defs>
        <marker id="arrowCyan" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#06b6d4" />
        </marker>
      </defs>

      {/* ════════ LEFT: Harmonic Oscillator ════════ */}
      <rect x="10" y="10" width="200" height="180" rx="10"
            fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="1" />
      <text x="110" y="28" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
        HARMONIC OSCILLATOR
      </text>

      {/* Spring-mass system */}
      {/* Wall */}
      <line x1="35" y1="55" x2="35" y2="100" stroke="#64748b" strokeWidth="2" />
      <line x1="30" y1="55" x2="35" y2="60" stroke="#64748b" strokeWidth="1" />
      <line x1="30" y1="65" x2="35" y2="70" stroke="#64748b" strokeWidth="1" />
      <line x1="30" y1="75" x2="35" y2="80" stroke="#64748b" strokeWidth="1" />
      <line x1="30" y1="85" x2="35" y2="90" stroke="#64748b" strokeWidth="1" />
      {/* Spring */}
      <path d="M35,77 L45,77 L48,68 L54,86 L60,68 L66,86 L72,68 L78,86 L84,68 L90,86 L93,77 L105,77"
            fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Mass */}
      <rect x="105" y="63" width="30" height="28" rx="3" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="120" y="81" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">m</text>
      {/* Displacement arrow */}
      <line x1="120" y1="96" x2="155" y2="96" stroke="#60a5fa" strokeWidth="1" markerEnd="url(#arrowCyan)" />
      <text x="140" y="108" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="var(--font-mono)">x</text>

      {/* Variable dictionary */}
      <text x="30" y="130" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">x = position</text>
      <text x="30" y="143" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">p = momentum</text>
      <text x="30" y="156" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">m = mass</text>
      <text x="30" y="169" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">k = spring const</text>
      <text x="30" y="184" fill="#60a5fa" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
        H = p{'\u00B2'}/2m + {'\u00BD'}kx{'\u00B2'}
      </text>

      {/* ════════ CENTER: Mapping arrows ════════ */}
      <line x1="220" y1="77" x2="295" y2="77" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrowCyan)" />
      <text x={midX} y="65" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">
        {'\u21D4'}
      </text>
      <text x={midX} y="95" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">
        EXACT ANALOG
      </text>

      {/* Mapping dictionary */}
      {[
        ['x', '\u2194', 'Q', 'charge'],
        ['p', '\u2194', '\u03A6', 'flux'],
        ['m', '\u2194', 'C', 'capacitance'],
        ['k', '\u2194', '1/L', 'elastance'],
      ].map(([left, arrow, right, label], i) => {
        const y = 118 + i * 16;
        return (
          <React.Fragment key={i}>
            <text x={midX - 22} y={y} textAnchor="end" fill="#60a5fa" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">{left}</text>
            <text x={midX} y={y} textAnchor="middle" fill="#06b6d4" fontSize="9" fontFamily="var(--font-mono)">{arrow}</text>
            <text x={midX + 22} y={y} textAnchor="start" fill="#f59e0b" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">{right}</text>
            <text x={midX + 50} y={y} textAnchor="start" fill="#475569" fontSize="7" fontFamily="var(--font-mono)">({label})</text>
          </React.Fragment>
        );
      })}

      {/* Result */}
      <rect x={midX - 48} y="182" width="96" height="14" rx="3" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="0.8" />
      <text x={midX} y="193" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">
        {'\u03c9'} = {'\u221a'}(k/m) = 1/{'\u221a'}(LC)
      </text>

      {/* ════════ RIGHT: LC Circuit ════════ */}
      <rect x="310" y="10" width="200" height="180" rx="10"
            fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="1" />
      <text x="410" y="28" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
        LC CIRCUIT
      </text>

      {/* LC circuit schematic */}
      {/* Top wire with inductor */}
      <line x1="330" y1="60" x2="350" y2="60" stroke="#f59e0b" strokeWidth="1.5" />
      <path d="M350,60 C353,60 355,50 358,50 C361,50 363,60 366,60 C369,60 371,50 374,50 C377,50 379,60 382,60 C385,60 387,50 390,50 C393,50 395,60 398,60 C401,60 403,50 406,50 C409,50 411,60 414,60"
            fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="414" y1="60" x2="480" y2="60" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="382" y="46" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">L = log(p)</text>

      {/* Capacitor */}
      <line x1="480" y1="60" x2="480" y2="72" stroke="#60a5fa" strokeWidth="1.5" />
      <line x1="468" y1="72" x2="492" y2="72" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="468" y1="80" x2="492" y2="80" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="480" y1="80" x2="480" y2="92" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="498" y="78" fill="#60a5fa" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">C=1/log(p)</text>

      {/* Bottom wire + ground */}
      <line x1="330" y1="92" x2="480" y2="92" stroke="#475569" strokeWidth="1" />
      <line x1="330" y1="60" x2="330" y2="92" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
      {/* Ground */}
      <line x1="330" y1="92" x2="330" y2="98" stroke="#475569" strokeWidth="1" />
      <line x1="324" y1="98" x2="336" y2="98" stroke="#475569" strokeWidth="1" />
      <line x1="326" y1="101" x2="334" y2="101" stroke="#475569" strokeWidth="0.8" />
      <line x1="328" y1="104" x2="332" y2="104" stroke="#475569" strokeWidth="0.5" />

      {/* Circuit variable dictionary */}
      <text x="330" y="125" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">Q = charge</text>
      <text x="330" y="138" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">{'\u03A6'} = LI = flux</text>
      <text x="330" y="151" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">C = capacitance</text>
      <text x="330" y="164" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">1/L = elastance</text>
      <text x="330" y="179" fill="#f59e0b" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
        E = Q{'\u00B2'}/2C + {'\u00BD'}LI{'\u00B2'}
      </text>
    </svg>
  );
}

function LadderChainDiagram() {
  const primes = [2, 3, 5, 7];
  const stageW = 90, gap = 12, startX = 50;
  const totalW = startX + primes.length * (stageW + gap) + 100;
  const topY = 50, botY = 140, midY = (topY + botY) / 2;
  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

  return (
    <svg viewBox={`0 0 ${totalW} 190`} style={{ width: '100%', maxWidth: totalW, display: 'block', margin: '16px auto' }}>
      <defs>
        <marker id="arrowG2" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <path d="M0,0 L7,2.5 L0,5" fill="#64748b" />
        </marker>
      </defs>

      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="var(--font-mono)">CASCADED LADDER NETWORK (EULER PRODUCT)</text>

      {/* Input signal */}
      <text x="12" y={topY - 6} fill="#94a3b8" fontSize="10" fontFamily="var(--font-mono)">V_in</text>
      <line x1="15" y1={topY} x2={startX} y2={topY} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowG2)" />
      <line x1="15" y1={botY} x2={startX} y2={botY} stroke="#475569" strokeWidth="1.5" />

      {/* Each prime stage */}
      {primes.map((p, i) => {
        const x = startX + i * (stageW + gap);
        const col = colors[i];

        return (
          <React.Fragment key={p}>
            {/* Stage box (dashed) */}
            <rect x={x - 2} y={topY - 12} width={stageW + 4} height={botY - topY + 24} rx="6"
                  fill={col + '08'} stroke={col} strokeWidth="1" strokeDasharray="3,2" />

            {/* ── Series inductor on top wire ── */}
            <line x1={x} y1={topY} x2={x + 10} y2={topY} stroke={col} strokeWidth="1.5" />
            <path d={`M${x + 10},${topY} C${x + 14},${topY} ${x + 15},${topY - 10} ${x + 20},${topY - 10} C${x + 25},${topY - 10} ${x + 26},${topY} ${x + 30},${topY} C${x + 34},${topY} ${x + 35},${topY - 10} ${x + 40},${topY - 10} C${x + 45},${topY - 10} ${x + 46},${topY} ${x + 50},${topY} C${x + 54},${topY} ${x + 55},${topY - 10} ${x + 60},${topY - 10} C${x + 65},${topY - 10} ${x + 66},${topY} ${x + 70},${topY}`}
                  fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" />
            <line x1={x + 70} y1={topY} x2={x + stageW} y2={topY} stroke={col} strokeWidth="1.5" />
            <text x={x + 40} y={topY - 16} textAnchor="middle" fill={col} fontSize="8" fontFamily="var(--font-mono)">L_{p}</text>

            {/* ── Shunt capacitor ── */}
            <line x1={x + stageW - 15} y1={topY} x2={x + stageW - 15} y2={midY - 6} stroke={col} strokeWidth="1.5" />
            <line x1={x + stageW - 25} y1={midY - 6} x2={x + stageW - 5} y2={midY - 6} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={x + stageW - 25} y1={midY + 2} x2={x + stageW - 5} y2={midY + 2} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={x + stageW - 15} y1={midY + 2} x2={x + stageW - 15} y2={botY} stroke={col} strokeWidth="1.5" />
            <text x={x + stageW + 2} y={midY + 2} fill="#f59e0b" fontSize="7" fontFamily="var(--font-mono)">C_{p}</text>

            {/* Bottom wire */}
            <line x1={x} y1={botY} x2={x + stageW} y2={botY} stroke="#475569" strokeWidth="1.5" />

            {/* Prime badge */}
            <circle cx={x + 20} cy={botY + 2} r="10" fill={col + '20'} stroke={col} strokeWidth="1" />
            <text x={x + 20} y={botY + 6} textAnchor="middle" fill={col} fontSize="11" fontWeight="800" fontFamily="var(--font-mono)">{p}</text>

            {/* Inter-stage connection */}
            {i < primes.length - 1 && (
              <>
                <line x1={x + stageW} y1={topY} x2={x + stageW + gap} y2={topY} stroke="#475569" strokeWidth="1.5" />
                <line x1={x + stageW} y1={botY} x2={x + stageW + gap} y2={botY} stroke="#475569" strokeWidth="1.5" />
              </>
            )}
          </React.Fragment>
        );
      })}

      {/* Continuation dots */}
      {(() => {
        const lastX = startX + primes.length * (stageW + gap) - gap;
        return (
          <>
            <text x={lastX + 8} y={topY + 4} fill="#64748b" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)">{'\u00B7\u00B7\u00B7'}</text>
            <text x={lastX + 8} y={botY + 4} fill="#64748b" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)">{'\u00B7\u00B7\u00B7'}</text>
            <line x1={lastX + 30} y1={topY} x2={lastX + 65} y2={topY} stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowG2)" />
            <line x1={lastX + 30} y1={botY} x2={lastX + 65} y2={botY} stroke="#475569" strokeWidth="1.5" />
            <text x={lastX + 75} y={topY - 4} fill="#10b981" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">{'\u03b6(s)'}</text>
          </>
        );
      })()}

      {/* Bottom label */}
      <text x={totalW / 2} y="182" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="var(--font-mono)">
        {"\u03b6(s) = \u220f H_p(s) = \u220f 1/(1 \u2212 p\u207b\u02e2)   (cascade = product)"}
      </text>

      {/* Convergence note */}
      <text x={totalW / 2} y="174" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="var(--font-mono)">
        converges for Re(s) {'>'} 1
      </text>
    </svg>
  );
}

function TwinLadderDiagram() {
  const primes = [2, 3, 5, 7];
  const stgW = 52, stgGap = 6;
  const dirY = 50, dualY = 200;  // center lines of each ladder
  const ladderStartX = 80;
  const ladderEndX = ladderStartX + primes.length * (stgW + stgGap) - stgGap;
  const bridgeX = ladderEndX + 40;
  const bridgeW = 90, bridgeH = 120;
  const bridgeCY = (dirY + dualY) / 2;
  const totalW = bridgeX + bridgeW + 80;
  const totalH = 270;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxWidth: totalW, display: 'block', margin: '16px auto' }}>
      <defs>
        <marker id="arrowGreen" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <path d="M0,0 L7,2.5 L0,5" fill="#10b981" />
        </marker>
        <marker id="arrowBlueTL" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <path d="M0,0 L7,2.5 L0,5" fill="#3b82f6" />
        </marker>
        <marker id="arrowGoldTL" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <path d="M0,0 L7,2.5 L0,5" fill="#f59e0b" />
        </marker>
        {/* Glow filter for bridge */}
        <filter id="bridgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="var(--font-mono)">
        TWIN LADDER SYSTEM — FUNCTIONAL EQUATION AS CIRCUIT DUALITY
      </text>

      {/* ════════ DIRECT LADDER (top, blue) ════════ */}
      <text x="14" y={dirY - 18} fill="#3b82f6" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
        DIRECT
      </text>
      <text x="14" y={dirY - 6} fill="#60a5fa" fontSize="9" fontFamily="var(--font-mono)">{'\u03b6(s)'}</text>

      {/* Input arrow */}
      <line x1="14" y1={dirY} x2={ladderStartX - 2} y2={dirY} stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlueTL)" />

      {primes.map((p, i) => {
        const x = ladderStartX + i * (stgW + stgGap);
        const alpha = 1 - i * 0.12; // fade slightly for depth
        return (
          <React.Fragment key={`dir-${p}`}>
            {/* Stage box */}
            <rect x={x} y={dirY - 18} width={stgW} height={36} rx="5"
                  fill={`rgba(59,130,246,${0.06 + i * 0.02})`} stroke="#3b82f6"
                  strokeWidth="1.5" opacity={alpha} />
            {/* Inductor squiggle (mini) */}
            <path d={`M${x + 6},${dirY - 2} C${x + 10},${dirY - 10} ${x + 14},${dirY + 6} ${x + 18},${dirY - 2} C${x + 22},${dirY - 10} ${x + 26},${dirY + 6} ${x + 30},${dirY - 2}`}
                  fill="none" stroke="#60a5fa" strokeWidth="1.3" opacity={alpha} />
            {/* Capacitor plates (mini) */}
            <line x1={x + 35} y1={dirY - 6} x2={x + 35} y2={dirY + 6} stroke="#f59e0b" strokeWidth="1.5" opacity={alpha} />
            <line x1={x + 39} y1={dirY - 6} x2={x + 39} y2={dirY + 6} stroke="#f59e0b" strokeWidth="1.5" opacity={alpha} />
            {/* Prime number */}
            <text x={x + stgW / 2} y={dirY + 24} textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{p}</text>
            {/* Connection line */}
            {i < primes.length - 1 && (
              <line x1={x + stgW} y1={dirY} x2={x + stgW + stgGap} y2={dirY}
                    stroke="#475569" strokeWidth="1" />
            )}
          </React.Fragment>
        );
      })}
      {/* Dots and line to bridge */}
      <text x={ladderEndX + 4} y={dirY + 4} fill="#475569" fontSize="11" fontFamily="var(--font-mono)">{'\u00B7\u00B7\u00B7'}</text>
      <line x1={ladderEndX + 20} y1={dirY} x2={bridgeX} y2={dirY}
            stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlueTL)" />

      {/* ════════ DUAL LADDER (bottom, gold) ════════ */}
      <text x="14" y={dualY - 18} fill="#f59e0b" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
        DUAL
      </text>
      <text x="14" y={dualY - 6} fill="#fbbf24" fontSize="9" fontFamily="var(--font-mono)">{'\u03b6(1\u2212s)'}</text>

      {/* Input arrow */}
      <line x1="14" y1={dualY} x2={ladderStartX - 2} y2={dualY} stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowGoldTL)" />

      {primes.map((p, i) => {
        const x = ladderStartX + i * (stgW + stgGap);
        const alpha = 1 - i * 0.12;
        return (
          <React.Fragment key={`dual-${p}`}>
            {/* Stage box */}
            <rect x={x} y={dualY - 18} width={stgW} height={36} rx="5"
                  fill={`rgba(245,158,11,${0.06 + i * 0.02})`} stroke="#f59e0b"
                  strokeWidth="1.5" opacity={alpha} />
            {/* Inductor squiggle */}
            <path d={`M${x + 6},${dualY - 2} C${x + 10},${dualY - 10} ${x + 14},${dualY + 6} ${x + 18},${dualY - 2} C${x + 22},${dualY - 10} ${x + 26},${dualY + 6} ${x + 30},${dualY - 2}`}
                  fill="none" stroke="#fbbf24" strokeWidth="1.3" opacity={alpha} />
            {/* Capacitor plates */}
            <line x1={x + 35} y1={dualY - 6} x2={x + 35} y2={dualY + 6} stroke="#60a5fa" strokeWidth="1.5" opacity={alpha} />
            <line x1={x + 39} y1={dualY - 6} x2={x + 39} y2={dualY + 6} stroke="#60a5fa" strokeWidth="1.5" opacity={alpha} />
            {/* Prime number */}
            <text x={x + stgW / 2} y={dualY + 24} textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{p}</text>
            {/* Connection */}
            {i < primes.length - 1 && (
              <line x1={x + stgW} y1={dualY} x2={x + stgW + stgGap} y2={dualY}
                    stroke="#475569" strokeWidth="1" />
            )}
          </React.Fragment>
        );
      })}
      <text x={ladderEndX + 4} y={dualY + 4} fill="#475569" fontSize="11" fontFamily="var(--font-mono)">{'\u00B7\u00B7\u00B7'}</text>
      <line x1={ladderEndX + 20} y1={dualY} x2={bridgeX} y2={dualY}
            stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowGoldTL)" />

      {/* ════════ BRIDGE (center right) ════════ */}
      <rect x={bridgeX} y={bridgeCY - bridgeH / 2} width={bridgeW} height={bridgeH} rx="10"
            fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="2.5"
            filter="url(#bridgeGlow)" />

      {/* Bridge internal: coupling symbol (two interleaved curves) */}
      <path d={`M${bridgeX + 25},${bridgeCY - 25} C${bridgeX + 45},${bridgeCY - 10} ${bridgeX + 45},${bridgeCY + 10} ${bridgeX + 25},${bridgeCY + 25}`}
            fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
      <path d={`M${bridgeX + 65},${bridgeCY - 25} C${bridgeX + 45},${bridgeCY - 10} ${bridgeX + 45},${bridgeCY + 10} ${bridgeX + 65},${bridgeCY + 25}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />

      {/* Bridge labels */}
      <text x={bridgeX + bridgeW / 2} y={bridgeCY - 33} textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">BRIDGE</text>
      <text x={bridgeX + bridgeW / 2} y={bridgeCY + 2} textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="800" fontFamily="var(--font-mono)">{'\u03c7(s)'}</text>
      <text x={bridgeX + bridgeW / 2} y={bridgeCY + 40} textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">|{'\u03c7'}| = 1</text>
      <text x={bridgeX + bridgeW / 2} y={bridgeCY + 52} textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="var(--font-mono)">at {'\u03c3'} = 1/2</text>

      {/* Connections from ladders to bridge */}
      <line x1={bridgeX} y1={dirY} x2={bridgeX} y2={bridgeCY - bridgeH / 2} stroke="#3b82f6" strokeWidth="1.5" />
      <line x1={bridgeX} y1={dualY} x2={bridgeX} y2={bridgeCY + bridgeH / 2} stroke="#f59e0b" strokeWidth="1.5" />

      {/* ════════ OUTPUT ════════ */}
      <line x1={bridgeX + bridgeW} y1={bridgeCY} x2={bridgeX + bridgeW + 40} y2={bridgeCY}
            stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
      <text x={bridgeX + bridgeW + 50} y={bridgeCY - 8} fill="#10b981" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">RH:</text>
      <text x={bridgeX + bridgeW + 50} y={bridgeCY + 6} fill="#6ee7b7" fontSize="10" fontFamily="var(--font-mono)">all zeros</text>
      <text x={bridgeX + bridgeW + 50} y={bridgeCY + 18} fill="#6ee7b7" fontSize="10" fontFamily="var(--font-mono)">on {'\u03c3'}={'\u00BD'}</text>

      {/* ════════ SYMMETRY ANNOTATION ════════ */}
      {/* Dashed vertical line at sigma = 1/2 */}
      <line x1={bridgeX + bridgeW / 2} y1={dirY - 20} x2={bridgeX + bridgeW / 2} y2={dualY + 20}
            stroke="#10b981" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />

      {/* ════════ PER-PRIME COUPLING (distributed bridge) ════════ */}
      {primes.map((p, i) => {
        const x = ladderStartX + i * (stgW + stgGap) + stgW / 2;
        const midY = (dirY + dualY) / 2;
        const couplingR = 8;
        // Coupling strength decreases with prime size (visual only)
        const opacity = 0.9 - i * 0.12;
        return (
          <React.Fragment key={`coupling-${p}`}>
            {/* Coupling line: direct → coupling node */}
            <line x1={x} y1={dirY + 18} x2={x} y2={midY - couplingR - 1}
                  stroke="#10b981" strokeWidth="1.2" opacity={opacity} />
            {/* Coupling line: coupling node → dual */}
            <line x1={x} y1={midY + couplingR + 1} x2={x} y2={dualY - 18}
                  stroke="#10b981" strokeWidth="1.2" opacity={opacity} />
            {/* Coupling node (small circle) */}
            <circle cx={x} cy={midY} r={couplingR} fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1.2" opacity={opacity} />
            {/* χ_p label inside */}
            <text x={x} y={midY + 3} textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="600" fontFamily="var(--font-mono)" opacity={opacity}>
              {'\u03c7'}<tspan fontSize="5" dy="2">{p}</tspan>
            </text>
            {/* Bidirectional arrows */}
            <path d={`M${x - 2},${dirY + 20} L${x},${dirY + 18} L${x + 2},${dirY + 20}`} fill="none" stroke="#10b981" strokeWidth="0.8" opacity={opacity} />
            <path d={`M${x - 2},${dualY - 20} L${x},${dualY - 18} L${x + 2},${dualY - 20}`} fill="none" stroke="#10b981" strokeWidth="0.8" opacity={opacity} />
          </React.Fragment>
        );
      })}

      {/* Horizontal coupling bus connecting all χ_p nodes */}
      <line x1={ladderStartX + stgW / 2} y1={(dirY + dualY) / 2}
            x2={ladderStartX + (primes.length - 1) * (stgW + stgGap) + stgW / 2} y2={(dirY + dualY) / 2}
            stroke="#10b981" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />

      {/* Functional equation annotation — below the coupling bus */}
      <rect x={ladderStartX + 4} y={(dirY + dualY) / 2 + 14} width={ladderEndX - ladderStartX - 8} height={20} rx="4"
            fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" strokeWidth="0.8" />
      <text x={(ladderStartX + ladderEndX) / 2} y={(dirY + dualY) / 2 + 28} textAnchor="middle" fill="#8b5cf6" fontSize="8" fontFamily="var(--font-mono)">
        {'\u03be(s) = \u03be(1\u2212s)  \u2014  distributed coupling at every prime'}
      </text>

      {/* Bottom summary */}
      <text x={totalW / 2} y={totalH - 12} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)">
        {"Conjugate match Z_dir = Z*_dual at \u03c3 = \u00BD \u2192 lossless bridge \u2192 all zeros on critical line"}
      </text>
    </svg>
  );
}

/* ─── Step Card Component ─── */
function ModelStep({ number, title, color, math, description, diagram, linkTo, linkLabel }) {
  return (
    <div className="card" style={{ borderLeft: `3px solid ${color}`, marginBottom: 20, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{
          width: 32, height: 32, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: color + '20', color, fontSize: 16, fontWeight: 800,
          fontFamily: 'var(--font-mono)',
        }}>{number}</span>
        <h3 style={{ color, fontSize: 16, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>{description}</p>
      <div style={{ margin: '12px 0' }}>
        <BlockMath tex={math} />
      </div>
      {diagram}
      {linkTo && (
        <Link to={linkTo} style={{
          display: 'inline-block', marginTop: 12, padding: '6px 14px',
          borderRadius: 6, background: color + '18', color, fontSize: 12,
          fontWeight: 600, textDecoration: 'none', border: `1px solid ${color}40`,
        }}>
          {linkLabel || 'Explore'}
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const explorations = getAllExplorations();
  const references = getAllReferences();

  // imp-3192: paper-audit headline counts computed live from the single source
  // of truth (PAPER_AUDIT_DASHBOARD) so they cannot drift as new conjectures
  // are entered or re-verdicted. Previously these were hardcoded as "13/13".
  const paperTotal = PAPER_AUDIT_DASHBOARD.totalCount;
  const paperSubsumedRH = PAPER_AUDIT_DASHBOARD.statusCounts['SUBSUMED-BY-RH'];

  return (
    <div className="page">
      {/* ── Hero ── */}
      <div className="hero">
        <h1>Zeta Prime Oscillator Explorer</h1>
        <p>
          Exploring the Riemann Hypothesis through the lens of circuit theory, spectral geometry,
          and scattering matrices — a personal investigation by Jude Gomila into connections between
          prime oscillator networks, Calabi-Yau geometry, information theory, and random matrices.
          Interactive visualizations, computational proof attempts, and adversarial testing.
        </p>
      </div>

      <HeroSignalFlow />

      {/* ── State of the Program ── */}
      <div style={{
        marginTop: 24, marginBottom: 24, padding: '20px 24px',
        background: 'rgba(30,58,95,0.4)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 12,
      }}>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
          STATE OF THE PROGRAM — 2026
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', margin: '0 0 10px' }}>
          RH-HARD-CONFIRMED: one deterministic blocker remains
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 14 }}>
          Rigorous SOTA: Platt-Trudgian <strong style={{ color: '#f59e0b' }}>Λ ≤ 0.2</strong>.
          The C_H constant (multi-body isolation in the sg1c R2-T sector) is the sole open gap —
          {paperTotal} paper conjectures fully audited, {paperSubsumedRH} subsumed by RH equivalence, three independent
          closure routes live but all terminate at C_H.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/route-map" style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
            textDecoration: 'none', border: '1px solid rgba(59,130,246,0.35)',
          }}>Route Map</Link>
          <Link to="/rigor-dashboard" style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: 'rgba(16,185,129,0.15)', color: '#10b981',
            textDecoration: 'none', border: '1px solid rgba(16,185,129,0.35)',
          }}>Rigor Dashboard</Link>
          <Link to="/engine-room" style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
            textDecoration: 'none', border: '1px solid rgba(139,92,246,0.35)',
          }}>Engine Room</Link>
          <Link to="/rh-proof-state" style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
            textDecoration: 'none', border: '1px solid rgba(245,158,11,0.3)',
          }}>RH Proof State</Link>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '32px 0 8px' }}>
        {[
          { value: explorations.length, label: 'Explorations', color: '#3b82f6' },
          { value: `${references.length}+`, label: 'References', color: '#10b981' },
          { value: 15, label: 'Interactive Pages', color: '#8b5cf6' },
          { value: 3, label: 'Open Critical Gaps', color: '#ef4444' },
        ].map(({ value, label, color }) => (
          <div key={label} style={{
            flex: '1 1 110px', padding: '16px 18px',
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}30`,
            borderRadius: 10, textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* ══════════════ BUILDING THE MODEL ══════════════ */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 48, marginBottom: 8 }}>
        Building the Twin Ladder Model
      </h2>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
        The ZPO framework starts from a single observation: each factor of the Euler product
        is a transfer function. We build up from one prime to the complete system in three steps.
      </p>

      {/* ── Step 1: Single Prime ── */}
      <ModelStep
        number={1}
        title="The Single Prime Oscillator"
        color="#3b82f6"
        description={<>
          Every prime <InlineMath tex="p" /> defines a <strong>harmonic oscillator</strong> with
          energy levels <InlineMath tex={"E_k = k \\cdot \\log(p)"} />. Each level contributes a
          Dirichlet series term <InlineMath tex={"p^{-ks}"} />, and summing over
          all excitations gives the geometric series{' '}
          <InlineMath tex={"\\sum_{k=0}^{\\infty} p^{-ks} = 1/(1-p^{-s})"} />.
          This is simultaneously a <strong>partition function</strong> (with{' '}
          <InlineMath tex={"\\beta = s"} />) and a <strong>transfer function</strong> (with
          impedance <InlineMath tex={"Z_0 = \\log(p)"} />).
          Poles sit at <InlineMath tex={"s = 2\\pi i k/\\log(p)"} /> — a periodic lattice in the imaginary direction.
        </>}
        math={"H_p(s) = \\sum_{k=0}^{\\infty} p^{-ks} = \\frac{1}{1 - p^{-s}} \\quad \\longleftrightarrow \\quad \\text{harmonic oscillator with } E_k = k\\log(p)"}
        diagram={<SinglePrimeDiagram />}
        linkTo="/oscillators"
        linkLabel="Explore Prime Oscillators"
      />

      {/* ── Bridge: Harmonic Oscillator → LC Circuit ── */}
      <div className="card" style={{
        borderLeft: '3px solid #06b6d4', marginBottom: 20,
        background: 'rgba(6,182,212,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%', fontSize: 14, fontWeight: 700,
            background: 'rgba(6,182,212,0.15)', color: '#06b6d4',
            fontFamily: 'var(--font-mono)',
          }}>{'\u21C4'}</span>
          <h3 style={{ color: '#06b6d4', fontSize: 16, margin: 0 }}>From Oscillator to Circuit</h3>
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
          Every harmonic oscillator has a direct electrical analog — the <strong>LC circuit</strong>.
          The mapping is exact: position becomes charge, momentum becomes magnetic flux,
          mass becomes capacitance, and the spring constant becomes inverse inductance.
          For prime <InlineMath tex="p" />, we set <InlineMath tex={"L_p = \\log(p)"} /> and{' '}
          <InlineMath tex={"C_p = 1/\\log(p)"} />, which gives every oscillator the{' '}
          <strong>same natural frequency</strong> <InlineMath tex={"\\omega_0 = 1/\\sqrt{LC} = 1"} /> but{' '}
          a <strong>unique impedance</strong> <InlineMath tex={"Z_0 = \\sqrt{L/C} = \\log(p)"} /> that
          encodes the prime. This is why we can cascade them — identical frequencies, different impedances.
        </p>
        <OscillatorToCircuitDiagram />
      </div>

      {/* ── Step 2: Ladder Chain ── */}
      <ModelStep
        number={2}
        title="The Ladder Chain (Euler Product)"
        color="#8b5cf6"
        description={<>
          Cascade all prime oscillators in series — the output of one feeds the input of the next.
          The composite transfer function is the <strong>product</strong> of individual factors, which
          is exactly the <strong>Euler product</strong> for <InlineMath tex={"\\zeta(s)"} />.
          This converges absolutely for <InlineMath tex={"\\operatorname{Re}(s) > 1"} />, giving us
          a physically realizable infinite ladder network in the supercritical region. Each prime
          adds its own resonance pattern; larger primes contribute finer structure.
        </>}
        math={"\\zeta(s) = \\prod_{p \\text{ prime}} H_p(s) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}} \\qquad (\\sigma > 1)"}
        diagram={<LadderChainDiagram />}
        linkTo="/modes"
        linkLabel="See Mode Structure"
      />

      {/* ── Step 3: Twin Ladder ── */}
      <ModelStep
        number={3}
        title="The Twin Ladder System"
        color="#10b981"
        description={<>
          The functional equation <InlineMath tex={"\\xi(s) = \\xi(1-s)"} /> reveals that{' '}
          <InlineMath tex={"\\zeta(s)"} /> and <InlineMath tex={"\\zeta(1-s)"} /> are dual images of
          the same object. We model this as <strong>two parallel ladder networks</strong> — the{' '}
          <span style={{ color: '#3b82f6' }}>direct ladder</span> computing <InlineMath tex={"\\zeta(s)"} /> and
          the <span style={{ color: '#f59e0b' }}>dual ladder</span> computing <InlineMath tex={"\\zeta(1-s)"} /> — coupled
          through a <span style={{ color: '#10b981' }}>lossless bridge</span> <InlineMath tex={"\\chi(s)"} />.
          The bridge is <strong>unitary</strong> (<InlineMath tex={"|\\chi| = 1"} />) exactly on the critical
          line <InlineMath tex={"\\sigma = 1/2"} />. This is the heart of the model: the Riemann Hypothesis
          asks whether all transmission zeros of this network sit on the lossless boundary.
        </>}
        math={"\\zeta(s) = \\underbrace{\\chi(s)}_{\\text{Bridge}} \\cdot \\underbrace{\\zeta(1-s)}_{\\text{Dual}} \\qquad |\\chi(\\tfrac{1}{2}+it)| = 1 \\;\\forall\\, t"}
        diagram={<TwinLadderDiagram />}
        linkTo="/waves"
        linkLabel="See Signal Flow"
      />

      {/* ── The Key Question ── */}
      <div className="card" style={{
        borderLeft: '3px solid #ef4444', marginBottom: 32, padding: '16px 20px',
        background: 'rgba(239,68,68,0.04)',
      }}>
        <h3 style={{ color: '#ef4444', fontSize: 14, marginBottom: 8 }}>The Central Question</h3>
        <BlockMath tex={"\\text{Do all transmission zeros of the twin ladder lie on } \\sigma = \\tfrac{1}{2} \\text{ ?}"} />
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginTop: 8 }}>
          If yes, this is the <strong>Riemann Hypothesis</strong>. The ZPO framework translates this into
          concrete questions: Can we construct a self-adjoint operator whose spectrum encodes the zeros
          (<Link to="/gap-closing" style={{ color: '#f97316' }}>Hilbert-Polya, Gap S5</Link>)?
          Can we prove the infinite twin-ladder satisfies Darlington losslessness
          (<Link to="/gap-closing" style={{ color: '#f97316' }}>Gap S7</Link>)?
          The pages below explore these questions through simulation, analysis, and proof attempts.
        </p>
      </div>

      {/* ══════════════ CONNECTED INSIGHTS DAG ══════════════ */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 48, marginBottom: 8 }}>
        Connected Insights
      </h2>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
        How every insight in the ZPO framework connects — from foundational identities through
        the oscillator model and analysis layers down to the open gaps and the Riemann Hypothesis
        itself. Hover to trace dependencies; click any node to explore that topic.
      </p>
      <InsightDAG />

      {/* ══════════════ EXPLORE THE SIMULATIONS ══════════════ */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Explore the Simulations</h2>
      <div className="card-grid">
        <Link to="/oscillators" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#3b82f6' }}>Prime Oscillators</h3>
            <p>Interactive visualization of individual prime resonators, impedance profiles,
               and mode coupling between adjacent primes.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-blue">Interactive</span>
              <span className="tag tag-cyan">D3</span>
            </div>
          </div>
        </Link>
        <Link to="/hamiltonian" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#10b981' }}>Hamiltonian</h3>
            <p>System energy <InlineMath tex={"H(\\sigma,t) = T + V_{\\text{mismatch}} + V_{\\text{bridge}}"} /> minimized
               at the critical line. Explicit formula and prime staircase decomposition.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-green">Energy</span>
              <span className="tag tag-red">Critical Line</span>
            </div>
          </div>
        </Link>
        <Link to="/zeta" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#8b5cf6' }}>Zeta Landscape</h3>
            <p>The raw zeta function — Riemann-Siegel Z(t) zero detector,
               2D heatmap of <InlineMath tex={"|\\zeta(s)|"} />, and zero table.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-purple">Heatmap</span>
              <span className="tag tag-blue">Critical Line</span>
            </div>
          </div>
        </Link>
        <Link to="/waves" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#06b6d4' }}>Wave Simulator</h3>
            <p>Watch signals propagate through the twin ladder — reflection coefficients,
               wave interference, group delay, and phase behavior.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-cyan">Animated</span>
              <span className="tag tag-blue">Circuit</span>
            </div>
          </div>
        </Link>
        <Link to="/simulator" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f59e0b' }}>Twin Oscillator Simulator</h3>
            <p>Gradient descent, convergence analysis, bridge unitarity checks,
               and multi-zero verification — run interactive experiments.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-orange">Experiments</span>
              <span className="tag tag-green">Interactive</span>
            </div>
          </div>
        </Link>
        <Link to="/modes" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ec4899' }}>Oscillator Modes</h3>
            <p>Animated mode evolution at zeta zero frequencies, prime gap coupling structure,
               and the 2D energy landscape.</p>
            <div className="tags-row" style={{ marginTop: 12 }}>
              <span className="tag tag-pink">Animated</span>
              <span className="tag tag-blue">Modes</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ══════════════ ANALYSIS TOOLS ══════════════ */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Analysis & Attacks</h2>
      <div className="card-grid">
        <Link to="/fourier" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#3b82f6' }}>Fourier Analysis</h3>
            <p>Frequency response of the ladder, von Mangoldt spectrum,
               prime harmonic decomposition.</p>
          </div>
        </Link>
        <Link to="/control" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ef4444' }}>Control Theory</h3>
            <p>Nyquist stability, Bode diagrams, scattering matrices.
               RH as a stability criterion.</p>
          </div>
        </Link>
        <Link to="/statistics" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#8b5cf6' }}>Zero Statistics</h3>
            <p>GUE spacing, pair correlations, Li criterion,
               and de Bruijn-Newman heat flow.</p>
          </div>
        </Link>
        <Link to="/supercritical" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f97316' }}>Supercritical</h3>
            <p>Thermodynamics of zeta as a partition function,
               phase transitions, and the extended landscape.</p>
          </div>
        </Link>
        <Link to="/spectral-attack" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#06b6d4' }}>Spectral Attack</h3>
            <p>Six independent attack vectors — KL divergence, Fisher info,
               unified confinement potential.</p>
          </div>
        </Link>
        <Link to="/rh-attack" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#10b981' }}>RH Attack</h3>
            <p>Direct assault on the hypothesis through multiple proof strategies
               and adversarial testing.</p>
          </div>
        </Link>
        <Link to="/gap-closing" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f59e0b' }}>Gap Closing</h3>
            <p>Systematic analysis of the three critical gaps: S4 regularization,
               S5 Hilbert-Polya, S7 Darlington.</p>
          </div>
        </Link>
        <Link to="/twistor" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ec4899' }}>Twistor Duality</h3>
            <p>Mapping the twin ladder to Penrose twistor space — incidence relations,
               intertwiner correspondence.</p>
          </div>
        </Link>
        <Link to="/info-theory" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#8b5cf6' }}>Information Theory</h3>
            <p>Shannon entropy, channel capacity, mutual information — the critical
               line as an information-theoretic optimum.</p>
          </div>
        </Link>
        <Link to="/odd-zeta" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f97316' }}>Odd Zeta Values</h3>
            <p>Irrationality of <InlineMath tex={"\\zeta(2n+1)"} /> via Chaitin's constant and
               algorithmic information theory.</p>
          </div>
        </Link>
        <Link to="/calabi-yau" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#8b5cf6' }}>Calabi-Yau Attack</h3>
            <p>6-dimensional manifold geometry, Weil conjectures as finite-field RH,
               Hodge structure, and spectral universality.</p>
          </div>
        </Link>
        <Link to="/shift-bridge-positivity" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#3b82f6' }}>Shift-Bridge Positivity</h3>
            <p>RH equivalence through bridge-thickness — parametric shift analysis and positivity bounds
               that collapse to RH on the critical line.</p>
          </div>
        </Link>
        <Link to="/closure-routes" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#10b981' }}>Four Closure Routes</h3>
            <p>Four equivalent closure pathways for the twin-ladder functional equation —
               each a sufficient condition for all zeros on the critical line.</p>
          </div>
        </Link>
        <Link to="/blaschke-ghosts" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ec4899' }}>Blaschke Ghosts</h3>
            <p>Inverse Blaschke product geometry and Pontryagin operators — ghost reflection zeros
               and their confinement to the left half-plane.</p>
          </div>
        </Link>
        <Link to="/three-attacks" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#ef4444' }}>Three Attacks</h3>
            <p>Kernel-passivity, prime-delay domination, and Weil-Pontryagin frameworks —
               three independent routes to confinement on the critical line.</p>
          </div>
        </Link>
        <Link to="/reciprocal-program" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#f59e0b' }}>Reciprocal Program</h3>
            <p>Reciprocal lattice automorphisms, Schoenberg kernels, Möbius inversions, and Hardy-Corona theory —
               dual-space geometry of the twin ladder.</p>
          </div>
        </Link>
        <Link to="/kyp-bounded-real" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ color: '#06b6d4' }}>KYP Bounded-Real</h3>
            <p>Kalman-Yacubovich-Popov state-space framework, bounded-real Lemma, and delay-Gram positivity —
               computational certification of bridge losslessness.</p>
          </div>
        </Link>
      </div>

      {/* ══════════════ CORRESPONDENCES TABLE ══════════════ */}
      <div style={{ margin: '48px 0 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Key Mathematical Correspondences</h2>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Number Theory</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Circuit / Control Theory</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>ZPO Model</th>
              </tr>
            </thead>
            <tbody>
              {[
                [<>Euler product <InlineMath tex={"\\prod(1-p^{-s})^{-1}"} /></>, 'Cascade of two-port networks', 'Ladder of prime oscillators'],
                [<>Functional equation <InlineMath tex={"\\xi(s)=\\xi(1-s)"} /></>, <>Lossless scattering matrix <InlineMath tex={"S^\\dagger S=I"} /></>, 'Bridge connecting ladders'],
                [<>Critical line <InlineMath tex={"\\sigma=1/2"} /></>, 'Conjugate impedance match', 'Hamiltonian minimum'],
                ['Nontrivial zeros', 'Transmission zeros', 'System resonances'],
                ['Explicit formula', 'Impulse response decomposition', 'Sum of damped sinusoids'],
                ['Prime Number Theorem', 'Bode sensitivity integral', 'Low-frequency gain constraint'],
                ['GUE statistics of zeros', 'Random scattering matrix', 'CUE bridge ensemble'],
                [<>de Bruijn-Newman <InlineMath tex={"\\Lambda \\geq 0"} /></>, 'Zero/negative resistance', 'At lossless threshold'],
                [<><InlineMath tex={"\\sigma"} /> as inverse temperature</>, <>Bose-Einstein partition function</>, <>Primon gas; Bost-Connes at <InlineMath tex={"\\sigma=1"} /></>],
                [<>Li coefficients <InlineMath tex={"\\lambda_n \\geq 0"} /></>, 'Passivity (contractive S-matrix)', 'Schur-Cohn stability test'],
                [<>Weil quadratic form</>, <>Extremization of sesquilinear form</>, <>Connes spectral operator (2026)</>],
              ].map(([nt, ct, model], i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(42,48,80,0.5)' }}>
                  <td style={{ padding: '10px 14px', color: '#3b82f6', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{nt}</td>
                  <td style={{ padding: '10px 14px', color: '#f59e0b', fontSize: 13 }}>{ct}</td>
                  <td style={{ padding: '10px 14px', color: '#10b981', fontSize: 13 }}>{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════ LEARNING PATH ══════════════ */}
      <div style={{ margin: '48px 0 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Suggested Learning Path</h2>
        <div className="card" style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            New to the ZPO model? Follow this progression — each page builds on concepts from the previous ones.
          </p>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { num: 1, route: '/oscillators', label: 'Prime Oscillators', desc: 'Start here — learn how each prime becomes an LC resonator and the Euler product becomes a ladder network.' },
              { num: 2, route: '/hamiltonian', label: 'Hamiltonian', desc: 'See why the total system energy is minimized at sigma = 1/2, and how zeta zeros decompose the prime staircase.' },
              { num: 3, route: '/zeta', label: 'Zeta Landscape', desc: 'Explore the raw zeta function — the Z(t) zero detector, the 2D heatmap, and the zero table.' },
              { num: 4, route: '/waves', label: 'Wave Simulator', desc: 'Watch signals propagate through the twin ladder — reflection, interference, and phase response.' },
              { num: 5, route: '/fourier', label: 'Fourier Analysis', desc: 'View the frequency response, the von Mangoldt spectrum, and prime harmonic decomposition.' },
              { num: 6, route: '/control', label: 'Control Theory', desc: 'Reframe RH as a Nyquist stability criterion — zeros as instability points of a feedback loop.' },
              { num: 7, route: '/statistics', label: 'Zero Statistics', desc: 'Compare zero spacing to GUE random matrix predictions, Li criterion, and de Bruijn-Newman heat flow.' },
              { num: 8, route: '/simulator', label: 'Simulator', desc: 'Run interactive experiments — gradient descent, convergence analysis, bridge unitarity, multi-zero tests.' },
              { num: 9, route: '/supercritical', label: 'Supercritical', desc: 'Thermodynamics of zeta as a partition function, heat flow, and the extended landscape.' },
              { num: 10, route: '/spectral-attack', label: 'Spectral Attack', desc: 'Six independent proof strategies evaluated — KL Lyapunov, Fisher info, unified confinement potential.' },
              { num: 11, route: '/gap-closing', label: 'Gap Closing', desc: 'The three critical gaps: regularization (S4), Hilbert-Polya operator (S5), and Darlington synthesis (S7).' },
              { num: 12, route: '/formal-proof', label: 'Formal Proof', desc: 'The complete proof attempt — 10 sections, each with status tracking and computational verification.' },
            ].map(({ num, route, label, desc }) => (
              <Link key={route} to={route} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '8px 12px', borderRadius: 8, transition: 'background 0.15s', cursor: 'pointer',
                }}>
                  <span style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
                    fontSize: 12, fontWeight: 700, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginTop: 2,
                  }}>{num}</span>
                  <div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{label}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, marginLeft: 8 }}>{desc}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ REFERENCE PAGES ══════════════ */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Reference & Documentation</h2>
      <div className="card-grid">
        <Link to="/concepts" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#3b82f6' }}>Concepts</h3><p>Key mathematical concepts explained from scratch.</p></div>
        </Link>
        <Link to="/history" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#f59e0b' }}>History</h3><p>{new Date().getFullYear() - 1859} years of RH — from Riemann to Guth-Maynard, with TLDR explainers.</p></div>
        </Link>
        <Link to="/formal-proof" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#10b981' }}>Formal Proof</h3><p>Complete proof attempt with 10 sections, gap tracking, and status assessment.</p></div>
        </Link>
        <Link to="/proof-checker" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#ef4444' }}>Proof Checker</h3><p>Adversarial testing — Davenport-Heilbronn counterexample, logic gap detection.</p></div>
        </Link>
        <Link to="/rigor" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#f97316' }}>Rigor</h3><p>11 documented criticisms with severity ratings and stress tests.</p></div>
        </Link>
        <Link to="/explorations" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#ec4899' }}>Explorations</h3><p>{explorations.length} AI-generated deep mathematical investigations.</p></div>
        </Link>
        <Link to="/literature" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#06b6d4' }}>Literature</h3><p>{references.length}+ annotated references spanning number theory and circuit theory.</p></div>
        </Link>
        <Link to="/paper" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#8b5cf6' }}>Paper</h3><p>The formal write-up of the ZPO framework as a research paper.</p></div>
        </Link>
        <Link to="/research-journal" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#a855f7' }}>Research Journal</h3><p>Coarse-grained session narratives of the RH Λ attack — built for cheap session handoff.</p></div>
        </Link>
        <Link to="/meta-acceleration" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#facc15' }}>Meta Acceleration</h3><p>Engine status dashboard + Λ attack progress snapshot — phases, open gaps, three-route closure.</p></div>
        </Link>
        <Link to="/lambda-bounds" style={{ textDecoration: 'none' }}>
          <div className="card"><h3 style={{ color: '#ef4444' }}>Λ Bounds & RH Roadmap</h3><p>The 5-step chain from verified Riemann zeros to RH — current bounds, verification efforts, open gaps, and the path to beating Platt-Trudgian Λ ≤ 0.2.</p></div>
        </Link>
      </div>
    </div>
  );
}
