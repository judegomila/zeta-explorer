# Combination 4(a): sums of normalised cubic Gauss sums over split primes of Z[w], twisted by the dual index m.
#   g~(m, pi) = conj(psi_pi(m)) g~(pi),  psi_pi = cubic residue character mod pi,  g~(pi) = p^(-1/2) sum_x psi_pi(x) e(x/pi)
#   S(m; X) = sum over primary primes pi with N(pi) = p <= X, p = 1 mod 3 (both primes above p) of g~(m, pi) = T(m; X) + conj(T(conj m; X)),
#   T(m; X) = sum over the tabulated prime pi_p (b > 0) of conj(psi_{pi_p}(m)) g~(pi_p).
# Table: gauss6 records (tmp/sextic/gauss6.c): p, a, b, r, g, j0, six sextic periods eta_t; cubic Gauss sum = sum_t zeta6^(2 j0 t) eta_t.
# Controls: R = each g~(pi_p) multiplied by an independent random cube root of unity (keeps g~^3, the part fixed by the cubic character);
#           P = the table permuted among primes inside blocks of 256 consecutive primes.
# usage: gsum.py M out.json bin1 bin2 ...       indices: all m = u + v w with 1 <= N(m) <= M modulo +-1.
import sys, os, json, math, time
import numpy as np
import multiprocessing as mp
M = int(sys.argv[1]); OUT = sys.argv[2]; W = int(os.environ.get('RH_WORKERS', 2))
dt = np.dtype([('p', '<i8'), ('a', '<i8'), ('b', '<i8'), ('r', '<i8'), ('g', '<i8'), ('j0', '<i8'), ('er', '<f8', 6), ('ei', '<f8', 6)])
rec = np.concatenate([np.fromfile(f, dt) for f in sys.argv[3:]]); rec = rec[np.argsort(rec['p'], kind='stable')]
p = rec['p'].copy(); r = rec['r'].copy(); n = len(p); assert len(np.unique(p)) == n
print('primes p = 1 mod 3 in table: %d, max p = %d; planned memory: %d indices x %d checkpoints x 3 complex = %.3f GB' % (n, p.max(), 0, 0, 0), flush=True)
z6 = np.exp(1j*np.pi/3*np.arange(6)); eta = rec['er'] + 1j*rec['ei']
g3 = (eta*z6[(2*rec['j0'][:, None]*np.arange(6)[None, :]) % 6]).sum(1); gt = g3/np.sqrt(p)
print('check |g~| = 1: max deviation %.2e' % np.abs(np.abs(gt) - 1).max())
pi_ = rec['a'] + rec['b']*np.exp(2j*np.pi/3); c3 = gt**3
for nm, ref in (('pi/|pi|', pi_/np.abs(pi_)), ('conj(pi)/|pi|', np.conj(pi_)/np.abs(pi_))):
    q = c3/ref; print('check g~^3 against %s: max |ratio - mean ratio| = %.2e, mean ratio = %s' % (nm, np.abs(q - q.mean()).max(), np.round(q.mean(), 6)))
rng = np.random.default_rng(20261120)
gR = gt*np.exp(2j*np.pi/3*rng.integers(0, 3, n))
perm = np.arange(n)
for s in range(0, n, 256): perm[s:s+256] = rng.permutation(perm[s:s+256])
gP = gt[perm]
XS = np.unique(np.round(10**np.arange(3.0, math.log10(p.max()) + 1e-9, 0.125)).astype(np.int64)); XS = np.append(XS[XS < p.max()], p.max())
ci = np.searchsorted(p, XS, side='right') - 1
idx = []
B = int(math.isqrt(4*M//3)) + 2
for u in range(-B, B + 1):
    for v in range(-B, B + 1):
        N = u*u - u*v + v*v
        if 1 <= N <= M and (u > 0 or (u == 0 and v > 0)): idx.append((u, v, N))
idx.sort(key=lambda t: (t[2], t[0], t[1])); nI = len(idx)
print('indices modulo +-1 with N(m) <= %d: %d; checkpoints %d; output arrays %.3f GB' % (M, nI, len(XS), nI*len(XS)*3*16/1e9), flush=True)
E3 = (p - 1)//3; NB = int(E3.max()).bit_length(); r2 = (p - 1 - r) % p
om = np.exp(2j*np.pi/3*np.arange(3))
def one(t):
    u, v, N = t
    x = (u + v*r) % p; res = np.ones(n, np.int64); base = x.copy()
    for bit in range(NB):
        mask = ((E3 >> bit) & 1).astype(bool)
        res[mask] = res[mask]*base[mask] % p[mask]
        base = base*base % p
    e = np.where(res == 1, 0, np.where(res == r, 1, np.where(res == r2, 2, -1)))
    ok = e >= 0                                   # e = -1 only when pi | m
    ph = np.where(ok, np.conj(om[np.maximum(e, 0)]), 0)
    return np.stack([np.cumsum(ph*gt)[ci], np.cumsum(ph*gR)[ci], np.cumsum(ph*gP)[ci]])
if __name__ == '__main__':
    t0 = time.time()
    with mp.get_context('fork').Pool(W) as pool: T = np.array(pool.map(one, idx, chunksize=8))      # [index, variant, checkpoint]
    print('sums done %.0fs' % (time.time() - t0), flush=True)
    pos = {(u, v): i for i, (u, v, N) in enumerate(idx)}
    def cj(u, v):                                  # conj(u + v w) = (u - v) - v w, reduced modulo +-1
        a, b = u - v, -v
        if not (a > 0 or (a == 0 and b > 0)): a, b = -a, -b
        return pos[(a, b)]
    cjx = np.array([cj(u, v) for u, v, N in idx]); S = T + np.conj(T[cjx])
    cnt = 2.0*(ci + 1); Ns = np.array([t[2] for t in idx])
    res = dict(M=M, n_primes=int(n), pmax=int(p.max()), X=XS.tolist(), count=cnt.tolist(), n_indices=nI, rows=[])
    for j, X in enumerate(XS):
        row = dict(X=int(X), count=float(cnt[j]))
        for vi, nm in enumerate(('true', 'randcube', 'perm')):
            A = np.abs(S[:, vi, j]); k = int(np.argmax(A)); A100 = A[Ns <= 100]
            row[nm] = dict(sup=float(A[k]/cnt[j]), argsup=list(map(int, idx[k])), sup_N100=float(A100.max()/cnt[j]), rms=float(np.sqrt((A**2).mean())/cnt[j]),
                           at1=[float(S[pos[(1, 0)], vi, j].real), float(S[pos[(1, 0)], vi, j].imag)])
        res['rows'].append(row)
        print('X=%9d count=%8d | true sup %.5f (m=%s) rms %.5f S(1)=%.1f%+.1fi S(1) logX/X^(5/6) = %.4f | randcube sup %.5f rms %.5f | perm sup %.5f rms %.5f | sqrt(2 log nI/count) %.5f' % (
            X, cnt[j], row['true']['sup'], row['true']['argsup'][:2], row['true']['rms'], row['true']['at1'][0], row['true']['at1'][1], abs(complex(*row['true']['at1']))*math.log(X)/X**(5/6),
            row['randcube']['sup'], row['randcube']['rms'], row['perm']['sup'], row['perm']['rms'], math.sqrt(2*math.log(nI)/cnt[j])), flush=True)
    # per-index amplitude at the largest X: |S(m)| log X / X^(5/6) for the 12 largest
    A = np.abs(S[:, 0, -1]); o = np.argsort(-A)[:12]
    res['top_true'] = [dict(m=list(map(int, idx[k])), absS=float(A[k]), scaled=float(A[k]*math.log(XS[-1])/XS[-1]**(5/6))) for k in o]
    res['absS_last'] = dict(true=np.abs(S[:, 0, -1]).tolist(), randcube=np.abs(S[:, 1, -1]).tolist(), perm=np.abs(S[:, 2, -1]).tolist(), N=Ns.tolist())
    # polar term removed per index: S(m; X) = c_m L(X) + R(m; X), L(X) = sum over tabulated p <= X of 2 p^(-1/6) (Patterson main term shape),
    # c_m complex, least squares over the checkpoints X >= 1e4 with weights 1/count. Residual statistics per checkpoint.
    Lx = 2.0*np.cumsum(p.astype(float)**(-1.0/6))[ci]; sel = XS >= 1e4; wgt = 1.0/cnt[sel]
    res['polar'] = {}
    for vi, nm in enumerate(('true', 'randcube', 'perm')):
        c = (S[:, vi, :][:, sel]*(Lx[sel]*wgt)[None, :]).sum(1)/(Lx[sel]**2*wgt).sum()
        Rm = S[:, vi, :] - c[:, None]*Lx[None, :]; A = np.abs(Rm)
        rows_ = [dict(X=int(XS[j]), sup=float(A[:, j].max()/cnt[j]), rms=float(np.sqrt((A[:, j]**2).mean())/cnt[j]), sup_over_sqrtcount=float(A[:, j].max()/math.sqrt(cnt[j])), rms_over_sqrtcount=float(np.sqrt((A[:, j]**2).mean()/cnt[j]))) for j in range(len(XS))]
        xs_ = XS[sel].astype(float); e_sup = float(np.polyfit(np.log(xs_), np.log([r_['sup'] for r_, s_ in zip(rows_, sel) if s_]), 1)[0]); e_rms = float(np.polyfit(np.log(xs_), np.log([r_['rms'] for r_, s_ in zip(rows_, sel) if s_]), 1)[0])
        res['polar'][nm] = dict(rows=rows_, exp_sup=e_sup, exp_rms=e_rms, abs_c=dict(max=float(np.abs(c).max()), rms=float(np.sqrt((np.abs(c)**2).mean())), at1=float(abs(c[pos[(1, 0)]])), frac_above_0p1=float((np.abs(c) > 0.1).mean())),
                                c_by_norm=[[int(Ns[k]), float(abs(c[k]))] for k in np.argsort(-np.abs(c))[:10]])
        print('polar removed [%s]: exponent of sup/count %.3f, of rms/count %.3f; at X max: sup/sqrt(count) %.3f rms/sqrt(count) %.3f; |c_m|: max %.3f rms %.3f, c_1 %.3f, share |c_m| > 0.1: %.3f' % (
            nm, e_sup, e_rms, rows_[-1]['sup_over_sqrtcount'], rows_[-1]['rms_over_sqrtcount'], np.abs(c).max(), np.sqrt((np.abs(c)**2).mean()), abs(c[pos[(1, 0)]]), (np.abs(c) > 0.1).mean()), flush=True)
    def fit(nm, key, lo=1e4):
        xs = np.array([r_['X'] for r_ in res['rows']], float); ys = np.array([r_[nm][key] for r_ in res['rows']]); s = xs >= lo
        sl, ic = np.polyfit(np.log(xs[s]), np.log(ys[s]), 1); return float(sl)
    res['exponents'] = {nm: dict(sup=fit(nm, 'sup'), sup_N100=fit(nm, 'sup_N100'), rms=fit(nm, 'rms')) for nm in ('true', 'randcube', 'perm')}
    print('fitted exponents of sup/count, sup(N<=100)/count, rms/count against X (X >= 1e4):', res['exponents'])
    json.dump(res, open(OUT, 'w'))
    print('DONE %.0fs' % (time.time() - t0))
