# Coupled prime-retained inverse improvement and rank-one replay specification

30 October 2026. New local analytic bound and one exact-vector interval gate.
The accepted endpoint remains sqrt(161/10). No new whole-head certificate or RH
claim follows from the directional gate.

## Result first

The exact rational vector which made the old sufficient lower surrogate
negative, −3.93982120313e−77, has a strictly positive lower value
**+1.83124651086e−76** under the fixed quadratic correction below. The more
precise seminorm-triangle bound gives +2.05805001641e−76. Both include every
infinite-far charge and all cross-band couplings. These are lower estimates on
the Schur-complement energy for this one head direction, not merely positive
actual head energy, and not a claim about all head directions.

`PRIME_RETAINED_DIRECTION_GATE.json` uses the unchanged X=33/2, N=2048,
J=16384, eighth-power norm envelope P*=477513/125000, and 1000-bit Arb.
Every near coupling is freshly evaluated; the old exact-vector budgets overlap.
The full old producer and terminal manifest were not changed.

## 1. Retain a positive piece of the actual tail

Let A be the actual reflection-even Weil operator, D its compression to
j>N, and P_T the compression of the actual self-adjoint prime translation
operator to that same entire tail. The actual operator decomposition, bounded
gamma remainder and even compressed K estimate in
`rh_attack_cycle_20261028/tail_coercivity/FULL_TAIL_COERCIVITY.md` give

    D >= diag(a_j−Gamma−H_K/N) − P_T = d+B,
    d=diag(d_j),   d_j=a_j−Gamma−H_K/N−P*,
    B=P* I−P_T,   0 <= B <= 2P* I.

The last inequality uses the already independently certified whole prime norm
||P||<=P*. Its compression cannot increase the norm. No prime-power sweep,
support change, gamma improvement or extra norm conjecture is involved.

Put T=d^(−1/2) B d^(−1/2). Since d>=d_min I>0,
0<=T<=kappa I, kappa=2P*/d_min. Spectral calculus gives

    (I+T)^−1 <= I−cT,       0<=c<=1/(1+kappa),
    D^−1 <= d^−1−c d^−1 B d^−1.                         (1)

Indeed 1−ct−1/(1+t)=t(1/(1+t)−c)>=0 on [0,kappa].
This uses congruence and positive inverse order, never invalid squared-inverse
order. It is an inequality on the entire infinite tail. The verified ceiling
is 0.084603624919..., and we fix the exact rational c=2/25.

## 2. Every cross-band term is paid

For a head vector v let b=Kv be its actual tail coupling and z=d^−1b.
Split z=z_n+z_f at J, where z_n is supported on N<j<=J. Let

    Near(v)=sum_(N<j<=J) |b_j|²/d_j,
    F(v)=v*(P_feature* H P_feature+rem I)v,
    E(v)=z_n* B z_n,
    G(v)=(2P*/d_far) F(v),      d_far=d_(J+1).

The old verified far construction supplies
sum_(j>J)|b_j|²/d_j<=F(v), hence ||z_f||²<=F(v)/d_far and
z_f*Bz_f<=G(v). The PSD seminorm triangle gives

    z*Bz >= (sqrt(E)−sqrt(G))_+².                        (2)

For any fixed epsilon>0, Young's inequality also gives the single quadratic
bound

    z*Bz >= (1−epsilon)E − (1/epsilon−1)G,

when 0<epsilon<=1. Set epsilon=1/4. Combining with (1) proves the full
Schur-complement lower form

    A_head−K*D^−1K >= A_head−Near−r F + beta E,
    beta=3/50,
    r=1+(6/25)(2P*/d_far)=1.65836788124858....            (3)

Thus the old far coefficient H **and its isotropic remainder rem** must both
be multiplied by r. Keeping the old remainder while multiplying only H would
not implement the displayed bound, although numerically the remainder is tiny.
No positive tail compression is dropped without controlling its cross terms.

## 3. Safe rank-one reduction for the whole head

Let Y=d_n^−1 K_n and let v0 be the saved exact rational failure witness.
Choose y0=Yv0, E0=y0*B_nn y0>0, and e=Y*B_nn y0. Cauchy–Schwarz in
the B_nn seminorm gives, for every head v,

    E(v) >= |e*v|²/E0.                                  (4)

Equality holds at v0. This is a **head Gram lower bound after the global
cross-band estimate**, not the invalid statement B>=diag(B_nn,0).
Consequently the proposed complete finite certificate tests

    M=A_head−Near−r(rem I+P_feature*H P_feature)+u u*,
    u=sqrt(beta/E0)e.                                   (5)

Every quantity in u is freshly evaluated at the unchanged exact support.
The interval identity e*v0=E0 is a required self-check. A serialized rounded
midpoint is not silently substituted for e or E0.

## 4. Structured implementation and preflight

The existing core has nodes x_k=k² and two wedge-generator pairs. Add the
third pair g_new,k=x_k u_k, h_new,k=u_k, since

    (g_i h_j−h_i g_j)/(x_i−x_j)=u_i u_j.

Add u_k² to each core diagonal, replace rem by r rem, and replace H by r H.
The unchanged structured eliminator supports an arbitrary number of pairs.
The corrected core has displacement rank at most six, and the far feature
rank remains 72. No dense 14,336-square tail is needed.

The finite prime matrix in parity-undone coordinates has diagonal
q_j=−2 sum_n w_n(1−log(n)/W)cos(theta_n j)+bprime_j/j and off-diagonal
2(j bprime_j−k bprime_k)/(j²−k²). The Cauchy action is

    h_j(x)=sum_(k!=j) x_k/(j²−k²)
          =[sum_(k!=j)x_k/(j−k)+sum_(k!=j)x_k/(j+k)]/(2j).

Toeplitz and Hankel convolutions evaluate these with Arb polynomial products;
the excluded diagonal in the second sum is explicitly subtracted. For the
prime action,

    (B_nn x)_j=P*x_j+q_j x_j
                 +2[j bprime_j h_j(x)−h_j(k bprime_k x_k)].

Fresh exact rational Cauchy checks and independent actual-prime entry checks
are required. Zero-padding allows both Yv0 and Y*B_nnYv0 to be evaluated by
the same action; direct selected-row checks must verify signs and index zero.

Before any full gate: pin all inputs and proof dependencies before/after;
verify the fixed direction again; pass a 33-mode direct dense vs generator
comparison including the rank-one update and scaled remainder; independently
review the new builder and driver. Only then one full 2049-head/72-feature
producer gate is justified by this genuinely improved bound. Acceptance
requires a complete positive gate and independent isolated full replay.

## Replay of the completed directional gate

    PYTHONPATH=.rh_python_deps python \
      rh_attack_cycle_20261030/support_endpoint_X165/near_tail_inverse_repair/certify_prime_retained_direction.py

Pinned local dependency: python-flint==0.9.0. This restores the Arb dependency
lost in the environment restart, without changing accepted sources.

The physical interpretation is retaining actual tail stiffness rather than
charging every oscillatory mode as if it simultaneously realized the worst
prime-operator eigenvalue. The correction is an operator inequality, not a
physics analogy offered as proof.
