# REFEREE: ap-squares-rallis

Date: 2026-11-17. Adversarial review of `RESULT.md` (claimed verdict: precise-obstruction).

## Outcome

**Holds, with a narrower scope than the Verdict section states.** Lemma 0, Theorem 1, Corollary 2 (abstract
form) and Theorem 3 were re-derived and are correct; one step of Theorem 1 is under-justified and is repaired
below. The DH control statements were confirmed numerically. The headline sentence "No norm realisation of
`Q_L` of Rallis / Waldspurger / theta-lift type exists" is not what is proved: what is proved is that no
realisation exists in which translation of the test acts through a **mixing** unitary group, and the list of
structures "covered" is correct only when that group is right translation by a non-compact one-parameter
subgroup. Nothing here bears on the location of a zero. Lead strength for RH: low (agrees with the author).

## 1. Re-derivation of the PROVED steps

**Pick form / zero sum.** `1/((rho+x_j)(x_k-rho)) = [1/(rho+x_j)+1/(x_k-rho)]/(x_j+x_k)` and
`sum_rho 1/(x-rho) = L(x)` (symmetric summation, `F` even of order 1) give
`Q(v) = sum b_j conj(b_k)(L(x_j)+L(x_k))/(x_j+x_k)`, matching eq48 line 51. `Q` is Hermitian (reindex
`rho -> -conj rho`), so polarisation in Theorem 1 is legitimate. Confirmed.

**Lemma 0.** `S_a` multiplies `V` by `e^{-az}`; `e^{-a rho} conj(e^{a conj rho}) = 1`. Confirmed. Absolute
convergence on `E^`: `|e^{-a rho}| <= e^{a/2}`, `|V(rho)| <= C/|rho|`. Confirmed.

**Theorem 1.** RH from `Q >= 0` on `E` (eq48 Thm 3, refereed). `<U(a)Theta v, Theta v> = Q(S_a v, v) =
sum m_gamma e^{-ia gamma}|V(i gamma)|^2`, Bochner uniqueness. Confirmed.
*Gap (repairable):* dense range of `Theta v -> (V(i gamma))_gamma` in `l^2(m)` is justified by "separate
finitely many points". That does not give density in an infinite-dimensional `l^2`. Correct argument: if
`c in l^2(m)` is orthogonal to the range then `g(x) = sum m_gamma conj(c_gamma)/(i gamma + x) = 0` for
`x > 1/2`; the series converges absolutely (Cauchy-Schwarz, `sum gamma^-2 < inf`), `g` is meromorphic with
residue `m_gamma conj(c_gamma)` at `x = -i gamma`, so `c = 0`. With this the unitary equivalence stands.
Strong continuity of `U` is not used.
*Content:* given RH, Theorem 1 is the GNS/Bochner uniqueness of the positive-definite function
`a -> Q(S_a v, v)`. It is correct and close to tautological.

**Corollary 2 (abstract).** An absolutely convergent trigonometric series is Bohr almost periodic; an a.p.
function tending to 0 at `+inf` vanishes identically (translation invariance of the sup norm on the hull);
the coefficient at `gamma_1` is non-zero for `v = e^{-xt}`. Unconditional (if RH fails no `Theta` exists at
all). Confirmed.

**Theorem 3.** `L(x)/x = sum_{all gamma} m_gamma/(x^2+gamma^2)` (pair `+-gamma` in Hadamard); both sides are
Stieltjes transforms in `x^2` of measures with `int d nu(u)/(1+u) < inf`; agreement on `x^2 > 1/4` extends
to `C \ (-inf,0]`; inversion. Only single exponentials are used. Confirmed. Standard uniqueness; not new.

**Section 3(a).** Euler-Maclaurin: `e^{-xt} sum_{n<=e^t} n^{x-1/2} = e^{t/2}/(x+1/2) + zeta(1/2-x)e^{-xt} +
O(e^{-t/2})`; the growing term has coefficient `V(1/2) = 0`; `Ev in L^2`; Paley-Wiener. Confirmed.

**Section 5, `phi_c`.** `phi_c(s)phi_c(1-s) = 1` and `|phi_c| = 1` on `Re s = 1/2`: checked by hand from
`xi(z) = xi(1-z)`, real `c`. Confirmed.

**Theorem 4.** Schur on the irreducible even Weil representation plus multiplicity one of the weight-1/2
space at level 4 (Serre-Stark; needed for the Hecke operators to preserve the theta module, not stated in
the file). Correct as a classical statement. The map `v -> phi_v` is never specified, so "theta_v" in the
consequence is undefined; the statement is about all `phi`, which suffices.

## 2. Errors and overstatements

1. **Verdict item 2 and the sentence after the table overstate Corollary 2.** "None, for a reason that does
   not depend on the choice of group, cover, level, test vector" is false as written: it depends on the
   choice of `U`. Howe-Moore gives mixing only for right translation by a one-parameter subgroup with
   non-compact image, on the orthocomplement of vectors fixed by a non-compact simple factor. Not covered:
   - `U(a)` a function of the Casimir or Laplacian (wave group `exp(ia sqrt(Delta-1/4))`) or of Hecke
     operators. On the cuspidal and residual parts of `L^2(Gamma\G)` this has pure point spectrum. Corollary 2
     says nothing; Theorem 1 then only requires `{gamma} subset {r_j}` with the right weights, which the file
     does not exclude.
   - `U` a compact one-parameter subgroup (`K`-rotation, or any subgroup when the real points of the target
     group are compact, e.g. theta lifts to definite orthogonal groups, where Howe-Moore is empty). The
     spectrum is then a lattice; exclusion needs the arithmetic fact that the `gamma` do not lie in a lattice,
     not mixing.
   - reducible lattices and groups with compact factors (acknowledged in weakest step 3).
2. **Rallis row.** For a theta lift `theta_phi(f)` the covariance `Theta S_a = U(a) Theta` holds with `U` =
   right translation on the target only if the shift of `v` is `omega(h_t)` with `h_t` in the target group.
   If `v` enters through `phi` and the shift is `omega(g_t)` with `g_t` in the source group, or `v` enters
   through `f`, there is no unitary `U` on the target and Corollary 2 does not apply. The Rallis norm is
   therefore covered only in one of its parametrisations. The file's weakest step 1 concedes non-covariant
   realisations; the Verdict does not.
3. **Section 6(ii) uses Corollary 2 for a form matched to `Q_L` on `E`, but Corollary 2 needs the identity on
   `E^`.** Repair: `e^{-az}/(z+x)` is the limit of `(1+az/n)^{-n}/(z+x)` (real poles, split into distinct
   rates) in the norm `sup_t (1+|t|)^{1/2+eps}|V(it)|`, and under RH `Q` is continuous in that norm. The
   family form is continuous in it only if `sum_D w_D (int |c_D(t)|(1+|t|)^{-1/2-eps} dt)^2 < inf`, which
   is stronger than the stated `sum_D w_D ||V c_D||_1^2 < inf`. With the stronger summability the step is
   proved; as stated it is not.
4. **Section 6(i)** is labelled PROVED but is a sketch, and it fixes one parametrisation (`u(D) = v(log|D|)`).
   The statement is true: a form `int |v|^2 dm` invariant under all `S_a` on `[0,inf)` has `m` = multiple of
   Lebesgue, and `Q_L != c||v||^2` by Theorem 3. "Its prime side has support at `log p^k`" is not the proof.
5. **Section 5, Rallis / Lapid-Rallis row.** The formula omits the normalising partial zeta values and the
   condition on the range: the central point `L(1/2, pi)` occurs for `dim V = 2n+1`, outside the convergent
   Siegel-Weil range, where the regularised formula (Kudla-Rallis; Gan-Qiu-Takeda) is needed.
   Lapid-Rallis prove `L(1/2, pi) >= 0` for symplectic-type `pi` through Eisenstein series and intertwining
   operators, not through a theta norm; non-negativity from the Rallis formula also needs positivity of the
   local zeta integrals. Kohnen-Zagier as quoted omits its hypotheses (level 1 Hecke eigenform, fundamental
   `D` with `(-1)^k D > 0`) and the factors `|D|^{k-1/2}`, `<f,f>/<g,g>`. None of this is load-bearing for
   Theorems 1, 3 or Corollary 2; the rows are paraphrases, not exact statements.
6. **Section 3(d), "dense range, cokernel 0"** is the two-sided statement in `L^2(C_Q)` (multiplication by
   `zeta(1/2+it)`, non-zero a.e.). In the one-sided Hardy-space setting of 3(a) the closure of the range is
   the Nyman-Beurling question, equivalent to RH. The file moves between the two without saying so.
7. **Novelty.** Theorem 1 / Corollary 2 for the idele class group are the known remark that zeros occur in
   `L^2(C_Q)` as absorption, not as eigenvalues, because scaling there is the regular representation
   (Connes 1999; Meyer 2005; Burnol). The extension to `Gamma\G` by Howe-Moore is a direct application. The
   lane should be recorded as a consolidation, not a new theorem. (Checked from memory of the literature; no
   online search run.)
8. **Controls.** "No Eisenstein series has the DH intertwiner" is argued, not proved, and "not formulable"
   cells are not quantitative handles (map section 2, Q1). The HEAT and E_a cells of the table were not run.
   The lane is an obstruction, so this does not affect the verdict.

## 3. Independent numerics (DH control)

Script `/tmp/ref-ap-squares/dh.py` (outside the repo), run through `scripts/memcap.sh 8`, single process,
170 s, planned allocation printed (6 float64 arrays of length 2e6 = 96 MB; 12001 Hurwitz evaluations).

- DH functional equation `xi_DH(s) = xi_DH(1-s)`, `xi_DH = (5/pi)^{s/2} Gamma((s+1)/2) f`: relative defect
  9.5e-27 and 1.8e-25 at two points.
- Off-line zero: `0.808517182457 + 85.6993484854 i`, `|f| = 5.8e-26`.
- `Q` indefinite for DH on the complexified class (`V = 1/(z+x)`, `Q = Re L(x)/Re x`): at
  `x = 0.2 + 85.699348 i` DH gives -35.39, zeta gives +1.755; at `0.25 + 85.699348 i` DH -60.35, zeta
  +1.729; at `0.6 + 85.699348 i` DH +8.37.
- Tate norm identity for DH (no `V(1/2) = 0` needed, DH is entire and `a_n` has mean 0 mod 5):
  `V = 3/(z+1) - 5/(z+2)`: time side (N = 2e6) 1.23791; spectral side to T = 300 1.22063 plus crude
  mean-value tail 0.01230 = 1.23293. `V = 1/(z+1)`: 0.60630 against 0.60199 + 0.00307 = 0.60506. Residuals
  0.4% and 0.2%, with ratio 4 = ratio of `(sum b)^2`, i.e. the constant in the tail estimate. Float level.
- DH theta-norm shift correlation decays (1.2206, -0.1472, -0.0093, -0.0024, -9e-6, 0 at
  `a = 0, 1, 2, 5, 10, 20`), same behaviour as for zeta.

Conclusion: the claimed control outcome is confirmed. The automatic norm (3a) holds for DH; its shift
correlations are mixing for DH as for zeta; `Q_DH` is indefinite. No step of the lane separates DH from zeta,
which is consistent with an obstruction and with map item 295.

The author's `checks.py` was read, not re-run (it overwrites `checks.json` and must be started from the repo
root because of a relative output path). Its memory plan is stated and small. Its time-side norm has no tail
term (N = 50000, error of order 1/N), and the zero-side correlations use 150 zeros with the tail (0.0197 of
0.183) omitted for `a != 0`; both are illustrations only, as the file says.

## 4. Surviving claim

For a unitary group `U` and linear `Theta` on the shift-closed class `E^` with `||Theta v||^2 = Q(v)` and
`Theta S_a = U(a) Theta`: RH holds and the cyclic span is `l^2` on the zeros with `U(a) = e^{-ia gamma}`
(Theorem 1, with the density repair). Hence no such `Theta` exists when `U` is mixing (Corollary 2). This
applies to scaling on `L^2(C_Q)` and to right translation by a non-compact one-parameter subgroup of a
connected semisimple `G` with finite centre on `L^2(Gamma\G)` off the vectors fixed by a non-compact factor.
A diagonal formula `int |V(it)|^2 d mu` forces `mu` = zero-counting measure (Theorem 3). Not excluded:
realisations whose `U` is a function of the Casimir or of Hecke operators, compact one-parameter groups,
non-covariant, truncated or cone-restricted realisations, and family sums without the stronger summability
of item 3. All statements are the same for DH. The lane is a correct consolidation of a known obstruction
with an over-wide headline; it supplies no mechanism and no information about zeros.
