import json, glob, re
def n(s): return re.match(r'\[?([-+0-9.e]+)', s).group(1)
print('| tau | run (y0, a, bits) | square centre x | centre Im z | half-width | nodes | eps_trap+eps_tail (scaled) | min abs F on segments (scaled, lower) | segments | winding F | winding H_0 |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
for t in open('jobs.txt').read().split():
    for f in ['out_%s_A_p128.json' % t, 'out_%s_A_p256.json' % t, 'out_%s_B_p256.json' % t]:
        try: d = json.load(open(f))
        except Exception: print('|', t, '|', f, 'missing |'); continue
        c = d['config']
        for r in d['rects']:
            F = r['F']; Z = r['zeta_control_H0']
            eps = float(n(r['eps_trap'])) + float(n(r['eps_tail']))
            print('| %s | %s, %s, %d | %s | %s | %s | %d | %.2e | %s | %d | %s | %s |' % (c['tau'], c['y0'], c['a'], d['prec'], n(r['x_centre_abs']).rstrip('0'), r['centre_y'], r['half_width'],
                  d['n_nodes'], eps, ('%.3e' % F['min_abs_segment_enclosures_lower']) if 'min_abs_segment_enclosures_lower' in F else '-', F['n_segments'], F.get('winding_integer'), Z.get('winding_integer')))
