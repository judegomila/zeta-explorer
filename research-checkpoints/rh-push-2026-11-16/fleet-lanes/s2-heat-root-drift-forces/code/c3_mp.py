"""Higher-precision re-check of combo3 (mpmath, 60 digits): same form, same basis, independent arithmetic.
   usage: c3_mp.py OUT.json  code:a:wmax ...   (run several in a pool)"""
import sys, json, math, os
from multiprocessing import Pool
import mpmath as mp
import ctl
DPS = int(os.environ.get("C3_DPS", "60"))

def coeffs_mp(code, X):
    X = int(math.floor(X + 1e-9)); out = []
    if code == 'DH':
        k = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1); per = [mp.mpf(0), mp.mpf(1), k, -k, mp.mpf(-1)]
        L = [mp.mpf(0)] * (X + 1)
        for n in range(2, X + 1): L[n] = per[n % 5] * mp.log(n)
        for d in range(2, X // 2 + 1):
            for m in range(2, X // d + 1): L[d * m] -= L[d] * per[m % 5]
        return [(mp.log(n), L[n] / mp.sqrt(n)) for n in range(2, X + 1)]
    for p in range(2, X + 1):
        if any(p % q == 0 for q in range(2, int(p ** 0.5) + 1)): continue
        m = 1
        while p ** m <= X:
            n = p ** m; base = mp.log(p) / mp.sqrt(n)
            if code == 'ZETA': c = base
            elif code == 'LCHI5': c = base * [0, 1, -1, -1, 1][n % 5]
            elif code == 'SGN-LIOU': c = base * (-1) ** m
            elif code == 'TNR':
                th = mp.acosh(mp.mpf('2.2') / 2)
                c = mp.log(3) * (mp.mpf(3) ** (-mp.mpf(m) / 2) - (-1) ** m * 2 * mp.cosh(m * th)) if p == 3 else base
            elif code.startswith('EA-'):
                a = mp.mpf(eval(code[3:])); c = base * 2 * mp.cosh(a * m * mp.log(p))
            out.append((m * mp.log(p), c)); m += 1
    return out

def job(arg):
    code, a_s, wmax = arg.split(':'); mp.mp.dps = DPS
    a = mp.mpf(a_s); L = 2 * a; K = int(math.ceil(float(wmax) * float(a) / math.pi)); sp = ctl.spec(code)
    if code.startswith('EA-'):
        e = mp.mpf(eval(code[3:])); sp = dict(poles=[mp.mpf(1) / 2 + e, mp.mpf(1) / 2 - e], gam=[mp.mpf(1) / 2 + e, mp.mpf(1) / 2 - e], const=-2 * mp.log(mp.pi))
    else:
        const = {'ZETA': -mp.log(mp.pi), 'SGN-LIOU': -mp.log(mp.pi), 'LCHI5': mp.log(5 / mp.pi), 'DH': mp.log(5 / mp.pi), 'TNR': -mp.log(mp.pi) + 2 * mp.log(3)}[code]
        sp = dict(poles=[mp.mpf(x) for x in sp['poles']], gam=[mp.mpf(x) for x in sp['gam']], const=const)
    cf = [(v, c) for v, c in coeffs_mp(code, mp.exp(L)) if v <= L]
    sig = []; tau = []
    def reg(v, e):
        if v < mp.mpf(10) ** (-25): return (1 - e) / 2
        with mp.workdps(DPS + 40): return +(mp.exp(-e * v) / (1 - mp.exp(-2 * v)) - 1 / (2 * v))
    def rr(v, e):
        if v < mp.mpf(10) ** (-25): return L * (1 - e) - 1
        with mp.workdps(DPS + 40): return +(2 * (L - v) * mp.exp(-e * v) / (1 - mp.exp(-2 * v)) - L / v)
    for k in range(K + 1):
        w = mp.pi * k / a; s = mp.mpf(0); t = sp['const'] * L
        for c in sp['poles']:
            for lam0 in (c, -c):
                lam = mp.mpc(lam0, w)
                if abs(lam) < mp.mpf(10) ** (-30): I = L; J = L * L / 2
                else: I = (mp.exp(lam * L) - 1) / lam; J = (mp.exp(lam * L) - 1 - lam * L) / lam ** 2
                s += I.imag; t += 2 * J.real
        pts = mp.linspace(0, L, max(2, 2 * k + 2))
        Si = mp.si(w * L) if k else mp.mpf(0); Cin = (mp.euler + mp.log(w * L) - mp.ci(w * L)) if k else mp.mpf(0)
        Ein = mp.euler + mp.log(2 * L) + mp.e1(2 * L)
        for e in sp['gam']:
            sa = mp.quad(lambda v: mp.sin(w * v) * reg(v, e), pts) if k else mp.mpf(0)
            ta = mp.quad(lambda v: mp.cos(w * v) * rr(v, e), pts)
            s += -(sa + Si / 2); t += L * (Cin - Ein) - ta + L * mp.e1(2 * L)
        for v, c in cf: s += -c * mp.sin(w * v); t += -2 * c * (L - v) * mp.cos(w * v)
        sig.append(s); tau.append(t)
    n = 2 * K + 1; Q = mp.matrix(n, n)
    for i in range(n):
        ki = i - K
        for j in range(n):
            kj = j - K
            if i == j: Q[i, j] = tau[abs(ki)]
            else:
                si = sig[abs(ki)] * (1 if ki > 0 else -1 if ki < 0 else 0); sj = sig[abs(kj)] * (1 if kj > 0 else -1 if kj < 0 else 0)
                Q[i, j] = (-1) ** (ki - kj) * (2 * a / (mp.pi * (ki - kj))) * (sj - si)
    ev = mp.eigsy(Q, eigvals_only=True); ev = sorted([x / (2 * a) for x in ev])
    r = dict(code=code, a=float(a), K=K, dps=DPS, nterms=len(cf), lam_min=mp.nstr(ev[0], 15), lam_2=mp.nstr(ev[1], 15), lam_max=mp.nstr(ev[-1], 8), n_neg=sum(1 for x in ev if x < 0))
    print(json.dumps(r), flush=True); return r

if __name__ == '__main__':
    out = sys.argv[1]
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p: res = p.map(job, sys.argv[2:], chunksize=1)
    json.dump(res, open(out, 'w'), indent=0); print('DONE')
