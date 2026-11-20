# Structural probe of the correlated `tau` gate

## Scope

This note extracts prefix-compatible structure from the already archived odd
`M_0` floating replay.  It adds no degree, no quadrature, and no certified
inequality.  In particular, the numerical appearance of the constant `48`
below is an a posteriori observation, not a source-derived normalization or
an all-degree conjecture.

Let `A_N>0` be a nested old-target prefix and put

\[
 V_N=v_N^TA_N^{-1}v_N,\qquad
 D_N=d_N^TA_N^{-1}d_N,\qquad
 C_N=v_N^TA_N^{-1}d_N,
\]

\[
 g_N=\sqrt{V_ND_N}-C_N
     =\inf_{\tau>0}{1\over2}
       \left(\tau V_N+{D_N\over\tau}-2C_N\right). \tag{1}
\]

## Exact nested-prefix recurrence

Take the target LDL innovation coordinate for the newly added rung.  If the
normalized innovations of `v` and `d` are `x_N` and `y_N`, Schur elimination
gives the exact rank-one update

\[
 \Delta V_N=x_N^2,\qquad
 \Delta D_N=y_N^2,\qquad
 \Delta C_N=x_Ny_N. \tag{2}
\]

Consequently, for each fixed `tau`,

\[
 F_N(\tau):={1\over2}
 \left(\tau V_N+{D_N\over\tau}-2C_N\right)
 ={1\over2}\sum_{j\leq N}
 \left(\sqrt\tau x_j-{y_j\over\sqrt\tau}\right)^2. \tag{3}
\]

Thus `F_(N+1)(tau)>=F_N(tau)` pointwise, and taking the infimum proves

\[
 g_{N+1}\geq g_N. \tag{4}
\]

This monotonicity is exact, parity-independent, and invariant under any fixed
invertible coefficient congruence.  It also identifies a stronger but clean
proof target: find one source-derived `tau_0>0` for which the complete
innovation series in (3) is at most one.

More precisely, once `V_N,D_N>0`, the feasible set
`S_N={tau>0:F_N(tau)<=1}` is either empty or the compact interval

\[
 \tau_{\pm,N}=
 {1+C_N\pm\sqrt{(1+C_N)^2-V_ND_N}\over V_N}. \tag{5}
\]

The sets are nested.  Hence if every prefix were feasible, their intersection
would contain one fixed `tau_infinity` working on the whole ladder.  The
asymptotic theorem in `M0_FIXED_TAU_NO_GO.md` rules this out in both parities.
Consequently, either an old-target prefix ceases to be positive or, if all
old-target restrictions remain positive, `g_N` eventually exceeds one.  The
table below is pre-asymptotic.

The replay satisfies
`(Delta C)^2=(Delta V)(Delta D)` to about `1e-46` relative at every nonzero
rung, independently checking the rank-one update from the serialized gate
data.

## Odd-prefix values already in the replay

The following values use only
`results/m0_inertia_primary_parameter_replay.json`:

| degree | `g_N` | `tau_*=sqrt(D_N/V_N)` | `F_N(48)` |
|---:|---:|---:|---:|
| 1 | 0 | -- | 0.1348490870 |
| 3 | 0.0805989080 | 14.1055 | 0.1478569726 |
| 5 | 0.0847598044 | 15.1178 | 0.1482796995 |
| 7 | 0.1745592556 | 30.0193 | 0.1935796063 |
| 9 | 0.2467607817 | 42.4582 | 0.2485677782 |
| 11 | 0.2680713550 | 46.4325 | 0.2682159489 |
| 13 | 0.2706254728 | 46.9710 | 0.2706877861 |
| 15 | 0.2706772735 | 46.9772 | 0.2707388466 |
| 17 | 0.2710370391 | 47.0263 | 0.2710928375 |
| 19 | 0.2752057211 | 47.7508 | 0.2752093752 |

At degree 19, choosing `tau=48` costs only `3.65e-6` above the optimized
value.  Equivalently, `2304 V_N-D_N=0.1348057734` there, after decreasing
from `12.9455123504` at degree 1.  This is too little data to infer a limit:
the degree-19 `D` increment is not monotone-small, and no even-parity `M_0`
result is archived for a parity cross-check.

For orientation, the nonnegative `tau=48` innovation-square contributions
by degrees `1,3,...,19` are

\[
 0.1348490870, 0.0130078856, 0.0004227269, 0.0452999068,
 0.0549881719, 0.0196481707, 0.0024718372, 0.0000510605,
 0.0003539909, 0.0041165378.
\]

They are concentrated at low rungs but are not monotone, so they do not
currently supply a tail estimate.

## The positive-parent residue normalization is the wrong scale

For comparison, reconstruct the positive-parent conditional residue variance
from the archived parent midpoint,

\[
 c_N=\gamma-v_N^TG_{N,\mathrm{parent}}^{-1}v_N. \tag{6}
\]

Across the same odd prefixes, `c_N^{-1}` ranges from about `821` to `1299`,
far from the target-metric optimizer.  Substituting `tau=c_N^{-1}` into the
actual combined target dual norm gives `F_N(c_N^{-1})=2.31` already at degree
1 and `3.68` at degree 19, exceeding one at every listed prefix.  These values
use interval midpoints and are diagnostics, but their order-one separation
from one is much larger than the recorded primary/replay discrepancies.

This concretely confirms that the positive-parent Christoffel normalization
cannot be transferred to the signed target.  It also illustrates why the
near-optimal finite value `tau=48` is not an all-degree theorem: the exact
asymptotic result rules out every fixed `tau`, and nested compactness rules out
escape through prefix-dependent optimizers.  The remaining viable routes must
retain a controlled negative direction or bypass `M_0>=0`.
