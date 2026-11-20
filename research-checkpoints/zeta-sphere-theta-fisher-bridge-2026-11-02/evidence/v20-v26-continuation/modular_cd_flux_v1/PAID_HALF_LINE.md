# The single bad direction is an existing negative-halfline innovation energy

Status: direct consequence awaiting separate review; preserve frozen main/limit files.

In the modular square completion let z=RY and kappa_N=4aN+||r_perp||²/(4a). The exact reflection relation identifies
 z_N(h)=e^{2ah}Y_N(-h).
Therefore, against the positive measure h e^{-4ah}dh on h>0, the negative summand in that square completion integrates to
 kappa_N integral_0^infinity h e^{-4ah}z_N(h)²dh
 =kappa_N mu_N^-,
 mu_N^-:=integral_0^infinity hY_N(-h)²dh.
This is an actual current top-degree halfline energy, with the CURRENT true pivot s_N in the denominator. It is not an auxiliary Fisher metric or an uncontrolled higher derivative. If mu_N^+=integral_0^infinity hY_N(h)²dh, then mu_N^+−mu_N^-=1 exactly.

Under the positive normalized-prefix hypothesis of NORMALIZED_LIMIT.md, let F_N^0=T_N^0(D)psi_lambda, s_N(a)=a sigma_N(0)+O(a³). Then dominated convergence gives
 a mu_N^- -> (1/sigma_N(0)) integral_0^infinity h(F_N^0(-h))²dh.
Together with kappa_N/a ->4N+||d_perp||², the integrated bad cost has the finite limit
 [(4N+||d_perp||²)/sigma_N(0)] integral_0^infinity h(F_N^0(-h))²dh.
No positivity of the next pivot is used. This limit can be large; it is not a claim that the next reserve pays it.

For an integrated conservation law the boundary feature Z must still be retained. For E_G(h)=Y(h)^T GY(h), the exact differential identity is
 E_G'=Y^T C Y+2Z e_N^T GY.
Multiplying by w(h)=h e^{-4ah} and integrating gives
 integral_0^infinity w Y^T C Y
 =-integral_0^infinity w' E_G-2integral_0^infinity w Z e_N^T GY,
with endpoint boundary terms zero by theta decay and w(0)=0. Since w'=e^{-4ah}(1-4ah) changes sign, neither that term nor the next-feature cross term may be declared positive. The useful reduction is the explicit scalar current-halfline defect, not deletion of the remaining signed conservation-law terms.
