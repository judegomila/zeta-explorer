"""Combination 2: spike heights and cusp coefficients of the semilocal Sonine remainder delta_S for swapped local data.
Part A (S = {inf,p}): delta_S(p^k (1+eps)) at eps = 1e-7 (closed si-sums of lane s2-semilocal-local-factor-swap, sisum.py),
  slope per log_p(1/eps) between eps = 1e-7 and 1e-11, in/out ratio of the slopes.
Part B (S = {inf,2,3}): log^2-cusp coefficient at S-units 2^a 3^b from the two-dimensional Laurent array c_{n,m} of the multiplier
  rho_S = D(z2,z3)/D~(1/(2 z2),1/(3 z3)), including the true {2^a 3^b}-part of Davenport-Heilbronn (which is not a product of a
  2-part and a 3-part): D = (1 + z2 z3 + kappa (z2 - z3)) / ((1+z2^2)(1+z3^2)).
  Statistic: M(a,b) = mean over the positive cone of c_j c_{j+(a,b)}; factorisation defect M(a,b) M(0,0) / (M(a,0) M(0,b)) - 1.
usage: spikes.py out.json"""
import sys, math, json
import numpy as np
import lf, sisum
OUT = sys.argv[1]
res = {'A': [], 'B': []}
# ---------------- Part A ----------------
for p in (2, 3):
    for name in ('zeta', 'sign', 'tnr', 'dh', 'l2', 'ntp', 'ntm', 'ea'):
        nt = name in ('ntp', 'ea')
        npos = 260 if nt else 150
        for k in (0, 1, 2, 3, 4):
            rho0 = float(p) ** k
            vals = {}
            habs = math.sqrt(rho0 + 1e-7) * sisum.br_res(name, p, k, 1e-7 / rho0, npos)[0]      # source convention: rho = p^k + 1e-7
            for e in (1e-5, 1e-7, 1e-9, 1e-11):
                tS, rS = sisum.br_res(name, p, k, e, npos)
                tI, rI = sisum.br_res(name, p, -k, -e / (1 + e), npos)
                r = rho0 * (1 + e)
                vals[e] = (math.sqrt(r) * tS, tI / math.sqrt(r))
            sl = (vals[1e-11][0] - vals[1e-7][0]) / (math.log(1e4) / math.log(p))
            sli = (vals[1e-11][1] - vals[1e-7][1]) / (math.log(1e4) / math.log(p))
            sl0 = (vals[1e-7][0] - vals[1e-5][0]) / (math.log(1e2) / math.log(p))
            row = dict(p=p, name=name, k=k, height_abs=habs, height_1e7=vals[1e-7][0], slope=sl, slope_coarse=sl0, slope_in=sli, zeta_law=2 * rho0 ** 0.5 * (1 - 1 / p) ** 2,
                       in_over_out=(sli / sl if abs(sl) > 1e-9 else None))
            res['A'].append(row)
            print('A p=%d %-5s k=%d height(rho = p^k + 1e-7) = %+.6f  height(eps=1e-7) = %+.6f slope/log_p = %+.6f (coarser %+.6f) zeta law %.6f  slope_in/slope = %s' % (
                p, name, k, habs, row['height_1e7'], sl, sl0, row['zeta_law'], 'n/a' if row['in_over_out'] is None else '%.6f (1/rho = %.6f)' % (row['in_over_out'], 1 / rho0)), flush=True)
# non-resonant reference value of the source: delta_S(3) for zeta at p = 2
d3 = float(sisum.delta_grid('zeta', 2, np.array([3.0]))[0])
res['delta_zeta_p2_at_3'] = d3
print('A zeta p=2 delta_S(3) = %.6f (source 0.379224)' % d3)
# ---------------- Part B ----------------
K = lf.KAPPA
def pos_series(num, n2, n3, den2, den3):
    """coefficients of num(z2,z3) / (den2(z2) den3(z3)) for 0 <= n < n2, 0 <= m < n3; num = dict {(i,j): coef}"""
    i2 = lf._inv_series(np.array(den2, dtype=complex), n2); i3 = lf._inv_series(np.array(den3, dtype=complex), n3)
    base = np.outer(i2[:n2], i3[:n3]); out = np.zeros((n2, n3), dtype=complex)
    for (i, j), c in num.items():
        out[i:, j:] += c * base[:n2 - i, :n3 - j]
    return out
def inv2d(num, I, J):
    """coefficients e_{ij} of 1/num(y2,y3), i < I, j < J (num[(0,0)] = 1)"""
    e = np.zeros((I, J), dtype=complex); e[0, 0] = 1.0
    for i in range(I):
        for j in range(J):
            if i == 0 and j == 0: continue
            s = 0.0
            for (a, b), c in num.items():
                if (a, b) != (0, 0) and i - a >= 0 and j - b >= 0: s += c * e[i - a, j - b]
            e[i, j] = -s
    return e
def laurent2d(num, den2, den3, n2=48, n3=48, I=70, J=50):
    """c_{n,m}, -I < n < n2 - I, ... : rho = [num(z)/(den2 den3)(z)] * [(den2 den3)(y)/num(y)], y_p = 1/(p z_p)"""
    A = pos_series(num, n2 + I, n3 + J, den2, den3)
    e = inv2d({k: np.conj(v) for k, v in num.items()}, I, J)
    d = np.conj(np.outer(np.array(den2), np.array(den3)))        # conjugated coefficients: D~(y)
    B = np.zeros((I, J), dtype=complex)
    for a in range(d.shape[0]):
        for b in range(d.shape[1]):
            B[a:, b:] += d[a, b] * e[:I - a, :J - b]
    B = B * (0.5 ** np.arange(I))[:, None] * ((1 / 3.0) ** np.arange(J))[None, :]     # y2^i y3^j = 2^-i 3^-j z2^-i z3^-j
    c = np.zeros((n2 + I, n3 + J), dtype=complex)                      # index (n + I, m + J)
    for i in range(I):
        for j in range(J):
            if B[i, j] != 0.0: c[I - i: I - i + n2, J - j: J - j + n3] += B[i, j] * A[:n2, :n3]
    return c, I, J
def check(num, den2, den3, c, I, J):
    """max |sum c z^n - D(z)/D~(y)| at torus points (uses the part of the array that is complete: n < n2 - I ...)."""
    rng = np.random.default_rng(1); worst = 0.0
    for _ in range(5):
        t = rng.uniform(0, 30)
        z2 = 2 ** (-0.5 - 1j * t); z3 = 3 ** (-0.5 - 1j * t)
        Dz = sum(cf * z2 ** i * z3 ** j for (i, j), cf in num.items()) / (np.polyval(den2[::-1], z2) * np.polyval(den3[::-1], z3))
        val = Dz / np.conj(Dz)
        n = np.arange(c.shape[0]) - I; m = np.arange(c.shape[1]) - J
        s = np.sum(c * (z2 ** n)[:, None] * (z3 ** m)[None, :])
        worst = max(worst, abs(s - val))
    return worst
objs = {
    'zeta x zeta': ({(0, 0): 1.0}, [1.0, -1.0], [1.0, -1.0]),
    'sign x sign (chi_5)': ({(0, 0): 1.0}, [1.0, 1.0], [1.0, 1.0]),
    'sign x zeta (chi_13)': ({(0, 0): 1.0}, [1.0, 1.0], [1.0, -1.0]),
    'l2 x l2 (L(chi)L(chibar), chi mod 5 complex)': ({(0, 0): 1.0}, [1.0, 0.0, 1.0], [1.0, 0.0, 1.0]),
    'dh2 x dh3 (product of the p-parts)': ({(0, 0): 1.0, (1, 0): K, (0, 1): -K, (1, 1): -K * K}, [1.0, 0.0, 1.0], [1.0, 0.0, 1.0]),
    'L(chi), chi mod 5 complex (chi(2) = i, chi(3) = -i)': ({(0, 0): 1.0}, [1.0, -1j], [1.0, 1j]),
    'unimodular twist (alpha_2 = e^{i}, alpha_3 = e^{2i})': ({(0, 0): 1.0}, [1.0, -np.exp(1j)], [1.0, -np.exp(2j)]),
    'DH true {2^a 3^b}-part': ({(0, 0): 1.0, (1, 0): K, (0, 1): -K, (1, 1): 1.0}, [1.0, 0.0, 1.0], [1.0, 0.0, 1.0]),
}
units = [(1, 0), (0, 1), (2, 0), (1, 1), (0, 2), (3, 0), (2, 1), (1, 2), (4, 0), (2, 2)]
for nm, (num, den2, den3) in objs.items():
    c, I, J = laurent2d(num, den2, den3)
    err = check(num, den2, den3, c, I, J)
    # positive cone: indices n, m in [4, 36) (periodic there up to the truncation of the y-series)
    lo, hi = 4, 36
    def M(a, b):
        blk = c[I + lo: I + hi, J + lo: J + hi]; sh = c[I + lo + a: I + hi + a, J + lo + b: J + hi + b]
        return complex(np.mean(blk * np.conj(sh)))
    M00 = M(0, 0)
    M00 = M00.real
    row = dict(name=nm, laurent_check=err, M00=M00, units=[])
    print('B %-52s Laurent check %.1e  M(0,0) = %.6f' % (nm, err, M00))
    for (a, b) in units:
        m = M(a, b); ma = M(a, 0); mb = M(0, b)
        fac = abs(m * M00 - ma * mb) / M00 ** 2
        rho0 = 2.0 ** a * 3.0 ** b
        row['units'].append(dict(a=a, b=b, rho=rho0, M_re=m.real, M_im=m.imag, rel_re=math.sqrt(rho0) * m.real / M00, rel_im=math.sqrt(rho0) * m.imag / M00, fact_defect=fac))
        print('    rho0 = 2^%d 3^%d = %4.0f  sqrt(rho0) M / M00 = %+.6f %+.6fi   |M(a,b) M00 - M(a,0) M(0,b)| / M00^2 = %.2e' % (a, b, rho0, math.sqrt(rho0) * m.real / M00, math.sqrt(rho0) * m.imag / M00, fac))
    res['B'].append(row)
json.dump(res, open(OUT, 'w'), indent=1)
