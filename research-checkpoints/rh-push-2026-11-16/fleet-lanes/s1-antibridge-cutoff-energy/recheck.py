"""s1-antibridge-cutoff-energy: exact (python-flint, 128 bits) re-check of the extremes reported by the float64 GPU scan of zeta,
and of the zero count.  Usage: recheck.py out/gpu_ZETA.json out/recheck_ZETA.json"""
import sys, json, math
from flint import acb, arb, ctx
import flib
ctx.prec = 128
G = json.load(open(sys.argv[1])); o = flib.OBJ[G['obj']]
q = {'ZETA': 1, 'CHI4': 4, 'DH': 5}[G['obj']]
def th1(t): return 0.5 * math.log(q * t / (2 * math.pi))
out = dict(lag_norm=[], lag_rho=[], w=[])
for v, t in G['cands']['lag_norm'][:4]:
    c = o.taylor(acb(0, t), 3); L0i = float((c[1] / c[0]).imag); R2 = float((2 * c[2] / c[0]).real)
    lag = R2 + L0i ** 2
    out['lag_norm'].append(dict(t=t, float64=v, exact=lag / (L0i ** 2 + abs(R2))))
for v, t in G['cands']['lag_rho'][:4]:
    c = o.taylor(acb(0, t), 3); L0i = float((c[1] / c[0]).imag); R2 = float((2 * c[2] / c[0]).real)
    out['lag_rho'].append(dict(t=t, float64=v, exact=(R2 + L0i ** 2) / th1(t) ** 2))
for k, h in enumerate(G['HS']):
    for v, t in G['cands']['w'][k][:3]:
        c = o.taylor(acb(h, t), 2)
        out['w'].append(dict(h=h, t=t, float64=v, exact=float((c[1] / c[0]).real) / (h * th1(t) ** 2)))
if G['obj'] == 'ZETA':
    n1 = int(arb(G['T1']).zeta_nzeros().unique_fmpz()); n0 = int(arb(G['T0']).zeta_nzeros().unique_fmpz())
    out['zero_count'] = dict(scan=G['stat']['zeros'], exact_between_T0_T1=n1 - n0, N_T1=n1,
                             note='the scan grid ends at the last grid point <= T1; a difference of +-1 at the ends is a boundary effect')
json.dump(out, open(sys.argv[2], 'w'), indent=1); print(json.dumps(out, indent=1))
