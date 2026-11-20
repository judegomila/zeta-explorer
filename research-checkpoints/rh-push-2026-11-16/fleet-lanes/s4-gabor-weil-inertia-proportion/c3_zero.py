"""Combination 3 (and 2), zero side: moments m_k = tr K^k / M of the bandwidth-1 operator on windows of M listed zeros,
K[i,j] = sinc(x_i - x_j) (box; same nonzero spectrum as W = sum v v^T on the full grid); GUE values 1, 4/3, 2, 13/4.
Also C = tr(K_w^2)/M for the Montgomery-Taylor kernel.
Conjugation-closed complex ordinates: x - i beta * (local density) for off-line zeros (kind TNR, EA built from the zeta list; DH2000 from the table).
Usage: c3_zero.py OUT.jsonl NAME M nwin [mode=online|tnr|ea] [a=..] [start=frac]"""
import sys, math, json, time, numpy as np
import lists, gw, c2_pair
PI = math.pi

def sinc_any(z):
    return np.sinc(z) if not np.iscomplexobj(z) else gw.sinc_c(z)

def moments(z, phi_star=None, block=512):
    M = len(z); cplx = np.iscomplexobj(z)
    print('planned allocation: K and K^2, %d x %d %s = %.2f GB' % (M, M, 'complex128' if cplx else 'float64', 2 * M * M * (16 if cplx else 8) / 1e9), flush=True)
    K = np.empty((M, M), dtype=np.complex128 if cplx else np.float64)
    c2 = 0.0
    for i in range(0, M, block):
        dz = z[i:i + block, None] - z[None, :]
        K[i:i + block] = sinc_any(dz)
        if phi_star is not None:
            c2 += float((phi_star(dz) ** 2).sum().real)
    K2 = K @ K      # CPU BLAS (the shared GPU had no free memory during this run)
    m1 = np.trace(K).real / M; m2 = np.trace(K2).real / M
    m3 = float(np.einsum('ij,ji->', K2, K).real) / M; m4 = float(np.einsum('ij,ji->', K2, K2).real) / M
    return [float(m1), float(m2), m3, m4], (c2 / M if phi_star is not None else None)

def main():
    out, name, M, nwin = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    kw = dict(v.split('=', 1) for v in sys.argv[5:])
    mode = kw.get('mode', 'online'); a = float(kw.get('a', 0.1))
    if name == 'DH2000':
        tab = json.load(open(kw['table']))
        on = np.array([float(v) for v in tab['online']]); off = np.array([complex(float(b) - 0.5, float(t)) for b, t, _ in tab['offline']])
        dens = lambda t: np.log(5 * t / (2 * PI)) / (2 * PI)
        xs = lambda t: (t / (2 * PI)) * (np.log(5 * t / (2 * PI)) - 1)
        sel = on > 200; so = off.imag > 200
        z_on = xs(on[sel]) + 0j
        zo = np.concatenate([xs(off.imag[so]) - 1j * off.real[so] * dens(off.imag[so]), xs(off.imag[so]) + 1j * off.real[so] * dens(off.imag[so])])
        for lab, z in (('online_only', z_on.real), ('all_zeros', np.concatenate([z_on, zo]))):
            m, c = moments(z, c2_pair.phi_star)
            rec = dict(name=name, mode=lab, M=len(z), T_lo=200, T_hi=2000, m=m, C_star_meas=c, pairs=int(so.sum()))
            print(json.dumps(rec), flush=True); open(out, 'a').write(json.dumps(rec) + '\n')
        return
    d = lists.load(name); x = d['x']; t = d['t']; q = d['q']
    n = len(x); starts = np.linspace(0, n - M - 1, nwin + 2).astype(int)[1:-1] if nwin > 1 else [int(float(kw.get('start', 0.5)) * (n - M - 1))]
    for s0 in starts:
        xs = x[s0:s0 + M]; ts = t[s0:s0 + M]; t0 = time.time()
        if mode == 'online':
            z = xs - xs[0]; extra = {}
        elif mode == 'tnr':   # zeta's zeros plus the pairs of 1 + 2.2 * 3^(1/2-s) + 3^(1-2s) at heights (2k+1) pi/log 3, depth beta
            beta = math.log(1.1 + math.sqrt(0.21)) / math.log(3); sp = 2 * PI / math.log(3)
            k0 = math.ceil((ts[0] - PI / math.log(3)) / sp); k1 = math.floor((ts[-1] - PI / math.log(3)) / sp)
            tp = PI / math.log(3) + sp * np.arange(k0, k1 + 1)
            dens = np.log(tp / (2 * PI)) / (2 * PI) + 2 * math.log(3) / (2 * PI)
            xi = np.interp(tp, ts, xs) + (tp - ts[0]) * 0      # zeta part of the count at the pair heights
            add = lambda tt: tt * 2 * math.log(3) / (2 * PI)
            zz = (xs + add(ts)) + 0j; zp = np.interp(tp, ts, xs) + add(tp)
            z = np.concatenate([zz, zp - 1j * beta * dens, zp + 1j * beta * dens]); z = z - zz[0].real
            extra = dict(pairs=len(tp), beta=beta)
        elif mode == 'ea':    # zeta(s+a) zeta(s-a): ordinates gamma -+ i a, density doubled
            dens = 2 * np.log(ts / (2 * PI)) / (2 * PI)
            z = np.concatenate([2 * xs - 1j * a * dens, 2 * xs + 1j * a * dens]); z = z - 2 * xs[0]
            extra = dict(a=a, depth_in_spacings=float(a * dens.mean()))
        m, c = moments(z, c2_pair.phi_star)
        rec = dict(name=name, mode=mode, M=int(len(z)), start=int(s0), T_lo=float(ts[0]), T_hi=float(ts[-1]), m=m, C_star_meas=c, time_s=time.time() - t0, **extra)
        print(json.dumps(rec), flush=True); open(out, 'a').write(json.dumps(rec) + '\n')

if __name__ == '__main__':
    main()
