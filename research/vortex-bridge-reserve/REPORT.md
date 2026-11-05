# Vortices, information relaxation, and a prime-power reserve barrier

Research working note for Jude Gomila — 21 October 2026

**Status:** an exact arithmetic reduction, an obstruction to generic Fisher-information arguments, and a replayable finite scalar-positivity certificate. **No proof of RH, no improved zero-free region, and no global passive realization are claimed.** Novelty relative to all literature has not been established.

## What was achieved

1. Made the off-line-vortex obstruction quantitative, using an undivided bridge defect that remains meaningful at a zero.
2. Derived the exact information-theoretic inequality available from the positive theta density. Its uncontrolled term is a complex phase covariance, not a positive variance.
3. Gave a smooth, symmetric, strongly log-concave probability density whose transform has zeros inside the strip but away from its central line. This disproves a generic route from those information properties alone to zero confinement.
4. Recast Suzuki's scalar function as a continuously accelerated response with downward slope jumps at prime-power delays.
5. Derived an eventwise sufficient barrier and its exact recovery/jump balance. Verified the barrier at every prime-power event through one million using outward-rounded decimal intervals, and covered the entire intervening continuum analytically.

The successful finite statement is

\[
\Psi(t)>0\quad(0<t\le\log 10^6),\qquad \Psi(0)=0.
\]

Here **t is a logarithmic delay, not the height of a zeta zero**. This is a scalar family of tests; it is not positivity of the entire Weil form for all functions on the corresponding support.

## 1. Exact vortex obstruction

Put \(F(w)=\xi(1/2+w)\), \(w=x+iy\), and \(Z(w)=F'(w)/F(w)\). The horizontal modulus criterion is established prior work [1]; shifted-xi inner functions and canonical systems are established prior work [2]. These are not new RH criteria introduced by this note.

The proposed inward field requires \(x\Re Z(w)\ge0\) away from zeros. If \(F(w)=(w-w_0)^m g(w)\), where \(w_0=b+i\gamma\), \(b>0\), and \(g\) is nonzero near \(w_0\), then

\[
\Re Z(w_0-\epsilon)=-m/\epsilon+\Re(g'/g)(w_0-\epsilon).
\]

If \(|g'/g|\le M\) on an isolated-zero disk of radius r, choosing
\(0<\epsilon<\min(b,r,m/(2M))\) gives \(\Re Z\le-m/(2\epsilon)\). Interpret the last restriction as absent if M=0. Thus an off-axis zero necessarily creates outward horizontal motion nearby.

For a shift h, avoid dividing by F and define

\[
D_h(w)=|F(w+h)|^2-|F(w-h)|^2.
\]

For \(0<h<\min(b,r/2)\), the point \(w=w_0-h\) is in the right half-plane and

\[
D_h(w_0-h)=-|F(w_0-2h)|^2<0.
\]

In fact its size is
\(-|g(w_0)|^2(2h)^{2m}(1+O(h))\). This also quantifies a numerical difficulty: the undivided defect vanishes rapidly as h decreases, especially for multiple zeros. The isolation condition prevents the fixed-shift common-factor cancellation identified in the earlier project audit.

For fixed F these are statements about the field, not a dynamical law moving its zeros. A function-preserving change of representation cannot move its zeros.

## 2. The precise information-theory gap

The completed theta representation supplies a positive even probability density \(p_0\) with
\(F(w)/F(0)=\mathbb E_0 e^{wU}\). In the normalization used by the diagnostic code,

\[
f(u)=\sum_{n\ge1}(4\pi^2n^4e^{9u/2}-6\pi n^2e^{5u/2})e^{-\pi n^2e^{2u}},
\quad u\ge0,
\]
\[
F(w)=2\int_0^\infty f(u)\cosh(wu)\,du,
\qquad p_0(u)=f(|u|)/F(0).
\]

For real x, define \(p_x(u)=e^{xu}p_0(u)/(F(x)/F(0))\),
\(\mu_x=\mathbb E_x U\), \(I_x=\operatorname{Var}_x U\), and
\(\phi_x(y)=\mathbb E_x e^{iyU}\). Then

\[
F(x+iy)=F(x)\phi_x(y),\qquad
\Re Z(x+iy)=\mu_x+\Re\frac{\partial_x\phi_x(y)}{\phi_x(y)}.
\]

The derivative is the **complex covariance**
\(\partial_x\phi_x=\mathbb E_x[(U-\mu_x)e^{iyU}]\). Cauchy--Schwarz gives

\[
|\partial_x\phi_x|^2\le I_x(1-|\phi_x|^2),
\]
and therefore, wherever \(\phi_x\ne0\),

\[
\Re Z(x+iy)\ge\mu_x-
\sqrt{I_x}\frac{\sqrt{1-|\phi_x(y)|^2}}{|\phi_x(y)|}.
\]

The lower bound becomes ineffective when phase cancellation makes \(|\phi_x|\) small. Positive real Fisher information does not fix the sign of the complex covariance.

An actual-xi floating-point diagnostic at \(x=0.1\), \(y\simeq14.1347251417\) gives:

| Quantity | Diagnostic value |
|---|---:|
| \(\mu_x\) | 0.0046209243 |
| \(I_x\) | 0.0462077560 |
| \(|\phi_x(y)|\) | 0.0002781754 |
| \(\Re Z(x+iy)\) | 10.0067677 |
| Cauchy--Fisher lower bound | -772.7449229 |

These values are illustrative, not interval certificates. An independent Euler--Maclaurin evaluation cross-checks the theta evaluation; the worst relative difference across 21 selected samples is approximately \(3.1\times10^{-9}\).

### A rigorous counterexample to the generic mechanism

Let b=1/5, c=cosh(b), and let U=M+G, where G is a centered Gaussian of variance v=2, independent of M, with

\[
\Pr(M=0)=\frac{c}{c+1},\qquad
\Pr(M=\pm1)=\frac1{2(c+1)}.
\]

Its moment-generating function is

\[
M_U(w)=e^{w^2}\frac{c+\cosh w}{c+1}.
\]

This distribution is positive, smooth, even, and strongly log-concave. Indeed, for its density p,

\[
(\log p)''(u)=-1/v+\operatorname{Var}(M\mid U=u)/v^2\le-1/4,
\]

because M lies in [-1,1]. Its real tilted Fisher information is at least v=2. Nevertheless its zeros are exactly

\[
w=\pm1/5+(2k+1)\pi i,\qquad k\in\mathbb Z.
\]

Its shifted quotient also has unit modulus on the imaginary axis wherever defined. Thus positivity, symmetry, strong log-concavity, real Fisher positivity and boundary losslessness do not suffice for confinement. This is **not a counterexample to RH**: the distribution lacks the zeta arithmetic. The Gaussian-smoothed transform has order two. Removing the Gaussian factor gives an order-one positive-measure counterexample, but then the measure is discrete rather than a smooth strongly log-concave density.

## 3. A scalar arithmetic target with no assumed zero locations

The following input is Suzuki's established construction and theorem [3], with notation translated to w. Define, for t>0,

\[
\Psi(t)=A(t)-\sum_{n\le e^t}\frac{\Lambda(n)}{\sqrt n}(t-\log n),
\]
\[
A(t)=4(e^{t/2}+e^{-t/2}-2)+ct+C-J_2(t),
\]
\[
c=\tfrac12\big(\psi(1/4)-\log\pi\big),\quad
C=\tfrac14\psi_1(1/4),\quad
J_j(t)=\sum_{k\ge0}\frac{e^{-(2k+1/2)t}}{(2k+1/2)^j}.
\]

The c in this section is unrelated to the counterexample's c. Extend Psi continuously with Psi(0)=0. Its Laplace transform satisfies

\[
\int_0^\infty e^{-wt}\Psi(t)\,dt=\frac{Z(w)}{w^2},\qquad \Re w>1/2.
\]

Suzuki proves that \(\Psi(t)\ge0\) for every t is equivalent to RH. This is not an inference that a positive Laplace integrand automatically makes \(w^2\mathcal L\Psi\) positive-real. The converse uses the singularity theorem for Laplace transforms of nonnegative functions and the absence of xi zeros on the positive real w-axis. Once RH follows, the global bridge and logarithmic-field positivity follow.

At finite support, Psi tests only the triangular Weil function \((t-|u|)_+/2\), an autocorrelation of a rectangle. Finite positivity of this family is weaker than positivity for all compactly supported test functions.

## 4. Eventwise dynamics and a sufficient reserve barrier

Let \(t_n=\log n\) for prime powers \(n=p^k\), and put \(q_n=\log p/\sqrt n\). Direct differentiation gives, between events,

\[
\Psi''(t)=a(t):=e^{t/2}-\frac{e^{-t/2}}{e^{2t}-1}.
\]

At each event Psi is continuous and

\[
\Psi'(t_n^+)-\Psi'(t_n^-)=-q_n.
\]

The function a is strictly increasing for t>0. In particular a(t)>0 for t>=log 2. Thus the response accelerates upward between events, while a prime power gives a downward slope jump. This is an auxiliary arithmetic evolution in log delay, not motion of zeta zeros or a demonstrated thermodynamic process.

Set \(E_n=\Psi(t_n)\), \(v_n=\Psi'(t_n^+)\), \(a_n=a(t_n)\), and define

\[
\boxed{\mathcal R_n=E_n-\frac{(\min(v_n,0))^2}{2a_n}.}
\]

**Finite-gap lemma.** Until the next prime-power event, for h>=0,

\[
\Psi(t_n+h)\ge E_n+v_nh+\tfrac12a_nh^2\ge\mathcal R_n.
\]

The first inequality follows by integrating \(\Psi''\ge a_n\); the second minimizes a quadratic over h>=0. Therefore positive reserve at an event certifies the entire next gap. In particular, nonnegative reserves at **all** prime powers, combined with initial positivity on [0,log 2], would prove RH.

This reserve condition is sufficient; necessity has not been proved. A negative reserve would mean failure of this lower bound, not necessarily negative Psi or failure of RH.

### Exact recovery and loss identities

For t>=log 2 away from events, define
\(\mathcal R(t)=\Psi(t)-(\min(\Psi'(t),0))^2/(2a(t))\). Then

\[
\mathcal R'(t)=
\begin{cases}
\Psi'(t),&\Psi'(t)\ge0,\\
\dfrac{\Psi'(t)^2a'(t)}{2a(t)^2},&\Psi'(t)<0.
\end{cases}
\]

Both are nonnegative. At a prime-power event, writing v for the left slope,

\[
\mathcal R(t_n^+)-\mathcal R(t_n^-)
=-\frac{\min(v-q_n,0)^2-\min(v,0)^2}{2a_n}\le0.
\]

Hence the reserve recovers between prime powers and is consumed at prime powers. The missing global theorem is that the arithmetic consumption never exhausts it. Positive recovery alone does not imply this.

### Entirely finite arithmetic at each event

Define

\[
S_n=\sum_{p^k\le n}\frac{\log p}{\sqrt{p^k}},\qquad
T_n=\sum_{p^k\le n}\frac{(\log p)\log(p^k)}{\sqrt{p^k}}.
\]

Then

\[
E_n=A(\log n)-(\log n)S_n+T_n,\qquad
v_n=A'(\log n)-S_n,
\]

and the sufficient global target becomes

\[
\boxed{
2a(\log n)\big[A(\log n)-(\log n)S_n+T_n\big]
\ge \big[S_n-A'(\log n)\big]_+^2
\quad\text{for every prime power }n.
}
\]

This is the specific arithmetic inequality obtained by the present attempt. It has not been proved for all n.

There is also an exact, necessary-and-sufficient event-minimum formulation. In a gap, S_n and T_n are constant and A' is strictly increasing. The minimum is at the left endpoint, right endpoint, or unique interior point satisfying A'(t)=S_n. Nonnegativity of these minima for every gap, plus the initial segment, is exactly global Psi positivity. The reserve avoids solving these minimization problems and yields conservative enclosures.

## 5. Finite certificate and reproducibility

`verify_reserve.py` uses only the Python standard library. The default run:

```bash
python verify_reserve.py --limit 1000000
```

recomputes all prime powers, constants, elementary-function intervals, positive-series tails, and event margins. It writes every event enclosure to `certificate/reserve_leaves.csv` and a summary with its SHA-256 to `certificate/certificate.json`.

| Certified quantity | Result |
|---|---:|
| Integer prime-power cutoff | 1,000,000 |
| Prime-power events processed | 78,734 |
| Minimum event reserve lower bound | > 0.0275203809960894403274437621197 |
| Event attaining the smallest lower bound | 3089 |
| Maximum event-energy interval width | < 2.573e-34 |
| Decimal precision | 50 digits |
| Additional interval-enclosure checks | 5,100 exact-rational checks passed |

The final event-to-cutoff interval is also covered: no further prime power lies below the cutoff, and the same quadratic bound applies throughout the remainder.

### Initial segment

For 0<t<=1/10, the verifier uses that \((1-e^{-\lambda t})/t\) is decreasing in t. Keeping 100 positive summands and dropping the nonnegative cosh term gives
\(\Psi(t)\ge\beta t\), with a certified \(\beta>0.4062210563\). From 1/10 through log 2, 64 interval boxes enclose A(t) strictly above zero. There are no prime contributions before log 2; the prime-2 term is zero at the endpoint.

### Numerical enclosure details

- Basic decimal operations round outward. Correctly rounded logarithms, exponentials, and square roots are widened by one representable value on each side.
- Pi is enclosed by Machin's identity and alternating arctangent series.
- Digamma and trigamma at 1/4 are shifted to 64+1/4. Euler--Maclaurin is used through B20, with a conservative remainder bounded by the magnitude of the last included term. The recurrences are then applied back to 1/4. References [4,5] give the expansions and recurrences. The remainder bound also follows directly from the sup norm of the periodic Bernoulli polynomial in the Euler--Maclaurin integral remainder.
- For J_j, the positive tail after K terms is at most
  \(e^{-(2K+1/2)t}/[(2K+1/2)^j(1-e^{-2t})]\).
- At t=log n, exponentials simplify to sqrt(n) and powers of 1/n^2. The certificate uses these elementary expressions, without evaluating any zeta zeros.
- `check_interval_engine.py` compares the interval arithmetic to exact rational calculations. This is additional validation, not a formal proof assistant verification of Python or the decimal runtime.

`diagnostics.py` requires NumPy, SciPy and Matplotlib. It generates the separate floating-point Fisher comparison, counterexample checks and plot. Those diagnostic calculations are not used by the interval certificate.

## 6. What still prevents a proof

The infinity step remains. Neither a positive theta density, a lossless boundary quotient, a positive finite oscillator Hamiltonian, nor positive reserve in a finite range bounds the cumulative prime-power losses for every event.

An induction on events needs a prime-specific inequality controlling the jump cost relative to recovered reserve. The exact balance above exposes that requirement; it does not establish it. Absolute-value bounds on the prime terms discard the cancellation responsible for the small response.

Do not extrapolate the observed margin 0.0275 to an infinite uniform margin. Under RH the absolutely and uniformly convergent cosine representation of Psi has arbitrarily late returns arbitrarily close to zero: approximate the phases of finitely many zeros simultaneously, and bound the remaining tail. This recurrence argument does not require linear independence to approximate the all-zero phase vector. Since the reserve is at most Psi, a strictly positive uniform reserve for all late times is not the right global target.

The useful next theorem would establish the boxed event inequality, or the weaker exact gap-minimum condition, uniformly in n from arithmetic. It must allow the lower margin to approach zero. This note supplies a computable target and a finite verifier; it does not supply that uniform theorem.

## References and provenance

1. J. Sondow and C. Dumitrescu, *A monotonicity property of Riemann's xi function and a reformulation of the Riemann Hypothesis* (2010), https://arxiv.org/abs/1005.1104.
2. M. Suzuki, *A canonical system of differential equations arising from the Riemann zeta-function*, https://arxiv.org/abs/1204.1827.
3. M. Suzuki, *Aspects of the screw function corresponding to the Riemann zeta-function*, https://arxiv.org/abs/2206.03682, especially (1.1), Theorem 1.1, Theorem 1.7 and section 7.2. The scalar function and its RH equivalence are imported established results, not claimed as new.
4. NIST DLMF, section 5.11, https://dlmf.nist.gov/5.11.
5. NIST DLMF, section 5.15, https://dlmf.nist.gov/5.15.

The user's `twin_ladder_v72_publishability_assessment.md` was read to avoid re-presenting the known shifted quotient as a new discovery and to preserve the common-factor and signed-interference cautions. Claims about other 2026 manuscripts in that assessment were not independently audited and are not relied upon here. No repository was changed in this task.
