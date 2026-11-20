# Direct fractional-power-head and relative-column obstruction

2026-11-04. Analytic consequence of the new fixed-natural-row theorem and the selected simple-zero resonance theorem. No IMS argument, inverse-decay theorem, uniform Riesz bound, or Q positivity is used. The fixed-row theorem and the transfer below are independently audited in INDEPENDENT_ANALYTIC_AUDIT.md.

## 1. Setup and inputs

Fix parity ε and index degrees d_j=ε+2j. Let ψ_j denote the ordinary W_* orthonormal natural Pollaczek polynomial of degree d_j, with W_*=|Γ(9/4+it/2)|². Put

    s_j=√X[ψ_j],   e_j=ψ_j/s_j,
    q_n=P_(d_n)/√A_(d_n)=Σ_(j=0)^n c_(j,n)e_j.

All leading coefficients are positive, so c_(n,n)>0.

Section 2, equation (2), of `../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md` gives the all-polynomial natural-reference comparison. Applied to these coordinates it gives

    ∥q_n∥²_(W_*)≤exp[C log²(n+2)],
    s_j²≤C(j+1)^3.

Since the ψ_j are orthonormal,

    ∥q_n∥²_(W_*)=Σ_(j≤n)|c_(j,n)|²/s_j².

Therefore, with a different constant C,

    ∥c_(:,n)∥₂≤exp[C log²(n+2)].                       (1.1)

This includes c_(n,n)≤exp[C log²(n+2)]. It uses the general natural-reference upper bound, not any delicate adjacent source-norm ratio.

For any fixed selected polynomial q_i, the new theta-convolution theorem gives

    a_j:=X(t²e_j,q_i),
    |a_j|≤C_i exp(−c_i j^(1/3)).                        (1.2)

Here t²e_j is paired exactly with q_i; the corresponding scalar integrand is t²Lq_i, covered by the polynomial-times-products extension in `FIXED_ROW_STRETCHED_EXPONENTIAL.md`.

Finally, the selected resonance theorem forbids every stretched-exponential bound for X(t²q_n,q_i), including in this parity index. See `../theta_selected_column_locality_20261104/NO_FAST_SELECTED_MULTIPLICATION_TAIL.md`.

## 2. Concrete split estimate

For any 0≤m≤n, exact synthesis and Cauchy–Schwarz give

    |X(t²q_n,q_i)|
      ≤ C_i ∥(c_(j,n))_(j≤m)∥₂
         + exp[C log²(n+2)] (Σ_(j>m)|a_j|²)^(1/2).

The tail in (1.2) is at most C_i exp(−c_i′m^(1/3)), after decreasing its positive exponent constant to absorb the polynomial factor from the tail integral. Thus

    |X(t²q_n,q_i)|
      ≤ C_i ∥c_[0,m],n∥₂
        +C_i exp[C log²(n+2)−c_i′m^(1/3)].              (2.1)

This retains all signs and cross terms. It uses Cauchy–Schwarz only to bound two exact synthesis sums; it makes no diagonal replacement of a quadratic form.

## 3. Fractional-power-head theorem

Fix δ∈(0,1] and put m_n=floor(n^δ)/2 rounded down. There do not exist K,γ,α>0 such that

    ∥c_[0,m_n],n∥₂≤K exp(−γ n^α)

for all sufficiently large n.

Indeed, (2.1) would give a stretched-exponential selected row bound with positive exponent min(α,δ/3), since log²n=o(n^(δ/3)). This contradicts resonance.

The same theorem holds for the relative head

    ∥(c_(j,n)/c_(n,n))_(j≤m_n)∥₂.

A putative stretched-exponential upper bound for this head, multiplied by the upper bound on c_(n,n) in (1.1), still gives a stretched-exponential upper bound for the absolute head, yielding the same contradiction.

The conclusion is a failure of a uniform eventual upper bound. It does not give a positive lower bound at every degree, nor identify which particular low coefficient carries the mass.

## 4. Consequence for relative inverse-Gram localization

For the finite actual natural Gram G_n, the last selected synthesis column is

    c_(:,n)=G_n⁻¹e_n^(coordinate)/√((G_n⁻¹)nn).

Thus

    c_(j,n)/c_(n,n)=(G_n⁻¹)jn/(G_n⁻¹)nn.

Neither of the following can hold with constants K,C,γ,α independent of j,n:

    |c_(j,n)|≤K exp[C log²(n+2)] exp(−γ(n−j)^α),

    |(G_n⁻¹)jn/(G_n⁻¹)nn|≤K exp(−γ(n−j)^α).

In either case take j≤floor(n/2); summing the squares costs at most n+1 and gives a forbidden stretched-exponential low-head bound. More generally a quasi-polynomial prefactor exp[C log²(n+2)] in the relative bound is also excluded, using (1.1) once more.

This directly strengthens the uniform absolute synthesis-column obstruction. The constants in the fixed natural Gram row bound may depend on the fixed row; no uniform two-index Gram locality is needed.

## 4a. Optional quantitative obstruction on a polylogarithmic head

Let C_0 be the fixed log-squared comparison constant in Section 3 of the selected resonance theorem. Its quantitative version excludes every eventual fixed-row estimate

    |X(t²q_n,q_i)|≤K exp[−B log²(n+2)]   with B>C_0.

Changing from degree ε+2n to parity index n changes only a polynomial factor in the complex evaluation estimate, so it does not change this strict-threshold statement.

Fix one row i, a number B>C_0, and the constants C,c_i′ in (2.1). Choose a finite L>0 so large that

    c_i′ L^(1/3)−C>B.

Put m_n=min(n,floor(L log^6(n+2))). Eventually the minimum is its second argument. Rounding contributes only o(1) to m_n^(1/3)−L^(1/3)log²(n+2), so the strict gap above ensures

    exp[C log²(n+2)−c_i′m_n^(1/3)]
       ≤K_0 exp[−B log²(n+2)]

eventually, for a fixed K_0. Equation (2.1) and the quantitative resonance theorem now show that there is no K>0 for which

    ∥c_[0,m_n],n∥₂≤K exp[−B log²(n+2)]

holds for all sufficiently large n. Equivalently, the product of this head norm and exp[B log²(n+2)] has infinite limsup. This is an obstruction along subsequences, not a lower bound at every n.

For the relative head, let C_diag be a constant for c_(n,n)≤exp[C_diag log²(n+2)] from (1.1). Every exponent B_rel>B+C_diag is excluded in the same way:

    ∥(c_(j,n)/c_(n,n))_(j≤m_n)∥₂
       ≤K exp[−B_rel log²(n+2)]

would imply the prohibited absolute estimate. Constants L and B_rel here may depend on the chosen fixed row and threshold. No universal numerical constants are asserted.

The heads in Section 3 have fractional-power size n^δ for fixed δ>0; they are not called subpower here. The log^6-sized head in this subsection genuinely has subpower size, since log^6 n=o(n^δ) for every fixed δ>0.

## 5. Scope and verification boundary

The proof uses three separately identifiable ingredients: actual source/reference comparison, fixed natural-row theta convolution decay, and selected simple-zero resonance. It does not invert an infinite matrix, invoke an unproved uniform condition number, or assume positivity of X−H.

It makes no positive or negative claim about H[P_n]/A_n or U_n/Δ_n, and no RH claim. Failure of these localization hypotheses does not preclude different signed-cancellation estimates or weaker localization.

All work is in a new package. No frozen artifact or live 4CT file was modified.
