# usage: tables.py <dir with out_u out_pp out_heat>   -> markdown tables on stdout
import sys, os, json, glob, math
root = sys.argv[1]
def load(sub):
    out = []
    for f in sorted(glob.glob(os.path.join(root, sub, '*.json'))):
        try: out.append(json.load(open(f)))
        except Exception: pass
    return out
U = load('out_u') + load('out_big'); PPs = load('out_pp'); H = load('out_heat')
DHP = load('out_dh'); SC = load('out_scan')
keys = {(r['h'], r['r'], r['n']) for r in DHP}
DHall = DHP + [dict(r, old=True) for r in U if r['obj'] == 'DH' and (r['h'], r['r'], r['n']) not in keys]
def fl(x, d=2): return '-' if x is None else ('%.*f' % (d, x))
def okey(o):
    order = ['zeta', 'DH', 'EA', 'tw-', 'tw+', 'drop', 'liou', 'rand']
    name = o['obj']
    for i, p in enumerate(order):
        if name.startswith(p):
            tail = name.split('_')[-1] if '_' in name else name[4:]
            try: v = float(tail)
            except Exception: v = 0
            return (i, -v if p == 'EA' else v, name)
    return (99, 0, name)
print('### Uniform family: zeta\n')
print('| h | r | n | cutoff c=(n-1)h | X=e^c | Nyquist pi/h | digits | certified stages | inertia of full form (+,-) | min log10 abs pivot | max entry radius | height horizon T | table s | certificate s | peak RSS MB |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in sorted([r for r in U if r['obj'] == 'zeta'], key=lambda r: (float(r['r']), -float(r['h']), r['n'])):
    c = (r['n']-1)*float(r['h'])
    v = 2*(float(r['r'])*float(r['h']))**2; Th = math.sqrt(2*(-r['min_log10_abs_pivot']*math.log(10) + c/2 + 5)/v)
    print('| %s | %s | %d | %.2f | %.3g | %.0f | %d | %d/%d | (%d,%d) | %.1f | %.1e | %.0f | %s | %s | %.0f |' % (r['h'], r['r'], r['n'], c, math.exp(c), math.pi/float(r['h']), r['dps'], r['determined'], r['n'],
          r['inertia_full_at_determined'][0], r['inertia_full_at_determined'][1], r['min_log10_abs_pivot'], r['max_entry_radius'], Th, r['t_table'], r['t_levinson'], r['maxrss_mb']))
print('\n### Uniform family: Davenport-Heilbronn (no pole classes; Lorentzian analogue = no positive eigenvalue)\n')
print('| h | r | n | cutoff | Nyquist | certified | first stage n* with a positive eigenvalue | cutoff c* = (n*-1)h | X* = e^c* | positive eigenvalues at stages | i_+ at full size | min log10 abs pivot | digits | tail bound |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in sorted(DHall, key=lambda r: (float(r['r']), -float(r['h']), r['n'])):
    c = (r['n']-1)*float(r['h']); p = r['pos_pivot_stages']
    print('| %s | %s | %d | %.2f | %.0f | %d/%d | %s | %s | %s | %s%s | %d | %.1f | %d |' % (r['h'], r['r'], r['n'], c, math.pi/float(r['h']), r['determined'], r['n'], r['first_pos'] or 'none',
          fl(r['first_pos_cutoff']), ('%.1f' % math.exp(r['first_pos_cutoff'])) if r['first_pos'] else '-', p[:8], '...' if len(p) > 8 else '', len(p), r['min_log10_abs_pivot'], r['dps']) + (' g=1 (hypothesis) |' if r.get('old') else ' g=2 (proved) |'))
print('\n### DH grid scan: first stage n* with a positive eigenvalue (cutoff c*), by spacing h and width ratio r; "-" = none up to the size run\n')
rs = sorted({r['r'] for r in SC}, key=float); hs = sorted({r['h'] for r in SC}, key=float)
print('| h | Nyquist | n run | ' + ' | '.join('r=' + x for x in rs) + ' |')
print('|---|---|---|' + '---|'*len(rs))
best = None
for h in hs:
    row = []; nrun = ''
    for rr in rs:
        m = [r for r in SC if r['h'] == h and r['r'] == rr]
        if not m: row.append('n/a'); continue
        m = m[0]; nrun = m['n']
        if m['first_pos']:
            row.append('%d (%.2f)%s' % (m['first_pos'], m['first_pos_cutoff'], '' if m['determined'] == m['n'] else '*'))
            if best is None or m['first_pos'] < best[0]: best = (m['first_pos'], h, rr, m['first_pos_cutoff'])
        else: row.append('-' if m['determined'] == m['n'] else '- (to %d)' % m['determined'])
    print('| %s | %.0f | %s | %s |' % (h, math.pi/float(h), nrun, ' | '.join(row)))
print('\nSmallest first-failure dimension in the scan: n* = %d at h = %s, r = %s, cutoff c* = %.2f.' % best)
print('\n### Uniform family: other controls (first stage with i_+ above the pole count)\n')
cfg = sorted({(r['h'], r['r'], r['n']) for r in U if r['obj'] not in ('zeta', 'DH')}, key=lambda t: (-float(t[0]), t[2]))
for (h, rr, n) in cfg:
    print('\nh = %s, r = %s, n = %d (cutoff %.2f)\n' % (h, rr, n, (n-1)*float(h)))
    print('| control | certified | first failing stage n* | cutoff c* | e^c* | extra positive eigenvalues at full size | min log10 abs pivot |')
    print('|---|---|---|---|---|---|---|')
    for r in sorted([r for r in U if (r['h'], r['r'], r['n']) == (h, rr, n) and r['obj'] not in ('zeta', 'DH')], key=okey):
        print('| %s | %d/%d | %s | %s | %s | %d | %.1f |' % (r['obj'], r['determined'], r['n'], r['first_pos'] or 'none', fl(r['first_pos_cutoff']),
              ('%.1f' % math.exp(r['first_pos_cutoff'])) if r['first_pos'] else '-', len(r['pos_pivot_stages']), r['min_log10_abs_pivot']))
print('\n### Prime-power family (classes D_q, q = 1 and prime powers p^k <= X, p <= P; Gaussian width s)\n')
print('| object | P | X | s | classes n | certified | inertia of full form (+,-) | first q with an extra positive eigenvalue | number of extra positive | min log10 abs pivot | digits | entries s | cert s |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for r in sorted(PPs, key=lambda r: (r['P'], r['X'], -float(r['s']), okey(r))):
    print('| %s | %d | %d | %s | %d | %d/%d | (%d,%d) | %s | %d | %s | %d | %s | %s |' % (r['obj'], r['P'], r['X'], r['s'], r['n'], r['determined'], r['n'], r['inertia_full_at_determined'][0], r['inertia_full_at_determined'][1],
          r['first_pos_q'] or 'none', len(r['pos_pivot_stages']), fl(r['min_log10_abs_pivot'], 1), r['dps'], r['t_entries'], r['t_cert']))
print('\n### Backward heat (MEASURED entries; certificate exact given the stated radius)\n')
print('| t | h | n | contour difference | radius used | certified | first stage with a positive eigenvalue | cutoff c* | positive eigenvalues (certified part) | min log10 abs pivot |')
print('|---|---|---|---|---|---|---|---|---|---|')
for r in sorted(H, key=lambda r: (-float(r['h']), -float(r['t']))):
    print('| %s | %s | %d | %.1e | %.1e | %d/%d | %s | %s | %d | %s |' % (r['t'], r['h'], r['n'], r['contour_diff'], r['entry_radius'], r['determined'], r['n'], r['first_pos'] or 'none', fl(r['first_pos_cutoff']), len(r['pos_pivot_stages']), fl(r['min_log10_abs_pivot'], 1)))
