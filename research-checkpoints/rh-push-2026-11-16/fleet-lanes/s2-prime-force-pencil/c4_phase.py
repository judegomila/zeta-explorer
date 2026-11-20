"""Combination 4: zero-conditioned prime phase sums.
For a list of ordinates gamma_1..gamma_M in a window, s_p = (1/M) sum_j exp(i gamma_j log p) for every prime p <= PMAX
(Gaussian-gridding non-uniform FFT in the variable u = log p, 6-point Lagrange interpolation at log p), then cumulative
 A_fam(P) = sum_{p<=P} c_fam(p) log p p^(-1/2) [s_p]   at checkpoints P (40 per decade).
Usage: c4_phase.py PMAX OUT.json SPEC [SPEC ...]    SPEC = name:list:i0:i1   (list as in lib.load_list, or poisson<seed>@name copies the window
of an earlier spec with uniform random heights);  i0:i1 index range of the list (i1 = 0: to the end)."""
import sys, json, math, time, numpy as np
import lib, primes
from lib import log

R_OVER = 3.0; OSU = 8.0; SIG = 1.6; J = 10

def nufft_S(v, U):
    """S(u) = sum_j exp(i v_j u), v >= 0, on the grid u_m = m du covering [0, U]; returns (S, du).
    Gaussian gridding on the frequency grid n*dv (period of the transform in u: 2 pi/dv = R_OVER*U); the fine u-grid is produced by Q
    interleaved FFTs of the small size K2 (the occupied band), so the transient memory is K2 complex numbers."""
    import scipy.fft as sfft
    H = float(v.max()) + 1.0
    dv = 2 * math.pi / (R_OVER * U)
    K2 = int(2 ** math.ceil(math.log2(H / dv + 4 * J + 8)))
    du2 = 2 * math.pi / (K2 * dv)
    Q = max(1, int(math.ceil(du2 * OSU * H / math.pi))); du = du2 / Q
    n2 = int(U / du2) + 4; mtot = n2 * Q
    log('  nufft: H=%.4g band grid 2^%d, %d interleaved FFTs, stored %d complex (%.2f GB), du=%.3e, H*du=%.3f rad' % (H, int(math.log2(K2)), Q, mtot, mtot * 16 / 1e9, du, H * du))
    a = v / dv; n0 = np.rint(a).astype(np.int64) + J + 2; fr = a - np.rint(a)
    c = np.zeros(K2)
    for j in range(-J, J + 1):
        c += np.bincount(n0 + j, weights=np.exp(-(j - fr) ** 2 / (2 * SIG * SIG)), minlength=K2)
    nn = np.arange(K2) - (J + 2)                      # true frequency index of bin k is k - (J+2)
    S = np.empty(mtot, dtype=np.complex128)
    m2 = np.arange(n2)
    for r in range(Q):
        ur = r * du                                    # u = m2*du2 + ur
        tw = c * np.exp(1j * np.mod(nn * dv * ur, 2 * math.pi))
        F = sfft.ifft(tw) * K2                         # sum_k tw_k exp(2 pi i k m/K2) = sum_k tw_k exp(i k dv m du2)
        S[r::Q] = F[:n2] * np.exp(-1j * np.mod((J + 2) * dv * m2 * du2, 2 * math.pi))
    phi = dv * du * np.arange(mtot)
    S *= np.exp(0.5 * SIG * SIG * phi * phi) / (SIG * math.sqrt(2 * math.pi))
    return S, du

LAG = np.arange(-2, 4)
def lagrange6(S, t):
    """6-point Lagrange interpolation of S at fractional index t."""
    i0 = np.floor(t).astype(np.int64); f = t - i0
    i0 = np.clip(i0, 2, len(S) - 4)
    out = np.zeros(len(t), dtype=np.complex128)
    for a in range(6):
        w = np.ones(len(t))
        for b in range(6):
            if b != a: w *= (f - LAG[b]) / (LAG[a] - LAG[b])
        out += w * S[i0 + LAG[a]]
    return out

if __name__ == '__main__':
    pmax = int(float(sys.argv[1])); out = sys.argv[2]; specs = sys.argv[3:]
    U = math.log(pmax) * 1.0005
    lists = {}; res = dict(pmax=pmax, lists={})
    rng_direct = np.random.default_rng(7)
    for sp in specs:
        name, lst, i0, i1 = sp.split(':'); i0 = int(float(i0)); i1 = int(float(i1))
        if lst.startswith('poisson'):
            seed, ref = lst[7:].split('@'); gref = lists[ref]['g']
            g = np.sort(np.random.default_rng(int(seed)).uniform(gref[0], gref[-1], len(gref))); cond = lists[ref]['cond']
        else:
            g, cond, _ = lib.load_list(lst); g = g[i0:(i1 if i1 else len(g))]
        T0 = float(np.floor(g[0])); M = len(g)
        log('%s: M=%d ordinates in [%.3f, %.3f], cond %g' % (name, M, g[0], g[-1], cond))
        S, du = nufft_S(g - T0, U)
        L = np.log(cond * g / (2 * math.pi)); 
        lists[name] = dict(g=g, T0=T0, S=S, du=du, cond=cond)
        res['lists'][name] = dict(M=M, T_lo=float(g[0]), T_hi=float(g[-1]), cond=cond, L_mean=float(L.mean()), L_min=float(L.min()), L_max=float(L.max()),
                                  inv_L_mean=float((1 / np.maximum(L, 0.3)).mean()), L_hist=np.histogram(L, bins=64)[0].tolist(), L_edges=np.histogram(L, bins=64)[1].tolist(),
                                  cps=[], direct=[], qvals={})
        # single primes for T-NR, direct
        for q in (2, 3, 5, 101, 1000003):
            res['lists'][name]['qvals'][str(q)] = [float(np.cos(g * math.log(q)).mean()), float(np.sin(g * math.log(q)).mean())]
    cps = np.unique(np.concatenate([[2.5, 3.5, 6, 8], 10 ** (np.arange(40, 40 * math.log10(pmax) + 0.5) / 40.0)]))
    cps = cps[cps <= pmax * 1.0000001]
    FAMS = ['true', 'r1', 'r2', 'r3', 'r4', 'r0', 'rsign', 'thin', 'uni1', 'uni2']
    acc = {nm: {f: 0j for f in FAMS} for nm in lists}
    glob = dict(sum_log2_over_p=0.0, sum_log_over_p=0.0, npr=0, nthin=0)
    thin = primes.Thin(0.9); ci = 0; t0 = time.time(); nseg = 0
    B1 = 1.0; B2 = 0.25
    def flush(P):
        for nm in lists:
            res['lists'][nm]['cps'].append(dict(P=float(P), **{f: [acc[nm][f].real, acc[nm][f].imag] for f in FAMS}))
        res.setdefault('glob', []).append(dict(P=float(P), **glob))
    for pr in primes.prime_segments(pmax):
        nseg += 1
        prf = pr.astype(np.float64); u = np.log(prf); w = u / np.sqrt(prf)
        r5 = pr % 5; tf = thin.flags(pr); sg = primes.sign_hash(pr)
        # positions of checkpoints inside this segment
        cut = np.searchsorted(prf, cps[ci:], side='right'); ncut = int((cps[ci:] <= prf[-1]).sum())
        cuts = [0] + [int(c) for c in cut[:ncut]] + [len(pr)]
        vals = {}
        for nm, d in lists.items():
            s = lagrange6(d['S'], u / d['du']) * np.exp(1j * np.mod(d['T0'] * u, 2 * math.pi)) / len(d['g'])
            vals[nm] = s
            if nseg in (1, 2) or nseg % 37 == 0:   # direct check on a few primes of this segment
                for ii in rng_direct.integers(0, len(pr), 2):
                    dd = np.exp(1j * d['g'] * u[ii]).mean()
                    res['lists'][nm]['direct'].append([int(pr[ii]), abs(complex(dd) - complex(s[ii])), abs(complex(dd))])
        for i, (a, b) in enumerate(zip(cuts[:-1], cuts[1:])):
            if b > a:
                sl = slice(a, b); ws = w[sl]
                for nm in lists:
                    s = vals[nm][sl]; A = acc[nm]; ws_s = ws * s
                    A['true'] += ws_s.sum()
                    for r in range(5):
                        m = r5[sl] == r
                        if m.any(): A['r%d' % r] += ws_s[m].sum()
                    A['rsign'] += (ws_s * sg[sl]).sum(); A['thin'] += ws_s[tf[sl]].sum()
                    A['uni1'] += (ws_s * np.exp(1j * B1 * u[sl])).sum(); A['uni2'] += (ws_s * np.exp(1j * B2 * u[sl])).sum()
                glob['sum_log2_over_p'] += float((u[sl] ** 2 / prf[sl]).sum()); glob['sum_log_over_p'] += float((u[sl] / prf[sl]).sum())
                glob['npr'] += b - a; glob['nthin'] += int(tf[sl].sum())
            if i < ncut: flush(cps[ci + i])     # all primes <= this checkpoint are in
        ci += ncut
        if nseg % 20 == 0: log('  segment %d primes to %d  (%.0fs)' % (nseg, pr[-1], time.time() - t0))
    while ci < len(cps): flush(cps[ci]); ci += 1
    json.dump(res, open(out, 'w'))
    log('done %d primes, thin %d' % (glob['npr'], glob['nthin']))
