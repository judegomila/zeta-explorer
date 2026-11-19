# c7-probe-format-h-cap: is h <= 1 a theorem about the Proposition 2.1 format

Internal working note, 2026-11-18. Slug `c7-probe-format-h-cap`. Kind: deepen. Not refereed. Nothing committed, pushed
or posted. Files: `cap_lp.py` + `cap_lp.log`, `cap_dir.py` + `cap_dir.log` (exact rational LP by vertex enumeration,
python stdlib, two local runs through `scripts/memcap.sh 8`, 4 s and 1 s). The compute server was not used.

Every abscissa below is the value of a hypothetical ESTIMATE SYSTEM, relative to the unrefereed sources (openai/math
manuscript "MS"; Liu II) as transcribed in `r3-method-limit` section 1. None is a zero-free region. No statement
about any zero is made. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / EXACT (rational LP; CONFIRMED = feasible at the value,
infeasible 1e-9 below) / LP (bisection) / MODEL / ARGUED / OPEN.

## Verdict

**Precise obstruction. CAP is false as a statement about the parameter h and true as a statement about the
abscissa; the hypothesis it needs is named.**

1. **CAP as worded fails.** h = 1 + l - lx is a geometry parameter and h > 1 is admissible in the format (lx < l).
   Nothing in "square-root-normalised rows + duality" bounds h itself. The only format-level bound on h is the
   consistency bound h <= r/2 (Lemma C).
2. **Effective cap (Theorem K; PROVED scalar identity, EXACT LP).** For every geometry lx, ly, l >= 0, with no
   hypothesis lx >= l, three inputs give

       B >= 1 - 1/r + lx/(2r),     i.e.  h_eff := r(1 - B) <= 1 - lx/2:

   (S) the signal exponent s - 1 + lx/2 + h/r; (K) the low estimate of the reflected rows is an operator-norm
   (large-sieve) bound, which by the Hilbert-Schmidt lower bound cannot be below
   Z^{lx/2 + max(0, M + l - 1)/2} (Lemma HS, PROVED); (H0) the floor-class bound of the high side. The J-loss, the
   P-loss, the polar term, the compensation geometry and the density class are not used. This removes the modelling
   hypothesis "lx >= l" from row Z15 and replaces it by (K) + (H0).
3. **Unreflected rows (Lemma A; linear algebra PROVED, size of the aligned probe ARGUED).** A low estimate that is
   blind to the phases of the target coefficients holds for the sign-twisted target with a pole at s = 1, so it has
   B >= 1. Consequence: in the region where the reduced system was inconsistent (unreflected rows, G = 0, h up to
   4.5) the false input is "G = 0": a Gram excess of A of size at least h/r - k_dir/2 is forced, and the polar term
   b/(2r) equals that forced size exactly on the line M = 2 + 2l (`cap_dir.log`). The Gram matrix of A is not
   diagonally dominated there, for every target.
4. **The escaping hypothesis (single item for STRATEGY 4.0).** A vertex below 1 - 1/r needs a low estimate that is
   not an operator norm: the mean square of the reflected marked rows for the specific theta coefficient vector,
   Sum_m |B_m|^2 << Q^{1+eps}, in the range dual length > number of rows (Q P > Z). With that alone the reduced
   system gives 7/9 at h = 4/3 (r = 6); with the J- and P-losses also absent it has no floor (inconsistent), and
   the manuscript-level limit is then 2/3 (normaliser, `c6-marks-bc-manuscript-check`). Alternative: beat (H0)
   (cancellation over the non-principal rows u), which alone gives 1 - 2/r.
5. **Target independence.** (S)-shape, Lemma HS, Lemma A and (H0) use no property of the target beyond
   |coefficients| <= 1. The cap holds for THIN, U, DH unchanged. It is a statement about the device.

ORDER-2 is not closed as a theorem (the cap rests on MODEL transcriptions outside lx >= l), but its content is now
one statement: the vector-specific mean square (E-K) in the range Q P > Z.

---

## 0. Plan; relation to closed rows

Read: BRIEF to the end; STRATEGY 4.0; OBSTRUCTION_MAP rows Z15, Z15b and controls; RESULT of `r3-method-limit`
(all), `c5-target-fe-order2-ledger` (all), `c6-pair-probe-bridge-order2` (verdict, sections 1-2),
`c6-marks-bc-manuscript-check` (verdict, sections 1-2), REFEREE2 of c5 (Lemma U); `tiers.py`.

Already known: Theorem 1 of r3 (B >= 1 - 1/r under lx >= l, a modelling hypothesis); the identity for 13/15 (uses
polar, K, H0); c5 (D) (unreflected rows with the polar term: B >= 1); Z15b (h > 1 vertices appear when K, or K and
P, are deleted; 7/9 at h = 4/3).

New here: (i) Theorem K: the 1 - 1/r cap without lx >= l, from K and H0 only, with the exact weights for every r and
both versions of the high side; (ii) Lemma HS: the K-loss is a lower bound for every operator-norm estimate, so it
is not an artifact inside duality; (iii) Lemma A and the identification of the false input in the inconsistent
region; (iv) the dependence on the degree d of the row functional equation; (v) the list of escaping hypotheses with
the value each one buys.

## 1. First lemma: h as a ratio, and the two lower bounds for a duality estimate

Format (r3 section 1). J = Q^{-1/2} Sum_{m ~ Q} A_m B_m, Q = XY = Z^M, B = T beta with T the row operator
(T beta)_m = Sum_n beta_n chi_n(m), columns n of length N = Z P = Z^{1+l}, ||beta||^2 ~ 1 (beta_n ~ n^{-1/2}),
||A||^2 ~ Q/Y. Signal: Z^{s - 1 + lx/2 + h/r} H(s)/L(s, eta), Z^h = Y N / Q = N/X the frequency length after Poisson
in m. The square-root level is X^{1/2} = Q^{-1/2} (Q/Y)^{1/2} Q^{1/2}.

**Ratio form [definition].** Let S_1 = X^{1/2} Z^{h/r} be the signal at s = 1 (size of the coherent term with no
cancellation in the target variable) and D = Q^{-1/2} ||A|| ||T'|| ||beta'|| the duality bound in a chosen
representation (T', beta') of the rows. Then

    B = 1 - log(S_1 / D) / log Z,       h/r = log(S_1 / X^{1/2}) / log Z.

So B < 1 iff the duality bound is below the aligned coherent term, and h measures the coherent term against the
diagonal.

**Lemma C (consistency) [PROVED-rel Prop. 2.1 and existence of zeros on the line].** If the high comparison holds
and the low estimate is a true bound at exponent lx/2, then h <= r/2. Proof: Prop. 2.1 gives beta* <= 1 - h/r and
beta* >= 1/2. This is the only bound on h that follows from the format alone.

**Lemma HS [PROVED].** Let T' be a Q x D matrix whose entries have modulus 1 on a proportion >= c of positions
(characters, zero at non-coprime pairs). Then ||T'||^2 >= ||T'||_HS^2 / min(Q, D) >= c max(Q, D). Hence every low
estimate of the form |J| <= Q^{-1/2} ||A|| ||T'|| ||beta'|| with ||beta'|| ~ 1 has exponent
>= lx/2 + max(0, d' - M)/2, where Z^{d'} = D is the column length of the representation used:
- unreflected rows: d' = 1 + l, loss >= max(0, 1 + l - M)/2;
- reflected rows (MS Prop. 5.1, dual length conductor^2/length = (Q P)^2/(Z P), exponent T = 2M + l - 1):
  loss >= max(0, M + l - 1)/2. This is the K-branch of Liu II Lemma 2.4. **The K-loss is forced for every
  operator-norm estimate of the reflected rows**; it can be absent only in an estimate that uses the specific
  coefficient vector.
Proof: the largest singular value squared is at least the mean of the squared singular values. QED

**Lemma A (alignment) [linear algebra PROVED; size of the aligned probe ARGUED-rel MS Lemma 7.1].** Suppose the low
estimate |J(beta)| << Z^E is proved by an inequality that depends on beta only through (|beta_n|) (Cauchy-Schwarz and
a large sieve in the variable that carries the target). Then it holds for every beta' with |beta'_n| = |beta_n|, in
particular for the target eta' = eta eps with eps completely multiplicative, unimodular, eps(p) = -conj(eta)(p).
For eta' the reciprocal 1/L(s, eta') is Sum mu^2(a) Na^{-s} = zeta_F(s)/zeta_F(2s), with a pole at s = 1; the
principal-row identity uses only complete multiplicativity and |eta(p)| = 1 (c6-marks Lemma H; its Liouville control
states the signal c Z^{C(1)} + O(Z^{C(1/2)+eps})). If the non-principal rows for eta' are below the principal term
(exponent H0 < 1; ARGUED: their reciprocals L(s, chi_u)/L(2s, chi_u^2) are holomorphic on Re s > 1/2), then
|J(beta')| ~ Z^{C(1)} and so E >= C(1), i.e. **B >= 1**.
This is the sign-twist control stated inside the format. It gives the format-level reason for c5 statement (D), and
it holds for any order r and any large sieve.

**Reduction of an arbitrary probe.** (a) Lemma U (c5, two referees): the constant c, hence h, is an invariant of the
probe; a re-expression changes only which representation (T', beta') the duality bound uses, and Lemmas HS and A
bound every such choice. (b) Degree-one homogeneity (c6 Lemma H; algebra PROVED, inputs MODEL): the probe of degree k
in the target at (lx, ly, l_1..l_k) has the system of the linear probe at (lx/k, ly/k, (l_1+..+l_k)/k). Theorem K
then reads B >= 1 - 1/r + lx/(2rk) >= 1 - 1/r for it.

## 2. Theorem K

Notation: h = 1 + l - lx, M = lx + ly.

    L'  = 1 - h/r                                   (square-root level, G >= 0)
    L_K = L' + (M + l - 1)/2                        (Lemma HS on the reflected side)
    H0  = 1/2 - ly/2 + h(1 - 1/r) - l/2             (floor class; compensated form of r3)
    H0' = 1/2 - ly/2 + h(1 - 1/r)                   (uncompensated form)

**Theorem K [PROVED: identity in (lx, ly, l); relative to (S), (K), (H0) as inputs].** If B >= L', B >= L_K and
B >= H0 then B >= 1 - 1/r + lx/(2r). With H0' in place of H0, B >= 1 - 1/r + 2lx/(3r).
Proof.
    ((r-2)/r) L' + (1/r) L_K + (1/r) H0  = 1 - 1/r + lx/(2r),
    (1 - 4/(3r)) L' + (2/(3r)) L_K + (2/(3r)) H0' = 1 - 1/r + 2lx/(3r),
identically; the weights are non-negative for r >= 2 and sum to 1. QED
(`cap_lp.log` I: both identities at 2000 random rational points for r = 2, 3, 4, 5, 6, 8, 12.)

Attainment and necessity (`cap_lp.log` III-V; r = 6 unless stated):

| run (free geometry, G = 0) | infimum | point (lx, ly, l) | h |
|---|---|---|---|
| K, H0 (boxes 4, 8, 16; both high sides) | 5/6 CONFIRMED | (0, 1, 0) | 1 |
| same, r = 2, 3, 4, 5, 8, 12 | 1 - 1/r CONFIRMED | (0, 1, 0) | 1 |
| restricted to lx <= l (h >= 1) | 5/6 CONFIRMED | (0, 1, 0) | 1 |
| lx <= l, polar term kept | 8/9 (LP) | (1/9, 7/9, 1/9) | 1 |
| lx <= l, source G, k = J, K, P | 0.91228 (LP) | (5/19, 11/19, 5/19) | 1 |
| K removed, J and P kept | 7/9 (LP) | (0, 4/3, 1/3) | 4/3 |
| K, J, P removed | 0.25 = search bound | | 4.5 |
| K kept, H0 removed | 2/3 (LP) | (0, 0, 1) | 2 |

So K and H0 are each necessary and together sufficient for the cap; with both present the best point has no marks
(l = 0) and h = 1 exactly. In the region h >= 1 the full source ledger gives 0.912, above the present 0.8749.

Degree of the row functional equation [MODEL]. If the dual length is (Q P)^d/(Z P) (d = 2 for the cubic theta rows),
the K-branch is (d-1)(M + l) - 1 and the same argument gives B >= 1 - d/(2r(d-1)) + lx/(2r) (`cap_lp.log` I). For
d >= 3 the exact LP infimum is higher (r = 6: 11/12 at d = 3). The value 1/2 occurs only at (r, d) = (2, 2). d = 1
(a row with a Poisson-type dual, length Q/Z < Q) has no K-branch and no cap from this argument; by
`c5-angular-family-absorption` no abelian family absorbs mu, so no such row is available.

## 3. Decisive test

(a) Three known systems (`cap_lp.log` II, VII). Regression: 13/15, 31/36, 5/6 CONFIRMED in source geometry.
- 13/15 at (2/5, 2/5, 1/5): the cap 5/6 + lx/12 equals 13/15. Theorem K is tight at the present low floor: there
  L' = L_K = H0 = 13/15 (M + l = 1, b = 0).
- 31/36 at (1/2, 1/2, 1/3) and 5/6 at (1/2, 1/2, 1/2): both lie below 5/6 + lx/12 = 7/8. They are the tiers with the
  K-loss deleted (M + l = 4/3, 3/2 > 1). So they are not operator-norm estimates (Lemma HS): they exist only under
  (E-K) below. With (E-K) they respect r3 Theorem 1 through lx >= l.
- MS geometry (17/48, 23/48, 1/6) (solved from h = 13/16, b = 1/8, M + l = 1; lx/2 + b/12 = 3/16 as in MS (15.6)), value 7/8: cap 497/576 = 0.863 <= 7/8. Consistent.
CAP in the effective form survives the test for every system that keeps K; the two systems below it name the
hypothesis.

(b) Region lx < l. Reflected branch: Theorem K gives >= 5/6 there (table, row 3); h > 1 vertices need K deleted
(7/9 at h = 4/3, as in Z15b). Unreflected branch (`cap_dir.log`): with the polar term B = 1 CONFIRMED in free
geometry (boxes 8, 16, with and without the high side); with G = 0 it falls to 1/3 at (0, 8, 3), h = 4, and to the
search bound in box 16. By Lemma A an unreflected estimate has B >= 1, so in that region

    G >= h/r - k_dir/2     (forced Gram excess of A).

At (0, 8, 3) and (0, 4, 1) the forced excess is 2/3 and 1/3, equal to the polar term b/12. In general
h/r - b/(2r) = (2 + 2l - M)/(2r) and k_dir >= (2 + 2l - M)/3, so polar >= forced for r >= 3 with equality on
M = 2 + 2l (complete rows). **The false input of the inconsistent region is G = 0** (TRO6 with eta = 1 and the polar
term dropped, extended to b > 0 at those lengths); the polar term is the aligned coherent term of Lemma A. This
answers STRATEGY 4.0 bullet 3 for the unreflected branch [ARGUED: relative to Lemma A's aligned-probe size and to
Lemma 9.1 applied to the marked columns]. On the reflected branch with K, J, P all deleted the system is still
inconsistent; there the false input is among {the deletions, (S) at lx < l, H0 at h > 1} and by Lemma HS the
deletion of K is false for any operator-norm estimate.

## 4. The hypothesis CAP needs, and what would escape it

Statement proved: **every probe in the format whose low estimate is an operator-norm (large-sieve) bound for some
representation of the rows, with the floor-class high bound, has B >= 1 - 1/r.** Unreflected representation:
B >= 1 (Lemma A). Reflected: Theorem K. Empty dual (T <= 0): H0 >= 4/3 - 5M/6 >= 11/12 (c5 (E), no geometry
hypothesis used).

Escapes, each a named input:

- **(E-K) Vector-specific row mean square.** Sum_{m ~ Q} |B_m|^2 << Q^{1+eps} for the completed marked cubic-theta
  rows when Q P > Z (dual longer than the row set), for the theta coefficient vector itself. Not an operator bound;
  it says the theta vector is far from the top singular vectors of the reflected operator. Buys, in the reduced
  system: 31/36 with lx >= l; 7/9 at h = 4/3 in free geometry; nothing below while J and P stand. Decidable
  numerically at moderate size (STRATEGY 4.0 item 3, tools `tmp/sextic`). Risk recorded by r3 (RECALLED, not opened):
  Dunn-Radziwill sharpness of the cubic large sieve is obtained with theta-type vectors.
- **(E-H) Below the floor class.** Cancellation in the sum over non-principal rows u beyond the trivial count. Buys
  1 - 2/r (2/3 for r = 6, at h = 2) with K kept.
- **(E-S) Below the square-root level** (r3 Theorem 3(a)): not a norm statement.
- **(E-d) A row object of degree 1** with mu absorbed: closed by the angular lane.

Manuscript-level ceiling for all of them: Prop. 2.1 cannot be applied below 2/3 for the sextic probe (zeros of the
normaliser, c6-marks). So inside the sextic architecture the reachable set is [2/3, 5/6) and needs (E-K) with (E-H)
or with the J- and P-losses also vector-specific. The line h = r/2 is outside it.

Arithmetic input that would supply (E-K): an evaluation of the second moment of twisted cubic theta coefficients
over twists m ~ Q beyond the range of the approximate functional equation (a spectral or period formula for
Sum_m |B_m|^2), not a sieve inequality.

## 5. Controls

No statement about zeros is made; nothing has to fail. Where each control sits:
- **Target independence (required by the assignment).** Lemma HS: entries of T' only. Lemma A: |beta_n| only.
  Theorem K: three exponents with no target data. H0: trivial count. Hence the cap holds verbatim for U (unimodular
  twist), DH (finite linear combination; low side linear) and THIN.
- **Sign twists, THIN.** No reflection (weight not periodic), so only the unreflected representation: B >= 1 by
  Lemma A. Lemma A is this control turned into a lemma.
- **DH.** Low side by linearity, same cap. DH fails in the base method at the scalar Euler identity (MS Lemma 7.1),
  not here.
- **E_a.** |local parameter| != 1; every exponent shifts by a (row Z18); cap reads 1 - 1/r + a.
- Backward heat, T-NR, Beurling, phase-rotated transfer operator, theta^w: not applicable (no positivity or zero
  statement).

## 6. Requirement flags (for this lane's result)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Theorem K and Lemma HS use no Euler product; Lemma A uses a completely multiplicative twist only to build a control |
| R2 height-uniform, every window | false | no conclusion about zeros |
| R3 controls fail structurally | false | the cap is target-independent by construction (section 5) |
| R4 reaches the critical line | false | result is a cap at 1 - 1/r; 1/2 only at (r, d) = (2, 2), where absorption returns the principal character |

## 7. Three weakest steps

1. **Inputs outside their proved range.** (S), H0 and the reflected-row description are the r3 transcription; at
   lx < l none has a numbered source (c6-marks table: lines 5, 10, 11, 12). Theorem K is an identity given the three
   inequalities; whether B >= H0 (or H0') is the right high-side condition at h > 1 is MODEL. Both versions give
   the same cap, which is the only robustness check made.
2. **"Operator norm" is a hypothesis on the proof, read not replayed.** Lemma HS bounds any estimate of the form
   ||T'|| ||beta'||. That the K-branch of MS Lemma 15.1 / Liu II Lemma 2.4 is of this form, that the reflected
   coefficients have ||beta'|| ~ 1, and that the reflected matrix has entries of modulus about 1 on a positive
   proportion, are taken from c5 section 1 (formulas read, proofs not replayed). The lemma says nothing about the
   true size of Sum |B_m|^2 for the theta vector; that is (E-K), OPEN.
3. **Lemma A's aligned probe.** The principal term for the twist eps is from c6-marks (Liouville control); the bound
   for the non-principal rows of the twisted target is ARGUED, and the use of Lemma 9.1 (squarefree columns) for
   marked columns A = c n^3 is MODEL. The identification "false input = G = 0" inherits both. Orders r != 6 and
   degrees d != 2 are transplants.

## 8. Proposed map row (not applied)

| Z15c | Cap without lx >= l | For all lx, ly, l >= 0: square-root level + K-branch + floor-class bound H0 give B >= 1 - 1/r + lx/(2r) (identity with weights (r-2)/r, 1/r, 1/r); tight at the 13/15 point. K-branch is forced for any operator-norm bound of the reflected rows (Hilbert-Schmidt). Phase-blind (unreflected) estimates have B >= 1 (alignment with the eps-twisted target); the polar term b/(2r) equals the forced Gram excess on M = 2 + 2l, so "G = 0" is the false input of the inconsistent unreflected region. Below 1 - 1/r requires a vector-specific mean square of the reflected rows for Q P > Z (E-K) or cancellation over non-principal rows (E-H). | PROVED (identity, HS); EXACT LP on MODEL inputs; Lemma A size ARGUED; unrefereed | target-independent: holds for U, DH, THIN | `c7-probe-format-h-cap` |

No pivot taken. No abscissa below 0.874886647 is proved.
