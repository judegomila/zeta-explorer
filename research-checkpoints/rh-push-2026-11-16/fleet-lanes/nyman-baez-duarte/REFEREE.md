# Referee report: nyman-baez-duarte/RESULT.md (2026-11-16)

Verdict: the PROVED claims (A, A0, R, B, C, D) survive re-derivation. Four defects found, all repairable, none
changes an exponent. The obstruction (loop map f(theta)=theta) is real. RH open; nothing assumes RH; no verified-height
restatement is presented as new. Novelty remains unchecked (no literature search was run here either).

## Re-derivations

- (D) duality: (1/2pi)||g|| ||K|| with ||g|| = sqrt(2pi) d_N. Correct.
- Theorem A(i): F_n K = (N/n)^s zeta(1-s) s / (2 (s-rho)(s-2)^3). Pole at rho cancelled by zeta(1-rho)=0, pole of
  zeta(1-s) at 0 cancelled by s. Left shift: |(N/n)^s| <= 1 iff n <= N, |zeta(1-s)| <= zeta(2) on Re s <= -1,
  integrand << |s|^-3. Correct. Uses only the functional equation.
- Theorem A(ii): poles at rho and -2k only; residue formula correct; |r(-2k)| <= k/(4(k+1)^3) <= 1/(4k^2); sum of
  the crude bounds is 0.0632 M^-2 <= M^-2/15. The bound on |Gamma(s) cos(pi s/2)| on Re s = -(2k+1) is correct
  (reflection formula, |sin(pi s/2)| = cosh(pi t/2), cosh(pi t) <= 2 cosh^2(pi t/2)).
- Prop. R: correct (sign of L_K(1/s) from closing to the right is right).
- Theorem B: Mellin representation, pole of What at 0 only, shift to Re w = -(sigma0-theta-delta), second moment of
  zeta on Re s = sigma0 > 1/2 against |s|^-2 (1+|t|)^{2 eps} converges. Correct given the cited bound
  1/zeta << t^eps on Re s >= theta+delta under ZF(theta) (Titchmarsh 14.2 argument with 1/2 -> theta; standard,
  not re-derived here either).
- Theorem C: both cases follow from A, B, R. Correct for sigma0 != Theta.

## Defects

1. Corollary D(1), gap: a zero with beta = sigma0 exactly is covered by neither Theorem A (needs beta < sigma0)
   nor Prop. R (needs beta > sigma0). Repair: for sigma0 < sigma0' < 1, d_N(sigma0') <= sqrt((1-sigma0)/(1-sigma0'))
   d_N(sigma0). (In x-space the residual equals -A_N(1)/x on x > 1, and x^{2 sigma'-1} <= x^{2 sigma-1} on x < 1.)
   A rate eta at sigma0 then transfers to sigma0' = sigma0 + eta/2, where Theorem A applies to the zero. D(1) holds
   after this addition.
2. Theorem A(iii) / Corollary A0 "for N >= 7": with the stated error bound M^-2/15 the right side of (iii) is
   negative for small N (rho_1, sigma0 = 0.8, N = 7: main term 6.5e-3, bound on E 5.4e-2; positive only from
   N ~ 17). The inequality is true but vacuous there. A0 for all N >= 7 needs either the actual E (8.4e-4 at N = 7)
   or the remark d_N > 0 for each N and a smaller constant. Asymptotic statement unaffected.
3. annih.py tests r(s) = s^2/((s-rho)(s-2)^5), not the kernel of Theorem A ((s-2)^3). The MEASURED line in
   RESULT.md therefore refers to a different kernel than the theorem. Rerun below with the stated kernel.
4. Corollary D(4), last sentence: "decay is equivalent to ZF(sigma0) (Prop. R + Thm B)". Only decay => ZF(sigma0)
   is proved (Prop. R). Theorem B needs theta < sigma0 strictly; ZF(sigma0) with zeros on Re s = sigma0 => d_N -> 0
   is not proved in the note. The sentence's conclusion (no decay was known before a zero-free half-plane) stands.
5. Section 3 (DH): the DH functional equation has sin(pi s/2), not cos, in this normalisation, and M = 5N/(2 pi).
   "The cutoff M changes by a constant" omits the kernel change. Section 4's "do not re-attempt other weights /
   dilation sets" is asserted, not proved (plausible: A(i) only needs dilations <= N).

## Numeric reruns (different cases; scripts in /tmp/nbd-ref, not kept in repo)

- Stated kernel (s-2)^3, mpmath 30 digits, T = 300:
  sigma0 = 0.6, N = 40, zero #2: |L(F_n)| <= 1.2e-7 for n <= 40 (truncation level), 1.4e-4 at n = 41;
  L(1/s) = residue + E to 5.7e-9. sigma0 = 0.8, N = 7, zero #1: |L(F_n)| <= 2.9e-8 for n <= 7, 3.0e-3 at n = 8.
- dn.py at a new point (sigma0 = 0.8, T = 1500, J = 60): N = 7, 40, 100: d_N = 0.069664, 0.036853, 0.027527;
  d_N/LB_J = 1.354, 1.181, 1.121; d_N N^{0.3} = 0.125, 0.111, 0.110. Consistent with the table. Same code as the
  author's, so this is not an independent implementation of d_N.
- DH control (python-flint, Hurwitz zeta; functional equation residual 5e-29; off-line zero
  0.8085171825 + 85.6993484854 i): kernel M^s Gamma(s) sin(pi s/2) r(s), M = 5N/(2 pi), sigma0 = 0.9, N = 12:
  |L(F_n^DH)| <= 4e-7 for n <= 12, 7.4e-4 at n = 13; L(1/s) matches the residue at the off-line zero to 1%
  (difference = trivial-pole terms). Prop. R at sigma0 = 0.7 with the same zero: L(F_n^DH) ~ 0 (<= 4e-9),
  L(1/s) = -1/(rho(rho+1)^2) to 4e-9. So for DH the same machinery gives no decay for sigma0 < 0.8085 and
  d_N >= c N^{-0.0915} at sigma0 = 0.9. The arguments do not fail for DH, and should not: they are equivalences
  between rate and zero location, not zero-location theorems. No step uses the Euler product; RESULT.md says so.

## Is the obstruction real

Yes at the level of exponents: upper and lower bounds match (Theorem C), so the neutrality is not the product of a
weak upper-bound method. No way around it was found inside the criterion. What is not covered: sigma0 = Theta
(logarithmic regime), and explicit constants. Neither carries zero-location information by this argument.

## Status of claims

- Unconditional: d_N(sigma0) >= c N^{-(sigma0-1/2)} (c > 0 after defect 2 is patched). This is very likely known
  in substance (Burnol 2002 at sigma0 = 1/2; de Roton's half-plane generalisations); not checked.
- Conditional on the unrefereed 7/8 half-plane: d_N << N^{-(sigma0-7/8)+eps}, constant not explicit. The task's
  request for an explicit unconditional upper bound is not met; RESULT.md says this.
- OPEN items in RESULT.md are labelled as such.
