import sys, json, glob, math
print('| object | weights | N | dim | onset K0 | onset T0 (float64) | T0 q/(2 pi N^2) | rho just before | last feasible level in list (T, rho) |'); print('|---|---|---|---|---|---|---|---|---|')
for f in sys.argv[1:]:
    d = json.load(open(f))
    Ns = sorted(set(r['N'] for r in d['rows']))
    for N in Ns:
        rows = [r for r in d['rows'] if r['N'] == N]; feas = [r for r in rows if r['status'] == 'feasible']
        o = d['onset'].get(str(N)); dim = N * (2 if d['mode'] == 'cossin' else 1)
        lf = '%.4g, %.4f' % (feas[-1]['T'], feas[-1]['rho_upper']) if feas else '-'
        if o: print('| %s | %s | %d | %d | %d | %.6g | %.0f | %.2e | %s |' % (d['obj'], d['mode'], N, dim, o['K0'], o['T0'], o['T0_over_2piN2_over_q'], o['rho_before'], lf))
        else: print('| %s | %s | %d | %d | none in list | > %.4g | | | %s |' % (d['obj'], d['mode'], N, dim, rows[-1]['T'], lf))
