# Rejected schedule artifacts

These files are retained only as failure records and are excluded from every
schedule fit.

- `lambda2p5_N14_dps25_projection_underresolved.json`: the projected tail
  rounded to zero at the stated working precision.  The admitted replacement
  is `raw/lambda2p5_N14_dps40.json`, using direct residual quadrature.
- `lambda3_N9_dps25_projection_underresolved.json`: replay with the current
  fail-closed projection check raises `ArithmeticError`; the admitted
  replacement is `raw/lambda3_N9_dps35.json`.

Neither artifact may be used as a zero projection error or as evidence for an
asymptotic rate.
