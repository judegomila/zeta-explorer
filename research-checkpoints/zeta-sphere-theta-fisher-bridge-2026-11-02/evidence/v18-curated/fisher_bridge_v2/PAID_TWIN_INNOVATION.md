# Paid twin-ladder innovation: exact residual reduction without fourth-moment Cauchy

2026-11-02. Exact finite-dimensional identities; review pending. No uniform all-order inequality proved. v1 remains frozen.

## 1. Preserve both genuine positive sides

Fix one differential parity and a>0. Choose monomial differential tests q_j(z)=z^(ε+2j). On h>0 define

F_j^±(a,h)=sqrt(h) exp(±ah) q_j(D±a)ψ(h),
G^±_ij=∫_0∞ F_i^± F_j^± dh.

These are positive Gram matrices at every finite grade. A nonzero constant-coefficient differential polynomial cannot annihilate the nonzero superexponentially decaying analytic ψ on an interval; this proves strict positivity. The actual target in these test coordinates is (G^+−G^-)/2. Coefficient rescaling to the campaign jet basis is an invertible diagonal congruence and changes no sign.

For an extension by one grade write each positive Gram as

G_full^± = [[A_±,b_±],[b_±^T,d_±]],
α_±=A_±^-1 b_±,
δ_±=d_±−b_±^T A_±^-1 b_±>0.

The quantities δ_± are genuine squared norms after orthogonal projection onto the old feature span. They are linear-regression innovations, not generally full conditional variances.

Assume only the previous actual difference A=A_+−A_->0. The difference Schur residual (twice the actual Schur residual in these coordinates) is

S̃=d_+−d_-−(b_+−b_-)^T A^-1(b_+−b_-).

## 2. Exact paid bridge identity

Use the plus-side residual R_+=F_new−α_+^T F_old, where this coefficient vector is evaluated on either side's own features. Then

w=E_-[F_old R_+]=b_-−A_-α_+.

Here E_± means the corresponding positive feature integral, not a new normalized probability. Plus-side orthogonality gives

S̃ = δ_+ − E_-[R_+²] − w^T A^-1 w.                      (1)

Derivation: in the basis replacing the new test by its plus residual, the plus old/new cross block is zero. The difference matrix has old block A, cross block −w, and bottom entry δ_+−E_-[R_+²]. Take its Schur complement. This uses genuine positive residual orthogonality and retains all signed coupling.

Write Δ=α_-−α_+. Then w=A_-Δ and E_-[R_+²]=δ_-+Δ^T A_-Δ. Consequently

S̃ = δ_+−δ_-−Δ^T K Δ,
K=A_-+A_-A^-1A_-=A_-A^-1A_+.                            (2)

K is symmetric positive definite; the middle expression makes that fact manifest. Thus the exact next-rung condition is

δ_+ >= δ_- + Δ^T KΔ.                                    (3)

Strict > proves positive definiteness. This is a precise two-ladder bridge: the favorable innovation difference must pay the mismatch between the two optimal regression coefficient vectors, measured in the already-certified complete lower-block geometry. No Var(R²), fourth moment, unsigned spatial-tail positivity, or assumed spectral probability appears.

Equation (3) is an exact restatement, not an independently proved bound. Its use is to identify the minimal coupling cost left after actual orthogonality, rather than overestimate every feature fluctuation separately.

## 3. Whitened version and the spectral-gap trap

Whiten A_+ to I and normalize the plus residual by sqrt(δ_+). Let M=A_+^-1/2 A_- A_+^-1/2, c=A_+^-1/2 w/sqrt(δ_+), and r=E_-[R_+²]/δ_+. Previous target positivity is precisely 0<M<I. Then

S̃/δ_+ = 1−r−c^T(I−M)^-1 c.                            (4)

Negative-side Cauchy gives cc^T<=rM. A crude sufficient condition is r<1−||M||, but there is no known uniform old-gap lower bound, and this discards directional information. The exact resolvent in (4) is preferable: only the component of c in nearly singular old directions is expensive.

The positive/negative innovations alone are not sufficient: δ_+>=δ_- without the bridge mismatch term is invalid. Likewise, small Fisher information or chi-square distance does not by itself bound c relative to I−M.

## 4. The a=0 normalized limit: derivative innovation minus regression drift

Let the plus old Gram, cross column, and bottom entry at parameter a be G(a), b(a), d(a); the minus side equals their value at −a. Let α(a)=G(a)^-1b(a), δ(a)=d(a)−b(a)^TG(a)^-1b(a). A dot means derivative at zero. Assume the already-established normalized previous target \dot G(0)>0.

A_+−A_-=2a \dot G+O(a³),
α_-−α_+=−2a \dot α+O(a³),
δ_+−δ_-=2a \dot δ+O(a³).

Using (2), the actual normalized Schur limit is

lim_(a→0) S_actual(a)/a
 = \dot δ − \dot α^T G(0) \dot G^-1 G(0) \dot α.         (5)

Since G\dot α=\dot b−\dot G α, this cost can equivalently be evaluated without explicitly differentiating an inverse. This is exactly a positive-parent innovation derivative minus the paid coefficient-drift energy. The cancellation removes the apparent singularity of A^-1~1/a. It does not authorize evaluating the unnormalized zero block inverse.

Formula (5) suggests a more sharply targeted information-relaxation attack than generic Fisher control: prove that the derivative of the innovation dominates the regression-drift energy in the actual derivative metric. No such uniform-in-grade domination is currently known.

## 5. Why ordinary conditional Poincaré does not supply the missing sign

The actual optimal residual under the full-line positive density p_a∝e^(2au)ψ² obeys E_p[u R B_old]=0, not E_p[R B_old]=0. Thus it is orthogonal to uB_old in the positive Hilbert space, not automatically to low diffusion eigenfunctions or even constants. A higher-mode Poincaré gap cannot be inferred from the number of residual constraints alone. It requires an independently controlled angle to the actual low eigenspaces.

More fundamentally, Poincaré bounds variance by derivative energy; it does not bound the negative signed-u energy by the positive-u energy. The plus-side innovation projection in Sections 1–2 is the directly relevant orthogonality and yields the exact paid cost without that mismatch.

## 6. Link to the graded theta recurrence, with the Jensen gap retained

For each orbit f_n and derivative feature U_j=f_n^(j)/f_n, a polynomial differential test has the exact feature

q(D±a)ψ/ψ = E_(p_n(h))[ q(D±a)f_n/f_n ].

Its orbit observable lies in the actual graded one-pole algebra U_A(z)=A(z)−ℓ(A)/(2z−3), with the required parity restriction inherited from q. Therefore every entry of A_±, b_±, d_± is an integral of PRODUCTS OF ORBIT MEANS, not the automatic positive Gram E[U_A U_B]. In matrix notation,

(E U)(E U)^T = E[UU^T]−Cov(U).

Replacing the left side by the right-side first term alone discards exactly the information covariance. The established small orbit Fisher/chi-square coefficients and the rank-one gamma-residue channel are usable only if this covariance and its drift are retained in the actual innovation and resolvent cost (2)–(5).

In particular, the existing proof that the residue functional is unbounded relative to the raw discrete polynomial Gram prevents a uniform bound that simply throws away that channel. It does not rule out a bound in the full actual bridge metric, and the full-filtration obstruction must not be misreported as a same-parity obstruction.

## 7. Concrete next lemma, not a claimed theorem

For every rung in each parity and allowed shift, show either

δ_+−δ_- >= Δ^T[A_-+A_-A^-1A_-]Δ,

or at the normalized endpoint

\dot δ >= (\dot b−\dot Gα)^T \dot G^-1(\dot b−\dot Gα).

A useful proof must exploit the coupled theta graded recurrence, full residue channel, and directional old-metric structure. Generic Fisher contraction, conditional Poincaré, or separate bounds on the two innovations do not establish these inequalities. These are precise remaining targets rather than a proof of closure.

## 8. A sufficient regression-path action inequality

There is a concrete information-geometric way to pay (2) without bounding fourth moments. On t∈[−a,a], let G(t), α(t), δ(t) be the positive plus-side regression objects, with all derivatives of the feature itself retained. Then

Δ=−∫_(−a)^a α'(t)dt,    δ_+−δ_-=∫_(−a)^a δ'(t)dt.

For any positive matrix path M(t), put B=∫M(t)^-1dt. Matrix Cauchy gives

Δ^T B^-1 Δ <=∫ α'(t)^T M(t)α'(t)dt.

Thus a sufficient, genuinely constructive pair of estimates is

K<=B^-1,    δ'(t)>=α'(t)^T M(t)α'(t) for every t.          (6)

Strict total surplus proves the new rung. A simple stronger version takes M(t)=2aK, giving B=K^-1 and the sufficient action test

δ_+−δ_->=2a∫_(−a)^a α'(t)^TKα'(t)dt.                    (7)

Neither (6) nor (7) is established for the theta family. They identify the precise regression-speed energy that an information-relaxation proof must pay; the fixed endpoint K includes the actual old-target inverse.

For completeness, under the unnormalized positive measure dμ_t=h exp(2th)ψ(h)^2 dh take old feature vector v_t=q_old(D+t)ψ/ψ, new feature y_t, and residual r_t=y_t−α(t)^Tv_t. Let y_t^*=∂_t y_t−α(t)^T∂_t v_t. Differentiating the exact normal equations and innovation gives

G(t)α'(t)=∫[(∂_t v_t+2h v_t)r_t+v_t y_t^*]dμ_t,
δ'(t)=∫[2h r_t²+2r_t y_t^*]dμ_t.                        (8)

The α' term cancels only in the innovation derivative, by true positive-side orthogonality. These formulas retain both score and feature drift. Normalizing μ_t merely centers its score and introduces the corresponding total-mass derivative; the unnormalized formulas above avoid silently dropping that mass term.
