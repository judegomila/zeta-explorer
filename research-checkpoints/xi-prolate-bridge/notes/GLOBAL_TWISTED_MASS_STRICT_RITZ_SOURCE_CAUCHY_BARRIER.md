# Global twisted-mass strict-Ritz source-Cauchy barrier

## 0. Exact outcome and claim boundary

The global target-compatible cone

\[
 w_n=(-1)^n\xi_n>0\quad(-N\leq n\leq N)          \tag{0.1}
\]

does not combine with the two strict lower-Ritz sector signs and the exact
source-Cauchy displacement to give a dimension-uniform bound for
`a/p`, where

\[
 a=\sum_{n=-N}^{N}w_n,
 \qquad p=\langle V_0,\Phi\rangle=\xi_0.          \tag{0.2}
\]

There is an exact growing family, indexed by even `N`, for which `Q` is a
real inversion-symmetric source-Cauchy matrix, `Q` is positive semidefinite
with a simple boundary-normalized even ground `Phi`, every twisted ground
weight is strictly positive, and both genuine shifted-sector signs hold
with a uniform margin greater than `8459`.  Nevertheless,

\[
 \boxed{{a_N\over p_N}\longrightarrow+\infty.}   \tag{0.3}
\]

The construction is stronger than a near-collision example.  With a fixed
choice `epsilon=1/100`, every nonzero quotient root stays exactly `epsilon`
from its nearest lattice pole.  Conversely, allowing `epsilon` to tend to
zero preserves the strict signs, so the same hypotheses also force no
positive dimension-uniform root-to-pole clearance.

This is a structural source-Cauchy counterfamily with anchor `kappa=V_0`.
It is not an actual prime-power matrix and is not a ground of the pinned
arithmetic family.  It proves no failure of the actual global twisted cone,
actual strict signs, actual ground convergence, actual `a_mu/p_mu` bound,
actual response decay or nondecay, determinant convergence, zero statement,
Riemann hypothesis, converse from RH, or de Bruijn--Newman `Lambda` bound.
The formal state remains `P0_INVALIDATED`; the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `tests/test_source_boundary.py` | `a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808` |
| `notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md` | `9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13` |
| `tests/test_source_quotient_pick_herglotz_interlacing_barrier.py` | `86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658` |
| `notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md` | `9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c` |
| `tests/test_growing_retained_negative_index_capture_barrier.py` | `1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa` |
| `notes/NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md` | `a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2` |
| `tests/test_normalized_source_quotient_response_barrier.py` | `8bafeff220c3193e9dcd5b511db011e3df565fe1b773878f88f435be687f7026` |
| `notes/OPPOSITE_BOUNDARY_TWISTED_WEYL_SOURCE_QUOTIENT_BARRIER.md` | `a6b21ec0048f632d67ff32f116291e011f66b5c1a168df12442cac19d33c2258` |
| `tests/test_opposite_boundary_twisted_weyl_source_quotient_barrier.py` | `5b368373194720eb8a332475c21425dace632678975127c7bbfdb94f863382d2` |

The source-boundary and source-quotient pairs fix the displacement and
characteristic-polynomial conventions.  The retained-negative-index pair
fixes the finite discrete Hilbert multiplier bound.  The checkpoint-1.29 and
checkpoint-1.30 pairs fix the normalized response, genuine lower-Ritz
signs, twisted cone, and stopping question.  No external theorem, numerical
artifact, zero table, RH premise, or actual arithmetic ground is imported.

## 2. Exact roots, ground normalization, and global cone

Fix an even integer `N>=2` and initially let `0<epsilon<=1/100`.  Put

\[
 \rho_k=k+(-1)^{k+1}\epsilon\quad(1\leq k\leq N),
 \qquad
 q_N(s)=\prod_{j=-N}^{N}(s-j),                    \tag{2.1}
\]

and

\[
 P_N(s)=-\prod_{k=1}^{N}(s^2-\rho_k^2),
 \qquad
 \xi_n=-{P_N(n)\over q_N'(n)}\quad(-N\leq n\leq N).
                                                               \tag{2.2}
\]

Then

\[
 h_N(s):={P_N(s)\over q_N(s)}
 =\sum_{n=-N}^{N}{\xi_n\over n-s}.                \tag{2.3}
\]

Both sides of (2.3) have the same residues.  Their leading term at infinity
is `-1/s`; hence

\[
 \xi_{-n}=\xi_n,
 \qquad
 \sum_{n=-N}^{N}\xi_n=1.                         \tag{2.4}
\]

The positive roots occur in pairs

\[
 2j-1<\rho_{2j-1}<\rho_{2j}<2j
 \quad(1\leq j\leq N/2).                         \tag{2.5}
\]

Thus an even number of positive roots lies below each retained positive
integer.  Since `N` is even, `P_N(n)<0` at every lattice node.  Also

\[
 q_N'(n)=(-1)^n(N+n)!(N-n)!,                     \tag{2.6}
\]

so

\[
 \boxed{
 w_n=(-1)^n\xi_n
 ={-P_N(n)\over (N+n)!(N-n)!}>0.}                \tag{2.7}
\]

In particular `p_N=xi_0=w_0>0`.  The roots in (2.5) have the constant-sign
lattice samples and even root allocation predicted by the twisted-cone
analysis; they do not have ordinary one-root-per-gap interlacing.

## 3. Positive source-Cauchy Gram matrix

For a real number `r` outside the lattice, define

\[
 v(r)_n={1\over n-r},\qquad -N\leq n\leq N,      \tag{3.1}
\]

and set

\[
 Q_N=\sum_{k=1}^{N}
 \bigl(|v(\rho_k)\rangle\langle v(\rho_k)|
      +|v(-\rho_k)\rangle\langle v(-\rho_k)|\bigr).
                                                               \tag{3.2}
\]

This is real, inversion symmetric, and positive semidefinite.  Equation
(2.3) gives

\[
 \langle v(\rho_k),\Phi_N\rangle=h_N(\rho_k)=0,
 \qquad
 \langle v(-\rho_k),\Phi_N\rangle=h_N(-\rho_k)=0. \tag{3.3}
\]

The `2N` Cauchy columns at the distinct nodes `+-rho_k` are linearly
independent.  They span `Phi_N^perp`, so

\[
 Q_N\succeq0,
 \qquad \ker Q_N=\mathbb R\Phi_N.                \tag{3.4}
\]

This is an exact source-Cauchy matrix, not merely a matrix with a convenient
kernel.  Define the odd source row

\[
 b_n=-\sum_{k=1}^{N}
 \left({1\over n-\rho_k}+{1\over n+\rho_k}\right).
                                                               \tag{3.5}
\]

For `n!=m`, direct subtraction gives

\[
 \begin{split}
 (n-m)(Q_N)_{nm}
 &=\sum_{k=1}^{N}\left(
 {1\over m-\rho_k}-{1\over n-\rho_k}
 +{1\over m+\rho_k}-{1\over n+\rho_k}\right)\\
 &=b_n-b_m.
 \end{split}                                      \tag{3.6}
\]

Therefore

\[
 [D,Q_N]=|b\rangle\langle\eta|
          -|\eta\rangle\langle b|,
 \qquad b_{-n}=-b_n.                              \tag{3.7}
\]

The diagonal in (3.2) is even, so (3.7) preserves the complete frozen
source-displacement identity and inversion form.

## 4. Uniform genuine lower-Ritz margins

Use the normalized parity bases and let `E_N` and `O_N` be the even and odd
blocks of `Q_N`.  Let `A_N` be the positive-mode anchor complement of the
`V_0` row in `E_N`.  For `1<=n,k<=N`, put

\[
 F_{nk}={\rho_k\over n^2-\rho_k^2},
 \qquad
 G_{nk}={n\over n^2-\rho_k^2}.                   \tag{4.1}
\]

The paired Cauchy columns give the exact Gram identities

\[
 A_N=4F F^*,
 \qquad O_N=4G G^*.                               \tag{4.2}
\]

These matrices have a dimension-free lower bound.  Define

\[
 H_{nk}={1\over n-\rho_k},
 \qquad K_{nk}={1\over n+\rho_k}.
                                                               \tag{4.3}
\]

Then `F=(H-K)/2` and `G=(H+K)/2`.  Write

\[
 H=D_\epsilon+H_0+R,
 \qquad
 (D_\epsilon)_{nn}={1\over n-\rho_n},
 \qquad |(D_\epsilon)_{nn}|={1\over\epsilon},   \tag{4.4}
\]

where `(H_0)_{nk}=1/(n-k)` off the diagonal and zero on it.  Its Fourier
multiplier is `i(theta-pi)` on `0<theta<2pi`, so its norm is at most `pi`.
For `K`, the Schur weight `(n-1/2)^(-1/2)` and the elementary integral
`integral_0^infinity t^(-1/2)/(x+t) dt=pi/sqrt(x)` give the same bound.
Together with the Schur test for `R`, this gives

\[
 \|H_0\|\leq\pi,
 \qquad
 \|R\|\leq{\epsilon\pi^2\over3(1-\epsilon)},
 \qquad
 \|K\|\leq\pi.                                  \tag{4.5}
\]

Indeed,

\[
 |R_{nk}|\leq{\epsilon\over1-\epsilon}{1\over(n-k)^2}
 \quad(n\ne k),
 \qquad
 0<K_{nk}\leq{1\over n+k-1}.                    \tag{4.6}
\]

It follows that

\[
 \sigma_{\min}(F),\ \sigma_{\min}(G)
 \geq L_\epsilon:={1\over2\epsilon}-\pi
       -{\epsilon\pi^2\over6(1-\epsilon)}.       \tag{4.7}
\]

For `epsilon=1/100`, the elementary bound `pi<22/7` yields

\[
 L_{1/100}>46,
 \qquad
 \lambda_{\min}(A_N),\lambda_{\min}(O_N)
 \geq4L_{1/100}^2>8464.                           \tag{4.8}
\]

It remains to compare these floors with the genuine Ritz shift, not merely
with the ground eigenvalue.  Write the even block as

\[
 E_N=\begin{pmatrix}q&c^*\\c&A_N\end{pmatrix},
 \qquad q=(Q_N)_{00}=2\sum_{k=1}^{N}{1\over\rho_k^2}.          \tag{4.9}
\]

The coupling `c` is nonzero: otherwise the simple kernel with `p_N!=0`
would contradict the first row of `E_N Phi_N=0`.  Let `u_N` be the lower
Ritz eigenvalue of `E_N` on `span{V_0,c}`.  Positivity and the first diagonal
trial vector give

\[
 0\leq u_N\leq q
 \leq2\sum_{k=1}^{\infty}{1\over(k-\epsilon)^2}
 \leq2\left({1\over(1-\epsilon)^2}+{1\over1-\epsilon}\right)
 <5.                                               \tag{4.10}
\]

Combining (4.8) and (4.10) proves the two stronger shifted signs

\[
 \boxed{
 A_N-u_NI\succ8459I,
 \qquad O_N-u_NI\succ8459I.}                     \tag{4.11}
\]

Thus the construction satisfies the genuine lower-Ritz hypotheses, with
`mu=0<=u_N`; it does not silently replace `u_N` by the ground eigenvalue.

## 5. Gamma product and divergent twisted mass

For `1<=n<=N`, (2.7) gives

\[
 {w_n\over w_0}
 ={(N!)^2\over(N+n)!(N-n)!}
  \prod_{k=1}^{N}\left|1-{n^2\over\rho_k^2}\right|.
                                                               \tag{5.1}
\]

For each fixed integer `n`, the factorial factor tends to one and the
product tends to `|mathcal F_epsilon(n)|`, where, with

\[
 \alpha={1+\epsilon\over2},
 \qquad \beta=1-{\epsilon\over2},                \tag{5.2}
\]

Euler's gamma product gives

\[
 \mathcal F_\epsilon(z)
 ={\Gamma(\alpha)^2\Gamma(\beta)^2
   \over
   \Gamma(\alpha+z/2)\Gamma(\alpha-z/2)
   \Gamma(\beta+z/2)\Gamma(\beta-z/2)}.
                                                               \tag{5.3}
\]

Reflection changes (5.3) at positive integers into

\[
 {\Gamma(\alpha)^2\Gamma(\beta)^2\over\pi^2}
 {\Gamma(n/2+1-\alpha)\over\Gamma(n/2+\alpha)}
 {\Gamma(n/2+1-\beta)\over\Gamma(n/2+\beta)}
 \sin\pi(\alpha-n/2)\sin\pi(\beta-n/2).         \tag{5.4}
\]

Here `alpha+beta=3/2`.  Stirling's ratio formula therefore gives

\[
 |\mathcal F_\epsilon(n)|
 \sim {C_{\mathrm{even}}(\epsilon)\over n}
 \quad(n\ \mathrm{even}),
 \qquad
 |\mathcal F_\epsilon(n)|
 \sim {C_{\mathrm{odd}}(\epsilon)\over n}
 \quad(n\ \mathrm{odd}),                            \tag{5.5}
\]

where both constants are strictly positive for `0<epsilon<1`.  Explicitly,
their sine factors are respectively
`|sin(pi alpha)sin(pi beta)|` and
`|cos(pi alpha)cos(pi beta)|`.

All terms in (5.1) are nonnegative.  Fatou's lemma for the counting measure
on the positive integers and (5.5) now give

\[
 \begin{split}
 \liminf_{N\to\infty\atop N\ \mathrm{even}}{a_N\over p_N}
 &=\liminf_{N\to\infty\atop N\ \mathrm{even}}
   \left(1+2\sum_{n=1}^{N}{w_n\over w_0}\right)\\
 &\geq1+2\sum_{n=1}^{\infty}|\mathcal F_\epsilon(n)|
 =+\infty.
 \end{split}                                      \tag{5.6}
\]

This proves (0.3).  A global scalar Herglotz cone and even very large
strict-sector floors do not supply the missing total-mass-to-anchor bound.

## 6. Quotient-root clearance and actual-anchor stopping line

The quotient numerator in (2.3) has exactly the roots `+-rho_k`.  At fixed
`epsilon=1/100`, they are uniformly separated from the integer poles, yet
the mass ratio diverges.  On the other hand, every estimate in Section 4
improves as `epsilon` decreases.  Choosing any positive sequence
`epsilon_N<=1/100` with `epsilon_N->0` retains (4.11) while

\[
 \min_{1\leq k\leq N}\operatorname {dist}(\rho_k,\mathbb Z)
 =\epsilon_N\longrightarrow0.                    \tag{6.1}
\]

Hence the structural hypotheses imply neither a total twisted-mass bound
nor a positive quotient-root clearance.  The two-roots-in-one-gap pattern
itself is completely compatible with both strict signs.

The counterfamily uses the exact anchor `V_0`, so `p_N=xi_0` without an
anchor-transfer approximation.  What does not transfer is the matrix: the
source row (3.5) is an auxiliary rational resolvent sum, not the frozen
prime-power/archimedean source.  Applying this barrier to the actual family
would require proving that the actual arithmetic structure permits or
excludes this growing mass mechanism.  No such result is asserted here.

## 7. Locked conclusion

The following implication is false in the finite source-Cauchy category:

\[
 \left.
 \begin{array}{c}
 w_n>0\ \hbox{for every retained mode},\\
 Q\succeq0\ \hbox{with simple normalized even ground},\\
 A-uI\succ0,\quad Q_--uI\succ0
 \end{array}
 \right\}
 \quad\Longrightarrow\quad
 \sup_N{\sum_nw_n\over\xi_0}<\infty.             \tag{7.1}
\]

Any successful positive route must add genuinely arithmetic quantitative
information beyond the global cone, source displacement, quotient
real-rootedness, and the two strict lower-Ritz signs.
