# c19-u4-joint-prime-phase-quadratic-dp-zeros: RESULT

Date 2026-11-19. Round 19, attack, kind explore, R4 direct. Cell U4 residual: the read left open by
`c18-u4-group-law-left-of-one-torus-orbit` (section 5, item 3): inequalities quadratic in the log-derivative,
or reading phases p^(-it) at several primes jointly; combined with the truncation identity of
`c18-tz-one-sided-bound-fe-reserve-bridge` (Theorem A, constant as corrected by its referee, E1).
Unrefereed (referees = 0). No server unit was started (stage A did not pass; see section 3).

**Verdict: precise obstruction. No statement about zeros of zeta is made.** Stage A stops the lane: the
candidate is passed at every step by E_a, DEL and the Liouville twist. The one pivot (joint phases) ends in a
transfer theorem and a blindness statement. Flags: R1 = R2 = R3 = R4 = false.

[Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, from REFEREE.md E1: the Liouville twist does not pass step (2) of candidate (J). For a completely multiplicative eps, Lambda_eps(p^k) = eps(p)^k log p, so for Liouville the cross product Lambda(p^j) Lambda(q^k) = (-1)^(j+k) log p log q is negative whenever j + k is odd. First failing atom n = 12 = 3 * 4: mu_cross(12) = 2 Lambda(3) Lambda(4) = -2 log 2 log 3 = -1.523; also 18, 20, 28 for P up to 30 (recomputed by the referee). The lane's check used P = 10, where the only cross atom is 6 = p q. Liouville passes step (2) only for P <= 12 and fails at p q^2 for larger P; among sign chains only eps = +1 passes at every P. Read 'E_a and DEL' in place of 'E_a, DEL and the Liouville twist' in the verdict. The stage-A stop and the verdict (precise obstruction) are unchanged: E_a and DEL pass every step carried out and HQ2 passes at each P. The member with all atoms in phase with the opposite sign is 1/zeta (Lambda = -Lambda_zeta; no functional equation of zeta's type; poles in the strip), a weaker control. Map row G45.]

Labels: PROVED (argument in this file, elementary) / PROVED-rel (relative to a result on file) / CLASSICAL
(recalled, not opened) / CHECKED (`checks.py`, float64, local through `scripts/memcap.sh 8`; not ball
arithmetic) / ARGUED / OPEN.

Sources read: BRIEF to the end; the two c18 lanes above with their REFEREE files;
`c18-exact-relation-rigidity-klein-spinor` (control HQ2, Propositions I, F, Lemma Q); map section 2 (controls,
Lemmas P, F, the three questions); STRATEGY entry test (Q-P, Q-B, Q-S, Q-A).

## 0. Summary of what is established

1. **Lemma Q2 (second-order truncation identity; PROVED-rel Theorem A (b), CHECKED to 1e-9).** For every
   Dirichlet series F with a_1 = 1, integer P with a_P != 0, D_P its partial sum with simple zeros beta,
   w_beta = beta - 1/2, u = log P, phi smooth with support in (0, u), phihat(w) = int phi(x) e^(wx) dx:

       sum_{n<P} Lambda_F(n) n^(-1/2) phi(log n)    = - sum_beta phihat(w_beta),
       sum_{n<P} Lambda_{2,F}(n) n^(-1/2) phi(log n) =   sum_beta phihat(w_beta) D_P''(beta)/D_P'(beta),
       D_P''(beta)/D_P'(beta) = -u + 2 lim_T sum_{beta' != beta, abs(Im beta') < T} 1/(beta - beta').

   Lambda_2 = Lambda log + Lambda * Lambda (coefficients of F''/F). The weight D''/D' at a zero is twice the
   field induced at the vortex beta by all other vortices, minus the background u. No multiplicativity is used.
2. **Lemma N (PROVED).** If the coefficients of F^(k)/F (times (-1)^k) are non-negative for one k >= 1, then
   a(n) >= 0 for all n. So every inequality obtained from positivity of a polynomial in the log-derivative,
   together with zeta's functional equation and the pole clause, lies in the identification class of Theorem P
   (row P56). No multiplicativity.
3. **Candidate (J), cross-prime positivity of the pair form (section 2).** True for zeta. Its multiplicative
   step is a relation between different primes. Stage A: sign chains fail at a cross atom p q; T-NR at q^2 p
   (c > 2) or q p (c < -2); **E_a, DEL and the Liouville twist pass every step.** Stop.
   [Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, REFEREE.md E1: sentence to use: 'Stage A: sign chains fail at a cross atom p q; the Liouville twist at p q^2 (P > 12); T-NR at q^2 p (c > 2) or q p (c < -2); E_a and DEL pass every step. Stop.']
4. **Pivot, joint phases (section 4).** Theorem K1 (PROVED, Kronecker and Hurwitz): at fixed P every
   statement about the zero set of D_P that holds at all heights and is stable under locally uniform limits
   holds for every unimodular completely multiplicative chain. Lemma K2 (PROVED): in abs(tau) <= T at most
   1 + 2 T log P/(pi (1 - 4 delta)) of the 2^pi(P) sign patterns are delta-emulated, so in the coupled regime
   T = P^(1/theta) this mechanism covers a vanishing fraction. Proposition K3 (PROVED): at P = t^theta the
   data D_P are identical for zeta and for zeta(s)(1 + q^(b - s)), q > P, which vanishes on Re s = b in every
   window of length 2 pi/log q; with the exact functional equation added, for HQ1(q), q > P (c18 Proposition F).
   A statement on the zeros of D_P alone therefore decides nothing at height t; the step that could is the
   functional equation at height t, and with INT it is Hamburger's identification.

## 1. Entry test (answered before stage A)

- **Q-P** (Lemma P; does T-NR satisfy every hypothesis?). The step of (J) is a sign condition on products
  Lambda_G(p0^j) Lambda_G(p^k) with p != p0. It is not a linear identity (S1), not a dilation-invariant cone
  condition in F (S2: it is quadratic in log F), and it couples p0 to the other primes (not S3). Lemma P does
  not apply; T-NR is checked directly and fails (section 3).
- **Q-B** (Blaschke stability of a scattering coefficient). Not posed on a scattering coefficient. No.
- **Q-S** (symmetric multiplier). (J) in atom form is not stable under a symmetric multiplier: ZQ adds an
  absolutely continuous density to Lambda. A smoothed form of (J) with a margin would be stable; none is used.
- **Q-A.** Yes, both clauses: (J) reads prime-power support (the cross measure is defined through the Euler
  product) and a sign with zero margin. So ZQ and NR-q do not pass, and the step type is X1 (sign of
  log-level atoms). Expected consequence, confirmed in stage A: controls with Lambda >= 0 pass.

Expectation recorded before work: R1 possibly true in the weak sense "failing step for chains is cross-prime";
R3 false (E_a); R2, R4 false.

## 2. First lemma and the candidate

### 2.1 Lemma Q2

Proof. Theorem A (a) of the tz lane: the logarithmic coefficients of D_P and F agree for n <= P; the same holds
for F''/F = (F'/F)' + (F'/F)^2. Theorem A (b) with the referee's constant: D_P'/D_P(s) = -u/2 + lim sum
1/(s - beta). Hence D_P''/D_P = (D_P'/D_P)' + (D_P'/D_P)^2 has simple poles at simple zeros with residue
D_P''(beta)/D_P'(beta) = 2 g_beta(beta), g_beta = D_P'/D_P - 1/(s - beta), which gives the third line. The
inverse Laplace transform of 1/(w - w_beta) is e^(w_beta x) on x > 0; the constants give point masses at 0,
outside the support of phi. Zeros lie in a vertical strip and phihat decays faster than any power of Im w, so
the sums converge absolutely. In operator form (d the generator of the truncated shift on L^2[0, u], spectrum
empty): A_P = u/2 - sum_beta (d - w_beta)^(-1), and the pair terms are the resolvent identity
(d - w)^(-1)(d - w')^(-1) = ((d - w)^(-1) - (d - w')^(-1))/(w - w'). QED.

CHECKED (`checks.json`; zeros by Newton from a grid, list complete by winding number in all 8 runs; T = 120):

| series | P | zeros = winding | right of 1/2 | first-order defect | second-order defect |
|---|---|---|---|---|---|
| zeta | 6 | 68 | 20 | 1.4e-12 | 1.2e-11 |
| zeta | 10 | 88 | 28 | 8.4e-10 | 1.6e-9 |
| zeta | 14 | 100 | 38 | 4.9e-10 | 7.0e-10 |
| sign chain eps(3) = -1 | 10 | 88 | 32 | 4.8e-10 | 1.1e-9 |
| sign chain eps(2) = eps(5) = -1 | 12 | 96 | 24 | 7.5e-10 | 8.9e-10 |
| Liouville | 10 | 88 | 28 | 5.9e-9 | 5.0e-7 |
| E_a, a = 0.2 | 10 | 88 | 64 | 9.2e-12 | 1.7e-11 |
| non-multiplicative (1, 1, -1, 2, 0.5, 1, 1) | 7 | 74 | 36 | 1.1e-12 | 1.5e-12 |

The identity holds for the non-multiplicative series as for zeta. Left sides are of size 0.2 to 5.

### 2.2 Lemma N

F^(k) = F (F^(k)/F) gives a(n) log^k n = c_k(n) + sum_{d | n, 1 < d < n} c_k(d) a(n/d), with c_k the
coefficients of (-1)^k F^(k)/F and a(1) = 1. Induction on n. The same recursion holds for measures on [1, inf)
with an atom at 1. QED. Consequence: {zeta's functional equation, pole at 1 only, finite order, Lambda_2 >= 0}
is contained in the hypothesis set of Theorem P, which forces G = r zeta without multiplicativity.

### 2.3 The candidate (J)

Let G = prod_p G_p be an Euler product (step M), Lambda_G = sum_p Lambda_p its log-level measure. Then
Lambda_{2,G} = sum_p Lambda_{2,G_p} + mu_cross, mu_cross = 2 sum_{p<q} Lambda_p * Lambda_q, supported on
integers with exactly two prime factors. For zeta, Lambda_{2,zeta_p}(p^k) = (2k - 1) log^2 p. By Lemma Q2:

    (J)   J_P(phi) := sum_beta phihat(w_beta) D_P''(beta)/D_P'(beta)  -  sum_{p^k < P} (2k-1) log^2 p  p^(-k/2) phi(k log p)  >=  0
          for every phi >= 0 smooth with support in (0, u), u = log P, P = t^theta, zeros beta of D_P.

For a general Euler product the subtracted term is its own one-prime part, so that (J) reads only products
Lambda_G(p^j) Lambda_G(q^k), p != q.

- **Step M (multiplicative; a relation between different primes).** J_P(phi) = 2 sum_{p<q} sum_{j,k}
  Lambda(p^j) Lambda(q^k) (p^j q^k)^(-1/2) phi(j log p + k log q), and each product is >= 0. The step uses the
  factorisation over coprime parts (to isolate mu_cross) and the relative sign of the atoms at two primes. It
  does not use the sign at one prime: among sign chains exactly eps = +1 and eps = -1 (Liouville) pass.
  [Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, REFEREE.md E1: false for eps = -1. The products at prime powers carry the sign (-1)^(j+k); among sign chains only eps = +1 passes at every P, and Liouville passes only for P <= 12. The step still does not read the sign at one prime in isolation: the opposite-sign member that passes is 1/zeta.]
- **Step F (functional equation; not completed).** Passing from the zeros of D_P to the zeros of G needs the
  second-order explicit formula: sum over zeros rho of phihat(rho - 1/2) xi''(rho)/xi'(rho), the double pole at
  1 and the archimedean term. Under the target this zero side is a sum of divided differences of abs(g)^2 over
  pairs of ordinates, which has no sign (ARGUED). No statement about the zeros of G follows from (J), and (J)
  with the functional equation and the pole clause is an identification by Lemma N when the one-prime signs are
  read, by Hamburger when INT is read.

(J) is not the target. It is true for zeta (PROVED, trivially).

## 3. Stage A: controls (paper; sign tables CHECKED)

Steps: (1) Euler product, so that mu_cross is defined; (2) mu_cross >= 0; (3) Lemma Q2 (holds for every
series); (4) step F.

| control | first failing step, or pass |
|---|---|
| HQ2 (q, eps) | q > P: D_P is zeta's; passes (1) to (3); fails only the pole clause inside (4) (order-4 poles on the line). q <= P: Lambda_HQ(q^j) >= 0 for j < J(eps), first negative at j = 8, 13, 22 for eps = 1, 0.1, 0.01 at q = 3 (CHECKED); fails (2) at the cross atom q^J p only if 2 q^J < P. For each P a member passes (1) to (3) |
| ZQ | fails (1): Lambda plus a density, not prime-power supported (zero margin, Q-A). On the atoms it is zeta. The sign of the mixed term Lambda * D was not computed (ARGUED indefinite) |
| E_a (own zeros) | **passes (1), (2), (3)**: Lambda_E(p^k) = (p^(ka) + p^(-ka)) log p > 0. Fails only a size or pole clause in (4) |
| multiplicative sign chains | fail (2) at the cross atom p q, p in S, q not in S: coefficient -2 log p log q (CHECKED: Lambda_2 < 0 at n = 6 for eps(3) = -1). **Liouville (S = all primes) passes (1) to (3)**; lacks the functional equation [Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, REFEREE.md E1: false as written; Liouville fails (2) at the cross atom p q^2, first at n = 12 (coefficient -2 log 2 log 3), and passes (1) to (3) only for P <= 12] |
| T-NR (q, c) | fails (2): c > 2 at q^2 p (Lambda_T(q^j)/log q = 4.81, -7.52, 22.0, -53.6 at q = 3, c = 2.2); c < -2 at q p (all Lambda_T(q^j) < 0). The failing atom couples q with a second prime; the sign at q alone is not read |
| NR-q | fails (1) (frequencies log n + j log q, not INT); read on its own semigroup, fails (2) at q^2 p as T-NR |
| DH | fails (1): no Euler product; Lambda_DH is not supported on prime powers (first defect n = 6) |
| HEAT | fails (1): not an ordinary Dirichlet series (coefficient cocycle; n = 6) |
| THIN | a sign chain: fails (2) at p q, p in S, q not in S |
| DEL (added) | **passes (1), (2), (3)**: Lambda_F >= 0 with zeros on deleted primes; zero at b in (1/2, 1) |

Result: E_a, DEL and the Liouville twist pass every step that is carried out; HQ2 passes at each P. The
failing step of T-NR and of the sign chains is a cross-prime sign relation (this is what the pure cross form
buys over Lemma GL), but the read set of (J) is contained in "all atoms of Lambda in phase", which holds for
controls with zeros off the line. By the assignment the lane stops at stage A; the server test (zeta against
24 sign chains at t = 1e6, 1e9) was not run: its outcome is fixed by the table (chains with a flipped prime
below P/2 fail at p q; zeta passes) and it would not bear on E_a or DEL.

[Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, REFEREE.md E1: in the paragraph above read 'E_a and DEL pass every step that is carried out' (Liouville fails at p q^2 for P > 12), and 'the read set of (J) is contained in all atoms of Lambda in phase' in the sense all >= 0 or all <= 0 over the primes that occur; Liouville is not in that set. The outcome of the server test that was not run is fixed by the sign tables with this correction: Liouville fails once P > 12.]

## 4. Pivot (once): phases at several primes read jointly

Carrier: D_P(sigma + it) = Phi_P(sigma; (t log p)_{p <= P}), Phi_P the torus function; zeros of D_P are the
crossings of the Kronecker line with the zero set of Phi_P. For eps completely multiplicative and unimodular,
D_P^eps is Phi_P on the translated line (map note: a twist is a rotation of the torus).

**Theorem K1 (PROVED; Kronecker, Hurwitz).** Fix P, a compact set K and eta > 0. For every such eps there is a
relatively dense set of tau with sup_K abs(D_P^eps(s) - D_P(s + i tau)) < eta. Proof: unique factorisation
gives linear independence of the log p; choose tau with abs(p^(-i tau) - eps(p)) < delta for p <= P; then
abs(n^(-i tau) - eps(n)) <= delta log_2 P. Consequence: a statement about the zeros of D_P in a window that
holds at every height with constants independent of the height, and survives locally uniform limits, holds
for every chain. Uniformity in height at fixed P (R2 at a finite stage) and failure for sign chains (R3)
exclude each other.

**Lemma K2 (PROVED).** Let delta < 1/4. If tau emulates the sign pattern alpha on the primes up to P
(distance of tau log p/2 pi to alpha_p in {0, 1/2} below delta) and tau' emulates alpha' != alpha, then
abs(tau - tau') > pi (1 - 4 delta)/log P. So at most 1 + 2 T log P/(pi (1 - 4 delta)) patterns are emulated in
abs(tau) <= T, out of 2^pi(P). With T = P^(1/theta) the fraction tends to 0. This bounds the mechanism of K1
only; it does not show that the remaining chains differ from zeta in any stated property.

**Proposition K3 (PROVED; blindness of the stage).** For q prime, q > P, and any b: G_q = zeta(s)(1 + q^(b-s))
has D_P^G = D_P and zeros at b + i pi (2k+1)/log q. At height t with t^theta < q the data (t, D_{t^theta}) of
G_q and of zeta coincide while G_q vanishes on Re s = b within pi/log q of t. With the exact functional
equation, multiplicativity and coefficients >= 1: HQ1(q, c_q), q > P (PROVED-rel c18 Proposition F), which
differs from zeta by poles on the critical line.

**Reading (ARGUED).** In the coupled regime P = t^theta, K1 does not close the read and K3 shows that the read
cannot conclude by itself. What ties the phases at different primes at one height beyond the torus is that
arg n^(-it) = -t log n is a smooth function of n (Poisson summation in n), that is, the functional equation
at height t. For theta < 1/2 the approximate functional equation needs the atoms up to t/(2 pi P) > P, which
the stage does not hold. For theta >= 1/2 it gives Z(t) = 2 Re(e^(i vartheta) D_P(1/2 + it)) + O(t^(-1/4)) at
P = (t/2 pi)^(1/2), and a statement on the real zeros of that function in a window is the target in the window
(Theorem T of the c18 U4 lane; completion C1 of the tz lane, which needs no zero of D_P right of the line and
is false: 20 to 38 of 68 to 100 zeros lie right of 1/2 in the table above). No candidate inequality between
these two cases was found. The pivot ends here.

## 5. Requirement flags

- **R1 false.** Lemmas Q2 and N use a_1 = 1 only. Step M of (J) is a cross-prime relation and is the failing
  step for sign chains and T-NR, but (J) is implied by Lambda >= 0, and nothing about zeros is derived from it.
  Multiplicativity is not shown essential for any conclusion.
- **R2 false.** (J) holds for zeta at every t and P (trivially); no conclusion about zeros is drawn. K1 shows
  that height-uniform zero statements at fixed P are shared by all chains.
- **R3 false.** E_a, DEL, Liouville pass every step carried out; HQ2 passes at each P; ZQ, DH, HEAT fail at
  support, not at a cross-prime relation.
  [Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, REFEREE.md E1: read 'E_a and DEL pass every step carried out'. R3 stays false.]
- **R4 false.** Step F is not completed; K3 shows the stage data do not reach the line without the functional
  equation at height t, and with it the read is an identification (Hamburger; Theorem P via Lemma N) or the
  target in a window.

## 6. Proposed map row (not applied)

"U4 residual, quadratic and joint-phase reads (c19). Lemma Q2: sum_{n<P} Lambda_2(n) n^(-1/2) phi(log n) =
sum over zeros beta of D_P of phihat(beta - 1/2) D_P''(beta)/D_P'(beta), D''/D' = -u + 2 sum' 1/(beta - beta')
(every series with a_1 = 1; checked to 1e-9 at P <= 14). Lemma N: non-negative coefficients of F^(k)/F force
a(n) >= 0, so log-derivative positivity of any degree with FE and the pole clause is Theorem P. Pure
cross-prime positivity (J): sign chains fail at p q, T-NR at q^2 p or q p; E_a, DEL, Liouville pass; HQ2 passes
at each P. Theorem K1: at fixed P a height-uniform, limit-stable statement on zeros of D_P holds for every
unimodular chain. Lemma K2: at most 1 + 2T log P/(pi(1 - 4 delta)) sign patterns emulated below T. Proposition
K3: zeta(s)(1 + q^(b-s)), q > P, has zeta's D_P. Status: PROVED (elementary) / CHECKED float64; unrefereed.
Closed: do not look for a zero statement in sign relations between atoms at different primes, or in the zeros
of D_P at P = t^theta without the functional equation at height t."

[Correction entered 2026-11-20 by lane c20-repair-owed-record-r19-statement-o-v5, REFEREE.md E1, E3 to E5: the row is entered in `push/OBSTRUCTION_MAP.md` as G45 in the corrected form: 'sign chains fail at p q, the Liouville twist at p q^2 (P > 12), T-NR at q^2 p or q p; E_a and DEL pass; HQ2 passes at each P'; Lemma Q2 as a limit over heights with simple zeros assumed, CLASSICAL in content (second-derivative explicit formula of D_P), K1 as Bohr equivalence; the closing sentence limited to the pure cross form (J) and to sign conditions on atoms of Lambda_k; one referee.]

## 7. Three weakest steps

1. **Rows ZQ, DH, HEAT and the phrase "no sign under the target" are ARGUED.** The mixed term Lambda * D of
   ZQ was not computed; the cross measure of a non-atomic or non-Euler object is defined by convention. The
   second-order zero side (step F) was not written out with its pole and archimedean terms, and "divided
   differences have no sign" is a remark, not a classification of second-order positive forms.
2. **Lemma Q2 is checked in float64 at P <= 14, T = 120, one test function,** and rests on the Hadamard
   constant -u/2 (confirmed by the tz referee, not re-derived here) and on simple zeros. The Liouville row has
   defect 5e-7 against 1e-9 elsewhere (cause not identified; a pair of close zeros is the likely one). No run
   at P = t^theta with t = 1e6 or 1e9 was made; the zero-census lane had no directory when this was written.
3. **Scope.** "Quadratic in the log-derivative" is closed here for inequalities obtained from sign
   conditions on atoms of Lambda_2 or of its cross part. An inequality mixing A_P with the archimedean
   operator at second order (for example a Cauchy-Schwarz or commutator form using the reserve Lg - u) is not
   covered. K2 bounds one transfer mechanism; the dichotomy theta < 1/2 against theta >= 1/2 in section 4 is
   ARGUED from the approximate functional equation as recalled.

## 8. Files

`RESULT.md`; `checks.py`, `checks.json` (run: `scripts/memcap.sh 8 python3.14 checks.py`, about one minute);
`lanes.jsonl`. Incident: the first run wrote `checks.json` to the repository root (relative path); it was moved
into this directory and the script now writes next to itself. No server unit, nothing committed.
