# Summary of changes for run d0aa7bcb-87ea-4a84-a2e6-5abd278f365b
I formalized and fully proved the target of `job15_newton_inequality.tex` in `RequestProject/NewtonInequality.lean`. The build is clean and the file contains no `sorry`/`admit`; `newton_inequality` depends only on the standard axioms `propext`, `Classical.choice`, `Quot.sound`.

**The mandated statement, verbatim in shape:**
```lean
theorem newton_inequality {p : ℝ[X]} (hp : HasOnlyRealRoots p) {k : ℕ}
    (hk0 : 1 ≤ k) (hk : k + 1 ≤ p.natDegree) :
    (p.coeff (k - 1) / (p.natDegree.choose (k - 1) : ℝ))
        * (p.coeff (k + 1) / (p.natDegree.choose (k + 1) : ℝ))
      ≤ (p.coeff k / (p.natDegree.choose k : ℝ)) ^ 2
```
with `HasOnlyRealRoots p : Prop := Multiset.card p.roots = p.natDegree`.

**Also proved, not assumed.** The document allowed the two real-rootedness preservation results to be taken as given; instead they are proved outright here:
- `hasOnlyRealRoots_derivative` — the derivative of a real-rooted real polynomial is real-rooted;
- `hasOnlyRealRoots_iterate_derivative` — likewise for every iterated derivative.

**Proof route.** The route in the source document required an unbanked reversal operation to reach a literal quadratic. I used a different, self-contained route that avoids reversal entirely:
1. `coeff_div_choose_derivative`: differentiating multiplies all normalized coefficients by the same positive factor `n` while shifting the index by one, using `n·C(n-1,j) = (j+1)·C(n,j+1)`. This reduces every `k ≥ 2` to `k - 1`, so an induction on `k` leaves only `k = 1`.
2. `newton_low`: the index-`(0,1,2)` case in cleared-denominator form, `2·n·a₀·a₂ ≤ (n-1)·a₁²`. Instead of reversing to a quadratic, this is proved by induction on the degree, peeling off one linear factor `p = (X - r)·g` at a time. The step rests on the exact identity
   `m·((n-1)a₁² - 2n·a₀a₂) = (m·g₀ + r·g₁)² + (m+1)·r²·((m-1)g₁² - 2m·g₀g₂)`  (with `m = n - 1 = deg g`),
   whose second summand is the inductive hypothesis for `g`, scaled by a nonnegative factor. The degree-2 discriminant case is subsumed: it is just the `m = 1` instance, where `g₂ = 0`.

Zero coefficients and repeated roots are permitted throughout, exactly as the document requires, and `newton_low` needs no degree hypothesis at all.

The file also contains a checked non-vacuity example exhibiting `(X-1)(X-2)` as a polynomial satisfying the hypotheses.