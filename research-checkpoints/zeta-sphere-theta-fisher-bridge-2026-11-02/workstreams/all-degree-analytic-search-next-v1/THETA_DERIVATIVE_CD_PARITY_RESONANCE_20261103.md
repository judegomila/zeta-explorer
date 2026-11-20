# Derivative cost: an exact quadratic benchmark, a parity obstruction, and a correlated theta source

## Result and scope

The actual complete-theta estimate `D_n=O(n^2)` remains unproved and
unrefuted. This note supplies three exact results relevant to that blocker.

1. For the exactly quadratic recurrence `b_k=C k^2`, the entire derivative
   row is explicit, and

   \[
   D_n=(n+1)^2\sum_{r=1}^{\lfloor n/2\rfloor}{1\over(2r+1)^2},
   \qquad {D_n\over n^2}\longrightarrow {\pi^2\over8}-1.
   \tag{1}
   \]

2. Positive recurrence coefficients satisfying even
   `b_k=k^2(1+O(1/k))` do **not** imply `D_n=O(n^2)`. An explicit rational
   parity perturbation has

   \[
   D_{2m}\ge {9\over32}(m+1)^2(3m+1)\qquad(m\ge1).
   \tag{2}
   \]

   Its Jacobi matrix has a square-summable zero mode. It is a recurrence
   countermodel, not a complete-theta source or a theta counterexample.

3. With the complete-theta source kept intact, the derivative cost has the
   division-free identity

   \[
   (n+1)^2+D_n={1\over\pi\sigma_n}
      \int_{\mathbb R}p_{n+1}(t)^2 f''(t)\,dt,
   \quad f=\Xi'^2-\Xi\Xi''.
   \tag{3}
   \]

   This gives the exact correlated payment formula (12) below, without
   dividing by `f`, assuming its sign, or normalizing by the next pivot.

All identities use the actual endpoint normalization. Neither (1) nor the
small relative recurrence error in the countermodel can be imported as a
theta asymptotic. No all-degree sign or RH claim is made.

## 1. Re-derivation of the endpoint normalization

Use `D=d/dh`, `widehat psi(t)=integral psi(h)exp(-ith)dh=2Xi(t)`, and the
complete modularly even profile

\[
 \psi(h)=\sum_{a\ge1}4z_a(2z_a-3)e^{h/2-z_a},
 \qquad z_a=\pi a^2e^{2h}\quad(h\ge0).
 \tag{4}
\]

Every orbit is retained. The reflection of the full Jacobi theta function,
not reflection of a finite orbit head, extends (4) evenly to the whole
line. Its decay justifies all differentiations and integrations below.

For a real monic polynomial `p` of fixed parity and degree `N`, put
`T(x)=i^N p(-ix)`, `g_a(h)=exp(ah)psi(h)`, and
`s_T(a)=integral h[T(D)g_a]^2dh`. At zero tilt `s_T(0)=0`, and the
commutator `T(D)h=hT(D)+T'(D)` gives

\[
 \sigma[T]=s_T'(0)=2\|hF\|_2^2+2\langle hF,K\rangle,
 \quad F=T(D)\psi,\quad K=T'(D)\psi.
 \tag{5}
\]

Write `W=widehat psi=2Xi`. Fourier transformation gives
`widehat F=i^N pW`, `widehat K=i^(N-1)p'W`; hence
`<hF,K>=-(2pi)^(-1)integral (pW)'p'W`. Substitution in (5), followed by
integration by parts, yields

\[
 \boxed{\sigma[T]={1\over2\pi}\int p^2(W'^2-WW'')
                  ={2\over\pi}\int p^2f.}
 \tag{6}
\]

In particular `sigma_0=2||h psi||_2^2`. The factor `2/pi` in (6) is not
`1/pi`; the latter is the normalization of a different target form in
`THETA_MOMENT_STRUCTURE_NEXT.md`. A common factor cancels from recurrence
ratios and derivative coefficients, but must be retained in source/payment
identities.

Define `B(u,v)=(2/pi)integral uv f`, whose full spectral cross-parity block
is zero. Under the actual positive prefix through degree `n`, let `p_j`
be its monic polynomials and `sigma_j=B(p_j,p_j)>0` for `j<=n`. The monic
`p=p_(n+1)` is defined by that prefix and obeys `B(p,q)=0` for every
`deg q<=n`; no sign of `B(p,p)` is assumed. The physical recurrence is

\[
 T_{j+1}=xT_j+b_jT_{j-1},\qquad
 b_j={\sigma_j\over\sigma_{j-1}}>0.
 \tag{7}
\]

The derivative of the next polynomial lies wholly in the known prefix.
The spectral and physical derivative expansion coefficients differ only
by alternating unit signs. Therefore

\[
 {B(p',p')\over\sigma_n}=(n+1)^2+D_n.
 \tag{8}
\]

For the actual path `T(x,a)`, coefficient motion at zero does not add a
term to (5): coefficients are even analytic in `a`; more generally Schur
stationarity kills the lower-degree coefficient-motion term.

## 2. A division-free complete-theta replacement

Since `p''` has degree at most `n-1`, old-data orthogonality gives
`B(p,p'')=0`. Twice integrating by parts gives

\[
 \int p^2f''=2\int(p'^2+pp'')f=2\int p'^2f.
 \tag{9}
\]

Combining (8)--(9) proves (3). In particular, the apparent degree-`2n+2`
integral against `f''` in (3) uses only moments of `f` through degree `2n`;
it is known-prefix data. No logarithmic derivative `f'/f` is introduced.
The arithmetic source can also be written

\[
 f''=\Xi''^2-\Xi\Xi^{(4)}.
 \tag{10}
\]

Let `F_n=T_n(D)psi` and
`Q_n=integral_0^infinity hF_n(h)^2dh`. The normalized modular defect is
`kappa_n=4n+D_n`, so (8) gives

\[
 \kappa_n={B(p',p')\over\sigma_n}-(n-1)^2.
 \tag{11}
\]

Consequently the exact strong-payment margin is

\[
 \boxed{
 \begin{split}
 \sigma_{n+1}-\kappa_nQ_n
 ={2\over\pi}\int p(t)^2
       \left[f(t)-{Q_n\over2\sigma_n}f''(t)\right]dt
       +(n-1)^2Q_n.
 \end{split}}
 \tag{12}
\]

Nonnegativity of the right side is a sufficient and necessary correlated
source condition for this particular payment. It is not proved here.
It keeps the new source and old derivative cost inside one weighted theta
integral. A separate pointwise positivity assertion about the bracket is
not supplied by positivity of `psi` or by its curvature bounds. The
unknown next moment remains in the `f` term, exactly where it should.

For the Gaussian comparison, `b_k=Ck` makes `p_(n+1)'=(n+1)p_n`, hence
`D_n=0`; formula (12) is still exact and does not repair its known
high-degree payment failure. Thus a small derivative tail alone is not
a payment theorem.

## 3. Full solution of the exactly quadratic recurrence

For `b_j=Cj^2`, the physical exponential generating function, obtained
directly from (7), is the formal identity

\[
 G(x,z)=\sum_{j\ge0}{T_j(x)\over j!}z^j
 ={\exp[(x/\sqrt C)\operatorname{artanh}(\sqrt C z)]
      \over\sqrt{1-Cz^2}}.
 \tag{13}
\]

Indeed `(1-Cz^2)G_z=(x+Cz)G`, and `G(x,0)=1`. Differentiating with respect
to `x` and comparing coefficients gives

\[
 T_{n+1}'=\sum_{r=0}^{\lfloor n/2\rfloor}
 { (n+1)!C^r\over(2r+1)(n-2r)!}T_{n-2r}.
 \tag{14}
\]

Since `sigma_j=sigma_0 C^j(j!)^2`, pivot normalization cancels both the
factorials and the scale:

\[
 d_{n,n-2r}={n+1\over2r+1}.
 \tag{15}
\]

This proves (1). The elementary comparison
`(2r+1)^2>4r(r+1)` also gives
`D_n<(n+1)^2/4`, without using an asymptotic approximation. This is the
physical version of the symmetric Meixner--Pollaczek model; the independent
standard generating function and recurrence are in
[DLMF 18.23.7](https://dlmf.nist.gov/18.23.E7) and
[DLMF 18.22.8](https://dlmf.nist.gov/18.22.E8). Equations (13)--(15) were
derived here rather than imported with a different normalization.

## 4. The center CD bound detects a parity resonance

The following is exact for **any** positive `b_j`. Set `sigma_0=1`, which
does not change `D_n`, and define

\[
 \Pi_m=\prod_{j=1}^m{b_{2j}\over b_{2j-1}},\qquad
 K_m=\sum_{j=0}^m\Pi_j^{-1},\qquad \Pi_0=1.
 \tag{16}
\]

Evaluation of (7) at zero gives
`T_(2j)(0)/sqrt(sigma_(2j))=Pi_j^(-1/2)`. Differentiating the odd
recurrence at zero gives, by induction,

\[
 {T_{2m+1}'(0)\over\sqrt{\sigma_{2m}}}=\sqrt{\Pi_m}K_m.
 \tag{17}
\]

This is the center specialization of the diagonal Christoffel--Darboux
identity. Subtract the top derivative component `(2m+1)T_(2m)` and apply
finite-dimensional Cauchy to its lower-degree expansion. The evaluation
vector has squared length `K_(m-1)`, so

\[
 \boxed{D_{2m}\ge
 {\{\Pi_mK_m-(2m+1)\}^2\over\Pi_mK_{m-1}}.}
 \tag{18}
\]

This bound is valid at an actual theta positive prefix too. It is an
additional necessary check on a proposed upper derivative theorem, not
an upper estimate or a theta asymptotic.

Now choose the explicit positive rational coefficients

\[
 b_{2j-1}=(2j-1)^2{j\over j+1},\qquad
 b_{2j}=(2j)^2{j+1\over j}.
 \tag{19}
\]

Both parity sequences satisfy `b_k=k^2(1+O(1/k))`. Put

\[
 A_m={4^m\over\binom{2m}{m}}.
 \]

The pair products telescope exactly:
`Pi_m=(m+1)^2 A_m^2`. The recurrence
`A_m/A_(m-1)=2m/(2m-1)` implies

\[
 A_m^2\ge3m+1.
 \tag{20}
\]

For an induction proof the cleared difference is exactly
`4m^2(3m-2)-(2m-1)^2(3m+1)=m-1>=0`. Also `A_m>=2` for `m>=1`,
`Pi_m>=4(m+1)^2>=4(2m+1)`, `K_m>=1`, and

\[
 K_m\le\sum_{j\ge0}{1\over(j+1)^2}\le2.
 \tag{21}
\]

Thus `Pi_m K_m-(2m+1)>=3Pi_m/4`; substituting in (18) proves (2).
In particular `D_(2m)/(2m)^2` diverges at least linearly. An `O(1/k)`
relative approximation to the quadratic recurrence is insufficient to
transfer (1); its parity correlation matters.

The countermodel is not silently promoted to a smooth theta source. For
its spectral Jacobi matrix, the zero-eigenvalue recurrence has the vector

\[
 v_{2m}=(-1)^m\Pi_m^{-1/2},\qquad v_{2m+1}=0.
 \tag{22}
\]

Equation (20) makes `sum |v_j|^2=K_infinity<infinity`. Truncating after
degree `2m` has Jacobi residual of size
`sqrt(b_(2m+1))/sqrt(Pi_m)=O(m^(-1/2))`, tending to zero. Hence (22)
lies in the closure of the Jacobi operator and is a genuine zero mode;
the associated positive spectral measure has an atom at zero. The actual
theta functional instead has the smooth signed density `(2/pi)f(t)dt`.
The model supplies no theta counterexample and does not meet that source
condition. Quantitative use of theta smoothness and complete-orbit
arithmetic to control (18) and the rest of the derivative row remains open.

## Reproduction and remaining obligation

The companion standard-library verifier uses exact rational arithmetic. It
checks derivative expansions against independently generated recurrence
polynomials, the quadratic formula, the general center-CD identity and
bound, the rational countermodel, the polynomial induction identity, and
an independent exact Gaussian integration-by-parts audit of (3) and (12).
The all-degree claims above follow from the displayed proofs; the finite
algebra replay is not an extrapolation of theta pivots. Frozen theta and
Gaussian-barrier source hashes are included in the receipt.

From the repository root run:

```text
python3 research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/src/verify_theta_derivative_cd_parity_resonance_20261103.py --root . --output research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/results/theta_derivative_cd_parity_resonance_20261103.json
```

The theta-specific upper `D_n=O(n^2)` and nonnegativity of (12) are both
unresolved. The known logarithmic parent localization does not compare its
positive metric with the signed inverse-selected prefix metric; the new
identity does not remove that conditioning problem. The complete-theta
orbit sum must remain assembled before the correlated source is estimated.
