# RH even derivative relative-leakage comparison barrier

## 0. Exact outcome and claim boundary

Let

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil .                  \tag{0.1}
\]

Work on the conditional branch where every nontrivial zero is on the
critical line, and retain the finite strict hypotheses of checkpoints
1.37--1.39.  The strongest derivative comparison uses the actual projected
finite prolate state itself:

\[
 p_N=p_N^{\rm pr},
 \qquad
 q_N={\|p_N\|_{\mathfrak Z}^2\over2\|p_N\|_2^2},
 \qquad
 d_N=\sqrt L\,p_N(L/2).                              \tag{0.2}
\]

Put

\[
 f_N=p_N-d_Ne_0,
 \qquad z_N^{\rm pr}=p_N''=f_N'',
 \qquad
 r_N^{\rm pr}={\|z_N^{\rm pr}\|_{\mathfrak Z}^2
                    \over2\|z_N^{\rm pr}\|_2^2}.      \tag{0.3}
\]

The centered Fourier convention makes both the value and first derivative
of \(f_N\) vanish at both finite endpoints.  Hence, for every complex
transform parameter,

\[
 \boxed{\widehat {z_N^{\rm pr}}(t)=-t^2\widehat f_N(t).}
                                                               \tag{0.4}
\]

If \(\gamma_*\) is the least positive ordinate, \(q_N>0\), and

\[
 C_0=\|e_0\|_{\mathfrak Z},
 \qquad
 \eta_N^{\rm pr}={|d_N|C_0\over
           \sqrt{2q_N}\,\|p_N\|_2}
        ={|d_N|C_0\over\|p_N\|_{\mathfrak Z}},         \tag{0.5}
\]

then the exact actual-state comparison is

\[
 \boxed{
 {r_N^{\rm pr}\over q_N}
 \geq
 \gamma_*^4{\|p_N\|_2^2\over\|p_N''\|_2^2}
 (1-\eta_N^{\rm pr})_+^2.}                            \tag{0.6}
\]

This removes the reference mismatch, its comparison error, and its
second boundary primitive.  Moreover,

\[
 {\|p_N''\|_2^2\over\|p_N\|_2^2}
 \longrightarrow
 m_4:={\displaystyle\int_{\mathbb R}t^4|\Xi(t)|^2\,dt
              \over
             \displaystyle\int_{\mathbb R}|\Xi(t)|^2\,dt}.             \tag{0.7}
\]

The endpoint problem nevertheless remains relative.  The frozen
all-order argument proves that \(d_N\) is smaller than every fixed power of
\(\lambda^{-1}\), but it supplies no positive lower bound for
\(\|p_N\|_{\mathfrak Z}\).  It therefore does not prove
\(\eta_N^{\rm pr}=o(1)\).  The exact rational formula in Section 3 shows
that the missing assertion compares one projective-infinity value with the
whole moving family of zero rows.

There is a second independent obstruction.  Define the one-vector
saturation factor

\[
 \kappa_N={r_N^{\rm pr}\over\lambda_{\min}(A^\circ)}
 \geq1.                                                \tag{0.8}
\]

For \(0<\rho<1\), (0.6) gives the sufficient checkpoint-1.38 gate

\[
 \boxed{
 {\kappa_N\|p_N''\|_2^2\over
  \gamma_*^4\|p_N\|_2^2(1-\eta_N^{\rm pr})^2}
 <1-\rho
 \quad\Longrightarrow\quad
 \delta_+>\rho,}                                      \tag{0.9}
\]

provided \(\eta_N^{\rm pr}<1\).  No frozen theorem bounds \(\kappa_N\).
Thus even a proof of \(\eta_N^{\rm pr}=o(1)\) would not by itself close the
reserve: one Rayleigh upper test cannot become an all-vector lower bound.

Section 6 retains the smooth \(K_\infty\) comparison as a secondary
refinement.  Its correction should be kept as one combined sampling
vector; splitting it loses possible cancellation.

No quantitative even reserve, shifted-node uniqueness, determinant
convergence, prolate-anchor response bound, actual-arithmetic sign failure,
new zero theorem, RH proof or converse, or de Bruijn--Newman \(\Lambda\)
bound is obtained.  The standard eight are unchanged and the formal state
remains P0_INVALIDATED.

## 1. Frozen inputs

The following ten frozen repository bytes are imported.  The first eight
are the unchanged comparison dependencies; the final pair supplies the
explicit first prolate correction used only in (4.12)--(4.13).

| Dependency | SHA-256 |
|---|---|
| notes/RH_EVEN_ZERO_GRAM_GEVREY_RELATIVE_RESERVE_BARRIER.md | 4527a5cc5ba8a7c66b76ff70c4aa4423aaecd60fe10ba52cee134b9d9c2ef36c |
| tests/test_rh_even_zero_gram_gevrey_relative_reserve_barrier.py | fe276d7e4e60f1f40ec10fc4dac1cee8084fc3e8df969fa3a9f30ef64cd4ad86 |
| notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md | 384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c |
| tests/test_gevrey_prolate_remainder.py | 93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058 |
| notes/DERIVATIVE_RADICAL_ODD_SPLIT.md | abac446060d19ccd8ced9e4fb3aef3aedfa643d14494556b661cfba79bfbad95 |
| tests/test_derivative_radical_odd_split.py | 507728a8391d06135e62a48f7cabd9db73874049965c5e37631c563ec8815b44 |
| notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md | e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f |
| tests/test_transverse_xi_radical_moment_angle_obstruction.py | 3cbea43c78355fcece4dec25a76280ee23e5c706b0d509c2951b003d3a531c75 |
| notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md | d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd |
| tests/test_first_prolate_correction.py | 9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991 |

The checkpoint-1.39 pair supplies the exact even zero Gram, its
positive-index block, and the min--max direction.  The Gevrey pair supplies
the actual projected prolate state and absolute leakage estimates.  The
derivative pair fixes the centered endpoint convention and the fixed-order
all-order expansion.  The transverse pair supplies

\[
 \widehat K_\infty(t)={\Xi(t)\over4},
 \qquad
 \widehat {K_\infty''}(t)=-{t^2\Xi(t)\over4}.          \tag{1.1}
\]

No zero table, external source, numerical quadrature, source lock, or
standard-eight edit is added.

## 2. The actual finite-state derivative theorem

Put \(\ell=L/2\) and use the centered orthonormal modes

\[
 \phi_n(x)={(-1)^n\over\sqrt L}e^{i\omega_nx},
 \qquad
 \omega_n={2\pi n\over L},
 \qquad |n|\leq N,
 \qquad e_0=\phi_0.                                    \tag{2.1}
\]

Every mode has the same endpoint value:

\[
 \phi_n(-\ell)=\phi_n(\ell)=L^{-1/2},
 \qquad
 \delta\!\left(\sum_na_n\phi_n\right)=\sum_na_n.       \tag{2.2}
\]

The actual state is real and even, so

\[
 p_N=\sum_{|n|\leq N}a_n\phi_n,
 \qquad a_{-n}=a_n\in\mathbb R,
 \qquad d_N=\delta p_N=\sum_{|n|\leq N}a_n.            \tag{2.3}
\]

Consequently \(f_N=p_N-d_Ne_0\) has zero endpoint values.  Its endpoint
derivatives vanish as well: the terms with indices \(n\) and \(-n\)
cancel pairwise.  Coefficientwise differentiation gives

\[
 \boxed{
 f_N(\pm\ell)=f_N'(\pm\ell)=0,
 \qquad
 f_N''=p_N''
 =-\sum_{0<|n|\leq N}\omega_n^2a_n\phi_n.}            \tag{2.4}
\]

Thus \(z_N^{\rm pr}=p_N''\) has zero central coefficient and belongs to the
positive-index even block \(E_{N,+}^\circ\).  Twice integrating by parts
in the compact Fourier transform proves (0.4), with no boundary remainder.

On RH use the repository paired sampling norm

\[
 \|h\|_{\mathfrak Z}^2
 =4\sum_{\gamma>0}m_\gamma|\widehat h(\gamma)|^2.      \tag{2.5}
\]

There is no zero-height coordinate.  Therefore (0.4) gives

\[
 \boxed{
 \|z_N^{\rm pr}\|_{\mathfrak Z}^2
 =4\sum_{\gamma>0}m_\gamma\gamma^4
             |\widehat f_N(\gamma)|^2
 \geq\gamma_*^4\|f_N\|_{\mathfrak Z}^2.}              \tag{2.6}
\]

The central-mode samples and their exact finite bound are

\[
 \widehat e_0(\gamma)
 ={2\sin(\gamma L/2)\over\sqrt L\,\gamma},
 \qquad
 C_0^2={16\over L}\sum_{\gamma>0}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 \leq{16\over L}\sum_{\gamma>0}{m_\gamma\over\gamma^2}.
                                                               \tag{2.7}
\]

The final zero sum converges with multiplicity.  Since

\[
 \|f_N\|_{\mathfrak Z}
 \geq\left(\|p_N\|_{\mathfrak Z}-|d_N|C_0\right)_+,
 \qquad
 \|p_N\|_{\mathfrak Z}
 =\sqrt{2q_N}\,\|p_N\|_2,                              \tag{2.8}
\]

substitution into (2.6) proves (0.6), including the factor
\(\gamma_*^4\), the factor \(2\) in both Rayleigh quotients, and the
positive part.  No \(K_\infty\) comparison is used in this theorem.

## 3. Exact endpoint-versus-zero-row quotient

Absorb the paired centered coefficients into real cosine coordinates:

\[
 p_N(x)={1\over\sqrt L}
 \left[
 p_0+\sum_{n=1}^Np_n(-1)^n
       \cos\!\left({2\pi nx\over L}\right)
 \right].
                                                               \tag{3.1}
\]

Define the endpoint trace and rational anchor factor

\[
 d_N=\sum_{n=0}^Np_n=\sqrt L\,p_N(\ell),
 \qquad
 H_N(s)=p_0+s^2\sum_{n=1}^N{p_n\over s^2-n^2}.         \tag{3.2}
\]

Direct integration gives, with continuous interpretation at a carrier,

\[
 \boxed{
 \widehat p_N(t)
 ={2\sin(tL/2)\over\sqrt L\,t}
 H_N\!\left({tL\over2\pi}\right).}                    \tag{3.3}
\]

The endpoint is the same rational datum at projective infinity:

\[
 \boxed{\lim_{|s|\to\infty}H_N(s)=d_N.}               \tag{3.4}
\]

Combining (2.5), (2.7), and (3.3) gives the exact source-specific
relative endpoint formula

\[
 \boxed{
 (\eta_N^{\rm pr})^2
 =
 {d_N^2\displaystyle\sum_{\gamma>0}
       {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
  \over
  \displaystyle\sum_{\gamma>0}
       {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
       \left|H_N\!\left({\gamma L\over2\pi}\right)\right|^2}.}
                                                               \tag{3.5}
\]

At \(\gamma L/(2\pi)\in\mathbb Z\), the product of the sine factor and the
rational pole is interpreted by its finite limit from (3.3).  Formula
(3.5) is valid whenever \(q_N>0\).

This identifies the exact missing theorem.  One must compare
\(H_N(\infty)\) with the same rational factor on every actual zero row.
An absolute estimate for \(d_N\), a zero count, or compact transform
convergence does not orient this quotient.  The actual prolate coefficient
relations are present in \(H_N\), but no frozen identity turns its
projective-infinity value into a lower bound for its moving zero-row
weighted norm.

## 4. Ordinary second-derivative convergence and its limitation

In centered logarithmic coordinates write

\[
 F_\lambda=(C_\lambda K_\lambda)(e^{\,\cdot}),
 \qquad
 p_N=P_NF_\lambda,
 \qquad
 H_{\lambda,M}=\sum_{j=0}^M\lambda^{-2j}G_j,
 \qquad G_0=K_\infty.                                  \tag{4.1}
\]

For each fixed \(M\), the admitted all-order expansion gives

\[
 \|F_\lambda-H_{\lambda,M}\|_2
 =O(\lambda^{-2M-1}).                                  \tag{4.2}
\]

Decompose

\[
 p_N''-K_\infty''
 =\{P_N(F_\lambda-H_{\lambda,M})\}''
  +\{P_NH_{\lambda,M}-H_{\lambda,M}\}''
  +\{H_{\lambda,M}''-K_\infty''\}.                     \tag{4.3}
\]

With \(\Omega_N=2\pi N/L=O(\lambda L^2)\), Bernstein's inequality bounds
the first term by

\[
 \Omega_N^2\|F_\lambda-H_{\lambda,M}\|_2
 =O(\lambda^{-2M+1}L^4).
                                                               \tag{4.4}
\]

The minimal fixed choice \(M=1\) gives
\(O(\lambda^{-1}L^4)=o(1)\).  For each fixed smooth \(G_j\), \(r\)
integrations by parts give the two-derivative projection tail

\[
 \|\{(I-P_N)G_j\}''\|_2
 =O_r\!\left(L^{r-5/2}N^{-r+5/2}\right)
   +O_{r,B}(\lambda^{-B}).                             \tag{4.5}
\]

The endpoint derivative differences are flat because every derivative of
\(G_j\) has faster-than-exponential decay.  At \(r=3\) and
\(N\asymp\lambda L^3\), the displayed term is exactly of order

\[
 L^{1/2}N^{-1/2}
 =O(\lambda^{-1/2}L^{-1})=o(1).                        \tag{4.6}
\]

Finally,

\[
 \|H_{\lambda,M}''-K_\infty''\|_{L^2(I)}
 \leq\sum_{j=1}^M\lambda^{-2j}\|G_j''\|_2
 +\|K_\infty''\|_{L^2(\mathbb R\setminus I)}
 \longrightarrow0.                                    \tag{4.7}
\]

Equations (4.3)--(4.7), and the analogous argument without derivatives,
prove

\[
 \|p_N-K_\infty\|_2\longrightarrow0,
 \qquad
 \|p_N''-K_\infty''\|_2\longrightarrow0.              \tag{4.8}
\]

The locked transform (1.1) and Plancherel prove (0.7).  In particular,
\(p_N''\ne0\) for all sufficiently large \(\lambda\).

Endpoint evaluation uses stronger estimates than ordinary \(L^2\)
convergence.  The finite-space evaluation norm gives

\[
 \sqrt L\,
 |P_N(F_\lambda-H_{\lambda,M})(\ell)|
 \leq\sqrt{2N+1}\,O(\lambda^{-2M-1}).                  \tag{4.9}
\]

For a fixed \(G_j\), summing the \(r\)-fold coefficient estimate in
\(\ell^1\) gives

\[
 \sqrt L\,|(I-P_N)G_j(\ell)|
 =O_r(L^{r-1/2}N^{-r+1})
  +O_{r,B}(\lambda^{-B}).                              \tag{4.10}
\]

Together with the flat global endpoints, choosing \(M,r,B\) after any
fixed power proves

\[
 d_N=O_A(\lambda^{-A})
 \qquad\hbox{for every fixed }A>0.                     \tag{4.11}
\]

This is still an absolute statement and cannot be divided by an unknown
\(\|p_N\|_{\mathfrak Z}\).

There is also a precise nonuniformity warning.  The first formal
correction has the exact transforms

\[
 \widehat G_1(t)={2t^2-21\over128\pi}\,\Xi(t),
 \qquad
 {\lambda^{-2}\widehat G_1(t)\over\widehat K_\infty(t)}
 ={2t^2-21\over32\pi\lambda^2}                         \tag{4.12}
\]

where the quotient is read away from zeros of \(\Xi\).  At the natural
cutoff \(\Omega_N\sim2\pi\lambda L^2\), its leading size is

\[
 {2\Omega_N^2\over32\pi\lambda^2}
 \sim{\pi\over4}L^4,
                                                               \tag{4.13}
\]

not \(o(1)\).  Fixed-order central prolate expansion is therefore not a
uniform relative approximation across the full leakage cutoff.  This does
not prove that \(\eta_N^{\rm pr}\) fails: (4.8) needs only two ordinary
derivatives, while (3.5) is a phase-sensitive relative zero-sampling
quotient.

## 5. The exact reserve gate and missing saturation

Retain the three distinct quantities

\[
 0<\mu\leq q_N,
 \qquad
 0<\lambda_{\min}(A^\circ)\leq r_N^{\rm pr},
 \qquad
 \delta_+=1-{\mu\over\lambda_{\min}(A^\circ)}.         \tag{5.1}
\]

They must not be identified.  By definition of \(\kappa_N\),

\[
 {\mu\over\lambda_{\min}(A^\circ)}
 ={\mu\over q_N}\,{q_N\over r_N^{\rm pr}}\,\kappa_N.   \tag{5.2}
\]

When \(\eta_N^{\rm pr}<1\), (0.6), (5.1), and (5.2) give

\[
 \boxed{
 {\mu\over\lambda_{\min}(A^\circ)}
 \leq
 {\kappa_N\|p_N''\|_2^2\over
  \gamma_*^4\|p_N\|_2^2(1-\eta_N^{\rm pr})^2}.}        \tag{5.3}
\]

This proves the sufficient gate (0.9).  If one separately had
\(\eta_N^{\rm pr}\to0\), then a sufficient asymptotic condition would be

\[
 \limsup_{N\to\infty}{\kappa_Nm_4\over\gamma_*^4}
 <1-\rho.                                             \tag{5.4}
\]

For checkpoint 1.38 one substitutes its locked target
\(\rho=\rho_j=(\gamma_j/\gamma_{j+1})^2+\eta<1\).
Neither factor required by (5.4) is certified here: the relative endpoint
estimate is open, and no all-vector theorem bounds \(\kappa_N\).

The wrong variational direction is sharp already for positive matrices.
For \(M>1+\varepsilon\), put

\[
 A_{\varepsilon,M}
 =\operatorname {diag}(1,1+\varepsilon,M),
 A^\circ_{\varepsilon,M}
 =\begin{pmatrix}1+\varepsilon&0\\0&M\end{pmatrix},
 \quad
 \mu=\lambda_{\min}(A_{\varepsilon,M})=1,
 \quad
 p={1\over\sqrt2}\begin{pmatrix}1\\1\\0\end{pmatrix},
 \quad
 q=\langle p,A_{\varepsilon,M}p\rangle
   =1+{\varepsilon\over2},
 \qquad
 v=\begin{pmatrix}0\\1\end{pmatrix}.                  \tag{5.5}
\]

Then

\[
 {\langle v,A^\circ_{\varepsilon,M}v\rangle\over q}
 ={M\over1+\varepsilon/2}\longrightarrow\infty,
 \qquad
 \delta_+={\varepsilon\over1+\varepsilon}
 \longrightarrow0.                                    \tag{5.6}
\]

Thus a favorable derivative-to-state Rayleigh ratio can coexist with an
arbitrarily poor reserve.  This is a finite positive-matrix countermodel,
not the actual source-Cauchy matrix.  Closing the reserve needs an
all-vector bound such as

\[
 \langle g,A^\circ g\rangle
 >{\mu\over1-\rho}\|g\|_2^2
 \qquad(0\ne g\in E_{N,+}^\circ),                      \tag{5.7}
\]

or an equivalent theorem controlling the saturation factor.

## 6. Secondary combined-reference refinement

The older smooth comparison remains exact but is no longer the lead
theorem.  Let

\[
 p_N^\infty=P_NC_\lambda K_\infty,
 \qquad
 u_N=p_N-p_N^\infty,
 \qquad
 w_N=P_NC_\lambda K_\infty''.                         \tag{6.1}
\]

Twice integrating by parts gives, for every retained coefficient,

\[
 \langle\phi_n,C_\lambda K_\infty''\rangle
 =-\omega_n^2a_n+c_N,
 \qquad
 c_N={2K_\infty'(\ell)\over\sqrt L}.                  \tag{6.2}
\]

Thus \(c_N\) is the central coefficient of \(w_N\), but deleting that
central coefficient does not delete its noncentral copies.  Define

\[
 S_{2,N}=\sum_{0<|n|\leq N}\omega_n^{-2},
 \qquad
 \psi_N=\sum_{0<|n|\leq N}\omega_n^{-2}\phi_n
              -S_{2,N}\phi_0.                         \tag{6.3}
\]

Then

\[
 \delta\psi_N=0,
 \qquad
 \psi_N''=-\sum_{0<|n|\leq N}\phi_n.                  \tag{6.4}
\]

With

\[
 d_N^\infty=\delta p_N^\infty,
 \qquad
 f_N^\infty=p_N^\infty-d_N^\infty e_0-c_N\psi_N,
 \qquad
 z_N^\infty=w_N-c_Ne_0,                               \tag{6.5}
\]

coefficientwise calculation gives

\[
 \delta f_N^\infty=0,
 \qquad
 (f_N^\infty)'(\pm\ell)=0,
 \qquad
 (f_N^\infty)''=z_N^\infty.                           \tag{6.6}
\]

The comparison should preserve cancellation by keeping the full error

\[
 E_N=u_N+d_N^\infty e_0+c_N\psi_N,
 \qquad
 f_N^\infty=p_N-E_N.                                  \tag{6.7}
\]

Define

\[
 \eta_N^{\rm comb}={\|E_N\|_{\mathfrak Z}
                      \over\|p_N\|_{\mathfrak Z}},
 \qquad
 \eta_N^{\rm split}={
  \|u_N\|_{\mathfrak Z}
  +|d_N^\infty|C_0+|c_N|\|\psi_N\|_{\mathfrak Z}
  \over\|p_N\|_{\mathfrak Z}}.                        \tag{6.8}
\]

The triangle inequality gives

\[
 \boxed{\eta_N^{\rm comb}\leq\eta_N^{\rm split}.}      \tag{6.9}
\]

If

\[
 r_N^\infty={\|z_N^\infty\|_{\mathfrak Z}^2
                         \over2\|z_N^\infty\|_2^2},
                                                               \tag{6.10}
\]

then the same lower-ordinate argument gives the sharper reference formula

\[
 \boxed{
 {r_N^\infty\over q_N}
 \geq
 \gamma_*^4{\|p_N\|_2^2\over\|z_N^\infty\|_2^2}
 (1-\eta_N^{\rm comb})_+^2.}                           \tag{6.11}
\]

The explicit auxiliary norm remains finite:

\[
 \|\psi_N\|_{\mathfrak Z}^2
 \leq8NL\sum_{\gamma>0}{m_\gamma\over\gamma^4}.        \tag{6.12}
\]

Separate absolute bounds for the three terms in (6.8) do not prove either
relative eta tends to zero.  The combined form is strictly preferable
because it does not discard cancellation, but the actual-state theorem
(0.6) avoids all three reference corrections except the actual endpoint
trace itself.

## 7. Exact finite phase countermodels

These examples test only endpoint and sample algebra.  Take
\(I=[-\pi,\pi]\), \(\gamma=1/2\), and write

\[
 C_n=\int_{-\pi}^{\pi}\cos(nx)e^{-ix/2}\,dx
 ={(-1)^n\over1/4-n^2},
 \qquad
 C_0=4,\quad C_1={4\over3},\quad C_2=-{4\over15}.      \tag{7.1}
\]

First put

\[
 p_0=-{1\over5}+{4\over5}\cos x+\cos2x,
 \qquad
 p_1=4\cos x+5\cos2x.                                 \tag{7.2}
\]

Direct rational substitution gives

\[
 \begin{array}{c|ccc}
 &p(\pi)&\widehat p(1/2)&\widehat {p''}(1/2)\\ \hline
 p_0&0&0&0\\
 p_1&1&4&0
 \end{array}.                                         \tag{7.3}
\]

For \(p_\varepsilon=p_0+\varepsilon p_1\), the state sample is
\(4\varepsilon\) while the second-derivative sample is zero.  Adding
finitely many generic atoms with total weight
\(\tau=o(\varepsilon^2)\) can make the Gram strict while

\[
 q_\varepsilon\asymp\varepsilon^2,
 \qquad
 r_\varepsilon=O(\tau),
 \qquad
 {r_\varepsilon\over q_\varepsilon}\longrightarrow0.   \tag{7.4}
\]

For the opposite direction put

\[
 u={1\over4}-{3\over4}\cos x,
 \qquad
 v={3\over16}(1+\cos x).                               \tag{7.5}
\]

The exact table is

\[
 \begin{array}{c|ccc}
 &p(\pi)&\widehat p(1/2)&\widehat {p''}(1/2)\\ \hline
 u&1&0&1\\
 v&0&1&-1/4
 \end{array}.                                         \tag{7.6}
\]

For

\[
 \widetilde p_\varepsilon=p_0+\varepsilon u+\varepsilon^2v,            \tag{7.7}
\]

one has

\[
 \widetilde p_\varepsilon(\pi)=\varepsilon,
 \qquad
 \widehat{\widetilde p_\varepsilon}(1/2)=\varepsilon^2,
 \qquad
 \widehat{\widetilde p_\varepsilon''}(1/2)
 =\varepsilon-{\varepsilon^2\over4}.                   \tag{7.8}
\]

After adding generic strictifying atoms with total weight
\(o(\varepsilon^4)\),

\[
 \widetilde q_\varepsilon\asymp\varepsilon^4,
 \qquad
 \widetilde r_\varepsilon\asymp\varepsilon^2,
 \qquad
 {\widetilde r_\varepsilon\over\widetilde q_\varepsilon}
 \longrightarrow+\infty.                              \tag{7.9}
\]

Scaling \(\varepsilon\) exponentially puts all displayed samples under a
common qualitative exponential envelope while preserving the opposite
ratios.  These are finite phase and sampling countermodels only.  They are
not the actual prolate state, the actual source-Cauchy matrix, or the zeta
divisor.  They show why absolute envelopes cannot replace (3.5).

## 8. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. replaces the actual-state theorem by the smooth reference state;
2. deletes the actual endpoint trace \(d_N\);
3. infers \(\eta_N^{\rm pr}=o(1)\) from absolute endpoint decay;
4. treats the first-correction expansion as relatively uniform at
   \(\Omega_N\);
5. identifies \(\mu\), \(q_N\), \(r_N^{\rm pr}\), or
   \(\lambda_{\min}(A^\circ)\);
6. drops \(\kappa_N\) from the sufficient reserve gate;
7. turns \(\lambda_{\min}(A^\circ)\leq r_N^{\rm pr}\) into a lower bound;
8. splits the secondary combined reference correction and calls the
   resulting larger eta exact;
9. treats the finite phase models as the actual source or zeta divisor; or
10. infers shifted-node uniqueness, determinant convergence, RH, a
    converse from RH, or a de Bruijn--Newman \(\Lambda\) bound.

The exact advance is (0.6), its source-specific quotient is (3.5), and its
conditional checkpoint-1.38 gate is (0.9).  Completion still needs both a
relative endpoint theorem for the actual prolate coefficients and an
all-vector estimate controlling \(\kappa_N\).  Neither follows from common
Gevrey envelopes, two ordinary derivatives, strictness alone, or the
current zero count.
