# Actual-theta signed synthesis can reverse the favorable component ratios

2026-11-04. Analytic result with an independent AI-assisted audit; not external peer review or machine formalization. This is an explicit actual-theta obstruction to a weaker packet-to-selection inference. It is not a counterexample involving the fully X-selected polynomial.

## 1. Main result and scope

Use the actual theta transform F and the nonsingular forms

    Tp=Fp'+2F'p,
    X[p]=||Tp||²,
    H[p]=||Fp'||²,
    V=2(F'²-FF''),
    X[p]-H[p]=integral_R Vp².

Let Q_j^*(t)=P_j^(9/4)(t/2;pi/2) be the favorable natural Pollaczek family. The preceding audited theorem gives

    H[Q_j^*]/X[Q_j^*] <= C/log(j+2)

for sufficiently large j, and its actual normalized Grams have condition number at most exp[C log²(n+2)] through degree n.

Define L_n=floor sqrt(n), a_k=(-1)^k(7/4)_k/k!, and the explicit polynomial

    R_n(t)=sum_(0<=k<=floor(n/2), n-2k>=L_n)
                    a_k Q_(n-2k)^*(t).                  (1)

It has degree n, parity n, and leading coefficient 1/n!. Every component degree tends to infinity and every component has H/X=O(1/log n). Nevertheless,

    H[R_n]/X[R_n] -> 1.                                 (2)

More strongly, normalize the retained natural polynomials and the synthesis by

    e_j=Q_j^*/sqrt(X[Q_j^*]),
    c_j=a_((n-j)/2) sqrt(X[Q_j^*])/sqrt(X[R_n]),
    G_ij=X(e_i,e_j),      J_ij=H(e_i,e_j).

Then the actual quadratic forms satisfy

    c^T G c=1,
    sum_j c_j² J_jj <= C/log n ->0,
    c^T J c ->1,
    ||c||_2² <= C log n.                                (3)

Thus almost all of the synthesized derivative energy comes from its actual off-diagonal correlations, even though its diagonal derivative-energy sum tends to zero. This is not an absolute-column-sum argument or an abstract substitute matrix.

The monic polynomial S_n=n!R_n also satisfies

    c n^(5/2)/log n <= X[S_n]/A_n
                       <= exp[C log²(n+2)],             (4)

where A_n is the actual fully selected monic minimum. Its trial mismatch and excess,

    U_n[S_n]=H[S_n]-B_n,
    Delta_n[S_n]=X[S_n]-B_n,

obey Delta_n[S_n]>0 eventually and

    U_n[S_n]/Delta_n[S_n] ->1.                           (5)

Here B_n is the ordinary derivative minimum shared by every monic degree-n polynomial. The symbols in (5) are explicitly trial quantities, NOT the selected U_n and Delta_n.

The result rules out an inference based only on componentwise favorable H/X, subexponential actual Gram conditioning, and subexponential monic near-minimality. It does not identify c with the selected inverse-Gram column. The possibility that the specific selected column has much better cancellation remains open.

## 2. Actual-theta integrable comparison weights

Set W_4(t)=|Gamma(4+it/2)|². Elementary Euler summation with a cutoff comparable to |t|, held fixed while differentiating, gives

    |zeta(1/2+it)|=O((1+|t|)^(1/2)),
    |zeta^(r)(1/2+it)|=O((1+|t|)^(1/2)log^r(2+|t|)),
                                     r=1,2.

The Hardy phase has first derivative O(log(2+|t|)) and second derivative O((1+|t|)^(-1)) outside a fixed initial interval. Consequently

    |Z(t)|+|Z'(t)|+|Z''(t)| <= C(1+|t|).

The exact gamma envelope satisfies a² asy (1+|t|)^(7/2)exp(-pi|t|/2), with a'/a and a''/a bounded. Since F=aZ up to its fixed sign,

    F²+F'²+|FF''| <= C(1+|t|)^(11/2)exp(-pi|t|/2).

Stirling gives W_4 asy (1+|t|)^7exp(-pi|t|/2), so

    F²/W_4 + |V|/W_4 <= C(1+|t|)^(-3/2).                (6)

In particular,

    I_0=integral_R F²/W_4 >0,
    I_1=integral_R V/W_4

are well defined and I_1 is absolutely convergent. No sign of I_1 is assumed.

## 3. The lambda=4 family has H/X tending to one

Write Q_n^4(t)=P_n^(4)(t/2;pi/2) and ell_n=log(2n). Fixed-parameter Darboux expansion of the generating function gives, uniformly on every fixed compact real interval,

    Q_n^4(t)=2^(-3)n³ Re[
        exp(-i pi n/2)exp(i t ell_n/2)/Gamma(4+it/2)]
                             +O_K(n²),                  (7)

with a differentiated remainder O_K(n²log n). Consequently

    (Q_n^4)'(t)=2^(-4)n³ ell_n Re[
        i exp(-i pi n/2)exp(i t ell_n/2)/Gamma(4+it/2)]
                             +O_K(n³)+O_K(n²log n).     (8)

These derivative errors are obtained directly from the parameter-differentiated generating function, not by differentiating an unspecified real-axis error.

For completeness, (7)-(8) can be proved without importing a globally uniform Darboux theorem. At z=i and z=-i subtract the two leading singular models of

    (1-iz)^(-4+it/2)(1+iz)^(-4-it/2).

For t in a fixed compact set the remainder is bounded by a constant times the sum of the distances to these two singularities raised to power -3. Its t derivative has the same bound with an additional logarithm. On |z|=1-1/n the angular integrals of these bounds are O_K(n²) and O_K(n²log n). Cauchy coefficient extraction proves the stated errors. The leading-model coefficients are Gamma ratios; their fixed-parameter expansions give (7)-(8).

The already audited uniform inner envelope and its differentiated version imply

    W_4|Q_n^4|² <= Cn⁶,
    W_4|(Q_n^4)'|²
       <= Cn⁶[1+log²(n/(1+|t|))],        |t|<=n/4.       (9)

Also exact reference orthogonality gives

    ||Q_n^4||²_(W_4) asy n⁷,
    ||(Q_n^4)'||²_(W_4) <= (pi²/8)||Q_n^4||²_(W_4).

By (6), the contribution from |t|>n/4 to either H[Q_n^4] or the absolute potential integral is O(n^(11/2)).

On fixed compact intervals, (7)-(8) and oscillatory averaging give the limits below. The cross oscillations have frequency ell_n and vanish by the Riemann–Lebesgue lemma (or integration by parts on compact intervals). To pass to the full line, (6) and (9) dominate the normalized integrands by the integrable functions F²/W_4 and |V|/W_4; the remaining far tail has just been bounded. Therefore

    H[Q_n^4]/(n⁶ell_n²) -> 2^(-9) I_0,                 (10)
    (X[Q_n^4]-H[Q_n^4])/n⁶ -> 2^(-7) I_1.              (11)

In particular,

    H[Q_n^4]/X[Q_n^4]=1+O(log^(-2)n),
    ell_n²(H[Q_n^4]/X[Q_n^4]-1) -> -4 I_1/I_0.          (12)

This is an actual-theta statement in both parities. It neither assumes RH nor gives a sign conclusion for the potential.

## 4. Exact connection to the favorable natural family

The generating functions differ by the elementary factor

    sum Q_n^4 z^n=(1+z²)^(-7/4) sum Q_j^* z^j.

Coefficient extraction gives the exact finite identity

    Q_n^4=sum_(k=0)^floor(n/2) a_k Q_(n-2k)^*,
    a_k=(-1)^k(7/4)_k/k!,
    |a_k|<=C(k+1)^(3/4).                               (13)

Let r_n denote the terms removed from (13), with j=n-2k<L_n. The actual natural-family estimates, including the optional derivative-moment corollary, imply for every j>=0 after adjusting constants

    H[Q_j^*] <= C(j+1)^(7/2)log(j+2),
    X[Q_j^*] <= C(j+1)^(7/2)log³(j+2).                  (14)

Use the finite Hilbert–Schmidt/trace bound for the map from the coefficient vector of r_n into its exact source or derivative image:

    X[r_n] <= ||a_low||_2² sum_(j<L_n)X[Q_j^*],
    H[r_n] <= ||a_low||_2² sum_(j<L_n)H[Q_j^*].

There are O(sqrt n) terms and |a_k|²<=Cn^(3/2). Thus

    X[r_n] <= C n^(17/4)log³n,
    H[r_n] <= C n^(17/4)log n.                          (15)

This quadratic bound is used only to remove a negligible low block. It does not estimate the full synthesis by an absolute coefficient sum.

Since R_n=Q_n^4-r_n, Cauchy–Schwarz bounds the change in either full quadratic form by

    O(n^(41/8)log^(5/2)n)+O(n^(17/4)log³n)=o(n⁶).        (16)

Here (10)-(12) supply X[Q_n^4],H[Q_n^4]=O(n⁶log²n). Consequently (10)-(12) remain valid with R_n replacing Q_n^4. In particular (2) follows. Every retained component degree is at least floor sqrt n, so its individual favorable ratio is uniformly O(1/log n).

## 5. A vanishing diagonal energy sum but a nonvanishing full energy

For j=n-2k in the retained set, define c_j and the actual G,J as in section 1. The vector c represents R_n/sqrt(X[R_n]) exactly, so

    c^TGc=1,
    c^TJc=H[R_n]/X[R_n] ->1.

The coefficient bound in (13) gives

    sum_(k=0)^floor(n/2) |a_k|²(n-2k+1)^(7/2) <= Cn⁶.    (17)

Using the H bound in (14) and X[R_n] asy n⁶log²n,

    sum_j c_j²J_jj
       =sum_j |a_((n-j)/2)|² H[Q_j^*]/X[R_n]
       <= C/log n ->0.                                 (18)

Similarly the X bound in (14) gives

    ||c||_2²
       =sum_j |a_((n-j)/2)|² X[Q_j^*]/X[R_n]
       <= C log n.                                    (19)

Thus

    sum_(i!=j)c_i c_j J_ij ->1.

The off-diagonal conclusion follows from actual quadratic forms and the explicit signed connection, not from replacing them by worst-case matrices. All component indices grow; no fixed low-degree derivative contribution explains the effect.

## 6. Monic norm and trial mismatch comparisons

Let S_n=n!R_n. It is monic. By (10) and (16),

    X[S_n] asy (n!)² n⁶log²n.                           (20)

The previously proved lambda=4 reference comparison bounds A_n below by exp[-Clog²(n+2)] times its reference monic norm, and the explicit lambda=4 source bound gives X[n!Q_n^4]/A_n<=exp[Clog²(n+2)]. Since X[S_n]/X[n!Q_n^4]->1, this proves the upper half of (4).

The favorable natural family supplies the independently proved selected upper bound

    A_n <= C b_n^* log³(n+2),
    b_n^*=(4pi/2^(9/2))n!Gamma(n+9/2)
              asy (n!)² n^(7/2).

Combining with (20) proves

    X[S_n]/A_n >= c n^(5/2)/log n ->infinity.

Thus these unfavorable syntheses are not relatively near-optimal, despite meeting the subexponential near-minimality certificate.

For every monic degree-n p, ordinary derivative projection gives exactly

    H[p]=B_n+||p'-n pi_(n-1)||_w².

The natural-family corollary bounds

    B_n <= C b_n^* log(n+2).

Consequently B_n/H[S_n]=O(n^(-5/2)/log n)->0. Equations (2) and (20) now imply eventual positivity of the trial excess X[S_n]-B_n and the trial mismatch limit (5).

The favorable natural monic family itself has trial mismatch/excess ratio O(1/log n), by its H/X bound and B_n/X bound. The two explicit actual-theta families therefore display opposite trial behavior while both satisfy subexponential monic near-minimality bounds. The unfavorable family is synthesized in the same favorable, subexponentially conditioned natural hierarchy. No condition-number theorem for the different hierarchy consisting of the R_n themselves is asserted.

## 7. What this does not resolve

The construction is not the X-selected endpoint. Its coefficient vector is not claimed to equal the inverse-Gram column defining P_n. Therefore it does not prove failure of selected H[P_n]/A_n decay, selected Delta positivity, or U_n=o(Delta_n).

It does establish that the presently proved ingredients do not force the desired transfer by a generic energy argument: componentwise H/X decay, a vanishing coefficient-weighted diagonal H sum, modest quadratic coefficient norm, and subexponential near-minimality can coexist with full synthesized H/X tending to one. A successful positive argument must use a further property of the specific selected vector, such as relative monic near-optimality or a direct bound on its full signed derivative quadratic form.

No claim is made that such a property is false for the natural Pollaczek hierarchy. No old or enlarged Q positivity, inverse-gap estimate, or RH is used anywhere here.

## Dependencies and preservation

Read-only audited inputs:

- /workspace/shared/theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md
- /workspace/shared/theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md, section 3, for the natural hierarchy's actual Gram conditioning.
- /workspace/shared/theta_pollaczek_natural_20261104/UNIFORM_INNER_ENVELOPE.md
- /workspace/shared/theta_pollaczek_natural_20261104/NATURAL_FAMILY_RATIO.md
- /workspace/shared/theta_pollaczek_natural_20261104/ARITHMETIC_SCALE_COROLLARY.md

The new fixed-parameter Darboux argument, asymptotic constants, connection formula, truncation and quadratic comparison are detailed above and checked in INDEPENDENT_TRIAL_RATIO_AUDIT.md. This is AI-assisted analytical research, not external peer review or machine formalization. No literature-novelty claim is made. No frozen input or live 4CT script was modified.
