"""c16 referee check: far-tail values recomputed with mpmath (no shared code with ballk/jball/nball/nsolve).
usage: refcheck.py <main.json> <outjson> [n_per_family]
zeta with polar terms: Kpol(t) = e^(t/2) + S(t), S = 2 sum exp(t/2 - pi n^2 e^(2t)) (t >= 0, even).
HEAT with polar terms: c e^(v/2) + e^(-v/2) J1(v) - e^(v/2) I2(v), J1, I2 = int_v^inf f e^(+-t/2), f = e^(tau t^2/4)(S'' - S/4)."""
import json
import sys
import random
import mpmath as mp

mp.mp.dps = 420


def S_terms(t):
    out = []
    n = 1
    while True:
        w = mp.pi * n * n * mp.exp(2 * t)
        if w > 1100 + mp.pi * mp.exp(2 * t):
            break
        out.append(w)
        n += 1
    return out


def kpol_zeta(t):
    t = abs(t)
    return mp.exp(t / 2) * (1 + 2 * sum(mp.exp(-w) for w in S_terms(t)))


def k3(t):
    return 2 * mp.exp(t / 2) * sum(((mp.mpf(1) / 2 - 2 * w) ** 2 - 4 * w - mp.mpf(1) / 4) * mp.exp(-w) for w in S_terms(t))


_C = {}


def kpol_heat(v, tau):
    v = abs(v)
    f = lambda t: mp.exp(tau * t * t / 4) * k3(t)
    brk = lambda a: [a, a + mp.mpf(1) / 64, a + mp.mpf(1) / 16, a + mp.mpf(1) / 4, a + 1, a + 2.5]
    J = lambda a: mp.quad(lambda t: f(t) * mp.exp(t / 2), brk(a))
    I = lambda a: mp.quad(lambda t: f(t) * mp.exp(-t / 2), brk(a))
    if tau not in _C:
        _C[tau] = mp.quad(lambda t: f(t) * 2 * mp.cosh(t / 2), [0, 0.25, 0.5, 1, 1.5, 2, 3])
    c = _C[tau]
    return c * mp.exp(v / 2) + mp.exp(-v / 2) * J(v) - mp.exp(v / 2) * I(v)


def val(fam, u, h, K):
    l = lambda x: mp.log(abs(K(x)))
    u, h = mp.mpf(u), mp.mpf(h)
    if fam == 'b1-Aw':
        return l(u - h) - 2 * l(u) + l(u + h)
    return l(u + 3 * h / 2) - 3 * l(u + h / 2) + 3 * l(u - h / 2) - l(u - 3 * h / 2)


def main():
    d = json.load(open(sys.argv[1]))
    n = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    rnd = random.Random(160020)
    out = []
    for fam, want in (('b1-Aw', 'excluded'), ('b2-with', 'ttrain')):
        rows = [q for q in d['rows'] if q['fam'] == fam and q['res'] == want and q.get('maxprec', 0) >= 512]
        rows = rnd.sample(rows, min(n, len(rows)))
        for q in rows:
            u, h = q['u'], q['h']
            z = val(fam, u, h, kpol_zeta)
            hv = {tau: val(fam, u, h, lambda x, tau=tau: kpol_heat(x, mp.mpf(tau))) for tau in ('-0.1', '-0.5')}
            rec = dict(fam=fam, node=q['node'], u=u, h=h, zeta=mp.nstr(z, 15), heat={k: mp.nstr(v, 15) for k, v in hv.items()},
                       heat_over_zeta={k: mp.nstr(v / z, 12) for k, v in hv.items()})
            if fam == 'b1-Aw':
                # stored status: HEAT not rejectable; independent reading: every training HEAT value is strictly between 0 and the zeta value
                rec['heat_between_0_and_zeta'] = all(0 < v / z < 1 for v in hv.values())
            else:
                s, lo, up = q['ints'][0]
                ends = sorted([z] + list(hv.values()))
                rec['stored_interval'] = [lo, up]
                # the feasible interval must lie between the zeta value and the HEAT value farthest from it
                far = max(hv.values(), key=lambda v: abs(v - z))
                a, b = min(z, far), max(z, far)
                rec['interval_inside_zeta_heat_gap'] = bool(a <= mp.mpf(lo) * (1 + mp.mpf(10) ** -12 * (-1 if lo > 0 else 1)) and mp.mpf(up) <= b * (1 + mp.mpf(10) ** -12 * (1 if b > 0 else -1)))
                rec['rel_dist_lo_to_zeta'] = mp.nstr(abs(mp.mpf(lo) - z) / abs(z), 5)
                rec['rel_dist_up_to_zeta'] = mp.nstr(abs(mp.mpf(up) - z) / abs(z), 5)
                rec['rel_dist_ends_to_far_heat'] = [mp.nstr(abs(mp.mpf(x) - far) / abs(far), 5) for x in (lo, up)]
            print(rec, flush=True)
            out.append(rec)
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
    print('REFCHECK-DONE')


main()
