#!/usr/bin/env python3
"""Writes curated/devices.json: the curated list of crossing devices (requirement R4) read by build_graph.py and
generate.py. It replaces the keyword role 'crossing' (CROSSING_RE). Written by lane c5-repair-engine-map-r4; edited by c7-repair-engine-map-r6
(map-open-9 closed for pointwise outputs, map-open-1 narrowed, three round-7 device nodes of nodes/nodes-17.json); edited by c8-repair-engine-map-r7
(three open devices of round 8: (E-K), (E-H), single-row bridge; nodes/nodes-18.json); edited by the round-8 learn step (single-row-bridge closed; evidence of (E-K), (E-H), function-field vertex updated).

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
 ('quadratic-positivity-companions', 'closed', 'Quadratic positivity with automorphic companions (degree-2 positive forms): closed for pointwise outputs',
  'row P50 (c6-quadratic-companion-positivity, referee holds): log-level squares lie in the P25 cone, products need admissible linear factors, '
  'coefficient squares are positive for every sequence and for DH and are twist-invariant, Landau on L(s, Pi x Pi~) reaches Re s = 1 only. '
  'Density (family) half not run and left open in the record; MV-CAP (device mean-value-convexity) applies to it, so it is not a pointwise device',
  ['map-open-9']),
 # ---- floored
 ('coherent-set-large-sieve', 'floored', 'Coherent set with large sieve (7/8 type): the only mechanism meeting R1-R3',
  'rows Z15, Z16: floors 5/6 at r = 6; proved abscissa 7/8 (unrefereed manuscripts about 0.874887)',
  ['qrh-seven-eighths', 'seven-eighths-abscissa-formula', 'tro6-natural', 'map-pos-35', 'map-open-2', 'map-open-4']),
 # ---- open
 ('effective-order-two', 'open', 'Effective order 2 in the 7/8 architecture (h = r/2): derivation items only',
  'map section 6 item 1; narrowed after round 6 (lesson 1) to derivation items. Closed parts: re-expression of the same probe '
  '(Lemma U, two referees; row Z15b); abelian families (row Z22; abstract-family statement ARGUED); double covers through local data '
  '(row Z23, claim narrowed by its referee); probes of higher degree in the target (row Z15c); long marks at h = 3 as an input weaker '
  'than GRH (row Z26); the sextic probe as a route below abscissa 2/3 (normaliser H_eta, row Z24, two referees). Left open: (a) the '
  'uncompensated high side derived from manuscript (12.5)/(16.1) with the normaliser kept; (b) the compensated principal signal below '
  'Re s = 3/5; (c) whether any model vertex with 1 < h <= 3 exists. Requirement added: the normaliser of the probe has no zeros in Re s > 1/2',
  ['map-open-1']),
 ('laurent-shell-gamma-section', 'closed', 'Sections of the prime chain on a Reinhardt (Laurent) shell around the critical torus, gamma one-port included',
  'lane c7-laurent-shell-gamma-section (round 7, one referee): the first-moment bracket has no forced sign for zeta or for DH on the shell or with '
  'the gamma term; every statement holds for DH; the limit step is void in measure form and is the height-coupled reserve inequality of '
  'g-passive-cascade in formula form. Map rows under Q12/Q22 owed. Not covered: a section with P(t) growing like a power of t', ['laurent-shell-gamma-section']),
 ('function-field-order2-vertex', 'open', 'Prop. 2.1 probe with signal constant h > 1 in F_q[T] (region lx < l), where the Riemann hypothesis is a theorem',
  'lane c7-ff-order2-vertex-exact (round 7, one referee; q = 7, 13, N <= 4): base probe at lx < l re-expresses blocks with h < 1; the '
  'uncompensated marked probe has h > 1 where RH holds, but its low input (diagonal-level row bound) contains the squared signal and fails for '
  'the Moebius-twisted weight. Round 8 (c8-ek-ff-reflected-rows-exact, one referee): compensated probe (12.5) computed at dual length 0: h > 1 survives, the '
  'rescaled term is about q^(-lam) of the marked signal, the low input is unchanged. Left open: reflected completed rows; threshold test undecided at N <= 4. '
  'Constraint from row Z24: the normaliser must have no zeros in Re s > 1/2', ['ff-order2-vertex-probe']),
 ('vector-specific-row-mean-square', 'open', '(E-K): mean square of reflected marked theta rows for the probe vector itself, dual longer than the row set',
  'named by c7-probe-format-h-cap (one referee; second referee of Theorem K and Lemma A in push/c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md). '
  'Not an operator-norm statement: every blockwise l2-l2 estimate of the reflected rows is at or above the K-branch (Hilbert-Schmidt). Under test in round 8 '
  '(c8-ek-ff-reflected-rows-exact, c8-ek-theta-second-moment-formula). Model value with the polar term kept: 31/36, no vertex with h > 1 (first referee E2); '
  'form of the hypothesis corrected by first referee E3. Ceiling 2/3 from row Z24. Round 8 (state kept open, narrowed; one referee each): '
  'c8-ek-theta-second-moment-formula: the row mean square equals X D + X Sum_k F_k exactly, F_k bilinear in Moebius sums over the order-6 twist family of the '
  'target, so (E-K) is a mean value of 1/L over a family containing the target (zero-free type; holds for X >= ZP under GRH for the family, outline only); '
  'c8-ek-ff-reflected-rows-exact: in F_q[T] row energy = diagonal + squared signal, targets not separated from random vectors (reflected completed rows not run). '
  'Left open: the window Z/P < X < ZP (31/36 vertex); the mean value (MV6) of 1/L over the order-6 family for the Moebius vector', ['ek-vector-specific-row-mean-square']),
 ('nonprincipal-row-cancellation', 'open', '(E-H): cancellation over non-principal rows below the floor-class high bound',
  'named by c7-probe-format-h-cap; values corrected by its referee (E1: 4/5 with G = 0, 13/15 with the polar term kept, 1 - 2/r only in the three-input model). '
  'Round 8, c8-eh-nonprincipal-row-cancellation (state kept open: the referee does not hold the circularity headline): NP = I - I_1 exactly, so a bound on NP '
  'is necessary and sufficient for the conclusion given the low estimate (necessity, not circularity); termwise and norm treatments closed in the model '
  '(13/15; 31/36 with E-K); row cancellation in F_q[T] at r <= 4 is present for every weight, random non-multiplicative included. Left open: a target-specific '
  'treatment. Ceiling 2/3 from row Z24', ['eh-nonprincipal-row-cancellation']),
 ('single-row-bridge', 'closed', 'Bridge (spinor square-root) form built from one completed probe row B_m',
  'closed by c8-single-row-bridge-crossing (round 8, one referee, holds with five wording corrections): a theta row is T = L0 D with L0 = L(3s - 1/2, psi); '
  'the row axis Re s = 1/2 is Re w = 1 for L0 (1/6 in s from its own axis), so the bridge of T is blind to zeros of L0; the bridge of D reads them as an '
  'identity with no sign; the target enters one row only as a coefficient twist. Kubota-Patterson normalisation in bridge language. Map row owed',
  ['single-row-bridge']),
 ('landau-siegel-mechanism', 'floored', 'Mechanism of the 2026 Landau-Siegel claim (conductor-aspect family of real characters)',
  'lane c7-landau-siegel-device-read (round 7, one referee; Lean tree read as text, not compiled): interpolation determinant over a box in '
  'Z[sqrt d, sqrt 2] with Frobenius-congruence divisibility against the prime bias of a real zero. Floor: real zeros with 1 - beta <= c/log q '
  'only; empty to the left; no height-aspect form (n^(-it) is control U). THIN and the Liouville twist fail at S4/S5. The statement itself '
  'follows from the compiled Dirichlet 7/8 theorem', ['landau-siegel-2026-mechanism']),
]
TARGET_FORMS = dict(
 note='RH-equivalent statements and final-step lemmas found by the old keyword rule. Not devices.',
 nodes=['landau-one-sided-target', 'landau-transport-lemma-l', 'v7-floor-theorem-c', 'four-closure-routes', 'eventual-psd-is-global',
        'first-radix-layer-criterion', 'prime-tent-rh-equivalence', 'two-tents-joint-zero-completeness', 'zero-complete-rational-tents',
        'pascal-carry-ballot', 'prime-square-pole-recurrence', 'de-branges-hamiltonian-xi', 'zv-signed-shear-w',
        'toeplitz-krein-sigma2', 'fixed-support-weil-symbol'])
PENDING = [
 dict(name='Density (family) quadratic forms with automorphic companions: not run; MV-CAP applies', lane='c6-quadratic-companion-positivity', state='open'),
 dict(name='Global Whittaker constants of a genuine cusp form on the double cover of GL(3) (map 6.18; local data closed by row Z23)', lane='c6-gl3-cover-epsilon-cocycle', state='open'),
 dict(name='Rank >= 2 compact-at-infinity squares without a Hecke rule (no R1)', lane='c6-square-intertwiner-weyl', state='open'),
 dict(name='Model vertices with 1 < h <= 3 in the order-2 ledger (underived)', lane='c6-unreflected-marks-kd23', state='open'),
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
