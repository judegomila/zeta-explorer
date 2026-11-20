# n1-mayer-dirac: Dirac / Lagrange identity for the Bose-weighted Mayer operator

Date: 2026-11-17. Nothing here proves or refutes RH. No zero-free region and no Lambda bound changes.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (mpmath, not interval-certified), OPEN.
All runs: local, single process, through `scripts/memcap.sh 8`, each under 20 minutes. No ssh.

## Verdict

**Precise obstruction; the idea is killed at the first test.** The Lagrange identity exists and is
proved (Lemma L1), but:

1. It holds for **every** function g, not only for eigenfunctions. The eigenvalue equation, the
   three-term relation and Hecke operators are not used anywhere in it. It contains a bulk
   ("source") term in addition to the boundary term; the source vanishes only for a single Bessel
   mode.
2. For the Eisenstein eigenfunction at b = rho/2 the form N(g) is **not finite** and the boundary
   term **does not vanish**: it is bounded below by
   `|zeta(rho-1)/(rho-1)|^2 R^(3/2 - Re rho)` at the upper end and tends to
   `|zeta(rho-1)/Gamma(rho)|^2 eps^(Re rho - 1/2)` at the lower end. `zeta(rho-1) != 0` for every
   nontrivial zero. On the critical line the identity reads `0 * (log divergence) = ...`.
3. The boundary coefficient is the cusp-flux functional `f(0) = psi(1) = zeta(rho-1)`. It is nonzero
   exactly on the Eisenstein channel and zero on the Maass channel (measured 9.3e-12). The identity
   is therefore closed (boundary-free) only in the channel where it is not wanted.
4. The shifted-weight control a = 0.7 has eigenvalue-1 points at Re b = -0.647 and 0.209 (and at
   Re b = 0.35 to 0.46 for a = 0.2 to 0.5), all with `f(0) != 0`, and satisfies L1 verbatim. Nothing
   in the identity separates a = 0 from a = 0.7.

Pivot (one, section 6): the Eisenstein channel is isolated exactly by one resolvent matrix element,
`[(1 - L_b)^(-1) 1](0) = 2 zeta(2b-1)/zeta(2b)` (PROVED, verified to 1e-13 or better away from resolvent singularities; classical
content: `sum phi(n) n^(-s)`). It gives a proved upper bound
`sigma_min(1 - L_b) <= |zeta(2b)| / (2 |zeta(2b-1)|)` in the sup norm, which tends to 0 with height
on every line Re b < 1/2. It is a restatement of RH as analyticity of a matrix element, not a route.

## 0. Plan, and relation to the map

Target as assigned: for an eigenvalue-1 eigenfunction g of the Mayer operator in the Laplace
picture, an identity `2 Re(kappa) N(g) = boundary term`, `kappa = rho - 1/2`; then show the boundary
term vanishes and N(g) is not neutral.

Relation to OBSTRUCTION_MAP rows: G12 (no positive form with symmetric Laplacian on a space
containing `E*(z, rho/2)`), G6/Q6 (indefinite squares carry no arithmetic constraint), wall items 2
and 3 of section 5. New here relative to those rows: the transfer-operator form of the same
obstruction with explicit constants, the channel functional `f(0)`, an operator-class control
(shifted Bose weight) with eigenvalue-1 points on both sides of Re b = 1/4, and the channel formula
of section 6.

## 1. Setup

**S1 (CLASSICAL, Mayer; Lewis-Zagier).** `L_b f(x) = sum_{n>=1} (n+x)^(-2b) f(1/(n+x))`, continued
in b through `zeta(2b+j, x+1)`. Eigenvalue 1 at `b = rho/2` and at even Maass parameters
`b = 1/2 + i r`.

**S2 (PROVED; Re nu > -1 directly, otherwise by continuation in nu).** Put `nu = 2b - 1` and
`f(x) = int_0^inf e^(-xu) u^(nu/2) g(u) du`. With
`int_0^inf e^(-yu) u^(nu/2) J_nu(2 sqrt(ut)) du = t^(nu/2) y^(-nu-1) e^(-t/y)` and
`sum_n e^(-(n+x)u) = e^(-xu)/(e^u - 1)`:

    L_b f = f   <=>   (e^u - 1) g(u) = (H_nu g)(u),   (H_nu g)(u) = int_0^inf J_nu(2 sqrt(ut)) g(t) dt.

`H_nu` is an involution with symmetric kernel; `W = e^u - 1` is the inverse Bose weight.

**S3 (PROVED).** Eisenstein eigenfunction. `psi(z) = sum_{m,n>=1} (mz+n)^(-2b)` (continued),
`psi^+ = psi + (zeta(2b)/2)(1 + z^(-2b))`, `f(x) = psi^+(x+1)`. Its Laplace density is

    g(u) = u^(nu/2) e^(-u) / Gamma(nu+1) * [ zeta(nu)/u - zeta(nu+1)/2 + sum_m m^(-nu-1) (1/(e^(u/m)-1) - m/u + 1/2) ],
    (W g)(u) = u^(nu/2)/Gamma(nu+1) * sum_m m^(-nu-1) sum_{k=1}^m e^(-uk/m),
    (H_nu g)(u) = (W g)(u) - zeta(nu+1) u^(nu/2) e^(-u)/Gamma(nu+1).

So `W g = H_nu g` iff `zeta(nu+1) = zeta(2b) = 0`. (At a zero the `psi^+` correction vanishes.)

**S4 (PROVED).** `(1 - L_b) [psi^+(. + 1)] = zeta(2b)/2` (constant function), all b by continuation.
Proof for Re b > 1: in `(n+x)^(-s) psi^+(1 + 1/(n+x))` the double sum becomes
`sum_{c>=2} sum_{e>c, c not| e} (cx+e)^(-s)`; `f` has `sum_{c>=1} sum_{e>c} (cx+e)^(-s)`; the difference is
`zeta(s) zeta(s, x+2)`; the `zeta(s)/2` terms contribute
`(zeta(s)/2)(1 + (x+1)^(-s) - zeta(s,x+1) - zeta(s,x+2))`; the total is `zeta(s)/2`.

**S5 (PROVED).** For any eigenvalue-1 eigenfunction with Re b < 1/2:
`f(x) = f(0) zeta(2b, x+1) + sum_n (n+x)^(-2b) [f(1/(n+x)) - f(0)]`, hence
`f(x) = f(0) x^(1-2b)/(2b-1) + O(x^(-2 Re b))` as x -> inf. In the Laplace picture this is
`g(u) ~ f(0) u^(nu/2 - 1)/Gamma(nu+1)` as u -> 0. For the Eisenstein eigenfunction
`f(0) = psi(1) = zeta(rho - 1)`.

## 2. First lemma: the Lagrange identity with its exact terms

`U(x) = sqrt(x) (J_nu(x), J_(nu+1)(x))` satisfies `T U = (nu + 1/2) U`, `T = sigma_3 x d/dx + sigma_1 x`
(CLASSICAL, from the two Bessel recurrences; checked). In the variable u (`x = 2 sqrt(ut)`) define

    Phi_1 = H_nu g,  Phi_2 = H_(nu+1) g,  Phi_1' = H_nu[sqrt(t) g],  Phi_2' = H_(nu+1)[sqrt(t) g].

Then `u d/du Phi_1 = (nu/2) Phi_1 - sqrt(u) Phi_2'` and `u d/du Phi_2 = sqrt(u) Phi_1' - ((nu+1)/2) Phi_2`.

**Lemma L1 (PROVED).** For every g for which the four transforms exist, and 0 < eps < R, with
`kappa = nu + 1/2`:

    [ u^(1/2) (|Phi_1|^2 + |Phi_2|^2) ]_eps^R
        = Re(kappa) * int_eps^R (|Phi_1|^2 - |Phi_2|^2) u^(-1/2) du
          + 2 int_eps^R Re( conj(Phi_2) Phi_1' - conj(Phi_1) Phi_2' ) du.

(In the variable `p = sqrt(2u)` this is the assigned form with `2 Re kappa` and measure `dp/p`.)
Left side: boundary term B. First integral: N(g; eps, R). Second integral: source S.

Remarks, each PROVED by inspection of the derivation:

- **R1.** No property of g is used. The eigenvalue equation enters only by substituting
  `Phi_1 = W g`. The three-term relation and Hecke operators do not enter.
- **R2.** S = 0 when g is a point mass (`Phi' = sqrt(t_0) Phi`, and
  `conj(Phi_2) Phi_1 - conj(Phi_1) Phi_2` is imaginary). For that case L1 is the Bessel identity
  `2 Re(kappa) int (|J_nu|^2 - |J_(nu+1)|^2) dx = [x(|J_nu|^2 + |J_(nu+1)|^2)]`, whose boundary term at
  infinity is `(2/pi) cosh(pi Im nu)`, not zero (at Re kappa = 0 it is cancelled by the equal limit at 0).
- **R3.** With weight `u^(2c)` instead of `u^(1/2)` the same computation gives coefficients
  `(Re nu + 2c)` on `|Phi_1|^2` and `-(Re nu + 1 - 2c)` on `|Phi_2|^2`. Only c = 1/4 makes them
  equal and opposite. The factor `Re(rho) - 1/2` is produced by this choice of weight, which is a
  property of Bessel functions of any order.
- **R4.** There is no operator with eigenvalue kappa acting on the eigenfunction: T acts on the
  kernel in the joint variable `x = 2 sqrt(ut)`; applied to `Phi[g]` it produces `Phi[sqrt(t) g]`,
  which is not a function of `Phi[g]` independent of nu.

MEASURED check of L1 on `g = t^beta e^(-t)`, `beta = 0.3 + 0.7i`, closed forms via 1F1, [0.2, 6]
(`t2.py`, dps 30):

| nu | boundary B | Re(kappa) N | source S | defect |
|---|---|---|---|---|
| -0.5 + 14.1347i | -3745383993.0 | 0.0 | -3745383993.0 | -1.3e-21 |
| -0.2 + 3i | -9.230067541 | 3.552391194 | -12.78245873 | -6.3e-30 |
| -0.8 + 3i | -56.3857685 | -14.12427463 | -42.26149387 | -5.7e-29 |

The first row has Re kappa = 0 and a nonzero boundary term, balanced entirely by the source.

## 3. First test: collocation and the terms of L1 at rho_1/2, rho_2/2, rho_5/2

Collocation `Z V^(-1)`, `Z_ij = zeta(2b+j, x_i+1)`, `V_ij = x_i^j`, Chebyshev nodes on [0,1], N = 40,
dps 50 (dps 50 rather than 40 because of the Vandermonde condition number). `t1.py`, MEASURED:

| zero | nearest eigenvalue: abs(lam-1) | next nearest | sup abs(Lf-f)/sup abs(f), explicit f | eigenvector vs explicit f | three-term defect |
|---|---|---|---|---|---|
| rho_1 | 1.3e-15 | 0.934 | 8.1e-27 | 1.9e-15 | 9.5e-34 |
| rho_2 | 1.4e-15 | 0.968 | 4.3e-24 | 2.8e-15 | 8.3e-31 |
| rho_5 | 1.7e-15 | 0.933 | 3.2e-18 | 3.2e-15 | 1.8e-26 |

(The 1e-15 entries are double-precision eigen-solves of the mp-built matrix.) Growth coefficient
(S5): `psi(z) z^(s-1)` at z = 400 equals `zeta(rho-1)/(rho-1)` to 4 to 5 digits for all three
(e.g. rho_1: -0.0192474 + 0.0844837i against -0.0192472 + 0.0844797i). Laplace density (S3):
`int e^(-xu) u^(nu/2) (Wg) du = psi(x) - psi(x+1)` at x = 2, rho_1: relative error 2.4e-15 at dps 60
(`t2.py`); for rho_2, rho_5 the quadrature did not converge at the precision tried (the integrand
is of size exp(pi gamma/2) with a log-oscillating endpoint); the identity itself is S3.

**Terms of L1 for the eigenfunction (Phi_1 = W g explicit).**

- **A1 (PROVED from S3/S5).** As u -> 0: `Phi_1 ~ c_0 u^(nu/2)`, `c_0 = zeta(nu)/Gamma(nu+1)`. So
  `u^(1/2)|Phi_1|^2 -> |c_0|^2 u^(Re kappa)` and the `Phi_1` part of N diverges like
  `|c_0|^2 log(1/eps)` when Re kappa = 0.
- **A2 (PROVED in outline; Mellin contour shift past the pole of zeta(nu+1-w) at w = nu, remainder O(exp(-2 sqrt(2 pi u))) times exp(pi gamma/2)).** As
  u -> inf: `Phi_1 ~ (zeta(nu)/nu) u^(-nu/2)`. So `u^(1/2)|Phi_1|^2 ~ |zeta(rho-1)/(rho-1)|^2 u^(3/2 - Re rho)`.
- **A3 (ARGUED: Mellin multiplier `H_mu[t^(s-1)] = u^(-s) Gamma(mu/2+s)/Gamma(mu/2+1-s)`, checked
  numerically at one real point; not checked on the eigenfunction).**
  `Phi_2 ~ c_0 Gamma(nu+1/2)/Gamma(3/2) u^(-nu/2)` as u -> inf, and `Phi_2 = O(u^((nu+1)/2))` as u -> 0.

Since the boundary term is a sum of two squares, A1 and A2 alone give (PROVED):

    B(eps, R) >= |zeta(rho-1)/(rho-1)|^2 R^(3/2 - Re rho) (1 + o(1)) - |zeta(rho-1)/Gamma(rho)|^2 eps^(Re rho - 1/2) (1 + o(1)) - (Phi_2 at eps).

It does not vanish for any 0 < Re rho < 1, because `zeta(rho-1) != 0`.

MEASURED (`t2c.py`, `t2d.py`, dps 60; `Q(u) = u^(1/2)|Phi_1(u)|^2`):

| zero | Q(1e-6) | predicted abs(c_0)^2 | Q(u)/u at u = 300, 1000, 3000, 10000 | predicted abs(zeta(rho-1)/(rho-1))^2 |
|---|---|---|---|---|
| rho_1 | 4.6079196e18 | 4.6079242e18 | 0.007507279956 (all four) | 0.007507279956 |
| rho_2 | 3.7796129e28 | 3.7796167e28 | 0.0111701398, then 0.01117013756 (last three) | 0.01117013756 |
| rho_5 | 1.8204019e45 | 1.8204037e45 | 6669865.5 (u = 300, pre-asymptotic), then 0.01222112828 (last three) | 0.01222112828 |

`int_{1e-6}^{1e-3} |Phi_1|^2 u^(-1/2) du / log(1e3) = 4.607258e18` for rho_1 (log divergence of N,
coefficient `|c_0|^2`). The large-u regime sets in late: before it, `Q(u)/u` is larger by many orders (rho_2: 3.9e6 at
u = 100; rho_5: 2.1e27 at u = 100), because the exponentially small remainder carries the factor
`1/|Gamma(rho)|^2`.

With A3 the coefficient of the N-integrand at infinity is
`|zeta(nu)/Gamma(nu+1)|^2 (|Gamma(nu)|^2 - |Gamma(nu+1/2)/Gamma(3/2)|^2)` = -0.1278, -0.2880, -0.5004
for rho_1, rho_2, rho_5, and the boundary coefficient is +0.1428, +0.3103, +0.5248. So on the
critical line N(g; eps, R) = `+|c_0|^2 log(1/eps) - |coef| R + O(1)`: no finite value, no sign.

**Outcome of the first test.** Kill condition "N(g) = 0 to working precision" is not what happens;
what happens is stronger: N(g) is undefined (divergent at both ends with opposite signs), the
boundary term is nonzero for every zero location, and L1 holds for arbitrary g (R1). An off-line
zero would satisfy L1 on every [eps, R] with the same structure. The target statement "boundary
term vanishes and N(g) is not neutral" is false as posed.

**Relation to Maass-Selberg (row G12).** Not derived term by term. What is established: the
non-vanishing boundary term of L1 is carried by the same functional as the cusp flux in Green's
identity for the resonance state, namely the coefficient of the growing mode
(`x^(1-2b)` for f, `y^(1-s)` for `zeta(2s) E(z,s)` at `s = rho/2`), both proportional to
`zeta(rho-1)`. L1 is weaker than Maass-Selberg: it holds for all g and has a free bulk term.

## 4. Controls

**(a) Shifted Bose weight, a = 0.7 (MEASURED, `t4.py`, N = 28, dps 40, secant on det(1-L)).**
`L_b^(a) f(x) = sum_n (n+a+x)^(-2b) f(1/(n+a+x))`, i.e. weight `e^(-au)/(e^u - 1)`,
`Z_ij = zeta(2b+j, x_i+1+a)`. No three-term relation. Eigenvalue-1 points tracked from rho_k/2:

| a | branch from rho_1/2: b | Re(2b) - 1/2 | branch from rho_2/2: b | Re(2b) - 1/2 |
|---|---|---|---|---|
| 0 | 0.2500000000 + 7.0673625709i | 0.000000 | 0.2500000000 + 10.5110198194i | 0.000000 |
| 0.05 | 0.1443319039 + 6.8247510304i | -0.211336 | 0.0765526366 + 10.3668207186i | -0.346895 |
| 0.1 | 0.0366931557 + 6.5902470374i | -0.426614 | -0.1756645439 + 10.2803331850i | -0.851329 |
| 0.2 | -0.1765930231 + 6.1357893527i | -0.853186 | 0.3466376159 + 10.5882437213i (other root) | +0.193275 |
| 0.3 | -0.3731458872 + 5.6870718243i | -1.246292 | 0.4574161733 + 10.0793151157i | +0.414832 |
| 0.5 | -0.6271982202 + 4.7941714178i | -1.754396 | 0.3901772619 + 9.2189004032i | +0.280355 |
| 0.7 | -0.6474897156 + 4.0339180117i | -1.794979 | 0.2090045777 + 8.4776740104i | -0.081991 |

All have `|f(0)|/sup|f|` between 0.41 and 1.00 (flux channel), `|det| <= 1e-12`. Between a = 0.1
and 0.2 the second secant run moved to a different root; rows from 0.2 on are eigenvalue-1 points
of the control but not the continuation of rho_2/2. Both signs of Re kappa occur. L1 holds for each
(R1), S5 holds for each (the proof uses only the n-sum), so each has the same boundary structure
with `f(0) != 0`. The identity does not distinguish a = 0 from a = 0.7 at any step.

**(b) Hecke triangle group G_5.** Not run. By R1 the identity L1 holds for its eigenfunctions as
for any function; no step of L1 could distinguish it.

**Required distinguishing step (three-term relation plus Hecke operators on period functions).**
No such step exists in this lane. The three-term relation is equivalent to the eigen-equation
`W g = H_nu g` (S2) and is used only as the substitution `Phi_1 = W g`. Hecke operators identify
`psi` as the Eisenstein period function (S3); once S3 is written explicitly they add no inequality.

**DH, backward heat.** No transfer operator is attached to either; not a quantitative handle here.
(L1 itself holds for any g, so it cannot fail for any control.)

**Maass channel.** Maass parameters are eigenvalue-1 points of the same operator. Restriction to
the Eisenstein channel: the functional `f -> f(0)`. S5 shows a Maass period function
(`psi = o(1)` at infinity) has `f(0) = 0`; MEASURED at the first even Maass form
`b = 0.5 + 13.7797513519i`: `|f(0)|/sup|f| = 9.3e-12`, `|lam - 1| = 7.6e-15`. On the Maass channel
the boundary term of L1 at 0 vanishes; on the Eisenstein channel it is `|zeta(rho-1)|^2`-weighted
and nonzero. The exact channel projector is in section 6.

## 5. sigma_min(1 - L_b) on Re b = 0.3 and 0.4

Full table in section 7 (MEASURED; `t3.py`; N = 36 at dps 40 and N = 64 at dps 72; smallest singular
value of the nodal matrix on Chebyshev nodes of [0,1], 2-norm; Im b = 0, 1, ..., 60).

- **The nodal sigma_min is not a converged quantity.** It changes with N by factors 0.43 to 9.3
  between N = 36 and N = 64, and keeps decreasing at fixed b (`t7.log`: b = 0.3 + 24i gives 0.0100,
  0.0086, 0.0064 at N = 48, 64, 84; b = 0.4 + 36i gives 0.0462, 0.0380, 0.0332). The operator is
  non-normal and the value depends on the norm. The table is a record of the two discretisations,
  not of an operator invariant.
- `min abs(lam - 1)` (spectral, norm-independent) agrees between N = 36 and N = 64 to 4 digits for
  Im b <= about 25 and differs by up to 0.50 above; N = 36 is under-resolved there
  (`(n+x)^(-2b)` has about `2 Im b log 2 / (2 pi)` oscillations across [0,1]). Use the N = 64 column.
- Range at N = 64 on Re b = 0.3: from 0.0031 (Im b = 0) up to order 0.1. The lowest values for
  Im b > 0 are at Im b = 7, 24, 36, 56, 48 (0.0044, 0.0086, 0.0124, 0.0150, 0.0163); the first three
  lie next to rho_1/2 = 7.07, rho_9/2 = 24.00, rho_20/2 = 36.03 (the others were not matched
  individually).
- The quantity is not channel-restricted: it is small near zeta zeros (Re b = 1/4) and near even
  Maass parameters (Re b = 1/2, eigenvalue +1); odd Maass parameters are eigenvalue -1 and appear
  in sigma_min(1 + L_b), also tabulated. The channel-restricted quantity is P3 of section 6; its
  sup-norm bound is the last column of each block (the nodal 2-norm differs from the sup norm by
  up to sqrt(N), so the columns are not directly comparable row by row).
- No Neumann or Dolgopyat contraction is proposed.

## 6. Pivot: exact isolation of the Eisenstein channel

**P1 (PROVED from S4; verified).** For b not a pole,

    [(1 - L_b)^(-1) 1](x) = 2 psi^+(x+1)/zeta(2b),      [(1 - L_b)^(-1) 1](0) = 2 zeta(2b-1)/zeta(2b) = 2 sum_n phi(n) n^(-2b).

(`psi^+(1) = zeta(2b) + sum_{N>=2} (N-1) N^(-2b) = zeta(2b-1)`. The Dirichlet series is the
classical count of rationals by continued-fraction words; each rational has two expansions.)
MEASURED (`t5.py`, N = 40, dps 50):

| b | collocation value at 0 | 2 zeta(2b-1)/zeta(2b) | sup rel. error on nodes |
|---|---|---|---|
| 0.3 + 5i | 2.6116194859935 + 0.114239473029672i | same to 15 digits | 1.7e-25 |
| 0.3 + 7.2i | -1.58804468265097 + 10.148904437819i | same to 15 digits | 1.2e-23 |
| 0.4 + 20i | 4.71190014575197 - 4.44662997092648i | 4.71190014575196 - 4.44662997092606i | 1.3e-13 |
| 0.75 + 3i | 1.922690917513 + 0.314263160039157i | same to 15 digits | 9.6e-28 |
| 0.5 + 13.7797513519i (Maass) | 4.1791728474485 + 0.281848627823634i | same to 15 digits | 5.3e-8 |

The last row: the resolvent is singular at the Maass parameter, the matrix element is regular
there. So the pair (vector 1, functional delta_0) does not couple to the Maass channel.

**P2 (PROVED).** RH <=> `b -> [(1 - L_b)^(-1) 1](0)` is analytic in Re b > 1/4 apart from b = 1.
Restatement.

**P3 (PROVED).** On any Banach space of functions on [0,1] containing constants with
`|h(0)| <= ||h||` and `||1|| = 1`: `inf ||(1-L_b) h||/||h|| <= |zeta(2b)|/(2 |zeta(2b-1)|)`. On
Re b = sigma_0 < 1/2 the right side is of exact order `t^(-(3/2 - 2 sigma_0)) |zeta(2 sigma_0 + 2it)|`
(functional equation for `zeta(2b-1)`; `zeta(2 - 2b)` is bounded above and below there), and
`|zeta(2 sigma_0 + 2it)| = O(t^(max(1/2 - 2 sigma_0, (1 - 2 sigma_0)/2) + eps))` by the functional
equation and convexity, giving a net negative exponent, so the smallest singular value of 1 - L_b tends
to 0 with height on Re b = 0.3 and 0.4 whether or not RH holds. A height-uniform resolvent bound
does not exist in this norm; the channel-restricted quantity is 1/zeta itself.

**Controls for the pivot.** For a = 0.7 the same matrix element is a series over shifted
continued-fraction words with no Euler product; it has poles at the points of section 4 on both
sides of Re b = 1/4. P1 for a = 0 uses the divisor-sum step `c | e` in S4, which is where the
modular (three-term) structure enters; the output is the identity `sum phi(n) n^(-s) = zeta(s-1)/zeta(s)`
and no inequality. No further pivot is taken.

## 7. sigma_min table (MEASURED)

`smin` = sigma_min(1 - L_b) of the nodal matrix; `P3 bound` = `|zeta(2b)|/(2|zeta(2b-1)|)` (sup norm).

| Im b | Re b=0.3: smin N=36 | smin N=64 | smin(1+L) N=64 | min abs(lam-1) N=36 / N=64 | abs det(1-L) N=64 | P3 bound | Re b=0.4: smin N=36 | smin N=64 | smin(1+L) N=64 | min abs(lam-1) N=36 / N=64 | abs det(1-L) N=64 | P3 bound |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.0067 | 0.0031 | 0.0026 | 0.6589 / 0.6589 | 6.336 | 3.9501 | 0.0287 | 0.0164 | 0.0070 | 0.7257 / 0.7257 | 10.34 | 6.3454 |
| 1 | 0.0144 | 0.0067 | 0.0070 | 0.9619 / 0.9619 | 1.656 | 0.9797 | 0.0350 | 0.0204 | 0.0228 | 0.9873 / 0.9873 | 1.603 | 0.9360 |
| 2 | 0.0243 | 0.0112 | 0.0105 | 0.7861 / 0.7861 | 1.246 | 0.6379 | 0.0474 | 0.0272 | 0.0268 | 0.8055 / 0.8055 | 1.243 | 0.6327 |
| 3 | 0.0349 | 0.0163 | 0.0160 | 0.8048 / 0.8048 | 1.22 | 0.5091 | 0.0595 | 0.0345 | 0.0351 | 0.8177 / 0.8177 | 1.215 | 0.5105 |
| 4 | 0.0459 | 0.0216 | 0.0258 | 0.9055 / 0.9055 | 1.286 | 0.4352 | 0.0716 | 0.0412 | 0.0502 | 0.9105 / 0.9105 | 1.267 | 0.4392 |
| 5 | 0.0554 | 0.0255 | 0.0390 | 0.9820 / 0.9820 | 1.284 | 0.3825 | 0.0817 | 0.0455 | 0.0697 | 0.9836 / 0.9836 | 1.249 | 0.3894 |
| 6 | 0.0573 | 0.0267 | 0.0451 | 0.8805 / 0.8805 | 0.9799 | 0.3281 | 0.0821 | 0.0458 | 0.0764 | 0.8524 / 0.8524 | 0.943 | 0.3442 |
| 7 | 0.0091 | 0.0044 | 0.0487 | 0.0919 / 0.0919 | 0.1058 | 0.0603 | 0.0250 | 0.0146 | 0.0791 | 0.1701 / 0.1701 | 0.1943 | 0.1528 |
| 8 | 0.0753 | 0.0359 | 0.0591 | 0.9653 / 0.9653 | 1.381 | 0.2731 | 0.1012 | 0.0569 | 0.0915 | 0.9683 / 0.9683 | 1.284 | 0.2921 |
| 9 | 0.0937 | 0.0433 | 0.0728 | 0.9896 / 0.9896 | 2.449 | 0.2695 | 0.1208 | 0.0655 | 0.1038 | 0.9902 / 0.9902 | 2.218 | 0.2820 |
| 10 | 0.0647 | 0.0324 | 0.0855 | 0.6516 / 0.6516 | 1.417 | 0.2019 | 0.0860 | 0.0506 | 0.1075 | 0.6331 / 0.6331 | 1.297 | 0.2355 |
| 11 | 0.0731 | 0.0363 | 0.0912 | 0.9652 / 0.9652 | 1.359 | 0.1840 | 0.0973 | 0.0564 | 0.1279 | 0.8984 / 0.8984 | 1.223 | 0.2193 |
| 12 | 0.0763 | 0.0369 | 0.0776 | 0.5365 / 0.5365 | 1.492 | 0.1777 | 0.0995 | 0.0555 | 0.0777 | 0.5323 / 0.5323 | 1.307 | 0.2110 |
| 13 | 0.0842 | 0.0414 | 0.1114 | 0.6928 / 0.6928 | 1.239 | 0.1713 | 0.1076 | 0.0607 | 0.1477 | 0.6699 / 0.6699 | 1.04 | 0.2030 |
| 14 | 0.1337 | 0.0612 | 0.1059 | 0.5155 / 0.5155 | 1.184 | 0.2031 | 0.1363 | 0.0833 | 0.1227 | 0.3886 / 0.3886 | 0.7852 | 0.2192 |
| 15 | 0.0468 | 0.0243 | 0.1403 | 0.3704 / 0.3704 | 1.207 | 0.0915 | 0.0675 | 0.0404 | 0.1752 | 0.4049 / 0.4049 | 1.126 | 0.1387 |
| 16 | 0.0827 | 0.0420 | 0.0784 | 0.5334 / 0.5334 | 2.645 | 0.1331 | 0.1058 | 0.0619 | 0.0685 | 0.5349 / 0.5349 | 2.143 | 0.1692 |
| 17 | 0.1050 | 0.0572 | 0.1286 | 0.8219 / 0.8219 | 3.483 | 0.1495 | 0.1277 | 0.0786 | 0.1469 | 0.7837 / 0.7837 | 2.645 | 0.1777 |
| 18 | 0.1408 | 0.0712 | 0.0937 | 0.8156 / 0.8156 | 2.309 | 0.1645 | 0.1652 | 0.0936 | 0.0905 | 0.6256 / 0.6256 | 1.461 | 0.1848 |
| 19 | 0.0505 | 0.0290 | 0.1466 | 0.4137 / 0.4137 | 0.9987 | 0.0785 | 0.0712 | 0.0461 | 0.1724 | 0.4565 / 0.4565 | 0.7947 | 0.1211 |
| 20 | 0.0916 | 0.0546 | 0.1080 | 0.5313 / 0.5313 | 2.816 | 0.1236 | 0.1125 | 0.0747 | 0.0846 | 0.5318 / 0.5318 | 1.973 | 0.1544 |
| 21 | 0.0916 | 0.0576 | 0.1815 | 0.7894 / 0.7894 | 2.049 | 0.1158 | 0.1143 | 0.0795 | 0.2059 | 0.7722 / 0.7722 | 1.299 | 0.1477 |
| 22 | 0.0816 | 0.0506 | 0.1144 | 0.5022 / 0.5022 | 4.122 | 0.1018 | 0.1023 | 0.0701 | 0.1068 | 0.5078 / 0.5078 | 2.827 | 0.1352 |
| 23 | 0.1523 | 0.0950 | 0.1064 | 0.7768 / 0.7768 | 7.034 | 0.1474 | 0.1596 | 0.1166 | 0.1022 | 0.5618 / 0.5618 | 3.691 | 0.1647 |
| 24 | 0.0130 | 0.0086 | 0.1672 | 0.1358 / 0.1358 | 0.3242 | 0.0167 | 0.0466 | 0.0338 | 0.1843 | 0.2747 / 0.2747 | 0.4028 | 0.0704 |
| 25 | 0.0316 | 0.0201 | 0.1085 | 0.1925 / 0.1925 | 1.966 | 0.0391 | 0.0577 | 0.0389 | 0.0711 | 0.2728 / 0.2728 | 1.774 | 0.0823 |
| 26 | 0.1063 | 0.0700 | 0.0973 | 0.5560 / 0.5560 | 1.275 | 0.1089 | 0.1119 | 0.0861 | 0.0630 | 0.3805 / 0.3805 | 0.4376 | 0.1359 |
| 27 | 0.1168 | 0.0751 | 0.1547 | 0.8495 / 0.8495 | 7.737 | 0.1112 | 0.1406 | 0.0951 | 0.1636 | 0.8160 / 0.8160 | 4.088 | 0.1363 |
| 28 | 0.0604 | 0.0422 | 0.1410 | 0.4494 / 0.4494 | 5.62 | 0.0662 | 0.0821 | 0.0610 | 0.1359 | 0.4609 / 0.4609 | 3.424 | 0.1010 |
| 29 | 0.1265 | 0.0801 | 0.1057 | 0.6522 / 0.6522 | 5.928 | 0.1065 | 0.1466 | 0.0993 | 0.0868 | 0.4350 / 0.4350 | 2.233 | 0.1314 |
| 30 | 0.0570 | 0.0392 | 0.1461 | 0.5381 / 0.5381 | 7.947 | 0.0597 | 0.0830 | 0.0570 | 0.1493 | 0.5515 / 0.5515 | 4.459 | 0.0941 |
| 31 | 0.1357 | 0.0858 | 0.1168 | 0.9270 / 0.9270 | 16.01 | 0.1074 | 0.1631 | 0.1064 | 0.0760 | 0.8826 / 0.8826 | 7.615 | 0.1298 |
| 32 | 0.1331 | 0.0897 | 0.0942 | 0.7679 / 0.7679 | 8.699 | 0.1049 | 0.1576 | 0.1112 | 0.0582 | 0.7601 / 0.7601 | 3.791 | 0.1271 |
| 33 | 0.0938 | 0.0596 | 0.1043 | 0.4116 / 0.4116 | 4.284 | 0.0759 | 0.1129 | 0.0775 | 0.0722 | 0.2489 / 0.2489 | 1.394 | 0.1058 |
| 34 | 0.0973 | 0.0685 | 0.1324 | 0.4459 / 0.4459 | 7.183 | 0.0837 | 0.0898 | 0.0641 | 0.1212 | 0.2037 / 0.2037 | 1.768 | 0.1110 |
| 35 | 0.0613 | 0.0434 | 0.1799 | 0.4053 / 0.4053 | 13.28 | 0.0562 | 0.0853 | 0.0631 | 0.1882 | 0.4370 / 0.4370 | 6.544 | 0.0880 |
| 36 | 0.0176 | 0.0124 | 0.1275 | 0.0982 / 0.0982 | 1.954 | 0.0166 | 0.0526 | 0.0380 | 0.1066 | 0.2366 / 0.2366 | 1.541 | 0.0592 |
| 37 | 0.1590 | 0.1090 | 0.1104 | 0.7739 / 0.7738 | 21.96 | 0.1038 | 0.1733 | 0.1258 | 0.0662 | 0.5281 / 0.5280 | 6.206 | 0.1225 |
| 38 | 0.0414 | 0.0297 | 0.1443 | 0.4618 / 0.4618 | 4.191 | 0.0331 | 0.0721 | 0.0520 | 0.1182 | 0.4711 / 0.4711 | 1.657 | 0.0662 |
| 39 | 0.0923 | 0.0684 | 0.1445 | 0.5736 / 0.5735 | 8.664 | 0.0705 | 0.1193 | 0.0916 | 0.1175 | 0.3785 / 0.3784 | 2.594 | 0.0980 |
| 40 | 0.0895 | 0.0673 | 0.1544 | 0.5424 / 0.5426 | 16.74 | 0.0701 | 0.1137 | 0.0867 | 0.1384 | 0.4884 / 0.4884 | 5.417 | 0.0965 |
| 41 | 0.1083 | 0.0800 | 0.1190 | 0.6034 / 0.7245 | 48.57 | 0.0819 | 0.1328 | 0.0999 | 0.0750 | 0.6314 / 0.6313 | 15.89 | 0.1050 |
| 42 | 0.0809 | 0.0587 | 0.1479 | 0.5054 / 0.5056 | 20.19 | 0.0599 | 0.1088 | 0.0789 | 0.1245 | 0.3834 / 0.3828 | 5.113 | 0.0878 |
| 43 | 0.1222 | 0.0886 | 0.1226 | 0.4700 / 0.4702 | 18.7 | 0.0804 | 0.1117 | 0.0930 | 0.0727 | 0.2516 / 0.2518 | 3.351 | 0.1032 |
| 44 | 0.0588 | 0.0443 | 0.1468 | 0.5525 / 0.5518 | 15.5 | 0.0433 | 0.0902 | 0.0682 | 0.1222 | 0.2898 / 0.2902 | 3.55 | 0.0724 |
| 45 | 0.1448 | 0.0964 | 0.1581 | 0.5621 / 0.5628 | 33.9 | 0.0858 | 0.1730 | 0.1188 | 0.1259 | 0.4687 / 0.4694 | 8.749 | 0.1056 |
| 46 | 0.0715 | 0.0539 | 0.1389 | 0.5015 / 0.5015 | 13.85 | 0.0527 | 0.0949 | 0.0745 | 0.0884 | 0.2839 / 0.2851 | 2.996 | 0.0798 |
| 47 | 0.0684 | 0.0560 | 0.1451 | 0.4282 / 0.4092 | 43.6 | 0.0544 | 0.0894 | 0.0779 | 0.1264 | 0.4515 / 0.4388 | 12.74 | 0.0813 |
| 48 | 0.0209 | 0.0163 | 0.1492 | 0.1110 / 0.1203 | 5.72 | 0.0165 | 0.0576 | 0.0411 | 0.1290 | 0.2299 / 0.2321 | 1.099 | 0.0495 |
| 49 | 0.1058 | 0.0784 | 0.1418 | 0.6488 / 0.6435 | 78.14 | 0.0690 | 0.1299 | 0.0934 | 0.1073 | 0.3005 / 0.3043 | 10.55 | 0.0918 |
| 50 | 0.1234 | 0.0892 | 0.1237 | 0.5305 / 0.5224 | 15.91 | 0.0724 | 0.1323 | 0.0855 | 0.0742 | 0.2473 / 0.2420 | 1.235 | 0.0942 |
| 51 | 0.0888 | 0.0690 | 0.1514 | 0.6778 / 0.6705 | 67.9 | 0.0580 | 0.1151 | 0.0888 | 0.0961 | 0.2912 / 0.2854 | 9.44 | 0.0826 |
| 52 | 0.0374 | 0.0284 | 0.1257 | 0.2805 / 0.2973 | 6.763 | 0.0275 | 0.0664 | 0.0503 | 0.0762 | 0.1983 / 0.1888 | 0.6722 | 0.0562 |
| 53 | 0.0609 | 0.0541 | 0.1704 | 0.4342 / 0.4970 | 36.04 | 0.0435 | 0.0925 | 0.0781 | 0.1382 | 0.4661 / 0.5098 | 8.22 | 0.0698 |
| 54 | 0.0616 | 0.0839 | 0.1498 | 0.2217 / 0.7248 | 128.7 | 0.0667 | 0.0924 | 0.1052 | 0.1077 | 0.2955 / 0.7261 | 26.49 | 0.0881 |
| 55 | 0.1579 | 0.0947 | 0.1442 | 0.6587 / 0.6412 | 169.5 | 0.0699 | 0.1924 | 0.1172 | 0.0877 | 0.4936 / 0.5082 | 30.81 | 0.0903 |
| 56 | 0.0308 | 0.0150 | 0.1506 | 0.2281 / 0.1316 | 51.96 | 0.0129 | 0.0674 | 0.0408 | 0.0992 | 0.3490 / 0.2517 | 21.41 | 0.0421 |
| 57 | 0.0715 | 0.0373 | 0.1476 | 0.4210 / 0.2535 | 28.38 | 0.0311 | 0.0944 | 0.0603 | 0.0980 | 0.2826 / 0.3204 | 2.863 | 0.0580 |
| 58 | 0.0622 | 0.0266 | 0.1729 | 0.3641 / 0.1893 | 33.32 | 0.0234 | 0.0716 | 0.0493 | 0.1488 | 0.2055 / 0.2530 | 4.354 | 0.0515 |
| 59 | 0.0460 | 0.0840 | 0.1555 | 0.2724 / 0.5147 | 55.69 | 0.0590 | 0.0498 | 0.1069 | 0.0947 | 0.2264 / 0.3190 | 5.08 | 0.0808 |
| 60 | 0.0101 | 0.0941 | 0.1635 | 0.0676 / 0.4525 | 70.8 | 0.0656 | 0.0208 | 0.0943 | 0.1419 | 0.0888 / 0.2781 | 4.563 | 0.0857 |

## 8. Three weakest steps

1. **A3.** The large-u behaviour of `Phi_2 = H_(nu+1) g` for the eigenfunction is taken from the
   Mellin multiplier applied to the leading singular term, with the multiplier checked at one real
   point only. `Phi_2` was not computed for the eigenfunction. The signs of the N-coefficients
   (-0.128, -0.288, -0.500) depend on it. The non-vanishing of the boundary term does not.
2. **L1 on the singular eigenfunction.** `g ~ u^(nu/2 - 1)` is not integrable against the Bessel
   kernels at 0 for Re nu <= 0; `Phi_2`, `Phi_1'`, `Phi_2'` are defined by continuation in nu, and L1
   on [eps, R] is asserted through continuation of the two first-order relations. Numerical
   verification of L1 was done only for a decaying test function.
3. **Controls.** G_5 not run. The a-shift roots are from N = 28 double-precision determinants of
   mp-built matrices, not certified; the second branch changed root between a = 0.1 and 0.2; roots
   with Re b < 0 rely on mpmath's Hurwitz continuation. The link to Maass-Selberg is at the level of
   the flux coefficient only, not a term-by-term reduction.

Numerical note: mpmath `zeta(s, a)` with complex s and a of order 10^3 gave unstable results in
the tail of the large-u sum (`dbg.py`: values changed from 1e-7 to 1e35 with the truncation); it
was replaced by an Euler-Maclaurin routine `hz` (`common.py`), after which `Q(u)/u` matched the
prediction to 10 digits for u up to 10^4. The collocation matrices use a in [1, 2.7] and are
validated by the eigenvalue and channel-formula checks.

## Files

`common.py` (collocation, `psi`, `Wg_over`, `hz`), `t1.py`/`t1.log` (first test), `t2.py`/`t2.log`
(L1 on generic g, multiplier), `t2c.log`, `t2d.py`/`t2d.log` (asymptotics), `t3.py`/`t3a.log`/`t3b.log` (N = 36), `t3c.log`/`t3d.log` (N = 64), `t6.py`, `t7.py` (convergence), `sigma_table.md`
(sigma_min), `t4.py`/`t4.log` (controls), `t5.py`/`t5.log` (channel formula), `dbg.py`.
