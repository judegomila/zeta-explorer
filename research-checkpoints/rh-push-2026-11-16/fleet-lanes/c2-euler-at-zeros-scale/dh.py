# Davenport-Heilbronn control: zeros to height TMAX (on-line by sign changes of the real function Z, off-line by Newton
# from non-crossing extrema, completeness by the argument count), then formal partial product at zeros / shifted points
import sys, json, math, time, cmath, numpy as np
from multiprocessing import Pool
from scipy.optimize import brentq
from flint import acb, arb, dirichlet_char, ctx
from elib import *
KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
C1 = complex(0.5, -KAP / 2)
TMAX = float(sys.argv[1]) if len(sys.argv) > 1 else 1e4; STEP = 0.02
chi = dirichlet_char(5, 2); chb = dirichlet_char(5, 3)
def f(s):
    ctx.prec = 64; z = acb(s.real, s.imag)
    return C1 * complex(chi.l(z)) + C1.conjugate() * complex(chb.l(z))
def theta(t):
    ctx.prec = 64
    return float((acb(0.75, t / 2).lgamma()).imag) + 0.5 * t * math.log(5 / math.pi)
def Zc(t): return cmath.exp(1j * theta(t)) * f(complex(0.5, t))
def Z(t): return Zc(t).real
def grid(a):
    lo, n = a; return [Zc(lo + i * STEP) for i in range(n)]
def refine(a): return brentq(Z, a[0], a[1], xtol=1e-12, rtol=1e-15)
def newton(t0):
    found = []
    for s0 in (0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 1.2):
        s = complex(s0, t0)
        for it in range(60):
            h = 1e-6; fs = f(s); df = (f(s + h) - f(s - h)) / (2 * h)
            if df == 0: break
            ds = fs / df
            if abs(ds) > 0.3: ds *= 0.3 / abs(ds)
            s -= ds
            if abs(ds) < 1e-12: break
        if abs(f(s)) < 1e-9 and abs(s.imag - t0) < 1.5 and s.real > 0.5 + 1e-7: found.append(s)
    return found
def Sarg(T):
    # (1/pi) * continuous variation of arg f from 4+iT to 1/2+iT
    sig = 4.0; prev = f(complex(sig, T)); tot = cmath.phase(prev); h = 0.01
    while sig > 0.5:
        hh = min(h, sig - 0.5); cur = f(complex(sig - hh, T)); d = cmath.phase(cur / prev)
        if abs(d) > 0.5 and h > 1e-5: h /= 2; continue
        tot += d; sig -= hh; prev = cur; h = min(0.01, h * 1.5)
    return tot / math.pi
def psum(a):
    beta, t = a
    eps_c = np.array([[1, 1j, -1j, -1, 0][int(p) % 5 - 1] if int(p) % 5 else 0 for p in PR], dtype=np.complex128)
    l1 = cumlog(beta, t, eps_c); l2 = cumlog(beta, t, eps_c.conj())
    return np.abs(C1 * np.exp(l1) + C1.conjugate() * np.exp(l2)) ** 2
if __name__ == '__main__':
    t0 = time.time(); ng = int(TMAX / STEP) + 1; per = 2000
    print('planned memory: grid %d complex = %.1f MB' % (ng, ng * 16e-6), flush=True)
    with Pool(NW) as pool:
        zg = np.array([x for r in pool.map(grid, [(1.0 + i * STEP, min(per, ng - i)) for i in range(0, ng, per)], chunksize=1) for x in r])
        tg = 1.0 + STEP * np.arange(len(zg)); zr = zg.real
        print('grid sec', time.time() - t0, 'max |Im Z| / max |Re Z|', np.abs(zg.imag).max(), np.abs(zr).max(), flush=True)
        ix = np.nonzero(zr[:-1] * zr[1:] < 0)[0]
        on = np.array(pool.map(refine, [(tg[i], tg[i + 1]) for i in ix], chunksize=20))
        # non-crossing extrema: positive local minima / negative local maxima of Z
        a = np.abs(zr); ex = np.nonzero((a[1:-1] < a[:-2]) & (a[1:-1] <= a[2:]) & (zr[:-2] * zr[1:-1] > 0) & (zr[2:] * zr[1:-1] > 0))[0] + 1
        print('sign changes', len(ix), 'non-crossing extrema', len(ex), 'sec', time.time() - t0, flush=True)
        cand = [s for r in pool.map(newton, [float(tg[i]) for i in ex], chunksize=4) for s in r]
        off = []
        for s in sorted(cand, key=lambda s: s.imag):
            if not any(abs(s - u) < 1e-6 for u in off): off.append(s)
        off = [s for s in off if 1.0 < s.imag < tg[-1]]
        print('off-line zeros with beta > 1/2:', len(off), 'sec', time.time() - t0, flush=True)
        for s in off[:12]: print('   ', s)
        # completeness: N(T) - theta(T)/pi - S(T) must be constant
        chk = []
        for T in [30.3, 100.1, 300.3, 1000.1] + [float(x) + 0.37 for x in np.arange(2000, TMAX, 1000)] + [TMAX - 3.3]:
            if T >= tg[-1]: continue
            Nf = int((on < T).sum()) + 2 * sum(1 for s in off if s.imag < T)
            chk.append((T, Nf, theta(T) / math.pi + Sarg(T)))
            print('count check T=%.2f found=%d main+S=%.4f diff=%.4f' % (T, Nf, chk[-1][2], Nf - chk[-1][2]), flush=True)
        # all zeros: on-line, off right, off left (mirror)
        beta = np.concatenate([np.full(len(on), 0.5), [s.real for s in off], [1 - s.real for s in off]])
        gam = np.concatenate([on, [s.imag for s in off], [s.imag for s in off]])
        cls = np.concatenate([np.zeros(len(on)), np.ones(len(off)), -np.ones(len(off))])
        o = np.argsort(gam, kind='stable'); beta, gam, cls = beta[o], gam[o], cls[o]
        keep = gam > 20; beta, gam, cls = beta[keep], gam[keep], cls[keep]
        np.save('dh_zeros.npy', np.stack([beta, gam, cls]))
        d = shifts_spacing(gam, 5.0)
        print('planned memory per worker: %d x 128 complex x 4 = %.0f MB' % (len(gam), len(gam) * 128 * 64e-6), flush=True)
        X = np.stack(pool.map(psum, [(beta, gam + k / KSH * d) for k in range(KSH)], chunksize=1))  # (KSH, nP, N)
    np.save('dh_X.npy', X); out = dict(n_on=int(len(on)), n_off_pairs=len(off), off=[(s.real, s.imag) for s in off], check=chk)
    a5 = np.array([0.0, 1.0, KAP, -KAP, -1.0])
    for ci, P in enumerate(CPS):
        n = CPI[ci]; e = np.array([[1, 1j, -1j, -1][int(p) % 5 - 1] if int(p) % 5 else 0 for p in PR[:n]])
        Mref = float((2 * abs(C1) ** 2 * np.prod(1 / (1 - np.abs(e) ** 2 / PR[:n])) + 2 * (C1 ** 2 * np.prod(1 / (1 - e * e / PR[:n]))).real).real)
        Xc = X[:, ci, :]; LA = np.log(Xc)
        for name, m in (('all', np.ones(len(gam), bool)), ('on', cls == 0), ('offR', cls == 1), ('offL', cls == -1)):
            for ws in (500, 2000, int(m.sum())):
                if ws > m.sum() or ws == 0: continue
                rows = win_stats(Xc[:, m], LA[:, m], gam[m], ws, None, Mref if name == 'on' else None)
                out['%s|%d|%d' % (name, P, ws)] = dict(Mref=Mref, rows=rows if ws >= 2000 else None,
                    **{kk: summarize(rows, kk) for kk in ('RU', 'Rhalf', 'Rref', 'Uref', 'RUhann', 'G')})
            A = Xc[:, m].sum(axis=1); out['%s|%d|profile' % (name, P)] = (A / A.mean()).tolist()
    json.dump(out, open('dh.json', 'w')); print('done', time.time() - t0)
