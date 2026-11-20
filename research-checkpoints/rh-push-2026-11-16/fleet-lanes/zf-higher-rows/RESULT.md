# zf-higher-rows: the 7/8 architecture at every row order r (2026-11-16)

Internal working note. Nothing committed or pushed. Files in this directory only:
`ledger_check.py` (identity check, passes), `models.py` + `models.log`, `finegrid.log`.

Labels: PROVED (complete argument here) / CLASSICAL (cited theorem) / PROVED-rel X / MODEL (exponent bookkeeping
inherited from the campaign scripts; exact or numerical inside the model) / RECALLED (literature, not re-read) / OPEN.

**Verdict: precise obstruction.** No row order and no mixture of orders gives an abscissa below
B_XS = 17497733/20000000 = 0.87488665. No new zero-free region is claimed. 7/8 (unrefereed manuscript) stands; RH open.

---

## 1. Plan: what is new relative to the atlas and the campaign

Already on file (not repeated): atlas section 10 (PR #14, sixth-phase filter), `beat78-amplifier.md` Lemma C1/C2 (k = 6 is the
only degree compatible with cubic/quadratic targets; density table at hypothetical a = 2), `zf-campaign-quartic-gl2.md`
(quartic ledger, Framework A ceiling 1 - 1/(2k)), `cubic-r2-conductor-verdict.md` (cubic rows: a = 4).

New here:

1. **Theorem 1 (absorption at every order).** One identity, valid for every row order r >= 3, identifies the dual of the
   Moebius-twisted order-r family: it is the Gauss-sum family of the character chi*rho (rho quadratic). Its order is
   nu(r) = r if 4 | r, r/2 if r = 2 mod 4, 2r if r odd. This covers odd r (previously "mu not absorbed"), and gives the
   index exponent in each case.
2. **Theorem 2 (involution).** r -> nu(r) is an involution. The reflection of an order-r probe lives on the nu(r)-fold
   cover; its exceptional term lives on the r-fold cover. The pair (3, 6) is swapped: the sextic architecture has an
   evaluable dual (order 3) and an unevaluable exceptional term (order 6, TRO6); the cubic lever has the reverse.
   TRO6-natural and the cubic lever's R2 object are the same 6-fold Kubota object.
3. **Formula 3.** sigma0 and the exceptional term at every order, and the exact reason the quartic tied.
4. **Theorem 4 (mixtures).** A mixture of orders is never better than its lowest-order component.
5. **Classification (section 6).** Table for r = 3, 4, 5, 6, 8, 10, 12 and the general statement.

Walls: this is an Euler-product argument throughout (section 7 states where; it fails for DH as required). It does not
touch flow-blindness, MV-CAP or verified height: the output is an obstruction, not a bound.

---

## 2. Theorem 1: Moebius absorption is multiplication by the quadratic character

Setting: K contains mu_r and (for odd r) is any field containing Q(zeta_r); pi a prime of K prime to 2r; chi = chi_pi the
order-r residue character of the residue field F_q; rho the quadratic character of F_q; g(psi) = sum psi(x) e(Tr x / p);
g(psi; h) = sum psi(x) e(Tr(hx)/p) = conj(psi(h)) g(psi); sigma = +-1.

**Theorem 1.** For r >= 3:

(a) [PROVED] mu(pi) g(chi^sigma) = (-J(chi^sigma, rho)) * g(chi^sigma rho) / g(rho).

(b) [CLASSICAL, Weil 1952] pi -> -J(chi_pi^sigma, rho_pi) is the value of a Hecke Groessencharacter of K. [CLASSICAL]
g(rho) is sqrt(N pi) times a periodic sign (Hecke's quadratic Gauss sum theorem).

(c) [PROVED] ord(chi^sigma rho) = nu(r), with nu(r) = r (4 | r), r/2 (r = 2 mod 4), 2r (r odd). So nu(r) = 3 iff r = 6.

(d) [PROVED] Index. With the frequency h of the Poisson dual, g(chi^sigma; h) = c * g(chi^sigma rho; h^e) * t(h), where c is
the h = 1 ratio and
  * 4 | r: e = 1 + r/2, t = 1 (r-fold Kubota series at index h^(1+r/2));
  * r odd: e = r + 1, t = 1 (2r-fold Kubota series at index h^(r+1));
  * r = 2 mod 4: e = 1, t(h) = rho(h) (order-r/2 Gauss sums at index h, with a residual quadratic twist; no choice of e
    removes it, by parity).

(e) [PROVED] Uniqueness. Among characters psi in <chi, rho>, g(psi)/(mu g(chi^sigma)) can lie in K times a power of
g(rho) only for psi = chi^sigma (ratio mu, not Hecke times periodic) or psi = chi^sigma rho.

*Proof.* (a): g(chi^sigma) g(rho) = J(chi^sigma, rho) g(chi^sigma rho) since chi^sigma rho is nontrivial for r >= 3;
mu(pi) = -1. (c): for r = 2s, chi rho = chi^(1+s), of order 2s/gcd(2s, 1+s), and gcd(2s, 1+s) = gcd(2, 1+s). For r odd the
orders r and 2 are coprime. (d): compare conj(chi^sigma(h)) with conj((chi^sigma rho)(h^e)); for 4 | r, (1+r/2)^2 = 1 mod r;
for r odd write chi = omega^2 with omega of order 2r, then (2 sigma + r)(r+1) = 2 sigma mod 2r; for r = 2s with s odd,
chi^sigma rho = chi^(sigma+s) has even exponent, so its values at h are squares in mu_r and cannot equal chi(h)^(-sigma).
(e): the automorphism zeta_p -> zeta_p^b multiplies g(psi) by conj(psi(b)); equality of weights modulo <rho> forces
psi in {chi^sigma, chi^sigma rho}. Composite squarefree moduli follow by CRT: both sides of (a) have the same twisted
multiplicativity (bilinear twist (chi_a(b) chi_b(a))^sigma). QED

Numerical check [MEASURED]: `ledger_check.py`, r in {3,4,5,6,7,8,9,10,12,14,16,18,20,24}, 4-6 primes each, (a) and (d) to
<= 1.7e-14, (c) exact.

Consistency with files: r = 6 gives the manuscript's (4.5) (cubic gamma_2); r = 4 gives Lemma Q3 (index h^3);
r = 3 gives the cubic lever's "6-fold cover, index class y^4" (verdict note section 1). These three were found separately;
Theorem 1 is the common statement and adds r = 5, 8, 10, 12 and all others.

## 3. Theorem 2: the involution, and where each order's two objects live

**Theorem 2 [PROVED].** nu(nu(r)) = r for every r >= 3 (multiplying by rho twice). Orders with 4 | r are fixed; the others
are paired r <-> 2r for odd r: (3, 6), (5, 10), (7, 14), (9, 18).

For an order-r probe of the 7/8 type (additive polynomials A_m = sum_s c(s) g_r(-m, s), manuscript Lemma 6.2 with 6 -> r,
paired with completed rows B_m whose coefficients are the absorbed class):

* the **reflected side** B_m carries order-nu(r) Gauss sums;
* the **additive side** A_m is a partial sum of the r-fold Kubota series at index m; its exceptional frequencies are the
  coset e0 t^r a^r, and its value there is a first moment of order-r Gauss sums (governed by the theta function of the
  r-fold cover of GL(2)).

A Patterson-type evaluation at squarefree indices exists only on the 3-fold cover [CLASSICAL: Patterson 1977; RECALLED:
Kazhdan-Patterson non-uniqueness for n >= 4 on GL(2)]. So:

| r | reflected side (order nu) | exceptional side (order r) |
|---|---|---|
| 6 | 3: evaluable, GL(2) theta, a = 2 | 6: not evaluable (this is TRO6-natural) |
| 3 | 6: not evaluable, a = 4 | 3: evaluable |
| 4, 8, 12, ... | r: not evaluable | r: not evaluable (same cover) |
| 5, 10 and other pairs | 10 / 5: not evaluable | 5 / 10: not evaluable |

No order has both sides on the 3-fold cover, because nu(r) = r only when 4 | r. **Corollary:** the loss of the sextic
architecture (TRO6-natural) and the failure of the cubic lever (R2 at a = 4) are one object, the 6-fold Kubota series,
appearing on opposite sides of the probe.

## 4. Formula 3: sigma0 and the exceptional term at order r

With lx, ly, ell as in manuscript Def. 10.1, M = lx + ly, b = ly - lx, h = 1 - lx + ell:

* signal: residue of zeta_F(rz) at z = 1/r, exponent C(s) = s - 1 + lx/2 + h/r;
* exceptional term: frequencies e0 t^r a^r, count K^(1/r), factor P_a^(1/r), low exponent lx/2 + b/(2r);
* crossing:

  **sigma0(r) = (1 - 1/r) + (M - 2 ell)/(2r)**  (r = 6: 5/6 + (M - 2 ell)/12).

Status: [PROVED-rel] the manuscript's displayed formulas at r = 6; at other r it is the transcription 6 -> r of the three
places where sixth powers enter (pole, coset count, row slope), valid only if the reflected energy is at its optimal
level, which needs dual exponent a = 2 [MODEL for r != 6].

* On L1 (M + ell = 1): sigma0 = 1 - (1 + 3 ell)/(2r) = 1 - 1/(2 r_eff), **r_eff = r/(1 + 3 ell)**.
* Filter constant on the exceptional coset [PROVED, exact]: A(e0) = r/((r-1)d) - 1/(r-1), d = Kummer order of e0
  (r = 6: 1, 2/5, 1/5, 0; r = 4: 1, 1/3, 0; r = 8: 1, 3/7, 1/7, 0; r = 12: 1, 5/11, 3/11, 2/11, 1/11, 0). Never removable
  (Lemma P of the quartic note holds for all r).
* Low-side cap from L1 and L2 alone (a = 2): sigma0 >= 1 - 4/(5r) [MODEL; exact at r = 6: 13/15].

**Why the quartic tied [EXACT].** Three abscissae equal 7/8 because all three have effective order 4:
  * sextic Part II: r_eff = 6/(1 + 3/6) = 4;
  * quartic Part I with a hypothetical a = 2: r_eff = 4/(1 + 0) = 4;
  * cubic Framework A at its true a = 4: lambda* = 3/4, 1 - lambda*/(2*3) = 7/8, i.e. 3/(3/4) = 4.
The quartic tie was a Part-I-versus-Part-II comparison at a hypothetical a = 2. At its actual dual (index h^3 on the
4-fold cover, a = 3) the quartic does not tie: Framework A gives 8/9 (c = 1/2) and nothing (c = 2/3).
Xu-Sang corresponds to r_eff = 3.996376; beating it needs r_eff < 3.996376.

## 5. Theorem 4: mixtures

**Theorem 4 [PROVED].**
(i) Union of families. If family i has amplifier set of size N_i and mean-square bound B_i, any combination of the
amplifier inequalities gives an upper bound for |A_1| that is no smaller than min_i (B_i/N_i)^(1/2): for weights
w_i >= 0, the bound is sum_i w_i (N_i B_i)^(1/2) / sum_i w_i N_i >= min_i (B_i/N_i)^(1/2) (mediant inequality).
(ii) Product families. For rows (u_1, ..., u_j) with character prod chi^(r_i)(u_i) and N(u_i) <= H_i, the trivialising rows
number <= prod H_i^(1/r_i) up to logs (solve the valuation congruence prime by prime), so the gain is at most
H^(1/min r_i) with H = prod H_i.
(iii) Larger cyclotomic fields. Over K containing zeta_n, the available row orders are the divisors of n (times 2); the
density of r-th powers in norm balls is H^(1/r) in every field.
Hence the abscissa of a mixture is >= the minimum over its pure orders. QED

## 6. Classification

a = dual-length exponent of the absorbed dual (length N(h)^a/D). Rule used [PROVED-rel the Kubota functional equation in
the form of verdict note section 2.3-2.4: class e reflects to length exponent e]: a = 1 + r/2 (4 | r), a = r + 1 (r odd),
a = 2 for r = 6 [manuscript Prop 5.1]. For r = 10, 14, ... no functional equation is known; a = 2 is used as the floor.

| r | density | nu(r) | home of dual | a | Framework A, c = 1/2 / c = 2/3 | Framework B model, actual a | Framework B, hypothetical a = 2 |
|---|---|---|---|---|---|---|---|
| 3 | 1/3 | 6 | 6-fold Kubota, index h^4 | 4 | 7/8 / 1 | 1.046 | 0.74283 |
| 4 | 1/4 | 4 | 4-fold Kubota, index h^3 | 3 | 8/9 / >= 1 | 1.028 | 0.80986 |
| 5 | 1/5 | 10 | 10-fold Kubota, index h^6 | 6 | 11/12 / >= 1 | > 1 | 0.84917 |
| **6** | 1/6 | **3** | cubic theta on GL(2) | **2** | 11/12 / 71/72 | **0.87496** (paper: 7/8) | same |
| 8 | 1/8 | 8 | 8-fold Kubota, index h^5 | 5 | 33/35 / >= 1 | > 1 | 0.90678 |
| 10 | 1/10 | 5 | none known | >= 2 | 19/20 / >= 1 | 0.92568 | same |
| 12 | 1/12 | 12 | 12-fold Kubota, index h^7 | 7 | 0.96104 / >= 1 | > 1 | 0.93820 |

All entries MODEL (scripts `models.py`; r = 6, a = 2 reproduces the campaign's 0.87496 and 11/12; r = 3 reproduces the
verdict's 7/8 and 1.046; r = 3, 4, 5 at a = 2 reproduce `beat78-amplifier.md` section 6).

**General statement.**

* (G1) [PROVED inside model A-V] theta_A(r, a, c) >= max(1 - lambda/(2r), 1/2 + lambda(1 - 1/r)/2) >= 1 - 1/(2r) for
  every a, c, lambda. So Framework A is >= 7/8 for every r >= 4, and equals 7/8 at r = 3 (a = 4).
* (G2) [MODEL] Framework B with a = 2: sigma0 >= 1 - 4/(5r) > 0.8857 for r >= 7. So r >= 7 is excluded at any a,
  including r = 8, 10, 12 and every mixed order with all components >= 7.
* (G3) [PROVED-rel Theorem 1 + the a-rule] r in {3, 4, 5} has a in {4, 3, 6}; the model value is trivial (> 1).
* (G4) [PROVED, Theorem 1(c)] a = 2 through a GL(2) theta needs nu(r) = 3, i.e. r = 6.
* (G5) [Theorem 4] mixtures reduce to pure orders.

So an abscissa below 0.87488665 from this architecture needs an order r <= 5 with a = 2, i.e. a degree-2 reflection for
Gauss sums of order 6 (r = 3), 4 (r = 4) or 10 (r = 5). None exists; for orders 6 and 4 the existing functional equation
has a = 4 and 3. The sextic order is the unique point where the architecture is non-trivial, and it is capped at
0.87496 (paper system) / 0.874886647 (Xu-Sang system).

## 7. DH control

The Euler product is used at one identifiable step, Theorem 1(a): mu(pi) = -1 is cancelled against the sign of the
Jacobi sum prime by prime, which turns "coefficients of 1/L(s, eta)" (mu times a Hecke character, a multiplicative
function) into Gauss sums of chi*rho, and back. It is used again in the row factorisation into quotients of Hecke
L-functions (manuscript (7.13)). For Davenport-Heilbronn, 1/f has no Dirichlet coefficients of the form mu(n) eta(n);
no row of the Poisson expansion contains 1/f; the principal residue produces 1/L(s, chi) and 1/L(s, chi-bar) separately.
The architecture says nothing about zeros of the linear combination, as required. Since this note proves an obstruction
and no zero-free statement, there is no claim that could be wrongly transferred to DH.

## 8. Verdict

* PROVED: Theorem 1 (absorbed dual at every order, nu(r), index exponents), Theorem 2 (involution; TRO6 = cubic R2
  object), Theorem 4 (mixtures), the filter constants, G1, G4.
* MEASURED: Theorem 1 identities to 1.7e-14 at 14 orders.
* MODEL: sigma0(r) = (1 - 1/r) + (M - 2 ell)/(2r) and exceptional term P_a^(1/r) for r != 6; the table; G2, G3.
* OPEN: everything about the actual abscissa. A failed sufficient architecture is not a lower bound on the truth
  (atlas section 9).

Angle status: closed as a route below 7/8. No pivot taken: the only adjacent idea found (Theorem 2's 3 <-> 6 swap) leads
back to TRO6-natural, which sibling work already owns.

## 9. Three weakest steps

1. **The a-rule for r != 3, 6.** a = 1 + r/2 and a = r + 1 come from Theorem 1(d) (proved) fed into the Kubota functional
   equation in the Brubaker-Bump form, which assumes mu_2n in K (verdict note, "hypothesis gap"). Over Q(zeta_8) (r = 4)
   and Q(zeta_20) (r = 5) the hypothesis holds; over Q(i) and Q(zeta_5) it does not. Squarefree/coprimality stripping
   and the secondary pieces were not redone for n = 4, 8, 10, 12.
2. **Framework B at r != 6 is a transplant.** L2, the penalty T_d = aM + (a-1) ell - 1, the capacity 2/(r kappa) and the
   endgame row counts are the sextic manuscript's formulas with 6 -> r. None was derived for another order. G2 and the
   "hypothetical a = 2" column rest on this.
3. **Non-existence of an a = 2 reflection for orders 4, 6, 10** is literature-level (Kazhdan-Patterson non-uniqueness,
   Suzuki, Eckhardt-Patterson; recalled, not re-read), not a theorem here. Theorem 1(e) only excludes other Gauss-sum
   families, not every automorphic realisation.
