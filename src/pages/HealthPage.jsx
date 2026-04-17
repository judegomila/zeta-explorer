import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HEADLINE,
  PROOF_CHAIN,
  ROUTE_STATUS,
  CONDITIONS,
  LEAN_STATUS,
} from '../data/proof-chain-snapshot-2026-04-12.js';

/**
 * imp-591: /health — site-wide health check page.
 *
 * Shows all 6 dashboard metrics (live rh-attack.js computations),
 * proof chain step statuses, route statuses, conditions, and Lean
 * sorry/axiom counts — all in one auto-refreshable view.
 */

// ── Shared style constants ──────────────────────────────────────────────────

const STATUS_COLORS = {
  green:  { border: '#10b981', bg: 'rgba(16,185,129,0.08)',  badge: '#10b981', label: 'PASS'  },
  red:    { border: '#ef4444', bg: 'rgba(239,68,68,0.08)',   badge: '#ef4444', label: 'FAIL'  },
  yellow: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  badge: '#f59e0b', label: 'COND'  },
  orange: { border: '#f97316', bg: 'rgba(249,115,22,0.07)',  badge: '#f97316', label: 'ANLYT' },
  gray:   { border: '#475569', bg: 'rgba(71,85,105,0.08)',   badge: '#475569', label: '...'   },
};

// ── Async metric hook ───────────────────────────────────────────────────────

function useAsyncMetric(computeFn) {
  const [state, setState] = useState({ loading: true, value: null, error: null });

  useMemo(() => {
    let cancelled = false;
    setState({ loading: true, value: null, error: null });
    Promise.resolve().then(async () => {
      try {
        const value = await computeFn();
        if (!cancelled) setState({ loading: false, value, error: null });
      } catch (err) {
        if (!cancelled) setState({ loading: false, value: null, error: err.message });
      }
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

// ── Metric computation functions (mirrored from DashboardPage) ──────────────

function computeUnitarityDeficit() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.infiniteProductUnitarityBound(100, 6);
    const d = result.actualAvgDeficit;
    return {
      status: d < 0.01 ? 'green' : d < 0.1 ? 'yellow' : 'red',
      value: d.toExponential(4),
      detail: 'S7 Unitarity Deficit (P=100)',
    };
  });
}

function computeLiCoefficients() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.liCoefficients(5, 50);
    const lambdas = result.lambdas.slice(0, 5);
    const allPositive = lambdas.every(c => c.lambda > 0);
    return {
      status: allPositive ? 'green' : 'red',
      value: allPositive ? 'All Positive' : 'NEGATIVE',
      detail: 'Li Coefficients (lambda_1..5)',
    };
  });
}

function computePotapov() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.potapovFactorization(60, 15);
    const passed = result.potapovApplies === true;
    return {
      status: passed ? 'green' : 'yellow',
      value: passed ? 'J-Contractive' : result.verdict || 'Partial',
      detail: 'Potapov J-Contractivity',
    };
  });
}

function computeGUESpacing() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.montgomeryOdlyzko(100, 30);
    const nvArray = Array.isArray(result.numberVariance) ? result.numberVariance : null;
    if (nvArray && nvArray.length > 0) {
      const ratios = nvArray
        .map(r => r.gueRatio)
        .filter(r => typeof r === 'number' && Number.isFinite(r) && r > 0);
      if (ratios.length > 0) {
        const avgRatio = ratios.reduce((s, r) => s + r, 0) / ratios.length;
        const d = Math.abs(avgRatio - 1);
        return {
          status: d < 0.3 ? 'green' : d < 0.7 ? 'yellow' : 'red',
          value: `ratio=${avgRatio.toFixed(3)}`,
          detail: 'GUE Spacing (variance/GUE)',
        };
      }
    }
    return { status: 'yellow', value: 'N/A', detail: 'GUE Spacing — no data' };
  });
}

function computeWeilPositivity() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.weilPositivityTest([0.5, 1, 2, 5, 10], 80, 50);
    const tests = result.results;
    const allPositive = tests.every(t => t.balance >= -1e-10);
    const allConsistent = tests.every(t => t.consistent);
    const minSum = Math.min(...tests.map(t => t.balance));
    return {
      status: (allPositive && allConsistent) ? 'green' : 'red',
      value: (allPositive && allConsistent) ? 'Non-Negative' : `min=${minSum.toExponential(2)}`,
      detail: 'Weil Positivity (5 Gaussian widths)',
    };
  });
}

function computeProofCompleteness() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.assembleCompleteProof(30, 50);
    const sections = result.sections;
    const done = sections.filter(s => s.status === 'proven' || s.status === 'verified-numerical').length;
    const total = sections.length;
    return {
      status: done >= total ? 'green' : done >= 6 ? 'yellow' : 'red',
      value: `${done} / ${total}`,
      detail: `Proof Completeness (${(result.completeness * 100).toFixed(0)}%)`,
      completeness: result.completeness,
    };
  });
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{
      display: 'inline-block', width: 16, height: 16,
      border: '2px solid #334155', borderTop: '2px solid #38bdf8',
      borderRadius: '50%', animation: 'health-spin 0.8s linear infinite',
    }} />
  );
}

function StatusBadge({ color }) {
  const meta = STATUS_COLORS[color] || STATUS_COLORS.gray;
  return (
    <span style={{
      background: meta.badge, color: '#000',
      fontSize: 9, fontWeight: 700, padding: '1px 6px',
      borderRadius: 3, fontFamily: 'var(--font-mono)',
      letterSpacing: 0.4, flexShrink: 0,
    }}>
      {meta.label}
    </span>
  );
}

function MetricRow({ label, detail, loading, error, status, value }) {
  const meta = STATUS_COLORS[status] || STATUS_COLORS.gray;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px',
      background: loading ? 'transparent' : meta.bg,
      border: `1px solid ${loading ? '#1e293b' : meta.border}`,
      borderRadius: 7, transition: 'all 0.3s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
          {detail}
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: meta.border, flexShrink: 0 }}>
        {loading ? <Spinner /> : error ? <span style={{ color: '#ef4444' }}>ERR</span> : value}
      </div>
      {!loading && !error && <StatusBadge color={status} />}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 style={{
      fontSize: 13, fontWeight: 700, color: '#94a3b8',
      textTransform: 'uppercase', letterSpacing: 1.2,
      borderBottom: '1px solid #1e293b', paddingBottom: 8,
      margin: '24px 0 12px',
      fontFamily: 'var(--font-mono)',
    }}>
      {title}
    </h2>
  );
}

function rigorColor(status) {
  const s = status.toLowerCase();
  if (s.includes('open') || s.includes('pending') || s.includes('diagnostic closed')) return 'red';
  if (s.includes('conditional') || s.includes('modulo gue') || s.includes('modulo named')) return 'yellow';
  if (s.includes('established') || s.includes('closed (symbolic') || s.includes('closed: l_pt')) return 'orange';
  return 'green';
}

function ProofStepRow({ step }) {
  const [expanded, setExpanded] = useState(false);
  const color = rigorColor(step.status);
  const meta = STATUS_COLORS[color];
  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        padding: '7px 12px',
        background: meta.bg, border: `1px solid ${meta.border}`,
        borderRadius: 7, marginBottom: 5, cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: meta.badge, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, fontWeight: 700,
          color: '#0f172a', flexShrink: 0, fontFamily: 'var(--font-mono)',
        }}>
          {step.step}
        </div>
        <span style={{
          fontSize: 10, fontFamily: 'var(--font-mono)', color: meta.badge,
          background: `${meta.badge}20`, borderRadius: 3, padding: '1px 5px',
          flexShrink: 0,
        }}>
          {step.ticket}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {step.status}
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#475569', flexShrink: 0, userSelect: 'none' }}>
          {expanded ? '▲' : '▼'}
        </span>
        <StatusBadge color={color} />
      </div>
      {expanded && step.claim && (
        <div style={{
          marginTop: 8, paddingTop: 8,
          borderTop: `1px solid ${meta.border}`,
          fontSize: 11, color: '#94a3b8',
          fontFamily: 'var(--font-mono)', lineHeight: 1.6,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {step.claim}
        </div>
      )}
    </div>
  );
}

function ConditionRow({ cond, color }) {
  const meta = STATUS_COLORS[color];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 12px',
      background: meta.bg, border: `1px solid ${meta.border}`,
      borderRadius: 7, marginBottom: 5,
    }}>
      <span style={{
        fontSize: 10, fontFamily: 'var(--font-mono)', color: meta.badge,
        background: `${meta.badge}20`, borderRadius: 3, padding: '1px 5px',
        flexShrink: 0,
      }}>
        {cond.id}
      </span>
      <div style={{ flex: 1, fontSize: 12, color: '#e2e8f0' }}>
        {cond.description}
      </div>
      <StatusBadge color={color} />
    </div>
  );
}

function LeanRow({ file }) {
  const hasSorrys = file.sorryCount > 0;
  const color = hasSorrys ? (file.sorryCount <= 2 ? 'yellow' : 'orange') : 'green';
  const meta = STATUS_COLORS[color];
  const shortName = file.file.split('/').pop();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 12px',
      background: meta.bg, border: `1px solid ${meta.border}`,
      borderRadius: 7, marginBottom: 5,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>{shortName}</div>
        <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{file.ticket}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>
        axioms: {file.axiomCount} &nbsp;|&nbsp; sorrys: {file.sorryCount}
      </div>
      <StatusBadge color={color} />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const AUTO_REFRESH_SECONDS = 60;

export default function HealthPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS);

  const unitarity  = useAsyncMetric(useCallback(() => computeUnitarityDeficit(),  [refreshKey])); // eslint-disable-line react-hooks/exhaustive-deps
  const liCoeffs   = useAsyncMetric(useCallback(() => computeLiCoefficients(),    [refreshKey])); // eslint-disable-line react-hooks/exhaustive-deps
  const potapov    = useAsyncMetric(useCallback(() => computePotapov(),            [refreshKey])); // eslint-disable-line react-hooks/exhaustive-deps
  const gue        = useAsyncMetric(useCallback(() => computeGUESpacing(),         [refreshKey])); // eslint-disable-line react-hooks/exhaustive-deps
  const weil       = useAsyncMetric(useCallback(() => computeWeilPositivity(),     [refreshKey])); // eslint-disable-line react-hooks/exhaustive-deps
  const proof      = useAsyncMetric(useCallback(() => computeProofCompleteness(),  [refreshKey])); // eslint-disable-line react-hooks/exhaustive-deps

  const allDone = !unitarity.loading && !liCoeffs.loading && !potapov.loading
    && !gue.loading && !weil.loading && !proof.loading;

  useMemo(() => {
    if (allDone) setLastChecked(new Date().toISOString());
  }, [allDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh countdown
  useEffect(() => {
    if (!autoRefresh) { setCountdown(AUTO_REFRESH_SECONDS); return; }
    let secs = AUTO_REFRESH_SECONDS;
    const tick = setInterval(() => {
      secs -= 1;
      setCountdown(secs);
      if (secs <= 0) {
        secs = AUTO_REFRESH_SECONDS;
        setCountdown(secs);
        setRefreshKey(k => k + 1);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [autoRefresh, refreshKey]);

  const handleRefresh = () => {
    setLastChecked(null);
    setRefreshKey(k => k + 1);
  };

  // Proof chain: count by color
  const chainCounts = PROOF_CHAIN.reduce((acc, step) => {
    const c = rigorColor(step.status);
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  // Lean totals
  const totalSorrys = LEAN_STATUS.files.reduce((s, f) => s + f.sorryCount, 0);
  const totalAxioms = LEAN_STATUS.files.reduce((s, f) => s + f.axiomCount, 0);

  // Overall health: all 6 metrics green = green, any red = red, else yellow
  const metricStatuses = [unitarity, liCoeffs, potapov, gue, weil, proof].map(m => m.value?.status);
  const anyLoading = !allDone;
  const anyRed = metricStatuses.some(s => s === 'red');
  const anyYellow = metricStatuses.some(s => s === 'yellow');
  const overallColor = anyLoading ? 'gray' : anyRed ? 'red' : anyYellow ? 'yellow' : 'green';
  const overallMeta = STATUS_COLORS[overallColor];

  return (
    <div className="page">
      <style>{`
        @keyframes health-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ marginBottom: 6 }}>Project Health</h1>
            <p style={{ margin: 0, color: '#94a3b8' }}>
              Live metrics, proof chain status, conditions, and Lean sorry counts in one view.
            </p>
          </div>
          {/* Overall status chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: overallMeta.bg, border: `2px solid ${overallMeta.border}`,
            borderRadius: 10, padding: '10px 18px',
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: overallMeta.badge,
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
              color: overallMeta.badge,
            }}>
              {anyLoading ? 'CHECKING...' : anyRed ? 'DEGRADED' : anyYellow ? 'CONDITIONAL' : 'HEALTHY'}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <button
          onClick={handleRefresh}
          disabled={!allDone}
          style={{
            background: allDone ? '#3b82f6' : '#334155',
            color: allDone ? '#fff' : '#64748b',
            border: 'none', borderRadius: 6,
            padding: '7px 16px', fontSize: 12, fontWeight: 600,
            cursor: allDone ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Refresh Now
        </button>
        <button
          onClick={() => setAutoRefresh(a => !a)}
          style={{
            background: autoRefresh ? 'rgba(16,185,129,0.12)' : '#1e293b',
            color: autoRefresh ? '#10b981' : '#94a3b8',
            border: `1px solid ${autoRefresh ? '#10b981' : '#334155'}`,
            borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}
        >
          Auto-Refresh {autoRefresh ? `(${countdown}s)` : 'Off'}
        </button>
        <div style={{ color: '#475569', fontSize: 11, fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
          {lastChecked
            ? `Last checked: ${new Date(lastChecked).toLocaleTimeString()}`
            : anyLoading ? 'Computing...' : ''}
        </div>
      </div>

      {/* Headline claim */}
      <div style={{
        background: 'rgba(59,130,246,0.06)', border: '1px solid #1e40af',
        borderRadius: 8, padding: '12px 16px', marginBottom: 4,
        display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
      }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: '#60a5fa' }}>
            {HEADLINE.bound}
          </span>
          <span style={{ color: '#64748b', fontSize: 12, marginLeft: 10 }}>
            ({HEADLINE.improvement} vs {HEADLINE.baseline})
          </span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          {HEADLINE.rigorLevel}
        </div>
      </div>

      {/* Live Metrics */}
      <SectionHeader title="Live Metrics" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MetricRow label="S7 Unitarity Deficit" loading={unitarity.loading} error={unitarity.error} status={unitarity.value?.status} value={unitarity.value?.value} detail={unitarity.value?.detail || 'infiniteProductUnitarityBound(100, 6)'} />
        <MetricRow label="Li Coefficients" loading={liCoeffs.loading} error={liCoeffs.error} status={liCoeffs.value?.status} value={liCoeffs.value?.value} detail={liCoeffs.value?.detail || 'liCoefficients(5, 50)'} />
        <MetricRow label="Potapov J-Contractivity" loading={potapov.loading} error={potapov.error} status={potapov.value?.status} value={potapov.value?.value} detail={potapov.value?.detail || 'potapovFactorization(60, 15)'} />
        <MetricRow label="GUE Spacing" loading={gue.loading} error={gue.error} status={gue.value?.status} value={gue.value?.value} detail={gue.value?.detail || 'montgomeryOdlyzko(100, 30)'} />
        <MetricRow label="Weil Positivity" loading={weil.loading} error={weil.error} status={weil.value?.status} value={weil.value?.value} detail={weil.value?.detail || 'weilPositivityTest([0.5..10], 80, 50)'} />
        <MetricRow label="Proof Completeness" loading={proof.loading} error={proof.error} status={proof.value?.status} value={proof.value?.value} detail={proof.value?.detail || 'assembleCompleteProof(30, 50)'} />
      </div>

      {/* Proof Chain */}
      <SectionHeader title={`Proof Chain (${PROOF_CHAIN.length} steps — G:${chainCounts.green || 0} Y:${chainCounts.yellow || 0} O:${chainCounts.orange || 0} R:${chainCounts.red || 0})`} />
      {PROOF_CHAIN.map(step => <ProofStepRow key={step.step} step={step} />)}

      {/* Route Status */}
      <SectionHeader title="Proof Routes" />
      {Object.values(ROUTE_STATUS).map(route => {
        const isOpen = route.status.toLowerCase().includes('open') || route.status.toLowerCase().includes('partial');
        const isCond = route.status.toLowerCase().includes('conditional') || route.status.toLowerCase().includes('modulo');
        const color = isOpen ? 'red' : isCond ? 'yellow' : 'green';
        const meta = STATUS_COLORS[color];
        return (
          <div key={route.name} style={{
            background: meta.bg, border: `1px solid ${meta.border}`,
            borderRadius: 7, padding: '9px 12px', marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{route.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{route.status}</div>
            </div>
            <StatusBadge color={color} />
          </div>
        );
      })}

      {/* Conditions */}
      <SectionHeader title={`Conditions (${CONDITIONS.established.length} established, ${CONDITIONS.establishedConditional.length} conditional, ${CONDITIONS.open.length} open)`} />
      {CONDITIONS.established.map(c => <ConditionRow key={c.id} cond={c} color="green" />)}
      {CONDITIONS.establishedConditional.map(c => <ConditionRow key={c.id} cond={c} color="yellow" />)}
      {CONDITIONS.open.map(c => <ConditionRow key={c.id} cond={c} color="red" />)}

      {/* Lean Status */}
      <SectionHeader title={`Lean 4 Formalization (total sorrys: ${totalSorrys}, axioms: ${totalAxioms})`} />
      {LEAN_STATUS.files.map(f => <LeanRow key={f.file} file={f} />)}

      {/* Footer links */}
      <div style={{
        marginTop: 24, paddingTop: 16, borderTop: '1px solid #1e293b',
        display: 'flex', gap: 16, flexWrap: 'wrap',
        fontSize: 12, color: '#475569', fontFamily: 'var(--font-mono)',
      }}>
        <Link to="/dashboard" style={{ color: '#38bdf8' }}>Full Dashboard</Link>
        <Link to="/rigor-dashboard" style={{ color: '#38bdf8' }}>Rigor Dashboard</Link>
        <Link to="/proof-explorer" style={{ color: '#38bdf8' }}>Proof Explorer</Link>
        <Link to="/break-it" style={{ color: '#38bdf8' }}>Break It</Link>
      </div>
    </div>
  );
}
