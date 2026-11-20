# REFEREE 2: c19-u6c-double-cover-k3-run (the interchange lemma, Lemma Q)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. Paper only; derived from the statement before
the lane's proof was read. Nothing here is a statement about a zero of zeta.

**Verdict: holds** (one wording point).

## The lemma

p != q primes, p = q = 1 mod 8, (p/q) = 1; L_d = <1, 1, d> on Z^3 for d in {1, p, q, pq}; G_d its genus. Claim: at
every place v the unordered pair of local similarity classes of (G_1, G_pq) equals that of (G_p, G_q).

Derivation, place by place.
- v = infinity. All four are positive definite. Same class.
- v = 2. A unit congruent to 1 mod 8 is a square in Z_2, so p, q, pq are squares and the four lattices are
  isometric over Z_2. Same class four times.
- v = p. Quadratic reciprocity with p = 1 mod 4 gives (q/p) = (p/q) = 1, so q is a square unit in Z_p:
  L_q = L_1 (unimodular, class U) and L_pq = L_p (class R_p = <1, 1, p>). Pairs: (G_1, G_pq) = (U, R_p) and
  (G_p, G_q) = (R_p, U). Equal as unordered pairs. Same at v = q with p and q exchanged.
- v = l odd, l not dividing pq. L_d is unimodular over Z_l. Scaling by d: <d, d, d^2> = <d, d, 1>; the binary
  unimodular lattice <d, d> has determinant class d^2 = 1 and a unimodular lattice over Z_l, l odd, is determined
  by rank and determinant class, so <d, d> = <1, 1> and d L_d = L_1. Same similarity class four times.

Hence for K(G) = prod over v of k_v(similarity class of G_v): K(G_1) K(G_pq) = K(G_p) K(G_q). PROVED. The hypothesis
p = q = 1 mod 8 is used at v = 2 and (through p = 1 mod 4) for reciprocity; (p/q) = 1 is used at v = p and v = q.
The classes U and R_p over Z_p are not similar to each other (Jordan types (3) and (2, 1) up to a common shift),
which is why the pairs are compared as unordered pairs and not termwise.

The remark on isometry classes is correct: at l with (p/l) = (q/l) = -1 the determinant classes of (1, pq) are
both squares and those of (p, q) both non-squares.

Consistency check on the one array in the lane that is a product of local factors, the mass: with
M(G_1) = 1/48, M(G_p) = (p + 1)/96, M(G_q) = (q + 1)/96, M(G_pq) = (p + 1)(q + 1)/192 (lane, EXACT as computed
there; not recomputed here), M(G_1) M(G_pq) = (p + 1)(q + 1)/9216 = M(G_p) M(G_q), since 48 * 192 = 96^2. The
identity of Lemma Q holds on the mass.

## Wording point

"The four forms lie in one quadratic space up to scaling (locally similar everywhere, hence globally similar by
Hasse-Minkowski)". As lattices L_p and L_1 are not similar over Z_p, so "locally similar everywhere" must be
read for the quadratic spaces over Q_v. For spaces the statement is true and has a direct proof: in odd
dimension the scale factor is fixed modulo squares by the determinant (c = d), and d <1, 1, d> = <d, d, 1> is
isometric to <1, 1, 1> over Q exactly when d is a sum of two rational squares, which holds for d = p, q, pq
because p = q = 1 mod 4. No appeal to Hasse-Minkowski is needed.

## Scope

Only Lemma Q was refereed. Lemma T (truncation radius), Lemma E (Siegel product, class-number series), the
Eisenstein values and the cusp-form run were not re-derived or rerun; the first referee file is their only
referee record. The logical use of Lemma Q in the lane (Delta != 0 refutes a product form in local similarity
classes; Delta = 0 would not prove one) is correct.

## Flags

R1, R2, R3, R4 false (the lane's own flags; no one-sided inequality is produced).
