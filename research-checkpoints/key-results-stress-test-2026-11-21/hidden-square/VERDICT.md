# VERDICT: hidden-square

Claim as listed: "Hidden-square program (sections 25-27) and the reduction of seven-plus paper conjectures to the single statement ||V_{a,Phi}|| <= 1."

Verification: refuted as worded. Status label: withdrawn or wrong. The repository itself records the refutation (2026-06-17 module, 2026-09-22 memory correction, 2026-11-16 lane); this replay agrees with it and adds one further defect in the section 25-26 decomposition.

## What is established
1. Conjectures 16.4, 16.6, 17.3, 25.2 of the draft are each restatements of "K_a >= 0 for every a > 0", i.e. E_a(z) = xi(1/2 + a - iz) is Hermite-Biehler for every a > 0, which is equivalent to RH. This is classical (de Branges 1968; Lagarias 2005; Suzuki arXiv:1204.1827). No new reduction.
2. Lemma 26.1 (|S| <= P) and Prop 26.2 (shear form bounded by a positive measure nu) are correct elementary inequalities. The total-mass ratio mu_diag/nu = 15.70, 15.73, 15.82 at a = 0.1, 0.5, 1.0 reproduces the paper's "about 15.7".
3. For the L^2[0,inf) operator (V f)(t) = int_0^t Phi(t)Phi(s) sinh(a(t-s)) f(s) ds with the repo's Phi: G/2 <= ||V|| <= G, G = sqrt(E+E- - I^2)/2; ||V|| <= 1 holds exactly for a <= a*, 31.6213 < a* < 31.6214 (in the repo normalisation, where the transform of Phi is xi(1/2 + iw/2)/4; a here is twice the paper's a). Replayed: G(31.6213) = 0.9999866069, test-pair quotient at 31.6214 = 1.0000044194, Nystrom norms 0.99998158 / 1.00000928.

## What is not established / is false
1. "||V_{a,Phi}|| <= 1 for every a > 0" is false (a > 31.6214).
2. "||V|| <= 1 <=> K_a >= 0" is false in both directions. ||V|| is degree 2 in Phi, K_a >= 0 is scale invariant. Replayed counterexamples: Gaussian kernel scaled by 5 has ||V_0.3|| = 1.40 with K_0.3 PSD; a kernel with zeros at +-3+-i scaled by 0.052 has ||V_0.3|| = 0.5 with K_0.3 indefinite.
3. The norm does not distinguish zeta. Davenport-Heilbronn kernel (even, positive, off-line zero at w = 171.3987 + 0.6170 i): ||V|| = 0.012 .. 0.074 for a in [0.1, 0.6] while K_a(z0,z0) < 0 on that whole band. Sign-flipping Phi beyond t0 leaves ||V|| unchanged to 12 digits and creates an imaginary zero (33.3099 i for t0 = 0.3).
4. The "factor 5000 below saturation in 60+ rows" is the size of Phi^2 (||V|| = 4.576e-4 at a = 0.5); multiplying Phi by 46.75 gives ||V|| = 1. It is not evidence.
5. Section 25-26 chain. K_a = main + shear (verified to 1e-15), Prop 26.2 bounds shear. The complement `main` is not the 1-D diagonal channel K_diag and is not positive semidefinite (min eigenvalue -2.5e-8 .. -1.1e-6 on two point sets, six values of a; roundoff is 1e-21). K - K_diag is negative semidefinite on the same samples and ||K_diag|| is about 3.1-3.3 ||K||. Hence mu_diag >= nu, even if true, would not give K_a >= 0, and the statement "K_a = K_a^diag + shear with K_a^diag the u = v part" in the app data is incorrect (u = v has measure zero in the double integral).
6. Conjectures 26.3, 26.4, 27.2 as written in the draft refer to an unconstructed measure mu^pass and an unconstructed "endpoint-renormalized passive norm"; they are not well-defined statements. The repo's later degree-0 replacement (||R|| <= 1, or Hankel domination b_a >= 0) is by its own account a restatement of K_a >= 0, i.e. RH-equivalent; not re-derived here.
7. No Lean statement, no certificate for the positive claim. The only certificate (Arb, 2026-11-16 lane) certifies the threshold a*, i.e. the negative result.

## Weaker true statement for a public page
"Sections 25-27 of the draft propose proving positivity of the shifted de Branges kernel K_a by bounding a 'shear' term with a Volterra operator. The proposed criterion ||V_{a,Phi}|| <= 1 was found to be neither equivalent to K_a >= 0 nor informative about zeros: it is true for a <= 31.62 and false above, depends on Phi only through Phi^2 and its scale, and holds equally for the Davenport-Heilbronn kernel. The conjectures it was meant to unify are classical restatements of RH."

## Scores
Arbitrariness 5. The truth of the headline inequality is set by the scalar normalisation of Phi (c^2 scaling) and by the unit of a (factor 2 between page and kernel); the L^2 norm is the repo's choice in place of an undefined norm in the draft; the 5000x margin is the scale.
Importance 1. No consequence for RH, for Lambda, or for excluding a method class beyond this specific operator. The negative result (norm blind to sign pattern and to DH) is a correct internal obstruction note; a specialist would regard it as immediate from homogeneity.

## Literature
Known: K_a >= 0 iff E_a Hermite-Biehler (de Branges 1968, Thm 23); xi(1/2 + h - iz) structure functions (Lagarias, Acta Arith. 120 (2005); de Branges 1986 for h = 1/2); Hankel-operator forms of the HB condition and canonical systems for xi(1/2 - omega - iz)/xi(1/2 + omega - iz), proven for omega > 1 (Suzuki, arXiv:1204.1827; Burnol 2004, 2006); block positivity iff contraction (Bhatia). Not found: the specific operator V_{a,Phi}; three web searches only.

## Files
replay.py/.out, controls.py/.out, decomp.py/.out, decomp2.py/.out, NOTES.md in this folder.
