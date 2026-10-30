# Signed clipping, the actual head, and a restricted safe complement

**Status:** proved analytic identities and scoped theorems; one strong clipping route is **failed**. The all-support physical-complement bound remains **open**. Internal independent review is not external peer review. No result here is a negative Weil vector or an RH proof.

**Source availability:** this module includes four complete source/audit pairs, but not their entire transitive analytic proof tree. In particular the inherited actual-head action theorem uses separate trace-repair, coordinate-Gram, action-strip and radical-domain results. Its analytic proof-tree availability is therefore **partial** in this review unit, not a claim of a standalone complete proof or numerical replay. See `research/rh/signed-complement/ANALYTIC_DEPENDENCIES.md` for the precise boundary.

## 1. The strong clipping hypothesis and its counterexample

Fix \(M>0\), let \(\ell=\log\lambda\), \(X=\lambda^2\), and put
\[
a(t)=\Re\psi(5/4+it/2)-\log\pi,\quad
P_X(t)=2\Re\sum_{d\le X}\Lambda(d)d^{-1/2+it},
\]
\[
C_X(t)=2\Re\frac{\sqrt X X^{it}-1}{1/2+it},\quad
d_X=P_X-C_X,\quad\delta=(1+\ell)^{-3},\quad
m(t)=(1-\delta)(a(t)+M)-d_X(t).
\]
Here \(\psi\) denotes digamma. At the proposed natural cutoff \(T_0=\pi X/\ell\), define
\[
v_{\rm high}(t)=1_{|t|>T_0}[4M-m(t)]_+.
\]
For the grid \(I_j=[j/\ell,(j+1)/\ell)\), put
\[
A_j=\int_{I_j}v_{\rm high},\quad c=\frac{M}{12\ell},\quad
E_\lambda=\sum_j(A_j-c)_+.
\]
The proposed strong cap \(A_j\le c\), or even \(E_\lambda=O_M(\ell)\), is false.

**Theorem.** Fix \(1/2<\theta<1\). Along \(X=2N\),
\[
E_\lambda\ge c_{M,\theta,\phi}N^{\theta-1/2}\log N
\]
for all sufficiently large integers \(N\), with a positive constant and unspecified onset.

### Proof construction

Choose a fixed real even Schwartz function \(\phi\), with angular Fourier support in \([-1,1]\) and \(\|\phi\|_2=1\). Set \(\Delta=N^\theta\),
\[
R_N(t)=\sum_{n\le N}n^{-1/2+it},\qquad
F_+(t)=\phi((t-N)/\Delta)e^{-it\log N/2}R_N(t),\quad
F(t)=F_+(t)+F_+(-t).
\]
Its inverse Fourier transform is even, smooth, and supported in
\([-\log N/2-1/\Delta,\log N/2+1/\Delta]\), strictly inside \([-\ell,\ell]\). Thus this is an admissible physical test, not a coefficient-space surrogate.

Euler summation at \(N+1/2\), with nonstationary phases \(\pm2\pi k+t/u\), proves uniformly on \([N/2,2N]\)
\[
R_N(t)=\zeta(1/2-it)+O(N^{-1/2}),\qquad
\sum_{n\le N}\frac{\log n}{\sqrt n}n^{it}
=-\zeta'(1/2-it)+O(N^{-1/2}\log N).
\]
This does not extend a two-sum approximate functional equation to an inadmissible dual length below one. The classical second moment and the balanced approximate functional equation then give
\[
\|F\|_2^2=2\Delta(\log N+O(1)),\qquad \|F\|_\infty^2=O(\sqrt N).
\]
For the arithmetic product, \(\sum_{d|m}\Lambda(d)=\log m\) identifies every output \(m\le N\) exactly. The Fourier support of \(|\phi|^2\) kills pairings unless \(|\log(m/n)|\le2/\Delta\). Outputs \(m>N\) pairing with \(n\le N\) therefore cross the cutoff by at most \(O(N/\Delta)\); at separation \(j\) there are at most \(j\) pairs. Their total pairing, divided by \(\Delta\), is \(O(N\log N/\Delta^2)=o(1)\).

The functional equation, multiplied by conjugate zeta rather than divided by zeta, gives
\[
2\Re[-\zeta'(1/2-it)\overline{\zeta(1/2-it)}]
=[\Re\psi(1/4+it/2)-\log\pi]|\zeta(1/2-it)|^2.
\]
The exact gamma correction is \(a_{5/4}-a_{1/4}=4/(1+4t^2)\); the actual continuum \(C_X\) is \(O(N^{-1/2})\) on the packet. Retaining both corrections proves
\[
\int m|F|^2=(M+o(1))\|F\|^2,
\qquad \int_{|t|\le T_0}[4M-m]_+|F|^2=o(\|F\|^2).
\]
All opposite-packet and outer tails are controlled by one sufficiently high fixed Schwartz decay exponent; no envelope changes with \(N\).

On each cell split \(v_{\rm high}=g+e\), where
\(g=\min(1,c/A_j)v_{\rm high}\) and \(e\ge0\), with the zero-mass cell interpreted as \(g=0\). Then \(\int e=E_\lambda\). The elementary cell inequality and \(\|F'\|_2\le\ell\|F\|_2\) give
\[
\int g|F|^2\le3\ell c\|F\|^2=\tfrac M4\|F\|^2.
\]
Because \([4M-m]_+\ge4M-m\), the high-tail expectation is at least \((3M-o(1))\|F\|^2\). Hence
\[
E_\lambda\|F\|_\infty^2\ge\int e|F|^2
\ge(11M/4-o(1))\|F\|^2,
\]
which proves the lower bound.

The failure concerns the strong **4M** clipping hypothesis. The packet averages \(m\) near \(M\), not below the earlier small-positive-threshold gate. It therefore does not refute that weaker gate, nor the valid conditional rank lemmas.

## 2. Why these packets are largely in the actual retained head

Throughout Sections 2–3, \(X=2N\), \(\lambda=\sqrt{2N}\), and \(\ell=\log\lambda\), with \(N\to\infty\).

On additive even \(L^2[-\lambda,\lambda]\), let
\(C_\lambda=P_\lambda\mathcal F_{2\pi}P_\lambda\), with
\((\mathcal F_{2\pi}v)(y)=\int v(u)e^{2\pi iuy}\,du\). Define the signed spectral projector
\[
\Pi_a=1_{\{\chi>0,\,1-\chi^2\le a_\lambda\}}(C_\lambda),
\quad a_\lambda=\lambda^{-4}(1+\ell)^{-7},\quad
G_\lambda=\operatorname{ran}\Pi_a\cap1^\perp.
\]
The actual finite arithmetic map is
\[
E_{\rm raw}v(x)=e^{x/2}\sum_{n\ge1}v(ne^x),\quad
Ev(x)=\tfrac12(E_{\rm raw}v(x)+E_{\rm raw}v(-x)),\quad |x|\le\ell.
\]
Let \(\mathscr H_\lambda=E G_\lambda\) and \(P\) be its **physical L²** orthogonal projection. “Positive” here refers to the source Fourier eigenvalue \(\chi>0\), not an assumed sign of every actual head energy.

For the packet \(f_N=\mathcal F^{-1}F\), the accepted projection theorem is
\[
\|(I-P)f_N\|\le C\sqrt{\Delta/N},\qquad
\frac{\|(I-P)f_N\|}{\|f_N\|}\le\frac C{\sqrt{N\log N}}.
\]
The proof constructs an additive source near \(\pm\sqrt N\), with carrier \(\sqrt N/(2\pi)\), strictly inside both cutoffs. Repeated nonstationary integration by parts gives superpolynomial exterior Fourier tail. An exact mean-zero repair is made before using Poisson summation. Positive symmetrization \((I+C_\lambda)/2\) removes the negative Fourier phase, spectral projection loses only a polynomial/logarithmic factor, and a projected Gaussian supplies a well-conditioned exact mean repair inside \(G_\lambda\). The bound \(\|E\|\le2\lambda\) transfers source errors to physical errors. Finally the full-line zeta identity, applied only to the mean-corrected source, and the long-cutoff approximation above give the stated \(O(\sqrt{\Delta/N})\) error. Complete details and the audit are bundled.

Small physical L² residue is not small action of an unbounded Weil operator. No sign of the normalized residue, projection theorem for arbitrary dangerous vectors, or whole-complement floor is inferred.

## 3. Exact physical orthogonality and a growing safe sector

For an even physical \(f\), the actual adjoint is, almost everywhere,
\[
A_f(y)=\frac1{2\sqrt{|y|}}\sum_{n\le\lambda|y|}n^{-1/2}
 f(\log(|y|/n)),\quad 1/\lambda<|y|<\lambda,
\]
and zero for \(|y|<1/\lambda\). The factor \(1/2\) comes from the full additive-even norm. Thus
\[
f\perp\mathscr H_\lambda\quad\Longleftrightarrow\quad
\Pi_a A_f=c\Pi_a1\ \text{for some scalar }c.
\]
This is physical orthogonality, not a gamma-metric equation. Finite Möbius inversion gives
\[
f(x)=2e^{x/2}\sum_{d\le\lambda e^x}\frac{\mu(d)}dA_f(e^x/d).
\]
The inner divisor sum is \(\sum_{d|m}\mu(d)=1_{m=1}\); all sums are finite. Neither identity gives a favorable sign for arbitrary complement vectors.

There is nevertheless a restricted positive complement sector. Set
\[
b=\tfrac12\log N,\quad h=(\sqrt N\log^2N)^{-1},\quad
K=\left\lfloor\frac{\sqrt N}{16\pi\log^2N}\right\rfloor.
\]
For \(g\) in the first \(K\) Dirichlet modes on \([-h,h]\), define
\[
w_g(x)=2^{-1/2}\{e^{iN(x-b)}g(x-b)+e^{iN(-x-b)}g(-x-b)\}.
\]
These are even and norm-preserving, with \(\|g'\|\le N\|g\|/32\). Their Fourier mass below \(N/2\) is at most \(\|w_g\|^2/128\), giving gamma energy at least \([(127/128)\log N-C]\|w_g\|^2\). Prime shifts can overlap only if \(|\log(n/N)|\le2h\); elementary counting bounds their total adverse energy by \(C\|w_g\|^2/\log N\). The even continuum term is bounded below by \(-4I\). Hence
\[
q[w]\ge\tfrac12\log N\|w\|^2
\]
on their \(K\)-dimensional space, eventually.

Use the separately accepted actual-head action theorem \(\|A_\lambda P\|\le\eta_\lambda=O((1+\ell)^{-2})\), with its operator-domain hypotheses. For \(Q=I-P\), exact expansion gives
\[
q[Qw]\ge q[w]-3\eta_\lambda\|w\|^2
\ge\tfrac14\log N\|w\|^2
\ge\tfrac14\log N\|Qw\|^2.
\]
Thus \(Q\) is injective on that space, and the true physical complement contains a positive sector of dimension asymptotic to \(\sqrt N/[16\pi\log^2N]\). Projection may destroy narrow support; the change is paid by the full action bound, not by an unjustified transfer of a support estimate. This covers only the specified sector, not every vector in the complement.

## Evidence and open boundary

The bundled source/audit pairs prove the packet obstruction, physical-head projection, and narrow-lobe safe-sector theorem; the actual-head action theorem is included as an explicit dependency. These are analytic results, not a numerical spectrum scan. Pending finite-Möbius-inverse and exterior-minimum notes are excluded.

The remaining task is a genuinely signed bound on arbitrary physical-complement directions, including broad lobes and long prime-shift networks. A whole-space positive clipping norm discards the cancellation and head geometry that these results show must be retained.
