# Exact zero-pair halos and a pole-free selected-cost envelope

Status: the zero-pair halo theorem and pointwise majorant have been independently audited. The integrated cost formula and sufficient comparison have also been independently audited. This is an unconditional reduction at a fixed positive shift, not a proof of any new pivot or RH.

Fix 0<a<1/2, σ=1/2+a, s=σ+it. Pair every ξ zero ρ=1/2+d+iγ with d>0 and its functional-equation partner 1−conjρ=1/2−d+iγ, preserving multiplicity. The absolutely convergent real-part Hadamard sum gives the paired contribution

2a[a²+(t−γ)²−d²]
 / {[(a−d)²+(t−γ)²][(a+d)²+(t−γ)²]}.              (1)

Critical-line zeros contribute nonnegative terms. A pair (1) can be negative only when d>a and |t−γ|<w(d,a)=sqrt(d²−a²). Thus the negative set of the entire completed bridge Λ_a is contained, at every height, in the union of the explicit intervals

|t−γ|<sqrt[(β−1/2)²−a²],   ρ=β+iγ, β>σ.               (2)

At a zero on the evaluation line, ξ(s)=0 and the completed bridge equals zero, so no division by ξ is used there. The interval radius in (2) is always <=sqrt(1/4−a²)<1/2. Ingham's zero-density theorem gives the exceptional-set measure on [−X,X] as O_a(X^θ(log X)^5), with the improved exponent

θ=3(1−σ)/(2−σ)=1−4a/(3−2a).                            (3)

This exact pairing needs no large-height onset and is sharper than the earlier halos based on β>1/2+a/2. It does not identify the actual right-of-σ zeros or bound the selected weight on the intervals. At a<=0.3, the fixed sparse-set gamma concentration example in GAMMA_SPARSE_CONCENTRATION.md still fits the exponent (3); at a>0.3 that particular counterexample no longer fits and cannot be used to dismiss a length-based argument.

## Pointwise pole-free negative-part bound

The uniform cell/gamma estimate gives

|ξ'(u+iv)|<=22(1+|v|)^4e^(−π|v|/8),  1/2<=u<=1.

For t in (2), the segment from s to ρ lies in this strip and its height differs from t by less than 1/2. With

M(t)=22e^(π/16)(1.5+|t|)^4e^(−π|t|/8),

ξ(ρ)=0 implies |ξ(s)|²<=([(d−a)²+(t−γ)²])M(t)². Discarding all positive pair terms in (1) and applying this estimate separately to each negative pair cancels its potentially singular denominator. Thus

Λ_a^−(t) <= 8M(t)² Σ_{ρ: d>a, |t−γ|<w}
 [d²−a²−(t−γ)²]/[(d+a)²+(t−γ)²].                      (4)

The sum counts right-side zeros with multiplicity and is finite at each t. At ξ(s)=0 the left side is zero and (4) remains valid. This inequality uses the actual entire ξ and actual zero locations, not an assumed target pivot.

## Finite selected-polynomial sufficient cost

Let p_n be the actual selected monic polynomial, S_n the certified positive core reserve, and R the explicit cutoff in EXPLICIT_SELECTED_COMPLEMENT_TAIL.md which pays the far tail by S_n/2. For d>a write b=d+a, w=sqrt(d²−a²). The exact halo shape integral is

I(d,a)=∫_{−w}^w (w²−y²)/(b²+y²)dy
      =4d arctan(w/b)−2w <= 4w³/(3b²).                  (5)

This gives O((d−a)^(3/2)/sqrt(d+a)) as the zero approaches the line from the right. Define the explicit finite cost

U_{n,a}(R)=3872e^(π/8) Σ_{ρ: β>σ, |γ|<=R+1/2} I(d,a)
  × sup_{|t−γ|<=w} [p_n(t)²(1.5+|t|)^8e^(−π|t|/4)].   (6)

Then the negative middle contribution is at most U. Consequently the independently sufficient condition U<S_n/2 gives L_a[p_n²]>0. The full selected polynomial is retained, and U does not contain the unknown pivot. This condition is potentially conservative, and necessity is not established; it may be very wasteful, and evaluating or uniformly bounding it requires the right-of-σ zero distribution and their selected weights. No claim is made that (6) holds, is practically computable, or supplies an all-degree proof.
