# Energy preservation and unitary mixing: a finite-dimensional tradeoff

Jude Gomila research checkpoint · 20 November 2026

## Status and purpose

**DERIVED: elementary finite-dimensional adaptation; no novelty claim.** All assertions below are proved here. This note identifies a constraint on one possible implementation of the twin ladder. It does not establish an arithmetic theta lift or rule out the overall research program.

The distinction is between preserving a particular Hamiltonian on the same Hilbert space and preserving a scalar trace under a simultaneous change of all the data. Exact preservation of the former restricts random-unitary mixing. The latter is compatible with arbitrary unitary changes of basis.

## 1. Finite prime-power Hamiltonian

Fix a finite, nonempty set of distinct prime-power labels

$$
\mathcal I=\{(p,m):p\text{ prime},\ m\geq1,\ p^m\leq X\},
$$

or any subset of this set. Let $\mathcal H=\mathbb C^d$, where $d=|\mathcal I|$, with orthonormal basis $e_{p,m}$. Define

$$
A e_{p,m}=m\log p\,e_{p,m}.
\tag{1}
$$

The spectrum is simple: $m\log p=n\log q$ implies $p^m=q^n$, hence $p=q$ and $m=n$ by unique factorization. The results below apply to any Hermitian $A$, with this simple-spectrum observation used only when describing its full diagonal fixed space.

Use the unnormalized Hilbert–Schmidt norm

$$
\|Q\|_{\mathrm{HS}}^2=\operatorname{Tr}(Q^*Q).
$$

Let $\mu$ be a probability measure on $U(d)$ and define the random-unitary channel

$$
\mathcal T(Q)=\mathbb E_\mu[UQU^*].
\tag{2}
$$

All expectations exist in finite dimension. The channel is linear, unital, trace preserving, and preserves adjoints. Center the Hamiltonian by

$$
\bar a=\frac{\operatorname{Tr}A}{d},\qquad
A_0=A-\bar a I,\qquad
V_A=\|A_0\|_{\mathrm{HS}}^2.
\tag{3}
$$

$V_A/d$ is the variance of the eigenvalues with equal weights.

## 2. Exact preservation forces commutation

### Proposition 1

If $\mathcal T(A)=A$, then $[A,U]=0$ for $\mu$-almost every $U$. In particular, every spectral projection of $A$ is fixed by $\mathcal T$.

For the simple-spectrum Hamiltonian (1), the channel fixes every diagonal matrix in the prime-power basis. If $d>1$, it therefore cannot strictly contract every traceless matrix in Hilbert–Schmidt norm.

### Proof

Unitary invariance of the norm and the identity $\mathcal T(A)=A$ give

$$
\begin{aligned}
\mathbb E\|UAU^*-A\|_{\mathrm{HS}}^2
&=2\|A\|_{\mathrm{HS}}^2
-2\operatorname{Re}\operatorname{Tr}\!\big(A\mathcal T(A)\big)\\
&=0.
\end{aligned}
\tag{4}
$$

The integrand is nonnegative, so $UAU^*=A$ almost surely. Every spectral projection of a finite-dimensional Hermitian matrix is a polynomial in that matrix. The same unitaries therefore commute with those projections, and averaging fixes them.

When the spectrum is simple, its rank-one spectral projections span the entire diagonal algebra. For two distinct such projections, $Q=P_1-P_2$ is nonzero and traceless, while $\mathcal T(Q)=Q$. No estimate $\|\mathcal T(Q)\|_{\mathrm{HS}}\leq\delta\|Q\|_{\mathrm{HS}}$ with $\delta<1$ can hold for all traceless $Q$. ∎

For a Borel probability measure on $U(d)$, commutation also holds at every point of its topological support: the nonnegative integrand in (4) is continuous. The almost-sure formulation requires no additional support convention.

This proposition still allows mixing of off-diagonal matrices. For example, averaging diagonal phases can erase off-diagonal entries while fixing $A$ and every diagonal matrix. The obstruction concerns contraction on the whole traceless space.

## 3. Quantitative tradeoff

### Proposition 2

Suppose, for some $0\leq\delta<1$,

$$
\|\mathcal T(Q)\|_{\mathrm{HS}}
\leq\delta\|Q\|_{\mathrm{HS}}
\quad\text{for every traceless Hermitian }Q.
\tag{5}
$$

Then

$$
\boxed{\displaystyle
\mathbb E\|[A,U]\|_{\mathrm{HS}}^2
\geq2(1-\delta)V_A.}
\tag{6}
$$

In particular, when $V_A>0$, a family whose mean squared commutator is $o(V_A)$ cannot have contraction factors bounded away from one on the full traceless Hermitian space.

### Proof

Since multiplication by a unitary preserves the Hilbert–Schmidt norm and scalar matrices commute with every unitary,

$$
\|[A,U]\|_{\mathrm{HS}}
=\|A-UAU^*\|_{\mathrm{HS}}
=\|A_0-UA_0U^*\|_{\mathrm{HS}}.
$$

Expanding the square gives the exact identity

$$
\boxed{\displaystyle
\mathbb E\|[A,U]\|_{\mathrm{HS}}^2
=2V_A-2\operatorname{Re}\operatorname{Tr}\!\big(A_0\mathcal T(A_0)\big).}
\tag{7}
$$

Apply Hilbert–Schmidt Cauchy–Schwarz and (5):

$$
\operatorname{Re}\operatorname{Tr}\!\big(A_0\mathcal T(A_0)\big)
\leq\|A_0\|_{\mathrm{HS}}\|\mathcal T(A_0)\|_{\mathrm{HS}}
\leq\delta V_A.
$$

Substitution proves (6). ∎

Only contraction of the single observable $A_0$ is needed for this proof. Thus a proposed estimate restricted to a smaller test space incurs (6) if that space contains $A_0$. If it does not contain $A_0$, the conclusion need not apply.

A related estimate quantifies approximate preservation directly. If $\|\mathcal T(A)-A\|_{\mathrm{HS}}\leq\eta\sqrt{V_A}$ and (5) holds, then

$$
(1-\delta)\sqrt{V_A}
\leq\|A_0-\mathcal T(A_0)\|_{\mathrm{HS}}
=\|A-\mathcal T(A)\|_{\mathrm{HS}},
$$

so $1-\delta\leq\eta$ when $V_A>0$. Neither form permits strong global contraction together with negligible disturbance relative to the Hamiltonian's own variance scale.

## 4. Exact two-level sharpness check

Take $A=\operatorname{diag}(a,b)$, $a\neq b$, and the four Pauli unitaries

$$
I=\begin{pmatrix}1&0\\0&1\end{pmatrix},\quad
X=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad
Y=\begin{pmatrix}0&-i\\i&0\end{pmatrix},\quad
Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix}.
$$

Their equally weighted conjugation average is

$$
\mathcal D(Q)=\tfrac14(Q+XQX+YQY+ZQZ)
=\frac{\operatorname{Tr}Q}{2}I.
$$

For $0\leq\delta\leq1$, let $\mathcal T_\delta=\delta\operatorname{Id}+(1-\delta)\mathcal D$. It is random-unitary, with probabilities $(1+3\delta)/4$ for $I$ and $(1-\delta)/4$ for each of $X,Y,Z$. It acts as multiplication by $\delta$ on every traceless matrix.

The commutators with $I,Z$ vanish, and those with $X,Y$ each have squared Hilbert–Schmidt norm $2(a-b)^2$. Hence

$$
\mathbb E\|[A,U]\|_{\mathrm{HS}}^2
=(1-\delta)(a-b)^2
=2(1-\delta)V_A.
$$

This attains equality in (6). Choosing $a=\log2$, $b=\log3$ gives a two-label prime-power instance. The identity/depolarizing example verifies that the constant in (6) cannot be improved under the stated assumptions.

**Exact check performed.** A symbolic matrix calculation verified the channel formula on all four matrix units $E_{ij}$, which form a basis of the two-by-two matrix space, and simplified the weighted commutator cost to $(1-\delta)(a-b)^2$ for symbolic real $a,b,\delta$. This checks the full linear map and the equality case without numerical approximation; the general propositions are proved above.

The reproducible [check_energy_mixing.py](check_energy_mixing.py) uses SymPy as its only third-party dependency. Run `python check_energy_mixing.py`; it writes [ENERGY_MIXING_CHECKS.json](ENERGY_MIXING_CHECKS.json) beside the script, regardless of the working directory. Its scope is exactly the matrix-unit and sharpness checks described above.

## 5. Why scalar trace covariance is different

Let $W$ be any matrix of weights and $f_X$ any scalar function defined on the finite spectrum of $A$. Functional calculus and cyclicity of trace give, for each unitary $U$,

$$
\operatorname{Tr}\!\left[(UWU^*)f_X(UAU^*)\right]
=\operatorname{Tr}\!\left[UWf_X(A)U^*\right]
=\operatorname{Tr}\!\left[Wf_X(A)\right].
\tag{8}
$$

Thus simultaneous conjugation preserves the scalar ramp trace, including when $U$ does not commute with $A$. Equation (8) does not assert $\mathcal T(A)=A$. Propositions 1–2 consequently do not prohibit a construction that moves the Hamiltonian and the weights together, uses changing Hilbert spaces, or preserves only specified scalar observables.

There is a separate limitation concerning two lift maps. If $L,R:\mathcal H\to\mathcal K$ and $U$ is unitary on the common target, then

$$
(UL)^*(UR)=L^*R.
\tag{9}
$$

A common unitary postcomposition therefore cannot improve their cross Gram operator. With different postcompositions, the expression becomes $L^*U^*VR$, so an effective gain must come from an operation that changes the relative pairing or from other substantive data.

Terminology matters: simultaneous **conjugation** of square maps gives $U(L^*R)U^*$, not literally $L^*R$. It preserves unitary invariants, including trace, spectrum, and singular values. Equation (9) concerns common **postcomposition**, for which the cross Gram operator itself is unchanged.

## 6. Block localization and its remaining cost

Choose orthogonal spectral block projections $P_r$ with ranks $d_r$, summing to $I$. Let $U$ be independently Haar distributed within each block. The resulting block twirl is

$$
\mathcal T_{\mathrm{blk}}(Q)
=\sum_r\frac{\operatorname{Tr}(P_rQP_r)}{d_r}P_r.
\tag{10}
$$

To see this, the diagonal block average commutes with every unitary on that block and is therefore scalar, with scalar determined by its trace. Independent phase rotations make every off-diagonal block average zero.

This channel fixes the block projections, while

$$
\mathcal T_{\mathrm{blk}}(A)=\bar A
:=\sum_r a_rP_r,\qquad
a_r=\frac{\operatorname{Tr}(P_rA)}{d_r}.
$$

It preserves $A$ exactly only if $A$ is scalar within every block. Orthogonality of $A-\bar A$ to the block-scalar matrices and (7) give

$$
\mathbb E\|[A,U]\|_{\mathrm{HS}}^2
=2\|A-\bar A\|_{\mathrm{HS}}^2
=2\sum_r\operatorname{Tr}\!\left[P_r(A-a_rI)^2\right].
\tag{11}
$$

The cost is exactly twice the total variance within the blocks. If block $r$ has spectral width $w_r$, then

$$
\mathbb E\|[A,U]\|_{\mathrm{HS}}^2
\leq\frac12\sum_r d_rw_r^2.
\tag{12}
$$

For completeness, eigenvalues in $[\alpha,\beta]$ have variance at most $(\beta-\alpha)^2/4$: average $(x-\alpha)(\beta-x)\geq0$ to bound the second moment, then use $(\bar x-\alpha)(\beta-\bar x)\leq(\beta-\alpha)^2/4$.

Since $A$ and $\bar A$ commute, a function with Lipschitz constant $K$ on the relevant spectral intervals satisfies

$$
\left|\operatorname{Tr}\!\left[W\big(f_X(A)-f_X(\bar A)\big)\right]\right|
\leq K\|W\|_{\mathrm{HS}}\|A-\bar A\|_{\mathrm{HS}}.
\tag{13}
$$

This follows eigenvalue by eigenvalue and then by Hilbert–Schmidt Cauchy–Schwarz. It is a perturbation bound, not an arithmetic cancellation estimate. If there are at least two blocks, nonzero traceless block-scalar matrices remain fixed, so block twirling still does not contract the entire traceless space by a factor below one.

## 7. Implication for the proposed arithmetic construction

**OPEN INTERFACE.** A Heisenberg or theta-lift proposal must identify the actual spaces, Hamiltonians, test vectors, and weight operators and show which observable its averaging preserves. This note separates three possibilities:

- Exact preservation of one nonconstant Hamiltonian on one fixed space cannot coexist with strict contraction on the full traceless space by random-unitary averaging.
- Covariant movement of the Hamiltonian and weights can preserve the scalar trace. A useful gain then requires an independently proved connection between that moving construction and the intended arithmetic target.
- Localization can lower the energy cost by mixing only inside narrow spectral blocks. The surviving block observables and the accumulated approximation errors must still be controlled.

These alternatives do not establish or exclude the desired arithmetic lift. They prevent an argument from claiming both exact fixed-operator energy preservation and unrestricted dimension mixing without accounting for their incompatibility. The missing mathematical work remains an actual lift identification and a noncircular arithmetic comparison with sufficient total error control.
