# Actual-prime higher moments and the local anchor cost

18 October 2026. New bounded arithmetic calculation, independently checked in an internal mathematical review. All coefficients are the actual fixed prime coefficients. No arbitrary-coefficient counterexample is used.

Use S(t)=Re D(t), D(t)=sum_(p<=Q) a_p p^(-it), a_p=(1-p^(-1/8))p^(-417/500). Put A2=sum a_p^2 and B2=sum p a_p^2. Write r=2-2s0=83/250. Then
A2<=Z=2^(-2s0)+2^(1-2s0)/(2s0-1),
B2<=Q^r/r.                                                   (1)
The second bound follows by enlarging to integers and integrating the decreasing function y^(1-2s0) from1 toQ.

## 1. Elementary weighted translated mean square

For any finite Dirichlet polynomial F(t)=sum_(n<=N)c_n n^(-it), any V and L>0,

integral_V^(V+L)|F(t)|^2dt
 <=L sum |c_n|^2+9(1+log N) sum n|c_n|^2.                    (2)

To prove it, expand the integral. The off-diagonal contribution is at most4 sum_(m<n)|c_m c_n|/log(n/m). For n<=2m, use 1/log(n/m)<=n/(n-m) and n<=sqrt(2mn). Group by d=n-m and apply Cauchy to sqrt(m)|c_m| and sqrt(m+d)|c_(m+d)|. This gives at most4sqrt2(1+log N)sum n|c_n|^2. For n>2m, use 1/log(n/m)<=1/log2, enlarge to all unordered pairs, and then (sum |c_n|)^2<=(sum n|c_n|^2)(sum_(n<=N)1/n). This gives at most(2/log2)(1+log N)sum n|c_n|^2. Since4sqrt2+2/log2<9, (2) follows. The constants are independent of V; no local cancellation is assumed.

## 2. Actual-prime combinatorics

For every positive integer k, unique prime factorization gives
D(t)^k=sum c_n n^(-it),
c_(product p^alpha_p)=[k!/product alpha_p!] product a_p^alpha_p,
where sum alpha_p=k and p<=Q. Consequently

sum |c_n|^2<=k! A2^k,
sum n|c_n|^2<=k! B2^k.                                     (3)

For example, square the multinomial coefficient and bound one copy by k!; summing the remaining multinomial gives A2^k. The weighted version replaces a_p^2 by p a_p^2. Thus (2), with N<=Q^k, proves the fully explicit local estimate

integral_V^(V+L)|D(t)|^(2k)dt
 <=k![L A2^k+9(1+k log Q)B2^k].                            (4)

This exploits the actual prime support in the diagonal combinatorics. It does not provide signed off-diagonal cancellation beyond the displayed elementary mean-value cost.

## 3. Full Poisson moments and local exceptional sets

For fixed x>0 let J_x(T)=E_Px S^2. Jensen and |S|<=|D| give J_x(T)^k<=E_Px |D|^(2k). Tonelli and the translation-uniform estimate (4) therefore show, on every interval I of length L,

integral_I J_x(T)^k dT
 <=k![L A2^k+9(1+k log Q)B2^k].                            (5)

The measure of {T in I:J_x(T)>j0} is at most the right side divided by j0^k. The whole Poisson carrier line is retained. The same cutoff Q and x are fixed in this assertion.

At Q=U^(1/2), the explicit upper bound for B2^k grows as U^(83k/500), apart from constants. For each fixed k<=6 this error is eventually o(U), even with the logarithmic factor, because83k/500<1. This yields exceptional measure O_k(U/(log U)^(2k)) at j0 proportional to(log U)^2. The onset is not supplied for a full zero-free certificate, and the constants in k are retained in (4). For k>=7, this particular all-integer error allowance is no longer o(U). That is a limitation of this explicit allowance, not proof that the actual moment is large or that stronger mean-value estimates cannot improve it.

## 4. Exact cost for a local anchor

A target is guaranteed to have a good anchor in its centered radius-R interval if the local bad-set bound is strictly less than2R. By (5), a sufficient condition is

j0^k>k! A2^k,
R>9k!(1+k log Q)B2^k/[2(j0^k-k! A2^k)].                    (6)

The independently checked Poisson propagation permits that anchor to control the target at threshold jstar>j0 only when
R<=x[sqrt(jstar/j0)-sqrt(j0/jstar)].
Combining these gives a precise sufficient local arithmetic test. With j0 a fixed proportion of jstar and jstar of logarithmic-square size, the explicit upper allowance from (1) in the right side of (6) grows as a positive power of Q divided by a logarithmic power, whereas the available propagation radius stays bounded. Thus this standard higher-moment application does not establish the required narrow-window anti-clustering.

The missing improvement is now explicit: replace the B2^k contribution in (4)--(6) by a genuinely smaller, carrier-local estimate for these actual prime coefficients, or prove that its signed off-diagonal terms cancel at the chosen carriers. Raising moments while retaining this error merely strengthens global density estimates; it does not automatically supply an all-height bridge. No arbitrary coefficients or subsets are substituted for the actual prime sum.
