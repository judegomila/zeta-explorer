"""Summary table of combination 1."""
import json, glob, os
rows = []
def L(f):
    return json.load(open(f)) if os.path.exists(f) else None
print('kind       tau    method   T      sigma_max(T) [at T<=5e2 | 5e3 | 1e4 | 2e4 | 5e4]            sigma_2   sigma_3   sigma_5   sigma_abs  offset=2smax-1')
for tau in ('0.25', '1', '4', '16'):
    for kind, pre in (('zeta', 'esc'), ('zeta', 'esc@T1e4'), ('chi4', 'esc'), ('dh', 'esc'), ('tnr', 'esc'), ('ea', 'esc'), ('zeta', 'escs'), ('liouville', 'escs'), ('rsign', 'escs'), ('rphase', 'escs'), ('mobius', 'escs'), ('dh', 'escs')):
        f = 'out/%s_%s_%s%s.json' % (pre.split('@')[0], kind, tau, '_T1e4' if '@' in pre else '')
        d = L(f)
        if d is None: continue
        b = d['bounds']; sm = d['sigma_max_by_T']
        g = lambda k: ('%8.4f' % sm[k][0]) if sm.get(k) else '    -   '
        fm = lambda v: ('%8.4f' % v) if v is not None else '   none '
        print('%-10s %-5s %-8s %-6g %s %s %s %s %s    %s %s %s %s   %8.4f  n=%d step=%.2f' % (kind, tau, d['method'], d['T'], g('500'), g('5000'), g('10000'), g('20000'), g('50000'),
              fm(b['sigma_2']), fm(b['sigma_3']), fm(b['sigma_5']), fm(b['sigma_abs']), d['offset_2sigma_minus_1'], d['nzeros'], d['max_phase_step']))
        rows.append(dict(kind=kind, tau=float(tau), method=d['method'], T=d['T'], sigma_max_by_T=sm, bounds=b, offset=d['offset_2sigma_minus_1'], nzeros=d['nzeros'], top3=d['top'][:3]))
print()
for f in sorted(glob.glob('out/dir_*.json')):
    d = json.load(open(f))
    for c in d['checks']:
        print('direct %-5s tau=%-5g D zero (%.5f, %.3f) -> true zero of H_-tau at x=%.4f eta=%.5f ; |z_true - z_model| = %.2e ; L^2/x = %.1e' % (d['kind'], d['tau'], c['D_zero'][0], c['D_zero'][1], c['z_true'][0], c['eta_true'], c['dist'], c['L2_over_x']))
    rows.append(dict(direct=d))
json.dump(rows, open('out/an1_summary.json', 'w'), indent=1)
