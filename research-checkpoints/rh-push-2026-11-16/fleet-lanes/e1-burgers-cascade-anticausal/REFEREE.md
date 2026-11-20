# REFEREE: e1-burgers-cascade-anticausal

Date 2026-11-17. Adversarial check of `RESULT.md` (claimed verdict: precise obstruction).
Referee scripts: `/tmp/e1ref/ref.py`, `/tmp/e1ref/ref2.py` (own implementation, mpmath 30-50 digits, run through
`scripts/memcap.sh 8`; the compute server was not used). Nothing in this directory other than this file was changed.

## Outcome

**The verdict holds, with three corrections (one a real but minor error, two of wording/attribution).**
Every PROVED step was re-derived by hand and confirmed. All rechecked numbers reproduce. No step assumes RH or
restates verified height. The result is an obstruction; it proves nothing about zeta.

## 1. PROVED steps, re-derived

| Step | Check | Result |
|---|---|---|
| Lemma 1(a) | `(F''/F)' = F'''/F - F''F'/F^2 = L'' + 2LL'` | confirmed |
| Lemma 1(b) | `S_t = (N''D - ND'')/(4D^2) = W'/(4D^2)`; `S_zz = W'/D^2 - 2MS_z`; `1+S = 2F/D`, `1-S = 2 alpha F'/D`; log-derivative of `1+S` gives `M = L - S_z/(1+S)` | confirmed |
| Lemma 1(c) | same computation as (a) with `D` | confirmed |
| Lemma 1(d) | `p' = -D_t/D' = -D''/(4D')`, `D''(p_j)/D'(p_j) = 2 sum_{i != j} 1/(p_j - p_i)`; one pair gives `(sigma^2)' = -1/2` | confirmed (needs simple zeros) |
| Lemma 1(e) | residue `N(p)/D'(p) = 2F(p)/D'(p)`; one pair: `p = -alpha + sqrt(alpha^2+sigma^2)`, `p^2 - sigma^2 = -2 alpha p`, `abs(r)^2/(2p)^2 = alpha^2/(alpha^2+sigma^2)`; Gram form `T = R* A R conj(A)` re-derived from `Gamma = sum r_j e_j <f_j, .>` | confirmed |
| Prop. 2 | rank one, `s(t) = alpha/sqrt(alpha^2 + sigma_0^2 - t/2)`; at `t = 2 sigma_0^2`: `S = (z - 2 alpha)/(z + 2 alpha)`, no right-half-plane pole | confirmed |
| Prop. 3 | antisymmetric cancellation; cross terms `(x_j - x_i)/abs(p_j - p_i)^2 > 0`; second sum pairs to `-(x_j - x_i)^2/abs(.)^2` | confirmed |
| `D` has axis zeros only at multiple axis zeros of `F` | on the axis `F = e^{i theta} g(y)`, `F' = -i e^{i theta} g'(y)`, `g` real, so `D = e^{i theta}(g - i alpha g')` | confirmed |
| Partner bound | partner `-conj rho` contributes `1/(4 Re rho)`; all other left-half-plane and axis terms positive | confirmed |
| Prop. 4 | extinction time: for the zero of largest real part every term of `p'` is `<= 0` and the partner gives `x' <= -1/(4x)`; then a nondecreasing `G >= 0` ending at `0` is `0` | confirmed (elementary) |
| Prop. 5 | `M = 1/(z-p) + D''(p)/(2D'(p)) + ...`, `Res M^2 = D''/D'`, so `oint M^2 = -8 pi i sum p'` | confirmed |
| Side identities | `d/dt log abs Disc = -4 Re sum (rho')^2`; `sum rho^2` linear in `t` with slope `-n(n-1)/2`; `alpha -> 0` limit `HS^2 -> 4 alpha^2 sum (rho_j + conj rho_k)^{-2}` | confirmed |

## 2. Numerics rerun on different cases

- HS formula `sum r_j conj(r_k)/(p_j + conj p_k)^2` against direct quadrature of `int_0^inf s abs(k(-s))^2 ds` for the
  quartet `+-1.4 +- 1.2i`, `alpha = 1`: both `0.5029070393444259`; trace of `T` agrees.
- Author's witnesses reproduced to all printed digits with an independent implementation: quartet `+-33/20 +- 19i/20`,
  `d HS^2/dt = +0.002988417, -0.0013127852, -0.0029303075` and `d op^2/dt = +0.0015201905, -0.0099573352,
  -0.0067473292` at `alpha = 0.3, 1, 10`; class-(H) witness `+0.0029549726, -0.00067297431, -0.0004187974`.
- New quartets: `+-2.1 +- 0.6i` and `+-1.65 +- 0.5i` have negative HS derivative at `alpha = 10` and positive at
  `alpha = 0.3`; `+-1.4 +- 1.2i` and `+-0.5 +- 0.5i` have negative operator-norm derivative at `alpha = 1, 10` with
  positive HS derivative. Sign is indefinite in the new cases too.
- Single trajectory of the author's quartet at `alpha = 1` (new): `HS^2 = 0.488010, 0.487996, 0.488794` at
  `t = 0, 0.2, 0.4`, then increasing to `1.954` at `t = 4.0`, `Gamma_- = 0` at `t = 4.2`. The norm is non-monotone
  along one trajectory between collisions, not only across configurations. `Phi_1` decreases throughout
  (`2.160 -> 0.023`).
- Prop. 3 on 300 new configurations with non-rational zeros (seed 7), 900 evaluations: `d Phi_alpha/dt >= 0` in 0,
  `d sum x^2/dt >= 0` in 0, largest `d Phi/dt = -0.02396`, formula against central difference at most `8.4e-16`,
  pole-count mismatches 0, partner-bound failures 0.
- Prop. 5 on a different polynomial (degree 8, class (H) but not even, `alpha = 0.6`, two zeros in the box, complex
  sum): formula, finite difference and contour integral all `-1.77783457149101 - 0.833658173167008i`; difference
  `3.6e-30`.

## 3. Controls

No zeta-only mechanism is claimed, so there is no step whose failure for the controls needs to be tested. Run
anyway as polynomial models: an `E_a`-type configuration (ten zeros on `Re z = +-1/4`) and a DH-type configuration
(seven axis zeros plus one off-line quartet). In both, `Phi_alpha > 0`, `d Phi_alpha/dt < 0`, Lemma 1 and
Prop. 3 hold. This agrees with section 6 of the result: no proved step distinguishes zeta from DH or `E_a`. The
prime-side reading (section 5) was not computed by the author and was not computed here; it stays ARGUED.

## 4. Errors and corrections

1. **Continuity of `Phi_alpha` as defined (real, minor).** `Phi_alpha` is defined as the sum over the poles of
   `S_t`. At an instant where `F_t` has a multiple zero `rho` in the open right half-plane, `D` and `N` both vanish
   at `rho`, the pole cancels, and the sum over poles drops by `Re rho`. Check: `F = (z-1-i)^2 (z+1-i)^2`,
   `alpha = 1`: right-half-plane zeros of `D` are `0.2360680 + i` and `1 + i`, `N(1+i) = 0`; sum over zeros of `D`
   is `1.236068`, sum over poles of `S` is `0.236068`; with the double zero split by `0.01` both sums are
   `1.2360956`. So with the stated definition "continuous in `t`" and "strictly decreasing" fail at such isolated
   instants (a codimension-two event, not excluded for polynomial data). Repair: define `Phi_alpha` as the sum of
   `Re p` over zeros of `D_t` in `Re z > 0` with multiplicity; Prop. 3 and continuity then hold. The related sentence
   "the number of zeros of `D` in `Re z > 0` equals `kappa`" is true only when the right-half-plane zeros of `F`
   are simple. `Phi_alpha = 0` iff `Gamma_- = 0` is unaffected.
2. **Hypothesis mismatch in Prop. 3.** The statement excludes zeros on the axis, but the `alpha -> 0` consequence
   applies it to `F` with axis zeros. The proof extends (an axis zero `iy` contributes `x_j/abs(p_j - iy)^2 > 0`), but
   the statement should say "no multiple zeros; sum over `Re p_i <= 0`". The Dyson law also needs simple zeros; the
   passage through multiple zeros of `D` rests on continuity and is not written.
3. **Scope of the summary sentence.** "The strictly monotone functionals are zero-configuration sums" is not a
   classification: three such functionals are exhibited, no statement that others do not exist is proved. Prop. 4
   covers only `G >= 0` vanishing on axis configurations and is close to a restatement of finite extinction time.
4. **Attribution.** Lemma 1(a),(d) (Burgers equation for `F'/F`, zero dynamics), Prop. 3 at `alpha = 0` and Prop. 5
   (residue form of the Burgers conservation law for pole dynamics) are classical; for `alpha > 0` they are the
   same statements applied to the heat solution `D = F + alpha F'`. Section 0 lists the flux identity as new; it
   should be labelled CLASSICAL mechanism, PROVED here for `D`. What is specific to this lane is the sign test of the
   norms and the reading of the direction.
5. **Proposition 2 between collisions.** The general statement is proved only through the jump at the collision.
   Between collisions the evidence is numerical (50 digits, not interval-certified), as the result states. A cleaner
   reading of the author's own data: the class-(H) witness has rank one, so every unitarily invariant norm is a
   multiple of the single singular value and decreases there (`alpha = 1, 10`), while the pair model increases. This
   covers the nuclear norm, for which the bare quartet is not a witness (its nuclear-norm derivative is positive:
   `0.0307, 0.0614, 0.0484`). The one-line claim should not cite the bare quartet for the nuclear norm.
6. **Not checked by anyone.** The prime-side paragraph (flux zero through `Re z = X` for every twist; edge terms),
   the infinite-product case for `xi`, and the controls NR, Beurling, phase-rotated transfer operator and `theta^w`.
   The result states this; it limits the obstruction to "argued" on the prime side.

## 5. Other required checks

- RH assumed: no. Prop. 4 for `xi` uses `Lambda < infinity` (de Bruijn, classical), stated.
- Verified height restated: no.
- Known theorem presented as new: partly, item 4 above.
- Claim beyond what is established: item 3 above.

## 6. Surviving claim

For polynomial heat solutions with zero set symmetric under `rho -> -conj rho`: (i) no unitarily invariant norm of
`Gamma_-(t)` is monotone in `t` (proved through the one-pair collision; between collisions shown by 50-digit
witnesses, including a rank-one class-(H) witness that covers every unitarily invariant norm, and by a single
quartet trajectory on which `HS^2` first decreases and then increases); (ii) `sum of Re p` over right-half-plane
zeros of `D_t = F_t + alpha F_t'` counted with multiplicity is continuous and strictly decreasing while positive,
for every `alpha > 0` (proved); (iii) a nonnegative functional vanishing on axis configurations that is monotone
along the flow is nonincreasing, so it bounds the value at `t = 0` only by values at `t < 0` (proved, elementary);
(iv) the derivative in (ii) is the contour flux `-(1/4)(1/2 pi i) oint M^2` (proved, classical mechanism; verified
to `3.6e-30` on a second case). That the prime side contributes zero flux for every sign twist is argued from Q4 and
not computed. No proved step fails for DH-type or `E_a`-type configurations.
