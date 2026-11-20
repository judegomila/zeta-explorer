# c20-referee-theorem-d-headline-and-r19: RESULT

Date: 2026-11-20. Kind: repair (independent referee work, paper only; local checks through `scripts/memcap.sh 8`).
Labels: PROVED (argument written in the referee file), CLASSICAL (recalled), MEASURED (float64/mpmath),
EXACT (rational arithmetic), "relative to" (source not opened).

Nothing in this lane is a statement about a zero of zeta. No bound moves. No file outside this directory was
edited; the compute server was not used and no unit was started.

## 0. Verdict

**Partial result (referee lane).** Seven second-referee files.

1. **Theorem D of `c1-leeyang-krein-limit` holds, with four corrections of wording** (the proof paragraph headed
   "(a) implies (b)" proves (c); "locally bounded" means uniformly in P; theta >= 1/2 is used only in the
   prime-power sum; the equivalence is in the literature, Akatsuka 2017 and arXiv:2411.19259, relative to a
   search summary).
2. **Its R1 flag is not justified.** The only stage property Theorem D uses is "stages without zeros in
   Re s > theta that converge right of some abscissa". A non-multiplicative control has it (Davenport-Heilbronn
   with exponential stages exp(sum_{n <= N} b_n n^-s): Lemma E, PROVED on Re s >= 2, convergence MEASURED to 6.5e-15),
   and three multiplicative controls lack it for their Euler stages (T-NR, HQ2, the members G_q of Proposition F:
   a local factor vanishes inside the strip). Multiplicativity is neither necessary nor sufficient for the
   hypothesis; what the Euler stages of zeta have is local factors without zeros, a size condition at each
   prime. With exponential stages every control passes the stage hypothesis and fails only at local
   boundedness, the step that is open for zeta. Theorem D is an equivalence with its target and the equivalence
   holds for every control run: under METRIC.md section A it is a restatement.
3. **What is lost in the limit.** In the stage normalisation: everything (slack (log M)/2 against (1/2) log(t/2 pi);
   limit symbol -1 for every twist). In the strip topology: nothing is lost by Hurwitz; what is missing is
   normality. Zero-free stages give one omitted value where Montel's test needs two, or a one-sided bound on
   Re[sum_{p <= P} p^-s + E_1((s-1) log P)]. By Proposition F no finite set of stages bears on it (the stages
   P < q of G_q are zeta's and G_q vanishes on Re s = 3/4).
4. **Round 19, six lanes:** five "holds with corrections", one "holds" (table in section 3). New relative to the
   first referees: X(d) and NL(d) of the D10 lane are false for odd d (exact counterexamples at d = 3 and d = 5),
   so both statements need "d even" in their text; the repaired Lemma P of the rs lane is written as Lemma P'
   with its domain (lower bound -eps on the mode space, not positivity); a one-line replacement for the
   Cesaro step of Lemma N; an independent complete-zero-list check of the constant -u in Theorem A at a_P = 0.25.

### Headline, in plain text for the learn step

The scoreboard headline "1 of 4 (`c1-leeyang-krein-limit`); missing R2, R3, R4" rests on R1 "at stage level" of
that lane. The second referee does not confirm R1 for it: the two referees agree on every mathematical step and
on R2, R3, R4 false, and disagree on R1. On the second referee's reading the lane scores 0 (restatement rule).
The headline then becomes: **1 of 4, carried by `c4-helson-discrepancy-zerofree` alone (one referee; R1 in the
restricted sense recorded by its referee: a statement about F relative to zeta, not an attack on zeta); missing
R2, R3, R4.** If the learn step also reads that R1 as not being about zeta, the headline is 0 of 4. The
calibration row "finite Lee-Yang stage theorem: 2, stage level only" is not affected: it concerns the parent
lane's stage theorem, not Theorem D. Statement O line 12 keeps its mode sentence ("the limit step is equivalent
to the zero-free statement for every F"); it can cite two referee files for Theorem D and should record the R1
disagreement. This lane edited neither the scoreboard nor Statement O.

## 1. Plan

Decisive first test: derive Theorem D from its definitions without the lane's proof, then run its one
arithmetic-looking step (zero-free stages) against the controls named in the assignment. Outcome: the theorem
holds; the step does not separate by multiplicativity. No pivot was needed (referee lane). Then: the closing
step of each of six round-19 lanes, derived independently, with a numerical or exact case large enough to
contain the first failing atom; then the weekly literature rescan with generic terms.

Sources read: `BRIEF.md` to the end; `OBSTRUCTION_MAP.md` section 2 (controls DH, TW-, EA, NR, HQ2, DEL) and rows
Q19, X1; `campaign/METRIC.md`, `SCOREBOARD.md`; Statement O line 12 (v3 and the v5 file present on disk); for each
target lane RESULT.md, then REFEREE.md after the derivation; `runA.py` of the census lane (certification code,
read).

## 2. Part 1: Theorem D (file `REFEREE2_c1-leeyang-krein-limit.md`)

Derivation (six steps, all PROVED or PROVED relative to the classical bound pi(x) - li(x) = O(x^(theta+eps))): the
factor exp(E_1(w)) = e^-gamma w^-1 exp(Ein(w)) is meromorphic with one simple pole and no zero; for Re s > 1,
R_P = zeta exp(-eps_P) with eps_P = int_P^inf x^-s d(pi - li) + (prime powers); (a) gives eps_P -> 0 locally uniformly on
Re s > theta; conversely Vitali and Hurwitz on the connected set Omega_theta. Same chain as the lane's.

Controls (the assignment's list):

| Control | Stage hypothesis, Euler stages | Exponential stages | Step at which the conclusion fails | Label |
|---|---|---|---|---|
| DH | none exist (b_6 = 1.0807 != 0) | zero-free, converge (rel. error 6.5e-15 at 3 + 5i, 3.7e-4 at 1.3 + 85.7i, N = 2e5) | local boundedness (Corollary C1 verbatim) | PROVED on Re s >= 2; MEASURED |
| T-NR (q = 2, c = 2.5) | fails: local zero at 1.5 + 4.5324i | holds right of the zero | zero-freeness of the Euler stage | PROVED |
| HQ2 (q = 7, eps = 0.2) | fails: local zero at 0.74729396 + 0.23826774i | holds for Re s large | same | PROVED; value MEASURED |
| G_q, Proposition F (q = 5, 101, 10007) | fails for P >= q: zero on Re s = 3/4; for P < q the stage is zeta's | holds | same; and finite sets of stages carry nothing | PROVED |
| sign chains (Liouville) | holds | holds | criterion is the same open statement as for zeta (rel. error 0.034 at 0.65 + 25.2i, P = 1e6, with the factor exp(-E_1)); THIN fails local boundedness near b | PROVED-rel; MEASURED |
| E_a (a = 0.2) | holds on Re s > a | holds | local boundedness near rho + a, by Theorem C | PROVED rel. one zero on the line (CLASSICAL) |
| DEL | holds | holds | local boundedness near b (normaliser needs a pole at b) | PROVED rel. the map row; not run |

Independent numerics for zeta: relative error of R_P at 0.65 + 25.2i, P = 1e3..1e6: 0.135, 0.097, 0.048, 0.033
(identical to the first referee's four values; separate code).

## 3. Part 2: round-19 lanes

| Lane | Statements refereed | Verdict | Corrections and checks |
|---|---|---|---|
| `c19-u4-joint-prime-phase-quadratic-dp-zeros` | Lemma Q2; K1, K2, K3; Liouville row | holds with corrections | Q2 needs simple zeros and the limit over heights T_k (second-order sum not shown absolutely convergent). Liouville fails the cross-sign step at p q^2, first atom n = 12 (-1.5230); passes only for P <= 12; eps = +1 is the only sign chain that passes at every P. Recomputed: T-NR row 4.81, -7.52, 22.03, -53.59; HQ2 first negative at 8, 13, 22. RESULT.md text still says "Liouville passes" |
| `c19-hq2-screen-fe-int-mult-pos-devices` | Lemmas N, S, F, C | holds | Lemma N domain: nu(q^k) >= 0 for all k >= 1, R rational, R(0) = 1. Shorter proof: the generating function with non-negative coefficients cannot tend to -infinity at its radius, so the nearest singularity is a pole. Four exact instances (two on each side of the lemma) |
| `c19-dp-zero-census-truncation-identity-server` | Run A certification; Theorem A | holds with corrections | Constant -u for every a_P != 0, derived independently; new case a_P = 0.25 with complete zero list (768 zeros, 0 deficient slabs): residual/tail = 0.993, 1.003, 0.998. Certification logic of `runA.py` read and found correct. Certified: zero lists and truncated sums; the limit T -> infinity is proved, not certified (label) |
| `c19-u6c-double-cover-k3-run` | Lemma Q (interchange) | holds | Place-by-place derivation; mass identity 48 * 192 = 96^2 consistent. "Locally similar everywhere" is true for the quadratic spaces, not the lattices; direct proof (d a sum of two squares) |
| `c19-d10-xd-determinant-pole-term-lemma-q` | Lemma 1; Theorems 2, 3, 4 | holds with corrections | EXACT: Lemma 1 at 64 of 64 identities; Theorem 2 with equality at 5 sets; Theorem 3 neg index 5 of 5; crossing identity derived without c18 Theorem G. **X(d) and NL(d) need "d even": at {1/4, 3/4, 1/2} N has inertia (1, 2) and N^+ (6, 1); at {1/6, 5/6, 1/3, 2/3, 1/2} N has (6, 4) and N^+ (15, 1).** Theorem 4's inequality holds there with equality |
| `c19-rs-real-zero-completion-band-server` | Lemma P, repaired | holds with corrections | sigma is signed: rho(0) = -0.85501, sign change at 6.289836, negative mass 2.247887. Lemma P': T_sigma >= -2.247887 sup over abs x <= 6.29 of abs(g)^2; on the mode space eps <= 3.3e-10 (1e6), 2.2e-16 (1e9), 1.7e-22 (1e12). Positivity is not given by the construction. RESULT.md text unrepaired |

Rules applied. Every positivity statement above carries its domain (Lemma N: all k; Lemma P': mode space V_m
with eps; X(d), NL(d): even d, open in general; Lemma Q2: simple zeros). Every control row has a case that
contains the first failing atom (Liouville: P > 12; HQ2: k up to 22; the constant of Theorem A: a_P != 1 with a
complete zero list; X(d): odd d with a zero at 1/2). Sources not opened are cited "relative to".

Two faults of this referee's own first check script, corrected before any conclusion was drawn (both kept in
`r19_checks.log`): `sympy.lambdify` converted rational coefficients to floats (Lemma 1 appeared to fail 46 of 48;
exact Fractions give 0 of 64), and a Newton grid missed 56 of 768 zeros (tail ratio appeared to drift to 1.78;
the complete list gives 0.998).

## 4. Part 3: literature rescan (generic terms only; figures reported, none entered)

Queries: "zero-free region Riemann zeta function 2026 arXiv", "sextic theta function Kubota coefficients arXiv
2026", "quasi-Riemann hypothesis zero-free half-plane zeta arXiv November 2026", "Kubota metaplectic theta
function coefficients power saving correlation 2026 arXiv", and one query on partial Euler products for the
source of Theorem D. All from search summaries; no paper was opened.

- Bellotti, Trudgian, Yang, arXiv:2603.21490: explicit classical zero-free region sigma >= 1 - 1/(4.896 log t), t >= 3. Already in the record (same file as below).
- Lee, arXiv:2602.14340: minimal Littlewood-type zero-free regions for primes between consecutive k-th powers
  (no figure in the summary).
- Manzur, Noor, Quintero, arXiv:2606.16097: "A Hardy space approximation supporting zero-free half-planes for
  the zeta-function" (title only).
- arXiv:2610.12234 and arXiv:2610.15291 (already in the brief): half-plane Re s > 7/8 and its refinement. No item
  dated November 2026 was returned.
- arXiv:2610.12803: "A conditional bound Lambda <= 0.13963 for the de Bruijn-Newman constant" (title only). Already in
  the campaign record: the identifier appears in `push/c17-repair-owed-record-r16-cell-nodes/RESULT.md`, as does
  2603.21490. Not new.
- Sextic theta / Kubota: nothing from 2026. Standing references returned: Broker-Hoffstein, arXiv:1312.0568
  (sextic theta coefficients, partly conjectural); Dunn, arXiv:2403.13151 (cubic metaplectic cusp forms, large
  sieve, power saving over primes).
- For Theorem D: Akatsuka, Kodai Math. J. 40 (2017), partial Euler products in the right half of the strip;
  Akatsuka, arXiv:2411.19259: RH iff prod_{p <= X}(1 - p^(-1/2))^-1/exp(li(theta(X)^(1/2))) is bounded iff it converges to
  -sqrt 2 zeta(1/2).

No frontier number was changed and none is proposed.

## 5. Controls (this lane's own statements)

The one new statement here is Lemma E with the table of section 2. It is a statement about controls, and it
holds for zeta as well (Euler stages are exponential stages): it separates nothing. The referee findings are
identities or corrections; none is an attack and none is asserted to fail for a control.

## 6. Requirement flags (this lane)

- R1 false. Nothing here uses multiplicativity; the finding is that Theorem D does not either. Evidence:
  section 2 table, Lemma E, `thmD_controls.log`.
- R2 false. No height-uniform conclusion is drawn.
- R3 false. Section 5.
- R4 false. Theorem D reaches the strip only under a hypothesis equivalent to its conclusion.

Flags recorded for the refereed lanes: all false for all seven, including R1 of `c1-leeyang-krein-limit` on this
referee's reading.

## 7. Three weakest steps

1. The R1 decision is a reading of "multiplicativity essential at a named step" applied to an equivalence. The
   mathematics is not in dispute between the two referee files; the classification is. Lemma E is proved on
   Re s >= 2 only; down to the zero-free abscissa of DH (about 1.12) convergence of the exponential stages is
   measured at one point with Re s = 1.3.
2. Part 2 refereed only the statements named in the assignment. Not re-examined: Runs B and C of the census
   lane, the Eisenstein and cusp runs of the u6c lane, Lemma 5 of the D10 lane, Lemma Z and the engine of the rs
   lane. The certification of Run A was checked by reading the code, not by rerunning it. The DEL cell of the
   Theorem D table was not run.
3. The D10 checks cover d <= 5 with real zeros only (the lane's own runs cover d = 6..16 with complex zeros);
   the odd-d finding rests on two exact examples, both with a simple zero at 1/2. The literature items are
   search summaries: titles and one figure, no paper opened.

## 8. Files

- `REFEREE2_c1-leeyang-krein-limit.md`
- `REFEREE2-c19-u4-joint-prime-phase-quadratic-dp-zeros.md`, `REFEREE2-c19-hq2-screen-fe-int-mult-pos-devices.md`,
  `REFEREE2-c19-dp-zero-census-truncation-identity-server.md`, `REFEREE2-c19-u6c-double-cover-k3-run.md`,
  `REFEREE2-c19-d10-xd-determinant-pole-term-lemma-q.md`, `REFEREE2-c19-rs-real-zero-completion-band-server.md`
- `thmD_controls.py/.log/.json` (Theorem D controls); `r19_checks.py/.log/.json` (u4, hq2, rs; its D10 and census
  blocks are superseded); `r19_checks2.py/.log/.json` (D10 exact, census constant).
- `lanes_records.jsonl` (seven records for the learn step), `lanes.jsonl` (this lane).
- Compute: local only, through `scripts/memcap.sh 8`; interpreters `/tmp/g-chan-venv` (mpmath, numpy) and a scratch
  venv `/tmp/c20-ref-venv` (sympy, numpy, mpmath); largest allocation 36 MB; total run time about 4 minutes.
