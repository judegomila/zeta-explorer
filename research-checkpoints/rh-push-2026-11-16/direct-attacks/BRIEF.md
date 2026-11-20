# Campaign brief (2026-11-16): direct push on RH's missing arithmetic input

Repo: ~/Documents/GitHub/mathexplorer (GitHub judegomila/mathexplorer). You are one of several parallel agents, each with a different angle. Objective: PROVE something new. Report proof / refutation / precise obstruction. No false QED: claim nothing beyond what is established, label each step PROVED / CLASSICAL / MEASURED / OPEN.

## Required reading before proposing anything
1. User's route atlas: `git fetch origin pull/27/head:refs/pr/27 2>/dev/null; git show refs/pr/27:research/rh/modules/historical-routes.md`. Do not re-run a route it closes.
2. formalization/rh-attempts/2026-11-01-synthesis.md, -r2-synthesis.md, -r3-synthesis.md (15 failed direct attempts and why).
3. formalization/paper/zf-campaign-synthesis.md and sextic-theta-synthesis.md (zero-free half-plane levers; TRO6 natural).
4. tmp/research-2026-11-16/eq48/RESULT.md + REFEREE.md (refereed: Codex residual target (21) == Weil functional on one-sided tests == Suzuki screw form == RH; any margin theta<1 over all finite tests is false).
5. tmp/research-2026-11-16/pick/NEXT_STAGE.md (Pick positivity K<=12 from verified height) and tmp/research-2026-11-16/euler/RESULT.md (interim: Davenport-Heilbronn passes Pick positivity to order 100 on nested nodes: finite Pick orders are Euler-blind).

## Known walls (an argument that ignores these is wrong)
- Davenport-Heilbronn (DH) control: same functional equation, no Euler product, zeros off the line. Any valid argument must FAIL for DH; say exactly which step uses the Euler product (Lambda(n) >= 0, multiplicativity, or Hecke structure).
- Flow-blindness: hypotheses stable under small backward heat flow cannot give RH.
- MV-CAP: mean-value inputs cannot certify every-window statements.
- Verified height: finite certificates only restate it.
- The only genuinely new arithmetic input in 2026: the openai/math zero-free half-plane Re s > 7/8 (Lean-checked locally; follow-ups Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835 reach ~0.874887). Its obstruction: the P_a^{1/6} exceptional term == TRO6 natural (power saving for correlations of sextic Kubota theta coefficients with the cubic rows).

## Rules
- Write ONLY under tmp/research-2026-11-16/push/<your-slug>/. Deliverable: RESULT.md (plan stating what is new vs atlas and walls; work; DH control; verdict; 3 weakest steps).
- No pushes, PR comments, or edits to PRs/branches/other dirs. Do not touch ~/Documents/Codex or pid 2508. Don't edit src/data/improvements.js or improvement-queue.js.
- Numerics: mpmath/python-flint, single process, < 4 GB RAM, runs < 20 min each. No paid compute.
- If your angle dies, say why precisely and then pivot ONCE to the strongest adjacent idea you found; do not cycle.
- Plain functional language. Final message <= 300 words with verdict.

## Heavy compute
(Private compute-server details removed from the published copy.)

## Added 2026-11-16 (after the first results): mandatory filters and the square-root lane
- Three controls every argument must be run against: Davenport-Heilbronn (DH); the backward heat family (kernel e^{tau u^2/16} kappa, tau < 0, where the conclusion is false); the sign twist Lambda(n) -> eps_n Lambda(n), |eps_n| <= 1 (kills anything using only the size, positivity or support of Lambda). Three independent lanes proved that positivity/support of Lambda plus the functional equation cannot suffice: a proof must use multiplicativity in an essential step.
- Square-root lane (tmp/research-2026-11-16/push/g-spinor-square-root/RESULT.md + REFEREE.md, refereed): with F(z) = xi(1/2+z), D = F + alpha F', N = F - alpha F', S = N/D (unitary on the imaginary axis), Q_c = 1_(c,inf), P_c = 1 - Q_c: bridge energy H_c = A* M_c A with Hankel blocks Gamma_+ = P S Q (causal), Gamma_- = Q S P (anticausal); H_c >= 0 iff Gamma_- = 0 iff S is causal (bounded analytic in Re z > 0) iff RH; then H_c = (Gamma_+ Q A)*(Gamma_+ Q A). Unconditionally H_c = sum over zeros gamma of y_gamma conj(y_gammabar) (a Krein-space square, involution J: gamma <-> gammabar; J = 1 iff RH); negative index = rank Gamma_- = number of off-line pairs; S = Cayley transform of alpha L, L = F'/F. Related: g-passive-cascade (Euler product = series chain of negated lossless prime stubs on the gamma one-port, proved for Re s > 1; DH breaks at a parallel junction), g-coupling-norm, g-antibridge-cancel.
