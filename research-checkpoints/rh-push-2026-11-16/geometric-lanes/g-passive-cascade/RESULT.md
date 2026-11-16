# g-passive-cascade: which interconnection of prime delay sections realizes xi'/xi, and is its passivity provable by network closure rules?

Date: 2026-11-16. Scratch research note, unreviewed. No RH claim. Labels: PROVED (argument given here),
CLASSICAL (published theorem, cited), MEASURED (mpmath, not interval-certified), OPEN.
Files: `checks.py`, `checks2.py`, `checks3.py` and their `.log` outputs in this directory.

## Verdict

**Precise obstruction, with four proved statements.**

1. The topology is identified exactly (Theorem 1). `xi'/xi` is a *series* connection of the gamma one-port with the
   prime sections, and each prime section enters as a **negated** lossless stub
   `-(log p / 2) coth(s log p / 2)` plus a positive resistor `log p / 2`. The stub is lossless with respect to the
   axis `Re s = 0`, not `Re s = 1/2`. Passivity of the total is "gamma absorbs at least what the negated stubs
   return", which is the refereed eq48 target (Weil form) verbatim. Series connection of a passive element with
   negated passive elements is not a passivity-preserving operation.
2. The scattering form `R_a(w) = X(w-a)/X(w+a)` is a product of isolated (unilateral) prime stages times a gamma
   termination only in `Re w > 1/2 + a`, where `|R_a| < 1` holds unconditionally and carries no zero information
   (Proposition 2). No stage is contractive, the termination has a right-half-plane pole, and there is no
   inter-prime cancellation of worst-case gain (Kronecker).
3. **No prime-indexed lossless cascade exists** (Theorem 3, unconditional): `R_a` has no nonconstant lossless factor
   that is periodic in `Im w` (in particular none that is a function of `p^{-w}`), no delay-line Schur step can be
   extracted from it, and no Blaschke-Potapov single-delay section with node in `Re w > max(0, 1/2 - a)` can be
   extracted. So Redheffer star products, Darlington synthesis and Potapov factorization apply to `R_a` only through
   sections indexed by zeros or by Schur/Pick steps. The first presupposes the conclusion; the second is the Pick
   ladder that eq48 and `euler/RESULT.md` already cover.
4. Davenport-Heilbronn breaks at one identified place (Proposition 4): the parallel junction. Adding two transfer
   functions averages their log-derivatives with the weight `lambda = c1 L1 / (c1 L1 + c2 L2)`, which is a
   nonconstant meromorphic function and so is never confined to `[0,1]`; it has a pole at every DH zero.

The product-closed property that does match the Euler product is the Hermite-Biehler (monotone modulus) property,
because log-derivatives add under products. Relative to `Re s = 1/2` each Euler factor fails it by an exactly
computed amount, and the gamma factor's reserve `(1/2) log(t/2 pi)` covers the worst case of only the primes up to
`Q*(t)`: 3 at `t = 1e4`, 37 at `t = 1e12` (Section 5). This is a true finite-prime statement and it does separate
zeta from DH, but it does not reach the infinite product.

Nothing in this lane moves RH. The lane is closed as a route; what it leaves is a sharper statement of where the
user's "each prime is a passive delay section" picture is true and the single place it stops.

## 0. Plan: what is new against the atlas and the walls

| Item | Overlap | What this note adds |
|---|---|---|
| Atlas section 2 (twin ladder, shifted bridge) | Records "passive finite products ... do not supply this" and "a Darlington-lossless slogan does not locate zeros" | The exact circuit (Theorem 1), and a theorem that a prime-periodic lossless section cannot exist (Theorem 3). The atlas states the failure; it does not prove non-existence. |
| PR 13 `PASSIVE_DELAY_REALIZATION_v2.md` | Realizes the inverse finite Euler ratio passively after an attenuation `C_opt(Q) -> 0` | Uses the same sections. Adds the log-derivative (impedance) form, where the divergence of `C_opt` becomes the divergent resistor `sum (log p)/2`, and the no-go for lossless sections. |
| eq48 (refereed) | Residual target == Weil form == RH; no margin `theta < 1` | Section 2 shows the network passivity inequality is the same quadratic form. The zero-margin fact is the statement that `L` is *lossless* under RH. |
| `euler/RESULT.md` | Finite Pick orders are Euler-blind | Section 4 identifies the Schur/Redheffer cascade of `R_a` with that ladder, so it is not re-run. |
| DH wall | Required | Proposition 4 and Section 6. Theorems 1-3 are obstructions and hold for DH's Euler components too, as they must. |
| Flow-blindness, MV-CAP | Not addressed by a new mechanism | The finite-prime criterion of Section 5 is a worst-case (sup over the Bohr torus) statement, so it is not a mean-value input, and it is exactly why it stops at `Q*(t)`. |

Notation. `s = 1/2 + w`. `X(w) = xi(1/2 + w)`, `L = X'/X`.
`G(s) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)`, so `xi'/xi = G + zeta'/zeta`.
"Positive-real (PR) on `Re w > 0`" means holomorphic there with `Re >= 0`. "Lossless" means PR with real part zero
a.e. on the boundary. CLASSICAL: RH iff `L` is PR on `Re w > 0` (then `L(w) = sum_{gamma>0} 2w/(w^2+gamma^2)` is a
Foster reactance, hence lossless).

## 1. The topology (Theorem 1)

**Theorem 1 (PROVED).** For a prime `p` put `Z_p(s) = (log p / 2) coth(s log p / 2)`.

(a) `Z_p(s) = sum_{k in Z} 1/(s - 2 pi i k / log p)` (symmetric summation). `Z_p` is odd, PR on `Re s > 0`, and
lossless on `Re s = 0`: it is the input impedance of an open-circuited lossless line with characteristic impedance
`(log p)/2` and round-trip delay `log p`.

(b) `log p / (p^s - 1) = Z_p(s) - (log p)/2` for `Re s > 0`, hence for `Re s > 1`

    xi'/xi (s) = G(s) - sum_p [ Z_p(s) - (log p)/2 ].                                   (1.1)

(c) For finite `Q`, `S_Q(s) = prod_{p<=Q} 2 sinh(s log p / 2) = N_Q^{s/2} / P_Q(s)` (`N_Q` the primorial,
`P_Q` the finite Euler product) has `S_Q'/S_Q = sum_{p<=Q} Z_p`, which is lossless PR on `Re s > 0`. So
`|S_Q(sigma+it)|` is strictly increasing in `sigma > 0` and all zeros of `S_Q` lie on `Re s = 0`.

Proof. (a) is the Mittag-Leffler expansion `coth x = sum_k 1/(x - i pi k)`; `Re coth(x) = sinh(2 Re x)/(2|sinh x|^2) > 0`
for `Re x > 0` and `= 0` on `Re x = 0`. (b): `1/(p^s-1) = (1/2)(coth(s log p/2) - 1)`, and
`-zeta'/zeta = sum_p log p/(p^s-1)` for `Re s > 1`. (c): logarithmic differentiation. QED.
Numerical check of (1.1) at `s = 2+3i` with primes to `2e5`: difference `1.6e-6`, below the tail bound `5e-6`.

Reading.

- *Which interconnection.* Products of transfer functions are series connections of their log-derivative
  impedances. So the Euler product is a **series** connection, and series connection does preserve PR. The brief's
  remark "products do not stay positive-real" is about the transfer function `1/(1-z)` itself, which is not the
  relevant port variable; the relevant one is the log-derivative.
- *Where it stops.* In (1.1) the stubs carry a minus sign. Zeros of `zeta` are poles of `xi'/xi` with residue
  `+1`; poles of the Euler factors are poles with residue `-1`. Relative to `Re s = 0`, `1/zeta_Q` satisfies its own
  Riemann hypothesis with the correct sign (part (c)); `xi` contains the Euler product inverted.
- *Renormalization.* `sum_p Z_p` and `sum_p (log p)/2` diverge separately at every `s`; only the difference
  converges, and only for `Re s > 1`. PR 13's `C_opt(Q) -> 0` is this divergent resistor in the scattering variable.
- *The missing theorem in circuit words.* A PR one-port `G - 1/(s-1)`-type gamma element in series with countably
  many negated lossless stubs, after the pole at `s = 1` and the resistors are cancelled against the mean density
  of the stubs, absorbs nonnegative energy for every drive. No closure rule of passive network theory has this
  shape: series, parallel and lossless feedback all require the *elements* to be passive with the same sign.

**Exact local budget (PROVED; Kronecker-Weyl CLASSICAL).** For fixed `sigma > 0`, as `t` varies,
`Re[log p/(p^{sigma+it} - 1)]` fills exactly `[-log p/(p^sigma+1), +log p/(p^sigma-1)]` (image of the circle
`|z| = p^{-sigma}` under `z/(1-z)`). For finitely many primes the joint values are dense in the product of these
intervals, so

    sup_t  Re sum_{p<=Q} log p/(p^{sigma+it} - 1)  =  sum_{p<=Q} log p/(p^sigma - 1).

There is no cancellation between distinct primes in the worst case. Any all-heights passivity argument for a
finite cascade has to pay the full sum.

## 2. The passivity inequality is the eq48 form (no escape hatch)

For a one-port with impedance `L`, the energy absorbed up to time 0 from the drive
`i(t) = sum_j b_j e^{x_j t}`, `t <= 0`, `x_j > 0`, is `sum b_i conj(b_j) (L(x_i) + conj L(x_j))/(x_i + x_j)`
(CLASSICAL; this is the standard proof that passivity implies Pick positivity). This is `Q_L(v)` of eq48
section 0. Splitting `L` by (1.1), compensated at the pole `s = 1`, gives the gamma energy minus the prime forcing:
eq48's (16)/(21). So "the circuit of Theorem 1 is passive" is, term by term, the refereed target, hence the Weil
functional on one-sided tests, hence RH. The refereed no-margin fact is the statement that under RH the one-port is
lossless: all absorbed energy is returned, so no dissipation margin exists.

Consequence checked numerically (MEASURED, `checks.py` section 2). The sharply truncated, pole-compensated circuit
`L_Q(s) = 1/s - (1/2)log pi + (1/2)psi(s/2) - sum_{n<=Q} Lambda(n) n^{-s} + int_1^Q x^{-s} dx`
is not PR on `Re s > 1/2` for any tested `Q`:

| Q | min of Re L_Q(1/2+it), 0 < t <= 60 | fraction of t with negative real part |
|---|---|---|
| 10 | -1.28 | 0.33 |
| 100 | -1.79 | 0.43 |
| 1000 | -2.38 | 0.45 |
| 10000 | -2.76 | 0.47 |

The mechanism is that a sharp cutoff at `Q` replaces the boundary measure `pi * sum_gamma delta(t-gamma)` by
Dirichlet kernels `sin((t-gamma) log Q)/(t-gamma)`, which have negative lobes of depth about `0.22 log Q`. A
lossless function sits on the boundary of the PR cone, so approximants that are not themselves exactly lossless
leave the cone. A Fejer-weighted cutoff removes most of this (min `-0.03` to `-0.11`, negative on 6% of the range,
`checks3.py`); I did not localize or explain the remaining negative part and claim nothing from it.

## 3. The scattering cascade and its convergence region (Proposition 2)

`R_a(w) = X(w-a)/X(w+a)`, `a > 0`. CLASSICAL/atlas section 2: `|R_a| < 1` on `Re w > 0` iff `a >= Delta`.

**Proposition 2 (PROVED).**

(a) `R_a(w) R_a(-w) = 1` and `|R_a(it)| = 1`. So if `R_a` is Schur it is inner (a lossless one-port). Its Darlington
embedding is trivial: there is no resistor to extract.

(b) `|R_a(w)| < 1` for `Re w > sqrt(max(0, Delta^2 - a^2))`, unconditionally; in particular for `Re w >= 1/2`.
(From the atlas zero-packet identity
`|Q(w+a)|^2 - |Q(w-a)|^2 = 8a Re(w) ((Re w)^2 + (Im w - gamma)^2 + a^2 - delta^2)` applied factor by factor in the
paired Hadamard product.)

(c) For `Re w > 1/2 + a`,
`R_a(w) = g_a(w) * prod_p b_p(p^{-w})`, with `b_p(z) = (1 - q1 z)/(1 - q0 z)`, `q0 = p^{-1/2+a}`, `q1 = p^{-1/2-a}`,
and `g_a` the ratio of the factors `(1/2) s(s-1) pi^{-s/2} Gamma(s/2)` at `s = 1/2 + w -+ a`.
On `|z| = r`, `|b_p|` fills `[(1 + q1 r)/(1 + q0 r), (1 - q1 r)/(1 - q0 r)]`, an interval containing 1 in its
interior. The termination `g_a` has a pole at `w = 1/2 - a`, in the right half-plane when `a < 1/2`.

(d) The region `Re w > 1/2 + a` where the product converges is inside the region `Re w >= 1/2` where (b) already
gives the Schur bound. A Schur bound on a smaller half-plane does not propagate to a larger one.

So the answer to "can the Euler product be written as a scattering cascade with the gamma factor as termination"
is: as a cascade of isolated multiplicative stages, yes, exactly where it is uninformative; no stage and no
termination is passive; and the stages are scalar multipliers (diagonal chain matrices), which are J-contractive
only if `|b_p| <= 1`. A cascade of *lossless two-ports* is a different object, treated next.

## 4. No prime-indexed lossless cascade (Theorem 3)

**Theorem 3 (PROVED, unconditional; uses three CLASSICAL inputs).** Fix `a > 0`, `tau > 0`, `z = e^{-tau w}`.

(i) *Multiplicative sections.* There is no factorization `R_a = B * Gamma` on `Re w > 0` with `B(w) = beta(z)` a
nonconstant inner function of `z` and `Gamma` bounded holomorphic.

(ii) *Delay-line Schur step.* There is no representation
`R_a = (rho + z Gamma)/(1 + conj(rho) z Gamma)` with `|rho| < 1` constant and `Gamma` Schur on `Re w > 0`.

(iii) *Blaschke-Potapov single-delay section.* If `R_a` is the image of a Schur function under an elementary
J-inner factor in `z` with node `z_0 = e^{-tau w_0}`, `0 < |z_0| < 1`, then `R_a` takes one value `c`, `|c| < 1`, on
the whole progression `w_0 + 2 pi i k/tau`, `k in Z` (CLASSICAL: the section imposes one interpolation condition at
`z_0`). This is impossible when `Re w_0 > max(0, 1/2 - a)`.

Proof.

(i) Write `beta = c z^m * Blaschke * S` with `S` singular inner.
- If `m >= 1`: `|B(x)| <= e^{-m tau x}` for real `x -> +inf`, while `|R_a(x)| ~ (2 pi/x)^a` by Stirling. `Gamma` is
  unbounded.
- If `S` is nontrivial: there is a boundary point where `S` has radial limit 0 (CLASSICAL, Fatou/Frostman). `R_a`
  is holomorphic and unimodular on `Re w = 0` (a boundary pole from `X(w+a) = 0` is cancelled by the zero of
  `X(w-a)` at the same point with the same multiplicity, by the symmetry `rho -> -conj(rho)`). `Gamma` is unbounded.
- If the Blaschke part has a zero `z_0 != 0`: `R_a` vanishes on `w_0 + 2 pi i k/tau`, all `k in Z`, so zeta has zeros
  at `s_0 + 2 pi i k/tau` with `s_0 = 1/2 + w_0 - a` in the critical strip. If `Re s_0 != 1/2` (reflect to
  `Re s_0 > 1/2`), this gives `>> H` zeros of real part `Re s_0` up to height `H`, contradicting Ingham's
  `N(sigma, H) << H^{3(1-sigma)/(2-sigma)} log^5 H = o(H)` for `sigma > 1/2` (CLASSICAL, Titchmarsh 9.19). If
  `Re s_0 = 1/2`, it contradicts the non-vanishing of zeta on a positive proportion of every vertical arithmetic
  progression on the critical line (CLASSICAL: Martin-Ng 2013; Li-Radziwill 2015).
  A nonconstant inner `beta` has at least one of the three features. QED (i).

(ii) The representation forces `|(R_a - rho)/(1 - conj(rho) R_a)| = e^{-tau Re w}|Gamma| <= e^{-tau Re w}`. On the
real axis `R_a(x) -> 0` polynomially, so the left side tends to `|rho|` if `rho != 0` and decays only like
`x^{-a}` if `rho = 0`. Contradiction. QED (ii).

(iii) `c = 0` is case (i). Let `c != 0` and `s_1 = 1/2 + w_0 - a`, `s_2 = s_1 + 2a`, `sigma_j = Re s_j`,
`t_k = Im w_0 + 2 pi k/tau`. Stirling gives
`|zeta(s_1 + i t_k')| = |c| (|t_k|/2 pi)^a (1+o(1)) |zeta(s_2 + i t_k')|` along the progression.
`Re w_0 > 1/2 - a` means `sigma_2 > 1`, so `|zeta(s_2 + it)| >= zeta(2 sigma_2)/zeta(sigma_2) > 0`, and therefore
`sum_{|k|<=N} |zeta(sigma_1 + i t_k)|^2 >> N^{1+2a}`. Gallagher's inequality
`sum_k |F(t_k)|^2 << int |F|^2 + int |F F'|` with the mean squares
`int_0^H |zeta(sigma+it)|^2 dt << H^{max(1, 2-2 sigma)} log H` (and the same for `zeta'` with `log^3 H`; CLASSICAL,
Titchmarsh ch. 7 and the functional equation) gives `<< N^{max(1, 2 - 2 sigma_1)} log^2 N`. Since `Re w_0 > 0`
means `sigma_1 > 1/2 - a`, the exponent `max(1, 2-2 sigma_1)` is `< 1 + 2a`. Contradiction. QED (iii).

OPEN: (iii) for nodes with `0 < Re w_0 <= 1/2 - a` (only when `a < 1/2`). It needs a lower bound for the mean
square of `zeta(s_2 + i t_k)` on a progression with `1/2 + a < sigma_2 <= 1`; a first-moment asymptotic on
progressions would supply it. I did not prove it. Higher-degree and multi-delay sections reduce, by Potapov
factorization, to iterating (ii)-(iii) with updated terminations, which I did not carry out.

Reading. Under RH, `R_a` is inner, and Potapov's theorem factors it into elementary lossless sections. Theorem 3
says those sections cannot be functions of a single delay `e^{-tau w}`, for any `tau`. The cascades that do exist
are:

- the Blaschke cascade, one all-pass section `(w - a - i gamma)/(w + a - i gamma)` per zero. Its sectionwise
  passivity is `Re rho_c + a >= 0`, the conclusion itself;
- the Schur-algorithm cascade at chosen nodes, whose reflection coefficients have modulus `< 1` at step `n` iff the
  order-`n` Pick matrix is positive. This is the Pick ladder of PRs 48-56; by eq48 its all-order statement is RH and
  by `euler/RESULT.md` each finite order is Euler-blind;
- the de Branges canonical system of `E_a(z) = xi(1/2 + a - iz)`, a continuous lossless cascade indexed by the
  chain parameter (atlas section 2).

In none of them are the primes the sections. In the time domain the primes are the echo times of the port's
impulse response, `-sum_n Lambda(n) n^{-1/2} delta(t - log n)`, not components of the lossless chain.

DH control for Theorem 3: the same statements hold for the DH ratio (it has no vertical arithmetic progression of
zeros either). Theorem 3 is an obstruction and does not distinguish; it is not offered as a mechanism.

## 5. What product closure does give: the Hermite-Biehler reserve (finite primes only)

Let `A_Q(s) = (1/2)s(s-1) pi^{-s/2} Gamma(s/2) P_Q(s)` and `xi_Q(s) = A_Q(s) + A_Q(1-s)`, so that `xi_Q` has the
functional equation and is real on the critical line. Put
`J_Q(sigma,t) = log|A_Q(sigma+it)| - log|A_Q(1-sigma+it)| = int_{1-sigma}^{sigma} Re (A_Q'/A_Q)(u+it) du`.

**Proposition (PROVED, elementary).** If `xi_Q(sigma+it) = 0` with `sigma != 1/2` at a point that is not a pole,
then `J_Q(sigma,t) = 0`. Also `d/d sigma J_Q = 2 Re A_Q'/A_Q (1/2+it)` at `sigma = 1/2`, and
`Re A_Q'/A_Q(1/2+it) >= Re G(1/2+it) - sum_{p<=Q} log p/(sqrt p - 1)`, with equality approached (Section 1 budget).

Proof. `|A_Q(1-s)| = |A_Q(1-sigma+it)|` since `A_Q` is real on the real axis. QED.

This is the monotone-modulus mechanism of Gonek's finite Euler product model (Gonek, Trans. AMS 2012; cited from
memory, not re-read here). It is the correct home of the "passive prime section" picture: log-derivatives add, the
gamma factor supplies a positive reserve `Re G(1/2+it) ~ (1/2) log(t/2 pi)`, and each prime draws at most
`log p/(sqrt p - 1)`.

MEASURED (`checks.py` section 3). Largest `Q*` whose worst-case draw is below the reserve:

| t | Re G(1/2+it) | Q* |
|---|---|---|
| 1e2 | 1.38 | none |
| 1e4 | 3.69 | 3 |
| 1e6 | 5.99 | 7 |
| 1e9 | 9.44 | 17 |
| 1e12 | 12.90 | 37 |
| 1e20 | 22.11 | 107 |

The draw grows like `2 sqrt Q` and the reserve like `(1/2) log t`, so `Q*(t) ~ (log t)^2/16`.

MEASURED (`checks3.py`, `checks2.py` section 3c), window `100.3 <= t <= 130.3`: the fraction of heights with
`J_Q(sigma,t) > 0` for all `1/2 < sigma <= 3` is 0.915, 0.837, 0.689, 0.482 for `Q = 3, 7, 30, 300`. For `Q = 30`
the model has off-line zeros where the criterion fails, found by root-finding to `1e-23`:
`0.9084 + 117.2087i`, `0.9035 + 113.3111i`, `0.9122 + 118.0119i`. More primes at fixed height means less reserve,
not more. (`xi_Q` also has a zero next to each of its poles on `Re s = 0` and `Re s = 1`; the winding counts in
`checks.py` section 3b are zeros minus poles and are not used as off-line counts.)

Where the Euler product is used: `P_Q` is holomorphic and zero-free on `Re s > 0` with an explicit bounded
log-derivative on `Re s >= 1/2`. For DH the corresponding one-sided half is the parallel sum
`c1 P_{chi,Q} + c2 P_{chibar,Q}`, which has zeros in `Re s > 1/2`, so `J` is not even defined as a monotone
quantity. This criterion therefore fails for DH at the first step, as required.

Why it does not reach RH: the criterion is a sup over the Bohr torus (Kronecker), and on the torus the prime draw
is unbounded as `Q -> inf` for every `sigma <= 1`. Passivity along the actual line `t -> (p^{-it})_p` is not a
property of the lifted multi-delay network; it would have to use the position of that line, which is the
all-scale signed arithmetic estimate the atlas names as missing.

## 6. Davenport-Heilbronn: the parallel junction (Proposition 4)

`f = c1 L(s,chi) + c2 L(s,chibar)`, `chi` mod 5 with `chi(2) = i`, `c1 = (1 - i kappa)/2`, `c2 = conj(c1)`.

**Proposition 4 (PROVED, algebra).** With `lambda = c1 L1/f`,

    f'/f = lambda * L1'/L1 + (1 - lambda) * L2'/L2.

Each branch `L_j'/L_j` has the series form of Theorem 1 with stubs
`(log p/2) coth((s log p - i arg chi(p))/2)`, which are again lossless PR on `Re s > 0` (the character only slides
the poles along `Re s = 0`). A convex combination with constant weights in `[0,1]` of PR functions is PR. Here
`lambda` is a nonconstant meromorphic function, so it is not real on any open set, and it has a pole at every zero
of `f` that is not a common zero of `L1, L2`. Because `|c1| = |c2|`, total cancellation needs only
`L1/L2 = -c2/c1`, a unimodular target.

So the two cascades are individually series networks of the same kind as zeta's. The failure is located entirely
at the junction that adds the two *transfer functions*. A passive parallel junction adds admittances; adding
transfer functions is a different operation and is the only place a zero can be created in a region where both
cascades are zero-free. For zeta there is no junction: (1.1) is a single series chain, which cannot create a pole
of `zeta'/zeta` where it converges. That is the classical statement "Euler product implies no zeros in `Re s > 1`"
and it is the whole content: the junction-free structure gives nothing in `Re s <= 1`, where the chain diverges.

MEASURED (`checks2.py` section 4): `|c1| = |c2| = 0.51978383`. At the DH zero `s_0 = 0.808517182457 + 85.6993484854i`
(`|f| = 6e-26`): `L1/L2 = -0.8506508084 - 0.5257311121i = -c2/c1` to 10 digits, `|L1/L2| = 1`. On the circle
`|s - s_0| = 0.01`: `Re L1'/L1` between 1.53 and 1.70, `Re L2'/L2` between 0.15 and 0.27 (both branches positive),
`|lambda|` about 29, and `Re f'/f` runs from `+99.8` to `-100.2`. A scan of `t < 6000`, `sigma in {1.02, 1.05, 1.1}`
found no DH zero with `Re s > 1` (smallest `|f|` about 0.19); their existence is CLASSICAL
(Davenport-Heilbronn 1936) and was not reproduced here.

## 7. Answers to the task questions

- *Which interconnection realizes `xi'/xi`?* Series: gamma one-port, minus the lossless prime stubs `Z_p`, plus the
  resistors `(log p)/2`, with the pole at `s = 1` cancelling the mean stub density (Theorem 1).
- *Whose passivity is the missing theorem?* That series circuit's. It is the eq48/Weil form (Section 2).
- *Do Redheffer star products, Darlington synthesis, scattering cascades apply?* Not with prime sections
  (Theorem 3). They apply with zero-indexed or Pick-indexed sections, which is circular or already covered.
- *Euler product as a scattering cascade with gamma termination?* Only as isolated non-contractive stages with an
  active termination, in a half-plane where the Schur bound is unconditional (Proposition 2).
- *Where does DH break passivity?* At the parallel junction, through the weight `lambda` (Proposition 4).

## 8. Pivot (one, as the brief allows)

The adjacent idea with content is Section 5: move from positive-real transfer functions to the product-closed
Hermite-Biehler property with the gamma reserve. It yields a correct finite-prime statement and a clean DH
separation, and it stops at `Q*(t) ~ (log t)^2/16` for the reason given there. I did not find a way past that
which is not a restatement of the signed all-scale estimate. No further pivot.

## 9. Three weakest steps

1. Theorem 3(i), critical-line case, rests on the Martin-Ng / Li-Radziwill non-vanishing results for *shifted*
   vertical progressions, quoted from memory. I did not re-read the hypotheses (in particular whether every shift
   and every common difference is covered). If only unshifted progressions are covered, (i) is proved off the
   line by Ingham and on the line only for progressions through the stated class.
2. Theorem 3(iii) uses Gallagher's inequality with mean squares of `zeta` and `zeta'` for `sigma_1 < 1/2` via the
   functional equation; the exponents are standard but the log powers were not tracked, and the case
   `Re w_0 <= 1/2 - a` is open. The claim "every single-delay lossless section is excluded" is therefore proved
   for multiplicative sections and delay-line steps, and only partially for general Potapov sections.
3. Section 5 numerics are mpmath point evaluations on grids (step 0.02 in `t`), not certified; the attribution to
   Gonek is from memory. The Fejer remark in Section 2 is an unexplained measurement.
