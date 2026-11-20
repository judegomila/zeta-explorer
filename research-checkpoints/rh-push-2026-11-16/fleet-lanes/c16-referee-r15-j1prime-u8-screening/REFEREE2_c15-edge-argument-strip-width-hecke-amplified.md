# REFEREE2: c15-edge-argument-strip-width-hecke-amplified

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Second independent pass (the lane's REFEREE.md has one
independent report, read only after my derivations, and the author's pass). Own derivation of every statement
labelled PROVED; own code (`code/loc_lemmas.py`, `loc_lemmas.json`). Nothing here is about zeros of zeta.

## Ruling: holds with corrections. No PROVED statement is broken.

| statement | independent derivation | ruling |
|---|---|---|
| Lemma 1, formula (1) | Maass-Selberg for constant term `A y^s + B y^(1-s)`: `(abs(A)^2 T^(2 sigma-1) - abs(B)^2 T^(1-2 sigma))/(2 sigma-1) + Im(A conj(B) T^(2it))/t`; at `A = 0`, `2 sigma - 1 = -delta` this is `abs(B)^2 T^delta/delta`; `B = xi(rho-1) = xi(2-rho)`; `f = B E(z, s')` with `phi(s') = xi(rho)/xi(2-rho) = 0` | holds (given CLASSICAL Maass-Selberg, valid at `sigma < 1/2` by continuation; `T >= 1`) |
| formula (2) | `Lambda^(T2) f - Lambda^(T1) f` is the constant term on `T1 < y <= T2`; `Lambda^(T1) f` has no constant term there; consistency: `M(T2) - M(T1) = abs(B)^2 (T2^delta - T1^delta)/delta` | holds |
| identity (I) | Parseval in x on `y > 1`: `8 sum abs(tau_nu(n))^2 int_(2 pi n)^inf abs(K_nu)^2 du/u`; remainder is the mass on `F`, `y < 1` | holds |
| Lemma 2, formula (3) | for `y > 1/T` a coset other than the identity has `Im(g z) <= 1/(c^2 y) < T`; constant mode `B y^(s')` on `1/T < y <= T`; covering number `1 + 10T` (CLASSICAL, Iwaniec 2.10, not opened by me either) | holds |
| Proposition A (a), formula (4) | `T_m y^s = m^(-1/2) sum a^s d^(1-s) y^s = tau_(s-1/2)(m) y^s` fixes the rule `(T_m psi)(y) = m^(-1/2) sum d psi(ay/d)`; on `psi = B y^(s') 1_(y>T)` it gives `sum (a/d)^(mu0) B y^(s') 1_(y > Td/a)` | holds |
| (b), formula (5) | from (2) with heights `T d/a >= T/N >= 1` | holds |
| (c) gain at most `N^delta` | profile norm in `L^2(dy/y^2)`: `int_0^min y^(delta-1) dy = min^delta/delta`; on `y <= T/N` every indicator is 1 | holds |
| (d), formula (6), "implied by (I)" | for `y > 1` only the identity coset of an incomplete series supported in `y > 1` contributes; bracket in (6) is at least 1 by (c) | holds as a statement against (I) |
| Proposition C | `abs(zeta(1+delta+it)) >= zeta(2+2 delta)/zeta(1+delta)`; Stirling: `e^(pi gamma/2) abs(pi^(-s/2) Gamma(s/2))^2 = 2 pi^(-delta) (gamma/2)^delta (1+O(1/gamma))` at `s = 1+delta+i gamma`; `delta gamma^delta` is increasing in delta | holds, under its hypothesis `l <= C_0` |

## Numbers recomputed (own code, mpmath 25 digits, zero 1)

| quantity | lane | this pass |
|---|---|---|
| `M = e^(pi gamma/2) abs(xi(2-rho))^2/delta` | 1.77754 | 1.7775417 |
| term n = 1 of L | 1.20858 | 1.2085751 |
| maximal gain, delta = 0.5, N = 8 (`N^delta` = 2.8284) | 2.7098 | 2.709831 |
| maximal gain, delta = 0.5, N = 32 (5.6569) | 5.4586 | 5.458596 |
| maximal gain, delta = 0.03, N = 32 (1.10957), zero 1 (case not in the lane) | - | 1.107155 |
| K Hermitian; smallest eigenvalue | 2e-25; 5.9e-4 to 6.6e-2 | 6e-26; 5.9e-4 (delta = 0.03, N = 32), 0.0656 (0.5, 8) |

Non-vanishing (control-object rule): the lemma concerns `f = B E(z, s')`; `B != 0` is `M > 0` above.

## Corrections

I confirm the first referee's C1 to C4 after reading them; I had found C4 independently (nothing in (b) to (d)
is available for `T < N`) and not C1 (the amplified form of Lemma 2). State of the text at 13:40 PST:

- False as written (ARGUED paragraph S4, still in RESULT.md line 156): "for the completely multiplicative
  parameters `alpha_p = i p^(-delta/2)` one has `tau(p) = 0`". Corrected sentence: "for the unimodular
  parameters `alpha_p = i` one has `tau(p) = 0`; for `alpha_p = i p^(-delta/2)` it is
  `-i (p^(delta/2) - p^(-delta/2))`, of size `delta log p`."
- Verdict line "the decisive first test kills the idea" must carry "for `T >= N`"; the case `T < N` is open.
- Scope sentence to add to Proposition A (d): "against the lower bound (I); against Lemma 2 the same holds
  at height `T/N` (first referee, C1)".

Referees for the PROVED chain: 2 independent (first referee; this file). Flags unchanged: R1 to R4 false.
