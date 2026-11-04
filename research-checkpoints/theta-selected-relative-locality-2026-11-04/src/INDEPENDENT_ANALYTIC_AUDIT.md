# Independent audit: natural-row decay and relative selected locality

2026-11-04. Verdict: PASS for the mathematical implications stated below, with the supplied exact theta transform, source/reference comparison, and simple-zero resonance theorem as explicit inputs. This is an independent AI-assisted analytical audit, not machine formalization or external peer review.

Audited files:

- FIXED_ROW_STRETCHED_EXPONENTIAL.md
- DIRECT_HEAD_AND_RELATIVE_COLUMN_OBSTRUCTION.md

Supporting files read:

- ../theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md
- ../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md
- ../theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md
- ../theta_selected_column_locality_20261104/NO_FAST_SELECTED_MULTIPLICATION_TAIL.md

No frozen package or live 4CT file was modified.

## 1. Fourier conventions and the factor of two

The supplied normalization identifies F(t) with a fixed nonzero constant times xi(1/2+it), and uses F(t)=integral psi(u) exp(-itu) du after absorbing that constant into psi. There is no hidden t-to-2t rescaling in this identity.

The classical kernel displayed in the fixed-row proof is analytic in |Im u|<pi/4. Its exp(-pi m^2 e^{2u}) terms have uniformly positive damping on each smaller closed strip, and the even analytic continuation gives the reflected tail. Fixed derivatives and polynomial factors have bounds

    C exp(M|Re u|-c e^{2|Re u|}).

For the Pollaczek convention Q_n(t)=P_n^(lambda)(t/2;pi/2), the exact generating function is

    sum Q_n(t) z^n = (1+z^2)^(-lambda) exp[t arctan z].

The t/2 in the Pollaczek argument is exactly canceled by the factor 2 multiplying that argument in the exponential. Thus the generating exponent is t arctan z, not 2t arctan z and not (t/2) arctan z. This scale is crucial for the available analytic margin.

If k(u)=(1/(2pi))integral f(t)exp(itu)dt and L(s)=integral f(t)exp(st)dt, the correct relation is

    L(s)=2pi k(-is).

The sign in the audited proof is correct. Either reflected sign would give the same symmetric bounds, but the actual identity is as displayed.

## 2. Convolution continuation and uniform tails

The inverse transform of F^(a)F^(b) is the convolution of (-iu)^a psi(u) and (-iu)^b psi(u), with the fixed constants appropriate to the stated convention. At u=U+iY, evaluate the convolution on v=x+iY/2. Both kernel arguments have imaginary part Y/2, so this definition is available for |Y|<pi/2.

A technical point is worth making explicit: when |Y|>=pi/4, one should not claim to start from an integral over the real v axis with both factors already defined there. Instead use local fixed intermediate contours. For each u_0 in the doubled strip, choose an intermediate contour making both factor arguments lie in their original strips in a neighborhood of u_0. The integral is analytic there. On overlaps, the contours deform into one another, with vanishing vertical-edge terms from the double-exponential bounds. This supplies analytic continuation from the original convolution to the whole doubled strip. The audited proof includes this local-contour argument, so it has no gap here.

For |Y|<=sigma<pi/2, absorb all linear and polynomial factors in the original kernel bounds. The remaining absolute integrand is bounded by

    C exp[-c(e^{2|x|}+e^{2|U-x|})].

For U>=0,

    e^{2|x|}+e^{2|U-x|}
       >= 2e^U cosh(2(x-U/2)).

Reflection gives the same statement with |U|. Since cosh(2y)>=1+2y^2, integrating gives

    |k(U+iY)| <= C exp(-c' e^{|U|}).

Constants are uniform on each smaller closed strip. Fixed derivatives satisfy the same type of estimate by complex Cauchy estimates in a fixed-radius disk inside a slightly larger strip. A bounded real displacement only changes the positive constant multiplying e^{|U|}.

## 3. Exact source integrands

The integration-by-parts formula

    X(p,q)=integral p Lq,
    Lq=-(F^2 q')'+2(F'^2-FF'')q

has the correct sign and retains all source cross terms. For multiplication,

    X(t^2 Q_n,q)=integral Q_n(t) [t^2 Lq(t)]dt.

Thus it is t^2 Lq, not L(t^2 q), that belongs in the fixed-row generating function. This distinction is correctly handled in the audited proof.

Both Lq and t^2Lq are finite sums of polynomial multiples of products F^(a)F^(b). Their inverse transforms are finite sums of derivatives of the convolutions above. Hence their Laplace transforms satisfy

    |L(s)|<=C exp(-c e^{|Im s|}),  |Re s|<=sigma<pi/2.

Absolute Laplace convergence in the open strip follows independently from the exponential decay of F and its fixed derivatives; analytic uniqueness then justifies the identity with the continued inverse transform.

## 4. Complex endpoint sectors and Gevrey order

Let

    A(z)=(1+z^2)^(-lambda)L(arctan z),
    arctan z=(1/(2i))Log((1+iz)/(1-iz)).

The Mobius quotient maps the unit disk into the right half-plane. On the unit circle, away from z=+i and z=-i, its argument is +pi/2 or -pi/2. Thus Re(arctan z)=+pi/4 or -pi/4 there. The doubled Laplace strip has width pi/2, leaving a strict positive margin beyond both boundary values.

For a unit-circle point z_0 near one endpoint zeta, put delta_0=|z_0-zeta|. A disk |z-z_0|<epsilon delta_0 with sufficiently small fixed epsilon avoids both endpoints. The vanishing linear factor changes by a bounded small relative amount, and the other factor stays bounded away from zero. Continuing the branches from the adjacent unit-circle arc, the argument of their quotient changes by O(epsilon). Consequently this disk stays in |Re(arctan z)|<=sigma for some pi/4<sigma<pi/2. The two endpoint arcs may use different local branches; each agrees with the disk branch on the relevant overlap, which is all the Cauchy argument needs.

Uniformly on such disks,

    exp(|Im(arctan z)|) >= c delta_0^(-1/2),
    |A(z)| <= C delta_0^(-lambda) exp(-c delta_0^(-1/2)).

This is a complex-neighborhood estimate, not merely a radial or real-axis estimate. It is therefore strong enough for derivative control. Passing to the angular coordinate, Cauchy's estimate gives

    |B^(k)(theta)|
      <= k! (C/delta)^k delta^(-lambda) exp(-c delta^(-1/2)),
    B(theta)=A(e^{i theta}).

For each fixed k these derivatives tend to zero at an endpoint, so extension by zero is smooth. Optimizing in y=delta^(-1/2) bounds y^{2k+2lambda}exp(-cy) by C A^k(k!)^2; the fixed extra power of k is absorbed into A^k. Therefore

    ||B^(k)||_infinity <= C A^k(k!)^3.

On complementary compact arcs ordinary analyticity gives the same bound. Periodicity and repeated integration by parts, with k proportional to n^(1/3), prove

    |X(Q_n,q)|+|X(t^2Q_n,q)| <= C_q exp(-c_q n^(1/3)).

The boundary function is continuous on the closed disk, including the flat endpoints, so its nonnegative Fourier coefficients are the original Taylor coefficients. No exchange of divergent endpoint integrals is needed.

## 5. Normalization needs only the general reference comparison

The stronger natural-family lower bound X[Q_n]>=c h_n log^2 n certainly suffices for normalization, but is unnecessary. NATURAL_GAMMA_REFERENCE.md already gives

    X[Q_n] >= exp[-C log^2(n+2)] h_n,
    h_n=||Q_n||^2_{W_*} asymptotic to const n^(7/2).

Dividing by sqrt(X[Q_n]) therefore costs at most exp[O(log^2 n)] times a polynomial factor. This is absorbed by a decrease in the positive constant in exp(-c n^(1/3)). Consequently, for e_n=Q_n/sqrt(X[Q_n]),

    |X(t^2 e_n,q)| <= C_q exp(-c_q n^(1/3)).

The same is true without t^2. Thus the new direct route need not depend on the delicate Hardy mean/source sandwich estimates. The researcher incorporated this simplification into Section 7 of the audited fixed-row proof before finalization. Passing to a fixed parity replaces degree n by epsilon+2n and changes only constants.

## 6. Actual natural-coordinate norm and diagonal bound

In one parity, let psi_j be W_*-orthonormal, s_j=sqrt(X[psi_j]), and e_j=psi_j/s_j. Write

    q_n=sum_{j<=n} c_{j,n} e_j,
    X[q_n]=1.

The exact quadratic identity is

    ||q_n||^2_{W_*}=sum_{j<=n}|c_{j,n}|^2/s_j^2.

NATURAL_GAMMA_REFERENCE.md, Section 2, gives the lower source comparison and the general upper bound C(d+1)^3 at degree d. In parity index this yields

    ||q_n||^2_{W_*} <= exp[C log^2(n+2)],
    max_{j<=n}s_j^2 <= C(n+1)^3.

It follows directly that

    ||c_{:,n}||_2^2
       <= (max_{j<=n}s_j^2)||q_n||^2_{W_*}
       <= exp[C' log^2(n+2)].

After changing constants, ||c_{:,n}||_2 and c_{n,n} obey the same quasi-polynomial upper bound. This is a quadratic identity and norm estimate, not an assumed localization estimate or absolute synthesis approximation. The degree/parity conversion is harmless.

## 7. Head-tail split and the main relative-locality verdict

Fix one selected polynomial q_i and put a_j=X(t^2 e_j,q_i). Its stretched-exponential bound makes the a_j square summable, with

    (sum_{j>m}|a_j|^2)^(1/2) <= C_i exp(-c_i' m^(1/3)).

Exact synthesis followed by Cauchy-Schwarz on each piece gives

    |X(t^2 q_n,q_i)|
       <= C_i ||c_{[0,m],n}||_2
          +C_i exp[C log^2(n+2)-c_i' m^(1/3)].           (*).

For m=floor(n/2), any eventual stretched-exponential upper bound on the head would force an eventual stretched-exponential selected multiplication row, forbidden by the supplied resonance theorem.

In particular suppose, for fixed K,C,gamma,alpha>0,

    |c_{j,n}/c_{n,n}|
       <= K exp[C log^2(n+2)] exp[-gamma(n-j)^alpha]

for every j<=n and all sufficiently large n. Multiplying by the audited c_{n,n} bound and summing squares over j<=n/2 gives a forbidden stretched-exponential absolute head bound. Thus even this quasi-polynomial-prefactor relative distance-locality hypothesis is excluded. The identical conclusion for absolute columns follows without the diagonal multiplication.

For the finite Gram matrix G_n of the e basis, the last selected column satisfies

    c_{:,n}=G_n^{-1}e_n^{coordinate}/sqrt((G_n^{-1})_{nn}),
    c_{j,n}/c_{n,n}=(G_n^{-1})_{jn}/(G_n^{-1})_{nn}.

These identities follow from orthogonality to the lower prefix and positive leading coefficient. Hence the relative synthesis-column statement is exactly the asserted diagonal-relative inverse-Gram-column statement.

More generally, choosing m approximately n^delta/2 for any fixed delta>0 gives the same obstruction for fractional-power heads. Constants in the natural-row bound may depend on i; only one fixed row is needed, so no uniform two-growing-index bound has been smuggled into this argument.

## 8. Optional log^6-sized quantitative head

The separately supplied resonance theorem also excludes a selected row bound K exp[-B log^2(n+2)] whenever B>C_0, where C_0 is its compact-evaluation threshold. The parity conversion changes only a polynomial factor and does not invalidate the strict inequality B>C_0.

Fix B>C_0 and choose L large enough that the constants in (*) satisfy

    c_i' L^(1/3)-C>B.

With m_n=min(n,floor(L log^6(n+2))), the tail term in (*) is eventually bounded by a constant times exp[-B log^2(n+2)]. Rounding contributes a vanishing error to m_n^(1/3)-L^(1/3)log^2(n+2); the strict gap absorbs it.

An eventual head bound K exp[-B log^2(n+2)] would therefore give the prohibited selected row bound. This proves the quantitative log^6 head assertion. For a relative head, an exponent exceeding B+C_diag suffices, where c_{n,n}<=exp[C_diag log^2(n+2)]. No explicit numerical values of L or the thresholds are established.

Equivalently, the absolute head times exp[B log^2(n+2)] has infinite limsup. This follows because an eventually bounded product would provide some finite K, precisely the excluded hypothesis. It is not a lower bound at every n.

A threshold-free variant is also valid: if m_n^(1/3)/log^2(n+2) tends to infinity, then neither the absolute nor relative head can obey an eventual bound exp[-eta_n log^2(n+2)] with eta_n tending to infinity. For example m_n=floor(log(n+2)^(6+delta)) works for any fixed delta>0, using the corresponding stronger resonance exclusion.

## 9. Scope

The main result is the failure of the specified eventual upper bounds for actual selected synthesis or relative inverse-Gram columns. It is stronger than the subpower-amplitude IMS consequence and bypasses inverse-matrix locality entirely. Its three substantive inputs are exact theta-kernel analyticity, the general source/reference norm comparison, and the supplied selected simple-zero resonance theorem.

This audit does not establish lower bounds at every degree, identify an individual low coefficient carrying the required mass, establish derivative coherence, or prove or refute RH. It does not claim external peer review or machine verification.
