# Actual-theta short-packet estimates

Date: 2026-11-04. Three analytic notes establish mesoscopic asymptotics and absolute derivative-energy floors. They do not establish the requested moving-selected U_n=o(Delta_n) bound. No actual-selected counterexample is claimed. The work is AI-assisted and analytically audited, not machine-formalized or externally peer reviewed.

## 1. Mesoscopic packets

The complete proof is in `MESOSCOPIC_FEJER_HARDY_Z_ASYMPTOTIC.md`.

For each fixed parity, 0<alpha<4/pi, fixed kernel power s>=1, and 5/12<delta<1/2, an explicit Fejer-Chebyshev polynomial of degree at most n and height T=alpha n+O(1) has width h comparable to n^delta and satisfies

- Weighted Hardy-Z derivative/mass ratio: `(integral phi_n^2 Z'^2)/(integral phi_n^2 Z^2) ~ (1/12)log^2 T`.
- Exact complete-theta operator ratio: `H[p_n]/X[p_n] ~ 3pi^2/(16log^2 T)`.
- Absolute source norm: `X[p_n] ~ (2/3)a(T)^2 J_s h log^3 T`, with `J_s=integral sinc(v)^(4s)dv>0`.

The arithmetic error is `O(n^(5/12)/h)` relatively; the exact gamma carrier is flat with error `O(h^2/n)`. The weight and its derivative-square have total variations `O(1)` and `O(h^-2)`. The note proves global exponential tails and H/X tightness at the mesoscopic scale. All real Xi zeros are retained. It does not identify these polynomials with selected endpoints and does not claim constant-width arithmetic observability.

Korolev-Shubin's actual printed theorem, p.171, was independently checked: its remainder is `O(T^(5/12)log^3 T)`, its cubic is monic, and the factor is `T/12`. The note includes exact source links and distinguishes the cumulative cubic from its differentiated local-density polynomial.

The more general sufficient width range is `T^(5/12)=o(h)` and `h=o(sqrt(T))`. The local two-derivative kernel bounds, source-norm coefficient, deterministic profile mass calculation, and separate global Chebyshev/gamma tail argument are explicit.

## 2. Actual constant-profile packets

`SHORT_PACKET_FREQUENCY_AUDIT.md` proves, for the earlier degree-locked fixed-profile packets centered at T_n~alpha n,

`integral_(|u|<=n^delta) phi_n(u)^2 Z'(T_n+u)^2 du >= (2+o(1)) theta'(T_n)^2 W_n`,

where `W_n=integral sinc(omega_n u)^(4s)du` tends to a positive constant. Conditions are `0<delta<1/2`, `(4s-1)delta>1/4`, and squared-weight Fourier bandwidth `4s omega_n<log 2` with a fixed margin. The derivative energy is therefore at least a fixed positive multiple of log²n at every sufficiently large height of this family.

This is an actual n-dependent polynomial-envelope result. An explicit absolute weight comparison, scalar Riemann-Siegel approximation, integration by parts, and Fourier isolation of m=1 justify it. No derivative of an unknown O-remainder or unproved relative limiting-profile substitution is used.

## 3. A broader finite-band theta mechanism

`BANDLIMITED_TOP_MODE_LOWER_BOUND.md` proves the frozen-sum bound `||g D_T'||² >= lambda²/(4K_B²)||g||²` for every envelope of fixed Fourier bandwidth B. Overlapping top modes are handled by an exactly nilpotent shift matrix rather than discarded. Its explicit conditioning is

`L_B=sum_(2<=m<=exp(2B)) m^(-1/2)`,
`J_B=floor(2B/log 2)+1`,
`K_B=sum_(j=0)^(J_B-1) L_B^j`.

Section 2A transfers this to actual Hardy Z, uniformly over every fixed finite-dimensional band-limited space with `|g(u)|+|g'(u)|<=C_V(1+|u|)^(-4)||g||`. The resulting liminf of `||g Z'(T+.)||²/[(log T)²||g||²]` is at least `1/(16K_B²)`. A dual Fourier test and scalar weighted errors O(T^(-1/10)) avoid differentiating a remainder. Constants depend on the fixed bandwidth and envelope-space Gram conditioning; they are not uniform in growing dimension.

## 4. What remains open

The fixed-profile and finite-band results give absolute derivative floors, not a ratio against weighted Z² mass. The Riemann-Siegel frequencies near m~sqrt(T/(2pi)) approach zero and their closely spaced off-diagonal weighted correlations remain uncontrolled. A precise sufficient independent target is an o(log²T) bound on each fixed low-pass portion of a positive-envelope Hardy-Z packet. That target is stated but not proved.

The mesoscopic theorem does prove relative divergence, but those explicit packets are not identified with the full X-selected polynomials. None of these results controls U_n at the Delta_n scale, proves Delta_n positive, estimates the old inverse gap, or closes the Schur criterion. No enlarged Q positivity is assumed anywhere.

`AUDIT.md` records the independent mathematical checks. `SHA256SUMS` fixes the final payloads after completion.

No prior frozen package or live 4CT file was edited.
