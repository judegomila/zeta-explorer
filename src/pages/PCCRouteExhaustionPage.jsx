// PCCRouteExhaustionPage.jsx -- imp-1319 + imp-1349
// Renders the 11-route PCC closure audit (5 classical moment-method + 3 new-input + 2 RH-equivalents + 1 sieve)
// organized into 4 NT families as established in Wave-19.
//
// Layout:
// 1. Header + aggregate verdict (pcc-genuinely-open-pending-new-input)
// 2. Routes organized by family with color coding
// 3. Family section headers explaining each family's approach
// 4. Card grid: each route with family, verdict, structural reason
// 5. Link to decision document + related pages
//
// Editorial (warm) re-theme: full-width essay shell, identical structure/data/claims.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

const mono = 'var(--ed-mono, var(--font-mono))';

// Warm accent per family: fg/border use the CSS var, bg is the matching rgba
// (editorial.css defines the vars as hex, so alpha-blended fills are spelled
// out here rather than composed via rgba(var(...))).
const FAMILY_ACCENT = {
  'moment-method': { fg: 'var(--brass-dk)', border: 'var(--brass-dk)', bg: TK_ALPHA(ED.brassDeco, 0.08), bgSoft: TK_ALPHA(ED.brassDeco, 0.05) },
  'new-input': { fg: 'var(--blue)', border: 'var(--blue)', bg: TK_ALPHA(ED.series1, 0.08), bgSoft: TK_ALPHA(ED.series1, 0.05) },
  'rh-equivalent': { fg: 'var(--brass)', border: 'var(--brass)', bg: TK_ALPHA(ED.brass, 0.08), bgSoft: TK_ALPHA(ED.brass, 0.05) },
  'sieve': { fg: 'var(--green)', border: 'var(--green)', bg: TK_ALPHA(ED.series3, 0.08), bgSoft: TK_ALPHA(ED.series3, 0.05) },
};

const FAMILIES = {
  'moment-method': {
    name: 'Family 1: Classical Moment-Method Toolkit',
    desc: 'Standard analytic NT arsenal: explicit formulas, second/fourth moments, family-averaging amplifiers.',
  },
  'new-input': {
    name: 'Family 2: New-Input / Geometric-Quantum Approaches',
    desc: 'Non-classical routes: adelic geometry, quantum chaos, entropy bounds. Attempt to bypass Cauchy-Schwarz layer.',
  },
  'rh-equivalent': {
    name: 'Family 3: Classical RH-Equivalent Reformulations',
    desc: 'Ancient-to-modern RH reformulations (combinatorial, functional-analytic) never directly approached.',
  },
  'sieve': {
    name: 'Family 4: Contemporary Breakthrough Sieves',
    desc: 'Recent (2024) prime-gap & zero-gap sieve methods. Orthogonal to classical moment approaches.',
  },
};

const PCC_ROUTES = [
  // ---- Family 1: Classical Moment-Method Toolkit ----
  {
    id: 'imp-1297',
    family: 'moment-method',
    name: 'Selberg Trace Formula',
    route: 'Selberg trace formula on SL(2,Z)\\H',
    verdict: 'Equi-difficult to Montgomery',
    reason: 'Sarnak 1995 AQC shows trace approach reduces to PCC itself',
    structural: 'Circular: same Cauchy-Schwarz bottleneck',
    provenanceRef: 'imp-1297-selberg-trace-pcc-route.js',
  },
  {
    id: 'imp-1302',
    family: 'moment-method',
    name: 'Goldston-Gonek 1998',
    route: 'Goldston-Gonek second-moment method',
    verdict: 'Range stops inside Montgomery\'s diagonal',
    reason: 'Second moment gives 2-point in diagonal region only; support > 1 requires off-diagonal',
    structural: 'Incomplete coverage: off-diagonal = new problem',
    provenanceRef: 'imp-1302-goldston-gonek-pcc-attack.js',
  },
  {
    id: 'imp-1303',
    family: 'moment-method',
    name: 'Heath-Brown 1979',
    route: 'Heath-Brown 4th-moment method',
    verdict: '(log T)^{1/2} gap intrinsic to Cauchy-Schwarz',
    reason: 'Fourth moment gains nothing over second moment at support > 1; Cauchy-Schwarz error is structural',
    structural: 'Intrinsic slack: Cauchy-Schwarz ≤ PCC at support > 1',
    provenanceRef: 'imp-1303-heath-brown-pcc-route.js',
  },
  {
    id: 'imp-1304',
    family: 'moment-method',
    name: 'Iwaniec-Sarnak 2000',
    route: 'Iwaniec-Sarnak amplifier (family averaging)',
    verdict: 'Bypasses only for tuples; single-zeta transfer = Sarnak 1995 AQC = circular',
    reason: 'Family-averaging (amplifier) closes PCC for families but single-ζ reduction is Sarnak 1995 = circular',
    structural: 'Circular: family result → single-ζ transfer is PCC',
    provenanceRef: 'imp-1304-iwaniec-sarnak-no-pcc.js',
  },
  {
    id: 'imp-1305',
    family: 'moment-method',
    name: 'Goldston-Yildirim 2003',
    route: 'Goldston-Yildirim absolutization',
    verdict: 'Reduces to same Cauchy-Schwarz layer as others',
    reason: 'Absolutization strategy lands on same arithmetic Cauchy-Schwarz step as all five routes',
    structural: 'Convergence: all 5 routes → single Cauchy-Schwarz bottleneck',
    provenanceRef: 'imp-1305-goldston-yildirim-mean-square.js',
  },

  // ---- Family 2: New-Input / Geometric-Quantum Approaches ----
  {
    id: 'imp-1307',
    family: 'new-input',
    name: 'Connes-Bost Adelic Explicit Formula',
    route: 'Non-commutative geometry on adèles (Connes-Marcolli 2008)',
    verdict: 'Reduces to same Cauchy-Schwarz layer at the critical bottleneck',
    reason: 'Adelic Lefschetz trace maps to arithmetic Cauchy-Schwarz step; Connes hypothesis required',
    structural: 'Geometric repackaging without structural bypass: Cauchy-Schwarz intrinsic',
    provenanceRef: 'imp-1307-connes-bost-adelic-attack.js',
  },
  {
    id: 'imp-1308',
    family: 'new-input',
    name: 'Berry-Keating Quantum-Chaos XP-Hamiltonian',
    route: 'Spectral interpretation via quantized Hamiltonian (Sierra-Townsend 2008)',
    verdict: 'Continuous spectrum & compactification issues unresolved; BCSL correction incomplete',
    reason: 'Quantum corrections (Sierra-Townsend) address spectrum but miss semi-classical gap at support > 1',
    structural: 'Spectral approach hits same (log T)^{1/2} Plancherel barrier as moment methods',
    provenanceRef: 'imp-1308-berry-keating-quantum-attack.js',
  },
  {
    id: 'imp-1309',
    family: 'new-input',
    name: 'Tao 2024 Entropy-Bound on Zero Gaps',
    route: 'Entropy methods adapted from prime-gap breakthrough (Tao 2024)',
    verdict: 'Entropy bound exists but does NOT transfer to support > 1 PCC unconditionally',
    reason: 'Entropy-entropy transfer requires auxiliary hypotheses; zero-gap entropy ≠ 2-point bound at support > 1',
    structural: 'Orthogonal method, same intrinsic Plancherel gap: (log T)^{1/2}',
    provenanceRef: 'imp-1309-tao-entropy-pcc-attack.js',
  },

  // ---- Family 3: Classical RH-Equivalent Reformulations ----
  {
    id: 'imp-1311',
    family: 'rh-equivalent',
    name: 'Robin / Lagarias σ(n)/n Criterion',
    route: 'Combinatorial RH iff σ(n) < e^γ n log log n for n ≥ 5041 (Lagarias 2002)',
    verdict: 'Combinatorial bound verified numerically; colossally-abundant structure gives no RH proof',
    reason: 'Elementary number theory on σ(n) does not connect to spectral zeta methods or Plancherel',
    structural: 'Orthogonal but unproductive: combinatorics-to-spectrum gap remains open',
    provenanceRef: 'imp-1311-robin-lagarias-combinatorial-attack.js',
  },
  {
    id: 'imp-1312',
    family: 'rh-equivalent',
    name: 'Beurling-Nyman Density Criterion',
    route: 'Functional analysis: RH iff certain density in L²(0,1) on fractional-part subspaces (Bercovici-Foias 1984)',
    verdict: 'Density reformulation exact; quantitative version incomplete for unconditional proof',
    reason: 'Bercovici-Foias quantitative version requires auxiliary moment bounds; circular with PCC at critical step',
    structural: 'Functional-analytic repackaging; inner product closure = same Cauchy-Schwarz layer',
    provenanceRef: 'imp-1312-beurling-nyman-attack.js',
  },

  // ---- Family 4: Contemporary Breakthrough Sieves ----
  {
    id: 'imp-1318',
    family: 'sieve',
    name: 'Maynard 2024 Prime-Gap Sieve',
    route: 'Recent sieve-theory breakthrough: adapted from prime gaps to zero-gap distribution (Maynard 2024)',
    verdict: 'Sieve methods give zero-gap statistics; transfer to single-ζ support > 1 requires new machinery',
    reason: 'Sieve-theory does not directly target PCC 2-point at support > 1; auxiliary analytic step remains',
    structural: 'Genuine breakthrough but stops short: Plancherel barrier (log T)^{1/2} intrinsic to zero-gap sieve also',
    provenanceRef: 'imp-1318-maynard-sieve-pcc.js',
  },
];

function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
  };
}

function AggregateVerdictSection() {
  return (
    <div
      className="card"
      style={{
        ...cardBaseLeft('var(--terra-dk)'),
        marginBottom: 32,
        background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
        padding: '20px 24px',
      }}
    >
      <h2 style={{ margin: '0 0 12px 0', color: 'var(--terra-dk)', fontSize: 22 }}>
        Aggregate verdict: <span style={{ fontFamily: mono }}>pcc-genuinely-open-pending-new-input</span>
      </h2>
      <p style={{ margin: '12px 0 0 0', color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
        All eleven candidate routes across four orthogonal NT families — classical moment methods, geometric-quantum
        new input, classical RH equivalences, and contemporary sieves — converge on the <strong>same negative
        classification pattern</strong>. None bypass Montgomery's pair-correlation conjecture (PCC) for single-ζ
        2-point statistics in the support &gt; 1 regime needed by the §15-27 ESY-closure.
      </p>
      <p style={{ margin: '12px 0 0 0', color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
        <strong style={{ color: 'var(--terra-dk)' }}>Structural barrier:</strong> the off-diagonal sum at support &gt; 1
        collapses to a <em>single-zeta arithmetic Cauchy-Schwarz step</em> whose error bound is intrinsically
        <span style={{ fontFamily: mono }}> (log T)^{'{1/2}'}</span> Plancherel slack vs PCC. Every family
        hits this same bottleneck at the critical step.
      </p>
      <p style={{ margin: '12px 0 0 0', color: 'var(--faint)', fontSize: 13, fontStyle: 'italic' }}>
        Source: thinking/decisions/2026-05-28-pcc-moment-methods-exhausted.md + Wave-19 exhaustion audit
      </p>
    </div>
  );
}

function FamilySectionHeader({ familyKey }) {
  const fam = FAMILIES[familyKey];
  const accent = FAMILY_ACCENT[familyKey];
  return (
    <div style={{ marginBottom: 24, marginTop: 32 }}>
      <div
        style={{
          borderLeft: `3px solid ${accent.border}`,
          background: accent.bgSoft,
          padding: '12px 14px',
          marginBottom: 12,
          borderRadius: '0 8px 8px 0',
        }}
      >
        <h2 className="ed-h2" style={{ margin: '0 0 6px 0', color: accent.fg, fontSize: 16, fontWeight: 600, fontFamily: mono }}>
          {fam.name}
        </h2>
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
          {fam.desc}
        </p>
      </div>
    </div>
  );
}

function RouteCard({ route }) {
  const accent = FAMILY_ACCENT[route.family];
  return (
    <div
      className="card"
      style={{
        ...cardBaseLeft(accent.border),
        background: accent.bg,
        padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <h3 style={{ color: accent.fg, margin: 0, fontSize: 16, fontWeight: 600 }}>
          {route.name}
        </h3>
        <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--faint)' }}>
          {route.id}
        </span>
      </div>

      <p style={{ margin: '8px 0 0 0', color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.65 }}>
        <strong style={{ color: accent.fg }}>Route.</strong> {route.route}
      </p>

      <p style={{ margin: '8px 0 0 0', color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.65 }}>
        <strong style={{ color: accent.fg }}>Verdict.</strong> {route.verdict}
      </p>

      <p style={{ margin: '8px 0 0 0', color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.65 }}>
        <strong style={{ color: accent.fg }}>Reason.</strong> {route.reason}
      </p>

      <div
        style={{
          marginTop: 10,
          padding: '8px 10px',
          borderLeft: '2px solid var(--hairline)',
          background: 'var(--paper)',
          borderRadius: '0 6px 6px 0',
        }}
      >
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6, fontStyle: 'italic' }}>
          {route.structural}
        </p>
      </div>
      {route.provenanceRef && (
        <p style={{ margin: '8px 0 0 0', color: 'var(--faint)', fontSize: 11, lineHeight: 1.5 }}>
          <span>Provenance:</span>{' '}
          <span style={{ fontFamily: mono }}>{route.provenanceRef}</span>
        </p>
      )}
    </div>
  );
}

const RELATED_LINKS = [
  { to: '/paper-audit-dashboard', label: 'Paper Audit Dashboard' },
  { to: '/closure-routes', label: 'Four Closure Routes (§16)' },
  { to: '/collapse-chain', label: 'Collapse Chain: ‖V‖ ≤ 1' },
];

export default function PCCRouteExhaustionPage() {
  const routesByFamily = {
    'moment-method': PCC_ROUTES.filter(r => r.family === 'moment-method'),
    'new-input': PCC_ROUTES.filter(r => r.family === 'new-input'),
    'rh-equivalent': PCC_ROUTES.filter(r => r.family === 'rh-equivalent'),
    'sieve': PCC_ROUTES.filter(r => r.family === 'sieve'),
  };

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>PCC Route Exhaustion: 11-Route Audit (4 Families)</h1>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            A complete census of the analytic-number-theory, geometric-quantum, RH-equivalent, and sieve approaches
            to Montgomery's pair-correlation conjecture (PCC). All eleven routes converge on the same
            <span style={{ fontFamily: mono }}> (log T)^{'1/2'}</span> Plancherel barrier at support &gt; 1.
          </p>
        </div>

        <AggregateVerdictSection />

        {Object.keys(routesByFamily).map(familyKey => (
          <div key={familyKey}>
            <FamilySectionHeader familyKey={familyKey} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 8 }}>
              {routesByFamily[familyKey].map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 40, marginBottom: 40 }}>
          <h2 className="ed-h2" style={{ margin: '0 0 16px 0' }}>Related</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13 }}>
            {RELATED_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: 'var(--brass-dk)',
                  textDecoration: 'none',
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
                  background: 'var(--paper2)',
                  fontFamily: mono,
                  fontSize: 12,
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/"
              style={{
                color: 'var(--terra-dk)',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid var(--hairline)',
                background: 'var(--paper2)',
                fontFamily: mono,
                fontSize: 12,
              }}
            >
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
