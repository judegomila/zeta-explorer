# REFEREE: g-torus-modular/RESULT.md

Date: 2026-11-16. Adversarial pass. Verdict on the result as stated: **does not hold as written**
(one PROVED label is false as stated, one is not a proof, one identification is not derived). The
obstruction conclusion survives in a corrected, weaker form given at the end. Nothing in the result
assumes RH. Numerics here: mpmath 40 digits and numpy double precision, not interval-certified.

## Step by step

**P1 (r-average of the reference): CONFIRMED.** PR #56 `annulus_theta_coupling.md` line 362 states
that the spectral bridge values at fixed spectral nodes are independent of `r`. Averaging a constant
form returns the form. This is a null result and a reference change, as the result says.

**P2 (geodesic double Mellin): CONFIRMED, with two qualifications.**
- Re-derived two ways. (a) As written: `t`-integral, then `y = (m/n)x`, beta integral, sum over
  `m,n != 0`; constants check to `2 xi*(s+w) xi*(s-w)`. (b) Coordinates `a = t/y`, `b = ty`:
  `t^s y^w = a^((s-w)/2) b^((s+w)/2)`, `dt/t dy/y = (1/2) da/a db/b`, and
  `int (theta(a)-1) a^(z/2) da/a = 2 xi*(z)`, giving `(1/2)(2 xi*)(2 xi*)`.
- Reran: beta integral at `s = 2.4+0.7i, w = -0.6+1.3i, (m,n) = (7,2)`: relative error 0 at 40
  digits. One-dimensional Mellin of `theta - 1` at `z = 2.3+1.1i` and `1.6-3i`: 0 and 5.8e-21.
- Qualification 1: the integrand is `(theta(t/y)-1)(theta(ty)-1)`, not the heat trace
  `theta(t/y) theta(ty)`. The `m = 0` and `n = 0` rows are dropped; with them the integral diverges.
  The summary line "double Mellin average of the heat trace equals" overstates this.
- Qualification 2: derivation (b) shows the rank-one factorization is the coordinate change
  `(t,y) -> (a,b)` applied to a product of two independent one-variable functions. It is not a
  cancellation. The result reaches the same conclusion (Euler-blind, no constraint), so no claim
  is lost, but the kernel on the critical line exists only by continuation, not as the integral.
- DH: the DH completed function has real Dirichlet coefficients and the functional equation, so it
  is real on the line (checked: imaginary part 4e-47 at `1/2 + 17.3i`). Rank-one positivity passes.

**P3 (Maass-Selberg and the block shape): algebra CONFIRMED; two statements NOT confirmed.**
- The Maass-Selberg formula is quoted correctly. The row/column scaling to (3.1) with
  `a(s) = T^(s-1/2) xi*(2s)`, `b(s) = T^(1/2-s) xi*(2s-1) = a(1-s)` is correct (checked term by
  term; `b = a(1-s)` uses the functional equation of `xi*`).
- Reran the Gram positivity with different nodes and `T in {1, 1.5, 3, 10}`: full kernel (3.1) has
  minimum normalized eigenvalue from 8.5e-24 to 0.20, all positive. For `T = 0.5, 0.2` it is -5.0
  and -3.2, as expected since the formula needs `T >= 1`.
- **Not derived: "the full modular average is the Maass-Selberg Gram kernel."** No integral of the
  bridge form `Q` or of the twin-ladder heat trace over the modular curve is computed. The Mellin
  transform in `t` of the torus heat trace is `E*(z,s)`; its Rankin-Selberg integral against
  `E(z,w)` is divergent, and its renormalization is identically zero (Zagier 1981). The truncated
  Gram matrix is a different, quadratic object chosen by analogy of block shape. No map from the
  PR #43/#56 form `Q` to (3.1) is given, so "the modular average turns the indefinite coupling into
  a positive Petersson norm" is a statement about (3.1), not about `Q`.
- **Not new information: nodes with `Re s < 1/2`.** `E(z,1-s) = phi(1-s) E(z,s)`, so the Gram
  matrix at reflected nodes is a diagonal congruence of the Gram matrix at the original nodes.
  Including them adds no constraint.
- "Nothing inside the strip" is labelled CLASSICAL but only the diagonal is argued. It is plausible
  and consistent with all samples; the label should be OPEN/MEASURED for the full matrix statement.

**P4(i): CONFIRMED** (standard Schur/de Branges kernel statement, with the common-zero caveat the
result already carries).

**P4(ii) (`h -> 0` limit is the Pick/Weil kernel): CONFIRMED.** The numerator is odd in `h`; its
derivative at 0 is `2 X(w) conj X(w') (L(w) + conj L(w'))`. Reran at different nodes (near the zeta
zero at 21.022): relative entry difference 2.9e-5 at `h = 1e-2`, 2.9e-7 at `h = 1e-3`: `O(h^2)`.

**P4(iii) ("the Petersson norm is the `h = 1/2` member"): FALSE AS STATED.**
- (3.1) is the sum of two brackets. Only the first has the `K_h` shape, and it is built from `xi*`
  (poles at 0, 1), not from the entire `X` used to define the family in P4.
- Measured: at `T = 1`, nodes in `Re s in (0.55,1.2)`, the first bracket alone has minimum
  normalized eigenvalue **-1.28** (`T = 1.5`: -1.69) while the full kernel is positive.
  `K_{1/2}` built from `xi*` on nodes near `w = 3/2`: **-5.01**. `K_{1/2}` built from entire `xi`
  on the same nodes: +2.8e-16.
- Reason: `xi*(2s-1)/xi*(2s)` has a pole at `s = 1` inside `Re s > 1/2` (the residual spectrum,
  i.e. the constant function), so it is not a Schur function. The second (exchange) bracket of
  Maass-Selberg is what restores positivity.
- Corrected relation: `xi(2s-1)/xi(2s) = phi(s) (s-1)/s`. The factor `(s-1)/s` is the Blaschke
  factor of `Re s > 1/2` at `s = 1`. So `K_{1/2}[xi]` is the Schur kernel of `phi` with its residual
  pole divided out; it is positive (classical), but it is not the Petersson Gram kernel and is not
  a row congruence of it (the factors `s` and `s-1` attach to different terms). The Petersson
  norm and the `h = 1/2` member share the argument offset 1; they are not the same form.

**P4(iv) ("the unfolding fixes `h = 1/2`"): NOT A PROOF.** The task summary lists this as PROVED and
section 0 says "with a proof that the unfolding cannot move the shift". The text labels it
"CLASSICAL input" and section 8 lists it as the weakest step. It is an argument from the shape of
Eisenstein constant terms. It covers the constant-term mechanism only. The result's own P2 (a
geodesic period) and the Zagier triple product produce `xi*` at single arguments with no offset, so
"a Gamma-invariant unfolding therefore lands on `h = 1/2`" is not a theorem about all modular
averages. Status: OPEN beyond the constant-term mechanism.

**P4(v): residue value confirmed** (`Res_{s=rho/2} phi = xi*(rho-1)/(2 xi*'(rho))` at a simple
zero). It is a computation; no positivity statement is attached, as the result says.

**P5: CONFIRMED as a one-line statement.** `Im[(rho/2)(1-rho/2)] = (gamma/2)(1-beta)`, zero only if
`gamma = 0` or `beta = 1`. Requires a positive-definite form and a nonzero-norm eigenvector. This
is elementary and does not use RH. It excludes Laplacian-symmetric positive forms only; the result
states that scope. The identification of Zagier's vectors was not re-read from the source by the
author or by me; `E*(z,rho/2)` is finite with constant term `xi*(rho-1) y^(1-rho/2)`, consistent.

## Davenport-Heilbronn control (rerun independently)

- Functional equation ratio at `0.2 + 31i`: 1 to 1e-40.
- `K_h` at a different off-line zero, `rho = 0.650830 + 114.163343i` (threshold
  `beta - 1/2 = 0.1508`): six-node minimum eigenvalue +1.1e-11 (`h = 0.5`), +2.4e-11 (0.3),
  +8.7e-11 (0.16), **-0.55** (0.14), -11.2 (0.1), -7.0 (0.03). Zeta near 21.022 stays positive
  (1.2e-17) for all seven `h`. The claimed threshold behaviour reproduces at a second zero.
- Pick limit: zeta +1.2e-17, DH -7.3.
- Kernel (3.1) with the DH quotient, 16 new node sets, `T in {1,1.5,3,10}`: all positive (2.8e-16
  to 0.33). DH passes on every sample.
- Search for a DH zero with `Re > 1`: scanned `sigma = 1`, `0 < t < 12000`, step 0.02, Newton from
  106 local minima of `|f|` below 0.3. Largest real part found: `0.89775 + 2442.53029i`. No zero
  with `Re > 1` located. The original scan on `sigma = 1.02` with threshold 0.06 was weaker than
  described: a zero at `sigma = 1.1` need not produce `|f| < 0.06` on `sigma = 1.02`.
- Consequence: the only separation of zeta from DH by the `h = 1/2` positivity is the classical
  existence theorem for DH zeros in `Re > 1`. It is not exhibited at any height up to 12000. The
  table entry "fails iff `f` has a zero in `Re w > 1` (P4(i))" is proved in one direction only for
  (3.1): a zero of `a` with `b != 0` makes the diagonal negative. The converse cites P4(i), which
  concerns the first bracket with entire `X`, not (3.1).
- The "where the Euler product is used" entry for (3.1) is correct in substance: for DH there is no
  group and no Eisenstein series, so (3.1) with `phi_f` is not a Gram matrix. The arithmetic input
  is `zeta(w) != 0` on `Re w >= 1`, which is already classical.

## Coordinate-change check

- P1: reference change (stated).
- P2: product structure in the coordinates `(t/y, ty)`; no cancellation.
- P3: (3.1) is a diagonal congruence of the Maass-Selberg Gram matrix; positivity is the Gram
  property and nothing else. Reflected nodes are a further congruence.
- No step claims a reduction of the relative coupling norm of `Q`. None occurs.

## Errors, ranked

1. P4(iii) is false as stated (first bracket indefinite: -1.28; `K_{1/2}[xi*]`: -5.01).
2. "Full modular average = Maass-Selberg kernel" is an identification by shape, not a derivation;
   the linear modular average of the twin-ladder trace is zero after renormalization.
3. P4(iv) is listed as PROVED in the summary and section 0; it is an argument, limited to
   constant terms.
4. DH "iff" for (3.1) is one-directional; the `sigma = 1.02` scan was not a valid exclusion.
5. P2 summary omits that the `m = 0`, `n = 0` rows are removed.
6. "Nothing in the open strip" for the full Gram matrix is labelled CLASSICAL; only the diagonal
   is argued.

## Surviving claim

(a) PROVED: an `r`-average of the reference leaves `Q` unchanged. (b) PROVED:
`int int (theta(t/y)-1)(theta(ty)-1) t^s y^w dt/t dy/y = 2 xi*(s+w) xi*(s-w)` for `Re(s +- w) > 1`;
this is a product in the coordinates `(t/y, ty)`, rank one on the critical line by continuation,
and DH passes it. (c) CLASSICAL + algebra: the truncated Eisenstein Gram kernel has the block shape
(3.1) with `b(s) = a(1-s)` and is positive for `T >= 1`; this is not shown to be an average of the
bridge form. (d) PROVED: `K_h/(2h) -> ` Pick/Weil kernel with `O(h^2)` error. (e) CORRECTED:
`K_{1/2}[xi]` corresponds to `phi(s)(s-1)/s`, the scattering quotient with the residual pole removed
by a Blaschke factor; it shares the offset 1 with the Petersson kernel but is a different form.
(f) PROVED (elementary): no positive form with symmetric Laplacian on a space containing
`E*(z,rho/2)`. (g) MEASURED: DH fails `K_h` below `beta - 1/2` at two off-line zeros and passes at
`h = 1/2` and on (3.1) at all sampled heights; no DH zero with `Re > 1` found for `t < 12000`.
(h) OPEN: that every modular unfolding has offset exactly 1. The lane yields no constraint on zeros
inside the strip and no change to the coupling norm of `Q`.

Referee scripts were run from `/tmp/ref-gtm/` (`ref1.py`, `ref2.py`, `ref3.py`); not kept in the repo.
