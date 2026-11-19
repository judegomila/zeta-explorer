"""Map edits of lane c7-repair-engine-map-r6 (rows owed from campaign rounds 5 and 6). Exact-string or anchored
edits with assertions; previous file: before/OBSTRUCTION_MAP.md. Run once: python3 apply_map.py
Row ids: the map parser (engine/build_graph.py) accepts [A-Z]{1,2}\\d{1,2}[a-z]? only, so the lane labels
A3-C1, A3-C2, A3-C3, A3-R are entered as G27..G30 with the label kept in the route cell."""
import os, re, json
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
t = open(PATH, encoding='utf-8').read()
n0 = t.count('\n')
edits = []
assert 'c7-repair-engine-map-r6' not in t, 'already applied'

def rep(old, new, name, count=1):
    global t
    assert t.count(old) == count, (name, t.count(old))
    t = t.replace(old, new)
    edits.append(name)

def after_row(rid, rows, name):
    global t
    m = re.search(r'^\| %s \|.*$' % re.escape(rid), t, re.M)
    assert m, rid
    for r in rows:
        cells = r.split(' | ')
        assert r.startswith('| ') and r.endswith(' |') and r.count('|') == 7, (name, r[:40], r.count('|'))
        rid_new = r.split('|')[1].strip()
        assert not re.search(r'^\| %s \|' % re.escape(rid_new), t, re.M), ('duplicate row id', rid_new)
    t = t[:m.end()] + '\n' + '\n'.join(rows) + t[m.end():]
    edits.append(name)

def row(rid, route, stops, status, defeated, src):
    for c in (route, stops, status, defeated, src):
        assert '|' not in c, rid
    return '| %s | %s | %s | %s | %s | %s |' % (rid, route, stops, status, defeated, src)

# ---------------------------------------------------------------- section 3.1: P50, P51
P50 = row('P50', 'Degree-2 positive forms with automorphic companions: log-level squares, products of log-level forms, coefficient squares sum abs(b(n))^2 n^-s (Ingham / Rankin-Selberg), pointwise outputs',
 'Log-level squares are linear in -L\'/L (row P25; Fejer-Riesz: the zeta part is the classical cone). A product of two log-level forms has non-negative coefficients only if both factors are admissible linear forms up to a common sign (Lemma Q, with X the closure of the phase points and every point a limit of others, referee correction C2; with companions relative to a cited density statement). A coefficient square is non-negative for every sequence b and invariant under every unimodular twist of b (elementary); with DH coefficients it stays non-negative (exact, n <= 10^4). For b = lambda_Pi, tempered and unramified, it equals L(s, Pi x Pi~) H(s) with log H bounded on Re s >= 1, and its Landau abscissa is 1 - 2 min Re z_j for every zero configuration: the leading pole is met only by factors evaluated on Re s >= 1, so Landau on a coefficient square reaches Re s = 1 and no further. Multiplicativity enters only through the factorisation. Density (family) outputs not run: MV-CAP (P29) and the even-moment row apply. Not covered: quadratic objects that are not Dirichlet series (periods, triple products, theta lifts).',
 'PROVED (Lemmas Q, H, Edge; Lemma U elementary; relative to classical non-vanishing on Re s = 1); coefficients MEASURED exactly; refereed once (five corrections, none changes the verdict)',
 'DH (passes the coefficient-square class), U, TW-, THIN (identical series), EA (member of the class)',
 '`c6-quadratic-companion-positivity` (+ REFEREE.md)')
P51 = row('P51', 'Power-saving additive twists sum chi(n) e(an/q), uniform in q, for unimodular completely multiplicative chi (lane label P44; renumbered)',
 'Strict form (no main term at q > 1), any theta < 1, under limsup abs(S(x))/x > 0: chi(n) = n^(-i alpha) (the sum over a mod p of the twists equals p chi(p) S(x/p)); an identification, and the hypothesis is then classical with theta = 0+. In the branch S(x) = o(x) (Liouville and relatives) the strict form is not an identification: it is equivalent to the strip statement for all L(s, psi) and is closed by circularity (row P14). General form: THIN passes (error O(q x^(b+eps)); measured twisted exponents about 0.45 at b = 0.9 with a zero at 0.9, order of magnitude only). Zeros of sum chi psi(n) n^-s right of the q = 1 abscissa are those of L(s, psi) for real chi; for complex chi only the product statement of Theorem 1\' holds (zeros of each factor are zeros of L(s, psi)). Greedy THIN at b = 0.9: discrepancy exponent 0.42 on x <= 4e10.',
 'PROVED (Lemma A, Theorem 1\'; two referee passes, all PROVED steps re-derived); exponents MEASURED',
 'THIN, B (strict form fails at q = p; identification only); WT is the residual class of the strict form; THIN passes the general form',
 '`c5-twisted-helson-arcs` (+ REFEREE.md, REFEREE2.md)')
after_row('P49', [P50, P51], 'rows P50, P51')

# ---------------------------------------------------------------- section 3.2: G27..G30 (lane labels A3-C1, A3-C2, A3-C3, A3-R)
SQ = '`c6-square-intertwiner-weyl` (+ REFEREE.md); `res-point-spectrum-square`'
G = [
 row('G27', 'Covariant square of Q_L with U tied to Hecke operators on a cuspidal (or metaplectic cuspidal) spectrum (lane label A3-C1)',
  'For a GL_2 cuspidal target over Q: no realisation for any fixed continuous rule T_p = psi(U(log p)); none for U(log p) = P(T_p) with deg P <= 4 and p-independent coefficients (Theorem H2: written for trivial nebentypus; nontrivial nebentypus after a twist repair noted by the referee; an injective continuous phi is covered only when the lambda_p lie in a compact set; all continuous phi conditional on sym^k functoriality, k >= 5, for Maass forms). Reason: the eigencharacter that a zero would need is that of an Eisenstein series. Finitely many primes with continuous g: bounded spectrum. Free Borel rule: exists iff RH (no lever). Weight 1/2, quaternionic and n-fold cover cases rest on recalled correspondences; the n-fold cover case also needs H2 over Q(omega), not written.',
  'PROVED from CLASSICAL (GL_2 over Q; one referee, Theorem H2 part (b) is a referee debt); other cases RECALLED',
  'none separated: the statement is about the target and holds alike for every control',
  SQ + ' Theorems H, V'),
 row('G28', 'Covariant square with U a function of the Casimir (lane label A3-C2)',
  'Weyl laws: R^2 (surfaces), R^3 (cubic and sextic covers over Q(omega)), linear (dihedral families); none is T log T. The full-spectrum exclusion for H = c r^a, 1 <= a < 2, is conditional on unproved Casimir multiplicity bounds. Float test (not certified): gamma_1 is neither r_j nor 2 r_j on SL_2(Z) and on the weight-1/2 plus space. Counting tests are defeated by sub-selection of the spectrum. Free g: iff RH.',
  'Weyl laws CLASSICAL; exact test MEASURED (float)', 'none separated', SQ),
 row('G29', 'Covariant square on a group compact at infinity (lane label A3-C3)',
  'Fixed level and weight: finite-dimensional. Rank one: lattice spectrum, short by a log factor (and Proposition C of the earlier lane). Rank >= 2 without a Hecke rule: reduces to "ordinates in a finitely generated subgroup of R", OPEN, and without R1. With a Hecke rule: row G27 after transfer.',
  'PROVED / OPEN as stated', 'none separated', SQ + ' Prop. C'),
 row('G30', 'Rank-one family with a functional outside L^2 (GL(1) point evaluation, density abs(zeta)^2) (lane label A3-R)',
  'F(gamma_n) is not constant over the first zeros (range about -10.6 to 18.4); no single member carries the zeros.',
  'MEASURED', 'Euler-blind (DH verbatim, earlier lane)', SQ),
]
after_row('G26', G, 'rows G27-G30 (lane labels A3-C1, A3-C2, A3-C3, A3-R)')

# ---------------------------------------------------------------- section 3.5: Z15 note; Z15c, Z23..Z26
rep('5/6 is not established as the limit: the reduced system is inconsistent outside lx >= l. |',
    '5/6 is not established as the limit: the reduced system is inconsistent outside lx >= l. Update (rounds 5, 6): re-expression of the probe and probes of higher degree in the target do not change h (Z15b, Z15c); the reduced system omits the normaliser H_eta, and with it the format stops at abscissa 2/3 for sextic rows (Z24); the h = 3 statement "low input equivalent to GRH" is replaced by the chain of Z26. |',
    'row Z15 update')
Z = [
 row('Z15c', 'Probe quadratic or of higher degree in the target (pair probe; functional-equation pair from the bridge)',
  'A bilinear probe has signal f(Z1) f\'(Z2). Same-side pair with factorised H: the pair hypotheses are equivalent, with changed constants, to the linear hypotheses of Prop. 2.1 with halved exponents; the estimate system is homogeneous of degree one in the target-row length and equals the single-probe system at (lx/2, ly/2, (l1+l2)/2) (36,000 exact comparisons, 0 mismatches); h_pair = 1 + (l1+l2-lx)/2 <= 1 under lx >= l1 + l2; ledger 13/15, 31/36, 5/6 unchanged. With the full source ledger the least value at h_pair >= 1 is 52/57 (8/9 with the polar G), so no such point reaches 13/15. Points with h_pair > 1 at or below a tier value exist only for lx < l1 + l2 (no construction) and need at least one deleted input: the K-loss alone (tie at 31/36, h_pair = 49/48) or the Gram excess alone (69/80 at h_pair = 21/20) (referee correction of the lane\'s classification). Functional-equation pair (rho, 1 - conj rho): its product has size Z for every beta, so it carries sign information only and cannot feed a size comparison. Shifted product zeta(s) zeta(s - d): the E_a scaling.',
  'PROVED (Lemma P; algebra of the factorised H); EXACT LP on MODEL inputs; refereed once with one correction; relative to the unrefereed manuscripts',
  'DH: blind at signal extraction; THIN: the same-side probe exists, unreflected branch, abscissa 1; EA: shift by a',
  '`c6-pair-probe-bridge-order2` (+ REFEREE.md)'),
 row('Z23', 'Double covers as a source of a weight-0 (shift 0) epsilon cocycle: Gelfand-Tsetlin weights on the double cover of GL(n); twist families of a GL(n) form',
  'Narrowed wording (the referee does not hold the lane\'s claim as worded). Given the recalled Gelfand-Tsetlin recipe for the double cover, at an unramified odd place with chi(-1) = +1, in unitary normalisation every pattern weight is a product of 1, 1 - 1/q, -1/q and T q^(-1/2): the quadratic symbol T occurs only together with q^(-1/2) and every minus sign only together with q^(-1), in every rank (Lemma L; rechecked in rank 2 on new shapes and in rank 3). No local term (sign depending on T) x (unit) occurs at order q^0. For l1 = 0, l2 even the numerator of the row series is the displayed product and its only U-dependent term above order 1/q is -T Yu q^(-1/2) U; this is a reading of one local factor, not a statement about a global Dirichlet series. Epsilon factors of quadratic twists of any GL(n) form are a character times a periodic root of unity (no Jacobi-type value). Not established: the numerator for other labels; any global Euler-product statement; chi(-1) = -1 (q = 3 mod 4); the normalisation convention that turns Lemma 1 (exponent group Z/2) into an obstruction; the global Whittaker constants of a genuine cusp form (section 6 item 18 stays open there). Sources recalled, not opened (Brubaker-Bump-Friedberg / McNamara).',
  'PROVED-rel the recalled recipe (Lemma L, Lemma 1 arithmetic); MEASURED (exact row series, finite labels); refereed once, claim narrowed',
  'none run (local algebraic statement; no control is separated)',
  '`c6-gl3-cover-epsilon-cocycle` (+ REFEREE.md section 5)'),
 row('Z24', 'Normaliser of the Prop. 2.1 probe: cap at abscissa 2/3 for sextic rows',
  'At the principal residue point (w, z) = (1, 1/6) the normaliser of MS (10.1) is H_eta(s) = zeta_F^S(2)^-1 L^S(6s - 3, psi_eta) E_eta(s) on Re s > 1/2, psi_eta = (alpha eta)^6 of infinite order, E_eta absolutely convergent and non-vanishing there; second form with L^S(6s-3)/L^S(6s-2) on Re s > 3/7 (Lemma H: local factor (1 - q^2)(1 - D(1-q) - Rq)/((1-R)(1-D)), re-derived from MS table (7.16) by a second referee). H_eta has infinitely many zeros in 7/12 <= Re s < 2/3 and none with Re s >= 2/3. MS hypothesis (2.2) is false for every sigma_0 < 7/12 and every finite S; for 7/12 <= sigma_0 < 2/3 it needs a zero-free region for L(w, psi_eta), a character outside the family (2.1); it holds for every sigma_0 > 2/3 after enlarging S and fails at sigma_0 = 2/3 exactly (second referee). Without (2.2) the exact statement is Lemma S: f_eta(Z) << Z^(C(B)+eps) iff H_eta / L^S(s, eta) is holomorphic on Re s > B. Consequence for the format: with the sextic probe the unconditional conclusion stops at abscissa 2/3 (h = 2, effective order 3). A probe aimed at h = r/2 needs a normaliser without zeros in Re s > 1/2, or the family enlarged to contain psi_eta with common zeros excluded. The formula was first recorded in Z18 as non-binding for the present design.',
  'PROVED-rel MS Lemma 7.1 (two referees: REFEREE.md, REFEREE2.md); Hecke L-function facts CLASSICAL; MS Lemma 7.1 not re-derived from (7.10)',
  'not a control statement (uses complete multiplicativity and abs(eta(p)) = 1 only; holds for THIN and unimodular twists)',
  '`c6-marks-bc-manuscript-check` section 2 (+ REFEREE.md, REFEREE2.md); `r3-tnr-control` section 3'),
 row('Z25', 'Which half of Proposition D fails for THIN: row moments and the probe (6.1) by enumeration',
  'Not decided. Row moments (Z <= 2^21): every sign weight, multiplicative or not (16 weights, plus two non-multiplicative weights added by the referee), carries a common row component with amplitude linear in its Mertens-type sum (energy exponent 0.13 to 0.20, staircase); for thin weights it is under 2 percent of the mean square in range. The lane\'s control claim "multiplicativity produces the signal" is refuted by its referee. A large row moment does not decide Proposition D (it leaves abs(I_eps) free). Probe (6.1) (14 sign weights, Z = 2^10 .. 2^18): I_w = principal row + remainder, principal coefficient 1 for Liouville, THIN and the non-multiplicative control, remainder about Z^(-0.24) for all; the range is pre-asymptotic (one sixth-power frequency; the second enters at Z >= 2^36), pre-registered thresholds undecided, condition (N) not seen. First failing hypothesis in the manuscript replay is Lemma 5.8 (periodicity of every twist in the conductor aspect). The question is now a paper question (LIOU-HIGH: high comparison for the Liouville weight through 1/L(x, liou chi) = L(x, chi)/L(2x, chi^2)).',
  'MEASURED (float64, complete row enumeration; reproduced); OPEN',
  'statement about the control THIN; non-multiplicative weights pass the same measurement',
  '`c5-thin-propd-dichotomy` (+ REFEREE.md); `c6-probe61-thin-three-weights` (+ REFEREE.md); `c5-thin-walk-replay`'),
 row('Z26', 'Long prime marks with l - lx = 2 (h = 3 vertex) as the route to abscissa 1/2',
  'Inside the transcribed reduced system: no geometry with l >= M has abscissa <= 1; B = 1/2 is LP-feasible only at tall h = 3 points ((5,5,7), (5/2,5,9/2), (3,5,5) uncompensated; (4,8,6), (6,12,8) compensated with TRO6 G). Every h > 1 geometry has lx < l and lies outside the hypothesis lx > l of every proved low estimate (MS Prop. 15.3, Liu II Prop. 13.4). Against the manuscript text: of 12 lines of the reduced system 5 agree with a numbered statement, 4 are transcribed differently, 3 have no source. The c5 sentence "low input at h = 3 is equivalent to GRH for the family" is replaced by the chain GRH => (N) => (R), where (N) is the low input, (R) is: beta* <= 2/3 and every top-layer zero of the family in 1/2 < Re s <= 2/3 is a common zero of L(s, eta) and L(6s - 3, psi_eta); (R) => GRH is OPEN (Z24). Each implication is relative to an exact identity and a high side that have no source at the vertex. (N) is not weaker than its conclusion, so the branch gives no independent input. Theorem B (criticality at h > 3) survives with a slack hypothesis; Theorem C holds for sigma <= 1/3 and is resonant above. One sentence of claim A of the c5 lane was false (section 7).',
  'PROVED-rel (Theorem B1\': signal part PROVED with classical inputs, remainder relative to unsourced inputs; two referees on Lemma H, Lemma S, Theorem B1\'); EXACT LP on MODEL inputs',
  'Liouville: the signal has a main term, the low input fails by Z^(1/2) unless rows cancel it; THIN: open half of Proposition D (Z25)',
  '`c5-marks-circularity-order2` (+ REFEREE.md); `c6-marks-bc-manuscript-check` (+ REFEREE.md, REFEREE2.md)'),
]
after_row('Z22', Z, 'rows Z15c, Z23, Z24, Z25, Z26')

# ---------------------------------------------------------------- row count
ids = re.findall(r'^\| ([A-Z]{1,2})\d{1,2}[a-z]? \|', t, re.M)
cnt = {}
for i in ids:
    cnt[i] = cnt.get(i, 0) + 1
order = ['P', 'G', 'Q', 'S', 'Z', 'F', 'T', 'L', 'D']
assert set(cnt) == set(order), cnt
old = 'Row count (recounted 2026-11-18 by `c6-repair-referee-debts-r5`): P 49, G 26, Q 22, S 12, Z 23, F 8, T 3, L 5, D 7 = 155.'
new = 'Row count (recounted 2026-11-18 by `c7-repair-engine-map-r6`): ' + ', '.join('%s %d' % (k, cnt[k]) for k in order) + ' = %d.' % sum(cnt.values())
rep(old, new, 'row count line')
assert sum(cnt.values()) == 155 + 11, cnt

# ---------------------------------------------------------------- section 6 items 1, 9, 18, 21, 22
def append_item(n, start, addition, name):
    global t
    m = re.search(r'^%d\. \*\*%s.*$' % (n, re.escape(start)), t, re.M)
    assert m, name
    t = t[:m.end()] + ' ' + addition + t[m.end():]
    edits.append(name)

append_item(1, 'Effective order 2 in the 7/8 architecture',
 'Status after rounds 5 and 6: each attack item has an obstruction. Re-expression of the probe (Lemma U, Z15b); abelian families (Z22); double covers through local data (Z23, narrowed); probes of higher degree in the target (Z15c); long marks at h = 3 (Z26); and the format itself stops at abscissa 2/3 for sextic rows because of the normaliser (Z24). Left: derivation of the uncompensated high side from manuscript (12.5)/(16.1) with the normaliser kept; the compensated principal signal below Re s = 3/5; model vertices with 1 < h <= 3 (underived); global Whittaker constants of a genuine cusp form on the double cover of GL(3) (item 18). Any order-2 probe needs a normaliser without zeros in Re s > 1/2.',
 'section 6 item 1')
rep('9. **Quadratic or mean-value positivity with automorphic companions (beyond linear 3-4-1).** For: the refereed no-go covers linear combinations only. Against: mean-value outputs are densities (MV-CAP).',
    '9. **Quadratic or mean-value positivity with automorphic companions (beyond linear 3-4-1): closed for pointwise outputs (`c6-quadratic-companion-positivity`, refereed once; row P50).** Log-level squares lie in the P25 cone; products need admissible linear factors; coefficient squares are positive for every sequence, twist-invariant and positive for DH; Landau on L(s, Pi x Pi~) reaches Re s = 1 only. The density (family) half was not run: MV-CAP (P29) and the even-moment row apply to it. Not covered: positivity of quadratic objects that are not Dirichlet series (periods, triple products, theta lifts), which are other rows (`ap-squares-rallis`, `e1-*` lanes).',
    'section 6 item 9')
append_item(18, 'Genuine cusp forms on the double cover of GL(3)',
 'Round 6 (`c6-gl3-cover-epsilon-cocycle`, row Z23; claim narrowed by its referee): in the local Gelfand-Tsetlin data of a double cover of any rank the quadratic symbol occurs only with q^(-1/2), and quadratic twist families of any GL(n) form carry no Jacobi-type epsilon value. Still open here: the global Whittaker constants of a genuine cusp form, the case chi(-1) = -1, and any global Euler-product statement.',
 'section 6 item 18')
append_item(21, 'Discrepancy hypothesis for all additively twisted sums',
 'Closed (`c5-twisted-helson-arcs`, two referee passes; row P51): the strict form is an identification chi = n^(-i alpha) when limsup abs(S(x))/x > 0 and a restatement of the strip statement otherwise (P14); the general form is passed by THIN.',
 'section 6 item 21')
append_item(22, 'Which half of the 7/8 mechanism fails for THIN',
 'Rounds 5 and 6 (`c5-thin-propd-dichotomy`, `c6-probe61-thin-three-weights`; row Z25): not decided, and not decidable by enumeration (second sixth-power frequency at Z >= 2^36). It is now the paper question LIOU-HIGH.',
 'section 6 item 22')

# ---------------------------------------------------------------- section 7 entries, rounds 5 and 6 (appended at the end of the table)
S7 = [
 ('Proposition 5 (PROVED): on-ray weight Nc^(-1/2) "(1 + lower-order terms from rational factors of c)"', 'c5-angular-family-absorption', 'For squarefree c = m c* (m the maximal rational divisor) the weight is N(c*)^(-1/2); the obstruction verdict stands (row Z22). Theorem 7 (iv) for an abstract family is ARGUED, not proved (second pass, `c6-repair-referee-debts-r5`)'),
 ('Verdict statement 3: in free geometry all h > 1 vertices lie below 1/2 and need the K- and P-losses deleted', 'c5-target-fe-order2-ledger', 'With the polar term deleted they also occur for Lemma 9.1 as stated (1/3 at h = 4; 2/3 at h = 2) and for the reflected branch with the K-loss alone deleted (7/9 at h = 4/3, not below 1/2); all are MODEL vertices with hypothetical deletions (row Z15b)'),
 ('"Non-multiplicative controls show no common row component; multiplicativity produces the signal"', 'c5-thin-propd-dichotomy', 'Refuted by two non-multiplicative weights with large Mertens-type sum: the component is linear in that sum for every sign weight. The row moment does not decide Proposition D (row Z25)'),
 ('Claim A: r3\'s "G = 0, l = 2" vertex has an empty rescaled term; "low input at h = 3 is equivalent to GRH for the family"', 'c5-marks-circularity-order2', 'The vertex is geometrically consistent at (0, 4, 2) and is removed only by rejecting G = 0 beyond b = ly/2. The equivalence is replaced by the chain GRH => (N) => (R) with (R) => GRH open (`c6-marks-bc-manuscript-check`; rows Z24, Z26)'),
 ('Summary: "any theta < 1 forces chi = n^(-i alpha)"; "zeros of the twisted series right of sigma_0 are those of L(s, psi)"', 'c5-twisted-helson-arcs', 'The first holds only under limsup abs(S(x))/x > 0 (otherwise the strict form is the strip statement, P14); the second is exact only for real chi (row P51). No PROVED step failed'),
 ('Corollary of Theorem 2: a real zero b in (theta, 1) satisfies b(1 - b) <= 10 theta', 'c5-repair-engine-map-r4', 'Holds for the largest real zero only (row P46, section 4 entry 49)'),
 ('"Numerator 1 - T Yu q^(-1/2) U + O(1/q) (64 exact cases)"; "a product that converges absolutely for Re w > 0"; Lemma 2 cocycle formula labelled PROVED', 'c6-gl3-cover-epsilon-cocycle', 'The numerator shape holds in one parity class of one label; the bracket has no absolutely convergent product (local reading only); the cocycle formula is wrong when a, b or a + b is 0 (unramified twists have epsilon factor 1). Lemma L and the r = 2 conclusion stand (row Z23)'),
 ('"No consistent model vertex with h > 1"; Lemma D(b) (necessity of K + D)', 'c6-unreflected-marks-kd23', 'Not shown: vertices with 1 < h <= 3 are underived, and the positivity step of Lemma D(b) is not established. The measurement (no (KD)^(2/3) term; random rows pass the same test) and the two kernel identities stand'),
 ('"h_pair > 1 occurs only with range losses deleted / with at least the K-loss and the Gram excess deleted"', 'c6-pair-probe-bridge-order2', 'False: the Gram excess deleted alone (69/80 at h_pair = 21/20) or the K-loss alone (tie at 31/36) suffice; the verdict is unchanged (row Z15c)'),
 ('"Joint eigenspaces of the T_p are finite-dimensional"; Theorem H2 (b) for finite-order nebentypus; "phi continuous and injective" remark', 'c6-square-intertwiner-weyl', 'False on L^2 with all K-types (harmless); H2 (b) is written for trivial nebentypus (twist repair noted); the injective-phi remark needs the lambda_p in a compact set (rows G27 to G30)'),
 ('Lead "square realisation with a point-spectrum intertwiner: never run by this campaign"', 'campaign/STRATEGY.md section 3.1 (planner)', 'Already run by `res-point-spectrum-square` before the campaign; `c6-square-intertwiner-weyl` added Theorem H2 and the Casimir class'),
 ('Lemma S (iii): "no zero has Re rho >= max(B, 2/3)"; "the unconditional conclusion stops at 2/3" read as sigma_0 = 2/3 admissible', 'c6-marks-bc-manuscript-check', 'Boundary: no zero with Re rho > B and Re rho >= 2/3. (2.2) holds for every sigma_0 > 2/3 after enlarging S and fails at 2/3 exactly; the Landau-lemma disc radius in the proof of Lemma S needs a larger constant (REFEREE2.md; no conclusion changes)'),
]
lines = t.rstrip('\n').split('\n')
assert lines[-1].startswith('| ') and lines[-1].count('|') == 4, lines[-1][:80]
for c, l, k in S7:
    assert '|' not in c + l + k
    lines.append('| %s | %s | %s |' % (c, l, k))
t = '\n'.join(lines) + '\n'
edits.append('section 7: %d entries for rounds 5 and 6' % len(S7))

# ---------------------------------------------------------------- header update line
m = re.search(r'^Update 2026-11-18, fourth \(`c6-repair-referee-debts-r5`\).*$', t, re.M)
assert m
upd = ('\n\nUpdate 2026-11-18, fifth (`c7-repair-engine-map-r6`): rows owed from campaign rounds 5 and 6. Added: P50 (degree-2 positive forms, pointwise), P51 (additive-twist discrepancy; the lane\'s label P44 was taken), '
       'G27 to G30 (square intertwiners; lane labels A3-C1, A3-C2, A3-C3, A3-R), Z15c (pair probe), Z23 (double-cover cocycle, wording narrowed by its referee), Z24 (normaliser cap at 2/3; two referees), '
       'Z25 (Proposition D for THIN, not decided), Z26 (long marks at h = 3 with the corrected chain); a note in row Z15; updates of section 6 items 1, 9, 18, 21, 22; twelve rows of section 7 for rounds 5 and 6. '
       'Not entered: the row proposed by `c6-unreflected-marks-kd23` (its referee does not hold two headline sentences; the measurement is cited in section 7 only).')
t = t[:m.end()] + upd + t[m.end():]
edits.append('header update line')

open(PATH, 'w', encoding='utf-8').write(t)
json.dump(dict(linesBefore=n0, linesAfter=t.count('\n'), rowCount=cnt, edits=edits), open(os.path.join(HERE, 'map_edits.json'), 'w'), indent=1)
print(n0, '->', t.count('\n'), 'lines;', len(edits), 'edits;', cnt)
