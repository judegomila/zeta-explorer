# Actual whole-even coercivity through sqrt(33/2)

**Internally reviewed, independently replayed computer-assisted finite-support
theorem, 30 October 2026.** Acceptance here is not external peer review or
proof-assistant formalization.
This note states the exact mathematical claim, the actual operator, the
new inverse inequality, the computer-assisted finite gate and its provenance.
It does not establish the odd sector, a cofinal family of supports, or RH.

## 1. Exact statement and quantifiers

Set X=33/2, lambda_star=sqrt(33/2), W=log(33/2), and
I_star=[−W/2,W/2]=[−log(lambda_star),log(lambda_star)]. Use the actual completed
Weil form q defined below, with functions extended by zero outside their
support interval. There exists a constant delta_star>0 such that

    q[f] >= delta_star ||f||²_(L²(R))

for **every complex-valued reflection-even function** f in the actual
logarithmic form domain with support contained in I_star. The same inequality,
with the same existential delta_star, holds for every 1<lambda<=lambda_star
and every such even f supported in [−log(lambda),log(lambda)]. In particular it
holds for all smooth compactly supported even test functions in those boxes.

Reflection-even means f(−x)=f(x) almost everywhere; it does not mean real-valued,
even Fourier index, or a candidate-dependent orthogonal complement. No mean-zero
or removed-constant constraint is imposed. The constant mode is included.

No numerical value for delta_star is claimed here. The reported LDL pivots
are congruence/inertia diagnostics, not spectral eigenvalue floors.

## 2. Actual operator and domain

Use Fourier transform fhat(t)=integral_R f(x)exp(−itx)dx and Parseval factor
1/(2pi). Put

    a(t)=Re psi(5/4+it/2)−log(pi),
    c(x)=cosh(x/2),
    K_0(x,y)=exp(−|x−y|/2),
    P=sum_(2<=n<X) Lambda(n)/sqrt(n) (S_log(n)+S_−log(n)),

where S_r denotes zero-extended translation, compressed to I_star. The form
on the even sector is

    q[f]=(1/(2pi)) integral_R a(t)|fhat(t)|²dt
             +2|<c,f>|²−<f,K_0 f>−<f,Pf>.               (6)

The full operator has an additional −2|<sinh(x/2),f>|² term; it is exactly zero
on reflection-even functions, and is not discarded in any claimed odd result.
Formula (6) is the actual completed Weil form, not a periodic prime operator,
prolate surrogate, or ground-state model.

The domain consists of zero-extended supported L² functions satisfying

    integral_R log(2+|t|)|fhat(t)|²dt < infinity.

The accepted gamma decomposition identifies the corresponding box Fourier
form domain, and finite Fourier polynomials are a form core. The bounded
prime, pole and K_0 terms do not alter this domain. Closure therefore extends
the certified inequalities from the core to every stated form-domain vector.

The even orthonormal box basis is phi_0=W^(−1/2),
phi_j=sqrt(2/W)cos(2pi jx/W), j>=1. Exactly the prime powers
2,3,4,5,7,8,9,11,13,16 occur; prime17 is outside the support. All actual matrix
entries, including constant mode, diagonal overlaps and coupling phases, are
recomputed at exact W=log(33/2).

## 3. Certified whole-tail starting inequalities

Split the even basis into head0..N and tailj>N, with N=2048. Write the actual
block operator as [[A,C*],[C,D]]. The gamma symbol has decomposition

    A_a=diag_j a(2pi j/W)+E_gamma,
    ||E_gamma||<=Gamma,
    Gamma=1853/1000+3/(5W)+(4/5)e^(−5W/2)/(1−e^(−2W)).

The positive even pole can be dropped in the lower direction. Positivity and
the actual Fourier trace of K_0 give

    ||Q_N K_0 Q_N||<=H_K/N,
    H_K=W[W+2(1−e^(−W/2))]/(2pi²).

The gamma remainder bound is global. The K_0 bound covers the entire tail
compression, including all of its near/far interactions; H_K/N is not asserted
to bound the head-to-tail K_0 block. Proofs and domain justification are in
`FULL_TAIL_COERCIVITY.md` and the included gamma source. The independently audited eighth-power weighted-Schur
enumeration, with every path's actual support intersection retained, proves

    ||P|| < 3.820103192196 < P*=477513/125000.

Selfadjointness, not positive semidefiniteness of P, justifies the even-power
norm root. Set

    d_j=a(2pi j/W)−Gamma−H_K/N−P*,
    d=diag_(j>N)d_j,      B=P*I−P_tail.

Then the entire actual tail obeys

    D>=d+B,       0<=B<=2P*I.                            (7)

The monotonicity of the archimedean symbol proves d_j increasing, and the
fresh scalar gate proves d_min=d_(N+1)>0.7061304911532. This is not a sampled
minimum. With J=16384, write d_far=d_(J+1)>0.

## 4. New global inverse inequality

Let T=d^(−1/2)Bd^(−1/2), a bounded PSD operator with
||T||<=2P*/d_min. For 0<=t<=kappa=2P*/d_min and
0<=c<=1/(1+kappa),

    1/(1+t)<=1−ct.

Functional calculus, congruence and positive inverse order yield

    D^−1 <= (d+B)^−1 <= d^−1−c d^−1 B d^−1.             (8)

This reasoning is valid on the common closed-form domain even though d and D
are unbounded; T is bounded. It does not use squared-inverse order. The fresh
verified ceiling is0.0846036249190816..., so fix the exact rational c=2/25.

This is the essential change from the previous failed comparison, which kept
only d^−1 and charged every direction by the worst prime norm.

## 5. Complete far control and safe head Gram reduction

For any finite head vector v put z=d^−1Cv and split z=z_n+z_f at J. Define

    Near(v)=sum_(N<j<=J)|(Cv)_j|²/d_j,
    Y=d_n^−1 C_n,
    E(v)=<Yv,B_nn Yv>.

The unchanged independently audited all-separated-phase far construction
supplies a finite explicit PSD form

    F(v)=v*(P_feature* H P_feature+rem I)v
         >=sum_(j>J)|(Cv)_j|²/d_j.                       (9)

It uses72 features (L=36), the exact rational phase classes, all nonidentity
global Abel charges, signed identity moments, fresh monotone inverse steps,
the entire coefficient error, and the complete geometric remainder. The
full formulas are in the included `generic_full_inputs.py` and
`ALL_SEPARATED_PHASE_METHOD.md`; the source-defined H and rem are direct Arb
evaluations, not fitted matrix data. No oscillatory cache or old-support
moment matrix is imported.

By (9), ||z_f||²<=F(v)/d_far and <z_f,Bz_f><=(2P*/d_far)F(v). PSD-seminorm
Cauchy–Schwarz and Young, with fixed epsilon=1/4, give for **all** v

    <z,Bz> >= (3/4)E(v)−3(2P*/d_far)F(v).

Combining with (8) gives

    A−C*D^−1C >= A−Near−rF+(3/50)Y*B_nnY,
    r=1+(6/25)(2P*/d_far)=1.6583678812485898....           (10)

Both H and rem are multiplied by r. Every prime near/far cross interaction is
included through the seminorm bound; the invalid inequality
B>=diag(B_nn,0) is never assumed.

Let v0 be the exact rational vector specified by the180-digit decimal strings
in `LAST_CORE_FROZEN_TRIAL.json`. It is only a fixed algebraic choice of test
vector, not an assumed eigenvector. Put

    y0=Yv0,   E0=<y0,B_nn y0> >0,   e=Y*B_nn y0,
    u=sqrt((3/50)/E0)e.

Again by PSD-seminorm Cauchy–Schwarz,

    Y*B_nnY >= ee*/E0.

Therefore the following **finite matrix** is a lower bound for the actual
Schur complement on the whole head:

    M=A−C_n*d_n^−1 C_n−r(rem I+P_feature*H P_feature)+uu*. (11)

This safe Gram reduction is exact at v0. It happens after the global
cross-band estimate, not by dropping the cross blocks of B itself.

## 6. Complete interval certificate and independent verification

All quantities in (11) are freshly computed with1000-bit Arb using
python-flint0.9.0. E0 is positive, and independent tests verify the Cauchy
convolutions, the actual negative-prime signs, forward/transpose couplings,
the coordinate-zero treatment, e*v0=E0 and the rank-one normalization.

The original near core is displacement rank4. With nodes x_k=k², adding
the wedge pair (x_k u_k,u_k) and diagonal u_k² adds exactly uu*, producing
rank at most6. A verified factor of the72-dimensional coefficient H handles
the far term by a whitened Schur test. The old artificial constant-coordinate
lift is removed exactly; the new uu* is a proved lower correction, not a lift.

The complete producer and isolated independent replay each prove:

- All2049 corrected-core LDL pivots strictly positive.
- All72 coefficient-H pivots strictly positive.
- All72 whitened-Schur pivots strictly positive.
- Every pinned source unchanged before and after each run.

The last/minimum core pivot is1.25343176232468965e−77 with160 relative-accuracy
bits. The minimum whitened pivot is0.78142924503538287. These are not eigenvalue
floors. Every non-timing receipt field, including the entire permutation,
matches between runs. The isolated replay checks all19 copied source files
and115 copied runtime files unchanged. It is not the producer rereading its
own result. The independent analytic/source audits are separate from replay.

The three finite tests prove M>0, not just positivity along v0 or on a small
head. The33-mode direct-dense preflight is additional implementation evidence,
not a substitute for the complete2049-mode test.

## 7. From the finite gate to whole-even coercivity

By (11), the actual head Schur complement S=A−C*D^−1C is positive definite.
Since the head is finite dimensional, S>=sI for some s>0. Also D>=d_min I.
The block form factors by the bounded invertible triangular map

    (v,w) -> (v,w+D^−1Cv)

into the direct sum of S and D. The coupling C is bounded: the diagonal
archimedean part has zero cross block, and the gamma remainder, prime,
continuum and pole terms are bounded at this fixed support. Thus there exists
delta_star>0 with q>=delta_star I on the entire even form domain. This proves
the main statement without identifying an LDL pivot with s or delta_star.

For a smaller support, zero extension into I_star is an isometry and leaves
the actual whole-line expression (6) unchanged. Translations beyond the
smaller support have zero overlap. Reflection parity and the form domain are
preserved. Restricting the proved inequality therefore gives the identical
delta_star inequality on every smaller box. No operator-norm continuity in
support, new phase approximation, or cutoff extrapolation is needed.

## 8. History, scope and reproduction

The old diagonal-only inverse comparison at X=33/2 genuinely failed. Its
saved exact vector has old lower energy−3.93982120313e−77, while (10) on the
same vector is+1.83124651086e−76. The old failure never showed actual negative
Weil energy. Its sources, receipts and terminal manifest remain unchanged;
terminal SHA256 is
`ac80ae840bc9fb057bc5858c8473aa30b82bb3a0be5693499512d5cb30e8980c`.

The new proof extends only the finite reflection-even endpoint from
sqrt(161/10) to sqrt(33/2). No claim is made about the odd sector, all scales,
zero-free regions, the global ground state, or RH.

The accompanying integration manifest lists the exact source slice, proof
notes, receipts, hashes and replay commands. Preserve the frozen package and its receipts. The essential command from a
fresh disposable copy of the source-tree root is

    PYTHONPATH=/path/to/python-flint-0.9.0 python \
      rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/certify_prime_retained_rankone.py --full

Use `--small` for the direct-dense/generator preflight. Sources
are parameterized only by the frozen exact settings stated here. No remote,
PR, merge or deployment state was changed in producing this result.
