"""c15 ball stage for the exact-parameter pair families (PREREG section 5) and float64-against-balls cross-check.
usage: nball.py und <outdir> <fam,fam,...> [maxnodes]   |   nball.py xcheck <outdir> <fam,...> <n>
'und': every node that is feasible in the optimistic float64 reading (tiers PA/all, PA/FE) is re-read: the entries that
float64 leaves undecided are recomputed in balls (256, 1024 bits) and the interval logic is run again."""
import json
import multiprocessing as mp
import os
import sys
import time
import numpy as np
from flint import arb, acb, ctx
import jball
import nobj
import nf
import nsolve

PRECS = (256, 1024)
# amendment A6: C15_BALLTIER=six reads the undecided and feasible nodes of the six-class tier only
SIX = os.environ.get('C15_BALLTIER') == 'six'
TIERS = ((('PA/six', [1, 2, 3, 4, 6, 7]),) if SIX else (('PA/all', nobj.ALLC), ('PA/FE', nobj.FE_CLASSES)))
PAIRS = None
G = None
D = None


class Und(Exception):
    pass


def _la(z):
    z = acb(z)
    n2 = z.real * z.real + z.imag * z.imag
    if not (n2 > 0):
        raise Und()
    return n2.log() / 2


_CACHE = {}


def _piece(what, kobj, pol, u, h):
    """per-kernel quantity, cached for the current node and precision (pairs share kernels)"""
    key = (what, id(kobj), pol, ctx.prec)
    if key in _CACHE:
        v = _CACHE[key]
        if v is None:
            raise Und()
        return v
    K = lambda x: jball.bk(kobj).val(x, pol)
    try:
        if what == 'v':
            v = acb(K(u))
        elif what == 'l0':
            v = _la(K(u))
        elif what == 'l1':
            v = _la(K(u + h))
        elif what == 'd2':
            v = _la(K(u - h)) - 2 * _la(K(u)) + _la(K(u + h))
        else:
            v = _la(K(u + 3 * h / 2)) - 3 * _la(K(u + h / 2)) + 3 * _la(K(u - h / 2)) - _la(K(u - 3 * h / 2))
    except (Und, ValueError, ZeroDivisionError, RuntimeError, AssertionError, OverflowError):
        _CACHE[key] = None
        raise Und()
    _CACHE[key] = v
    return v


def bvalue(fam, u, h, pair):
    """-> (V1, V2) arb (V2 None for threshold families)"""
    u = arb(float(u))
    h = arb(float(h))
    pol = not (fam.endswith('-without') or fam.endswith('-Ao'))
    PA = lambda w: _piece(w, pair.A, pol, u, h)
    PB = lambda w: _piece(w, pair.B, True, u, h)
    kind = fam.split('-')[0]
    if kind == 'a1':
        ka = PA('v')
        if ka.contains(0):
            raise Und()
        return (PB('v') / ka).real, None
    if kind == 'b6':
        return (PB('l1') - PA('l1')) - (PB('l0') - PA('l0')), None
    w = 'd2' if kind in ('b1', 'b3', 'b4m', 'b4p') else 'd3'
    if fam == 'b1-B':
        return PB(w), None
    if kind in ('b1', 'b2'):
        return PA(w), None
    a, b = PA(w), PB(w)
    if kind in ('b3', 'b5l'):
        return a, b
    return (a - b if kind in ('b4m', 'b5m') else a + b), None


def bratio(fam, u, h, pair):
    """-> (mid, rad, sign of V2, precision) or None when no ball decides"""
    for pr in PRECS:
        ctx.prec = pr
        try:
            V1, V2 = bvalue(fam, u, h, pair)
            if V2 is None:
                r, s2 = V1, 1.0
            else:
                if V2.contains(0):
                    continue
                r, s2 = V1 / V2, (1.0 if V2 > 0 else -1.0)
            m = float(r.mid())
            rad = float(r.rad())
            if not (np.isfinite(m) and np.isfinite(rad)):
                continue
            if rad > 1e-6 * max(abs(m), 1e-30) and pr != PRECS[-1]:
                continue
            return m, rad * (1 + 1e-9) + 4e-16 * abs(m) + 1e-300, s2, pr
        except (Und, ValueError, ZeroDivisionError, RuntimeError, AssertionError, OverflowError):
            continue
    return None


def group_of(fam):
    return [g for g, fs in nf.GROUPS.items() if fam in fs][0]


def symmetric_node(fam, u, h):
    """nodes at which the value is 0 for every kernel pair with K(-u) = conj K(u) (PROVED by the reflection):
    b6 at u + h = -u; third differences at u = 0. There every positive has value 0 and so has every control with a
    functional equation; no threshold separates them."""
    k = fam.split('-')[0]
    if k == 'b6':
        return abs(2 * u + h) < 1e-12
    if k in ('b2', 'b5l', 'b5m', 'b5p'):
        return abs(u) < 1e-12
    return False


def work_und(args):
    fam, idx, u, h = args
    g = group_of(fam)
    V1, E1, V2, E2 = nf.v2full(nf.eval_group(g, u, h, PAIRS, [fam])[fam])
    r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
    pos = np.concatenate((D['P'], D['PX']))
    train = np.concatenate([pos] + [D['C%d' % k] for k in nobj.ALLC])
    tiers = TIERS
    out = []
    nb = 0
    for i in range(len(u)):
        if symmetric_node(fam, u[i], h[i]):
            out.append(dict(node=int(idx[i]), u=float(u[i]), h=float(h[i]), res={t: 'excluded' for t, _ in tiers}, sym=True, left=[], nleft=0, balled=0))
            continue
        sl = slice(i, i + 1)
        _CACHE.clear()
        balled = set()
        failed = set()
        res = {}
        for rnd in range(5):
            need = set(int(j) for j in train if und[i, j] and j not in balled)
            done = True
            for name, cl in tiers:
                cls = [D['C%d' % k] for k in cl]
                st = False
                op = False
                for s in (1, -1):
                    st |= bool(nsolve.solve_sign(r[sl], e[sl], und[sl], sg2[sl], s, pos, cls, False)[2].any())
                    Cn, UP, feo, _, _ = nsolve.solve_sign(r[sl], e[sl], und[sl], sg2[sl], s, pos, cls, True)
                    if feo.any():
                        op = True
                        for jj in np.nonzero(feo[0])[0]:
                            c, up = Cn[0, jj], UP[0, jj]
                            for j in train:
                                if j in balled or und[i, j]:
                                    continue
                                lo_ = c if np.isfinite(c) else up
                                hi_ = up if np.isfinite(up) else c
                                if not (np.isfinite(lo_) and np.isfinite(hi_)):
                                    continue
                                if r[i, j] + 20 * e[i, j] >= lo_ - (hi_ - lo_) and r[i, j] - 20 * e[i, j] <= hi_ + (hi_ - lo_):
                                    need.add(int(j))
                res[name] = 'ttrain' if st else ('undecided' if op else 'excluded')
                if res[name] == 'undecided':
                    done = False
            if done or not need:
                break
            for j in need:
                bq = bratio(fam, u[i], h[i], PAIRS[j])
                nb += 1
                balled.add(j)
                if bq is None:
                    failed.add(j)
                    und[i, j] = True
                else:
                    r[i, j], e[i, j], sg2[i, j] = bq[0], bq[1], bq[2]
                    und[i, j] = False
        out.append(dict(node=int(idx[i]), u=float(u[i]), h=float(h[i]), res=res, sym=False, left=[PAIRS[j].name for j in sorted(failed)][:12],
                        nleft=len(failed), balled=len(balled)))
    return fam, out, nb


def work_x(args):
    fam, u, h, js = args
    g = group_of(fam)
    V1, E1, V2, E2 = nf.v2full(nf.eval_group(g, u, h, PAIRS, [fam])[fam])
    r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
    agree = bad = noball = fund = 0
    worst = 0.0
    for i in range(len(u)):
        _CACHE.clear()
        j = int(js[i])
        if und[i, j]:
            fund += 1
            continue
        b = bratio(fam, u[i], h[i], PAIRS[j])
        if b is None:
            noball += 1
            continue
        dev = abs(r[i, j] - b[0]) / (e[i, j] + b[1])
        worst = max(worst, float(dev))
        if dev <= 1.0 and b[2] == sg2[i, j]:
            agree += 1
        else:
            bad += 1
    return fam, agree, bad, noball, fund, worst


def main():
    global PAIRS, G, D
    mode, out, fams = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    PAIRS = nobj.build({})
    G = np.array([p.group for p in PAIRS])
    D = nobj.gidx(G)
    nw = int(os.environ.get('RH_WORKERS', '4'))
    ctxm = mp.get_context('fork')
    t0 = time.time()
    res = {}
    with ctxm.Pool(nw) as pool:
        if mode == 'und':
            cap = int(sys.argv[4]) if len(sys.argv) > 4 else 10 ** 9
            jobs = []
            tot = {}
            for fam in fams:
                s = json.load(open(os.path.join(out, fam + '_summary.json')))['summary']
                nd = np.load(os.path.join(out, group_of(fam) + '_nodes.npz'))
                main = (set(s['PA/six/rows_und']) | set(s['PA/six/rows_feas'])) if SIX else (set(s['PA/all/rows_und']) | set(s['PA/all/rows_feas']) | set(s['PA/FE/rows_feas']))
                fe = np.array([], dtype=np.int64) if SIX else np.array(sorted(set(s['PA/FE/rows_und']) - main), dtype=np.int64)
                rs = np.random.Generator(np.random.PCG64(156000 + fams.index(fam)))
                fes = np.sort(rs.choice(fe, min(cap, len(fe)), replace=False)) if len(fe) else fe
                idx = np.concatenate((np.array(sorted(main), dtype=np.int64), fes))
                tot[fam] = dict(main=len(main), fe_only=int(len(fe)), fe_sampled=int(len(fes)))
                for i in range(0, len(idx), 25):
                    jobs.append((fam, idx[i:i + 25], nd['u'][idx[i:i + 25]], nd['h'][idx[i:i + 25]]))
                res[fam] = dict(nodes_to_read=tot[fam], read=int(len(idx)), rows=[], ball_evals=0, main=sorted(main))
            print('ball stage: %d jobs; nodes per family %s' % (len(jobs), tot), flush=True)
            for k, (fam, o, nb) in enumerate(pool.imap_unordered(work_und, jobs)):
                res[fam]['rows'] += o
                res[fam]['ball_evals'] += nb
                if (k + 1) % 50 == 0:
                    print('  job %d/%d %.0fs' % (k + 1, len(jobs), time.time() - t0), flush=True)
            for fam in fams:
                rr = res[fam]['rows']
                ms = set(res[fam].pop('main'))
                for name in [t for t, _ in TIERS]:
                    res[fam][name] = {x: sum(1 for q in rr if q['res'][name] == x) for x in ('ttrain', 'undecided', 'excluded')}
                    res[fam][name + '/main'] = {x: sum(1 for q in rr if q['res'][name] == x and q['node'] in ms) for x in ('ttrain', 'undecided', 'excluded')}
                res[fam]['symmetric_nodes'] = sum(1 for q in rr if q['sym'])
                res[fam]['undecided_abs_u_min'] = min([abs(q['u']) for q in rr if 'undecided' in q['res'].values()], default=None)
                res[fam]['rows'] = [q for q in rr if any(v != 'excluded' for v in q['res'].values())][:3000]
                print('%s: read %d of %s; ball evals %d; sym %d; %s; min |u| undecided %s' % (fam, res[fam]['read'], res[fam]['nodes_to_read'], res[fam]['ball_evals'], res[fam]['symmetric_nodes'], {t: (res[fam][t], res[fam][t + '/main']) for t, _ in TIERS}, res[fam]['undecided_abs_u_min']), flush=True)
            json.dump(res, open(os.path.join(out, 'ball_und_six.json' if SIX else 'ball_und.json'), 'w'))
        else:
            n = int(sys.argv[4])
            jobs = []
            for fi, fam in enumerate(fams):
                nd = np.load(os.path.join(out, group_of(fam) + '_nodes.npz'))
                r = np.random.Generator(np.random.PCG64(154000 + fi))
                ii = r.integers(0, len(nd['u']), n)
                js = r.integers(0, len(PAIRS), n)
                for i in range(0, n, 20):
                    jobs.append((fam, nd['u'][ii[i:i + 20]], nd['h'][ii[i:i + 20]], js[i:i + 20]))
            for fam, a, b, nb, fu, w in pool.imap_unordered(work_x, jobs):
                q = res.setdefault(fam, dict(agree=0, disagree=0, no_ball=0, float_undecided=0, worst_dev=0.0))
                q['agree'] += a
                q['disagree'] += b
                q['no_ball'] += nb
                q['float_undecided'] += fu
                q['worst_dev'] = max(q['worst_dev'], w)
            for fam in fams:
                print(fam, res[fam], flush=True)
            json.dump(res, open(os.path.join(out, 'ball_xcheck.json'), 'w'))
    print('BALL-DONE %.0fs' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
