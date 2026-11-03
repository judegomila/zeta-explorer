# All-degree outer positivity with a quadratic curvature threshold

2026-11-02. Analytic complete-theta result, independent analytic review passed. This does not prove the remaining integrated core inequality or RH.

## Theorem

Let J≥1 be an integer, z=πe^(2h), and X(h)=−(logψ)″(h). If z≥32 and

X(h)≥2^22 J²,

then the variance-normalized moment functional of v↦ψ(h−v)ψ(h+v) differs from the standard Gaussian functional by less than one third in quadratic-form order on every complex polynomial of degree≤J. In particular its confluent jet matrix through order J is positive definite.

An entirely explicit sufficient spatial threshold is

h≥H_J=(1/2)log[(2^22J²+1)/(4π)],

since the already independently audited theta bound X>4z−1 holds there. Thus H_J=log J+O(1). The numerical constant is conservative; finite-degree certificates can be much sharper.

## 1. Full-theta analytic log bound

For z≥32 on |w|≤1/16, factor the complete profile as

ψ(h+w)=8π² exp(9(h+w)/2) exp(−z′)(1−3/(2z′))(1+r(h+w)), z′=ze^(2w).

The exact full theta-tail ratio is
r=Σ_(n≥2)n²(2n²z′−3)/(2z′−3) exp[−(n²−1)z′].

Here Re z′>(7/8)z and |z′|<(8/7)z. For the first bound, the Taylor lower bounds exp(−1/8)≥1−1/8+1/128−1/3072 and cos(1/8)≥127/128 have product>7/8. The upper bound follows exp(1/8)<8/7. The rational prefactor has modulus<2n⁴, giving |r|<1/4 by a geometric tail estimate starting at n=2. Also |3/(2z′)|<1/4. The two logarithms are analytic and each has modulus<1 on this disk.

The affine part of ell=logψ has modulus at most z: use log(8π²)<5, h≤(1/2)log(z/3), and9|w|/2≤9/32. At z=32 this upper bound is<32, and its derivative9/(4z)<1 thereafter. The remaining term −z′ has modulus<(8/7)z. Hence

|ell(h+w)|<3z<X(h),

where X>4z−1 and z≥32. Cauchy's inequality therefore gives

|ell^(k)(h)|/k!≤X·16^k, every k≥0.                     (1)

No finite theta truncation and no zero assumption enters this estimate.

## 2. Exact cumulant majorant

Define
F_h(t)=ψ(h−it/√(2X))ψ(h+it/√(2X))/ψ(h)².
The Taylor moments m_k=F_h^(k)(0) are real, with odd moments zero, but their positivity is not assumed. Exactly,

F_h(t)=exp(t²/2+δ_h(t)),
δ_h(t)=Σ_(k≥2)c_(2k)t^(2k),
c_(2k)=2(−1)^k ell^(2k)(h)/[(2k)!(2X)^k].

By (1), |c_(2k)|≤2X(128/X)^k. For r=2√J and X≥1024J,

Σ_(k≥2)|c_(2k)|r^(2k)
 ≤2X (512J/X)²/(1−512J/X)
 ≤2^20 J²/X.                                         (2)

The normalization places the quadratic term exactly at t²/2; every higher log derivative remains in the geometric bound. The disk of analyticity contains the evaluation radius r under these hypotheses.

## 3. Hermite derivative estimate avoids factorial conditioning

Let L_h be the linear functional on polynomials defined by L_h(x^k)=m_k, and E_G standard Gaussian integration. The moment-generating identity implies the exact finite-polynomial identity

L_h(f)=E_G[(exp(δ_h(D)))f], D=d/dx.                    (3)

For a polynomial f the differential series terminates, so no interchange of an infinite differential operator with integration is assumed. It can also be checked by comparing coefficients on exp(tx).

Put exp(δ_h(t))−1=Σ d_k t^k. The absolute series satisfies
Σ|d_k|r^k≤exp(Σ|c_(2k)|r^(2k))−1.

For every complex polynomial p of degree≤J, Gaussian Hermite orthogonality gives
||D^l p||_G≤sqrt[J(J−1)...(J−l+1)]||p||_G≤J^(l/2)||p||_G.
Leibniz and Cauchy–Schwarz then give

|E_G D^k(|p|²)|≤Σ_l binom(k,l)||D^l p||_G||D^(k−l)p||_G
                ≤(2√J)^k||p||_G².                   (4)

Combining (2)–(4),

|L_h(|p|²)−E_G|p|²|
 ≤[exp(2^20 J²/X)−1] E_G|p|².

When X≥2^22J², the exponent is≤1/4 and exp(1/4)−1<1/3. Therefore

(2/3)E_G|p|² < L_h(|p|²) < (4/3)E_G|p|²              (5)

for every nonzero polynomial of degree≤J. This is a relative matrix inequality in the Gaussian polynomial space, without a raw smallest-eigenvalue division. Positive variance scaling, the scalar ψ(h)², and diagonal complex phases carry it to the original confluent derivative Gram.

## 4. The remaining integrated core cost

For a fixed J let B_J(h)=2h² times the original signed-congruent pointwise moment matrix and F_J(H)=∫_H∞B_J(h)dh. The theorem proves B_J(h)>0 for h≥H_J, hence F_J(H)≽0 there. The independently checked spatial-tail propagation lemma then supplies a sufficient all-shift proof at order J if

γ_J:=inf_(0≤H≤H_J) λ_min(S_J F_J(H) S_J*)≥0

for a specified invertible finite normalization S_J. All entries and derivatives on this compact interval are explicit complete-theta integrals with controlled tails. No proof that γ_J≥0 for every J has been supplied. This tail condition is stronger than positivity of the original full integral and may fail at a later order without disproving RH.

The useful gain is a proved, explicit, all-degree outer region with H_J=O(log J), and a precise family of integrated core matrix costs left to control. H5 already demonstrates that integration can repair a negative pointwise core. This theorem does not make that repair uniform in degree.

## Provenance

This argument is authored here using the full profile and the campaign's independently reviewed X>4z−1 bound. No acquired code was executed. RAW_MONOMIAL_BOUND.md preserves an earlier, much weaker factorial-threshold derivation; it is superseded by the relative Hermite estimate (4), not used as a dependency.
