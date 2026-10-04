import React from 'react';
import { IMP2643_HONEST_ASSEMBLED_EN } from '../data/imp-2643-honest-assembled-EN.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from '../data/imp-2641-c-selberg-trudgian-discharge.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from '../data/polymath15-lemma52-shock-holder.js';
import { IMP2715_WORST_CASE_EN_HEADROOM } from '../data/imp-2715-worst-case-EN-headroom-audit.js';
import { ED } from '../styles/tokens.js';

function statusColor(status) {
  const s = status.toLowerCase();
  if (s.includes('rigorous') && !s.includes('not rigorous')) return ED.series3;
  if (s.includes('placeholder') || s.includes('ansatz')) return ED.brassDeco;
  if (s.includes('in-progress')) return ED.series1;
  return ED.inkFaint;
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
      color: ED.series3,
      ticket: 'imp-2641',
    },
    {
      id: 'C_H',
      name: 'C_H (Quadratic tangency)',
      value: '1/8',
      status: C_H_data?.isRigorousUpperBound ? 'Rigorous' : 'Blocked',
      description: 'Leading-order coefficient; NOT a rigorous upper bound on Holder-1/2 modulus',
      color: C_H_data?.isRigorousUpperBound ? ED.series3 : ED.accent,
      ticket: 'imp-2642',
    },
    {
      id: 'C_F',
      name: 'C_F (E_flow prefactor)',
      value: data.subterms.E_flow.C_F.toFixed(6),
      status: 'Rigorous',
      description: 'Analytically pinned from boundary identity; unconditional',
      color: ED.series3,
      ticket: 'imp-398',
    },
    {
      id: 'C_G',
      name: 'C_G (Gronwall exponent)',
      value: '1.0',
      status: 'Non-binding',
      description: 'Placeholder; A1 trap shows |t_c| microscopic, so amplification <= 0.24%',
      color: ED.series1,
      ticket: 'imp-2644',
    },
    {
      id: 'C_KH',
      name: 'C_KH (Koksma-Hlawka)',
      value: '3π',
      status: 'Rigorous',
      description: 'π × C_Selberg uniformity; Selberg coefficient proven',
      color: ED.series3,
      ticket: 'imp-341/imp-366',
    },
    {
      id: 'E_trunc_pt',
      name: 'E_trunc_pt (Truncation)',
      value: (3.1e-5).toExponential(2),
      status: 'Rigorous (mod C_T)',
      description: 'Ingham 1940 + Guth-Maynard 2024 exponents; numerically negligible (~0.24% of E(N))',
      color: ED.series3,
      ticket: 'imp-2625',
    },
  ];

  return (
    <div style={{
      background: 'var(--paper-2)',
      border: '1px solid var(--rule)',
      borderRadius: 10,
      padding: '16px 20px',
      marginBottom: 24,
    }}>
      <div style={{
        fontSize: 12,
        color: 'var(--ink-faint)',
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
          background: 'color-mix(in srgb, var(--series-3) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--series-3) 33%, transparent)',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
            E(N) VALUE
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--ink)',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
          }}>
            {data.E_N}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>
            {data.clearsPTNumerically ? `~${data.numericMarginFactor}× below PT` : 'Exceeds PT bound'}
          </div>
        </div>

        <div style={{
          background: data.rigorousBeat ? 'color-mix(in srgb, var(--series-3) 10%, transparent)' : 'color-mix(in srgb, var(--series-2) 10%, transparent)',
          border: data.rigorousBeat ? '1px solid color-mix(in srgb, var(--series-3) 33%, transparent)' : '1px solid color-mix(in srgb, var(--accent) 33%, transparent)',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
            RIGOROUS BEAT
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: data.rigorousBeat ? 'var(--series-3)' : 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            marginTop: 4,
          }}>
            {data.rigorousBeat ? 'PASS' : 'NO-GO'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>
            {data.blockingConstant.substring(0, 25)}...
          </div>
        </div>

        <div style={{
          background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--brass-deco) 33%, transparent)',
          borderRadius: 7,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
            BLOCKER
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--brass)',
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
              color: 'var(--ink)',
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
              color: 'var(--ink-faint)',
              lineHeight: 1.3,
              marginBottom: 6,
            }}>
              {c.description}
            </div>
            <div style={{
              fontSize: 9,
              color: 'var(--ink-faint)',
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
        color: 'var(--ink-faint)',
        fontFamily: 'var(--font-mono)',
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid var(--rule)',
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>SUBTERM COMPOSITION</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          <div>
            <span style={{ color: 'var(--ink-faint)' }}>E_trunc:</span>{' '}
            <span style={{ color: 'var(--ink)' }}>
              {(data.subterms.E_trunc_pt.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--ink-faint)' }}>E_flow:</span>{' '}
            <span style={{ color: 'var(--ink)' }}>
              {(data.subterms.E_flow.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--ink-faint)' }}>E_coll:</span>{' '}
            <span style={{ color: 'var(--brass)', fontWeight: 700 }}>
              {(data.subterms.E_coll.shareOfEN * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Worst-case constant-bracket robustness (imp-2715, numerical headroom NOT rigorous) */}
      <div style={{
        fontSize: 11,
        color: 'var(--ink-faint)',
        fontFamily: 'var(--font-mono)',
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid var(--rule)',
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
            <span style={{ color: 'var(--ink-faint)' }}>E(N) worst:</span>{' '}
            <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{worst.E_N_worst}</span>
          </div>
          <div>
            <span style={{ color: 'var(--ink-faint)' }}>vs central:</span>{' '}
            <span style={{ color: 'var(--ink)' }}>{worst.E_N_central}</span>
          </div>
          <div>
            <span style={{ color: 'var(--ink-faint)' }}>margin:</span>{' '}
            <span style={{ color: worst.clearsPTNumerically ? 'var(--series-3)' : 'var(--accent)', fontWeight: 700 }}>
              ~{worst.worstMarginFactor}× below PT
            </span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--ink-faint)', lineHeight: 1.3, marginTop: 6 }}>
          C_H = {worst.worstCaseBrackets.E_coll.C_H_worst}, C_Selberg = {worst.worstCaseBrackets.E_coll.C_Selberg_worst},
          {' '}C_G = {worst.worstCaseBrackets.E_flow.C_G_worst} pessimized at N* = {worst.N_star}; the ~15× clearance
          survives because E_coll dominates and inflates only ~{((worst.E_coll_inflation_factor - 1) * 100).toFixed(1)}%.
          C_H stays an ansatz, so Λ ≤ E(N) remains non-rigorous.
        </div>
      </div>
    </div>
  );
}
