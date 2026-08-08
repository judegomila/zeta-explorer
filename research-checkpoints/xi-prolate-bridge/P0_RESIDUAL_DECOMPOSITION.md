# P0 residual decomposition

For any eventually implemented normalized projected prolate vector `kappa`,
the combined vector must be formed before norms:

`q=q_pole-q_arch-q_prime`,

`(Q-q)kappa = (P-q_pole I)kappa - (A-q_arch I)kappa
              - (R-q_prime I)kappa`.

The diagnostic serializes this combined vector and the three signed block
vectors, followed by their separate norms and the combined norm. No triangle
inequality is applied in the producer.

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
