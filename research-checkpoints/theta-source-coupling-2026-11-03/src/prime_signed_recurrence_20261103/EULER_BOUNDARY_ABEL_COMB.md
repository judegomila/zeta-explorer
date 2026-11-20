# Euler strip boundary: the retained Abel correction contains a Dirac comb

Date: 2026-11-03. Status: independent analytic audit PASS for kernel, constants, and Schwartz pairing. The elementary logarithmic-derivative identification is derived below. This is a domain/cancellation result, not a positivity theorem or RH claim.

## 1. Finite-prime interior formula

Fix a prime p, L=log p, and
R_p(z)=1−2p^(−1/2)cos(Lz)+p^(-1).
For 0<a<1/2, the positive-coefficient correction to the normalized bridge is

K_{p,a}(t)=Im[R_p′(t+ia)/R_p(t+ia)]/a
 = [L/a]Σ_{m≥1}[p^(−m(1/2−a))−p^(−m(1/2+a))]cos(mLt).

Let P_r(θ)=(1−r²)/(1−2r cosθ+r²). The exact Poisson formula gives

K_{p,a}(t)=[L/(2a)]{P_{p^(−1/2+a)}(Lt)−P_{p^(−1/2−a)}(Lt)}.  (1)

All series converge uniformly in t on a fixed compact shift interval below 1/2. The finite-prime bridge product identity has sign

λ_a(R_pF)/|R_p|²=λ_a(F)−|F(t+ia)|²K_{p,a}(t).             (2)

## 2. Exact boundary distribution

As a increases to 1/2, the first Poisson kernel tends to its periodic delta measure, not to zero as a distribution:

P_r(Lt) → (2π/L)Σ_{k∈Z}δ(t−2πk/L), r↑1.

Consequently

K_{p,a} → 2πΣ_{k∈Z}δ(t−2πk/L)−L P_{1/p}(Lt).             (3)

Let q be any fixed real polynomial of definite parity and W_a(t)=q(t)²|F(t+ia)|². Complete-theta decay implies W_a→W_{1/2} in Schwartz space. Pairing (3) gives the exact Abel correction

D_{p,q}(1/2)
=2πΣ_{k∈Z}q(2πk/L)²|F(2πk/L+i/2)|²
 −L∫_R q(t)²|F(t+i/2)|²P_{1/p}(Lt)dt.                    (4)

Both terms in (4) are finite for one fixed prime. The entire lattice is required.

## 3. Pointwise substitution loses the lattice term

For t away from 2πZ/L, the pointwise limit of the first Poisson kernel in (1) is zero. Directly at the boundary,

R_p(t+i/2)=(1−p^(−1)e^(iLt))(1−e^(−iLt)).

Differentiating its logarithm shows

Im[R_p′(t+i/2)/R_p(t+i/2)]/(1/2)=−L P_{1/p}(Lt),
 t∉2πZ/L.                                                (5)

The second factor supplies the constant imaginary term −L/2; the first supplies −L(P_{1/p}−1)/2. Their sum proves (5).

Thus inserting the a=1/2 quotient pointwise and integrating gives only the second term of (4). It omits the positive lattice sample contribution. Equivalently, the direct boundary normalized source integral differs from the interior Abel-limit source by

2πΣ_{k∈Z}W_{1/2}(2πk/L)≥0.                             (6)

For the base residual q=1, the k=0 value is |F(i/2)|²=1, so the discrepancy is at least 2π. No zero-location theorem is needed for this strict base witness. For other q the displayed nonnegative exact discrepancy is sufficient for the domain statement; no lattice nonvanishing assumption is imposed.

The original h_a[q] is continuous at a=1/2. The discontinuity belongs to the normalized Euler-source quotient, whose multiplier vanishes on the boundary lattice. Analyticity of the unmodified complete theta transform does not authorize dropping these masses.

## 4. Full prime sum: keep each bracket intact

The signed prime correction is still well defined at a=1/2 as a sum of already-integrated correlations:

D_q(1/2)=Σ_{p,m≥1}2log p(1−p^(−m))∫W_{1/2}(t)cos(mt log p)dt.

For fixed q the complete-theta correlation estimate is superexponential in p^m, so this sum converges absolutely. Equivalently sum (4) over primes, with each comb-minus-Poisson bracket kept together.

The two parts cannot be summed over primes separately. For nonzero q, put N=∫W_{1/2}>0. As p→∞, P_{1/p}→1 uniformly, so the second positive magnitude is asymptotic to (log p)N. The lattice mesh 2π/log p tends to zero, so the Riemann-sum formula shows the first positive magnitude is also asymptotic to (log p)N. Each separated all-prime sum diverges, although their paired differences converge superexponentially for each fixed q.

This exact cancellation supplies a useful endpoint extension of the integrated arithmetic representation. It does not produce a bounded infinite Euler multiplier, justify an unsmeared endpoint series, bound the moving old inverse, or determine a selected Schur-complement sign.

## Relation to the companion recurrence

TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md proves
D_q(a)=(2π/a)Σ_j j^(−1/2)d_a′(j)a_j(a).
Its right side extends smoothly to a=1/2 and agrees with the paired Abel value above. It is not the boundary quotient obtained by using (5) and discarding the comb. This distinction is necessary whenever a compact-strip sieve argument is pushed to the critical shift endpoint.
