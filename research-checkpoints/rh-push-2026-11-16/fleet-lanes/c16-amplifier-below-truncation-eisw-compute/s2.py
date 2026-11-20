"""S2 (PREREG section 3): device comparison at a zero. float64 screen (MEASURED).
Strip Gram of [Nc, g_1..g_N] over {|x|<=1/2, 1<y<H} by quadrature (direct.py); closed-form P from amp.py.
Per (cell, zero): R2 (worst phase, registered), R2true (phase of the true B; added after registration), and the
cap M/L. sup over x by scipy optimisation from random starts and from the named families.
Largest array: (N+1) x (#x nodes per y) complex128 < 50 MB."""
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from scipy.optimize import minimize
from flint import acb, arb, ctx, fmpq
import amp, direct

def setup(T, N, k, nts=36, kind='Z', dl='0.5'):
    """kind Z: zero k. kind E: midpoint between zeros k, k+1 on sigma = 1/2. kind O: 1 - dl + i gamma_k.
    Uniform formulation: the constant term is kappa * (true constant term), kappa unknown, true kappa = 1.
    At a zero kappa = B'/B and the statistics are those of PREREG section 3."""
    ctx.prec = 200
    zero = (kind == 'Z')
    if kind == 'Z': sarb = acb(arb(1) / 2, acb.zeta_zero(k).imag)
    elif kind == 'E': sarb = acb(arb(1) / 2, (acb.zeta_zero(k).imag + acb.zeta_zero(k + 1).imag) / 2)
    else: sarb = acb(1 - arb(dl), acb.zeta_zero(k).imag)
    ctx.prec = 300
    pt = amp.Point(sarb.real, sarb.imag, zero=zero)
    Fo = direct.F(complex(sarb), zero=zero, sarb=sarb)
    P, lam, info = amp.gram(pt, T, N)
    B = 1.0 + 0j
    Pc = np.array([[complex(P[m, n]) for n in range(N)] for m in range(N)]) * Fo.scale ** 2
    H = float(max(T * N, N / T))
    heights = sorted({T * (m // a) / a for m in range(1, N + 1) for a in direct.divisors(m)})
    lamv = np.array([Fo.lam(m) for m in range(1, N + 1)])
    def fb(x, y, cl):
        nc = Fo.nonconst(x, y)
        rows = [nc]
        for m in range(1, N + 1):
            vm = direct.hecke_formula(Fo, x, y, T, m, cl)
            rows.append((vm - lamv[m - 1] * nc) / B)
        return np.array(rows)
    G = direct.gram_region(Fo, fb, heights, 1.0, H, nts=nts)
    LH = direct.J_tail(Fo, H)
    L = G[0, 0].real + LH
    L1 = direct.J_tail(Fo, 1.0)
    cvec = G[0, 1:]            # <Nc, g_m>
    p = G[1:, 1:]              # <g_m, g_n>
    M = float(pt.MS(1)) * Fo.scale ** 2
    return dict(Pc=Pc, lam=lamv, L=L, L1=L1, cvec=cvec, p=p, B=B, M=M, delta=L / M / L, S_over_M=1 - L1 / M)

def stats(d, x):
    lam = d['lam']; L = d['L']
    lx = x @ lam
    q1 = (x @ d['Pc'] @ x.conj()).real
    px = (x @ d['p'] @ x.conj()).real
    cx = x.conj() @ d['cvec']          # <Nc, g_x>
    a = q1 - px
    b = abs(lx * cx)
    c = abs(lx) ** 2 * L
    disc = b * b + a * c
    if disc < 0: return dict(R2=float('nan'), R2true=float('nan'), a=a)
    r_minus = c / (b + math.sqrt(disc))                       # worst phase
    # phase of the true B: a r^2 - 2 r Re(lx conj(u) cx) - c < 0 with u = B/|B|
    u = d['B'] / abs(d['B'])
    bt = (lx * np.conj(u) * cx).real
    disc2 = bt * bt + a * c
    r_true = c / (-bt + math.sqrt(disc2)) if (-bt + math.sqrt(disc2)) > 0 else float('inf')
    dl = d['delta'] * d['L']
    return dict(R2=r_minus ** 2 / dl, R2true=r_true ** 2 / dl, a=a, defect=(a * abs(d['B']) ** 2 - 2 * (lx * np.conj(d['B']) * cx).real - c))

def run(args):
    T, N, k, nts, kind, dl = args
    t0 = time.time()
    d = setup(T, N, k, nts, kind, dl)
    out = dict(T=T, N=N, k=k, nts=nts, kind=kind, delta=dl, S_over_M=d['S_over_M'], L=d['L'], L1=d['L1'], M=d['M'], cap_M_over_L=d['M'] / d['L1'], Lerr=abs(d['L'] - d['L1']) / d['L1'])
    lam = d['lam']
    fam = {'UNAMP': np.array([1.0] + [0.0] * (N - 1), dtype=complex), 'HECKE': lam.conj(),
           'SELBERG': lam.conj() * (1 - np.log(np.arange(1, N + 1)) / math.log(N))}
    out['families'] = {n: stats(d, x) for n, x in fam.items()}
    rng = np.random.default_rng([20261119, T, N, k, 99, 'ZEO'.index(kind)])
    def obj(v, key):
        x = v[:N] + 1j * v[N:]
        s = stats(d, x)[key]
        return -s if np.isfinite(s) else 0.0
    for key in ('R2', 'R2true'):
        best = -1; bx = None
        starts = [np.concatenate([x.real, x.imag]) for x in fam.values()] + [rng.standard_normal(2 * N) for _ in range(40)]
        for v0 in starts:
            r = minimize(obj, v0, args=(key,), method='Nelder-Mead' if N <= 2 else 'BFGS', options=dict(maxiter=4000))
            if -r.fun > best: best = -r.fun; bx = r.x
        out['sup_' + key] = best
        out['argsup_' + key] = [float(a) for a in bx]
        out['defect_at_sup_' + key] = float(stats(d, bx[:N] + 1j * bx[N:])['defect'])
    # minimal true defect S_v / ||v||^2 over x (how close the amplified inequality comes to an identity)
    out['sec'] = round(time.time() - t0, 1)
    return out

if __name__ == '__main__':
    workers = int(os.environ.get('RH_WORKERS', '4'))
    cells = [tuple(int(a) for a in c.split(',')) for c in sys.argv[1].split(';')]
    outp = sys.argv[2]
    nts = int(sys.argv[3]) if len(sys.argv) > 3 else 36
    kmax = int(sys.argv[4]) if len(sys.argv) > 4 else 12
    kinds = sys.argv[5] if len(sys.argv) > 5 else 'ZE'
    tasks = []
    for (T, N) in cells:
        if 'Z' in kinds: tasks += [(T, N, k, nts, 'Z', '0.5') for k in range(1, kmax + 1)]
        if 'E' in kinds: tasks += [(T, N, k, nts, 'E', '0.5') for k in range(1, kmax)]
        if 'O' in kinds: tasks += [(T, N, k, nts, 'O', '0.1') for k in range(1, kmax + 1)]
    with Pool(workers) as pool, open(outp, 'a') as fh:
        for row in pool.imap_unordered(run, tasks, chunksize=1):
            fh.write(json.dumps(row) + "\n"); fh.flush()
            print({k: v for k, v in row.items() if not k.startswith('argsup')}, flush=True)
    print("DONE", flush=True)
