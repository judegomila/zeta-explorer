"""Combination 2: Laguerre bracket on octave blocks of real rates.
Block = the N rates of the object in [2^m, 2^{m+1}) (zero ordinates; an off-line pair beta, 1-beta at ordinate gamma gives the rate gamma twice),
nu_min, R = nu_max/nu_min, depth d = x/nu_min, x = kappa N.
  exact      log Lambda(block, d)                       (Arb, pen.lam_arb)
  floor_Rx   log e^{-2Rx} sum_{k<N}(L_k(2Rx)-L_{k-1}(2Rx))^2   <= Lambda_conf(nu_max) <= Lambda(block)   (CONF-LB + MONO-N)
  conf_x     log Lambda_conf(N, x)  (all rates = nu_min)   >= Lambda(block)                              (MONO-N)
  cap        log ( e^{-x}[L_{N-1}(-2Rx) + 2 sum_{k<=N-2} L_k(-2Rx)] )^2 >= Lambda(block)                 (COAL-N)
  pos = (exact - floor_Rx)/(min(cap,0) - floor_Rx),  pos_conf = (exact - floor_Rx)/(conf_x - floor_Rx)
usage: t2.py out.jsonl kind maxN spec...   kind = zeros | logpp ; spec = OBJ:m"""
import sys, json, math, time, os, numpy as np, mpmath as mp
import pen
if __name__ == "__main__": outp, kind, maxN = sys.argv[1], sys.argv[2], int(sys.argv[3]); specs = sys.argv[4:]
ND = json.load(open('nodes.json')); Q, CQ = 1000003, 2.2
KAP = [1.0, 2.0, 3.0]
def ordinates(obj):
    if obj.startswith('EA'): return sorted(ND['ZETA']['online'] * 2), 'all ordinates doubled'
    if obj == 'TNRq':
        dl = math.pi / math.log(Q); loc = [dl * (2 * k + 1) for k in range(int(2000 / (2 * dl)))]
        return sorted([g for g in ND['ZETA']['online'] if g < 2000] + loc * 2), 'zeta ordinates + local-factor ordinates doubled'
    if obj.endswith('-on'): return sorted(ND[obj[:-3]]['online']), 'on-line ordinates only'
    o = ND[obj]; return sorted(o['online'] + [g for b, g in o['offline']] * 2), ''
def logpp(obj):
    """log n over the support of Lambda_F below e^8"""
    NN = 2981; sv = [True] * (NN + 1); out = []
    for p in range(2, NN + 1):
        if sv[p]:
            for j in range(p * p, NN + 1, p): sv[j] = False
            if (obj == 'LCHI4' and p == 2) or (obj == 'LCHI5' and p == 5): continue
            q = p
            while q <= NN: out.append(math.log(q)); q *= p
    if obj == 'DH': out = [math.log(n) for n in range(2, NN + 1) if n % 5]      # Lambda_DH(n) != 0 for these n (checked in t1_prime for n <= 1e7 on the server run)
    return sorted(out), 'log of support'
def run(spec):
    obj, m = spec.split(':'); m = int(m)
    rates, note = (ordinates(obj) if kind == 'zeros' else logpp(obj))
    blk = [g for g in rates if 2.0 ** m <= g < 2.0 ** (m + 1)]
    N = len(blk)
    if N < 2 or N > maxN:
        open(outp, 'a').write(json.dumps(dict(spec=spec, kind=kind, N=N, skipped=True)) + '\n'); return
    numin, R = blk[0], blk[-1] / blk[0]
    ndbl = sum(1 for i in range(1, N) if blk[i] == blk[i - 1])
    rec = dict(spec=spec, kind=kind, m=m, N=N, nu_min=numin, R=R, doubled=ndbl, note=note, rows=[])
    for kap in KAP:
        x = kap * N; d = x / numin; t0 = time.time()
        mp.mp.dps = int(60 + 1.2 * N + 1.0 * R * x)
        fl_Rx = pen.laguerre_floor_log(N, R * x, mp); fl_x = pen.laguerre_floor_log(N, x, mp); cap = pen.coal_n_cap_log(N, x, R, mp)
        prec = 128 + 4 * N
        while True:
            r = pen.lam_arb([repr(g) for g in blk], None, d, prec)
            if r['relrad'] < 1e-9 or prec > 60000: break
            prec *= 2
        cprec = 128 + 4 * N; rc = None
        while N <= 120:
            rc = pen.lam_arb([repr(numin)] * N, None, d, cprec)
            if rc['relrad'] < 1e-9 or cprec > 60000: break
            cprec *= 2
        ex = r['logLam']; cf = rc['logLam'] if rc else None
        row = dict(kappa=kap, x=x, exact=ex, floor_Rx=fl_Rx, floor_x=fl_x, conf_x=cf, cap=cap, pos=(ex - fl_Rx) / (min(cap, 0.0) - fl_Rx), pos_conf=((ex - fl_Rx) / (cf - fl_Rx)) if cf is not None else None,
                   prec=prec, relrad=r['relrad'], ok=bool(fl_Rx <= ex + 1e-9 and ex <= cap + 1e-9 and (cf is None or (ex <= cf + 1e-9 and cf <= cap + 1e-9 and fl_x <= cf + 1e-9))), seconds=time.time() - t0)
        rec['rows'].append(row); print(spec, N, row, flush=True)
    open(outp, 'a').write(json.dumps(rec) + '\n')
if __name__ == '__main__':
    W = int(os.environ.get('RH_WORKERS', '1'))
    if W == 1: [run(s) for s in specs]
    else:
        import multiprocessing as mpx
        with mpx.Pool(W) as p: p.map(run, specs, chunksize=1)
