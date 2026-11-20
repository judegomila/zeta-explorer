# Part 2: ball LDL^T of Pick matrices (confluent and distinct nodes). Written for lane c20; python-flint.
import sys, json, time, os
from fractions import Fraction as Fr
from flint import arb, acb, arb_series, ctx

def consts():
    s5 = arb(5).sqrt()
    k0 = ((10 - 2*s5).sqrt() - 2)/(s5 - 1)
    return k0

def L_series(func, a, n):
    """Taylor coefficients l_0..l_{n-1} of L = F'/F at z = a (arb), as a list of arb."""
    ctx.cap = n + 1
    s0 = arb(1)/2 + a
    S = arb_series([s0, 1])
    if func.startswith('dh'):
        k0 = consts()
        A = [arb(1), k0, -k0, arb(-1)]
        H = None
        for r in range(1, 5):
            term = S.zeta(arb(r)/5, True)*A[r-1]      # deflated Hurwitz series; sum of a(r) is 0
            H = term if H is None else H + term
        ld = H.derivative()/H
        ctx.cap = n + 1
        gam = ((S + 1)/2).lgamma().derivative()
        c = [ld[k] + gam[k] for k in range(n)]
        c[0] += (arb(5)/arb.pi()).log()/2 - arb(5).log()
        if func.startswith('dhq'):
            ctx.cap = n + 1
            T = arb_series([a, 1])
            for q in func[3:].split('_'):
                lq = arb(int(q)).log()/2
                E = (T*lq).exp() + (-T*lq).exp()
                le = E.derivative()/E
                c = [c[k] + le[k] for k in range(n)]
            return c
        if func.startswith('dhe'):
            m = int(func[3:])
            al = arb(6).log()/2; be = (arb(3)/2).log()/2
            ctx.cap = n + 1
            T = arb_series([a, 1])
            E = (T*al).exp() + (-T*al).exp() + ((T*be).exp() + (-T*be).exp())*(arb(1)/2)
            le = E.derivative()/E
            c = [c[k] + m*le[k] for k in range(n)]
        return c
    # zeta-based functions
    D = S.zeta(arb(1), True)                 # zeta(s) - 1/(s-1)
    W = D*arb_series([s0 - 1, 1]) + 1        # (s-1) zeta(s)
    ld = W.derivative()/W                    # zeta'/zeta + 1/(s-1)
    gam = (S/2).lgamma().derivative()
    c = [ld[k] + gam[k] for k in range(n)]
    c[0] -= arb.pi().log()/2
    inv = 1/s0; pw = inv
    for k in range(n):                       # 1/s = sum (-1)^k t^k / s0^{k+1}
        c[k] += pw if k % 2 == 0 else -pw
        pw = pw*inv
    poles = []
    if func == 'zeta': pass
    elif func == 'q30': w = acb(arb(3)/10, 30); poles = [w, -w]
    elif func == 'q85': w = acb(arb('0.3085171825'), arb('85.6993484854')); poles = [w, -w]
    elif func == 'real': poles = None
    elif func.startswith('gt') or func == 'eonly':
        pass
    else: raise ValueError(func)
    if poles:
        for p in poles:                      # 1/(z-p) + conj: 2 Re
            inv = 1/(acb(a) - p); pw = inv
            for k in range(n):
                v = 2*pw.real
                c[k] += v if k % 2 == 0 else -v
                pw = pw*inv
    if func == 'real':
        for p in (arb(1)/2, -arb(1)/2):
            inv = 1/(a - p); pw = inv
            for k in range(n):
                c[k] += pw if k % 2 == 0 else -pw
                pw = pw*inv
    if func.startswith('gt') or func == 'eonly':
        cc = arb(1)/2 if func in ('gt', 'eonly') else arb(func[2:])
        al = arb(6).log()/2; be = (arb(3)/2).log()/2
        T = arb_series([a, 1])
        E = (T*al).exp() + (-T*al).exp() + ((T*be).exp() + (-T*be).exp())*cc
        le = E.derivative()/E
        if func == 'eonly': c = [le[k] for k in range(n)]
        else: c = [c[k] + le[k] for k in range(n)]
    return c

def vdc(k):
    v = Fr(0); d = Fr(1, 2)
    while k:
        if k & 1: v += d
        k >>= 1; d /= 2
    return v

def build(func, mode, par, N):
    if mode == 'conf':
        a = arb(par[0])/arb(par[1])
        l = L_series(func, a, N)
        P = [[None]*(i+1) for i in range(N)]
        inv2a = 1/(2*a)
        for i in range(N):
            for j in range(i+1):
                rhs = arb(0)
                if j == 0: rhs += l[i]
                if i == 0: rhs += l[j]
                if i > 0: rhs -= (P[i-1][j] if j <= i-1 else P[j][i-1])
                if j > 0: rhs -= P[i][j-1]
                P[i][j] = rhs*inv2a
        return P, {'l0': str(l[0].mid())[:40]}
    lo = arb(par[0])/arb(par[1]); hi = arb(par[2])/arb(par[3])
    xs = []; Ls = []
    for k in range(1, N+1):
        v = vdc(k)
        x = (lo.log() + (arb(v.numerator)/arb(v.denominator))*(hi.log() - lo.log())).exp()
        xs.append(x); Ls.append(L_series(func, x, 1)[0])
    P = [[(Ls[i] + Ls[j])/(xs[i] + xs[j]) for j in range(i+1)] for i in range(N)]
    return P, {'x1': str(xs[0].mid())[:30], 'L(x1)': str(Ls[0].mid())[:40]}

def ldl(P, N):
    """in-place right-looking LDL^T on the lower triangle; returns list of pivots (stops at undecided)."""
    piv = []
    for k in range(N):
        d = P[k][k]
        piv.append(d)
        if d.contains(0): break
        col = [P[i][k] for i in range(k+1, N)]
        for ii, i in enumerate(range(k+1, N)):
            lik = col[ii]/d
            row = P[i]
            for jj, j in enumerate(range(k+1, i+1)):
                row[j] -= lik*col[jj]
    return piv

def l10(x):
    m = abs(x.mid())
    return float(m.log()/arb(10).log()) if m > 0 else None

def run(name, func, mode, par, N, bits):
    out = {'run': name, 'func': func, 'mode': mode, 'par': par, 'N': N, 'attempts': []}
    for attempt in range(3):
        ctx.prec = bits
        t0 = time.time()
        planned = N*N/2*(bits/8)*2.5/1e9
        print(f'[{name}] bits={bits} N={N} planned matrix memory {planned:.3f} GB (lower triangle)', flush=True)
        P, info = build(func, mode, par, N)
        tb = time.time() - t0
        piv = ldl(P, N)
        signs = []
        for d in piv:
            signs.append(1 if d > 0 else (-1 if d < 0 else 0))
        undec = [k+1 for k, s in enumerate(signs) if s == 0]
        neg = [k+1 for k, s in enumerate(signs) if s < 0]
        rec = {'bits': bits, 'build_s': round(tb, 1), 'ldl_s': round(time.time()-t0-tb, 1), 'pivots_decided': len(piv)-len(undec),
               'undecided_at': undec, 'negative_pivot_orders': neg, 'first_negative': (neg[0] if neg else None),
               'log10abs': {str(k): l10(piv[k-1]) for k in sorted(set([1, 2, 5, 10, 20, 50, 100, 148, 149, 150, 160, 200, 218, 219, 256] + neg[:12] + [len(piv)])) if k <= len(piv)},
               'min_rel_accuracy_bits': min(int(d.rel_accuracy_bits()) for d in piv),
               'info': info}
        if neg:
            rec['first_negative_ball'] = piv[neg[0]-1].str(20)
            if neg[0] >= 2: rec['pivot_before_first_negative'] = piv[neg[0]-2].str(20)
        rec['last_pivot_ball'] = piv[-1].str(20)
        out['attempts'].append(rec)
        print(f'[{name}] {json.dumps(rec)}', flush=True)
        if not undec:
            out['final'] = rec; out['decided'] = True; break
        bits *= 2
    else:
        out['final'] = out['attempts'][-1]; out['decided'] = False
    return out

RUNS = {
 'C1-DH':   ('dh',   'conf', (1, 1), 256, 12000),
 'C1-ZETA': ('zeta', 'conf', (1, 1), 256, 12000),
 'C1-Q30':  ('q30',  'conf', (1, 1), 60, 12000),
 'C1-Q85':  ('q85',  'conf', (1, 1), 130, 12000),
 'C1-REAL': ('real', 'conf', (1, 1), 20, 12000),
 'C2-DH':   ('dh',   'conf', (1, 2), 200, 12000),
 'C2-ZETA': ('zeta', 'conf', (1, 2), 200, 12000),
 'C3-DH':   ('dh',   'nodes', (1, 100, 1, 2), 256, 10000),
 'C3-ZETA': ('zeta', 'nodes', (1, 100, 1, 2), 256, 10000),
 'C3-Q30':  ('q30',  'nodes', (1, 100, 1, 2), 60, 10000),
 'C4-DH':   ('dh',   'nodes', (1, 10, 10, 1), 256, 10000),
 'C4-ZETA': ('zeta', 'nodes', (1, 10, 10, 1), 256, 10000),
 # supplementary (Part 3 candidate A; added after the gate, not in its table)
 'S-EONLY': ('eonly', 'conf', (1, 1), 64, 6000),
 'S-GT':    ('gt',    'conf', (1, 1), 64, 6000),
 'X-DHE1':    ('dhe1',    'conf', (1, 1), 256, 12000),
 'X-DHE8':    ('dhe8',    'conf', (1, 1), 256, 12000),
 'X-DHE64':   ('dhe64',   'conf', (1, 1), 256, 12000),
 'X-DHE4096': ('dhe4096', 'conf', (1, 1), 256, 12000),
 'X3-DHE64':  ('dhe64',   'nodes', (1, 100, 1, 2), 256, 10000),
 'T-DHE':     ('dhe3',    'conf', (1, 1), 12, 1000),
 'X-Q2':  ('dhq2_3_4_9', 'conf', (1, 1), 256, 12000),
 'X-Q3':  ('dhq2_3_4_6_8_9_12_16_18_24_27_32', 'conf', (1, 1), 256, 12000),
 'X-Q4':  ('dhq2_3_4_6_8_9_12_16_18_24_27_32_36_48_54_64_72_81_96_108_128', 'conf', (1, 1), 256, 12000),
 'X3-Q3': ('dhq2_3_4_6_8_9_12_16_18_24_27_32', 'nodes', (1, 100, 1, 2), 256, 10000),
 'T-Q':   ('dhq2_3', 'conf', (1, 1), 12, 1000),
 # local smoke tests
 'T-DH':    ('dh',   'conf', (1, 1), 24, 1500),
 'T-ZETA':  ('zeta', 'conf', (1, 2), 24, 1500),
 'T-Q30':   ('q30',  'conf', (1, 1), 30, 3000),
 'T-REAL':  ('real', 'conf', (1, 1), 6, 1500),
 'T-N-DH':  ('dh',   'nodes', (1, 100, 1, 2), 16, 1500),
 'T-N-Z':   ('zeta', 'nodes', (1, 100, 1, 2), 16, 1500),
 'T-GT':    ('gt',   'conf', (1, 1), 16, 1500),
 'T-E':     ('eonly','conf', (1, 1), 16, 1500),
}
if __name__ == '__main__':
    name = sys.argv[1]
    outdir = sys.argv[2] if len(sys.argv) > 2 else '.'
    o = run(name, *RUNS[name])
    json.dump(o, open(os.path.join(outdir, f'run_{name}.json'), 'w'), indent=1)
