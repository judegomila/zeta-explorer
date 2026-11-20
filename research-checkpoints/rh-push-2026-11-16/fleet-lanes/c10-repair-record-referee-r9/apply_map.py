"""Map edits of lane c10-repair-record-referee-r9 (rows owed after campaign rounds 7, 8, 9).
Sources of the texts: campaign/MAP_PENDING.md Part 2 (C1-C4, D1-D6, E1-E3), push/c9-obstruction-record-statement/
MAP_ROWS_PROPOSED.md (Q26, Z30, Z31, EIS-w, G31, O1), lane proposals of round 9 (Z24b; the Z15d texts of
c9-eh-dual-r5-target-excess and c9-mv6-ff-window-exact), each with the corrections of its referee file.
Exact-string or anchored edits with assertions; previous file: before/OBSTRUCTION_MAP.md. Run once.
Working label Z15d of rounds 8 and 9 is entered as Z30 ((E-K)) and Z31 ((E-H)); Z24b keeps its label."""
import os, re, json
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
PEND = os.path.join(HERE, '..', '..', 'campaign', 'MAP_PENDING.md')
t = open(PATH, encoding='utf-8').read()
pend = open(PEND, encoding='utf-8').read()
n0 = t.count('\n')
edits = []
assert 'c10-repair-record-referee-r9' not in t, 'already applied'

def rep(old, new, name, count=1):
    global t
    assert t.count(old) == count, (name, t.count(old))
    t = t.replace(old, new)
    edits.append(name)

def check_rows(rows, ncell, name):
    for r in rows:
        assert r.startswith('| ') and r.endswith(' |') and r.count('|') == ncell + 1, (name, r[:40], r.count('|'))
        rid = r.split('|')[1].strip()
        if ncell == 6:
            assert re.match(r'^[A-Z]{1,2}\d{1,2}[a-z]?$', rid), rid
            assert not re.search(r'^\| %s \|' % re.escape(rid), t, re.M), ('duplicate row id', rid)

def after_row(rid, rows, name):
    global t
    m = re.search(r'^\| %s \|.*$' % re.escape(rid), t, re.M)
    assert m, rid
    check_rows(rows, 6, name)
    t = t[:m.end()] + '\n' + '\n'.join(rows) + t[m.end():]
    edits.append(name)

def row(rid, route, stops, status, defeated, src):
    for c in (route, stops, status, defeated, src):
        assert '|' not in c, rid
    return '| %s | %s | %s | %s | %s | %s |' % (rid, route, stops, status, defeated, src)

def pending_row(rid):
    """Row text exactly as written in MAP_PENDING Part 2 (blockquote line starting '> | rid |')."""
    m = re.search(r'^> (\| %s \|.*\|)\s*$' % re.escape(rid), pend, re.M)
    assert m, rid
    return m.group(1)

# ================================================================ section 3.3: Q23, Q24, Q25, Q26, Q27
Q23 = pending_row('Q23')
Q24 = pending_row('Q24')
Q25 = pending_row('Q25')
old = 'Not covered: a bridge formed from a single completed probe row B_m (lane `c8-single-row-bridge-crossing`, round 8).'
assert Q25.count(old) == 1
Q25 = Q25.replace(old, 'A bridge formed from a single completed probe row: row Q26.')
Q26 = row('Q26', 'Bridge (spinor square-root) form built from one completed probe row B_m of the 7/8 mechanism (left open by Q25)',
 'One theta row is T_m = L0 D with L0 = L(3s - 1/2, psi). The row\'s functional equation has its reflection axis at Re s = 1/2, which is Re w = 1 for the Euler factor L0; the critical line of L0 is Re s = 1/3, at distance 1/6. Gamma_-(T_m) is blind to zeros of L0 (classical non-vanishing on Re w >= 1), apart from the poles of T and the pole of L0 at w = 1 when psi is principal. Zeros of L0 are poles of D (measured, five zeros) and are read by Gamma_-(D) at every height as an identity; about Re w = 1/2 the form is H(T) - H(D), with no sign. The target enters as an L-function only after the sum over rows (row Q25: family sums, gain 0). With Q25 the bridge / 7/8 junction has no open member.',
 'PROVED (two-axis lemma, pole arithmetic; one referee, five corrections E1 to E5: "T is entire" does not hold for the measured row; "poles at every height" narrowed); MEASURED (five zeros)',
 'T-bridge passes DH, theta^w, HEAT; THIN fails by non-existence of the row; no control separated by a signed step',
 '`c8-single-row-bridge-crossing` (+ REFEREE.md)')
Q27 = row('Q27', 'Sum rule with positive terms on the prime stub chain, crossing from summable (Re s > 1) to square-summable (Re s > 1/2) coefficients: Szego-Verblunsky, Killip-Simon, Simon-Zlatos, H^2 point evaluation (five forms; engine device `positive-term-sum-rule`)',
 '(i) Littlewood window functional: int_W log abs(F_P) = Phi_P(T) - Phi_P(T+H) for every unimodular chain and every sigma > 0 (Lemma 1); the coefficient side is 0 at every stage and the bound-state term B_W is a tail invariant (Lemma 3). It is Jensen\'s zero count: zeta at sigma = 0.3 on [10, 20] gives 0.2 = 1/2 - 0.3; DH at sigma = 0.7 on [82, 89] gives 0.1085171825, its off-line zero. (ii) Mean form: E + 4 pi delta = log zeta(2 sigma) with three non-negative terms; this is M_log = 4 pi delta (Littlewood) rewritten, the classical density identity. (iii) Any stage functional continuous in the phases has the same distribution over heights for zeta and for every unimodular twist (Kronecker-Weyl; row Q21). (iv) Difference condition of Simon-Zlatos type on the coefficients in delay order: holds for zeta on Re s > 0 and for THIN on Re s > b/2 with its zero at b (Lemma 5). It is a coefficient condition only (no theorem of this family is stated for a product over incommensurable delays) and is compatible with a zero right of the line; for random U the sum is infinite almost surely for sigma <= 1/2 (three-series step added by the referee). (v) H^2 of the infinite torus: point evaluation at depth delta has norm zeta(2 delta)^(1/2), so the step reaches Re s > sigma_0 + 1/2 only (Hedenmalm-Lindqvist-Seip; restated, row Q10). A positive-term sum rule gives "no bound states" only if its coefficient side vanishes, and then its limit step is the target. Closed for these five forms, not for every sum rule. Not covered: a sum rule whose coefficient side vanishes identically with a limit step semicontinuous in the direction "bound states of the limit <= liminf of the stages" (that limit step is the R4 statement); the semicontinuity remark of Lemma 3 is conditional on weak convergence of the stage weights, not established for 1/2 < sigma <= 1.',
 'PROVED (Lemmas 1 to 6 re-derived by one referee, eight corrections of scope and wording; Lemma 6 CLASSICAL); numerics MEASURED (float); divergence for THIN at sigma <= b/2 ARGUED + MEASURED',
 'U, THIN, the Liouville twist, WT, FM pass every step; DH and HEAT fail only at chain formation (the Littlewood identity holds for DH and shows its zero); EA argued; Beurling, T-NR, the phase-rotated transfer operator, theta^w not run',
 '`c9-szego-sum-rule-prime-cascade` (+ REFEREE.md)')
after_row('Q22', [Q23, Q24, Q25, Q26, Q27], 'rows Q23, Q24, Q25 (MAP_PENDING C1, C2, C4 with the Q26 pointer), Q26 (single-row bridge), Q27 (positive-term sum rule)')
old = 'Not covered: sections holomorphic only on a Reinhardt shell around the tori; sections containing the gamma term; J-expansive sections (for these the stage statement is equivalent to RH by removal of Euler factors).'
rep(old, old + ' Both treated in round 7: rows Q23 (shell) and Q24 (gamma-coupled). Still not covered: P(t) growing like a power of t; J-expansive sections.',
    'row Q22: "Not covered" sentence appended (MAP_PENDING C3)')
old = 'Not covered (no lane): boundary nodes of R_a for a >= 1/2; sections on a Reinhardt shell; sections containing the gamma term.'
rep(old, old + ' The last two were treated in round 7: rows Q23 (shell) and Q24 (gamma-coupled).', 'second "Not covered" sentence (Reinhardt shell, gamma term) appended (MAP_PENDING C3)')

# ================================================================ section 3.2: G31 (Hecke recurrence), corrected statement
G31 = row('G31', 'Joint Hecke recurrence and measure rigidity on Eisenstein resonance states (residues at rho/2)',
 'Corrected statement (second referee). The device reads invariance under the modular group, the joint Hecke eigen-relation, the Laplace equation, growth and truncated mass of one function on the modular surface. At a resonance the truncated mass is Y^(2 sigma - 1)/(2 sigma - 1), free of gamma; the recurrence inequality holds with multiplicity counted in the group and has P-exponent -1 for every sigma; the limit measures m_sigma are N-invariant, A-conformal with factor e^(-(2 sigma - 1) s) and Hecke eigen-measures for every sigma > 1/2, not A-invariant, so the hypotheses of measure rigidity fail at sigma = 3/4 as at every other sigma; the horocycle-period form is Zagier\'s criterion and the Hecke action on nu_y is a function of the dilation (row G26). Under RH resonances sit at Re w = 3/4, off the unitary axis. Withdrawn from the first record: Lemma G2 (i) (the DH-type object on Gamma_1(5) is identically zero: the complex characters mod 5 are odd), Lemma 3 as first written (false with the lane\'s multiplicity; ratio 19.5 in one case), the sign in Lemma 5. Not proved: that m_sigma is the limit of abs(E(z, sigma + it))^2 dmu. Not covered: a device that reads phi(w) = 0 by a route other than truncated mass or horocycle periods.',
 'PROVED from CLASSICAL properties of the Eisenstein series (Proposition 4; two referee passes); the first record was not held, the corrected statement is held by the second referee; limit-measure statement ARGUED + MEASURED',
 'EIS-w passes every step; U, THIN, sign twists fail at automorphy (no structural step of the device); DH not run (no model in this setting)',
 '`c8-hecke-entropy-resonance-rigidity` (+ REFEREE.md); `c9-repair-referee-debts-r8/c8-hecke-entropy-resonance-rigidity/REFEREE2.md`')
after_row('G30', [G31], 'row G31 (Hecke recurrence device, corrected statement)')

# ================================================================ section 3.5: Z15 note, Z24 edits, Z24b, Z27..Z32
rep('5/6 under lx >= l (a modelling hypothesis) or M >= 2l with the polar term kept',
    '5/6 under lx >= l (a modelling hypothesis) or M >= 2l with the polar term kept (update, round 7: the hypothesis lx >= l is replaced by two inputs, the K-branch and the floor-class high bound, row Z27; the cap is then 1 - 1/r + lx/(2r) in every geometry, for every operator-norm low estimate)',
    'row Z15: round-7 update (MAP_PENDING D2)')
i0 = t.index('MS hypothesis (2.2) is false for every sigma_0 < 7/12'); i1 = t.index('fails at sigma_0 = 2/3 exactly (second referee).') + len('fails at sigma_0 = 2/3 exactly (second referee).')
assert 0 < i1 - i0 < 600
t = t[:i0] + ('MS hypothesis (2.2) (sup over Re s > sigma_0 of abs(H_eta - 1) <= 1/2) holds, for suitable S, if and only if sigma_0 > 2/3: for every sigma_0 <= 2/3 the half-plane contains Re s > 2/3, where sup abs(H_eta) is infinite for every finite S (Kronecker on the logs of rational primes; sum over split l of abs(c_l) l^{-sigma} is unbounded as sigma -> 1+, c_l = psi(p) + psi(pbar)). This uses no zero of L(w, psi_eta). The zeros of H_eta in 7/12 <= Re s < 2/3 matter for a different statement, the holomorphy of H_eta / L^S(s, eta) on Re s > B (Lemma S), whose binding abscissa lies in [7/12, 2/3]. The two statements are separate (referee of `c7-repair-engine-map-r6`, E1). Round 9: what the format uses of (2.2), and the ladder over levels, are in row Z24b.') + t[i1:]
edits.append('row Z24: (2.2) sentences replaced (MAP_PENDING D3)')
rep('re-derived from MS table (7.16) by a second referee', 'three referee passes, see the status cell', 'row Z24: Lemma H parenthesis')
rep('PROVED-rel MS Lemma 7.1 (two referees: REFEREE.md, REFEREE2.md); Hecke L-function facts CLASSICAL; MS Lemma 7.1 not re-derived from (7.10)',
    'PROVED-rel MS Lemma 7.1. Lemma H: three referee passes (sum of table (7.16); (7.11) against the table; series (7.10) with (7.8) and the lift formula, `c8-repair-engine-map-r7/c6-marks-bc-manuscript-check/REFEREE3.md`; the lane directory holds two of the files); the derivation of (7.8) from (7.1)-(7.7) read, not replayed; Hecke L-function facts CLASSICAL',
    'row Z24: status cell (MAP_PENDING D5)')
rep('not a control statement (uses complete multiplicativity and abs(eta(p)) = 1 only; holds for THIN and unimodular twists)',
    'not a control statement. Local identity only: the formula for H_p and its two factorisations use complete multiplicativity alone (third referee: re-derived from the series (7.10) with (7.8)), so they hold for the Liouville twist, THIN and unimodular twists; H_lambda(1) != 0. The global statements (continuation of L(w, psi_eta), zeros in 7/12 <= Re s < 2/3, symmetry about 7/12, Lemma S) need (alpha eta)^6 to be a Hecke character and are not available for a general unimodular completely multiplicative weight (E4)',
    'row Z24: control cell (MAP_PENDING D4)')
Z24b = row('Z24b', 'Normaliser cap with the family enlarged along the normaliser character (ladder over levels alpha^f chi)',
 'What MS Prop. 2.1 uses of (2.2): H_eta holomorphic on Re s > sigma_0, bounded on Re s >= 2, and ord_rho H_eta < ord_rho L at one zero within eps* of the supremum (Lemma U1; one direction of Lemma S of row Z24). So the format fails only by exact resonance at a zero, not by size. (2.2b) holds automatically if beta* > (3 + beta_1)/6 or if beta* < (4 - beta_1)/6; inside that strip nothing is known ("if", not "iff": referee E1). Ladder: G_f = {alpha^f chi}, f_0 = 0, f_{j+1} = 6 f_j + 6, with the format ASSUMED on levels 0..k-1 (hypotheses (F_j)): beta(0) <= max(sigma_0, 3/5 + (2/5) 6^-k) (Theorem A); over all levels the supremum B is <= sigma_0 or lies in [4/7, 3/5] (fixed points of 6b - 3 and of its reflection 4 - 6b). The value 3/5 is the limit of this argument, not a proved limit of the format: no configuration with B in the window is exhibited (E6). With the sourced level only (k = 1) the ceiling stays 2/3 (row Z24). (F_j) for j >= 1 concerns targets of infinite order and has NO SOURCE. Inside the window the needed input is a non-resonance statement (no top-layer zero rho with L(6 rho - 3, psi_eta) = 0), a common-zero statement; "not reachable by counting" is ARGUED. Second normaliser through eta^sigma: the two L-functions coincide iff eta^6 = (eta^sigma)^6, which holds for every chi with chi^6 = 1 (all cubic and sextic residue characters) and others, not only for eta = 1 and chi o N (E2); at levels j >= 1 it needs the format on the levels of frequency -f_j as well. The ladder does not reach 1/2.',
 'PROVED (Lemma U1); PROVED-rel Lemma H and (F_j) (Theorem A); one referee, six wording corrections; numerics MEASURED float (12 zeros of L(w, alpha^6) below height 30, count complete by the phase; no resonance at the image points tested)',
 'target-blind: the Liouville twist, sign twists and THIN have the same normaliser zeros (THIN: unconditional for b >= 2/3; for 1/2 < b < 2/3 conditional on no zero of the underlying L-functions right of b, E4). U: depends on the member; a typical member (independent uniform phases) has a zero-free normaliser on Re s > 7/12 (E3). No control fails at this step',
 '`c9-normaliser-cap-avoidance` (+ REFEREE.md)')
after_row('Z24', [Z24b], 'row Z24b (normaliser ladder, with referee corrections E1 to E6)')

Z27 = pending_row('Z27')
old = '(E-K): sum_m abs(B_m)^2 << Q^{1+eps} Z^{max(0, k_J, k_P)} for Q P > Z;'
assert Z27.count(old) == 1
Z27 = Z27.replace('cancellation over non-principal rows below H0 ((E-H)).', 'cancellation over non-principal rows below H0 ((E-H)) (rows Z30, Z31 for the state of (E-K) and (E-H) after rounds 8 and 9).')
assert 'rows Z30, Z31' in Z27
Z28 = pending_row('Z28')
old = 'For THIN the statement is conditional on conductor-uniform bounds (T1, T2).'
assert Z28.count(old) == 1
Z28 = Z28.replace(old, old + ' Round 8 (`c8-liou-row-bound-theorem`, Theorem A, one referee): Liouville rows N = D + P + Rem, P >= 0 of exact order M^(5/6) X^(1/3), abs(Rem) <= C X^(1+eps) relative to a fixed-twist form of Blomer-Goldmakher-Louvel Cor. 1.4; the Liouville analogue of MS (5.36) fails for 7m/8 < n < 5m/4; THIN conditional on a zero-free half-plane for twists of zeta_F.')
Z28 = Z28.replace('`c7-liou-high-row-bound` (+ REFEREE.md);', '`c7-liou-high-row-bound` (+ REFEREE.md); `c8-liou-row-bound-theorem` (+ REFEREE.md);')
Z29 = pending_row('Z29')
Z30 = row('Z30', '(E-K): mean square of the completed cubic-theta rows for the probe vector, dual longer than the row set (left open by Z27; working label Z15d of rounds 8 and 9)',
 'Round 8. Over Z[omega] (exact unfolding: Poisson in the row variable; theta coefficient times Gauss sum = Moebius times a ray character): Sum_m g_X(m) abs(B_m)^2 = X D + X Sum_{k != 0} F_k, F_k bilinear in smooth partial sums of 1/L(1 + u, eta theta chi_k^{-1}) over the order-6 twist family of the target. (E-K) is a mean value of 1/L over a family containing the target; it is not an operator-norm statement and not an independent input. Under GRH for the family it holds for X >= Z P (proof in outline). The excess form is positive semidefinite of rank 6 (two referee passes; not of signature (2,2)). The Dunn-Radziwill extremal vector is not the probe\'s configuration. In F_q[T] (q = 7, 13; squarefree unreflected marked rows; exact integers): row energy = diagonal + squared signal; energy / diagonal >= B_0 at dual length 0 (proved), so a diagonal-level row bound implies the Moebius bound of the weight; Weil targets sit at the diagonal in the bulk; failure for targets beyond h = 3 argued from 5 cases. Compensated probe (12.5): h > 1 survives, low input unchanged. Round 9, the window Z/P < X < Z P. Over Z[omega] (`c9-mv6-window-statement`): the displayed statement (MV6-W) is equivalent to (E-K) at each X (Lemma 0, a display of the round-8 Lemma 1 and Corollary 1). With more dual frequencies K than columns N the 1/L frequency form has its own diagonal of size (K/N) D (Proposition 1; this is the duality principle of the large sieve), and the two named absolute-value techniques (family GRH pointwise; the second-moment step of `c8-liou-row-bound-theorem`) return N^(1+eps). This is an obstruction for those two techniques, ARGUED + MEASURED; no lower bound is proved for the Moebius vector, and a method that keeps the signs of the dual sum or works on the row side is not excluded. Slot decomposition of the marked row (Lemmas S1, S2; checked to 1e-15); the upper half-window reduces to a named unproved signed cross term (CROSS). Float screen: theta ratio at most 1.007; aligned +7 to +40 percent and Liouville +2 to +22 percent from Z = 4000 (the slot changes with Z; values within 5 percent of 1 carry no information below Z = 4000). In F_q[T] (`c9-mv6-ff-window-exact`; exact integers, rule fixed before the runs): squarefree marked rows at N = 2 (equal to the completed rows by Lemma P, relative to the model definition), window N - lam < d < N + lam, rmax > 3N, sharp degree classes: the probe vector of a quadratic target of prime conductor has row energy 1.19 to 20.6 times the diagonal at q = 7 (nine active configurations, r* = 6 to 12) and 2.17 to 18.1 at q = 13 (three active configurations), rising in steps (two at q = 7, one at q = 13) and not monotone between steps; in inactive classes the same vectors are below the diagonal. The pre-registered rule returns FAILS. Not established: an exponent of growth; any statement for a bound restricted to inactive classes or with weights that remove the sixth-power frequencies; N = 3 (cube-term rule UNDECIDED on 4 configurations, completion formula untested for twisted vectors); reflected dual sums were not built ("dual length above 3N" is nominal). The model excess and the Z[omega] screen (no target excess) are not reconciled (lane `c10-ff-slot-cross-decomposition`); outstanding bounded check: completed rows (6, 9, 2) at q = 7 (lane `c10-ff-completed-rows-692`).',
 'Lemma 1 PROVED (one referee); Theorem 2 conditional, outline; F_q[T] identity EXACT, Bessel inequality PROVED (one referee, reduced form); window over Z[omega]: Lemma 0, Proposition 1, Lemmas S1, S2 PROVED (one referee), obstruction ARGUED + MEASURED; window in F_q[T]: EXACT integers, Lemma P PROVED, one referee (holds narrowed, corrections E1 to E9)',
 'The row energy does not separate target from control: random-phase, random-sign, multiplicative-sign and two-character vectors sit at the diagonal (mean over random phases = diagonal exactly, Lemma R); random column phases and the generic twist U satisfy the window statement at the diagonal. Liouville twist and aligned U exceed it (measured); mu and a sign twist exceed the diagonal by the coherent term in F_q[T]. DH has no row family. The structural control list was not run in the model lane',
 '`c8-ek-theta-second-moment-formula` (+ REFEREE.md; `c9-repair-referee-debts-r8/c8-ek-theta-second-moment-formula/REFEREE2.md`); `c8-ek-ff-reflected-rows-exact` (+ REFEREE.md); `c9-mv6-window-statement` (+ REFEREE.md); `c9-mv6-ff-window-exact` (+ REFEREE.md)')
Z31 = row('Z31', '(E-H): cancellation over the non-principal rows of the Prop. 2.1 probe beyond the trivial count (left open by Z27; working label Z15d of rounds 8 and 9)',
 'Round 8. NP = I - I_1 exactly (MS (10.5)). Given the low estimate, a bound on NP is necessary and sufficient for the conclusion of Prop. 2.1 at the corresponding abscissa. This is necessity, and it holds for every proved high-side input of the manuscript as well; it does not make (E-H) circular and does not close it (referee). Closed: the termwise treatment (model floor 13/15; (E-H) never binds with the source ledger) and the norm treatment (31/36 with (E-K); with the K-branch B >= 1 - 1/r + lx/r + l(1/2 - 1/r)). F_q[T], exact dual decomposition at r <= 4: cancellation over rows appears for every weight; it is a property of Poisson duality. Round 9 (wording of its referee). NP is a linear functional of the weight with a kernel that does not depend on the target (Lemma D; confirmed rowwise in 15 blocks); for independent random signs and for random completely multiplicative signs alike, E abs(NP(W))^2 = norm(K_NP)^2. F_q[T], q = 7, (k, N\') = (6, 6), r = 3, 4, 5 and (5, 5), r = 3, 4 (referee), exact: cancellation exponent of targets 0.26 to 0.46, of random multiplicative signs 0.34 to 0.45, of random non-multiplicative signs 0.37 to 0.42; the pre-registered excess of the targets over the two seeded control classes is not detected at r <= 5 (24 seeds per class at r = 5; resolution 0.05 to 0.07 in the exponent). "Not detected", not "absent": the power of the test against a true target mechanism is unknown, and an excess below about 0.05 or setting in at r >= 6 is not excluded. Linearity does not imply that the cancellation is of norm type; the measurement supports it (targets inside the range of random vectors). Lemma A (phase-blind low estimates have B >= 1): in the model a sketch for q -> infinity, measured at q = 7 only inside r < (k + N\')/2; the number-field sub-step (non-principal rows of the twisted target) is open. State: closed in the model as a source of a target-specific input (second obstruction of the same kind); not a theorem that no proof of (E-H) from the rows exists. Reopened only by a relation among the reciprocals 1/L(s, eta conj chi_u) across u that is not a norm bound.',
 'PROVED-rel MS (10.5) and Lemma S (identity); Lemma D PROVED (one referee); EXACT (model decomposition); MEASURED, pre-asymptotic (no target excess, r <= 5); LP on MODEL inputs; round-8 record not held as first worded (headline "the hypothesis is its conclusion" withdrawn); round-9 record held with wording corrections E1 to E6',
 'control-blind: cancellation present for THIN, Liouville, U, DH, random weights at r <= 4; seeded random multiplicative and non-multiplicative classes not separated from the targets at r <= 5',
 '`c8-eh-nonprincipal-row-cancellation` (+ REFEREE.md); `c9-eh-dual-r5-target-excess` (+ REFEREE.md)')
after_row('Z26', [Z27, Z28, Z29, Z30, Z31], 'rows Z27, Z28, Z29 (MAP_PENDING D1, D6, with the round-8 additions), Z30 ((E-K) with the window extension), Z31 ((E-H), round-9 referee wording)')
Z32 = row('Z32', 'TRO6 through the signed c-sum, stratified by the squarefull part of the row index (lead 17; inter-stratum cancellation left open by `e2-tro6-signed-csum-stratified`)',
 'Lemma I: each squarefull stratum B_kappa is a signed sum, signs mu(d) mu(e), of sublattice sums Phi(j) with j squarefull, at most 4^omega(j) terms; the net coefficient is 1 at j = 1 and 0 elsewhere (inclusion-exclusion). Proposition E, one direction: a power saving of abs(B) against the sum over kappa of abs(B_kappa) requires a squarefull j != 1, of norm up to Q, with N(j)^(1/2+eps) abs(Phi(j)) >= c Q^delta abs(Phi(1)); the converse is not proved. Both hold for arbitrary row values. So stratification by a divisibility label recombines sublattice copies of the total and has no saving of its own. Measured (finite trilinear estimator, class-cell mean square, X = 1e6 and 1e7, Q <= 37,150): the exponent in Q of the ratio signed sum / root sum of squares is -0.005 / +0.001 against the pre-registered threshold -0.02, equal within the null scatter 0.003 to random-phase, conjugated, Liouville, THIN, random multiplicative and cubic rows. Limits of the measurement (referee): the two halves of the estimator correlate at 0.14 / 0.23, so the statistic is not a measurement on the true theta coefficients; the squarefree energy share of 94 to 97 percent is the row-count share (93 percent) and carries no arithmetic information; x2 at 1e6 is -0.045 (se 0.034) and "no saving" for x2 rests on the 1e7 fit. Closed for squarefull stratification only. Not covered: the dual c-sum restricted to squarefree n; Type I on average over the level (lane `c10-tro6-dual-squarefree-type1-level`).',
 'PROVED (Lemma I; Proposition E in one direction; one referee, exact independent check at Q = 20,000 and 3,001, four corrections); MEASURED otherwise (r2 >= 0.72 from the measured arrays; the lane\'s "0.73, whatever the signs" is withdrawn)',
 'control-blind by construction: the two proved statements hold for arbitrary rows; the measured exponent is the same for theta rows and for six control row classes',
 '`c9-tro6-interstratum-cancellation` (+ REFEREE.md); `e2-tro6-signed-csum-stratified`')
after_row('Z31', [Z32], 'row Z32 (squarefull stratification, lead 17)')

# ================================================================ section 2: EIS-w
anchor = '- Interpolation twin (`c5-device-table-extension`, row D5):'
assert t.count(anchor) == 1
EIS = ('- EIS-w (`c8-hecke-entropy-resonance-rigidity`, Proposition 4; second pass in `c9-repair-referee-debts-r8`): the Eisenstein series E(z, w\') off resonance, Re w\' in (1/2, 1), Im w\' != 0. Has: the group, the functional equation, the Euler product, the Hecke algebra, moderate growth; passes every step of the Hecke-recurrence device (truncated mass, recurrence bound with P-exponent -1 for every sigma, A-conformal limit measures; row G31). WT is a case of it. Use: a device on the modular surface must name the step that fails for E(., w\') with phi(w\') != 0, that is, it must read phi(w) = 0. On that surface U, THIN and sign twists fail only by lack of automorphy. State: run in one lane; Proposition 4 held by two referee passes (classical properties of E); the DH-type control first proposed with it (Lemma G2 (i)) is withdrawn (identically zero). Engine code: EIS-w (`engine/curated/controls.json`).\n')
t = t.replace(anchor, EIS + anchor); edits.append('section 2: auxiliary control EIS-w')

# ================================================================ section 3.10: row O1 (Statement O)
O1 = row('O1', 'Statement O: twelve read classes, each with a control that satisfies the class and the mode of defeat (record of obstructions; not a statement about zeros; twelve separate conditional statements and one cited row, not a joint necessity)',
 'Each line has the form: a device whose whole read set lies inside class j is defeated by control C_j in the stated mode (zero, step, identity). Classes: size / positivity / support of Lambda (TW, THIN, E_a); FE + kernel positivity without Euler product (DH); Euler product + positivity + FE without size (E_a); flow-stable hypotheses (HEAT); Euler product + positivity + pole without FE or integers (Beurling; relative to literature not opened); invariance under a local test-vector change (T-NR); complete multiplicativity + unimodular parameters without periodicity (THIN; relative to a short-interval prime theorem); frequencies only (any Dirichlet polynomial on the same frequencies: no floor); special values only (interpolation twin); mean values only (cluster lifts; relative to H_W); exact identities; finite stages with a limit (U). The statement does not say what a device must read: a device that reads an input outside class j is not addressed by line j, and the sentence "a proof must read all of these in one step" is withdrawn (first referee, E1; with the map\'s input codes a read set such as {FE, SIZE} excludes all seven original controls without the Euler product). Lines 13 to 20 in outline form only. It does not say that no device exists. Not covered: section E of the statement.',
 'Label rule of the statement (PROVED = two referee files cover the closing step). After the second pass (`c10-repair-record-referee-r9/REFEREE2.md`): PROVED 4 (lines 3, 6, 8, 9: elementary constructions, in narrowed form); MEASURED 1 (line 2: zero step covered twice, membership by certified runs with one referee); ARGUED 7 (lines 1, 4, 5, 7, 10, 11, 12), each labelled "relative to" its source. Both passes are internal',
 'one control named per line; a line does not claim the other controls were run',
 '`c9-obstruction-record-statement/STATEMENT_O.md` (+ REFEREE.md); `c10-repair-record-referee-r9/REFEREE2.md`; outline `campaign/OBSTRUCTION_RECORD_OUTLINE.md`')
check_rows([O1], 6, 'O1')
sec = ('### 3.10 Record of obstructions (Statement O)\n\n'
       'One row for the record written at the round-8 checkpoint. It restates rows of this map by read class; it adds no mathematics.\n\n'
       '| # | Route (lane) | Where it stops | Status | Defeated by | Source |\n|---|---|---|---|---|---|\n' + O1 + '\n\n')
anchor = 'Row count (recounted 2026-11-18 by `c7-repair-engine-map-r6`)'
assert t.count(anchor) == 1
t = t.replace(anchor, sec + anchor); edits.append('section 3.10 with row O1')

# ================================================================ section 6 item 1; section 7
old = 'Left: derivation of the uncompensated high side from manuscript (12.5)/(16.1) with the normaliser kept; the compensated principal signal below Re s = 3/5; model vertices with 1 < h <= 3 (underived); global Whittaker constants of a genuine cusp form on the double cover of GL(3) (item 18). Any order-2 probe needs a normaliser without zeros in Re s > 1/2.'
new = ('Closed in round 7: h > 1 by uncompensated marks (the low input contains the squared signal; conditional on Lemma C, exact in F_q[T] at N <= 4); operator-norm estimates below 1 - 1/r (row Z27). Closed in round 8: the single-row bridge (Q26); (E-K) as an operator-norm or sieve statement, and row energy as a separator (Z30); (E-H) by termwise or norm bounds (Z31). Round 9: (E-K) in the window Z/P < X < Z P is closed for two named absolute-value techniques and its diagonal-level form fails in F_q[T] at N = 2 in the active classes (Z30; narrowed by the referees); (E-H) shows no target excess in the model at r <= 5 (Z31; measured, pre-asymptotic); the normaliser ladder stops in [4/7, 3/5] under hypotheses without source and at 2/3 with the sourced level (Z24b). State after round 9: effective order 2 is closed as an attack lead; bounded checks only (model excess against the Z[omega] screen; completed rows (6, 9, 2) at q = 7). Still untouched: global Whittaker constants of a genuine cusp form on the double cover of GL(3) (item 18). Any order-2 probe needs a normaliser without zeros in Re s > 1/2 (row Z24).')
rep(old, new, 'section 6 item 1: state after rounds 7 to 9 (MAP_PENDING E3, extended)')

def s7_append(prefix, extra, name):
    global t
    m = re.search(r'^\| %s.*\|$' % re.escape(prefix), t, re.M)
    assert m, prefix
    line = m.group(0); assert line.endswith(' |') and line.count('|') == 4, line.count('|')
    assert '|' not in extra
    t = t[:m.start()] + line[:-2] + ' ' + extra + ' |' + t[m.end():]
    edits.append(name)
s7_append('"No consistent model vertex with h > 1"; Lemma D(b)',
 'Attribution of Proposition E replaced (round 7): Proposition E placed the false input of the region lx < l on the uncompensated high side ((S) or H0\'), using Lemma D(a) with a bounded mark polynomial. `c7-uncompensated-high-side-normaliser` argues the opposite attribution: the marks carry the conjugate phase of eta(p) and the u = 1 multiplier is -1 + O(Q^{-7/8}) (MS (16.13)), so the mark polynomial has modulus P^{1/2} at sixth-power frequencies and the false input is the row-energy bound (K + D or K for coherent marked rows), which contains the squared signal. Both attributions are conditional: Proposition E was not held by its referee, and the replacement is ARGUED at the level of exponents. The measurement of c6-kd23 (no (KD)^{2/3} term) is not affected. Lemma C (round 8, `c8-row-energy-squared-signal`, three referee files): (C1) holds only relative to the unproved high half (HC) and beta* > 2/3; the coherent term is the Cauchy-Schwarz step of Proposition 2.1 solved for the row energy. Cite Lemma C only in that form or through the F_q[T] identity E = S + Rem, Rem >= 0.',
 'section 7: entry for c6-unreflected-marks-kd23 appended (MAP_PENDING E1 with the Lemma C sentence of MAP_ROWS_PROPOSED Part 1)')
S7 = [
 '| "(E-H) alone gives 1 - 2/r"; "(E-K) alone gives 7/9 at h = 4/3"; "the K-branch is forced for every operator-norm estimate"; "the false input is G = 0" | c7-probe-format-h-cap | First: only in the three-input system at a single row; with the source ledger 4/5 (G = 0) or 13/15 (polar kept). Second: that run has G = 0, which the same result argues is false; with the polar term kept the value is 31/36 at h = 5/6. Third: proved for l2-l2 bounds of the reflected matrix, whole or blockwise; vector-specific estimates are outside. Fourth: G = 0 is a false input there if (S) and k_dir hold; keeping the polar term suffices. |',
 '| Lemma 2, bullet "m holomorphic and inner: int F_P m = m((p^{-1/2})_p)" | c7-laurent-shell-gamma-section | The value is m(0); the stated value is int conj(F_P) m. Measured 0.9995 for m = w_2 against 1 (formula) and 1.7071 (bullet). |',
 '| "(E-H) is circular: the hypothesis is its conclusion" | c8-eh-nonprincipal-row-cancellation | Non sequitur: NP = I - I_1 gives necessity, which holds for every proved high-side input as well (row Z31). |',
 '| "The excess form of (E-K) is indefinite, of signature (2,2)" | c8-ek-theta-second-moment-formula | Positive semidefinite of rank 6 (first referee; second pass in `c9-repair-referee-debts-r8`; row Z30). |',
 '| Lemma G2 (i) (a DH-type control on Gamma_1(5)); Lemma 3 (recurrence inequality); sign in Lemma 5 | c8-hecke-entropy-resonance-rigidity | The object of G2 (i) is identically zero; Lemma 3 is false with the lane\'s multiplicity (ratio 19.5 in one case) and holds with multiplicity counted in the group; (a_s)_* m_sigma = e^(-(2 sigma - 1) s) m_sigma. The corrected statement holds (row G31). |',
 '| "A device that supplies R1, R3 and R4 together must read, in one step, at least the items below" (joint clause of Statement O, section C); "minimal input sets" sentence with the codes of A1 | c9-obstruction-record-statement | Section B supports separate conditional statements, one per read class; with the map\'s input codes {FE, SIZE} excludes the seven original controls without the Euler product. Clause withdrawn and the codes corrected (row O1). |',
 '| "(E-H) target excess ABSENT"; "linear functional, so the cancellation is norm type"; "Lemma A is settled in the model" | c9-eh-dual-r5-target-excess | Not detected at r <= 5, q = 7, resolution 0.05 to 0.07; linearity does not imply norm type (the measurement supports it); Lemma A is a sketch for q -> infinity, measured only inside its range (row Z31). |',
 '| "Row energy grows with a positive exponent"; "no true statement to prove in the range dual length > 3N" | c9-mv6-ff-window-exact | Two upward steps at q = 7 and one at q = 13, with a decrease between them; the failure is confined to active classes at N = 2 with sharp degree classes; reflected dual sums not built (row Z30). |',
 '| "Precise obstruction: the window statement is a cancellation of relative size X/N, not a mean value"; "PROVED-rel Theorem A" for marked rows | c9-mv6-window-statement | Obstruction for two named absolute-value techniques, ARGUED + MEASURED; Theorem A concerns unmarked class rows and the transfer to marked rows is by analogy and a float screen (row Z30). |',
 '| "(2.2b) holds automatically iff beta* > (3 + beta_1)/6"; "a second normaliser exists except for eta = 1 and chi o N"; "U has no continuation below 2/3"; "ceiling 2/3 becomes 3/5" | c9-normaliser-cap-avoidance | "If", and also for beta* < (4 - beta_1)/6; the criterion eta^6 = (eta^sigma)^6 holds for every chi with chi^6 = 1; a typical member of U has a zero-free normaliser on Re s > 7/12; 3/5 is the limit of the argument under hypotheses without source, 2/3 with the sourced level (row Z24b). |',
 '| "An inter-stratum saving exists iff the level-1 total is smaller than its bounded-level copies"; "r2 >= 0.73 whatever the signs"; squarefree energy share as evidence | c9-tro6-interstratum-cancellation | One direction only, with j of norm up to Q; 0.72, from the measured signed arrays; the share is the row-count share (row Z32). |',
 '| Lemma 3 semicontinuity remark; "diverges for random U at 1/2" (label); "Szego-type sum rules give no crossing device" (scope) | c9-szego-sum-rule-prime-cascade | Conditional on weak convergence of the stage weights; almost-sure divergence needs a three-series step (added by the referee); closed for five named forms, not for every sum rule (row Q27). |',
]
check_rows(S7, 3, 'section 7 rows')
assert t.rstrip().endswith('|')
t = t.rstrip('\n') + '\n' + '\n'.join(S7) + '\n'
edits.append('section 7: twelve rows for rounds 7 to 9 (two from MAP_PENDING E2)')

# ================================================================ header update line; row count
m = re.search(r'^Update 2026-11-18, fifth \(`c7-repair-engine-map-r6`\).*$', t, re.M); assert m
upd = ('\n\nUpdate 2026-11-19, sixth (`c10-repair-record-referee-r9`): rows owed from campaign rounds 7, 8 and 9. Added: Q23, Q24 (Reinhardt-shell and gamma-coupled sections), Q25 (family bridge), Q26 (single-row bridge), Q27 (positive-term sum rules), G31 (Hecke recurrence device, corrected statement), Z24b (normaliser ladder), Z27 (Hilbert-Schmidt cap), Z28 and Z29 (two uses of periodicity), Z30 ((E-K), with the window; working label Z15d), Z31 ((E-H), wording of the round-9 referee; working label Z15d), Z32 (squarefull stratification, lead 17), O1 (Statement O; new section 3.10), auxiliary control EIS-w (section 2). Edited: rows Z15, Z24, Q12, Q22; section 6 item 1; section 7 (one entry extended, twelve rows added). Each round-7 to round-9 lane has one referee unless the row says otherwise. Texts of `campaign/MAP_PENDING.md` Part 2 and `push/c9-obstruction-record-statement/MAP_ROWS_PROPOSED.md`, with the corrections of the round-9 referee files. The previous file is kept as `push/c10-repair-record-referee-r9/before/OBSTRUCTION_MAP.md`; script `push/c10-repair-record-referee-r9/apply_map.py`.')
t = t[:m.end()] + upd + t[m.end():]; edits.append('header update line "sixth"')
cnt = {}
for mm in re.finditer(r'^\| ([A-Z]{1,2})(\d{1,2})[a-z]? \|', t, re.M):
    cnt[mm.group(1)] = cnt.get(mm.group(1), 0) + 1
order = ['P', 'G', 'Q', 'S', 'Z', 'F', 'T', 'L', 'D', 'O']
assert set(cnt) == set(order), cnt
line = 'Row count (recounted 2026-11-19 by `c10-repair-record-referee-r9`): ' + ', '.join('%s %d' % (k, cnt[k]) for k in order) + ' = %d.' % sum(cnt.values())
m = re.search(r'^Row count \(recounted 2026-11-18 by `c7-repair-engine-map-r6`\).*$', t, re.M); assert m
old_counts = dict((a, int(b)) for a, b in re.findall(r'([A-Z]) (\d+)', m.group(0).split(':', 1)[1]))
t = t[:m.start()] + line + t[m.end():]; edits.append('row count line')
open(PATH, 'w', encoding='utf-8').write(t)
json.dump({'edits': edits, 'lines_before': n0, 'lines_after': t.count('\n'), 'row_counts_before': old_counts, 'row_counts_after': cnt},
          open(os.path.join(HERE, 'map_edits.json'), 'w'), indent=1)
print(len(edits), 'edits;', n0, '->', t.count('\n'), 'lines;', line)
print('before', old_counts)
