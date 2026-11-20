# REFEREE (independent, lens: general): c13-fourier-interpolation-zero-nodes

Date 2026-11-19. Written by a different agent from the lane's author. The lane's own referee pass is kept
unchanged below this report (second half of this file). Local only: one run through `scripts/memcap.sh 8`
(inline script, mpmath and pure python, under 1 minute, no file written in the lane, no server job).

## Verdict

**holds = true.** The claimed verdict (precise obstruction, device closed at stage A, nothing about zeros of
zeta) stands. Every step labelled PROVED was re-derived and confirmed. No step assumes RH, none restates
verified height, and the two lemmas of the note (M, T) are attributed to the source (BRS 5.3.3) and not
presented as new theorems. Nine statements need a weaker label or a correction (list below); none of them
changes the verdict or a flag.

Flags set by this referee: **r1 false, r2 false, r3 false, r4 false.** aboutZeros false.

## What was re-derived

1. Source text (`sources/brs.txt`, `sources/rv.txt`, read directly, not through the lane's quote list).
   Confirmed: Proposition 4.1 and (4.2) (poles at w = s, k - s with residues 1, -+1; functional equations in
   w and in s); the Remark on Bochner's converse theorem (uniqueness under the stated hypotheses nu > 0, finite
   order); (4.4); (4.6) to (4.8); the proof of Lemma 4.2 (the only target-dependent step is
   sum_{d <= sqrt x} |mu(d)|/d; Proposition 6.5 belongs to A); Lemma 4.3 as a minimum over one window; the
   choice of T_k; section 5.2 (abscissa of A_(3/2)((w+1)/2, .) equal to 2, strip |Im z| < 3/2 + eps);
   5.3.2 (Jensen bound (5.11), "the techniques from [26] must be abandoned"); 5.3.3 (linear combinations;
   multiplication by r^(ns/2) P(r^-(s-1/2)); shift of Lambda* by log r/(4 pi), and by n log r/(4 pi) in 5.3.4);
   2.4 (Kulikov); RV Theorem 2 (kernel of the single functional L = sum x_(n^2) - sum y_(n^2)).
2. Kernel algebra (4.6) to (4.7): the factors pi^(-w/2) Gamma(w/2) of A_(1/2)(w/2, .) and of zeta*(w) cancel,
   1/zeta(w) = sum mu(d) (d^2)^(-w/2), which gives (4.7). Confirmed by hand.
3. Lemma M. (i) G(s)/G(w) is invariant under w -> 1-w and s -> 1-s, equals 1 at w = s and at w = 1-s, so the
   residues 1 and -+1 are unchanged; (ii) product of two absolutely convergent general Dirichlet series;
   (iii), (iv) immediate. Confirmed.
4. Lemma T. Coefficient formula h^NR_m = P(s) sum_j g_j q^((j+1)/2) h_(m/q^(2(j+1))) and the cancellation
   against n^(-1/4) confirmed by hand. Residues: P(s)/P(rho) x V_rho at a simple zero of zeta,
   P(s) H(varpi, s)/P'(varpi) at a zero of P. Fourier shift: q^(+-iz) moves the frequency by log(q^2)/(4 pi),
   so the transfer is the coefficient form of P x (1/P) = 1. Confirmed. Numeric check on cases not used by
   the lane, (q, c) = (7, -2.5), (3, -2.25), (11, 2.3), (2, -2.12), a = 0.3562, 0.4505, 0.2257, 0.4973:
   with random complex h_n, n <= 40, sum_m h^NR_m m^(-w/2) against (P(s)/P(w)) sum_n h_n n^(-w/2) at
   s = 0.5 + 2.345i, w = 1.07 + 5.5i: 1e-14, 8e-14, 7e-16, 1e-8 (the last is the truncation at 400 terms with
   ratio 0.95); transfer matrix deviation 0 on an 8 x 8 block; normalisation deviation <= 1e-16.
5. T-NR and (I-1): sum_j |g_j| q^(-(j+1)/2) = 1.909, 16.83, 0.759, 739.5 at the four pairs (finite; grows as
   a -> 1/2 as it must). Same exponent 1/2. Confirmed.
6. DH. Built from the two characters mod 5 (not from the periodic table): coefficients 1, kappa, -kappa, -1, 0
   with kappa = 0.28407904. F*(1-s) = F*(s) with the factor 5^(s/2) Gamma_R(s+1): relative defect 2e-31,
   4e-30, 1e-29, 1e-30 at s = 0.11 + 3.3i, -0.7 + 41.9i, 0.93 + 120.25i, 2.2 - 9.1i (points not used by the
   lane). Two further off-line zeros located: 0.650830080609737 + 114.163342730757i and
   0.574356050450806 + 166.479305913168i. Neumann bound at Re w = 2 (zeta(2) - 1 < 1) confirmed by hand.
7. DH, the number 1.1204 (used in RESULT.md without a source). Reproduced independently by Bohr's method:
   F = 0 iff L(s,chi)/L(s,chi-bar) = -(1 + i kappa)/(1 - i kappa); only primes p = 2, 3 mod 5 contribute, each
   factor has argument range +-2 arctan(p^-sigma); the equation
   sum_{p = 2, 3 mod 5} 2 arctan(p^-sigma) = pi - 2 arctan(kappa) = 2.588018 (primes to 2e6 plus the tail
   E_1((sigma - 1) log N)) has the root sigma = 1.12036. So zeros with real part in (1, 1.1204) exist and
   1/F is not absolutely convergent on Re w = 1; |b(n)| is unbounded for that reason (PROVED given the
   classical Bohr argument; the lane had it as MEASURED plus an unsourced number).
8. E_a: Euler factor of the inverse is (1 - p^(-a) x)(1 - p^a x), so b(p) = -(p^a + p^-a) and
   sum_p |b(p)| p^-sigma diverges for sigma <= 1 + a. Confirmed by hand; at a = 0.2 (not a lane value) the
   prime sums to 1e3, 1e4, 1e5, 1e6 are 3.57, 4.02, 4.40, 4.74 at sigma = 1.15 and 2.85, 3.05, 3.18, 3.28 at
   sigma = 1.25.
9. Pivot. -P'/P = -log q - log q sum_{j>=1} (beta^j + beta^-j) q^(j/2) q^(-jw), beta + 1/beta = -c: checked
   against a numerical derivative (1e-10) at the four pairs. Entries at j = 1..4: (11, 2.3): 18.29, -86.78,
   460.8, -2560; (7, -2.5): all negative. Positivity fails at the single prime q, as stated.
10. Controls. The claim "no zeta-only mechanism" is the lane's own conclusion; the controls that carry it
    (T-NR: items 4, 5; DH: items 6, 7) were run here. T-NR passes the kernel, the basis and (I-1). Confirmed.

## Corrections and weaker labels (none breaks a PROVED step)

- C1. "Exponent 1/4 + eps for all s is equivalent to RH" (section 0 item 3, device row, `lanes.jsonl`). Only
  the direction "exponent kappa for all s implies no zero with Re rho > 2 kappa" is PROVED-rel
  (Proposition G (ii)). The converse is Proposition G (iii), ARGUED. The summary lines should read "implies
  RH; converse argued". It is a restatement of Littlewood type and is labelled as such.
- C2. Proposition G (ii): "outside a discrete set" should be "outside a countable set" (a union over the zeros
  rho of the zero sets of the entire functions V_(rho,0)).
- C3. DH and BRS 5.3.3. The source sentence is "linear combinations of L-functions that satisfy the same
  functional equation". L(s,chi) and L(s,chi-bar), chi complex mod 5, do not satisfy the same functional
  equation: measured, L*(1-s,chi) differs from L*(s,chi) by a relative 2.55 at s = 0.3 + 7.7i and equals
  (0.850651 + 0.525731i) L*(s,chi-bar). What holds is that the combination F itself is self-dual (item 6),
  which is the hypothesis H1 the kernel needs. "5.3.3 contains DH" is a reading of the source, not a quote.
  Status of "DH passes in the smaller class": H1 MEASURED to 1e-29, H2 at the edge 2 PROVED, the remainder
  (Jensen selection, contour identity) relative to a source passage that is a sketch. The lane says "sketch
  in source"; the label PROVED-rel should be read as ARGUED on that sketch.
- C4. Lemma T, bookkeeping. For c < -2 the progressions of P have nodes at height 0 (rho = 1/2 +- a,
  z = -+ia); the node sum of (1.2) runs over gamma > 0 for even f and the lemma does not say how the height-0
  pair enters. V^NR_varpi is non-zero at the reflected node 1 - varpi (pole of H(varpi, s) at s = 1 - varpi
  against the simple zero of P(s)); this is the usual identification z <-> -z for even f, not an error, but
  it is not stated.
- C5. "Bases form one orbit under G(s)/G(w) (proved)". What is proved is an identity of the kernels built by
  this recipe, inside one gamma class and one sign of the functional equation (for F*(1-s) = -F*(s) the
  quotient G = F*/zeta* is antisymmetric and the roles of H_+ and H_- are exchanged). It is not a
  classification of all interpolation bases with these node and frequency sets. The verdict needs only the
  identity.
- C6. theta^w. BRS 5.3.2 states that the basis functions from (5.10) "have additional poles at s = 2 s_0 and
  s = 2(k - s_0), and hence they do not belong to any nice function space". The control table entry "holds
  in the class of 5.3.2" omits this. With the identification for non-integer w already ARGUED, the theta^w
  row is ARGUED as a whole.
- C7. Section 5 item 1, "an off-line node removes a sign change and adds nothing that the construction
  reads": no zero or sign of any U_n was computed or derived. What is established is the factorisation of
  Lemma T (factor P(1/2 + iz) real, of one sign, modulus in [|c| - 2, |c| + 2] on the real axis) for T-NR
  only. For DH nothing is known about signs. The summary sentence "off-line nodes change no sign or decay"
  holds for multiplier controls and is not established for a general target.
- C8. W U_n. The text extraction of BRS reads "pi^-1 Lambda(n)/sqrt n, n a square"; RESULT.md writes
  Lambda(m)/(pi sqrt m) for n = m^2. The RESULT.md form is the one consistent with (1.1) for even f
  ((1/pi) sum Lambda(m) m^(-1/2) f^(log m^2/(4 pi))). No effect.
- C9. (E1) is stated as "|mu(d)| <= 1". The proof of Lemma 4.2 needs only sum_{d <= y} |b(d)|/d << y^eps,
  i.e. absolute convergence of 1/F in Re w > 1; T-NR has unbounded |b| and satisfies it. The lane reaches
  the same conclusion in section 6; the phrase "unimodular local parameters at every prime" over-describes
  the input.

## One repair offered (ARGUED by this referee, not checked against the full proof of BRS (4.15))

Weakest step 1 (T-NR in the class H_1). Let t_0 be the height of Lemma 4.3 in a window and
M = exp(c (log log T)^2). Since |d/dt (1/zeta)| = |zeta'|/|zeta|^2 <= T^B (2M)^2 as long as |1/zeta| <= 2M,
the bound max_{1/2 <= sigma <= 2} |zeta(sigma + it)|^-1 <= 2M holds for |t - t_0| <= 1/(4 M T^B). The zero
heights of P are 2 pi/log q apart, so this interval contains a t at distance delta >= 1/(8 M T^B) from all
of them. On that line the simple zeros of P give int |P(u + it)|^-1 du << log(1/delta) << log T. If the
horizontal error in E(s,T) is bounded as max |zeta|^-1 times the integral of the remaining factors, the
selection for zeta x P costs a factor log T and the class H_1 is kept. This would upgrade "T-NR passes every
step" from ARGUED to proved; it strengthens the obstruction and changes no flag.

## Flags (strict)

- R1 false. The one inequality that reads the coefficients of 1/zeta, (I-1), is satisfied by T-NR (no
  multiplicativity at q) with the same exponent; DH does not need it. Multiplicativity is not essential to
  any step.
- R2 false. (1.2) is an identity; the only window-dependent input is one selected height per window.
- R3 false. T-NR passes every step (item 4, 5; height selection argued, repair above); WT passes; DH and
  theta^w pass the construction in a smaller class.
- R4 false. The conclusion of (I-1) is Re w > 1; the exponent inside the strip is a restatement.

## Residual risks

BRS sections 3 and 6 (definition of A_k, Proposition 6.5, real weights) were not re-derived here either. BRS
5.3.2 and 5.3.3 are sketches in the source. E_a remains open at the gamma-class step. None of these can turn
the obstruction into a positive statement.

---

# Earlier pass by the lane's own agent (kept unchanged)

# REFEREE pass: c13-fourier-interpolation-zero-nodes

Date 2026-11-19. Status of this file: a separate adversarial pass by the lane's own agent, with independent code
(`ref_check.py`: mpmath and pure python, no numpy, different algorithms from `checks.py`) and a second read of
the source text. It is not a pass by a different agent; an independent referee is owed (round-13 repair slot).
Under METRIC.md the lane's flags count only from a referee; all four flags are false, so nothing depends on it.

## Verdict of the pass

The main claim holds: the device is closed at stage A as a precise obstruction, with T-NR passing every step of
the construction and the conclusion of the one non-identity inequality (I-1). Nothing in RESULT.md is a
statement about zeros of zeta. No PROVED step failed. Four statements needed a weaker label or a correction;
they were corrected in RESULT.md before this file was written and are listed so that the record shows them.

## What was re-derived

1. Source quotes. Nine passages quoted or paraphrased in RESULT.md were searched in `sources/brs.txt`
   (R3: all found): the functional equations of H; "Dirichlet series without Euler products"; "the techniques
   from [26] must be abandoned"; the linear-combination sentence and the polynomial-multiplier sentence of
   5.3.3; Bochner's converse theorem remark; the non-redundancy sentence; W U_n; the attribution of Lemma 4.3.
   Read again by eye: (4.2) (A_k(k - w, s) = +-A_k(w,s), A_k(w, k - s) = -+A_k(w,s); poles at w = 0, k with
   residues -+alpha_0 in addition to s, k - s), (4.6) to (4.8), the proof of Lemma 4.2 (the step
   A(x) << sqrt(x) sum_{d <= sqrt x} 1/d), Lemma 4.3, (5.10), (5.11), section 5.3.3, section 2.4, RV Theorem 2.
2. DH is in the class of BRS Theorem 5.2 (R1). F*(s) = 5^(s/2) pi^(-(s+1)/2) Gamma((s+1)/2) F(s), with F from
   Hurwitz zeta values: |F*(s) - F*(1-s)|/|F*(s)| = 9.1e-31, 2.1e-30, 4.4e-31 at s = 0.3 + 7.7i, 1.4 - 22.1i,
   0.5 + 85.7i. The off-line zero 0.808517182456637 + 85.699348485377592i was re-found (map value reproduced),
   so the control object is not identically zero and has the zero used.
3. DH inverse coefficients by the divisor definition (pure python, N = 3e4): first 12 values identical to
   `checks.json`; partial sums to 1e4 at sigma = 1.3 and 2 agree to 1e-14; max |b| = 117.26 below 3e4 (1421.2
   below 1e6 in K1). The elementary bound sum |b(n)| n^-2 <= 1/(2 - zeta(2)) = 2.82 was re-derived:
   |a(n)| <= 1, sum_{n>=2} n^-2 = 0.6449 < 1, Neumann series in the Banach algebra of absolutely convergent
   Dirichlet series on Re w = 2.
4. Lemma T (R2). Roots formula for g_j against the recursion: 1e-22 or better, 40 terms, four parameter pairs
   including the edge case (2, 2.1213), a = 0.49996. The transfer matrix
   sum_j g_j [delta(e-j-1, e'-1) + c delta(e-j-1, e') + delta(e-j-1, e'+1)] equals delta(e, e') exactly on
   1 <= e, e' <= 12. Zeros of P at 1/2 +- a + i h: |P| < 5e-31. The cancellation of q^((j+1)/2) against
   n^(-1/4) was re-derived by hand: h^NR_m = P(s) sum_j g_j q^((j+1)/2) h_(m/q^(2(j+1))) and
   (m/q^(2(j+1)))^(1/4) = m^(1/4) q^(-(j+1)/2).
5. H3 for T-NR, by hand: A^NR(x) = P(s) sum_j g_j q^((j+1)/2) A(x/q^(2(j+1))) << sqrt(x) log x
   sum_j |g_j| q^(-(j+1)/2), and |g_j| is of size q^(aj), so the sum converges exactly when a < 1/2. Holds.
6. Pivot, T-NR coordinates. -P'/P = -log q - log q sum_{j>=1} (beta^j + beta^-j) q^(j/2) q^(-jw),
   beta + 1/beta = -c. For c > 2, beta < 0: the entries at even j are negative and exceed log q in size, so
   Lambda_F(q^j) < 0 there. For c < -2 every entry is negative. Matches RESULT.md section 7 (iii).

## Corrections made during the pass

- E1 (parameters). The first run of `checks.py` used (q, c) = (2, 2.5), (3, 3.0): a = 1.0 and 0.876, outside
  the strip, and the series tests diverged (errors 1e58). These are not T-NR controls in the map's sense
  (zeros must lie in the open strip, |c| < 2 cosh(log q / 2); round-12 correction 2 < c < 2.1213 at q = 2).
  Replaced by (2, +-2.05), (3, 2.2), (5, +-2.2) with an assertion a < 1/2. RESULT.md states the range in the
  control table.
- E2 (label). "T-NR passes every step in the class H_1" was first written as PROVED-rel. The joint choice of a
  truncation height (good for zeta by Lemma 4.3 and away from the zero heights of P) does not follow from the
  quoted form of Lemma 4.3. Relabelled ARGUED, with the Jensen form (5.11) as the proved fallback in a smaller
  class; listed as weakest step 1.
- E3 (label). The abscissa of absolute convergence of 1/F_DH equal to sup Re rho = 1.1204 would need a
  Wiener-type theorem for Dirichlet series that was not opened. The construction needs only convergence at
  Re w = 2, which is elementary (item 3). RESULT.md uses the elementary statement; the measured partial sums at
  sigma = 1.1204 and 1.3 are reported as numbers and no abscissa is claimed from them.
- E4 (scope). The assignment text, repeated in an earlier draft, says the Radchenko-Viazovska relations "contain the radial Poisson formulas of
  theta^w". RV Theorem 2 gives exactly one relation for the pair (sqrt n, sqrt n) in dimension one: Poisson
  summation. theta^w is the relation of a different pair (weight w/2, Hankel transform of order w/2 - 1).
  RESULT.md section 0 item 4 states it this way.

## Attacks that did not break the claim

- "T-NR is not in the class because its Dirichlet series has frequencies log(n/q)". The kernel needs 1/F, whose
  frequencies are log(n q), and the class of BRS is general Dirichlet series closed under multiplication with
  n^(-w/2); in the variable n^(-w/2) the support is q^2 N. BRS 5.3.3 states the shift of Lambda* by
  n log r/(4 pi), which is log q/(2 pi) here. Consistent.
- "(I-1) might fail for T-NR and so name a failing step". Item 5: it holds with the same exponent for every
  a < 1/2, which is the definition of the control.
- "The basis functions might change sign pattern for a control with off-line nodes that is not a multiplier of
  zeta (DH)". Not decided: no basis function of DH was computed. RESULT.md claims the sign and decay statement
  for T-NR only, and for DH only existence. The stage-A verdict uses T-NR.
- "A hidden use of the Euler product inside A_k". A_k is defined from the theta group and the pole s, with no
  reference to the target (BRS section 3; (4.4) identifies its value at s = 0 with zeta(2w), which is a
  property of theta). Not re-derived; PROVED-rel.
- UNIV: the device has no pointwise inequality at every height; UNIV is out of scope. Agreed.

## Residual risks (not errors)

1. BRS sections 3 and 6 were not re-derived; BRS 5.3.2 and 5.3.3 are sketches in the source ("we only sketchily
   outline the details"). The closure relies on them for DH and theta^w, and on Lemma M and Lemma T (proved
   here from (4.6) to (4.8)) for T-NR.
2. E_a is open at S0. If a later lane wants E_a as a discriminator for this device it has to construct or
   exclude a kernel with gamma factor Gamma_R(s+a) Gamma_R(s-a).
3. Proposition G (iii) is argued. Only (i) and (ii) are used.

## Flags confirmed by this pass

r1 false, r2 false, r3 false, r4 false. Score 0. aboutZeros false.
