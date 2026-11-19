# REFEREE (independent adversarial pass, lens: general) for c14-laxphillips-hecke-norm-outside-l2/RESULT.md

Date: 2026-11-19. Independent of the lane's agent. The same-agent audit that was in this file before is kept
verbatim in the appendix; it does not count as a referee pass. This pass counts as one.
Claimed verdict: precise-obstruction. Claimed flags: R1 = R2 = R3 = R4 = false. No statement about zeros of zeta.

## Outcome

**The verdict holds, with the corrections below.** Every step labelled PROVED (H1, H2, H3, L, L1, L2, E, O) was
re-derived and is correct as a statement about the object it names. Lemma Q is correct after a typing repair
(item 2). Seven items are recorded; items 1, 2 and 5 require wording changes in the RESULT and in the proposed map
row; none reverses a conclusion. No error was found that turns the obstruction into a positive claim, and no
statement about zeros is made.

Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.

## Re-derivation of the PROVED steps

**H1 (confirmed).** With `T_n = n^(-1/2) sum f((az+b)/d)` the weight-0 rule is `T_m T_n = sum over d | (m,n) of T_(mn/d^2)`.
`lambda_theta` satisfies the same rule (it is a Laurent-polynomial identity in `p^nu`, prime by prime) and is
positive for real theta. Triangle inequality gives the lemma for any seminorm `N_0` for which the `T_n f` are
defined.

**H2 (confirmed).** `abs(lambda_mu(n)) <= lambda_(Re mu)(n) = lambda_a(n)` termwise; `lambda_a(n) = sum cosh(a log(d/d'))`
is increasing in a >= 0; n = 1 gives the value 1. For `a > theta >= 0`: `p^(2 mu) != 1`, the geometric-sum formula
applies, numerator at least `p^((k+1)a) - p^(-(k+1)a)`, denominator at most `p^a + p^-a`, weight at most
`(k+1) p^(k theta)`; the quotient is unbounded in k. The translation `a <= theta iff beta >= 1 - 2 theta` uses
`a = (1 - beta)/2` with `w = 1 - rho/2`, which is right: `phi(s) = xi*(2s-1)/xi*(2s)` vanishes at `2w - 1 = 1 - rho`.

**H3 (confirmed).** One line, needs commutation on the domain of `N_0`.

**Theorem L (confirmed as stated; scope limit in item 1).** `abs(E(z,w)) >= y^(Re w)/2` for `y > A` at a zero of
phi (zero mode exactly `y^w`, other modes exponentially small); `1 <= 2 abs(f_rho) + 1_(y <= A)` on F; solidity
gives 1 in X. Kernel of `T_p` positive, `T_p 1 = p^(-1/2)(p+1)`. Sub-solution: for z in F,
`T_p ht^(s')(z) >= p^(-1/2)((py)^(s') + p (y/p)^(s')) = lambda_(s'-1/2)(p) y^(s')`, both sides Gamma-invariant.
Monotone norm gives `N(T^k u) >= c^k N(u)`.

**Lemma E (confirmed for 1 <= q < 2).** Cusp integrability `integral of y^(q Re w' - 2) dy`; no pole of E in
`1/2 < Re w' < 1`. The spectral radius is at least the supremum of `abs(lambda_nu(p))` over the open strip, which
is `lambda_(1/q-1/2)(p)` (not attained), and `1/q - 1/2 > a`.

**Lemma O (confirmed).** Recomputed `a_0(T_p f)(y) = p^(-1/2) a_0(py) + p^(1/2) a_0(y/p)` from the definition
(the p translates give `p a_0(y/p)`); on `y^s` it returns `lambda_(s-1/2)(p) y^s`. Membership: zero mode
`y^(w') + phi(w') y^(1-w')` on all y > 0. Trivial exceptions not stated: `E(., 1/2)` is identically 0, and E is
undefined at the poles `w' = rho/2`.

**Section 6, classical statements.** Exponents `1 - Re(rho)/2` from the poles of `<f, E(., s)>` at `s = rho/2`;
rate `3/4 - eps` for all smooth compactly supported f is Zagier's criterion (1981), equivalent to RH; this is
recalled correctly and labelled CLASSICAL. Nothing new is claimed there.

## Errors and limits found

1. **Theorem L / Corollary L1: the reading "0 <= beta <= 1 and nothing else" is proved for the operator norm on
   the whole space X only.** A device can restrict to a closed `T_p`-invariant subspace that omits the constants.
   The resonance state lies in one: for `1/2 < Re w < 1`, `E(., w)` is integrable with integral zero (Green's
   formula on the truncated domain: the boundary term is `w Y^(w-1) + phi(w)(1-w) Y^(-w) -> 0`), so
   `f_rho` is in `X_0 = {f in X: integral f = 0}` when X is inside `L^1`, and `T_p` preserves `X_0`. Theorem L
   says nothing about `||T_p | X_0||`. **Repair (derived in this pass):** a solid X containing `f_rho` contains
   `1 + ht^(Re w)` (from `ht^(Re w) <= 2 abs(f_rho) + C 1_(y <= A)`), hence every `E(., w')` with
   `1/2 < Re w' <= Re w`, because `abs(E(z, w')) <= C(1 + ht(z)^(Re w'))`. These lie in `X_0` and are
   `T_p`-eigenfunctions, so the spectral radius of `T_p` on `X_0` is at least `lambda_a(p) >= abs(lambda_mu(p))`.
   So on the mean-zero subspace the correct statement is the one of Lemma E for every solid X: admissibility
   implies the eigenvalue bound, by EIS-w. The obstruction stands; the wording of claim (a) and of Corollary L1
   should be "the full-space operator norm reads `0 <= beta <= 1` only; on the mean-zero subspace the bound is
   implied by admissibility". Smaller invariant subspaces (down to the line spanned by `f_rho`, where the norm of
   `T_p` equals `abs(lambda_mu(p))` trivially) are not classified by any statement in the RESULT.

2. **Lemma Q: type mismatch.** `U(t)` acts on Cauchy data pairs, `N_0` on functions; `N_0(U(t) f)` and `G_theta`
   are not defined as written. The identity that holds on functions is
   `T_n = sum over dd' = n of cosh(log(d/d') sqrt(L))`, `L = Delta + 1/4` (pair d with d'; this is c4 Lemma 1 in
   its diagonal form). With `G_theta(f) = sup_t e^(-theta abs(t)) N_0(cosh(t sqrt L) f)` the proof goes through
   with the same constant 2. The inequality is one-directional and holds only for f in the Eisenstein channel on
   which the functional calculus is defined in `N_0`; for the non-L2 eigenfunctions it is the scalar identity.
   The label PROVED-rel is appropriate after this repair. The claim that `T_n^w` obeys the Hecke rule for every
   one-parameter group is correct (checked below on a non-normal generator).

3. **"MEASURED: ratio at most 0.989" is case-dependent.** `sum e^(theta abs(log(d/d')))/(2 lambda_theta(n))` is
   below 1 always and tends to 1 (n prime, n large): this pass finds 0.99990 at n = 9973, theta = 0.499. The
   inequality is unaffected.

4. **Part (iii) of the decisive test is ARGUED, not proved,** as the RESULT says. The sentence "the growth bound
   is equivalent to the conclusion" is therefore established for the four named families (H2 by definition; L and E
   by admissibility; Q by domination), not for Setting I gauges in general and not for arbitrary norms. The
   one-line claim and the map row must keep the restriction "for these families".

5. **Factual error: BLS is defined in the map.** `OBSTRUCTION_MAP.md` section 2 defines control BLS
   (scattering-level Blaschke control, `c13-kacmoody-eisenstein-affine-weyl-shift`, row D9):
   `M_B(z) = [xi(z)/xi(z+1)]` times a finite Blaschke product, with Maass-Selberg positivity. The RESULT states
   twice that the code is not defined. The lane's reading (inner factors moved inside the scattering coefficient)
   agrees with the map's object in substance, and "passes" is the right outcome for Setting I, but the row was run
   as an argument at model level, not against `M_B` itself.

6. **Unsupported sentence in section 5.** "`r(T_p | L^q_0) <= lambda_(theta_q)(p)` by interpolation ... lands on
   the admissibility threshold from above" is not derived, and plain Riesz-Thorin between `L^1` (norm
   `lambda_(1/2)(p)`) and `L^2` (norm 2) gives `lambda_(1/2)(p)^(2 theta_q) 2^(1 - 2 theta_q)`, which is larger
   than `lambda_(theta_q)(p)` (log-convexity of cosh). The sentence is not used; it should be marked OPEN or
   removed.

7. **Run incident (process, not mathematics).** The lane's first run overwrote the untracked file `checks.json`
   in the repository root, outside the lane's write area. Confirmed: the root file is byte-identical to the lane's
   `checks.json` (cmp). This referee did not touch it. The main session should decide whether to remove it.

## Numeric rerun on different cases

Script and log: `/tmp/c14ref/rc.py`, `/tmp/c14ref/rc.log` (not written into the lane; mpmath 30 digits, run through
`scripts/memcap.sh 8`, under 1 minute, local; consistency checks, not certified).

| check | case (different from the lane's) | result |
|---|---|---|
| H2, direct sup over n <= 3000 (not a product of local sups), `mu = +a + i gamma_3/2` | a = theta = 0.30; a = theta = 0.25; a = theta = 0 | 1.000 (argmax n = 1) |
| H2, divergence along `2^k`, k = 50, 200, 800 | a = 0.30, theta = 0.29 | 0.40, 1.14, 72.7 |
| | a = 0.12, theta = 0.05 | 0.61, 862, 3.8e15 |
| Theorem L sub-solution | p = 11, 13; s' = 0, 0.6, 2; y up to 20; 240 points | min ratio 1 - 4e-31 |
| Lemma O zero mode at y = 0.2, 128 nodes | resonance of rho_3 (`abs(phi) = 1e-30`) | `abs(a_0 - y^w) = 6e-31` |
| | off resonance `w' = 0.66 - 11.3i` (`abs(phi) = 0.828`) | 0.47902 = `abs(phi y^(1-w'))` |
| Q inequality | n = 2, 49, 720, 5040, 9973; theta = 0.01, 0.33, 0.499 | max ratio 0.99990 (below 1) |

The slow onset at a = 0.30, theta = 0.29 (ratio below 1 until k near 200) shows that a finite sweep cannot read
the threshold; the lemma, not the numerics, carries H2.

## Controls run by this referee

- **EIS-w.** `T_5 E = lambda_(w-1/2)(5) E` at `z = -0.33 + 1.1i`: relative deviation 4e-31 at the rho_3 resonance
  and 5e-30 at the off-resonance point `w' = 0.66 - 11.3i`. The off-resonance series is a joint eigenfunction
  with the same membership in solid X, in `L^q` and in `X_theta` (H2 depends on `Re w'` only). EIS-w passes
  families 1, 2, 4, as claimed, and by item 1 it also passes the mean-zero refinement of family 1. It fails only
  at membership in `Y_out` (Lemma O, checked above), where the remaining statement is Zagier's criterion.
- **Abstract one-parameter group.** `U(t) = exp(tA)` with A a random non-normal complex 4 by 4 matrix,
  `T_n^w = sum over dd' = n of U(log(d/d'))`: `T_m^w T_n^w = sum over d | (m,n) of T^w_(mn/d^2)` to 2e-29 on
  (4,6), (12,18), (9,27), (10,15). H1 and H2 then hold verbatim with eigenvalues of A anywhere. The step that
  consumes the Hecke rule does not distinguish zeta: confirmed.
- DH, backward heat, sign twist, unimodular twist, `zeta(s+a) zeta(s-a)`, Beurling, phase-rotated transfer
  operator, `theta^w`: no zeta-only mechanism is claimed, so there is no step for them to break. Not run, as in
  the RESULT. T-NR and E_a are argued at model level only in the RESULT; not rerun here.

## Checks requested by the task

- RH assumed: no. Low zeros are sample parameters; no step uses `beta = 1/2`.
- Verified height restated as a result: no.
- Known theorem presented as new: no. H1 to H3, L, E, O are elementary and are not presented as new theorems
  about zeta; Zagier's criterion, Sarnak's rate and the non-existence of positive eigenfunctions above the bottom
  of the spectrum are labelled CLASSICAL.
- Statement about zeros of zeta: none.

## Requirement flags (strict)

- R1 = false. Multiplicativity enters H1 only, as an identity every one-parameter group satisfies (control above).
- R2 = false. No conclusion about zeros in any window.
- R3 = false. EIS-w and the abstract triple pass every proved inequality.
- R4 = false. Nothing reaches the line; the statements that would are the conclusion (H2 at theta = 1/4) or
  Zagier's criterion.

## Surviving claim

No statement about zeros of zeta. For four families of norms on Eisenstein resonance states of the modular
surface the eigenvalue bound obtainable is either the definition of the space or implied by admissibility:
(a) in a solid space X containing a resonance state and the bounded compactly supported functions, X contains the
constants and `||T_p^k||_X >= (p^(1/2) + p^(-1/2))^k`, and on the mean-zero subspace the off-resonance Eisenstein
series with `1/2 < Re w' <= Re w` give spectral radius at least `p^a + p^-a` (added by this referee; needed to
close the mean-zero escape); (b) the Hecke-sup norm satisfies `N(T_m f) <= lambda_theta(m) N(f)`, is finite on a
joint eigenvector iff `abs(Re mu) <= theta`, and on the Eisenstein channel is at most twice
`sup_t e^(-theta abs(t)) N_0(cosh(t sqrt(Delta + 1/4)) f)`, a construction available for every one-parameter
group; (c) in `L^q`, 1 <= q < 2, admissibility `q < 1/(1/2 + a)` implies the bound; (d) the Hecke-invariant space
with zero mode `O(y^(1/2+delta))` as `y -> 0` contains `E(., w)`, `Re w > 1/2`, exactly when `phi(w) = 0`, and the
rate statement on it is Zagier's criterion (classical). Not established: the same conclusion for Setting I gauges
in general (argued only), for norms outside these families, and for arbitrary invariant subspaces. Checks are
30-digit consistency runs, not certified.

---

## Appendix: previous content of this file (same-agent audit, verbatim, not a referee pass)

### REFEREE (same-agent audit, lens: general) for c14-laxphillips-hecke-norm-outside-l2/RESULT.md

Date: 2026-11-19. Written by the lane's own agent after a second derivation and a second run on different cases.
It is not an independent referee pass and does not count towards "three referees hold". Claimed verdict:
precise-obstruction. Claimed flags: R1 = R2 = R3 = R4 = false. No statement about zeros of zeta is made.

#### Outcome

The verdict holds on re-derivation. Five limits are recorded; none changes a conclusion.

#### Re-derivation

**H1.** With `T_n = n^(-1/2) sum f((az+b)/d)` the rule is `T_m T_n = sum over d | (m,n) of T_(mn/d^2)` (the factor d
of the unnormalised rule is absorbed). `lambda_theta` obeys it because it is the eigencharacter of `E(., 1/2 + theta)`;
checked numerically on six pairs including non-coprime ones (5e-29). The proof needs only the triangle inequality.
Holds for any seminorm `N_0`.

**H2.** `abs(lambda_mu(n)) <= lambda_a(n)`: termwise. `lambda_a(n) = sum over dd' = n of cosh(a log(d/d'))` after
pairing d with d': increasing in a >= 0. Divergence for a > theta: `p^mu != p^-mu` because `a > 0`. Random test,
300 triples (mu, theta, n): 0 violations (`ref_checks.json` R2). Holds.
Limit 1: for `a = theta` the supremum is 1, so the closed condition `a <= theta` is the exact threshold; the
RESULT states it this way.

**H3.** One line; needs commutation on the space where `N_0` is defined, which is Setting II. In Setting I it is
not available (c4 Lemma 2). Holds.

**Q.** `prod over p^k || n of (sum_j U((k-2j) log p)) = sum over dd' = n of U(log(d/d'))`: expand the product.
`sum over dd' = n of e^(theta abs(log(d/d')))  <= 2 lambda_theta(n)`: termwise; maximum ratio 0.989 on 24 cases
(R1). Limit 2: the inequality is one-directional (`N_theta <= 2 G_theta`). The converse (control of a single
`U(t) f` by the Hecke sums) is not proved and not used; the claim "the Hecke-sup norm is a wave-group norm" means
"is defined from the wave group and dominated by its two-sided growth norm", not norm equivalence.

**Theorem L.** Solid + bounded compactly supported functions + `f_rho` in X gives 1 in X: needs
`abs(E(z, w)) >= y^(Re w)/2` for `y > A`, true since the non-zero modes are `O(e^(-2 pi y) y^c)` and the zero mode
is `y^w` exactly at a zero of phi. Positivity of the kernel and `T_p 1 = (p^(1/2) + p^(-1/2)) 1`: direct count
(p + 1 terms, factor `p^(-1/2)`). Sub-solution: for z in F, `ht(pz) >= Im(pz)` and `ht((z+b)/p) >= y/p` since ht
is the maximal imaginary part in the orbit (CLASSICAL property of the fundamental domain). 1200 random points:
minimum ratio 1.000; second run with a different seed and a concrete solid norm: sampled ratios 2.03 to 6.33 at
`s' = 3/4`, minimum equal to `lambda_(1/4)(p)` for p = 2, 3 (R3). Holds.
Limit 3: Theorem L bounds the operator norm and spectral radius from below. It shows that the norm inequality
`abs(eigenvalue) <= ||T_p||` cannot give more than `abs(Re mu) <= 1/2`; it does not show that no other argument
inside a solid space reads the location.

**Lemma E.** Integrability exponent: `integral of y^(q Re w' - 2) dy` converges at infinity iff `q Re w' < 1`. Holds.
Limit 4: "point spectrum" is in the sense of eigenfunctions lying in `L^q`; closedness or boundedness of `T_p` on
`L^q` is CLASSICAL (positive kernel, `T_p 1 = c 1`, self-adjoint in `L^2`, so bounded on every `L^q` by
interpolation between `L^1` and `L^infinity`).

**Lemma O.** The zero mode of `E(., w')` on all of y > 0 is `y^(w') + phi(w') y^(1-w')` (the Fourier expansion in x
is valid on the whole upper half-plane). x-average at y = 0.3, 64 nodes: 7e-31 at the resonance, 0.7846 off
resonance (R4). Holds. The identification of the resulting device with Zagier's criterion is recalled from the
literature and from row G31, not rederived; it is labelled CLASSICAL in the RESULT.

#### Checks requested by the brief

- RH assumed anywhere: no. `rho_1`, `rho_2` are computed low zeros used as sample parameters.
- Verified height restated as a result: no.
- Known theorem presented as new: no. H1-H3, L, E, O are elementary; the non-existence of positive eigenfunctions
  above the bottom of the spectrum and Zagier's criterion are labelled CLASSICAL.
- Statement about zeros of zeta: none.
- Controls: EIS-w passes families 1, 2, 4 (re-checked by the eigen-relation at an off-resonance point). The
  non-arithmetic control is argued through the operators `T_n^w`, not computed on a triangle group.
  Limit 5: "BLS" is not defined in the map; the lane's reading (inner factors moved inside the scattering
  coefficient) may differ from the assignment's intent. T-NR and E_a are run at model level only.

#### Flags (this audit)

R1 = false (H1 consumes the Hecke rule only as an identity the wave group supplies; L uses positivity only).
R2 = false (no conclusion about zeros). R3 = false (EIS-w and the non-arithmetic control pass).
R4 = false (proved inequalities read `0 <= beta <= 1`).

#### Surviving claim

Every solid norm admitting a resonance state contains the constants and has `||T_p^k|| >= (p^(1/2) + p^(-1/2))^k`.
The Hecke-sup norm with weight `lambda_theta` satisfies `N(T_m f) <= lambda_theta(m) N(f)`, is finite on a joint
eigenvector iff `abs(Re mu) <= theta`, and is dominated by a two-sided growth norm of the wave group. In `L^q`
admissibility implies the eigenvalue bound. The Hecke-invariant space with zero mode `O(y^(1/2+delta))` at
`y -> 0` contains exactly the resonant Eisenstein series, and the device on it is the horocycle-rate criterion.
Precise obstruction for these four families; non-solid norms outside them are not classified.

#### Run incident

The first run overwrote the untracked file `checks.json` in the repository root (see RESULT.md, run note).
