# An actual-theta obstruction to generic signed-synthesis transfer

2026-11-04. This package constructs an explicit high-degree synthesis of the favorable natural Pollaczek hierarchy whose actual derivative/source ratio tends to one. It does not identify that synthesis with the X-selected inverse-Gram column and does not refute selected coherence.

## Main construction

Let Q_j^*=P_j^(9/4)(t/2;pi/2). Define

    R_n=sum_(k>=0, n-2k>=floor sqrt n)
          (-1)^k (7/4)_k/k! Q_(n-2k)^*.

This is an exact degree-n, parity-preserving polynomial with leading coefficient 1/n!. All component indices tend to infinity, and every component has actual H/X=O(1/log n). Nevertheless,

    H[R_n]/X[R_n] ->1.

In the individually X-normalized natural basis, the coefficient vector c representing R_n/sqrt(X[R_n]) satisfies

    c^T G c=1,
    sum_j c_j² H[e_j] <= C/log n ->0,
    c^T J c ->1,
    ||c||_2² <= C log n.

Thus the actual off-diagonal derivative contribution tends to one. This is an exact-theta quadratic calculation, not an abstract matrix model or an absolute coefficient-sum estimate.

The natural synthesis basis has the previously proved exp[O(log² n)] actual Gram condition bound. No conditioning claim is made for the different basis formed by the R_n themselves.

## Monic comparison and trial mismatch

For S_n=n!R_n,

    c n^(5/2)/log n <= X[S_n]/A_n
                       <= exp[C log²(n+2)].

Thus the synthesis meets the current subexponential near-minimality certificate while failing relative near-optimality. Its trial derivative mismatch/excess ratio tends to one. The favorable natural trials have ratio O(1/log n). Both statements are about explicit trials, not the selected endpoint.

The proof uses the exact parameter-connection multiplier (1+z²)^(-7/4). Its full, untruncated lambda=4 polynomial has compact oscillatory derivative energy of order n⁶log²n. The low-index terms removed above have source and derivative norms too small to affect the limit. Every retained component is therefore favorable individually, while its signed synthesis is unfavorable.

## Exact asymptotics behind the result

With W_4=|Gamma(4+it/2)|², I_0=integral F²/W_4>0 and I_1=integral V/W_4,

    H[R_n]/(n⁶log²(2n)) ->2^(-9)I_0,
    (X[R_n]-H[R_n])/n⁶ ->2^(-7)I_1.

I_1 is absolutely convergent, but no sign is assumed. All real Xi zeros remain included.

## Final files

- ACTUAL_SIGNED_SYNTHESIS_OBSTRUCTION.md: complete proof, exact constants, truncation, quadratic-energy comparison, and scope.
- INDEPENDENT_TRIAL_RATIO_AUDIT.md: independent audit, including the final quadratic statement and wording corrections applied to the proof.
- SHA256SUMS: final payload hashes.

## Remaining selected question

This result blocks a generic transfer based only on favorable component ratios, a vanishing diagonal energy sum, subexponential Gram control, and subexponential monic near-minimality. It does not show that the particular selected inverse-Gram column behaves like this bad synthesis. A stronger property of that specific vector, or a relative monic estimate, remains necessary.

No positive or negative conclusion about selected Delta_n or U_n/Delta_n is claimed, and there is no RH conclusion. No old or enlarged Q positivity or inverse-gap bound is assumed.

This is AI-assisted analytical research with an independent AI-assisted audit, not external peer review or machine formalization. All inputs are identified in the proof. No literature-novelty claim is made. No prior frozen package, live 4CT script, repository, or external service was modified.
