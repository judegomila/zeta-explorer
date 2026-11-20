# g-torus-modular: averaging the bridge form over the torus modular parameter

Date: 2026-11-16. Lane: integrate the twin-ladder / bridge form over the torus parameter `r`
(and its modular orbit), unfold in the Rankin-Selberg manner, and read off the sign.
Nothing here proves or refutes RH. No Lambda bound and no zero-free region changes.
Labels: PROVED (argument given here), CLASSICAL (standard literature), MEASURED (numerics in this
directory, floating point, not interval-certified), OPEN.

## Verdict

**Precise obstruction.** The modular average does produce a manifestly positive Petersson norm, and
the Euler product does enter through the unfolding. But the norm it produces is the member `h = 1/2`
of the one-parameter shift family

    K_h(w,w') = [ X(w+h) conj X(w'+h) - X(w-h) conj X(w'-h) ] / (w + conj w' - 1),

whose `h -> 0` member is the refereed Weil/Pick form of `eq48`. The shift is fixed at `1/2` by the
unfolding (the two constant-term exponents `y^s`, `y^(1-s)` carry `xi(2s)` and `xi(2s-1)`, arguments
differing by exactly 1). The resulting constraint on zeros is `zeta(w) != 0` for `Re w >= 1` and
nothing inside the strip. Averaging along the `r`-geodesic only (not the full modular curve) gives a
rank-one form that is positive for any function real on the critical line, including
Davenport-Heilbronn.

## 0. Plan, and what is new relative to the atlas and walls

- Atlas (PR #27 `historical-routes.md`) section 2 already records the shift bridge
  `|X(w-a)| < |X(w+a)| (Re w > 0) <=> a >= Delta` and states that positivity for every positive
  shift is an RH reformulation. This note does not re-run that. What it adds: the modular (Petersson)
  realization sits at exactly one point of that family (`a = 1/2` in the variable used here), with
  a proof that the unfolding cannot move the shift, and the identification of the `h -> 0` endpoint
  with the eq48 Pick kernel.
- PR #56 states that changing `r` is a reference change for fixed spectral data. Section 1 confirms
  it and computes what integrating over `r` gives when the loading itself (not just the reference)
  is averaged.
- Walls addressed: DH control in section 6; the result is an edge statement (`Re w = 1`), so MV-CAP,
  flow-blindness and verified height are not engaged.

## 1. The parameter `r` and its modular orbit (PROVED, elementary)

PR #43/#49 use `E_r : eta^2 = (w^2 + r^2)(w^2 + r^-2)`, `r > 1`, with `w = (s-1)/s`. The map
`s -> w` does not involve `r`; `r` enters only through the double cover `eta`. For real `r` the
period lattice is rectangular, so `tau(r)` lies on the imaginary axis `i R_{>0}`, a geodesic of the
modular curve (PR #56: modulus `m = r^-4`, cylinder `ell = 4K`, `b = K'`).

**P1.** The bridge block form `Q = [[E,B*],[B,D]]` built from the pulled-back scalar field is the
same quadratic form for every `r`. Hence `int Q d mu(r) = mu(total) * Q` and the relative coupling
`T = D^(-1/2) B E^(-1/2)` is unchanged. Only the annulus reference constants
`rho_n = sech(2 pi n b / ell)` vary. An `r`-average of the reference is a positive combination of
reference operators and says nothing about `Q`.

So a non-trivial average must integrate an object that is loaded on the torus itself.

## 2. Geodesic (`r`-only) average of the twin-ladder torus loading (PROVED)

The flat rectangular torus of modulus `iy` has heat trace

    Theta_y(t) = sum_{m,n} exp(-pi t (m^2/y + n^2 y)) = theta(t/y) theta(t y),   theta(x) = sum_n e^{-pi n^2 x}.

This is two theta ladders (the `m`-ladder and the `n`-ladder) on one torus. Write
`xi*(z) = pi^(-z/2) Gamma(z/2) zeta(z)`.

**P2.** For `Re(s +- w) > 1`,

    int_0^inf int_0^inf  sum_{m,n != 0} exp(-pi t (m^2/y + n^2 y))  t^s y^w  dt/t dy/y  =  2 xi*(s+w) xi*(s-w).

Proof. The `t`-integral gives `pi^-s Gamma(s) (m^2/y + n^2 y)^-s`. The `y`-integral is
`m^(w-s) n^(-w-s) B((s+w)/2,(s-w)/2)/2` (substitute `y = (m/n) x`, then `x^2 = v`). Summing over
`m, n != 0` gives `4 zeta(s-w) zeta(s+w)`, and
`pi^-s Gamma(s) * 4 * Gamma((s+w)/2) Gamma((s-w)/2) / (2 Gamma(s)) = 2 pi^-s Gamma Gamma`. QED.
(The beta integral was checked numerically to 1e-41, `modular_checks.py` section 1. Equivalent to
Hecke's period formula for the Epstein zeta function.)

Consequence. With `s + w = 1/2 + iu`, `s - w = 1/2 + iv` (continued), the `r`-averaged twin-ladder
form is the kernel `2 xi*(1/2+iu) xi*(1/2+iv)`. For real `u_i`,
`sum c_i conj(c_j) K(u_i,u_j) = 2 |sum c_i xi*(1/2+iu_i)|^2 >= 0`. The form is rank one and its sign
uses only that `xi*` is real on the critical line (the functional equation). It holds verbatim for
the DH completed function. **The geodesic average is positive and Euler-blind; it gives no
constraint on zeros.** The bridge shear `w` becomes the height difference `(u-v)/2`, nothing more.

## 3. Full modular average: the unfolded identity and its sign (CLASSICAL + PROVED rewriting)

Let `E(z,s)` be the Eisenstein series of `PSL2(Z)`, `phi(s) = xi*(2s-1)/xi*(2s)`, and `Lambda^T`
truncation at height `T >= 1`. Maass-Selberg (CLASSICAL): for `s, s'` away from poles,

    < Lambda^T E(.,s), Lambda^T E(.,s') >
      = [T^(s+s~-1) - phi(s) phi(s~) T^(1-s-s~)]/(s+s~-1) + [phi(s~) T^(s-s~) - phi(s) T^(s~-s)]/(s-s~),   s~ = conj s'.

The left side is a Gram kernel in `L^2(Gamma\H)`, so the right side is positive semidefinite on every
finite set of complex nodes, including nodes with `Re s < 1/2`.

**P3 (PROVED, algebra).** Multiply row `s` by `xi*(2s)` and column `s'` by its conjugate. With

    a(s) = T^(s-1/2) xi*(2s),     b(s) = T^(1/2-s) xi*(2s-1) = a(1-s),

the Gram kernel becomes

    K_T(s,s') = [a(s) conj a(s') - b(s) conj b(s')]/(s + conj s' - 1) + [a(s) conj b(s') - b(s) conj a(s')]/(s - conj s').      (3.1)

This is the bridge block form in exact shape: `E`-block `a conj a`, `D`-block `b conj b`, coupling
`a conj b`, with `b` the reflection of `a`. In the variable `omega = 2s - 1/2` the first bracket is
`2 K_{1/2}(omega, omega')` for `xi*` with the twist `T^(s-1/2)`. So the modular average **does**
turn the indefinite coupling into a positive Petersson norm, at shear `h = 1/2`.

MEASURED (`modular_checks.py` section 2): for 9 random 7-node sets with `Re s in (0.15,1.4)`,
`T in {1,2,5}`, the minimum eigenvalue of the normalized matrix is positive (2e-22 to 8e-8; the
kernel is analytic so small eigenvalues are expected).

**Constraint on zeros that results (CLASSICAL).** The diagonal of (3.1) for `Re s > 1/2`,
`Im s != 0` bounds `|phi(s)|`, so `xi*(2s) != 0` there: `zeta(w) != 0` for `Re w > 1`. The boundary
limit gives `zeta(1+it) != 0`. Poles of `phi` at `s = rho/2` (`Re s < 1/2`) are compatible with
positivity for every position of `rho`, because for `Re s < 1/2` the first bracket changes sign with
`2 Re s - 1` and a large `|phi|` makes it positive. The norm does not see where in the strip the
zeros are.

**Zeros that the modular operator does force onto a line (CLASSICAL: Colin de Verdiere; Hejhal;
Lagarias-Suzuki 2006; Ki 2006).** For `T >= 1` every zero of `a(s) + a(1-s)` (the constant term of
`E*` at height `T`) lies on `Re s = 1/2`; they are eigenparameters of the self-adjoint
pseudo-Laplacian. MEASURED: `modular_checks.py` section 5 finds roots `0.5 + 6.9747i`,
`0.5 + 10.4023i`, ... (`T=1`) and `0.5 + 6.0158i`, `0.5 + 7.3362i`, ... (`T=2`). These are zeros of
the twin sum `xi*(omega+1/2) T^(..) + xi*(omega-1/2) T^(-..)`, not zeros of `zeta`.

## 4. Why the unfolding cannot move the shift (the obstruction)

**P4.** For entire `X` with `X(w) = X(1-w)`:

(i) CLASSICAL (atlas section 2): `K_h` is positive semidefinite on `Re w > 1/2` iff
`X(w-h)/X(w+h)` is a Schur function there; if `X` has no zeros in `Re w > 1/2 + h` this holds, and
a zero `rho` with `Re rho > 1/2 + h` not cancelled by a zero at `rho - 2h` breaks it.

(ii) PROVED: `lim_{h->0} K_h(w,w')/(2h) = X(w) conj X(w') (L(w) + conj L(w'))/(w + conj w' - 1)`,
`L = X'/X`. This is the Pick kernel of eq48 (`Q_L` up to the congruence by `X`), i.e. the Weil form.
Proof: differentiate the numerator in `h` at 0. MEASURED: relative entry difference 1.5e-5, 1.5e-7,
1.5e-9 at `h = 1e-2, 1e-3, 1e-4` (section 4), consistent with `O(h^2)`.

(iii) PROVED (from P3): the Petersson norm is the `h = 1/2` member.

(iv) Shift rigidity (CLASSICAL input). The constant term of an Eisenstein series is
`y^s + phi(s) y^(1-s)` with `phi` an intertwining quotient `xi*(z)/xi*(z+1)`, `z = 2s-1`. The
difference 1 is the Tate twist between the two Weyl chambers and is the same for every group and
every cover (Langlands-Shahidi: quotients `L(jz)/L(jz+1)`). The unitary axis `Re s = 1/2` maps to
`Re z = 0`, i.e. to the lines `Re = 0` and `Re = 1` of `zeta`. A `Gamma`-invariant unfolding
therefore lands on `h = 1/2`; no choice of test vector, truncation height or modular weight changes
it. Rankin-Selberg of `|theta|^2 y^(1/2)` gives `zeta(2s-1)`, the same doubling. Triple products
`<E(s1)E(s2), E(s)>` (Zagier) do produce `xi*` at single arguments `s +- s1 +- s2`, but positivity
of the norm of `E(s1)E(s2)` then gives a spectral sum of squares of critical values at real
spectral shifts: a moment identity (MV-CAP wall), with off-line zeros reachable only at non-unitary
parameters where the invariant form is not positive.

(v) Residues are of the wrong type. Shifting the contour in the pseudo-Eisenstein norm
`<E_psi,E_psi> = (1/2 pi i) int [Psi(s) Psi#(1-s) + phi(s) Psi(s) Psi#(s)] ds` across `s = rho/2`
gives terms `xi*(rho-1)/(2 xi*'(rho)) Psi(rho/2) Psi#(rho/2)`. The Weil form needs residues of the
logarithmic derivative (multiplicities, weight 1) and the pairing `G(rho) G#(1-rho)`. The unfolding
supplies the quotient `xi*(2s-1)/xi*(2s)` (Dirichlet coefficients: Euler totient, positive), not
`xi'/xi`. PROVED as a computation; no positivity follows from it.

**P5 (PROVED; Zagier's space is not unitarizable).** In Zagier's construction the zeros appear as
`E*(z, rho/2)` with Laplace eigenvalue `(rho/2)(1 - rho/2)`. If a Hilbert structure existed on a
space containing these vectors with the Laplacian symmetric, then `(rho/2)(1-rho/2)` would be real,
which forces `Im rho = 0` or `Re rho = 1`. Both are false for `rho_1 = 1/2 + 14.1347i`. Under RH,
`Re(rho/2) = 1/4`, which is neither the unitary principal series (`Re = 1/2`) nor the complementary
series (real parameter). The quantity that RH makes real is `(rho - 1/2)^2 = (2s - 1/2)^2`, which is
not a function of the Casimir `s(1-s)`; it needs `s` itself, i.e. the non-normal Lax-Phillips
generator. So "find an invariant positive form on the Zagier-Hejhal space" has no solution, with or
without RH.

## 5. What this says about the PR #56 frontier

- Frontier (A) (`||T|| <= 1`): in the shifted family the coupling is multiplication by
  `X(w-h)/X(w+h)`. `||T_h|| <= 1` holds unconditionally for `h >= 1/2`, with `L^2(Gamma\H)`
  (truncated) as an explicit Hilbert-space model at `h = 1/2`. If the unrefereed half-plane
  `Re s > 7/8` stands, it holds for `h >= 3/8`, but only as an abstract de Branges space; no
  geometric model is known. The target is `h -> 0`. `h* = Theta - 1/2` is the threshold.
- Frontier (B) (odd-sector sign `Delta_- <= 0`): by P4(ii) and eq48 it is the `h = 0` member. The
  modular average does not reach it.

## 6. Davenport-Heilbronn control

`f` = DH function, `Lam_f(w) = (5/pi)^(w/2) Gamma((w+1)/2) f(w)`, functional equation checked to
1e-41.

| mechanism | DH outcome | where the Euler product is used |
|---|---|---|
| P2 geodesic average (rank one) | passes identically (PROVED) | nowhere; Euler-blind |
| P3 Petersson kernel (3.1) with `phi_f` | fails iff `f` has a zero in `Re w > 1` (P4(i)); such zeros exist (CLASSICAL, Davenport-Heilbronn 1936). On the low-height samples tested DH **passes** (MEASURED, `dh_ms.py`: 9 six-node sets, heights up to 46, min eigenvalue 8e-10 to 0.10) | existence of `Gamma`: the sum over coprime pairs gives the normalizer `zeta(2s)` as an Euler product in the region of absolute convergence |
| `K_h`, nodes near the DH zero `0.808517 + 85.699348i` | min eigenvalue `+4.8e-8` (h=0.5), `+6.3e-8` (0.4), `-7.2e-5` (0.3085), `-1.53` (0.25), `-8.8` (0.1), `-15.3` (0.02); zeta near its first zero stays positive (3e-15) for all six `h` (MEASURED) | threshold `h = beta - 1/2 = 0.3085` |
| Pick limit `h -> 0` | DH `-14.4`, zeta `+3.0e-15` (MEASURED) | this is eq48's target |

So the modular positivity separates zeta from DH only through zeros in `Re w > 1`. Inside the strip
it is as blind as the finite Pick orders reported in `euler/RESULT.md`. A scan for a DH zero with
`Re > 1` (to exhibit the failure of (3.1) numerically) found no candidate on `sigma = 1.02`,
`0 < t < 6000` (`dhscan_np.py`; no local minimum of `|f|` below 0.06); a winding-number count along
`sigma = 1` (`dhwind.py`) did not finish in the time available. The failure of (3.1) for DH is
therefore CLASSICAL here, not MEASURED.

## 7. Verdict by question asked

1. What is the `r`-averaged bridge form? If only the reference is averaged: `Q` itself (P1). If the
   twin-ladder loading is averaged along the `r`-geodesic: `2 xi*(s+w) xi*(s-w)`, rank one (P2).
   Over the full modular curve: the Maass-Selberg kernel (3.1) (P3).
2. Is it a manifestly positive Petersson norm? Yes, at shear `h = 1/2`.
3. Constraint on zeros: `zeta(w) != 0` on `Re w >= 1`; zeros of the twin sum `a(s) + a(1-s)` on
   `Re s = 1/2`. Nothing in the open strip.
4. Obstruction: shift rigidity P4(iv), residue type P4(v), non-unitarizability P5.

No pivot was taken: the adjacent idea (a pseudo-Laplacian with shear `h < 1/2`) is equivalent to a
zero-free half-plane `Re > 1/2 + h` by P4(i), which is atlas section 2.

## 8. Three weakest steps

1. P4(iv) is an argument from the known shape of constant terms (Langlands-Shahidi), not a theorem
   proved here that no automorphic construction yields a fractional shift. Residual spectra of
   metaplectic covers sit at real parameters `1/2 + 1/(2n)` and were not examined for a usable
   positive form.
2. The DH failure of (3.1) rests on the classical existence of DH zeros with `Re > 1`; none was
   located numerically, and on all sampled node sets DH passes. P4(i) "iff" carries the common-zero
   caveat of atlas section 2.
3. P5 uses my reading of Zagier's construction (vectors `E*(z, rho/2)`); the original paper was not
   re-read in this session. All eigenvalue tests are floating point (mpmath 40 digits), not interval
   arithmetic.

## Files

- `modular_checks.py`: sections 0-5 (FE checks, beta integral, Maass-Selberg Gram, `K_h` family,
  Pick limit, zeros of the constant term).
- `dh_ms.py`: kernel (3.1) with the DH quotient.
- `dhscan_np.py`, `dhwind.py`, `dhscan.py`: search for DH zeros with `Re > 1` (no result).
