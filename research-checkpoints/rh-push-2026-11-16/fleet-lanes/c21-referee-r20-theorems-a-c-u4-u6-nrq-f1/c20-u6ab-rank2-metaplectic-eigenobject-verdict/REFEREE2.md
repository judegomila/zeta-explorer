# REFEREE2: c20-u6ab-rank2-metaplectic-eigenobject-verdict (Lemma K; the five wording corrections)

Second referee, lane `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1`, 2026-11-20. Part 1 (Lemma K, K', and the
exponent tables) was written from `RESULT.md` only, before the lane's `REFEREE.md` was opened. Part 2 then reads
section 4 of `REFEREE.md` (the five corrections) and decides each. No numerics were needed (finite linear algebra
and exponent arithmetic). No statement about zeros of zeta.

## Verdict

**Lemma K: holds. Lemma K': holds (holomorphy is not needed). The five wording corrections of the first referee:
all five accepted; one is given a shorter derivation, one an added domain remark.** The lane's verdict (precise
obstruction; U6 (a) closed for linear groups, argued for the double cover; U6 (b) no candidate norm) stands with
the corrected labels. Flags R1 to R4 false, as in the lane.

## 1. Lemma K, re-derived (PROVED-2)

Setting: V a vector space, {T_p} commuting operators, W a subspace with T_p W in W for all p, dim V/W = k.

1. Each T_p acts on V/W. If v is a joint eigenvector with eigencharacter chi (T_p v = chi(p) v) and v is not in
   W, its class is a non-zero joint eigenvector of V/W with eigencharacter chi.
2. Joint eigenvectors with pairwise distinct eigencharacters are linearly independent (induction on the number:
   apply T_p - chi_1(p) for a p separating chi_1 from another character). Hence V/W carries at most k
   eigencharacters.
3. So every joint eigenvector of V whose eigencharacter is not one of at most k characters lies in W.
4. For the Eisenstein family: the eigencharacter p -> p^(w - 1/2) + p^(1/2 - w) determines {w, 1 - w}. Derivation
   (the lane states this without proof): put z = w - 1/2. If p^z + p^-z = p^z' + p^-z' for every prime p, then for
   each p there is a sign e_p with z' = e_p z modulo 2 pi i/log p. One sign occurs for infinitely many primes; for
   two of them, p and p', z' - e z lies in (2 pi i/log p) Z and in (2 pi i/log p') Z, whose intersection is {0}
   because log p/log p' is irrational. So z' = +- z. Two primes do not suffice in general (for special z the signs
   may differ at the two primes); three primes, two of which share a sign, do.
5. E*(., w) = E*(., 1 - w) is one vector for the pair {w, 1 - w}; it is not the zero function away from the poles.
   So W contains E*(., w) for all but at most k pairs. PROVED-2.

Domain remark (added): Lemma K is a statement about joint eigenvectors. It does not say that W meets a
generalised eigenspace (for example derivatives in w of E*) in finite codimension count k per character; the
quotient may carry Jordan blocks. This does not affect the use made of it (a Hecke-invariant subspace of finite
codimension cannot select the resonance states).

Lemma K': if T F(w) = lambda(w) F(w) with F(w) != 0 in a Banach space X and T bounded, then lambda(w) is an
eigenvalue, so abs(lambda(w)) <= spectral radius <= norm(T). One line; holomorphy of F is not used. PROVED-2.

Exponent tables of Lemmas 2 and 3 for O2 (checked by hand before reading the first referee):
x = (2/3)(Re u - 3/4) gives x = beta/3 - 1/2, (beta - 1/2)/3, beta/3 + 1/6 in the three zero cases;
mu_A square-integrable iff x < 0 (conditions x < 1/2 and 2x < 0), mu_B iff -1/2 < x < 1/2, mu_C iff x > 0;
in each zero case the surviving exponents include one that fails. Hermitian multiset: {x - 1/2, x + 1/2, -2x}
(real parts) is symmetric under negation iff x = 0 (or x = +-1/2, the trivial point), so in the case 2u = 1 + rho
iff beta = 1/2. PROVED-2. This is an identity in the parameter, as the lane says.

## 2. The five corrections of the first referee

| # | Correction | Decision | Reason |
|---|---|---|---|
| 1 | Lemma 5: the displayed factorisation L(s + w_i - conj(w_j), pi_i x dual pi_j) is not the product with non-negative coefficients; use Pi x conj(Pi) with shifts w_i + conj(w_j) | **accepted** | conj(pi_j abs^(w_j)) = dual(pi_j) abs^(conj w_j) for unitary pi_j, so L(s, Pi x conj Pi) = prod L(s + w_i + conj(w_j), pi_i x dual pi_j). Poles at real part 1 - Re(w_i + w_j) for pi_i = pi_j up to a unitary twist; the pair i = j gives P = 1 + 2 max(-Re w_i). Local poles at real part <= theta_i + theta_j - Re(w_i + w_j) <= 2 max(theta_i - Re w_i). P - beta_0 >= 1 - 2 max theta_i. Shift-independent, as claimed. Label PROVED-rel Jacquet-Shalika with the corrected display |
| 2 | "O3 is the lowest-rank linear non-Borel object in which zeta in the strip occurs" is false as worded (O2) | **accepted** | The lane's own O2 carries xi*(2u - 1) with 2u - 1 in the strip. Wording: "lowest rank with cuspidal datum on the Levi". (O2 has cuspidal support on the Borel, which is presumably what the lane meant.) |
| 3 | Table row E_a over-labelled | **accepted** | With f replaced by E(., 1/2 + a): M(z) = xi*(z + a) xi*(z - a)/(xi*(1 + z + a) xi*(1 + z - a)). In Re z > 0 the numerator has poles at z = a, 1 - a, 1 + a and the denominator a pole at z = a (from xi*(1 + z - a) at argument 1), so M has poles at 1 - a and 1 + a: step S3 as worded is not met. The datum is not square-integrable, so the cuspidal inner product formula does not apply. Label ARGUED |
| 4 | Rows T-NR and ZQ are relative to D9 Theorem C | **accepted** | Neither the lane nor either referee re-derived D9 Theorem C. Label PROVED-rel D9 for both |
| 5 | Lemma 2 for O1, O3 and the O3 inner product formula rest on recalled Langlands-Shahidi formulas; label stays PROVED-rel | **accepted** | Not opened by this pass either. The sign of the cross term matters for (I); two arguments (Gindikin-Karpelevich for the unramified vector; non-negativity of a truncated norm) fix it without a source, which is a consistency argument, not a derivation |

## 3. Labels after this pass

- Lemma K, K': PROVED-2. Lemma 2 (O2), Lemma 3: PROVED-2. Lemma 1: PROVED-rel the recalled formulas (unchanged).
- Lemma 4: PROVED-rel Langlands' inner product formula and D9 Theorems B, C (unchanged; not re-derived here).
- Lemma 5: PROVED-rel Jacquet-Shalika with correction 1.
- Stage A table: EIS-w PROVED; E_a ARGUED (correction 3); BLS PROVED-rel D9; T-NR, ZQ PROVED-rel D9 (correction 4);
  DEL, THIN, sign twists, U: PROVED (step S2, functional equation); HQ2: PROVED (S3); DH: CLASSICAL.
- O4 (double cover): ARGUED, unchanged. Section 3.4 (truncated norm of O2 at 2u = 1 + rho): OPEN, inherits D10.

## 4. Three weakest steps

1. Section 3.4: the truncated norm of the degenerate P_(2,1) object at 2u = 1 + rho is not derived. It is the only
   place in the lane where a zero gives a parameter on the unitary axis exactly when beta = 1/2. Closed only by
   reference to D10 (tried, not closed).
2. The double cover half (O4) is recalled or argued from rank one; neither the constant term formula for general
   parabolics nor the Whittaker coefficients of the theta-datum series were opened.
3. Cell (b): Lemma K and K' are sound, but the reduction "no candidate norm" is a statement about the classes
   examined, not a classification; Lemma K says nothing about subspaces of infinite codimension defined without
   reference to the zeros.
