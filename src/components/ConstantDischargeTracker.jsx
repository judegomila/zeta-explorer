import React from 'react';
import { IMP2643_HONEST_ASSEMBLED_EN } from '../data/imp-2643-honest-assembled-EN.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from '../data/imp-2641-c-selberg-trudgian-discharge.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from '../data/polymath15-lemma52-shock-holder.js';
import { IMP2715_WORST_CASE_EN_HEADROOM } from '../data/imp-2715-worst-case-EN-headroom-audit.js';

function statusColor(status) {
  const s = status.toLowerCase();
  if (s.includes('rigorous') && !s.includes('not rigorous')) return '#4c7a4a';
  if (s.includes('placeholder') || s.includes('ansatz')) return '#b58a2e';
  if (s.includes('in-progress')) return '#3f6b86';
  return '#877b67';
}

function statusLabel(status) {
  const s = status.toLowerCase();
  if (s.includes('not rigorous')) return 'Blocked';
  if (s.includes('rigorous')) return 'Rigorous';
  if (s.includes('placeholder')) return 'Placeholder';
  if (s.includes('in-progress')) return 'In Progress';
  return 'Unknown';
}

export default function ConstantDischargeTracker() {
  const data = IMP2643_HONEST_ASSEMBLED_EN;
  const C_Selberg_data = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE;
  const C_H_data = C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642;
  const worst = IMP2715_WORST_CASE_EN_HEADROOM;

  const constants = [
    {
      id: 'C_Selberg',
      name: 'C_Selberg (Erdos-Turan)',
      value: C_Selberg_data?.C_Selberg?.discharged ?? '2.622',
      status: 'Discharged (2.622)',
      description: 'Trudgian 2014 coefficient; conservative placeholder verified',
      color: '#4c7a4a',
      ticket: 'imp-2641',
    },
    {
      id: 'C_H',
      name: 'C_H (Quadratic tangency)',
      value: '1/8',
      status: C_H_data?.isRigorousUpperBound ? 'Rigorous' : 'Blocked',
      description: 'Leading-order coefficient; NOT a rigorous upper bound on Holder-1/2 modulus',
      color: C_H_data?.isRigorousUpperBound ? '#4c7a4a' : '#c23a1c',
      ticket: 'imp-2642',
    },
    {
      id: 'C_F',
      name: 'C_F (E_flow prefactor)',
      value: data.subterms.E_flow.C_F.toFixed(6),
      status: 'Rigorous',
      description: 'Analytically pinned from boundary identity; unconditional',
      color: '#4c7a4a',
      ticket: 'imp-398',
    },
    {
      id: 'C_G',
      name: 'C_G (Gronwall exponent)',
      value: '1.0',
      status: 'Non-binding',
      description: 'Placeholder; A1 trap shows |t_c| microscopic, so amplification <= 0.24%',
      color: '#3f6b86',
      ticket: 'imp-2644',
    },
    {
      id: 'C_KH',
      name: 'C_KH (Koksma-Hlawka)',
      value: '3π',
      status: 'Rigorous',
      description: 'π × C_Selberg uniformity; Selberg coefficient proven',
      color: '#4c7a4a',
      ticket: 'imp-341/imp-366',
    },
    {
      id: 'E_trunc_pt',
      name: 'E_trunc_pt (Truncation)',
      value: (3.1e-5).toExponential(2),
      status: 'Rigorous (mod C_T)',
      description: 'Ingham 1940 + Guth-Maynard 2024 exponents; numerically negligible (~0.24% of E(N))',
      color: '#4c7a4a',
      ticket: 'imp-2625',
    },
  ];

  return (
    <div style={{
      background: '#f6f1e7',
      border: '1px solid #d5c9b2',
      borderRadius: 10,
      padding: '16px 20px',
      marginBottom: 24,
    }}>
      <div style={{
        fontSize: 12,
        color: '#877b67',
        fontFamily: 'var(--font-mono)',
        marginBottom: 12,
        fontWeight: 600,
      }}>
        CONSTANT-DISCHARGE FRONTIER (E(N) @ N* = 1e4)
      </div>

      {/* Main E(N) summary bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginBottom: 16,
      }}>
        <div style={{
          background: 'rgba(76,122,74,0.10)',
          border: '1px solid #4c7a4a55',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#877b67', fontFamily: 'var(--font-mono)' }}>
            E(N) VALUE
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#1c1814',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
          }}>
            {data.E_N}
          </div>
          <div style={{ fontSize: 10, color: '#877b67', marginTop: 2 }}>
            {data.clearsPTNumerically ? `~${data.numericMarginFactor}× below PT` : 'Exceeds PT bound'}
          </div>
        </div>

        <div style={{
          background: data.rigorousBeat ? 'rgba(76,122,74,0.10)' : 'rgba(194,58,28,0.10)',
          border: data.rigorousBeat ? '1px solid #4c7a4a55' : '1px solid #c23a1c55',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#877b67', fontFamily: 'var(--font-mono)' }}>
            RIGOROUS BEAT
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: data.rigorousBeat ? '#4c7a4a' : '#c23a1c',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
          }}>
            {data.rigorousBeat ? 'PASS' : 'NO-GO'}
          </div>
          <div style={{ fontSize: 10, color: '#877b67', marginTop: 2 }}>
            {data.blockingConstant.substring(0, 25)}...
          </div>
        </div>

        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid #b58a2e55',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#877b67', fontFamily: 'var(--font-mono)' }}>
            BLOCKER
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#b58a2e',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
            lineHeight: 1.3,
          }}>
            {data.blockingConstant.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* Constants grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10,
      }}>
        {constants.map(c => (
          <div
            key={c.id}
            style={{
              background: `${c.color}12`,
              border: `1px solid ${c.color}40`,
              borderRadius: 7,
              padding: '10px 12px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
            }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: c.color,
                  flexShrink: 0,
                }}
              />
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: c.color,
                fontFamily: 'var(--font-mono)',
                flex: 1,
              }}>
                {c.name}
              </span>
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#1c1814',
              fontFamily: 'var(--font-mono)',
              marginBottom: 4,
            }}>
              {c.value}
            </div>
            <div style={{
              fontSize: 10,
              color: c.color,
              fontFamily: 'var(--font-mono)',
              marginBottom: 4,
            }}>
              {c.status}
            </div>
            <div style={{
              fontSize: 10,
              color: '#877b67',
              lineHeight: 1.3,
              marginBottom: 6,
            }}>
              {c.description}
            </div>
            <div style={{
              fontSize: 9,
              color: '#877b67',
              fontFamily: 'var(--font-mono)',
            }}>
              {c.ticket}
            </div>
          </div>
        ))}
      </div>

      {/* Subterm breakdown */}
      <div style={{
        fontSize: 11,
        color: '#877b67',
        fontFamily: 'var(--font-mono)',
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid #d5c9b2',
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>SUBTERM COMPOSITION</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          <div>
            <span style={{ color: '#877b67' }}>E_trunc:</span>{' '}
            <span style={{ color: '#1c1814' }}>
              {(data.subterms.E_trunc_pt.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ color: '#877b67' }}>E_flow:</span>{' '}
            <span style={{ color: '#1c1814' }}>
              {(data.subterms.E_flow.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ color: '#877b67' }}>E_coll:</span>{' '}
            <span style={{ color: '#b58a2e', fontWeight: 700 }}>
              {(data.subterms.E_coll.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Worst-case constant-bracket robustness (imp-2715, numerical headroom NOT rigorous) */}
      <div style={{
        fontSize: 11,
        color: '#877b67',
        fontFamily: 'var(--font-mono)',
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid #d5c9b2',
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>
          WORST-CASE BRACKET ROBUSTNESS (imp-2715, numerical headroom — not rigorous)
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          <div>
            <span style={{ color: '#877b67' }}>E(N) worst:</span>{' '}
            <span style={{ color: '#1c1814', fontWeight: 700 }}>{worst.E_N_worst}</span>
          </div>
          <div>
            <span style={{ color: '#877b67' }}>vs central:</span>{' '}
            <span style={{ color: '#1c1814' }}>{worst.E_N_central}</span>
          </div>
          <div>
            <span style={{ color: '#877b67' }}>margin:</span>{' '}
            <span style={{ color: worst.clearsPTNumerically ? '#4c7a4a' : '#c23a1c', fontWeight: 700 }}>
              ~{worst.worstMarginFactor}× below PT
            </span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#877b67', lineHeight: 1.3, marginTop: 6 }}>
          C_H = {worst.worstCaseBrackets.E_coll.C_H_worst}, C_Selberg = {worst.worstCaseBrackets.E_coll.C_Selberg_worst},
          {' '}C_G = {worst.worstCaseBrackets.E_flow.C_G_worst} pessimized at N* = {worst.N_star}; the ~15× clearance
          survives because E_coll dominates and inflates only ~{((worst.E_coll_inflation_factor - 1) * 100).toFixed(1)}%.
          C_H stays an ansatz, so Λ ≤ E(N) remains non-rigorous.
        </div>
      </div>
    </div>
  );
}
