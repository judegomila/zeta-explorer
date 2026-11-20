# REFEREE2: c15-u5-window-count-threshold-translate-control

Lane `c16-referee-r15-j1prime-u8-screening`, 2026-11-19. Second independent pass; derivations made before reading
the first referee's report inside the lane's REFEREE.md. Own code: `code/loc_lemmas.py` (`loc_lemmas.json`) and
the reflection check (`loc_reflection.json`), mpmath 30 to 40 digits. No statement about zeros of zeta.

## Ruling: holds with corrections. One sentence of the verdict is false as written (first referee's E1, confirmed).

| statement | independent derivation | ruling |
|---|---|---|
| translate identity | `zeta(1/2 + i(t+alpha)) = e^(-2i theta(t+alpha)) conj(...)`, so `chi(s) conj(zeta(s+i alpha)) = e^(i Psi) zeta(s+i alpha)`; relative defect `2 abs(sin(Psi/2))` | holds. Rerun at t = 10050, alpha = 0.85153: defect 2.3e-28 |
| Lemma 1 (a) | `Psi(a) + Psi(b) = 4 pi`, Psi increasing in t (`d Psi/dt = log(1 + alpha/t) > 0`), so `abs(Psi - 2 pi) <= (Psi(b) - Psi(a))/2 <= alpha_1 L/(2a)` | holds |
| Lemma 1 (b) | k = 0: near-identity; k != 0: `abs(alpha)(log(b/2 pi) + abs(alpha)/a) >= 2 pi - x` and `L abs(log(1 + alpha/b)) <= 2x` | holds **under its hypothesis `abs(alpha) <= a/2`**; the `(1 + o(1))` is not uniform for alpha comparable to a, where the bound on L is stronger by a constant |
| span law `K_tr = eta T log(T/2 pi)/pi (1 + o(1))` | from (a), (b) | holds for translates with `abs(alpha) <= T/2` and for K above about 3 |
| Lemma 2, existence | Dirichlet: `1 <= alpha <= Q^n` with every `alpha theta_j` within 1/Q of an integer; `abs(p^(-i alpha) - 1) <= 2 pi/Q <= eps/2`; `alpha (L + alpha)/a <= eta/2.1` | holds (relative to round 3 Lemma B for the phase expansion) |
| combination `F = (zeta(s) -+ zeta(s + i alpha))/2`: defect identity | `F - chi conj F = -+ zeta(s+i alpha)(1 - e^(i Psi))/2`, modulus `abs(zeta(s+i alpha)) abs(sin(Psi/2))` | holds as an **absolute** defect |
| Lemma 4 (Poisson bound) | harmonic measure of an interval of length L seen from distance delta: `omega = (2/pi) arctan(L/(2 delta))`, `1 - omega = (2/pi) arctan(2 delta/L) <= 4 delta/(pi L)`; `sum_{n<=N} n^(-1/2) <= 2 sqrt N` | holds |

## Numbers recomputed

| quantity | lane | this pass |
|---|---|---|
| largest contiguous span at T = 1e6, eta = 1e-6 | 3 (formula 3.8) | 3 (3.81) |
| T = 1e6, eta = 1e-5 | 38 | 38 (38.13) |
| T = 1e5, eta = 1e-4 | 30 | 30 (30.80) |
| T = 1e8, eta = 1e-6 | 533, 532, 532 at origins `T (1 + 0.01 u)` | 527 at T = 1e8 exactly (formula 527.8; at 1.01e8 the formula gives 533) |
| zero of `(zeta(s) - zeta(s + i alpha))/2`, alpha = 0.8515322655932238 | 0.8947065986189371 + 10084.778352651363 i | root 0.894706598618937 + 10084.7783526514 i, abs F = 1.3e-28; non-vanishing of the parts: `abs zeta` there = 0.4559 |
| reflection translate (alpha = -2c), relative defect on a span of length L (first referee's E1) | first referee: 1.481e-5 (T = 1e4, L = 1); 1.35e-7 (1e6, 1); 1.23e-6 (1e6, 3) | 1.491e-5 (my minimisation in c stops a little short); 1.3543e-7; 1.2336e-6. k = 1 translate: 4.2608e-5; 2.6229e-7; 7.8686e-7 |

## Sentences false as written (RESULT.md at 13:40 PST)

- Verdict item 1: "and no translate other than the near-identity ones does better." False: the reflected
  translate `alpha = -2c` has a stationary phase inside the span and defect `L^2/(8T)(1 + o(1))`, below
  `pi L/(T log(T/2 pi))` for `L < 8 pi/log(T/2 pi)`. Corrected sentence: "among translates with
  `abs(alpha) <= T/2` no other does better; the reflected translate `alpha = -2c` has defect `L^2/(8T)` and is
  better on spans shorter than `8 pi/log(T/2 pi)`, so
  `K_tr(T, eta) = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + o(1))`."
- Verdict item 3 "satisfies zeta's functional equation on the whole span with absolute defect ..." is correct;
  the later sentence that it is "passed at every K below K_tr" holds only for an absolute-defect test (the
  window test of section 1 is relative and fails near the on-line zeros of F). The combination with the minus
  sign has `a(1) = 0`; the Davenport-Heilbronn comparison applies to the plus sign.

Scope (first referee's E4, confirmed by the derivation): every translate has its zeros on the line, so the
translate family is a control for identification-type conclusions only. Label: "PROVED to leading order" is
the right label for Lemma 1; it is not a statement with explicit constants.

Referees for the PROVED statements: 2 independent. Flags unchanged: R1 to R4 false.
