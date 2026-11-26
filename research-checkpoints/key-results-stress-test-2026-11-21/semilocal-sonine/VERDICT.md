# VERDICT: semilocal-sonine

## Statement supported
For S = {oo, 2}, on L^2(R)_ev with scaling action theta, P = 1_{[1,oo)}, F_S eta(w) = (1/2) sum_{n>=0} etahat(2^n w) - (1/2) etahat(w/2)
(= inversion o Mellin multiplier u_oo u_2, u_2 = (1-2^{s-1})/(1-2^{-s})), and Phat_S := F_S^{-1} P F_S (Connes-Consani convention):

    Tr(theta(f) P Phat_S P) = W_oo(f) + W_2(f) + D_S(f),   f in C_c^oo(R_+^*),

with Fourier multipliers 2 theta'(t), -m_2(t) = -2 ln2 sum_k 2^{-k/2} cos(k t ln2), and deltahat_S(t), where for rho >= 1
delta_S(rho) = (rho^{1/2}/2) sum_{a,b} c_a c_b [si(a rho + b) + si(|a rho - b|)], a, b in {2^n : n >= 0} (c = 1) and {1/2} (c = -1), si(c) = Si(2 pi c)/(2 pi c),
extended by delta_S(1/rho) = delta_S(rho). delta_S has logarithmic singularities at rho = 2^k with slope 2^{k/2}/2 per log2(1/eps); D_S is not zero.
The left side is a positive functional; its multiplier 2theta' - m_2 + deltahat_S has minimum 0.06523 at t = 0 on [0, 300].

This is Connes-Consani 2021 Prop 2.2(iii) with u_oo replaced by u_oo u_2. The trace-class input for S is in Connes-Marcolli (Thm 2.36), not in the repository.

## Replay
- Log-derivative kernel (independent, 40-digit mpmath): both sides agree to 1e-27 for S={oo}, {oo,2}, {oo,3}.
- delta_S: scipy and mpmath agree to 1e-9 and reproduce repository values to 6 digits; spike slopes 0.4984/0.7049/0.9969/1.4098 vs 0.5/0.7071/1/1.4142.
- Multiplier: Lhat_S(0) = 0.065231 (repo 0.0650 to 0.0653), positive on [0,300], resonance values 0.3680, 0.3728, 0.4001, ... (repo 0.3676, 0.3726, 0.3999).
- Repository Galerkin numbers (mu_max 0.6015/0.9670/0.99710; ratios 96.7%/99.71%) reproduce.

## Stress
- Mismatched variants go negative: drop -cos(pi t) (-1.264), flip m_2 sign (-1.014), archimedean remainder (-3.298), detune c_{1/2} by 10% (-0.131).
- Consistent variants stay positive: p = 3 (0.0509), p = 5 (0.0704), sign-twisted Tate factor chi(2) = -1 (0.0587). The identity is local; it does not see zeta.
- The near-cancellation "deltahat_S(t_1) - m_2(t_1) = 1.6e-3" is not structural: converged value 1.96e-3 for p = 2, 0.415 for p = 3, 0.760 for p = 5.

## Errors and overstatements in the source
1. "Phat_S = F_S P_1 F_S" in the module is wrong as written; with band-limiting the trace diverges. Needs the complementary projection.
2. The Galerkin "identity defect 1e-16" is by construction, not a test.
3. Spike literals are at rho = 2^k + 1e-7, labelled 2^k(1+1e-7). Archimedean deltahat(0) literal off by 4.8e-5. Resonance defect not converged.
4. "Weil positivity <=> D_S <= L_S" and the saturation percentages restate W = L_S - D_S.
5. "Not gap-free" means this decomposition has a nonzero remainder; it is not a no-go result.
6. Positivity is a float64 grid check plus the abstract argument; no interval certificate; no Lean.

## Literature
Known in a different form: semilocal trace formula (Connes 1999; Connes-Marcolli Thm 2.36; restated arXiv:2611.13129 Thm 8.1) combined with the
Connes-Consani 2021 trace-remainder decomposition. Non-trace-class behaviour of the semilocal pair is stated in arXiv:2611.13129 Lemma 8.6.
The explicit closed form of delta_S for {oo,2} and the spike law were not found (two web searches and four source texts; not exhaustive).

## Scores
- Arbitrariness 2: fixed by S and cutoff scale 1; same structure for every p; the split into L_S and D_S depends on the cutoff scale.
- Importance 2: no consequence for RH or for the de Bruijn-Newman constant; a worked specialisation of a known formula with an explicit remainder.

Status: derivation in notes + numerical checks; unrefereed. Verification: confirmed after the notation correction in item 1.
