"""Combination 4: prime phase resultant with Fejer weight, pole removed.

R_F(phi; P) = sum_{n <= P} Lambda_F(n) n^(-1/2) (1 - log n / L) e^(-i phi log n),  L = log P   (prime powers included;
the prime-only part is reported separately).  Explicit formula (zeta, s = 1/2 + i phi):
   Re R = beta(phi) + Re Pole(phi) - sum_rho Re[ L h((rho - s) L) ] + O(P^(-5/2)),   h(z) = (e^z - 1 - z) / z^2,
   Pole = L h((1 - s) L),  beta = (1/2) Re psi(s/2 + 1) - (1/2) log pi + (1/(4L)) Re psi'(s/2 + 1).
An on-line zero contributes -(L/2) sinc^2((gamma - phi) L / 2) <= 0, so V := Re R - Re Pole - beta <= 0 for every
phi and P when all zeros are on the line; a zero with offset d at distance D contributes up to P^d / ((d^2 + D^2) L).
Grid: phi = k * dphi (NUFFT), fine sampling by shifted transforms.
"""
import sys, math, json, time, argparse, os
import numpy as np, mpmath as mp
import torus as T, s3lib as S
from torus import xp, GPU, asnp

ap = argparse.ArgumentParser()
ap.add_argument('--Pmax', type=float, default=1e6)
ap.add_argument('--checks', default='1e4,1e5,1e6')
ap.add_argument('--phimax', type=float, default=1e3)
ap.add_argument('--dphi', type=float, default=0.1)
ap.add_argument('--fine', type=int, default=10)
ap.add_argument('--nf', type=int, default=0)
ap.add_argument('--w', type=int, default=12)
ap.add_argument('--seg', type=float, default=2 ** 27)
ap.add_argument('--ea', type=float, default=0.1)
ap.add_argument('--b', type=float, default=0.75)
ap.add_argument('--out', default='c4.json')
ap.add_argument('--save', default='')
ap.add_argument('--split', type=int, default=1)     # 1: report the prime-only part separately (second set of grids)
a = ap.parse_args()
t00 = time.time()
Pmax = int(a.Pmax); CH = [int(float(x)) for x in a.checks.split(',')]
M = 2 * int(round(a.phimax / a.dphi))
nf = a.nf or (1 << int(math.ceil(math.log2(2.6 * M))))
nf = min(nf, int(os.environ.get('C4_NF_CAP', 50331648))) if M >= 2 ** 24 else nf      # 3 * 2^24: sigma 2.5 at M = 2e7 (GPU memory shared with other jobs)
assert a.dphi * math.log(Pmax) < 2 * math.pi * 0.8
NG = 10
names_g = ['c1', 'c2', 'c3', 'c4', 'sgn', 'unic', 'unis', 'eap', 'eam', 'del']
SP = T.retry(S.Spreader, 2 * NG, nf, M, a.w)
kpos = xp.arange(M // 2, M)                       # indices of k = 0 .. M/2-1 in the transform output
phi0 = xp.arange(0, M // 2, dtype=xp.float64) * a.dphi


def strengths(p, k=1, q=None):
    """(2 NG, n) strengths for terms n = q^k located at k log q; p = q^k values (xp int64), q the primes."""
    q = p if q is None else q
    lq = xp.log(q.astype(xp.float64))
    u = k * lq
    base = lq * xp.exp(-0.5 * u)
    C = xp.zeros((2 * NG, len(p)), dtype=xp.float64)
    r = p % 5
    for i in range(4):
        C[i] = base * (r == i + 1)
    sg = xp.where(S.hash_unit(q, 1) < 0.5, -1.0, 1.0)
    C[4] = base * sg ** k
    ang = 2 * math.pi * k * S.hash_unit(q, 2)
    C[5] = base * xp.cos(ang); C[6] = base * xp.sin(ang)
    C[7] = base * xp.exp(a.ea * u); C[8] = base * xp.exp(-a.ea * u)
    C[9] = base * (S.hash_unit(q, 3) < xp.exp((a.b - 1) * lq))
    C[NG:] = C[:NG] * u[None, :]
    return u, C


def seg_task(args):
    lo, hi = args
    return S.seg_primes(lo, hi, BASE)


BASE = T.sieve(int(math.isqrt(Pmax)) + 2)
edges = []
lo = 0
for c in CH:
    while lo < c:
        hi = min(c, lo + int(a.seg)); edges.append((lo, hi)); lo = hi
# prime powers k >= 2
pp = []
for q in BASE:
    q = int(q); k = 2
    while q ** k <= Pmax:
        pp.append((q ** k, q, k)); k += 1
pp.sort()
pp = np.array(pp, dtype=np.int64)
print(f'Pmax={Pmax} M={M} nf={nf} sigma={nf / M:.2f} w={a.w} segments={len(edges)} prime powers={len(pp)} GPU={GPU}', flush=True)

mp.mp.dps = 20


def beta_arr(phis, L, kind):
    """beta_F(phi) incl. the 1/L term (numpy, asymptotic digamma for large argument, mp for small)."""
    out = np.empty(len(phis))
    for i, ph in enumerate(phis):
        s = mp.mpc(0.5, ph)
        if kind == 'zeta':
            z = s / 2 + 1; out[i] = float(mp.re(mp.digamma(z)) / 2 - mp.log(mp.pi) / 2 + mp.re(mp.polygamma(1, z)) / (4 * L))
        else:
            z = (s + 1) / 2; out[i] = float(mp.re(mp.digamma(z)) / 2 + mp.log(5 / mp.pi) / 2 + mp.re(mp.polygamma(1, z)) / (4 * L))
    return out


def beta_fast(phi, L, kind):
    """xp version: digamma by asymptotic series after shifting the argument by 8."""
    z = (0.5 + 1j * phi) / 2 + 1 if kind == 'zeta' else (0.5 + 1j * phi + 1) / 2
    z = z.astype(xp.complex128)
    acc = xp.zeros_like(z); acc1 = xp.zeros_like(z)
    for _ in range(8):
        acc -= 1 / z; acc1 += 1 / (z * z); z = z + 1
    zi = 1 / z; z2 = zi * zi
    psi = xp.log(z) - zi / 2 - z2 / 12 + z2 * z2 / 120 - z2 ** 3 / 252 + acc
    psi1 = zi + z2 / 2 + z2 * zi / 6 - z2 * z2 * zi / 30 + acc1
    c = -0.5 * math.log(math.pi) if kind == 'zeta' else 0.5 * math.log(5 / math.pi)
    return psi.real / 2 + c + psi1.real / (4 * L)


def hL(z, L):
    """L h(z L) = (e^{zL} - 1 - zL) / (z^2 L) for complex xp array z (|z L| not small)."""
    return (xp.exp(z * L) - 1 - z * L) / (z * z * L)


def direct_terms(phi, terms, L):
    """sum of c * n^(-1/2) (1 - log n / L) e^{-i phi log n} over a short python list of (c, log n)."""
    out = xp.zeros(phi.shape, dtype=xp.complex128)
    for c, ln in terms:
        if ln < L:
            out += c * math.exp(-ln / 2) * (1 - ln / L) * xp.exp(-1j * phi * ln)
    return out


TNR_L = None
PP_DONE = 0
res = {'meta': dict(vars(a)), 'M': M, 'nf': nf, 'checks': []}
NB, BW, BLO = 800, 0.25, -150.0


def checkpoint(P, npr):
    L = math.log(P)
    global PP_DONE
    if a.split:
        sel = pp[pp[:, 0] <= P]
        SPP = S.Spreader(2 * NG, nf, M, w=a.w)           # prime powers k >= 2 up to P
        tgt = SPP
    else:
        sel = pp[(pp[:, 0] <= P) & (pp[:, 0] > PP_DONE)]
        SPP = None; tgt = SP                             # prime powers go into the main grids
        PP_DONE = P
    for k in np.unique(sel[:, 2]):
        s = sel[sel[:, 2] == k]
        u, C = strengths(xp.asarray(s[:, 0]), int(k), xp.asarray(s[:, 1]))
        tgt.add(u * a.dphi, C)
    row = dict(P=P, L=L, primes=npr, fams={}, seconds=time.time() - t00)
    stats = {}
    saved = {}
    for sh in range(a.fine):
        shift = sh / a.fine
        phi = phi0 + shift * a.dphi
        kh = S.es_hat(xp.arange(-M // 2, M // 2).astype(xp.float64) + shift, nf, a.w, SP.beta)

        def tr(sp, g, fej=True):
            F0 = sp.transform(g, shift=shift, kh=kh)[kpos]
            if not fej:
                return F0
            F1 = sp.transform(g + NG, shift=shift, kh=kh)[kpos]
            return F0 - F1 / L
        Fp = [tr(SP, g) for g in range(NG)]            # primes
        Fq = [tr(SPP, g) for g in range(NG)] if a.split else [0.0 * Fp[0]] * NG
        T.free()
        l5 = math.log(5); l3 = math.log(3)
        five = [(l5, k * l5) for k in range(1, 60)]
        z5p = direct_terms(phi, five[:1], L); z5q = direct_terms(phi, five[1:], L)
        chi = [1, 1j, -1j, -1]; dh = [1.0, T.KAPPA, -T.KAPPA, -1.0]
        fam = {}
        zp = Fp[0] + Fp[1] + Fp[2] + Fp[3] + z5p; zq = Fq[0] + Fq[1] + Fq[2] + Fq[3] + z5q
        fam['ZETA'] = (zp, zq)
        fam['CHI'] = (sum(chi[i] * Fp[i] for i in range(4)), sum(chi[i] * Fq[i] for i in range(4)))
        fam['DHP'] = (sum(dh[i] * Fp[i] for i in range(4)), None)
        fam['SGN'] = (Fp[4], Fq[4])
        fam['UNI'] = (Fp[5] + 1j * Fp[6], Fq[5] + 1j * Fq[6])
        fam['EA'] = (Fp[7] + Fp[8] + z5p * 0 + direct_terms(phi, [(l5 * (5 ** a.ea), l5), (l5 * (5 ** -a.ea), l5)], L),
                     Fq[7] + Fq[8] + direct_terms(phi, [(l5 * (5 ** (a.ea * k) + 5 ** (-a.ea * k)), k * l5) for k in range(2, 60)], L))
        d5 = float(asnp(S.hash_unit(xp.asarray(np.array([5])), 3))[0]) < 5 ** (a.b - 1)
        fam['DEL'] = (zp - Fp[9] - (z5p if d5 else 0), zq - Fq[9] - (z5q if d5 else 0))
        fam['THIN'] = (zp - 2 * Fp[9] - (2 * z5p if d5 else 0), zq - (0 if not d5 else 0) + 0 * zq)
        # THIN: sign flip on S: prime powers k: (-1)^k on S -> even k unchanged; approximate by leaving k >= 2 unchanged except odd k (neglected, k >= 3)
        al1 = -(T.TNR_C / 2 + math.sqrt(T.TNR_C ** 2 / 4 - 1)); al2 = 1 / al1
        tn = [(-l3 * (al1 ** k + al2 ** k) * 3 ** (k / 2), k * l3) for k in range(1, 80)]
        fam['TNR'] = (zp + direct_terms(phi, tn[:1], L), zq + direct_terms(phi, tn[1:], L))
        s = 0.5 + 1j * phi
        pole = hL(0.5 - 1j * phi, L).real
        bz = beta_fast(phi, L, 'zeta'); bc = beta_fast(phi, L, 'chi')
        thr = {'ZETA': bz + pole, 'CHI': bc, 'DHP': bc, 'SGN': bz, 'UNI': bz, 'DEL': bz + pole, 'THIN': bz + pole,
               'TNR': bz + pole + l3,
               'EA': 2 * bz + hL(0.5 + a.ea - 1j * phi, L).real + hL(0.5 - a.ea - 1j * phi, L).real}
        for f, (rp, rq) in fam.items():
            for tag, Rv in (('all', rp + (rq if rq is not None else 0)), ('primes', rp)):
                V = Rv.real - thr[f]
                V = V[1:] if sh == 0 else V          # drop phi = 0
                ph = phi[1:] if sh == 0 else phi
                key = (f, tag)
                st = stats.setdefault(key, dict(n=0, s1=0.0, s2=0.0, mx=-1e300, amx=0.0, mn=1e300, amn=0.0, pos=0,
                                                hist=np.zeros(NB, dtype=np.int64), low=dict(mx=-1e300, amx=0.0, pos=0, n=0)))
                st['n'] += int(V.size); st['s1'] += float(V.sum()); st['s2'] += float((V * V).sum())
                i = int(V.argmax()); v = float(V[i])
                if v > st['mx']:
                    st['mx'] = v; st['amx'] = float(ph[i])
                i = int(V.argmin()); v = float(V[i])
                if v < st['mn']:
                    st['mn'] = v; st['amn'] = float(ph[i])
                st['pos'] += int((V > 0).sum())
                st['hist'] += asnp(xp.bincount(xp.clip(xp.floor((V - BLO) / BW), 0, NB - 1).astype(xp.int64), minlength=NB))
                # low window phi in [5, 21.4]: below a quarter of the first DH off-line height, below the first zeta zero region
                m = (ph >= 1.0) & (ph <= 21.4)
                if bool(m.any()):
                    Vl = V[m]; i = int(Vl.argmax())
                    if float(Vl[i]) > st['low']['mx']:
                        st['low']['mx'] = float(Vl[i]); st['low']['amx'] = float(ph[m][i])
                    st['low']['pos'] += int((Vl > 0).sum()); st['low']['n'] += int(Vl.size)
            if a.save and f in ('ZETA', 'TNR', 'CHI', 'SGN') and P == CH[-1]:
                saved.setdefault(f, []).append(asnp((rp + rq).real - thr[f]).astype(np.float32))
        del Fp, Fq, fam
        T.free()
    for (f, tag), st in stats.items():
        n = st['n']; mean = st['s1'] / n
        row['fams'][f + ':' + tag] = dict(n=n, mean=mean, std=math.sqrt(max(st['s2'] / n - mean * mean, 0)), max=st['mx'], argmax=st['amx'],
                                          min=st['mn'], argmin=st['amn'], frac_pos=st['pos'] / n, npos=st['pos'], low=st['low'],
                                          hist=st['hist'].tolist())
    res['checks'].append(row)
    res['hist_bins'] = [BLO, BW, NB]
    json.dump(res, open(a.out, 'w'))
    if saved:
        np.savez(a.save, dphi=a.dphi, fine=a.fine, **{f: np.stack(v, axis=1).ravel() for f, v in saved.items()})
    print(f'checkpoint P={P:.1e} primes={npr} t={time.time() - t00:.0f}s  ' +
          '  '.join(f"{f}: max {row['fams'][f + ':all']['max']:+.3f} pos {row['fams'][f + ':all']['frac_pos']:.2e}" for f in ('ZETA', 'CHI', 'SGN', 'UNI', 'DEL', 'TNR', 'EA')), flush=True)
    del SPP
    T.free()


if __name__ == '__main__':
    import multiprocessing as mpc
    nw = max(1, T.nworkers() - 1)
    npr = 0
    ci = 0
    with mpc.get_context('fork').Pool(nw) as pool:
        for b0 in range(0, len(edges), nw):
            batch = edges[b0:b0 + nw]
            for (lo, hi), p in zip(batch, pool.map(seg_task, batch)):
                if lo == 0:
                    p = np.concatenate([[2], p])
                p = p[p != 5]
                npr += len(p) + (1 if lo <= 5 < hi else 0)
                for i in range(0, len(p), 4_000_000):
                    px = xp.asarray(p[i:i + 4_000_000])
                    u, C = strengths(px)
                    T.retry(SP.add, u * a.dphi, C)
                    del u, C, px
                if hi == CH[ci]:
                    checkpoint(CH[ci], npr); ci += 1
            if (b0 // nw) % 10 == 0:
                print(f'sieved to {batch[-1][1]:.3e} primes {npr} t={time.time() - t00:.0f}s', flush=True)
    print('done', f'{time.time() - t00:.0f}s', flush=True)
