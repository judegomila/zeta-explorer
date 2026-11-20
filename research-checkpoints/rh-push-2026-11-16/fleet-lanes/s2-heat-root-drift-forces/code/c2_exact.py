"""Combination 2 in ball arithmetic (zero side): G_N on the first N primes, pivots of LDL^T (= signs of leading minors' ratios).
   n*(t) = first N at which the leading N x N block is not PSD.  The zero list is taken as exact input (battery tables, 30 digits;
   truncated where e^{-t gamma^2} < 2^-prec, which removes terms below the working precision).
   usage: c2_exact.py OUT.json code:t:N:prec ..."""
import sys, json, math, os
from multiprocessing import Pool
from flint import arb, acb, ctx
BT = os.environ.get('RH_BATTERY', '../../c12-control-battery-harness/tables/')

def zeros(code, H):
    zt = json.load(open(BT + 'zeros_ZETA.json'))['gamma']
    if code == 'ZETA': return [g for g in zt if float(g) < H], []
    if code.startswith('EA-'): return [], [(code[3:], g) for g in zt if float(g) < H]
    z = json.load(open(BT + 'zeros_%s.json' % code)); on = [g for g in z['online'] if float(g) < H]
    if code == 'DH': off = [(o[0], o[1], True) for o in z['offline'] if float(o[1]) < H]
    elif code == 'TNR': off = [(b, g, True) for b, g in z['offline_local_factor'] if float(b) > 0.5 and float(g) < H]
    else: off = [(o[0], o[1], False) for o in z['offline'] if float(o[1]) < H]
    return on, off

def primes(n):
    out = []; k = 2
    while len(out) < n:
        if all(k % q for q in out if q * q <= k): out.append(k)
        k += 1
    return out

def job(arg):
    code, ts, N, prec = arg.split(':'); N = int(N); ctx.prec = int(prec); t = arb(ts)
    H = math.sqrt(int(prec) * math.log(2) / float(ts)); H = min(H, 1999.0)
    on, off = zeros(code, H); pr = primes(N); l = [arb(p).log() for p in pr]; isq = [1 / arb(p).sqrt() for p in pr]
    G = [[arb(0)] * N for _ in range(N)]
    def add_sym(u, v, w):      # G += w (u v^T + v u^T)/... caller passes pairs
        for i in range(N):
            ui = u[i] * w
            for j in range(i + 1):
                G[i][j] += ui * v[j]
    for gs in on:
        g = arb(gs); w = 2 * (-t * g * g).exp()
        c = [(g * li).cos() * s for li, s in zip(l, isq)]; s_ = [(g * li).sin() * s for li, s in zip(l, isq)]
        add_sym(c, c, w); add_sym(s_, s_, w)
    for o in off:
        if code.startswith('EA-'):
            num, den = o[0].split('/'); d = arb(int(num)) / int(den); g = arb(o[1])
        else:
            d = arb(o[0]) - (arb(1) / 2 if o[2] else 0); g = arb(o[1])
        amp = 2 * (-t * (g * g - d * d)).exp(); phi = 2 * t * g * d
        up = [(d * li).exp() * s for li, s in zip(l, isq)]; um = [(-d * li).exp() * s for li, s in zip(l, isq)]
        U1 = [a * (g * li + phi).cos() for a, li in zip(up, l)]; V1 = [a * (g * li).cos() for a, li in zip(um, l)]
        U2 = [a * (g * li + phi).sin() for a, li in zip(up, l)]; V2 = [a * (g * li).sin() for a, li in zip(um, l)]
        for U, V in ((U1, V1), (U2, V2)):
            for i in range(N):
                for j in range(i + 1): G[i][j] += amp * (U[i] * V[j] + V[i] * U[j])
    # LDL^T on the lower triangle
    L = [[arb(0)] * N for _ in range(N)]; d_ = []; signs = ''
    for j in range(N):
        s = G[j][j]
        for k in range(j): s -= L[j][k] * L[j][k] * d_[k]
        d_.append(s)
        if s.contains(0): signs += '?'; break
        signs += '+' if s > 0 else '-'
        for i in range(j + 1, N):
            x = G[i][j]
            for k in range(j): x -= L[i][k] * L[j][k] * d_[k]
            L[i][j] = x / s
    nstar = signs.find('-') + 1 if '-' in signs else None
    r = dict(code=code, t=float(ts), N=N, prec=int(prec), zero_cut_height=H, n_online=len(on), n_offline=len(off), n_star=nstar, p_at_n_star=pr[nstar - 1] if nstar else None,
             decided=len(signs) - signs.count('?'), negatives=signs.count('-'), signs=signs,
             log10_first_neg_pivot=(float(abs(d_[nstar - 1]).log().mid()) / math.log(10)) if nstar else None,
             first_offline=(float(off[0][1]) if off else None))
    print(json.dumps(r), flush=True); return r

if __name__ == '__main__':
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p: res = p.map(job, sys.argv[2:], chunksize=1)
    json.dump(res, open(sys.argv[1], 'w'), indent=0); print('DONE')
