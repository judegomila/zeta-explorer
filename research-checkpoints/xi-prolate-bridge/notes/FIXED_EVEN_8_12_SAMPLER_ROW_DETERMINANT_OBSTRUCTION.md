# Fixed-even label-8/12 sampler-row determinant obstruction

## 0. Exact result and fail-closed boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2={\pi p^2\over2},\qquad A=\lambda^2.
                                                               \tag{0.1}
\]

Let \(e_\lambda,v_\lambda\) be the exact full-exterior-
\(D_\lambda\)-orthonormal endpoint/null basis in the fixed, real
label-`8/12` plane.  Thus

\[
 \eta(e_\lambda)=r_\lambda,
 \qquad \eta(v_\lambda)=0,
 \qquad r_\lambda=2\sqrt{\pi\lambda}\{1+o(1)\}.       \tag{0.2}
\]

Write \(\Gamma_i=\Gamma_{\rm out}(i)=B_i(0+)\) for the exact outward
sampler trace.  This note proves the asymptotic formula

\[
 \boxed{
 \Gamma_v(\lambda)
 =-\sum_{m=2}^\infty b_m
   \cos\!\left({\pi p^2\over2}\sqrt{m^2-1}
        +{21\over2}\arctan{1\over\sqrt{m^2-1}}\right)+o(1),}   \tag{0.3}
\]

where

\[
 b_m={2(m^2-1)^{1/4}\over\sqrt{\pi m}\,m^2},
 \qquad 0<b_m\leq {2\over\sqrt\pi\,m^2}.             \tag{0.4}
\]

The series in (0.3) is absolutely and uniformly convergent.  Its locked
odd-\(p\) values have zero as a limit point.  The exact trace therefore
satisfies

\[
 \boxed{\liminf_{\substack{p\longrightarrow\infty\\p\ \operatorname {odd}}}
       |\Gamma_v(p/2)|=0.}                             \tag{0.5}
\]

Consequently the proposed fixed-anchor row matrix

\[
 M_\lambda=
 \begin{pmatrix}r_\lambda&0\\
                 \Gamma_e&\Gamma_v\end{pmatrix}       \tag{0.6}
\]

has no uniformly bounded right inverse in the physical row scaling obtained
by normalizing only the endpoint row by its exact norm.  In that scaling
the determinant is \(\Gamma_v\), and the least singular value is at most
\(|\Gamma_v|\).  The raw determinant \(r_\lambda\Gamma_v\) is not a
condition number and must not be used as one.  No claim is made about an
arbitrary parameter-dependent renormalization of both rows.

Equation (0.5) does **not** prove that an exact locked trace ever vanishes.
Thus the frozen fixed-prefix/Jost/Poisson results prove neither eventual
nonvanishing nor eventual singularity of (0.6).  They do prove that no
bound \(|\Gamma_v|\geq\kappa>0\) can hold.  Exact invertibility would
require a new arithmetic small-divisor theorem; uniform boundedness of the
inverse is impossible for these two fixed anchors.

There is a useful algebraic qualification.  Whenever \(M_\lambda\) is
invertible, the two-row source shear leaves the exact `2 by 2` anchor
principal block unchanged.  More strongly, the generalized Schur
complement of the anchor block in \(H-\mu D\) is exactly invariant under
the shear.  Hence bad conditioning does not invalidate a congruence of an
already-proved whole-span inequality.  It does prevent the present
fixed-plane theorem from being combined with separately estimated rest
and cross blocks whose constants are not stable under an unbounded shear.

This is a fixed-anchor obstruction, not a negative direction for the
complete central form.  It proves no pre-Hermitian row factorization, no
Hypothesis `PA`, no growing-rest floor, no singleton Schur floor, and no RH
conclusion.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

No external input is used.  The pointwise endpoint argument and the exact
row convention are frozen at the following bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py` | `545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py` | `b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |

All estimates below are fixed-label estimates.  No assertion is uniform
after the anchor labels are allowed to move.

## 2. Exact trace and its pointwise Jost limit

For a real even corrected source \(f\), the frozen physical-boundary
calculation gives

\[
 \Gamma_{\rm out}(f)
 ={1\over2\sqrt\lambda}
   \sum_{1\leq n<A}f(n/\lambda)=B_f(0+).               \tag{2.1}
\]

The inventory in (2.1) is unambiguous because \(A=p^2/4\) is not an
integer.  The inward trace differs by the endpoint row:

\[
 \Gamma_{\rm in}(f)-\Gamma_{\rm out}(f)
 ={\sqrt\lambda\over2}\eta(f).                        \tag{2.2}
\]

In particular the two traces agree on \(v_\lambda\), but (2.2) does not
make their common value zero.

Put

\[
 x_m=\sqrt{m^2-1},\qquad
 \beta_m=\arctan(1/x_m),\qquad m\geq2.                 \tag{2.3}
\]

Every sample in (2.3) lies in the Jost range already at \(s=0\).  The
complete pointwise theorem gives an exact leading `8/12` amplitude
\(b_{m,c}\), with

\[
 b_{m,c}\longrightarrow b_m
 ={2\sqrt{x_m}\over\sqrt{\pi m}(1+x_m^2)},
 \qquad |b_{m,c}|\leq Km^{-2}.                         \tag{2.4}
\]

The convergence is pointwise in \(m\), while the majorant is summable.
The exact mean phase satisfies

\[
 \bar\nu_c={\nu_8+\nu_{12}\over2}
 ={21\over2}+O(c^{-1}).                                \tag{2.5}
\]

Specifically, equations (3.16), (4.4), and (4.11)--(4.12) of the frozen
complete Volterra theorem give the pointwise error, hard-edge value,
limiting amplitude, and summable majorant used here; equations (2.7)--
(2.10) of the fixed-plane theorem pin the same physical-profile
normalization.  At \(s=0\), the summed Jost error is \(O(c^{-1/2})\).
The omitted \(m=1\) hard-edge value is exponentially small, not identically
zero; the lower divided differences and invisible bump are smaller still.
Therefore

\[
 \Gamma_v(\lambda)
 =-\sum_{m=2}^\infty b_{m,c}
       \cos(c x_m+\bar\nu_c\beta_m)+o(1).              \tag{2.6}
\]

Dominated convergence may be applied to the difference between (2.6) and
the right side of (0.3).  Equations (0.1), (2.4), and (2.5) then prove
(0.3).  This passage is pointwise at the physical boundary.  An `L2`
profile replacement alone would not justify it.

## 3. The infinite-torus obstruction

For every \(m\geq2\), write uniquely

\[
 m^2-1=k_m^2d_m,                                       \tag{3.1}
\]

where \(k_m\) is a positive integer and \(d_m>1\) is squarefree.  The
inequalities

\[
 (m-1)^2<m^2-1<m^2                                     \tag{3.2}
\]

show that \(d_m\ne1\).  Let \({\cal D}\) be the set of squarefree parts
which occur in (3.1), and put

\[
 {\mathbb T}^{\cal D}
 =\prod_{d\in\cal D}(\mathbb R/2\pi\mathbb Z).         \tag{3.3}
\]

On this compact connected group define

\[
 G(\theta)=-\sum_{m=2}^\infty b_m
   \cos\!\left(k_m\theta_{d_m}+{21\over2}\beta_m\right).
                                                               \tag{3.4}
\]

The majorant in (0.4) makes (3.4) uniformly convergent, so \(G\) is a
continuous real function.  Each summand is a nontrivial character in one
circle coordinate.  Hence, for Haar probability measure \(m_{\cal D}\),

\[
 \int_{{\mathbb T}^{\cal D}}G\,dm_{\cal D}=0.           \tag{3.5}
\]

The function is not identically zero: the \(d=3,k=1\) Fourier coefficient
comes from \(m=2\) and has nonzero modulus.  Since the continuous image of
a connected space is connected, (3.5) implies that \(G\) takes both signs
and has a zero.

It remains to relate that zero to the locked schedule.  Set

\[
 \theta_d(p)={\pi p^2\over2}\sqrt d\pmod {2\pi}.
                                                               \tag{3.6}
\]

For any finite \({\cal D}_0\subset{\cal D}\), any nonzero integer vector
\(h=(h_d)_{d\in{\cal D}_0}\), and \(p=2n+1\), the Weyl polynomial is

\[
 {1\over2\pi}\sum_{d\in{\cal D}_0}h_d\theta_d(2n+1)
 =\left(n^2+n+{1\over4}\right)
      \sum_{d\in{\cal D}_0}h_d\sqrt d.                \tag{3.7}
\]

Distinct squarefree radicals, together with `1`, are linearly independent
over the rationals.  This follows, for example, by applying the sign
characters of the finite multiquadratic field generated by the primes in
\({\cal D}_0\).  The last coefficient in (3.7) is therefore irrational.
Weyl's criterion proves that the odd-\(p\) sequence (3.6) is equidistributed
in every finite coordinate projection of (3.3).

Given a zero \(\theta^*\) of \(G\), first choose finitely many coordinates
so that the omitted tail in (3.4) is small.  Finite-dimensional
equidistribution supplies arbitrarily large odd \(p\) whose retained
coordinates approach those of \(\theta^*\).  Continuity and the uniform
tail then give

\[
 \liminf_{\substack{p\longrightarrow\infty\\p\ \operatorname {odd}}}
 |G(\theta(p))|=0.                                     \tag{3.8}
\]

Combining (0.3) and (3.8) proves (0.5).

## 4. Consequence for the two sampler rows

In the exact endpoint/null basis, the restrictions of the two proposed
rows are precisely

\[
 \eta|_{\{e,v\}}=(r_\lambda,0),\qquad
 \Gamma_{\rm out}|_{\{e,v\}}=(\Gamma_e,\Gamma_v).
                                                               \tag{4.1}
\]

Normalize only the first row by its exact norm:

\[
 \widetilde M_\lambda=
 \begin{pmatrix}1&0\\
                 \Gamma_e&\Gamma_v\end{pmatrix}.
                                                               \tag{4.2}
\]

Then

\[
 \det\widetilde M_\lambda=\Gamma_v,
 \qquad
 \sigma_{\min}(\widetilde M_\lambda)
 \leq\|\widetilde M_\lambda(0,1)^T\|=|\Gamma_v|.     \tag{4.3}
\]

Thus (0.5) rules out a uniformly bounded right inverse for the physically
scaled matrix (4.2).  If
\(\Gamma_v\ne0\), its exact inverse contains the entry \(1/\Gamma_v\).
If \(\Gamma_v=0\), the two rows are dependent on the fixed plane.

For a rest source \(f\), the formal two-row interpolation coefficients are

\[
 \alpha_e(f)={\eta(f)\over r_\lambda},\qquad
 \alpha_v(f)={\Gamma_{\rm out}(f)
          -\Gamma_e\eta(f)/r_\lambda\over\Gamma_v}.   \tag{4.4}
\]

When the denominator is nonzero, the sheared source

\[
 f^\#=f-\alpha_e(f)e_\lambda-\alpha_v(f)v_\lambda     \tag{4.5}
\]

annihilates both rows exactly.  Equations (0.5) and (4.4) show why no
uniform coefficient estimate follows from the fixed anchors.

The minimal missing theorem has two different strengths:

1. To define (4.5) eventually, one needs the exact arithmetic assertion
   \(\Gamma_v(p/2)\ne0\) for every sufficiently large odd \(p\).
2. A blockwise proof would instead need an explicit rate
   \(|\Gamma_v(p/2)|\geq\varepsilon_p>0\) whose reciprocal can be absorbed
   by every transformed error.  No such rate is known, and a constant
   positive choice of \(\varepsilon_p\) is impossible by (0.5).

Neither statement follows from the frozen Jost expansion.  A zero of the
limiting torus function proves approximation to zero, not equality at a
finite locked parameter.

## 5. Exact anchor floor and Schur invariance

The bad row conditioning should not be confused with an algebraic loss of
the already-proved fixed-plane floor.  Order coordinates as the two anchors
followed by the rest, and let \(T=M_\lambda^{-1}R_{\rm rest}\) whenever
the inverse exists.  The column shear has matrix

\[
 S=\begin{pmatrix}I_2&-T\\0&I\end{pmatrix}.            \tag{5.1}
\]

For every Hermitian form \(H\) and metric \(D\), transform both forms:

\[
 H^\#=S^*HS,\qquad D^\#=S^*DS.                        \tag{5.2}
\]

The anchor principal blocks are unchanged.  In particular the frozen
fixed-plane result remains

\[
 H_A^\#=H_A\succeq
 \left({E\over2}\log c-C\right)I_2,
 \qquad D_A^\#=D_A=I_2.                               \tag{5.3}
\]

There is also an exact whole-matrix statement.  Put \(K=H-\mu D\) and
write

\[
 K=\begin{pmatrix}K_A&K_{AR}\\K_{RA}&K_R\end{pmatrix},
 \qquad K_A\succ0.                                    \tag{5.4}
\]

Direct block multiplication gives

\[
 \begin{aligned}
 K_{AR}^\#&=K_{AR}-K_AT,\\
 K_R^\#&=K_R-K_{RA}T-T^*K_{AR}+T^*K_AT.
 \end{aligned}                                        \tag{5.5}
\]

Consequently

\[
 \boxed{
 K_R^\#-K_{RA}^\#K_A^{-1}K_{AR}^\#
 =K_R-K_{RA}K_A^{-1}K_{AR}.}                          \tag{5.6}
\]

Thus an exact generalized Schur test is shear invariant, regardless of
\(\|T\|\).  This is the same reason that a whole-span relative-form
inequality can be congruenced without estimating shear coefficients.

What is unavailable is precisely such a completed whole-span estimate.
The fixed `8/12` theorem supplies (5.3), but not the growing-rest block,
the anchor/rest rows, the completed upper-term factorization, or the
Schur complement in (5.6).  If those pieces are estimated separately in
the unsheared basis, the factors \(1/\Gamma_v\) in (4.4) enter their
transformed constants.  Equation (5.3) alone cannot absorb that loss.

## 6. Program consequence

The proposed fixed-label two-anchor repair therefore splits into two
logically distinct gates.

First, the complete pre-shear algebra would have to prove that every
dangerous retained upper and boundary term factors through exactly
\((\eta,\Gamma_{\rm out})\).  The edge obstruction shows that this has not
been proved.  Second, even under that factorization, the fixed label-`8/12`
plane supplies no uniformly stable interpolation of those rows.  The
sampler-null anchor trace is asymptotically quasiperiodic and approaches
zero along the locked schedule.

One may still use an exact, badly conditioned congruence at parameters
where \(\Gamma_v\ne0\), but only after proving the relevant inequalities
on the entire unsheared span and retaining the full pulled-back metric.
Alternatively, a future construction must choose parameter-dependent
anchors whose normalized row determinant has a genuine lower bound.  No
such construction is asserted here.
