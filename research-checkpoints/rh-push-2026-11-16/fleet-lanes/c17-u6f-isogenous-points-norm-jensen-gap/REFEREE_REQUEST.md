# Referee request: c17-u6f-isogenous-points-norm-jensen-gap

One independent referee is requested (this lane cannot start one). Files: `RESULT.md`, `job.py`, `grid_*.json`,
`mellin_*.json`, `grid_summary.txt`, `mellin_summary.txt`, `awind.py`, `awind.json`.

Items to check, in order of weight:

1. Lemma N. Re-derive `c(pm) = (1 + 1/p) c(m) - (1/p) c(m/p)` for odd p from the Dirichlet series of `log theta`
   (lane n3), and the three product formulas; check the cancellation of `theta(p tau)^(p+1)` and the final
   `N_p = theta(x)^(p^2+p) / (theta(x/p^2) theta(p^2 x))`. Independent numeric check at two points with a different
   library (mpmath) is enough.
2. Lemma J. Check the reduction to `beta, gamma`, monotonicity in `gamma`, `psi'(beta)`, the range `1 < beta < p`, and
   the limit `log(p/(p+2))`. Check the Corollary's second case (`S <= 0` gives `abs(S) < 1`) and that it needs
   `f(x/p^2) < p^2 f(x)`.
3. Epstein at inert primes: `p | a^2 + n b^2` forces `p | a, b` for `p` inert and odd; both identities follow. Confirm
   from row G33 or its lane that `theta(x) theta(5x)` and `theta(x) theta(6x)` are the controls with off-line zeros
   meant there (the Mellin transform is the Epstein zeta of the form `[1, 0, n]` alone, not the class sum).
4. Lemma D: the pairing `b <-> -b` in both families and the sign `(-1)^(n/2)`.
5. The Mellin decomposition of `J_p`, the pole bookkeeping at `u = 0`, and whether "decay rate = argument of the first
   zero of `A_p`" should stay ARGUED. Check that the trapezoid values at `t > 100` are trustworthy (aliasing bound for
   step 0.01 with an analyticity strip of half-width about 1.4).
6. The twin point set (representatives `b q^2`, `q != p`): is this the right reading of "the T-NR twin of row G33"
   for a read of unsummed points, and is "not formulable at q = p" correct?
7. Section 4 rows marked ARGUED (NR-q, ZQ, E_a, backward heat, theta^w).
8. The verdict: cell U6 (f) closed for (N), (J), (D); flags R1 to R4 all false; the proposed map wording in section 6.
