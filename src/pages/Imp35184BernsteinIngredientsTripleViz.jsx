import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION } from '../data/imp-35114-bernstein-ingredients-extraction.js';
import { ED, alpha } from '../styles/tokens.js';

const DATA = IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION;
const CM_TABLE = DATA.cmTable;
const DRIFT_TABLE = DATA.driftTable;

// Sign-ladder strip: sign(g^(n)) = (-1)^(n+1) for n = 1..6 (matches the Bernstein-required signature).
const LADDER_ORDERS = [1, 2, 3, 4, 5, 6];
const LADDER_SIGNS = LADDER_ORDERS.map((n) => Math.pow(-1, n + 1));

function SignLadderStrip() {
  const w = 480;
  const h = 64;
  const cellW = w / LADDER_ORDERS.length;
  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {LADDER_ORDERS.map((n, i) => (
        <g key={n} transform={`translate(${i * cellW}, 0)`}>
          <rect
            x={4}
            y={10}
            width={cellW - 8}
            height={36}
            rx={4}
            fill={LADDER_SIGNS[i] > 0 ? alpha(ED.series3, 0.15) : alpha(ED.series2, 0.15)}
            stroke={LADDER_SIGNS[i] > 0 ? ED.series3 : ED.series2}
          />
          <text
            x={cellW / 2}
            y={32}
            textAnchor="middle"
            fill={LADDER_SIGNS[i] > 0 ? ED.series3 : ED.series2}
            fontSize={16}
            fontFamily="monospace"
          >
            {LADDER_SIGNS[i] > 0 ? '+' : '-'}
          </text>
          <text x={cellW / 2} y={58} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
            g^({n})
          </text>
        </g>
      ))}
    </svg>
  );
}

// Ingredient triple as three compact panels: killing term a, drift b, and the Levy integral (implied).
function IngredientTriple() {
  const panelStyle = {
    flex: '1 1 220px',
    minWidth: 200,
    padding: '0.9rem 1rem',
    background: alpha(ED.inkSoft, 0.04),
    borderRadius: 6,
    border: '1px solid var(--rule-soft)',
  };
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1rem 0' }}>
      <div style={panelStyle}>
        <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Killing term a = g(0+)
        </div>
        <div style={{ color: 'var(--series-7)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: 4 }}>
          {DATA.ingredients.a_killing_from_height_floor.toExponential(3)}
        </div>
        <div style={{ color: 'var(--ink-faint)', fontSize: '0.72rem', marginTop: 4 }}>
          finite, &ge;0 (height-floor T0&nbsp;~17.08)
        </div>
      </div>
      <div style={panelStyle}>
        <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Drift b = lim g_prime(N)
        </div>
        <div style={{ color: 'var(--series-1)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: 4 }}>
          0 (zero drift)
        </div>
        <div style={{ color: 'var(--ink-faint)', fontSize: '0.72rem', marginTop: 4 }}>
          far-tail g_prime &amp; g(N)/N both &rarr; 0
        </div>
      </div>
      <div style={panelStyle}>
        <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          L&eacute;vy integral (all growth)
        </div>
        <div style={{ color: 'var(--series-3)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: 4 }}>
          &int;(1&minus;e<sup>&minus;Nt</sup>)d&mu;(t)
        </div>
        <div style={{ color: 'var(--ink-faint)', fontSize: '0.72rem', marginTop: 4 }}>
          carries 100% of g's growth (b = 0)
        </div>
      </div>
    </div>
  );
}

export default function Imp35184BernsteinIngredientsTripleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Bernstein / Lévy-Khintchine Ingredient Triple (imp-35184 / imp-35114)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35114 extracted the Bernstein/L&eacute;vy-Khintchine ingredients of the inherited surrogate
        crossover map g(N) = K&nbsp;log&nbsp;T0(N): a finite killing term a = g(0+), a ZERO drift b (all
        growth lives in the L&eacute;vy integral), and a completely-monotone g_prime confirmed by the
        (-1)<sup>n+1</sup> sign ladder. This page renders the triple as a compact structural diagram.
      </p>

      <IngredientTriple />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Sign ladder sign(g^(n)) = (-1)^(n+1), n = 1..6 (g_prime nonnegative, decreasing, convex, ... at
        every order &mdash; the Bernstein-required signature, gPrimeCompletelyMonotone=
        {String(DATA.gPrimeCompletelyMonotone)}):
      </p>
      <SignLadderStrip />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        From-source central differences confirming complete monotonicity (g_prime &gt; 0, g_pp &lt; 0,
        g_ppp &gt; 0) across the ramp:
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)', minWidth: 560 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>N</th>
              <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
                g_prime
              </th>
              <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
                g_pp
              </th>
              <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
                g_ppp
              </th>
              <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
                CM ok?
              </th>
            </tr>
          </thead>
          <tbody>
            {CM_TABLE.map((r) => (
              <tr key={r.N}>
                <td style={{ padding: '3px 8px', fontFamily: 'monospace' }}>{r.N}</td>
                <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                  {r.gPrime}
                </td>
                <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-2)' }}>
                  {r.gPrimePrime}
                </td>
                <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                  {r.gPrimePrimePrime}
                </td>
                <td style={{ padding: '3px 8px', textAlign: 'center', color: r.cmOk ? 'var(--series-3)' : 'var(--series-2)' }}>
                  {r.cmOk ? 'yes' : 'no'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Drift decaying to zero across the far tail (g_prime and g(N)/N both collapse toward 0,
        driftDecaysToZero={String(DATA.ingredients.b_drift_is_zero)}):
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)', minWidth: 420 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>N</th>
              <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
                g_prime
              </th>
              <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
                g(N)/N
              </th>
            </tr>
          </thead>
          <tbody>
            {DRIFT_TABLE.map((r) => (
              <tr key={r.N}>
                <td style={{ padding: '3px 8px', fontFamily: 'monospace' }}>{r.N}</td>
                <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-1)' }}>
                  {r.gPrime}
                </td>
                <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-1)' }}>
                  {r.gOverN}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35114 measurement (isRigorous={String(DATA.isRigorous)}, changesBound=
        {String(DATA.changesBound)}) on the INHERITED imp-3220/imp-3406/imp-33723 SURROGATE crossover map
        g. The Bernstein ingredients (killing term a, drift b, L&eacute;vy measure d&mu;) are structural
        properties of the SURROGATE map, NOT of the RH operator; establishes no operator positivity. The
        C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are untouched; changes
        no bound; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
      </div>
    </div>
  );
}
