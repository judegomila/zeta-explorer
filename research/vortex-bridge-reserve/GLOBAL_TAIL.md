# Global tail analysis for the vortex and bridge reserve

Research continuation for Jude Gomila — 21 October 2026

The infinite step remains open. This continuation proves that an off-line zero would force an infinite negative-response budget, isolates an exact arithmetic balance equivalent to RH, and bounds one entire infinite component of the prime-power losses. The uncontrolled component is the mixed jump cost after subtracting continuous recovery. No bound on that component is obtained here. These deductions are not claimed to be new to the literature.

The main target is now a uniform upper bound on

\[
H(T)=\sum_{\log n\le T}\frac{q_n\,v(\log n^-)_{-}}{a(\log n)}
-\int_{\log 2}^{T}g(t)\,dt,
\tag{1}
\]

where the sum is over prime powers, \(q_n=\Lambda(n)/\sqrt n\), \(x_-=\max(-x,0)\), and the quantities below are defined directly from the primes. The condition \(\sup_{T\ge\log2}H(T)<\infty\) is equivalent to RH. It allows a finite reserve deficit; it does not require every event reserve to be nonnegative.

## 1. Definitions and established input

Let \(F(w)=\xi(1/2+w)\), \(Z(w)=F'(w)/F(w)\), and

\[
\Psi(t)=A(t)-\sum_{n\le e^t}\frac{\Lambda(n)}{\sqrt n}(t-\log n),
\]
\[
A(t)=4(e^{t/2}+e^{-t/2}-2)+ct+C-J_2(t),
\quad J_j(t)=\sum_{k\ge0}\frac{e^{-(2k+1/2)t}}{(2k+1/2)^j},
\]
\[
c=\tfrac12(\psi(1/4)-\log\pi),\qquad C=\tfrac14\psi_1(1/4).
\]

The symbols \(\psi,\psi_1\) here denote digamma and trigamma, not the Chebyshev function. Suzuki [1] establishes the transform and zero sum

\[
\mathcal L\Psi(w)=\frac{Z(w)}{w^2}\quad(\Re w>1/2),\qquad
\Psi(t)=\sum_\gamma\frac{1-\cos(\gamma t)}{\gamma^2},
\tag{2}
\]

where \(\gamma\) runs over the zeros of \(\xi(1/2-iz)\), with multiplicities. The sum converges absolutely for each fixed t. The same paper proves \(\mathrm{RH}\iff\Psi\ge0\). Also, \(F(x)>0\) for real x: this follows, for example, from the positive theta integral. Thus \(Z(w)/w^2\) has no singularity on the positive real axis. These are inputs, not results of this continuation.

## 2. An off-line zero requires an infinite negative budget

Write \(N(t)=\Psi(t)_-\) and \(P(t)=\max(\Psi(t),0)\).

**Proposition 1.** For every \(\beta\ge0\),

\[
\int_0^\infty e^{-\beta t}N(t)\,dt<\infty
\quad\Longrightarrow\quad F(w)\ne0\text{ for }\Re w>\beta.
\tag{3}
\]

**Proof.** The assumed integral makes \(\mathcal LN\) holomorphic on \(\Re w>\beta\). Initially, for \(\Re w>1/2\),

\[
\mathcal LP(w)=Z(w)/w^2+\mathcal LN(w).
\]

Suppose the real abscissa of convergence \(\alpha\) of \(\mathcal LP\) exceeded \(\beta\). The right side is holomorphic near the positive real point \(w=\alpha\), because \(F(\alpha)>0\). This would analytically continue \(\mathcal LP\) across its real abscissa. That is impossible for the Laplace transform of a nonnegative function. Consequently \(\alpha\le\beta\), so both \(\mathcal LP\) and \(\mathcal LN\) are holomorphic in \(\Re w>\beta\). Their difference equals the meromorphic function \(Z(w)/w^2\) by continuation from \(\Re w>1/2\). A zero of F in this half-plane would give a nonremovable pole, a contradiction. ∎

The nonnegative-transform fact is the Landau–Widder argument used in Suzuki's proof [1, section 7.2]. Briefly, analytic continuation across a finite real abscissa would give a Taylor expansion from a nearby point whose disk reaches to its left. After reversing the real increment, its coefficients are nonnegative moments. Monotone convergence then identifies that series with the Laplace integral at a point left of the abscissa, contradicting its definition.

Two consequences are especially useful:

\[
\boxed{\mathrm{RH}\iff\int_0^\infty\Psi(t)_-\,dt<\infty.}
\tag{4}
\]

The forward implication has zero integrand; the reverse is (3) with \(\beta=0\), followed by the functional-equation symmetry. Even a finite amount of negative area would therefore force that area to be zero for this particular function. The theorem does not assert that the integral is finite.

Also,

\[
\boxed{\mathrm{RH}\iff\inf_{t\ge0}\Psi(t)>-\infty.}
\tag{5}
\]

Indeed, a constant bound on N makes its weighted integral finite for every \(\beta>0\). Equation (3) then excludes every zero with \(\Re w>0\). An eventual polynomial lower bound is sufficient by the same argument. These are equivalent global criteria for this fixed zeta response, although their inequalities look less restrictive than pointwise positivity.

### Quantitative interpretation

Let

\[
\Delta=\sup_{F(w)=0}|\Re w|,\qquad
M(T)=\int_0^T\Psi(t)_-\,dt.
\]

Then

\[
\boxed{\limsup_{T\to\infty}\frac{\log(1+M(T))}{T}=\Delta.}
\tag{6}
\]

To check the upper bound, the zero sum in (2), \(|\Im\gamma|\le\Delta\), and \(\sum|\gamma|^{-2}<\infty\) give \(|\Psi(t)|\le K e^{\Delta t}\). If \(\Delta>0\), this bounds M by a constant times \(e^{\Delta T}\). If \(\Delta=0\), RH gives M=0. For the lower bound, suppose the limsup were below \(\Delta\), and choose \(0<\beta<\Delta\) above it. Integration by parts, using the resulting exponential bound on M, gives \(\int e^{-\beta t}N(t)dt<\infty\). Equation (3) and symmetry contradict the definition of \(\Delta\).

Thus an off-line vortex at horizontal distance b requires cumulative negative area with exponential growth rate at least b in this limsup sense. It need not grow monotonically at that rate or obey a uniform lower exponential bound. The statement concerns a response of a fixed function, not motion of its zeros.

## 3. Exact reserve and quadratic reserve

For a prime power n, put \(t_n=\log n\),

\[
S_n=\sum_{m\le n}\frac{\Lambda(m)}{\sqrt m},\qquad
T_n=\sum_{m\le n}\frac{\Lambda(m)\log m}{\sqrt m}.
\]

If later jumps are suppressed, the continuation from this event is

\[
Q_n(u)=A(u)-uS_n+T_n,\qquad u\ge t_n.
\]

Define the exact reserve \(B_n=\min_{u\ge t_n}Q_n(u)\). Since A is strictly convex on this range and grows exponentially, the minimum exists and is unique: it is at \(t_n\) if \(A'(t_n)-S_n\ge0\), and otherwise at the unique solution of \(A'(u)=S_n\).

**Proposition 2.** Together with positivity on \([0,\log2]\),

\[
\mathrm{RH}\iff B_n\ge0\text{ for every prime power }n.
\tag{7}
\]

If all these reserves are nonnegative, the actual response equals \(Q_n\) until the next event, proving positivity everywhere. Conversely, under RH, for every \(u\ge t_n\),

\[
Q_n(u)=\Psi(u)+\sum_{n<m\le e^u}\frac{\Lambda(m)}{\sqrt m}(u-\log m)\ge0.
\]

Taking the minimum proves necessity. The initial interval is already covered by the accompanying certificate.

For \(t\ge t_0=\log2\), away from events, set

\[
v(t)=\Psi'(t),\qquad
a(t)=\Psi''(t)=e^{t/2}-\frac{e^{-t/2}}{e^{2t}-1}>0,
\]
\[
R(t)=\Psi(t)-\frac{v(t)_-^2}{2a(t)}.
\tag{8}
\]

At an event use the right derivative unless a left limit is specified. Here \(a'(t)>0\), so the constant-curvature quadratic continuation is a lower bound for \(Q_n\). Therefore \(B_n\ge R(t_n^+)\). Unlike the exact B criterion, pointwise nonnegativity of this quadratic R has only been shown sufficient.

**Proposition 3.** The following two weaker quadratic-reserve conditions are individually equivalent to RH:

\[
\inf_{t\ge t_0}R(t)>-\infty,
\qquad
\int_{t_0}^{\infty}R(t)_-\,dt<\infty.
\tag{9}
\]

For sufficiency, \(\Psi\ge R\) and continuity on the missing compact interval give (5) or (4), respectively. For necessity only, assume RH. The standard conditional prime estimate \(\psi_C(x)-x=O(\sqrt x\log^2x)\) [2], with \(\psi_C(x)=\sum_{n\le x}\Lambda(n)\), gives by partial summation

\[
S(e^t)=2e^{t/2}+O((1+t)^3),\qquad v(t)=O((1+t)^3).
\]

For example, the identity used is
\(S(x)=\psi_C(x)/\sqrt x+\tfrac12\int_1^x\psi_C(u)u^{-3/2}du\).
Because \(a(t)\ge(5/6)e^{t/2}\) and \(\Psi\ge0\) under RH,

\[
R(t)_-\le\frac{v(t)^2}{2a(t)}
=O((1+t)^6e^{-t/2}).
\]

This proves both necessity claims. Using that conditional prime estimate to prove the forward implication would be circular; it is used only to establish equivalence.

## 4. One infinite loss component is controlled

Between events, differentiation of (8) gives the nonnegative recovery rate

\[
g(t)=R'(t)=
\begin{cases}
v(t),&v(t)\ge0,\\
v(t)^2a'(t)/(2a(t)^2),&v(t)<0.
\end{cases}
\tag{10}
\]

At event n, \(v^+=v^- -q_n\), while \(\Psi\) and a are continuous. The exact reserve loss is

\[
L_n=\frac{(v^- -q_n)_-^2-(v^-)_-^2}{2a_n}.
\]

Let \(c_n=q_n(v^-)_-/a_n\) and \(d_n=q_n^2/(2a_n)\). A three-case check, according as \(v^-\le0\), \(0<v^-<q_n\), or \(v^-\ge q_n\), gives

\[
\boxed{c_n\le L_n\le c_n+d_n.}
\tag{11}
\]

At \(n\ge2\),

\[
a_n=\sqrt n\left(1-\frac1{n(n^2-1)}\right)\ge\frac56\sqrt n.
\]

Hence

\[
d_n\le\frac35\frac{\Lambda(n)^2}{n^{3/2}}
\le\frac35\frac{(\log n)^2}{n^{3/2}},
\qquad D_\infty:=\sum_n d_n<\infty.
\tag{12}
\]

For every integer \(N\ge4\), monotonicity of \((\log x)^2x^{-3/2}\) on \([N,\infty)\) and its elementary integral give the unconditional tail estimate

\[
\boxed{\sum_{n>N}d_n\le
\frac{3}{5\sqrt N}\left(2\log^2N+8\log N+16\right).}
\tag{13}
\]

The sum on the left is over prime powers, while the comparison integral bounds the sum over all integers. This is deliberately conservative and uses no zero-location assumption.

Define

\[
C(T)=\sum_{t_n\le T}c_n,\quad J(T)=\sum_{t_n\le T}L_n,
\quad G(T)=\int_{t_0}^{T}g(t)dt,
\quad R_0=R(t_0^-).
\]

The first event is included in both sums. The exact accounting identity is

\[
R(T)=R_0+G(T)-J(T).
\]

Since \(0\le J(T)-C(T)\le D_\infty\), putting \(H=C-G\) yields

\[
\boxed{R_0-H(T)-D_\infty\le R(T)\le R_0-H(T).}
\tag{14}
\]

Combining (14) with Proposition 3 proves

\[
\boxed{\mathrm{RH}\iff\sup_{T\ge t_0}H(T)<\infty.}
\tag{15}
\]

This is the exact infinite arithmetic step that has not been proved. Discarding G and trying to bound all mixed costs separately would impose a stronger condition than (15), unnecessarily losing recovery. The summability of D alone does not control H.

Standard unconditional prime estimates allow a downward slope of exponential size, approximately \(e^{t/2-c\sqrt t}\) at the level of available absolute bounds. They do not supply (15). Even inserting a polynomial slope bound into the absolute mixed-charge majorant \(c_n\ll\Lambda(n)(1+\log n)^k/n\) produces a divergent majorant. Cancellation against G must be preserved; divergence of a majorant is not proof that the actual mixed sum diverges.

## 5. Finite audit and reproducibility

`analyze_tail_budget.py` checks the hash of the existing interval leaves and recomputes the budget with outward rounding. It does not extend the numerical cutoff. At the last event, n=999983, the audit of all 78,734 prime-power events gives the following rounded values. Full interval endpoints are in `tail_budget.json`.

| Quantity | Approximate value |
|---|---:|
| Sum of diagonal allowances D through the cutoff | 1.803892461327 |
| Sum of mixed charges C | 0.545389138124 |
| Actual jump loss J | 1.140250060062 |
| Continuous recovery G | 1.113682618804 |
| Net mixed budget H=C−G | −0.568293480681 |
| Reserve after the last event | 0.036988144780 |

Equation (13), at N=1,000,000, bounds all remaining diagonal allowances by **0.304956449051** (rounded upward). In particular \(D_\infty<2.108848910378\). There is no corresponding certified infinite bound on H. Its negative finite value does not establish such a bound.

The script also encloses exact free-flight minima at three selected events. At n=3089, the quadratic reserve is about 0.027520380996, whereas the exact reserve is about 0.027520573354. This checks the expected improvement and its small size at that event; it does not certify the minimum exact reserve over all events.

Run:

```bash
python analyze_tail_budget.py
```

The audit verifies the telescoping budget and records its residual interval. It relies on the existing standard-library interval engine and previously certified leaves. It is not a proof-assistant verification of the implementation. The infinite theorems above are analytic arguments and do not depend on numerical extrapolation.

## 6. Consequence for the proposed mechanism

The vortex language now has a precise test: any off-line zero would force unbounded negative-response area, quantified by (6), and an unbounded-above net mixed budget H. An arithmetic relaxation theorem proving H bounded above would therefore exclude off-line zeros.

The twin-ladder representation does not by itself provide that theorem. Boundary losslessness, positivity of a real information metric, and finite verified reserves do not control the mixed charge/recovery correlation. A proof still needs a property specific to the actual prime sequence that establishes (15), or another independently proved global bound implying it. Re-labeling H as dissipated information would not establish its boundedness.

## References

1. Masatoshi Suzuki, *Aspects of the screw function corresponding to the Riemann zeta-function*, arXiv:2206.03682, especially Theorem 1.1, Theorem 1.7, and section 7.2. https://arxiv.org/abs/2206.03682
2. Ethan Simpson Lee and Paweł Nosal, *Sharper bounds for the error in the prime number theorem assuming the Riemann Hypothesis*, arXiv:2312.05628. Only the standard conditional order \(O(\sqrt x\log^2x)\) is used here. https://arxiv.org/abs/2312.05628

The finite certificate, the information-theoretic counterexample, and the local bridge defect remain in `REPORT.md`. This continuation supplies neither a proof of RH nor a new zero-free region.
