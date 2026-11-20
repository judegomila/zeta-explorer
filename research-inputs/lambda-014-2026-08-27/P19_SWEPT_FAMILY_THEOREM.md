# Complete directed P19 late-family mantle certificate

## Statement and exact scope

Put

\[
M=200000000,\quad q_p=26399999,\quad
X_a=6000000185827,\quad D=59993999999971158,
\]

\[
t(\lambda)=\frac{q_p+\lambda}{M},\qquad
R(\lambda)=X_a+D\lambda,
\]

and

\[
Y(t)=\sqrt{\frac7{25}-2t},\qquad U(t)=\sqrt{1-2t}.
\]

The frozen directed producer, 798 authenticated transcripts, and fail-closed
assembler certify the P19 scalar negative-ray inequality uniformly on

\[
0.047028592660038\le\lambda\le1,
\]

\[
R(\lambda)\le x\le R(\lambda)+\frac{17}{20},
\qquad Y(t(\lambda))\le y\le U(t(\lambda)).
\]

This includes the bottom and both vertical x faces, their selector seams,
and the entire interior x hull.  The conservative selector inventory is

\[
14999999\le N\le69098829.
\]

The first rational endpoint lies below the exact irrational seam

\[
\lambda_{15000000}(0)=0.047028592660038390665955\ldots,
\]

and block 00 therefore uses `N_MIN=14999999`.  Its selector interval
straddles 15000000.  This closes the microscopic gap that would remain if
the earlier rounded endpoint `0.047028592660039` were used.  At the terminal
endpoint `lambda=1`, the upper-face selector remains below 69098830.

The promoted statement is the complete **late P19 mantle family only**.  It
does not certify the earlier correlated ramp below this handoff, the complete
swept tube, or `Lambda <= 0.14`.

## Gap-free partition

`family_blocks.tsv` contains fourteen closed lambda blocks.  Every internal
lambda endpoint is literally the same decimal string in its two neighboring
rows, and every neighboring pair shares its boundary selector inventory.
The first and last rows are

```text
00 14999999 15100000 0.047028592660038 0.04765906863346
13 52000000 69098829 0.56628106379068 1.0
```

`family_y_tiles.tsv` contains nineteen closed rational y tiles with literal
shared endpoints and union exactly `[0.12649,0.858]`.  Directed geometry
proves this union contains `[Y(t),U(t)]` throughout every lambda block.  Each
coefficient enclosure is valid on its full rational y rectangle, but the
imported analytic-error theorem is invoked—and nonvanishing is promoted—only
on the rectangle's intersection with `Y(t)<=y<=U(t)`.  The source requires
that intersection to be nonempty for every lambda in the block; the
assembler proves that the nineteen intersections cover the whole moving
vertical interval without gaps.

## Exact 256-mask coefficient and tail binding

For `P=2*3*5*7*11*13*17*19`, the source uses all 256 exact P19 divisibility
masks.  It forms the primary and reflected subset sums `F_M` and `G_M` in
directed arithmetic and recombines every signed subset contribution before
taking either absolute value.  Exact per-panel mask populations are computed
by inclusion-exclusion, using `3^8=6561` floor operations per panel.  The
source gates both the per-panel population and the full integer inventory.

Above the selector it includes every one of the 255 nonempty squarefree P19
supports.  For each `d|P`, `d>1`, it charges the complete sharp-support range

\[
\widetilde b_d d^{-\sigma}
\left[
\sum_{\lfloor N/d\rfloor<m\le N} f_\sigma(m)
+c\sum_{\lfloor N/d\rfloor<m\le N} f_{\sigma-y}(m)
\right].
\]

That display is the pointwise tail for selector `N`.  On a block with
inclusive selector inventory `[N_MIN,N_MAX]`, the implementation uses the
single conservative union

\[
\left\lfloor\frac{N_{\min}}d\right\rfloor<m\le N_{\max},
\]

which contains the pointwise range for every selector in the block.

The decreasing hypotheses and convex logarithmic chord majorants are
source-gated over the whole tile.  All eight Euler-factor moduli are strictly
below one, so the P19 multiplier is nonzero throughout the certified domain.

## Imported swept error and seam charts

The assembler hash-binds a frozen `agent_error_envelope` source/transcript
snapshot and independently replays it in an isolated temporary tree.  This
prevents concurrent verifier invocations from truncating or racing on shared
dependency transcripts.
That package includes the mandatory kappa-removal term and proves the full
P97 multiplied transfer below `1/100000` on ordinary charts and below
`1/50000` on analytic half-jump seam charts over the complete moving domain.
Using the exact rational lambda inputs (rather than padded display
overhangs), the assembler separately proves

\[
[t_-,t_+]\subseteq
\left[\frac{24727519}{200000000},\frac{33}{250}\right],
\]

\[
[x_-,x_+]\subseteq
[6000000185827,60000000000156986],
\]

and the selector subrange
`[14999999,69098829] subset [690988,69098829]`.
The P19 norm uses a subset of the same positive Euler norm factors, hence is
bounded by the P97 norm.  Every tile conservatively charges `1/50000`.

The source also encloses the full x width `17/20`, admits every integer
selector in its inclusive block inventory, and applies the complete
half-jump allowance.  Thus ordinary charts, both one-sided selector charts,
the seam itself, the bottom, and both vertical x faces are bound by the same
tile record.

## Exact literal precision nesting

At precision `p`, every emitted interval is widened outward by the exact
dyadic amount

\[
\varepsilon_p=2^{-\lfloor p/2\rfloor}.
\]

The ray margin is independently recomposed from five emitted components, so
its raw derived interval is first widened by `5*epsilon_p` and then receives
the same one-`epsilon_p` emission envelope as every other interval.  Source
gates recheck on padded endpoints:

- both selector bounds;
- both decreasing gaps;
- `c<1`;
- all eight Euler-factor moduli `<1`;
- the recomposed ray margin `>0`;
- nonempty intersection with the swept y domain.

The assembler parses hexadecimal endpoints as exact rational powers of
sixteen and requires literal containment

\[
I_{256}\subseteq I_{192}\subseteq I_{160}
\]

for all twenty emitted intervals on every one of the 266 cells.  It does not
construct postprocessed hulls.

## Portability and fail-closed replay

Compilation requires at least 64 bits in `unsigned long`, and statically
checks that `X_a,D` fit.  Runtime parsing rejects signed N spellings,
overflow, reversed ranges, and values outside

\[
2\le N_{\min}\le N_{\max}\le69098829.
\]

The complete fresh replay compiles the frozen source, rejects adversarial N
inputs, runs all `14*19*3=798` producers with bounded deterministic
parallelism, parses each fresh output, compares it byte-for-byte to its
stored transcript, and rejects any source-hash drift.  The stored verifier
also authenticates the exact source, tables, proofs, dependencies, and every
transcript; recomposes every ray margin; checks literal joins and start-seam
straddling; and applies hostile transcript mutations.

## Promotion ledger

```text
P19_LATE_FAMILY_MANTLE_CERTIFIED true
REMAINING_EARLY_CORRELATED_RAMP_OPEN true
COMPLETE_SWEPT_TUBE_CERTIFIED false
LAMBDA_LE_0_14_CERTIFIED false
```
