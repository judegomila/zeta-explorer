# Signed graph-observability reduction

## 0. Claim boundary

This note isolates a preconditioner-free sufficient route to the
vector-specific shifted solve through an exact graph-observability criterion.
Once the two
shifted sector signs have been proved, the residual estimate needed by
equation (5.2) of `DIRECT_RH_ATTACK.md` follows from one comparison

\[
 G_+\preceq C_\lambda B_+^2,
\]

where `G_+` is the positive paired-sampling Gram and `B_+` is the complete
shifted even-complement operator.  This criterion does not require a chosen
preconditioner to approximate `B_+` in a left-preconditioned Euclidean norm.

The result is finite-dimensional linear algebra plus the already-proved
ordinary sequence-sampling domination.  It does not prove either shifted
sector sign or the displayed graph comparison on an unbounded schedule.
It proves neither equation (5.2), locally uniform determinant convergence,
nor the Riemann hypothesis.  The formal project state remains
`P0_INVALIDATED`.

## 1. Exact graph constant

Let `K` and `Z` be finite-dimensional Hilbert spaces, let

\[
 B=B^*:K\longrightarrow K
\]

be invertible, and let

\[
 \mathsf Z:K\longrightarrow Z,
 \qquad G=\mathsf Z^*\mathsf Z\succeq0.             \tag{1.1}
\]

The notation `mathsf Z` distinguishes the sampling analysis from a list of
zeros.  Define the exact graph-observability constant

\[
 \mathfrak C(B,G)
 :=\|\mathsf ZB^{-1}\|^2
 =\|B^{-1}GB^{-1}\|.                               \tag{1.2}
\]

### Theorem 1.1 (equivalent graph forms)

For every `C>=0`, the following statements are equivalent:

\[
 \boxed{G\preceq C B^2,}                              \tag{1.3}
\]

\[
 \boxed{\|\mathsf Zv\|\leq\sqrt C\,\|Bv\|
        \quad(v\in K),}                              \tag{1.4}
\]

and

\[
 \boxed{\|\mathsf ZB^{-1}\|^2
       =\|B^{-1}GB^{-1}\|\leq C.}                  \tag{1.5}
\]

The least admissible `C` is exactly `mathfrak C(B,G)`.

**Proof.**  Since `G=mathsf Z^*mathsf Z`, (1.3) evaluated on `v` is
precisely the square of (1.4).  Substitute `v=B^(-1)y` in (1.4) to obtain
the first norm in (1.5).  Finally,

\[
 (\mathsf ZB^{-1})^*(\mathsf ZB^{-1})
 =B^{-1}GB^{-1},                                      \tag{1.6}
\]

so the two norms in (1.5) agree.  Conversely, congruence of (1.5) by `B`
gives (1.3).  \(\square\)

No commutation between `B` and `G` is used.  In particular, (1.3) is a
full operator inequality, not a comparison of their eigenvalue lists.

## 2. Residual domination

Let `c in K` and suppose an independently positive sampling argument gives

\[
 \boxed{cc^*\preceq\epsilon G,
        \qquad \epsilon\geq0.}                       \tag{2.1}
\]

This is the exact inequality proved for the prolate remainder in
`notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md`; it is ordinary sequence
Cauchy--Schwarz and is not positivity of the Weil form.

### Theorem 2.1 (graph-forced solve)

Under (1.3) and (2.1),

\[
 \boxed{\|B^{-1}c\|^2
       \leq\epsilon\,\mathfrak C(B,G)
       \leq\epsilon C.}                            \tag{2.2}
\]

**Proof.**  Congruence of (2.1) by the self-adjoint `B^(-1)` gives

\[
 (B^{-1}c)(B^{-1}c)^*
 \preceq\epsilon B^{-1}GB^{-1}.                       \tag{2.3}
\]

The norm of the rank-one operator on the left is `||B^(-1)c||^2`.
Take operator norms and use (1.2).  \(\square\)

The square on `B` in (1.3) is essential.  The theorem controls the Euclidean
solve directly and does not first convert a form norm through the smallest
eigenvalue of an auxiliary metric.

## 3. Application to the finite prolate--Weil bridge

Use the exact even block

\[
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus K,                              \tag{3.1}
\]

and let `u` be the lower two-dimensional Ritz value.  Let `U>=u` be a
rigorous upper bound and put

\[
 B_+=A-U I,
 \qquad B_-=Q_- -U I.                                  \tag{3.2}
\]

Let `p=a*kappa` be the unnormalized projected source state, `a=||p||>0`,
and put

\[
 c=ab.                                                   \tag{3.3}
\]

The complete-remainder sampling theorem gives (2.1) with
`epsilon=epsilon_lambda` and the paired-sampling Gram `G_+` on `K`.

### Theorem 3.1 (signed graph bridge)

Assume

\[
 B_+\succ0,
 \qquad B_-\succ0,                                      \tag{3.4}
\]

and

\[
 G_+\preceq C_\lambda B_+^2.                            \tag{3.5}
\]

Then the two strict sector comparisons of the weighted bridge hold and

\[
 \boxed{
 a^2\tau^2
 \leq a^2\|B_+^{-1}b\|^2
 =\|B_+^{-1}c\|^2
 \leq\epsilon_\lambda C_\lambda.}                    \tag{3.6}
\]

Consequently, with the chordal function `D_ch` from the weighted bridge,

\[
 \boxed{aD_{\rm ch}(\tau)
       \leq a\tau
       \leq\sqrt{\epsilon_\lambda C_\lambda}.}       \tag{3.7}
\]

**Proof.**  Positivity in (3.4) gives
`U<min sigma(A)` and `U<min sigma(Q_-)`.  Since `u<=U`, both strict
comparisons follow.  Spectral calculus for the same Hermitian operator `A`
gives

\[
 \tau=\|(A-uI)^{-1}b\|\leq\|(A-U I)^{-1}b\|.           \tag{3.8}
\]

Now apply Theorem 2.1 to (3.3) and use `D_ch(t)<=t`.  \(\square\)

The signs (3.4) remain separate obligations.  A graph inequality for the
even residual cannot rule out a lower odd eigenvalue.

## 4. Exact scale on the locked common schedule

Take the locked half-integer exponential schedule

\[
 \lambda_j=j+\frac12,
 \qquad N_j=2^{2400(2j+1)^2}.                            \tag{4.1}
\]

The admitted complete-remainder theorem and fixed-index prolate asymptotics
give the upper estimates

\[
 \epsilon_\lambda
 =O\!\left(\lambda^3\operatorname {polylog}(\lambda)d_4\right)+o(d_4)
 =O\!\left(\lambda^{3+o(1)}d_4\right),
 \qquad
 {d_4\over d_8}=\lambda^{-8+o(1)}.                       \tag{4.2}
\]

Therefore the single graph target

\[
 \boxed{
 \mathfrak C(B_+,G_+)
 =O\!\left({\lambda^4\operatorname {polylog}(\lambda)\over d_8}\right)}
                                                               \tag{4.3}
\]

implies

\[
 \epsilon_\lambda\mathfrak C(B_+,G_+)
 =O\!\left(\lambda^{-1+o(1)}\right),                   \tag{4.4}
\]

and hence

\[
 aD_{\rm ch}(\tau)
 =O\!\left(\lambda^{-1/2+o(1)}\right).                \tag{4.5}
\]

The projected norms tend to a positive finite limit on (4.1), so (4.5),
together with the already-proved projection rate, has exactly the strength
required by equation (5.2) for every fixed `eta<1/2`.

For the stronger critical-height transfer in
`notes/CRITICAL_HEIGHT_ANCHOR_TRANSFER_THEOREM.md`, the finite sufficient
target is

\[
 \epsilon_\lambda\mathfrak C(B_+,G_+)=O(\lambda^{-1}),  \tag{4.6}
\]

with a schedule-independent constant.  A `lambda^(-1+o(1))` statement alone
does not imply this endpoint bound.

## 5. Relation to the left-preconditioned program

The earlier preconditioned criterion remains a sufficient way to prove the
new graph target.  Let

\[
 B=D+R,
 \qquad D\succ0,
 \qquad \rho=\|D^{-1}R\|<1.                            \tag{5.1}
\]

Since `D` and `R` are Hermitian,

\[
 \|RD^{-1}\|=\|(D^{-1}R)^*\|=\rho.                     \tag{5.2}
\]

The right factorization

\[
 B=(I+RD^{-1})D
\]

gives

\[
 \mathsf ZB^{-1}
 =\mathsf ZD^{-1}(I+RD^{-1})^{-1}.                     \tag{5.3}
\]

Thus, with

\[
 \Gamma(D)=\|\mathsf ZD^{-1}\|^2
 =\|D^{-1}GD^{-1}\|,                                  \tag{5.4}
\]

one has

\[
 \boxed{
 \mathfrak C(B,G)
 \leq{\Gamma(D)\over(1-\rho)^2}.}                     \tag{5.5}
\]

Algebraically, Theorem 2.1 is also the earlier weak-residual estimate
specialized to `D=B` and `R=0`.  The contribution here is to isolate that
specialization as a preconditioner-free sufficient target; it is not a new
arithmetic estimate and it need not be the logically weakest vector-specific
condition.

Unlike (5.1), however, the direct criterion (1.3) does not require `B` to
be uniformly close to a prescribed `D`.  For example,

\[
 B_\varepsilon=\operatorname {diag}(\varepsilon,1),
 \qquad \mathsf Z_\varepsilon=B_\varepsilon             \tag{5.6}
\]

has `G_epsilon=B_epsilon^2` and exact graph constant one for every
`0<epsilon<=1`, while the coarse choice `D=I` has
`||D^(-1)(B_epsilon-D)||=1-epsilon`, with no uniform reserve below one.
The direct graph theorem retains the forcing orientation even in a highly
anisotropic problem.

For a diagonal positive `B=diag(beta_i)`, (1.3) permits the natural
geometric cross scale

\[
 |G_{ij}|\leq C\beta_i\beta_j.                          \tag{5.7}
\]

It does not demand the stronger minimum-scale cross estimate forced by a
uniform left-preconditioned comparison with a separately chosen diagonal
model.  This is the principal reduction gained here.

## 6. Sufficient remaining arithmetic theorem

Using the weighted-PNT normal form, (3.2) is assembled without separating
the source cancellation.  Let `H_+` and `H_-` be the finite parity spaces,
let `kappa in H_+` be normalized, put

\[
 K=H_+\cap\kappa^\perp,
 \qquad
 \Pi_K=\Pi_+-|\kappa\rangle\langle\kappa|,
\]

and regard every compression below as an operator on its displayed range.
Then

\[
 B_+
 =\left.\Pi_K\bigl((c_*-U)I+A_{\rm tail}-T_D\bigr)\Pi_K
   \right|_K,
 \qquad
 B_-
 =\left.\Pi_-\bigl((c_*-U)I+A_{\rm tail}-T_D\bigr)\Pi_-
   \right|_{H_-}.                                           \tag{6.1}
\]

A preconditioner-free sufficient common-schedule theorem can now be stated as
follows:

1. prove `B_+>0` and `B_->0` on the locked schedule, or on an explicit
   source-selected subsequence of it;
2. prove the cancellation-preserving graph inequality

   \[
    \|\mathsf Zv\|^2
    \leq {\lambda^4\operatorname {polylog}(\lambda)\over d_8}
          \|B_+v\|^2
    \quad(v\in K);                                      \tag{6.2}
   \]

3. retain a finite constant in (4.6) if the checkpoint-0.52 endpoint window
   is also claimed.

Magnitude-only PNT envelopes do not establish (6.1)--(6.2): they neither
choose the sector signs nor control the vector-valued cancellation in
`B_+v`.  A scalar quadratic-energy estimate also cannot imply (6.2).
