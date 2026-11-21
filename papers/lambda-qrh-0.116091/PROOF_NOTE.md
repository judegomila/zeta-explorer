# Proof note for the bound \(\Lambda\le 0.116091488672439\) from a zero-free half-plane

## Status and statement

This note records a computer-assisted upper bound for the de Bruijn–Newman
constant. It depends on two recent results that have not been refereed: the
zero-free half-plane Re s > 7/8 (openai/math family 003, whose Lean proof was
rebuilt here with standard axioms only) and D. J. Raymond's decreasing-barrier
construction (Zenodo 10.5281/zenodo.22867547). The value 0.116091 also uses this
project's internal floor and kernel certificates; without them the same argument
gives 0.118506. Those certificates are a third input that is not established
(internal and partly uncertified; count corrected 2026-11-21). It is a draft: not submitted, not published, not yet peer
reviewed. The accepted peer-reviewed bound remains Λ ≤ 0.2 (Platt–Trudgian). RH is
open. The inputs are stated below as hypotheses; the theorem is not a bound on
\(\Lambda\) independent of them.

Assume

* **(H1)** \(\zeta(s)\ne0\) for \(\operatorname{Re}s>7/8\) (openai/math family 003;
  Lean proof rebuilt locally with the standard axioms only; not peer reviewed);
* **(H2)** the analytic statements of D. J. Raymond's decreasing-barrier
  construction (Zenodo 10.5281/zenodo.22867547), together with the floor and kernel
  certificates of his deposit used by the run below (unrefereed; reviewed only
  inside this project);
* **(H3)** every zero \(\beta+i\gamma\) of \(\zeta\) with
  \(0<\gamma\le 3000175332800\) has \(\beta=1/2\) (Platt–Trudgian, Theorem 1;
  peer reviewed).

Then

\[
\Lambda\le\frac{118505710922701}{10^{15}}=0.118505710922701. \tag{i}
\]

If in addition

* **(H4)** the 468 floor entries and 59 kernel rows used by the re-tuned run F2
  (this project's route-P certificates; internal, mostly single implementation)
  satisfy the floor inequality (J) and the kernel inequality (K) of §3,

then

\[
\Lambda\le\frac{116091488672439}{10^{15}}=0.116091488672439. \tag{ii}
\]

Value (ii) uses only the analytic part (W), (FC), (CE) of (H2), not Raymond's own
floor tables; its floors are supplied by (H4). The accepted peer-reviewed bound is
Platt–Trudgian's \(\Lambda\le0.2\). RH is open. By Rodgers–Tao, \(\Lambda\ge0\);
neither value bears on RH itself.

Apart from the start, the barrier method below is Raymond's: the method, its floor
estimates, kernel catalogue and comparison arithmetic are his. This note adds two
things: the observation that a zero-free half-plane enters his chain only through the
barrier start, with the proof of that substitution; and the runs that produce (i)
and (ii), the second with additional floors and kernels produced in this project.

## 0. Normalisation

Following Polymath,

\[
H_t(z)=\int_0^\infty e^{tu^2}\Phi(u)\cos(zu)\,du,\qquad
\Phi(u)=\sum_{n\ge1}\bigl(2\pi^2n^4e^{9u}-3\pi n^2e^{5u}\bigr)e^{-\pi n^2e^{4u}},
\]

so that \(H_0(z)=\tfrac18\,\xi\bigl(\tfrac12+\tfrac{iz}2\bigr)\) with
\(\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)\). The constant \(\Lambda\) is
the least \(t\) such that every zero of \(H_t\) is real. A zeta zero
\(\rho=\beta+i\gamma\) corresponds to the zero \(z=2\gamma-i(2\beta-1)\) of \(H_0\),
so \(|\operatorname{Im}z|=|2\beta-1|\).

The Polymath results used: Proposition 3.1 (dynamics of a simple zero, (i); Hermite
splitting of a repeated zero, (ii)), Theorem 3.2 (de Bruijn's bound: no zeros with
\(y>y_0\) at time \(t_0\) implies none with \(y>\max(y_0^2-2(t-t_0),0)^{1/2}\) at
\(t>t_0\); de Bruijn 1950, Theorem 13) and Theorem 1.5(i) (for \(0<t\le1/2\), zeros
with \(x\ge\exp(C/t)\) are real).

## 1. Lemma 1: zero-free half-plane to squared strip

**Lemma 1.** Let \(1/2<\theta<1\) and assume \(\zeta(s)\ne0\) for
\(\operatorname{Re}s>\theta\). Then every zero \(z\) of \(H_0\) satisfies
\(|\operatorname{Im}z|\le2\theta-1\), and for every \(t\ge0\) every zero \(z\) of
\(H_t\) satisfies

\[
(\operatorname{Im}z)^2\le\max\bigl((2\theta-1)^2-2t,\;0\bigr).
\]

In particular \(\Lambda\le(2\theta-1)^2/2\); for \(\theta=7/8\) this is
\(\Lambda\le9/32=0.28125\), which is weaker than \(\Lambda\le0.2\).

*Proof.* Write \(s=\tfrac12+\tfrac{iz}2\), so \(\operatorname{Re}s=(1-\operatorname{Im}z)/2\).
For \(\operatorname{Re}s>\theta\ge1/2\) the factors \(s\), \(\pi^{-s/2}\) and
\(\Gamma(s/2)\) of \(\xi\) do not vanish; at \(s=1\), \(\xi(1)=1/2\); for \(s\ne1\),
\(s-1\ne0\) and \(\zeta(s)\ne0\) by hypothesis. Hence \(\xi\) has no zero with
\(\operatorname{Re}s>\theta\), and by \(\xi(s)=\xi(1-s)\) none with
\(\operatorname{Re}s<1-\theta\). Every zero of \(H_0\) therefore has
\(1-\theta\le\operatorname{Re}s\le\theta\), that is
\(|\operatorname{Im}z|=|1-2\operatorname{Re}s|\le2\theta-1\). Since \(H_0\) has no
zero with \(\operatorname{Im}z>2\theta-1\), Polymath Theorem 3.2 with \(t_0=0\),
\(y_0=2\theta-1\) gives the second claim for \(\operatorname{Im}z\ge0\), and the
symmetry \(z\mapsto\bar z\) of the zero set gives it for \(\operatorname{Im}z<0\).
At \(t=(2\theta-1)^2/2\) all zeros are real. \(\square\)

The bound is closed: zeros with \(\beta=7/8\) exactly are not excluded, so
\(\operatorname{Im}z=3/4\) is possible at \(t=0\). Lean:
`RaymondCore.Substitution.substitution`, `Lambda_le_of_zeroFree`, and at
\(\theta=7/8\) `RaymondCore.Instance78.H_zero_strip_78` (see `LEAN.md`).

## 2. Raymond's chain: the objects

Fix \(X=6000000185827\) and \(N_0=690988\). A *tail zero* at time \(t\) is a zero
\(z\) of \(H_t\) with \(|\operatorname{Re}z|>X\).

**(W) Head wall** (Raymond AF §§2–3). For \(0\le t\le41/250\), every zero of \(H_t\)
with \(|\operatorname{Re}z|\le X\) is real. The proof combines (H3) at \(t=0\)
(ordinate \((X+1)/2=3000000092914\), clearance \(175239886\)), a finite interval
certificate for \(|H_t/B_t|>3/4\) on the line \(x=X\), \(0\le y\le1\),
\(0\le t\le41/250\), the classical strip \(|y|\le1\), and a counting argument on the
compact head cell. This is the only use of (H3).

**Probe floor.** For a height \(h>0\) put
\(S(x,h,t)=\partial_y\log|H_t(x+iy)|\big|_{y=h}\). By the Hadamard product,
\(S(x,h,t)=\sum_{\text{pairs}}K_h(x-x_j,b_j)\) over conjugate pairs
\(x_j\pm ib_j\) (real zeros with half weight), where

\[
K_h(d,b)=\frac{h-b}{d^2+(h-b)^2}+\frac{h+b}{d^2+(h+b)^2}.
\]

**(J) Joint floor.** For cell \(i\) (time interval \([i/4000,(i+1)/4000]\)), height
\(h_i\) and ratio \(r\): for every \(t\) in the cell and every \(x\ge X\),
\(\tfrac12[S(x+rh_i,h_i,t)+S(x-rh_i,h_i,t)]>\ell_i\). The floors \(\ell_i\) are
produced by interval computations from Raymond's one-point estimates (AF §§4–9) and
his two-probe theorem (main paper, Theorem 4).

**(K) Kernel inequality** (Raymond AF (10.1)). For a kernel row \((r,\lambda,\rho)\):
for every real \(d\), \(0<y\le\rho h\) and \(0\le b\le y\) with \((d,b)\ne(0,y)\),

\[
2K_y(d,b)\ge\lambda\,\frac yh\cdot\frac{K_h(d+rh,b)+K_h(d-rh,b)}2 .
\]

**Self term.** With \(q=y^2\) and \(v=q/h^2\), the zero's own pair contributes
\(s_r(v)/h\) to the probe average, where
\(s_r(v)=2(1+r^2-v)/\bigl((1+r^2-v)^2+4r^2v\bigr)\).

**Rate.** \(c=(2\lambda/h)(\ell-\mathrm{cap}/h)\) with
\(\mathrm{cap}\ge\sup_{0\le v'\le v}s_r(v')\).

At a simple tail zero \(z=x+iy\) that is highest among the tail zeros, Polymath
Proposition 3.1(i) gives
\(q'=-2-4y\sum_{\text{other pairs}}K_y(d_j,b_j)\). Summing (K) over the other pairs,
using \(S=\sum_{\text{pairs}}K_h\), removing the own pair and applying (J) at
\(x\pm rh\) (both \(\ge X-2\) since \(rh<2\)) gives Raymond's inequality

\[
q'<-2-c\,q. \tag{AF 11.1}
\]

The barrier is the solution of \(\beta'=-2-c_k\beta\) on each substep; the exact
step is \(q\mapsto(q+2/c)e^{-c\delta}-2/c\).

## 3. Lemma 2: the barrier lemma with a zero-free start

This is Lemma S(θ) plus Lemma FB(θ) of the internal review
`formalization/paper/raymond-g0-review-b-2026-10-08.md` (§§5, 8), independently
confirmed in review A §7. It is Raymond's first-contact argument with the start
condition \(q_0>1\) replaced by \(q_0>(2\theta-1)^2\).

**Lemma 2.** Let \(1/2<\theta<1\). Assume \(\zeta(s)\ne0\) for
\(\operatorname{Re}s>\theta\), (W), and (J), (K) for the entries used below. Let
\(\delta=1/512000\), \(t_k=k\delta\), \(i(k)=\lfloor k/128\rfloor\), and let
\((q_k,c_k)_{0\le k\le K}\) be a record with modes \((r_k,\lambda_k,\rho_k)\), heights
\(h_k=h_{i(k)}\) and floors \(\ell_k\) such that, for \(v_k=q_k/h_k^2\):

* (C1) \(v_k\le\rho_k^2\) and \(r_kh_k<2\);
* (C2) \(c_k=(2\lambda_k/h_k)(\ell_k-\mathrm{cap}_k/h_k)>0\) with
  \(\mathrm{cap}_k\ge\sup_{0\le v\le v_k}s_{r_k}(v)\);
* (C3) \(0<c_k\delta<1\) and
  \(q_{k+1}\ge(q_k+2/c_k)e^{-c_k\delta}-2/c_k\) for \(k<K\);
* (C4) **(S1)** \(q_0-(2+c_0q_0)\cdot10^{-8}>(2\theta-1)^2\);
* (C5) \((q_K+2/c_K)e^{-c_K\delta}-2/c_K\le q_e\) and
  \(\tau=\log\bigl(1+c_K(q_K-q_e)/(2+c_Kq_e)\bigr)/c_K\le\delta\);
* (C6) \(T^*=t_K+\tau\) satisfies \(T^*+q_e/2<41/250\).

Then \(\Lambda\le T^*+q_e/2\).

*Proof.*

1. *Barrier.* Let \(\beta\) be the continuous function with \(\beta(0)=q_0\) and
   \(\beta'=-2-c_k\beta\) on \([t_k,t_{k+1}]\). The step map is increasing in \(q\),
   so by (C3) and induction \(\beta(t_k)\le q_k\). Every condition in (C1)–(C2) is an
   upper bound on \(q\) (admissibility \(v\le\rho^2\); the cap is a supremum over
   \([0,v]\)), so it holds at every height \(\le\beta(t)\) on substep \(k\). By (C5)
   and monotonicity, \(\beta\) reaches \(q_e\) at a time \(T_\beta\le T^*\).
2. *Start, \(0\le t\le10^{-8}\).* On the first substep \(\beta\) is convex and
   decreasing with \(\beta'\ge-2-c_0q_0\), so \(\beta(t)\ge q_0-(2+c_0q_0)t\).
   By (S1) and Lemma 1, for \(0\le t\le10^{-8}\) (note \(10^{-8}<\delta\)) every zero
   satisfies \(y^2\le(2\theta-1)^2-2t\le(2\theta-1)^2<\beta(t)\). No zero meets the
   barrier before \(10^{-8}\). This is the only step that reads the zero locations
   at time 0, and the only use of the half-plane.
3. *First contact on \([10^{-8},T_\beta]\).* Let \(t^*\) be the infimum of the times
   at which some tail zero has \(y^2\ge\beta(t)\). For \(t\ge10^{-8}\), Polymath
   Theorem 1.5(i) and \(|y|\le1\) put all nonreal zeros in a fixed compact set; by
   Hurwitz's theorem the infimum is attained, \(t^*>10^{-8}\), and a tail zero
   \(z^*=x^*+iy^*\) has \(y^{*2}=\beta(t^*)\) and is highest among the tail zeros.
   By (W) and the symmetries \(z\mapsto-z,\bar z\), we may take \(x^*>X\), \(y^*>0\).
   If \(z^*\) is a repeated zero, Proposition 3.1(ii) gives, for \(t<t^*\) close to
   \(t^*\), a zero displaced upward by \(\asymp\sqrt{t^*-t}\), while \(\beta\) is
   Lipschitz there; this contradicts the choice of \(t^*\). If \(z^*\) is simple,
   (AF 11.1) with the rate of the substep containing \(t^*\) (the left one at a
   knot) gives \(q'(t^*)<-2-c_k\beta(t^*)=\beta'(t^*-)\), while first contact forces
   \(q'(t^*)\ge\beta'(t^*-)\). Contradiction.
4. *Terminal.* At \(T_\beta\) every tail zero has \(y^2\le q_e\) and every head zero
   is real by (W) (\(T_\beta<41/250\) by (C6)). Theorem 3.2 with \(t_0=T_\beta\),
   \(y_0=\sqrt{q_e}\) gives \(\Lambda\le T_\beta+q_e/2\le T^*+q_e/2\). \(\square\)

The computed \(U\) is an upper bound for \(T^*+q_e/2\): stored values are rounded
up to multiples of \(2^{-96}\), \(e^{-x}\) is bounded above by the degree-18 Taylor
sum, \(\log(1+z)\) above by the alternating sum through degree 11, and the result
is rounded up to a multiple of \(10^{-15}\).

Lemma 2 is written for a barrier that is continuous across substeps. Floors valid
only on a window \(q\in[q_{lo},q_{hi}]\) would need the stored-barrier form (review B,
GAP B3); neither run uses such a floor (0 window substeps).

## 4. The two runs

**Value (i).** Raymond's chain, his X1 floor tables at plan heights, his kernel
catalogue, \(q_0=281251/500000=9/16+2\cdot10^{-6}\). First substep: kernel 4 (row index,
from 0, in Raymond's `data/KERNELS.json`)
(\(r=23/40\), \(\lambda=199/100\), \(\rho=7/20\)), \(h=109/50\),
\(v_0=0.118362\le\rho^2=0.1225\),
\(c_0=12113002361358409/1188100000000000\approx10.195272\),

\[
q_0-(2+c_0q_0)\cdot10^{-8}-\tfrac9{16}=\frac{114215105972865586110341}{59405\cdot10^{24}}\approx1.922651\cdot10^{-6}.
\]

60,675 substeps (kernel 4 on 51,614, kernel 5 on 9,061; the sharp continuum law of
AF Part II on none). Terminal substep \(k=60674\) (index 2 within cell 474), \(t_K=30337/256000\),
\(z=3.4187\cdot10^{-5}\), \(\tau/\delta=0.9214\). Result
\(U=118505710922701/10^{15}\). Raymond's alternate log bound gives
\(59252855461351/(5\cdot10^{14})=0.118505710922702\); both are valid upper bounds.
Tightest admissibility margin on the path: \(\rho^2-v=3.793\cdot10^{-6}\) (cell 403).

**Value (ii).** The project's route-P consumer, re-tuned on the 7/8 path,
\(q_0=5625001/10^7=9/16+10^{-7}\),
\(c_0=41336831094003950997/3755300000000000000\approx11.0076\),

\[
q_0-(2+c_0q_0)\cdot10^{-8}-\tfrac9{16}=\frac{67904283759396681637924003}{37553\cdot10^{29}}\approx1.8082\cdot10^{-8}.
\]

59,439 substeps: 36,923 on Track-A joint floors at re-tuned heights, 11,304 on r2
structured floors, 11,212 on route-3 joint floors. Terminal substep \(k=59438\) (index 46
within cell 464), \(t_K=29719/256000\). Result \(U=U_{\rm robust}=116091488672439/10^{15}\).

Exact rationals throughout; the ladder from the first 7/8 run (0.117708313410954)
to F2 is in `PARAMETERS.md` §4.

## 5. Where the half-plane enters, and where it does not

The half-plane enters once: step 2 of Lemma 2, through (S1). The head wall (W) uses
the classical strip \(|y|\le1\) and (H3); the half-plane neither replaces nor is
needed for it, since (H1) gives \(|\operatorname{Im}z|\le3/4\) for head zeros but not
their reality. The floors (J) and kernels (K) read no zero locations. Compactness
after time \(10^{-8}\) uses Theorem 1.5(i) and \(|y|\le1\). The terminal allowance
\(q_e/2\) is de Bruijn's bound at \(T_\beta\) and does not depend on \(q_0\).

Every path-dependent condition (admissibility \(v\le\rho^2\), caps nondecreasing in
\(V\)) is an upper bound on \(q\), so a lower barrier satisfies it more easily. Both
runs still re-check these conditions on every substep.

A method-level remark, not a theorem of this note: in the fixed-time criterion of
Polymath Theorem 1.2 the half-plane lowers the tops of the regions in hypotheses (ii)
and (iii) to \(\sqrt{(2\theta-1)^2-2t}\), but leaves the conclusion
\(\Lambda\le t_0+y_0^2/2\) and its binding height \(y_0\) unchanged. It does not move a
bound of that type.

## 6. Review boundary

Machine-checked in Lean (`LEAN.md`): Lemma 1; the substep barrier lemma, the strict
entry and the terminal step, from named hypotheses (W), (FC), (CE); and conditions
(C1)–(C6) for every substep of both runs, replayed by `decide +kernel`.

Not machine-checked: (W), first contact (FC) and contact exclusion (CE) as analytic
statements about \(H_t\); (J) for each floor entry and (K) for each kernel row; (H3);
(H1) beyond the local build; the route-P lemmas behind (H4). These are the referee
questions in `OPEN_REVIEW_QUESTIONS.md`.
