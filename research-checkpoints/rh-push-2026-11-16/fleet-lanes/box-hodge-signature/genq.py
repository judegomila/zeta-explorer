# writes queue.txt (priority order)
import math
L = []
def U(obj, h, r, n, d0, dmax, extra=0.0):
    dps = min(dmax, int(d0*1.6))
    mem = (n*n*(5*(96 + dps*0.84) + 150))/1e9*1.3 + 0.4 + extra
    L.append('%.1f python run_u.py --one "%s %s %s %d %d %d" out_u' % (mem, obj, h, r, n, d0, dmax))
def PP(obj, P, X, s, d0, dmax, extra=0.0):
    n = X/math.log(X)*1.2 if P >= X else 60*math.log(P+3)
    dps = min(dmax, d0*2)
    mem = n*n*(6*(96 + dps*0.84) + 400)/1e9*1.3 + 0.4 + extra
    L.append('%.1f python run_pp.py --one "%s %d %d %s %d %d" out_pp' % (mem, obj, P, X, s, d0, dmax))
def HEAT(t, h, r, n, dig=30):
    c1 = 1.5 + 2*abs(float(t))
    L.append('%.1f python heat.py %s %s %s %d %d out_heat %.2f %.2f' % (0.5 + n*n*1500/1e9, t, h, r, n, dig, c1, c1+1))
L.append('0.3 python ff.py 30 > ff_box.out 2>&1')
# --- core tables, r = 0.75
for obj, h, n, d0, dm in [('zeta', '0.03', 500, 200, 420), ('zeta', '0.02', 750, 200, 500), ('zeta', '0.01', 1500, 240, 600), ('zeta', '0.05', 240, 200, 420),
                          ('zeta', '0.1', 80, 150, 600), ('zeta', '0.005', 3000, 190, 500), ('zeta', '0.0025', 3000, 160, 400)]:
    U(obj, h, '0.75', n, d0, dm)
for h, n in [('0.1', 80), ('0.08', 150), ('0.07', 170), ('0.06', 200), ('0.05', 240), ('0.045', 250), ('0.04', 250), ('0.035', 280), ('0.03', 434), ('0.025', 320),
             ('0.02', 500), ('0.015', 500), ('0.01', 800), ('0.005', 1400), ('0.0025', 1800)]:
    U('DH', h, '0.75', n, 100, 500, extra=0.5)
for t in ('-0.02', '-0.05', '-0.1', '-0.2', '-0.3', '-0.5', '-1', '-2', '-4', '0'):
    HEAT(t, '0.03', '0.75', 300)
ctrl = ['EA_0.4', 'EA_0.3', 'EA_0.2', 'EA_0.1', 'EA_0.05', 'EA_0.02', 'EA_0.01', 'EA_0.005', 'EA_0.002', 'EA_0.001',
        'tw-_2', 'tw-_3', 'tw-_5', 'tw-_7', 'tw-_11', 'tw-_13', 'tw-_29', 'tw-_53', 'tw-_101', 'tw-_307', 'tw-_1009', 'tw-_10007', 'tw-_100003',
        'tw+_2', 'tw+_3', 'tw+_7', 'tw+_101', 'tw+_1009', 'drop2', 'drop3', 'drop7', 'drop101', 'drop1009', 'liouville', 'rand1', 'rand2', 'rand3']
for o in ctrl: U(o, '0.03', '0.75', 450, 80, 500)
for o in ctrl: U(o, '0.1', '0.75', 120, 100, 400)
# --- prime-power family
ppobj = ['zeta', 'DH', 'tw-_2', 'tw+_2', 'liouville', 'rand1', 'tw-_101', 'drop2', 'EA_0.2', 'EA_0.05', 'EA_0.01']
for (P, X, s) in [(1000, 1000, '0.05'), (1000, 1000, '0.02'), (7, 10000, '0.05'), (31, 10000, '0.05'), (101, 10000, '0.03'), (3000, 3000, '0.02'), (3000, 3000, '0.01')]:
    for o in ppobj: PP(o, P, X, s, 60, 600)
for (P, X, s) in [(7, 1000000, '0.05'), (31, 1000000, '0.05'), (101, 100000, '0.03'), (2, 1000000, '0.1'), (3, 1000000, '0.1')]:
    for o in ppobj:
        if o != 'DH': PP(o, P, X, s, 60, 400)
# --- r dependence
for r in ('0.3', '0.5', '1.0', '1.5'):
    U('zeta', '0.02', r, 750, 200, 600); U('DH', '0.02', r, 300, 100, 500)
    U('DH', '0.03', r, 250, 100, 500)
# --- heat, finer grid
for t in ('-0.05', '-0.1', '-0.2', '-0.5', '-1', '0'):
    HEAT(t, '0.01', '0.75', 600)
for o in ['EA_0.2', 'EA_0.01', 'EA_0.001', 'tw-_2', 'tw-_101', 'tw-_1009', 'tw+_2', 'drop2', 'liouville', 'rand1']: U(o, '0.01', '0.75', 900, 100, 500)
# --- larger cutoffs (streamed prime sums)
U('zeta', '0.03', '0.75', 600, 260, 420)
U('zeta', '0.02', '0.75', 900, 260, 500)
U('zeta', '0.01', '0.75', 1800, 300, 600)
U('zeta', '0.05', '0.75', 360, 400, 520)
U('zeta', '0.005', '0.75', 3600, 250, 500)
U('zeta', '0.0025', '0.75', 4000, 200, 400)
U('zeta', '0.1', '0.75', 130, 500, 520)
U('DH', '0.1', '0.75', 110, 100, 300, extra=3)
U('DH', '0.03', '0.75', 500, 120, 400, extra=3)
PP('zeta', 10000, 10000, '0.02', 150, 600)
PP('DH', 10000, 10000, '0.02', 150, 600)
U('zeta', '0.03', '0.75', 620, 280, 420, extra=2)
open('queue.txt', 'w').write('\n'.join(L) + '\n')
print(len(L), 'tasks; max est', max(float(l.split()[0]) for l in L))
