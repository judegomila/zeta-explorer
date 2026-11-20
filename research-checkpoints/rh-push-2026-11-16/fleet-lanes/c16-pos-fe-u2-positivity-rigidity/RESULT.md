# c16-pos-fe-u2-positivity-rigidity: lemma POS-FE decided (it is true; G = c zeta)

Round 16, kind: deepen, cell U2-POS. Sources read: `campaign/STRATEGY.md` section 4.0 (statement of POS-FE),
`push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md` and `REFEREE.md` (Lemmas A, L, D; controls ZQ, SG, NR-q;
referee correction E1 with the member G_+), `push/OBSTRUCTION_MAP.md` section 2 (controls) and rows NR, G34, O1.

Nothing in this file is a statement about zeros of zeta. The result is an identification: it says which function
satisfies a list of hypotheses. No R4 mechanism. Score 0 by the registered rule. Labels: PROVED (in this file),
CLASSICAL (cited as recalled, not opened), MEASURED (float64 on the compute server unless marked mpmath), OPEN.

## 0. Outcome in six lines

1. **POS-FE is true (PROVED, section 2).** In fact a stronger statement holds, Theorem P: if
   G(s) = integral over [1, inf) of x^(-s) dN(x) in some half-plane with N a non-negative measure, (s - 1) G(s) is
   entire of finite order, and G has zeta's functional equation, then G = r zeta with r the residue at 1.
   POS-FE follows because nu >= 0 for -G'/G implies N >= 0 for G (Step 1).
2. The proof does not use multiplicativity, the Euler product, or the measure nu beyond N >= 0. The inputs are:
   the functional equation (through the theta relation), the pole clause, non-negativity of the coefficient
   measure of G, and the support clause "no coefficient mass at frequencies below 1". The decisive step is the
   trace identity (T): integral of abs(phihat)^2 dN = (r/2)(norm(phi)^2 - abs(integral phi)^2) for every phi in
   L^2 supported in [-1/2, 1/2]; with phi the indicator the right side is 0, so N lives on the zeros of the
   sinc function, the positive integers. This is the one-dimensional case of the uniqueness argument for the
   linear-programming bound (test function: triangle, transform sinc^2), applied to the self-dual measure of G.
3. Each hypothesis is necessary, with a member of the family G = zeta m on file for each: N signed (ZQ, SG);
   coefficient mass below 1 (T-NR in symmetric form: N >= 0 with support starting at 1/q); extra poles (the
   referee's G_+ of c15 E1: nu >= 0, N >= 0, support in [1, inf), poles at 1/2 +- b). The identity (T) holds for
   ZQ to 1.7e-16, fails for G_+ by the residue terms, and holds for T-NR only with the mass term below 1
   (MEASURED, section 4).
4. The cell U2-POS is therefore an identification class and moves to U3:
   {FE (zeta's), pole at 1 only, finite order, N >= 0 on [1, inf)}. It contains {FE, pole, Lambda_G >= 0}.
5. The registered quantitative form ("nu >= -eps mu forces zeros within f(eps) of the line, f -> 0") implies RH
   by applying it to G = zeta (one line, section 5). So it cannot be obtained from the identification; what the
   proof does give is an exact balance law for signed members (Proposition T), which is about coefficient mass
   and not about zeros.
6. Server screen (section 3): with one off-line quartet forced at integer multiplicity, the best member found
   by a mixed-integer program over removals, added on-line zeros and further quartets is the two-zero swap ZQ
   itself at every K tested, and the fractional relaxation is 0.80 to 0.88 of it. The relaxed
   program of the assignment (fractional multiplicities everywhere) has a minimum that falls with K; that fall
   is produced by fractional multiplicities, which no meromorphic G has.

## 1. Plan

What is new against the atlas and the walls: nothing about zeta; a decision of the one lemma that kept the cell
U2-POS silent. Plan as assigned: (a) first lemma for finite multipliers; (b) the infinite case; (c) the decisive
test on the server: a linear program over multipliers with K <= 2000 poles at zeta zeros; (d) controls ZQ and
G_+ (called m_+ in the assignment); (e) the quantitative form.

What happened: while setting up (b), the problem was rewritten on the coefficient side. With zeta's functional
equation the even measure attached to G is its own Fourier transform (Bochner's form of Hamburger's theorem).
For a non-negative self-dual measure with no mass in 0 < abs x < 1 the triangle test function forces support
on the integers. That settles (a) and (b) at once, with no case distinction between densities, atoms off log N
and singular parts. The server run (c) was then used as a check of the theorem on finite families and to
measure the quantitative trade-off.

## 2. Theorem P and the proof of POS-FE

Notation: gam(s) = pi^(-s/2) Gamma(s/2). "Zeta's functional equation": gam(s) G(s) = gam(1 - s) G(1 - s).

**Theorem P (PROVED).** Let G be meromorphic in C such that
- (H1) in some half-plane G(s) = integral over [1, inf) of x^(-s) dN(x), N a non-negative locally finite measure;
- (H2) (s - 1) G(s) is entire of finite order (so the only possible pole is a simple pole at s = 1);
- (H3) gam(s) G(s) = gam(1 - s) G(1 - s).
Then N = r (sum over n >= 1 of delta_n) and G = r zeta, r = Res_{s=1} G >= 0. (If G has no pole then G = 0.)

**Corollary (POS-FE, PROVED).** Let G be meromorphic of finite order with a simple pole at s = 1 and no other,
with zeta's functional equation, and -G'/G(s) = integral over [1, inf) of x^(-s) d nu(x) in some half-plane with
nu a non-negative locally finite measure. Then G = c zeta.

Proof of the corollary from Theorem P (Step 1) and of Theorem P (Steps 2 to 7).

**Step 1 (nu >= 0 gives N >= 0; CLASSICAL: Bernstein, Levy-Khintchine for subordinators).** Put u = log x and
let nu~ be the image of nu on [0, inf). Fix a real sigma_1 in the half-plane. The transform is analytic there,
so G has no zero or pole there. For real s > sigma_1,

    log G(s) - log G(sigma_1) = - c (s - sigma_1) - integral over u > 0 of (1 - e^(-(s - sigma_1) u)) dPi(u),

c = nu~({0}) >= 0, dPi(u) = e^(-sigma_1 u) d nu~(u) / u, and integral of min(1, u) dPi is finite (nu~ is finite near
0 and e^(-sigma_1 u) d nu~ is finite). The right side is minus a Bernstein function of w = s - sigma_1, so
G(sigma_1 + w)/G(sigma_1) is completely monotone with value 1 at w = 0: it is the Laplace transform of a
probability measure P on [0, inf). Hence G(s) = C integral over [1, inf) of x^(-s) dN(x) with N >= 0,
C = G(sigma_1) a non-zero constant, first for real s > sigma_1 and then for Re s > sigma_1 by analytic
continuation. G/C satisfies (H1), (H2), (H3). An atom of nu at x = 1 only shifts the support of N to
[e^c, inf), which is inside [1, inf).

**Step 2 (abscissa; CLASSICAL: Landau).** For N >= 0 the real point of the abscissa of convergence of the
transform is a singularity of G. The only real singularity of G is s = 1. If there is none, the transform
converges everywhere; that case is included below with r = 0. Otherwise the representation (H1) holds for
Re s > 1. In particular N([1, X]) <= X^sigma G(sigma) for sigma > 1, so N is tempered.

**Step 3 (growth; CLASSICAL: Phragmen-Lindelof).** abs G <= G(2) on Re s = 2. On Re s = -1, (H3) and Stirling
give abs G(s) = O(abs(t)^(3/2)). (s - 1) G(s) is entire of finite order, so it is polynomially bounded in
-1 <= Re s <= 2.

**Step 4 (theta relation; CLASSICAL: Riemann, Hamburger, Bochner).** Theta(y) = integral of e^(-pi x^2 y) dN(x),
y > 0. For Re s > 1, integral over y > 0 of Theta(y) y^(s/2 - 1) dy = gam(s) G(s) (Tonelli, N >= 0). Mellin
inversion on Re s = 2 and a shift to Re s = -1 (allowed by Step 3 and the decay of Gamma) cross the poles of
gam G. These are: s = 1, residue r; s = 0, residue -r (by (H3): gam G is symmetric, so r/(s - 1) at 1 gives
-r/s at 0); none at s = -2n, n >= 1 (gam G(-2n) = gam G(1 + 2n) is finite). Substituting s -> 1 - s on the
shifted line and using (H3):

    Theta(y) + r/2 = y^(-1/2) (Theta(1/y) + r/2),   y > 0.

This is the step where the pole clause is used: a further pole of G at z adds a term in y^(-z/2) (with a power
of log y for a multiple pole) and the relation is no longer a self-duality.

**Step 5 (self-dual measure; PROVED).** mu = (r/2) delta_0 + (1/2)(N + N reflected) is an even non-negative
tempered measure on R with no mass in 0 < abs x < 1. Step 4 says that mu and its Fourier transform agree on
the Gaussians e^(-pi y x^2), y > 0. Differentiating in y, they agree on x^(2k) e^(-pi x^2) for every k, whose
span is dense in the even Schwartz functions (Hermite functions); both are even distributions. So muhat = mu
as tempered distributions.

**Step 6 (the trace identity; PROVED; this is the decisive step).** Let phi be real, smooth, supported in the
open interval (-1/2, 1/2), and f(x) = integral of phi(u) phi(u - x) du. Then f is smooth with support in the
open interval (-1, 1), f(0) = norm(phi)^2, fhat = abs(phihat)^2 >= 0, fhat(0) = (integral phi)^2. Pair mu with f
and with fhat. On the f side only the atom at 0 contributes (no mass in 0 < abs x < 1, and f = 0 for
abs x >= 1). So

    (T)   integral over [1, inf) of abs(phihat(x))^2 dN(x) = (r/2) ( norm(phi)^2 - (integral phi)^2 ).

Take phi_k smooth, supported in (-1/2, 1/2), phi_k -> 1 in L^2(-1/2, 1/2). The right side tends to
(r/2)(1 - 1) = 0. phihat_k -> sinc uniformly (sinc(x) = sin(pi x)/(pi x)), and N >= 0, so by Fatou

    integral over [1, inf) of sinc(x)^2 dN(x) <= 0.

Hence N is carried by the zeros of sinc in [1, inf): the positive integers. This is where N >= 0 is used
(Fatou, and the conclusion from a vanishing integral of a non-negative function) and where the support
clause is used (the f side). (Cauchy-Schwarz reading of (T): the right side is r/2 times the variance of phi on
an interval of length 1; it vanishes only for the constant, whose transform vanishes exactly on the non-zero
integers.)

**Step 7 (periodicity; PROVED).** mu = sum over n in Z of c_n delta_n, c_0 = r/2, c_n = N({abs n})/2, tempered.
Its Fourier transform sum c_n e^(-2 pi i n t) is a 1-periodic distribution, and equals mu. So mu is invariant
under translation by 1, c_n = c_0 for all n, N({n}) = r for every n >= 1, and G = r zeta. If r = 0 then N = 0.
(Hamburger's theorem is not needed; it would also finish from "N on the integers".) QED.

Remarks.
- Where each hypothesis enters: (H3) Step 4; (H2) Steps 3, 4; N >= 0 Steps 2, 4 (convenience) and 6
  (essential); support in [1, inf) Step 6 (essential). nu enters only through Step 1.
- The first lemma of the assignment (finitely many zeros and poles: the defect is x^(-1/2) times an almost
  periodic function plus terms x^(z - 1) and cannot be >= 0 unless zero) is the case "m rational" of the
  corollary. For that case Lemma L of c15 already applies whenever the defect has a density (nu >= 0 forces
  D >= 0 off the atoms of Lambda). The corollary covers every other case of the assignment (atoms off log N,
  singular parts, changed atoms at prime powers) without separating them.
- Constant 1 in the support clause is sharp: for every q > 1 the member zeta(s)(q^(s-1/2) + c + q^(1/2-s)),
  c > 0, has N >= 0, zeta's functional equation, the pole at 1 only, and coefficient mass starting at 1/q.
- Scaled form (PROVED by the same pairing with f(x) = (1 - abs(x)/a)_+): if N >= 0 has support in [a, inf) with
  a > 1 and (H2), (H3) hold, then (r/2)(1 - a) = integral of a sinc^2(a x) dN >= 0, so r = 0 and G = 0. Hecke's
  series for the groups G(lambda), lambda > 2, in weight 1/2 (frequencies sqrt(lambda n/2), c15 note on F6)
  therefore cannot have non-negative coefficients when they start at n = 1 with a pole at 1.
- Literature: the statement "a non-negative tempered measure equal to its Fourier transform with no mass in
  0 < abs x < 1 is a multiple of the Dirac comb" is the equality case of the Cohn-Elkies linear-programming
  bound in dimension one. It was not looked up for this lane; the proof above is complete as written given
  Landau, Bernstein, Phragmen-Lindelof and density of Hermite functions. It is new to the campaign record,
  with no claim of novelty beyond that.

**Proposition T (balance law for signed members; PROVED under the stated convergence).** Let G satisfy (H2),
(H3) and G(s) = integral over [1, inf) of x^(-s) dN(x) with N a signed measure whose total variation has a
convergent transform for Re s > 1. Then (T) holds for every smooth phi supported in (-1/2, 1/2), and

    integral of sinc^2 dN^+ = integral of sinc^2 dN^-      (N = N^+ - N^- the Jordan decomposition).

Proof: Steps 3 to 6 use N >= 0 only for Tonelli (replaced by absolute convergence) and Fatou (replaced by
dominated convergence with phi_k = indicator of [-1/2 + 1/k, 1/2 - 1/k] convolved with a mollifier of width
1/(2k): abs(phihat_k(x)) <= min(1, 1/(pi abs x)), and x^(-2) is integrable against abs N). So the coefficient
mass that a member carries off the integers is paid exactly, in the weight sinc^2, by negative coefficient mass.
This is the quantitative content of the proof. It is a statement about N, not about zeros.

## 3. Decisive test on the server (float64 screens; rhrun units listed in section 8)

Family: G = zeta m, m rational in s(1 - s), exact atoms. Poles of m at zeros 1/2 +- i g_j of zeta (weights a_j),
zeros of m at on-line points 1/2 +- i t_i (weights b_i) and quartets 1/2 +- eta +- i g (weights c_k). Then
nu = Lambda + D(x) dx with

    D(x) = x^(-1/2) [ sum a_j 2 cos(g_j L) - sum b_i 2 cos(t_i L) - sum c_k 4 cosh(eta L) cos(g_k L) ],  L = log x,

linear in the weights. delta = sup over x in [1, 1e6] of the negative part of D (so nu >= -delta dx on the
window; reference measure Lebesgue). Ordinates: the first 2000 zeros from python-flint (`zeros.py`,
`zeros.txt`; no repo data module). Grid in L: step min(0.004, 2 pi/(6 g_max)), constraints added by cutting
planes until the full grid is satisfied; each solution re-evaluated on a grid four times finer.

### 3.1 Forced quartet at integer multiplicity (`lp2.py`; the informative program)

One quartet 1/2 +- eta +- i g* with multiplicity 1, g* the midpoint of the consecutive pair with the smallest
ZQ envelope among the first K zeros. Free columns: removal of any of the zeros within 40 indices of the pair
(82 zeros), added on-line pairs at the eighth points of those gaps (567 columns), further quartets with the
same eta at the gap midpoints (80 columns). Stage 1: weights in [0, 1] (LP; a lower bound for every integer
choice on these columns). Stage 2: weights in {0, 1} (MILP, HiGHS, relative gap 1e-3 or the time limit; the
incumbent is a genuine member G = zeta m and is re-evaluated on the fine grid). eta = 0.00 is the double zero
on the line at g*.

| K | eta | pair (indices) | g* | d | ZQ: sup of D^- (fine grid) | proved bound of c15 | LP lower bound (fractional) | LP/ZQ | best integer member (MILP incumbent, fine grid) | MILP lower bound | incumbent is ZQ | seconds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 25 | 0.00 | 24, 25 | 88.1172 | 0.6919 | 1.34040e+00 | 2.073e+00 | 1.06707e+00 | 0.796 | 1.34040e+00 | 1.33633e+00 | yes | 31 |
| 25 | 0.05 | 24, 25 | 88.1172 | 0.6919 | 1.35005e+00 | 2.573e+00 | 1.07473e+00 | 0.796 | 1.35005e+00 | 1.34718e+00 | yes | 31 |
| 25 | 0.10 | 24, 25 | 88.1172 | 0.6919 | 1.37916e+00 | 3.307e+00 | 1.09791e+00 | 0.796 | 1.37916e+00 | 1.37578e+00 | yes | 28 |
| 25 | 0.20 | 24, 25 | 88.1172 | 0.6919 | 1.49844e+00 | 6.240e+00 | 1.19486e+00 | 0.797 | 1.49844e+00 | 1.49684e+00 | yes | 50 |
| 25 | 0.30 | 24, 25 | 88.1172 | 0.6919 | 1.71111e+00 | 1.539e+01 | 1.37427e+00 | 0.803 | 1.71111e+00 | 1.70954e+00 | yes | 58 |
| 50 | 0.00 | 34, 35 | 111.4521 | 0.4226 | 6.33357e-01 | 7.733e-01 | 5.18245e-01 | 0.818 | 6.33357e-01 | 6.29548e-01 | yes | 56 |
| 50 | 0.05 | 34, 35 | 111.4521 | 0.4226 | 6.43865e-01 | 9.680e-01 | 5.27097e-01 | 0.819 | 6.43865e-01 | 6.40250e-01 | yes | 69 |
| 50 | 0.10 | 34, 35 | 111.4521 | 0.4226 | 6.75680e-01 | 1.276e+00 | 5.53957e-01 | 0.820 | 6.75680e-01 | 6.72319e-01 | yes | 84 |
| 50 | 0.20 | 34, 35 | 111.4521 | 0.4226 | 8.08796e-01 | 2.629e+00 | 6.67435e-01 | 0.825 | 8.08796e-01 | 8.07629e-01 | yes | 124 |
| 50 | 0.30 | 34, 35 | 111.4521 | 0.4226 | 1.05308e+00 | 7.269e+00 | 8.79122e-01 | 0.835 | 1.05308e+00 | 1.05203e+00 | yes | 229 |
| 100 | 0.00 | 91, 92 | 221.0728 | 0.3579 | 4.77634e-01 | 5.547e-01 | 3.80336e-01 | 0.796 | 4.77634e-01 | 4.77301e-01 | yes | 66 |
| 100 | 0.05 | 91, 92 | 221.0728 | 0.3579 | 4.88254e-01 | 6.982e-01 | 3.89251e-01 | 0.797 | 4.88254e-01 | 4.87960e-01 | yes | 64 |
| 100 | 0.10 | 91, 92 | 221.0728 | 0.3579 | 5.20429e-01 | 9.344e-01 | 4.16382e-01 | 0.800 | 5.20429e-01 | 5.20224e-01 | yes | 72 |
| 100 | 0.20 | 91, 92 | 221.0728 | 0.3579 | 6.55832e-01 | 2.022e+00 | 5.30748e-01 | 0.809 | 6.55832e-01 | 6.54663e-01 | yes | 80 |
| 100 | 0.30 | 91, 92 | 221.0728 | 0.3579 | 9.05727e-01 | 5.903e+00 | 7.53128e-01 | 0.832 | 9.05727e-01 | 9.04813e-01 | yes | 157 |
| 200 | 0.00 | 186, 187 | 376.0750 | 0.2491 | 2.48734e-01 | 2.687e-01 | 2.06619e-01 | 0.831 | 2.48734e-01 | 2.48483e-01 | yes | 130 |
| 200 | 0.05 | 186, 187 | 376.0750 | 0.2491 | 2.59538e-01 | 3.451e-01 | 2.15862e-01 | 0.832 | 2.59538e-01 | 2.59226e-01 | yes | 88 |
| 200 | 0.10 | 186, 187 | 376.0750 | 0.2491 | 2.92329e-01 | 4.875e-01 | 2.44046e-01 | 0.835 | 2.92329e-01 | 2.91603e-01 | yes | 111 |
| 200 | 0.20 | 186, 187 | 376.0750 | 0.2491 | 4.30109e-01 | 1.228e+00 | 3.63995e-01 | 0.846 | 4.30109e-01 | 4.28657e-01 | yes | 136 |
| 200 | 0.30 | 186, 187 | 376.0750 | 0.2491 | 6.87518e-01 | 4.115e+00 | 5.93832e-01 | 0.864 | 6.87518e-01 | 6.86887e-01 | yes | 270 |
| 400 | 0.00 | 363, 364 | 630.6398 | 0.1659 | 1.15088e-01 | 1.193e-01 | 9.20586e-02 | 0.800 | 1.15088e-01 | 1.15001e-01 | yes | 184 |
| 400 | 0.05 | 363, 364 | 630.6398 | 0.1659 | 1.25935e-01 | 1.606e-01 | 1.00839e-01 | 0.801 | 1.25935e-01 | 1.25899e-01 | yes | 294 |
| 400 | 0.10 | 363, 364 | 630.6398 | 0.1659 | 1.58903e-01 | 2.540e-01 | 1.27711e-01 | 0.804 | 1.58903e-01 | 1.58756e-01 | yes | 235 |
| 400 | 0.20 | 363, 364 | 630.6398 | 0.1659 | 2.97703e-01 | 8.125e-01 | 2.43455e-01 | 0.818 | 2.97703e-01 | 2.97703e-01 | yes | 360 |
| 400 | 0.30 | 363, 364 | 630.6398 | 0.1659 | 5.58507e-01 | 3.181e+00 | 4.76040e-01 | 0.852 | 5.58507e-01 | 5.29052e-01 | yes | 452 |
| 800 | 0.00 | 693, 694 | 1054.8916 | 0.1106 | 5.20816e-02 | 5.293e-02 | 4.22711e-02 | 0.812 | 5.20816e-02 | 5.20803e-02 | yes | 365 |
| 800 | 0.05 | 693, 694 | 1054.8916 | 0.1106 | 6.29412e-02 | 7.871e-02 | 5.11544e-02 | 0.813 | 6.29412e-02 | 6.29412e-02 | yes | 318 |
| 800 | 0.10 | 693, 694 | 1054.8916 | 0.1106 | 9.59524e-02 | 1.504e-01 | 7.83235e-02 | 0.816 | 9.59524e-02 | 9.59524e-02 | yes | 385 |
| 800 | 0.20 | 693, 694 | 1054.8916 | 0.1106 | 2.35070e-01 | 6.282e-01 | 1.96644e-01 | 0.837 | 2.35070e-01 | 2.12812e-01 | yes | 474 |
| 800 | 0.30 | 693, 694 | 1054.8916 | 0.1106 | 4.97253e-01 | 2.767e+00 | 4.35253e-01 | 0.875 | 4.97253e-01 | 4.65409e-01 | yes | 860 |
| 1600 | 0.00 | 1496, 1497 | 1977.2227 | 0.0488 | 1.02602e-02 | 1.029e-02 | 8.41340e-03 | 0.820 | 1.02602e-02 | 1.02595e-02 | yes | 311 |
| 1600 | 0.05 | 1496, 1497 | 1977.2227 | 0.0488 | 2.11232e-02 | 2.607e-02 | 1.73434e-02 | 0.821 | 2.11232e-02 | 2.11232e-02 | yes | 491 |
| 1600 | 0.10 | 1496, 1497 | 1977.2227 | 0.0488 | 5.41534e-02 | 8.375e-02 | 4.46496e-02 | 0.825 | 5.41534e-02 | 5.23980e-02 | yes | 554 |
| 1600 | 0.20 | 1496, 1497 | 1977.2227 | 0.0488 | 1.93443e-01 | 5.098e-01 | 1.62296e-01 | 0.839 | 1.93443e-01 | 1.63799e-01 | yes | 558 |
| 1600 | 0.30 | 1496, 1497 | 1977.2227 | 0.0488 | 4.56483e-01 | 2.500e+00 | 3.95281e-01 | 0.866 | 4.56483e-01 | 4.28115e-01 | yes | 921 |
| 2000 | 0.00 | 1496, 1497 | 1977.2227 | 0.0488 | 1.02602e-02 | 1.029e-02 | 8.41340e-03 | 0.820 | 1.02602e-02 | 1.02595e-02 | yes | 323 |
| 2000 | 0.05 | 1496, 1497 | 1977.2227 | 0.0488 | 2.11232e-02 | 2.607e-02 | 1.73434e-02 | 0.821 | 2.11232e-02 | 2.11232e-02 | yes | 499 |
| 2000 | 0.10 | 1496, 1497 | 1977.2227 | 0.0488 | 5.41534e-02 | 8.375e-02 | 4.46496e-02 | 0.825 | 5.41534e-02 | 5.41054e-02 | yes | 500 |
| 2000 | 0.20 | 1496, 1497 | 1977.2227 | 0.0488 | 1.93443e-01 | 5.098e-01 | 1.62296e-01 | 0.839 | 1.93443e-01 | 1.63791e-01 | yes | 518 |
| 2000 | 0.30 | 1496, 1497 | 1977.2227 | 0.0488 | 4.56483e-01 | 2.500e+00 | 3.95281e-01 | 0.866 | 4.56483e-01 | 4.28088e-01 | yes | 895 |

Reading (MEASURED).
- **In all 40 cells the best integer member is the two-zero swap ZQ**: remove the pair, add the quartet,
  nothing else. No added on-line zero, further removal or further quartet lowers delta. The MILP lower bound
  (computed on the cutting-plane rows, so valid for the fine grid) is within 0.6 percent of the fine-grid
  value of the incumbent in 23 of the 24 cells with eta <= 0.1 (the exception, K = 1600, eta = 0.10, stopped at
  the time limit 3.2 percent below) and in 9 of the 16 cells with eta = 0.2, 0.3; in the other 7 the solver
  stopped at the time limit with the bounds shown, 5 to 15 percent below the incumbent.
- The fractional lower bound is 0.796 to 0.875 of the ZQ value in every cell. So on these columns no
  configuration, integer or not, has delta below 0.79 of ZQ's.
- The minimum against K falls only because closer pairs become available: delta follows the envelope
  maximum of 4 x^(-1/2)(cosh(eta L) - cos(d L)), which is of order eta^2 + d^2 (at eta = 0: 1.340, 0.633, 0.478,
  0.249, 0.115, 0.0521, 0.0103 for K = 25 to 1600, with d = 0.692 to 0.0488; K = 2000 has the same best pair as
  K = 1600). At fixed pair, delta rises with eta as in c15: 0.0103, 0.0211, 0.0542, 0.193, 0.456 for
  eta = 0, 0.05, 0.1, 0.2, 0.3 on the pair 1496, 1497.
- Window check (`lp2_wide.log`, 120 indices on each side instead of 40): K = 400, eta = 0.1: LP lower bound
  0.127546 against 0.127711 (0.13 percent lower). K = 2000, eta = 0.1 with 2169 columns: the LP stopped at its
  time limit after 7 rounds with the valid but unconverged lower bound 0.04324 (0.04465 with 40 indices), and
  the MILP returned no usable incumbent in 900 s; that cell is recorded as not completed, as is the MILP at K = 400 with 120 indices (stopped by this lane before it finished).

### 3.2 The relaxed programs of the assignment (`lp.py`)

A: zero 1 removed with weight 1, every other weight fractional and free (removals among the first K zeros in
[0, 1]; added on-line pairs at the quarter points of the gaps and quartets with eta = 0.1 at the midpoints, in
[0, 4]). B: total quartet weight 1 at the given eta, spread freely over all gap midpoints; everything else as
in A. C: B plus one column for a double real pole pair at 1/2 +- 0.2 (the G_+ column).

| program | eta | K | status | min delta (constraint grid) | sup of D^- on the 4x finer grid | sum a | fractional a | sum b | quartet weights (largest) | real-pole weight |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 0.10 | 25 | converged | 9.4511e-01 | 9.5699e-01 | 3.73 | 19 | 4.01 | 0.078 at 45.666 | - |
| A | 0.10 | 50 | converged | 9.2059e-01 | 9.4233e-01 | 8.44 | 41 | 8.43 | 0.065 at 45.666 | - |
| A | 0.10 | 100 | converged | 9.1028e-01 | 9.4741e-01 | 13.69 | 77 | 13.89 | 0.102 at 45.666 | - |
| A | 0.10 | 200 | converged | 9.0667e-01 | 9.4802e-01 | 25.18 | 148 | 24.51 | 0.258 at 185.237 | - |
| B | 0.05 | 25 | converged | 4.3727e-01 | 4.4252e-01 | 1.78 | 22 | 0.00 | 0.135 at 60.089 | - |
| B | 0.05 | 50 | converged | 2.3079e-01 | 2.3983e-01 | 1.97 | 40 | 0.08 | 0.194 at 111.452 | - |
| B | 0.05 | 100 | converged | 1.1633e-01 | 1.2961e-01 | 2.21 | 79 | 0.27 | 0.135 at 185.237 | - |
| B | 0.10 | 25 | converged | 4.4364e-01 | 4.4894e-01 | 1.78 | 21 | 0.00 | 0.134 at 60.089 | - |
| B | 0.10 | 50 | converged | 2.3651e-01 | 2.4577e-01 | 1.96 | 41 | 0.08 | 0.185 at 111.452 | - |
| B | 0.10 | 100 | converged | 1.2158e-01 | 1.3546e-01 | 2.20 | 76 | 0.26 | 0.130 at 185.237 | - |
| B | 0.10 | 200 | converged | 6.6826e-02 | 7.6936e-02 | 2.22 | 151 | 0.25 | 0.144 at 376.075 | - |
| B | 0.20 | 25 | converged | 4.7024e-01 | 4.7655e-01 | 1.76 | 21 | 0.00 | 0.132 at 60.089 | - |
| B | 0.20 | 50 | converged | 2.5884e-01 | 2.6932e-01 | 1.94 | 42 | 0.07 | 0.151 at 111.452 | - |
| B | 0.20 | 100 | converged | 1.4235e-01 | 1.5984e-01 | 2.12 | 72 | 0.19 | 0.115 at 185.237 | - |
| B | 0.30 | 25 | converged | 5.1681e-01 | 5.2412e-01 | 1.74 | 19 | 0.00 | 0.114 at 60.089 | - |
| B | 0.30 | 50 | converged | 2.9546e-01 | 3.0775e-01 | 1.87 | 40 | 0.02 | 0.102 at 111.452 | - |
| B | 0.30 | 100 | converged | 1.7719e-01 | 1.9724e-01 | 2.00 | 70 | 0.09 | 0.093 at 185.237 | - |
| B | 0.30 | 200 | converged | 1.1006e-01 | 1.2894e-01 | 2.15 | 142 | 0.20 | 0.052 at 295.269 | - |
| C | 0.10 | 25 | converged | 0.0000e+00 | 0.0000e+00 | 0.00 | 0 | 0.00 | 1.000 at 45.666 | 1.0 |
| C | 0.10 | 50 | converged | 0.0000e+00 | 0.0000e+00 | 0.00 | 0 | 0.00 | 1.000 at 95.261 | 1.0 |
| C | 0.10 | 100 | converged | 0.0000e+00 | 0.0000e+00 | 0.00 | 0 | 0.00 | 1.000 at 217.619 | 1.0 |
| C | 0.10 | 200 | converged | 0.0000e+00 | 0.0000e+00 | 0.00 | 0 | 0.00 | 1.000 at 259.242 | 1.0 |
| C | 0.30 | 25 | converged | 0.0000e+00 | 5.4421e-04 | 0.00 | 0 | 0.00 | 0.202 at 45.666 | 1.0 |
| C | 0.30 | 50 | converged | 0.0000e+00 | 2.5147e-03 | 0.00 | 0 | 0.00 | 0.091 at 95.261 | 1.0 |
| C | 0.30 | 100 | converged | 0.0000e+00 | 5.8370e-03 | 0.00 | 0 | 0.00 | 0.095 at 120.080 | 1.0 |
| C | 0.30 | 200 | converged | 0.0000e+00 | 4.8553e-03 | 0.00 | 0 | 0.00 | 0.109 at 199.640 | 1.0 |


K = 400 (unit rh-c16lpmid2): stopped by this lane after 2300 s with the cutting-plane loop not converged. The values of the last completed round are lower bounds for the grid optimum (fewer rows): A >= 0.90534 (round 5, largest remaining violation 0.35), B(eta = 0.1) >= 0.031414 (violation 1.0e-2), B(eta = 0.3) >= 0.067324 (violation 7.8e-2). They continue the two trends: A flat, B about half its K = 200 value.

Reading (MEASURED).
- A is flat in K: 0.945, 0.921, 0.910, 0.907. Removing a zero at integer multiplicity costs a fixed amount
  that fractional adjustments elsewhere do not remove (the nearest allowed new on-line zero is a quarter gap,
  1.7, away; moving a zero along the line by a small step is not among the columns and would cost
  proportionally to the step, which is the reason the infimum over the full family is 0 and not attained, as
  for ZQ in c15).
- B falls roughly like 1/K: 0.444, 0.237, 0.122, 0.067 at eta = 0.1. The solutions put the unit quartet weight
  on many midpoints (largest single weight 0.13 to 0.19) with 20 to 150 fractional removals. A quartet of weight
  0.14 is not a zero of a meromorphic function, so these are not members of the family; the fall measures the
  cancellation of many incoherent phases at fractional weight. With the quartet at integer weight (3.1) the
  fractional lower bound stays at 0.8 of ZQ. **So the minimum of the fully relaxed program against K is not
  evidence for or against a member with nu >= 0**; the integer program is, and it returns ZQ.
- K = 800, 1600, 2000 in the dense relaxed form (up to 9996 columns by 33185 rows) were started (unit
  rh-c16lpbig) and stopped by this lane: after 5 minutes no first round had finished, the cost grows like
  K^3, and the relaxed program had been identified as the uninformative one. The K = 2000 scale was run in
  the forced-quartet form (3.1), where it decides the question asked of it.
- No run returned delta = 0 without the extra-pole column. Theorem P says no genuine member can.


## 4. Controls

Members of the family against Theorem P (identity (T) with phi = cos^2(pi x) on [-1/2, 1/2], for which
phihat = sinc/2 + (sinc(. - 1) + sinc(. + 1))/4, norm^2 - mean^2 = 1/8; `checks.py`, `checks.json`):

| member | hypotheses kept | (T): left | (T): right | defect | step of the proof that fails |
|---|---|---|---|---|---|
| zeta | all | 0.0625 | 0.0625 | 0 | none |
| ZQ (zeros 1, 2; eta = 0.3) | all but N >= 0 (N = sum delta_n + A(x) dx, A of both signs) | 0.0625 + 0.005114103883530 | (m(1)/2)/8 = 0.067614103883530 | 1.7e-16 | Step 6: Fatou and "integral of a non-negative function is 0"; (T) itself holds |
| G_+ (c15 E1; zeros 1, 2; eta = 0.07, b = 0.2) | nu >= 0, N >= 0, support, FE; double poles at 1/2 +- b | 5.4285 | 135541.80 | -1.36e5 | Step 4: residues at 1/2 +- b; mu is not self-dual |
| T-NR symmetric (q = 3, c = 1) | N >= 0, FE, pole; support starts at 1/3 | sum fhat dN = 0.315090742770 | (r/2)/8 = 0.206837567297 | 0.108253175476 = mass term of f at x = 1/3, 2/3 (general identity closes to 6e-13) | Step 6: the f side has mass in 0 < abs x < 1 |

Referee re-check with other code (`ref_check.py`, `ref_theta.py`; mpmath, 20 to 25 digits; ZQ and G_+ on the
pair 2, 3): theta relation of Step 4 for ZQ (eta = 0.1, r = m(1) = 1.0152042268912917) holds to 1.3e-26 at
y = 0.5, 0.7, 1.6, 3.1 and fails by 1.5e-3 to 3.3e-3 if r is replaced by 1; identity (T) with phi = 1 - 4x^2:
defect -4.8e-10 with the integral cut at x = 60 (neglected tail of order 1e-9); limit form: integral of
sinc^2 A dx over [1, 60] = -1.28215e-5 and the tail estimate (r - 1)/(2 pi^2 60) = +1.28376e-5, sum 1.6e-8;
coefficient density A of ZQ takes both signs (min -2.70, max +2.78 on 1 <= x < 31); A of G_+ (eta = 0.07,
b = 0.2) is >= 0 on the same range (min -7e-14 at x = 1, where it is 0 exactly; max 6.6e5), which is Step 1 on
an example; (T) for G_+ fails by -2.8e5.

Controls of the screen:
- ZQ reproduces: with the quartet forced at integer multiplicity the mixed-integer optimum is the ZQ swap, with
  the value of the envelope 4 x^(-1/2)(cosh(eta L) - cos(d L)) recorded in c15 (table of section 3).
- G_+ reproduces: problem C (the screen with one extra column for a double real pole pair at 1/2 +- 0.2)
  returns delta = 0 with exactly the G_+ configuration (one quartet, weight 1; real-pole weight 1; no removal)
  for eta = 0.1 < b. Its non-negativity is exact, not a grid statement: D_+ = 4 x^(-1/2)(cosh(b L) -
  cosh(eta L) cos(g L)) >= 0 for b >= eta (c15 E1). So no interval check is owed for it. For eta = 0.3 > b the
  program returns delta = 0 on the constraint grid with a fractional mixture of quartets, and the finer grid
  shows a negative minimum (-5e-4 to -6e-3): not a survivor; fractional multiplicities and grid resolution.
- No survivor (delta = 0 without the extra-pole column) appeared in any run, so no interval check was run.
  Theorem P says none exists among genuine members; the screen agrees on every family tested.
- Not identically zero: every member used has G(2) = zeta(2) m(2) != 0 (m(2) = 1 + sum R_j/(2 - z_j) is
  checked against the closed form to 5.6e-17 for ZQ and 4.7e-11 for G_+ in `checks.json`); m is a non-zero
  rational function in every program because the weights enter log m linearly.
- Standard battery. Davenport-Heilbronn, E_a, backward heat, sign twists, unimodular twists, Beurling systems,
  theta^w and the phase-rotated transfer operator are outside the hypotheses of Theorem P (no functional
  equation of zeta's type, or no representation on [1, inf)). The theorem is an identification, so the
  question "does the conclusion fail for the control" is answered by: each control lacks a named hypothesis.
  DH moved to zeta's gamma factor (c15, F6) has frequencies n/sqrt 5 below 1 and signed coefficients.

## 5. The quantitative form

Registered form QF: there are a reference measure mu and f with f(eps) -> 0 such that, for every G with the
other hypotheses of POS-FE, nu >= -eps mu implies that every zero of G in the strip lies within f(eps) of the
line.

- **QF implies RH (PROVED, one line).** zeta satisfies the hypotheses with nu = Lambda >= -eps mu for every
  eps > 0, so its zeros are within inf f = 0 of the line. So QF is at least as strong as RH and cannot follow
  from the identification at eps = 0, which only returns G = zeta. It is not a smaller target.
- **What is true at eps > 0 (Proposition T).** For signed members the weight of N off the integers is balanced
  by the negative part of N. This controls coefficients. A member can have small negative part and zeros at
  any distance eta < 1/2 only at the price recorded for ZQ; nothing in the proof converts coefficient
  closeness into a statement about zeros, and for G = zeta the balance law is empty (both sides 0).
- **Measured trade-off in the rational family (section 3).** With one quartet at distance eta, integer
  multiplicities and zeta zeros of the first K as the only allowed poles, the minimum of delta over the tested
  columns is ZQ's value, of order eta^2 + d^2 (d the half gap of the removed pair), and the fractional lower
  bound is a constant fraction of it. So within this family the dependence eps of order eta^2 + d^2 found in
  c15 is the true order at the tested heights, not only an upper bound. This is a statement about
  modifications of zeta built on zeros already known to be on the line; it does not constrain zeta.

## 6. Verdict and the four flags

**Verdict: the missing lemma POS-FE is proved; registered outcome "a proof (identification row in U3,
score 0)".** The cell U2-POS is closed as a cell of U3: {FE, pole at 1 only, finite order, N >= 0 on [1, inf)}
identifies c zeta; the hypothesis Lambda_G >= 0 is one way to get N >= 0. No statement about zeros of zeta.

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | the proof uses N >= 0 and the support clause only; Theorem P has no multiplicative hypothesis, and nu enters through Step 1 alone. The lane shows the opposite: in this cell positivity with the functional equation identifies zeta without any use of the Euler product |
| R2 height-uniform, every window | false | no statement about zeros; the theorem is global in the coefficients |
| R3 every control fails structurally | false | not applicable in the sense of the rule: an identification has no control inside its class. What is established: each neighbouring member fails one named hypothesis and one named step (table of section 4, measured for ZQ, G_+, T-NR) |
| R4 reaches the critical line | false | nothing is said about zeros; QF, the only form that would, implies RH |

## 7. Three weakest steps

1. **Step 5, from Gaussians to all Schwartz functions, and Step 4, the contour shift.** Both are standard
   (Bochner's equivalence of the functional equation and the modular relation), but they are written here in
   outline: the density of the span of x^(2k) e^(-pi x^2) in even Schwartz space and the passage from
   difference quotients in y to derivatives in the Schwartz topology are cited, not proved line by line; the
   shift uses polynomial growth from Phragmen-Lindelof for a function of finite order with a pole removed. A
   referee should check both against a written source (Bochner 1951, or Hamburger's theorem in Titchmarsh 2.13).
2. **Step 1, the passage from nu to N.** It rests on the Bernstein-function fact (exp of minus a Bernstein
   function is completely monotone) and on the reading of the hypothesis: nu locally finite on the closed
   half-line [1, inf), transform convergent in a half-plane. If the hypothesis were read with nu allowed to be
   infinite near x = 1, Step 1 would need integral of min(1, log x) d nu/log x finite instead; the lemma as
   stated in STRATEGY 4.0 does not have that case.
3. **The screen of section 3 is float64 on finite column sets and a finite window.** The statement "the
   integer optimum is ZQ" is a mixed-integer result on the listed candidate columns (removals within 40
   indices of the pair, added on-line zeros at eighth points of the gaps, further quartets at midpoints) with
   a time limit; where the solver stopped at the limit the table gives the incumbent and the bound. It
   supports section 5 and is not used in the proof.

## 8. Files and server units

- `zeros.py`, `zeros.txt`: first 2000 ordinates (python-flint 0.9.0, 30 digits printed). Unit rh-c16zeros-1119211954.
- `checks.py`, `checks.json`: identity (T) on zeta, ZQ, G_+, T-NR. Unit rh-c16checks-1119212035.
- `ref_check.py`, `ref_check.json`, `ref_theta.py`, `ref_theta.json`: referee re-check (mpmath, other test function and
  instances). Units rh-c16ref-1119214921 (a first unit rh-c16ref-1119212338 with nested quadrature was stopped as too slow), rh-c16reft-1119215148.
- `lp.py`, `lp_small.json`, `lp_small.log`, `lp_mid.json`, `lp_mid.log`: relaxed programs A, B, C. Units rh-c16lpsmall-1119212035,
  rh-c16lpmid-1119212409 (stopped, restarted as rh-c16lpmid2-1119215037 with K = 200 first; stopped at K = 400 as described in 3.2);
  rh-c16lpbig-1119212123 (K = 800 to 2000 in this dense form) was stopped by this lane after 5 minutes without
  completing a round: the dense LP grows like K^3 and the relaxed program had already been seen to be the
  uninformative one.
- `lp2.py`, `lp2_test.json`, `lp2_main.json`, `lp2_main.log`, `lp2_wide.log`, `tables.md`, `mktab.py`: forced-quartet programs (LP and MILP).
  Units rh-c16lp2test-1119212237, rh-c16lp2main-1119213452, rh-c16lp2wide-1119213452 (two earlier units of the
  same names, -1119212409, were stopped and restarted with a looser cutting-plane stop rule).
- All units of this lane were stopped or had ended when this file was written; nothing was left running.
