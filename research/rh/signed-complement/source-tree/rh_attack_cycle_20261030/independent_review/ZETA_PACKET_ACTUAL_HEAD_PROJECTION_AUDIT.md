# Independent audit: zeta packet projection onto the actual positive-E head

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

Producer: `gamma_complement_attack/ZETA_PACKET_TO_ACTUAL_POSITIVE_HEAD_PROJECTION.md`.
SHA256: `eefbfb43b9cd1cdc45cc7b221f84fbec6e4ac7c10326701f31ac60d0e26ea026`.

## Accepted conclusion

For the exact single-packet f_N, X=2N, W=N^theta with fixed 1/2<theta<1, and the accepted signed positive, mean-zero, critical cutoff `a_lambda=lambda^-4(1+log lambda)^-7`,

    ||(I-P_head)f_N|| <= C sqrt(W/N),
    ||(I-P_head)f_N||/||f_N|| <= C/sqrt(N log N).

P_head is the orthogonal PHYSICAL L2 projection onto the actual finite arithmetic image of that head. No unsigned concentration space, gamma-metric projection, or new support endpoint is substituted.

## 1. Moving source and Fourier-tail calculation

The inverse angular transform of A_N is exactly

    p_N(x)=W exp(iN(x-log(N)/2)) k(W(x-log(N)/2)).

The change of variables u=sqrt(N)exp(z/W) in the additive Fourier integral gives amplitude `N^(1/4) exp(z/(2W))k(z)` and the two displayed phases. For |y|>=lambda=sqrt(2N), their first derivatives have modulus at least

    c (N/W)(1+|y|/sqrt N).

Indeed the Fourier contribution is at least 2pi sqrt(2) times the carrier contribution before their possible subtraction. Higher derivative ratios are uniformly bounded, with extra inverse powers of W. Repeated integration by parts in z therefore gives the claimed tail, including the moving-envelope derivatives. Integrating that pointwise bound gives arbitrary power savings in both L1 and L2 because N/W=N^(1-theta) is a fixed positive power.

At y=0 the same argument gives the superpolynomially small mean. Subtracting nu_N times a fixed smooth even bump away from zero makes the mean EXACTLY zero, preserves zero origin and compact interior support, and retains every Fourier-tail power saving. This exact repair is essential, not optional merely because nu_N is tiny.

## 2. Signed cutoff and mean repair inside the head

On additive even L2 the 2pi-normalized Fourier transform is a selfadjoint unitary involution. Thus `(I-C^2)v=P F Q F v`, so its norm is controlled by the actual exterior Fourier tail. The positive symmetrization `(I+C)v/2` removes the negative near-unit phase.

For excluded positive eigenvalues, `1-chi>=a_lambda/2`; for negative eigenvalues the ratio used in the source is at most 1/2. This proves the excluded symmetrized mass is bounded by `a_lambda^-1||(I-C^2)v||`. The inverse cutoff grows only like N^2 log^7 N, so the loss is still superpolynomial. No fixed-order deficit estimate is being stretched beyond its quantifiers.

The exact mean of the symmetrization is minus one half of the omitted Fourier-tail integral, since v(0)=0. Projection changes it by at most sqrt(2lambda) times the projection error.

The lower bound for ||Pi_a 1|| is independently valid: the truncated self-Fourier Gaussian has C-eigenvalue defect at most its exponentially small omitted tail. Excluded spectrum is separated from 1 by at least a_lambda/2. Its selected projection consequently has integral tending to 1, and Cauchy--Schwarz gives a uniform positive lower bound for ||Pi_a 1||. The displayed final mean correction therefore remains inside the EXACT selected positive head and costs only a superpolynomial norm error. No prolate ground-state asymptotic or unproved mean-direction conditioning is assumed.

## 3. Actual arithmetic map and Fourier truncation

Each literal n-th sample has norm at most n^-1/2 from additive positive-half L2 to physical log L2. Summing n<=lambda^2 gives the sufficient O(lambda) map norm. Hence small source errors genuinely remain small in the actual output space; the proof does not invert a coordinate Gram to infer this.

The exact Poisson reflection identity applies to the repaired v because both v(0) and its integral vanish. It follows directly by separating the zero terms in full Poisson summation. Replacing the full Fourier transform by C v is not free, but the omitted arithmetic sum is uniformly bounded by

    C_B N^-B lambda exp(-x/2) <= C_B N^-B lambda^(3/2)

on |x|<=ell. This follows by summing the displayed cubic Fourier-tail envelope. Integrating adds only sqrt(2ell), still superpolynomial. Thus the actual E image of the selected, mean-repaired g approximates the finite-window E image of v as claimed.

## 4. The dangerous extra-label shell is paid, not dropped

The source centered at sqrt N does have visible labels beyond N, up to approximately sqrt(2)N. A termwise identification of its physical E image with the R_N packet would be false. This was a specific adversarial check.

The producer instead uses the FULL-LINE identity only for the mean-corrected source v. Write `V(z)=integral_0^infinity v(u)u^(z-1)du`. For Re z>1, direct absolute summation gives the Mellin transform `zeta(z)V(z)`. Since V(1)=0, the zeta pole is removable. Poisson and the zero origin give rapid decay of the full logarithmic image at its unbounded end; the Mellin identity therefore continues to the critical line. With the unitary angular normalization it is precisely

    Fourier(E_raw v)=zeta(1/2-it)(A_N-nu_N A_h).

Both sides here are L2. The uncorrected E image of v_N generally is NOT L2, despite its tiny mean. The proof never separates it and E h as unregularized L2 vectors. It only separates the already legitimate zeta-multiplied transforms; `zeta A_h` has finite fixed L2 norm by polynomial zeta growth and Schwartz decay.

The previously audited uniform estimate `zeta(1/2-it)-R_N(t)=O(N^-1/2)` on [N/2,2N] therefore gives squared full-line packet error O(W/N). Schwartz tails handle the rest using unconditional polynomial zeta growth. This comparison includes every extra label and all full-line exterior tails through exact Mellin/Poisson cancellation. Only AFTER this global L2 comparison is the E image restricted to the physical window. Because f_N is already supported there, restriction cannot increase the error. The factor 2 exactly compensates E_even's factor 1/2.

This establishes an explicit approximant `h_N=2 E_even g` in the accepted head. Best approximation by P_head proves the stated bounds.

## 5. What the projection licenses, and what it does not

The theorem concerns unweighted physical L2 only. It does not imply small H_lambda action of the difference, small gamma-weighted distance, or a sign for the difference after normalizing it. The producer explicitly preserves those limitations; there is no invalid transfer through an unbounded operator.

One additional bounded-symbol consequence is legal: the actual clipped v_high has supremum O_M(sqrt N). The relative L2 error is O((N log N)^-1/2), so replacing f_N by h_N changes its v_high quadratic charge by at most O_M((log N)^-1/2)||f_N||^2. Thus the already proved large strong-4M clipped charge is indeed carried, up to a vanishing relative error, by the retained head. This uses a bounded multiplier, not gamma or H. The normalized orthogonal remainder can still have unknown sign and action.

No global lower floor, general dangerous-space angle theorem, small-s-gate resolution, support-endpoint change, or RH conclusion follows. No numerical scan, upload or publication was performed.
