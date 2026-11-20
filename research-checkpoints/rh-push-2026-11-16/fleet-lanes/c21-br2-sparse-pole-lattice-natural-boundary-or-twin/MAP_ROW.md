# Proposed map entries (for the record lane; the map is not edited here)

Lane `c21-br2-sparse-pole-lattice-natural-boundary-or-twin`, round 21, deepen. Zero independent referees (the
REFEREE.md on file is the author's adversarial pass). Elementary; not checked against the literature.

## Section 3: one row (class U3, neighbour of X3)

| X3b | BR-2: relative Euler product with abs(alpha_p) = p^(1/2) on a sparse infinite set S (regime (K) of X3): natural boundary or twin (campaign round 21; deepen; carrier: local pole lattices 1/2 + i(theta_p + 2 pi n)/log p) | Lemma P: at a pole point abs(G/zeta) >= c_S exp(-L_S(delta))/(delta log p), L_S = sum log(1 + q^-delta); growth delta^-(1 - kappa log 2) when N_S(x) <= kappa log log x + C, kappa log 2 < 1 (lacunary ratio of log q above 2). Sharp for size arguments: for frequencies 2^k lambda_0 and alpha = -q^(1/2) the product is 1/(1 - w) (control CYC), meromorphic, with the same dense lattices. Theorem W: if sum over S of (log q)^(-gamma) is finite for some gamma < 1 (any phases), G has no meromorphic continuation across any point of Re s = 1/2; proof: logarithmic derivative tested against a window at frequencies n log q_(k0); meromorphy bounds the test; the product gives a spike of height log q_(k0); Weyl equidistribution of n log q_(k0)/log q_k (irrational by unique factorisation) leaves a positive proportion of n with no cancelling spike. Hence no twin in this class. Open: sets with sum over S of 1/log q infinite (N_S(x) of order log x up to x^(o(1))); missing lemma: mean square of the spike sum over a frequency window is not O(V). No statement about zeros of zeta; base-blind. | PROVED (Lemma P, Corollary P1, telescoping example, Theorem W; author only); CLASSICAL (Weyl); MEASURED (20 pole points and 5 generic points per set at 70 digits: e^k slopes 0.74 to 1.24; e^(k/2) 0.68 to 1.38; k^3 both signs; CYC 0.000) | CYC passes every hypothesis except multiplicative independence and the conclusion fails for it (Weyl step); HQ1 (finite S), DEL, THIN (abs(alpha) != p^(1/2)) are outside the class; holds over any base (DH, B) | `c21-br2-sparse-pole-lattice-natural-boundary-or-twin` |

## Section 2 (controls): one new auxiliary control

- CYC (cyclotomic telescoping; Beurling-type): generalised primes of norms q_k = Q^(2^k), k >= 0, local
  parameter alpha_q = -q^(1/2). Relative product prod (1 + w^(2^k))^-1 = 1 - w, w = Q^(1/2 - s): entire, although
  the pole lattices of the factors are dense on Re s = 1/2 and the product converges only for Re s > 1/2.
  Has: Euler product over a Beurling system, geometric factors, the lattice geometry of regime (K). Lacks:
  multiplicative independence of the norms (unique factorisation). Use: any argument that derives a
  natural boundary, or a rigidity statement, from the position of local pole lattices or from the sizes of
  the factors alone.

## Section 6 (what is not covered)

BR-2, remaining part: abs(alpha_p) = p^(1/2) on S with sum over S of 1/log q infinite and sum over S of q^-eps
finite for every eps; and the wider regime (K) with parameters of modulus below p^(1/2).
