# Uniform complete-theta certificate for the `N=1` modular commutator

## Result and scope

Let

\[
 I_b=\int_0^\infty h e^{2bh}\psi(h)^2\,dh,
 \qquad
 P_b=\int_0^\infty e^{2bh}\psi(h)^2\,dh,
\]

let `dnu_b=h exp(2bh)psi^2 dh/I_b`, and put

\[
 v=-{\psi'\over\psi},\qquad c=\psi(0)^2.
\]

The exact reduction in `MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md` left the
following correlated opposite-tilt inequality open:

\[
 {I_a\over2}
 \left(\mathbb E_{\nu_a}v'-\mathbb E_{\nu_{-a}}v'\right)
 <\left({I_a\over I_{-a}}-1\right)
 \left({c\over4}-aP_{-a}\right).                         \tag{1}
\]

The complete-orbit Arb certificate accompanying this note proves (1)
**uniformly for every**

\[
 0<a\leq {1\over4}.                                      \tag{2}
\]

It also proves the previously separate actual-prefix input `s_1>0` throughout
(2). Since `s_0=I_a-I_{-a}>0` is automatic, the exact factorization from the
full audit then gives

\[
 \boxed{\mathcal C_1<0\qquad(0<a\leq1/4)}.               \tag{3}
\]

Here `mathcal C_1` is the complete integrated modular commutator, including
the signed derivative-of-weight term. Its negative sign is the archived
unpaid commutator defect. It is **not** a next-pivot payment: (3) proves no
`s_2` sign, no all-degree result, and no statement about RH.

## 1. A cancellation-free form of the tilt inequality

Define the unnormalized curvature moment

\[
 J_b=\int_0^\infty h e^{2bh}\psi^2v'\,dh.
\]

No quotient by `psi` is needed in the checker, because

\[
 \psi^2v'=\psi'^2-\psi\psi''.                            \tag{4}
\]

For `a>=0`, introduce the even and divided-odd combinations

\[
\begin{aligned}
 I_e(a)&=\int_0^\infty h\psi^2\cosh(2ah)\,dh,\\
 I_s(a)&=\int_0^\infty h\psi^2{\sinh(2ah)\over a}\,dh,\\
 J_e(a)&=\int_0^\infty h(\psi'^2-\psi\psi'')
                  \cosh(2ah)\,dh,\\
 J_s(a)&=\int_0^\infty h(\psi'^2-\psi\psi'')
                  {\sinh(2ah)\over a}\,dh.
\end{aligned}                                             \tag{5}
\]

At `a=0`, the divided functions in (5) have their ordinary entire limits,
with `sinh(2ah)/a=2h`. Put

\[
 Q(a)={c\over4}-aP_{-a},
 \qquad
 R(a)=I_eJ_s-I_sJ_e-2I_sQ.                               \tag{6}
\]

If the left side of (1) minus its right side is denoted by `F(a)`, direct
algebra gives the exact identity

\[
 \boxed{
 {I_{-a}\over a}F(a)=R(a).}                              \tag{7}
\]

Indeed, writing `I_+/-=I_e+/-aI_s` and
`J_+/-=J_e+/-aJ_s` yields

\[
 I_{-a}J_a-I_aJ_{-a}=2a(I_eJ_s-I_sJ_e),
\]

while `I_a-I_{-a}=2aI_s`. Thus there is no subtraction of two nearly equal
tilted expectations in the certificate. Since `a>0` and `I_{-a}>0`, (1) is
equivalent to `R(a)<0`.

The primary proof run gives the uniform outward bound

\[
 \boxed{
 R(a)<-0.0324959540305671279251979195532608
 \quad(0\leq a\leq1/4).}                                \tag{8}
\]

The inclusion of `a=0` in (8) refers only to the divided continuous limit;
the raw modular normalization at `a=0` remains singular, as in the full audit.

## 2. The current prefix is positive on the same interval

Let

\[
 L_s(a)=\int_0^\infty h\psi'^2{\sinh(2ah)\over a}\,dh,
 \qquad
 P_e(a)=\int_0^\infty\psi^2\cosh(2ah)\,dh.              \tag{9}
\]

The exact half-line reduction in the full audit gives

\[
 \boxed{
 {s_1\over2a}=L_s(a)-P_e(a)-a^2I_s(a).}                 \tag{10}
\]

The same proof run certifies

\[
 \boxed{
 {s_1\over2a}>0.3524820301013136475362860734012228
 \quad(0<a\leq1/4).}                                    \tag{11}
\]

Thus (3) no longer has an unpaid `s_1>0` assumption in the range (2). The
next pivot `s_2` does not occur in (7) or (10) and remains completely open.

## 3. Complete theta enclosure

On the positive half-line, write

\[
 z_n=\pi n^2e^{2h},\qquad
 \psi(h)=e^{h/2}\sum_{n\geq1}P_0(z_n)e^{-z_n},
 \qquad P_0(z)=8z^2-12z.                                \tag{12}
\]

Successive derivatives are generated exactly by

\[
 P_{j+1}(z)=\left({1\over2}+2z{d\over dz}-2z\right)P_j(z).
                                                                    \tag{13}
\]

The checker uses (12)--(13) through `j=2`, sums orbits `1,...,8`, and encloses
every `n>=9` orbit. If `d_j=j+2`, the absolute-polynomial majorant has
successive-tail ratio at most

\[
 \left({10\over9}\right)^{2d_j}e^{-19z}<\frac12,
 \qquad z\geq\pi.                                       \tag{14}
\]

The compact spatial interval `[0,2]` is divided into 4,096 closed cells. The
parameter interval `[0,1/4]` is divided into 64 closed cells. Every displayed
integrand in (5), (6), (9), and (10) is evaluated directly on the full
spatial and parameter balls at 192-bit precision. The entire function

\[
 {\sinh(2ah)\over a}=2h\,{\sinh(2ah)\over2ah}
\]

is enclosed by eight positive Taylor terms plus a geometric remainder, so the
first parameter cell rigorously includes the limit at zero.

For the infinite spatial tail, put `Z=pi exp(4)`. The absolute coefficient
sums of `P_0,P_1,P_2` are

\[
 C_0=20,\qquad C_1=106,\qquad C_2=661.                  \tag{15}
\]

For `h>=2`, first-orbit domination gives

\[
 |\psi^{(j)}(h)|
 \leq2C_j e^{h/2}z^{j+2}e^{-z},
 \qquad z=\pi e^{2h}.                                   \tag{16}
\]

Using `cosh(2ah)<=exp(h)`,
`sinh(2ah)/a<=2h exp(h)` on (2), and `dh=dz/(2z)`, every
tail is bounded by a constant times

\[
 E_m(Z)=\int_Z^\infty z^m e^{-2z}\,dz
 =e^{-2Z}\sum_{k=0}^m{m!\over k!2^{m-k+1}}Z^k.          \tag{17}
\]

The deployed bounds are

\[
\begin{array}{c|c}
\text{quantity}&\text{tail majorant}\\ \hline
 I_e&C_0^2E_5\\
 I_s&C_0^2E_6\\
 J_e&(C_1^2+C_0C_2)E_7\\
 J_s&(C_1^2+C_0C_2)E_8\\
 P_{-a},P_e&2C_0^2E_4\\
 L_s&C_1^2E_8.
\end{array}                                             \tag{18}
\]

The largest deployed tail in the primary receipt is below `1e-127`. These
are complete all-orbit and all-space bounds; (8) and (11) are not floating
quadrature samples.

## 4. Reproduction and independent grid replay

From the checkpoint root, run

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/certify_modular_vprime_tilt.py \
  --spatial-cells 4096 --parameter-cells 64 --precision-bits 192 \
  --output workstreams/all-degree-analytic-search-next-v1/results/modular_vprime_tilt_certificate.json
```

Frozen SHA-256 values:

```text
checker
  31cd42b5a31157b9ff885c9fd1a3117522a2f014b7bd829b14c6f6d87063794e
primary receipt
  1db1987de3a7542c5cf02e45178b5d5dd65a76c1f2bfaeaa176184d5810290e5
primary canonical payload
  f0ab78590eefb0d9c576eccdf33a95a2eaf72227b33e3bdcc28f448db11c103d
```

A fresh replay with the same parameters is byte-identical. A separate
256-bit replay with 8,192 spatial cells and 128 parameter cells gives the
stronger outward bounds

\[
 R(a)<-0.0347919761057562119316488237439405,
 \qquad
 {s_1\over2a}>0.3608959927540767323721460332136460.       \tag{19}
\]

Its receipt SHA-256 is

```text
ba2fa918da86840db31e72decb72f49647d331c956bd180154e301403ec95855
```

and its canonical payload SHA-256 is

```text
84f9cc27fac30be3012b8310e9b3e2eb6834fd7a865ae29b55c10641888eec1c
```

This is an internal rigorous interval certificate and replay, not a
proof-assistant formalization or external peer review.

## Consequence

The opposite-tilt `v'` inequality is no longer the blocker at `N=1` in the
campaign range: the actual complete theta profile satisfies it with a wide
uniform margin, and the actual current prefix is positive. Therefore the
archived complete `N=1` integrated commutator is rigorously negative throughout
`0<a<=1/4`.

The modular archive explicitly treats that negative direction as an unpaid
defect. Progress toward a pivot now requires the separate boundary/next-pivot
payment comparing this defect with the `s_2` reserve. Neither the certificate
nor commutator negativity supplies that payment, and no all-degree or RH
conclusion follows.
