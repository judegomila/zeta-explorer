# REFEREE: c5-angular-family-absorption (adversarial, lens: general) 2026-11-18

Verdict on the claimed verdict (precise obstruction): **holds, with four corrections.** One formula labelled
PROVED (Proposition 5) is wrong in its error term; the conclusion drawn from it survives with the corrected
formula. No statement about zeros is made, RH is not assumed, verified height is not used.
Flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false (agree with the lane).

Referee runs (local, `scripts/memcap.sh 8`, `.venv-arb` python, largest planned array 320 MB; scripts kept outside
the lane directory in /tmp/ref_c5, not part of the record).

## 1. Steps re-derived

| Step | Label in RESULT | Referee |
|---|---|---|
| 3.1 kernel = Omhat_K(6 arg(sc)) | PROVED | Confirmed (one line: lambda^(6k)(s) lambda^(6k)(c) = e^(6ik arg(sc))). |
| Lemma 1 root number +1 | PROVED | Confirmed. Dual lattice of O under Re(x conj y) is (2/sqrt 3) i O (checked on the basis); covolume sqrt(3)/2; Fourier transform of P e^(-pi c x^2), c = 2t/sqrt 3, is i^(-6k) c^(-1-6k) P(xi) e^(-pi xi^2/c); factors combine to Theta(t) = t^(-(6k+1)) Theta(1/t); Mellin variable w = s + 3k maps to 6k + 1 - w = (1 - s) + 3k. The completed function needs (sqrt 3/2 pi)^(s+3k), a constant multiple of the one written. This is Hecke's theorem (CLASSICAL), not new. |
| Lemma 2 (Froehlich-Queyrut) | RECALLED | Statement is the known theorem; consistency check (-1)^k (-1)^k = 1 confirmed. Not used beyond W = 1. |
| Lemma 3 | PROVED | Confirmed, but it is a tautology: the row transform acts on k only and leaves the coefficient of c unchanged. See 2(c). |
| Prop 4 | PROVED-sketch | Confirmed. Gamma ratio gives (3 abs(k) + abs(t))^(1+2A) on Re v = -A; A_k << abs(k) (k^2/Y)^A / Y. |
| Prop 5 | PROVED | Angle bound 3 sqrt(3)/sqrt(N) confirmed; "sc rational iff s = conj(c) t" confirmed for squarefree c without rational prime factor; main formula for that subset confirmed. **The parenthetical "(1 + lower-order terms from rational factors of c)" is false.** See 2(a). |
| Thm 6 (a) | PROVED | Arithmetic confirmed. The bound sum_k abs(B_k)^2 <= C (K + Z) for bounded coefficients loses a factor log Z: pairs (c, c') on a common ray number about Z log Z, giving K log Z. Exponents unchanged. |
| Thm 6 (b),(c),(d) | MODEL / PROVED | Bookkeeping confirmed: (1 + kappa)/2 for K <= Y, 1/2 + kappa - ly/2 for K >= Y; (d) forces ly >= 1 and kappa >= 1. |
| Thm 7 (i)-(iii) | PROVED for three families | (i)-(iii) follow from the kernel form; the quadratic case relies on `ap-order-two` Lemma 0, not re-derived here. |
| Thm 7 (iv) | PROVED | Not a theorem in the form written: "with Cauchy-Schwarz, the large sieve, convexity, the functional equation and the row transform the abscissa is >= 1" has no defined set of admissible derivations in this file. Should be labelled ARGUED (or point to the formal estimate system of `r3-method-limit`). |

## 2. Errors and overstatements

(a) **Proposition 5, error term.** For squarefree c = m c* (m the maximal rational divisor), sc is rational iff
s = conj(c*) t, so c enters with weight N(c*)^(-1/2), not Nc^(-1/2). The Dirichlet series of the full on-ray sum
has Euler factors 1 - 2 p^(-v-1/2) + p^(-2v) (p split) and 1 - p^(-2v) (p inert). It factors, for Re v > 1/10, as
(1/zeta_F(v + 1/2)) (L(2v, chi_(-3))/zeta(4v)) prod_(p split)(1 + 2 p^(-3v-1/2)) H(v); the third factor has a pole
at v = 1/6 and 1/zeta(4v) has poles with Re v < 1/4. These are not lower order than the term kept
(Z^(beta - 1/2), which is Z^eps under GRH). Referee run, a(n) by multiplicative sieve, bump weight on (Z, 2Z):

    Z        S_res (c without rational factor)   S_full     rational-factor part
    1e3      -0.259                              -0.699     -0.439
    1e4      -0.080                              -1.120     -1.040
    1e5      -0.040                              -1.642     -1.602
    1e6      +0.100                              -2.684     -2.784
    1e7      +0.344                              -1.245     -1.589

The omitted part is 2 to 40 times the retained part at every Z tested. Corrected statement: ray term =
K^(1/2) Y^(-1/2) Z^(-1/2) S_full(Z) with S_full of size at most Z^(max(beta - 1/2, 1/4)) up to Z^eps; ratio to the
Cauchy-Schwarz level is Z^(-1/2) S_full <= Z^(max(beta - 1, -1/4) + eps). The conclusion "net gain 0, detection
only for beta >= 1" survives. The sentence "the Moebius sum appears at shift 1/2" is incomplete: it appears
together with terms not governed by zeros of zeta_F (growth rate of S_full not determined by the referee run;
the data are consistent with slow growth, not with a clean Z^(1/6) law).

(b) **Section 2, "equivalently psi(conj(a)) = psi(a)^(-1)".** That condition is triviality on norms from F, an
index-2 subgroup of the ideles of Q modulo Q^*. Characters whose restriction to Q is chi_(-3) also satisfy it and
their root numbers are not identically 1 (Rohrlich-type sign depending on the weight). They are outside the lane's
family; the word "equivalently" should go. The obstruction is unaffected (their sign is still a periodic function
of the family parameter and contains no factor depending on c).

(c) **Scope of "absorption fails".** In this probe c is never a conductor: both s and c are arguments of
lambda^(6k), so the absence of a Gauss sum is a property of the construction, and Lemma 3 covers only the transform
in the row variable k. It does not cover a transform in the c variable for automorphic b_c (Voronoi in c twisted by
lambda^(6k)); that case is asserted in the Consequence paragraph without argument. The claim is established for
"transforms in the row variable of group families", which is what Theorem 7 states, not for every second
representation.

(d) **checks.log N6 label.** "ideals with a generator in Z + fO" = element count / 2 (units of the order are +-1),
not / 6; the non-integer outputs (387.67, 200.67, ...) show it. For f = 101 the ideal count is 63, not 21. RESULT.md
words it as "elements divided by 6", which is accurate; the lattice prediction carries the same factor. No proof
step uses it.

(e) **Summary line "for arbitrary coefficients (measured to 1e-12)".** The lane's measurement used x = mu only.
The referee run below supplies an arbitrary-coefficient case.

(f) Novelty. Lemma 1 (Hecke), Lemma 2, the transition at k of order sqrt(Y) (analytic conductor), and the
Epstein/DH remark are classical. The lane presents them with labels and does not claim them as new. Remark 8 is a
reading, not used.

## 3. Numeric reruns (different cases)

* Lemma 1: k = 5, t = 1.37 and k = 7, t = 0.55 at 50 digits: Theta(1/t)/(t^(6k+1) Theta(t)) - 1 = 8.8e-50 and
  -2.8e-50.
* Prop 4 / N3 with other parameters and non-multiplicative coefficients: Y = 9000, Z = 3000, x_c = random
  unimodular phase depending on Nc (seed 7; 32634 and 10872 lattice points). abs(A_k) <= 4e-11 for k <= 80
  (k/sqrt Y <= 0.84), 8e-6 at k = 120, 5.8e-3 at k = 150. With the Gaussian weight Om(x) = e^(-x^2): probe minus
  k = 0 row = 1.6e-11 (K = 5), 2.4e-11 (K = 20), 2.2e-4 (K = 60), 5.3e-3 (K = 100), 0.36 (K = 1000). The identity
  holds for arbitrary coefficients below the transition; with a non-compact weight the departure starts at smaller
  K/sqrt(Y) than in the lane's Fejer run, as expected from the tail.

## 4. Controls

The lane claims no zeta-only mechanism, so there is nothing for a control to fail. Checked instead that the
identities are coefficient-blind: the rerun above uses coefficients with no multiplicative structure and Prop 4
holds identically. This confirms the lane's own statement that THIN and the signed twist pass every step. The
Epstein (DH) remark is correct as an identity (sum_psi conj(psi(g)) L(s, psi) = abs(G) zeta_g(s)); it names a step
of an architecture that produces no estimate, so it does not establish R3.

## 5. Requirement flags (referee)

* R1 false: every identity and ledger line holds for arbitrary bounded coefficients (confirmed numerically).
* R2 false: no estimate, hence no height-uniform or every-window statement.
* R3 false: no control is separated from zeta at any step that produces a bound.
* R4 false: unconditional ledger abscissa >= 1; the model ledger takes its conclusion as input.

## 6. What survives

For the angular family lambda^(6k) over Q(sqrt(-3)) and for ring-class characters: the transform in the family
variable is Fourier inversion on a compact group with kernel depending only on the class of sc; root number +1
(classical); for K <= Y^(1/2 - eps) the probe equals its k = 0 row for arbitrary coefficients; in the ray regime
the on-ray sum, with the corrected weight N(c*)^(-1/2), is at most the Cauchy-Schwarz level, so no gain; the
Cauchy-Schwarz ledger gives abscissa >= 1 for all K, Y (with a log Z in the large-sieve line); the model ledger
(1 + kappa)/2 contains its conclusion. Theorem 7 (iv) and the abstract-family row are argued, not proved. Nothing
about zeros of zeta.
