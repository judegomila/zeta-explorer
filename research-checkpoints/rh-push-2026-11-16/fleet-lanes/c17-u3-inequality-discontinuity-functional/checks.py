"""c17-u3 local checks (float64 + mpmath).  (A) ZQ coefficient density F and the sinc^2 balance of Theorem P / Prop T;
candidate functionals on ZQ.  (B) T-NR at base q = 1 + delta.  (C) NR-q lifts: zeros on Re s = 1/2 +- b."""
import json, math, numpy as np, mpmath as mp
out = {}
# ---------- (A)
def zq(g1, g2, eta, xmax=600.0, h=2.5e-4):
    gb = (g1 + g2) / 2; d = (g2 - g1) / 2
    num = lambda t2: (t2 + gb * gb + eta * eta) ** 2 - 4 * gb * gb * t2
    def res(g, go):   # residue of m at s = 1/2 + i g ; t^2 = -(s-1/2)^2, d(t^2)/ds = -2(s-1/2) = -2 i g
        return num(g * g) / ((-2j * g) * (g * g - go * go))
    c1 = res(g1, g2); c2 = res(g2, g1)
    r = num(-0.25) / ((-0.25 - g1 * g1) * (-0.25 - g2 * g2))     # m(1)
    npts = int((xmax - 1) / h) + 1
    print("planned grid", npts, "points,", npts * 8 * 4 / 1e6, "MB")
    x = 1 + h * np.arange(npts)
    F = np.zeros(npts)
    def M(y):
        L = np.log(y)
        return 2 * (y ** -0.5) * ((c1 * np.exp(1j * g1 * L)).real + (c2 * np.exp(1j * g2 * L)).real)
    for n in range(1, int(xmax) + 1):
        i0 = int(math.ceil((n - 1) / h - 1e-9))
        F[i0:] += M(x[i0:] / n) / n
    s2 = np.sinc(x) ** 2
    # Mellin check at s = 3: int x^-s F dx = zeta(s)(m(s)-1)
    s = 3.0; t2 = -(s - 0.5) ** 2
    m3 = num(t2) / ((t2 - g1 * g1) * (t2 - g2 * g2))
    mell = float(np.sum(x ** -s * F) * h); ref = float(mp.zeta(3)) * (m3 - 1)
    bal = float(np.sum(s2 * F) * h); absint = float(np.sum(s2 * np.abs(F)) * h)
    tail = float(np.max(np.abs(F[-int(50 / h):])) / (math.pi ** 2 * xmax))
    L = np.linspace(0, 80, 800001)
    eps = float(np.max(4 * np.exp(-L / 2) * (np.cosh(eta * L) - np.cos(d * L))))
    mask = x < 2
    return dict(g1=g1, g2=g2, d=d, eta=eta, r_minus_1=r - 1, abs_res=[abs(c1), abs(c2)], lower_res=(eta * eta + d * d) / (2 * d),
                mellin_check=[mell, ref], balance_int_sinc2_F=bal, PhiA_int_sinc2_absF=absint, tail_bound=tail,
                PhiA_on_1_2=float(np.sum(s2[mask] * np.abs(F[mask])) * h),
                eps_sup_env_D=eps, supF=float(np.max(np.abs(F))), PhiA_over_eps=absint / eps, sqrtPhiA_over_sqrteps=math.sqrt(absint / eps),
                eta_over_sqrteps=eta / math.sqrt(eps), res_over_sqrteps=abs(c1) / math.sqrt(eps))
Z = {34: (111.02953554316967, 111.87465917699263), 24: (87.42527461312523, 88.80911120763446), 1: (14.134725141734695, 21.022039638771556)}
out["A"] = [zq(*Z[k], eta) for k in (34, 24) for eta in (0.02, 0.05, 0.1, 0.2)]
# kappa0 = int_1^inf sinc^2
out["kappa0"] = float(mp.mpf(1) / 2 - mp.quad(lambda t: mp.sinc(mp.pi * t) ** 2, [0, 1]))
# ---------- (B) T-NR at q = 1 + delta
mp.mp.dps = 30
B = []
for delta in (1e-1, 1e-2, 1e-3):
    for b in (0.05, 0.45):
        q = mp.mpf(1) + delta; c = q ** b + q ** (-b)
        m = lambda s: (q ** (s - mp.mpf(1) / 2) + c + q ** (mp.mpf(1) / 2 - s)) / (2 + c)
        s0 = mp.mpc(0.5 + b, mp.pi / mp.log(q))
        sx = mp.mpc(0.3, 7.7)
        B.append(dict(delta=delta, b=b, c_minus_2=float(c - 2), zero_height=float(s0.imag), abs_m_at_zero=float(abs(m(s0))),
                      fe_defect=float(abs(m(sx) - m(1 - sx))), m_at_1=float(m(1)), weights=[float(q ** -0.5 / (2 + c)), float(c / (2 + c)), float(q ** 0.5 / (2 + c))],
                      sup_m_minus_1_on_t_le_10=float(max(abs(m(mp.mpc(0.5, t)) - 1) for t in mp.linspace(0, 10, 41))),
                      local_root_mod_over_sqrt_q=float(q ** b)))
out["B"] = B
# ---------- (C) NR-q lifts
C = []
q = 1 + mp.sqrt(2); c = mp.mpf("2.1"); bb = mp.acosh(c / 2) / mp.log(q)
for th in (0.0, 1.0, 2.5):
    z = mp.e ** (1j * th)
    m = lambda s: mp.conj(z) * q ** (s - 0.5) + c + z * q ** (0.5 - s)
    s0 = mp.findroot(m, mp.mpc(0.5 + bb, (mp.pi + th) / mp.log(q)))
    C.append(dict(arg_z=th, zero=[float(s0.real), float(s0.imag)], predicted_re=float(0.5 + bb), abs_m=float(abs(m(s0)))))
out["C"] = C
json.dump(out, open("checks.json", "w"), indent=1)
for a in out["A"]: print({k: (round(v, 6) if isinstance(v, float) else v) for k, v in a.items()})
print(out["kappa0"]); print(B); print(C)
