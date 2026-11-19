# Scan over admissible R of the section-6 certificate RHS for xi (MEASURED: grids, Simpson; not interval).
import json, os, mpmath as mp
HERE = os.path.dirname(os.path.abspath(__file__))
mp.mp.dps = 18
def omega(r, a, h):
    beta = mp.pi*h/a; q = mp.e**(-mp.pi*r/a)
    return 2*mp.pi*r*mp.sin(beta)/(a*h)*q*(1-q*q)/(1+2*q*mp.cos(beta)+q*q)**2
def thp(a, v):
    s = mp.mpc(0.5+a, v)
    return mp.re(1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s))
def logA(a, v):
    s = mp.mpc(0.5+a, v)
    return mp.re(mp.log(s*(s-1)/2) - s/2*mp.log(mp.pi) + mp.loggamma(s/2)) + mp.log(abs(mp.zeta(s)))
def simpson(ys, d):
    n = len(ys)-1
    if n % 2: raise ValueError
    return d/3*(ys[0]+ys[-1]+4*sum(ys[1:-1:2])+2*sum(ys[2:-1:2]))
d = mp.mpf('0.01'); out = []
for a, hs in ((0.6, (0.06, 0.3, 0.57)), (1.0, (0.1, 0.5, 0.95)), (0.3, (0.15,)), (2.0, (1.0,))):
    rmax = 12*a + 1; n = int(rmax/d); n += n % 2
    for t in (20.0, 30.0, 60.0, 100.0, 200.0, 400.0, 1000.0, 10000.0):
        L0 = logA(a, t)
        amp = [mp.e**(logA(a, t-k*d) + logA(a, t+k*d) - 2*L0) for k in range(n+1)]
        th = {k: thp(a, t+k*d) for k in range(-100, 101)}   # window up to R = 1.0
        for h in hs:
            om = [omega(k*d, a, h) for k in range(n+1)]
            best = None
            for kR in range(2, 101, 2):
                R = kR*d
                vals = [th[k] for k in range(-kR, kR+1)]
                M = max(vals); mu = min(vals)
                if mu <= 0 or R*M > mp.pi/4: continue
                core = 2*mu/(mp.pi*a)*simpson([om[k]*amp[k] for k in range(kR+1)], d)
                tail = simpson([om[k]*amp[k]/(2*a*k*d) for k in range(kR, n+1)], d)
                rec = dict(a=a, h=h, t=t, R=float(R), mu=float(mu), M=float(M), core=float(core), tail=float(tail),
                           rhs_over_A2=float(core-tail), core_over_tail=float(core/tail))
                if best is None or rec['core_over_tail'] > best['core_over_tail']: best = rec
            out.append(best if best else dict(a=a, h=h, t=t, admissible=False))
            print(out[-1], flush=True)
json.dump(out, open(os.path.join(HERE, 'cert_scan.json'), 'w'), indent=1)
