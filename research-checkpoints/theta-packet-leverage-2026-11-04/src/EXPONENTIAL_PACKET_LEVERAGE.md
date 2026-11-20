# Uniform exponential loss of selected leverage for the actual mesoscopic packet hierarchy

Date: 2026-11-04. Analytic derivation with independent AI-assisted audit; not machine formalization or external peer review. This concerns the actual theta transform and the explicit exact-degree mesoscopic packets, not a surrogate matrix model. It refutes the proposed uniformly localized inverse-Gram-column bridge for this particular hierarchy. It does not refute selected derivative coherence or prove RH.

## 1. Setup and main claim

Let c=pi/2, T p=F p'+2F' p, X[p]=||T p||² and H[p]=||F p'||². In one fixed parity epsilon, let P_n be the monic X-minimizer among degree-n polynomials of that parity, A_n=X[P_n], and q_n=P_n/sqrt(A_n). For any p of degree at most n, write ell_n(p) for its coefficient of t^n. Complete old-prefix selection gives

    theta_n(p) := |X(q_n,p/sqrt(X[p]))|²
                = A_n ell_n(p)²/X[p].                       (1)

The exact-degree packets of SELECTED_PACKET_BRIDGE.md section 4 have

    m=floor(b n^(1-delta)),
    d=2 floor((m-1)/2),
    k=n-sd,
    T=2k/c,
    p(t)=(t/T)^k q(t)^s,

where b>0, integer s>=1 and 5/12<delta<1/2 are fixed. The even polynomial q is the normalized Fejer-Chebyshev kernel in that note, with L in a fixed compact interval [L_-,L_+] and L_->4/c. All constants below are uniform in L. Values with vanishing highest coefficient are allowed, in which case theta_n=0 and the polynomial has lower degree.

Define

    Phi(a)=max{4 log a, 2 log(4u(a))-u(a)},
    u(a)=2+sqrt(4+a²),
    eta_*=4 log 4-4-min_(a>0) Phi(a)
          =0.228769704192781... >1/5.                       (2)

Then

    limsup_(n->infinity, n=epsilon mod 2)
       (1/n) log [sup_(L in [L_-,L_+]) theta_n(p_(n,L))]
         <= -eta_*/2.                                     (3)

In particular, for every rho<eta_*/2, uniformly in L,

    theta_n(p_(n,L)) <= exp(-rho n)                        (4)

for all sufficiently large n. This is stronger than an existence construction obtained by tuning the top kernel coefficient toward zero. It applies to every packet in the stated uniformly controlled family.

## 2. A finite true-theta monic comparison

This section recalls and spells out the earlier finite monic comparison; it does not replace F with a gamma weight.

For each fixed beta<c,

    K_beta=integral_R (1+t²) exp(beta|t|)(F²+F'²) dt < infinity.

Write n=2r+epsilon. For a>0, let

    R_n(t)=t^epsilon(t²-(ar/beta)²)^r.

This is an admissible monic same-parity polynomial. The exact weighted sup-norm calculation and derivative estimate from ACTUAL_THETA_PARITY_CONDITIONING_AND_LAGUERRE_ERROR_AMPLIFICATION.md sections 2-3 give

    A_n <= X[R_n]
        <= K_beta J_epsilon(beta,a)
                   (r/beta)^(4r) exp(r Phi(a)),            (5)

where J_epsilon(beta,a)>0 is independent of r. The constants used there are

    L_(beta,a)=16 beta² exp(-2-Phi(a)),
    J_0=8+2L_(beta,a),   J_1=15+3L_(beta,a).

This bound uses only the actual theta exponential moments, not Q positivity or a lower bound for any gap. In degree-n notation, (5) is

    log A_n <= 2n log(2n/c)-2n
                 -r eta(a)+4r log(c/beta)+O_(beta,a)(log n),       (6)

where eta(a)=4 log4-4-Phi(a). Indeed, replacing 2r by n changes the factorial-scale expression by only O(log n) because epsilon is fixed.

## 3. Uniform leading-coefficient bound

With x=T/(Ln), the kernel is

    E(y)=[K_m(y,x)+K_m(y,-x)]/m,
    K_m(y,x)=1+2 sum_(j=1)^(m-1) (1-j/m) T_j(y)T_j(x),
    q(t)=E(t/(Ln))/E(x).

The even top index is d and E(x)=1/2+O(m^-2), uniformly in L. Since the leading coefficient of T_d is 2^(d-1),

    ell_d(q) = [2^(d+1)/(m E(x))]
                    (1-d/m) T_d(x) (Ln)^(-d).              (7)

Thus, including when it vanishes,

    |ell_d(q)| <= C (2/(Ln))^d,
    |ell_n(p)| <= C^s T^(-k)(2/(Ln))^(sd).                 (8)

No inverse of T_d(x) occurs. The integer s is fixed, so its contribution to the logarithm is O(1). Write j=n-k=sd=o(n). Whenever ell_n(p) is nonzero,

    2 log |ell_n(p)|
       <= -2k log(2k/c)+2j log(2/(Ln))+O(1).               (9)

The zero-leading-coefficient case already satisfies every asserted upper bound for theta_n.

## 4. Actual source-norm lower bound and exponential comparison

The uniform actual-theta packet asymptotic previously proved in the selected bridge is

    X[p_(n,L)] ~ (2/3) a(T)^2 J_s h_(n,L) log³ T,
    a(T)^2 ~ C T^(7/2) exp(-cT),
    h_(n,L) asy n^delta.

Consequently,

    log X[p_(n,L)] = -2k+O(log n),                         (10)

uniformly in L. This is an actual Hardy-Z arithmetic lower bound inherited from the mesoscopic theorem; no pointwise bound away from real zeros is assumed.

Combine (1), (6), (9) and (10). The leftover carrier/top-coefficient expression is

    2n log(2n/c)-2n
       -2k log(2k/c)+2j log(2/(Ln))+2k
      = 2j log(4/(cL))+2k log(n/k)-2j
      <= 2j log(4/(cL)) <= 0,                             (11)

because log(1+j/k)<=j/k and L>4/c. Thus for every fixed a>0 and beta<c,

    log theta_n(p_(n,L))
       <= -r eta(a)+4r log(c/beta)+O_(a,beta)(log n),        (12)

uniformly in L. Retaining the nonpositive term in (11) would slightly improve this estimate at its sublinear scale, but is unnecessary.

Optimize a at the already established minimizer of Phi. Divide (12) by n and take limsup with beta<c fixed. Since r/n->1/2,

    limsup (1/n) log sup_L theta_n
        <= -eta_*/2+2 log(c/beta).

Let beta increase to c only after taking the degree limsup. No bound on K_beta at beta=c or uniform as beta increases is required. This proves (3)-(4). All real Xi zeros remain included.

## 5. Exact consequence for triangular synthesis

Choose one nonzero-leading-coefficient packet at each sufficiently large parity degree, and use a fixed triangular basis of the finite initial parity prefix. Normalize each e_j=p_j/sqrt(X[p_j]). They form a triangular basis of each full parity prefix. Let G_N be its actual X Gram, ordered by increasing degree. If the final degree is n, exact full selection gives

    (G_N^-1)_(NN) = 1/theta_n(e_N),
    q_n=sum_(j<=N)c_(j,N)e_j,
    |c_(N,N)| = sqrt((G_N^-1)_(NN)) = theta_n(e_N)^(-1/2).    (13)

Therefore for every 0<rho<eta_*/2 and all sufficiently large n,

    (G_N^-1)_(NN) >= exp(rho n),
    |c_(N,N)| >= exp(rho n/2),
    lambda_min(G_N) <= exp(-rho n),
    kappa_2(G_N) >= exp(rho n).                            (14)

Here diag(G_N)=1, hence lambda_max>=1. In particular, no uniform Riesz lower bound or uniformly bounded/exponentially localized inverse-column estimate of the form proposed in SELECTED_PACKET_BRIDGE.md section 5.2 can hold for this mesoscopic hierarchy. The diagonal coefficient itself grows exponentially, so this is not merely long-range spreading into lower degrees.

Since the same packet theorem gives

    H[e_N] ~ (3pi²/16)/log² n,

its weighted absolute synthesis sum satisfies

    sum_(j<=N) |c_(j,N)| sqrt(H[e_j])
        >= |c_(N,N)| sqrt(H[e_N])
        >= C exp(rho n/2)/log n -> infinity.               (15)

Thus the weighted-l1 sufficient criterion in the earlier bridge is decisively unavailable for this entire explicit hierarchy, despite favorable H/X at every sufficiently large index. A derivative-synthesis norm that retains cancellations is not ruled out by (15).

## 6. Scope and next mathematical target

This is not a theorem about every possible packet system. In particular it does not cover a different family whose degree budget, source center, multiplier degree or monic extremal scale differs substantially. It also does not exclude a nontriangular redundant representation of the one selected endpoint using carefully controlled correlations.

The obstruction is specific and actual-theta: the favorable mesoscopic packets spend all but o(n) degrees in their monomial carrier, retain the monomial exponential norm scale, and therefore lie exponentially close in X to the complete old prefix. Full selection pays for the comparatively much smaller monic extremal norm. Merely assembling these packets across degrees does not repair the bridge.

A successful all-degree proof must instead find packets closer to the true monic extremal scale, or control the large signed derivative cancellations in the exact inverse-Gram synthesis, or supply a different actual-selected estimate. This note proves neither Delta_n>0 nor U_n=o(Delta_n), and it does not show that either assertion is false. No enlarged Q positivity, inverse-gap bound, or RH is assumed.

## Read-only dependencies

- /workspace/shared/theta_selected_link_20261104/SELECTED_PACKET_BRIDGE.md, sections 2, 4 and 5.
- /workspace/shared/theta_short_packet_20261104/MESOSCOPIC_FEJER_HARDY_Z_ASYMPTOTIC.md.
- /workspace/shared/theta_selected_escape_20261104/ACTUAL_THETA_PARITY_CONDITIONING_AND_LAGUERRE_ERROR_AMPLIFICATION.md, sections 1-3.

The stated arithmetic lower norm and its parameter uniformity are inherited from those frozen notes. The new comparison is deterministic, finite-degree algebra plus their stated all-degree estimates. No finite numerical scan is used. No prior frozen file or live 4CT script was modified.
