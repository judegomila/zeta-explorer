# REFEREE: res-order-two-nonpoisson/RESULT.md (2026-11-17)

Verdict of referee: **holds = false on the strict rule.** The finite identities (Theorems 1, 2(i)-(ii), 3(a), 3(b),
3(c)) are confirmed. Three statements carried into the headline claim cannot be confirmed as written:

1. "Poisson duals are Ramanujan sums or quadratic characters, covering every d-dependence of second-degree rows
   (closes a gap in ap-order-two Lemma R)". Theorem 2(i)-(ii) is a change of basis; the analysis in 2(iii) is for one
   basis element at a time with n fixed independently of c. An explicit row in the class has a Poisson dual that is
   a non-split root sum, which RESULT section 8 item 1 lists as outside the no-go (section 2.2 below).
2. Theorem 5(ii) as stated ("every other Hecke eigenform of half-integral weight ... the reciprocal is present")
   is false for the weight-3/2 unary theta series and is proved here only for holomorphic forms; the weight-1/2
   Maass spectrum, which is the spectrum of the Salie-sum Kuznetsov formula, rests on a recalled statement.
3. Control row TW, M2: "what fails is the root-count interpretation, which no estimate uses". The pointwise bound
   for the evaluated Salie sum is the root count; under the twist it changes from 1 to 3^omega((t,c)) (measured 27
   at c = 105).

None of these creates a statement about a zero; the note makes none. A narrower obstruction survives (section 6).

Referee scripts were kept outside this directory (`/tmp/ref-o2np/`: `ref.py`, `g.py`, `h.py`, and a re-run of the
author's `checks.py` in `/tmp/ref-o2np/rerun/`). Every run went through `scripts/memcap.sh 8`; largest object a
400-term integer power series; longest run under 2 minutes. No ssh, no compute server. mpmath runs used
`.venv-arb/bin/python`.

Labels below: CONFIRMED (re-derived by hand and/or recomputed) / NOT CONFIRMED / WRONG AS STATED / ARGUED.

---

## 1. Confirmed

* **Author's checks reproduce.** `checks.py` re-run: all counts and pass/fail fields identical to `checks.json`
  (C1 28000 cases 0 failures, C2 2115, C2b 1710, C3 9720, C3b 4860, C4 174, C6 ranks = phi(c)).
* **Theorem 1(a).** Recomputed for all odd c < 70, all a, all b mod c (the author sampled b on a stride):
  45690 cases with (a, c) = 1, 0 failures. With (a, c) > 1 the formula fails in 3550 of 10240 cases, so the
  coprimality hypothesis is needed, as stated.
* **Theorem 1(b), (c).** Hand derivation confirmed: sum_x e((d x^2 - k x)/c) = eps_c (d/c) sqrt(c) e(-4bar dbar k^2/c)
  for odd c and (d, c) = 1; the symbol squares to 1 in (b) and gives the Gauss sum of the Jacobi symbol in (c),
  which equals eps_c sqrt(c) (M/c) for squarefree c, including (M, c) > 1 where both sides vanish.
* **Theorem 2(i), (ii).** Correct. (i) is the Fourier expansion of a function on the units; C6 checks a statement
  that needs no check. (ii) is the N-fold Gauss sum.
* **Theorem 3(a).** Re-derived. The one-prime relation
  (1 + psi(p^2) p^{2k-1} x^2) H_f - x H_{Tf} = a(n_0; f)(1 - chi(p) p^{k-1} x) follows from Shimura's action formula
  because the middle term is nonzero only at v = 0; the proposed series satisfies it since
  R_m - T R_{m-1} + psi(p^2) p^{2k-1} R_{m-2} = delta_{m,0}; uniqueness by induction on the degree for all f at once.
  The several-prime step needs only that n_0 is squarefree and p does not divide t'.
  Independent integer test not in the author's file: f = eta(2z)^12 theta(z)^{-3} (weight 9/2, level 4; Shimura's
  example), lift F = eta(z)^8 eta(2z)^8, k = 4, chi(p) = (n_0/p):
  a(n_0 t^2; f) = a(n_0; f) sum_{d | t} mu(d) (n_0/d) d^3 A_F(t/d) for n_0 in {1,2,3,5,6,7,10,11,13}, odd t,
  n_0 t^2 < 400: 44 cases, 0 failures. This fixes the exponent d^{k-1} and the character convention.
* **Theorem 3(b).** Prime-by-prime proof confirmed (p not dividing k: 2 cos(4 pi k v/p) on both sides; p | k:
  1 = 2 - 1). The identity also holds for the non-squarefree moduli tested (c in {9,25,27,45,49,63,75,81}, all k:
  374 cases, 0 failures), so the squarefree restriction in the statement is not sharp; no proof was attempted.
* **Theorem 3(c).** Recomputed with a different representation count and a larger set of n_0 (21 values up to 35,
  odd t, n_0 t^2 < 4000): 207 cases, 0 failures.
* **Table row (a) Howe (Mp_2, O(1)).** sum_{d | t} mu(d) d^{-1/2} sigma_{-1/2}(t/d) = 1: correct
  (zeta(s) zeta(s + 1/2)/zeta(s + 1/2) = zeta(s)).
* **M1 bookkeeping.** With Z(s) = sum_c S(m, n; c) c^{-2s} and poles at (1 + rho)/4, 1/2 + i t_j, 3/4, the exponents
  C^{(rho-1)/2}, C^{2 i t_j}, C^{1/2} for sum_c c^{-1} S w(c/C) are consistent. The pole set itself is recalled
  (Goldfeld-Hoffstein; Goldfeld-Sarnak), not re-derived here either.

## 2. Errors and unconfirmed steps

### 2.1 Theorem 2(iii) is sketch on sketch
It is labelled "PROVED-sketch, relative to ap-order-two Lemma 0, Lemma R, Theorem A". Lemma R is itself
PROVED-sketch, and the `ap-order-two` lane was refereed holds = false on the strict rule. The summary sentence
"closes a gap in ap-order-two Lemma R" and the label PROVED on the theorem header overstate this.

### 2.2 "Covering every d-dependence" is not established; explicit row outside 2(iii)
2(i) says any b_c is a combination over n mod c of e(n dbar/c), for either j. Hence the parity of j + N is a
choice of basis, not a property of the row, and the dichotomy of 2(iii) ("j + N even: Ramanujan; odd: quadratic
character") describes basis elements. 2(iii) then analyses one n, fixed independently of c: coherent set
{T^*[k] = n}, off-quadric rows O(tau(n - T^*[k])). Neither conclusion is linear in beta_c with a bound that
survives a superposition over phi(c) values of n.

Explicit row: N = 1, T[x] = x^2, b_c(d) = e(a d/c), (a, c) = 1. Direct side R_x(c) = c_c(x^2 + a). Its Poisson dual is

  sum_x c_c(x^2 + a) e(-k x/c) = eps_c sqrt(c) S(a, -4bar k^2; c) = eps_c^2 c (a/c) W(-a 4bar k^2, 2; c)

(first equality verified to 1e-10 for c in {7, 11, 13, 35, 101}, k in {1, 2, 3}; second is Theorem 1(a)). This is a
root sum over y^2 = -a k^2/4 mod c: size of order c when -a is a residue (measured |dual| = 19.46, 3.13, 14.77 at
c = 13; 164.2, 64.8, 58.8 at c = 101) and 0 when it is not (c = 7, 11, 35 with a = 1). It is neither a single
Ramanujan sum nor a quadratic character of the modulus; for -a a non-square it is the non-split root sum of RESULT
section 8 item 1, which the note declares outside the no-go. In the basis of 2(i) its beta_c(n) is supported on all
n with weights that are Kloosterman sums in (a, n).

This row also carries mu without insertion: c_c(x^2 + a) = sum_{g | (c, x^2 + a)} g mu(c/g), and
sum_c c_c(M) c^{-s} = sigma_{1-s}(M)/zeta(s). That is a fourth way the reciprocal enters (Ramanujan expansion on an
inhomogeneous quadric x^2 = -a). It is the mechanism of Lemma R with a shift on the direct side; RESULT 2(iii)
shifts only the frequency side (N' = n - T^*[k]). No abscissa was computed for it by the author or by me. The
sentence "the reciprocal enters by exactly three mechanisms" therefore holds only for the designs written out,
which RESULT weakest step 3 concedes; the claim text "covering every d-dependence" does not.

### 2.3 Theorem 5(ii) is wrong as stated and incomplete in weight 1/2
* Weight 3/2: the unary theta series sum psi(n) n q^{t n^2} (psi odd) are Hecke eigenforms of half-integral weight
  that are not among the weight-1/2 thetas of (i); their square-direction series has no surviving reciprocal (the
  lift is Eisenstein and the factor cancels, as in (iii)). So "for every other Hecke eigenform ... (P2) fails" is
  false. The dichotomy "characters on squares, or reciprocal present" is unaffected, since these coefficients are
  n psi(n) on squares; the statement should be repaired to say so.
* Serre-Stark covers holomorphic forms of weight exactly 1/2. In that weight there are no "other" holomorphic
  eigenforms, so (ii) has content only for weights >= 3/2 (holomorphic, where Theorem 3(a) is proved) and for
  weight-1/2 Maass forms and Eisenstein series (where it is recalled: Katok-Sarnak, not re-derived, level and
  plus-space hypotheses not stated). The Kuznetsov formula with Salie sums has exactly that Maass and Eisenstein
  spectrum. So for candidate (c) the label "PROVED-rel Theorem 3(a)" is not earned; it is CLASSICAL-recalled.
* The claim text "by Serre-Stark, no reciprocal-free weight-1/2 coefficient sequence other than characters on
  squares exists" is a correct citation only for holomorphic forms. Gelbart-Piatetski-Shapiro (distinguished
  representations = elementary theta representations) is cited from memory; I did not re-read it and could not
  check the exact hypotheses (the note writes "residual / distinguished" for "SL_2 or GL_2" as one statement).
* That (P1)-(P3) are necessary for an absorption step is an analogy with the sextic method, not a proved
  statement. Theorem 5 is a list of which known objects have the three properties; it is not a proof that no
  order-2 absorption exists.

### 2.4 Scope of Theorem 3 versus the actual Petersson/Kuznetsov formula
* The half-integral-weight formula on Gamma_0(4N) sums over c divisible by 4N with theta-multiplier Kloosterman
  sums. The note works with Salie sums to odd modulus and, in 3(b)/C5, odd squarefree modulus. The passage from one
  to the other (factoring off the 2-part, the multiplier eps_d^{-2k-1}, non-squarefree c) is not written. The
  sentence "both the geometric side (Salie sums) and the spectral side are the same Moebius convolution" is true as
  a tautology (a linear identity applied to both sides of an identity); the identification of mu(d) chi(d) d^{k-1}
  of 3(a) with the mu(g), g | (t, c), of 3(b) is ARGUED. It is consistent (t/c = t'/c' leaves the Bessel argument
  unchanged, sqrt(c)/c gives g^{-1/2}), but no proof or check connects them, and the Euler factor from (c', g) = 1
  is not computed (conceded in weakest step 1).
* "(D_1 is the first moment of |rho_F(n_0)|^2 L(s, F) ...)" is not derived.
* M2 has no bilinear low/high structure. The assignment h = 1, r = 2 is a relabelling of "the Dirichlet series over
  t has a pole at rho - 1/2"; the equivalence "smooth-sum bound iff no pole" is Mellin inversion. Correct, and
  already contained in Shimura 1973.

### 2.5 Smaller points
* Section 3.1: "the theta function gives a pole at s = 3/4 when mn is a square". In the note's own normalisation
  (odd c, Jacobi symbol), sum_{odd c < 1500} S(m, n; c)/(eps_c c) is 56.9 for (1,1) and 53.8 for (1,4), but 0.6 for
  (2,2), 4.1 for (2,8), -0.7 for (3,3): the main term needs m and n squares (or the level changed), not mn a
  square.
* EA row: "M3 returns 1/2 + a" presupposes RH for zeta; unconditionally the returned abscissa is Theta + a.
* Section 5 is a sketch; the kernel K(c_1, c_2) is not computed. Only the positivity inequality is proved.
* Header claims the runs went through `scripts/memcap.sh 8`; not verifiable after the fact. The re-run does.

## 3. Cited theorems against their hypotheses
| citation | use | check |
|---|---|---|
| Shimura 1973 Thm 1.7 | T(p^2) action, weight k + 1/2, level 4N, p not dividing 4N | hypotheses match; formula re-tested on eta(2z)^12/theta^3 |
| Serre-Stark 1977 | weight 1/2 = thetas | holomorphic, weight exactly 1/2, Gamma_1(N), 4 | N; does not cover Maass forms or weight 3/2 |
| Gelbart-Piatetski-Shapiro 1980 | distinguished = elementary theta | not re-read; statement in the note is loose |
| Katok-Sarnak | Maass version of 3(a) | recalled; level 4 plus-space in the source; not checked against the generality used |
| Waldspurger / Kohnen-Zagier / Baruch-Mao | section 3.3 | recalled; used only descriptively |
| Goldfeld-Hoffstein | weight-1/2 Eisenstein coefficient L(2s - 1/2, chi_m)/zeta(4s - 1) | recalled; consistent with 1/zeta(1 + 4it) on the axis |
| Heath-Brown large sieve | section 5 | squarefree rows only, as the note says |

## 4. Controls: referee numerics
The note's control table is argued. Computed here:

* **DH (mpmath, 25 digits).** kappa = 0.28407904; a(2) = kappa, a(3) = -kappa, a(6) = 1, a(6) - a(2)a(3) =
  1.0807009 (matches the map). Off-line zero refined to s_0 = 0.80851718245664 + 85.699348485378 i,
  |DH(s_0)| = 6e-26. At s_0: |L(s_0, chi)| = |L(s_0, chibar)| = 0.70219735, so the M2-type scalar
  alpha/L(s, chi) + beta/L(s, chibar) is finite there (modulus 0.778): no pole at the DH zero. At the first three
  zeros of L(s, chi) (0.5 + 6.18357819545 i, 0.5 + 8.45722917442 i, 0.5 + 12.674946417 i), where that scalar has
  poles, |DH| = 1.464, 0.957, 1.007. The numerator of the scalar is alpha L(chibar) + beta L(chi) (coefficients
  swapped relative to DH; modulus 0.384 at s_0), so DH's zeros are not zeros of it either. Confirms the DH cell for
  M2: the system sees the constituents, never DH.
* **Sign twist / U.** With eps = Liouville (mu(g) eps(g) = mu(g)^2), sum_t a(t) t^{-s} for
  a = (mu eps id^{-1/2}) * 1 at s = 3 + 2i equals zeta(s)/L_eps(s + 1/2) to 1e-9 (truncation at t = 20000): the
  convolution identity holds with the twist and the denominator is the twisted product. Confirms "returns the
  control's own abscissa" at the level of the identity.
* **Root count under the twist.** max over k of |sum_{g | (k, c)} mu(g) eps(g) U(k/g; c/g)| / #{y : y^2 = k^2 mod c}
  is 1.000 untwisted and 27.000 with eps(p) = -1 at c = 105. The pointwise Weil-type bound for the evaluated sum is
  the root count, so the sentence "which no estimate uses" is false; the change is a factor 3^omega((t, c)), which
  does not move an exponent.
* **EA, NR, HEAT, B.** Not computed. EA and NR for M3 are inherited from `ap-order-two` Theorem D, whose control
  table was corrected by its referee. "Not formulable" cells are not quantitative handles (map section 2, Q1).

Outcome: no control separates zeta from an Euler-type twist inside this system, as the note says. That is the
stated defect, not a transfer failure; no zero statement exists to transfer.

## 5. Novelty
* Theorem 1: Salie 1931; standard (Iwaniec, Topics, Lemma 4.9; Sarnak). 1(b), (c): standard computations in the
  half-integral-weight Kloosterman literature (Iwaniec 1987; Duke-Friedlander-Iwaniec; Toth).
* Theorem 3(a): Shimura 1973, Corollary 1.8 and the Main Theorem; the non-eigenform operator form is a direct
  restatement. 3(c): Hurwitz for n_0 = 1; general case classical.
* Theorem 3(b): elementary inclusion-exclusion; I know no reference that states it in this form, and none is needed.
* Theorem 5: Serre-Stark plus Shimura.
* M1: Selberg 1965 (weight 0), Goldfeld-Hoffstein / Goldfeld-Sarnak (weight 1/2).
No new mathematical statement. What is new relative to `ap-order-two` and `r3-method-limit` is the bookkeeping:
the Hecke relation at squares placed in the estimate-system language as an h/r = 1/2 design whose reciprocal is a
common scalar. I did not search the literature beyond recall; no web search was run.

## 6. What survives, and what is not covered
Surviving statement: for (i) the square-direction probe sum_t rho(n_0 t^2) W(t/Z) of a holomorphic
half-integral-weight form of weight >= 3/2, level 4N, t prime to 4N, (ii) the O(3) cone count, (iii) second-degree
rows with a single Kloosterman/Salie index n fixed independently of c and mu inserted on the modulus: the Dirichlet
series in the square variable is (reciprocal-free factor)/L(s + 1/2, chi) by an exact identity, a bound at exponent
e for the probe is equivalent (up to the amplitude condition) to a zero-free half-plane Re s > e + 1/2, and the
unconditional exponent corresponds to abscissa 1. Sign-twisted Euler-type inputs and the constituents of DH are
returned unchanged. No statement about any zero.

Not covered:
1. General d-dependence b_c(d): superpositions over n, c-dependent n, and in particular rows such as c_c(x^2 + a)
   whose dual is a non-split root sum and which carry mu through the Ramanujan expansion (section 2.2).
2. Non-split root sums (mn non-square): RESULT section 8 item 1; now also reachable from inside Theorem 2's class.
3. Weight-1/2 Maass forms and Eisenstein series in Theorem 3(a) and Theorem 5(ii) (recalled only); primes
   dividing 4N; even and non-squarefree moduli in the geometric side of the actual Petersson/Kuznetsov formula.
4. Higher rank (Mp_{2n}, O(m)), n >= 2; lifts to O(2,1), O(2,2) with non-automorphic test vectors; covers of degree
   >= 4 paired with quadratic rows (RESULT section 8 items 2, 3).
5. Any low estimate that is not a norm bound or an exact identity (RESULT section 8 item 4).
6. Necessity of (P1)-(P3): not proved. Theorem 5 does not exclude an order-2 absorption step of a different shape.
7. M1 with an optimised test function at the resonance (ARGUED in the note); section 5 with error terms.
8. EA, NR, HEAT, B cells of the control table: argued, not computed by the author or by me.

## 7. Required repairs
1. Relabel Theorem 2(iii) PROVED-sketch throughout, drop "covering every d-dependence" and "closes a gap in Lemma
   R"; state the hypothesis "beta_c supported at one n, n independent of c"; add the row c_c(x^2 + a) as open.
2. Restate Theorem 5(ii) with the weight-3/2 unary thetas as a third family of characters on squares, and mark
   the Maass/Eisenstein case CLASSICAL-recalled with the source's level hypotheses.
3. Correct the TW cell (root-count bound changes by 3^omega) and the theta-pole condition in section 3.1.
4. Say "three mechanisms in the designs written out" in the verdict; mention the Ramanujan-expansion entry.
