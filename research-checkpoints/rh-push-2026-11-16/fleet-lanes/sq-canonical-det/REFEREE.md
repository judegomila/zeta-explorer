# REFEREE: sq-canonical-det/RESULT.md

Date 2026-11-16. Adversarial review. Sources read: `dl/s2/paper.tex` (arXiv:1606.05726: Thm 2.1-2.4,
Prop 4.2, Lemma 4.4, Prop 4.4, Sections 7, 7.1, 10), atlas section 8 (PR 27,
`research/rh/modules/historical-routes.md`), the pinned certificate tree
`712c4b0a:research/twistor-bridge-2026-10-03/` (README, `signed_certificate/certify_signed_window.py`).
Scratch code outside the repo: `/tmp/refnum/ritz.py` (independent mpmath Ritz), `/tmp/refcert/` (certificate replay).

## Verdicts

| Item | Verdict |
|---|---|
| (a) Lemma B, window identity | HOLDS as algebra for the `Theta^nu` Hankel block; GAP as a statement about the bridge `K_c` |
| (b1) Lemma A(a): non-vanishing on `[0,T]` iff `||K[T]|| < 1` | HOLDS (`nu omega > 1`) |
| (b2) Lemma A(b): all `T` iff `Theta^nu` inner (with cancellation clause) | HOLDS |
| (b3) "Suzuki's condition (4) is then automatic" | WRONG as stated for a single `omega`; HOLDS for the sequence statements (Thm 2.4, Thm 7.1) by an argument RESULT does not give |
| (c1) Lemma C, `||K^{omega,nu}[t]|| <= ||K^{omega,1}[t]||^nu` | HOLDS (integer `nu`) |
| (c2) Corollary C1 to `t <= log(8/5) = 0.470` | GAP: the `8/5` certificate is not in any tree. Replayable range is `t <= log(3/2) = 0.4055` |
| Numerics, zeta `(1/4,5)`, `t = 0.4` | reproduced |

## (a) Lemma B

The algebra checks: `K[t] = W R`, `W^* = R W R`, `K[t]^2 = W W^*`, `1 - K[t]^2 = B^* B`,
`B = 1_{(-inf,-t)} U^* 1_I`. `det(1+K)det(1-K) = det(1-K^2)` is fine for Fredholm determinants of a
continuous kernel (`K^2` is trace class).

Two qualifications that the verdict line drops.
1. `U` is the multiplier `Theta_omega^nu`, not the bridge symbol `S_alpha`. RESULT's own table says
   these are different functions. The identity `det(1+K[t])det(1-K[t]) = det(1_J K_c^2 1_J)` is for
   the Hankel block of `Theta_omega^nu`. For the bridge `S_alpha` no identity is proved, and the window
   compression of `S_alpha` is not compact (no determinant).
2. It needs innerness. For `omega = 1/4` that is the unproved zero-free half-plane `Re s > 3/4`
   (up to cancellation). Unconditional only for `omega > 1/2`.

## (b) Lemma A

(a)-part. Rechecked: `K[t] = P_t K[t'] P_t` so the norm is non-decreasing; the kernel is real,
symmetric and continuous for `nu omega > 1`, so `t -> K[t]` is Hilbert-Schmidt continuous; a compact
self-adjoint operator has `+||K||` or `-||K||` as an eigenvalue; an eigenvalue `+/-1` forces
`||K|| >= 1`; the norm starts at 0. An eigenvalue `+/-1` cannot appear before the norm reaches 1, and
when the norm first reaches 1 one determinant vanishes. HOLDS.

(b)-part. The passage from `sup_t ||K[t]|| <= 1` to a bounded convolution operator is correct (take
`t = A` for `f, g` supported in `[-A, A]`), and the multiplier/pole argument is sound. The reverse
direction under innerness with cancellation is covered by Suzuki's Lemma 4.4, which he notes does
not need HB. HOLDS. Not new for `nu = 1`: the twistor README already states the limit of
`||H_{a,L}||` is 1 if `R_a` is Schur and infinite otherwise, with the shifted-zero caveat.

Condition (4). The proof line "inner. Then ... `E^{omega,nu}` is Hermite-Biehler, and Suzuki's
Theorem 2.3 gives (4)" is false in the cancellation case. Suzuki's class requires
`|E^#| < |E|` in the upper half-plane, so `E` has no zeros there. If a zero `rho` with
`Re rho > 1/2 + omega` is cancelled by a zero at `rho - 2 omega`, then `Theta` is inner, (3) holds for all
`t` (Lemma A), but `E` is not in the class, and by Suzuki's cited [Su19_1, Prop. 2.4] ((4) implies `E` in
the class) condition (4) fails. So for one fixed `omega`, (4) is exactly the condition that excludes
cancellation. It is not implied by (3) unless cancellation is excluded, which is unproved (atlas
section 8 says so).

For the theorems as stated (strictly decreasing `omega_n -> 0`, or `-> omega_0`), (4) is redundant, but for
a different reason: a zero `rho` with `Re rho > 1/2 + omega_0` would need zeros at `rho - 2 omega_n` for
infinitely many distinct `omega_n`, which accumulate at `rho - 2 omega_0`. This step is missing from RESULT.
With it, the verdict-level statement "RH iff (3) along a sequence `omega_n -> 0`" stands.

## (c) Lemma C and Corollary C1

Nehari step. For `omega = 1/4`, `nu = 1` the kernel is in `L^1(0, 2t)` (singularities `w^{-3/4}`), the
Hankel form has bounded symbol, Nehari applies to any bounded Hankel form and gives a minimising
`Phi` in `H^inf`. `Phi^nu` is in `H^inf`; convolution powers of distributions supported in `[0, inf)`
restricted to `[0, 2t)` depend only on the restriction; Laplace transforms multiply. HOLDS for
integer `nu` (Suzuki's `nu` is a positive integer; "every `nu >= 5`" must be read that way).

Certificate.
- Operator identity: `certify_signed_window.py` uses `a = 1/4`, `V = 2 log(3/2)`, terms `n = 1, 2`
  with weight `2^a - 2^{-a}` and `e^{-b/2}`, prefactor `2 pi^a / Gamma(a)`. This is Suzuki's `h_omega`
  at `omega = 1/4`, `nu = 1`, `t = log(3/2)`. Correct operator.
- Replay: ran the pinned script (mpmath.iv, 7 s). All assertions pass:
  `||H_{1/4,L}|| <= 49999/50000` for `L <= 3/2`. Its analytic omitted-mode bound ("see accompanying
  proof") was not audited here.
- The extension to `L <= 8/5` with `1999999/2000000` exists only as one sentence in the atlas, which
  itself says it does not rerun it or assert it is in the tree. No generator or receipt for `8/5` is
  in PR 27, in HEAD, or in the pinned tree. Corollary C1 at `0.470` rests on an artifact that
  cannot be checked.
- What can be supported today: `||K^{1/4,nu}[t]|| <= (1 - 2e-5)^nu` and `det(1 +/- K^{1/4,nu}[t]) != 0`
  for `t <= log(3/2) = 0.4055`, integer `nu >= 5`, given the in-house (unrefereed) `3/2` certificate.

Is the range already known?
- Suzuki: Theorem 2.1 gives an unspecified `tau > 0`; Prop. 4.4 needs HB (`omega > 1/2` or GRH). Nothing
  in either paper gives `0.4` at `omega = 1/4`. The "0.057" figure is RESULT's own grid estimate of
  Prop. 4.2, not a rigorous number and not Suzuki's.
- Verified height: I found no argument that verified zeros imply `||K[t]|| < 1` on this range; RESULT
  lists it as OPEN and that is accurate.
- Content: at `t <= 0.47` the kernel uses only the gamma factor and `q(2)`. The statement carries no
  information about zeros.

Plain answer: (c) at `t <= 0.470` is not an established unconditional statement. It becomes one, at
`t <= 0.4055`, conditional on an in-house interval certificate that replays but is unrefereed. It is
not in Suzuki's papers and not shown to follow from verified height; it is a finite-data statement
with no bearing on RH.

## Independent numerics (mpmath `invertlaplace` Talbot, float64 Legendre-Galerkin; MEASURED)

| case | mine | RESULT |
|---|---|---|
| zeta `(1/4, 5)`, `t = 0.4`, `p = 24` | `1 - lam_max = 1.1137e-3`, `1 + lam_min = 4.2666e-2` | `1.114e-3`, `4.266e-2` |
| zeta `(1/4, 1)`, `t = log(3/2)`, `p = 40` | `3.769e-5`, `3.192e-3` | `3.75e-5`, `3.19e-3` |
| zeta `(1/4, 1)`, `t = log(8/5)`, `p = 40` | `1.74e-6` (not converged in `p`; float64) | `1.38e-6` |

The `nu = 1` margin at `8/5` is about `1.4e-6`, so a certified `5e-7` is plausible but within a factor
3 of sharp; that is a further reason it cannot be taken on trust without the generator.

## Smaller points
- Verdict item 1(b) and section 8 should say "(4) removed for the sequence statement", and state the
  accumulation argument.
- Section 7 table row "Corollary C1 ... PROVED given the certificate": change range to `0.4055`, or
  mark `0.470` as dependent on an unavailable artifact.
- "extends the range by a factor of about 8" compares against a non-rigorous number.
