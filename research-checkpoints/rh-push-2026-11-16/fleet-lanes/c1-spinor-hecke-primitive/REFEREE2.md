# REFEREE2: c1-spinor-hecke-primitive, Lemmas 3-5 on the corrected domain

Date: 2026-11-17. Second pass, owed from round 1 (lane `c2-repair-owed-passes`). Scope: Lemmas 3, 4, 5 of
RESULT.md with the domain corrected as the first referee required; the first referee's repair is checked line by
line; the corrected lemmas are stated in full. Labels: PROVED (argument below; this pass, one author),
CLASSICAL, MEASURED, NOT ESTABLISHED. Nothing here is a statement about zeros of zeta.

## Outcome

- Lemma 3 as written is false in (a) (first referee, confirmed). **Corrected Lemma 3' holds for zeta** (section 1).
- Lemma 4 holds as a computation. **Added Lemma 4'**: on the all-prime primitive class in the finite-S convention
  the infimum is again the infimum over all tests (section 2).
- Lemma 5: the two `y_z` formulas hold; the operator identities hold as identities for Hankel blocks of the product
  symbol (section 3).
- **The negative verdict stands** (no lower bound; restricting to jointly primitive tests neither helps nor costs,
  for zeta). One part of it is weaker than written: the claim "holds verbatim for DH, E_a, T-NR, the sign twist"
  (Lemma 3(d)) is NOT ESTABLISHED for DH and for E_a with a >= 1/8, and the first referee's parenthesis on E_a is not
  unconditional (section 1, scope). For those controls the statement is MEASURED only (tables of both reports).

Counts for this lane: lemmas that hold as corrected: 3 (3', 4, 5) plus one added (4'); lemma parts that fail as
written: 2 (3(a); 3(d) for DH and E_a); negative verdict: stands.

## 1. Corrected Lemma 3

Setting. D = smooth functions with compact support in (0, infinity). `V(z) = int v(t) e^{-zt} dt` is entire and
`|V(x + i tau)| <= C_A (1 + |tau|)^{-A} e^{|x| b}` for `|x| <= 1` (support in [0, b]). `Q(v, x) = sum_rho V(rho) conj X(J rho)`
over the zeros of `xi(1/2 + z)`, `J rho = -conj rho`, `Q(v) = Q(v, v)`; the sum converges absolutely on D.
`U_n` has multiplier `n^{-1/2-z}`. `M_S = prod_{p in S}(1 - U_p)`, multiplier `m_S(z) = prod (1 - p^{-1/2-z})`.

**Lemma 3' (PROVED; zeta).** Let S be a finite set of primes.
(a') `M_S(D)` is contained in D and is a proper subspace of infinite codimension: `w = M_S v` has
`W = m_S V`, which vanishes at every zero of `m_S` (`z = -1/2 + 2 pi i k/log p`); a test with `V(-1/2) != 0` is not in
`M_S(D)`.
(b') For `v` in D put `v_N = M_S sum_{n in N_S, n <= N} U_n v`, an element of `M_S(D)`. Then `v_N -> v` in `L^2` and
`Q(v_N, x_N) -> Q(v, x)` for all `v, x` in D.
(c') Consequently `inf Q(w)/||w||^2` over `w` in `M_S(D)` equals the infimum over D, and the negative index of Q on
`M_S(D)` equals the negative index of Q on D.
(d') Scope. The proof of (b') uses three properties of the zero set: (Z1) every zero has `|Re rho| < 1/2`; (Z2) a
zero-free region `1/2 - |Re rho| >= c/log(|Im rho| + 2)`; (Z3) `#{|Im rho| <= G} = O(G log G)`. It holds for any
function whose form is a zero sum of this kind over a set with (Z1)-(Z3).

Proof of (b'). The transform of `v_N` is `(1 - t_N) V` with `1 - t_N(z) = m_S(z) sum_{n in N_S, n <= N} n^{-1/2-z}`
(entire), and `t_N(z) = m_S(z) sum_{n in N_S, n > N} n^{-1/2-z}` for `Re z > -1/2`.
- `L^2`: on `Re z = 0`, `|t_N| <= prod (1 + p^{-1/2}) sum_{n in N_S, n > N} n^{-1/2} -> 0`.
- Zero side. Let `Psi(x) = #{n in N_S, n <= x} <= C (log x)^k`, `k = |S|`. Put `G = exp(sqrt(log N))`,
  `delta = c/log(G + 2)`, about `c/sqrt(log N)`.
  Low zeros `|gamma| <= G`: by (Z1), (Z2), `Re rho >= -1/2 + delta` and the same for `J rho`. There
  `|t_N(z)| <= 2^k sum_{n in N_S, n > N} n^{-delta} <= 2^k delta int_N^infinity x^{-delta-1} Psi(x) dx
  = O(N^{-delta} (log N)^k delta^{-k}) = O(exp(-c sqrt(log N)) (log N)^{3k/2}) =: eps_N -> 0`. The low part of
  `Q(v_N, x_N) - Q(v, x)` is at most `(2 eps_N + eps_N^2) sum_rho |V(rho) X(J rho)| -> 0`.
  High zeros `|gamma| > G`: for `Re z > -1/2` every term has `|n^{-1/2-z}| <= 1` and `|m_S| <= 2^k`, so
  `|1 - t_N(z)| <= 2^k Psi(N)`. The high part is at most `(1 + 2^k Psi(N))^2 sum_{|gamma| > G} |V(rho) X(J rho)|
  = O((log N)^{2k} G^{-A}) = O((log N)^{2k} exp(-A sqrt(log N))) -> 0` by (Z3) and the decay of V, X.
Proof of (c'). "At least": `M_S(D)` is inside D. "At most": apply (b') to a near-minimiser. Index: if Q is negative
definite on `span(v_1..v_r)` in D, the Gram matrix `Q(v_{i,N}, v_{j,N})` converges to a negative definite matrix, so
Q is negative definite on `span(v_{1,N}..v_{r,N})` in `M_S(D)` for large N; the other inequality is inclusion. QED.

This is the first referee's repair; every line was re-derived and is correct. Two additions: the index statement in
(c'), and the scope (d') with the two consequences below.

Rate (MEASURED, `push/c2-repair-owed-passes/checks.py lemma3`, S = {2, 3, 5}, sup of `|t_N|` over four heights):

| N | #{n <= N} | Re z = 0 | Re z = -0.4 | Re z = -0.49 | Re z = -0.6 |
|---|---|---|---|---|---|
| 1e3 | 86 | 0.21 | 5.6 | 11.9 | 30.5 |
| 1e12 | 3429 | 8.7e-5 | 9.5 | 132 | 3351 |
| 1e24 | 25127 | 3.4e-10 | 2.3 | 385 | 2.0e5 |
| 1e48 | 192189 | 1.9e-13 | 0.035 | 859 | 2.0e8 |

Convergence at `Re z > -1/2` is as slow as the proof predicts (`N^{-delta}` against a power of `log N`), and there is
no convergence for `Re z < -1/2`.

Scope consequences.
- **DH: (Z1) fails.** The Davenport-Heilbronn function has zeros with `Re s > 1` (CLASSICAL; the map's control table
  records sup Re about 1.12). For such a zero `Re(J rho) < -1/2` and `1 - t_N(J rho)` diverges (last column of the
  table). The approximation (b') is not available, so "the infimum on primitive tests equals the infimum on all
  tests" is NOT ESTABLISHED for DH. What is known for DH is MEASURED: negative minimum on primitive and on full
  spans with bands containing an off-line zero (both reports).
- **E_a: (Z1) needs a zero-free half-plane.** The zeros of `E_a` in the z-variable are `rho_zeta +- a`. (Z1)-(Z2) for
  `E_a` hold iff zeta has no zero with `Re s >= 1 - a` (with the logarithmic margin). Unconditionally this is known
  only for `a < 1/8` (zero-free half-plane `Re s > 7/8`, Lean-checked). For `a = 0.2`, the value used in the tables,
  it is not known; the first referee's sentence "E_a with a = 0.2 ... in a fixed closed sub-strip" holds for the
  computed zeros only.
- T-NR `xi(s)(2 cosh((s - 1/2) log q) + c)`: (Z1)-(Z3) hold iff `arccosh(|c|/2)/log q < 1/2`. Sign twists: the form
  is not a zero sum of this kind in general; nothing is claimed.
- Lemma 1 (the Gram matrix of the dilations does not contain the function) is exact for every control and does not
  depend on any of this.

Still not established (first referee's GAP, unchanged): that the common infimum is "0 or minus infinity" on D, i.e.
the identification with P10; P10 is proved on exponential node families, a different class.

## 2. Lemma 4, and Lemma 4'

Lemma 4 (CONFIRMED). For `w` in D with `W(1/2) = 0`: `zeta(1/2 + z) W(z)` is entire, lies in `H^2(Re z > 0)` (zeta is
polynomially bounded on `Re z >= 0` once the pole is cancelled; `|W(x + i tau)| <= C_A (1 + |tau|)^{-A} e^{-x t_0}`
with `t_0 > 0` the left end of the support), and is the transform of `Zw = sum_n U_n w`, a locally finite sum. It
vanishes at every rho and J rho, so `Q(x + Zw) = Q(x)` with Q defined by the zero sum. `Zw` is not compactly
supported; it is outside D. This is P12 (known).

Corrected reading. With the finite-S convention (Q evaluated on the primitive component `w`, not on the
reconstruction `Zw`), the all-prime primitive class contains `D_0 = {w in D : W(1/2) = 0}`. Item 3 of the result's
verdict ("the fully primitive coordinates see the form as identically zero") refers to `Zw`, not to `w`.

**Lemma 4' (PROVED; this pass).** `inf Q(w)/||w||^2` over `D_0` equals the infimum over D, and the negative indices
agree.
Proof. Let `S_s` be translation by `s > 0`: it maps D to D, preserves Q and the norm, and `(S_s v)^(z) = e^{-sz} V(z)`.
Fix `phi` in D with `Phi(1/2) = 1` and put `v_s = S_s v - e^{-s/2} V(1/2) phi`, an element of `D_0`. Then
`||v_s - S_s v|| -> 0`, and `Q(v_s) = Q(v) - 2 Re[conj(eps_s) Q(S_s v, phi)] + |eps_s|^2 Q(phi)` with
`eps_s = e^{-s/2} V(1/2)`. The cross term is a sum over zeros of terms of modulus at most
`e^{-s(1/2 - |Re rho|)} |V(1/2)| (|V(rho) Phi(J rho)| + |Phi(rho) V(J rho)|)`; each tends to 0 because `|Re rho| < 1/2`
for every zero (CLASSICAL: zeta has no zero on `Re s = 1`), and the sum is dominated by a convergent series. So
`Q(v_s)/||v_s||^2 -> Q(v)/||v||^2`. The index statement follows as in 3'(c'). QED.
So on either reading the all-prime primitive class gives no bound that is not the bound on all tests. Lemma 4' uses
only the non-vanishing on the 1-line; its proof is not available for a control with a zero on `|Re z| = 1/2` or
beyond (DH).

## 3. Lemma 5

- `y_z(V_d a; c) = d^{-1/2-z} [y_z(a; c) - R_{c,d}(z)]`: with `(kappa * V_d a)(r) = d^{-1/2} (kappa * a)(r + 2 log d)`,
  substitute `r' = r + 2 log d`: `d^{-1/2} int_{c + 2 log d}^infinity (kappa * a)(r') e^{z(r' - 2 log d - c)/2} dr'`. CONFIRMED.
  (The multiplier `d^{-1/2-z}` and the window `(c, c + 2 log d]` fix the direction of the shift.)
- `y_z(M_S a; c) = m_S(z) y_z(a; c) - sum_{d | prod S, d > 1} mu(d) d^{-1/2-z} R_{c,d}(z)`: linearity and `V_d V_e = V_{de}`.
  CONFIRMED. These are pointwise identities for every `a` for which `y_z(a; c)` converges; no domain correction is
  needed.
- Operator identities: with `Gamma_-[S U] := Q_c S U P_c` (U a multiplier commuting with S),
  `Gamma_-[S U] = (Q U Q) Gamma_-` when `Q U P = 0`, and `Gamma_-[S U] = Gamma_- (P U P) + (Q S Q)(Q U P)` in general
  (insert `1 = P + Q`). CONFIRMED in this reading; as a composition `Gamma_- o U` the first also needs `P U Q = 0`
  (first referee; confirmed). Nothing downstream uses it.
- Control scope: the formulas use only that A is a convolution; they hold for every control. CONFIRMED.

## 4. Does the negative verdict stand?

Yes. For zeta, on smooth compactly supported one-sided tests: a lower bound for `Q/||.||^2` on jointly S-primitive
tests (finite S), or on the all-prime class `D_0`, is the same number as the lower bound on all tests, and the
negative indices agree (Lemmas 3', 4'). No bound is obtained; flags R1 = R2 = R3 = R4 = false, unchanged.
What changes in the record: (i) "congruence" is replaced by "simultaneous approximation in norm and in Q"; (ii) the
control-blindness of this step is proved for zeta-type zero sets only and is measured, not proved, for DH and E_a
(a >= 1/8); (iii) the dichotomy "0 or minus infinity" and the name "P10" remain not established on this class.
The proof of 3' uses the classical zero-free region and the proof of 4' uses non-vanishing on the 1-line: on this
class the equivalence "primitive tests <=> all tests" is itself a prime-number-theorem-strength fact, not algebra.
