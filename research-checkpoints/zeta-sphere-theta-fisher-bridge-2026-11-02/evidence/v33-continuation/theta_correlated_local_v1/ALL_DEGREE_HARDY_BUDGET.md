# All-degree Hardy budget and a theta-specific factorization obstruction

Status: independently reviewed analytic PASS (including endpoint clarification and Gaussian benchmark). No new numerical run, finite-degree extension, or RH proof is asserted.

## 1. Domain and actual residual

Let F(z)=integral_R psi(u) exp(i z u)du be the complete theta transform (F=2Xi in our conventions). The real even profile psi and all its derivatives decay superexponentially on the real axis. F is entire, real on R, and every polynomial times F and its derivatives is square integrable on every fixed horizontal line. All differentiations below follow from this real-axis decay and Parseval, without assumptions on zeros of F.

Fix a positive shift a and a degree n. The signed moment functional in this note is
 J_a[p]=d/db integral_R p(t)^2 |F(t+i b)|^2 dt at b=a,
where p is held fixed during differentiation. Apart from the previously documented positive factors, J_a is the actual shifted bridge functional. Suppose only its known degree<n prefix is positive definite. Select the actual monic orthogonal residual p=p_n from that prefix and the degree-n cross moments. No degree-n norm or sign is used. Standard finite orthogonality gives n real simple roots r_1,...,r_n. The statements below also hold for any real-rooted monic p, including multiplicities. Although the selected p can depend on a, it is frozen throughout the b derivative; differentiating its coefficients here would be incorrect.

For S a subset of the labeled roots, write q_S(t)=product_(j notin S)(t-r_j), q_empty=p. Define
 M_q(b)=integral q(t)^2 |F(t+i b)|^2 dt,
 H_p(b)=integral |p(t+i b)F(t+i b)|^2 dt.

## 2. Exact finite triangular compensation at every degree

The pointwise product identity gives, with no boundary term or omitted tail,
 H_p(b)=sum_(S subset {1,...,n}) b^(2|S|) M_(q_S)(b).       (1)
Consequently
 J_a[p]=H_p'(a)-sum_(S nonempty) [2|S| a^(2|S|-1) M_(q_S)(a)
                                      +a^(2|S|) J_a[q_S]]. (2)
Every q_S on the right has strictly smaller degree. Positive definiteness of the known actual signed prefix makes J_a[q_S]>0, while M_q>0 is an ordinary positive Fourier norm. Thus the subtraction in (2) is genuinely positive. It cannot be dropped or replaced by the assertion that H_p' is positive. The polynomial p, all its roots and all the lower costs are selected by the actual inverse, not by an auxiliary positive regression.

To see the positive source explicitly, set f_p=p(iD)psi (with the displayed Fourier sign). Parseval gives
 H_p(b)=2pi integral exp(-2bu)|f_p(u)|^2 du.
Because p and F are real on R, |f_p|^2 is even. Therefore
 H_p'(a)=8pi integral_0^infinity u sinh(2au)|f_p(u)|^2 du>0.  (3)
This proves the familiar Hardy/three-lines source positivity directly. It does NOT prove the budget inequality (2).

A sufficient all-degree analytic lemma, with its exact unpaid quantity, is
 H_(p_n)'(a) > sum_(S nonempty) [2|S| a^(2|S|-1) M_(q_S)(a)
                                         +a^(2|S|) J_a[q_S]]  (4)
for every actual prefix-selected p_n and every a>0. An induction from the scalar case would then prove every shifted bridge block positive. Identity (2) shows that (4), as written, is an exact reformulation of the missing next-pivot sign, NOT a proved independent estimate. Progress requires a theta-specific lower bound on the difference, not merely another proof that its source is positive. No uniform bound for that difference is presently supplied.

For a fixed real-rooted polynomial p, M_q is even at b=0. Dividing (2) by a and taking a down to zero gives
 M_p''(0)=H_p''(0)-2 sum_j M_(p/(t-r_j))(0).
Since H_p''(0)=4||(pF)'||_2^2 and M_p''(0)=2h[p], this recovers exactly the audited root-deletion identity. Thus the Hardy argument does not remove the known normalized gap; the root-deletion costs are its precise defect. Applying this endpoint passage to a varying p_n(a) additionally requires a finite coefficient limit, for example established from an invertible positive normalized prefix at a=0. Raw positive-shift prefix positivity alone does not supply that limit.

## 3. Why an entire universal-factor shortcut is unavailable for this profile

A different possible analytic approach is to write psi(u)=exp(-c cosh(2u)) U(u), then attempt to place U in an entire real-zero-preserving multiplier class. For the actual complete theta profile, U cannot be entire for any finite c, nor even holomorphic across u_*=i pi/4. This is an actual theta obstruction, not a generic-profile counterexample.

Put q=exp(2u), Theta(q)=sum_(n in Z)exp(-pi n^2 q), Re q>0. Direct differentiation of the complete theta series gives
 psi(u)=4 exp(u/2)[q^2 Theta''(q)+(3/2)q Theta'(q)].          (5)
Approach q=i+x with x>0, and let u(x)=(1/2)Log(i+x). Then u(x) tends to u_*, with |u(x)-u_*| asymptotic to x/2. Since exp(-pi i n^2)=(-1)^n, Poisson summation gives exactly
 Theta(i+x)=x^(-1/2) sum_(k in Z)exp(-pi(k+1/2)^2/x).       (6)
Differentiating the analytic identity in its right-half-plane neighborhood shows, for j=0,1,2 along this path,
 |Theta^(j)(i+x)|=O(x^(-1/2-2j) exp(-pi/(4x))).            (7)
The remaining half-integer terms are exponentially smaller, so (7) is uniform for sufficiently small positive x. Equation (5) implies
 psi(u(x))=O(x^(-9/2) exp(-pi/(4x))),                      (8)
which vanishes faster than every power of |u(x)-u_*|.

If psi extended holomorphically through u_*, its Taylor expansion and (8) would force every Taylor coefficient to vanish. It would be zero near u_*, hence identically zero by analytic continuation in the connected strip |Im u|<pi/4. This contradicts psi>0 on R. Therefore such an extension is impossible. Multiplication by exp(c cosh(2u)), an entire nonvanishing function, cannot remove this obstruction.

This rules out this particular entire-multiplier factorization criterion. It does not rule out a convolution, a strip-holomorphic factorization with controlled boundary behavior, or a different theta-specific inequality proving (4). It does not disprove RH or any bridge pivot.

## 4. Concrete remaining analytic direction

The precise target is a bound for the correlated difference in (2) on the actual prefix residuals, using the complete-theta modular identity before taking absolute values. Any Hardy-space factorization must respect the flat cusp boundary described above; treating psi as an entire Gaussian-like universal factor is invalid. The previously certified finite bridge matrices test this target but are not evidence that a uniform proof follows. No further finite ladder computation was used here.

## 5. A degree-sensitive benchmark for a proposed estimate

A tempting stronger estimate would pay the root-deletion debit by a fixed fraction of the Hardy source, independent of degree. Even the Gaussian benchmark shows that this is not a generic consequence of strong log-concavity or real-rooted residuals.

Take F(t)=exp(-t^2/2), so h[p]=integral p^2 exp(-t^2). Let p_n be the monic Hermite polynomial selected by this actual positive signed functional, and M_n=integral p_n^2 exp(-t^2). The exact norm ratio M_n/M_(n-1)=n/2 and p_n'=n p_(n-1) give integral (p_n')^2 exp(-t^2)=2n M_n. Orthogonality gives integral p_n p_n'' exp(-t^2)=0. Therefore the root-deletion sum is2n M_n, and
 H_(p_n)''(0)=(4n+2)M_n,
 2 sum_j M_(p_n/(t-r_j))(0)=4n M_n.                    (9)
The fraction of source left after paying the debit is exactly1/(2n+1), tending to zero in both parity ladders. The bridge remains strictly positive at every degree. Thus requiring a uniform positive *relative* Hardy surplus can be substantially stronger than the desired all-degree result. This does not impose the Gaussian rate on actual theta; a viable theta-specific estimate may have a shrinking, explicitly controlled surplus rather than a fixed fractional gap.
