import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';

/* Permutation Architecture — the typed freeze calculus for the zeta twin ladder,
   the strict Λ ≤ 0.14 completion contract, and the one open family. Sourced
   verbatim-in-scope from "Permuting the Zeta Twin Ladder" (Gomila, 2026-08-24).
   Honest framing: Λ ≤ 0.14 is a fail-closed CONTRACT, not a proved bound; this
   page proves neither RH nor a new de Bruijn–Newman bound. Editorial theme. */

// The typed component calculus (E/A/C/O), from the paper's §3 table.
const COMPONENTS = [
  ['C', 'completion', 'adds polynomial + gamma factors', 'E'],
  ['R', 'reflection bridge', 'exchanges s and 1−s channels', 'E'],
  ['H_t', 'heat flow', 'changes analytic field & zero geometry', 'E'],
  ['P', 'prime masks / shells', 'projects coefficient support', 'E'],
  ['B_v', 'B / Fresnel transform', 'coefficient sums → stationary packets', 'E-local'],
  ['G_U', 'graph compression', 'direct sum → correlated sector', 'C'],
  ['I_K', 'twistor incidence transform', 'analytic states → cohomological data', 'O'],
  ['S', 'Schur elimination', 'removes a coercive tail', 'C'],
  ['M', 'modulus / majorant', 'complex correlated data → positive scalar', 'irreversible'],
  ['A_Γ', 'boundary count', 'values on a shell → winding / divisor data', 'C'],
];

const STATUS_META = {
  E: { color: '#4c7a4a', label: 'E — exact theorem / identity' },
  'E-local': { color: '#4c7a4a', label: 'E locally; bounds open' },
  A: { color: '#3f6b86', label: 'A — auxiliary abstraction' },
  C: { color: '#b58a2e', label: 'C — proved implication, open antecedent' },
  O: { color: '#6d55b8', label: 'O — unproved construction' },
  irreversible: { color: '#c23a1c', label: 'irreversible' },
};

// The five alternative sufficient gates (§4.8) — different exact decompositions.
const GATES = [
  ['Full cocycle', '|E₉₇| < 0.2796881955526244', 'complete rough-core + analytic-transfer charge'],
  ['18-moment carrier', '|C_E,17| + r_num < 0.2796881955526147', 'exact carrier remainder < 9.671×10⁻¹⁵'],
  ['Retained divisors', '|E_D| < 0.2691881955526244', 'all divisor branches d > 10⁶ (charged by 21/2000)'],
  ['Physical bulk', '|E_bulk| < 0.2777007631201920', 'the last ⌈N^{1/3}⌉ physical terms'],
  ['Cubic canonical sum', '|E_can| < 0.1835011530528975', 'a uniform 4th-order log-phase Taylor charge'],
];

function StatusChip({ s }) {
  const m = STATUS_META[s] || STATUS_META.O;
  return (
    <span className="ed-mono" style={{ fontSize: 10, fontWeight: 700, color: m.color, border: `1px solid ${m.color}`, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' }}>{s}</span>
  );
}

export default function PermutationArchitecturePage() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>freeze calculus · Λ ≤ 0.14 is a contract, not a bound</span>} />
      <div className="ed-full" style={{ maxWidth: '60rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">architecture</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 36, lineHeight: 1.12, margin: '6px 0 12px', color: 'var(--ink)' }}>
          Permutation Architecture &amp; the Freeze Calculus
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The twin-ladder program organised as a <strong>typed calculus of components</strong> and admissible
          compositions: which rearrangements are equivalent, which create commutator defects, and which destroy
          useful cancellation by taking a modulus too early. It fixes a <strong>fail-closed contract</strong> for
          the strict sub-0.14 route — reducing the whole route to <em>one</em> explicit open family — and records
          five alternative sufficient gates. This is an architecture and a contract:{' '}
          <strong>it proves neither RH nor a new bound on the de Bruijn–Newman constant Λ.</strong>{' '}
          Platt–Trudgian <InlineMath tex="\Lambda \le 0.2" /> remains the rigorous benchmark.
        </p>

        {/* Typed component calculus */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The typed component calculus</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Every component is a typed map <InlineMath tex="\mathsf{T}:(\text{state},\text{domain},\text{metric},\text{divisor})\to(\cdots)" />.
          A word is <em>proof-admissible</em> only if it preserves the scalar divisor (or supplies an exact one-way
          characteristic implication) and every commutator, tail, projection and boundary defect fits one
          non-duplicated error ledger. Four status labels are used throughout:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0 14px' }}>
          {['E', 'A', 'C', 'O'].map((s) => (
            <span key={s} className="ed-mono" style={{ fontSize: 11, color: STATUS_META[s].color, border: `1px solid ${STATUS_META[s].color}`, borderRadius: 4, padding: '2px 8px' }}>{STATUS_META[s].label}</span>
          ))}
        </div>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 12px' }}>Symbol</th><th style={{ padding: '8px 12px' }}>Component</th><th style={{ padding: '8px 12px' }}>Type-changing effect</th><th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map(([sym, name, effect, status]) => (
                <tr key={sym} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', color: 'var(--ink)' }}>{sym}</td>
                  <td style={{ padding: '7px 12px' }}>{name}</td>
                  <td style={{ padding: '7px 12px' }}>{effect}</td>
                  <td style={{ padding: '7px 12px' }}><StatusChip s={status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Two no-go principles */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>Two ordering principles</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>The modulus barrier.</strong> For complex packets, <InlineMath tex="\left|\sum_j z_j\right| \le \sum_j |z_j|" /> —
          applying a modulus before a correlated sum discards relative phase and is not invertible. So: <em>recombine
          direct/dual packets and shells first; take a modulus last.</em>{' '}
          <strong>The no-gain rule.</strong> An isometric change of coordinates (bicomplex direct sum, unitary twistor
          rotation, exact Fourier transform) preserves norms, spectra and zero multiplicity — so it cannot by itself
          improve a zero-free margin. It helps only when followed by a nontrivial invariant compression, a positivity
          theorem, or a coercive elimination. This is the operator-language form of the program's{' '}
          <Link to="/flow-blindness-no-go">flow-blindness no-go</Link>.
        </p>
        <div style={{ borderLeft: '3px solid var(--terra)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '10px 0' }}>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            The permutation defect lemma makes this quantitative: reordering contractions by a permutation π costs at
            most <InlineMath tex="\|T_\pi - T_{\mathrm{id}}\| \le \sum_{(i,j)\in\mathrm{Inv}(\pi)} \|[T_i,T_j]\|" />.
            Commuting pairs are free; the whole architecture reduces to the small set of nonzero commutators and
            irreversible steps.
          </p>
        </div>

        {/* The 0.14 completion contract */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The strict Λ ≤ 0.14 completion contract</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Freeze the exact row at{' '}
          <InlineMath tex="t_0 = \tfrac{24727519}{200000000} = 0.123637595" />,{' '}
          <InlineMath tex="y_0 = 0.1809" />, <InlineMath tex="X = 6.000000185827\times10^{9}" />, so that
        </p>
        <BlockMath tex="\Lambda \le t_0 + \tfrac{y_0^2}{2} = \tfrac{7}{50} = 0.14 \quad\text{(if three zero-free statements hold).}" />
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The Platt–Trudgian verified height 3000175332800 supplies the first statement, and a project certificate
          closes the rational intermediate box for the third — within its declared replay scope. Everything else (the
          25-defect prime telescope, the exact five-shell identity, a directed gamma atlas of 356,468 cells, the
          carrier remainder, and one positive-width source cell at <InlineMath tex="N=690988" />) is <strong>closed within
          declared scope</strong>. The contract reduces the strict sub-0.14 route to exactly one thing.
        </p>
        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>the one open family — the breach point</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            A single correlated lower-edge scalar inequality on the range{' '}
            <strong><InlineMath tex="690988 \le N \le 54799999" /></strong>: the global statement{' '}
            <InlineMath tex="|C_{E,17}| < 0.27968819555261474" /> for every window parameter and both sides of every
            seam. A uniform atlas at that width would need more than <InlineMath tex="7.2\times10^{26}" /> cells, so raw
            tiling is not viable — the remaining problem is a uniform correlated enclosure, not more computation.
            Until it is closed, <strong>Λ ≤ 0.14 is a contract, not a promoted bound.</strong>
          </p>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The decisive analytic object is <strong>one noncommuting weld</strong>: the Fresnel/B-transform and a prime
          projection do not commute, <InlineMath tex="[\mathcal{B}_v,\Pi_p]\neq 0" />. The nonzero aliases are shifted
          Fresnel–Airy transition packets whose correlated sum must stay coupled through the five shells or the 25
          defects — that commutator, not the already-paired smooth interior, is where the route lives.
        </p>

        {/* Five alternative gates */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>Five alternative sufficient gates</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The one open family has several exact representations. Their allowances belong to different decompositions and
          <strong> must not be added to, or subtracted from, one another</strong>. The first two are cleanest for promotion.
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 12px' }}>Gate</th><th style={{ padding: '8px 12px' }}>Strict sufficient target</th><th style={{ padding: '8px 12px' }}>What is already removed</th>
              </tr>
            </thead>
            <tbody>
              {GATES.map(([g, target, removed]) => (
                <tr key={g} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 12px', color: 'var(--ink)', fontWeight: 600 }}>{g}</td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{target}</td>
                  <td style={{ padding: '7px 12px' }}>{removed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status + links */}
        <div style={{ borderLeft: '3px solid var(--green)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '26px 0 8px' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            The prime telescope, five-shell identity, gamma atlas, carrier remainder and one source cell are closed in
            their declared scopes. The global correlated inequality on <InlineMath tex="690988 \le N \le 54799999" /> is
            open on every window parameter and both seam sides. Therefore Λ ≤ 0.14 is not promoted; it is a fail-closed
            contract for the sharpest route currently mapped. Not a proof of RH, which requires <InlineMath tex="\Lambda \le 0" />.
          </p>
        </div>

        <div style={{ marginTop: 20, fontSize: 13.5 }}>
          <span className="ed-lbl" style={{ marginRight: 8 }}>related</span>
          <Link to="/twin-ladder">Twin ladder</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/frozen-rung-pt-equivalence">Frozen-rung ⟺ Platt–Trudgian</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/twistor">Twistor framework (geometric layer)</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/lambda-bounds">Λ bounds ledger</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/flow-blindness-no-go">Flow-blindness no-go</Link><span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/atlas">The atlas</Link>
        </div>
      </div>
    </div>
  );
}
