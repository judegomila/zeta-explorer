# Zero-confinement comparison

The saved experiment is at [zero-confinement.html](https://zeta-view.vercel.app/experiments/zero-confinement.html). It compares an exact polynomial, the first three numerically continued theta zeros, and the bridge shear near the first tracked theta zero. It does not establish a global statement about xi zeros.

## Main conclusion

A one-zero, reflection-symmetric disk gives a genuine local confinement mechanism while its zero count is preserved. The exact quartet separates three events: another zero enters the disk, two zeros collide, and the pair moves off the critical line. The one-zero hypothesis is lost before the collision. A disk can continue to confine a two-zero cluster without forcing either member onto the line.

## 1. An exact barrier in the quartic calibration

Use

\[
P_u(z)=z^4+(12u-5)z^2+12u^2-10u+4,
\qquad F_\tau(s)=P_{-\tau}(-2i(s-\tfrac12)).
\]

The fixed circle is centered at \(s=\tfrac12+i/2\), with radius \(7/20\). With \(u=-\tau\), its image is \(|z-1|=7/10\).

For this entire circle, exactly,

\[
\min |P_0|=\frac{20979}{10000}=2.0979,
\qquad
\max |P_u-P_0|=\frac{617}{25}u+12u^2.
\]

Both extrema occur at \(z=17/10\). To prove the minimum, put \(h=z-1=(7/10)e^{i\theta}\), \(c=\cos\theta\). Then

\[
|P_0|^2=\frac{49}{100}
\left(\frac{449}{100}+\frac{14}{5}c\right)
\left(\frac{149}{100}-\frac75c\right)
\left(\frac{949}{100}+\frac{21}{5}c\right).
\]

The three affine factors are positive on \([-1,1]\). The logarithm of their product is concave, so its minimum occurs at an endpoint. The endpoint moduli are 2.0979 and 3.5581. For the perturbation,

\[
P_u-P_0=u(2+12u+24h+12h^2).
\]

For \(u\ge0\), the triangle inequality gives the stated maximum, attained at positive real \(h=7/10\).

Thus Rouché's theorem applies on the full contour and for every parameter \(0\le u\le U\) provided

\[
U<u_{\rm entry}=\frac{\sqrt{443626}-617}{600}
\approx0.0817542507988577.
\]

For the concrete interval \(-0.08\le\tau\le0\), the raw margin is at least

\[
2.0979-24.68(0.08)-12(0.08)^2=\boxed{0.0467}>0.
\]

Initially the disk contains one zero. It therefore contains exactly one zero counting multiplicity throughout this interval. Reflection symmetry forces that unique zero onto the critical line.

### Event order in decreasing heat time

| Event | Heat parameter | Consequence |
|---|---:|---|
| Second zero reaches the contour | −0.0817542507988577 | Boundary winding is undefined at contact; the count changes from one to two. |
| The two positive-height zeros collide | −0.13406958403644717 | A double zero lies inside the circle. |
| Departure | Strictly below the collision parameter | The two zeros separate symmetrically off the line. |
| Final comparison frame | −0.25 | Roots are \(1/4\pm i\sqrt5/4\) and \(3/4\pm i\sqrt5/4\). |

At \(\tau=-0.1\), the disk already contains two distinct on-line zeros. This precedes the collision. A separate algebraic estimate shows that for \(0.1\le u\le0.25\),

\[
|P_u(z)|\ge
\left(\frac{17}{10}-\sqrt{\frac{13}{5}}\right)^2
\left(\frac3{10}+\sqrt{\frac65}\right)^2
\approx0.01492528>0
\]

on the full contour. The count stays two through the collision and subsequent off-line departure. The full proof and exact root expressions are saved in `dist/experiments/zero-confinement-quartic-proof.txt` and in the quartet JSON's `proofs` field.

## 2. Actual theta-family comparison

The renderer's actual normalization is \(F_\tau(s)=8H_\tau(-2i(s-1/2))\), with \(\partial_\tau F=F_{ss}/4\). The comparison follows three initial xi zeros through 241 frames to each endpoint \(-0.1,-0.2,+0.2\). Each frame includes 128-node contour measurements on the fixed radius-0.35 circle around the first initial zero.

Independent 60-digit, unshifted theta quadrature gives these root heights:

| Heat parameter | First root | Second root | Third root |
|---:|---:|---:|---:|
| 0 | 14.134725141734693 | 21.022039638771556 | 25.010857580145690 |
| −0.1 | 14.163717655758552 | 21.059827273704822 | 25.040131627390866 |
| −0.2 | 14.192732100184388 | 21.097691002699188 | 25.069369906557071 |
| +0.2 | 14.076806144224442 | 20.946690428829876 | 24.952205437445798 |

All continued branches remained resolved. The minimum conditioning indicator \(|F_s|/(|F_s|+|F_{ss}|)\) was approximately 0.39744. Their computed transverse displacement was zero; the initial seeds lie on the symmetry line, so this is not an independent exclusion of off-line or untracked zeros.

All six renderer endpoints at \(\tau=\pm0.2\) agree with the independent heights within \(1.811\times10^{-14}\). The first and third \(-0.1\) endpoints retain stopping-tolerance errors of approximately \(1.714\times10^{-9}\) and \(6.209\times10^{-10}\). Across all intermediate frames, the maximum positional Newton residual is \(1.982\times10^{-9}\). The more accurate endpoint comparisons do not certify the whole trajectory to that accuracy.

Sampled winding stayed one. The minimum normalized sampled Rouché margins were 0.580526, 0.494142 and 0.496202 for the three respective runs. These remain finite, uncertified measurements.

### A candidate estimate controlling the full contour

For radius \(r=0.35\), positivity of \(\Phi\) gives

\[
L=16\int_0^\infty u\Phi(u)\cosh(2ru)\,du,
\qquad |F'_0(s)|\le L \quad (|\Re s-1/2|\le r).
\]

With \(N\) equally spaced nodes, every point on the circle is within chord distance \(2r\sin(\pi/(2N))\) of a node. Therefore

\[
\inf_\Gamma|F_0|\ge
\min_j|F_0(s_j)|-2rL\sin\frac\pi{2N}.
\]

The whole contour and parameter interval also satisfy

\[
\sup_{s\in\Gamma,\,|\tau|\le\delta}|F_\tau-F_0|
\le8\int_0^\infty\Phi(u)(e^{\delta u^2}-1)\cosh(2ru)\,du.
\]

At 1,024 initial nodes, high-precision evaluation estimates the lower modulus by 0.00030045645. For \(\delta=0.02\), the perturbation estimate is 0.00011580648, leaving a nominal gap of 0.00018464997. For \(\delta=0.05\), the nominal gap is 0.00001079948. The conservative estimate fails for 0.1 and 0.2 even though the raw sampled margins stay positive.

**These are candidate numerical evaluations of analytic bounds, not certificates.** The 12-term theta truncation, cutoff 1.5, quadrature, and initial contour values have not been enclosed by interval bounds. The initial zero count also needs certification. The saved file does not relabel the result as rigorous because its arithmetic uses high precision.

## 3. Shear near the first tracked theta zero

At \(\tau=-0.2\), use \(t_0\approx14.192732100184394\), and probe \(s=1/2+x+it_0\). Complex Newton from an off-line seed \(\sigma=0.507\) converges to the same simple root without projecting onto the line.

| Positive offset x | \(\Re(F_s/F)\) | \(B_{.02}/.04\) | \(B_{.05}/.10\) | \(B_{.25}/.50\) |
|---:|---:|---:|---:|---:|
| 0.05 | 20.00337498 | 17.24314890 | 10.00000000 | 0.77210317 |
| 0.15 | 6.67678996 | 6.55964565 | 6.00647484 | 1.76693661 |

The negative offsets give the opposite signs. In the local simple-zero model,

\[
\Re(F_s/F)\approx\frac1x,
\qquad \frac{B_a}{2a}\approx\frac{x}{x^2+a^2}.
\]

The bridge shift must be small relative to the distance from the zero. At \(x=.05\), even \(a=.02\) understates the logarithmic derivative by about 13.8%; \(a=.25\) understates it by about 96.1%.

At the exact zero, \(F_s/F\) is undefined. Symmetry gives raw \(W=0\) on the line and a finite-shift bridge near zero there; neither supplies a finite extension of the logarithmic pole.

The continuous transverse coefficient at the zero is \(|F_s(\rho)|^2\approx1.81154162402\times10^{-6}>0\). The even-minus-odd boundary-energy identity at this height agrees with its direct evaluation to roughly \(2\times10^{-15}\) in the tested normalized quadrature. This is local numerical evidence, not a global shear or tail estimate.

## Reproduction and scope

From the repository root:

```sh
node scripts/compare-zero-confinement.mjs --reference
```

The reference step requires Python and mpmath. Omitting `--reference` recomputes the JavaScript experiments and leaves independent reference fields empty, instead of carrying forward stale checks. The individual generators live in `scripts/experiments/`. Every generated dataset records SHA-256 hashes of its evaluated numerical source files.

The app's root equation is \(\rho'_\tau=-F_{ss}/(4F_s)\); it is singular at a multiple zero. Displayed velocities always use increasing \(\tau\), while the quartet experiment travels toward decreasing \(\tau\). An outward reverse-time trajectory is consistent with a negative displayed forward-time derivative of squared distance.

References: [Rouché and the argument principle, NIST DLMF](https://dlmf.nist.gov/1.10); [polynomial heat-zero dynamics, Tao](https://terrytao.wordpress.com/2017/10/17/heat-flow-and-zeroes-of-polynomials/); [theta-family normalization, Polymath](https://arxiv.org/html/1904.12438v2). The new quartic circle bounds above follow by the displayed algebra.
