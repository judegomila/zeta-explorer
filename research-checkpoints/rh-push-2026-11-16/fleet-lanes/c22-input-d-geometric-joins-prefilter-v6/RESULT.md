# c22-input-d-geometric-joins-prefilter-v6: RESULT

Date 2026-11-20. Round 22, kind combine (paper prefilter for the round-23 inverse-explore slot). It constructs
nothing. Labels: PROVED (argument in this note), CLASSICAL (recalled), PROVED-rel (relative to a file named),
ARGUED, EXACT (integer arithmetic, finite range), MEASURED, OPEN.

Nothing here is a statement about a zero of zeta. No bound moves. Server not used, no unit started (the first
test is on paper; the two check scripts are exact or 30-digit, local, through `scripts/memcap.sh 8`, < 100 MB).
No file outside this directory was edited.

## 0. Verdict

**Precise obstruction. No object passes; no round-23 lane is proposed from TS section 6 row 4.**

Input D (a bound on all partial sums of a completely multiplicative function) was joined to each of the ten
objects. Seven joined objects can be written; three have none (Klein, twistor, vortex), for one reason
(Lemma 0: a completely multiplicative unimodular function other than 1 has no reflection symmetry, and for
chi = 1 the hypothesis is trivial). Of the seven:

1. The first candidate (antibridge: Hankel operator Gamma_sigma with kernel L(e^(a+b)) e^(-sigma(a+b)), L the
   summatory Liouville function, symbol zeta(2s)/(s zeta(s)) on Re s = sigma) is a restatement (kind T):
   Gamma_sigma is bounded iff zeta(2s)/(s zeta(s)) is analytic in Re s > sigma (Theorem A, PROVED with a
   CLASSICAL converse). The Nehari distance of the boundary function does not read zeros right of sigma at
   all (Lemma B). The relation sum_{n<=x} L(x/n) = floor(sqrt x) gives a bound only for sigma > 1 (in the
   convolution algebra L^1) and stops exactly there (section 3.3); moving sigma to the left is conjugation by an unbounded weight.
2. Round-21 R1 test: fails. The function lambda(n)(-1)^(v_6(n)) (unimodular, not multiplicative) satisfies
   the partial-sum bound with the same exponent as lambda, its own all-n relation, and Hankel boundedness on
   the same half-line of sigma (Proposition 1, PROVED; EXACT on x <= 2e5). So no named step of candidate 1
   uses multiplicativity.
3. R3: fails. The completely multiplicative +-1 function g = lambda eps_S (Liouville times THIN) satisfies an
   all-n relation of the same shape, sum_{n<=x} eps_S(n) G(x/n) = floor(sqrt x), with unimodular completely
   multiplicative weights (PROVED; EXACT), and its series zeta(2s)/F_eps(s) has a real pole at b in (1/2, 1).
   What separates lambda from g is that the weight series (zeta against F_eps) has no zero right of 1/2: the
   target.
4. The other six joins are closed by: finite stage plus T (twin ladder, zero channels), T (bridge, shear,
   spinor), I plus M plus T (torus).

One general statement comes out and is the usable part for the screen (section 5, Proposition 2): on the
class of input D a step is either linear in f and reads the order of the integers (then the twin f(n)(-1)^(v_6(n))
passes it), or it characterises complete multiplicativity (f * f = d f, rank one of the matrix f(mn)) and
then does not read the order (every sign chain and every Beurling member passes it). No object on the list
couples the two.

Pivot (one, section 6): the relation f * f = d f. It is the only step found that V6 fails for a structural
reason. It fails the second clause of the R1 rule (HQ1 to HQ4 and E_a are multiplicative and fail it), fails
R3 (Liouville times THIN passes it), and its partial-sum form has loop map theta -> theta. Closed.

Requirement flags: R1 false, R2 false, R3 false, R4 false.

## 1. Plan; what is new relative to the map

New relative to the files: TS section 5 records "D: no object" in every row; this note writes the joined
objects. Rows read: OBSTRUCTION_MAP section 2 (controls), P14 (rate equals zero-free region, loop map
f(theta) = theta), P46 and item 48 (c4 Theorem 1), P51, T2 (one-sided bound as a Landau criterion, holds
verbatim for controls), G1, Q1 to Q5 (anticausal Hankel block; Q4: prime-side anticausal kernel is zero for
every sign twist), S3 (integer index + Nehari distance), TS sections 1, 2, 5, 6, `g-spinor-square-root`
sections 1 to 3, `c21-c4-r1-flag-test-lemma-e-hq-beurling` (V6; H(a); R1 rule version 6).

Order of work: (i) Lemma 0, where input D can be placed; (ii) candidate 1 in full; (iii) the R1 test and
the controls on candidate 1; (iv) the other nine objects; (v) the table; (vi) one pivot.

Notation. lambda = Liouville function, L(x) = sum_{n<=x} lambda(n), F_lambda(s) = zeta(2s)/zeta(s),
D(s) = F_lambda(s)/s = int_1^inf L(x) x^(-s-1) dx (Re s > 1). Theta = sup Re rho. For a sequence f:
S_f(x) = sum_{n<=x} f(n), F_f(s) = sum f(n) n^-s. V6(n) = (-1)^(v_6(n)). eps_S = THIN (completely
multiplicative, -1 on a thin set S of primes, +1 elsewhere), F_eps = zeta(s)(s - b)^k W(s), k = 1 or 2.

## 2. Lemma 0: where input D can be placed

**Lemma 0.**
(a) (PROVED, trivial) For chi = 1 input D holds with c = 1, E(x) = O(1), and c4 Theorem 1 is empty.
(b) (CLASSICAL-rel map rows P56, P57, X1: Hamburger) A unimodular completely multiplicative chi whose series
has zeta's functional equation, finite order and a pole clause is chi = 1.
(c) (PROVED) Hence a join of input D with zeta as target uses a derived completely multiplicative function.
The ones built from zeta alone are n^(-i alpha) (a height translate; hypothesis trivially true), lambda, and
lambda n^(-i alpha). For lambda: F_lambda(s) = [chi(2s)/chi(s)] zeta(1 - 2s)/zeta(1 - s) with
chi(s) = zeta(s)/zeta(1 - s); the reflected factor zeta(2w - 1)/zeta(w), w = 1 - s, has coefficients
sum_{k^2 | n} k mu(n/k^2), which is not lambda. Poles of F_lambda are at the zeros rho (Re s = 1/2 under RH),
zeros at rho/2 (Re s = 1/4 under RH) and at -1, -2, ...; abs(chi(2s)/chi(s)) is asymptotic to
2^(1/2 - 2 sigma) (t/2 pi)^(-sigma), which is 1 on no vertical line. F_lambda is real on no vertical line.
(d) (PROVED) Consequence: an object whose definition uses the reflection s -> 1 - s of one function (a
balance line, an antiholomorphic involution, a real structure, a real entire H) has no D-joined form with
that symmetry. Its D-join, if any, is the object evaluated on F_lambda without the symmetry.

Input D for lambda is the hypothesis L(x) << x^theta for all x. CLASSICAL: the infimum of admissible theta is
Theta. So the hypothesis of any D-join aimed at zeta is equivalent to its conclusion unless the object
supplies a new way to bound L(x). That is what is tested below.

## 3. Candidate 1: the antibridge Hankel block with symbol zeta(2s)/(s zeta(s))

### 3.1 The joined object

For sigma > 0, k_sigma(u) = L(e^u) e^(-sigma u) (u >= 0). Gamma_sigma is the integral operator on L^2(0, inf)

    (Gamma_sigma phi)(a) = int_0^inf k_sigma(a + b) phi(b) db;

in multiplicative variables on L^2((1, inf), dx/x) the kernel is L(xy)(xy)^(-sigma). In the notation of the
square-root lane this is Q M P for the convolution operator M with kernel k_sigma, after the reflection of
P L^2 onto Q L^2; the analytic symbol is K_sigma(z) = int_0^inf k_sigma(u) e^(-zu) du = D(sigma + z).

**Theorem A.** Let f be a sequence with f(n) = O(n^C), c a constant, E(x) = S_f(x) - c x, kernel
k_sigma(u) = E(e^u) e^(-sigma u), K(s) = F_f(s)/s - c/(s - 1).
(i) (PROVED) If E(x) << x^theta and sigma > theta, then k_sigma is in L^1 and
norm(Gamma_sigma) <= norm(k_sigma)_1 (Young). It is also Hilbert-Schmidt (int u abs(k_sigma(u))^2 du finite).
(ii) (PROVED) If the form B(phi, psi) = int int k_sigma(a + b) phi(b) psi(a) is bounded on L^2 by N, then K
continues analytically to Re s > sigma and abs(K'(s)) <= N/(2 (Re s - sigma)) there.
  Proof. For Re w > 0 put phi_R(a) = e^(-wa) on [0, R], 0 elsewhere; norm(phi_R)^2 <= 1/(2 Re w).
  B(phi_R, phi_R) = int_0^(2R) k_sigma(u) e^(-wu) m_R(u) du =: J_R(w), m_R(u) = u on [0, R], 2R - u on
  [R, 2R]. J_R is entire, abs(J_R(w)) <= N/(2 Re w) on Re w > 0 for every R, and for Re w large
  J_R(w) -> int_0^inf u k_sigma(u) e^(-wu) du = -K'(sigma + w). By Vitali's theorem J_R converges locally
  uniformly on Re w > 0; the limit continues -K'(sigma + w) with the same bound. The half-plane is simply
  connected, so K continues. QED
(iii) (PROVED from (i), (ii) and the CLASSICAL bound L(x) << x^(Theta + eps)) For f = lambda, c = 0:
inf{sigma : Gamma_sigma bounded} = Theta. (For sigma < 1/2 the pole of zeta(2s) at 1/2 is not cancelled,
zeta(1/2) != 0; for sigma >= 1/2 a pole of D right of sigma is a zero of zeta, since zeta(2 rho) != 0.)

So "Gamma_sigma bounded for every sigma > 1/2" is RH, by the Mellin transform and Landau-type continuation.
It is map row T2 / P14 in operator form (kind T). Theorem A holds for every sequence of polynomial growth:
nothing in it is arithmetic.

### 3.2 Nehari reading (Lemma B)

CLASSICAL (Nehari on the half-line): a Hankel operator with bounded symbol phi on the line Re z = 0 has norm
dist(phi, H^inf(Re z < 0)); its kernel is the restriction to u > 0 of the Fourier transform of phi.

**Lemma B.** Let 1/2 < sigma < 1 be such that phi_sigma(t) = D(sigma + it) (the meromorphic function on the
line) is bounded. Let Gamma[phi_sigma] be the Hankel operator of this boundary function.
(i) (CLASSICAL) Gamma[phi_sigma] is bounded with norm <= sup abs(phi_sigma), whether or not zeta has zeros
in Re s > sigma, and its norm is unchanged when a function bounded and analytic in Re z < 0 is added to the
symbol. The principal part of D at a pole rho with Re rho > sigma is such a function (in z = s - sigma).
(ii) (PROVED from Theorem A) If zeta has a zero in Re s > sigma then Gamma_sigma is unbounded, hence
Gamma_sigma != Gamma[phi_sigma]: the causal kernel k_sigma is not the positive-frequency part of phi_sigma.
(iii) (ARGUED; contour shift, convergence over infinitely many zeros not treated) the two kernels differ by
the residue sum over zeros right of sigma, sum Res_(s = rho) D(s) e^((rho - sigma) u), growing exponentials.
Toy case (PROVED; 6-digit check in `referee_check.log` (c)): K(z) = 1/(z - p), Re p > 0, is bounded by
1/Re p on the line, its inverse transform is -e^(pu) on u < 0 and 0 on u > 0, so the Hankel operator of the
boundary function is 0, while the causal kernel with Laplace transform K is e^(pu), unbounded.

Reading. The distance to H^inf of the boundary function is blind to zeros right of sigma; it reads the
singularities left of sigma. The statement that carries the content is "the causal kernel equals the
positive-frequency part of the boundary function", which is the same kind of statement as Gamma_- = 0 in
`g-spinor-square-root` section 2 (S causal), with the same status: it is the target. Map row S3 already
records that the Nehari route needs an arithmetic approximant and has none.

Size near the line (ARGUED from Theorem A (ii)): at a simple zero rho = 1/2 + i gamma with residue
r = zeta(2 rho)/(rho zeta'(rho)), taking s = rho + 2(sigma - 1/2) gives norm(Gamma_sigma) >=
(1 + o(1)) abs(r)/(2 (sigma - 1/2)) as sigma -> 1/2. A bound norm(Gamma_sigma) << 1/(sigma - 1/2) would
bound all residues; this is the known consequence of L(x) << x^(1/2) (simple zeros, bounded residues).

### 3.3 The all-primes relation, and how sigma moves (R4)

sum_{n<=x} L(x/n) = floor(sqrt x) (CLASSICAL; EXACT on 3,060 values of x <= 2e5, `checks.log` (1)). At
the level of kernels, with q_sigma(u) = floor(e^(u/2)) e^(-sigma u), tau_c the right shift by c, and the
measures zeta_sigma = sum_n n^(-sigma) delta_(log n), nu_sigma = sum_n mu(n) n^(-sigma) delta_(log n):

    zeta_sigma * k_sigma = q_sigma,        k_sigma = nu_sigma * q_sigma        (convolution on the half-line),

and at the level of symbols K_sigma(z) zeta(sigma + z) = zeta(2s)/s, s = sigma + z.

PROVED for sigma > 1: nu_sigma is a finite measure of total variation zeta(sigma)/zeta(2 sigma), q_sigma is
in L^1 with norm <= 1/(sigma - 1/2), so
norm(Gamma_sigma) <= norm(k_sigma)_1 <= zeta(sigma)/(zeta(2 sigma)(sigma - 1/2)).

This is a statement in the convolution algebra L^1, not an operator factorisation. Correction made in the
second pass (REFEREE.md F1): the multiplier zeta(sigma + z) is causal (right shifts), and for a causal
multiplier h the Hankel operator of hK is not Gamma_K composed with a Toeplitz operator; a right shift of the
kernel does not preserve boundedness of a Hankel operator in general (the Carleman kernel 1/u is bounded
with norm pi, its shift 1/(u - c) on u > c is not locally integrable along a + b = c). So even one factor
n^-s is harmless only where the kernels are in L^1.

For sigma <= 1 the relation gives no bound: nu_sigma is not a finite measure for sigma <= 1, and its symbol
1/zeta(sigma + it) is unbounded on every line 1/2 < sigma < 1 (CLASSICAL Omega-theorem for 1/zeta in the
strip, recalled, not opened; under RH as well), so it is not a bounded multiplier. Gamma_sigma is bounded
further left only because of the factor 1/s in D, i.e. because of cancellation in L itself. The relation is
used in bounded form exactly on Re s > 1.

Movement of sigma: k_sigma'(u) = e^((sigma - sigma')u) k_sigma(u), so
Gamma_sigma' = M Gamma_sigma M with M = multiplication by e^((sigma - sigma')a), unbounded for
sigma' < sigma. Boundedness at sigma > 1 holds for every sequence with abs(f) <= 1 (c = 0) and transfers
nothing to sigma' < 1. There is no interpolation or convexity step: the family is not analytic in sigma in operator
norm, and the bound at the left end is the statement to be proved. **R4: no mechanism.**

Uniformity in height (R2): Gamma_sigma for lambda(n) n^(-i tau) is unitarily equivalent to Gamma_sigma for
lambda (modulation by e^(-i tau a)), so the norm is a supremum over all heights and cannot be localised to a
window; a compression to functions supported in [0, U] reads L(x) for x <= e^(2U) only, a finite stage
(TS reason 2), and is bounded for every sigma. The conclusion of Theorem A (iii) is a half-plane statement,
uniform in height because the hypothesis is; no every-window statement is produced.

### 3.4 TS section 6 conditions for candidate 1

| condition | outcome |
|---|---|
| no finite stage | holds for the untruncated operator (reads L(x) for all x); truncations are finite stages |
| not a form of degree <= 2 on window vectors | holds (operator norm on all of L^2; no window; Gamma_c does not enter) |
| not additive in log F on a compact set; not existence of zero-free stages | holds (linear in 1/zeta, not in log zeta) |
| none of the kinds M, I, T, F, R, V, X, S | **fails: T** (Theorem A (iii); rows T2, P14). The form through the all-n relation is R (a bound only on Re s > 1) |

### 3.5 Round-21 R1 test on candidate 1

Named steps: (s1) the partial-sum bound read as Hankel boundedness; (s2) the relation f * a = h with a = 1,
h the indicator of squares, read on kernels as in 3.3; (s3) the Nehari distance.

**Proposition 1 (PROVED; EXACT checks (3), (4), (5) in `checks.log`; closed form checked at s = 3 to 3e-15).**
Let f be completely multiplicative, abs(f) = 1, and f'(n) = f(n)(-1)^(v_6(n)). Then
(i) f' is not multiplicative (f'(6) = -f(2)f(3)), abs(f') = 1, and F_f' = F_f (1 - f(6) 6^-s)/(1 + f(6) 6^-s),
so f' = f * w with w supported on powers of 6, w(1) = 1, w(6^k) = 2 (-f(6))^k;
(ii) S_f'(x) = sum_k w(6^k) S_f(x/6^k); if S_f(x) << x^theta with theta > 0 then S_f'(x) << x^theta;
(iii) every linear relation f * a = h gives f' * a = h * w, and S_(h*w) has the exponent of S_h;
(iv) the Hankel kernel of f' is sum_k w(6^k) 6^(-k sigma) tau_(k log 6) k_sigma[f]; if S_f(x) << x^theta
and sigma > theta both kernels are in L^1, with norm(k_sigma[f'])_1 <=
(1 + 6^(-sigma))/(1 - 6^(-sigma)) norm(k_sigma[f])_1, and both operators are bounded; F_f' and F_f have the
same zeros and poles in Re s > 0, so by Theorem A (ii) boundedness for f' at sigma gives the same analytic
continuation as for f. For f = lambda the infimum of sigma with bounded operator is Theta for both.
For f = lambda: f' = lambda V6, F = [zeta(2s)/zeta(s)] (1 - 6^-s)/(1 + 6^-s),
sum_{n<=x} S_f'(x/n) = sum_k w(6^k) floor(sqrt(x/6^k)) = c sqrt x + O(log x).
  Proof. (i): split n = 6^k m, 6 not dividing m; sum over m not divisible by 6 of f(m) m^-s =
  (1 - f(6) 6^-s) F_f by complete multiplicativity. (ii) to (iv) follow from f' = f * w and
  sum_k abs(w(6^k)) 6^(-k theta) finite. QED

Outcome by control (the rule: V6 and THIN x V6 must fail the named step; HQ1 to HQ4 and E_a must not):

| control | (s1) | (s2) | (s3) | reason |
|---|---|---|---|---|
| lambda V6 (the V6 member of this class) | passes, same sigma range as lambda | passes with h * w | passes | Proposition 1. **The rule requires a failure; there is none.** Measured on x <= 2e5: max abs(S)/sqrt x = 0.933 (lambda: 1.330) |
| V6 itself (c = 5/7) | passes for every sigma > 0 | passes (V6 * mu = w) | passes | partial sums (5/7)x + O(log x) |
| lambda THIN V6 | fails at sigma <= b | passes in the form with weights eps_S | n/a | fails because of THIN (pole at b), not because of V6; lambda THIN fails identically |
| HQ1 to HQ4 (Liouville analogue G(2s)/G(s)) | criterion holds verbatim; bounded iff sigma is right of the twin's zeros | passes (f * a_G = a_G on squares) | passes | not in the class of input D (local factor at q is not (1 - alpha y)^-1 with abs(alpha) <= 1): excluded by a clause at one prime, not by a step |
| E_a | criterion verbatim; bounded iff sigma >= 1/2 + a | passes with exponent (1 + a)/2 for h (poles of zeta(2s + a) zeta(2s - a)); fails the form "exponent 1/2" by size | passes | size of local parameters |

Result: the first clause of the R1 rule fails (no non-multiplicative control fails a named step). **R1 is not
recorded.** The steps read the sign and size of S_f and one linear convolution identity; both are stable
under f -> f * w.

### 3.6 Other controls on candidate 1

| control | outcome | step |
|---|---|---|
| DH | Theorem A holds verbatim for the Dirichlet inverse of the DH coefficients (kernel of polynomial growth; Gamma_sigma bounded iff sigma is right of every zero; the map's value for the supremum is about 1.1204). Relation (s2) holds with h = delta. | none fails; only the hypothesis is false. Also outside the class (not completely multiplicative, not unimodular) |
| backward heat | not posable: no fixed Dirichlet series, no partial sums. At the level of Theorem A (any causal kernel with Laplace transform K) the criterion holds verbatim | none |
| sign twist | lambda is itself the sign twist of 1. The sign chain g = lambda eps_S (completely multiplicative, +-1) has F_g = zeta(2s)/F_eps(s) (PROVED from the Euler factors), a real pole at b, and satisfies sum_{n<=x} eps_S(n) G(x/n) = floor(sqrt x) for every x (PROVED: g * eps_S = lambda * 1 since eps_S^2 = 1; EXACT, `checks.log` (2), 2,995 primes in S below 2e5). Measured: G(2e5) = -4512, local slope between 1e5 and 2e5 equal to 0.894 (b = 0.9) | **passes (s2) in the same shape with unimodular completely multiplicative weights; fails only where the weight series F_eps has a zero right of 1/2.** For lambda the corresponding statement is the target. R3 fails |
| unimodular twist n^(-i alpha) | unitarily equivalent operator; conclusion remains true | not a discriminating control |
| T-NR | as HQ: criterion verbatim for G(2s)/G(s); outside the class by the local factor at q | clause at one prime |
| Beurling | (s2) holds for any Beurling system (sum over generalised integers of L_B(x/n) = number of generalised squares <= x). CYC read as generalised primes of norms Q^(2^k) (from the round-21 BR-2 file; not re-opened): prod_k (1 + Q^(-2^k s))^-1 = 1 - Q^-s, so L_B is bounded and every step passes with a true conclusion | none fails; the relation does not use the integers. Beurling systems with zeros pass (s2) and fail the conclusion: R3 fails |

## 4. The other nine objects

**Twin ladder.** Joined object: direct ladder with every rung below P sign-flipped,
F_P = zeta(s) prod_{p<=P} (1 - p^-s)/(1 + p^-s) (chi_P completely multiplicative, -1 on p <= P, +1 beyond),
F_P -> F_lambda on Re s > 1; dual ladder zeta(1 - 2s)/zeta(1 - s) with bridge chi(2s)/chi(s), lossless on no
line (Lemma 0 (c)). Input D at stage P: S_P(x) = c_P x + E_P(x), c_P = prod_{p<=P} (p - 1)/(p + 1) != 0,
E_P(x) <<_P (log x)^(pi(P)) (PROVED: chi_P = 1 * w_P, w_P supported on P-smooth numbers, abs(w_P) <= 2^(pi(P))).
c4 Theorem 1 applies with theta = 0+ and no real zero (F_P(sigma) = zeta(sigma) times a positive number):
zeros of F_P in Re s > 0 are those of zeta. True and empty (F_P/zeta is a finite product). Since
L(x) = S_P(x) for x <= P, a bound abs(E_P(x)) <= C x^theta uniform in P gives L(x) << x^theta (let P -> inf,
c_P -> 0): the uniform statement is the target. Verdict: finite stage (TS reason 2: every chi' equal to
chi_P on p <= P is invisible) and T. V6 passes (Proposition 1 applied to chi_P).

**Bridge.** Function form: B_a[F_lambda](s) = tanh(log abs(F_lambda(s + a)) - log abs(F_lambda(s - a))),
a -> 0 limit Re(2 zeta'/zeta(2s) - zeta'/zeta(s)). Input D with exponent theta gives abs(F_lambda(s)) <=
C abs(s)/(sigma - theta) on Re s > theta: an upper bound on one modulus, no sign for B_a, no balance line
(Lemma 0 (c)). Operator form: the bridge energy H_c needs an even F. The unitary symbol available is
S_sigma(z) = D(sigma + z)/D(sigma - z); its poles in Re z > 0 are the zeros of zeta right of sigma and the
points sigma - rho/2 for every zero rho (Re > 0 when sigma >= 1/2). So rank Gamma_-(S_sigma) is infinite for
every sigma >= 1/2 (CLASSICAL Kronecker), with or without RH: there is no "Gamma_- = 0" statement. Verdict:
function form I, operator form T/V (a statement about which poles are present).

**Bridge shear.** Joined object: the completed quotient Xi(s) = xi(2s)/xi(s) (xi the completed function).
d/dsigma log abs(Xi) = sum_rho [2 Re 1/(2s - rho) - Re 1/(s - rho)] (Hadamard, CLASSICAL). Every term is
positive when Theta/2 < sigma < 1 - Theta. Hence (PROVED from the product): RH implies abs(xi(2s)/xi(s)) is
strictly increasing in sigma on 1/4 < sigma < 1/2 for every t; 30-digit check at 48 points, minimum
derivative 0.01296; the sign is lost outside the strip (-19.99 at sigma = 0.2, -9.43 at sigma = 0.6;
`referee_check.log` (b)). Converse ARGUED (an off-line zero puts a pole or a zero of Xi inside the strip
unless a coincidence rho' = 2 rho occurs; not excluded here). This is the Sondow-Dumitrescu statement for a
two-line object. Input D does not enter it. Verdict: T (and it is a Hadamard-product statement: holds for
every xi-like function with zeros on its line, DH excluded only by the hypothesis).

**Antibridge.** Section 3. T; R1 fails (lambda V6); R3 fails (lambda THIN, Beurling).

**Torus.** Joined object: P_x(z) = sum_{n<=x} z^(v(n)) on the prime torus, a polynomial in the coordinates
p <= x; the class of input D is the torus itself (completely multiplicative unimodular functions are its
points), lambda is the real 2-torsion point (-1, -1, ...), the heights are the Kronecker orbit of the point 1.
Relation valid at every point z (PROVED, one line: (lambda z) * z = z^2 on squares, 0 elsewhere):

    sum_{n<=x} z(n) P_(x/n)(lambda z) = P_(sqrt x)(z^2).

Input D at one point is T; for Haar-almost every point square-root cancellation holds (CLASSICAL: Wintner,
Helson; recalled) which is M and says nothing about a given point; the relation is I (it holds at lambda THIN
= another real 2-torsion point with z = eps_S, and at every other point). Each P_x is a finite stage in the
coordinates. Lattice tori (G3, G12, G16): the coefficients are not completely multiplicative; no object.
Verdict: I + M + T.

**Klein.** No joined object. The involution A is antiholomorphic and comes from s -> 1 - conj s. F_lambda
has the real structure s -> conj s only (seam = real axis; blind, G13). The only self-map carrying its
zero set to its pole set is the dilation s -> 2s (div F_lambda = (delta* - 1) div zeta), of infinite order.
Lemma 0 (d).

**Spinor.** Joined object: the state psi = (zeta(2s), zeta(s))/norm, projective coordinate F_lambda(s); the
north pole is the pole set. Input D with exponent theta gives abs(F_lambda(s)) <= C abs(s)/(sigma - theta):
the state stays outside a cap around the pole whose radius shrinks like 1/abs(s). Uniformly in height the
content is "the state is not the pole", which is the target. The square-root form H_c = D* J D needs an even
F (Lemma 0 (d)). Verdict: I/T.

**Twistor.** No joined object. The map is defined on the elliptic quartet of one off-line quadruple
{rho, conj rho, 1 - rho, 1 - conj rho}; for F_lambda the quadruple becomes four poles and four zeros at
halved positions with no symmetry exchanging them, and the real structure is a choice with no positivity
(G19). No completely multiplicative function enters.

**Zero channels.** Joined object: "pole channels" of D right of sigma, counted by the rank of
Gamma_sigma - Gamma[phi_sigma] (Lemma B (iii), ARGUED). A certificate on a finite range reads L(x), x <= X:
a truncation of the kernel, bounded for every sigma (finite stage, TS reason 2) or a local detector at
verified height (V). The untruncated count is candidate 1. Verdict: 2 / V / T.

**Vortex.** No joined object. G = H_t + i H_t' needs a real entire H_t, i.e. a function real on a line;
F_lambda is real on no vertical line (Lemma 0 (c)). Gaussian smoothing of L in log x multiplies D by
e^(t s^2), which changes no pole; the smoothed hypothesis has the same abscissa (T) and is not the de
Bruijn-Newman flow.

## 5. Table, and the general statement

| object | D-joined object | finite stage | degree <= 2 window form | additive in log F | kind | R1 test (V6 member) | controls | verdict |
|---|---|---|---|---|---|---|---|---|
| twin ladder | F_P = zeta prod_{p<=P}(1 - p^-s)/(1 + p^-s), bridge chi(2s)/chi(s) | yes (cut P) | no | no | T (uniform in P); empty at each P | V6 passes | every chi' equal on p <= P | closed: stage + T |
| bridge | B_a[F_lambda]; S_sigma = D(sigma + z)/D(sigma - z) | no | no | function form yes (difference of log moduli) | I; T/V | not reached | holds for every meromorphic F | closed |
| bridge shear | abs(xi(2s)/xi(s)) increasing on 1/4 < sigma < 1/2 | no | no | yes (sum over zeros) | T | not reached; D does not enter | Hadamard product only | closed |
| antibridge | Gamma_sigma, kernel L(e^(a+b)) e^(-sigma(a+b)) | no | no | no | T (R through the all-n relation) | **lambda V6 passes all steps** | lambda THIN and Beurling pass (s2); DH, HQ, T-NR verbatim | closed |
| torus | P_x(z) on the prime torus; relation at every z | each x | no | no | I, M, T | the torus is the CM class; no step | lambda THIN is another point | closed |
| Klein | none (Lemma 0 (d)) | | | | | | | no object |
| spinor | (zeta(2s), zeta(s)) | no | no | no | I/T | not reached | every pair | closed |
| twistor | none (Lemma 0 (d); G19) | | | | | | | no object |
| zero channels | rank of Gamma_sigma - Gamma[phi_sigma]; truncated certificates | truncated: yes | no | no | V, T | as antibridge | as antibridge | closed |
| vortex | none (Lemma 0 (d)) | | | | | | | no object |

Objects that pass: **none.** No first lemma is proposed.

**Proposition 2 (PROVED; the screen statement).** Let f be completely multiplicative with abs(f) = 1.
(a) Any hypothesis or step that is a finite set of statements of the forms "S_f(x) << x^theta",
"f * a = h with S_h(x) << x^eta", "the half-line Hankel kernel of S_f at weight sigma is in L^1" (and, for f = lambda, "the Hankel operator
at weight sigma is bounded for all sigma > sigma_0") holds for
f'(n) = f(n)(-1)^(v_6(n)) whenever it holds for f (theta, eta, sigma > 0). f' is unimodular and not
multiplicative. (Proposition 1.)
(b) f * f = d f (d the divisor function) holds iff f is completely multiplicative (f(1) = 1); equivalently
the matrix (f(mn)) has rank one. Both fail for V6 and lambda V6 (first failure at n = 6: 0 against -4; rank
5 on m, n <= 12; EXACT). Both hold for every sign chain, every unimodular twist and every Beurling member:
they do not read the order of the integers, so they carry no information on partial sums.
  Proof of (b). If f is completely multiplicative, sum_{ab = N} f(a)f(b) = d(N) f(N). Conversely, for N
  composite (d(N) - 2) f(N) = sum over proper factorisations of f(a) f(b); by induction every term equals
  prod f(p)^(v_p(N)). QED
(c) Consequence: a D-join whose marked step is of type (a) fails the R1 test in advance; one whose marked
step is of type (b) fails R3 in advance (lambda THIN is in the class). A step that neither twin passes must
be non-linear in f and read the order. None of the ten joins contains one.

## 6. Pivot (one): the convolution square

Strongest adjacent idea: use (b) with partial sums. F_(d lambda) = F_lambda^2 = zeta(2s)^2/zeta(s)^2, and
sum_{N<=X} d(N) lambda(N) = sum_{mn<=X} lambda(m) lambda(n) = 2 sum_{m<=sqrt X} lambda(m) L(X/m) - L(sqrt X)^2
(hyperbola; the first equality is where complete multiplicativity enters).

Tests. (1) R1 rule: V6 and lambda V6 fail the step at n = 6 for a structural reason (first clause holds);
HQ1 to HQ4 and E_a are multiplicative, not completely multiplicative, and fail it (second clause fails on
the wide reading; on the narrow reading, inside the class of input D, it holds). (2) R3: g = lambda eps_S
passes it identically (F_(dg) = F_g^2) and has a pole at b; Beurling members pass. Fails. (3) Content: from
abs(L(x)) <= C x^theta the right side is << X^((1 + theta)/2), weaker than the input for theta < 1; from a
bound on the left side nothing returns to L except through the same Mellin equivalence (double poles at the
same points). Loop map theta -> theta (row P14). (4) R4: none.

Closed. No second pivot.

## 7. Requirement flags

- **R1 false.** Evidence: Proposition 1 and the table of 3.5 (lambda V6 passes every named step of the
  first candidate; EXACT checks (3), (4)); section 6 item (1) for the pivot (second clause).
- **R2 false.** The only height-uniform statements are hypotheses equivalent to the target (Theorem A (iii));
  no every-window statement; window compressions are finite stages (3.3).
- **R3 false.** lambda THIN passes the all-n relation in the same shape (3.6, EXACT check (2)); Beurling
  passes; DH, HQ, T-NR, E_a satisfy the criterion verbatim and fail only its hypothesis.
- **R4 false.** 3.3: the relation is bounded only on Re s > 1; moving sigma is an unbounded conjugation.

## 8. Three weakest steps

1. "No object passes" is a statement about the joins written here, one or two per object, chosen by this
   lane. It is not a proof that no join exists. Proposition 2 (c) covers only steps of types (a) and (b); a
   join with a step non-linear in f that reads the order was not found, not excluded.
2. Lemma B (iii), the residue form of the kernel difference, and the residue lower bound for the norm near
   sigma = 1/2 are ARGUED (infinitely many zeros, o(1) not made explicit). That 1/zeta(sigma + it) is unbounded
   for 1/2 < sigma < 1 rests on a recalled Omega-theorem for 1/zeta that was not opened. The converse in the shear
   row is ARGUED. CYC was read from one line of the round-21 file, not from its definition.
3. Controls were evaluated on paper. Numerics are exact identities on x <= 2e5 and one THIN set (b = 0.9,
   greedy by a float rule, 2,995 primes; the identity does not depend on S). The pole of F_g at b is taken
   from the THIN lane's form F_eps = zeta (s - b)^k W; the measured slope 0.894 is consistent with it and
   is not a proof. REFEREE.md is a second pass by the same agent; there is no independent referee file.

## 9. Files

- `checks.py`, `checks.log`: exact checks (1) to (6) and sizes.
- `referee_check.py`, `referee_check.log`: closed form of F for lambda V6 at s = 3; sign of
  d/dsigma log abs(xi(2s)/xi(s)); toy of Lemma B.
- `REFEREE.md`, `lanes.jsonl`.
- Compute: local, `scripts/memcap.sh 8`; largest allocation below 20 MB (checks) and 100 MB (referee check);
  each run finished inside the 2-minute default limit (not timed). Server not used.

## 10. Most valuable next step

Record TS section 6 row 4 as closed for joins of types (a) and (b) with Proposition 2 as the closing
statement, and add lambda V6 and lambda THIN as the two standing twins for any lane on partial sums of
lambda or mu. If the row is kept open, the only form not covered is a step that is non-linear in f and reads
the order of the integers (for example a statement about S_f(x) S_f(y) against S_f(xy)); it should be tested
against both twins on paper before any construction.
