# Independent audit: bandlimited zeta packets and the strong 4M gate

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

Producer: `gamma_complement_attack/BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md`.
SHA256: `b1196415a51cd8e4eeb3308837eae34a5b9ad68fe6b84e59ca08b5ec31a7dce9`.

## Accepted result and exact boundary

For every fixed M>0 and 1/2<theta<1, along X=lambda^2=2N,

    E_lambda >= c_(M,theta,phi) N^(theta-1/2) log N.

Thus the proposed strong 4M uniform high-cell cap, and the weaker proposed `E_lambda=O_M(log lambda)` aggregate bound at `T0=pi X/log lambda`, are false along this sequence. The previously proved conditional rank/cap lemmas remain valid. Their arithmetic hypotheses, rather than their logic, have been disproved.

The construction has average m-energy M+o(1), not energy below the earlier small positive s. It therefore does **not** refute the small-s gate, furnish a negative Weil vector, determine the correct physical complement, or prove/disprove RH.

## 1. Physical geometry and evenness

A fixed real even Schwartz phi with angular Fourier support [-1,1] and L2 norm 1 exists by taking a smooth compactly supported inverse-frequency bump. Multiplication by phi((t-N)/W) broadens physical support by only 1/W. The modulated Dirichlet polynomial has frequencies between -log(N)/2 and log(N)/2. Its reflected sum is even and has inverse support inside

    [-log(N)/2-1/W, log(N)/2+1/W].

For X=2N this lies strictly inside the actual interval [-log(X)/2,log(X)/2]. This is an actual physical test, not a formal identification of coefficient ell2 with physical L2. Its inverse transform is smooth and compactly supported, so there is no supported operator-domain problem.

## 2. Long truncation and its derivative are valid

The cutoff N exceeds |t|/(2pi) by a fixed margin on [N/2,2N]. Euler summation at y=N+1/2 gives the pole term O(N^-sigma) and a sawtooth remainder. After Abel regularization, each nonzero Fourier mode has phase derivative `2pi k+t/u` (with the corresponding negative k). Its modulus is at least c|k| for u>=y because |t|/y<=2+o(1)<2pi.

Integration by parts gives boundary/derivative terms O(y^(-sigma-1)/|k|); differentiating the reciprocal phase adds O(|t| y^(-sigma-2)/k^2), which is no larger. The sawtooth coefficient contributes another 1/|k|, so the summed bound is absolutely convergent. Dominated convergence removes the Abel regulator. Multiplication by |s|=O(N) leaves O(N^-sigma).

The error is analytic and uniformly O(N^-1/2) on the radius 1/log N disc around each relevant s. Cauchy's estimate therefore gives the stated O(N^-1/2 log N) derivative error. This avoids the invalid use of a two-sum approximate functional equation when its dual length is below 1.

## 3. Norm and global supremum: primary inputs checked

The classical second-moment formula with remainder O(sqrt(U) log U) is explicitly recorded in [Simonic--Starichkova, equations (1),(2)](https://arxiv.org/pdf/2105.06821v3), attributing the bound to Ingham. Integrating its remainder against the scaled envelope derivative costs O(sqrt(N) log N/W). For fixed theta>1/2 this tends to zero. The main term gives `W(log N+O(1))` per packet; the truncation error and opposite-packet overlap are negligible.

The balanced approximate functional equation in [DLMF 25.9.3](https://dlmf.nist.gov/25.9.E3), together with |chi|=1 on the critical line, gives |zeta(1/2+it)|=O(t^1/4) by absolute summation. Hence the packet's squared supremum is O(sqrt N) on its main regions. Outside them, the crude |R_N|<=2sqrt N is multiplied by an arbitrarily high fixed Schwartz decay power, giving the same global bound. No Lindelof, RH, or unproved short-interval moment estimate is used.

## 4. The critical finite-height off-diagonal tail is genuinely small

X>=N is essential and holds because X=2N. For output m<=N, the full divisor sum gives exactly `b_m=(log m)/sqrt m`; for every output, positivity gives `b_m<=(log m)/sqrt m`.

The Fourier support of h=phi^2 is [-2,2]. Thus an m>N output can pair with n<=N only if |log(m/n)|<=2/W. This confines both indices to the cutoff boundary and gives separation j=m-n<=C N/W. At fixed j there are at most j crossing pairs. Each product coefficient is O(log N/N). Summing these pairs gives

    O((log N/N) sum_{j<=CN/W} j) = O(N log N/W^2)=o(1)

after division by W. There is no hidden factor from the full product length XN: farther outputs vanish exactly under this envelope.

For the derivative product replacement, the weighted finite Gram matrix has O(1+N/W) possible entries per row, each bounded by 1. This proves the displayed D_N second-moment upper bound. Cauchy--Schwarz with the uniform Euler errors yields O(log^(3/2)N/sqrt W + log^(3/2)N/sqrt N), which tends to zero. A derivative zeta moment theorem is not assumed.

## 5. Gamma normalization and tails

Differentiating the exact functional equation and multiplying by conjugate zeta, without dividing by zeta, gives

    2 Re(-zeta'(1/2-it) conjugate zeta(1/2-it))
      = [Re psi(1/4+it/2)-log pi] |zeta(1/2-it)|^2.

This holds at zeros too. The [digamma recurrence](https://dlmf.nist.gov/5.5.E2) gives the exact correction

    a_5/4(t)-a_1/4(t)=4/(1+4t^2),

with positive sign. The actual continuum is O(N^-1/2) on the packet and is retained, not confused with this rational correction. These facts give the claimed o(1) normalized-by-W discrepancy between prime-minus-continuum and gamma.

All localization estimates can be made with a **fixed** Schwartz exponent depending on theta. For example, the low-band crude integral is at most `C_J N^(5/2-2J(1-theta))`; choose `2J(1-theta)>5/2-theta` to make it o(W log N). The same inequality handles the prime-size outer tails after division by W. Cross-packet integrals decay faster than every fixed power of N/W. Logarithmic gamma growth is harmless. No assertion of compact time support is made.

Since delta log N tends to zero, the full even packet consequently satisfies

    integral m|F|^2=(M+o(1))||F||^2,
    integral_{|t|<=T0} v|F|^2=o(||F||^2),
    ||F||^2=2W(log N+O(1)),   ||F||_infinity^2=O(sqrt N).

## 6. Final positive-mass implication

The pointwise inequality `[4M-m]_+>=4M-m` gives high-tail expectation at least `(3M-o(1))||F||^2`. The exact fixed-grid cap decomposition has `integral g|F|^2<=M||F||^2/4`, because F has the correct physical support. Thus

    integral e|F|^2 >= (11M/4-o(1))||F||^2.

Since `integral e=E_lambda`, division by the proved global squared supremum yields the announced power-times-log lower bound. Grid symmetry, evenness, the natural cutoff and the inclusive arithmetic endpoint match the target exactly.

This audit supersedes only the prior status that these particular strong-4M arithmetic hypotheses were unresolved; it does not alter any accepted conditional rank theorem or the whole-even support endpoint.
