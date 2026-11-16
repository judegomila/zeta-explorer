# REFEREE: g-symmetry-schur

Date: 2026-11-16. Adversarial referee of `RESULT.md` (claimed verdict: precise-obstruction).
Referee scripts were run from a scratch directory outside the repo (mpmath, 20-30 digits,
non-interval). PR content read from `refs/pr/56`, `refs/pr/57` and zeta-view
`docs/KLEIN-ANNULUS.md` (read-only).

## Verdict

**holds = false as stated.** One step labelled PROVED/MEASURED is wrong by a sign: the
parity trace split of section 5 is inverted. The even sector carries 97.9% of the trace
of `H_c`; the odd sector (target (B)) carries 2.1%. Everything else that carries the
obstruction verdict (Theorem 1, Lemmas A-E, D0, Theorem 2, the inter-sector identity,
the DH control) was re-derived or reproduced and stands. The verdict
"precise obstruction" survives after the trace-split item is corrected.

## Error 1 (definite): the trace split is inverted

RESULT section 5: "`tr H_- - tr H_+ = (alpha/pi) int_0^inf (f(0)^2 - f(t)^2)/t^2 dt > 0`",
"`tr H_- = 0.096680`, `tr H_+ = 0.002086`", "the odd sector carries 97.9% of the trace",
"the sector on which the Gram majorant vanishes is the dominant one".

Correct statement: `tr H_+ - tr H_- = (alpha/pi) int_0^inf (f(0)^2 - f(t)^2)/t^2 dt > 0`.

Three independent confirmations:

1. Kernel side, no computation. PR 56 (C): `H_0(u,v) > 0` entrywise. With
   `H_+-(x,y) = H_0(x,y) +- H_0(x,-y)`, `H_+(x,x) - H_-(x,x) = 2 H_0(x,-x) > 0` for
   every `x`, so `tr H_+ > tr H_-`.
2. Fourier side. PR 56 operator-duality (11)-(12):
   `C_-(t,t) = (alpha/pi)[W + f f'/t]`, `C_+(t,t) = (alpha/pi)[W - f f'/t]`,
   `W = f'^2 - f f''`. `int_0^inf W = 2 int f'^2 = 2 I1`.
   `int_0^inf f f'/t dt = (1/2) int (f^2 - f(0)^2)'/t dt = -(1/2) I2` with
   `I2 = int (f(0)^2 - f^2)/t^2 > 0`. Hence `tr C_- = 2 I1 - I2/2`,
   `tr C_+ = 2 I1 + I2/2`. `trace_split.py` assigns the two signs the other way round
   (`trm = 2*I1 + I2/2`), contradicting the formula the same lane uses in
   `dh_control.py` for `C_-(t,t)`.
3. Numerics, two routes. Fourier: `int C_-(t,t) dt = 0.0020860`,
   `int C_+(t,t) dt = 0.09666` (units `alpha/pi`), odd share `0.02112`. Physical
   kernel (PR 56 eq. (3) with `kappa(u) = Phi(u/4)`, normalization checked by
   `int kappa = xi(1/2) = 0.497120778188`): `tr H_- = 6.63994e-4 alpha`,
   `tr H_+ = 3.07741e-2 alpha`, odd share `0.02112`. The two routes agree
   (`0.0020860/pi = 6.63994e-4`).

Sanity: Gaussian control of PR 56 section 6 has `C_- = 0` and `C_+` rank-one positive;
under RH (16)-(17) the even features carry the extra weight `lambda_n/(t s)`, large
where `f` lives. The even sector is the dominant one.

Consequence. The numbers 0.096680 and 0.002086 are right; the labels are swapped.
Target (B) lives in the sector with 2.1% of the trace, not 97.9%. The sentence "the
sector on which the Gram majorant vanishes is the dominant one" is false and must be
removed. This does not change Theorem 2 (trace share is not a positivity statement),
but any downstream ranking of the odd sector as the "main" part of `H_c` is wrong.

## PROVED steps re-derived

- **Theorem 1 (i), formulas.** Re-derived by hand from `z = 4Ku + 2iK'(v-1/2)`:
  `D: z -> 2K - z`; `R: z -> conj z - iK'`; `C: z -> -conj z` gives
  `(conj w, conj eta)`; `tau: z -> z + 2K + iK'` gives `w -> 1/w`, hence
  `s0 -> 1 - s0`. Group closure, commutativity mod the lattice, `tau = D.RC`, fixed
  sets and quotient types all check. Rerun with different radii and seed
  (`r = 1.7, 1.05, 6.3` as exact mp numbers): max error `2.3e-28`. CONFIRMED.
  Minor: the RESULT says "checked at 30 digits for r = 1.3, 2, 3.7"; its own JSON shows
  `1e-16` for `R, A, RC, tau` at `r = 1.3, 3.7` (Python-float `r` in `(1j/r)`); only
  `r = 2` was a 30-digit check.
- **Theorem 1 (ii)-(iii), exhaustion.** Essential-singularity argument fixes the polar
  divisor `p+ + p-`; Riemann-Roch gives `s o g = alpha s + beta`; the four cases for
  `(alpha, beta)` are correct (strip + `N(T) ~ (T/2pi) log T`). CONFIRMED. Small gaps,
  all fillable: (a) the mixed cases (holomorphic `g` with `f o g = conj f`,
  antiholomorphic with `f o g = f`) are not mentioned; they force `f` constant.
  (b) Projective symmetries `f o g = lambda f` are outside the definition; the same
  zero-set argument covers them. (c) For DH "applies verbatim" is slightly off: DH has
  zeros with `Re s > 1`; the argument needs "bounded vertical strip", which holds.
- **C and tau unused in the PR notes.** zeta-view `KLEIN-ANNULUS.md` lists `D, R, A`
  only. CONFIRMED for the files read.
- **Lemmas A-E, D0.** Standard; proofs correct.
- **Section 4b, 4c, 4e.** Correct. Jentzsch statement correct.
- **Section 4f.** Matches PR 57 line 51; complex-linear Jacobian `-(1/2) L` with real
  `L`, so both real blocks are `-(1/2) L` and the cross block is zero. CONFIRMED.
- **Inter-sector identity.** Re-derived: with `a = f(t)f'(s)`, `b = f'(t)f(s)`,
  `C_- = (alpha/pi)(2at - 2bs)/(t^2-s^2)`, `C_+ = (alpha/pi)(2as - 2bt)/(t^2-s^2)`,
  and the stated identity follows. `L_psi` form also correct. CONFIRMED.
- **Theorem 2 (i),(ii).** CONFIRMED as statements about what symmetry forces.
- **Theorem 2 (iii).** PR 56 operator-duality section 4 was read and its argument
  checked (approximate deltas; Loewner extension excludes nonreal poles of `-G'/G`;
  `F(r) > 0` excludes nonpositive zeros of `G`; genus-zero product for the converse).
  No error found. Imprecision in the RESULT: `T = D^-1/2 B E^-1/2` exists only when
  the diagonal blocks are positive, so "sup ||T_-|| <= 1 over all splittings" should
  be the Cauchy-Schwarz form of PR 56 section 8
  (`|<Bx,y>|^2 <= <Ex,x><Dy,y>` with `E, D >= 0`).

## DH control (rerun, different cases)

- Kernel identity `4 int_0^3 Phi_DH cos(ty) dy = sqrt(5/pi) Lambda(1/2+it)` at
  `t = 3, 10, 40`: ratio `1` to `1e-30` (RESULT checked one `t`, ratio 0.6308 =
  `sqrt(5/pi)/2`, consistent).
- `Phi_DH > 0` and decreasing on 4000 points of `[0, 4.01]`.
- `V'' = (-log Phi_DH(sqrt t))''`: min `2.54273` at `t = 0.558` on an offset grid of
  2200 points up to `t = 16`; formula checked against a finite-difference second
  derivative at three points (10 digits).
- Second off-line zero `0.650830 + 114.163343 i`: normalized diagonals
  `C_-(t,t) = -0.857`, `C_+(t,t) = -0.857` at `t = 114.2`; negative on
  `114.1 <= t <= 114.3`. Same behaviour as the RESULT's `t = 85.7` row.

DH control CONFIRMED (MEASURED, non-interval). No zeta-only mechanism is claimed.

## Other checks

- **RH not assumed.** The RH-conditional factorization (16)-(17) is used only in the
  converse direction of the PR 56 equivalence. OK.
- **Coordinate change.** No cancellation is claimed beyond the parity cross block and
  the `D`-odd null sector; the RESULT states that folding leaves `||T||` unchanged.
  OK.
- **Section 6, Euler-product remark.** `K = K_inf . prod_p (1 - p^-1/2 T_{2 log p})^-1`
  is not a valid operator identity: the product diverges on `Re s = 1/2` and `xi`
  carries the factor `s(s-1)`. It is marked "not used"; it should be labelled
  heuristic. The function-field sentence is unverified.
- **Section 6, heat reversal.** `e^{tau d^2/4} W = W e^{-tau d^2/4}` correct. The
  indefiniteness at negative time is Rodgers-Tao plus the PR 56 equivalence applied to
  `kappa_tau` (positive, even, order unchanged). OK.
- **Weakest step 1 of the RESULT** (DH convexity is a grid measurement) stands as an
  honest caveat.

## Surviving claim

Theorem 1 (exact `(Z/2)^3`, including `C` and `tau`), Theorem 2 (symmetry kills only
the `D`-odd null sector and the Mellin even/odd cross blocks; infinite multiplicity;
`T = T_+ (+) T_-`; `T_-` is target (B) unreduced; nothing killed on one-sided tests),
and the DH control. Corrected measurement: the EVEN sector carries 97.9% of the trace
of `H_c`, the odd sector 2.1%; `tr H_+ - tr H_- = (alpha/pi) int (f(0)^2-f^2)/t^2 dt > 0`.
