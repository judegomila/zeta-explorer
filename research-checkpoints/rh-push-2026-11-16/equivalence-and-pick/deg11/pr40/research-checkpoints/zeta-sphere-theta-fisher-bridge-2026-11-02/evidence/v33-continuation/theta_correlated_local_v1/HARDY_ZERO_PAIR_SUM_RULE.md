# Spectral sum rule for the unpaid Hardy excess

Status: independent analytic review PASS. This is a noncircularity test and exact signed decomposition, not a new lower bound or a proof of RH.

Use F=2Xi and the linear functional L_a from HARDY_PREFIX_COMPRESSION.md. Define the entire, pole-free real-axis density
 U_a(F)(t)=-Im(F'(t+ia) conjugate(F(t+ia)))
          =(1/2)partial_a |F(t+ia)|^2.
Then L_a[p^2]=2 integral p(t)^2 U_a(F)(t)dt. This is exactly the correlated Hardy excess minus the actual prefix translation norm, not a substitute positive-parent quantity.

## 1. Exact conjugate-zero-pair decomposition

Conditionally suppose F has zeros at gamma+i delta and gamma-i delta with delta>0 and multiplicity m>=1. Factor only this pair:
 P(z)=(z-gamma)^2+delta^2,
 F(z)=P(z)^m G(z),
with G entire, real on the real axis, and nonzero at the selected zeros after extracting their full multiplicity. No assertion that such zeros actually exist is made.

For x=t-gamma, direct multiplication gives
 U_a(P)(t)=2a(x^2+a^2-delta^2).
The exact product identity is
 U_a(F)=|P|^(2m)U_a(G)
       +2am |G|^2 |P|^(2m-2)(x^2+a^2-delta^2).       (1)
There are no poles and no limiting divisions in (1). For a<delta, the second summand is negative precisely on |x|<sqrt(delta^2-a^2); its exterior is positive. Thus even one zero pair carries an intrinsically correlated interior/exterior cost, not an everywhere positive spectral summand.

The corresponding exact polynomial identity is obtained by multiplying (1) by2p(t)^2 and integrating over all t. In particular the negative-window cost is
 4am integral_(|x|<sqrt(delta^2-a^2)) p(t)^2 |G|^2 |P|^(2m-2)
                                      (delta^2-a^2-x^2)dt.   (2)
Both exterior contribution and the G term must be retained. U_a(G) is not declared positive: that would require information about the other zeros. The actual inverse-selected p may be inserted into (2), but no independence between that polynomial and the spectral density is assumed.

## 2. Why a generic all-degree energy proof cannot ignore this debt

At t=gamma and a=delta-epsilon with epsilon>0 small, P=delta^2-a^2 is positive of order epsilon. The first summand of(1) is O(epsilon^(2m)); the second is negative of order epsilon^(2m-1), with nonzero leading coefficient because G(gamma+i delta) is nonzero. Hence U_a(F)(gamma)<0 for sufficiently small epsilon. Continuity gives a negative open interval. If F is even, the reflected interval is also negative.

For the complete theta transform at any fixed a, U_a(F) has an exponential moment in t. One can obtain this directly by shifting the u Fourier contour within any smaller strip |Im u|<=c<pi/4: complete theta and its finitely many derivatives remain superexponentially decaying at both real ends, giving |F(t+ia)|+|F'(t+ia)|=O(exp(-c|t|)). Thus integral exp(eta|t|)|U_a(F)(t)|dt is finite for any eta<2c.

Polynomials are consequently dense in L2(|U_a(F)|dt); the usual proof uses exponential integrability to analytically continue the Fourier transform of any orthogonal vector times this measure and then uniqueness. For an even density, even polynomials are dense in its even subspace. Therefore a symmetric negative interval can be detected by an even polynomial squared: approximate its indicator in L2(|U|), then the corresponding quadratic integral converges to a strictly negative value. The same argument with measure t^2|U| detects intervals away from0 by odd polynomials t q(t^2).

Thus the hypothetical off-axis pair necessarily defeats some finite polynomial level. An all-degree positive bound cannot follow merely from real/even symmetry, entire Fourier domains, Hardy source positivity, or the known finite prefixes. It must exclude this spectral event through genuinely additional theta information. This does not assert the event occurs for theta.

## 3. Relation to the classical logarithmic-derivative criterion

Away from zeros, U_a(F)=|F|^2[-Im(F'/F)(t+ia)]. Functional symmetry converts this to the real part of xi'/xi at real part1/2+a. The theorem that positivity of Re(xi'/xi)(s) throughout Re s>1/2 is equivalent to RH is classical, not a new result of this campaign; see Jeffrey Lagarias, On a Positivity Property of the Riemann xi-Function, Acta Arithmetica89(1999),217-234, https://websites.umich.edu/~lagarias/doc/positivity.pdf . See also the 2005 correction, Acta Arithmetica116,293-294; its corrected Lemma3.1 is not used in this note.

A pointwise spectral proof of the needed Hardy payment would therefore be proving that criterion. A weighted, inverse-selected-polynomial proof may organize the problem differently, but it must still control the signed window (2) without presupposing the zero location. No estimate accomplishing this for all degrees is established here. The new content of this note is the explicit pole-free payment decomposition and its connection to the actual residual budget, not a claimed solution of the criterion.
