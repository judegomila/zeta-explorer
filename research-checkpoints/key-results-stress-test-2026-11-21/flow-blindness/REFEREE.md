# REFEREE — flow-blindness (second pass, 2026-11-20)

Scope: attack the first reviewer's verdict (NOTES.md / VERDICT.md). My scripts and outputs: `referee/ref1.py .. ref5.py`, `referee/out_*.txt`. All runs under `scripts/memcap.sh 8`.

## 1. What I re-ran (independent code path)

The first reviewer used mpmath with fixed 384-node Gauss-Legendre. I used python-flint (Arb) ball arithmetic, adaptive `acb.integral`, 400-bit precision, 25 theta terms, and an interval-Newton test (N(B) = z0 - H(z0)/H'(B) contained in B) instead of a residual. None of their scripts were re-executed.

| Item | First reviewer | Referee (Arb) |
|---|---|---|
| H_0(3), H_0(30) vs xi/8 | rel. 1e-99 | agree to all 30 printed digits (0.0589866171381479671344708094699; -8.82122448526934275788281298432e-5) |
| non-real zero of H_{-4} | 66.2301880343665394 + 0.3010780449295698 i | 66.23018803436653941724943111795995 + 0.30107804492956982455019541919097 i; interval Newton contained at box radius 1e-20 (not at 1e-3, 1e-6: ball too wide) |
| collision of zeros 4,5 | t = -3.9533575 | two real sign changes in [58,70] at t = -3.9 and -3.95, none at t = -3.96 and -4.0 (bracket [-3.96,-3.95], consistent) |
| K-Bessel exp(-cosh u), t = -1.5, box Re(8,16) | 6 zeros with abs(Im)<5, 2 with abs(Im)<0.02; no zero located | argument principle 6.0000000 and 2.0000000; explicit zeros 11.63501611224055772326 + 1.282637043196349062890 i and 13.27483144321376102723503 + 0.04976625678066794531622587 i, both passing interval Newton (radius 1e-25 / 1e-20, 1e-30); real zeros near 14.585 and 15.545 |
| exp(-abs(x) - c x^2) 3x3 minor | -0.118 (c=0.1), -0.022 (c=1) | negative as well: -0.1725 (c=0.1), -0.0410 (c=1) over 4000 random draws on [-3,3] (different sampling, so different minima); c=0 gives 0 to rounding; Gaussian alone positive |

Caveat on "certified": the Arb balls do not include the truncation of the theta sum (n <= 25) or of the u-range (1.5 for zeta, 12 for K-Bessel). Those tails are below 1e-500 but were not bounded formally. So: high-precision ball evidence, not a formal certificate.

Abandoned: a sign-change scan of H_t on [0,200] for t = -0.5..-3 (killed after 11 minutes without output; too slow at 400 bits). Nothing is claimed from it.

## 2. Additional controls the first reviewer did not run

1. Quartic profile exp(-u^4) (classical example where Gaussian damping never produces non-real zeros; de Bruijn-Newman constant -infinity). Real sign changes on [0,30] against argument-principle count in the box abs(Im)<6: t=0: 12/12; t=-1: 11/11; t=-5: 7/7; t=-20: 0/0 (zeros have moved out of the window). So there is a non-arithmetic family for which the same "no-go" is empty. Together with K-Bessel (non-arithmetic, real zeros classical, constant finite) this shows the argument tracks only whether the family's de Bruijn-Newman constant is finite / non-negative, not arithmeticity.
2. Phi itself fails total positivity at order 5. The Toeplitz minor det[Phi(abs(u0+(i-j)h))], (u0,h) = (0.01,0.05): orders 2,3,4 positive (0.0341, 6.98e-4, 3.83e-6); order 5 = -1.847e-9 (normalised -1.04e-7), 120-digit floating point. This matches the configuration reported in arXiv:2602.20313 (Michalowski, "certified failure at order five"; preprint, not refereed, v2 withdrew other claims). At the same configuration the damped profile gives a positive 5x5 minor (+7.1e-9 at eps=1, +7.4e-7 at eps=4, normalised). So "total positivity" is not a property of Phi at all, and the paper's Lemma 1 sentence is wrong on two counts: the closure claim is false in general and the premise fails for Phi. The first reviewer's random search (orders 2-4 only) could not have seen this.

## 3. Is "confirmed-weaker-statement" deserved?

Yes. What is established is the three-line contrapositive. I could not fault the first reviewer's eight listed errors; I re-derived 1 (numerically), 3 (K-Bessel + quartic), 4 (logic), 5 and 8 (read the Lean file and the graded-results line). Points where I adjust or add:

- (adjust, minor) Error 4 says Rodgers-Tao is "never" needed. That holds for classes closed under damping (small-eps closure iterates). The paper's Theorem 1 also covers a subclass that merely contains {Phi_eps : 0 < eps < eps0}; for that form one needs Lambda > -eps0, i.e. Rodgers-Tao for arbitrary eps0. The first reviewer's NOTES say this; the JSON wording is slightly too strong.
- (add) A much cheaper no-go exists and makes the Rodgers-Tao route unnecessary for the properties that actually satisfy closure. Evenness, positivity, log-concavity and double-exponential decay were never candidates for implying real zeros: exp(-cosh u - 1.5 u^2) has all four and its transform has the zero 11.635 + 1.283 i. So the class of "proofs" the lemma excludes, restricted to the properties for which closure is proved, was already empty for classical reasons. The lemma has content only for a hypothesis that (a) holds for Phi, (b) is closed under damping, and (c) is not already known to be insufficient; the material exhibits no such hypothesis.
- (add) The hypotheses that the project's own programme uses (kernel PSD = Hermite-Biehler, Weil positivity, Li, Nyman-Beurling) are RH-equivalents or strip-equivalents and are not closed under damping; the lemma says nothing about them. The T3 corollary is therefore not a consequence (the first reviewer's error 2 says the same in different words).
- (add) Lean: no `.lake` directory exists, so nothing was rebuilt by either reviewer. "No sorry/axiom" is from reading the source and from ARISTOTLE_SUMMARY.md (the tool's own report). The grade "kernel-verified" on the public list is therefore not something either pass re-checked. The Lean theorems F1/F2 are statements about an arbitrary `H : R -> C -> C`; with `IsDBNConstant` and `0 <= Lambda` as hypotheses F1 is `Lambda <= -eps` plus `linarith`. This is a formalisation of a propositional skeleton, not of the analytic statement.

## 4. Literature (my own searches: 7 web searches, 4 page fetches)

- Tao's 2018 post on the Rodgers-Tao paper describes Newman's conjecture as saying that reality of the zeros "is destroyed by applying heat flow for even an arbitrarily small amount of time", and adds that the result does not make RH easier and confirms its delicate nature. That is the supported statement in prose. The Newman-Wu survey (arXiv:1901.06596) reviews the same reading of "barely so" and gives examples of measures with different constants.
- Newman 1976 (Proc. AMS 61, 245-251): abstract states that the class of even measures rho for which the transform of exp(-b t^2) d rho has only real zeros for every b > 0 is completely determined, and applies it to get Lambda > -infinity. So "which profiles are immune to Gaussian damping" is itself a 1976 theorem. I did not retrieve the explicit form of the class from the paper; the quartic example is from memory of the Lee-Yang/Polya literature and is supported here only by my counts.
- Groechenig, arXiv:2007.12889 (Schoenberg's totally positive functions and zeta): an RH-equivalent total-positivity condition. Total positivity in this setting is a zero-location statement, not a soft one.
- Michalowski, arXiv:2602.20313: Phi(abs(u)) not PF_5 (unrefereed preprint; my floating-point replay of one minor agrees in sign).
- Dobner 2021, Csordas-Norfolk-Varga 1988, Polymath15: as cited by the first reviewer; not re-fetched.
- I did not find the sentence "no class closed under Gaussian damping implies real zeros" stated as a numbered theorem. Given Tao's sentence above, I regard it as known content rather than as an unstated corollary. No novelty is claimed.

## 5. Scores

- Verification: confirmed-weaker-statement (unchanged).
- Novelty: known-in-different-form (unchanged).
- Arbitrariness: 3 (first reviewer: 2). The bare statement is parameter-free, but its meaning depends entirely on which hypotheses are declared "soft", and "soft" is in effect defined as "survives this particular deformation". Other deformations give other no-go lists; the Gaussian one is singled out because a theorem (Lambda >= 0) is available for it. One listed member (total positivity) fails for Phi itself; another (kernel positivity) is not invariant. In the other direction: the deformation is the standard de Bruijn-Newman one and there are no tuned constants, so not 4-5.
- Importance: 1 (first reviewer: 2). The supported statement is a published theorem read backwards and is already in prose in the standard exposition. It moves no bound, excludes no approach that anyone has proposed (the properties with proved closure were classically insufficient; the programme's actual hypotheses are not closed), and its distinctive conclusions ("arithmetic input is required", "only lever is verified height") do not follow. Its residual use is as an internal checklist item.

## 6. One-line statement that holds

"If a set of conditions holds for the de Bruijn-Newman profile and is preserved under multiplication by exp(-eps u^2), it cannot imply that all zeros are real; this is the theorem Lambda >= 0 (Rodgers-Tao 2020) read contrapositively, and the Lean file states it abstractly with Lambda >= 0 as a hypothesis."
