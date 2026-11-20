# Degree-locked theta mechanisms: selected dilation and explicit bulk packets

Date: 2026-11-04. Status: independent mathematical audit PASS, with the
limits below retained. The actual-selected estimate U_n=o(Δ_n) and the
equivalent excess-Schur asymptotic remain open. No selected counterexample
is claimed.

This investigation tests two new routes without reusing the disproved
scalar-moment transfer or uncontrolled-degree graph-density bridge.

## 1. Complete endpoint selection: useful identities, no upper bound

For the actual monic selected P_n, R_n=tP_n′−nP_n belongs to its full old
same-parity prefix. Monic dilation P_s=e^(−ns)P_n(e^s t) gives exactly

    X[P_s]−X[P_n]=X[P_s−P_n]≥0.

The resulting virial and curvature are zero-division-free. They provide
a genuine mismatch lower bound

    U_n≥L_n²/H[R_n],
    L_n=(n−1/2)H[P_n]+(1/2)∫tw′P_n′²,

when the denominator is positive. Only with the stipulated finite old Q
positivity may H[R_n] be replaced by the larger X[R_n]. This is a lower
bound and diagnostic, not the desired small upper bound.

A tempting coercive rewriting using F′/F fails: its separated source-energy
terms have opposite nonintegrable 1/(t−r) poles at infinitely many simple
real Xi zeros for every fixed nonzero P_n. Their cancellation is essential.
Splitting only the nonvanishing gamma envelope is safe and yields an exact
degree-versus-source-radius identity, but retains an explicit selected
Hardy-Z commutator with no established favorable sign or relative bound.

## 2. Actual degree-locked packets: a rigorous test of uniform bulk coercivity

There are explicit fixed-parity polynomials of degree at most n, centered
at T_n~αn for every 0<α<4/π, whose actual theta energy has exponentially
small relative leakage outside any surrounding fixed linear bulk.
For each fixed δ>0 and requested polynomial leakage rate, a fixed kernel
power can also confine that energy to ||t|−T_n|≤n^δ.

The construction is monomial carrier times a symmetrized Fejér–Chebyshev
kernel, with the complete degree budget proved. A two-constants argument
from ξ(2+iT), followed by the exact F²p primitive and its theta tail bound,
gives the necessary source-norm lower bound without excluding real zeros.
No actual-theta scalar moment approximation is used.

For these packets an exact nonsingular Hardy-Z formula expresses H/X.
A same-parity polynomial sine/cosine carrier pair, with its extra degree
reserved, removes numerator cancellation. Consequently a uniform
degree-locked bulk inequality with H/X→0 would require

    ∫phi_n² Z′(T_n+u)² du / ∫phi_n² Z(T_n+u)² du → ∞

on the explicit width-n^δ windows, as proved in equation (6A.5). The
available cumulative Hardy-Z moment remainder does not supply such
relative control on every subpower-width packet. This is a precise
arithmetic dependency, not a proof that it is true or false.

These packets are not asserted to be X-selected or orthogonal to the old
prefix. A proof using the single complete selected endpoint could bypass
the uniform bulk requirement. Their degree/height control does, however,
make them legitimate tests of that particular proposed coercive mechanism.

## Files

- `SELECTED_DILATION_COMMUTATOR_AND_ZERO_POLE_OBSTRUCTION.md`: selected
  identities, lower bound, pole obstruction, and safe arithmetic remainder.
- `FEJER_PACKETS_AND_HARDY_Z_OBSERVABILITY.md`: explicit degree-locked
  packets, source lower bound, leakage estimates, and exact required local
  arithmetic inequality.
- `check_selected_dilation_identities.py`: exact-rational algebra sanity
  check on a separate explicit analytic profile, degrees 0 through 8.
- `AUDIT.md`: independent algebra, domain, construction, and scope audit.
- `SHA256SUMS`: hashes of the five payload files after the final correction.

## Assumptions and conditioning

No result assumes RH, global V≥0, enlarged Q positivity, or a uniform
inverse gap. Old Q positivity is used only in the explicitly marked
denominator relaxation for the mismatch lower bound. No assertion gives
Δ_n>0 or a lower comparison Δ_n/X[P_n].

The packet constants may depend on the fixed bulk, desired leakage rate,
and fixed kernel power. That power is chosen before n tends to infinity.
The polynomial lower-bound exponent for its source norm is independent of
the kernel power; constants may depend on the resulting positive local
lower amplitude. No unproved short-interval zeta lower bound is assumed.

The existence of unbounded simple real Xi zeros is the previously audited
unconditional Bui–Conrey–Young/Riemann–von Mangoldt input. The remaining
analytic inputs are the exact theta representation, gamma asymptotics,
polynomial fixed-strip bounds, and elementary polynomial/kernel estimates.

The previous packages, live 4CT scripts, repositories, and external
services were not modified. These are AI-assisted research proofs and
an independent AI-assisted audit, not formal verification or external
peer review. No literature-novelty claim is made.
