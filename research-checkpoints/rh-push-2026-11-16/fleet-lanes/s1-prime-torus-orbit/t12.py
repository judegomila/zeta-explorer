"""Tests 1 and 2: window statistics of truncated Euler products and of prime sums on orbit windows
(base heights t0 in [T/2, T], T = band) against Haar windows (uniform base point on the torus, same flow).

Prime pass (primes <= P): log F_P(sigma + it) for the Euler families, DH = c1 L_P(chi) + c2 L_P(chibar),
  T-NR = zeta_P * m, E_a = zeta_P(s+a) zeta_P(s-a); f(t) = sum_{p<=N} u_p log p p^(-sigB - it).
Composite pass (n <= Nc): sum_{n<=N} Lambda_F(n) n^(-sigB - it) for the full log-derivative coefficient sets
  (zeta, twists, chi, DH, T-NR, E_a) and the heat-coefficient Dirichlet polynomial sum exp(tau log^2 n / 4) n^(-s).
"""
import sys, math, json, time, argparse
import numpy as np
import torus as T
from torus import xp

ap = argparse.ArgumentParser()
ap.add_argument('--P', type=float, default=1e6)
ap.add_argument('--nwin', type=int, default=200)
ap.add_argument('--J', type=int, default=400)
ap.add_argument('--step', type=float, default=0.025)
ap.add_argument('--Nc', type=float, default=3e5)
ap.add_argument('--nwinc', type=int, default=60)
ap.add_argument('--bands', default='1e2,1e3,1e4,1e6,1e8,1e10,1e12,HAAR')
ap.add_argument('--chunk', type=float, default=1.2e8 if T.GPU else 1.6e7)
ap.add_argument('--out', default='t12.npz')
ap.add_argument('--seed', type=int, default=1)
ap.add_argument('--lite', action='store_true')
a = ap.parse_args()

P = int(a.P); Nc = int(a.Nc); J = a.J
bands = a.bands.split(',')
SIG = [0.5, T.SIGB, 0.75, T.SIGB - 0.1, T.SIGB + 0.1, 0.65, 0.85]
EA = {1: (3, 4), 2: (5, 6)}            # E_a at SIG[1] and SIG[2] with a = 0.1
TAU = -0.5
if a.lite:      # three abscissae only; the E_a columns are then not meaningful
    SIG = [0.5, T.SIGB, 0.75]; EA = {1: (1, 1), 2: (2, 2)}
rng = np.random.default_rng(a.seed)
t00 = time.time()

pr = T.sieve(P); n = len(pr); logp = np.log(pr)
cuts = [c for c in (1e2, 1e3, 1e4, 1e5, 1e6, 1e7) if c <= P]
hi, lo = T.fixed_logs(pr, cache=f'flog_{P}.npz')
U = T.families(pr)
FAM = list(U.keys()); nf = len(FAM); ns = len(SIG); nc = len(cuts)
small = pr <= 1000; nsm = int(small.sum())
print(f'P={P} primes={n} GPU={T.GPU} families={FAM} cuts={cuts}', flush=True)

# weight matrices for the primes > 1000 (orders 1..3) and for the prime sum f (all primes)
W = [np.zeros((n, nf * ns * nc), dtype=complex) for _ in range(3)]
col = 0
for f in FAM:
    for s in SIG:
        for c in cuts:
            m = (pr <= c) & ~small
            z = U[f] * pr ** (-s)
            for k in range(3):
                W[k][m, col] = z[m] ** (k + 1) / (k + 1)
            col += 1
WL = np.zeros((n, nf * nc), dtype=complex)
for i, f in enumerate(FAM):
    for j, c in enumerate(cuts):
        WL[pr <= c, i * nc + j] = (U[f] * logp * pr ** (-T.SIGB))[pr <= c]
ap_ = logp * pr ** (-T.SIGB)
tri = np.array([ap_[pr <= c].sum() for c in cuts]); rms = np.array([math.sqrt((ap_[pr <= c] ** 2).sum()) for c in cuts])
tnr1 = T.tnr_lambda(3)[3] / math.log(3)          # T-NR coefficient ratio at p = 3
i3 = int(np.nonzero(pr == 3)[0][0])
Wx = [xp.asarray(w) for w in W]; WLx = xp.asarray(WL)
ind_s = xp.asarray(np.stack([(pr[:nsm] <= c) for c in cuts], axis=1).astype(complex))
l2pi = xp.asarray(logp / (2 * math.pi))
KC = max(J, int(a.chunk // n) // J * J)
print(f'planned per-chunk allocation per worker: {a.chunk:.2e} elements x 16 B x 3 arrays = {a.chunk*48/1e9:.2f} GB; workers {T.nworkers() if not T.GPU else 1}', flush=True)
delta = np.arange(J) * a.step


def prime_chunk(t0s, haar):
    B = len(t0s)
    if haar:
        base = xp.asarray(rng.random((B, n)))
    else:
        base = T.base_cycles(t0s, hi, lo)
    Jc = max(1, int(a.chunk // (B * n)))
    Ls, fLs, e3s = [], [], []
    for j0 in range(0, J, Jc):
        dj = xp.asarray(delta[j0:j0 + Jc]); nj = len(dj)
        C = (base[:, None, :] + dj[None, :, None] * l2pi[None, None, :]).reshape(B * nj, n)
        E = xp.exp(-2j * math.pi * C); del C
        fL = E @ WLx
        L = E @ Wx[0]
        E2 = E * E; L += E2 @ Wx[1]
        E2 *= E; L += E2 @ Wx[2]; del E2
        Es = E[:, :nsm].copy(); e3 = E[:, i3].copy(); del E
        L = L.reshape(B * nj, nf, ns, nc)
        for i, f in enumerate(FAM):
            uf = xp.asarray(U[f][:nsm])
            for j, s in enumerate(SIG):
                z = Es * (uf * xp.asarray(pr[:nsm] ** (-s)))[None, :]
                L[:, i, j, :] += (-xp.log1p(-z)) @ ind_s
        Ls.append(L.reshape(B, nj, nf, ns, nc)); fLs.append(fL.reshape(B, nj, nf, nc)); e3s.append(e3.reshape(B, nj))
        T.free()
    cat = xp.concatenate
    return cat(Ls, axis=1).reshape(B * J, nf, ns, nc), cat(fLs, axis=1).reshape(B * J, nf, nc), cat(e3s, axis=1).reshape(B * J)


def stats_prime(L, fL, e3, B):
    o = {}
    R = L.real.reshape(B, J, nf, ns, nc)
    o['lmax'] = T.asnp(R.max(axis=1)); o['lmin'] = T.asnp(R.min(axis=1))
    o['m1'] = T.asnp(R.mean(axis=1)); o['m2'] = T.asnp((R ** 2).mean(axis=1)); o['m4'] = T.asnp((R ** 4).mean(axis=1))
    Im = L.imag.reshape(B, J, nf, ns, nc)
    o['im2'] = T.asnp((Im ** 2).mean(axis=1))
    iz, ic, ib = FAM.index('ZETA'), FAM.index('CHI'), FAM.index('CHIB')
    D = T.DH_C1 * xp.exp(L[:, ic]) + T.DH_C2 * xp.exp(L[:, ib])
    lD = xp.log(xp.abs(D)).reshape(B, J, ns, nc)
    o['dhmax'] = T.asnp(lD.max(axis=1)); o['dhmin'] = T.asnp(lD.min(axis=1)); o['dhm1'] = T.asnp(lD.mean(axis=1)); o['dhm2'] = T.asnp((lD ** 2).mean(axis=1))
    mm = xp.stack([xp.log(xp.abs(T.tnr_factor(s, e3))) for s in SIG], axis=1)          # (BJ, ns)
    lT = (L[:, iz].real + mm[:, :, None]).reshape(B, J, ns, nc)
    o['tnrmax'] = T.asnp(lT.max(axis=1)); o['tnrmin'] = T.asnp(lT.min(axis=1)); o['tnrm1'] = T.asnp(lT.mean(axis=1)); o['tnrm2'] = T.asnp((lT ** 2).mean(axis=1))
    ea = xp.stack([L[:, iz, EA[k][0]].real + L[:, iz, EA[k][1]].real for k in (1, 2)], axis=1).reshape(B, J, 2, nc)
    o['eamax'] = T.asnp(ea.max(axis=1)); o['eamin'] = T.asnp(ea.min(axis=1)); o['eam1'] = T.asnp(ea.mean(axis=1)); o['eam2'] = T.asnp((ea ** 2).mean(axis=1))
    F = fL.reshape(B, J, nf, nc)
    o['fmax'] = T.asnp(xp.abs(F).max(axis=1)); o['fms'] = T.asnp((xp.abs(F) ** 2).mean(axis=1))
    cz = xp.asarray(np.array([(tnr1 - 1) * math.log(3) * 3 ** (-T.SIGB) if c >= 3 else 0 for c in cuts]))
    Ft = F[:, :, iz, :] + e3.reshape(B, J)[:, :, None] * cz[None, None, :]
    o['fmax_tnr'] = T.asnp(xp.abs(Ft).max(axis=1)); o['fms_tnr'] = T.asnp((xp.abs(Ft) ** 2).mean(axis=1))
    return o


def draw(band, B):
    if band == 'HAAR':
        return np.zeros(B, dtype=np.int64), True
    Tb = float(band)
    return rng.integers(int(Tb / 2), int(Tb), size=B, dtype=np.int64), False


Bc = max(1, KC // J)


def band_prime(ib):
    global rng
    band = bands[ib]
    rng = np.random.default_rng([a.seed, ib, 1])
    acc = {}
    done = 0
    while done < a.nwin:
        B = min(Bc, a.nwin - done)
        t0s, haar = draw(band, B)
        def work():
            L, fL, e3 = prime_chunk(t0s, haar)
            return stats_prime(L, fL, e3, B)
        o = T.retry(work)
        o['t0'] = t0s
        for k, v in o.items():
            acc.setdefault(k, []).append(v)
        T.free()
        done += B
    print(f'prime pass band {band}: {a.nwin} windows, {time.time()-t00:.0f}s', flush=True)
    return {f'P|{band}|{k}': np.concatenate(v, axis=0) for k, v in acc.items()}


def run_pool(fn, njobs):
    if T.GPU or T.nworkers() == 1:
        return [fn(i) for i in range(njobs)]
    import multiprocessing as mpc
    with mpc.get_context('fork').Pool(min(T.nworkers(), njobs)) as pool:
        return pool.map(fn, range(njobs), chunksize=1)


res = {}
for d in run_pool(band_prime, len(bands)):
    res.update(d)

# ---------------------------------------------------------------- composite pass
lev = T.Levels(Nc)
hp, lp = hi[:len(lev.primes)], lo[:len(lev.primes)]
assert np.array_equal(lev.primes, pr[:len(lev.primes)])
nn = np.arange(Nc + 1)
Ncuts = [c for c in (1e2, 1e3, 1e4, 1e5, 3e5, 1e6) if c <= Nc]
Lz = T.mangoldt(Nc)
Up = {f: U[f][:len(lev.primes)] for f in FAM}
sets = {
    'ZETA': Lz, 'SGN': Lz * T.completely_mult(Up['SGN'], lev), 'LIO': Lz * T.completely_mult(Up['LIO'], lev),
    'UNI': Lz * T.completely_mult(Up['UNI'], lev), 'CHI': Lz * T.chi5(nn),
    'DH': T.log_derivative_coeffs(T.dh_coeffs(Nc)), 'TNR': T.tnr_lambda(Nc),
    'EA': Lz * (np.maximum(nn, 1) ** 0.1 + np.maximum(nn, 1) ** -0.1),
}
CS = list(sets.keys())
coef = np.zeros((Nc + 1, len(CS) * len(Ncuts) + 3), dtype=complex)
for i, k in enumerate(CS):
    for j, c in enumerate(Ncuts):
        coef[:, i * len(Ncuts) + j] = sets[k] * (nn <= c)
HS = [0.5, T.SIGB, 0.75]
lg = lev.logn
for j, s in enumerate(HS):
    coef[1:, len(CS) * len(Ncuts) + j] = np.exp(TAU * lg[1:] ** 2 / 4 - (s - T.SIGB) * lg[1:])
l1 = np.array([[np.abs(sets[k][1:] * nn[1:] ** (-T.SIGB) * (nn[1:] <= c)).sum() for c in Ncuts] for k in CS])
l2 = np.array([[math.sqrt((np.abs(sets[k][1:] * nn[1:] ** (-T.SIGB) * (nn[1:] <= c)) ** 2).sum()) for c in Ncuts] for k in CS])
print(f'composite pass: Nc={Nc}, planned per-chunk allocation about {6e7*40/1e9:.1f} GB', flush=True)
npi = len(lev.primes)


def band_comp(ib):
    global rng
    band = bands[ib]
    rng = np.random.default_rng([a.seed, ib, 2])
    acc = {}
    for w in range(a.nwinc):
        t0s, haar = draw(band, 1)
        hb = np.repeat(rng.random((1, npi)), J, axis=0) if haar else None
        S = T.dir_sums(np.repeat(t0s, J), delta, T.SIGB, Nc, coef, lev, hp, lp, haar_base=hb)
        A = np.abs(S[:, :len(CS) * len(Ncuts)]).reshape(J, len(CS), len(Ncuts))
        H = np.log(np.abs(S[:, len(CS) * len(Ncuts):]))
        acc.setdefault('cmax', []).append(A.max(axis=0)); acc.setdefault('cms', []).append((A ** 2).mean(axis=0))
        acc.setdefault('hmax', []).append(H.max(axis=0)); acc.setdefault('hmin', []).append(H.min(axis=0))
        acc.setdefault('hm1', []).append(H.mean(axis=0)); acc.setdefault('hm2', []).append((H ** 2).mean(axis=0))
    print(f'composite pass band {band}: {a.nwinc} windows, {time.time()-t00:.0f}s', flush=True)
    return {f'C|{band}|{k}': np.stack(v, axis=0) for k, v in acc.items()}


for d in run_pool(band_comp, len(bands)):
    res.update(d)

meta = dict(P=P, Nc=Nc, J=J, step=a.step, nwin=a.nwin, nwinc=a.nwinc, bands=bands, SIG=SIG, FAM=FAM, cuts=cuts, Ncuts=Ncuts, CS=CS,
            HS=HS, TAU=TAU, tri=tri.tolist(), rms=rms.tolist(), l1=l1.tolist(), l2=l2.tolist(), gpu=T.GPU, seconds=time.time() - t00)
np.savez(a.out, meta=json.dumps(meta), **res)
print('saved', a.out, f'{time.time()-t00:.0f}s', flush=True)
