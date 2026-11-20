"""Combination 1: heat-flow velocity of a zero against the prime-side force.
   V_n = sum'_{all other zeros zeta_m} 1/(gamma_n - zeta_m)   (symmetric sum; d gamma_n / d tau = V_n / 2 in the battery's heat normalisation)
   E_w(t) = sum_m k_w(t - zeta_m),  k_w(x) = int_0^L w(v) sin(x v) dv   (L = log X; w = 1: k = (1 - cos Lx)/x)
          = Im int_0^L w(v) e^{itv} (pole + archimedean)(v) dv  -  sum_{n <= X} w(log n) Lambda_F(n) n^{-1/2} sin(t log n)       (explicit formula)
   The second line is what is computed ("arithmetic force", primes to X); the first line is the identity it satisfies.
   modes:
     list  CODE ZEROS.npy START COUNT M OUT.json     V from the list (M neighbours each side + smooth tail); CODE in ZETA, TNR, LCHI, LCHIBAR
     exact CODE OUT.json                             V = Re[i Lambda''/(2 Lambda')](rho_n) in balls at the battery's 30-digit zeros below 2000; CODE in ZETA, DH, TNR"""
import sys, json, math, os, time, numpy as np
from scipy.special import spence
import ctl
XS = [float(x) for x in os.environ.get('C1_XS', '1e4,1e6,1e8').split(',')]
WS = ['sharp', 'fejer', 'cos2']
BT = os.environ.get('RH_BATTERY', '../../c12-control-battery-harness/tables/')

def li2re(y):
    y = np.asarray(y, dtype=float); out = np.empty_like(y); m = y <= 1
    out[m] = spence(1 - y[m]); ym = y[~m]; out[~m] = np.pi ** 2 / 3 - 0.5 * np.log(ym) ** 2 - spence(1 - 1 / ym)
    return out
def Aplus(t, g, c): return np.log(t / c) * np.log1p(t / g) + li2re(-t / g)
def Aminus(t, g, c): return -np.log(t / c) * np.log(np.abs(1 - t / g)) - li2re(t / g)

def V_list(g, start, count, M, q=1.0, mirror=True):
    """velocity sums for zeros g[start:start+count]; needs M list neighbours above (and below unless the list starts there)."""
    n = len(g); idx = np.arange(start, start + count); x = g[idx]; V = np.zeros(count); c = 2 * np.pi / q; c0 = 3.42 if q == 1 else 2 * np.pi * math.e / q
    lo = np.maximum(idx - M, 0); hi = idx + M
    assert hi.max() < n - 1
    for k in range(1, M + 1):
        V += 1.0 / (x - g[idx + k])
        j = idx - k; ok = j >= 0
        V[ok] += 1.0 / (x[ok] - g[j[ok]])
    b_hi = 0.5 * (g[hi] + g[hi + 1]); b_lo = np.where(lo > 0, 0.5 * (g[lo] + g[np.maximum(lo - 1, 0)]), c0)
    AP = lambda t: Aplus(t, x, c); AM = lambda t: Aminus(t, x, c)
    tail = (AP(b_lo) + AM(b_lo)) - (AP(c0) + AM(c0)) + (-np.pi ** 2 / 2 - (AP(b_hi) + AM(b_hi))) + (AP(b_hi) - AP(b_lo))
    return V + tail / (2 * np.pi)

def weights(name, v, L):
    if name == 'sharp': return np.ones_like(v)
    if name == 'fejer': return 1 - v / L
    if name == 'cos2': return np.cos(np.pi * v / (2 * L)) ** 2

def pole_smooth(name, t, L, c):
    """Im int_0^L w(v) e^{itv} 2cosh(c v) dv"""
    out = np.zeros_like(t)
    for lam0 in (c, -c):
        lam = lam0 + 1j * t
        I = lambda la: (np.exp(la * L) - 1) / la
        if name == 'sharp': val = I(lam)
        elif name == 'fejer': val = (np.exp(lam * L) - 1 - lam * L) / lam ** 2 / L
        else: val = 0.5 * I(lam) + 0.25 * I(lam + 1j * np.pi / L) + 0.25 * I(lam - 1j * np.pi / L)
        out += val.imag
    return out

def prime_force(code, t, X, vc):
    """dict weight -> (E, P): P = -sum w c sin(t log n) (prime sum alone), E = P + pole part - (pi/4) per gamma factor"""
    base = 'ZETA' if code == 'TNR' else code
    v, c = vc; L = math.log(X); m = v <= L * (1 + 1e-15); v = v[m]; c = c[m]; out = {}
    for name in WS:
        cw = (c * weights(name, v, L)).astype(np.complex128)
        if len(v) * len(t) > 3e9:
            import finufft
            S = finufft.nufft1d3(v, cw, t, isign=-1, eps=1e-12)
        else:
            S = np.zeros(len(t), dtype=np.complex128); ch = max(1, int(2e7 // max(1, len(v))))
            for i in range(0, len(t), ch):
                ph = np.outer(t[i:i + ch], v); S[i:i + ch] = (np.cos(ph) - 1j * np.sin(ph)) @ cw
        P = S.imag                       # Im sum w c e^{-i t log n} = - sum w c sin(t log n) for real c; for complex chi this is the stated force
        if code == 'TNR':
            mm = np.arange(1, int(L / math.log(3) + 1e-12) + 1); vv = mm * math.log(3)
            dc = -math.log(3) * (-1.0) ** mm * 2 * np.cosh(mm * ctl.TNR_THETA) * weights(name, vv, L)
            P = P - np.sin(np.outer(t, vv)) @ dc
        E = P.copy()
        for cp_ in ctl.spec(base if base in ('ZETA', 'DH') else 'DH')['poles'] if base != 'LCHI' else []: E += pole_smooth(name, t, L, cp_)
        out[name] = (E, P)
    return out

def kernel_sum_sharp(g, start, count, M, L):
    """zero-side value of the sharp-weight force from list neighbours: sum_{0<|k|<=M} (1 - cos(L d))/d  (identity check)"""
    idx = np.arange(start, start + count); x = g[idx]; K = np.zeros(count)
    for k in range(1, M + 1):
        d = x - g[idx + k]; K += (1 - np.cos(L * d)) / d
        j = idx - k; ok = j >= 0; d = x[ok] - g[j[ok]]; K[ok] += (1 - np.cos(L * d)) / d
    return K

def stats(V, E):
    V0 = V - V.mean(); E0 = E - E.mean(); vv = float(V0 @ V0); ee = float(E0 @ E0)
    return dict(corr=float(V0 @ E0 / math.sqrt(vv * ee)) if vv > 0 and ee > 0 else None, slope=float(V0 @ E0 / vv) if vv > 0 else None, std_V=math.sqrt(vv / len(V)), std_E=math.sqrt(ee / len(E)), n=int(len(V)))

def chi_coeffs(conj, X):
    n, p, m = ctl.prime_powers(X); tab = np.array([0, 1, 1j, -1j, -1]); ch = tab[n % 5]
    if conj: ch = np.conj(ch)
    return np.log(n.astype(np.float64)), (np.log(p) / np.sqrt(n)) * ch

if __name__ == '__main__':
    mode = sys.argv[1]; code = sys.argv[2]; res = dict(mode=mode, code=code, rows=[])
    if mode == 'list':
        zf, start, count, M, out = sys.argv[3], int(float(sys.argv[4])), int(float(sys.argv[5])), int(sys.argv[6]), sys.argv[7]
        g = np.load(zf, mmap_mode='r'); a0 = max(0, start - M - 2); g = np.array(g[a0:start + count + M + 3]); start -= a0
        q = 5.0 if code.startswith('LCHI') else 1.0
        t0 = time.time(); V = V_list(g, start, count, M, q); t = g[start:start + count]
        res.update(height=[float(t[0]), float(t[-1])], count=count, M=M, zeros_file=zf, V_mean=float(V.mean()), V_std=float(V.std()), sec_V=time.time() - t0)
        if code == 'TNR': V = V - 2 * math.log(3) * np.sin(t * math.log(3)) / (2 * np.cos(t * math.log(3)) + ctl.TNR_C)
        print('V done', res, flush=True)
        for X in XS:
            if code.startswith('LCHI'): vc = chi_coeffs(code == 'LCHIBAR', X)
            else: vc = ctl.coeffs('ZETA', X)
            F = prime_force(code if not code.startswith('LCHI') else 'LCHI', t, X, vc)
            for name in WS:
                E, P = F[name]; r = dict(X=X, weight=name, full=stats(V, E), prime_sum_only=stats(V, P))
                nb = 10; r['corr_by_decile'] = [stats(V[i * count // nb:(i + 1) * count // nb], E[i * count // nb:(i + 1) * count // nb])['corr'] for i in range(nb)]
                if name == 'sharp' and code in ('ZETA',):
                    cnt = min(count, 20000); Kz = kernel_sum_sharp(g, start, cnt, M, math.log(X)); r['identity_check_corr_prime_vs_zero_kernel'] = stats(Kz, E[:cnt])['corr']
                    r['identity_check_rms_diff'] = float(np.sqrt(np.mean((Kz - Kz.mean() - (E[:cnt] - E[:cnt].mean())) ** 2)))
                res['rows'].append(r); print(json.dumps(r), flush=True)
            json.dump(res, open(out, 'w'), indent=0)
    else:
        out = sys.argv[3]
        from flint import acb, arb, ctx, acb_series
        import core
        ctx.prec = 160
        z = json.load(open(BT + 'zeros_%s.json' % code)); obj = core.by_code(code)
        on = z.get('online') or z['gamma']; V = []; res_max = 0.0
        for gs in on:
            s = acb_series([acb(arb(1) / 2, arb(gs)), 1], prec=3); F = obj.completed(s)
            res_max = max(res_max, float(abs(F[0] / F[1]).mid()))
            V.append(float((acb(0, 1) * F[2] / F[1]).real.mid()))      # F[2] = Lambda''/2
        V = np.array(V); t = np.array([float(x) for x in on])
        off_h = [float(o[1]) for o in (z.get('offline') or z.get('offline_local_factor') or [])]
        first_off = min(off_h) if off_h else None
        res.update(n=len(t), max_newton_residual=res_max, first_offline_height=first_off, V_first3=V[:3].tolist(), dgamma_dtau_first3=(V[:3] / 2).tolist())
        print(res, flush=True)
        for X in XS:
            vc = ctl.coeffs('ZETA' if code == 'TNR' else code, X)
            F = prime_force(code, t, X, vc)
            for name in WS:
                E, P = F[name]; r = dict(X=X, weight=name, all=stats(V, E), prime_sum_only=stats(V, P))
                for H in (85.0, 200.0, 500.0, 1000.0):
                    m = t < H; r['below_%g' % H] = stats(V[m], E[m])
                res['rows'].append(r); print(json.dumps(r), flush=True)
            json.dump(res, open(out, 'w'), indent=0)
    print('DONE')
