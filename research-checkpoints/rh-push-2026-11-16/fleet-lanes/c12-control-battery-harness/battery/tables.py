"""Coefficient tables to 1e7, local parameters, sets; consistency of every table against the value interface.
Usage: python tables.py <tables>      (writes coef_*.npy, local_*.npy, set_*.npy, beu_integers.npy, coef_manifest.json)"""
import os, sys, json, math, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from flint import acb, arb, ctx
import core, coeffs as C, sets
tables = sys.argv[1]; os.makedirs(tables, exist_ok=True)
N = core.N_COEF; t0 = time.time()
spf = C.spf_sieve(N); primes = C.primes_of(spf); npr = len(primes)
man = {}
def fn(code): return code.replace('/', '_')
def put(code, a, ref=None, note=''):
    C.announce('coef_%s %s[%d]' % (code, a.dtype, len(a)), a.nbytes)
    np.save(os.path.join(tables, 'coef_%s.npy' % fn(code)), a)
    e = dict(file='coef_%s.npy' % fn(code), dtype=str(a.dtype), n=int(len(a) - 1), bytes=int(a.nbytes), sha256=C.sha(a), note=note)
    if ref is not None:
        chk = []
        af = a if a.dtype.kind in 'fc' else a.astype(np.float64)
        for s in (2.0, 3.0, 2 + 7j):
            d = C.dirichlet_sum(af, s); r = ref(s)
            chk.append(dict(s=str(s), dirichlet_sum=[d.real, d.imag], reference=[r.real, r.imag], abs_diff=abs(d - r)))
        e['consistency'] = chk
    man[code] = e
    print(code, 'sha', e['sha256'][:16], 'max diff', max([c['abs_diff'] for c in e.get('consistency', [])] or [0]), '%.0f s' % (time.time() - t0), flush=True)
def cl(obj):
    def f(s):
        ctx.prec = 128; s = complex(s); v = obj.value(acb(s.real, s.imag)); return complex(float(v.real.mid()), float(v.imag.mid()))
    return f
np.save(os.path.join(tables, 'local_primes.npy'), primes)
man['local_primes'] = dict(file='local_primes.npy', count=int(npr), sha256=C.sha(primes))
put('ZETA', np.concatenate(([0], np.ones(N, dtype=np.int8))).astype(np.int8), cl(core.Zeta()))
put('DH', C.coef_DH(N), cl(core.DH()), 'a(6) - a(2) a(3) = %.12f' % (C.coef_DH(10)[6] - C.KAPPA * -C.KAPPA))
for num, den in ((1, 8), (1, 4), (1, 2)):
    o = core.EA(num, den); put(o.code, C.coef_EA(spf, num / den), cl(o), 'n^-a sigma_2a(n); tail of the Dirichlet sum at Re s = 2 is of size N^(a-1)')
put('TNR', C.coef_TNR(N), cl(core.TNR()))
wt = core.WT(); ctx.prec = 128; al = float(wt.alpha().mid())
put('WT', C.coef_WT(N, al), cl(wt), 'alpha = %.17g' % al)
put('SGN-LIOU', C.coef_LIOU(spf, primes), cl(core.Liou()))
# sets and stage objects
for code, mode, b, m in (('DEL-0.75', 'del', '0.75', '1'), ('DEL-0.9', 'del', '0.9', '1'), ('THIN-0.9', 'thin', '0.9', '0.5')):
    S, st = sets.build(primes, b, m)
    np.save(os.path.join(tables, 'set_%s.npy' % code), S)
    man['set_' + code] = dict(file='set_%s.npy' % code, sha256=C.sha(S), **st)
    o = core.Stage(code, mode, b, [int(p) for p in S])
    put(code, C.coef_DEL(spf, primes, S) if mode == 'del' else C.coef_THIN(spf, primes, S), cl(o), 'reference = zeta * product over S (1e7 stage)')
# U and SGN
U = np.stack([C.u_params(j, npr) for j in range(24)]); E = np.stack([C.sgn_params(j, npr) for j in range(24)])
np.save(os.path.join(tables, 'local_U.npy'), U); np.save(os.path.join(tables, 'local_SGN.npy'), E)
man['local_U'] = dict(file='local_U.npy', shape=list(U.shape), sha256=C.sha(U), note='u_p, chi(p) = exp(2 pi i u_p), row j = seed 120000 + j')
man['local_SGN'] = dict(file='local_SGN.npy', shape=list(E.shape), sha256=C.sha(E), note='eps(p), row j = seed 121000 + j')
lp = np.log(primes.astype(np.float64))
def euler(chi_p):
    def f(s): return complex(np.exp(-np.sum(np.log1p(-chi_p * np.exp(-s * lp)))))
    return f
for j in range(24):
    put('U-%02d' % j, C.coef_U(spf, primes, j), euler(np.exp(2j * np.pi * U[j])), 'reference = Euler product over p <= 1e7')
for j in range(24):
    put('SGN-%02d' % j, C.coef_SGN(spf, primes, j), euler(E[j].astype(np.float64)), 'reference = Euler product over p <= 1e7')
g = C.beurling_integers(primes, float(N))
np.save(os.path.join(tables, 'beu_integers.npy'), g)
zb = [float(np.sum(g ** -s)) for s in (2.0, 3.0)]
hx = [float(np.exp(np.sum(np.log1p(-np.exp(-s * lp)) - np.log1p(-np.exp(-s * np.log(primes + 0.5)))))) for s in (2.0, 3.0)]
ctx.prec = 128
ref = [float(acb(s).zeta().real.mid()) * h for s, h in zip((2, 3), hx)]
man['BEU'] = dict(file='beu_integers.npy', count=int(len(g)), bytes=int(g.nbytes), sha256=C.sha(g), note='generalised integers <= 1e7 of the system q_n = p_n + 1/2 (sorted float64); generalised primes = local_primes + 0.5',
                  consistency=[dict(s=s, sum_over_integers=a, zeta_times_H=r, abs_diff=abs(a - r)) for s, a, r in zip((2, 3), zb, ref)])
print('BEU', len(g), man['BEU']['consistency'], flush=True)
man['HEAT'] = dict(note='no Dirichlet coefficients: the heat family is not an ordinary Dirichlet series with fixed gamma factor (coefficient cocycle 2 t log m log n); interface = kernel quadrature (heat.py)')
json.dump(man, open(os.path.join(tables, 'coef_manifest.json'), 'w'), indent=1)
print('tables done %.0f s' % (time.time() - t0))
