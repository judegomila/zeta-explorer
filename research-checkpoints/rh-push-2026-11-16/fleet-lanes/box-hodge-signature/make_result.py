import json, glob, math, re, subprocess, sys
PY = sys.executable
tab = subprocess.run([PY, 'tables.py', 'box'], capture_output=True, text=True).stdout
def sect(a, b=None):
    i = tab.index(a); j = tab.index(b, i) if b else len(tab)
    return tab[i:j].split('\n', 1)[1].strip('\n')
U = [json.load(open(f)) for f in glob.glob('box/out_u/*.json') + glob.glob('box/out_big/*.json')]
Z = [r for r in U if r['obj'] == 'zeta' and r['determined'] == r['n']]
zn = max(r['n'] for r in Z); zc = max((r['n']-1)*float(r['h']) for r in Z)
def hor(r):
    c = (r['n']-1)*float(r['h']); v = 2*(float(r['r'])*float(r['h']))**2
    return math.sqrt(2*(-r['min_log10_abs_pivot']*math.log(10) + c/2 + 5)/v)
zt = max(hor(r) for r in Z)
SC = [json.load(open(f)) for f in glob.glob('box/out_scan/*.json')]
best = min((r for r in SC if r['first_pos']), key=lambda r: r['first_pos'])
head = open('RESULT_head.md').read()
head = head.replace('__ZN__', str(zn)).replace('__ZX__', '%.1e' % math.exp(zc)).replace('__ZC__', '%.1f' % zc).replace('__ZT__', '%.0f' % (round(zt/100)*100))
head = head.replace('__DHMIN__', '%d (h = %s, r = %s, c* = %.2f)' % (best['first_pos'], best['h'], best['r'], best['first_pos_cutoff']))
# calibration table
rows = []
for line in open('box/ff_box.out'):
    if line.startswith('#'): rows.append(('#', line[1:].strip())); continue
    m = re.match(r'(.*?)\s+q=(\d+) g=(\d+)\s+N_1..N_3=(\[.*?\]) \| classes (.*?): inertia \(\+,-,0\) = (\(.*?\)) \| rank bound 2g\+2=(\d+) \| first k with i_\+ > 1: (\S+) \| arb pipeline, -Z Toeplitz pivots 1..2g: (\S*) \(certified (\d+)/(\d+)\)', line)
    if m: rows.append(m.groups())
cal = ['| object | q | g | N_1, N_2, N_3 | inertia (+,-,0) on H, V, G_0..G_30 | 2g+2 | first k with a second positive eigenvalue | signs of the first Toeplitz pivots of -Z (Arb pipeline) |', '|---|---|---|---|---|---|---|---|']
for r in rows:
    if r[0] == '#': continue
    name = r[0].replace('fake g=2: 1 + 0T - 9T^2 + 0T^3 + 25T^4 (complex quartet)', 'Weil polynomial 1 - 9T^2 + 25T^4 (roots on the circle)').replace('fake g=2: 1 - T - 4T^2 - 5T^3 + 25T^4', 'Weil polynomial 1 - T - 4T^2 - 5T^3 + 25T^4 (roots on the circle)')
    cal.append('| %s | %s | %s | %s | %s | %s | %s | %s (%s of %s nonsingular stages) |' % (name, r[1], r[2], r[3].strip('[]'), r[5], r[6], r[7].replace('None', 'none'), r[8], r[9], r[10]))
mid = open('RESULT_mid.md').read()
mid = mid.replace('__T_ZETA__', sect('### Uniform family: zeta', '### Uniform family: Davenport'))
mid = mid.replace('__T_DH__', sect('### Uniform family: Davenport', '### DH grid scan'))
mid = mid.replace('__T_SCAN__', sect('### DH grid scan', '### Uniform family: other controls'))
mid = mid.replace('__T_CTRL__', sect('### Uniform family: other controls', '### Prime-power family'))
mid = mid.replace('__T_PP__', sect('### Prime-power family', '### Backward heat'))
mid = mid.replace('__T_HEAT__', sect('### Backward heat'))
mid = mid.replace('__T_CAL__', '\n'.join(cal))
tail = open('RESULT_tail.md').read().replace('__UNITS__', open('units.md').read().strip())
chk = glob.glob('box/out_heat_chk/*.json')
hc = 'not re-run'
if chk:
    r = json.load(open(chk[0])); hc = 'max difference %.1e over %d lags at h = %s, 45-digit run, after the fix of section 2.3 item 2' % (r['max_diff_vs_prime_side'], r['n'], r['h'])
tail = tail.replace('__HEATCHK__', hc).replace('__ZT__', '%.0f' % (round(zt/100)*100))
open('RESULT.md', 'w').write(head + '\n' + mid + '\n' + tail)
print('written', len(head + mid + tail), 'chars; zeta max n', zn, 'max c %.2f' % zc, 'horizon %.0f' % zt, 'best DH', best['first_pos'], best['h'], best['r'])
