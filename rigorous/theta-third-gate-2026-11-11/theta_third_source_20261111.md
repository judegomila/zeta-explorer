# The next theta sources: two-anchor minors and a persistent higher-source obstruction

Research continuation, 11 November 2026. This note gives exact formulas
for the source determinants of the second canonical theta pair. It also
proves that the stronger source-positivity shortcut remains false after
the first reduction: for all sufficiently large anchors, both higher
first-pair sources are negative throughout a fixed neighborhood of the
spatial origin. The assertion is uniform in that neighborhood.

The actual second-pair source determinants sampled by the companion
diagnostic are positive. Sampled positivity is not a proof on the full
anchor and spatial domain. This component does not establish third full
preservation, six-node Pick positivity, or RH.

## 1. Conventions and prior inputs

Use the actual theta kernel and completed zeta normalization of PR #53:

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt,
\quad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds,
\quad p(a)=F'(a)/F(a).
\]

For every positive anchor the first canonical pair is \((b_a,n_a)\):

\[
n_a+a b_a=C,\qquad a n_a+4b_a''=p(a)\kappa.
\tag{1}
\]

For any pair \((u,v)\), put

\[
H=u/v,\quad B=4u''/v,\quad J=4v''/v,
\quad P=16u^{(4)}/v,\quad Q=16v^{(4)}/v.
\]

Unsubscripted quantities refer to \((C,\kappa)\); subscript 1 to
\((b_a,n_a)\); subscript 2 to the pair after a second anchor \(c\).
The Wronskian \(W_j\) uses derivative rows \(0,\ldots,j-1\).

Fixed prior inputs are first and second full preservation from PRs
#52–53, the canceled kernel identity in PR #53, and the rigorous
original-source inequalities

\[
\frac{S_H(t)}{t^{10}}<-100000,\qquad
\frac{S_Q(t)}{t^{10}}<-10^{12}
\quad(0<t\le1/16),
\tag{2}
\]

where

\[
S_H=W_4(B',J',P',H'),\qquad S_Q=W_4(B',J',P',Q').
\]

These are inequalities for the actual infinite theta sum, not a
single-mode replacement. The prior certificates include the limiting
values at zero and the discarded theta and spatial tails.

## 2. Universal determinant elimination

For one canonical step with anchor \(a\) and response value \(r\),
the identities \(n+ab=u\), \(an+4b''=rv\) imply

\[
\boxed{
W_3(B_{\rm new}',J_{\rm new}',-H_{\rm new}')
=-\frac{r}{a n^4}W_4(n,v,4u'',u),}
\tag{3}
\]

\[
\boxed{
W_3(B_{\rm new}',J_{\rm new}',P_{\rm new}')
=\frac{r^2}{n^4}W_4(n,v,4u'',4v'').}
\tag{4}
\]

To prove these formulas, multiply the quotient Wronskians by \(n^4\)
and use the columns
\((n,4b'',4n'',-b)\) or \((n,4b'',4n'',16b^{(4)})\).
Subtract multiples of the first and other columns using the two
canonical equations. The factors in (3)–(4) follow without a
differentiation convention or an orientation choice.

Equivalently, with \(N=n/v\), the sources are

\[
\frac{r}{aN^4}W_3(N',B',H'),\qquad
-\frac{r^2}{N^4}W_3(N',B',J').
\tag{5}
\]

## 3. Two-anchor formulas in the original theta family

Write \(p=p(a)\), \(q=p(c)\), and

\[
D=cq-ap,\qquad r=\frac{cp-aq}{D},\qquad
n_2=n_{a,c}=\frac{p(n_a-n_c)}D.
\tag{6}
\]

Take \(c>a\), so \(D>0\). The positivity of \(r\) and \(n_2\)
is already part of the preceding canonical positivity results.
Substitute \(u=b_a\), \(v=n_a\) into (3)–(4). Because
\(4b_a''=p\kappa-a n_a\), all second-anchor data disappear from
the determinant except the second copy \(n_c\):

\[
\boxed{
W_{H,2}:=W_3(B_2',J_2',-H_2')
=-\frac{r p^2}{acD\,n_2^4}
W_4(n_a,n_c,\kappa,C),}
\tag{7}
\]

\[
\boxed{
W_{P,2}:=W_3(B_2',J_2',P_2')
=-\frac{r^2p^2}{D\,n_2^4}
W_4(n_a,n_c,\kappa,t\kappa').}
\tag{8}
\]

With \(N_a=n_a/\kappa\), \(N_c=n_c/\kappa\), and
\(M=n_2/\kappa\), the same identities become

\[
W_{H,2}=-\frac{rp^2}{acD M^4}W_3(N_a',N_c',H'),
\qquad
W_{P,2}=\frac{r^2p^2}{D M^4}W_3(N_a',N_c',B').
\tag{9}
\]

Thus both next-source signs concern ordered two-anchor minors of a
single first-numerator family. Interchanging the anchors multiplies
\(n_2\) by \(q/p>0\); the simultaneous changes of determinant
orientation and of \(D\) preserve the asserted signs.

### Coincident anchors

Let \(\dot n_a=\partial_a n_a\) and \(d_a=p+ap'>0\). Then

\[
n_{a,a}=-\frac p{d_a}\dot n_a,\qquad
r_{a,a}=\frac{p-ap'}{d_a}>0.
\]

Equations (7)–(8) have the exact continuous limits

\[
W_{H,2}(a,a)
=-\frac{r_{a,a}p^2}{a^2d_a\,n_{a,a}^4}
W_4(n_a,\dot n_a,\kappa,C),
\tag{10}
\]

\[
W_{P,2}(a,a)
=-\frac{r_{a,a}^2p^2}{d_a\,n_{a,a}^4}
W_4(n_a,\dot n_a,\kappa,t\kappa').
\tag{11}
\]

The companion diagnostics differentiate the centered integral formulas
analytically in \(a\); they do not approximate (10)–(11) by subtracting
two close-anchor values.

## 4. The stronger first-pair source tests

The direct higher-transfer route would inspect

\[
S_{H,1}=W_4(B_1',J_1',P_1',H_1'),\qquad
S_{Q,1}=W_4(B_1',J_1',P_1',Q_1').
\]

Exact five-column elimination gives

\[
\boxed{
S_{H,1}=-\frac{4p^2}{a n_a^5}
W_5(n_a,\kappa,t\kappa',\kappa'',C),}
\tag{12}
\]

\[
\boxed{
S_{Q,1}=\frac{16p^2}{n_a^5}
W_5(n_a,\kappa,t\kappa',\kappa'',t\kappa''').}
\tag{13}
\]

In the original ratio variables these are particularly simple:

\[
S_{H,1}=-\frac{p^2}{aN_a^5}W_4(N_a',B',J',H'),
\qquad
S_{Q,1}=-\frac{p^2}{N_a^5}W_4(N_a',B',J',P').
\tag{14}
\]

The two displayed minus signs have different asymptotic cancellations;
losing either sign would reverse the obstruction below.

## 5. A persistent obstruction, uniform near the origin

**Theorem.** For every fixed \(T>0\), uniformly on \(0<t\le T\),

\[
\boxed{
\frac{p(a)^3 S_{H,1}(a,t)}{t^{10}}
\longrightarrow \frac{S_H(t)}{t^{10}},\qquad
\frac{p(a)^2 S_{Q,1}(a,t)}{t^{10}}
\longrightarrow \frac{S_Q(t)}{t^{10}}
\quad(a\to\infty).}
\tag{15}
\]

The normalized functions in (15) are extended continuously to \(t=0\).
Consequently there exists \(A>0\) such that

\[
\boxed{
S_{H,1}(a,t)<0,\qquad S_{Q,1}(a,t)<0
\quad\text{for every }a\ge A,\ 0<t\le1/16.}
\tag{16}
\]

The proof gives existence of an anchor threshold, not a computed value
of \(A\). It does not assert that the signs of the actual sources
\(W_{H,2},W_{P,2}\) in (7)–(8) are negative.

### Proof of the uniform limits

The exact Laplace resolvent representation already used in PR #52 is

\[
N_a=\frac p a\frac{P_a*\kappa}{\kappa}
-\frac1{a^2}\frac{P_a*(B\kappa)}\kappa,
\qquad P_a(s)=\frac a4e^{-a|s|/2}.
\]

Repeatedly apply
\(P_a*f=f+4a^{-2}P_a*f''\). Because all derivatives of the actual
theta kernel and of \(B\kappa=-(t\kappa)'\) are bounded, on each
fixed compact interval this gives, in the even \(C^8\) norm,

\[
N_a=\frac p a-\frac B{a^2}+\frac{pJ}{a^3}
-\frac P{a^4}+E_{H,a},\qquad
\|E_{H,a}\|_{C^8}\le C_T\left(\frac p{a^5}+\frac1{a^6}\right),
\tag{17}
\]

and

\[
N_a=\frac p a-\frac B{a^2}+\frac{pJ}{a^3}
-\frac P{a^4}+\frac{pQ}{a^5}+E_{Q,a},\qquad
\|E_{Q,a}\|_{C^8}\le C_T\left(\frac1{a^6}+\frac p{a^7}\right).
\tag{18}
\]

Here \(P=4(B\kappa)''/\kappa\), which equals \(16C^{(4)}/\kappa\)
because \(B\kappa=4C''\). The constants absorb division by the
positive minimum of \(\kappa\) on the compact interval. The remainders
are derivatives of actual even functions, not unrelated entrywise
errors.

For even \(f\in C^8([-T,T])\), writing \(\widetilde f(u)=f(\sqrt u)\)
gives a bounded map from even \(C^8\) to \(C^4([0,T^2])\).
For example
\(
\widetilde f'(t^2)=\frac12\int_0^1 f''(st)\,ds
\), and iteration proves the higher derivative bounds. Therefore

\[
W_4(f_1',f_2',f_3',f_4')
=(2t)^{10}W_{4,u}(\widetilde f_{1,u},\ldots,\widetilde f_{4,u})
\tag{19}
\]

and its quotient by \(t^{10}\) is a bounded multilinear map of the
four even \(C^8\) functions. In (17), the constant, \(B\), and \(J\)
columns disappear from \(W_4(N_a',B',J',H')\). Moving the \(P'\)
column from first to third uses two swaps, so

\[
W_4(N_a',B',J',H')=-a^{-4}S_H
+W_4(E_{H,a}',B',J',H').
\tag{20}
\]

In (18), the \(B,J,P\) terms all disappear from the other determinant.
Moving \(Q'\) from first to fourth uses three swaps, so

\[
W_4(N_a',B',J',P')=-p a^{-5}S_Q
+W_4(E_{Q,a}',B',J',P').
\tag{21}
\]

Set \(M_a=aN_a/p\). The known elementary real-axis asymptotics give
\(p/a\to0\), \(ap\to\infty\), and \(M_a\to1\) uniformly on
the compact interval. Multiplying (14) by \(p^3\) or \(p^2\), using
(19)–(21), leaves normalized errors bounded respectively by constants
times

\[
\frac p a+\frac1{a^2},\qquad
\frac1{ap}+\frac1{a^2},
\]

in addition to the factor \(M_a^{-5}\to1\). These quantities tend
to zero, proving (15). The strictly negative uniform bounds (2) then
give (16).

## 6. What the diagnostics do and do not establish

The companion executable has an exact symbolic mode checking the
determinant eliminations, anchor-swap scaling, confluent orientation,
and asymptotic cancellation signs. Its numerical mode evaluates
\(n_a,n_a'\) by positive centered integrals and obtains the remaining
spatial derivatives from the exact ODE. For a coincident anchor it
differentiates those same integrands analytically, including \(p'(a)\).

The original strong sources have a useful warning at small anchors.
For example the diagnostics at \(a=1,t=0.001\) give

\[
S_{H,1}/t^{10}\approx245.5535371438>0,\qquad
S_{Q,1}/t^{10}\approx-8.3764734531\cdot10^9<0.
\]

This suggests an anchor-dependent source pattern; it is not a
certificate of a sign on an interval. A future compensation theorem
must allow a source already positive throughout the spatial interval,
as well as a negative-to-positive crossing. A fixed declaration that
both sources always start negative is unjustified.

The continuum task remains to prove the two ordered minor signs
in (7)–(8), or a sufficient one-anchor mixed-derivative criterion,
throughout the entire positive domain. The proven obstruction says
why the stronger pointwise-positive hierarchy cannot substitute for
that task.

## Fixed source files

- PR #53, commit `5d64d45acf37f4957a8f65c036b502e1b49292d0`:
  `theta_second_origin_20261111.md` for (6) and coalescence;
  `theta_second_source_obstruction_20261111.py` and its replay for (2);
  `theta_second_source_20261111.md` for the earlier source identities.
- PR #52, commit `a24e261deae84bf2a06b6c33a7fbdfe95db2b803`:
  `theta_preservation_actual_20261110.md` for the exact Laplace resolvent
  and uniform derivative remainder method.

The new algebra and asymptotic proof above are derived here. No claim
of literature novelty or independent peer review is made.
