# Correlated theta conditional mean for the adaptive residual

New companion awaiting independent review. This avoids separately subtracting the scalar J and its actual inverse cost. It does not infer positivity of a differentiated theta kernel.

## 1. Exact correlated representation

At normalized a0 define the original midpoint correlation
 C(r)=integral_R v²psi(r+v)psi(r-v)dv=kappa_0(r).
For the known actual monic P_N define the signed field
 C_N(r)=[P_N(-(1/4)D_r²)]² C(r).
The squared notation means composition of the differential operator, not a pointwise square. In particular C_N need not be nonnegative.

The exact Fourier relation is Lambda(t)=4 hat C(2t). Consequently
 P_N(t²)²Lambda(t)=4 hat C_N(2t).
The scalar resolvent transform gives
 sP_N(-s)²Delta_N(s)
  =8pi sqrt(s) integral_0^infinity C_N(r)exp(-2sqrt(s)r)dr
  =4pi E[C_N(R_s)], R_s~Exp(2sqrt(s)).                 (1)
The original pivot is h_N=4pi C_N(0). All differentiations are finite and justified by full-theta strip/decay bounds. The known P_N and therefore C_N still contain the current actual prefix coefficients and their conditioning. No substitute polynomial is used.

This evaluates the correlated scalar residual as one signed theta conditional mean, without subtraction of two separately order1/s quantities. The audited bias bound remains
 |4pi E[C_N(R_s)]-4pi C_N(0)|<=B_N/s.                  (2)
The unknown pivot is still the contact value C_N(0); no sign is obtained merely because the averaging measure is positive.

## 2. Rigorous finite diagnostics using existing certificates only

The following calibrates(1)-(2) on two ALREADY CERTIFIED even pivots. It is not a new finite ladder extension, nor an independent proof of either pivot. Own-source check_correlated_diagnostic.py reads only the existing interval JSON integrated_pivots_certificate.json, and executes no acquired code.

The existing source certificate gives the normalized k-variable Gram in basis
 p0=1, p2=(k²-47)/66,
 p4=(k⁴-(551/2)k²+6419)/10500,
 bounded below by I/40. Its exact JSON intervals are checked again by rational Gershgorin arithmetic. The conversion to this note's actual density is
 mu[x^j]=(4pi/4^j) mathcal L(k^(2j)), x=t²=k²/4.

For N=1, P1=x-alpha has0<alpha<12 from the existing G00>3/100 and |G01|<1/10000. Its original monic pivot satisfies h1>=1089pi/40>3267/40. Applying the audited positive-norm envelope with |c0|<=12,c1=1, replacing8/3 by3 and logarithms by5, gives
 (Q0,Q1,Q2)=(12672,80256,381312),
 B1<=496012492800/7.
At s1=10^10, (2) and the EXISTING pivot reserve prove
 4pi E[C1(R_s1)]>70.

For N=2, write P2=(10500/16)p4+a p2+b p0. Orthogonality and G_old>=I/40 give |a|,|b|<11, using exact existing off-diagonal bounds |G02|<1/20000, |G12|<1/3000. Therefore its monomial coefficients obey |c0|<421,|c1|<70,c2=1, and
 h2> (3/10)(10500/16)²=4134375/32.
The same conservative derivative/spatial bounds give
 (Q0,Q1,Q2)=(2672832,16927936,80472960),
 B2<=22072411673083904/7.
At s2=10^12 the corresponding rigorous calibration is
 4pi E[C2(R_s2)]>100000.
Both statements follow from existing known pivot reserves plus an explicit transport error. They verify the scale/factor/error bookkeeping, but cannot be recycled as new proofs of those reserves.

The logarithm bound5 used above covers log(10(k+r+1)) for all k<=5 and r<=2. Full-theta derivative and spatial bounds, not a finite-orbit truncation, supply Q_r. The script uses3<pi<22/7 for rational comparisons. All displayed diagnostics retain actual monic P_N; coefficient enclosures are used only to upper-bound B_N.

## 3. What improved, and the remaining obstacle

Direct correlated integration of C_N removes the numerical J-minus-rho cancellation. It does not remove the sign problem: C_N can have signed regions, and its degree-dependent behavior on a window of radius about1/sqrt(s_N) is not controlled by the known upper-tail bounds or by positivity of C itself. Treating the differential-operator square in C_N as a pointwise square would be false.

To prove a new pivot by this route one must obtain, without using that pivot's already-known contact value, a lower estimate
 4pi E[C_N(R_sN)]>B_N/s_N.
The diagnostics above deliberately do not claim this independence. A new degree-uniform or degree-adaptive signed local estimate for the actual C_N is still needed.
