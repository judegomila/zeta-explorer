"""Numerical tests of the three missing lemmas (MEASURED, mpmath dps 15, grids; not certified).
L1(x0): sup_t Re f'/f(1/2+x0+it) / log(t+2) finite   (upper tail; strip-continued Theorem E)
(ME)/cap(x): sup_t [-Re f'/f(1/2+x+it)] / Re G_f(1/2+x+it) <= 1   (RH <=> <= 1 for all x>0; sq-causal-cascade (ME))
L2: windowed anticausal transform |I(u)| / (sqrt(2 pi) Dl exp(-u^2 Dl^2/2)) <= 1 for u<0 (sq-hankel-traces Cor 3b)
Objects: zeta; DH; E_a = zeta(s+a)zeta(s-a), a=0.3; finite sign twist TW = zeta(s)(1-2^{-s})^2 (Lambda(2^k) -> -Lambda(2^k)).
"""
import mpmath as mp, json, sys
mp.mp.dps = 15
half = mp.mpf(1)/2
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def lz(s): return mp.zeta(s, derivative=1)/mp.zeta(s)
def Gz(s): return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2
def ldh(s):
    h = mp.zeta(s, mp.mpf(1)/5) + kap*mp.zeta(s, mp.mpf(2)/5) - kap*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5)
    hd = mp.zeta(s, mp.mpf(1)/5, 1) + kap*mp.zeta(s, mp.mpf(2)/5, 1) - kap*mp.zeta(s, mp.mpf(3)/5, 1) - mp.zeta(s, mp.mpf(4)/5, 1)
    return -mp.log(5) + hd/h
def Gdh(s): return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2
A = mp.mpf('0.3')
objs = {
 'zeta': (lz, Gz, 10, 200, 0.1),
 'E_a(0.3)': (lambda s: lz(s+A)+lz(s-A), lambda s: Gz(s+A)+Gz(s-A), 10, 200, 0.1),
 'TWIST(eps_2=-1)': (lambda s: lz(s) + 2*mp.log(2)/(2**s-1), Gz, 10, 200, 0.1),
 'DH': (ldh, Gdh, 80, 120, 0.1),
}
out = {}
for name, (lf, G, t1, t2, dt) in objs.items():
    for x0 in (0.375, 0.25, 0.1, 0.02):
        up = (-1e9, None); cap = (-1e9, None); n = int(round((t2-t1)/dt))
        for k in range(n+1):
            t = t1 + k*dt; s = mp.mpc(0.5+x0, t)
            r = float(mp.re(lf(s))); g = float(mp.re(G(s)))
            a = r/float(mp.log(t+2)); c = -r/g if g > 0 else float('nan')
            if a > up[0]: up = (a, t)
            if c > cap[0]: cap = (c, t)
        out[f"{name}|{x0}"] = dict(L1=up, cap=cap)
        print(f"{name:16s} x0={x0:5.3f}  L1 stat max Re f'/f / log(t+2) = {up[0]:9.3f} at t={up[1]:.1f}   cap stat max(-Re f'/f)/Re G = {cap[0]:8.4f} at t={cap[1]:.1f}  [{t1},{t2}]"); sys.stdout.flush()
# L2 for E_a (zeta and DH values are in sq-hankel-traces/detector.log)
mp.mp.dps = 20
def L_z(z):
    s = half + z
    return Gz(s) + lz(s)
def run(name, L, t0, alpha=mp.mpf(1), Dl=mp.mpf(1)):
    Sf = lambda z: (1-alpha*L(z))/(1+alpha*L(z))
    h = mp.mpf('0.01'); n = int(9*Dl/h); ts = [t0 + k*h for k in range(-n, n+1)]
    Sv = [Sf(mp.mpc(0, t)) for t in ts]
    for u in (-2, -4, -6):
        I = h*mp.fsum(Sv[i]*mp.exp(-(ts[i]-t0)**2/(2*Dl**2))*mp.exp(1j*ts[i]*u) for i in range(len(ts)))
        b = mp.sqrt(2*mp.pi)*Dl*mp.exp(-u*u*Dl*Dl/2)
        out[f"L2|{name}|{u}"] = float(abs(I)/b)
        print(f"L2 {name:10s} t0={mp.nstr(t0,8)} u={u}: |I|/Gaussian bound = {mp.nstr(abs(I)/b, 6)}"); sys.stdout.flush()
t0 = mp.mpf('85.699348')
run('zeta', L_z, t0)
run('E_a(0.3)', lambda z: L_z(z+A)+L_z(z-A), t0)
json.dump(out, open('lemma_tests.json', 'w'), indent=1)
