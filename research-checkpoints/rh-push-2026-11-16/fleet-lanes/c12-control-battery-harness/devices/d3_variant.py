"""D3: Lemma B (pole-lattice multipliers), DH form. Formulas of push/c3-lemmab-referee-dh-poisson/dh_form.py and lib3.py
(re-typed; float64 quadrature as in the record). Battery inputs: DH zero table (on-line and off-line), f'/f on Re s = 1 from core.DH.
Record: push/c3-lemmab-referee-dh-poisson/dh_form.json (read as data, passed as argv[2])."""
import sys, os, json, math
import numpy as np
from scipy.special import digamma
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, 'tmp/research-2026-11-16/push/c12-control-battery-harness/battery')
from flint import acb, arb, ctx
import core
tables = sys.argv[1]; record = json.load(open(sys.argv[2]))[:2]; HHDIV = float(sys.argv[3]); XMUL = float(sys.argv[4])
ctx.prec = 200
DHo = core.DH()
K = float(core.kappa().mid())
def zS(s, ps):
    s = np.asarray(s, dtype=np.complex128); out = np.ones(s.shape, np.complex128)
    for p in ps: out = out / (1 - np.exp(-math.log(p) * s))
    return out
def coef(m): return {j: math.comb(2 * m, m - abs(j)) * (-1) ** j / 4.0 ** m for j in range(-m, m + 1)}
def Wfun(z, T, Tw, m=3):
    u = np.asarray(z, dtype=np.complex128) - 1j * T; out = np.zeros(u.shape, np.complex128)
    for j, c in coef(m).items():
        a = u - 2j * math.pi * j / Tw; a = np.where(np.abs(a) < 1e-12, 1e-12, a)
        out += c * (-np.expm1(-a * Tw)) / a
    return out
def Cb(x, Tw, m=3):
    x = np.abs(np.asarray(x, dtype=np.float64)); a = np.clip(Tw - x, 0.0, None)
    out = np.zeros(x.shape, np.complex128); cs = coef(m)
    for j, cj in cs.items():
        ej = np.exp(2j * math.pi * j * x / Tw)
        for l, cl in cs.items():
            if j + l == 0: out += cj * cl * ej * a
            else:
                om = 2 * math.pi * (j + l) / Tw
                out += cj * cl * ej * (np.exp(1j * om * a) - 1) / (1j * om)
    return out.real
def Cw(x, T, Tw, m=3): return np.exp(1j * T * np.asarray(x)) * Cb(x, Tw, m)
def flogder(t):
    v = core.logder(DHo, acb(1, float(t)), completed=False)
    return complex(float(v.real.mid()), float(v.imag.mid()))
def a_dh(n): return [0.0, 1.0, K, -K, -1.0][n % 5]
def lambda_f(N):
    lam = [0.0] * (N + 1)
    for n in range(2, N + 1):
        v = a_dh(n) * math.log(n)
        for d in range(2, n):
            if n % d == 0: v -= lam[d] * a_dh(n // d)
        lam[n] = v
    return lam
def smooth(S, X):
    v = [1]
    for p in S:
        new = []
        for x in v:
            y = x
            while y <= X: new.append(y); y *= p
        v = new
    return sorted(v)
d = json.load(open(os.path.join(tables, 'zeros_DH.json')))
on = np.array([float(x) for x in d['online']]); off = np.array([[float(x[0]), float(x[1])] for x in d['offline']])
def OmegaF(tau): return math.log(5 / math.pi) + np.real(digamma(0.75 + 0.5j * np.asarray(tau)))
def run(S, Tw, T, m=3):
    N = int(np.prod(S)); om = 2 * math.pi * m / Tw; X = 25 * om * XMUL
    hh = min(0.002, 0.05 / Tw) / HHDIV; tau = np.arange(T - X, T + X, hh)
    fz = np.abs(zS(0.5 + 1j * tau, S)) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
    arch = hh * np.sum(fz * OmegaF(tau)) / (2 * math.pi)
    g = on[(on > T - X) & (on < T + X)]
    z_on = float(np.sum(np.abs(zS(0.5 + 1j * g, S)) ** 2 * np.abs(Wfun(1j * g, T, Tw, m)) ** 2))
    z_off = 0.0; npair = 0
    for b, gm in off:
        if T - X < gm < T + X:
            z = np.array([b - 0.5 + 1j * gm])
            z_off += 2 * float((zS(0.5 + z, S) * zS(0.5 - z, S) * Wfun(z, T, Tw, m) * np.conj(Wfun(-np.conj(z), T, Tw, m)))[0].real); npair += 1
    res = 0.0
    for p in S:
        lp = math.log(p); ks = np.arange(int((T - X) * lp / (2 * math.pi)) + 1, int((T + X) * lp / (2 * math.pi)) + 1); t = 2 * math.pi * ks / lp
        ww = Wfun(0.5 + 1j * t, T, Tw, m) * np.conj(Wfun(-0.5 + 1j * t, T, Tw, m))
        keep = np.abs(ww) > 1e-18 * np.max(np.abs(ww)); t = t[keep]; ww = ww[keep]
        ld = np.array([flogder(x) for x in t])
        rest = [q for q in S if q != p]
        res += 2 * float(np.sum((zS(1 + 1j * t, S) * zS(-1j * t, rest) * ld * ww / lp).real))
    third = 0.0; eT = math.exp(Tw)
    if eT >= 2 * N:
        lam = lambda_f(int(eT / N) + 1); sm = smooth(S, eT / N)
        for mm in sm:
            for mp in sm:
                for n in range(2, int(eT / (N * mm * mp)) + 1):
                    if lam[n] != 0.0:
                        third += 2 * (-1) ** (len(S) + 1) * (lam[n] * math.sqrt(N * mm / (mp * n)) * Cw(np.array([-math.log(N * mm * mp * n)]), T, Tw, m)[0]).real
    zero = z_on + z_off; tot = arch + res + third
    return dict(S=list(S), Tw=Tw, T=T, zero_side=zero, zero_online=z_on, zero_offline_pairs=z_off, pairs_in_window=npair, arch=arch, residues=res, third=third,
                diff=zero - tot, rel=(zero - tot) / zero, online_zeros_in_window=int(len(g)))
out = dict(cases=[]); checks = []
def rel(a, b): return abs(a - b) / abs(b)
for r in record:
    o = run(tuple(r['S']), r['Tw'], r['T']); out['cases'].append(o)
    tag = 'S=%s Tw=%s T=%s: ' % (r['S'], r['Tw'], r['T'])
    checks.append(dict(check=tag + 'identity |rel| <= 5.4e-12', ok=abs(o['rel']) <= 5.4e-12, got=o['rel'], recorded=r['rel']))
    checks.append(dict(check=tag + 'zero side rel 1e-9', ok=rel(o['zero_side'], r['zero_side']) < 1e-9, got=o['zero_side'], recorded=r['zero_side']))
    checks.append(dict(check=tag + 'arch rel 1e-9', ok=rel(o['arch'], r['arch']) < 1e-9, got=o['arch'], recorded=r['arch']))
    checks.append(dict(check=tag + 'residues rel 1e-9', ok=rel(o['residues'], r['residues']) < 1e-9, got=o['residues'], recorded=r['residues']))
    checks.append(dict(check=tag + 'third line', ok=(abs(o['third'] - r['third']) < 1e-12 if r['third'] == 0 else rel(o['third'], r['third']) < 1e-9), got=o['third'], recorded=r['third']))
    checks.append(dict(check=tag + 'off-line pairs in window', ok=o['pairs_in_window'] == r['pairs_in_window'], got=o['pairs_in_window'], recorded=r['pairs_in_window']))
for c in checks: c['ok'] = bool(c['ok']); c['got'] = float(c['got'])
out['checks'] = checks; out['reproduced'] = all(c['ok'] for c in checks)
out['max_abs_rel'] = max(abs(c['rel']) for c in out['cases'])
out['verdict'] = 'DH satisfies the Lemma B identity in all %d recorded cases' % len(record) if out['reproduced'] else 'MISMATCH'
json.dump(out, open(os.path.join(tables, 'device_D3_variant.json'), 'w'), indent=1)
for c in checks: print(('ok   ' if c['ok'] else 'FAIL ') + c['check'], '| got', c['got'], '| recorded', c['recorded'])
print('D3 reproduced:', out['reproduced'], 'max |rel|', out['max_abs_rel'])
