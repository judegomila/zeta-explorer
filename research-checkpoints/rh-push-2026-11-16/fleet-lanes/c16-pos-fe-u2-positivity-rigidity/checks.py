# Checks of the trace identity used in the proof of POS-FE (float64 + mpmath for constants).
# Identity (T): for G = int_{[1,inf)} x^-s dN with zeta's FE, pole only at 1 with residue r, and phi in L^2[-1/2,1/2]:
#     int |phihat(x)|^2 dN(x) = (r/2) ( ||phi||^2 - |int phi|^2 ).
# phi = cos^2(pi x) on [-1/2,1/2]: phihat(t) = sinc(t)/2 + (sinc(t-1)+sinc(t+1))/4, ||phi||^2 = 3/8, int phi = 1/2.
import json, numpy as np, mpmath as mp
mp.mp.dps = 30
def ph(t):
    return 0.5*np.sinc(t) + 0.25*(np.sinc(t-1) + np.sinc(t+1))
VAR = 3/8 - 1/4
out = {}
# 1. zeta: N = sum delta_n, r = 1
n = np.arange(1, 2000.0)
out["zeta"] = {"lhs": float((ph(n)**2).sum()), "rhs": VAR/2}
# rational multipliers: m - 1 = sum_j [R1_j/(s-z_j) + R2_j/(s-z_j)^2]; density of m-1: M(x) = sum R1 x^(z-1) + R2 x^(z-1) log x
# N = sum_n delta_n * (delta_1 + M dx): density A(x) = sum_{n<=x} M(x/n)/n
xs, ws = np.polynomial.legendre.leggauss(400)
def lhs_density(poles, X=400):
    # poles: list of (z, R1, R2)
    tot = 0.0; H = {i: 0j for i in range(len(poles))}; J = {i: 0j for i in range(len(poles))}
    for nn in range(1, X):
        x = nn + (xs + 1)/2; w = ws/2
        A = np.zeros_like(x, dtype=complex)
        for i, (z, R1, R2) in enumerate(poles):
            H[i] += nn**(-z); J[i] += nn**(-z)*np.log(nn)
            xz = x**(z - 1)
            A += R1*xz*H[i] + R2*xz*(np.log(x)*H[i] - J[i])
        tot += float((w * ph(x)**2 * A.real).sum())
    return tot
def residues(mfun, z, order):
    # Laurent coefficients of m at z by contour integrals
    R1 = mp.quad(lambda th: mfun(z + mp.mpf('1e-3')*mp.expj(th))*mp.mpf('1e-3')*mp.expj(th), [0, 2*mp.pi])/(2*mp.pi)
    R2 = mp.quad(lambda th: mfun(z + mp.mpf('1e-3')*mp.expj(th))*(mp.mpf('1e-3')*mp.expj(th))**2, [0, 2*mp.pi])/(2*mp.pi) if order == 2 else 0
    return complex(R1), complex(R2)
g1 = mp.zetazero(1).imag; g2 = mp.zetazero(2).imag; gb = (g1+g2)/2
def t2(s): return -(s - mp.mpf(1)/2)**2
# 2. ZQ (pair 1,2; eta = 0.3): support [1,inf), FE, pole at 1 only, N signed -> identity must HOLD
eta = mp.mpf('0.3')
def mZQ(s): return ((t2(s)+gb**2+eta**2)**2 - 4*gb**2*t2(s))/((t2(s)-g1**2)*(t2(s)-g2**2))
poles = []
for z in [mp.mpc(0.5, g1), mp.mpc(0.5, -g1), mp.mpc(0.5, g2), mp.mpc(0.5, -g2)]:
    R1, R2 = residues(mZQ, z, 1); poles.append((complex(z), R1, 0))
r = float(mZQ(1).real)
chk = abs(sum(R1/(2 - z) for z, R1, _ in poles) - (complex(mZQ(2)) - 1))
out["ZQ"] = {"r=m(1)": r, "lhs_atoms": out["zeta"]["lhs"], "lhs_density": lhs_density(poles), "rhs": r*VAR/2, "partial_fraction_check": chk}
out["ZQ"]["defect"] = out["ZQ"]["lhs_atoms"] + out["ZQ"]["lhs_density"] - out["ZQ"]["rhs"]
# 3. G_+ (referee E1; eta = 0.07, b = 0.2): nu >= 0, N >= 0, but double poles at 1/2 +- b -> identity must FAIL
eta = mp.mpf('0.07'); b = mp.mpf('0.2')
def mP(s): return ((t2(s)+gb**2+eta**2)**2 - 4*gb**2*t2(s))/(t2(s)+b**2)**2
poles = []
for z in [mp.mpf(0.5)+b, mp.mpf(0.5)-b]:
    R1, R2 = residues(mP, z, 2); poles.append((complex(z), R1, R2))
r = float(mP(1).real)
chk = abs(sum(R1/(2 - z) + R2/(2 - z)**2 for z, R1, R2 in poles) - (complex(mP(2)) - 1))
ld = lhs_density(poles)
out["G_plus"] = {"r=m(1)": r, "lhs_atoms": out["zeta"]["lhs"], "lhs_density": ld, "rhs": r*VAR/2, "defect": out["zeta"]["lhs"] + ld - r*VAR/2, "partial_fraction_check": chk,
                 "note": "lhs >= 0 termwise (N >= 0); defect != 0 = residue terms of the poles at 1/2 +- b in the theta relation"}
# 4. T-NR symmetric (q = 3, c = 1): N >= 0 but support starts at 1/q < 1 -> general identity with f = phi*phi
#    (r/2) f(0) + sum_{x<1} f(x) N{x} = (r/2) fhat(0) + sum_x fhat(x) N{x},  fhat = phihat^2, f = autocorrelation of phi
q, c = 3.0, 1.0
u = np.linspace(-0.5, 0.5, 200001); du = u[1]-u[0]; pu = np.cos(np.pi*u)**2
def f(x):
    sh = np.interp(u + x, u, pu, left=0, right=0); return float((pu*sh).sum()*du)
r = q**0.5 + c + q**-0.5
nn = np.arange(1, 200000.0)
lhs = r/2*f(0.0) + sum(q**-0.5*f(k/q) for k in range(1, int(q)))
rhs = r/2*0.25 + q**-0.5*(ph(nn/q)**2).sum() + c*(ph(nn)**2).sum() + q**0.5*(ph(nn*q)**2).sum()
out["TNR_q3"] = {"lhs_with_mass_below_1": lhs, "rhs": float(rhs), "defect": float(lhs-rhs), "mass_term_below_1": float(lhs - r/2*f(0.0)),
                 "sum_fhat_dN": float(rhs - r/2*0.25), "r_var_over_2": r*VAR/2,
                 "note": "identity (T) fails by exactly the mass term below 1: support clause"}
json.dump(out, open("checks.json", "w"), indent=1); print(json.dumps(out, indent=1))
