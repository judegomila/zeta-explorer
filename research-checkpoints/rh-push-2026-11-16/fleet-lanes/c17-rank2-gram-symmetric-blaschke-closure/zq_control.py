# ZQ control (c15, section 4) on the rank-2 form: G = zeta * m, m(s) = [(t2 + gbar^2 + eta^2)^2 - 4 gbar^2 t2] / [(t2 - g1^2)(t2 - g2^2)],
# t2 = s(1-s) - 1/4 ; removes the zeta zeros 1/2 +- i g1, 1/2 +- i g2 and inserts the quartet 1/2 +- eta +- i gbar. M_ZQ(u) = M_zeta(u) m(u)/m(u+1).
# g1, g2 are balls from acb.zeta_zero at the working precision, so the cancellation of the poles of m by zeros of zeta is enclosed.
# Also 'DEL2': the same two zeros deleted and nothing inserted (numerator replaced by (t2 + 1)^2: zeros moved to s = 1/2 +- i ... no: see below).
# Certified inertia (ball LDL). Planned memory < 200 MB per worker.
import sys, os, json, random, math, time
from multiprocessing import Pool
from flint import acb, arb, ctx
import k2, search
INST = [dict(name='ZQ(1,2;eta=0.3)', n1=1, n2=2, eta=0.3), dict(name='ZQ(1,2;eta=0.05)', n1=1, n2=2, eta=0.05),
        dict(name='ZQ(6709,6710;eta=0.01)', n1=6709, n2=6710, eta=0.01), dict(name='ZQ(6709,6710;eta=0.25)', n1=6709, n2=6710, eta=0.25),
        dict(name='ZQ(1,2;eta=0.45)', n1=1, n2=2, eta=0.45), dict(name='ZQ(3,4;eta=0.2)', n1=3, n2=4, eta=0.2)]
def make_M(inst):
    g1 = acb.zeta_zero(inst['n1']).imag; g2 = acb.zeta_zero(inst['n2']).imag
    gb = (g1+g2)/2; eta = arb(inst['eta'])
    def m(s):
        t2 = s*(1-s) - arb(1)/4
        return ((t2 + gb*gb + eta*eta)**2 - 4*gb*gb*t2)/((t2 - g1*g1)*(t2 - g2*g2))
    return lambda u: k2.M_zeta(u)*m(u)/m(u+1)
def approx(inst):
    ctx.prec = 80
    g1 = float(acb.zeta_zero(inst['n1']).imag.mid()); g2 = float(acb.zeta_zero(inst['n2']).imag.mid())
    return g1, g2
def task(a):
    inst, fam, n, T, seed = a
    g1, g2 = approx(inst)
    search.ZNEAR[inst['n1']*100000 + inst['n2']] = [g1, g2]
    cfg = dict(name=inst['name'], base='zeta', zeros=[('q', inst['eta'], (g1+g2)/2)], kind='zq', order=4)
    raw = search.gen_points(fam, n, cfg, random.Random(seed))
    r = k2.certify(lambda: [(acb(x.real, x.imag), acb(y.real, y.imag)) for (x, y) in raw], lambda: make_M(inst), T)
    r.update(inst=inst['name'], family=fam, T=list(T), seed=seed)
    return r
if __name__ == '__main__':
    workers = int(os.environ.get('RH_WORKERS', '4'))
    # sanity: M_ZQ(u) M_ZQ(-u) = 1 and M_ZQ vanishes at the inserted point
    ctx.prec = 300
    for inst in INST[:1]:
        M = make_M(inst); u = acb(0.37, 5.2)
        g1, g2 = approx(inst)
        print('FE defect', float(abs(M(u)*M(-u) - 1).mid()), ' |M| at inserted zero', float(abs(M(acb(arb(1)/2 - arb(inst['eta']), (acb.zeta_zero(1).imag + acb.zeta_zero(2).imag)/2))).mid()),
              ' |M| at removed zero + 1e-3', float(abs(M(acb(0.5, g1 + 1e-3))).mid()), flush=True)
    tasks = []; seed = 5000000
    for inst in INST:
        for fam in search.FAMILIES:
            for (n, reps) in ((1, 12), (2, 8), (5, 6), (12, 4), (20, 4), (40, 4), (64, 2)):
                for rep in range(reps):
                    for T in ((0, 0), (0.3, 0.3)):
                        seed += 1; tasks.append((inst, fam, n, T, seed))
    print('tasks', len(tasks), 'workers', workers, flush=True)
    agg = {}; bad = []
    with Pool(workers) as pool:
        for r in pool.imap_unordered(task, tasks, chunksize=4):
            v = agg.setdefault((r['inst'], r['n']), [0, 0, 0, 0])
            v[0] += 1; v[1] += (r['status'] == 'ok' and r['nneg'] == 0); v[2] += (r.get('nneg', 0) > 0); v[3] += (r['status'] != 'ok')
            if r.get('nneg', 0) > 0 or r['status'] != 'ok': bad.append(r)
    out = dict(cells=[dict(inst=k[0], n=k[1], count=v[0], positive=v[1], negative=v[2], undecided=v[3]) for k, v in sorted(agg.items())], bad=bad[:50])
    tot = {}
    for c in out['cells']:
        t = tot.setdefault(c['inst'], [0, 0, 0, 0]); t[0] += c['count']; t[1] += c['positive']; t[2] += c['negative']; t[3] += c['undecided']
    out['totals'] = tot
    print('totals [count, positive, negative, undecided]:', tot, flush=True)
    json.dump(out, open('zq_control.json', 'w'), indent=1)
    print('DONE')
