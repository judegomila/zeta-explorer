# Prime 2 transformed-source sign: research checkpoint

This append-only, AI-assisted checkpoint preserves a focused counterexample and
its three interval replays. The work is not peer-reviewed or a machine-formal
proof; the historical internal audit labels in the source are not a claim of
human peer review. The preserved source and scripts are owned research files.

At normalized shift a=0, R₂(t)=1−√2 cos(t log 2)+1/2 and G=R₂F. For the
actual complete theta transform F, the once-sieved transformed-source form on
the constant residual is strictly negative:

    ∫ Λ_G/R₂² dt < −0.004π < 0.

The constant is the selected residual for the empty even prefix. The original
bridge remains positive on that test: ∫Λ_F dt=4π I>0. This falsifies only the
shortcut that the once-sieved source is nonnegative even at that residual. It
is not a negative original bridge or Schur pivot, a disproof of bridge
positivity or RH, or a bar to correlated source-plus-prime methods.

## Evidence and independent replays

`PRIME2_CONSTANT_SOURCE.md` contains the source identity, complete-orbit
positive envelope, explicit tail estimate, and 20,000-cell interval bounds.
`audit_decimal_independent.py` is a separate directed-decimal replay;
`check_prime2_mpfi.py` uses MPFI/MPFR; and `check_prime2_source.py` uses
mpmath's interval backend. All three were rerun successfully in Python 3.12.14,
with mpmath 1.3.0, MPFI 1.5.4, and MPFR 4.2.2. The decimal replay gave
I<0.031759639046524, L²rC₁>0.032767162284125, and gap>0.001007523237601;
MPFI gave I<0.031759639046524, L²rC₁>0.032767161757047, and
gap>0.001007522710523. These are conservative display roundings; the scripts'
strict assertions are the certificate. Mathematical inspection separately
checked the Fourier/Plancherel factor, signs, envelope, and tail estimate.
No external zero theorem or zero computation is needed for this a=0 result.

## Shift caveat

The source also proposes persistence for some sufficiently small positive
shift but gives no explicit range and leaves its shifted expression implicit.
One natural definition is λ_a(H)=−Im(H'(t+ia) conjugate(H(t+ia)))/a for a>0,
with λ_0(H)=H'²−HH'' for a real-on-real H, and transformed source
λ_a(R₂F)/|R₂(t+ia)|². The claimed continuity requires the corresponding
uniform decay and a nonvanishing R₂ on a compact strip. This checkpoint does
not treat the small-shift extension as an independently checked numeric
certificate or assert an explicit ε.
