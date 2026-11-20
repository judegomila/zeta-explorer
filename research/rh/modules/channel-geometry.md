# Coherent channels, superwires, and triangle geometry

**Status:** independently internally reviewed restricted analytic theorem, exact identities, and explicit failed shortcuts. RH remains **open**. This is not external peer review or formal verification. No whole-even support endpoint is extended.

**What is new in this research record:** the separate annular good-carrier sectors can be assembled into one sparse positive span with all coherent cross terms retained. The proof uses standard smooth-wavepacket separation and the classical Montgomery–Vaughan mean-value theorem; it is not a new general superwire theorem. The triangle work gives exact coordinates for channel interference through Suzuki's already published screw-kernel identity. It does not supply the missing arithmetic inequality.

**Evidence boundary:** the annular precursor is independently recovered here at \(T=X=e^{2b}\) for a fixed smooth envelope family. A dedicated final audit of every broader statement in the original annular note was not recovered. General carrier-height regimes and its band-compression discussion are not promoted by this module. The physical-head projection conclusion imports an accepted action theorem; its complete transitive proof tree is not bundled here. Source publication and live app registration remain separate integration steps.

## 1. The actual blocker and the useful physical picture

The missing result is a signed lower bound on every admissible physical-complement direction as support grows. Typical frequencies and selected safe modes do not control exceptional frequencies or their coherent interactions.

The superwire reference concerns dynamically stable channels in periodic superlattices, not ordinary superconducting wires. The 2024 primary paper studies tunneling between these channels. The useful lesson is to keep complex amplitudes and quantify coupling; confinement alone does not imply decoupling or positivity. [Graf et al., 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11203167/).

For an orthogonal finite channel decomposition, write
\[
H=\begin{pmatrix}D&B\\B^*&E\end{pmatrix},\qquad D>0.
\]
Exact completion of the square gives
\[
H\ge0\quad\Longleftrightarrow\quad E-B^*D^{-1}B\ge0.
\]
This is the remaining all-channel test, not an established inequality. Its infinite-dimensional version requires the real form domains and inverse/coupling hypotheses. Positive selected channels do not supply the omitted block or its Schur charge.

## 2. Exact paired-packet reduction, including all prime powers

Fix \(0<\delta<(\log2)/2\). Let the envelope space be reflection-even complex \(L^2(-\delta,\delta)\), zero extended, with logarithmic Fourier form domain. Use the unitary angular Fourier transform. Define
\[
R_\psi(s)=\int\psi(x+s)\overline{\psi(x)}\,dx,
\quad m_\alpha(\psi)=\int\cosh(\alpha x)\psi(x)\,dx,
\]
\[
J_b\psi=\frac{\psi(\cdot+b)+\psi(\cdot-b)}{\sqrt2},
\qquad b>\delta,\quad\ell=b+2\delta.
\]
The disjoint packet supports make \(J_b\) an isometry into the actual even physical window \((-\ell,\ell)\). The actual signed form is
\[
H_\ell[f]=\Gamma_{1/4}[f]
-2\sum_{n<e^{2\ell}}\frac{\Lambda(n)}{\sqrt n}R_f(\log n)
+2|m_{1/2}(f)|^2,
\]
where \(\Gamma_{1/4}\) has Fourier multiplier \(\Re\psi(1/4+it/2)-\log\pi\), with \(\psi\) denoting digamma.

Set \(s_n=\log n-2b\), \(a_n=\Lambda(n)/\sqrt n\), and let \(S_s\) be the clipped zero-extension translation. The exact annular prime operator and signed excess are
\[
X_b=\frac12\sum_{|s_n|<2\delta}a_n(S_{s_n}+S_{s_n}^*),
\quad\Delta_b=X_b-e^b|c_{1/2}\rangle\langle c_{1/2}|,
\quad c_\alpha(x)=\cosh(\alpha x).
\]
Every actual prime power is retained. Endpoint correlations vanish, so the strict inventory is harmless but consistent.

The exact pullback is
\[
J_b^*H_\ell J_b=A-\Delta_b-C_b,
\qquad A=H_\delta=\Gamma_{1/4}+2|c_{1/2}\rangle\langle c_{1/2}|,
\]
\[
C_b=\sum_{j\ge0}e^{-(5+4j)b}|c_{5/2+2j}\rangle\langle c_{5/2+2j}|\ge0.
\]
For the first \(J\) terms, with \(d=b-\delta\),
\[
0\le C_b-C_{b,J}\le
\frac{2\delta e^{-(5+4J)d}}{1-e^{-4d}}I.
\]
The large pole/continuous-prime main term and the first small pole/gamma cross term cancel exactly. This identity does not assume a prime-number-theorem error bound or favorable sign of \(\Delta_b\). A lower approximation to the subtracted positive \(C_b\) cannot replace its required upper enclosure.

## 3. Annular mean square: many individually safe carriers

Fix a complex \(r\)-dimensional smooth even space \(U\subset C_c^\infty(-\delta,\delta)\) and fixed even \(\chi\in C_c^\infty(-\delta,\delta)\) with \(m_{1/2}(\chi)\ne0\). Define exact-neutral modulation
\[
N_tu=u(x)\cos(tx)-\alpha_t(u)\chi(x),
\qquad\alpha_t(u)=\frac{m_{1/2}(u\cos(t\cdot))}{m_{1/2}(\chi)}.
\]
For every fixed \(K\), uniformly on this fixed \(U\),
\[
|\alpha_t(u)|\le C_Kt^{-K}\|u\|,
\quad\|N_tu\|^2=\tfrac12\|u\|^2+O_K(t^{-K})\|u\|^2,
\]
\[
A[N_tu]=\tfrac12\log t\,\|u\|^2+O(1)\|u\|^2.
\]
Let \(B(s)\) be the compression to \(U\) of the symmetrized translation. Then \(B(s)=B(s)^*\), \(\|B(s)\|\le1\), and \(\|B(s)\|_F^2\le r\). Define
\[
\mathcal D_b(t)=\sum_{|s_n|<2\delta}a_ne^{its_n}B(s_n),
\qquad M_b=\sum a_n.
\]
The common phase \(e^{-2ibt}\) is retained. No independent random-prime phases are introduced. Product-to-sum yields
\[
X_b[N_tu]=\tfrac12\langle u,\Re_H\mathcal D_b(t)u\rangle
+O_K(M_bt^{-K})\|u\|^2,
\]
where \(\Re_H\) denotes the Hermitian part, not entrywise real part.

Chebyshev's bound and the fixed multiplicative annulus give
\[
\sum a_n^2=O_\delta(b),\qquad
\sum n a_n^2=O_\delta(e^{2b}b),\qquad M_b=O_\delta(e^b).
\]
The standard Montgomery–Vaughan theorem for finite arbitrary complex coefficients is
\[
\int_T^{2T}\left|\sum d_nn^{it}\right|^2dt
=T\sum|d_n|^2+O\!\left(\sum n|d_n|^2\right).
\]
Applying it entrywise and summing before Markov gives, at \(T=X=e^{2b}\),
\[
\int_T^{2T}\|\mathcal D_b(t)\|_F^2dt\le C_\delta rTb.
\]
Thus the good set
\[
G_b=\{t\in[T,2T]:\|\Re_H\mathcal D_b(t)\|\le\tfrac12\log T\}
\]
has relative measure at least \(1-C_\delta r/b\), and for sufficiently large \(b\),
\[
H_\ell[J_bN_tu]\ge\tfrac18\log T\,\|u\|^2,
\qquad t\in G_b,\quad u\in U.
\]
This already contains arbitrary complex combinations inside each fixed carrier sector. It does not by itself prove positivity across different carriers. [Montgomery–Vaughan, Corollary 3, Eq. (1.11)](https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf).

## 4. The coherent sparse-span theorem

For \(t,s\in[T,2T]\), fixed \(K\), \(u,v\in U\), and \(|h|\le2\delta\), smooth compact amplitudes and integration by parts give
\[
|\langle N_tu,S_hN_sv\rangle|
\le C_K\big[(1+|t-s|)^{-K}+T^{-K}\big]\|u\|\|v\|.
\]
Weighted overlaps of the translated Schwartz Fourier profiles similarly give
\[
|\Gamma_{1/4}[N_tu,N_sv]|
\le C_K\log T\big[(1+|t-s|)^{-K}+T^{-K}\big]\|u\|\|v\|.
\]
The latter needs only \(|a_{1/4}(\xi)|\le C\log(e+|\xi|)\), not compact frequency support or derivatives of the multiplier. Hence the full signed cross block of \(A-X_b\) costs at most
\[
C_K(\log T+M_b)\big[(1+|t-s|)^{-K}+T^{-K}\big].
\]
An absolute bound is used only after the off-diagonal carrier oscillation supplies this decay; the diagonal arithmetic cancellation above is not discarded.

Choose a maximal \(L\)-separated subset \(t_1,\ldots,t_m\) of \(G_b\), with \(L=e^b\). Since eventually \(|G_b|\ge T/2\), packing gives (with \(K>1\) for the row sum)
\[
\frac{T}{4L}\le m\le\frac TL+1,
\qquad\sup_j\sum_{k\ne j}(1+|t_j-t_k|)^{-K}\le2\zeta(K)L^{-K}.
\]
The block row-sum budget is therefore
\[
\mathcal E_b\le C_K(\log T+M_b)
\big[2\zeta(K)L^{-K}+mT^{-K}\big]=o(1)
\]
already at \(K=3\). Put \(\Psi_b=\sum_jN_{t_j}u_j\) and \(S=\sum_j\|u_j\|^2\). The actual physical Gram and complete signed energy satisfy eventually
\[
\tfrac14 S\le\|\Psi_b\|^2\le S,
\qquad H_\ell[J_b\Psi_b]\ge\tfrac1{16}\log T\,S.
\]
Here \(C_b\) is paid **once on the total vector**, not separately per channel. The common coherent span has dimension \(rm\ge re^b/4\) and physical floor at least \(\log T/16\).

For the accepted finite physical head \(P_\ell\), with \(\operatorname{ran}P_\ell\subset\operatorname{Dom}H_\ell\) and \(\|H_\ell P_\ell\|\le\eta_\ell=O(\ell^{-2})\), the sharp joint correction is
\[
\|P_\ell H_\ell+H_\ell P_\ell-P_\ell H_\ell P_\ell\|
\le\frac2{\sqrt3}\eta_\ell.
\]
Writing \(Q_\ell=I-P_\ell\), apply it to the total physical vector:
\[
H_\ell[Q_\ell J_b\Psi_b]\ge\tfrac1{32}\log T\,S
\ge\tfrac1{32}\log T\,\|Q_\ell J_b\Psi_b\|^2.
\]
Positivity proves injectivity and preserves dimension. This is physical orthogonality, not a gamma-coordinate substitute. Projection may destroy moment neutrality; the joint operator correction proves the transfer without reapplying the neutral prime formula. No head-rank-growth bound is required, but a small Rayleigh quotient cannot replace the assumed action norm.

For every **fixed** \(0<\varepsilon<2\), spacing \(L=e^{\varepsilon b}\) permits \(m\ge e^{(2-\varepsilon)b}/4\). Choosing
\[
K>\max\{1,\varepsilon^{-1},(3-\varepsilon)/2\}
\]
makes the arithmetic exponents \(1-K\varepsilon\) and \(3-\varepsilon-2K\) negative. All thresholds are unevaluated and may depend on fixed \(U,\chi,\delta,\varepsilon\). There is no growing-envelope or \(\varepsilon\to0\) assertion. Large dimension is not dense coverage, a nested exhaustion, or no-escape control.

## 5. Mixed curvature and Suzuki's screw kernel

For \(r\ge0\), define
\[
D(r)=\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}(r-\log n)_+
-4(e^{r/2}-1-r/2),\qquad D''=\nu,
\]
where \(d\nu(r)=\sum_{n\ge2}\Lambda(n)n^{-1/2}\delta_{\log n}(dr)-e^{r/2}dr\) on \((0,\infty)\). In the distributional curvature sense,
\[
g_D=e^{-2D(r)}(dr^2+d\theta^2),\qquad K_g\,dA_g=d\nu(r)\,d\theta.
\]
Let
\[
\Psi(r)=ar+\sum_{k\ge1}\frac{1-e^{-\alpha_kr}}{\alpha_k^2}-D(r),
\quad a=\frac{\psi(5/4)-\log\pi}{2},\quad\alpha_k=2k+\tfrac12,
\]
extended evenly. Its scalar normalization is
\[
\Psi(W)=\frac W2q_W[W^{-1/2}1_{[-W/2,W/2]}].
\]
This is one box-mode energy, not all-mode positivity. On the doubled cylinder \([-W,W]\times(\mathbb R/2\pi\mathbb Z)\), use \(D_e(r)=D(|r|)\) and the reflected measure \(\nu_e\). Since \(D'(0+)=0\), this doubling adds no origin atom. Exact polarization for physical form vectors supported in \([-W/2,W/2]\) yields
\[
q_W(f,g)=A(f,g)-\int_{-W}^WR_{fg}(r)\,d\nu_e(r)
=A(f,g)-\frac1{2\pi}\int R_{fg}(r)K_g\,dA_g,
\]
where \(R_{fg}(r)=\int\overline{f(x)}g(x+r)dx\), and \(A\) now uses the **5/4** digamma multiplier with its matching continuum normalization. Correlation weights need not be positive.

For smooth compactly supported tests \(f,g\), the exact screw-kernel identity is already part of Suzuki's published theory:
\[
K_\Psi(x,y)=\Psi(x)+\Psi(y)-\Psi(x-y),
\quad q(f,g)=\iint K_\Psi(x,y)\overline{f'(x)}g'(y)\,dx\,dy.
\]
The origin is distributional. Keeping finite sums together,
\[
\left[\frac{1-e^{-\alpha|r|}}{\alpha^2}\right]''
=\frac2\alpha\delta_0-e^{-\alpha|r|},
\]
\[
2a+\sum_{k\ge1}\frac{2t^2}{\alpha_k(\alpha_k^2+t^2)}
=\Re\psi(5/4+it/2)-\log\pi.
\]
Separating divergent origin contributions would change the operator. Suzuki's global kernel-positive-definiteness and special arithmetic \(\Psi\)-nonnegativity equivalences with RH are **published theorems, not new results here**. Neither global hypothesis is proved by this module. [Suzuki, screw-function paper](https://arxiv.org/abs/2206.03682), [screw-line paper, Eq. (1.10)](https://arxiv.org/abs/2209.04658).

## 6. Exact two-channel and triangle-phase tests

For centered boxes \(b_a=1_{[-a,a]}\), smooth form approximation gives
\[
q(b_a,b_b)=2[\Psi(a+b)-\Psi(|a-b|)],
\quad q(b_a,b_a)=2\Psi(2a),\quad G_{ab}=2\min(a,b).
\]
Once both diagonals are nonnegative, two distinct box channels are positive semidefinite exactly when
\[
[\Psi(a+b)-\Psi(|a-b|)]^2\le\Psi(2a)\Psi(2b).
\]
For a positive physical floor \(\mu\), test \(Z-\mu G\), not just \(Z\). General carrier matrices likewise require their true Gram; \(G^{-1/2}\) is used only after verifying independence or quotienting its kernel.

For a three-channel Hermitian signed matrix with positive diagonals, normalize \(z_{ij}=Z_{ij}/\sqrt{Z_{ii}Z_{jj}}\), set \(r_{ij}=|z_{ij}|\), and write \(z_{12}z_{23}z_{31}=r_{12}r_{23}r_{31}e^{i\Phi}\). Then
\[
\det z=1-r_{12}^2-r_{23}^2-r_{31}^2
+2r_{12}r_{23}r_{31}\cos\Phi.
\]
Together with \(r_{ij}\le1\), determinant nonnegativity is equivalent to three-channel positivity. The product phase is invariant under rephasing individual channels; when a factor vanishes, use the real part of the product instead of its undefined argument. No identity identifying \(\Phi\) with geometric holonomy has been established.

## 7. Failed shortcuts remain visible

**Intensity without phase.** The two bridge matrices
\[
\frac1{\sqrt3}\begin{pmatrix}1&1\\1&1\end{pmatrix},\qquad
\frac1{\sqrt3}\begin{pmatrix}1&1\\1&-1\end{pmatrix}
\]
have identical entrywise intensities but Gram top eigenvalues \(4/3\) and \(2/3\). Thus \(I-B^*B\) has different signs. This is synthetic, not actual Weil data.

**Lossless evolution implies contraction.** The block Hamiltonian \(\bigl(\begin{smallmatrix}0&C\\C^*&0\end{smallmatrix}\bigr)\) generates unitary evolution for every finite \(C\), even \(\|C\|>1\). A Julia/Halmos dilation involving \((I-C^*C)^{1/2}\) assumes the desired contraction and cannot establish it.

**Positive metric or scalar function implies positive channel kernel.** The generic nonnegative function \(F(t)=t^4\) gives
\[
\det\begin{pmatrix}K_F(1,1)&K_F(1,2)\\K_F(2,1)&K_F(2,2)\end{pmatrix}
=\det\begin{pmatrix}2&16\\16&32\end{pmatrix}=-192.
\]
This refutes a generic shortcut, not Suzuki's special global arithmetic theorem.

**Triangle angle cancellation controls channel energy.** Gauss–Bonnet gives unweighted curvature, whereas the actual form carries oscillatory correlation weights and gamma energy. In the coordinate triangle used by the earlier construction, the sloping edge is not geodesic: its geodesic-curvature integral cancels the interior contribution. A different geodesic region does not preserve the original weight.

**Every triangle test suffices.** The four-channel matrix \(Z_{ii}=1\), \(Z_{ij}=-2/5\) has positive triple eigenvalues \(7/5,7/5,1/5\), but its full eigenvalue on \((1,1,1,1)\) is \(-1/5\). With three channels retained,
\[
B^*D^{-1}B=12/5,\qquad E-B^*D^{-1}B=-7/5.
\]
All triple tests can miss a collective defect. This is an exact abstract countermodel, not a negative actual Weil vector.

**Absolute transport closes the signed prime bound.** Let the actual symmetrized prime measure be
\[
\mu_b=\tfrac12\sum_{|s_n|<2\delta}a_n(\delta_{s_n}+\delta_{-s_n}),
\qquad d\sigma(r)=\frac{\cosh(r/2)}{4\sinh\delta}\,dr
\quad\text{on }[-2\delta,2\delta].
\]
For \(M_b>0\), take couplings \(\pi\) of the probability measures \(\mu_b/M_b\) and \(\sigma\). On neutral envelopes the actual mass-matched excess obeys
\[
|\Delta_b[\psi]|\le M_b\tau_b\mathcal E_{\log}[\psi],
\quad\omega(h)=\frac2{\log(e+2/h)},\quad
\tau_b=\inf_\pi\int\omega(|s-r|)\,d\pi.
\]
Here \(\omega(0)=0\), and \(\mathcal E_{\log}[\psi]=\int\log(e+|t|)|\widehat\psi(t)|^2dt\). If \(M_b=0\), the neutral excess is zero instead. Let \(N_b\) count distinct atoms after merging coincident locations, and set \(p_{\max}=\cosh\delta/(4\sinh\delta)\). Every coupling then gives
\[
M_b\tau_b\ge\frac{M_b}{\log(e+8N_bp_{\max})}
\ge c_\delta\frac{e^b}{b+1}
\]
eventually at fixed \(\delta\): the last inequality uses \(N_b\le2e^{2b+2\delta}\) and the ordinary fixed-annulus prime number theorem \(M_b\sim4\sinh\delta\,e^b\). This is a divergent **absolute-estimate budget**, not a lower bound on the true signed Rayleigh quotient. Similarly, a constructed smooth exact-neutral modulated family has \(\|R_\psi'\|_1\) of order \(t\) but gamma energy only of order \(\log t\), refuting the uniform variation-to-energy shortcut. The signed alternative must retain actual phase covariance.

## 8. Exact stopping boundary and evidence

The sparse-span theorem improves coherent assembly only. Nearby, exceptional, low-frequency, and omitted directions are not certified. The triangle identities express their coupling but do not bound it. The required progress remains an actual signed arithmetic estimate strong enough to pay \(E-B^*D^{-1}B\), with physical normalization, domains, and tails intact.

Full mathematical producer notes, independent audits, exact synthetic checkers, and original-to-curated SHA256 mappings are in the channel-geometry source slice. Curated copies remove private conversation links and operational identifiers and label original-versus-curated provenance explicitly; the mapping records those nonmathematical changes. The annular recovery status explicitly limits acceptance to its reviewed precursor. Synthetic algebra replays are not actual-prime numerical certificates.

The accepted whole-even endpoint \(\lambda\le\sqrt{33/2}\), existing source heads, and prior PRs are unchanged. No cofinal positivity, global lower floor, zero-free region, or RH conclusion is claimed.
