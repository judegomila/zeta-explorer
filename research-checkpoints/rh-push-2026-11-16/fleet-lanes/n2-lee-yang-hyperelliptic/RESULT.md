# n2-lee-yang-hyperelliptic: Lee-Yang stability calibrated on split hyperelliptic curves over F_q

Status labels: PROVED / CLASSICAL / MEASURED / CERTIFIED (exact or ball arithmetic) / OPEN.
This lane probes a proved theorem (Weil bound for y^2 = f(x), f split of odd degree). It makes no claim about zeta.

## Verdict

**The first lemma is false. The idea is dead in the assigned form and in the one pivot tried.**

1. (CERTIFIED) For every (q, n) tested (q = 5, 7, 11, 13; n = 3, 5) there are z in the closed unit polydisc, and in the open one, for which (1 - qu)W(u; z) has two roots in |u| < q^{-1/2}: the continuation of the trivial root u = 1/q and a root continued from a zero of L(u, chi_f). Smallest nontrivial |u| sqrt(q) found: 0.45 (q = 11, 13; n = 5). The earlier run's values 0.23-0.39 are the trivial root (it moves from 1/sqrt(q) down to about 0.75/sqrt(q)); the nontrivial minimum is 0.45-0.76.
2. (CERTIFIED) For n = 5 the lemma fails already on the real cube z in [-1, 1]^5, with a single coordinate moved: q = 13, f = x(x-1)(x-3)(x-4)(x-11), z = (-1, -1, -1, 1/3, -1) gives W = (3 - 8u + 38u^2 + 64u^3 + 143u^4)/3, which has a conjugate root pair at |u| sqrt(13) = 0.8452.
3. (PROVED at first order, MEASURED globally) For n = 3 the real cube is stable; no uniform sector at z = -1 is stable.
4. (PROVED) Structural reason: W(u; z) is the multi-affine interpolation of the L-functions of the 2^n sub-curves y^2 = f_S(x). Only the vertices z in {+1, -1}^n have multiplicative weights. Off the vertices the lemma asks for a Weil-type bound for a non-multiplicative mixture, and that bound is false.
5. Pivot (one, done): the Fourier-self-dual weight family, where an exact functional equation holds for all z (MEASURED to 1e-13), still has nontrivial roots off |u| = q^{-1/2} on the real cube for n = 5 (CERTIFIED, |u| sqrt(q) = 0.4414). The lane stops here.

## 1. Plan and what is new

Atlas/obstruction-map rows T1-T3 cover function-field transplants (TRO6, Stepanov-Bombieri, Hodge index). None of them tests a Lee-Yang (multi-affine stability) deformation of a function-field L-function. The earlier Lee-Yang lanes (ap-leeyang-ladder, ap-leeyang-structural, box-ly-search) worked over Q. New here: an exact, finite test of the mechanism where the target theorem is known.

Setup. q odd prime, chi the quadratic character of F_q (chi(0) = 0), f = prod_{i<=n}(x - e_i) with distinct e_i in F_q, n odd. For monic D with D(e_i) != 0 for all i, spin s_i = chi(D(e_i)).

    W(u; z) = sum_k u^k sum_{D monic, deg k, gcd(D, f) = 1} prod_i z_i^{[s_i = -1]},      W(u; -1,...,-1) = L(u, chi_f).

D vanishing at a branch point gets weight 0 (forced by W(-1) = L on this slice; section 5 treats the alternative).

## 2. Rational form (PROVED)

**(R1) Degree.** For k >= n the map D -> (D(e_1),...,D(e_n)) from monic degree-k polynomials to F_q^n is onto with fibres of size q^{k-n} (interpolation). Hence the degree-k coefficient is q^{k-n} C(z), C(z) = ((q-1)/2)^n prod_i (1 + z_i), and

    N(u; z) := (1 - qu) W(u; z) = (1 - qu) sum_{k<n} A_k(z) u^k + C(z) u^n,

a polynomial of degree <= n in u, multi-affine in z, with integer coefficients (A_k(z) = pattern counts of the Reed-Solomon coset x^k + RS_k). At z = -1: C = 0 and N = (1 - qu) L(u, chi_f); the root u = 1/q is the "trivial root". For general z, N(1/q; z) = C(z) q^{-n} != 0, so the trivial root moves.

**(R2) Mixture formula.** For s = +-1, z^{[s = -1]} = (1+z)/2 + (1-z)/2 * s. With t_i = (1 - z_i)/2:

    W(u; z) = sum_{S subset [n]} prod_{i in S} t_i prod_{i not in S} (1 - t_i) * L_S(u),
    L_S(u) = sum_{gcd(D,f)=1} chi_{f_S}(D) u^{deg D} = L(u, chi_{f_S}) prod_{i not in S} (1 - chi_{f_S}(x - e_i) u),   f_S = prod_{i in S}(x - e_i).

L_emptyset = (1-u)^n/(1-qu). For |S| even and nonzero, L(u, chi_{f_S}) = (1-u) P_S(u) with P_S the L-polynomial of a genus (|S|-2)/2 curve. So W is the multi-affine interpolation, in t in the polydisc |t_i - 1/2| <= 1/2, of the 2^n sub-curve L-functions with their Euler-factor corrections. z real in [-1,1] means t in [0,1]: W is then the expectation of L_S over a random subset S (site i kept with probability t_i).

**(R3) Endpoints.** z = (1,...,1): N = (1-u)^n (all roots at u = 1; verified numerically for every curve). z = -1: n-1 roots on |u| = q^{-1/2} (Weil; verified numerically for every curve), one at 1/q.

**(R4) No functional equation in u on this slice.** The components L_S have functional equations of different degrees and centres (roots on |u| = q^{-1/2} from P_S, roots on |u| = 1 from the correction factors). The roots in section 3 (e.g. moduli 0.4454, 0.7767, 1.7627 times q^{-1/2}) are not invariant under u -> 1/(qu). The weight vector (0, 1, z) on (zero, residue, non-residue) is not preserved by the Fourier transform on F_q, which is what Reed-Solomon duality (MacWilliams/Poisson) uses: the transform of a(1 - delta_0) + b chi is a(q delta_0 - 1) + b G chi (G the Gauss sum). Section 5 uses the slice that is preserved.

**(R5) First-order motion at z = -1.** For a simple root u_j of L and site i, with rho_ij := (d u_j / d z_i)/u_j:

    rho_ij = - M_i(u_j) / (2 u_j L'(u_j)),     M_i(u) = L(u, chi_{f/(x-e_i)}) (1 - chi_{f/(x-e_i)}(x - e_i) u).

Inside the polydisc dz_i ranges over Re dz_i >= 0. First-order stability on the polydisc needs rho_ij real and >= 0; on the real cube it needs Re rho_ij >= 0; on a sector |arg dz_i| <= alpha it needs |arg rho_ij| <= pi/2 - alpha.

**(R6) n = 3 (genus 1), exact.** L = 1 - a u + q u^2, u_0 = e^{i phi}/sqrt(q), M_i = (1-u)(1 - s u), s = +-1. Using u_0 L'(u_0) = q u_0^2 - 1:

    s = -1:  Re rho = (q+1)/(4q),   Im rho = ((q-1)/(4q)) cot(phi)
    s = +1:  Re rho = (q-1)/(4q),   Im rho = ((q+1)/(4q)) cot(phi) - 1/(2 sqrt(q) sin(phi))

(only |u_0| = q^{-1/2} is used). Numerically the distinct values of Re rho are exactly {(q-1)/(4q), (q+1)/(4q)} for q = 5, 7, 11, 13 (firstorder.log). Consequences: Re rho > 0 always (real directions push outward); Im rho != 0 unless phi is special, and Im rho is unbounded as phi -> 0, pi, so complex directions push inward and no sector half-angle works uniformly in the curve.

## 3. First test: results

Method: exact integer pattern counts (lylib.py); roots of the degree-n polynomial; minimisation of the second-smallest root modulus (and of the smallest) by Nelder-Mead from 14-40 random starts per curve and domain (search.py; derivative-free local search, not gradient descent). Curves: all sets {0, 1, e_3} for n = 3; all or 6 sampled sets {0, 1, ...} for n = 5.

Minimum over curves of the second-smallest |u| sqrt(q) of N(u; z) (MEASURED; 1.0000 means the minimum is the vertex z = -1):

| q | n | curves | torus | polydisc | z_i = z complex | real cube | z_i = z real | W_odd real cube |
|---|---|---|---|---|---|---|---|---|
| 5 | 3 | 3 | 0.7126 | 0.7126 | 0.7645 | 1.0000 | 1.0000 | 1.0000 |
| 5 | 5 | 1 | 0.5997 | 0.5997 | 0.5997 | 1.0000 | 1.0000 | 1.0000 |
| 7 | 3 | 5 | 0.7573 | 0.7573 | 0.7573 | 1.0000 | 1.0000 | 1.0000 |
| 7 | 5 | 6 | 0.5824 | 0.5824 | 0.6397 | 1.0000 | 1.0000 | 1.0000 |
| 11 | 3 | 9 | 0.6722 | 0.6722 | 0.6990 | 1.0000 | 1.0000 | 1.0000 |
| 11 | 5 | 6 | 0.4467 | 0.4467 | 0.5677 | 0.8090 | 0.9840 | 0.8090 |
| 13 | 3 | 11 | 0.6480 | 0.6480 | 0.6742 | 1.0000 | 1.0000 | 1.0000 |
| 13 | 5 | 6 | 0.4517 | 0.4517 | 0.5148 | 0.8452 | 1.0000 | 0.8452 |

(W_odd = (W(u; z) - z_1...z_n W(u; 1/z))/2 = sum over |S| odd in (R2): degree n-1, no pole, no trivial root, first-order motion at z = -1 vanishes. It fails on the real cube for n = 5 as well; on the torus it vanishes identically where prod z_i = 1.)

Smallest root modulus (the trivial root) over the polydisc: 0.368, 0.385, 0.309, 0.307, 0.241, 0.228, 0.214, 0.203 for the eight rows, against 1/sqrt(q) = 0.447, 0.378, 0.302, 0.277. This is the range 0.2-0.39 reported by the earlier run.

Trivial-root separation (certify.py): all roots continued from z = -1 along two paths (straight segment; coordinate-by-coordinate arcs), 20000 steps, nearest-neighbour matching with separation/step ratio >= 146. In every tracked case both paths agree: the descendant of 1/q is the smallest root and the second-smallest root descends from a zero of L. Tracking is not available when L has a double zero (q = 5, n = 5; q = 11 set {0,1,4,6,8}); there the statement used is the count below, which needs no labelling.

Label-free form of the lemma: "N(u; z) has at most one root in |u| < q^{-1/2}". Counterexamples (clean_examples.py; coefficients exact in Q(i); zero count in |u| < r, r rational with r^2 q < 1, by exact Schur-Cohn recursion over Q(i) (schur.py, self-tested on 3000 random polynomials against numpy, 0 mismatches); roots by mpmath at 60 digits, relative residual < 1e-61):

**(C1) open polydisc, q = 5, f = x(x-1)(x-2), z = (-9/10 - i/4, -1/4 - 9i/10, -9/10 - i/4), max |z_i|^2 = 349/400.**
N = 1 + (-5 + 349i/200) u + (3857/1600 - 24281i/4000) u^2 + (-4073/320 - 52783i/4000) u^3. Exact count in |u| < 0.447213595499: 2.
- trivial: u = 0.199204697747968355072503585534 + 0.000435734592976861148677155302 i, |u| sqrt 5 = 0.44544
- nontrivial: u = 0.080435457845023431784299938030 + 0.337904381812945684336039225301 i, |u| sqrt 5 = 0.7766892368480701422970381
- third root: |u| sqrt 5 = 1.76265

**(C2) closed polydisc, q = 13, f = x(x-1)(x-2)(x-7)(x-11), z = (24/25 - 7i/25, -7/10 + 7i/10, -99/100 + i/13, -22/25 + 9i/20, -1/2 + 21i/25).** Exact count in |u| < 4333595283/15625000000: 2.
- trivial: u = 0.076966113674752766356918747869 - 0.000067485245450310279095255585 i, |u| sqrt 13 = 0.27751
- nontrivial: u = 0.026549701048051042869100005642 - 0.125637366486928477449845637073 i, |u| sqrt 13 = 0.4629959484548991171905683

**(C3) real cube, q = 13, f = x(x-1)(x-3)(x-4)(x-11), z = (-1, -1, -1, 1/3, -1).**
3N = (1 - 13u)(3 - 8u + 38u^2 + 64u^3 + 143u^4). Exact count in the disc: 3 (u = 1/13 and a conjugate pair).
- u = 0.123206449164487434014474850972 +- 0.199423563930731633704117273605 i, |u| sqrt 13 = 0.8451891093508176728845343
In (R2) terms: W = (1/3) L_f + (2/3) L_{f/(x-4)} (1 -+ u), a convex combination of two polynomials whose roots all satisfy |u| >= q^{-1/2}.

**(C4) real cube, q = 11, f = x(x-1)(x-4)(x-6)(x-8), z = (-1, -1, -1, 0, -1).** N = 1 - 14u + 54u^2 - 244u^3 + 209u^4 - 726u^5. Exact count: 3; pair at |u| sqrt 11 = 0.8092460766900696733083103.

Further certified points for each (q, n) (rounded search minimisers; Schur-Cohn count and arb root balls agree) are in certify.json.

## 4. Weaker domains: largest domain with stability

| domain | n = 3 | n = 5 |
|---|---|---|
| closed/open polydisc | false (CERTIFIED), except curves with rho real (3 supersingular sets at q = 11, a = 0: MEASURED stable) | false (CERTIFIED) |
| z_i = z, abs z <= 1 | false (MEASURED 0.67-0.76; certified points in certify.json) | false (MEASURED 0.51-0.64) |
| sector at z = -1 | curve-dependent half-angle pi/2 - max abs arg rho; no uniform sector (PROVED first order, R6) | none for curves with Re rho < 0 |
| real cube [-1,1]^n | stable: first order PROVED (R6); exact grid z in {-1, -5/6, ..., 1}^3, all 28 curves, 61488 points, at most one zero in the disc at every point (CERTIFIED on the grid; certify2.py); not proved off the grid | false (CERTIFIED: C3, C4). First order: Re rho < 0 for 80 of 1480 (root, site) pairs at q = 11 and 268 of 3000 at q = 13 (all 84 and 165 sets; min Re rho = -0.0466, -0.1346); none at q = 7 (10 sets) |
| z_i = z real | stable (MEASURED) | false at q = 11 (0.9840, certified point z = -930/959 in certify.json); MEASURED stable in the other sampled sets |

Largest domain with stability uniform in the curve: for genus 1 the real cube (measured); for genus 2 only the vertex set. No complex neighbourhood of z = -1 inside the polydisc is stable for a general curve, so Hurwitz has nothing to act on.

## 5. Pivot (one): Fourier-self-dual weights with the point at infinity

The slice (0, 1, z) has no functional equation (R4). The square-invariant functions on F_q are spanned by delta_0, 1, chi. For q = 1 mod 4 (G = sqrt(q)) the eigenvectors of the Fourier transform twisted by a multiplier v are 1 + sqrt(q) delta_0 (eigenvalue sqrt(q)), 1 - sqrt(q) delta_0 (eigenvalue -sqrt(q)) and chi (eigenvalue chi(v) sqrt(q)). Take n + 1 sites (e_1..e_n and infinity, the value at infinity being the coefficient of x^k), multipliers of the dual extended Reed-Solomon code v_i = 1/f'(e_i), v_inf = -1, eta_i = chi(f'(e_i)), eta_inf = 1, and

    w_i(a) = (1+z_i)/2 (1 + eta_i sqrt(q) [a = 0]) + (1-z_i)/2 chi(a),
    E_k(z) = sum_{deg D <= k} prod_{i<=n} w_i(D(e_i)) w_inf(coef_k D),   E_{-1} = prod_i w_i(0),
    Z(u; z) = sum_{k>=0} (E_k - E_{-1}) u^k,    N_sd(u; z) = (1-u)(1-qu) Z(u; z)   (degree n+1).

So the answer to "behaviour of D vanishing at a branch point": weight (1 + eta_i sqrt(q))(1 + z_i)/2 keeps a functional equation; weight 0 does not.

- (MEASURED, relative defect <= 1.2e-13 at 20 random complex z per curve, 28 curves, q = 5, 13, 17) E_k(z) = q^{k-(n-1)/2} E_{n-1-k}(z) and N_sd(u) = q^{(n+1)/2} u^{n+1} N_sd(1/(qu)), for all complex z. This is Poisson summation on the extended Reed-Solomon code (CLASSICAL mechanism; the identity for this family was checked numerically, not written out).
- z = -1: N_sd = (q-1)(1-u)(1-qu) L(u, chi_f) (asserted in code for every curve). Every vertex z in {+-1}^{n+1} has all nontrivial roots on |u| = q^{-1/2} (sub-curve L-polynomial times factors 1 +- sqrt(q) u).
- Polydisc stability is impossible here for a structural reason (PROVED given the functional equation): the root set is invariant under u -> 1/(qu) holomorphically in z, so "no nontrivial root inside the disc on an open set of z" forces |u_j(z)| = q^{-1/2} on an open set, hence u_j constant. The only non-trivial statement left is a circle theorem on real z, where N_sd is real and self-reciprocal in sqrt(q) u and simple roots on the circle stay on it near z = -1.
- Real cube, n = 3: n - 1 = 2 roots on the circle at all 3000 samples for each of 14 curves (MEASURED; partly forced: a real self-reciprocal quartic with one real off-circle pair).
- Real cube, n = 5: the four nontrivial roots are all off the circle at 2-34% of random real samples for every one of 14 curves at q = 5, 13, 17 (MEASURED, selfdual.log).
  **(C5) (CERTIFIED, arb 300-bit balls with sqrt(13) enclosed; certify2.py)** q = 13, f = x(x-1)(x-4)(x-8)(x-9), eta = (-1, 1, -1, 1, 1; 1), z = (-1, 3/8, -1, -1, 1; 3/8): roots 1/13, 1, +-0.12241252 i, +-0.6283922 i; the nontrivial moduli are |u| sqrt 13 = 0.4413646 and 2.2657004 (product 1).

So with the functional equation restored, the real circle statement holds at the 2^{n+1} multiplicative vertices and fails between them for genus 2. A continuity argument from a vertex would need the roots to stay simple along a path; they collide and leave.

## 6. Controls

- Fake 1 - 5T + 5T^2 (Euler product, functional equation, rationality, roots off the circle): not formulable. W(u; z) needs spins at branch points of an actual f over F_q; the fake has no curve, so no lift exists. Flagged as required: the test cannot be run against this control, in either direction.
- DH / backward heat / sign twist: not applicable (no statement about zeta is made). The internal control is stronger: the lemma is false on the true objects themselves.
- Where multiplicativity sits: the weight D -> prod_i z_i^{[s_i = -1]} is completely multiplicative in D only at z in {+-1}^n. The Lee-Yang deformation leaves the multiplicative locus at once; the interior points are averages of Euler products (R2) and do not obey the bound.
- Code checks: Weil at z = -1 and (1-u)^n at z = 1 asserted for every curve; Schur-Cohn self-test; Schur-Cohn count equals arb count at all 27 certified points; functional equation in section 5 to 1e-13.

## 7. Consequence for the campaign

The archimedean question ("what would the site at infinity be over Q") is not reached: it belonged to the no-counterexample branch. What the calibration says about a Lee-Yang route for zeta: a multi-affine "spin" deformation of an L-function interpolates between the L-functions of sub-characters; stability of such a family is not implied by, and does not hold alongside, the Riemann hypothesis for its vertices, even over F_q in genus 2 and even on real parameters with an exact functional equation. A Lee-Yang proof would need a family whose interior points are themselves constrained by an interaction with a sign condition (ferromagnetic type). The Reed-Solomon constraint is a linear-code constraint whose pattern counts have no such sign structure, and for deg D >= n there is no interaction at all.

## 8. Three weakest steps

1. Global real-cube stability for n = 3 is certified only on a 13^3 rational grid and measured by local search; only the first-order statement at z = -1 is proved. It is not needed for the verdict.
2. The minima in the table come from Nelder-Mead with 14-40 starts and, for n = 5 at q = 7, 11, 13, from 6 sampled curves each; they are upper bounds on the true minima, and "stable" entries (1.0000) for n = 5 at q = 5, 7 and for the real diagonal are measured, not proved. The first-order data (all curves) show Re rho >= 0 at q = 7, so genus-2 real-cube failure may need q >= 11.
3. The self-dual family is one choice of repair (zero-weights 1 + eta_i sqrt(q), q = 1 mod 4, infinity included). Its functional equation was verified numerically rather than derived in full, and q = 3 mod 4 (Gauss sum i sqrt(q), where the transform acts on z by a map of order 4) was not tested. Another deformation with a functional equation could behave differently; none was found.

## Files

All under tmp/research-2026-11-16/push/n2-lee-yang-hyperelliptic/. Every run went through scripts/memcap.sh 8 with .venv-arb/bin/python, single process, longest run about 10 minutes, largest allocation 193 MB (printed before allocation). No ssh.

- lylib.py (exact counts, N coefficients), schur.py (exact Schur-Cohn over Q(i))
- search.py, search.log, search_q{5,7,11,13}_n{3,5}.json (domain minimisation)
- firstorder.py, firstorder.log (rho_ij for all curves)
- certify.py, certify.json (27 certified points, continuation along two paths)
- clean_examples.py, clean_examples.json (C1-C4, 30-digit roots)
- selfdual.py, selfdual.log, selfdual_q*_n*.json (pivot); certify2.py, certify2.json (C5 and the n = 3 grid)
