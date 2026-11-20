# Small-value backward shear and logarithmic phase energy

Research continuation, 4 November 2026. These are analytic reductions and comparison examples for review, not a proof of the missing zeta arithmetic estimate. No historical novelty claim is made. The local mechanism is classical holomorphic factorization and zero multiplicity; the directional constants are derived below. The previous [cluster estimate](../cluster/CLUSTER_RESIDUAL.md) and its actual finite-window certificate remain unchanged.

## 1. A more specific target than uniform scan energy

Write z=x+it, F(z)=xi(1/2+z), and

$$
W(z)=\Re(F'(z)\overline{F(z)}),\qquad
Q(z)=(-W(z))_+,\qquad A(z)=W(z)/|F(z)|^2.
$$

Here F' is the holomorphic derivative. W is the same unnormalized bridge shear as before. Define a regularized negative phase and its area energy by

$$
K_\eta(z)=\frac{Q(z)}{|F(z)|^2+\eta^2},\qquad
\mathcal E_\eta(D)=\int_D K_\eta(z)^2\,dx\,dt,\qquad 0<\eta<1.
\tag{1}
$$

This is defined even at zeros and uses no known zero positions. For a fixed bounded right-half-strip rectangle D=(0,X) x (T0,T1), 0<X<1/2, assume no zeros on its top, bottom, or right edge. Zeros on x=0 are allowed. Let M_D be the number of zeros strictly inside D, with multiplicity. Then

$$
\boxed{\mathcal E_\eta(D)=\frac{\pi}{2}M_D\log(1/\eta)+O_D(1).}
\tag{2}
$$

Thus a sufficient bound is E_eta(D)=o(log(1/eta)) for each such D. A single height-independent constant is unnecessary: the bound's constants may depend on the fixed rectangle. The regularization limit must be controlled on every rectangle, however. A density-one statement in height or selected degree cannot exclude an exceptional zero.

The following equivalent small-value formulation is more directly connected to the smooth shear:

$$
V_D(r)=\int_{D\cap\{|F|\le r\}}Q(z)^2\,dx\,dt,
\qquad
\boxed{V_D(r)=\frac{\pi}{8}M_D r^4+O_D(r^{4+\alpha_D})}
\tag{3}
$$

for some alpha_D>0. Consequently V_D(r)=o(r^4) suffices. Even the strict threshold limsup_(r downarrow 0) V_D(r)/r^4 < pi/8 excludes an interior zero. This is a quantized threshold, not an established arithmetic bound for xi. These statements on an exhaustion of admissible rectangles are RH-equivalent by reflection symmetry and the known critical strip. Suitable edges exist because the zeros are discrete; their existence is not a numerical zero-free certificate for arbitrary chosen edges.

## 2. Local proof, including multiplicity and boundary zeros

The argument works for any nonzero holomorphic f on a neighborhood of the closed rectangle. At an interior zero rho of order m, put w=z-rho and write

$$
f(z)=c w^m(1+O(|w|)),\quad c\ne0,\qquad
f'(z)\overline{f(z)}
=m|c|^2|w|^{2m-2}\overline w+O(|w|^{2m}).
\tag{4}
$$

Only its real part is used, so the conjugation in (4) makes no difference to the cosine below. In polar coordinates w=u exp(i theta), the negative principal shear is

$$
m|c|^2u^{2m-1}(-\cos\theta)_+.
$$

The sublevel set |f|<=r is bracketed between disks of radii

$$
R_r(1-O(R_r)),\quad R_r(1+O(R_r)),\qquad
R_r=(r/|c|)^{1/m}.
$$

The positive-part map is 1-Lipschitz. The O(u^(2m)) remainder in (4) changes the squared negative shear by O(u^(4m-1))+O(u^(4m)); integration over u<=O(R_r) is O(r^(4+1/m)). The bracketing annulus has the same error order. The main integral is exactly

$$
m^2|c|^4\int_0^{R_r}u^{4m-1}du
\int_0^{2\pi}(-\cos\theta)_+^2d\theta
=\frac{\pi m}{8}r^4.
\tag{5}
$$

The coefficient is linear in m, not m squared. The shrinking amplitude sublevel has radius proportional to r^(1/m), which supplies the factor 1/m in the radial integral.

At a boundary zero rho=it0 of order m, factor f=(z-rho)^m h with h nonvanishing nearby. On x>0,

$$
\Re\frac{f'}f=\frac{mx}{x^2+(t-t_0)^2}+\Re\frac{h'}h
\ge -M
$$

for a finite local M. Hence Q<=M|f|^2, K_eta<=M, and the boundary-zero contribution to V_D(r) is O(r^(4+2/m)). It has no r^4 term and no logarithmic energy divergence. This is where restricting to the right of the critical line matters. No symmetry hypothesis on a general f is needed for this local boundary estimate.

There are finitely many zeros on the compact closure. Take disjoint fixed neighborhoods of their distinct locations, retaining full multiplicities. The complement has |f| bounded below. Summing (5) and the boundary estimates proves (3), with any suitably small positive alpha_D. Constants can depend on f, D, and separations between distinct neighborhoods. The coefficient is stable under exact coalescence, but this proof does not provide an error uniform over every family of nearby zeros or zeros approaching x=0. The separate cluster contour bound remains useful for such error estimates.

## 3. Layer cake converts the fourth-power law to energy

Tonelli's theorem gives the exact identity

$$
\mathcal E_\eta(D)=\int_0^\infty
\frac{4r}{(r^2+\eta^2)^3}V_D(r)\,dr.
\tag{6}
$$

Indeed (a^2+eta^2)^(-2)=integral_a^infinity 4r(r^2+eta^2)^(-3)dr, and all integrands are nonnegative. Inserting (3), the leading integral up to any fixed small r0 is

$$
\frac{\pi M_D}{8}\int_0^{r_0}
\frac{4r^5}{(r^2+\eta^2)^3}dr
=\frac{\pi M_D}{2}\log(1/\eta)+O_D(1).
$$

The remainder is bounded uniformly: 4r^(5+alpha)/(r^2+eta^2)^3 <= 4r^(alpha-1). The part r>=r0 is also uniformly bounded. This proves (2).

For the exact monomial f(z)=c(z-rho)^m on a full disk of radius R, let L=|c|R^m. The full energy is

$$
\mathcal E_\eta=
\frac{\pi m}{4}\left[
\log\left(1+\frac{L^2}{\eta^2}\right)
+\frac{\eta^2}{L^2+\eta^2}-1\right].
\tag{7}
$$

This checks the constant, multiplicity scaling, and finite-cutoff dependence explicitly. Multiplication of f by a fixed nonzero holomorphic factor changes finite-scale values and remainder constants but not the leading coefficients in (2)-(3). That invariance is not uniform in height or in a factor depending on eta. At high zeta heights, xi's very small amplitude makes this qualification essential.

## 4. A symmetric obstruction to unweighted norm estimates

Consider f_b(z)=z^2-b^2, b>0, on a fixed D=(0,X) x (-Y,Y) with b<min(X,Y). This has the centered reflection and conjugation symmetries. Its right-hand zero b is simple and off the symmetry line. Direct calculation gives

$$
W_b(x,t)=2x(x^2+t^2-b^2),\qquad
Q_b=2x(b^2-x^2-t^2)_+.
\tag{8}
$$

The entire negative pocket is the right half-disk of radius b. Its unweighted squared shear is exactly

$$
\int_D Q_b^2\,dx\,dt
=2\pi\int_0^b u^3(b^2-u^2)^2du
=\frac{\pi b^8}{12}.
\tag{9}
$$

Nevertheless, for every fixed b>0,

$$
\lim_{r\downarrow0}\frac{V_{D,b}(r)}{r^4}=\frac\pi8,
\qquad
\lim_{\eta\downarrow0}\frac{\mathcal E_{\eta,b}(D)}{\log(1/\eta)}=\frac\pi2.
\tag{10}
$$

All derivatives of f_b are uniformly bounded on a fixed compact neighborhood as b tends to zero, and f_b converges there to z^2. At b=0 the double zero lies on the boundary, W_0>=0 on x>0, and both negative statistics vanish. Thus bounded analytic source norms, or even a vanishing unweighted backward-shear norm, do not by themselves yield the required little-o estimate uniformly over this family.

The finite-resolution limitation is explicit:

$$
\mathcal E_{\eta,b}(D)\le\frac{\pi}{12}
\left(\frac{b^2}{\eta}\right)^4.
\tag{11}
$$

For fixed eta the apparent energy tends to zero as b tends to zero. Rescaling z=bw shows the exact regularization parameter is eta/b^2, with the negative pocket contained in the unit right half-disk. The b downarrow 0 and eta downarrow 0 limits cannot be exchanged. This is a comparison example, not an actual-xi or complete-theta counterexample.

## 5. A zero-safe approximation estimate

There is a constructive estimate for regularized computations that does not require a zero-free interior. Suppose on D

$$
|f-f_0|\le\delta_0,\quad |f'-f_0'|\le\delta_1,
\quad |f_0'|\le L_0.
$$

For the real two-dimensional map G_eta(u)=u/(|u|^2+eta^2),

$$
|G_\eta(u)|\le\frac1{2\eta},\qquad
\|DG_\eta(u)\|\le\frac1{\eta^2}.
$$

The tangential and radial eigenvalues of its derivative are respectively 1/(|u|^2+eta^2) and (eta^2-|u|^2)/(|u|^2+eta^2)^2. Applying the mean-value estimate and then the 1-Lipschitz positive part gives

$$
|K_\eta(f)-K_\eta(f_0)|\le
d_\eta:=\frac{\delta_1}{2\eta}+\frac{L_0\delta_0}{\eta^2},
\qquad
\left|\sqrt{\mathcal E_\eta(f)}-
\sqrt{\mathcal E_\eta(f_0)}\right|
\le |D|^{1/2}d_\eta.
\tag{12}
$$

Values and derivatives must approximate the **complete** function. Entire domain coverage, integration error, and all omitted arithmetic tails remain separate obligations. At fixed D, d_eta=o(sqrt(log(1/eta))) suffices to transfer an o(log(1/eta)) energy estimate from f0 to f. For example, delta1=O(eta), L0 delta0=O(eta^2) give bounded d_eta. A fixed truncation with fixed positive error cannot be used as eta tends to zero. This estimate controls the regularized observable without substituting approximate zeros for actual zeros.

## 6. Exact connection to the complete modular bridge

The current `relative_modular_bridge_bounds.pdf`, revision 5 (4 November 2026), defines the complete even theta profile psi, Xi(t)=xi(1/2+it), and

$$
C_x(v)=\int_0^\infty h\sinh(2xh)
\psi(h-v)\psi(h+v)\,dh,
\qquad \widehat C_x(k)=\int_{\mathbb R}C_x(v)e^{-ikv}dv.
$$

Its exact identity is W_x(t)=C_hat_x(2t). For completeness, let R_x(v)=integral_R e^(2xh) psi(h-v)psi(h+v)dh. With u=h-v, w=h+v and dh dv=du dw/2, Fourier factorization gives R_hat_x(2t)=2|Xi(t+ix)|^2. Evenness in h gives partial_x R_x=4C_x, hence C_hat_x(2t)=(1/2)partial_x|Xi(t+ix)|^2. Functional symmetry gives Xi(t+ix)=overline{F(x+it)}, so this equals Re(F' overline F), with exactly the sign and normalization used here.

The new small-value target is therefore the concrete complete-kernel inequality

$$
\int_0^X\int_{T_0}^{T_1}
\mathbf 1_{\{|\Xi(t+ix)|\le r\}}
\big[-\widehat C_x(2t)\big]_+^2\,dt\,dx
=o(r^4).
\tag{13}
$$

This identity makes the connection without identifying a selected-source norm with a logarithmic quotient. It is not a proof of (13).

The current bridge paper's all-degree regularized Schur target (27.4) retains the signed central residual, variation reserve, and repair cost. Its finite positive blocks and degree-dependent positive tails do not yet establish the full spectral sign or (13). The selected-theta spread checkpoint proves a density-one macroscopic source law, explicitly leaving microscopic concentration and exceptional degrees uncontrolled. The near-line sampling checkpoint controls specified occupancy/far-crowding averages, explicitly leaving sub-spacing and residual-ratio costs. None supplies the level-dependent estimate (13). The family (8) illustrates why simply dropping its small-value restriction loses the needed information; it does not refute estimates using theta's additional arithmetic structure.

## 7. What the existing arithmetic does give

The local proof also applies with a fixed nonnegative continuous weight omega, smooth near every interior zero: the coefficients in (2)-(3) become respectively (pi/2) sum m_rho omega(rho) and (pi/8) sum m_rho omega(rho). The weights below meet these requirements; their behavior at the boundary is harmless because they are bounded there.

Take D_T=(0,1/2) x (T,2T), with T and 2T not zero ordinates, L=log T, and

$$
\omega_{p,\alpha,T}(x)=x^p e^{\alpha xL},\qquad p>0,\quad \alpha<8/7.
$$

The known zero-free edge Re(s)=1 permits X=1/2 here. The previous near-line checkpoint, `ACTUAL_SAMPLED_OCCUPANCY_AND_DISPLACEMENT_MOMENTS.md`, proves from the Baluyot zero-density input that

$$
\sum_{\substack{T<\gamma<2T\\b=\beta-1/2>0}}
m_\rho b^p e^{\alpha bL}\ll_{p,\alpha}T L^{1-p}.
\tag{14}
$$

For alpha<0 one can simply use its alpha=0 case. The input is N(1/2+a,2T)<=C_c TL exp(-caL), for any fixed 0<c<8/7. For 0<=alpha<c, ordinary positive layer cake gives (14): integrate [p a^(p-1)+alpha L a^p] exp(-(c-alpha)La) against C_c TL. The resulting constant is Gamma(p+1)c/(c-alpha)^(p+1). No limit p-to-infinity or endpoint alpha=8/7 is asserted.

Combining (14) with the weighted local law yields an actual arithmetic upper bound on the logarithmic energy coefficient:

$$
\lim_{\eta\downarrow0}\frac1{\log(1/\eta)}
\int_{D_T}\omega_{p,\alpha,T}(x)K_\eta(z)^2\,dx\,dt
=\frac\pi2\sum_\rho m_\rho b^p e^{\alpha bL}
\ll_{p,\alpha}T L^{1-p}.
\tag{15}
$$

This is a transfer of the already available density theorem into the new phase-energy observable. It is **not** a better zero-density theorem or the missing zero-coefficient result. Eta tends to zero at fixed T; no uniform finite-eta remainder as T grows is claimed. Even p>1 only saves powers of log T relative to T. A single exceptional zero is compatible with (15), and the factor b^p also suppresses the very near-line zeros we must exclude. Setting p to depend on T is not licensed by the fixed-p constants. In particular (15) does not establish (13).

## 8. What has advanced, and the remaining experiment

The all-scan norm obstruction has become an exact area law and a smooth, computable regularization. The missing estimate is now localized to the correlation between **small completed-function values and negative complete bridge shear**. A proof of the fourth-power little-o law, or a uniform strict bound below its first zero quantum, would finish this route. It remains unproved, and no actual-xi energy bound outside the earlier finite patch is asserted.

A productive next arithmetic test is to estimate the left side of (13) directly from the full theta kernel, retaining the small-value indicator and the signed cancellation; compare any proposed bound to (9)-(11). For certified computations, use a decreasing eta schedule with errors paid according to (12), rather than a fixed finite scan. The earlier bound K_eta<=N<=38 on its finite patch gives E_eta<=1444|D| there for every eta, but inherits its already certified local zero count and is not a global advance. No finite list of eta values certifies the eta-to-zero claim without a proved remainder or monotonicity bound of the required strength.

Validation files: `check_energy.py` uses exact rational checks and interval monomial checks; `energy-controls.json` records the replay. These tests check constants, multiplicity, the boundary sign, the counterexample, and the approximation estimate. They do not formally verify the analytic proof or test unknown actual zeta zeros. No independent external review occurred.

## Sources and scope

- [Current complete modular bridge manuscript](https://chatgpt.com/library?file_id=libfile_d5bc14afd8dc819185c40fe70653829e&account_id=personal), revision 5, equations (1.5)-(1.7), (27.2)-(27.4), and Sections 28; read for its exact normalization and current limitations. This file may receive later revisions.
- [Actual selected-source spread checkpoint](https://chatgpt.com/library?file_id=libfile_9f5631c81c488191b3191e2623cd0930&account_id=personal), `DENSITY_ONE_MACROSCOPIC_SOURCE_LAW.md` and `README.md`.
- [Near-line sampling checkpoint](https://chatgpt.com/library?file_id=libfile_80fc79fc37ac819196e2c9c8a69fad31&account_id=personal), `README.md` and `ACTUAL_SAMPLED_OCCUPANCY_AND_DISPLACEMENT_MOMENTS.md`. Its primary density input is S. A. C. Baluyot, [On the Zeros of Riemann's Zeta-function](https://urresearch.rochester.edu/fileDownloadForInstitutionalItem.action?itemFileId=183460&itemId=33320), Rochester thesis (2017), Theorem 1.2.1, printed p.16, with 0<theta<4/7. This continuation uses that already audited input and independently derives (14)-(15); it does not repeat the full thesis proof.
- J.-P. Demailly, [Complex Analytic and Differential Geometry](https://people.math.harvard.edu/~demarco/Math274/Demailly_ComplexAnalyticDiffGeom.pdf), Lelong-Poincare formula: classical context for multiplicity as concentrated mass. Equations (2)-(13) are proved here rather than attributed to that text.
- J. C. Lagarias, [On a positivity property of the Riemann xi-function](https://websites.umich.edu/~lagarias/doc/positivity.pdf), Acta Arithmetica 89 (1999), 217-234; [correction](https://doi.org/10.4064/aa116-3-5) (2005): context for the established logarithmic-derivative positivity criterion, not a novelty claim for an RH equivalence.
