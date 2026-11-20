# Opposite sign of the adjacent odd arithmetic remainder

Independently reviewed analytic PASS. This guards the exact scope of the even-target degree-only tail result.

For an odd physical test t Q_N(t²), the actual normalized density multiplier is t² Q_N(t²)². Its midpoint field is
 C_N^odd=(-D²/4) Q_N(-D²/4)^2 C.
If the relevant known shifted prefix gives Q_N positive roots, the operator
 A_N=(D²/4) Q_N(-D²/4)^2
has nonnegative coefficients on even derivatives and highest order K=4N+2. It need not have a nonzero constant coefficient; that is not used in the positive-tail proof, since W(S)>0 for S>0.

Apply exactly the termwise central/tail estimates from DEGREE_ONLY_ARITHMETIC_TAIL to A_N. They require even derivative orders and nonnegative coefficients, not that K be divisible by4. With
 z_K=max{64pi,K(9+2K),(2K+7)(3K+7)/4,
                  (1/2)log[24*6400(K+2)²(K+3)³]},
both A_N C_f(R) and A_N A_f(R) are strictly positive when pi e^(2R)>=z_K. Therefore the corresponding kernels of C_N^odd=-A_N C are strictly NEGATIVE there.

In the exact divisor expansion, all arithmetic terms k>=ceil(z_K/pi) of this odd target are negative for every r>=0. They cannot be omitted in a lower bound. Their absolute magnitude is bounded by the same complete-orbit estimates, but an odd-rung proof must pay that remainder rather than count it as positive reserve.

This is not a counterexample to the odd pivot, which can remain positive because of its finite arithmetic core. It is a precise obstruction to extending the even-target positive-remainder argument unchanged to the other ladder. No unknown odd norm is used in establishing the sign reversal. For N=0, K=2, the same displayed maximum and proof apply; the optional crude bound stated previously only for K>=4 need not be used.
