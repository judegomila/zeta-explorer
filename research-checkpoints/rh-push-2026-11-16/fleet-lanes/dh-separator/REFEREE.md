# Referee report: dh-separator/RESULT.md

Date: 2026-11-16. Adversarial pass. Scratch scripts in `/tmp/ref-dhsep/` (not part of the deliverable).
Only this file was written in the repo.

## Verdict

**holds = true.** Every step labelled PROVED was re-derived and survives. Every MEASURED number I
re-ran was reproduced with an independent evaluator. No step assumes RH. No step restates verified
height as new. The DH control is satisfied: Theorems A and B are valid for DH verbatim, and the only
step that fails for DH is the zero-free input (Euler product).

The result is a restatement of the classical zero-free region, as RESULT.md says itself. It moves no
bound and gives no new zero information. The corrections below are to wording and scope, not to a
proof step.

## 1. Re-derivation of PROVED steps

**Theorem A (order-1 identity and pair formula). Confirmed.**
- `N = 1` in the Pick form gives `(L(z) + conj L(z))/(z + conj z) = Re L(z)/x`.
- `L = sum_rho 1/(z - rho)` as a symmetric sum: `F` even with `F(0) != 0` gives `F'/F` odd, so the
  Hadamard constant cancels against `sum 1/rho` under the pairing `rho, -rho`. Partial sums over
  `|rho| < R` are symmetric, and their real parts converge to the absolutely convergent series
  `sum (x - beta)/|z - rho|^2`.
- Pair algebra: `(x-d)((x+d)^2 + D^2) + (x+d)((x-d)^2 + D^2) = 2x(x^2 - d^2 + D^2)`. Correct.
- Evenness of the DH completion was checked numerically: `|L_DH(z) + L_DH(-z)| = 4e-31` at
  `z = 0.37 + 12.3i` (character is odd, so `Gamma((s+1)/2)` is the right factor).
- Independent numeric test of the pair formula at a zero not used in RESULT.md
  (`0.650830080609737 + 114.163342730757 i`, `delta = 0.15083`): `Q_DH` minus the single pair term is
  `0.9778, 0.9767, 0.9754, 0.9745, 0.9656` at `x = 0.05, 0.10, 0.14, 0.16, 0.30`, smooth and positive
  through the pole at `x = delta`, while `Q_DH` itself runs `-97.8, -155.9, -634.0, +702.7, +30.7`.
  Same test at `w_0`: remainder `0.846, 0.843, 0.843, 0.827` at `x = 0.25, 0.30, 0.31, 0.50`.
- Lens lemma: height profile at the second zero, `x = 0.1`, lens half-width `0.11291`: `Q_DH < 0` at
  `dt = 0.05, 0.10`; `Q_DH = +0.988` at `dt = 0.113`, where the pair term is `+0.033`. Sign change of
  the pair term sits at the lens boundary as claimed.

**Corollary A1. Confirmed for `c >= 0`.** The "if" direction uses `H(z) subset {delta > x}`. The
"only if" direction uses the simple-pole behaviour of `L` at a zero. State `c >= 0` explicitly (the
form needs `Re z > 0`).

**Corollary A2. Confirmed.** Nodes `z, conj z`, coefficients `b/2, conj b/2`; the off-diagonal entry
is `(b^2/4) L(z)/z` plus its conjugate.

**Theorem B. Confirmed.**
- (1) `C_v(l) = sum beta_i e^{-x_i l}` with `beta_i = b_i sum_j b_j/(x_i + x_j)`. The transform of
  `e^{-c|l|} C_v` is a Poisson average of `|V(i tau)|^2`, hence positive, and Fejer-Riesz gives a
  real Hurwitz `P` of degree `<= N-1`. The converse uses Fejer-Riesz for a nonnegative (not strictly
  positive) numerator, which is still valid. Note: `r` is determined only up to the choice of
  spectral factor; this is harmless because `Q(r)` depends on `C_r` alone.
- (2) `R(s)R(-s) = sum beta_i [1/(y_i+s) + 1/(y_i-s)]` and `sum_rho 2y/(y^2 - rho^2) = 2L(y)`. Correct.
- (3) Identity `1/(x+c-rho) + 1/(y+c-conj rho) = (x+y+2(c-beta)) / ((x+c-rho)(y+c-conj rho))`.
  Correct; each summand is a rank-one PSD kernel times `[1 + 2(c-beta)/(x+y)]`, PSD by Schur when
  `beta <= c`. The converse is the standard Pick extension argument on a set of uniqueness; choose
  the interval away from a possible real pole. Correct.
- Independent numeric test (my own spectral factorisation, three random cases with `N = 2, 5, 5`,
  `c = 0.5, 0.2, 1.3`, seed 20261116): `Q(r)` by the direct Pick form on `r` agrees with the shifted
  form to `< 5e-40` for zeta and DH; coefficients of `r` real; autocorrelation mismatch `< 5e-37`.
- Independent PSD test at 60 digits, random real nodes in `(0.01,0.3)`, `(0.05,3)`, `(1,1.5)`,
  orders 6 to 8: shifted Pick matrices with `c = 1/2` have minimum eigenvalue `> 0` for zeta
  (`4.1e-8, 9.6e-12, 4.1e-22`). They are also positive for DH (`1.7e-7, 5.6e-11, 2.3e-21`), which
  agrees with RESULT.md: the DH failure at `c = 1/2` has no explicit low-order witness.

**Theorem C. Confirmed.**
- (1) follows from A1 and B(3) and `zeta(s) != 0` on `Re s > 1`. Strictness also uses
  `zeta(1 + it) != 0` (`delta < 1/2`), which is classical and Euler-dependent.
- (2) The chain `|gamma - t| < delta < 1/2`, `delta < 1/2 - eta(|gamma|) <= 1/2 - eta(|t| + 1/2) <= x`
  is correct. Add the condition `Re z > 0` to the stated region.
- (3) is correctly labelled CONDITIONAL.
- No verified height enters (1) or (2) for an unspecified constant `c_0`. Agreed.

## 2. Re-run of MEASURED values (independent evaluator)

I evaluated `f` by `5^{-s} sum_a c_a zeta(s, a/5)` with mpmath Hurwitz zeta and its analytic
`s`-derivative. RESULT.md used `mp.dirichlet` and python-flint with a central difference.

| quantity | RESULT.md | referee |
|---|---|---|
| `Q_DH` at `0.25 + 85.699348485 i` | -60.35 | -60.34798 |
| `Q_zeta` at the same `z` | +1.7287 | +1.728701 |
| `w_1` | 0.8977501549770 + 2442.5302924685 i | 0.897750154977011 + 2442.53029246849 i, `|f| = 1.8e-28` |
| `Q_DH` at `0.375 + i Im w_1` | -110.83 | -110.8333 |
| `Q_zeta` at the same `z` | +6.360 | +6.360226 |
| `f(1/2)` | 0.8254 | 0.825383 |

The four other tabulated zeros have `|f| < 1e-12` at the 16-digit values given and `|f'|` between 1.5
and 2.1, consistent with simple zeros at those points.

`scan.f_vec` (the double-precision evaluator behind the winding scan) agrees with mpmath Hurwitz to
`2.1e-13` at 25 random points with `0.87 <= sigma <= 3`, `10 <= t <= 10^4`.

Rescan with a different box grid (offset 3.7, height 7, right edge 4, step 0.03, flag threshold 0.8):
- `sigma_0 = 0.87`, heights 3.7 to 3000: total winding 1 (box `[2439.7, 2446.7]`), one near-line flag
  at `[234.7, 241.7]` with `min |f| = 7.3e-4` on the left edge. Matches the table.
- `sigma_0 = 1.0`, heights 3.7 to 10010: total winding 0, no box flagged (maximum phase step below 0.8 in every box; 1387 s). No DH zero with `Re s > 1` detected. Matches RESULT.md. Still MEASURED (double precision, not ball-certified).
- Heights 0.001 to 12 (mpmath, 20 digits): winding 0 on `[0.87, 4]` and on `[1.0005, 4]`, maximum
  phase step 0.041 and 0.028.

Complexity floor (one real exponential cannot separate): `L_DH(x)/x > 0.159` and `f(1/2 + x) > 0.83`
on `0 < x <= 4`, and the box `[0.5001, 6] x [0.001, 4.6]` has winding 0 with maximum phase step 0.099.
So DH has no zero with `delta > |gamma|` (MEASURED). Agreed.

## 3. DH control

Passed. Theorems A and B use only: even, real on the real axis, entire of order 1, zeros in a strip,
`F(0) != 0`. All hold for the DH completion. Theorem C fails for DH at exactly one step, the
non-vanishing on `Re s > 1` (and on the de la Vallee-Poussin region), which is where the Euler
product and `Lambda(n) >= 0` enter. Existence of DH zeros with `Re s > 1` is quoted from
Davenport-Heilbronn / Titchmarsh 10.25, correctly labelled CLASSICAL.

Plausibility of "no DH zero with `Re s > 1` below `10^4`": a zero of `f` in `sigma > 1` needs
`arg(L(s,chi)/L(s,chi-bar))` to reach a fixed value near `2.59` rad. Only primes `p = 2, 3 mod 5`
contribute, each at most `2 arcsin(p^{-sigma})`. At `sigma = 1` the primes up to 47 give about 2.51,
so roughly ten or more prime phases must align at once. Such heights are expected to be far above
`10^4`. The measurement is consistent with this.

## 4. RH and verified-height audit

- No step assumes RH. Theorem B(3) and Corollary A1 are stated as equivalences with zero-free
  half-planes and used only at `c = 1/2` (unconditional) and `c = 3/8` (conditional, labelled).
- Verified height appears only in section 5 of RESULT.md, as the explanation of why zeta is positive
  at the height-85.7 witness. It is not presented as a new result.
- The 7/8 half-plane is labelled unrefereed everywhere it is used.

## 5. Corrections and gaps (none breaks a PROVED step)

1. **The explicit separators are not in the cone `E` of eq48.** `E` has real rates `x_j > 1/2`.
   Both explicit witnesses have complex rate and `Re z < 1/2` (0.25 and 0.375). RESULT.md says this
   in weakest step 3 for `w_1` only; it applies equally to the headline witness at height 85.7.
   Verdict item 1 ("the separator exists at the lowest possible complexity") is a statement about
   the enlarged class `{Re z_j > 0, complex rates}`, defined through the zero side / Pick form. For
   `Re z <= 1/2` the identification with PR 48 eq. (21) (prime side) is not established. Inside `E`
   proper, the only explicit DH separators remain the sibling order-150-to-210 real-node matrices.
   The phrase "inside the one-sided Weil cone" should be qualified accordingly.
2. **Theorem C(2)** needs `Re z > 0` added to the region. Corollary A1 needs `c >= 0`.
3. **Lens sentence in the verdict** ("sees only zeros within height `sqrt(1/4 - x^2)` of `t`") is
   specific to zeta (`delta < 1/2`). For DH the lens can be taller, since `delta` may exceed 1/2.
4. **Table column "worst-phase damped cosine"** is the minimum over phases. The claim "negative at
   every phase" needs the maximum, `(Re L/x + |L/z|)/2`. The text below the table supplies this
   (`|L/z|/2 < 0.1`), and I confirm it (`|L/z| ~ 0.18` at `x = 0.25`). Relabel the column.
5. **Theorem B(1)**: "every element of `F_c` arises this way" holds at the level of `C_r`, not of `r`
   (spectral factors are not unique). Harmless.
6. **Novelty.** Theorem A is the Hinkkanen / Lagarias `Re xi'/xi` criterion with the pair terms
   written out. Theorem B(3) is the Pick criterion for a shifted half-plane. "PROVED" is accurate;
   "new" is not claimed and should not be.

## 6. Is the obstruction real?

Yes. Corollary A1 and Theorem B(3) are two-sided equivalences. Positivity on a family that is
invariant under vertical translation and contains order-1 tests is the same as a zero-free
half-plane. I see no route around it that yields new zero information. Averaging the order-1 test
over `t` removes the obstruction but also the content: a pair to the right of `x` integrates to
exactly 0 over all `t`, so the averaged form is positive for DH as well (MV-CAP wall).

Two things the attempt left on the table, neither of which gives new zero information:

- **Theorem C(2) extends at no cost to the Vinogradov-Korobov region.** The proof uses only that
  `eta` is nonincreasing, so `eta(u) = c/((log u)^{2/3} (log log u)^{1/3})` works. This is still
  unconditional and free of verified height for an unspecified constant. It is the widest region in
  which the order-1 positivity is currently provable from the Euler product.
- **The all-phase damped-cosine statement on `Re z >= 1/2`** (RESULT.md section 6, "also unproved")
  looks provable. For large `|t|`: `|L(z)/z| = O(log|t| / |t|)` on `Re s >= 1`, while
  `Re L(z)/x` is bounded below by a positive constant, using the zero count in a window of fixed
  width and `sigma - beta >= eta(|t|)`. Small `|t|` is a compact region in `Re s >= 1` where only
  values of `zeta'/zeta` are needed, not zero ordinates. This would give a real-valued,
  Euler-sensitive, verified-height-free positivity statement of order 2. It would still be a
  consequence of the classical region.

## 7. Surviving claim

All PROVED items stand as stated, with the scope corrections in section 5. Strength: a correct and
honestly labelled restatement. The explicit DH witnesses lie outside `E` as defined in eq48; the
only unconditional "proved for zeta, fails for DH" pairing is at `c = 1/2` and fails for DH by
classical existence only.
