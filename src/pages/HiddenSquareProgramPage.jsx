import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import StatusNote from '../components/StatusNote.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { HIDDEN_SQUARE_PROGRAM_SECTION } from '../data/hidden-square-program-section.js';
import { ED } from '../styles/tokens.js';
import {
  SHEAR_KERNEL_REPAIR,
  divisorPhase,
  divisorProductPhase,
  divisors,
  primeFactorization,
} from '../data/shear-kernel-repair-2026-08-28.js';

/**
 * HiddenSquareProgramPage — renders §25 + §26 + §27 of the v52 paper as a
 * historical chain, with the June 18 withdrawal taking precedence over
 * the old Volterra proposal. The newer finite-Gram scope is independent.
 *
 * Editorial (warm) re-theme: full-width shell, identical structure/data.
 */
const S = HIDDEN_SQUARE_PROGRAM_SECTION;
const FINITE_GRAM_STATUSES = new Set([
  'CERTIFIED-POSITIVE-FINITE-GRAM',
  'CERTIFIED-NEGATIVE-WITNESS',
  'INCONCLUSIVE',
]);
const FINITE_GRAM_CERTIFICATE_SCHEMA = 'debranges-gram-certificate/v1';
const FINITE_GRAM_CASE_SCHEMA = 'debranges-gram-case/v1';
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

function isPlainRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(record, keys) {
  if (!isPlainRecord(record)) return false;
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function hasHonestFiniteScope(record, finiteKey) {
  return isPlainRecord(record) &&
    record[finiteKey] === true &&
    record.rhClaim === false &&
    record.rhSolved === false &&
    record.claimComplete === false;
}

function thetaCrosscheckPassesLoadGuard(certificate) {
  const theta = certificate?.thetaCrosscheck;
  const request = certificate?.input?.theta_crosscheck;
  if (!isPlainRecord(theta) || !isPlainRecord(request)) return false;
  if (typeof request.enabled !== 'boolean' || theta.requested !== request.enabled) return false;
  if (typeof theta.performed !== 'boolean' || theta.usedForVerdict !== false) return false;
  if (!hasHonestFiniteScope(theta, 'finiteGramOnly') || typeof theta.reason !== 'string') return false;

  const honestyKeys = [
    'requested', 'performed', 'usedForVerdict', 'finiteGramOnly', 'rhClaim',
    'rhSolved', 'claimComplete',
  ];
  if (!request.enabled) {
    return hasExactKeys(theta, [...honestyKeys, 'reason']) &&
      theta.performed === false &&
      theta.reason === 'theta-crosscheck-not-requested';
  }

  if (!hasExactKeys(theta, [
    ...honestyKeys, 'selectedPrecisionBits', 'parameters',
    'allNodeEvaluationsCompleted', 'allOverlaps', 'nodeChecks', 'reason',
    'scaledGramDiagnostic',
  ])) return false;
  if (theta.selectedPrecisionBits !== certificate.selectedPrecisionBits) return false;
  if (!hasExactKeys(theta.parameters, ['cutoffU', 'thetaTerms'])) return false;
  if (theta.parameters.cutoffU !== request.cutoff_u || theta.parameters.thetaTerms !== request.theta_terms) return false;
  if (!Array.isArray(theta.nodeChecks) || theta.nodeChecks.length !== certificate.input.nodes.length) return false;

  const nodesValid = theta.nodeChecks.every((nodeCheck, index) => {
    if (!isPlainRecord(nodeCheck) || nodeCheck.nodeIndex !== index) return false;
    if (typeof nodeCheck.performed !== 'boolean' || typeof nodeCheck.overlap !== 'boolean') return false;
    if (typeof nodeCheck.EOverlap !== 'boolean' || typeof nodeCheck.EsharpOverlap !== 'boolean') return false;
    if (nodeCheck.overlap !== (nodeCheck.EOverlap && nodeCheck.EsharpOverlap)) return false;
    if (nodeCheck.usedForVerdict !== false || !hasHonestFiniteScope(nodeCheck, 'finitePointwiseOnly')) return false;
    if (nodeCheck.performed) {
      return isPlainRecord(nodeCheck.theta) &&
        hasHonestFiniteScope(nodeCheck.theta, 'finitePointwiseOnly') &&
        isPlainRecord(nodeCheck.completedXi) &&
        isPlainRecord(nodeCheck.completedXi.E) &&
        isPlainRecord(nodeCheck.completedXi.Esharp);
    }
    return nodeCheck.overlap === false && !Object.hasOwn(nodeCheck, 'theta') && !Object.hasOwn(nodeCheck, 'completedXi');
  });
  if (!nodesValid) return false;

  const allCompleted = theta.nodeChecks.every((nodeCheck) => nodeCheck.performed);
  const allOverlaps = theta.nodeChecks.every((nodeCheck) => nodeCheck.overlap);
  if (theta.performed !== allCompleted || theta.allNodeEvaluationsCompleted !== allCompleted || theta.allOverlaps !== allOverlaps) return false;

  const diagnostic = theta.scaledGramDiagnostic;
  if (!isPlainRecord(diagnostic) || typeof diagnostic.performed !== 'boolean') return false;
  if (diagnostic.usedForVerdict !== false || !hasHonestFiniteScope(diagnostic, 'finiteGramOnly')) return false;
  if (diagnostic.label !== 'EVIDENCE-ONLY-THETA-SCALED-GRAM') return false;
  if (diagnostic.performed) {
    return allCompleted && allOverlaps &&
      isPlainRecord(diagnostic.classification) &&
      FINITE_GRAM_STATUSES.has(diagnostic.classification.status) &&
      diagnostic.classification.finiteGramOnly === true &&
      diagnostic.classification.rhClaim === false &&
      isPlainRecord(diagnostic.gramEnclosure) &&
      SHA256_PATTERN.test(diagnostic.gramEnclosure.sha256);
  }
  return typeof diagnostic.reason === 'string' && diagnostic.reason.length > 0;
}

function finiteGramCertificatePassesLoadGuard(certificate) {
  if (!isPlainRecord(certificate) || certificate.schemaVersion !== FINITE_GRAM_CERTIFICATE_SCHEMA) return false;
  if (!FINITE_GRAM_STATUSES.has(certificate.status) || !hasHonestFiniteScope(certificate, 'finiteGramOnly')) return false;
  if (!isPlainRecord(certificate.input) || certificate.input.schemaVersion !== FINITE_GRAM_CASE_SCHEMA) return false;
  if (typeof certificate.input.a !== 'string' || certificate.input.a.length === 0) return false;
  if (!Array.isArray(certificate.input.nodes) || certificate.input.nodes.length === 0) return false;
  if (!Number.isInteger(certificate.selectedPrecisionBits) || certificate.selectedPrecisionBits < 64) return false;
  if (!Array.isArray(certificate.input.precision_bits) || !certificate.input.precision_bits.includes(certificate.selectedPrecisionBits)) return false;
  if (!Array.isArray(certificate.attempts) || certificate.attempts.length === 0) return false;
  const selectedAttempt = certificate.attempts.at(-1);
  if (selectedAttempt?.status !== certificate.status || selectedAttempt?.precisionBits !== certificate.selectedPrecisionBits) return false;
  if (!isPlainRecord(certificate.hashes) || !SHA256_PATTERN.test(certificate.hashes.canonicalCertificateSha256)) return false;
  return thetaCrosscheckPassesLoadGuard(certificate);
}

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(accent) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${accent}`,
    borderRadius: 10,
    padding: '20px 24px',
    margin: '16px 0',
  };
}

function Card({ children, accent = 'var(--hairline)' }) {
  return <div className="card" style={cardBaseLeft(accent)}>{children}</div>;
}

// Named warm rgb triples (mirror the CSS custom properties) so conjecture/step
// boxes can build soft translucent fills the same way the chip helpers do
// elsewhere in the editorial theme.
const RGB = {
  terraDk: '194,58,28',
  brassDk: '181,138,46',
  blue: '63,107,134',
  terra: '217,80,46',
  green: '76,122,74',
  brass: '140,106,29',
};

function Conjecture({ id, tone, children }) {
  const rgb = RGB[tone] || RGB.brass;
  const colorVar = `var(--${tone === 'terraDk' ? 'terra-dk' : tone === 'brassDk' ? 'brass-dk' : tone})`;
  return (
    <div style={{
      padding: 12,
      background: `rgba(${rgb},0.10)`,
      border: `1px solid rgba(${rgb},0.40)`,
      borderLeft: `3px solid ${colorVar}`,
      borderRadius: 6,
      marginTop: 10,
    }}>
      <div style={{ color: colorVar, fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6, letterSpacing: 0.5 }}>
        {id}
      </div>
      <div style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ChainDiagram() {
  // Corrected vertical chain. The old literal u=v / u!=v continuum split is
  // intentionally absent: u=v is a null set for the 2D Lebesgue measure.
  const steps = [
    { id: 'no-ghost',    label: 'No-ghost theorem', sub: 'K_a ⪰ 0 ∀ a > 0',                 color: 'var(--terra-dk)' },
    { id: 'commutator',  label: 'Exact paired kernel', sub: '(u,v) → (r,s), pair s with −s', color: 'var(--brass-dk)' },
    { id: 'null-set',    label: 'Measure audit', sub: 'u=v is null; no literal diagonal mass', color: 'var(--terra)' },
    { id: 'blocks',      label: 'Arithmetic blocks', sub: 'group theta pairs by N=nm',       color: 'var(--blue)' },
    { id: 'tails',       label: 'Certified finite Gram', sub: 'λ_min(G_M) versus J ε_M',      color: 'var(--green)' },
    { id: 'frontier',    label: 'Global frontier', sub: 'all node sets and every a>0 = RH',   color: 'var(--brass)' },
  ];

  return (
    <svg width="100%" viewBox="0 0 700 440" style={{ background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8 }}>
      {steps.map((step, i) => {
        const y = 40 + i * 65;
        return (
          <g key={step.id}>
            <rect x="100" y={y - 22} width="500" height="44" rx="6" fill={step.color} fillOpacity="0.14" stroke={step.color} strokeWidth="1.5" />
            <text x="350" y={y - 4} fill={step.color} textAnchor="middle" fontSize="14" fontWeight="700">{step.label}</text>
            <text x="350" y={y + 14} fill={ED.inkSoft} textAnchor="middle" fontSize="11" fontFamily="monospace">{step.sub}</text>
            {i < steps.length - 1 && (
              <g>
                <line x1="350" y1={y + 22} x2="350" y2={y + 43} stroke={ED.rule} strokeWidth="1.5" />
                <polygon points={`345,${y + 38} 350,${y + 45} 355,${y + 38}`} fill="#877b67" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ArithmeticBlockDiagnostic() {
  const [N, setN] = useState(30);
  const [xi, setXi] = useState(4);
  const direct = divisorPhase(N, xi);
  const product = divisorProductPhase(N, xi);
  const ds = divisors(N);
  const factors = primeFactorization(N)
    .map(([p, k]) => k === 1 ? `${p}` : `${p}^${k}`)
    .join(' × ') || '1';

  const plot = useMemo(() => {
    const samples = Array.from({ length: 181 }, (_, i) => {
      const x = (20 * i) / 180;
      return { x, y: divisorPhase(N, x) };
    });
    const scale = Math.max(1, ...samples.map((p) => Math.abs(p.y)));
    return samples.map((p, i) => {
      const px = (640 * i) / (samples.length - 1);
      const py = 90 - (76 * p.y) / scale;
      return `${px.toFixed(2)},${py.toFixed(2)}`;
    }).join(' ');
  }, [N]);

  const signColor = direct < -1e-10 ? 'var(--terra-dk)' : direct > 1e-10 ? 'var(--green)' : 'var(--brass-dk)';

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
        <label style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
          Divisor block <strong>N = {N}</strong>
          <input aria-label="Divisor block N" type="range" min="1" max="120" step="1" value={N}
            onChange={(e) => setN(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
        </label>
        <label style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
          Fourier frequency <strong>ξ = {xi.toFixed(2)}</strong>
          <input aria-label="Fourier frequency xi" type="range" min="0" max="20" step="0.05" value={xi}
            onChange={(e) => setXi(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
        </label>
      </div>

      <svg width="100%" viewBox="0 0 640 180" role="img" aria-label={`Divisor phase D_${N} from xi zero to twenty`}
        style={{ marginTop: 12, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8 }}>
        <line x1="0" y1="90" x2="640" y2="90" stroke="var(--hairline)" strokeWidth="1" />
        <polyline points={plot} fill="none" stroke="var(--blue)" strokeWidth="2" />
        <line x1={640 * xi / 20} y1="8" x2={640 * xi / 20} y2="172" stroke={signColor} strokeWidth="1.5" />
        <text x="10" y="20" fill="var(--faint)" fontSize="11">D_N(ξ): sign changes rule out blockwise positivity</text>
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 10 }}>
        <div style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
          <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>FACTORIZATION</div>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 13 }}>{factors}</div>
        </div>
        <div style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
          <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>DIVISORS ({ds.length})</div>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 13, overflowWrap: 'anywhere' }}>{ds.join(', ')}</div>
        </div>
        <div style={{ padding: 10, background: 'var(--paper)', border: `1px solid ${signColor}`, borderRadius: 6 }}>
          <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>D_N(ξ)</div>
          <div style={{ color: signColor, marginTop: 4, fontSize: 18, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{direct.toFixed(8)}</div>
          <div style={{ color: 'var(--faint)', marginTop: 3, fontSize: 10 }}>product check Δ = {Math.abs(direct - product).toExponential(2)}</div>
        </div>
      </div>
      <p style={{ color: 'var(--faint)', fontSize: 12, lineHeight: 1.55, margin: '10px 0 0' }}>
        Diagnostic only. <InlineMath math="D_N" /> factors the full-line theta density; the physical wedge,
        shear weights and heat factor mix these phases. The theta index is arithmetic but is not literally an
        Euler-product prime-power rung.
      </p>
    </div>
  );
}

function FiniteGramCertificateCard() {
  const [certificateState, setCertificateState] = useState({ phase: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    fetch('/certificates/debranges-gram/smoke.json', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`certificate request returned ${response.status}`);
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.toLowerCase().includes('application/json')) {
          throw new Error('certificate response was not JSON');
        }
        return response.json();
      })
      .then((certificate) => {
        if (!finiteGramCertificatePassesLoadGuard(certificate)) {
          throw new Error('certificate schema or finite-only scope guard failed');
        }
        setCertificateState({ phase: 'ready', certificate });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setCertificateState({ phase: 'unavailable' });
        }
      });

    return () => controller.abort();
  }, []);

  if (certificateState.phase === 'loading') {
    return (
      <Card accent="var(--brass-dk)">
        <div aria-live="polite" style={{ color: 'var(--faint)', fontSize: 13 }}>
          Loading the static finite-Gram certificate…
        </div>
      </Card>
    );
  }

  if (certificateState.phase !== 'ready') {
    return (
      <Card accent="var(--brass-dk)">
        <div style={{ color: 'var(--brass-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', letterSpacing: 0.5 }}>
          STATIC FINITE-GRAM ARTIFACT · UNAVAILABLE
        </div>
        <p aria-live="polite" style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: '8px 0 0' }}>
          The certificate could not be loaded or did not pass its finite-only scope guard. No numerical
          conclusion is inferred; the exact correction above is unaffected.
        </p>
      </Card>
    );
  }

  const { certificate } = certificateState;
  const statusColor = certificate.status.includes('NEGATIVE')
    ? 'var(--terra-dk)'
    : certificate.status.includes('POSITIVE')
      ? 'var(--green)'
      : 'var(--brass-dk)';
  const hash = certificate.hashes.canonicalCertificateSha256;
  const theta = certificate.thetaCrosscheck;
  const thetaStatus = !theta.requested
    ? 'NOT REQUESTED'
    : !theta.performed
      ? 'INCOMPLETE'
      : theta.allOverlaps
        ? `ALL ${theta.nodeChecks.length} NODES OVERLAP`
        : 'COMPLETED · NONOVERLAP';
  const thetaColor = theta.performed && theta.allOverlaps
    ? 'var(--green)'
    : theta.performed
      ? 'var(--terra-dk)'
      : 'var(--brass-dk)';
  const scaledDiagnostic = theta.requested ? theta.scaledGramDiagnostic : null;
  const scaledStatus = scaledDiagnostic?.performed
    ? scaledDiagnostic.classification.status
    : 'NOT CLASSIFIED';
  const scaledColor = scaledDiagnostic?.performed
    ? scaledStatus.includes('NEGATIVE')
      ? 'var(--terra-dk)'
      : scaledStatus.includes('POSITIVE')
        ? 'var(--green)'
        : 'var(--brass-dk)'
    : 'var(--brass-dk)';

  return (
    <Card accent={statusColor}>
      <div style={{ color: statusColor, fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', letterSpacing: 0.5 }}>
        STATIC ARB/BALL ARTIFACT · FINITE GRAM ONLY
      </div>
      <h3 style={{ color: statusColor, fontSize: 18, margin: '8px 0 10px' }}>Interval-certified finite-Gram calculation</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
        {[
          ['STATUS', certificate.status],
          ['BRIDGE THICKNESS a', certificate.input.a],
          ['NODE COUNT', String(certificate.input.nodes.length)],
          ['PRECISION', `${certificate.selectedPrecisionBits} bits`],
        ].map(([label, value]) => (
          <div key={label} style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
            <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{label}</div>
            <div style={{ color: label === 'STATUS' ? statusColor : 'var(--ink-soft)', marginTop: 4, fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))', overflowWrap: 'anywhere' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, marginTop: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
        <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>CANONICAL CERTIFICATE SHA-256</div>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))', overflowWrap: 'anywhere' }}>{hash}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10, marginTop: 10 }}>
        <div style={{ padding: 10, background: 'var(--paper)', border: `1px solid ${thetaColor}`, borderRadius: 6 }}>
          <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>THETA ↔ COMPLETED-ξ CROSSCHECK</div>
          <div style={{ color: thetaColor, marginTop: 4, fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{thetaStatus}</div>
          {theta.requested && (
            <div style={{ color: 'var(--faint)', marginTop: 4, fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              N={theta.parameters.thetaTerms} · U={theta.parameters.cutoffU} · {theta.selectedPrecisionBits} bits
            </div>
          )}
        </div>
        <div style={{ padding: 10, background: 'var(--paper)', border: `1px solid ${scaledColor}`, borderRadius: 6 }}>
          <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>EVIDENCE-ONLY SCALED K_a/a GRAM</div>
          <div style={{ color: scaledColor, marginTop: 4, fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))', overflowWrap: 'anywhere' }}>{scaledStatus}</div>
          <div style={{ color: 'var(--faint)', marginTop: 4, fontSize: 10 }}>usedForVerdict=false</div>
        </div>
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6, margin: '10px 0 0' }}>
        The theta backend reconstructs <InlineMath math="A_a" /> and <InlineMath math="C_a=B_a/a" /> directly,
        then checks its <InlineMath math="E_a,E_a^{\#}" /> enclosures against an independent completed-ξ evaluation.
        The scaled <InlineMath math="K_a/a" /> Gram is separate evidence only: it does not feed the headline verdict,
        applies only to these finite nodes and this one <InlineMath math="a" />, and does not prove RH.
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: '12px 0 0' }}>
        This result applies only to this prescribed finite Gram matrix, at this one bridge thickness and node set.
        It does not establish positivity for other nodes or shifts, does not close the continuum problem, and does
        not prove RH.
      </p>
      <div style={{ color: 'var(--faint)', fontSize: 10, fontFamily: 'var(--ed-mono, var(--font-mono))', marginTop: 8 }}>
        finiteGramOnly=true · rhClaim=false · rhSolved=false · claimComplete=false
      </div>
    </Card>
  );
}

export default function HiddenSquareProgramPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))', textTransform: 'uppercase', letterSpacing: 1 }}>
            /hidden-square-program · paper {S.paperSections} · pp. {S.paperPageRange}
          </div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>{S.title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6, maxWidth: 760 }}>
            Corrected continuum kernel, measure-zero audit, and arithmetic-block diagnostic. The historical
            §25–27 chain is retained below as a retracted route, not an RH reduction.
          </p>
        </header>

        <StatusNote item="hidden-square" recordsFormulation>
          {S.statusNote.summary}
          <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
            {S.statusNote.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </StatusNote>

        <Card accent={ED.series2}>
          <div style={{ color: 'var(--terra-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', letterSpacing: 0.5 }}>
            2026-08-28 CORRECTION · {SHEAR_KERNEL_REPAIR.grade}
          </div>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 18, margin: '8px 0 10px' }}>The literal diagonal split is withdrawn</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
            In the continuous double integral, <InlineMath math="u=v" /> has two-dimensional Lebesgue measure zero.
            Evaluating the integrand there is algebraically valid, but it does not create a non-zero summand of
            <InlineMath math="K_a" />. A one-dimensional positive core requires a delta measure or an independently
            proved add–subtract identity.
          </p>
          <BlockMath math="r=(u+v)/2,\quad s=(v-u)/2,\quad M(r,s)=\Phi(r-s)\Phi(r+s)" />
          <BlockMath math={'K_a(w,z)=\\frac{2}{\\pi}\\int_0^\\infty\\!\\int_0^r M(r,s)\\left[\\sinh(2ar)\\frac{\\sin(\\Delta r)}{\\Delta}\\cos(\\Sigma s)+\\sinh(2as)\\frac{\\sin(\\Delta s)}{\\Delta}\\cos(\\Sigma r)\\right]ds\\,dr'} />
          <p style={{ color: 'var(--faint)', fontSize: 12, lineHeight: 1.55, margin: 0 }}>
            Here <InlineMath math="\Delta=\bar w-z" /> and <InlineMath math="\Sigma=\bar w+z" />. This paired-coordinate identity is exact;
            constants rescale with the app’s <InlineMath math="\cos(2zu)" /> convention.
          </p>
        </Card>

        <FiniteGramCertificateCard />

        {/* Synthesis diagram up top */}
        <Card accent={ED.series1}>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 12px 0' }}>The corrected research chain</h3>
          <ChainDiagram />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
            The old Volterra contraction is not a valid reduction. The replacement keeps the complete kernel,
            exposes exact theta arithmetic, and asks for interval-certified finite Grams with analytic tails.
            The final all-<InlineMath math="a" />, all-node-set step remains RH-equivalent.
          </p>
        </Card>

        {/* §25 Commutator */}
        <Card>
          <h3 style={{ color: 'var(--brass-dk)', fontSize: 18, margin: '0 0 12px 0' }}>{S.commutator.sectionId} {S.commutator.title}</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>Setup (in the centered variable <InlineMath math="w" />):</p>
          <BlockMath math="X(w) := \xi\!\left(\tfrac{1}{2} + w\right),\quad E_a(z) := X(a - iz),\quad E_a^{\#}(z) := X(-a - iz)" />
          <BlockMath math="K_a(w, z) = \frac{E_a(z)\,\overline{E_a(w)} - E_a^{\#}(z)\,\overline{E_a^{\#}(w)}}{2\pi i\,(\bar{w} - z)}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            Using the completed-kernel representation <InlineMath math="X(w) = \int_0^\infty \Phi(u)\cosh(wu)\,du" />,
            decompose <InlineMath math="E_a(z) = A_a(z) - i B_a(z)" /> with
          </p>
          <BlockMath math="A_a(z) = \int_0^\infty \Phi(u)\cosh(au)\cos(zu)\,du,\quad B_a(z) = \int_0^\infty \Phi(u)\sinh(au)\sin(zu)\,du" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The Wronskian form makes the diagonal-vs-shear split explicit:
          </p>
          <BlockMath math="K_a(w, z) = \frac{A_a(z) B_a(\bar w) - B_a(z) A_a(\bar w)}{\pi(\bar w - z)}" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            Expanding the channel integrals produces an ordinary two-dimensional integral. Since
            <InlineMath math="u=v" /> is null, the region <InlineMath math="u\ne v" /> already carries the entire
            integral almost everywhere. The value of <InlineMath math="C_a" /> on the diagonal defines a useful
            positive comparison expression, but not a literal channel of <InlineMath math="K_a" />.
          </p>

          <Conjecture id="Conj 25.2 — Off-diagonal absorption / hidden square" tone="blue">
            {S.commutator.keyConjecture25_2}
          </Conjecture>
          <Conjecture id="Conj 25.3 — Triangular commutator absorption" tone="blue">
            <BlockMath math="K_a = T_a^*\,K_a^{\rm diag}\,T_a + L_a^* L_a,\quad T_a\text{ Volterra/triangular, built from }\Phi" />
            {S.commutator.keyConjecture25_3}
          </Conjecture>

          <div style={{ marginTop: 14, padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
            <div style={{ color: 'var(--brass-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>§25.7 FINITE-WINDOW CERTIFICATE</div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Build the exact truncated Gram <InlineMath math="G_M=[K_a^{(M)}(z_j,z_k)]" /> from theta blocks.
              If every omitted entry is bounded by <InlineMath math="\varepsilon_M" />, Weyl’s inequality gives the
              finite certificate <InlineMath math="\lambda_{\min}(G_M)-N\varepsilon_M>0" />. This certifies only
              that prescribed finite Gram, not RH.
            </p>
          </div>
        </Card>

        <Card accent={ED.series1}>
          <h3 style={{ color: 'var(--blue)', fontSize: 18, margin: '0 0 8px' }}>Arithmetic divisor-block diagnostic</h3>
          <BlockMath math={'D_N(\\xi)=N^{-i\\xi/4}\\sigma_{i\\xi/2}(N)=\\prod_{p^k\\parallel N}\\frac{\\sin((k+1)\\xi\\log p/4)}{\\sin(\\xi\\log p/4)}'} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Grouping the exact theta-profile products by <InlineMath math="N=nm" /> produces this multiplicative
            phase. It changes sign, so individual blocks cannot be positive; any successful theorem must control
            collective modular cancellation across blocks.
          </p>
          <ArithmeticBlockDiagnostic />
        </Card>

        {/* §26 Measure Domination */}
        <Card>
          <h3 style={{ color: 'var(--terra)', fontSize: 18, margin: '0 0 12px 0' }}>{S.measureDomination.sectionId} Historical comparison-kernel route</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The inserted positive comparison kernel admits a scalar Stieltjes representation. It is not the
            measure-theoretic diagonal of the original double integral. With <InlineMath math="P_{Z,c}(t) = \tfrac{1}{2}(|F_+|^2 + |F_-|^2)" />:
          </p>
          <BlockMath math="\langle c, K_a^{\rm diag}(Z)\,c\rangle = \int_0^\infty P_{Z,c}(\tau)\,d\mu_{a,\Phi}^{\rm diag}(\tau)" />
          <BlockMath math="\frac{d\mu_{a,\Phi}^{\rm diag}}{d\tau} = \frac{1}{2\pi}\int_\tau^\infty \Phi(u)^2 \sinh(2au)\,du" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            A one-dimensional domination inequality would be sufficient only after an exact equality relating this
            comparison kernel to the full <InlineMath math="K_a" />. The historical derivation did not supply that equality.
          </p>

          <Conjecture id="Conj 26.3 — Scalar bridge-domination" tone="terra">
            {S.measureDomination.keyConjecture26_3}
            <div style={{ marginTop: 6 }}>
              <BlockMath math="\mu_{a,\Phi}^{\rm pass} \geq \nu_{a,\Phi}\quad\Rightarrow\quad K_a \succeq 0\ \forall a > 0" />
            </div>
          </Conjecture>

          <Conjecture id="Conj 26.4 — Volterra absorption" tone="terra">
            {S.measureDomination.keyConjecture26_4}
          </Conjecture>

          <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginTop: 10 }}>
            Corrected verdict: retracted as a continuum reduction. Retained as a historical comparison-kernel proposal.
          </p>
        </Card>

        {/* §27 Endpoint-Hankel */}
        <Card accent={ED.series3}>
          <h3 style={{ color: 'var(--green)', fontSize: 18, margin: '0 0 12px 0' }}>{S.endpointHankel.sectionId} {S.endpointHankel.title}</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            The shear measure density is exact:
          </p>
          <BlockMath math="\int \varphi(\tau)\,d\nu_{a,\Phi}(\tau) = \frac{1}{2\pi}\!\int_{0 \le u \le v} \Phi(u)\Phi(v)\sinh(a(v - u)) \int_u^v \varphi(\tau)\,d\tau\,du\,dv" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            So <InlineMath math="\nu_{a,\Phi}" /> is the pushforward of <InlineMath math="\Phi(u)\Phi(v)\sinh(a(v-u))\mathbf{1}_{u \le \tau \le v}" />
            through intervals <InlineMath math="[u, v]" />. A <strong style={{ color: 'var(--green)' }}>Volterra-Hankel</strong> object: past endpoint <InlineMath math="[0, \tau]" />, future tail <InlineMath math="[\tau, \infty)" />.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            Historical endpoint motivation (not a proof of the arithmetic bridge): {S.endpointHankel.whyRawDiagonalCannotDominate}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            For a separately specified bounded operator V, the following block identity is valid.
            Identifying this block with the arithmetic kernel is not established by that identity:
          </p>
          <BlockMath math="\begin{pmatrix} I & V_{a,\Phi} \\ V_{a,\Phi}^* & I \end{pmatrix} \succeq 0\quad\iff\quad \|V_{a,\Phi}\| \le 1" />

          <Conjecture id="Historical Conj 27.2 — withdrawn as a reduction (2026-06-18)" tone="green">
            {S.endpointHankel.keyConjecture27_2}
          </Conjecture>

          <div style={{ marginTop: 14, padding: 12, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)', borderRadius: 6 }}>
            <div style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>HISTORICAL NORM DIAGNOSTIC · NOT ARITHMETIC EVIDENCE</div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              {S.endpointHankel.finiteWindowDiagnostic}
            </p>
          </div>

          <p style={{ color: 'var(--terra-dk)', fontSize: 13, lineHeight: 1.6 }}>
            {S.currentStatus.notice}
          </p>

          {/* Dated withdrawal and the correctly scoped finite matrix criterion. */}
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)', borderLeft: '3px solid var(--terra-dk)', borderRadius: 6 }}>
              <div style={{ color: 'var(--terra-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>§27 VERDICT: REFUTED AS A REDUCTION</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                The claimed biconditional <InlineMath math="\|V_{a,\Phi}\| \le 1 \iff K_a \succeq 0" /> is{' '}
                <strong style={{ color: 'var(--terra-dk)' }}>FALSE</strong> at the genuine Riemann <InlineMath math="\Phi" />:
                the two positivity conditions provably decouple and the bare biconditional cannot be revived
                by any scalar normalization. So <InlineMath math="\|V\| \le 1" /> is not the entire content of no-ghost = RH.
              </p>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 40%, transparent)', borderLeft: '3px solid var(--green)', borderRadius: 6 }}>
              <div style={{ color: 'var(--green)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>FINITE RELATIVE-POSITIVITY CRITERION</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {S.relativePositivity.scope}
              </p>
              <BlockMath math={S.relativePositivity.definitionMath} />
              <BlockMath math={S.relativePositivity.criterionMath} />
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
                {S.relativePositivity.normStatus} {S.relativePositivity.specialCase}
              </p>
              <BlockMath math={S.relativePositivity.counterexampleMath} />
              <p style={{ color: 'var(--faint)', fontSize: 12, lineHeight: 1.6 }}>
                {S.relativePositivity.limitations}
              </p>
            </div>
          </div>
        </Card>

        {/* Implications */}
        <Card accent={ED.series2}>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 18, margin: '0 0 12px 0' }}>Implications for the wider proof program</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(S.implicationsForRH).map(([k, v]) => (
              <div key={k} style={{ padding: 10, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
                <div style={{ color: 'var(--terra-dk)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{k}</div>
                <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Related pages:</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/closure-routes" style={{ color: 'var(--blue)', fontSize: 13 }}>/closure-routes (§16 four routes)</Link>
            <Link to="/blaschke-ghosts" style={{ color: 'var(--blue)', fontSize: 13 }}>/blaschke-ghosts (§17 no-ghost)</Link>
            <Link to="/three-attacks" style={{ color: 'var(--blue)', fontSize: 13 }}>/three-attacks (§18 approaches)</Link>
            <Link to="/freezing-bridge" style={{ color: 'var(--blue)', fontSize: 13 }}>/freezing-bridge (§23 freezing)</Link>
            <Link to="/kyp-bounded-real" style={{ color: 'var(--blue)', fontSize: 13 }}>/kyp-bounded-real (Apps M-O KYP)</Link>
            <Link to="/collapse-chain" style={{ color: 'var(--blue)', fontSize: 13 }}>/collapse-chain (‖V‖ ≤ 1 collapse)</Link>
            <Link to="/section26-conditioning-artifact" style={{ color: 'var(--blue)', fontSize: 13 }}>/section26-conditioning-artifact (§26)</Link>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Source: {S.paperSourcePath} {S.paperSections} (pp. {S.paperPageRange})
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
