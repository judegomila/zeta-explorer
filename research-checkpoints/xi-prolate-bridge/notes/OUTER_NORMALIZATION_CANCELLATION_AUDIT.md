# Source-normalized `0/4` cancellation and the odd-scale endpoint obstruction

Status: qualitative fixed-index asymptotic audit using the already pinned
prolate sources and the exact endpoint expansion.  It identifies what the
source normalization cancels and what it does not.  It proves no lower bound
for the signed Weil form, no shifted sector floor, no estimate in equation
(5.2), and no Riemann-hypothesis conclusion.  The project terminal state
remains `P0_INVALIDATED`.

## 1. The exact cancellation is at the origin

Use the source-normalized combination

\[
 h_\lambda=a_4h_{4,\lambda}-a_{0,\lambda}h_{0,\lambda},
 \qquad
 a_{0,\lambda}=a_4{\int h_{4,\lambda}\over\int h_{0,\lambda}}.
                                                               \tag{1.1}
\]

Put `v_n=h_(n,lambda)(0)`.  The locked finite-Fourier identity gives

\[
 {a_{0,\lambda}\over a_4}
 ={\chi_4v_4\over\chi_0v_0}.                    \tag{1.2}
\]

The source Hermite limits imply

\[
 {v_4\over v_0}\longrightarrow {\sqrt3\over2^{3/2}},
 \qquad
 {a_{0,\lambda}\over a_4}\longrightarrow
 {\sqrt3\over2^{3/2}}.                          \tag{1.3}
\]

This makes `a_(0,lambda)=O(1)` qualitatively, but the pinned source supplies
no effective constant or starting threshold.  It therefore cannot replace
the explicit finite bound `|a_(0,lambda)/a_4|<=2 sqrt(2) lambda` in a
finite replay theorem.

Using `d_n=1-chi_n^2`, the value at the origin is exactly

\[
 h_\lambda(0)
 =a_4v_4{d_4-d_0\over\chi_0(\chi_0+\chi_4)}
 \sim {3\over32}d_4.                              \tag{1.4}
\]

Thus the invisible origin correction has amplitude of order `d_4`; it is
not the source of the current polynomial loss.

## 2. There is no corresponding hard-endpoint cancellation

Write

\[
 e_n=h_{n,\lambda}(\lambda).
\]

Slepian's pinned endpoint identity and fixed-index defect equivalence give,
after the full-interval normalization and `x=lambda z` scaling,

\[
 e_n^2\sim2\pi\lambda d_n.                       \tag{2.1}
\]

The exact leading constants in the same source lock give

\[
 {d_0\over d_4}
 \sim {3\over8192\pi^4}\lambda^{-8}.             \tag{2.2}
\]

Combining (1.3), (2.1), and (2.2) yields

\[
 {a_{0,\lambda}e_0\over a_4e_4}
 \sim {3\over256\pi^2}\lambda^{-4}.              \tag{2.3}
\]

Consequently

\[
 h_\lambda(\lambda)
 =a_4e_4-a_{0,\lambda}e_0
 \sim a_4e_4.                                     \tag{2.4}
\]

The zero-integral relation cancels the origin/Mellin-pole datum; it does not
cancel the hard endpoint that drives the physical outer tail.

## 3. The second endpoint term is already at the odd scale

The regular prolate endpoint equation is exact:

\[
 h'_{n,\lambda}(\lambda)
 =-{c^2-\mu_n\over2\lambda}e_n,
 \qquad c=2\pi\lambda^2.                         \tag{3.1}
\]

For the fixed labels `0` and `4`, the admitted min--max margin and (2.3)
show that the label-4 term dominates the same combination in (3.1).  Hence

\[
 |h_\lambda'(\lambda)|^2
 =\Theta(\lambda^7d_4)                            \tag{3.2}
\]

in the qualitative fixed-index sense.  No effective threshold is asserted.

After the leading endpoint sawtooth, the exact next sampled term on one
physical tail is

\[
 B_1(s)={h_\lambda'(\lambda)\over
                 4(\lambda e^s)^{3/2}}
          B_2(\lambda^2e^s),
 \qquad B_2(x)=\{x\}^2-\{x\}+\frac16.            \tag{3.3}
\]

Near the edge of the critical strip, the squared weighted coefficient in
(3.3) has the natural scale

\[
 |h_\lambda'(\lambda)|^2\lambda^{-2}
 =\Theta(\lambda^5d_4).                           \tag{3.4}
\]

At weight zero its squared norm is instead on the scale

\[
 |h_\lambda'(\lambda)|^2\lambda^{-3}
 =\Theta(\lambda^4d_4).                           \tag{3.5}
\]

The pinned defect constants give

\[
 {d_6\over d_4}
 \sim {128\pi^2\over15}\lambda^4,               \tag{3.6}
\]

so (3.5) is already the natural `d_6` scale, while (3.4) is one further
factor `lambda` larger.

## 4. Exact consequence for the current proof route

The finite weighted-translation theorem currently uses

\[
 \sum_{n=0,4}|a_n|^2e_n^2=O(\lambda^3d_4)
\]

because it must insert the effective bound
`|a_(0,lambda)/a_4|<=2 sqrt(2) lambda`.  Replacing that input only at the
qualitative asymptotic level by (1.3) improves it to

\[
 \sum_{n=0,4}|a_n|^2e_n^2=O(\lambda d_4).         \tag{4.1}
\]

The remaining far multiplier has degree four, so the collected bound would
improve only from

\[
 O(\lambda^7d_4)\quad\hbox{to}\quad
 O(\lambda^5d_4)=O(\lambda d_6).                 \tag{4.2}
\]

This is not `o(d_6)`, and the improvement is not an effective finite theorem
under the current source locks.  Equations (2.4) and (3.3)--(3.5) explain
why further use of the `0/4` normalization cannot remove the loss: the next
hard-endpoint term survives.

This is a method obstruction, not a lower bound for the signed Rayleigh
quotient.  The later hybrid complete-series theorem does prove the
normalization-free estimate `epsilon_lambda=o(d_6)` by keeping the sampled
series together before the endpoint split.  It does not by itself make the
normalized bound `epsilon_lambda/a^2` small, but the later projected-state
norm theorem supplies the separate lower control of `a` and closes that
scalar shift.  The hard endpoint still does not cancel, and absolute
endpoint/translation control plus the zero-integral identity alone still do
not provide a signed floor or residual-action estimate.
