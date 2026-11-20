# c21-c4-r1-flag-test-lemma-e-hq-beurling: RESULT

Date: 2026-11-20. Kind: deepen (test of one requirement flag). Local runs only, through `scripts/memcap.sh 8`.
Labels: PROVED (argument in this note), EXACT (rational arithmetic), MEASURED (mpmath, 30 digits, n <= 3000), CLASSICAL.

Nothing here is a statement about a zero of zeta. No bound moves. This lane does not attack R4.
No file outside this directory was edited; the compute server was not used and no unit was started.

## 0. Verdict

**The R1 flag of `c4-helson-discrepancy-zerofree` is not kept.** Under the R1 test (version 6) both parts were
evaluated:

1. A named non-multiplicative control fails step (a): yes. Davenport-Heilbronn fails at n = 6,
   a_6 = -(f(6) - f(2)f(3)) = -1.0807009 (PROVED identity; MEASURED value).
2. No multiplicative control on file fails step (a): **false.** Eight on file fail it: HQ1, HQ2, HQ3, HQ4, G_q,
   T-NR (c > 2), NR-q (c > 2, multiplicative on its own semigroup), E_a; so does zeta(s+it)zeta(s-it), added by
   this lane. Each fails at a named prime power (table, section 3).

Independently of how the rule is read, step (a) does not need multiplicativity:

3. **f(n) = (-1)^(v_6(n))** (v_6(n) = largest k with 6^k dividing n) is not multiplicative (f(6) = -1,
   f(2)f(3) = 1), has |f(n)| = 1 for every n, partial sums (5/7) x + O(log x), and satisfies step (a) exactly:
   F = zeta(s)(1 - 6^-s)/(1 + 6^-s), H = exp(-2A), A = 2 sum over odd k of 6^(-ks)/k (PROVED; EXACT on n <= 1296).
   It meets every hypothesis of Theorem 1 except multiplicativity, and the proof of Theorem 1 goes through for it
   without change.
4. Theorem 1 holds on the class L = {F : f(1) = 1, Re l_f(n) <= kappa(n) for all n >= 2} (l_f, kappa the
   coefficients of log F and log zeta), which contains non-multiplicative members with real zeros in the strip
   (section 2, Theorem 1'). Step (a) reads a sign-and-size condition on the coefficients of log F relative to
   log zeta. Multiplicativity is neither necessary (item 3) nor sufficient (item 2) for it.

Consequence for the scoreboard (not edited by this lane): the headline "1 of 4, carried by
`c4-helson-discrepancy-zerofree`" loses its R1; on this file's reading the headline is **0 of 4**. Theorem 1
itself is not affected (it is confirmed and stated in a wider class).

## 1. Plan

New relative to the c4 lane and its referee: both recorded "(a) needs the Euler product with unimodular local
parameters; without it A does not exist". The second half is false: A exists for every F with f(1) = 1. The plan
was (i) write step (a) as a hypothesis on a general Dirichlet series; (ii) decide it by class on paper;
(iii) evaluate it at 30 digits on the assignment's list; (iv) search for a non-multiplicative F with A >= 0.
The first test decided the question; no pivot was made. Map rows read: section 2 (controls DH, TW-, EA, NR, NR-q,
HQ2, HQ3, HQ4, B, THIN, DEL), row P46. Sources read: c4 RESULT.md and REFEREE.md, c20 RESULT.md (Lemma E, table
of section 2), STRATEGY.md section 2.

## 2. First lemma: the hypothesis H(a) and the classes in which it holds

Notation. F(s) = sum f(n) n^-s with f(1) = 1 and f(n) = O(n^C). Then log F(s) = sum_{n>=2} l_f(n) n^-s converges
absolutely for Re s large (CLASSICAL). kappa(p^k) = 1/k, kappa(n) = 0 otherwise (log zeta). F*(s) = conj F(conj s).

**H(a).**  a_n := kappa(n) - Re l_f(n) >= 0 for every n >= 2.

Equivalently F F*/zeta^2 = exp(-2A) with A = sum a_n n^-s a Dirichlet series with non-negative coefficients
(log F + log F* has coefficients 2 Re l_f(n)). A exists for every F with f(1) = 1; H(a) is the sign of its
coefficients. For frequencies outside the integers the same definition is used on the frequency semigroup.

**Lemma 1 (PROVED).**
(i) f completely multiplicative, f(p) = alpha_p: H(a) holds iff |alpha_p| <= 1 for every p.
  Proof. l_f(p^k) = alpha_p^k/k and l_f = 0 off prime powers, so a_(p^k) = (1 - Re alpha_p^k)/k. If |alpha_p| <= 1
  this is >= 0. If alpha_p = r e^(i phi) with r > 1: there are infinitely many k with cos(k phi) >= 1/2
  (Dirichlet approximation of phi/2 pi), and r^k/2 > 1 for k large, so a_(p^k) < 0 for some k.
  Unimodularity is not needed (DEL has alpha_p in {0, 1}); |alpha_p| <= 1 is.
(ii) f multiplicative: l_f is supported on prime powers (F is multiplicative with f(1) = 1 iff log F is supported
  on prime powers), and H(a) is the family of local conditions Re [u^k] log F_p(u) <= 1/k. For a rational local
  factor prod (1 - beta_j u)/prod (1 - alpha_i u): Re(sum alpha_i^k - sum beta_j^k) <= 1 for all k. This fails for
  two unimodular parameters at one prime (zeta(s+it)zeta(s-it): 2 cos(k t log p) > 1 for some p, k), for a pole
  of the local factor with a parameter of modulus > 1 (HQ1 to HQ4, G_q, E_a), and for a local zero at a negative
  parameter (T-NR with c > 2); it holds for a local zero at positive parameters (T-NR with c < -2).
  Multiplicativity does not imply H(a).
(iii) f not multiplicative: H(a) holds iff the local-type conditions hold at prime powers and Re l_f(n) <= 0 at
  every n that is not a prime power. The members are exactly F = F_0 exp(-B) with F_0 multiplicative satisfying
  H(a) at prime powers and B a Dirichlet series supported off prime powers with Re b_n >= 0, B not 0. Examples
  (all checked, section 3): V6 = zeta(s)(1 - 6^-s)/(1 + 6^-s), f = (-1)^(v_6); P1 = zeta(s)(1 - 6^(b-s));
  P2 = zeta(s) exp(-6^-s); P3 = zeta(s)(2 - zeta(s + 1 - b)) (here -log(2 - zeta(w)) = sum_k (zeta(w) - 1)^k/k has
  positive coefficients at every n >= 2); THIN x V6: f(n) = eps_S(n)(-1)^(v_6(n)) with 2, 3 not in S.
  H(a) does not imply multiplicativity.

**Theorem 1' (PROVED; the proof of c4 Theorem 1 with one change).** Let F satisfy H(a), and let
sum_{n<=x} f(n) = c x + O(x^theta), c != 0, theta < 1. Let sigma_0 be the largest real zero of F in (theta, inf),
or theta if there is none. Then A converges absolutely in Re s > sigma_0, and
ord_F(s_0) + ord_F(conj s_0) = 2 ord_zeta(s_0) for Re s_0 > sigma_0.
  Proof. Steps (b), (c), (d) of the c4 lane use only: H = F F*/zeta^2 is meromorphic in Re s > theta; H is real,
  analytic and non-zero at every real point right of sigma_0; A has non-negative coefficients (Landau). The change:
  in the class L the series A need not converge on Re s > 1 (T-NR with c < -2 has abscissa 3/2), so real zeros of F
  right of 1 are admitted in the definition of sigma_0; on the real ray H = |F|^2/zeta^2 away from s = 1 and
  H(1) = |c|^2. Real zeros of F cannot accumulate except at theta (F -> 1 as sigma -> inf). QED
  Checks: V6 (theta = 0, extra zeros on Re s = 0); P1 with b = 0.7 (theta = 0, c = 1 - 6^(b-1), zeros of the factor
  on Re s = b = sigma_0, none to the right); P3 with b = 0.1 (partial sums c x + O(x^b), c = 2 - zeta(1.9) =
  0.2502535649, PROVED by the divisor sum; real zero at sigma* = 0.8286472390 = sigma_0; no zero of the factor
  right of it since |zeta(w) - 1| < 1 there); T-NR q = 2, c = -2.5 (zeros of the factor on Re s = 3/2 = sigma_0);
  T-NR c = +2.5 violates the conclusion (zeros at 3/2 + (2k+1) pi i/log 2, no real zero) and fails H(a) at k = 1,
  as it must.

So Theorem 1 is a theorem about the class L. A completely multiplicative unimodular chi is one way to verify
membership.

## 3. Decisive test: H(a) on the controls

Runs: `ha_test.py` (mpmath, 30 digits, coefficients to N = 3000, log coefficients by the recursion
f(n) log n = sum_{d|n} Lambda_F(d) f(n/d); 20 s; < 50 MB) and `referee_check.py` (second method, exact Fractions,
N = 1296). For every object: max |a_n| > 0 (not identically zero), multiplicativity defect max |f(mn) - f(m)f(n)|
over coprime m, n, and the identity F F*/zeta^2 = exp(-2A) at s = 12 (relative error <= 9e-30 in every row).

| Control | Multiplicative | H(a) | Named reason (first failing coefficient) | Label |
|---|---|---|---|---|
| DH | no (defect 1.0807 at (2,3)) | fails | a_6 = -(f(6) - f(2)f(3)) = -1.0807009031; 461 negative a_n, n <= 3000. Also c = 0 (step (b)) | PROVED identity; MEASURED |
| Lemma E stage of DH, N0 <= 5 | yes (log supported on 2, 3, 4, 5) | passes | l(2) = xi, l(3) = -xi, ... all Re l <= kappa | MEASURED |
| Lemma E stage of DH, N0 = 6, 50, 1000 | no | fails | inherits a_6 = -1.0807 (1, 8, 160 negative a_n) | PROVED (stage log = truncation); MEASURED |
| Lemma E stage of zeta, N0 = 50 | yes | passes | a_n = kappa(n) for n > 50, else 0 | PROVED |
| HQ1 (q = 2; eps = 1 zeros on the line; eps = 5 off) | yes | fails | a_q = -eps q^(1/2) (-1.4142; -7.0711) | PROVED; MEASURED |
| HQ2 (q = 7, eps = 0.2) | yes | fails | a_(q^2) = -eps q = -1.4 | PROVED; MEASURED |
| HQ3 (5; 0.07, 0.31) | yes | fails | a_(q^k) = -c_k q^(k/2)/k < 0 for all k; a_5 = -0.5398 | PROVED; MEASURED |
| HQ4 (5; 0.07, 0.31) | yes | fails | same with c_k of HQ4; a_5 = -9.5409 | PROVED; MEASURED |
| G_q (q = 5; Proposition F) | yes | fails | HQ1 at eps = q^(1/4) + q^(-1/4) + 2: a_5 = -9.3112 | PROVED; MEASURED |
| T-NR (q = 2), c = 2.5, normalised by u | yes | fails | a_q = -c q^(1/2) = -3.5355; factor zero at a negative parameter | PROVED; MEASURED |
| T-NR (q = 2), c = -2.5, normalised by u | yes | passes | a_(q^k) = (gamma^k + gamma^-k) q^(k/2)/k > 0; its zeros lie on Re s = sigma_0 | PROVED; MEASURED |
| T-NR not normalised (leading term q^(s-1/2)) | yes | not posable | log H contains (2s - 1) log q: no Dirichlet series A | PROVED |
| NR-q (q = 1 + sqrt 2), c = 2.1 / -2.1 | generalised (semigroup with q) | fails / passes | a at q: -3.2629 / +3.2629 | PROVED; MEASURED |
| Beurling member (prime 3 replaced by pi), unimodular parameters | yes, on its semigroup | passes relative to zeta_B; fails relative to zeta | relative to zeta: a at pi^k = -Re chi(pi)^k/k, negative at k = 3 (-0.3172); frequency support | PROVED; MEASURED |
| Sign chains: Liouville; random +-1 | yes | passes | a_(p^k) in {0, 2/k}; Liouville then fails step (b) (c = 0) | PROVED; MEASURED |
| Unimodular twist: random phases; n^(-i 1.3) | yes | passes | a_(p^k) = (1 - cos k phi_p)/k; n^(-i alpha) fails step (b) | PROVED; MEASURED |
| THIN (greedy S, b = 0.9, 225 primes below 3000) | yes | passes | a_(p^k) = 2/k for p in S, k odd | PROVED; MEASURED |
| DEL (same S) | yes | passes | a_(p^k) = 1/k for p in S; parameters 0 and 1, not unimodular | PROVED; MEASURED |
| contraction, abs(alpha_p) = 1/2 | yes | passes | Lemma 1 (i) | PROVED; MEASURED |
| one parameter 1.2 e^(i pi/3) at p = 3 | yes | fails | a_(3^5) = (1 - 1.2^5/2)/5 = -0.048832 | PROVED; MEASURED |
| Theorem C product, read as E_a = zeta(s+a)zeta(s-a), a = 0.2 | yes | fails | a_p = 1 - p^a - p^-a < 0 at every prime (a_2 = -1.0192) | PROVED; MEASURED |
| zeta(s + it)zeta(s - it), t = 1.3 | yes (unimodular parameters, two per prime) | fails | a_2 = 1 - 2 cos(t log 2) = -0.2415 | PROVED; MEASURED |
| V6: f = (-1)^(v_6(n)) | no (defect 2 at (2,3)); abs(f) = 1 | passes | A = 2 sum_{k odd} 6^(-ks)/k | PROVED; EXACT |
| V30: f = (-1)^(v_30(n)) | no; abs(f) = 1 | passes | same with 30 | PROVED; EXACT |
| P1 = zeta(s)(1 - 6^(0.7-s)) | no (defect 3.505) | passes | A = sum 6^(k(b-s))/k; real zero of F at 0.7 | PROVED; MEASURED |
| P2 = zeta(s) exp(-6^-s) | no | passes | A = 6^-s | PROVED; MEASURED |
| P3 = zeta(s)(2 - zeta(s + 0.9)) | no (defect 2.32) | passes | every a_n > 0 (min 7.4e-4 at n = 2999); real zero at 0.8286472390 | PROVED; MEASURED |
| P4 = zeta(s)(1 + 6^(0.7-s)) | no | fails | a_6 = -6^0.7 = -3.5051 (sign of the non-prime-power log coefficient) | PROVED; MEASURED |
| zeta(s) - 2 * 6^-s (f = 1 except f(6) = -1) | no; abs(f) = 1 | fails | a_12 = -2 | EXACT |

Search for a non-multiplicative F with A >= 0 (assignment item). A greedy search over f: N -> {+1, -1} (f(n) = +1
unless H(a) forces -1; one forced deviation) returned, for the deviation f(6) = -1, the function (-1)^(v_6(n)) on
n <= 3000 (428 values -1; partial sums S(n)/n = 0.7147 at n = 3000 against 5/7 = 0.714286; EXACT check
max |S(n) - 5n/7| = 2.857 on n <= 1296), and for f(30) = -1 the function (-1)^(v_30(n)). Three simultaneous
deviations at 6, 10, 15 are infeasible at n = 30 for +-1 values. The closed form was then proved (section 2).

Not run (outside the assignment's list): HEAT, ZQ, SG, WT, theta^w, the phase-rotated transfer operator.

## 4. Application of the rule

R1 test (version 6): "recorded only when the lane names a non-multiplicative control that fails the marked step
and no multiplicative control on file fails it".

- Clause 1 holds: DH fails H(a) at n = 6. The reason is the sign of l_f(6) = f(6) - f(2)f(3) = +1.0807, not the
  presence of a non-zero l_f(6): P1, P2, P3, V6 have non-zero log mass off prime powers and pass; P4 (sign
  reversed) fails.
- Clause 2 fails: eight multiplicative controls on file fail H(a) (HQ1, HQ2, HQ3, HQ4, G_q, T-NR c > 2, NR-q c > 2,
  E_a), and so does the degree-2 unimodular product added here. All of them fail by a local sign or size condition at one prime or at
  every prime; none by a defect of multiplicativity.
- Narrow reading (only controls inside the hypothesis class "completely multiplicative, unimodular, ordinary
  Dirichlet series" count for clause 2): every such control on file passes (sign chains, unimodular twists, THIN).
  On this reading clause 2 holds, and the flag still fails, because V6 lies inside every hypothesis of Theorem 1
  except multiplicativity (abs(f(n)) = 1, c = 5/7, theta = 0+) and passes step (a) and the whole proof.

Result: flag not kept on either reading. What step (a) reads: Re l_f(n) <= kappa(n), i.e. POS and SIZE at the
level of log coefficients relative to zeta, and INT only through the comparison function (relative to zeta_B the
Beurling member passes). The sentence in c4 RESULT section 2 (a), "without an Euler product there is no A", and
the sentence in its REFEREE section 5, "without it A does not exist", are to be corrected to "A exists for every F
with f(1) = 1; its coefficients are non-negative iff Re l_f <= kappa".

## 5. Controls for this lane's own statements

Theorem 1' is a comparison theorem relative to zeta, as Theorem 1 was. It holds for THIN, DEL, V6, P1, P3 and for
a Beurling member relative to its own zeta function; it concludes nothing about zeta. No control is asserted to
fail a mechanism here, because no mechanism for a statement about zeta is proposed.

## 6. Requirement flags (this lane)

- R1 false. Established here: the step under test does not use multiplicativity (V6; Lemma 1 (ii), (iii)).
  Evidence: sections 2 to 4, `ha_test.log`, `referee_check.log`.
- R2 false. The order identity holds at every height; it is not a zero-free or every-window statement.
- R3 false. THIN, DEL, V6, P1, P3 and Beurling members pass every step of Theorem 1'.
- R4 false. Not attacked. Nothing is carried to the critical line.

Flag recorded for `c4-helson-discrepancy-zerofree`: R1 rejected by this file (second file on that flag; the
first, its REFEREE.md, accepted it in a restricted sense).

## 7. Three weakest steps

1. The decision combines a proof (V6 and Theorem 1': step (a) holds without multiplicativity) with a rule reading
   (which controls count for clause 2). The proof part does not depend on the reading; the count "eight
   multiplicative controls on file fail" does. The general multiplicative criterion in Lemma 1 (ii) is stated as a family
   of local inequalities, not solved in closed form.
2. Table instances are small or substituted: THIN and DEL use the greedy rule only below 3000 (225 primes), not
   the lanes' sets to 1e8 or 1e9; the Beurling member is a one-prime replacement (3 -> pi), not a
   Diamond-Montgomery-Vorhauer system; "the Theorem C product" was read as E_a (the c20 table's row); T-NR and NR-q
   were normalised by the monomial u to become series with f(1) = 1. Pass verdicts rest on the closed forms, the
   numerics confirm them on n <= 3000 only.
3. Theorem 1' and Lemma 1 were checked by the same agent with a second method (`REFEREE.md`); no separate agent
   refereed them. For P3 no non-real zero of 2 - zeta(w) with 1 < Re w < 1.7286 was located, so a non-zeta zero of
   a non-multiplicative member strictly between theta and sigma_0 at non-zero height is not exhibited (the real
   zero at 0.8286 is).

## 8. Files

- `ha_test.py`, `ha_test.log`, `ha_test.json`: the table (30 digits, N = 3000).
- `referee_check.py`, `referee_check.log`: exact rational second derivation and closed-form checks.
- `REFEREE.md`, `lanes.jsonl`.
- Compute: local, `scripts/memcap.sh 8`, interpreter `/tmp/g-chan-venv`; largest allocation below 50 MB; total
  run time about 40 s. Server not used.

## 9. Most valuable next step

Enter the correction in the record (c4 R1 = false; headline 0 of 4; Theorem 1 restated on the class L), and add
V6 to the control list as the non-multiplicative unimodular member: any later lane that marks a step
"multiplicativity essential" for a Landau-type positivity argument should be run against V6 and THIN x V6 first.
