# Prime-only reserve: exact jumps plus an integrable continuous flow

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

Let

\[
 P(r)=\sum_{p\le e^r}{\log p\over\sqrt p},\qquad
 J_P(r)=\sum_{p\le e^r}{(\log p)^2\over\sqrt p},\qquad
 H_*(r)=P(r)+r/2+\kappa-b.
\]

Use the same \(b,\kappa,T_\infty\) as the parent note. Define the explicit ordinary-prime reserve

\[
 \mathcal R(r)=J_P(r)+r^2/4
       -2H_*(r)[\log(H_*(r)/2)-1]-4+T_\infty.             \tag{1}
\]

It is defined for every \(r\ge0\), because \(\kappa>-1\) and \(-b>2\) ensure \(H_*>0\).

## 1. Exact local evolution

Between ordinary-prime events, \(P,J_P\) are constant and \(H_*'=1/2\). Hence

\[
 \mathcal R'(r)=\frac12\log\frac{e^r}{(H_*(r)/2)^2}.
                                                               \tag{2}
\]

At an ordinary prime \(p=e^r\), with pre-event \(H=H_*(r-)\) and \(w=\log p/\sqrt p\),

\[
 \mathcal R(r+)-\mathcal R(r-)
 =\widetilde c_p-d(H,w),
 \quad d(H,w)=2H[(1+w/H)\log(1+w/H)-w/H].                  \tag{3}
\]

This is the same exact Bregman calculation as before; no proper-power event is left in (1)--(3). The two deterministic counterterms \(r/2\) and \(r^2/4\) have distinct roles.

For sufficiently large r, the PNT relative bound (2) of the parent note and its memory estimate (10) give

\[
 H_*(r)/(2e^{r/2})=1+O(r^{3/2}e^{-0.59\sqrt r}),
                                                               \tag{4}
\]

including ordinary-prime jumps, whose relative sizes are \(O(re^{-r})\). Thus the continuous flow has finite absolute variation:

\[
 \int_0^\infty |\mathcal R'(r)|dr<\infty.                \tag{5}
\]

For r beyond the parent's scalar onset, \(H\ge\sqrt p\), so

\[
 0\le d(H,w)\le w^2/H\le(\log p)^2/p^{3/2},
 \qquad \sum_p d(H,w)<\infty.                            \tag{6}
\]

The final convergence follows even by replacing primes with all positive integers. Therefore (3), (5), and (6) directly show that \(\mathcal R(r)-\sum_{2<p\le e^r}\widetilde c_p\) converges. The integrable drift is a genuine proved error, not an assumed passive storage.

## 2. Convergence to the original reserve, including the moment constant

Let the parent's proper-power memory be \(B(r)=r/2+\kappa+\epsilon(r)\). Its proven bound makes \(\epsilon\) integrable and \(r\epsilon(r)\to0\). Define

\[
 J_B(r)=\sum_{p^k\le e^r,\ k\ge2}
             {k(\log p)^2\over p^{k/2}},\qquad
 C_J=-\int_0^\infty\epsilon(u)du.
\]

Exact Stieltjes partial summation yields

\[
 J_B(r)=rB(r)-\int_0^rB(u)du
       ={r^2\over4}+C_J+r\epsilon(r)
                          +\int_r^\infty\epsilon(u)du.    \tag{7}
\]

Since \(H_{\rm full}=H_*+\epsilon\), the mean-value theorem for
\(F(H)=2H[\log(H/2)-1]\) gives

\[
 |F(H_{\rm full})-F(H_*)|=O(r|\epsilon(r)|)\to0.
\]

Consequently the original right-continuous closed reserve obeys the precise unconditional relation

\[
 \boxed{\quad R(e^r)-\mathcal R(r)\longrightarrow C_J.\quad} \tag{8}
\]

The notation \(R(e^r)\) means the original event reserve held constant between its prime-power events. At proper powers \(\mathcal R\) remains continuous; the jumps of the difference are nevertheless compatible with (8). The limit is proved by (7), not assumed from a finite scan.

## 3. Storage implication and limitation

This provides a clean target for state-dependent investigations: a continuous scalar state with explicit prime impulses, finite total continuous forcing, and finite total convexity debt. The two divergent signed prime-credit Jordan sums are the only possible source of persistent oscillation or unbounded excursions.

It does not make a PNT-normalized mismatch into a useful bounded storage. That mismatch tends to zero, while its impulse coefficient includes the exponentially growing weighted prime density. An unscaled or state-dependent storage must keep this interaction rather than infer small cumulative work from a small relative displacement.

Physics analogy: the even and odd prime-power mechanisms are not an indefinitely active noise source; after an explicit counterterm they contribute finite total work. The ordinary-prime impulses still form a lossless oscillating channel. A finite-dissipation or convergent-relative-error argument cannot bound its amplitude without a genuinely signed energy inequality.
