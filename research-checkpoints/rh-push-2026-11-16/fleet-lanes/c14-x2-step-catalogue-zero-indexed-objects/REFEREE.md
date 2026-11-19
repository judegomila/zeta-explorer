# REFEREE.md: c14-x2-step-catalogue-zero-indexed-objects

## Self pass (author of RESULT.md; NOT an independent referee), 2026-11-19

An independent referee is owed. This pass re-derives each PROVED item from the definitions and lists what was
changed or downgraded. No statement about zeros of zeta is made by the lane; flags R1 to R4 are false.

### Re-derivations

1. Lemma T (i). Eigenvalues of `r` on `diag(p^(-lambda_i))` are `p^(-<mu, lambda>)`; with a character the local
   factor is `prod_mu (1 - chi(p) p^(-s - l_mu))^(-1)`. Holds.
2. Lemma T (ii). Poles of the untwisted product are at `s = 1 - l_mu`, real parts at most `1 - m`. At
   `s = 1 - l_mu0` the other factors are `zeta(1 + l_mu - l_mu0)`, argument of real part at least 1: non-zero or a
   pole (uses `zeta(1 + it) != 0`, classical). So the pole is not cancelled. Holds.
3. Lemma T (iii). `L(0, chi) = 0` for even primitive `chi != 1`; the other factors are entire. At finite `p` with
   `chi(p) = 1` the partial function is the full one times `prod_mu (1 - p^(-s - l_mu))`, which vanishes at
   `s = -l_mu0 + 2 pi i k/log p`. Holds.
4. Lemma T (iv). First draft said "weight set closed under `mu -> -conj(mu)`"; for `sym^k` on `(nu, -nu)` that is
   not the right statement (`-conj(l)` need not be in the set). What is used is that the set of real parts is
   symmetric under sign change, which follows from Weyl invariance. RESULT.md was corrected before delivery.
5. Proposition E (a). With `Re u_0 = 1`: `conj(u_0) = 2 - u_0`; `xi(u_0 - 1) = xi(2 - u_0) = conj(xi(u_0)) = 0`.
   `f` real-valued by `E*(z, conj s) = conj E*(z, s)` and the functional equation. Unfolding of `int f E*(., s)`
   for `Re s > 1` gives the Mellin transform of the constant term of `f`, which is 0; analytic continuation in `s`
   is legitimate because `f` decays rapidly and `E*(., s)` has moderate growth locally uniformly in `s` away from
   `s = 0, 1`. First draft wrote `<f, E*(., s)> = 0` with a Hermitian pairing and "up to the functional equation";
   rewritten with the bilinear integral. Holds.
6. Proposition E (b). `1 < Re(2 - rho) < 2`, Euler product: `xi(2 - rho) != 0`. Holds.
7. Hermitian count in E4/O1. Satake pair `{alpha, 1/alpha}`, `abs(alpha) != 1`: Hermitian iff `alpha` real iff
   `gamma log p/(2 pi)` is an integer. Two primes: `p^l = q^k`, impossible. Holds. (The criterion for the
   unramified principal series is recalled, not opened.)
8. Dictionary: arithmetic rechecked by hand; agrees with `checks.json` key E.
9. E5/O2 residues: for `beta >= 1/2` the rightmost pole is at `w = 2 beta` with residue
   `xi(4 beta - 1) xi(2 beta + 2 i gamma) xi(2 beta - 2 i gamma)`; no factor is `xi(rho)`. Holds. (It is not
   excluded that `2 rho` is itself a zero; nothing uses that.)

### Numeric checks

`checks.json` A: partial sums of `abs(lambda(n))^2` for the shadow on the line at the first zero against the
double-pole main term plus the two oscillating terms: ratios 0.999996, 0.999968, 1.000013, 1.000020 at
`x` = 5e4, 1e5, 2e5, 4e5. B: off the line (`beta = 0.7`, not a zero): ratios 0.99946, 0.99926, 0.99946, 0.99981 against
`r x^(1.4)/1.4`. These support `P = 1 + abs(2 beta - 1)` and the double pole at `beta = 1/2`. They are float64
sums, not certified, and are not used by any proof. C and E are arithmetic. D: distance of `gamma_1 log p/(2 pi)`
to the integers, minimum 0.033 at `p = 131` for `p < 200`.
`checks2.json`: constant-term coefficients as quoted in RESULT.md section 1.

### Items a referee should test first

1. Step attribution in the catalogue (section 2) for E1, E7, E8, E11, E12 and Deligne: recalled. In particular
   whether E7's positivity step and E12's hypotheses are as stated, and the exponent attributed to
   Rankin-Selberg-Serre in E2.
2. T4 (isobaric sums with cuspidal data): ARGUED; the position of the rightmost local pole assumes a symmetric set
   of twists.
3. The O2 column: read through the shadow; the direct metaplectic statement is one ARGUED sentence.
4. The reading of the assignment's list. Two readings are given (L-a, L-b) and a third class (L-c). If the intended
   reading is L-b, the list has four members, none of which is a device (the failing hypothesis is false
   identically in the parameter).
5. Control rows for T-NR, BLS and DH are typings, not runs.

### Labels restricted in this pass

- "25 s" run time replaced by "under 5 s" (measured: about 2 s per file).
- E2 source state: description opened, exponent recalled.
- Section 6 last sentence added: the absence of a fourth statement is a statement about the record.

---

## Independent referee pass (lens: general), 2026-11-19

Not the author. Files added: `referee_general_check.py`, `.log`, `.json` (one run, `scripts/memcap.sh 8
.venv-arb/bin/python -I`, under 1 min, under 200 MB; server not used).

**Outcome: the verdict (precise obstruction; nothing about zeros of zeta) holds. Every item labelled PROVED was
re-derived and confirmed. Five bookkeeping errors or overstatements were found; none changes the verdict, and
errors 1 and 2 make the obstruction stronger than stated. Flags: R1 = R2 = R3 = R4 = false.**

### Re-derivations of PROVED items

| Item | Result |
|---|---|
| Lemma T (i) | Confirmed. Eigenvalues of `r` on `diag(p^(-lambda_i))` are `p^(-l_mu)`. Notation: the weights `lambda_i + conj(lambda_j)` belong to `Pi x conj(Pi)`; `conj(std)~` read literally gives `lambda_i - conj(lambda_j)`. For `(nu, -nu)` the two weight sets coincide, so nothing downstream changes. |
| Lemma T (ii) | Confirmed. Pole at `1 - l_mu0` not cancelled: the other factors are `zeta` at arguments of real part >= 1 (uses `zeta(1 + it) != 0`, classical). "Exactly" for absolute convergence follows from the pole on the boundary line. |
| Lemma T (iii) | Confirmed. `L(0, chi) = 0` for even primitive `chi != 1`; other factors entire. Run: `chi` = Legendre symbol mod 5, `p = 11`, four choices of `r` (`sym^3`, `sym^2 o sym^4`, `std x conj std`, `sym^2 x conj sym^2`), `beta` in {0.6, 0.85}, `gamma` = ordinate of the fourth zero: finite part at `-l_mu0` below 6e-33 in all eight cases, inverse local factor exactly 0, other factors at the pole of modulus >= 0.537. |
| Lemma T (iv) | Confirmed (`P - beta_0 = 1` is a subtraction). Symmetry of the real parts under the Weyl swap confirmed for `r` built from std, dual and conjugates on `(nu, -nu)`, and numerically in the eight cases. |
| Proposition E (a) | Confirmed. `conj(u_0) = 2 - u_0` on `Re u_0 = 1`; both constant-term coefficients vanish; `f` real by `conj E*(z, s) = E*(z, conj s)` and the functional equation; unfolding gives 0 for `Re s > 1`; continuation to `s = u_0/2` (real part 1/2, away from the poles at 0 and 1) is legitimate for rapidly decaying `f`; first coefficient `2 sqrt(y) K_(s-1/2)(2 pi y)` is not identically zero. This is the known proof (Zagier's form of the Eisenstein-series method); it is labelled classical in the result and not presented as new. |
| Proposition E (b), (c) | Confirmed. `1 < Re(2 - rho) < 2`. Divergence `int y^(-beta) dy` correct. For O2 the arguments `4s - 1 = 2 rho`, `4s - 2 = 2 rho - 1` at `s = 1/4 + rho/2` agree with the Goldfeld-Hoffstein normalisation (recalled, not opened). |
| Hermitian count (E4 / O1) | Confirmed: `{p^(-nu), p^nu}` is stable under `alpha -> 1/conj(alpha)` with `Re nu != 0` iff `gamma log p/(2 pi)` is an integer; two primes impossible. `Im s(1 - s) = gamma(1 - beta)/2` at `s = rho/2` confirmed. |
| Dictionary 3.2 | Arithmetic confirmed by hand (all ten cells). |
| E5 / O2 residue | Confirmed: weights `+-(2 beta - 1), +-2 i gamma`; at `w = 2 beta` the other arguments are `4 beta - 1`, `2 beta +- 2 i gamma`. |

### Numeric checks rerun with different cases (`referee_general_check.json`)

- Check A at the **second** zero, `x` = 15000, 30000, 60000 (independent pure-Python sieve): ratio to main term plus
  oscillating terms 0.99954, 0.99963, 0.99988. Agrees with the double pole at 1. Float sums, not certified.
- Constant-term values at zeros 5 and 10: `abs(xi(rho))` below 1.1e-41; `abs(xi(rho - 1)) = abs(xi(2 - rho))` =
  8.67e-12, 1.62e-17; `abs(xi(2 rho)) = abs(xi(2 rho - 1))` = 3.91e-23, 2.24e-34. Edge, `t = 11.9`:
  `abs(xi(1 + 2it)) = abs(xi(2it))` = 1.0734e-8.
- Check D reproduced (first zero, `p < 200`: `p = 131`, 0.0327); second zero, `p < 500`: `p = 293`, 0.0045.

### Errors and overstatements

1. **POLE1 is defined as "rightmost pole at 1, simple", and then used as "iff `beta = 1/2`" for O2 (T3, table rows
   E2, E3, E5, E6, list L-c).** For a torus object with `n >= 2` the pole at 1 is never simple: with all
   `Re l_mu = 0` the weight 0 has multiplicity >= `n`. Run: for the shadow of O2 at `beta = 1/2`,
   `(s - 1)^2 F(s) -> 3.798` and `(s - 1) F(s)` diverges (the result's own row E1 says "double pole at 1").
   Correct statement: "rightmost pole on `Re s = 1`" iff `beta = 1/2`; POLE1 as defined fails at every `beta`.
   T3 should read "the position part of POLE1 is equivalent to the exponent-0 conclusion".
2. **List L-c ("all hypotheses but one met, the failing one equivalent to `beta = 1/2`") is miscounted.** By the
   result's own hypothesis codes, E2, E5, E6 require CUSP and L2, E7 and E11 require L2, E12 requires L2 and CUSP.
   At `beta = 1/2` the shadow `E(z, rho)` is on the unitary axis: two non-zero constant-term coefficients (section 1),
   not square-integrable. So for these six entries more than one hypothesis fails on O2, and the others fail at
   every `beta`. Only E4 (UNIT, GEN) has all hypotheses met on O2 iff `beta = 1/2`. L-c should be: {E4}; the rest
   move to "fails at every parameter". The conclusion "no device" is unaffected.
3. **Row E9 / O1: "the zero enters as a double zero of the product at `w = beta`".** The factor `zeta(w + 1 - beta)`
   has a pole at `w = beta`; the net order is a simple zero (double zero against a simple pole, as `c13` Lemma 1
   states for the completed function). Run at the first zero: `abs(G(1/2 + 10^-k))` scales by 10.000 per decade.
4. **T1 says "at real `w`".** The forced vanishing is at `s = -l_mu0`, which is real only if the minimising weight is
   real. It is real for `r x conj(r)`; for `r = sym^3` or `sym^2 o sym^4` (the E6 case) the run gives imaginary
   part 45.6 and 121.7. T1 should say "on the line `Re w = P - 1`". Lemma T itself is unaffected.
5. **T4 is ARGUED, and the sentence "the non-Borel cell left open by `c13` is closed for `GL_n`" rests on it.** The
   cell is argued closed, not closed. The verdict line "It receives the closure of the cell ... torus parameter
   (Lemma T)" is correct only for torus parameters; the isobaric-with-cuspidal-data case stays ARGUED.

Smaller points. "E11 / O2: positive multiple of `abs(L(rho, chi_D))^2` iff `beta = 1/2`": the "if" is proved; the
"only if" is not (the product could be non-negative off the line at isolated points). "Twelve proved inequalities"
are theorems of the literature; the lane proves none of them and says so. Catalogue attributions (exponents 3/5 and
3/10, `1/2 - 1/(n^2 + 1)`, 1/9, 7/64, `lambda(p)^2 - lambda(p^2) = 1`) agree with what this referee recalls; no
primary source was opened by this referee either.

### Checks required by the assignment

- RH assumed anywhere: no. Off-line `beta` is carried as a parameter throughout.
- Verified height restated: no. Numerics at zeros are illustrations and enter no proof.
- Known theorem presented as new: no. Proposition E (a) and Lemma T are elementary or classical and are labelled
  as recombinations; Lemma T for `std x conj std` is attributed to `c13`.
- Controls: no zeta-only mechanism is claimed, so there is nothing for a control to break. The control statements
  that could be tested were: the generic-parameter object passes the same Lemma T identity (run at `beta = 0.6` and
  0.85, not zeros: `P - beta_0 = 1`, same vanishing); E_a satisfies E4 with a sharp true conclusion (confirmed by the
  complementary-series classification, recalled). T-NR, BLS and DH rows are typings, as the result states.

### Flags set by this referee

| Flag | Value | Reason |
|---|---|---|
| R1 | false | no step on a zero-indexed object uses multiplicativity beyond an identity in the parameter |
| R2 | false | no inequality on `beta` is obtained |
| R3 | false | EIS-w / E_a pass whatever O1, O2 pass; BLS passes what O3 passes |
| R4 | false | the only entry met in full is at `Re rho = 1` |

holds = true for the verdict "precise obstruction", with corrections 1 to 5 to be applied to the text.
