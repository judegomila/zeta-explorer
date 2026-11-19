# Independent referee: c13-lrs-twist-amplification-zero-representation (pole at 2 - beta; gamma pole at 1 - beta; beta <= 7/4)

Referee lane `c14-referee-r13-independent`, 2026-11-19. Written from the lane's RESULT.md; the lane's REFEREE.md was
not read. Own code: `items124.py` (block lane 4), output `items124.json`. Nothing here is a statement about zeros of
zeta: the lane's output inequality is vacuous and this report confirms that it is.

## Verdicts

| statement | verdict | exact line / form |
|---|---|---|
| Lemma 1: G(w) = xi(w+beta-1) xi(w+1-beta) xi(w+i gamma) xi(w-i gamma) has, at a zero rho = beta + i gamma, exactly the simple poles w = 2 - beta and w = beta - 1, with residue +-xi(3-2 beta) abs(xi(rho-1))^2 | **HOLDS** | Each factor has simple poles at arguments 0 and 1 with residues -1, +1. Residue table re-derived entry by entry: at w = beta the cofactor is xi(2 beta - 1) abs(xi(rho))^2 = 0; at w = 1 - beta it is -xi(2 - 2 beta) abs(xi(1 - conj rho))^2 = 0 by the functional equation; at 1 +- i gamma and +- i gamma one cofactor is xi(rho) or xi(1 - conj rho) or a conjugate. At 2 - beta all cofactor arguments have real part > 1. |
| Pole position P = 2 - beta (step S2') | **HOLDS** | Rightmost pole of G, for every parameter (zero or not). |
| Gamma pole of the even twists at beta_0 = 1 - beta, and it is the only one in Re w > 0 | **HOLDS** for 0 < beta < 1 | Gamma_R(w + beta - 1) has its pole at w = 1 - beta > 0; Gamma_R(w + 1 - beta) at beta - 1 < 0; Gamma_R(w +- i gamma) at -+ i gamma (real part 0, not > 0). For odd chi the poles are at -beta, beta - 2, -1 +- i gamma. |
| Lemma 2: the vanishing forced at w = 1 - beta is L(0, chi) = 0 for even primitive chi != 1, for every parameter | **HOLDS** | Trivial zero. |
| Lemma 3, algebra: P - 1 <= w*(P, d) iff 0 <= (d-1)/2 + (d-2)(P-1); for d = 4, P = 2 - beta this is beta <= 7/4 | **HOLDS** | w*(P,4) = (4P^2 - 7P/2 + 1)/(4P - 3/2) re-derived from (3.1); equivalence checked in exact rationals on 300 values of beta with P >= 1: 0 mismatches. |
| "The one displayed inequality the device yields: 1 - beta <= w*(2 - beta), i.e. beta <= 7/4" | **HOLDS IN NARROWER FORM** | The threshold w*(P, d) of (3.1) is the lane's reconstruction of the Luo-Rudnick-Sarnak exponent count (paper not opened; labelled ARGUED by the lane). So the sentence is "relative to (3.1)". The vacuity does not depend on (3.1): by Lemma 2 the twisted values at w = 1 - beta vanish for every even chi != 1 and every beta, so no non-vanishing statement can hold there. That second route is PROVED and was checked. |
| P - beta_0 = 1 for every parameter (structural statement, section 4) | **HOLDS** | (2 - beta) - (1 - beta). |
| Lemma 4 (higher rank) | not refereed | outside the assignment |

No statement is BROKEN.

## Numeric instance (control object not identically zero; pole positions reproduced)

Limits (w - w_0) G(w) at distance 1e-30, 200 bits.

- At the first zero (beta = 1/2, gamma = 14.134725...): abs residue at w = 2 - beta = 3/2: 1.0598540200154647e-10; at beta - 1 = -1/2: the same; closed form xi(2) abs(xi(rho - 1))^2 = 1.0598540200154647e-10 (the lane's value, 16 digits). At 1 +- i gamma and +- i gamma: 1.7e-49 (zero at the resolution of the limit). At w = 1/2 (where beta and 1 - beta coincide): eps^2 G(1/2 + eps) = 1.9e-50 with abs(G(1/2 + eps)) = 1.9e-10: no pole.
- Control object (generic parameter, the E_a / EIS-w reading; not a zero): beta = 0.3, gamma = 14.1347: residues 9.61194e-11 at 2 - beta = 1.7 and at beta - 1 (closed form 9.61194e-11), 1.38611e-11 at beta and 1 - beta, 3.0040e-20 at 1 + i gamma and i gamma: all eight non-zero, rightmost pole at 2 - beta. abs(G(1.9)) = 4.6e-10 (finite to the right).
- Even characters: abs(L(0, chi)) = 0 exactly (ball) for chi_5(4, .) and chi_7(2, .); odd chi_5(2, .): 0.632456. Twisted product at w = 1 - beta: first zero: 0 (even), 0.034277 (odd; lane 0.034); generic beta = 0.3: 0 (even; the other three factors have modulus 6.34), 0.246808 (odd).
- Gamma factor at w = 1 - beta: 1/Gamma((w + beta - 1)/2) = 0 (pole); the other three gamma factors finite (2.1e-10).
- Principal-character sum: (sum_{n <= Y} abs(lambda(n))^2 n^-(1-beta))/Y at Y = 2e4, 2e5: 0.405582, 0.405571 against c = 0.405570 (first zero); 0.452084, 0.452089 against 0.452088 (beta = 0.3).
- w*(1, n^2) = 3/5, 4/5, 15/17 = 1 - 2/(n^2 + 1), n = 2, 3, 4. w*(P, 4) at P = 1, 5/4, 3/2, 7/4, 2: 3/5, 23/28, 19/18, 57/44, 20/13 against P - 1 = 0, 1/4, 1/2, 3/4, 1.

## Limits of what the numerics show

Every zero available numerically has beta = 1/2, so "the pole sits at 2 - beta" is tested at a zero only at 3/2 and
the beta-dependence only on the generic-parameter control (beta = 0.3: pole at 1.7). The lemma is an identity in
beta and gamma, so this is a limit of the instance, not of the proof.

## Labels to restrict

- Opening summary, "The one displayed inequality the device yields": add "relative to the reconstructed threshold (3.1)".
- Section 3 heading already carries "ARGUED exponent count"; no change.
- Section 5, row T-NR and row DH ("not formulable", "not run"): unchanged; not refereed.
