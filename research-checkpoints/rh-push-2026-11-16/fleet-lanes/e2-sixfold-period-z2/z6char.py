"""z6char.py -- decisive test for e2-sixfold-period-z2.

For the first NP split primary primes pi of Z[w] (exact gamma_j tables of tmp/sextic, read-only), on the full unit
group (O/pi)^* = F_p^*:
  a(m)  = gt_1(-m, pi)            additive factor of (6.2) at prime modulus (Gauss-sum side; exceptional term = |a|^2)
  b(m)  = gamma_2(pi) chi_pi(m)   corrected row of (6.1) at prime modulus, m-dependent part (reflection side)
  a3(m) = gt_2(m, pi)             cubic Gauss function (calibration: Z/3 only)
  br(m) = random unit phases      (random-phase row control)
Z/6 = (O/pi)^* / sixth powers acts on functions of m by f(m) -> f(um); isotypic index j: f(um) = chi_pi(u)^j f(m).
c_j[f] = mean_m f(m) conj(chi_pi(m))^j ; frac_j = |c_j|^2 / mean |f|^2.
Planned memory: per prime a few complex vectors of length p <= ~2e4 (< 2 MB); table load ~ 150 MB.
"""
import sys, os, json, math
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import zomega as Z
Z6 = Z.ZETA6
NP = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
d = np.load(SX + '/data/sf_1e6.npz')
pa, pb, pp, pq, pin, pw = d['pa'], d['pb'], d['pp'], d['pq'], d['pinert'], d['pw']
pg = {1: d['pg1'], 2: d['pg2'], 3: d['pg3']}
idx = [k for k in np.argsort(pq, kind='stable') if not pin[k]][:NP]
rng = np.random.default_rng(7)
names = ['a', 'b', 'a3', 'gram=|a|^2', 'signal=a*b', 'a3*b (cubic A, sextic row)', 'a3*conj(a3)', 'a*b_random']
acc = {n: [] for n in names}
conv = []; hd = []; mob = []; lemL = []
for k in idx:
    a_, b_, p, w = int(pa[k]), int(pb[k]), int(pp[k]), int(pw[k])
    P = Z.PrimeO((a_, b_), p, False)
    r = np.arange(1, p, dtype=np.int64)
    val = Z._vpow(r, np.full(p - 1, (p - 1) // 6, dtype=np.int64), np.full(p - 1, p, dtype=np.int64)).astype(np.int64)
    ex = np.full(p, -1, dtype=np.int64)
    for kk_, t in ((pow((1 + w) % p, t, p), t) for t in range(6)):
        ex[1:][val == kk_] = t
    assert (ex[1:] >= 0).all()
    chi = np.zeros(p, complex); chi[1:] = Z6[ex[1:]]
    sq = math.sqrt(p)
    F1 = np.fft.fft(chi); F2 = np.fft.fft(chi ** 2); F3 = np.fft.fft(chi ** 3)
    # e(r d / pi) = exp(-2 pi i b r d / p) for integer representatives r, d  (Tr(z/lambda) = w-coefficient of z)
    def gt(F, rr):
        return F[(b_ * rr) % p] / sq
    g1, g2, g3 = gt(F1, np.array([1]))[0], gt(F2, np.array([1]))[0], gt(F3, np.array([1]))[0]
    conv.append(max(abs(g1 - pg[1][k]), abs(g2 - pg[2][k]), abs(g3 - pg[3][k])))
    alpha = complex(*[a_ - b_ / 2, b_ * math.sqrt(3) / 2]); alpha /= abs(alpha)
    G = np.conj(chi[4 % p]) * pg[3][k]
    hd.append(max(abs(pg[1][k] - G * pg[2][k] ** 2), abs(pg[2][k] ** 3 + alpha)))
    mob.append(pg[2][k] * np.conj(alpha) * np.conj(G) * pg[1][k])        # Lemma L solved for mu(pi)
    m = r
    a = gt(F1, (-m) % p)
    b = pg[2][k] * chi[1:]
    a3 = gt(F2, m)
    br = np.exp(2j * np.pi * rng.random(p - 1))
    lemL.append(np.max(np.abs(b - (-1) * alpha * G * np.conj(gt(F1, m)))))
    fs = {'a': a, 'b': b, 'a3': a3, 'gram=|a|^2': a * np.conj(a), 'signal=a*b': a * b,
          'a3*b (cubic A, sextic row)': a3 * b, 'a3*conj(a3)': a3 * np.conj(a3), 'a*b_random': a * br}
    cc = np.conj(chi[1:])
    for n, f in fs.items():
        tot = np.mean(np.abs(f) ** 2)
        acc[n].append([abs(np.mean(f * cc ** j)) ** 2 / tot for j in range(6)])
out = {'NP': len(idx), 'norm_range': [int(pq[idx[0]]), int(pq[idx[-1]])],
       'max_convention_err_vs_table': float(max(conv)), 'max_hasse_davenport_err': float(max(hd)),
       'max_lemmaL_err_all_m': float(max(lemL)),
       'mobius_from_gauss': [float(np.min(np.real(mob))), float(np.max(np.real(mob))), float(np.max(np.abs(np.imag(mob))))]}
print(json.dumps({k: v for k, v in out.items()}, indent=1))
print("isotypic fractions frac_j (j = 0..5): min / mean / max over primes")
tab = {}
for n in names:
    A_ = np.array(acc[n]); tab[n] = {'min': A_.min(0).tolist(), 'mean': A_.mean(0).tolist(), 'max': A_.max(0).tolist()}
    dom = int(np.argmax(A_.mean(0)))
    z2 = A_[:, 1::2].sum(1); z3 = [A_[:, [t, t + 3]].sum(1) for t in range(3)]
    tab[n]['Z2_odd_fraction'] = [float(z2.min()), float(z2.mean()), float(z2.max())]
    tab[n]['Z3_fraction_mean'] = [float(x.mean()) for x in z3]
    print(f"{n:28s} dominant j = {dom} (Z/2: {dom % 2}, Z/3: {dom % 3})  frac_dom min {A_[:, dom].min():.12f}  "
          f"max leakage {np.delete(A_, dom, 1).max():.2e}  Z2-odd share mean {z2.mean():.6f}")
out['table'] = tab
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'z6char.json'), 'w'), indent=1)
