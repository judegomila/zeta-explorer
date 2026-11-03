# Nearby-shell signed flow: an actual two-parity obstruction

The quantitative remote partition gives availability but poor comparison constants. This companion tests the stronger nearby alternative using actual integrated theta core inverses. It finds genuine outward deterioration in the even6 example, despite positive local and integrated old metrics. Odd7 behaves differently at the same cutoff. No new ladder rung is claimed.

## 1. Exact signed moving-boundary identity

Let A(H),b(H),c(H) be the actual old block, target cross column and target moment integrated on |u|<=H. Suppose only A(H)>0 on the interval. Set z(H)=-A(H)^-1b(H), S(H)=c(H)-b(H)^TA(H)^-1b(H). In the same monomial coordinates let L(H),l(H),d(H) be the local boundary densities, including the positive full-line weight 2H²psi(H)², so A'=L,b'=l,c'=d. Then
 S'=d+2z^T l+z^T Lz.                                    (1)
When L>0, let z_loc=-L^-1l and s_loc=d-l^TL^-1l. Exactly,
 S'=s_loc+(z-z_loc)^T L(z-z_loc).                         (2)
The signed local target remainder and the actual mismatch are both retained. This is also the infinitesimal limit of the reviewed finite-shell Schur-plus-variance identity: for a shell of width delta, its Schur term divided by delta tends to s_loc, and its merge variance divided by delta tends to the second term of(2).

One further exact evolution identity, useful for adaptive estimates, is
 z'=-A^-1(Lz+l),
 S''=d'+2z^Tl'+z^TL'z-2(Lz+l)^TA^-1(Lz+l).               (3)
The final inverse-feedback term has a minus sign. Positivity of L or of A does not remove it or enforce monotone outward Schur growth.

## 2. Rigorous actual-theta interval test

The owned checker `check_nearby_shell_derivative.py` uses the previously independently audited full-theta derivative16 implementation. It reads only the existing core old and cross moments at H0=1/8:
- odd7: M1 through M6; M7 is NOT loaded;
- even6: M0 through M5; M6 is NOT loaded.
The target boundary density is computed directly from the complete theta profile.

For every H in I=[1/8,1/8+10^-8], each input moment is enclosed by its certified H0 interval plus a symmetric ball of radius10^-8 times the maximum absolute corresponding local density on I. This includes every actual moving-core moment, irrespective of its sign. The actual core inverse is then enclosed by interval LDL. Independently the boundary old matrix is checked positive by interval LDL on all of I. Formula(2), not a cancellation-prone raw quadratic expansion, produces the bounds below. All units are h/(4pi) per unit H.

Odd7, throughout I:
- s_loc is between -949575800 and -926804617;
- mismatch is between10534077155 and12191450402;
- S'(H)>9584501356.

Even6, throughout I:
- s_loc is between -3702400 and -3648234;
- mismatch is between2202229 and2274274;
- S'(H)<-1373960.

Both integrated core old matrices and both local old matrices are positive throughout I. Thus the full signed correction pays the local negative target in odd7, but fails to do so in even6 at this same nearby shell.

Integrating, the even6 optimized core becomes strictly worse on every initial subinterval: for0<delta<=10^-8,
 S_even6(H0+delta)-S_even6(H0)<-1373960 delta.             (4)
In odd7 the corresponding increase exceeds9584501356 delta. These statements use no integrated target norm as an input. The previously certified negative core values provide context, but are not needed to establish the derivative signs.

The much larger middle interval [1/8,1/2] was already proved to pay both negative cores after exact regression coupling. Equation(4) therefore does not refute eventual nearby-region compensation. It demonstrates that a degree-adaptive algorithm cannot justify monotone progress merely from positive old metrics, adjacency, or the positive merge variance. It must sometimes cross an initial interval of worsening signed remainder, and must preserve that debt.

## 3. What remains usable, and what remains missing

The exact multi-region tree remains valid. The differential identity(2) identifies the required local comparison in the actual metric; (3) exposes its negative inverse-feedback derivative. The two actual parity examples refute a common monotone-growth shortcut while verifying that the same local target negativity can be paid in one parity and unpaid in the other.

No generic all-degree assertion, uniform width, bound on the eventual minimum, or first successful merge is inferred. A useful uniform nearby-shell theorem would need a signed integrated lower bound across these adverse intervals, not pointwise positivity of the mismatch term. The present packet supplies a precise actual-theta obstruction, not another reformulation claimed as closure.
