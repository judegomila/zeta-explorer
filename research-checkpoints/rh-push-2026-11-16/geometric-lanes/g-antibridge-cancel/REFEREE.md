# REFEREE: g-antibridge-cancel (2026-11-16)

Verdict: the claimed result HOLDS as a precise obstruction. No PROVED step failed
re-derivation. Corrections below are to wording and scope, not to the theorems.

## Re-derivation of PROVED steps

- Theorem A. Re-derived from the Hadamard product F(w) = F(0) prod(1 - w^2/rho^2)
  (F even, order 1, so no linear exponential factor and sum 1/|rho|^2 converges).
  G(z) = V_b(z) + V_c(-z); for real data conj G(-conj rho) = G(-rho); the four
  terms give b'Pb + c'Pc + 2 sum_rho V_b(rho)V_c(rho) after rho -> -rho.
  sum_rho 1/((rho+x)(y-rho)) = (L(x)+L(y))/(x+y) and
  sum_rho 1/((rho+x)(rho+y)) = -(L(x)-L(y))/(x-y). Confirmed. Does not use RH.
- Theorem B. Both partial-fraction identities checked term by term; the s = x^2
  Loewner forms -M[s,t] = sum 1/((s+lam)(t+lam)), (sM)[s,t] = sum lam/((s+lam)(t+lam))
  confirmed; M = L/(2x) confirmed. Does not use RH.
- Corollary B1. (P+B)P^{-1}(P-B) = P - BP^{-1}B and the harmonic-mean form confirmed
  algebraically; numeric residual 3.3e-72 at 80 digits.
- Corollary B2. Confirmed: congruence by diag(2x_i) and s = x^2 reduce K_e >= 0 on an
  interval to Loewner matrices of -M; Loewner's theorem plus uniqueness of the
  meromorphic continuation gives all lam real; zeta has no real zeros in (0,1).
  For K_o, Im(sM) = sum lam Im(s)/|s+lam|^2 gives lam > 0. Wording slip: "positive
  residues" is not a condition (residues of M are multiplicities); the condition is
  only that the poles are real (and lam > 0 for the odd sector).
- Corollary B3. Confirmed under RH (labelled as such). Sanity: 1+T(0.6) = 1.156e-3
  against 4x^2 sum gamma^-4 / (2 sum gamma^-2) ~ 1.15e-3.
- Finite-shift consistency (section 1). Confirmed by expansion in a.

## Independent numerics (own script, kept at /tmp/ref-antibridge/ref.py; different cases)

- Theorem A directly against 250 zeros on seven new nodes 0.55..11:
  P - zerosum = +3.5890e-3, B - zerosum = -3.5890e-3, tail prediction 3.5947e-3.
- Zeta, seven nodes, 80 digits: P, K_e, K_o positive (min eig 3.3e-16, 6.1e-32,
  3.9e-28); 1 - ||T|| = 3.0e-29, T eigenvalues at both ends. Same no-margin picture.
- DH implemented independently through Hurwitz zeta: functional equation 6e-41,
  L odd 3e-41, zero 0.80851718245663738555 + 85.699348485377592172i (matches).
  Seven real nodes 0.7..6: P, K_e, K_o all positive; 1+Tmin = 5.3e-23, 1-Tmax = 5.2e-17.
  Complex pair at delta = 0.02 and 0.2: sectors (+5318.9, -4687.6) for b = 1 and
  swapped for b = i; zeta positive at the same node. Confirms the DH control.

## Errors and overstatements

1. The cancellation in Corollary A1 is a coordinate change. Q^a = Sigma Q Sigma with
   Sigma = 1 (+) (-1), i.e. c -> -c. Q + Q^a = 2(P (+) P) is the polarization
   identity for one form, not an interaction between two independent objects. The
   "antibridge form" is defined by the author, not by PR 49 (PR 49 says q+- are
   symmetry sites with no coupling equation attached). The result discloses this
   (weakest step 1) and draws no positive conclusion, so the verdict stands, but
   "the antibridge carries B with opposite sign" is true by construction only.
2. K_e and K_o are the Weil form on J-even and J-odd two-sided tests (b = +-c).
   This is the classical parity split; ||T|| is unchanged by it. Nothing new is
   cancelled; the result says this.
3. Law for the DH witness is 2 Re(b^2)/delta^2 (measured 5319/-4688 at delta = 0.02
   against 5000), not "4 Re(b^2/delta^2)". Constant slip only.
4. The DH sector failure is exhibited only at nodes with Re z = 0.36 to 0.51, inside
   the zero strip, i.e. for the continued kernel, not for an admissible one-sided
   test. At Re z >= 1.1 (delta = 0.8, 1.5) both sectors are positive for both b.
   Failure on admissible real nodes follows from B2 (existence) but no explicit
   admissible witness is given. Disclosed in the result; the headline "fails both
   sectors" should carry this qualifier.
5. Section 4.2 "as RH below verified height requires at this order" is unsupported:
   finite-node positivity is not implied by verified height without a tail bound.
6. "Positivity of P is the eq48 target, RH-equivalent" is imported from eq48
   (refereed there); not re-proved here. The independent statement proved here is
   B2 (each sector is RH-equivalent).

## Checks requested

- RH assumed anywhere unlabelled: no. B3 is labelled conditional.
- Zeta-only mechanism claimed: no. Result states no step uses the Euler product;
  DH control re-run and agrees.
- Coordinate change: yes for A1 (item 1); consistent with the obstruction verdict.

## Surviving claim

Exact identities: W(v_b +- J v_c) = b'Pb + c'Pc +- 2b'Bc with B = -(Loewner matrix of
L); P + B = 4 x_i x_j (-M[s_i,s_j]), P - B = 4 (sM)[s_i,s_j]; Schur complement
(P+B)P^{-1}(P-B); each parity sector positive on an interval iff RH. Symmetrizing
over the sign of the reflected field is a block congruence and leaves the full
target. Measured no margin (1 - ||T|| ~ 1e-29 on 6 to 7 nodes). DH satisfies all
identities and is separated only by continued-kernel complex nodes.
