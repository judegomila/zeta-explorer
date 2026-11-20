# REFEREE: h-hecke-channels

Date: 2026-11-16. Adversarial pass on RESULT.md. Claimed verdict: precise-obstruction.

## Outcome

Holds, with errata. Every headline identity (R1, R2, R3, R4, C1) was re-derived and the numerics were
reproduced with independent code (mpmath, Hurwitz-zeta L-functions, direct lattice sums; not the lane's
Bessel or flint code). Two statements labelled PROVED are not proved as written (E1, E2), one is stated
too broadly (E3), and the R1-to-R4 dictionary is an analogy, not an identity (E4). None of these changes
the negative verdict. The verdict is "no rigidity found from these linear relations", not a no-go theorem.

## Re-derivations (confirmed)

- R1. A vector of L outside pL lies in one index-p sublattice, a vector of pL in all p+1. With the
  covolume normalisation, sum Theta_L'(pt) = Theta_L(t) + p Theta_L(p^2 t); the "-1" terms balance
  (p+1 = 1 + p). Mellin gives p^-s sum Lambda_L' = (1 + p^(1-2s)) Lambda_L. Correct. This is the
  weight-0 Hecke operator T_p acting on the lattice variable of E*(tau,s), eigenvalue p^s + p^(1-s)
  in the unnormalised sum. Standard.
- Weight-1/2 issue. The lane did not use the Jacobi theta of weight 1/2. It used rank-2 lattices
  (Epstein zeta, weight-0 Eisenstein series in tau), where T_p exists for every p. Consequence the
  text should state openly: zeta enters only as a factor of zeta L(chi_-4) at the square torus (and
  through xi*(2s) in the constant term). No Hecke relation for zeta alone is produced; in rank 1 an
  index-n sublattice is a rescaling and the relation is n^-s. The eigenvalue in R1 is p^s + p^(1-s),
  not a Dirichlet coefficient a_p of the vertex field.
- R2. Neighbour classes at p = 2, 3, 5 are right (2i twice and i once; x^2+9y^2 and 2x^2+2xy+5y^2;
  loops plus x^2+25y^2 and 2x^2+2xy+13y^2). Direct lattice sums at s = 4 (|x|,|y| <= 60):
  sum'(x^2+9y^2)^-s = A+B (2.009060018629 against 2.009060018631), sum'(2x^2+2xy+5y^2)^-s = A-B,
  same for p = 5, and sum'(x^2+y^2)^-s = 4 zeta L(chi_-4); agreement to the truncation error (1e-12).
  So the displayed formulas and the constant 1/2 pi^-s Gamma(s) p^s are right, and the values at a
  zero of the root are +-(1/2) pi^-rho Gamma(rho) p^rho B(rho) as stated.
  Factor (2^s + 2^(1-s) - 1) has zeros only on Re s = 1/2 (cosh = 1/(2 sqrt 2) < 1). Correct.
- R3. Kernel identity e^(tau(u +- l/2)^2) = e^(tau u^2) e^(+-tau l u) e^(tau l^2/4) gives the stated
  sheared relation. Monoid law T_m T_n = T_mn follows from the exponent identity. Correct.
  Sign convention checked: tau equals de Bruijn's t, so tau < 0 is the side with non-real zeros.
- R4. With chi(2) = i, c = (1 - i xi)/2: a = 2 Re(c chi), b_n = a_2n = 2 Re(i c chi). Table for
  p mod 5 correct. c W = conj(c) gives Lambda_f even; (ic) W = -conj(ic) gives Lambda_g odd, so
  g(1/2) = 0. Rotation/reflection, W U_p W = U_p^-1, dihedral of order 8, irreducible over R. Correct.
  Eigen-relation at p = +-1 mod 5 (chi(p) = +-1 real), density 1/2. Correct.
- C1. 2 Lambda_2i + c Lambda_i = (2^s + 2^(1-s) + c - 1) Lambda_i. For c = 5: cosh(z log 2) = -sqrt 2,
  zero at 1.771553303164 + 4.532360141827 i, |factor| = 5e-26, zeta L(chi_-4) = 0.82 there. Confirmed.

## Numerics reproduced independently

- Off-line zeros (Newton, 25 digits): 0.86509118125745 + 20.647342245149 i (A+B, p=3);
  1.3618335578329 + 10.405933330614 i (A-B, p=3); 0.59047928331974 + 32.977598492052 i (A+B, p=5);
  0.79180240567163 + 16.030130442738 i (A-B, p=5). Residuals 1e-25. All match.
- Count balance on shorter boxes [-1,2.5] x [1,T], my own contour (step 0.02) and line scan (0.01):
  p=3,+: winding 59, on line 47, lane lists 6 off-line pairs below 60.5: 47 + 12 = 59.
  p=3,-: 47 = 29 + 2*9. p=5,+ (T=40.5): 41 = 37 + 2*2. p=5,-: 33 = 23 + 2*5. All balance.
  So "first off-line zero on 3i is at height 20.6473" is confirmed at this resolution. Not interval.
- Davenport-Heilbronn: both functional equations to 1e-25; zero 0.80851718245664 + 85.699348485378 i,
  |f| = 6e-26, partner |g| = 0.72998. Confirmed.
- Shares: 72/272, 66/228, 42/304, 104/261 = 26.5, 28.9, 13.8, 39.8 percent. Arithmetic correct.

## Errata

E1 (N1 proof). Part (a) is about the abstract (p+1)-regular tree. The field is a function on
homothety classes, so the real graph has identifications and loops (the two primes above 5 at Z[i]);
the free outward construction does not apply there. Part (b) is a non sequitur as written: that
L -> Lambda_L(s_0) solves the system does not give a solution vanishing at a chosen vertex. The
conclusion is still true, for a weaker reason than advertised: the relations are linear and
homogeneous, so they can never exclude a zero at a vertex by themselves (phi = 0 solves them). A
non-trivial witness with all identifications respected is the twisted toric period
phi_Omega(L) = sum over the ring class group of Omega(a) Lambda_{aL}(s_0), Omega a non-trivial ring
class character: it is Hecke-eigen with the same eigenvalues for every p and vanishes at Z[i]
(class number one) for every s_0. N1 should be relabelled "immediate from linearity" and the
tree count dropped or restricted to the abstract tree.

E2 (section 6, first bullet, labelled PROVED). "R1 at a prime p is equivalent to the p-Euler factor"
is false as stated. R1 holds for every lattice, including generic ones whose Epstein zeta has no
Euler product (the text says so itself in section 2). At the CM vertex the Euler factor of
zeta L(chi_-4) at a split or ramified p comes from R1 plus the homothety loops; at inert p = 3,
R1 gives only Lambda_3i + Lambda_(-1+3i)/2 = (1/2)(3^s + 3^(1-s)) Lambda_i and says nothing about
the factor (1 - 9^-s)^-1. Related: in C1, G_c(L) = (T_2 + c - 1) Lambda_L is a scalar multiple of
Lambda_L in the lattice variable, so it satisfies R1 at every prime, including 2. What fails at 2 is
temperedness of the Dirichlet-series factor in s. The table row "tree relation: holds, p != 2" mixes
the two Hecke actions.

E3 (R3 scope). (i) Lambda_L has poles at s = 0, 1; the flow is defined on s(s-1) Lambda_L (entire,
Fourier transform of a rapidly decaying kernel). The relation survives because s(s-1) commutes with
the multiplier, but the flowed object must be redefined. (ii) "The flowed xi is sum_n T_n^(tau)
gamma_tau for every tau" fails for tau > 0: each term of the Phi kernel decays only like e^(5u) as
u -> -infinity, so e^(tau u^2) times one term is not integrable and gamma_tau does not exist. The
series form is valid for tau <= 0, which is the side the control needs. (iii) C3 cites Rodgers-Tao,
which covers xi of zeta (the object in flow_hecke.py). For the lattice field of the square torus the
right reference is Dobner (Newman's conjecture for the extended Selberg class). (iv) The persistence
of the monoid law under the flow is conjugation by an invertible operator; it carries no content
beyond the kernel identity. Stating it as "passes the backward-heat control" is fine; calling it a
result is generous.

E4 (dictionary). R1 is Hecke on the lattice variable (isogeny graph, eigenvalue p^s + p^(1-s)).
R4 is the coefficient operator U_p: a_n -> a_pn on a two-dimensional space of Dirichlet series of
conductor 5. Davenport-Heilbronn is a degree-1 function with gamma factor Gamma((s+1)/2); it is not
the field of any torus, and its "two-vertex Hecke graph" is not a subgraph or quotient of an isogeny
graph. "Isogenous object" for g is an analogy. The correct statements are: (a) R4 as an identity
about U_p on span{f,g}; (b) the 3- and 5-neighbours (A +- B)/2 are sums of two Euler products, which
is the same linear-algebra shape as f = c L(chi) + conj(c) L(conj chi). The control table's first
row should not list R4 under "tree relation R1".

E5 (minor). "At every off-line zero |A| = |B|" is a restatement of A +- B = 0.

## Davenport-Heilbronn failure step

Confirmed as stated: the Fricke-fixed vector f is not a U_p eigenvector at p = +-2 mod 5
(U_2 f = g, U_2^2 = -1, W g = -g). This is the absence of an Euler product in other words. The lane
is right that no step here turns it into zero information.

## Surviving claim

For rank-2 lattices the completed Epstein field satisfies sum over index-p sublattices
Lambda_L' = (p^s + p^(1-s)) Lambda_L identically in s (classical). These relations are linear and
homogeneous and cannot exclude a zero at any vertex. At a zero of zeta L(chi_-4) the 2-neighbours of
the square torus vanish and the 3- and 5-neighbours take values +-(const) B(rho) with B a different
Euler product; the neighbour fields have off-line zeros from height 10.4 (2x^2+2xy+5y^2,
Re = 1.3618) and 20.65 (x^2+9y^2), measured, counts balanced, not interval-certified. The de Bruijn
flow turns the multiplier p^(+-z) into a shift by (tau/2) log p (kernel identity; series form valid
for tau <= 0). Davenport-Heilbronn spans with its partner a 2-dimensional U_p-module with dihedral
symmetry of order 8 and is an eigenvector at p = +-1 mod 5. No bound moves; nothing about zeta zeros
is proved.
