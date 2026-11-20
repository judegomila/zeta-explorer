# REFEREE: n3-green-two-sheet-heegner-gram

Adversarial referee (general), 2026-11-17. No ssh. Both runs through `scripts/memcap.sh 8`, single process,
53 s and 177 s. Scratch scripts in `/tmp/ref_n3/` (not kept in the repo). RH open; nothing here concerns zeros of zeta.

**Verdict: holds as a precise obstruction, with one missing hypothesis in Lemma 2 and two wording corrections.**
No PROVED step failed re-derivation. No use of RH, no restated verified height, no novelty claim.

## 1. Re-derivation of the PROVED steps

**(J) jump, sign included: confirmed.** Zero mode of `G_s(., z')` above `Im z'` is `y^{1-s} E(z',s)/(2s-1)`; of
`G_{1-s}` it is `y^s E(z',1-s)/(1-2s)`. The zero mode of `E(z,s)E(z',1-s)/(1-2s)` is
`y^s E(z',1-s)/(1-2s) + phi(s) E(z',1-s) y^{1-s}/(1-2s) = y^s E(z',1-s)/(1-2s) - y^{1-s} E(z',s)/(2s-1)`.
The two agree, and the difference is an automorphic solution of the homogeneous equation, so (J) holds with the stated sign.

**(H) Herglotz: confirmed.** `R(lambda) - R(conj lambda) = (lambda - conj lambda) R(lambda) R(conj lambda)`,
`G_{conj s} = conj G_s`, `G_s(., D)` in `L^2` (logarithmic singularity, dimension 2). The Gram matrix is real because
`G` is symmetric. The dropped diagonal term is real and independent of `s`, also at the elliptic points `z_{-3}`,
`z_{-4}` where it occurs with the stabiliser multiplicity.

**(C): confirmed.** `2 zeta(2s) E(z_D,s) = y^s sum' Q(m,n)^{-s} = (sqrt|D|/2)^s w zeta(s) L(s,chi_D)`.
Unnormalised `T_p` eigenvalue `p^{1/2}(p^{s-1/2} + p^{1/2-s}) = p^s + p^{1-s}`.

**Theorem 1: confirmed.** `M2 - M1 = Im(c v v^T)` from (J) and `E(z',1-s) = phi(1-s) E(z',s)`.
`u^T R u = Im(c (u.v)^2)` gives rank <= 2 and the four signatures. Weyl gives `n_+(M2) + n_0(M2) <= 1` when `M1` is
negative definite. Line formula: `1-s = conj s` on the line, so `-2i Im G = v_i conj(v_j)/(-2it)`,
`Im G = -v_i conj(v_j)/(4t)`; this is real because `E(z, 1/2+it)` has a phase independent of `z`
(`E = phi(s) conj E`). The result does not state that last point; it is needed for the formula to be a real matrix.

**Lemma 2: confirmed on the family; the "for every z'" clause needs a hypothesis.**
The jump is `E(D_i,rho) E(z',1-rho)/(1-2rho)`. `E(z',1-rho) = E(z',rho)/phi(rho)` has a pole at `1-rho` when
`xi(2rho-1) = 0`. For `rho = beta + i gamma` with `beta > 1/2` this means `zeta(2beta-1+2i gamma) = 0`, which is not
excluded unconditionally. In that case:
- matrix entries on the family still vanish (the pole of `phi(1-s)` is simple-vs-double zero of `zeta(s)^2`), but the
  order is `O(s-rho)`, not `O((s-rho)^2)`;
- for a generic `z'` the product zero x pole can be finite and non-zero, so `G_{1-rho}(D_i,z') = G_rho(D_i,z')`
  "for every z'" is not proved.
Corrected statement: add "and `1-rho` is not a pole of `E(., s)`, i.e. `zeta(2rho-1) != 0`". This is automatic at
on-line zeros (`2rho-1` on `Re = 0`) and at the two `D = -23` control zeros (`2rho-1 = 0.64+78.1i`, `1.01+45.1i`).
The obstruction verdict is unaffected.

**Section 2.4: confirmed.** `lambda(rho) = lambda(1-rho)`; nothing in (J), (H), (C) separates `Re rho > 1/2` from `= 1/2`
other than definite versus zero.

Wording corrections:
- Theorem 1, "definite when ... linearly independent (distinct supports)": the correct condition is that the divisors
  `D_i` are linearly independent as divisors (then `sum c_i G(., D_i)` solves `(Delta - lambda)u = sum c_i delta_{D_i} != 0`).
  Distinct supports is neither necessary nor the right notion for Hecke translates sharing points. The result lists
  this under its weak steps; the fix is one line.
- The control is correctly labelled a Davenport-Heilbronn analogue: for class number 3,
  `Z_A = (zeta_K - L(psi))/3` up to the common factor, a combination of two Euler products with one functional equation.

## 2. Independent numeric check, different case

Not a rerun of the author's cases. `D = -31` (class number 3), class `[2,1,4]`, `z_A = (-1 + i sqrt 31)/4`.
Scan `0.54 <= Re s <= 1.3`, `5 <= Im s <= 45` found off-line zeros of `E(z_A, s)`:

| zero | `|E(z_A)|` | `|E(principal)|` |
|---|---|---|
| `0.780215991548 + 23.351261744343 i` | 1e-20 | 1.85 |
| `0.803952450152 + 32.014976969244 i` | 3e-20 | 1.27 |
| `0.867803247949 + 37.991586970122 i` | 2e-20 | 2.85 |

Two-sheet matrices at the first zero on five divisors: `T_1 z_A .. T_4 z_A` and the generic non-CM point
`z_g = 0.2 + 1.3i` (13 points; both sheets solved independently with the author's `glib.Solver`; `Im lambda = -13.09`).

| quantity | value |
|---|---|
| least-squares residuals | 3e-14, 4e-14 |
| jump identity (J), all 25 entries | 3.6e-14 relative |
| Theorem 1 `M2 - M1 = Im(phi(1-s) v v^T/(1-2s))` | 3.2e-14 relative |
| `|E(T_n z_A, s)|`, `n = 1..4` | 1e-15 .. 3e-14 |
| `|E(z_g, s)|` | 3.47 |
| `|G_{1-s} - G_s|/|G|`, class block and class-vs-`z_g` entries | <= 3.6e-14 |
| same, `(z_g, z_g)` entry | 0.106 |
| class block eigenvalues, both sheets | -2.40, -0.82, -0.26, -0.08 |
| with `z_g`: `M1` | -2.54, -0.83, -0.38, -0.12, -0.08 |
| with `z_g`: `M2` | -2.52, -0.83, -0.30, -0.09, +0.19 |
| rank-2 term `R` eigenvalues | 0, 0, 0, 0, +0.397 (rank 1, since `v` has one non-zero entry) |

This reproduces, on a discriminant the author did not use: the coincidence of sheets on a single class and its Hecke
translates at an off-line zero, negative definite on both sheets; the "for every z'" clause of Lemma 2 (row
class-vs-`z_g` agrees although `E(z_g, rho) != 0`); and inertia `(1,4,0)` on the second sheet once a divisor with
`E != 0` is added. The check shares the author's kernel code, so it is independent in case and in the Theorem 1
comparison, not in implementation; the analytic sign check of (J) in section 1 is independent of the code.

## 3. Controls

The result claims an obstruction, not a zeta-only mechanism, so no control can overturn it by passing.
- Davenport-Heilbronn type: run by me above (`D = -31` single class). The configuration exists at an off-line zero.
- Backward heat, sign twist: "not formulable" is accurate. Neither function is a value of `E(z,s)` on `PSL2(Z)`;
  the sign twist has no functional equation, hence no jump formula. Nothing to run.
- On-line zero: both matrices are zero by the line formula (re-derived).

## 4. RH, verified height, novelty

No step assumes RH or uses verified zero heights (the gamma_n rows are evaluation points only). All inputs are
classical (resolvent jump across the continuous spectrum, Hecke CM formula, Weyl inequality). The result presents
nothing as new. Not re-checked by me: the Colin de Verdiere / Bombieri-Garrett attribution and the Gross-Zagier
normalisation in section 6 (the result marks both as cited from memory); neither is load-bearing for the verdict.
The `H^{-1}` remark is correct as stated (a point mass in dimension 2 lies in `H^{-1-eps}` only).

## 5. What remains unproved in the result

- "No second identity" (section 6) is a search over three candidates. The control proves only the conditional:
  an identity that excludes off-line zeros through this matrix must fail for a single class with `h > 1`.
- "Less content than n2" (section 7) is a comparison, not a theorem; I agree with it: zeros enter only through `v = 0`.
- Numerics are double precision, not interval-certified; inertia "0" entries rest on a tolerance.

## 6. Surviving claim

For `Re s > 1/2`, `Im s != 0`: `Im G_{1-s} = Im G_s + Im[phi(1-s) v v^T/(1-2s)]` on any finite family of divisors, the
first term `Im(lambda)` times a Gram matrix, the second of rank <= 2. If `E(D_i, rho) = 0` and `zeta(2rho-1) != 0`
the two sheets agree on the family and against every `z'`; without the second condition they still agree on the
family. The same holds at off-line zeros of single Epstein classes (`D = -23` by the author, `D = -31` here), with
both matrices definite. The second-sheet Gram matrix therefore carries no sign constraint that separates zeta from a
function with off-line zeros. Lane closed.
