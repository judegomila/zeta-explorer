# Prolate secant radical and tilted-block soft-trace reduction

## 0. Scope and exact outcome

This note sharpens the transverse-radical obstruction in
`TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md`.  It proves finite
identities and qualitative source asymptotics.  It does not prove either
shifted sector sign, a relative signed leakage estimate, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or the
Riemann hypothesis.

There are four conclusions.

1. The explicit transverse Xi radical is exactly the anchor-orthogonal part
   of the first source-normalized prolate correction:

   \[
   W_\infty=-16\pi G_1+
        \left(m_2-\frac{21}{2}\right)K_\infty .       \tag{0.1}
   \]

2. The finite secant from the actual projected prolate anchor to the
   projected limiting anchor converges, with a fixed positive sign, to
   \(W_\infty/(16\pi)\) after division by \(\lambda^{-2}\).  This gives a
   source-reconstructible transverse vector without transferring a
   beyond-all-orders energy between two merely close unit vectors.

3. The complete residual-to-transverse-energy ratio has an exact orthogonal
   decomposition.  Its secant coordinate is determined by one signed scalar
   leakage mismatch, while the remaining residual is an independent
   orthogonal term.  Scalar secant control alone cannot bound the complete
   residual.

4. For every finite transverse radical block, the residual-ridged soft trace
   has an exact Hilbert--Schmidt Pythagorean decomposition.  For one captured
   radical, the intrinsic soft-trace target forces

   \[
   \frac r\varepsilon=o(L^{-3/2}).                     \tag{0.2}
   \]

   The stronger \(o(L^{-5/2})\) scale belongs to the older one-threshold or
   common-floor certificate, which pays for an \(O(L)\)-dimensional trace.
   It is sufficient there, but it is not necessary for the soft trace itself.

All actual-source statements use the centered interval
`[-L/2,L/2]`, `L=2 log(lambda)`, Lebesgue measure, zero extension, reflection
as inversion, and the Fourier sign

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.       \tag{0.3}
\]

The exact Weil matrix is assembled from the pole, archimedean, and prime
blocks before any absolute value.  Every prime power
`1<n<=lambda^2` is included, and the prime block retains the minus sign from
source equation (3.19).  No zero list and no global Weil positivity are
used.  The formal project state remains `P0_INVALIDATED`.

## 1. The first correction is the transverse Xi radical

Let

\[
 K_\infty(x)={\cal E}(h)(e^x),\qquad
 G_1(x)={\cal E}(g_1)(e^x),                             \tag{1.1}
\]

with the locked source normalization.  The admitted transform formulas are

\[
 \widehat K_\infty(t)=\frac{\Xi(t)}4,
 \qquad
 \widehat G_1(t)=\frac{2t^2-21}{128\pi}\Xi(t).         \tag{1.2}
\]

The physical-space form of the second identity, proved in
`FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md`, is

\[
 \boxed{G_1=-\frac{2K_\infty''+21K_\infty}{32\pi}.}    \tag{1.3}
\]

Put

\[
 m_2=\frac{\|K_\infty'\|_2^2}{\|K_\infty\|_2^2},
 \qquad
 W_\infty=K_\infty''+m_2K_\infty.                    \tag{1.4}
\]

Integration by parts gives
`<K_infinity,W_infinity>=0`, and Fourier differentiation gives

\[
 \widehat W_\infty(t)=\frac{(m_2-t^2)\Xi(t)}4.         \tag{1.5}
\]

Multiplying (1.3) by `-16*pi` and comparing with (1.4) proves the exact
relation

\[
 \boxed{
 W_\infty=-16\pi G_1+
       \left(m_2-\frac{21}{2}\right)K_\infty.}         \tag{1.6}
\]

Consequently,

\[
 \boxed{
 P_{K_\infty^\perp}G_1=-\frac1{16\pi}W_\infty.}       \tag{1.7}
\]

The sign in (1.7) is fixed by the locked Fourier convention.  It is not an
arbitrary phase choice.

Both functions in (1.6) are exact two-sided global zero-evaluation radicals.
This follows from the codimension-two source conditions and the Mellin
factorization in `EXACT_RADICAL_LEAKAGE_IDENTITY.md`; it does not use the
location of any nontrivial zero.

## 2. The exact prolate secant and its sign

Use the Gevrey-compatible polynomial schedule

\[
 L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil,
 \qquad s=\lambda^{-2}.                                \tag{2.1}
\]

Let `C_lambda` restrict to the logarithmic interval and let `P_N` be the
orthogonal centered Fourier projection.  Write

\[
 p=P_NC_\lambda K_\lambda,\qquad
 z_0=P_NC_\lambda K_\infty,\qquad
 z_1=P_NC_\lambda G_1,                                 \tag{2.2}
\]

where `K_lambda` is the corrected global radical whose restriction is the
actual source-normalized, inversion-even producer state.  Put

\[
 a=\|p\|,qquad \kappa=p/a,qquad
 P_\kappa^\perp=I-|\kappa\rangle\langle\kappa|.        \tag{2.3}
\]

The first-order arithmetic transfer theorem, or the all-order theorem with
one retained correction, gives

\[
 p=z_0+s z_1+\rho_\lambda,
 \qquad \|\rho_\lambda\|=o(s).                        \tag{2.4}
\]

The little-oh statement is qualitative: its starting threshold is not
effective.

Define the exact finite secant

\[
 t_\lambda=P_\kappa^\perp z_0.                        \tag{2.5}
\]

Since `P_kappa^perp p=0`, equations (2.4) and (2.5) give, with no sign
ambiguity,

\[
 \frac{t_\lambda}{s}
 =-P_\kappa^\perp z_1-s^{-1}P_\kappa^\perp\rho_\lambda.
                                                               \tag{2.6}
\]

The projected anchors converge to `K_infinity`, while `z_1` converges to
`G_1`.  Equations (1.7) and (2.6) therefore prove

\[
 \boxed{
 \frac{t_\lambda}{s}\longrightarrow
       \frac1{16\pi}W_\infty.}                        \tag{2.7}
\]

In particular `t_lambda` is nonzero eventually.  If

\[
 \beta_\lambda=\|t_\lambda\|,
 \qquad \omega_\lambda^{\rm sec}=t_\lambda/\beta_\lambda,
                                                               \tag{2.8}
\]

then

\[
 \boxed{
 \frac{\beta_\lambda}{s}\longrightarrow
       \frac{\|W_\infty\|}{16\pi},
 \qquad
 \omega_\lambda^{\rm sec}\longrightarrow
       \frac{W_\infty}{\|W_\infty\|}.}              \tag{2.9}
\]

The plus sign in both limits is mandatory.  It comes from the minus sign in
(1.7) and the second minus sign in (2.6).

There is also an exact finite identity for the originally chosen radical.
With `z_W=P_N C_lambda W_infinity`, equation (1.6) gives

\[
 P_\kappa^\perp z_W
 =-16\pi P_\kappa^\perp z_1
  +\left(m_2-\frac{21}{2}\right)P_\kappa^\perp z_0.   \tag{2.10}
\]

Although the unit vectors in (2.9) and (2.10) converge to the same limit,
ordinary norm convergence does not compare their signed Rayleigh energies
relatively.  Such a transfer would require a new bound in the `B` graph
norm at the scale of an energy smaller than every algebraic power.

## 3. Exact finite scalar and orthogonal-residual decomposition

Fix one finite stage.  In the real inversion-even sector put

\[
 q=\langle\kappa,Q\kappa\rangle,
 \qquad b=(Q-qI)\kappa,
 \qquad r=\|b\|,                                      \tag{3.1}
\]

and assume the declared finite sign

\[
 B=P_{\kappa^\perp}(Q-qI)P_{\kappa^\perp}\big|_{\kappa^\perp}>0.
                                                               \tag{3.2}
\]

Decompose the projected limiting anchor along the secant:

\[
 z_0=\alpha\kappa+\beta\omega,
 \qquad \beta>0,qquad \omega=\omega^{\rm sec}.       \tag{3.3}
\]

Set

\[
 \varepsilon=\langle\omega,B\omega\rangle>0,
 \qquad d=\langle\omega,b\rangle,
 \qquad
 D_0=\langle z_0,(Q-qI)z_0\rangle.                    \tag{3.4}
\]

Direct expansion proves

\[
 \boxed{D_0=2\alpha\beta d+\beta^2\varepsilon.}       \tag{3.5}
\]

For a complex Hermitian formulation the first term is
`2 beta Re(conj(alpha)*d)`.  The locked source vectors have a common real
parity basis, so (3.5) is the operative form.

When `alpha` is nonzero, (3.5) gives

\[
 \boxed{
 \frac d\varepsilon
 =-\frac\beta{2\alpha}
  +\frac{D_0}{2\alpha\beta\varepsilon}.}              \tag{3.6}
\]

Now put

\[
 b_\perp=P_{\{\kappa,\omega\}^\perp}b=b-d\omega.     \tag{3.7}
\]

Orthogonality gives the complete residual identity

\[
 \boxed{
 \left(\frac r\varepsilon\right)^2
 =\left(
   -\frac\beta{2\alpha}
   +\frac{D_0}{2\alpha\beta\varepsilon}
   \right)^2
  +\frac{\|b_\perp\|^2}{\varepsilon^2}.}              \tag{3.8}
\]

Equation (2.9) already gives `beta=Theta(lambda^(-2))`, which is smaller
than every fixed inverse power of `L`.  Thus the actual missing information
in (3.8) is relative and signed:

\[
 \frac{D_0}{\beta\varepsilon}\quad\hbox{and}\quad
 \frac{\|b_\perp\|}{\varepsilon}.                     \tag{3.9}
\]

For the intrinsic soft-trace scale, the target exponent in (3.9) is
`L^(-3/2)`.  If one insists on the older one-threshold certificate, the
stronger target exponent is `L^(-5/2)`.  The algebraic identity (3.8) is
the same; the distinction is in which sufficient analytic criterion is
being pursued.

The scalar `D_0` retains the global-radical cancellation.  If

\[
 R_0=K_\infty-z_0,
 \qquad R_\lambda=K_\lambda-p,                         \tag{3.10}
\]

then the exact radical-leakage identity gives

\[
 \langle z_0,Qz_0\rangle={\cal W}_Z(R_0,R_0),
 \qquad
 q=\frac{{\cal W}_Z(R_\lambda,R_\lambda)}{a^2}.       \tag{3.11}
\]

Hence

\[
 D_0={\cal W}_Z(R_0,R_0)
      -\frac{\|z_0\|^2}{a^2}{\cal W}_Z(R_\lambda,R_\lambda).
                                                               \tag{3.12}
\]

This is a difference of signed leakage energies, not a difference of
positive norms.  The available separate absolute bounds, without a
comparison to `beta*epsilon`, do not control (3.12) at the required relative
scale.

## 4. Exact tilted-block Pythagoras

The scalar threshold is not the intrinsic covariance object.  The following
finite theorem keeps a whole transverse block and the complete time-band
covariance.

Let `mathcal H` be a finite-dimensional Hilbert space, let

\[
 B>0,\qquad r>0,\qquad
 S=r(B+rI)^{-1},                                      \tag{4.1}
\]

and let

\[
 {\cal A}:{\cal H}\longrightarrow{\cal Y},
 \qquad K={\cal A}^*{\cal A}.                         \tag{4.2}
\]

Let `Z:C^d -> H` be an isometry and put

\[
 E_Z=Z^*BZ,qquad K_Z=Z^*KZ.                           \tag{4.3}
\]

Define the tilted synthesis and its Gram matrix by

\[
 D=S^{-1/2}Z,qquad
 M=D^*D=I+\frac1rE_Z,                                 \tag{4.4}
\]

and let

\[
 \Pi_D=DM^{-1}D^*                                    \tag{4.5}
\]

be the orthogonal projection onto `ran(D)`.

### Theorem 4.1 (tilted-block soft-trace identity)

One has the exact decomposition

\[
 \boxed{
 \operatorname {tr}(SK)
 =r\operatorname {tr}\!\left(K_Z(E_Z+rI)^{-1}\right)
 +\left\|{\cal A}S^{1/2}(I-\Pi_D)\right\|_{HS}^2.}    \tag{4.6}
\]

In particular,

\[
 \boxed{
 \operatorname {tr}(SK)
 \geq r\operatorname {tr}\!\left(K_Z(E_Z+rI)^{-1}\right).}
                                                               \tag{4.7}
\]

**Proof.**  Put `X=A S^(1/2)`.  Then

\[
 XD={\cal A}Z.                                         \tag{4.8}
\]

Right multiplication by the orthogonal projections `Pi_D` and
`I-Pi_D` is an orthogonal decomposition in Hilbert--Schmidt space:

\[
 \|X\|_{HS}^2=\|X\Pi_D\|_{HS}^2+
                    \|X(I-\Pi_D)\|_{HS}^2.            \tag{4.9}
\]

Equations (4.5) and (4.8) give

\[
 X\Pi_D=({\cal A}Z)M^{-1}D^*.                         \tag{4.10}
\]

Therefore, by cyclicity of the finite trace,

\[
 \begin{aligned}
 \|X\Pi_D\|_{HS}^2
 &=\operatorname {tr}\left(M^{-1}K_ZM^{-1}D^*D\right)\\
 &=\operatorname {tr}(K_ZM^{-1})\\
 &=r\operatorname {tr}\left(K_Z(E_Z+rI)^{-1}\right).
 \end{aligned}                                        \tag{4.11}
\]

Finally `||X||_HS^2=tr(SK)`.  Substitution in (4.9) proves (4.6), and
nonnegativity of the second term proves (4.7).  \(\square\)

The product inside the trace in (4.6) need not be Hermitian, but its trace
is nonnegative because it equals the trace after positive square-root
congruence.

For a one-dimensional block `Z(1)=omega`, equations (4.3) and (4.6) become

\[
 \boxed{
 \operatorname {tr}(SK)
 =\frac r{\varepsilon+r}\langle\omega,K\omega\rangle
 +\left\|{\cal A}S^{1/2}(I-\Pi_{S^{-1/2}\omega})
   \right\|_{HS}^2.}                                  \tag{4.12}
\]

This exact equality is stronger than a threshold estimate.

## 5. Intrinsic and older ratio scales

Apply Theorem 4.1 with the finite time-band map `A_T`, so
`K=K_T`.  For either the fixed transverse radical or the exact secant,

\[
 \langle\omega,K_T\omega\rangle
 =\|{\cal A}_T\omega\|^2\longrightarrow c_T^2>0.      \tag{5.1}
\]

If the actual soft-trace target

\[
 L^{3/2}\operatorname {tr}\{r(B+rI)^{-1}K_T\}
 \longrightarrow0                                     \tag{5.2}
\]

holds, (4.12) and (5.1) force

\[
 \frac r{\varepsilon+r}=o(L^{-3/2}).                  \tag{5.3}
\]

The left side tends to zero, so (5.3) is equivalent to the necessary
condition

\[
 \boxed{\frac r\varepsilon=o(L^{-3/2}).}               \tag{5.4}
\]

This does not prove (5.4); it identifies the intrinsic one-radical scale.
It also does not make (5.4) sufficient, because the tilted complementary
term in (4.12) remains.

The older condition

\[
 \frac r\varepsilon=o(L^{-5/2})                        \tag{5.5}
\]

arose by bounding an `O(L)`-rank covariance trace with one common floor.
It is a valid stronger sufficient target for that certificate.  Equation
(4.6) shows when the extra factor can become intrinsic.  If a block has
`d_L` comparable to `L`, `K_Z>=cI`, and `E_Z<=epsilon I`, then

\[
 \operatorname {tr}(SK_T)
 \geq c\,d_L\frac r{\varepsilon+r}.                   \tag{5.6}
\]

Under those additional uniform block hypotheses, (5.2) does force the
`L^(-5/2)` scale.  The existing all-order radical tower is proved at every
fixed order, but no current theorem supplies these uniform growing-block
covariance and relative-energy bounds.

## 6. Rational finite-matrix obstructions

### 6.1 A scalar secant does not see the orthogonal residual

In the real orthonormal basis `(kappa,omega,e)`, take

\[
 Q-qI=
 \begin{pmatrix}
 0&2&M\\
 2&5&0\\
 M&0&7
 \end{pmatrix},
 \qquad z_0=2\kappa+3\omega.                          \tag{6.1}
\]

The complement block `diag(5,7)` is positive for every rational `M`.  The
secant data are

\[
 \alpha=2,\quad\beta=3,\quad d=2,\quad
 \varepsilon=5,\quad D_0=69,                          \tag{6.2}
\]

independent of `M`, whereas

\[
 b=2\omega+Me,qquad r^2=4+M^2.                       \tag{6.3}
\]

Thus even exact knowledge of (3.5) leaves an arbitrarily large
`b_perp`.  This is a finite rational linear-algebra obstruction, not an
arithmetic Weil matrix.

### 6.2 Source-Cauchy counter-scaling for the stronger exponent

There is also an exact rational source-Cauchy family.  For integer `L`, put

\[
 \epsilon_L=2^{-L^2},\qquad u_L=\frac{\epsilon_L}{L^2}. \tag{6.4}
\]

On indices `-1,0,1`, take

\[
 b_{-1}=u_L,\quad b_0=0,\quad b_1=-u_L,
 \qquad
 a_0=0,\quad a_{-1}=a_1=\epsilon_L+u_L,               \tag{6.5}
\]

and reconstruct

\[
 Q_{nn}=a_n,qquad
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m).             \tag{6.6}
\]

This matrix is rational, commutes with inversion, and satisfies the exact
source displacement identity

\[
 (n-m)Q_{nm}=b_n-b_m.                                  \tag{6.7}
\]

In normalized parity coordinates, with `kappa=V_0`,

\[
 Q_+=
 \begin{pmatrix}
 0&-\sqrt2u_L\\
 -\sqrt2u_L&\epsilon_L
 \end{pmatrix},
 \qquad
 Q_-=\epsilon_L+2u_L>0.                               \tag{6.8}
\]

Hence `q=0`, `B=epsilon_L`, and the residual is

\[
 r_L=\sqrt2u_L,qquad
 \frac{r_L}{\epsilon_L}=\frac{\sqrt2}{L^2}.           \tag{6.9}
\]

The normalized first even Fourier mode has fixed-window time-band mass
tending to one as `L` tends to infinity.  Indeed, its two sinc lobes are
centered at `+/-2*pi/L`, and Plancherel bounds the mass outside any fixed
`[-T,T]` by `O(1/(LT))`.  Therefore its soft contribution is asymptotic to
`sqrt(2)/L^2`, which satisfies the intrinsic target (5.2), while

\[
 L^{5/2}\frac{r_L}{\epsilon_L}=\sqrt{2L}\longrightarrow\infty.
                                                               \tag{6.10}
\]

Both `r_L` and `epsilon_L` are smaller than every fixed power of
`lambda^(-1)` when `lambda=exp(L/2)`.  Thus inversion, source-Cauchy
displacement, strict finite signs, and absolute flatness do not make the
older exponent necessary.  The parameters in (6.5) are synthetic and are
not the pinned pole--archimedean--minus-prime entries.

## 7. Non-enclosed lambda=2, N=4 reconnaissance

The following values document an exploratory reconstruction for a future
independent producer.  They are point arithmetic, not interval or ball
outputs, and they imply no asymptotic statement.

The calculation used exact text input `lambda=2`, `N=4`, the centered modes
`V_n=(-1)^n L^(-1/2) exp(2*pi*i*n*x/L)`, direct source matrix assembly, and
the recurrence prolate state.  It evaluated

\[
 m_2=
 \frac{\int_{\mathbb R}t^2|\Xi(t)|^2dt}
      {\int_{\mathbb R}|\Xi(t)|^2dt}                  \tag{7.1}
\]

by `mpmath` quadrature and reconstructed the physical radical without
numerical differentiation:

\[
 K(x)={\cal E}(h)(e^x),\quad
 G_1(x)={\cal E}(g_1)(e^x),\quad
 W(x)=\left(m_2-\frac{21}{2}\right)K(x)-16\pi G_1(x). \tag{7.2}
\]

The fixed-radical path gave

```text
m2                         10.20756475348572168886576125223755462856
||P_N C W||                1.975331878775814445647426197599746257183
||P_kappa^perp P_N C W||   1.968581475822367818426635930256382810398
r                          5.290227133180689272751283977577983577234e-5
epsilon_W                  2.049998127894838456515626441630754490878e-3
r/epsilon_W                2.58060095821320147694995243270033490755e-2
|<omega_W,b>|/r            9.653874348529036866737750904631052824112e-2
```

The exact secant `P_kappa^perp P_N C K_infinity` gave

```text
projected anchor norm a    1.415682013611064206966600843336796296949e-1
alpha                      1.408800336532379875743816311019621542555e-1
beta                       1.171655602901903008067190588507925195724e-2
lambda^2 beta              4.686622411607612032268762354031700782897e-2
epsilon_sec                3.645802622289050929144485091207088887295e-4
<omega_sec,b>              1.534064083996686862050854644399587772377e-6
r/epsilon_sec              1.451045950989845711172775810858673506347e-1
|<omega_sec,b>|/r          2.899807598760600283980239247085184333966e-2
D0                         5.511307520122616861816267973082261030351e-8
```

In (3.6), the two point terms were approximately
`-0.0415834512712360` and `+0.0457912053460672`; their cancellation gave
`d/epsilon_sec=0.00420775407483116`.  The direct check of (3.5) was
consistent at roundoff level in a 50-decimal calculation; no digits beyond
the working precision are claimed.

This path shared the repository's `mpmath` arithmetic and source/prolate
helpers, used no interval enclosure, and had no independent matrix assembly.
It is reconnaissance only.  A later producer must serialize the Xi-moment
quadrature tail, arithmetic-sum truncation, Fourier projection, complete
combined matrix, and all signed terms in (3.5) before a verifier reconstructs
them independently.

## 8. Exact next theorem and limitations

The direct covariance route is now reduced to the following source theorem.
On one common unbounded schedule, after proving both strict shifted sector
signs, construct a source-radical block `Z_L` and prove

\[
 r\operatorname {tr}\left(K_{Z_L}(E_{Z_L}+rI)^{-1}\right)
 +\left\|{\cal A}_TS^{1/2}
    (I-\Pi_{S^{-1/2}Z_L})\right\|_{HS}^2
 =o(L^{-3/2}).                                         \tag{8.1}
\]

Equation (8.1) is exactly the soft trace, not an upper bound obtained after
discarding covariance.  The secant identity (3.8) separately shows which
two relative signed quantities are needed if one continues with a scalar
residual ratio.

The admitted source inputs provide absolute flatness for every fixed radical
correction and qualitative fixed-index prolate defect ratios.  They provide
neither a signed lower bound for `E_Z`, a growing-block covariance frame, a
relative estimate for (3.12), nor control of `b_perp`.  The unconditional
prime-number-theorem lock supplies magnitude envelopes and finite moments
for the combined Chebyshev kernel, not the carrier-sensitive signed
inequalities in (8.1).

The imported exact inputs are
`P0_SOURCE_LOCK.json`,
`EXACT_RADICAL_LEAKAGE_IDENTITY.md`,
`FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md`,
`ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`,
`GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md`,
`RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md`, and
`TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md`.
