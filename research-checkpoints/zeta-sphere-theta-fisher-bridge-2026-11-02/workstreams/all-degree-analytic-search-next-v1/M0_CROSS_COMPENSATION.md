# Exact cross-compensation target for the frozen residue

## Scope

This note isolates the source-specific inequality needed to make the
frozen-residue route noncircular.  It does not prove that inequality, does not
assert positivity beyond a known old target prefix, and has no RH conclusion.

Fix one parity and a finite old polynomial prefix.  Let `A>0` be its actual
endpoint target matrix and let

\[
 v(p)=\langle F_p,\chi\rangle_0,
 \qquad d(p)=e(p'),
 \qquad
 \langle f,g\rangle_0=\int_0^\infty h f(h)\overline{g(h)}\,dh,
 \tag{1}
\]

where `F_p=p(D)psi=Psi_p-e(p)chi`.  In coefficient coordinates the exact
frozen-residue identity is

\[
 M_{0,\mathrm{old}}=A+vd^*+dv^*. \tag{2}
\]

The positive parent Gram and `A` are different metrics.  Every inverse and
dual norm below is taken in the actual target `A`.

## One combined functional is necessary and sufficient

Put

\[
 V=v^*A^{-1}v,\qquad D=d^*A^{-1}d,\qquad
 v^*A^{-1}d=C+iJ. \tag{3}
\]

Whitening `A` gives

\[
 M_{0,\mathrm{old}}\succeq0
 \quad\Longleftrightarrow\quad
 \sqrt{VD-J^2}-C\leq1. \tag{4}
\]

For real theta data, define for `tau>0`

\[
 a_\tau={\sqrt\tau\,v-\tau^{-1/2}d\over\sqrt2}. \tag{5}
\]

Then

\[
 a_\tau^TA^{-1}a_\tau
 ={1\over2}\left(\tau V+{D\over\tau}-2C\right),
 \qquad
 \inf_{\tau>0}a_\tau^TA^{-1}a_\tau=\sqrt{VD}-C. \tag{6}
\]

When `V,D>0`, the infimum is attained at `tau=sqrt(D/V)`.  If exactly one of
`V,D` vanishes, positivity of `A` forces the corresponding functional and
`C` to vanish; the infimum is zero and is approached as `tau` tends to the
appropriate endpoint.  A finite `tau` still makes (7)--(8) hold.  If both
vanish, every `tau` works.  Consequently the exact noncircular target is

\[
 \boxed{\text{there is a }\tau>0\text{ such that }
        a_\tau^TA^{-1}a_\tau\leq1.} \tag{7}
\]

Equivalently, one must prove the positive augmented Gram

\[
 \boxed{
 \begin{pmatrix}A&a_\tau\\a_\tau^T&1\end{pmatrix}\succeq0.} \tag{8}
\]

This formulation preserves the favorable `v`--`d` correlation.  Bounding
the two dual norms separately replaces (6) by a stronger Young/Cauchy
estimate.  The optimizing `tau` is target- and prefix-dependent; the residue
algebra alone does not identify it with a fixed normalization.

For reference, the determinant lemma gives the same gate:

\[
 {\det(A+vd^T+dv^T)\over\det A}
 =(1+C)^2-VD. \tag{9}
\]

Equation (4), rather than the determinant sign alone, retains the correct
inertia branch.

## The drift is an off-axis theta-residue trace

The exact residue EGF in `DEFECT_FACTORIZATION.md` is

\[
 E(t):=\sum_{j\geq0}e_j{t^j\over j!}
 =-C(t)
 =3(1-e^{2t})
   \exp\!\left({5t\over2}-{3\over2}(e^{2t}-1)\right). \tag{10}
\]

The drift EGF is `tE(t)`, which is exactly `d_j=j e_(j-1)`.  Expanding the
outer exponential gives, for every polynomial `p`, the absolutely convergent
finite-polynomial identity

\[
 \begin{aligned}
 e(p)
 &=3e^{3/2}\sum_{k\geq0}{(-3/2)^k\over k!}
   \left[p\!\left({5\over2}+2k\right)
        -p\!\left({9\over2}+2k\right)\right],\\
 d(p)=e(p')
 &=3e^{3/2}\sum_{k\geq0}{(-3/2)^k\over k!}
   \left[p'\!\left({5\over2}+2k\right)
        -p'\!\left({9\over2}+2k\right)\right]. \tag{11}
 \end{aligned}
\]

Under the real Fourier convention `D` becomes `i nu`.  Thus (11) samples the
polynomial at imaginary-frequency points, not against a measure on the real
spectral line.  It is an analytic-continuation functional.

The modular-center identities give a second exact description.  If `p` is
even, then `p'` is in the odd graded sector and

\[
 d(p)={\Psi_{p'}(0)\over\chi(0)}. \tag{12}
\]

If `p` is odd, then `p'` is in the even graded sector and

\[
 d(p)=-{\Psi_{p'}'(0)\over q''(0)}. \tag{13}
\]

These are respectively a center value and a center derivative trace.  They
follow directly from equations (5)--(6) of `ODD_CENTER_LEMMA.md`; no norm
estimate is inserted.

## The companion functional is a real-frequency correlation

Let `g(h)=1_(h>0) h chi(h)` and use the nonunitary Fourier transform from
`SPECTRAL_DEFECT_CLOSURE.md`, for which `hat(psi)=2 Xi`.  Plancherel gives

\[
 v(p)={1\over2\pi}\int_{\mathbb R}
 p(i\nu)\,2\Xi(\nu)\,\overline{\widehat g(\nu)}\,d\nu. \tag{14}
\]

In contrast, the target metric is the real-line signed multiplier

\[
 A(p,r)={1\over\pi}\int_{\mathbb R}
 \bigl(\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\bigr)
 p(i\nu)\overline{r(i\nu)}\,d\nu. \tag{15}
\]

Equations (11)--(15) expose the finite-prefix gate.  The two entries of
`a_tau` couple a real-frequency correlation to a boundary trace.  The same
drift also has the exact undivided real-line Gamma kernel and shifted
first-orbit representations in `M0_REAL_LINE_TRACE_KERNEL.md` and
`M0_THETA_ORBIT_REFLECTION.md`.
Neither the positive-parent Christoffel recursion nor a scalar Cauchy
estimate in (15) represents both channels.  Dividing (14) by the multiplier
in (15) would additionally assume control at its zeros and sign changes,
which is part of the endpoint problem rather than an available input.

## Exact finite-prefix target and all-degree status

On every positive old target prefix, define

\[
 \mathcal L_\tau(p)={1\over\sqrt2}
 \left[
 \sqrt\tau\int_0^\infty hF_p(h)\chi(h)\,dh
 -\tau^{-1/2}e(p')
 \right]. \tag{16}
\]

A source-specific proof of

\[
 \boxed{
 \inf_{\tau>0}\|\mathcal L_\tau\|_{A^*}^2\leq1
 } \tag{17}
\]

is exactly the old-prefix frozen-residue positivity gate.  By (12)--(13), it
is a parity-dependent signed Hardy/trace inequality, not a raw orbit-norm
bound.  It must retain the correlation inside (16).  Citing positivity of the
undifferentiated parent, or estimating the two summands separately, does not
prove it at a given prefix.

`M0_FIXED_TAU_NO_GO.md` proves that this cannot support an all-prefix proof in
either complete parity ladder.  If the endpoint target remains positive, (17)
eventually fails; if it does not, target negative inertia is already unbounded
and rank two cannot repair all prefixes.  Thus (17) remains an exact finite
diagnostic, but universal frozen-residue positivity is a refuted route.  The
finite odd-prefix probe through degree 19 is necessarily pre-asymptotic and
cannot locate the first failing degree.
