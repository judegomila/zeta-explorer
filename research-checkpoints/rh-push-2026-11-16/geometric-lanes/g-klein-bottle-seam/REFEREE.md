# REFEREE: g-klein-bottle-seam (2026-11-16)

Verdict: the claimed result HOLDS as a precise obstruction. Every PROVED step was re-derived and is
correct after the hypothesis repairs listed below. No step assumes RH. No step uses the Euler product,
and the result says so. The content is elementary: T1 is Backlund minus Hardy, T2 is Hardy's sign,
T3 is continuity of roots, T4 is a tautology. No cancellation is claimed, so the coordinate-change
test (invariance of the relative coupling norm) does not apply.

## Re-derivation

- Geometry. Checked against zeta-view `docs/KLEIN-ANNULUS.md`: `D` is the deck involution of the
  `w`-sphere map, `s o D = s`, `s o A = iota o s`, `R` fixes the two ovals over `|w| = 1`, `A` swaps
  them. `K \ Sigma` is one open annulus; `K/D` is the closed half-plane with two branch points
  (`w = +-ir`, `+-i/r` paired by `R`). The affine `(u,v)` formulas in RESULT are consistent with this.
- T1. Confirmed. Argument principle on `Omega u iota(Omega)`; `F o iota = conj F` with reversed
  orientation doubles `Delta_C arg F`. (1.2): `log|F|` is even in `x`, so `Re F'/F = 0` on the line off
  zeros; the remainder converges uniformly on `I`. Omitted hypothesis: if a branch point lies in
  `Omega`, multiplicity on `K` is the pullback multiplicity (PR 56 section 3). The count is unchanged.
- T2. Confirmed. (a) well-definedness mod 2, base-point and direction independence check out
  (`A^2 = id` on `E_r`). A loop crossing `Sigma` once is one-sided and its lift runs `y -> Ay` inside
  one annulus, so the projected loop stays in `x >= 0`; (c) follows. `H^1(K; Z^w) = Z + Z/2` also
  holds for the punctured surface (wedge of two circles, one twisted: `Z^2 / (2,0)`). `v`-winding
  forced to 0: confirmed from `phi o A = conj phi`.
  Precision: `k(gamma) = [F<0] + n(gamma)`, so "equals the Hardy sign" holds only for loops enclosing
  an even zero count. The script's `Z2_class` is the difference (d) between the two ends, not `k`.
- T3. Confirmed with two repairs: `U` must be BOUNDED (the proof needs compact closure to isolate
  the zeros and a polynomial `q`), and the topology must be fixed (sup norm on `closure(U)` works for
  both the paths and Hurwitz). With those, `pi_0 = Z_{>=0} x Z/2` is correct.
- T4. The algebra is correct but tautological: `Q_Z` is defined from the zero set, so
  `ind_- = N_right` is a restatement. It is NOT proved that this is the negative index of a
  restriction of the eq48 form `Q_L`: `Q_L` sums over all zeros and has no windowed restriction on
  the test space; one needs the evaluation map `v -> (V(rho))_{rho in Z}` to be onto and the
  remaining zeros controlled. RESULT section 5 admits `ind_-(Q_L) = N_right` is OPEN, but verdict
  item 4 and the headline claim "(T4) signature of the windowed Weil form" overstate it. Simple
  zeros are assumed.
- T5. (a) confirmed. (b) normal form confirmed: `h_tau = -h_zz/4` gives `(z-t*)^2 = (tau-tau*)/2`;
  Jacobian `h_tt^2/4`. Proved only for generic events (`h_tt != 0`); higher order is cited from the
  atlas. Monotonicity of `ind_-` in a FIXED window is conditional on no zero crossing the window
  boundary; zeros can leave or enter laterally, which the statement in the verdict omits.

## Independent numerics (`referee_chk.py`, direct Hurwitz evaluation, 30 digits, no heat integral)

| DH window | N_K = (1/pi) outer arg | N_on | seam flux / pi (a = 0.002) | N_right | end signs |
|---|---:|---:|---:|---:|---|
| 110 < t < 118 (new case) | 6.000 | 4 | 3.9986 | 1 | -, - |
| 81 < t < 89 (repeat) | 5.000 | 3 | 3.0015 | 1 | -, + |

Off-line zero in the new window: `0.65083008061 + 114.163342731 i`. Functional equation residual
`1.3e-30`. The new window has mod-2 class 0 with a pair present; the original window has class 1 with
a pair present. This confirms directly that the class is blind to the pair (T2) and that (1.3)
detects it. DH passes every hypothesis of T1-T5, as required.

## Errors and defects

1. T4 overstated in the verdict (tautological form; link to `Q_L` unproved). Downgrade to
   "definition plus OPEN identification".
2. T3 missing hypothesis (bounded `U`) and unspecified topology.
3. Artifact inconsistency: `run.log` and `klein_index_out.json` record the collision as
   `tau* = 0.173886` with residual `h/|h_tt| = 6.5e-4` (Newton not converged). The reported
   `0.1765053782` comes only from `collision.py`. The table rows are multiples of the unconverged
   value (0.95x = 0.1652, 1.05x = 0.1826); they still straddle the true event, so the table stands.
   I did not rerun the heat-flow landing; `tau*` is the author's measurement.
4. T5 monotonicity needs the no-boundary-crossing hypothesis and is generic-event only.
5. Novelty labels: T1-T3 are classical facts in Klein language. Stating them as "new" is accurate
   only for the packaging (torsion class = Hardy sign, completeness statement).

## Surviving claim

On a bounded convex symmetric window, the loaded field on the Klein quotient has exactly two
topological invariants, `N_K = N_on + 2 N_right = (1/pi) Delta_C arg F` and the seam sign; seam flux
is `pi N_on`; the non-orientable `Z/2` class is the Hardy sign and is blind to off-line pairs. All of
this holds for Davenport-Heilbronn (checked on two windows), so no Klein-topological invariant can
exclude off-line pairs. The separating quantity `N_right` is not topological; its identification
with the negative index of the eq48 form is open.
