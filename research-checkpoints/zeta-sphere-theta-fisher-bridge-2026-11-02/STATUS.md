# Research status

Last integrated: 2026-11-03 UTC.

## Bottom line

The Riemann hypothesis remains unproved. The present program now has rigorous
actual-target positivity through degree `30000000000` for every positive shift
at global spatial cutoff, with an explicit dependence on the published
Platt--Trudgian zero verification. A separate direct certificate covers degree
10 on an explicit positive-cutoff rectangle. It still does not have an
all-degree estimate that transfers the information-theoretic gain to the full
signed coupling cost.

## Established within the frozen evidence

- Let `H_cut` denote the lower spatial integration limit and `H_spec` a
  spectral-height window. At `H_cut=0`, every nonzero real polynomial `p` with
  `deg p <= 30000000000` has positive normalized bridge form for every `a>0`,
  with the continuous divided-by-`a` endpoint included. On `0 <= a <= 1/2`,
  the quantitative bound is

  `integral p(t)^2 Lambda_a(t) dt > [0.00172-exp(-2*10^11)] integral_[-4,4] p(t)^2 dt`.

  The complex extension is for `abs(p)^2`, not the bilinear `p^2`. The proof
  uses the published Platt--Trudgian theorem through exact height
  `3000175332800`, weakened to `3*10^12`, and sets
  `H_spec=2.9*10^12`. That external computation was checked as a published
  theorem but was not rerun; this is not a new zero verification.
- A separate direct certificate proves the even block on degrees
  `0,2,4,6,8,10` positive for
  `0 <= a <= 1/2, 0 <= H_cut <= 1/8`. Combined with the v32 odd block through
  degree 9, it gives full degree-at-most-10 positivity on that rectangle and,
  at `H_cut=0`, for every positive shift plus the normalized endpoint. Its
  monic even-10 Schur lower bound is `>8928867843900347`. The reported
  fixed-basis LDL bounds are Schur pivots, not Euclidean eigenvalue reserves.
  The corrected odd-11 calculation is inconclusive, not negative; an earlier
  six-channel adaptation that populated only five channels is invalid
  implementation history.
- The complete theta `H6` test is positive for every positive shift and at the
  normalized endpoint. On `0 <= a <= 1/2`, the newly replayed even `4 x 4`
  polynomial-basis Gram has reserve `I/60`; it combines with the previously
  reviewed odd `H5` block. The outer shifts use the standard zero-strip and
  paired canonical-product argument. This is finite-order, not all-order.
- The full `10 x 10` odd moment block with channels `1,3,...,19` is positive at
  normalized shift `a=0`. The proof uses the actual `H_cut=1/16` core/tail split
  and complete complement coupling. It is not the full `H19` hierarchy.
- Universal cumulative-tail positivity is false. At `H_cut=1`,
  `t=7005081715/1000000`, and `a=1/10000`, the normalized full-theta tail has a
  rigorously negative Fourier value. This does not contradict positivity of
  the complete kernel or RH.
- CP62 extends that negative tail to an explicit tiny positive-heat rectangle,
  proves simultaneous positivity of the complete kernel there, and shows exact
  signed core/tail compensation. A correction through finitely many fixed
  linear functionals cannot make the entire truncated tail nonnegative.
- Common- and matrix-anchor identities preserve all signed pieces and expose
  covariance/innovation gains. At the already certified finite order they
  repair the signed residual. They do not yet give a degree-uniform physical
  estimate.

## Reviewed information-relaxation results in v18

The v18 source freeze contains independently reviewed derivations of:

- a bridge Fisher-information bound `<= 2/17`;
- a regularized endpoint bound `<= 4/867`;
- orbit Fisher dissipation `I' <= -14 I`;
- heat smoothing preserves the relevant zero evolution while adding a
  removable Gaussian reserve;
- Newman forcing retains a signed contribution.

These statements are hash-bound under `evidence/v18-curated/`. They remain
metric-specific ingredients: none alone controls the growing high-jet
covariance, regression mismatch, inverse-block feedback, or signed derivative
forcing in the actual complete bridge metric.

## Finite paid mechanisms added in v19

- At the existing odd-19 endpoint, a 1000-cell interval evaluation gives
  innovation gain `> 0.000252203292259`, coefficient-motion cost
  `< 0.000091900511724`, and surplus `> 0.000160302780535`. It certifies the
  finite odd rungs `3,...,19` at normalized `a=0`; the target moments are
  inherited, and the nonzero-shift action probes remain numerical.
- At degree `2`, `a=1/4`, and `lambda in [0,1]`, the paid Newman certificate
  gives terminal reserve `> 3.6442681947430` and integrated paired cost
  `< 3.1520578244214` before the common `pi/2` factor. The physical Schur lower
  bound is `> 0.773162230542629`.
- Signed lower-block orthogonality gives an exact forcing identity, but its
  opposite-parity energy sign and the uniform higher-degree comparison remain
  unpaid.

These are mechanism validations at fixed finite order. They do not establish a
new all-order positivity theorem or prove RH.

## Consolidated continuation through v26

- At degree `5`, `a=1/4`, and `lambda in [0,1]`, a legal old-feature gauge
  with zero signed integral gives a certified Newman payment. Before the common
  `pi/2` factor, the terminal Schur value is `> 375589.1213813384`, the gauged
  budget is `< 322853.8114762700`, and the retained reserve is
  `> 52735.3099050647`. This is one fixed finite mechanism; the ungauged
  sufficient envelope failed numerically, not the target.
- In the odd same-parity degree-`9` channel at `a=1/4`, the endpoint old Grams
  are positive at `lambda=0,1` and the regional endpoint minimum retains
  `> 0.0031365403907762` after division by `10^16` and omission of `pi/2`.
  This is not mixed-parity `H9`, interior-path positivity, or a new all-shift
  hierarchy theorem.
- For every finite polynomial degree and raised spatial moment, an
  actual-theta theorem gives explicit superexponential confinement in the
  positive physical parent norm. It is not a signed Schur lower bound and does
  not pay inverse feedback or the modular defect.
- Exact block transport retains the signed local terms until their joint
  inverse feedback is assembled. Modular reflection then reduces one
  normalized endpoint route to exactly one negative direction, but does not
  pay it.
- An auxiliary positive-regression remainder satisfies `E'(a)>0` at every
  finite degree. The canonical actual next source further cancels the separate
  inverse-feedback estimate, leaving one correlated current-prefix inequality.
  That inequality is **unproved**. A conditional obstruction rules out proving
  it with a degree-independent mixed-metric spectral gap.

All floating scans and probes in the continuation remain numerical
diagnostics. These v20--v26 results predate and are logically separate from the
later degree-through-9 theorem.

## Scalar, trace, and arithmetic reductions through v30

- A separate interval certificate proves the even channels `0,2,4,6,8` on
  `0 <= a <= 1/2`, with polynomial-basis Gram reserve `I/100`; the standard
  outer-shift argument extends strict positivity, not that reserve. This older
  calculation alone did not supply odd channels `1,3,5,7`; the v32 theorem
  later supplies both parity blocks through degree 9 by a separate certificate.
- Exact boundary-square and regression-trace identities sign the boundary
  correction and the highest canonical regression coefficient. They do not
  sign `tr R`, the lower source components, or the general higher-degree
  signed quadratic.
  A smooth non-theta counterfamily shows that a positive finite prefix plus
  arbitrarily strong log-curvature cannot, by itself, force `tr R >= 0`.
- The complete-theta scalar resolvent `J(d)` is strictly positive, and the
  rational square completion, adaptive-resolvent inequality, and correlated
  conditional-mean formula are exact reviewed reductions. Scalar positivity
  is not higher rational-Gram positivity; the uniform adaptive payment remains
  unproved.
- Exact divisor grouping reduces the complete-theta correlated contact to
  arithmetic summands. For the even ladder, an explicit degree-only `O(N^2)`
  cutoff leaves a strictly positive infinite remainder. For the adjacent odd
  ladder the high-index remainder has the opposite sign, but its absolute size
  has an explicit exponentially decaying payment bound.
- These tail results leave a finite signed arithmetic core. No new pivot was
  computed in v29 or v30, and no uniform finite-core inequality was proved.
  The v29 low-degree calculations reuse previously certified pivots; the v30
  replays check elementary constants and envelopes rather than ladder signs.

The v27--v30 evidence is an append-only public derivative of the 968-payload
v30 source snapshot. It preserves all 839 v26 payloads. Its public lane has 84
unique authored payloads, four exact publication manifests, one repository
README, and six documented privacy-only text redactions; private or acquired
source captures are not committed.

## Theta-specific compensation and correction history in v31

- For the complete theta profile, put `k=(log psi)''`. For every real
  `alpha`, the normalized quadratic contact has the exact square form

  `h[t^2-alpha]/(4pi) = integral u^2 psi^2[(alpha+k/2)^2+(4k^2+k'')/8]`.

  A 4,000-cell interval certificate on the compact region, together with an
  analytic full-orbit tail, proves `4k^2+k''>1254` on the whole real line.
  Hence `h[t^2-alpha]>(1254/8)h[1]>0` for the entire quadratic family. This is
  a complete-theta payment at a known finite family, not an all-degree source
  inequality, shift-uniform hierarchy theorem, or new rung.
- At the already-known normalized odd degree-`7` rung, splitting at
  `|u|=1/8` gives a genuinely negative region-optimized core
  `-347755655 < s_C < -342212016`. The global-regression variation satisfies
  `V_C>520963072`, so the actual globally selected core contribution obeys
  `s_C+V_C>173207417`; the complete regional sum is `>6047289376`, in
  `h/(4pi)` units. The negative object is the separately optimized regional
  minimum, not the globally selected residual's core integral. This
  independently demonstrates signed compensation at a rung already contained
  in the normalized odd-19 theorem; it is not a degree extension, `H7`, or an
  all-shift result.
- An early even2 arithmetic implementation swapped the `p0` and `p2`
  regression coordinates. Its `12577.616055...` output is **invalid** for the
  actual target polynomial and is retained only as correction history. With
  the corrected order, an independent replay gives
  `h_even2/(4pi)>11757.11998533215587`, hence `h_even2>141084`. This reproduces
  a known finite contact from inherited old-moment enclosures; those inputs
  were not regenerated, and no next norm or new pivot reserve is used.
- Further v31 transform, eta, dyadic, and low-divisor identities sharpen the
  signed arithmetic diagnosis. In particular they rule out separate-sign
  shortcuts in actual low rungs, but do not prove the finite signed core or a
  uniform regional-payment law. Invalid, failed, and superseded diagnostics
  remain separately classified from the 137 reviewed v31 payloads.

The v31 public lane has 162 owned payloads, one exact publication manifest,
one repository README, and one documented privacy-only index redaction. It is
an append-only derivative of the 1,133-payload v31 snapshot, which preserves
all 968 v30 payloads. Private captures and acquired third-party material are
not committed.

## Degree-through-9 theorem and signed mechanisms in v32

- A direct 16-shift-slab interval certificate, with 4,000 spatial-tail cells,
  4,000 inward-cutoff cells, exact rational bases, derivative jets through
  order 20, and complete orbit and spatial tails, proves both actual `5 x 5`
  parity blocks positive on
  `0 <= a <= 1/2, 0 <= H_cut <= 1/8`. The compact monic Schur bounds are
  `>658509314218` for even degree 8 and `>82637820677424` for odd degree 9.
  The reported LDL pivots are basis-dependent pivots, not Euclidean eigenvalue
  reserves.
- At `H_cut=0` only, the paired-Hadamard/zero-strip formula gives a strictly
  positive spectral density for `a>=1/2`. Joined to the compact certificate,
  this proves actual degree-at-most-9 positivity for every `a>0`, plus the
  removable normalized endpoint. It does not extend the compact constants or
  positive-cutoff result to the outer strip.
- An exact inverse-residual replay gives a normalized odd-degree-7 Schur lower
  bound `>5028566847`, conditional on previously certified moment enclosures.
  This reproduces a known rung and demonstrates why an unweighted small
  residual is useless without inverse-metric conditioning.
- Exact regional and finite-width identities retain the signed source,
  regression variation, and inverse-adaptation terms. Fresh replays recover
  known even-6 and odd-7 gains, while nearby-shell and subdivision tests show
  why local monotonicity and refinement are not universal shortcuts.
- The modular Bessel/divisor transform is genuinely signed. A certified
  negative unweighted section at frequency 24 coexists with a positive full
  `a=1/4` transform; a separate normalized moment certificate is positive for
  `0<a<=1/2, |x|<=3`. These are finite cancellation results, not global
  Fourier positivity.
- The exact normalized-endpoint dyadic coefficient threshold is `107521`.
  Independent prime-power accumulation checks every integer through `2^21`
  with minimum integer margin `11`, exact inequalities show failure at
  `107520`, and an analytic argument covers the infinite remainder. The result
  applies only after a separate derivative-sign cutoff: even high terms pay
  their same-residual eta terms, while odd high terms remain negative.

The v32 public lane contains 405 classified owned payloads: 386 reviewed and
19 diagnostic or correction-history files. Its single index redaction removes
a private artifact locator; the source archive, duplicate prior manifests, and
all unlisted private or acquired material are not committed. Independent
replays do not constitute external peer review.

## Analytic finite-degree theorem and all-degree diagnostics in v33

- The degree-30-billion theorem combines four independently reviewed inputs.
  The reflected contribution of a zero pair at horizontal offsets `+/-d` is

  `2a[a^2+(t-gamma)^2-d^2] / ([(a-d)^2+(t-gamma)^2][(a+d)^2+(t-gamma)^2])`.

  Its negative halo has radius `<1/2`. Platt--Trudgian's published verified
  height therefore makes the full middle `[-H_spec,H_spec]` nonnegative. A
  fresh owned theta replay gives `Lambda_a>0.00172` on `[-4,4]`, the uniform
  tail satisfies
  `abs(Lambda_a(t))<=4100(1+abs(t))^8 exp(-pi abs(t)/4)`, and Legendre/Chebyshev
  polynomial bounds give a complement `<exp(-2*10^11)` through degree
  `3*10^10`. The final arithmetic exponent is
  `-230999999688<-2*10^11`. No giant Gram matrix, individual zero list,
  positive-prefix hypothesis, or inverse-selected polynomial is used.
- The quantitative theorem is only for normalized shifts `0<=a<=1/2`. The
  independently established outer-strip theorem supplies `a>=1/2` only at
  global `H_cut=0`. Nothing in v33 extends that argument to arbitrary positive
  spatial cutoffs. The result is finite degree, is not a novelty claim, and is
  neither all-degree positivity nor RH.
- Exact Hardy compression reduces all subset debits to the single actual-prefix
  translation norm `L_a[abs(p(t+ia)-p(t))^2]`; it does not pay that norm. A
  separate analytic theorem gives a degree-dependent band
  `a>=1/2-epsilon_n`, with `epsilon_n` asymptotic to `1/(6 log n)`, but no fixed
  inner shift is covered at all degrees.
- At a fixed interior shift, any actual negative interval of the continuous
  bridge density is detected by some finite even and odd polynomial. Thus an
  all-degree fixed-shift theorem must establish the complete pointwise density
  sign. This does **not** assert that actual theta has such a negative interval;
  the exponentially small-tail example is a non-theta obstruction to
  mass-only arguments.
- The normalized endpoint now has an exact all-degree polynomial flux, a
  nonlinear rank-one theta recurrence, and an attained selected-orthogonality
  dual with at most `N+1` atoms. These are exact reviewed representations, not
  sign theorems. Factorial coefficient growth is genuine, normalized central
  remainders have infinitely many signs in a larger real-rooted class, and no
  uniform positive remainder is known.
- At the actual degree-20 selected residual, the uncorrected canonical local
  factor is negative and every one-dimensional proportional gauge in the
  audited restricted family fails. The two-point scalar witness does not
  satisfy the full vector of cross-moment constraints, so it is not a negative
  optimized dual or a negative integrated pivot. Rigid supporting-plane
  transport also fails even in known-positive examples; adaptive
  reoptimization remains possible but has no critical-shift degree-uniform
  lower bound.

The v33 public continuation contains 205 reviewed-owned entries and 29 entries
classified as diagnostic or correction history. Uncertified probes, the
invalid six-channel implementation, private provenance, and acquired
third-party material are not theorem inputs. Internal independent replay
remains AI-assisted campaign review, not external peer review.
## Post-v31 frozen-residue closure

The isolated workstream
`workstreams/all-degree-analytic-search-next-v1/` now records the exact
frozen-residue metric and its limitation.

- On each parity prefix, `M_(0,N)=Q_N+v_N d_N^*+d_N v_N^*`. In physical
  space it is the signed square
  `(||2hF_p+Psi_(p')||^2-||Psi_(p')||^2)/2`; the negative leg has rank growing
  with the prefix. In Fourier space it is the original Xi--Laguerre multiplier
  plus a nonlocal rank-two boundary kernel, not a new scalar multiplier.
- Any uniform finite bound on `n_-(M_(0,N))` is equivalent to nonnegativity of
  the endpoint Xi--Laguerre density. In particular, the proposed all-prefix
  `n_-<=1` lemma is endpoint-equivalent, not an easier induction. A positive
  old target by itself gives only the sharp generic bound two.
- The exact real-theta old-prefix gate is `sqrt(VD)-C<=1`, equivalently
  `inf_(tau>0)||L_tau||_(A*)^2<=1` for one correlated combination of the
  half-line functional `v` and residue-drift trace `d`. The drift also has an
  exact undivided real-frequency gamma/digamma kernel and is a shifted
  first-theta-orbit trace. On the endpoint-positive branch, fixed-`tau`
  target-dual norms diverge while nested feasible prefix intervals would
  force one fixed `tau`; on the other branch, target negative inertia is
  unbounded. Thus all-prefix `M_0` positivity is false and some finite
  `M_(0,N)` prefix is not positive semidefinite in each parity, without
  locating the first failure.
- The surviving one-negative-direction extension has an exact singular
  bordered-inertia criterion. Once an old `M_0` prefix has index one, the next
  rung preserves it exactly when the indefinite-orthogonal theta residual has
  nonnegative `M_0` square, together with the Moore--Penrose range condition
  at a zero pivot. This is noncircular but all-prefix success remains
  endpoint-equivalent, not proved.
- The actual paid-twin Schur border now has the exact two-regression split
  `2S=A_X-B_Y-C_XY`, where all three terms are nonnegative and
  `C_XY=r^*(G_Y^dagger+Q^-1)r`. For a monic degree-`n` rung,
  `B_Y=n^2 h_(n-1)^(Y)`. Thus `A_X>=B_Y` is a necessary positive-channel
  comparison, while the still-open sufficient target pays the regression
  mismatch `C_XY` without separating residue and drift.
- The mismatch covector itself is exactly
  `r(q)=<Yq,YR_X>=-2 q(q,R_X)` and
  `r=G_Y(alpha_Y-alpha_X)=Q(alpha_X-alpha_A)`. In real frequency the
  `X`-regression residual obeys the undivided Galerkin equation for
  `L U=-(Xi^2 U')'+2(Xi'^2-Xi Xi'')U`. Substitution collapses the border to
  the actual signed Schur pivot, so generic `Q^-1` Cauchy is circular rather
  than an independent payment.
- The mismatch payment has the principal-angle form
  `C_XY=sum csc(theta_j)^2 |w_j|^2`. Exact smooth positive countermodels show
  that neither `A_X>=B_Y`, old strict contractivity, nor the formal graded
  commutators imply the border generically. For the real theta source the
  surviving target is directional: the same border is one confluent Turan
  minor, with a zero-safe primitive-curvature integral and the exact mismatch
  correction inside its residual polynomial.
- The undivided Galerkin operator has a global zero-safe square
  `L=B^*B`, including through arbitrary-multiplicity real Xi zeros. This is
  exactly the positive `X` normal equation, not a square of the signed target.
  The angle cost is equivalently `r^*(G_Y:Q)^dagger r`, so the live theorem is
  one bordered parallel-sum trace inequality for the combined mismatch
  vector.
- Full Hankel/Stieltjes positivity of the endpoint moments is equivalent to
  the missing Xi--Laguerre spectral sign. The actual odd-H5 Bell-fiber matrix
  is indefinite near the center, so pointwise fiber total positivity cannot
  prove it; integrated covariance repair is essential.
- Every isolated sufficiently high theta orbit already has
  `A_X-B_Y<0` at the first even extension, and every raw finite positive orbit
  packet has a negative algebraic Turan tail. Pairwise orbit positivity,
  finite-orbit limits, and blockwise regressions are therefore refuted routes.
  A viable proof must retain the modularly complete infinite sum and
  cross-orbit compensation.
- The interaction profile has an exact signed three-autocorrelation split and
  a tilted-norm curvature form, but positive-definite parents do not imply the
  required Loewner curvature. Positive local differential squares are
  obstructed by their order of vanishing at real Xi zeros. Finite verified
  zero bands remain insufficient for an all-degree polynomial ladder.
- After the exact normalization `Xi(nu)=8H(2nu)`, the all-prefix endpoint sign
  is Csordas' Open Problem 4.7 for the first Laguerre expression of the
  Riemann Xi function. This is a literature alignment, not a proof or an RH
  equivalence; first Laguerre positivity alone is only necessary in general.
- Finite residue-jet renormalizations cannot remove the high-frequency drift:
  every nonzero constant-coefficient jet combination remains target-dual
  divergent in both parities, and its target-space boundary functional is
  nonclosable. Separately, the endpoint Turan density is the Fourier transform
  of a strictly positive theta conditional-variance profile; the missing sign
  is exactly positive definiteness of that profile, not its pointwise
  positivity.
- A governed SHA-bound floating diagnostic found `M_0` positive on every
  archived odd prefix through degree 19. At degree 19 the target gate has left
  side `0.2752057211...` and margin `0.7247942789...`; the primary/replay
  matrices differ by about `3.09e-60`. All receipt and execution-audit checks
  passed. These are pre-asymptotic finite cutoff midpoint diagnostics, not new
  interval certificates or evidence for an all-degree/RH result.

## Fourth-wave correlated closure audit

- Exact modular quotients realize the old parallel metric as a global
  quotient norm. The optimal two-channel Cauchy inequality is sharp at the
  existing mismatch cost `C_XY`; replacing that cost by `A_X-B_Y` is exactly
  the original signed pivot. The singular `G_Y` and zero-`H` cases have been
  audited explicitly. Generic independent-channel pointwise shorting is
  indefinite, although a stronger theta-specific admissible-graph inequality
  is not excluded.
- The regional Schur pivot satisfies an exact law of total variance. At odd
  H5 the small center pivot is negative at order `H^3`, within-core covariance
  is only `O(H^7)`, and the known integrated positivity is repaired by the
  tail plus core--tail covariance. A positive auxiliary anchor gives an
  all-degree identity even when a regional old block is indefinite; the open
  step is a theta-specific signed regional/angular budget with exact payment
  `2 delta_(ij) a_i a_j`.
- A left-cell Euler/Ewald decomposition cancels every modular seam jet and
  converges in an all-degree Schwartz topology. It gives a legitimate global
  correlated paid decomposition, but every nonzero finite cell packet has
  infinitely many Fourier sign changes, and finite packets with positive cell
  coefficients change sign in physical space. Seam repair therefore does not
  yield finite-block positivity in this grouping.
- Complete-theta log-concavity proves only the lower sine-tail bound. A smooth
  log-concave countermodel refutes the generic shape route, leaving a stronger
  alternating-lattice sign as a possible theta-specific target. Its
  high-frequency value is beyond all finite local jet expansions.
- Sra's 2026 reciprocal-Xi result gives a positive Laplace formula only before
  the first zero and all generalized Laguerre inequalities only on the finite
  published verified band. The source explicitly leaves the global first
  Laguerre inequality open. The RH-equivalent properties that cannot be
  imported without circularity are infinite PF order and complete
  monotonicity of the zero-heat sum `mathcal H` (equivalently, the
  complete-Bernstein property of `B`); the proved finite PF order and
  Bernstein property are unconditional.
- Any hypothetical off-line quartet must satisfy a reciprocal-square local
  crowding condition `M_(a,b)+1/(2a^2)>=2/b^2`. Standard strip geometry,
  finite verification, zero-free regions, density upper bounds, and global
  counts do not imply that scale-sensitive reserve. The canonical-product
  countermodel establishing this information gap is not a zeta/Xi model and
  preserves none of the missing theta or Euler-product arithmetic.

These results do not prove the first Xi Laguerre inequality, a new all-degree
pivot, or RH. Among the concrete analytic directions highlighted by this wave
are a theta-specific admissible-graph estimate, a uniform regional angular
budget, and a global correlated Euler/Ewald compensation; these are not
claimed to exhaust every possible argument.

## Fifth-wave source-specific closure audit

- The proposed theta-admissible pointwise rescue is closed. The exact
  translation--shear graph reaches every local feature pair already at even
  degree two and contains negative directions at the first odd rung. Enforcing
  the common polynomial/Appell relation globally reproduces the original
  signed Xi--Laguerre quadratic form exactly, so its positivity cannot be used
  as an independent premise.
- A uniform positive regional angular gap is impossible: at the scalar first
  odd rung every regional border is collinear for every partition. At H5 the
  actual complete-theta ratio `c4/c3` is nevertheless strictly increasing on
  `(0,infinity)`, which gives strict core--tail projective ordering and a
  mass-balanced cutoff. The remaining payment retains the signed regional
  `c5` diagonals in equation (44) of `H5_RATIO_AVERAGE_NEXT.md`. Its compact
  interval proof is now frozen as a deterministic 3,300-cell Arb replay; this
  promotes the fixed-H5 ratio theorem, not the signed payment or higher rungs.
- The correlated Ewald payment has an exact trapezoidal Peano representation.
  Galerkin orthogonality supplies only a global curvature-null mode. The former
  core--edge condition collapses to perfect sign segregation; the surviving
  sufficient target is stochastic fractional-cell placement for the assembled
  corrected theta source, including its mismatch term.
- The stronger alternating-lattice sign is now proved on the entire half-cell
  for all sufficiently large spacings. There is also a rigorous finite-lobe
  plus convex-tail certificate schema on any compact spacing interval bounded
  away from zero. Modular inversion does not transfer spacing, and no compact
  replay or small-spacing closure is claimed.
- Ordinary heat-flow positivity cannot cross zero collisions: in decreasing
  time `s=T-tau` the undivided Laguerre expression acquires a negative
  collision source, and excluding all topology changes down to zero heat would
  already impose the stronger de Bruijn--Newman conclusion. A separate entire
  countermodel proves that
  infinite coefficient log-concavity plus all relevant Toeplitz minors does
  not imply the continuous spectral Laguerre sign.
- For each fixed residual, an off-line zero quartet's local `b^-2` obstruction
  integrates to an `O(b^3)` negative penalty under the stated scaled
  equicontinuity hypothesis. Disk bounds and canonical-series convergence give
  a conditional fixed-polynomial verification principle, not a single
  degree-uniform verified band.

These are analytic reductions and route retirements, not an RH result. At the
fifth-wave checkpoint, the candidate source-specific obligations were the
signed H5 `c5` budget, fractional-cell Ewald placement,
compact/small-spacing alternating-lattice completion, or quotient sampling.
The next audit sharpens or retires those formulations.

## Sixth-wave saturation and high-frequency audit

- The canonical joint old/new-channel completion has now been evaluated on
  the actual polynomial witness. Both nonnegative channel terms cancel and
  the bordered trace form is exactly `Q[pi]=2S`. Thus a generic correlated
  covariance or one more quotient Cauchy estimate has no hidden reserve; any
  successful continuation must estimate the source-specific pivot itself.
- At H5, equation (44) of `H5_RATIO_AVERAGE_NEXT.md` is a strict sufficient
  condition, not the sharp pivot: its left side equals the true H5 Schur
  complement minus `delta_*^2 a^2`. The exact live scalarization is a single
  assembled bottom-Turan integral plus the variance of `c4/c3`, minus one
  explicit old-prefix cost. A rational two-region model shows that ordering,
  balance, positive regional old blocks, and even pointwise bottom-Turan
  positivity do not imply this payment. The Planat--Sole four-spatial-jet cone
  likewise does not determine the independent `c5` jet.
- Fractional Ewald placement is exactly a folded sine-family inequality for
  the assembled samples `m J_pi(m)`, whereas the actual paid pivot is only a
  positive weighted average of that family. A self-dual Schwartz countermodel
  proves placement is strictly stronger than the scalar sign. Convexity and
  nonnegativity of the combined sample sequence remain a concrete sufficient
  cone, not an established theta property.
- The small-spacing alternating lattice has an exact odd-harmonic
  high-frequency form. Full half-cell positivity forces the actual first
  Laguerre density `F(a)>=0`, and a third-harmonic-scale lower bound on `F`
  would close sufficiently small spacings. The available completed-zeta
  envelope is only an upper bound and cannot decide that sign.
- Conditional on one off-line quartet, the all-polynomial core-only quotient
  sampling norm grows exponentially on both parity ladders. That proposed
  contraction is therefore equivalent to excluding such quartets and is too
  strong to serve as a weaker input. This does not rule out special alignment
  of the actual Galerkin residual or exact background/exterior compensation.
- The complete de Bruijn--Newman source, and hence the scaled campaign source
  `psi`, is not Polya-frequency of order five. This blocks source-level
  translation total positivity above order four, but it does not sign the
  associated Turan profile, Hankel form, or endpoint pivot.
- Independently of the Volterra quotient, the shifted-Xi de Branges diagonal
  has an exact small-shift identity whose boundary derivative recovers
  `Q[pi]`. The Volterra construction is an exact structural quotient analogue,
  but the cited framework supplies no proved evaluation-trace and
  joint-isometry pullback between the two, nor the required endpoint passage.
  It is an analogue, not a sign transfer.

These results further narrow the live analytic work to direct complete-theta
control of `Q[pi]`, the assembled H5 scalar expression, a weaker integrated
form of the Ewald sine family, or actual-residual alignment with the full
signed exterior compensation retained. They do not prove the first Xi
Laguerre inequality, an all-degree pivot, or RH.

## Seventh-wave assembled-scalar audit

- Under the old-prefix/range hypotheses with `m_k>0`, reverse Gram--Schmidt
  gives a singular-safe all-degree identity. If `c_k>0` a.e. and the quotient
  integrals converge, each normalized next pivot is the expectation of one
  signed local Schur defect plus the variance of the same combined feature
  vector. It exactly recovers the H5
  bottom-Turan/ratio-variance/old-cost formula. The identity is saturated:
  with earlier moments fixed, the newest moment enters with coefficient one.
  Old-prefix or border-only recursion cannot supply the missing sign.
- Retaining the entire positive background and exterior parent does not make
  the actual Galerkin residual avoid a near-critical negative sampling mode.
  Its correction is amplified by `(1-lambda)^(-1)`. At an exterior point
  where the parent residual is nonzero, an exact Christoffel model, stable
  under fixed-degree quartet-shaped interval approximation,
  keeps the old prefix positive while the next actual pivot is negative.
  This is a source-free method obstruction, not a Xi quartet.
- The full H5 payment has an exact Sobolev/Riccati square representation. A
  cubic auxiliary makes the remainder criterion positive in a noncertifying
  diagnostic, yielding a
  compact fixed-H5 target without splitting its signed terms. At every
  nontrivial rung `2N+epsilon>=1`, however, every pointwise polynomial
  auxiliary has the sharp Hardy deficit `(4N+2epsilon-1)/4`; the even base is
  separately positive. The auxiliary hierarchy converges back to the target,
  and a positive Gaussian ladder proves that fixed auxiliary degree eventually
  fails generically. Linear degree is the natural growing scale, but a
  theta-specific fixed-degree miracle is not excluded; either route must pay
  a source-specific margin.
- The direct Ewald scalar is one harmonic-weighted half-space in the second
  differences of `mJ_pi(m)`, not the full pointwise sine cone. It is also the
  endpoint integral of a seam-free Euler-renormalized polylogarithmic Abel
  path. Finite samples or cells do not determine its sign in the generic
  self-Fourier class; an all-index theta rigidity or tail theorem is needed.
- The proposed absolute small-spacing first-harmonic lower bound is a strong
  minimum-modulus theorem. It would force eventual critical-line simplicity,
  individual derivative and spacing bounds, and a zero-free tube for the
  Laguerre density. A relative log-decay lemma avoids an absolute minimum but
  still assumes the missing first-Laguerre sign.
- A degree-independent translation-intertwining contraction between the
  complete positive and negative theta channels is equivalent to the global
  first-Laguerre sign on either full parity cyclic range. Positive tilted parents have
  exactly the missing Turan profile as their Loewner curvature, while complex
  shift subharmonicity leaves the polynomial-transport curvature unpaid.

The surviving analytic work is correspondingly directional and
source-specific: control the newest Bell coefficient in the reverse-anchor
identity, construct a theta-specific auxiliary with a uniform margin, prove
the scalar Ewald half-space/Abel integral, or couple the actual mismatch
vector to its sampling spectrum. None of these identities or countermodels
proves the first Xi Laguerre sign, the full ladder, or RH.

## Eighth-wave correlated-target audit

- The finite Bell-moment map has full-rank differential at the actual theta
  profile. For every sufficiently small parameter, theta-scale positive even
  analytic perturbations preserve every old moment and the differentiated
  first-orbit hierarchy through its orbit-gap scale while moving the newest
  moment and pivot. They leave the exact Jacobi family, so the new conclusion
  is a route boundary: additional source-specific structure is necessary.
  The exact joint orbit-score payment isolates that missing structure but is
  still target-equivalent and unproved.
- The direct negative-quartet term and inverse old-metric feedback combine as
  one defect norm `<z,(I-CC*)^(-1)z>`. The next pivot is equivalent to one
  directional augmented-column contraction. A coupled entire
  quartet/background model preserves reflection, exterior reserve, and old
  positivity but has a negative next pivot, ruling out those properties alone.
  It is not Xi and lacks complete-theta modular arithmetic.
- The actual residual has an exact one-rung Julia-defect lift. Its contraction
  margin is `8q[pi]`, with the complete harmonic/Abel compensation retained.
  A damped Abel differential inequality permits negative cells and a negative
  Abel derivative, but no complete-theta seed or damping function is proved.
- The whole Abel path has an exact Poisson--ceiling boundary-trace kernel.
  Every interior infinite Abel packet and its radial derivative change sign
  in physical and Fourier space, refuting positive-packet proofs. A generic
  Fourier-`+1` Schwartz countermodel shows that pointwise Abel monotonicity is
  not necessary and does not follow from generic self-dual data, but it
  remains a possible, unnecessarily strong theta-specific sufficient
  condition. An integrated sign-changing correlation remains live.
- The two-generator Sobolev auxiliary `alpha q'+beta tq` gives a genuinely
  noncircular five-scalar sufficient inequality using only the old residual
  and positive `W^2` measure. Its rounded H5 value is noncertifying, and the
  all-degree inequality is unproved. The derivative-only recurrence fails for
  real-rooted residuals, while ordinary theta heat flow supplies no fixed
  polynomial closure.
- The Bell exponential generating function is a positive imaginary-shift
  norm, but its Gram differs from the target exponential-Hankel kernel by an
  explicit indefinite transport kernel. Full positivity of the target kernel
  is the missing first-Laguerre sign. A scaled strongly log-concave Gaussian
  heat family still has negative spectral Turan density, so source-free
  imaginary-shift, heat, and log-concavity arguments cannot close the gap.

Highlighted live theorem-shaped obligations include the directional defect
inequality for the actual sampling column, the two-generator five-scalar
Sobolev inequality, and a source-derived damped Abel inequality; this list is
not exhaustive. An orbit-score proof would have to use exact Jacobi arithmetic
before any termwise estimates. These are analytic reductions and route
classifications, not the first Xi Laguerre sign, an all-degree theorem, or RH.

## Ninth-wave complete-orbit and Hardy audit

- A theta-scale double-exponential tail, the natural open imaginary-shift
  strip, positivity, evenness, and arbitrary strong log concavity still admit
  a negative spectral transport direction in an explicit non-Jacobi model.
  Super-Gaussian shape alone is therefore not the missing arithmetic input.
- The exact Green-kernel representation inserts the complete theta source
  into every quartet quotient. Every nonempty raw finite packet of positive
  half-line theta orbits has an uncancelled odd modular-center jet, producing
  an algebraic quotient tail and divergent exterior reserve at high polynomial
  degree. Raw positive-orbit truncations and orbitwise-positive Cauchy are
  retired; complete modular cancellation or an explicitly seam-free
  Euler/Ewald grouping is essential.
- The exact Jacobi orbit law has strict MLR ordering. At the center, its
  negative score covariance is canceled exactly by positive drift. For each
  fixed spatial point, higher even scores are increasing only on a high tail,
  which signs the tail--tail covariance but not the full covariance. Drift,
  lower Bell data, and old regression must remain jointly assembled.
- Integrable Abel damping is only a bounded positive gauge. The logarithmic
  quotient is circular/nonintegrable at zeros, and every positive scalar
  damping of an interior completed packet still changes sign. The explicit
  variation gauge has total damping at most `log 3` for the fixed half seed;
  it leaves one Poisson--ceiling seed and one signed Wronskian inequality.
  Both remain open.
- Under the two old positive-prefix/simple-root hypotheses, the Abel path for
  `0<=z<1` is exactly a polarized Hardy defect, with `z=1` obtained as the
  Euler-renormalized endpoint limit. The variation-gauge Wronskian is the
  corresponding directional cross-Hardy form with positive cell weights.
  Root Mellin variance also has an exact
  Euler-cell representation. This bridge supplies no automatic sign:
  logarithmic root factors create nonintegrable scale tails, so Euler
  subtraction must precede Mellin differentiation. A theta-specific
  cross-Hardy angle or reverse root-cell curvature remains open.
- The five-scalar Sobolev condition is exactly a lower bound on a correlated
  two-dimensional score projection. Generic Gram geometry has the opposite
  direction. Positive-target super-Gaussian and exact residual countermodels
  show that convexity, integration by parts, old-prefix positivity, and the
  two canonical old-space identities are insufficient without theta
  arithmetic.
- The first odd complete-theta instance is now proved analytically:
  `||psi||_2^2 ||psi''||_2^2 < 5 ||psi'||_2^4`. The proof uses exact
  incomplete-gamma formulas for the first orbit and a uniform analytic sum of
  all remaining orbits, with strict rational margin
  `622392611/20000000`. It uses no sampled-height quadrature or finite orbit
  truncation. This closes one sufficient base case only.
- The first nonconstant even auxiliary `(N,epsilon)=(1,0)` is also proved.
  For `q=t^2-c`, a discriminant reduction makes the sufficient condition
  independent of `c`; complete orbit bounds give `r>14/5`, `s<14`, and
  margin `9r^2+6r-27-4s>109/25`. The result therefore holds for the actual
  coefficient and indeed every real `c`. Together with the preceding item,
  both first nontrivial parity instances are closed, with no higher-rung
  induction asserted.
- The full Bell-plus-regression pivot has an exact all-orbit collapse. Under
  the two old coupled positive prefixes it is the square of the complete raw
  orbit mean minus a strict real-root Hardy cost. Ordinary variance is
  subtracted, so Jensen cannot pay the cost. A two-branch logarithmic
  transform gives the new noncircular sufficient budget
  `sum_j 4V_j/(1+V_j)<=2`, with `V_j` the rootwise log-distance variance.
  Proving that Mellin/Ewald curvature budget for the actual residual remains
  open.
- Assembling all roots gives one vector-state `log|D|` variance criterion,
  but exact Gaussian Hermite residuals show that both the rootwise and
  assembled Mellin bounds can fail while the Hardy target is positive. They
  are sufficient, not necessary, and cannot follow from strong log concavity
  or additive Christoffel localization. Raw finite positive-orbit theta
  packets also lack the Mellin domain at campaign degrees. Complete modular
  jet cancellation or an explicitly seam-free Euler/Ewald grouping restores
  the domain, but a positive all-jet smooth source can still approach the
  sharp Hardy constant `1/4` with divergent log variance. Additional
  quantitative actual-theta structure, for example exact Jacobi weights, is
  required beyond seam cancellation alone.

The ninth wave therefore contains two new analytic low-rung proofs and
several exact route classifications. It does not establish a higher rung,
the all-degree Hardy/Mellin budget, the first Xi Laguerre sign, an all-degree
positivity theorem, or RH.

## Tenth-wave low-rung certificates and uniform reductions

- The actual complete-theta two-generator auxiliary is now strictly proved
  at three additional rungs: `(1,1)`, `(2,0)`, and `(2,1)`. Together with the
  prior first odd and first nonconstant even results, this gives five
  consecutive low-degree complete-orbit certificates. These are fixed-rung
  results, not an induction.
- At `(1,1)`, the degree-eight numerator is positive for every real residual
  coefficient. Exact first-two-orbit incomplete-gamma expressions, a uniform
  all-`n>=3` tail, Arb outward bounds, and an exact Sturm chain prove the
  statement. A positive-Gaussian actual-residual countermodel satisfies the
  first-odd gap but has a negative next pivot, so the proof uses genuinely new
  theta arithmetic rather than a source-free odd induction.
- At `(2,0)`, a fixed `3 by 3` moment projection isolates the correlated
  bivariate numerator. Generic positive-source Gram geometry fails on an
  exact Gaussian actual residual, while the complete-theta high-derivative
  anchor holds. Correct `M_j=mu_j/4^j` normalization and tight full-orbit
  enclosures through derivative order five prove the actual theta numerator,
  auxiliary, and pivot strictly positive.
- At `(2,1)`, first-three-orbit assembly plus an all-`n>=4` tail and independent
  300/420-bit replays prove the actual residual auxiliary and pivot strictly
  positive. A real-rooted trial polynomial makes the coefficient-free
  auxiliary negative, so actual signed-residual control is essential.
- The general nonautomatic two-generator condition is exactly a reverse Schur
  upper cap on `D-E^2/A`. Positive moment/Hankel/J-fraction theory supplies
  only the opposite lower bound. The newest positive moment enters affinely,
  and no fixed finite multiplication state closes the hierarchy. This exact
  cap was the candidate carried into the eleventh wave; it is refuted below.
- The complete Hardy form is exactly one division-free root-logarithmic band
  correlation. Quotient angles generically have poles at real Xi zeros. The
  reverse Mellin condition is one absolutely convergent double Euler-cell
  inequality after subtraction, not a cellwise sign.
- The bounded-gauge band difference further collapses to a signed scalar
  Ewald-cell hazard order. The exact half-gauge target is a seed plus
  `(3M/2-2N)P'>=(3M/2-2P)N'`. The tilted mean-index order
  `P'N-PN'>=0` is sufficient but unproved. Exact abstract sequences show that
  cell magnitudes, seed, and positive endpoint do not determine the sign.

All fixed-rung interval proofs have bounded replay programs and frozen
receipts; the odd `(1,1)` and following `(2,1)` certificates also have fresh
independent higher-precision replays. None of these fixed-degree results
proves the actual signed-cell order, the first Xi--Laguerre inequality, an
all-degree theorem, or RH.

## Eleventh-wave route resolution and reverse cell order

- The actual complete-theta degree-ten residual `(N,epsilon)=(5,0)` has a
  strictly positive old signed block and actual target pivot. In the corrected
  archived signed-moment normalization,
  `S_(5,0)^(archive)>1.3981115905406887e16`, but it rigorously violates the
  reverse Schur cap: `cap-V<-8.571354299633478e16` and
  `H[n]<-1.019072112071746e14`. The two-generator auxiliary is therefore
  false as an all-degree theta lemma even though the actual pivot at the same
  rung is positive.
- The primary proof uses exact first-six-orbit Gram terms plus an analytic
  tail containing every `n>=7` orbit. Frozen 400/600-bit receipts replay
  byte-for-byte. A separate 720-bit implementation uses `arb_mat`, a
  determinant-ratio pivot, exact orbits one through eight, and an analytic
  `n>=9` tail; it independently confirms every sign.
- Adjacent complete-theta Turan inequalities and strict truncated Stieltjes
  moment geometry do not imply the residual-correlated cap. Keeping the
  certified half-line moments through `n_5` while moving only `n_6` inside all those
  bounds gives a rigorously negative correlated numerator. This is a
  non-implication model, not a modified-theta theorem.
- The compressed Sobolev route must therefore retain more of the orthogonal
  score reserve, for example through multiplication layers and the prior
  same-parity residual. No such enlarged-space uniform lemma is yet proved.
- For fully assembled signed scalar Ewald cells, the exact hazard has the
  reverse-order form `W_alpha=C S'-2D`. Thus `S'>=0` and `D<=0`, plus the
  separate Abel seed, suffice. The equivalent pair transport and stochastic
  tail identities give a concrete all-index analytic target.
- The two frozen low-rung Ewald probes observe `S'>0`, `D<0`, and positive
  truncated half-gauge hazard at their sampled points. Both are explicitly
  floating first-ten-cell diagnostics; they prove no Abel interval,
  all-index tail, endpoint sign, or all-degree theorem.
- The tilted Brascamp--Lieb estimate underlying the proposed `N=1` test is
  valid with its exact factor two. The subsequently supplied `I_+`, `I_-`,
  `P_+`, `P_-` definitions and exact bridge to the archived complete
  commutator are audited in the thirteenth wave below.

This wave resolves one central blocker by falsification: improving the
two-generator reverse-Schur cap cannot yield a uniform proof. It does not
make the actual degree-ten pivot negative and proves neither the first
Xi--Laguerre inequality, an all-degree target theorem, nor RH.

## Twelfth-wave enlarged score and analytic Ewald tail

- The exact polynomial-score identity now applies to any finite correlated
  dictionary `V`: with `s=-q'W-2qW'`, Gram matrix `K`, and
  `y_i=integral q r_i'W^2`,
  `H_V=(y^T K^(-1)y-A)/4` and
  `2pi S-H_V=||(I-P_V)s||^2/4`. Adding one feature has the exact nonnegative
  Schur gain `delta^2/(4 sigma)`.
- At the actual complete-theta even residual `kappa=10`, the single extra
  feature `t^2q'` repairs the failed auxiliary. In the half-line positive
  moment scale, the two-generator interval is contained below
  `-1.0189895180e14`, whereas
  `H_span(q',tq,t^2q')>6.3933727580e13`. The construction uses signed
  moments only through `M_9`; the comparison pivot moment `M_10` is not used.
  The 720-bit primary/replay receipts are byte-identical, and an independent
  800-bit replay confirms every reported sign.
- The same bounded verifier covers the available actual even ladder
  `kappa=2,4,...,10` and odd ladder `kappa=1,3,...,9`, using exact theta
  orbits one through eight plus an analytic tail containing every `n>=9`
  orbit. These remain finite-rung certificates and route-selection data.
- A blanket fixed-width impossibility is false. The precise obstruction is
  narrower: the two-rung residual vectors have an exact operator recurrence,
  but no fixed finite scalar Gram state is invariant under multiplication by
  `t^2`; the highest layer creates new Gram data. A uniform proof must supply
  a complete-theta lower bound for `delta^2/sigma`, or control a growing
  multiplication hierarchy.
- The fully assembled Ewald source has a genuine analytic all-index tail.
  For every fixed monic parity residual of degree `kappa`,
  `J_q(x)` has sign `(-1)^kappa` eventually and leading size
  `8 pi^4 (2pi)^(2kappa) x^(2kappa+7/2)(log x)^2 exp(-2pi x)`.
  Consequently the left Euler cells have eventual sign
  `(-1)^(kappa+1)` and successive absolute ratio tending to `exp(-2pi)`.
  This is derived from the complete physical correlation through a
  Bessel-`K` reduction, before any sign split.
- The tail theorem supplies explicit head/tail inequalities and an
  effectively certifiable geometric-majorant scheme for the
  half-seed, `S'`, and aggregate reverse order `D<=0`. On odd rungs the
  stronger cutoff-by-cutoff condition `P B_k>=N A_k` is incompatible with an
  eventual positive tail whenever a negative head cell is rigorously present.
  The thirteenth wave supplies such a certified head at the actual first odd
  rung. The weaker aggregate `D<=0` remained the live route and is certified
  at that one rung in the fourteenth wave.
- Exact index moments also isolate the endpoint derivative:
  `M_1(s)=((2-s)/(1-s)) zeta(s-1)` and
  `S'(1)=(2pi)^(-1) integral q^2 B(Xi,H_1)`, with
  `H_1=-s(2-s)pi^(-s/2)Gamma(s/2)zeta(s-1)`. No sign is inferred from this
  identity.

This wave cracks two route-selection blockers: the discarded score reserve
can be recovered at the first failed actual rung with one noncircular feature,
and the infinite Ewald tail is now analytic rather than a finite-cell
diagnostic. At this checkpoint the remaining obligations were a uniform theta
inequality for the one-feature Schur gain, or certified finite-head
compensation against the proved Ewald tail. The thirteenth wave below refutes
the fixed one-feature rule at an actual later rung; no all-degree pivot, first
Xi--Laguerre inequality, or RH theorem follows.

## Thirteenth-wave route falsifiers and exact `N=1` bridge

- A source-free fixed-`U_3` theorem is impossible. For
  `q=t` and the positive even Schwartz weight
  `W=exp(-t^2/2)+(1/100)exp(-t^2/800)`, the target is strictly positive while
  the rank-adapted projection onto `span{q'W,tqW,t^2q'W}` is strictly
  negative. The proof is closed Gaussian algebra, with a denominator-free
  rank-three identity for future interval tests. This countermodel is not the
  complete theta source and does not refute a theta-arithmetic inequality.
- The source-specific question is now also settled for this fixed dictionary.
  At the actual odd `kappa=15` residual, constructed only from old signed
  moments `M_0,...,M_14`, a complete-orbit Arb certificate proves rank three
  and
  `H_span(q',tq,t^2q')<-9.88604319556048e24`. The inverse-free numerator is
  strictly negative while both Gram determinants are strictly positive; an
  independent clean replay and implementation audit confirm the sign. This
  refutes `t^2q'` as a uniform repair for the actual theta ladder. It does not
  load or sign `M_15`, the true target, and leaves adaptive or growing
  old-data dictionaries open.
- The exact physical packet behind the first Ewald index moment is positive at
  the modular centre and negative in both far tails. An explicit
  Euler--Maclaurin bound proves the negative tail. Pointwise positivity of that
  packet is therefore unavailable; the signed correlation with the complete
  theta profile remains the relevant object.
- With
  `I_+/-=integral h exp(+/-2ah)psi^2`,
  `P_+/-=integral exp(+/-2ah)psi^2`, and
  `M(b)=E_(nu_b)[v^2]`, the complete archived `N=1` commutator is exactly

  `C_1=(4a I_-/(s_0 s_1))
       {I_+[M(a)-M(-a)]-a(P_++P_-)}`.

  For `a>0`, `s_0>0` is automatic. Conditional on the actual current-prefix
  input `s_1>0`, the audited Brascamp--Lieb inequality proves `C_1<0` under
  `2I_+ integral_(-a)^a sqrt(A_bB_b)db<a(P_++P_-)`. This signs an unpaid
  commutator defect; it proves neither `s_1` nor the next pivot `s_2`.
- For the actual degree-one residual `q=t`, Arb quadrature on `[-40,40]`
  plus a complete analytic spectral-tail bound proves
  `e_2<-0.425466581761017`. Together with the proved eventual-positive odd
  Ewald tail, this rigorously refutes the stronger cutoff-by-cutoff stochastic
  order at this actual rung. It does not sign the aggregate
  `D=P'N-PN'`, the half-seed, or `S'`.

These results remove three overly strong proof routes and supply the formerly
missing `N=1` algebraic bridge. They do not prove a pivot, an all-degree first
Xi--Laguerre inequality, or RH. At this checkpoint the live work was an
adaptive or growing complete-theta score rule, a correlated tilt bound for
`E_(nu_b)v'`, or certified aggregate Ewald head/tail compensation. The next
wave below advances all three without closing the all-degree problem.

## Fourteenth-wave recurrence repair and first-rung closures

- A finite candidate block has exact gain `z^T Sigma^(-1)z/4`, and the single
  old-data combination `c=Sigma^(-1)z` realizes the full block gain. However,
  no source-free fixed polynomial degree ceiling can work uniformly: for each
  ceiling a two-scale positive even Schwartz family has a positive target but
  a negative auxiliary even after projection onto every polynomial below that
  ceiling. Complete-theta arithmetic or a degree-growing rule is essential.
- The recurrence supplies a sharper actual-theta choice. The old-data space
  `V_N^prior=span{q_N',tq_N,q_(N-1)'}` is rigorously positive on all thirteen
  available rungs, odd `kappa=3,...,15` and even `kappa=4,...,14`. At the
  critical actual `kappa=15` rung,
  `H_(V_prior)>6.611165481170336e25` and the cleared numerator is positive.
  Only `M_0,...,M_14` enter; `M_15` is absent. This repairs the known fixed
  `U_3` failure noncircularly, but the uniform inequality
  `N_prior(N,epsilon)>0` remains open.
- Conditional on the second cell being the sole negative cell, the first-odd
  Ewald aggregate collapses exactly to
  `D=(-e_2)z(zS'-2S)`, reducing its sign to one endpoint test. More strongly,
  the actual `kappa=1`, `q=t` certificate does not assume any remote sign:
  complete cells one through six plus a sign-free analytic all-index tail
  prove uniformly on `1/2<=z<=1`
  `S(1/2)>0.2224841354`, `S'(z)>0.2535251354`, and
  `-D(z)>0.03407979784`. This closes the aggregate Abel gates at this one
  actual rung only.
- The complete-theta opposite-tilt inequality is also now certified uniformly
  for `0<a<=1/4`. A cancellation-free complete-orbit enclosure proves
  `R(a)<-0.0324959540305671` and independently
  `s_1/(2a)>0.352482030101313`. Since `s_0>0` is automatic, the complete
  archived `N=1` integrated modular commutator is rigorously negative over the
  full campaign interval. This signs the archived unpaid defect; it does not
  pay the next `s_2` reserve.

All interval certificates above were clean-replayed and independently audited.
They identify a recurrence-aware score target and close two first-rung analytic
obligations. They do not prove a next pivot, an all-degree first Xi--Laguerre
inequality, or RH. At that checkpoint the live work was the uniform
prior-derivative inequality, higher-rung sign-free Ewald compensation, and the
separate modular boundary/`s_2` payment; the next wave sharpens all three.

## Fifteenth-wave source-specific barriers and endpoint payment

- The recurrence-aware prior derivative is not a source-free theorem. An exact
  positive even entire Schwartz countermodel has a positive old signed block
  and positive degree-four target but a strictly negative prior-derivative
  auxiliary. More strongly, `W=exp(-t^4)` is log-concave and satisfies
  `W'^2-WW''>=0`, so its entire true target ladder is positive, yet the same
  auxiliary is rigorously negative at degrees seven and eight. These examples
  do not affect the thirteen complete-theta certificates; they prove that
  Favard, Christoffel--Darboux, target positivity, and log concavity alone
  cannot extend them.
- The exact surviving prior-score identity is now explicit. If
  `p=(I-P_span(q',tq))q_(N-1)'` and `v=-W'/W`, adjoining the predecessor gains
  `|integral (v-lambda t)q p W^2|^2/||pW||^2` for every real `lambda`.
  Therefore the open all-degree statement is a complete-theta alignment bound
  between the nonlinear logarithmic drift and the predecessor innovation,
  not generic Jacobi positivity. Even the Gaussian reference reserve is only
  `H_prior/A=1/(4 kappa)` and shrinks with degree.
- The analytic Ewald tail now separates exactly by parity after any certified
  Bessel sign threshold. For odd degree, the positive remote tail improves the
  seed and derivative and costs only one centered first moment in `D`. For
  even degree, support separation gives `D<=D_K` exactly, so the remote tail
  costs nothing in the aggregate. The remaining all-degree obligation is a
  degree-uniform Bessel threshold/remainder together with uniform finite-head
  margins; no larger floating cell table can replace it.
- The modular defect has an exact payment identity:
  `kappa_1 mu_1^-=-C_1+R_a`, where `R_a>0` is a current-prefix remainder.
  Thus `C_1<0` alone necessarily underpays the one-negative-direction cost.
  At the normalized endpoint, however, independently audited complete-theta
  bounds prove
  `sigma_2>(1254/8)sigma_0>4Q_0`, so the `N=1`, `a=0` defect is paid and
  `sigma_2>0`. Continuity yields an unspecified `a_0>0` on which the raw
  finite-`a` strong payment and `s_2(a)>0` persist.

All exact countermodels and payment constants were independently replayed.
The modular result does not give an explicit `a_0`, does not cover the full
`0<a<=1/4` interval, and does not extend to higher degrees. The all-degree
complete-theta alignment inequality, degree-uniform Ewald head/tail margins,
and global modular payment remain open. Nothing in this wave proves RH.

## Central open lemma

Beyond the finite global theorem through degree `30000000000`--and beyond
degree 10 at positive cutoff--the current bridge would require an actual,
source-specific lower-metric
innovation gain that uniformly dominates the regression mismatch/action and
every signed coupling cost as the degree grows. The all-prefix
frozen-residue-positive route is now retired: a viable proof must retain the
endpoint-equivalent one-negative-direction structure or bypass that gate.
The Fisher inequalities and finite prefix diagnostics do not, by themselves,
pay the actual all-degree signed cost.

For the narrower normalized-endpoint modular route, assuming a positive
current prefix, the v26 canonical construction sharpens the sufficient target
to

`4 y^T c_W' - 2 gamma^T H gamma >= kappa_0 M_N`.

Every term is determined by the current prefix, but its correlated sign and
size are not proved uniformly. The fifteenth-wave curvature argument pays the
`N=1` normalized endpoint and a nonquantified positive neighborhood by a
different sufficient bound. The displayed criterion remains open uniformly,
for an explicit full interval, and at higher degree; it is not a global
equivalence to all-shift closure.

A second normalized-endpoint reduction is now available in arithmetic form.
For the even ladder the infinite tail beyond an explicit `O(N^2)` cutoff is
positive, so a positive exact finite partial sum would certify the contact. For
the odd ladder the finite partial sum must exceed the explicit negative-tail
payment, not merely be positive. Proving these finite signed-core inequalities
uniformly beyond the certified range is open; the reduction is not itself an
all-degree or RH theorem. The degree-30-billion theorem bypasses this
arithmetic-core route and does not certify the individual finite divisor cores
through that range.

Equivalently in the CP62 matrix language, one needs a complete positive-time
coefficient map into the physical boundary form and a reserve-relative
`J8/J9` angular estimate, with all exceptional directions, inverse costs,
switching terms, and limiting/domain gates retained.

