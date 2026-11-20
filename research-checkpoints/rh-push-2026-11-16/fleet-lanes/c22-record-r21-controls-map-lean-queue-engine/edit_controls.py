"""c22-record-r21-controls-map-lean-queue-engine: add controls V6, THINxV6, CYC, NWM to engine/curated/controls.json
and their codes to CONTROL_CODE_RE of engine/build_graph.py. Previous files: engine/scratch/controls.pre-c22-record.json,
engine/scratch/build_graph.pre-c22-record.py. Idempotent."""
import json, os, re
B = 'tmp/research-2026-11-16'
p = os.path.join(B, 'engine/curated/controls.json')
d = json.load(open(p, encoding='utf-8'))
LANE = 'c22-record-r21-controls-map-lean-queue-engine'
new = {
 'V6': dict(
  name="V6: non-multiplicative unimodular series, f(n) = (-1)^(v_6(n)) (v_6(n) the largest k with 6^k dividing n), F(s) = zeta(s)(1 - 6^-s)/(1 + 6^-s). Members V10, V12, V30 of the same kind (base g: zeta(s)(1 - g^-s)/(1 + g^-s))",
  has="abs(f(n)) = 1 for every n; ordinary Dirichlet series on integer frequencies; partial sums (5/7) x + O(log x); meromorphic on C with the simple pole at 1 (residue 5/7); in Re s > 0 its zeros are exactly those of zeta (the factor has zeros at 2 pi i k/log 6 and poles at (2k + 1) pi i/log 6, all on Re s = 0); log F - log zeta = -2 sum over odd k of 6^(-ks)/k, so hypothesis H(a) holds (kappa(n) - Re l_f(n) >= 0 for every n >= 2: equal to 2/k at n = 6^k, k odd, and 0 elsewhere); F F*/zeta^2 = exp(-2A) with A a Dirichlet series with non-negative coefficients; every step (a) to (d) of Theorem 1 of c4-helson-discrepancy-zerofree and its conclusion (theta = 0+, c = 5/7)",
  lacks="multiplicativity (f(6) = -1, f(2) f(3) = 1; defect 2 at the coprime pair (2, 3)); an Euler product; log coefficients supported on prime powers (l_f(6^k) != 0); zeta's functional equation (the factor is not symmetric under s -> 1 - s); a zero off the critical line in the strip (it is not an off-line control)",
  kills="any step marked 'multiplicativity essential' that in fact reads the sign and size of the coefficients of log F relative to log zeta (Landau positivity on F F*/zeta^2; hypothesis H(a)), or unimodular coefficients together with a partial-sum discrepancy bound. R1 test of STRATEGY section 2: a flag is entered only if V6 fails the marked step",
  kw=r"\bV6\b|\(-1\)\^\(v_6",
  status="proved (closed form and H(a): elementary, re-derived by one independent referee; exact rational check on n <= 7776)",
  source="push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md sections 0, 2, 3 (Lemma 1 (iii), table row V6) and REFEREE.md (independent pass: holds with corrections E1 to E4; steps 3 and section 2 for V6, V10, V12). Entered by " + LANE,
  scope="control for the R1 test of Landau-type positivity steps; passes c4 Theorem 1 in full; says nothing about devices that read the functional equation"),
 'THINxV6': dict(
  name="THIN x V6: f(n) = eps_S(n) (-1)^(v_6(n)), eps_S the thin sign twist of control THIN on a set S of primes with 2, 3 not in S; F(s) = F_THIN(s)(1 - 6^-s)/(1 + 6^-s)",
  has="abs(f(n)) = 1 for every n; ordinary Dirichlet series on integer frequencies; hypothesis H(a) (a(p^k) = 2/k for p in S and k odd, a(6^k) = 2/k for k odd, 0 elsewhere); partial sums c x + O(x^theta) with c != 0 as for THIN; a real zero in the strip, the zero of THIN at s = b in (1/2, 1) (the factor (1 - 6^-s)/(1 + 6^-s) has no zero or pole in Re s > 0); every step of Theorem 1' of the source lane (c4 Theorem 1 with hypothesis H(a))",
  lacks="multiplicativity (defect at (2, 3), as V6); an Euler product; the functional equation; zeros at non-zero height off the zero set of zeta right of b (as THIN)",
  kills="as V6, and in addition any reading of a Landau-positivity theorem on the class H(a) as excluding zeros in the strip for unimodular members: the class contains a unimodular non-multiplicative member with a real zero in (1/2, 1)",
  kw=r"THIN x V6|THINxV6",
  status="proved-relative (H(a): elementary, Lemma 1 (iii) of the source lane; the zero is the THIN zero, proved relative to the THIN row of the map and MEASURED in c4-helson-discrepancy-zerofree; the product was not run by the source lane or its referee: referee E4)",
  source="push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md section 2 (Lemma 1 (iii)) and REFEREE.md E4; map section 2 row THIN. Entered by " + LANE,
  scope="companion of V6 with a real zero in the strip; not run numerically as a product"),
 'CYC': dict(
  name="CYC: cyclotomic telescoping product (Beurling-type): generalised primes of norms q_k = Q^(2^k), k >= 0, local parameter alpha_q = -q^(1/2); with w = Q^(1/2 - s): prod over k >= 0 of (1 + w^(2^k)) = 1/(1 - w) for abs(w) < 1, so the product of the local factors (1 - alpha_q q^-s)^-1 = (1 + w^(2^k))^-1 is 1 - w",
  has="an Euler product over a Beurling system with geometric degree-one factors and abs(alpha_q) = q^(1/2) (regime (K)); local pole lattices 1/2 + (2n + 1) pi i/(2^k log Q) whose union is dense on Re s = 1/2; convergence of the product only in Re s > 1/2; the sparsity hypothesis of Theorem W (sum over k of (log q_k)^(-gamma) finite for every gamma > 0) and every size hypothesis of Lemma P at the threshold kappa log 2 = 1 (lacunary ratio of log q exactly 2); meromorphic continuation to C (the product is 1 - w, entire; its reciprocal has simple poles at 1/2 + 2 pi i n/log Q only)",
  lacks="multiplicative independence of the norms (log q_j/log q_k = 2^(j-k) is rational; q_k^2 = q_(k+1), no unique factorisation); integer frequencies and rational primes; a natural boundary (the conclusion of Theorem W is false for it)",
  kills="any argument that derives a natural boundary, or a rigidity statement, from the position or density of the local pole lattices or from the sizes of the factors alone. Fails Theorem W at step 4 (a) only (Weyl equidistribution of n log q_(k0)/log q_k needs an irrational ratio; here the spikes cancel exactly)",
  kw=r"\bCYC\b|cyclotomic telescoping",
  status="proved (telescoping identity, elementary; re-derived by one independent referee; measured radial slope 0.000 at its pole points, 70 digits)",
  source="push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin/RESULT.md section 0 item 2, section 3 remark (v), section 5 table and MAP_ROW.md, with REFEREE.md (independent pass: holds with erratum E1, which concerns Theorem W step 3 and not CYC). Entered by " + LANE,
  scope="relative Euler products in regime (K); positive control (meromorphic) for the census of the dense remainder"),
 'NWM': dict(
  name="NWM: Newman-type symmetric multiplier, zeta(s)(1 + R(s)), R(s) = g(z) + g(-z), z = -i kappa (s - 1/2), g(z) = int_0^inf e^(zt) t^-t dt; for Re s > 1/2 + pi/(2 kappa): R(s) = 2 int_0^inf sin(r log r) e^(pi r/2) e^(-kappa (s - 1/2) r) dr",
  has="zeta's functional equation exactly; an entire multiplier; the pole of zeta at 1 and no other; a coefficient measure on real frequencies >= 0, absolutely convergent for Re s > max(1, 1/2 + pi/(2 kappa)); the bound abs(R) <= 2/(kappa abs(sigma - 1/2) - pi/2) outside the strip abs(sigma - 1/2) <= pi/(2 kappa); zeros off the line (kappa = 4: 0.947669 -+ 0.784676 i, measured, not enclosed)",
  lacks="integer frequencies; finite order (growth exp(exp(kappa abs t)/e) on the line); multiplicativity; a sign of the coefficient measure",
  kills="any step that reads the functional equation, the pole clause, entirety of the multiplier and boundedness on Re s >= 1/2 + d without reading integrality of the frequencies or a growth bound in the strip abs(sigma - 1/2) < d. Shows that in Hamburger's theorem with finitely many poles (Theorem H) the growth clause is necessary for real frequencies and that the exponent k < pi of Theorem H' is sharp there",
  kw=r"\bNWM\b|Newman-type symmetric multiplier",
  status="proved (bound and Laplace form; one independent referee holds with corrections E1 to E4); zeros measured at 40 to 50 digits, not enclosed",
  source="push/c21-br0-br3-hamburger-finite-poles-regime3/RESULT.md section 5 and MAP_ROW.md, with REFEREE.md (independent pass appended to the author's pass). Entered by " + LANE,
  scope="identification theorems of Hamburger type; not a control with integer frequencies (the question for integer frequencies without a growth clause is BR-3', open)"),
}
for k, v in new.items():
    d['controls'][k] = v
mark = 'V6, THINxV6, CYC, NWM added by ' + LANE
if mark not in d['about']:
    d['about'] += ' ' + mark + ' (round 22; owed list of round 21); the four codes are in CONTROL_CODE_RE of build_graph.py from that lane on.'
json.dump(d, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
for k, v in new.items():
    re.compile(v['kw'])
bp = os.path.join(B, 'engine/build_graph.py')
s = open(bp, encoding='utf-8').read()
old = "CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(NR-vec|NR-q|ZQ|SG|BLS|UNIV|HQ2|HQ3|HQ4|DH|"
newl = ("# V6, THINxV6, CYC, NWM added by " + LANE + " (curated/controls.json; owed list of round 21; THINxV6 before THIN).\n"
        "CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(NR-vec|NR-q|ZQ|SG|BLS|UNIV|HQ2|HQ3|HQ4|THINxV6|V6|CYC|NWM|DH|")
if 'THINxV6|V6|CYC|NWM' not in s:
    assert s.count(old) == 1
    s = s.replace(old, newl)
    open(bp, 'w', encoding='utf-8').write(s)
print('controls:', list(d['controls'].keys()))
