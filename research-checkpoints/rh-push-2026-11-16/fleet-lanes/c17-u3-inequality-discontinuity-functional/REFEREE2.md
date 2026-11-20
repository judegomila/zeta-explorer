# REFEREE2 (second, independent): c17-u3-inequality-discontinuity-functional

Date 2026-11-20. Written by lane `c18-referee-r17-independent-sources`. Scope set by the assignment: Proposition W, Lemma LR, the Lipschitz constant 0.0485883 (Lemma S6). Derived before the first referee file was opened; compared afterwards. Numerics: `push/c18-referee-r17-independent-sources/ref2_checks.py` (mpmath 40 digits, local). No statement about zeros of zeta is made by the lane or here.

## Verdict: HOLDS WITH CORRECTIONS (wording only). No PROVED label in scope breaks.

## Proposition W: holds

m(s) = (q^(s-1/2) + c + q^(1/2-s))/(2 + c), q = 1 + delta, c = q^b + q^-b.
(a) m(1 - s) = m(s), m entire of order 1, m(1) > 0: zeta m has zeta's functional equation exactly and the pole at 1 only.
(b) zeta(s) q^(s-1/2) = q^(-1/2) sum_n (n/q)^-s and zeta(s) q^(1/2-s) = q^(1/2) sum_n (nq)^-s, so N = (2 + c)^-1 sum_n [q^(-1/2) delta_(n/q) + c delta_n + q^(1/2) delta_(nq)] >= 0, atoms within log q <= delta of log n.
(c) w + 1/w = -c with w = q^(s-1/2) has the roots -q^b, -q^-b: zeros at 1/2 +- b + i(2k+1) pi/log q.
(d) m - 1 = 2(cosh((s - 1/2) log q) - 1)/(2 + c), abs(cosh z - 1) <= cosh abs(z) - 1, 2 + c >= 4.
Numeric: abs(m) < 1e-41 at 1/2 + b + i pi/log q for delta = 0.1, 0.01, 0.001 and b = 0.05, 0.45; heights 32.9618, 315.727, 3143.16.

Corrections.
W1. "Generalised Euler product": the factor at q is the polynomial (1 + q^b q^(1/2-s))(1 + q^-b q^(1/2-s)) times the monomial q^(s-1/2)/(2 + c). It is a local polynomial factor with a unit shift, not an inverse local factor. The reading "zeta times one local factor" is correct; "Euler product over the primes and q" should say this.
W2. "The same total weight in every cluster": the clusters {n/q, n, nq} overlap as point sets once n >= 1/delta (nq >= n + 1). The statement holds for the labelled decomposition, not as a property that can be read from the measure N alone.
W3. The restriction b < 1/2 is not needed for (a) to (d); any b > 0 gives the same statements. The member has mass q^(-1/2)/(2 + c) at 1/q < 1, which the lane states.

## Lemma LR: holds

With w = conj(z) q^(s-1/2) (abs z = 1): m_z = w + c + 1/w = (w - y_+)(w - y_-)/w, y_+- real (abs c > 2), y_+ y_- = 1, abs(y_+) = e^(arccosh(abs c/2)) =: q^b. Zeros: abs(q^(s-1/2)) = q^(+-b), Re s = 1/2 +- b for every z. Factorisation m_z = conj(z) q^(s-1/2)(1 - alpha q^-s)(1 - alpha' q^-s), alpha = z y_+ q^(1/2), abs(alpha) = q^(1/2+b). (a), (b), (c) follow; in (c), (1 + delta)^b <= 1 + delta for b <= 1.
Numeric: q = 1 + sqrt 2, c = 2.1, arg z = 0, 1, 2.5: zeros at Re s = 0.8573113164, ordinates 3.564428, 4.699021, 6.400910, abs(m_z) < 1e-40.
Remark: m_z(1 - s) = m_(conj z)(s); for non-real z the factor is not symmetric under s -> 1 - s. The lemma does not use symmetry.

## Lipschitz constant: holds

kappa_0 = int_1^inf (sin(pi x)/(pi x))^2 dx = 1/2 - int_0^1 = 1/2 - Si(2 pi)/pi (integration by parts: int_0^pi sin^2 y/y^2 dy = Si(2 pi)). Value 0.0485883332 (closed form), 0.048588333210 (quadrature of the smooth integral on [0, 1]). The printed 0.0485883 is correct to the digits shown.

Lemma S6, given the trace identity (T) for a signed N: phi_k -> indicator of [-1/2, 1/2] makes the right side of (T) tend to 0 and the left side tend to int sinc^2 dN (abs(phihat_k) <= C/abs(x) and int x^-2 d abs(N) < infinity); sinc vanishes at the positive integers; so int sinc^2 dN_off = 0, and F >= -eps' on [1, infinity) gives tau(N) <= kappa_0 eps'. Own check of (T): for a self-dual mu = (r/2) delta_0 + (N + N reflected)/2 and f = phi * phi(-.) supported in (-1, 1), <mu, abs(phihat)^2> = <mu, f> = (r/2) norm(phi)^2 when N is supported in [1, infinity), which is (T).
Status: Lemma S6 is PROVED relative to the self-duality of mu for signed N (Proposition T of c16, steps 2 to 5 with Tonelli replaced by absolute convergence). That step was not re-derived here. The first referee derives the needed convergence from N >= -eps' dx by Landau's theorem.

## Comparison with the first referee

Same verdict. W1 and W2 are additional to its list. Not checked by this referee (out of the assigned scope): section 3 (Lemma R, Phi_1, Phi_2), the server LP of section 6, the residue formula of ZQ.

## Flags

R1 false, R2 false, R3 false, R4 false. Referee count for the lane: 2, both hold.
