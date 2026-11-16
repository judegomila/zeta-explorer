# Referee report: flow-euler-defect/RESULT.md

Date 2026-11-16. Adversarial referee. Claimed verdict: precise-obstruction.
Result of this review: **holds = false as stated.** Props. 1, 2(a), 2(b), 3 and O1 are confirmed. O3's proved
sentence is true but the conclusion drawn from it is false. O2 is true only for a definition of "E = 0" that is not the
defect defined in Prop. 2; for the defect as defined there is an explicit counterexample family. The overall
"no route to RH here" conclusion is not affected; two of the three stated reasons need to be restated.

## Confirmed

- **Prop. 1.** Re-derived the substitution v = u + log n; the n-th term is exp(t L^2) n^{-s} gamma_t(s - 2tL).
  Mellin transform re-derived: 4 int g(y) y^{s-1} dy = s(s-1) pi^{-s/2} Gamma(s/2) (valid for Re s > -2).
  Convergence bound is valid for n with sigma + 2|t| log n > -2; the finitely many remaining terms are finite because
  gamma_t is entire for t < 0, but the written bound does not cover them (minor gap, not an error).
  New numeric case t = -0.7, z = 3 + 0.4i: relative error 2.0e-3 / 8.1e-6 / 1.0e-8 at N = 30 / 100 / 300.
- **Prop. 2(a),(b).** Characteristic function and moment generating function of N(0, 2|t|) checked; Tonelli applies
  in (b) because the integrand is positive. New numeric cases t = -0.11 and t = +0.08 at z = 7 + 0.3i agree with the
  direct integral to working precision (20-25 digits).
- **Prop. 3, section 3 (DH).** Logic is correct. No step assumes RH; nothing restates verified height. No positive
  claim is made for zeta, so the DH control is vacuously passed. Lambda_DH finite and > 0 is plausible (DH zeros lie
  in a vertical strip) but, as the author says, not written out.
- **O1.** True and trivial: kappa_t is a property of the multiplier e^{t u^2}.
- **Two-point check.** New cases: a = 0.3, box |Re z| <= 120.3, |Im z| <= 6: 76 zeros by winding, 76 real. (Cases
  a = 1.5 and a = 7 were started but not completed within the time limit; no result for them.)

## Errors and gaps

**E1 (normalization, minor).** Section 0 defines Xi = xi/2. Section 1 then says "at t = 0 this is
xi = (1/4) gamma(s) sum n^{-s}". With xi = (1/2) s(s-1) pi^{-s/2} Gamma(s/2) zeta(s) the right side is xi/2. check.py
defines `xi` with the 1/4 prefactor (that is xi/2) while Prop. 2(b) writes xi(s+b)/2. Factor-2 inconsistency in text,
no effect on any claim.

**E2 (O2: the defect that is proved to vanish only at xi is not the defect defined in Prop. 2).**
For a general mixing law mu, F_mu = (1/4) sum_n n^{-s} E[ n^{-ia} gamma(s + ia) ]. The quantity c_n = mu-hat(log n) is
not a coefficient of F_mu in any expansion with a fixed gamma factor; the Gaussian case works only because
e^{t(v-L)^2} factors as e^{tv^2} e^{tL^2} e^{-2tLv}. So "c_n = cos(a log n)" for the two-point mixture is a label, not
a coefficient.
More seriously, the "also directly" argument needs |mu-hat(log 2)| = 1, which follows only if c is a character of the
group Q_+^*. The defect actually defined (kappa_t(m,n) for integers m, n, and the scalar E = |1 - c_6/(c_2 c_3)|)
vanishes on a one-parameter family that is not xi:

  Cauchy mixtures. mu_delta = Cauchy(delta), mu-hat(u) = e^{-delta |u|}, c_n = n^{-delta}. Completely multiplicative
  on the positive integers, so kappa = 0 and E = 0 for every delta > 0. Symmetric probability measure; F_delta(z) =
  int e^{-delta|u|} Phi(u) e^{izu} du is entire of order 1.

  F_delta has infinitely many non-real zeros for every delta > 0. Proof: two integrations by parts with Phi'(0) = 0
  give F_delta(x) = 2 delta Phi(0) / x^2 + o(x^{-2}) as real x -> infinity, so F_delta > 0 for large real x and has
  finitely many real zeros. F_delta is even, entire of order <= 1, tends to 0 on the real axis, so as a function of
  z^2 it has order <= 1/2 and is not a polynomial; it has infinitely many zeros. Numeric check: delta = 0.5,
  x = 20, 40, 80: F = 1.288e-3, 2.895e-4, 7.04e-5 against leading term 1.116e-3, 2.791e-4, 6.98e-5; delta = 0.1 gives
  2.43e-4, 5.79e-5, 1.41e-5 against 2.23e-4, 5.58e-5, 1.40e-5. (Xi(x) itself is 1e-5 .. 1e-24 there.)

So the statement in the claim summary, "the E = 0 locus among symmetric mixtures is the single point xi", is false for
the cocycle defect and for the scalar E. What survives: (i) the Hamburger form (F_mu = gamma(s) D(s) with D an
ordinary Dirichlet series with polynomially bounded coefficients forces mu = delta_0; the growth hypothesis holds for
every probability mu since |mu-hat| <= 1 gives |F_mu(z)| <= Xi(i |Im z|), which closes weak step 1); (ii) the
group-character form (c a character of Q_+^* forces mu = delta_0). The Cauchy family makes the obstruction stronger
than stated, not weaker: integer-multiplicativity of mu-hat(log n) does not imply real zeros even in the limit
delta -> 0. But O2 as written must be corrected, and Prop. 2(c)'s identification "character of the group (an Euler
product)" conflates unitary characters with Euler products.

**E3 (O3: the conclusion "no convergent arithmetic object for t > 0" is false).**
The proved sentence (the full-line integral of e^{t u^2} phi_n diverges for t > 0) is correct. The inference "the
t > 0 side offers no approximants at all" is an artifact of expanding on the whole line. Use evenness first:
H_t(z) = 2 int_0^infinity e^{t u^2} Phi(u) cos(zu) du, then expand Phi = sum phi_n on u >= 0, where every phi_n
decays doubly exponentially. Each term converges for every real t and the sum over n converges absolutely.
Numeric check, t = +0.05: relative error against the direct integral at z = 2: 3.8e-4 (N = 1), 1.3e-10 (N = 2),
< 1e-30 (N = 4); at z = 9: 2.4e-3, 8.9e-10, 2.5e-26.
This is the standard route: the Polymath15 effective approximation of H_t for t > 0 is a finite Riemann-Siegel type
sum A + B - C whose coefficients are b_n^t = exp((t_std/4) log^2 n) = exp(t_here log^2 n), i.e. exactly the
"ferromagnetic" weights, with explicit error terms. So a convergent (and a finite, effectively bounded) arithmetic
object carrying the super-multiplicative weights exists for t > 0. What remains true is weaker: there is no
representation as a single absolutely convergent Dirichlet-type sum over all n with those weights; the available
objects are two-sided (A + B) sums of length ~ sqrt(x), for which a Lee-Yang argument is not available because the
two halves interfere. The author's weak step 3 names the Riemann-Siegel split as a possibility; it is not a
possibility but an existing object, and O3 should not be labelled a proved obstruction in its stated form.

**E4 (measured claims).** The summary says identities hold "to 1e-9..1e-12". RESULT.md itself reports 4.7e-7 to 7e-5
at t = -0.3 (N = 2000). check.py's t = -0.05, N = 60 series comparison is far from converged and is correctly not
cited. The two-point remark "f_a is a small perturbation of one translate" uses the ratio e^{pi a/2}, which is 2.2 at
a = 0.5 and 1.6 at a = 0.3: not small. Absence of non-real zeros to height 60-120 is measured; the decoupling sentence
"at every finite height" is not supported beyond the tested box.

## Is the obstruction an artifact of a weak attempt?

Partly. The defect chosen (coefficient cocycle of the multiplier) is datum-independent by construction, so O1 is
automatic. The angle also named the log-derivative defect (nonnegativity and prime-power support of the coefficients
of -D'/D), which depends on the initial datum and separates zeta from DH; it was not examined. One way around O1 and
O3 that the note does not close: take the Polymath15 A + B form for t > 0, where the weights
exp(t log^2 n) n^{-s} are finite sums, and define the defect on the finite Euler-product truncation
prod_{p <= P} against the weighted sum; ask whether the super-multiplicative sign gives a zero-free statement for the
A-sum alone in Re s > 1/2 + c(t) (a Lee-Yang / Newman-type statement for a finite ferromagnetic sum). This would at
best give a bound on Lambda, not RH, and the DH control still applies (the same weights multiply the DH coefficients),
so I do not claim it works; it is the specific place where the note's "no object exists" claim stops the analysis
too early.

## Surviving claim

PROVED: Prop. 1 (twisted series, t < 0), Prop. 2(a),(b) (mixture forms), cocycle identity, O1, Prop. 3 as a
reformulation of Lambda = 0, and the literal divergence statement in O3 (full-line termwise integrals diverge for
t > 0). CLASSICAL + PROVED: Hamburger form of O2. NOT surviving: "E = 0 locus is the single point xi" for the cocycle
defect (Cauchy family: E = 0, infinitely many non-real zeros); "the favourable-sign side has no convergent arithmetic
object" (half-line expansion; Polymath15 A + B). Nothing toward RH; no change to any bound.
