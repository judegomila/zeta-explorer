#!/usr/bin/env python3
"""Statistic 2 (float64 screen). M(V) = int_V^2V |I|^2, I(omega) = sum lambda_k e^(i n theta_k) T^(omega - n lambda_k)."""
import sys, os, json, math, time
import numpy as np
from sets import Row, CUT
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=8 * 1024 ** 3)
    xp = cp
except Exception as e:
    print('no cupy:', e, flush=True); cp = None; xp = np

YC, H, A, W, DG = 5.5, 1.5, 4, 100.0, 1.0 / 32
OUT = 'out2'
def to_np(a): return cp.asnumpy(a) if cp is not None and isinstance(a, cp.ndarray) else np.asarray(a)

def kern(xi):
    u = H * xi / A
    s = xp.where(xp.abs(u) < 1e-8, 1.0, xp.sin(u) / xp.where(u == 0, 1.0, u))
    return H * s ** A

def rows2():
    R = []
    def add(name, vexp, wmode='std', **kw): R.append((dict(name=name, **kw), vexp, wmode))
    V1 = list(range(7, 21))
    add('CYC', V1, kind='CYC', phase='pi'); add('CYCP', V1, kind='CYCP', phase='pi')
    for e in (1e-10, 1e-8, 1e-6, 1e-4, 1e-2): add('CYCeps_%g' % e, V1, kind='CYCeps', phase='pi', eps=e)
    add('HQ1', V1, kind='HQ1', phase='+'); add('ETA', V1, kind='ETA', phase='+')
    for ph, ps in (('+', 0), ('alt', 0), ('rand', 1), ('rand', 2), ('rand', 3)):
        add('D1_%s%s' % (ph, ps or ''), V1, kind='D1', phase=ph, pseed=ps)
    for rs in (1, 2, 3):
        for ph, ps in (('+', 0), ('rand', 1)):
            add('D1R%d_%s%s' % (rs, ph, ps or ''), V1, kind='D1', phase=ph, pseed=ps, rseed=rs)
    for J in (1, 2, 4, 16, 64):
        for ph, ps in (('+', 0), ('alt', 0), ('rand', 1)):
            add('INJ%d_%s%s' % (J, ph, ps or ''), V1, kind='INJ', phase=ph, pseed=ps, J=J)
    add('DEL_D1', V1, 'del', kind='D1', phase='+'); add('THIN_D1', V1, 'thin', kind='D1', phase='+')
    add('DEL_D2', list(range(5, 14)), 'del', kind='D2', phase='+'); add('THIN_D2', list(range(5, 14)), 'thin', kind='D2', phase='+')
    V2 = list(range(5, 14))
    for ph, ps in (('+', 0), ('alt', 0), ('rand', 1), ('rand', 2), ('rand', 3)):
        add('D2_%s%s' % (ph, ps or ''), V2, kind='D2', phase=ph, pseed=ps)
    for ph, ps in (('+', 0), ('rand', 1)):
        add('D2R1_%s%s' % (ph, ps or ''), V2, kind='D2', phase=ph, pseed=ps, rseed=1)
    for kind, VV in (('D4', [3, 4, 5, 6]), ('DE', [3, 4, 5, 6, 7])):
        for rs in (None, 1):
            for ph, ps in (('+', 0), ('rand', 1)):
                add('%s%s_%s%s' % (kind, 'R1' if rs else '', ph, ps or ''), VV, kind=kind, phase=ph, pseed=ps, rseed=rs)
    return R

def field(row, V, wmode):
    """I(omega) e^(-i omega y_c) on the grid omega = V - W + i/32, i = 0..G-1"""
    x0 = V - W; x1 = 2 * V + W
    G = int(round((x1 - x0) / DG)) + 2
    gre = xp.zeros(G); gim = xp.zeros(G)
    nsp = 0
    CH = 200000; BUD = 2.0e7
    a = 0
    while a < row.count:
        b = min(a + CH, row.count)
        lam, th = row.chunk(a, b, xp)
        if wmode != 'std':            # weights lambda e^(-n lambda/2): only n lambda < 90 matter, so nothing above x0 > 90
            pass
        nlo = xp.maximum(1, xp.ceil(x0 / lam)).astype(xp.int64)
        nhi = xp.floor(x1 / lam).astype(xp.int64)
        cnt = xp.maximum(nhi - nlo + 1, 0)
        cs = xp.cumsum(cnt)
        tot = int(cs[-1])
        if tot > 0:
            # split positions into pieces of at most BUD spikes
            cs_np = to_np(cs); p0 = 0
            while p0 < len(cs_np):
                base = cs_np[p0 - 1] if p0 > 0 else 0
                p1 = int(np.searchsorted(cs_np, base + BUD, side='right'))
                p1 = max(p1, p0 + 1); p1 = min(p1, len(cs_np))
                c = cnt[p0:p1]; l = lam[p0:p1]; t_ = th[p0:p1]; nl = nlo[p0:p1]
                m = int(c.sum())
                if m > 0:
                    idx = xp.repeat(xp.arange(p1 - p0), to_np(c).tolist() if xp is np else c)
                    st = xp.cumsum(c) - c
                    n = nl[idx] + (xp.arange(m) - st[idx])
                    ll = l[idx]
                    x = n * ll
                    if wmode == 'std': amp = ll
                    elif wmode == 'del': amp = ll * xp.exp(-0.5 * x)
                    else: amp = ll * xp.exp(-0.5 * x) * (n % 2) * 2.0
                    ph = n * t_[idx] - x * YC
                    g = (x - x0) / DG
                    i0 = xp.floor(g).astype(xp.int64); f = g - i0
                    ok = (i0 >= 0) & (i0 < G - 1)
                    i0 = i0[ok]; f = f[ok]; cr = (amp * xp.cos(ph))[ok]; ci = (amp * xp.sin(ph))[ok]
                    gre += xp.bincount(i0, weights=cr * (1 - f), minlength=G) + xp.bincount(i0 + 1, weights=cr * f, minlength=G)
                    gim += xp.bincount(i0, weights=ci * (1 - f), minlength=G) + xp.bincount(i0 + 1, weights=ci * f, minlength=G)
                    nsp += m
                p0 = p1
        if float(lam[-1]) > x1: break
        a = b
    grid = gre + 1j * gim
    del gre, gim
    nk = int(round(W / DG))
    K = xp.zeros(G)
    xi = xp.arange(-nk, nk + 1) * DG
    kv = kern(xi)
    K[:nk + 1] = kv[nk:]; K[-nk:] = kv[:nk]
    I = xp.fft.ifft(xp.fft.fft(grid) * xp.fft.fft(K))
    return x0, I, nsp

def run(args, vexp, wmode):
    name = args['name']
    res = dict(name=name, V=[], M=[], maxI=[], argmax=[], nspikes=[], probe=[])
    rng = np.random.default_rng(7)
    for m in vexp:
        V = 2.0 ** m
        kw = dict(args); kw['Lmax'] = 2 * V + W + 1
        row = Row(**kw)
        G = int((V + 2 * W) / DG) + 2
        print('%s V=2^%d: lambdas %d, grid %d complex doubles = %.3f GB (x about 5 live in the FFT step)' % (name, m, row.count, G, G * 16 / 2 ** 30), flush=True)
        t0 = time.time()
        x0, I, nsp = field(row, V, wmode)
        i0 = int(round(W / DG)); i1 = i0 + int(round(V / DG))
        a2 = xp.abs(I[i0:i1]) ** 2
        M = float(a2.sum()) * DG
        im = int(xp.argmax(a2)); ip = int(rng.integers(0, i1 - i0))
        Ic = to_np(I[xp.asarray([i0 + im, i0 + ip])])
        res['V'].append(V); res['M'].append(M); res['maxI'].append(float(abs(Ic[0]))); res['argmax'].append(V + im * DG)
        res['nspikes'].append(nsp)
        res['probe'].append([[V + im * DG, float(Ic[0].real), float(Ic[0].imag)], [V + ip * DG, float(Ic[1].real), float(Ic[1].imag)]])
        print('   M=%.6e M/V=%.4e max|I|=%.4e spikes=%d  %.1fs' % (M, M / V, abs(Ic[0]), nsp, time.time() - t0), flush=True)
        del I, a2
    Ms = np.array(res['M']); Vs = np.array(res['V'])
    hh = len(Vs) // 2
    if Ms[hh:].max() < 1e-12:
        res['e'] = None; res['pass2'] = True; res['note'] = 'M below 1e-12 on the upper half: O(V) trivially'
    else:
        lx = np.log(Vs[hh:]); ly = np.log(np.maximum(Ms[hh:], 1e-300))
        res['e'] = float(np.polyfit(lx, ly, 1)[0]); res['pass2'] = bool(res['e'] <= 1.1)
    json.dump(res, open(os.path.join(OUT, name + '.json'), 'w'), indent=1)
    print(json.dumps(dict(name=name, e=res['e'], pass2=res['pass2'], MoverV=[m_ / v for m_, v in zip(res['M'], res['V'])])), flush=True)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    sel = sys.argv[1:]
    for args, vexp, wmode in rows2():
        if sel and not any(args['name'].startswith(s) for s in sel): continue
        if os.path.exists(os.path.join(OUT, args['name'] + '.json')): continue
        run(args, vexp, wmode)
    print('DONE', flush=True)
