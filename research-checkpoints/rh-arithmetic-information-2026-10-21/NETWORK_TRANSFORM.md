# Positive jump energy, signed defect, and the missing global inequality

Let `I=(-L,L)`, `c(x)=cosh(x/2)`, `s(x)=sinh(x/2)`, and `c0=log(2pi)+EulerGamma`. Separate the exact pole form

`P[f]=2|<c,f>|^2-2|<s,f>|^2`, `Q0=Q-P`.

Write `k(r)=exp(-r/2)/(1-exp(-2r))`, `d_n=log n`, and `a_n=Lambda(n)/sqrt(n)`. The positive symmetric conductance measure on `I^2` consists of `k(|x-y|)dxdy` and both allowed prime-shift edges of mass `a_n dx`. Both endpoints of every shift must remain in `I`.

For smooth positive `w` bounded above and away from zero, set `f=wg`. The exact ground-state identity is

`Q0[wg] = J_w[g] + integral_I D_w(x)w(x)^2|g(x)|^2 dx`,

`J_w[g]=(1/2) integral_(I^2) w(x)w(y)|g(x)-g(y)|^2 K_L(dx,dy)`, `D_w=(Q0 w)/w`.

The diagonal renormalization is essential: the archimedean operator has contact term `-log(epsilon)-c0` when the kernel is truncated at separation `epsilon`. Its equivalent closed-form representation includes the boundary potential `-c0-(1/2)log(L^2-x^2)`. One must not subtract divergent integrals separately or omit the boundary term. Bounded Lipschitz multiplication preserves the logarithmic form domain, so the identity extends from a smooth core to `D_L`.

`J_w` is a nonnegative conservative reversible jump energy on its maximal regional domain. The full `Q0` retains the signed potential `D_w`, and `Q` also retains `P`. Neither full operator is just that conservative Markov generator. The general ground-state identity is classical; see [Frank–Seiringer, Proposition 2.3 and Remark 2.4](https://arxiv.org/abs/0803.0503).

## Canonical weight and exact central defect

For `w=c`, put `A=integral_I c^2=L+sinh L`, `X=exp L`, `psi(X)=sum_(n<X)Lambda(n)`, and `M(X)=sum_(n<X)Lambda(n)/n`. The completed row `delta_c=(Qc)/c` has

`D_c(0)=-c0-log(X-1)-psi(X)-M(X)`,

`delta_c(0)=X-psi(X)+log X-M(X)-c0-1/X-log(1-1/X)`.

The included exact-rational checker independently reproduces these outward intervals:

- At `L=1/5`, `(Qc)(0)` lies in `[-0.104698924425,-0.104598924424]` and `(Q1)(0)` in `[-0.103371719115,-0.103271719114]`.
- At `L=6/5`, `(Qc)(0)` lies in `[-0.342374757524,-0.342274757523]` and `(Q1)(0)` in `[-0.290612023841,-0.290512023840]`.

Both pole-removed rows are negative too. These exclude the two canonical weights as pointwise nonnegative-row certificates, not as weights in a valid integrated inequality. In particular, the internally positive `L=6/5` form can have these negative rows.

Classically `M(X)=log X-EulerGamma+o(1)`, hence `delta_c(0)=X-psi(X)-log(2pi)+o(1)`. Littlewood's two-sided oscillations therefore give negative excursions of exponential size in `L`; a subexponential pointwise lower loss for this row is false. The form can still compensate by network energy. See [Platt–Trudgian, equation (2)](https://arxiv.org/abs/1407.1914) and [Lay, introduction](https://arxiv.org/abs/1505.03589).

## The signed variance cannot be dropped

Define `nu(dx)=c(x)^2 dx/A` and `tau=tanh(x/2)`. For complex `g`, the exact identity is

`Q[cg] = J_c[g] + A E_nu[delta_c |g|^2] - 2A^2 {Var_nu(g)+|E_nu(tau g)|^2}`.

Although the pole kernel is pointwise positive, its form has one positive and one negative direction. Absorbing its row introduces the displayed **negative variance correction**. Even hypothetical pointwise `delta_c>=0` would not prove the form positive.

For a proposed floor `-epsilon(L)`, the missing inequality is

`J_c[g]/A + E_nu[delta_c |g|^2] >= 2A {Var_nu(g)+|E_nu(tau g)|^2} - epsilon(L) E_nu|g|^2`

for every `g` with `cg in D_L`. On the pole-moment-zero subspace `E_nu g=E_nu(tau g)=0`, the equivalent target uses `D_c` instead and no pole term. No all-support estimate of the required subexponential loss has been proved. An entropy-decay theorem for the conservative network does not compare this signed potential and variance cost automatically.
