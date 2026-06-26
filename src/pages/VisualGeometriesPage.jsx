import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath } from '../components/KaTeXMath.jsx';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function downloadPosterSVG(panels) {
  const W = 1200, COLS = 3, GAP = 16, PAD = 24;
  const cardW = Math.floor((W - PAD * 2 - GAP * (COLS - 1)) / COLS);
  const cardH = 160;
  const titleH = 90;
  const rows = Math.ceil(panels.length / COLS);
  const H = titleH + PAD + rows * (cardH + GAP) + PAD;

  const wrapText = (text, maxPx) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (test.length * 6.4 > maxPx && line) { lines.push(line); line = word; }
      else { line = test; }
    }
    if (line) lines.push(line);
    return lines;
  };

  let cards = '';
  panels.forEach((p, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (cardW + GAP);
    const y = titleH + PAD + row * (cardH + GAP);
    const blurbLines = wrapText(p.blurb, cardW - 28).slice(0, 4);
    const textRows = blurbLines.map((ln, li) =>
      `<text x="${x + 14}" y="${y + 46 + li * 17}" font-family="sans-serif" font-size="11" fill="#94a3b8">${escapeXml(ln)}</text>`
    ).join('\n  ');
    cards += `
  <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="6" fill="#1e293b"/>
  <rect x="${x}" y="${y}" width="3" height="${cardH}" rx="1" fill="${p.color}"/>
  <text x="${x + 14}" y="${y + 25}" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="${p.color}">${escapeXml(p.title)}</text>
  <text x="${x + cardW - 8}" y="${y + 25}" font-family="monospace" font-size="10" fill="#475569" text-anchor="end">#${p.n}</text>
  ${textRows}`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0f172a"/>
  <text x="${W / 2}" y="50" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#f1f5f9">Visual Geometries of &#950;(s)</text>
  <text x="${W / 2}" y="74" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#94a3b8">One field, many views &#8212; log-phase &#952; = t log n</text>
  ${cards}
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'visual-geometries-poster.svg';
  a.click();
  URL.revokeObjectURL(url);
}

/*
 * Visual Geometries of zeta(s) — the master gallery.
 *
 * One field, many views: the log-phase theta = t log n of zeta. Primes generate
 * it; folding mod 2pi makes caustics, crystals and spirals; zeros are the phase
 * vortices of V_t = H_t'/H_t. This page ties the project's visualization panels
 * into the single poster they came from. HONEST framing: these are exact,
 * exploratory visualizations of real structure -- per the route map the
 * twin-ladder geometry is a DEAD END as a rigorous Lambda route, so this is
 * pedagogy + exploration, not a proof path. No false QED.
 */

const PANELS = [
  { n: 1, title: 'Log-Phase Interference Spiral', tex: 'r=\\log n,\\ \\theta=t\\log n', to: '/viz-log-phase-spiral',
    blurb: 'Integers in polar log-phase coords; primes form spiral rays and interference filaments.', color: '#a855f7',
    ceiling: 'Illustrative re-coordinatization of the integers; reveals prime structure to the eye but proves nothing and yields no bound on Λ.' },
  { n: 2, title: 'Prime Caustic Geometry', tex: '\\theta=t\\log p\\ (\\mathrm{mod}\\ 2\\pi)', to: '/viz-prime-caustic',
    blurb: 'Bright caustic bands where many primes align: log(p_i/p_j) ≈ 2πk/t — multiplicative resonances.', color: '#f59e0b',
    ceiling: 'Caustics visualize multiplicative resonances; descriptive only — not a proof of RH and yields no Λ bound.' },
  { n: 13, title: 'Prime Density on Caustics', tex: 'k/N\\ \\text{vs}\\ t', to: '/viz-prime-density-caustic',
    blurb: 'Which primes (by index) contribute to the caustic at each height t — density overlay vs PNT baseline.', color: '#fb923c',
    ceiling: 'Empirical density overlay vs the PNT baseline; an exploratory diagnostic, not a rigorous statement — no Λ bound.' },
  { n: 3, title: 'Prime Phase Crystal', tex: 'C_t(n)=e^{-it\\log n}', to: '/viz-prime-phase-crystal',
    blurb: 'Contours of constant complex phase; a multiplicative diffraction lattice with Δn ≈ (2π/t)n.', color: '#22c55e',
    ceiling: 'A diffraction-lattice picture of e^{-it log n}; purely visual — establishes no rigorous bound on Λ.' },
  { n: 4, title: 'Hyperbolic Prime Spiral', tex: '\\text{Poincaré disk}', to: '/viz-hyperbolic-prime-spiral',
    blurb: 'Multiplication becomes geodesic translation; primes lie on special geodesic networks.', color: '#3b82f6',
    ceiling: 'Geometric re-encoding of multiplication; suggestive only — not a proof and does not bound Λ.' },
  { n: 6, title: 'Vortex / Defect Map', tex: 'V_t=H_t^{\\prime}/H_t', to: '/vortex-field',
    blurb: 'Zeros as phase vortices (winding ±1); vortex exclusion from off-axis ⟺ RH.', color: '#ec4899',
    ceiling: 'Vortex exclusion re-derives Λ ≥ 0 (Rodgers–Tao) and makes RH visible — NOT a new rigorous bound; does not beat Platt–Trudgian Λ ≤ 0.2.' },
  { n: 7, title: 'Near a Zeta Zero', tex: '\\rho=\\tfrac12+i\\gamma', to: '/viz-near-zero',
    blurb: 'Rings, nodal lines and vortex creation as the interference reorganizes near a zero.', color: '#06b6d4',
    ceiling: 'Exact, exploratory view of the vortex thread — re-derives Λ ≥ 0 only; not a rigorous bound and does not beat Platt–Trudgian Λ ≤ 0.2.' },
  { n: 8, title: 'Angular-Spacing Statistics', tex: '\\Delta_k=\\theta_{k+1}-\\theta_k', to: '/gue-comparison',
    blurb: 'GUE spacing of the zeros; the log-phase spacings show hidden rigidity vs random.', color: '#8b5cf6',
    ceiling: 'GUE-spacing comparison is empirical (Montgomery–Dyson heuristic); evidential, not a proof — no Λ bound.' },
  { n: 9, title: 'Twin-Ladder Tomography', tex: '\\prod_p(1-p^{-s})^{-1}', to: '/viz-twin-ladder-tomography',
    blurb: 'Slices through the dual ladders that enforce the functional equation ζ(s)=χ(s)ζ(1−s).', color: '#14b8a6',
    ceiling: 'Visualizes the functional equation; the twin-ladder geometry is a dead end as a rigorous Λ route — no bound.' },
  { n: 11, title: 'True vs Perturbed (Rigidity)', tex: '\\theta_p\\to\\theta_p+\\varepsilon_p', to: '/prime-rigidity',
    blurb: 'Perturbing primes destroys the caustics — the structure is ARITHMETIC, not random.', color: '#ef4444',
    ceiling: 'Perturbation demo shows arithmetic rigidity empirically; illustrative, not a theorem — no Λ bound.' },
  { n: 5, title: 'Euler Transport Flow', tex: 'u_t+u\\,u_z=0', to: '/viz-euler-transport-flow',
    blurb: 'The Dyson–Burgers transport the Stieltjes field obeys under the Newman heat flow.', color: '#eab308',
    ceiling: 'Burgers/heat-flow analogy of the Stieltjes field; a model picture, not a rigorous derivation — no Λ bound.' },
  { n: 14, title: 'True vs Perturbed Euler Product', tex: '\\log|\\Pi_p(1-p^{-s})^{-1}|', to: '/viz-euler-product',
    blurb: 'Partial Euler product on the critical line: true primes dip at zero heights; perturbed log p smears them.', color: '#60a5fa',
    ceiling: 'Partial-product dips at zero heights; a finite-truncation illustration, not a proof — no Λ bound.' },
  { n: 12, title: 'Supercritical Landscape', tex: '|\\zeta(\\sigma+it)|', to: '/supercritical',
    blurb: 'Zeta as a partition function; zeros as vapor bubbles in the |ζ| thermodynamic landscape.', color: '#f97316',
    ceiling: 'Thermodynamic |ζ| analogy; a descriptive visualization only — establishes no rigorous bound on Λ.' },
];

export default function VisualGeometriesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Visual Geometries of ζ(s)</h1>
        <p className="page-subtitle">
          One field, many views. Every panel below is a window onto the same
          object — the <strong>log-phase field</strong>{' '}
          <InlineMath tex={'\\theta = t\\,\\log n'} /> of ζ. Primes generate it;
          folding <InlineMath tex={'\\bmod\\ 2\\pi'} /> produces caustics, crystals
          and spirals; the zeros are the <strong>phase vortices</strong> of{' '}
          <InlineMath tex={'V_t = H_t^{\\prime}/H_t'} />. From the discrete (numbers) to
          the continuous (geometry), the twin ladder makes the invisible visible.
        </p>
        <button
          onClick={() => downloadPosterSVG(PANELS)}
          style={{ marginTop: 14, padding: '6px 14px', fontSize: 12, cursor: 'pointer', background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 5, letterSpacing: '0.02em' }}
        >
          Export poster SVG
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {PANELS.map((p) => (
          <Link key={`${p.n}-${p.to}`} to={p.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%', borderLeft: `3px solid ${p.color}`, transition: 'transform 0.12s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <h3 style={{ margin: 0, color: p.color, fontSize: 15 }}>{p.title}</h3>
                <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>#{p.n}</span>
              </div>
              <div style={{ margin: '8px 0', fontSize: 13 }}><InlineMath tex={p.tex} /></div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>{p.blurb}</p>
              {p.ceiling ? (
                <p style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5, margin: '8px 0 0', paddingTop: 6, borderTop: '1px solid rgba(148,163,184,0.15)' }}>
                  <strong style={{ fontStyle: 'normal' }}>Honest ceiling:</strong> {p.ceiling}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: 22, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ marginTop: 0 }}>What the geometries actually show — honestly</h3>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Caustics = multiplicative resonances.</strong> Bright bands form where <InlineMath tex={'\\log(p_i/p_j)\\approx 2\\pi k/t'} /> — the same oscillatory structure as the explicit formula's <InlineMath tex={'x^{\\rho}'} /> kernel.</li>
          <li><strong>Vortices = zeros.</strong> <InlineMath tex={'\\tfrac1{2\\pi}\\oint V_t\\cdot dz = \\pm 1'} /> is the argument principle; off-axis vortices would be off-axis zeros (RH false).</li>
          <li><strong>Rigidity is the real content.</strong> Real primes give coherent caustics; randomized primes wash them out — the structure is arithmetic, not random.</li>
          <VizCeilingNote claim="Λ ≥ 0 (vortex/winding thread)" ceiling="the twin-ladder geometry is a dead end as a rigorous Λ route" />
        </ul>
      </div>
    </div>
  );
}
