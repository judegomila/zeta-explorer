# 03 anchor-hankel (stack-antibridge Thm. 4 and rule (4.1); lane is unrefereed)
Status: NO PROOF RETURNED (service declined Lean input). Statement only; typechecks with `sorry`.
- `jetCoeff` copies the lane's formula: c_{2a,2b} = 2(-1)^(a+b) mu_{a+b}, c_{2a+1,2b+1} = 2(-1)^(a+b) mu_{a+b+1}, 0 otherwise.
- `pick_pair_identity` / `pick_pair_expansion`: the one-lambda kernel and its double power series (this is where the coefficients come from; the sum over lambda is termwise and is not in the file).
- `jetMatrix_posDef_iff`, `_posSemidef_iff`: J_N vs H0_{ceil(N/2)}, H1_{floor(N/2)} for an arbitrary real sequence mu.
- `jetMatrix_first_failure`: N* = min(2 K0 - 1, 2 K1) for the JET matrix. The lane's (4.1) is about node matrices P_N for "sufficiently clustered nodes"; the divided-difference congruence from nodes to jets is NOT in the file.
