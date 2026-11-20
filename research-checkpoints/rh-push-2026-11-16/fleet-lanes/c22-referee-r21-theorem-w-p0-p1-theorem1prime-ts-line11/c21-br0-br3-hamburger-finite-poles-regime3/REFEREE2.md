# REFEREE2: Theorem H, Theorem H', Lemma 1, Corollary H1 and control NWM of `c21-br0-br3-hamburger-finite-poles-regime3/RESULT.md`

Second reading, 2026-11-20, lane `c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11`. Written from the
RESULT.md text alone; the lane's REFEREE.md and scripts were not opened. The assignment names "Theorem H and
Theorem 1'"; the file has no Theorem 1': the items read are Lemma 1, Theorem H, Theorem H' and BR-3'. No
statement about zeros of zeta.

## Verdict

- **Lemma 1: holds.**
- **Theorem H: holds.** Every step was rederived.
- **Corollary H1 (a): holds with one correction** (the word "symmetric").
- **Theorem H': holds as stated. The sentence after it ("So a twin with finitely many poles satisfies ... over
  the strip 0 <= sigma <= 1 ...") holds with a correction** (it follows as written only for the strips
  -delta <= sigma <= 1 + delta).
- **NWM is a valid control: holds.** Not identically zero (proved below); off-line zero in the open strip now
  enclosed in ball arithmetic.

## Theorem H, step by step

Lemma 1. chi(s) = pi^(s-1/2) Gamma((1-s)/2)/Gamma(s/2); for Re s < 1/2 the numerator is analytic and
1/Gamma(s/2) entire, so a pole of G there is the reflection of a pole in Re s > 1/2; G analytic in Re s < 0;
G(-2j) = 0. Holds.

Step 1. P G entire of finite order; polynomial bound on Re s = 2 (absolute convergence) and on Re s = -1
(chi(-1 + it) of size abs(t)^(3/2)); Phragmen-Lindelof. Holds.

Step 2. e^(-pi n^2 x) = (1/4 pi i) int over Re s = c of Gamma(s/2) pi^(-s/2) n^-s x^(-s/2) ds; summing gives
phi(x) = (1/4 pi i) int Lam(s) x^(-s/2) ds. Shift to Re s = -1: residues (1/2) sum Res; on Re s = -1 the
substitution s -> 1 - s and the functional equation give x^(-1/2) phi(1/x). Checked on zeta: residues
x^(-1/2) at s = 1 and -1 at s = 0, Q = (x^(-1/2) - 1)/2, the theta relation. Holds.

Step 3. Laplace transform in x against e^(-pi t^2 x): A(t) = sum a_n/(pi (t^2 + n^2)); the middle term by
int x^(-1/2) e^(-a/x - bx) dx = (pi/b)^(1/2) e^(-2 sqrt(ab)) with a = pi n^2, b = pi t^2: (1/t) e^(-2 pi n t).
H(t) is a finite sum of Gamma(1 - s_v/2)(pi t^2)^(s_v/2 - 1) terms with logarithms (convergent since
Re s_v <= 1 < 2). Checked on zeta: A - H = (coth(pi t) - 1)/(2t) = B. Holds.

Step 4. U = t (A - H): residue of t a_n/(pi (t^2 + n^2)) at t = i n is a_n/(2 pi). U = sum a_n e^(-2 pi n t)
on Re t > 0, so U(t + i) = U(t) there. Both sides are meromorphic on C minus the two cuts (-inf, 0] and
(-inf - i, -i], which is connected and contains a neighbourhood of every t = i n, n >= 1. The residue of
U(t + i) at t = i n is a_(n+1)/(2 pi). So a_n = a_(n+1). Holds. The clause "finitely many poles" is read
exactly here (H analytic off the cut).

Section 3 (HQ1 to HQ4 have infinitely many poles). HQ3, HQ4: lattice count T log q/(2 pi) against
N(1/2 + b, T) = o(T): holds. HQ1, HQ2: the lane cites Putnam (no infinite arithmetic progression of zeros
k d, k >= 1). The step needs "infinitely many lattice points are not zeros of order >= 2 (resp. 4)". It
follows: if all but finitely many k d were zeros, the progression k (K d), k >= 1, would consist of zeros for
K large, against Putnam with d' = K d. Holds (one line to add).

## Correction 1 (Corollary H1 (a))

Line: "then G has infinitely many poles, all in 0 <= Re s <= 1, symmetric under s -> 1 - s". The poles of
Lam = gam G are symmetric. The poles of G are symmetric except at s = 1 and s = 0: a simple pole of G at
s = 1 does not reflect (zeta has a pole at 1 and none at 0, because 1/Gamma((1-s)/2) vanishes at s = 1).
The conclusion "infinitely many in 1/2 <= Re s <= 1" is not affected: it uses only the direction of Lemma 1
(poles in Re s < 1/2 are reflections of poles in Re s > 1/2).

## Correction 2 (the sentence after Theorem H')

Theorem H' as stated (bound on -delta <= Re s <= 1 + delta with k < pi/(1 + 2 delta)) holds: the bounds on the
two edges are as written and Phragmen-Lindelof on a strip of width w admits exp(C e^(k abs t)) for k < pi/w.

Line: "So a twin with finitely many poles satisfies: for every k < pi, log log max over the strip
0 <= sigma <= 1, abs(t) <= T of abs(G) exceeds k T for arbitrarily large T." (also verdict item 5 (a): "growth
exponent at least pi in the critical strip"). What H' gives is this statement with the strip
-delta <= sigma <= 1 + delta and k < pi/(1 + 2 delta), for every delta > 0. To pass to the closed strip
0 <= sigma <= 1 one needs a bound for G on 1 < sigma <= 1 + delta from its bound on sigma = 1, and
abs(G(sigma + it)) <= M(sigma) = sum abs(a_n) n^-sigma is not uniform as sigma -> 1+. For a twin in the sense
of BR-3 (Euler product with abs(alpha_p) <= 1, so M(sigma) <= zeta(sigma) = O(1/(sigma - 1))) the passage
holds: log abs(P G) is subharmonic on the rectangle 1 <= sigma <= 2, abs(t - t_0) <= 1, and log(1/(sigma - 1))
is integrable against harmonic measure on the horizontal sides, so the bound on sigma = 1 propagates with an
additive constant; the left edge is handled by the functional equation. ARGUED here, not written out. For
general coefficients (M(sigma) of arbitrary growth as sigma -> 1+) the [0, 1] form is not established; the
strip form of H' is.

## NWM

Rederived: for Im z > pi/2 the path t = i r gives abs(e^(zt) t^-t) = e^(-r (Im z - pi/2)); same below with
t = -i r. R(s) = g(z) + g(-z), z = -i kappa (s - 1/2), is entire, R(s) = R(1 - s), real on the real axis
(g(conj z) = conj g(z)), abs R <= 2/(kappa abs(sigma - 1/2) - pi/2) outside the strip, and the two turned
paths add to 2 int_0^inf sin(r log r) e^(pi r/2) e^(-kappa (s - 1/2) r) dr (the factor -i e^(i r log r) +
i e^(-i r log r) = 2 sin(r log r)). Holds.

Not identically zero: abs R(s) <= 2/(kappa (sigma - 1/2) - pi/2) -> 0 as sigma -> +inf, so 1 + R -> 1;
zeta(s)(1 + R(s)) is not identically zero and has the pole at 1 when 1 + R(1) != 0.

Arb recheck (new code `code/ref2_misc.py`; unit `rh-c22refm-1120145537`; `out/misc.json`; kappa = 4; g by
`acb.integral` on [2^-300, 200] with the head and tail bounded by hand: head at most 4 * 2^-300, tail at most
e^(-cT)(T^2/c + 2T/c^2 + 2/c^3), c = log T - Re z > 1):

| Quantity | Value |
|---|---|
| 1 + R(3), 1 + R(6) | 0.9524864871773726..., 0.9876489565873766... (radius below 2e-45); bound 2/(kappa 2.5 - pi/2) = 0.237 at s = 3 holds |
| R(2 + 0.7i), entire form | -0.07463040216492850014840... + 0.06238347786348242518802...i (radius 5e-42) |
| R(2 + 0.7i), Laplace form | same digits (radius 7e-47); the lane's value -0.07463040216492850 + 0.06238347786348243i agrees |
| abs R(1/2 + it), t = 0.25, 0.5, 0.75, 1 | 7.3837, 61.899, 10958.7, 5.9244e9 (lane: 7.38, 61.9, 1.10e4, 5.92e9) |
| zero of 1 + R near s_0 = 0.9476686720276245 - 0.7846755606466836i | abs(1 + R(s_0)) <= 2.3e-15; R'(s_0) = 37.863115679... - 3.154565480...i (lane: 37.8 - 3.2i); abs(f'') <= 1.01e8 on the disc; Rouche with the linear part on abs(s - s_0) = 1e-9: 5.05e-11 < 3.80e-8. **One zero of 1 + R is enclosed in the disc of radius 1e-9 about s_0** |
| zeta on that disc | 0.4917622 + 1.2110631i (radius 6e-8), non-zero (lane: 0.49 + 1.21i) |

So G_NWM = zeta (1 + R) (kappa = 4) has a zero with real part in [0.94766867, 0.94766868], inside the open
critical strip and off the line. The lane's label "Not ball-certified" can be replaced by "enclosed (Rouche,
Arb) by the second referee" for this zero; the other two listed zeros were not rechecked. NWM is a valid
control in the sense used: zeta's functional equation exactly, single pole at 1, real frequencies >= 0,
not multiplicative, not identically zero, off-line zero.

The saddle law on the line and the word "sharp" (class of general frequencies only) are as the lane labels
them; the four measured values above match e^(kappa t - 1) + (kappa t - 1)/2 + log(2 pi)/2 at t = 1 (22.50).

## Dependence

Lanes that use Theorem H or H': `c22-br3prime-integer-frequencies-no-growth-two-sided-almost-periodic`
(starts from H' and BR-3'), TWIN_SCREEN.md section 2 (Lemma TS-1 (iv), "BR-0 asks ..."), the BR-2 lanes
through Corollary H1 (b). None of them uses the two corrected sentences in the uncorrected form, except that
any statement "growth exponent >= pi in the closed critical strip" for general coefficients should be quoted
in the strip form.

## Comparison with the first referee file (made after the verdict above was fixed)

The lane's `REFEREE.md` also records that the sentence on the closed strip 0 <= sigma <= 1 does not follow
from H' as written. The two readings agree on Correction 2; found independently here.
