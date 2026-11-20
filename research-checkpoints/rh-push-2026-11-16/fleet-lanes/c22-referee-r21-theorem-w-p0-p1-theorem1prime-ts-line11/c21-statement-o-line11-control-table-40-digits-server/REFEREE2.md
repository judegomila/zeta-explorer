# REFEREE2: `c21-statement-o-line11-control-table-40-digits-server/RESULT.md`, the claim on the symmetric form

Second reading, 2026-11-20, lane `c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11`. Item read: the
claim that the cited symmetric zero-side form (Q_sym) separates controls by evenness and reality only
(verdict items 2, 3; section 2.1; section 5). The lane's REFEREE.md and scripts were not opened. The contour
cells of Tables 1 to 4 were not recomputed, except the two pointwise numbers below. No statement about zeros
of zeta.

## Verdict

**Holds with one correction.** "Even and real" is sufficient for Q_sym = Q_gen (proved in the lane; rederived).
It is not necessary: the exact condition is evenness and reality of F up to a factor exp(i kappa z/2 + const),
kappa real. No control on file lies in the extra class, so no cell and no map row changes; the qualifier for
Statement O line 11 should be worded on L = F'/F (below).

## Rederivation

Lemma R (residue form). h = V V#, V#(s) = conj V(-conj s). Residue of h at s = -z_i:
sum_j b_i conj(b_j)/(z_i + conj z_j); at s = conj z_j: -sum_i b_i conj(b_j)/(z_i + conj z_j). So the residues of
h L at the poles of h sum to -Q_gen with Q_gen = sum b_i conj(b_j)(L(conj z_j) - L(-z_i))/(z_i + conj z_j), and
the divisor of F contributes W_R. Holds. (The poles -z_i and conj z_j are distinct because Re z > 0.)

Difference. Q_sym - Q_gen = sum b_i conj(b_j) [A(z_i) - C(conj z_j)]/(z_i + conj z_j), with
A(z) = L(z) + L(-z),  C(w) = L(w) - conj L(conj w).
F even gives A = 0; F real on the real axis gives C = 0. So even and real implies Q_sym = Q_gen. Holds.

Necessity (new here). Require Q_sym = Q_gen at order 1 for every rate z in an open set:
A(z) = C(conj z) = -conj(C(z)) (since C(conj z) = -conj C(z)). The left side is meromorphic in z and the
right side is anti-meromorphic, so both are constant: A = i kappa, C = i kappa with kappa real (C constant and
C(conj z) = -conj C(z) force a purely imaginary value, and A = C). Conversely A = C = i kappa makes every
numerator vanish at every order. So

    Q_sym = Q_gen for all rates  iff  L(z) + L(-z) = i kappa and L(z) - conj L(conj z) = i kappa for one real kappa
                                 iff  F(z) = exp(i kappa z/2) F_1(z), F_1(-z) = +- F_1(z), conj F_1(conj z) = c F_1(z), abs c = 1.

**Correction (exact lines).** Verdict item 3: "the cited zero-side form ... is formulable only for controls
that are even and real". Section 2.1, bold sentence: "Q_sym = Q_gen when F is even and real on the real axis"
(correct as an implication). Section 5: "the cited symmetric zero-side form needs evenness and reality, and
fails for controls lacking either". The words "only" and "needs" are true up to the gauge factor
exp(i kappa z/2): a function F = exp(i kappa z/2) xi(1/2 + z), kappa != 0, is neither even nor real and
satisfies the symmetric form. Proposed qualifier for line 11: "the symmetric form holds iff L(-z) + L(z) and
L(z) - conj L(conj z) are equal to one imaginary constant; among the controls on file this is evenness and
reality (zeta, DH, E_a, T-NR, HEAT; ZQ, SG, NR-q, HQ* by the same argument, not run); it fails for the sign
twist and for translates". Complex Dirichlet characters also fail it (F(z) = eps conj F(-conj z) gives
A(z_i) - C(conj z_j) = (L - M)(z_i) - (L - M)(conj z_j) with M = conj L(conj .), not zero).

## Numerical recheck (Arb, 256 bits; new code `code/ref2_misc.py`, unit `rh-c22refm-1120145537`, `out/misc.json`)

L_0(z) = d/dz log xi(1/2 + z) = 1/s + 1/(s - 1) - (log pi)/2 + psi(s/2)/2 + zeta'/zeta(s).

| Quantity | This recheck | Lane |
|---|---|---|
| zeta, P8 Q_gen at z = 0.375 - 14.375i | 5.11122298385012342704... (radius 2e-75) | 5.111222984 |
| zeta, Q_sym - Q_gen | 0 +- 1e-75 | cell encloses 0 |
| unimodular twist alpha = 1, rate 0.375 - 13.375i: Q_gen | 5.11122298385012... | 5.111222984 |
| unimodular twist: Q_sym - Q_gen (order 1) | -4.74622922948293015621... (radius 1.5e-75), real | -4.74623 + 6.5e-77 i |
| unimodular twist, order 2 with b = (1, -3/4 + i/2) and a second rate chosen here (0.625 - 21.5i) | -3.6586 (non-zero; the lane's second rate is not printed, so its -4.75356 is not reproduced) | -4.75356 |
| gauge member L = L_0 + 0.35 i (F = exp(0.35 i z) xi(1/2 + z)), order 2, same b and rates | Q_sym - Q_gen = 0 +- 2e-74 | not in the lane |
| same member: L(z) + L(-z); L(conj z) - conj L(z) | 0.7 i; 0.7 i (so F is neither even nor real) | - |

For the twist the difference is [Re L_0(z + i alpha) - Re L_0(z - i alpha)]/Re z, real, as the lane's cell
shows (imaginary part 6.5e-77 inside the radius). The sign-twist cell was not recomputed (the lane's
completion of zeta(2s)/zeta(s) is not printed in the sections read).

## Dependence

Statement O line 11 qualifier (owed, record lane `c22-record-r21-controls-map-lean-queue-engine`): use the
wording above. No cell of the table and no control row depends on the necessity direction.

## Comparison with the first referee file (made after the verdict above was fixed)

The lane's `REFEREE.md` has an item E4 (necessity not proved; the factor e^(ibz)). The two readings agree;
the exact characterisation (both directions) is written out above.
