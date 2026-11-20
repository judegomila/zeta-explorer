# REFEREE (general, adversarial): n1-ff-mayer

Date: 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.

**Referee verdict: HOLDS as a precise obstruction, with the corrections below.** Every PROVED step was re-derived by
hand and confirmed; the numerics were reproduced on cases the author did not run, with an independently written
construction of the matrix. No step assumes RH, none restates verified height. Two statements are over-labelled
(items E1, E2), the scope of the obstruction is narrower than the summary sentence suggests (E3), and the Z-side
"rotation" finding is a generic fact about analytic eigenvalue branches, not new information (E4). No ssh was used.
All runs went through `scripts/memcap.sh 8`, single process, longest 84 s. Referee scripts are in `/tmp/ref-n1ffm/`
(not in the repo); only this file was written.

## 1. PROVED steps re-derived

| Step | Check | Outcome |
|---|---|---|
| Lemma 0 (ii), M(u) = sum u^d B_d + (q-1)u^n/(1-qu) C | count of degree-d polynomials in a residue class for d >= n is (q-1)q^(d-n); geometric series | confirmed |
| Torus symmetry | g_a delta_c = c delta_c^(-1) g_(a/c) verified by 2x2 multiplication; rho(gh) = rho(g)rho(h) for (rho(g)f)(v) = f(vg); P commutes with M and W for q = 3, chi even; dim V+ = (q^n+3)/2 | confirmed |
| M = W D | g_a = w n(a) verified; W = rho(w) is a monomial involution, hence Hermitian unitary; (Wf)(y) = chi(y) f(1/y) | confirmed |
| S1' eigenvalues of D | orthogonality of psi_t on {deg r < k}: the sum is q^k for k <= j-1 and 0 for k >= j (j = n - deg t); gives c^_1 = 0, c^_j = ((q-1)z - q z^(j-1) + z^j)/(1-z), kappa = (q-1)z/(1-z), multiplicities (q-1)q^(n-j) and 2 | confirmed (re-derived; j = 2 gives -z) |
| S2 | M(u)^* W = D(ubar) = W M(ubar); real coefficients of det(1-M); the two mass identities, and that they hold verbatim at eigenvalue -1 | confirmed |
| S4 | at u = 1/q^2, kappa = 1 exactly, so max norm on that circle is 1 | confirmed |
| Theorem 1 (a) | Euclid bijection ((m,n),a) -> (n, m+an) from primitive S_< x {deg a >= 1} onto primitive pairs with 0 <= deg m' < deg n'; the missing terms are (0,c), c in F_q^* | confirmed |
| Theorem 1 (b) | sort by monic gcd; pairs with N dividing the gcd evaluate to 0; coprime pairs are never (0,0) mod N | confirmed |
| Theorem 1 (c) | truncation at degree n-1, both cases (N does not divide n', N divides n') | confirmed |
| Theorem 1 (d) | coefficient at [1:T] equals (q-1)u(L - A u^(n-1)); non-zero at zeros of L because deg L = n-1 exactly for primitive chi | confirmed (CLASSICAL input: exact degree) |
| Theorem 1 (e) | pole order of a resolvent row is at most the order of the determinant zero; ev_0 kills V- | confirmed, with gap E1 |
| Z identity | Neumann series = sum over bottom rows; each coprime 1 <= c < d reached twice, (1,1) once; at x = 0: 2 sum phi(d) d^(-2s) = 2 zeta(2s-1)/zeta(2s) | confirmed by hand for Re s > 1 |
| Nagao step (weakest step 2 of the result) | abelianisation of GL_2(F_3) *_(B(F_3)) B(F_3[T]) computed: it is Z/2 via det, so sign(det) is the only character of order 2 | confirmed; the "quoted from memory" caveat can be dropped. The identification of sectors with geodesic L-functions remains ARGUED |

## 2. Numerical reruns on different cases (independent code)

`/tmp/ref-n1ffm/ind.py`: own polynomial arithmetic, own rho(g_a), own lattice sum for Phi_all; nothing imported from `ffm.py`.

- q = 3, n = 3, N = T^3 + 2T^2 + T + 1 (the result used T^3 + 2T^2 + 1), two characters of order 13:
  closed form of M against brute-force sum over deg a <= 9: 1.3e-8 (tail estimate 6e-9); Theorem 1 residual
  1.0e-15 .. 4.7e-14 at three complex u; eigenvalue multiplicities of D: 18, 6, 2, 2 as predicted;
  sigma_min(1 - M) at the L zero (|u| = 0.577350): 2e-16.
- q = 3, n = 4, N = T^4 + 2T^3 + T + 1 (the result used T^4 + T^3 + T^2 + 1), characters of order 20 and 40:
  Theorem 1 residual 1e-15 .. 4.6e-13; multiplicities 54, 18, 6, 2, 2; sigma_min(1 - M) <= 4e-16 at all L zeros,
  all at |u| = 1 or 0.577350.
- q = 5, n = 3, N = T^3 + 2T^2 + 1 (a value of q the result did not run), two characters of order 31:
  Theorem 1 residual 2e-15 .. 9e-14; multiplicities 100, 20, 4, 2; sigma_min(1 - M) = 1e-16 at the L zero
  |u| = 0.447214 = 5^(-1/2). So Theorem 1 and section 2 are not special to q = 3.
- Sector table, author's `t3_sector.py` on the new N at n = 4, a character of order 40 (ball radii <= 3e-98):
  det(1-M | V+) = (1-3u)^(-1) (1-u)^11 x [four roots at 0.333333, four at 0.577350 with the arguments of the zeros
  of L(u,chi) and L(u,chibar)]; det(1+M | V-) = (1-u)^10 x [eight roots at 0.333333];
  det(1+M | V+): 15 roots, radii 0.3078 .. 0.8812; det(1-M | V-): 12 roots, radii 0.3263 .. 0.8892.
  Same pattern as the result. Cross-check with the independent matrix: at the reported non-geometric real roots
  u = 0.881204 and 0.669425, sigma_min(1 + M | V+) = 2e-6 and 2e-7 (consistent with 6-digit rounding), while
  sigma_min at u = 0.75 is 0.31.
- The disclosed factor 1 - 2u + 3u^2 in the non-geometric sectors does not occur for this N (nearest radii 0.5368,
  0.5586). It is therefore specific to N = T^4 + T^3 + T^2 + 1, not a feature of the model.
- Norm row S4: max ||M | V+|| = 1.0000 on |u| = 1/9 and 3.0000 on |u| = 0.2. Confirmed.

## 3. Controls run by the referee

- **Davenport-Heilbronn analogue** (new N, a different pair of characters): f = g_1 - g_2 satisfies the functional
  equation to 5e-16; its zeros are at |u| = 1.0625 and 0.3137 (product 1/3); sigma_min(1 - M_1), sigma_min(1 - M_2)
  there are 0.046, 0.046 and 0.121, 0.114. No eigenvalue 1. The failing step named in the result (Theorem 1 is
  linear in the cusp functional; a sum of two cusp rows has poles at the zeros of each L, not of the combination)
  is correct. As the result says, this shows the construction does not produce f; it does not show that no other
  finite matrix model does.
- **Sign twist**: this is the result's control (b) (weight (-1)^(number of digits)); reproduced above on a new N.
  Outcome as claimed: the L factor is gone and the zeros are off the Weil circles.
- **Backward heat**: the result says "not formulable". Accepted for the rational function-field side. Over Z it
  was simply not run; statement C3 over Z therefore rests on the rotation control only.
- **Rotation over Z, different zero** (`/tmp/ref-n1ffm/zrot.py`, the result's matrix formula retyped; matrix
  entries checked against direct summation of L_s 1 and L_s (x-1) at x = 0.5, s = 3: agreement 6e-15).
  rho_2/2 branch, which the result did not run:

  | truncation | theta = 0 | theta = pi/64 |
  |---|---|---|
  | 20 | 0.27380 + 10.51380i | 0.28527 + 10.53840i |
  | 26 | 0.250107 + 10.510888i | 0.261016 + 10.535851i |
  | 30 | 0.2499973 + 10.5110238i | 0.2609052 + 10.5359936i |

  rho_2/2 = 0.25 + 10.5110198i. Rate d(Re s)/d(theta) = 0.222 at truncation 30 (the result reports 0.244 on the
  rho_1 branch). The qualitative claim is confirmed on a second zero. Note the truncation sensitivity: at
  truncation 20 the unrotated zero is 0.024 off the line at this height, the same size as the rotation effect, so
  only the truncation >= 26 rows are evidence. The rho_1 table of the result (truncation 24, checked at 32) is at
  lower height and is consistent with this.

## 4. Errors and over-statements

- **E1 (gap in Theorem 1 (e), minor).** "M is analytic at u_0 != 1/q" needs L(1/q, chi) != 0. That is classical
  (non-vanishing at s = 1) and weaker than Weil, but it is used without being stated. Also, for general q the
  theorem's "V+" must be read as the F_q^*-torus invariants (M maps the lambda-isotypic part to the
  lambda^(-1)-isotypic part, so invariants and their complement are both preserved; ev_0 kills the complement).
  The statement is correct with that reading; the text defines V+ only for q = 3.
- **E2 (over-label).** Sections 4 and 9 say "the divisibility by L(u,chi) L(u,chibar) is PROVED (and for real chi
  only to first order)". Theorem 1 plus S2 give, at each point, ord det >= max(ord L(u,chi), ord L(u,chibar)).
  That is divisibility by the least common multiple. At every common zero the product is not proved: u = 1 for
  every even chi (the tables show (1-u)^2 or more, so it is true in the computed cases), any real zero of L*, and
  all zeros when chi is real. Correct label: lcm PROVED; product EXACT/BALL for q = 3, n <= 4.
- **E3 (scope of the obstruction sentence).** "No property invariant under M -> -M forces the line" is a correct
  inference from the tables for q = 3, n <= 4, and it does cover the listed properties (W D factorisation, Krein
  relation, norm, normality defect, mass identities). It does not address properties that are not sign-invariant:
  entrywise or trace positivity of M for real u in (0, 1/q), Perron-Frobenius structure, and the lattice-sum
  resummation itself. The result says in item 5 that the separating fact is the resummation, so this is a matter
  of wording, but the one-line claim should read "no sign-invariant matrix property". For q > 3 the analogue of
  the non-geometric sectors (other torus-isotypic components) was not computed by the author or by me.
- **E4 (the Z rotation is generic, not a finding).** If lambda(s) is the eigenvalue branch with lambda(rho/2) = 1,
  then the zero of det(1 - e^(i theta) L_s) satisfies ds/dtheta = -i / lambda'(rho/2) at theta = 0. It stays on
  Re s = 1/4 to first order only if lambda'(rho/2) is real, which nothing requires. The measured rates (0.244,
  0.222) are values of Im(1/lambda'), nothing more. The two-variable determinant det(1 - z L_s) is standard in
  the Mayer / Ruelle literature. The rotation is a legitimate cheap control, and C3 is a correct restatement of
  the campaign wall ("identities hold for the controls"); it should not be listed as a new result.
- **E5 (prior art not cited).** The construction is the function-field analogue of the representation-twisted
  transfer operator of Chang-Mayer and Manin-Marcolli for Gamma_0(N) (induced representation on P^1(Z/N)); the
  splitting into P-sectors with separate Fredholm determinants is the analogue of Fraczek-Mayer (Algebra Number
  Theory 6, 2012); zeros leaving the line under a unitary deformation of the twist is the analogue of the
  character deformation for Gamma_0(4) (Bruggeman-Fraczek-Mayer; Phillips-Sarnak). The Z identity is credited as
  classical in the result, correctly. Two web searches found no source for the F_q[T] finite-matrix model or for
  Theorem 1 in that form; I could not confirm or exclude prior function-field literature (Selberg / Ihara zeta of
  PGL_2(F_q[T]) congruence quotients). "New" should be read as "new relative to the campaign map".
- **E6 (minor wording).** For n = 4 the middle coefficient of L* is 1 + (sum of chi over monic linear polynomials),
  not the bare sum; the criterion |g_1| <= 2 sqrt q is for the normalised middle coefficient. Lemma 0 (iii)
  (identification with the dynamical zeta function) is a one-line argument labelled PROVED; it is not used later.

## 5. Checks requested by the assignment

- RH assumed anywhere: no. Weil's theorem for L(u,chi) is cited as CLASSICAL and is the stated source of the radius.
- Verified height restated: no.
- Known theorem presented as new: partly, see E4 and E5. Theorem 1 is an Eisenstein-period / Euclid identity in a
  setting where I found no reference; the result itself describes it as "Euclid plus Moebius", which is accurate.
- Control step named: yes, and it is the right one (the coefficient function must be an eigen-character of the
  torus, i.e. multiplicativity; an identity-level step).

## 6. What survives

For N irreducible of degree n over F_q and chi even non-trivial: M(u) = W D(u) with W a Hermitian unitary
involution and D(u) normal with the n+1 stated eigenvalues (PROVED; checked for q = 3, 5). Theorem 1 as stated,
with L(1/q,chi) != 0 added as a classical input and V+ read as torus invariants (PROVED; checked on three new
cases to 1e-13). Divisibility of det(1 - M | invariants) by lcm(L(u,chi), L(u,chibar)) (PROVED). For q = 3,
n <= 4 (EXACT / BALL, reproduced on a second N at n = 4): the geometric sectors have all zeros on |u| = 1, 1/q,
q^(-1/2), 1/q^2; the sign-flipped operator on the same spaces has zeros at radii 0.24 .. 0.92. Hence no
sign-invariant matrix property of M(u) forces the circle; the radius comes from Weil's bound for L(u,chi). Over Z
(MEASURED, two zeros): the cusp resolvent identity, and first-order departure from Re s = 1/4 under phase rotation,
the latter being generic. No route to RH; no transplant of the function-field proof. Row T3 of the map is unchanged.
