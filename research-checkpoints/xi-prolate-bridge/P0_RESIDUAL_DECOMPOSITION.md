# P0 residual decomposition

For any eventually implemented normalized projected prolate vector `kappa`,
the combined vector must be formed before norms:

`q=q_pole-q_arch-q_prime`,

`(Q-q)kappa = (P-q_pole I)kappa - (A-q_arch I)kappa
              - (R-q_prime I)kappa`.

The diagnostic serializes this combined vector and the three signed block
vectors, followed by their separate norms and the combined norm. No triangle
inequality is applied in the producer.

The checkpoint-0.51 normal form supplies a second exact combined
decomposition.  With `H_lambda=A_tail-T_D`, the scalar `c_*I` cancels from
the Rayleigh residual:

`(Q-<kappa,Q*kappa>)kappa =
 (H_lambda-<kappa,H_lambda*kappa>)kappa`.

Here `T_D` retains the signed weighted-PNT discrepancy before any absolute
value.  The 80/160-decimal artifacts serialize the atom, continuous-main,
tail, scalar, original source, and combined residual matrices.  Their much
larger separate norms are reported alongside the combined residual so that
the loss from a blockwise triangle inequality remains visible.  This exact
rewrite does not bound the residual, the complementary gap, or their ratio.

Checkpoint 0.52 exposes the cancellation acting on the actual finite even
ground `x` as a signed boundary convolution.  With `X=integral x`,
`h=integral cosh(y/2)x(y)dy`, and `F=D-H_0`, the combined quantity is formed
before taking absolute values:

`C_lambda(x)=2*X^(-1)*integral_0^L F(t)x(a-t)dt`,

`C_lambda(x)+epsilon-c_*=-4*h/(sqrt(lambda)*X)`.

The artifacts report the direct combined `F` integral, the separate `D` and
`H_0` integrals, and their signed decomposition residual.  The verifier
reconstructs the combined value through atom tails and a Fubini interchange.
The exact cancellation identifies the needed one-sided
`O(lambda^(-1/2))` window; it does not prove that window on an unbounded
schedule or supply either complementary sector floor.

## Doubled-precision pilot `(lambda,N)=(2,2)`

The 80-decimal run uses a 40-function even Legendre prolate basis. Its
independent replay reconstructs all displayed quantities to better than
`5e-78` for the prolate eigenvalues and `3e-80` for matrix blocks. These are
arbitrary-precision diagnostics; the finite Weil matrix alone also has
independent 256/512-bit Arb enclosures.

`q = 0.000057724007273742398854660973589250212740180532459440021295976634452030335710336871`

`r = 0.0038211729753797797912429503334799570544642702749492655371267991748724169383361639`

`Delta = 0.0000069535537956018697457601787214065055188016105340257241232699456026260569591691097`

`r/Delta = 549.52806689964429524198121740988139981793492166134902222942054877045317177781854`

The inversion-sector residual--Ritz theorem in `DIRECT_RH_ATTACK.md` keeps the
lower Ritz shift instead of measuring every floor from `q`.  For this same
pilot the 80-decimal values are

`alpha_even = 0.001577765323176070848555712778874293774219010326396900387305972855072589833737882`,

`u_2D = 0.000020203951460573898560406455992704794693072874032743520890493553110605070292188736`,

`Gamma = alpha_even-u_2D =
0.001557561371715496949995306322881588979525937452364156866415479301961984763445693`,

`r/Gamma = 2.4533049193247150734952553339481835629425151366561542854847120370495805391139272`,

`omega_odd-u_2D =
0.000044473609608770370040014696317951923565909268960722224528753026944051322377317474`.

Thus the finite sector comparisons are positive in this pilot, and the
standalone replay reconstructs them at 80 decimals.  The scalar ratio improves
by a factor of about 224 over the old `r/Delta`, but it still discards where the
residual lies in the complementary spectrum.

The weighted theorem keeps that information.  With `A` the even-complement
compression and `b=(Q-q)kappa`, the producer obtains

`tau=||(A-u_2D I)^(-1)b|| =
0.11268283136512141921589099975930847899250911777562275669466675690992574291930271`,

and hence the phase-aligned chordal bound

`D(tau)=sqrt(2-2/sqrt(1+tau^2)) =
0.11215064656145460049665069165580921455585601777917797702672048404452820961353303`.

The full progression is therefore

`r/Delta -> r/Gamma -> tau -> D(tau)`

`549.528066899644295... ->`

`2.45330491932471507... ->`

`0.112682831365121419... ->`

`0.112150646561454600...`.

The producer computes `tau` by spectral decomposition of `A`; the independent
replay reconstructs the state and matrix and computes it by a direct LU solve.
At 80 decimals the replay defects are about `7.48e-79` for `tau` and
`7.39e-79` for `D(tau)`, against a replay tolerance of `1e-40`.  Both paths
share `mpmath`, so this is independent assembly and linear-algebra routing,
not arithmetic-library independence.  The weighted values remain unenclosed
point diagnostics, not interval certificates or unbounded-sequence estimates.

The corrected projection error is

`e_(2,2) = 0.00089717776118654392935098972025151256120613413434176551259413312690885741903663702`.

It is evaluated by direct residual quadrature; the Parseval subtraction is
only a cross-check.  Evenizing `k_lambda` requires the symmetric breakpoint
union `{log(m),L-log(m)}`.  At `lambda=2` the exact ordered breakpoints are

`0, log(4/3), log(2), log(3), log(4)`.

In particular, omitting the reflected breakpoint `log(3)` is rejected.

The signed block residual norms are:

| block | signed Rayleigh part | separate residual norm | action norm |
|---|---:|---:|---:|
| pole | `1.38026570226634` | `1.44176848619633` | `1.99595335031700` |
| archimedean | `-1.34866156541300` | `0.989486058046613` | `1.67271356695965` |
| prime | `-0.0315464128460646` | `0.508752397543373` | `0.509729514713033` |

Their Rayleigh parts cancel to `q`. The sum of the three separate residual
norms is approximately `2.94001`, whereas the norm of their signed vector sum
is approximately `0.00382117`; a blockwise triangle inequality loses a factor
of roughly 769 in this pilot.

The combined residual vector, kept before componentwise absolute values, is

`(0.00189241495479253, 0.00161913306890183, 0.00148179296661342,
  0.00161913306890183, 0.00189241495479253)`.

The old inversion-even gap from `q` is about `1.52004131590e-3`, but the old
odd gap from `q` is only `6.95355379560e-6` and controls `Delta`.  The refined
theorem compares the odd floor with `u_2D` instead; the resulting odd margin is
positive.  The generic boundary reserve remains negative, so only the source
simple-even commutator route is available conditionally.  That route has now
been re-derived from source equations (5.2)--(5.3): the producer reconstructs
`b_n=n Q_(n,0)`, the verifier independently uses `b_n=n Q_(n,-n)`, and both
replay `[M,Q]=|beta><eta|-|eta><beta|`.  For this pilot the source matrix-form
diagnostic passes and, conditional on the displayed simple-even sector
comparisons, gives `delta_N(xi)!=0`.  This is qualitative nonvanishing, not a
uniform boundary reserve; see `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.

## Analytic quadratic closure versus the residual target

The hard-endpoint outer--outer *quadratic* term is now closed.  The pinned
MTY--HSW--Platt--Trudgian zero inputs and the complete weighted-translation
theorem give, for the actual corrected and inversion-reflected state,

`|W_Z(O_lambda,O_lambda)| <= C_spec D_S(lambda) d_4`,

where `C_spec` is defined by an exact convergent positive dyadic series and
`D_S(lambda)=O(lambda^7)` with a displayed constant.  Combined with the
pinned fixed-index limit `lambda^8 d_4/d_8 -> 105/(4096 pi^4)`, this proves

`|W_Z(O_lambda,O_lambda)|/d_8 -> 0`.

The already-closed projection--projection and both mixed orientations then
give the unnormalized locked-schedule Ritz-energy statement

`q_lambda(p,p)=o(d_8)`.

This is a scalar quadratic-form result, not a residual theorem.  It does not
control `||(Q-q)p||`, the action of the shifted resolvent on that vector, or
either signed-sector floor.  The exact parity-multiplier/Schur reduction now
isolates those floor questions in a finite dangerous space governed by the
phase volume `Phi_lambda(U,g)`.  The target
`Phi_lambda=O(lambda^2/log(lambda))` is neither proved nor disproved: fixed
moments and quantitative equidistribution hit a rigorous length barrier, and
only an explicit `exp(O(lambda))` upper bound is currently available.
The separate finite-compression theorem now proves an
`O(lambda^2 log lambda)` trace and `O(lambda^2)` dangerous-rank scale on a
polynomial `N asymptotic lambda^2` schedule by a self-contained dyadic
logarithmic-Hilbert argument.  This does not bound the global phase volume,
does not persist with the same scale on the locked exponential schedule, and
does not prove that the physical prolate range captures the dangerous
directions.  The signed low Schur comparison and quotient-relative coupling
therefore remain open.

The original common Rayleigh-shift upper bound had a parity-scale limitation.
Although the compact-BV baseline `O(lambda^7*d_4)=o(d_8)`, the exact
fixed-index ratios

`d_8/d_6 ~ (32*pi^2/7)*lambda^4`,

`d_4/d_6 ~ (15/(128*pi^2))*lambda^(-4)`

show why that baseline alone gave only `O(lambda^3*d_6)`.  The
source-normalized `0/4` combination still does not cancel the hard endpoint:
its `h_0` endpoint contribution is smaller than its `h_4` contribution by
order `lambda^(-4)`.

The source-locked hybrid theorem now bypasses that endpointwise estimate.  It
uses a degree-three complete-series weighted `L2` bound through a finite
dyadic range and the existing weighted-translation estimate afterward.  Its
exact blockwise-minimum series satisfies

`B_hyb(lambda)=O(lambda^3*polylog(lambda))`,

and proves `||R||_Z^2=o(d_6)` on the locked schedule.  Thus the common
normalization-free shift obstruction is closed.  The separate projected-state
norm theorem supplies the lower control of `a`, so the normalized Ritz bound
`epsilon_lambda/a^2` is also `o(d_6)`.  Neither result proves a signed odd
floor, a residual-action estimate, or equation (5.2).  See
`notes/PARITY_SHIFT_SCALE_AUDIT.md` and
`notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md`, together with
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md`.

The residual obstruction has now been sharpened to an equality.  If
`p=a*kappa`, `R=K-p`, and `D>0` is any source-defined preconditioner on the
even complement, the exact radical identity gives

`||D^(-1)b|| = a^(-1) sup_(v!=0) |W_Z(v,R)|/||Dv||`.

Thus the missing input is a weak bilinear estimate on the `D`-graph unit
ball, not another diagonal value of the indefinite form.  Ordinary sequence
Cauchy--Schwarz in the positive absolute zero-sampling seminorm reduces this to
the complete-remainder sampling bound, window Bessel estimates, and a
reciprocal defect sum, as recorded in
`notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md`.  The first of those inputs is
proved at the sharper odd scale:
`notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` gives
`||R||_Z^2=o(d_6)` on the locked exponential schedule through an exact
convergent series, with its finite constants and tail switch independently
interval-replayed.

The original windowwise Bessel/reciprocal-sum formulation remains open, but
the sharper source-coordinate alternative is now proved on each split plus
block.  `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` covers every even
mode below the deterministic KRD transition index without assuming
`mu_n<c^2`.  `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` then proves, with
the complete correction and projection remainder included,

`Y_8^* Z^* Z Y_8 \preceq C_8 D_8`,

`Y_rest^* Z^* Z Y_rest \preceq C_rest D_rest`,

where `C_8=O(lambda*polylog(lambda))` and
`C_rest=O(lambda^3*polylog(lambda))`.  All within-block cross terms are
retained.  `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` now chooses the legitimate
metric `D_8 direct-sum D_rest`, proves the finite synthesis factors, and keeps
the cross-block row-operator term.  Its low physical action satisfies
`Gamma_low=O(lambda^3*polylog(lambda)/d_8)`.  The remaining positive-action
work is the physical-complement term `B_H/g^2`; no usable `g` follows from
the Fourier-high theorem because the physical and Fourier complements need
not agree.  The two shifted signed comparisons remain separate.  The exact
five-dimensional two-sided-radical model has all four
scalar P/O pairings equal to zero while the residual action remains nonzero,
so the scalar quadratic closure above still cannot by itself be promoted to
the required vector estimate or equation (5.2).

The next signed layer is now exact in source coordinates.  For
`A=W_LD_L^(-1/2)` and `Delta_L=(AA^*)^dagger` on the physical low range,
`notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` proves that the physical
comparison is equivalent to a lower bound for `P_0A^*QA P_0`; the
quotient-relative cross is exactly `P_HQW_LD_L^(-1/2)`, with the scalar shift
cancelled.  The known shift erodes any uniform unshifted source floor by only
`o(lambda^(-2))`.  A multiplier-weighted trace majorant gives an exact
phase-sensitive capture observable, and the odd projected pole may be placed
inside the low range for high/cross estimates.  Exact countermodels show why
the current absolute sampling bounds cannot by themselves furnish the sign,
capture, or strict reserve.  The matched-bandwidth target counts fill the
ambient comparison dimensions if a full-row co-frame and nonzero projected
anchor are proved; neither is currently known.

## Deterministic schedule diagnostics

The admitted schedule rows preserve every stage of the estimate.  A missing
entry means that a strict sector comparison failed and the weighted diagnostic
closed rather than inverting an inadmissible shift.

| schedule point | projection error | legacy `r/Delta` | scalar `r/Gamma` | weighted `tau` | result |
|---|---:|---:|---:|---:|---|
| `(1.5,3)` | `0.0010628213838794613361174013858011649` | `0.44752041215697594292690075640324004` | `0.021685258485815195630384086994876831` | `0.012937266968761826944598140870674064` | diagnostic pass |
| `(2,4)` | `0.000033186058341512675191195436420352645` | `236.73617478128001045599285001510689` | `2.0218909676227282725095273884386949` | `0.030977918684557082122243539273450533` | diagnostic pass |
| `(2.5,7)` | `0.00000144302203867247008341272907152` | -- | -- | -- | fail closed |
| `(3,9)` | `0.00000025985671475142536484409864389230512` | -- | -- | -- | fail closed |
| `(1.5,6)` | `0.0005105860296195402737884012301` | `0.281688787126819124649207584643` | `0.015369069364747334600214012353` | `0.0078290236959849436283804165863` | diagnostic pass |
| `(2,8)` | `0.000000139810280501905951411715943114` | `114.895444313775669157175913197` | `0.42107222966085073402298345045` | `0.000679977440374583012591377029228` | diagnostic pass |
| `(2.5,14)` | `0.0000000000187765885313561818080616444870398436478` | `119732102.0574509042756798169173102097959` | `235660.7438470146680202811985850836158495` | `0.003997472387054299901101589527627908404642` | diagnostic pass |
| `(3,18)` | `0.00000000000022440272193766377310564647652472039099675062` | -- | -- | -- | fail closed |

For `N=ceil(lambda^2)`, only two weighted points pass, so the reported
two-point log slope `-3.0351651180482268622` is explicitly not an exponent
estimate. Its projection-error fit remains exploratory:
`p=12.236685064624309049`, OLS-only standard error
`0.52774210533604892781`, and local slopes `9.4029717583762000288` to
`14.051001193171382297`.  The requested legacy `r/Delta` data likewise have
only two positive values; their log slope `-21.798297716677737412` is retained
but explicitly rejected as an exponent estimate.

For `N=2*ceil(lambda^2)`, the weighted values are nonmonotone:
`0.00782902370 -> 0.000679977440 -> 0.00399747239`.  The formal three-point
model `tau approximately C*lambda^(-p)` gives `p=1.654544874996192183`, but
its OLS-only standard error is `4.6431071972925073155` and its local slopes
range from `-7.9381989979009395242` to `8.4938677306925587374`.  This mixed
sign and uncertainty provide no evidence for an asymptotic exponent.  The
next point `(3,18)` has
`Gamma=-2.89283973901831240250442902264669540638319457e-24` and odd margin
`-3.14672092384820579349765202854041281827947626e-24`, so the weighted solve
is not attempted.  The independent replay also fails closed and agrees with
maximum scaled defect below `4.6e-35` against tolerance `1e-22`; this remains
a point-valued Galerkin diagnostic, not an interval sign enclosure.  With its
projection error included, the schedule's
projection-only fit is `p=31.95703783209124893`, with OLS-only standard error
`1.8416605055228814081` and local slopes `24.280857712808579407` to
`39.953791126153973323`; it likewise excludes discretization and model error.
The formal legacy `r/Delta` fit on its three positive rows has
`p=-38.04410068963484548`, OLS-only standard error
`11.64258592691476224`, and wholly negative local slopes from
`-62.097894855794841362` to `-20.894506539452528671`.  It records rapid
growth, not decay, and is not extrapolated past these finite rows.

The former low-precision `(2.5,14)` and `(3,9)` projection artifacts were
quarantined when their tails became unresolved.  Most importantly, none of
these point values supplies interval bounds `T_j>=tau_j`, an estimate on an
explicit unbounded shifted-resolvent sequence, or locally uniform determinant
convergence.  The separate quadratic theorem above does not change that
residual obstruction.  No asymptotic inference from the finite rows and no RH
claim is authorized; the terminal state is `P0_INVALIDATED`.

## Checkpoint 0.54 live-shift decomposition

The direct bridge uses a source-derived variational upper bound `U` for the
lowest even eigenvalue, with the mandatory choice equal to the lower
two-vector Ritz value `u`.  Put `t_U=q-U>=0`.  The combined endpoint vector
must again be formed before any block norm or absolute value:

`s_q=D(Q_+-qI)kappa-(delta kappa)beta=(Q_--qI)Dkappa`,

`s_U=s_q+t_U*Dkappa=(Q_--UI)Dkappa`.

With `x=Dkappa`, `y=x/||x||`, and `G=y^perp`, define the `q`-shifted
endpoint data

`B_q=P_G(Q_--qI)P_G|_G`,

`a_q=<x,s_q>/||x||^2`, `c_q=P_G s_q/||x||`.

The exact unsplit transport is

`B_U=B_q+t_U*I_G`, `a_U=a_q+t_U`, `c_U=c_q`.

Consequently the actual odd gate is

`B_q+t_U*I_G>0`,

`a_q+t_U-<c_q,(B_q+t_U*I_G)^(-1)c_q>>0`.

The old `q`-shift gate is the stronger special case `t_U=0`; it is not the
minimal condition in the residual--Ritz bridge.  For the mandatory first
Ritz value, if `r=||(Q_+-qI)kappa||` and `c_R` is the Rayleigh value of its
normalized residual direction, then

`t_U*(c_R-q+t_U)=r^2`.

The cumulative-discrepancy decomposition retains the same cancellation:
the scalar and transverse blocks receive the scalar `t_U`, while the cross
functional is unchanged.  No separate pole, archimedean, prime, `Dr`, or
`(delta kappa)beta` norm occurs in the live Schur short.

This shift can regularize the transverse block, and a declared higher even
Krylov polynomial can lower `U` further.  It does not by itself prove either
sector comparison.  Fixed-order prolate derivative corrections instead
produce arbitrarily large transverse near-null radical spaces, so absolute
beyond-all-orders bounds for `a_q`, `c_q`, and `s_q` do not control the
inverse-weighted quotient.  Finite discrepancy moments likewise do not
determine the growing carrier transforms entering `B_U`.

The interval-enclosed `(lambda,N)=(2,4)` rational witness is deliberately
not the projected prolate state.  It has positive `q`-shifted transverse and
derivative scalars but a negative Schur short at both `q` and mandatory `u`.
It therefore rejects a state-independent positive-real shortcut without
altering the pilot datasets or asserting an asymptotic failure.

No checkpoint-0.54 result proves `alpha>U`, `U<mu_-`, the weighted solve in
equation (5.2), or locally uniform determinant convergence.  The terminal
state remains `P0_INVALIDATED`.

## Checkpoint 0.55 complete-leakage and orientation decomposition

Let `p` be the unnormalized projected source state, `a^2=||p||^2`, and use
the invisible codimension-two correction only to form the global radical
`K`.  With `R=K-p` and `ell_R` the Riesz vector of
`v -> W_Z(v,R)`, radical cancellation gives the exact unsplit identities

`Qp=-ell_R`,

`M_0=a^2`, `M_1=W_Z(R,R)`, and
`M_j=<ell_R,Q^(j-2)ell_R>` for `j>=2`.

Here `Q=Q_pole-Q_arch-Q_prime` is assembled before any application or power.
The fixed-dimensional even Ritz value is the generalized Hankel minimum
formed from these `M_j`; no stored eigensystem or normalized residual
direction is needed.

There is an equivalent centered decomposition.  Put

`g=(Q-qI)p=-P_(p^perp)ell_R`,

`C=P_(p^perp)(Q-qI)P_(p^perp)`,

`sigma_j=<g,C^j g>`.

For `m>=2`, the raw complement Gram matrices are
`Sigma_0=(sigma_(i+j))`, `Sigma_1=(sigma_(i+j+1))`, and
`v=(sigma_0,...,sigma_(m-2))`.  The live lowering `t_m=q-U_m` is the unique
lowest branch satisfying

`a^2*t_m=v^*(Sigma_1+t_m*Sigma_0)^(-1)v`.

For `m=3`, writing

`Delta=sigma_0*sigma_2-sigma_1^2`,

`D_0=sigma_1*sigma_3-sigma_2^2`,

`D_1=sigma_0*sigma_3-sigma_1*sigma_2`,

`Gamma=sigma_0^2*sigma_3-2*sigma_0*sigma_1*sigma_2+sigma_1^3`,

the exact cubic is

`a^2*Delta*t^3+a^2*D_1*t^2+(a^2*D_0-sigma_0*Delta)*t-Gamma=0`,

on the branch where `Sigma_1+t*Sigma_0` is positive.  The centered moments
must include the return subtractions
`sigma_2=Mtilde_4-Mtilde_2^2/a^2` and
`sigma_3=Mtilde_5-2*Mtilde_2*Mtilde_3/a^2`.

The odd live matrix at the same `U` has a second exact decomposition.  For
the linear radical lifts, let `A_-` be the positive paired absolute exterior
Gram, `S_-` the signed Gram, and `E_-=A_--S_->=0` the anti-aligned defect.
On the endpoint chart,

`Q_--U*I=(A_--U*I)-E_-`.

Therefore the complete odd Schur gate is exactly

`A_--U*I>0` and
`||(A_--U*I)^(-1/2)E_-(A_--U*I)^(-1/2)||<1`.

Absolute sampling controls `A_-`; it does not control the orientation
defect relative to the shifted base.  On an even space containing the Ritz
null vector the analogous quotient is singular or exactly one, so it cannot
be reused as a strict common contraction.  The exact source-Cauchy twin and
the flat-scale families show that this missing orientation and relative
scale are genuine data, not consequences of the existing absolute bounds.

The positive Fejer comparison introduces no new residual identity.  For a
trial state `p` with boundary value `c_p`, its commutator equation contains
the exact defect

`(Q_--vI)Dp/c_p = D((Q_+-vI)p)/c_p-beta`,

whose elementary norm is amplified by `N/|c_p|`.  Transferring positivity to
the actual ground therefore requires the separate boundary-normalized
uniform estimate recorded at checkpoint 0.55; it does not follow from the
small combined residual alone.

The checkpoint-0.55 `lambda=2,N=3,4` live replay preserves all combined
vectors and solves before reporting norms, but it consumes point
coefficients.  The later state balls do not retroactively enclose its
higher-Krylov, inverse-load, or weighted-solve values.  No checkpoint-0.55
result proves the common-schedule
orientation contraction, even complement, weighted solve, or determinant
limit.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.56 finite state-ball and relative-orientation decomposition

For the live odd comparison write `C=A_--U*I` and `E=A_--S_-`.  Whenever
`C>0`, the exact signed relative slack is

`1-||C^(-1/2) E C^(-1/2)||
 = lambda_min(C^(-1/2)(S_--U*I)C^(-1/2))`.

This preserves the combined signed block before taking norms.  Separate
absolute estimates for `A_-` and `E` lose the cancellation through the
triangle inequality; the synthetic all-`N` family proves that the current
absolute controls do not determine the displayed relative quantity.

At `lambda=2,N=4`, the new state balls can be paired directly with the four
Weil-matrix balls.  Ball arithmetic gives

`q=7.99356612363419941472825457581657e-8 +/- 1.38e-34`,

`r=5.29022713318068927275139926249219e-5 +/- 3.13e-34`,

while interval LDL proves `Q_--3e-7 I>0`, hence

`lambda_min(Q_-)-q>2.20064338763658005852717454104824e-7`.

The existing source producer continues to assemble
`Q=Q_pole-Q_arch-Q_prime` before applying it to the state, and the historical
diagnostic artifacts serialize the much larger separate block norms so their
cancellation is visible before any absolute-value bound.  Checkpoint 0.56
ball-encloses the combined `q` and residual above, not those separate block
norms.  Its odd margin is not the full complementary minimum `Delta`.  No
projection-error ball, residual/`Delta` scaling dataset, unbounded schedule,
equation (5.2), or determinant limit is claimed.

## Checkpoint 0.64 prolate-secant residual decomposition

Let `kappa` be the unit projected source-normalized anchor, let `z0` be the
projected limiting arithmetic state, and work in the inversion-even
complement at the Rayleigh shift

`q=<kappa,Q kappa>`, `b=(Q-qI)kappa`,
`B=P_(kappa^perp)(Q-qI)P_(kappa^perp)`.

The matrix remains the combined source object
`Q=Q_pole-Q_arch-Q_prime`; no block norm is inserted before `b`, `q`, or `B`
is formed.  Write the exact finite secant decomposition

`z0=alpha*kappa+beta*omega`,

where `beta>0` and `omega` is unit and orthogonal to `kappa`.  With

`epsilon=<omega,B omega>`, `d=<omega,b>`, and
`D0=<z0,(Q-qI)z0>`,

direct expansion gives the signed identity

`D0=2*alpha*beta*d+beta^2*epsilon`.

Splitting `b=d*omega+b_perp` then gives

`(r/epsilon)^2`
`=(-beta/(2*alpha)+D0/(2*alpha*beta*epsilon))^2`
`+||b_perp||^2/epsilon^2`,

for `r=||b||` and nonzero `alpha`.  The first term is a signed scalar
leakage mismatch; the second is an independent orthogonal residual.  Taking
absolute values of the pole, archimedean, and prime actions separately before
forming either term destroys the combined cancellation and does not bound
this relative decomposition.

The source-normalized first prolate correction fixes the sign of this secant:
on the admitted qualitative schedule,

`lambda^2*(I-kappa*kappa^*)z0 -> W_infinity/(16*pi)`.

This identifies a canonical transverse direction but supplies no
actual-source estimate for either summand.  The checkpoint-0.64 artifacts
evaluate the identity at one finite point in nondirected point arithmetic;
they do not prove an unbounded relative residual rate, equation (5.2), or a
determinant limit.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.65 graph-shorted reciprocal decomposition

Continue in the even anchor complement and split it orthogonally as
`span{omega} direct-sum F`, with isometry `U:F->kappa^perp`.  Write

`g=U^*B omega`, `C=U^*BU`, `K_F=U^*K_TU`,

`delta_r=epsilon+r-g^*(C+rI)^(-1)g`, and
`v_r=omega-U(C+rI)^(-1)g`.

Exact block inversion gives

`(B+rI)^(-1)=delta_r^(-1)|v_r><v_r|+U(C+rI)^(-1)U^*`,

so the combined residual-ridged soft trace is

`S_r=r*<v_r,K_Tv_r>/delta_r+r*tr((C+rI)^(-1)K_F)`.

No pole, archimedean, or prime block is separated in this identity: `B` is
formed only after assembling `Q=Q_pole-Q_arch-Q_prime`.  Both terms on the
right are nonnegative, so the required soft-trace rate holds exactly when
both scaled terms vanish.  Under two-sided control of the tilted capture,
the first term has the intrinsic shorted target
`r/delta_r=o(L^(-3/2))`; the deflated bulk remains a separate obligation.

At zero ridge,

`delta_0=epsilon-g^*C^(-1)g`
`=min_(<omega,x>=1)<x,Bx>`
`=det(B)/det(C)=1/<omega,B^(-1)omega>`.

For `z0=alpha*kappa+beta*omega`, let `b_F=U^*b` and
`a0_F=U^*(Q-qI)z0`.  The exact signed vector relation

`a0_F=alpha*b_F+beta*g`

shows that controlling the graph collapse requires an inverse-weighted
vector cancellation, not merely the scalar `D0` identity.

At the source-pinned `lambda=2,N=4,T=1` pilot, the 80-digit producer gives
`delta_r approximately 7.9319998e-5`; the soft trace splits into
approximately `0.07872842574+0.00006669154528`.  The unregularized reciprocal
trace splits into approximately `4498.64146043+1.26213961`.  Independent
replay closes the identities to the reported precision.  These values are
nondirected point diagnostics in an unenclosed finite prolate space.  They
prove no unbounded shorted rate, deflated-bulk rate, equation (5.2), or
determinant limit, and the terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.66 signed graph load and finite-increment decomposition

For a common certified shift `U<=q`, write the anchor complement as
`span{omega} direct-sum F` and

`B_U=[[epsilon_U,g*],[g,C_U]]`,
`D_(r,U)=C_U+rI`.

If `z0=alpha*kappa+beta*omega`, the physical transverse graph load is exactly

`ell=P_F(Q-UI)z0-alpha*P_F b=beta*g`.

Two-sided radicality fixes its weak sign:

`<v,ell>=-W_Z(v,R_0)+(alpha/a)W_Z(v,R_lambda)`.

Consequently

`delta_(r,U)/(epsilon_U+r)`
`=1-<ell,D_(r,U)^(-1)ell>/(beta^2*(epsilon_U+r))`.

This preserves cancellation between the two residuals and gives the exact
necessary-and-sufficient inverse-energy gate for a noncollapsing
short.  A separate two-inverse-power estimate is still needed for harmonic
capture.

For fixed `theta>0`, let

`F_theta=log det(B_U+rI+theta*r*K_T)-log det(B_U+rI)`

and split the secant Schur factor.  Then exactly

`F_theta=G_theta+J_theta`,

where `G_theta` is the deflated-bulk determinant increment and `J_theta` is
the graph-short increment.  Their positive trace bounds recover the two
nonnegative terms of the soft trace without separating the pole,
archimedean, or minus-prime blocks.

At `U=q`, the trace is the coefficient-one self-regularized observable,
but proving both complete `q`-shifted signs on the widening core is already
RH-level arithmetic work.  At a certified two-vector Ritz shift
`u<=U<q`, the exact equation
`q-U+h_U=<b,(B_U+h_UI)^(-1)b>` invalidates coefficient one, but the Ritz
secant moment gives the repaired transfer

`zz* <= A_R((q-U)/r) r(B_U+rI)^(-1)`.

The explicit factor must be retained.  Thus checkpoint 0.66's positive
increment is a valid localized ground observable after the checkpoint-0.67
Ritz multiplier, but neither checkpoint proves equation (5.2), an unbounded
weighted response estimate, or a determinant limit.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.67 Ritz-moment transfer decomposition

Let `u` be the lower two-vector Ritz value and set

`d=q-u`, `B_u=A-uI`, `w=b/r`.

The secant characteristic polynomial gives the exact finite identity

`d*<w,B_u w>=r^2`.

For the coefficient-normalized true even ground correction
`z=(B_u+hI)^(-1)b`, `h=u-mu`, the combined Feshbach equation is

`d+h=<b,z>`.

No source block is separated in either formula.  The complete matrix is
assembled as `Q_pole-Q_arch-Q_prime` before `q`, `b`, `B_u`, `u`, or `z` is
formed.  The Ritz moment and `0<=h<=rho(d,r)<=r` prove

`zz*<=A_R(d/r) r(B_u+rI)^(-1)`.

Consequently every positive contraction `K` has the cancellation-preserving
decomposition

`<z,Kz> <= A_R(d/r) H_K`,

`H_K=r*tr((B_u+rI)^(-1)K)`,

`F_K=log det(B_u+rI+rK)-log det(B_u+rI)`,

`F_K<=H_K<=F_K/log(2)`.

At the 80-decimal `lambda=2,N=4,T=1` point, `d/r` is approximately
`0.000318172767533`, `A_R` is approximately `1.000477360401314`, and
the fixed-window quantities are

`<z,K_Tz> approximately 0.000106522199937`,

`H_(K_T) approximately 0.0787783596799`,

`F_(K_T) approximately 0.0758292567879`.

The identity observation gives `||z||^2 approximately 0.000955148631168`
and `H_I approximately 0.670383014090`.  These are nondirected finite point
values in an unenclosed 30-mode prolate space.  They do not estimate an
unbounded source schedule, prove equation (5.2), or provide locally uniform
determinant convergence.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.68 projective low-mode determinant decomposition

Let `Pi_M` be the full centered raw-mode projector onto `|n|<=M`, let `W`
embed the anchor complement into the even sector, and put

`K_M=W^* Pi_M W`, `D=B_u+rI`.

For the coefficient-normalized exact ground correction `z`, the observed
low projective error is exactly

`||Pi_M Wz||^2=<z,K_M z>`.

The Ritz transfer and positive log increment give the cancellation-preserving
finite chain

`<z,K_M z> <= A_R(d/r) r*tr(D^(-1)K_M)`

`<= A_R(d/r) F_(theta,M)/log(1+theta)`,

where

`F_(theta,M)=log det(D+theta*r*K_M)-log det(D)`.

At the source spectral point `zeta=u-r`, this same increment is reconstructed
from the **full** ambient homotopy `Q+t*Pi_M`:

`F_(theta,M)`
`=log(det O_(theta*r)/det O_0)`
` -log((sigma_(theta*r)m_(theta*r))/(sigma_0*m_0))`.

The odd determinant, boundary factor, and anchor Schur factor remain one
combined response.  The homotopy cross vector
`b_t=b+t*W^*Pi_M*kappa` and anchor scalar
`a_t=d+r+t*<kappa,Pi_M*kappa>` are retained before any determinant or
absolute value is taken.

For `M=ceil(lambda)<N`, bounded `d/r`, and the already proved source
normalization and projection estimates, the sufficient remaining arithmetic
target is

`A_R(d/r) F_(theta,M)=O(lambda^(-1))`

for one fixed `theta>0`, together with both strict shifted-sector signs.
This response estimate is not proved.  A source-Cauchy counterfamily shows
that an unrelated cutoff-visible near-null complement direction can keep
`F_(theta,M)` bounded below even when the actual ground correction tends to
zero.  The finite reduction therefore does not prove equation (5.2), an
unbounded determinant rate, or a locally uniform limit.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.69 ground-projective cofactor decomposition

At the true simple even ground, let `H=Q_+-mu*I`, normalize its ground line
by `<kappa,x>=1`, and put `C=adj(H)` and
`c=<kappa,C*kappa>`.  The exact low-mode projective correction is

`E_M=((C*kappa-c*kappa)^* Pi_M (C*kappa-c*kappa))/c^2`.

Equivalently,

`E_M=k00-2*Re(<kappa,Pi_M*C*kappa>)/c+tr(Pi_M*C)/c`.

This is the required symbolic cancellation: the anchor, mixed cofactor, and
ground-mass terms are assembled from the complete
`Q_pole-Q_arch-Q_prime` matrix before the final combination.  Separate
absolute block bounds are not substituted for it.

The full ambient homotopy gives the normalized singular response

`S_M=partial_t det(H+t*Pi_M)|_0/c=<x,Pi_M*x>`

and the exact high-tail correction

`S_M-k00=E_M-2*Re(<R_M*kappa,R_M*(x-kappa)>)`.

The already proved source-state BV bound makes the last term
`O(lambda^(-2)*sqrt(log lambda))` at
`M=ceil(lambda^12)` when the Ritz correction norm is bounded.  Thus the new
conditional arithmetic target is `|S_M-k00|=O(lambda^(-1))`, with both
strict sector signs.  No such schedule estimate is proved.

For `k00>0`, define
`L_M=Ran(Pi_M) intersect (Pi_M*kappa)^perp` and
`h_M=<R_M*kappa,R_M*(x-kappa)>`.  The response has the exact orthogonal
decomposition

`S_M-k00=||P_(L_M)x||^2+|h_M|^2/k00-2*Re(h_M)`.

Nested projection and the admitted Gevrey state estimate make `h_M`
exponentially small at `M=ceil(lambda^12)`.  Consequently the missing rate
is equivalent to

`||P_(L_M)Phi_mu||^2`
`=O(lambda^(-1))*|<kappa,Phi_mu>|^2`.

This retains the complete odd-resolvent ground orientation.  A structural
source-Cauchy counterfamily keeps the normalized ratio equal to `1/3`
despite zero tail and both strict signs, so no absolute tail estimate can
replace it.

The positive bordered response gives

`E_M=(1+s*(q-mu))*Phi_s'(0)/s`.

Its finite secant controls `E_M` from above only after multiplication by a
cyclic-cap factor.  A cap-free decomposition retains the high cyclic tail
`T_X`; omitting it is invalid.  These exact finite decompositions do not
prove equation (5.2) or an unbounded determinant limit.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.70 natural-cutoff signed alignment decomposition

Write the complete source operator in the weighted-discrepancy normal form

`Q=c_*I+H_D`, `H_D=A_tail-T_D`.

No absolute value is inserted in this identity.  On the even anchor
complement, at the true simple ground `mu`, put

`b_A=P_K A_tail kappa`, `b_T=P_K T_D kappa`,

`b_D=b_A-b_T`, `B_mu=P_K(Q_+-mu I)P_K`.

The common inverse gives

`z_A=B_mu^(-1)b_A`, `z_T=B_mu^(-1)b_T`,

`z=B_mu^(-1)b_D=z_A-z_T`.

For the natural low anchor-transverse projector `P_(L_M)`,

`A_M=||P_(L_M)x||^2=||P_(L_M)Wz||^2`,

and the squared cancellation is retained exactly as

`A_M=||P_LWz_A||^2+||P_LWz_T||^2`
` -2*Re(<P_LWz_A,P_LWz_T>)`.

The individual resolved norms are therefore reported together with their
signed cross term and the combined norm.  At the 80-decimal
`lambda=2,N=8,M=2` point they are approximately

`||P_LWz_A|| = 1.1770174542123040e6`,

`||P_LWz_T|| = 1.1770174548895734e6`,

`||P_LW(z_A-z_T)|| = 6.772696082992786e-4`.

Thus a triangle estimate loses a factor about `3.475772248e9`.  The forcing
vectors themselves already lose a factor about `6.138175e6` under the same
separation.  The direct combined solve and the subtraction through the same
inverse agree independently; two unrelated block inverses are never used.

The same cancellation has a cumulative arithmetic form.  With

`F_align=D-H_tail`, `F_boundary=D-H_0`,

`F_align=F_boundary+2*exp(-t/2)`,

one has `dF_align=-exp(-t/2)dG`, including every prime-power atom.  For
`u_j=B_mu^(-1)ell_j`, where `(ell_j)` spans the low transverse space,

`A_M=sum_j | integral F_align(t) C_(u_j)'(t) dt |^2`

`=sum_j | -integral G(t)(exp(-t/2)C_(u_j)(t))' dt |^2`.

This is a symbolic pole--archimedean--prime cancellation before the final
absolute squares.  It is not a PNT-only estimate because the test vectors
retain the unresolved inverse `B_mu^(-1)`.

Finally, with `C=adj(Q_+-mu I)` and
`c_kappa=<kappa,C kappa>`,

`A_M=tr(P_(L_M)C)/c_kappa`,

`S_M-k00=A_M+|h_M|^2/k00-2*Re(h_M)`.

At the finite point, `A_M` is about `4.58694122326e-7` while the signed
response `S_M-k00` is about `-2.67149108172e-7`; its sign is not assumed.
The admitted Gevrey tail makes their asymptotic absolute rates equivalent at
`M=ceil(lambda)` only after bounded exact-`u` Ritz correction is supplied.
No such actual-source rate or schedule-wide sign is proved.  The terminal
state remains `P0_INVALIDATED`.

## Checkpoint 0.71 even-sector cross-root decomposition

Checkpoint 0.70 expressed the unresolved ground orientation inside the even
compression.  Checkpoint 0.71 shows that this even object already has enough
finite zero geometry for a conditional limit argument; a separate odd
shifted sign is not needed on that route.

Let `x=sum_(|n|<=N)x_n V_n`, `x_(-n)=x_n`, be the real simple lowest
eigenvector of `Q_+`, with eigenvalue `mu`.  For `s=zL/(2*pi)`, define

`p_x(y)=x_0*product_(m=1)^N(y-m^2)`
` +2*y*sum_(n=1)^N x_n*product_(m!=n)(y-m^2)`.

Before any root inference, the exact transform decomposition is

`hat(x)(z)=(sqrt(L)/pi)*(sin(pi*s)/s)`
` *p_x(s^2)/product_(m=1)^N(s^2-m^2)`.

The lattice singularities are removable.  If `c=<eta,x>!=0`, boundary
normalization gives the quotient mode operator `D''`.  On
`K_+=H_+/(complex span of x)`, let

`G_+([f],[g])=< (Q_+-mu*I)f,g >`.

The simple even-ground hypothesis makes `G_+` positive.  If `C` is the
bijective plus-to-minus block of the rank-one corrected mode operator and
`A` is its square on the even quotient, the source commutator gives

`G_+*A=C^*(Q_--mu*I)C`,

`p_x(y)=c*det(y*I-A)`.

This is an exact combined-source identity.  The pole, archimedean, and
minus-prime contributions enter through the already assembled `Q`; no block
is absolutized or assigned a separate sign.  Congruence transfers the odd
shifted inertia to `A`, while the positive metric makes every eigenvalue of
`A` real.  Hence positive squared roots give real transform-zero pairs and
negative squared roots give purely imaginary pairs.

If `c=0`, the determinant normalization is not used.  Change only the even
diagonal coefficients of the Cauchy matrix.  The exact source commutator is
unchanged.  Were the nearby simple even ground boundary-orthogonal for every
small perturbation, `D*x` would be an odd eigenvector on the same analytic
eigenvalue branch.  The even and odd Hellmann--Feynman derivatives can be
separated by a shell-diagonal perturbation, a contradiction.  Nearby
nondegenerate `p_x` are real-rooted, and coefficientwise closure gives the
same conclusion at `c=0`.  The `x_0=0` branch merely contributes a zero
squared root.

The resulting finite decomposition is therefore

`zeros(hat(x)) subset R union iR`.

It is strictly weaker than finite real-rootedness.  The exact `N=1`
source-Cauchy model with even eigenvector `(1,-1,1)`, even eigenvalues `0,3`,
and odd eigenvalue `-1` has `p_x(y)=y+1`.  Conversely, the lowest-even
hypothesis cannot be dropped: an exact `N=2` source-Cauchy matrix has a
simple non-extremal even eigenvector with `p_x(y)=y^2+4`.

For the asymptotic bridge, Hurwitz excludes limiting zeros in the four open
quadrants, and the elementary sign `Xi(i*y)>0` excludes the remaining open
imaginary segment.  Thus the surviving residual/alignment target is:

1. prove the strict even complementary gate at the exact lower Ritz value;
2. keep `(q-u)/r` bounded;
3. prove the complete signed natural-cutoff response
   `|S_(ceil(lambda))-k00|=O(lambda^(-1))`, or its exact weaker projective
   version; and
4. close the existing projective estimates strongly enough for locally
   uniform convergence.

The fixed-`lambda` outer-limit decomposition is separate.  The complete
actual-source form is `Q_lambda=D_a+B_lambda`, where `B_lambda` is bounded,
`a_n=log|n|+O_lambda(1)`, and centered Fourier sums are a form core for the
semibounded compact-resolvent operator.  Consequently its finite even Ritz
values converge to the infinite even spectrum.  If the infinite bottom is
simple and has nonzero prolate overlap, its coefficient-normalized finite
grounds converge and, for fixed `M`,

`A_(M,N)=||P_(L_(M,N))x_N||^2 -> A_(M,infinity)`.

This is convergence to the infinite source ground, not to the prolate
anchor.  Exact logarithmically coercive diagonal source-Cauchy families keep
the right side equal to `16/9`, while a second family keeps the infinite and
finite even bottoms two-dimensional.  Hence taking `N->infinity` can remove
the finite Galerkin remainder but cannot supply the missing signed
alignment, ground simplicity, or locally uniform convergence to `Xi`.

The odd shifted sign is deleted only from this cross-root route.  The actual
even gate, signed alignment, and locally uniform convergence remain open.
No full-`L2` equation (5.2) or asymptotic theorem is obtained.  The terminal
state remains `P0_INVALIDATED`.

## Checkpoint 0.72 multiplicity/Krylov and strip-root decomposition

This checkpoint adds two exact decompositions and no new residual estimate.
For the source-Cauchy parity blocks, the rank-two commutator restricts to

`D*Q_+-Q_-*D=|beta><eta|`.

At a common level `mu`, multiplication by the mode operator injects
`ker(Q_+-mu I) intersect ker<eta,.>` into the odd eigenspace, and injects
`ker(Q_--mu I) intersect beta^perp` into the even eigenspace.  Therefore

`k_+(mu)<=k_-(mu)+1`,  `k_-(mu)<=k_+(mu)+1`.

This isolates the exact finite simplicity obstruction: a multiple even
bottom must be a parity collision.  It does not orient either sector.

Let `A=Q_+`, `p(z)=det(A-zI)`, `q(z)=det(Q_--zI)`, and
`K_A(u)=[u,Au,...,A^N u]`.  The boundary Schur decomposition and its
resultant are

`q(z)=<eta,adj(A-zI)e_0>`,

`Res(p,q)=(-1)^(N*(N+1)/2)*det K_A(e_0)*det K_A(eta)`.

Thus bottom noncollision is a sign-free simplicity certificate; complete
parity noncollision is the joint boundary cyclicity condition.  The
commutator recurrence

`D*A*e_0=beta`,

`D*A^k*e_0=Q_-*D*A^(k-1)*e_0+beta*<eta,A^(k-1)e_0>`

is triangular in Krylov columns and yields

`det K_(Q_+)(e_0)=det K_(Q_-)(beta)/N!`.

No pole, archimedean, or prime block has been separated or absolutized in
these identities: each occurrence of `Q` is the complete source matrix,
with the minus-prime cancellation preserved.  Real-analytic dependence on
a fixed prime-inventory cell makes a rational search conditional on a
nonidentity theorem.  The exact counterfamily

`Q=mu*I+c*|eta><eta|`,  `c>0`,

has nonzero `beta`, persistent even multiplicity, and persistent parity
collision, so the structural decomposition supplies no such theorem.

At fixed `lambda`, the infinite even operator has the exact low/high
Feshbach--Schur matrix

`F_M(mu)=P(Q_+-mu I)P-PQ_+R(Q_H-mu I)^(-1)RQ_+P`.

For a simple ground `phi` with `P phi!=0`, this matrix is nonnegative and
`ker F_M(mu)=C*P phi`.  Thus `A_(M,infinity)=0` is exactly the arithmetic
kernel condition `F_M(mu)P kappa_infinity=0`.  The quantitative
finite-to-infinite estimate further separates the ordinary ground tail
from its shifted-form energy and divides by the infinite spectral gap and
ground overlap.  None of these unknown actual-source quantities is enclosed
by the finite prolate projection data, so the finite alignment trend cannot
be promoted to a limit enclosure.

For the projected anchor, a raw-polynomial root `y=A+iB` has physical height

`|Im z|=(2*pi/L)*sqrt((|y|-A)/2)`.

Writing `delta=L/(4*pi)`, the open-strip forbidden region is exactly

`A>-delta^2`,  `B^2<4*delta^2*(A+delta^2)`

away from `[0,infinity)`.  The admitted source normalization gives the
fixed-mode coefficient direction

`sqrt(L)*c_n(lambda)->(-1)^n*Xi(0)/4`.

At fixed `N=2`, this produces

`p_*(y)=y^2+y+4`,

whose roots have `v=sqrt(5)/2`; the corresponding nonreal transform zeros
have height `(pi*sqrt(5)/L)(1+o(1))` and enter the open strip.  The
fixed-rank projected norm tends to zero, so this is a no-go for a universal
finite-anchor strip claim, not for a projection-convergent schedule.

The unresolved combined-source quantities remain the actual-source
`beta`/`e_0` cyclicity or parity noncollision, quantitative gap control,
the signed natural-cutoff ground alignment, projection-convergent strip
exclusion, equation (5.2), and locally uniform ground-transform convergence.
No triangle inequality or finite-root diagnostic closes any of them.  The
terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.73 canonical-ground and source-metric decomposition

Let

`A=Q_+`, `mu=min spec(A)`, `E=ker(A-mu*I)`,
`eta=sum_(|n|<=N)V_n`, `u=P_E eta`.

The boundary-visible branch `u!=0` has a canonical finite decomposition.
The exact source-Cauchy auxiliary

`Q_epsilon=Q-epsilon|eta><eta|`

has parameters

`a_n^(epsilon)=a_n-epsilon`,
`b_n^(epsilon)=b_n-epsilon*n`,

and leaves the odd block unchanged.  Rank-one interlacing places exactly one
simple even eigenvalue below the old even bottom, and the corresponding
oriented vector satisfies

`x_epsilon -> x=P_E eta/||P_E eta||`

at fixed `N`.  Applying the simple-even-ground polynomial theorem before
taking the limit gives

`p_x` real-rooted,
`zeros(hat(x)) subset R union iR`.

This is the precise sense in which finite simplicity, parity noncollision,
and Krylov cyclicity leave the cross-root residual decomposition.  They do
not leave the quantitative alignment problem.  If `P_E eta=0`, the
perturbation annihilates the complete lowest eigenspace.  The exact family
`Q=mu*I+c|eta><eta|` has this behavior, and a ground vector at `N=3` has
`p_x(y)=y^2+1`; therefore arbitrary multiple-ground selection is invalid.
Paired diagonal shells select some cross-root vector in `E`, but not a
canonical prolate-aligned one.

For any selected unit `x`, put

`p=Pi_M*kappa`, `k00=||p||^2`,
`L_M=Ran(Pi_M) intersect p^perp`,

`A_x=||P_(L_M)x||^2`, `c_M=<Pi_M*x,p>`.

The remaining low-mode projective residual has the exact multiplicity-safe
decomposition whenever `k00*A_x+|c_M|^2>0`:

`min_s ||Pi_M(s*x-kappa)||^2`
`=k00^2*A_x/(k00*A_x+|c_M|^2)`.

Thus boundary visibility `P_E eta!=0` is distinct from prolate overlap
`alpha=<kappa,x>!=0`.  For the coefficient-normalized vector
`X=x/alpha`, the harmonic alignment below is
`A_M=||P_(L_M)X||^2=A_x/|alpha|^2`; neither visibility nor nonzero overlap
supplies its decay.

For the simple-ground harmonic reduction, split the positive complement as
`K=L_M direct-sum H_M` and write

`B_mu=[[A,C^*],[C,D]]`, `b=(b_L,b_H)`,

`S=A-C^*D^(-1)C`, `f=b_L-C^*D^(-1)b_H`,

`U*ell=(ell,-D^(-1)C*ell)`.

The lossless graph identities are

`B_mu*U=iota_L*S`,
`U^*B_mu^2*U=S^2`,
`U^*b=f`.

They give the exact combined-source residual

`A_M=f^*S^(-2)f`.

In particular,

`A_M<=C0^2/lambda`

is equivalent to

`f*f^* <= (C0^2/lambda)*S^2`,

not merely implied by it.  If the admitted full-source analysis map is `T`,
set

`R0=U^*(T*T^*)U`,
`H=R0^(-1/2)S^2R0^(-1/2)`,
`g=R0^(-1/2)f`.

Then the whitened bordered matrix is congruent to the unwhitened one and

`g^*H^(-1)g=f^*S^(-2)f=A_M`.

Whitening is therefore coordinate-only.  The scalar relaxation
`(g^*g)/lambda_min(H)` replaces the anisotropic generalized spectral weights
by their worst direction and can lose an arbitrarily large factor.  It is
not a new cancellation or residual estimate.

Define the complete inclusive discrepancy and graph test by

`G_lambda(t)=exp(t)-psi_C(exp(t))`
` -(1/2)*log(1-exp(-2*t))`,

`q_v(t)=<v,K_t*kappa>`.

The combined pole--archimedean--minus-prime forcing satisfies

`<v,b>=-integral_0^L G_lambda(t)`
` *(exp(-t/2)q_v(t))'dt`.

Substituting `v=U*ell` shows that the exact unresolved source residual is

`|integral_0^L G_lambda(t)`
` *(exp(-t/2)q_(U*ell)(t))'dt|^2`
` <= (C0^2/lambda)||B_mu*U*ell||^2`

for every `ell in L_M`, uniformly on one admitted unbounded schedule.  This
is equation (8.4) of the harmonic source-metric note.  The graph vectors
depend on the full signed operator, so separate block bounds, fixed-test PNT
estimates, row-frame lower bounds, and scalar whitening do not establish it.

No visibility, overlap, inequality (8.4) in its simple-ground branch,
corresponding multiplicity-safe alignment rate in a multiple-ground branch,
equation (5.2), or locally uniform limit is proved here.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.74 mixed-projector, selector, and screened decomposition

Retain

`A=Q_+`, `mu=min spec(A)`, `E=ker(A-mu*I)`,
`m=dim(E)`, `P=P_E`.

For

`p(z)=det(z*I-A)`, `C(z)=adj(z*I-A)`,

the complete lowest-space projector is reconstructed without a cached
eigenbasis by

`P=m*C^(m-1)(mu)/p^(m)(mu)`.

If

`b(z)=eta^T*C(z)*eta`, `c(z)=kappa^T*C(z)*eta`,

then the canonical boundary-ground coefficient has the exact
multiplicity-safe decomposition

`|alpha|^2=m*|c^(m-1)(mu)|^2`
` /(p^(m)(mu)*b^(m-1)(mu))`.

The product in the denominator is positive, including when the scalar
factor in `p(z)=(z-mu)^m*g(z)` is negative.  This formula replaces neither
the source normalization nor the missing actual-source lower bound.

For `delta>0`, set

`R_delta=(A-mu*I+delta*I)^(-1)`,
`y_delta=R_delta*eta/||R_delta*eta||`.

If `gamma` is the gap above `E`, then

`||y_delta-P*eta/||P*eta||||`
` <=delta*||(I-P)*eta||/(||P*eta||*(gamma+delta))`.

Thus a finite resolvent evaluation plus the displayed error gives an exact
finite enclosure for the mixed coefficient.  The asymptotic residual target
still requires

`|<kappa,P*eta>|^2`
` >=lambda^(-2*epsilon_lambda)*<eta,P*eta>`,
`epsilon_lambda->0`.

The diagonal mixed-overlap counterfamily has `r=0`, zero distance from the
complete ground space, and a fixed next-space gap, while
`|alpha|^(-1)` grows exponentially.  It shows that residual and gap control
do not supply this projector orientation.  Also `||eta_N||^2=2*N+1`, so
the finite normalized resolvent is not silently passed to an `l^2`
boundary vector.

The source-Cauchy selector decomposition is exact.  Every positive rank-one
even selector is a coordinate ray or the compactified direction

`w_tau=e_0^+ + sum_(n=1)^N`
` sqrt(2)*tau/(tau+n^2)*e_n^+`.

For regular finite `tau`, its unique full extension is

`H=|u><u|-tau*|v><v|`.

The complete positive even selector cone is a finite positive sum of these
rays.  Compressing a selector to `E` and lowering it selects a top
compression eigenvector; only the perturbed fixed-`N` auxiliary is thereby
simple.  The limit vector in `E` need not be simple for the original `A`.

For coordinate selectors, define

`Y=||P*kappa||`, `T=tr(P_L*P)`.

The exact frame sum gives, for some normalized coordinate selector `x_j`
when `T>0`,

`||P_L*x_j||^2/|<kappa,x_j>|^2 <=2*T/Y^2`,

`|<kappa,x_j>|^(-2) <=2*m/Y^2`.

At `T=0` the first term vanishes and the second constant is `m/Y^2`.
Therefore the sufficient multiple-ground residual inputs reduce to

`T=O(Y^2/lambda)`, `sqrt(m)/Y=lambda^o(1)`.

Neither estimate is proved for the actual source projector.  The exact
three-dimensional separation family has `Y^2=1`, `T=2`, zero residual and
projection tail, and raw anchor polynomial `y^2+y+4`.  Every cross-root
selector satisfies

`A_x/|<kappa,x>|^2 >=1/294`.

Hence allowing the entire finite positive selector cone does not remove the
projector trace/orientation residual.

For the screened harmonic decomposition, let

`S^2*v_j=vartheta_j*R0*v_j`,
`v_i^*R0*v_j=delta_(ij)`,
`r_j=S*v_j/sqrt(vartheta_j)`, `y=S^(-1)*f`.

Then

`<v_j,f>=sqrt(vartheta_j)*<r_j,y>`,

`A_M=sum_j|<r_j,y>|^2`.

This removes exactly one square-root factor.  The remaining coefficient is
the unresolved source orientation.

Under the finite invertibility and boundary hypotheses, put

`Rcal=P_(kappa,Phi)*D0^(-1)*O^(-1)`.

The source commutator gives

`I_K=Rcal*D*B+(Rcal*D*kappa)*phi_b`.

With the declared complex inner-product convention, the transported mode
uses `conj(a_j)`, and the complete combined forcing gives

`(1-gamma)*a_j=c_j`,

`1-conj(gamma)=det(Rcal*(D|_K)*B)!=0`.

The exact full-spectrum residual is therefore

`A_M=||P_L*D^*Rcal^*b||^2/|1-gamma|^2`.

For a generalized threshold `tau`, it splits as

`A_M <= ||P_(<=tau)^r*P_L*D^*Rcal^*b||^2/|1-gamma|^2`
`       +beta_0/tau`,

where `beta_0=<f,R0^(-1)f>`.  This isolates a screened low-cluster
cancellation and a complementary forcing-energy bound, but proves neither.
The exact nonzero-displacement source-Cauchy family has a simple even ground,
strict odd shifted sign, and nonzero boundary and anchor overlaps while

`A_M=121/4`, `c/(1-gamma)=11/2`.

Thus the odd primitive can cancel the small forcing scale and does not
produce a second spectral factor.

The complete source forcing remains pole minus archimedean minus prime, with
the inclusive endpoint `1<n<=lambda^2`; no separate block norm is inserted.
No actual-source mixed-projector rate, selector trace or projected-mass
rate, screened low-cluster rate, complementary energy estimate, uniform
feedback denominator, equation (5.2), or locally uniform transform limit is
proved.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.75 parity-collision and feedback-origin decomposition

Retain the source parity displacement

`D*Q_+-Q_-*D=|beta><eta|`

and put

`A=Q_+`, `B=Q_-`, `mu=min spec(A)`,
`P=P_(ker(A-mu*I))`, `F=P_(ker(B-mu*I))`.

On the regular branch `F=0`, the even bottom is simple and `P*eta!=0`.
For the canonical ground `x=P*eta/||P*eta||`, the projected prolate anchor
`kappa`, and the low transverse projector `P_L`, define

`alpha=<kappa,x>`, `Y=||P*kappa||`, `T=tr(P_L*P)`.

Then the mixed residual quantities reduce exactly to one line angle:

`|alpha|^2=Y^2`, `T<=1-Y^2`.

If a rigorous tangent majorant satisfies `tan(theta)<=tau`, then

`|alpha|^(-2)<=1+tau^2`, `T/Y^2<=tau^2`.

The remaining regular-branch residual is therefore to prove the actual-source
estimate `tau=O(lambda^(-1/2))`.  It would imply both checkpoint-0.74 rates,
but it is not currently proved.

On the visible collision branch put

`u=P*eta`, `t=<eta,P*eta>`,
`S=(B-mu*I)^dagger`, `d=D*eta`.

For `t>0`, the exact singular decomposition is

`F*beta=0`, `D^*Ran(F) subset ker(A-mu*I)`,

`D*u=F*d-t*S*beta`, `u=g+t*h`, `t=||g+t*h||^2`.

The collision image `W=Ran(D^*F)` lies inside the even ground space and
contributes the unavoidable principal-angle term

`T>=tr(P_L*P_W)=sum_j cos(phi_j)^2`.

Thus the `beta`-forced screened response `S*beta` omits the independent term
`F*d`.  A collision proof must bound this principal-angle contribution, the
mixed numerator in `u=g+t*h`, and the remainder of the projector trace.  If
`t=0`, the canonical ground and `alpha` are undefined and the branch fails
closed; an exact source-Cauchy fixture has `F*beta!=0`, so the visible formula
cannot be obtained by division through zero.

The screened feedback residual also simplifies exactly.  Under the finite
simple-ground, boundary, odd-invertibility, and source-relative-determinant
gates, let `xi` be the unit ground, `alpha=<kappa,xi>`, and set

`kappa_0=<e_0,kappa>`, `xi_0=<e_0,xi>`, `x=xi/alpha`.

The complex determinant and its conjugate give

`1-conj(gamma)=conj(kappa_0*alpha/xi_0)`,

`1-gamma=kappa_0*alpha/xi_0=kappa_0/x_0`.

Hence the feedback denominator is not a separate asymptotic residual.  The
complete adjoint transport is

`P_L*D_K^*Rcal^*b=-(kappa_0/xi_0)*P_L*xi`,

and for generalized modes with eigenvalues `theta_j`,

`sum_(theta_j<=tau)|c_j|^2/|1-gamma|^2`
` =||P_(<=tau)^r*P_L*xi||^2/|alpha|^2`,

`A_M=||P_L*xi||^2/|alpha|^2`.

The complementary forcing energy is the same projective orientation weighted
by `theta_j`.  Screening therefore serializes the alignment but supplies no
new decay.

For the actual anchor, on the admitted integer schedules
`N(lambda)/L^(7/5) -> infinity`, the origin theorem gives
`sqrt(L)*kappa_0 -> Xi(0)/(4*a_infinity)>0`.  Conditional on the unproved
`|alpha|^(-1)=lambda^o(1)`, the origin formula gives
`|1-gamma|^(-1)=lambda^o(1)`.  No actual-source parity noncollision,
collision-angle rate, `tau=O(lambda^(-1/2))` bound, overlap theorem,
projective alignment rate, equation (5.2), or locally uniform limit follows.
The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.76 spectral-cluster diagonal-selector decomposition

Let `A=A^*` be the even finite source-Cauchy block, `P` a bottom-cluster
projector, `R=I-P`, and shift the cluster bottom so that

`0<=P*A*P<=w*P`, `R*A*R>=G*R`, `G>w>=0`.

For a unit `v in Ran(P)`, suppose a real inversion-even diagonal selector
`H` satisfies

`P*H*P=|v><v|`, `||H||<=chi`, `c=||R*H*P||`.

The perturbed matrix `B=A-epsilon*H` remains finite source-Cauchy.  If
`epsilon>w` and

`Delta=G-w-epsilon*(chi-1)>0`,

then its unit lowest vector `x=y+z`, `y=P*x`, `z=R*x`, obeys

`||z||/||y||<=rho=epsilon*c/Delta`,

`||(P-|v><v|)y||/||y||<=q`

with

`q=(w+epsilon^2*c^2/Delta)/(epsilon-w)`.

Thus `sin angle(x,v)<=sqrt(rho^2+q^2)`, and the bottom is simple if the
right side squared is less than `1/2`.  Under only `c<=chi`, balancing at
`epsilon=sqrt(wG)/chi` makes the correct residual scale

`w*chi^2/G`,

not `w*chi/G`.

For the projected prolate anchor, define

`Y=||P*kappa||`, `v=P*kappa/Y`, `r=(I-P)*kappa`.

The selected-ground error has the exact decomposition

`Y*x-kappa=Y*(x-v)-r`.

At the natural cutoff `M=ceil(lambda)`, a convenient sufficient residual is

`sqrt(w*chi^2/G)+||P_M*(I-P)*kappa||=O(lambda^(-1/2))`,

together with the admitted outer prolate projection rate.  This would feed
the existing projective cross-Hurwitz bridge, but every spectral term in
this display is currently unproved for the actual source.

The diagonal realization itself is a symmetric-square range problem for
`P*diag(h)*P`.  Its cost is controlled by the positive spectrum of
`P o P`, and can be infinite or divergent.  Exact counterfamilies show that
realization can fail, that `w*chi^2/G` can diverge despite exact capture and
vanishing residual, and that exact diagonal source-Cauchy selector cost can
diverge.  Residual shells and two-vector Ritz data do not force a proper
bottom cluster, realization, or conditioning.  Full source-Cauchy selector
optimization is separate and remains incomplete.

The surviving actual-source residuals are therefore: bottom-cluster
capture, exact selector realization, a block-aware cost with
`w*chi^2/G=O(lambda^(-1))`, and low Fourier spectral leakage
`||P_M(I-P)kappa||=O(lambda^(-1/2))` on one common unbounded schedule.  No
projection-convergent strip exclusion, equation (5.2), or locally uniform
ground-transform limit follows.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 0.77 diagonal-anchor root-geometry decomposition

Let `A=Q_+` be the even block of a finite real inversion-symmetric
source-Cauchy matrix and let every displayed coordinate of the real even
anchor `kappa` be nonzero.  The unique raw shell diagonal forcing requested
eigenvalue `mu` is

`h_j=(A*kappa)_j/kappa_j-mu`.

After shifting by `mu`, this operator is independent of the scalar gauge.
Its off-diagonal source-Cauchy parameters and source commutator are
unchanged.  Define

`w_ij=-A_ij*kappa_i*kappa_j`.

Then the forced even block has the exact ground-state transform

`diag(kappa)*T_+*diag(kappa)=L_w`.

Therefore the anchor is the simple lowest even line exactly under the
strict signed-Laplacian gate

`L_w>=0`, `ker(L_w)=span(1)`.

For `N>=1`, this division-free gate itself forces all coordinates of
`kappa` to be nonzero.  If the positive-edge graph is connected, put

`R_-=W_-^(1/2)*C_-^*L_+^dagger*C_-*W_-^(1/2)`.

The negative inertia of `T_+` is the number of eigenvalues of `R_-` greater
than one, while every eigenvalue equal to one creates one additional kernel
direction.  Thus strict anchored Dirichlet positivity is equivalently
`R_-<I` under that connectedness hypothesis.  No actual-source estimate
currently proves either form on an unbounded schedule.  The original source
diagonal cancels from the forced shifted block, so admitted diagonal
coercivity does not close this sign residual.

Under the additional finite boundary and nonsingularity gates, the same
shell diagonal gives the parity factorization

`K=T_-*X`, `p_kappa(y)=c*det(y*I-X)`,

and

`det(K-y*T_-)=(-1)^N*(det(T_-)/c)*p_kappa(y)`.

If `C=K+sigma*T_->0` and
`R=C^(-1/2)*T_-*C^(-1/2)`, every raw root is real with

`y=1/r-sigma`, `r in spec(R)`.

Writing `delta=L/(4*pi)`, the exact finite-strip gate is

`(I-sigma*R)*(I+(delta^2-sigma)*R)>=0`.

This shifted-pencil inequality is sufficient, not necessary, and remains
unproved for the pinned actual-source matrices.  Exact source-Cauchy
counterfamilies with identical parity inertias put nonreal roots on opposite
sides of the physical boundary, so inertia alone supplies no height bound.

There is one non-effective actual-anchor asymptotic closure.  At the natural
cutoff `M=ceil(lambda)`, the admitted growing-order Gevrey estimates give

`sup_(|tau|<=1/2)|widehat(f_lambda)(i*tau)-Xi(i*tau)/4| -> 0`.

Since `Xi(i*tau)>0` on the closed segment, the exact raw-polynomial transform
identity implies, for all sufficiently large `lambda`,

`p_lambda(y)!=0` for `-(L/(4*pi))^2<=y<=0`.

No effective starting threshold is obtained.  This closes only the
negative-real branch, including both endpoints.  The surviving natural-
cutoff root residual is the nonreal branch

`y notin R`, `v(y)<L/(4*pi)`.

Local uniform convergence shows that an off-axis zero of `Xi` in the open
strip forces such a finite raw root eventually.  Excluding this branch is
therefore RH-strength and remains unproved; a global finite theorem also
needs horizontal-escape control.  No `DIRECT_RH_ATTACK.md` equation (5.2),
RH proof, Lambda bound, source lock, or numerical artifact follows.  The
terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.78 anchored-routing and strip-index decomposition

For the checkpoint-0.77 forced even block, put

`z=diag(kappa)*f`, `d_f=sum_i kappa_i*|f_i|^2*e_i`.

The exact anchored test is

`Omega=q(z,z)-(q(d_f,kappa)+q(kappa,d_f))/2`

and satisfies

`E_(lambda,N)(f)=Psi#(Omega)`,

`Omega=-sum_(i<j) kappa_i*kappa_j*|f_i-f_j|^2*q(e_i,e_j)`,

`Omega(0)=Omega(L)=0`.

Thus the complete pole--archimedean--minus-prime source combines into the
single cancellation-preserving normal form

`E_(lambda,N)(f)=-integral_0^L G(x)*(d/dx)(e^(-x/2)*Omega(x)) dx`,

with `G=e^x-psi_C(e^x)-log(1-e^(-2x))/2`.  The sine formulas reduce the
off-diagonal source to the weighted-Loewner graph

`w_ij=-p_i*p_j*(c_i-c_j)/(t_i-t_j)`.

These zero-origin anchored tests are not dense in the ordinary Weil-square
cone in any source-test topology where origin evaluation is continuous, and
exact source-Cauchy fixtures show that finite Weil positivity and anchored
positivity are incomparable.  No global Weil positivity assertion therefore
closes this residual.

Split the anchored graph as `L_w=B_+*B_+^*-B_-*B_-^*`.  Strict anchored
positivity forces the positive graph to be connected, and the unique
minimum-norm routing `S=B_+^dagger*B_-` obeys `B_-=B_+*S`, `S^*S=R_-`, and

`E_(lambda,N)(f)=||(I-S*S^*)^(1/2)*B_+^*f||^2`.

The strict gate is therefore exactly `||S||_op<1`, equivalently
`lambda_max(R_-)<1`, under positive-graph connectedness, with
`lambda_max(R_-)=0` by convention when there are no negative edges.
Individual strict
edge tests do not imply this collective contraction.  The first surviving
actual-source residual is consequently a collective weighted-Loewner
routing bound on one projection-convergent unbounded schedule.  A separate
core-passage route would require inverse-coordinate control of
`(A*kappa)_i/kappa_i`; a small residual norm alone does not provide it.

For the natural-cutoff raw polynomial, define

`Phi(y)=p_x(y)/D_M(y)`, `Gamma_h(t)=Phi((t+i*h)^2)`.

The exact upper-boundary winding and upward Cauchy-index convention give

`I_h=-Ind^up_(RP^1)(B_h/A_h)=2*W_h`, `Z_h=2*M-I_h`.

Separating root types yields

`2*R_-(h)+4*C_h=I_(0+)-I_h`.

This remains exact after canceling removable lattice factors, using the
polynomial loop when the secular leading coefficient vanishes, and taking
the inward index at a boundary root.  Checkpoint 0.77 supplies
`R_-(delta)=0`, with `delta=L/(4*pi)`, so the entire remaining compact
natural-cutoff nonreal residual is

`4*C_delta=I_(0+)-I_(delta-)`.

Equivalently, its necessary and sufficient finite certificate is
`I_(delta-)=I_(0+)`.

No actual-source estimate proves this equality on an unbounded schedule.
Functional symmetry gives only root quadruples, imaginary-segment
positivity closes only the negative-real branch, and absolute Gevrey
control has no boundary-relative lower bound.  Exact finite and analytic
families demonstrate both failures and permit horizontal escape.  Thus the
surviving index equality remains RH-strength.  No global finite strip
exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda bound,
source lock, numerical artifact, or locally uniform actual-ground-transform
theorem follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.79 shrinking-collar and routing-vertex decomposition

The global natural-cutoff index target can be weakened before any new
actual-source estimate is attempted.  For reduced raw polynomial
`p_x(s^2)`, positive heights `0<a<b`, and one-sided zero counts, checkpoint
0.77's closed negative-real exclusion gives the exact collar residual

`4*C_(a,b)=Z_(b-)-Z_(a+)`.

When the secular leading coefficient is nonzero this is

`4*C_(a,b)=I_(a+)-I_(b-)`;

when it vanishes, the same count is expressed by the polynomial-loop
winding.  A nonnegative index gap strictly smaller than four therefore
forces equality.  Boundary roots, multiplicities, and removable lattice
factors are included by the inward/outward conventions.

Let `epsilon_lambda->0` be explicit and

`a_lambda=epsilon_lambda*L/(2*pi)`, `delta=L/(4*pi)`.

Under the already-admitted locally uniform natural-cutoff convergence, the
eventual equality

`Z_(delta-)=Z_(a_lambda+)`

would exclude every off-axis zero of `Xi` in the open physical strip.  This
removes the unnecessary demand that finite approximants have no very-low-
height complex splitting.  It does not prove the equality and does not by
itself prevent horizontal escape.  The compact-rectangle phase alternative
removes that second finite demand but is still the limiting RH-strength
zero-location problem.

For each finite transform, let `a_0=c` in the nonzero-leading branch; in the
`c=0` branch let `a_k` be the first nonzero even secular moment.  With the
corresponding absolute next moment `B_k`, every nonlattice zero satisfies

`|Re(s)|^2<=M^2+B_k/|a_k|`.

Here `a_k` is exactly the first nonzero even endpoint jet of the finite
trigonometric state.  The surviving global horizontal-escape residual is
therefore a relative actual-source lower bound for `|a_k|/B_k`.  Existing
absolute Gevrey and compact-transform bounds do not supply it.  Exact
splitting and escaping families show that symmetry, imaginary-axis
positivity, shifted Hermite--Biehler, rank-one determinant algebra, and
absolute approximation cannot replace the missing phase or relative bound.

The metric route now has an earlier actual-source scalar checkpoint.  With

`w_ij=-p_i*p_j*(c_i-c_j)/(t_i-t_j)`, `c_n=n*b_n`,

strict anchored positivity implies every vertex degree `d_i>0` for `N>=1`.
The central degree is exactly

`d_0=(2*x_0/sqrt(L))*integral_0^L F_align(t)*(f_N(t)-x_0/sqrt(L)) dt`,

where `dF_align=-exp(-t/2)*dG_lambda` preserves the complete
pole--archimedean--minus-prime cancellation.  The Stieltjes relation is
improper at zero and is made finite by the zero-mean anchor primitive.  The
next degree requires

`b_1*x_0+2*sum_(m>=2)x_m*(b_1-m*b_m)/(1-m^2)>0`.

Neither sign follows from an absolute PNT envelope, diagonal coercivity, or
a small anchor residual.  The finite truncated displacement identity

`b_n=Re((a_n+i/2)*D_L(-1/2-i*a_n))/pi`

places the unresolved source sign on a critical-line boundary value.  A
formal replacement of `D_L` by a meromorphically continued infinite
logarithmic derivative is not a proved limit theorem and would encounter
the unknown zero divisor.

An exact unbounded combined source-Cauchy family has the admitted fixed-mode
anchor direction, arbitrarily small final displacement, a connected
positive graph, and zero forced-anchor residual, while

`d_1<0`, `liminf ||B_+^dagger*B_-||_op^2>=2`.

Thus no global magnitude bound on the final `b_n` can imply routing
contraction.  The live actual-source route must first prove the central and
alternating vertex signs, then positive-graph connectivity, and finally the
collective Gram inequality `lambda_max(R_-)<1`.  The scalar sufficient bound

`sum_(e in E_-)|w_e|*R_eff^(+)(e)<1`

is the trace of that routing Gram, but is also unproved for the actual
source.  No shrinking-collar equality, endpoint-jet relative lower bound,
signed vertex theorem, collective routing contraction, global finite strip
exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda bound,
source lock, numerical artifact, or locally uniform actual-ground-transform
theorem follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.80 verified-height collar and screw-subsequence decomposition

The limiting collar requirement can be weakened in two exact ways.  A
certified unbounded subsequence is sufficient if its physical inner heights
tend to zero, so full-schedule convergence may be replaced by a liminf-zero
condition on certified points.  Alternatively, one synchronized nested
cofinal compact exhaustion of the off-real open strip is sufficient.  Both
statements still require an actual-source integer phase certificate on a
cofinal family.

The existing pinned finite-height zero theorem gives a genuine but bounded
partial result.  Put

`H_PT=3000175332800`.

For every fixed `0<R<H_PT`, the admitted fixed-compact expansion retains the
factorization

`4*hat(f_lambda)(z)=Xi(z)*A_(lambda,R)(z)+E_(lambda,R)(z)`,

with `A_(lambda,R)-1=O_R(lambda^(-2))` and
`E_(lambda,R)=O_R(exp(-c_R*L^2))` uniformly on
`|Re(z)|<=R`, `|Im(z)|<=1/2`.  The pinned theorem puts all Xi zeros in that
rectangle on the real axis, and finite algebraic multiplicity gives

`|Xi(x+i*y)|>=b_R*|y|^(m_R)`.

Therefore every sufficiently large actual natural-cutoff anchor is
zero-free on

`|Re(z)|<=R`, `1/L<=|Im(z)|<=1/2`.

This defeats complex splitting above the `1/L` physical collar in every
separately fixed verified-height window, without assuming simple zeros.
The Platt--Trudgian computation is pinned but not independently replayed,
and the prolate/Gevrey and finite-zero constants make the starting threshold
doubly non-effective.  Since `R` does not grow, the global horizontal-escape
residual is unchanged.

The central routing residual admits a separate exact scalar reduction.  For
the scalar-deleted complete discrepancy `R(t)` and its primitive

`g(T)=integral_0^T R(t) dt`,

the one-sided transform is

`integral_0^infinity exp(-q*T)*g(T) dT`
`=-(1/q^2)*(xi_R'/xi_R)(1/2+q)`, `Re(q)>1/2`.

Writing `J_L=integral_0^L R(t)*f_lambda(t) dt`, the exact central degree is

`d_0=(2*x_0/sqrt(L))*J_L-(2*x_0^2/L)*g(L)`.

The Xi divisor cancels before the even convolution contour is moved, and
the admitted all-order prolate expansion then gives

`J_L=O_A(lambda^(-A))` for every fixed `A>0`.

Thus the first non-flat central sign is the sign of `-g(L)`.  An
unconditional case split proves that there are strict half-integers
`lambda_j=p_j/2->infinity`, `p_j` odd, such that

`-g(2*log(lambda_j))>1/(2*T_*^2)`, `T_*=30610046000`,

and hence `d_0(lambda_j)>0` eventually.  In the RH branch this follows from
the locked zero count and the nonnegative critical-line zero sum; in the
non-RH branch an eventual upper bound for `-g` contradicts the
eventual-nonnegative Laplace barrier.  This proves only an existential
central-vertex subsequence, not a common full-graph schedule.

The pointwise sign `g(T)<=0` for every positive `T` remains the global
scalar barrier and is RH-equivalent in the explicitly unadmitted Suzuki
context.  The exact vertex-1 companion identity contains an uncontrolled
low-frequency difference and collective term.  Consequently no vertex-1
sign, all-vertex sign, positive-graph connectivity, or collective routing
contraction follows from the central subsequence.

The surviving analytic residual is therefore still cofinal: prove a
growing-window collar phase certificate, or prove the full graph gate on one
common unbounded actual-source schedule.  No global finite strip exclusion,
`DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda bound, new source
lock, numerical artifact, or locally uniform actual-ground-transform
theorem follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.81 resonant, collective, and full-forcing decomposition

The checkpoint-0.80 central subsequence does not automatically extend to
vertex 1.  With `omega=2*pi/L`, `Psi=-g`, and the exact resonant trigonometric
profile `W_(1,L)`, the complete error is

`E_1=sqrt(L)*J_L+omega*integral_0^L Psi(t)*W_(1,L)(t)dt`,

`d_1=(2*p_1^2/L)*Psi(L)+(2*p_1/L)*E_1`.

The first term in `E_1` is flat relative to the fixed checkpoint-0.80 screw
margin.  The second is a full-history signed moment and remains uncontrolled.
The resonant Green operation sends a formal correction
`hat(H)=P(z^2)*Xi(z)` to the divided difference

`omega^2*sqrt(L)*(hat(H)(z)-hat(H)(omega))/(z^2-omega^2)`,

which generally does not retain the `Xi` divisor.  Therefore the exact
remaining vertex-1 residual is

`omega*integral_0^L Psi(t)*W_(1,L)(t)dt`
`=o(|p_1|*Psi(L))`

or the corresponding one-sided degree inequality.  A smooth synthetic
two-harmonic discrepancy has a fixed positive margin and `J_L=0` but
`d_1<0`, so the endpoint scalar and central cancellation do not imply this
moment bound.

At the collective level, every edge and degree admit exact screw-moment
normal forms, and

`L_w=(2*Psi/L)*(p*p^T-P*diag(p))+L_Delta`,

where `P=sum p_n` and `Delta_n=A_n-g`.  The ideal `P=0`, `Delta=0` scalar
graph is rank one.  Its positive graph is connected under the alternating
sign pattern, but its minimum-norm routing norm is exactly one.  The strict
transverse residual is entirely in `L_Delta` and the endpoint trace.  An
exact smooth synthetic profile can keep `Psi(L)>0`, `J_L=0`, and positive
connectivity while making `d_1<0` and the routing norm arbitrarily large.
The RH-conditional estimate `A_n-g=O_n(L^(-1))` at each fixed `n` does not
control the moving tail through `N=ceil(lambda)`.

Allowing arbitrary source-Cauchy forcing does not remove the root residual.
The linear anchor eigenline equation is always soluble, but a simple lowest
even realization is feasible exactly when

`K in S_N`, `K*kappa=0`, `K>=P_(kappa^perp)`.

The positive annihilating face is generated by selector rays at the distinct
real projective roots of the homogeneous raw anchor polynomial, and its
maximal rank equals the number of those roots.  Hence the SDP is feasible
exactly when all `N` projective roots are real and distinct.  If the source
commutator must be preserved, the perturbation displacement is zero and the
freedom collapses to raw diagonal forcing.  Thus full forcing either returns
to the signed-Laplacian gate or assumes the strict real-root conclusion it
was meant to force.

The remaining actual-source residuals are unchanged in scope: the resonant
vertex-1 moment, the growing collective `L_Delta` operator, positive
connectivity, strict routing, and `N` distinct real projective roots are all
unproved on a common projection-convergent unbounded schedule.  No cofinal
collar equality, global finite strip exclusion, `DIRECT_RH_ATTACK.md`
equation (5.2), RH proof, Lambda bound, source lock, numerical artifact, or
locally uniform actual-ground-transform theorem follows.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.82 zero-Gram and adaptive-hyperbolicity decomposition

The complete scalar-deleted discrepancy has an unconditional centered-zero
expansion.  Under RH its cosine moments give a positive feature Gram `G`,
but the anchored graph is not `G`; it is exactly

`L_w=G-diag(G*1)`.

The row-sum vector is the weighted evaluation residual of the finite
projected anchor at the `Xi` zeros.  On the RH branch of the favorable
strict-half-integer subsequence this structure controls every separately
fixed finite set of history moments, proving `d_0,...,d_K>0` and
`d_k/d_0 -> 4`.  The leading normalized fixed principal block is rank one,
so no higher routing minor follows.  Off RH the same selection is proved
only under an isolated-rightmost-zero-line hypothesis; scalar Landau
unboundedness alone does not vectorize.

The fixed-`lambda` outer-cutoff limit supplies another one-way reduction.
The quotients `p_(lambda,N)/D_N` converge locally uniformly off the squared
lattice to the full compact-support quotient.  Hence cofinal real-rootedness
of the prescribed numerators forces the square-variable compact transform
into the Laguerre--Polya class.  Compact convergence does not prevent
nonreal pairs from escaping through projective infinity.  More sharply, an
exact LP indicator has nonhyperbolic sections for every `N=4*r-1` and
`N=4*r`.  Since the complementary branches remain unclassified, this
refutes eventual hyperbolicity as an LP consequence without excluding a
specially selected good cofinal subsequence.

On the moving `n=O(L)` scale, the RH-conditional sharp Gram kernel is
weighted by `1-cos(gamma*L)` and has no single continuum limit.  Its Cesaro
phase average is the Xi Christoffel--Darboux kernel, whose positivity has RH
strength.  The finite Laplacian still subtracts the complete moving row-sum
defect and endpoint trace, so the average cannot replace the source kernel.

For a finite Gram factorization `G=V*V^T`, write `u=1/sqrt(d)*1`,
`P=I-u*u^T`, `alpha=u^T*G*u`, `b=P*G*u`, and
`C=P*G*P|_(1^perp)`.  The exact remaining condition is

`C-alpha*I-sqrt(d)*P*diag(b)*P >= 0` on `1^perp`.

The scalar residual is only `eta=||V^T*1||`, with `alpha=eta^2/d`.
An exact divisor `eta=0` closes the defect, but absolute smallness of `eta`
does not control the transverse floor or diagonal orientation.  A full-rank
three-vertex family makes `eta` arbitrarily small while retaining positive
degrees and connected positive edges, yet its Laplacian is indefinite.

The surviving actual-source residual is therefore a relative, deflated
transverse-frame/orientation theorem for the complete moving zero-feature
matrix, or an equivalent source-specific no-escape/hyperbolicity theorem.
No unconditional fixed-vertex vector selection, positive connectivity,
contractive routing, eventual or cofinal actual-source hyperbolicity,
cofinal collar equality, global finite strip exclusion,
`DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda bound, source lock,
numerical artifact, or locally uniform actual-ground-transform theorem
follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.83 attained-edge and deflated-frame decomposition

For the non-RH centered-zero branch, let `B=sup Re(alpha)>0`.  If some zero
attains `B`, absolute Hadamard summability gives, without a lower-line gap,

`exp(-B*T)*Psi(T)=H_B(T)+o(1)`.

The nonzero uniformly almost-periodic edge sum has recurrent positive peaks.
After strict-half-integer grid transfer, the exact history residual obeys
`M_k=O_k(exp(B*L)/L)` for every fixed mode.  This proves simultaneous
positivity of every fixed vertex prefix and `d_k/d_0 -> 4` for `1<=k<=K` on
one unbounded grid sequence.  If the edge is not attained, only the absolute
escape
`A_3/A_2 -> 0` is automatic.  The surviving scalar residual is the signed
peak comparison `A_3=o(sqrt(L)*Psi)` or a sharper cancellation-sensitive
substitute.  Exact Fejer blocks show that generic strip, count, symmetry, and
Hadamard coefficient data do not imply it.

On the RH branch, write the actual positive-zero feature rows as

`T_(gamma,n)=r_gamma*p_n/(a_n^2-gamma^2)`.

For `N` selected rows, the deflated determinant is an exact Cauchy product
times the anchor orientation `Theta_Gamma`; the complete transverse
determinant is the sum of the squared minors.  For `N+1` rows, removing the
near-null all-ones column gives

`eta_Lambda^2*det(B_Lambda^T*B_Lambda)>=d*|det(T_Lambda)|^2`.

The determinant identities are finite algebra for arbitrary real ordinate
sets.  Their application to actual zeta-zero feature rows is conditional on
RH.

At full nonresonance the qualitative transverse kernel consists exactly of
zero-anchor-coordinate vectors with zero coordinate sum.  This gives finite
rank when at most one coordinate vanishes, but no relative lower floor.
Strict graph positivity requires no vanishing coordinate, and the square
determinant still contains the uncontrolled product of anchor coordinates.

For the explicit LP indicator fixture, the odd-mode reciprocal-root moments
satisfy `S_2*S_4-S_3^2<-13/(4000*(2*M+1)^6)` for every odd `M>=3`.  Combined
with the prior even-`M` obstruction, every prescribed section `N>=3` is
nonhyperbolic.  This closes only the fixture's good-cofinal loophole and does
not resolve actual-source adaptive hyperbolicity.

The surviving actual-source residuals are the nonattained-edge signed peak
problem, a quantitative relative deflated zero frame and diagonal orientation,
positive connectivity, strict routing, and actual-prolate no-escape or
hyperbolicity on one projection-convergent unbounded schedule.  No global
finite strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda
bound, source lock, numerical artifact, or locally uniform actual-ground-
transform theorem follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.84 filtered-history decomposition

The complete-source history has an exact prime-side signed Riesz form, and
natural-cutoff localization sharpens the generic derivative estimate to

`||S_(k,L)''||_1=O_k(L^(-3/2))`.

Thus `A_3+1=o(L*Psi)` is sufficient in the nonattained branch.  PNT
magnitude, positive jumps, short-interval mass, and a generic RMS comparison
do not prove it.  The positive-measure and global RMS counterconfigurations
are synthetic; ordered commensurate Fejer blocks are separately shown not to
defeat the sharper `A_3/L` scale.

At actual centered zeros, the finite-anchor Xi divisor makes the high-edge
history obey

`|M_k^(>=b)|<=C_(k,b)|p_k|L^(-2)A_(4,b)+O(exp(-d_bL^2))`.

Low-edge zeros are negligible on a strengthened Landau grid sequence.  The
same-sequence comparison `A_(4,b)=o(L^2*Psi)` would close every fixed prefix,
but it remains unproved for the actual zeros.  A simple-zero Gaussian-packet
multiset satisfies the order-level count and summability inputs while
globally reversing that comparison; it is not the zeta-zero set and does not
instantiate a sharp numerical HSW bound.

Keeping the explicit history terms signed produces

`Phi_(k,L)=(I-q*T_q)^2`,  `q=(2*pi*k/L)^2`,

with multiplier `alpha^4/(alpha^2+q)^2` and a sign-changing causal kernel.
The exact zero-edge envelope makes negative-lobe separation work for every
nonattained `B>0` and fixed `K`, giving one grid sequence with
`d_0,...,d_K>0`.  Diagonal extraction gives some unquantified `K_j->infinity`;
checkpoint 0.83 supplies the attained-edge branch.  Thus every RH-false
right-edge case has an existential growing positive-degree prefix.  There is
no rate, no `K_j` versus `N(L_j)` comparison, and no all-vertex, ratio,
Laplacian, connectivity, or routing conclusion.  Direct filtered Landau also
gives each fixed `d_k>0` on its own sequence, but that scalar proof alone does
not synchronize `d_0`.

The surviving actual-source residual is therefore a quantitative passage
from the unquantified prefix to the full natural section, followed by positive
connectivity and strict collective routing.  No global finite strip
exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda bound,
source lock, numerical artifact, or locally uniform actual-ground-transform
theorem follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.85 Laplacian-covariance decomposition

The checkpoint-0.84 growing positive-degree prefix controls only diagonal
entries of the signed Laplacian.  Exact synthetic source-Cauchy fixtures show
that positive degrees need not give positive connectivity, and that even all
degrees positive together with connected positive edges, fixed-mode prolate
limits, and arbitrarily small displacement need not give a positive first
minor or contractive routing.  In the growing fixture,

`det L_w[{0,1}]=-(2/3)*epsilon*(q+epsilon)<0`,

even while `d_1/d_0->4` and `w_(01)/d_0->2`.  These are generic no-go
fixtures, not the actual source.

For the actual nonattained record sequence, write

`U=(I-q*T_q)Psi`,  `Y=(I-q*T_q)^2 Psi`.

Then

`d_0=(2*p_0^2/L)*(Psi+rho_0)`,

`d_1=(2*p_1^2/L)*(Y+rho_1)`,

`w_(01)=-(2*p_0*p_1/L)*U`,

and the first determinant has the exact normalization

`L^2*(d_0*d_1-w_(01)^2)/(4*p_0^2*p_1^2)
 =(Psi+rho_0)*(Y+rho_1)-U^2`.

The rank-one leading term cancels:

`Psi*Y-U^2=q^2*{Psi*(T_q^2 Psi)-(T_q Psi)^2}`.

The complete residual
`Psi*rho_1+Y*rho_0+rho_0*rho_1` is `o(q^2*P_n^2)` after the allowed record
refinement.  Thus the first unresolved actual-source scalar matrix gate is a
strict signed Turan covariance margin on that same sequence.  Endpoint and
degree positivity do not prove it.

For a fixed positive-vertex set `J`, exact elimination of vertex `0` gives

`S_J=Q_J*Sigma_J/Psi*Q_J+diag(rho_i)
 +rho_0*U_J*U_J^T/{Psi*(Psi+rho_0)}`,

with

`Sigma_(ij)=Psi*(T_i*T_j Psi)-(T_i Psi)*(T_j Psi)`.

On the nonattained record extraction,

`S_J=Q_J*Sigma_J/Psi*Q_J+o_K(L^(-4)*Psi)`

entrywise.  Under RH, `Sigma` is a positive-weight real-node covariance, but
that sign is unavailable in the RH-false branch and gives no strict residual-
dominating margin.  One off-axis conjugate pair contributes a negative-
semidefinite rank-one sector, so conjugation symmetry alone does not close
the gate.

The same nonattained record sequence does synchronize all fixed-prefix edge
signs.  Every cross-filter `Z_(ij)=(F_i*F_j Psi)(L_n)` is positive and
`D_(ij)=-Z_(ij)`, hence `w_(ij)>0` exactly for opposite parity.  The fixed-
prefix positive graph is complete bipartite and connected; diagonal
extraction gives an unquantified growing connected prefix.  The remaining
negative same-parity load is not controlled in the positive-graph effective-
resistance metric.

In the attained branch, a unique actual edge orbit forces a negative first
minor on a favorable recurrent strict-grid sequence even though
`d_0,d_1,w_(01)>0`.  The same conditional conclusion holds for a finite
attained edge whose frequency hull contains the global antipode, equivalently
whose integer ordinate relations all have even coefficient sum.  Rational
independence is sufficient.  These results require unproved actual-zero edge
geometries.  Finite no-antipode phase locking and a countably infinite edge
remain open; no arbitrary-finite-edge conclusion is admitted.

The surviving actual-source residual is a quantitative positive covariance/
Schur-pivot or equivalent signed effective-resistance inequality on a common
projection-convergent schedule, together with a quantitative passage from the
unbounded prefix to the full natural section.  No all-vertex Laplacian PSD,
routing contraction, global finite strip exclusion, `DIRECT_RH_ATTACK.md`
equation (5.2), RH proof, Lambda bound, source lock, numerical artifact, or
locally uniform actual-ground-transform theorem follows.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.86 attained-edge phase criteria

For a countably attained right edge, write

`b_j=(B+i*gamma_j)^(-2)`,  `sum_j r_j*|b_j|<infinity`,

and let `P,V,W` be the coefficient powers one, two, and three on the
countable frequency hull.  The three series converge uniformly, as does

`C=P*W-V^2`.

Truncation plus Haar character orthogonality gives

`int_K C=-4*sum_j r_j^2*|b_j|^2*(Im b_j)^2<0`.

If the global antipode lies in `K` and the zero set of `P` has empty interior,
the open negative-covariance set contains a point with `P!=0`, and the
antipode selects `P>0`.  Joint rational independence proves these hypotheses
by giving `K=T^N`; alternatively, a finite truncation certifies a phase when
its margins dominate

`tau_m(N)=2*sum_(j>N) r_j*|b_j|^m`

and

`E_N=tau_1*S_3+S_1*tau_3+2*S_2*tau_2`.

The finite-tail route still uses the global antipode to select the positive
sign of `P`; it replaces only the empty-interior hypothesis.

Positive-semiorbit recurrence and finite-head/tail grid transfer then put the
phase on an unbounded strict natural-grid sequence without a frequency-
weighted moment.  The checkpoint-0.84 residual remains negligible relative
to the negative Turan scale, so the locked actual first minor is negative
with `d_0,d_1,w_(01)>0`, conditional on the stated edge geometry.  Bare `l1`
summability does not exclude a locally flat dependent hull.

For a finite edge, the antipode is not necessary.  Any of the following is
sufficient for the same favorable leading phase: a boundary point with
`P=0,V!=0`; strict domination of the cross coefficients in the exact
self/cross decomposition of `C`; or a squarefree Laurent `P` whose regular
torus sign boundary is Zariski dense in its complex hypersurface.  An exact
nonantipodal `B=1` fixture verifies the phase algebra but is not actual zeta
geometry.  No criterion is proved for every finite phase-locked edge.

Thus checkpoint 0.86 narrows but does not close either universal attained-
edge branch.  No arbitrary finite- or countable-edge obstruction, all-vertex
Laplacian PSD, routing contraction, global finite strip exclusion,
`DIRECT_RH_ATTACK.md` equation (5.2), RH proof, Lambda bound, source lock,
numerical artifact, or locally uniform actual-ground-transform theorem
follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.87 two-frequency phase transversality

For two commensurable finite-edge frequencies `p*omega<q*omega`, write

`P/r_p=A_p+R*A_q`,  `V/r_p=Q_p+R*Q_q`,  `R=r_q/r_p>0`.

A common zero must annihilate

`D=A_p*Q_q-A_q*Q_p`.

The frequency-`p+q` coefficient is
`b_p*b_q*(b_q-b_p)!=0`, so `D` has degree `p+q`.  The positive common-zero
candidate set `E_(p,q)(B,omega)` therefore has at most `2*(p+q)` elements.
Outside `E`, a sign-changing zero of `P` has `V!=0`; since `C=-V^2` on
`P=0`, a nearby positive side gives `P>0,C<0`.

Membership in `E` is necessary for failure but is not failure.  For
`p:q=1:2`, `E` is nonempty for some parameters, yet the normalized degree-
four self-inversive polynomials for `P` and `V` cannot share every sign-
changing root.  If they shared a unit-root quadratic, exact elimination gives

`eta=|H|=3*sqrt((x^2+4)/(9*x^2+4)) in (1,3)`

and the remaining self-inversive quadratic has real parameter `ell` with

`|ell|<=2/sqrt(1+eta)<sqrt(2)<2`.

Its two additional distinct unit roots are sign-changing.  Failure would
make all four roots common, forcing the quartics proportional and requiring
`b_1=b_2`, a contradiction.  Thus every positive `1:2` weight ratio has a
favorable phase without an antipode, even though its common-zero candidate
set may be nonempty.

Combined with the frozen recurrence and checkpoint-0.84 residual, this gives
a negative actual first minor with `d_0,d_1,w_(01)>0` only if a finite attained
actual edge with exactly two conjugate `1:2` orbits is separately proved.
For other mixed-parity primitive `p:q` pairs, which ratios in `E` actually
fail, if any, remains unknown.  Three-or-more-orbit phase locking, arbitrary
finite or countable edges, all-vertex Laplacian PSD, routing contraction,
global finite strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH,
Lambda bounds, new source locks, numerical artifacts, and locally uniform
actual-ground-transform theorems remain unresolved.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 0.88 short-gap and resultant transversality

For a two-frequency commensurable hull `p<q`, multiply the leading functions
`P,V` by `z^q` to obtain self-inversive polynomial lifts `F,G`.  An exact
denominator-free Bezout combination is a nonzero polynomial of degree
`2*(q-p)`, so

`deg gcd(F,G)<=2*(q-p)`.

Independently, the distinct-sign Sturm--Hurwitz lemma forces `P` to have at
least `2*p` distinct sign-changing zeros, even when odd roots are repeated.
Failure would make each such boundary a common zero of `P,V`.  This
contradicts the common-root budget when `q<2*p`.  Primitive reduction and the
frozen exact `1:2` boundary theorem add the equality case, proving a phase
with

`P>0,  C=P*W-V^2<0`

for every positive two-orbit weight vector whenever `q<=2*p`.  The primitive
`2:3` case therefore needs no antipode.  For `q>2*p` the root counts do not
close; the finite `1:4` elimination remains open.

For any fixed finite one-dimensional commensurable support, lift `P,V` to
degree-`2*n` polynomials and form their Sylvester resultant `R(r)`.  A
single-mode boundary specialization proves `R` is not the zero polynomial.
Every failure vector has a common sign boundary and hence satisfies `R=0`.
Thus failure is contained in a proper real-algebraic hypersurface of positive
weight space, and favorable weights contain an open dense full-measure set.
The resultant-zero set can be nonempty and is not a failure set: exceptional
real weights and prescribed positive integer multiplicities remain
unclassified.  Exact favorable `m=3` fixtures and floating diagnostics found
no failure but do not exclude one.

The frozen recurrence and checkpoint-0.84 residual give a negative actual
first minor with `d_0,d_1,w_(01)>0` only if a finite attained actual edge with
the stated commensurable geometry is separately proved.  No such geometry,
arbitrary finite or countable edge, all-vertex Laplacian PSD, routing
contraction, global strip exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH,
Lambda bound, source lock, numerical artifact, or locally uniform actual-
ground-transform theorem follows.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 0.89 common-root lift and `1:4` transversality

For a primitive two-frequency hull `p<q`, the exact lift analysis bounds the
number of distinct common phase roots of `P,V` by

`2*gcd(q-p,2*p)`.

The bound includes the degenerate lift branch.  If the primitive pair has
opposite parity and `p>=2`, it is at most two, while `P` has at least `2*p`
distinct sign-changing roots.  Hence some sign boundary has `V!=0`, and
continuity from `C=-V^2<0` at that boundary gives a phase with
`P>0,C<0`.  If the primitive pair has the same parity, both frequencies are
odd and the frozen hull antipode supplies the favorable sign.  Thus all
primitive pairs with `p>=2` are favorable, leaving only `p=1` and even `q`.

For `1:4`, common roots reduce exactly to a quadratic divisibility condition.
A bounded CRT reconstruction of the Sylvester resultants, certified
characteristic-zero divisions and gcds, Sturm isolators, exact sign fixtures,
and separate repeated-root and multiplier-degenerate checks prove that no
positive parameter branch can share every sign-changing boundary.  Therefore
every `B,omega,r_1,r_4>0` has a phase with

`P>0,  C=P*W-V^2<0`.

The frozen primitive `1:2` theorem and this exact `1:4` elimination leave only
primitive `1:q` with even `q>=6` open in the two-frequency family.  The
frozen recurrence and checkpoint-0.84 residual give a negative actual first
minor with `d_0,d_1,w_(01)>0` only if a finite attained actual edge with the
stated exact two-orbit geometry is separately proved.  No such geometry,
arbitrary finite or countable edge, universal three-or-more-orbit theorem,
all-vertex Laplacian PSD, routing contraction, global strip exclusion,
`DIRECT_RH_ATTACK.md` equation (5.2), RH, Lambda bound, source lock, numerical
artifact, or locally uniform actual-ground-transform theorem follows.  The
terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.90 universal two-orbit phase synchronization

For the remaining primitive family `p=1`, even `q>=4`, failure would force
exactly two shared sign boundaries of `P,V`.  Centering them gives
`c*D*A=D*(a*A)` and a reciprocal parameter satisfying

`h+1/h=q+1/q+((q^2-1)^2/(4*q))*x^2`.

The small branch `0<h<1` has the wrong signs at the two boundary midpoints.
On `h>1`, cyclic variation diminution for the periodic first-order resolvent,
shared-zero multiplicity, and convexity force opposite nodal orientations.
For `x<=1` the pencil instead gives the wrong orientation; for `x>1` it gives
strict high-harmonic dominance and at least `2*q` sign boundaries.  Both
possibilities contradict failure.  Therefore every positive even-`1:q`
weight vector has a phase with

`P>0,  C=P*W-V^2<0`.

Together with the frozen primitive reduction, common-root, odd-antipode, and
`1:2` theorems, every rational two-frequency hull is favorable.  An
irrational frequency ratio has the full two-torus hull and hence the frozen
global antipode.  Thus every abstract two-orbit hull is favorable.

If the actual right edge were separately proved to be attained and to consist
of exactly two conjugate orbits, the frozen recurrence and checkpoint-0.84
residual would now conditionally give a negative actual first minor with
`d_0,d_1,w_(01)>0` for any frequency ratio.  That exact-two-orbit edge
geometry is not proved.  Supports with at least three phase-locked orbits,
arbitrary finite or countable attained edges, full natural-cutoff positive
sections, all-vertex Laplacian PSD, routing contraction, global strip
exclusion, `DIRECT_RH_ATTACK.md` equation (5.2), RH, Lambda bounds, source
locks, numerical artifacts, and locally uniform actual-ground-transform
theorems remain unresolved.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.91 low forcing and full-metric barriers

For the declared label-8/rest physical low range, retain the split-block
metric `Delta_L` and the positive paired-zero sampling compression `G_L`.
The frozen sampling and synthesis estimates give

`Gamma_L=||Delta_L^(-1) G_L Delta_L^(-1)||
 =O(lambda^3 P(lambda)/d_8)`.

Together with the complete radical remainder `epsilon_lambda=o(d_6)` and
`d_8/d_6~(32*pi^2/7)*lambda^4`, the exact positive forcing inequality yields

`||Delta_L^(-1)c_L||
 =o(lambda^(-1/2) P(lambda)^(1/2))`.

This conclusion is unconditional only for the positive-sampling forcing
factor.  Passing from it to `||B_L^(-1)c_L||` requires the still-unproved
uniform signed reserve

`||Delta_L^(-1)(B_L-Delta_L)||<=rho_0<1`,

and identifying that solve with a component of the full signed inverse also
requires the declared low range to reduce the full operator.  Neither fact is
supplied by the sampling theorem.

Two exact barriers prevent promotion from marginal data.  Positive full
source Grams with fixed diagonal blocks can make the full quotient action
grow like `delta^(-2)`, and signed `2 x 2` matrices with fixed positive low
and high diagonal compressions can make the inverse action grow like
`delta^(-1)` or become indefinite through their coupling.  Independently,
two positive negative-block matrices with identical
`R_KK=R_HH=V_H=rho=3/5<g` have anisotropic Schur values `2/5` and `-1/2`.
Thus condition (7.8) cannot be decided from the diagonal marginals.

Adaptive all-even prefixes do eliminate the physical high complement at
each prescribed finite cutoff, but they provide no effective last label and
no signed reserve.  With the high complement zero, the shorted matrix is the
original signed low matrix, while the exact source-coordinate action identity
only rewrites the solve.  A strict-sector full-span model with `T=1` shows
that neither an action rate nor equation (5.2) follows.

No actual residual action, signed sector floor, full-metric comparison,
locally uniform determinant limit, equation (5.2), RH, or Lambda bound is
proved.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.92 transported signed-kernel and action-transfer barriers

On the combined label-8/rest low range, let
`A=W_L*D_bd^(-1/2)`, `P_0=A^dagger*A`, and
`E_L=A^*B_L*A-P_0`.  The quotient identities give the exact transport

`Delta_L^(-1)(B_L-Delta_L)=A*E_L*A^dagger`.

Thus the missing uniform reserve is the full transported source-defect bound
`||A*E_L*A^dagger||<=rho_0<1`, including every label-8/rest cross entry.  The
identity survives a source kernel.  The cancellation-preserving Chebyshev
rewrite expresses each entry through the complete signed correlation
derivative before any absolute value is taken.  The positive sampling theorem
instead controls an `S^*S` Gram and does not estimate this phase-sensitive
kernel.

The frozen P3 data supply finite moments for `delta_*(s)=e^(-s)G(s)`.  Those
moments and endpoint cancellation alone impose no sign or magnitude on the
signed entry: after subtracting the `e^(-s)` projection from `delta_*`, an
explicit endpoint-zero formal correlation realizes any prescribed finite
Hermitian matrix.  This is only a formal matrix-correlation no-go, not an
actual prolate--Weil source realization.

The exact family

`B_delta=[[1,1-delta],[1-delta,1]],  delta=f^2`,

with `Delta_L=G_L=I` and `c_f=f*(1,-1)` saturates the positive forcing
inequality.  Its forcing norm is `sqrt(2)*f`, while its signed action is
`sqrt(2)/f`; every member has `rho_L=1-f^2<1`, but no uniform reserve.  Hence
shrinking positive forcing and pointwise invertibility do not imply signed
action decay.

More generally, `B>=mu*Delta>0` yields the lossless energy estimate

`||B^(-1)c||_Delta<=mu^(-1)||Delta^(-1)c||_Delta`,

but Euclidean transfer incurs the physical orientation factor.  The exact
quotient-compatible family

`Delta=diag(M^(-2),1)`,
`B=[[2*M^(-2),M^(-1)],[M^(-1),2]]`

satisfies `Delta<=B<=3*Delta` and fixed positive-sampling constants equal to
one, yet `B^(-1)*(a*e_2)=(a/3)*(-M,2)`.  Choosing `a=M^(-1)` gives shrinking
forcing and nonzero limiting action; choosing `a=lambda^(-1), M=lambda^2`
gives divergent action.  No scalar rescaling is left-close for
`M>2+sqrt(3)`, and rescaling cannot improve the dominating-action estimate.

Inserting the proved low-block constants into that one-sided theorem yields
only

`||B_L^(-1)c_L||=o(mu_lambda^(-1)*lambda^(1/2)*P(lambda)^(1/2))`.

A uniform `mu_lambda` therefore loses one full factor `lambda` relative to
the checkpoint-0.91 forcing rate.  A new orientation theorem--such as a
growing relative floor, commutation/reduction, restricted action on the
sampling-generated range, or a source-aligned envelope bound--is required.
No actual action, uniform reserve, signed floor, reducing property, equation
(5.2), RH conclusion, or Lambda bound follows.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 0.93 fixed label-eight arithmetic synthesis gain

For the normalized prolate operator `A_epsilon=H+epsilon*V`, direct Hermite
coupling at label 8 gives

`mu_8=-147/4`,
`u_8=(sqrt(105)/(16*pi))*h_4-(3*sqrt(330)/(32*pi))*h_12`.

The resulting moving-domain quasimode has `L2` and origin-value remainder
`O(lambda^(-4))`.  With the exact finite Fourier integral relation this gives

`rho_8=-sqrt(70)/16+(3*sqrt(70)/(64*pi))*lambda^(-2)
       +O(lambda^(-4))`.

The corrected label-4 and label-8 source functions and their first
corrections are Fourier invariant, have zero value and zero integral, and
their arithmetic images decay rapidly at both logarithmic ends.  Arithmetic
transfer plus the locked exponential log-Fourier projection proves

`p_j=K_j+lambda^(-2)*K_(j,1)+O_L2(lambda^(-3)),  j=4,8`.

Their positive Mellin transforms obey

`Q_8(s)=(sqrt(105)/210)*(2*s^2-2*s+23)*Q_4(s)`.

The nonconstant factor proves exact noncollinearity of `K_4,K_8`.  Hence the
anchor-deflated column tends to a nonzero `W_infinity`, its source metric
satisfies `D_8/d_8->1`, and

`d_8*M_8 -> ||W_infinity||^2 > 0`.

Thus `M_8=Theta(1/d_8)`.  Keeping the existing rest block and all sampling
cross terms gives

`Gamma_L=O(lambda*P(lambda)/d_8)`

and the unconditional positive forcing improvement

`||Delta_L^(-1)c_L||=o(lambda^(-3/2)*P(lambda)^(1/2))`.

A uniform left-close reserve would conditionally transfer the same scale.
Under the distinct unproved one-sided floor
`B_L>=mu_lambda*Delta_L`, the current dominating-action theorem instead gives

`||B_L^(-1)c_L||
 =o(mu_lambda^(-1)*lambda^(-1/2)*P(lambda)^(1/2))`.

No signed reserve, one-sided floor, reducing theorem, physical high-complement
comparison, odd-sector floor, equation (5.2), RH conclusion, or Lambda bound
is proved.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.94 fixed label-six odd arithmetic synthesis gain

Choose every Hermite function in the residue class `n=2 mod 4` positive at
the origin.  Direct coupling for the normalized prolate operator gives

`mu_2=-15/4`,
`u_2=-(3*sqrt(10)/(32*pi))*h_6`,

`mu_6=-87/4`,
`u_6=(3*sqrt(10)/(32*pi))*h_2
     -(3*sqrt(35)/(16*pi))*h_10`.

The resulting label-2/6 moving-domain quasimodes have `L2` and origin-value
remainder `O(lambda^(-4))`.  The exact odd zero-integral source satisfies

`a_6=I_6/I_2=sqrt(10)/4-(3*sqrt(10)/(32*pi))*lambda^(-2)
     +O(lambda^(-4))`,

and arithmetic transfer through the inversion-odd exponential projection
gives

`p_6=K_6+lambda^(-2)*K_(6,1)+O_L2(lambda^(-3))`.

Its positive Mellin transform and logarithmic arithmetic limit obey

`Q_6(s)=((2*s-1)/sqrt(30))*Q_4(s)`,
`K_6=-(2/sqrt(30))*K_4'`.

Hence `K_6` is nonzero, `D_6/d_6->1`, and

`d_6*M_6 -> ||K_6||^2=(2/15)*||K_4'||^2 > 0`.

For the declared block-diagonal odd quotient, the rest synthesis satisfies
`M_R=O(lambda^(-3)/d_6)`.  Therefore

`d_6*||Delta_-^(-1)|| -> ||K_6||^2`,
`lambda_min(Delta_-)/d_6 -> ||K_6||^(-2)`,
`Gamma_-(Delta_-)=O(lambda*P(lambda)/d_6)`.

These are positive metric and sampling conclusions.  The residual forcing is
inversion even, so no odd residual-action statement follows.  The proved
`U_0=o(d_6)` and `||A_-||^2=O(1/d_6)` give only

`(U_0)_+*||A_-||^2=o(1)`,

so a hypothetical uniform unshifted odd quotient floor would survive the
shift.  No such unshifted or shifted floor is proved.  The block metric is not
the full exterior source Gram; physical coframe, high-complement, signed
cross, reduction, full-metric control, polynomial-cutoff transfer, odd
forcing/action, equation (5.2), RH, and every Lambda bound remain open.  The
terminal state remains `P0_INVALIDATED`.

## Checkpoint 0.95 growing-rest signed radical-tail Schur reduction

For the actual split label-8/rest synthesis, put

`A=W*D^(-1/2)`,  `P_0=1_(ker A)^perp`,
`Delta=(A*A^*)^dagger|_(ran A)`,
`B=P_K*(Q-U*I)*P_K`.

The minimum-energy quotient identity gives, with no injectivity hypothesis,

`B>=mu*Delta  iff  A^*B*A-mu*P_0>=0`.

The physical Gram reconstructs the source support projection exactly:

`P_0=1_(0,infinity)(D^(-1/2)*W^*W*D^(-1/2))`.

Anchor deflation and the invisible origin correction are linear.  Hence the
actual corrected columns admit one linear global radical synthesis, and the
combined exterior remainders `R` satisfy the polarized identity

`Sigma=W_Z(R,R)=W^*Q*W`.

Congruence by `D^(1/2)` proves that the physical floor is equivalent to

`Sigma-U*G>=mu*D^(1/2)*P_0*D^(1/2)`,  `G=W^*W`.

With `P_0=[[pi,eta^*],[eta,Pi]]`, the exact raw singleton/rest blocks are

`s_mu=Sigma_88-U*G_88-mu*D_8*pi`,

`c_mu=Sigma_R8-U*G_R8-mu*D_R^(1/2)*eta*D_8^(1/2)`,

`K_mu=Sigma_RR-U*G_RR-mu*D_R^(1/2)*Pi*D_R^(1/2)`.

The complete branch theorem is

- `s_mu>0`: `B>=mu*Delta` iff `K_mu-c_mu*c_mu^*/s_mu>=0`;
- `s_mu=0`: the comparison holds iff `c_mu=0` and `K_mu>=0`;
- `s_mu<0`: the comparison is impossible.

The rest-pivot form additionally retains the range condition for a singular
rest block.  The weighted-PNT identity rewrites the same matrix as the
combined pole--archimedean--minus-prime signed Stieltjes translation
covariance.  Separate absolute bounds do not choose its sign.

The proved `U=o(d_6)`, `M_8=O(1/d_8)`, and
`M_R=O(lambda^(-2)/d_8)` imply only the whitened shift ledger

`||U*A_8^*A_8||=o(lambda^(-4))`,
`||U*A_R^*A_R||=o(lambda^(-6))`,
`||U*A_R^*A_8||=o(lambda^(-5))`.

These are not raw-`U*G` estimates.  The paired-slot family is a nonactual
implication countermodel, and the polynomial--Xi tower does not transfer a
growing whitened rest frame.  Thus the actual singleton-shorted growing-rest
inequality remains open.  No uniform signed floor, residual action, odd
floor, full-metric identification, high/cross/reduction theorem, equation
(5.2), RH, or Lambda bound follows.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 0.96 fixed even-prefix arithmetic synthesis theorem

Fix \(m\geq3\) and the locked label set
\({\cal T}_m=\{8,12,\ldots,4m\}\).  For every fixed \(t=4j\), the explicit
quasimode coefficients are

\[
 \mu_t=-{2t^2+2t+3\over4},
\]

\[
 u_t={\sqrt{t(t-1)(t-2)(t-3)}\over64\pi}h_{t-4}
 -{\sqrt{(t+1)(t+2)(t+3)(t+4)}\over64\pi}h_{t+4}.
\]

The fixed-gap quasimode proof gives \(O_t(\lambda^{-4})\) in \(L^2\) and at
the origin.  If

\[
 r_t={\sqrt{t!}\over2^{t/2}(t/2)!},
\]

then

\[
 {u_t(0)\over h_t(0)}=-{3(2t+1)\over64\pi},\qquad
 \rho_t=-r_t+{3tr_t\over32\pi}\lambda^{-2}
                 +O_t(\lambda^{-4}).
\]

The finite corrected source \(q_{t,\lambda}\) has exact zero integral and
generally only a beyond-all-orders-small point value.  The coefficients
\(q_t,q_{t,1}\) each have exact zero point and integral, and

\[
 p_t=K_t+\lambda^{-2}K_{t,1}+O_{t,L^2}(\lambda^{-3}).
\]

The Mellin multipliers of \(K_{4j}\) have distinct degrees \(j-1\).
Therefore \(K_4,K_8,\ldots,K_{4m}\) are independent, their anchor-deflated
limits are independent, and the raw fixed-prefix Gram converges to a
positive-definite matrix.

The defect and source-metric hierarchies are

\[
 {d_s\over d_t}\sim {t!\over s!}(16\pi)^{s-t}
                    \lambda^{-2(t-s)},\qquad
 {D_t\over d_t}\longrightarrow1.
\]

Relative to the diagonal defect metric, the full fixed prefix is
\(I+O_m(\lambda^{-8})\), the fixed rest is
\(I+O_m(\lambda^{-16})\), and the omitted singleton/rest cross is
\(O_m(\lambda^{-12})\) after whitening.  Consequently

\[
 M_t=\Theta_m(d_t^{-1}),\qquad
 \|A_m\|^2=\Theta_m(d_8^{-1}),\qquad
 \|A_{R,m}\|^2=\Theta_m(d_{12}^{-1}).
\]

The whitened Gram, equivalently the nonzero spectrum of \(A_mA_m^*\), has
condition number

\[
 \Theta_m(d_{4m}/d_8)=\Theta_m(\lambda^{8m-16}),
\]

whereas

\[
 \operatorname {cond}_2(A_m)=\Theta_m(\lambda^{4m-8}).
\]

The scalar shift contributes only

\[
 o(\lambda^{-4}),\qquad o(\lambda^{-12}),\qquad
 o(\lambda^{-8})
\]

to the combined, rest, and singleton/rest whitened blocks.  These are not
raw \(UG\) estimates.

All constants and thresholds may depend on fixed \(m\).  No uniform-depth
or growing-rest frame, signed floor, residual action, physical
high-complement or low/high cross theorem, reduction, equation (5.2), RH,
or Lambda bound follows.  The terminal state remains P0_INVALIDATED.

## Checkpoint 0.97 restricted-forcing and diagonal-covariance dichotomy

Let \(A:X\to K\) be onto, \(S=(\ker A)^\perp\),
\(J=A^*A\), \(\Delta=(AA^*)^{-1}\), \(H=A^*BA\), and \(g=A^*c\).
The polar unitary \(U=AJ_S^{-1/2}\) gives

\[
 U^*(B^{-1}\Delta)U=J_S^{1/2}H_S^{-1}J_S^{-1/2},
\]

\[
 B^{-1}c=AH_S^{-1}g,\quad
 A^\dagger B^{-1}c=H_S^{-1}g,\quad
 A^*B^{-1}c=J_SH_S^{-1}g.
\]

Consequently

\[
 { \|B^{-1}c\|^2\over\|\Delta^{-1}c\|^2}
 ={ \langle H_S^{-1}g,J_SH_S^{-1}g\rangle
    \over\langle g,J_Sg\rangle}.
\]

If \(u=\Delta^{-1}c\), \(T=B^{-1}\Delta\), and \(\nu_u\) is the
right-singular spectral measure of \(T\), the same quotient is

\[
 \int s\,d\nu_u(s)
 =\sum_\sigma\sigma^2{\|P_\sigma u\|^2\over\|u\|^2}.
\]

The projections are onto complete distinct singular-value levels, so the
formula is invariant under basis changes in a repeated singular subspace.
A uniform first-moment bound is exactly the one-forcing action-transfer
condition.  A cyclic-support cap is sufficient but strictly stronger.

The floor-only estimate

\[
 K_c^2\leq{\kappa(J_S)\over\mu^2}
\]

cannot generally be improved in conditioning order.  An exact family has
\(\Delta_\varepsilon\preceq B_\varepsilon
\preceq2\Delta_\varepsilon\) but

\[
 K_c^2={9\over16}+{\kappa(J_\varepsilon)\over16}.
\]

This family is abstract and supplies no actual-source action conclusion.

For each fixed real window \([-T,T]\), the complete polynomial--Xi prefix
and the fixed-prefix convergence theorem allow one non-effective locked
diagonal \(\lambda_m\) on which the actual generalized covariance floors
satisfy

\[
 \gamma_{m,\lambda_m}(T)^{1/m}\longrightarrow0.
\]

The same diagonal retains all finitely many fixed-depth transition,
injectivity, metric, and whitened-shift conditions.  This is an
exists-diagonal theorem, not an every-schedule statement.

For the actual paired zero tail, define

\[
 Y=Z{\cal R}_{\lambda,m}D^{-1/2},\quad
 \widehat A=Y^*Y,\quad
 \widehat\Sigma=Y^*JY,\quad
 \widehat E=2Y^*\Pi_{\rm anti}Y.
\]

Then

\[
 \widehat\Sigma=\widehat A-\widehat E.
\]

Writing

\[
 \widehat G=D^{-1/2}GD^{-1/2},\quad
 P_0=1_{(0,\infty)}(\widehat G),\quad
 C_\mu=\widehat A-U\widehat G-\mu P_0,
\]

the exact floor dichotomy is:

- if \(C_\mu\not\succeq0\), the signed floor is impossible;
- if \(C_\mu\succeq0\), the floor holds exactly when
  \({\rm ran}\widehat E\subseteq{\rm ran}C_\mu\) and
  \(\|C_\mu^{\dagger/2}\widehat E
  C_\mu^{\dagger/2}\|\leq1\);
- for \(C_\mu\succ0\), this is the ordinary inverse-square-root
  contraction.

Vanishing of the least eigenvalue of
\(P_0(\widehat A+|U|\widehat G)P_0\) is a sufficient failure certificate,
but its actual vanishing is not proved.  The real-window covariance uses
the raw Gram \(G\), not \(D\), and is not the absolute paired-zero tail
Gram.  Thus the diagonal covariance collapse does not prove that the
actual signed tail fails.

Checkpoint 0.97 proves neither an actual first-moment action bound nor
actual signed-tail failure.  No growing-rest floor, residual action, odd
floor, high/cross/reduction theorem, equation (5.2), RH, or Lambda bound
follows.  The terminal state remains P0_INVALIDATED.

## Checkpoint 0.98 endpoint-null Bernoulli prime-quadrature and carrier-transfer barriers

For every fixed inversion-even label, the normalized endpoint satisfies

\[
 {E_t^2\over D_t}\sim2\pi\lambda .
\]

Consequently the isolated leading sawtooth tails have the fixed-prefix
defect-whitened Gram

\[
 {\pi\over12}{\bf1}{\bf1}^*+o(1).
\]

This rank-one physical real-line model does not approximate the complete
additive leakage at the \(D\) scale.  The full positive leakage of a fixed
unbumped column is exactly \(D_t/2\), while the leading sine model has
energy \(D_t/\pi+o(D_t)\).  Reverse triangle therefore leaves the positive
relative gap

\[
 \left|{1\over\sqrt2}-{1\over\sqrt\pi}\right|.
\]

On the label-\(8/12\) endpoint-null direction,

\[
 \Theta_{12,\lambda}-\Theta_{8,\lambda}
 =8c-42+O(\lambda^{-2}),
\]

\[
 {G_v\over\lambda^{3/2}}\longrightarrow-8\pi^{3/2},
\qquad
 \kappa_\lambda\longrightarrow-2\pi^{3/2}.
\]

The isolated \(B_2\) two-tail norm is \(2\pi^3/135\).  Its additive model
has energy \(8/(3\pi)\), whereas the full endpoint-null column has energy
\(1/2+o(1)\).  The first two endpoint truncations therefore have
nonvanishing additive remainders.  No all-orders or all-finite-\(K\)
statement follows.

The direct PNT envelope for the reflected \(B_2\)--\(B_2\) scalar is too
large after its \(8\pi^3\lambda+o(\lambda)\) prefactor.  The oscillation of
the Bernoulli self-convolution nevertheless gives the explicit bound

\[
 |C_A(y)|\leq {3\zeta(9/4)^2\over\pi^{9/2}}A^{-1/2}e^{-5y/4}
 +{\zeta(5/2)^2\over\pi^5}A^{-1}e^{-3y/2}.
\]

The exact Stieltjes reduction is

\[
 {\cal M}_{11,A}=-\int C_A
 +\sum_{n>A}{\Lambda(n)\over n}C_A\!\left(\log{n\over A}\right)
 +A^{-3}\int_0^\infty
 {e^{-3y}C_A(y)\over1-A^{-2}e^{-2y}}\,dy.
\]

The continuous term has the additional mean-zero gain

\[
 0\leq\int_0^\infty C_A(y)\,dy
 \leq{\zeta(3)^2\over\pi^6A^2}.
\]

Chebyshev partial summation therefore proves
\({\cal M}_{11,A}=O(A^{-1/2})=O(\lambda^{-1})\).  The reflected term is
bounded at its own-defect normalization.  The estimate takes absolute
values and proves neither a sign, a limiting constant, nor a little-oh
improvement; the complete arithmetic divisor sum may still cancel these
isolated endpoint pieces.

For the separate carrier barrier, two declared critical-line ordinates
produce a moving space \(H_L\) with

\[
 \|{\cal A}_Tv\|^2\leq{512T\over L\gamma_{\min}^2},
\qquad
 \|v\|_{\mathfrak Z}^2\geq{L\over8\pi^2}
\]

for every unit \(v\in H_L\).  For every unit even anchor,
\(J_L=H_L\cap\kappa_L^\perp\) is nonzero.  The exact radical lift gives
\(Z{\cal R}_+v=-Zv\), and unrestricted finite-stage polynomial--Xi
saturation represents \(v\) after some unknown finite depth.  Neither
statement controls the exterior defect cost of that representation.

For an allowed anchor-deflated synthesis \(W_{m,\lambda}\), the exact
basis-invariant gate is

\[
 {\cal R}_D(J_L;m,\lambda)
 =\|A_{D,m,\lambda}^{\dagger}|_{J_L}\|^2.
\]

If \(J_L\) lies in the range and this quantity is at most \(CL\), the
minimum-\(D\) carrier preimage has zero-sampling quotient at least
\(1/(8\pi^2C)\).  No such growing-depth right-inverse bound is proved, and
the carrier theorem gives no \(D\)-cost for the specific moment-ratio
witness.

The fixed-\(K\) logarithmic recurrence transfers nonvanishing to the locked
grid with explicit constants.  Its mean-plus-nearest-grid sufficient
condition loses \(2^K\) and fails at the natural growing \(K\); this is a
method limitation, not a proof that favorable locked points do not exist.

There is no additive-to-paired-zero lower theorem and no paired-slot
orientation conclusion.  Checkpoint 0.98 proves no actual absolute- or
signed-tail result, floor or floor failure, residual action, odd floor,
high/cross/reduction theorem, equation (5.2), RH, or Lambda bound.  The
terminal state remains P0_INVALIDATED.

## Checkpoint 0.99 fixed-endpoint Bernoulli matrix quadrature and jet growth

For every fixed \(q,r\geq1\), the periodic Bernoulli convolution satisfies

\[
 |C_{q,r;A}(y)|\leq K^+_{q,r}A^{-1/2}e^{-(d-3/4)y}
 +K^-_{q,r}A^{-1}e^{-(d-1/2)y},\qquad d=\min(q,r),
\]

where

\[
 K^+_{q,r}={12q!r!\over(2\pi)^{q+r}\sqrt\pi}
 \zeta\!\left(q+{1\over4}\right)
 \zeta\!\left(r+{1\over4}\right),
\]

\[
 K^-_{q,r}={4q!r!\over\pi(2\pi)^{q+r}}
 \zeta\!\left(q+{1\over2}\right)
 \zeta\!\left(r+{1\over2}\right).
\]

The \(q=1\) case follows by Fejer approximation before passing to the
physical convolution.  Monotone-weight integration by parts retains the
unweighted oscillatory constant without a factor-two loss.  Local absolute
continuity and \(C_{q,r;A}(0)=0\) keep all lower, upper, prime-jump, and
archimedean boundary terms exact.

The resulting quadrature is

\[
 \begin{aligned}
 {\cal Q}_{q,r;A}={}&-\int_0^\infty C_{q,r;A}
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{q,r;A}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{q,r;A}(y)\over1-A^{-2}e^{-2y}}\,dy.
 \end{aligned}
\]

The bounded periodic primitive and universal Chebyshev bound give

\[
 {\cal Q}_{q,r;A}=O_{q,r}(A^{-1/2})
 =O_{q,r}(\lambda^{-1}).
\]

Hence \(2\lambda({\cal Q}_{q,r;A})_{q,r\leq R}\) is bounded for each fixed
\(R\) in Bernoulli coordinates.

For the physical endpoint jets,

\[
 2(j+1)P_{j+1}=\{\Theta-c^2-j(j+1)\}P_j
 -2jc^2P_{j-1}-j(j-1)c^2P_{j-2}.
\]

The fixed-column raw order-\(q\) coefficient grows like
\(\lambda^{2q-2}\).  On the exact label-\(8/12\) endpoint-null direction,

\[
 \widehat\gamma_{q,v}\sim
 (-1)^{q-1}{2^q\pi^{2q-5/2}\over(q-2)!q!}
 \lambda^{2q-4},
\]

with exact order-one cancellation and
\(\widehat\gamma_{2,v}\to-2\pi^{3/2}\).  Therefore termwise pullback gives
only \(O_R(\lambda^{4R-8})\) through order \(R\) on that line.  This is a
weak upper bound and proves neither boundedness nor divergence; signed
endpoint orders may cancel.

Checkpoint 0.99 does not control the complete Volterra remainder or sum
the endpoint expansion, and it is not uniform in growing order, label, or
prefix depth.  It proves no sign, complete-tail floor or failure, residual
action, odd floor, high/cross/reduction theorem, equation (5.2), RH, or
Lambda bound.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.00 moving-label carrier coframe and complete Volterra caustic quadrature

On an infinite odd locked schedule with

\[
 L_A=2\log\lambda_A\in[A,A+1],\quad
 N_A=\lceil C_N(A+1)^2\rceil,
\]

\[
 K_A=\lceil\kappa L_A^3\log L_A\rceil,
 \qquad Q_A=N_A+1+K_A,
\]

the actual zero-integral even prolate labels (4,8,\ldots,4Q_A) map onto
the full centered space (E_{N_A}^+).  After actual label-four anchor
deflation, the labels (8,\ldots,4Q_A) map onto the whole anchor
complement.  Their exact exterior-defect minimum-cost right inverse obeys

\[
 {cal R}_D(\kappa_A^\perp;Q_A,\lambda_A)
 \leq\exp\left\{-{2\lambda_A^2\over L_A}
 +C_0L_A^4\log L_A\right\}=o(1).
\]

Hence the two-zero carrier section (J_{L_A}) lies in the actual wide
prefix range and has (D)-cost (o(1)).  This is an absolute range and
cost theorem for a prefix of depth (O(L^3\log L)); it is not a signed
orientation or residual-action theorem and does not prove the square
first-(J_A) determinant.

For the corrected, fully metric-normalized fixed label-(8/12)
endpoint-null source, put (c=2\pi\lambda^2), (A=\lambda^2),

\[
 B_\lambda(s)={\sqrt{\lambda e^s}\over2}
 \sum_{m\geq1}H_v(m\lambda e^s),\qquad
 g_\lambda(s)=e^{s/2}B_\lambda(s),\qquad
 C_\lambda=g_\lambda*g_\lambda.
\]

The complete physical correlation satisfies

\[
 |C_\lambda(y)|\leq K\left\{
 c^{-1/4}{\mathbf1_{|y-\log2|\leq\eta}
 \over(1+c^{1/2}|y-\log2|)^{1/2}}
 +c^{-1/2}(1+y)e^{-y}\right\}.
\]

Its only quartic caustic is the positive ((m,l)=(1,1)) branch at
(y=\log2), and

\[
 C_\lambda(\log2)=
 {\Gamma(1/4)\cos(\pi/8)\over4\pi}c^{-1/4}
 +o(c^{-1/4})>0.
\]

Local absolute continuity and the exact endpoint cancellations give

\[
 \begin{aligned}
 {cal M}_{v,A}={}&-\int_0^\infty C_\lambda(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_\lambda\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_\lambda(y)\over1-A^{-2}e^{-2y}}\,dy,
 \end{aligned}
\]

with ({\cal M}_{v,A}=O(c^{-1/2})=O(\lambda^{-1})).  Thus the reflected
factor (2\lambda) leaves the complete fixed-(8/12) physical outer
contribution bounded.  The positive local caustic constant does not fix
the sign or limit of the signed prime quadrature.

Checkpoint 1.00 proves no growing-rest floor, signed even or odd floor,
residual action, shifted inverse, reducing or physical high-complement
property, low/high theorem, equation (5.2), RH, or Lambda bound.  The
terminal state remains P0_INVALIDATED.

## Checkpoint 1.01 fixed 8/12 endpoint-null Archimedean directional lower bound

Keep the exact fully metric-normalized fixed label-(8/12) endpoint-null
direction on (\lambda=p/2), (p\geq5) odd, and put (c=2\pi\lambda^2).
For its origin-corrected global radical lift (K_{v,\lambda}), actual compact
projected physical column (W_{v,\lambda}), and leakage split

\[
 R_{v,\lambda}=K_{v,\lambda}-W_{v,\lambda}
 =O_\lambda+P_\lambda,
\]

the exact full shifted scalar is

\[
 \mathcal S_\lambda=
 \mathcal W_Z(R_{v,\lambda},R_{v,\lambda})
 -U_\lambda\|W_{v,\lambda}\|_2^2.
\]

Thus the Rayleigh shift acts on the compact metric (W^*W), not on the norm
of the global remainder.

The complete one-tail WKB mass has the exact limit

\[
 2\|B_\lambda\|_2^2\longrightarrow E,
\]

where

\[
 E={1\over4}+{1\over2\pi}\sum_{m\geq2}{1\over m}
 \left\{\arcsin{1\over m}
 -{\sqrt{m^2-1}(m^2-2)\over m^4}\right\}
 =0.282628070905254\ldots .
\]

Low-frequency nonstationary phase puts asymptotically all of this mass in
(|\xi|\geq c/2).  The exact even Archimedean multiplier

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}+{i\xi\over2}\right)
 -\log\pi
\]

therefore gives

\[
 Q_{\rm ar}^{\rm same}(O_\lambda,O_\lambda)
 \geq {E\over2}\log c-C.
\]

The same-side prime term is uniformly bounded below, the complete reflected
cross-tail term is bounded in absolute value, and the even pole is
nonnegative.  The fixed-direction compact Fourier-tail estimate proves
every projection-containing signed pairing is (o(1)), and the shifted
compact metric term is (o(1)).  Hence

\[
 \boxed{\mathcal S_\lambda\geq {E\over2}\log c-C\longrightarrow+\infty.}
\]

This proves eventual positivity only on that one normalized fixed
endpoint-null line.  It proves no label-(8/12) plane minimum,
singleton-shorted floor, fixed-prefix floor, growing-rest floor,
uniform-label extension, exact finite renormalized limit, residual action,
shifted inverse, reducing or high-complement theorem, low/high comparison,
equation (5.2), RH, or Lambda bound.  The terminal state remains
P0_INVALIDATED.

## Checkpoint 1.02 fixed label-8/12 plane Archimedean-arithmetic floor

Let \(F_\lambda\) synthesize the actual uncorrected anchor-deflated labels
\(8\) and \(12\), and let

\[
 D_\lambda=F_\lambda^*(I-\mathcal P_\lambda)F_\lambda\succ0.
\]

The invisible origin bump is excluded from this quotient metric and is
added only in the global radical lift.  Whitening the exact endpoint row
gives full-exterior-\(D_\lambda\)-orthonormal endpoint/null directions
\(e_\lambda,v_\lambda\), with exact endpoint values \(r_\lambda>0\) and
\(0\), respectively.

Their complete physical profiles have the positive matrix limit

\[
 2\,\operatorname {Gram}(B_e,B_v)
 \longrightarrow\operatorname {diag}(F,E),
 \qquad F>E>0,
\]

where \(F=0.427511972026948\ldots\) and
\(E=0.282628070905254\ldots\).  Uniform low-frequency exclusion and the
exact even Archimedean multiplier therefore give

\[
 Q_{\rm ar}^{\rm same}\succeq {E\over2}\log c\,I_2-CI_2,
 \qquad c=2\pi\lambda^2.
\]

The complete same-side prime matrix is \(O(1)\): the leading endpoint
sawtooth has exact integer-dilation covariance \(1/(12n)\), and the
complete Jost proof retains the inverse-\(m\) intermediate endpoint
boundary, Fejer cutoff, and hard-edge contribution.  The complete
reflected matrix satisfies

\[
 \|{-2\lambda\mathcal M_A}\|=O(1).
\]

This bound uses local absolute continuity at the endpoint and a real
caustic rotation that cancels only one available trigonometric branch;
the uncancelled branch is kept in the estimate.

For the origin-corrected radicals \(K_i\), compact columns \(W_i\), and
\(R_i=K_i-W_i\), both mixed projection orientations give

\[
 [\mathcal W_Z(R_i,R_j)]
 =[\mathcal W_Z(O_i,O_j)]+o(1),
 \qquad \|U_\lambda W^*W\|=o(\lambda^{-4}).
\]

The even pole is positive semidefinite, so the exact shifted compression

\[
 \mathsf H_{ij}=\mathcal W_Z(R_i,R_j)
 -U_\lambda\langle W_i,W_j\rangle
\]

obeys

\[
 \boxed{\mathsf H(\lambda)
 \succeq {E\over2}\log c\,I_2-CI_2.}
\]

Its least eigenvalue tends to \(+\infty\).  This is only a fixed
label-\(8/12\) plane floor.  It proves no label-\(16+\) or growing-prefix
floor, no growing-rest or singleton-versus-rest Schur floor, no full-\(P_0\)
floor, residual action, physical high-complement comparison, low/high
cross or reducing theorem, determinant bridge, equation (5.2), RH, or
Lambda bound.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.03 reciprocal `chi_4` von Mangoldt cancellation

For

\[
 S(N,X;z)=\sum_{N<k\leq X}\Lambda(k)\chi_4(k)e^{-iz/k},
\]

checkpoint 1.03 proves that for every fixed \(A\geq1\),

\[
 \sup_{0\leq z\leq N^A}\sup_{N\leq X\leq2N}|S(N,X;z)|
 \leq C_A N e^{-\kappa_A\sqrt{\log N}}.
\]

The growing split \(H_N=e^{\eta\sqrt{\log N}}\) is part of the theorem:
fixed-modulus PNT cancellation handles the low-phase range, while fixed
Vaughan Type I/II parameters and high-derivative estimates handle the
remaining fixed-polynomial phase range.  Consequently, for any
independently proved uniformly bounded dyadic amplitude-variation sequence,
the reciprocal residual sum is \(o(\log c)\).

This removes a scalar arithmetic obstruction but not the operator one.
The still-missing step is a uniform exact Weber/Airy or other FIO reduction
whose matrix amplitudes have the required dyadic endpoint and variation
control.  The equality branch and Archimedean symbol must still be combined
before taking absolute values, and the result must still descend through
the exact growing \(P_0\) quotient.  The external Montgomery--Vaughan PDF
used for the standard analytic inputs is cited but unvendored and not
source locked.

No cutoff identification is inferred: the moving carrier coframe and the
transition sampling theorem use different projections, physical maps,
support projections, and quotient metrics.  Therefore checkpoint 1.03
proves no growing-rest floor, singleton Schur floor, residual action,
physical high-complement theorem, low/high reduction, equation (5.2), RH,
or Lambda bound.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.04 growing-transition equality-conductor subsystem

For a zero-integral same-phase prolate combination below the locked
transition endpoint, let \(H={\cal F}_af\), let \(D\) be its exact full
exterior norm, and define

\[
 \phi(t)={\sqrt\lambda\over2}e^{t/2}H(\lambda e^t),\qquad
 R_m\phi(s)={\bf1}_{s\geq0}m^{-1/2}\phi(s+\log m).
\]

Then \(8\|\phi\|_2^2=D\).  Checkpoint 1.04 treats exactly the diagonal
sample Archimedean conductor plus the same-prime divisor equality,

\[
 \mathfrak E_\lambda
 =2\sum_m\langle R_m\phi,a(D)R_m\phi\rangle
 -4\int_0^\infty L_{\lfloor e^t\rfloor}|\phi(t)|^2\,dt.
\]

Burnol's exact conductor conversion and divisor layer cake yield

\[
 \mathfrak E_\lambda
 ={L\over4}S+{1\over4}\int
 (H_{\lfloor z\rfloor}\log z-2L_{\lfloor z\rfloor})|H|^2
 -{J\over4}+{U\over4}.
\]

The arithmetic bracket and \(U\) are nonnegative.  The split
\(R=\lambda/L\), the central defect spectral kernel for \(m=1\), and exact
nonstationary hard-cutoff estimates for \(m\geq2\) prove

\[
 \boxed{\mathfrak E_\lambda
 \geq\left({L\over4}-{1\over4}\log L-C\right)D.}
\]

For the exact coefficient synthesis, \(8\|\Phi x\|_2^2=x^*D_{\rm full}x\),
and the endpoint-null rest shear is one congruence of both the equality
matrix and the full exterior metric.  The locked origin correction is
controlled separately and gives the same floor for the actual corrected
sampler equality subsystem.

No statement here controls unequal sample pairs, non-equality prime terms,
reflected or projection pieces, pole, complete `Sigma`, the singleton Schur
load, or the project source projection \(P_0\).  Thus this result cannot be
inserted as a complete LOW_BLOCK or physical-quotient floor.  Burnol
arXiv:math/9902080 is an explicit unvendored normalization input and is not
source locked.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.05 growing-transition subcritical LG radial action-BV theorem

For a radial separation value `mu<c^2`, set

\[
 r^2=1-\mu/c^2,\qquad \alpha=cr^2,
 \qquad \alpha\geq(\log L)^4.
\]

Checkpoint 1.05 proves the exact near-separatrix Liouville--Green
perturbation

\[
 \Psi_r(q)={1\over16\tau_r(q)^2}-{1\over4q(1+q)}
 +{3+(8+r^2)q+6r^2q^2\over16q(1+q)^3},
\]

including the pole cancellation `Psi_r(0)=(r^2+2)/12`, and the differentiated
variation estimate

\[
 \int |(r\partial_r)^j(q\partial_q)^k\Psi_r|\,d\tau_r\leq C_{jk},
 \qquad j+k\leq2.
\]

The exact `J_0/Y_0` carrier formulation gives `O(alpha^(-1))` control of the
Volterra coefficient matrix through two radial derivatives at fixed Bessel
phase, through one derivative at fixed `q`, and through one derivative at
fixed physical `x`.  The second fixed-`q` derivative is only `O(1)`.  The
completed phase satisfies

\[
 \partial_\sigma\{c[T_r(x)+C(r)]\}=1-u_r(x),
\]

and the endpoint-normalized mass is

\[
 \mathcal N_r={J(r)\over\pi c}(1+\varepsilon_r),\qquad
 |(r\partial_r)^j\varepsilon_r|
 \leq C_j{\log(2+\alpha)\over\alpha},\quad j\leq2.
\]

Consequently the defect-whitened scalar radial action amplitude has
`O(log L)=o(L)` variation, while the Volterra part has
`O((log L)^(-4))` variation.  This is an ingredient only: no sampler
assembly, same-side Hankel operator cancellation, reflected FIO estimate,
Weber-edge theorem, endpoint-shear coefficient bound, signed floor, or
`P_0` comparison follows.  It therefore does not change the residual-action
obstruction or imply equation (5.2), a determinant limit, or RH.  Dunster
arXiv:1601.00699 supplies only the exact algebraic transformation; it is
unvendored and not source locked, and its fixed-distance uniform asymptotic
theorem is not used.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.06 growing-transition Weber-edge reciprocal channel theorem

Checkpoint 1.06 treats only the one-edge/one-far reciprocal channel of the
same-side branch.  Every synthesis, positive-tail isometry,
`D`-normalization, and exterior operator statement is restricted to one
fixed Fourier phase, with project application `nu=0 mod 4`; the scalar
`F_c(N,alpha)` theorem itself holds for every real `|alpha|<=B`.

The exact edge coordinate has affine sampler
`tau_m(u)=m u+c(m-1)` and differential operator

\[
 A_c=-{d\over du}\left((2u+u^2/c){d\over du}\right)-(2u+u^2/c).
\]

After removing sampler equality, the reciprocal stationary branch can only
have `m=1`.  The flat Weber--Kummer solution has exact Abel multiplier

\[
 F_0(N,\alpha)={-i\over\sqrt{N^2-1}}
 \exp\left({i\alpha\over4}\log{N+1\over N-1}\right),
\]

while the actual `A_c` transform satisfies

\[
 (N^2-1)F_c''+[2N+2ic(1-N^2)]F_c'
 +(c\alpha-2icN)F_c=0.
\]

The corrected terminal-Volterra argument proves

\[
 F_c=F_0G_c,\qquad
 |G_c-1|+N|G_c'|\leq {C(1+B)^3\over cN^2}
\]

for `c>=c_0(1+B)^3`, together with dyadic multiplier BV and the exact
odd/even `l` parity gain.  These are scalar or fixed-phase
carrier-removed multiplier statements.

The far half density is only pointwise: the variable Jost coefficient and
cutoff remain inside the weighted Fourier composition.  A coherent-packet
obstruction rules out the global near-identity shortcut.  Therefore the
cutoff-uniform weighted-composition lemma, complete actual-channel
`c^(-1/2)(N^2-1)^(-1)` decay, absolute summability, and `o(L)` operator bound
remain open.  No reflected block, complete same-side floor, full `Sigma`,
endpoint-sheared floor, `P_0` comparison, residual action, physical
high/cross reduction, equation (5.2), determinant limit, or RH conclusion
follows.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.07 deterministic fixed-plus edge--edge higher aliases

Checkpoint 1.07 treats only the deterministic finite-Fejer pair
`S_h=widehat K(h)+widehat K(-h)` for `h>=2`, compressed to the unsheared
fixed plus phase with `|alpha|<=B=(log L)^4`.  The unilateral block is not
an eigenoperator.  Keeping the exterior cutoff in the adjoint gives

\[
 \mathcal F_+^*D_h^*=D_h\mathcal F_+^*,\qquad
 S_h={1\over4\sqrt h}T^*D_h(\mathcal F_++\mathcal F_+^*)T,
\]

so the full even prolate relation is used only after the symmetric pair is
formed.  This yields the exact paired factor `1/4`; at `h=1` the Hermitian
part is `-chi/8`.

The actual edge equation supplies global energy transfer from `c` to the
far base and `O((1+B)/(c(h^2-1)))` far variation.  Combining its outgoing
rows with the exact `F_c` channel and Wiener/Bessel synthesis gives an
absolutely summable `O((1+B)^3h^(-2))` paired column bound.  The
Bonami--Karoui action bracket gives `Q_B=O(L(1+B))`; hence the edge--edge
higher-alias Hilbert--Schmidt norm is
`O(sqrt(L)*(log L)^14)=o(L)` uniformly in the Fejer cutoff.

Bonami--Karoui arXiv:1405.3676v2 is unvendored and not source locked.  This
edge--edge statement excludes `-C_0L<=alpha<-B`, endpoint shear, edge--bulk
and bulk--edge blocks, `R_D`, complete reflected and same-side operators,
full `Sigma`, a signed floor, and `P_0`.  It proves no residual action,
physical high/cross reduction, equation (5.2), determinant limit, RH, or
Lambda bound.  The terminal state remains P0_INVALIDATED.

## Checkpoint 1.08 complete central-form reduction and signed-slot erratum

For the complete admitted plus-phase transition synthesis, checkpoint 1.08
sets `X=C_lambda K`, `p=P_NX`, `P=X-p`, and
`O=(1-C_lambda)K`.  Exact radical algebra, including both mixed
orientations and one surviving projection-square term, gives

\[
 \Sigma_N=\mathcal W_Z(O+P,O+P),\qquad
 \mathcal W_Z(O,O)=Q_X=q_\lambda(X,X),
\]

and

\[
 \Sigma_N-Q_X
 =-q_\lambda(p,P)-q_\lambda(P,p)-q_\lambda(P,P).
\]

Absolute paired-slot sampling therefore yields

\[
 -\delta_qD_{\rm full}\preceq\Sigma_N-Q_X
 \preceq\delta_qD_{\rm full},
 \qquad
 \delta_q=O\!\left(q\operatorname {poly}(\lambda,\log\lambda)
 e^{-M_{2400}\lambda^2}\right),
\]

where `M_2400=17.143296058960234...>0`.  The admitted inventory has
`q<=3 lambda^2/2`, so projection erosion is exponentially small.  One
endpoint-shear congruence transports the estimate in the complete exterior
metric, including anchor and cross entries, without a bound on the shear
coefficients.

The finite divisor-mask partition gives
`G_M=R+C_R+C_L+B` and the physical prime factor
`-2(G_M-B)=-2G_M+2B`.  The both-miss term `B` is therefore part of the
outer--outer prime fold, is generally indefinite, and is not the log-Fourier
projection remainder `P`.  It need not be estimated separately if the
complete central form `Q_X` is retained.

The checkpoint also records, without modifying the historical theorem or
its source locks, that the signed spectral summand in historical equation
(1.5) must be read as
`F(s_rho) overline{F(overline{s_rho})}`.  For real-even data this is
`F(s_rho)^2`, not `|F(s_rho)|^2`, and it is indefinite off-line.  The
historical absolute constants and bounds remain valid because their proof
uses the same two-slot modulus and Cauchy inequality.

Thus projection orientation, both-miss placement, and endpoint-shear
transport are closed, but the complete signed lower bound is not.  The
strong whole-span estimate

\[
 Q_X-\mathfrak E_{\rm eq}\succeq-o(L)D_{\rm full}
\]

would be sufficient, not necessary.  The actual project-minimal obligation
is still a fixed positive `mu_0` singleton/P0 Schur inequality.  No central
floor, complete `Sigma_N` floor, singleton Schur or `P_0` floor, residual
action, physical high/cross reduction, equation (5.2), determinant limit,
RH, or Lambda bound follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.09 conditional Plemelj floor and regular/edge gates

Checkpoint 1.09 refines the sole remaining central target `Q_X` without
proving its lower bound.  The exact one-sided trace calculation keeps the
sampler row that survives the endpoint shear and combines the first boundary
row with the logarithmic derivative bulk.  If the complete physical
Plemelj assembly hypothesis `PA` holds, the singular bulk is a positive
compression of `I+iM_x`.  With the explicitly unvendored and unhashed
Preissmann weighted-Hilbert input `EH`,

\[
 I+iM_x\succeq
 \left\{1-{8\over9}e^{10/\alpha_0}\right\}I.
\]

Neither `PA` nor `EH` is promoted to a proved, source-locked input.

For the fixed-product both-miss fold, the reciprocal center must first be
combined with the unrestricted coefficient.  In the unweighted limit this
gives `G_N-B_N=2 log N-Lambda(N)`.  Its paired first-alias constant is the
favorable internal term `(L/2)mathsf X`, while every genuine mask transition
is separated from the reciprocal quartic point.  The ordinary transition
sum and coherent unequal-action estimate remain open.

The regular action module proves only the operator arrow from scalar control.
After the `PA` endpoint is removed, its off-diagonal second remainder has the
dimension-free `4/27` bound.  The exact finite-Fejer audit corrects the
quantifier: the finite coefficient is

\[
 C_M(N)=2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N),
\]

so a limiting-core `sup_M` remainder is false.  A cutoff-matched `PA_M` or
the ordered limit `M->infinity` is mandatory, and divisor-mask atoms require
a separate gap-weighted Stieltjes estimate.  The hard-end CD reference
projector is controlled, but its exact `m_a`/LG multiplier is not.

The isolated edge Weber--Carleman channel is not a positive error: every
distinct two-energy whitened minor is negative and the flat kernel has
unbounded negative index.  This does not orient the complete edge form.
It leaves a required complete pre-shear cancellation/factorization or a
same-order signed comparison, together with all edge--bulk and anchor
crosses.

Thus the five modules sharpen the residual inventory but do not close it.
`PA`, `EH`, ordered `SB`, hard `m_a` composition, complete Weber
cancellation, edge--bulk/anchor control, a whole-span central floor, the
singleton/`P_0` Schur gate, residual action, equation (5.2), determinant
control, RH, and every Lambda bound remain unproved.  The five focused
modules pass `56/56`, the eighty-two-module frontier passes `890/890`, and
canonical and raw discovery contain `2412` tests.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 1.10 direct-source upper form and carrier diagnostics

Checkpoint 1.10 closes the representation-level slot ambiguity left by the
checkpoint-1.09 scalar masks, but not the analytic lower-bound problem.  The
finite-Fejer Xi-Wronskian gate proves the ordered prime commutator and the
gamma-conjugated Xi divided difference in the absolute-convergence
half-plane, including the exact finite-length last-boundary tail.  It also
records that a finite sampler is not a Christoffel--Darboux radical and that
mask-coordinate signs alone do not orient physical `X/O` slots.

The locked odd-half-integer carrier gives the exact phase `i^N`.  For `N>=2`
the flat Weber kernel has a convergent inverse-power expansion, and its
finite-Fejer scalar sum is an exact tower of additive modulo-four twists of
`-zeta'/zeta` and `L'/L(s,chi_4)`, with the necessary two-adic corrections.
This identity is restricted to `sigma>0`; the zero-damping boundary and the
complete weighted composition remain open.

The direct source correlation proves, before scalar masks, that both physical
boundaries occupy the ordered upper slot `X_j -> O_k`, while the adjoint is
`O_j -> X_k`.  Its pole--Archimedean--prime signs are `(-,+,+)`, and its
ordered prime triple has `m` in the left sampler and `ln` in the right
sampler.  The `M=infinity` ordered limit is the physical form.  The finite-`M`
construction is only a cross regularization and is not a global radical, so
no finite-`M` radical identity or automatic Hermiticity is used.  The same
source formula validates the pure-carrier logarithmic-derivative core and the
exact finite-`L` correction without a mask orientation table.

The source kernel retains a nonzero Archimedean `1/r`/Carleman principal on
the full profile space.  Its compressed sign on the actual transition
columns is not determined.  Therefore `PA`, unvendored/unhashed `EH`, the
complete transition operator estimate, Weber-edge cancellation, edge--bulk
and anchor crosses, critical boundary values, a whole-span central floor,
the fixed-`mu_0` singleton/`P_0` Schur gate, residual action, equation (5.2),
determinant control, RH, and every Lambda bound remain unproved.  The three
focused modules pass `36/36`, the eighty-five-module frontier passes
`926/926`, and the exact 97-module `replay.sh` unittest block passes
`1054/1054`.  Canonical discovery contains `2448` tests, and raw worktree
discovery contains `2470` because two immutable post-checkpoint modules add
exactly `22` excluded tests.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.11 ordered two-jet and higher-sampler reductions

Checkpoint 1.11 corrects two tempting shortcuts without claiming the
remaining central estimate.  Finite Fejer weights do not preserve the
continuation `a_M(L+t)=lambda b_M(t)`.  In the ordered unweighted Poisson
limit the complete profiles do satisfy that continuation on the endpoint-null
space `eta=0`, but substitution gives the separated Hermitian block

\[
 {1\over2\lambda}\begin{pmatrix}0&T\\T^*&0\end{pmatrix},
\]

whose nonzero eigenvalues occur as `+/-s_nu(T)/(2lambda)`.  It is not a
positive Carleman square and does not by itself establish `PA`.

The corrected endpoint rows
`eta(f)=f(lambda)` and
`rho(f)=-(2lambda/c)f'(lambda)-c eta(f)` have, on fixed labels `8,12`, the
normalized limiting matrix `[[1,1],[-17,-25]]` with determinant `-8`.
Consequently the deterministic two-jet shear is eventually stable.  This
`rho` is a source endpoint-jet row, not the outward test row
`beta_0-lambda beta_L`.  On `eta=0`, both compact and reciprocal internal
`q=2` atomic families factor through `kappa=f'(lambda)`; their Hermitian
contribution has rank at most two and no rest--rest block after also imposing
`kappa=0`.  The next `q=3` row
contains the unresolved `alpha^2` endpoint moment.  With an anchor floor
`kappa_0 L D_A`, an `o(L)` cross suffices for `o(L)` Schur erosion; only an
`o(1)` erosion requires the stronger `o(sqrt(L))` cross.

For every coherent `m,l>=2` pair, the affine Abel corner is exactly a
difference of two positive Cauchy Grams and can be negative.  Its physical
coherent compression is nevertheless uniformly `O(1)` in `D` coordinates,
by the exact summable majorant
`sum 1/(ml(m+l))=2 zeta(3)-3/2`.  The curved post-Plemelj regular block is
reduced, not closed: its `x>=1` geometric factors are dimension-free, while
the cutoff-matched scalar gate `mathfrak S^sharp_{>=2}(L)=o(L)` must also
contain the exact hard `m_a` factorization on `x<1`.  The unweighted
constant-amplitude modulo-four residues cancel at `s=1`, but their finite
Fejer coefficient generally does not.

Thus `PA`, the retained `Gamma` row, the coherent `q=2` row bound, the `q=3`
and Volterra rows, the complete Mellin/Bernoulli frame, the hard scalar gate,
all `m=1` channels, Weber-edge cancellation, edge--bulk/anchor crosses, raw
prime discrepancy, a complete central floor, singleton/`P_0` Schur control,
residual action, equation (5.2), determinant control, RH, and every Lambda
bound remain open.  The two focused modules pass `23/23`, the
eighty-seven-module canonical frontier passes `949/949` in `188.752` seconds,
and the exact 99-module `replay.sh` unittest set passes `1077/1077` in split
fresh frontier/support runs totaling `2636.181` seconds.  Canonical discovery
contains `2471` tests; raw worktree discovery contains `2493` because two
other immutable post-checkpoint modules contribute exactly `22` excluded
tests.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.12 realized local packet and complete-remainder wall

Checkpoint 1.12 closes the local `m=l=1` realization problem but proves that
the resulting packet cannot be completed by bounding every omitted sector
separately below its scale.

The repaired continuous theorem gives an `m`-dimensional raw negative block
of order `e^(hCL)/L^(2m-1)` under the frozen narrow margins.  Its exact
endpoint normalization is

\[
 {\lambda\over4c}(1+\chi_\alpha)\chi_\beta z_\alpha z_\beta
 = {\pi(1+\chi_\alpha)\over
     8\chi_\alpha\sqrt{J_\alpha J_\beta}}\{1+o(1)\};
\]

the radial mass controls `chi_gamma z_gamma`, not bare `z_gamma`.  The
curved two-endpoint theorem makes the complete local `m=l=1` prime shell
lower order at that raw scale, and the polylog-base corollary preserves the
comparison when the lower cluster grows polylogarithmically.

The vendored Bonami--Karoui action bracket and the locked KRD leakage bound
now realize same-phase labels within `24*pi/L` of both target clusters, with
`d_n<=10 exp(-pi gamma/64)` and `chi_n->1`.  Hence the exterior-defect-white
physical pair is `Theta(L^-1)`, and the realized negative scale is

\[
 \tau_L={c^{hC+o(1)}\over L^{2m}}.
\]

Finite exact rows only reduce dimension: source plus the two Plemelj rows
cost at most three dimensions, the endpoint value row at most a fourth, and
the derivative row at most a fifth.  This does not identify or bound the
remaining physical sectors.

Indeed, for fixed modal count `q` and the complete central form
`Q_X=W_Z(O,O)`, COMMON_RADICAL gives
`|W_Z(O,O)|<=||ZO||^2`, while absolute sampling gives
`-B_out,q D <= Q_X <= B_out,q D` with
`B_out,q=c^(1/2+o(1))`.  On a realized negative subspace `E`, writing
`R_comp=Q_X-Q_loc` therefore yields

\[
 P_E R_{\rm comp}P_E\succeq
   (\tau_L-B_{{\rm out},q})P_E.
\]

When `hC>1/2`, the right side is `(1-o(1))tau_L`.  Thus at least one coherent
combination of mixed/full-profile, equality, transition, midpoint, or
retained-row channels must cancel the local exponential at leading order.
No sector is selected by this inequality.

Nor may the local block simply be relabelled as part of the equality
conductor.  The local representative is the inward--outward cross
`-W_Z(X,O)` with multiplier `(1+chi_j)chi_k`; the equality representative is
the outward--outward form `W_Z(O,O)` with multiplier `chi_j chi_k`.  The
ratio tends to two on realized rows, but their kernels and quadrant
orientations are different.  On the common plus-family, strict-label-range,
zero-integral synthesis licensed by the frozen equality theorem, its Garding
floor is therefore a formal comparison only, and the same-prime equality
term has nonpositive form sign.  Only the complete remainder `R_comp` is
physically forced.

The continuous remainder now has one exact common direct representative.
At finite Fejer cutoff its pole--Archimedean kernel is

\[
 k_{\rm cont}(r)=-2+2\sum_{\nu\geq1}e^{-(2\nu+1)r},
\]

so the apparent `z=1` Laplace row cancels and the remainder is an ordered
odd-Laplace row assembly.  Each cross row is a difference of positive Grams,
with both signs already sharp in one dimension.  On the exact double-null
subspace the inward and outward corner traces vanish, which cancels the
constant local conormal trace but does not control growing one-sided jets.
On the realized polylogarithmic packet, modal placement supplies the leakage
gate needed for the white lower-order `(1,1)` prime-shell estimate.  Only
there may that shell be removed and the forced positive compression be
localized to the sum of this exact continuous remainder and the ordered
non-`(1,1)` prime assembly.  No sign is proved for either summand separately.

The complete affine flat-Weber zero-residue formula is also frozen.  It is a
difference of Grams with two conductor-collar saddles and does not promote
to the curved finite-`c` physical shell.  The finite-`c` subunit package is
rejected; the conditional negative-packet package and the old continuous
and modal candidates are superseded.  Four immutable raw-worktree modules
contribute exactly `48` explicit exclusions.  The failed odd-Laplace
`671d3140...`/`d06c7ff9...` pair is superseded by its repaired strict-PASS
pair.

The nine admitted modules pass `113/113`.  The ninety-six-module canonical
frontier passes `1062/1062` in fresh split runs, and the unchanged
twelve-module support block passes `128/128` in `2421.457` seconds.  Thus the
exact 108-module `replay.sh` unittest set passes `1190/1190` across the split
fresh runs.  Canonical discovery contains `2584` tests and raw discovery
`2632`; a complete canonical recount is still pending.  The complete signed whole-profile
assembly, `PA`, central sign, singleton/`P_0` Schur control, residual action,
equation (5.2), determinant control, RH, and every Lambda bound remain open.
The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.13 ordered-sector feature geometry

The ordered non-`(1,1)` prime remainder splits exactly into a positive
resonance `ln=m` and a nonresonant difference of positive Grams.  On every
fixed-size realized exterior-white packet the resonance is uniformly
`O_q(L^2)=o(tau_L)`, so it cannot provide the forced exponential
compensation.  No sign is proved for the nonresonant frame.  The exact
finite-Fejer identity

\[
 -\mathcal W_Z(X_M,O_M)
 =\mathcal W_Z(O_M,O_M)-\mathcal W_Z(X_M+O_M,O_M)
\]

also shows why the outer-only POST mask decomposition does not transfer to
the direct form: the second term is the complete finite-cutoff radical
defect, and `X_M+O_M` is not itself a radical.

The continuous odd-Laplace remainder is now reduced to its physical feature
geometry.  Centering the exact weighted reflection of the complete inward
profile gives an even multiplicative theta profile with symmetrized
`zeta(s)M_f(s)` Mellin spectrum.  Its odd rows are scale-free Hermitian
crosses between generalized-harmonic and Hurwitz-zeta-tail features; under
the exact source nulls the low rows continue through `z=1` and `z=0`.
Complete monotonicity gives a positive block Gram but no sign for its
off-diagonal cross.  The high odd rows are anti-aligned only in a
fixed-`lambda` asymptotic whose error is not uniform in the transition
parameter.  The exact remaining continuous target is therefore an
exterior-white feature-angle bound on the realized local packet.

At the global zero-feature level, radicality is pointwise:
`ZK=0` and `ZX=-ZO`.  This gives exact antipodal positive and signed `X/O`
Gram blocks, but it does not split the physical zero feature into continuous
and prime components.  Finite `(M,R)` source Krein maps represent the
odd-Laplace rows and the prime rows truncated at `n<=R`; only their signed
cross forms survive the source/Abel and ordered limits.  The untruncated raw
prime feature has divergent positive norm for a generic nonzero repeated
inward row, so no infinite-prime Hilbert map,
positive-Gram identification, or feature-space isometry is available.

An orthogonal sector feature decomposition representing the local block
would imply `tau_L<=B_out,q`, which is impossible in the forced-cancellation
region `hC>1/2`.  The completion must instead use a non-block-diagonal
positive cross-sector Gram.  Constructing the corresponding sector-resolving
Krein intertwiner is now the exact common geometric gate.  The frozen global
identities do not decide whether the forced compensation belongs to the
continuous feature-angle remainder or the nonresonant ordered-prime frame.

The three admitted modules pass `41/41`; the ninety-nine-module canonical
frontier passes `1103/1103`, and with the unchanged twelve-module support
block at `128/128`, the exact 111-module replay set passes `1231/1231`.
Canonical discovery is `2625`, raw discovery is `2673`, and the same four
explicit exclusions account for the `48`-test difference.  No sector sign,
sector-resolving intertwiner, complete central sign, singleton/`P_0` Schur
floor, residual action, equation (5.2), determinant control, RH, or Lambda
bound follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.14 endpoint-null completion and middle-band obstruction

The raw ordered-prime positive feature divergence from checkpoint 1.13 is a
gauge obstruction, not a failure of the signed form.  On a fixed finite
source packet satisfying `f(0)=0`, zero integral, and the actual endpoint row
`eta=f(lambda)=0`, set

\[
 r_{m,l,n}={m\over ln},\qquad
 \mathcal A'=r_{m,l,n}\mathcal A,\qquad
 \mathcal B'=r_{m,l,n}^{-1}\mathcal B.
\]

The scalar factors cancel in `S(A',B')`, while endpoint-null Fourier decay
makes the complete unweighted positive prime norm summable at fixed
`lambda`.  The ordered finite-`R`, finite-`M` features therefore converge in
that renormalized Hilbert norm.  Combining them with the endpoint-null
continuous odd tower gives

\[
 T^*JT=Q_X=Z_O^*\Sigma Z_O.
\]

After quotienting the fixed coefficient packet by the source-synthesis
kernel, `T` is injective and

\[
 U_0=Z_OT^\dagger,\qquad U_0T=Z_O
\]

is a bounded packet-level signed intertwiner.  Its positive metric

\[
 G_0=U_0^*U_0=T^{\dagger *}(Z_O^*Z_O)T^\dagger
\]

is packet-, zero-feature-, and gauge-dependent.  No growing-`lambda` uniform
bound, canonical generator extension, or sectorwise positive Gram follows.
Thus the unqualified checkpoint-1.13 intertwiner obligation remains open;
only its endpoint-null fixed-packet version is closed.

At generator level the completed carrier has a paired Hadamard
complex-symmetric factorization with a minus sign and no conjugation.  After
the exact critical-variable change, its Hermitian Pick kernel is positive on
the entire upper half-plane if and only if all `Xi` zeros are real.  Global
Pick positivity is therefore RH-equivalent.  The physical finite packet asks
only for a special source-integrated compression, so this equivalence neither
proves nor disproves its one-sided sign.  The asymptotic family of packet
conditions is not shown RH-equivalent: no requisite density or separation
theorem is proved.

The continuous local mass also does not live in the fixed odd rows or the
fixed-`lambda` high-row tail.  For `Delta=CL+O(1)`, the exact flat Kummer
product satisfies

\[
 {2\over c}\sum_{\nu\geq1}
 F_\Delta\left({2\nu+1\over c}\right)
 ={2(e^{h\Delta}-1)\over\Delta}
 +O\left({e^{h\Delta}\over c}\right).
\]

The rows `z=Theta(c/L)` contain a fixed fraction of this Cauchy mass.  The
band through `c K log(L)/L`, for `K>8m/C`, approximates the complete local
two-cluster matrix below its smallest singular scale
`e^(hCL)/L^(2m-1)`, or `tau_L` after physical whitening.  One `z=1` null or
any fixed `r<m` rows leaves at least `m-r` negative directions at that scale.
Consequently a favorable full continuous theorem must establish coherent
same-scale cancellation with the generalized-harmonic/Hurwitz aliases.  The
alias sign is not determined here.

The repaired middle-band pair supersedes the failed
`ef43c753...`/`9d6e6f3d...` bytes, whose individual-row calculation omitted
the fixed-linear base slope.  The admitted three modules pass `40/40`; the
102-module canonical frontier passes `1143/1143`; and the exact 114-module
replay set passes `1271/1271` with the unchanged twelve-module, `128/128`
support block.  Canonical discovery is `2665`, raw discovery is `2713`, and
the same four explicit exclusions account for the `48`-test difference.  No
uniform sector intertwiner, sector sign, complete central sign,
singleton/`P_0` Schur floor, residual action, equation (5.2), determinant
control, RH, or Lambda bound follows.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 1.15 completed continuous sector and ordered-prime compensation

Checkpoint 1.15 resolves the middle-band alias and complete odd-tail gates
on the same fixed-dimensional realized packets.  Direct one-sided physical
row bounds, exact Euler-resolvent identities, and a curved/hard jump-measure
argument show that every generalized-harmonic/Hurwitz alias in
`3<=z<=c K_0 log(L)/L` is `o(T_L)`, with `K_0>8m/C`.  Hence

\[
 P_E\widehat Q_{\rm full}^{I_L}P_E
 \preceq-{c'_m\over2}T_LP_E.
\]

After adding the uncorrected modal local pole row to the fixed null
inventory, the complete-tail theorem subtracts the already controlled local
block and bounds only the ordered alias slots.  It does not use the false
modal `z=0` estimate or a nonuniform whole-profile jet expansion.  Every odd
row outside `I_L` is `o(T_L)`, the complete corrected `z=1` row kills the
remaining `z=0` row, and the six-row-null packet satisfies

\[
 P_E\widehat Q_{\rm cont}P_E
 \preceq-{c'_m\over4}T_LP_E.
\]

On the polylogarithmic-base packet only, `1/2<hC<1`, checkpoint 1.15 also
imposes `g(0)=0`, so `m>7` leaves a nonzero seven-row intersection.  The
exact complete decomposition

\[
 \widehat Q_X=\widehat Q_{\rm cont}+\widehat Q_{p,11}
              +\widehat Q_{\rm res}+\widehat Q_{\rm off}
\]

has no leftover component.  Absolute sampling, the local prime-shell
corollary, and the ordered-resonance theorem make the comparison errors
`o(T_L)`.  Therefore

\[
 P_E\widehat Q_{\rm off}P_E
 \succeq {c'_m\over8}T_LP_E.
\]

This is forced cancellation between a negative continuous form and a
positive compressed ordered nonresonant prime form; it is not positivity of
the complete central form.  The reciprocal gauge gives convergent
fixed-`lambda` positive branches, while the dyadic localization shows that
the complement of `n<=c^(5-hC+delta)` and
`m,l<=c^(4-hC+delta)` is `o(T_L)`.  Among `O(L^3)` retained ordered boxes,
one has a positive eigenvalue `>=const*T_L/L^3`; no boxwise Loewner bound is
proved.

The Euler `045e1e1b...`/`70b6d3b7...`, curved
`7ed2fed9...`/`80cb2a81...`, full-tail
`db40ed98...`/`78bbaae7...` and intermediate `5daccdeb...`, and forced-prime
`198a918f...`/`3db15eeb...` candidates are rejected or superseded at the
same paths.  They do not add raw modules.  The six admitted modules pass
`91/91`; the 108-module canonical frontier passes `1234/1234`; and the exact
120-module replay set passes `1362/1362` with the unchanged twelve-module,
`128/128` support block.  Canonical discovery is `2756`; current raw
discovery is `2831`, comprising the canonical set, the carried `48` excluded
tests, and two explicitly unadmitted post-checkpoint candidates with `12`
hard-tail PNT/Gram tests and `15` far-annulus large-sieve tests.
The fixed-linear compensation, complete central sign, singleton/`P_0` Schur
floor, residual action, equation (5.2), determinant control, RH, and every
Lambda bound remain open.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.16 hard-tail removal and coherent edge discrepancy

Checkpoint 1.16 controls the complete ordered-prime hard complement on the
same fixed-dimensional seven-row packet.  The hard-tail PNT--Gram identity
is kept exact: for the `l=1` window it separates a positive lattice Gram,
one von-Mangoldt discrepancy cross, and the positive resonance diagonal.
Its Stieltjes formulas are ordinary fixed-`lambda` identities and invoke no
prime-number theorem.

The transition rows `A<n<2A` satisfy the exact fold large sieve

\[
 \left\|\sum a_nT_n\right\|^2
 \ll L^{K_0}A^{-1/2}\sum|a_n|^2,
\]

and dyadic annuli `2A<=X<Y<=2X` satisfy

\[
 \left\|\sum a_nT_n\right\|^2
 \ll {A\log(2X)\over LX^2}\sum|a_n|^2.
\]

The first estimate keeps the true regular-Bessel fold; the second uses the
exact exterior Pruefer carrier.  Elementary Chebyshev estimates suffice for
the arithmetic weights.

At finite Fejer and prime cutoffs all `l>=1` rows in the hard coordinate
set `m>A,n>A` can be grouped only in the right slot.  The limiting divisor
coefficient is

\[
 {\cal P}_A(k)=\sum_{n\mid k,\ n>A}\Lambda(n)\leq\log k.
\]

Consequently

\[
 \|P_EQ_{>>}^{\rm raw}P_E\|+
 \|P_EQ_{{\rm off},>>}P_E\|=o(T_L),
 \qquad T_L={A^\sigma\over L^{2m}},\quad \sigma>{1\over2}.
\]

This estimate fails closed at `sigma=1/2`.  It moves the forced positive
ordered-prime compensation to the exact edge union `m<=A or n<=A`, but
does not assign it to either branch separately.

The edge subtraction gives an exact moving-divisor form
`Q_mov=(1/4)S(C,P)`.  Complete matching now yields

\[
 \|P_E(Q_{\rm mov}+Q_{\rm cont})P_E\|=o(T_L),
 \qquad P_EQ_{\rm mov}P_E\succeq {c'_m\over8}T_LP_E.
\]

The positivity is compressed and inherited; it is not a positive-square
identity for `Q_mov`.  After the logarithmic change of variables, the exact
surviving feature is

\[
 \left.Q_{\rm mov}\right|_E
 =\left.S(\mathfrak a,{\cal V}_{\mu_D}\mathfrak b)\right|_E,
 \qquad
 \mu_D=\sum_{n\geq2}{\Lambda(n)\over n}\delta_{\log n}-dr.
\]

The Lebesgue density cancels the continuous pole before `A_0=0` is used.
The discrepancy cross is therefore forced at scale `T_L`, but it is not
bounded directly by an arithmetic discrepancy theorem.

The ordinary-endpoint mixed-Weber analysis excludes a pairwise shortcut:
the truncated slow carrier lacks an `exp(-h_0 beta)` factor, and no fixed
endpoint jet restores it.  The valid endpoint cancellation appears only
after forming the complete ordered inward profile, whose hard endpoint
factors through the imposed `Gamma_out=0` row.

The old hard-tail `3630a07d...`/`45247498...`, edge
`ae3bdeb9...`/`921bd23d...`, moving-discrepancy
`99dcf547...`/`9dd2f775...`, and mixed-Weber
`845a7c27...`/`476ce209...` pairs are rejected or superseded at the same
paths and add no raw modules.  The seven admitted packages pass `91/91`;
the 115-module canonical frontier passes `1325/1325`; and the exact
127-module replay set passes `1453/1453` with the unchanged twelve-module,
`128/128` support block.  Canonical discovery is `2847`, raw discovery is
`2895`, and the four carried exclusions account for the `48`-test
difference.  Complete central sign, the singleton/`P_0` Schur floor,
residual action, equation (5.2), determinant control, RH, and every Lambda
bound remain open.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.17 zero-orbit and lower-Ritz graph barriers

Checkpoint 1.17 admits exactly two fail-closed internal packages.

The first package rewrites the already-forced coherent discrepancy through
the canonical inverse-Laplace distribution of

\[
 \mu_D=\sum_{n\geq2}{\Lambda(n)\over n}\delta_{\log n}-dr.
\]

The finite convolution row vanishes at the origin, so every formal
`delta_0` term is killed before the canonical zero and trivial-zero sums are
taken.  After the trivial-zero tower cancels the continuous odd-Laplace
contribution, the complete central form becomes the exact zero-row cross

\[
 Q_X=-\sum_\rho^{\rm can}
 \mathsf S(\mathcal A_{L,1-\bar\rho},\mathcal B_{1-\rho}).
\]

This is a structural rewrite of complete matching, not a new estimate.  A
critical-line pair becomes a positive Gram only after the physical parity
and radical relations are used.  An off-line quartet has exchange
signature, and no uniform source-to-row intertwiner identifies the
row-Krein form with a positive Hilbert feature.  Weighted Mertens
integration by parts leaves a periodic-Bernoulli derivative and the corner
row `J_L`, so neither absolute BV nor termwise mixed-Weber bounds close the
coherent discrepancy estimate.

The second package places the determinant graph route at the mandatory
lower Ritz shift `u`.  Under the still-unproved hypotheses

\[
 B=A-uI\succ0,\qquad Q_--uI\succ0,
\]

the exact quotient identities are

\[
 a^2\langle b,B^{-1}b\rangle
 =\rho_R^*\mathfrak B^\dagger\rho_R,
 \qquad
 \langle g_z,B^{-1}g_z\rangle
 =y_z^*\mathfrak B^\dagger y_z,
 \quad \mathfrak B=W^*BW.
\]

Their product is a sufficient majorant only.  With
`mathfrak C=W^*(A-mu I)W`, the exact mixed quotient row is, up to the fixed
inner-product convention,

\[
 a\widehat z_\mu(z)=-y_z^*\mathfrak C^\dagger\rho_R.
\]

The logically minimal compact target is

\[
 \sup_{z\in\Omega}|y_z^*\mathfrak C^\dagger\rho_R|\to0.
\]

At the lower Ritz shift the first inverse energy is exactly `d+chi_u`,
where `d=q-u` and the spectral-spread term `chi_u` is nonnegative but has no
frozen source upper bound.  A full sampling-to-signed-graph Loewner
comparison would bound it but is strictly stronger than the row-specific
requirement.  The Mellin leverage remains a separate missing inequality.
If both comparisons held, the exact sufficient scale would be

\[
 {\epsilon_\lambda\over d_8}C_R C_E M_\Omega(L)\to0,
 \qquad {\epsilon_\lambda\over d_8}
 =O(\lambda^{-5}\operatorname {polylog}\lambda)+o(\lambda^{-8}).
\]

The transition packet does not repair either factor: there is no proved
capture or reducing relation with the cyclic forcing or Mellin spans, and
the positive ordered-prime frame cancels the continuous block at its
leading scale.  The exact lower-Ritz source-Cauchy model has product tending
to `pi`; an orthogonal transition-noncapture model makes it diverge.  The
stronger scalar shift `U_Z` is not used because `q<=U_Z`; both signs at
`U_Z` would imply the `q`-shift signs and already cross the RH-level core
gate.

The rejected zero-orbit `63f3091e...`/`75a3fe05...`, rejected `U_Z` graph
`1d740658...`/`7a704466...`, and superseded lower-Ritz pre-audit
`a60d5cf2...`/`26d5d820...` pairs occupied the same final paths and add no
raw modules.  Their exact defect histories are recorded in `SOURCES.md`.

The two admitted modules pass `22/22`; the 117-module frontier passes
`1347/1347`; and the byte-unchanged twelve-module support block retains its
checkpoint-1.16 `128/128` result, giving an exact 129-module replay inventory
of `1475/1475`.  Canonical discovery is `2869`, raw discovery is `2917`, and
the four carried exclusions contribute `48`.  The direct coherent
discrepancy bound, uniform zero-row intertwiner, lower-Ritz signs, graph and
Mellin comparisons, equation (5.2), determinant control, RH, and every
Lambda bound remain open.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.18 growing low-prefix residual decomposition

Checkpoint 1.18 sharpens the low-prefix side of the residual program without
closing the full residual action.  For each fixed prefix, complete
defect-white cross asymptotics give

\[
 \Delta_M^{-1/2}H_M\Delta_M^{-1/2}
   =(\log c)T_M+o_M(\log c),\qquad T_M\succeq I/4.
\]

The exact label-`4/12` row is not small: normalized by `d_8L` it tends
to the positive constant \({\cal G}_8\sqrt{14/99}\).  This invalidates the
earlier sufficient transverse-cross smallness route, but is compatible with
the fixed-prefix Schur floor.

For the growing slow prefix `Q<=C_0L`, all equality, centered multiplier,
same-side non-equality, reflected, pole, origin-bump, and projection rows are
kept in one ordered decomposition:

\[
 \widehat Q_{X,Q}^{\#}
  =(\log c)J_Q^*T_{Q+1}J_Q+P_Q+E_Q,
 \qquad P_Q\succeq0,\quad\|(E_Q)_-\|=o(L).
\]

Consequently the endpoint-sheared even outer and compact matrices have floor
`L/8`.  The residue-two odd prefix has the same floor; its negative
reflected continuous and pole rows are `o(1)`.  In physical coordinates,

\[
 P_{{\cal K}_Q}B_uP_{{\cal K}_Q}
 \succeq (L/8-o(\lambda^{-4}))\Delta_Q,
\qquad
 V_Q^*V_Q\succeq cL/\lambda^2,
\]
\[
 cd_8I\preceq\Delta_Q\preceq C\lambda^2/L.
\]

The half-power far cross is superpolynomially small and its Schur erosion is
`o(L)`.  Thus the captured slow-prefix and far-complement pieces no longer
supply the leading unresolved residual loss.

Two pieces remain outside this floor.  The first is the one-dimensional
mixed bridge
`b=h_2-(I_2/I_0)h_0`.  Endpoint nulling leaves modal energy
`Theta(d_2)` and a nonzero origin value.  Treating its beta term in the raw
gauge produces a divergent pole row, while treating its shrinking bump
separately costs `Theta(lambda^(-1))>>d_2`.  Its limiting Mellin feature is
\(-2^{3/4}\xi(s)/s\).  A bound for either separately split boundary carrier
is RH-equivalent.  The residual ledger therefore requires a coherent,
ordered modal--beta--bump finite-part/Plemelj cancellation with negative
load `o(Ld_2)`; checkpoint 1.18 does not prove it.

The second piece is the signed retained complement
`R_Q=Y\ominus{\cal K}_Q`.  Its isolated near row is exactly

\[
 2\Re\langle C_1\phi,C_\Lambda\phi\rangle,
\]

and a finite collar samples the Fejer-averaged Wiener--Hopf symbol.  The
explicit quasimode fixes the normalization factor `1/8`, but no
unbounded-schedule negative-index density theorem or admissible physical
lift is available.  Fixed-plane capture and fixed-`lambda` codimension-two
density do not imply the required growing graph-norm floor.

The radical quotient and invisible-origin retraction explain the remaining
domain issue.  Ordinary even `L2` zero sampling is not closable because the
radical kernel is dense.  The absolute-sampling completion is well-defined
but signed.  The retraction preserves the compact central state exactly and
the pure codimension-two modal union is fixed-`lambda` dense, yet no
growing-prefix graph-norm approximation follows.  Captured graph-core
density plus positivity is itself RH-strength.

The logarithmic-WKB draft is excluded.  The admitted fractional-frame
theorem supplies only the `o(L)` centered multiplier estimate used above.
All thirty admitted modules pass `348/348`; canonical/raw discovery is
`3217/3275`, with `58` explicitly excluded tests.  No complete
mixed-bridge floor, retained-complement sign, full residual action, equation
(5.2), determinant control, RH, or Lambda bound follows.  The terminal state
remains `P0_INVALIDATED`.

## Checkpoint 1.19 coherent bridge and retained Feshbach decomposition

Checkpoint 1.19 removes the finite one-dimensional bridge from the leading
residual loss.  On the captured even--odd cap plus the endpoint-sheared
bridge, the coherent beta diagonal and row estimates are

\[
 q_{bb}={A_\lambda^2C_\xi\over4\lambda}+o(\lambda^{-1}),
 \qquad C_\xi=2+\gamma_E-\log(4\pi)>0,
\]
\[
 \|\Lambda_QD_{C,Q}^{-1/2}\|^2=o(L/\lambda).
\]

After the checkpoint-1.18 captured `L/8` floor is inserted, the complete
finite mixed block has a positive floor relative to
`diag(D_C,lambda^(-1))` and to the actual corrected exterior Gram.  The
ordered proof keeps the `s=1` residue inside the combined kernel and retains
the bridge bump as the gauge representative of the leading beta self.  It
does not supply a general zero-row Plemelj theorem.

The leading unresolved residual is now the retained short.  With captured
pivot `A_theta`, bridge pivot
`q_1=q-r A_theta^(-1)r*`, and retained blocks `X,y,R`, exact congruence gives

\[
 S_{\mathcal R,\theta}=R_\theta-X_\theta A_\theta^{-1}X_\theta^*
 -(y_\theta-X_\theta A_\theta^{-1}r_\theta^*)
 q_{1,\theta}^{-1}
 (y_\theta^*-r_\theta A_\theta^{-1}X_\theta^*).
\]

The complete shifted sign is equivalent to
`S_(mathcal R,theta)>=0` once the two proved pivots are positive.  The first
return costs `1/L`; the bridge return costs `O(1)`.  Moreover
`dim mathcal R_Q=R-O(L)~R`, so the finite captured-plus-bridge floor cannot
be promoted by exhaustion.

Current negative-index estimates reduce but do not orient this operator.
The polynomial compressed trace loses its rank gain at the half-power
cutoff, and the available complete estimates leave exponential index.  The
actual inclusive von-Mangoldt multiplier gives a source-defined dangerous
space of dimension `O(L)+exp(O(lambda))`; its pullback through the harmonic
lift leaves a strictly positive zero-metric safe block and an exact finite
Feshbach obstruction.  For the desired positive source-angle subtraction,
an additional safe-space metric inequality is still missing.

At the PNT edge the multiplier obeys
`m_lambda(z/L)=-4 lambda cos(z)+o(lambda)`.  Critical periodic
Wiener--Hopf compression maps `q(Lt)` to its period mean, so the leading
cosine vanishes exactly while its positive and negative deficit pieces are
both `Theta(lambda)`.  The remaining arithmetic discrepancy is therefore
the sign-carrying term, and the local `o(lambda)` PNT remainder cannot decide
an `O(L)` or constant Feshbach margin.

The five modules pass `58/58`; canonical/raw discovery is `3275/3333`, with
the same `58` explicitly excluded tests.  The finite mixed bridge is closed,
but no retained-complement sign, complete residual action, equation (5.2),
determinant control, RH, or Lambda bound follows.  The terminal state remains
`P0_INVALIDATED`.

## Checkpoint 1.20 signed-discrepancy Feshbach passivity scale

The actual multiplier-dangerous numerator now has the exact centered form

\[
 \mathfrak B_{\epsilon,\sigma}(u,y)
 = (\sigma-U_Z)\langle u,y\rangle
 +\int_0^L g_\lambda(t)
 C'_{u,\mathsf E_{\epsilon,\sigma}y}(t)\,dt,
 \qquad
 g_\lambda=D_\lambda-H_{\rm tail}-{c_*\over2}.
\]

Thus at `sigma=U_Z` no scalar reserve remains.  Total variation gives only
`O(lambda)`, the pinned PNT magnitude diverges even for a fixed Fourier mode,
and the actual dangerous space has no frozen derivative-graph bound.
Positive-real transfer is unconditional only for `Re(s)>=1/2`; continuation
to `Re(s)>0` is exactly RH.  Removing the safe damping `eta=1/2` costs
`lambda^(-1)`, whereas the even target is
`lambda^(-1/2)/polylog(lambda)`.  A damping small enough to preserve that
target would already require an unproved zero-free strip.  The available
frequency-dependent critical-line estimate leaves negative off-line wells,
an `O(L^2)` Fejer gap, and variable-damping projector commutators.

The fixed finite dangerous restriction is not itself RH-equivalent.  However,
exact Feshbach equivalence identifies its positive inf--sup with the complete
`U_Z`-shifted block.  Because `q<=U_Z`, paired widening-schedule `U_Z` signs
imply the paired `q`-shifted signs and hence the frozen RH-level widening-core
gate; density of the dangerous spaces is unnecessary.  The genuinely lower
Ritz route is individually weaker, but its centered scalar also vanishes and
no frozen bound reaches the required coframe scale.

The one module passes `11/11`; canonical/raw discovery is `3286/3344`, with
the same `58` explicitly excluded tests.  The 153-module frontier and
165-module replay inventories contain `1764` and `1892` tests.  The prior
checkpoint-1.19 replay passed `1881/1881`, but the expanded frontier and replay
were not rerun.  No even or odd multiplier-dangerous inf--sup, retained sign,
complete residual action, equation (5.2), determinant control, RH, or Lambda
bound follows.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.21 centered-zero Krein factorization barrier

After the boundary alias and complete parity-pole scalar are centered, the
remaining two-sided finite-interval form has exact multiplier

\[
 M_L(\tau)=-2\tau\int_0^L g_\lambda(t)\sin(\tau t)\,dt.
\]

Keeping the singular small endpoint and inclusive large endpoint together,
then using the paired Hadamard expansion, gives on the frozen finite
Fourier/source class

\[
 \mathcal Q_{L,\epsilon}(u,w)
 =2\epsilon\sum_{\mathfrak p}
 \overline{A_u(\overline z_{\mathfrak p})}A_w(z_{\mathfrak p}).
\]

The series is absolutely convergent.  Critical-line orbits give positive
squares in both parities.  Every complete off-line quartet has exact Krein
signature `(1,1)`, with diagonal expression

\[
 \epsilon\{|A_f(z)+A_f(\overline z)|^2
            -|A_f(z)-A_f(\overline z)|^2\}.
\]

Thus functional-equation pairing is not an unconditional Hilbert-square
factorization.  The endpoint remainder vanishes exactly.  At an admissible
centering value `sigma=S`, the harmonic lift is the same unshifted lift `E_Q`
for `S=U_Z` and for a nonnegative lower-Ritz shift, so no `q-u_R` scalar
reserve remains at centering.

These identities do not determine the sign on the actual restricted
dangerous spaces; a fixed finite compression can mask a negative Krein
channel.  Along the widening schedule, paired eventual `U_Z` signs remain
RH-strength through `q<=U_Z` and the frozen core gate.  No dangerous-space
density claim or converse from RH to a fixed finite sign is asserted.

The one admitted module passes `13/13`.  Canonical/raw discovery is
`3299/3357`, with the same five exclusions contributing `58`.  The 154-module
frontier inventories `1777` tests and the 166-module replay inventories
`1905`, decomposed as the byte-unchanged 12-module, 128-test support block
plus that frontier.  The expanded checkpoint-1.20 and checkpoint-1.21
frontier, replay set, and complete canonical suite were not rerun.  No
dangerous inf--sup, coframe floor, lower-Ritz sector theorem, retained sign,
complete residual action, equation (5.2), determinant limit, zero statement,
RH, or Lambda bound is proved.  The terminal state remains `P0_INVALIDATED`.

## Checkpoint 1.22 fixed source-block shift asymptotics

For each captured source depth `m` fixed independently of `lambda`, the
physical anchor quotient and the smallest restricted even and odd Ritz
values now have the exact scale separation

\[
 {q\over d_4L}\longrightarrow {\Gamma_0\over A_4^2},\qquad
 {\mu_{+,m}\over d_8L}\longrightarrow
 {\tau_m\over\|W_{8,\infty}\|_2^2},\qquad
 {\mu_{-,m}\over d_6L}\longrightarrow
 {\tau_m\over\|K_6\|_2^2}.
\]

Here `tau_m` is the first-coordinate Schur reserve of the fixed Toeplitz
matrix and satisfies `tau_m>=1/4`.  Together with the exact defect ratios and
`0<=q<=U_Z=o(d_6)`, this proves eventual `q`- and `U_Z`-shift positivity on
both fixed captured blocks.

The result is tied to the exponentially resolved locked projection
`N_proj=2^(9600 lambda^2)`.  The exact compact-projection error condition
already requires, on the anchor diagonal, an exponential threshold with
`log N_proj>4 pi lambda^2+O(log lambda)` sufficient.  A fixed Fourier cutoff
or `N_proj=O(L)` does not resolve the `d_j L` scales.  The result is also only
fixed in source depth: it supplies neither a uniform coefficient asymptotic
for `m=O(L)` nor a whole-sector or retained-complement theorem.

The one module passes `11/11`; canonical/raw discovery is `3310/3368` tests
in `297/302` modules, with the same five exclusions contributing `58`.  The
155-module frontier and
167-module replay inventories contain `1788` and `1916` tests, decomposed as
the frontier plus the byte-unchanged 12-module, 128-test support block.  The
expanded checkpoint-1.20 through checkpoint-1.22 frontier, replay set, and
complete canonical suite were not rerun.

Checkpoint 1.22 proves, on the locked exponentially resolved schedule and
for every fixed captured source depth, the asymptotics `q asymp d_4 L`,
`mu_{+,m} asymp d_8 L`, and `mu_{-,m} asymp d_6 L`, with Toeplitz Schur
reserve `tau_m >= 1/4`. Hence both fixed captured blocks are eventually `q`-
and `U_Z`-shift positive. This is not a whole-sector result: the captured
ranges are not proved exhaustive, dense graph cores, or reducing; the
retained multiplier-dangerous complement remains uncontrolled; the
fixed-depth asymptotics are not uniform at growing source depth; and fixed
or `O(L)` Fourier cutoffs do not resolve the exponentially small defect
scale. The finite `N=7,14` diagnostics are noncertifying. No effective
threshold, whole-sector sign, dangerous inf--sup, equation (5.2), determinant
limit, zero statement, RH, or Lambda bound is proved. The formal state
remains `P0_INVALIDATED`.

## Checkpoint 1.23 nested Feshbach and lower-Ritz feature barriers

The exact multiplier reduction now distinguishes three successive pieces:
the safe harmonic coordinate, the returned harmonic shadow of a fixed
physical captured block, and the uncaptured multiplier-dangerous coordinate.
If the safe and harmonic captured pivots are positive, two exact Schur
congruences reduce the sector sign to the final uncaptured short.  The
checkpoint-1.22 physical fixed-block floor does not imply the harmonic pivot,
and exact source-Cauchy multiplier models show that neither it nor the final
uncaptured sign follows from the frozen structural data.

The lower-Ritz alternative has also been reduced exactly.  Its inverse
spread is the retained shorted Ritz-residual energy `chi_u`; the true ground
correction splits into its Ritz-line component and a Galerkin error whose
shifted energy is at most `chi_u`.  The determinant observable is therefore
bounded by a direct row plus the product of `chi_u` and the retained Mellin
leverage.  Exact `N=1` and `N=2` source-Cauchy families show that neither term
can be dropped.

Ambient interpolation detects the two real channels of a hypothetical fixed
off-line quartet, even after Fourier projection and even-anchor removal.  It
does not control the corresponding two-by-two Gram after the actual
multiplier-dangerous projector and full exterior metric are imposed.  Other
zero features can mask the negative channel in a finite compression.

On the actual multiplier side, zero-extension gives an exact boundary gauge
for the complete combined symbol.  The pure-edge model blocks a phase-angle
deduction from boundary geometry alone.  An exact Chebyshev-error rewrite
reduces the lower-Ritz numerator to one signed high-prime history, but the
pinned FKS envelope does not resolve a polynomial lower shift.  The actual
label-12 row supplies `r >= (C_12+o(1)) d_8 L`, so the direct Mellin term would
close from `q-u=O(d_4 L)`; neither that estimate nor the independent residual
inverse-row bound is proved.

The six modules pass `60/60`; canonical/raw discovery is `3370/3428` tests
in `303/308` modules, with the unchanged five exclusions contributing `58`.
The 161-module frontier and 173-module replay inventories contain `1848` and
`1976` tests, the latter comprising the frontier and the byte-unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.23 frontier, replay set, and complete canonical suite were not
rerun.

No actual sector sign, dangerous angle or metric-Gram floor, equation (5.2),
determinant limit, zero statement, RH, or Lambda bound is proved.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 1.24 post-far lower-Ritz row reductions

The proposed fixed-low-mode residual capture is false for the pinned
arithmetic matrices.  The actual label-16 coordinate is asymptotic to a
strictly positive constant times `sqrt(d_4 d_16)L`, while
`sqrt(d_4 d_16)/d_8` grows like `lambda^4`.  Hence
`||b||/(d_8L)` diverges and the label-12 direction occupies only
`O(lambda^(-4))` of the normalized residual.  The exact smallest direct
replacement is

\[
 q-u={\|b\|^4\over\langle b,(A-uI)b\rangle},
\]

so the missing scalar lemma is a forward-action lower bound, not ordinary
fixed-feature capture.

On the unproved strict lower-Ritz branch, two exact eliminations split the
forcing inverse energy into far, captured, and retained terms:

\[
 b^*(A-uI)^{-1}b
 =b_F^*H_u^{-1}b_F+c^*P^{-1}c
   +\rho_1^*R_1^{-1}\rho_1.
\]

The retained target is precisely the one-row Loewner estimate

\[
 \rho_1\rho_1^*\preceq C d_4L R_1.
\]

Pure source labels do not place the physical anchor in the growing
endpoint-null prefix, and invertible metric re-coordination cannot enlarge
that range.  Even an ideal prefix floor and prefix dual row leave an exact
nonnegative retained inverse-energy term.

The fixed-anchor BV/Cauchy theorem supplies the missing raw high-Fourier
decay and proves

\[
 b_F^*H_u^{-1}b_F=o(d_4L).
\]

Thus the far row is closed.  The exact post-far captured row differs from
the raw growing anchor row by a return of squared norm `o(d_4L^2)`, and its
post-far metric is a `1-o(1)` multiplicative perturbation of the raw prefix
metric.  Consequently the captured inverse-energy estimate is equivalent
to the raw growing anchor inverse row, which remains unproved.

The actual multiplier-safe split gives a safe inverse term plus an
`exp(O(lambda))`-dimensional returned dangerous term.  Positive sampling
bounds the safe inverse term only with a polynomial loss, but the associated
compact-strip Mellin cross tends to zero.  If the dangerous space is instead
enlarged by `span{rho_1}`, its safe forcing is exactly zero and

\[
 \rho_1^*R_1^{-1}\rho_1
 =d_\rho^*S_\rho^{-1}d_\rho,
 \qquad \dim\mathcal D_\rho\leq\exp(O(\lambda))+1.
\]

The remaining Loewner row on `S_rho` is not proved.  Independently, the
source-normalized captured determinant response is `o(1)` uniformly on
every fixed compact strict Mellin strip and every ridge `s>=0`, including
the actual ground ridge.  The far and retained response summands remain
separate.

The seven focused modules pass `64/64`; frozen canonical/raw discovery is
`3434/3492` tests in `310/315` modules, with the unchanged five exclusions
contributing `58`.  A seven-test ground-ridge overlay created after the
inventory freeze is explicitly unadmitted, unbound, and outside both frozen
counts.  The 168-module frontier and 180-module replay inventories contain
`1912` and `2040` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.24 frontier, replay set, and complete
canonical suite were not rerun.

No strict lower-Ritz branch, action bound, raw growing anchor inverse row,
forcing-adapted dangerous row, complete sector sign, equation (5.2),
determinant limit, zero statement, RH, or Lambda bound is proved.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 1.25 ground-ridge arithmetic Krein RH gate

At the actual ground ridge `h=u-mu>=0`, the positive far and captured
eliminations and the forcing-adapted retained split must all be rebuilt for
`A-mu I`.  Their exact response ledger is

\[
 \begin{aligned}
 g_z^*(A-\mu I)^{-1}b
 ={}&g_{F,z}^*H_{F,h}^{-1}b_F
   +a_{C,z,h}^*P_h^{-1}c_h\\
 &+\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h.
 \end{aligned}
\]

The far and captured terms are source-normalized `o(1)` uniformly on fixed
compact strict Mellin strips.  Consequently the only unresolved response is

\[
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h\right|
 \longrightarrow0.
\]

The exact ridge secular budget bounds its forcing energy, and the safe block
has a fixed positive floor, but neither controls the phase-sensitive
observation row.  The source-Cauchy countermodel shows this failure sharply.

Writing `H_lambda=A_tail-T_D`, the same complete response is exactly

\[
 \left\langle g_z,
 \left[P_{\mathcal K}\{(c_*-\mu)I+H_\lambda\}P_{\mathcal K}\right]^{-1}
 P_{\mathcal K}H_\lambda\kappa\right\rangle.
\]

No prime or Archimedean block is split before inversion.  The full-symbol
boundary gauge and the unconditional centered-zero Krein factorization give
two further exact equations for this same solution.  They also express the
unproved signs `A-uI>0` on the even anchor complement and `Q_--uI>0` as the
same two strict signed-arithmetic infima.

For the coefficient-normalized ground representative,

\[
 \widehat p_{\lambda,N}(z)-\widehat f_{\lambda,N}(z)
 =\alpha_{\lambda,N}g_z^*(A-\mu I)^{-1}b.
\]

Thus, after the proved far and captured limits, the dangerous-row target is
equivalent to ground-transform alignment.  Eventual strict signs plus this
decay on every compact strip set would imply locally uniform convergence of
the real-rooted finite transforms to `Xi` and hence RH.  This is a
conditional implication only.

The two focused modules pass `17/17`; frozen canonical/raw discovery is
`3451/3509` tests in `312/317` modules, with the unchanged five exclusions
contributing `58`.  The 170-module frontier and 182-module replay inventories
contain `1929` and `2057` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.25 frontier, replay set, and complete
canonical suite were not rerun.

Neither strict sign nor the dangerous-row decay is proved.  No determinant
limit, zero statement, RH, converse from RH, or Lambda bound is proved.  The
formal state remains `P0_INVALIDATED`.

## Checkpoint 1.26 capture-free actual-ground parity response

Let `x=kappa-y` be the coefficient-normalized actual even ground, with
`(A-mu I)y=b`, and let `R_lambda(z)=<g_z,y>` be its complete invariant
response.  The source rank-two displacement and parity characteristic
identity give, for every complex frequency,

\[
 \mathfrak R_\lambda(z)
 =\widehat\kappa(z)
  -\frac{K_L(z)\mathcal A_\mu(r)}{p_\mu},
 \qquad r=\frac{zL}{2\pi},
\]

where `A_mu` is the already known boundary-normalized odd-resolvent profile
and `p_mu` is the ground--anchor normalization.  This identity is written
before any captured projection.  The apparent lattice poles in the Cauchy
sums are cancelled by the sine factor in `K_L`; at the retained lattice
frequencies and at `r=0` the displayed formula always means the resulting
entire continuation.

Checkpoint 1.25 already proves that the far and captured differences between
this complete response and the forcing-adapted dangerous row are
source-normalized `o(1)` on fixed compact strict Mellin strips.  Hence its
unresolved dangerous-row decay is exactly equivalent, after the source
scale is restored, to decay of the capture-free right side above.  This
removes the coordinate choice but supplies no estimate.

The first missing directional datum is explicit:

\[
 \mathcal A_\mu(r)
 =1+\frac{\langle\chi_r^-,\operatorname{adj}(O_\mu)\beta\rangle}
          {\det O_\mu}.
\]

The scalar odd determinant fixes only the denominator; it does not orient
the mixed cofactor numerator.  The additional anchor factor `p_mu` also has
no uniform lower bound.  The regularized determinant yields an exact scalar
ODE, but its coefficient is the logarithmic derivative of the same unknown
ground determinant, so the equation is tautological for the missing limit.
Multiplying once more by the mode variable introduces the singular even
reduced inverse and a central boundary-selected ground component.  Repeated
multiplication alternates these data with the odd inverse in a Krylov tower
whose order grows with `N`; there is no cutoff-independent closed equation
with controlled coefficients.

The one focused module passes `11/11`; frozen canonical/raw discovery is
`3462/3520` tests in `313/318` modules, with the unchanged five exclusions
contributing `58`.  The 171-module frontier and 183-module replay inventories
contain `1940` and `2068` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.26 frontier, replay set, and complete
canonical suite were not rerun.

No response decay, strict sector sign, locally uniform determinant limit,
zero statement, RH, converse from RH, or Lambda bound is proved.  The formal
state remains `P0_INVALIDATED`.

## Checkpoint 1.27 source-quotient Pick/Herglotz interlacing barrier

Write the real boundary-normalized even ground as

\[
 \Phi_\mu=\sum_{j=-N}^{N}\xi_jV_j,
 \qquad \xi_{-j}=\xi_j,
 \qquad \sum_{j=-N}^{N}\xi_j=1.
\]

The source secular function, quotient polynomial, and capture-free odd
profile obey the exact relations

\[
 h(s)=\sum_{j=-N}^{N}\frac{\xi_j}{j-s},
 \qquad
 \mathcal A_\mu(r)=-r h(r),
 \qquad
 P(s)=\det(D-sI)h(s).
\]

Their residues give a complete classification.  The secular function `h`
is Pick--Herglotz exactly when every `xi_j>=0`.  Unless constant,
`A_mu(r)` is neither Herglotz nor anti-Herglotz because its residues at
paired poles have opposite signs.  In the Stieltjes variable `t=-r^2`,
`F_mu(t)=A_mu(i sqrt(t))` is Stieltjes exactly when every noncentral
`xi_n<=0`.  Thus the Pick and Stieltjes residue cones meet only at the
exceptional branch `D Phi_mu=0`.

The quotient operator is self-adjoint in the metric induced by the singular
ground-shifted source matrix.  It is not an orthogonal compression of `D` in
the source Euclidean metric, so ordinary Cauchy interlacing does not apply.
An exact `N=2` source-Cauchy fixture satisfies both abstract checkpoint-1.25
strict Ritz signs and has a real-rooted quotient polynomial, yet its roots
do not interlace the integer lattice, two roots lie outside the lattice, and
its Pick and Stieltjes residues are mixed.  The natural polynomial pair is
not Hermite--Biehler.  A complementary family has favorable Herglotz
residues and strict interlacing but still misses the exponential
paired-trace compensation required for determinant control.

Both families are structural source-Cauchy countermodels, not matrices
assembled from the actual prime-power inventory.  They neither prove nor
disprove a residue sign, interlacing, strict sector sign, or response limit
for the actual arithmetic ground.

The one focused module passes `10/10`; frozen canonical/raw discovery is
`3472/3530` tests in `314/319` modules, with the unchanged five exclusions
contributing `58`.  The 172-module frontier and 184-module replay inventories
contain `1950` and `2078` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.27 frontier, replay set, and complete
canonical suite were not rerun.

No actual strict sign, actual response decay or nondecay, locally uniform
determinant limit, zero statement, RH, converse from RH, or Lambda bound is
proved.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.28 actual-ground residue and source-deformation barriers

For the centered source modes, every retained coefficient of the actual
boundary-normalized ground satisfies

\[
 \sqrt L\,\xi_{n,\lambda}
 =(-1)^n\widehat\Phi_\lambda(2\pi n/L).
\]

If the still-open projectively normalized target convergence
`s_lambda*hat(Phi_lambda)->Xi/4` holds locally uniformly near zero, then each
fixed moving lattice point tends to zero and

\[
 s_\lambda\sqrt L\,\xi_{n,\lambda}
 \longrightarrow(-1)^n\frac{\Xi(0)}4.
\]

Thus every fixed prefix eventually alternates, the Pick negative index
diverges, and neither one-sign residue cone from checkpoint 1.27 can hold on
a target-convergent schedule.  For the literal determinant normalization,
`s_lambda=sqrt(L)` and `L*xi_(n,lambda)` has the displayed alternating
limit.  This conclusion is conditional on the unproved actual-ground
transform convergence and gives no unconditional arithmetic sign.

For the capture-free mixed cofactor

\[
 C_\mu(r)=\langle\chi_r^-,\operatorname{adj}(O_\mu)\beta\rangle,
\]

the formal Hermitian rank-two polarization is not a nonzero tangent to the
full source-Cauchy family.  The exact odd-lift criterion is an additive
three-cycle condition; a strict-sign `N=3` source fixture violates it.  A
genuine symmetric-node source extension instead differentiates

\[
 \Delta_r'(0)=4r\langle\chi_r^-,
 \operatorname{adj}(O_\mu)(D_+^2-r^2I)^{-1}\beta\rangle.
\]

Recovering `C_mu` leaves an independent `D_+^2`-weighted row, and the
large-node expansion is unavailable on `N>>|r|`.  Hermitian interlacing and
Schur discriminants give only Cauchy--Schwarz; the extension diagonal is
free.  The favorable strict-sign family has `C_0(0)/p_0=-2N` but
`A_0(0)/p_0=1`, so the complete profile is protected by a cancellation that
cofactor-magnitude estimates destroy.

The two focused modules pass `18/18`; frozen canonical/raw discovery is
`3490/3548` tests in `316/321` modules, with the unchanged five exclusions
contributing `58`.  The 174-module frontier and 186-module replay inventories
contain `1968` and `2096` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.28 frontier, replay set, and complete
canonical suite were not rerun.

No actual-ground convergence, unconditional coefficient sign, actual mixed
cofactor bound, strict sector sign, response decay or nondecay, locally
uniform determinant limit, zero statement, RH, converse from RH, or Lambda
bound is proved.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.29 normalized source-quotient response barrier

For a boundary-normalized even ground with `p_mu=xi_0!=0`, the complete
normalized profile has the exact quotient-zero product

\[
 {\mathcal A_\mu(r)\over p_\mu}
 =\frac{\displaystyle\prod_{k=1}^{N}(1-r^2/\rho_k^2)}
 {\displaystyle\prod_{n=1}^{N}(1-r^2/n^2)},
 \qquad
 \prod_{k=1}^{N}\rho_k^2=p_\mu(N!)^2.
\]

The strict-sign `N=2` family with ground `(-a,a,1,a,-a)` has real quotient
polynomial

\[
 P_a(r)=r^4-(5+6a)r^2+4.
\]

After scaling the complete source matrix by `a`, the odd and even
anchor-complement spectra are both `{1,1+20a/3}`, the other positive even
eigenvalue is `1+4a^2`, and the nonzero Ritz value is `1+4a^2`.  Thus every
relevant positive gap is at least one, while

\[
 {\mathcal A_0(i)\over p_0}=1+{3a\over5}
\]

is unbounded.

For `M=2N+1`, `q_N(r)=prod_(j=-N)^N(r-j)`, and the favorable family
`T_N=I-|eta><eta|/M`, one has

\[
 G_N(r)={rq_N'(r)\over q_N(r)},
 \qquad
 G_N(i\sqrt t)=1+2t\sum_{n=1}^{N}{1\over t+n^2}.
\]

The latter is complete Bernstein; `G_N(i sqrt(t))/t` and `1/G_N(i sqrt(t))`
are Stieltjes, and `q_N+i q_N'/M` is Hermite--Biehler.  These positive
structures do not control the physical continuation.  Its cardinal form has
retained noncentral grid samples of magnitude `sqrt(L)`, and for fixed
`0<y<1/2`, `L->infinity`, and `N/L->infinity`,

\[
 |R_{N,L}(iy)|\sim\sqrt L\cosh(yL/2).
\]

The one focused module passes `10/10`; frozen canonical/raw discovery is
`3500/3558` tests in `317/322` modules, with the unchanged five exclusions
contributing `58`.  The 175-module frontier and 187-module replay inventories
contain `1978` and `2106` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.29 frontier, replay set, and complete
canonical suite were not rerun.  The post-freeze twisted-boundary note/test
pair contributes one module and 10 tests to the later live worktree but is
unadmitted, unbound, and outside these frozen inventories.

The exact families are structural source-Cauchy models, not actual
prime-power matrices, and prove no actual-arithmetic failure.  No
quantitative actual `p_mu` bound, actual quotient-zero placement, actual
physical response control, actual strict sector sign, response decay or
nondecay, locally uniform determinant limit, zero statement, RH, converse
from RH, or Lambda bound is proved.  The formal state remains
`P0_INVALIDATED`.

## Checkpoint 1.30 opposite-boundary twisted Weyl/source-quotient barrier

With `e=exp(i*pi*D)eta`, the boundary vectors have distinct physical
meanings: `eta` is periodic endpoint evaluation and `e` is midpoint
evaluation.  The auxiliary twisted function

\[
 g(s)=\langle e,(D-sI)^{-1}\Phi\rangle
     =\sum_{n=-N}^{N}{(-1)^n\xi_n\over n-s}
\]

is Pick--Herglotz exactly when its twisted residues are nonnegative, and
the strict cone supplies auxiliary interlacing and Hermite--Biehler
structure.  The actual-ground result from checkpoint 1.28 remains only a
conditional fixed-prefix statement and supplies neither a global growing
cone nor total-mass or Paley--Wiener/frame control.

For `a=<e,Phi>!=0`, define

\[
 D'_e=D-{|D\Phi\rangle\langle e|\over a}.
\]

Then

\[
 \det(D'_e-sI)=-{s\over a}\det(D-sI)g(s),
\]

but, for `T=Q-mu I` and `TD Phi=-beta`,

\[
 TD'_e-D_e'^*T
 =|\beta\rangle\langle e/a-\eta|
  -|e/a-\eta\rangle\langle\beta|\ne0
\]

for nontrivial odd forcing.  Thus the alternate quotient loses the source
metric self-adjointness.  Direct boundary replacement also violates the
source displacement law, while a complete diagonal gauge merely recovers
the original secular function.

An exact strict-sign, uniform-gap `N=2` fixture has `<e,Phi>=0`, making the
normalization undefined.  A separate target-compatible strict fixture has
globally positive twisted weights, so the cone itself does not imply
failure.  The favorable `T_2` endpoint twist gives the non-real-rooted
alternate quotient `s^4+s^2+4`.  Two-boundary Weyl positivity yields only a
Cauchy--Schwarz inequality with a free mass and leaves `p_mu` and the
physical response uncontrolled.

The one focused module passes `10/10`; frozen canonical/raw discovery is
`3510/3568` tests in `318/323` modules, with the unchanged five exclusions
contributing `58`.  The 176-module frontier and 188-module replay inventories
contain `1988` and `2116` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.30 frontier, replay set, and complete
canonical suite were not rerun.

The fixtures are structural and prove no actual-arithmetic failure.  No
actual global twisted cone or mass bound, actual `p_mu` frame control,
actual physical response control, actual strict sector sign, locally
uniform determinant limit, zero statement, RH, converse from RH, or Lambda
bound is proved.  The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.31 global twisted-mass strict-Ritz source-Cauchy barrier

For even `N` and `0<epsilon<=1/100`, put

\[
 \rho_k=k+(-1)^{k+1}\epsilon,
 \quad q_N(s)=\prod_{j=-N}^{N}(s-j),
 \quad P_N(s)=-\prod_{k=1}^{N}(s^2-\rho_k^2),
 \quad \xi_n=-{P_N(n)\over q_N'(n)}.
\]

The exact partial fractions of `P_N/q_N` show that `Phi_N=(xi_n)` is even,
boundary normalized, and satisfies

\[
 w_n=(-1)^n\xi_n={-P_N(n)\over(N+n)!(N-n)!}>0.
\]

The inversion-symmetric Gram sum over the Cauchy columns
`v(r)_n=1/(n-r)` at `r=+-rho_k` is positive semidefinite with simple kernel
`R Phi_N`.  Its off-diagonal entries obey the exact source-Cauchy
displacement law for

\[
 b_n=-\sum_{k=1}^{N}
 \left({1\over n-\rho_k}+{1\over n+\rho_k}\right).
\]

In normalized parity bases, the anchor-complement and odd blocks are
`A_N=4FF^*` and `Q_(N,--)=4GG^*`, where
`F_(nk)=rho_k/(n^2-rho_k^2)` and
`G_(nk)=n/(n^2-rho_k^2)`.  At `epsilon=1/100`, exact operator bounds give
both unshifted floors greater than `8464`.  The genuine lower Ritz value
`u_N` on `span{V_0,c}` satisfies `0<=u_N<5`, so

\[
 A_N-u_NI\succ8459I,
 \qquad Q_{N,--}-u_NI\succ8459I.
\]

Despite these uniform shifted signs, the exact gamma-product limit gives
`w_n/w_0~C_(epsilon,parity)/n` at each fixed mode, and Fatou's lemma yields

\[
 {\sum_{n=-N}^{N}w_n\over\xi_0}\longrightarrow+\infty
 \qquad(N\longrightarrow\infty,\ N\ \text{even}).
\]

Fixed `epsilon` keeps every quotient root at fixed lattice clearance while
the mass ratio diverges; a sequence `epsilon_N->0` preserves the strict
shifted signs while the clearance tends to zero.

The one focused module passes `8/8`; frozen canonical/raw discovery is
`3518/3576` tests in `319/324` modules, with the unchanged five exclusions
contributing `58`.  The 177-module frontier and 189-module replay inventories
contain `1996` and `2124` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.31 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.31 proves by an exact growing structural source-Cauchy Gram family that the global twisted cone, quotient real-rootedness, and both genuine lower-Ritz shifted signs with uniform margins do not bound the twisted total-mass-to-anchor ratio or force positive quotient-root clearance. The family is not an actual prime-power matrix and proves no actual arithmetic failure. No actual global twisted cone, actual mass/anchor bound, actual root clearance, actual strict sector sign, actual response decay or nondecay, locally uniform determinant limit, zero statement, RH, converse from RH, or Lambda bound is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.32 actual source-row exclusion and selector-moment gate

The checkpoint-1.31 paired-root Gram family fails the first
scalar-shift-invariant actual arithmetic test.  At the edge of the locked
cutoff,

\[
 -b_N^{\mathrm G}\geq {1\over\epsilon}
 +\log {N+\epsilon\over1+\epsilon},
 \qquad \log N=9600(\log2)\lambda^2,
\]

whereas the pinned actual source has `|b_N|=O(lambda log lambda)`.  Thus the
structural mass counterfamily is not an actual prime-power/archimedean
matrix.

If the actual global twisted cone and both strict signs are assumed, the
shifted matrix has unique positive quotient-root atom weights and the exact
moments

\[
 b_n=-2n\sum_j{\theta_j\over n^2-r_j^2},
 \qquad
 a_n-\mu=2\sum_j{\theta_j(n^2+r_j^2)
                         \over(n^2-r_j^2)^2}.
\]

With `D_n=a_n-mu-b_n/n` and
`q_0=a_0-mu=2 sum_j theta_j/r_j^2`, positivity yields

\[
 \min_j{|n^2-r_j^2|\over r_j}
 \leq n\sqrt{{2q_0\over D_n}}.
\]

The actual envelopes give `q_0=O(lambda log lambda)` and
`D_N` of order `lambda^2`, so this is only
`O(N sqrt(log(lambda)/lambda))`.  The missing input is a genuinely
edge-scale atom-weighted or central-moment inequality, not the existing
central Fourier-coordinate bound and not an unproved transfer to the
projected prolate anchor.  The exact central ground row is only a signed
harmonic moment and does not control total twisted mass.

The one focused module passes `8/8`; frozen canonical/raw discovery is
`3526/3584` tests in `320/325` modules, with the unchanged five exclusions
contributing `58`.  The 178-module frontier and 190-module replay inventories
contain `2004` and `2132` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.32 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.32 proves that the checkpoint-1.31 paired-root Gram family violates the pinned actual edge source-row bound on the locked schedule, and proves the exact positive selector-moment representation and central-moment localization inequality under the still-unproved actual global twisted cone and strict signs. The source-row exclusion applies only to that structural family; it proves no actual-arithmetic failure. The available actual bounds give only nonlocal O(N sqrt(log lambda/lambda)) root control and prove neither an actual mass/anchor bound nor actual quotient-root separation. No actual global twisted cone, actual strict sector sign, actual response decay or nondecay, locally uniform determinant limit, zero statement, RH, converse from RH, or Lambda bound is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.33 moving-grid twisted-cone target incompatibility

Independent FLINT/Arb completed-zeta and Hardy-Z certificate paths prove

\[
 \Xi(13)>0>\Xi(15),
\]

and hence at least one real zero in `(13,15)` by continuity.  They do not
isolate, enumerate, or prove simplicity of a zero.

For `lambda_k -> infinity`, `L_k=2 log(lambda_k)`, and
`N_k/L_k -> infinity`, exact centered sampling is

\[
 \widehat\Phi_k(2\pi n/L_k)=\sqrt {L_k}\,(-1)^n\xi_{n,k}.
\]

If the still-unproved projectively normalized actual-ground transform
converges locally uniformly to `Xi/4`, the nearest retained moving indices
to 13 and 15 have opposite twisted signs.  Fixed target-sign intervals
then give

\[
 \kappa_-(K_k)=\Omega(L_k),\qquad
 \kappa_+(K_k)=\Omega(L_k).
\]

Thus that target convergence excludes every one-sign twisted cone and
every fixed-index Pontryagin substitute.  The implication does not prove
the target hypothesis, actual-ground existence on the schedule, or an
unconditional actual-cone failure.

The focused module passes `9/9`; frozen canonical/raw discovery is
`3535/3593` tests in `321/326` modules, with the unchanged five exclusions
contributing `58`.  The 179-module frontier and 191-module replay inventories
contain `2013` and `2141` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.33 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.33 independently certifies Xi(13)>0>Xi(15) with direct completed-zeta and Hardy-Z FLINT/Arb computations, hence proves at least one real zero of Xi in (13,15). Conditional on the still-unproved locally uniform actual-ground target convergence along an unbounded schedule, it proves opposite twisted-weight signs on moving O(L) indices, both Pick-kernel inertia indices Omega(L), and incompatibility with every one-sign twisted cone and fixed-index Pontryagin substitute. It does not prove the actual-ground target convergence, simple/even actual-ground existence on that schedule, or an unconditional failure of the actual global twisted cone; the conditional incompatibility proves no actual-arithmetic failure. The finite certificates give no zero isolation beyond (13,15), enumeration, uniqueness, simplicity, global zero theorem, off-line exclusion, RH, converse from RH, or Lambda bound. No actual strict sector sign, response decay or nondecay, or locally uniform determinant limit is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.34 strict-odd selector-shell localization

For a finite shifted source-Cauchy matrix with a simple even kernel and
strictly positive odd block, the selector face has exactly `N` distinct
positive atoms at finite nonzero negative parameters.  Its full matrix is
the positive sum of regular paired-Cauchy atoms and exact paired shell
projectors.  A shell occurs exactly at a zero ground coordinate; no global
twisted coordinate cone is assumed.

The shell-inclusive moments are

\[
 q_0=2\sum_{j\in R}{\theta_j\over r_j^2},\qquad
 D_n=4n^2\sum_{j\in R}{\theta_j\over(n^2-r_j^2)^2}
     +\vartheta_n>0,
\]

and they give

\[
 \min_{\rho\in\{r_j:j\in R\}\cup S}
 {|n^2-\rho^2|\over\rho}
 \leq n\sqrt{{2q_0\over D_n}}.
\]

At a shell the left side is already zero.  If `q_0=0`, all roots are
shells and the all-shell branch proves the inequality without division by
`q_0`.  The theorem therefore removes the global-cone assumption from the
finite localization gate, but supplies no new actual edge scale.

The focused module passes `9/9`; frozen canonical/raw discovery is
`3544/3602` tests in `322/327` modules, with the unchanged five exclusions
contributing `58`.  The 180-module frontier and 192-module replay inventories
contain `2022` and `2150` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.34 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.34 proves for every finite inversion-symmetric source-Cauchy matrix with a simple boundary-normalized even ground and strictly positive odd block that the selector face has exactly N positive atoms at finite nonzero negative parameters, with a unique positive regular-pair plus shell decomposition; shell roots are exactly zero ground coordinates. It proves the exact shell-inclusive source, diagonal, and localization identities, including the all-shell q_0=0 branch, so the global twisted coordinate cone is not needed for this finite selector-localization theorem. The actual simple/even ground and genuine shifted signs remain unproved on an unbounded schedule; no actual root clearance, mass-to-anchor bound, response decay or nondecay, determinant convergence, or actual-arithmetic failure is proved. It adds no zero statement beyond checkpoint 1.33 and proves no RH, converse from RH, or Lambda bound. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.35 q_0-free selector secant/root-parity reduction

For the checkpoint-1.34 regular selector measure, absence of a regular root
or shell from `[(n-h)^2,(n+h)^2]`, where `1<=h<n<=N-h`, forces

\[
 -S'(n^2)\leq
 {S((n-h)^2)-S((n+h)^2)\over4nh}.
\]

The factor `1/(4nh)` is sharp.  At `h=1`, the actual source-row formula and
the shell-inclusive diagonal moment therefore imply

\[
 D_n>B_b(\lambda){n^2\over n^2-1}
 \quad\Longrightarrow\quad
 r\in[n-1,n+1]\quad\hbox{for some selector radius }r.
\]

No central mass `q_0` or global twisted cone enters this reduction.  The
frozen diagonal lower bound activates it only on the locked far tail,
conditional on the still-unproved actual selector hypotheses, yielding
`Omega(N)` distinct roots through disjoint windows.  The exact identity

\[
 w_n={(-1)^N p(n^2)\over(N-n)!(N+n)!}
\]

reduces adjacent twisted signs to root-count parity rather than ordinary
interlacing.  Exact two-pole formulas separately show that one same-point
pair `(b_n,D_n)` cannot supply the missing bracket.

The focused module passes `11/11`; frozen canonical/raw discovery is
`3555/3613` tests in `323/328` modules, with the unchanged five exclusions
contributing `58`.  The 181-module frontier and 193-module replay inventories
contain `2033` and `2161` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.35 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.35 proves, under the finite checkpoint-1.34 simple-even and strict-odd hypotheses, a sharp Q0-free positive-secant criterion: if D_n > B_b(lambda)n^2/(n^2-1), some selector radius lies in [n-1,n+1]. The frozen source and diagonal envelopes activate this criterion conditionally on the locked high tail and yield Omega(N) distinct constant-scale root windows. It also proves the exact twisted-weight/root-count parity law and exact same-point (b_n,D_n) nonrigidity. The actual simple/even ground, genuine shifted signs, and checkpoint-1.33 target convergence remain unproved on an unbounded schedule; the low n=O(L) criterion is not activated; and no one-root-per-gap theorem, two-sided root conclusion, subunit quotient clearance, exact gap count, linear root lower bound in the checkpoint-1.33 target intervals, response decay or nondecay, determinant convergence, actual-arithmetic failure, or new zero statement is proved. It proves no RH, converse from RH, or Lambda bound. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.36 RH-conditional fixed-zero selector capture

On `N=ceil(lambda L^3)`, assume RH and the finite actual simple-even,
boundary-normalized, genuinely shifted selector hypotheses.  For a fixed
positive critical ordinate `gamma_0`, take
`n_L=nint(gamma_0 L/(2pi))`.  The RH zero Gram gives an unshifted
diagonal-minus-neighbor-secant defect

\[
 E_{n_L}^Q\geq {64m_0\over25\pi^2}L-{C_{\gamma_0}\over L^3},
\]

with the exact-carrier case handled separately by the shell weight `m_0L`.
The actual ground shift obeys `0<=mu<=U_Z/2=o(L)`, so the shifted defect is
eventually positive.  The checkpoint-1.35 contrapositive then forces a
quotient selector radius in `[n_L-1,n_L+1]`, or within `3pi/L` of
`gamma_0` in physical frequency.  Maximizing the fixed constants proves the
same result simultaneously for every fixed finite zero set.

The focused module passes `10/10`; frozen canonical/raw discovery is
`3565/3623` tests in `324/329` modules, with the unchanged five exclusions
contributing `58`.  The 182-module frontier and 194-module replay inventories
contain `2043` and `2171` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.36 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.36 proves, assuming RH and the finite simple-even, boundary-normalized, strict-shifted selector hypotheses on the polynomial Gevrey schedule N=ceil(lambda L^3), that every fixed positive critical ordinate of any multiplicity eventually forces a quotient selector radius within one lattice unit of its nearest carrier, hence within 3pi/L in physical frequency. The result holds simultaneously for every fixed finite zero set, treats exact carrier collisions by the shell weight mL, and bounds all other distinct-zero contributions by O(L^-3); the frozen Xi(13)>0, Xi(15)<0 certificate therefore yields at least one conditional captured selector frequency in (13,15). RH, the actual simple/even ground, boundary normalization, and genuine shifted signs remain assumptions, not conclusions. No growing-zero-uniform capture, one-root-per-gap theorem, zero enumeration, isolation, or simplicity, determinant convergence, response bound, actual-arithmetic sign failure, RH proof or converse, or Lambda bound is proved. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.37 shifted zero-selector quadrature and odd relative floor

The checkpoint-1.36 zero/source samples and shell diagonal determine a
polynomial functional through degree `2N-1`.  The selector measure is its
exact positive `N`-node Gaussian quadrature, including shell nodes.  In the
cleared odd basis the shifted odd block is its moment Gram; after
multiplication by `y`, the positive-index shifted even block is its
localizing Gram.  Thus the selector roots, twisted samples, and anchor are
exact determinant data of the generalized pencil `H_mu-yM_mu`.

This reformulation isolates rather than closes the response gate.  Relative
odd/even reserves do not control moving endpoint inertias, absolute
Gaussian weights, or the anchor determinant ratio.  Exact paired-Cauchy
families keep finite captures, retained parity, and anchor normalization
fixed while their response diverges, and allow one versus three roots in a
single captured gap.  They do not model the actual arithmetic source or
prove genuine lower-Ritz shifted signs.

On RH, the exact derivative radical gives only an upper quasi-null test for
the odd zero-Gram floor.  Its Gevrey exponent cannot be compared with the
independent projected-state upper bound, and the available minor lower
bound is exponentially too weak.  The repaired HSW-compatible tail-splice
model makes the odd Gram singular on an unbounded schedule while retaining
an HSW-compatible fixed finite prefix.  It is a logical count-compatible
model, not the zeta divisor, and leaves the actual relative sampling
inequality open.

The two focused modules pass `18/18`; frozen canonical/raw discovery is
`3583/3641` tests in `326/331` modules, with the unchanged five exclusions
contributing `58`.  The 184-module frontier and 196-module replay inventories
contain `2061` and `2189` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.37 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.37 proves, under the finite checkpoint-1.36 simple-even, boundary-normalized, strict-shifted selector hypotheses, the exact shell-aware degree-2N-1 transformed zero/selector Gaussian quadrature identity, odd moment and positive-even localizing congruences, generalized-eigenvalue root formulas, and anchor determinant ratio. It proves relative odd/even conditioning reserves but no absolute Gaussian-weight floor or moving local-pencil inertia. Structural paired-Cauchy families preserve prescribed captures, retained parities, exact anchor normalization, and strict ground-complement signs while normalized response diverges, and permit one versus three roots in one gap; they are not the actual source and do not certify genuine lower-Ritz shifted signs. Separately, assuming RH on the polynomial Gevrey schedule, the derivative radical supplies only an upper quasi-null Rayleigh test, while the available determinant minor is too weak to compare with the projected-state scale. The repaired HSW-compatible tail-splice model is a logical count-compatible countermodel, not the zeta divisor, and shows that RH location, the pinned count, its coarse distinctness consequence, and any HSW-compatible finite prefix do not by themselves prove the odd floor. The actual relative odd sampling floor, shifted sign, local uniqueness or multiplicity transfer, response bound, and determinant convergence remain unproved. No actual-arithmetic failure, new zero theorem, RH proof or converse, or Lambda bound is obtained. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.38 RH zero Gaussian square-free auxiliary limit

Under RH and the finite checkpoint-1.37 strict hypotheses, the `mu=0`
transformed zero functional is positive.  Its fixed-index Gaussian squared
nodes obey

\[
 s_{j,L}\leq t_{j,L}\leq s_{j,L}+O_j(1),
 \qquad \tau_{j,L}^2=\gamma_j^2+O_j(L^{-2}).
\]

This is a degree-`2N-1` form-domain statement with carrier shells included.
It gives auxiliary fixed-window uniqueness, fixed-atom Christoffel
saturation, and a reciprocal-node bound.  The corresponding exact
central-normalized product converges locally uniformly to the square-free
product over distinct positive critical ordinates, not automatically to
the multiplicity-sensitive Xi product.

The residual shifted gate is now sharp: the frozen Gevrey estimate keeps the
fixed-index upper Ritz bound, but checkpoint-1.36 capture gives local
uniqueness only if the unproved even reserve satisfies
`delta_+>(gamma_j/gamma_(j+1))^2+eta`.  Strictness alone says only
`delta_+>0`.  The further normalization residual is also explicit:
checkpoint 1.37 identifies `xi_0`, whereas the capture-free response uses
the distinct prolate overlap `<kappa_prolate,Phi>`.

The focused module passes `8/8`, and the module plus its exact direct
dependency union passes `27/27`.  Frozen canonical/raw discovery is
`3591/3649` tests in `327/332` modules, with the unchanged five exclusions
contributing `58`.  The 185-module frontier and 197-module replay inventories
contain `2069` and `2197` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.38 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.38 assumes RH and the finite checkpoint-1.37 strict hypotheses, including 0<=mu<=q_N and M_mu>0, so M_0>0; it does not derive those hypotheses from RH. For the auxiliary positive transformed zero functional at mu=0, using moments only through degree 2N-1 and including carrier shells, it proves for every fixed distinct positive ordinate gamma_j that s_(j,L)<=t_(j,L)<=s_(j,L)+O_j(1), hence gamma_j<=tau_(j,L) and tau_(j,L)^2=gamma_j^2+O_j(L^-2), exactly one Gaussian radius in the fixed carrier window, fixed-atom Christoffel saturation, the reciprocal-node bound, and locally uniform convergence of the central-normalized product to the square-free critical-zero product. The limit equals Xi(z)/Xi(0) if and only if all positive critical zeros are simple; multiplicity remains in weights and does not repeat nodes. For the genuine shifted functional the frozen Gevrey estimate preserves only the fixed-index upper Ritz bound, and checkpoint-1.36 capture yields uniqueness only under the unproved quantitative gate delta_+>(gamma_j/gamma_(j+1))^2+eta; frozen strictness gives only delta_+>0. The central coefficient xi_0 is not identified with the prolate-anchor overlap <kappa_prolate,Phi>. No actual shifted-node convergence or local uniqueness, multiplicity transfer, determinant convergence, prolate-anchor normalized-response bound, actual-arithmetic sign failure, new zeta-zero theorem, RH proof or converse, or Lambda bound is obtained. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.39 even reserve, local Uvarov, and central-normalization barriers

The RH even second-derivative radical gives the upper quasi-null test
`lambda_min(A_circ)<=r_N^+=O(exp(-c_ev*lambda*L^2))`, not a lower bound.
The checkpoint-1.38 uniqueness threshold and any `o(1/L)` reserve therefore
need a new relative estimate for `mu/lambda_min(A_circ)`; unrelated Gevrey
upper bounds and the available `exp(-O(lambda^2*L^7))` minor do not supply
it.

Exact multi-Uvarov/Woodbury formulas retain a global inverse.  A structural
truncated-moment family preserves target Christoffel saturation, nearest
mass scaling, and strict moment and localizing Grams while changing one
target-window node into two and collapsing both relative reserves.  It is
not the actual transformed zeta-zero functional.

For the actual central and projected-prolate coefficients, normalization
transfer is exactly equivalent to `gamma_fb->0`, and also to an oriented
relative principal-compression determinant asymptotic.  The frozen
subpolynomial feedback reserve does not prove this limit.  The exact
source-Cauchy structural family uses projected-prolate anchors only as
comparison vectors and proves only a qualitative-sign nonimplication.

The three focused modules pass `28/28`, and the exact direct dependency
union passes `90/90`.  Frozen canonical/raw discovery contains `3619/3677`
tests in `330/335` modules, with the unchanged five exclusions contributing
`58`.  The 188-module frontier and 200-module replay inventories contain
`2097` and `2225` tests, the latter comprising the frontier and the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.39 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.39 admits three internal barrier results. On RH and under the finite strict checkpoint hypotheses, the even second-derivative radical gives only `lambda_min(A_circ)<=r_N^+=O(exp(-c_ev*lambda*L^2))`; the checkpoint-1.38 uniqueness reserve and any `o(1/L)` reserve therefore require a new relative estimate for `mu/lambda_min(A_circ)`. The two frozen absolute upper bounds and the available `exp(-O(lambda^2*L^7))` minor do not provide that comparison, while the count-compatible singular lattice is only a logical model, not the zeta divisor. Separately, the exact multi-Uvarov/Woodbury formulas and a structural truncated-moment family show that fixed-atom Christoffel saturation, nearest-mass scaling, and qualitative positivity do not control the global inverse or the local shifted-node count; the family is not the transformed zeta-zero functional and proves no actual shifted-node failure. Finally, under the nonzero-overlap finite gates, central-to-prolate normalization transfer is equivalent to `gamma_fb->0`, equivalently an oriented relative principal-compression determinant asymptotic. Only a subpolynomial nonvanishing reserve is frozen, and the source-Cauchy structural family uses the projected-prolate anchors only as comparison vectors; it is not the actual arithmetic matrix. The checkpoint-1.38 auxiliary `mu=0` square-free limit cannot be applied directly to the actual shifted profile. No actual quantitative even reserve, shifted-node convergence or uniqueness, determinant or normalization transfer, prolate-normalized response control, zero-simplicity theorem, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.40 actual derivative comparison and endpoint-flat floor obstruction

For the actual projected finite prolate state, exact central deletion gives
an endpoint-flat primitive of `p_N''`.  The resulting relative Rayleigh
comparison retains precisely two unresolved quantities: the relative
endpoint trace `eta_N^pr` and the saturation factor
`kappa_N=r_N^pr/lambda_min(A_circ)`.  Ordinary second-derivative convergence
and superpolynomial absolute endpoint decay control neither one in the
required direction.

A separate source-Cauchy quotient construction annihilates a fixed
proportion of the distinct actual zero rows and has a growing endpoint jet.
Together with the multiplicity-safe HSW tail estimate it proves
`lambda_min(A_circ)<=exp(-(c_*-o(1))*N)`, with
`c_*=0.4087565478...`.  This rules out an all-vector lower frame at the
`exp(-C*N/L)` scale but is only an upper bound for the floor; it does not
compare `q_N` or `mu` with that floor.

The two focused modules pass `21/21`, and their exact direct dependency
union passes `61/61`.  Frozen canonical/raw discovery contains `3640/3698`
tests in `332/337` modules, with exactly `58` tests in the unchanged five
exclusions.  The 190-module frontier contains `2118` tests and the
202-module replay inventory contains `2246`, including the byte-unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.40 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.40 admits two RH-conditional internal barrier results. For the actual projected finite prolate state, exact central deletion makes `f_N` endpoint-flat through first order and gives `hat(p_N'')(t)=-t^2 hat(f_N)(t)`, the relative comparison `r_N^pr/q_N>=gamma_*^4*(||p_N||_2^2/||p_N''||_2^2)*(1-eta_N^pr)_+^2`, and `||p_N''||_2^2/||p_N||_2^2->m_4`. The exact rational quotient identifies `eta_N^pr` with the endpoint trace at projective infinity relative to all actual zero rows. Frozen absolute endpoint decay gives no lower bound for the zero-sampling norm, so it does not prove `eta_N^pr->0`; even if it did, the sufficient reserve gate retains the uncontrolled saturation factor `kappa_N=r_N^pr/lambda_min(A_circ)`. Separately, an endpoint-flat source-Cauchy quotient vector annihilating the first `floor(theta*N)` distinct actual positive zero rows proves only the upper-floor obstruction `lambda_min(A_circ)<=exp(-(c_*-o(1))*N)`, with `c_*=0.4087565478...`, and rules out an all-vector lower bound at scale `exp(-C*N/L)`. This upper bound does not compare the actual projected-prolate `q_N` or `mu` with the floor and does not prove or disprove the even reserve; the finite phase models are structural sampling models, not the actual prolate state or zeta divisor. No actual quantitative even reserve, shifted-node convergence or uniqueness, determinant or normalization transfer, prolate-normalized response control, zero-simplicity theorem, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.41 endpoint-flat ground-shift and endpoint-variance barriers

The endpoint-flat quotient has an exact clamped full-even primitive.  Its
ground-shift comparison improves the scalar by `T_N^(-4)` but necessarily
retains `varkappa_N^flat=r_N^flat/alpha_N`.  The exact Schur identity
`mu/alpha_N=s_0/[alpha_N*(1+ell_mu)]` isolates the alternative oriented
relative target.  Neither the saturation factor nor that Schur/cofactor
ratio is controlled by the frozen absolute bounds.  A shifted-hyperplane
source-Cauchy family makes the reserve ratio tend to one while preserving
the listed finite identities, but it is not the actual zero Gram.

For the actual projected state, the exact source scalar determines only the
weighted mean of the rational zero rows.  The corresponding denominator is
the sum of a weighted variance and the squared mean.  The available flat
bound for the mean provides no variance floor, while direct coefficient
control reaches projective infinity only beyond every polynomial
zero-height scale.

The two focused modules pass `18/18`, and their exact direct dependency
union passes `84/84`.  Frozen canonical/raw discovery contains `3658/3716`
tests in `334/339` modules, with exactly `58` tests in the unchanged five
exclusions.  The 192-module frontier contains `2136` tests and the
204-module replay inventory contains `2264`, including the byte-unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.41 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.41 admits two RH-conditional internal barrier results. The endpoint-flat quotient witness has an exact clamped full-even primitive and gives `mu/alpha_N<=(D_N^flat/T_N^4)*varkappa_N^flat<=(Omega_N/T_N)^4*varkappa_N^flat`; at the optimized proportion the explicit scalar tends to `0.2232886136...`, but the saturation `varkappa_N^flat=r_N^flat/alpha_N` remains uncontrolled. The simple-ground Schur equation also gives `mu/alpha_N=s_0/[alpha_N*(1+ell_mu)]`, so an oriented relative Schur/cofactor estimate or quantitative leverage growth is still required. A shifted-hyperplane source-Cauchy family with the same projected-prolate comparison anchors has `mu/alpha_N->1` while preserving the stated finite source, strictness, determinant, and cofactor identities, but it is not the actual arithmetic or zeta-zero Gram and need not obey the actual zero-support contraction. Separately, the actual source scalar fixes only the weighted mean `sum w_gamma*H_N=-sqrt(L)*J_L/4`; the exact identities give `D_N=S_0*Var_w(H_N)+L*J_L^2/(16*S_0)` and `(eta_N^pr)^2=d_N^2/[Var_w(H_N)+L*J_L^2/(16*S_0^2)]`. The flat upper bound for `J_L` supplies no variance floor. On the nonzero-endpoint branch, coefficientwise absolute control reaches projective infinity only beyond every fixed polynomial zero-height scale, and current zero counting supplies no phase-weighted mass lower bound there. This proves neither decay nor failure of `eta_N^pr`. No quantitative actual even reserve, endpoint-relative estimate, shifted-node convergence or uniqueness, determinant or normalization transfer, prolate-normalized response control, actual-arithmetic sign conclusion, zero-simplicity theorem, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman `Lambda` bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.42 continuous-L phase shell and spectral-cluster primitive barrier

The HSW parity-bin construction retains full algebraic multiplicity and
proves a continuous-`L` phase mass of order `log(T)/T` outside a bad set of
measure `O(log(T)/T)`.  A cofinal phase-good sequence fits the locked
ceiling schedule, but the endpoint denominator still needs an independent
same-`L` lower bound for the moving high-row amplitude.

The actual-zero quotient construction now gives a growing
`k`-dimensional low-Rayleigh subspace, not merely one witness.  It yields
only upper bounds for `lambda_k(A_circ)`, with optimized exponent
`c_delta`, and gives no relative bottom gap or actual ground orientation.
The exact clamped primitive of that actual ground replaces the earlier
saturation factor by an uncontrolled negative-Sobolev/low-row conditioning
ratio.  The real-evaluation Gram representation of the shifted-hyperplane
family remains an unrestricted structural cone result, not an HSW or zeta
realization.

The two focused modules pass `17/17`, and their exact unique direct
dependency union passes `57/57`.  Frozen canonical/raw discovery contains
`3675/3733` tests in `336/341` modules, with exactly `58` tests in the
unchanged five exclusions.  The 194-module frontier contains `2153` tests
and the 206-module replay inventory contains `2281`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.42 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.42 admits two RH-conditional internal results. The multiplicity-aware HSW parity-bin construction proves a continuous-L mean-square bound, an asymptotically full-measure phase-shell lower bound of order log(T)/T, and a cofinal extraction compatible with the locked ceiling schedule. Its bounds for D_N and eta_N^pr remain conditional on an independent high-row amplitude lower bound at the same L; no joint phase-amplitude estimate, high-row amplitude theorem, or eta decay is proved. Separately, for M=floor(theta*N), 1/2<theta<1, and 1<=k<=N-M-1, the actual-zero quotient construction gives an exact k-dimensional positive-even subspace annihilating the first M distinct actual rows, including carrier and multiplicity branches, flat through order 2(N-M-k)-1, and proves lambda_k(A_circ)<=C*L*T_M*log(T_M)*(Omega_N/T_M)^(4(N-M-k)). If k_N/N->delta<1/2, the optimized exponent is c_delta=4(1-delta)*(W(2e(1-delta))-1)^2/W(2e(1-delta)); for k_N=o(N) this is c_*=0.4087565478... . These are only eigenvalue upper bounds and prove no relative bottom gap, ground orientation, or comparison among mu, q_N, r_N^pr, and the floor. For a unit actual A_circ ground h_alpha, the exact clamped primitive gives mu/alpha_N <= [int gamma^(-4) d nu_alpha]/||R_N h_alpha||_2^2, eliminating kappa_N algebraically but exposing an uncontrolled negative-Sobolev denominator and relative low-row mass. The full finite PSD real source-Cauchy cone equals the positive real Fourier-evaluation Gram cone, so the shifted-hyperplane reserve obstruction has an exact positive-real-weight evaluation representation and arbitrarily close integer-weight finite representations; none is the actual zeta zero Gram, and no HSW-compatible prefix, divisor, padding, zeta-ordinate, or pole–archimedean–minus-prime source realization is proved. No actual saturation or quantitative even reserve, actual minimal-eigenspace alignment, shifted-node convergence or uniqueness, determinant or normalization transfer, actual-arithmetic sign conclusion, new zero theorem, RH proof or converse, or de Bruijn–Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.43 ideal Stokes filter and LP cardinal-tail barriers

The ideal damped Paley--Wiener alternating filter has an exact Fourier
multiplier and a uniform `Delta`-Sobolev error of order `h` in squared
average.  The exact near-edge kernel plus explicit relative remainder
hypotheses would give `|H_N/d_N|>=T/(16B)`, and the fixed-width HSW
micro-window then conditionally gives an `O(1/log(T))` eta bound.  The
actual finite-`lambda` relative Stokes transfer and the joint weighted
Hardy--Cauchy inequality on one micro interval remain unproved.

The finite barycentric construction gives endpoint sum one while killing
any prescribed finite set of distinct below-edge Cauchy rows, with all
unalternated samples of one sign.  Its explicit even order-one
Laguerre--Polya interpolant survives a simple-zero Hermite--Biehler
perturbation.  This is a density-one, type-`pi`, Nyquist-saturating
structural barrier, not an HSW-compatible or actual-zeta construction;
the half-lattice route does not retain a nonzero endpoint after a complete
prefix is killed.

The two focused modules pass `19/19`, and their exact shared direct
dependency union passes `38/38`.  Frozen canonical/raw discovery contains
`3694/3752` tests in `338/343` modules, with exactly `58` tests in the
unchanged five exclusions.  The 196-module frontier contains `2172` tests
and the 208-module replay inventory contains `2300`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.43 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.43 admits two internal theorem/barrier results. For a damped Paley--Wiener tail whose bandwidth stays a fixed distance below alternating Nyquist, the exact Fourier multiplier and Delta-Sobolev estimates show that the Stieltjes tail differs from E_m/Delta by O(h) in squared-average norm, uniformly on a fixed Delta-window and outside an exceptional set carrying O(h^2) endpoint energy. The exact near-edge Cauchy factorization and explicit relative endpoint, row, and kernel-remainder hypotheses imply |H_N/d_N|>=T/(16B). Together with the fixed physical HSW micro-window count and exact phase average this would imply (eta_N^pr)^2=O(1/log T), but only conditionally: the actual finite-lambda relative Stokes representation, its positive slow multiplier, all relative remainders, and the required q_L-weighted joint Hardy--Cauchy micro-window inequality are unproved, and separate phase and amplitude averages cannot be multiplied. Separately, an exact M+1-coordinate barycentric tail has nonzero endpoint E=1, one-signed unalternated samples, and annihilates M prescribed distinct below-edge Cauchy rows. An explicit even order-one Laguerre--Polya interpolant realizes it, and a simple-zero Hermite--Biehler perturbation makes the normalized rows arbitrarily small. This is a Nyquist-saturating artificial carrier lattice of density one and type pi, not an HSW-compatible zeta model or the actual finite-lambda tail; the sub-Nyquist half-lattice attempt with a killed complete prefix also kills the endpoint sum, so no obstruction under the correct density/type/slow-frequency margin is proved. Algebraic multiplicity, carrier limits, and endpoint/row remainders remain explicit. No actual eta decay or failure, actual high-row amplitude theorem, actual zeta-tail cancellation, quantitative even reserve, actual-arithmetic sign conclusion, new zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.44 complex Mellin and joint-connection barriers

The exact complex prolate action is positive and slowly varying on the
locked edge, and the label-`0/4` mixture has no leading saddle cancellation.
The carrier-safe phase-weighted projection formula and Hilbert transfer
replace the singular unweighted carrier interface: operator-relative
endpoint and row errors at most `1/4` retain at least `9/25` of the ideal
joint constant.  The finite-`lambda` complex-sector factorization and the
required operator-relative bounds are not proved.

The HSW micro-window has an explicit positive-measure phase-good subset.
The missing joint inequality is reduced to one endpoint-energy
nonconcentration condition, equivalently a covariance gap.  A local
correct-type and correct-density LP model has normalized joint energy
tending to zero, proving that those structural inputs do not force the
gate, but not giving an actual-Hardy or global HSW-compatible obstruction.

The exact physical Mellin integration has no hard-endpoint remainder and
gives a forward critical-line recurrence using convergent transforms.
Watson normalization selects the small root, while the label mixture gives
an exact diagonal two-channel system and scalar five-term recurrence.  The
remaining residual is a subturning Birkhoff connection theorem controlling
periodic connection factors, the minimal Green function, and one ordinate
derivative.

The three focused modules pass `33/33`, and their exact unique direct
dependency union passes `56/56`.  Frozen canonical/raw discovery contains
`3727/3785` tests in `341/346` modules, with exactly `58` tests in the
unchanged five exclusions.  The 199-module frontier contains `2205` tests
and the 211-module replay inventory contains `2333`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.44 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.44 admits three internal theorem/barrier results. First, the exact fourth-quadrant prolate Mellin action is positive and slowly varying on the locked edge, the label-0/4 mixture has no leading saddle cancellation, and the exact carrier-safe phase-weighted projection identity transfers an ideal joint constant kappa to 9*kappa/25 under operator-relative endpoint and row errors at most 1/4. The required finite-lambda complex-sector factorization and operator-relative remainders remain unproved. Second, the HSW micro-window contains a phase-good subset of explicit positive relative measure, and one endpoint-energy nonconcentration condition, equivalently a covariance gap, would imply the missing weighted joint Hardy--Cauchy inequality. A correct-type, correct-density local LP model has normalized joint energy tending to zero, showing that local real-zero geometry, density/type, slow positivity, and separate phase/amplitude information do not force that gate; it is not the actual Hardy source, a global HSW-compatible zeta divisor, or a locked-ceiling transport. Third, the physical prolate Mellin transform satisfies an exact boundary-complete recurrence, a positive-real-part critical-line forward form, Watson small-root normalization, separated subturning action branches, and exact diagonal two-channel and scalar five-term label-mixture equations. What remains is a uniform subturning Birkhoff connection theorem excluding nonconstant 2-periodic connection factors and controlling the minimal Green function and one ordinate derivative. Consequently no actual finite-lambda Stokes transfer, actual joint inequality, decay or failure of eta_N^pr, actual arithmetic sign, new zeta-zero theorem, RH implication or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.45 adaptive-carrier and fixed-grid alias residuals

The exact-carrier inverse closes the scalar schedule problem with
`N=e^(L/2)L^3+O(L)` and supplies a constant-`N` micro-plateau.  The
analytic Gevrey estimates remain stable there, but no finite strict matrix
gate is inherited under cutoff or plateau motion.

The exact adjacent-cutoff endpoint/Cauchy identities close the algebraic
same-index defect after squared block aggregation.  The remaining ideal
residual is now the conjunction of a discrete phase-weighted first-alias
lower bound and an endpoint frame.  The physical residual additionally
requires operator-relative Stokes control and finite-gate synchronization.

The proposed Mellin closure does not remove that residual.  Its exact
Riccati and gamma gauge expose a missing `|Im(s)|/c` term and a resonant
finite-seminorm obstruction.  The locked-edge factorization is conditional
on the still-unproved all-order/tail Closure Lemma `CL`.

For the Fourier-compact Guinand--Weil auxiliary statistic, the fixed-grid
alias residual is exactly a prime-power/divisor shifted convolution with
four approximate-functional-equation channels plus archimedean and higher
Poisson modes.  This is not the compact physical `PW1` statistic, and no
uniform auxiliary-to-physical passage is proved.  RH-PNT is already too
weak on the diagonal at both candidate scales.

The four focused modules pass `47/47`; their exact 18-path dependency
closure passes `110/110`.  Frozen canonical/raw discovery contains
`3774/3832` tests in `345/350` modules, with exactly `58` tests in the
unchanged five exclusions.  The 203-module frontier contains `2252` tests
and the 215-module replay inventory contains `2380`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.45 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.45 admits four internal theorem/barrier results in topological order. First, every sufficiently large target can be made an exact first-omitted carrier with N=e^(L/2)L^3+O(L), and a constant-N microplateau removes fixed-window edge drift while leaving finite simple-ground, boundary, shifted-sign, and reserve gates unsynchronized. Second, exact adjacent-cutoff endpoint/Cauchy recurrences and their squared block form reduce the desired ideal quotient to a discrete phase-weighted first-alias theorem, an endpoint frame, operator-relative Stokes transfer, and finite-gate/cutoff intersection; none is proved. Third, the exact minimal-Riccati/gamma gauge shows the finite-order Euler argument fails because of |Im(s)|/c and resonant top-seminorm losses; the claimed subturning factorization remains conditional on unproved all-order/tail Closure Lemma CL. Fourth, for a Fourier-compact Guinand--Weil auxiliary profile only, Poisson summation and the explicit formula reduce the first fixed-grid aliases to a prime-power/divisor shifted convolution with all four approximate-functional-equation channels; RH-PNT is too weak at the locked and critical interval scales, translation averaging does not select the fixed origin, and no exact passage to the compact physical PW1 profile is claimed. The Bettin--Fazzari continuous theorem and Gonek's correctly normalized T(log T)^2/(2pi) zero-sampled moment do not supply the fixed-grid theorem. Consequently no actual finite-lambda Stokes transfer, compact physical PW1 estimate, finite-gate synchronization, eta decay or failure, actual arithmetic sign, new zeta-zero theorem, RH implication or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.46 finite-gate synchronization and Volterra residuals

For one fixed coefficient space, quantitative spectral margins and moduli
now give an exact finite-gate transport theorem.  The constant-`N`
microplateau is covered if `A/t<R_sync`, where `R_sync` includes the
simple-ground, shifted-sector, boundary, Stokes-denominator, and reserve
margins.  The actual residual is that none of those relative margins or
moduli is controlled on the adaptive schedule.  Exact source-Cauchy models
show this omission is structural: a fixed derivative bound can coexist
with an arbitrarily small good radius, positive principal extensions can
flip ground parity, and padded extensions can produce arbitrarily long bad
cutoff windows.  The actual prime-threshold rank-one derivative jump also
precludes a global analyticity shortcut.  None of these models is the
actual pole--archimedean--prime chain.

The aggregate residual is correspondingly gate-restricted.  The finite
selector diagonal `D_n^(sel)` is not the physical Stokes zero-row
denominator `D_N^(St)`, and neither a gate-restricted arithmetic lower bound
nor a bad-set arithmetic leakage upper bound has been proved.

For the Mellin closure route, the exact Riccati coefficient is the Laplace
transform of a uniformly controlled finite signed measure.  Its negative
`J_2` lobe rules out a positive-measure or complete-monotonicity argument.
Turning-frequency quasimodes invalidate a uniform inverse on the
unrestricted `L1_1` Volterra algebra, with inverse growth at least
`c_j c^(1/4)`.  Because those packets live at frequency `2c`, outside the
required subturning window ending at `2c^(3/4)`, the restricted-window
inverse, Closure Lemma `CL`, and the conditional factorization all remain
open.

The two focused modules pass `23/23`; their exact 10-path dependency
closure passes `75/75`.  Frozen canonical/raw discovery contains
`3797/3855` tests in `347/352` modules, with exactly `58` tests in the
unchanged five exclusions.  The 205-module frontier contains `2275` tests
and the 217-module replay inventory contains `2403`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.46 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.46 admits two internal theorem/barrier results. First, quantitative fixed-dimensional margins and moduli give an exact finite-gate transport criterion across a constant-N microplateau, while exact source-Cauchy countermodels have arbitrarily small good radii, parity-flipping positive principal extensions, and arbitrarily long bad adjacent-cutoff windows. These are structural models, not the actual prime-power/archimedean matrices or zeta-zero Grams; the finite selector quantity D_n^(sel) is not the Stokes zero-row denominator D_N^(St), and neither actual margin/modulus estimates nor a gate-restricted aggregate arithmetic theorem is proved. Second, the exact Riccati coefficient is the Laplace transform of a uniformly controlled finite signed measure, not a positive or completely monotone one, and turning-frequency quasimodes invalidate a uniform inverse on the unrestricted L1_1 Volterra algebra. That resonance occurs at frequency 2c, outside the target strip ending at 2c^(3/4), so restricted all-order/tail Closure Lemma CL and the conditional subturning factorization remain open. Consequently no actual finite gate or gate failure, finite-gate/arithmetic-winner intersection, finite-lambda Stokes transfer, compact physical PW1 estimate, eta decay or failure, actual arithmetic sign, new zeta-zero theorem, RH implication or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.47 finite-order closure and adaptive arithmetic residuals

The global positive-support Wiener terminal proposal fails already at the
first nonlinear Riccati cherry: every exact representing measure has total
variation at least `(|I|^2+o(1))*c^(2/3)`, with
`|I|^2=0.349831425170034047...`.  The argument uses the turning-height
asymptotic and analytic continuation, so it rules out that exact global
class even when the representation is first asserted on the open
subturning band.  It does not rule out a band-local tail space.

The actual subturning residual is nevertheless closed without an all-tree
algebra.  Thirteen finite homogeneous orders make the weighted `C^1`
Riccati residual `O(c^(-14))`; the exact linearization and a conservative
`O(c^6)` action/Green bound give a contracting Newton correction of size
`O(c^(-8))`.  This yields an exact Watson-minimal solution and, for
`j=0,4` and `sqrt(c)<=t<=c^(3/4)/2`, the unconditional factorization

\[
 P_j(1/2-it)=e^{D_c(j-1/2-it)}H_j(1/2-it)(1+\varepsilon_j),
 \qquad
 |\varepsilon_j|+|\partial_t\varepsilon_j|
 \ll t^{-1}+t/c.
\]

This removes the former conditional subturning connection residual, but
not all-order/tail `CL`, the restricted Volterra inverse problem, exact
global periodic-factor exclusion, or any operator-relative exterior or
Stokes remainder.

Under RH, a Gonek dyadic shifted-moment subtraction selects a nonzero
Hardy value beside an actual zero.  The adaptive carrier inverse places
that value at the exact first-omitted carrier with
`N=e^(L/2)L^3+O(L)`, while the zero coordinate tends to `1/2`.  Its single
positive row proves compact physical singleton `PW1` with every fixed
`kappa<4` cofinally.  The endpoint-frame inequality `NY`, literal-ceiling
transport, finite-`lambda` Stokes transfer, and synchronization with the
finite gates remain independent residuals.

The three focused modules pass `36/36`; their exact 14-path, seven-pair
dependency closure passes `97/97`.  Frozen canonical/raw discovery
contains `3833/3891` tests in `350/355` modules, with the unchanged five
exclusions contributing `58`.  The 208-module frontier inventories `2311`
tests, and the 220-module replay inventory contains `2439`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.47 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.47 admits three theorem/barrier results in order. First, the first Riccati cherry forces c^(2/3) growth in every exact global positive-support Wiener terminal representation, invalidating that uniform global class but not all-order/tail Closure Lemma CL or a band-local construction. Second, thirteen finite perturbative orders and one polynomial-loss Newton correction prove the actual label-0/4 subturning Mellin factorization with one ordinate derivative throughout the stated window; the proof bypasses CL and does not prove exact global periodic-factor exclusion or operator-relative Stokes transfer. Third, under RH, Gonek's shifted zero-sampled moment proves exact compact physical singleton PW1 with every fixed kappa<4 on a cofinal adaptive exact-carrier schedule N=e^(L/2)L^3+O(L). It is not the literal ceiling schedule and proves neither NY, finite-gate synchronization, nor finite-lambda Stokes transfer. Consequently no eta decay or failure, actual arithmetic sign, new unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.48 endpoint-filter selection residual

Under RH, checkpoint 1.48 closes the adaptive arithmetic intersection that
checkpoint 1.47 left open.  A two-branch sub-Nyquist filter for the complete
normalized alternating Hardy--Xi endpoint gives the dyadic bounds

\[
 \int |\mathcal E|^2\ll Y\log Y,
 \qquad
 \int |\mathcal E'|^2\ll Y\log^3Y.
\]

Multiplicity-safe Sobolev sampling and nearest-integer spacing stability
then give total selected endpoint energy `O(Y log^3 Y)`.  Pigeonholing this
against Gonek's shifted zero-sampled moment selects one and the same
adaptive exact carrier with nonzero Hardy value, singleton `PW1` for every
fixed `kappa<4`, and

\[
 |e_m|^2+r_m^2|e_{m+1}|^2
 \leq C L|Z(t_\gamma)|^2.
\]

Hence `NY` holds with `C_E(L)=O(L)=o(L^2)`, and the ideal adjacent-cutoff
reduction gives `D_n^(id)/|e_n|^2 >= c_kappa L` for one of `n=m,m+1`,
apart from the already successful zero-endpoint alternative.

The remaining residual is not the exponentially envelope-weighted dyadic
formula (6.8): that formula is still unproved, and its dyadic envelope
cannot be extracted from Gonek's global error.  Nor does the new selection
return to the literal ceiling or a prescribed locked origin, transfer the
ideal endpoints and rows through the actual finite-prolate Stokes operator,
or place the selected adjacent cutoff inside all finite simple-ground,
boundary, shifted-sign, denominator, and reserve gates.  Therefore no eta
decay follows.

The one focused module passes `14/14`, and it plus its exact six-path,
three-pair dependency union passes `49/49`.  Frozen canonical/raw discovery
contains `3847/3905` tests in `351/356` modules; the unchanged five
exclusions contribute `58`.  The 209-module frontier contains `2325` tests,
and the 221-module replay inventory contains `2453`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.48 frontier, replay set, and complete
canonical suite were not rerun.

The checkpoint also repairs the stale handoff projection of checkpoint
1.47: four subturning promotions are synchronized, all thirteen omitted
claim keys are restored, and an explicit required-key replay preflight now
checks equality across the project, P0, and handoff claim surfaces without
set-intersection filtering.

Checkpoint 1.48 admits one RH-conditional theorem. On every sufficiently large dyadic interval, Gonek's shifted zero-sampled moment, a two-branch sub-Nyquist endpoint filter, and multiplicity-safe Sobolev sampling select the same adaptively rounded exact-carrier ordinate with nonzero Hardy value, singleton PW1 for every fixed kappa<4, and singleton NY with C_E(L)=O(L)=o(L^2). The frozen adjacent-cutoff reduction then gives D_n^(id)/|e_n|^2 >= c_kappa L for one of the two adjacent cutoffs, subject to its zero-endpoint alternative. This is an unweighted selection theorem and does not prove weighted formula (6.8), the literal ceiling or locked-origin schedule, actual finite-prolate Stokes/operator transfer, finite-gate intersection, or eta decay. The checkpoint also repairs stale HANDOFF claim metadata by synchronizing four checkpoint-1.47 promotions, adding all thirteen omitted checkpoint-1.47 keys, and installing an explicit cross-surface replay preflight. No actual arithmetic sign, unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.49 adaptive Stokes-transfer residual

Under RH, checkpoint 1.49 closes the actual-versus-ideal endpoint/row
transfer on the cofinal adaptive exact-carrier sequence.  Exact exterior
periodization controls the two-adjacent endpoint common mode at the
defect-relative scale.  An intermediate Gevrey cutoff controls the full
source beyond `U=c^(3/4)/2`; explicit jump variation and phase-weighted
Abel estimates also control the complete exterior selected row.  The
finite-order Newton lower scale and an absolute multiplier comparison then
show that all four normalized errors in the frozen adjacent-cutoff
interface tend to zero.  Hence the ideal quotient `>>L` becomes the actual
quotient `>>L`, and the positive-denominator branch has
`(eta_n^pr)^2=O(L^(-1))`.

The remaining residual is now the cutoff intersection, not this selected
analytic quotient.  The selected adjacent cutoff has not been synchronized
with the finite simple-ground, boundary, shifted-sign, denominator, and
reserve gates.  No literal-ceiling or fixed-origin transport, differentiated
far endpoint Abel tail, or quantitative reserve/saturation estimate is
proved.

The focused module passes `9/9`, and it plus its exact 18-path, nine-pair
dependency union passes `107/107`.  Frozen canonical/raw discovery contains
`3856/3914` tests in `352/357` modules; the unchanged five exclusions
contribute `58`.  The 210-module frontier contains `2334` tests, and the
222-module replay inventory contains `2462`, including the byte-unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.49 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.49 admits one RH-conditional adaptive transfer theorem. On the same cofinal selected exact-carrier sequence, exact exterior periodization controls the two adjacent endpoint common mode by a polynomial multiple of d_4; an intermediate Gevrey split and defect-relative jump estimate control the undifferentiated far endpoint and phase-weighted row values, including the complete exterior selected row; and the finite-order Newton lower scale plus an absolute cancellation-safe multiplier comparison makes every normalized actual-minus-ideal endpoint/row error o(1). Therefore the ideal adjacent quotient transfers to D_n^(act)/|d_n^(act)|^2 >= cL for one of the two adjacent cutoffs, and in its positive-denominator branch (eta_n^pr)^2=O(L^(-1))->0. This does not control a differentiated far endpoint tail, return to the literal ceiling or a fixed origin, synchronize the selected cutoff with the finite gates, or prove the missing reserve/saturation bounds. No actual arithmetic sign, unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.50 parity and reserve residual

Checkpoint 1.50 sharpens the two finite-gate residuals without closing
either.  The parity pair constructs the exact endpoint-zero even primitive
of the actual odd ground and reduces `lambda_+<lambda_-` to one strict
Christoffel-weighted mean comparison.  If that comparison held, the frozen
source commutator would also give simplicity and boundary nonvanishing.
The actual comparison remains missing, and a positive integer-multiplicity
evaluation-Gram countermodel shows that the frozen structural positivity
data do not imply it.

The saturation pair strengthens the adaptive selected-cutoff information:
the larger adjacent row simultaneously carries the actual order-`L`
quotient and an absolute carrier lower bound.  The projected-prolate
Rayleigh values decay only on the `exp(-pi^2 K/L)` scale, whereas a growing
actual-zero spectral cluster lies below `exp(-c_delta K)`.  Consequently
the derivative saturation diverges exponentially and the derivative
sufficient-reserve criterion cannot hold on this sequence.  This is a
sampling-energy statement, not a Hilbert-angle theorem, and it does not
orient the actual ground ratio `mu_K/alpha_K`.  The surviving scalar is the
true-ground inverse-fourth-moment statistic `Theta_K`, still uncontrolled.

The focused modules pass `19/19`, and they plus their exact nine-path direct
dependency union pass `50/50`.  Frozen canonical/raw discovery contains
`3875/3933` tests in `354/359` modules; the unchanged five exclusions
contribute `58`.  The 212-module frontier contains `2353` tests, and the
224-module replay inventory contains `2481`, including the byte-unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.50 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.50 admits two RH-conditional theorem/barrier pairs. First, the exact clamped primitive of the actual odd Gram ground yields a finite Rayleigh/Christoffel mean criterion whose strict positivity would imply lambda_+<lambda_- and hence simple-even ground and boundary nonvanishing; the criterion is not proved, and an exact positive integer-multiplicity evaluation Gram with an odd ground shows that positivity, source-Cauchy displacement, reflection symmetry, and separate moment positivity do not force it. Second, on the adaptive Stokes sequence, larger-row selection and the selected-carrier lower scale show q_K^pr,r_K^pr >= exp{-(pi^2+o(1))K/L}, while the actual-zero cluster gives lambda_{k_K}(A_K^circ)<=exp{-(c_delta-o(1))K}; hence derivative saturation diverges exponentially and its bottom-cluster sampling-energy fraction vanishes. This invalidates that sufficient derivative-reserve route but does not orient mu_K/alpha_K, prove a Hilbert-space angle, the actual simple-even or even-reserve gates, finite-gate synchronization, or a literal-ceiling result. No unconditional zeta-zero theorem, RH proof or converse, actual arithmetic parity conclusion, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.51 actual-ground response residual

The odd residual is now exactly one boundary/response sign:

\[
 \Delta_N>0
 \quad\Longleftrightarrow\quad
 p_-(0)\omega_-(p_-)<0
 \quad\Longleftrightarrow\quad
 \lambda_-'(0)<0.
\]

The source commutator and negative-Sobolev formulations are exact
equivalents, but none supplies the sign.  The even residual is exactly the
four-moment squared-commutator scalar for `Theta_K-1`, equivalently the two
unoriented boundary moments left by the second Christoffel transform.  Its
low-row mass equals the logarithmic ground response and is bounded by
`1-alpha(0)/alpha(1)`; the required relative row-deletion floor and `G_K`
control remain missing.  The two exact `N=2` models rule out a structural
orientation inference.

The focused module passes `8/8`, and the exact unique direct closure passes
`27/27`.  Frozen canonical/raw discovery contains `3883/3941` tests in
`355/360` modules; the unchanged five exclusions contribute `58`.  The
213-module frontier contains `2361` tests, and the 225-module replay
inventory contains `2489`, including the byte-unchanged 12-module,
128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.51 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.51 admits one RH-conditional internal theorem/barrier pair. It proves exact odd-ground boundary-functional, Christoffel-derivative, source-commutator, and negative-Sobolev scalar reductions; exact even-ground squared-commutator, second-Christoffel, low-row logarithmic-response/concavity, and inverse-fourth-moment scalar reductions; and two exact N=2 structural nonimplications. No sign or orientation is proved, no useful upper bound for Theta_K or relative row-deletion stability is obtained, and no structural model is identified with the zeta divisor. The actual parity, simple-even, boundary, even-reserve, finite-gate synchronization, literal-ceiling, determinant-convergence, and all unresolved gates remain false. No unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.52 critical covariance and transport residual

At critical density the one-branch endpoint/Cauchy symbol is now exact,
including its Lerch constant term.  The conjugate two-branch block is the
remaining issue: its smallest gain is only
`Theta(R log L/L)` for every `R=o(L)`, a fixed zero has only bounded RMS
gain over a linear block, and every finite multi-frequency coefficient
space has an endpoint-nonzero row nullspace.  Fresh actual zero rows would
need a positive weighted covariance gap.  Exact-grid filters do not create
that gap because the `k=+-1` Poisson aliases and all four AFE channels
survive.  No actual zero-energy covariance or prime-power/divisor
shifted-convolution estimate is proved.

The analytic critical-density Mellin residual is sharper.  The corrected
transport `T_j` has uniform normalized defect `O(c^(-2))`; its exact
forward-minimal Green operator costs `O(sqrt(c))`; and the recurrence,
inner connection, and Laurent propagation prove the physical continuation
at `Re(s)=1/2` with relative error `O(c^(-1/2))` and one ordinate
derivative.  The action phase leaves a positive leading label-0/4
multiplier.  What remains on this side is not the critical Mellin
connection but the operator-relative exterior/Stokes comparison and the
supercritical Abel tail for `t>=c`.

The focused modules pass `20/20`, and the dependency-ordered exact unique
direct closure passes `98/98`.  Frozen canonical/raw discovery contains
`3903/3961` tests in `357/362` modules; the unchanged five exclusions
contribute `58`.  The 215-module frontier contains `2381` tests, and the
227-module replay inventory contains `2509`, including the byte-unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.52 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.52 admits two internal theorem/barrier pairs in topological order. First, at N=D lambda^2 L+O(1), D compact in (1/(2pi),1/2), the exact Lerch symbol has scalar gain z log L+O(1), but the real two-branch gain is Theta(R log L/L) for R=o(L); every finite multi-frequency section has an endpoint-nonzero row nullspace, and exact carrier filters retain the k=+-1 aliases and all four AFE channels. This proves no failure of the actual Hardy coefficients: the required actual zero-energy covariance or prime-power/divisor shifted-convolution theorem remains open. Second, the critical-density prolate Mellin continuation to Re(s)=1/2 is proved with the essential transport T_j, positive label-0/4 leading multiplier, uniform O(c^-2) normalized defect, O(sqrt(c)) forward-minimal Green cost, and relative connection error O(c^-1/2) with one ordinate derivative. It proves no operator-relative Stokes transfer or supercritical Abel tail for t>=c. The actual critical arithmetic covariance, finite-gate synchronization, parity, simple-even/boundary, reserve, literal-ceiling, determinant-convergence, and all unresolved gates remain false. No unconditional zeta-zero theorem, RH proof or converse, or de Bruijn--Newman Lambda bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.53 adaptive covariance, Abel-tail, and scalar residual

Under RH, the arithmetic residual at critical density is now closed on an
adaptive same-zero schedule.  The exact carrier attached after each zero,
Gonek's microscopic half-cell shift, the Hardy cross estimate, and a
global positive tangent envelope give

\[
 \sum |C_\gamma|^2\gg YL^3(\log L)^2,
 \qquad
 \sum |E_\gamma|^2\ll YL^3.
\]

The selected ordinate has both the relative gain
`|C|^2 >> (log L)^2 |E|^2` and the absolute floor
`|C|^2 >> L^2(log L)^2`.  This bypasses rather than proves the fixed-grid
covariance and shifted-convolution gates left open at checkpoint 1.52.

The analytic exterior residual is also closed at the needed scale.  For
arbitrary real `lambda`, full-source recombination gives the Abel endpoint
tail `P(c,L) exp(-2c/5)` from `0.9c`, the stronger
`P(c,L) exp(-c/2)` tail from `c`, and the same `2/5` exponent for the
carrier-safe sampled row.  No half-integer or Diophantine condition is
used, and no differentiated-tail or compact/exterior split is hidden in
the estimate.

At the same selected zero and the exact single cutoff `N=m-1`, the endpoint
and phase-row identities then transfer to the actual prolate source with
errors `o(|q_m|A_0)`.  The absolute row floor makes endpoint cancellation
harmless.  Consequently the nonzero-endpoint branch satisfies

\[
 {D_N^{\rm act}\over |d_N|^2}\gg(\log L)^2,
 \qquad
 (\eta_N^{\rm pr})^2=O((\log L)^{-2})\to0.
\]

The remaining residual is finite and schedule-specific: this adaptively
chosen `N=m-1` has not been put on the literal-ceiling or prescribed
half-integer schedule and has not been synchronized with the finite
simple-ground, boundary, shifted-sign, response-reserve, or
strict-denominator gates.  Determinant convergence and all unconditional
zero claims remain open.

The focused modules pass `34/34`, and the exact dependency-ordered
12-module closure passes `144/144`.  Frozen canonical/raw discovery
contains `3937/3995` tests in `360/365` modules; the unchanged five
exclusions contribute `58`.  The 218-module frontier contains `2415`
tests, and the 230-module replay inventory contains `2543`, including the
byte-unchanged 12-module, 128-test support block.  The expanded
checkpoint-1.20 through checkpoint-1.53 frontier, replay set, and complete
canonical suite were not rerun.

Checkpoint 1.53 admits three results in topological order. First, under RH, adaptive exact carriers assigned after each zero prove the global-positive-tangent same-zero bounds A_Y >> YL^3(log L)^2, B_Y << YL^3, and select one ordinate with |C|^2 >> (log L)^2|E|^2 and |C|^2 >> L^2(log L)^2. This is not the fixed-origin covariance theorem. Second, for arbitrary real lambda>1, the complete full-source Abel endpoint tail is P(c,L)e^(-2c/5) from 0.9c, P(c,L)e^(-c/2) from c, and the carrier-safe sampled Cauchy row has the same 2/5 bound, without differentiating an Abel tail or splitting a compact endpoint from an exterior tail. Third, at the same adaptively selected zero and cutoff N=m-1, these inputs give the actual one-cutoff quotient D_N^(act)/|d_N|^2 >> (log L)^2, or the favorable zero-endpoint branch, and hence (eta_N^pr)^2=O((log L)^(-2))->0 under RH. The literal-ceiling and prescribed half-integer schedules, finite simple-ground, boundary, shifted-sign, response-reserve and strict-denominator gates, determinant convergence, and all unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.54 critical half-grid and true-ground residual

Under RH, the adaptive critical schedule is now retuned to the strict odd
half-grid `lambda'_Y=p_Y/2` with

\[
 D'_Y=D_Y+O(t_Y^{-1/4}),\qquad
 N'_Y=\left\lceil D'_Y(\lambda'_Y)^2L'_Y\right\rceil
\]

exactly.  The tangent endpoint and same-zero row filters change by `o(1)`,
and the absolute row floor absorbs this perturbation.  Rerunning the
critical scalar interface at the primed parameters preserves the actual
quotient `>>(log L')^2` and eta-squared bound `O((log L')^(-2))`, subject
to the same favorable zero-endpoint alternative.

The remaining schedule residual is narrower but nonempty.  The density
`D'_Y` varies with `Y`; no prescribed fixed-`D` literal ceiling is proved.
The old `ceil(lambda*L^3)` Gevrey ceiling is also still open.  Continuity
of the explicit infinite tangent filters is not continuity of actual
finite endpoint or Gram data across the cutoff displacement.

The finite residual is now isolated at the true grounds.  At critical
density, the actual low-zero evaluation map has nullity

\[
 (1-\log D){N\over L}+O_D(L)=\Theta_D(e^L),
\]

but primitive comparison on this nullspace bounds an even trial below only
the constrained odd minimum.  Since that minimum is at least the true odd
ground, the minimax inequality points the wrong way.  The new barrier gives
sharp relative row-deletion sufficient conditions for the odd determinant
and the true-even reserve, but proves neither condition for actual zeta
rows.  Its exact paired-evaluation odd-ground model and source-Cauchy
reserve-collapse family are structural nonimplications only.

The irreducible actual targets are therefore the primitive determinant
`Delta_N>0`, shifted-sector margin `Sigma_N>0`, and true-ground statistic
`Theta_N<=1-rho` or direct reserve `mu_N/alpha_N<=1-rho`.  The selected
projected-prolate scalar floor controls none of them by itself.

The focused modules pass `20/20`, and the exact eight-module direct closure
passes `81/81`.  Projected canonical/raw discovery contains `3957/4015`
tests in `362/367` modules; the unchanged five exclusions contribute `58`.
The 220-module frontier contains `2435` tests, and the 232-module replay
inventory contains `2563`, including the byte-unchanged 12-module,
128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.54 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.54 admits two results. First, under RH, a third-derivative van der Corput and Erdos--Turan selector retunes each adaptive critical carrier to an odd half-grid lambda'_Y=p_Y/2 and a varying density D'_Y=D_Y+O(t_Y^{-1/4}) with N'_Y=ceil(D'_Y lambda'^2_Y L'_Y) exactly; tangent endpoint and row filters are stable, and the checkpoint-1.53 scalar interface is rerun at the primed cutoff. This does not prove a prescribed fixed-D ceiling or the old Gevrey ceiling ceil(lambda L^3). Second, the critical low-zero nullspace, an exact positive paired-evaluation odd-ground example, sharp row-deletion criteria, and a positive source-Cauchy reserve-collapse family show that the scalar floor does not imply the actual primitive determinant, shifted-sector margin, or true-ground reserve. This is a structural nonimplication, not an actual-zeta gate failure. All finite simple-ground, boundary, shifted-sign, response-reserve, strict-denominator, determinant-convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.55 mixed-cofactor and negative-Sobolev residual

The odd primitive residual is now a single exact mixed determinant target.
For a simple actual odd ground, the cofactor pairing, bordered determinant,
Christoffel--Geronimus derivative, and origin-separated inequality

\[
 R<\lambda s_0K
\]

are equivalent, with coefficient exactly one.  The complete Andreief
expansion writes both sides as alternating combinations of nonnegative
mixed zero--carrier Vandermonde volumes.  The unresolved content is the
orientation of that alternating balance for the actual zeta functional.
Neither positivity nor the checkpoint-1.54 exterior row supplies it; a
growing positive evaluation-Gram family realizes both signs.

The true-ground escape residual can also be stated directly in
negative-Sobolev form.  Support above the least positive ordinate proves
the sufficient bounds

\[
 L^2J_1(u)>\left({2\pi\over\gamma_1}\right)^2,
 \qquad
 L^4J_2(h)\geq {1\over\tau}
       \left({2\pi\over\gamma_1}\right)^4,
\]

but gives no lower bound for `J_1` or `J_2` on the unknown actual grounds.
Exact positive source-Cauchy models with simple strict grounds have
`J_1=3/N^2` and `J_2=3/N^4+O(N^-6)`, and nearby integer-multiplicity
evaluation Grams retain this behavior.  A separate HSW-compatible count
model has the same high-mode escape but a singular, degenerate ground.
These are structural and count-level nonimplications, not actual-zeta
counterexamples.

The focused modules pass `20/20`, and the deduplicated exact seven-module
direct closure passes `58/58`.  Projected canonical/raw discovery contains
`3977/4035` tests in `364/369` modules; the unchanged five exclusions
contribute `58`.  The 222-module frontier contains `2455` tests, and the
234-module replay inventory contains `2583`, including the unchanged
12-module, 128-test support block.  The expanded checkpoint-1.20 through
checkpoint-1.55 frontier, replay set, and complete canonical suite were not
rerun.

Checkpoint 1.55 admits two internal theorem/barrier results. First, for a simple actual odd ground under RH, the remaining primitive sign is exactly equivalent to a negative mixed adjugate cofactor, a positive bordered determinant, a negative Christoffel--Geronimus derivative, and R<lambda*s_0*K with coefficient exactly one; Andreief gives alternating expansions in nonnegative mixed zero--carrier Vandermonde volumes. None of these identities proves the inequality, and a growing positive evaluation-Gram family realizes either derivative sign without being the zeta divisor. Second, support above gamma_1 gives sufficient negative-Sobolev conditions for the odd primitive comparison and true-even reserve, but exact positive source-Cauchy and nearby integer-multiplicity evaluation Grams have simple strict grounds with J_1=3/N^2 and J_2=3/N^4+O(N^-6); an HSW-compatible carrier multiset supplies a separate singular count-level obstruction. These are structural and count-level nonimplications, not actual-zeta ground escape or actual gate failure. The actual mixed sign, negative-Sobolev lower bound, all finite gates, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.56 natural-halfgrid cross-root residual

The schedule residual is no longer an odd-halfgrid obstruction at the
natural outer scale.  For odd `p`, the exact mesh of
`lambda_p=p/2`, `L_p=2*log(lambda_p)` is `O(lambda_p^(-1))`.  The frozen
HSW shell supplies a stability radius at least `1/(16T)`, and therefore
gives deterministic cofinal phase-good rounding whenever the certified
ratio

\[
 {T\over\lambda}\asymp {N\over\lambda L}
\]

tends to zero.  This closes the scheduling step for `N=M+1` and every fixed
`N=ceil(C*lambda)`, without RH.  It does not close the critical or Gevrey
half-grid schedule: those scales lie outside the derivative-based rounding
regime, and no claim that they are phase-bad follows.

The cross-root finite residual is now isolated inside the even sector.  On
the simple branch it is the strict complement above the lower two-vector
Ritz value, a bounded Ritz ratio, and

\[
 \mathcal A_{N,\lceil\lambda\rceil}
 =\|P_{\mathcal L_{\lceil\lambda\rceil}}X\|^2
 =O(\lambda^{-1}).
\]

On a multiple lowest-even space it is the visibility and subpolynomial
mixed overlap of the canonical projection `P_E*eta`, followed by the same
projective bound.  Global parity, an odd shifted sign, a simple-line
boundary denominator, and the true-ground reserve are not premises of this
cross-root route.  The even complement and canonical mixed projector remain
unproved for the actual source.

The exact padded diagonal source-Cauchy family demonstrates the surviving
logical gap: all favorable scalar and even-sector fixtures hold with fixed
margins, while `A_(N,M)=1/2` for every growing cutoff.  Therefore the
checkpoint-1.53 through checkpoint-1.55 scalar results cannot be promoted
to an actual lowest-even projective theorem.

The focused modules pass `23/23`, and the exact 13-module deduplicated
target/direct-dependency closure passes `126/126`.  Projected canonical/raw
discovery contains `4000/4058` tests in `366/371` modules; the unchanged
five exclusions contribute `58`.  The 224-module frontier contains `2478`
tests, and the 236-module replay inventory contains `2606`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.56 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.56 admits two internal theorem/barrier results. First, without assuming RH, the exact odd half-grid supports deterministic cofinal natural cutoffs and a multiplicity-safe HSW phase-good subsequence at the natural scale; more generally, the certified rounding argument applies when N=o(lambda L). It does not reach the critical N asymp lambda^2 L or Gevrey N asymp lambda L^3 schedules and supplies no actual finite source gate or projective alignment. Second, the checkpoint-0.71 cross-root route bypasses global parity, the odd shifted sign, the simple-line boundary denominator, and the true-ground reserve, but still requires an even complement or visible canonical lowest-even projector together with A_(N,M)=O(lambda^(-1)). An exact growing positive source-Cauchy/evaluation-Gram family satisfies the favorable scalar and even-sector inputs while keeping A_(N,M)=1/2, so checkpoint-1.53 through checkpoint-1.55 scalar inputs do not imply alignment. This is an abstract nonimplication, not an actual-zeta failure. The actual even complement/canonical overlap, projective alignment, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.57 first-zero support-gap and weighted-projector residual

The critical support residual cannot be closed from the first-zero gap or
the zero count.  The exact carrier has `O(L)` atoms below
`g=gamma_1^2`, but its constant-direction mean is

\[
 {\sigma_e(y)\over\sigma_e(1)}
 ={\pi^2De^L\over L}\{1+o_D(1)\}\gg g.
\]

A positive count-compatible free-weight measure supported from `g` can
have a positive simple generalized odd ground with `Delta_N<0`, while all
of its Gaussian and Sturm roots stay above `g`.  Its carrier ground can be
arbitrarily close to the constant direction, whose exact statistics make
`L^2*J_1` and `L^4*J_2` tend to zero.  Thus support ordering, count, root
location, and free weights do not imply the actual mixed sign or reserve.
The remaining critical input must use the fixed zeta weights, their carrier
phases, or an equivalent actual-ground row-deletion or source-correlation
bound.  The counterfamily is not the zeta divisor and proves no actual-zeta
gate failure.

At the natural odd-halfgrid scale, the cross-root residual is now a single
denominator-safe weighted high-high estimate.  With
`u_p=P_p*eta_p`, `a_p=<kappa_p,u_p>`, and
`k_p=1-|<e_p,kappa_p>|^2`, the exact identity

\[
 {\Delta_p\over k_p}=\|P_{{\cal L}_p}u_p\|^2
\]

is multiplicity-safe.  Its derivative-cofactor form uses the same weight
`|d_p|^2` on both sides, and its simple-ground form uses the common complete
source inverse.  The unresolved arithmetic estimate is

\[
 \sum_{p\in{\cal G}_P}{\Delta_p\over k_p}
 \leq {C(\log P)^B\over P}
       \sum_{p\in{\cal G}_P}|a_p|^2,
\]

together with `G_P!=empty` and positive total visibility on cofinally many
dyadic blocks.  These premises would select the required projective rate
for every fixed logarithmic loss, but none is proved.  Strict qualitative
complementarity, contour formulas, rank-one lowering, and entrywise prime
large-sieve estimates do not supply the adaptive average.

The focused modules pass `21/21`, and the exact nine-module deduplicated
target/direct-dependency closure passes `93/93`.  Projected canonical/raw
discovery contains `4021/4079` tests in `368/373` modules; the unchanged
five exclusions contribute `58`.  The 226-module frontier contains `2499`
tests, and the 238-module replay inventory contains `2627`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.57 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.57 admits two internal barrier/target results. First, at critical density the exact carrier has only O(L) atoms below the first-zero support, but a positive count-compatible free-weight measure can have a positive simple generalized odd ground, all Gaussian and Sturm roots above that support, and Delta_N<0, while its negative-Sobolev statistics vanish at the critical scale. This proves only that support gap, zero count, root location, and free positive weights do not force alignment; the construction is not the zeta divisor and proves no actual-zeta failure. Second, the natural cross-root statistic has exact codimension-two, multiplicity-safe derivative-cofactor, and simple complete-source inverse-response forms. A gate-restricted weighted average with any fixed logarithmic loss would select the required projective rate, provided the same good set is nonempty and has positive total visibility. The arithmetic average, gate nonemptiness, visibility, actual projective alignment, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.58 HSW frame and outer-shell inverse-spread residual

The natural halfgrid schedule does not turn the HSW scalar phase mass into
the even-complement frame required by the cross-root route.  On RH, the
selected positive shell Gram factors as

\[
 G_T^+={8W_T\over L}\mathcal C_T,
 \qquad (\mathcal C_T)_{00}=1,
\]

but the frozen shell has rank less than `N/4`, and all positive rows through
the carrier still have rank less than `N`.  Their projected complement
floors are therefore exactly zero.  Off RH, the same scalar phase statistic
does not define a positive source subform because an off-line quartet is a
signature `(1,1)` Krein block.  The complete-source residual is instead the
actual signed covariance gate and relative Schur response

\[
 a_p^{\rm cmp}>v_p,
 \qquad
 \sum_{p\in\mathcal G_P}|a_p|^2
 {q_p-\mu_p\over a_p^{\rm cmp}-\mu_p}
 \ll { (\log P)^B\over P}
 \sum_{p\in\mathcal G_P}|a_p|^2.
\]

Neither estimate follows from HSW phase goodness.

For the actual natural outer even source column, checkpoint 1.58 proves the
pre-inverse mean-square estimate

\[
 {1\over|\mathcal C_P|}\sum_{p\in\mathcal C_P}
       \|\Pi_Rh_p\|^2
 \ll {(R+1)(\log P)^6\over P}
       +{R^3(\log P)^2\over P^2}.
\]

The remaining simple-ground residual is the gate-weighted adaptive
inverse-spread mean

\[
 \mathcal I_{P,R}
 ={ |\mathcal C_P|\over W_PH_{P,R}}
 \sum_{p\in\mathcal G_P}\chi_p
       \|\overline P_pR_ph_p\|^2
 \ll (\log P)^D,
\]

together with good-set and visibility nonvacuity.  A positive synthetic
source-Cauchy family proves that arbitrarily small raw prefixes do not force
this estimate, but is not an actual-arithmetic counterexample.

The two focused modules pass `30/30`, and the exact seven-module
target/direct-dependency closure passes `86/86`.  Projected canonical/raw
discovery contains `4051/4109` tests in `370/375` modules; the unchanged
five exclusions contribute `58`.  The 228-module frontier contains `2529`
tests, and the 240-module replay inventory contains `2657`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.58 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.58 admits two theorem/barrier results. First, on the explicitly RH-conditional positive-zero branch, the selected HSW shell Gram factors as G_T^+=(8W_T/L)C_T with (C_T)_(00)=1, but the frozen carrier-safe shell has rank less than N/4 and projected even-complement covariance floor exactly zero; even all positive rows through Omega remain rank deficient. Off RH an off-line quartet gives a signature-(1,1) Krein block, so W_T is not an unconditional positive subform of the complete source. The conditional covariance-to-alignment and complete signed-source Schur reductions identify, but do not prove, the actual complement gate or O(lambda^(-1)) relative response. Second, the actual natural outer even source column satisfies the unconditional fixed/polylogarithmic-prefix mean-square bound, and exact simple-ground identities reduce the checkpoint-1.57 statistic to a gate-weighted adaptive inverse-spread mean. A positive synthetic source-Cauchy family proves that raw prefix decay alone does not imply this inverse estimate; it is neither the actual arithmetic source nor the natural prolate anchor. The actual signed covariance bound, inverse-spread estimate, finite-good-set nonemptiness, positive visibility, actual projective alignment, determinant convergence, and unconditional zero claims remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.59 natural Gevrey and normalized-Plucker residuals

The natural Gevrey theorem closes the absolute adjacent-cutoff residual at
the non-effective but uniform scale

\[
 e_{\lambda_p,M_p}+e_{\lambda_p,N_p}
 +\epsilon_{\lambda_p,N_p}+U_{Z,p}+|q_p|
 +\|(Q_{p,+}-q_pI)\kappa_p\|
 =O\!\left(e^{-c\lambda_p/L_p}\right).
\]

The remaining simple-ground residual is relative rather than absolute:

\[
 \mu_{2,p}-q_p\geq\sqrt{\lambda_p}\,
 \|(Q_{p,+}-q_pI)\kappa_p\|.
\]

This would imply the required `O(lambda^(-1))` alignment, but is not proved
for the actual arithmetic matrices.  The exact positive source-Cauchy
family with alignment `1/2` shows that the new absolute estimates and the
listed finite gates do not supply it.

On the simple outer-border branch, the exact scale cancellation and
source-displacement identities rewrite the checkpoint-1.57 residual as

\[
 {\cal G}_P\ne\varnothing,
 \qquad
 \sum_{p\in{\cal G}_P}{\varpi_p^\kappa\over k_p}
       \|q_p\wedge Y_p\|^2
 \ll { (\log P)^B\over P}
 \sum_{p\in{\cal G}_P}\varpi_p^\kappa
       |\langle\kappa_p,z_p\rangle|^2.
\]

The response uses both inverse-Christoffel generators and the exact factor
`(2N-1)^(-1)`.  On the strict simple branch the anchor weight is
automatically positive, so a nonempty good set has positive total anchor
weight without an eta-visibility hypothesis.  Hankel positivity, the
all-pole trace, formal fixed-source degree counting, and adjacent prime-block
contiguity do not prove this eta-free gate-restricted estimate or good-set
nonemptiness.  The canonical multiple branch retains its mixed boundary
visibility obligation.

The two focused modules pass `25/25`, and the exact eight-module
target/direct-dependency closure passes `77/77`.  Projected canonical/raw
discovery contains `4076/4134` tests in `372/377` modules; the unchanged
five exclusions contribute `58`.  The 230-module frontier contains `2554`
tests, and the 242-module replay inventory contains `2682`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.59 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.59 admits two internal theorem/barrier results. First, on the odd natural halfgrid with adjacent cutoffs M=ceil(lambda) and N=M+1, the genuine source-normalized prolate/arithmetic state has projection error, complete sampled remainder, normalized shift, Rayleigh scalar, and undifferentiated residual O(exp(-c lambda/L)). The exact Temple/Davis--Kahan chain shows that the relative gap condition mu_2-q >= sqrt(lambda) r would imply O(lambda^(-1)) simple-ground alignment, but no such actual arithmetic gap or canonical multiple-ground orientation is proved. A positive inversion-symmetric source-Cauchy diagonal family has the same absolute exponential scale and favorable finite gates while its alignment statistic equals 1/2, so it is only a structural nonimplication, not the actual arithmetic source. Second, on the simple outer-border branch, characteristic-derivative and determinant scales cancel in boundary and anchor projections of the same canonical null vector; the numerator is a positive normalized second-Plucker norm, the automatic simple-branch anchor denominator is one bordered determinant, and source-Cauchy displacement gives exactly two inverse-Christoffel generators with the factor (2N-1)^(-1). The strict simple gate makes the anchor cofactor weight positive, so any nonempty strict-simple good set automatically has positive total anchor weight and no separate eta-visibility hypothesis is needed there. Positivity does not uniformly bound the inverse-Christoffel generators, and the checkpoint-1.58 synthetic family realizes only that obstruction. The formal fixed-mu/fixed-anchor-weight degree audit is not a literal prime-correlation theorem after substituting the adaptive bottom root, gate, and anchor cofactor weights; the all-pole trace does not isolate the ground projector; and contiguous adjacent prime blocks do not transport the complete matrix. The simple branch still needs a nonempty finite-good set and the actual eta-free gate-restricted, anchor-weighted normalized Plucker/inverse-Christoffel covariance estimate; the canonical multiple branch still needs mixed boundary visibility. Actual projective alignment, determinant convergence, and every unconditional zero claim remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.60 centered-gate/cofactor and complete-source residuals

For the actual complete inversion-even source, anchor `kappa`, Rayleigh
scalar `q=<kappa,Q_+ kappa>`, and complement chart `R`, checkpoint 1.60
isolates the affine centered residual

\[
 H_q=R^*(Q_+-qI)R.
\]

The strict sufficient condition `H_q>0` gives the lower-Ritz gate and the
sharp exact ratio `0<(q-u)/r<1`.  If `r=0`, the same strict complement
condition makes `kappa` the exact unique ground and closes the projective
observable.  At arbitrary `t`,

\[
 H_t>0\quad\Longleftrightarrow\quad
 \mu_2(Q_+)>t\ \hbox{ and }\qquad
 \langle\kappa,\operatorname {adj}(Q_+-tI)\kappa\rangle>0.
\]

Consequently the remaining finite occurrence residual is the actual
cofinally-many-block assertion `mu_2,p>q_p` and `D_p(q_p)>0`.  The exact
Ritz statistic is the normalized cubic moment, while the determinant and
prime-threshold formulas expose a growing-order signed correlation and an
adaptive cofactor contrast rather than a favorable sign theorem.  The
eta-free covariance residual from checkpoint 1.59 remains separate.

The second pair cancels the complete source scalar before spectral
operations:

\[
 \langle v,H_qv\rangle
 =\mathfrak h_\lambda(v)-\mathfrak h_\lambda(\kappa),
 \qquad v\perp\kappa,
\]

so the surviving unconditional residual is a signed relative discrepancy
inequality.  Under RH only, the kappa-deflated endpoint-flat construction
instead proves the upper obstruction

\[
 \lambda_{\min}(P_{\kappa^\perp}Q_+P_{\kappa^\perp}
     |_{\kappa^\perp})
 \leq \exp\{-(0.4087565479\ldots-o(1))N\}.
\]

It cannot be reversed into a lower frame estimate, and the one-sided bound
`|q|=O(exp(-c*N/L))` does not prove gate failure.  Off RH, the zero-side
form has a signature-`(1,1)` Krein block rather than a positive complete
source Gram.

The focused pair passes `23/23`, and the exact eight-module deduplicated
target/direct-dependency closure passes `95/95`.  Projected canonical/raw
discovery contains `4099/4157` tests in `374/379` modules; the unchanged
five exclusions contribute `58`.  The 232-module frontier contains `2577`
tests, and the 244-module replay inventory contains `2705`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.60 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.60 admits two internal theorem/barrier results. First, every simple lowest inversion-even source-Cauchy line is axis-rooted, including the zero-boundary-pairing case, so the repaired simple branch is normalized by `P*kappa`. The centered compression `H_q` is affine-linear in the complete source; under the strict condition `H_q>0` it supplies the lower-Ritz gate and `0<(q-u)/r<1`, while the same strict centered-complement condition gives immediate projective closure when `r=0`. Moreover, `H_t>0` is equivalent to `mu_2(A)>t` together with `D(t)>0`. The Ritz statistic is an exact normalized cubic moment, whereas `D_p(q_p)` is a growing-order signed determinant correlation and its adaptive prime-threshold cofactor contrast has no fixed sign. Two synthetic source-Cauchy families show separately that absolute quasimode/source-Cauchy data do not force a centered-good index and that a strict simple gate need not give eta visibility; neither is the actual arithmetic source. The actual cofinally-many-block occurrence `mu_2,p>q_p` and `D_p(q_p)>0`, and the actual eta-free weighted covariance estimate, remain unproved. Second, the source-independent scalar cancels exactly from the complete centered compression, leaving the signed relative discrepancy inequality. Under RH only, a kappa-deflated two-dimensional rational-residue construction annihilates the first `floor(theta*N)` distinct positive-zero rows and is flat to growing order at both endpoints, proving the low-height rank deficits and the coframe upper obstruction with exponent `0.4087565479...`. This is an upper obstruction, not a lower frame estimate or centered-gate failure: the available one-sided bound `|q|=O(exp(-cN/L))` cannot be reversed into a positive lower bound. Off RH, every off-line quartet contributes a signature-`(1,1)` Krein block, so critical-line squares are not a positive subform of the complete source. Actual centered-good-set nonemptiness, the relative complete-source gate, eta-free covariance, canonical-multiple mixed visibility, projective alignment, determinant convergence, and every unconditional zero claim remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.61 halfgrid exponent and multiple-ground selector residuals

For every cutoff in the certified halfgrid-roundable range

\[
 L^2=o(R),\qquad R=o(\lambda L),
\]

the actual projection, scalar, and residual estimates have the frozen class

\[
 e_{\lambda,R}+|q_R|+
 \|(Q_{R,+}-q_RI)\kappa_R\|
 =O\!\left(e^{-cR/L}\right).
\]

Under RH only, the optimized kappa-deflated endpoint-flat witness instead
gives the coframe upper obstruction

\[
 a_R\leq\exp\{-(0.408756547856\ldots-o(1))R\}.
\]

The centered gate would therefore force `q_R` below the latter scale, but
the available scalar estimate is only a one-sided upper bound at the former
scale.  This is a factor-`L` residual mismatch, not a contradiction or gate
failure.  Lower bridge projections make the comparison no better, and the
formal near-quadratic balance leaves the certified rounding range.  Off RH
the complete source remains signed and supplies no positive zero-Gram
comparison.

For a multiple lowest eigenspace `E`, put `P=P_E`, let `Pi` be the low-shell
projector, and define `p=Pi*kappa`, `Y_M=||Pp||` and
`T=tr(P_LP)`.  The coordinate shells `w_j=P*e_j^+` obey exact low-overlap
sums, and the minimum low projective error is controlled by

\[
 \min_{c_j\ne0}{n_j\over|c_j|^2}\leq {T\over Y_M^2}.
\]

Thus `T=O(Y_M^2/lambda)` is a sufficient averaged residual target, but it
is not proved.  Full visibility `||P*kappa||>0` need not imply `Y_M>0`, and
the simultaneous selector retains both a quantitative tail margin and a
`sqrt(N+1)` normalization loss.  At the natural adjacent cutoff,

\[
 T\geq\max\{0,d-2\},
\]

so the trace sufficient route is eventually limited to `d<=2`, while an
exact counterfamily shows the trace condition is not necessary.

The focused pair passes `22/22`, and the exact seven-module deduplicated
target/direct-dependency closure passes `78/78`.  Projected canonical/raw
discovery contains `4121/4179` tests in `376/381` modules; the unchanged
five exclusions contribute `58`.  The 234-module frontier contains `2599`
tests, and the 246-module replay inventory contains `2727`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.61 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.61 admits two internal theorem/barrier results. First, on every odd-halfgrid-roundable schedule with `L^2=o(R)` and `R=o(lambda*L)`, the frozen actual source-normalized prolate estimates give projection error, `|q_R|`, and undifferentiated residual `O(exp(-cR/L))` without RH. This is the strongest exponent class furnished by the frozen estimates, not a lower bound for the true error. Under RH only, Lambert inversion and a kappa-deflated two-dimensional endpoint-flat residue family give the general coframe upper exponent `c(theta,rho)=4(1-theta)log(theta/rho)`, its optimizer, and the schedule-uniform upper obstruction `a_R<=exp(-(0.408756547856...-o(1))R)`. Thus a centered gate would require `q_R` below that scale, whereas the proved scalar estimate is only a one-sided `exp(-cR/L)` upper class. Neither changing the lower bridge projection nor moving within the halfgrid-roundable schedule range removes the factor-`L` mismatch; the formal near-quadratic balancing scale violates `R=o(lambda*L)`. This proves neither an actual centered gate nor gate failure, and off RH the positive zero Gram is unavailable. Second, the axis-rooted vectors in a multiple lowest eigenspace, with zero adjoined, form a closed cone, and every source-Cauchy-preserving limit of selected simple lowest lines lies in that cone. Legal positive rank-one selectors are restricted to coordinate shells and the rational Cauchy-kernel curve. An exact synthetic `y^2+1` counterfamily shows that `P*kappa` need not be selectable even when `P*eta=0`; it is not the actual arithmetic source. Nevertheless every nonzero coordinate projection `P*e_j^+` is axis-rooted, and `P*kappa!=0` guarantees qualitative existence of a coordinate-selected line with nonzero anchor overlap. Exact full- and low-overlap shell identities, the low projective formula, simultaneous selector bounds, and tail transfer isolate the sufficient quantitative minimum-shell rate, its required tail margin, and its universal `sqrt(N+1)` normalization loss. Full visibility and a small trace alone do not supply that rate. At the natural adjacent cutoff the trace obeys `T>=max(0,d-2)`, so the trace-rate sufficient condition handles at most a double bottom space eventually, although the trace condition is not necessary. Actual-source low visibility, quantitative minimum-shell selection, finite-good-set nonemptiness, projective convergence, determinant convergence, and every unconditional zero claim remain open. No RH proof, converse, or de Bruijn--Newman bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.62 collar-coefficient and direct-projector residuals

For the strict projected anchor at `M=ceil(lambda)`, the raw numerator
coefficients are triangular convolutions of endpoint moments, and those
moments obey the squared-lattice recurrence.  After the shifted Routh
transform, the empty-collar residual is exactly the one-sided equality

\[
 \nu(0+)=\nu(\delta-),
\]

with epsilon-Routh or signed-subresultant continuation through zero Hurwitz
minors.  This replaces the root-location question by a coefficient-sign
question but does not solve it.  The strongest direct Rouche residual is
the relative lower bound

\[
 {\sum_{n=1}^M n^{2k+1}|x_n|\over|m_k|}=o(L),
\]

where `m_k` is the first nonzero endpoint moment.  The admitted Gevrey
bounds are one-sided upper estimates for `m_k` and cannot prove this ratio.
The checkerboard flat-jet and high-shell families show that absolute compact
control and endpoint upper bounds do not provide the missing oriented
Routh-minor margin.  They are not the actual source.

For a simple visible actual even bottom projector `P`, the direct
normalization removes the centered and lower-Ritz occurrence residuals:

\[
 \mathcal A\leq\rho^{-1}-1,
 \qquad \rho=\langle\kappa,P\kappa\rangle.
\]

Equivalently, with `J=adj(mu*I-A)`, the remaining simple-branch obligation
is

\[
 \langle\kappa,J\kappa\rangle\ne0,
 \qquad
 {\|P_{\mathcal L}J\kappa\|^2
  \over|\langle\kappa,J\kappa\rangle|^2}
 =O(\lambda^{-1}).
\]

For a multiple bottom, the denominator-safe replacement is the minimum over
visible coordinate columns of the corresponding cofactor ratio.  Legal
coordinate selection proves qualitative existence only.  Fixed-dimension
analyticity, rank-one prime-threshold jumps, Perron sign arguments, and the
trace bound do not prove a halfgrid rate.  The actual-anchor diagonal
source-Cauchy countermodel makes the observable grow like `L`, but is not
the actual prime source.

The focused pair passes `23/23`, and the exact 10-module deduplicated
target/direct-dependency closure passes `103/103`.  Projected canonical/raw
discovery contains `4144/4202` tests in `378/383` modules; the unchanged
five exclusions contribute `58`.  The 236-module frontier contains `2622`
tests, and the 248-module replay inventory contains `2750`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.62 frontier, replay set, and complete canonical suite
were not rerun.  Two later checkpoint-1.63 candidate modules contribute 22
tests to the live worktree but are unadmitted and outside these projected
checkpoint-1.62 inventories.

Checkpoint 1.62 admits two internal theorem/barrier results. First, at the strict direct cutoff `M=ceil(lambda)`, the projected-anchor secular numerator has exact barycentric, endpoint-moment, and lattice-recurrence formulas, while a shifted Routh polynomial gives a necessary-and-sufficient empty-collar criterion through one-sided Hurwitz sign variations, with epsilon-Routh or signed-subresultant treatment at zero pivots. Direct Rouche closure requires a relative lower bound for the first nonzero endpoint moment; the frozen Gevrey bounds are upper bounds in the opposite direction. Exact checkerboard flat-jet and high-shell perturbations show that imaginary-axis positivity, every fixed coefficient prefix, endpoint upper bounds, and absolute compact control do not supply a uniform Routh-minor margin. These families are structural and are not the actual source; the strongest actual theorem remains the fixed-horizontal verified-height strip, not a cofinal shrinking collar. Second, on a simple visible even bottom, `A<=rho^(-1)-1`, so `rho=1-O(lambda^(-1))` is sufficient without the centered or lower-Ritz gates, and the same observable is the globally safe `J*kappa` adjugate/Gram ratio. At a multiple bottom, legal coordinate-shell cofactor selection is qualitatively visible and the quantitative obligation is a minimum of coordinate ratios. Analytic genericity, rank-one threshold jumps, Perron arguments, and trace averaging do not prove that rate. An actual-anchor diagonal source-Cauchy family has a simple visible axis-rooted ground while `A=L/K_infinity^2+o(L)`; it is synthetic, not the actual prime source. The actual one-sided Routh determinant margin, actual finite-good/cofinal simple index, denominator reserve, and `O(lambda^(-1))` relative cofactor orientation remain unproved. No determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound follows. The formal state remains `P0_INVALIDATED`.

## Checkpoint 1.63 Jensen inverse-shift and cutoff-free spectral residuals

The pinned Jensen wedge is an extreme derivative regime: `d/n->0`.  Its
nondegenerate origin diagonal has exponential rather than xi limit, while
the centered diagonal has no nonzero locally uniform entire limit.  Exact
reconstruction of the unshifted polynomial from the shifted one requires
the missing degree-`n-1` coefficient prefix.  The surviving exact bridge is
the coefficient map

\[
 \mathcal M_{d,n}[J^{d,n}]=J^{d,0},
 \qquad
 m_j^{(n)}={\gamma(j)\over\gamma(n+j)},
\]

but no hyperbolicity-preserving multiplier theorem for this map is proved.
General reverse integration fails, so the residual is an xi-specific
reverse-interlacing or inverse-shift multiplier theorem strong enough to
reach `n=0`.

For the cutoff-free prolate anchor, graph-norm transfer proves

\[
 q_{\lambda_p,\infty}\longrightarrow0,
 \qquad r_{\lambda_p,\infty}\longrightarrow0,
 \qquad
 |\mu_\lambda-q_{\lambda,\infty}|\sqrt{\rho_\lambda}
 \leq r_{\lambda,\infty}.
\]

Nonvanishing complete-ground overlap would therefore force RH, while RH
false forces the halfgrid overlap to zero.  The missing premise is the
actual full-ground overlap or, on a simple branch, the isolation estimate

\[
 \Delta_\lambda\geq c\sqrt\lambda\,r_{\lambda,\infty},
\]

together with identification of the isolated line as the full ground.  A
bound for the even bottom alone does not supply parity ordering.  Domain
exhaustion and the high-Fourier logarithmic diagonal do not prove this
near-radical complement bound or a norm-resolvent oscillator limit.

The focused pair passes `22/22`, and the exact seven-module deduplicated
target/direct-dependency closure passes `81/81`.  Projected canonical/raw
discovery contains `4166/4224` tests in `380/385` modules; the unchanged
five exclusions contribute `58`.  The 238-module frontier contains `2644`
tests, and the 250-module replay inventory contains `2772`, including the
unchanged 12-module, 128-test support block.  The expanded checkpoint-1.20
through checkpoint-1.63 frontier, replay set, and complete canonical suite
were not rerun.

Checkpoint 1.63 admits two theorem/barrier results. First, conditional on the precisely pinned external arXiv v1 hyperbolicity-wedge theorem and asymptotics, the classical unshifted Jensen normalization tends to E, and to Xi after w=-t^2, whereas every joint wedge sequence has d/n->0. At the only nondegenerate origin scale the diagonal limit is exp(w), hence exp(-t^2), and at the paper's centered scale a positive proportion of zeros in compact intervals excludes every nonzero locally uniform entire limit. The shifted polynomial is an almost-total derivative whose exact inverse requires an uncontrolled degree-(n-1) prefix; general reverse integration fails, and the coefficientwise inverse shift is a new RH-strength multiplier/interlacing theorem, not an admitted consequence. The external preprint is unvendored and not independently certified; no local GUE, unshifted Jensen hyperbolicity, inverse-shift preservation, zero theorem, converse, or de Bruijn--Newman bound follows. Second, the complete cutoff-free prolate anchor lies in the operator domain, its locked halfgrid scalar tends to zero at the stated positive d4L scale and its residual tends to zero, and the full-bottom projector satisfies |mu-q|sqrt(rho)<=r. Thus limsup rho>0 along the halfgrid forces the full monotone ground to zero and hence RH by pinned CCM Corollary 3.8, while RH false forces rho->0. This is a dichotomy, not a proof of its nonvanishing premise. The lambda-family is domain exhaustion of the global translation-invariant Weil form, not a rank-one or norm-resolvent oscillator limit; an even-block overlap alone lacks parity ordering. The actual full-ground overlap lower bound, simplicity/parity ordering, and required spectral isolation/complement bound remain unproved. No determinant convergence, unconditional zero-location theorem, RH proof or converse follows. The formal state remains P0_INVALIDATED.

## Checkpoint 1.64 multi-anchor, centered-PNT, and weighted-coframe residuals

For a finite anchor family, bottom projection gives exactly

\[
 \sum_j|\mu-q_j|^2\rho_j
 =\sum_j\|P e_j\|^2
 \leq\sum_jr_j^2,
\]

hence the multiplicity-safe bound with `q_*`.  The locked label-4 estimate
sharpens the individual residual to

\[
 r_{\lambda,\infty}
 \leq C\lambda^8L\exp(-2\pi\lambda^2).
\]

The family ratio in the checkpoint note is therefore a sufficient
conditional route to the full monotone ground, not a proved actual-source
lower bound.

The phase-volume pair removes the continuous PNT density before taking an
absolute value.  Its one-way split is

\[
 \Phi_\lambda(U,g)
 \leq\mathfrak M_{\lambda,\alpha}(C)
       +\mathfrak R_{\lambda,\alpha}.
\]

The explicit main term and the low-time absolute envelope are
`o(lambda^2/log lambda)`.  The unresolved term is the high-time positive
mass of the centered Chebyshev-error Mellin transform; the FKS pointwise
bound and admitted moment methods do not control it at the required scale.

For the weighted radical synthesis, the minimum-defect inverse proves

\[
 |\mu_\lambda|
 \leq {\mathcal C_F\over\sqrt{\Lambda_F}},
 \qquad
 \Lambda_{F_m}\geq{\gamma_m\over8\lambda^4d_m}.
\]

The finite compressed residual constant is polynomial.  Its cutoff-free
family graph transfer is not frozen, and the leading principal-angle rate
is not proved.  Thus the exact sufficient stopping condition remains an
open actual-source obligation rather than a residual closure.

The three focused modules pass `34/34`; the exact eleven-module direct
closure passes `142/142`.  Projected canonical/raw discovery is
`383/4200` and `388/4258`; frontier/replay is `241/2678` and `253/2806`;
support remains `12/128` and exclusions remain `5/58`.  The expanded suites
were not rerun.

Checkpoint 1.64 admits three theorem/barrier results. First, every finite family of cutoff-free domain anchors with real targets satisfies the multiplicity- and parity-safe full-bottom inequality (|mu|-q_*)_+^2 sum_j rho_j<=sum_j r_j^2, while a bottom frame P K K^* P>=c_lambda P gives (|mu|-q_*)_+<=||E||/sqrt(c_lambda). The locked label-4 anchor has r_(lambda,infinity)<=C lambda^8 L exp(-2 pi lambda^2), so q_*->0 and (sum_j r_j^2)/(sum_j rho_j)->0 imply RH through the pinned monotone CCM route. This is conditional and proves no actual correlation. Rank-one load derivatives, the bottom resolvent residue, paired translates, and the translation average identify exact formulations, but no uniform frame rate follows; current phase-volume/coercivity bounds, the separate compressed-trace schedule, the Shannon scale, full-source coframes, the source-Cauchy countermodel, and finite threshold jumps do not close capture. Second, the exact split D_lambda=M_lambda+R_lambda removes the continuous PNT density before absolute values and gives a one-way phase-volume bound by an explicit polynomial main term plus a centered remainder statistic. On both bounded-gap and logarithmic retained schedules the main and low-time terms are o(lambda^2/log lambda), reducing the missing input to the high-time positive mass of the centered Chebyshev-error Mellin transform. The pinned FKS bound controls only a much shorter harmless window, and admitted mean-square or higher-moment methods do not prove the required remainder bound or any converse. Third, the weighted coframe Lambda_F=lambda_min^+(T_F Delta_F^dagger T_F^*) and residual constant C_F give |mu_lambda|<=C_F/sqrt(Lambda_F) by the exact minimum-defect right inverse, with no source-dimension loss. For a hard leading prefix, Lambda_F>=gamma_m/(8 lambda^4 d_m), so 8 C_F^2 lambda^4 d_m/gamma_m->0 implies RH conditionally; KRD reduces polynomial residual and capture losses to a prefix O((log lambda)^2) below the Shannon edge. The finite-section residual is polynomial, but the uniform cutoff-free graph transfer and actual normalized capture are unproved, and an exact orientation family shows that the full row floor and defect spectrum alone do not control them. The actual multi-anchor correlation/frame, centered high-time remainder bound, polynomial phase volume, dangerous-projector capture, weighted radical coframe rate, uniform graph transfer, parity order, determinant convergence, unconditional zero theorem, RH proof or converse, and de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.65 uniform graph, mixed residual, and bridge innovation

The phase-separated residual obligation from checkpoint 1.64 is now closed:

\[
 \sup_{m\leq4\lambda^2-1}
 {\|Q_\lambda\mathcal K_mf
 -P_NQ_\lambda P_N\mathcal K_mf\|\over D_m(f)^{1/2}}
 \leq\operatorname {poly}(\lambda,L)e^{-M_{2400}\lambda^2},
\]

and `C_(F_m)=poly(lambda,L)`.  The ground-adjoint identity instead gives

\[
 |\mu_\lambda|^2\|P_{F_m}A_{\lambda,0}^*g\|^2
 \leq\mathcal C_{F_m}^2d_m,
\]

which is an upper evacuation estimate and cannot replace the missing
capture floor.

The proposed centered high-time upper residual target is not merely
unproved near `alpha=1`.  For fixed
`1-1/(8 sqrt(2))<alpha<1`, the fourth-moment argument gives

\[
 \mathfrak R_{\lambda,\alpha},
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^4\log(\lambda^2).
\]

This disproves the target `O(lambda^2/log(lambda^2))` in that range, but
the checkpoint-1.64 phase-volume comparison is only an upper bound and
does not transfer this result into a phase-volume lower bound.

For the dense ordinary mixed prefix, the cutoff-free graph tail remains
exponentially small, while the bridge forces

\[
 \mathcal C^{\rm mod}_{\mathfrak F_M}
 \geq c\lambda^{-9/2}e^{2\pi\lambda^2}.
\]

The bump-aware two-row metric makes the scalar normalized-angle ratio
bounded away from zero even at `gamma_M=1`.  Its exact remaining condition
is therefore the weighted ratio

\[
 { (\mathcal C^{\rm aug}_{\mathfrak F_M})^2
   \over\Lambda_M^{\rm aug}}\longrightarrow0,
\]

which is not proved.

Finally, defect-orthogonalizing the bridge gives the exact bottom update

\[
 S_M=S_F+s_b^{-1}w_bw_b^*,
 \qquad
 \theta_b=1-s_b^{-1}w_b^*S_M^{-1}w_b
 ={\det S_F\over\det S_M}.
\]

Thus `theta_b>0` exactly characterizes finite-dimensional bridge
elimination, while `||w_b|| ||ell_bB_M||<1` yields a quantitative bulk
right inverse.  If the phase-bulk nullity is one, the sole new bridge
orientation is the corrected adjoint coefficient; nullity at least two
cannot be repaired by one bridge.  Neither the ground equation, parity,
the coherent beta diagonal, nor the remote coercivity theorem bounds that
actual scalar below.

The five focused modules pass `61/61`, and with `PYTHONPATH=src` the exact
19-module closure passes `254/254` under `python3 -B`.  Projected
canonical/raw discovery is `388/4261` and `393/4319`; frontier/replay is
`246/2739` and `258/2867`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.65 admits five theorem/barrier results. First, the phase-separated cutoff-free graph tail is uniformly exponentially small before the Shannon edge and the exact residual constant is polynomial, but the normalized bottom-capture lower bound remains unproved. Second, the exact full-source adjoint and rank-one zero-integral coefficient Gram give only an upper ground-evacuation estimate, while an exact-arithmetic-map coercive-well countermodel excludes capture from the frozen orientation-free inputs. Third, for every fixed alpha with 1-1/(8 sqrt(2))<alpha<1, the full and high-time centered remainder statistics are Omega(lambda^4 log(lambda^2)), so the proposed O(lambda^2/log(lambda^2)) sufficient upper target is false there; the one-way phase-volume split gives no phase-volume lower bound. Fourth, the dense mixed source is genuinely dense and has an exponentially small graph tail, but its bridge makes the modal-defect residual exponentially large, and the bump-aware scalar normalized-angle route cannot vanish even at perfect capture; only the exact augmented weighted stopping line remains. Fifth, the augmented bottom Gram is the phase-bulk Gram plus one rank-one bridge innovation, with exact determinant-ratio and kappa elimination criteria and a codimension-one corrected-adjoint scalar, but no actual leverage lower bound is proved. The actual normalized capture, augmented weighted decay, bridge leverage, centered phase-volume lower bound, parity ordering, determinant convergence, unconditional zero theorem, RH proof or converse, and de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.66 half-alpha centered-remainder obstruction

The centered-remainder upper-bound route now fails throughout every fixed
`alpha>1/2`.  On `I_x=[Ax^2,2Ax^2]`, four-phase polarization between the
disjoint prime and semiprime supports proves

\[
 \mathbb E_x(P_x^2\overline {P_x})=O_A(L^2),
 \qquad
 \mathbb E_xY_x^3=o(L^3).
\]

The frozen second and fourth moments then put `Z_x=Y_x/sigma_x` under the
compact moment lemma

\[
 \mathbb EZ_x\to0,\qquad \mathbb EZ_x^2=1,\qquad
 \mathbb EZ_x^3\to0,\qquad \sup_x\mathbb EZ_x^4<\infty
 \Longrightarrow
 \liminf_x\mathbb E(Z_x-c)_+>0
\]

for every fixed `0<c<1`.  Since the normalized split threshold tends to
`2(1-alpha)`, this yields

\[
 \mathfrak R_{\lambda,\alpha},\quad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha}\lambda^4\log(\lambda^2)
 \qquad(1/2<\alpha<1).
\]

The symmetric `+/-1` endpoint model prevents the same moment data from
crossing `alpha=1/2`.  More importantly, the frozen residual decomposition
still has only the one-way form

\[
 \Phi_\lambda(U,g)
 \leq\mathfrak M_{\lambda,\alpha}(C)
      +\mathfrak R_{\lambda,\alpha}.
\]

Thus a lower bound for the centered remainder cannot be reversed into a
lower bound for the actual phase volume.

The focused module passes `14/14`, and the exact three-module closure passes
`37/37` under `PYTHONPATH=src python3 -B`.  Projected canonical/raw
discovery is `389/4275` and `394/4333`; frontier/replay is `247/2753` and
`259/2881`; support remains `12/128` and exclusions remain `5/58`.
Expanded suites were not rerun.

Checkpoint 1.66 proves, by prime/semiprime support disjointness and four-phase Montgomery--Vaughan polarization, that the normalized prime third moment vanishes. Together with the frozen second- and fourth-moment estimates, a compact moment lemma forces positive excess above every fixed normalized level c<1. Therefore, for every fixed A>0 and 1/2<alpha<1, both the full and high-time centered-remainder statistics are Omega_(A,alpha)(lambda^4 log(lambda^2)), so the proposed O(lambda^2/log(lambda^2)) sufficient upper target is false throughout that range. The symmetric two-point endpoint model shows that the stated moment data do not cross alpha=1/2; nothing is proved for 0<alpha<=1/2. The frozen phase-volume comparison is one-way, so no actual phase-volume lower bound follows. Polynomial phase volume, parity ordering, determinant convergence, an unconditional zero theorem, RH proof or converse, and a de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.67 bridge prefactor and mixed-adjoint-tail residual

On a unit codimension-one phase-bulk missed line, the exact bridge
orientation is now

\[
 a_b^2={\varrho_b\over s_b}\|P_MA_{\lambda,0}^*e_0\|^2,
 \qquad
 {\varrho_b\over s_b}\gg{1\over\lambda d_2}.
\]

The bridge quotient has an explicit defect-orthogonal representative with
ordinary norm bounded independently of prefix dimension.  Thus neither its
ordinary-source size nor the exterior-defect normalization is the remaining
residual obstruction.

Put `E=E_+ direct-sum E_-`.  The combined-phase tail parameter obeys the
exact threshold identity

\[
 \Theta_{\rm mix}(e_0)
 ={1-\mathfrak q_E(e_0)\over1-\delta_E},
 \qquad
 \Theta_{\rm mix}(e_0)<1
 \Longleftrightarrow
 \mathfrak q_E(e_0)>\delta_E.
\]

A strict reserve `Theta_mix<=1-eta` gives

\[
 a_b^2\gtrsim{\eta e^{4\pi\lambda^2}\over\lambda^{10}},
 \qquad
 \omega_b\gtrsim{\eta\over\lambda^7},
\]

and a codimension-one phase-bulk gap `alpha` then yields

\[
 S_M\succeq{1\over2}\min\{a_b^2,\alpha\omega_b\}I_X.
\]

This isolates the residual to a polynomial strict reserve for one actual
mixed-adjoint tail, conditional on the separate codimension-one bulk
premise.  No frozen input proves either premise or even nonvanishing of the
actual missed-line scalar.  At an allowed near-Shannon prefix, the frozen
literal-adjoint diagonal-well construction satisfies
`mathfrak q_E<delta_E` and hence `Theta_mix>1`; this is a synthetic
orientation countermodel, not the actual Weil operator.  On the genuinely
singular branch `theta_b=0` and `kappa_b>=1`, so `kappa_b<1` cannot close
this residual.

The focused module passes `17/17`; the exact eight-module direct closure
passes `129/129`, and the optional high-Fourier-expanded check passes
`138/138`.  Projected canonical/raw discovery is `390/4292` and
`395/4350`; frontier/replay is `248/2770` and `260/2898`; support remains
`12/128` and exclusions remain `5/58`.  Expanded suites were not rerun.

Checkpoint 1.67 computes the exact ordinary-source bridge innovation and defect-orthogonal representative, proves a uniformly bounded representative norm and an exponentially favorable one-sided source/defect prefactor, and reduces codimension-one bridge repair to one scalar combined-phase adjoint-tail excess above the constant-tail threshold. A polynomial strict reserve together with a polynomial phase-bulk gap would give a polynomial augmented bottom floor. No frozen input proves the reserve, the codimension-one phase-bulk premise, or even nonvanishing of the actual missed-line scalar. The literal-adjoint diagonal-well model proves only structural nonimplication and is not the actual Weil operator or a counterexample to actual nonvanishing. Actual bridge leverage, bottom-projector capture, cutoff-free determinant convergence, an unconditional zero theorem, RH proof or converse, and a de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.68 long-block Hermite and multiplier-dangerous cross-angle residual

The centered-remainder branch now has a complete integer long-block
moment theorem.  On `I_(x,k)=[A x^k,2A x^k]`, the prime polynomial has
Gaussian moments through degree `2k`.  If `rho_k` is the largest zero of
`He_k`, the Hermite localizer gives the exact sufficient range

\[
 k(1-\alpha)<\rho_k
 \quad\Longrightarrow\quad
 \mathfrak R_{\lambda,\alpha},
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg_{A,\alpha,k}x^k\log x.
\]

The optimal integer member is `k=4`, so the residual upper target is
disproved for every fixed

\[
 \alpha>1-{\sqrt{3+\sqrt6}\over4}.
\]

This includes `alpha=1/2` and part of the range below it.  The residual is
not closed for the whole `alpha<=1/2` regime: the method proves nothing at
or below the displayed threshold.  On the original `x^2` block, moments
through degree four stop at normalized level one, and the frozen
Montgomery--Vaughan input does not control the fifth mixed moment.  The
comparison with phase volume is still one-way, so this larger remainder
does not give a phase-volume lower bound.

The multiplier-dangerous branch has the exact normalized residual

\[
 \mathfrak q_E(Y)
 =\lambda_{\min}\!\left(
 R_Y^{-1/2}P_YAP_EA^*P_YR_Y^{-1/2}\right),
 \qquad
 R_Y=P_YAA^*P_Y\big|_Y.
\]

The full-source floor makes `R_Y` invertible.  Rank gives the necessary
condition `dim Y<=dim E`; no frozen multiplicity theorem proves it for the
actual complete bottom space.  The actual multiplier comparison gives a
physical angle to `Pi_t`, but after projection to `E` the residual is

\[
 \Delta_E
 =s_{\min}\!\left(P_EA^*\Pi_tP_YR_Y^{-1/2}\right)
 -\left\|P_EA^*(I-\Pi_t)P_YR_Y^{-1/2}\right\|.
\]

Only

\[
 \mathfrak q_E(Y)^{1/2}\geq[\Delta_E]_+
\]

is proved.  The exact one-line bridge residual remains

\[
 \mathfrak q_E(e_0)-\delta_E>0.
\]

No frozen estimate makes either residual positive.  The critical-edge
model forces zero capture while retaining the literal source map and the
prolate geometry, but changes the full arithmetic multiplier and is only a
structural nonimplication model.

The focused checkpoint modules pass `30/30`, and the exact ten-module
deduplicated target/direct closure passes `149/149`.  Projected
canonical/raw discovery is `392/4322` and `397/4380`; frontier/replay is
`250/2800` and `262/2928`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.68 proves Gaussian prime moments through degree 2k on translated x^k blocks and a Hermite-localized centered-remainder lower bound whenever k(1-alpha)<rho_k. The optimal integer member is k=4, giving Omega(lambda^8 log(lambda^2)) for every fixed alpha>1-sqrt(3+sqrt(6))/4, including alpha=1/2 and a nonempty range below; the method proves nothing at or below that threshold, and the phase-volume comparison remains one-way. Separately, it gives the exact normalized prolate capture Gram, multiplicity obstruction, actual multiplier physical-angle bound, and cross-angle stopping line. The synthetic critical-edge model proves structural nonimplication only and is not the actual full von-Mangoldt Weil symbol. No frozen input proves the actual source-prefix cross-angle, bottom-space dimension bound, missed-line bridge gate, or phase-bulk premise. Actual phase volume, bottom-projector capture, determinant convergence, an unconditional zero theorem, RH proof or converse, and a de Bruijn--Newman bound remain unproved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.69 fractional-moment and actual-adjoint regularity residual

On a real block `[A x^s,2A x^s]`, the frozen mean-value theorem controls
moments only through degree `floor(2s)`.  The missing next even moment makes
the usable macroscopic Hermite index `floor(s)`, so the checkpoint-1.68
`k=4` threshold remains optimal throughout the fixed-real-exponent
hierarchy.  On the half-integer odd shelf one still obtains

\[
 \mathfrak R_{\lambda,\alpha},\quad
 \mathfrak R^{\rm hi}_{\lambda,\alpha}
 \gg x^{s-r}L^{2r+1},
\]

but this is `o(x/L)` for every fixed `r+1/2<=s<r+1`.  The corresponding
escaping-mass measure proves that finite odd-moment, support, and elementary
tail information alone cannot remove this loss.

The first unresolved arithmetic input below the `k=4` threshold splits
into two genuinely different residuals.  The ninth mixed moment requires
the complete signed fixed-shift `5`-prime versus `4`-prime kernel.  The
tenth absolute moment requires a growing-shift `5`-prime versus `5`-prime
kernel.  The admitted estimate misses Gaussian normalization for the first
by more than `x^(1/2)/L^(9/2)` and misses uniform integrability for the
second by `x/L^5`.  A positive Jacobi/remote-atom construction proves that
even exact ninth-moment control would not replace the tenth-moment bound.

On the multiplier-dangerous branch, positive spectral subspaces of the
actual operator `T_v` have a certified compact frequency support and
Paley--Wiener regularity.  The literal adjoint does not preserve additive
smoothness: at every interior arithmetic breakpoint,

\[
 \Delta(A_{\lambda,0}^*y)(n/\lambda)
 ={\sqrt\lambda\over2n}y(-L/2).
\]

An explicit BV estimate and the exact prolate leakage identity reduce
capture to a finite defect-relative inequality.  Its certified constants
are quantitatively vacuous at the near-Shannon prefix.  More fundamentally,
the actual bottom vector also has a safe spectral component which can
cancel the regular dangerous component after `A^*`.  The residual is the
direct signed bottom Gram

\[
 P_YAP_EA^*P_Y\succeq\gamma_E P_YAA^*P_Y,
 \qquad \gamma_E>\delta_E,
\]

or an equivalent dangerous diagonal floor plus a gray-band and signed-cross
reserve.  The buffered commutator controls only separated off-diagonal
pieces and does not prove this floor.  Fixed-`lambda` compactness supplies
only a non-effective finite prefix.

The three focused modules pass `39/39`; the exact eight-module deduplicated
target/direct closure passes `113/113`.  Projected canonical/raw discovery
is `395/4361` and `400/4419`; frontier/replay is `253/2839` and `265/2967`;
support remains `12/128` and exclusions remain `5/58`.  Expanded suites
were not rerun.

Checkpoint 1.69 proves that a fixed real block exponent s controls Gaussian moments only through floor(2s), while macroscopic Hermite uniform integrability reduces the usable index to floor(s); the fractional odd shelf yields an explicit lower bound x^(s-r)L^(2r+1), but for fixed s<r+1 it is o(x/L), so the checkpoint-1.68 k=4 threshold remains optimal at the required scale. It identifies the first missing odd fixed-shift almost-prime correlation and the next even growing-shift top moment, quantifies the Montgomery--Vaughan deficits, and gives a positive Jacobi/remote-atom countermodel showing that odd-moment control alone cannot move the Hermite threshold without next-even-moment uniform integrability. Separately, it proves an actual-symbol support envelope and Paley--Wiener regularity theorem for positive dangerous spectral subspaces, exact arithmetic-adjoint breakpoint/endpoint-jet jumps, an explicit BV-to-prolate sufficient condition, a sharp buffered commutator bound, and fixed-lambda qualitative prefix capture. The available constants do not reach the near-Shannon prefix, and the safe component can cancel the regular dangerous component after the literal adjoint. No required-scale centered-remainder obstruction at or below the checkpoint-1.68 threshold, actual phase-volume lower bound, actual bottom Gram/cross-angle or bridge gate, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.70 endpoint-profile and actual phase-threshold residual

The literal arithmetic adjoint now has an exact all-order endpoint-jet
profile decomposition.  Its derivative jumps at every positive breakpoint
are one universal arithmetic profile per endpoint functional:

\[
 \Delta(A_{\lambda,0}^*y)^{(k)}(n/\lambda)
 ={\lambda^{k+1/2}\over2n^{k+1}}
 \prod_{\ell=0}^{k-1}(D-\ell-1/2)y(-L/2).
\]

The corresponding Taylor profiles have exact additive-prolate coefficient
and Gram matrices.  The actual dangerous range also obeys a sharpened
derivative bound and an explicit finite-jet observability estimate.  This
does not close the residual: the certified Taylor order may exceed the
`O(lambda^2)` near-Shannon row count, making the profile singular value
zero by rank, while the bottom-normalized map retains the signed Taylor
remainder and safe spectral component.  The required residual remains an
actual low-order, low-dimensional window with a quantitative profile
singular value and a safe-cross reserve.

For the next even centered-remainder moment, the top product shell contains
a positive off-diagonal core of order `x` over shifts of width `asymp x`.
Therefore local positivity is not a route to the desired polylogarithmic
uniform-integrability bound.  The exact residual is a complete signed
cancellation by the complementary kernel to additive accuracy
`O(L^(2r))`.  At `k=4`, this is the distinction between the positive
`Omega_A(x)` core and the desired tenth-moment scale `O_A(L^10)`.  No
admitted fixed-shift, divisor-switching, sieve, dispersion, or large-sieve
input supplies that global cancellation.

The actual phase-volume residual is also sharper.  For the full inclusive
prime-power polynomial one has the two-sided sandwich

\[
 \int[C-h-q+2\operatorname {Re}D_\lambda]_+
 \leq\Phi_\lambda(U,g)
 \leq\int[C-h+2\operatorname {Re}D_\lambda]_+,
 \qquad 0\leq q<4.
\]

On a block `[Ax^s,2Ax^s]`, the true normalized threshold is `s-kappa`
when `C/L` tends to `kappa`.  The macroscopic Hermite argument would give a
lower bound only under `s-kappa<rho_floor(s)`, which fails throughout the
standard `kappa<=1` schedule.  A fractional odd-shelf lower bound survives,
but it is `o(x/L)`.  Neither lower bound reverses the one-sided retained
negative-index comparison; a source-specific signed compression or
Feshbach lower bound remains missing.

The three focused modules pass `41/41`; the exact nine-module deduplicated
target/direct closure passes `121/121`.  Projected canonical/raw discovery
is `398/4402` and `403/4460`; frontier/replay is `256/2880` and `268/3008`;
support remains `12/128` and exclusions remain `5/58`.  Expanded suites
were not rerun.

Checkpoint 1.70 proves exact endpoint-jet jump profiles, finite-profile prolate coefficient/Gram formulas, sharpened dangerous derivative/trace bounds, and a finite-jet observability certificate, but the certified Taylor order can exceed the near-Shannon row count and the bottom-normalized Gram retains signed remainder/safe cancellation. It proves that the top-even growing near band contains a positive Omega(x) core and therefore any O(L^(2r)) top-moment bound requires global complementary cancellation; it does not prove that cancellation or the next-even UI bound. It also proves a two-sided full-prime-power phase-volume sandwich, identifies the true normalized threshold s-kappa, a conditional Hermite lower bound, and a sub-x/L odd-shelf lower bound; the standard kappa<=1 schedule misses the macroscopic Hermite condition, and phase-volume lower bounds do not reverse the one-sided negative-index inequality. No actual near-Shannon cross-angle/bridge gate, next-even top-moment UI, required-scale phase-volume obstruction or upper target, negative-index lower bound, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.71 one-direction capture and cyclicity-rate residual

For a finite radical synthesis define

\[
 B_F=\mathcal K_F(\Delta_F^\dagger)^{1/2},\qquad
 \mathcal C_F=\|Q_\lambda B_F\|,
\]

and let `P_lambda` be the complete projector onto the full bottom
eigenspace.  The exact projector identity gives

\[
 P_\lambda Q_\lambda B_F=\mu_\lambda P_\lambda B_F,
 \qquad
 |\mu_\lambda|\sqrt{\Lambda_F^{\max}}leq\mathcal C_F,
\]

where

\[
 \Lambda_F^{\max}=\|P_\lambda B_F\|^2.
\]

Thus the old all-bottom coframe residual was stronger than necessary.  It
is enough to prove one actual defect-weighted bottom direction with
`mathcal C_F^2/Lambda_F^max` tending to zero, or directly one vectorwise
residual-to-projected-norm ratio tending to zero.  This avoids bottom
simplicity, parity ordering, and surjectivity onto every bottom direction,
but it does not supply the missing direction.

For the actual physical source the residual is now the single supremum

\[
 \sup_{\substack{g\in\operatorname {Ran}P_\lambda\\\|g\|=1}}
 \| (\Delta_F^\dagger)^{1/2}P_FA_{\lambda,0}^*g\|^2
\]

relative to the already-proved polynomial graph residual.  On a
bulk-missed line the mixed bridge contributes exactly

\[
 {1\over s_b}
 \left|\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0)\right|^2.
\]

The odd-pole Birman--Schwinger identity controls overlap with the pole
vector, not this bridge contrast.  A positive pole-free two-dimensional
model with a simple pole-created negative ground saturates the pole bound
while its bridge contrast vanishes.  The actual resolvent-transformed
pole/bridge angle remains open.

High-Fourier coercivity gives a separate positive localization statement:
a bottom vector has fixed positive mass in a physical Fourier band of
dimension

\[
 D_\lambda=\exp\{O(\lambda\log\lambda)\}
           =\exp\{o(\lambda^2)\}.
\]

This band is still much larger than the `O(lambda^2)` prolate prefix.  In
the full-source metric the normalized adjoint is an isometry `J_X`, and
every prefix of dimension `m<dim X` has

\[
 \dim\ker(P_FJ_X)\geq\dim X-m.
\]

Consequently low physical mass and the full-source row floor do not choose
a captured prefix direction.  Qualitative source-Cauchy cyclicity gives
positive cofactor weights without a rate; analytic and parity-complete
structural models allow superquadratically small weight and saturation of
the residual-weighted inequality.  They are not the actual Weil source.
The remaining residual is an actual arithmetic orientation estimate at
`exp(-o(lambda^2))` scale, together with control of signed high/low
cancellation after prefix projection.

The two focused modules pass `20/20`; the exact ten-module deduplicated
target/direct closure passes `127/127` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `400/4422` and `405/4480`; frontier/replay is
`258/2900` and `270/3028`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.71 proves the exact full-bottom vectorwise, operator-norm, and Hilbert--Schmidt projector identities and replaces the all-bottom smallest-eigenvalue coframe demand by a strictly weaker largest defect-weighted one-direction capture criterion. It isolates the exact mixed-bridge contrast and proves that odd-pole Birman--Schwinger data do not force that contrast. Separately, it proves fixed positive ground mass inside an exp(O(lambda log lambda)) physical Fourier band, the normalized full-source isometry and prefix rank kernel, and structural cofactor, analytic source-Cauchy, and parity-complete models showing that qualitative cyclicity and analyticity provide no required capture rate. The structural models are not the actual Weil source. No actual lower bound for the largest weighted capture, actual bridge contrast, prolate-prefix overlap, exp(-o(lambda^2)) ground weight, or quantitative ground cofactor is proved. No parity order, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.72 pole-row cancellation, dangerous space, and filter residual

The actual raw mixed bridge now has an explicit positive pole row with

\[
 {\beta_\lambda\over\sqrt{M_\lambda}}
 =2^{-3/4}{\log\lambda\over\sqrt\lambda}\{1+o(1)\}.
\]

For the nonexceptional pole-created odd branch, its bottom overlap is
exactly

\[
 |\langle g_\mu,w_\lambda\rangle|^2
 ={\left|\beta_\lambda/\sqrt{M_\lambda}
 -\langle B_\mu^{-1}r_\lambda,w_\lambda^\perp\rangle\right|^2
 \over1+\|B_\mu^{-1}r_\lambda\|^2}.
\]

Hence the residual is no longer an unspecified abstract orientation.  It
is the source-specific transverse response
`<B_mu^(-1)r_lambda,w_lambda^perp>` together with the normalization
`1+||B_mu^(-1)r_lambda||^2`.  The required remaining estimates are

\[
 \left|{\beta_\lambda\over\sqrt{M_\lambda}}
 -\langle B_\mu^{-1}r_\lambda,w_\lambda^\perp\rangle\right|
 \geq e^{-o(\lambda^2)},
 \qquad
 \|B_\mu^{-1}r_\lambda\|\leq e^{o(\lambda^2)}.
\]

Neither follows from positivity of the limiting bridge: the actual
nonpole odd resolvent has no generic inverse-positive sign rule.

For a finite source-Cauchy block, centered Schatten control gives

\[
 \dim U_{q,\tau,G}
 \leq |E_{q,\tau,G}|
 +\left({2\pi\over\tau}\right)^p
  \sum_{n\in I}|b_n-c|^p,
\]

and `Q_I-qI` has floor `G` on `U_(q,tau,G)^perp`.  The coordinate
exception uses the same complete-diagonal shell threshold.  The admitted
Dirichlet moments do not make this dimension `O(lambda^2)`, and even such
a dimension bound would still leave the normalized source-angle estimate
open.

For every bounded commuting-filter family,

\[
 \Lambda_\Phi
 =\rho\|\boldsymbol\phi(\mu)\Delta^{-1/2}\|^2,
 \qquad
 \mathcal R_\Phi^2\geq|\mu-q|^2\Lambda_\Phi.
\]

The certified upper envelope cannot improve `r/sqrt(rho)`.  Literal
Krylov growth lacks the required higher graph estimates, while the
source-realizable low-Fourier family exchanges the missing capture for a
missing small residual.  Thus the one-direction stopping condition
`mathcal C_Phi^2/Lambda_Phi -> 0` remains unproved.

The three focused modules pass `29/29`; the exact ten-module deduplicated
target/direct closure passes `98/98` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `403/4451` and `408/4509`; frontier/replay is
`261/2929` and `273/3057`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.72 proves the actual fixed-label mixed-bridge pole-row asymptotic and eventual positivity, the strict positivity of the limiting odd bridge profile, and the exact pole-axis Feshbach overlap formula. It also proves that the literal nonpole odd resolvent has no generic inverse-positivity sign theorem. The eventual threshold is qualitative, and the actual transverse resolvent response may cancel the explicit subexponential pole row while the normalizer remains uncontrolled. Separately, it proves the centered all-p Schatten exceptional-rank bound and exact dangerous-space floor, including the same-shell coordinate threshold and exact fixed-s=2 half-scale; the admitted moment hierarchy cannot reduce the dangerous space to O(lambda^2), and dimension gives no source angle. Finally, it proves exact bottom-row and bottom-atom identities for bounded commuting filters, shows that the certified envelope cannot improve the anchor statistic, and constructs a source-realizable low-Fourier family with large unweighted capture but no small defect-relative residual. The random-phase paragraph and logarithmic source-Cauchy example are heuristic or structural only, not actual arithmetic or Weil conclusions. No actual transverse-cancellation lower bound, bottom-projector floor, O(lambda^2) dangerous-space bound, source-angle bound, filtered one-direction pass, parity order, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.73 transverse-energy and common-divisor residual

On the nonexceptional odd pole-created branch, let `kappa` be the floor of
the compression of `H_--mu` to the pole-transverse space.  The exact Schur
factor and nonzero-spectrum comparison give

\[
 \max\{a_1-\mu,\gamma\alpha^2\}\leq\kappa\leq\gamma,
 \qquad
 1+\|B_\mu^{-1}r\|^2=\alpha^{-2}=4M F'(\mu).
\]

For `x=beta_lambda/sqrt(M)` and
`E=<w_lambda,(Q_--mu)w_lambda>`, completing the transverse energy square
gives the denominator-free bound

\[
 |\langle g,w_\lambda\rangle|
 \geq\left[x-{1\over2}\sqrt{E\over\kappa}\right]_+,
 \qquad
 \langle g,w_\lambda\rangle=0\Longrightarrow E\geq4\kappa x^2.
\]

Because `4*kappa*x^2` is asymptotic to
`sqrt(2)*kappa*log^2(lambda)/lambda`, the direct estimate

\[
 E=o\!\left(\kappa{\log^2\lambda\over\lambda}\right)
\]

would close the bridge-overlap subproblem by itself.  A
subquadratic-exponential lower floor for `kappa` together with normalization
control addresses only the denominator and must still be paired with a
phase or anti-cancellation bound for the mixed numerator.  None of these
inputs is frozen.  The exact spectral dichotomy also shows that the direct
energy condition would itself force capture and cannot be inferred from a
fixed noncapture branch.

The overlap can equivalently be written through the mixed spectral measure:

\[
 F_\lambda(z)=\langle w_\lambda,(H_--zI)^{-1}p_\lambda\rangle,
 \qquad
 |\langle w_\lambda,g_\mu\rangle|^2
 ={ |F_\lambda(\mu)|^2\over m_\lambda'(\mu)}.
\]

The total mass encoded by the large-`z` asymptotic of `F_lambda` is the
positive pole row, but exact counterpairs show that it and both diagonal
spectral measures do not control the mixed phase.  For the literal source,
the unresolved scalar is exactly

\[
 F_\lambda(\mu)=
 \int_{1/\lambda}^{\lambda}b_\lambda(v){1\over\sqrt v}
 \sum_{1\leq n\leq\lambda v}
 {((H_--\mu I)^{-1}p_\lambda)(\log(v/n))\over\sqrt n}\,dv.
\]

A signed Green-row comparison, one-phase theorem, or controlled source
commutator for this generalized harmonic row is still missing.

Every admitted actual radical also carries the same analytic divisor:

\[
 \widehat{\mathcal E(f)}(z)=\Xi(z)A_f(z).
\]

The admitted source operations preserve this divisor.  Coordinate
multiplication breaks it only by leaving the actual source class and adds a
global Weil bulk functional to the finite residual.  On a finite window,

\[
 (p_a)_n=L^{-1/2}\Xi(\omega_n)A_a(\omega_n)+e_{a,n},
\]

so a subquadratic-exponential cofactor family with exponential tails still
requires a sampled `Xi` minimum-modulus theorem.  For the locked translated
anchor, complete-period translation loses the uniform exponential outer
scale, whereas a fixed boundary-safe range obeys

\[
 c_{N,S}(p)\leq
 \|p\|^2{(2\pi S/L)^{2N}\over\binom{2N}{N}}
 =\exp\{-\Theta(\lambda^2\log\log\lambda)\}
\]

when `N` is comparable to `lambda^2`.  Thus neither route supplies the
required one-direction residual-to-capture ratio.  A high-complexity
common-divisor family remains a logical possibility and needs new uniform
conditioning and leakage estimates.

The three focused modules pass `34/34`; the exact eleven-module
deduplicated target/direct closure passes `125/125` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `406/4485` and `411/4543`; frontier/replay is
`264/2963` and `276/3091`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.73 proves exact transverse-gap, normalization, bridge-energy, mixed-resolvent, actual-source-adjoint, Xi-ideal, finite-window, tail, and translation-frame reductions. The exact countermodels are structural and are not the actual Weil source. No actual transverse floor, individual odd bridge-energy estimate, mixed-resolvent phase lower bound, sampled Xi minimum-modulus estimate, controlled high-complexity common-divisor frame, bottom-projector floor, parity order, determinant convergence, unconditional zero theorem, RH proof or converse, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.

## Checkpoint 1.74 Floquet common-factor repair and residual-safe Pair C

For `L=2 log(lambda)` and `N=O(lambda^2)`, an unconditional shift
`theta in [1/(2L),3/(2L)]` simultaneously separates the paired Floquet
grids from every complex Xi zero.  The local minimum-modulus lemma gives

\[
 \min_{\substack{|n|\leq N\\ \varepsilon\in\{-1,1\}}}
 |\Xi((2\pi n+\varepsilon\theta)/L)|
 \geq \exp\left\{-{\pi^2N\over2L}-CL^2\right\}
 =\exp\{-o(\lambda^2)\}.
\]

The paired cosine/sine fold is parity stable and has normalized Gram
perturbation `O(L^(-1))`.  This repairs the common-Xi diagonal on the ideal
band without assuming RH or simple zeros.  It does not repair the actual
residual.  Complete-circle Floquet translation has an order-one finite-window
seam, while every residual-safe weighted true-translation orbit satisfies

\[
 c_N^\theta(p;\nu)
 \leq \|p\|^2{(2\pi S/L)^{2N}\over\binom{2N}{N}}
      +\nu\{|\tau|>S\}\,\|p\|^2.
\]

The unsafe mass must be exponentially small to retain a fixed Gaussian
residual, and the safe term is superquadratically small at quadratic `N`.

The surviving nontranslation route is exact.  For the invariant finite-prefix
band floor

\[
 c_{\theta,m}=\lambda_{\min}
 (W_{\theta,m}G_m^\dagger W_{\theta,m}^*),
\]

a literal dangerous-space embedding into that band yields

\[
 \gamma_m\geq{2c_{\theta,m}\over\lambda^2},
 \qquad
 {8\mathcal C_{F_m}^2\lambda^4d_m\over\gamma_m}
 \leq{4\mathcal C_{F_m}^2\lambda^6d_m\over c_{\theta,m}}.
\]

A bounded graph embedding adds only its squared graph-lift loss.  Thus Pair C
would close from a residual-safe actual finite prefix with
`c_(theta,m)=exp(-o(lambda^2))` and `d_m<=exp(-c lambda^2)`.  Algebraic full
rank of the ideal polynomial-Xi matrix is insufficient: the frozen inverse
majorant and moving-label Gevrey budget do not control quadratic inventory.
The full-source floor likewise leaves the finite-prefix principal angle open.
Divided differences or `zeta'/zeta` compensation either preserve the Xi
divisor by holomorphy or leave the actual-source class and incur bulk residual.

The following obligations remain open:

1. prove an `exp(-o(lambda^2))` actual finite transition-prefix floor on the
   selected paired Floquet band;
2. embed, or stably graph, the complete bottom dangerous space into that band
   with subquadratic-exponential condition loss;
3. combine that floor with a genuinely residual-safe defect and close the
   Pair-C stopping ratio;
4. prove any required bottom capture or parity-order input; and
5. finish determinant convergence and every unconditional zero consequence.

The focused module passes `14/14`; the exact six-module deduplicated
target/direct closure passes `92/92` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `407/4499` and `412/4557`; frontier/replay is
`265/2977` and `277/3105`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.74 proves an unconditional paired-Floquet sampled-Xi minimum-modulus bound of exp(-o(lambda^2)) on a quadratic mode band and exact parity Riesz conditioning. It also records the complete-circle seam and boundary-safe weighted-translation obstructions, the insufficiency of the frozen moving-label inverse majorant at quadratic inventory, and divisor/source-escape barriers. The sampled bound conditions only the common Xi factor. It does not prove an actual residual-safe finite transition-prefix floor, dangerous-space embedding, bottom-projector capture, Pair-C stopping condition, parity order, determinant convergence, an unconditional zero theorem, RH proof or converse, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.75 individual odd finite-part residual

The coherent beta diagonal hides an exact same-tail residual.  With the
paired-slot odd sign retained,

\[
 {\mathfrak b}_{\lambda,+}
 ={A_\lambda^2C_\xi\over8\lambda}
  +{A_\lambda^2\over8}{\cal S}_\lambda,
 \qquad
 {\mathfrak b}_{\lambda,-}
 ={A_\lambda^2C_\xi\over8\lambda}
  -{A_\lambda^2\over8}{\cal S}_\lambda.
\]

Their sum is the frozen coherent term
`A_lambda^2*C_xi/(4*lambda)`, while their difference is
`A_lambda^2*S_lambda/4`.  The latter is not a lower-order remainder that can
be discarded paritywise.  Indeed

\[
 G(a)=e^a{\cal S}_{e^a}
     =\sum_\rho{e^{(1-2\rho)a}\over\rho^2}
\]

is bounded on the continuous family, or on the complete all-odd natural
halfgrid, if and only if RH holds.  Multiplicity cannot cancel the Laplace
pole: at `sigma=1-2*rho` its residue is `m(rho)/rho^2`.  The all-odd mesh
transfer uses

\[
 |G(a+h)-G(a)|\leq Ce^ah\log^2(2/h)
\]

and `h=O(e^(-a))`, giving polynomial continuous growth from bounded samples.

This carrier obstruction does not identify the physical odd quadratic form.
The physical corrected row is `O_(b,modal)+O_bump`; its beta representative
has the same image only after applying the zero-evaluation map.  The missing
ordered common finite part must therefore be constructed before splitting
the pole, Archimedean, prime, beta-self, and cross distributions.  Until that
is done, the residual chain remains

1. paritywise ordered physical finite-part identification;
2. an individual physical odd `O(lambda^(-1))` self estimate;
3. the live lower-shift gate `mu>=-O(lambda^(-1))`; and
4. the transverse reserve `kappa*log^2(lambda)` with the required constant
   margin.

The focused module passes `12/12`; the exact six-module deduplicated
target/direct closure passes `73/73` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `408/4511` and `413/4569`; frontier/replay is
`266/2989` and `278/3117`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.75 proves the exact individual even/odd beta-carrier split and shows that the surviving same-tail zero sum is bounded at the lambda^(-1) carrier scale on either the continuous family or the complete all-odd natural halfgrid iff RH. This is an RH-equivalence barrier, not a proof that the bound holds. The identities are spectral carrier identities only. It does not prove the paritywise ordered physical finite-part identification, an individual physical odd self bound, live-shift control, the kappa log^2(lambda) reserve, bridge-energy relative smallness, bottom-projector capture, Pair-C closure, parity order, determinant convergence, any new zero theorem, RH, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.76 compact-side physical odd residual

Checkpoint 1.76 closes the compact-side transfer that checkpoint 1.75 left
open.  Symmetric normalized Fejer approximation first gives the compact
physical identity

\[
 q^{\rm phys}_{\lambda,-}
 =\mathcal W_Z(w_\lambda,w_\lambda).
\]

The corrected radical has zero evaluation in both paired slots, and the
physical corrected exterior row agrees with the beta representative only in
that zero-sampling space.  After the factor-`1/2` orbit realification, the
positive sequence norm controls both cross orientations without using a
sign of the Weil form.  On `lambda_p=p/2` for every sufficiently large odd
positive integer `p`, the frozen modal and endpoint-shear bounds therefore
give

\[
 q^{\rm phys}_{\lambda_p,-}
 ={A_{\lambda_p}^2C_\xi\over8\lambda_p}
  -{A_{\lambda_p}^2\over8}{\cal S}_{\lambda_p}
  +o(\lambda_p^{-1}).
\]

Hence the compact physical odd bound on the complete all-odd halfgrid is
equivalent to RH.  This closes an asymptotic compact transfer, not the
literal ordered noncompact finite part and not an unconditional physical
bound.  The surviving residual chain is now

1. establish the literal common ordered cancellation for the noncompact
   physical finite part, if that stronger identity is needed;
2. obtain an unconditional physical odd bound, which the RH equivalence
   itself does not supply;
3. control the live lower shift at least at
   `mu>=-O(lambda^(-1))` for a shifted-energy upper bound;
4. prove the quantitative `kappa*log^2(lambda)` reserve with the required
   constant margin; and
5. obtain bridge overlap, bottom capture, Pair-C closure, any needed parity
   order, determinant convergence, and every unconditional zero consequence.

The focused module passes `14/14`; the exact seven-module deduplicated
target/direct closure passes `80/80` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `409/4525` and `414/4583`; frontier/replay is
`267/3003` and `279/3131`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.76 proves on the complete all-odd natural halfgrid that the compact physical odd self equals the checkpoint-1.75 odd beta carrier plus o(lambda^(-1)), using compact-BV Fejer passage, orbit-realified paired-slot normalization, corrected-radical polarization, and positive absolute modal/cross sampling. Consequently the physical odd O(lambda^(-1)) bound on that complete halfgrid is equivalent to RH; this is not an unconditional bound and no continuous physical transfer is proved. It does not prove the literal noncompact ordered physical finite-part identity, live-shift control, the kappa log^2(lambda) reserve, shifted-energy smallness, bridge overlap, bottom-projector capture, Pair-C closure, parity order, determinant convergence, any new zero theorem, RH, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.77 continuous compact physical odd residual

Checkpoint 1.77 closes the continuous modal-sampling obligation left by
checkpoint 1.76.  For the only source labels needed by the bridge,
`n in {0,2,6}`, the all-real min--max estimate supplies

\[
 0\leq\mu_n(c)<3c^2
 \qquad(\lambda\geq2).
\]

The transition endpoint and outer estimates therefore hold on the full real
parameter family without a KRD index.  Applying the dyadic zero sampler to
each pure modal row and combining only afterward in the positive sequence
space gives

\[
 \|Zm_\lambda\|_{{\mathfrak Z},{\rm repo}}
 \leq {\cal P}(\lambda,\log\lambda)\sqrt {d_2}.
\]

The endpoint shear remains on the same modal defect scale.  With the beta
row uniformly bounded in that positive norm and with the checkpoint-1.76
gauge equality used only after `Z`, both modal--carrier cross orientations
are superpolynomially small.  Hence

\[
 q^{\rm phys}_{\lambda,-}
 ={\mathfrak b}_{\lambda,-}+o(\lambda^{-N})
 \quad\text{for every fixed }N>0
\]

for every sufficiently large real `lambda`.  The continuous compact
physical odd `O(lambda^(-1))` condition is therefore equivalent to RH.

The remaining residual chain is:

1. prove an unconditional compact physical odd `O(lambda^(-1))` bound;
2. establish the literal ordered noncompact physical finite-part identity,
   if that stronger representative is needed;
3. control the shifted energy and the live lower shift at least at
   `mu>=-O(lambda^(-1))`;
4. prove the quantitative `kappa*log^2(lambda)` reserve with its required
   constant margin; and
5. obtain bridge overlap, bottom capture, Pair-C closure, any needed parity
   order, determinant convergence, and every unconditional zero consequence.

The focused module passes `14/14`; the exact six-module deduplicated
target/direct closure passes `69/69` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `410/4539` and `415/4597`; frontier/replay is
`268/3017` and `280/3145`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.77 proves for every sufficiently large real lambda that the compact physical odd self equals the checkpoint-1.75 odd beta carrier plus o(lambda^(-N)) for every fixed N, by deriving all-real fixed-label modal sampling for n in {0,2,6} without the growing corrected-combination, KRD, or compact-projection steps and then using the checkpoint-1.76 gauge equality only after zero evaluation. Consequently the continuous compact physical odd O(lambda^(-1)) condition is equivalent to RH; this is not an unconditional bound. It does not prove the literal noncompact ordered physical finite-part identity, shifted-energy control, live-shift control, the kappa log^2(lambda) reserve, bridge overlap, bottom-projector capture, Pair-C closure, parity order, determinant convergence, any new zero theorem, RH, or a de Bruijn--Newman bound. The formal state remains P0_INVALIDATED.

## Checkpoint 1.78 odd energy capture residual

Checkpoint 1.78 closes the exact pointwise overlap and matching-metric
weighted-splice algebra.  It also exposes a new circularity barrier that is
specific to the actual nested operator.  On a fixed two-dimensional odd
compact common core, the pole constraint leaves a unit trial vector and
gives

\[
 \kappa_\lambda\leq C_V-\mu_-(\lambda),
 \qquad C_V<\infty\text{ independent of }\lambda.
\]

Writing `epsilon_lambda=E_lambda/kappa_lambda` then gives the exact squeeze

\[
 \mu_-(\lambda)(n_\lambda-\epsilon_\lambda)
 \geq q_\lambda-\epsilon_\lambda C_V.
\]

Thus the hoped-for relative energy estimate is not a harmless capture
input: together with the unconditional `q_lambda->0`, positive limiting
bridge norm, and odd nesting, it would force full-real odd positivity and
RH.  The abstract three-dimensional saturation family avoids this only by
letting every pole-orthogonal trial energy diverge, so it has no common-core
constant `C_V`.

The remaining residual chain is:

1. prove `E_lambda/kappa_lambda->0`, recognizing that it is already an
   RH-strength premise for the actual operator;
2. prove the weighted residual gate `C_M^2*d_b->0` in the same raw source
   metric, or its exact innovation analogue;
3. prove the odd/full-bottom parity identification if the standalone
   weighted route is retained;
4. prove any one-sided physical odd self estimate or any sectoral/global
   lower-shift or shifted-energy absolute estimate; and
5. establish the literal ordered noncompact physical finite part and every
   remaining unconditional spectral conclusion.

The focused module passes `15/15`; the exact five-module deduplicated
target/direct closure passes `60/60` under
`PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B`.  Projected
canonical/raw discovery is `411/4554` and `416/4612`; frontier/replay is
`269/3032` and `281/3160`; support remains `12/128` and exclusions remain
`5/58`.  Expanded suites were not rerun.

Checkpoint 1.78 proves an exact max overlap floor, the legal matching-metric raw/innovation weighted splice, and the common-core ceiling kappa_lambda <= C_V-mu_-(lambda). Consequently E_lambda/kappa_lambda -> 0 on the complete family or any cofinal schedule would force mu_-(lambda) -> 0, full-real q_lambda >= 0, and RH. The energy-ratio premise is not proved and is itself RH-strength. The one-sided physical odd self bounds and the sectoral/global lower-shift and shifted-energy o(1) statements are RH-equivalence barriers, not established estimates. No residual gate, odd/full-bottom parity identification, unconditional physical one-over-lambda bound, literal noncompact ordered finite part, transverse lower reserve, new zero theorem, RH, or de Bruijn--Newman bound is proved. The formal state remains P0_INVALIDATED.
