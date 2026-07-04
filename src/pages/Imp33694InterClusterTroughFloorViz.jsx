import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT } from '../data/imp-33662-inter-cluster-trough-floor-drift-n400-1200.js';

const TROUGH_COLOR = '#38bdf8';
const FIT_COLOR = '#f59e0b';
const MEAN_COLOR = '#4ade80';

const { measured } = IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT;
const troughs = measured.troughs;

function TroughChart() {
  const svgW = 900;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nLo = measured.combinedWindowLo;
  const nHi = measured.combinedWindowHi;
  const yMax = 70;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - Math.min(v, yMax) / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 20, 40, 60].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* flat trough mean line */}
      <line
        x1={padL}
        y1={yS(measured.troughMean)}
        x2={padL + cW}
        y2={yS(measured.troughMean)}
        stroke={MEAN_COLOR}
        strokeWidth={1.3}
        strokeDasharray="4,3"
      />
      <text x={padL + 4} y={yS(measured.troughMean) - 6} fill={MEAN_COLOR} fontSize={9}>
        mean ~{measured.troughMean.toFixed(1)} ULP
      </text>

      {/* trough-vs-n least-squares fit line */}
      <line
        x1={xS(nLo)}
        y1={yS(measured.troughIntercept + measured.troughSlope * nLo)}
        x2={xS(nHi)}
        y2={yS(measured.troughIntercept + measured.troughSlope * nHi)}
        stroke={FIT_COLOR}
        strokeWidth={1.3}
      />

      {/* the fifteen trough points */}
      {troughs.map((t) => (
        <g key={`trough-${t.troughN}`}>
          <circle cx={xS(t.troughN)} cy={yS(t.troughEnv)} r={3.5} fill={TROUGH_COLOR} />
          <text x={xS(t.troughN)} y={yS(t.troughEnv) - 7} textAnchor="middle" fill={TROUGH_COLOR} fontSize={8}>
            {t.troughEnv.toFixed(0)}
          </text>
        </g>
      ))}

      {[400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map((n) => (
        <text key={n} x={xS(n)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        inter-cluster trough rung n
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        trough envelope (ULP)
      </text>
    </svg>
  );
}

export default function Imp33694InterClusterTroughFloorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Inter-Cluster Trough Floor, n in [400,1200] (imp-33662)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        The imp-33660/imp-33661 sixteen-cluster band-clearing scan over n in [{measured.combinedWindowLo},{' '}
        {measured.combinedWindowHi}] leaves fifteen inter-cluster gaps unrendered. imp-33662 tabulates the
        LOCAL MINIMUM rolling-max envelope inside each gap -- the between-cluster trough floor -- and fits
        trough-vs-n to test whether the baseline drifts upward as the imp-33638 tail peaks re-intensify. The
        chart below plots each of the fifteen trough depths (blue dots), the least-squares trough-vs-n fit
        (amber line), and the overall trough mean (green, dashed).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        troughEnv(n) at the fifteen inter-cluster gaps: depths, linear fit, and mean
      </p>
      <TroughChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The fifteen troughs sit at n ~ {measured.troughNs[0]}..{measured.troughNs[measured.troughNs.length - 1]}{' '}
        with depths ranging {measured.troughMin.toFixed(1)}..{measured.troughMax.toFixed(1)} ULP (mean{' '}
        {measured.troughMean.toFixed(1)}, sd {measured.troughSd.toFixed(1)}). The trough-vs-n fit slope is{' '}
        {measured.troughSlope >= 0 ? '+' : ''}
        {measured.troughSlope.toFixed(3)} ULP/rung with R&sup2; ~{measured.troughR2.toFixed(2)} -- statistically
        flat -- and the first-half mean ({measured.firstHalfMean.toFixed(1)}) sits marginally ABOVE the
        second-half mean ({measured.secondHalfMean.toFixed(1)}), so the between-cluster baseline does not rise.
      </p>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the trough slope (
        {measured.troughSlope.toFixed(3)} ULP/rung) is ~
        {measured.troughSlopeVsPeakSlopeRatio < 1
          ? (1 / measured.troughSlopeVsPeakSlopeRatio).toFixed(0)
          : measured.troughSlopeVsPeakSlopeRatio.toFixed(0)}
        x smaller than the imp-33660 peak-HEIGHT slope (~{measured.imp33660PeakHeightSlope} ULP/rung), isolating
        the weak positive envelope growth to the cluster PEAKS -- the between-cluster floor itself does not
        degrade. The single deepest trough (~{measured.troughMin.toFixed(1)} ULP) recovers the imp-33638
        env-min reading, but the typical trough sits well above it, so that reading is the floor of the jitter
        band, not a persistent baseline. Exact per-rung ULP values are jittery arithmetic-floor lattice hits;
        the robust reading is the qualitative flat-trough conclusion, not the precise fit coefficients.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design measurement only. It
        changes no bound and patches no literal. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
