# Direct weighted-Pruefer logarithmic endpoint/leakage bound

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Independent constructive spectral lemma for the actual regular prolate modes. This is a separate strengthening of the dyadic-collar note, not an overwrite of it. No oscillation-average heuristic, all-mode differential-width assumption, signed arithmetic estimate, or Weil positivity claim enters.

## Result

Let e be a real even regular prolate eigenfunction on \([-\lambda,\lambda]\), normalized in the **full additive L2 norm** by \(\|e\|_2=1\). Let \(\chi\) be its finite Fourier eigenvalue for the convention \(e^{2\pi ixt}\), and \(\nu\) its differential eigenvalue. Define

\[
c=2\pi\lambda^2,\quad k=2\pi\lambda,\quad
d=\frac{|\nu-c^2|}{c},\quad D_0=1+d,\quad h_0=\frac{8D_0}{\lambda}.
\]

Assume \(h_0\le\lambda/2\), equivalently \(\lambda^2\ge16D_0\), and put

\[
\mathscr L=\log\!\left(\frac{\lambda^2+4D_0}{12D_0}\right)>0.
\]

Then

\[
\boxed{|e(\lambda)|^2
\le\frac{8\pi^2\lambda}{\mathscr L}(1-|\chi|^2).}          \tag{1}
\]

In particular, if \(\lambda^2\ge144D_0\), then

\[
\boxed{|e(\lambda)|^2
\le\frac{16\pi^2\lambda}{\log(\lambda^2/D_0)}(1-|\chi|^2).} \tag{2}
\]

No \(|\chi|\ge1/2\) hypothesis is needed for the lemma; it may be applied to such a selected band when its **actual** d values satisfy the displayed condition. It does not infer differential width from the number of selected labels.

## 1. Exact exterior ODE and far normalization

Set

\[
f(x)=\int_{-\lambda}^{\lambda}e(s)e^{2\pi ixs}\,ds,
\quad P(x)=x^2-\lambda^2,\quad z(x)=\sqrt{P(x)}f(x),\quad x>\lambda.
\]

The regular prolate equation in these physical coordinates is

\[
(x^2-\lambda^2)f''+2xf'+(k^2x^2-\nu)f=0.
\]

Substitution of \(f=z/\sqrt P\) gives exactly

\[
z''+Q(x)z=0,\qquad
Q(x)=k^2-\frac{\Delta}{P(x)}+\frac{\lambda^2}{P(x)^2},
\quad\Delta=\nu-c^2.                                      \tag{3}
\]

These are the same Fourier/differential conventions as
`../gamma_complement_attack/LOGARITHMIC_TRANSITION_ENDPOINT_LEAKAGE_GAIN.md`
and the cached `GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md`.
The calculation above also checks the conjugation directly.

Regularity at the physical endpoints permits Fourier integration by parts. For each fixed mode,

\[
f(x)=\frac{e(\lambda)}{\pi x}\sin(kx)+O(x^{-2}),\quad
z(x)=A\sin(kx)+O(x^{-1}),\quad
z'(x)=kA\cos(kx)+O(x^{-1}),\quad A=e(\lambda)/\pi.          \tag{4}
\]

Only the exact far limit is used; the remainders need not be uniform in the mode. No \(\chi^{-1}\) appears, because f is the Fourier transform of the zero extension, not a rescaled continuation.

For Q positive define

\[
H=z^2+z'^2/Q.
\]

Direct differentiation gives

\[
H'=-Q'z'^2/Q^2,\qquad (QH)'=Q'z^2,
\qquad H(\infty)=A^2.                                    \tag{5}
\]

## 2. Positive one-well region and amplitude lower bound

For \(x\ge\lambda+h_0\),

\[
P(x)\ge2\lambda h_0=16D_0,
\quad
\frac{|\Delta|}{k^2P}\le\frac1{32\pi},\quad
\frac{\lambda^2}{k^2P^2}\le\frac1{1024\pi^2}.
\]

In particular the convenient tighter interval

\[
\frac{31}{32}k^2\le Q(x)\le\frac{33}{32}k^2               \tag{6}
\]

holds throughout that ray. Also

\[
Q'(x)=2x\frac{\Delta P(x)-2\lambda^2}{P(x)^3}.
\]

If \(\Delta\le0\), Q decreases to \(k^2\), so (5) gives
\(QH\ge k^2A^2\), hence \(H\ge(32/33)A^2\).
If \(\Delta>0\), Q has at most one minimum. On its increasing side H decreases to \(A^2\), hence \(H\ge A^2\). On any decreasing side remaining after the collar, (QH)' is nonpositive toward that minimum, so
\(H\ge(Q_{\min}/Q)A^2\ge(31/33)A^2\). Thus in all cases

\[
H(x)\ge\tfrac12A^2,\qquad x\ge\lambda+h_0.                \tag{7}
\]

There is no assumed positive potential, or one-well control, before this collar.

## 3. Exact phase bounds without a theta-double-prime estimate

On \([a,b]=[\lambda+h_0,2\lambda]\), choose a continuous unwrapped phase by

\[
z=\sqrt H\sin\theta,\qquad z'/\sqrt Q=\sqrt H\cos\theta.
\]

A nonzero solution cannot have both z and z' zero, so this phase exists. Its exact derivative is

\[
\theta'=\sqrt Q+\frac{Q'}{4Q}\sin(2\theta).                \tag{8}
\]

Using \(x\le2\lambda\), the weaker Q lower bound \(k^2/2\), and \(P\ge16D_0\),

\[
\frac{|Q'|}{4Q}
\le\lambda\left(\frac d{\pi P^2}+\frac1{\pi^2P^3}\right)
\le\frac{\lambda}{1024\pi}+\frac{\lambda}{4096\pi^2}
<\frac k8.                                               \tag{9}
\]

The bound \(d/(1+d)^2\le1/4\) was used in the second step. Combining (6), (8), and (9) gives

\[
\frac34k\le\theta'\le\frac54k.                            \tag{10}
\]

These are deterministic differential inequalities. No average spacing or random phase of oscillations is invoked.

## 4. A weighted oscillation lemma

Let w be any nonnegative decreasing C1 function on \([a,b]\), and suppose
\(\alpha k\le\theta'\le\beta k\), with \(\alpha,\beta>0\).
Changing variable to \(v=\theta(x)\), put \(g(v)=w(x(v))\), which is decreasing. Then

\[
\begin{aligned}
\int_a^b w(x)\sin^2\theta(x)\,dx
&\ge\frac1{\beta k}\int_{\theta(a)}^{\theta(b)}g(v)\sin^2v\,dv\\
&\ge\frac{\alpha}{2\beta}\int_a^b w(x)\,dx
  -\frac{w(a)}{2\beta k}.                                \tag{11}
\end{aligned}
\]

Indeed, integration by parts gives

\[
\left|\int_A^B g(v)\cos(2v)\,dv\right|
\le\tfrac12(g(A)+g(B))+\tfrac12\int_A^B|g'|\,dv=g(A).
\]

Using \(\sin^2v=(1-\cos2v)/2\), and
\(\int g(v)dv=\int w(x)\theta'(x)dx\ge\alpha k\int w\), proves (11). In particular, it requires no bound on \(\theta''\).

Apply (11) with \(w=1/P\), \(\alpha=3/4\), \(\beta=5/4\). The exact logarithmic integral is

\[
\int_{\lambda+h_0}^{2\lambda}\frac{dx}{x^2-\lambda^2}
=\frac1{2\lambda}\log\!\left(\frac{2\lambda+h_0}{3h_0}\right)
=\frac{\mathscr L}{2\lambda}.
\]

Also \(w(a)\le1/(2\lambda h_0)\), so

\[
\int_a^b\frac{\sin^2\theta(x)}{P(x)}\,dx
\ge\frac{3\mathscr L}{20\lambda}
-\frac1{80\pi\lambda D_0}
\ge\frac{\mathscr L}{8\lambda}.                          \tag{12}
\]

For the final inequality use \(\mathscr L\ge\log(5/3)>1/2\), from \(h_0\le\lambda/2\), and \(D_0\ge1\). These inequalities leave a fixed positive margin in the endpoint error; no long-interval asymptotic is needed.

Equations (7) and (12) now give the uniform weighted exterior lower bound

\[
\boxed{\int_{\lambda+h_0}^{2\lambda}|f(x)|^2dx
=\int_a^b\frac{z(x)^2}{P(x)}dx
\ge\frac{A^2\mathscr L}{16\lambda}.}                     \tag{13}
\]

## 5. Exact leakage and the useful logarithmic form

Plancherel gives \(\|f\|_2=1\). On the interior interval the finite Fourier eigenidentity is \(f=\chi e\). Evenness therefore gives exactly

\[
\int_\lambda^\infty|f(x)|^2dx=(1-|\chi|^2)/2.             \tag{14}
\]

Combining (13)–(14) with \(A=e(\lambda)/\pi\) proves (1).
If \(R=\lambda^2/D_0\ge144\), then \(\sqrt R\ge12\) and
\(R+4\ge12\sqrt R\). Hence

\[
\mathscr L=\log((R+4)/12)\ge\tfrac12\log R,
\]

which proves (2).

For a transition family with an independently proved \(d=O(\log^2\lambda)\), this supplies the sought \(\lambda/\log\lambda\) endpoint/leakage scale. Summing (2) over such a band gives

\[
\sum_{n\in\mathcal B}\frac{|e_n(\lambda)|^2}{1-|\chi_n|^2}
\le16\pi^2\lambda\sum_{n\in\mathcal B}
\frac1{\log(\lambda^2/(1+d_n))}.
\]

The remaining tasks—proving the chosen band's differential-width condition, controlling divided differences/collective rows, and retaining the signed arithmetic edge—are not supplied by this lemma. No whole-support positivity endpoint changes.
