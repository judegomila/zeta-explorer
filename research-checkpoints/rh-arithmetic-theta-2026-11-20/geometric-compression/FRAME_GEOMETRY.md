# Frame geometry for the projected trace module

**Status:** a complete, elementary finite-dimensional theorem and an explicit dictionary to the source's `Conclusion2Family`. This note compresses the linear algebra after the arithmetic Gram estimates have been supplied. It does not prove those arithmetic estimates, identify an arbitrary RH test form with this Gram operator, or prove RH. The frame, projection, pseudoinverse, and limiting facts used here are standard; no novelty claim is made.

The source is the `Deicyde/riemann-hypothesis` tree pinned at `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`. The precise source declarations and remaining interface checks are recorded in §4. The companion [check_frame_geometry.py](check_frame_geometry.py) exercises exact algebra and counterexamples; its output is [FRAME_GEOMETRY_CHECKS.json](FRAME_GEOMETRY_CHECKS.json). It is an independent algebra checker, not a Lean replay.

## 1. The finite frame theorem

Let \(H\) be a finite-dimensional complex Hilbert space of dimension \(N\). Let \(U\) be a finite family, let \(E_u\) have dimension \(d_u\), and let

\[
T_u:E_u\longrightarrow H,\qquad G_{uv}=T_u^*T_v.
\tag{1}
\]

The adjoint in (1) is essential: these are blocks of an actual Gram operator. Zero-dimensional \(E_u\) are allowed. Put

\[
R=\sum_{u\in U}d_u>0.
\]

Fix \(D_*>0\), \(e,\eta,\kappa,\delta\ge0\). Suppose

\[
\|G_{uu}-I_{E_u}\|_{\rm HS}^2\le e d_u,
\qquad
\|G_{uv}\|_{\rm HS}^2\le(1+\eta)\frac{d_ud_v}{D_*}
\quad(u\ne v).
\tag{2}
\]

For each \(u\), let \(P_u\) be an orthogonal projection on \(E_u\), and let \(\Pi\) be an orthogonal projection on \(H\). Assume

\[
\sum_u\operatorname{rank}(I-P_u)\le\kappa R,
\qquad
\operatorname{rank}(I-\Pi)\le\delta D_*.
\tag{3}
\]

The first condition follows, in particular, from the individual bounds \(\operatorname{rank}(I-P_u)\le\kappa d_u\). Define the three frame operators

\[
S=\sum_uT_uT_u^*,\qquad
S_0=\sum_uT_uP_uT_u^*,\qquad
Q=\Pi S_0\Pi,
\tag{4}
\]

and the two constants

\[
\alpha=1+\eta+(1+\sqrt e)^2\frac{D_*}{R},
\qquad
\beta=1-\sqrt e-\kappa-\sqrt{\kappa e}-\sqrt{\delta\alpha}.
\tag{5}
\]

**Theorem 1.** Under (1)–(3),

\[
Q\succeq0,\qquad
\operatorname{tr}Q\ge\beta R,
\qquad
\operatorname{tr}(Q^2)\le\frac{\alpha R^2}{D_*}.
\tag{6}
\]

If \(\beta>0\), then \(r=\operatorname{rank}\Pi>0\) and

\[
\boxed{\quad
\operatorname{tr}(Q^2)
\le \frac{\alpha}{\beta^2D_*}(\operatorname{tr}Q)^2
\le \frac{N}{D_*}\frac{\alpha}{\beta^2}
\frac{(\operatorname{tr}Q)^2}{r}.
\quad}
\tag{7}
\]

In particular,

\[
\operatorname{rank}Q\ \ge\
\frac{(\operatorname{tr}Q)^2}{\operatorname{tr}(Q^2)}
\ \ge\ \frac{\beta^2D_*}{\alpha}.
\tag{8}
\]

The middle quantity is the effective rank. There is no assumption of a uniform positive lower bound for the nonzero eigenvalues, and the conclusion does not supply one. The theorem is valid in every finite dimension. The first bound in (7) is stronger than the source-shaped second bound by the factor \(N/r\ge1\).

## 2. Proof: energy and the two projection losses

### 2.1 Total frame energy

Write \(D_u=G_{uu}-I\). Hilbert–Schmidt Cauchy–Schwarz gives

\[
|\operatorname{tr}D_u|
\le\sqrt{d_u}\,\|D_u\|_{\rm HS}\le\sqrt e\,d_u.
\]

Consequently

\[
\operatorname{tr}S=\sum_u\operatorname{tr}G_{uu}
\ge(1-\sqrt e)R.
\tag{9}
\]

The identity below includes ordered off-diagonal pairs; none are omitted or counted only once:

\[
\operatorname{tr}(S^2)=\sum_{u,v}\|G_{uv}\|_{\rm HS}^2.
\tag{10}
\]

Indeed, cyclicity of trace turns the \((u,v)\) summand of \(S^2\) into \(\operatorname{tr}(G_{uv}G_{uv}^*)\). Also

\[
\|G_{uu}\|_{\rm HS}\le\|I\|_{\rm HS}+\|D_u\|_{\rm HS}
\le(1+\sqrt e)\sqrt{d_u}.
\]

Thus

\[
\begin{aligned}
\operatorname{tr}(S^2)
&\le(1+\sqrt e)^2R
  +\frac{1+\eta}{D_*}\sum_{u\ne v}d_ud_v\\
&\le(1+\sqrt e)^2R+\frac{1+\eta}{D_*}R^2
=\frac{\alpha R^2}{D_*}.
\end{aligned}
\tag{11}
\]

Keeping the omitted negative term \(-(1+\eta)\sum_ud_u^2/D_*\) would sharpen (11); it is unnecessary for matching the source constants.

### 2.2 Removing directions in the source spaces

Let \(Z_u=I-P_u\), let \(r_u=\operatorname{rank}Z_u\), and put \(\ell=\sum_ur_u\). Since \(Z_u\) is a projection, \(\|Z_u\|_{\rm HS}=\sqrt{r_u}\). We obtain

\[
\begin{aligned}
\operatorname{tr}(S-S_0)
&=\sum_u\operatorname{tr}(Z_uG_{uu})\\
&\le\ell+\sum_u\sqrt{r_u}\,\|D_u\|_{\rm HS}\\
&\le\ell+\sqrt{\ell}\sqrt{\sum_u\|D_u\|_{\rm HS}^2}\\
&\le(\kappa+\sqrt{\kappa e})R.
\end{aligned}
\tag{12}
\]

This proves the mixed square-root term, including its coefficient. The loss is controlled by the total number of discarded directions, so the individual rank bounds are stronger than this step needs.

Moreover \(0\preceq S_0\preceq S\), and hence

\[
\operatorname{tr}(S_0^2)\le\operatorname{tr}(S^2).
\tag{13}
\]

No commutativity is needed. To see (13), set \(A=S-S_0\succeq0\) and use
\(\operatorname{tr}(S^2)-\operatorname{tr}(S_0^2)
=\operatorname{tr}(AS)+\operatorname{tr}(AS_0)\ge0\).
The trace of a product of two positive semidefinite operators is nonnegative.

### 2.3 Removing ambient directions

By cyclicity of trace, (3), and Hilbert–Schmidt Cauchy–Schwarz,

\[
\begin{aligned}
\operatorname{tr}S_0-\operatorname{tr}Q
&=\operatorname{tr}((I-\Pi)S_0)\\
&\le\sqrt{\operatorname{rank}(I-\Pi)}\,\|S_0\|_{\rm HS}\\
&\le\sqrt{\delta D_*}\sqrt{\alpha R^2/D_*}
=\sqrt{\delta\alpha}\,R.
\end{aligned}
\tag{14}
\]

Combining (9), (12), and (14) proves the trace lower bound. Furthermore

\[
\operatorname{tr}(Q^2)=\|\Pi S_0\Pi\|_{\rm HS}^2
\le\|S_0\|_{\rm HS}^2\le\alpha R^2/D_*.
\tag{15}
\]

Positivity follows directly from (4): each summand of \(Q\) is
\((\Pi T_uP_u)(\Pi T_uP_u)^*\). If \(\beta>0\), the positive trace proves \(Q\ne0\), so \(r>0\). Substituting \(R\le\operatorname{tr}Q/\beta\) into (15) gives the first inequality of (7); \(r\le N\) gives the second. Finally, applying Cauchy–Schwarz to the nonzero eigenvalues of \(Q\) gives (8). This completes the proof.

## 3. What the spectral conclusion means

The theorem says that substantial frame energy survives both deletions and occupies many dimensions. It does not assert that every retained ambient direction has positive energy.

For an exact example, take \(H=E=\mathbb C^3\), \(T=I\), \(P=\operatorname{diag}(1,1,0)\), and \(\Pi=I\). Choose \(D_*=3\), \(e=\eta=\delta=0\), and \(\kappa=1/3\). Then \(\alpha=2\), \(\beta=2/3>0\), yet \(Q\) has a zero eigenvalue. No spectral gap was hidden in the proof.

There is a useful bulk interpretation. On \(\operatorname{range}\Pi\), put \(m=\operatorname{tr}Q/r\) and \(C=(N/D_*)\alpha/\beta^2\). Then

\[
\sum_{j=1}^r(\lambda_j/m-1)^2
=r\left(\frac{r\operatorname{tr}(Q^2)}{(\operatorname{tr}Q)^2}-1\right)
\le r(C-1).
\tag{16}
\]

The assumptions force \(C\ge1\). For any \(\theta>0\), at most \(r(C-1)/\theta^2\) eigenvalues deviate from \(m\) by at least \(\theta m\). If \(C\) is not close to one this statement can be weak; it still cannot be turned into a lower bound for every eigenvalue.

## 4. Exact dictionary to `Conclusion2Family`

The following statements concern the pinned source definitions, not an assertion that all their arithmetic hypotheses have been verified in this note.

| This note | Pinned source |
|---|---|
| \(H\), \(E_u\) | `D.s.HH`, `D.s.Cu u` |
| \(d_u\), \(R\) | `du D u = D.duS u`, `RR D Ws` |
| \(D_*\), \(N\) | `Dst D = D.what₂.Dstar`, `Dall D = D.what₂.Dall` |
| \(G_{uv}\) | `Kmat D.s u v`; `KD` is the same kernel |
| \(P_u\) | `PiU D u` |
| \(Q\) | `Q0 D Ws Pi` |
| \(e\), \(\eta\) | `eF D C0 = 2*C0/Gam D + 2*xK D`, `eta0 D large₂` |
| \(\kappa\), \(\delta\) | `dec D Ws hW`, `del` |
| \(\alpha\), \(\beta\) | `AF D large₂ C0 Ws`, `BF D large₂ C0 del Ws hW` |

### 4.1 The kernel really is an adjoint Gram kernel

[`DataS.lean`](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/CuspSpanNormBounds/DataS.lean) declares finite-dimensional complex inner-product spaces, maps `Pu`, and positive real volumes `volN`, `volH`. [`RelevantZeroGramTerms.lean`](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/CuspSpanNormBounds/RelevantZeroGramTerms.lean) defines

\[
c_u=\frac{\mathrm{volN}(u)\mathrm{volH}(u)}{\dim\Pi(u)},
\qquad
K_{uv}=(c_uc_v)^{-1/2}\,P_u^{\mathrm{src}*}P_v^{\mathrm{src}}.
\tag{17}
\]

Here \(P_u^{\mathrm{src}}\) denotes the source's `Pu`, **not** the projection \(P_u\) used in this note. The denominator `dimPi` is a product of natural dimensions. Therefore \(c_u\ge0\), with the source's totalized division convention. Set

\[
T_u=\begin{cases}c_u^{-1/2}P_u^{\mathrm{src}},&c_u>0,\\0,&c_u=0.\end{cases}
\tag{18}
\]

For nonnegative \(c_u,c_v\), the source's convention \(0^{-1/2}=0\) makes (17) exactly \(T_u^*T_v\), including the zero case. Its convention \(0^{-1}=0\) also makes `Q0` exactly (4). Thus the conversion is not a conjectured kernel factorization. If \(d_u>0\) and \(e<1\), the diagonal defect bound itself excludes \(c_u=0\), since then \(K_{uu}=0\) and \(\|K_{uu}-I\|_{\rm HS}^2=d_u>ed_u\).

The same file defines `PiU` as the inclusion of `ramCu` composed with `orthogonalProjectionOnto`, so it is an orthogonal projection by construction.

### 4.2 `Conclusion1` supplies the two Gram defects

[`AdmissibleBoundsFromSource.lean`](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/CuspSpanNormBounds/AdmissibleBoundsFromSource.lean) defines `Conclusion1` using an auxiliary block \(K^{\mathrm{pp}}_{uv}\). In the notation of this note its four bounds are

\[
K^{\mathrm{pp}}_{uv}=0\quad(u\ne v),\qquad
\|K^{\mathrm{pp}}_{uu}\|_{\rm HS}^2\le d_ux,
\]
\[
\|K_{uv}-K^{\mathrm{pp}}_{uv}\|_{\rm HS}^2
\le(1+\eta)d_ud_v/D_*\quad(u\ne v),
\]
\[
\|K_{uu}-K^{\mathrm{pp}}_{uu}-I\|_{\rm HS}^2
\le\Gamma d_u^2/D_*.
\tag{19}
\]

Suppose \(\Gamma>0\), \(C_0\ge0\), \(x\ge0\), and the accompanying dimension comparison is

\[
d_u\le C_0D_*/\Gamma^2.
\tag{20}
\]

Then the off-diagonal estimate in (2) follows immediately; the diagonal estimate follows from

\[
\begin{aligned}
\|K_{uu}-I\|_{\rm HS}^2
&\le2\Gamma d_u^2/D_*+2xd_u\\
&\le(2C_0/\Gamma+2x)d_u.
\end{aligned}
\tag{21}
\]

This is exactly the source's `eF`, with \(\Gamma=\texttt{Gam D}\) and \(x=\texttt{xK D}\). [`StandingNumericalData.lean`](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/SharpRestriction/CuspSpanNormBounds/StandingNumericalData.lean) provides the dimension comparison with the word-specific `GamP`. The structure `D7` in [`RhoDetPrimeEqMuTildeMulChiPow.lean`](https://github.com/Deicyde/riemann-hypothesis/blob/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9/src/Formalism/LocalRingCardinality/RhoDetPrimeEqMuTildeMulChiPow.lean) explicitly includes `GamP_eq`, identifying every word's `GamP` with that at the distinguished word `u₀`. This is the exact common-scale identification used in (20); no equality of scales is inferred merely from notation. The algebra above requires the stated positivity of \(\Gamma\) and \(D_*\).

### 4.3 Both rank-removal terms and the final constants

The source's `projection_sandwich_lattice` is

\[
\operatorname{rank}(I-P_u)\le\frac{2f}{\operatorname{Tr}(u)}d_u.
\tag{22}
\]

For a finite nonempty word family with positive \(\operatorname{Tr}(u)\), put
\(\kappa=2f/\min_u\operatorname{Tr}(u)\). Then (22) implies (3). The source separately assumes \(\operatorname{rank}(I-\Pi)\le\delta D_*\). Substituting these values and (21) into (5) gives its `AF` and `BF` term for term.

The dimension identifications are also explicit in the same `D7` structure: `s_HH` states `finrank ℂ s.HH = what₂.Dall`, while `s_Cu` is a linear equivalence between `s.Cu u` and `(mem u).A.Mu0`. The definition `duS u` is the dimension of the latter space. Thus \(\dim E_u=d_u\) and \(N=\mathrm{Dall}\). With the positive scales and \(R>0\) required by Theorem 1, the conclusion is precisely

\[
\mathrm{BF}\,\mathrm{RR}\le\operatorname{tr}Q_0,
\qquad
\operatorname{tr}(Q_0^2)\le
\frac{\mathrm{Dall}}{\mathrm{Dstar}}
\frac{\mathrm{AF}}{\mathrm{BF}^2}
\frac{(\operatorname{tr}Q_0)^2}{\operatorname{rank}\Pi}.
\tag{23}
\]

Thus the substantive finite-dimensional content of `Conclusion2Family` is the frame/projection theorem above. The source data supply the exact dimension and Gram identifications; the arithmetic estimates remain inputs to its application. The source file defines several named propositions and implications; this note does not present the existence of those definitions as a proof that their antecedents hold.

## 5. Two controls that must survive the compression

### 5.1 An average bound is sufficient only for the family to which it applies

For one specified family, the proof only needs the aggregate off-diagonal estimate

\[
\sum_{u\ne v}\|G_{uv}\|_{\rm HS}^2\le(1+\eta)R^2/D_*.
\tag{24}
\]

This can replace the pairwise off-diagonal part of (2) for that family. But a bound on one large family's average does not supply the same estimate for every subfamily, and does not imply every-pair decorrelation.

An exact example is \(v_1=v_2=e_1,\ v_3=e_2,\ v_4=e_3\) in \(\mathbb C^3\). With \(D_*=3\), \(d_u=1\), and \(\eta=0\), the full ordered off-diagonal sum is \(2\le16/3\). The pair \((1,2)\) nevertheless has squared correlation \(1>1/3\), and its two-element subfamily has off-diagonal sum \(2>4/3\). The source's every-pair `Conclusion1` does yield the family theorem for every finite subfamily; one averaged twirling identity alone does not.

### 5.2 Trace concentration does not create Gram positivity

Let \(M_n=\operatorname{diag}(-1,1,\ldots,1)\) on \(\mathbb C^n\), \(n>2\). Then

\[
\operatorname{tr}M_n=n-2>0,\quad
\operatorname{tr}(M_n^2)=n,\quad
\frac{n\operatorname{tr}(M_n^2)}{(\operatorname{tr}M_n)^2}
=\frac{n^2}{(n-2)^2}\longrightarrow1.
\tag{25}
\]

Every \(M_n\) still has eigenvalue \(-1\). A positive trace and a nearly optimal second-moment ratio therefore do not establish positive semidefiniteness of a target that has not been proved to be a Gram operator. In Theorem 1, positivity comes from (1) and (4) before any trace estimate is used.

## 6. The exact squared-distance identity, including singular blocks

Let \(C_e:X\to\mathcal H\) and \(C_o:Y\to\mathcal H\) be maps between finite-dimensional Hilbert spaces. Put

\[
D=C_e^*C_e,\qquad B=C_e^*C_o,\qquad E=C_o^*C_o,
\qquad \Pi_e=C_eD^\dagger C_e^*,
\tag{26}
\]

where \(D^\dagger\) is the Moore–Penrose pseudoinverse. Then \(\Pi_e\) is the orthogonal projection onto \(\operatorname{range}C_e\), \(\operatorname{range}B\subseteq\operatorname{range}D\), and

\[
\boxed{\ E-B^*D^\dagger B=C_o^*(I-\Pi_e)C_o\succeq0.\ }
\tag{27}
\]

For every \(y\), this says

\[
\langle y,(E-B^*D^\dagger B)y\rangle
=\min_x\|C_oy-C_ex\|^2
=\operatorname{dist}(C_oy,\operatorname{range}C_e)^2.
\tag{28}
\]

**Proof.** Take a singular value decomposition of \(C_e\). On each positive singular value \(s\), the corresponding eigenvalue of \(D^\dagger\) is \(s^{-2}\), so \(C_eD^\dagger C_e^*\) is one on the image direction and zero on its orthogonal complement. If \(x\in\ker D=\ker C_e\), then \(B^*x=C_o^*C_ex=0\), which proves the range inclusion. Substituting (26) proves (27); orthogonal projection gives (28). No inverse on the nullspace and no uniform spectral gap is used.

The useful geometric construction would be independently defined arithmetic maps \(C_e,C_o\) reproducing the intended even, cross, and odd blocks. Factoring a desired matrix after assuming its positivity would make (27) circular as a positivity proof. Nor does (27) identify the project's older bridge operators with the source's arithmetic maps without an explicit intertwining identity.

## 7. A whole-form limit that does not require a gap

Fix a finite coefficient space \(\mathbb C^n\). Suppose Hermitian matrices \(W_j\) converge entrywise to \(W\), actual Gram matrices \(G_j=C_j^*C_j\) satisfy

\[
W_j\succeq G_j-\varepsilon_jI,
\qquad \varepsilon_j\ge0,\qquad \varepsilon_j\to0.
\tag{29}
\]

Then \(W\succeq0\). For each fixed \(c\in\mathbb C^n\),
\(c^*W_jc\ge-\varepsilon_j\|c\|^2\), and passage to the limit proves \(c^*Wc\ge0\). Entrywise convergence suffices because \(n\) is fixed. If this construction is supplied separately for every finite test family, it gives positivity on each such family; it needs neither one truncation uniform over all families nor a positive lower bound on the smallest Gram eigenvalue.

The comparison in (29) must control the complete quadratic form, including every cross term and every retained arithmetic contribution. Trace estimates such as (23) cannot replace it. To turn the source-side frame construction into positivity for a specified Weil or Pick form, one still needs the arithmetic map, its normalization, the exact identification or comparison of forms, and errors that vanish for each fixed family. This note proves the finite geometric module and makes that remaining interface explicit.
