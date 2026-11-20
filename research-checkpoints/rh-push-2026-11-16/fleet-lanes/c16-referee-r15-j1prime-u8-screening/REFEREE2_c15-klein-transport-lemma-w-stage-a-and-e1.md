# REFEREE2: c15-klein-transport-lemma-w-stage-a-and-e1

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Second independent pass; own derivations, own code
(`code/loc_lemmas.py`). No statement about zeros of zeta is claimed by the lane or here; W1 to W3 are
implications from an unproved hypothesis.

## Ruling: W1, W2, W3 and Theorem E1' hold (2 independent referees). K1 was not re-derived by me (stays at 1).

| statement | independent derivation | ruling |
|---|---|---|
| W1 | one zero with `d > 1/(2A)` gives `T^(2Ad) <= C T log T` for all large T, i.e. `2Ad <= 1 + log(C log T)/log T -> 1` | holds |
| W1 numbers | `delta(T) = (1 + log(C log T)/log T)/(2A)`, A = 4/3, C = 10.8 | 0.44989 at 3e12, 0.41091 at 1e30 (lane 0.4499, 0.4109); chain `Lambda <= 2 delta^2 = 1/(2A^2)` in the normalisation where zeros of H_0 have imaginary part `2 d_rho`; `Lambda < 0.2` needs `A > sqrt(2.5) = 1.5811` |
| W2 | all `d = d0 > 0`: sum `N(T) T^(2A d0)`; converse by partial summation: `int_0^inf T^(-2(A-A')d) dd = 1/(2(A-A') log T)`, giving `N(T) + 2CA' T log T/(A-A')` | holds |
| W3 | each added point with `d <= 1/(2A)` adds at most T | holds |
| T-NR against W(A) | zeros of `2 cosh(z log q) + c` at `Re z = +-b`, `b = arccosh(c/2)/log q`, ordinates `(2k+1) pi/log q`: `T log q/pi` with `0 < gamma <= T` | holds; b = 0.32385 for q = 2, c = 2.0506 |
| E_a0 against W(A) | zeros at offsets `e +- a0` for a zeta zero at offset e; `T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(2A a0)` | holds in this form (see below) |
| Theorem E1' (i) to (v) | pole order of `X(w-a)/X(w+a)` at `lambda - a` is `m(lambda) - m(lambda - 2a)` when positive; `abs R_a = 1` on the axis from `X(-a+iy) = conj X(a+iy)`; factors `(v + p)/(v - p)`, `p < 0`, have modulus below 1 on `Re v > 0`; (v) by finiteness of zeros on a horizontal segment | holds |
| K0 (identity, MEASURED by the lane), K1 | source (PR 56) not opened by me | not refereed here; first referee's E2 to E5 stand (K1 is PROVED for `a > 1/2` only) |

Numbers: example (iv), `a = 1/4`, zeros `+-0.35 +- 3i`, `+-0.15 +- 3i`: sup of `abs R_a` over 260,300 points of
`Re w > 0` is 0.99999 (Schur, as predicted); with the companion moved to `+-0.10`: 38.9 (not Schur).
Non-vanishing: the denominators of the example vanish only at the predicted cancelled points.

## Sentences false as written (RESULT.md at 13:40 PST)

- Section 2: "E_a0 = zeta(s + a0) zeta(s - a0): all 2N(T) zeros at distance a0". True only if the zeros of zeta
  below T are on the line. Corrected sentence: "each zeta zero at signed offset e gives zeros of E_a0 at
  offsets `e + a0` and `e - a0`, and `T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(2A a0)`; so the sum is at
  least `2N(T) T^(2A a0)` and W(A) fails for every A > 0." (found independently; same as the first referee's E1).
- Section 4: "uses no property of F beyond analyticity and a non-vanishing trace": the identity needs the
  reflection symmetry (first referee's E2; not rechecked by me).
- Section 3 labels all of K1 PROVED; for `1/(2A) < a <= 1/2` it is conditional and asymptotic.

Flags unchanged: R1 to R4 false.
