# Moving flux energy: independent audit and replay

PASS, 2026-11-03. Independently reran the owned 1000-cell compact-core integrator, then the owned four-window evaluator using the auditor's previously generated half-core inputs and independently regenerated exact flux coefficients. Files and outputs are retained here. No acquired code executed; no odd7 target M7 is integrated. Even6 inverse uses M0..M5 only, while M6 is needed solely for odd7's cross column.

The compact integral uses width=1/(8N), midpoint=(2i+1)/(16N), and interval second-derivative error width^3 sup|f''|/24. The reused complete-theta derivative16 evaluator includes the full-line factor 2 and omitted-orbit radius. Since the domain is exactly [0,1/8], there is no additional spatial-infinity truncation. The interval old/cross displacement on each test window is conservative for all cutoff values. Actual old and local old matrices pass interval LDL tests before their inverses or the stable Schur derivative identity are used.

Phi=2 sum d_j F_j and d_j are coefficients of p^2. Differentiating each of the two polynomial factors gives gradient component 4 sum_k coeff_k F_(i+k+epsilon). The bulk beta has the correct full-line factor 2 and lower-derivative coefficient j/2. The signed mixed term uses forward LDL coordinates and sums y_g y_r/d; neither a squared norm nor an absolute value replaces it. Thus (S-Phi)'=beta+g^T A^-1 r follows from the previously reviewed chain rule, and the polarization/energy formulas are correctly normalized.

Independent result.json reproduces all stated signs and conservative bounds:
- Odd7 near 1/8: compensated derivative >15,510,970,767,579; beta and mixed term positive.
- Even6 near 1/8: compensated derivative >444,530,661 despite beta<-1,435,764,539 and original S'<-1,401,604.
- Odd7 near 1/2: mixed term<-239,459,867,518 but compensated derivative >3,770,853,351,660.
- Even6 near 1/2: compensated derivative<-12,375,057,587 despite original S'>174,964,721.

For c=1/100, the exact convex combination (99 S'+(S-Phi)')/100 has positive lower bounds in all four tested width-1e-8 windows. Even6 bounds exceed 2,987,395 and 49,359,447 respectively. These are local tests only: no interior interval coverage or higher-degree continuation is claimed.

Accepted scope: actual-theta failure of universal nonnegative mixed inverse energy and monotonicity of the unit-flux compensated quantity, plus a limited damped candidate at existing finite rungs. The first even case supplies a genuine correlated payment of negative bulk. Cauchy replacement loses that payment. No uniform/global Lyapunov theorem, new rung, target-norm input, or all-shift conclusion follows.
