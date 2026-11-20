#!/usr/bin/env python3
"""Map edits of lane c20-repair-owed-record-r19-statement-o-v5 (owed list of campaign round 19).
Edits push/OBSTRUCTION_MAP.md in place; previous file: before/OBSTRUCTION_MAP.md. Every anchor must match exactly once.
Rows are worded after the REFEREE.md of each round-19 lane (one referee each) and after the second-referee files of
c19-referee-r18-independent-sources for the round-18 rows. No row is a statement about zeros of zeta.
DRY=1 in the environment: check anchors, write nothing."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.normpath(os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md'))
ME = 'c20-repair-owed-record-r19-statement-o-v5'
R7 = 'c19-referee-r18-independent-sources'
lines = open(P, encoding='utf-8').read().split('\n')
assert not any(ME in l for l in lines), 'already applied'
log = []
def line_of(prefix):
    idx = [k for k, l in enumerate(lines) if l.startswith(prefix)]
    assert len(idx) == 1, (prefix, len(idx))
    return idx[0]
def rep(prefix, a, b):
    k = line_of(prefix)
    assert lines[k].count(a) == 1, (prefix, a[:70], lines[k].count(a))
    lines[k] = lines[k].replace(a, b)
    log.append('edited ' + prefix.strip() + ': ' + a[:60])
def insert_after(prefix, text):
    k = line_of(prefix)
    lines.insert(k + 1, text)
    log.append('inserted after ' + prefix.strip() + ': ' + text[:50])
def row(*cells_):
    assert len(cells_) == 6
    for c in cells_:
        assert ' | ' not in c and '\n' not in c, c[:80]
    return '| ' + ' | '.join(cells_) + ' |'

# ============================================================ section 2: HQ2 (edited), HQ3, HQ4 (new)
rep('| HQ2 |', "no zero of the factor on the line. PROVED (elementary; re-derived by one referee;",
    "no zero of the factor on the line; exact form (second referee; sentence 18 of `campaign/CORRECTIONS_R18.md`): for every eps > 0 the zeros of the factor are at distance (2/log q) Re asinh((eps^(1/4)/2) e^(i pi/4)) from the line, inside the open strip when that distance is below 1/2. "
    "Round-19 addendum (`c19-hq2-screen-fe-int-mult-pos-devices`, one referee, every step re-derived): log-level positivity is also lacking: nu(q^k) = log q (1 + q^(k/2)(4 - S_k)), S_k the k-th power sum of the four roots of (1 - u)^4 + eps u^2, is signed for every eps > 0 "
    "(c_1 = 0, c_2 = 2 eps; first negative k = 13, 22, 38, 67, 212, 669 at q = 2 for eps = 1e-1, 1e-2, 1e-3, 1e-4, 1e-6, 1e-8, decided in exact rational arithmetic by the lane and by the referee); complete multiplicativity fails at q^2; "
    "the on-line zeros are exactly zeta's (on the line the factor is 1 + eps/(16 sin^4(t log q/2))). PROVED (elementary; re-derived by two referees, the second with ball enclosures of eight off-line zeros and the pole order exactly 4 at k = 0, 1, 2 for q = 2, 3;")
rep('| HQ2 |', "Source: `c18-exact-relation-rigidity-klein-spinor` (+ REFEREE.md, one referee, holds with corrections E1 to E5); row X1. Not in `engine/curated/controls.json` (no engine code yet); screen over the device table: lane `c19-hq2-screen-fe-int-mult-pos-devices` |",
    "Not a screen for devices that read the local Euler shape at q (row X2). Source: `c18-exact-relation-rigidity-klein-spinor` (+ REFEREE.md, holds with corrections E1 to E5; second referee file `" + R7 + "/REFEREE2-c18-exact-relation-rigidity-klein-spinor.md`, holds with corrections); row X1. "
    "Engine code HQ2 in `engine/curated/controls.json` (entered by `" + ME + "`). Screen over the device table: row X2 (`c19-hq2-screen-fe-int-mult-pos-devices`, one referee) |")
hq3 = ('| HQ3 | log-positive pole-clause twin (campaign round 19; integer-frequency, multiplicative form of G_+ of the referee of `c15-control-with-zeta-fe-classes-u1-u2`): '
       'zeta(s)(1 - alpha u + u^2)/(1 - beta u + u^2), u = q^(1/2 - s), q prime, alpha = q^a + q^-a, beta = q^b + q^-b, 0 < a < b < 1/2 '
       "| zeta's functional equation exactly (invariance under u -> 1/u); ordinary Dirichlet series with integer frequencies; Euler product; nu >= Lambda >= 0 on prime powers (c_k = 2 (cosh kB - cosh kA) > 0, A = a log q, B = b log q); a(n) >= 1; zeros of the factor at 1/2 +- a + 2 pi i k/log q "
       '| the pole clause: simple poles at 1/2 +- b + 2 pi i k/log q (the one with k = 0 real, in (1/2, 1)); the geometric shape of the local factor at q. '
       'By Lemma N of the lane (Landau on one local factor; confirmed by the referee): in the one-prime rational class with nu >= 0 an off-line zero of the factor forces a real pole of the factor at real part at least that of every factor zero, so every member has a pole of this kind (necessary condition; many shapes meet it, referee E5). '
       'PROVED (elementary; re-derived by one referee; new member (q; a, b) = (5; 0.07, 0.31): functional equation to 1e-60, series recursion against the closed form to 3e-60 for k <= 40, smallest c_k 0.241) '
       '| kills steps that read the functional equation, integer frequencies, multiplicativity and log-level positivity (nu >= 0, or nu >= Lambda) without reading the pole clause or the local shape at every prime; removes the sign of nu at powers of q as a way to reject HQ2-type twins. '
       'Source: `c19-hq2-screen-fe-int-mult-pos-devices` (+ REFEREE.md, one referee, holds with corrections E1 to E7; `MAP_ROW.md`); row X2. Engine code HQ3 (entered by `' + ME + '`) |')
hq4 = ('| HQ4 | totally positive pole-clause twin (campaign round 19): zeta(s)(1 + alpha u + u^2)/(1 - beta u + u^2), same u, alpha, beta and parameter range as HQ3 '
       '| as HQ3 with c_k = 2 (cosh kB - (-1)^k cosh kA) > 0; zeros of the factor at 1/2 +- a + (2k + 1) pi i/log q; the local coefficient sequence at q is totally positive (Edrei-Thoma form: negative real zeros, positive real poles; Edrei\'s theorem CLASSICAL, not opened; '
       'referee check on the member (5; 0.07, 0.31): 24309 minors of order <= 4 on a 9 x 9 Toeplitz window, none negative; smallest c_k 1.03) '
       '| as HQ3: the pole clause (simple poles at 1/2 +- b + 2 pi i k/log q) and the geometric shape of the local factor at q. PROVED (elementary; re-derived by one referee) '
       '| as HQ3, and in addition kills local total positivity of the Euler factor as a separator. Source: `c19-hq2-screen-fe-int-mult-pos-devices` (+ REFEREE.md, one referee); row X2. Engine code HQ4 (entered by `' + ME + '`) |')
for t in (hq3, hq4):
    assert t.count(' | ') == 4, t.count(' | ')
insert_after('| HQ2 |', hq4)
insert_after('| HQ2 |', hq3)
k = line_of('- BLS in rank 2:')
lines[k] += (" Round-19 addendum (`c19-d10-xd-determinant-pole-term-lemma-q`, one referee; row D10): in the rational model the negative squares of a non-symmetric insertion in general position are carried by the 2d + 1 crossing points on the pole lines z_1 = 1, z_2 = 1 "
             "(PROVED as a reduction of the negative index to an explicit matrix; the count of negative squares is MEASURED, referee W-2, W-3); the same points are null for a symmetric insertion.")
log.append('BLS note extended')

# ============================================================ X2: HQ2 screen (after X1)
x2 = row(
 'X2',
 "HQ2 as a screen for devices reading functional equation + integer frequencies + multiplicativity + positivity (campaign round 19; combine; registered expectation: no device rejects HQ2 by a step other than the pole clause)",
 "Twenty device rows classified by the step at which HQ2 fails. Pole clause only: Hamburger, Theorem P and its trace identity, Weil-type explicit-formula positivity, the band devices W, C(theta), N(theta) in the limit, spinor causal S, the rank-2 apex kernel of row D10 (the last two ARGUED). "
 "Passes every step: identities (seam, Krein factorisation, lattice Hecke relations), Bost-Connes state positivity, and each band device at a fixed finite stage below a measured eps. "
 "Another step read first: (a) the sign of nu at powers of q (POS-FE, Lemma L): removed by the new control HQ3, and by Lemma N the poles then sit on the real axis; (b) the local shape at q (Lee-Yang stage property, size of local parameters, Selberg's Euler axiom, the 7/8 size inputs; total positivity is removed by HQ4); "
 "(c) complete multiplicativity at q (Bost-Connes eigenstates, Hecke eigen-relations, Helson classes). For finitely many modified primes with rational local factors and zeta's functional equation, (b) and (c) are forced: the multiplier splits into one-prime factors symmetric up to sign (Lemma F); "
 "a one-prime symmetric factor with no pole in abs(u) <= 1 is 1 (Lemma S in the form strengthened by the referee, E1; zero-freeness is not needed); geometric local factors at finitely many primes and zeta's elsewhere force G = zeta (Lemma C). "
 "Referee E1 (the main correction): inside this class the local-shape step is not independent of the pole clause: every such twin other than zeta has a lattice of poles of a local factor on a line Re s = sigma_0 >= 1/2, so the twins rejected by (b), (c) are those already rejected by the pole clause "
 "(for sigma_0 > 1/2 by the density estimate N(sigma, T) = o(T); on sigma_0 = 1/2 relative to a Putnam-type theorem on arithmetic progressions of zeros, CLASSICAL, recalled, not opened). 'Another step' therefore describes which hypothesis a device reads first, not a rejection mechanism beyond the pole clause. "
 "Lemmas S, F, C are elementary and of a known type (the lattice-of-poles argument behind strong multiplicity one in the Selberg class; novelty not established, E3); the Ramanujan-size case of device row 17 follows from the argument of E1 and is not in the lane file (E2). "
 "Numerics (finite stages; certified cells at heights 1e4, 1e5, 1e6, 96 and 192 modes; counts recomputed by the referee from the record files): the prime-side forms of HQ2 equal zeta's form plus the quartets minus 4 times the pole lattice (identity re-derived and rechecked on new cases); "
 "HQ2 with factor zeros at distance <= 0.10 passes N(theta) at M = 1 in 384 of 384 object-cells with theta <= 0.85; 801 certified pairs at M = 0 fail through the pole lattice alone; zeta is never certified negative (268 zeta records at M = 0 are undecided, E6). "
 "Reading: nothing on file reads multiplicativity jointly with the functional equation inside the strip. Open: infinitely many modified primes (section 6, item 23). Not a statement about zeros of zeta",
 "PROVED (Lemmas N, S, F, C and the HQ2, HQ3, HQ4 properties; elementary; re-derived by one referee; S, F, C of known type); CERTIFIED (first-negative-k table in exact arithmetic; device cells by ball certificates, three cells outside the run rerun by the referee); "
 "ARGUED (device rows 10, 11, 12, 18; the explanation of the near-null eigenvalues); one referee pass, corrections E1 to E7, no error in a PROVED step or a certified count; second referee owed (`c20-referee-theorem-d-headline-and-r19`)",
 "HQ2 passes every coefficient-level read except the pole clause; HQ3 passes in addition nu >= Lambda >= 0; HQ4 passes in addition local total positivity; on the band devices at finite stages the controls are not separated from zeta (referee cell (1e5, 0.8): T-NR negative, ZQ at eta = 0.102 negative at M = 0 and positive at M = 1). "
 "No control satisfies the hypotheses of Lemma C (an identification; not counted as R3). No device on file rejects HQ2, HQ3 and HQ4 through multiplicativity read jointly with the functional equation",
 "`c19-hq2-screen-fe-int-mult-pos-devices` (+ REFEREE.md; `MAP_ROW.md`; `summary_tables.md`; entered by `" + ME + "` after the referee's surviving claim); controls HQ2, HQ3, HQ4 in section 2; rows X1, P56, P58")
insert_after('| X1 |', x2)
rep('| X1 |', "Closed (one referee): do not look for a control failing through multiplicativity inside an exact relation",
    "Closed (one referee in round 18; a second referee file is on record after round 19): do not look for a control failing through multiplicativity inside an exact relation. Screen of HQ2 over the device table: row X2")
rep('| X1 |', "one referee pass, corrections E1 to E5, no verdict change; second referee owed (`c19-referee-r18-independent-sources`)",
    "two referee files, both hold with corrections (first: E1 to E5; second, `" + R7 + "/REFEREE2-c18-exact-relation-rigidity-klein-spinor.md`: HQ2, Lemma Q and Proposition F re-derived, ball arithmetic for the pole order and eight off-line zeros; Proposition D (c) stays as corrected by the first referee), no verdict change")

# ============================================================ G44 (second referee) and G45 (new: cell U4, quadratic / joint read)
rep('| G44 |', "Lemma V: in the 3-4-1 mechanism a simple zero at distance delta from Re s = 1 needs mean log-length below log 2/delta (for order m: log(m a_1/a_0)/delta; E5).",
    "Lemma V (sentence of the second referee, C3): a simple zero at distance delta from Re s = 1 can exceed the pole term in the 3-4-1 mechanism only if the mean log-length of the test is below log 2/delta (log(m a_1/a_0)/delta for order m; E5).")
rep('| G44 |', "for the triple sigma + ikt by the same computation with the referee's two repairs, E2)",
    "for the triple sigma + ikt by the same computation with the referee's two repairs, E2; sentence to use, both referees: for the triple sigma + ikt a lower bound with B locally bounded in (sigma, t) on a strip holds if and only if the strip is zero-free)")
rep('| G44 |', "reads of the phases at different primes jointly (round-19 lane `c19-u4-joint-prime-phase-quadratic-dp-zeros`).",
    "reads of the phases at different primes jointly (round-19 lane `c19-u4-joint-prime-phase-quadratic-dp-zeros`: reported, row G45).")
rep('| G44 |', "no change of the control table; second referee owed (`c19-referee-r18-independent-sources`)",
    "no change of the control table; second referee file on record (`" + R7 + "/REFEREE2-c18-u4-group-law-left-of-one-torus-orbit.md`: holds with corrections C1 to C4; none of the seven displayed inequalities uses a relation between primes; Lemma GL (b) is false in the 'only if' direction as printed by the lane and correct in the form of this row; "
    "not re-derived there: the continuation of DEL and THIN, the functional equation of the lifted G_+ members, the server table)")
g45 = row(
 'G45',
 "Cell U4, quadratic and joint-phase reads: inequalities quadratic in the logarithmic derivative, or reads of the phases p^(-it) at several primes jointly, combined with the truncation identity of row P58 (campaign round 19; explore; R4 direct; carriers: prime torus orbit, zeros of D_P as vortices, twin ladder)",
 "Stage A stopped the lane; no server run. Lemma Q2 (second-order explicit formula of the partial sum D_P; CLASSICAL in content, referee E4): for a_1 = 1, a_P != 0 and simple zeros beta of D_P, sum over n < P of Lambda_2(n) n^(-1/2) phi(log n) = sum over beta of phihat(beta - 1/2) D_P''(beta)/D_P'(beta), "
 "D''/D' = -u + 2 lim sum' 1/(beta - beta'), with the zero sum taken as a limit over heights (absolute convergence of the second-order sum is not proved: it needs a separation bound for the zeros, E3); holds for every series, multiplicative or not (float64 check to 1e-9 at P <= 14, 14 cases over two passes). "
 "Lemma N: non-negative coefficients of F^(k)/F (with the sign (-1)^k) for one k force a(n) >= 0, so log-derivative positivity of any degree with the functional equation and the pole clause lies in the identification class of Theorem P (row P56); a bookkeeping statement. "
 "Candidate (J), cross-prime positivity of the pair form (the part of Lambda_2 supported on products p^j q^k, p != q): true for zeta, trivially. Its multiplicative step is a sign relation between atoms at different primes, and this is the failing step for T-NR and for sign chains (the first such step on file). "
 "**Correction E1 of the referee (the lane had the Liouville twist passing): for Liouville Lambda(p^j) Lambda(q^k) = (-1)^(j+k) log p log q is negative when j + k is odd; it fails at the cross atom p q^2, first at n = 12 (coefficient -2 log 2 log 3 = -1.523; also 18, 20, 28), and passes only for P <= 12. Among sign chains only eps = +1 passes at every P.** "
 "The member with all atoms in phase with the opposite sign is 1/zeta (no functional equation of zeta's type; poles in the strip). The stage-A stop rests on E_a and DEL, which pass every step carried out, and on HQ2, which passes at each P (q > P gives zeta's D_P). "
 "Pivot, joint phases: K1 (Bohr equivalence at fixed P; Kronecker and Hurwitz): a statement on the zero set of D_P that holds at all heights and is stable under locally uniform limits holds for every unimodular completely multiplicative chain; K2: at most 1 + 2T log P/(pi (1 - 4 delta)) sign patterns are delta-emulated below T; "
 "K3: zeta(s)(1 + q^(b - s)), q > P, has zeta's D_P and vanishes on Re s = b. Closed for the pure cross form (J) and for sign conditions on atoms of Lambda_k; not a classification of cross-prime relations (E5). "
 "Not covered: a second-order form mixing A_P with the archimedean operator (round-20 lane `c20-u4-second-order-archimedean-mixed-form`)",
 "PROVED, CLASSICAL in content (Lemma Q2 as a limit over heights with simple zeros assumed; K1; K2; K3 one line); PROVED (Lemma N, elementary); CHECKED float64 (Q2; sign tables); ARGUED (rows ZQ, DH, HEAT of the stage-A table; the dichotomy 'identification or target in a window'); "
 "one referee pass: does not hold as worded, holds after E1 (the Liouville entry: one false control entry in the stage-A table), E2 to E5 restrictions; the obstruction verdict stands; second referee owed (`c20-referee-theorem-d-headline-and-r19`)",
 "E_a and DEL pass steps (1) to (3) of (J); HQ2 passes at each P; 1/zeta passes the sign step. Failing at a cross-prime sign relation: non-trivial multiplicative sign chains at p q, the Liouville twist at p q^2 (P > 12; E1), T-NR at q^2 p (c > 2) or q p (c < -2), THIN at p q; failing at support, not at a cross-prime relation: ZQ, DH, HEAT, NR-q (ARGUED). "
 "K1: every unimodular chain shares each height-uniform limit-stable zero statement on D_P at fixed P; K3: twins differing above P share D_P",
 "`c19-u4-joint-prime-phase-quadratic-dp-zeros` (+ REFEREE.md; row proposed in RESULT.md section 6, entered here with E1 to E5 applied by `" + ME + "`; correction notes in the lane's RESULT.md); earlier rows G38, G41, G44, P56, P58")
insert_after('| G44 |', g45)

# ============================================================ P58: second referees (sentences 6, 7, 9 to 14) and the round-19 continuation
rep('| P58 |', "truncation tail (u - 2 log abs(a_P))/(pi T). The constant is -u",
    "truncation tail (u - 2 log abs(a_P))/(pi T) norm(h)^2 (1 + o(1)); the mean of Re beta is log abs(a_P)/u (second referee). The constant is -u")
rep('| P58 |', "height <= 300, complete lists by winding number, E6)",
    "height <= 300, complete lists by winding number, E6; 31 to 33 percent at P = 12 and 37 to 41 percent at P = 20 with certified complete lists, heights to 2400, second referee)")
rep('| P58 |', "State: device type closed on one referee per lane; a completion positive by construction (real zeros of the Riemann-Siegel main sum) in 0.75 <= theta <= 0.85 with pre-registered mode counts is the one continuation on file (lane `c19-rs-real-zero-completion-band-server`).",
    "Second referee of the server lane (30-cell independent rerun at 48, 96 and 192 modes; sentences 10 to 14 of `campaign/CORRECTIONS_R18.md`): zeta's smallest eigenvalue on 96 modes has median 0.22 to 0.26 Lg at theta = 0.55 and 0.012 to 0.025 Lg at 0.85; on 192 modes with the same centres it is 0.28 to 1.0 times the 96-mode value (median 0.75): "
    "the margin is a property of the window space and decreases with the number of modes. Form C: zeta fails at M = 0 and M = 1 in 600 of 600 cells with a reflected atom on 96 modes; in the rerun the smallest eigenvalue is negative at 48, 96 and 192 modes in every cell, between -1.42 and -0.19 times Lg, more negative with more modes; "
    "at (1e6, 0.85) 40 of 40 at 96 modes, and at 192 modes one of two sampled windows is negative at M = 0. At (1e10, 0.75) the boundary integer 31622777 is prime and is included; it changes lam_min of Form C by up to 1.4e-3 and no sign. "
    "Addendum, campaign round 19 (`c19-rs-real-zero-completion-band-server`; heavy server lane; one referee: does not hold as written, holds after E1 to E4; the obstruction verdict stands): the one continuation on file was run. Completion measure sigma = unit masses at the sign changes of the Riemann-Siegel main sum in the window plus (Arch density minus its chord). "
    "**Lemma P as repaired by the referee (E1):** the lemma (for sigma >= 0, <h, T_sigma h> = int abs(g)^2 d sigma >= 0, and Q_D = T_sigma + E) is correct under its hypothesis, but the constructed sigma is a signed measure: the Arch density rho(x) = (Re psi(1/4 + ix/2) - log pi)/(2 pi) is negative for abs(x) < 6.2898 (rho(0) = -0.8550; negative mass 2.2479), so 'T_sigma >= 0 on every band' and 'sigma >= 0 for every point set' are false "
    "(counterexample U = 10, h = sin(pi s/10): <h, T_sigma h> < -4.5 norm(h)^2). Repaired statement: T_sigma >= -2.248 sup over abs(x) <= 6.29 of abs(g(x))^2; on m Fourier modes centred at t_w this is at most 2.248 * 4m/(u t_w^2) (3e-10 absolute, 3e-11 Lg, at 1e6 with m = 384), and the runs enclose lambda_min(T_sigma) >= 2.4e-6 Lg per cell, so no number and no control verdict changes. "
    "The statement holds on the mode spaces m = 96, 192, 384, not on every band. MEASURED (prime side, signs relative to a hand-derived radius; 1e6, 1e9, 1e12; 8 windows; theta = 0.75, 0.80, 0.85; 216 zeta cells): zeta's defect -lambda_min(E)/Lg is 0.036 to 0.137, 0.008 to 0.020, 0.0016 to 0.0052; "
    "scaled by (t/2 pi)^(1/4) the medians over m are 1.3 to 2.1 and the cells 0.7 to 3.3 (E2); at most 5e-4 Lg with the first correction term C0. The one-sided statistic changes under a ZQ exchange only by the pair form, of size at most mu = u (sinh(u eta)/(u eta) - 1) (PROVED, row Q31 source lane, re-derived), "
    "so at tolerance tau Lg it cannot exclude an off-line pair with (u eta)^2 below about 6 tau Lg/u, a set that is non-empty for every tau > 0 at every height; at the registered tolerance 0.05 this includes eta = 0.01 at 1e9 and 1e12, not at heights above about 1e31 and not at the C0 tolerance, "
    "and at 1e12 the defect of ZQ at eta = 0.01 is 1.5 to 4.2 times zeta's (E3: 'ZQ has the same defect as zeta' is false there). Exchange threshold eta* > 0 in 432 of 432 cells (422 certified in balls, E4). Chains, Liouville, DH (1e6, 1e9), E_a, T-NR, HQ2 fail by missing functional equation, zero or pole location, or size; no step reads multiplicativity. "
    "Registered outcome (b): the completion gives only N(theta) with tolerance; the two-sided version is the target in the window (ARGUED). "
    "State: device type closed (`engine/curated/devices.json`): four refereed lanes on record, the two round-18 lanes with two referee files each, and no continuation on file.")
rep('| P58 |', "PROVED (Theorem A with constant -u; float64 checks at P = 3 to 8 and on four general series, lane and referee);",
    "PROVED (Theorem A with constant -u; float64 checks at P = 3 to 8 and on four general series, lane and referee; ball arithmetic at P = 12 and 20 with complete certified zero lists, second referee);")
rep('| P58 |', "one referee pass per lane (E1 to E7; E1 to E6), no verdict change; second referees owed (`c19-referee-r18-independent-sources`);",
    "two referee files per round-18 lane, all hold with corrections (first: E1 to E7; E1 to E6; second: `" + R7 + "/REFEREE2-c18-tz-one-sided-bound-fe-reserve-bridge.md`, scope Theorem A only, and `REFEREE2-c18-tz-band-completion-controls-server.md`, scope zeta cells only, no control class rerun; "
    "the count 'two referees' is a count of files, referee of that lane E5), no verdict change; round-19 addendum: PROVED under the hypothesis sigma >= 0 only (Lemma P), repaired bound on the mode spaces (referee E1), MEASURED (defects, thresholds), ARGUED (the two-sided statement as target; the defect as Riemann-Siegel remainder), one referee;")
rep('| P58 |', "Every Dirichlet series with a_1 = 1 satisfies the identity. No control fails at a step that reads multiplicativity.",
    "Every Dirichlet series with a_1 = 1 and a_P != 0 satisfies the identity with the constant -u. Round 19 (Riemann-Siegel sign-change completion): ZQ is not excluded for (u eta)^2 below about 6 tau Lg/u at tolerance tau Lg (E3). No control fails at a step that reads multiplicativity.")
rep('| P58 |', "device type `tz-one-sided-completion-bound-band` closed in `engine/curated/devices.json` on these referee files; entered by `c19-repair-owed-record-r18-checkpoint-prep` |",
    "device type `tz-one-sided-completion-bound-band` closed in `engine/curated/devices.json` on these referee files; entered by `c19-repair-owed-record-r18-checkpoint-prep`; "
    "round 19: `" + R7 + "` (two REFEREE2 files, `tz_server/compare.json`); `c19-rs-real-zero-completion-band-server` (+ REFEREE.md; `PREREG.md`); addendum and second-referee sentences entered by `" + ME + "` |")

# ============================================================ D10: second referee of round 18 and the round-19 addendum
rep('| D10 |', "open in general (round-19 lane `c19-d10-xd-determinant-pole-term-lemma-q`).",
    "open in general (round-19 lane `c19-d10-xd-determinant-pole-term-lemma-q`: reported, addendum at the end of this cell).")
rep('| D10 |', "symmetric off-line quartets pass, so the row cannot score whatever X(d) gives. |",
    "symmetric off-line quartets pass, so the row cannot score whatever X(d) gives. "
    "Second referee of the round-18 lane (`" + R7 + "/REFEREE2-c18-d10-inertia-law-theorem-t-lemma-d.md`; holds with corrections): Theorem Q is computer-assisted; its conclusion is confirmed by a second implementation at 29 fresh interior points and the factorisation at 12 fresh points; the grid computation itself was not repeated. "
    "Odd number of real zeros, confirmed exactly: b = (u - 1) g is the model of M_0 times (-Theta) for odd degree and b = u (u - 1) g that of M_0 Theta; one real zero a with b = (u - 1)(u + a): (1, 0) at a = 1/4, (0, 1) at a = 3/4; with b = u (u - 1)(u + a): (1, 2) at a = 1/4, (2, 1) at a = 3/4, 11/20, 9/10. "
    "Addendum, campaign round 19 (`c19-d10-xd-determinant-pole-term-lemma-q`, one referee: the partial result holds; five wording corrections W-1 to W-5; the row is not closed). X(d) is not proved for general d. PROVED (re-derived by the referee by hand and exactly with separate code): "
    "(i) the term X of the round-18 Theorem H vanishes identically, so 2N = A[L(x_1, y_1) L(x_2, y_2) b(x_12) b(y_12)]: N is one half of Q = L (x) L (tensor square of the Bezoutian of b for u -> -u) on a subspace J^- of the jet space, and the sign-free 36-term kernel N^+ is one half of Q on a subspace J^+ that is Q-orthogonal to J^-; "
    "(ii) with the pole L has inertia (d, 1) and Q has inertia (d^2 + 1, 2d): the pole enters N as a rank-2d update, and neg(N) + neg(N^+) + z <= 2d with z the radical dimension; "
    "(iii) for simple zeros with no partner pair neg(N) is the negative index of the Gram matrix of N on the 2d + 1 crossing points (1, 1), (1, -a_j), (-a_j, 1) on the two pole lines (a reduction to an explicit matrix; that the matrix has as many negative squares as unpaired left zeros is MEASURED, W-2, W-3); "
    "(iv) at symmetric sets these 2d points are null vectors of N exactly when 1 - a_j is a zero; (v) for symmetric simple sets z >= d, so X(d) follows from NL(d): 'N^+ has at least d negative squares', and it suffices to find them for the three-term one-variable kernel on the pole line "
    "(the three-term formula is for N^+ from the 36-term sum; j^+ itself has five surviving terms there, W-1); (vi) on the pole line N + N^+ has at most one positive square. Exact instances: X(d) and NL(d) at 220 symmetric configurations of the lane, d = 6 to 16 (positive semidefinite of rank d(d-1)/2, no counterexample; "
    "the d = 16 runs come from one machine and one code path), and at 4 further configurations of the referee (two confluent); non-symmetric controls: negative index equal to the number of left zeros with multiplicity deficit in 60 of 60 (lane), and as predicted at the referee's 10 control configurations; an even-degree law; pole removed: positive in 60 of 60 "
    "(for base +1 Q is positive semidefinite, not definite, W-5). OPEN: NL(d) and X(d) for general d. The dual certificate depends on Theorems 2 and 4 of the lane and shares the Bezoutian routine with the direct run (W-4). |")
rep('| D10 |', "OPEN (X(d) for d > 4), one referee pass (E-1 to E-4) |",
    "OPEN (X(d) for d > 4), two referee files for the round-18 lane (E-1 to E-4; the second confirms Theorem Q through its conclusion at fresh points and the factorisation with the lane's own matrix routine, referee of that lane E5); "
    "round-19 addendum: PROVED (Lemma 1, Theorems 2 to 4 as reductions, Lemma 5; by hand, checked exactly; re-derived by one referee), PROVED-exact (224 symmetric configurations, d = 6 to 16), MEASURED (the deficit count, at the lane's 60 and the referee's 10 exact control configurations; dim J^- = n(n-1)/2), OPEN (NL(d); X(d) for d > 4), one referee pass (W-1 to W-5); second referee owed (`c20-referee-theorem-d-headline-and-r19`) |")
rep('| D10 |', "both fail on properties zeta has by the functional equation and the pole |",
    "both fail on properties zeta has by the functional equation and the pole. Round 19: symmetric controls (ZQ in rational form, BLS-sym) pass at every exact configuration to d = 16; non-symmetric sets fail by the deficit count; a pole-free base passes for every insertion |")
rep('| D10 |', "addendum worded after the referee's surviving claim; entered by `c19-repair-owed-record-r18-checkpoint-prep`) |",
    "addendum worded after the referee's surviving claim; entered by `c19-repair-owed-record-r18-checkpoint-prep`); `" + R7 + "` (REFEREE2 file); `c19-d10-xd-determinant-pole-term-lemma-q` (+ REFEREE.md; `MAP_ROW.md`; round-19 addendum worded after the referee's surviving claim; entered by `" + ME + "`) |")

# ============================================================ Z37: round-19 addendum (double-cover half)
rep('| Z37 |', "double-cover half a cell with a method and no supporting argument for (K3) (round-19 lane `c19-u6c-double-cover-k3-run`). |",
    "double-cover half a cell with a method and no supporting argument for (K3) (round-19 lane `c19-u6c-double-cover-k3-run`). "
    "Addendum, campaign round 19 (`c19-u6c-double-cover-k3-run`, one referee: holds as stated, nine corrections, none changes the verdict). (K3) is made a defined statement on the period side: for primes p = q = 1 mod 8 with (p/q) = 1 the genera of <1,1,d>, d in {1, p, q, pq}, have pairwise interchanged local similarity classes at every place "
    "(Lemma Q of that lane, PROVED, re-derived by the referee), so a genus-sum array K_phi(G) = sum phi(Q)/abs(O(Q)) of a scale-invariant phi that is a product of local functions satisfies K(G_1) K(G_pq) = K(G_p) K(G_q); the referee adds that this array-level identity is the consequence of a pure-tensor period functional at the spherical vector. "
    "Direction fixed once: '(K3) holds' in the lane means the array is not a product (Delta != 0); the campaign summary writes 'the identity fails' for the same fact (correction 7). Eisenstein input (Epstein zeta at class level; closed form with Siegel's class-number product, CLASSICAL): the product identity fails for all sufficiently large real s "
    "(limit ratios R_1 = 1/6, 1/2, 3/4, 1/4, 2/3, 2, 5/2, 2/3, 2, 4, 7/2 in 11 quadruples; no explicit s_0, correction 4) and by ball arithmetic at 12 values of s in each quadruple (132 of 132: 8 real and 4 complex values; s = 0.75 + 40i not decided; radii up to 5.1e-4 at 0.75 + 25i; "
    "the certificate covers the analytic step, the class lists rest on the Minkowski bound and local invariants, compared by the referee with Eichler's mass formula; corrections 1 to 3). Cusp input: one self-dual cusp form (the symmetric square of the first odd Maass form of SL_2(Z); Hecke data by Hejhal's method; "
    "the evaluator satisfies the T_2 and T_3 eigen-equations to about 1e-8, referee test): the identity fails in 14 of 14 quadruples by 2.6e3 to 5.7e6 error bars and in one new quadruple of the referee (float64, MEASURED; nothing is shown for a non-self-dual cusp form, correction 6). "
    "Controls: phi = 1 (mass) gives exactly 0. Delta takes both signs for both inputs, so the tested functional gives no one-sided inequality (scope: the functional Delta on the tested family, correction 5), and (K3) does not separate the Eisenstein member from the cusp member. "
    "Fixed-n theta coefficient arrays are not valid product controls (not scale-invariant). The reading as a statement about Whittaker functionals on the double cover passes through Jacquet's correspondence (RECALLED) and is not part of what is established. "
    "State after round 19: the double-cover half is closed by the lane as global period data without a Hecke relation and without an inequality, on one referee file; second referee owed (`c20-referee-theorem-d-headline-and-r19`). |")
rep('| Z37 |', "OPEN, not run (double-cover values); one referee pass, six corrections, no verdict change |",
    "OPEN, not run (double-cover values) in round 18; one referee pass, six corrections, no verdict change; round-19 addendum: PROVED (interchange lemma; theta splitting with radius), CLASSICAL (Siegel's formula; Eichler's mass formula), CERTIFIED for the analytic step (Eisenstein balls, 132 of 132), "
    "MEASURED float64 (cusp row, one self-dual form), RECALLED (Jacquet's correspondence; completeness of the local invariants), one referee pass |")
rep('| Z37 |', "is the twin for the class-level read (RECALLED, not run).",
    "is the twin for the class-level read (RECALLED, not run in round 18; run in round 19: the Eisenstein member and one self-dual cusp form both violate the product identity, with both signs; they are not separated).")
rep('| Z37 |', "(+ REFEREE.md; `MAP_ROW.md`; entered by `c19-repair-owed-record-r18-checkpoint-prep`);",
    "(+ REFEREE.md; `MAP_ROW.md`; entered by `c19-repair-owed-record-r18-checkpoint-prep`); `c19-u6c-double-cover-k3-run` (+ REFEREE.md; `MAP_ROW.md`; `table.md`; addendum entered by `" + ME + "` with the referee's corrections);")

# ============================================================ Q31: Turan source (sentence 22) and W5c (sentence 23)
rep('| Q31 |', "(relative to Turan's second main theorem, compared with a secondary source only)",
    "(relative to Turan's second main theorem in the form of Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3: factor 2 and constant 8e as printed there, proof read by a referee; Montgomery's Ten Lectures, chapter 5, not opened)")
rep('| Q31 |', "PROVED relative to Turan's theorem (Corollary T'; primary source not opened)",
    "PROVED relative to Turan's second main theorem in the form of Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3 (Corollary T'; the statement and the start of the proof read in the extracted text by the round-19 referee lane and by its referee; Turan's own text and Montgomery's Ten Lectures not opened)")
rep('| Q31 |', "Montgomery's Ten Lectures owed, `c19-referee-r18-independent-sources`)",
    "round 19: the theorem with the factor 2 and the constant 8e is Theorem K.3 of Montgomery-Vaughan, Multiplicative Number Theory III (draft), found with proof; Corollary K.5 follows from K.4 with M = L; 2,000 random instances, no violation; Montgomery's Ten Lectures not opened; `" + R7 + "`, one referee)")
rep('| Q31 |', "(second referee; PROVED relative to Plancherel-Polya, recalled; one referee on W5c): pairs x_j +- ib with equal offset and separation >= D pass the complete band-u device with tolerance M against any on-line set when b <= c sqrt(M) u^(-3/2), c depending on uD only.",
    "(second referee of the window lane; refereed once in round 19, `" + R7 + "/REFEREE-W5c-and-TURAN-SOURCE.md`: holds with corrections; PROVED, the Plancherel-Polya step proved inline by the sub-mean-value property on disjoint discs): pairs x_j +- ib with equal offset b and abscissae separated by at least D "
    "(all abscissae carrying a pair, with multiplicity one); for every h in L^2 of an interval of length u (centred without loss, f being translation invariant), sum_j -[f(z_j) + f(conj z_j)] <= 4 pi C(u, D) sinh^2(ub/2) norm(h)^2 with C(u, D) = (2 e^2/pi) max(2/D, u/2); "
    "hence the family passes the complete band-u device with tolerance M against any on-line set when 4 pi C(u, D) sinh^2(ub/2) <= 2M, in particular for ub <= 1 and b <= 0.499 sqrt(M) u^(-3/2)/sqrt(max(1, 4/(uD))). One band, equal offsets.")

# ============================================================ O1: pointer to versions 4 and 5
rep('| O1 |', "current text: `c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md`;",
    "version 3: `c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md`; version 4 (lines 13 to 17 and section F added): `c16-repair-owed-record-r15/STATEMENT_O_v4.md`; "
    "version 5 (`" + ME + "/STATEMENT_O_v5.md`): the label of lines 13, 14, 16, 17 is PROVED in the form the second referee file confirms, line 15 stays ARGUED, nothing else is changed (count PROVED 8, PROVED relative 1, MEASURED 1, ARGUED 7); whether version 5 replaces version 4 as the current text is left to the checkpoint after round 20;")

# ============================================================ section 6: item 23
k = line_of('22. **Which half of the 7/8 mechanism fails for THIN')
lines.insert(k + 1, "23. **Euler-shape rigidity without the pole clause for infinitely many modified primes** (`c19-hq2-screen-fe-int-mult-pos-devices`; row X2). Is zeta the only Dirichlet series with zeta's functional equation (poles unrestricted) and an Euler product with geometric local factors, "
             "or with every local factor free of zeros and poles in Re s >= 1/2? For: the finite case is proved (Lemmas F, S, C; elementary, known type), and a positive answer would change the pre-filter for local-shape devices. Against: it is an identification and locates no zero; "
             "inside the finite class the local-shape read selects the twins the pole clause already rejects (referee E1). Round-20 lane `c20-euler-shape-rigidity-infinite-modified-primes` (kill test: a twin with geometric local factors and zeta's functional equation).")
log.append('section 6 item 23 added')

# ============================================================ section 7: referee corrections of round 19
k7 = max(k for k, l in enumerate(lines) if l.startswith('| ') and l.count(' | ') == 2 and k > line_of('## 7. Referee-broken claims index'))
s7 = [
 ("'E_a, DEL and the Liouville twist pass every step' of the cross-prime candidate (J); 'among sign chains exactly eps = +1 and eps = -1 (Liouville) pass' (summary item 3, step M, stage-A table, section 5, proposed map row, claim line); 'the sums converge absolutely' for the second-order zero sum; Lemma Q2, K1, K3 without attribution",
  'c19-u4-joint-prime-phase-quadratic-dp-zeros',
  "Liouville fails step (2) at the cross atom p q^2, first at n = 12 (-2 log 2 log 3), and passes only for P <= 12; the lane's check used P = 10, where the only cross atom is 6. Among sign chains only eps = +1 passes at every P; the opposite-sign member is 1/zeta. The stage-A stop stands on E_a and DEL. "
  "The second-order sum is a limit over heights and needs simple zeros; Q2 is the classical second-derivative explicit formula of D_P, K1 is Bohr equivalence (referee E1 to E5; row G45; correction notes in the lane's RESULT.md)"),
 ("'Lemma P (PROVED): T_sigma >= 0 on every band'; 'sigma >= 0 for every point set G'; '-e_min (t/2 pi)^(1/4) = 1.3 to 2.1 at all three heights'; 'ZQ has the same one-sided defect as zeta'; 'eta* > 0 in 432 of 432 cells' as certified",
  'c19-rs-real-zero-completion-band-server',
  "The constructed sigma is signed (Arch density negative for abs(x) < 6.29, mass 2.2479); T_sigma >= -2.248 sup abs(g)^2 there, at most 3e-11 Lg on the mode spaces used and enclosed non-negative per cell; the statement holds on m = 96, 192, 384 modes, not on every band. 1.3 to 2.1 is the range of medians; cells 0.7 to 3.3. "
  "At 1e12 the ZQ defect at eta = 0.01 is 1.5 to 4.2 times zeta's; the obstruction is 'pairs with (u eta)^2 below about 6 tau Lg/u are not seen at tolerance tau Lg'. 422 of 432 certified (referee E1 to E4; row P58, round-19 addendum; note in the lane's RESULT.md)"),
 ("Lemmas S, F, C under 'New here'; 'class (iii) is not empty' as a rejection beyond the pole clause; row 17 'forced: Lemma S' for the Ramanujan bound; 'sum over zeros of abs(ghat)^2' for off-line zeros; 'HQ3 is the only shape available'; 'zeta: never negative'",
  'c19-hq2-screen-fe-int-mult-pos-devices',
  "Elementary, known type (lattice-of-poles argument of strong multiplicity one); novelty not established. In the class where the lemmas hold the local-shape read selects the twins the pole clause already rejects. The size case needs the argument of E1 (not in the file). "
  "The term is ghat(rho) conj(ghat(1 - conj rho)). Every member has this shape of pole (a necessary condition). Never certified negative: 268 zeta records at M = 0 are undecided (referee E1 to E7; row X2)"),
 ("'five complex s'; 'radii below 2e-4 at 0.75 + 25i'; masses 'in all cases computed'; 'EXACT for all large real s'; 'no inequality' unscoped; 'the cusp member'; '(K3) holds' against 'the identity fails'",
  'c19-u6c-double-cover-k3-run',
  "8 real and 4 complex decided values (0.75 + 40i undecided); radii up to 5.1e-4; masses equal Eichler's mass formula (an independent completeness check); a limit statement with no explicit s_0; established for the functional Delta on the tested family; one self-dual cusp form; "
  "both phrases mean Delta != 0 (referee corrections 1 to 9; row Z37, round-19 addendum)"),
 ("'only three of the six terms of j^+ survive'; 'a neighbouring non-symmetric set always has negative squares'; 'the mechanism (Theorem 3) PROVED in general position'; 'second, independent certificate'; 'without the pole Q is positive definite'",
  'c19-d10-xd-determinant-pole-term-lemma-q',
  "Three terms for psi(w lam), five for j^+ on the pole line; the count of negative squares is MEASURED (60 exact configurations of the lane, 10 of the referee), Theorem 3 proves the reduction to a (2d+1) x (2d+1) matrix; the dual certificate depends on Theorems 2 and 4 and shares the Bezoutian routine; positive semidefinite for base +1 (referee W-1 to W-5; row D10, round-19 addendum)"),
 ("Theorem H: '6N = A[LL_+ + 2 LL_-], A[LL_+] = 2N + X, A[LL_-] = 2N - X/2'", 'c18-d10-inertia-law-theorem-t-lemma-d',
  "X = 0 identically; the identity is 2N = A[LL_+] = A[LL_-] (`c19-d10-xd-determinant-pole-term-lemma-q` Lemma 1, re-derived by its referee, 72 of 72 exact identities). The round-18 statement is correct and not sharp; Corollary H1 is unaffected (row D10)"),
 ("'No file outside this directory was edited'; 'ranks 1, 3, 6, 10, 15 = n(n-1)/2'; 'the sign at 3^2 is negative because both roots are negative'; 'each lane now has 2 referees, both holding' without scope",
  R7,
  "Importing `quartet_lib` wrote two .pyc files in the D10 lane's `__pycache__`. Rank n(n-1)/2 when no root lies on the imaginary axis, lower otherwise. With a + b = 3.81, ab = 3 both are positive; the sign comes from (-1)^(k+1) (local roots -a, -b). "
  "'Two referees' counts files: Theorem Q was confirmed through its conclusion at fresh points, only Theorem A was re-derived for the tz paper lane, only zeta cells were rerun for the tz server lane (referee E1 to E5; the 23 sentences to use are in `campaign/CORRECTIONS_R18.md`)"),
 ("Items 54, 56, 57 of STRATEGY section 3.1 and the device type `exact-relation-rigidity` 'closed' under the heading 'Families closed by this rule' on one referee file; `assert` on open device types described as a check; nodes of the closed types with status conjectural; 'outcome records 194'; the fraction '35 to 40' attributed to the lane",
  'c19-repair-owed-record-r18-checkpoint-prep',
  "Closed pending the second referee (a planner instruction, not the two-obstruction rule); after round 19 the round-18 lanes behind items 54, 55, 56 have two referee files each, item 57 one. The assertion is a standing constraint of `mk_devices.py` (scoped by `" + ME + "` to the ids of blocks R18 and R19). "
  "194 counted files in `engine/outcomes/`; `outcomes.json` had 164 records. The source lane prints '34 to 41 percent' in its body (referee E1 to E5)"),
]
for j, (a, b, c) in enumerate(s7):
    t = '| ' + a + ' | ' + b + ' | ' + c + ' |'
    assert t.count(' | ') == 2, (j, t.count(' | '))
    lines.insert(k7 + 1 + j, t)
log.append('section 7: %d rows added' % len(s7))

# ============================================================ row count and update paragraph
k = line_of('Row count (2026-11-20, `c19-repair-owed-record-r18-checkpoint-prep`)')
lines[k] = ("Row count (2026-11-20, `" + ME + "`): P 58, G 45, Q 31, S 13 (S12b counted), Z 40, F 8, T 3, L 6, D 10, X 2, O 1 = 217 "
            "(previous count by `c19-repair-owed-record-r18-checkpoint-prep`: 215; added G45, X2). Controls in the section 2 table: 16 (HQ3, HQ4 added; HQ2, HQ3, HQ4 have engine codes); "
            "controls defined in notes with an engine code: EIS-w, UNIV, BLS, NR-vec.")
log.append('row count line replaced')
upd = ("Update 2026-11-20, sixteenth (`" + ME + "`): rows owed from campaign round 19, each worded after the referee pass in the lane's REFEREE.md (one referee each; second passes owed by `c20-referee-theorem-d-headline-and-r19`), "
       "and the second-referee results of `" + R7 + "` for the round-18 rows. Added: control rows HQ3 and HQ4 in the section 2 table (functional equation, integer frequencies, Euler product, nu >= Lambda >= 0, off-line zeros; simple poles off the line; HQ4 with a totally positive local sequence); "
       "row X2 (HQ2 as a screen over twenty device rows; Lemmas N, S, F, C; the referee's correction that the local-shape read is not independent of the pole clause in the finite class); row G45 (cell U4, quadratic and joint-phase reads, "
       "with correction E1: the Liouville twist fails the cross-prime candidate at p q^2 for P > 12); item 23 of section 6; eight rows of section 7. Edited: control row HQ2 (log-level positivity lacking; exact zero distance; engine code); "
       "row Z37 (round-19 addendum: the double-cover half run and closed by the lane on one referee; Eisenstein and one self-dual cusp form not separated); row D10 (second referee of the round-18 lane; round-19 addendum: X = 0, the reduction of X(d) to NL(d), 224 exact configurations; the row stays open); "
       "row P58 (second-referee sentences on margins, Form C and the truncation identity; round-19 addendum with Lemma P as repaired by the referee and the Riemann-Siegel sign-change completion closed by ZQ through the pair form); rows G44, X1 (two referee files); "
       "row Q31 (Turan's second main theorem cited as Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3; W5c in the form of its referee); row O1 (pointers to versions 4 and 5 of Statement O). Rows 215 -> 217. No bound moves and section 1 is unchanged. "
       "The 23 sentences to use from the second referees are listed with their places in `campaign/CORRECTIONS_R18.md`. The previous file is kept as `push/" + ME + "/before/OBSTRUCTION_MAP.md`.")
anchor = 'Update 2026-11-20, fifteenth (`c19-repair-owed-record-r18-checkpoint-prep`)'
k = line_of(anchor)
lines.insert(k + 1, ''); lines.insert(k + 2, upd)
log.append('sixteenth update paragraph added')

# ============================================================ checks and write
labels = [m.group(1) for l in lines for m in [re.match(r'^\| ([A-Z]+[0-9]+[a-z]?) \|', l)] if m]
assert len(labels) == len(set(labels)), [x for x in labels if labels.count(x) > 1]
for pfx in ('| X1 |', '| X2 |', '| P58 |', '| G44 |', '| G45 |', '| Z37 |', '| Q31 |', '| D10 |', '| O1 |'):
    assert lines[line_of(pfx)].count(' | ') == 5, (pfx, lines[line_of(pfx)].count(' | '))
for pfx in ('| HQ2 |', '| HQ3 |', '| HQ4 |'):
    assert lines[line_of(pfx)].count(' | ') == 4, pfx
print('\n'.join(log)); print('distinct row labels:', len(labels))
if os.environ.get('DRY') == '1':
    print('DRY RUN: nothing written')
else:
    open(P, 'w', encoding='utf-8').write('\n'.join(lines)); print('written', P)
