# Boundary Weyl residues: an evaluation-Gram sign obstruction

## 0. Scope and outcome

This note tests whether the conditional all-critical-line realization of the
finite Weil matrix as a positive zero-evaluation Gram forces the boundary
Weyl residues

\[
 w_j=\langle\eta,v_j\rangle\langle v_j,e_0\rangle
\]

to be positive.  It does not.  An exact `N=1` model below is assembled from
real Fourier evaluations at a reflected multiset with integer
multiplicities.  Its complete matrix is positive definite, commutes with
inversion, and has the exact source Cauchy form and rank-two displacement.
Nevertheless, one of its two even boundary residues is strictly negative.

This is a logical obstruction to deriving the residue signs from positive
evaluation-Gram, Loewner, or Cauchy structure alone.  The model is not the
zeta-zero multiset and makes no assertion about the signs for the actual
finite Weil matrix.  Using the evaluation-Gram representation for the
actual zeros remains conditional on the all-critical-line target branch;
it is not used here as an unconditional positivity input.  No zero table is
used, and no sector floor, relative residual--gap estimate, determinant
limit, or Riemann-hypothesis conclusion is proved.  The formal project
state remains `P0_INVALIDATED`.

## 1. Exact centered evaluation rows

Take `L=2*pi` and the three centered source modes

\[
 \phi_n(x)={(-1)^n\over\sqrt{2\pi}}e^{inx},
 \qquad n=-1,0,1,
 \qquad -\pi\leq x\leq\pi,
\]

with zero extension.  For real `t`, the locked Fourier convention gives

\[
 \widehat\phi_n(t)
 ={2\sin(\pi t)\over\sqrt{2\pi}\,(t-n)},             \tag{1.1}
\]

with carrier values interpreted by continuity.  Consider the symmetric
real multiset

\[
 \Gamma=
 \{(3/4)^{[2]},(-3/4)^{[2]},(3/2)^{[1]},(-3/2)^{[1]}\}, \tag{1.2}
\]

where brackets denote integer multiplicity, and assemble the genuine
evaluation Gram

\[
 Q_{nm}=\sum_{\gamma\in\Gamma}
       \widehat\phi_n(\gamma)\widehat\phi_m(\gamma).
                                                               \tag{1.3}
\]

All rows in (1.3) are real.  A universal positive factor caused by a
different paired-slot normalization has no effect on eigenvectors or on
the residue signs.

For one positive height `t` of multiplicity `m`, its reflected pair
contributes

\[
 {2m\sin^2(\pi t)\over\pi}
 \left\{{1\over(t-n)(t-k)}
       +{1\over(-t-n)(-t-k)}\right\}                 \tag{1.4}
\]

to `Q_(nk)`.  Since
`sin^2(3*pi/4)=1/2` and `sin^2(3*pi/2)=1`, direct rational arithmetic gives

\[
 \boxed{
 \pi Q=
 \begin{pmatrix}
  {50192\over1225}&-{208\over35}&-{208\over35}\\
  -{208\over35}&{80\over9}&-{208\over35}\\
  -{208\over35}&-{208\over35}&{50192\over1225}
 \end{pmatrix}.}                                      \tag{1.5}
\]

The order in (1.5) is `(phi_-1,phi_0,phi_1)`.

## 2. Source Cauchy form and strict positivity

Put

\[
 b_{-1}={208\over35\pi},\qquad b_0=0,
 \qquad b_1=-{208\over35\pi}.
\]

Every off-diagonal entry in (1.5) is exactly

\[
 Q_{nm}={b_n-b_m\over n-m}.                            \tag{2.1}
\]

Thus the model has the source oddness `b_(-n)=-b_n`, inversion symmetry,
and the exact Cauchy commutator, not merely an arbitrary Gram
factorization.

In the normalized parity bases

\[
 e_0=\phi_0,\qquad
 e_1^+={\phi_1+\phi_{-1}\over\sqrt2},\qquad
 e_1^-={\phi_1-\phi_{-1}\over\sqrt2},
\]

write `widetilde Q=pi Q`.  Its even block is

\[
 \widetilde Q_+=
 \begin{pmatrix}
 A&c\sqrt2\\c\sqrt2&D
 \end{pmatrix},
 \quad
 A={80\over9},\quad c=-{208\over35},
 \quad D={42912\over1225}.                            \tag{2.2}
\]

The exact determinant and the odd eigenvalue are

\[
 \det\widetilde Q_+={294912\over1225}>0,
 \qquad
 \widetilde\mu_-={57472\over1225}>0.                 \tag{2.3}
\]

Since `A>0`, (2.3) proves that both parity blocks, and hence the full
evaluation Gram, are strictly positive definite.

## 3. One boundary residue is negative

The source boundary vectors have coordinates

\[
 e_0=(1,0)^T,\qquad \eta=(1,\sqrt2)^T                 \tag{3.1}
\]

in the even basis.  Their first mixed moment is

\[
 s:=\langle\eta,\widetilde Q_+e_0\rangle
 =A+2c=-{944\over315}<0.                              \tag{3.2}
\]

Let `lambda_-<lambda_+` be the two eigenvalues of
`widetilde Q_+`, with real orthonormal eigenvectors `v_-`, `v_+`.  Strict
positivity gives `lambda_->0`.  The two spectral projectors yield the exact
identities

\[
 \begin{aligned}
 w_-&=\langle\eta,v_-\rangle\langle v_-,e_0\rangle
 ={\lambda_+-s\over\lambda_+-\lambda_-}>0,\\
 w_+&=\langle\eta,v_+\rangle\langle v_+,e_0\rangle
 ={s-\lambda_-\over\lambda_+-\lambda_-}<0.           \tag{3.3}
 \end{aligned}
\]

Thus the boundary resolvent

\[
 m(z)=\langle\eta,(\widetilde Q_+-zI)^{-1}e_0\rangle
 ={w_-\over\lambda_--z}+{w_+\over\lambda_+-z}         \tag{3.4}
\]

is not a Stieltjes transform of a positive measure, despite the exact
positive evaluation-Gram origin of `widetilde Q`.

The failure is visible directly from the determinant ratio.  Equations
(2.2) and (3.1) give

\[
 m(z)={D-z-2c\over\det(\widetilde Q_+-zI)}
 ={\widetilde\mu_--z\over\det(\widetilde Q_+-zI)}.    \tag{3.5}
\]

Moreover,

\[
 \widetilde\mu_- -\operatorname {tr}\widetilde Q_+
 ={944\over315}>0.                                    \tag{3.6}
\]

Hence the odd root lies above both even roots in this model.  Positive
evaluation structure does not force parity interlacing either.

## 4. Why total positivity does not repair the argument

After a harmless row sign and removal of its positive magnitude, the
positive-height even evaluation row has the form

\[
 (1,k(t)),\qquad
 k(t)={\sqrt2\,t^2\over t^2-1}.                       \tag{4.1}
\]

For the two heights in (1.2),

\[
 k(3/4)=-{9\sqrt2\over7},\qquad
 k(3/2)={9\sqrt2\over5}.                              \tag{4.2}
\]

They lie on opposite sides of the carrier pole `t=1`.  No fixed choices
of row and column signs make both rows entrywise positive: the first row
has opposite signs while the second has equal signs.  Standard total
positivity of a Cauchy kernel on one pole-free ordered rectangle therefore
does not apply to the complete evaluation set crossing the carrier
lattice.  Row sign changes would not alter the Gram in any event.

The exact conclusion is limited but decisive: positivity of the evaluation
Gram, exact source Cauchy displacement, reflection symmetry, and integer
multiplicity do not imply `w_j>0`.  Any proof of the signs for the actual
matrix must use additional arithmetic information about the actual
ordinate distribution and its position relative to all carrier poles.
