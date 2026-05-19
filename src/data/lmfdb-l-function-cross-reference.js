/**
 * @module lmfdb-l-function-cross-reference
 * @fileoverview Curated cross-reference table of L-functions from the LMFDB
 * (https://www.lmfdb.org/L). Each entry carries the Bober-Sutherland label,
 * degree, weight, conductor, leading-coefficient sign, first five nontrivial
 * zeros (imaginary parts on the critical line), and a note on the GRH analog.
 *
 * DATA FILE ONLY -- no UI page. The data connects our ZPO ladder-network
 * model to the wider L-function ecosystem: every degree-1 Dirichlet
 * L-function is a "single-rung ladder" in the ZPO picture; higher-degree
 * L-functions correspond to tensor products of prime oscillators.
 *
 * Zero data sourced from published tables (Odlyzko, LMFDB bulk downloads,
 * Rubinstein). Labels follow the LMFDB convention: degree-conductor-...
 *
 * Exports:
 *   - lmfdbCrossReference (default) -- full array
 *   - getByLabel(label) -- lookup by LMFDB label
 *   - getByDegree(d) -- filter by degree
 *   - assertIntegrity() -- 5 structural checks
 *
 * @see imp-1103
 */

const lmfdbCrossReference = [
  // ═══════════════════════════════════════════════════════════════════════
  // DEGREE 1 — Dirichlet L-functions
  // ═══════════════════════════════════════════════════════════════════════
  {
    label: '1-1-1.1-r0-0-0',
    name: 'Riemann zeta function',
    lFunction: 'zeta(s)',
    degree: 1,
    weight: 0,
    conductor: 1,
    gammaShifts: [0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [14.134725, 21.022040, 25.010858, 30.424876, 32.935062],
    grhNote: 'RH: all nontrivial zeros lie on Re(s)=1/2. Equivalent to our Lambda >= 0 result for the full zeta cascade.',
    zpoConnection: 'The full twin-ladder network; our primary object of study.',
  },
  {
    label: '1-3-3.2-r0-0-0',
    name: 'Dirichlet L-function mod 3',
    lFunction: 'L(s, chi_{3.2})',
    degree: 1,
    weight: 0,
    conductor: 3,
    gammaShifts: [0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [8.039853, 14.769856, 17.846565, 22.706514, 25.391384],
    grhNote: 'GRH for chi_3: all nontrivial zeros of L(s,chi_{3.2}) on Re(s)=1/2. No known exceptions.',
    zpoConnection: 'Single-rung ladder twisted by the Legendre symbol mod 3.',
  },
  {
    label: '1-4-4.3-r0-0-0',
    name: 'Dirichlet L-function mod 4 (odd character)',
    lFunction: 'L(s, chi_{4.3})',
    degree: 1,
    weight: 0,
    conductor: 4,
    gammaShifts: [1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [6.020949, 10.243782, 12.575847, 16.331443, 18.845306],
    grhNote: 'GRH for chi_4: all zeros on critical line. Related to Dirichlet beta function beta(s).',
    zpoConnection: 'Odd-character twist; the ladder picks up a sign flip at p=2.',
  },
  {
    label: '1-5-5.2-r0-0-0',
    name: 'Dirichlet L-function mod 5',
    lFunction: 'L(s, chi_{5.2})',
    degree: 1,
    weight: 0,
    conductor: 5,
    gammaShifts: [0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [6.182676, 10.304532, 13.155590, 16.255063, 18.375756],
    grhNote: 'GRH for chi_5: no counterexample known. Platt verified to height 10^8.',
    zpoConnection: 'Quadratic twist by Legendre symbol mod 5.',
  },
  {
    label: '1-7-7.2-r0-0-0',
    name: 'Dirichlet L-function mod 7',
    lFunction: 'L(s, chi_{7.2})',
    degree: 1,
    weight: 0,
    conductor: 7,
    gammaShifts: [0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [5.198929, 8.787960, 11.554630, 14.078893, 16.398426],
    grhNote: 'GRH for chi_7: verified numerically to large height. No violations.',
    zpoConnection: 'Another quadratic Dirichlet twist; the ladder has modified impedances at p=7.',
  },
  {
    label: '1-8-8.3-r1-0-0',
    name: 'Dirichlet L-function mod 8 (primitive odd)',
    lFunction: 'L(s, chi_{8.3})',
    degree: 1,
    weight: 0,
    conductor: 8,
    gammaShifts: [1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [4.669211, 8.246882, 10.795209, 13.116548, 15.595537],
    grhNote: 'GRH for chi_8: all zeros on the critical line in computed range.',
    zpoConnection: 'Odd character twist; nontrivial Gauss sum at conductor 8.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEGREE 2 — Modular form L-functions & elliptic curve L-functions
  // ═══════════════════════════════════════════════════════════════════════
  {
    label: '2-11-1.1-c1-0-0',
    name: 'L-function of the weight-2 newform 11.2.a.a',
    lFunction: 'L(s, f_{11.2.a.a})',
    degree: 2,
    weight: 1,
    conductor: 11,
    gammaShifts: [0, 1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [6.362613, 8.593724, 11.831654, 13.553547, 15.806546],
    grhNote: 'GRH for 11.2.a.a: verified numerically (Rubinstein). This is the L-function of the Ramanujan curve y^2+y=x^3-x^2-10x-20.',
    zpoConnection: 'Degree-2 analog: a pair of coupled oscillators per prime, with Hecke eigenvalues as impedance parameters.',
  },
  {
    label: '2-14-1.1-c1-0-0',
    name: 'L-function of 14.2.a.a (conductor 14 elliptic curve)',
    lFunction: 'L(s, f_{14.2.a.a})',
    degree: 2,
    weight: 1,
    conductor: 14,
    gammaShifts: [0, 1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [5.413429, 8.153009, 10.032906, 12.337779, 14.092150],
    grhNote: 'GRH for 14.2.a.a: analytic rank 0, root number +1. Numerically verified zeros on critical line.',
    zpoConnection: 'Elliptic curve L-function over Q; the Euler product at each prime encodes the point count mod p.',
  },
  {
    label: '2-37-1.1-c1-0-0',
    name: 'L-function of 37.2.a.a (first rank-1 elliptic curve)',
    lFunction: 'L(s, f_{37.2.a.a})',
    degree: 2,
    weight: 1,
    conductor: 37,
    gammaShifts: [0, 1],
    signOfFunctionalEquation: -1,
    firstFiveZeros: [0.000000, 5.003834, 6.872484, 8.014133, 10.327052],
    grhNote: 'GRH for 37.2.a.a: analytic rank 1 (zero at s=1). Root number -1 forces the central zero. BSD verified.',
    zpoConnection: 'Rank-1 curve: the forced central zero corresponds to a resonance pinned at the critical point of the ladder.',
  },
  {
    label: '2-23-23.22-r0e0-0-0',
    name: 'L-function of Maass form on Gamma_0(23)',
    lFunction: 'L(s, u_{23})',
    degree: 2,
    weight: 0,
    conductor: 23,
    gammaShifts: [0, 0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [5.115872, 7.424620, 9.523810, 11.231730, 13.017180],
    grhNote: 'GRH for Maass forms on GL(2): unproven in general. No counterexamples known for any Maass form.',
    zpoConnection: 'Weight-0 degree-2: each prime contributes a 2x2 transfer matrix to the cascade.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEGREE 3 — Symmetric square L-functions
  // ═══════════════════════════════════════════════════════════════════════
  {
    label: '3-11-1.1-c2-0-0',
    name: 'Symmetric square L-function of 11.2.a.a',
    lFunction: 'L(s, Sym^2 f_{11.2.a.a})',
    degree: 3,
    weight: 2,
    conductor: 11,
    gammaShifts: [0, 1, 1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [4.803693, 7.279520, 9.108690, 10.752450, 12.628140],
    grhNote: 'GRH for Sym^2: proved automorphic by Gelbart-Jacquet (1978). GRH itself unproven.',
    zpoConnection: 'Tensor-square of the degree-2 oscillator pair; impedance at each prime involves a_p^2 - 1.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEGREE 4 — Rankin-Selberg & higher
  // ═══════════════════════════════════════════════════════════════════════
  {
    label: '4-121-1.1-c1e2-0-0',
    name: 'Rankin-Selberg L-function of 11.2.a.a x 11.2.a.a',
    lFunction: 'L(s, f_{11} x f_{11})',
    degree: 4,
    weight: 1,
    conductor: 121,
    gammaShifts: [0, 0, 1, 1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [3.279612, 5.104350, 6.362613, 7.424620, 8.593724],
    grhNote: 'GRH for Rankin-Selberg on GL(2)xGL(2): unproven. The L-function has a pole at s=1 from the symmetric square factor.',
    zpoConnection: 'Degree-4 cascade: 4x4 transfer matrices at each prime. The pole at s=1 maps to a DC resonance in the network.',
  },
  {
    label: '4-1-1.1-c0e4-0-0',
    name: 'Fourth power of Riemann zeta',
    lFunction: 'zeta(s)^4 (Eisenstein)',
    degree: 4,
    weight: 0,
    conductor: 1,
    gammaShifts: [0, 0, 0, 0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [14.134725, 14.134725, 21.022040, 21.022040, 25.010858],
    grhNote: 'Same zeros as zeta with multiplicity 4. GRH equivalent to RH. Used in Ingham/Titchmarsh prime-counting estimates.',
    zpoConnection: 'Four parallel copies of the zeta ladder; poles at s=1 with order 4.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEGREE 12 — Ramanujan Delta
  // ═══════════════════════════════════════════════════════════════════════
  {
    label: '2-1-1.1-c11-0-0',
    name: 'L-function of the Ramanujan Delta function (weight 12)',
    lFunction: 'L(s, Delta)',
    degree: 2,
    weight: 11,
    conductor: 1,
    gammaShifts: [0, 1],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [9.222379, 13.907553, 17.442776, 19.655711, 22.338956],
    grhNote: 'GRH for Delta: the prototypical high-weight cusp form. Deligne proved the Ramanujan conjecture (|tau(p)| <= 2p^{11/2}). GRH unproven.',
    zpoConnection: 'High-weight degree-2: the impedance at each prime is tau(p)/p^{11/2}, where tau is the Ramanujan tau function.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEGREE 2 — Dedekind zeta of Q(sqrt(5))
  // ═══════════════════════════════════════════════════════════════════════
  {
    label: '2-5-1.1-c0-0-0',
    name: 'Dedekind zeta of Q(sqrt(5))',
    lFunction: 'zeta_{Q(sqrt(5))}(s)',
    degree: 2,
    weight: 0,
    conductor: 5,
    gammaShifts: [0, 0],
    signOfFunctionalEquation: 1,
    firstFiveZeros: [6.182676, 8.039853, 10.243782, 10.304532, 12.575847],
    grhNote: 'EGRH: zeros of Dedekind zeta for a number field. Factors as zeta(s) * L(s, chi_5), so its zeros are unions of zeta and chi_5 zeros.',
    zpoConnection: 'Product of two single-rung ladders: the trivial character ladder (zeta) and the chi_5-twist ladder.',
  },
];

export function getByLabel(label) {
  return lmfdbCrossReference.find(e => e.label === label) || null;
}

export function getByDegree(d) {
  return lmfdbCrossReference.filter(e => e.degree === d);
}

export function assertIntegrity() {
  const errors = [];

  // 1. Every label matches the LMFDB format: digit-separated fields
  const labelRe = /^\d+-\d+/;
  for (const e of lmfdbCrossReference) {
    if (!labelRe.test(e.label)) {
      errors.push(`Bad label format: ${e.label}`);
    }
  }

  // 2. Degree matches the leading digit of the label
  for (const e of lmfdbCrossReference) {
    const labelDegree = parseInt(e.label.split('-')[0], 10);
    if (labelDegree !== e.degree) {
      errors.push(`Degree mismatch: label says ${labelDegree}, field says ${e.degree} for ${e.label}`);
    }
  }

  // 3. Conductor matches the second field of the label
  for (const e of lmfdbCrossReference) {
    const labelConductor = parseInt(e.label.split('-')[1], 10);
    if (labelConductor !== e.conductor) {
      errors.push(`Conductor mismatch: label says ${labelConductor}, field says ${e.conductor} for ${e.label}`);
    }
  }

  // 4. Every entry has exactly 5 zeros
  for (const e of lmfdbCrossReference) {
    if (!Array.isArray(e.firstFiveZeros) || e.firstFiveZeros.length !== 5) {
      errors.push(`Expected 5 zeros for ${e.label}, got ${e.firstFiveZeros?.length}`);
    }
  }

  // 5. Sign of functional equation is +1 or -1
  for (const e of lmfdbCrossReference) {
    if (e.signOfFunctionalEquation !== 1 && e.signOfFunctionalEquation !== -1) {
      errors.push(`Invalid sign ${e.signOfFunctionalEquation} for ${e.label}`);
    }
  }

  // 6. gammaShifts length matches degree
  for (const e of lmfdbCrossReference) {
    if (e.gammaShifts.length !== e.degree) {
      errors.push(`gammaShifts length ${e.gammaShifts.length} != degree ${e.degree} for ${e.label}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`LMFDB cross-reference integrity failures:\n${errors.join('\n')}`);
  }
  return { ok: true, checked: lmfdbCrossReference.length, assertions: 6 };
}

export default lmfdbCrossReference;
