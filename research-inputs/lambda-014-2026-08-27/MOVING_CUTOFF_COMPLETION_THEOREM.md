# Cap-aware parked-tube completion theorem for `Lambda <= 7/50`

## Claim boundary

This note proves an exact implication.  It does not assert that the remaining
ramp mantle has been certified.

Let

\[
 L=\frac7{50},\qquad T=\frac{33}{250},\qquad
 Y(t)=\sqrt{\frac7{25}-2t},\qquad U(t)=\sqrt{1-2t},
\]

\[
 X_a=6000000185827,\qquad X_b=60000000000156984,
\]

\[
 M=200000000,\quad q_p=26399999,\quad
 t_p=\frac{q_p}{M},\quad
 D=(X_b+1)-X_a=59993999999971158,
\]

and put `w=17/20`.  Define the continuous parked ramp

\[
 R(t)=
 \begin{cases}
 X_a,&0\le t\le t_p,\\
 X_a+D(Mt-q_p),&t_p\le t\le T.
 \end{cases}                                                \tag{1}
\]

Then `R(t_p)=X_a`, `R(T)=X_b+1`, and

\[
 w^2-\bigl(U(t)^2-Y(t)^2\bigr)
 =\frac{289}{400}-\frac{18}{25}=\frac1{400}>0.             \tag{2}
\]

## Cap-aware width lemma

In the moving-cutoff zero-flow criterion it is enough to require

\[
 w(t)^2\ge U(t)^2-Y(t)^2,                                  \tag{3}
\]

provided every zero of `H_t` in the upper half-plane has imaginary part at
most `U(t)`.

First contact cannot occur on the imaginary axis.  Indeed, the defining
kernel is positive and

\[
 H_t(iy)=\int_0^\infty e^{tu^2}\Phi(u)\cosh(yu)\,du>0
 \qquad (t\ge0,\ y\in\mathbb R).
\]

Thus a hypothetical first-contact zero on the moving floor necessarily has
strictly positive real part.

To see this, suppose `x+iY(t)` is a hypothetical first-contact zero on the
moving floor, where `0<x<R(t)`.  For any competing zero above the floor,
use evenness and conjugation to choose its representative with nonnegative
real part.  Minimality excludes that representative from `0<=x_k<=R(t)`,
while side-tube nonvanishing excludes it from
`R(t)<=x_k<=R(t)+w(t)`.  Consequently

\[
 |x_k|\ge R(t)+w(t),\qquad
 |x-x_k|\ge w(t),\qquad y_k^2\le U(t)^2.
\]

Equation (3) gives

\[
 y_k^2\le (x-x_k)^2+Y(t)^2,                                \tag{4}
\]

which is exactly the pairwise inequality needed in the imaginary
zero-velocity comparison of the standard first-contact proof.  The strict
term is not hidden in (4).  Fourfold symmetry forces, besides the contact
zero `x+iY(t)`, the three zeros

\[
 x-iY(t),\qquad -x+iY(t),\qquad -x-iY(t).
\]

In the velocity formula their respective imaginary contributions are
`-1/Y(t)=Y'(t)`, `0`, and
`-Y(t)/(x^2+Y(t)^2)<0`.  Every other conjugate pair makes a nonpositive
contribution by (4).  Hence a simple first-contact zero satisfies the
strict inequality `Im(dot z)<Y'(t)` and moves below the floor faster than
the floor itself, contradicting minimality when continued backwards.  A
multiple contact is excluded by the usual local Hermite splitting.  No
derivative of `R` is used.

For the Riemann xi heat flow, de Bruijn strip contraction supplies
`U(t)=sqrt(1-2t)`.  Thus (2) binds `w=17/20` to the lemma with strict margin.

## Boundary-mantle reduction

For every ramp time `t in [t_p,T]` define

\[
 S_t=\{x+iy:R(t)\le x\le R(t)+w,\quad Y(t)\le y\le9/10\}.
\]

If `H_t` is nonzero on the bottom and the two vertical faces

\[
\begin{aligned}
 \mathcal B&:\ y=Y(t),\quad R(t)\le x\le R(t)+w,\\
 \mathcal V_-&:\ x=R(t),\quad Y(t)\le y\le U(t),\\
 \mathcal V_+&:\ x=R(t)+w,\quad Y(t)\le y\le U(t),
\end{aligned}                                               \tag{5}
\]

then the zero count in `S_t` is constant on `[t_p,T]`.  Here

\[
 U(t)^2\le U(t_p)^2=\frac{73600001}{100000000}<\frac{81}{100},
\]

so the `y=9/10` top face and the portions of the vertical faces above `U(t)`
are zero-free by strip contraction.  The certified parking box makes
`S_{t_p}` zero-free, so every ramp cross-section `S_t` is zero-free.
This boundary argument is useful computationally, but it does not make the
bottom face alone sufficient: both vertical faces in (5) remain mandatory.

## Exact imported and newly certified pieces

The following implications are sufficient:

1. The published Platt--Trudgian RH verification through height
   `3000175332800` makes the initial left region
   `0<=x<=X_a`, `y>=Y(0)` zero-free.  Indeed,

   \[
   H_0(x+iy)=\frac18\xi\!\left(\frac{1-y+ix}{2}\right).
   \]

   For `0<x<=X_a` and `Y(0)<=y<=1`, a zero would have
   `gamma=x/2<=X_a/2` and `beta=(1-y)/2<1/2`, contradicting the published
   verification that every zero through that height lies on the critical
   line.  The exact height slack is `350479773/2`.  At `x=0`, xi is
   zero-free on the corresponding real segment; `y>1` is excluded by the
   classical critical-strip location of xi's zeros.
2. `parking_barrier_v2` proves

   \[
   H_t(x+iy)\ne0
   \quad(X_a\le x\le X_a+1,\ 12649/100000\le y\le1,
          \ 0\le t\le T).                                  \tag{6}
   \]

   Hence it contains the complete parked side tube through `t=t_p`:
   `w=17/20<1`, and its moving floor is above the certified floor because

   \[
   Y(t_p)^2-(12649/100000)^2=\frac{2899}{10^{10}}>0.
   \]
3. The published Polymath final-region row with
   `X=X_b`, `t_0=T`, `y_0=12649/100000` verifies the final-time right region

   \[
   x\ge X_b+\sqrt{1-(12649/100000)^2},\qquad
   \frac{12649}{100000}\le y\le U(T).                       \tag{7}
   \]

   Heights above `U(T)` are already zero-free by strip contraction.  Since
   `0<1-(12649/100000)^2<1`, (7) starts strictly before
   `R(T)=X_b+1`.  Also

   \[
   Y(T)^2-(12649/100000)^2=\frac{2799}{10^{10}}>0,           \tag{8}
   \]

   so its vertical range contains the exact terminal floor.

Consequently the only new global hypothesis still needed by this theorem is

\[
 \boxed{H_t(z)\ne0\quad
 (z\in\mathcal B\cup\mathcal V_-\cup\mathcal V_+,
  \ t_p\le t\le T).}                                      \tag{9}
\]

All endpoints, corners, and Riemann--Siegel seams are included as closed
parts of the still-open obligation (9); this sentence does not certify them.

## Completion implication

If (9) is certified, the cap-aware first-contact argument clears the whole
left canopy at time `T`; the published right region clears its complement.
Therefore `H_T` has no zero with `|Im z|>=Y(T)`.  De Bruijn contraction for
an additional time `Y(T)^2/2` makes all zeros real, and hence

\[
 \boxed{\Lambda\le T+\frac{Y(T)^2}{2}
 =\frac{33}{250}+\frac1{125}=\frac7{50}=0.14.}             \tag{10}
\]

The present promotion state is deliberately

```text
CAP_AWARE_MOVING_CUTOFF_THEOREM true
PARKING_MANTLE_CERTIFIED true
RAMP_BOTTOM_CERTIFIED false
RAMP_VERTICALS_CERTIFIED false
ALL_RAMP_SEAMS_CERTIFIED false
LAMBDA_LE_7_OVER_50 false
```
