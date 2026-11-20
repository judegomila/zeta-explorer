# Note on H_K(theta) (weakest step 1 of c5-thin-walk-replay): a stated theorem is located

2026-11-18. Written by lane `c6-repair-referee-debts-r5`. Scope: only the input H_K(theta) of Theorem 2 (a
Hoheisel-type exponent for prime ideals in ray classes of an imaginary quadratic field, the same for all moduli).

## Outcome

**Located, second-hand.** The statement is M. D. Coleman, "The distribution of points at which binary quadratic
forms are prime", Proc. London Math. Soc. (3) 61 (1990) 433-456. The primary text was not opened (not freely
available). Two later papers that quote it were opened and read as text:

1. T. Khale, C. O'Kuhn, A. Panidapu, A. Sun, S. Zhang, "A Bombieri-Vinogradov theorem for primes in short intervals
   and small sectors", arXiv:2008.09677v2, p. 1 (PDF text extracted locally). Quoted setting: K = Q(sqrt(-m))
   imaginary quadratic, "Fix a nonzero ideal f", I_f "the ideal class group mod f", I a class in it, lambda the
   generator of the infinite-order Hecke characters mod f. Quoted result: "Coleman [3] proved that for small
   eps > 0" one has
   sum over prime ideals p in I with Np = p prime, x <= p < x + h, phi_1 <= arg lambda(p) <= phi_2, of log p
   ~ (phi_2 - phi_1) h / (2 pi abs(I_f)), for 0 <= phi_1 <= phi_2 <= 2 pi, phi_2 - phi_1 > x^(-5/24 + eps) and
   x^(19/24 + eps) <= h <= x.
2. G. Harman, A. Kumchev, P. A. Lewis, "The distribution of prime ideals of imaginary quadratic fields", Trans.
   AMS 356 (2004), pp. 1-2 of the author's copy: cites the same paper as "[4, Theorem 2.1]" with "the exponents
   19/24 + eps and -5/24 + eps", and "[4, Theorem 1.1]" with exponent 7/12 + eps for the form problem; their own
   Theorem 2 gives a lower bound of the right order for y >= x^0.765, phi >= x^(-0.235) in an ideal class
   (class group, not ray classes). The same page confirms the statements of Huxley (7/12 + eps) and
   Baker-Harman-Pintz (intervals (x - x^0.525, x]) as existence results for rational primes.

## Consequence for H_K(theta)

With the full sector (phi_2 - phi_1 = 2 pi) the quoted theorem gives, for every modulus f and every ray class C mod
f, sum over degree-one primes p in C with x <= Np < x + h of log p ~ h/abs(I_f) for x^(19/24 + eps) <= h <= x. A
lower bound over degree-one primes is a lower bound over all primes of the class, so

  H_K(theta) holds with theta = 19/24 + eps, c_q = 1/(2 h_q), relative to Coleman 1990 Theorem 2.1 as quoted.

The exponent does not depend on the modulus; the threshold x_q and the rate of the asymptotic do (no uniformity in
q is claimed in the quotation, and Theorem 2 of the lane needs none: Lemma 1* uses x_{m_k} and c_{m_k} per stage).
Two points to keep in view:
- the reading "asymptotic uniformly for h in the stated range" is the usual meaning of such a statement and is what
  Lemma 1* uses (it applies the bound on dyadic pieces [2^j y, 2^(j+1) y]); it was not checked against the primary
  text;
- eta = 1 - theta = 5/24 - eps, so Theorem 2 of the lane reads: G_psi analytic and zero-free on
  Re s > max(b - 5/24 + eps, b/3) for non-principal psi; G = (s - b) W for principal psi.

Status of Theorem 2 of the lane after this note: **PROVED-rel Coleman 1990 Theorem 2.1 (statement read through two
secondary quotations; primary text and proof not opened)**, in place of "PROVED-rel H_K(theta), no stated theorem
located". For the rational THIN control (set S of rational primes) the input is the counting form for rational
primes in short intervals: Huxley's asymptotic (eta = 5/12 - eps) is classical; the existence statements of Huxley
and Baker-Harman-Pintz are confirmed second-hand in source 2; the counting constant of Baker-Harman-Pintz (eta =
0.475) remains recalled.

Nothing here concerns zeros of zeta. The map control row THIN and the engine node `ctl-THIN` were updated by this
lane accordingly.
