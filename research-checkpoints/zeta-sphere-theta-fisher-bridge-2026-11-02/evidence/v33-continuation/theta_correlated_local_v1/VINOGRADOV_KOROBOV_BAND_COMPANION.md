# Stronger zero-free rate in the same signed-tail construction

Status: independent analytic review PASS. Companion to the frozen DEGREE_DEPENDENT_CRITICAL_BAND.md; no constants or estimates in that packet are changed.

Keep η,m,C,τ,R_n and b_n exactly as defined there. The same primary paper, Mossinghoff–Trudgian–Yang (2024), Theorem 1.1, gives the unconditional zero-free region

β≥1−1/[55.241 (log|γ|)^{2/3}(log log|γ|)^{1/3}], |γ|≥3.

The low-height argument in the core proof extends to |γ|≤3 without new computation: for the tilted complete-theta density, E(u²)≤1/17+1/1156, and

Re E(e^{itu})≥1−9/34−9/2312>0, |t|≤3.

Thus no nontrivial zero at these low heights is left to an unverified table.

For x≥5 define

b_class(x)=1/[6log x],
b_VK(x)=1/[56(log x)^{2/3}(log log x)^{1/3}],
ε̃_n=min(1/4,max(b_class(R_n+3),b_VK(R_n+3))).

Both denominator functions are increasing in the relevant height range. Each is a conservative weakening of the corresponding published zero-free theorem. Therefore every zero with |γ|≤R_n+1 has |Im zero(Xi)|<1/2−ε̃_n. The reflected-pair argument and full signed-tail payment in the core packet apply unchanged.

Consequently the strict degree≤n block positivity, central lower bound (2), and selected Ward estimate (9) from that packet hold throughout

a∈[1/2−ε̃_n,1/2].

Combining with the separately established exterior result gives positivity for every a≥1/2−ε̃_n. The unchanged constants are still unevaluated full-theta integral definitions; no numerical shift cutoff is asserted.

Since log R_n/log n→1, the Vinogradov–Korobov term eventually dominates and

ε̃_n ~ 1/[56(log n)^{2/3}(log log n)^{1/3}].

This improves the asymptotic rate of the shrinking band, not its limiting endpoint: ε̃_n→0. It proves no fixed a<1/2 positivity at all degrees and no RH statement. It is an analytic corollary of established zero-free theory, not a new zero-free result.

Primary source: Theorem 1.1 of https://link.springer.com/article/10.1007/s40993-023-00498-y, also https://arxiv.org/abs/2212.06867. The coefficient 56 deliberately weakens 55.241.
