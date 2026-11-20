# Complete-theta Laguerre hierarchy: exact recurrences and forcing obstruction

Status: independent derivations and exact algebra checks; no RH proof and no global positivity established. 2026-11-02.

## Input and normalization

Read the originating private research thread (conversation identifier redacted for repository publication) and its source `libfile_45bd1fbffcf481918939d4c18afd8b43`. Local source supplied by foundations lane: `../foundations/bridge_shear_vortex_positivity.tex`.

Use f(t)=Xi(t)=integral_0^infinity psi(u) cos(tu)du, with the full even strictly positive smooth profile

    psi(u)=4 sum_{m>=1}(2 pi²m⁴ exp(9u/2)−3 pi m² exp(5u/2)) exp(−pi m² exp(2u)).

Define P(h,v)=psi(h−v)psi(h+v), M_n(v)=integral_0^infinity h^(2n)P(h,v)dh. All derivatives and polynomial/exponential weighted integrals below converge, locally uniformly in their parameters. Every occurrence of psi means the complete profile, not a finite theta cutoff.

## 1. Exact universal derivative recurrence

For a real entire f, H(t,a)=f(t+ia)f(t−ia)=sum_n L_n[f](t)a^(2n). Holomorphicity gives

    H_tt+H_aa=4 f'(t+ia)f'(t−ia).

Comparing entire Taylor coefficients proves

    (2n+2)(2n+1)L_{n+1}[f] = 4L_n[f'] − (L_n[f])'' .             (1)

This is exact but is not a positivity-preserving recurrence. Even knowing L_n[f]>=0 says nothing about the sign of its second derivative, nor does it supply L_n[f']>=0. At n=0 it reduces to L_1=f'^2−ff''.

A kernel-side identity independently obtained by differentiating P is

    M_n'' = 2n(2n−1)M_{n−1} − 4N_n,                          (2)
    N_n(v)=integral_0^infinity h^(2n)psi'(h−v)psi'(h+v)dh.

For n=0 the first term is zero. The h-boundary derivative is zero because psi is even. N_n is a new signed derivative-profile coupling, not a nonnegative quantity that can be omitted.

## 2. Gaussian multiplier / backward heat hierarchy

Define psi_tau(u)=exp(tau u²)psi(u), f_tau its cosine transform, and M_{n,tau} as above. This exists for every real tau, and locally for complex tau. Differentiation gives

    partial_tau f_tau = −partial_t² f_tau,
    partial_tau H_tau = (H_aa−H_tt)/2,
    partial_tau L_n[f_tau]
      = ((2n+2)(2n+1)L_{n+1}[f_tau]−partial_t²L_n[f_tau])/2,   (3)
    partial_tau M_{n,tau} = 2M_{n+1,tau}+2v²M_{n,tau}.         (4)

In particular,

    M_{n,tau}=2^(−n)(partial_tau−2v²)^n M_{0,tau}.

The operator is not PD-preserving: multiplication by v² or subtraction of it does not preserve positive definite functions. A positive definite function vanishing at zero must be identically zero; thus −v² times a strictly positive Gaussian is not PD. No forward probabilistic diffusion argument can be applied to (3): the spatial derivative occurs with the backward sign. This does not disprove a more subtle coupled propagation theorem.

The Gaussian multiplier is not the theta heat parameter. Although it preserves evenness, it does not preserve the same modular theta identity.

## 3. Exact modular/heat structure, and why it does not close (1)

With explicitly normalized theta

    Theta(z,x)=sum_{m in Z}exp(−pi m²x+2pi i m z),
    G(u,z)=exp(u/2)Theta(z,exp(2u)), alpha(u)=exp(2u)/(2pi),

termwise differentiation proves

    Theta_x=(1/(4pi))Theta_zz,
    G_u=G/2+alpha G_zz,
    psi(u)=[(partial_u²−1/4)G(u,z)]_{z=0}
          =[3alpha G_zz+alpha²G_zzzz]_{z=0}.                 (5)

The Jacobi identity makes G(u,0) even. Hence all odd endpoint jets of psi vanish. But differentiation of (5) generates G_zzzzzz and higher derivatives with nonconstant exp(2u) coefficients. These are not the h^(2n) moments M_n alone. Dropping these extra derivatives or treating u as the original theta diffusion time would be an invalid closure. The identities (5) are derived directly from the displayed absolutely convergent series; the standard theta heat equation is also recorded at https://dlmf.nist.gov/20.13.

## 4. Full theta forcing around an exactly solvable Gaussian

Set q(u)=−psi'(u)/psi(u), an odd smooth function. For any fixed kappa>0 put r_kappa(u)=q(u)−kappa u and

    R_{n,kappa}(v)=integral_0^infinity h^(2n+1)
      [r_kappa(h−v)+r_kappa(h+v)]P(h,v)dh.

Integrating partial_h[h^(2n+1)P(h,v)] gives, without any omitted boundary term,

    2kappa M_{n+1}=(2n+1)M_n−R_{n,kappa}.                   (6)

This isolates the full coupling defect of a Gaussian approximation. For psi(u)=c exp(−kappa u²/2), R=0, and M_n is a positive constant times exp(−kappa v²), so every level is PD and the recursion genuinely propagates positivity.

For the actual theta profile, the first theta term and exponentially small relative remainder imply

    q(u)=2pi exp(2u)−9/2+O(exp(−2u)) as u→+infinity.          (7)

In particular q(u)/u→infinity. No fixed Gaussian reference makes R vanish. For (6) to propagate positive definiteness one needs the full kernel-order inequality

    R_{n,kappa} <=_PD (2n+1)M_n,

not a pointwise inequality. This exact condition is a restatement of the target at level n+1, rather than a proved simplification. A stronger sufficient assertion −R_{n,kappa} PD would be useful if true, but the next theorem rules it out at all orders for every fixed kappa.

### Scoped theorem: the forcing is not favorable at high order

For the complete theta profile and every fixed kappa>0,

    M_{n+1}(0)/(n M_n(0))→0,
    R_{n,kappa}(0)/[(2n+1)M_n(0)]→1.                         (8)

Consequently R_{n,kappa}(0)>0 for all sufficiently large n, and −R_{n,kappa} cannot be PD at those levels.

Proof: write w(h)=psi(h)² and m_n=integral_0^infinity h^(2n)w(h)dh. Integration by parts gives

    (2n+1)m_n=2 integral_0^infinity h^(2n+1)q(h)w(h)dh.

Fix K>0. By (7), choose H>0 so q(h)>=Kh for h>=H. On [0,H], q and w are bounded. Therefore

    K m_{n+1} <= (2n+1)m_n/2 + O_K(H^(2n+2)).

The harmless low-interval contribution to m_{n+1} is included in the error. Meanwhile m_n>=c_H(H+1)^(2n), by integrating the positive w over [H+1,H+2]. Divide by n m_n and take limsup to obtain <=1/K. Since K is arbitrary, the first limit follows; (6) at v=0 gives the second. All moments are positive, so the argument also gives the stated eventual strict sign. QED.

Meaning: at high n, (6) subtracts almost the whole naive lower-level positive contribution at the origin. A successful proof cannot simply discard the defect as sign-favorable. This is an obstruction to that particular induction tactic, not to RH and not to every adaptive reference or matrix-valued scheme.

## 5. Explicit checked lower-level propagation failure

Csordas, Example 3.12, uses the smooth even positive log-concave profile phi(u)=exp(−u²)(15+u²+u⁴); it is Gaussian-decaying, not a modular theta profile. Its first associated kernel is PD but its second is not. Source: https://arxiv.org/pdf/1309.0055 . This example does not satisfy that paper's stronger super-Gaussian admissibility condition.

Here is a fresh exact algebra verification, including an explicit sum-of-squares certificate. Ignore a positive Fourier normalization constant and set

    F(x)=exp(−x²/4)(x⁴−16x²+260).

Direct differentiation gives

    2 exp(x²/2)L_1[F](x)
      =y⁴−24y³+712y²−13536y+84240
      =y²(y−12)²+568(y−846/71)²+255312/71 >0, y=x².

But

    exp(x²/2)L_2[F](x)=x⁸/8−2x⁶+87x⁴−2312x²+13386,
    L_2[F](4)=−1334 exp(−8)<0.

Thus full first-level PD and smooth positive log-concave input do not propagate through (1) or (6). These displayed formulas are verified by the original local symbolic script `check_hierarchy.py`; no downloaded code was executed. The example and Gaussian-polynomial idea are not new; the rational SOS certificate and explicit x=4 witness are convenient audit details.

## 6. Deliverable boundary and most useful next target

Established here: exact identities (1)–(6), complete-theta forcing asymptotic (7), high-order obstruction (8), and an exact counterexample check. Not established: positivity of M_1 for the complete theta profile, any all-order propagation estimate, or the required PD of C_a for 0<a<1/2.

A genuinely stronger next theorem would bound the Fourier transform of the full forcing R_{n,kappa} relative to (2n+1)M_n, uniformly in n and frequency, with all theta derivatives retained. Merely proving endpoint cancellations, theta heat evolution, profile log-concavity, or low-order positivity does not supply that bound. An order-dependent reference may reduce the defect but has not been shown PD-preserving.

## 7. Order-adaptive moment matching: exact two-node deficit

Continuation requested by parent. Set m_n=M_n(0)>0 and choose the natural order-adaptive coefficient

    kappa_n=(2n+1)m_n/(2m_{n+1}).

Then R_{n,kappa_n}(0)=0. With f_n(v)=M_n(v)/m_n, equation (6) becomes

    R_{n,kappa_n}(v)=(2n+1)m_n[f_n(v)−f_{n+1}(v)].            (9)

This fixes the diagonal mismatch, but cannot turn the forcing into a favorable PD kernel. Here is a theta-specific proof, not merely a generic warning.

### Fixed-order spatial-tail theorem

For every fixed nonnegative integer n, as v→+infinity,

    M_n(v) ~ A_n exp((8−2n)v−2pi exp(2v)),
    A_n=32pi⁴ Gamma(n+1/2)(4pi)^(−n−1/2).                   (10)

Consequently,

    M_{n+1}(v)/M_n(v) ~ (2n+1)exp(−2v)/(8pi).               (11)

Proof: psi(u)~8pi²exp(9u/2−pi exp(2u)) as u→+infinity. In the integral set h=exp(−v)s. Then

    P(h,v)/(64pi⁴exp(9v−2pi exp(2v)))→exp(−4pi s²).

There is a global bound psi(u)<=C exp(9|u|/2−pi exp(2|u|)), obtained from the positive theta series on u>=0 and evenness. For h<=v, cosh(2h)>=1+2h² yields domination by C s^(2n)exp(−4pi s²) after normalization. For h>=v, put h=v+x and bound the unnormalized integral by

    C exp(9v) integral_0^infinity (v+x)^(2n)exp(9x−pi exp(4v+2x))dx.

This is negligible relative to the scale in (10). The Gaussian half-moment is Gamma(n+1/2)/(2(4pi)^(n+1/2)), proving (10). Equation (11) follows by division. This proof and constants were independently audited by the foundations lane.

Since m_{n+1}/m_n>0 while (11) tends to zero, f_n and f_{n+1} are not identical. More precisely,

    R_{n,kappa_n}(v)/[(2n+1)M_n(v)]
      =1−(m_n/m_{n+1}) M_{n+1}(v)/M_n(v)
      =1−[(2n+1)m_n/(8pi m_{n+1})]exp(−2v)(1+o(1)).         (12)

The forcing is strictly positive for all sufficiently large v, despite its zero at the origin. At nodes {0,v}, its exact Gram matrix is

    [[0,R(v)],[R(v),0]],

with eigenvalues ±|R(v)|. Thus neither R nor −R is PD. The unavoidable negative eigenvalue has magnitude

    (2n+1)m_n |f_n(v)−f_{n+1}(v)|,

and asymptotically (2n+1)A_n exp((8−2n)v−2pi exp(2v)). This is a quantified deficit for the moment-matched correction; it is not a negative witness for M_n or C_a themselves.

This rules out the entire tactic of using the moment-matched scalar Gaussian reference and declaring its residual favorable in Loewner order. It leaves open a genuinely relative bound on the coupled full kernels.

## 8. Failed-routes ledger

1. **Universal derivative recurrence closes on L_n alone:** false; it also contains L_n[f'] and a sign-indefinite curvature term.
2. **Gaussian multiplier supplies a positive diffusion:** false as stated; the frequency evolution has the backward heat sign and its kernel recurrence includes −v²M_n.
3. **Theta heat equation closes the h-moment hierarchy:** not obtained; extra auxiliary theta derivatives remain. No claim of impossibility for a more sophisticated enlargement.
4. **Fixed Gaussian reference has favorable forcing at all n:** ruled out by (8).
5. **Order-adaptive moment matching repairs the forcing sign:** ruled out by (9)–(12), with exact two-node eigenvalue deficit.
6. **Profile positivity/log-concavity and first-level PD propagate:** false for the explicit Gaussian-polynomial counterexample; this is not a counterexample to a theorem using the full modular identities.

## 9. NonGaussian ratio propagation: validated negative result

A natural multiplicative alternative is to set

    g_n(v)=M_{n+1}(v)/M_n(v),

which is well-defined because M_n(v)>0 pointwise. If every g_n were PD, then the Schur product theorem would propagate M_n PD from the unconditional autocorrelation M_0. This attractive sufficient condition uses the full theta profile rather than a Gaussian reference.

**It is false for the complete theta profile.** At n=4, take nodes j/8, j=0,...,11 and integer coefficients

    c=(91,-308,347,39,-445,277,277,-445,39,347,-308,91).

A validated interval integration with explicit theta-index and h-integration tails gives

    -48.494670 < sum_{j,k}c_j c_k g_4((j-k)/8) < -48.473700.

See `ratio_certificate_notes.md` for the analytic tail proofs, exact derivative polynomials, Simpson remainder formula, and independently reconstructed higher-precision interval. Code: `certify_ratio.py`; data: `ratio_intervals.json`. All code is original local code using already installed mpmath, with no downloaded-code execution. Foundations independently reviewed the method and reconstructed the final interval.

This is a computer-assisted counterexample to a proposed *stronger sufficient condition*. It is not a negative witness for M_4, M_5, C_a or RH. Ratios of PD functions need not be PD; therefore even if RH is true, this failure is logically consistent.

The exploratory scripts `test_ratio.py` and `ratio_n*.npz` suggested the witness; they are not the certificate. The archived `certify_ratio_midpoint.py` is an abandoned slower implementation and was not used for the final result. Use the Simpson script and its documented complete tails for reproducibility.

### Ledger addition

7. **Full-theta ratio multiplier g_n=M_{n+1}/M_n is PD at each n:** disproved at n=4 by the validated twelve-node witness above. This closes the tested nonGaussian multiplicative route without making any claim about other modular-preserving operators or coupled matrix-valued recurrences.
