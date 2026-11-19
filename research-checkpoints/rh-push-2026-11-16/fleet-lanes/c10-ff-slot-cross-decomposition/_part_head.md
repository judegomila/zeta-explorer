# c10-ff-slot-cross-decomposition: the model excess of the row mean square is the cross term over pairs of marked primes

Internal working note, 2026-11-19. Slug `c10-ff-slot-cross-decomposition`. Kind: combine (slot decomposition of
`c9-mv6-window-statement`, Lemmas S1, S2 + the exact F_q[T] code of `c9-mv6-ff-window-exact`). Not refereed. Nothing
committed, pushed or posted. Written: this directory and `~/rh-push/c10-ff-slot-cross-decomposition/` on the compute
server (through `rhrun`, 4 cores, 4 GB; both units inactive at the end, section 9).

This note makes **no statement about zeta** and none about zeros of any L-function. It is a function-field model
computation (where the Riemann hypothesis for the twist family is Weil's theorem) and one float estimate over
Z[omega]. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (argument given here) / PROVED-rel X / CLASSICAL / EXACT (equality of exact integers on the stated
cases) / MEASURED (ratios of exact integers, or floats where stated) / ARGUED / POST-HOC (found after the
pre-registered runs; not an advance prediction) / NOT-RUN / OPEN.

## Requirement answers, stated before the work and after

| flag | before | after | evidence |
|---|---|---|---|
| R1 multiplicativity essential | no | **no** | The split is an identity for any vector with the slot form (Lemma X1 uses the twisted multiplicativity of the Gauss sum, in the formula only). The class U (random multiplicative signs) is not separated from the target vector in 50 of 51 configurations. |
| R2 height-uniform, every window | no | **no** | Fixed q, degrees up to 14; no statement about zeros. |
| R3 every control fails structurally | no | **no** | Controls behave as the bookkeeping says (random phases and slot signs at the diagonal; Liouville-twisted and aligned vectors above); none fails where the target passes. |
| R4 reaches the critical line | no | **no** | A model computation inside the 7/8 architecture; no abscissa changes. |

What each side supplies: the slot decomposition supplies an identity that uses multiplicativity (R1 in the formula
only); the F_q[T] code supplies exact integers and the control classes. Neither supplies R2, R3 or R4. No flag rises.

## 0. Verdict

**Partial result (model statements) that removes the caveat of round-9 lesson 1. The model excess is the cross
term over pairs of distinct marked primes: proved for long marks, exact in every run. The cross term is a sum of
squared signals plus a remainder between -1 and about +1.5 diagonals; the sixth-power squared signal B_coh is the
largest of them for the first target and not for the second (pre-registered rule B fails at the largest size). The
Z[omega] screen and the model do not disagree: at the screen's geometry the model also shows no target excess; the
same term in the screen is predicted at 1.5e-4 to 3.2e-4 of the diagonal, 30 to 70 times below the screen's
resolution, and at the screen's geometry (P = Z^(1/3)) it decreases with the size.**

1. **First lemma (section 2; PROVED, EXACT-checked).** With lam > N and lam > d the row is R = sum_P R^P, the block
   of P being chi_P(m) times the unmarked row of length N for the vector twisted by the cubic character xi_P
   (Lemma X1, the model form of S1, S2). E = D + (SD - D) + CRperp + CRcoh and B = SB + CRcoh (Lemma X2). Verified in
   exact integers against an independent brute force with the cross term as an explicit double sum over pairs of
   primes: q = 7, N = 2, (lam, d) = (3, 1), (3, 2), (4, 1), (4, 2), and N = 3 completed rows (4, 1), (4, 2); eight
   vectors each; every integer equal.
2. **The excess is the cross term (Lemma X3, PROVED with Weil's bound; rule A HOLDS).** SD - D is a sum over pairs
   of cofactors of a prime sum of a non-principal cubic character, so |SD/D - 1| = O(N q^(N - lam/2)). Measured on
   288 vector-configurations with lam >= 7: |SD/D - 1| <= 2.4e-3; for lam >= 11: <= 6.5e-5. Target a at q = 7,
   (2, 12, 1): e = 20.639, Cross/D = 19.639, SD/D = 1 - 1.3e-5. At q = 13, (2, 7, 2): e = 2.335, Cross/D = 1.335.
3. **Cross against B_coh (rules B, C).** B = exact squared signal on the sextic Gauss-sum rows c_0, c_1 (the quantity
   the round-8 law approximates). It is carried by pairs of distinct primes: the per-prime part SB/D is at most
   0.51 of 2 dim/q^d (rule C HOLDS). Cross/D = B/D + n - SD/D with n = (E - B)/D >= 0 (identity). Rule B (the
   non-coherent cross n - (SD - SB)/D between -1.05 and +1.5 for a, b / c4, mu, class U): 593 of 596
   vector-configurations; **FAILS** in 3:
   q = 7 (2, 12, 1) for b (e = 7.47, B/D = 2.16, n = 5.31) and one U seed (n = 8.98), and (2, 11, 2) for mu (n = 2.62).
   For target a at (2, 12, 1): B/D = 19.43, CRcoh/CR = 0.982, n = 1.21. By the pre-registered outcome rule the
   label "EXCESS = COHERENT CROSS" is **not** awarded; the excess is the cross term, and B_coh is one of its parts.
4. **The other part (POST-HOC, section 4).** The three violations are a second squared signal, in the direction
   m -> u(m) (the vector's own multiplicative function at the row variable; for a target, its character at m).
   b at (2, 12, 1): 5.235 of the 5.310; U seed: 8.92 of 8.98; mu at (2, 11, 2): 2.616 of 2.616. With u(m) and
   u(m) v_1 added to the span, the remainder is at most 1.47 for a, b / c4 and class U in all 538
   vector-configurations and at most 1.97 for mu. The vector `one` (trivial target) is not resolved at d = 3
   (remainder 7.2 and 7.8 at (2, 8, 3), (2, 7, 3)): OPEN, as in c9. The pre-registered prediction that this term is
   in B was wrong (B/D = 0.87 against e = 9.28).
5. **Controls (section 6; rule D HOLDS).** Random signs on the marked primes remove the excess and nothing else:
   a at (2, 12, 1) goes from 20.6 to 0.50 and 1.01 (two seeds), mu from 951.9 to 0.56 and 0.92; mean of e within
   three standard errors of SD/D in 97 of 102 class-configurations. Random phases: mean cross within three
   standard errors of 0 in 50 of 51. Class U: target a separated in 1 of 51 configurations. Aligned vector: at
   the operator-norm size, all of it in the cross term, outside every span used.
6. **Completed rows, N = 3 (registered expectation HOLDS).** The cube-term excess is also in the cross term
   (SD/D within 2e-3 of 1 at d = 2; between 0.86 and 1.02 at d = 1, where the cube columns of one block are not
   orthogonal) and is not in span{c_0, c_1} (37 violations of rule B with that span); with the span
   enlarged by V c_0, V c_1 there is no violation in 218 vector-configurations. Target a, q = 7: (3, 8, 1) e = 5.20,
   B/D = 0.084, enlarged 5.08; (3, 9, 2) e = 6.27, enlarged 5.84. Optional run (3, 12, 1): e = 40.28,
   B/D = 0.26, enlarged 40.27, with slot signs 0.55.
7. **Model law for the size (EXACT at N = 2 for target a).** B(a) = B(mu)/q^N as exact rationals in 20 of 20
   configurations with B(mu)/D >= 3 at both q: the squared signal of the target is the squared signal of the
   Liouville-twisted vector times the squared ratio of the Moebius sums. For b and at N = 3 the ratio varies
   (two probes with different sums); it stays of order q^(-N).
8. **Model against the Z[omega] screen (section 5).** (a) EXACT: at short marks (lam = N/3 or N/4, the screen's
   geometry; patched copy of the round-8 kernel), N >= 4: the target vectors have ratio 0.975 to 0.997 and cross
   term -0.025 to +0.003 (control classes: -0.033 to +0.038), and the Liouville-twisted vector has cross term
   +3.4 to +8.7: the same picture as the screen. In the long-mark runs the target a first exceeds twice the
   diagonal at lam = 10 = 5N (q = 7) and lam = 6 = 3N (q = 13).
   (b) MEASURED (float): the dual vector of THETA has class sums at the level of random phases
   (squared ratio to ALIGNED 1.7e-2, 6.5e-3, 1.7e-3, 8.3e-4 at Z = 2000 to 16000); with the frequency density 0.397
   and the screen's largest ALIGNED cross this gives 3.2e-4, 3.1e-4, 1.5e-4, 1.5e-4 of the diagonal for the THETA
   coherent cross, against a resolution of 0.01 to 0.02. (c) ARGUED: visible (0.05) needs the ALIGNED cross at 8 to
   150 diagonals, that is at least about 1e10 columns with P >= Z^2 (largest screen: 3.7e5 live columns, P = 25);
   along P = Z^(1/3) the predicted term falls like Z^(-2/3). No term was found in which model and number field differ.

---

## 1. Plan, and relation to closed rows

Read: BRIEF to the end (rhrun rules, 2026-11-18 update); OBSTRUCTION_MAP rows Z15, Z24, Z26, Z30 (which names this
lane for the reconciliation), Z31 and the controls section; RESULT of `c9-mv6-window-statement` (all), of
`c9-mv6-ff-window-exact` (all), of `c8-ek-ff-reflected-rows-exact` (sections 2, 5); `ffx.c`, `ffw.c`, `decomp.py`,
`check_completed.py`, `analyze.py`; ROUND_LOG round 9 lessons and round 10 allocation.

Known before: c8: energy / diagonal = n + B_coh with a measured law for B_coh; c9 (model): Weil targets exceed the
diagonal above dual length 3N at N = 2 (up to 20.6), cube term at N = 3; c9 (Z[omega]): slot decomposition,
no target excess in the float screen (ratio at most 1.007), aligned and Liouville excess in the cross term.
Unexplained: why model and screen differ.

New here: (i) the per-prime kernel `ffs ens` and the exact split E = D + (SD - D) + CRperp + CRcoh with the exact
projection B (not the law); (ii) Lemma X3; (iii) seeded classes with a rule fixed in advance (PREREG.md), among
them the slot-sign class; (iv) the split at short marks; (v) the Z[omega] size estimate; (vi) post hoc, the second
squared signal. No closed route is re-run; the lane makes no attempt on (E-K) itself, which stays closed (Z30).

Order of work: kernel and brute-force check of the identity (first lemma); one disclosed look at (2, 7, 2); PREREG.md;
production runs; analysis. Copies of the c9 files are unchanged (hashes in `logs/prereg_hashes.txt`); the originals
were not edited.

