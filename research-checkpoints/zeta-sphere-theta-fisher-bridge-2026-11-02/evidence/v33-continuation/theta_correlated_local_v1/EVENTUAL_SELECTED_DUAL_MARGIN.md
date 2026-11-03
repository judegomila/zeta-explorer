# Eventual positive selected supporting-plane margin at each fixed degree

Status: independent analytic review PASS. Quantifiers are: for each fixed degree n there exists a finite shift threshold A_n. There is no fixed interior shift or degree-uniform threshold in this result.

## 1. Exact shifted family and statement

Use the complete-theta moments in the normalization of FULL_SHIFT_DEGREE9.md:

M_j(a)=∫_R u² sinhc(2au) psi(u)² g_j(u)du, a>0,
dρ_a(u)=2u²sinhc(2au)psi(u)²du/M0(a), u≥0.

The local g_j do not change with a. For n=epsilon+2N, let
p_(n,a)(t)=Σ_(i=0)^N c_i(a)t^(epsilon+2i), c_N=1,
be selected by the actual lower-parity moment inverse. Define f_(n,a)(u)=Σc_i(a)c_k(a)g_(epsilon+i+k)(u). The selected supporting-plane dual subtracts the corresponding known zero-mean cross densities, just as in SELECTED_ORTHOGONALITY_DUAL.md.

For every fixed n, there exist A_n<∞ and delta_n>0 such that for all a≥A_n,

inf_(u≥0) f_(n,a)(u) ≥ delta_n a^(2N)>0.                    (1)

Thus even the uncorrected choice of supporting-plane coefficient zero succeeds eventually, and the optimized margin is at least this large. The actual prefix inverse is used throughout. The proof below supplies an explicit positive formula for delta_n, but does not evaluate an explicit numerical A_n or prove a useful uniform rate for A_n as n grows.

The integrated norm is in the original signed moment family, not an auxiliary positive-parent norm. This is a stronger local property in a large-shift regime already known to have positive integrated norms by the exterior argument; it does not enlarge known zero-free scope.

## 2. Full-theta gamma concentration

Put Z=pi exp(2u). The exact first-orbit factorization is

psi(u)²=64 pi^(−1/2) Z^(9/2) exp(−2Z) F(Z),
F(Z)=(1−3/(2Z))²(1+r(Z))²,
r(Z)=Σ_(m≥2) m²(2m²Z−3)/(2Z−3) exp[−(m²−1)Z].

F is positive and bounded above and below on Z≥pi, and F(Z)=1+O(1/Z). The transformed unnormalized rho_a density is exactly a positive constant times

log(Z/pi) Z^(a+7/2) exp(−2Z) F(Z)
                [1−(Z/pi)^(−2a)] dZ, Z≥pi.                (2)

Specifically the omitted constant is (8/a)pi^(−a−1/2), which cancels in normalized expectations. This expression retains both branches of sinh and the complete orbit sum.

For every fixed integer j≥0, the reference gamma-log integrals yield

E_(rho_a)[Z^j]=(a/2)^j[1+O_j(1/a)].                        (3)

One direct justification extends the reference integral without F and without the negative sinh branch to (0,∞). If alpha=a+9/2, this integral is

Γ(alpha+j)2^(−alpha−j)[digamma(alpha+j)−log(2pi)].

For sufficiently large a it is positive. The omitted interval (0,pi) is negligible compared with this gamma term. Multiplication by F=1+O(1/Z) changes ratios by O(1/a). The negative branch is also negligible: its factor replaces Z^a by pi^(2a)Z^(−a), and its integral over Z≥pi is at most polynomial-in-a times pi^a, whereas the gamma term grows like Γ(a+9/2)2^(−a)log a. The same statements hold after multiplying by any fixed Z^j. Gamma ratios for integer j and digamma(alpha)=log alpha+O(1/alpha) give (3).

The standard asymptotics used here are recorded in NIST DLMF 5.11.2 and 5.11.13: https://dlmf.nist.gov/5.11.E2 and https://dlmf.nist.gov/5.11.E13. No zero-location hypothesis is involved.

The already-derived full-theta local moment asymptotic is

g_j(u)=[(2j)!/j!]Z^j+O_j(Z^(j−1)), j≥1.

The error can be bounded in that form on all Z≥pi by continuity on the remaining compact interval. Consequently

M_j(a)/(M0(a)a^j) → (2j−1)!!, with error O_j(1/a).           (4)

All degrees in (3)–(4) are fixed before taking a→∞.

## 3. The actual selected coefficients converge to Hermite coefficients

Rescale t=sqrt(a)x. The finite lower moment matrix, after congruence and normalization by M0(a), converges entrywise to the corresponding standard-normal Gaussian Gram matrix by (4). That limit is positive definite. Therefore the actual lower inverse exists for all sufficiently large a and converges to the Gaussian inverse. This conclusion is independent of the next target moment's sign.

The scaled monic residual

a^(−n/2)p_(n,a)(sqrt(a)x)

converges coefficientwise to the probabilists' monic Hermite polynomial He_n(x), with fixed-degree error O_n(1/a). Writing h_i for its coefficient of x^(epsilon+2i), this means

c_i(a)/a^(N−i)=h_i+O_n(1/a),
h_0=(−1)^N n!/(2^N N!) ≠0.                                (5)

Only lower moments through index n−1 enter the inverse used in (5). The Gaussian limit is a consequence of the complete theta weight (2), not a substitution of a Gaussian profile for theta.

## 4. Compact region and positive local tail

Choose a finite R_n so that on u≥R_n the normalized local matrix satisfies

D(Z)^(-1)[g_(epsilon+i+k)(u)]_(i,k=0..N)D(Z)^(-1) ≥ eta_n I,
D_ii(Z)=Z^(i+epsilon/2).                                    (6)

Such an R_n exists by the local moment asymptotic: the matrix on the left tends to
B_n=[d_(epsilon+i+k)], d_j=(2j)!/j!,
a positive Gaussian Gram matrix (variance2). For a fully specified positive constant one may take

eta_n=(1/2) det(B_n)/(trace B_n)^N>0,

and choose R_n large enough for the operator-norm error to be below eta_n. This is a fixed-degree local tail argument; no integrated target positivity is assumed. Existing quantitative local-tail bounds can furnish an effective but potentially very large R_n.

On the compact interval [0,R_n], equations (5) and continuity of the finitely many local moments give uniformly

f_(n,a)(u)/a^(2N) → h_0² g_epsilon(u).

Here g0=1 and the independently established theta curvature gives g1>17/2. Thus, writing m_0=1 and m_1=17/2, for all sufficiently large a,

f_(n,a)(u)≥(h_0² m_epsilon/2)a^(2N), 0≤u≤R_n.             (7)

On the tail (6) gives, for the same actual coefficient vector,

f_(n,a)(u)≥eta_n Σ c_i(a)² Z^(2i+epsilon)
           ≥eta_n c_0(a)² Z^epsilon.

By (5), |c_0(a)|≥|h_0|a^N/2 eventually. Since Z≥pi, this gives

f_(n,a)(u)≥(eta_n h_0² pi^epsilon/4)a^(2N), u≥R_n.          (8)

Taking

delta_n=min{h_0² m_epsilon/2, eta_n h_0² pi^epsilon/4}

and a finite A_n covering the coefficient and compact-error thresholds proves (1). For n=0 and n=1 the familiar base inequalities already suffice; the argument is intended for arbitrary fixed n without extending a finite numerical ladder.

## 5. Honest remaining scope

This proves eventual positive supporting-plane margin for every fixed degree. It does not exchange quantifiers to yield positivity for every degree at a single critical or interior shift. The constants in the local Gaussian comparison can deteriorate rapidly with n, and no bound bringing A_n into 0≤a≤1/2 is established.

It also does not contradict the certified negative canonical factor at degree20,a=0: the selected coefficients change with a, and (1) has a degree-dependent lower shift threshold. No actual negative optimized dual margin with a separately positive pivot has been certified. The primary unresolved question remains a theta-specific lower bound for the selected dual throughout the critical-shift range, or a verified obstruction to that stronger sufficient condition there.
