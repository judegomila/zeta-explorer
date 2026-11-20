# Independent re-check of reported failures: the negative Rayleigh quotient found on the coefficient side is recomputed from the
# zeros (explicit formula, zero side), which uses none of the prime-side code. Even sector: W = 2 sum_on C(g)^2 + 4 sum_off-pairs Re C(z)^2,
# odd sector the same with S(z) = int g sin(z x) dx. Zero lists: zeta table to height 2000 (c12 battery); E_a: gamma +- i al;
# T-NR: zeta zeros and z = pi(2m+1)/log q +- i log|r|/log q; DH: battery table (on-line ordinates + off-line pairs).
import json, math, numpy as np, wf, objs
from numpy.polynomial.legendre import leggauss
N = 110; B = wf.Basis(N)
T = '../c12-control-battery-harness/tables/'
d = json.load(open(T + 'zeros_ZETA.json')); key = [k for k, v in d.items() if isinstance(v, list) and len(v) > 1000][0]; gz = np.array([float(v) for v in d[key]])
dd = json.load(open(T + 'zeros_DH.json')); dh_on = np.array([float(v) for v in dd['online']]); dh_off = np.array([complex(float(g), float(b) - 0.5) for b, g, r in dd['offline']])
yq, wq = leggauss(6000); tab = wf.sieve_mangoldt(1200)
def Cm(z, par, a):
    Ph = wf.phis(yq, N, par)*wq[:, None]; z = np.asarray(z)
    out = np.empty((len(z), N), dtype=complex)
    for s in range(0, len(z), 400):
        f = np.cos(np.outer(z[s:s+400], a*yq)) if par == 0 else np.sin(np.outer(z[s:s+400], a*yq))
        out[s:s+400] = math.sqrt(a)*(f @ Ph)
    return out
def check(name, spec, a, on, off):
    Q = B.forms(spec, a); res = []
    for par in (0, 1):
        w, V = np.linalg.eigh(Q[par]); v = V[:, 0]
        zs = 0.0
        if len(on): c = Cm(np.asarray(on, float), par, a).real @ v; zs += 2*float(c @ c)
        if len(off): c = Cm(np.asarray(off, complex), par, a) @ v; zs += 4*float((c*c).real.sum())
        res.append((float(w[0]), zs))
    print('%-22s a=%.3f  even: prime side %.6e zero side %.6e | odd: prime side %.6e zero side %.6e' % (name, a, res[0][0], res[0][1], res[1][0], res[1][1]), flush=True)
    return dict(name=name, a=a, even=res[0], odd=res[1])
out = []
out.append(check('zeta', objs.spec_zeta(1200, tab), 1.2, gz, []))
for al, a in ((0.25, 0.55), (0.25, 1.0), (0.05, 0.62)):
    out.append(check('E_a(%g)' % al, objs.spec_Ea(al, 1200, tab), a, [], gz + 1j*al))
for q, c, a in ((3, 2.2, 0.70), (11, 2.2, 1.30), (3, 1.0, 1.2)):
    disc = c*c - 4
    m = np.arange(0, int(2000*math.log(q)/(2*math.pi)) + 1)
    if disc > 0:
        r1 = (-c + math.sqrt(disc))/2; off = math.pi*(2*m + 1)/math.log(q) + 1j*abs(math.log(abs(r1)))/math.log(q); on = gz
        out.append(check('TNR(q=%d,c=%g,own)' % (q, c), objs.spec_tnr(q, c, 1200, 'own', tab), a, on, off))
    else:
        th = math.atan2(math.sqrt(-disc), -c)      # roots e^{+-i th}: u = q^{-iz} = e^{+-i th} -> z = (-+th + 2 pi m)/log q, all real
        zz = np.concatenate([(th + 2*math.pi*np.arange(-len(m), len(m)))/math.log(q)]); zz = zz[zz > 0]
        zz2 = np.concatenate([(-th + 2*math.pi*np.arange(-len(m), len(m)))/math.log(q)]); zz2 = zz2[zz2 > 0]
        out.append(check('TNR(q=%d,c=%g,own)' % (q, c), objs.spec_tnr(q, c, 1200, 'own', tab), a, np.concatenate([gz, zz, zz2]), []))
out.append(check('DH', objs.spec_periodic(objs.dh_coeffs(), 5, 1, 1200, 'DH'), 1.85, dh_on, dh_off))
out.append(check('DH', objs.spec_periodic(objs.dh_coeffs(), 5, 1, 1200, 'DH'), 2.2, dh_on, dh_off))
json.dump(out, open('recheck_zero_side.json', 'w'), indent=1)
