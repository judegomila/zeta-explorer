# REFEREE 2: c1-leeyang-krein-limit, Theorem D (the scoreboard headline and Statement O line 12)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. Target: Theorem D of
`push/c1-leeyang-krein-limit/RESULT.md` (section 3), its R1 flag, and the sentence "lost in the limit".
Order of work: the statement was read (verdict item 3 and the display of Theorem D), the proof below was written
from the definitions, and only then the lane's proof and the first referee file were read and compared.
Labels: PROVED (argument here), CLASSICAL (recalled, source not opened), MEASURED (float64/mpmath, local, through
`scripts/memcap.sh 8`), "relative to" (source not opened).

Nothing here is a statement about a zero of zeta.

## Verdict

**Theorem D holds, with corrections (C1 to C4 below; none changes the statement).**

**The R1 flag is not justified.** No step of Theorem D uses multiplicativity in an essential way: the stage
hypothesis it uses (stages without zeros in Re s > theta, converging right of some abscissa) is satisfied by a
non-multiplicative control (Davenport-Heilbronn, with exponential stages) and is violated by three multiplicative
controls (T-NR, HQ2 and the members G_q of Proposition F, with their Euler stages). Multiplicativity is neither
necessary nor sufficient for the hypothesis. Theorem D is an equivalence with its target, and the equivalence
holds for every control tested; under `campaign/METRIC.md` section A ("a lane that the referee classes as a
restatement (an identity equivalent to its target, or one that holds for a control) scores 0") this referee classes
Theorem D as a restatement. Flags set by this referee: R1 false, R2 false, R3 false, R4 false.

This disagrees with the first referee on R1 only (first referee: "R1 = true, stage ingredient only"). The
disagreement is about one sentence of the lane's section 7, "Zero-freeness of the stages is the Euler product ...
DH has no such stages", which is false in the form Theorem C and D need (section 3 below).

## 1. Independent derivation

Notation: E_P(s) = prod_{p <= P} (1 - p^-s)^-1; E_1 the exponential integral; R_P = E_P exp(E_1((s-1) log P));
Omega_theta = {Re s > theta, s != 1}; theta in [1/2, 1).

Step 1 (the normaliser). E_1(w) = -gamma - log w + Ein(w) with Ein entire, so exp(E_1(w)) = e^-gamma w^-1 exp(Ein(w))
is single-valued and meromorphic with one simple pole at w = 0 and no zero. So R_P is meromorphic on Re s > 0,
analytic and zero-free on {Re s > 0, s != 1}, with a simple pole at s = 1. PROVED.

Step 2 (identity right of 1). For Re s > 1:
log zeta(s) - log E_P(s) = sum_{p > P} p^-s + sum_{p > P} sum_{k >= 2} p^(-ks)/k, and
sum_{p > P} p^-s = int_P^inf x^-s d pi(x) = int_P^inf x^-s dx/log x + int_P^inf x^-s d(pi - li)(x).
With x = e^v the first integral is int_{log P}^inf e^(-(s-1)v) dv/v = E_1((s-1) log P) (principal branch,
Re (s-1) log P > 0). Hence

    R_P(s) = zeta(s) exp(-eps_P(s)),   eps_P(s) = int_P^inf x^-s d(pi - li)(x) + sum_{p > P} sum_{k >= 2} p^(-ks)/k.   (1)

The lower limit of li does not enter (only d li = dx/log x is used). PROVED.

Step 3 (unconditional convergence right of 1). For Re s > 1, abs(E_1(w)) <= e^(-Re w)/abs(w) (from
E_1(w) = int_0^inf e^(-w-v)/(w+v) dv and abs(w+v) >= abs(w) for Re w >= 0) and E_P -> zeta, so R_P -> zeta locally
uniformly on Re s > 1. PROVED.

Step 4, (a) implies (c). Assume zeta has no zero in Re s > theta. Then pi(x) - li(x) = O(x^(theta+eps)) (CLASSICAL;
for theta = 1/2 this is von Koch; for general theta the explicit formula with zeros in Re s <= theta). Partial
summation: int_P^inf x^-s d(pi - li) = -(pi - li)(P) P^-s + s int_P^inf (pi - li)(x) x^(-s-1) dx, analytic on
Re s > theta + eps and O((1 + abs(s)) P^(theta+eps-sigma)/(sigma - theta - eps)). The double sum is analytic on
Re s > 1/2 and O(P^(1-2 sigma)/((2 sigma - 1) log P)); this is where theta >= 1/2 is used. Both sides of (1) are
meromorphic on Re s > theta, so (1) continues there, eps_P -> 0 locally uniformly on Re s > theta, and R_P -> zeta
locally uniformly on Omega_theta (R_P/zeta -> 1 locally uniformly on all of Re s > theta, the point s = 1
included). PROVED relative to the classical bound.

Step 5, (c) implies (b): a locally uniformly convergent sequence is locally bounded. PROVED.

Step 6, (b) implies (a). Omega_theta is connected. R_P is analytic and zero-free on it (step 1), locally bounded
by (b), and converges on the open set Re s > 1 (step 3). Vitali: R_P converges locally uniformly on Omega_theta to
an analytic F, and F = zeta by the identity theorem. Hurwitz: F is zero-free or identically zero; zeta is not
identically zero. PROVED. A subsequence P_k -> infinity with R_(P_k) locally bounded suffices.

Comparison with the lane. The lane's proof is the same chain (its Theorem C is steps 5 and 6; its "(a) implies
(b)" is step 4). No step of the lane's proof fails.

## 2. Corrections

- **C1 (labelling inside the proof).** The paragraph headed "(a) implies (b)" proves (c) ("log R_P - log zeta -> 0
  locally uniformly"); the chain proved is (a) => (c) => (b) => (a). The statement is unaffected.
- **C2 (meaning of "locally bounded").** (b) must be read as: for every compact K in Omega_theta,
  sup over P and over s in K of abs(R_P(s)) is finite. The lane uses it in this sense; the display does not say
  "uniformly in P". A subsequence is enough for (b) => (a).
- **C3 (where theta >= 1/2 enters).** Only in the prime-power double sum. For theta < 1/2 statement (a) is false
  (zeros on the line) and (b), (c) fail with it.
- **C4 (source).** "Likely known" (section 8 item 2) can be made specific: the equivalence "RH iff a normalised
  partial Euler product is bounded iff it converges" is stated, at s = 1/2 with the normaliser exp(li(theta(X)^(1/2))),
  in Akatsuka, arXiv:2411.19259, and the strip version of the convergence statement is in Akatsuka, Kodai Math. J.
  40 (2017) (both from a search summary; neither paper was opened: "relative to"). Theorem D is Hurwitz plus the
  explicit formula; no novelty is claimed by the lane and none should be recorded.

Numerical agreement (MEASURED, `thmD_controls.log`): relative error of R_P against zeta at s = 0.65 + 25.2i for
P = 1e3, 1e4, 1e5, 1e6: 0.135, 0.097, 0.048, 0.033 (the first referee's values at the same point: 0.135, 0.097,
0.048, 0.033; independent code); at 0.8 + 20i: 0.0169, 0.0049, 0.0027, 0.0012.

## 3. Is multiplicativity essential? The step, run against the controls

Theorem D has three ingredients. (S1) the stages are analytic and zero-free on Omega_theta; (S2) the stages divided
by a normaliser that is zero-free on Omega_theta converge on an open subset; (S3) local boundedness, the
hypothesis. The lane's R1 rests on S1 ("zero-freeness of the stages is the Euler product; DH has no such
stages").

**Lemma E (exponential stages; PROVED, elementary).** Let F(s) = sum a_n n^-s with a_1 = 1 and abs(a_n) <= 1. Then
log F(s) = sum_{n >= 2} b_n n^-s converges absolutely on Re s >= 2 (there sum_{n >= 2} abs(a_n) n^-sigma <= zeta(2) - 1
< 1), and the stages f_N(s) = exp(sum_{2 <= n <= N} b_n n^-s) are entire, have no zero anywhere, and converge to F
locally uniformly on Re s >= 2. The Euler stage E_P is the special case in which b_n is supported on prime powers
and the truncation is by largest prime factor. Nothing in S1 or S2 distinguishes the two.

For Davenport-Heilbronn (a_n = 1, kappa, -kappa, -1, 0 mod 5, kappa = 0.2840790438): b_6 = 1.0807009 (not on prime
powers; equal to a(6) - a(2)a(3) of the map row); MEASURED relative error of f_N against DH for N = 100, 1e3, 1e4,
2e5: at 3 + 5i: 1.1e-6, 2.4e-9, 3.9e-12, 6.5e-15; at 2 + 17i: 3.3e-4, 3.6e-6, 6.6e-8, 1.7e-9; at 1.3 + 85.7i:
3.8e-2, 8.1e-3, 2.0e-3, 3.7e-4. At the off-line zero 0.8085171825 + 85.6993484854i the stage has modulus 0.159,
0.102, 0.077, 0.058 (non-zero, as it must be; decreasing).

So the abstract form of Theorem D ("F has no zero in a connected Omega meeting the half-plane of convergence iff
there are normalisers c_N, zero-free on Omega, with f_N/c_N locally bounded on Omega and convergent to F right of
the abscissa") is a theorem for every F with a_1 = 1: "if" is steps 5 and 6; "only if" is c_N = f_N/F. For DH both
sides are false on a domain containing its zero and both are true on a domain that avoids its zeros.

| Control | S1 with Euler stages | S1 with exponential stages | Where the conclusion fails | Status |
|---|---|---|---|---|
| DH | no Euler stages (b_6 != 0) | holds (Lemma E) | S3: no zero-free normaliser on a domain containing a zero (lane's Corollary C1 verbatim) | PROVED (Lemma E, C1); stages MEASURED |
| T-NR, zeta(s)(q^(s-1/2) + c + q^(1/2-s)), abs(c) > 2 | **fails**: the local factor at q vanishes at Re s = 1/2 + arccosh(abs(c)/2)/log q (q = 2, c = 2.5: zero at 1.5 + 4.5324i, abs(m) = 5e-16) | holds right of that abscissa after expanding log(1 + c u + u^2) | Euler stages: S1. With S1 false, (b) holds under RH and (a) is false: the equivalence itself breaks at S1 | PROVED (one line); value MEASURED |
| HQ2 (q = 7, eps = 0.2) | **fails**: local factor at q vanishes at 0.7472939592 + 0.2382677377i (map row value reproduced) | holds for Re s large | S1 | PROVED; MEASURED |
| G_q of Proposition F (map row X1) | **fails** for P >= q: local factor vanishes on Re s = 3/4 (abs = 2e-17, 6e-17, 1e-16 at q = 5, 101, 10007). For P < q the stage is zeta's E_P exactly | holds | S1 for P >= q; for P < q the stage data are zeta's and the limit function vanishes on Re s = 3/4 | PROVED; MEASURED |
| Sign chains (eps completely multiplicative, +-1); Liouville as the instance | holds: prod (1 - eps(p) p^-s)^-1 is zero-free on Re s > 0 | holds | For Liouville the stage is multiplied by exp(-E_1((s-1) log P)) (a factor with a zero at s = 1, where zeta(2s)/zeta(s) vanishes) and the criterion reads "zeta(2s)/zeta(s) analytic and zero-free on Omega_theta iff stages locally bounded": the same open statement as for zeta. MEASURED at 0.65 + 25.2i: relative error 0.141, 0.105, 0.050, 0.034 with that factor; 0.25, 0.22, 0.29, 0.58 with zeta's factor. For THIN (zero at b): S3 fails near b | PROVED-rel; MEASURED |
| E_a, 0 < a < 1/2 | holds on Re s > a | holds | S3 near every zero rho + a (Re = 1/2 + a), by Theorem C: PROVED relative to the existence of one zero of zeta on the critical line (CLASSICAL). The lane's "ARGUED; not run" can be upgraded to this. MEASURED: renormalised stage at rho_1 + 0.2: 0.0184, 0.0133, 0.0107, 0.0085 (tends to 0 at the zero; bounded there, hence unbounded nearby by Hurwitz) | PROVED-rel; MEASURED |
| DEL (zero at b in (1/2, 1)) | holds (Euler product, Lambda >= 0, coefficients 0 or 1, pole at 1) | holds | S3: the normaliser that works has divisor "zero at 1, pole at b"; with zeta's normaliser the stages are not locally bounded near b (Theorem C). Not run numerically (the deleted set S was not rebuilt here) | PROVED-rel the map row for DEL |

Reading.
1. Among the controls, S1 separates by "every local Euler factor is zero-free in Re s > theta" (the map's GEOM/SIZE
   at each prime), not by multiplicativity: three multiplicative controls fail it and DH passes its exponential
   form. With exponential stages every control passes S1 and S2, and each fails only at S3, the step that is open
   for zeta.
2. S3 for zeta is not implied by {Euler product, Lambda >= 0, coefficients in {0, 1}, simple pole at 1}: DEL has
   all four and fails S3. It is not implied by {Euler product, exact functional equation, multiplicative
   coefficients >= 1} at any finite set of stages: G_q shares every stage P < q with zeta.
3. Therefore no proved step of Theorem D fails for a control for a structural reason, and no step uses
   multiplicativity essentially. R1 false, R3 false.

What the lane's R1 sentence does describe correctly: the Lee-Yang stage theorem of the parent lane
(`res-sparse-ferromagnet` Thm. 3: self-dual stages with all zeros on the line) uses the product structure over
prime spins, and DH's stage polynomial there has zeros off the line. That is the calibration row "finite Lee-Yang
stage theorem" of METRIC.md, not a result of this lane, and the lane itself records that in Theorem D "the
Lee-Yang theorem adds nothing to the Euler product" and that Theorem B has limit -1 for every unimodular twist.

## 4. What exactly is lost in the limit

1. Stage normalisation (Theorem B). The stage statement is Re D_M'/D_M(s) > -(log M)/2 on Re s > 1/2; the target
   is the same inequality with (log M)/2 replaced by Re a(s), about (1/2) log(t/2 pi). log M = theta(P) grows
   like P at fixed height, so the slack grows without bound and the limit symbol is the constant -1. Everything
   is lost, for zeta and for every twist alike. PROVED (lane; confirmed by the first referee; not re-derived
   here beyond the reformulation).
2. Strip topology (Theorem D). The limit step itself loses nothing: Hurwitz transmits zero-freeness exactly,
   given normality. What is absent is normality. Zero-freeness of the stages supplies one omitted value (0);
   Montel's test needs two omitted values, or equivalently here a one-sided bound
   Re[sum_{p <= P} p^-s + E_1((s-1) log P)] <= C(K) on compacts of the strip. The stage property contains no size
   information: the same zero-free stages are locally bounded after the pole factor for zeta (if RH), bounded
   with no factor for a random unimodular twist (MEASURED by the lane), and unbounded near b for DEL.
3. Finite sets of stages. By Proposition F the stages P < q of G_q are zeta's, and G_q vanishes on Re s = 3/4. So
   the content of (b) is entirely in the uniformity over P -> infinity; no finite collection of stage facts
   bears on it.

## 5. Consequence for the scoreboard and Statement O (for the learn step; this lane edits neither)

- `c1-leeyang-krein-limit`: second referee holds with corrections on Theorem D; R1 not confirmed (two referees
  disagree on R1; R2, R3, R4 false for both). Under METRIC.md section A, Theorem D is a restatement and the lane
  scores 0 on this referee's reading.
- Headline. If the learn step adopts this reading, the headline stays "1 of 4" only through
  `c4-helson-discrepancy-zerofree` (the other lane at score 1; one referee; its R1 is recorded by its referee "in
  the restricted sense ... a statement about F relative to zeta. It is not an attack on zeta"; not refereed
  here). If that lane's R1 is read as not being about zeta, the headline is 0 of 4. The calibration row "finite
  Lee-Yang stage theorem: 2 (stage level only)" is unaffected.
- Statement O line 12. Its mode sentence ("the limit step is equivalent to the zero-free statement for every F")
  agrees with section 3 above and can cite two referee files for Theorem D. Suggested additions: controls DH
  (exponential stages), T-NR, HQ2, G_q with the cells of the table above; the lanes line should read "R1: first
  referee true as a stage ingredient, second referee false".

## 6. Three weakest points of this report

1. Lemma E is proved on Re s >= 2 only. Convergence of the exponential stages of DH down to its zero-free
   abscissa (about 1.1204) is MEASURED at one point with Re s = 1.3 (sum of abs(b_n) n^-1.3 to 2e5 is 1.153 and
   still growing slowly), not proved. Theorem C needs only an open set, so the conclusion does not depend on it.
2. The DEL cell is by Theorem C and the map row, not by a run. The T-NR cell "(b) holds under RH" is conditional.
3. The classification "restatement, score 0" applies a rule of METRIC.md to a lane that another referee scored
   1; the mathematical content of the two referee files agrees, the reading of "stage level" does not.

## 7. Files

`thmD_controls.py`, `thmD_controls.log`, `thmD_controls.json` (this directory; local, memcap 8 GB, mpmath 30
digits and float64, primes to 1e6, about 1 minute). The compute server was not used.
