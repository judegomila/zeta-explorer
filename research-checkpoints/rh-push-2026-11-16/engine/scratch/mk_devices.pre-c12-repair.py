#!/usr/bin/env python3
"""Writes curated/devices.json: the curated list of crossing devices (requirement R4) read by build_graph.py and
generate.py. It replaces the keyword role 'crossing' (CROSSING_RE). Written by lane c5-repair-engine-map-r4; edited by c7-repair-engine-map-r6
(map-open-9 closed for pointwise outputs, map-open-1 narrowed, three round-7 device nodes of nodes/nodes-17.json); edited by c8-repair-engine-map-r7
(three open devices of round 8: (E-K), (E-H), single-row bridge; nodes/nodes-18.json); edited by the round-8 learn step (single-row-bridge closed; evidence of (E-K), (E-H), function-field vertex updated).
Edited by c9-repair-referee-debts-r8: device hecke-correspondence-recurrence (closed; nodes/nodes-19.json); landau-siegel-mechanism floored -> closed for the height aspect.

States.
  closed   a map row or a refereed lane shows that the device returns its input, restates the target, or holds for a
           control. A candidate containing a closed device node is rejected.
  floored  the device yields a proved statement about zeros with a floor above Re s = 1/2 fixed by the method.
  open     no row or lane closes it; includes devices under test in a lane that has not reported.
'targetForms' are statements equivalent to RH or final-step lemmas (Landau type). They are not devices of any state.
'pending' are device proposals of running lanes that have no node yet; the learn step moves them into 'devices'.
Edited by the strategy review after round 10 (STRATEGY v3): effective-order-two and function-field-order2-vertex open -> closed; three pending read-set proposals RS-1..RS-3.
Edited by c11-repair-del-referee-record (round 11): three open device types for the round-11 explore lanes (twist-modulus-reciprocity, regular-rep-matrix-bridge, de-branges-positivity-family; nodes/nodes-20.json); pending proposals RS-1, RS-3 carry the lane names. Previous file: scratch/mk_devices.pre-c11-repair.py.
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
 ('hecke-correspondence-recurrence', 'closed', 'Joint Hecke recurrence (finite correspondences at all primes) with entropy / measure rigidity on Eisenstein resonance states',
  'c8-hecke-entropy-resonance-rigidity (round 8; first referee holds after withdrawal of Lemma G2 (i); second referee c9-repair-referee-debts-r8 holds the corrected '
  'statement): control EIS-w (off-resonance Eisenstein series; curated/controls.json) satisfies every input the device reads; recurrence bound has P-exponent -1 '
  'for every sigma (m counted with Gamma-multiplicity); limit measures m_sigma are A-conformal, not A-invariant. DH row withdrawn (not run)',
  ['hecke-correspondence-recurrence']),
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
 ('effective-order-two', 'closed', 'Effective order 2 in the 7/8 architecture (h = r/2): closed as an attack lead after round 10',
  'map section 6 item 1; narrowed after round 6 (lesson 1) to derivation items. Closed parts: re-expression of the same probe '
  '(Lemma U, two referees; row Z15b); abelian families (row Z22; abstract-family statement ARGUED); double covers through local data '
  '(row Z23, claim narrowed by its referee); probes of higher degree in the target (row Z15c); long marks at h = 3 as an input weaker '
  'than GRH (row Z26); the sextic probe as a route below abscissa 2/3 (normaliser H_eta, row Z24, two referees). Left open: (a) the '
  'uncompensated high side derived from manuscript (12.5)/(16.1) with the normaliser kept; (b) the compensated principal signal below '
  'Re s = 3/5; (c) whether any model vertex with 1 < h <= 3 exists. Requirement added: the normaliser of the probe has no zeros in Re s > 1/2. '
  'State set to closed by the strategy review after round 10 (STRATEGY v3, section 3.1 item 22): items (a) to (c) were derived in rounds 7 to 10 and each '
  'ends at an input of zero-free type for the twist family of the target or fails in the F_q[T] model ((E-K) row Z30, (E-H) row Z31, normaliser ladder rows '
  'Z24, Z24b, Hilbert-Schmidt cap, completed rows at (6, 9, 2)). Several closures are measured or argued, not theorems. Reopen only with one of: a relation '
  'among the reciprocals 1/L across rows that is not a norm bound; a method keeping the signs of the dual sum in the window Z/P < X < ZP; a probe whose '
  'normaliser has no zeros in Re s > 1/2; global Whittaker constants of a genuine cusp form on the double cover of GL(3)',
  ['map-open-1']),
 ('laurent-shell-gamma-section', 'closed', 'Sections of the prime chain on a Reinhardt (Laurent) shell around the critical torus, gamma one-port included',
  'lane c7-laurent-shell-gamma-section (round 7, one referee): the first-moment bracket has no forced sign for zeta or for DH on the shell or with '
  'the gamma term; every statement holds for DH; the limit step is void in measure form and is the height-coupled reserve inequality of '
  'g-passive-cascade in formula form. Map rows under Q12/Q22 owed. Not covered: a section with P(t) growing like a power of t', ['laurent-shell-gamma-section']),
 ('function-field-order2-vertex', 'closed', 'Prop. 2.1 probe with signal constant h > 1 in F_q[T] (region lx < l), where the Riemann hypothesis is a theorem',
  'lane c7-ff-order2-vertex-exact (round 7, one referee; q = 7, 13, N <= 4): base probe at lx < l re-expresses blocks with h < 1; the '
  'uncompensated marked probe has h > 1 where RH holds, but its low input (diagonal-level row bound) contains the squared signal and fails for '
  'the Moebius-twisted weight. Round 8 (c8-ek-ff-reflected-rows-exact, one referee): compensated probe (12.5) computed at dual length 0: h > 1 survives, the '
  'rescaled term is about q^(-lam) of the marked signal, the low input is unchanged. Left open: reflected completed rows; threshold test undecided at N <= 4. '
  'Constraint from row Z24: the normaliser must have no zeros in Re s > 1/2. '
  'State set to closed as a crossing device by the strategy review after round 10 (STRATEGY v3, section 3.1 item 23): c9-mv6-ff-window-exact (exact, '
  'pre-registered: the diagonal-level row bound fails in active classes at N = 2 above dual length 3N), c10-ff-completed-rows-692 (run (6, 9, 2), q = 7: '
  'completed energy 1.69 to 5.9 times the diagonal; the completed-row law fails with exact inputs; one configuration, no exponent), '
  'c10-ff-slot-cross-decomposition (the excess is a cross term over pairs of marked primes and is not target-specific: random multiplicative signs are not '
  'separated, 50 of 51), c10-ff-signal-intersection-square (the squared signal is an intersection square for an algebraic reason in genus 1 and holds for '
  'fakes with off-line zeros). One referee each. Kept as a bounded model question with no requirement flag: whether the non-principal half of the cube term '
  'is bounded once the principal signal is removed; genus >= 2 targets. Reopen as a device only with a low input that does not contain the squared signal', ['ff-order2-vertex-probe']),
 ('vector-specific-row-mean-square', 'closed', '(E-K): mean square of reflected marked theta rows for the probe vector itself, dual longer than the row set',
  'named by c7-probe-format-h-cap (one referee; second referee of Theorem K and Lemma A in push/c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md). '
  'Not an operator-norm statement: every blockwise l2-l2 estimate of the reflected rows is at or above the K-branch (Hilbert-Schmidt). Under test in round 8 '
  '(c8-ek-ff-reflected-rows-exact, c8-ek-theta-second-moment-formula). Model value with the polar term kept: 31/36, no vertex with h > 1 (first referee E2); '
  'form of the hypothesis corrected by first referee E3. Ceiling 2/3 from row Z24. Round 8 (state kept open, narrowed; one referee each): '
  'c8-ek-theta-second-moment-formula: the row mean square equals X D + X Sum_k F_k exactly, F_k bilinear in Moebius sums over the order-6 twist family of the '
  'target, so (E-K) is a mean value of 1/L over a family containing the target (zero-free type; holds for X >= ZP under GRH for the family, outline only); '
  'c8-ek-ff-reflected-rows-exact: in F_q[T] row energy = diagonal + squared signal, targets not separated from random vectors (reflected completed rows not run). '
  'Left open after round 8: the window Z/P < X < ZP. Round 9 (planner edit, round 10; c9-mv6-window-statement, c9-mv6-ff-window-exact, one referee each; '
  'evidence text corrected against the two referee files by c10-repair-record-referee-r9): closed for two named absolute-value techniques (family GRH pointwise; '
  'the second-moment step of c8-liou-row-bound-theorem): the 1/L form with more dual frequencies than columns has its own diagonal and both techniques return '
  'N^(1+eps); this is ARGUED + MEASURED, no lower bound is proved for the Moebius vector, and a method that keeps the signs of the dual sum or works on the row '
  'side is not excluded (referee E1). In F_q[T] at N = 2 (exact integers, rule pre-registered: FAILS) the probe vectors of quadratic Weil targets have row energy '
  '1.19 to 20.6 (q = 7) and 2.17 to 18.1 (q = 13) times the diagonal in active classes with sharp degree classes, rising in steps (two at q = 7, one at q = 13), '
  'not a fitted exponent; in inactive classes they are below the diagonal; a bound restricted to inactive classes or with weights removing the sixth-power '
  'frequencies is not tested; reflected dual sums not built; N = 3 undecided (referee E1 to E6). Model excess and the Z[omega] screen (ratio at most 1.007) not '
  'reconciled. Map row Z30. Outstanding bounded check: completed rows, run (6, 9, 2) at q = 7', ['ek-vector-specific-row-mean-square']),
 ('nonprincipal-row-cancellation', 'closed', '(E-H): cancellation over non-principal rows below the floor-class high bound',
  'named by c7-probe-format-h-cap; values corrected by its referee (E1: 4/5 with G = 0, 13/15 with the polar term kept, 1 - 2/r only in the three-input model). '
  'Round 8, c8-eh-nonprincipal-row-cancellation (state kept open: the referee does not hold the circularity headline): NP = I - I_1 exactly, so a bound on NP '
  'is necessary and sufficient for the conclusion given the low estimate (necessity, not circularity); termwise and norm treatments closed in the model '
  '(13/15; 31/36 with E-K); row cancellation in F_q[T] at r <= 4 is present for every weight, random non-multiplicative included. Left open: a target-specific '
  'treatment. Ceiling 2/3 from row Z24. Round 9 (planner edit, round 10; c9-eh-dual-r5-target-excess, one referee; evidence text corrected against the referee '
  'file by c10-repair-record-referee-r9): closed in the model as a source of a target-specific input: the non-principal row sum is a linear functional of the '
  'weight with target-independent kernel (proved); the pre-registered target excess over seeded random multiplicative and non-multiplicative classes is not '
  'detected at q = 7, r <= 5 (24 seeds per class at r = 5, resolution 0.05 to 0.07 in the exponent). Referee wording: not detected, not absent; power of the '
  'test unknown; an excess below 0.05 or setting in at r >= 6 is not excluded; linearity does not imply norm type, the measurement supports it; Lemma A in the '
  'model is a sketch for q -> infinity, its number-field sub-step is open. Not a theorem that no proof of (E-H) from the rows exists. Map row Z31', ['eh-nonprincipal-row-cancellation']),
 ('positive-term-sum-rule', 'closed', 'Sum rule with positive terms crossing from summable to square-summable coefficients (Szego-Verblunsky, Killip-Simon, Simon-Zlatos) on the prime stub chain',
  'lane c9-szego-sum-rule-prime-cascade (round 9, one referee holds, eight corrections of scope and wording): closed for five named forms, not for every sum '
  'rule (referee E5): Littlewood window functional (Jensen count), mean form (classical density identity), stage functionals continuous in the phases, the '
  'Simon-Zlatos type difference condition (a coefficient condition only; no theorem of that family is stated for a product over incommensurable delays), H^2 '
  'point evaluation (reaches Re s > sigma_0 + 1/2; Hedenmalm-Lindqvist-Seip). Controls U (torus rotation), THIN (difference condition holds for sigma > b/2 '
  'with a zero at b), Liouville twist, WT, FM pass every step; DH and HEAT fail only at chain formation; five controls not run. Not covered: a sum rule whose '
  'coefficient side vanishes identically with a semicontinuous limit step (that limit step is the R4 statement). Map row Q27', []),
 ('single-row-bridge', 'closed', 'Bridge (spinor square-root) form built from one completed probe row B_m',
  'closed by c8-single-row-bridge-crossing (round 8, one referee, holds with five wording corrections): a theta row is T = L0 D with L0 = L(3s - 1/2, psi); '
  'the row axis Re s = 1/2 is Re w = 1 for L0 (1/6 in s from its own axis), so the bridge of T is blind to zeros of L0; the bridge of D reads them as an '
  'identity with no sign; the target enters one row only as a coefficient twist. Kubota-Patterson normalisation in bridge language. Map row Q26',
  ['single-row-bridge']),
 ('landau-siegel-mechanism', 'closed', 'Mechanism of the 2026 Landau-Siegel claim (conductor-aspect family of real characters)',
  'lane c7-landau-siegel-device-read (round 7, one referee; Lean tree read as text, not compiled): interpolation determinant over a box in '
  'Z[sqrt d, sqrt 2] with Frobenius-congruence divisibility against the prime bias of a real zero. Floor: real zeros with 1 - beta <= c/log q '
  'only; empty to the left; no height-aspect form (n^(-it) is control U). THIN and the Liouville twist fail at S4/S5. The statement itself '
  'follows from the compiled Dirichlet 7/8 theorem. State set to closed FOR THE HEIGHT ASPECT by c9-repair-referee-debts-r8 (was floored): the engine target is a '
  'height-aspect statement, the lane (referee holds) found no height-aspect form and no crossing outside width c/log q, and the closed outcome record '
  'c7-landau-siegel-device-read already rejected every candidate containing the node (1,060). The conductor-aspect statement keeps its floor 1 - c/log q; '
  'reopen as floored only with a lane that names a conductor-to-height transfer', ['landau-siegel-2026-mechanism']),
 # ---- open (round 11 explore lanes; stage A = displayed inequality, marked steps, eleven-control table; state changes when the lane and its referee report)
 ('twist-modulus-reciprocity', 'open', 'Reciprocity of twisted second moments exchanging the twist variable with the modulus (Conrey, Young, Bettin; Bettin-Conrey cotangent-sum period relation), as the RS-1 device: functional equation of the target joined to periodicity in the modulus',
  'lane c11-rs1-twist-modulus-reciprocity (round 11). Lane report of 2026-11-19 (author check, no independent referee): stage A stops, T-NR, E_a with real a and the window translate pass every step; the functional equation of the target enters in zero conditions at height T. State kept open until the learn step has a referee file; expected state closed. Reason for the entry: STRATEGY v3 section 3.1 item 25 names '
  'a reciprocity acting on the Moebius variable l as the only reopening input of lead 4 (map row P52). First controls: E_a, T-NR, EIS-w, window translate. '
  'Existing partner nodes cotangent-reciprocity-period-function and bettin-conrey-intercept are measured phenomena and are not device nodes',
  ['twist-modulus-reciprocity']),
 ('regular-rep-matrix-bridge', 'open', 'Matrix Dirichlet series M_q(s) = sum_n R(n) n^-s over the regular representation of (Z/q)^*, entrywise non-negative, with matrix Euler product and Gauss-sum functional equation; bridge / Krein square for the matrix symbol (RS-1 with the bridge square)',
  'lane c11-rs1-regular-rep-matrix-bridge (round 11). Lane report of 2026-11-19 (REFEREE.md written by the lane itself, not independent; refereeHolds null): stage A stops, the bridge objects lie in the commutative group algebra and decompose over characters, E_a and T-NR matrix lifts keep entry positivity, Euler product, functional equation and periodicity. State kept open until the learn step has a referee file; expected state closed. Device type absent from the list before round 11 '
  '(no map row for matrix-valued or regular-representation objects). DH at q = 5 is a non-eigen linear functional of M_5. First controls: E_a, T-NR, EIS-w, window translate; '
  'bridge rows Q25, Q26 (family sums have gain 0; single rows have their axis at the edge of the Euler factor) are the closed neighbours',
  ['regular-rep-matrix-bridge']),
 ('de-branges-positivity-family', 'open', 'de Branges positivity condition for Euler products with the gamma factor, and the variants not covered by its known failure for zeta (twin-ladder shift, conductor family), as the RS-3 device',
  'lane c11-rs3-debranges-positivity-family (round 11). Lane report of 2026-11-19 (author check, no referee file): stage A stops; every variant examined is a restatement of a closed row (T3, G6) or is false for zeta at a named step (a phase-balance condition at every zero; fails at the first zero in the weight form, measured, not interval-certified). State kept open until the learn step has a referee file; expected state closed. The condition is reported to fail for zeta '
  '(Conrey-Li 2000; relative to that source, not on file). First controls: DH, E_a with real a, backward heat. The node de-branges-hamiltonian-xi is a target form, not a device',
  ['de-branges-positivity-family']),
]
TARGET_FORMS = dict(
 note='RH-equivalent statements and final-step lemmas found by the old keyword rule. Not devices.',
 nodes=['landau-one-sided-target', 'landau-transport-lemma-l', 'v7-floor-theorem-c', 'four-closure-routes', 'eventual-psd-is-global',
        'first-radix-layer-criterion', 'prime-tent-rh-equivalence', 'two-tents-joint-zero-completeness', 'zero-complete-rational-tents',
        'pascal-carry-ballot', 'prime-square-pole-recurrence', 'de-branges-hamiltonian-xi', 'zv-signed-shear-w',
        'toeplitz-krein-sigma2', 'fixed-support-weil-symbol'])
PENDING = [
 dict(name='Read set RS-1 (STRATEGY v3 section 4.0): functional equation used in the same inequality as periodicity of twists in the conductor aspect; screen: E_a, T-NR, EIS-w, window translate. Proposal; round-11 lanes c11-rs1-twist-modulus-reciprocity and c11-rs1-regular-rep-matrix-bridge (device types twist-modulus-reciprocity, regular-rep-matrix-bridge)', lane='c11-rs1-twist-modulus-reciprocity', state='open'),
 dict(name='Read set RS-2 (STRATEGY v3 section 4.0): an attached object (curve, sheaf, automorphic representation) whose positivity is not algebraic; screen: fakes with off-line zeros, EIS-w, genus-1 identity. Proposal; no lane in round 11 (central-value squares set aside by the planner: no condition at height t)', lane=None, state='open'),
 dict(name='Read set RS-3 (STRATEGY v3 section 4.0): positivity that uses the gamma side of zeta together with the Euler product in one step; screen: DH, E_a with real a, backward heat. Proposal; round-11 lane c11-rs3-debranges-positivity-family (device type de-branges-positivity-family)', lane='c11-rs3-debranges-positivity-family', state='open'),
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
