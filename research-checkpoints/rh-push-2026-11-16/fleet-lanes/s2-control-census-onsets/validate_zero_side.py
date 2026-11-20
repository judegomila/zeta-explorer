# Validation on a known answer: explicit formula. Prime-side Weil matrix entries (engine) against the zero side
#   W(g_i, g_j) = sum over zeros z (s = 1/2 + i z) of ghat_i(z) conj(ghat_j(conj z)); even sector: 2 sum_{gamma>0} C_i C_j, C_i(z) = int g_i cos(z x) dx.
# zeta: zeros gamma_n (table to height 2000). E_a = zeta(s+al) zeta(s-al): zeros gamma +- i al.  DH: table of on-line ordinates + off-line pairs.
import json, math, numpy as np, wf, objs
from numpy.polynomial.legendre import leggauss
N = 24; B = wf.Basis(N); a = 1.0
T = '../c12-control-battery-harness/tables/'
gz = np.array([float(v) for v in json.load(open(T + 'zeros_ZETA.json'))['zeros']]) if 'zeros' in json.load(open(T + 'zeros_ZETA.json')) else None
if gz is None:
    d = json.load(open(T + 'zeros_ZETA.json')); key = [k for k, v in d.items() if isinstance(v, list) and len(v) > 1000][0]; gz = np.array([float(v) for v in d[key]])
yq, wq = leggauss(4000)
def C(z, par):      # (len(z), N) complex: sqrt(a) int phi_i(y) cos/sin(z a y) dy
    Ph = wf.phis(yq, N, par)*wq[:, None]
    f = np.cos(np.outer(z, a*yq)) if par == 0 else np.sin(np.outer(z, a*yq))
    return math.sqrt(a)*(f @ Ph)
tab = wf.sieve_mangoldt(100)
def cmp(name, spec, zlist_on, zlist_off):
    Q = B.forms(spec, a)
    for par in (0, 1):
        Con = C(np.asarray(zlist_on, float), par).real if len(zlist_on) else np.zeros((0, N))
        Z = 2*Con.T @ Con
        if len(zlist_off):
            Cof = C(np.asarray(zlist_off, complex), par); Z = Z + 4*(Cof.T @ Cof).real
        d = np.abs(Q[par][:8, :8] - Z[:8, :8]).max()
        print('%s sector %d: max |prime side - zero side| on the 8x8 block = %.2e (entries up to %.2f)' % (name, par, d, np.abs(Q[par][:8, :8]).max()))
cmp('zeta', objs.spec_zeta(100, tab), gz, [])
for al in (0.125, 0.25):
    cmp('E_a(%g)' % al, objs.spec_Ea(al, 100, tab), [], gz + 1j*al)
d = json.load(open(T + 'zeros_DH.json'))
on = np.array([float(v) for v in d['online']]); off = np.array([complex(float(g), float(b) - 0.5) for b, g, r in d['offline']])
cmp('DH', objs.spec_periodic(objs.dh_coeffs(), 5, 1, 100, 'DH'), on, off)
