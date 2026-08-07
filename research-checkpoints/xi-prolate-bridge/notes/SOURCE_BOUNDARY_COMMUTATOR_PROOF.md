# Exact source boundary-commutator proof

Status: finite algebraic theorem reproduced.  This note does not provide a
uniform boundary lower bound, locally uniform determinant convergence, or an
RH proof.  The project status remains `P0_INVALIDATED` because the separate
locked-source normalization inconsistencies remain in force.

The binding source is Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf` with SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
Page numbers below are both the printed and PDF page numbers.

## 1. Exact source chain

| Source location | Role |
|---|---|
| p. 3, (2.6); p. 7, (3.17); p. 8, (3.21) | Define the orthonormal Fourier modes `U_n`, the logarithmic isometry, and `V_n`. |
| pp. 15--16, (5.1), Lemma 5.1 and (5.2) | Put the truncated Weil matrix in Cauchy form. |
| p. 16, Lemma 5.2(ii) and (5.3) | Prove the rank-two commutator identity. |
| p. 17, paragraph following Definition 5.3 and (5.4) | Prove that the even simple null vector has nonzero pairing with `eta`. |
| p. 20, Corollary 5.6 and (5.15) | Identify `delta_N=L^(-1/2) eta`. |
| p. 20, Proposition 5.7 | Use `delta_N(xi) != 0` to define the perturbed scaling operator. |
| p. 23, Theorem 5.10 and (5.26) | Apply the preceding argument to `T=QW_lambda^N-epsilon_N I` and restore the physical factor `2*pi/L`. |

Proposition 5.7 invokes the nonvanishing rather than proving it locally.  Its
input is the argument on p. 17, which occurs before Lemma 5.4 and before the
rank-one construction.  The route is therefore not circular.

## 2. Repository conventions and the Cauchy matrix

Let \(\lambda>1\), \(L=2\log\lambda\), and

\[
 V_n(u)=L^{-1/2}\exp(2\pi i n\log(\lambda u)/L),
 \qquad -N\le n\le N.
\]

Let `M` be the integer mode operator `M V_n=n V_n`, and let inversion be
`J V_n=V_(-n)`.  The source's physical scaling operator restricted to `E_N`
is `(2*pi/L)M`, as made explicit in (5.26).

If \(\mathcal D=\log_*(\Psi^\#)\) denotes the real distribution in source
(5.1), define

\[
 b_n=-\frac1\pi\left\langle\mathcal D,
       \sin(2\pi n x/L)\right\rangle,
 \qquad b_0=0.
\]

Lemma 5.1 and the formula for `omega_nm` give

\[
 Q_{nm}=\begin{cases}
 a_n,&n=m,\\[2mm]
 \dfrac{b_n-b_m}{n-m},&n\ne m,
 \end{cases}
 \qquad a_{-n}=a_n,\quad b_{-n}=-b_n.        \tag{2.1}
\]

The pairing with `mathcal D` is distributional.  It contains the pole,
archimedean, and prime-power contributions with the source signs; in
particular, the prime contribution retains the minus sign from (3.19).
Equivalently, the coefficients can be reconstructed from the completed
matrix without a stored eigenvector:

\[
 b_0=0,\qquad b_n=nQ_{n0}\quad(n\ne0).        \tag{2.2}
\]

Put

\[
 \eta=\sum_{|n|\le N}V_n,
 \qquad \beta=\sum_{|n|\le N}b_nV_n.
\]

Taking matrix entries in (2.1) proves source (5.3):

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.           \tag{2.3}
\]

Indeed, the `(n,m)` entry of either side is `b_n-b_m`.  Also
`JM=-MJ`, `J eta=eta`, and `J beta=-beta`.  For the physical scaling
operator, the right side of (2.3) is simply multiplied by `2*pi/L`.

## 3. The necessary spectral shift

Let `epsilon` be the lowest eigenvalue of `Q=Q_(lambda,N)`.  Assume that it
is simple and that a corresponding nonzero vector `xi` is inversion even.
Define

\[
 T=Q-\epsilon I.
\]

Then

\[
 T\ge0,\qquad \ker T=\mathbb C\xi,
 \qquad JT=TJ,\qquad [M,T]=[M,Q].              \tag{3.1}
\]

The p. 17 discussion starts with a positive semidefinite matrix having its
simple even vector in the kernel but does not state this shift at that point.
Theorem 5.10 supplies it explicitly.  Any repository use of the lemma must
include (3.1), rather than treating the unshifted Weil matrix as globally
positive.

## 4. Nonvanishing proof

The source matrices and vectors are real.  We use the complex Hilbert-space
notation with the inner product antilinear in its first argument; nonvanishing
is independent of the order of the two conjugate pairings.

There are two cases.

If \(M\xi=0\), then \(\xi\) is a nonzero multiple of \(V_0\).  Since the
coefficient of \(V_0\) in \(\eta\) is one,
\(\langle\eta,\xi\rangle\ne0\).

Suppose instead that `M xi!=0`.  Since `JM=-MJ` and `J xi=xi`, the vector
`M xi` is inversion odd.  It is therefore linearly independent of the even
vector `xi`.  From `ker(T)=C xi` it follows that `T M xi!=0`.  Apply (2.3) to
`xi` and use `T xi=0`:

\[
 0\ne[M,T]\xi
   =-TM\xi
   =\beta\langle\eta,\xi\rangle
      -\eta\langle\beta,\xi\rangle
   =\beta\langle\eta,\xi\rangle.              \tag{4.1}
\]

The last equality holds because `beta` is odd and `xi` is even.  Equation
(4.1) forces `<eta,xi>!=0`.  With source (5.15),

\[
 \delta_N=L^{-1/2}\eta,
 \qquad
 \langle\delta_N,\xi\rangle
 =L^{-1/2}\langle\eta,\xi\rangle\ne0.          \tag{4.2}
\]

Thus the eigenvector may be rescaled to satisfy `delta_N(xi)=1`, exactly as
required in Proposition 5.7 and Theorem 5.10.

## 5. Boundary and norm conventions

For \(f=\sum c_nV_n\) in \(E_N\), both periodic endpoints give

\[
 f(\lambda)=f(\lambda^{-1})
 =L^{-1/2}\sum_{|n|\le N}c_n
 =\langle\delta_N,f\rangle.
\]

Hence `delta_N` is exact endpoint evaluation on `E_N`; Corollary 5.6 says
that the sequence of Dirichlet kernels approximates endpoint evaluation for
general functions in the scaling-operator domain.  Its Riesz-vector norm is

\[
 \|\delta_N\|=\sqrt{\frac{2N+1}{L}}
 =\sqrt{\frac{2N+1}{2\log\lambda}}.             \tag{5.1}
\]

Changing the Fourier sign changes the mode convention and the corresponding
commutator signs.  The source convention must be retained consistently; an
eigenvalue comparison on the real axis is not a substitute for (2.3).

## 6. Exact hypotheses and scope

The finite nonvanishing theorem requires all of the following:

1. `lambda>1`, the source interval `[lambda^(-1),lambda]`, and Lebesgue
   measure in logarithmic coordinates, equivalently `du/u` multiplicatively;
2. the exact source matrix form (2.1), not merely a generic Hermitian matrix
   commuting with inversion;
3. exact real symmetry and the exact involution `J V_n=V_(-n)`;
4. an actual simple lowest eigenvalue and an exactly inversion-even
   eigenvector;
5. the shift by that lowest eigenvalue as in (3.1); and
6. the source boundary vector in (4.2).

No assumed list of zeta zeros, global Weil positivity, or generic boundary
reserve enters the proof.  A certified sector theorem can establish the
simple-even hypothesis for an individual finite matrix.  Arbitrary-precision
point values establish only a diagnostic instance of those hypotheses.

The source argument proves only strict nonvanishing.  It gives no quantitative
lower bound for `|<delta_N,xi>|`, no uniform conditioning of the normalization
`delta_N(xi)=1`, and no estimate along an unbounded diagonal schedule.  Those
facts, and locally uniform convergence of the regularized determinants,
remain separate open obligations.

## 7. Source errata and presentation limitations

- The p. 17 phrase assuming `T` is positive semidefinite and `xi in ker(T)`
  suppresses the shift.  The correct application is the explicit
  `T=QW_lambda^N-epsilon_N I` in Theorem 5.10, p. 23.
- Proposition 5.7 states `delta_N(xi)!=0` without an internal citation.  The
  proof is the paragraph on p. 17 following Definition 5.3, so this is a
  presentation omission rather than circular reasoning.
- Printed (4.14) double-counts `c(L)`.  It changes the archimedean matrix by a
  scalar identity (and the full Weil matrix by the opposite scalar identity),
  so subtracting the corresponding lowest eigenvalue leaves `T`, its
  eigenvectors, and the commutator proof unchanged.  The finite matrix must
  nevertheless use the corrected source formula recorded in
  `P0_SOURCE_ERRATA.md`.
- The Xi-versus-Xi/4 inconsistency in (3.5), (7.1), and (7.2) is unrelated to
  this finite commutator lemma and remains unrepaired at the source-claim
  level.
- On p. 18 the statement that `D''` is self-adjoint "by (7.3)" is a
  cross-reference typo; the displayed symmetry just proved in (5.6) is the
  relevant reference.  This typo occurs after the nonvanishing argument.

These observations reproduce the finite P4 argument but do not alter the
allowed terminal state or discharge any asymptotic RH bridge condition.
