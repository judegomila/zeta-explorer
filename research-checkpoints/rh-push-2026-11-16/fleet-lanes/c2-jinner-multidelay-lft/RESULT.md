# c2-jinner-multidelay-lft: J-contractive linear-fractional sections in several delays

Date: 2026-11-17. Scratch research note, unreviewed. No RH claim. No statement about zeros of zeta is made.
Labels: PROVED (argument written here), CLASSICAL (published theorem), MEASURED (float64 / mpmath, not
interval-certified), OUTLINE (derivation indicated, not written line by line), OPEN.
Files here: `t1_rigidity.py/.log/.json`, `t1b_junction.py/.log/.json`, `t2_abel.py`, `t2_abel_{zeta,dh,two}.log/.json`,
`t3_dh_bracket.py/.log/.json`. All runs local through `scripts/memcap.sh 8` (longest 8.4 minutes). The compute
server was not used.

## Verdict

**Precise obstruction; the family is closed, for finite and for infinite prime sets.** Second same-kind obstruction
after `c1-multidelay-bohr-section` (rank-one additive defect), so the family closes under STRATEGY section 3.

1. **Rigidity (Lemma R, PROVED).** A holomorphic J-contractive matrix function `Theta~` of the delays (on the
   polydisc `D^P`, `P` finite, or on `D^inf ∩ c_0`) for which `S = T_Theta[S_1]` with `S_1` Schur near `x = +infinity`
   is `Theta~(w) = M(H(w)) V_0` with `V_0` a constant J-unitary matrix and `H` holomorphic, `Re H >= 0`. The
   non-unipotent normalisation `Theta(0) = M(c_0) U_0`, `c_0 > 0`, forces the whole function into the unipotent family
   times a constant. The joint defect is `Re H * V_0* E V_0`: rank one and additive. Rank 2 does not occur. The proof
   is a maximum principle for the Potapov-Ginzburg transform; it uses only `S(x) -> -1`, i.e. the growth of the gamma
   term.
2. **Termination-independence (Lemma R', PROVED).** If a section `Theta_P(w_P)` of the prime chain is required to
   leave a termination that depends only on the primes outside `P`, then `Theta_P = c(w_P) M(-alpha U_P(w_P)) K` with
   `K` constant and `c` scalar. Same conclusion.
3. **First moment with Abel weights, any prime set (Theorem A', PROVED; re-derivation of c1 Theorem A step (iii) by a
   different method).** For every positive-real ordinary Dirichlet series `h = sum a_m m^{-z}` of Bohr-lift type with
   atomic boundary measure `pi sum r_j delta_{gamma_j}`:
   `sum_{gamma_j > t_0} r_j zeta(1/2 + i gamma_j) e^{-delta gamma_j} = (a_1 + conj h(1/2))/(2 pi delta) + O_eps(delta^{-1/2-eps})`.
   No finiteness of `P` and no approximate functional equation are used; the functional equation enters as an exact
   Mellin-Barnes integral. MEASURED on a non-separable two-delay example and on a 25-prime example (Section 4).
4. **Closure (Theorems B', C; PROVED, unconditional).** If `alpha L - h` is positive-real for such an `h`, then `h` is
   an imaginary constant. Hence: if `S = T_Theta[S_1]` on `Re z > 0` with `Theta` as in item 1 and `S_1` Schur, then
   `Theta~` is a constant J-unitary matrix. This covers (a) the non-unipotent normalisation and (b) infinite `P`,
   both left OPEN in c1.
5. **DH analogue (Proposition E; positivity PROVED, the DH moment formula OUTLINE + MEASURED).** For the
   Davenport-Heilbronn function the bracket of the first moment has real part at least `1.0597 Re a_1 > 0` for every
   prime set, finite or infinite, by Schwarz-Pick on the polydisc. So the no-go holds for DH as well: the poles of
   such an `h` are not all critical-line zeros of DH. The step of c1 that was attributed to multiplicativity (point
   evaluation) is not essential; positivity survives for any two-character combination with `kappa < 1`.
6. **Infinite `P` and the limit (Proposition L).** The sharp sections converge on `1/2 < sigma < 1` in `L^2` of the
   Bohr torus and Haar-almost everywhere, not at the orbit point of zeta; J-contractivity is not closed in that
   topology. The tapered sections of c1 Proposition D converge locally uniformly on `sigma > theta` if and only if
   they are locally bounded there, and that holds if and only if zeta has no zeros with `sigma > theta`. No limit
   theorem without a boundedness statement equal to zero-freeness was found.

The decisive test named in the assignment (smallest eigenvalue of the joint section Pick matrix, `P = 2..50`) is
conditional on rank > 1 occurring. It does not occur (items 1, 2), so the test was not run; what was run instead is
listed in Section 2. Nothing here moves RH. No pivot was used.

## 0. Plan and what is new against the map

| Item | State before | This note |
|---|---|---|
| c1 OPEN (i): J-inner linear-fractional section with `Theta(0) = M(c_0) U_0`, `c_0 > 0`, non-additive | partial reduction only | Lemma R: such a section is `M(H) V_0`. Closed. |
| c1 OPEN (ii): infinite `P` | c1 Theorem A needs `sum_{m in <P>} m^{-c} < infinity`, `c < 1/2` | Theorem A' for every PR Dirichlet series of Bohr-lift type; Lemma R on `D^inf ∩ c_0`. Closed. |
| c1 OPEN (iii): DH analogue | "sign not forced", no counterexample found | Proposition E: sign forced for all `P` (Schwarz-Pick). The no-go is not specific to zeta. |
| c1 Theorem A step (iii) (owed a pass) | outline, referee re-derived | Not relied on. Theorem A' is an independent derivation with exponential weights; main term agrees. |
| Q10, Q12 (map) | chain `l^2` on `sigma > 1/2`; multi-delay OPEN | Q12's open clause "jointly inner multi-delay sections" closed in the classes of Sections 1-5. |

Answers required by STRATEGY section 1, stated before work: R1: the lane has no step where multiplicativity is
essential unless the DH analogue fails (it does not: Section 5). R2: the conclusions are no-go statements, uniform
because they concern the whole half-plane. R3: to be tested per junction (Section 7). R4: only through Proposition L.

Notation as in `sq-causal-cascade` and c1: `s = 1/2 + z`, `F(z) = xi(1/2 + z)`, `L = F'/F`, `alpha > 0`,
`S = (1 - alpha L)/(1 + alpha L)`, `J = diag(1,-1)`, `N = [[-1,-1],[1,1]] = (-1,1)^T (1,1)`, `E = (1,1)^T (1,1)`,
`M(Z) = I + (Z/2) N`, `T_Theta[e] = (Theta_11 e + Theta_12)/(Theta_21 e + Theta_22)`. With this normalisation
`T_{M(Z)}[e] = (1 - Z - Z_e)/(1 + Z + Z_e)`, `Z_e = (1 - e)/(1 + e)`, and `S = T_{M(alpha L)}[1]`. J-contractive:
`Theta* J Theta <= J`. PR: holomorphic with nonnegative real part. `B` denotes `D^P` for finite `P`, or
`D^inf ∩ c_0` (sequences in the open unit disc tending to 0), which is a connected open set of the Banach space `c_0`
and contains `(p^{-z})_p` for `Re z > 0`.

## 1. First lemma: classification

**Lemma R (PROVED).** Let `Theta~ : B -> C^{2x2}` be holomorphic and J-contractive, `Theta(z) = Theta~((p^{-z})_p)`.
Suppose there are `x_n -> +infinity` and numbers `|e_n| <= 1` with `T_{Theta(x_n)}[e_n] -> -1`. (This holds when
`S = T_Theta[S_1]` with `|S_1| <= 1`, because `L(x) ~ (1/2) log x` gives `S(x) -> -1`.) Then there are a constant
J-unitary `V_0` and a holomorphic `H : B -> C` with `Re H >= 0` such that

    Theta~(w) = M(H(w)) V_0     for all w in B,        J - Theta~* J Theta~ = (Re H) V_0* E V_0.

If moreover `Theta~(0)` is J-unitary then `H` is an imaginary constant.

Proof. (1) J-contractivity gives `|Theta_22|^2 >= 1 + |Theta_21|^2`, so `T_Theta` is defined on the closed disc.
Put `Theta_0 = Theta~(0)`; `Theta(x_n) -> Theta_0`. Passing to a subsequence `e_n -> e`, `|e| <= 1`, and
`T_{Theta_0}[e] = -1`. With `y = (e, 1)^T`: `Theta_0 y = d (-1, 1)^T`, `d = Theta_21 e + Theta_22 != 0`. Then
`0 = (Theta_0 y)* J (Theta_0 y) <= y* J y = |e|^2 - 1 <= 0`, so `|e| = 1` and `y* (J - Theta_0* J Theta_0) y = 0`; the
matrix `D_0 = J - Theta_0* J Theta_0` is positive semidefinite, hence `D_0 y = 0`.

(2) Potapov-Ginzburg transform. For `xi = Theta~(w) eta` the map `Sigma(w) : (eta_1, xi_2) -> (xi_1, eta_2)` is a
contraction, holomorphic in `w` (entries are rational in those of `Theta~` with denominator `Theta_22`). Step (1)
gives `Sigma(0) u = v` with `u = (e, d)`, `v = (-d, 1)`, `|u|^2 = |v|^2 = 1 + |d|^2`. The function
`f(w) = <Sigma(w) u, v>/|u|^2` is holomorphic on `B`, `|f| <= 1`, `f(0) = 1`; by the maximum principle (on complex
lines through 0 in the connected set `B`) `f = 1`, so `Sigma(w) u = v` and, since `Sigma(w)` is a contraction,
`Sigma(w)* v = u`, for every `w`.

(3) Back to `Theta~`. `Sigma(w) u = v` reads `Theta~(w) y = d (-1,1)^T`. `Sigma(w)* v = u` reads, for all `eta` and
`xi = Theta~(w) eta`: `-conj(d)(xi_1 + xi_2) = conj(e) eta_1 - eta_2`, i.e. `(1,1) Theta~(w) = l_0`,
`l_0 = -(conj(e)/conj(d)) (1, -e)`, a constant row. So `Delta(w) = Theta~(w) - Theta_0` satisfies `Delta y = 0` and
`(1,1) Delta = 0`, hence `Delta(w) = phi(w) (-1,1)^T (1,-e)` with `phi` holomorphic, `phi(0) = 0`. Since
`N Theta_0 = (-1,1)^T l_0`, this is `Theta~(w) = M(H_1(w)) Theta_0` with `H_1 = -2 conj(d) e phi`.

(4) `D_0 >= 0` kills `y`, and `l_0 y = 0`, so `D_0 = c_0 l_0* l_0` with `c_0 >= 0`. Put `V_0 = M(-c_0) Theta_0`:
`V_0* J V_0 = Theta_0* (J + c_0 E) Theta_0 = Theta_0* J Theta_0 + c_0 l_0* l_0 = J`. With `H = c_0 + H_1`:
`Theta~ = M(H) V_0` and `J - Theta~* J Theta~ = (Re H) V_0* E V_0`, so J-contractivity is `Re H >= 0`. If `c_0 = 0`,
`Re H` is a nonnegative pluriharmonic function vanishing at 0, hence zero. QED.

Remarks.
- Rationality and J-unitarity on the torus are not needed. The lemma holds on any connected complex domain containing
  a point where step (1) applies, and (with the mean value over `t` in place of the maximum principle) for any `Theta`
  that is holomorphic, J-contractive and uniformly almost periodic on `Re z >= eps`. It fails without almost
  periodicity (`exp(-1/(z+1))` is a Schur function tending to 1).
- Converse of the normalisation: a ladder such as `M(H_1) U M(H_2)` with `U` J-unitary not fixing `-1` and
  `Re H_2(0) > 0` has rank-2 defect, and its image disc at `w = 0` does not contain `-1`; then `S_1 = T_{Theta^{-1}}[S]`
  leaves the unit disc for large `x`. This is the only place rank 2 appears, and it is excluded by the gamma growth
  (Section 2, checks (c), (d)).
- c1 Lemma 1 was an identity about the chosen unipotent sections (referee correction 1). Lemma R is the
  classification that was missing.

**Lemma R' (termination-independence; PROVED).** Work on `Re s > 1`, where the Bohr lift of `-zeta'/zeta` is
`U_P(w_P) + V(w_{P^c})`, `U_P = sum_{p in P} log p * w_p/(1 - w_p)`. Let `Theta_P(w_P)` be an invertible matrix
function such that `T_{Theta_P(w_P)^{-1}}[ Cayley(-alpha(U_P(w_P) + V)) ]` does not depend on `w_P` for `V` in an open
set (the termination depends on the remaining primes only). Then `Theta_P(w_P) = c(w_P) M(-alpha U_P(w_P)) K` with a
constant matrix `K` and a scalar `c`. If the termination is allowed to depend on `w_P` through a summand `k(w_P)` of
the impedance, then `Theta_P = c M(-alpha U_P - k) K`.

Proof. `Cayley(-alpha(U_P + V)) = T_{M(-alpha U_P)}[Cayley(-alpha V)]`. So the Moebius maps of
`A(w_P) = Theta_P(w_P)^{-1} M(-alpha U_P(w_P))` agree on an open set for all `w_P`; two Moebius maps that agree on an
open set have proportional matrices. `V` covers an open set because it is a non-constant holomorphic function of one
variable `w_q`, `q` not in `P`. QED.

So in both formulations (Schur termination; termination depending on the other primes) the section acts as a
unipotent block followed by a constant: the defect is rank one and additive.

## 2. Tests run in place of the conditional Pick test (MEASURED)

`t1_rigidity.py`, `t1b_junction.py`:

- (a) 2000 random `M(H) V_0`: identities of Lemma R (kernel vector, fixed right and left vectors, unit singular value
  of the Potapov-Ginzburg transform) hold to `9e-14`.
- (b) 3000 random strict J-contractions: `-1` is never in the image disc; `dist(-1, image)/sqrt(min defect eigenvalue)
  >= 0.044`.
- (c) Ladder `M(0.7+0.3i) diag(e^{i phi},1) M(Re b + 0.2i)`: distance from `-1` to the image disc is `0` (to `2e-16`)
  exactly when `phi = 0` or `Re b = 0`, and `5e-7` to `0.54` otherwise (`phi` in `{0.01, 0.1, 1, 3}`,
  `Re b` in `{0.01, 0.5}`).
- (d) Junction `x -> +infinity` for the ladder `M(Z_2/2) diag(e^{i},1) M(Z_3/2)`: limit
  `|T_{Theta_0^{-1}}[-1]| = 1.2472`; with the gamma part of `L` (the prime part is below `2^{-x}`; the leading term is
  the same for DH and for every control with a gamma factor) `|S_1(x)| = 0.45, 1.04, 1.18, 1.23, 1.24` at
  `x = 10^3, 10^10, 10^30, 10^100, 10^300`. The section fails at `x` near `10^10`, identically for zeta and every
  control. The approach to the limit is logarithmic, so no finite-height sample on `x <= 10^3` shows it
  (`|S_1| < 1` there for zeta and for DH).

Reading: the non-unipotent family has rank-2 defect only where the normalisation fails, and the normalisation
junction is control-blind.

## 3. Positive-real Dirichlet series of Bohr-lift type: three facts

Class `PR(B)`: `h(z) = H((p^{-z})_p)`, `H` holomorphic on `B` with `Re H >= 0`. For non-constant `Re H`:

- (F1) (CLASSICAL: Caratheodory in finitely many variables, then continuity of `H` in the `c_0` norm.)
  `h(z) = sum_m a_m m^{-z}` for `Re z > 1`, `a_1 = H(0)`, `|a_m| <= 2 Re a_1` for `m >= 2`.
- (F2) (PROVED.) `h` is bounded on `Re z >= eps` for every `eps > 0`: the set `{|w_p| <= p^{-eps}}` is compact in `B`
  for the `c_0` norm and `H` is continuous.
- (F3) (CLASSICAL: Schwarz-Pick along the disc `zeta -> zeta w/rho`, `rho = sup_p |w_p|`.) For `w in B`,
  `H(w)` lies in the closed disc `i Im H(0) + Re H(0) * D(c_rho, R_rho)`, `c_rho = (1+rho^2)/(1-rho^2)`,
  `R_rho = 2 rho/(1-rho^2)`. For `rho = 2^{-1/2}`: centre 3, radius `2 sqrt 2`.

## 4. Theorem A': first moment over the poles with exponential weights

**Theorem A' (PROVED).** Let `h in PR(B)` and suppose the boundary measure of `Re h` on `Re z = 0` is
`pi sum_j r_j delta_{gamma_j}`, locally finite, `r_j > 0` (so `h` is meromorphic in the plane with simple poles
`i gamma_j`, residues `r_j`, and `h(z) = -h*(-z)` where `h*(w) = conj(h(conj w)) = sum conj(a_m) m^{-w}`). Let
`t_0 > 0` not be a pole height. Then for `0 < delta <= 1` and every `eps > 0`

    sum_{gamma_j > t_0} r_j zeta(1/2 + i gamma_j) e^{-delta gamma_j}
        = (a_1 + conj(h(1/2))) / (2 pi delta) + O_{h, eps}(delta^{-1/2-eps}),

and `Re(a_1 + conj h(1/2)) >= (4 - 2 sqrt 2) Re a_1 = 1.1716 Re a_1`.

Proof. (0) Set-up. The masses satisfy `mu([T, T+1]) <= 2 pi sup_t Re h(1 + it) < infinity` (Poisson kernel and F2), so
the left side converges, and for each `n` there is `T_n in [n, n+1]` with `int_{-2}^{2} |h(x + i T_n)| dx <= C`
(near poles contribute integrable `1/|x + i tau|`, far poles change `h` by a bounded amount between `x` and `1`).
Apply the residue theorem to `zeta(1/2 + z) h(z) e^{i delta z}` on `[-c, c] x [t_0, T_n]`, `0 < c < 1/2`, and let
`n -> infinity`: the top side tends to 0 (`|e^{i delta z}| = e^{-delta t}`, zeta of polynomial growth), the bottom side
is `O(1)` uniformly in `delta`. Hence the left side equals `R - Lf + O(1)`,

    R = (1/2 pi i) int_{c + i t_0}^{c + i inf} zeta(1/2+z) h(z) e^{i delta z} dz,
    Lf = (1/2 pi i) int_{-c + i t_0}^{-c + i inf} zeta(1/2+z) h(z) e^{i delta z} dz.

(1) Right side. Move the line to `Re z = 2` (no poles for `t >= t_0`; horizontal segment `O(1)`). There
`zeta(5/2 + it) h(2 + it) = sum_k d_k k^{-it}`, `sum |d_k| < infinity` by F1, `d_1 = a_1`. So
`R = (e^{2 i delta}/2 pi) sum_k d_k e^{-(delta + i log k) t_0}/(delta + i log k) + O(1) = a_1/(2 pi delta) + O(1)`.

(2) Left side. `-h(z) = h*(-z)`, holomorphic in `Re z < 0`. Move the line to `Re z = -2` (horizontal segment `O(1)`):
`-Lf = (e^{-2 i delta}/2 pi) int_{t_0}^{inf} zeta(-3/2 + it) h*(2 - it) e^{-delta t} dt + O(1)`. Insert
`zeta(s) = chi(s) zeta(1 - s)`, `chi(s) = 2^s pi^{s-1} sin(pi s/2) Gamma(1 - s)`, and
`zeta(5/2 - it) h*(2 - it) = sum_k e_k k^{it}`, `e_k = sum_{nm = k} n^{-5/2} conj(a_m) m^{-2}`, `sum |e_k| < infinity`.
So `-Lf = e^{-2 i delta} sum_k e_k J_k + O(1)`, `J_k = (1/2 pi) int_{t_0}^{inf} chi(-3/2 + it) k^{it} e^{-delta t} dt`.

(3) Exact evaluation of `J_k`. Write `sin(pi s/2) = (i/2)(e^{-i pi s/2} - e^{i pi s/2})` and
`chi_+(s) = (i/2 pi)(2 pi)^s e^{-i pi s/2} Gamma(1 - s)`. On `Re s = -3/2`: `|chi - chi_+| << (1+|t|)^2 e^{-pi t}` for
`t >= 0`, and `|chi_+(s)| e^{-delta t} << (1+|t|)^2 e^{-(pi - delta)|t|}` for `t <= 0`. So, uniformly in `k`,
`J_k = (1/2 pi) int_R chi_+(-3/2 + it) k^{it} e^{-delta t} dt + O(1)`. With `u = 1 - s`,
`k^{it} e^{-delta t} = k^{3/2} e^{3 i delta/2} (k e^{i delta})^{s}`, and the Mellin-Barnes integral
`(1/2 pi i) int_{(5/2)} Gamma(u) Y^{-u} du = e^{-Y}` at `Y = 2 pi k e^{-i(pi/2 - delta)}` (`Re Y = 2 pi k sin delta > 0`):

    (1/2 pi) int_R chi_+(-3/2 + it) k^{it} e^{-delta t} dt = k^{5/2} e^{5 i delta/2} exp(-2 pi k sin delta + 2 pi i k cos delta)
                                                         = k^{5/2} e^{5 i delta/2} exp(-2 pi k eta),

`eta = i(1 - e^{i delta}) = 2 sin(delta/2) e^{i delta/2}`. The last equality uses `e^{2 pi i k} = 1`: `k` is an
integer. (MEASURED, `t2_abel.py` part (i): the full-line identity holds to `6e-16` for `k = 1, 2, 3, 6`,
`delta = 0.3, 0.15`; `|J_k - formula| = 0.002` to `0.0045` with `t_0 = 1`.)

(4) Sum. `e_k k^{5/2} = sum_{nm = k} conj(a_m) m^{1/2}`, so
`-Lf = e^{i delta/2} sum_{n, m >= 1} conj(a_m) m^{1/2} e^{-2 pi n m eta} + O(1)`. By Mellin inversion
(`|arg eta| = delta/2`), the double sum is `(1/2 pi i) int_{(3)} Gamma(w) (2 pi eta)^{-w} zeta(w) h*(w - 1/2) dw`,
absolutely convergent by F1. Move to `Re w = 1/2 + eps`: `h*(w - 1/2)` is bounded there by F2, `zeta` has polynomial
growth, `Gamma` decays like `e^{-pi |Im w|/2}` against `e^{delta |Im w|/2}`. The only pole is `w = 1`, residue
`h*(1/2)/(2 pi eta)`. So `-Lf = conj(h(1/2))/(2 pi delta) + O(delta^{-1/2-eps})`.

(5) Sign. `Re a_1 = Re H(0) > 0`, and by F3 at `w = (p^{-1/2})_p`, `rho = 2^{-1/2}`:
`Re h(1/2) >= (3 - 2 sqrt 2) Re a_1`. QED.

Comparison with c1 Theorem A. Same main term (`T` replaced by the Abel weight: `int e^{-delta T} dT/2 pi`). The
method differs at the step that was owed a pass: c1 used the approximate formula of length `X = CT` at
`sigma = 1/2 - c` and a diagonal/off-diagonal split that needs `sum_m |a_m| m^{-c} < infinity` (finite `P`); here the
functional equation is used exactly and the only input on `h` is boundedness on `Re z >= eps`. The diagonal term of
c1 is the residue at `w = 1` in step (4).

MEASURED (`t2_abel.py`; `t_0 = 1`; the table gives `2 pi delta * sum` against the prediction).

| Example | `delta` | poles | `2 pi delta * sum` | predicted `a_1 + conj h(1/2)` |
|---|---|---|---|---|
| two delays, non-separable: `H = (1 + e^{i} b)/(1 - e^{i} b)`, `b = (2 w_1 w_2 - w_1 - w_2)/(2 - w_1 - w_2)`, `w = (2^{-z}, 3^{-z})` | 0.02 | 1784 | 1.2464 + 0.4943i | 1.2681 + 0.5157i |
| same | 0.01 | 1784 | 1.2742 + 0.5139i | same |
| same | 0.005 | 1784 | 1.2629 + 0.5267i | same |
| separable, `P = {2,3,7,11}`, `h = sum_p (1+p^{-z})/(1-p^{-z})` | 0.04 | 1560 | 10.302 + 0.159i | 17.639; with the `delta^{-1/2}` term: 9.12 |
| same | 0.02 | 1560 | 12.222 + 0.092i | 17.639; with the `delta^{-1/2}` term: 11.61 |
| separable, 25 primes `p <= 100`, `h = sum_p (1/p)(1+p^{-z})/(1-p^{-z})` | 0.02 | 85273 | 5.409 + 0.035i | 7.761; with the `delta^{-1/2}` term: 5.152 |
| same | 0.01 | 85273 | 6.041 + 0.020i | 7.761; with the `delta^{-1/2}` term: 5.916 |
| same | 0.005 | 85273 | 6.519 + 0.010i | 7.761; with the `delta^{-1/2}` term: 6.457 |

In the separable examples `h` has a pole at `z = 0`, so step (4) has a second pole at `w = 1/2` with residue
`Gamma(1/2) (2 pi eta)^{-1/2} zeta(1/2) Res_{z=0} h`; it accounts for the gap between columns 4 and 5 (the remaining
difference, 0.257, 0.125, 0.062 in the 25-prime example, halves with `delta`). The error term `delta^{-1/2-eps}` of the theorem is therefore attained.

**Theorem B' (PROVED, unconditional).** Let `h in PR(B)` (any prime set). If `alpha L - h` is PR on `Re z > 0` for
some `alpha > 0`, then `h` is an imaginary constant.

Proof. `alpha L = (alpha L - h) + h` is PR, so its Herglotz measure is `alpha pi sum m_gamma delta_gamma` over the
zeros of `F` on the axis, and `0 <= mu_h <= mu_{alpha L}`. `h` has no linear term (F2). So `h` satisfies the
hypothesis of Theorem A' with every pole at a zero of `zeta(1/2 + z)`, and no pole has `0 < gamma <= 14`. With
`t_0 = 1` the left side of Theorem A' is 0 for every `delta`; hence `a_1 + conj h(1/2) = 0`, so `Re a_1 = 0` (step
(5)), and `Re H` is a nonnegative pluriharmonic function vanishing at 0. QED.

**Theorem C (closure of the family; PROVED, unconditional).** Let `Theta~ : B -> C^{2x2}` be holomorphic and
J-contractive (`P` finite or infinite), `Theta(z) = Theta~((p^{-z})_p)`. If `S = T_Theta[S_1]` on `Re z > 0` with
`|S_1| <= 1`, then `Theta~` is a constant J-unitary matrix.

Proof. Lemma R: `Theta~ = M(H) V_0`. Then `S = T_{M(h)}[S_1']`, `S_1' = T_{V_0}[S_1]` Schur and not identically `-1`,
so `alpha L = h + Z_1'` with `Z_1' = (1 - S_1')/(1 + S_1')` PR. Theorem B': `h` is an imaginary constant `ic`; the
Dirichlet coefficients of `H` vanish for `m >= 2`, so `H = ic` and `Theta~ = M(ic) V_0`. QED.

The same holds in the `s`-delay picture (sections J-contractive in `w_p = p^{-s}` on the larger polydisc, lossless
axis `Re s = 0`): `h(z) = H((p^{-1/2} p^{-z})_p)` is again in `PR(B)`. As in c1, the hypothesis of B' and C implies
RH, so these theorems remove a mechanism and give no information about zeros.

## 5. DH analogue (assignment item (c))

Let `f = c_1 L(s, chi) + c_2 L(s, conj chi)`, `chi` mod 5 with `chi(2) = i`, `c_1 = (1 - i kappa)/2`,
`c_2 = (1 + i kappa)/2`, `kappa = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1) = 0.28408`, coefficients
`f_m = c_1 chi(m) + c_2 conj chi(m)`.

DH moment formula (OUTLINE; c1 Section 4 for finite `P`, measured by the c1 referee on three delays). With `f` in
place of zeta the main term is `(a_1 + sum_m f_m conj(a_m) m^{-1/2})/(2 pi delta)`, and
`sum_m f_m conj(a_m) m^{-1/2} = c_1 conj H(w') + c_2 conj H(w'')`, `w'_p = conj(chi(p)) p^{-1/2}`,
`w''_p = chi(p) p^{-1/2}`. In the method of Section 4 the factor `5^{1/2-s}` turns step (3) into
`exp(2 pi i k/5) exp(-2 pi k eta/5)`, the pole at `w = 1` comes from the additive twist
`sum_n f_n e(nm/5) n^{-w}` with residue `(c_1 conj chi(m) tau(chi) + c_2 chi(m) tau(conj chi))/5`, and the
Gauss sums recombine to `f_m` exactly because `f` satisfies its functional equation. This was not written line by
line. MEASURED (`t2_abel.py dh`, `P = {2,3,7,11}`, separable `h`): `2 pi delta * sum` = 6.941 + 0.680i, 7.190 + 0.453i at
`delta = 0.04, 0.02` against 7.656 (the gap has the size of the `delta^{-1/2}` term, as for zeta in the same example).

**Proposition E (PROVED given the formula).** For every prime set (finite or infinite) and every `h in PR(B)`,

    Re( a_1 + c_1 conj H(w') + c_2 conj H(w'') ) >= (4 - 2 sqrt 2 sqrt(1 + kappa^2)) Re a_1 = 1.0597 Re a_1 > 0.

Proof. Normalise `H(0) = 1` (an imaginary constant cancels because `c_1 + c_2 = 1`). The bracket is
`1 + (1/2) Re[(1 + i kappa) H(w')] + (1/2) Re[(1 - i kappa) H(w'')]`. By F3, `H(w')` and `H(w'')` lie in the disc of
centre 3 and radius `2 sqrt 2`, so each real part is at least `3 - 2 sqrt 2 sqrt(1 + kappa^2) = 0.0597`. QED.

Consequences.
- The DH analogue of Theorem A holds: the poles of a non-constant `h in PR(B)` are not all critical-line zeros of
  DH. (The analogue of Theorem B' is vacuous: its hypothesis is false for DH, which has zeros off the line.)
- The same bound gives positivity for every combination with `kappa < 1`. The first-moment no-go does not use
  multiplicativity of the coefficients; c1's reading "multiplicativity enters at the point evaluation" is replaced
  by: boundedness of the coefficient pairing by Schwarz-Pick suffices.
- MEASURED (`t3_dh_bracket.py`): in the Koranyi-Pukanszky representation the bracket is `int I d nu` with integrand
  `I(theta) = 1 + (1/2)(P' + P'') - kappa Im(C' - C'')`. Its minimum over the torus equals
  `1 - kappa^2/pi_P`, `pi_P = prod_{p in P}(1 - 1/p)`, to 10 digits for `|P| = 5, 10, 20, 50, 100, 167` (values
  0.663, 0.578, 0.488, 0.365, 0.271, 0.203), and would be negative for `pi_P < kappa^2 = 0.0807` (all primes to about
  6000). This does not contradict Proposition E: a point mass on the torus is not the measure of a PR function in
  two or more variables. The pointwise bound is the wrong tool; Schwarz-Pick is uniform in `P`.

## 6. Infinite `P`: topology of convergence and the limit (assignment item (b))

**Proposition L.**

(L1) (CLASSICAL.) At radius `p^{-sigma}` the Bohr lift of the sharp section sum `U_Q = sum_{p <= Q} u_p` converges in
`L^2` of the Bohr torus iff `sigma > 1/2`, with
`||U - U_Q||^2 = sum_{p > Q} log^2 p/(2 (p^{2 sigma} - 1))`, and Haar-almost everywhere (independent mean-zero terms
with summable variances; Helson: for almost every completely multiplicative unimodular twist the limit is
holomorphic in `sigma > 1/2`). This is the topology in which the chain of row Q10 converges.

(L2) (CLASSICAL, c1 Proposition 3.) The orbit point of zeta is in the exceptional null set: for `1/2 <= sigma < 1` the
sharp sections diverge like `Q^{1-s}/(1-s)`.

(L3) (PROVED.) For `1/2 < sigma <= 1` the essential supremum over the torus of `Re U` is `+infinity`: for every `M`
there is `Q` with `Re U_Q > M + 1` on a set of positive measure (near the maximiser `theta = 0`,
`D_sigma(Q) -> infinity`), the tail `U - U_Q` is independent of it and has `Re > -1` with positive probability. So
J-contractivity against any fixed reserve fails on a set of positive Haar measure: it is not preserved under the
convergence of (L1). Along one orbit, with the growing reserve `(1/2) log(t/2 pi)`, contractivity is the
largest-value statement of rows Q13 / S4.

(L4) (PROVED from c1 Proposition D(a),(b), both confirmed by its referee.) Let `Phi_Q` be the tapered sections,
`Phi_Q(s) = sum_rho k_lam(s - rho)`, and `1/2 <= theta < 1`. The following are equivalent: (i) zeta has no zeros with
`Re s > theta`; (ii) every `Phi_Q` is PR on `Re s > theta`; (iii) the family `{Phi_Q}` is locally bounded on
`Re s > theta`; (iv) `Phi_Q` converges locally uniformly on `Re s > theta`.
Proof. (i) to (ii): `Re k_lam(a) >= 0` for `Re a >= 0`. (ii) to (iii): a family of PR functions converging at one
point is locally bounded (Harnack). (iii) to (iv): Vitali, with convergence to `L` on `Re s > 1`. (iv) to (i): the
limit is holomorphic and equals `L` on `Re s > 1`, so `L` has no pole in `Re s > theta`. QED.

Answer to (b). Two topologies are available on `1/2 < sigma < 1`. In the torus topology (L1) the sections converge
but J-contractivity is not closed and the zeta orbit is excluded. In the half-plane topology (locally uniform) the
property is closed, and convergence of the tapered sections is equivalent, for each `theta`, to local boundedness and
to zero-freeness in `Re s > theta` (L4). No limit theorem was found in which J-innerness passes to the limit without
a boundedness statement equal to zero-freeness. R4 is not obtained.

## 7. Controls

| Control | Lemma R / R' (classification) | Theorem A', B', C (first moment and closure) | Proposition L |
|---|---|---|---|
| DH | Lemma R holds verbatim (uses `S(x) -> -1` only; MEASURED junction identical, Section 2(d)). R' not formulable (no chain; parallel junction of `g-passive-cascade`). | A' holds with bracket `>= 1.0597 Re a_1` (Proposition E; formula OUTLINE + MEASURED). The no-go does not fail for DH. | (L4) identity holds with DH zeros; (i) is false, so (iii), (iv) fail. Fails at the conclusion. |
| Backward heat | Not formulable (no Dirichlet series in delays). Not run. | Not formulable. | Not formulable. |
| Sign twist (Liouville, TW+-) | Lemma R: no gamma section to pair with; holds if the same `G` is used. R' holds verbatim (torus translation). | Step (2)-(3) unavailable: no functional equation. Void. | (L1) holds verbatim (translation of the torus); a.e. twist converges. Passes where zeta's orbit does not. |
| Unimodular twist | As sign twist. A Dirichlet character with its own gamma term: Lemma R holds. | For `L(s, chi)`: holds with point evaluation at `conj(chi(p)) p^{-1/2}`, sign by F3. | As sign twist. |
| `zeta(s+a) zeta(s-a)` | Lemma R holds. | Step (4) has `zeta(w+a) zeta(w-a) h*(w - 1/2)`; leading pole `w = 1 + a`, residue proportional to `zeta(1+2a) conj h(1/2 - a)`, real part positive for `a < 1/2`. The no-go holds (inference from step (4), not written out). Hypothesis of B' is false (zeros off the line). | (L4) with threshold `1/2 + a`. |
| T-NR | Lemma R holds (gamma factor). Inference, not run. | Pairing point leaves the closed polydisc at the bad prime; F3 unavailable. Inference. | Not run. |
| Beurling | Lemma R holds in its almost-periodic form. | Step (3) uses `e^{2 pi i k} = 1` (integer frequencies) and the functional equation: unavailable. | (L1) analogue holds. Not run. |
| Phase-rotated transfer operator, `theta^w` | Not formulable in chain variables. Not run. | Not formulable. | Not formulable. |

Summary. Lemma R is control-blind (gamma growth). The first-moment no-go holds for zeta, Dirichlet L-functions, DH
and `E_a`. No statement here fails for every control at a named structural step.

## 8. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (all primes, multiplicativity essential) | false | Theorems A', B', C hold for all prime sets, but multiplicativity is not used: zeta enters through its functional equation and coefficients `1`; Proposition E shows the same sign for DH. The assignment's R1 criterion (joint property false for a non-multiplicative chain) is not met. |
| R2 (height-uniform, every window) | false | The proved statements are no-go statements about the whole half-plane; no inequality for zeta in every window is established. |
| R3 (every control fails at a named structural step) | false | Section 7: Lemma R holds for every control with a gamma factor; the first-moment no-go holds for DH and `E_a`. |
| R4 (reaches the critical line) | false | Proposition L: convergence on `1/2 < sigma < 1` either excludes the orbit and does not preserve contractivity (torus topology), or is equivalent to zero-freeness (half-plane topology). |

## 9. Three weakest steps

1. **Theorem A' is new here and unreviewed.** Points a referee should redo: the uniformity in `k` of the `O(1)`
   terms in step (3) (checked numerically for four `k` only); the Mellin shift in step (4), which needs `h*` bounded
   on `Re >= eps` (F2 rests on compactness in `c_0` and on continuity of a holomorphic function on `D^inf ∩ c_0`, i.e.
   on the Hilbert-Bohr correspondence for `H^infinity`); the horizontal segments in step (0). Numerical agreement is 1 to
   3 percent on one non-separable example and on separable examples after the `delta^{-1/2}` term; these are
   finite-`P` examples, so the infinite-`P` case rests on the proof alone.
2. **DH moment formula.** Proposition E is proved given the main term `a_1 + sum f_m conj(a_m) m^{-1/2}`; that main
   term is derived in outline (conductor-5 version of steps (3)-(4)) and measured to about 6 percent at
   `delta = 0.02` on four primes. For infinite `P` the convergence of `sum_m f_m conj(a_m) m^{-1/2}` to the two point
   evaluations of `H` uses uniform convergence of bounded Dirichlet series (Bohr) and was not written out.
3. **Scope of "closed".** Sections are holomorphic on the full polydisc (ordinary Dirichlet series with frequencies
   `log m`) and the termination is Schur (Lemma R), or depends on the other primes only (Lemma R'). Not covered:
   sections holomorphic only on a Reinhardt shell around the tori (frequencies `log(m/n)`; Lemma R still holds,
   Theorem A' was not derived); sections that include the gamma term or other non-almost-periodic factors (no
   normalisation at `x = +infinity`); J-expansive (negated lossless) sections, for which the stage statement
   "`L + U_P` is PR on `Re s > 1/2` for every finite `P`" is equivalent to RH by removal of Euler factors and carries
   no constraint. Theorems B' and C are vacuous unless RH holds.
