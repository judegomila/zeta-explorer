# Referee report: jensen-hyperbolicity/RESULT.md (2026-11-16)

Verdict: the PROVED claims (Theorem A, Corollary A) survive. The obstruction verdict stands, with the corrections below.
holds = true. No RH assumption found. Verified height is restated, and the note says so.

## PROVED steps, re-derived

- Setup identities: P_{d,n} = F^{(n)}(D) x^d, P_{d-1,n} = P_{d,n}'/d, (J^{d,n})' = d J^{d-1,n+1}. Confirmed.
- Lemma 1: Q(D)u^m = u^{m-2}[u^2 - 2m Re(1/c) u + m(m-1)/|c|^2], discriminant (4m/|c|^2)(1 - m sin^2 phi). Confirmed.
  The Walsh coincidence step is valid: the form is symmetric multi-affine in the roots, and the region {Im < Im x0}
  is a convex circular domain, so no degree condition is needed.
- Lemmas 2, 3: confirmed (degree m is preserved by every factor; the limit has degree m because G(0) != 0).
- Lemma 4 and the induction on n: Gauss-Lucas for genus 0 is correct. S_d is a convex sector for d >= 2 and the hull
  of the zeros stays away from 0.
- Corollary A arithmetic: sin(arg w) = 2bg/(b^2+g^2), monotone in b/g on [0,1]; D(T,a) values 9.00105e24, 1.60019e25,
  1.60115e25 and 355 (T = 14.1347) recomputed and agree. DH pair bound 19,290 recomputed and agrees.

## Independent numerics (pure-Python exact Sturm, different cases from the author's)

- 1,699 cases (random polynomial G, zeros on or just inside the cone edge, d = 2..9, all n, all m <= d): 0 failures.
- Single pair just outside the cone: m = d not hyperbolic, m = d-1 hyperbolic, for d = 3, 6, 11 (Lemma 1 is sharp).
- Toy at new parameters: (Gamma, beta) = (22, 3): D0 = 13.95, d*(0) = 48, d*(1..3) >= 70 (cap).
  (12, 5/2): D0 = 6.27, d*(0..2) = 19, 27, 56, d*(3) >= 60 (cap). Both satisfy d* >= D0 and d*(n+1) >= d*(n) - 1.
- Real-zero count of the toy G' (sign changes of d/dy[cos y q(-y^2)]): two extra real zeros for beta = 1
  (Gamma = 15.7 and 31.4) and beta = 0.5 (Gamma = 22); none for beta = 1.3, 1.6, 2. This supports "G' real-rooted
  while G is not" at beta = 1 (float evidence on y < 60, not a proof).

## Errors and gaps

1. Lemma 4, "G' is again real of genus 0", is not justified for genus 0 of order 1 (minimal type). It is immediate
   for order < 1, which covers xi (order 1/2). For the general statement it is repairable: the zeros of G' lie in a
   sector of half-angle < pi/2, so Lindelof's bounded-sum condition gives absolute convergence of sum 1/|c'|, and
   minimal type removes the exponential factor. As written, Theorem A is proved for order < 1.
2. Novelty. Theorem A is the sector criterion already in the literature (Chasse); the a = 1/2 row is the known T^2
   range. The only added content is the constant 1/(4a^2) = 16/9, conditional on the unrefereed half-plane. Section 0
   lists the "all-n degree range" as added; only the constant is.
3. "The true threshold is larger by a bounded factor" is not established. The measured ratio d*(0)/D0 grows with
   beta/spacing (1.61, 2.51, 4.12, 5.78 for beta = 1, 2, 4, 6; my cases 3.0 and 3.4), and for n >= 1 it reaches 33
   before the cap. Section 2 says "1.6 to 4.5", section 5 says "1.6 to 5.8".
4. "For d above D(T,a) the inputs cannot give hyperbolicity" should read "above C * D(T,a), C not determined". No zero
   configuration consistent with T = 3e12, a = 3/8 and xi-like density was exhibited; the toy has d <= 200.
5. "The worst case for the Jensen ladder is logarithmic in d" is not supported. The isolated-pair scenario is one
   configuration (a lower bound on the adversarial N(d)), not a maximum; locally dense on-line zeros slow the descent,
   and the constant a/4 assumes mean spacing.
6. "The pair becomes real once the depth is below about 0.45 delta": the data give about 0.32-0.36 delta (depth 1.0
   turns real at the next derivative; 1.12, 1.19, 1.27, 1.3 do not).
7. DH: Theorem A needs real zeros negative and all Taylor coefficients nonzero for the DH completion. Neither was
   checked, and the infimum over DH zeros was not computed. The note labels this illustrative; it is not a computed
   DH control. The GORZ-for-DH statement is recalled, not derived.

## Is the obstruction real

Yes for "all d": Theorem A uses no arithmetic and applies to any function with the same cone data, and every finite d
condition is open under small perturbation. One way to get more than a restatement, not attempted: prove a rigorous
descent bound in the n direction (strip-shrinking under (1/2z) d/dz, in the style of the Ki-Kim / Craven-Csordas-Smith
proofs of Polya-Wiman, with the on-line zero count in O(1) windows as input). That would give an explicit N(d) for
d > D(T,a). It cannot reach all d at n = 0.

## Surviving claim

For real entire G of order < 1 with zeros in the cone, G^{(n)}(D)x^m is hyperbolic for all n and m <= d. For xi:
J^{d,n} hyperbolic for all n >= 0 and d <= 9.00e24 (known), and d <= 1.60e25 conditional on Re s > 7/8. Everything
about d above this range is measured in a small toy or heuristic.
