# b-volterra-norm: the statement ||V_{a,Phi}|| <= 1

Slug: b-volterra-norm. Date: 2026-11-16. Verdict: **precise obstruction** (the avenue is closed; the statement is decided unconditionally and carries no zero information). One pivot made (section 5); it lands on an RH-equivalent reformulation with no slot for arithmetic input.

Notation. Phi(u) = sum_{n>=1} (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}) (canonical de Bruijn-Newman kernel, even, positive, Phi(0) = 0.446696900467...). Xi(w) = int_R Phi(u) e^{iwu} du. E_a(z) = Xi(z + ia) (= xi(1/2 + a - iz) up to the fixed normalization). K_a = de Branges kernel of E_a. On L^2([0,inf)):

    (V_{a,Phi} f)(t) = int_0^t Phi(t) Phi(s) sinh(a(t-s)) f(s) ds,   p = Phi sinh(a.), q = Phi cosh(a.).

## 1. Plan: what is new relative to the atlas, the repo and the walls

Already in the repo (not redone): LINK B (||V|| <= 1 <=> K_a >= 0) refuted by homogeneity (section27-identity-refutation, imp-2666); ||V||_HS = (|p|^2|q|^2 - <p,q>^2)^{1/2} (imp-3343); float crossover a* ~ 31.62 canonical (imp-2660); the degree-0 target R = Gpass^{-1/2} Gshear Gpass^{-1/2} is RH-equivalent (section26 verdicts). Atlas (PR 27, hidden-square entry): shifted-kernel positivity for every a > 0 is an RH-equivalent reformulation; a contraction on an X-weighted state space does not supply it.

New here:
- T1: interval-certified two-sided decision of the statement for the canonical Phi: true iff a <= a*, with a* in (31.6213, 31.6214). Previously the false side was float-only and the certified side stopped at a surrogate-kernel band.
- T2: sign-gauge blindness. The whole family {V_{a,Phi}}_{a>0} depends on Phi only through the measure Phi(t)^2 dt, up to one a-independent unitary. This kills every normalization built equivariantly from V or from p, q (not only scalar ones, which is what homogeneity killed).
- T3: V is the initial-value Green operator of a string with mass density Phi^2; its spectral data are those of a positive Sturm-Liouville problem quadratic in Phi, not of Xi.
- T4 (pivot): the sign-sensitive, degree-0 replacement is a Hankel domination ||Gamma_- f|| <= ||Gamma_+ f||, equivalently positivity of an explicit pointwise-positive kernel b_a. It is RH-equivalent over all a > 0 and unconditional only where zero-free half-planes are already known.

## 2. Answer to "RH-equivalent or strictly weaker?"

Neither. "||V_{a,Phi}|| <= 1 for every a > 0" is FALSE (T1). For each fixed a the statement is decided unconditionally by three moments of Phi^2 (T1), and its truth value is constant on a class of kernels whose transforms have prescribed off-line zeros (T2). It implies nothing about zeros and is implied by nothing about zeros.

## 3. Theorems

### T1. Closed-form bracket and certified threshold

Let E_pm(a) = int_0^inf Phi^2 e^{+-2at} dt, I = int_0^inf Phi^2, G(a)^2 = (E_+ E_- - I^2)/4 = |p|^2|q|^2 - <p,q>^2.

(a) PROVED. G(a)/2 <= ||V_{a,Phi}|| <= G(a), for any real measurable Phi with E_+(a) < inf.
Proof. The kernel on {s<t} is k(t,s) = p(t)q(s) - q(t)p(s). V - V* = p (x) q - q (x) p on the whole square (repo imp-2668); this real skew rank-2 operator has singular values G, G, so ||V|| >= ||(V - V*)/2|| = G/2. k^2 is symmetric, so ||V||_HS^2 = (1/2) int int k^2 = G^2 (repo imp-3343), and ||V|| <= ||V||_HS.

(b) PROVED. For Phi >= 0, a -> ||V_{a,Phi}|| and a -> G(a) are nondecreasing. (Kernel is nonnegative and pointwise increasing in a; the norm of a nonnegative-kernel operator is a sup over nonnegative f, g. E_+E_- = int int Phi^2(t) Phi^2(s) cosh(2a(t-s)).)

(c) PROVED (Arb ball arithmetic, cert.py, cert_lower.py; outputs cert.out, cert_lower.out).
- G(31.6213) in [0.99998660688903 +/- 1e-14] < 1, hence ||V_{a,Phi}|| <= 1 for all 0 < a <= 31.6213.
- Test pair u = Phi e^{at}, w = Phi e^{-at}: <u, V w> = (1/2) int Phi(t)^2 [e^{2at} J_-(t) - J_0(t)] dt, J_-(t) = int_0^t Phi^2 e^{-2as} ds, J_0(t) = int_0^t Phi^2. At a = 31.6214: <u,Vw>/(|u||w|) in [1.0000044194431 +/- 6e-14] > 1. With (b): ||V_{a,Phi}|| > 1 for all a >= 31.6214.
- So the statement holds exactly for a <= a*, a* in (31.6213, 31.6214). MEASURED (Nystrom, n = 1200): a* = 31.621366. For reference G = 2 at a = 34.05578 (the cruder bracket from (a)).
- Truncations: the certificates integrate the N-term series (N = 20 resp. 12) on [0, 2]. Discarded: terms n > N are below e^{-pi(N+1)^2} relative (< 1e-200); the tail u > 2 contributes below exp(-2 pi e^8 + 4a) < 1e-8000 to every integral. Both are far below the certified margins (1.3e-5 and 4.4e-6). These two tail bounds are by hand, not inside Arb.

(d) MEASURED. At a = 0.5: ||V|| = 4.57567e-4, G = 4.673660098e-4. The "factor ~5000 from saturation" in the 60+ rows is the size of Phi^2 (G scales as c^2 under Phi -> c Phi), as the repo already records. Near a*, ||V||/G = 0.99999: V is close to the rank-one operator (1/2)(Phi e^{at}) (x) (Phi e^{-as}).

### T2. Sign-gauge blindness (PROVED)

Let eps: [0,inf) -> {+1,-1} be measurable, M_eps the unitary multiplication by eps. Then for every a > 0

    V_{a, eps Phi} = M_eps V_{a,Phi} M_eps.

So norms, singular values, HS norms, numerical ranges, and any operator built from (p, q) by an M_eps-equivariant recipe (in particular Gshear = q (x) p - p (x) q, and R = Gpass^{-1/2} Gshear Gpass^{-1/2} whenever Gpass is built equivariantly) are identical for Phi and eps Phi, simultaneously for all a.

Take eps = +1 on [0,t0], -1 on (t0, inf), and Xi_eps(w) = 2 int_0^inf eps Phi cos(wu) du. On the imaginary axis Xi_eps(iy)/2 = H(y) - T(y), H = int_0^{t0} Phi cosh(yu), T = int_{t0}^inf Phi cosh(yu). T/H is strictly increasing in y (cosh(y'u)/cosh(yu) is increasing in u for y' > y), T/H -> inf, so if T(a) < H(a) there is exactly one y0 > a with Xi_eps(i y0) = 0. For every a > 0 such t0 exists (T(a) -> 0 as t0 -> inf). Then E_{a,eps}(z) = Xi_eps(z + ia) vanishes at z0 = i(y0 - a) in the upper half-plane while E#_{a,eps}(z0) = Xi_eps(i(2a - y0)) != 0 (the only imaginary zeros are +-i y0 and |2a - y0| != y0). Hence K_{a,eps}(z0,z0) = -|E#(z0)|^2 / (4 pi Im z0) < 0.

Conclusion: for every a > 0 there is a kernel eps Phi with the same Volterra family up to one fixed unitary and with K_{a,eps} not positive semidefinite. No functional of the unitary class of {V_{b,Phi}}_{b>0} decides K_a >= 0. MEASURED instances (gauge_bez.out): t0 = 0.1, 0.2, 0.3, 0.5 give y0 = 7.5725, 18.9938, 33.3099, 84.8978.

Scope: this does not cover a Gpass built from non-equivariant data (for example autocorrelations of Phi). The repo's section26 verdict covers that case (RH-equivalent, reads its answer off Gshear).

### T3. String identification (PROVED)

V_{a,Phi} = M_Phi S_a M_Phi, where (S_a g)(t) = int_0^t sinh(a(t-s)) g(s) ds satisfies: y = S_a g solves y'' - a^2 y = a g, y(0) = y'(0) = 0. In Livsic form, k(t,s) = v(t) J v(s)^T with v = (p, q), J = [[0,1],[-1,0]], so V is the triangular model of the canonical system Y' = z J v v^T Y; writing m = sinh(at) y_1 + cosh(at) y_2 this reduces to

    m'' = (a^2 + a z Phi(t)^2) m.

The entire functions attached to V are those of a string with potential a^2 and mass density Phi^2. They are Hermite-Biehler automatically, for every Phi, and their Taylor coefficients are polynomials in moments of Phi^2. E_a is linear in Phi. This is the structural reason behind T2 and behind the failure of the identification Theta_V = Theta_a (repo imp-2664, imp-2668).

## 4. DH control

T1 and T2 use no property of Phi beyond measurability and positivity of the kernel; no step uses the Euler product. The statement ||V|| <= 1 is equally true on a low-a band and false above it for any kernel with the same Phi^2 moments, including the sign-flipped kernels of T2 whose transforms have zeros at distance y0 from the critical line. The same holds for the Davenport-Heilbronn kernel (three moments of its square decide the statement; not computed here). An argument from ||V|| <= 1 therefore does not fail for DH; it has no content for zeta either.

## 5. Pivot: the sign-sensitive degree-0 statement

With phi_pm(u) = Phi(u) e^{+-au}: E_a = Fourier transform of phi_+, E_a# = Fourier transform of phi_-. Using 1/(i(wbar - z)) = int_0^inf e^{i(z - wbar) r} dr,

    K_a(w,z) = (1/2pi) int int b_a(s,t) e^{-izs} e^{i wbar t} ds dt,
    b_a(s,t) = 2 int_{|s+t|/2}^inf Phi(r+d) Phi(r-d) sinh(2ar) dr,  d = (s-t)/2.     [PROVED identity]

(The lower limit is |s+t|/2 because the integrand is odd in r.) Equivalently b_a = Gamma_+* Gamma_+ - Gamma_-* Gamma_-, with Hankel-type operators (Gamma_pm f)(r) = int phi_pm(s+r) f(s) ds, r > 0. So

    K_a >= 0  <=>  b_a >= 0  <=>  ||Gamma_- f|| <= ||Gamma_+ f|| for all f  <=>  Gamma_- = C Gamma_+ with ||C|| <= 1.

The middle equivalences are CLASSICAL (continuous Bezoutian; Douglas lemma); the first uses density of exponentials and is sketched, not written out. This is the correct form of "a contraction built from Phi and sinh": degree 0, sign-sensitive, b_a > 0 pointwise.

Status of b_a >= 0: CLASSICAL for a >= 1/2 (zeta(s) != 0 on Re s >= 1), and for a >= 3/8 it is a restatement of the 2026 zero-free half-plane Re s > 7/8 (unrefereed input). For all a > 0 it is RH (atlas shifted-kernel entry). MEASURED (gauge_bez.out, 131-point grid on [-1.3,1.3]): min eig / max eig is -1e-16 to -3e-16 (roundoff) for a = 1, 0.5, 0.375, 0.2, 0.05; for the sign-flipped kernels it is -1.7e-3 (t0 = 0.3, a = 0.5), -6e-9 (t0 = 0.5, a = 0.5), -1.9e-7 (t0 = 0.5, a = 20). The float check confirms the identity and the sign-sensitivity; at small a it has no evidential weight (zeros near the line sit below float resolution).

Walls: C is the compression of multiplication by Theta_a = E_a#/E_a, so ||C|| <= 1 is the Schur property of Theta_a, the same object as the Pick program (sibling slug pick-induction; not duplicated). The Euler product does not appear in b_a; local Euler factors of Theta_a are not inner (poles at Im z = 1/2 + a), so no factorwise contraction argument exists. The statement is stable under Phi -> small perturbations only when a exceeds the zero abscissa, consistent with flow-blindness. No route to a < 3/8 was found.

## 6. Verdict

PRECISE OBSTRUCTION. The target statement is false as stated, true exactly for a <= a* in (31.6213, 31.6214) (certified), and is blind to the sign pattern of Phi, hence to zeros (T2). The correct replacement (section 5) is RH-equivalent and has no arithmetic input. Nothing here moves a zero-free region or a Lambda bound.

Repo follow-ups (not done; outside this slug's write scope): the memory note and imp-2687 quote 37.66/34.887 for a surrogate Phi; the canonical certified threshold is 31.6213 < a* < 31.6214. VolterraBoundPage could cite T2 as the reason no V-based normalization can work.

## 7. Three weakest steps

1. Truncation tails in T1(c) (series terms n > N, range u > 2) are bounded by hand; the Arb enclosures cover the truncated integrals only. Margins exceed the tails by hundreds of orders of magnitude, but the tail bounds are not machine-checked.
2. K_a >= 0 <=> b_a >= 0 (section 5): the Fourier identity is proved; the passage from positivity on point sets in the upper half-plane to positivity of the integral operator is a standard density argument that is only sketched.
3. T2 covers M_eps-equivariant constructions only. A normalization using non-equivariant functionals of Phi is outside T2 and rests on the repo's earlier section26 verdict, which was not re-derived here.

## Files

vnorm.py (bracket, float thresholds, Nystrom norm), cert.py / cert.out (Arb G enclosures), cert_lower.py / cert_lower.out (Arb test-pair lower bound), gauge_bez.py / gauge_bez.out (sign-gauge zeros, b_a spectrum).
