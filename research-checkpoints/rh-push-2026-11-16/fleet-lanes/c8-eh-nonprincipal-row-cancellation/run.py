"""run.py q maxdeg rmax d-list : dual decomposition of all blocks of ../c7-ff-order2-vertex-exact/blocks_q{q}_d{d}.jsonl with
1 <= r <= rmax, max(k, N+lam) <= maxdeg, compared with the exact |J|^2 of the block files."""
import sys, json, time, numpy as np
from dual import *
q = int(sys.argv[1]); D = int(sys.argv[2]); rmax = int(sys.argv[3]); ds = [int(x) for x in sys.argv[4].split(',')]
only = sys.argv[5] if len(sys.argv) > 5 else ''
NAMES = ['a', 'b', 'mu', 'lnu', 'n1', 'n2', 'rm', 'rma', 'thin', 'dh', 't'] if q == 7 else ['a', 'mu', 'lnu', 'n1', 'n2', 'rm', 'rma', 'thin']
print(f"# planned memory: coefficient matrices {sum(q**n*(n+1)*2 for n in range(D+1))/1e6:.1f} MB; sieve arrays {sum(q**n*13 for n in range(D+1))/1e6:.1f} MB; "
      f"phase tables at most (#primes of degree <= {rmax}) x q^{D} bytes = {sum((q**e)//e for e in range(1,rmax+1))*q**D/1e9:.2f} GB (upper estimate, lazily built)", flush=True)
ff = FF(q, D); pairs = Pairs(ff)
SRC = '../c7-ff-order2-vertex-exact'
import os; out = open(f"dual_q{q}{os.environ.get('TAG', '')}.jsonl", 'a')
for d in ds:
    ref = {}
    geo = set()
    for l in open(f"{SRC}/blocks_q{q}_d{d}.jsonl"):
        b = json.loads(l)
        ref[(b['target'], b['k'], b['N'], b['lam'])] = b['J2']
        if 1 <= b['r'] <= rmax and max(b['k'], b['N'] + b['lam']) <= D: geo.add((b['k'], b['N'], b['lam']))
    for (k, N, lam) in sorted(geo):
        if only and f"{k},{N},{lam}" != only: continue
        t0 = time.time(); Np = N + lam
        Ws = {nm: row_weight(ff, nm, N, lam) for nm in NAMES}
        rows, diag, nfreq = block(ff, pairs, k, Np, d, Ws)
        for nm in NAMES:
            st = stats(ff, rows[nm], diag[nm], k, Np, d)
            rj = ref.get((nm, k, N, lam))
            st.update(q=q, w=nm, k=k, N=N, lam=lam, d=d, r=k + Np - 1 - d, nfreq=nfreq, refJ2=rj, match=(None if rj is None else rj == st['J2']))
            out.write(json.dumps(st) + "\n")
        out.flush()
        ms = [ (nm, ref.get((nm,k,N,lam)) == stats(ff, rows[nm], diag[nm], k, Np, d)['J2']) for nm in NAMES if (nm,k,N,lam) in ref]
        print(f"d={d} k={k} N={N} lam={lam} r={k+Np-1-d} freqs={nfreq} {time.time()-t0:.1f}s match={ms}", flush=True)
