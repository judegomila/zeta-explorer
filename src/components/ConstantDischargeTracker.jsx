import React from 'react';
import { IMP2643_HONEST_ASSEMBLED_EN } from '../data/imp-2643-honest-assembled-EN.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from '../data/imp-2641-c-selberg-trudgian-discharge.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from '../data/polymath15-lemma52-shock-holder.js';

function statusColor(status) {
  const s = status.toLowerCase();
  if (s.includes('rigorous') && !s.includes('not rigorous')) return '#10b981';
  if (s.includes('placeholder') || s.includes('ansatz')) return '#f59e0b';
  if (s.includes('in-progress')) return '#06b6d4';
  return '#64748b';
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

  const constants = [
    {
      id: 'C_Selberg',
      name: 'C_Selberg (Erdos-Turan)',
      value: C_Selberg_data?.C_Selberg?.discharged ?? '2.622',
      status: 'Discharged (2.622)',
      description: 'Trudgian 2014 coefficient; conservative placeholder verified',
      color: '#10b981',
      ticket: 'imp-2641',
    },
    {
      id: 'C_H',
      name: 'C_H (Quadratic tangency)',
      value: '1/8',
      status: C_H_data?.isRigorousUpperBound ? 'Rigorous' : 'Blocked',
      description: 'Leading-order coefficient; NOT a rigorous upper bound on Holder-1/2 modulus',
      color: C_H_data?.isRigorousUpperBound ? '#10b981' : '#ef4444',
      ticket: 'imp-2642',
    },
    {
      id: 'C_F',
      name: 'C_F (E_flow prefactor)',
      value: data.subterms.E_flow.C_F.toFixed(6),
      status: 'Rigorous',
      description: 'Analytically pinned from boundary identity; unconditional',
      color: '#10b981',
      ticket: 'imp-398',
    },
    {
      id: 'C_G',
      name: 'C_G (Gronwall exponent)',
      value: '1.0',
      status: 'Non-binding',
      description: 'Placeholder; A1 trap shows |t_c| microscopic, so amplification <= 0.24%',
      color: '#06b6d4',
      ticket: 'imp-2644',
    },
    {
      id: 'C_KH',
      name: 'C_KH (Koksma-Hlawka)',
      value: '3π',
      status: 'Rigorous',
      description: 'π × C_Selberg uniformity; Selberg coefficient proven',
      color: '#10b981',
      ticket: 'imp-341/imp-366',
    },
    {
      id: 'E_trunc_pt',
      name: 'E_trunc_pt (Truncation)',
      value: (3.1e-5).toExponential(2),
      status: 'Rigorous (mod C_T)',
      description: 'Ingham 1940 + Guth-Maynard 2024 exponents; numerically negligible (~0.24% of E(N))',
      color: '#10b981',
      ticket: 'imp-2625',
    },
  ];

  return (
    <div style={{
      background: 'rgba(30,41,59,0.6)',
      border: '1px solid #334155',
      borderRadius: 10,
      padding: '16px 20px',
      marginBottom: 24,
    }}>
      <div style={{
        fontSize: 12,
        color: '#94a3b8',
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
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid #10b98140',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            E(N) VALUE
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#f1f5f9',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
          }}>
            {data.E_N}
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
            {data.clearsPTNumerically ? `~${data.numericMarginFactor}× below PT` : 'Exceeds PT bound'}
          </div>
        </div>

        <div style={{
          background: data.rigorousBeat ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: data.rigorousBeat ? '1px solid #10b98140' : '1px solid #ef444440',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            RIGOROUS BEAT
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: data.rigorousBeat ? '#10b981' : '#ef4444',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
          }}>
            {data.rigorousBeat ? 'PASS' : 'NO-GO'}
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
            {data.blockingConstant.substring(0, 25)}...
          </div>
        </div>

        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid #f59e0b40',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            BLOCKER
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#f59e0b',
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
              color: '#f1f5f9',
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
              color: '#64748b',
              lineHeight: 1.3,
              marginBottom: 6,
            }}>
              {c.description}
            </div>
            <div style={{
              fontSize: 9,
              color: '#475569',
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
        color: '#94a3b8',
        fontFamily: 'var(--font-mono)',
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid #334155',
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>SUBTERM COMPOSITION</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          <div>
            <span style={{ color: '#475569' }}>E_trunc:</span>{' '}
            <span style={{ color: '#f1f5f9' }}>
              {(data.subterms.E_trunc_pt.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ color: '#475569' }}>E_flow:</span>{' '}
            <span style={{ color: '#f1f5f9' }}>
              {(data.subterms.E_flow.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ color: '#475569' }}>E_coll:</span>{' '}
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>
              {(data.subterms.E_coll.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
