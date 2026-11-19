# Proposed rows for OBSTRUCTION_MAP.md (not entered; for the repair lane)

Section 3 (device types), next free label:

| D-KM | Borel Eisenstein series on the loop group of SL_2 (constant term over the affine Weyl group, shifts by the central parameter c; Maass-Selberg positivity; degenerate Whittaker coefficients) | Coefficients are chain products of M(u) = xi(u)/xi(u+1) at u = z + kc, kc - z. In the chamber 0 < Re z < Re c denominators have Re > 1; strip arguments occur only in numerators. Rank-one Maass-Selberg positivity <=> N = z(1-S)/(1+S), S = T^(-z) M(z), Nevanlinna in z^2 for T >= 1 (fails for T < 1, measured), and the class is closed under Blaschke factors over non-real conjugate pairs: zeros can be inserted anywhere in Re z > 0. At c = 1 the chamber is the critical strip, the diagram automorphism is s <-> 1-s, and every non-identity coefficient is xi(z)/xi(z+n). | PROVED (Theorems B, C; rank-one Levi); PROVED-rel Garland / FKP (argument census); affine kernel ARGUED; author referee pass | T-NR (c > 2) and BLS pass every analytic step; DH passes formally below height 2000; E_a passes as a group object | `c13-kacmoody-eisenstein-affine-weyl-shift` |

Section 2, auxiliary controls (addition):
- BLS (scattering-level Blaschke control): xi(z)/xi(z+1) times Blaschke factors over non-real conjugate pairs of the right half-plane; all p-adic factors of zeta, cocycle relation, unitarity, Maass-Selberg positivity (proved), zeros at prescribed points. Lacks a group vector at the archimedean place.
- Note on NR: on a scattering carrier T-NR with c > 2 is an inner factor (Blaschke product with zeros at 1/2 +- b + i(2k+1)pi/log q) of the scattering coefficient and passes Maass-Selberg positivity.
