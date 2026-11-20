"""Combination 3: Stieltjes string (S-fraction) of S(lambda) = L(w)/w, lambda = -w^2, L = F'/F at the centre w = 0.
  S(lambda) = sum_pairs 2/(x_rho - lambda), x_rho = -w_rho^2 (= gamma^2 on the line) = sum_n s_n lambda^n,
  s_n = sum_pairs 2 x_rho^-(n+1);  s_0 = F''(0)/F(0) = total length.
  S-fraction  S = s_0/(1 - q_1 lam/(1 - e_1 lam/(1 - q_2 lam/(1 - ...)))): all q_k, e_k > 0 iff the Hankel matrices
  [s_{i+j}] and [s_{i+j+1}] are positive definite iff (for a function with real zeros x_rho) all x_rho > 0.
  Coefficient sequence (q_1, e_1, q_2, e_2, ...) indexed j = 1, 2, ...; coefficient j uses s_0..s_j.
  python hankel.py CODE M prec out.json [--planted FILE]      (midpoint arithmetic, quotient-difference algorithm)"""
import sys, json, time, math, argparse
from flint import arb, acb, ctx, arb_series
import core

def moments0(code, M):
    """s_0..s_{M-1} from the Taylor coefficients of F at w = 0"""
    n = 2 * M + 2
    f = core.taylor_F(code, 0, n + 1)
    f = [x.mid() for x in f]
    for k in range(1, n + 1, 2): f[k] = arb(0)          # F even: odd coefficients vanish (rounding only)
    L = core.logder_series(code, 0, n, f)
    l = list(L.coeffs()); l += [arb(0)] * (n - len(l))
    return [((-1) ** k) * l[2 * k + 1] for k in range(M)]

def qd(s, stop_after_neg=None):
    """returns list of coefficients (q_1, e_1, q_2, ...) as arb midpoints; stops when a division by a non-nonzero ball occurs"""
    M = len(s)
    mid = lambda x: x.mid()
    q = [mid(s[i + 1] / s[i]) for i in range(M - 1)]      # q_1^(n)
    e_prev = [arb(0)] * M                                  # e_0^(n)
    out = [q[0]]
    while len(q) >= 2:
        e = [mid(q[i + 1] - q[i] + e_prev[i + 1]) for i in range(len(q) - 1)]
        out.append(e[0])
        if len(e) < 2: break
        try:
            qn = [mid(q[i + 1] * e[i + 1] / e[i]) for i in range(len(e) - 1)]
        except ZeroDivisionError:
            break
        out.append(qn[0])
        q = qn; e_prev = e
    return out

def summarize(co):
    signs = [core.sign(x) for x in co]
    neg = [j + 1 for j, sg in enumerate(signs) if sg < 0]
    return dict(n_coeff=len(co), first_negative=(neg[0] if neg else None), negatives_head=neg[:12], n_negative=len(neg))

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('code'); ap.add_argument('M', type=int); ap.add_argument('prec', type=int); ap.add_argument('out')
    ap.add_argument('--planted'); ap.add_argument('--dump', type=int, default=0)
    A = ap.parse_args()
    ctx.prec = A.prec
    t0 = time.time()
    s = [x.mid() for x in moments0(A.code, A.M)]
    print(A.code, 'M', A.M, 'prec', A.prec, 'moments', round(time.time() - t0, 1), 's;  s_0 =', s[0].str(25), flush=True)
    co = qd(s)
    res = dict(code=A.code, M=A.M, prec=A.prec, s0=s[0].str(25), base=summarize(co),
               log2_head=[round(core._l2(x), 3) for x in co[:40]])
    if A.dump:
        res['coeff'] = [x.str(20, radius=False) for x in co[:A.dump]]
        res['log2_all'] = [round(core._l2(x), 3) for x in co]
    print('  base:', json.dumps(res['base']), flush=True)
    pl = []
    if A.planted:
        for cf in json.load(open(A.planted)):
            s2 = list(s)
            for kind, d, g in cf['items']:
                d = arb(d); g = arb(g)
                if kind == 'add':
                    x = -(acb(d, g) ** 2); xi = 1 / x; p = xi
                    for k in range(A.M):
                        s2[k] = s2[k] + 4 * p.real; p = p * xi
                else:
                    xi = 1 / (g * g); p = xi
                    for k in range(A.M):
                        s2[k] = s2[k] - 2 * p; p = p * xi
            r = summarize(qd([x.mid() for x in s2]))
            r.update(label=cf['label'], gamma=cf['gamma'], delta=cf['delta'], kind=cf['kind'], nbelow=cf.get('nbelow'))
            pl.append(r); print('  planted', cf['label'], 'first negative coefficient', r['first_negative'], 'negatives', r['negatives_head'][:6], 'nbelow', cf.get('nbelow'), flush=True)
    res['planted'] = pl; res['seconds'] = round(time.time() - t0, 1)
    json.dump(res, open(A.out, 'w'), indent=1)
    print('DONE', A.code, res['seconds'])
