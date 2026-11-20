"""Second pass for off-line zeros of HEAT (gap rule). Usage: python heat_gaps.py <tables>
For each gap between consecutive on-line zeros, E = Nsmooth(t_{i+1}) - Nsmooth(t_i), Nsmooth(t) = (t/2pi) log(t/2pi e) + 7/8, is the
expected number of zeros per unit of the gap (the flow moves zeros continuously; the count per height range is that of zeta up to
boundary effects). Where E - 1 - 2 (pairs already found in the gap) >= 1.2, Newton is started from points spread over the gap at
Re z in {0.2, 0.5, 0.9, 1.4}. New roots are appended to zeros_HEAT-<tau>.json (field second_pass). MEASURED; completeness not certified."""
import os, sys, json, math, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flint import acb, arb, ctx
import heat
import multiprocessing as mp
W = int(os.environ.get('RH_WORKERS', '4'))
def ns(t): return t / (2 * math.pi) * math.log(t / (2 * math.pi * math.e)) + 0.875
def task(args):
    ti, a, b, m = args; tau = heat.TAUS[ti]; out = []
    pts = [a + (b - a) * (k + 0.5) / (m + 1) for k in range(m + 1)]
    for tc in pts:
        for x0 in (0.2, 0.5, 0.9, 1.4):
            z = acb(x0, tc); ok = False
            for it in range(20):
                f, d = heat._H.F(tau, z, True)
                if d == 0: break
                dz = f / d
                z = acb(z.real.mid(), z.imag.mid()) - acb(dz.real.mid(), dz.imag.mid())
                if not (a - 0.5 < float(z.imag.mid()) < b + 0.5) or abs(float(z.real.mid())) > 4: break
                if float(abs(dz).upper()) < 1e-30: ok = True; break
            if ok and abs(float(z.real.mid())) > 1e-9:
                f, d = heat._H.F(tau, z, True)
                r = abs(float(z.real.mid())); 
                out.append([z.real.str(32, radius=False).lstrip('-'), z.imag.str(32, radius=False), float((abs(f) / abs(d)).upper())])
    return ti, out
def main():
    tables = sys.argv[1]; T0 = time.time()
    Z = {i: json.load(open(os.path.join(tables, 'zeros_HEAT-%s.json' % tau))) for i, tau in enumerate(heat.TAUS)}
    H = Z[0]['H']; new = {i: [] for i in Z}
    for (ta, tb) in heat.band_edges(H):
        tasks = []
        for i in Z:
            on = [float(x) for x in Z[i]['online']]; off = [float(q[1]) for q in Z[i]['offline']]
            for a, b in zip(on[:-1], on[1:]):
                mid = (a + b) / 2
                if not (ta < mid <= tb) or a < 20: continue
                k = sum(1 for p in off if a < p < b)
                room = ns(b) - ns(a) - 1 - 2 * k
                if room >= 1.2: tasks.append((i, a, b, max(1, int(round(room / 2)))))
        print('band [%g, %g]: %d gaps flagged' % (ta, tb, len(tasks)), flush=True)
        if not tasks: continue
        with mp.get_context('fork').Pool(W, initializer=heat.init_band, initargs=(tb, False)) as p:
            for ti, out in p.imap_unordered(task, tasks, chunksize=1):
                for r in out:
                    known = Z[ti]['offline'] + new[ti]
                    if all(abs(float(r[0]) - float(q[0])) + abs(float(r[1]) - float(q[1])) > 1e-9 for q in known): new[ti].append(r)
        print('band [%g, %g]: new pairs %s, %.0f s' % (ta, tb, [len(new[i]) for i in new], time.time() - T0), flush=True)
    for i, tau in enumerate(heat.TAUS):
        d = Z[i]; d['second_pass'] = dict(rule='gap rule (heat_gaps.py)', new_pairs=len(new[i]))
        d['offline'] = sorted(d['offline'] + new[i], key=lambda q: float(q[1])); d['offline_pairs'] = len(d['offline'])
        if d.get('zeta_zero_count_below_H') is not None: d['count_diagnostic'] = d['zeta_zero_count_below_H'] - d['online_count'] - 2 * d['offline_pairs']
        json.dump(d, open(os.path.join(tables, 'zeros_HEAT-%s.json' % tau), 'w'))
        print('HEAT', tau, 'on-line', d['online_count'], 'pairs', d['offline_pairs'], 'diagnostic', d.get('count_diagnostic'), flush=True)
if __name__ == '__main__':
    main()
