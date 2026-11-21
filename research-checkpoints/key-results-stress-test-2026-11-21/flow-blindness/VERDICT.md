# VERDICT — flow-blindness

**Statement supported.** Let C be a set of profiles containing the de Bruijn-Newman profile Phi and closed under Psi -> exp(-eps u^2) Psi (eps>0). Then membership in C does not imply that the cosine transform has only real zeros, because H_{-eps} has a non-real zero. Input: Lambda >= 0 (Rodgers-Tao 2020), or, for the form with closure under all eps, only Newman's 1976 Lambda > -infinity.

**Status.** Correct as a contrapositive of a published theorem. Three-line proof. The Lean file (formalization/lean-aristotle/flow_blindness/RequestProject/Main.lean) formalises an abstract skeleton: H is an arbitrary family, the de Bruijn-Newman characterisation, 0 <= Lambda and the flow identity are hypotheses; zeta does not appear. No sorry/axiom/native_decide. Not rebuilt here (no Mathlib build present); checked by reading.

**Replayed.** H_0 = xi/8 to 1e-99. (log Phi)'' <= -74.9 on [0,1.4]. H_{-4} has the non-real zero 66.2301880344 + 0.3010780449 i; zeros 4 and 5 collide at t = -3.9533575. For t = -0.1, -0.5 no non-real zero up to height 150: for small eps the claim rests on the cited theorem only.

**Defects.**
1. Paper Lemma 1: "Polya class closed under multiplication" is false (exp(-|x|-0.1x^2) has a 3x3 minor of normalised value -0.118). Phi is not PF_infinity in any case. Drop total positivity from the soft class.
2. T3 corollary lists kernel positivity as flow-invariant and then shows it fails for Phi_eps. Reword: flow-invariant properties cannot establish kernel positivity.
3. "Arithmetic input is required" is not a consequence. The consequence is "a property not preserved by Gaussian damping is required". Control: the K-Bessel profile exp(-cosh u) (non-arithmetic, real zeros by Polya) acquires 4 non-real zeros in Re z in (8,16) at t = -1.5, so the same no-go applies to it. Dobner 2021 gives Lambda_F >= 0 on the extended Selberg class without Euler product.
4. The listed wording "SL2/de Bruijn flow" misreads a lemma label (SL2) as a group. No SL_2 appears.
5. "Rests on Rodgers-Tao" overstates the dependence for the corollary; Newman 1976 suffices when the class is closed under all eps.
6. The class of "soft" hypotheses is not a defined set; closure is proved only for evenness, positivity, log-concavity and decay bounds.

**Does it distinguish zeta?** Only through Lambda >= 0. The Polya control showed no collision down to t=-20 below height 150; the K-Bessel control shows collisions at t=-1.5; the abstract theorem applies to any family with a finite de Bruijn-Newman constant.

**Literature.** Newman 1976; Rodgers-Tao 2020; Dobner 2021; de Bruijn 1950. The corollary was not found stated as a theorem in 5 searches; it is the standard meaning of "RH, if true, is only barely so".

**Scores.** Arbitrariness 2 (canonical flow, no constants; the class "soft" is loosely drawn). Importance 2 (a restatement of a known theorem as a filter on proof strategies; a specialist learns nothing new; useful for internal triage of positivity/de Branges-type attempts). No consequence for bounds on Lambda.

**Public wording that holds.** "Any set of conditions on the profile that contains Phi and is preserved under multiplication by exp(-eps u^2) cannot imply that all zeros are real. This is a reformulation of Lambda >= 0 (Rodgers-Tao); an abstract version is checked in Lean with Lambda >= 0 as a hypothesis."
