import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import { IMP95077_FAR_LEDGER_DEGRADE_TABLE } from '../data/imp-95077-far-ledger-degrade-table.js';

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

// Even-class block kernel K(b,bp) = envE(min(b,bp), |b-bp|), K(b,b)=0, on the
// leading blocks {0,2,4} that capture the imp-95008 Perron eigenvalue to
// machine precision (imp-95098-perron-eigenvalue-closed-form.js).
const KERNEL_ENTRIES = {
  '0,2': 3.9197920255561178e-5, '2,0': 3.9197920255561178e-5,
  '0,4': 1.4905600807225833e-10, '4,0': 1.4905600807225833e-10,
  '2,4': 3.398047003867178e-8, '4,2': 3.398047003867178e-8,
  '0,0': 0, '2,2': 0, '4,4': 0,
};

// Near-Perron eigenvector weight share (|v_b|^2) at lambda_max=3.9197935113802585e-5.
const WEIGHT_PROFILE = [
  [0, 0.499999623],
  [2, 0.499999998],
  [4, 3.79056665e-7],
];

const KERNEL_LOG_LO = Math.log10(1.4905600807225833e-10);
const KERNEL_LOG_HI = Math.log10(3.9197920255561178e-5);

function kernelCellColor(val) {
  if (!val) return 'var(--paper2)';
  const t = Math.min(1, Math.max(0, (Math.log10(val) - KERNEL_LOG_LO) / (KERNEL_LOG_HI - KERNEL_LOG_LO)));
  const lo = [246, 241, 231]; // --paper2
  const hi = [194, 58, 28]; // --terra-dk
  const rgb = lo.map((c0, i) => Math.round(c0 + (hi[i] - c0) * t));
  return { bg: `rgb(${rgb.join(',')})`, t };
}

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
        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '10px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>provenance gap (recorded 2026-09-02)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            The source-cell anchor value <span className="ed-mono" style={{ fontSize: 12 }}>|E₉₇| = 0.2141254901198318</span> at{' '}
            <InlineMath tex="x_* = X + \sqrt{1-y_0^2}" /> was produced by the paper's reference-[19] replay
            (<span className="ed-mono" style={{ fontSize: 12 }}>strict_sub014_extension_v1</span>), which has not been
            located in any project repository or workspace. An independent native evaluator built for this program
            reproduces the 400-bit certified window-placement margins digit-for-digit but does not reproduce the anchor
            value under either candidate parameter row — so the value is currently <strong>unreplayable</strong> pending
            recovery of the producing archive (or its conventions), and the real Gate-2 probe stays gated on a genuine
            anchor reproduction. Full diagnosis: <span className="ed-mono" style={{ fontSize: 12 }}>native/gate2-lane-a/README.md</span>.
          </p>
        </div>
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
        <div style={{ borderLeft: '3px solid var(--ink-soft)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>Gate-2 completion-contract status (imp-95012 frozen spec)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 6px' }}>
            <strong>Closed.</strong> One anchor cell: <InlineMath tex="N = 690988" />,{' '}
            <InlineMath tex="|x - x_*| \le 1/40000000000" />, measured{' '}
            <InlineMath tex="|E_{97}| = 0.2141254901198318 < 0.27968819555261474" /> — a documented reserve of{' '}
            <InlineMath tex="0.0655627054327926" /> against the exact allowance <InlineMath tex="R_{ex}" />.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 6px' }}>
            <strong>Open.</strong> The same global inequality <InlineMath tex="|C_{E,17}| < 0.27968819555261474" />{' '}
            uniformly over the family <InlineMath tex="690988 \le N \le 54799999" />, every window parameter, and both
            seam sides — the one open family this page's route atlas is aimed at closing.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Offline.</strong> Two named sub-gaps stand between the anchor cell and a family-wide arithmetic
            verdict: <span className="ed-mono" style={{ fontSize: 12 }}>imp-95011-sub-arithmetic-carrier-scan</span>{' '}
            (the true sampled sup and per-unit-N increment L over the family, ~1e3 log-spaced N, both seam sides) and{' '}
            <span className="ed-mono" style={{ fontSize: 12 }}>imp-95014-sub-arb-prec128-lane</span> (an arbitrary-precision
            float-vs-Arb cross-check of the Lane B evaluator). Both are structural demonstrations on a surrogate carrier
            today, not arithmetic measurements of <InlineMath tex="C_{E,17}" />; neither has run. This records status
            only — no bound is promoted, no gap is closed.
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 12px' }}>Named heavy-compute ticket</th>
                  <th style={{ padding: '8px 12px' }}>Evaluator requirement</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'imp-95011-sub-arithmetic-carrier-scan',
                    'Arithmetic C_E,17 over ~1e3 log-spaced N in [690988, 54799999], (N,N+1) and (N,N+2) pairs, both seam sides, ~5 window parameters (~2e4 O(N) evaluations); reports the real per-unit-N increment L and the real sampled sup.',
                  ],
                  [
                    'imp-95014-sub-arb-prec128-lane',
                    'Arb acb interval arithmetic at prec 128 (192-bit spot audits), Gram-form Lane B skeleton, per tmp/verify_ydini_genmoll.c, on a 1-2 percent subsample of the imp-95011 Lane-A evaluations plus the anchor cell; gate is crossCheck < 1e-9.',
                  ],
                ].map(([ticket, req]) => (
                  <tr key={ticket} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5, whiteSpace: 'nowrap' }}>{ticket}</td>
                    <td style={{ padding: '7px 12px' }}>{req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The decisive analytic object is <strong>one noncommuting weld</strong>: the Fresnel/B-transform and a prime
          projection do not commute, <InlineMath tex="[\mathcal{B}_v,\Pi_p]\neq 0" />. The nonzero aliases are shifted
          Fresnel–Airy transition packets whose correlated sum must stay coupled through the five shells or the 25
          defects — that commutator, not the already-paired smooth interior, is where the route lives.
        </p>
        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>alias-packet coupling — quantitative structure</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Each nonzero alias contributes a Fresnel–Airy transition packet with amplitude set by two exact scales: the
            prime-comb weight <InlineMath tex="w(h)" /> at frequency <InlineMath tex="h/p" /> and the phase curvature{' '}
            <InlineMath tex="\lambda" /> of the shifted stationary point <InlineMath tex="u = v/(k - h/p)" />. Away from
            curvature degeneracy each packet obeys the stationary-phase bound{' '}
            <InlineMath tex="|I_h| \le C\, w(h)\, \lambda^{-1/2}" />; where two stationary points coalesce (near the fold)
            it passes through the Airy regime <InlineMath tex="|I_h| \le C\, w(h)\, \lambda^{-1/3}" />. Because the five
            shells carry Fourier-disjoint supports (the exact five-shell identity), cross-shell products drop out of the
            correlated sum, so the coupling collapses to an intra-shell <InlineMath tex="\ell^2" /> sum over{' '}
            <InlineMath tex="h" />, repeated across the five shells and 25 defects — not the <InlineMath tex="\ell^1" />{' '}
            termwise sum, which is too coarse to fit the 0.0655627 reserve.
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Named sub-gap:</strong> the one quantity still un-enclosed is the uniform aliased second moment{' '}
            <InlineMath tex="\sum_{h\neq 0} w(h)^2\, \lambda(h)^{-2/3}" /> (Airy-regime majorant), bounded uniformly over{' '}
            <InlineMath tex="690988 \le N \le 54799999" /> and both seam sides. A uniform bound on that single scalar
            closes the correlated coupling; without it the weld <InlineMath tex="[\mathcal{B}_v,\Pi_p]\neq 0" /> stays
            open. No bound is promoted.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>assessment — the single van der Corput / stationary-phase majorant is refuted (imp-95006)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The tempting non-tiling route is a <em>single</em> uniform second-derivative (van der Corput) or
            stationary-phase majorant of the shifted Fresnel–Airy alias packets across the whole window
            <InlineMath tex="\,690988 \le N \le 54799999" />. The reserve is tight: the measured correlated peak of
            <InlineMath tex="\,|C_{E,17}|" /> sits at <InlineMath tex="\approx 0.2141255" />, leaving only
            <InlineMath tex="\,0.0655627 = 0.27968819555261474 - 0.2141255\," /> of enclosure budget to the strict target.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Obstruction.</strong> After the stationary-phase reduction, a van der Corput bound is an
            <em> amplitude</em> majorant: it dominates each packet by its envelope mass and then triangle-sums across
            the five shells, giving an enclosure width no smaller than
            <InlineMath tex="\,\sum_g \lVert Z_g\rVert_1 - |C_{E,17}|" />. But the value <InlineMath tex="\approx 0.2141" />
            is achieved through inter-shell phase cancellation (the five-shell identity, the anti-Hermitian complement),
            so the discarded cancellation mass is <em>positive and non-small</em> — the same structural loss that makes
            raw tiling diverge. A shell-decoupled majorant therefore cannot fit the <InlineMath tex="0.0655627" />
            reserve; it reproduces the divergence it was meant to avoid. <strong>Named sub-gap:</strong> a uniform
            enclosure must retain the correlated phase <em>across</em> shells rather than majorize per shell — either
            through the noncommuting weld <InlineMath tex="[\mathcal{B}_v,\Pi_p]" /> (bound the correlated alias coupling
            directly, imp-95008) or through a <em>coercive</em> quadratic form on the five-shell sum (the physical-bulk /
            cubic-canonical gates, imp-95007), not an envelope bound. This does not promote Λ ≤ 0.14; it closes the
            single-majorant family as a rigorous obstruction and routes the reserve to the correlated-phase gates.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>conditional alias-coupling reduction (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Two unconditional lemmas structure the weld. First, the exact alias decomposition: with{' '}
            <InlineMath tex="\Pi_p = \tfrac1p\sum_{h=0}^{p-1} M_h" /> the arithmetic-progression comb, every linear
            operator satisfies <InlineMath tex="[\mathcal{B},\Pi_p] = \tfrac1p\sum_{h\neq 0}[\mathcal{B},M_h]" /> —
            the h = 0 component contributes zero commutator defect identically, so "the smooth interior pairs exactly"
            is an operator identity, not an estimate. Second, a bounded-overlap collapse: alias images whose supports
            (in any one orthonormal picture) have overlap multiplicity K obey{' '}
            <InlineMath tex="\|\sum_h a_h\|^2 \le K \sum_h \|a_h\|^2" />, an exact Pythagorean equality at K = 1.
            Applied to the doubly-indexed family <InlineMath tex="[\mathcal{B},M_h]f_g" /> this collapses the
            five-shell correlated weld to <em>single-shell</em> packet masses times the one constant K, and with the
            packet majorant above it gives{' '}
            <InlineMath tex="\|[\mathcal{B},\Pi_p]f\|^2 \le C^2 K \big[\textstyle\sum_{h\neq0} w(h)^2\lambda(h)^{-2/3}\big]\,\|f\|^2" />{' '}
            — the named sub-gap scalar is the exact quadratic controller of the weld. In the equidistributed regime of
            the equal-weight prime comb the route improves on the ℓ¹ triangle sum by{' '}
            <InlineMath tex="\sqrt{(p-1)/K}" /> (≈ 9.8 at p = 97, K = 1); with K ≥ 2 and mass concentrated on one
            alias it can lose to ℓ¹.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Precision on the earlier ℓ² claim:</strong> the proved Fourier-disjointness covers the shell index
            g only; the ℓ² collapse over the alias index h additionally requires alias-support disjointness, which
            fails exactly where adjacent stationary points <InlineMath tex="u = v/(k - h/p)" /> coalesce — the Airy
            fold. <strong>Open residuals:</strong> the fold-overlap multiplicity K, the named scalar itself (uniform
            over the window and both seam sides), and the passage from this ℓ² weld bound to the pointwise scalar{' '}
            <InlineMath tex="|C_{E,17}|" /> (shells are evaluated at a point, so a duality step with its own constant
            is still required). Cross-checked on a finite Fresnel model in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-weld-alias-l2-collapse.js</code>.
            This promotes no bound.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Follow-up — the fold geometry is inverted (unconditional):</strong> the shifted denominators{' '}
            <InlineMath tex="k - h/p" /> form an exactly <InlineMath tex="(1/p)" />-separated set with{' '}
            <InlineMath tex="|k - h/p| \ge 1/p" /> (a curvature floor, so no single Airy packet amplitude exceeds{' '}
            <InlineMath tex="C\,w(h)\,p^{1/3}" />), and the stationary-point spacing{' '}
            <InlineMath tex="|u - u'| = v|d - d'|/(dd')" /> <em>grows</em> toward the curvature floor. Adjacent-alias
            supports therefore become disjoint at the fold end (provably so in the fold-most dyadic block at p = 97);
            overlap accrues only at the high-curvature end, with the per-block bracket{' '}
            <InlineMath tex="K(\Delta) \le 1 + \lfloor 8cp\,\Delta^{2-\beta}/v \rfloor" />. Under the quadratic-Fresnel
            curvature normalization <InlineMath tex="\lambda = |k - h/p|" />, the named scalar has the N-free
            worst-case-curvature majorant{' '}
            <InlineMath tex="2p^{-4/3}\textstyle\sum_{j \le (p-1)/2} j^{-2/3} \approx 0.03811" /> at p = 97 (the
            floor-only cap is 0.21540), so the window-uniformity demand reduces to one normalization constant in the
            separable case. The paper-phase normalization, the packet-width constants, and the ℓ²-to-pointwise step
            remain open. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-alias-separation-curvature-floor.js</code>.
            This promotes no bound.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 0' }}>
            <strong>Follow-up — the ℓ²-to-pointwise duality step has an exact constant (unconditional):</strong> for any
            finite orthonormal system, <InlineMath tex="\sup\{|v(x)| : v \in H_W,\ \|v\| \le 1\} = \sqrt{K_W(x,x)}" />{' '}
            with <InlineMath tex="K_W(x,x) = \sum_{i \in W} |\varphi_i(x)|^2" /> the diagonal reproducing kernel (an
            inverse Christoffel function), attained at the normalized kernel — so no better generic duality step exists.
            In the DFT picture <InlineMath tex="K_W(n,n) = |W|/L \le 1" /> at <em>every</em> point (the seam-side /
            window quantifier is exact and free at this step), and the coordinate picture gives constant exactly 1 with
            no hypothesis; by the trace identity the average of <InlineMath tex="K_W(x,x)" /> is{' '}
            <InlineMath tex="|W|/L" /> in every orthonormal picture. Chained with the conditional closed form above, the
            strict open-family target holds iff the residual constant product{' '}
            <InlineMath tex="Q = \sqrt{K_W(x,x)}\, C \sqrt{K}\, \|f\|" /> stays below{' '}
            <InlineMath tex="0.27968\ldots/\sqrt{\bar S} \approx 1.4327" /> — strictly above 1, so the pointwise step is
            not the binding constraint. What remains of the former duality residual is finite: identifying{' '}
            <InlineMath tex="C_{E,17}" /> as a weld evaluation in a specific orthonormal picture with explicit
            normalization, and the Christoffel diagonal of the 18-mode carrier system at the seam points (18 numbers per
            point). At unit constants the ℓ¹ pointwise route caps at 1.7977 (above the target); the ℓ²+duality route
            caps at <InlineMath tex="\sqrt{\bar S} \approx 0.1952" />. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-evaluation-christoffel-duality.js</code>.
            This promotes no bound.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>far-bracket ceiling ledger (imp-95008, reference θ = 10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Three ceiling-side moves reduce the far coefficient <InlineMath tex="c_{\text{Far}}" /> from the
            starting value 4, floors left untouched at every step:
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 12px' }}>Move</th><th style={{ padding: '8px 12px' }}>From</th><th style={{ padding: '8px 12px' }}>To</th><th style={{ padding: '8px 12px' }}>Factor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['seventeenth (exponent-split)', '4', '2.9469476400572421', '1.3573366372815172'],
                  ['eighteenth (width-pinned three-window)', '2.9469476400572421', '0.7741509917026236', '3.8066832848407173'],
                  ['nineteenth (exact-pair correlation)', '0.7741509917026236', '0.2717408057586117', '2.8488580857094559'],
                ].map(([move, from, to, factor]) => (
                  <tr key={move} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '7px 12px', color: 'var(--ink)' }}>{move}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{from}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{to}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{factor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            The three factors compose to <InlineMath tex="4/0.2717408057586117 = 14.719909248937805" />. The
            headline θ = 10 gap moves 8.001968970787363 → 2.8088338309749887 and the fixed-97 gap moves
            642.1998717107592 → 225.42360917596611. Floors are unchanged by these moves; ceiling optimality is
            not claimed — the outer parity factor 2 and the tightness of the substitution point remain as named
            open slack. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-exact-pair-correlation-ceiling.js</code>.
            This promotes no bound.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — far-bracket ceiling (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Within the MAJ(σ, θ) envelope class, the per-pair correlation bound at the substituted point is now
            exact (zero inequality slack survives Lemmas CC/RM/PF) — but that is sharpness of one envelope
            treatment, not a claim that the MAJ class itself is optimal. The headline θ = 10 far-bracket gap
            still stands at 2.8088338309749887× (floor 0.096745062937484763 vs ceiling 0.2717408057586117),
            and the packet-envelope constants (c, β, σ, θ, A_d) have not been transferred from this model family
            to the PAPER's packets. Also open: the curvature ceiling D retained by the window, the paper phase
            curvature normalization, and residual (c) — the ℓ²-weld-bound to pointwise |C<sub>E,17</sub>| passage.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--brass)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>twentieth–twenty-second continuations (imp-95008): per-pair closure, proof-domain widen, aggregation lever</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The nineteenth continuation left the non-parity residual bundled into three named slacks: (b1) per-pair
            corner-substitution tightness, (b2) intra-class block-mass AM-GM routing, and (b3) sup<sub>b</sub>{' '}
            routing of Ω. Three follow-on moves resolve them:
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            <strong>Twentieth (Theorem CA + Lemma EQ):</strong> proves the Lemma X separation floor V(b, j) is the
            exact infimum of the pair separation over each cell, attained in closure at the same corner where the
            Lemma RHO width-ratio cap binds — so (b1) CLOSES with zero slack: no per-pair ceiling improvement exists
            in the continuous family. Corollary R2 quantifies (without applying) a fixed-97 grid-only slack: the
            dominant cell's exhaustive-enumeration sup is 0.8258474234948617× the substituted envelope. Cross-checked
            in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-substitution-corner-attainment.js</code>.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            <strong>Twenty-first (Lemma RM-D):</strong> relaxes the nineteenth width-ratio monotonicity guard to the
            range Theorem Y-EXACT actually needs, dropping the exact-proof break boundary from{' '}
            s* = 2.9483832742380818 to s** = 2.4095981617415205 — a proof-domain widening, not a numeric ledger
            change; the likely-paper point s = 3 gains a 14.73× larger margin (0.0239 → 0.3513). Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-rm-domain-refined-low-s-extension.js</code>.
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong>Twenty-second (Lemma SW + Theorem Y-PERRON):</strong> replaces the unweighted sup-row-sum
            aggregation pullout with a weighted-Schur aggregation certified by a machine-precision Rayleigh
            (λ<sub>max</sub>) sandwich of width 2.3e-16, executing and consuming (b2)+(b3) — measured gain
            1.0008665157515448× (0.0866%). This is the first move in the chain that moves the tracked far ceiling:
            0.2717408057586117 → 0.27150554192989773, headline θ = 10 gap 2.8088338309749887× → 2.8064020394026787×,
            fixed-97 gap 225.42360917596611× → 225.22844518052122×; floors untouched. The surviving residual
            1.4032010197013394 is pinned to the witness-side E-realization step (named sub-gap
            imp-95008-subgap-witness-Erealization-split). Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-perron-weighted-far-routing.js</code>.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — surviving residual after (b2)+(b3) closure (imp-95008)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Of the three non-parity slacks named after the nineteenth continuation, (b1) CLOSED at the twentieth move
            (Theorem CA + Lemma EQ, zero slack) and (b2)+(b3) CLOSED together at the twenty-second move (Lemma SW +
            Theorem Y-PERRON, weighted-Schur aggregation certified to machine precision). No named non-parity slack
            remains open on the aggregation side. The one surviving residual on the witness side is the
            E-realization step, sized at 1.4032010197013394× (named sub-gap
            imp-95008-subgap-witness-Erealization-split) — this is not shrunk by any of the twentieth–twenty-second
            moves and is the binding obstruction to closing the far-bracket gap further within this envelope family.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — E-realization split refines the residual into two coupled channels (imp-95008, twenty-third continuation)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            The twenty-third continuation (Lemmas ES + PB, Theorem ER) executes the E-realization sub-gap and
            factors the surviving residual 1.4032010197013394 exactly by parity channel:
            r = 1 / (2 × attainment × occupancy × parity-balance), with per-pair envelope attainment
            0.6014409758412518, occupancy 0.6163838457278105, and parity balance measured near-exhausted at
            0.9611824921094692. Each factor is certified below 1 conditional on MAJ(σ, θ) (envelope caps,
            the Lemma SW quadratic-form bound, and Cauchy–Schwarz respectively), so no factor hides
            compensation. The residual now lives in exactly two COUPLED channels — per-pair envelope
            attainment and occupancy — with the aggregation and parity-balance levers closed or
            near-exhausted. The surviving open question is named
            imp-95008-subgap-attainment-occupancy-tradeoff: prove or refute a bound
            attainment × occupancy ≤ γ &lt; 1 over MAJ witnesses, or exhibit a witness family driving the
            product to 1. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95008-witness-erealization-split.js</code>.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ borderLeft: '3px solid var(--terra-dk)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '14px 18px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>honest status — paper-packet transfer of the far-ceiling ledger (imp-95026)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            imp-95026 derives how the far coefficient depends on the packet constants (σ, θ, β, and the
            isolation constant Q) and scans a neighborhood of the model point — it does <strong>not</strong> instantiate
            the actual Section 4.5 packet definition, which is not pinned in this repository. What the scan shows: the
            amplitude A<sub>d</sub> cancels out of the ledger entirely; the ledger stays below the pre-seventeenth 4
            everywhere scanned (worst point 0.8924623374689161 at θ = 2); it degrades roughly 3× at low θ (θ ≈ 2 →
            ceiling ≈ 0.89 instead of 0.2717408057586117); and the nineteenth-continuation exact-substitution proof
            itself breaks below the sharp threshold σ + θ = 2.948383274238082, falling back to the eighteenth-window
            envelope. This is a <strong>sensitivity map</strong> over plausible paper constants, not a single
            instantiated paper-packet number — the remaining step is reading (σ, θ, β, c, v, D) off the paper text.
            No bound is promoted; Platt–Trudgian Λ ≤ 0.2 remains SOTA.
          </p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>far-ledger degrade scan (imp-95077, σ = 1, θ = 2..10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            A row-by-row sensitivity scan of the far coefficient <InlineMath tex="c_{\text{Far}}" /> and the ledger
            factor <InlineMath tex="4/c_{\text{Far}}" /> over every integer θ in the imp-95026 low-θ neighborhood,
            distinct from the reference θ = 10 ledger above.
          </p>
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                  <th style={{ padding: '8px 12px' }}>θ</th>
                  <th style={{ padding: '8px 12px' }}>s = σ+θ</th>
                  <th style={{ padding: '8px 12px' }}>c<sub>Far</sub></th>
                  <th style={{ padding: '8px 12px' }}>4/c<sub>Far</sub></th>
                </tr>
              </thead>
              <tbody>
                {IMP95077_FAR_LEDGER_DEGRADE_TABLE.table.map((row) => (
                  <tr key={row.theta} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                    <td style={{ padding: '7px 12px', color: 'var(--ink)' }}>{row.theta}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{row.s}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{row.cFar.toFixed(4)}</td>
                    <td style={{ padding: '7px 12px', fontFamily: 'var(--ed-mono)', fontSize: 11.5 }}>{row.ledgerFactor.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            c<sub>Far</sub> falls monotonically (0.8925 → 0.2717) and the ledger factor rises monotonically
            (4.482 → 14.720) across this range — a 3.284× span, quantifying the imp-95026 Finding 3 "~3× margin
            shrink at low θ". Every row still clears the pre-seventeenth 4 (worst row θ = 2 beats it by 4.48×).
            Sensitivity scan over an unpinned θ, not an instantiated paper number; promotes no bound; NO QED.
            Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95077-far-ledger-degrade-table.js</code>.
          </p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>even/odd block kernel heatmap (imp-95101, reference θ = 10)</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
            The imp-95008 Lemma SW aggregation constant λ<sub>max</sub> is the Perron eigenvalue of the symmetric
            even-class block kernel <InlineMath tex="K(b,b') = \mathrm{env}_E(\min(b,b'),\,|b-b'|)" />, <InlineMath tex="K(b,b)=0" />.
            To machine precision it is captured by the leading 3×3 submatrix on blocks {'{0, 2, 4}'} (imp-95098):
          </p>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: 14, overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ width: 44 }} />
                    {[0, 2, 4].map((bp) => (
                      <th key={bp} className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', padding: '4px 10px', fontWeight: 400 }}>b'={bp}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 2, 4].map((b) => (
                    <tr key={b}>
                      <th className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', padding: '4px 10px', textAlign: 'right', fontWeight: 400 }}>b={b}</th>
                      {[0, 2, 4].map((bp) => {
                        const val = KERNEL_ENTRIES[`${b},${bp}`];
                        const isDominant = (b === 0 && bp === 2) || (b === 2 && bp === 0);
                        const c = kernelCellColor(val);
                        return (
                          <td key={bp} style={{ padding: 0 }}>
                            <div
                              className="ed-mono"
                              title={val ? `K(${b},${bp}) = ${val}` : `K(${b},${bp}) = 0 (diagonal)`}
                              style={{
                                width: 88, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10.5, color: val ? (c.t > 0.45 ? '#fdfaf3' : 'var(--ink)') : 'var(--faint)',
                                background: val ? c.bg : 'var(--paper2)',
                                border: isDominant ? '2px solid var(--terra-dk)' : '1px solid var(--hairline)',
                                boxSizing: 'border-box',
                              }}
                            >
                              {val ? val.toExponential(2) : '0'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ minWidth: 230 }}>
              <div className="ed-lbl" style={{ marginBottom: 6, fontSize: 11 }}>near-Perron weight profile</div>
              {WEIGHT_PROFILE.map(([b, share]) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0' }}>
                  <span className="ed-mono" style={{ fontSize: 11, width: 42, color: 'var(--ink-soft)' }}>b={b}</span>
                  <div style={{ flex: 1, background: 'var(--paper2)', borderRadius: 3, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(share * 100, 0.6)}%`, height: '100%', background: 'var(--terra-dk)' }} />
                  </div>
                  <span className="ed-mono" style={{ fontSize: 10.5, width: 78, textAlign: 'right', color: 'var(--ink-soft)' }}>{(share * 100).toPrecision(3)}%</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            The eigenvector at λ<sub>max</sub> = 3.9197935113802585e-5 splits weight essentially evenly between
            blocks 0 and 2 (49.9999623% / 49.9999998%), with block 4 carrying only 3.79×10⁻⁵ percent — the
            Perron vector is, to nine significant figures, the symmetric mode of the dominant (0, 2) bond
            <InlineMath tex="\,a=\mathrm{env}_E(0,2)=3.9197920255561178\times10^{-5}" /> alone; the (0,4) and (2,4)
            bonds contribute only a second-order block-4 resolvent shift. Cross-checked in{' '}
            <code className="ed-mono" style={{ fontSize: 11.5 }}>src/data/imp-95098-perron-eigenvalue-closed-form.js</code>.
            This visualizes an existing constant; no bound is changed.
          </p>
        </div>

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

        {/* The permutation atlas (§9) */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The permutation atlas — every family classified</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Every admissible word has the correlation-preserving, modulus-last <strong>normal form</strong>:
          complete → direct/dual correlate → heat + prime masks → exact transform → shell or graph
          recombination → Schur closure (if used) → one scalar bound. Against that normal form, every
          rearrangement family is classified by its exact invariant — so "try every permutation" is closed,
          not combinatorial:
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 12px' }}>Permutation family</th><th style={{ padding: '8px 12px' }}>Exact invariant</th><th style={{ padding: '8px 12px' }}>Proof consequence</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['All 25! prime orders', 'R₉₇ and E₉₇', 'choose order for conditioning only'],
                ['Divisor / 25-defect / five-shell / Heat–Euler fiber forms', 'the same scalar cocycle', 'alternative coordinates; budgets cannot be added'],
                ['DFT / real-phase chirp / block isometries', 'coefficient ℓ² norm', 'common remainder transports exactly; center still open'],
                ['Independent bicomplex sectors', 'maximum sector residual', 'no improvement'],
                ['Unitary twistor rotations', 'spectrum and residual norm', 'no improvement'],
                ['Graph compressions', 'correlated average residual', 'POSSIBLE GAIN — conditional on characteristic invariance and complement gap'],
                ['Core/tail basis rotations', 'singular values & Schur expression', 'no missing tail gap is created'],
                ['Early componentwise moduli', 'no recoverable complex sum', 'FORBIDDEN when correlation is needed'],
              ].map(([f, inv, c]) => (
                <tr key={f} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 12px', color: 'var(--ink)', fontWeight: 600 }}>{f}</td>
                  <td style={{ padding: '7px 12px' }}>{inv}</td>
                  <td style={{ padding: '7px 12px', fontWeight: /POSSIBLE|FORBIDDEN/.test(c) ? 600 : 400, color: /POSSIBLE/.test(c) ? '#4c7a4a' : /FORBIDDEN/.test(c) ? '#c23a1c' : undefined }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 10 }}>
          The only families with possible gain are <strong>graph compressions</strong> (the §6.2 correlated
          graph isometry, where the anti-Hermitian parts can genuinely cancel — the operator analogue of
          retaining both ladder phases — gated on characteristic invariance and a Schur complement gap) and
          the <strong>moving-reference Rouché gluing</strong> (the reference Q need not sit in a fixed
          half-plane; overlapping analytic phase charts glue by winding). Everything isometric or
          "information-preserving" alone — bicomplex sectors, twistor rotations, exact Fourier moves — is
          provably no-gain; heat methods enter only through the proof-bearing freeze–thaw closures
          (characteristic bridge, tail coercivity + Schur closure, the Duhamel heat/cutoff commutator, and
          the shell-and-collision thaw theorem).
        </p>

        {/* The route atlas (§10) */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>The route atlas — eight stacks, readiness-ranked</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Two rankings differ: the closest route to a <em>checkable new theorem</em> is not the shortest route
          to RH. The L-function functor and the bicomplex–twistor interface are <strong>enabling tests, not
          additional proof mechanisms</strong> — neither has a conclusion until it feeds one of these rows:
        </p>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper2)', textAlign: 'left', color: 'var(--faint)' }}>
                <th style={{ padding: '8px 10px' }}>#</th><th style={{ padding: '8px 12px' }}>Route</th><th style={{ padding: '8px 12px' }}>Exact payoff if completed</th><th style={{ padding: '8px 12px' }}>Decisive open theorem</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', 'Global P97 barrier', 'non-effective Λ < 0.14 from strict source completion', 'uniform correlated center / shifted-alias packet enclosure'],
                ['2', 'Enlarged slab + new tail', 'explicit Λ ≤ 0.1399', 'certify the rectangular-slab inheritance (4.4) and the new final-time tail (4.5)'],
                ['3', 'Hermite–Biehler / de Branges', 'fixed-time bound; at t = 0, RH', 'arithmetic HB contraction and half-plane exhaustion'],
                ['4', 'Weil-positive characteristic system', 'RH at t = 0', 'classical Weil positivity with a global limit theorem'],
                ['5', 'Argument-principle exhaustion', 'fixed-time real-rootedness; at t = 0, RH', 'uniform near-axis and infinite-tail control'],
                ['6', 'Collision-free heat dynamics', 'descent from a real-rooted time to target time', 'exclude every collision and escape at infinity'],
                ['7', 'Self-adjoint characteristic pencil', 'RH if the determinant is Ξ', 'noncircular characteristic identity and tail closure'],
                ['8', 'Diagonal t ↓ 0 family', 'RH from complete rows with endpoints tending to zero', 'a global certificate at every row'],
              ].map(([n, r, p, d]) => (
                <tr key={n} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)' }}>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--ed-mono)' }}>{n}</td>
                  <td style={{ padding: '7px 12px', color: 'var(--ink)', fontWeight: 600 }}>{r}</td>
                  <td style={{ padding: '7px 12px' }}>{p}</td>
                  <td style={{ padding: '7px 12px' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ borderLeft: '3px solid var(--blue, #3f6b86)', background: 'var(--paper2)', borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '12px 0' }}>
          <div className="ed-lbl" style={{ marginBottom: 4 }}>a second explicit target — the conditional 0.1399 row</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Route 2 trades the single cocycle weld for two sharply delimited tasks: with{' '}
            <InlineMath tex="y_* = 33/200,\ t_* = 10103/80000" />, a rectangular-slab inheritance lemma plus a
            directed proof of <InlineMath tex="H_{t_*}(x+iy) \ne 0" /> on the enlarged region would give{' '}
            <InlineMath tex="\Lambda \le 0.1399" />. Neither hypothesis is certified by the present project —
            an exact research target, not a reported improvement. Certified exclusions also close several
            tempting shortcuts: independent macro budgets discard essential cancellation; generic low-rank
            rough transforms cannot close the residual; raw tiling needs &gt; 7.2×10²⁶ cells. The missing
            producer must exploit the specific paired heat–log family and batch the integer windows analytically.
            This row does <strong>not</strong> presuppose the Gate-2 open family <InlineMath tex="690988 \le N \le 54799999" /> from
            Route 1 above: it trades that single cocycle weld for the slab-plus-tail pair instead, so it is
            tracked, certified, and could resolve on its own timeline, independent of Gate-2.
          </p>
        </div>

        {/* Formalization status */}
        <h2 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 24, margin: '32px 0 6px', color: 'var(--ink)' }}>Machine-verified (Lean 4, Aristotle wave 1)</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Five components of this architecture were autoformalized (Harmonic Aristotle) and kernel-verified
          against mathlib v4.28 — <code>lake build</code> green, zero <code>sorry</code>/<code>axiom</code>, every theorem on the three standard
          axioms, and an independent statement-faithfulness review rating all five faithful with non-vacuous
          hypothesis packages. Sources: <code>formalization/lean-aristotle/permutation-calculus/</code>.
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.7, fontSize: 14, color: 'var(--ink-soft)' }}>
          <li><strong>Permutation-defect lemma</strong> (Lemma 3.1): <code className="ed-mono" style={{ fontSize: 12 }}>norm_permProd_sub_one_le_sum</code> — for contractions and any permutation π, ‖T_π − T_id‖ ≤ Σ over inversions of the commutator norms; plus the weighted noncontractive form and the bubble-chain combinatorial core. Unconditional.</li>
          <li><strong>Anti-Hermitian strip bound</strong> (Prop 2.1): <code className="ed-mono" style={{ fontSize: 12 }}>abs_im_le_of_represented</code> (|Im x| ≤ η) and <code className="ed-mono" style={{ fontSize: 12 }}>deBruijnNewman_le_of_global_representation</code> (Λ ≤ t + η²/2) — the latter is by design a conditional wrapper: (G) global representation and (S) the de Bruijn strip contraction enter as explicit named hypotheses, exactly as in the paper.</li>
          <li><strong>Five-shell identity</strong> (eqs. 11–12): <code className="ed-mono" style={{ fontSize: 12 }}>five_shell_identity</code> — E₉₇ = (1−A)Y₄(0) − A·ΣZ_g(0), <em>unconditional</em>, with the disjoint-Fourier-support orthogonality proved, not assumed.</li>
          <li><strong>The §4.7 implication chain</strong>: <code className="ed-mono" style={{ fontSize: 12 }}>theorem4_chain</code> — from hypotheses (H0)–(H6), including the load-bearing (H3) R_ex ≤ m₉₇ − |A₉₇|ε_tr and the strict open weld (H4) ‖E₉₇‖ &lt; R_ex, derives winding 0 (a continuous-logarithm predicate, derived not assumed) and concludes Theorem 4.1(ii) at the exact row constants. The (H6) argument-principle packaging is dischargeable against a separately kernel-verified general argument principle on rectangles.</li>
          <li><strong>Twistor heat compatibility</strong> (Lemma 6.1): <code className="ed-mono" style={{ fontSize: 12 }}>heat_compat_on_range</code> — I_K Â₊ = Â₋ I_K on ran F₊ from the paper's three intertwining relations.</li>
        </ul>
        <p style={{ fontSize: 13, color: 'var(--faint)', lineHeight: 1.6 }}>
          Autoformalization caveat (unchanged from the frozen-rung set): proofs are kernel-verified; faithfulness
          of statements to the intended mathematics was independently reviewed but is not a referee. The open
          weld ‖E₉₇‖ &lt; R_ex — the one open family above — remains an <em>assumed</em> input to the chain: nothing
          here promotes Λ ≤ 0.14.
        </p>

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
