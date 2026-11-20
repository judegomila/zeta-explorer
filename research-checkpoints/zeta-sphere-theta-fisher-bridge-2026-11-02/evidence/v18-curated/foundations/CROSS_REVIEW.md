# Independent cross-review of parallel-lane results

2 November 2026. These are analytical checks, not numerical verification. No positivity of the unknown full Fourier transform is assumed.

## A. Head/tail polarization — PASS

Let q=psi_N and r=psi-psi_N on [0,infinity). Both profiles are smooth with every exponentially weighted derivative integrable. Their slopes are d=q'(0)>0 and e=r'(0)=-d. A and B depend linearly on the profile, whereas W=AB'-A'B is quadratic. Hence the mixed term is exactly

X(q,r)=A_q B_r'+A_r B_q'-A_q' B_r-A_r' B_q.

Use A_q=-d t^-2+O(t^-4), B_q=-2ad t^-3+O(t^-5), A_q'=2d t^-3+O(t^-5), B_q'=6ad t^-4+O(t^-6), and the same four formulas with e for r. Then

X(q,r)=(-6-6+4+4)ade t^-6+O_(a,N)(t^-8)
      =-4ade t^-6+O_(a,N)(t^-8)
      =+4ad² t^-6+O_(a,N)(t^-8).

Both self terms equal -2ad² t^-6+O(t^-8). The correction W[r]+X(q,r) to the head alone is therefore +2ad² t^-6+O(t^-8). The complete t^-6 coefficient cancels exactly. A positive tail profile need not have positive shear, and cross coupling is indispensable. These statements are for fixed a,N; constants and onset are not claimed uniform.

## B. Heat and hierarchy recurrences — PASS

Define psi_tau(u)=exp(tau u²)psi(u) and f_tau(z)=integral_0^infinity psi_tau(u)cos(zu)du. For real tau in compact intervals, theta decay dominates exp(tau u²), all u-polynomial factors, and exp(|Im z|u). Thus differentiation in tau,z and coefficient comparison are justified locally uniformly. In particular partial_tau f_tau=-f_tau''.

Let H_tau(t,a)=f_tau(t+ia) f_tau(t-ia). Direct differentiation yields

H_tt=f'' bar(f)+f bar(f'')+2|f'|²,
H_aa=-f'' bar(f)-f bar(f'')+2|f'|².

Therefore Delta H=4|f'|² and partial_tau H=(H_aa-H_tt)/2. Comparing powers in H=sum_n L_n[f](t)a^(2n) gives

(2n+2)(2n+1)L_(n+1)[f]=4L_n[f']-(L_n[f])'',
partial_tau L_n[f_tau]=[(2n+2)(2n+1)L_(n+1)[f_tau]-(L_n[f_tau])'']/2.

For M_(n,tau)(v)=integral_0^infinity h^(2n)psi_tau(h-v)psi_tau(h+v)dh, the derivative multiplier is (h-v)²+(h+v)²=2h²+2v². Hence

partial_tau M_(n,tau)=2M_(n+1,tau)+2v²M_(n,tau).

The subtraction of a second derivative does not preserve positivity automatically. These exact recurrences contain no positive-definiteness propagation theorem by themselves.

## C. Fixed Gaussian reference residual — PASS, with fixed-kappa scope

Because full psi>0, define q(h)=-psi'(h)/psi(h), an odd smooth function. Put r_kappa(h)=q(h)-kappa h, and P_v(h)=psi(h-v)psi(h+v). For n>=0, integrate the derivative of h^(2n+1)P_v(h); its boundary terms vanish by the power at zero and theta decay at infinity. Since P_v'=-[q(h-v)+q(h+v)]P_v, one obtains

2 kappa M_(n+1)(v)=(2n+1)M_n(v)-R_n(v),
R_n(v)=integral_0^infinity h^(2n+1)[r_kappa(h-v)+r_kappa(h+v)]P_v(h)dh.

For theta psi(h), its leading n=1 summand and uniformly smaller tail imply
q(h)=2pi exp(2h)-9/2+O(exp(-2h)),
so q(h)/h -> +infinity. In particular, for every K>0 there is H>1 such that q(h)>=K h for h>=H.

At v=0 the exact integration identity is
integral_0^infinity h^(2n+1)q(h)psi(h)²dh=(2n+1)M_n(0)/2.

Split this integral at H. On [0,H], q is bounded, so its absolute contribution, as well as K times the compact contribution to M_(n+1), is O_K(H^(2n+2)) (enlarge H to absorb harmless constants). On [H+1,H+2], psi² has a positive minimum, giving M_n(0)>=c_H(H+1)^(2n). The compact errors divided by M_n(0) thus tend to zero exponentially. Consequently

2K M_(n+1)(0)<=(2n+1)M_n(0)+o(M_n(0)),
limsup_n M_(n+1)(0)/(n M_n(0))<=1/K.

K is arbitrary, and the ratio is positive, so the ratio tends to zero. For every FIXED finite kappa,

R_n(0)/[(2n+1)M_n(0)]=1-2kappa M_(n+1)(0)/[(2n+1)M_n(0)] -> 1.

In particular R_n(0)>0 eventually, so -R_n cannot be positive definite at all orders: a positive-definite function must be nonnegative at zero. This refutes the specific fixed-Gaussian-reference strategy of declaring the residual -R_n positive definite. It does NOT refute all n-dependent kappa choices, different decompositions, or the desired positivity of M_n itself.

## Review limits

These checks concern the identities and obstruction statements communicated by the parallel agents. They do not certify any unpublished final prose, code, or additional claims in those lanes. Euler–Maclaurin details and any separate tail enclosure must be reviewed in their own full statement.

## D. Euler–Maclaurin tail and normalized error bounds — PASS

Reviewed modular_approximants/results.md §§3–4. For sum over n>N, the exact first-order formula is integral_N^infinity p -p(N)/2 +integral_N^infinity beta_1 p'; its plus sign is correct. Integrating the periodic Bernoulli terms by parts gives the stated negative endpoint derivatives and negative even-order remainder integral. The standard periodic-Bernoulli bound 2(2M)!zeta(2M)/(2pi)^(2M) yields the reported remainder constant after division by (2M)!.

With c=pi exp(2v), substitution x=cu² gives I_N=2exp(v/2)c^-1/2[2Gamma(5/2,cN²)-3Gamma(3/2,cN²)]=4exp(v/2)cN³exp(-cN²), as stated. The exact integral includes its signed remainder; deleting that remainder does not preserve modular jets.

The normalized uniform shear error follows by |A_f|<=F0, |A_f'|<=F1, |B_f|/a<=F1, |B_f'|/a<=F2 and the analogous tail inequalities. This produces exactly F0R2+R0F2+2F1R1+R0R2+R1². All terms in the D_N geometric-series expansion check. The gamma-integral bound for R_j follows with u^j<=j!delta^-j exp(delta u), cosh(Au)<=exp(Au), then y=exp(2u); its factor 4pi² is correct. These are absolute, not sign or relative, bounds.

## E. Moment-matched Gaussian reference — PASS

For fixed n>=0 and v tending to positive infinity, the leading theta term and h=exp(-v)s give

M_n(v) ~ 32pi^4 Gamma(n+1/2)(4pi)^(-n-1/2)
          exp((8-2n)v-2pi exp(2v)).

Indeed the product of theta profiles contributes 64pi^4 exp(9v-2pi exp(2v))exp(-4pi s²); h^(2n)dh contributes exp(-(2n+1)v)s^(2n)ds; the half-Gaussian integral contributes Gamma(n+1/2)/(2(4pi)^(n+1/2)). The constant and exponent both check.

For h<=v, the global bound psi(u)<=C exp(9|u|/2-pi exp(2|u|)), together with cosh(2h)>=1+2h², supplies a fixed Gaussian dominator in s after normalization. For h>=v, writing h=v+x bounds the integral by a constant times exp(9v) integral_0^infinity (v+x)^(2n)exp(9x-pi exp(4v+2x))dx, negligible compared with the stated main term. This justifies dominated convergence without an unproved saddle approximation.

Consequently M_(n+1)(v)/M_n(v)~(2n+1)exp(-2v)/(8pi). Let m_n=M_n(0)>0 and kappa_n=(2n+1)m_n/(2m_(n+1)). The exact residual R_n=(2n+1)M_n-2kappa_n M_(n+1) has R_n(0)=0 but R_n(v)>0 at sufficiently large v. Thus neither R_n nor -R_n is positive definite: their two-node matrices have zero diagonal and nonzero off-diagonal, hence eigenvalues plus/minus |R_n(v)|. Equivalently R_n(v)=(2n+1)m_n[M_n(v)/m_n-M_(n+1)(v)/m_(n+1)]. This refutes that specific moment-matched signed-residual propagation strategy, not positivity of M_n itself.

## F. Adaptive finite-theta cutoff thresholds — algebra and scope PASS

Let n=N+1, P=pi n², t=rP, with r in a fixed compact subset of (0,infinity), and bounded a. The omitted first theta mode on u=x/(2P) has leading measure 4P exp(-P)exp(-x)dx. Its cosine transform is

F(z)=16P³exp(-P)/(4P²+z²).

The first omitted mode's lower-order polynomial factors and scaled exponential expansion contribute O(exp(-P)) to the transform, and O(exp(-P)P^-j) to its j-th spectral derivative. All subsequent theta indices are suppressed by exp(-pi(2n+1)) times polynomial factors. A rigorous full proof must retain domination for the scaled tails and the quoted derivative orders; the modular worker is supplying that proof. Algebraically, at z=t=rP,

F=16Pexp(-P)/(4+r²),
F'=-32r exp(-P)/(4+r²)²,
F''=-32(4-3r²)exp(-P)/(P(4+r²)³),
F'^2-FF''=512(4-r²)exp(-2P)/(4+r²)^4.

Taylor expansion in bounded a therefore predicts, uniformly down to a=0 after normalization,

W_tail/a=512(4-r²)exp(-2P)/(4+r²)^4+O(exp(-2P)/P).

To validate uniformity, estimate W/a via its analytic even-power expansion or integral derivative in a; never divide an a-independent O remainder by a. Derivative control through order four is sufficient for the bounded-a leading error, with the same decay structure.

Full Xi and its needed derivatives have bounds polynomial(P)exp(-pi rP/4) in the fixed horizontal strip. Hence for r>4/pi with a fixed positive margin, they are exponentially smaller than the omitted-tail transform; exact polarization then transfers the displayed leading shear to the retained head. Thus, AWAY FROM THE BOUNDARIES:

r>2, equivalently (N+1)²/t<1/(2pi): adaptive retained head is negative;
4/pi<r<2, equivalently 1/(2pi)<(N+1)²/t<1/4: retained head is positive but exponentially larger than the complete shear.

No sign follows at r=2, where the leading coefficient vanishes. No dominance follows at r=4/pi from exponential rates alone. This is a scaling classification of a truncation artifact, not a full-kernel sign theorem.

### F.1 Explicit domination and uniform-shift justification

For the first omitted mode, u=x/(2P) makes its exact measure

4P exp(-P)exp(-x) K_P(x)dx,
K_P(x)=[exp(9x/(4P))-(3/(2P))exp(5x/(4P))]exp(-D_P(x)),
D_P(x)=P[exp(x/P)-1-x/P]>=0.

For x>=0, |exp(-D)-1|<=D<=x²exp(x/P)/(2P), and |exp(9x/(4P))-1|<=(9x/(4P))exp(9x/(4P)). Thus, for every fixed j,A and sufficiently large P,

integral_0^infinity x^j exp(-x)exp(Ax/(2P))|K_P(x)-1|dx=O_(j,A)(1/P).

Indeed the extra exponential factors are bounded by exp(x/2) after increasing the P threshold, leaving an integrable polynomial times exp(-x/2). The factor from the j-th spectral derivative is (x/(2P))^j. Hence the transform error is O_(j,A)(exp(-P)P^-j), uniformly in real spectral frequency and |Im z|<=A. Subsequent omitted indices have P_k=pi k², and their total bounds O(P_k^(1-j)exp(-P_k)) are exponentially smaller than the stated error because P_(n+1)-P_n=pi(2n+1).

The rational leading transform has derivatives O(exp(-P)P^(1-j)) on the fixed r compact set and bounded imaginary strip. Hence the full omitted-tail transform has the same estimates through j=4. For H(a)=|f(t+ia)|², evenness gives

H_a(a)=a H_aa(0)+O(a³ sup_|b|<=A |H_aaaa(b)|).

Products of derivatives through order four give H_aaaa=O(exp(-2P)/P²). Therefore W/a=L1[f](t)+O_A(exp(-2P)/P²), uniformly for 0<a<=A. Combining with the O(exp(-P)P^-j) transform errors yields the claimed O(exp(-2P)/P) remainder in the leading normalized shear. This supplies the derivative-uniformity check missing from a purely formal Laplace expansion.

## G. Phase-aware relative sign certificate — PASS with outward derivative

Use an outward holomorphic derivative D: D=partial_s for xi(s), s=1/2+a+it; D=i partial_z for Xi(z), z=t+ia. The shear is Re[(DF)overline(F)]. For a decomposition F=H+R at a point where H!=0, define

q=(DH)/H, mu=Re q, e=R/H, d=(DR-qR)/H.

If |e|<=rho<1 and |d|<=eta, then F!=0 and

(DF)/F=q+d/(1+e),
Re[(DF)/F]>=mu-eta/(1-rho).

Thus mu(1-rho)>eta proves strict positive shear. This is sharp given only the independent complex disk bounds: choose e=-rho and d=-eta, both real. The strict criterion necessarily has mu>0. Non-strict versions require their corresponding weak inequalities and still rho<1.

Coordinate warning: for Xi and the ordinary spectral derivative prime, mu=-Im(H'/H), NOT Re(H'/H). Using Re of Xi's spectral logarithmic derivative would test the wrong direction. Multiplication of the residual derivative by i does not change its absolute norm, but q and its phase orientation must be changed consistently.

## H. Interval-certified ratio-kernel counterexample — PASS

Reviewed the active Simpson version of hierarchy/certify_ratio.py. Its five psi derivative polynomials were reproduced independently by exact symbolic differentiation using
p_(j+1)(r)=(1/2-2r)p_j(r)+2r p_j'(r), p_0=2r²-3r.
All coefficients match. Product fourth derivatives and derivatives of h^k agree with Leibniz's rule. Each Simpson panel has error bounded by sup|f''''|d^5/2880, enclosed with interval arithmetic. Nodes/endpoints are dyadic. The ordinary mpmath quadrature estimate only controls the requested adaptive tolerance and does not enter the enclosure's correctness.

For the omitted theta indices n>=7, the largest absolute polynomial coefficient sum is below 10000 before the factor 4, and (1+r n²)^6<=n^12(1+r)^6. With r>=pi, the remaining uniform scalar bound is 40000 sum_(n>=7) n^12 exp(-pi(n²-1)). Successive terms have ratio at most (8/7)^12exp(-15pi)<1/2. Since 7^12<2*10^10, pi>3 and exp(-144)<10^-62, the sum times 40000 is below 1.6*10^-47, safely below the code's 10^-45 envelope. This covers derivatives through order four.

For h>=4 and v<=11/8, both h-v and h+v are nonnegative, and psi(u)<=100exp(9u/2-pi exp(2u)) implies the product bound 10^4exp(9h-2pi exp(2h)). For k=8,10 the logarithmic derivative of h^k times this exponential is <=-exp(8) for h>=4. Integration is bounded by the value at 4 divided by exp(8), far below 10^-400. The code adds [0,10^-400]. Interval-ratio serialization is inflated by +/-10^-30 before the final quadratic form, safely above 40-digit endpoint conversion noise.

The resulting certified counterexample is for

g(v)=M_5(v)/M_4(v), nodes v_j=j/8 (j=0,...,11),
c=(91,-308,347,39,-445,277,277,-445,39,347,-308,91).

I independently loaded the 12 completed ratio_intervals.json enclosures and recomputed sum_(j,k)c_jc_k g(v_j-v_k) using mpmath.iv at 50 digits, including the stated serialization inflation. Result:

[-48.49466993383626546035997384877806474008930189360008684,
 -48.47370041951539087331123432591041677305682448750326696].

The whole interval is strictly negative. Thus g is not positive definite. This disproves a specific multiplicative propagation strategy asserting that M_(n+1)/M_n is always positive definite. It does NOT show that M_4 or M_5 fails positive definiteness, and does not refute RH.

Classification: independently reviewed interval computational certificate, conditional on the correctness of the installed interval arithmetic implementation. It is not a proof-assistant formalization. The exact code, inputs and interval output are available in the hierarchy directory; no acquired code or new dependency was executed.
