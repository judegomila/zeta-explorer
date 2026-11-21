# VERDICT: c-glob

Status: proved in notes (source comment + float assertions), unrefereed. Verification: confirmed, with a hypothesis that some pages omit.

## Statement supported
For a finite set of real points moving by dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j), take an adjacent pair with gap g such that every
adjacent gap of the configuration is >= g. Let d_1 be the distance from the pair to the nearest other point and rho = g/d_1 < 1. Then

  d_1^2 d(rho)/ds <= R(rho) = 4 + 4 rho - 4/rho - 4/(rho+1) - 2[psi(1+2/rho) - psi(1+1/rho)],

with strict inequality for finite configurations and the supremum approached by: one point at distance d_1 on one side, an arithmetic
progression of step g starting at distance d_1 on the other. R is increasing on (0,1], R(1) = 1, unique root
c_half = 0.898020888076233842758130789949352640796... Hence rho decreases for every such configuration when rho < c_half, and for each
rho > c_half some finite such configuration has rho increasing.

## What was re-run
- Root to 50 digits (mpmath), Arb sign-change enclosure of width 2e-40: matches the listed 16 digits.
- Digamma telescope identity: 1.1e-40 agreement at 40 digits (repo: 1e-8); re-derived by hand.
- Rate decomposition vs direct force: 2.5e-29 over 300 random configurations; re-derived by hand.
- Monotonicity: Arb, rho^2 R'(rho) > 2 on [0.05,1] (4000 cells); analytic bound for rho < 0.05.
- 200000 random admissible configurations + optimiser search: no violation; largest (rate - R) found -8.5e-3.
- Finite half-lattice onsets: L^2 (onset_L - c_half) -> 0.226, confirming O(1/L^2) approach from above.

## What breaks
- Without "every adjacent gap >= g" there is no constant: m points packed at distance d_1 give onset 0.874 (m=2), 0.609 (m=10),
  0.225 (m=100), tending to 0. The Open Frontier R2 card defines c_glob as an infimum "over all asymmetric multi-body environments" with
  no such hypothesis; as worded that is false.
- Replacing the hypothesis by "other gaps >= kappa g" moves the constant continuously: 0.748 (kappa=0.25) ... 0.898 (1) ... 0.932 (inf).
- The extremal environment is one-sided. Two-sided lattices have onset -> 1 (0.9319, 0.983, 0.9988, 0.999997 for 0, 1, 5, 50 extra points per side).
- "Transcendental" is not proved. "Closed form" means "root of an explicit digamma equation".
- No zeta input: the statement holds for any real point set; control functions cannot distinguish anything.
- Persistence along the flow is conditional on the pair remaining the minimal gap (open R1 item, acknowledged in the module).

## Literature
Nearest: Lehmer-pair criteria of Csordas-Odlyzko-Smith-Varga (ETNA 1993) and Csordas-Smith-Varga (Constr. Approx. 1994), which use the
same ODE with an inverse-square environment sum and threshold 4/5; Rodgers-Tao (2020) on gap dynamics. The ratio rho = g/d_1, the bound
R and the number 0.89802 were not found in four web searches. The derivation is elementary (partial fractions, monotone kernel).

## Scores
- Arbitrariness 3/5: sharp and untuned given its definition; the definition (ratio to nearest neighbour, global-minimal-gap class) is a project choice and the value moves or vanishes under reasonable alternatives.
- Importance 1/5: internal lemma constant. No consequence for RH or for any bound on the de Bruijn-Newman constant; the module states this.

## Recommended public wording
"For points on a line under the attractive log-gas flow, a pair whose gap is the smallest gap in the configuration becomes relatively more
isolated whenever gap / (distance to nearest other point) < 0.89802..., the root of an explicit digamma equation; the threshold is sharp.
Elementary; no arithmetic input; no effect on any Lambda bound."
