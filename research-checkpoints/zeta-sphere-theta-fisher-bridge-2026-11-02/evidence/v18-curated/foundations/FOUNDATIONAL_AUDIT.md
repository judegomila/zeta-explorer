# Foundational adversarial audit — 2 November 2026

## Result first

The manuscript's exact normalization, scalar Fourier identity, finite-cutoff obstruction, and conditional zero-exclusion implication pass independent algebraic/analytic review. This is not a positivity proof or an RH proof. A useful additional lemma below identifies the cutoff obstruction locally: the interaction kernel of an ordinarily truncated, evenly reflected theta profile has a positive |v|^5 cusp and is C^4 but not C^5 at zero. Merely reflecting a finite theta sum does not restore modular smoothness.

Source reviewed: the originating private research thread (conversation and message identifiers redacted for repository publication); manuscript `bridge_shear_vortex_positivity.tex`, Library libfile_45bd1fbffcf481918939d4c18afd8b43, materialized alongside these notes. No repository/account writes. No downloaded code executed except the recognized Library transfer helper. No numerical evidence is used below.

## 1. Normalization independently checked

Let theta(x)=sum over integers n of exp(-pi n² x). Its Jacobi transformation implies G(v)=exp(v/2) theta(exp(2v)) is even. Direct differentiation gives

psi(v)=(D²-1/4)G(v)
 =4 sum(n>=1) [2 pi² n⁴ exp(9v/2)-3 pi n² exp(5v/2)] exp(-pi n² exp(2v))
 =4 Phi(v/2).

For h(v)=G(v)-exp(v/2), initially Re(s)>1 and w=s-1/2, integration by parts and x=exp(2v) give

integral_R psi(v) exp(wv) dv
 =(w²-1/4) integral_R h(v) exp(wv) dv
 =s(s-1) Gamma(s/2) pi^(-s/2) zeta(s)=2 xi(s).

Both endpoint boundary terms vanish: at -infinity h and needed derivatives are O(exp(-v/2)), while Re(w)>1/2; at +infinity decay is faster than every exponential. Analytic continuation and evenness yield

Xi(z)=integral_0^infinity psi(v) cos(zv) dv
     =8 integral_0^infinity Phi(u) cos(2zu) du.

The constants 4 and 8 in the manuscript are correct. Jacobi evenness applies to the COMPLETE sum, not its ordinary finite theta-index truncations. All differentiated sums converge locally uniformly. On the nonnegative half-line the summands are positive since r=pi n² exp(2v)>3/2, and modular evenness extends positivity to the negative half-line.

Reference checks for standard input: NIST DLMF https://dlmf.nist.gov/20.7 (theta transformations) and https://dlmf.nist.gov/25.4 (xi definition and reflection). The displayed computation is independent, not a quotation.

## 2. Fourier identity: independent full-plane derivation

Convention: hat f(k)=integral_R f(v) exp(-ikv) dv. Since psi is even,

Xi(t+ia)=(1/2) integral_R psi(x) exp(itx-ax) dx.

Multiplying by its conjugate, then x=h-v, y=h+v (absolute Jacobian 2), gives

H(a,t)=|Xi(t+ia)|²
 =(1/2) integral_R integral_R psi(h-v)psi(h+v) exp(-2ah) exp(-2itv) dh dv
 =integral_R integral_0^infinity psi(h-v)psi(h+v) cosh(2ah) dh exp(-2itv) dv.

The last equality uses evenness in h. Differentiating in a and dividing by 2 proves

(1/2) partial_a H(a,t)=integral_R C_a(v) exp(-2itv) dv=hat C_a(2t),
C_a(v)=integral_0^infinity h sinh(2ah) psi(h-v)psi(h+v) dh.

Meanwhile E_a=A_a-iB_a gives the Cauchy–Riemann identities partial_a A=B' and partial_a B=-A', hence (1/2)partial_a H=AB'-A'B=W_a. Therefore NO additional 2, 1/2 or pi belongs in W_a=hat C_a(2t). A pi occurs only in K_a(t,t)=W_a(t)/pi.

Absolute convergence, differentiation and Fubini hold for every fixed real a: psi and all derivatives decay faster than every exponential in both directions. Indeed max(|h-v|,|h+v|)=h+|v| for h>=0; one profile supplies arbitrarily strong decay and the other is bounded. This also proves C_a is even Schwartz. C_a>0 pointwise is immediate, but does not imply hat C_a>=0.

For an ordinary half-line truncation q, the same identity still holds after replacing psi everywhere on R by q(|x|). The resulting C is not generally smooth enough to be Schwartz, even though its decay is excellent. Inserting the non-even formula q(x) itself at negative arguments is a different construction and invalidates the derivation.

## 3. Endpoint obstruction independently checked

For q=psi_N on [0,infinity), d_N=q'(0)=2 sum(n<=N) phi_n'(0), with

phi_n'(0)=exp(-r_n) r_n (-8r_n²+30r_n-15), r_n=pi n².

The n=1 term is positive and all n>=2 terms are negative. Full modular evenness makes the infinite sum zero, so d_N=-2 sum(n>N) phi_n'(0)>0 for every finite N>=1.

Repeated integration by parts in A=integral q cosh(au) cos(tu) du and B=integral q sinh(au) sin(tu) du gives

A=-d_N/t²+O(t^-4), B=-2a d_N/t³+O(t^-5),
A'=2d_N/t³+O(t^-5), B'=6a d_N/t⁴+O(t^-6).

Derivatives are estimated from their own differentiated integrals, not by unjustified differentiation of a remainder. Thus

W=AB'-A'B=-2a d_N²/t⁶+O_(a,N)(t^-8)<0

for sufficiently large |t|, for EACH fixed a>0 and finite N. No uniform onset in N or a is supplied. The manuscript's more general first-odd-jet formula also checks: if q^(2m+1)(0)=d is the first nonzero odd jet, p=2m+2, then A=c t^-p+O(t^-p-2), B=pa c t^-p-1+O(t^-p-3), c=(-1)^(m+1)d; hence W=-pa d² t^(-2p-2)+O(t^(-2p-4)). This generalization already appears in the source and is NOT new work of this audit.

## 4. Additional local cusp lemma

Let q be an ordinary finite theta profile (more generally a smooth half-line profile admitting a smooth continuation to a neighborhood of zero, with enough decaying derivatives). Write d=q'(0), q0=q(0), and use its EVEN REFLECTION in C. For small real v define the smooth even comparison

J(v)=integral_0^infinity h sinh(2ah) q(h-v)q(h+v) dh,

where only the small negative arguments use the smooth continuation. J is even because its factors interchange under v -> -v. For v>0 the exact difference is

C(v)-J(v)=integral_0^v h sinh(2ah) [q(v-h)-q(h-v)]q(h+v) dh.

Uniform Taylor expansion on 0<=h<=v gives

h sinh(2ah)=2a h²+O(h⁴),
q(v-h)-q(h-v)=2d(v-h)+O(v³),
q(h+v)=q0+d(h+v)+O(v²).

Therefore

C(v)-J(v)=4a d q0 integral_0^v h²(v-h)dh
          +4a d² integral_0^v h²(v²-h²)dh +O(v⁶)
         =(a d q0/3)v⁴+(8a d²/15)v⁵+O(v⁶).

Using evenness, near zero

C(v)=c0+c2 v²+c4 v⁴+(8a d²/15)|v|⁵+O(v⁶).

For the analytic finite theta profiles the one-sided power series justify termwise derivatives, so C is C^4 but not C^5 if d!=0; C^(5)(0+)=64a d² and C^(5)(0-)=-64a d². The sixth distributional derivative consequently has delta mass 128a d². Equivalently the cosine endpoint expansion gives

hat C(k)=-128a d²/k⁶+O(k^-8),
hat C(2t)=-2a d²/t⁶+O(t^-8),

in agreement with the independent A/B computation. This offers a LOCAL exact diagnostic of why reflection alone cannot restore positivity. A repair that actually makes the profile smooth even removes this particular obstruction, but does not prove positivity of its Fourier shear.

## 5. Zero exclusion and quantifiers

For any nonzero real entire f, set H(a,t)=|f(t+ia)|² and W=(1/2)partial_a H. If f(t0+ib)=0, b>0, multiplicity m, then

W_(b-epsilon)(t0)=-m |c|² epsilon^(2m-1)+O(epsilon^(2m))<0

for sufficiently small epsilon>0, where f(t0+ib+z)=c z^m+O(z^(m+1)). Thus W>=0 throughout 0<a<A excludes every zero with 0<Im(z)<=A; the boundary b=A is excluded by its left neighborhood as well. For Xi, every nonreal zero has |Im z|<1/2, so positivity just for 0<a<1/2 suffices; an unconditional proof outside that strip is not needed for this direction.

A countable sufficient test is positivity for a in ANY dense subset of (0,1/2) and t in ANY dense subset of R, because W is continuous. A sequence a_j decreasing only to zero is not dense in the strip and does not suffice for scalar W tests. The paper correctly distinguishes this from COMPLEX kernel diagonals, where the extra imaginary node coordinate samples all transverse scales through the averaging identity.

The complex diagonal formula also checks:
K_a(t+iy,t+iy)=[H(a+y,t)-H(a-y,t)]/(4pi y)
              =(1/(2pi y)) integral_|a-y|^(a+y) W_r(t) dr.

At a nonreal zero lambda0=t0+ib of Xi and z=lambda0-ia,
K_a(z,z)=-|Xi(lambda0-2ia)|²/[4pi(b-a)]<0
for all sufficiently small a>0. Isolation of the zero ensures strictness. Do not confuse this complex diagonal witness with W at the same a and real t: transporting scalar positivity to the complex diagonal needs positivity over the entire indicated transverse interval (or the local scalar contradiction above).

## Scope left open

No missing constant or sign was found in the foundational target. The crucial assertion hat C_a>=0 for all t and 0<a<1/2 remains unproved. Local endpoint smoothness is necessary for evading this truncation obstruction, not sufficient for RH or global positive definiteness. No factorization claim, novelty claim, formal verification claim, or numerical RH inference is made.
