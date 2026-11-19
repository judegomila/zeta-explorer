# Referee report R8: kernel certificates (sec 3.8, Thm 3.4; with Lemma 2.6 and the use in Prop 2.7)

Object: hexagon:2611.00460v1 (Raymond). Part refereed: Theorem 3.4 and the `kernel` stage
(`verification/kernel/verify_all67_independent.py`, plan sha256 ec346b7c...).
Date: 2026-11-17. All runs local, through `scripts/memcap.sh 8`, Python 3.15.2 `-I`, python-flint 0.9.0,
mpmath 1.4.1 (not the pinned Python 3.12 / python-flint 0.8.0).

## Verdict

**verified**, for the statement of Theorem 3.4 on the pinned 67-row plan: for every row and every q in
[0, c_i], R_i(d, sqrt q) <= 4/(d^2 + 4q) for all real d ((d,q) != (0,0)); O_pair,i is nondecreasing
(strictly increasing) on [0, c_i]; and (85) follows from (84) by Lemma 2.6. No error and no gap found in
this part. Three remarks (section 6) concern wording and the margins; none changes the result.

The verification covers only what is listed in sections 2-4. What it does not cover is in section 7.

## 1. What the part claims and how it is used

- (30): K_h(d,b) = (h-b)/(d^2+(h-b)^2) + (h+b)/(d^2+(h+b)^2), the contribution of the pair a +- ib to
  S_t(x,h) = -Im(H_t'/H_t)(x+ih), d = x - a.
- Row functional: node (h,a,w) -> (w/2)[S(x+a,h) + S(x-a,h)]; rows 0, 16, 44 add
  2 T_b S(x,p), T_b = sum_r b_r p^(r-1)/r! d^r/dp^r, and scale the node part by alpha >= 0.
  R_i(d,b) is the same operator applied to K.
- Thm 3.4: (84) R_i(d, sqrt q) <= 4/(d^2+4q) on the boundary b = y = sqrt q; (85) K_y(d,b) >= (y/2) R_i(d,b)
  for 0 <= b <= y; O_pair,i(q) = R_i(0, sqrt q) nondecreasing on [0, c_i].
- Use: Prop 2.7 gives q' = -2 - 4y sum K_y over other pairs <= -2 - 2q sum R = -2 - 2q (J - O_pair(q));
  the arc stage then uses O_pair(q) <= O_pair(q_0) <= o for q <= q_0 <= c_i.

## 2. Analytic steps re-derived by hand

| Step | Result |
|---|---|
| (30) from -Im[1/(d+i(h-b)) + 1/(d+i(h+b))] | correct. Numerical check: exact to 40 digits. |
| (33)/(83) own pair: w K_h(a, y) = 2wh(h^2+a^2-q)/((h^2+a^2-q)^2+4a^2 q) | correct: numerator (h-y)(a^2+(h+y)^2)+(h+y)(a^2+(h-y)^2) = 2h(a^2+h^2-q); denominator (a^2+h^2+q)^2-4h^2 q = (a^2+h^2-q)^2+4a^2 q. |
| (88) jet own pair: K_p(0,y) = 2p/(p^2-q), then the same T_b | correct. |
| (38): own conjugate contributes Im 2/(2iy) = -1/y; another pair contributes -2K_y(d,b); q' = 2yy' | correct (mpmath check: difference 0). Real zero: half weight on both sides. |
| Direction: K_y >= (y/2)R termwise, so q' <= -2 - 2q sum R | correct direction; the sum is over the same pairs with the same multiplicities on both sides. |
| Lemma 2.6, boundary data of K_y(d,b)/y: 2/(d^2+4y^2) + (pi/y) delta_0 on each edge b = +-y | correct. First term of K_y gives pi delta_0 on b = y and 2y/(d^2+4y^2) on b = -y; second term the reverse. |
| Lemma 2.6, Fourier form: (pi/y)(1+e^(-2y abs xi)) cosh(b xi)/cosh(y xi) = (2pi/y) e^(-y abs xi) cosh(b xi) | correct identity; right side is the transform of K_y(d,b)/y. |
| Lemma 2.6, hypotheses: g = R/2 bounded, continuous on the closed strip, harmonic inside | holds because every pole height satisfies h^2 > c_i >= q (checked exactly for all nodes and jet centres; smallest h^2 - c_i among sampled rows 1.77). Height derivatives of a harmonic family are harmonic. Bounded harmonic functions on a strip with bounded continuous boundary values are the Poisson integral of those values (the two ends carry no harmonic measure), so g = P_y[g(.,y)]. |
| Lemma 2.6, conclusion: g <= P_y[2/(d^2+4y^2)] = K_y/y - (pi/y) P_y[delta_0] <= K_y/y | correct; (34) is only needed pointwise for finite d. Interior strictly; nonsingular boundary points are (34) itself. |
| (34) versus (84): R/2 <= 2/(d^2+4y^2) is R <= 4/(d^2+4q) | same inequality. |
| Cleared polynomial: P = 4 Den - (s+4q) Num, s = d^2 | P >= 0 with Den > 0 and s + 4q > 0 is (84). Den is a product of factors ((d+-v)^2+(h-y)^2)((d+-v)^2+(h+y)^2) and their powers; positive since h != y. |
| Compactification s = 4u/(1-u), multiply by (1-u)^m, m = deg_s P | (1-u)^m > 0 on [0,1); nonnegativity of the Bernstein form on u in [0,1) is exactly P >= 0 for all s >= 0. The endpoint u = 1 is not needed for (84); it is included and is strictly positive (far-field coefficient < 1). No supremum at infinity is used. |
| Far-field coefficient: R ~ (sum w h * 2 * alpha + 4 sum (b_0+b_1))/s | correct: d^r/dp^r (2p) vanishes for r >= 2, so only b_0, b_1 enter. The checker's `tail < 1` matches. |
| Bernstein conversion: u^i(1-u)^(m-i) = B_i^m/C(m,i); v^j = sum_(k>=j) C(k,j)/C(n,j) B_k^n | correct. |
| Midpoint restriction: L_k = 2^(n-k) sum_(j<=k) C(k,j) b_j, R_k = 2^k sum_(j>=k) C(n-k,j-k) b_j | correct (uniform positive scale 2^n). |
| Partition check in `partition_trie` | sound: every internal node must have exactly the two complementary halves of one axis; a leaf cannot have descendants or be duplicated. Leaves are closed boxes, so the closed square [0,1]^2 is covered, including q = 0, q = c_i, d = 0 and the far end. |
| Monotonicity: N'D - ND' >= 0 with D != 0 on [0, c_i] | D is a product of ((h^2+v^2-q)^2+4v^2 q), (h^2-q), (p^2-q)^k, positive for q <= c_i < h^2, p^2. Hence O' >= 0. |

Failure modes looked for, and outcome:
- open range used at an endpoint: none. q = c_i and q = 0 are inside closed leaves; the only excluded point is (d,q) = (0,0), and contacts have q > 0. The singular point d = 0, b = y of (35) is the contact zero itself.
- supremum at infinity treated as attained: not used; the inequality is pointwise in finite d.
- multiple or colliding zeros: (35) is applied termwise, so other zeros of any multiplicity, real zeros (half weight), and other zeros at the same height y (d != 0, boundary case) are covered. A repeated zero at the contact point itself is excluded by the hypothesis "simple" in Prop 2.7 (Lemma 2.9, part R3).
- interchange of limit and maximum: none in this part.
- large-argument remainder: none; all statements are exact rational identities and sign conditions.
- appeal to an earlier preprint: none; the kernel stage rebuilds everything from the plan.

## 3. Replay of the packet's kernel stage (all 67 rows)

The script (281 lines) was read in full before running: standard library and python-flint only, no network,
no subprocess, writes only next to itself and to `--out`. It was run on a copy
(`runs/R8/kernel_replay/`, script/plan/partition digests equal to the packet's).

Result: exit 0, PASS, 67 rows, 10,388 exact checks (same as the author's receipt), 679 boundary leaves,
67 own-derivative leaves, 2,712,495 + 4,001 leaf coefficients, none negative and none zero, 178 s.
The 67 regenerated certificates equal the packet's 67 `ROW_xxx_ACTUAL_CERTIFICATE.json.gz` in every field
except the timing. Log `runs/R8/kernel_replay/replay.log`, receipt `ACCEPTANCE_REPLAY.json`.

Mutation test (`runs/R8/mutation/`): the same script rejects row 1 with the cap raised by 5 percent (negative
leaf coefficient), with all weights scaled by 1.0002 (far-field coefficient), and with one weight sign
flipped. So the script does depend on the row data.

## 4. Independent reimplementation (all 67 rows)

`scripts/R8/own_kernel.py` (own code; imports no packet code; reads the plan and, for comparison only, the
packet's certificate data).

- Different construction of R: in Q[s, y] with y the contact height (not q), from (30) as the sum over
  a in {h-y, h+y} of a/(d^2+a^2); symmetric shift by the closed form a(s+v^2+a^2)/((s+v^2+a^2)^2-4sv^2);
  jets by d^m/dh^m [a/(s+a^2)] = (-1)^m m! Re(a-id)^(m+1)/(s+a^2)^(m+1). The cleared polynomial
  4 Den - (s+4y^2) Num has no odd power of y in any row and is rewritten in q.
- **The primitive integer Bernstein tensor of this polynomial equals the packet's stored root tensor entry
  by entry in all 67 rows** (324,379 entries; degrees up to 118 x 118, row 44). The same holds for the 67
  own-derivative tensors. So the polynomial certified by the packet is the cleared form of (84) for the
  functional defined by (30), (49), (77) and the plan, up to a positive rational factor.
- Positivity re-proved without the packet's partitions: own adaptive de Casteljau subdivision (integer
  arithmetic) ends with all leaf coefficients strictly positive in every row; 554 leaves in total, greatest
  depth 20 (row 0).
- Own pair: O(q) built in Q[y] from (30) at d = 0. For each row the numerator of O'(q) is positive at 0 and
  at c_i and has no root in (0, c_i] by a Sturm sequence; the denominator has no root in [0, c_i].
  This proves O' > 0 on [0, c_i] by a route that does not use Bernstein forms.
- Outputs: `runs/R8/own_kernel_merged.json` (logs `own_kernel_all.log`, `_B`, `_C`, `_D`).

Numerical checks from the definitions (`scripts/R8/numeric_checks.py`, mpmath, 40 digits, jets by numerical
differentiation in the probe height; rows 0, 1, 16, 22, 30, 44, 55, 66; output `runs/R8/numeric_checks.json`):
- strip Poisson identity of Lemma 2.6, with the explicit kernel cos(theta)/(4y) [1/(cosh(pi d/2y) - sin theta) + 1/(cosh(pi d/2y) + sin theta)], theta = pi b/2y: P_y[2/(t^2+4y^2)] + (pi/y) P_y[delta_0] = K_y/y to 2e-41 at four points;
- (84) at 353 points per row and (85) at 319 interior points per row: no violation;
- R(0, sqrt q) equals formulas (83)/(88) to 1e-39; increments of O_pair on a 200-step grid all positive.

Interface checks done by reading and by arithmetic (not by replaying those stages):
- the arc stage pins the same plan digest ec346b7c..., requires 0 < q <= cap for every arc and the same cap in
  the source ledger, and evaluates the own pair by `own_via_newton`, whose formula I checked equals
  R(0, sqrt q) above (node denominator identity; power sums S_(m+1) for the jets, factor 2, alpha);
- units: in 9 sampled rows main_lo / (alpha sum_j w_j + 2 sum b_0/p) is the same constant 6.7229388682...,
  just below (1/4) log((X-4)/(4 pi)) = 6.7229390923. So the source main term uses the same weights and the
  same normalisation as the kernel (unit node <-> S ~ L/4 <-> unit pair kernel K_h, real zero half weight).

## 5. Margins (numerical, `scripts/R8/tightness.py`, `runs/R8/tightness.log`)

Normalised defect g = 1 - (d^2+4q) R(d, sqrt q)/4, minimum over a grid of d from 0.01 to 1e4:

| Rows | min g at q = c_i | at q = 1.05 c_i |
|---|---|---|
| typical | 1.0e-4 to 2.0e-4 | negative for rows 0-56 (down to -2.0e-2) |
| 0 | about 1.1e-7 (d near 56); far-field slack 1.47e-6 | -2.0e-2 |
| 16 | about 8.6e-7 (d near 35) | -1.1e-2 |
| 44 | about 2.0e-5 | -4.0e-3 |

Consequences: (a) the caps c_i are binding hypotheses for rows 0-56: (84) is false a few percent above the
cap, so the arc-stage test q <= cap is necessary, not decorative (author's stated minimum cap clearance
21059999/10^12; not replayed here). (b) The margins are small but the proof is exact rational arithmetic, so
size does not matter for validity.

## 6. Remarks (no change to the result)

1. Sec 3.8 says the row-44 boundary polynomial has "29 certified cells". The certificate has 15 leaves; 29 is
   the number of tree nodes visited (15 leaves + 14 internal). Degrees 118 and 116 are as stated.
2. Thm 3.4 is stated with "nondecreasing"; the certificates give strictly increasing. The far-field endpoint
   is not needed for (84); it is a strict inequality anyway.
3. Lemma 2.6 is stated for one fixed y. Thm 3.4 supplies its hypothesis for every y in (0, sqrt c_i], which is
   what Prop 2.7 needs. The proof of Lemma 2.6 should say explicitly that a bounded harmonic function on the
   strip with bounded continuous boundary values equals its Poisson integral (true; one line).

## 7. Not checked in this part

- That the source theorem (Thm 3.1) bounds the same functional L_i: only the plan digest, the cap equality
  test in the arc script (read, not run) and the main-term proportionality above. Stages `interfaces`,
  `direct-source`, `arcs` were not replayed here.
- Lemma 2.5 (absolute convergence and exchange of the functional with the zero sum), the zero ODE cited from
  Polymath Prop 3.1(i), compact attainment and repeated contacts (R3).
- Correctness of FLINT (used for polynomial construction in both the packet script and my script; the
  Bernstein conversion, subdivision and sign tests in my script are Python integers; the Sturm sequences use
  `fmpq_poly`). The pinned runtime (Python 3.12, python-flint 0.8.0) was not used.
- Nothing was run on the compute server.

## 8. Files

- Report: `tmp/research-2026-11-16/push/verify-0107965/referee-R8.md`
- Own code: `scripts/R8/own_kernel.py`, `scripts/R8/numeric_checks.py`, `scripts/R8/tightness.py`
- Outputs: `runs/R8/kernel_replay/` (replay), `runs/R8/own_kernel_merged.json`, `runs/R8/numeric_checks.json`,
  `runs/R8/tightness.log`, `runs/R8/mutation/`
