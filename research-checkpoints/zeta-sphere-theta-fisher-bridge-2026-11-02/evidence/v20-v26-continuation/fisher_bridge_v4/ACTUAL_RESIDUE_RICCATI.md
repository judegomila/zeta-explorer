# Actual spatial residue conditioning, Christoffel recursion, and parity forcing

2026-11-03. New analytic derivations; independent review pending. No new numerical rung and no all-order positivity claim. Archived v19 unchanged.

## 1. Retain the residue in the actual spatial metric

For h>=0 put z_n=πn²e^(2h), f_n=e^(h/2)4z_n(2z_n−3)e^(−z_n), and

Ψ_A(h)=Σ_n f_n(h) A(z_n),
χ(h)=Σ_n e^(h/2)4z_n e^(−z_n),
ℓ(A)=E[(2Z−3)A(Z)]=2E[ZA'(Z)], Z~Gamma(3/2,1).

The exact graded theta feature is F_A=Ψ_A−ℓ(A)χ. The triangular derivative-polynomial basis spans every polynomial filtration; its fixed parity subspaces must still be retained when studying the target.

Use the genuine half-line spatial inner product

⟨f,g⟩_t=∫_0∞ h e^(2th) f(h)g(h)dh, |t|<=1/2.

This is the ACTUAL positive parent metric, not an orbit Gram. For any polynomial basis A_i define H_ij=⟨Ψ_Ai,Ψ_Aj⟩, u_i=⟨Ψ_Ai,χ⟩, q=⟨χ,χ⟩, and e_i=ℓ(A_i). Then its actual corrected parent Gram is exactly

G=H−u e^T−e u^T+q e e^T.                                (1)

Every entry uses products of orbit means after spatial integration. No orbit covariance has been dropped. In particular this rank-two identity is directly in the positive parent that feeds the v2 regression formulas.

## 2. A degree-independent raw spatial upper bound

The audited first-orbit mass bound gives ψ<= (401/400)f_1 on h>=0. Also f_n<=8e^(h/2)z_n²e^(−z_n). Orbit Cauchy implies

|Ψ_A|² <= ψ Σ_n f_n |A(z_n)|².

For the n-th term change variables z=πn²e^(2h). Combining the factors gives

||Ψ_A||_t² <=16(401/400)π^(−t−1/2)
 ×∫_π∞ log(z/π) z^(t+7/2)e^(−z)|A(z)|²
   [Σ_(n<=sqrt(z/π)) n^(−2t−5)e^(−z/n²)] dz.

Since |t|<=1/2, π^(−t−1/2)<=1, the bracket<=Σn^-4<2, z^(t+7/2)<=z^4, and log(z/π)<=z. Therefore

||Ψ_A||_t² <=33∫_π∞ z^5 e^(−z)|A(z)|²dz                 (2)

uniformly in degree and |t|<=1/2. This is only an upper bound on the raw sampled feature, not a replacement of the actual Gram by this weighted polynomial norm.

## 3. Actual-spatial no-go: the residue cannot be paid by a uniform raw norm

For every fixed t in the stated range, there is NO finite constant C such that

|ℓ(A)|<=C||Ψ_A||_t   for all polynomials A.               (3)

Proof. If (3) held, (2) would make ℓ a bounded functional on polynomials in L²(σ), σ(dz)=1_(z>=π)z^5e^(−z)dz. Extend this bounded functional from the polynomial subspace and apply Riesz: there would be g∈L²(σ) with

ℓ(A)=∫A(z)g(z)σ(dz)

for every polynomial. But ℓ(A)=∫A dν, where

ν(dz)=(2z−3)z^(1/2)e^(−z)dz/Γ(3/2), z>0.

Both signed measures have an exponential moment in a neighborhood of zero: for gσ this follows by Cauchy–Schwarz with e^(cz), 0<c<1/2. Equality of all polynomial moments therefore implies equality of their analytic Laplace transforms near zero, then throughout their common strip, and hence equality of the finite signed measures by Fourier uniqueness. This is impossible: gσ vanishes belowπ, whereas ν has a nonzero density on, for example, (0,1). This proves (3).

Consequently the corrected ACTUAL spatial Gram G cannot obey G<=C H with a degree-independent C over the full polynomial filtration. Indeed ||F_A||_t>=|ℓ(A)|·||χ||_t−||Ψ_A||_t and χ is nonzero.

This extends the earlier auxiliary discrete-orbit obstruction to the actual half-line parent metric. It is still a FULL-FILTRATION obstruction; it is not a proved obstruction inside either fixed parity ladder separately, and it does not assert negativity of the target bridge.

## 4. Exact scalar Christoffel/Riccati update in the actual parent

Let S_(n−1) be the previous actual derivative span in the full filtration, P its orthogonal projection under ⟨·,·⟩_t. For the next graded raw feature X=Ψ_A_n define

x=(I−P)X, y=(I−P)χ,
a=||x||², b=⟨x,y⟩, c=||y||²,
ν=a−b²/c, λ=ℓ(A_n)−b/c.

Finite-dimensional independence gives c>0 and ν>0. For example a polynomial raw feature cannot equal a nonzero multiple of χ: as h→∞ the first orbit dominates, forcing the impossible polynomial identity A(z)=constant/(2z−3). The same observation proves the relevant augmented Gram independence after any finite previous span.

The actual next innovation is

δ_n=||(I−P)F_A_n||² =ν+cλ².                             (4)

After adjoining F_A_n, the remaining χ variance is

c_n=c−(b−ℓ(A_n)c)²/δ_n=cν/δ_n,

or equivalently

1/c_n =1/c + λ²/ν.                                      (5)

This is an exact scalar Christoffel-information update, retaining the actual spatial parent and the zero-mode residue. It converts growing-degree residue conditioning into a nonnegative accumulated quantity; it does not bound that quantity above.

For reference, if η=q−u^TH^-1u, τ=e^TH^-1e and α=u^TH^-1e for the current raw block, then

c_n=η/[(1−α)²+ητ].                                      (6)

This follows either from the triangular change from (raw features,χ) to (actual features,χ), whose determinant is1, or from the exact rank-two determinant ratio in (1).

## 5. Actual degree scaling consequence: the conditioning floor vanishes

Failure of (3) supplies polynomial sequences with ℓ(A_k)=1 and ||Ψ_A_k||_(t=1/2)→0. Hence F_A_k→−χ in the strongest of the half-line norms under consideration. The full actual derivative filtration spans these F_A_k, so

c_n(t)=dist_t(χ,S_n)² →0,

uniformly for |t|<=1/2. This is a genuine degree-asymptotic statement, although it supplies no rate. Combining with (5),

Σ_(j<=n) λ_j(t)²/ν_j(t)=1/c_n(t)−1/||χ||_t² →∞.          (7)

Thus no proof can assume a uniform positive conditioning floor for the retained residue channel in the actual full spatial parent. The channel can be handled exactly, but its Christoffel information accumulates without bound.

The full shifted derivative span {(D+t)^jψ: j<=n} equals the unshifted full span by triangular binomial translation. This observation does not apply to a fixed parity subspace: translation mixes the two parities. Accordingly (7) must not be transplanted into an individual parity ladder without an additional argument.

## 6. Where the actual target still needs a signed estimate

For one parity and degree n, use f_j(t)=(D+t)^jψ and its previous same-parity span S. Let

r=f_n−Σ_(j in old parity) α_j f_j,
δ=||r||_t²,
k=n f_(n−1)−Σ_j jα_j f_(j−1).

Differentiating the positive-parent innovation and using its actual orthogonality gives

δ'(t)=2⟨h r,r⟩_t+2⟨r,k⟩_t.                             (8)

The derivative of α drops out, but k is in the OPPOSITE differential parity. It therefore does not in general lie in S.

Project the opposite-parity features off S, writing W=(I−P_S)f_opposite and k_perp=Wβ. Define the conditional positive Gram B=⟨W,W^T⟩_t and cross column c=⟨W,r⟩_t. Then

δ'=2m_rδ+2β^Tc,   m_r=⟨h r,r⟩_t/δ>0,
cc^T<=δB,
δ'>=2m_rδ−2sqrt(δ β^TBβ).                               (9)

The exact signed cross column c is preferable to its worst-case Cauchy bound. The conditional matrix B is sharper than the unprojected opposite-derivative Gram: it removes everything already predicted by the actual previous parity span.

In the FULL filtration, k lies in the old span and the second term in (8) vanishes automatically. That apparent easy positivity is precisely why forgetting the moving parity restriction would be invalid. The hard forcing is the surviving opposite-parity conditional covariance.

To close the v2 regression-action certificate with a metric path M(t), one still needs, for example,

2m_rδ+2β^Tc >= α'(t)^T M(t)α'(t),
K_endpoint <=[∫M(t)^-1dt]^-1.                            (10)

The simpler lower bound from (9) can replace the left side only if it is strong enough. No degree-independent estimate of β^TBβ/δ or of the favorable sign of β^Tc has been proved here. The graded theta recurrence and the Poisson residue specify these terms exactly, but neither continuous Fourier unitarity nor Fisher decay gives the needed comparison to the actual lower-target metric.

## 7. The actual target-metric Riccati cost, with no parent-metric substitution

The positive parent Christoffel metric above is not the signed target metric. To retain the latter exactly, fix a certified positive old parity target block A and let its leading Schur pivots be s_k>0. For any forcing column w, its target inverse energy has the exact LDL/Schur expansion

w^T A^-1w = Σ_k η_k²/s_k,
η_k=w_k−A_(k,<k) A_(<k,<k)^-1 w_(<k).                  (11)

Equivalently, adjoining a target rung adds the nonnegative Riccati cost η_new²/s_new to a coherent forcing column's inverse energy. For the changing forcing columns of different new regressions, apply (11) separately; their energies need not be monotone in degree.

In the v2 finite-shift bridge set Δ=α_-−α_+, w=A_-Δ and A=A_+−A_-. The exact required budget is therefore

δ_+−δ_- >= Δ^T A_-Δ + Σ_(old rungs k) η_k²/s_k.           (12)

At the normalized endpoint, let G0 be the positive parent old block, H the actual normalized target old block, α the positive parent regression, and

w=b_dot−Hα=G0 α_dot.

Then the next actual normalized Schur residual is exactly

S_n=δ_dot_n−Σ_(k<n) η_(n,k)²/s_k.                       (13)

This is the degree-by-degree comparison in the actual lower-target geometry. It does not replace H by an automatic positive orbit or raw spatial Gram. The conditioning floor c_n in Section5 and the target pivots s_k are different quantities; divergence of the former's information is not a bound on the latter.

The endpoint/action coefficient-motion forcing w=G(t)α'(t) can be kept explicit. For old features f_j, positive-parent residual r and feature drift k from Section6,

w_j=⟨f_j,2h r+k⟩_t+⟨∂_t f_j,r⟩_t.                    (14)

To obtain η_(n,k), replace f_j in (14) by its target-Schur residual combination φ_k=f_k−A_(k,<k)A_(<k,<k)^-1 f_(<k), and replace its feature derivative by the same FIXED coefficient combination of ∂_t f_j. No derivative of the target projection coefficients is intended in this algebraic change of forcing coordinates. For the finite-shift column w=A_-Δ instead use its own direct formula w_j=⟨f_j^-,r_+ evaluated on the minus side⟩_-; equation (14) is not asserted for that different column.

Thus the remaining genuinely all-degree estimate is control of the relative forcing innovations η_(n,k)/sqrt(s_k), including their sum in (13), by the positive innovation gain. Neither the constant33 raw bound, the scalar residue update, nor the finite odd19 ratios supply that estimate. Equations (8)–(14) exhibit the surviving signed theta/Poisson forcing rather than hiding it in a surrogate metric.

## Outcome

New actual estimates/statements: uniform raw spatial bound (2); impossibility of paying the residue with a degree-uniform raw actual norm (3); exact actual Christoffel update (4)–(6); vanishing full-filtration residue floor and divergent information sum (7); exact parity-conditional forcing and a valid conditional bound (8)–(10); actual target inverse-energy Riccati decomposition and explicit relative forcing budget (11)–(14).

Remaining barrier: a theta-specific all-degree bound on the opposite-parity conditional cross forcing and regression motion in the signed target metric. No conclusion is drawn from the finite odd19 ratios, no new rung was added, and no all-order proof is claimed.
