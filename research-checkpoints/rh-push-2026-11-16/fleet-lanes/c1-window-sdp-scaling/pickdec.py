"""Decoupling certificate for the real-node Pick LMI inside the window SDP.
Model: zeros outside the window [T-W, T+W] are zeta's; inside: any nonnegative measure on the line (PSD contribution)
plus off-line quartets (sigma, t).  S_out = Pick matrix of the outside zeros = S_true - sum_{window} P_gamma.
Split D(sigma,t) = 2 P_t + R(sigma,t), P_t = Pick matrix of the on-line pair at height t (PSD), R = remainder.
For each grid point (sigma, t): eps = || C^{-1} R(sigma,t) C^{-T} ||_F  (Arb upper bound), S_out = C C^T.
Then S_out + sum_k m_k D(sigma_k,t_k) >= 0 whenever sum_k m_k eps_k < 1: the LMI holds for every window configuration
with at most 1/eps_max quartets, whatever its on-line part.  usage: pickdec.py T K nodeset [prec] [W]"""
import sys, json, time
from flint import arb, acb, arb_series, ctx
def Ltrue(x):
    s = x + arb(1)/2
    z = arb_series([s, 1], prec=2).zeta()
    return 1/s + 1/(s-1) - arb.pi().log()/2 + (s/2).digamma()/2 + z[1]/z[0]
def nodes(name, K, T):
    if name == 'lin':  return [arb(6)/10 + arb(i)/2 for i in range(K)]            # 0.6, 1.1, ...
    if name == 'small': return [arb(i+1)*arb(48)/(100*K) for i in range(K)]        # (0, 0.48]
    if name == 'geo':  return [(arb(1)/10)*(arb(20*T)**(arb(i)/(K-1))) for i in range(K)]   # 0.1 .. 2T geometric
    if name == 'top':  return [arb(T)*(arb(1)/4 + arb(i)*arb(4)/(K-1)) for i in range(K)]    # T/4 .. 4.25T linear
    if name.startswith('conf'):                                                    # near-confluent cluster at a
        a = arb(name[4:]); return [a*(1 + arb(i - (K-1)/2)/(4*K)) for i in range(K)]
    raise ValueError(name)
def chol(S):
    n = len(S); C = [[arb(0)]*n for _ in range(n)]
    for i in range(n):
        for j in range(i+1):
            s = S[i][j]
            for k in range(j): s -= C[i][k]*C[j][k]
            if i == j:
                if not (s > 0):
                    chol.last = s; return None, i
                C[i][i] = s.sqrt()
            else: C[i][j] = s/C[j][j]
    return C, n
def relF(C, D):
    n = len(C); Y = [[arb(0)]*n for _ in range(n)]                # Y = C^{-1} D
    for c in range(n):
        for i in range(n):
            s = D[i][c]
            for k in range(i): s -= C[i][k]*Y[k][c]
            Y[i][c] = s/C[i][i]
    M = [[arb(0)]*n for _ in range(n)]                            # M = Y C^{-T}: solve M C^T = Y  row-wise
    for r in range(n):
        for i in range(n):
            s = Y[r][i]
            for k in range(i): s -= C[i][k]*M[r][k]
            M[r][i] = s/C[i][i]
    f = arb(0)
    for r in range(n):
        for c in range(n): f += M[r][c]*M[r][c]
    return f.sqrt(), M
def pick(Lv, xs):
    n = len(xs); return [[(Lv[i]+Lv[j])/(xs[i]+xs[j]) for j in range(n)] for i in range(n)]
def Lq(x, sig, t):
    w = acb(sig, t)**2; return 2*((2*x)/(acb(x*x) - w)).real
def Lon(x, g): return 2*x/(x*x + g*g)
def window_zeros(T, W):
    lo = int(arb(T - W).zeta_nzeros().unique_fmpz()) if T - W > 14 else 0
    hi = int(arb(T + W).zeta_nzeros().unique_fmpz())
    return [z.imag for z in acb.zeta_zeros(lo+1, hi-lo)], lo, hi
def run(T, K, name, prec=2000, W=35, sigs=None, tstep=1.0, verbose=True):
    ctx.prec = prec; tic = time.time()
    xs = nodes(name, K, T); zs, lo, hi = window_zeros(T, W)
    Lt = [Ltrue(x) for x in xs]; St = pick(Lt, xs)
    Lw = [sum((Lon(x, g) for g in zs), arb(0)) for x in xs]
    So = pick([a - b for a, b in zip(Lt, Lw)], xs)
    Ct, it = chol(St); Co, io = chol(So)
    out = dict(T=T, K=K, nodes=name, prec=prec, W=W, nzeros_window=hi-lo, nzeros_below=lo,
               true_pd=Ct is not None, out_pd=Co is not None, fail_pivot_true=it, fail_pivot_out=io)
    if Co is None or Ct is None:
        if verbose: print(json.dumps(out), flush=True)
        return out
    out['min_pivot_out'] = min(Co[i][i] for i in range(K)).str(5, radius=False)
    sigs = sigs or [0.02, 0.05, 0.1, 0.2, 0.3, 0.375, 0.5]
    import numpy as np
    ts = list(np.arange(-W, W + 1e-9, tstep))
    emax = arb(0); arg = None; etrue = arb(0); per = {}
    for sg in sigs:
        es = arb(0)
        for dt in ts:
            D = pick([Lq(x, arb(str(sg)), arb(T) + arb(float(dt))) - 2*Lon(x, arb(T) + arb(float(dt))) for x in xs], xs)
            e, _ = relF(Co, D)
            if not e.is_finite(): out['nonfinite'] = True
            if e.upper() > es.upper(): es = e
            if e.upper() > emax.upper(): emax = e; arg = (sg, float(dt))
        per[str(sg)] = float(es.upper())
        D = pick([Lq(x, arb(str(sg)), arb(T)) - 2*Lon(x, arb(T)) for x in xs], xs); e, _ = relF(Ct, D)
        if e.upper() > etrue.upper(): etrue = e
    out.update(eps_out_max=float(emax.upper()), argmax=arg, eps_true_centre_max=float(etrue.upper()), eps_out_by_sigma=per,
               quartets_allowed=float((1/emax).lower()), sec=round(time.time()-tic, 1))
    if verbose: print(json.dumps(out), flush=True)
    return out
if __name__ == '__main__':
    T = int(float(sys.argv[1])); K = int(sys.argv[2]); name = sys.argv[3]
    prec = int(sys.argv[4]) if len(sys.argv) > 4 else 2000; W = float(sys.argv[5]) if len(sys.argv) > 5 else 35
    run(T, K, name, prec, W, tstep=float(sys.argv[6]) if len(sys.argv) > 6 else 5.0)
