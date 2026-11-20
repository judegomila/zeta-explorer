# Shifted pair (A_a, B_a) = (Re, Im) of Xi(t + i a) on real t.  Hermite-Biehler / interlacing on a window
# is equivalent to monotone phase, i.e. constant sign of g(t) = Re (Lambda'/Lambda)(1/2 - a + i t).
# zeta: Lambda = xi.  DH: Lambda(s) = (pi/5)^{-s/2} Gamma((s+1)/2) f(s).
import mpmath as mp, json
mp.mp.dps = 25
def xi(s): return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def dh(s): return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5)+kap*mp.zeta(s, mp.mpf(2)/5)-kap*mp.zeta(s, mp.mpf(3)/5)-mp.zeta(s, mp.mpf(4)/5))
def Ldh(s): return (mp.pi/5)**(-s/2)*mp.gamma((s+1)/2)*dh(s)
def g(L, a, t):
    s = mp.mpc(mp.mpf(1)/2 - a, t); h = mp.mpf(10)**(-8)
    return float(mp.re((L(s+h)-L(s-h))/(2*h)/L(s)))
out = {}
z0 = mp.mpc('0.80851718245664', '85.699348485378'); print("kappa", kap, "|DH(z0)|", abs(dh(z0)))
for name, L, a, t0, t1, dt in (("zeta a=0.40", xi, 0.40, 0.0, 120.0, 0.25), ("zeta a=0.05", xi, 0.05, 0.0, 120.0, 0.05),
                               ("DH a=0.35", Ldh, 0.35, 80.0, 92.0, 0.02), ("DH a=0.25", Ldh, 0.25, 80.0, 92.0, 0.02),
                               ("DH a=0.3085", Ldh, 0.3085, 85.0, 86.4, 0.005)):
    ts = [t0 + k*dt for k in range(int(round((t1-t0)/dt))+1)]
    vals = [g(L, mp.mpf(a), mp.mpf(t)) for t in ts]
    pos = [(t, v) for t, v in zip(ts, vals) if v > 0]
    out[name] = {"min": min(vals), "max": max(vals), "n_points": len(ts), "n_positive": len(pos),
                 "positive_range": [pos[0][0], pos[-1][0]] if pos else None}
    print(name, out[name], flush=True)
json.dump(out, open("hb_phase.json", "w"), indent=1)
