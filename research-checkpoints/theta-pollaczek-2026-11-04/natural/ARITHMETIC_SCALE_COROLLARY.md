# Actual source scale and the ordinary derivative minimum

2026-11-04. Corollary of the global envelopes in NATURAL_FAMILY_RATIO.md and the previously verified cumulative Hardy-Z derivative moment. It supplies further all-degree estimates but no selected-coherence conclusion.

## 1. Statement

For the natural monic family

    M_n(t)=n!P_n^(9/4)(t/2;pi/2),
    b_n=(4pi/2^(9/2))n!Gamma(n+9/2),

there are constants c,C>0 such that, for all sufficiently large n,

    c b_n log² n <= X[M_n] <= C b_n log³ n.              (1)

The upper bound extends to every n>=0 with log(n+2). The lower bound here is the preceding top-mode theorem, not a new arithmetic asymptotic with a leading constant.

For the monic ordinary w=F² orthogonal polynomial pi_(n-1), write

    B_n=n²||pi_(n-1)||_w²,      n>=1,
    B_0=0.

Then for all n>=0,

    B_n <= C b_n log(n+2),                              (2)
    A_n <= C b_n log³(n+2),                             (3)

where A_n is the actual X-selected monic minimum. The companion reference comparison gives separately

    A_n >= exp[-C log²(n+2)] b_n.                       (4)

The lower bound (4) does not dominate the upper bound (2), so these statements do not establish Delta_n=A_n-B_n>0.

## 2. Derivative arithmetic input

The frozen short-packet and monomial notes verified the published unconditional formula

    A_1(T)=integral_0^T Z'(t)²dt
          =(T/12)P_3(log(T/(2pi)))+R_1(T),
    R_1(T)=O(T^(5/12)log³T),                            (5)

where P_3 is a fixed monic cubic. This is the Korolev–Shubin theorem on printed page 171 of their 2020 chapter, as identified and source-checked in the frozen notes. Its deterministic differentiated main density is O(log³(2+T)). No derivative of R_1 is taken.

The exact source theorem itself used only the ordinary Z² mean and the actual finite-band floor. This optional upper-scale corollary additionally depends on (5).

## 3. Integration against the nonoscillatory envelope

Keep Q_n=M_n/n!, h_n=b_n/(n!)², f_n=aQ_n and v_n from the main theorem. That theorem proves

    f_n² <= C h_n v_n,
    integral v_n=O(1),
    TV(v_n)=O(n^(-2/3)+n^(-1)log²n),
    integral v_n log³(2+t)=O(log³n),

with an exponentially decaying exterior tail on scale n^(1/3).

Apply Stieltjes integration by parts to (5), first between 2 and Kn for fixed K>2. The remainder contribution is bounded by

    C n^(5/12)log³n [v_n(2)+v_n(Kn)+TV(v_n)]
       =O(n^(-1/4)log³n+n^(-7/12)log⁵n)=o(1).

The bounded initial interval is harmless. The exterior tail is handled by the same integration by parts, using its exponential decay and the polynomial bound for R_1(t); its contribution is smaller than the displayed bound. Thus

    integral_R v_n Z'² <= C log³(n+2),
    integral_R a² Q_n² Z'² <= C h_n log³(n+2).            (6)

The exact decomposition

    TQ_n=2aQ_nZ'+aZQ_n'+2(a'/a)aQ_nZ

and the main theorem's mass/derivative upper bounds imply

    X[Q_n] <= C h_n log³(n+2).

Multiplying by (n!)² proves the upper half of (1) and the selected upper bound (3). The constants can absorb the finitely many small degrees.

## 4. The ordinary derivative minimum

The same main theorem gives

    integral F²(M_(n-1))² <= C b_(n-1)log(n+2).

Since M_(n-1) is a monic admissible competitor for the ordinary w norm,

    B_n=n²||pi_(n-1)||_w²
        <= C n² b_(n-1)log(n+2).

The reference norms satisfy exactly

    b_n/b_(n-1)=n(n+7/2).

Therefore n²b_(n-1)<=b_n for n>=1, proving (2). Parity is respected throughout.

For the explicit trial polynomial, (1)-(2) do imply B_n/X[M_n]=O(1/log n). They do not replace X[M_n] by A_n: minimizing X may change its relative size and its derivative cancellation. No selected Delta sign or U_n/Delta_n estimate is inferred.

## Sources and boundary

The additional published input is M. A. Korolev and A. V. Shubin, “The Second Moment of the First Derivative of Hardy's Z-Function,” in Trigonometric Sums and Their Applications (2020), pp.169-182. Publisher identity: https://link.springer.com/chapter/10.1007/978-3-030-37904-9_9 . The exact theorem statement and the distinction between its cumulative cubic and differentiated main density were checked in the frozen /workspace/shared/theta_short_packet_20261104/MESOSCOPIC_FEJER_HARDY_Z_ASYMPTOTIC.md and its audit.

This corollary does not independently reprove that published theorem. It uses no RH, zero-spacing hypothesis, enlarged Q positivity or inverse-gap bound. The independent audit of the new integration and degree conversion is appended to NATURAL_FAMILY_RATIO_AUDIT.md. No prior frozen file or live 4CT script was modified.
