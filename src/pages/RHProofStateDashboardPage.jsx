import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { InlineMath } from '../components/KaTeXMath.jsx';
import { IMP2633_L_COND_CONSTANT_DISCHARGE } from '../data/imp-2633-l-cond-constant-discharge.js';
import { TC_PART_VS_MF_LINCHPIN } from '../data/tc-part-vs-mf-linchpin-finding.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from '../data/imp-2641-c-selberg-trudgian-discharge.js';
import { IMP2644_EFLOW_GRONWALL_CG_DISCHARGE } from '../data/imp-2644-eflow-gronwall-cg-discharge.js';
import { MAXFANOUT_STATUS } from '../data/maxfanout-honest-status-2026-06-17.js';
import { STRATEGIC_REFRAME } from '../data/strategic-reframe-pcc-free-volterra-2026-06-17.js';
import { SECTION27_REFUTATION } from '../data/section27-identity-refutation-2026-06-17.js';
import { SECTION26_VERDICT } from '../data/section26-verdict-volterra-not-a-reduction-2026-06-18.js';
import { CAUGHT_OVERCLAIMS } from '../data/overclaim-ledger.js';
import { IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE } from '../data/imp-35653-sbarrier-finite-check-porting-scope.js';
import { IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY } from '../data/imp-35681-w1-w2-w4-existing-infra-inventory.js';
import { IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER } from '../data/imp-35711-postport-parity-no-beat-honest-status-banner.js';
import ProofTierSummary from '../components/ProofTierSummary.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { ED } from '../styles/tokens.js';

// Editorial (warm) re-theme: same structure/data/logic/claims as the original
// dark dashboard, just re-skinned. Every proven/open/withdrawn classification,
// caveat, and number below is unchanged; only the color system moved to the
// warm editorial palette.

// Color mapping — dark-theme hex accents to warm editorial vars.
const RED = 'var(--terra-dk)';    // was #ef4444
const BLUE = 'var(--blue)';       // was #3b82f6 / #38bdf8
const GREEN = 'var(--green)';     // was #10b981
const TERRA = 'var(--terra)';     // was #8b5cf6 (purple, Path A)
const AMBER = 'var(--brass-dk)';  // was #f59e0b / #fbbf24
const BRASS = 'var(--brass)';     // was #22d3ee (private-review accent) / #ec4899 (Path E)
const FAINT = 'var(--faint)';     // was #64748b / #94a3b8 / #475569 (labels, captions)
const INK_SOFT = 'var(--ink-soft)'; // was #94a3b8 (body/description text)
const INK = 'var(--ink)';         // was #e2e8f0 / #f8fafc (headings, emphasized text)

// rgba() literals matching the vars above — CSS custom properties can't be fed
// into rgba() directly, so translucent backgrounds/glows use the resolved RGB.
const RED_A = (a) => `rgba(194,58,28,${a})`;
const BLUE_A = (a) => `rgba(63,107,134,${a})`;
const GREEN_A = (a) => `rgba(76,122,74,${a})`;
const TERRA_A = (a) => `rgba(217,80,46,${a})`;
const AMBER_A = (a) => `rgba(181,138,46,${a})`;
const BRASS_A = (a) => `rgba(140,106,29,${a})`;
const FAINT_A = (a) => `rgba(135,123,103,${a})`;

// Status Badge
function StatusBadge({ status, label }) {
  const colors = {
    active:      { bg: GREEN_A(0.15), border: GREEN_A(0.3), text: GREEN },
    conditional: { bg: AMBER_A(0.15), border: AMBER_A(0.3), text: AMBER },
    blocked:     { bg: RED_A(0.15), border: RED_A(0.3), text: RED },
    research:    { bg: BLUE_A(0.15), border: BLUE_A(0.3), text: BLUE },
  };
  const c = colors[status] || colors.research;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))',
      letterSpacing: '0.03em', verticalAlign: 'middle', marginLeft: 8,
    }}>
      {label}
    </span>
  );
}

// Path Card
function PathCard({ path, title, status, statusLabel, description, progress, blockedBy, links }) {
  const [expanded, setExpanded] = useState(false);
  const pathColors = {
    A: ED.accentDeco, // Hilbert-Pólya (terra) — was purple #8b5cf6
    B: ED.series1, // Darlington (blue)
    C: ED.series3, // Weil Positivity (green)
    D: ED.brassDeco, // Nyman-Beurling (brass-dk) — was amber #f59e0b
    E: ED.brass, // Li Criterion (brass) — was pink #ec4899
  };
  const color = pathColors[path] || ED.inkFaint;

  return (
    <div style={{
      marginBottom: 16, borderRadius: 8, background: 'var(--paper2)',
      border: `1px solid ${color}44`, overflow: 'hidden',
    }}>
      <button
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', gap: 12, width: '100%', padding: '12px 16px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
            background: `${color}22`, color, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))',
          }}>
            {path}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <span style={{ color: INK, fontSize: 14, fontWeight: 600 }}>{title}</span>
              <StatusBadge status={status} label={statusLabel} />
            </div>
            {blockedBy && blockedBy.length > 0 && (
              <div style={{ color: FAINT, fontSize: 12, marginTop: 2 }}>
                Blocked by: {blockedBy.join(', ')}
              </div>
            )}
          </div>
        </div>
        <span style={{
          flexShrink: 0, color: FAINT, fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))',
          userSelect: 'none',
        }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ padding: '12px 16px 16px 60px' }}>
          <div style={{ color: INK_SOFT, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
            {description}
          </div>
          {progress && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: FAINT, marginBottom: 4 }}>Progress</div>
              <div style={{
                height: 6, background: 'var(--paper3)', borderRadius: 3,
                overflow: 'hidden', marginBottom: 4,
              }}>
                <div style={{
                  height: '100%', width: `${progress}%`, background: color,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ fontSize: 11, color: FAINT }}>{progress}% complete</div>
            </div>
          )}
          {links && links.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {links.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    fontSize: 12, color: BLUE, textDecoration: 'none',
                    padding: '4px 8px', background: BLUE_A(0.1),
                    borderRadius: 4, border: `1px solid ${BLUE_A(0.27)}`,
                  }}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Constant Status Badge
function ConstantBadge({ status }) {
  const colors = {
    'RIGOROUSLY-PINNED': { bg: GREEN_A(0.13), border: GREEN_A(0.27), text: GREEN },
    'ORDER-UNITY-PLACEHOLDER': { bg: AMBER_A(0.13), border: AMBER_A(0.27), text: AMBER },
    'PROJECTED-NOT-RIGOROUS': { bg: RED_A(0.13), border: RED_A(0.27), text: RED },
  };
  const style = colors[status] || colors['ORDER-UNITY-PLACEHOLDER'];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 3,
      background: style.bg, border: `1px solid ${style.border}`, color: style.text,
      fontSize: 10, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))',
    }}>
      {status.replace('-', ' ').substring(0, 20)}
    </span>
  );
}

// Section wrapper
function Section({ title, children, borderColor = 'var(--hairline)' }) {
  return (
    <div className="card" style={{ marginBottom: 24, borderLeft: `3px solid ${borderColor}` }}>
      <h2 style={{ color: INK, fontSize: 18, marginBottom: 16, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function RHProofStateDashboardPage() {
  const dashboardDate = ['2026-08-28', SECTION26_VERDICT.date, MAXFANOUT_STATUS.date, STRATEGIC_REFRAME.date, SECTION27_REFUTATION.date]
    .filter(Boolean).sort().pop() || '2026-06-18';
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner variant="PROOF-CANDIDATE" />

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <h1 className="ed-h1">RH Proof State Dashboard</h1>
          <p className="ed-lbl">Related: <Link to="/state-of-program">current summary</Link></p>
          <div
            style={{
              marginTop: 10,
              padding: '8px 12px',
              border: '1px solid var(--terra-dk)',
              borderRadius: 6,
              maxWidth: 760,
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--terra-dk)',
              fontFamily: 'var(--ed-mono, var(--font-mono))',
            }}
          >
            SNAPSHOT 2026-06-18 — this dashboard's data modules are frozen at
            2026-06-17/18; superseded by{' '}
            <Link to="/results" style={{ color: 'var(--terra-dk)' }}>/results</Link> (graded ledger)
            {' + '}
            <Link to="/frontier-dag" style={{ color: 'var(--terra-dk)' }}>/frontier-dag</Link> (live frontier).
          </div>
          <p style={{ color: INK_SOFT, fontSize: 15, lineHeight: 1.6, maxWidth: 760, marginTop: 10 }}>
            Status of all approach vectors and proof strategies as recorded in this snapshot:
            a single-page summary of the Riemann Hypothesis proof landscape through {dashboardDate},
            tracking the subsidiary Newman theorem separately from the still-open RH frontier.
          </p>
        </div>

        {/* Frontier Status — at-a-glance card surfaced as #1 per imp-2993 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 24,
          padding: 16,
          background: 'var(--paper2)',
          borderRadius: 8,
          border: '1px solid var(--hairline)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>PEER-REVIEWED BENCHMARK</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: GREEN, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>&#923; &le; 0.2</div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Platt&#8211;Trudgian 2021 &#8212; unconditional</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>PUBLIC PREPRINT CLAIM</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BLUE, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>&#923; &le; 0.1875</div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Listed; locally repaired; unrefereed</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>candidate</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRASS, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                <Link to="/newman-lambda-01787854-candidate" style={{ color: 'inherit', textDecoration: 'none' }}>&#923; &le; 0.1787854</Link>
              </div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Unrefereed; reviewed by Dan Romik. Computer-assisted candidate for an unconditional proof; bound not established; not RH</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>SHARPER candidate</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRASS, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                <Link to="/lambda-01758354-candidate" style={{ color: 'inherit', textDecoration: 'none' }}>&#923; &le; 0.1758354</Link>
              </div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Four Arb interval gates + Lean-checked y-transfer reduction and Lemma B3; unrefereed; bound not established; not RH</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>COMPLETION CONTRACT &#8212; NOT A BOUND</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                <Link to="/permutation-architecture" style={{ color: 'inherit', textDecoration: 'none' }}>&#923; &le; 0.14</Link>
              </div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Conditional contract, NOT a bound &#8212; one open family |C_E,17| &lt; 0.2796881955526147 on 690988 &le; N &le; 54799999; [B_v,&#928;_p] weld</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>OLDER DYSON BLOCKER</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: RED, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>C_H wall</div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Rigorous upper-bound pending (imp-2642) &#8212; gates E_coll</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>&#167;15&#8211;27 STATUS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: BLUE, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>RH-equivalent</div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Not a reduction &#8212; &#167;27 LINK B refuted</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 2 }}>OVERCLAIMS</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{CAUGHT_OVERCLAIMS.length} caught</div>
              <div style={{ fontSize: 11, color: INK_SOFT }}>Self-corrected &#8212; verification is the asset</div>
            </div>
          </div>
        </div>

        <ProofTierSummary />

        {/* Headline metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>PROOF PATHS</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: GREEN, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>5</div>
            <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4 }}>Active approach vectors</div>
          </div>
          <div className="card" style={{ borderLeft: `4px solid ${BLUE}` }}>
            <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>CRITICAL DEPENDENCY</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: BLUE, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Montgomery PCC</div>
            <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4 }}>Required for unconditional proof</div>
          </div>
          <div className="card" style={{ borderLeft: `4px solid ${AMBER}` }}>
            <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>MAIN BOTTLENECK</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>‖V_{'{a,Φ}'}‖ ≤ 1</div>
            <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4 }}>§15-27 collapse target</div>
          </div>
        </div>

        {/* Proof Paths Section */}
        <Section title="Five Approach Paths" borderColor={TERRA}>
          <p style={{ color: INK_SOFT, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Five fundamentally different strategies for proving RH, each with distinct proof gaps,
            progress, and dependencies. Click each to expand details and see related pages.
          </p>

          <PathCard
            path="A"
            title="Hilbert-Pólya"
            status="research"
            statusLabel="FOUNDATIONAL"
            description="The Twin-Ladder Bridge framework connects zeta zeros to resonances of a Hamiltonian operator. Physical intuition is strong but the rigorous connection between zeta zeros and Hamiltonian eigenvalues remains unproven. This framework motivates all downstream work."
            progress={35}
            blockedBy={['S5']}
            links={[{ label: 'Twin-Ladder Bridge Framework', to: '/zeta' }]}
          />

          <PathCard
            path="B"
            title="Darlington Synthesis"
            status="conditional"
            statusLabel="ZERO/POLE MISMATCH"
            description="Classical network synthesis constrains transmission zeros. For the exact cascade S₂₁(s)=ζ(2s)/ζ(s), non-trivial zeta zeros are generic poles, so losslessness and convergence would still not supply RH without a new pole-confinement bridge."
            progress={15}
            blockedBy={['S4', 'S7']}
            links={[{ label: 'Approach Strategies', to: '/rh-attack' }]}
          />

          <PathCard
            path="C"
            title="Weil Positivity"
            status="active"
            statusLabel="IN DEVELOPMENT"
            description="The de Branges-Romanov formalism reduces RH to positivity of a kernel operator on L². The §15-27 hidden-square program studies ‖V_{'{a,Φ}'}‖ ≤ 1, but the §27 LINK B biconditional (overclaim #6, REFUTED) is FALSE as a Φ-uniform equivalence — so this is information-preservingly RH-equivalent, NOT a shortcut. The ~5000× margin is a homogeneity artifact (imp-1240 measured the scale-miscalibrated bare operator), NOT evidence for Conj 27.2."
            progress={45}
            blockedBy={['S4']}
            links={[{ label: 'Hidden Square Program', to: '/hidden-square-program' }, { label: 'Closure Routes', to: '/closure-routes' }]}
          />

          <PathCard
            path="D"
            title="Nyman-Beurling"
            status="research"
            statusLabel="NOVEL ANGLE"
            description="Density criterion reformulation (1955): complete span of Dirichlet approximants in L² is equivalent to RH. Recently rediscovered as a parallel approach. Strong theoretical foundation but computationally unexplored in this context."
            progress={20}
            blockedBy={[]}
            links={[{ label: 'RH Equivalents', to: '/rh-equivalents' }]}
          />

          <PathCard
            path="E"
            title="Li Criterion"
            status="conditional"
            statusLabel="CONDITIONAL"
            description="Positivity of the logarithmic derivative coefficients λ_n > 0 ∀n ⟺ RH. Computationally elegant and widely studied, but depends on numerical verification of coefficients to a given height. Not a path to unconditional proof without density results."
            progress={40}
            blockedBy={[]}
            links={[{ label: 'Statistics Dashboard', to: '/statistics' }]}
          />
        </Section>

        {/* PCC Route Exhaustion */}
        <Section title="Montgomery Pair Correlation Conjecture (PCC) Routes" borderColor={BLUE}>
          <p style={{ color: INK_SOFT, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Five distinct analytical routes toward proving Montgomery PCC at 2-point, which is
            required for paths B and (conditionally) C. The 2026-05-28 exhaustion audit found all
            five equi-difficult to Montgomery PCC itself: they converge on the same arithmetic
            Cauchy-Schwarz bottleneck — a shared wall, not a shortcut. All five are classified
            DEAD-END-FORNOW (see /pcc-route-exhaustion).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { name: 'Hilbert-Schmidt Sufficient Condition', status: 'blocked', id: 'imp-1267' },
              { name: 'Mellin Diagonalization Route', status: 'blocked', id: 'imp-1266' },
              { name: 'Koksma-Hlawka 2nd Moment', status: 'blocked', id: 'imp-1315' },
              { name: 'GUE-free Deep Regime', status: 'blocked', id: 'imp-1185' },
              { name: 'Bui-Soundararajan Density Approach', status: 'blocked', id: 'imp-1261' },
            ].map((route) => (
              <div key={route.id} style={{
                padding: 12, borderRadius: 8, background: 'var(--paper2)',
                border: `1px solid ${route.status === 'active' ? GREEN_A(0.27) : FAINT_A(0.27)}`,
              }}>
                <div style={{ fontSize: 12, color: INK_SOFT, marginBottom: 4 }}>
                  {route.status === 'active' && '✓ '}
                  {route.status === 'blocked' && '✗ '}
                  {route.status === 'research' && '◇ '}
                </div>
                <div style={{ fontSize: 13, color: INK, marginBottom: 4 }}>{route.name}</div>
                <div style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{route.id}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* E(N) Breakdown and Constants */}
        <Section title="E(N) / Lambda-Bound Status at N* = 10⁴" borderColor={BLUE}>
          {/* Two-level headline: rigorous SOTA vs numerical estimate */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div style={{ padding: 12, background: GREEN_A(0.08), borderRadius: 8, border: `1px solid ${GREEN_A(0.3)}` }}>
              <div style={{ fontSize: 11, color: FAINT, marginBottom: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>PEER-REVIEWED BENCHMARK</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: GREEN, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Λ ≤ 0.2</div>
              <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4 }}>Platt–Trudgian 2021 — unconditional</div>
            </div>
            <div style={{ padding: 12, background: BLUE_A(0.08), borderRadius: 8, border: `1px solid ${BLUE_A(0.3)}` }}>
              <div style={{ fontSize: 11, color: FAINT, marginBottom: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>PUBLIC PREPRINT CLAIM</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BLUE, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Λ ≤ 0.1875</div>
              <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4 }}>Listed; locally repaired; unrefereed</div>
            </div>
            <div style={{ padding: 12, background: AMBER_A(0.08), borderRadius: 8, border: `1px solid ${AMBER_A(0.3)}` }}>
              <div style={{ fontSize: 11, color: FAINT, marginBottom: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>NUMERICAL ONLY (rigor gated)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                Λ ≤ E(N) ≈ {(IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.recomputed.E_coll_rigorous + IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_flow.value + 3.1e-5).toFixed(4)}
              </div>
              <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4 }}>C_H = 1/8 PENDING rigorous upper-bound (imp-2642)</div>
            </div>
          </div>

          {/* Linchpin resolved info box */}
          <div style={{ padding: 12, background: BLUE_A(0.08), borderRadius: 8, border: `1px solid ${BLUE_A(0.25)}`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, marginBottom: 6, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              t_c LINCHPIN RESOLVED 2026-06-17 — Picture A + NEGATIVE on rigorous beat
            </div>
            <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.6 }}>
              Bridge consumes t_c^part (first truncated-flow collision). A1 gives t_c^part ≤{' '}
              {TC_PART_VS_MF_LINCHPIN.computedAtN1e4.tcPartUpperBound_g2over6.toExponential(2)}{' '}
              (Theta(0) = {TC_PART_VS_MF_LINCHPIN.computedAtN1e4.theta0} ≪ 1/4, unconditional). Sign
              algebra: Λ ≤ −t_c + E(N), t_c ≥ 0 ⟹{' '}
              <strong style={{ color: INK }}>Λ ≤ E(N)</strong>. The A1 bound enters the{' '}
              <em>lower</em> face only — no rigorous beat over Platt–Trudgian.
            </div>
          </div>

          {/* E(N) = E_trunc + E_flow + E_coll sub-term breakdown */}
          <div style={{ fontSize: 11, color: FAINT, marginBottom: 8, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            E(N) = E_trunc + E_flow + E_coll at N* = 10⁴
          </div>
          {/* imp-3189: econn-metric-rearchitecture grounded correction */}
          <div style={{ fontSize: 11, color: INK_SOFT, marginBottom: 10, padding: '6px 10px', borderRadius: 5, background: BLUE_A(0.07), border: `1px solid ${BLUE_A(0.22)}`, lineHeight: 1.55 }}>
            <strong style={{ color: BLUE }}>Metric note (econn-rearch, 2026-06-30):</strong>{' '}
            The bracket |&#x39B;+t_c| &le; E_trunc + E_flow + E_coll is a{' '}
            <em>scalar additive triangle inequality over collision times</em>, NOT a global W_1-metric
            statement. E_trunc (height-tail zero-density + Gaussian kernel) and E_flow (per-particle
            RvM drift-tail + Gronwall) are derived against height and measure control respectively &mdash;{' '}
            <strong style={{ color: INK }}>only E_coll uses W_1</strong>. The chain already
            mixes global-in-height and global-in-measure control; the bracket forces no single metric.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
            {/* E_trunc */}
            <div style={{ display: 'flex', gap: 12, padding: '9px 12px', borderRadius: 6, background: GREEN_A(0.06), border: `1px solid ${GREEN_A(0.2)}`, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 80 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: INK, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>E_trunc</div>
                <div style={{ fontSize: 11, color: GREEN, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>3.1×10⁻⁵</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <ConstantBadge status="RIGOROUSLY-PINNED" />
              </div>
              <div style={{ color: INK_SOFT, fontSize: 12, lineHeight: 1.5 }}>
                PT 2021 + Ingham optimal σ=0.75 at T_PT=3×10¹² (imp-447/459) — unconditional, &lt;1% of E(N)
              </div>
            </div>

            {/* imp-35687 status banner: imp-35653 Part D necessary-not-sufficient */}
            <div style={{ padding: '8px 12px', borderRadius: 6, background: AMBER_A(0.06), border: `1px solid ${AMBER_A(0.28)}`, fontSize: 11.5, color: INK_SOFT, lineHeight: 1.6 }}>
              <strong style={{ color: AMBER }}>S_barrier caveat:</strong> E_trunc becomes{' '}
              <em>vestigial / read as EXACTLY ZERO above T_PT</em> only after the non-finite argument-
              principle tail lemma (imp-35653 Part D, work-item W3) is discharged. Platt&ndash;Trudgian
              verified-to-T_PT N_off(T_PT)=0 is the necessary floor this stands on, <strong>not</strong>{' '}
              a substitute for that semi-infinite-tail lemma. No bound is asserted here.
            </div>

            {/* imp-35690: imp-35653 S_barrier porting work-list W1..W4 status table */}
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--paper2)', border: '1px solid var(--hairline)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: INK, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>
                S_barrier porting work-items (imp-35653)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                <tbody>
                  {['W1', 'W2', 'W3', 'W4'].map((w) => {
                    const isFinite_ = w !== 'W3';
                    return (
                      <tr key={w} style={{ borderTop: '1px solid var(--hairline)' }}>
                        <td style={{ padding: '5px 8px 5px 0', fontFamily: 'var(--ed-mono, var(--font-mono))', color: INK, fontWeight: 700, verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                          {w}
                        </td>
                        <td style={{ padding: '5px 8px', color: INK_SOFT, lineHeight: 1.5 }}>
                          {IMP35653_SBARRIER_FINITE_CHECK_PORTING_SCOPE.portWorkItems[w]}
                        </td>
                        <td style={{ padding: '5px 0 5px 8px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                          <ConstantBadge status={isFinite_ ? 'RIGOROUSLY-PINNED' : 'ORDER-UNITY-PLACEHOLDER'} />
                          <span style={{ marginLeft: 6, fontSize: 10.5, color: isFinite_ ? GREEN : AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                            {isFinite_ ? 'FINITE / MECHANICAL' : 'NON-FINITE / BREAKTHROUGH-TIER'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 8 }}>
                <Link to="/viz-imp35710-winding-mesh-cost-delta-ladder" style={{ color: BLUE, fontSize: 12, textDecoration: 'none' }}>
                  Winding-Barrier Mesh-Cost Delta-Ladder chart (imp-35710) →
                </Link>
              </div>
            </div>

            {/* imp-35741 status banner: imp-35681 Part D corrects a scout misattribution */}
            <div style={{ padding: '8px 12px', borderRadius: 6, background: AMBER_A(0.06), border: `1px solid ${AMBER_A(0.28)}`, fontSize: 11.5, color: INK_SOFT, lineHeight: 1.6 }}>
              <strong style={{ color: AMBER }}>Barrier-base provenance correction:</strong>{' '}
              {IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.barrierBaseProvenance.correction} A prior scout
              note misattributed this base to repo <strong>imp-341</strong>, but canonical imp-341 is the
              Close G5_burgers Koksma&ndash;Hlawka result (S7 uniformity of the finite-N empirical Stieltjes
              transform) &mdash; a different thread with no bearing on off-line zero verification to T_PT.
              No bound is asserted here.
            </div>

            {/* imp-35749: imp-35711 PROMINENT-level post-port parity-no-beat status banner */}
            <div style={{ padding: '10px 12px', borderRadius: 6, background: RED_A(0.08), border: `1px solid ${RED_A(0.35)}`, fontSize: 11.5, color: INK, lineHeight: 1.6 }}>
              <strong style={{ color: RED }}>{IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.headline}:</strong>{' '}
              The imp-35654 post-port far-tail bridge becomes asymptotically unconditional (residual
              GUE-conditional share σ&nbsp;&rarr;&nbsp;0) but is <strong>still only parity-with-PT</strong> — the
              ported machinery IS PT&apos;s own Λ&nbsp;&le;&nbsp;0.2 barrier theorem (imp-35419 C2), so it matches
              0.2 and does not beat it. σ is nonzero at every finite N, and C_mb stays GUE-conditional per
              imp-486, untouched by the port. Documentation only — no bound changes.
            </div>

            {/* E_flow */}
            <div style={{ display: 'flex', gap: 12, padding: '9px 12px', borderRadius: 6, background: AMBER_A(0.06), border: `1px solid ${AMBER_A(0.2)}`, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 80 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: INK, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>E_flow</div>
                <div style={{ fontSize: 11, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  {(IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_flow.value * 1e3).toFixed(2)}×10⁻³
                </div>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ConstantBadge status="RIGOROUSLY-PINNED" />
                <ConstantBadge status="ORDER-UNITY-PLACEHOLDER" />
              </div>
              <div style={{ color: INK_SOFT, fontSize: 12, lineHeight: 1.5 }}>
                C_F = {IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_flow.C_F.toFixed(4)} RIGOROUS (imp-398).
                C_G = 2/y_star² ≤ {IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.cG.gronwallExplicit} explicit (Gronwall Lemma B); E_flow ≤ 1.3×10⁻³ for all C_G ≤ {IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.cG.C_G_max_A1} on the A1 |t_c| bound — discharged imp-2644
              </div>
            </div>

            {/* E_coll — PARTIAL, not RIGOROUSLY-PINNED: C_H pending (imp-2642) */}
            <div style={{ display: 'flex', gap: 12, padding: '9px 12px', borderRadius: 6, background: AMBER_A(0.06), border: `1px solid ${AMBER_A(0.2)}`, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 80 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: INK, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>E_coll</div>
                <div style={{ fontSize: 11, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  {IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.recomputed.E_coll_rigorous.toFixed(4)}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <ConstantBadge status="ORDER-UNITY-PLACEHOLDER" />
              </div>
              <div style={{ color: INK_SOFT, fontSize: 12, lineHeight: 1.5 }}>
                C_Selberg discharged → {IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.rigorousExplicit} (Trudgian 2014, imp-2641; E-T bridge O(1) residual).
                C_H = 1/8 PENDING rigorous upper-bound verification (imp-2642). Dominant sub-term ~90% of E(N).
              </div>
            </div>

            {/* E(N) total */}
            <div style={{ display: 'flex', gap: 12, padding: '9px 12px', borderRadius: 6, background: FAINT_A(0.06), border: `1px solid ${FAINT_A(0.2)}`, alignItems: 'center' }}>
              <div style={{ flexShrink: 0, width: 80 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: INK, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>E(N)</div>
                <div style={{ fontSize: 11, color: INK_SOFT, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  ≈ {(IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.recomputed.E_coll_rigorous + IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_flow.value + 3.1e-5).toFixed(4)}
                </div>
              </div>
              <div style={{ color: INK_SOFT, fontSize: 12 }}>
                <strong style={{ color: INK }}>
                  {(0.2 / (IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.recomputed.E_coll_rigorous + IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_flow.value + 3.1e-5)).toFixed(0)}×
                </strong>{' '}
                below Platt–Trudgian 0.2 — not yet rigorous (C_H + E-T bridge constant pending).
                This is the older Dyson lane; the separate candidate{' '}
                <strong style={{ color: BRASS }}>Λ ≤ 0.1787854</strong> uses the fixed-height
                barrier route and does not discharge C_H. It is an unrefereed computer-assisted
                candidate for an unconditional proof; the bound is not established and it is not RH.
              </div>
            </div>
          </div>
        </Section>

        {/* V-norm Collapse */}
        <Section title="§15-27 Hidden Square Program" borderColor={AMBER}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <h3 style={{ color: AMBER, fontSize: 14, marginBottom: 8 }}>The Collapse</h3>
              <p style={{ color: INK_SOFT, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                7+ named paper conjectures (16.4, 16.6, 17.3, 18.1, 25.2/25.3, 26.3/26.4, 27.2)
                all reduce to a single statement:
              </p>
              <div style={{
                padding: 12, background: AMBER_A(0.1), borderRadius: 8,
                border: `1px solid ${AMBER_A(0.27)}`, marginBottom: 12,
              }}>
                <div style={{ fontSize: 12, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))', lineHeight: 1.8 }}>
                  ‖V_{'{a,Φ}'}‖_{'{L²}'}([0,∞)) ≤ 1<br />
                  for every a &gt; 0
                </div>
              </div>
              <p style={{ color: FAINT, fontSize: 12, lineHeight: 1.6 }}>
                The §27 LINK B biconditional that would make this bound sufficient is{' '}
                <strong style={{ color: RED }}>REFUTED</strong> (overclaim #6): {SECTION27_REFUTATION.collapseConsequence}.
                The surviving target is RH-EQUIVALENT, not a reduction — {SECTION26_VERDICT.verdict}.
              </p>
            </div>

            <div>
              <h3 style={{ color: GREEN, fontSize: 14, marginBottom: 8 }}>Empirical Support</h3>
              <div style={{
                padding: 12, background: GREEN_A(0.1), borderRadius: 8,
                border: `1px solid ${GREEN_A(0.27)}`, marginBottom: 12,
              }}>
                <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, marginBottom: 4 }}>
                  ‖V‖ ≤ 1.86×10⁻⁴
                </div>
                <div style={{ fontSize: 11, color: INK_SOFT }}>
                  60+ grid points, U ≤ 100, N ≤ 10100
                </div>
              </div>
              <div style={{ color: INK_SOFT, fontSize: 12, lineHeight: 1.6 }}>
                <strong>Distance to saturation:</strong> ~5000× — but this is a{' '}
                <strong style={{ color: AMBER }}>homogeneity artifact, NOT evidence for Conj 27.2</strong>:{' '}
                {SECTION26_VERDICT.fiveThousandXArtifact}. The bare V is degree-2 homogeneous, so the
                margin scales with the (arbitrary) Φ normalization; it does not indicate proximity to an
                unconditional proof.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Link to="/hidden-square-program" style={{
              display: 'inline-block', padding: '8px 12px', background: AMBER_A(0.15),
              border: `1px solid ${AMBER_A(0.27)}`, borderRadius: 4, color: AMBER,
              fontSize: 12, fontWeight: 600, textDecoration: 'none',
            }}>
              Full Hidden Square Program →
            </Link>
          </div>
        </Section>

        {/* Transparency Ledger + Gap-Map */}
        <Section title="Corrections Log: claims since corrected" borderColor={RED}>
          <p style={{ color: INK_SOFT, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Internal record of claims that overreached the evidence during development and have since
            been corrected.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {CAUGHT_OVERCLAIMS.map((oc) => (
              <div key={oc.n} style={{
                display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 6,
                background: RED_A(0.05), border: `1px solid ${RED_A(0.18)}`,
              }}>
                <div style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: RED_A(0.18), color: RED,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginTop: 1,
                }}>{oc.n}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, color: INK, fontWeight: 600 }}>{oc.claim}</span>
                    <span style={{
                      padding: '1px 7px', borderRadius: 3,
                      background: RED_A(0.18), color: RED,
                      fontSize: 10, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))',
                    }}>{oc.badge}</span>
                  </div>
                  <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.5 }}>{oc.correction}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: INK, fontSize: 14, marginBottom: 10, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>Gap-Map</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, background: GREEN_A(0.08), border: `1px solid ${GREEN_A(0.28)}` }}>
              <div style={{ fontSize: 10, color: GREEN, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>PEER-REVIEWED BENCHMARK</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: GREEN, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>Λ ≤ 0.2</div>
              <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.5 }}>Platt–Trudgian 2021 — unconditional</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: BLUE_A(0.08), border: `1px solid ${BLUE_A(0.28)}` }}>
              <div style={{ fontSize: 10, color: BLUE, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>PUBLIC, UNREFEREED PACKAGE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: BLUE, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>Λ ≤ 0.1875</div>
              <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.5 }}>Optimization Problems ledger entry; omitted finite tile repaired locally; not peer review.</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: AMBER_A(0.08), border: `1px solid ${AMBER_A(0.28)}` }}>
              <div style={{ fontSize: 10, color: AMBER, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>NUMERICAL ESTIMATE — NOT RIGOROUS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: AMBER, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>Λ ≤ E(N) ≈ 0.013</div>
              <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.5 }}>{MAXFANOUT_STATUS.finiteNbeat}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: BLUE_A(0.08), border: `1px solid ${BLUE_A(0.28)}` }}>
              <div style={{ fontSize: 10, color: BLUE, fontWeight: 700, fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>VOLTERRA: PCC-FREE — COLLAPSE REFUTED</div>
              <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.5, marginBottom: 6 }}>
                <strong style={{ color: BLUE }}>PCC-free:</strong> {STRATEGIC_REFRAME.honestGuard}
              </div>
              <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.5 }}>
                <strong style={{ color: RED }}>Real gap:</strong> {SECTION27_REFUTATION.rigorStatus}
              </div>
            </div>
          </div>
        </Section>

        {/* Recommended Reading */}
        <Section title="Navigate the Proof Landscape" borderColor={ED.rule}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div style={{ padding: 12, background: 'var(--paper2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>PROOF FRAMEWORKS</div>
              <Link to="/proof-overview" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>
                Proof Overview →
              </Link>
            </div>
            <div style={{ padding: 12, background: 'var(--paper2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>APPROACH STRATEGIES</div>
              <Link to="/rh-attack" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>
                RH Approach Strategies →
              </Link>
            </div>
            <div style={{ padding: 12, background: 'var(--paper2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>VISUALIZATIONS</div>
              <Link to="/visualizations" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>
                Viz Index →
              </Link>
            </div>
            <div style={{ padding: 12, background: 'var(--paper2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>HISTORIC PAPER ROADMAP</div>
              <Link to="/papers" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>
                Historic twin-ladder paper details →
              </Link>
            </div>
            <div style={{ padding: 12, background: 'var(--paper2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>PCC EXHAUSTION</div>
              <Link to="/pcc-route-exhaustion" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>
                5 Routes Summary →
              </Link>
            </div>
            <div style={{ padding: 12, background: 'var(--paper2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: FAINT, marginBottom: 4 }}>IMPROVEMENTS LOG</div>
              <Link to="/improvements" style={{ color: BLUE, fontSize: 13, textDecoration: 'none' }}>
                All Sessions →
              </Link>
            </div>
          </div>
        </Section>

        {/* Footer note — related links + atlas */}
        <div style={{
          marginTop: 32, padding: 16, background: 'var(--paper2)', borderRadius: 8,
          border: '1px solid var(--hairline)',
        }}>
          <p style={{ color: INK_SOFT, fontSize: 12, lineHeight: 1.6, margin: '0 0 12px' }}>
            This dashboard reflects the state as of <strong>{dashboardDate}</strong>. The five proof paths
            represent the full landscape of approaches being pursued. Updates to this dashboard are
            logged via the improvements engine. For the latest session activity, see the{' '}
            <Link to="/improvements" style={{ color: BLUE, textDecoration: 'none' }}>improvements log</Link>.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/proof-overview" style={{ color: BLUE, fontSize: 12, textDecoration: 'none' }}>Proof Overview</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/rh-attack" style={{ color: BLUE, fontSize: 12, textDecoration: 'none' }}>RH Approach Strategies</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/hidden-square-program" style={{ color: AMBER, fontSize: 12, textDecoration: 'none' }}>Hidden Square Program</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/pcc-route-exhaustion" style={{ color: FAINT, fontSize: 12, textDecoration: 'none' }}>PCC Route Exhaustion</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/connes-adelic" style={{ color: BLUE, fontSize: 12, textDecoration: 'none' }}>Connes Adelic Trace</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/berry-keating-xp" style={{ color: BLUE, fontSize: 12, textDecoration: 'none' }}>Berry-Keating H = xp</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: INK_SOFT, fontSize: 12, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
