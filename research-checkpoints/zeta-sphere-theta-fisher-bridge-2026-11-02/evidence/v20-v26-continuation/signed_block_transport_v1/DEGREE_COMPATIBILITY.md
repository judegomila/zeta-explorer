# Exact degree/parameter compatibility and the remaining signed coefficient

Status: new algebra, not yet independently reviewed. This is a candidate coupling mechanism, NOT a closed recurrence sign theorem.

Fix a>0 and lambda in the same raw (not a-normalized) conventions as the transport packet. The a=0 normalized channel would require taking its separately justified limit; raw s vanishes there. Let p_n be the monic same-parity orthogonal polynomial for the ACTUAL bridge moment functional, n=epsilon,epsilon+2,... . Assume the actual previous parity pivots through s_n are positive, so the next monic residual is defined. Constant pi/2 factors are omitted. The finite orthogonal-polynomial algebra gives
 p_(n+2)(t)=(t²-a_n)p_n(t)-b_n p_(n-2)(t),
 b_n=s_n/s_(n-2)>0 (omit the base term),
 a_n=<t²p_n,p_n>_bridge/s_n.
After removing the common (-i)^n phase, F_n=T_n(D)g, this becomes
 F_(n+2)=F_n''+a_nF_n-b_nF_(n-2).
Full-line integration by parts gives the EXACT coefficient
 a_n=integral_R u(F_n')²/s_n.
This is an opposite-parity SIGNED energy, not ||F_n'||²/P_n. No sign of a_n follows merely from the same-parity induction. A positive terminal spectral measure gives its sign at lambda=1, but transferring it back is part of the unresolved comparison.

For a fixed spatial interval I let s_n,I=integral_I uF_n²,
 c_(j,k),I=integral_I uF_jF_k, t_n,I=integral_I u(F_n')².
The regional Green-flux identity is
 t_n,I=a_n s_n,I-b_n c_(n-2,n),I-c_(n+2,n),I
       +[uF_n F_n'-(1/2)F_n²]_boundary(I).
All shared-boundary terms telescope when blocks are summed. The two cross terms vanish only GLOBALLY by actual orthogonality; they must be retained jointly blockwise. This is the degree analogue of the regression-feedback transfers in TRANSPORT_GAUGE.md.

An exact physical Christoffel-Darboux conservation law makes the coupling explicit. For N such that all pivots in the sum are positive, set
 K_N(u,v)=sum_(j=0)^N F_(epsilon+2j)(u)F_(epsilon+2j)(v)/s_(epsilon+2j).
Then
 (D_u²-D_v²)K_N(u,v)
 =[F_(epsilon+2N+2)(u)F_(epsilon+2N)(v)
   -F_(epsilon+2N)(u)F_(epsilon+2N+2)(v)]/s_(epsilon+2N).
Proof: substitute the three-term recurrence. Diagonal a_n terms cancel; b_n/s_n=1/s_(n-2) makes every interior cross-degree term telescope. This identity does NOT require the next pivot to be positive.

In particular along the reflected pair v=-u,
 d/dh [(D_u+D_v)K_N(u,v)|_(u=h,v=-h)]
 =[F_next(h)F_current(-h)-F_current(h)F_next(-h)]/s_current.
Thus the reflected twin-ladder determinant is an exact boundary flux for the normalized degree kernel, not a standalone positive quantity. Its sign is NOT asserted.

These degree identities can be combined with the finite triangular parameter characteristic PDE and endpoint feedback formulas without raising derivative order in the parameter transport. They identify the missing sign inputs explicitly: opposite-parity signed energy a_n, regional cross-degree means, and reflected boundary flux. The accepted positive-parent growth bound controls magnitudes but does not supply these signs. No theta-specific uniform sign law for these coupled quantities has been established here; replacing them by positive variances recreates the quantified Cauchy failure already audited.
