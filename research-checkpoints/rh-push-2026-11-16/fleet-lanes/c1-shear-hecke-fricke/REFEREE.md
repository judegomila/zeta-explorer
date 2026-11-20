# REFEREE (lens: general) for c1-shear-hecke-fricke/RESULT.md

Date: 2026-11-17. Claimed verdict: precise-obstruction, flags R1..R4 all false.
Referee verdict: **the negative verdict holds, with four corrections** (one to the statement of
Lemma 2, three to labels/wording). No step assumes RH in an inference; no verified-height input
is used; nothing about zeros of zeta is claimed.

## 1. Re-derivation of the PROVED steps

**Lemma 1 (a), (b), (d): confirmed.**
- `(V_n a)(u) = n^(-1/2) a(u + 2l)`. `u^2 - (u+2l)^2 = -4l(u+l)`, so
  `G V_n G^-1 = exp(-tau l(u+l)/4) V_n`. Confirmed.
- `[V_n, G] = G (G^-1 V_n G - V_n) = G (exp(tau l(u+l)/4) - 1) V_n`. Confirmed.
  `V_n u = (u + 2l) V_n`, so `{u, V_n} = 2(u+l) V_n`. Confirmed.
- (d): substituting `v = u + 2l` gives `n^(-1/2-z) e^(tau l^2/4) Fhat(z - tau l/2)`. Confirmed.
- Sign convention (cosmetic): the first-order term is `tau [V_n, u^2/16]`, which is
  `-ad(u^2/16)(V_n)` under `ad(X)Y = [X, Y]`. The formula `delta(V_n) = (log n/8){u, V_n}` is
  correct for `delta = [ . , u^2/16]`.

**Lemma 1 (c): confirmed.** `(u+l) a(u+2l) = 0` a.e. forces `a = 0`. For a finite combination,
apply to a bump of support shorter than the smallest gap between the shifts `2 log n`.

**Lemma 2: correct as a pointwise identity; the stated norm setting is wrong for most controls.**
- The residual identity `(1 - lambda V_p) G K - G K^(p) = G K_p (1 - lambda' exp(tau L u/4))`
  (when `V_p K = K_p / lambda_0`) is pointwise and confirmed. First-order minimisation over
  complex `lambda'` gives `|tau| (L/4) sigma`. Confirmed.
- ERROR in the statement "PROVED for whole-line L^2 norms". For the controls without a functional
  equation the kernel is not in `L^2(R)`: `zeta(s+0.3)` has `K(u)` growing like `e^(-0.1 u)` as
  `u -> -inf` (pole at `z = 0.2`), the unimodular twist and Beurling kernels grow like `e^(-u/4)`,
  and the Liouville kernel is not known to decay. For these `d_p(tau)` is `inf/inf` on the whole
  line, and for `tau > 0` `G_tau K` is worse. The lemma is true for **windowed** norms (the
  identity is pointwise), with `sigma` = standard deviation of `u` under `|K_p|^2` on the window.
  Then `sigma` depends on the window and on `p` (I measure 2.91 at `p = 5` and 0.94 at `p = 43`
  for `zeta(s+0.3)` on `[-11, 5]`), so "`sigma = sigma_K` for every `p`" holds only for kernels
  in `L^2(u^2 du)` such as kappa. The conclusion (order exactly 1 iff eigen at `p`, else 0)
  survives in the windowed form.
- Edge case not stated: if `c(pm) = 0` for all `m` (DH at `p = 5`), `K_p = 0` and `d_p` is `0/0`.
  (a) and (b) need `K_p != 0`.
- (c), (d): confirmed.

**Section 5.2: confirmed.** With `theta(tau_mod) = sum e^(2 pi i n^2 tau_mod)`, `tau_mod = i e^u/2`,
`w_4: tau_mod -> -1/(4 tau_mod)` fixes `i/2`, i.e. `u = 0`, and the hyperbolic distance along the
axis is `|u|`. `J V_p J = p^(-1/2) T_(2L) = V_p^*`. The remaining statements are that evenness and
reality do not locate zeros; correct and known.

**Proposition 3: confirmed.** `S(u) = O(e^(-u/4))` re-derived (`e^(5u/4) sum_(n<=N) n^2`,
`N = e^(-u/2)`). Tonelli applies for `tau < 0`. (b) holds since `ghat_0` has no zeros in
`Re z > 1/2`. (c) and the cocycle `exp(tau log m log n/2)` in (d) confirmed. The model
`sqrt(4 pi/|tau|) exp(1/(4|tau|))` is the full Gaussian integral of `exp(l/2 - |tau| l^2/4)`;
arithmetic checked at `tau = -2` (2.840).

## 2. Numeric checks rerun with different cases

Script `/tmp/ref_c1/chk.py`, `chk2.py` (numpy float64, run under `scripts/memcap.sh 8`, 33 s).
Unlike `defect.py`, which builds `V_p G K` from the formula of Lemma 1, my code applies `V_p` as
an actual shift of `G_tau K`, so it tests Lemma 1 and Lemma 2 together.

| kernel, prime | `d(0)` | `d/tau` at `1e-2, 1e-3, 1e-4` | `(L/4) sigma_window` |
|---|---|---|---|
| `zeta(s+0.3)`, 5 | 1.8e-15 | 1.184503, 1.173047, 1.171852 | 1.171719 |
| `zeta(s+0.3)`, 43 | 8e-16 | 0.896835, 0.887032, 0.886054 | 0.885946 |
| Liouville, 13 | 6e-16 | 0.614803, 0.612644, 0.612432 | 0.612409 |
| zeta, 11 | 1.7e-15 | 0.187993, 0.187974, 0.187972 | 0.187971 |
| unimodular `n^(0.4i)`, 7 | 1.1e-15 | 1.209597, 1.222713, 1.223982 | 1.224123 |
| `d(n)` (zeta^2; multiplicative, not completely), 3 | 3.30e-2 | `d` stays 0.0330: order 0 | n/a |

So the controls `zeta(s+a)`, a completely multiplicative sign twist and a unimodular twist have
order exactly 1 with the predicted coefficient to 4 to 5 digits, the same as zeta. This is a
better confirmation than the fitted orders 0.73 to 1.23 in RESULT section 4 (those used `tau` up
to 0.3, where `tau L u/4` reaches 3 on the window). The zeta-only mechanism is absent: confirmed.
Beurling and T-NR were not rerun; Lemma 2 covers them.

Lemma 1(d), new cases `(tau, p, z) = (-0.9, 5, -0.4+2i), (0.6, 13, 1.3-9i), (0.35, 29, -0.7+17i)`:
relative error 6e-17, 8e-16, 4e-14 on kappa; also confirmed on a non-even test function.

Proposition 3(a), new case `tau = -3` (1200 terms), `z = 0.5+10i, 7i, -1+4i`: series minus `H_tau`
= 1e-17, 3e-16, 5e-13. Control: the same expansion with Liouville coefficients against the direct
transform of `G_tau K_Liouville`: errors 1e-13, 6e-13, 5e-12. The claim "holds verbatim for sign
twists" is confirmed for this case.

## 3. Errors and overstatements

1. Lemma 2 norm setting (section 1 above). Restate for windowed norms, or restrict the
   whole-line version to kernels in `L^2(u^2 du)`. Add `K_p != 0`.
2. Section 6, "Obstruction (PROVED ...)". The first and fourth bullets are proved/classical. The
   second bullet ("any inequality ... with constants that stay bounded as `tau -> 0-` would hold
   at some `tau < 0`") is a heuristic: no class of arguments is defined, so it is not a theorem.
   "The available size is `exp(1/(4|tau|))`, with no margin" is MEASURED on the coefficient chain
   (ratio 0.88 to 0.94 to a model), and it is the size of `sum n^(-1/2) e^(tau l^2/4)`, not of
   the terms with `ghat_tau` (whose absolute sums in the table are `7e-3` to `2.9`). Label this
   block HEURISTIC + MEASURED. Weakest step 3 of RESULT already concedes the gap.
3. Section 4, outcome (A): "a function whose zeros lie on `Re s = 0.2`" for `zeta(s+0.3)` assumes
   RH. Unconditional wording: a function with infinitely many zeros on `Re s = 0.2` and no
   functional equation fixing that line as a symmetry axis for its kernel class. Not used in any
   inference.
4. `defect.py` uses Lemma 1 to form `V_p G K`, so the "4-digit agreement" in RESULT tests only
   the first-order minimisation. Not an error in the conclusion (section 2 above closes it).
5. Novelty: Lemma 1 is the Weyl commutation relation for a translation and a Gaussian multiplier;
   Proposition 3 is the known termwise expansion of `H_t` (RESULT says so). Lemma 2(a) is
   uniqueness of Dirichlet coefficients. Nothing here is a new theorem; RESULT does not present
   it as one beyond "not computed in earlier lanes".

## 4. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | Multiplicativity enters only as the identity `c(pm) = lambda_p c(m)`; no inference to zeros; per-prime, nothing joint. |
| R2 | false | No statement in height is produced. |
| R3 | false | Completely multiplicative sign twist, `zeta(s+a)`, unimodular twist pass (rerun here); mechanism is not zeta-only. |
| R4 | false | `w_4` gives evenness only; the sheared expansion converges on the line only for `tau < 0`. |

## 5. Surviving claim

For windowed (or, for kappa-type kernels, whole-line) `L^2` norms: `[V_n, G_tau] =
G_tau (exp(tau l(u+l)/4) - 1) V_n`; the eigen-defect of `1 - lambda V_p` under the Gaussian shear
has `tau`-order exactly 1 with coefficient `(log p/4) sigma` when the coefficients satisfy
`c(pm) = lambda c(m)` and `K_p != 0`, and order 0 otherwise. This is the same for zeta and for
`zeta(s+a)`, completely multiplicative sign twists and unimodular twists, so the lane's test does
not separate zeta. `w_4` on the arc is `u -> -u`. For `tau < 0` the termwise prime expansion of
`H_tau` converges absolutely at every `z` and holds equally for a sign-twisted control; that it
cannot be used to reach `tau = 0` is a heuristic supported by Rodgers-Tao, not a theorem.
