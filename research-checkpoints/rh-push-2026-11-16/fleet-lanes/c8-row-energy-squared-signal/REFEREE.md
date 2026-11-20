# REFEREE: c8-row-energy-squared-signal (lens: derivations and manuscript quotes)

Date 2026-11-18. Object: `RESULT.md` in this directory. Claimed verdict: precise obstruction. Claimed flags: all false.

**Referee verdict: holds with corrections (E1-E8).** The Bessel/Cauchy-Schwarz statements (Lemma Z1, Theorem Z) follow
from the manuscript text as quoted. The exponent arithmetic is correct. The corrections concern: one wrong formula in
the abstract form (E1); the quantifiers of Corollary Z and three sentences derived from it that are not proved as
worded (E2, E3); two statements about the earlier notes that are stronger than what is shown (E4, E5); labels and
wording of the verdict (E6, E7); small quote and citation points (E8). The note makes no statement about zeros of
zeta, assumes neither RH nor GRH, and presents Bessel's inequality as classical.

Referee scratch files: `/tmp/ref_c8a/` (`tab.py`, `expo.py`, `bessel.py`, `recheck_copy.py`, `new.jsonl`). All runs
local, single process, through `scripts/memcap.sh 8`. No server use. No repository data module imported.

## What was re-derived

1. **Manuscript quotes, read in `paper.txt`.** Prop. 2.1 with (2.1)-(2.5) (lines 366-460); (6.1), definition of
   B_{m,sigma}, A_{m,sigma,v}, (6.2) (2733-2799); Lemma 6.1, Lemma 6.2 (2813-2958); Prop. 6.3 (2961-2990); Def. 10.1
   with (10.3) (4359-4363); (12.4), (12.5) and the text below (5181-5231); section 15.1, B^J, (15.1), (15.2)
   (6104-6141); Prop. 15.2, 15.3 (6297-6513); (16.1), (16.2) (6527-6547); (16.12), (16.13) (6797-6817).
   All quoted formulas agree with the text. C(s) = s + lx/2 - 1 + h/6 = s - 5/6 + lx/3 + l/6 with h = 1 - lx + l: checked.
   Lemma 6.2 is stated for independent Y, Q >= 1, uniform in v, with bound (Q + Y^2)/Y: as quoted.
2. **Lemma Z1.** (6.2) is derived from (6.1) by Mellin inversion in W_0 and the class decomposition; the completed
   row enters only as the function m -> B_{m,sigma}(Z). Inserting 1_{D | cn^3} and replacing Z by Z q_p changes that
   function only. The J = empty summand of (12.5) has coefficient 1, scales (X, Y), and eta(p_all) = Prod eta(p_i).
   The manuscript states the identification itself (line 6129) and uses it in the proof of Prop. 15.3 ("Its
   separation is Equation (6.2) with A_{m,sigma,v}(Y') and B^J"). Lemma Z1 is a consequence of the text. The remark
   "theta(p) = 1, so marking commutes with the theta-expansion" is not needed for the low separation (the expansion
   of G(A) holds for every A); harmless.
3. **Theorem Z.** |I_mark| <= (Q^(-1/2)/2 pi) |T| sup|Omega| Int|W0hat(iv)|dv (C (Q + Y^2)/Y)^(1/2) max_sigma E_sigma^(1/2).
   Squared and solved: max E >= c_0 (QY/(Q + Y^2)) |I_mark|^2. Direction correct. QY/(Q + Y^2) is of order min(X, Y).
   c_0 depends on the fixed data of the target, which (2.4) allows. No property of eta is used.
4. **Corollary Z as a contrapositive.** If E_sigma = O(min(X,Y) Z^(2C(sigma_0) + 2 omega)) for every target, Theorem Z
   gives (2.4) for every target; with (2.2), (2.5) Prop. 2.1 gives a contradiction. Valid, subject to E2.
   From "E << Z^(k+eps) K for all targets": k >= ksig(sigma_0) + 2 omega for all omega < beta* - sigma_0, hence
   k >= ksig(beta*). One admissible sigma_0 suffices for the full value ksig(beta*).
5. **Exponents (`expo.py`, exact rationals, 2000 random points).** min(lx, ly) + 2C(s) equals
   min(lx, ly) + 2s - 2 + lx + (1 + l - lx)/3; at lx = ly = M/2 it equals M + ksig(s), ksig(s) = (2 + 2l - M)/6 - 2(1 - s);
   it is at most that value at every other split; 1 - h_E/6 + ksig(s)/2 = s with h_E = 1 + l - M/2;
   sigma_0 = 1 - h/r + kappa/2 solves C_r(sigma_0) = lx/2 + kappa/2 for r = 2, 3, 6; K Z^(h_E/3) at M = 1, l = 0 is
   Z^(7/6) = Z^(5/6 + 1/3); random marks: slot size (P/log P)^(1/2) P^(-5/6) = P^(-1/3) against P^(1/6), so
   h/6 -> (1 - lx - 2l)/6. At the geometry (12.4): h = 13/16, C(7/8) = 3/16, ksig(7/8) = 0, 1 - h_E/6 = 7/8, so (C1)
   at k = 0 reproduces the manuscript's own vertex. The c7 derivation of ksig ((K/D)(D^2/K)^(1/6) P Z^(2 beta - 1)
   against Z^k K) gives the same exponent. All confirmed.
6. **F_q[T] column.** ||c_k||^2 = q^d Sum_{deg c = k} phi(c) = q^(d+2k)(1 - 1/q) and orthogonality for k, k' <= d/2
   re-derived by hand (distinct reduced fractions with denominators of degree <= d/2 differ by at least q^(-d)).
   `tab.py` on `recheck.jsonl`: E = S + Rem, |J|^2 = wt^2 q^(2d) |S_cop|^2, S = wt^2 q^(d-2k) |S_cop|^2/(1 - 1/q),
   J = 0 at the other k, in 22 of 22; every ratio of the section 3 table reproduced; 12 of 14 negative: confirmed.
   The Gauss sums were not re-implemented by the referee; the lane's script was read and run on new cases (Controls).
7. **Earlier notes read:** c7-uncompensated RESULT sections 0-3, 9 and REFEREE; c7-probe-format-h-cap section 1
   (Lemma C, HS, A) and REFEREE headings; c7-liou-high-row-bound Theorem A, Corollary B, Theorem C and REFEREE.

## Errors and corrections

**E1 (formula (T), general Gram matrix).** As printed, Sum|B|^2 = conj(J)^T G^(-1) J + Rem with
G_ij = Sum conj(A_i) A_j. With J_j = Sum A_j B this is wrong when G is not real: `bessel.py` (2 complex probe
vectors, n = 5) gives projection energy 4.7470 and conj(J)^T G^(-1) J = 7.0335. Corrected wording:
"Sum_m |B(m)|^2 = J^T G^(-1) conj(J) + Rem (equivalently conj(J)^T conj(G)^(-1) J + Rem)", which gives 4.7470.
No later step uses the non-orthogonal form (F_q[T]: orthogonal; Z[omega]: one vector at a time), so nothing else changes.

**E2 (Corollary Z, quantifiers).** (i) Prop. 2.1 requires sigma_0 in (1/2, 1) and beta* - sigma_0 > 0. "For every
sigma_0 < beta*" must read "for every sigma_0 in (1/2, beta*) at which (HC) holds". If beta* = 1/2 the corollary
is empty. (ii) (HC) must fix the saving sigma > 0 in (2.5) independently of the target, and J_eta is I_mark divided
by a normalisation c_S Prod_i(-A_i) Z^(-l/6) of size Z^(o(1)), not I_mark itself; the open range of omega absorbs
it. (iii) With the manuscript's normaliser, (2.2) is reported to fail for sigma_0 <= 2/3 (row Z24; not re-derived
here). Then (HC) can hold only for sigma_0 > 2/3, and the corollary has content only if beta* > 2/3; in that case
it gives the full k >= ksig(beta*), not "ksig evaluated at beta in (2/3, beta*)". Corrected statement of (C1):
"PROVED-rel (HC) at one sigma_0 in (1/2, beta*): k >= ksig(beta*). With the manuscript's normaliser this requires
beta* > 2/3. If beta* <= 2/3 nothing is obtained."

**E3 (three sentences that rest on beta* >= 1/2 alone).** Reading (c) in section 4 ("the diagonal-level input at
h_E > 3 is false, since beta* >= 1/2 [PROVED-rel (HC)]"), section 5 item 2 ("in particular if h_E > r/2") and section
7 item 1 ("unconditionally false only where h_E > 3, relative to (HC)") are not derived. The case beta* = 1/2 is
outside Prop. 2.1, and for beta* in (1/2, 2/3] no sigma_0 with (2.2) exists for the manuscript's normaliser. An
argument from zeros on the critical line would need an Omega-result for f_eta at C(1/2) and a normaliser that does
not vanish there; neither is in the note. Corrected wording: "relative to (HC) at some sigma_0 in (1/2, beta*), the
input k = 0 is false when h_E > 6(1 - beta*); the threshold h_E > 3 independent of beta* is not obtained."
The same gap is in Lemma C (consistency) of `c7-probe-format-h-cap` ("h <= r/2"), which the note inherits.
"Unconditionally ..., relative to (HC)" is contradictory wording; delete "unconditionally".

**E4 (reading (b): "withdrawn" is a status, not a refutation).** What is shown: the Bessel route turns an energy
bound into (2.4) only, so a conclusion about zeros needs the high half; the Poisson route of the c7 note needs
control of the non-sixth-power frequencies (c7 referee E1). Neither route proves (b). Nothing in the note refutes
(b). Corrected wording: "reading (b) is not established by either route and is removed from the list of results;
it is not shown false." The note's own (C1) is a different statement from the c7 one: same exponent, no maximum
with 1 + l - M, but conditional on (HC), and for beta* (some target) where the c7 statement was per target.
"(C1) is recovered exactly" should read "the exponent of (C1) is recovered, conditional on (HC)".

**E5 (identity (3.2) and the model).** Verdict item 3 and section 10 say that (3.2) "has no counterpart in the
model" and list it as withdrawn or corrected. The model result is: E >= D + S_Bessel is false (confirmed, also on
new cases). (3.2) has an extra term - c D N and a coherent block defined by Poisson summation, and the note's own
table says the dual form was not derived in the model. So the model does not test (3.2). Status of (3.2):
not established (c7 referee E1); unchanged by this note. Corrected wording: "(3.2) was not tested; the model shows
only that the Bessel squared signal cannot be added to the exact diagonal." Likewise "E1 is very likely correct"
is supported by the negative Rem measured in `c7-liou-high-row-bound`, not by section 3.

**E6 (labels in the verdict).** (i) "Decisive test: passes": E = S + Rem with Rem computed as a residual norm is
linear algebra and cannot fail; the run tests the code. The parts that could fail are the signal law
|J|^2 = wt^2 q^(2d)|S_cop|^2 (already 416 of 416 in the c7 lane) and equality with the stored integers. Replace
"decisive test" by "recomputation". (ii) Verdict item 5 and the closing paragraph state "no proof that reads the
row coefficients through their moduli gives the input, at any h_E > 0" without a label. Over Z[omega] this rests
on the size of the aligned probe, which is ARGUED (needs (2.5) for a Liouville-type target, not a Hecke
character, at general geometry). In F_q[T] the aligned squared signal exceeds the diagonal by a bounded factor
(2.56 to 6.16), which shows no power. The sentence must carry "ARGUED over Z[omega]; bounded factor only in the
model". For r other than 6 the format is a model definition, not manuscript text. (iii) The citation "principal
term PROVED in class rows by c7-liou Theorem A" concerns the energy term P, not the probe I_aligned; and the
bound E_liou >> Z^(7/6) is ARGUED there (remainder ARGUED-rel (H2), measured negative, per that lane's referee).

**E7 (section 5 and "closes the marks branch").** Items 1 and 2 of the corollary are Prop. 2.1 read forwards and
as a contrapositive through one Cauchy-Schwarz step; they hold for every probe of the format, including the
manuscript's proved vertex at (12.4), and are not an obstruction (the note says so). Item 3 is Lemma A of
`c7-probe-format-h-cap` in energy units: kappa >= 2 h_E/r is the same inequality as B_low >= 1. Item 4 is
arithmetic. So section 5 contains no statement beyond Prop. 2.1 and Lemma A; it should be labelled "restatement".
"The marks branch is closed" and "the marks item can be removed from the deepen list" overstate: the low input
at h > 1 is an upper bound for S + Rem at the diagonal level, which is (E-K), open. Corrected wording: "the marks
branch is reduced to (E-K); modulus-only proofs of the input are excluded by Lemma A (ARGUED size); nothing is closed."

**E8 (small points).** (i) (16.13) is stated in the manuscript for the two-term multiplier
B_p = eta(p) Q^x P_p*/P_p - Q^(-w) in the second Euler region with u = 1. The marked-only multiplier is B_p + Q^(-w);
there Re w >= 19/20, so it is also -1 + O(Q^(-7/8)). The table should cite it as a consequence, not as the printed
statement. (ii) "MS Proposition 6.3 / 15.3": Prop. 15.3 uses the Gram bound of Prop. 15.2, not Lemma 6.2. With
Prop. 15.2 (range Y'^2/Q >= 1, P_a^(11/6) << Y') the forced exponent at a split ly >= lx is ly - b/6 + 2C(s), which
equals the value at lx = ly (`expo.py`). So lx = ly is optimal but not uniquely; (C1) can be taken relative to (HC)
at any split in that range. This matters because the availability of (HC) depends on the split. (iii) The example
"7 * 21 * 1/((6/7) 343 * 7) = 0.071" contains a factor 1/(1 - 1/q) that the displayed formula does not; the formula
as displayed gives 0.061. (iv) Lemma A transfers a modulus-only inequality when the marks are a separate variable
(p, A'). After collapsing to A = pA', indices with two primes in one slot window have different moduli for eta and
for the aligned target; this changes constants and powers of log, not exponents.

## Controls

* New F_q[T] cases, lane script run unchanged on cases not in `recheck.jsonl`: (b, 2, 1, 3) and (mu, 2, 1, 3):
  E = S + Rem exact, signal law exact, S/D = 0.0095 and 2.56, (E - D - S)/D = -0.063 and -0.707. (a, 2, 0, 3) and
  (b, 1, 1, 3, random marks seed 5), both with dual length r < 0 at every k <= d/2: J = 0 exactly, S = 0, E < D.
* Random-mark control at N = 1 is degenerate: n_2(PA') = 41 for every pair, so S_cop = -41 (Sum_P u_P)(Sum_A' mu nu),
  and the reported drops 49, 34, 21 are 441/|Sum_P u_P|^2 with |Sum u_P|^2 = 9, 13, 21. The equality of S for
  (mu, random seed 1) and (a, coherent) at (1, 2, 4) is this coincidence (both |S_cop|^2 = 861^2), not a defect.
  The control shows the size of a sum of 21 unit phases and nothing about the row.
* Target controls: Theorem Z and (T) use no property of the coefficient sequence; they hold verbatim for unimodular
  twists, sign twists, Davenport-Heilbronn combinations and non-multiplicative weights. Corollary Z reads the
  target through beta* only. Nothing separates zeta-type targets from the controls, as the note says.
* Backward heat, T-NR, Beurling, zeta(s+a)zeta(s-a), phase-rotated transfer operator, theta^w: not applicable to a
  statement about row vectors; not run.

## Section 7 of the note

Items 2 to 7 are accurate (item 3: M' = M - 2d by (15.1); item 7: Z^(1/2) Z^(2/3) = Z^(7/6) checked, and labelled as not
carried out). Item 1 needs E3. The note contains no upper bound for Rem and no statement about the reflected
representation, so it does not pre-empt (E-K). The sentence "(E-K) at (M, l) implies, with the high half,
beta* <= 1 - h_E/6" is the vertex formula of the format and was already in the c7 note; it is conditional on (HC)
at the split used, which is unproved for lx < l.

## Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 multiplicativity essential | false | Bessel and Theorem Z hold for any coefficient sequence; signal law exact for random marks and non-multiplicative weights |
| R2 height-uniform, every window | false | no statement about a function or its zeros |
| R3 controls fail structurally | false | no target control fails; the random-mark control changes a size and is degenerate at N = 1 |
| R4 reaches the critical line | false | no probe with h > 1 is established; Corollary Z is empty when beta* = 1/2 and, with the manuscript's normaliser, when beta* <= 2/3 |

## Surviving claim

Relative to MS (6.2), (12.5), section 15.1 and Lemma 6.2: max_sigma E_sigma(Z) >= c_0 min(X, Y) |I_mark(Z)|^2 for the
marked-only rows (Cauchy-Schwarz; classical). Relative in addition to (HC) at one sigma_0 in (1/2, beta*), unproved
for lx < l and possible only for beta* > 2/3 with the manuscript's normaliser: every true bound E << Z^(k+eps) K has
k >= (2 + 2l - M)/6 - 2(1 - beta*). In the F_q[T] block model (q = 7, d <= 4): E = S + Rem exactly, S in closed form at
dual length 0, and E >= D + S false. Reading (b) and identity (3.2) of the c7 note remain unestablished, not
refuted. Modulus-only proofs of the low input are excluded by Lemma A (aligned size ARGUED). The h > 1 marks
branch is reduced to (E-K), open. Nothing about zeros.
