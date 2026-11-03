# Actual signed tail-prefix variation with a positive reserve

This is a rigorous finite test beyond the locally positive three-dimensional old blocks. It bounds the four-dimensional old tail matrices on a whole spatial shell while permitting indefinite local densities. The data are the already certified even6/odd7 moments: no even8/odd9 target moments, target inverse, or target gain are inputs. It is not an extension of the known global ladder and not a degree-uniform theorem.

## 1. Matrices and orientation

For epsilon=0,1 define the known tail matrix
 B_epsilon(H)=[2 integral_H^infinity u^2 psi(u)^2 g_(i+j+epsilon)(u) du]_(i,j=0..3).
Its polynomial bases are(1,t^2,t^4,t^6) and(t,t^3,t^5,t^7). These can serve as OLD tail metrics for even8 and odd9, respectively. Let inward time t=1/8-H, so t in[0,1/8] and
 dB/dt=L(H)=[2H^2 psi(H)^2 g_(i+j+epsilon)(H)].
No positivity of this L is assumed. At t=0 the starting moments come from the previously independently certified1/8 tail outputs. The whole spatial tail to infinity is already paid in those inputs.

Decompose B into leading3x3 A, cross b, and last c. Its top known pivot is s=c-b^TA^-1b, optimizer z=-A^-1b, forcing r=A' z+b', and E=r^TA^-1r. Here prime denotes inward time t. Then s'=(z,1)^T L(z,1), with no sign assumption.

For the actual relative norm tau=||B^-1/2 L B^-1/2||, use the computable upper bound
 tau <= sqrt(tr((B^-1 L)^2)).                       (1)
Although B^-1 L is generally nonsymmetric, it is similar to the symmetric matrix B^-1/2 L B^-1/2. The trace of its square is therefore exactly the sum of squared real generalized eigenvalues. It is nonnegative and bounds their maximum squared modulus. Formula(1) retains negative local directions rather than replacing the trace by a signed log determinant.

## 2. Full-theta interval proof

`check_signed_tail_prefix.py` uses the previously reviewed full-theta degree16 derivative routine. It evaluates local moment densities and their second spatial derivatives with every omitted orbit covered by the existing analytic enclosure. No acquired code is executed.

For each of4000 cells of width w=1/32000 in inward time, with physical midpoint u and interval u+[-w/2,w/2]:
1. Compute interval local densities d_j and second derivatives d_j''.
2. Every partial-cell moment lies in its current endpoint interval plus
 [w min(0,lower(d_j)), w max(0,upper(d_j))].
 This signed hull is valid regardless of the density sign and the physical direction of traversal, because the inward increment is the integral of the same density over a shrinking-cutoff strip.
3. Form the entire4x4 matrix using these path enclosures. A general interval LDL factorization verifies all four pivots positive on the whole cell, not only at a midpoint. The last pivot enclosure supplies the known reserve s. Leading3x3 factorization supplies the actual optimizer and forcing E.
4. Bound (-s')_+, E, sqrt(E/s), |s'/s|, and the right side of(1) over the entire cell. Their upper rectangle integrals need no further quadrature correction.
5. Propagate each endpoint moment with midpoint density times w and error w^3 sup|d_j''|/24. The complete cell enclosure from step2 is separate from this sharper endpoint update.

Every inverse is an actual signed-theta integrated metric verified positive on its cell. There is no parent-metric replacement and no assumed local positivity. Standard interval forward/back substitution computes B^-1 L; the trace-of-square interval is used only through its upper endpoint. An independent reviewer can replace the input1/8 tail files with their separately generated originals.

## 3. Certified finite budgets (owned4000-cell result)

All constants below are conservative directed bounds. The orientation of negative variation is inward t, not increasing cutoff H.

Even four-dimensional old tail:
- whole-path top-pivot reserve s>58,072,434;
- s(t)/s(0)>.946417;
- integral(-s')_+ <5,676,280;
- integral E <3,089,471;
- integral sqrt(E/s)<.061754;
- integral |s'/s|<.164417;
- integral tau<.336484.

Odd four-dimensional old tail:
- whole-path top-pivot reserve s>4,578,291,659;
- s(t)/s(0)>.773331;
- integral(-s')_+ <4,645,952,573;
- integral E <2,831,798,569;
- integral sqrt(E/s)<.202810;
- integral |s'/s|<.965559;
- integral tau<1.382309.

The lower enclosures of negative variation are zero in both runs. Therefore these are bounds allowing negative pivot variation, NOT a certification that the top known pivot actually decreases. The1000-cell run is a coarser successful enclosure; the4000-cell run is the reported one.

The signed norm partition lemma now gives at most1 even and4 odd relative-conditioning cells of budget log(3/2), since .336484<log(3/2) and1.382309<4log(3/2). These are existence/conditioning counts, not proposed quadrature counts and not positive target-flow statements. The numerical proof used4000 cells for accurate enclosures.

## 4. A genuine indefinite local theta metric is included

The archived independently certified fixed witness (678,-66,1) has negative quadratic value in the odd local3x3 g-matrix throughout0<u<=1e-8. Append a zero coordinate to obtain a witness in the odd4x4 local matrix. Multiplication by the positive factor2u^2 psi(u)^2 preserves negativity. The first diagonal direction is positive there, so the odd local density is genuinely indefinite on that interval. At u=0 the weight vanishes; no strict statement is made at that endpoint.

Thus the new odd4x4 integrated-tail path really does retain a positive metric through a region with indefinite local density. This is not merely a conditional lemma or an assumption inherited from the old local-positive cases. The checker treats both parities signed but does not assert an even4x4 local negative direction.

## 5. What this establishes and leaves open

The actual positive prefix reserve and whole-interval signed forcing can coexist and be certified without local PSD, endpoint-only inference, or a target gain. This is a finite proof of that mechanism for the next OLD metrics. It does not prove either next Schur pivot or the correlated source for its unknown monic target. It supplies no bound as degree grows: the current input tail reserves and interval derivatives remain degree-specific. A uniform adaptive-partition argument still needs estimates controlling these quantities at all degrees, while keeping both negative source terms and the actual inverse feedback.
