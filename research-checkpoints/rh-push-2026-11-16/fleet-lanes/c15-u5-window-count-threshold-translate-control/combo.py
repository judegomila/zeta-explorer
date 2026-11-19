"""Experiment C: finite combination of translates, F(s) = (zeta(s) + zeta(s + i alpha))/2, alpha the minimax lattice translate (k = 1)
of the span [Ts, Ts + L].  On the line: F(s) - chi(s) conj(F(s)) = (1/2) zeta(s + i alpha)(1 - e^{i Psi(t, alpha)}) (exact), so the
FE defect is at most (1/2)|zeta(s+i alpha)| * 2|sin(Psi/2)| on the whole span.  No Euler product: a(n) = (1 + n^{-i alpha})/2.
Search for zeros of F with Re s > 1/2 inside the span."""
import mpmath as mp, json, sys, math
mp.mp.dps = 30
def Psi(t, al): return 2 * (mp.siegeltheta(t + al) - mp.siegeltheta(t))
out = []
for T, L in ((1e4, 64), (1e5, 64), (1e6, 32)):
    Ts = mp.mpf(T) * mp.mpf("1.003"); a = Ts; b = Ts + L
    al = mp.findroot(lambda x: Psi(a, x) + Psi(b, x) - 4 * mp.pi, 2 * mp.pi / mp.log((a + b) / (4 * mp.pi)))
    eta = max(2 * abs(mp.sin(Psi(a, al) / 2)), 2 * abs(mp.sin(Psi(b, al) / 2)))
    F = lambda s: (mp.zeta(s) + mp.zeta(s + 1j * al)) / 2
    chi = lambda s: mp.exp(-2j * mp.siegeltheta(s.imag)) if s.real == 0.5 else None
    # g(t) = e^{i theta(t)} F(1/2+it); real up to the defect
    h = mp.mpf("0.02"); n = int(L / h) + 1
    g = []; dmax = 0; zmax = 0
    for i in range(n):
        t = a + i * h; s = mp.mpc(0.5, t); v = F(s); w = mp.exp(1j * mp.siegeltheta(t)) * v
        d = abs(v - mp.exp(-2j * mp.siegeltheta(t)) * mp.conj(v)); dmax = max(dmax, d); zmax = max(zmax, abs(v)); g.append(w.real)
    sign_changes = sum(1 for i in range(n - 1) if g[i] * g[i + 1] < 0)
    zeta_count = float((mp.siegeltheta(b) - mp.siegeltheta(a)) / mp.pi)
    cands = [i for i in range(1, n - 1) if (g[i] > 0 and g[i] < g[i - 1] and g[i] < g[i + 1]) or (g[i] < 0 and g[i] > g[i - 1] and g[i] > g[i + 1])]
    zeros = []
    for i in cands:
        t = a + i * h
        for d0 in (0.05, 0.15, 0.3):
            try:
                r = mp.findroot(F, mp.mpc(0.5 + d0, t), tol=1e-22, maxsteps=40)
            except Exception:
                continue
            if r.real > 0.5 + 1e-4 and a <= r.imag <= b and abs(F(r)) < 1e-18 and all(abs(r - z) > 1e-8 for z in zeros):
                zeros.append(r)
    zeros.sort(key=lambda z: -z.real)
    rec = dict(T=T, Ts=float(Ts), L=L, alpha=float(al), eta_span=float(eta), max_abs_FE_defect_on_span=float(dmax), max_abs_F_on_line=float(zmax),
               sign_changes_on_line=sign_changes, mean_zero_count_of_zeta=zeta_count, n_offline=len(zeros),
               offline=[[float(z.real), float(z.imag), float(abs(F(z)))] for z in zeros[:12]],
               mult_defect_a4=float(abs((1 + mp.mpf(4)**(-1j * al)) / 2 - ((1 + mp.mpf(2)**(-1j * al)) / 2)**2)))
    out.append(rec); print(json.dumps(rec), flush=True)
json.dump(out, open("combo.json", "w"), indent=1)
