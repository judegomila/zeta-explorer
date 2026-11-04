# Independent audit of the nested all-degree matrix obstruction

2026-11-04. Analytical audit of `NESTED_ALL_DEGREE_MATRIX_OBSTRUCTION.md`. No actual-theta conclusion is asserted.

## Verdict

The construction and Section 6 pass. The response normalization is **plus perturbation, perturbed divided by unperturbed**:

    A_n(s) = the complete monic minimum for G_n + s J_n,
    a_n(s) = A_n(s) / A_n(0).

With this target definition, the stated positive slope and uniform remainder are correct.

## Direct verification of Section 6

Here is a proof independent of the referenced spectral-representation note. Fix n, use the G_n inner product, and divide the unperturbed monic minimizer by sqrt(A_n(0)) to obtain a unit vector u. Let V be the lower-degree subspace. Then u is G_n-orthogonal to V. After the same normalization, every admissible vector is u+z with z in V.

Let K be the operator representing J_n in this inner product. Section 3 proves 0 <= K <= (1/2)I uniformly in n. Write P for orthogonal projection onto V, C for the compression of K to V, and w = PKu. Then h_n = <u,Ku>, and completing the square gives exactly

    a_n(s) = 1 + s h_n - s^2 <w,(I+sC)^(-1)w>,    s > 0.

Because C >= 0 and ||w|| <= ||K|| <= 1/2,

    0 <= <w,(I+sC)^(-1)w> <= 1/4.

Consequently

    h_n - s/4 <= (a_n(s)-1)/s <= h_n,
    a_n(s) = 1 + s h_n + O(s^2),

with a degree-independent remainder constant. Section 5 establishes h_n -> 1/60. Therefore every positive sequence s_n -> 0, including (n+2)^(-2) log(n+2)^(-7/4), gives

    a_n(s_n) = 1 + s_n(1/60 + o(1)).

This verifies Section 6 as written, including the sign, normalization, and uniformity.

## Other checked points

- The inverse orientation is correct: G_n = B_n^(-1) E_n B_n^(-T), so G_n^(-1) = B_n^T E_n^(-1) B_n.
- The weighted energy estimate gives G_n >= D_n/10. The AR-Toeplitz derivative matrix obeys 0 <= J_n <= D_n/20 <= G_n/2.
- The complete selected vector is exactly psi_n - alpha_n psi_(n-2). Its derivative cross term has the stated negative sign and is retained. Its normalized derivative tends to 1/60 along all degrees.
- The product estimate and two-region argument establish the stated uniform wedge bound, including after the indicated polynomial diagonal rescaling.
- The displayed constant-coordinate second displacement is positive for p=2 and p=3. The note's lower bound d_2-L_2 >= 2^p-5/2 is sufficient, and its radical arithmetic is correct. A stronger optional bound is d_2-L_2 >= 2^p-2, since x^p-x is increasing for x>=2 and L_2>=2.

The explicit limitation is essential: this pair does not satisfy the required theta displacement identity, and does not settle the actual-theta selected response problem.
