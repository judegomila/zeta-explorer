# n1-ff-mayer: function-field Mayer operator as a finite matrix; where the L-factor comes from and what does not force the line

Date: 2026-11-17. Scratch note under `tmp/research-2026-11-16/push/n1-ff-mayer/`. Not refereed. No RH claim, no new
zero-free region, no Lambda bound changes.

Labels: PROVED (argument written here), CLASSICAL (cited), EXACT (computer algebra over Q(zeta), sympy),
BALL (flint acb ball arithmetic at 600 bits, radii printed), MEASURED (double precision or mpmath, not certified),
ARGUED, OPEN.

## Verdict

**Precise obstruction, with one proved identity and exact tables. The first test did not kill the model; the structure
tests kill the hope that a matrix property forces the line.**

1. The model exists and is finite. For N irreducible of degree n over F_q and chi an even character mod N, the
   function-field Mayer operator restricted to functions constant in x is a (q^n+1)-square matrix
   `M(u) = W D(u)`, u = q^(-2b), with W a u-independent Hermitian unitary involution (inversion twisted by chi) and
   D(u) a normal matrix, diagonal in the additive Fourier basis of F_q[T]/N, with n+1 distinct explicit eigenvalues
   (PROVED, section 2).
2. The L-factor enters through the resolvent on the cusp functional (PROVED, Theorem 1):
   `ev_0 (1 - M(u))^(-1) = Phi_all(u) / ((q-1) L(u,chi))`, with Phi_all an explicit polynomial lattice-sum functional that
   does not vanish at any zero of L. This is Euclid's algorithm plus Moebius inversion over the gcd. It is a matrix-level
   structure, so the stated kill condition (cancellation only) is not met.
3. Exact factorisations (q = 3; EXACT for n = 2, 3; BALL for n = 4, six characters): in the two sectors where the
   weight is a character of GL_2(F_q[T]) every zero of the determinant lies at |u| = 1, |u| = 1/q, |u| = q^(-1/2) or
   u = 1/q^2, and the zeros at |u| = q^(-1/2) are exactly those of L(u,chi) L(u,chibar).
4. In the other two sectors the same matrix M(u), with the same W, the same D(u), the same Krein symmetry and the same
   norms, has eigenvalue -1 events at radii between 0.24 and 0.92, off every Weil circle (EXACT n = 2, 3; BALL n = 4).
   So no property of M(u) that is invariant under M -> -M (or M -> e^(i theta) M) forces the line. This covers every
   property listed in the assignment: unitary-times-diagonal factorisation, normality, a sigma_3-type form,
   a Gauss-sum unitary factor, operator norm and spectral radius.
5. What separates the two cases is only whether the digit weight is a character of the group, i.e. whether the Neumann
   series of M on the cusp vector resums to a lattice sum. The radius of the zeros of L(u,chi) is then inherited from
   L(u,chi); the matrix adds no inequality. In the matrix language the radius statement is a character-sum bound
   (n = 4: `|sum of chi over monic linear polynomials, normalised| <= 2 sqrt q`), whose only known proofs are
   Weil / Stepanov. Row T3 stands: no transplant.
6. Over Z the same two facts were checked numerically for Mayer's operator L_s (MEASURED): the cusp resolvent identity
   `[(1 - L_s)^(-1) 1](0) = 2 zeta(2s-1)/zeta(2s)`, and the rotation control: the zero of det(1 - e^(i theta) L_s)
   that starts at rho_1/2 leaves Re s = 1/4 at first order in theta (Re s - 1/4 = 0.0120 at theta = pi/64).

New control for the campaign list (section 6): **phase rotation of the transfer operator.** Any argument that locates
eigenvalue-1 events of a transfer operator using properties invariant under multiplication of the operator by a
unimodular constant is wrong; in the function-field model it already fails for the constant -1.

## 0. Plan, and what is new relative to the map

Read: BRIEF.md (all notices), OBSTRUCTION_MAP.md sections 1, 2, 5, rows T1-T3, G16, `ff-transplant/RESULT.md`.
No ssh. Every run went through `scripts/memcap.sh 8`, single process, longest run 104 s.

Not in the map before: a transfer-operator (Mayer) model over F_q[T]; the map's function-field rows are TRO6 (T1),
Stepanov-Bombieri (T2) and Hodge index (T3), and section 6 item 15 lists operator constructions as not assessed.

Plan as assigned: (1) first lemma; (2) first test in exact arithmetic for q = 3, deg N = 2, 3; (3) structure tests;
(4) controls (a) DH analogue, (b) incompatible weights, (c) modified local factor; (5) answer the T3 question;
(6) candidate statement over Z. One addition: n = 4 in ball arithmetic, because for n <= 3 the non-trivial part of
L(u,chi) has degree <= 1 and its zero is on the circle by the functional equation alone. Degree 4 is the first case
with content (degree 2, on the circle iff a character sum is <= 2 sqrt q).

## 1. The model

A = F_q[T], K_inf = F_q((1/T)), unit ball m = {|x| < 1}. Continued fractions: x = 1/(a_1 + 1/(a_2 + ...)), digits
a_i in A with deg a_i >= 1, no adjacency restriction (CLASSICAL). Inverse branches x -> 1/(a + x), with
|d/dx| = |a|^(-2) exactly, constant in x. Put u = q^(-2b), so |a|^(-2b) = u^(deg a).

R = A/N, N monic irreducible of degree n, chi a character of R^*, even (trivial on F_q^*).
V_chi = { f on R^2 minus 0 : f(lam v) = chi(lam) f(v) }, dimension q^n + 1, basis: values at v_x = (x,1), x in R,
and v_inf = (1,0). GL_2(A) acts by (rho(g) f)(v) = f(v g) (row vectors); rho is unitary (monomial with unimodular
entries). g_a = [[0,1],[1,a]], so (m,n) g_a = (n, m + a n): one Euclid step backwards.

    (L f)(x, v) = sum_{deg a >= 1} u^(deg a) f(1/(a + x), v g_a),        M(u) = sum_{deg a >= 1} u^(deg a) rho(g_a).

**Lemma 0 (PROVED).** (i) Functions constant in x are preserved by L, and L acts on them by M(u). (ii) rho(g_a)
depends only on a mod N and for d >= n each residue class has (q-1) q^(d-n) elements of degree d, hence

    M(u) = sum_{d=1}^{n-1} u^d B_d + ((q-1) u^n / (1 - q u)) C,    B_d = sum_{deg r = d} rho(g_r),  C = sum_{r in R} rho(g_r),

a matrix of rational functions with a single pole at u = 1/q; det(1 - M(u)) is rational, and
(1 - q u)^(q^n+1) det(1 - M(u)) is a polynomial of degree <= n (q^n + 1). (iii) A function of (x,v) that depends on
x only modulo T^(-k) is mapped by L to one depending on x modulo T^(-(k-2)) at most, because each branch contracts
by |a|^(-2) <= q^(-2); so on locally constant functions the non-zero spectrum of L is that of M(u), and the dynamical
zeta function of the twisted Gauss map is 1/det(1 - M(u)) = exp sum_k (1/k) tr M(u)^k (full shift, weights depending
on the first digit only).

**Torus symmetry (PROVED).** For c in F_q^*, delta_c = diag(c,1): g_a delta_c = c delta_c^(-1) g_(a/c), hence
M rho(delta_c) = chi(c) rho(delta_c)^(-1) M. For q = 3 and chi even, P = rho(delta_(-1)) (x -> -x on the affine
points, v_inf fixed) commutes with M, W and D. V = V+ (+) V-, dimensions (q^n+3)/2 and (q^n-1)/2.

**Which sectors are geometric (ARGUED; see weakest step 2).** Closed geodesics of GL_2(A) on the tree are the periodic digit
sequences up to the twist x -> c x, so the geodesic L-function of rho is det(1 - M | torus invariants). The principal
series Ind(chi_1, chi_2) with chi_1 chi_2 even equals V_chi (x) (chi_1 o det) with chi = chi_2/chi_1 even; if chi_1
is odd then rho(g_a) changes sign and so does P. Therefore

    geometric:      det(1 - M | V+)   and   det(1 + M | V-)
    non-geometric:  det(1 + M | V+)   and   det(1 - M | V-)

In the non-geometric pair the weight of a closed geodesic is (-1)^(number of digits in the period) relative to a
geometric one. This is not a character of PGL_2(F_3[T]): by Nagao's amalgam the only character of order 2 is
sign(det), and sign(det) = (-1)^(digits + twist). So the non-geometric sectors are control (b) (weights not compatible
with the group action), produced by the model itself.

## 2. Structure of the matrix (PROVED; checked numerically, `out_structure_n3.txt`, `out_structure_n4.txt`)

g_a = w n(a) with w = [[0,1],[1,0]], n(a) = [[1,a],[0,1]]. Hence

    M(u) = W D(u),   W = rho(w),   D(u) = sum_{r in R} c_r(u) rho(n(r)),   c_r(u) = u^(deg r) [deg r >= 1] + (q-1) u^n/(1 - q u).

- **S1.** W is a Hermitian unitary involution, independent of u: in the coordinate y = second/first,
  (W f)(y) = chi(y) f(1/y). Signature of W: (+15,-13) for n = 3, (+42,-40) for n = 4.
- **S1'.** rho(n(r)) is translation y -> y + r and fixes v_0 = (0,1). So D(u) is diagonal in the additive Fourier
  basis psi_t(y) = e(Res(t y / N)), together with delta_(v_0). Its eigenvalue at frequency t depends only on
  j = n - deg t. With z = q u:

      c^_1 = 0,     c^_j(u) = ((q-1) z - q z^(j-1) + z^j)/(1 - z)  (2 <= j <= n),     kappa(u) = (q-1) z/(1 - z)  (t = 0 and delta_(v_0)),

  multiplicities (q-1) q^(n-j) and 2. (Checked: all multiplicities match for n = 3, 4.) So rank M(u) <= q^(n-1) + 1,
  D(u) is normal, D(u)^* = D(ubar), D is real for real u.
- **S2 (sigma_3-type form).** M(u)^* W = W M(ubar). M(u) is self-adjoint for the indefinite form [f,g] = <W f, g> when
  u is real. Consequences: det(1 - M(u)) has real coefficients (so the zeros of L(u,chibar) accompany those of
  L(u,chi)); at an eigenvalue-1 event with eigenvector f and shell masses m_j = ||Pi_j f||^2,

      sum_j m_j Im c^_j(u) = 0,      sum_j m_j (|c^_j(u)|^2 - 1) = 0.

  These two real equations do not confine u: the same two equations hold verbatim at every eigenvalue -1 event
  (D f = -W f), and those occur off the circles (section 4).
- **S3.** M(u) is not normal: ||[M, M^*]|| / ||M||^2 = 0.55 (n = 3), 0.67 (n = 4) on V+ at |u| = q^(-1/2). V_chi is
  an irreducible GL_2(R)-module for chi non-trivial, so there is no u-independent "cuspidal complement" on which to
  ask for normality; the eigenvectors at different zeros are unrelated vectors of one irreducible module.
- **S4 (norm).** max over |u| = r of ||M(u)|| on V+ is 1.000 at r = 1/q^2 and 3.0 at r = 0.2; the spectral radius
  passes 1 between r = 0.20 and 0.30 (n = 3: 1.233 at r = 0.25). Contraction therefore covers |u| < 1/q^2 only,
  i.e. Re 2b > 2. This is wall 5.3 of the map in this model.
- **S5 (Gauss-sum factor).** In the Fourier basis W is the matrix of chi-twisted Kloosterman sums
  q^(-n) sum_y chi(y) psi(s y + t/y) (the finite-field Bessel function of the principal series), bordered by two cusp
  rows. Its unitarity is formal; Weil's bound on its entries is not used by any of S1-S4.

## 3. First lemma: the L-factor (PROVED)

Notation: ev_v is evaluation at v (ev_(lam v) = chi(lam) ev_v, ev_(0,0) = 0), ev_0 = ev_(0,1).
S_< = {(m,n) in A^2 : n != 0, deg m < deg n} (m = 0 allowed).

    Phi_prim(u) = sum_{(m,n) in S_<, gcd(m,n) = 1} u^(deg n) ev_(m,n),        Phi_all(u) = sum_{(m,n) in S_<} u^(deg n) ev_(m,n).

**Theorem 1.** Let chi be even and non-trivial. As rational functions of u,

    ev_0 (1 - M(u))^(-1) = Phi_prim(u)/(q-1) = Phi_all(u) / ((q-1) L(u,chi)),

where Phi_all(u) = sum_{d=0}^{n-1} u^d sum_{deg n = d} sum_{deg m < d} ev_(m,n) is a polynomial of degree <= n-1 with
Phi_all(0) = (q-1) ev_0, and Phi_all(u_0) != 0 at every zero u_0 of L(u,chi). Consequently
ord_(u_0) det(1 - M(u) | V+) >= ord_(u_0) L(u,chi), and the same for chibar.

Proof. (a) ev_v M = sum_a u^(deg a) ev_(v g_a). The map ((m,n), a) -> (n, m + a n) is a bijection from
{primitive pairs in S_<} x {deg a >= 1} onto {primitive (m',n') : 0 <= deg m' < deg n'}: the inverse is division with
remainder n' = a m' + m, and deg n' = deg a + deg n. So Phi_prim M = Phi_prim - sum_{c in F_q^*} ev_(0,c)
= Phi_prim - (q-1) ev_0 (chi even), an identity of formal power series in u; M(u) = O(u) gives the first equality.
(b) Sorting all pairs by their monic gcd d: Phi_all = sum_d chi(d) u^(deg d) Phi_prim = L(u,chi) Phi_prim (pairs with
N | d evaluate to 0). (c) For deg n = d >= deg N the inner sum over m covers every residue q^(d-n) times and equals
q^(d-n) chi(n) sum_x ev_(x,1) (or 0 if N | n); summed over n of degree d this vanishes since chi is non-trivial. So
the series stops at d = n-1. (d) The coefficient of Phi_all at the projective point [1 : T] collects exactly the pairs
(m', m' T) with deg m' <= n-2 (if m' T = n' mod N with both sides of degree < n, they are equal), and equals
(q-1) u (L(u,chi) - A u^(n-1)), A = sum of chi over monic polynomials of degree n-1. At a zero u_0 this is
-(q-1) A u_0^n, non-zero because L(u,chi) has exact degree n-1 for primitive chi (CLASSICAL). (e) ev_0 vanishes on V-,
and M is analytic at u_0 != 1/q, so a pole of the resolvent row forces det(1 - M(u_0) | V+) = 0 to at least that
order. The chibar statement follows from S2. QED

Numerical check: || ev_0 (1 - M)^(-1) - Phi_all/((q-1) L) || <= 3e-14 at three complex u, n = 3 and 4; smallest
singular value of 1 - M(u_0) on V+ at each L zero <= 1.3e-16.

Remarks. (i) Step (a) is the only place where the weights matter: the Neumann series sum_k ev_0 M^k is a sum over the
orbit of (0,1) under the free semigroup generated by the g_a, and that orbit is the set of primitive lattice points
of a cone. With weights eps(a) u^(deg a) the same series is sum over (m,n) of (product of eps along the Euclid chain)
u^(deg n) ev_(m,n); it is a Dirichlet series in n only when the product depends on (m,n) through a character.
(ii) The identity is linear in the coefficient function: for any h on R^* (in place of chi, on the regular
representation) the same proof gives ev^h_0 (1 - M) = cusp vector with entries the partial zeta functions
sum_{n = r mod N} u^(deg n). A determinant statement follows only when h is an eigen-character of the diagonal
torus, i.e. when V_h is a subrepresentation.

## 4. First test: exact factorisations (q = 3)

Scripts: `t2_exact.py` (sympy, K[u] with K = Q(zeta_ord chi), fraction-free determinant), `t3_sector.py` (flint acb,
600 bits, DFT interpolation of (1-qu)^d det, exact deflation of the factors (1-qu), (1-u), (1+u), mpmath roots).
Outputs: `out_exact_3_2.txt`, `out_exact_3_3.txt`, `out_sector_3_3.txt`, `out_sector_3_4.txt`. The two methods agree
on every n = 2, 3 case.

L(u,chi) = (1-u) L*(u,chi) for even non-trivial chi; L* has degree n-2.

### 4.1 n = 2, N = T^2 + 1 (EXACT)

| chi | det(1-M \| V+) geometric | det(1+M \| V-) geometric | det(1+M \| V+) non-geometric | det(1-M \| V-) non-geometric |
|---|---|---|---|---|
| trivial | (1-9u)(1-u)(1+u)/(1-3u)^2 | 1-u | (1+3u)(1-6u+13u^2)/(1-3u)^2 | 1+u |
| order 4 | (1-u)^2/(1-3u) | 1-u | (1-5u)(1-2u+9u^2)/(1-3u)^2 | 1+u |
| order 2 | (1-u)^2/(1-3u) | 1+3u | (1-5u)(1-2u+9u^2)/(1-3u)^2 | 1-3u |

Geometric zeros: |u| = 1, |u| = 1/3, u = 1/9. Non-geometric: a zero at u = 1/5, and 13u^2 - 6u + 1 has |u| = 0.277.
(Odd chi, whole V: det(1-M) = 1 + 3u^2. Not geometric, the centre acts by -1; recorded only.)

### 4.2 n = 3, N = T^3 + 2T^2 + 1 (EXACT; chi of order 13, two characters, and trivial)

    chi non-trivial:  det(1-M | V+) = L(u,chi) L(u,chibar) (1-u)^2 / (1-3u)
                      det(1+M | V-) = (1-u)^3 (1 + c u + 9u^2),   c in Q(zeta_13) real, both roots at |u| = 1/3
    chi trivial:      det(1-M | V+) = (1-9u)(1-u^3)(1-u)^3 / (1-3u)^2
                      det(1+M | V-) = (1-u)^3 (1 + 5u + 9u^2)

    non-geometric, chi trivial:  det(1-M | V-) = (1+u)^2 (1 - 4u + 8u^2 - 9u^3)          roots |u| = 0.4499, 0.4969, 0.4969
                                 det(1+M | V+) = (1+3u)(1+u)^2 (1 - 5u + 12u^2 - 29u^3 + 37u^4)/(1-3u)^2   roots |u| = 0.396, 0.415
    non-geometric, chi = chi_2:  det(1-M | V-): roots |u| = 0.3963, 0.3963, 0.7074;   det(1+M | V+): |u| = 0.274, 0.409, 0.434

The exponent 3 of (1-u) for trivial chi equals the genus of X_0(N) for deg N = 3, q = 3 (Gekeler: (q^3-q)/(q^2-1));
the reading "harmonic cochains are special at infinity and contribute u = 1" is ARGUED, not proved here.

### 4.3 n = 4, N = T^4 + T^3 + T^2 + 1 (BALL; coefficient ball radii <= 2e-97; characters k = 0, 2, 10, 16, 20, 40, orders 1, 40, 8, 5, 4, 2)

For every non-trivial chi tested:

    det(1-M | V+) = L(u,chi) L(u,chibar) (1-u)^(8 or 9) Q_chi(u) / (1-3u)^e,   e = 1 (e = -1 for the quadratic character);
                    all roots of Q_chi at |u| = 1/3 (printed to 1e-6; ball radii 1e-97 on the coefficients)
    det(1+M | V-) = (1-u)^(9 or 10) Q'_chi(u),                                   all roots of Q'_chi at |u| = 1/3

and the four roots at |u| = q^(-1/2) are the two zeros of L*(u,chi) and their conjugates (arguments agree to the
printed 4 digits in each case; double roots for the quadratic character). Trivial chi:
(1-9u)(1-u^4)(1-u)^9 Q(u)/(1-3u)^2, exponent 9 = genus of X_0(N) for deg N = 4.

Non-geometric sectors, all six characters: 11 to 16 roots each, radii spread over [0.24, 0.92], for example
det(1+M | V+) for chi_2: 0.264, 0.342, 0.351, 0.366, 0.406, 0.432, 0.547, 0.577 (0.576794, not q^(-1/2)), 0.730, 0.882.
Disclosure: in seven of the twelve non-geometric determinants a pair at 0.577350 e^(+-0.3041 pi i) occurs, i.e. the
factor 1 - 2u + 3u^2, the same for all characters. It is on the circle |u| = q^(-1/2) but is not a zero of any
L(u,chi) tested; its origin was not identified.

**Summary of the first test.** MEASURED/EXACT statement: for q = 3, n <= 4,

    det(1 - M_chi | V+) = L(u,chi) L(u,chibar) C+_chi(u) / (1-qu)^e,    det(1 + M_chi | V-) = C-_chi(u),

with all zeros of C+- at |u| = 1 or |u| = 1/q. The general statement (all q, n, and the identification of C+- with
Hecke polynomials of Drinfeld-type cusp forms of nebentypus chi) is OPEN here; only the divisibility by
L(u,chi) L(u,chibar) is PROVED (Theorem 1), and for real chi only to first order.

## 5. Structure tests asked for in the assignment

| Test | Outcome | Label |
|---|---|---|
| M(u) = u^k U D with U unitary | M(u) = W D(u), W Hermitian unitary involution, D(u) normal with n+1 eigenvalues (section 2). No scalar u^k factors out. | PROVED |
| Normality on a cuspidal complement | M(u) is not normal (defect 0.55 to 0.67); no invariant complement exists, V_chi is irreducible | MEASURED / PROVED |
| sigma_3-type skew form | Exists: M(u)^* W = W M(ubar), W of signature (+42,-40) at n = 4. Gives real coefficients and two real mass identities, no confinement | PROVED |
| Gauss-sum unitary factor | W in the Fourier basis is the chi-twisted Kloosterman matrix; unitarity is formal | PROVED |
| Does any of these force |u| = q^(-1/2)? | No. Each is shared verbatim by -M(u) on the same space, and det(1 + M | V+) has zeros at radii 0.24 to 0.92 | EXACT (n = 2, 3), BALL (n = 4) |
| Rotation: zeros of det(1 - e^(i theta) M | V+) | theta = pi/16: no root left on |u| = q^(-1/2) or 1/q (n = 3: radii 0.306, 0.567, 0.569, 0.810, ...; n = 4: 0.308, 0.331, ..., 0.566, 0.576, 0.623, ...) | BALL |
| Deformation: W -> Q W Q^*, Q = exp(i eps H) unitary commuting with P | L zeros move off the circle linearly: eps = 0.01 gives |u| = 0.5842 (n = 3), 0.5764 and 0.5737 (n = 4); q^(-1/2) = 0.57735 | MEASURED |

The deformation row shows the class {Hermitian unitary involution} x {this D(u)} does not force the circle either;
the specific W is needed.

## 6. Controls

**(a) Davenport-Heilbronn analogue (n = 4).** For each even chi put g_chi = eps^(-1/2) L*(u,chi), eps = (leading
coefficient)/q; then g_chi(u) = q u^2 conj(g_chi)(1/(q ubar)), and the middle coefficient is real (checked for all 39
even characters: |eps| = 1 and Im = 0 to 5e-16; max |middle coefficient|/(2 sqrt q) = 0.924). Any real combination
f = r_1 g_1 + r_2 g_2 has the same functional equation. Example found by search: characters k = 4 and 78, f = g_4 - g_78,
zeros at |u| = 0.02796 and 11.924 (product 1/3), far off the circle.
- Step that fails (PROVED): Theorem 1 is linear, so on V_1 (+) V_2 the functional alpha_1 ev_0^(1) + alpha_2 ev_0^(2)
  has resolvent row alpha_1 Phi^(1)/((q-1) L_1) + alpha_2 Phi^(2)/((q-1) L_2). Its poles are the zeros of L_1 and of
  L_2, not of f. The right-hand side of the fixed-vector equation is the vector (alpha_1 L_1, alpha_2 L_2) on two
  independent cusp lines; it vanishes only where both L_i vanish.
- MEASURED: at the two zeros of f the smallest singular values of 1 - M_1 and 1 - M_2 on V+ are 0.046, 0.045 and
  0.893, 0.894; no eigenvalue 1.
- Not shown: "f is not the determinant of any twisted M" for all representations. For principal series the tables
  give it for q = 3, n <= 4. Discrete-series (cuspidal) representations of GL_2(R) and composite N were not run.
- DH therefore fails at "the coefficient function is an eigen-character of the diagonal torus", which is
  multiplicativity. This is an identity-level step, as in section 5 part 2 of the map.

**(b) Weights not compatible with the group action.** The non-geometric sectors of section 4: weight
(-1)^(number of digits). Recorded outcome: the factor L(u,chi) L(u,chibar) disappears completely (no root at
|u| = q^(-1/2) with the L arguments; the pole order at u = 1/q changes from 1 to 2), the cuspidal factors disappear,
and the zeros are off every Weil circle. The resolvent identity of Theorem 1 becomes
ev_0 (1 + M)^(-1) = sum over primitive (m,n) of (-1)^(Euclid length) u^(deg n) ev_(m,n) / (q-1), which is not
Phi/L for any Dirichlet series.

**(c) One modified local factor (T-NR type).** PROVED remark: the Euler product enters Theorem 1 only through
Phi_all = L Phi_prim, i.e. through the weight on the gcd. Replacing chi(d) u^(deg d) by any other multiplicative
gcd-weight w(d) changes Phi_all to L_w Phi_prim and leaves Phi_prim, the resolvent and the determinant unchanged. So a
modified local factor cannot be produced by changing the lattice sum; it would require changing M, and by (b) a
change of the digit weights that is not a group character removes the L-factor altogether. The legitimate change of
one local factor (level N -> N P) multiplies L by (1 - chi(P) u^(deg P)), zeros on |u| = 1. T-NR is not realised by
any member of the family; the failing step is "the L-factor is the denominator of the cusp resolvent of M".

**(d) Three standard filters.** Backward heat: not formulable (no flow on a rational function of u that keeps the
matrix form). Sign twist: control (b). DH: control (a).

**T3 question.** The property found (Theorem 1) is neither Riemann-Roch nor a character-sum bound: it is Euclid's
algorithm and Moebius inversion, an identity. The statement that the eigenvalue-1 events lie on |u| = q^(-1/2) is, in
matrix terms, a statement about the specific unitary W against the shells of D(u). For n = 4 it is exactly
|g_1(chi)| <= 2 sqrt q with g_1 the normalised sum of chi over the q monic linear polynomials; in general it is the
Weil bound for L(u,chi). The model supplies no proof of it and no reformulation that avoids it. So the separating step
is still Riemann-Roch (or Stepanov), reached here as a character-sum statement. No transplant.

## 7. Over Z: dictionary, two checks, candidate statement

Mayer's operator (CLASSICAL): (L_s f)(x) = sum_{a >= 1} (x+a)^(-2s) f(1/(x+a)). Writing f as a Laplace transform and
using int_0^inf e^(-x w) J_nu(2 sqrt(t x)) (x/t)^(nu/2) dx = w^(-nu-1) e^(-t/w), L_s is conjugate to

    B H_nu,   nu = 2s - 1,   (H_nu g)(x) = int_0^inf J_nu(2 sqrt(x t)) g(t) dt,   (B g)(t) = g(t)/(e^t - 1),   1/(e^t - 1) = sum_{a >= 1} e^(-a t).

| Function field | Z |
|---|---|
| additive Fourier variable t in A/N | Laplace variable t > 0 |
| D(u), eigenvalue sum_a u^(deg a) psi(t a) | Bose weight sum_a e^(-a t); the factor (x+a)^(-2s) is not constant in x, so s sits in the Hankel order |
| W: chi-twisted Kloosterman matrix, W = W^* = W^(-1) | H_nu, Bessel kernel, H_nu = H_nu^* = H_nu^(-1) for real nu > -1 |
| M(u)^* W = W M(ubar) | (B H_nu)^* H_nu = H_nu (B H_nu) for real nu |
| cusp functional ev_0 (frequency 0) | constant function 1 (Laplace density delta at t = 0) |
| Theorem 1 | (1 - L_s)^(-1) 1 = E#(x,s)/zeta(2s), E# = zeta(2s)(1 + (x+1)^(-2s)) + 2 sum_{1 <= c < d} (c x + d)^(-2s); at x = 0: 2 zeta(2s-1)/zeta(2s) |
| non-geometric sector: eigenvalue -1 | eigenvalue e^(i theta), theta not in {0, pi} (over Z both +1 and -1 are characters of PGL_2(Z)) |

Check 1 (MEASURED, `t7_Z_cusp_resolvent.py`, truncation 30 in the basis (x-1)^k, 60 digits):
[(1 - L_s)^(-1) 1](0) agrees with 2 zeta(2s-1)/zeta(2s) to 1e-5 .. 2e-7 at s = 3, 2+i, 0.8+2i, 0.4+3i (the error is
the truncation at the point x = 0, distance 1 from the centre); at x = 0.5, s = 3 the resolvent and E#/zeta(2s) agree
to 6e-12. The identity for Re s > 1 is the same Euclid bijection (each coprime pair 1 <= c < d is reached twice,
because of the two continued-fraction expansions); it is the classical period function of the Eisenstein series
(Lewis-Zagier), and the factor 2 and boundary terms were fixed by this numerical check, not re-derived from the
literature.

Check 2 (MEASURED, `t6_mayer_Z.py`, truncation 24, 80 digits): the zero of det(1 - L_s) near rho_1/2 is found at
0.249999993 + 7.067362627i (rho_1/2 = 0.25 + 7.067362571i). Following the zero of det(1 - e^(i theta) L_s) from it:

| theta/pi | 0 | 1/64 | 2/64 | 4/64 | 7/64 |
|---|---|---|---|---|---|
| Re s - 1/4 | -7e-9 | 0.01200 | 0.02370 | 0.04625 | 0.07796 |
| Im s | 7.06736 | 7.10835 | 7.14922 | 7.23064 | 7.35198 |

d(Re s)/d(theta) = 0.244 at theta = 0. Convergence (`out_mayer_Z_32.txt`): the theta = 0 zero is
0.24999999307 (truncation 24), 0.24999999991 (28), 0.25000000000606 (32); at truncation 32 the rotated zeros are
0.26199794724 + 7.10834923576i (theta = pi/64) and 0.27370182545 + 7.14922257077i (theta = 2 pi/64), equal to the
truncation-24 values to 5e-9. The truncation-32 run was stopped after theta = 2 pi/64 to stay under the 20-minute
limit; the rho_2 branch was not run.

**Candidate statement over Z (a reformulation with a named missing input; not a route).**

(C1, identity) For the Bose weight b(t) = sum_{a >= 1} e^(-a t), the Neumann series of B H_(2s-1) on the
zero-frequency vector resums to a lattice sum over Z^2 divided by zeta(2s), so that
<ev_0, (1 - B H_(2s-1))^(-1) delta_0> = 2 zeta(2s-1)/zeta(2s). For the weight -b (the character det of PGL_2(Z)) the
two continued-fraction expansions of each coprime pair have opposite signs and the lattice sum cancels to
1 - (x+1)^(-2s): no zeta factor, the odd sector is cuspidal (same as V- over F_q[T]). For e^(i theta) b with theta not
in {0, pi} the series is sum over coprime pairs of (e^(i theta l) + e^(i theta (l+1))) (c x + d)^(-2s), l the
continued-fraction length of c/d, which is not a Dirichlet series in d.

(C2, the statement that would be needed) For 1/4 < Re s < 1/2 the pencil H_(2s-1) - B (continued in s) has no kernel
vector with non-zero zero-frequency component. This is RH restated (the scattering quotient has no pole there).

(C3, obstruction; established by exact computation in the function-field model, MEASURED over Z) No hypothesis on the pair (H_nu, B) that is
also satisfied by (H_nu, e^(i theta) B) can imply C2. Unitarity and self-adjointness of H_nu, positivity and
monotonicity of b, complete monotonicity of b, the Krein relation, nuclearity, norm and singular-value bounds, and
bounds on the Bessel kernel are all of this kind (the Krein relation survives theta = pi only, and theta = pi is
already a counterexample over F_q[T]). The input that separates theta = 0 is C1, an identity; in the function-field
model the inequality is then supplied by Weil's theorem for L(u,chi), and the matrix contributes nothing further.

Relation to the common wall: C3 is section 5 part 2 of the map in transfer-operator form ("identities hold for the
controls; RH is the sign of a quantity the identity does not determine"), with the rotation e^(i theta) as an extra
control that is cheap to run. The norm row S4 is section 5 part 3 (contraction only where the series converges
absolutely: |u| < 1/q^2, i.e. Re 2b > 2).

## 8. Pivot

Not used. The idea was not killed at the first test; it ended at the structure tests with the obstruction above.
The strongest adjacent idea, not pursued: the geometric sector det(1 + M | V-) is purely cuspidal in every case
computed (no L-factor, all zeros at u = 1 or |u| = 1/q). There the location is Ramanujan-Petersson (Drinfeld), and a
self-adjoint Hecke operator confines zeros to {|u| = 1/q} or the positive real axis by a matrix property. That is the
function-field shadow of "Maass spectrum is real because the Laplacian is self-adjoint" and has no bearing on the
zeros of L, which are resonances; it is recorded only to mark where a matrix property does act.

## 9. Three weakest steps

1. **Scope of the factorisation.** Only divisibility by L(u,chi) L(u,chibar) is proved (Theorem 1, and only to first
   order when chi is real). The complete factorisations are computed for q = 3, one irreducible N per degree,
   n <= 4, with six of the 39 even characters at n = 4 in ball arithmetic (roots from mpmath on certified
   coefficients, not root-isolated). The identification of the remaining factors with cusp forms, and the genus
   reading of the exponent of (1-u), are ARGUED. Other q, composite N, and cuspidal representations of GL_2(A/N) were
   not run; the claim "DH is not a determinant of any twisted M" is therefore established only inside the principal
   series cases computed.
2. **"Geometric versus non-geometric" rests on a short argument.** That (-1)^(number of digits) is not a character
   uses Nagao's amalgam for GL_2(F_3[T]) quoted from memory, and the claim that det(1 - M | torus invariants) is the
   geodesic L-function uses the standard continued-fraction coding of geodesics on the tree without a written proof
   of the multiplicity bookkeeping (twisted periodic orbits, the role of the centre). The numerical facts (which
   sectors have Weil radii) do not depend on this; the interpretation as control (b) does.
3. **The Z side is numerical and thin.** The rotation table over Z comes from truncation 24 (first two rotated
   values confirmed at truncation 32 to 5e-9) and one zero. The conjugacy L_s = B H_(2s-1) is quoted (Mayer) with the Laplace
   computation sketched, not checked for domains or for the continuation to Re s < 1/2. C3 over Z is an obstruction
   to a class of arguments, supported by this measurement; it is not a theorem about L_s.

## 10. Files

- `ffm.py`: ring F_q[T]/N, rho(g_a), coefficient matrices, companion zeros, L(u,chi).
- `t2_exact.py` -> `out_exact_3_2.txt`, `out_exact_3_3.txt` (exact factorisations, four determinants per character).
- `t3_sector.py` -> `out_sector_3_3.txt`, `out_sector_3_4.txt` (ball arithmetic, n = 3, 4).
- `t4_structure.py` -> `out_structure_n3.txt`, `out_structure_n4.txt` (S1-S4, Theorem 1 check, deformation).
- `t5_controls.py` -> `out_controls_n3.txt`, `out_controls_n4.txt` (rotation), `out_controls_n4_dh.txt` (DH analogue).
- `t6_mayer_Z.py`, `t7_Z_cusp_resolvent.py` -> `out_mayer_Z_32.txt`, `out_Z_cusp.txt` (over Z).
- `t1_numeric.py`, `t1b.py`: first double-precision look (superseded).
- All runs: `scripts/memcap.sh 8 venv/bin/python <script> <args>`; arguments are in the first line of each output.
