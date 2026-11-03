# The actual complete-theta `(2,0)` two-generator condition

## Scope and result

This note closes the fixed complete-theta condition left open in
`NEXT_EVEN_THETA_SOBOLEV_OBSTRUCTION_NEXT.md`.  It uses the actual signed
Galerkin residual

\[
 q(t)=t^4+at^2+b
\]

at `(N,epsilon)=(2,0)`, together with complete all-orbit enclosures for the
six positive moments needed by the two-generator auxiliary.  Outward Arb
interval arithmetic proves

\[
 \Delta>2.7040265\,10^{11},\qquad
 \mathcal N(a,b)>8.4587242\,10^{14},
\]

in the half-line moment normalization below.  Consequently the actual
two-generator margin and the actual `(2,0)` pivot are strictly positive.

This is a proof of one fixed theta rung.  It is not a coefficient-free
theorem for arbitrary `(a,b)`, a higher-rung or all-degree theorem, the first
Xi--Laguerre theorem, or RH.

## 1. The signed target normalization and actual residual

The frozen target certificate
`evidence/v18-curated/core_inertia_v2/actual_total_certificate.json` stores

\[
 \mu_j=4^j\mathsf M_j,
\]

not a common rescaling of the signed moments.  The factor `4^j` is the
reflected-identity normalization proved in `ACTUAL_REPAIR_PROOF.md`.  Each
serialized decimal interval is first expanded by

\[
 10^{-90}(1+|\ell|+|r|)
\]

with outward arithmetic, as required by that proof, and only then divided by
`4^j`.  This normalization is essential: using the archived rows directly as
the `mathsf M_j` would construct the wrong residual.

For

\[
 \mathfrak d=\mathsf M_0\mathsf M_2-\mathsf M_1^2,
\]

the verifier proves `mathsf M_0>0` and

\[
 \mathfrak d>
 0.2666863971853900632658201981962868008.
\]

Thus the old signed block is positive definite.  Solving its Galerkin system
in the stipulated `(b,a)` order gives

\[
 a={\mathsf M_1\mathsf M_2-\mathsf M_0\mathsf M_3\over\mathfrak d},
 \qquad
 b={\mathsf M_1\mathsf M_3-\mathsf M_2^2\over\mathfrak d}.
\]

The certified actual coefficient pair is

\[
\begin{aligned}
 -68.8737711164111492106339765142
 &<a<
 -68.8737711164111492042035609112,\\
 401.195664126047806528802576629
 &<b<
 401.195664126047806596197211440.
\end{aligned}
\]

No positive surrogate moment problem is used to choose these coefficients.

## 2. Complete positive moments without orbit truncation

Let

\[
 n_j=\int_0^\infty |\psi^{(j)}(h)|^2\,dh
 \qquad(0\le j\le5).
\]

On the positive half-line the full Jacobi source is retained as

\[
 \psi^{(j)}(h)=4e^{h/2}\sum_{r\ge1}P_j(z_r)e^{-z_r},
 \qquad z_r=\pi r^2e^{2h}.
\]

The verifier evaluates the complete Gram of the first two orbits—both
diagonal terms and their cross term—by rigorous incomplete-gamma Arb
enclosures.  Every orbit `r>=3` remains present through an analytic norm
bound.  For orders zero through four this is the frozen bound in
`verify_next_odd_theta.py`.  For order five the exact recurrence gives

\[
 P_5(z)=-{9375\over32}z+{142935\over16}z^2
 -{126121\over4}z^3+30510z^4-10720z^5+1456z^6-64z^7.
\]

Pairing consecutive terms proves

\[
 -64z^7<P_5(z)<0\qquad(z\ge27),
\]

and `27<9*pi`.  The orbit-ratio estimate

\[
 (4/3)^{13}e^{-7\pi}<1/2
\]

then bounds the whole order-five tail.  If `F` is the first-two-orbit sum
and `R` is the remaining infinite tail, the enclosing radius is

\[
 2\|R\|\,\|F\|+\|R\|^2.
\]

Therefore this is an all-orbit proof, not a finite theta-orbit substitution.
The resulting intervals imply the following convenient outward boxes:

\[
\begin{array}{c|c}
j&n_j\\ \hline
0&(0.6395036226,\ 0.6395036248)\\
1&(6.5277744550,\ 6.5277748400)\\
2&(191.6371216,\ 191.6372419)\\
3&(8973.2404,\ 8973.2880)\\
4&(563469.09,\ 563490.85)\\
5&(43917265,\ 43928372).
\end{array}
\]

The frozen JSON receipt records substantially more digits, the first-two
Gram enclosure, and the all-remaining-orbits norm bound for every order.

## 3. The correlated numerator

The original full-line positive moments in
`NEXT_EVEN_THETA_SOBOLEV_OBSTRUCTION_NEXT.md` are

\[
 m_j=2\pi\|\psi^{(j)}\|_{L^2(\mathbb R)}^2=4\pi n_j.
\]

It is enough to evaluate with `n_j`, since the common scaling gives

\[
 \Delta[m]=(4\pi)^2\Delta[n],\qquad
 \mathcal N[m]=(4\pi)^3\mathcal N[n],\qquad
 \mathcal H[m]=4\pi\mathcal H[n].
\]

Using the exact definitions

\[
\begin{aligned}
A&=4a^2n_1+16an_2+16n_3,\\
B&=2abn_0+14an_2+(2a^2+12b)n_1+12n_3,\\
C&=b^2n_0+2abn_1+(a^2+2b)n_2+2an_3+n_4,\\
D&=b^2n_1+2abn_2+(a^2+2b)n_3+2an_4+n_5,\\
E&=2abn_1+(2a^2+4b)n_2+6an_3+4n_4,\\
\Delta&=AD-E^2,\qquad
u=-{A+B\over2},\qquad v=-{C+2E\over2},\\
\mathcal N&=Du^2-2Euv+Av^2+u\Delta,
\end{aligned}
\]

the verifier evaluates the single combined expression with outward interval
operations.  It does not substitute midpoints, infer the sign
coefficient-by-coefficient, or replace the actual pair `(a,b)` by an
independent box sample.  Dependency overestimation is retained, so every
reported interval remains an enclosure.  The certified bounds are

\[
\begin{aligned}
 2.704026596843609\,10^{11}
 &<\Delta[n]<2.712840361613610\,10^{11},\\
 8.458724288280467\,10^{14}
 &<\mathcal N[n]<8.760541277566868\,10^{14},\\
 3118.032444000244
 &<\mathcal H[n]<3239.813289642334,\\
 39182.35127475381
 &<\mathcal H[m]<40712.69452312113.
\end{aligned}
\]

In particular `A>0`, `Delta>0`, and the numerator is strictly positive.

## 4. Strict implication for the actual pivot

The exact two-generator square identity is

\[
 2\pi\mathcal S_{2,0}
 =\min_{\alpha,\beta}
 \int_{\mathbb R}
 \{qW'+(\alpha q'+\beta tq)W\}^2dt
+\mathcal H_{2,0}.
\]

The square is nonnegative and the preceding all-orbit certificate gives
`mathcal H_(2,0)>0`.  Hence

\[
 \boxed{\mathcal S_{2,0}>0}.
\]

This uses only the old signed moments through `mathsf M_3` to construct the
actual residual; it does not insert the new target pivot into its own proof.

## 5. Frozen replay and audit

From the checkpoint root, replay with the installed Arb Python environment:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_actual_even_theta.py --checkpoint-root . --output workstreams/all-degree-analytic-search-next-v1/results/actual_even_theta_sobolev.json
```

The bounded verifier uses no network, numerical quadrature, sampling grid,
or finite-orbit substitution.  It performs six fixed derivative-order
enclosures and one fixed correlated evaluation.  The receipt records Python
`3.14.10`, python-flint `0.9.0`, 300-bit Arb precision, the verifier and
substantive input hashes, and the replay command.

Frozen hashes are:

```text
b6abc6a65fb737fff1555e7982e7f729018e464ccf9d7c3fe84415b4be600473  src/verify_actual_even_theta.py
009d845f3c67642c27a053f459b781b09a46aa8485bf0318374325abc3daacb7  results/actual_even_theta_sobolev.json
5895805983109489b16dc41954dca6936903c5747c46290ed0eb5b78560ea67e  canonical receipt payload before self-hash
```

An independent audit replayed the receipt byte-for-byte at 300 bits, repeated
the calculation at 420 bits, and separately evaluated conservative decimal
boxes with a second interval implementation.  All three checks retained the
strict signs of `Delta`, `mathcal N`, and `mathcal H`.

The generic Gaussian counterexample in
`NEXT_EVEN_THETA_SOBOLEV_OBSTRUCTION_NEXT.md` remains valid.  The present
positive result depends on the actual theta target moments and the full
Jacobi-orbit arithmetic; it does not revive the generic positivity route.
