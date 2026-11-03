# Independent audit of the uniform `N=1` modular tilt certificate

## Verdict

**PASS**, with the narrow scope stated by the source note.

For the actual complete-theta profile, the frozen Arb certificate proves
uniformly on

\[
 0<a\leq {1\over4}
\]

both the correlated opposite-tilt inequality required by the exact `N=1`
commutator bridge and the current-prefix condition `s_1>0`.  Since `s_0>0`
is automatic for `a>0`, this proves that the complete archived integrated
commutator satisfies

\[
 \mathcal C_1<0\qquad(0<a\leq1/4).
\]

The conclusion is the sign of the archived **unpaid commutator defect**.  The
next pivot `s_2` is absent.  The result proves no next-pivot payment, no
all-degree statement, and no statement about RH.

## 1. Exact algebra and factors

Write

\[
 I_b=\int_0^\infty h e^{2bh}\psi^2\,dh,
 \quad P_b=\int_0^\infty e^{2bh}\psi^2\,dh,
 \quad J_b=\int_0^\infty h e^{2bh}\psi^2v'\,dh,
\]

where `v=-psi'/psi`.  The checker never divides by `psi`, because

\[
 \psi^2v'=\psi'^2-\psi\psi''.
\]

For `a>=0`, let `I_e,I_s,J_e,J_s` denote the even and divided-odd
combinations in the source note, so that

\[
 I_{\pm a}=I_e\pm aI_s,
 \qquad J_{\pm a}=J_e\pm aJ_s.
\]

If `F(a)` is the left side minus the right side of the desired tilt
inequality and `Q=c/4-aP_{-a}`, direct expansion gives

\[
\begin{aligned}
 {I_{-a}\over a}F(a)
 &= {I_{-a}J_a-I_aJ_{-a}\over2a}
    -{I_a-I_{-a}\over a}Q\\
 &=I_eJ_s-I_sJ_e-2I_sQ=:R(a).
\end{aligned}
\]

Thus there is no lost factor two or expectation quotient.  For `a>0`,
`I_{-a}>0`, so `R(a)<0` is exactly the required strict inequality.

The independent audit also rederived the prefix formula.  With

\[
 L_s=\int_0^\infty h\psi'^2{\sinh(2ah)\over a}\,dh,
 \qquad
 P_e=\int_0^\infty\psi^2\cosh(2ah)\,dh,
\]

the previously audited half-line identity

\[
 s_1=K_a-K_{-a}-a(P_a+P_{-a})-a^2(I_a-I_{-a})
\]

reduces exactly to

\[
 {s_1\over2a}=L_s-P_e-a^2I_s.
\]

The divided quantities have ordinary entire limits at `a=0`.  The certificate
includes those limits to avoid a numerical singularity, while the modular
claim itself correctly remains restricted to `a>0`.

## 2. Complete theta and orbit-tail audit

On the positive half-line the source uses

\[
 \psi(h)=e^{h/2}\sum_{n\geq1}P_0(z_n)e^{-z_n},
 \qquad z_n=\pi n^2e^{2h},
 \qquad P_0(z)=8z^2-12z.
\]

Differentiation gives

\[
 P_{j+1}=\left({1\over2}+2z{d\over dz}-2z\right)P_j.
\]

The audit recomputed

\[
\begin{aligned}
 P_1&=-16z^3+60z^2-30z,\\
 P_2&=32z^4-224z^3+330z^2-75z,
\end{aligned}
\]

and hence the absolute coefficient sums

\[
 C_0=20,\qquad C_1=106,\qquad C_2=661.
\]

The code sums orbits `1,...,8`.  For the first omitted orbit `n=9` and a
degree-`d` absolute polynomial, the consecutive-tail ratio is bounded by

\[
 \left({10\over9}\right)^{2d}e^{-19z},
 \qquad z\geq\pi.
\]

This is below `1/2` through the required maximum degree four, and both factors
decrease for later orbit indices.  The geometric tail inserted into each jet
therefore contains every orbit `n>=9`.

## 3. Rectangle coverage and the `sinhc` limit

The primary run partitions `0<=h<=2` into 4,096 closed cells and
`0<=a<=1/4` into 64 closed cells.  The exact constructions

\[
 h_i={2i+1\over4096}+[-1,1]{1\over4096},
 \qquad
 a_j={2j+1\over512}+[-1,1]{1\over512}
\]

cover those rectangles without gaps.  Every compact integrand is evaluated
on the full `h` and `a` balls and multiplied by the exact cell width
`2/4096`.  Consequently the Riemann sum is an interval enclosure of the
integral, not a midpoint quadrature assumption.

The only removable parameter quotient is evaluated as

\[
 {\sinh(2ah)\over a}=2h\,{\sinh x\over x},\qquad x=2ah.
\]

Here `|x|<=1`.  The checker retains eight positive even Taylor terms and
bounds the remainder by a geometric series whose first omitted term is
`|x|^16/17!` and whose ratio is at most `|x|^2/(18*19)<1/100`.  This
rigorously includes the `a=0` limit and introduces no division by a ball
containing zero.

## 4. Independent audit of the infinite spatial tails

Put `Z=pi*exp(4)`.  First-orbit domination on `h>=2` gives

\[
 |\psi^{(j)}(h)|
 \leq2C_j e^{h/2}z^{j+2}e^{-z},
 \qquad z=\pi e^{2h}.
\]

The factor two follows from the worst required ratio
`2^8 exp(-3Z)<1/2`.  Using

\[
 \cosh(2ah)\leq e^h,
 \qquad {\sinh(2ah)\over a}\leq2he^h,
 \qquad dh={dz\over2z},
\]

and the elementary inequalities `2h/pi<=z` and `4h^2/pi<=z^2` for
`h>=2`, the audit independently recovered all deployed majorants:

\[
\begin{array}{c|c}
 I_e&C_0^2E_5(Z)\\
 I_s&C_0^2E_6(Z)\\
 J_e&(C_1^2+C_0C_2)E_7(Z)\\
 J_s&(C_1^2+C_0C_2)E_8(Z)\\
 P_{-a},P_e&2C_0^2E_4(Z)\\
 L_s&C_1^2E_8(Z),
\end{array}
\]

where

\[
 E_m(Z)=\int_Z^\infty z^me^{-2z}\,dz
 =e^{-2Z}\sum_{k=0}^m{m!\over k!2^{m-k+1}}Z^k.
\]

For `J_e,J_s`, the coefficient `C_1^2+C_0C_2` comes from
`|psi'^2-psi psi''|`.  No sign of the curvature integrand is assumed.  The
largest primary tail radius is below `1e-127`, so the tails are negligible
relative to the certified margins but are retained rigorously.

## 5. Frozen replay and receipt integrity

The scope-wording correction is frozen in commits `24bcf89` and `b638642`.
The accepted hashes are:

```text
checker
  31cd42b5a31157b9ff885c9fd1a3117522a2f014b7bd829b14c6f6d87063794e
primary receipt
  1db1987de3a7542c5cf02e45178b5d5dd65a76c1f2bfaeaa176184d5810290e5
primary canonical payload
  f0ab78590eefb0d9c576eccdf33a95a2eaf72227b33e3bdcc28f448db11c103d
fine-grid receipt
  ba2fa918da86840db31e72decb72f49647d331c956bd180154e301403ec95855
fine-grid canonical payload
  84f9cc27fac30be3012b8310e9b3e2eb6834fd7a865ae29b55c10641888eec1c
```

The audit recomputed both embedded payload hashes.  A clean primary replay at
192 bits with the frozen 4,096-by-64 grid was byte-identical to the accepted
receipt.  It reproduced

\[
 R(a)<-0.0324959540305671279251979195532608
\]

and

\[
 {s_1\over2a}>0.3524820301013136475362860734012228.
\]

The independently finer stored run uses 8,192 spatial cells, 128 parameter
cells, and 256-bit arithmetic.  It strengthens the two margins to

\[
 R(a)<-0.0347919761057562119316488237439405,
 \qquad
 {s_1\over2a}>0.3608959927540767323721460332136460.
\]

The different grids agree in sign with wide separation.  The stored cell
arrays also reproduce the recorded worst margin and smallest prefix bound.

## Conclusion

The complete-theta `N=1` opposite-tilt blocker is discharged on the campaign
range, and the same certificate discharges the formerly separate `s_1>0`
input.  The exact commutator bridge therefore gives `mathcal C_1<0` throughout
`0<a<=1/4`.

This does not turn the negative commutator direction into a pivot theorem.
Paying that defect against the boundary/`s_2` reserve remains a separate open
problem.
