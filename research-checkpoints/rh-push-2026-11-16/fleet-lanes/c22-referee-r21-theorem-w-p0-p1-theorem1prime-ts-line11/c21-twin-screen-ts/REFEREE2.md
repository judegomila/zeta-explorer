# REFEREE2: `c21-twin-screen-ts/TWIN_SCREEN.md` (sample of table rows; Lemma TS-1)

Second reading, 2026-11-20, lane `c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11`. Method: 22 rows
were sampled across the three tables (10, 7, 5) and each verdict was compared with the text of the cited map
row in `push/OBSTRUCTION_MAP.md`, the device entry in `engine/curated/devices.json` and the cited line of
`campaign/screened.jsonl`, all read as text. Lemma TS-1 was rederived. The statements R1-S, R2-S, R3-E, R3-C
are relative to referee files of round 20 and were not re-read here. No statement about zeros of zeta.

## Verdict

- **Table verdicts: hold in all 22 sampled rows; four corrections of wording or citation (C1 to C4), none
  changes a verdict.**
- **Lemma TS-1: holds with one correction of a sentence (C5).** Parts (ii) and (iv) are relative to Theorems
  A and C of the euler-shape lane and were checked only for the logic of the reduction.

## Sampled rows

Table (i), device types.

| # | Device | TS verdict | Cited row, text checked | Result |
|---|---|---|---|---|
| 4 | positive-kernel-transport | 3 | P3: "No new zero information at any finite stage"; control "DH (passes orders 2..148)" | agrees; see C1 for G13, G17 |
| 6 | dual-measure-compactness | 2 at each finite scale, TYPED; limit step P36 | P36: "A fixed cofinal b is controlled only in mean square" | agrees |
| 8 | euler-fe-phase-at-height | 2 (1 for forms of degree <= 2) | P40: "The coupling ... is the functional equation alone and holds for DH up to O(t^-2)" | agrees, verbatim |
| 10 | monotone-flow-functional | none, F (HEAT) | F1: "Every horizontal-strip statement true for xi is flow-critical"; Q20: non-increasing functional bounds t = 0 only by t < 0 | agrees |
| 12 | stage-limit | 3 (2 at each stage) | Q19: stage chain "carries no information"; Q21: stage bound is the trivial bound; device evidence "rows Q19, Q21" | agrees |
| 13 | section-extraction | 2 | Q12 (finite P, polydisc), Q22 (finite P or D^inf) | agrees |
| 15 | finite-support-positivity | 2 (P9), 3 (P3, P21) | P9: tests on [0, T); P21: "DH blocks positive through order 164 (even)"; P18: "{4^k} keeps positivity when an off-line quadruple at height >= 1000 is added" | agrees, all three quotations exact |
| 26 | coherent-set-large-sieve | none, FL | Z15: "for r = 6, B >= 5/6"; device state "floored" | agrees |
| 52 | window-fe-rigidity | none, F (translate WT) | S12, S12b: translate zeta(s + i alpha) passes | agrees |
| 55 | tz-one-sided-completion-bound-band | 1 and 2 (theta' < 1); only 2 at theta' = 1 | P58: "ZQ passes the band-u device for theta' < 1 ... the model has no margin at theta' = 1"; "at theta' = 1 it is the target in a window" | agrees |

Table (ii), statistic classes.

| # | Class | TS verdict | Line read | Result |
|---|---|---|---|---|
| s2 | ordinate-list statistic | none, F (T-NR) | line 5: "ordinate-list statistic: T-NR identical to zeta" | agrees |
| s4 | pointwise sign test | none, V | line 3: "pointwise sign test = local zero detector (verified height in another form)" | agrees |
| s5 | Weil positivity, finite support | 2 | line 14: "onset at the coefficient count that resolves the first off-line zero" | agrees; see C2 |
| s6 | finite-order positivity | 3 (Pick), "3, ARGUED" (Li, Toeplitz) | line 22: "verified height in another form (map row P16): Li-type onset" | agrees; the Li verdict rests on Remark R3-add, labelled ARGUED in TS |
| s7 | onset at first differing prime | 2 | lines 44, 70, 106: "onset is the first prime where the coefficients differ from zeta's"; "T-NR q = 1000003 fails only from N = q" | agrees |
| s8 | prime-torus statistic at a finite prime set | 2 | line 9: "torus statistics are rotation invariant; separation only at t<=P" | agrees; see C3 |
| s12 | premise false for zeta | none, X | line 6: "premise false for zeta" | agrees |

Table (iii), geometric objects.

| Object | TS verdict | Row read | Result |
|---|---|---|---|
| bridge | none: I/T (G1, G2, G6) | G6: "H_c >= 0 iff Gamma_- = 0 iff RH ... Holds for any even F of order one" | agrees |
| antibridge | band form 1 and 2 (P58); bare: T | P58 (as row 55); G1: "the whole target remains" | agrees |
| Klein | none: I (G13), T (G17) | G13: "blind to off-line pairs"; G17: "Euler-blind ... capped by class number one ..., inside verified height" | verdict "none" agrees; see C4 for the kind letter |
| zero channels | none: V (G7), T (G11); join E: F | G7: "restates verified height"; G11: "a restatement of Weil positivity ... invariant under Lambda -> eps_n Lambda" | agrees |
| vortex | none: T; join H: F (G38) | F1; G38: "T-NR at a prime p0 = 1 mod q has identical ratios" | agrees |

## Corrections

- C1 (table (i), row 4, closing column "also P3 (verified height), G13, G17"). G13 and G17 are the Klein rows
  (seam topology; Klein-Fricke). They are in the device's evidence list in `devices.json` ("rows P3, P7, G13,
  G17", through the node `klein-phase-transport-certificate`), so the citation is inherited, but they do not
  close a positive-kernel transport by reason 3. The row should read "P3, P7; the Klein rows G13, G17 are
  kind I and V".
- C2 (table (ii), row s5, last column). The text in quotation marks, "no fixed support separates T-NR(q) or a
  flip at a prime beyond it", is not the text of line 70, which reads "no fixed support separates T-NR(q) or a
  flip at P". The meaning is the same; the quotation marks should go, or the line be quoted exactly. Line 70
  is listed as an example under s7, not s5.
- C3 (table (ii), row s8, example line 117). Line 117 (slug `s3-torus-short-prime-sum-extremes`) has the
  obstruction "twists separate only at the support that resolves an off-line pair at that height; zeta's pass
  there is a sampled local zero-free statement": by its obstruction field it belongs to s5 (or s4), by its
  slug to s8. The verdict is 2 under either class.
- C4 (table (iii), row Klein). G17 is entered as kind T (restatement of the target). The row says the method
  is Euler-blind (non-Euler Epstein class as control) and its one separating step lies inside verified
  height: kinds F and V. In the join column, "H: none, I/F (G17, G33: T-NR, E_a pass)" attributes the controls
  T-NR, E_a to both rows; they are the controls of G33; the control of G17 is an Epstein class with h > 1.
- Stale count (section 3 header and the count paragraph): "56 devices". `devices.json` now has 58 entries;
  entries 57 (`br2-sparse-pole-lattice-regime-k`) and 58 (`br3-euler-shape-rigidity-regime3`) were added
  after TS version 1 and have no TS row. Both are the lead BR (section 6 item 1 covers them in substance).

## Lemma TS-1

(i) zeta = G N gives 1 = sum_{d | n} a_G(d) c(n/d) (c(1) = 1). If c(m) = 0 for 2 <= m < P then for n < P the
only surviving term is d = n, so a_G(n) = 1. Conversely, if a_G(m) = 1 for m < P then G and zeta agree to
order P and N = zeta/G has c(m) = 0 for 2 <= m < P. Since c is multiplicative, c(m) = prod c(p^k) over the
prime-power components of m, each of which is at most m < P; so "c(m) = 0 for all 2 <= m < P" is equivalent
to "c(p^k) = 0 whenever p^k < P", that is, to the first non-constant term of n_p being y^(j_p) with
p^(j_p) >= P. The statement for Lambda_G follows from the triangular recursion. **Holds.**

- C5 (last sentence of the proof: "The equivalence does not use the functional equation or the Euler product
  of G"). True for the first equivalence (a_G = 1 below P iff c = 0 below P). The second equivalence (to the
  local condition) uses that c is multiplicative, which is the Euler product of G. The sentence should say
  "the first equivalence".

Twin table of R2-S, checked by hand: HQ1, 1 + eps y/(1 - y)^2 = 0 iff y^2 - (2 - eps) y + 1 = 0 (roots of
product 1; on abs y = 1 for 0 < eps <= 4, real negative for eps > 4, so zeros at Re s = 1/2 +- log r/log q,
heights (2k + 1) pi/log q); first term of n_q is -eps q^(1/2) q^-s, so invisible iff q >= P. HQ2:
(1 - y)^4 = -eps y^2 gives y + 1/y - 2 = +- i sqrt(eps), not real, so abs y != 1 for every eps > 0; first
term at y^2, invisible iff q^2 >= P. T-NR: c + y + 1/y = 0, off the line iff abs c > 2. Zero spacing
2 pi/log q <= 2 pi/u for q >= P (4 pi/u for HQ2). All as stated.

(ii) Reduction only: given Theorem A (summable class is {zeta}), every G != zeta fails (Lc_p) somewhere (T1)
or has sum delta_p infinite (T2), and in T2 infinitely many primes are modified. Holds as a reduction.
(iii) n_q for HQ1 has its poles at the roots above: on the boundary abs y = 1 for 0 < eps <= 4, one inside
for eps > 4. Holds. T-NR: roots of 1 + c y + y^2 have product 1, so one lies in the closed unit disc. Holds.
(iv) Restatement of Theorem C of the euler-shape lane; not re-read.

## Dependence

The screen is used by lanes 3 and 4 of round 22 (`c22-input-d-geometric-joins-prefilter-v6`,
`c22-no-stage-objects-axis-support-weyl-independence-prefilter`) through section 6 and Lemma TS-1 (i) to
(iii). None of C1 to C5 changes a row verdict or the lemma, so nothing downstream changes.
