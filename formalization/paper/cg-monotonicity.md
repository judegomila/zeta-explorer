# Lemma CG: the Euler-product head coefficients c_n(t) are nonnegative and nondecreasing

Date: 2026-10-01 (r2 round). Closes the G0 item of Raymond's chain (Zenodo 22867547) "c_n(t) ≥ 0 and
nondecreasing in t" (`src/data/b145-raymond-referee-2026-10-01.js`, `openForG0` item 2;
`src/data/r2-second-referee-2026-10-02.js`: "C_g monotonicity SOUND … closes the G0 item once written up").

Status. This document gives a written proof of an algebraic identity (Lemma CG, §1–2) and of its
consequences (§3) for every integer n ≥ 1, every real u ≥ g and every t ≥ 0. No numerical step enters
the proof. The argument was graded SOUND by two internal referee passes (Track A referee recorded in
`b145-floor-2026-10-01.js`; `r2-second-referee-2026-10-02.js`, 9e-34 identity check). This write-up
itself has not been refereed. Arb spot-check: `verify_cg_monotonicity.py` (§6; PASS, 0 failures).
§8 lists the G0 items that remain open. Nothing about Λ is proved here.
PT Λ ≤ 0.2 stands. RH open. NO QED.

---

## 0. Definitions

Raymond's finite Euler multiplier (main paper §2; Analytic Foundations (AF) Part I eq. (6.2)):

    E_t(s) = Π_{p ∈ {2,3,5}} (1 − b_t(p) p^{−s}),        b_t(x) = exp(t log²x / 4)   (x > 0).

Expanding, E_t(s) = Σ_{d | 30} μ(d) β_d(t) d^{−s} with β_d(t) = Π_{p|d} b_t(p) = exp(t q_d / 4),
q_d = Σ_{p|d} log²p (β_1 = 1). With P_N(s) = Σ_{m≤N} b_t(m) m^{−s}, the coefficient of n^{−s} in
E_t(s)P_N(s) for n ≤ N is

    c_n(t) = Σ_{d | (n,30)} μ(d) β_d(t) b_t(n/d)                                         (0.1)

(Raymond main paper §6, display before eq. (11); AF Part I §6 after eq. (6.2)). For n ≤ N the
constraint n/d ≤ N is automatic, so (0.1) is the complete coefficient.

For squarefree g | 30 and real u > 0 put

    C_g(u, t) = Σ_{d | g} μ(d) β_d(t) b_t(u/d).                                          (0.2)

The divisors of (n, 30) are the divisors of g = gcd(n, 30), so c_n(t) = C_g(n, t) with g = gcd(n, 30).
This is the function of Track A's "C_g monotonicity lemma" (`b145-floor-2026-10-01.js`).

Notation for Lemma CG. P = P(g) is the set of primes dividing g; w = u/g; ℓ = log w; ℓ_p = log p;

    π_p = π_p(u, t) = exp(t ℓ_p ℓ / 2) − 1          (p ∈ P),
    r_pq = r_pq(t)  = exp(t ℓ_p ℓ_q / 2) − 1        ({p, q} ⊆ P, p ≠ q),
    Cov(P) = { (T, E) : T ⊆ P, E ⊆ binom(P, 2), T ∪ ⋃E = P },

where ⋃E is the set of endpoints of the edges in E. |Cov(P)| = 1, 1, 5, 45 for |P| = 0, 1, 2, 3.

## 1. Lemma CG (covering identity)

**Lemma CG.** For squarefree g | 30, real u > 0 and real t,

    C_g(u, t) = b_t(w) β_g(t) Σ_{(T,E) ∈ Cov(P)} Π_{p∈T} π_p Π_{{p,q}∈E} r_pq.            (CG)

For P = ∅ (g = 1) the right side is b_t(u).

## 2. Proof

*Step 1 (one divisor).* Fix d | g with prime set D ⊆ P and put S = P \ D. Then u/d = w·Π_{p∈S} p, so
log(u/d) = ℓ + Σ_{p∈S} ℓ_p, and

    log(β_d(t) b_t(u/d)) = (t/4)[ Σ_{p∈D} ℓ_p² + (ℓ + Σ_{p∈S} ℓ_p)² ]
                         = (t/4)[ ℓ² + Σ_{p∈P} ℓ_p² ] + (t/2)[ Σ_{p∈S} ℓ ℓ_p + Σ_{{p,q}⊆S} ℓ_p ℓ_q ],

using Σ_{p∈D} ℓ_p² + Σ_{p∈S} ℓ_p² = Σ_{p∈P} ℓ_p² and (Σ_{p∈S} ℓ_p)² = Σ_{p∈S} ℓ_p² + 2Σ_{{p,q}⊆S} ℓ_pℓ_q.
The first bracket is log(b_t(w) β_g(t)). Exponentiating,

    β_d(t) b_t(u/d) = b_t(w) β_g(t) Π_{p∈S} (1 + π_p) Π_{{p,q}⊆S} (1 + r_pq).               (2.1)

*Step 2 (expansion).* Π_{p∈S}(1 + π_p) Π_{{p,q}⊆S}(1 + r_pq) = Σ Π_{p∈T} π_p Π_{{p,q}∈E} r_pq, summed over
T ⊆ S and E ⊆ binom(S, 2). A pair (T, E) with T ⊆ P, E ⊆ binom(P, 2) occurs in this sum if and only if
V(T, E) := T ∪ ⋃E ⊆ S.

*Step 3 (Möbius inversion).* μ(d) = (−1)^{|D|} = (−1)^{|P| − |S|}, and d ↦ S is a bijection from the
divisors of g onto the subsets of P. Summing (2.1) with these signs and exchanging the finite sums,

    C_g(u, t) = b_t(w) β_g(t) Σ_{T ⊆ P, E ⊆ binom(P,2)} Π_{p∈T} π_p Π_{{p,q}∈E} r_pq · Σ_{S : V(T,E) ⊆ S ⊆ P} (−1)^{|P \ S|}.

With R = P \ S the inner sum is Σ_{R ⊆ P \ V(T,E)} (−1)^{|R|} = (1 − 1)^{|P \ V(T,E)|}, which equals 1 if
V(T, E) = P and 0 otherwise. This is (CG). ∎

## 3. Consequences

**Corollary CG1 (sign and joint monotonicity of C_g).** Let t ≥ 0 and u ≥ g. Then ℓ ≥ 0, so π_p ≥ 0
and r_pq ≥ 0, and C_g(u, t) ≥ 0. Each of b_t(w) = exp(tℓ²/4), β_g(t), π_p(u, t), r_pq(t) is nonnegative,
nondecreasing in t on [0, ∞) and nondecreasing in u on [g, ∞) (β_g and r_pq do not depend on u).
Products and finite sums of nonnegative nondecreasing functions are nonnegative and nondecreasing. Hence

    0 ≤ C_g(u′, t′) ≤ C_g(u, t)      whenever g ≤ u′ ≤ u and 0 ≤ t′ ≤ t.                    (3.1)

The t-derivative is the sum of the nonnegative terms produced from (CG) by the product rule, with
∂_t π_p = (ℓ_pℓ/2) e^{tℓ_pℓ/2}, ∂_t r_pq = (ℓ_pℓ_q/2) e^{tℓ_pℓ_q/2},
∂_t(b_t(w)β_g(t)) = ((ℓ² + Σ_{p∈P} ℓ_p²)/4) b_t(w)β_g(t). ∎

**Corollary CG2 (Raymond's statement, every n).** For every integer n ≥ 1, t ↦ c_n(t) is real-analytic,
nonnegative and nondecreasing on [0, ∞).

*Proof.* c_n(t) = C_g(n, t) with g = gcd(n, 30), and g | n gives u = n ≥ g. Apply CG1. ∎

Raymond states this for n ≤ N0 (main paper §6; AF Part I §6); the project's G0 entry recorded it as
"measured for n ≤ 1024". CG2 has no restriction on n.

**Corollary CG3 (values and zero set).** c_n(0) = 1 if gcd(n, 30) = 1 and c_n(0) = 0 otherwise. For
t > 0, c_n(t) = 0 if and only if n ∈ {2, 3, 5}; c_1 ≡ 1, c_2 = c_3 = c_5 ≡ 0, and c_n(t) > 0 for every other n.

*Proof.* At t = 0 every π_p and r_pq vanishes, so the covering sum is 1 if P = ∅ and 0 otherwise. Let
t > 0. If P = ∅, c_n(t) = b_t(n) > 0. If P ≠ ∅ and w > 1, every π_p > 0 and (T, E) = (P, ∅) contributes a
positive term. If w = 1 (n = g), every π_p vanishes and the nonzero terms are those with T = ∅ and
⋃E = P; since r_pq > 0 for t > 0, such terms exist if and only if |P| ≥ 2. So c_n(t) = 0 exactly when
n = g with |P| = 1. ∎

At t = 0 the derivative is c_n′(0) = ℓ_pℓ/2 for P = {p}, ℓ_pℓ_q/2 for P = {p, q}, and 0 for |P| = 3 (every
cover of three vertices uses at least two factors). This is the "min c_n′ = 0 at t = 0" of the earlier
50-digit grid measurement.

**Corollary CG4 (time cells).** For [t_L, t_R] ⊂ [0, ∞) and t ∈ [t_L, t_R]:
0 ≤ c_n(t_L) ≤ c_n(t) ≤ c_n(t_R). In particular a negative lower endpoint of an interval enclosure of
c_n(t) may be replaced by 0.

**Corollary CG5 (head bins).** Let n_1 ≤ n_2 be integers, g | 30 squarefree with g ≤ n_1, and t ≥ t_L ≥ 0.
Then, for every n ∈ [n_1, n_2] with gcd(n, 30) = g, c_n(t) ≥ C_g(n_1, t_L) ≥ 0, and so

    Σ_{n_1 ≤ n ≤ n_2, gcd(n,30)=g} c_n(t)  ≥  #{n ∈ [n_1, n_2] : gcd(n, 30) = g} · C_g(n_1, t_L).

C_g is evaluated at the real argument u = n_1, which need not satisfy gcd(n_1, 30) = g.

*Proof.* (3.1) with u = n ≥ u′ = n_1 ≥ g and t ≥ t′ = t_L. ∎

**Corollary CG6 (combined head labels).** For 2 ≤ n ≤ N0 the combined head label n of Raymond's core Q
has amplitude c_n(t) n^{−σ_U} ≥ 0 and phase e^{iτ log n} (τ = x/2 + πt/8); no sign is absorbed into the
phase. Consequently Σ_{n ≤ N0} |c_n(t)| n^{−σ} = Σ_{n ≤ N0} c_n(t) n^{−σ}, which is the head part of AF
eq. (6.3): with m_d = μ(d)β_d(t), E_+ = Σ_{d|30} |m_d| d^{−σ} and P^{(0)}_M = Σ_{m≤M} b_t(m) m^{−σ},

    E_+ P^{(0)}_{N0} − 2 Σ_{μ(d)<0} |m_d| d^{−σ} P^{(0)}_{⌊N0/d⌋}
        = Σ_{n ≤ N0} c_n(t) n^{−σ} + Σ_{d>1} Σ_{N0/d < m ≤ N0} |m_d| b_t(m) (dm)^{−σ},

because Σ_{n≤N0} c_n n^{−σ} = Σ_d m_d d^{−σ} P^{(0)}_{⌊N0/d⌋} and |m_d| − m_d = 2|m_d| for μ(d) < 0, 0 otherwise.
Subtracting the constant label gives A_U in (6.3); B_U is the same computation with log-weights. AF §7's
"the first-head coefficients are nonnegative … consequently A0 decreases in L" is the same fact. ∎

## 4. Where the chain uses Lemma CG

| location | statement used | corollary |
|---|---|---|
| Raymond main §6, eq. (11): lower first-head amplitude on a time cell, n ≤ 1024 | c_n(t) ≥ c_n(t_L) ≥ 0 on [t_L, t_R] | CG4 |
| Raymond main §9 ("Zero may replace a negative lower endpoint only where the analytic positivity theorem has established it"); `cl=[max(0,lower_int(z)) for z in coef]` in Raymond's `code/certify_joint.py` (line 54 of the joint-probe source in `Scientific_Source.zip`) and in `tmp/b145-B-lib.py` `joint_pairs` | c_n ≥ 0 | CG4 |
| AF I §6, eq. (6.3): head cancellation through N0 | c_n(t) ≥ 0, n ≤ N0 | CG6 |
| AF I §6 last paragraph and §9 ("coefficients regenerated at the upper time endpoint … graph monotonicity justifies that direction"): exceptional-pair debit D_C | c_n(t) ≤ c_n(t_R) | CG4 |
| AF I §7 ("first-head coefficients are nonnegative … A0 decreases in L") | c_n ≥ 0 | CG2 |
| Track A head bins 1025..N0 (`b145-A-gains.py`, `b145-B-lib.gains_cell`: `Cg[k][g] = Σ μ β b(log n1 − log d)` at the bin's lower end, used only where its lower endpoint is > 0) | Σ over a bin and class g of c_n(t) ≥ count · C_g(n_1, t_L) | CG5 |
| floors at 1.6X, 1.65X, 2.6X (N0 = 874038, 887590, 1114185) and r2 structured floors | the above with larger N0 | CG2, CG5 (no restriction on n) |

With CG5 the Track A bin bound can use the covering form, which is free of cancellation: its lower
endpoint is ≥ 0 by construction, so no bin needs to be dropped for a straddling enclosure. (The stored
Track A tables use the Möbius form and drop a class when its lower endpoint is ≤ 0; that is conservative.)

## 5. Relation to Raymond's graph argument

Raymond (AF I §6) writes n = p_1 ⋯ p_k with all prime occurrences, expands
b_t(n) = Π_i b_t(p_i) Π_{i<j} [1 + (e^{t ℓ_{p_i} ℓ_{p_j}/2} − 1)] over graphs on the k occurrences, marks one
occurrence of each p | gcd(n, 30), and states that Euler inclusion–exclusion keeps exactly the graphs in
which every marked occurrence is incident to an edge. Lemma CG is that expansion with all unmarked
occurrences merged into one vertex w (ℓ = log w is the sum of their logarithms): for a marked p,
1 + π_p = e^{tℓ_pℓ/2} = Π_{unmarked j} (1 + (e^{tℓ_pℓ_{p_j}/2} − 1)), so π_p is the total weight of the nonempty
edge sets from p to the unmarked occurrences; r_pq is the edge between two marked occurrences; the
condition T ∪ ⋃E = P says that every marked occurrence has an edge; edges among unmarked occurrences
are inside b_t(w); repeated primes (p² | n) are unmarked occurrences inside w. §2 replaces the graph
language by a three-step Möbius computation and states the range of validity (all n ≥ 1; all real
u ≥ g; all t ≥ 0).

## 6. Arb spot-check

`/tmp/s145venv/bin/python formalization/paper/verify_cg_monotonicity.py` (python-flint 0.8.0, 128-bit
balls, 53 s; `--quick` for every 8th cell endpoint). Result on 2026-10-01: PASS, 0 failures.

1. n ≤ 1024 at all 609 cell endpoints t = i/4000 (0 ≤ i ≤ 608): (CG) and the Möbius form (0.2) overlap
   (623,616 cases); all 2,114,448 covering terms have lower endpoint ≥ 0; c_n(t) certified > 0 except
   n ∈ {2, 3, 5} (exactly 0) and t = 0 with gcd(n, 30) > 1 (exactly 0); c_n(0) = [gcd(n, 30) = 1].
2. t-monotonicity: 620,160 consecutive-time increments certified > 0 for n ∉ {1, 2, 3, 5} (exactly 0 for
   those four); the covering-form derivative is certified ≥ 0 and overlaps the Möbius-form derivative.
3. Every n ≤ 1,114,185 (N0 at 2.6X; covers N0 = 690988 and 874038) at t ∈ {1/4000, 300/4000, 607/4000,
   41/250}: identity, term signs and the sign pattern of CG3 (4,456,740 values).
4. Track A head bins at N0 = 690988 (829 bins of multiplicative width 1/128): c_n(t) ≥ C_g(n_1, t_L) for
   t ∈ {t_L, t_R}, every n in six bins (first two, two middle, last two) and four cells (82,208
   comparisons; equality at t = 0, where C_g(u, 0) = [g = 1]).
5. Raymond's two constructions of the head coefficients (complete inclusion–exclusion; descending
   multiplication by the three Euler factors) overlap (CG) for every n ≤ 1024 at six cells (6,144 values).
6. 6000 random (g, u, t) with u ∈ [g, 3·10⁶ g], t ∈ [0, 0.2]: identity and term signs.
7. Cancellation: at t = 10⁻³⁰, 64-bit precision, n = 210, the Möbius form returns [± 3.3e-29] (sign not
   decided) and (CG) returns [2.83e-60 ± 7.8e-64] > 0. This is why a direct Arb evaluation of (0.2) (the
   "naive arb check" of the b145 referee) was inconclusive near t = 0: the Möbius terms are of size 1 and
   cancel to O(t) or O(t²), while the covering terms involve no cancellation.

The spot-check is not part of the proof.

## 7. Corrections to the record

1. *Location.* The c_n statement is in §6 of Raymond's v1.0 manuscript ("Uniform lower coefficient
   bounds and complete spatial coverage", display before eq. (11)) and in AF Part I §6 (after eq. (6.2)).
   Project modules call it "main §5" (§5 of the manuscript is the Euler gain and Theorem 4).
2. *Range.* Raymond claims n ≤ N0; the project G0 entry said "measured for n ≤ 1024". Lemma CG gives every
   n ≥ 1 and t ≥ 0, and monotonicity of C_g in the real variable u ≥ g.
3. *One statement, not two.* The ledger of `r2-second-referee-2026-10-02.js` lists "C_g monotonicity" and
   "the c_n G0 item" separately. CG2 is CG1 at u = n; the Track A bin use is CG5.

## 8. G0 status after this lemma

G0 = the referee gate on Raymond's analytic chain (Zenodo 22867547) that every Λ value of the b145/r2
stack inherits. Items as recorded in `b145-raymond-referee-2026-10-01.js` (`openForG0`) and
`r2-second-referee-2026-10-02.js` (ledger), with their status after this document and
`joint-pair-arbitrary-shift.md`:

| # | item | status before | status now | needed by |
|---|---|---|---|---|
| G0-a | c_n(t) ≥ 0 and nondecreasing (main §6 eq. (11); AF I §§6, 7, 9; Track A bins) | MEASURED (n ≤ 1024) | PROVED for every n ≥ 1, t ≥ 0 (this document; write-up unrefereed) | every joint floor, both routes |
| G0-b | Raymond's joint-pair lemma (Theorem 4) at shifts outside his catalogue, and at heights and floor heights his replay does not compute | OPEN | PROVED as an implication (`joint-pair-arbitrary-shift.md`, Theorem 4′): one-point input (OP) at both probe points + Lemma CG + Lemma R + (Dom) ⇒ joint floor, for every shift interval I ⊂ (0, 2); (Dom) checked on every table used; stored table entries at the six out-of-catalogue ratios reproduced by an independent implementation. Unrefereed. No shift-specific hypothesis remains: the item reduces to G0-d | out-of-catalogue ratios: Route H only (and the superseded b145 PT value 0.147273668782792); catalogue ratios at other heights / floor heights: Route P (U2 at 2.6X) and Route H |
| G0-c | main-paper Lemma 2 (surplus identity), Lemma 3 (paired phases), Theorem 4 (two-probe floor), with (3), (5)–(13) | self-review only (one reviewer, 2026-09-30) | written proofs in `joint-pair-arbitrary-shift.md` §§3–8 (second internal pass). OPEN as a referee item: no independent reader | both routes |
| G0-d | AF Part I §§6–9 = the one-point input (OP) (Raymond main eq. (1)): moment identity (6.1), masses (6.3), time-Taylor bound (7.1), activation envelopes (8.1)–(8.5), assembly (9.1)–(9.2) | self-review only | OPEN. Re-derived in this round without finding a defect: (6.1); (6.3) given CG6; the range −K_L ≤ κ_{d,n} ≤ 0 and |A0″| ≤ K_L² A_abs(t_L) behind (7.1); the integrands of (8.1) (amplitude × Jacobian n = e^{v0+w}); (9.1); the passage from (9.1)–(9.2) to eq. (1) (`joint-pair-arbitrary-shift.md` §2). Not re-derived: the closed forms of J_0, J_1 and the envelopes (8.1)–(8.3) (including the infinite interval and the e^{10⁻⁵} absorption), the block enclosures of §7, the Euler cap E_ℓ ≥ phase-free cap, the enumeration bound for exceptional pairs | every floor, both routes |
| G0-d′ | AF Part I §§4–9 at floor heights other than X = 6000000185827 (1.6X, 1.65X, 2.6X) | not recorded | OPEN (exactness note). The written text is at X_PT; the env-patched producer regenerates every numerical premise at the new X and `validate_cells` re-checks them; the explicit X-dependent claims in the text (e.g. AF §4.1 "r ≥ V′/π − 4 > 100", "D ≥ 100", (4.6) on x ≥ X − 4) hold a fortiori for larger X. Not separately refereed | Route P (U2 at 2.6X), Route H |
| G0-e | external (non-project) referee of the whole chain | OPEN | OPEN | both routes |

Not G0 (graded SOUND by internal referees, with expository gaps that are not yet written, except 2a):
AF §§2–5 (GAP 2a is written out as Lemma B.3, application 2, in `lemma-B-two-band.md`; GAPs 3a, 3b not
written), AF §§10–12 (GAP-1 to GAP-4 not written; GAP-1, GAP-2, GAP-4 also enter the BB1/BB2 transplant
of `lemma-B-two-band.md` §6.1), AF Part II. Lemma R and the C_g lemma are Track A inputs, not Raymond
G0 items; Lemma R is SOUND on two internal passes.

So, after this round, the G0 items that remain open are G0-c (independent reading of Lemmas 2–4 and
Theorem 4′), G0-d (AF §§6–9), G0-d′ (the X-transfer of AF §§4–9) and G0-e (external referee). G0-a is
closed by a written proof; G0-b is reduced to G0-d.

## 9. Grades

* **Proved here (written proof, unrefereed):** Lemma CG; Corollaries CG1–CG6.
* **Graded SOUND before this write-up (internal, two passes):** the covering-graph argument (b145 Track A
  referee; r2 second referee).
* **Certified numerics (ball arithmetic), not part of the proof:** the spot-check of §6.
* **Not claimed:** any statement about Λ; any statement about combined coefficients beyond the head: for
  n > N0 the truncated sums Σ_{d|(n,30), n/d ≤ N0} μ(d)β_d(t) b_t(n/d) can be negative, and Raymond keeps
  those terms as separate signed tail labels.

PT Λ ≤ 0.2 stands. RH open. NO QED.
