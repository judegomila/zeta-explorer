# Next stage: seven-node real xi Pick positivity (certified through K = 12)

Date: 2026-11-16. Scratch research note. It is not reviewed by anyone else
and is not published. It makes no RH claim.

## Result

Let F(x)=ξ(1/2+x), L=F'/F, and P_ij=(L(x_i)+L(x_j))/(x_i+x_j).

**Theorem (K ≤ 12).** For every K ≤ 12, P is positive definite for
every choice of K distinct positive reals x_1,…,x_K.

The proof uses the following inputs:

- Platt–Trudgian: every zero with ordinate in (0, 3·10^12] lies on the
  critical line.
- Trudgian's explicit bound on S(t) in the Riemann–von Mangoldt formula.
- The classical critical strip.
- Arb enclosures of the first 20,000 zeta ordinates.
- The Dobsch–Donoghue local characterization of matrix monotonicity of
  fixed order.

The proof does **not** use the theta-preservation machinery of PRs
#51–#55. It runs by a different route, and the same route covers every K
for which `k_node_certificate.py K` passes. Runs for K = 7, 8, 10 and 12
all pass. K ≤ 12 includes the intermediate orders, because a principal
submatrix of a positive definite matrix is positive definite.

The consequence for the program is that the finite stages are consequences
of verified zero height. See "What this means for the stage ladder" below.

## 1. Reduction to two one-variable Hankel conditions

Write u = x², h(u) = L(√u)/√u and j(u) = u·h(u). The exact identity

    P(x,y) = j[x²,y²] − x·y·h[x²,y²]          (1)

uses divided differences f[u,v] = (f(u) − f(v))/(u − v). It is also eq.
(29) of PR #50, and I re-checked it with sympy (`sympy_identities.py`).
On distinct nodes, (1) says

    P = Loew_j(u) + X · Loew_{−h}(u) · X,   X = diag(x_i),

where Loew_f is the Loewner matrix [f[u_i,u_k]].

Two classical facts are used.

- **Loewner.** f is matrix monotone of order K on an interval I iff every
  K×K Loewner matrix of f with nodes in I is PSD (Bhatia, *Matrix
  Analysis*, Thm V.3.4).
- **Dobsch–Donoghue.** For f ∈ C^{2K−1}(I), f is matrix monotone of order
  K iff the Hankel matrix M_K(f;u) = [f^{(i+k−1)}(u)/(i+k−1)!]_{i,k=1..K}
  is PSD at every u ∈ I. References: Donoghue, *Monotone Matrix
  Functions and Analytic Continuation* (1974), Ch. VII; O. Heinävaara,
  Proc. AMS 146 (2018) 3791–3799.

Let h_7(u) = 2·Σ_{n≤7} 1/(u + γ_n²) be built from any seven distinct
real zeros, and put f = −h + ½·h_7. Then

    Loew_{−h} = Loew_f + Σ_{n≤7} c_n c_nᵀ,   (c_n)_i = 1/(u_i + γ_n²).

The second term is a nonsingular Cauchy-type Gram matrix at distinct u_i,
so it is positive definite. Therefore:

> If M_K(f;u) ⪰ 0 and M_K(j;u) ⪰ 0 for every u > 0, then every K-node real
> Pick matrix of L is positive definite.

The argument runs as follows. Dobsch–Donoghue makes f and j matrix
monotone of order K on (0,∞). Loewner then gives Loew_f ⪰ 0 and
Loew_j ⪰ 0. Hence P ⪰ X·(Σ c_n c_nᵀ)·X ≻ 0.

This sufficient condition differs from the PRs' stage criteria. The PRs
need much less monotonicity per stage: stage 4 is order-2 monotonicity of
1/h and j (PR #50 §7). The present condition asks for order-K
monotonicity, and in exchange it is uniform in K and local in u.

## 2. Spectral form of the two Hankel conditions

Take each centered zero β+iγ of F with γ > 0 (with multiplicity), and put
λ = −(β+iγ)² and ζ_λ = u/(u+λ). Then h(u) = 2·Σ_λ 1/(u+λ). After the
congruences y_i = (−1)^i u^i v_i (for f) and y_i = (−1)^i u^{i−1/2} v_i
(for j):

    yᵀ M_K(f;u) y = 2 Σ_λ c_λ · Re[ P(ζ_λ)² ],
        P(ζ) = Σ_{i=1..K} v_i ζ^i,  with c_λ = ½ for the seven h_7 zeros
        and c_λ = 1 otherwise;
    yᵀ M_K(j;u) y = 2 Σ_λ Re[ ζ_λ (1−ζ_λ) · Q(ζ_λ)² ],
        Q(ζ) = Σ_i v_i ζ^{i−1}.

The sums are over a conjugation-invariant multiset, so they are real.

- **Head zeros** (γ ≤ T = 3·10^12): λ = γ² and ζ ∈ (0,1). Every head term
  is ≥ 0.
- **Tail zeros** (γ > T): ζ = r·e^{iψ} with r < 1 and
  |ψ| ≤ γ/(γ² − ¼).

Fix a scale a ∈ (0,1] with every |ζ_λ| ≤ a. The certificate uses
a = u/(u+γ_1²) when u ≤ 10^7 and a = 1 otherwise. Put t = ζ/a, so the
polynomials become polynomials in t on [0,1].

**Lemma T (tail).** Let G be a real polynomial of degree ≤ n, let
t = ρ·e^{iψ} with ρ ≤ 1, and let ‖G‖ = sup_{[0,1]} |G|. Then

    |Re G(t) − G(ρ)| ≤ C_n · ‖G‖ · ρ · ψ²,
    C_n = n² + (2/3)·n²(n²−1) + 1.

Proof: Taylor-expand at ρ. Use Re(t − ρ) = ρ(cos ψ − 1) and
|t − ρ| ≤ ρ|ψ|. Bound ‖G^{(k)}‖ by the Markov bound 2^k·T_n^{(k)}(1)·‖G‖.
The terms with k ≥ 3 are below ψ² because ψ < 4·10^{−13}.

Apply Lemma T with G = P² and with G = a·t(1−at)·Q², both of degree
n = 2K. It gives

    form ≥ (1/2 or 1)·Σ_{chosen} G(ρ_m) − C_n · ‖G‖ · ρ_max · S',
    S' = Σ_{γ>T} ψ_γ² ≤ (1+10^{−20}) · Σ_{γ>T} γ^{−2}.

Here ρ_max ≤ (u + γ_1²)/(u + T²) for u ≤ 10^7, and ρ_max ≤ 1 otherwise.
"Chosen" is any set of K zeros, either real head zeros or windows that
are guaranteed to contain a zero. For a chosen tail zero, its realified
node ρ = |ζ|/a is used, and its own error is already inside the tail sum.

**Tail sum.** Write N(t) = θ(t)/π + 1 + S(t), with Trudgian's bound
|S(t)| ≤ 0.112 log t + 0.278 log log t + 2.510 for t ≥ e. Binet's second
formula gives

    |θ'(t) − ½ log(t/2π)| ≤ 1/(6t) + 1/(16t²).

Together these give Σ_{γ>T} γ^{−2} ≤ 1.4797·10^{−12}.

**Norming.** Write ‖G‖ through Lagrange interpolation on the chosen nodes:

- For P, the nodes are {0} ∪ {s_m}; the node 0 is forced because P(0)=0.
- For Q, the nodes are {s_m}.

With Λ the Lebesgue constant, positivity follows from

    (H)  2 · C_n · ρ_max · S' · Λ_H² < 1,
    (J)  C_n · ρ_max · S' · (sup w / min_m w(s_m)) · Λ_J² < 1.

Strictness holds because a nonzero P of degree ≤ K with P(0) = 0 cannot
vanish at K distinct nonzero nodes.

## 3. Covering all u > 0 (`k_node_certificate.py`)

**Region L, u ∈ (0, 10^7].**

- The u-range is split into 815 geometric cells of ratio 1.02, plus the
  cell [0,1].
- In each cell, K zeros are chosen among the first 20,000 Arb-enclosed
  zeros, with t-values near Chebyshev targets.
- The node t_m(u) = (u + γ_1²)/(u + γ_m²) is monotone in u, so each node
  is the hull of its two cell endpoints, widened by the enclosure radius.
- Λ is bounded rigorously with 1,500 Arb sub-intervals of [0,1].

Because ρ_max ≤ 10^{−18}, this region has a margin of about 10^{18} even
though Λ_H reaches about 2.5·10^4 at small u.

**Region H, u ≥ 10^7, with a = 1.**

- Node k comes from a zero with ordinate in the window
  (γ*_k, 1.03·γ*_k], where γ*_k = √(u·s_k) and s_k = 1/z_k − 1.
- **Lemma W (window).** Such a zero exists because
  θ(t(1+δ)) − θ(t) ≥ t·δ·(½ log(t/2π) − 2/(3t)) exceeds π·(E(t) + E(t(1+δ))).
  This is checked at t_min ≈ 602, and the margin increases in t.
- The windows are disjoint. A zero in them may lie off the line if its
  ordinate exceeds T; its realified node satisfies
  u/(u + γ² + ½) ≤ ρ ≤ u/(u + γ² − ¼).
- The resulting node intervals do not depend on u beyond a 1/(2·10^7)
  slack, so a single Lebesgue computation covers all u ≥ 10^7.

**Replayed outputs** (`cert_K7.log`, `cert_K8.log`, Arb at 128 bits):

| K | Region L worst ratio (H / J) | Region H ratio (H / J) | Verdict | Runtime |
|---|---|---|---|---|
| 7 | 1.0e−21 / 5.0e−22 | 7.9e−6 / 2.4e−5 | ALL PASS | 73 s |
| 8 | 3.1e−19 / 1.3e−19 | 3.4e−5 / 1.0e−4 | ALL PASS | 84 s |
| 10 | 1.7e−14 / 1.1e−14 | 6.0e−4 / 1.7e−3 | ALL PASS | 122 s |
| 12 | 1.2e−7 / 6.2e−8 | 1.1e−2 / 2.9e−2 | ALL PASS | 165 s |

The ratios grow by roughly 3–8× per order. With these node rules and
T = 3·10^12, the method should stop working somewhere in the mid-teens.
K = 13 and above were not tried.

**Independent numerical sanity check (not proof).** `pick_sanity.py`
computed LDL pivots of the actual 7- and 8-node matrices on 120 random
node sets each: log-spread, 5% clusters, uniform, and large-x. All pivots
are positive. The smallest pivot ratio is about 1e−50, from the clustered
sets.

**Caveats on rigor.**

- The analytic lemmas above are mine and have not been cross-checked by
  another person.
- Dobsch–Donoghue and Trudgian's S(t) constants are cited, not reproved.
- The Arb zero enclosures are used only as "real zeros with these
  ordinates". Their indexing is not needed.
- PT is used only to make λ real for γ ≤ T.

## What this means for the stage ladder

1. Every finite stage covered so far (2–6 nodes) and the new stages 7 and
   8 follow from verified zero height plus explicit zero counting. The
   implication is the one above: Hankel positivity of order K of j and
   −h + ½h_7, then Loewner monotonicity, then identity (1). The tail
   constant is about K⁴·log T/T against Lebesgue constants of the chosen
   nodes.
2. The margins for K = 7 are about 10^{−5} against 1. The method reaches
   K = 12 with the present T. The order it reaches grows with T, but it is
   finite for every finite T.
3. The all-order statement is RH-equivalent (Lagarias). No finite-height
   argument reaches it.
4. The PRs' theta-preservation route (#53, #55) uses no zero data. It
   would matter for RH only if it became an **induction** proving
   preservation at every depth. PR #55 itself lists that induction as
   open.

## Precise obstruction for an all-order version

- **In this method:** the tail error per order is about
  C_{2K} · S_T · Λ_K². Here C_{2K} ~ (2/3)(2K)⁴, S_T ~ log T/(2πT), and
  Λ_K is the norming constant of the available zero nodes. C_{2K}·Λ_K²
  grows without bound in K, while S_T is fixed by T. So for fixed T the
  sufficient condition fails at some finite K, observed here to be above
  12. This is the quantitative form of PR #50 §4: a finite verified head
  cannot control the null directions at all orders. Reaching every K
  requires control of the off-line tail at every height, which is
  equivalent to RH.
- **In the PR route:** what is missing is a preserved sign pattern for the
  source densities after every canonical reduction. Each finite depth is
  so far checked by new certificates. No inductive invariant is proved,
  and PR #47 already shows that generic scalar concavity does not
  propagate.

## Files

- `xi_series.py`: Taylor data of h from ξ via Arb (diagnostics).
- `hankel_probe.py`, `hankel_curve.py`: midpoint Hankel diagnostics.
- `sympy_identities.py`: identity (1) and the PR #48/#50 identities.
- `get_zeros.py`, `zeros_20000.json`: Arb zero enclosures.
- `k_node_certificate.py`: the certificate. Run it as
  `venv/bin/python -I k_node_certificate.py K 1.02`.
- `cert_K7.log`, `cert_K8.log`, `cert_K10.log`, `cert_K12.log`: certificate outputs.
- `pick_sanity.py`: the numerical sanity check of actual Pick matrices.

## Referee correction (2026-11-16, see REFEREE.md)
- K ≤ 7: holds as written (positive definite).
- K = 8..12 as written gives only positive SEMIdefinite: Σ_{n≤7} c_n c_nᵀ has rank ≤ 7, and Dobsch–Donoghue/Loewner give non-strict conclusions for the other parts; the P(0)=0 strictness remark concerns the Hankel form, not the Loewner matrix.
- Fix: replace h_7 by h_K built from K distinct zeros; the extra term becomes CCᵀ with C a nonsingular K×K Cauchy matrix, so P is positive definite. The certificate only uses 1/2 ≤ c ≤ 1, so all certified numbers stand (referee's statement; code not re-run with h_K).
- Nits: running max in the Lebesgue bound compared in floating point; zero-enclosure endpoints stored as 30-digit round-to-nearest strings padded by 1e-30. "815 cells plus [0,1]" should read "815 cells including [0,1]".
- Tail bound (Trudgian 2014 constants), Arb coverage, and no-RH-assumption all HOLD; K=7 rerun reproduced cert_K7.log.
