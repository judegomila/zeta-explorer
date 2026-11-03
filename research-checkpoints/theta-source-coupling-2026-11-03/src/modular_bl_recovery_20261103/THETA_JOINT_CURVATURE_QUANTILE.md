# Joint theta curvature sign: an exact selected quantile test

Status: independent analytic audit PASS. This optimizes a sufficient condition that is strictly stronger than the next-pivot sign; it does not prove that condition for theta.

Let λ=2(F'²−FF'') for the complete theta transform F, and q_n be the actual old-inverse-selected monic residual with positive current parity prefixes. Put D_n=∫λ(q_n')²>0. On the open sets where λ is positive or negative define

 k=λ''/λ,    dμ_+=λq_n²dt on {λ>0},    dμ_-=−λq_n²dt on {λ<0}.

The possible zeros of λ are harmless: the original numerator defines the integrand there, and nonzero real-analytic λ has a discrete zero set. The theta gamma envelope makes the measures finite and ∫|k|dμ_± finite. The complete four-jet identity is

 λ''=2(F''²−F F'''').                                               (1)

For C≥0 the exact positive-part cost is

 I_n(C)=∫(λ''−Cλ)_+q_n²
       =∫(k−C)_+dμ_+ +∫(C−k)_+dμ_-.                                (2)

This retains the joint sign of the assembled theta expressions; no absolute source envelope is introduced. It is convex and differentiable in C, with

 I_n'(C)=−μ_+{k>C}+μ_-{k<C}.                                       (3)

There are no atoms at k=C: otherwise analyticity would give λ''=Cλ identically, impossible for a nonzero Schwartz function. If N_n=μ_-(R)>0, the cost tends to ∞ as C→∞, while I_n(0)≥2D_n. Thus any successful condition I_n(C)≤D_n has a positive finite minimizer C* and the balance law

 μ_+{k>C*}=μ_-{k<C*}.                                              (4)

At such a minimizer, the slope terms cancel, leaving the exact signed threshold expression

 I_n(C*)=∫_{k>C*}k dμ_+ −∫_{k<C*}k dμ_-.                          (5)

If N_n=0, then λ≥0 everywhere by continuity and the fact that q_n is a nonzero polynomial; in that case I_n(C)↓0 as C→∞. This is a conditional observation, not a proof of global theta density positivity.

A simple source-specific impossibility test avoids any minimization. Set

 J_n=∫_{λ<0, λ''>0} λ''q_n²,    N_n*=∫_{same}(−λ)q_n².

Then I_n(C)≥J_n+C N_n*. Thus J_n>D_n rules out the curvature-remainder condition for every C>0; if N_n*>0 and J_n≤D_n, any feasible C must satisfy C≤(D_n−J_n)/N_n*. The audited two-Gaussian model realizes J>D with a positive next pivot. Whether actual theta has any negative-λ region is open, so no theta lobe or inequality is asserted here.

Equations (2)–(5) and the lobe bound are exact reductions of the unproved positive-part criterion, not proofs of it or equivalent reformulations of Q_n≥0. They preserve q_n and its actual old-inverse conditioning, but do not bound its selected mass in any sign sector.

At a simple real zero γ of F, (1) gives λ(γ)=2F'(γ)²>0 and λ''(γ)=2F''(γ)²≥0, so the point lies in the positive-cost region exactly when C<(F''(γ)/F'(γ))². At a zero of order m≥2, λ''/λ is asymptotic to (2m−2)(2m−3)/(t−γ)², so every finite C leaves an active punctured neighborhood. These statements do not establish multiple zeros or bound the selected mass near any zero.
