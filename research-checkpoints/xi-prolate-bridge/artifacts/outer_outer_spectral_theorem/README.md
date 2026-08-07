# Outer--outer spectral theorem replay artifacts

The four JSON files are the source-locked producer and independent replay at
80 and 160 decimal digits for `lambda=2.5`.  The theorem constant retains its
exact convergent positive dyadic-series definition; the stored terms
`j=0,34,64` are cross-checks, not a numerical truncation of that constant.

Both paths reconstruct constants from decimal source parameters and exact
dyadic interval endpoints.  They use separate formula assemblies but share
`mpmath.iv`; each artifact records that limitation.  Neither path reads a
zero table or assumes that nontrivial zeta zeros are globally real.

The formal project state serialized in every file remains `P0_INVALIDATED`.
