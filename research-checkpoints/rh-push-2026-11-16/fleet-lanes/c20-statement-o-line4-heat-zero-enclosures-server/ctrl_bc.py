"""Items B and C: certified zero enclosures for the controls SG and NR-q (python-flint ball arithmetic, single process).
SG(s)  = zeta(s) * ((s-1/2)^2 - b^2) / ((s-1/2)^2 + g1^2)      [m = (t^2+b^2)/(t^2-g1^2), s = 1/2 + it; g1 = first zeta ordinate]
NRq(s) = zeta(s) * (q^(s-1/2) + c + q^(1/2-s)),  q = 1 + sqrt 2
g1 enters as the certified ball acb.zeta_zero(1).imag (Arb isolates the zero; real part exactly 1/2).
Squares centred at a decimal rounding of the closed-form zero, half-widths 0.05 and 1e-10; zeta on the same squares.
usage: ctrl_bc.py <prec> <outfile>
"""
import sys, json, time
sys.argv = [sys.argv[0], 'cfg_none', sys.argv[1], sys.argv[2]] if len(sys.argv) == 3 else sys.argv
from flint import acb, arb, ctx
PREC = int(sys.argv[2]); OUT = sys.argv[3]
ctx.prec = PREC
import importlib.util
def load_winding():
    src = open(__file__.replace('ctrl_bc.py', 'heat_encl.py')).read()
    a = src.index('def contains0'); b = src.index('def newton'); c = src.index('def dec('); d = src.index("if __name__")
    ns = dict(acb=acb, arb=arb)
    exec(src[a:b] + src[c:d], ns)
    return ns['winding'], ns['dec']
winding, dec = load_winding()
print('PLAN: prec %d bits; no arrays; single process, memory < 100 MB' % PREC, flush=True)
G1 = acb.zeta_zero(1).imag
Q = 1 + arb(2).sqrt()
half = arb(1)/2
def SG(b):
    b = arb(b)
    def f(x, y):
        s = acb(x, y); u = (s - half)**2
        return s.zeta()*(u - b*b)/(u + G1*G1)
    return f
def NRq(c):
    c = arb(c); lq = Q.log()
    def f(x, y):
        s = acb(x, y); e = ((s - half)*lq).exp()
        return s.zeta()*(e + c + 1/e)
    return f
def Z(x, y): return acb(x, y).zeta()
res = dict(prec=PREC, g1=G1.str(40), q=Q.str(40), items=[])
jobs = []
for b in ['0.3', '0.4']:
    z0 = acb(half + arb(b), 0); jobs.append(('SG b=%s' % b, SG(b), z0, dict(control='SG', b=b)))
for c in ['2.1', '2.05']:
    cc = arb(c); w = (cc + (cc*cc - 4).sqrt())/2
    z0 = acb(half + w.log()/Q.log(), arb.pi()/Q.log()); jobs.append(('NR-q c=%s' % c, NRq(c), z0, dict(control='NR-q', c=c)))
for name, f, z0, meta in jobs:
    for hs, digs in [('0.05', 6), ('0.0000000001', 14)]:
        t0 = time.time()
        cx, cy = dec(z0.real, digs), dec(z0.imag, digs)
        r = dict(meta, closed_form_zero=[z0.real.str(30), z0.imag.str(30)], centre=[cx, cy], half_width=hs, prec=PREC)
        r['G'] = winding(f, cx, cy, hs, 16)
        r['zeta_control'] = winding(Z, cx, cy, hs, 16)
        r['value_at_closed_form_zero'] = [f(z0.real, z0.imag).real.str(8), f(z0.real, z0.imag).imag.str(8)]
        r['wall_s'] = time.time() - t0
        print(json.dumps(r), flush=True); res['items'].append(r)
json.dump(res, open(OUT, 'w'), indent=1)
print('DONE')
