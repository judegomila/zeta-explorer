# The natural gamma reference and its all-degree quadratic bounds

2026-11-04. This extends the proved reference comparison to the Pollaczek parameter naturally matched to the theta gamma envelope. It does not assert the still-missing actual Hardy-Z estimate for these trial polynomials.

## 1. Exact envelope comparison

Ignore the fixed positive theta-normalization constant and set

    a(t)=(t²+1/4)|Gamma(1/4+it/2)|,
    W_*(t)=|Gamma(9/4+it/2)|².

The Gamma recurrence gives the exact identity

    a(t)²/W_*(t)=16(t²+1/4)/(t²+25/4).                    (1)

The ratio lies between 16/25 and 16, so W_* is uniformly comparable to the exact positive gamma envelope squared, including at t=0. The actual F² still equals a²Z² and retains every arithmetic zero; (1) does not remove Z or replace the theta form by its reference.

Let

    M_n^*(t)=n!P_n^(9/4)(t/2;pi/2),
    b_n^* = ||M_n^*||²_(W_*)
          =(4pi/2^(9/2)) n!Gamma(n+9/2).

These are explicit monic parity-preserving polynomials.

## 2. A two-sided actual-source comparison

There is a fixed C such that every degree-at-most-n polynomial satisfies

    exp[-C log²(n+2)] ||p||²_(W_*)
       <= X[p] <= C(n+1)^3 ||p||²_(W_*).                 (2)

For the lower inequality, the minimum-modulus, good-point, primitive and Markov argument in ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md already proves

    X[p]>=exp[-Clog²(n+2)] M_c(p)²,
    M_c(p)=sup_t exp(-c|t|/2)|p(t)|.

Here W_*(t) is comparable to (1+|t|)^(7/2)exp(-c|t|). The same restricted-range and tail argument gives

    ||p||²_(W_*)<=C(n+1)^(9/2) M_c(p)².

Absorbing this power proves the lower half of (2).

For the upper inequality, the elementary bound |Z|+|Z'|<=C(1+|t|), together with (1) and bounded a'/a, gives

    F²+F'² <= C(1+t²)W_* .                              (3)

The exact signed derivative expansion and orthogonality give, for every normalized Pollaczek polynomial psi_j in this weight,

    ||psi_j'||²_(W_*)<=pi²/8.

Consequently the degree-n derivative map has operator norm squared at most (n+1)pi²/8 by its Hilbert–Schmidt norm, as in the companion proof.

The exact three-term recurrence in the orthonormal basis is

    t psi_j = a_(j+1) psi_(j+1)+a_j psi_(j-1),
    a_j=sqrt(j(j+7/2)),

where the negative-index term is absent. Thus multiplication by t on degree-at-most-n polynomials has norm at most C(n+1). In particular,

    ||tp||²_(W_*)<=C(n+1)²||p||²_(W_*),
    ||tp'||²_(W_*)<=C(n+1)³||p||²_(W_*).

Apply (3) to the exact source square:

    X[p] <= C[||p||²+||tp||²+||p'||²+||tp'||²]_(W_*)
          <= C(n+1)³||p||²_(W_*).

This proves (2) without using absolute selected synthesis sums.

## 3. Explicit monic consequence and actual Gram geometry

For a single M_n^*, its reference derivative norm is bounded by a constant times b_n^*. Applying the multiplication estimate after differentiation therefore improves the general upper bound to

    X[M_n^*] <= C(n+1)² b_n^*.

Monic minimization and the lower bound in (2) give

    exp[-Clog²(n+2)]b_n^* <= A_n
        <= X[M_n^*] <= C(n+1)²b_n^*,                    (4)

    theta_n(M_n^*)=A_n/X[M_n^*]
        >= exp[-Clog²(n+2)].                            (5)

The actual X Gram in this W_*-orthonormal basis has condition number at most exp[Clog²(n+2)]. The same holds after individual X normalization by diagonal congruence, with a changed constant. The exact selected quadratic coefficient norm in the W_*-orthonormal basis is likewise at most exp[Clog²(n+2)].

Thus the naturally matched family has the same proved subexponential relative-norm and conditioning control as the lambda=4 family. These bounds are independently derived estimates, not assumed synthesis localization.

## 4. Remaining arithmetic step

The scalar reference derivative inequality is not the actual inequality H[M_n^*]/X[M_n^*]->0. To establish that, a promising route would prove an integrable global envelope for a(M_n^*)' and combine it with the ordinary Z² mean-square bound, while using the existing local Hardy-Z top-mode theorem on an interior linear region to lower-bound the source. A differentiated, global, quantitative Pollaczek asymptotic with controlled origin and turning-point regions is required for this route and is not supplied here.

Even if the actual trial ratio were proved small, (4)-(5) are not relative near-optimality. They do not by themselves transfer small trial H/X through the actual selected residual or establish U_n=o(Delta_n). Large signed cancellations remain part of the selected problem.

The source factorization, exact derivative expansion and reference orthogonality are the same as in the companion audited notes. The recurrence is the standard Pollaczek recurrence at phi=pi/2, checked directly by differentiating its generating function in z; rescaling t=2x gives the coefficients displayed above. No prior frozen package or live 4CT script was changed.
