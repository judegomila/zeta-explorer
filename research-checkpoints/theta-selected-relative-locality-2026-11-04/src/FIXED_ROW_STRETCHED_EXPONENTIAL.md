# Fixed natural-Pollaczek source Gram rows decay stretched-exponentially

2026-11-04. Analytic derivation, independently audited in INDEPENDENT_ANALYTIC_AUDIT.md. No selected coherence, Q positivity, or RH assertion is made.

## 1. Result and distinction from the selected-row obstruction

Let λ=9/4 and Q_n(t)=P_n^(λ)(t/2;π/2). For every fixed real polynomial q there exist c_q,C_q>0 such that

    |X(Q_n,q)|≤C_q exp(−c_q n^(1/3))       (n≥0).        (1.1)

The same bound holds with Q_n replaced by e_n=Q_n/√X[Q_n]. In particular, each fixed row of the actual natural-basis Gram matrix has this decay. Constants may depend on the fixed row. Opposite-parity entries vanish exactly; passing to either parity index changes only constants.

This does not say the selected multiplication rows decay. Nor does it give a uniform off-diagonal bound in two growing indices. It is compatible with the failure of uniformly localized selected inverse columns established elsewhere.

## 2. Theta kernel bounds in complex strips

The supplied actual transform is a nonzero constant times Xi(t). Absorbing fixed normalization constants, write

    F(t)=∫_R ψ(u)e^(−itu)du,

where ψ is the standard even theta kernel, proportional to

    Φ(u)=2 Σ_(m≥1) [2π²m⁴e^(9u/2)−3πm²e^(5u/2)]
                         exp(−πm²e^(2u)).              (2.1)

This formula converges normally in |Im u|<π/4 and its analytic continuation there is even, by the theta functional equation. For every σ<π/4 and each fixed derivative order k,

    |ψ^(k)(x+iy)|≤C exp(M|x|−c e^(2|x|)),  |y|≤σ.       (2.2)

For x≥0 this follows directly from (2.1), since Re(e^(2x+2iy))≥cos(2σ)e^(2x)>0; differentiating only introduces fixed polynomial factors. The convergent sum over m is bounded by a fixed polynomial in e^x times exp(−c e^(2x)). Evenness supplies x≤0. Fixed polynomial factors in u preserve (2.2) after changing C,M,c.

The normalization of ψ affects constants only. A primary source for (2.1), its evenness, and the Fourier convention up to a fixed constant is Dan Romik, *Orthogonal polynomial expansions for the Riemann xi function*, equations (1.7)–(1.11), arXiv:1902.06330. The bounds (2.2) are derived here directly from that classical kernel formula.

## 3. Complex theta convolutions

For any fixed nonnegative integers a,b, the inverse Fourier transform of F^(a)(t)F^(b)(t) is, up to fixed normalization, the convolution of (−iu)^aψ(u) and (−iu)^bψ(u). It extends analytically to |Im u|<π/2.

To verify both the extension and its decay, write u=U+iY and shift the convolution variable to v=x+iY/2. Both factors then lie in |Im v|≤σ/2 whenever |Y|≤σ<π/2. Contour shifting is justified by (2.2), whose tails make the vertical-edge integrals vanish. Locally in u one can hold the intermediate contour fixed; these local analytic definitions agree by contour deformation. Hence the moving-contour expression defines an analytic function.

The integrand is bounded by

    C exp[M(|x|+|U−x|)−c(e^(2|x|)+e^(2|U−x|))].

Absorb the linear exponent and polynomial factors into half the double-exponential terms. For U≥0,

    e^(2|x|)+e^(2|U−x|)
       ≥e^(2x)+e^(2(U−x))
       =2e^U cosh(2(x−U/2)).

The same inequality after reflection treats U≤0. Integration over x therefore gives a bound C exp(−c′e^(|U|)). For example cosh(2y)≥1+2y² bounds the remaining integral uniformly. Thus each such convolution K satisfies

    |K(U+iY)|≤C exp(−c e^(|U|)),  |Y|≤σ<π/2.            (3.1)

Every fixed derivative of K has the same type of bound: use complex Cauchy estimates in a fixed-radius disk within a slightly larger strip. A bounded real displacement only changes c.

## 4. Apply the convolution estimate to the exact source pairing

For the fixed polynomial q, integration by parts gives

    X(p,q)=∫p(t)f_q(t)dt,
    f_q=Lq=−(F²q′)′+2(F′²−FF″)q.                      (4.1)

More generally the proof applies to ∫Q_n(t) f(t)dt for every finite sum f of polynomial multiples of F^(a)F^(b), with fixed nonnegative a,b. In particular it applies to f=t²Lq, giving |X(t²Q_n,q)|≤C_q exp(−c_q n^(1/3)), and after source normalization to X(t²e_n,q). This retains every cross term. f_q is a finite sum of polynomial multiples of F², FF′, F′² and FF″. Its inverse Fourier transform

    k_q(u)=(1/(2π))∫_R f_q(t)e^(itu)dt

therefore is a finite sum of derivatives of the convolutions in Section 3. It satisfies (3.1). Polynomial factors in (4.1) require only finitely many derivatives.

Set ℒ_q(s)=∫f_q(t)e^(st)dt. Exponential decay of F and its fixed derivatives makes this integral analytic for |Re s|<π/2. Fourier inversion on the real u axis followed by analytic uniqueness identifies

    ℒ_q(s)=2π k_q(−is).

Consequently, uniformly for |Re s|≤σ<π/2,

    |ℒ_q(s)|≤C exp(−c e^(|Im s|)).                     (4.2)

No asymptotic replacement of F, its zeros, or the source form is used.

## 5. Generating function and controlled complex sectors

The exact Pollaczek generating function is

    Σ_(n≥0)Q_n(t)z^n
      =(1+z²)^(−λ) exp[t arctan z],   |z|<1,

with branches normalized at zero. Therefore

    A_q(z):=Σ_(n≥0)X(Q_n,q)z^n
      =(1+z²)^(−λ)ℒ_q(arctan z).                       (5.1)

Coefficient extraction under the integral is justified on every smaller disk: |Re arctan z|<π/4 there, leaving a strict margin inside the strip of absolute Laplace convergence.

Write

    arctan z=(1/(2i))Log((1+iz)/(1−iz)).

The Möbius quotient maps the unit disk to the right half-plane. On the unit circle away from ±i, its argument is ±π/2, so Re arctan z=±π/4. Near either singular endpoint ζ=±i, with δ=|z−ζ|,

    e^(|Im arctan z|)≥c δ^(−1/2),
    |1+z²|^(−λ)≤C δ^(−λ).                             (5.2)

Crucially, these bounds persist in relative complex neighborhoods of the boundary arcs, not just radially inside the disk. There exists a fixed ε>0 such that for each boundary point z0 near ζ but not equal to it, the disk |z−z0|<εδ0, δ0=|z0−ζ|, avoids both endpoints and satisfies

    |Re arctan z|≤σ<π/2,
    |z−ζ| comparable to δ0.

Indeed each linear factor in the Möbius quotient changes by relative O(ε), so its argument changes by O(ε). Choosing ε small gives, for example, σ=3π/8. A local branch of arctan continuing its boundary value suffices. This also supplies a local branch of (1+z²)^(−λ).

Equations (4.2)–(5.2) yield on these disks

    |A_q(z)|≤C δ0^(−λ) exp(−c δ0^(−1/2)).              (5.3)

Away from ±i the function extends analytically across the unit circle. Thus the boundary function B_q(θ)=A_q(e^(iθ)) extends smoothly through the two endpoint angles by setting its value and all derivatives there to zero.

## 6. Gevrey-3 bound and Fourier coefficients

In the complex θ plane, the disks just described give disks of radius cδ about each real θ near an endpoint; the exponential map is locally bi-Lipschitz. Complex Cauchy estimates imply

    |B_q^(k)(θ)|≤k! (C/δ)^k δ^(−λ) exp(−c δ^(−1/2)).

With y=δ^(−1/2), optimizing y^(2k+2λ)e^(−cy) gives a bound C A^k(k!)³, after absorbing a fixed power of k into A^k. On the complementary compact arcs, ordinary analyticity gives a smaller bound of the same form. Hence

    ||B_q^(k)||∞≤C A^k(k!)³,   k=0,1,2,... .            (6.1)

The boundary function is periodic and smooth, so integrating its nth Fourier coefficient by parts k times gives

    |X(Q_n,q)|≤C A^k(k!)³ n^(−k).

Choosing k=floor(c0 n^(1/3)) with c0>0 sufficiently small proves (1.1). The boundary Fourier coefficients equal the Taylor coefficients in (5.1), by continuity from inside the disk.

## 7. Source normalization

The general all-polynomial comparison in Section 2, equation (2), of `../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md` gives

    X[Q_n]≥exp[−C log²(n+2)] h_n,
    h_n=∥Q_n∥²_(W_*)=(4π/2^(9/2))Γ(n+9/2)/n!
                     ~ c′ n^(7/2).

Consequently division by √X[Q_n] costs at most exp[O(log²(n+2))] times a polynomial factor. Since log²(n+2)=o(n^(1/3)), this loss is absorbed by decreasing the positive constant in exp(−c_q n^(1/3)). Finitely many degrees are absorbed into C_q because X is positive definite. The normalized fixed-row and multiplication-row bounds therefore follow without the delicate natural-family source sandwich or Hardy mean estimates. For a fixed natural row e_j, simply take q=e_j in (1.1).

The bounds are fixed-row statements, not uniform in deg q. Derivative orders, polynomial prefactors and constants in Sections 3–6 depend on q. No uniform inverse-Gram or selected-column conclusion follows from them alone.

## Sources and verification scope

- Classical theta kernel and Fourier identity: https://arxiv.org/abs/1902.06330 (Romik, equations (1.7)–(1.11)).
- Actual source normalization and integration-by-parts reduction: `../theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md`.
- General all-polynomial natural-reference comparison: `../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md`, Section 2, equation (2). No natural-family source sandwich is used.

The contour estimate, complex-sector control and Gevrey coefficient proof are included above, rather than assumed from real-axis tail decay alone. This note is new and modifies no frozen files or live 4CT work.
