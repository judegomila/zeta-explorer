# The two signed theta sources have no positive constant basis vector

Research continuation, 11 November 2026. This is a precise obstruction to
one proposed way of repeating the compensation argument. The two signed
source densities in PR #53 cannot be replaced by a globally positive
source through any nonzero **constant linear combination** of those two
densities. Three rigorously enclosed spatial points suffice to prove it.

This is not a counterexample to the desired signs of the second-reduced
theta sources. A positive integral operator can still compensate signed
inputs, as PR #53 already proves. Variable coefficients, additional source
columns, and direct joint-anchor comparison are outside this obstruction.

## 1. Sources and their common factor

For the original theta pair \((C,\kappa)\), use

\[
B=4C''/\kappa,\quad J=4\kappa''/\kappa,
\quad P=16C^{(4)}/\kappa,\quad Q=16\kappa^{(4)}/\kappa,
\quad H=C/\kappa.
\]

The original higher source determinants are

\[
S_H=W_4(B',J',P',H'),\qquad S_Q=W_4(B',J',P',Q').
\]

PR #53 gives the exact formulas

\[
S_H=\frac{16}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',C),
\]

\[
S_Q=\frac{256}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)}).
\tag{1}
\]

For the positive prefix \((f_1,f_2,f_3)=(B',J',P')\), write
\(x=f_2/f_1\), \(Y=f_3/f_1\), and \(w=Y''>0\). The generalized
source derivatives of PR #53 satisfy

\[
S_H=f_1^4(x')^6w^2\rho_H,\qquad
S_Q=f_1^4(x')^6w^2\rho_Q.                    \tag{2}
\]

The common multiplier is strictly positive. Thus constant linear
combinations of the two \(S\) functions and of the two \(\rho\)
functions have identical signs.

## 2. Three rigorous witnesses

The companion certificate evaluates (1) at the exact rational points
\(t_0=1/16\), \(t_1=1/8\), and \(t_2=1\), using 256-bit ball
arithmetic, sixteen theta modes, and explicit omitted-mode and integral
tails. The displayed decimals are only readable summaries of the
enclosures stored in the replay.

| Point | \(S_H\) | \(S_Q\) | \(S_H/S_Q\) |
| --- | ---: | ---: | ---: |
| \(1/16\) | \(-6.68414257029\cdot10^{-7}\) | \(-4.20629333096\) | \(1.58908141786\cdot10^{-7}\) |
| \(1/8\) | \(6.79978471838\cdot10^{-5}\) | \(-2114.56551410\) | \(-3.21568883680\cdot10^{-8}\) |
| \(1\) | \(1.19925887181\cdot10^7\) | \(9.16446868141\cdot10^{13}\) | \(1.30859618108\cdot10^{-7}\) |

In particular, the first and last ratios obey the certified strict gap

\[
\frac{S_H(t_0)}{S_Q(t_0)}-
\frac{S_H(t_2)}{S_Q(t_2)}>2.80\cdot10^{-8}>0.       \tag{3}
\]

## 3. The exact separating argument

Let \(r_i=(S_H(t_i),S_Q(t_i))\) and define

\[
\omega_0=\det(r_1,r_2),\qquad
\omega_1=-\det(r_0,r_2),\qquad
\omega_2=\det(r_0,r_1).
\]

The signs in the table and (3) imply \(\omega_i>0\). The elementary
two-dimensional determinant identity gives

\[
\boxed{\omega_0r_0+\omega_1r_1+\omega_2r_2=0.}      \tag{4}
\]

Suppose \(\alpha S_H(t_i)+\beta S_Q(t_i)\ge0\) at all three points.
Dotting (4) with \((\alpha,\beta)\) expresses zero as a positive
weighted sum of these three nonnegative numbers. They must all vanish.
Since \(\det(r_1,r_2)>0\), the last two rows are independent, forcing
\(\alpha=\beta=0\).

Applying the same argument to \((-\alpha,-\beta)\) gives the stronger
conclusion:

\[
\boxed{\text{Every nonzero constant linear combination of }S_H,S_Q
\text{ takes both signs among these three points.}}       \tag{5}
\]

By (2), the same conclusion holds for \(\rho_H,\rho_Q\). In
particular, their two-dimensional span contains no nonzero globally
nonnegative function, and therefore no globally positive function.

## 4. What this rules out in the iteration

The all-order total-nonnegativity theorem for the compensation kernel
allows positive source prefixes to be transported. One might try to
construct the next such prefix by taking a fixed invertible two-by-two
change of basis in the signed pair \((\rho_H,\rho_Q)\). Formula (5)
shows that neither row of any such change of basis can become globally
positive. That particular shortcut is unavailable for actual theta.

This does not prevent the already positive outputs
\(I_H=\Pi\rho_H\) and \(I_Q=\Pi\rho_Q\). It also does not determine
the sign or crossing count of their Wronskian. Those are the signed
two-density comparisons or joint-anchor inequalities identified in the
companion notes. The certificate narrows that remaining problem without
claiming an obstruction to RH itself.

## 5. Reproducibility and tails

`theta_signed_source_span_20261111.py` uses the fixed PR #53 `Theta`
and positive-moment helpers. It computes

\[
C(0)=\frac14\int_0^\infty s\kappa(s)\,ds,
\qquad C(t)=C(0)-\frac14\int_0^t s\kappa(s)\,ds.
\]

The first integral includes its full spatial and omitted-theta tails.
For the second, the omitted-mode bound is decreasing for \(s\ge0\)
and is bounded by its value \(E_0\) at zero. The additional absolute
error is at most \(E_0t^2/8\). Rigorous finite integration supplies the
other error. Every theta derivative through order eight has the fixed
helper's explicit omitted-mode enclosure.

Six exact identities check the null-vector relation and the four
derivatives of the final \(C\) column. The three point enclosures are
proof witnesses for the finite-dimensional separation argument; they
are not being extrapolated into an unchecked spatial inequality.
