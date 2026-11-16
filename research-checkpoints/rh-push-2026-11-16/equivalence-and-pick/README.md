# RH push 2026-11-16: equivalence of the theta-bridge residual target, Pick-stage audit, degree-11 note

Internal research checkpoint. Not peer reviewed. No claim about RH and no new bound. Each result had one adversarial internal referee pass (REFEREE.md in each directory).

## eq48/ — the PR 48 residual target is the Weil functional
- Statement used: PR 48, `theta_schur_residual_energy_20261109.md` eq. (21) (restated in PR 50 section 6).
- Theorem 1 (identity): on each finite exponential test v, gamma energy minus the prime side of (21) equals Q_L(v), which is Weil's quadratic functional on the one-sided test v·1_[0,∞) and Suzuki's screw form b(r,r), r = −v′.
- Theorem 2 (no RH assumed): restricting (21) to Schur residuals is equivalent to positivity of every real-node Pick matrix, provided every prefix matrix is positive definite (referee correction; otherwise use the generalized Schur complement).
- Theorem 3: residual target ⇔ Pick class ⇔ Weil positivity ⇔ Suzuki positivity ⇔ RH.
- Theorem 4 (unconditional): any margin version (prime term ≤ θ·gamma energy, θ < 1) over all finite exponential tests is false. Open: whether a margin can hold on Schur residuals alone.
- Referee: identity re-derived; Suzuki normalization checked against arXiv:2206.03682.

## pick/ — audit of Pick stages 3–6 and a certificate for K ≤ 12
- AUDIT.md: stages 3, 4 (PRs 48, 50) verified line by line; stages 5, 6 (PRs 53, 55) replayed and sub-audited. No error found. Listed dependencies: PRs 51, 52, 54 read, not re-proved.
- NEXT_STAGE.md: real-node Pick positivity for every K ≤ 12 via a Loewner splitting, Dobsch–Donoghue, a tail bound from Platt–Trudgian height 3·10^12 and Trudgian's N(T) bound, and an Arb certificate (k_node_certificate.py, cert_K*.log).
- Referee: K ≤ 7 holds as written. For K = 8..12 the written argument gives positive semidefinite; replacing h_7 by h_K (K distinct zeros) gives positive definite; the certificate numbers are unchanged per the referee. The code was not re-run with h_K.
- All finite stages follow from verified height and give no new zero information.

## deg11/ — degree-11 positive-cutoff check for PR 40
- The odd degree-11 enclosure reported as inconclusive passes in all 16 slabs when tail cells are raised from 4000 to 16000 (unmodified checker, inputs SHA-identical to the PR). Scope: 0 ≤ a ≤ 1/2, 0 < H_cut ≤ 1/8. Unaudited. Nothing new at H_cut = 0.
