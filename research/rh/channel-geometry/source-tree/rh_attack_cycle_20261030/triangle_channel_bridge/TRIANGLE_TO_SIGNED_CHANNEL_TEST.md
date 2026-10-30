# Triangle curvature to signed channel interference: exact bridge and limits

30 October 2026. Bounded local analytic investigation. Independent internal
review is recorded separately. No remote changes, numerical carrier sweep,
new whole-support certificate, or RH conclusion.

## Result first

The user's mixed-curvature idea **does connect to cross-channel interference**,
not only to one circumference ratio. Polarizing its function gives the actual
Weil energy of pairs of channels. In particular, centered even boxes give an
explicit two-channel inequality in four scalar values of Psi. For general
channels there is an exact three-channel phase determinant.

Neither connection supplies the missing inequality. Gauss--Bonnet controls
an unweighted curvature integral, whereas the channel form contains weighted
correlations and the archimedean contribution. No map identifying geometric
holonomy with the actual channel phase has been established. Even every
three-channel positivity test can pass while a four-channel coherent vector
is negative. The latter is an exact abstract diagnostic, **not a negative
Weil vector**.

The useful output is therefore a correctly normalized test and a precise
no-go for a triangle-only shortcut, not an improvement of the existing
separated-channel floor.

## 1. Recovered proposal and current obligation

The original mixed-curvature exchange (private history link omitted)
constructed, on finite cylinders,

    D(r)=sum_n Lambda(n)/sqrt(n) (r-log n)_+
         -4(exp(r/2)-1-r/2),
    g_D=exp(-2D(r))(dr^2+dtheta^2),
    K_g dA_g=D''(r)dtheta=dnu(r)dtheta.

The follow-through (private history link omitted)
identified the circumference ratio exp(Psi(r)), where

    Psi(r)=a r+T(r)-D(r),
    a=(digamma(5/4)-log pi)/2,
    T(r)=sum_{k>=1}(1-exp(-alpha_k r))/alpha_k^2,
    alpha_k=2k+1/2, r>=0.

Psi is extended evenly. The exact prior normalization is
Psi(W)=(W/2)q_W[W^(-1/2)1_{[-W/2,W/2]}]. Thus the scalar
circumference comparison is one actual box-mode energy at each support,
not all-mode positivity at a selected support.

The current superwire result proves positivity on a sparse common span of
well-separated actual good carriers. It explicitly leaves nearby carriers,
exceptional carriers, and omitted physical directions uncontrolled. With an
orthogonal finite-block decomposition, the exact missing condition is

    H=[[D_ch,B],[B*,E]],  D_ch>0,
    E-B*D_ch^(-1)B >= 0.                                  (1)

Here D_ch is a channel block, unrelated to the scalar primitive D(r).
The infinite-dimensional version needs the real domains and inverse/coupling
conditions; this note makes no global closed-form assumption.

## 2. Polarized curvature is already the actual cross-channel term

For f,g supported in I_W=[-W/2,W/2], extended by zero, set

    R_fg(r)=integral conjugate(f(x))g(x+r)dx.

On the doubled cylinder [-W,W]xS^1 use the even extension D_e.
D'(0+)=0, so there is no additional origin seam in D_e''. The arithmetic
measure nu_e is the reflection of nu to negative r. Exact polarization gives

    q_W(f,g)=A(f,g)-integral_{-W}^W R_fg(r)dnu_e(r)
            =A(f,g)-(1/(2pi))integral R_fg(r)K_g dA_g.      (2)

The gamma form A uses Re digamma(5/4+it/2)-log pi, not the raw 1/4
multiplier with the growing continuum left unchanged. Formula (2) follows
from the actual quadratic form by polarization and keeps all prime seams,
cross phases, and physical zero-extension conventions. It applies to each
actual neutral paired packet and its polarized pairings; it does not assert
that R_fg is a positive weight.

The previous curvature audit already found that the coordinate triangle
0<=r<=W, 0<=theta<=W-r has curvature mass D(W), but its sloping edge has
integrated geodesic curvature -D(W). Its angle sum remains pi. That edge is
not geodesic. Replacing it by a geodesic changes the region and the weight.
Even for genuine geodesic triangles, angle excess measures the unweighted
curvature of that region; it does not provide (2)'s weighted estimate.

## 3. A direct scalar-to-channel bridge, with the origin handled correctly

Define the continuous polarized kernel

    K_Psi(x,y)=Psi(x)+Psi(y)-Psi(x-y).

On smooth compactly supported tests, the exact normalization is

    q(f,g)=integral integral K_Psi(x,y)
                    conjugate(f'(x))g'(y) dxdy
          =-integral integral Psi(x-y)
                    conjugate(f'(x))g'(y) dxdy.           (3)

The one-variable terms vanish because each compactly supported derivative
has integral zero. This is the usual screw-kernel/Weil derivative identity;
it is an unconditional identity, not positivity of K_Psi.

One can check the singular normalization without assuming RH. Keep the
finite sum T_N together. As distributions on R,

    [(1-exp(-alpha |r|))/alpha^2]''
          =2 delta_0/alpha-exp(-alpha |r|).

Its Fourier convolution multiplier is
2/alpha-2alpha/(alpha^2+t^2)=2t^2/[alpha(alpha^2+t^2)]. Including
2a delta_0 and summing produces precisely

    2a+sum_{k>=1} 2t^2/[alpha_k(alpha_k^2+t^2)]
       =Re digamma(5/4+it/2)-log pi.

The functions T_N converge uniformly to T; derivatives converge in the
distribution sense. Subtracting D_e'' yields the actual signed convolution
kernel. **Psi_even'' is a distribution, not the ordinary curvature measure
nu_e**: the archimedean cancellation at the origin must not be discarded or
split into separately divergent sums. Integration by parts then gives (3).

For the unnormalized centered boxes b_a=1_{[-a,a]}, a>0, smooth form
approximation or the four-corner difference of the continuous K_Psi gives

    q(b_a,b_b)=2[Psi(a+b)-Psi(|a-b|)],
    q(b_a,b_a)=2Psi(2a).                                  (4)

Their physical L2 Gram is G_ab=2min(a,b). It is not the signed energy
matrix in (4). Distinct positive widths give independent box vectors.
The boxes belong to the local logarithmic form domain: their Fourier decay
is O(1/|t|). Smooth approximations converge in that form norm; at a fixed
support the finite arithmetic shifts are L2-continuous.

Consequently, once both diagonals are nonnegative, positivity on the span
of two distinct centered boxes is exactly

    [Psi(a+b)-Psi(|a-b|)]^2 <= Psi(2a)Psi(2b).             (5)

This is a usable **coherent cross-channel test** derived from the earlier
scalar function. For a positive floor mu, test the matrix q(b_i,b_j)-mu G_ij,
not q alone. A many-box test must retain the entire matrix; its smallest
generalized eigenvalue and complement are not supplied by (5).

For context, Suzuki proved that global positive definiteness of K_Psi is
equivalent to RH, and also that the special arithmetic Psi is nonnegative
everywhere iff RH. These are published theorems, not new here. The present
derivation does not prove either global hypothesis. Local scalar positivity
does not automatically establish local matrix positivity by algebra alone.

## 4. What the genuine triangle condition would be

If K_Psi were positive semidefinite, it would be the inner-product kernel of
a Hilbert-space curve X with squared distances

    ||X(s)-X(t)||^2=2Psi(s-t).

Its 2-by-2 principal determinant says

    |Psi(s)+Psi(t)-Psi(s-t)| <= 2sqrt(Psi(s)Psi(t)),

equivalently the three quantities sqrt(Psi(s)), sqrt(Psi(t)),
sqrt(Psi(s-t)) obey all triangle inequalities. This is a triangle in the
**prospective Hilbert space**, not a geodesic triangle on g_D. Treating that
Hilbert representation as already available assumes its positive kernel.

For an arbitrary continuous even F>=0 this implication is false. F(t)=t^4
gives K_F(1,1)=2, K_F(2,2)=32, K_F(1,2)=16, whose determinant is -192.
It also fails the centered-box test at a=1,b=2: 80^2>16*256.
This only disproves a generic positive-function/positive-metric shortcut;
it does not contradict Suzuki's special global theorem for arithmetic Psi.

## 5. Channel phases have a triangle invariant, but not a proved holonomy map

Let Z be any three-channel Hermitian signed energy matrix with positive
diagonals. Normalize z_ij=Z_ij/sqrt(Z_ii Z_jj), and write
z_12 z_23 z_31=r_12 r_23 r_31 exp(i Phi). Then

    det(z)=1-r_12^2-r_23^2-r_31^2
             +2r_12 r_23 r_31 cos(Phi).                  (6)

Together with r_ij<=1, determinant nonnegativity is necessary and sufficient
for three-channel PSD. The product phase Phi is unchanged by rephasing the
three individual channels. If a factor is zero, use the real part of the
product rather than its undefined argument.

For equal magnitudes r=2/3, phase 0 gives determinant 7/27; phase pi gives
-25/27 although all pair minors are 5/9. Thus a phase-sensitive inequality
really is needed. These exact synthetic examples are not sampled Weil data.

Gauss--Bonnet/parallel transport also has a loop-angle invariant, but this
resemblance does not identify Phi with an integral of the prime curvature.
Equation (2) has oscillatory correlation weights and an additive gamma term;
its phase is not simply exp(i integral KdA). No transport representation,
loop assignment, or amplitude estimate proving such an identity has been
constructed. Ordinary metric positivity cannot supply it.

## 6. Even all triangle-sized tests cannot close the actual Schur obligation

Consider the exact real symmetric 4-by-4 matrix

    Z_ii=1,  Z_ij=-2/5  (i!=j).

Every 3-by-3 principal block has eigenvalues 7/5,7/5,1/5, so all its pair and
triple tests pass. But the full matrix has eigenvalue -1/5 on (1,1,1,1), and
three eigenvalues 7/5. Its all-channel coherent energy on that vector is
-4/5. Its physical Gram may be I, so no nonorthogonality issue causes this.

Take the first three directions as D_ch and the fourth as E=1, with
B=(-2/5)(1,1,1)^T. Then

    B*D_ch^(-1)B=12/5,
    E-B*D_ch^(-1)B=-7/5.                                 (7)

This is precisely the failure mode in (1): an already positive channel
sector and every triangle-sized check leave a collective omitted-direction
defect. It proves no negative actual Weil direction and rules out no
arithmetic theorem that supplies additional structure.

## 7. What remains useful, and stopping condition

The triangle work now supplies exact cross-channel coordinates (2)--(5),
while (6) explains which phase information a prospective geometric method
would have to control. It does not improve the superwire separation estimate
or bound the signed prime excess of nearby/exceptional channels.

A valid advance would be an independently proved arithmetic inequality for
the actual cross-correlations, strong enough to pay (1), or an exact geometric
representation that proves that inequality without assuming a Hilbert norm,
positive kernel, or contraction. Checking a finite new cluster could provide
a bounded certificate but would not settle its omitted complement. No such
new computation is represented as having been performed in this pass.

The bounded question is settled: **there is a faithful triangle-to-channel
translation and explicit tests, but triangle angle excess/deficit alone has
not supplied the missing positivity mechanism.**

## Sources and local dependencies

- Masatoshi Suzuki, *Aspects of the screw function corresponding to the
  Riemann zeta-function*, [author preprint](https://arxiv.org/pdf/2206.03682),
  equations (1.4), (1.8), Theorems 1.2 and 1.7.
- Masatoshi Suzuki, *The screw line of the Riemann zeta-function and its
  applications*, [author preprint](https://arxiv.org/pdf/2209.04658),
  equation (1.10); its Hilbert norm assertions retain their stated RH
  hypotheses/equivalences.
- `../curvature_bulk/ARITHMETIC_CURVATURE_AUDIT.md`.
- `../curvature_bulk/SUZUKI_FOLLOWTHROUGH_ADDENDUM.md`.
- `../superwire_channel_attack/SEPARATED_GOOD_CARRIERS_AND_SIGNED_CHANNEL_TEST.md`.
- `../superwire_channel_attack/RESULT_AND_REMAINING_CHANNEL_BLOCKER.md`.

The script `check_triangle_channel_algebra.py` checks exact symbolic/rational
identities and synthetic obstructions only, not the absent arithmetic bound.
