# c12-heat-tied-family-open-cell: RESULT

Verdict: **precise obstruction; both open cells of `c11-rs3-debranges-positivity-family` are decided, the device stays closed.** No statement about zeros of zeta is obtained.

- Cell 1 (backward heat at (N2)): the heat family FAILS at (N2) for every tau < 0 tested (11 to 25 failing on-line zeros below height 500), in addition to failing the hypothesis of Theorem 1. The height of the first failure is NOT monotone in tau. What is monotone in the data is the value q_1 at a tracked zero. For tau >= 0.5 the forward family PASSES (N2) at every on-line zero below 500, so (N2) is a condition that a forward-heated zeta satisfies and zeta does not.
- Cell 2 (tied conductor family V3b): CLOSED BY COMPUTATION for q = 5 (pair), q = 7 and q = 13, in each of three readings of "tied", at two independent steps: (i) zeros of w inside the strip (33 located for the pair mod 5 below height 500, each confirmed by a ball-arithmetic winding number), (ii) a boundary sign condition on Re s = 1/2 (Lemma T below) that fails with Arb-certified negative values. The joint-universality argument of c11 is no longer needed.
- Side result (measured, mean-value type, not a route): for the full odd family mod q the boundary quantity S_v(t) is positive for t < T_0(q), T_0 = 17.44, 63.46, 279.32, 652.25 at q = 13, 29, 53, 101; the T-NR family turns negative at t = 3.34 to 3.42 for every q tested. This is a conductor-aspect average (orthogonality of characters), false in every fixed family at larger height.

Labels: PROVED / CLASSICAL / OPENED (source read in this lane) / MEASURED / ARGUED / OPEN.
Source opened in this lane: Conrey-Li, arXiv:math/9812166v1, Theorem 2 and its proof, section 3.1 (text extracted from the PDF). Theorem 1 is used as quoted in c11.
Numerics: local only, every run through `scripts/memcap.sh 8`, python-flint 0.9.0 (Arb ball arithmetic) and mpmath 1.4.1 in a venv that was inside this directory (removed after the runs; recreate with `python3 -m venv venv && venv/bin/pip install python-flint mpmath numpy`); several single-process runs side by side. **No server use, no rhrun units.** Every run whose output is used finished in under 20 minutes except the q = 5 interior screen to height 500 (1241 s, 41 s over, run while other processes of this lane shared the machine). Runs that passed or were about to pass 20 minutes were stopped by pid and their output discarded: the character-by-character conductor runs at q = 53, 101 and E_a at q = 29 (replaced by the orthogonality formula of section 3.5, about q times faster), the q = 13 interior screens to height 200 (about 27 minutes when stopped; rerun to height 50), and the q = 199 conductor run (stopped at 19:44, not replaced).
Pre-registration: `PREREG.md` (main part written before any run; addendum 1 written after the q = 5 screen to height 40 returned no zero and before the boundary statistic was run; addendum 2 before the conductor-aspect runs).

## 1. Plan

1. Cell 2 first (decisive, cheap): locate zeros of w0 for the pair mod 5; confirm by winding number in Arb.
2. State what Theorem 2 gives for a tied weight; derive a necessary condition that needs no outer function.
3. Cell 1: state (N2) for the heat family exactly; evaluate q_1 at every on-line zero below 500 for 13 values of tau.
4. Controls: LAT for cell 1; T-NR and E_a for cell 2.

New relative to c11 and the map: the heat-family evaluation of (N2) (row "backward heat", NOT RUN there); the computation for V3b (ARGUED there from recalled joint universality); Lemma T (boundary reduction), which also gives a one-line form of c11's Lemma 2.

## 2. Cell 1: (N2) for the heat family

### 2.1 First lemma: the exact statement

Object. Phi(v) = sum_{n>=1} (2 pi^2 n^4 e^{9v} - 3 pi n^2 e^{5v}) exp(-pi n^2 e^{4v}),

    X_tau(s) = 8 int_0^inf e^{tau v^2} Phi(v) cosh(2 (s - 1/2) v) dv,     E_tau(z) = X_tau(1 - iz).

X_0 = xi/2 with xi(s) = s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) (CLASSICAL; checked: relative difference below 1e-179 at four points up to height 499.3). tau is the Polymath time; the brief's kernel e^{tau u^2/16} kappa(u) is this one with u = 4v. X_tau is entire of order one, real on the real axis and on Re s = 1/2, X_tau(s) = X_tau(1 - s), and d/dtau X_tau = (1/4) d^2/ds^2 X_tau.

**Lemma H1 (statement of (N2) for the family; PROVED given Theorem 1 as quoted in c11).** E_tau*(z) = E_tau(z - i) for every real tau. Theorem 1 applies to E_tau if and only if its hypotheses hold: no zeros of X_tau in Re s >= 1 (this is |E*| < |E| in the upper half-plane together with no real zeros) and |E_tau(x + iy)| increasing in y > 0. Under these hypotheses condition (C) for H(E_tau) implies (N1_tau): all zeros of X_tau on Re s = 1/2, and

    (N2_tau)   - Re{ X_tau'(rho) X_tau(rho + 1) } >= 0   at every zero rho of X_tau.

For tau < 0 the hypothesis fails: by `b-escape-law` Theorem A (internal, refereed once) the zeros of X_tau leave every vertical strip, so X_tau has zeros in Re s > 1 and H(E_tau) is not a de Branges space; the located zero for tau = -2 at Re s = 1.125 (height 60.7) is an instance below height 100. So for tau < 0 the first failing step is the hypothesis of Theorem 1, then (N1). The quantity in (N2_tau) is still defined at each zero on the line:

    q_h(rho; tau) := - Re{ X_tau'(rho) X_tau(rho + h) } / ( |X_tau'(rho)| |X_tau(rho + h)| ),   Re rho = 1/2,

and "heat at (N2)" means: is q_1(rho; tau) >= 0 at every on-line zero.

**Lemma H2 (phase form; PROVED by the proof of c11 Lemma 1; not re-checked numerically for tau != 0).** At a simple zero rho on the line, q_h = cos Delta_h with Delta_h = sum over zeros rho' != rho of Im log(1 + h/(rho - rho')) (symmetric summation). On-line zeros contribute arctan(h/(gamma - gamma')) as in c11; an off-line pair contributes the two corresponding terms. Consequence used below: a zero whose upper neighbour is at distance g -> 0 has Delta_h -> Delta_rest - pi/2, so q_h -> sin(Delta_rest), which is negative when Delta_rest lies in (-pi, 0); the mean of Delta_rest is the gamma drift -h pi/4. The lower zero of a pair about to collide therefore fails (N2_h) in the typical case, and the upper one passes.

**Lemma H3 (lattice control; PROVED).** For LAT, X(s) = i sinh(L(s - 1/2)) (c11's E(z) = sin(L(z + i/2))), the flow d/dtau = (1/4) d^2/ds^2 multiplies X by e^{tau L^2/4}. Zeros do not move and q_h = 1 at every zero for every tau and every h (direct: X'(rho_n) X(rho_n + h) = -L sinh(Lh)). LAT passes (N2) at every tau, as in round 11.

### 2.2 Computation (MEASURED)

`cell1.py`: trapezoid rule, step 0.002, 751 nodes, 1150-bit Arb arithmetic (rounding enclosed; quadrature error not enclosed, checked by step halving: relative change below 4e-180 at height 499.3, and against Arb zeta at tau = 0). On-line zeros: sign changes of X_tau(1/2 + it) on a grid of step 0.02, 0 < t <= 500, plus a search for missed close pairs at local minima of |X_tau| (none found). All signs on the grid were determined by the balls. Reproduction of c11: at tau = 0 the code gives 269 zeros, first failure at zero 34, -Re{xi'(rho_34) xi(rho_34 + 1)} = -5.38910050718295e-69, q_1 = -0.0879 (`cell1_check.py`). Check of the convention: |X_{-0.5}| = 1.9e-56 at the map's zero 0.1981079 + 150.6922461i (variable s - 1/2), against 1.8e-50 at distance 0.01.

N = on-line zeros below 500; F_h = number with q_h < 0; T* = height of the first zero with q_1 < 0.

| tau | N | F_1 | F_1/N | T* (h = 1) | min q_1 | F_0.5 | F_2 |
|---|---|---|---|---|---|---|---|
| -2 | 105 | 11 | 0.105 | 84.33 | -0.570 | 1 | 53 |
| -1 | 159 | 20 | 0.126 | 76.53 | -0.990 | 1 | 77 |
| -0.5 | 223 | 25 | 0.112 | 173.81 | -0.710 | 1 | 106 |
| -0.2 | 259 | 22 | 0.085 | 111.25 | -0.657 | 2 | 122 |
| -0.1 | 267 | 20 | 0.075 | 111.13 | -0.564 | 0 | 127 |
| -0.05 | 269 | 16 | 0.059 | 111.08 | -0.452 | 0 | 129 |
| 0 | 269 | 12 | 0.045 | 111.03 | -0.359 | 0 | 130 |
| 0.05 | 269 | 11 | 0.041 | 110.98 | -0.280 | 0 | 128 |
| 0.1 | 269 | 9 | 0.033 | 110.93 | -0.212 | 0 | 127 |
| 0.2 | 269 | 3 | 0.011 | 282.26 | -0.097 | 0 | 126 |
| 0.5 | 270 | 0 | 0 | none | +0.137 | 0 | 126 |
| 1 | 270 | 0 | 0 | none | +0.334 | 0 | 124 |
| 2 | 270 | 0 | 0 | none | +0.496 | 0 | 116 |

Outcome against the pre-registration.
- "F_1 >= 1 for every tau < 0 on the grid": HOLDS. **Backward heat fails at (N2)**, at on-line zeros, for each of the six tau < 0.
- "T* non-decreasing in tau": FAILS. Seven adjacent inversions by the registered count. Five of them (tau from -0.2 to 0.1) are one and the same failing zero, the continuation of zero 34, whose height drifts from 111.25 to 110.93. Two are changes of the failing zero: T*(-2) = 84.33 > T*(-1) = 76.53, and T*(-0.5) = 173.81 > T*(-0.2) = 111.25. **The failure height does not move monotonically with tau.**
- "F_1 = 0 for tau large positive": HOLDS for tau >= 0.5 up to height 500.

Mechanism of the non-monotonicity (MEASURED, consistent with Lemma H2). Zeros 34 and 35 (111.03, 111.87) are a close pair. Going backward the pair closes: at tau = -0.2 the two zeros are at 111.250 and 111.847 with q_1 = -0.301 and +0.999 (the pattern of Lemma H2). At tau = -0.5 and -1 there is no on-line zero between 109.5 and 113 and X_tau(1/2 + it) has a local extremum of constant sign at 111.72 and 112.16: the pair has left the line. An (N2) failure at an on-line zero turns into an (N1) failure, and T* jumps to the next failing zero. So T* is not monotone because the set of on-line zeros shrinks (N falls from 269 to 105).

What is monotone in the data: q_1 at the tracked zero 34 is increasing in tau at all ten values where the zero is on the line (-0.301, -0.180, -0.131, -0.088, -0.049, -0.013, +0.049, +0.187, +0.334, +0.496 for tau = -0.2 ... 2; it changes sign between tau = 0.1 and 0.2). min q_1 is increasing in tau for tau >= -1, with one inversion at tau = -2. Neither statement is proved.

Reading. (N2) at h = 1 holds for the forward-heated family from some tau in (0.2, 0.5] on, up to height 500, and fails at tau = 0 and below. A condition that holds strictly on one side of zeta in the flow and fails at zeta is not a property of zeta that an argument can prove; this is the flow-blindness wall read in the other direction. Heat row of the c11 control table, completed: "hypothesis of Theorem 1 fails (zeros in Re s > 1); (N1) fails; (N2) fails at on-line zeros, 11 to 25 below height 500; same step as zeta".

## 3. Cell 2: the tied family V3b

### 3.1 Objects and three readings

Family: characters chi of one parity mod q. xi(s, chi) = G(s) L(s, chi), G(s) = (q/pi)^(s/2) Gamma((s + a)/2), common to the family. On Re s = 1, |xi(s, chi)|^2 = xi(s, chi) xi(2 - s, conj chi). Put

    w(s) = sum_chi 1 / ( xi(s, chi) xi(2 - s, conj chi) ),      v(s) = sum_chi xi(s, chi) xi(2 - s, conj chi),      w0(s) = sum_chi 1 / ( L(s, chi) L(2 - s, conj chi) ).

w and w0 have the same zeros in 1/2 < Re s < 3/2. For a pair {chi, conj chi}: w = 0 iff v = 0 iff R(s) := [L(s,chi)/L(s,conj chi)] [L(2-s,conj chi)/L(2-s,chi)] = -1 (c11 row V3b). The weight form asks for one function W, analytic without zeros in Im z > 0, with |W(x)|^-2 = m(x) on the real axis (s = 1 - iz), and the condition Re <F, TF> >= 0 on F(W). Three readings of "tied":

- (a) m = w: the sum of the H(E_chi) norms (c11's literal row);
- (b) m = 1/w: the sum of the reproducing kernels W_chi(z) conj W_chi(w);
- (c) m = v: the sum of the F(W_chi) norms.

### 3.2 Two necessary conditions

Theorem 2 (OPENED): if Re <F, TF> >= 0 on F(W), then W extends analytically to Im z > -1/2 and P(z) := W(z)/W(z + i) is analytic with non-negative real part there.

**Lemma S (strip; PROVED given Theorem 2).** Under the hypothesis W has no zeros in Im z > -1/2 (a zero would be an interior zero of P, which forces P identically 0). With W*(z) = conj W(conj z), the identity W W* = 1/m continues from the real axis, so 1/m is analytic and zero-free in |Im z| < 1/2: **m has no zeros and no poles in 1/2 < Re s < 3/2.** In readings (a), (b) this forbids zeros of w0 there; in reading (c) zeros of v.

**Lemma T (boundary; PROVED given Theorem 2).** For x real and z = x - i/2 one has z + i = x + i/2 and conj z = x + i/2, so W(z + i) = W(x + i/2) and W*(z) = conj W(x + i/2), both values at an interior point. Letting Im z -> -1/2 in P(z) = 1/( m(z) W*(z) W(z + i) ),

    P(x - i/2) = 1 / ( m(x - i/2) |W(x + i/2)|^2 )    wherever m(x - i/2) is finite and non-zero.

The outer function drops out. Hence the hypothesis implies **Re m(s) >= 0 on Re s = 1/2**, that is

    readings (a), (b):  S_w(t) := Re sum_chi 1/( xi(1/2+it,chi) conj xi(3/2+it,chi) ) >= 0,      reading (c):  S_v(t) := Re sum_chi xi(1/2+it,chi) conj xi(3/2+it,chi) >= 0,   all real t.

Check on the explicit case W = 1/xi(1 - iz): the formula gives P = xi(3/2 - ix)/xi(1/2 - ix), which is the definition. For one character Lemma T reads Re{xi(1/2+it) conj xi(3/2+it)} >= 0; the first factor is real up to a constant phase and changes sign at each zero, so the condition forces the phase balance of c11 Lemma 2 at every zero.

Corollary (readings (a), (b); PROVED). Near a zero rho of L(s, chi_0), chi_0 in the family, the term of chi_0 in w has a simple pole and the others are bounded, so S_w changes sign at rho unless xi'(rho, chi_0) conj xi(rho + 1, chi_0) is real: the single-character phase condition, unchanged. Tying by (a) or (b) removes nothing.

### 3.3 Statistic 1 (pre-registered): zeros of w0 in 1/2 < Re s < 1 (MEASURED; each zero confirmed)

`cell2.py`: float screen by winding numbers on cells 0.0125 x 0.025 over 0.505 <= Re s <= 1; Newton refinement in Arb (residual below 1e-55 at 200 bits); winding number of w0 on a square of half-side 1e-8 around each refined point, in ball arithmetic with every boundary piece enclosed in a half-plane (value 1.0000000 +/- 3e-13 for every zero listed). The count is a lower bound: the band 0.5 < Re s < 0.505 is not scanned.

| Family | height | zeros located and confirmed | first zero | largest Re s |
|---|---|---|---|---|
| q = 5, {chi, conj chi}, chi(2) = i | 500 | 33 | 0.5102208213939666302655 + 77.2289925269322087901733i | 0.5915 |
| q = 7, even pair (order 3) | 200 | 10 | 0.5054676842298626 + 62.0637973223254559i | 0.6040 |
| q = 7, three odd characters | 200 | 36 | 0.5085957730951408 + 17.4811128503728930i | 0.5794 |
| q = 13, six odd characters | 50 | 16 | 0.5066815768421099 + 5.7567776952144580i | 0.5551 |
| q = 13, five non-principal even characters | 50 | 12 | 0.5083033922110508 + 10.4820929394352770i | 0.5293 |

At the first zero for q = 5, R + 1 = -2.3e-29 + 3.1e-30 i at the 32 stored digits, at both 128 and 400 bits (`cell2_follow.py`). The zeros lie close to Re s = 1/2 (all below 0.61), next to zeros of the L-functions (poles of w0). Three screen cells showed winding -1; the one for q = 5 was re-examined in ball arithmetic: the winding number of the cell is 0, and a square crossing Re s = 1/2 containing one zero of w0 and one pole also gives 0, so the -1 is a float artefact of a pole just outside the grid.

Outcome: Z >= 1, **V3b closed by computation** by Lemma S for the pairs (all three readings, since w0 = 0 iff v = 0 for a pair) and for the larger families in readings (a), (b). Zeros of v for families of three or more characters were not searched; reading (c) is closed for them by statistic 2.

### 3.4 Statistic 2 (addendum 1): sign of S_w and S_v on Re s = 1/2 (MEASURED; signs certified by Arb balls)

`cell2b.py`, grid 0.01, 0 < t <= 500, 128 bits; no grid point had an undetermined sign. C = number of sign changes on the grid.

| Family | C_v | first t with S_v < 0 | fraction of grid with S_v < 0 | C_w | first t with S_w < 0 |
|---|---|---|---|---|---|
| zeta alone (c11 Lemma 2 in boundary form) | 539 | 13.54 | 0.230 | 539 | 13.54 |
| q = 5, one character | 788 | 5.41 | 0.252 | 788 | 5.41 |
| q = 5, pair | 520 | 8.55 | 0.184 | 1520 | 3.79 |
| q = 7, even pair | 558 | 7.85 | 0.193 | 1617 | 3.92 |
| q = 7, odd complex pair | 515 | 9.62 | 0.186 | 1550 | 2.27 |
| q = 7, three odd | 450 | 16.75 | 0.152 | 2268 | 2.31 |
| q = 13, pair {2, 7} | 539 | 5.11 | 0.185 | 1710 | 2.01 |
| q = 13, five even | 406 | 16.01 | 0.115 | 3912 | 2.08 |
| q = 13, six odd | 310 | 17.43 | 0.085 | 4500 | 0.87 |
| control T-NR (p = 2, c = 2.5), q = 5 pair | 602 | 3.24 | 0.300 | 1610 | 2.86 |
| control E_a (a = 1/4), q = 5 pair | 782 | 3.91 | 0.495 | 854 | 2.67 |

Outcome: C >= 1 with certified negative values in every family and every reading. **V3b is closed at the boundary step** by Lemma T: reading (c) for the pair mod 5 first at t = 8.55; readings (a), (b) at the first zero of the family's L-functions (C_w is about the total number of zeros of the family, as the Corollary predicts).

### 3.5 Controls and the conductor-aspect observation

T-NR tied family, X(s, chi) = xi(s, chi) m(s), m(s) = 2 cosh((s - 1/2) log p) + c with the same m for all chi: v_NR(s) = m(s) m(2 - s) v(s) (PROVED, m has real coefficients). First failing step: Lemma S, at the zeros of m on Re s = 1/2 + arccosh(|c|/2)/log p when that is below 3/2 (p = 2, c = 2.5: Re s = 1.5, the edge; for |c| < 2.5 inside). At zeta's step (Lemma T) it also fails, earlier in height: m(1/2 + it) > 0 and arg m(3/2 + it) = arctan(0.6 tan(t log 2 / 2)) exceeds pi/4 for t log 2 in (2.06, pi), i.e. t in (2.97, 4.53) (PROVED for the factor), which is where the measured first negative values lie.
E_a tied family, X(s, chi) = xi(s + a, chi) xi(s - a, chi): fails Lemma T with negative fraction 0.495; ARGUED reason: two gamma factors give a boundary phase about -pi/2 at shift 1, so the diagonal has no margin.
Heat on the tied family: NOT RUN.

Conductor aspect (addendum 2; MEASURED; ARGUED mechanism). For the full odd family mod a prime q, orthogonality gives sum_chi L(s1,chi) conj L(s2,chi) = q^(-s1 - conj s2) (phi(q)/2) sum_a zeta(s1, a/q) conj[zeta(s2, a/q) - zeta(s2, 1 - a/q)] (PROVED, finite identity; used in `cell2d.py` and cross-checked against the character-by-character code `cell2c.py` at q = 13, 29: same first negative heights). The diagonal n = m contributes (phi(q)/2) zeta(2)(1 - q^-2) > 0 and the gamma phase lies between 0 and -pi/4, so S_v > 0 while the off-diagonal part is smaller than cos(pi/4) of the diagonal.

| q (full odd family) | T_0(q) = first grid height with S_v < 0 | T_0/q^2 | fraction negative on the scanned range | T-NR first negative |
|---|---|---|---|---|
| 13 | 17.44 | 0.103 | 0.060 (to 200) | 3.42 |
| 29 | 63.46 | 0.075 | 0.0076 (to 200) | 3.34 |
| 53 | 279.32 | 0.099 | 0.0013 (to 400) | 3.34 |
| 101 | 652.25 | 0.064 | 0.0003 (to 1200, grid 0.05) | 3.34 |
| 199 | not completed (run to 2500 stopped at the 20-minute cap) | | | 3.34 |

Registered predictions: T_0 grows with q: HOLDS (faster than linear; about 0.06 to 0.10 times q^2 on four points). T-NR first negative in (2.97, 4.53) for every q: HOLDS. E_a negative fraction near 1/2: HOLDS at q = 5 and q = 13 (0.495, 0.486).
Displayed inequality (holds on the grid, not proved): for the full odd family mod q in {13, 29, 53, 101},

    Re sum_{chi odd mod q} xi(1/2 + it, chi) conj xi(3/2 + it, chi) > 0   for 0 < t < T_0(q).

It separates zeta's family from T-NR (which fails at t about 3.3 for every q, at a named step: the phase of the local factor at p exceeds the margin pi/4) and from E_a (no margin). It is not a route: it is a family average obtained from orthogonality of characters (periodicity; multiplicativity is not used), it is one necessary condition of the device and not the device, and for each fixed q it is false from T_0(q) on. It is the MV-CAP wall in the conductor aspect.

## 4. Requirement flags

- R1 (multiplicativity essential): **false.** Lemmas S, T, H1 to H3 use the functional equation and Theorem 2 only. The conductor-aspect positivity uses orthogonality of characters (periodicity), not the Euler product. T-NR is separated by the phase of one local factor, not by multiplicativity.
- R2 (height-uniform, every window): **false.** Every tested family fails the boundary condition at a finite height (first at t between 0.87 and 17.4 for q <= 13; T_0(q) for the full odd family); the heat table is a statement below height 500.
- R3 (controls fail structurally): **false.** LAT passes (N2) at every tau (Lemma H3); the forward heat family passes (N2) for tau >= 0.5 below 500; zeta's families fail Lemma T at the same step as T-NR and E_a. The conductor-aspect inequality that separates T-NR is not height-uniform, E_a's failure there is argued not proved, heat was not run on it, and no second referee exists.
- R4 (reaches the critical line): **false.** Lemma T is a condition on Re s = 1/2 and it is false; nothing passes from Re s = 1 to the line.

## 5. Verdict

Both cells are closed; the c11 row stands with two cells filled in. Proposed additions to the device row (not applied; this lane does not edit the map):

> Backward heat at (N2): fails at on-line zeros for tau = -2 ... -0.05 (11 to 25 failures below height 500); also fails the hypothesis of Theorem 1 and (N1). First-failure height not monotone in tau (failing zeros of close pairs leave the line). Forward heat tau >= 0.5 passes (N2) below 500. LAT invariant under the flow. Tied conductor family V3b: closed by computation in three readings (sum of H(E) norms, sum of kernels, sum of F(W) norms) for q = 5, 7, 13: zeros of w in the strip (33 for the pair mod 5 below 500, first 0.51022 + 77.22899i, winding number 1 in Arb) and boundary condition Re m >= 0 on Re s = 1/2 (Lemma T) violated with certified negative values. Conductor-aspect positivity of S_v up to T_0(q) (17.4, 63.5, 279.3, 652.3 at q = 13, 29, 53, 101) is a mean-value statement over the family. Status: PROVED (Lemmas S, T, H1, H3, the T-NR factor), MEASURED (tables), ARGUED (E_a margin, off-diagonal size).

No pivot taken. The adjacent idea (prove the conductor-aspect inequality for t < c q^2 and use it as a positivity input) is a twisted mean value over characters; MV-CAP applies and R2 fails by the measured T_0(q).

Files: `PREREG.md`; cell 1: `cell1.py`, `cell1_check.py`, `cell1_tau*.json`; cell 2: `cell2.py` + `cell2_q*.json` (interior zeros), `cell2_follow.py`, `cell2b.py` + `cell2b_*.json` (boundary signs), `cell2c.py`, `cell2d.py` + json (conductor aspect); `referee_checks.py`; `REFEREE.md`; `lanes.jsonl`.

## 6. Three weakest steps

1. Lemmas S and T assume a function W analytic and zero-free in the upper half-plane, continuous to the real axis, with |W|^-2 equal to the tied weight there, and they take Theorem 2 for that W. The identification of "one F tested in all spaces" with the space F(W) of the tied weight is a choice (three readings were treated; a tie with one shift operator per character and a common F is not of this form and was not analysed). The limit in Lemma T uses continuity of W at the interior points x + i/2 and of m at x - i/2; it was checked against the explicit case W = 1/xi only.
2. The heat computation is ball arithmetic for rounding but the trapezoid error is not enclosed (controlled by step halving and by comparison with Arb zeta at tau = 0). On-line zeros come from sign changes on a grid of step 0.02 with a search for missed pairs at local minima; a pair closer than the grid inside a monotone stretch would be missed. "Passes for tau >= 0.5" is a statement below height 500 at h = 1; c11's screen shows failures at tau = 0 becoming more frequent with height, so the threshold in tau may rise with height. Lemma H2 was not checked numerically for tau != 0, and the monotonicity of q_1 at a tracked zero rests on one zero.
3. The interior zero counts are lower bounds from a float screen (band 0.5 < Re s < 0.505 not scanned; three cells with spurious winding -1, one re-examined). The winding numbers certify "zeros minus poles = 1" in each small square; a pole of w0 there would be a zero of an L-function off the line, which would close the row equally. The conductor-aspect table has four values of q, grid 0.02 to 0.05, and no proof of the off-diagonal bound; the q^2 scaling of T_0 is a description of four points. The E_a margin statement is argued from the gamma phase and two measured fractions.
