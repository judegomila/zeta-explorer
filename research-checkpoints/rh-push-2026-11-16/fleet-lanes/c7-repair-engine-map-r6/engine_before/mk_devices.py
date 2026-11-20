#!/usr/bin/env python3
"""Writes curated/devices.json: the curated list of crossing devices (requirement R4) read by build_graph.py and
generate.py. It replaces the keyword role 'crossing' (CROSSING_RE). Written by lane c5-repair-engine-map-r4.

States.
  closed   a map row or a refereed lane shows that the device returns its input, restates the target, or holds for a
           control. A candidate containing a closed device node is rejected.
  floored  the device yields a proved statement about zeros with a floor above Re s = 1/2 fixed by the method.
  open     no row or lane closes it; includes devices under test in a lane that has not reported.
'targetForms' are statements equivalent to RH or final-step lemmas (Landau type). They are not devices of any state.
'pending' are device proposals of running lanes that have no node yet; the learn step moves them into 'devices'.
Edit this file, then run it, then build_graph.py."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
D = [
 # ---- closed
 ('mean-value-convexity', 'closed', 'Convexity or mean values (lossy; MV-CAP)', 'map section 5 part 1; rows P14, P15, P29',
  ['kronecker-sup-rms-transfer', 'inverse-line-cotangent-mean-value', 'nyman-beurling-dx', 'route-m-quarter-ceiling']),
 ('exact-uniqueness', 'closed', 'Exact uniqueness (identifies the function, no inequality)', 'rows L2, P6',
  ['fe-plus-reality-rigidity', 'phase-retrieval-zeta']),
 ('residue-explicit-formula', 'closed', 'Residue theorem / explicit formula (exact, no sign)', 'rows P1, P8',
  ['pick-weil-native-span', 'offline-zero-visibility-law']),
 ('positive-kernel-transport', 'closed', 'Positive-kernel (Harnack) transport, positive-real ladder with Montel closure, phase transport',
  'direct attempts of 2026-11-01 (ROADMAP device table); rows P3, P7, G13, G17',
  ['harmonic-strip-transport', 'h5-euler-products-bounded', 'positive-real-ladder-step', 'klein-phase-transport-certificate']),
 ('maximum-principle', 'closed', 'Maximum principle / Phragmen-Lindelof for the Schur ratio (needs the zero-free statement as input)',
  'node statement (circular gap); rows P3, G20', ['schur-ratio-max-principle-gap']),
 ('dual-measure-compactness', 'closed', 'Compactness or cofinal limits of dual measures over the integers',
  'row P36 (e1-cofinal-legendre-dual); e2-cofinal-moebius-pointwise; e2-legendre-riesz-level-phase',
  ['cofinal-legendre-dual', 'cofinal-pointwise-mobius-sum', 'cofinal-mobius-sum-equals-x-m', 'map-open-16', 'map-open-17']),
 ('recurrence-ergodicity', 'closed', 'Recurrence / unique ergodicity plus density (one off-line zero forces many)',
  'row P39 (e1-sparse-recurrence-amplifier)', ['bagchi-strong-recurrence', 'tinfty-flow-generator-spectrum']),
 ('euler-fe-phase-at-height', 'closed', 'Euler phases coupled to the functional-equation phase at one height (torus sign tests, window rigidity, FE-symmetrised stage with Rouche or Hurwitz, stage collisions)',
  'rows P40, S12; c4-fe-stage-rouche-crossing; c4-stage-collision-law; c2-euler-cone-fe-rigidity',
  ['dbn-prime-torus-phase-closure', 'euler-fe-coupling-at-height', 'rouche-fe-symmetrised-euler-stage', 'collision-local-index']),
 ('selberg-operator', 'closed', 'Self-adjoint operator of Selberg type as control or companion', 'row G24 (e1-selberg-twist-control)',
  ['selberg-control-pair', 'selberg-zeta-companion', 'selberg-freeze-sandbox']),
 ('monotone-flow-functional', 'closed', 'Monotone flow functional (forward-only; anchor in the Euler region)',
  'rows F1, Q20, F8', ['discriminant-gradient-flow', 'resolvent-burgers-identity', 'heat-evolved-von-mangoldt-positivity',
                       'euler-anchor-heat-certificate', 'map-open-12']),
 ('geometric-positivity', 'closed', 'Geometric positivity (Neron-Tate heights, Hodge index, Heegner spans)', 'rows T3, P38',
  ['spec-z-squared-hodge-index', 'heegner-height-upper-bound-h4prime', 'heegner-nb-ratio']),
 ('stage-limit', 'closed', 'Limit of zero-free stages (Krein-index semicontinuity, Hurwitz, polydisc Lee-Yang bounds)',
  'rows Q19, Q21', ['map-open-19']),
 ('section-extraction', 'closed', 'Passive or J-contractive sections of the prime chain (single and several delays)',
  'rows Q12, Q22', ['map-open-7']),
 ('test-restriction-commutator', 'closed', 'Restriction of the Weil form to Hecke-primitive tests; Hecke commutators with shear or cutoff; window SDP; positive-definiteness of log F',
  'rows P35, G22, G25, S11, P29', ['map-open-6', 'map-open-11', 'map-open-20', 'map-open-10', 'map-open-8']),
 ('finite-support-positivity', 'closed', 'Finite-support or finite-order positivity (Suzuki screw, lacunary Pick, Schwarzian stage, cofinal scalar comparison, pulse leakage)',
  'rows P2, P3, P9, P10, P18, P21, P22',
  ['scalar-comparison-target', 'suzuki-reserve-update', 'suzuki-screw-response-psi', 'suzuki-spectral-convergence',
   'lac-eq-caratheodory-interpolation', 'fourth-stage-schwarzian', 'pulse-leakage-zero-target']),
 ('hecke-compression-lax-phillips', 'closed', 'Hecke operators compressed to the Lax-Phillips space',
  'c4-laxphillips-hecke-compression (refereed once)', ['hecke-compression-lax-phillips']),
 ('helson-discrepancy', 'closed', 'Power-saving discrepancy of a completely multiplicative unimodular function as a source of a zero-free region',
  'c4-helson-discrepancy-zerofree (Theorem 1, two referee checks); relative to zeta, passes Beurling', ['helson-discrepancy-rigidity']),
 ('twisted-discrepancy', 'closed', 'Discrepancy hypothesis for all additively twisted sums of chi, uniform in the modulus',
  'c5-twisted-helson-arcs (referee holds): strict form is an identification (chi = n^(-i alpha)); general form passed by THIN', ['map-open-21']),
 ('frequency-only', 'closed', 'Baker linear forms and finite Turan power sums (read the frequencies log n only)',
  'c5-device-table-extension (referee holds); every Dirichlet-series control passes', ['frequency-only-devices-coefficient-blind']),
 ('padic-special-values', 'closed', 'p-adic interpolation / Iwasawa data (read zeta at non-positive integers only)',
  'c5-device-table-extension; interpolation twin zeta + c L(chi_-4) L(chi_5) passes', ['padic-interpolation-reads-nonpositive-integers']),
 ('tensor-squeeze', 'closed', 'Tensor-power squeeze (bounds local parameters only)', 'c5-device-table-extension; every unimodular twist passes',
  ['tensor-squeeze-supplies-size-only']),
 ('strip-dtn-identity', 'closed', 'Strip Dirichlet-to-Neumann phase identity (holds for DH with a pole sum)', 'c5-device-table-extension',
  ['strip-dtn-phase-identity']),
 ('sum-product-vinogradov', 'closed', 'Additive-against-multiplicative pairing (Vinogradov-Korobov; crosses Re s = 1 by (log t)^(-2/3) only)',
  'c5-device-table-extension; closed by argument, not proof', ['additive-multiplicative-pairing-is-vinogradov']),
 # ---- floored
 ('coherent-set-large-sieve', 'floored', 'Coherent set with large sieve (7/8 type): the only mechanism meeting R1-R3',
  'rows Z15, Z16: floors 5/6 at r = 6; proved abscissa 7/8 (unrefereed manuscripts about 0.874887)',
  ['qrh-seven-eighths', 'seven-eighths-abscissa-formula', 'tro6-natural', 'map-pos-35', 'map-open-2', 'map-open-4']),
 # ---- open
 ('effective-order-two', 'open', 'Effective order 2 in the 7/8 architecture (h = r/2)',
  'map section 6 item 1. Narrowed in round 5: re-expression of the same probe closed (c5-target-fe-order2-ledger, Lemma U, referee holds); '
  'abelian families (angular, ring-class, anticyclotomic) closed (c5-angular-family-absorption, referee holds); long-marks branch closed inside '
  'r3 model only, referee does not hold as written (c5-marks-circularity-order2). Left open: a different probe with lx < l (reduced system '
  'inconsistent, false input not identified) and a nonabelian family with a weight-1 epsilon cocycle (double cover of GL(3), map 6.18)',
  ['map-open-1']),
 ('quadratic-positivity-companions', 'open', 'Quadratic positivity with automorphic companions (beyond linear 3-4-1)',
  'map section 6 item 9; not tested; mean-value outputs are densities (MV-CAP) unless the conclusion is pointwise', ['map-open-9']),
]
TARGET_FORMS = dict(
 note='RH-equivalent statements and final-step lemmas found by the old keyword rule. Not devices.',
 nodes=['landau-one-sided-target', 'landau-transport-lemma-l', 'v7-floor-theorem-c', 'four-closure-routes', 'eventual-psd-is-global',
        'first-radix-layer-criterion', 'prime-tent-rh-equivalence', 'two-tents-joint-zero-completeness', 'zero-complete-rational-tents',
        'pascal-carry-ballot', 'prime-square-pole-recurrence', 'de-branges-hamiltonian-xi', 'zv-signed-shear-w',
        'toeplitz-krein-sigma2', 'fixed-support-weil-symbol'])
PENDING = [
 dict(name='Carleson / corona criteria for the bridge symbol S (assume S bounded, which is RH)', lane='c5-device-table-extension', state='closed'),
 dict(name='Different probe with lx < l in the order-2 ledger (reduced system inconsistent; false input not identified)', lane='c5-target-fe-order2-ledger', state='open'),
 dict(name='Nonabelian family with a nontrivial weight-1 epsilon cocycle at effective order 2 (double cover of GL(3), map 6.18)', lane='c5-angular-family-absorption', state='open'),
 dict(name='Prime marks with l - lx = 2: closed inside r3 reduced system only; Theorems B, C not checked against the manuscript', lane='c5-marks-circularity-order2', state='open'),
 dict(name='Lax-Phillips Hecke norms outside the weighted-L2 family', lane=None, state='open'),
 dict(name='Non-locality step 4 of the Rouche lane', lane=None, state='open'),
]
out = dict(
    about='Curated list of crossing devices for requirement R4. Replaces the keyword role "crossing" of build_graph.py. '
          'Generated by curated/mk_devices.py; edit that file.',
    states=dict(closed='a map row or refereed lane shows the device returns its input, restates the target or holds for a control',
                floored='yields a proved statement about zeros with a floor above 1/2 fixed by the method',
                open='not closed by any row or lane; may be under test in a running lane'),
    devices=[dict(id=i, state=s, name=n, evidence=e, nodes=nodes) for i, s, n, e, nodes in D],
    targetForms=TARGET_FORMS, pending=PENDING)
json.dump(out, open(os.path.join(HERE, 'devices.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
seen = {}
for d in out['devices']:
    for n in d['nodes']:
        assert n not in seen, (n, seen[n], d['id'])
        seen[n] = d['id']
print('devices.json: %d device types (%s), %d nodes, %d target forms, %d pending' % (
    len(D), ', '.join('%s %d' % (s, sum(1 for d in D if d[1] == s)) for s in ('closed', 'floored', 'open')),
    len(seen), len(TARGET_FORMS['nodes']), len(PENDING)))
