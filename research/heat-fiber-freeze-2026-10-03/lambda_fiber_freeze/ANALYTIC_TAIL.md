# Independent coarse analytic tail for the selected row

This elementary tail is deliberately coarse. It removes dependence on an unavailable historical tail archive, but leaves an enormous finite region uncovered. It does not imply a new Lambda bound.

## Proposition

Let t=24727519/200000000, 1/5<=y<=1, x>0, z=x/(4pi), and N=floor(sqrt(z+t/16)). If N>=10^20, then

\[
|H_t(x+iy)/B_t(x+iy)|>31/125=0.248.
\]

In particular H_t(x+iy) is nonzero throughout this entire infinite tail.

The normalized f, s_*, gamma and kappa below are exactly those of Polymath Theorem1.3, https://arxiv.org/html/1904.12438. The C-error uses the conservative10.50 corollary of Proposition6.6(vi), not the displayed10.44 constant.

## Finite approximant bound

We have .123<t<1/8 and z>=N^2-t/16>=N^2-1/128. Consequently x>10N^2>=10^41. Put r=t/(16N^2). Since r<1/2,

\[
\log z\ge2\log N+\log(1-r)\ge2\log N-2r.
\]

Equation(21), using (1-3y+4y(1+y)/x^2)_+<=1+8/x^2<2, gives

\[
\Re s_*\ge(1+y)/2+(t/2)\log N-\delta,
\quad
0\le\delta=t^2/(32N^2)+t/x^2<1/1000.
\]

Here t^2/(32N^2)<1/(2048N^2) and t/x^2<1/(800N^4), so the last inequality is immediate. For n<=N, define

\[
a=(1+y)/2+(t/4)\log N-\delta.
\]

Then |b_t(n)n^{-s_*}|<=n^{-a}. Since log N>=20log10>46,

\[
a>3/5+(123/4000)46-1/1000=2.0135>2,
\]

and, uniformly up to y=1,

\[
a-y>(123/4000)46-1/1000=1.4135>7/5.
\]

Equation(20) and -log(1-r)<=2r yield |gamma|<=exp(.02+r)N^{-y}<2N^{-y}. Equation(22) gives |kappa|<1/N^2. The function log N/N^2 decreases for N>=10^20 and is less than1/2 there; hence N^{|kappa|}<exp(1/2)<2. Therefore

\[
|\gamma|N^{|\kappa|}<4N^{-y}\le4\cdot10^{-4}.
\]

The elementary sum/integral estimates

\[
\sum_{n=2}^{\infty}n^{-2}\le2^{-2}+\int_2^\infty u^{-2}du=3/4,
\]

\[
\sum_{n=1}^{\infty}n^{-7/5}
\le1+2^{-7/5}+(5/2)2^{-2/5}<4
\]

then imply, with kappa retained,

\[
|f-1|<3/4+16\cdot10^{-4}=0.7516.
\]

They also bound the positive coefficient sum in equation(23) by

\[
S=\sum_{n\le N}(1+|\gamma|N^{|\kappa|}n^y)
b_t(n)n^{-\Re s_*}<7/4+0.0016<2.
\]

## Effective errors

Since z>N^2/2 and z>2, for every n<=N,

\[
|\log(z/n^2)|\le\log z<\log x.
\]

On x>=10^41, both (log x)^2/x and log x/x are decreasing, and log(10^41)=41log10<100. Also x-6.66>x/2. Thus the exponential argument in equation(23) is smaller than

\[
\frac{2(10000/1024+626/1000)}{10^{41}}<10^{-39}.
\]

Using exp(u)-1<=2u for0<=u<=1/2 gives e_A+e_B<4*10^-39.

For the C-error, its prefactor is bounded by

\[
z^{-(1+y)/4}\le z^{-3/10}
\le2^{3/10}N^{-3/5}<2\cdot10^{-12}.
\]

Discard the nonpositive heat exponent. The first positive correction is at most

\[
\frac{1.24(3^y+3^{-y})}{N-1/8}
<10/N\le10^{-19}.
\]

For the second, use pi<4, |log z+i pi/2|<=log z+pi/2, and x-12>x/2. It is less than

\[
\frac{2(3\log x+17)}x
\le\frac{634}{10^{41}}<10^{-38}.
\]

The total positive exponent is <10^-18, whose exponential is <2. Therefore e_C,0<4*10^-12 and the complete effective error is <5*10^-12.

By Theorem1.3,

\[
|H_t/B_t|>1-0.7516-5\cdot10^{-12}>31/125.
\]

All points are within the theorem domain0<t<=1/2,0<=y<=1,x>=200. B_t is nonzero there by its explicit M_t definition. This proves the proposition.

## Scope

The result handles every continuous x and y satisfying N>=10^20, including both sides of all later index changes. No phase sample, RH assumption, finite-height verification, or historical numerical certificate enters this tail argument. The remaining finite region still stretches from N690988 to N10^20-1. The much stronger historical N54800000 tail can replace this only after its actual certificate and domain are verified.

## Smaller safe cutoff from the same estimates

In fact N>=10^17 is sufficient, with the weaker conclusion |H_t/B_t|>43/500=.086. Here are all changed constants; the formulas and monotonicity arguments above are unchanged.

- log N>=17log10>39.1, so a>1.801325>9/5 and a-y>1.201325>6/5.
- An outward-rounded50-digit evaluation certifies
  sum_{n=2}^8 n^(-9/5)+(5/4)8^(-4/5)<.893628315<.9.
  The integral test therefore gives sum_{n=2}^infinity n^(-9/5)<.9.
- sum_{n=1}^infinity n^(-6/5)<=1+2^(-6/5)+5*2^(-1/5)<13/2.
- N>=10^17>2000^5 implies N^(-1/5)<1/2000. Thus the reflected-ladder term is <(4/2000)(13/2)=.013, and |f-1|<.913. The positive sum S in equation(23) is still <1+.913<2.
- x>10N^2>=10^35, and log(10^35)<100. The equation(23) argument is <10^-33 and e_A+e_B<4*10^-33.
- N^(-3/5)<=10^(-10.2)<10^-10. The C-error prefactor is <2*10^-10. Its positive exponent is <10^-16+634/10^35<10^-15, whose exponential is <2. Thus e_C,0<4*10^-10.
- The full error is <5*10^-10, and 1-.913-5*10^-10>43/500.

This is the cutoff used in the current ledger. The unfilled finite region remains N690988 through N10^17-1; there is still no global Lambda conclusion.

For completeness, the required monotonicities follow directly from derivatives: d(log u/u^2)/du=(1-2log u)/u^3, d(log u/u)/du=(1-log u)/u^2, and d((log u)^2/u)/du=log u(2-log u)/u^2. They are negative on all domains used here. The finite sum plus integral bounds apply at each individual integer N, uniformly, so no gap is introduced at a Riemann–Siegel seam.
