# Signed-kernel certification review: a=1/4, L=3/2

This folder independently derives and interval-encloses full Fourier-tail bounds for the actual signed kernel. It also checks the periodic-majorant inertia criterion and the closed incomplete-beta coefficient formula. It does not, by itself, certify the final finite-dimensional inertia computation.

## Definitions and normalization

Put a=1/4, V=2 log(3/2), b_1=0, b_2=log 2,

rho_1=1, rho_2=(2^a-2^(-a))/sqrt(2), T_n=V-b_n.

Write f_a(t)=exp(-t/2)g_a(exp(-t)). The actual kernel on [0,V] is

K(v)=sum_{n=1,2} rho_n f_a(v-b_n) 1_{v>b_n}.

On the circle of length 2V, with convolution using ordinary Lebesgue measure, the multiplier is

lambda_k=integral_0^V K(v) exp(-i omega_k v) dv, omega_k=pi k/V.

There is no 1/(2V) factor in lambda_k. The normalized Fourier modes are exp(i omega_k u)/sqrt(2V).

## 1. Elementary monotonicity tail bound

Set D=(2 pi)^a/Gamma(a), C=2 pi^a/Gamma(a), q=1-exp(-2t), and I(t)=B_q(a,3/2-a). Then

f_a(t)=C[A(t)-B(t)],

A(t)=exp(-(5/2-a)t) q^(a-1),
B(t)=a exp((1/2-a)t) I(t).

Direct differentiation gives

f_a'(t)=C[A(t)(-(5/2+a)+(a-1)q'/q) -(1/2-a)B(t)] < 0

for 0<a<=1/2. Also f_a(t)<=D t^(a-1), and f_a is positive on 0<t<=1/10 by the previously proved sufficient condition exp(-3t)+exp(-2t)>1.

For tau<=min(T,1/10), split the Fourier integral at tau. The first part has absolute value at most D tau^a/a. Integration by parts, monotonicity, and total variation on [tau,T] give

|integral_tau^T f_a(t)e^(-i omega t)dt|
 <= [2D tau^(a-1)+2(-f_a(T))_+]/|omega|.

Choose tau=2(1-a)/|omega|. Summing the two shifted contributions gives

|lambda_k| <= A_m |omega_k|^(-1/4)+B_m/|omega_k|,

A_m in [3.21222191668702908075356469032442345,
        3.21222191668702908075356469032442346],
B_m in [1.33644023477508280863624014195920237,
        1.33644024721746851165236778481670155].

The conditions hold for |k|>=4: tau<=1/10 and T_2=log(9/8)>1/10. Since the bound decreases with |k|, at cutoff N=256 it yields

sup_{|k|>=257}|lambda_k| < 0.573190375298265 < 0.6.

This elementary bound does not suffice for delta=0.9 at N=16; use the sharper bound below there.

## 2. Sharper asymptotic tail bound with an explicit BV remainder

Decompose

f_a(t)=D t^(a-1)+r_a(t),

r_a(t)=-j_1(t)-j_2(t),
j_1(t)=D t^(a-1)(1-F(t)),
F(t)=exp(-3t/2)(t/sinh t)^(1-a),
j_2(t)=C a exp((1/2-a)t) I(t).

The remainder tends to zero at t=0 and is absolutely continuous with integrable derivative. For 0<a<=1/2, j_2 is increasing, so TV(j_2)=j_2(T).

The elementary inequality coth t-1/t<=t/3 follows by comparing the nonnegative Taylor coefficients of (1+t^2/3)sinh t-t cosh t. Thus, with L_T=3/2+(1-a)T/3,

0<=-F'(t)<=L_T, and 0<=1-F(t)<=L_T t,

and hence

TV(r_a on [0,T]) <= D(2-a)L_T T^a/a + j_2(T) =: W_a(T).

The oscillatory gamma integral is

integral_0^infinity t^(a-1)e^(-i omega t)dt
 =Gamma(a) exp(-i sign(omega)pi a/2)|omega|^(-a).

Apply integration by parts to the BV remainder and the tail of this gamma integral, combining their endpoint terms before taking absolute values. One obtains

|integral_0^T f_a(t)e^(-i omega t)dt|
 <= D Gamma(a)|omega|^(-a)
  + [|f_a(T)|+W_a(T)+D T^(a-1)]/|omega|.

Summing rho_n times these bounds proves

|lambda_k| <= A |omega_k|^(-1/4)+B/|omega_k|,

A < 1.973172587109835,
B < 8.583347202240290.

The constants are enclosed using the same real incomplete-beta interval evaluator and explicit series remainder as the preceding scalar certificate. The exact intervals are in fourier_tail_constants.json.

Resulting uniform tail upper bounds:

| Low-frequency cutoff N | Bound for all |k|>N |
|---|---:|
| 16 | 0.822974956341586 |
| 32 | 0.653945830585008 |
| 64 | 0.529416645684958 |
| 128 | 0.434501733555486 |
| 256 | 0.359890290315247 |
| 512 | 0.299843835568634 |

In particular **delta=0.9 is valid at cutoff N=16**, and delta=0.6 is valid at N=256.

## 3. Periodic majorant and finite inertia criterion

Let chi be restriction to the interval [-V/2,V/2], R reflection on the circle, and C periodic convolution by K. Then H=chi C R chi*. The operator C R is self-adjoint. In the Fourier pair (+k,-k), its matrix is

[[0,lambda_k],[conjugate(lambda_k),0]],

and the k=0 entry is lambda_0. Its pair eigenvalues are +/-|lambda_k|.

Let D_N denote these low-frequency blocks and let W map low Fourier coefficients to their restricted functions. A tail bound delta gives, for each sign,

+/-H <= delta I + W(+/-D_N-delta I)W*.

Write alpha=1-delta>0, B=+/-D_N-delta I, and G=W*W. If B is invertible, define

S=B^(-1)-G/alpha.

The block matrix [[alpha I,W],[W*,B^(-1)]] has the two Schur complements S and alpha I-WBW*. Consequently

n_-(alpha I-WBW*)=n_-(S)-n_-(B),

and the two Schur complements have equal nullities. Thus matching negative counts together with a certified nonzero spectral gap for S establishes alpha I-WBW*>0. Applying this separately to both signs proves ||H||<1.

The exact Gram entries are

G_kk=1/2,
G_kl=sin(pi(k-l)/2)/(pi(k-l)) for k!=l.

Nonzero off-diagonal entries therefore occur only for odd differences and are +/-1/[pi(k-l)]. No numerical trigonometry is needed.

A quantitative gap follows after positivity is established. If min|eig(S)|>=g>0, Woodbury and ||W||<=1 give

alpha I-WBW* >= [alpha^2 g/(1+alpha g)] I.

Use the smaller resulting gap from the two signs.

### Error budget

- A Fourier coefficient enclosure |lambda_k-lambda_k,0|<=epsilon implies ||D_N-D_N,0||<=epsilon, since D_N consists of disjoint 2x2 blocks. There is no matrix-dimension factor.
- If B_0 is the approximating block matrix, let beta=||B_0^(-1)||. Provided beta epsilon<1,

  ||B^(-1)-B_0^(-1)|| <= beta^2 epsilon/(1-beta epsilon).

- Add the Gram error divided by alpha and any arithmetic assembly error to obtain epsilon_S.
- For approximate eigenvectors Q and eigenvalues mu of S_0, let eta>=||Q*Q-I||<1 and r>=||S_0 Q-Q diag(mu)||. Then the true matrix is similar to diag(mu) plus an error of norm at most

  r/sqrt(1-eta)+sqrt((1+eta)/(1-eta))*epsilon_S.

  If this is less than min|mu|, inertia is certified and their difference is a valid g. Along the perturbation homotopy no eigenvalue can cross the imaginary axis. All error bounds must include the actual finite-precision computation, rather than treating numerical residuals as exact.

## 4. Closed incomplete-beta formula for each coefficient

For p=a-1/2+i omega, r=(5/2-a+i omega)/2, Q_T=1-exp(-2T),

integral_0^T f_a(t)e^(-i omega t)dt
 = C[(1/2-a/p) B_(Q_T)(a,r)
       +(a/p)e^(-pT)B_(Q_T)(a,3/2-a)].

Here p is never zero for a=1/4. To verify the formula, use

I'(t)=2exp(-(3-2a)t)(1-exp(-2t))^(a-1)

and integrate integral e^(-pt) I(t)dt by parts. The boundary at zero vanishes.

For interval evaluation, expand

B_Q(a,r)=Q^a sum_{j>=0} c_j Q^j/(a+j),
c_0=1, c_j=c_(j-1)(j-r)/j.

For truncation at M, let eta=Q max(1,|1-r/(M+2)|). If eta<1, the absolute omitted tail is bounded by

|c_(M+1)| Q^(a+M+1)/[(a+M+1)(1-eta)].

Indeed, the denominator ratio (a+j)/(a+j+1)<=1, while |1-r/n|^2 is convex as a function of 1/n on [0,1/(M+2)]. This proves the stated uniform ratio bound. At cutoff N=16, M=512 is ample, but cancellation in intermediate complex coefficients requires suitably high working precision; only final interval widths establish sufficiency.

A separate 55-digit comparison of this closed formula with regularized direct quadrature at k=0,1,16 is recorded by beta_formula_audit.py/.json. It is a numerical formula check, not the rigorous coefficient enclosure.

## Files

- fourier_tail_constants.py / .json: outward-rounded tail constants and cutoff bounds
- beta_formula_audit.py / .json: independent closed-form versus direct-integral diagnostic
- README.md: analytical proofs and finite-inertia error requirements

Scripts locate the parent interval beta evaluator relative to their own directory. No external publishing or repository modification occurred.
