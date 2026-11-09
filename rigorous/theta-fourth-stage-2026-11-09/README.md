# Fourth-stage positivity and the exact residual problem

Research continuation, 9 November 2026. The main result is a proof that
the actual xi response has a positive definite real Pick matrix at every
four distinct positive nodes. The proof uses published finite-height zero
verification on a bounded interval and direct gamma and prime estimates
on the remaining half-line. It is a finite-order result, not an RH proof
or a claim of a new general positivity criterion.

The second result identifies precisely why a fixed finite collection of
verified zeros cannot supply an all-order energy argument: its positive
form has finite rank, and explicit higher-order tests annihilate it.
The coupled-kernel recurrence now provides a concrete alternative target,
with its unproved ratio conditions stated explicitly.

## 1. The actual fourth-stage theorem

Set

$$
F(x)=\xi(1/2+x),\qquad L(x)=F'(x)/F(x),\qquad
P_L(x,y)=\frac{L(x)+L(y)}{x+y}.
$$

Then

$$
\boxed{[P_L(x_i,x_j)]_{i,j=1}^{4}\succ0
\quad\text{for every four distinct }x_i>0.}
$$

The new proof reduces this continuum of matrix statements to two scalar
inequalities. With

$$
h(u)=L(\sqrt u)/\sqrt u,\qquad j(u)=u h(u),
$$

both

$$
\boxed{2h'h'''-3(h'')^2>0,\qquad
2j'j'''-3(j'')^2>0\qquad(u>0)}
$$

hold for the actual xi function. Under the previously proved strict
three-node hypotheses, their nonstrict versions are exactly equivalent
to fourth-stage positivity. This equivalence is global in the node
variables, not just a condition for coalescing nodes.

The proof has two regions:

| Region | Argument | External zero information used |
| --- | --- | --- |
| $0\le u\le10^4$ | Two real spectral modes provide explicit positive moment margins; the remaining possibly nonreal tail has a rigorous error bound. | Published verification through $3\cdot10^{12}$, the first two zero intervals, and the classical strip. |
| $x=\sqrt u\ge100$ | Bounds on the digamma function, its first three derivatives, and the absolutely convergent prime series prove both signs directly. | No finite-height zero verification in this part. |

The bounded-interval margin comparisons are exact rational inequalities.
The large-axis proof gives scaled Schwarzian numerators greater than
$1/4$ and $1481/600$, respectively. No floating-point grid stands
in for the continuum proof.

The finite zero computation is an imported theorem; this checkpoint
does not rerun it or extend its verified height. The exact derivation is
in [the fourth-stage criterion](theta_fourth_pick_schwarzian_20261109.md)
and [the actual-xi proof](theta_fourth_stage_proof_20261109.md).

## 2. Consequences for the theta equation and energy

For the tilted theta measure

$$
d\nu_\theta(t)\propto t\kappa(t)\sinh(\theta t)\,dt,
\quad t>0,\quad
Q(t)=-\frac{\kappa'(t)}{t\kappa(t)},\quad
m(\theta)=E_{\nu_\theta}Q,
$$

the exact relation is $1/h(4\theta^2)=4m(\theta)$. The first new
Schwarzian sign therefore gives the actual theta-moment inequality

$$
\boxed{2\theta^2m'm'''-3\theta^2(m'')^2+3(m')^2>0
\quad(\theta>0).}
$$

This is a proved constraint on derivatives of the theta moment. Its proof here
uses the spectral and large-axis estimates above; it is not yet an
intrinsic theta-kernel preservation theorem.

For every nonzero test
$v(t)=\sum_{i=1}^N b_i e^{-x_i t}$ with $N\le4$ distinct
rates $x_i>1/2$, the previous exact energy identity now satisfies

$$
\boxed{Q_L(v)=E_\gamma(v)-2c_0\|v\|_2^2
-2\Re\int_0^\infty M(\ell)C_v'(\ell)\,d\ell>0.}
$$

Here $E_\gamma$ is the convergent gamma sum of squares,
$c_0=(\log\pi-\psi(5/4))/2$,
$C_v(\ell)=\int_0^\infty v(t+\ell)\overline{v(t)}\,dt$, and

$$
M(\ell)=2(e^{\ell/2}-1)
-\sum_{n\le e^\ell}\frac{\Lambda(n)}{\sqrt n}.
$$

The identity itself is valid for every finite number of these rates.
The strict inequality is proved here through four rates. See the fixed
[PR #48 energy derivation](https://github.com/judegomila/mathexplorer/blob/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09/theta_schur_residual_energy_20261109.md)
for its normalization and convergence proof.

## 3. The bridge as an exact reflection energy

Let $\rho$ range over all centered xi zeros, with multiplicity, and
put $V(z)=\sum_i b_i/(z+x_i)$. Then

$$
\boxed{Q_L(v)=\sum_\rho V(\rho)\overline{V(-\overline\rho)}.}
$$

The sum is absolutely convergent. The bridge reflection is
$\rho\mapsto-\overline\rho$, across the centered critical axis.
A zero on that axis contributes a positive square. On a two-element
reflection orbit, with values u and w, its energy is

$$
\frac12\bigl(|u+w|^2-|u-w|^2\bigr).
$$

This identifies the symmetric and antisymmetric components exactly.
Any all-order argument must control this signed reflection form. The
negative component cannot be removed by assuming that a symmetric
geometric picture makes the form positive.

## 4. Why a fixed verified head is insufficient at arbitrary order

A head containing m distinct positive critical-line frequencies has
matrix rank exactly $\min(N,2m)$ on N distinct real rate nodes.
At $N=2m+1$, the nonzero rational function

$$
\boxed{V(z)=
\frac{\prod_{j=1}^m(z^2+\gamma_j^2)}
{\prod_{i=1}^{2m+1}(z+x_i)}}
$$

vanishes at every head zero. Its partial fractions give an explicit
finite exponential test with exactly zero head energy. All its rates
can lie in an arbitrarily short positive interval.

Consequently a small absolute tail bound cannot establish positivity
at every order by comparison with this fixed head. In the decomposition
into the head range and its nullspace, the exact remaining condition is

$$
\boxed{E_{KK}-E_{KR}(H_R+E_{RR})^{-1}E_{RK}\succeq0,}
$$

provided $H_R+E_{RR}\succ0$. This is the tail energy on invisible
directions after accounting for its coupling to the head range.

The [rational residual note](theta_rational_residual_20261109.md) proves
these statements and a conditional witness theorem: if any off-axis xi
zero exists, a negative finite Pick test exists with distinct rates in
any prescribed interval $[a,a+\delta]$, $a>1/2$. This does not
find an off-axis zero or give a practical bound on the necessary matrix
size. It is an explicit construction of the established all-order
positivity obstruction.

## 5. The coupled-kernel route is now explicit

For $\mathcal L u(z)=\int_{\mathbb R}u(t)e^{zt/2}dt=U(z)$,
and similarly V, reductions alternate between two response forms.
At an anchor a, let $r=R(a)$. The divisions below are removable by
the anchor cancellation.

| Current response | Next numerator transform | Next denominator transform | Next response |
| --- | --- | --- | --- |
| $R=zU/V$ | $(z^2U-arV)/(z^2-a^2)$ | $(rV-aU)/(z^2-a^2)$ | $U_{\rm next}/(zV_{\rm next})$ |
| $R=U/(zV)$ | $(U-arV)/(z^2-a^2)$ | $(rz^2V-aU)/(z^2-a^2)$ | $zU_{\rm next}/V_{\rm next}$ |

For positive even kernels with the required rapid decay, sufficient
conditions for the next two kernels to be positive are

$$
\begin{array}{ll}
\text{first form:}&(u/v)'<0,\quad(u''/v)'>0,\\
\text{second form:}&(u/v)'>0,\quad(v''/u)'>0.
\end{array}
$$

The starting theta pair satisfies the first-form conditions. For its
first reduced pair $(n,b)$, the next conditions simplify to

$$
\boxed{(n/b)'>0,\qquad(n/\kappa)'<0\quad(t>0).}
$$

Neither of these two signs is proved for actual theta in this
checkpoint. Their exact equivalent is a nonempty pointwise flux band,
derived in [the coupled-kernel note](theta_second_kernel_structure_20261109.md).
That note also gives a positive Stein-kernel representation of n and
proves a limited obstruction: the natural second numerator or denominator
cannot reproduce the second response as a constant multiple of its
logarithmic derivative, even after multiplication by a rational function.

The next useful task is therefore to prove or refute these actual-theta
ratio signs, and, if they hold, identify an additional condition preserved
under the alternating recurrence. Positivity of the new kernels alone
does not prove that their derivative-ratio signs survive. A generic
kernel counterexample in PR #48 rules out automatic preservation from
the starting concavity hypotheses alone.

## 6. Reproduce and review

```bash
python -m pip install -r requirements.txt
python run_checks.py
```

The checks use exact symbolic and rational arithmetic. They verify
reduction identities, Schwarzian conversions, proof constants, both
pair recurrences, and explicit auxiliary reflection examples. They do
not rerun the external zero computation, prove unverified ratio signs,
or replace the analytic convergence and inequality arguments in the
notes. Captured output is in `checks_replay.json`.

Read [AUDIT.md](AUDIT.md) for established claims and limits,
[SOURCES.md](SOURCES.md) for primary references and fixed preceding
checkpoints, and `MANIFEST.json` for file hashes.

This checkpoint adds one research directory and one decision record.
Its baseline is main at `942ba1760c4ef54a519750ab91c37a661c31e0ce`.
