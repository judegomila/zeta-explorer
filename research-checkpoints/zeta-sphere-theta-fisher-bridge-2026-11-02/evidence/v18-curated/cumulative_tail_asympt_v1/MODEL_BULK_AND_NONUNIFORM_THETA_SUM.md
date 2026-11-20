# A fixed-cutoff endpoint does not force tail oscillation: exact model bulk and the full-theta obstruction

2026-11-02. Independently reviewed model theorem and summation obstruction. This proves an eventual positive high-frequency leading term for the first-theta tail model only. No sign conclusion for the actual full-theta cumulative tail is claimed.

## 1. Exact first-orbit transform

Let f(u)=4e^(u/2)(2z²−3z)e^(−z), z=πe^(2u), the reviewed whole-line first summand. For fixed H≥0 define
T_H^(1)(v)=∫_H^∞2h² f(h−v)f(h+v)dh,
and use Fourier convention exp(−ikv), k>0. Put z_H=πe^(2H), h(z)=(1/2)log(z/π), τ=k/2.

Directly expanding the product gives
∫_R e^(−ikv)f(h−v)f(h+v)dv
=16e^h[(4z⁴+9z²)K_(iτ)(2z)+6z³∂_zK_(iτ)(2z)].
Changing h to z and integrating the derivative term once gives exactly

T_H^(1)_hat(k)=(16/sqrtπ)∫_(z_H)^∞
 [(4z^(7/2)−6z^(3/2))h(z)²−6z^(3/2)h(z)]K_(iτ)(2z)dz
 −(96/sqrtπ)H² z_H^(5/2)K_(iτ)(2z_H).                  (1)

The endpoint term is real and oscillatory, but it is not the leading term at fixed H and large k.

## 2. A rigorous compact-z error bound

The I-series and K/I connection identity give, for every τ>0 and 0<z≤z_H,

|K_(iτ)(2z)|≤|Γ(iτ)| exp(z_H²/τ),
|Γ(iτ)|²=π/[τ sinh(πτ)].                              (2)

Indeed I_(±iτ)(2z)=z^(±iτ)/Γ(1±iτ) times a series bounded by exp(z²/τ), since each factor of (1±iτ)_j has modulus at least τ. The two connection terms combine to the stated Γ prefactor. The bound is uniform all the way to z=0.

Let
A_H=∫_0^(z_H)[(4z^(7/2)+6z^(3/2))h(z)²+6z^(3/2)|h(z)|]dz
       +6H²z_H^(5/2),
a finite elementary positive constant. Replacing the integral in (1) by its complete Mellin integral changes it by at most

(16/sqrtπ) A_H |Γ(iτ)| exp(z_H²/τ).                    (3)

This bound includes the displayed endpoint. In particular it is O_H(k^(−1/2)e^(−πk/4)) as k→∞.

## 3. The positive complete-Mellin bulk

For ν>0 define
M_ν(k)=∫_0^∞ z^(ν−1)K_(ik/2)(2z)dz
       =(1/4)|Γ(ν/2+ik/4)|²,
and L=∂_ν−logπ. Equation (1), with the lower limit replaced by zero, is

B(k)=(16/sqrtπ)[L²M_ν|_(ν=9/2)
                    −(3/2)L²M_ν|_(ν=5/2)−3LM_ν|_(ν=5/2)]. (4)

Gamma asymptotics and their ν derivatives yield

B(k) ~ 8sqrtπ (k/4)^(7/2)e^(−πk/4)[log(k/(4π))]².       (5)

The leading coefficient is strictly positive. Comparing (3) with (5) proves, for each fixed H, that T_H^(1)_hat(k)>0 for all sufficiently large k. The endpoint/core-replacement error is smaller than the leading term by O_H(k^(−4)/log²k). The lower-order ν=5/2 terms in B itself are smaller by O(k^(−2)). Thus a proof of high-frequency sign oscillation based only on the fixed-H boundary term is invalid even in this explicit non-Gaussian model.

The exact formulas (3), (4) provide a computable sufficient positivity test B(k)>(16/sqrtπ)A_H|Γ(ik/2)|exp(2z_H²/k); no effective threshold is asserted without evaluating those bounds.

Primary identities checked: NIST DLMF 10.25.2 (I-series), 10.27.4 (K/I connection), 10.43.19 (Mellin integral), and standard Gamma Stirling expansion. These are used to derive (2)–(5), not as a full-theta positivity theorem.
https://dlmf.nist.gov/10.25.E2
https://dlmf.nist.gov/10.27.E4
https://dlmf.nist.gov/10.43.E19

## 4. Why this cannot be summed into a full-theta asymptotic

The exact nth summand is f_n(u)=n^(−1/2)f(u+log n). A mixed (n,m) product is transformed by
h_eff=h+(1/2)log(nm),
v_eff=v+(1/2)log(m/n),
with overall factor (nm)^(−1/2) and Fourier phase exp[(ik/2)log(m/n)]. The original weight h² becomes [h_eff−(1/2)log(nm)]², and the effective lower endpoint becomes H+(1/2)log(nm).

Consequently the complete-Mellin replacement for a fixed pair has the common Gamma bulk multiplied by (nm)^(−1/2), its phase, and shifted logarithmic factors. The double sum is not absolutely convergent: even its diagonal has coefficients 1/n, with additional log n terms. Meanwhile the compact-endpoint error constant and exp(z_endpoint²/τ) in (3) grow with nm, so the fixed-pair error bound is not uniform in the orbit indices.

The original full-theta sum is locally convergent in the real spatial variables; the invalid step is interchanging that sum with a nonuniform complete-Mellin replacement. Moving orbit indices near the Bessel turning range retain the critical-line arithmetic. Thus neither (5) nor the oscillatory boundary term proves the sign of
T_H(v)=∫_H^∞2h²ψ(h−v)ψ(h+v)dh.

Current rigorous status: the full-theta all-order cumulative-tail premise is unresolved; no actual sign-changing witness or valid full-theta high-frequency obstruction has been obtained here. The exact model calculation eliminates one tempting but incorrect obstruction argument.
