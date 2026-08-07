# Draft: inversion-sector residual--Ritz bridge

This note isolates a finite-dimensional lemma that can replace the global
complement hypothesis in Theorem 2 of `DIRECT_RH_ATTACK.md`. It is a
conditional linear-algebra statement only. It supplies neither an asymptotic
estimate nor a proof of RH.

## Theorem

Let `H` be a finite-dimensional complex Hilbert space. Let `J=J*=J^{-1}`
and let `Q=Q*` commute with `J`. Write

\[
 H=H_+\mathbin\oplus H_-,\qquad H_\pm=\ker(J\mp I).
\]

Let `kappa` be a unit vector in `H_+`, and define

\[
 q=\langle\kappa,Q\kappa\rangle,\qquad
 b=(Q-qI)\kappa,\qquad r=\|b\|,
\]

and `K=H_+ intersect kappa^perp`. When `K` is nonzero, let its compression
floor be

\[
 \alpha=\min_{0\ne v\in K}
       \frac{\langle v,Qv\rangle}{\|v\|^2}.          \tag{S1}
\]

Let the odd-sector floor be

\[
 \omega=\min_{0\ne y\in H_-}
       \frac{\langle y,Qy\rangle}{\|y\|^2},          \tag{S2}
\]

with `omega=+infinity` when `H_-={0}`. If `r>0`, put

\[
 w=b/r,\qquad c=\langle w,Qw\rangle,
\]

and let

\[
 u=\frac{q+c-\sqrt{(c-q)^2+4r^2}}2.                 \tag{S3}
\]

If `r=0`, define `u=q`. Suppose

\[
 \Gamma:=\alpha-u>0,
 \qquad
 M_-:=\omega-u>0.                                   \tag{S4}
\]

Then the lowest eigenspace of `Q` is one-dimensional. A spanning unit
eigenvector `xi` has a phase that can be chosen so that

\[
 J\xi=\xi,
 \qquad
 \|\xi-\kappa\|
 \le \frac{r}{\alpha-\mu_+}
 \le \frac{r}{\alpha-u}
 =\frac r\Gamma,                                    \tag{S5}
\]

where `mu_+=min sigma(Q restricted to H_+)` is the lowest even-sector
eigenvalue. Moreover,

\[
 \mu_+\le u<\min\{\alpha,\omega\},                  \tag{S6}
\]

and the separation from the ground energy to the odd spectrum is at least
`omega-u>0`. The separation from the ground energy to the second even
eigenvalue is at least `alpha-u=Gamma`.

If `delta` is any bounded linear functional, the additional inequality

\[
 |\delta(\kappa)|>\|\delta\|\,r/\Gamma              \tag{S7}
\]

implies `delta(xi) != 0`. As in the main project note, (S7) is only an
independent sufficient check when the source commutator theorem already gives
the required boundary nonvanishing from the simple-even ground-state
hypotheses.

When `K={0}`, necessarily `r=0` and the even sector is the line spanned by
`kappa`. In that degenerate case the theorem holds without `alpha` or
`Gamma`: `kappa` is the even ground state, and `omega>q` makes it the unique
global ground state with zero eigenvector error.

## Proof

Because `QJ=JQ`, both `H_+` and `H_-` reduce `Q`. Also `b` belongs to
`H_+` and

\[
 \langle\kappa,b\rangle
 =\langle\kappa,Q\kappa\rangle-q=0,
\]

so `b in K`. Relative to `H_+=C kappa direct-sum K`, the even-sector
operator has the block form

\[
 Q_+=
 \begin{bmatrix}
 q&b^*\\
 b&A
 \end{bmatrix},
 \qquad A=P_KQ|_K,
 \qquad A\ge\alpha I.                               \tag{S8}
\]

The Rayleigh quotient at `kappa` gives `mu_+<=q`. If `r>0`, then
`w=b/r` is a unit vector in `K`, and the compression of `Q_+` to
`span{kappa,w}` is, in that orthonormal basis, the Hermitian matrix

\[
 \begin{bmatrix}q&r\\r&c\end{bmatrix}.
\]

Its lower eigenvalue is exactly `u` in (S3). The Rayleigh--Ritz principle
therefore gives `mu_+<=u`; because `r>0`, `u<min{q,c}`. If `r=0`, then
`Q kappa=q kappa`, so `mu_+<=u=q`. Thus `mu_+<=u` in both branches.

Cauchy interlacing between `Q_+` and its compression `A` gives

\[
 \lambda_2(Q_+)\ge\lambda_1(A)=\alpha>u\ge\mu_+.
\]

Consequently the even-sector ground eigenvalue is unique. Let
`xi_+=a kappa+v` be its unit eigenvector, with `v in K`. Its phase may be
chosen so that `a>0`; `a` cannot vanish because a vector in `K` has Rayleigh
quotient at least `alpha>u>=mu_+`. The complementary block of
`Q_+ xi_+=mu_+ xi_+` is

\[
 (A-\mu_+I)v=-ab.
\]

Since

\[
 A-\mu_+I\ge(\alpha-\mu_+)I
              \ge(\alpha-u)I=\Gamma I,
\]

we get

\[
 \|v\|\le\frac{a r}{\alpha-\mu_+}
          \le\frac{a r}{\Gamma}.
\]

Writing `a=cos(theta)` and `||v||=sin(theta)` yields

\[
 \|\xi_+-\kappa\|=2\sin(\theta/2)
 \le\tan\theta
 \le\frac{r}{\alpha-\mu_+}
 \le\frac r\Gamma,
\]

which proves the eigenvector estimate in the even sector.

Finally, the spectrum of `Q` is the union of its even and odd spectra.
Condition (S4) and `mu_+<=u` put every odd eigenvalue strictly above the
unique even ground eigenvalue. Hence `xi=xi_+` is the unique global ground
eigenvector up to phase and is exactly inversion even. The odd-to-ground
separation is at least `omega-u`. Inequality (S7) implies boundary
nonvanishing from

\[
 |\delta(\xi)|\ge |\delta(\kappa)|
                 -\|\delta\|\,\|\xi-\kappa\|>0.
\]

This proves the theorem.

For stable evaluation when `r>0`, the Ritz upper bound also has the form

\[
 u=\min\{q,c\}
 -\frac{2r^2}
 {|c-q|+\sqrt{(c-q)^2+4r^2}},                       \tag{S9}
\]

which avoids cancellation. This symmetric formula covers either ordering of
`q` and `c`.

## Relation to the old even and global complement gaps

The old signed even-complement gap is

\[
 \Delta_{\rm even}=\alpha-q.                        \tag{S10}
\]

The new denominator is

\[
 \Gamma=\alpha-u
 =\Delta_{\rm even}+(q-u).                          \tag{S11}
\]

When `r>0`, `q-u>0`. Therefore `Gamma` is strictly larger than the old
even gap whenever the latter is positive, and `Gamma` can remain positive
even when `Delta_even<=0`. When `r=0`, `u=q`, so `Gamma=Delta_even`; there is
no residual coupling to improve the separation.

The old global complementary gap is the signed quantity

\[
 g_{\rm all}=
 \min_{0\ne v\perp\kappa}
 \frac{\langle v,Qv\rangle}{\|v\|^2}-q
 =\min\{\alpha-q,\omega-q\}.                        \tag{S12}
\]

It is possible that both old gaps are nonpositive while
`u<min{alpha,omega}`. Then the old global complement theorem does **not**
pass, while the residual coupling has lowered the even ground below both
compression floors and the sector-refined theorem does pass. This is a
genuine change of sufficient hypothesis, not a relabeling of an old gap.

For an exact example, take

\[
 J=\operatorname{diag}(1,1,-1),\qquad
 Q=\begin{bmatrix}0&1&0\\1&0&0\\0&0&-1/2\end{bmatrix},
 \qquad \kappa=(1,0,0)^T.
\]

Here `q=0`, `r=1`, `c=alpha=0`, `u=-1`, `Gamma=1`, and
`omega=-1/2>u`. The unique global ground state is even, at energy `-1`.
Nevertheless `Delta_even=0` and `g_all=-1/2` are nonpositive. Replacing the
odd entry `-1/2` by `-2` shows why the odd condition is indispensable: the
Ritz and compression calculations are unchanged, but the global ground state
is then odd.

The `r=0` branch has no such window. In that case `u=q`, so (S4) requires
`alpha>q` and `omega>q`, exactly as it must because `kappa` is already an
eigenvector and no residual coupling lowers its energy.

## Audit and serialization requirements

The following quantities must retain distinct names and meanings:

- `global_complement_gap = g_all`, including its sign;
- `global_complement_gap_positive = (g_all > 0)`;
- `even_compression_floor = alpha`;
- `even_gap_from_q = alpha-q`, including its sign;
- `odd_sector_floor = omega`;
- `two_dimensional_ritz_upper = u`;
- `even_floor_minus_ritz_upper = Gamma`;
- `odd_floor_minus_ritz_upper = omega-u`;
- `sector_refined_conditions_hold = (Gamma > 0 and omega-u > 0)`.

A run with `g_all<=0` must not call the old global complementary-gap test a
pass. It may separately report that the sector-refined sufficient conditions
hold, provided both strict inequalities in (S4) were actually established.
This distinction preserves the mandatory failure rule rather than evading it.
Likewise, `Delta_even<=0` must remain visible even if `Gamma>0`.

For certified computation, outward-rounded enclosures must satisfy

\[
 \operatorname{lower}(\alpha)>\operatorname{upper}(u),
 \qquad
 \operatorname{lower}(\omega)>\operatorname{upper}(u). \tag{S13}
\]

Unenclosed high-precision values remain diagnostics. Sampled compression
eigenvalues are not a proof of either inequality along an unbounded schedule.
If only a proved lower bound `alpha_lower<=alpha` is available, the theorem
remains valid with the certified denominator
`Gamma_lower=alpha_lower-u_upper>0`; a certified distance ratio also uses an
upper enclosure for `r`.

Exact commutation and exact evenness are hypotheses: approximate parity or a
small commutator does not justify the orthogonal sector decomposition above.
The compression floor must cover all of `K`, not merely selected even
vectors. Both strict comparisons with `u` are essential for the stated
conclusion. In a complex Hilbert space all phase choices above are harmless,
but the Hermitian and self-adjoint-unitary hypotheses are essential.

## Conditional replacement in the asymptotic bridge

For a diagonal sequence in Section 5 of `DIRECT_RH_ATTACK.md`, set

\[
 R_j^{\rm sec}=r_{\lambda_j,N_j}/\Gamma_j,
 \qquad
 \Gamma_j=\alpha_j-u_j.
\]

If both strict sector comparisons in (S4) hold at every index, the exact
source boundary hypothesis is verified, and

\[
 \sqrt{\log\lambda_j}\,\lambda_j^\eta
 \left(e_j+\|P_{N_j}k^+_{\lambda_j}\|R_j^{\rm sec}\right)
 \longrightarrow0
 \quad(\eta<1/2),                                   \tag{S14}
\]

then the same characteristic-function approximation argument can use (S5)
in place of the old global-gap estimate. This draft proves only the finite
linear-algebra substitution. It does not establish the sector comparisons or
(S14) on any unbounded sequence.
