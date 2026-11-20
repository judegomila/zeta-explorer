"""assembles RESULT.md from RESULT_head.md, the tables (from the out_*.json files), RESULT_mid.md, RESULT_tail.md."""
import json, re, subprocess, os
def n(s): return re.match(r'\[?([-+0-9.e]+)', s).group(1)
out = [open('RESULT_head.md').read()]
out.append('## 3. Item A: table of squares, precisions and winding numbers\n\n')
out.append('Columns: tau; run = (y0, a, bits); centre of the square (x = Re z, Im z = -eta), exact decimals; half-width; number of\n'
           'trapezoid nodes; eps = eps_trap + eps_tail of (A1) in the scaled units; lower bound for abs F on the contour from the segment\n'
           'enclosures (scaled units; for comparison the samples have max modulus 3e2 to 2e5); number of segments after refinement;\n'
           'winding number of F; winding number of H_0 (zeta) on the same square. Every winding number is the unique integer in a ball\n'
           'of radius below 1e-13.\n\n')
out.append(subprocess.run(['python3', 'table.py'], capture_output=True, text=True).stdout)
out.append('\nEnclosures in the variable z (and s = (1 + iz)/2), from the half-width 1e-6 squares; each contains exactly one zero of H_{-tau}, simple:\n\n')
out.append('| tau | Re z | Im z | Re s = (1 - Im z)/2 | Im s = Re z / 2 | recorded by b-escape-law (x - XC, eta), XC the integer nearest to x |\n|---|---|---|---|---|---|\n')
for t in open('jobs.txt').read().split():
    d = json.load(open('out_%s_A_p256.json' % t)); r = d['rects'][1]; c = d['config']
    x = n(r['x_centre_abs']).rstrip('0'); y = float(r['centre_y'])
    out.append('| %s | %s +- 1e-6 | %s +- 1e-6 | %.7f | %.4f | (%.9f, %.9f) |\n' % (c['tau'], x, r['centre_y'], (1 - y)/2, float(x)/2, float(c['dx']), float(c['eta'])))
mx = 0; cnt = 0; tw = 0
for t in open('jobs.txt').read().split():
    for f in ['out_%s_A_p128.json' % t, 'out_%s_A_p256.json' % t, 'out_%s_B_p256.json' % t]:
        d = json.load(open(f)); tw += d['wall_s']
        for r in d['rects']:
            cnt += 1; mx = max(mx, r['F']['refinement_rounds'])
            assert r['F']['winding_integer'] == 1 and r['zeta_control_H0']['winding_integer'] == 0
out.append('\n%d certified squares in %d runs; all windings 1 for F and 0 for H_0; at most %d bisection rounds (only on half-width 0.05 squares at\n'
           'tau = 0.15 and 0.1, where the line Im w = y0 is far from the saddle line and the terms of the sum cancel to about 1e-4 of their\n'
           'size); total wall time of the 18 runs %.0f s on at most 8 cores (samples) and 1 core (the rest).\n\n' % (cnt, 18, mx, tw))
out.append(open('RESULT_mid.md').read())
out.append('| control | parameter | square centre (Re s, Im s) | half-width | bits | segments | lower bound abs G on contour | winding G | winding zeta |\n|---|---|---|---|---|---|---|---|---|\n')
for p in (128, 256):
    d = json.load(open('out_bc_p%d.json' % p))
    for r in d['items']:
        out.append('| %s | %s | (%s, %s) | %s | %d | %d | %.3e | %s | %s |\n' % (r['control'], ('b = ' + r['b']) if 'b' in r else ('c = ' + r['c']), r['centre'][0], r['centre'][1],
                   r['half_width'], p, r['G']['n_segments'], r['G']['min_abs_segment_enclosures_lower'], r['G']['winding_integer'], r['zeta_control']['winding_integer']))
out.append('\nClosed-form zeros (Arb, 256 bits): NR-q c = 2.1: 0.857311316383780998955007636460 + 3.56442795638273822354882690595 i (recorded: 0.857311 + 3.564428 i);\n'
           'c = 2.05: 0.753177034801772327886706734832 + 3.56442795638273822354882690595 i. SG: 0.8 and 0.9 exactly.\n'
           'A first choice b = 0.45 was dropped: its half-width 0.05 square touches the pole of zeta at s = 1.\n\n')
out.append(open('RESULT_D.md').read())
out.append(open('RESULT_tail.md').read())
open('RESULT.md', 'w').write(''.join(out))
print(len(''.join(out)))
