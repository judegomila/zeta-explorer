# Independent audit: narrow-lobe sector in the true physical complement

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

Producer: `gamma_complement_attack/EXACT_PHYSICAL_ADJOINT_AND_NARROW_RESIDUE_SAFE_SECTOR.md`.
SHA256: `0328e708b96e38eba3d843b4a2f269c7ce2c899731952ed6b9ca97f9cac0ea23`.

## Accepted result and exact scope

For X=2N, lambda=sqrt(2N), the source constructs a K-dimensional complex even physical space W_N, with

    K ~ sqrt(N)/(16pi log^2 N),
    H[w] >= (1/2)log(N)||w||^2  for every w in W_N.

If P is the physical L2 projection onto the accepted critical-power-four positive signed mean-zero actual-E head and Q=I-P, then Q is injective on W_N and

    dim(QW_N)=K,
    H[v] >= (1/4)log(N)||v||^2  for every v in QW_N.

This is a positive sector of the **actual physical head complement**, not the gamma-transformed complement or an unprojected trial space. It rejects this particular narrow-lobe/carrier candidate as a negative direction. It neither covers all complement vectors nor improves a global negative-magnitude bound. In particular no size, completeness, or near-isometry of Q on W_N is asserted or needed.

## 1. Physical adjoint and finite inverse

Changing variables y=n exp(x) in the literal finite raw-E pairing gives the positive-half-line density `y^(-1/2) sum n^(-1/2) f(log(y/n))`. The full additive-even L2 pairing counts both signs of y, hence its adjoint is exactly half that density. Evenization of the physical output drops out against even f. This verifies equation (1), including the cutoff n<=lambda|y| and its zero region |y|<lambda^(-1).

Inside ran(Pi_a), the orthogonal annihilator of the mean-zero subspace is span(Pi_a 1). Thus equation (2) is the correct physical orthogonality relation, with no inserted T. It also remains valid if that spanning vector vanishes.

For the inverse, compose the raw translation adjoint with weights mu(d)/sqrt(d). The inner divisor sum is sum_(d|m)mu(d), so only m=1 survives. Substituting `T_ar^*f(x)=2exp(x/2)A_f(exp x)` supplies an additional d^(-1/2), giving exactly mu(d)/d in equation (3). All sums are finite, and the cutoff d<=lambda exp(x) is forced by the lower physical boundary. These identities hold almost everywhere for L2 data; no point-evaluation regularity is required. They do not give an unproved sign on the unselected source components.

## 2. Support, modulation, normalization, and gamma

The two supports centered at +/-b, b=(log N)/2, have a fixed eventual margin inside +/-ell because ell-b=(log 2)/2 while h tends to zero. They are disjoint. The negative lobe is the reflection of the positive one, not its conjugate: equation (4) is even for arbitrary complex g and preserves ||w_g||=||g||.

For the first K Dirichlet modes on [-h,h], their derivative Gram is diagonal, so the bound `||g'||<=pi K/(2h)||g||<=N||g||/32` holds for every linear combination. The zero boundary values ensure that zero extension belongs to H1(R); derivative jumps at the endpoints do not create delta terms in the first weak derivative.

For the positive lobe, its angular Fourier mass on |t|<N/2 is at most `4N^(-2)||g'||^2` before the 1/sqrt(2) normalization; the reflected lobe has the same estimate. Pointwise `|a+b|^2<=2|a|^2+2|b|^2` gives the stated total `8N^(-2)||g'||^2<=||w||^2/128`. This estimate does not assume that the two Fourier lobes are disjoint. Splitting the accepted gamma multiplier at N/2, using its global finite lower bound and logarithmic lower bound above N/2, proves equation (6) with a constant independent of K and g.

## 3. Actual arithmetic and continuum estimates

Since 2h<log 2, no nonzero prime-power shift has a same-lobe overlap. A positive cross shift can overlap only the two opposite lobes and only if |log(n/N)|<=2h. Each such correlation has modulus at most ||w||^2/2; the two signed translations in the prime operator contribute the compensating factor 2. Thus the coefficient sum in equation (7), with no omitted factor, is valid even when the prime quadratic form is positive.

There are at most `C N h+1` integers in the indicated interval. On it, Lambda(n)<=log n<=C log N and n^(-1/2)<=C N^(-1/2). Therefore the actual atomic sum is at most

    C log N (sqrt(N) h+N^(-1/2)) <= C/log N.

The entire interval lies below X=2N eventually. Endpoint inclusion is harmless. No prime distribution theorem, average, or cancellation is hidden here.

On the even space, `exp(|x-y|/2)=2cosh((x-y)/2)-exp(-|x-y|/2)` leaves the positive rank-one cosh term; the sinh term annihilates even functions. The decaying convolution has Fourier multiplier `1/(t^2+1/4)`, between 0 and 4. Hence the continuum is bounded below by -4I. Evenness is essential to this particular lower bound. Together these estimates prove equation (8) uniformly throughout W_N, after one sufficiently large N threshold.

## 4. Actual operator domain and exact physical projection

The zero-extended vectors w belong to H1(R); multiplication of their Fourier transforms by the logarithmically growing gamma symbol is in L2. Thus they lie in the supported gamma operator domain, not merely in its quadratic-form domain. The prime and continuum terms are bounded at fixed support. Every vector of the finite actual head is also in Dom(H) by the accepted action theorem, so Pw and Qw remain in Dom(H).

The bound `||HP||<=eta` applies to this exact physical projection. Selfadjointness gives

    H[Qw]=H[w]-2Re<HPw,w>+H[Pw]
          >=H[w]-3eta||w||^2.

The estimate uses the actual action residual, not only an energy compression or coordinate Gram. Since eta=O((1+ell)^(-2)), equations (8),(9) follow eventually. If Qw=0 the resulting strictly positive lower bound times ||w||^2 forces w=0. This proves injectivity; since ||Qw||<=||w||, it also proves the advertised lower bound in the physical norm of the projected vector.

Projection destroys the literal narrow support, but that causes no gap: the support-based prime estimate was made only on w, and the entire later change is paid by the actual H-action bound. No prime estimate is separately transferred through a small L2 approximation.

## Dependencies and limits

The inherited conventions were checked against `EXACT_COMPLEMENT_AND_NESTED_FRAME_CROWDING.md` (SHA256 `52aee3c3d81d743f86c3b86ac3a25d93b6c87aa7742b0ba9551f4feba08cf236`). The critical actual-action source remains SHA256 `44599cd2bc804f2387d009506f70ac957ad4643ff45017b00ce9862dc4cf00a1`. This review accepts those already reviewed multiplier/domain/head-action inputs and independently checks the new construction, all its constants, and its projection argument.

Nothing here identifies the finite-R_N endpoint residual asymptotically with this model space. Broad lobes, long prime-jump networks and envelopes outside the displayed derivative budget remain uncontrolled. No full physical-complement floor, gamma-relative complement gap, support endpoint extension, or RH conclusion is established.
