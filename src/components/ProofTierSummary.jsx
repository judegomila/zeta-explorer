import React from 'react';
import { Link } from 'react-router-dom';

// Single-source three-tier honest picture shared by /rh-proof-state and /rigor-dashboard.
// "Two rigorous islands + one estimate" framing: both the SOTA floor and the Volterra
// RH-equivalence verdict are definitively established; only the finite-N* beat is an estimate.
export const PROOF_TIER_DATA = [
  {
    key: 'rigorous-sota',
    tier: 'RIGOROUS — Island 1',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    headline: 'Λ ≤ 0.2',
    subhead: 'Platt–Trudgian 2021 — unconditional upper bound',
    bullets: [
      'Rodgers–Tao (2020): Λ ≥ 0 unconditional lower bound.',
      'Platt–Trudgian (2021): Λ ≤ 0.2 — verified at T_PT = 3×10¹², current rigorous SOTA.',
      'Route B Burgers lim-sup: PCC-free unconditional contribution (no GUE hypothesis needed).',
      'Heath-Brown–Titchmarsh certified zero census at T = 10⁶ contributes to rigorous floor.',
    ],
    link: null,
  },
  {
    key: 'estimate',
    tier: 'ESTIMATE — Not Rigorous',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    headline: 'Λ ≤ E(N) ≈ 0.013',
    subhead: 'Finite-N* = 10⁴ self-consistent beat — gated on C_H',
    bullets: [
      'E(N) = E_trunc + E_flow + E_coll ≈ 0.013 at N* = 1e4.',
      'C_H (Hölder-1/2 shock modulus) is RH-hard: the Gronwall integral ∫₀^{t_c} 2/g² dt diverges at the collision scale. Imp-2640: NEGATIVE.',
      'This estimate is 15× below Platt–Trudgian as a heuristic target but is NOT a rigorous proof of any new Λ bound.',
    ],
    link: '/rigor-dashboard',
  },
  {
    key: 'rh-equivalent',
    tier: 'RH-EQUIVALENT / REFUTED — Island 2',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    headline: '‖V_{a,Φ}‖ ≤ 1',
    subhead: 'Volterra collapse — RH-equivalent, §27 LINK B refuted',
    bullets: [
      '7+ paper conjectures (§§15–27) collapse to ‖V_{a,Φ}‖ ≤ 1 — a single operator-norm statement.',
      'This is RH-equivalent: proved ⟺ RH. No shortcut; no unconditional route.',
      '§27 LINK B (‖V‖≤1 ⟺ K_a≥0 as Φ-uniform equivalence) REFUTED by imp-2666: K_a is degree-2 homogeneous while ‖V‖ scales as c²; explicit counterexamples in both directions.',
      'Surviving target: Conj 26.3 endpoint-bridge-enriched renormalization (PCC-free, open).',
    ],
    link: '/hidden-square-program',
  },
];

export default function ProofTierSummary() {
  return (
    <div style={{
      border: '1px solid #334155', borderRadius: 10,
      background: 'rgba(15,23,42,0.55)', padding: '14px 18px', marginBottom: 24,
    }}>
      <div style={{
        fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono)',
        marginBottom: 14, letterSpacing: 0.5,
      }}>
        TWO RIGOROUS ISLANDS + ONE ESTIMATE &mdash; HONEST PROOF-TIER SUMMARY
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {PROOF_TIER_DATA.map(tier => (
          <div key={tier.key} style={{
            border: `1px solid ${tier.color}`,
            borderRadius: 8,
            background: tier.bg,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: tier.color, marginBottom: 6, letterSpacing: 0.3,
            }}>
              {tier.tier}
            </div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#f1f5f9',
              fontFamily: 'var(--font-mono)', marginBottom: 3,
            }}>
              {tier.headline}
            </div>
            <div style={{
              fontSize: 11, color: '#94a3b8', marginBottom: 10,
            }}>
              {tier.subhead}
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: 5, flex: 1,
            }}>
              {tier.bullets.map((b, i) => (
                <li key={i} style={{
                  fontSize: 12, color: '#cbd5e1', lineHeight: 1.5,
                  paddingLeft: 12, position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', left: 0, top: 5,
                    width: 4, height: 4, borderRadius: '50%',
                    background: tier.color, display: 'block',
                  }} />
                  {b}
                </li>
              ))}
            </ul>
            {tier.link && (
              <Link to={tier.link} style={{
                display: 'inline-block', marginTop: 10,
                fontSize: 11, color: tier.color,
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
              }}>
                Details →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
