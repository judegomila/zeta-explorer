# Sharp two-moment clipping and a single payment for higher prime powers

18 October 2026. New companion to the Poisson tail-energy and smooth-density identities. Independently checked in an internal mathematical review. The required arithmetic estimate remains open.

## 1. Exact moment-only upper bound

For any real square-integrable random variable X with mean a and variance v,

E X_+ <= [a+sqrt(a^2+v)]/2.                                  (1)

Indeed X_+=(X+|X|)/2, and Cauchy gives E|X|<=sqrt(E X^2). This requires no sign assumption on a. The bound is sharp among all distributions with those two moments: if r=sqrt(a^2+v)>0, take X=+r with probability (1+a/r)/2 and X=-r otherwise. The case r=0 is immediate. This optimality statement concerns moment information alone, not the distribution of the actual prime sum.

For B>0, the right side of (1) is strictly less than B if and only if

a<B and v<4B(B-a).                                           (2)

The first condition ensures 2B-a>0 and hence permits squaring. Conversely, (2) implies sqrt(a^2+v)<2B-a. In comparison, the earlier inequality a+v/(4a) for a>0 is only a convenient weaker consequence of (1).

## 2. Pay the higher powers only in the threshold

Retain the preceding finite Euler logarithm L=-S+R, where S is its first-prime cosine sum and |R|<=C=C(s0). Pointwise,

(c+L)_+ <= (c+C-S)_+.

Writing m=E_Px S and v_prime=Var_Px S, equation (1) therefore gives

E_Px(c+L)_+ <= [a+sqrt(a^2+v_prime)]/2,
a=c+C-m.                                                     (3)

There is no additional higher-power variance cost in this bound. It is a deterministic majorant using the full previously proved remainder bound; it does not discard higher powers or presume their sign.

For a target in the finite rectangle define
B=-w_L log 2-w_R R_right-w_H B_horizontal.
All symbols on the right are the same boundary quantities as in the Poisson-domination criterion. If B>0, it is sufficient that

a<B and v_prime<4B(B-a).                                     (4)

All edge hypotheses and every-target coverage requirements remain unchanged.

## 3. Exact actual-prime discrepancy input

Set s0=417/500, h=1/8, s0<b<=7/8, x=b-s0, and use the smooth-density companion's actual remainder Delta(v), energy
E_Delta=x integral_1^Q v^(2x-1)|Delta(v)|^2 dv,
and constant K=4/log2+8/(log2)^2. Its proved estimates give

m >= Re Delta(1)-e_mean,
e_mean=K Q^(1-b)/T,
sqrt(v_prime)<=sqrt(E_Delta)+e_energy,
e_energy=(K/sqrt(2)) Q^(1-s0)/T.

Define a0=c+C-Re Delta(1)+e_mean. Since (a+sqrt(a^2+v))/2 is nondecreasing in each of a and v, a sufficient arithmetic condition is exactly

B>0,
a0<B,
(sqrt(E_Delta)+e_energy)^2 <4B(B-a0).                        (5)

No assumption a0>0 is needed. The positive logarithmic margin is now expressed solely through the appropriate one-sided actual-prime mean and the integrated actual-prime discrepancy energy. Both remain unproved uniformly in the carrier at the required strength. The elementary continuum payments are explicit and decay for Q<=sqrt(T); that fact is not a bound for Delta.

Equation (5) is a sharper sufficient test than separately charging the power remainder to both mean and variance. It is not a global zero-free curve, an effective onset, or evidence that the remaining test is satisfied. The sharpness example in section 1 must not be mistaken for an arithmetic counterexample.
