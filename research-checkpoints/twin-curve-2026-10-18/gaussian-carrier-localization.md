# Gaussian carrier localization: exact closure and a signal ceiling

18 October 2026. New derivation, independently checked in an internal mathematical review. External peer review remains outstanding. This tests a proposed localization of the signed Gaussian criterion. It proves an obstruction to a particular smoothing strategy, not to the desired zero-free curve or to a genuinely signed arithmetic estimate.

## 1. Definitions and exact averaging

Let q,h>0, sigma>0, D=1+2q sigma^2, q'=q/D, h'=h/D, and A=sigma^2 h^2/(2D). Let U be a centered real Gaussian of variance sigma^2. For a nontrivial zeta zero rho=beta+i gamma put y=beta-1/2 and z=gamma-T+i y. Define the absolutely convergent zero sums

Z(T;q)=sum_rho m_rho exp(-q z^2),
H(T;q,h)=sum_rho m_rho exp(-q z^2-i h z),
Q(T;q,h)=Z(T;q)-Re H(T;q,h).

Reflection in beta=1/2 makes Z real. More generally the following formulas hold for any reflected zero multiset in a fixed horizontal strip with polynomial counting growth. Completing a Gaussian square gives, for every complex z,

E exp[-q(z-U)^2-i h(z-U)]
 =D^(-1/2) exp(-A) exp[-q' z^2-i h' z].             (1)

Also E exp[-q(z-U)^2]=D^(-1/2)exp(-q'z^2). Gaussian domination justifies termwise averaging of the zero sums. Therefore

E Q(T+U;q,h)
 =D^(-1/2)[Z(T;q')-exp(-A)Re H(T;q',h')].           (2)

This is not merely Q at a new heat time. In particular the extra term in

D^(-1/2){exp(-A)Q(T;q',h')+[1-exp(-A)]Z(T;q')}

cannot be assigned a favorable sign without a separate proof. Reflection makes Z real, not necessarily nonnegative.

On the complete prime side define u_n=log n and

C(T;q,h)=sum_(n>=2) Lambda(n)/sqrt(n)
 [r_q(u_n-h)+r_q(u_n+h)-2r_q(u_n)]cos(Tu_n),
r_q(v)=(4pi q)^(-1/2)exp[-v^2/(4q)].

Absolute convergence follows already from Lambda(n)<=log n. The exact carrier average multiplies EVERY term by exp(-sigma^2 u_n^2/2). In particular

r_q(u-h)exp(-sigma^2 u^2/2)
 =D^(-1/2)exp(-A)r_(q')(u-h'),                       (3)

and the backward packet has the same prefactor, while the diagonal packet becomes D^(-1/2)r_(q')(u). All prime powers and all tails are retained. If the original trace identity is written Q=G+P+C, its averaged form is exactly E Q=E G+E P+E C; neither G nor P is discarded or assigned an asymptotic value here.

## 2. The exact off-line signal ceiling

Specialize q=kh with k>0. Center the carrier at an actual zero ordinate, T=gamma, and take its positive displacement y>=0. The magnitude of its contribution to E H is exactly

S_y(h)=D^(-1/2) exp{ h[y+ky^2-sigma^2 h/2]/D },
D=1+2kh sigma^2.                                     (4)

The exponent satisfies the sharp identity

h[y+ky^2-sigma^2 h/2]/(1+2kh sigma^2)
 =y^2/(2sigma^2)
  -(sigma^2 h-y)^2/[2sigma^2(1+2kh sigma^2)].         (5)

Consequently, uniformly over ALL h>0 and ALL k>0,

S_y(h)<=exp[y^2/(2sigma^2)].                          (6)

The exponent reaches its maximum at h=y/sigma^2; the extra D^(-1/2) only decreases the full signal. For y=0 the exponent is nonpositive. A multiplicity m simply multiplies (4) by m; the ceiling applies per unit multiplicity.

Thus a Gaussian carrier average of fixed positive width removes unbounded heat amplification of a zero with y=eta(T) tending to zero. This is an exact individual-signal statement; it does not presume that the entire zero sum is positive or that one component alone determines Q.

More quantitatively, to retain a per-zero gain at least B>1 through this average, it is necessary that

sigma^2<=y^2/[2 log B].                               (7)

For example a proposed gain B=log T requires sigma<=y/sqrt(2loglog T). This is a conditional requirement on that desired gain, not a new theorem saying every possible detector must demand this particular B. At physical support h of order log T/eta, keeping the exponent in (4) nonnegative already requires sigma^2 h<=2(eta+k eta^2). A fixed-radius averaging window does not satisfy that requirement as eta shrinks.

A further scope issue remains even before this ceiling: the Gaussian carrier measure has unbounded support. It is not automatically an admissible compact covering-window average in the existing detector. A valid use would also need a separate covering/tail argument. The obstruction above grants the full Gaussian average, so removing this extra difficulty alone does not remove (6).

## 3. Continuum compensation and the unsigned-prime gap

The positive whole-line forward continuum mass after this averaging is exactly

M(h)=integral_R exp(u/2)r_(kh)(u-h)exp(-sigma^2 u^2/2)du
 =D^(-1/2)exp{ h[1/2+k/4-sigma^2 h/2]/D }.           (8)

This is a normalizing continuum quantity, NOT a lower bound for the oscillatory actual-prime sum. It is the same Gaussian integral that enters the exact pole compensation. For 0<=y<1/2, division by (4) gives

M(h)/S_y(h)
 =exp{ h'[(1/2-y)+k(1/4-y^2)] }.                    (9)

Any common renormalization of the averaged prime and zero expressions cancels in this ratio. Carrier smoothing changes the available effective heat time h' and adds a common damping factor; it does not remove the gap between the continuum exponent 1/2 and the target zero displacement y.

Equations (5) and (9) rule out the hoped-for shortcut in which a broad positive Gaussian carrier average both preserves arbitrary heat amplification at y=eta and pays the large prime packet merely by its unsigned continuum envelope. They do not show that the actual signed packet is large, and they do not rule out a proof using additional fixed-prime arithmetic correlations.

## 4. Demodulation preserves the signal but narrows the same prime packet

One may try to cancel the carrier phase by multiplying the averaging weight by exp(-i h U). This gives another exact identity:

E {exp(-i h U) exp[-q(z-U)^2-i h(z-U)]}
 =D^(-1/2)exp[-q' z^2-i h z].                       (10)

Thus the factor exp(-A) disappears and the original h is retained. However the averaging weight is now complex and is not a nonnegative covering average. Moreover, on the forward complex prime exponential exp[i(T+U)u], the multiplier is exp[-sigma^2(u-h)^2/2]. It obeys

r_q(u-h)exp[-sigma^2(u-h)^2/2]
 =D^(-1/2)r_(q')(u-h).                              (11)

The main packet centered at log n=h is retained, only narrowed. Its whole-line unsigned continuum mass is D^(-1/2)exp(h/2+q'/4), whereas the corresponding zero at the carrier center contributes D^(-1/2)exp(hy+q'y^2). Their ratio is

exp[(1/2-y)h+(1/4-y^2)q'].                           (12)

For the real cosine sum the exact multiplier is half the sum of two complex terms, centered at +h and -h respectively; (11) refers to the forward complex exponential, not to both terms at once. Neither half may silently be discarded.

There is also an exact zero-side closure statement:

E Z(T+U;q)-Re E[exp(-i h U)H(T+U;q,h)]
 =D^(-1/2)Q(T;q',h).                                (13)

It reproduces the original heat-test family with a smaller q. It does not establish positivity or bound any arithmetic remainder. All compensating gamma, pole and prime terms must be transformed consistently if this identity is used.

## 5. Result and remaining arithmetic theorem

This localization attempt has been settled analytically: positive Gaussian carrier smoothing has the ceiling (6); signal-preserving demodulation returns a narrower version of the same difficult prime packet and loses the nonnegative-window quantifier. No finite samples or unspecified tails enter these conclusions.

The reviewed target retained from the previous investigation is still a one-sided full-Gaussian large-forward-prime negative-energy bound below 1/51200 at every covering carrier or permitted covering-window average, with frozen parameters and the paid deterministic reductions. This note does not re-prove that earlier detector, change its threshold, establish a global curve, or exclude finite off-line exceptions. A genuinely signed actual-prime estimate remains necessary. The new statement is an obstruction to this specific averaging shortcut, not an assertion that no localization method can work.
