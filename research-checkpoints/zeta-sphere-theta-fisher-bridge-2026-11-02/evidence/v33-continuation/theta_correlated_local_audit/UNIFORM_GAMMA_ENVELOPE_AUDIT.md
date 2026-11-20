# Independent analytic audit of the uniform envelope

Audited 2026-11-03. Scope: the bound in `EXPLICIT_SELECTED_COMPLEMENT_TAIL.md`, its cell representation, and normalization at a=0. No acquired code was executed.

**Verdict: the stated uniform bound with constant 4100 is valid. In fact its displayed intermediate constants give 4016. No weakening is necessary.**

Put s=σ+it, 1/2≤σ≤1, U=1+|t|, and E=exp(−π|t|/8). All derivatives below are complex derivatives in s (Gamma derivatives are with respect to Gamma's own argument).

## Cell factor and differentiation

The trapezoid identity applied to x^(−s) on [j,j+1] gives the cell integral h_j(s)=1/2 ∫_0^1 u(1−u)(j+u)^(−s−2)du. Summing first in σ>1 gives ζ(s)=1/(s−1)+1/2+s(s+1)H(s), then continuation gives the claimed strip identity. The series of derivatives through order 2 converges normally there: |h_j^(m)|≤j^(−σ−2)log^m(j+1)/12.

Using log(j+1)≤2√j, uniformly in the strip,

|H|≤ζ(2)/12<0.14,
|H'|≤ζ(2)/6<0.28,
|H''|≤ζ(3/2)/3<1.

The last strict inequality follows from the decreasing-integrand bound ζ(3/2)<1+∫_1^∞ x^(−3/2)dx=3. The bound log(1+x)≤2√x follows by differentiation for x≥0. The factorization ξ=KP with K=s(s+1)π^(−s/2)Γ(s/2)/4 and P=1+2s(s−1)H is exact, including s=1 by continuity.

## Rotated Gamma integral

Set z=s/2, x=Re z∈[1/4,1/2], θ=sgn(t)π/4 (either sign at t=0), c=cos θ=1/√2. Contour rotation and differentiation give

Γ^(m)(z)=e^(iθz)∫_0^∞ r^(z−1)e^(−re^(iθ))(log r+iθ)^m dr,

and hence |Γ^(m)(z)|≤E∫_0^∞ r^(x−1)e^(−cr)(|log r|+π/4)^m dr. Small arcs vanish since x>0 and large arcs by exponential decay. Differentiation under the integral is dominated on compact subsets, so no omitted derivative factor occurs.

On 0<r<1 bound r^(x−1)≤r^(−3/4) and e^(−cr)≤1. The m=0,1,2 contributions are respectively 4, 16+π, and 128+8π+π²/4.

On r≥1, r^(x−1)≤r^(−1/2). For m=0 the tail is ≤1/c<2. For m=1, log r≤√r implies tail ≤(1+π/4)/c<3. For m=2, the same bound and √r≤r give the tail at most

∫_1^∞ [r+π/2+π²/16]e^(−cr)dr
=e^(−c)[1/c²+(1+π/2+π²/16)/c]
<2+√2(1+π/2+π²/16)<7<10.

Thus the claimed bounds 6E, 30E, 170E are all safely valid (the second-derivative total is already <163).

## Product constants, including every chain-rule factor

Let b=(log π)/2<0.573 and B=π^(−s/2)Γ(s/2). Since |π^(−s/2)|≤1,

|B|≤6E;
|B'|≤(6b+15)E<18.438E;
|B''|≤(6b²+30b+42.5)E<61.661E.

Let A=s(s+1). Then |A|≤2U², |A'|≤3U, A''=2. Therefore

|K|≤3U²E;
|K'|≤[18+2(18.438)]U²E/4<14U²E;
|K''|≤[12+6(18.438)+2(61.661)]U²E/4<63U²E.

Also |s(s−1)|≤U² and |2s−1|≤2U. Direct differentiation yields

P'=2(2s−1)H+2s(s−1)H';
P''=4H+4(2s−1)H'+2s(s−1)H''.

Consequently |P|≤1.28U²<1.3U², |P'|≤1.12U²<1.2U², and |P''|≤4.8U². The latter uses 0.56+2.24+2=4.8.

The product rule now gives

|ξ|≤3·1.3 U⁴E<4U⁴E;
|ξ'|≤(14·1.3+3·1.2)U⁴E=21.8U⁴E<22U⁴E;
|ξ''|≤(63·1.3+2·14·1.2+3·4.8)U⁴E=129.9U⁴E<130U⁴E.

## Uniform cancellation and endpoint a=0

The normalization is Λ_a(t)=4q_a(t)/a with q_a=Re[ξ'(1/2+a+it) conjugate(ξ(1/2+a+it))]. Functional equation and conjugation imply that on the critical line ξ is real and ξ' is purely imaginary, so q_0(t)=0, including zeros. At fixed t,

∂_a q_a=Re[ξ'' conjugate ξ]+|ξ'|².

Thus |∂_a q_a|≤(130·4+22²)U⁸E²=1004U⁸E² for every a∈[0,1/2]. The fundamental theorem of calculus gives |q_a|≤1004aU⁸E², and hence

|Λ_a(t)|≤4016(1+|t|)^8 exp(−π|t|/4)<4100(1+|t|)^8 exp(−π|t|/4).

At a=0 the continuous normalized limit is 4∂_a q_0(t), so the same bound holds there without division by zero. The proof is unconditional, uniform in shift, and independent of any selected-polynomial or signed-prefix positivity assumption.
