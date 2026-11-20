# Checks for c14-x2-step-catalogue-zero-indexed-objects. Planned memory: three complex128 arrays of N+1 = 400001 entries (about 20 MB).
import sys, json, numpy as np, mpmath as mp
mp.mp.dps = 30
out = {}
N = 400000
print("planned allocation: 3 arrays x", N+1, "complex128 =", 3*(N+1)*16/1e6, "MB")
g1 = mp.zetazero(1).imag
def meansq(w, N):
    # lambda_w(n) = sum_{ab=n} (a/b)^(w-1/2) = n^-(w-1/2) sigma_{2w-1}(n)
    z = complex(2*w-1)
    sig = np.zeros(N+1, dtype=np.complex128)
    for d in range(1, N+1):
        sig[d::d] += d**z
    n = np.arange(1, N+1, dtype=np.float64)
    lam = sig[1:] * n**(-complex(w-0.5))
    return np.cumsum(np.abs(lam)**2)
# A. shadow of O2 on the line at the first zero: w = 1/2 + i g1. Series zeta(s)^2 zeta(s+2ig)zeta(s-2ig)/zeta(2s): double pole at 1.
w = mp.mpc(0.5, g1); t = 2*g1
H = lambda s: mp.zeta(s+1j*t)*mp.zeta(s-1j*t)/mp.zeta(2*s)
H1 = H(1); dH1 = mp.diff(H, 1)
cs = meansq(w, N)
rowsA = []
for x in (50000, 100000, 200000, 400000):
    main = x*(H1*(mp.log(x) - 1 + 2*mp.euler) + dH1)
    osc = 0
    for sg in (1, -1):
        s0 = 1 + sg*1j*t
        osc += mp.zeta(s0)**2*mp.zeta(1+2*sg*1j*t)/mp.zeta(2*s0)*mp.power(x, s0)/s0
    rowsA.append({"x": x, "sum": float(cs[x-1]), "main_double_pole": float(mp.re(main)), "with_osc": float(mp.re(main+osc)),
                  "ratio": float(cs[x-1]/mp.re(main+osc))})
out["A_shadow_on_line_double_pole"] = {"H(1)=|zeta(1+2ig)|^2/zeta(2)": float(mp.re(H1)), "rows": rowsA}
# B. shadow off the line (generic beta = 0.7, same gamma): rightmost pole at P = 2 beta = 1 + |2 beta - 1|.
beta = mp.mpf("0.7"); w = mp.mpc(beta, g1)
r = mp.zeta(4*beta-1)*abs(mp.zeta(2*beta+2j*g1))**2/mp.zeta(4*beta)
cs = meansq(w, N)
rowsB = []
for x in (50000, 100000, 200000, 400000):
    pred = r*mp.power(x, 2*beta)/(2*beta)
    rowsB.append({"x": x, "sum": float(cs[x-1]), "pred": float(pred), "ratio": float(cs[x-1]/pred)})
out["B_shadow_off_line_pole_at_1_plus_abs(2beta-1)"] = {"P": float(2*beta), "residue": float(r), "rows": rowsB}
# C. Lemma T instance: Sym^m x conj(Sym^m) of the torus parameter (nu,-nu), nu=(rho-1)/2 with beta in {0.5, 0.7}:
# weights (m-2j)nu + (m-2l)conj(nu); pole of the untwisted function at 1 - min Re, gamma pole of even twists at - min Re.
rowsC = []
for b in (0.5, 0.7):
    nu = complex((b-1)/2, float(g1)/2)
    for m in (1, 2, 4, 8):
        res = [((m-2*j)*nu + (m-2*l)*nu.conjugate()).real for j in range(m+1) for l in range(m+1)]
        mn = min(res)
        rowsC.append({"beta": b, "m": m, "P": 1-mn, "beta0": -mn, "P_minus_beta0": (1-mn)-(-mn), "expected_P": 1+m*(1-b),
                      "local_pole_abscissa_at_p": -mn})
out["C_lemma_T_sym_m"] = rowsC
# D. Hermitian condition at p for O1: p^(i gamma/2) real iff gamma log p / (2 pi) integer. Distance to nearest integer for p <= 200, first zero.
ps = [p for p in range(2, 200) if all(p % q for q in range(2, int(p**0.5)+1))]
d = [(p, float(abs(g1*mp.log(p)/(2*mp.pi) - mp.nint(g1*mp.log(p)/(2*mp.pi))))) for p in ps]
out["D_min_distance_gamma_logp_over_2pi_to_Z"] = min(d, key=lambda u: u[1])
# E. dictionary: bound theta on |Re parameter| read on O1 (nu=(rho-1)/2) and on the shadow of O2 (nu'=rho-1/2).
rowsE = []
for name, th in (("Jacquet-Shalika (strict)", mp.mpf(1)/2), ("LRS n=2", mp.mpf(1)/2-mp.mpf(1)/5), ("Rankin-Serre n=2 (same exponent)", mp.mpf(3)/10),
                 ("Kim-Shahidi 1/9", mp.mpf(1)/9), ("Kim-Sarnak 7/64", mp.mpf(7)/64), ("Ramanujan", mp.mpf(0))):
    rowsE.append({"entry": name, "theta": float(th), "O1: beta >=": float(1-2*th), "O2 shadow: beta <=": float(mp.mpf(1)/2+th)})
out["E_dictionary"] = rowsE
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(json.dumps(out, indent=1))
