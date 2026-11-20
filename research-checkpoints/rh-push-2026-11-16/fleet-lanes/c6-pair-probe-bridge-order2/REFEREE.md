# REFEREE (general lens): c6-pair-probe-bridge-order2

2026-11-18. Adversarial referee. Scripts kept outside the lane (`/tmp/ref_c6/chk.py`, `lp2.py`, `v3.py`), run
locally through `scripts/memcap.sh 8`; compute server not used. Only this file was written.

## Verdict

**Core holds (precise obstruction), with one classification statement to correct.** Lemma P (a), (b), (c) and the
algebra of Lemma H were re-derived and are correct. The exact LP values 13/15, 31/36, 5/6 reproduce. The sentence
"h_pair > 1 appears only with range losses deleted / with at least the K-loss and the Gram excess deleted"
(verdict statement 3 and section 3 "Answer to the test") is false; counterexamples below. The correction does not
change the verdict: with the full source ledger no point with h_pair >= 1 reaches 13/15, and in the compensated
pair geometry h_pair <= 1 by definition. Everything numerical is the abscissa of a MODEL estimate system on
unrefereed inputs. No statement about zeros of zeta is made or supported.

## 1. PROVED steps re-derived

**Lemma P(a): confirmed.** |f f'| <= |J2| + |J2 - f f'| << Z^max(E, 2 beta* + c2 - 2 sigma). For eta' = eta,
|f f'| = |f|^2. For eta' = conj eta, f_{conj eta}(Z) = conj f_eta(Z) follows from (2.3) of the manuscript
(the line Re s = 2 is conjugation-symmetric, L(conj s, conj eta) = conj L(s, eta), the Gaussian is real on the real
axis) provided H_{conj eta}(s) = conj H_eta(conj s); the result states this condition. Taking a square root gives
|f| << Z^max(E/2, beta* + c2/2 - sigma). With E/2 = C(sigma0) + omega and c = c2/2 this is the bound (2.6) with
eps* = min(Delta0 - omega, sigma); the remaining part of the proof of Proposition 2.1 uses only (2.6) and the
decay at Z -> 0, and runs unchanged. Two remarks, not errors:
- (2.6) is a derived bound in the manuscript, not a hypothesis; the result calls it "hypothesis (2.6)".
- "Proves exactly what the linear probe proves" is shown in one direction only. The converse also holds: if J
  satisfies (2.4), (2.5) then J J' satisfies the pair hypotheses, since |J J' - f f'| <= |J||J' - f'| + |f'||J - f|
  << Z^(2C(beta*) - (Delta0 - omega) - sigma). So the equivalence is correct, with changed constants.

**Lemma P(b): confirmed (elementary).** For a primitive Hecke character the functional equation maps a zero rho of
L(s, eta) to 1 - conj rho of the same L. rho + (1 - conj rho) = 1 + 2 i gamma; with eta' = conj eta the partner pole
of f' is at 1 - rho and the sum is 1. Modulus exponent 1 + c2 for every beta. The displayed modulus omits the
factors exp((rho - 5/6)^2), H(rho) and assumes simple zeros; these change the coefficient, not the exponent. The
statement is about a formal residue expansion and is labelled so.

**Lemma P(c): confirmed.** Prod_p (1 - eta(p)(1 + Np^d) Np^-s) divided by Prod_p (1 - eta(p)Np^-s)(1 - eta(p)Np^(d-s))
is Prod_p (1 + O(Np^(d - 2 sigma))), absolutely convergent for Re s > (1 + d)/2. At d = 2 beta - 1 the zero
(1 - conj rho) + d of L(s - d) coincides with rho: double zero. Remark: that double pole of the reciprocal is not
the rightmost one (rho + d = 3 beta - 1 + i gamma is further right), so its log Z factor sits under a larger power.
Consistent with "no exponent".

**Lemma H algebra: confirmed by hand and by an independent retyping.** h2/2 = h', T2/2 = T', each k-branch halves
(l - T2/4 -> l' - T'/4, T2 - M -> T' - M', (3l - 2)/2 -> (3l' - 1)/2), G halves, the high side
1/2 + d/2 - B - ly/4 + (h2/2)(5/6 - d) - l/4 + (l/2) d x is the single E(d, x) at the rescaled point.
The check is a check of typing: the pair system is the rescaled single system by construction of the model, so
0 mismatches is evidence for the algebra only, not for the product-row model (the result says inputs are MODEL).

## 2. Numeric reruns (different cases)

- Homogeneity, new seed 20261118, pair and single systems retyped as explicit max-formulas (not from the lane's
  vectors), half the points sampled near the optimum, B in [0.7, 1.1], G in {src, polar, zero}, drop in
  {none, K, KP, J, JKP}, high in {dh, grh, none}, compensation on and off: 540,000 exact comparisons, 138,698
  members; mismatches my-pair vs my-single 0, my-pair vs `pair_lp.system` 0, my-single vs `tiers_fe.system` 0.
- Headline values with box 3 instead of 8: P1 13/15, P3 31/36, P4 5/6 CONFIRMED (feasible at the value, infeasible
  1e-9 below); P1 with GRH counts and with l1 = l2: 13/15 CONFIRMED.
- New run not in the lane: minimise B subject to the added constraint h_pair >= h0, compensation on.

| ledger | geometry | h0 = 1 | h0 = 21/20 | h0 = 7/6 |
|---|---|---|---|---|
| full, G src | row or free | 0.9122807 (52/57) | 0.9289474 | 0.9678363 |
| full, G polar | row | 8/9 | 0.8961538 | 0.9529915 |
| full range losses, G = 0 | row | 5/6 | **0.8625** | 0.9305556 |
| full range losses, G = 0 | free | 5/6 | **0.85** | 0.8888889 |
| K removed, G src | row or free | **31/36** (attained at h_pair = 49/48) | 0.8702128 | 0.9263039 |
| K removed, G polar | row or free | **31/36** (attained at h_pair = 13/12) | 31/36 | 0.8650794 |
| full, G src, no compensation | row or free | 1 | 1.0333333 | 1.1111111 |

Exact membership checks (`v3.py`): (5/8, 11/8, 5/8, 1/24), h_pair = 49/48, is in the K-removed G-src row system at
B = 31/36; (1/2, 3/2, 1/2, 1/6), h_pair = 13/12, is in the K-removed G-polar row system at B = 31/36;
(1/10, 37/20, 1/10, 1/10), h_pair = 21/20, is in the full-range-loss G = 0 row system at B = 69/80 < 13/15.

## 3. Errors

**E1 (section 3 and verdict statement 3; classification of the h_pair > 1 vertices is wrong).** The result states
that h_pair > 1 occurs only "(ii) with at least the K-loss and the Gram excess deleted", and in the verdict "only
with range losses deleted". Both fail in the hypothetical row geometry (and in the free geometry):
- Gram excess deleted alone, every range loss J, K, P kept: 69/80 = 0.8625 at h_pair = 21/20, below 13/15; the
  infimum over h_pair > 1 is 5/6 (approached as h_pair -> 1+, slope 7/12 in row geometry, 1/3 in free geometry).
  No range loss is deleted.
- K-loss deleted alone, Gram excess kept in full (G src): the tier value 31/36 is attained at h_pair = 49/48 > 1.
  The optimum of that tier is not unique; the reported vertex (1, 1, 0, 2/3) with h_pair = 5/6 is one of several.
Corrected statement: with the full source ledger (J, K, P and G src) the least abscissa at h_pair >= 1 is 52/57
= 0.91228 > 13/15, and 8/9 with G polar; so no h_pair >= 1 point reaches the optimum 13/15. A point with
h_pair > 1 at or below the tier value needs ONE unsupported deletion (either K, giving a tie at 31/36, or the Gram
excess, giving values down to 5/6) together with the unsupported geometry lx < l1 + l2. This is the single-system
region lx' < l' of c5 in rescaled coordinates, as Lemma H requires, and it matches the c5 referee's corrected
statement 3. R15 (0.80556 at 7/6) needs both deletions and is not the minimal counterexample.
Effect on the verdict: none on "precise obstruction"; the obstruction is slightly weaker than stated (one deleted
input, not two or three, separates the model from h_pair > 1 in the unsupported geometry).

**E2 (minor, table of section 3).** Row "R7-R10, R12, R13 k = 0": the reported points at boxes 8 and 16 are
l1 = l2 = lx = 7, not the box; B = 1/4 is the lower search bound returned by the first feasibility call, so the
point is an arbitrary feasible vertex, not an optimum. The reading (value runs to the search bound; reduced system
inconsistent) is unaffected.

**E3 (minor, wording).** "hypothesis (2.6)": (2.6) is a consequence in the manuscript. "Stop rule met twice" relies
on the degree-one homogeneity of a model whose product-row low side (fourth moment of rows modelled as the mean
square of one row of doubled length) is not derived; the result lists this as weakest step 2. Acceptable for a
negative result only because the model is the optimistic one; that it is optimistic is ARGUED, not proved.

No other error found.

## 4. Controls

No zeta-only mechanism is claimed, so no control has to fail. Checked positions:
- DH: bilinearity gives Sum c_i c_j f_i f_j, poles at zeros of the constituents only; the remark that no bilinear
  form has the Dirichlet inverse of the sum as principal row is true for a trivial reason (the inverse of
  c_1 eta_1 + c_2 eta_2 is homogeneous of degree -1 in (c_1, c_2), a bilinear form of degree 2). Confirmed.
- THIN, unimodular twist: Lemma P(a) uses no functional equation and no Euler product beyond Proposition 2.1.
  Confirmed; so the lemma holds for the controls and distinguishes nothing.
- E_a: Lemma P(c) re-derived above; shift by a per factor. Confirmed.
- Backward heat, T-NR, Beurling, phase-rotated transfer operator, theta^w: not formulated; nothing claimed.

## 5. Other checks

- Nothing assumes RH or GRH. Runs labelled "GRH counts" are model variants of the high side, labelled as such.
- Nothing restates verified height.
- No known theorem is presented as new. Lemma P is elementary (triangle inequality, residue bookkeeping, an Euler
  product identity) and is presented as such; Lemma H is an identity between two typed models.
- The unequal-scale pivot (section 7) is ARGUED and was not run; it is labelled so.
- The abscissae are relative to unrefereed sources; the result says so in every section.

## 6. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | Lemmas P and H hold for every target admitted by Proposition 2.1, THIN included |
| R2 | false | no conclusion about zeros; height-translation invariance of |f|^2 gives no estimate |
| R3 | false | nothing is claimed that a control must break; Lemma P holds for the controls |
| R4 | false | h_pair <= 1 in the compensated geometry; full-ledger optimum 13/15; nothing reaches the critical line |

## 7. Surviving claim

A probe bilinear in the target has signal f(Z1) f'(Z2). For the same-side pair with factorised H, the pair
hypotheses are equivalent (with changed constants) to the linear hypotheses of Proposition 2.1 with halved
exponents. The functional-equation pair (rho, 1 - conj rho) contributes a term of exponent 1 + c2 for every beta.
The shifted product is the E_a scaling. In the stated model the pair system equals the single c5 system at
(lx/2, ly/2, (l1 + l2)/2) (algebra; 36,000 + 540,000 exact comparisons). With both compensations h_pair <= 1 and
the model values are 13/15, 31/36, 5/6. With the full source ledger the least value at h_pair >= 1 is 52/57 (8/9
with G polar). Points with h_pair > 1 at or below a tier value exist only for lx < l1 + l2 (no construction) and
need at least one deleted input: K alone (tie at 31/36, h_pair = 49/48) or the Gram excess alone (69/80 at
h_pair = 21/20; infimum 5/6). All values are MODEL abscissae on unrefereed inputs. No statement about zeros.
