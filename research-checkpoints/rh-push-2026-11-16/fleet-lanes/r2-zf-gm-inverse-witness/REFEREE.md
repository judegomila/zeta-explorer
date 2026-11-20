# REFEREE: r2-zf-gm-inverse-witness/RESULT.md

Date 2026-11-16. Adversarial referee pass. Verdict under review: precise obstruction, no new count, 7/8 stands.
Referee verdict: **the obstruction verdict and "proved gain 0" stand. Two statements do not survive as labelled:
(i) "TRO6-type input is not sufficient ... no full-family estimate helps (PROVED arithmetic)" is contradicted by the
note's own last paragraph of section 3; (ii) "Gauss sums cancel, so the missing input is not TRO6" is a non sequitur
and the "not necessary" half is unproved. One label is inflated ((E7): CLASSICAL in the body, PROVED in the verdict).**
No RH assumption found. No verified-height restatement. Nothing here could succeed for Davenport-Heilbronn.
Referee scripts (not kept in the repo): `/tmp/ref-r2gm/norm.py`, `/tmp/ref-r2gm/gauss.py`.

## 1. Step-by-step

| step | label claimed | referee result |
|---|---|---|
| Section 1: S/n <= delta; C1, C2, C3 | PROVED-rel manuscript | CONFIRMED against `~/lean-deps/qrh-verify/paper.txt`: Lemma 8.2 (8.1), Prop 8.3 (8.4), Lemma 17.1 conditions r + 2z <= m - c1, 2r + 8z <= 3m - c2, (17.88) e(r) = max(1, (1+5r)/6), (19.2) z_P = (1-2m)/(6 kappa), Prop 19.2 count lines 11158-11159, Lemma 19.1 slot exponent a - 1/2 = delta/2. |
| C4 not supported by Lemma 9.1 beyond bare M_r | finding | CONFIRMED. Lemma 9.1 (line 3693) is stated for squarefree ideals n and a coefficient sequence fixed independently of the row. Unused by Prop 19.2. |
| (E1) zero frequency only on the diagonal | PROVED | CONFIRMED. chi_n(u) conj chi_n(u') = chi_n(u u'^5); with valuations in [0,5], v + 5v' = 0 mod 6 forces v = v'; class number 1 and Kummer theory give nontriviality otherwise (possibly of order 2 or 3, still no polar term). Needs "one row per ideal" as stated. |
| (E2) Halasz (2.1) | CLASSICAL | CONFIRMED. \|\|P\|\|^4 <= cD (cD \|\|P\|\|^2 + <P,EP>), divide by D \|\|P\|\|^2. |
| (E3) cubic trace (2.2), (2.3) | PROVED | CONFIRMED. F = H + (cD - Lambda) >= 0, diagonal cD, tr F^3 - (tr F)^3/R^2 = 3cD tr E^2 + tr E^3; Guth-Maynard Lemma 4.2 (gm.txt line 649) squared gives the constants 8, 8. |
| (E4) (HB6), (T6) | PROVED | CONFIRMED (exponent rho + 3 delta r - 2r re-derived). Sufficient conditions, not necessary ones; the note says "suffices". |
| (E5) table | PROVED-rel Lemma 9.1 | CONFIRMED by independent arithmetic at all four r (0.1929/0.5306/0.3377/0.8167 at r = 0.7605; 0.0767/0.6550/0.5783/0.8383 at r = 0.87). Guth-Maynard-shape column: 1 + r(2/5 - 2 delta) for r <= 5/6 and r(8/5 - 2 delta) above, both re-derived from N^{18/5}V^{-4} with subdivision of T. Wording: what exceeds the budget is the proved upper bound for S2 and S3, not S2 and S3 themselves. |
| (E6) pairwise Lindelof leaves S3, saving U^{3r(1/2-delta)} | PROVED (arithmetic) | CONFIRMED: 0.0699 at r = 0.7605, 0.0803 at r = 0.8728. This uses only the triangle inequality on S3; it shows the bound \|S3\| <= R^3 D^{3/2} is insufficient, not that S3 is large. |
| (E7) Poisson lengthens to U^{2-r}; Gauss sums cancel | CLASSICAL in body, **PROVED in verdict** | PARTLY CONFIRMED. Conductor U^2, dual length U^2/D, prefactor D/U: correct. Cancellation of the Gauss factor in cyclic triple products: checked numerically on a different case (sextic characters mod p, p in {7,13,19,31,37,43}; individual normalised Gauss sums have non-root-of-unity phases; all 20 cyclic products G(a,b)G(b,c)G(c,a) have modulus 1.000000 and phase an exact multiple of 2 pi/6). The displayed identity has an unbounded "squarefree-sieve remainder"; referee remark: every term of the mu^2 sieve carries the same Gauss factor, so the cancellation is exact for coprime squarefree rows, but "S2, S3 equal the same sums at length U^{2-r}" is schematic (a superposition of dual lengths U^2 d^2/D). Non-coprime and non-squarefree rows not done (acknowledged). Label should be CLASSICAL sketch, not PROVED. |
| missing inequality lambda_max(E_B) << U^{0.5903 + 0.4693 r} | derived | CONFIRMED as the condition under which (2.1) gives a count below 0.590332. Endpoints: 0.7605 = (1 - 0.590332)/(2 delta - 2/5), 0.8728 = (1 - 0.590332)/delta = r* + (1 - r*)/2. Proved exponent min(1 - delta r + r, 2(1+r)/3) confirmed. |
| Section 3, "TRO6 not sufficient: no full-family estimate helps" | PROVED arithmetic | **NOT CONFIRMED as stated.** The three listed estimates are checked (1/(2 - delta) = 0.6533; 17/16 - delta r). But the last paragraph of section 3 names a full-family estimate that would help (Lemma 17.1 with capacity r + z < 1, count 1 - delta). Lemma 17.1 is a sum over the full family, and BRIEF.md attributes the manuscript's exceptional term to TRO6. The statement is proved only for the three listed estimate types. |
| Section 3, "TRO6 not necessary: (GM6) contains no Gauss sum" | asserted | **NOT CONFIRMED.** See section 2. |
| (N1) norm >= U^{17/16} | PROVED-rel [Xu26], unverified | Arithmetic and range confirmed against 2610.15291.txt lines 97-99 (B^{16/11+d} <= A <= B^{2-d}, scale A^{5/6}B^{1/3}; 5/6 + 11/48 = 17/16; column-submatrix monotonicity). [Xu26] itself unseen by author and referee. |
| (N2) measured norms | MEASURED | Independent re-implementation (different code path: exact factorisation in Z[omega], dense SVD). Same case K = 3125, r = 0.8333: lambda_1/#rows = 2.296 / 3.204 / 1.960 for orders 6 / 3 / 2 (note: 2.29 / 3.21 / 1.98; row counts 882 vs 883). Different case r = 0.8, K = 5000, 10000, 20000: order 6: 2.148, 2.133, 2.188; order 3: 2.987, 3.289, 3.698; order 2: 1.791, 1.763, 1.795; lambda_1/lambda_2: order 6 1.04-1.02, order 3 1.32-1.40. Ordering cubic > sextic > quadratic and "no isolated sextic top eigenvalue" reproduced. At K <= 2*10^4 the sextic slope is 1.013 against 1.002 quadratic and 1.154 cubic, so the sextic excess over the mean value is not visible below K ~ 10^4; it rests on the top two octaves of the author's run. The 0.91 Gauss-span overlap (108-dimensional span) and the fits were not re-run. |
| (N3), section 5 numbers | arithmetic / HEUR model | Arithmetic confirmed (0.713; 0.5983 at r* = 0.7457; logs give 0.8748866487, 0.8748865858, 0.8744073989). Under the gm1 model the binding bins move to delta ~ 0.413 with gate 6 tight; the model value is not a statement about the 0.4693 bin alone. LP model not re-derived. |

## 2. The TRO6 classification

The inference "Gauss sums appear only as root numbers in (E7) and cancel, hence (GM6) is not TRO6-type" does not
follow. (GM6) is a bound for lambda_max of H_B - Lambda over all sparse B. For any fixed column vector c,
lambda_max(H_B) >= sum_{u in B} |sum_n c_n chi_n(u)|^2 / ||c||^2. Take c_n = W^{1/2} conj(g~(n)), which section 4
of the note itself measures to be the extremal direction (overlap 0.91). Then (GM6) implies: the sum of the R largest
values of |sum_n conj(g~(n)) chi_n(u) W|^2 over rows u is << D U^{1 - eta}. By the note's (N1) heuristic these row
values are D^{2/3} q_u^{-1/12} tau~(u), so (GM6) implies a large-values bound for sextic theta coefficients on sparse
row sets: sum_{u in B} |tau~(u)|^2 << U^{1 - eta + 1/6} D^{-1/3}, i.e. average over B at most U^{0.26} at r = 5/6.
The note's check of this uses "flat theta coefficients" (HEUR). If the coefficients concentrate on a set of size
U^{0.61}, (GM6) is false as stated ("for every B"), and the correct target is (MI) with the phases. So:

* syntactically (GM6) has no Gauss sum: true;
* "TRO6-type information is not necessary": unproved; (GM6) implies a sparse-set statement about Gauss-sum-twisted
  row sums, a large-values relative of the round-1 object;
* "not sufficient": proved only against three estimate types (section 1 table).

Supported wording: "(GM6) is not implied by a full-lattice power saving of TRO6 type via the three estimates listed;
its truth for every B depends on the unproved non-concentration of sextic theta coefficients on sparse row sets."
The withdrawal of the round-1 sentence "reduces to TRO6" is justified (no reduction was shown); its replacement by
"is not TRO6" is not.

## 3. Controls

* DH: nothing to fail; all proved statements are row counts or norms for arbitrary coefficients. Section 6 is
  correct that 1/L for Davenport-Heilbronn has no bounded-coefficient partial sums, so no witness exists.
* RH: not assumed. Pairwise Lindelof appears only as a labelled hypothesis in (E6).
* Verified height: not used.
* Sign twist / backward heat: not applicable to a no-gain result.

## 4. Is the obstruction real?

Real for the route as posed (Halasz + cubic trace on an arbitrary row set with coefficient-free norm). It is an
obstruction to that method, not to a count gain. Ways around that the note does not close:

1. The slot-capacity lever the note names itself: Lemma 17.1 with r + z < 1 in place of r + 2z < 1. It is a
   full-family second moment with the actual Mobius coefficients, avoids (GM6) entirely, and would give 1 - delta at
   x = 1/2. Not studied; this is the strongest adjacent route and the note ran no pivot.
2. B is not arbitrary: rows carry a zero of L(s, psi_u) in a fixed bin and the witness phases theta_u are determined
   by it. (MI) with those phases is weaker than (GM6); "nothing in the proof constrains B" is a statement about the
   attempt.
3. Setup gap (minor): section 2 fixes one profile W >= 0. The manuscript's witnesses carry a row-dependent twist
   (Prop 8.3: height gamma - nu; Lemma 17.6: W_{sigma_u, t_u}). With row-dependent profiles h(u,u') is not a single
   character sum with a nonnegative weight; (2.1)-(2.3) need a Sobolev step at cost (1 + T1)^A. Does not affect a
   no-gain conclusion.

## 5. Surviving claim

No new count; proved gain 0; 7/8 stands; Xu-Sang system unrefereed. PROVED-rel manuscript: S/n <= delta, C1-C3,
C4 unsupported beyond bare M_r and unused. PROVED: (E1), (E3)-(E6), the form of the missing inequality for the
Halasz/cubic-trace route. CLASSICAL sketch with exact Gauss-factor cancellation for coprime squarefree rows: (E7).
MEASURED and reproduced: sextic norm between quadratic and cubic, no isolated top eigenvalue; excess over the mean
value visible only for K >~ 10^4. Not surviving: "the missing input is not TRO6" (replace by section 2 wording) and
"no full-family estimate helps". Model prices unchanged, HEUR.
