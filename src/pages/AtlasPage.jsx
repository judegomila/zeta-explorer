import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import { GRADE_META } from '../data/graded-results.js';
import { FRONTIER_DAG } from '../data/frontier-dag.js';
import { THREADS_META } from '../data/research-threads.js';
import { STATUS } from '../styles/tokens.js';

/* The Atlas — a high-level portal into the approach map. Every line of approach
   on RH / Λ, grouped by the six route-map clusters, each a card that drops you
   into that part of the app. The dense route table lives on /route-map; this is
   the map above it. Rendered under .ed-root so the editorial theme applies. */

// Per-cluster framing + a few curated entry-point pages (the cluster rows in the
// route map are descriptions, not links, so these are the real doors into each area).
const AREAS = [
  {
    key: 'lambdaUpper', wireframe: 'de-bruijn-track',
    title: 'Λ Upper-Bound Routes',
    blurb: 'Every route that tries to push the de Bruijn–Newman bound Λ below the Platt–Trudgian 0.2 — the barrier method, the finite-N beat, the Burgers lim-sup, and where each one funnels into the C_H wall. Newest: the permutation architecture, a conditional Λ ≤ 0.14 completion contract (a contract, not a bound) with one open coefficient family.',
    entryPoints: [
      { to: '/lambda-bounds', label: 'The bounds ledger' },
      { to: '/verified-height-lever', label: 'The one lever below 0.2' },
      { to: '/theorem-b-threshold', label: 'Theorem-B threshold' },
      { to: '/pt-floor-audit', label: 'What binds the floor' },
      { to: '/permutation-architecture', label: 'The freeze calculus & the 0.14 contract' },
    ],
  },
  {
    key: 'directRH', wireframe: 'contour-winding',
    title: 'Direct-RH Routes',
    blurb: 'Reformulations that approach RH itself, not via Λ — Volterra ‖V‖ ≤ 1, Beurling–Nyman, de Branges, the hidden-square program. Most are information-preserving renames of RH, not shortcuts below it.',
    entryPoints: [
      { to: '/collapse-chain', label: 'The ‖V‖ ≤ 1 collapse' },
      { to: '/rh-equivalents', label: 'RH-equivalents' },
      { to: '/shift-bridge-positivity', label: 'Shift-bridge positivity' },
      { to: '/hidden-square-program', label: 'Hidden-square program' },
    ],
  },
  {
    key: 'machineryCrossvalLower', wireframe: 'heat-flow',
    title: 'Machinery · Cross-Validation · Lower Bounds',
    blurb: 'The rigorous instruments — heat-discriminant t_c, the theta-trap algebra, independent integrators — plus the Rodgers–Tao Λ ≥ 0 lower side. Tools that sharpen constants without themselves closing RH.',
    entryPoints: [
      { to: '/dyson-verifier', label: 'Dyson verifier' },
      { to: '/theta-basin-closure', label: 'Theta-basin closure' },
      { to: '/rigor-dashboard', label: 'Rigor dashboard' },
    ],
  },
  {
    key: 'literaturePCC', wireframe: 'pair-correlation',
    title: 'Literature Ports & the Montgomery-PCC Surface',
    blurb: 'Ports of the published machinery — Guth–Maynard, Goldston–Gonek, Maynard sieve, Conrey–Snaith — and where each hits the 50-year pair-correlation-conjecture wall.',
    entryPoints: [
      { to: '/guth-maynard-scoping', label: 'Guth–Maynard scoping' },
      { to: '/pcc-route-exhaustion', label: 'PCC route exhaustion' },
      { to: '/literature', label: 'The literature' },
    ],
  },
  {
    key: 'originalIdeas', wireframe: 'zeta-zero-vortex',
    title: 'Original / Novel-Angle Ideas',
    blurb: 'The project’s own angles and the classical Hilbert–Pólya family — Berry–Keating H = xp, Connes adelic / Weil positivity, Voronin universality, the supercritical-fluid thermodynamics.',
    entryPoints: [
      { to: '/berry-keating-xp', label: 'Berry–Keating H = xp' },
      { to: '/connes-adelic', label: 'Connes adelic' },
      { to: '/voronin-universality', label: 'Voronin universality' },
      { to: '/supercritical', label: 'Supercritical fluid' },
    ],
  },
  {
    key: 'permutationFreeze', wireframe: 'gram-matrix',
    title: 'Post-Freeze Frontier (permutation architecture)',
    blurb: 'The routes opened after the 2026-06-19 freeze by the permutation-architecture campaign: the conditional Λ ≤ 0.14 completion contract (a contract, not a bound) reduced to one open coefficient family |C_E,17| < 0.2797, the imp-95008 weld alias bracket, and the gate-ranked producer/probe lanes around it. The frontier after 2026-08 (y-thaw package, Route VII floor) is tracked on the frontier DAG and the research threads.',
    entryPoints: [
      { to: '/permutation-architecture', label: 'The freeze calculus & the 0.14 contract' },
      { to: '/lambda-bounds', label: 'The bounds ledger' },
      { to: '/frontier-dag', label: 'The live frontier DAG' },
      { to: '/threads', label: 'Research threads' },
    ],
  },
];

// Grade → chip color, taken verbatim from the graded-results ledger.
const GRADE_COLOR = Object.fromEntries(GRADE_META.map((g) => [g.grade, g.color]));

// SEVENTH SECTION — the work discovered SINCE the 2026-06-19 route-map freeze,
// so it is not in FULL_ROUTE_MAP. Sourced from frontier-dag / research-threads /
// graded-results; each card carries its verbatim honesty grade. NO QED.
const FRONTIER_CARDS = [
  {
    title: 'Conditional Λ ≤ 0.14 completion contract',
    grade: 'contract-not-a-bound',
    body: 'The fail-closed permutation-architecture contract, reduced to one open coefficient family |C_E,17| < 0.2797. Establishes no bound — it is a contract that closes only if the family is identified.',
    links: [{ to: '/permutation-architecture', label: 'The freeze calculus & 0.14 contract' }, { to: '/lambda-bounds', label: 'Bounds ledger' }],
  },
  {
    title: 'y-thaw · the 0.17759432 package',
    grade: 'candidate-unrefereed',
    body: 'A delivered-face y-thaw of the sealed 0.1787854 candidate (129/800 + 0.1808²/2). 2 of 6 obligations closed (O3, O5, certified across three integrators); O1, O2, O4, O6 open (record of 2026-09-22) (the theorem behind O1 is Lean-checked with gates G1–G4 as hypotheses). A package value, not a bound.',
    links: [{ to: '/threads', label: 'Research threads' }, { to: '/frontier-dag', label: 'Frontier DAG' }],
  },
  {
    title: 'Weld ladder [0.2320723, 0.24502]',
    grade: 'refereed-sound',
    body: 'The single-packet strip [0.2320723, 0.23209) closed by branch-and-bound; the mass-ratio wall dissolved exactly by copositivity (Lemma WD, 12-D → 9-D). Referee pass over continuations 20–52: all sound-with-caveats. The [0.2320723, 0.24502] sandwich is a model-family constant, no arithmetic transfer.',
    links: [{ to: '/permutation-architecture', label: 'Permutation architecture' }, { to: '/threads', label: 'The weld-ladder thread' }],
  },
  {
    title: 'Tier-2 certifier + G3 pilot pass',
    grade: 'arb-certified',
    body: 'The frequency-bin chirp level delivers the window-1 continuum certificate at 21.1 CPU-days (17.9× under level-1). G3 first-window pilot passes on the complete N = 690988 window: sup Σ|D_j| margin 12.8%, sup |E₉₇| margin 30.8% — sampled sups, not a continuum certificate; 54,109,011 windows remain.',
    links: [{ to: '/frontier-dag', label: 'Frontier DAG' }, { to: '/results', label: 'Graded results' }],
  },
  {
    title: 'Route VII derived floor U ≈ 0.145–0.150',
    grade: 'no-go',
    body: 'The t↓0 cost curve (imp-95218): reachable floor U ≈ 0.150 (stretch 0.145), compute-blocked below. Every halving of U squares the row count; technology moves prefactors, never the exponent — below the floor needs arithmetic input.',
    links: [{ to: '/lambda-bounds', label: 'Bounds ledger' }, { to: '/frontier-dag', label: 'Route VII node' }],
  },
  {
    title: 'The inertia / PCC verdict',
    grade: 'no-go',
    body: 'Frozen-rung ⟺ Platt–Trudgian: freezing the ladder rungs IS PT in operator language. By the inertia half, the frozen-ladder certificate can never beat verified height — soft linear algebra creates no arithmetic input (the flow-blindness / PCC wall).',
    links: [{ to: '/frontier-dag', label: 'Frontier DAG' }, { to: '/permutation-architecture', label: 'Permutation architecture' }],
  },
  {
    title: 'Formalization: the Aristotle waves',
    grade: 'kernel-verified',
    body: '20+ Lean formalization projects across six Aristotle ATP submission waves: 30 of 31 wave-1–4 jobs kernel-verified (0 sorry, standard axioms only), two repo conjectures upgraded to unconditional theorems, frozen-rung⟺PT reduced to exactly one named hypothesis (ZR).',
    links: [{ to: '/results', label: 'Graded results' }, { to: '/threads', label: 'The Aristotle thread' }],
  },
  {
    title: 'Killed lanes (0.1399, collar, envelope)',
    grade: 'killed',
    body: 'The 0.1399 tail lane K2-killed (N₁* = 220,495,706, 4.01× the economic line); the split-collar 0.139981915 lever eliminated twice (sign reversal on the certified face); the envelope pivot refuted. Closed on explicit failure criteria — the y-thaw was the salvage.',
    links: [{ to: '/results', label: 'Graded results' }, { to: '/lambda-bounds', label: 'Bounds ledger' }],
  },
  {
    title: 'Signed twin ladder ↔ Catalan’s constant',
    grade: 'prose-proof',
    body: 'The twin ladder’s χ₄-signed sibling has value G = β(2) = L(2,χ₄) (verified: Σχ₄(n)/n²=G, signed Euler product, "sign flip at p=2" = rung deletion). The same P̃₁ device that isolates ζ(2)/ζ(3) into a 2-period space lands G in a 5-period space ⟨1,G,π,π²,ln2⟩ — the π-column forced by the χ₄ functional equation. G irrationality remains OPEN; the Λ-core gives no lever.',
    links: [{ to: '/catalan-signed-ladder', label: 'The signed ladder & the period wall' }, { to: '/diagrams', label: 'Section geometry' }],
  },
];

// Warm status-chip colors, mirroring the route map / status legend.
const STATUS_COLOR = {
  'RIGOROUS-SOTA': STATUS.proved.fg,
  'RH-EQUIVALENT': STATUS.rhequiv.fg,
  'CONDITIONAL': STATUS.conditional.fg,
  'ESTIMATE': STATUS.open.fg,
  'OPEN-HARD': STATUS.open.fg,
  'DEAD-END-FORNOW': STATUS.neutral.fg,
  'REFUTED': STATUS.refuted.fg,
  'UNDER-EXPLORED': STATUS.open.fg,
};

function statusCounts(rows) {
  const counts = {};
  for (const r of rows) counts[r.status] = (counts[r.status] || 0) + 1;
  // Order by a fixed priority so the chips read consistently across cards.
  const order = ['RIGOROUS-SOTA', 'RH-EQUIVALENT', 'OPEN-HARD', 'CONDITIONAL', 'ESTIMATE', 'UNDER-EXPLORED', 'DEAD-END-FORNOW', 'REFUTED'];
  return order.filter((s) => counts[s]).map((s) => ({ status: s, n: counts[s] }));
}

export default function AtlasPage() {
  const clusters = FULL_ROUTE_MAP.clusters;
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>the atlas · {FULL_ROUTE_MAP.totalRoutes} routes · {AREAS.length + 1} areas</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">the approach map</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          The Atlas
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: '52rem', lineHeight: 1.6 }}>
          Every line of approach on the Riemann Hypothesis and the de Bruijn–Newman constant Λ, grouped into
          six frozen-map areas plus the September frontier discovered since. Each area is a door into that part
          of the app; the full route-by-route table — with status and the exact split point of each — lives on the{' '}
          <Link to="/route-map">wall map</Link>. For how the wider community is approaching RH and where this
          program engages each line, see the <Link to="/state-of-field">state of the field</Link>.
        </p>

        {/* the rest of the wall — one click each */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '18px 0 4px' }}>
          {[
            { to: '/route-map', label: `the complete ${FULL_ROUTE_MAP.totalRoutes}-route wall map →` },
            { to: '/program-dag', label: 'the complete history (program DAG) →' },
            { to: '/frontier-dag', label: `the live frontier (${FRONTIER_DAG.nodes.length} open objects) →` },
            { to: '/diagrams', label: 'the section-geometry diagrams →' },
          ].map((l) => (
            <Link key={l.to} to={l.to} style={{
              fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 6,
              border: '1px solid var(--hairline)', background: 'var(--paper)', color: 'var(--brass, #8c6a1d)',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {AREAS.map((area, ai) => {
          const rows = [...(clusters[area.key] || [])];
          const order = ['RIGOROUS-SOTA', 'RH-EQUIVALENT', 'OPEN-HARD', 'CONDITIONAL', 'ESTIMATE', 'UNDER-EXPLORED', 'DEAD-END-FORNOW', 'REFUTED'];
          rows.sort((a, b) => (order.indexOf(a.status) - order.indexOf(b.status)) || ((b.opp || 0) - (a.opp || 0)));
          return (
            <section
              key={area.key}
              style={{
                borderTop: ai === 0 ? 'none' : '1px solid var(--hairline)',
                margin: ai === 0 ? '30px 0 0' : '26px 0 0',
                paddingTop: ai === 0 ? 0 : 26,
              }}
            >
              {/* header row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                <span className="ed-mono" style={{ fontSize: 13, color: 'var(--faint)' }}>{String(ai + 1).padStart(2, '0')}</span>
                <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: 0, color: 'var(--ink)' }}>
                  {area.title}
                </h2>
                <span className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{rows.length} routes</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {statusCounts(rows).map(({ status, n }) => (
                    <span key={status} className="ed-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, color: STATUS_COLOR[status] || 'var(--ink-soft)', border: `1px solid ${STATUS_COLOR[status] || 'var(--hairline)'}`, borderRadius: 4, padding: '1px 6px' }}>
                      {n}× {status}
                    </span>
                  ))}
                </span>
              </div>

              <div className="ed-atlas-breakout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 22, marginTop: 14 }}>
                {/* left: wireframe + blurb + doors */}
                <div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--paper)' }}>
                    <WireframeAnim kind={area.wireframe} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 10px' }}>
                    {area.blurb}
                  </p>
                  <div className="ed-lbl" style={{ marginBottom: 5 }}>enter</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {area.entryPoints.map((ep) => (
                      <Link key={ep.to} to={ep.to} style={{ fontSize: 13, fontWeight: 600 }}>
                        {ep.label} →
                      </Link>
                    ))}
                  </div>
                </div>

                {/* right: the full route breakout */}
                <div style={{ display: 'grid', gap: 0, alignContent: 'start' }}>
                  {rows.map((r) => (
                    <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--hair2)', alignItems: 'baseline' }}>
                      <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, color: STATUS_COLOR[r.status] || 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                        ● {r.status}
                      </span>
                      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--ink)' }}>{r.name}</strong>
                        {r.note && <span style={{ color: 'var(--ink-soft)' }}> — {r.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* SEVENTH SECTION — the September frontier (post-freeze discoveries) */}
        <section style={{ borderTop: '1px solid var(--hairline)', margin: '26px 0 0', paddingTop: 26 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span className="ed-mono" style={{ fontSize: 13, color: 'var(--faint)' }}>{String(AREAS.length + 1).padStart(2, '0')}</span>
            <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: 0, color: 'var(--ink)' }}>
              September Frontier — what’s been discovered since the freeze
            </h2>
            <span className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{FRONTIER_CARDS.length} entries</span>
          </div>

          <div className="ed-atlas-breakout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 22, marginTop: 14 }}>
            <div>
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--paper)' }}>
                <WireframeAnim kind="no-go-wall" />
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 10px' }}>
                The work done after the 2026-06-19 route-map freeze — not in the frozen 44-route wall. Each entry
                carries its verbatim honesty grade. Every route still funnels into the same C_H / PCC wall; nothing
                here promotes a bound below the peer-reviewed Platt–Trudgian Λ ≤ 0.2.
              </p>
              <div className="ed-lbl" style={{ marginBottom: 5 }}>the live layers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { to: '/frontier-dag', label: 'The live frontier DAG' },
                  { to: '/threads', label: `Research threads (${THREADS_META.count || 'all'})` },
                  { to: '/results', label: 'The graded-results ledger' },
                  { to: '/program-dag', label: 'The program DAG (full history)' },
                  { to: '/permutation-architecture', label: 'The permutation architecture' },
                  { to: '/lambda-bounds', label: 'The bounds ledger' },
                ].map((ep) => (
                  <Link key={ep.to} to={ep.to} style={{ fontSize: 13, fontWeight: 600 }}>{ep.label} →</Link>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12, alignContent: 'start' }}>
              {FRONTIER_CARDS.map((c) => (
                <div key={c.title} style={{ border: '1px solid var(--hair2)', borderRadius: 8, padding: '12px 13px', background: 'var(--paper)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <strong style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.3 }}>{c.title}</strong>
                  </div>
                  <span className="ed-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.3, color: GRADE_COLOR[c.grade] || 'var(--ink-soft)', border: `1px solid ${GRADE_COLOR[c.grade] || 'var(--hairline)'}`, borderRadius: 4, padding: '1px 6px' }}>
                    {c.grade}
                  </span>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 9px' }}>{c.body}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {c.links.map((l) => (
                      <Link key={l.to} to={l.to} style={{ fontSize: 12, fontWeight: 600 }}>{l.label} →</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* the dense table below all sections */}
        <div style={{ marginTop: 30, paddingTop: 18, borderTop: '1px solid var(--hairline)', fontSize: 14 }}>
          <Link to="/route-map" style={{ fontWeight: 600 }}>
            The wall map → all {FULL_ROUTE_MAP.totalRoutes} routes as the dense table (split points, sub-gaps, provenance)
          </Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/frontier-dag">The frontier DAG →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/no-gos">No-go index →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/state-of-field">State of the field →</Link>
        </div>
      </div>
    </div>
  );
}
