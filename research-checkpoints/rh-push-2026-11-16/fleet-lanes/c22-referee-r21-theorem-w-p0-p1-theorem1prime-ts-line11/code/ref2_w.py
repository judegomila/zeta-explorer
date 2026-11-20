# Referee recheck of Theorem W step 4 (c21-br2-sparse-pole-lattice). New code.
# float64 scan of E_n (declared: screen) + Arb recheck of a sample + Arb signed sums for CYC + Weyl step on true primes.
import sys, json, math, os
import numpy as np
from multiprocessing import Pool
P = 5                                   # window b(u) = c cos^(2P)(pi u/2) on [-1,1], integral 1; bhat decays like xi^-(2P+1)
CW = math.factorial(P)**2 * math.pi**(2*P)
def bhat_np(xi):
    xi = np.abs(xi) + 0.0
    den = xi.copy()
    for m in range(1, P+1):
        den = den * (xi*xi - (math.pi*m)**2)
    bad = np.abs(den) < 1e-9
    out = np.where(bad, 1.0, np.abs(np.sin(xi)) * CW / np.where(bad, 1.0, np.abs(den)))
    return np.minimum(out, 1.0)         # |bhat| <= bhat(0) = 1 (b >= 0); also repairs the removable points
def lam_model(name, k):
    k = np.asarray(k, dtype=np.float64)
    if name == 'k15': return k**1.5
    if name == 'k15g': return k**1.5 + 0.3*np.sin(k*k)     # generic perturbation: no exact rational ratios
    if name == 'k2': return k**2.0
    raise ValueError
def scan_one(args):
    name, K0, k0, h, n0, n1 = args
    lk0 = float(lam_model(name, k0))
    res = []
    for n in range(n0, n1):
        om = n*lk0
        kmax = int((om + 400.0/h)**(1/1.5 if name.startswith('k15') else 0.5)) + 3
        k = np.arange(K0+1, kmax+1)
        lam = lam_model(name, k)
        x = om/lam
        m0 = np.maximum(np.rint(x), 1.0)
        E = 0.0
        for dm in (-2, -1, 0, 1, 2):
            m = m0 + dm
            ok = m >= 1
            if dm == 0 or True:
                ok = ok & ~((k == k0) & (m == n))
            xi = h*(om - m*lam)
            E += float(np.sum(np.where(ok, lam*h*bhat_np(xi), 0.0)))
        res.append(E/(lk0*h))
    return res
def scan(name, K0, k0, h, N, workers):
    chunks = [(name, K0, k0, h, a, min(a+25, N+1)) for a in range(1, N+1, 25)]
    with Pool(workers) as p:
        out = p.map(scan_one, chunks)
    r = np.array([v for c in out for v in c])
    return dict(model=name, K0=K0, k0=k0, lam_k0=float(lam_model(name, k0)), h=h, N=N,
                good_quarter=float(np.mean(r <= 0.25)), good_half=float(np.mean(r < 0.5)),
                median=float(np.median(r)), q10=float(np.quantile(r, .1)), q90=float(np.quantile(r, .9)), mean=float(np.mean(r)),
                first=[float(v) for v in r[:8]])
def squarefree_after(K):
    k = K+1
    while True:
        if all(k % (d*d) for d in range(2, int(k**.5)+1)): return k
        k += 1
def cyc_scan(k0, h, N, Kmax=60):
    l0 = math.log(3.0)
    lam = l0*2.0**np.arange(0, Kmax)
    lk0 = lam[k0]
    r = []
    for n in range(1, N+1):
        om = n*lk0
        E = 0.0
        for kk in range(Kmax):
            x = om/lam[kk]
            m0 = max(round(x), 1)
            R = int(60/(h*lam[kk])) + 2
            m = np.arange(max(1, m0-R), m0+R+1, dtype=np.float64)
            t = lam[kk]*h*bhat_np(h*(om - m*lam[kk]))
            if kk == k0: t = np.where(m == n, 0.0, t)
            E += float(t.sum())
        r.append(E/(lk0*h))
    r = np.array(r)
    return dict(model='CYC', k0=k0, lam_k0=float(lk0), h=h, N=N, good_quarter=float(np.mean(r <= .25)),
                good_half=float(np.mean(r < .5)), median=float(np.median(r)), min=float(r.min()))
# ---------------- Arb parts
def arb_parts(out):
    import flint
    from flint import arb, acb, fmpz
    flint.ctx.prec = 256
    pi = arb.pi()
    def bhat(xi):                       # signed, exact closed form
        den = xi
        for m in range(1, P+1):
            den = den*(xi*xi - (pi*m)**2)
        return xi.sin()*arb(math.factorial(P))**2 * pi**(2*P) * (-1)**P / den
    # check closed form against quadrature at two points
    chk = []
    for x0 in ('0.7', '9.3'):
        xi = arb(x0)
        cn = arb(4)**P/ (2*arb(math.comb(2*P, P)))
        q = acb.integral(lambda u, a: cn*((pi*u/2).cos()**(2*P))*(acb(0, 1)*acb(xi)*u).exp(), -1, 1)
        chk.append([x0, str(q.real - bhat(xi))])
    out['bhat_closed_form_vs_quadrature'] = chk
    # (1) CYC signed sums: S(om) = sum_k lam_k sum_{m>=1} (-1)^m That(om - m lam_k), That(x) = h bhat(h x)
    l0 = arb(3).log()
    rows = []
    for (k0, h, n) in [(6, 1, 1), (6, 1, 7), (9, 1, 3), (9, 0.25, 5), (12, 1, 2)]:
        hh = arb(h)
        om = n*l0*2**k0
        Kmax = 80
        S = arb(0); Eabs = arb(0)
        for kk in range(Kmax):
            lk = l0*arb(2)**kk
            x = float((om/lk).mid())
            R = int(80/(h*float(lk.mid()))) + 2
            m0 = max(round(x), 1)
            for m in range(max(1, m0-R), m0+R+1):
                t = lk*hh*bhat(hh*(om - m*lk))
                S += t if m % 2 == 0 else -t
                if not (kk == k0 and m == n): Eabs += abs(t)
        # predicted closed form: -l0 * sum_m That(om - m l0)
        x = float((om/l0).mid()); m0 = round(x); R = int(80/(h*1.0986))+2
        Pm = arb(0)
        for m in range(max(1, m0-R), m0+R+1):
            Pm += -l0*hh*bhat(hh*(om - m*l0))
        rows.append(dict(k0=k0, h=h, n=n, spike=float((l0*2**k0*hh).mid()), signed_sum=float(S.mid()), closed_form=float(Pm.mid()),
                         diff=float(abs(S-Pm).upper()), E_over_spike=float((Eabs/(l0*2**k0*hh)).mid())))
    out['cyc_signed'] = rows
    # (2) true primes q_k nearest to exp(k^1.5), k = 2..36: Weyl step per pair
    import mpmath as mp
    mp.mp.dps = 400
    def nearest_prime(x):
        c = int(mp.nint(x)); d = 0
        while True:
            for s in ((c-d, c+d) if d else (c,)):
                if s > 1 and fmpz(s).is_probable_prime(): return s
            d += 1
    primes = {}
    for k in range(2, 37):
        primes[k] = nearest_prime(mp.exp(mp.mpf(k)**1.5))
    assert len(set(primes.values())) == len(primes)
    lam = {k: arb(fmpz(primes[k])).log() for k in primes}
    out['k15_primes_small'] = {k: str(primes[k]) for k in range(2, 9)}
    out['k15_log_minus_model'] = {k: float((lam[k] - arb(k)**arb('1.5')).mid()) for k in (2, 4, 9, 16, 25, 36)}
    w = 0.05; Nn = 2_000_000
    n = np.arange(1, Nn+1, dtype=np.float64)
    rows = []
    for k0 in (7, 9, 12, 36):
        for k in (3, 4, 5, 9, 16, 28, 36):
            if k == k0: continue
            ratio = lam[k0]/lam[k]
            rf = float(ratio.mid())
            # split ratio = integer part + frac to keep float64 accuracy
            ip = math.floor(rf); fr = float((ratio - ip).mid())
            v = n*fr; frac = v - np.rint(v)
            nb = int(np.sum(np.abs(frac) < w))
            # count only n with n*lam_k0 >= lam_k/2 irrelevant here (m>=1 for n large)
            rows.append(dict(k0=k0, k=k, ratio=rf, ratio_minus_nearest_rational_8=float((ratio-8).mid()) if abs(rf-8) < 1e-3 else None,
                             bad_fraction=nb/Nn, weyl=2*w))
    out['weyl_true_primes_k15'] = dict(w=w, N=Nn, rows=rows)
    # CYC analogue of the same count
    rows = []
    for k0 in (6, 9):
        for k in (0, 3, 5, 12):
            if k == k0: continue
            fr = 2.0**(k0-k); v = n[:100000]*fr; frac = v - np.rint(v)
            rows.append(dict(k0=k0, k=k, ratio=fr, bad_fraction=float(np.mean(np.abs(frac) < w)), weyl=2*w))
    out['weyl_cyc'] = rows
    # (3) Arb recheck of the float scan on a sample: model k15, K0 = 600
    K0 = 600; k0 = squarefree_after(K0); h = arb(1)
    lk0 = arb(k0)**arb('1.5')
    samp = []
    for n_ in (1, 2, 3, 5, 8, 13, 21, 34, 55, 89):
        om = n_*lk0
        kmax = int((float(om.mid()) + 400.0)**(1/1.5)) + 3
        E = arb(0)
        for k in range(K0+1, kmax+1):
            lk = arb(k)**arb('1.5')
            x = float((om/lk).mid()); m0 = max(round(x), 1)
            for m in range(max(1, m0-2), m0+3):
                if k == k0 and m == n_: continue
                E += lk*abs(bhat(om - m*lk))
        fl = scan_one(('k15', K0, k0, 1.0, n_, n_+1))[0]
        samp.append(dict(n=n_, arb=float((E/lk0).mid()), arb_rad=float((E/lk0).rad()), float64=fl))
    out['arb_vs_float_sample'] = dict(K0=K0, k0=k0, rows=samp)
if __name__ == '__main__':
    workers = int(os.environ.get('RH_WORKERS', '4'))
    out = {}
    arb_parts(out)
    json.dump(out, open('w_arb.json', 'w'), indent=1); print(json.dumps(out, indent=1), flush=True)
    rows = []
    for (k0, h) in [(6, 1.0), (9, 1.0), (9, 0.25), (12, 1.0)]:
        r = cyc_scan(k0, h, 400); rows.append(r); print(r, flush=True)
    N = 1000
    for name in ('k15', 'k15g'):
        for K0 in (8, 100, 600, 2500, 10000, 40000):
            for h in (1.0,):
                k0 = squarefree_after(K0) if K0 != 8 else 60
                print('planned max allocation: about %.2f GB per worker' % (8*8*((N*lam_model(name, k0)+400)**(2/3))/1e9), flush=True)
                r = scan(name, K0, k0, h, N, workers); rows.append(r); print(r, flush=True)
    out['scan'] = rows
    json.dump(out, open('w_all.json', 'w'), indent=1)
    print('DONE')
