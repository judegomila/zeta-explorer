# Adaptive common-anchor Schur repair without positive spatial pieces

Status: exact algebra, finite actual-theta interval check, and independent replay/analytic review all passed. No all-degree inequality is claimed.

## 1. The premise that survives the tail obstruction
Partition the complete kernel moment matrix into arbitrary signed spatial pieces

M=sum_i M_i, M_i=[A_i b_i;b_i* d_i].

Assume only the **complete lower-degree block** A=sum_i A_i is positive definite. This is the natural induction hypothesis for proving the next moment order. Individual A_i may be indefinite; d_i may have either sign. In particular, no universal cumulative-tail positivity is needed.

Choose any positive anchor matrices R_i with sum_i R_i=A. These are auxiliary matrices, not assertions about the signs of the actual pieces. Put r_i=R_i^(-1)b_i and rbar=A^(-1)sum_i b_i. Direct completion of squares gives the exact identity

S(M)=sum_i[d_i−b_i*R_i^(-1)b_i]
+sum_i(r_i−rbar)*R_i(r_i−rbar).

The replacement of local A_i by R_i changes no complete matrix: sum_i(A_i−R_i)=0. This cancellation must be retained; the method does not claim each modified local matrix is positive.

Consequently an explicit factorization of the **complete** matrix is obtained from its complete A and this scalar S by ordinary block LDL. The second sum is a nonnegative correlation reserve even when no individual spatial piece has a positive lower block.

## 2. Optimized scalar weights and exact angular reserve
For a scalar border, choose R_i=w_i A, w_i>0, sum w_i=1. Set u_i=A^(-1/2)b_i, a_i=||u_i|| and L=sum a_i. The cost sum a_i²/w_i is minimized by w_i=a_i/L, with minimum L². Zero a_i are handled by positive-weight limits; if all vanish, S=sum d_i directly.

At the optimum the exact complete Schur reserve is

S=sum_i d_i−L²+Gamma,

Gamma=L²−||sum_i u_i||²
=2sum_(i<j)[a_i a_j−Re(u_i*u_j)]>=0.

Thus the positive mechanism is **directional cancellation of the actual regional cross-columns**, measured in the complete lower-block metric. It is not positivity of a chosen region, and it remains meaningful when the region supplying positive diagonal mass changes with order or frequency.

For two pieces (core/tail), Gamma=2(a_c a_t−Re u_c*u_t). The local lower blocks are never inverted.

## 3. A concrete sufficient theta lemma
Let d_plus=sum max(d_i,0), d_minus=sum max(−d_i,0). Suppose a collection of cross-region pairs has a certified angular separation

Re(u_i*u_j)<= (1−delta_ij)a_i a_j, delta_ij>=0.

Then a sufficient next-degree condition is

d_plus−d_minus−L²+2sum_(selected pairs)delta_ij a_i a_j>0.

All omitted pairs contribute nonnegatively. In a continuous partition the sums become integrals, with the same identity by approximation when the relevant absolute integrals are finite. This is a reduced, verifiable signed-budget lemma allowing both signs and using only a previously established complete lower block. A genuine all-degree proof must now bound the theta-derived diagonal budget and angular masses/separations; no such uniform estimates are supplied by this identity alone.

The H=1 negative spectral tail is compatible with this framework: at scalar level there is no lower block/covariance, and positive core mass simply exceeds negative tail mass. At higher matrix order, directional cancellation additionally supplies reserve. One must not demand the same spatial side be positive in every situation.

## 4. Actual-theta check where the local core lower block is indefinite
Use the independently reviewed normalized a=0 odd-degree19 matrix and split at H=1/16. Take the complete first nine odd channels as A and append the tenth channel. The core lower block is genuinely indefinite: its first3-by-3 principal determinant is below−.01100735 in the fixed rational scaling. Thus a method requiring the local core A_c>0 cannot be applied here.

The common-anchor identity nevertheless certifies

optimal core weight in(.0003492823884,.0003492823890),
signed remainder sum d_i−L² >.2172448190,
angular covariance Gamma>.3136350800,
complete Schur reserve S>.5308798991.

A separate direct quadratic-form check gives S>.5308824813. The common-anchor computation makes no inverse of the indefinite core block and uses the actual full-theta intervals already certified, not a finite theta model.

This is a finite demonstration, not a new degree increment or extrapolation. Approximately sixty percent of this particular Schur reserve is exposed as directional covariance in the complete lower-block metric.

## 5. Validated quadratic evaluation
Naively interval-inverting the9-by-9 complete A caused excessive dependency widening; the failed exploratory interval log is not proof evidence. The successful checker uses a residual-based enclosure.

Choose an exact rational approximate inverse R and verify ||I−RA||_infinity<rho=1/1000. Then ||A^(-1)||_2<=||R||_infinity/(1−rho), since A^(-1) is symmetric. For an exact rational trial solution x to A x=b, let r=b−Ax. The exact identity

b*A^(-1)b=2Re(b*x)−x*Ax+r*A^(-1)r

gives an interval enclosure with a nonnegative error at most [||R||_infinity/(1−rho)]||r||². Quadratic forms for b_c,b_t,b_c+b_t provide the cross term by polarization. The approximate inverse and trial vectors are treated as exact rationals and validated through residuals, not trusted as numerical solutions. Endpoint loading includes the existing outward serialization guard.
