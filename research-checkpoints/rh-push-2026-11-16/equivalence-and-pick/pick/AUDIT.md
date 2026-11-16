# Audit of the xi Pick-stage positivity claims (PRs #47, #48, #50, #51–#55)

Date: 2026-11-16. This is a read-only audit. The PR refs were fetched as
`refs/pr/N`, and nothing was pushed, commented on or edited. All files
and replays are under `tmp/research-2026-11-16/pick/`. Nothing here
claims RH.

## What the stage claims are

- F(x) = ξ(1/2+x) and L = F'/F.
- Stage k is the claim that the real Pick matrix
  P_ij = (L(x_i) + L(x_j))/(x_i + x_j) is positive definite for **every**
  choice of k distinct positive reals.
- The nodes are free, not fixed. The claim covers the whole positive axis
  and every coincidence-free configuration.
- Each stage k is a finite-order statement. Positivity at all orders is
  equivalent to RH, as the PRs themselves state.

## Per-stage verdicts

| Stage | PR | External inputs | Verdict | Implied by known results? |
|---|---|---|---|---|
| 2 | #47 | Csordas: theta squared-variable log-concavity | **VERIFIED** (read; elementary) | Yes, from the classical strip alone: the sector argument gives h'<0 and j'>0, which is the 2-node condition 0<xL'<L. |
| 3 | #48 | Platt–Trudgian (PT) to 3e12; first two ordinates in (14,15) and (21,22); the strip; h(1/4)=2+γ_E−log 4π | **VERIFIED** | Yes. The proof *is* an implication from PT plus the strip. |
| 4 | #50 | Same as stage 3 | **VERIFIED** | Yes, same type of implication. |
| 5 | #53 (on #51, #52) | No zero data; theta series and Arb certificates | **VERIFIED for the steps #53 adds; replay passes.** One soft spot (see below). | Yes, by a different route: NEXT_STAGE.md derives K ≤ 12 from PT plus Trudgian's S(t) bound. |
| 6 | #55 (on #54) | No zero data; theta series and Arb certificates | **VERIFIED for the steps #55 adds; replay passes**, conditional on PRs #53/#54, which were read but not re-proved. | Yes, as for stage 5. |

### Stage 3 (PR #48): checked line by line

- **Criterion.** I re-derived the anchor Schur congruence (2.6) and the
  identities (2.10), (2.12)–(2.14) and (3.1)–(3.3), and checked them with
  sympy (`sympy_identities.py`, all differences 0). The two-node
  determinant factorization and the tangent-line argument are correct.
  Only sufficiency is needed, and it holds.
- **Second sign, B > 0.** The sector lemma is correct. Its stated use of
  PT ("height two") is only that there are no zeros with γ ≤ 2, which is
  classical.
- **First sign on u ≤ 10^4.** I checked:
  - the expansion (4A.9);
  - the drop of h0·e'', e·h0'' and e·e'' (|arg λ| < π/6);
  - the bounds |h0'| < 1/2 and |e'| < 3/T²;
  - the Lagrange identity (4A.10);
  - (4A.3)–(4A.4), including the value h(1/4)=2L(1/2)=2+γ_E−log(4π) ≈ 0.0462.
  The numerical margin is 8·216²/10484⁶ ≈ 2.8e−19 against an error of
  ≤ 7e−25.
- **First sign on x ≥ 100.** Every line checks: the Euler-product tails,
  the digamma/trigamma bounds, (14)–(20) and the constant 58/225.
- **First-zero enclosures.** Re-certified with Arb (`zeros_20000.json`):
  γ_1 = 14.1347…, γ_2 = 21.0220….

### Stage 4 (PR #50): checked line by line

- **Reduction.** Four nodes reduce to three-node positivity of R_a. The
  identities in (10) are correct. The reciprocal-divided-difference lemma
  (14)–(18) holds, including both orientations and the
  tangent-denominator positivity. This is the classical fact that the
  Schwarzian condition is order-2 matrix monotonicity of 1/h and j.
- **Identities.** (21), (22) and K_L = j[x²,y²] − xy·h[x²,y²] check with
  sympy. The spectral forms (24)–(25) are also correct.
- **Bounded interval.** The tail estimates (8)–(11) and margins
  (14)–(16) check: 3.2e−28 > 4e−51 and 2.76e−23 > 2e−25.
- **Large x.** The bounds (18)–(29) check, including the box
  9/20 < A < 11/20, −11/20 < B < −9/20, 17/20 < C < 11/10, and the
  constants 1/4 and 1481/600.

### Stage 5 (PR #53, depending on #51 and #52)

These results come from a delegated sub-audit; I read its report.

**Replay.**

- `run_checks.py` passes all 10 gates in about 52 s: 201 exact checks,
  12,604 interval cells, 602 recomputed moments, and the 4,096-cell PR
  #52 dependency.
- The replay outputs match the committed JSON byte-for-byte except for
  the Python version. The PRs pin 3.12; the replay ran on 3.15.
- PR #52 replays in about 5 s.

**Logic.**

- The count is sound: two full preservations, then basic, then positive,
  give four Schur pivots plus a last positive entry.
- The Peano-kernel compensation theorem was re-derived by hand: total
  nonnegativity, the W5 = G·W2 identity, and the ratio propagation.
- Cell coverage was checked:
  - u ≤ 9/256, [3/16, 4], and t ≥ 4 analytically;
  - a ≤ 100 by cells and a ≥ 100 analytically, with the D0 expansion and
    error signs re-derived in sympy.

**Soft spot (not a disproof).** Integrability and the Fubini step as
t→∞ (compensation §7, global §7) rest on asymptotic equivalences. Those
equivalences are stated without explicit constants. The claims look
plausible but are not quantified in the PR.

**Not re-derived here.** The PR #51 and #52 comparison theorems, and the
Schur framework of PRs #47/#48/#50 as used by #53, were read, not
re-proved.

**External inputs.** No finite-height zero data is used.

### Stage 6 (PR #55, depending on #54)

These results come from a delegated sub-audit; I read its report.

**Replay.** `run_checks.py` passes all 11 gates in about 19 s: 137 exact
checks, 70 exact tail checks, and 4,472 interval cells at 512 bits.
Coverage was checked in the code:

- the origin cells tile t ∈ [0, 3/16];
- the compact cells are contiguous on [3/16, 4], with forced breaks at
  1/2 and 9/16, and an unclassified cell raises an error;
- t ≥ 4 is covered by an explicit analytic tail.

**Chain.** The chain runs as follows:

1. Scalar certificates: K_H < 0, S_U > 0, and one ordered crossing of
   K_U in (1/2, 9/16).
2. Oriented variation diminution.
3. Transitions using the PR #54 identities.
4. PR #53 compensation with the PR #54 origins. This gives W_{H,2} > 0
   and W_{P,2} > 0 for every anchor pair.
5. The third pair is full, the fourth basic, the fifth positive, so six
   positive pivots.

The sub-auditor re-derived each step and found no error. The existential
"sufficiently large" thresholds appear only in two supporting notes
(anchor tail, spatial tail). The chain does not cite those notes, and
global §7 excludes them explicitly.

**Minor issues.**

- README line 49 overstates the spatial-tail note: it says the note
  "resolves the turning region", but the chain does not use it.
- Endpoint regularity at t → ∞ is a qualitative asymptotic argument made
  for each fixed anchor.

**External inputs.** No zero data is used.

**Not re-derived here.** The PR #53/#54 inputs and the PR #51 helper
enclosures were read or trusted, not re-proved.

## Is any stage new information?

**No stage gives new information about zero locations.** Each stage
k ≤ 12 follows from Platt–Trudgian plus explicit zero counting. The
implication is written out in NEXT_STAGE.md:

1. Use the identity P = Loew_j + X·Loew_{−h}·X.
2. Dobsch–Donoghue reduces order-K matrix monotonicity of j and of
   −h + ½·h_7 to a pointwise K×K Hankel condition.
3. The spectral form of that Hankel condition has tail error at most
   C_{2K} · Σ_{γ>T} γ^{−2} · Λ² ≈ K⁴ · 1.5e−12 · Λ², which an Arb
   certificate controls.

PRs #48 and #50 state openly that they are finite consequences of PT.

**What is new in #51–#55.** These PRs prove the same finite statements
without zero data, through theta-kernel preservation. That is a
different proof technique. It matters for RH only if it becomes an
induction valid at every depth, and the PRs list that induction as open.

None of the PRs claims to extend verified height or to prove RH. Their
scoping statements are accurate.
