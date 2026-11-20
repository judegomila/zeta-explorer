"""Fill the tables of RESULT.md from the JSON outputs (std lib only)."""
import json, glob, math
rows = []
for r in json.load(open('check.json')):
    if r['tau'] == 1.0 and r['x'] >= 1e8: continue            # void: double-precision cancellation (see text)
    if r['x'] < 6000: continue                                 # referee roots, quoted separately
    Dabs = math.hypot(*r['D'])
    rows.append((r['tau'], r['x'], r['eta'], r['s_eff'][0], Dabs, r['absdiff']/Dabs, 'double / zeta-average'))
for r in json.load(open('check3.json')):
    Dabs = math.hypot(*r['Dseries'])
    rows.append((r['tau'], r['x'], r['eta'], r['s_eff'][0], Dabs, r['rel'], '400-bit Arb / series'))
rows.sort()
t = ['| τ | x | η | Re s_eff | \\|D_τ(s_eff)\\| | \\|G − D\\|/\\|D\\| | method |', '| --- | --- | --- | --- | --- | --- | --- |']
for (tau, x, eta, sg, Da, rel, m) in rows:
    t.append('| %g | %.0e | %g | %.4f | %.4g | %.1e | %s |' % (tau, x, eta, sg, Da, rel, m))
vt = '\n'.join(t) + '\n\nThe two x = 1e10 rows are limited by the double-precision phase of the direct series at t = 5e9 (t·log n ≈ 1e11), not by the model.'
zt = ['| τ | x₀ | W | depth box | L | (τ/2)L | zeros in box | boundary winding | pred | zeros with η > 1 | max η | max Re s_eff | independent \\|G\\| at roots | control |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
maxsig = []
lists = []
for f in sorted(glob.glob('zeros_tau*.json'), key=lambda f: (json.load(open(f))['tau'], json.load(open(f))['x0'])):
    d = json.load(open(f)); R = d['roots']
    ver = d.get('verify_independent_acb', []); ctl = d.get('verify_control_nonroot', [0, 0, float('nan')])
    zt.append('| %g | %.3g | %g | [%g, %g] | %.2f | %.3f | %d | %d | %.1f | %d | %.3f | %.3f | %s | %.2f |' % (
        d['tau'], d['x0'], d['W'], d['e1'], d['e2'], d['L'], d['reach_tauL_over_2'], len(R), round(abs(d['boundary_winding'])),
        d['predicted_count_density_law'], sum(1 for r in R if r['eta'] > 1), max(r['eta'] for r in R), max(r['s_eff'][0] for r in R),
        ', '.join('%.0e' % v[2] for v in ver), ctl[2]))
    maxsig.append('%.3f (τ = %g)' % (max(r['s_eff'][0] for r in R), d['tau']))
    lists.append('* τ = %g, x = %.15g + δ: (δ, η) = ' % (d['tau'], d['xc']) + ', '.join('(%.4f, %.4f)' % (r['dx'], r['eta']) for r in R))
s = open('RESULT.md').read()
s = s.replace('VALIDATION_TABLE', vt).replace('ZEROS_TABLE', '\n'.join(zt) + '\n\nLocated zeros z = x − iη:\n' + '\n'.join(lists)).replace('MAXSIG', ', '.join(maxsig))
open('RESULT.md', 'w').write(s)
