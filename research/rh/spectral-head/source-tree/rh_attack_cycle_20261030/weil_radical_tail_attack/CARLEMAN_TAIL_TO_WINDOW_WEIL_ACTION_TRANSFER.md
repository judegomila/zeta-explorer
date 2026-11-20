# Carleman tail-to-window estimate for the actual Weil action

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer theorem, independent review pending.** This is a separate proposed upgrade from the head-energy estimate. It depends on the separately submitted radical-domain identity and restricted weighted-tail estimate. It retains the complete tail-to-window prime operator and does not prove a complement lower bound. No numerical run.

## 1. Operator and claimed residual

Let H_lambda be the fixed-support selfadjoint operator associated to the already admitted actual Weil form on I=[-ell,ell], ell=log lambda. This is a FIXED-SUPPORT operator; no global ordinary-L2 Weil operator is postulated.

Fix A>4. Let g be an actual positive-even prolate combination with concentration deficits at most lambda^(-A), mean zero, and g(0)=g(lambda)=0. Set

    f=S E(g) on the whole logarithmic line,
    F=P_I f, t=(I-P_I)f,
    t_+(ell+s)=t_-(-ell-s)=a(s), s>=0.

The proposed conclusion is

    ||H_lambda F||<=C_A lambda^(2-A/2)(1+log lambda)^(3/2)
                                                     ||F||. (1)

Thus A=6 gives a residual O(lambda^-1 log^(3/2) lambda), on an explicit guaranteed prefix with loss (6/pi^2)log^2 lambda rather than the older exponent8 prefix. This does not establish any floor on the orthogonal complement of that image.

## 2. Precisely identified admitted/submitted inputs

The radical-domain note proves, on the declared finite-regularity source class,

    q(f,h)=0

for smooth compact logarithmic tests h, and gives f in H1 with integrable derivative. Therefore F has compact support and bounded variation. Its Fourier transform is O((1+|xi|)^(-1)), so the full multiplier a(xi)Fhat belongs to L2, where a(xi)=Re psi(5/4+i xi/2)-log pi. In particular F lies in the actual fixed-support operator domain.

The restricted endpoint-row argument in the separate head-energy note gives

    ||exp(s)a(s)||_L2(0,infinity)^2
       <=C_A N_A ||g||add^2,
    N_A=lambda^(-A)[log(10lambda^A)]^3.                 (2)

The accepted actual coordinate Gram gives

    ||F||>=kappa/lambda ||g||add,
    kappa=a_*/(8sqrt2)>0.                                (3)

The rest of the proof is an explicit tail-to-window operator bound; it does not infer an action estimate merely from a small quadratic form.

## 3. Gamma cross kernel is a Carleman operator, not a boundary omission

The off-diagonal 5/4 gamma kernel is -K(r), where

    K(r)=exp(-5r/2)/(1-exp(-2r))
        =exp(-3r/2)/(2sinh r)<=1/(2r), r>0.              (4)

For the right tail and a central point x=ell-u, 0<u<2ell, the distance to ell+s is u+s. Hence the absolute gamma cross operator is bounded by one half of the Carleman kernel (u+s)^(-1), restricted to 0<u<2ell.

The full Carleman operator on L2(0,infinity) has norm at most pi by the weighted Schur test with weight s^(-1/2), since

    integral_0^infinity ds/[(u+s)sqrt(s)]=pi/sqrt(u).

The right-tail gamma norm is therefore at most (pi/2)||a||2. The left tail has the same estimate, so the two-tail gamma action into I is at most

    pi ||a||2.                                          (5)

This includes the touching-boundary singularity. It does not require a(0)=0, delete an endpoint trace, or identify the window periodically.

## 4. Continuum tail-to-window norm retains its lambda charge

For the right tail, the continuum operator is exactly

    x -> integral_0^infinity exp[(ell+s-x)/2]a(s)ds
       =exp[(ell-x)/2] integral_0^infinity exp(s/2)a(s)ds.

Its central L2 factor is sqrt(lambda^2-1)<=lambda. Its moment is at most ||exp(s)a||2 by Cauchy--Schwarz with exp(-s/2). Thus both tails together contribute at most

    2lambda ||exp(s)a||2.                                (6)

This is the continuum in the 5/4 normalization; no old pole term is appended.

## 5. Exact prime row and its absolute summability

For r=log n, the right-tail sample seen inside the window is a(r-b)1_(r>=b), with b=ell-x in[0,2ell]. Consequently

    ||P_I[t_+(.-r)+t_+(.+r)]||2
      = [integral_max(0,r-2ell)^r |a(s)|^2ds]^(1/2)
      <=min(1,exp[-(r-2ell)])||exp(s)a||2.                (7)

Only one of the two translations is nonzero for this tail. The left tail contributes the same bound. Minkowski therefore controls the full prime cross operator by

    2||exp(s)a||2
      {sum_(n<=lambda^2) Lambda(n)/sqrt(n)
          +lambda^2 sum_(n>lambda^2)Lambda(n)n^(-3/2)}
      <=C lambda ||exp(s)a||2.                           (8)

The last step is the classical unconditional Chebyshev bound, or the already admitted PNT, followed by partial summation. Both infinite ranges are retained, and the series converges in central L2. The factor lambda is not claimed to cancel.

## 6. Recover the actual operator action by radicality

For a smooth test h supported strictly inside I, q(h,F)=-q(h,t). On the right the local gamma diagonal is zero, and the three tail-to-window expressions in sections3--5 are exactly its gamma, continuum and prime pieces. Let B_I t denote their sum with the original signs. Then

    q(h,F)=<h,-B_I t>_L2(I),
    ||B_I t||2<=C lambda ||exp(s)a||2.                    (9)

The calculation is initially legitimate away from the boundaries. The Carleman estimate and the convergent arithmetic row extend it to central L2; density identifies the represented vector with H_lambda F. Equivalently, F is already in the operator domain by section2, and its action agrees with this vector on a dense test set.

Using (2) and (9),

    ||H_lambda F||<=C_A lambda sqrt(N_A)||g||add.          (10)

Dividing by the actual output Gram (3) proves (1). There is no missing square root or implicit change from input norm to physical output norm.

## 7. Exact scope and unresolved complement

Unlike the separate energy estimate O(lambda^(3-A)log^3 lambda), equation(1) is a bound on the full actual supported operator applied to the chosen image. It therefore controls that head's action into arbitrary physical test directions. It is still a restricted-family statement, and its constants/onset are unevaluated.

It does not prove positivity on the physical complement, bound its inverse Schur charge, establish a cofinal support-uniform Rayleigh floor, or imply RH. The larger near-null family can in fact produce additional near-critical gamma-relative directions; no complement gap is inferred from its existence.

The proof assumes the explicit paired-form radical identity only on the source class declared in the separate note, not a globally closed Weil form. Source repairs outside the trace-null sector remain separate. Historical accepted exponent8 certificates and notes are unchanged; this proposed exponent6 replacement awaits independent audit of this entire new chain.

Dependencies: `EXACT_RADICAL_WINDOW_IDENTITY_AND_TWO_TAIL_BRIDGE.md`; `POLYNOMIAL_DEFICIT_WEIL_HEAD_ENERGY_TRANSFER.md`, sections2--3 only for (2); accepted `../gamma_complement_attack/ITERATED_LOG_COORDINATE_TRANSITION_REDUCTION.md` for (3); and the authoritative actual 5/4 normalization.
