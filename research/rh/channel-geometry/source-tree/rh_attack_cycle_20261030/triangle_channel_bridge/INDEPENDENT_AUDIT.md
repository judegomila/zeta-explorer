# Independent audit: triangle geometry versus channel positivity

30 October 2026. Reviewer: `independent-internal-review`.

**PASS with the scope below.** This independently verifies the identities, synthetic counterexamples, and final mathematical producer note, not an all-channel arithmetic inequality.

Approved `TRIANGLE_TO_SIGNED_CHANNEL_TEST.md` SHA256:
`6082ff03c245e38b7a6a51c049d3e7070d19759b3d19247bec710a69ef8bbb8e`.

The exact-check script was reviewed and independently replayed in a disposable local copy. Its output matched the producer receipt byte for byte.

- Script SHA256: `9cd2e63cc638351c745c4db6d5f1da568f1caccfbd1c4fe559fb2c97f213e576`.
- Exact output SHA256: `71e82d81f1f166327657f1ed472eaa718890833ef6129462b918aa49bcc1b425`.
- SymPy version: `1.14.0`.

The replay checks symbolic identities and synthetic examples only; it is not an actual-prime spectral certificate.

## 1. Polarized curvature identity

For compact-support form vectors, write `R_fg(r)=integral conjugate(f(x))g(x+r)dx`, use the canonical even extension `D_e(r)=D(|r|)`, and take the doubled cylinder `[-W,W] x S1`. Then

    q(f,g)=A(f,g)-(1/(2pi)) integral R_fg(r) K dA.

The coefficient is correct: angular integration supplies `2pi`, and the two radial halves give the Hermitian signed shift pairing. There is no extra `Re` on a complex polarized entry. This uses the actual physical L2 norm and actual zero extension, not surface L2 or periodic correlation. Here `D'(0+)=0` avoids an extra origin atom.

Gauss--Bonnet controls an unweighted regional curvature integral plus boundary terms. It does not control these arbitrary cross-correlation weights or identify their phases with surface parallel transport.

## 2. The exact even-box test

For unnormalized `b_a=1_{[-a,a]}`, the proposed identity is correct:

    q(b_a,b_b)=2[Psi(a+b)-Psi(|a-b|)],
    q(b_a,b_a)=2Psi(2a).

A derivation that avoids singular-origin mistakes uses

    G_Psi(t,u)=Psi(t)+Psi(u)-Psi(t-u),
    q(f,g)=integral integral G_Psi(t,u) conjugate(f'(t)) g'(u) du dt.

The latter is the unconditional relation between the screw-kernel form and Weil form; see Suzuki, *The screw line of the Riemann zeta-function and its applications*, [equation (1.10)](https://arxiv.org/pdf/2209.04658). Approximate each box by smooth form-core functions. Its derivative converges to `delta_{-a}-delta_a`, so continuity of `G_Psi` makes the limit a four-corner difference, giving the formula. Boxes belong to the fixed-support logarithmic form domain; no global closed realization is needed.

The equivalent distribution calculation is also sound provided the archimedean cancellation is preserved. For `T_alpha(r)=(1-exp(-alpha|r|))/alpha^2`,

    T_alpha''=(2/alpha)delta_0-exp(-alpha|r|),

whose convolution multiplier is `2t^2/[alpha(alpha^2+t^2)]`. Sum these paired terms before passing to the limit. `Psi_even''` is the actual signed convolution distribution, **not** an ordinary finite curvature measure at the origin.

Consequently the two-box matrix is positive semidefinite precisely when its diagonals are nonnegative and

    [Psi(a+b)-Psi(|a-b|)]^2 <= Psi(2a)Psi(2b).

This is a useful exact necessary test, not a new bound proving it. For a generic scalar function, pointwise nonnegativity does not suffice: the synthetic choice `F(t)=t^4` gives, at radii `1,2`, the signed matrix `[[32,160],[160,512]]`, determinant `-9216`. This is NOT a counterexample to the actual arithmetic Suzuki criterion: global nonnegativity of that particular function has additional RH-equivalent content.

## 3. Three-channel phases

Let a Hermitian signed energy matrix have strictly positive diagonal, and normalize by its diagonal: `z_ij=H_ij/sqrt(H_ii H_jj)`. This is congruence normalization, not an assertion that H is already a Gram matrix. Define `r_ij=|z_ij|` and, when the product is nonzero, `Phi=arg(z_12 z_23 z_31)`. Its three-channel block is positive semidefinite exactly when all `r_ij<=1` and

    1-r_12^2-r_23^2-r_31^2
      +2r_12 r_23 r_31 cos(Phi) >= 0.

This follows by checking all principal minors; symbolic expansion independently reproduced it. If a product vanishes, use `2 Re(z_12 z_23 z_31)` instead of assigning an undefined angle. If a diagonal is zero, positivity requires its entire row and column to vanish; the above normalization cannot be used.

The gauge-invariant product phase is mathematically analogous to loop phase. No identity with the Gauss--Bonnet curvature flux of the arithmetic cylinder has been constructed. In particular, normalized entries of a signed indefinite form cannot be declared inner products of unit vectors to import Hilbert-space angle inequalities.

## 4. Every triple can pass while the exact omitted-space Schur test fails

Take the four-channel synthetic matrix

    H=(7/5)I-(2/5)J.

Its diagonal is one and each off-diagonal entry is `-2/5`. Every principal triple has eigenvalues `7/5,7/5,1/5`, all strictly positive. The full matrix has eigenvalues `7/5,7/5,7/5,-1/5` and determinant `-343/625`.

With `D` any principal triple, `E=1` and `B=(-2/5)(1,1,1)^T`, one has

    B* D^(-1) B=12/5,
    E-B*D^(-1)B=-7/5.

Thus even passing every exact three-channel determinant cannot supply the current all-omitted-direction Schur inequality. All these values were independently checked with exact rational/symbolic arithmetic. The matrix is a counterexample only to a generic triangle-only inference, not a negative actual Weil direction.

## Conclusion

The bridge produces valid polarized identities and falsifiable small-block tests. It supplies no new estimate for neighboring/exceptional arithmetic carriers and does not upgrade the accepted sparse separated-channel theorem. The remaining obligation is still the full actual signed Schur form, with physical Gram, true-head correction, and—in infinite dimension—valid domains and coupling bounds.
