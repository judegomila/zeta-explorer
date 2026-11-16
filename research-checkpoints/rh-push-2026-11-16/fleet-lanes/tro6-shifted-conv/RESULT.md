# tro6-shifted-conv: shifted-convolution / delta-method treatment of TRO6^natural

2026-11-16. Scope: `tmp/research-2026-11-16/push/tro6-shifted-conv/` only. Nothing committed or pushed.

**Verdict: precise obstruction. No eta > 0 is proved. NO QED.** The method's exponent is eta = 0 at best (it
reproduces Cauchy-Schwarz on every branch) and eta = -8 in its literal shifted-convolution form. Theta = 7/8 and
Lambda bounds are unchanged.

Labels: PROVED (complete here, elementary) / PROVED-rel X (relative to a named statement of the 7/8 manuscript,
unrefereed) / CLASSICAL / MEASURED / HEURISTIC / OPEN.

Sources read: BRIEF.md; `sextic-theta-synthesis.md`, `sextic-theta-conjecture.md`, `sextic-theta-proof.md`
(sections 1, 2, 6, 7, 8), `sextic-theta-literature.md` section 7; manuscript `~/lean-deps/qrh-verify/paper.txt`
Prop 5.1, (5.26), section 5.5, section 6.1, Lemma 9.1, Cor 14.1 and the paragraph after it, section 15.1.
Not re-read in full for this note: the atlas and the rh-attempts syntheses (this angle is confined to TRO6 and
does not propose an RH route).

## 1. Plan and what is new

The earlier notes show: TRO6^nat is the improved low bound (Theorem D), mean values and large sieves that are
uniform in the coefficient vector cannot beat Cauchy-Schwarz (proof note 7.2), and "use the arithmetic of rho"
was left as an informal claim (REF-CORR in 7.2). This note does the missing bookkeeping for one concrete way of
using that arithmetic: the delta-method / shifted-convolution / circle-method family. New here:

1. An exponent ledger (section 3) for each variant, in units of the TRO6 exponent eta (saving Z^{-eta/96}).
2. Lemma N (section 2): the bilinear form contains no additive shift. The couplings are residue symbols with
   modulus at least as long as the variable they act on, so the congruence that a delta method would detect has
   only the diagonal solution.
3. The reflected shape of the theta-row form as a trilinear form with pairwise multiplicative couplings
   (section 2.2), which locates where the target enters.
4. A small measurement of the reflected row coefficient (section 5).

## 2. Structure of the form

Geometry (conjecture note section 1): for a rescaled subset with slot length d in [0, 1/6],
Q = Z^{5/6-2d} (rows m), completed index A = c n^3 at scale R = Z^{7/6-d} (log-Gaussian weight),
sum_m |rho^nat(-e0 m)|^2 << Q^{5/6} (Theorem A (MS)), sum_m |B^J_m|^2 << Q (Lemma 15.1).
Cauchy-Schwarz: |B-form| << Q^{11/12}; at d = 0 this is Z^{55/72}. TRO6(eta) asks for Z^{-eta/96} more.
Needed: eta >= 0.0107 (certified margin) or 0.0219 (fixed-geometry cap); eta = 1 is full removal.

### 2.1 Unreflected orientation

B-form = sum_A b(A) T(A), T(A) = sum_m w(m) rho^nat(-e0 m) chi_A(m), with b(A) the target-dependent row
coefficient (gamma_2(c) alpha nu G, weight N(c)^{-1/2}), ||b||_2^2 ~ 1 up to logs.

### 2.2 Reflected orientation [PROVED-rel Prop 5.1 / Cor 14.1; written here only for rows whose residual part is squarefree]

Cor 14.1 and the paragraph after it give, per branch (finitely many sectors; a subset P of the marked slot primes
"active", of norm Z^a, 0 <= a <= 1/6 - d):

  B-form = sum_m Phi(m) sum_P tau(P) N(P)^{-1/2} sum_mu delta(mu) (mu/m)_2 conj(chi_P(mu))^2 V#(N(mu) Z^{7/6-d} / (N(m) N(P))^2),

* Phi(m) = w(m) rho^nat(-e0 m) zeta_m, where zeta_m is the unimodular scalar (5.3)/(14.4): a product over p | m of
  tau^-_{p,1} tau^+_{p,3} chi_p(.) and a class function of m modulo a fixed modulus;
* delta(mu) = d(mu) alpha(mu) theta(lambda^4 mu) N(mu)^{-1/2}, d a cubic-theta cusp coefficient, target-independent;
* tau(P) is the tuple coefficient: it carries the target values eta(p_i) at the marked primes and one-prime
  Gauss phases; |tau| <= 1;
* dual length D_a = Q^2 Z^{2a} / R = Z^{1/2 - 3d + 2a}. At a = 0: Z^{1/2-3d}. At a = 1/6 - d: Z^{5/6-5d}.
* Couplings: (m, mu) quadratic symbol; (P, mu) cubic symbol; (m, P) none (pair factor (q/p)_3^3 = 1, manuscript
  after (14.5)).

So the target enters only through tau(P) (values at marked primes) and fixed-modulus class functions.

### 2.3 Lemma N (no additive shift) [PROVED, elementary]

(i) Unreflected. Expand chi_A(m) in additive characters modulo A. Opening |T(A)|^2 or any delta-symbol
detection produces the congruence m1 = m2 mod A with N(m_i) <= CQ. If N(A) > 4CQ then m1 = m2. The weight of
indices with N(A) <= 4CQ is that of a log-Gaussian at log r <= -(1/3 + d) log Z + O(1), i.e. O(exp(-c log^2 Z)).
So every shifted sum sum_m rho(m) conj(rho(m + hA)), h != 0, is empty up to a superpolynomially small weight.

(ii) Reflected. The symbol (mu/m)_2 is a character of mu modulo m (up to fixed moduli), with N(mu) <~ D_a and
N(m) ~ Q, and D_a <= Q with equality only at (a, d) = (1/6, 0). So mu1 = mu2 mod m forces mu1 = mu2 except for
O(1) shifts at that single corner. Read the other way (a character of m modulo mu), there is one character per
modulus mu, not the full dual group; shifts m1 = m2 + h mu appear only after embedding into all characters
modulo mu (variant SC below).

Consequence: TRO6 contains no shifted-convolution problem. A delta method can only be used as a
conductor-lowering device on the single twisted sums T(A) or U(mu) := sum_m Phi(m) (mu/m)_2 (smooth weights
separated), and that needs a Voronoi formula for the coefficient being twisted.

## 3. Exponent ledger

All at general (a, d); "eta" is quoted at (a, d) = (0, 0) unless stated. Baseline C-S exponent: Q^{1/2} ||rho||.

| variant | bound for the form / ||rho||_2 | eta | status |
|---|---|---|---|
| CS: Cauchy-Schwarz in m | Q^{1/2} = Z^{5/12-d} | 0 | PROVED-rel Lemma 15.1, Thm A |
| U1: unreflected, C-S in A, sextic large sieve (9.1) | (R + Q + (RQ)^{2/3})^{1/2} = Z^{2/3-d} | -24 (all d) | PROVED-rel Lemma 9.1 (squarefree part of A) |
| U2: unreflected, C-S in A, optimal large sieve R + Q | R^{1/2} = Z^{7/12-d/2} | -16 - 48d | OPEN input; still negative |
| U3: unreflected, additive expansion mod A (Lemma N(i): diagonal only), additive large sieve Q + R^2 | R = Z^{7/6-d} | -72 | CLASSICAL (planar additive large sieve, manuscript Lemma 6.1) |
| R1: reflected, C-S in mu (and cubic large sieve in P), quadratic large sieve (5.26) Q + D_a | (Q + D_a)^{1/2} = Q^{1/2} | 0 exactly | PROVED-rel (5.26), Heath-Brown cubic sieve; this is the proof of Lemma 15.1 read with Phi kept |
| SC: reflected, embed (mu/.)_2 into all characters mod mu, open the square into shifted sums sum_m Phi(m) conj(Phi(m + h mu)) | (Q + D_a^2)^{1/2} | -8 at (0,0); 0 iff a <= d - 1/24 | CLASSICAL upper bound (multiplicative large sieve); the D_a^2 term is the h = 0 diagonal of the enlarged family and no shifted-sum estimate removes it |
| R2: R1 plus square-root cancellation in every U(mu) (hypothesis) | D_a^{1/2} | +16 + 48d at a = 0; 0 at (a, d) = (1/6, 0) | OPEN hypothesis; no known tool |
| full randomness | 1 | +40 | HEURISTIC ceiling |

Arithmetic: Z^{-eta/96} = (bound)/(Q^{1/2}); e.g. SC at (0,0): D^2 = Z vs Q = Z^{5/6}, loss Z^{1/12} = Z^{8/96}.
U1: (RQ)^{2/3} = Z^{4/3-2d} >= R for all d <= 1/6; loss Z^{(4/3-2d)/2 - (5/6-2d)/2} = Z^{1/4}.

**Saturation [PROVED, elementary].** R1 cannot be improved by any estimate that holds for all Phi of given l2
norm: Phi = w * (mu0/.)_2 gives |U(mu0)|^2 >> Q ||Phi||^2. So eta = 0 is the exact exponent of every variant that
uses only norms of Phi (mean square / Rankin-Selberg size, individual bounds). Individual (sup) bounds for rho
can only replace l2 by a weaker l-infinity x l1 pairing.

**The gap to eta > 0.** At a = 0, eta > 0 follows from

  (PS-U)  sum_{N(mu) <= D} |U(mu)|^2 << Q^{1-delta} ||Phi||^2,  D = Z^{1/2-3d},  eta = 40 delta at d = 0,

i.e. delta >= 2.7e-4 for the certified margin. This is a statement that Phi(m) = rho^nat(-e0 m) zeta_m is not
aligned, in mean square, with quadratic characters of conductor <= Z^{1/2}. It is OPEN. (PS-U) => TRO6 on the
a = 0 branches is a SKETCH (squarefree residual rows only). On the fully active branch (a, d) = (1/6, 0) the
two large-sieve terms balance (D = Q) and even R2 gives eta = 0: there a gain can only come from the P-sum, i.e.
from sums over primes of eta(p) x cubic Gauss phase x cubic symbol chi_p(mu)^{-2} with N(mu) up to Z^{5/6} and
p in a short slot. That is the Dunn-Radziwill / Heath-Brown-Patterson prime-sum problem with a long index, and
it is the place where the target's zeros enter (consistent with proof note 7.5 and Theorem D).

## 4. Why the delta method has nothing to hold

* T(A) (unreflected): rho^nat is a Fourier coefficient of the sextic theta function, so a Voronoi formula with
  conductor N(A)^2 is available in principle [HEURISTIC: not written in the literature; literature note G3].
  Length Q = Z^{5/6-2d} against square-root conductor R = Z^{7/6-d}: the dual sum has length R^2/Q = Z^{3/2}, longer.
  Individual convexity gives T(A) << R^{1+eps} against the trivial Q^{11/12}: no gain. Averaging over A is U1-U3.
* U(mu) (reflected): length Q, conductor N(mu) <= Z^{1/2}; this is the favourable range. But
  Phi(m) = rho^nat(-e0 m) zeta_m and zeta_m is a product of sextic and quadratic Gauss sums of modulus m itself.
  A Voronoi formula for rho alone does not transform Phi; no automorphic object with coefficients Phi is known.
  If a Patterson law rho_6 ~ conj(Gauss sum) held, Phi would be mu(m) x class function (by gamma_1 gamma_2 = mu alpha G),
  and U(mu) would be a Mobius sum twisted by a quadratic character: its size is the zero-free region for the
  family. The measured absence of such a law (computation note 6.1) removes even this reduction.
* Circle method: there is no additive equation in the form (Lemma N). The only additive structure is the Gauss
  sum inside rho (modulus s) and inside zeta_m (modulus m); executing the m-sum against them by Poisson is the
  manuscript's high side (7.1), where the principal row carries 1/L.

## 5. Measurement [MEASURED, small scale]

`refl_twist.py` (log `refl_twist.log`, 228 primary squarefree rows prime to 6 with N(m) <= 796, stripped
coefficient rho-hat from `tmp/sextic/conj_rows_800.npz`, 12 classes, 45 twists: mu = 1 and the 44 primary primes
of norm <= 200). Statistic r = |sum_m rho-hat(-e0 m) z(m) (mu/m)_2| / ||rho-hat z||_2; random phases give r ~ 1,
full coherence gives 15.1.

| z(m) | mean r^2 | max r |
|---|---|---|
| 1 | 1.78 | 7.36 |
| gamma_1, conj gamma_1 | 0.90, 1.04 | 2.55, 2.37 |
| gamma_2, conj gamma_2 | 1.11, 0.93 | 2.38, 2.61 |
| gamma_3, conj gamma_3 | 1.07, 1.11 | 3.88, 4.24 |
| gamma_1 gamma_3 (shape of zeta_m), conj(gamma_1) gamma_3, gamma_1 conj(gamma_3) | 0.87, 1.23, 1.03 | 2.42, 2.55, 2.51 |
| gamma_1 gamma_2 (= mu alpha G), gamma_2 gamma_3 | 1.09, 1.19 | 3.20, 2.59 |

Null (random phases, max over 540 statistics): median 2.38, 99% 3.11.
Reading: with the Gauss-sum shape of zeta_m the twisted sums are at the random level (square-root size) at this
scale. The excess for z = 1 is the known coherent row first moment (conjecture note 4.4); the excess for
z = gamma_3 is the same effect, since gamma_3 is a class function times a sign pattern [HEURISTIC reading].
Limits: proxy zeta (cross-prime phases of (5.3) not reproduced), stripped rho instead of rho^nat, 228 rows, signal
share 0.745. No exponent can be read from this.

## 6. DH control

Every bound in the ledger is linear in the row coefficient b (or tau) and uses no multiplicativity of the target.
It therefore holds unchanged for a Davenport-Heilbronn-type combination of two targets. That is consistent with
the wall because the ledger proves no saving. The Euler product is used only downstream, in manuscript Prop 2.1
(the probe's signal is 1/L(s, eta), which needs multiplicativity of eta and the identity gamma_1 gamma_2 = mu alpha G).
In the reflected form the multiplicative input sits in tau(P) = product of eta(p_i) over marked primes. Any proof
of eta > 0 must use that factor (fully active branch) or (PS-U); a target-blind bound is capped at eta = 0 by the
saturation statement.

## 7. Verdict

* TRO6^nat is not proved for any eta > 0.
* Exact exponent of the shifted-convolution / delta / circle method with known inputs: eta = -8 in the literal
  shifted-sum form (SC) at (a, d) = (0, 0); eta = 0 (Cauchy-Schwarz reproduced, never beaten) for the best
  arrangement R1. Unreflected arrangements give eta = -24 (proved sieve), -16 (optimal sieve), -72 (additive).
* Gap: any delta > 0 in (PS-U) on the a = 0 branches, plus prime-variable cancellation on the active branches.
  Neither follows from mean-square, Rankin-Selberg or individual bounds (saturation, PROVED).
* The angle is closed. No pivot is taken: the only adjacent statement, (PS-U), is another sibling's territory
  (tro6-sieve / tro6-numerics) and has no proof route found here.

## 8. Three weakest steps

1. Section 2.2 is read off Cor 14.1 for rows with squarefree residual part; powerful and S-supported row parts,
   the frozen j = 4 primes and the Ramanujan splittings of manuscript 14.4 are not carried. The ledger's R1 row
   is the manuscript's own Lemma 15.1 mechanism, but the trilinear display is not re-derived line by line.
2. (PS-U) => TRO6 and the branch statement at (a, d) = (1/6, 0) are sketches; the relation between zero location
   and the size of U(mu) is not derived, so (PS-U) is not shown equivalent to anything.
3. The measurement uses a proxy for zeta_m and 228 rows; it supports "no visible alignment", nothing more. The
   Voronoi formula for the sextic theta function with additive twist is assumed standard, not cited.
