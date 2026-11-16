# REFEREE: b-volterra-norm (2026-11-16)

Verdict under review: precise-obstruction. Referee outcome: **core holds; one mislabelled status and three overstatements must be corrected.** No zero-free region or Lambda bound is claimed, and none follows.

## Re-derived (all confirmed)

- T1(a). k(t,s) = p(t)q(s) - q(t)p(s); V - V* = p(x)q - q(x)p on the full square; singular values G, G; ||V||_HS^2 = G^2; G^2 = (E_+E_- - I^2)/4 via |p|^2 = (C-I)/2, |q|^2 = (C+I)/2, <p,q> = S/2. Correct.
- T1(b). Monotone in a for Phi >= 0. Correct.
- T1(c). Test-pair formula re-derived. Correct.
- T2. M_eps conjugation is immediate. T/H strictly increasing and unbounded; unique y0 > a when T(a) < H(a); E#(z0) != 0. Correct.
- T3. Re-derived m'' = (a^2 + a z Phi^2) m from Y' = zJvv^T Y line by line. Correct.
- Section 5 identity. Re-derived b_a(s,t) = 2 int_0^inf Phi(s+r)Phi(t+r) sinh(a(s+t+2r)) dr, then the parity reduction to the lower limit |s+t|/2. Correct (with the e^{-izs} convention, E_a is the transform of phi_+).

## Reruns (different cases, scripts in /tmp/ref_bv*.py, not kept in the slug)

- Arb, different truncation and precision (N = 8, U = 3/2, prec 110): G(31.6214) in [1.00001430965153400 +/- 2.5e-18], matching cert.out to all printed digits.
- Arb test-pair lower bound at a = 31.6214, two formulations: the author's ball-endpoint nesting gives [1.000004419443 +/- 8.6e-13]; an exact-endpoint reformulation (s = t x, inner integral over [0,1], so no inexact integration endpoint) gives [1.000004419443 +/- 2.0e-13]. Arb comparison `> 1` returns True in both. This removes the one interval-rigor question (inner integrals with ball-valued endpoints).
- New case a = 31.62137: G in [1.0000059987 ...] > 1 and test-pair in [0.999996108437 +/- 9e-13] < 1. The bracket does not decide this a, consistent with the claimed interval (31.6213, 31.6214) and with the float a* = 31.621366.
- Float Nystrom (n = 1400): ||V|| = 4.575670e-4 at a = 0.5; 0.99998159 at 31.6213; 1.00000929 at 31.6214. Matches.
- Section 5 identity at new points: a = 1.3, z = 0.7+0.4i, w = -0.3+0.9i, relative error 3e-14; a = 0.25, z = 2+0.2i, w = 1+0.5i, 6e-14.
- T2 new instance t0 = 0.25: y0 = 25.5168, no other sign change on [0, y0), K(z0,z0) < 0 at a = 1, 5, 20.
- Tails: exp(-2 pi e^8 + 4a) times the omitted prefactor 4 pi^4 e^36 is about 1e-8061; series tail at N = 12 is below 1e-229 relative. Both by hand, both far below the margins 1.3e-5 and 4.4e-6. Accepted as stated (hand bound, not machine-checked).

## Errors

1. **Normalization slip, factor 2, in section 5 and the Notation line (status mislabel).** With the Phi written in RESULT.md, Xi(w) = xi(1/2 + i w/2)/4, not a function of 1/2 + i w. Checked numerically: Xi(0.6i) = 0.124538879062723 = xi(0.2)/4; Xi(2*14.1347...) = 3e-19 while Xi(14.1347...) = 0.0371. So E_a(z) = xi(1/2 + a/2 - iz/2)/4, the zero strip of Xi is |Im w| < 1, and:
   - "b_a >= 0 CLASSICAL for a >= 1/2" is wrong. Classical is a >= 1. For a in [1/2, 1) the statement is zero-freeness of Re s > 1/2 + a/2 (down to 3/4), which is not known. A CLASSICAL label sits on an OPEN statement.
   - "a >= 3/8 restates Re s > 7/8" is wrong. The correct value is a > 3/4. a = 3/8 would be Re s > 11/16.
   - "poles at Im z = 1/2 + a" should read 1 + a.
   - The MEASURED rows at a = 0.5 and 0.375 are therefore in the open range, not the known range. They carry no evidential weight either way (the result says so).
   T1, T2, T3 do not depend on this.
2. **"Decided by three moments of Phi^2" is overstated.** Three moments give G/2 <= ||V|| <= G, which decides only when G <= 1 or G > 2. On the window 1 < G <= 2 (a in about (31.62135, 34.0558]) the decision used a double integral (test pair) plus monotonicity, and monotonicity needs Phi >= 0. For a general real Phi the bracket leaves that window undecided.
3. **T2's "hence blind to zeros" is wider than what T2 proves.** T2 rules out implications of the form "gauge-invariant functional of the V family => K_a >= 0" that are valid for all real Phi. It does not rule out arguments that also use Phi >= 0: for a nonnegative Phi the family determines Phi^2 and hence Phi and Xi completely. The sign-flipped kernels are discontinuous and not nonnegative. The scope note in RESULT.md mentions autocorrelations but not this simpler loophole. The DH computation below closes it more cleanly than T2.
4. **DH control was asserted, not computed.** Done here (MEASURED, float + mpmath): Phi_DH(u) = 4 e^{3u} sum c(n) n exp(-pi n^2 e^{4u}/5), c = (1, kappa, -kappa, -1, 0) mod 5. It is even (Phi(u) = Phi(-u) to 12 digits at u = 0.05, 0.1, 0.2) and positive on [0, 1.5] (the n = 1 term dominates for u >= 0). Its transform vanishes at w = 171.398697 - 0.617034i, i.e. s = 0.808517 + 85.699349i, and K_{0.3} is negative there (|E|^2 - |E#|^2 = -3.6e-58). Yet ||V_{a,Phi_DH}|| = 0.0616, 0.124, 0.806 at a = 0.5, 1, 5 (in this normalization; it exceeds 1 by a = 10). So a positive even theta-type kernel with off-line zeros satisfies ||V|| <= 1 on the whole band where its K_a fails. The RESULT's DH sentence is correct; it now has a computation behind it. The threshold depends on the scalar normalization of the kernel, which is the homogeneity point the repo already records.
5. **Headline wording.** "False for all a > 0" should read: the statement "for every a > 0, ||V|| <= 1" is false; for each a <= 31.6213, which includes the whole range a < 1 where zeros could matter, ||V|| <= 1 is true and proved without any zero information.

## Checks requested by the task

- RH assumed anywhere: no. Verified height restated as new: no.
- Interval rigor: signs are decided by Arb balls, not floats. Tail bounds are by hand and disclosed. One rigor question (ball endpoints) cleared by an independent formulation.
- Novelty: the falsity above a* ~ 31.62 (float), the homogeneity artifact and the RH-equivalence of the degree-0 target were already in the repo (imp-2660, imp-2666, imp-2851, section26). New here: the Arb-certified canonical bracket, the sign-gauge lemma, the explicit b_a formula. The Bezoutian/Hankel equivalences are classical; the density step K_a >= 0 <=> b_a >= 0 remains a sketch.

## Surviving claim

||V_{a,Phi}|| <= 1 holds for canonical Phi exactly when a <= a*, a* in (31.6213, 31.6214) (Arb enclosures plus hand tail bounds), and G/2 <= ||V|| <= G for every real Phi. The V family depends on Phi only through Phi^2, and a positive even kernel with off-line zeros (Davenport-Heilbronn) satisfies the same norm bound, so the bound carries no zero information. The replacement b_a >= 0 is an exact identity for K_a; it is classical for a >= 1, equivalent to the unrefereed 7/8 half-plane for a > 3/4, and RH for all a > 0. No Euler-product input enters. Nothing moves.
