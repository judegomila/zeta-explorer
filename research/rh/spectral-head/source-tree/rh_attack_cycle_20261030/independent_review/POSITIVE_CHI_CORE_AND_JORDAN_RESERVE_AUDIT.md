# Independent audit: positive-chi projection and Jordan reserve

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

**PASS, 30 October 2026.** Elementary operator proof checked independently. No numerical experiment, arithmetic edge estimate or evenized uniform Gram is inferred.

For the actual selfadjoint Fourier contraction C and P_tau=1_[tau,1](C), the spectral inequality `C+I >= (1+tau)P_tau` holds on the complete additive-even Hilbert space. The core-to-core kernel has Hilbert--Schmidt norm <=2/lambda. Compression therefore gives `(1+tau)P_c P_tau P_c <=(1+2/lambda)P_c`. Since `||P_c P_tau||²=||P_c P_tau P_c||`, every threshold-band vector has visible norm squared at least `(tau-2/lambda)/(1+tau)` times its total squared norm.

At tau=1/2, lambda>=8, this is 1/6. Combining the exact positive-half sqrt(2) convention with the finite arithmetic inverse norm <=2lambda gives the improved **raw** Gram `1/(48lambda²)`. The earlier weaker raw theorem remains true and unchanged; this result still does not transfer automatically through physical reflection averaging.

On the full threshold band set `V=P_tau P_v P_tau`, `D=I+C` and `S=D^(1/2)`. The main cross form is `A=(VD+DV)/2`. Exact expansion proves

`A=SVS+1/2[S,[S,V]]`.

Centering S at the midpoint of [sqrt(1+tau),sqrt(2)] and V at I/2 gives centered norms at most `d_S/2` and `1/2`. Twice applying the commutator norm inequality yields `||1/2[S,[S,V]]||<=d_S²/4`. Also `SVS>=v0 D>=(tau-2/lambda)I`. Thus the stated lower reserve

`gamma=lambda,tau: tau-2/lambda-(sqrt(2)-sqrt(1+tau))²/4`

is valid. At tau=1/2, lambda>=8 it is at least `(4sqrt(3)-5)/8 = 0.2410254... >0.2410`. Its limiting sufficient reserve is `(4sqrt(3)-3)/8 >0.4910`.

The mean-zero restriction is made only **after** proving these inequalities on the full signed threshold range. No commutation with mean removal is required. The square-root S is distinct from output evenization S_even.

For the conditional consequence, define `L_even` as the even extension of `U^-1 T_ar^-1 S_even E_raw u`, so its norm is at most `2sqrt(2)lambda ||S_even E_raw u||`. The complete defect is the exact difference `Rcal_even=2L_even-P_v(I+C)u`. If its signed pairing is >=-kappa||u||² with kappa<gamma, Cauchy--Schwarz gives the asserted evenized norm floor `(gamma-kappa)/(4sqrt(2)lambda)`. This is a sufficient conditional inequality, not an established edge estimate. The expanded Poisson/Mobius/trace-repair formula for the defect has its own separate review; this receipt does not silently certify an omitted-shell truncation.

The result strengthens the known main leg without using a prime cancellation hypothesis. It proves no actual Weil transition reserve, exterior complement gap, cofinal floor or RH conclusion. Comparing this scalar reserve with an exploratory floating edge eigenvalue does not constitute absorption.
