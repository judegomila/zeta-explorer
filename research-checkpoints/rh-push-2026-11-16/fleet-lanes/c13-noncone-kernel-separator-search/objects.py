"""Object sets of PREREG sections 2, 3 and 7. build(real=True) -> list of (group, obj); groups:
'P' training positives, 'PH' held-out positives, 'C<k>' training members of class k, 'H<k>' held-out members."""
import math
import os
import sys
import numpy as np
import kern

CLASSES = {1: 'DH', 2: 'T-NR', 3: 'E_a', 4: 'HEAT', 5: 'SGN', 6: 'U', 7: 'DEL/THIN', 8: 'EIS-w', 9: 'theta^w'}
NCOEF = 4000
C12 = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c12-control-battery-harness')


def rng(k):
    return np.random.Generator(np.random.PCG64(130000 + k))


def primes_upto(N):
    s = np.ones(N + 1, dtype=bool)
    s[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if s[p]:
            s[p * p::p] = False
    return np.nonzero(s)[0]


PR = primes_upto(NCOEF)


def cm_coeffs(vals_at_primes):
    """completely multiplicative a(n), n <= NCOEF, from values at the primes (0 allowed)."""
    a = np.zeros(NCOEF + 1, dtype=np.result_type(vals_at_primes, np.float64))
    a[1] = 1
    spf = np.zeros(NCOEF + 1, dtype=np.int64)
    for p in PR[::-1]:
        spf[p::p] = p
    val = dict(zip(PR.tolist(), vals_at_primes.tolist()))
    for n in range(2, NCOEF + 1):
        p = int(spf[n])
        a[n] = a[n // p] * val[p]
    return a


def sgn_obj(seed, name):
    bits = np.random.Generator(np.random.PCG64(seed)).integers(0, 2, len(PR))
    return kern.NoFE(cm_coeffs((1 - 2 * bits).astype(np.float64)), name), (1 - 2 * bits)


def u_obj(seed, name):
    u = np.random.Generator(np.random.PCG64(seed)).random(len(PR))
    o = kern.NoFE(cm_coeffs(np.exp(2j * np.pi * u)), name)
    o.up = dict(zip(PR.tolist(), u.tolist()))
    return o


def greedy_set(b, m):
    """battery rule (c12 battery/sets.py, imported as code): primes in S below NCOEF."""
    sys.path.insert(0, os.path.join(C12, 'battery'))
    import sets
    S, st = sets.build(PR.astype(np.int64), repr(b), repr(m))
    return np.asarray(S)


def del_obj(b, name):
    S = greedy_set(b, 1)
    return kern.NoFE(cm_coeffs(np.where(np.isin(PR, S), 0.0, 1.0)), name), S


def thin_obj(b, name):
    S = greedy_set(b, 0.5)
    return kern.NoFE(cm_coeffs(np.where(np.isin(PR, S), -1.0, 1.0)), name), S


def char_list(qlo, qhi):
    """(q, m, values, is_real) sorted by conductor then m, one per conjugate pair."""
    out = []
    for q in range(qlo, qhi + 1):
        for m, v, real in kern.primitive_reps(q):
            out.append((q, m, v, real))
    return out


def build(info=None):
    objs = []
    info = {} if info is None else info
    # positives
    objs.append(('P', kern.ZETA))
    tr = char_list(3, 13)
    for q, m, v, real in tr:
        objs.append(('P', kern.Chi(q, v, 'chi%d.%d%s' % (q, m, '' if real else 'c'))))
    ho = char_list(14, 40)
    idx = np.sort(rng(0).choice(len(ho), 24, replace=False))
    for i in idx:
        q, m, v, real = ho[i]
        objs.append(('PH', kern.Chi(q, v, 'chi%d.%d%s' % (q, m, '' if real else 'c'))))
    info['n_heldout_pos_pool'] = len(ho)
    # class 1 DH
    q5 = [c for c in tr if c[0] == 5 and not c[3]][0]
    chi5 = kern.Chi(5, q5[2], 'chi5.%dc' % q5[1])
    dh = kern.DHType(chi5, 'Re', 'DH')
    objs.append(('C1', dh))
    info['dh_coef_ratio'] = [float(x) for x in (dh.coef[:4] / dh.coef[0] / np.array([1, 2, 3, 4.0]))]
    pool = [(5, q5[1], q5[2], 'Im')]
    for q, m, v, real in char_list(7, 40):
        if not real:
            pool.append((q, m, v, 'Re'))
            pool.append((q, m, v, 'Im'))
    idx = np.sort(rng(1).choice(len(pool), 24, replace=False))
    for i in idx:
        q, m, v, part = pool[i]
        objs.append(('H1', kern.DHType(kern.Chi(q, v, 'x'), part, 'DH%d.%d%s' % (q, m, part))))
    info['n_dh_pool'] = len(pool)
    # class 2 T-NR
    objs.append(('C2', kern.TNR(3, 2.2, 'TNR3_2.2')))
    r = rng(2)
    for j in range(24):
        p0 = int(r.choice([2, 3, 5, 7, 11, 13]))
        t = r.uniform(0.05, 0.95)
        c = 2 + t * (math.sqrt(p0) + 1 / math.sqrt(p0) - 2)
        objs.append(('H2', kern.TNR(p0, c, 'TNR%d_%.5f' % (p0, c))))
    # class 3 E_a
    for a in (0.125, 0.25):
        objs.append(('C3', kern.EA(a, 'EA%.3f' % a)))
    r = rng(3)
    for j in range(24):
        a = r.uniform(0.03, 0.47)
        objs.append(('H3', kern.EA(a, 'EA%.5f' % a)))
    # class 4 HEAT
    for tau in (-0.1, -0.5):
        objs.append(('C4', kern.Heat(tau, 'HEAT%.2f' % tau)))
    r = rng(4)
    for j in range(24):
        tau = -10 ** r.uniform(-1.7, 0.3)
        objs.append(('H4', kern.Heat(tau, 'HEAT%.5f' % tau)))
    # class 5 SGN
    eps_tr = []
    for j in range(6):
        o, e = sgn_obj(121000 + j, 'SGN-%02d' % j)
        eps_tr.append(e)
        objs.append(('C5', o))
    objs.append(('C5', kern.NoFE(cm_coeffs(-np.ones(len(PR))), 'SGN-LIOU')))
    for j in range(24):
        objs.append(('H5', sgn_obj(122000 + j, 'SGNH-%02d' % j)[0]))
    f = os.path.join(C12, 'tables', 'local_SGN.npy')
    if os.path.exists(f):
        L = np.load(f, mmap_mode='r')
        info['sgn_prefix_matches_battery'] = bool(all(np.array_equal(np.asarray(L[j, :len(PR)]), eps_tr[j]) for j in range(6)))
    # class 6 U
    for j in range(6):
        objs.append(('C6', u_obj(120000 + j, 'U-%02d' % j)))
    for j in range(24):
        objs.append(('H6', u_obj(123000 + j, 'UH-%02d' % j)))
    # class 7 DEL/THIN
    chk = {}
    for code, b, mk in (('DEL-0.75', 0.75, del_obj), ('DEL-0.9', 0.9, del_obj), ('THIN-0.9', 0.9, thin_obj)):
        o, S = mk(b, code)
        objs.append(('C7', o))
        f = os.path.join(C12, 'tables', 'set_%s.npy' % code)
        if os.path.exists(f):
            B = np.load(f)
            chk[code] = bool(np.array_equal(B[B <= NCOEF], S))
    info['sets_match_battery'] = chk
    r = rng(7)
    for j in range(24):
        b = round(float(r.uniform(0.55, 0.98)), 4)
        if j % 2 == 0:
            objs.append(('H7', del_obj(b, 'DEL-%.4f' % b)[0]))
        else:
            objs.append(('H7', thin_obj(b, 'THIN-%.4f' % b)[0]))
    # class 8 EIS-w
    for a in (0.2 + 3j, 0.1 + 5j):
        objs.append(('C8', kern.EA(a, 'EIS%.2f+%.2fi' % (a.real, a.imag))))
    r = rng(8)
    for j in range(24):
        a = complex(r.uniform(0.03, 0.47), r.uniform(0.5, 6))
        objs.append(('H8', kern.EA(a, 'EIS%.4f+%.4fi' % (a.real, a.imag))))
    # class 9 theta^w
    for w in (0.5, 3.0):
        objs.append(('C9', kern.ThetaW(w, 'THW%.2f' % w)))
    r = rng(9)
    for j in range(24):
        while True:
            w = r.uniform(0.25, 6)
            if min(abs(w - k) for k in (1, 2, 4)) >= 0.05:
                break
        objs.append(('H9', kern.ThetaW(w, 'THW%.5f' % w)))
    return objs


def build_synth():
    """planted kernel-level set (PREREG section 7): same group shape."""
    r = np.random.Generator(np.random.PCG64(135000))
    objs = []
    for g in ['P'] * 24 + ['PH'] * 24:
        al = math.exp(r.uniform(math.log(0.3), math.log(3)))
        objs.append((g, kern.Synth(al, 0.0, 'G%.4f' % al)))
    for k in range(1, 10):
        for g in ['C%d' % k] * 2 + ['H%d' % k] * 24:
            al = math.exp(r.uniform(math.log(0.3), math.log(3)))
            c = al * r.uniform(2.5, 6)
            objs.append((g, kern.Synth(al, c, 'S%d_%.4f_%.4f' % (k, al, c))))
    return objs


if __name__ == '__main__':
    info = {}
    O = build(info)
    from collections import Counter
    print(Counter(g for g, _ in O))
    print(info)
    print(len(O), 'objects; complex:', sum(1 for _, o in O if o.cplx))
