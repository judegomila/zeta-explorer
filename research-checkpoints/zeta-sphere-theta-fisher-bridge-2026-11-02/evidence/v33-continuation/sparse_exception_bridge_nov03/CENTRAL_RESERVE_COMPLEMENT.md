# Sharpening the central reserve and testing the complement

Status: the sharpened central estimate is independently interval-certified, and the selected-polynomial counterexample is independently audited. Neither proves a global pivot.

## Exact sharper radius

Use the notation of UNIFORM_CENTRAL_JOINT_RESERVE.md, but retain the complete positive theta moment

c*=4∫_0^∞u²Φ(u)du=−d²/dz² ξ(1/2+iz)|_{z=0} >0

instead of the very small elementary c0. The inequality sinh(au)>=au gives ξ'(1/2+a)>=a c*. The same mixed-derivative argument proves, for every 0<=a<=1/2,

Λ_a(t)>=4[c*ξ0−(A4 A0+A2²)t²/2].                       (1)

Hence it is at least 2c*ξ0 on |t|<=sqrt[c*ξ0/(A4A0+A2²)].

Floating-point quadrature suggests c*=0.0229719443151, ξ0=0.4971207781883, A0=0.5, A2=0.0233438645342, A4=0.00303818076380, and radius ≈2.35219. These values are not a certificate.

An independent outward interval computation using n=1,2 on [0,2] certifies ξ0>0.4949, c*>0.0228, A2<0.02351, A4<0.003064 after bounding all omitted modes and tails. The reproducible code and output are quad/independent_ivtheta_cert.py and quad/independent_ivtheta_cert.txt. Inserting these rounded bounds and A0=1/2 into (1) proves Λ_a(t)>0.023078541342>0.023 for |t|<=2.3 and all 0<=a<=1/2. This uses the direct parabola 4[c*ξ0−L t²/2], not the weaker half-height shortcut. For every monic polynomial it implies the local reserve

∫_{−2.3}^{2.3} p_n²Λ_a dt > 0.046·2.3^(2n+1)/[(2n+1)(2^(−n)binom(2n,n))²].

Despite its growth with n, it does not bound the signed complement.

## Even selected-prefix obstruction outside the core

A simple non-theta benchmark shows why even this much larger local reserve is insufficient by itself. Set

dν(t)=5e^(−t²)dt−(κ/2)(δ_{−3}+δ_3),  κ=5√π/50.

On [−2.3,2.3], the signed density is 5e^(−t²)>0.025>0.023. Its moments satisfy

ν[1]/(5√π)=49/50,  ν[t²]/(5√π)=8/25,
ν[t⁴]/(5√π)=−87/100,  ν[t]=0.

Thus the full degree<2 signed prefix is positive, but the actual inverse-selected monic residual p₂=t²−16/49 has

ν[p₂²]/(5√π)=−87/100−128/1225<0.

Narrow even smooth bumps replace the atoms while preserving the strict statements. Even Gaussian bumps give an entire signed density; their tiny leakage into the core can be made small enough to retain density >0.023 there. This is a purpose-built benchmark, not actual theta, and it disproves only deductions based on central positivity, symmetry, and existing prefix positivity without additional complement control.

## Interval enclosure details

The independently reviewed script uses 4,000 rational subintervals and 30-digit outward interval arithmetic. For n>=3, n²−9>=n−3 and e^π>20 imply Σ_{n>=3}n⁴e^(−π(n²−9)) <=Σ_{m>=0}(m+3)⁴/20^m=236568720/2476099<100. This bounds the complete omitted high modes by 8.05×10^−11 for A0, 6.06×10^−14 for A2, and 2.74×10^−16 for A4. For u>2 use e^(2u)>=e⁴[1+2(u−2)]; the n=1,2 tails are <4.6×10^−69 for all these moments. ξ0 and c* need only the positive n=1,2 lower integrals, so their omitted terms require no subtraction. The original exact theta identity gives A0=ξ(1)=1/2. The independent auditor also verified the parity, signed-prefix, selected-polynomial and smooth-approximation statements in the complement example.

## One-sided theta refinement toward |t|=4.3

The derivative identity has a positive term that should not be lost to absolute values:

∂_a q_a''(t)=−Re[ξ''''(s)conj ξ(s)]+|ξ''(s)|².

Dropping the latter alone improves the uniform parabola to

Λ_a(t)>=4[c*ξ0−(A4 A0)t²/2].

Using the certified rounded constants gives Λ_a(t)>0.00089072 for |t|<=3.8 and all 0<=a<=1/2.

A stronger lower bound retains part of |ξ''|². The actual theta representation and cos x>=1−x²/2 give, for 0<=a<=1/2,

Re ξ''(1/2+a+iv)>=c*−A4 v²/2 >= cL−A4U v²/2,

where cL=0.0228 and A4U=0.003064. Hence

Λ_a(t)>=4 b(|t|),
b(t)=cL ξL−(A4U/4)t²+∫_0^t(t−v)(cL−A4U v²/2)_+² dv,
ξL=0.4949.                                                   (3)

The function b is concave because b''<=−A4U/2+cL²<0. Therefore its minimum on [0,4.3] is at an endpoint. At t=4.3, retaining only v∈[0,3.8] in the positive integral gives the exact rational lower bound

4b(4.3) >= 6299958915587/3662109375000000 >0.00172.

The endpoint t=0 is larger. An independent analytic audit confirms every sign, the concavity argument, and the exact rational bound. Thus Λ_a(t)>0.00172 on |t|<=4.3 uniformly for 0<=a<=1/2. No claim is made about the complement.

The degree-2 model can be moved beyond this wider core: take dν=200000e^(−t²)dt−(κ/2)(δ_{−5}+δ_5), κ=200000√π/200. On |t|<=4.3, its density exceeds 0.0018. Its normalized moments are 199/200, 3/8, and −19/8 for degrees 0,2,4, respectively; the monic selected p₂=t²−75/199 has negative norm −19/8−225/1592. An independent audit confirms all three moments, the selected polynomial, its negative norm, and the central lower bound. Narrow symmetric Gaussian bumps make an analytic signed density while preserving these strict facts. This remains a non-theta example.
