# REFEREE (general lens): c7-laurent-shell-gamma-section

Date: 2026-11-18. One referee pass. Scripts added by the referee: `ref_a.py`, `ref_b.py`, `ref_c.py` (local,
`scripts/memcap.sh 8`, single process, longest 131 s; no server use). No statement about zeros of zeta is made in
the note or here.

## Outcome

The verdict "precise obstruction" holds, with one wrong formula (Section 2, second bullet) and one missing
attribution. All four requirement flags are false, as the note says.

## 1. PROVED steps re-derived

**Lemma 1 (trigonometric-polynomial density on a coordinate hyperplane). Confirmed.**
- Right edge. On `Re z = 2` the frequencies of `h` are `q_kappa p_b^j >= 1`, with equality only for `kappa = 0`,
  `j = 0`. The constant term of `h(z) F(1/2 + z)` is `a_1`; the remaining frequencies `q n > 1` are bounded away
  from 1 because the set of `kappa` is finite. Step (1) of Theorem A' carries over.
- Left edge. Steps (2), (3) of `REFEREE2.md` are stated there for every real `k > 0` with a constant `C(delta)`
  free of `k`; the total error is `C sum_{n,m} n^{-5/2} |a_m| m^{-2}`, finite for a finite set of geometric
  families. The main term is `sum_m conj(a_m) m^{1/2} sum_n e(nm) e^{-2 pi n m eta}`. For integer `m` the inner sum
  is `1/(2 pi m eta) + O(1)`, which gives `conj(a_m) m^{-1/2}/(2 pi delta)`. For `m = p_b^j/q` not an integer with
  reduced denominator dividing `a`, the inner sum is at most `min(1/(2 pi m delta), a/4)`; with the weight
  `m^{1/2}` the sum over `j` is `O(a^{1/2} delta^{-1/2})`, inside the note's `O(a delta^{-1/2})`.
- Bracket. Recomputed from `c_nu(n)`: the mean over `k` of `r_k n^{-i gamma_k}` is nonzero only if
  `n prod p^{kappa_p} = p_b^j`, so only P-smooth `n` enter and `B = 2 int F_P dmu`. The normalisation
  `2 mu_0 = c_0 = lim 2 pi delta S_1` is consistent with `a_1 = c_0/2`.
- The author ran only Poisson densities (the unproved case). Referee run of the proved case (`ref_a.py`):
  `P = {2,3}`, `p_b = 3`, `rho = 1 + 0.9 cos(phi - 1)`, `theta = (2.0, 2.5)`. The density has the modes
  `q = 2` (integral) and `q = 3^j/2` (non-integral).

  | function | predicted (Laurent bracket) | measured `S/S_1` | shift if the non-integral modes counted |
  |---|---|---|---|
  | zeta, 78,682 poles | 0.43672 + 0.13388 i | 0.43650 + 0.13299 i at `delta = 1e-4` (differences 0.0033, 0.0013, 0.0009 at 1e-3, 3e-4, 1e-4) | 0.236 - 0.065 i |
  | DH, 7,868 poles | 1.03956 + 0.10714 i | 1.02366 + 0.11668 i at `delta = 1e-3` (differences 0.093, 0.058, 0.019 at 4e-3, 2e-3, 1e-3) | -0.349 + 0.109 i |

  Float accumulation of 80-bit values (MEASURED, not a ball run). The projection `Pi_int` is confirmed for zeta
  and for DH.

**Corollary 1. Confirmed, with a scope remark.** `ref_c.py` (60 Nelder-Mead starts per case): `min Re E_P` =
0.585786, 0.250000, -0.498395 for `{2}`, `{2,3}`, `{2,3,7}`; `{2,3,37}`: +0.0083 (89.73 degrees); `{2,3,31}`:
-0.0190 (90.61 degrees). `min Re D_P` = 0.532751, 0.038483, -0.620911; `min |D_P|` = 0.113432 for `{2,3}` and 0
for `{2,3,7}` (zeros exist). `L^1` norms 1.180341, 1.302914 (zeta) and 1.086798, 1.174646 (DH). A2 prediction
recomputed: -0.455663 - 2.115475 i. Scope: the direction "sign not forced when `min Re F_P < 0`" follows from the
proved subclass. The direction "sign forced for every measure of the class when `Re F_P >= 0`" needs Lemma 1 for
general hypersurface measures, which is measured only.

**Section 5 (ii) arithmetic. Confirmed.** `d/dx log|U_P| = -[log(t/2 pi) - 2 Re sum log p/(p^{1/2+it} - 1)]` at
`x = 0`; thresholds 3590.9 (`{2,3}`) and 4.85e4 (`{2,3,5}`); largest admitted prime 3 at `t = 1e4` and 37 at
`t = 1e12`.

## 2. Errors and gaps

1. **Wrong value in Section 2, bullet "m holomorphic and inner" (error; conclusion unaffected).** The note states
   `int F_P m dHaar = m((p^{-1/2})_p)`. With `F_P = sum f_n n^{-1/2} w^n` and `m` holomorphic, only the constant
   term survives: `int F_P m = m(0)`. The value `m((p^{-1/2})_p)` is `int conj(F_P) m` (Szego kernel), which is not
   the quantity in Lemma 2. Referee run (`ref_b.py`, zeta, `t_0 = 4000`, `delta = 3e-4`, 0 wrong-orientation
   crossings): `m = w_2`: measured 0.99952 (Lemma 2 formula: 1; the bullet: 1.7071); `m = w_2^2`: 0.99978
   (formula 1; bullet 1.5); `m = conj(w_2)`: 1.70617 (formula 1.70711). The formula of Lemma 2 is supported; the
   bullet is not. `|m(0)| <= 1`, so "sign forced" in that subclass stands.
2. **Lemma 1 with constant density is a known mean value, not cited.** For `rho = 1` the statement is the mean of
   `F(1/2 + i(2 pi k - theta)/log p_b)` over a vertical arithmetic progression, with limit
   `(1 - p_b^{-1/2} e^{i theta})^{-1}` for zeta. Mean values of zeta on arithmetic progressions with common
   difference `2 pi l/log m` are in the literature (Steuding-Wegert; Ozbek-Steuding; Li-Radziwill for the critical
   line). References were not looked up in this pass; the note should cite them and present Lemma 1 as the
   weighted (twisted) form. The identification of the bracket with `a_1 + conj(Pi_int h(1/2))` and the loss of
   Harnack is the part specific to the note.
3. **Lemma 2 and Proposition 3 are ARGUED.** Labelled as such. The non-stationary-phase step is stated for
   frequencies `|log n| <= (1/2) log(t/2 pi)` and ignores the frequencies of `m^k`; for non-polynomial `m`
   (`-conj(F_P)/|F_P|`) and large `|k|` these are unbounded and the uniformity in `k` is not addressed. The
   numerical support (author: three `m`, two prime sets, zeta and DH; referee: three monomials) is at the 0.001 to
   0.015 level with float64 pole location.
4. **Summary item 3 overstates the range.** "`1 - ||F_P||_1 < 0` for every nonempty `P` and every `F`" requires
   `F_P` zero-free on the torus for `m` to be continuous. For DH this fails from three primes (`min |D_P| = 0` on
   `{2,3,7}`). The body of Section 2 has the condition; the verdict paragraph does not.
5. **Proposition 3 (a) for DH** depends on the unproved codimension-2 statement (noted by the author). For
   `{2}` and `{2,3}` it is not needed (`D_P` has no zero).
6. **Run A2** certifies the finite sums, not the limit. The difference from the prediction is 0.024 - 0.010 i at
   `delta = 3e-6` and `(S - S_P)/S_1` has not settled (-0.034 + 0.018 i). The sign conclusion (real part -0.48) is
   outside that scale. The density is Poisson, so this run supports the measured extension, not the proved case.
7. **Section 5 (i) density** is a sketch (far mass handled in one sentence). It is used only to say that the
   measure formulation carries no information; nothing rests on it.

## 3. Controls

No zeta-only mechanism is claimed. Checked by the referee for DH: Lemma 1 (table above, holds), sign rule
(`min Re D_P` as stated), `||D_P||_1 > 1`. The product form of `E_P` enters only in the closed-form `arcsin`
criterion; the outcome is the same for DH. Agreed: no statement fails for DH at a structural step.

## 4. RH, verified height, known theorems

Nothing assumes RH. No use of verified height. Gram-point mean 2 is attributed to Titchmarsh. See item 2 for the
missing attribution in Lemma 1.

## 5. Requirement flags (referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Every statement holds for DH; multiplicativity enters only in the `arcsin` criterion and in the `q^{-i gamma}` twist formula. |
| R2 | false | Abel means; shell contractivity is height-coupled. |
| R3 | false | No control fails. |
| R4 | false | Limit step void (measure form) or equal to the `Q*(t)` reserve bound (formula form). |

## 6. What survives

For positive-real lossless sections with poles on an arithmetic progression `(2 pi k - theta_b)/log p_b` and
trigonometric-polynomial weights in the other prime angles, the Abel first moment of `F` is `2 int F_P dmu/(2 pi
delta) + O(delta^{-1/2})` (proved; confirmed by an independent run for zeta and DH); its real part has no forced
sign once `min Re F_P < 0` on the torus (zeta: `sum arcsin p^{-1/2} > pi/2`; DH: from `{2,3,7}`). For
gamma-coupled sections the mean `1 + conj(int F_P m)` is argued and measured, with the correction that for
holomorphic inner `m` the value is `1 + conj(m(0))`. No forced sign for zeta or DH; no handle against any control;
the limit step is not closed.
