# REFEREE: ap-order-two/RESULT.md (2026-11-17)

Verdict of referee: **holds = false on the strict rule.** One step under a PROVED-sketch / CLASSICAL label
(Theorem B(ii), the "if and only if" for a fixed weight w) cannot be confirmed as written, and one sentence of the
control table ("no step uses multiplicativity") is false. Both are local. The verdict "precise obstruction inside
the stated estimate system" survives after the repairs below. Nothing in the note claims anything about a zero, and
nothing here changes that.

Referee scripts were kept outside this directory (`/tmp/ap2ref/`: `check.py`, `dh.py`, `dhprobe.py`, `what.py`);
every run went through `scripts/memcap.sh 8`, largest planned allocation 334 MB, longest run 10 s. No ssh.

## 1. Confirmed (re-derived by hand; numerics re-run)

* **Gauss sum and Lemma 0.** g(n; m) = (m/n) eps_n sqrt n for odd squarefree n and all m (zero when (m, n) > 1):
  correct. The Poisson dual of m -> (m/c) is (h/c) eps_c; b_c eps_c = mu(c) xi(c) forces b_c in the class of mu.
  g(rho)^2 = rho(-1) q at chi = rho: correct. The lemma is a one-line statement; it is correct.
* **Theorem A(a), coefficient form.** T(n) = kappa Q^{1/2} phi(n)/n + O(tau(n)): re-derived (Moebius over d | n; the
  completion of the d-sum costs at most tau(n)). Euler factors of D_c(w): phi(c)/c prod_{p | c}(1 + p^{-w})
  prod_{p not | 2c}(1 + (1 - 1/p) p^{-w}); u_p(1) = (1 - p^{-2})/(1 + p^{-1} - p^{-2}) = h(p): correct.
  Independent numerical check (`check.py`): f_pred = Z^{-1/2} sum_c x_c w(c/Z) kappa Y^{-1} sum_s W1(s/Y)
  phi([s,c])/[s,c], kappa = 0.348697, against the stored square-row part f:

  | (Z, Y, Q) | abs mu: pred / measured | mu: pred / measured |
  |---|---|---|
  | (4000, 4000, 4000) | 0.38949 / 0.39060 | -0.00924 / -0.00881 |
  | (16000, 16000, 16000) | 0.78217 / 0.78174 | -0.00575 / -0.00544 |
  | (30000, 3000, 30000) | 1.07067 / 1.07003 | 0.00393 / 0.00422 |

  Differences 3e-4 to 1.1e-3, inside the stated O(Z^{1/2} Q^{-1/2}) = O(1) term.
* **Theorem A(b).** Block bound M_0^{-1/2} min(M_0^{3/4} Y^{-1/2}, ((M_0 + Y)/Y)^{1/2}) (M_0 + Z)^{1/2} re-derived
  from Heath-Brown 1995 Theorem 1 (hypotheses: both variables odd, positive, squarefree; here s, c are squarefree
  and m_0 is squarefree after removing t^2; coprimality to t goes into the coefficients; even m_0 and reciprocity
  are finitely many classes mod 8) and convexity for L(1/2 + eps + it, chi_{m_0}). Maximum over M_0 <= min(Y, Z) is at
  M_0 = Y^{2/3}: Z^{1/2} Y^{-1/3}. Middle range gives 1 + (Z/Y)^{1/2} <= 1 + Z^{1/2} Y^{-1/3}; top range X^{1/2}.
  Correct. (c) follows.
* **Theorem B(i), (iii) and the unconditional value B = 1.** Correct. (iii) needs, besides M >= 2/3, the unstated
  condition Z^{1/2} Y^{-1/2} <= Z^{M/4} (ly >= 1 - M/2) for the k_Y remainder.
* **Theorem C for coprime (s, c).** Poisson formula checked, including eps_{sc} and the absence of an h = 0 term.
* **Theorem D(i), D(ii) identity.** p^{-1} sum e((a x^2 + b y^2)/p) = (ab/p)(-1/p) = (-ab/p): correct.
* **Lemma R.** c_c(N)/phi(c) = mu(c/(c,N))/phi(c/(c,N)) for squarefree c and mu(c) mu(c/g) = mu(g): correct; the
  N != 0 rows are O(tau(N)). (The Poisson step in x is not needed for the direct side; the d-sum is a Ramanujan sum
  at once.)
* **Cited statements exist and say what is cited:** `r2-zf-paired-rows` Lemma B(iii) (d = 2 iff conjugate pair or
  quadratic component), Theorem D(i), (iv), Prop. C, Prop. E; manuscript Prop. 2.1 and (6.2).
* **Numerics.** `probe2.py` re-run under memcap: output identical to `probe2.json` (10.3 s; planned table sizes are
  printed before allocation; peak planned 329 MB). Every number in the section 4 table matches the log.

## 2. Errors and gaps

1. **Theorem B(ii): the "only if" is not proved for a fixed weight w.** The argument "as in the proof of Prop. 2.1"
   continues w^(s) H(s)/L^{(2)}(s, eta), where w^ is the Mellin transform of w. Prop. 2.1 uses the Gaussian
   e^{(s-5/6)^2}, which has no zeros; the note uses an arbitrary nonnegative w in C_c^inf(1, 2), and w^ is an entire
   function of exponential type with infinitely many zeros. A zero of L at a zero of w^ in Re s > sigma_0 is not
   excluded by the bound. Admissible weights with zeros of w^ in Re s > 1/2 exist: w(x) = w_0(x) + a w_0(x/lambda),
   w_0 a bump on (1, 1.3), lambda = 1.4, a = lambda^{-3/4}, has w^(s) = w_0^(s)(1 + a lambda^s) with zeros on
   Re s = 3/4 (`what.py`: 6 zeros in [0.5, 3] x [-60, 60] by the argument principle). For the bump used in
   `probe2.py` the same count over [0.5, 3] x [-150, 150] is 0. Repair: state (2.4) for all admissible w, or for a
   weight whose Mellin transform has no zeros in Re s > sigma_0 (Gaussian, as in Prop. 2.1). With that change (ii)
   is the classical equivalence and f(theta) = theta stands.
2. **Theorem A(a), second display: Y depends on Z.** In the geometry of (c), Y >= Z^{3/2}, so H_Y is not a fixed
   function and "f is the inverse Mellin transform of w^ H_Y/L" is not a statement about one Dirichlet series. The
   coefficient form f = c_0 Z^{-1/2} sum mu(c) eta(c) h(c) w(c/Z) + O(Z^{1/2} Y^{-1/2 + eps}) + O(Z^{1/2} Q^{-1/2})
   is correct and is what Theorem B needs. Presentation only.
3. **Control table, DH row: "no step uses multiplicativity" is false.** Theorem A(a) uses the Euler product at two
   points: (i) factoring the multiplicative weight h out of sum_c x_c h(c) c^{-s} to get H(s)/L(s, eta); (ii)
   discarding the prime 2 and the non-squarefree c ("L^{(2)}", squarefree support of mu). For the inverse
   coefficients x of Davenport-Heilbronn neither is available. Measured (`dh.py`, N = 2e6, convolution identity
   a * x = delta checked at seven n to 3e-14): x_6 = -1.1614 against x_2 x_3 = -0.0807; max abs x_c = 11.6, 52.2,
   266.9, 1421, 2430 at c <= 1e3, 1e4, 1e5, 1e6, 2e6; 73.2 percent of the l^1 mass sits on non-squarefree c;
   sum over (Z, 2Z] of abs x_c has log-log slope 1.12 on 1e3..5e5 (consistent with zeros of F in Re s > 1), l^2
   norm slope 0.80. So the sum that the probe computes for DH, sum over odd squarefree c of x_c h(c) w(c/Z), is
   not the inverse Mellin transform of (holomorphic nonvanishing)/F, and "the system returns its true supremum" is
   not derived. It is plausible (h is a bounded multiplier, so the abscissa is at most that of 1/F), but the lower
   direction is open. The row should read: coefficient decomposition holds; relation of the returned abscissa to
   the zeros of F not established. The same applies to the EA row.
4. **DH numerics do not show a failure, and none is claimed.** `dhprobe.py` ran the probe with x = DH inverse
   coefficients (all odd c with Jacobi symbols, and odd squarefree c) at three geometries. I, f, N: (0.0050,
   0.0049, 0.0001), (-0.0109, -0.0066, -0.0043), (-0.0042, -0.0031, -0.0011) for all odd c; f agrees with the
   weighted coefficient sum to 2 percent (0.00498, -0.00661, -0.00311). The decomposition is coefficient-blind, as
   Theorem D(i) says. The smoothed sums of x_c stay below 0.02 Z up to Z = 5.12e5 (fitted slope about 0.4): at
   accessible height the probe is as small for DH as for zeta. The statement "(2.4) is false for DH at the
   abscissa of its off-line zeros" is therefore not visible numerically and rests on item 3. This does not affect
   the verdict, because no zero statement is made that could transfer to DH.
5. **Lemma W is labelled PROVED-rel; it is a sketch.** "Smoothed sum with a multiplicative weight" needs
   sum_{(t,n)=1} r_T(t^2) Om(t^2/Q) with multiplicative dependence on n. For the genus average this follows from
   local densities. For a single ternary form r_T(t^2) contains a spinor-genus term on square classes that is of
   the size of the main term and carries a quadratic character of t; for binary forms r_T(t^2) is not smooth in t.
   The conclusion (weights are multiplicities; no new row) is unaffected in kind, but the label should be
   PROVED-sketch (genus average) / ARGUED (single form).
6. **Theorem E inherits qualifiers that the statement drops.** `r2-zf-paired-rows` REFEREE item 4: "1/L appears
   only if the input is a Moebius sum" is PROVED-rel the ledgers, not PROVED; item 3: one-variable Poisson of a
   conjugate pair was derived by that referee as MODEL and is absent from that note. Theorem E(2), (3) cite Thm
   D(i) as PROVED and table row 4 cites "section 3" for the one-variable case. Theorem E(1) applies Lemma B(iii) to
   the Poissoned subset of variables, which is an extension of the lemma (short, but not written). Theorem E is a
   statement about the system (R), (P), (T), (L); the claim line's "PROVED-rel; partly MODEL" is the right label,
   and the summary sentence "order-2 objects enter only as identities" should carry "in this system".
7. **Numerics are outside the geometry of Theorem A(c).** All five runs have Y <= Z (Y = Z^{0.78..1.0}); the
   theorem's regime is Y >= Z^{3/2}. Measured abs N <= 0.15 against a bound proxy of 6 to 16, so the exponent
   Z^{1/2} Y^{-1/3} is not tested. For x = mu both f and N are of size 1e-3 and the split carries no information;
   the check that has content is x = abs mu (confirmed in section 1).

## 3. Novelty

Nothing is presented as a new theorem about zeta, correctly. Theorem A is the classical fact that the average of
(m/s) over squarefree s detects squares (the diagonal in Jutila / Soundararajan first-moment computations) with
Heath-Brown's large sieve on the off-diagonal. Theorem B is the Littlewood-type equivalence between the Moebius sum
bound and the half-plane. Theorem C is Gauss-sum self-duality of real characters. New relative to the map: the
written-out r = 2 instance of row Z15 (which had one sentence), the correction "coherent sets of exponent 1/2 exist;
what is missing is a second representation without the reciprocal", and Lemma R. These are statements about the
method family, not about L-functions.

## 4. Controls

No structure is claimed for zeta that a control lacks; the note says the opposite (coefficient-blind), and the DH
run confirms the blindness. The separating step of the sextic method (absorption of mu into a Gauss sum of order
>= 3) has no order-2 counterpart: confirmed by Lemma 0. Rows HEAT and B "not formulable" are accepted as stated.
Rows DH and EA: see items 3, 4.

## 5. What survives

For the probe of section 3 over Q with odd squarefree s, c and coefficients abs x_c <= 1: I = f + N with f the
square rows, f = c_0 Z^{-1/2} sum_c x_c h(c) w(c/Z) + O(Z^{1/2} Q^{-1/2} + Z^{1/2} Y^{-1/2 + eps}), and
abs N << (QYZ)^eps (1 + X^{1/2} + Z^{1/2} Y^{-1/3}) (sketch level, exponents confirmed). For x = mu eta with eta a
fixed Dirichlet character and Y >= Z^{3/2}, X <= 1 <= Q/Z: the high estimate is unconditional and the low estimate
at sigma_0 >= 1/2, required for all admissible weights w (or one weight with zero-free Mellin transform), is
equivalent to L(s, eta) having no zero in Re s > sigma_0. Unconditional value of the system: 1. Poisson in m maps
the probe to a probe of the same form (coprime terms). Inside the system (R), (P), (T), (L), and relative to
`r2-zf-paired-rows` with its referee's qualifiers, effective order 2 with h <= 1 forces a trivial Gauss class and
returns f(theta) = theta. For Euler-product controls (sign twists, NR) the probe returns the control's own abscissa;
for DH and E_a only the coefficient decomposition is established. No statement about any zero.
