# Real-space theta reflection for the correlated `v`--`d` channel

## Scope

This note replaces the off-axis description of the residue drift by exact
real-space complete-theta identities.  It also records a rigorous obstruction
to one naive integration-by-parts proof.  The identities do not prove the
correlated target-dual inequality, positivity of `M_0`, an all-degree endpoint
sign, or RH.

Let

\[
 q(h)=e^{h/2}\vartheta(e^{2h}),\qquad
 \chi(h)=\sum_{n\geq1}4z_n e^{h/2-z_n},\qquad
 z_n=\pi n^2e^{2h},
\]

and put `D=d/dh`.  The complete-theta kernel is

\[
 \psi=q''-\frac14q.
\]

For a fixed-parity polynomial `p`, write

\[
 F_p=p(D)\psi=\Psi_p-e(p)\chi,
 \qquad G_p=\Psi_{p'},
 \qquad d(p)=e(p'). \tag{1}
\]

If `p` has parity `epsilon in {+1,-1}`, then `F_p(-h)=epsilon F_p(h)`.
The corrected feature `F_(p')` has parity `eta=-epsilon`.

## Two differential identities

Termwise differentiation of the absolutely convergent theta series gives

\[
 q'=\frac12q-\chi,
 \qquad
 \boxed{\chi=\frac12q-q'}, \tag{2}
\]

and hence

\[
 \boxed{\psi=-\left(D+\frac12\right)\chi}. \tag{3}
\]

Both identities hold on the whole real line.  They retain the cancellation
between the growing `q/2` and `q'` terms as `h` tends to positive infinity.
Those two terms must not be estimated separately.

## The drift is a real modular-reflection amplitude

The modular relations are

\[
 q(-h)=q(h),\qquad \chi(-h)=q(h)-\chi(h). \tag{4}
\]

Since `G_p=F_(p')+d(p)chi`, reflection gives the unified identity

\[
 \boxed{
 G_p(-h)-\eta G_p(h)
 =d(p)\{\chi(-h)-\eta\chi(h)\}.
 } \tag{5}
\]

Consequently, for even `p`,

\[
 \boxed{d(p)=\frac{G_p(h)+G_p(-h)}{q(h)}} \tag{6}
\]

for every `h>=0`.  For odd `p`,

\[
 \boxed{d(p)=\frac{G_p(-h)-G_p(h)}{2q'(h)}} \tag{7}
\]

for every `h>0`.  Equation (7) has a removable center limit.  It is the
real-space form of the center-derivative trace.

The same calculation eliminates the residue from the corrected opposite-
parity feature:

\[
 \boxed{
 F_{p'}(h)=
 \frac{\chi(-h)G_p(h)-\chi(h)G_p(-h)}
      {\chi(-h)-\eta\chi(h)}.
 } \tag{8}
\]

Thus the corrected derivative is a theta-weighted `2x2` modular determinant.
Its denominator is `q` for even `p` and `2q'` for odd `p`.  The established
strict convexity `q''>0`, together with `q'(0)=0`, makes both denominators
positive on their stated domains.  In the odd-`p` case, (8) is read for
`h>0` and by its removable limit at the center.

## A single real-space integral for the combined functional

Define

\[
 D_\eta(h)=\chi(-h)-\eta\chi(h),\qquad
 Z_\eta=\int_0^\infty D_\eta(h)\chi(h)\,dh. \tag{9}
\]

Here `D_(-1)=q` and `D_(+1)=2q'`.  Complete-theta decay makes both integrals
finite, and positivity of `q`, `q'` and `chi` gives `Z_eta>0`.  Multiplying
(5) by `chi` and integrating yields

\[
 d(p)=\frac1{Z_\eta}\int_0^\infty
 \chi(h)\{G_p(-h)-\eta G_p(h)\}\,dh. \tag{10}
\]

Therefore the exact correlated functional from `M0_CROSS_COMPENSATION.md`
has the real-space representation

\[
 \boxed{
 \mathcal L_\tau(p)=\frac1{\sqrt2}\int_0^\infty\chi(h)
 \left[
 \sqrt\tau\,hF_p(h)
 -\frac{\tau^{-1/2}}{Z_\eta}
  \{G_p(-h)-\eta G_p(h)\}
 \right]dh.
 } \tag{11}
\]

Equation (11) preserves the `v`--`d` correlation inside one integral and uses
only real theta-orbit data.  Applying Cauchy to its two summands separately
would again lose that correlation; (11) is a reduction, not a bound.

## Integration by parts for `v`

Let a prime on `F_p` in this subsection mean the spatial derivative `D F_p`,
not the symbol derivative `p'`.  From (2),

\[
\begin{aligned}
 v(p)
 &=\int_0^\infty hF_p\left(\frac12q-q'\right)dh\\
 &=\boxed{\int_0^\infty q(h)
 \left\{(hF_p(h))'+\frac12hF_p(h)\right\}dh}. \tag{12}
\end{aligned}
\]

The boundary term `h F_p q` vanishes at the center because of the factor `h`.
At positive infinity, every finite derivative of `psi` has a polynomial
theta-orbit factor times `exp(-pi exp(2h))`, which dominates the growth of
`q`.  Thus (12) has no omitted boundary term.

## The residue EGF is a shifted first-orbit trace

Let

\[
 \delta=\frac12\log\frac{2\pi}{3},\qquad
 c_0=\frac16\exp\left(\frac32+\frac\delta2\right), \tag{13}
\]

and let

\[
 \psi_1(x)=4z(2z-3)e^{x/2-z},\qquad z=\pi e^{2x}, \tag{14}
\]

be the first positive theta orbit.  Since
`pi exp(2(t-delta))=(3/2)exp(2t)`, direct substitution in the exact residue
EGF gives

\[
 \boxed{E(t)=-c_0\psi_1(t-\delta)}. \tag{15}
\]

The commutator `p(D)t=t p(D)+p'(D)` then gives

\[
\begin{aligned}
 d(p)=e(p')
 &=\left.p(D)\{tE(t)\}\right|_{t=0}\\
 &=-c_0\left.p(D)\{t\psi_1(t-\delta)\}\right|_{t=0}\\
 &=\boxed{-c_0\,p'(D)\psi_1(-\delta)}. \tag{16}
\end{aligned}
\]

In particular, \(d_j=-c_0j\psi_1^{(j-1)}(-\delta)\).  This explains the
otherwise off-axis residue sequence as a shifted, position-weighted first-
orbit trace.  It does not by itself control `v`: the latter integrates all
theta orbits on `h>=0`.  The leading polynomial in `D^j psi_n` is
\(8(-2)^jz_n^{j+2}\), so the apparent \(e^{-3\pi}\) suppression of the second
orbit carries a competing leading factor \(4^{j+2}\).  A degree-uniform
first-orbit domination cannot be inferred from the raw exponential weights.

For orientation only, the existing floating odd-prefix replay gives the
target-metric optimizer `tau_*=sqrt(D/V)` as approximately `14.11`, `42.46`,
`46.98`, and `47.75` at degrees `3`, `9`, `15`, and `19`.  The fixed constants
in (13)--(16) do not algebraically determine those prefix-dependent inverse-
target norms, and the finite values do not establish a limiting `tau`.

## A rigorous boundary-jet obstruction

A tempting use of (12) is to move every `D^j` from `psi` onto `h chi` and
hope that subtracting one scalar multiple of `d_j=j e_(j-1)` cancels the
boundary terms at every grade.  This is impossible already at grades two and
four.

For `g=h chi`, repeated integration by parts gives

\[
 \int_0^\infty \psi^{(j)}g
 =(-1)^j\int_0^\infty\psi g^{(j)}+B_j,
\]

where

\[
 B_j=-\sum_{k=1}^{j-1}(-1)^k
 \psi^{(j-1-k)}(0)\,k\chi^{(k-1)}(0). \tag{17}
\]

Because `q` is even,

\[
 B_2=\left(q_2-\frac14q_0\right)\frac{q_0}{2},
\]

and

\[
 B_4=\left(q_4-\frac14q_2\right)\frac{q_0}{2}
     +3\left(q_2-\frac14q_0\right)\frac{q_2}{2}, \tag{18}
\]

with \(q_k=q^{(k)}(0)\).  The exact drift coefficients are
`d_2=-12` and `d_4=390`.  Hence a constant `lambda` satisfying
`B_j=lambda d_j` at both grades would force

\[
 B_4+\frac{65}{2}B_2=0. \tag{19}
\]

A 200-bit Arb evaluation of the theta series, summing orbits `1,...,10` and
bounding the omitted `n>=11` tail by decreasing geometric majorants, gives

\[
\begin{aligned}
 B_2&=0.9706141254571381992918039134597986987\ldots,\\
 B_4&=-12.65972295528953817278555418663835721\ldots,\\
 B_4+\frac{65}{2}B_2
 &=18.88523612206745330419807300080510050\ldots>18.
\end{aligned} \tag{20}
\]

The radius in the `q_4` omitted-orbit bound is below `1.14e-152`; interval
rounding in (20) is below `4e-56`.  Thus (19) is rigorously false.  This rules
out only the boundary-free formal-adjoint ansatz with one scalar drift
payment.  It does not rule out the modular two-channel estimate (11), a
nonlocal Hardy argument, or another source-specific correlated proof.

The interval calculation is reproduced by
`src/certify_m0_boundary_jet.py`; its focused tests are in
`tests/test_certify_m0_boundary_jet.py`, and the deterministic receipt is
`results/m0_boundary_jet_arb.json`.  From the workstream directory, run

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  src/certify_m0_boundary_jet.py \
  --precision 200 \
  --output results/m0_boundary_jet_arb.json
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  -m unittest tests.test_certify_m0_boundary_jet -v
```

The source SHA-256 is
`78b7ff247ce5695018367492fe289f50864173a26b406491e5eec03f7d3c2fd0`;
the receipt SHA-256 is
`9e360e0201e29d582362b653c2ce24cb7be2cd12375da2452a31e0c4416ac85d`.

## Resulting route status

Equations (8), (11), and (16) identify three exact forms of the same channel:
a modular determinant, a real reflected integral, and a shifted first-orbit
trace.  `M0_FIXED_TAU_NO_GO.md` subsequently shows that their combined
functional cannot satisfy the unit target-dual bound on every prefix in
either complete parity ladder.  The identities here therefore describe the
mechanism of the eventual frozen-residue failure; they are not an outstanding
universal positivity target.  They can still be used on finite positive old
prefixes or in a different argument that does not require `M_0>=0` at every
degree.  Neither pointwise orbit positivity nor separate Cauchy estimates
alter that conclusion.
