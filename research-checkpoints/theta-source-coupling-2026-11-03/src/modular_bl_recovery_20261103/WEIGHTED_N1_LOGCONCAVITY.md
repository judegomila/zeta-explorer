# N=1 h-weighted modular metric: a universal-parameter log-concavity certificate

Status: independent analytic audit and MPFI replay PASS. The claim is for the actual undeformed complete theta profile at N=1, not an all-degree theorem.

Let ψ be the actual positive even theta profile, v=−ψ'/ψ, and assume the known physical pivots s₀(a),s₁(a)>0 for a>0. In the exact N=1 modular reflection basis,

 R=[[1,0],[2a√(s₀/s₁),−1]], G=I+RᵀR,
 Y₀=e^(ah)ψ/√s₀, Y₁=e^(ah)(aψ+ψ')/√s₁.

Put β=s₁/s₀>0 and α=β+a²>0. Exact expansion, keeping the off-diagonal metric term, gives

 h e^(−4ah)YᵀGY = [2h e^(−2ah)ψ²/s₀]·[1+(a²+v²)/β]. (1)

Consequently the log curvature of this positive density, for h>0, is

 L''=−h^(−2)−2v' + 2v'²(α−v²)/(α+v²)² + 2v v''/(α+v²). (2)

For v>0, independently of α>0,

 2v'²(α−v²)/(α+v²)² ≤ v'²/(4v²),
 2v v''/(α+v²) ≤2 max(v'',0)/v.

The first inequality uses max_{x>0}(x−1)/(x+1)²=1/8. Thus h²L'' is bounded above by

 H_* = −1−2h²v' + h²v'²/(4v²) +2h² max(v'',0)/v.      (3)

We show H_*<0 on the entire half-line; hence (1) is strictly log-concave for every fixed a>0 with the two stated old pivots positive. The proof does not bound α or assume a next pivot.

## Compact interval and origin

Write z_n=πn²e^(2h), f_n=4e^(h/2−z_n)(2z_n²−3z_n). The complete θ sum is ψ=∑f_n. The owned MPFI scripts evaluate ψ and its first three h-derivatives over 160-bit interval rectangles using n≤8, adding ±10^(−89) for each omitted orbit tail.

For 0≤h≤0.7 and n≥9, z_n≥243. The largest derivative polynomial, for f_n''', is
 −16z_n⁵+180z_n⁴−529z_n³+(1635/4)z_n²−(375/8)z_n,
whose absolute value is <17z_n⁵. The smaller derivative polynomials are also bounded by 17z_n⁵. Since 4e^(h/2)<9 and z⁵e^(−z) decreases for z≥243,

 ∑_{n≥9}|f_n^(j)| ≤ 47430∑_{n≥9}n¹⁰e^(−3n²)<10^(−89), 0≤j≤3. (4)

The first term is bounded using e³>20; successive ratios are <1/2. The scripts enclose exact decimal cells by outward binary endpoints before MPFI construction.

On 0≤h≤0.01, check_origin_jets_mpfi.py certifies 17<v'<19 and |v''|<4. Since v(0)=0, v≥17h there. Therefore

 H_*≤−1+19²/(4·17²)+8h/17<0.                         (5)

On 0.01≤h≤0.7, check_universal_alpha_mpfi.py evaluates (3) on 6,900 cells of width 0.0001, checks v>0 and v'>0, and proves H_*<−0.7. It replaces max(v'',0) by an outward interval from 0 to the computed nonnegative upper endpoint; no α interval enters this calculation. The owned run reported a worst upper endpoint −0.7240.... These are interval assertions, not a finite mesh extrapolation.

## Analytic tail h≥0.7

Here z=πe^(2h)≥12. Factor ψ=f₁(1+r), with

 r=∑_{n≥2} A_n(z)e^{−(n²−1)z},
 A_n(z)=n⁴+(3/2)(n⁴−n²)/(z−3/2)≥0.

For D=2z∂_z and z≥12, direct differentiation gives |D^k A_n|≤25n⁴ for 0≤k≤3. For d=n²−1≥3 and 0≤j≤3,
 |D^j e^{−dz}|≤9n⁶z³e^{−dz}.
Leibniz and a geometric bound on the n-sum imply

 |D^j r| ≤10⁶z³∑_{n≥2}n¹⁰e^{−(n²−1)z}
          ≤10⁶·2048·z³e^(−3z)<0.001, 0≤j≤3.             (6)

The final bound follows at z=12 from e³>20 and decreases thereafter. Since r≥0, the first three h-derivatives of log(1+r) have absolute value <1.

For the first orbit,
 v₁=2z−9/2−6/(2z−3),
 v₁'=4z+24z/(2z−3)²,
 v₁''=8z−48z(2z+3)/(2z−3)³.

Equation (6) therefore gives v>2z−6>0, 4z−1<v'<4z+2 and v''<8z+1. Applying (3) without the harmless −h⁻² term and using z≥12 yields

 L'' < −8z+2+4+11 <0.                                   (7)

Thus the compact MPFI enclosure and analytic tail establish strict log-concavity of the actual N=1 h-weighted metric density on all h>0, for every a>0 whose old pivots s₀,s₁ are positive.

## Scope

This is a scalar N=1 result. The separately audited GAUSSIAN_N2_WEIGHTED_NO_GO shows that even a strongly log-concave positive profile with every pivot positive need not have this metric-density property at N=2. Therefore the present proof does not extend to all degree by generic curvature, nor does it by itself prove the integrated commutator sign or the next Schur pivot.
