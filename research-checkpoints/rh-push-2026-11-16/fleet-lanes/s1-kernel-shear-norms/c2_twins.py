# Combination 2 at scale: first window L* with ||H_{a,L}|| > 1 + TOL for every route-44 twin, against its off-line zeros.
import sys, os, json, math, time
os.environ['NOGPU'] = '1'; os.environ.setdefault('CHUNK_BYTES', '6e7')
import numpy as np
import hlib, klib
from multiprocessing import Pool
a = float(os.environ.get('A', 0.05)); LMAX = float(os.environ.get('LMAX', 3.6)); h = float(os.environ.get('H', 0.004))
STEP = float(os.environ.get('STEP', 0.05)); TOL = float(os.environ.get('TOL', 1e-8))
windows = [round(0.3 + STEP*i, 6) for i in range(int((LMAX - 0.3)/STEP) + 1)]
N = int(math.exp(2*LMAX)) + 2
ZER = json.load(open(os.path.join(klib.HERE, 'twin_zeros.json')))
def work(T):
    t0 = time.time()
    try:
        if T['kind'] == 'twin':
            Afun = (lambda z: hlib.A_F(z, a, T['q'], T['delta'])); c = hlib.quotient_coeffs(hlib.periodic(T['b'], N), a, N); real = True
        else:
            Afun, c, real = hlib.make_object(T['key'], a, N)
        u, m, info = hlib.hankel_sequence(Afun, c, a, LMAX, h, J=int(os.environ.get('J', 10)))
        # coarse curve, then bisection for the first window with excess > TOL (the norm is nondecreasing in l)
        coarse = [w for i, w in enumerate(windows) if i % 6 == 0 or i == len(windows) - 1]
        res = hlib.window_norms(m, LMAX, h, coarse, real=real, want_vec=False, tol=TOL)
        ex = [(r['l'], r['norm_minus_1']) for r in res]
        lstar = None
        hi = next((l for l, e in ex if e > TOL), None)
        if hi is not None:
            lo = max([l for l, e in ex if l < hi and e <= TOL], default=None)
            ilo = windows.index(lo) if lo is not None else -1; ihi = windows.index(hi)
            while ihi - ilo > 1:
                mid = (ilo + ihi)//2
                r = hlib.window_norms(m, LMAX, h, [windows[mid]], real=real, want_vec=False, tol=TOL)[0]
                ex.append((r['l'], r['norm_minus_1']))
                if r['norm_minus_1'] > TOL: ihi = mid
                else: ilo = mid
            lstar = windows[ihi]
        ex.sort()
    except Exception as e:
        return {'key': T['key'], 'error': repr(e)}
    fr = None
    if lstar is not None:
        ls2 = min(LMAX, lstar + 2*STEP)
        fr = hlib.window_norms(m, LMAX, h, [ls2], real=real, want_vec=True, tol=TOL)[0]['top_eigfn_freq']
    z = ZER.get(T['key'], {})
    return {'key': T['key'], 'q': T.get('q'), 'delta': T.get('delta'), 'a1': T.get('a1'), 'l_star': lstar, 'onset_eigfn_freq': fr,
            'excess': ex, 'max_excess': max(e for l, e in ex), 'zeros': z.get('offline_zeros'), 'real_zeros': z.get('real_zeros_right'),
            'T_scanned': z.get('T_scanned'), 'secs': time.time() - t0}
if __name__ == '__main__':
    tw = [{'kind': 'twin', 'key': T['key'], 'q': T['q'], 'delta': T['delta'], 'b': T['b'], 'a1': T['a1']} for T in klib.twin_table()]
    lim = int(os.environ.get('LIMIT', 0))
    if lim: tw = tw[::max(1, len(tw)//lim)]
    extra = [{'kind': 'obj', 'key': k} for k in ('zeta', 'chi_real_q3', 'chi_real_q4', 'chi_real_q5', 'chi_real_q7', 'chi_real_q8', 'chi_real_q11', 'chi_real_q13', 'DH')]
    jobs = extra + tw
    print('a=%g LMAX=%g h=%g N=%d jobs=%d windows=%d' % (a, LMAX, h, N, len(jobs), len(windows)), flush=True)
    out = []
    with Pool(int(os.environ.get('RH_WORKERS', 4))) as p:
        for r in p.imap_unordered(work, jobs):
            out.append(r)
            print(r['key'], 'l*=', r.get('l_star'), 'freq=', r.get('onset_eigfn_freq'), 'maxexc=%.3e' % r.get('max_excess', float('nan')), 'zeros', (r.get('zeros') or [])[:2], '%.0fs' % r.get('secs', 0), r.get('error', ''), flush=True)
            json.dump(out, open(os.path.join(klib.HERE, 'out', 'c2_twins_a%g.json' % a), 'w'))
