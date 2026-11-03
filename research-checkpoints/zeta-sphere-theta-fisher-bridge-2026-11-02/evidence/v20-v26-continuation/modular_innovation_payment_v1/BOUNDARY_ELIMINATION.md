# The integrated modular boundary feedback is a current-prefix scalar

Status: exact algebra awaiting independent review. Keep all signs and the w' term.

Use modular_cd_flux_v1 notation. Let sigma=(-1)^N, epsilon=-sigma, e=e_N, v=R^Te, ell=v+sigma e, ell0=ell-2sigma e. On the negative halfline put y(h)=Y(-h), F=y_N, and
 H=integral_0^infinity h y y^T dh, P=integral_0^infinity y y^T dh.
Both are positive CURRENT-prefix Grams in the actual pivot normalization. Since the last diagonal entry of R is sigma, ell_N=2sigma and ell0 has zero last component.

Define the integrated feedback with its explicit sign
 B_N=-2 integral_0^infinity h e^{-4ah} Z(h)e^T GY(h)dh.
Reflection rewrites it exactly as
 B_N=-2[epsilon <Z(-h),ell^Ty>_h+r^T H ell].
Here <,>_h uses weight h. The apparently next-degree cross product can be removed by integration by parts. The derivative recurrence gives
 Z(-h)=-F'(h)-e^T X_N y(h).
For U_old=ell0^Ty, all derivatives involve only current degrees because ell0_N=0. Therefore
 t_N:=<Z(-h),ell^Ty>_h
 =e^T P(ell0+sigma e)-e^T H X_N^T ell0-e^T X_N H ell,
and
 B_N=2sigma t_N-2r^T H ell.
Thus B_N>=kappa_N H_NN is a concrete scalar inequality using ONLY current-prefix positive Grams, actual pivot ratios, and the modular reflection coefficients. No next feature norm or next signed pivot appears in it.

However, B_N alone is NOT the whole compensated reserve. With w(h)=h e^{-4ah}, the exact integrated law is
 integral w Y^T C Y = B_N-integral w' Y^T GY.
The w' contribution is signed and can cancel the leading part of B_N. It must remain. Using reflection and the rank-two formula yields the sharper prefix identity
 integral w Y^T C Y =4a tr(H)-2 eta^T H e,
 eta=R^T r=(-1)^N r.
This scalar can have either sign; positivity of the invariant modular metric alone does not establish it.

Floating sanity checks from probe_payment.py at original theta,a=.25 give B_N/(kappa mu^-)=6.94365,4.00515,3.49975 for N2,4,5. But the COMPLETE integrated commutator is approximately -4.53907,-2.67285,+.156408, respectively. Hence interpreting the large raw boundary ratio as a proof of domination after compensation would already fail this finite sanity test. The formula derived here preserves exactly the cancellation responsible for that distinction.

The separate dual-innovation criterion in PREFIX_DUAL_PAYMENT.md compares an actual next signed Schur surplus to the cost; it is not obtained by silently identifying B_N with that surplus.
