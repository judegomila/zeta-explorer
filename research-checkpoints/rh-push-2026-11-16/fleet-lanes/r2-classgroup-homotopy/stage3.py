# Assemble certified data, classify intervals, compute collision angles and statistics.
import json, glob, math, sys
from lib import *
ctx.prec = 128
files = sorted(glob.glob('s1/c_*.json'), key=lambda f: int(f.split('_')[1].split('.')[0]))
a = []; b = []; w = []; cover = []; flags = []
for f in files:
    d = json.load(open(f)); cover.append((d['T0'], d['T1']))
    a += [tuple(x) for x in d['a']]; b += [tuple(x) for x in d['b']]; w += d['w']
    for k in 'abw':
        for fl in d['flags'][k]: flags.append((k, fl))
cover.sort(); TMAX = cover[-1][1]
gaps = [(cover[i][1], cover[i + 1][0]) for i in range(len(cover) - 1) if abs(cover[i][1] - cover[i + 1][0]) > 1e-9]
print('coverage: [%g, %g], chunks %d, gaps %s' % (cover[0][0], TMAX, len(cover), gaps))
print('flags (expected: only the forced critical point t=0 of the odd function W):', [f for f in flags if not (f[0] == 'w' and f[1][0] == 0.0)][:10], 'total', len(flags))
a.sort(); b.sort(); w.sort(key=lambda x: x['lo'])
print('counts: zeros of A: %d, zeros of B: %d, critical points of R in (0,T]: %d' % (len(a), len(b), len(w)))
print('max enclosure widths: a %.2e b %.2e w %.2e' % (max(h - l for l, h in a), max(h - l for l, h in b), max(x['hi'] - x['lo'] for x in w)))
# merged special points; certified disjointness
sp = sorted([(l, h, 'a') for l, h in a] + [(l, h, 'b') for l, h in b])
mind = min(sp[i + 1][0] - sp[i][1] for i in range(len(sp) - 1))
print('min separation between consecutive enclosures of zeros of A*B: %.3e (positive => all zeros simple and distinct)' % mind)
assert mind > 0
# sign of R on each interval: certified at one interior point, alternation checked
def Rat(t):
    ZA, ZB, _ = hardy(arb(t), 1)
    return ZB[0] / ZA[0]
ints = []   # interval k = (left endpoint index or None for t=0, right endpoint index)
bounds = [(0.0, 0.0, '0')] + sp
signs = []
for i in range(len(bounds) - 1):
    lo = bounds[i][1]; hi = bounds[i + 1][0]
    m = lo + (hi - lo) * 0.5
    v = Rat(m)
    assert not v.contains(0)
    signs.append(1 if v > 0 else -1)
alt = all(signs[i] == -signs[i + 1] for i in range(len(signs) - 1))
print('sign of R alternates across consecutive intervals:', alt, ' sign on [0, first zero):', signs[0])
# attach critical points
import bisect
los = [x[0] for x in bounds]
crit_in = [[] for _ in range(len(bounds) - 1)]
for x in w:
    k = bisect.bisect_right(los, x['lo']) - 1
    if k >= len(crit_in): continue
    assert bounds[k][1] < x['lo'] and x['hi'] < bounds[k + 1][0]
    crit_in[k].append(x)
types = {}
recs = []
for k in range(1, len(bounds) - 1):
    ty = bounds[k][2] + bounds[k + 1][2]
    key = ('ab' if ty in ('ab', 'ba') else ty, len(crit_in[k]))
    types[key] = types.get(key, 0) + 1
print('interval types (type, number of critical points): ', dict(sorted(types.items())))
par_ok = all((len(crit_in[k]) % 2 == (0 if bounds[k][2] != bounds[k + 1][2] else 1)) for k in range(1, len(bounds) - 1))
print('parity rule (ab even, aa/bb odd) holds on every interval:', par_ok)
# collision angles for each zero of A (phi from 0) and each zero of B (phi from pi/2)
def acot(x): return math.atan2(1.0, x)
rows_a = []; rows_b = []
idx = {'a': 0, 'b': 0}
for j in range(1, len(bounds)):
    lo, hi, ty = bounds[j]; idx[ty] += 1
    out = {}
    for side, k in (('L', j - 1), ('R', j)):
        if k >= len(crit_in): out[signs[k - 1] * -1 if k - 1 >= 0 else 0] = None; continue
        cs = crit_in[k]
        if side == 'L': other = bounds[k]; first = cs[-1] if cs else None
        else: other = bounds[k + 1] if k + 1 < len(bounds) else None; first = cs[0] if cs else None
        if k == 0 and side == 'L' and not cs: first = {'lo': 0.0, 'hi': 0.0, 'R_mid': float(Rat(0.0).mid()), 'R_rad': 0}; 
        out[signs[k]] = (first, other)
    rec = {'n': idx[ty], 't': (lo + hi) / 2}
    for sg, name in ((-1, 'Z1side'), (1, 'Z2side')):
        v = out.get(sg)
        if v is None: rec[name] = None; continue
        first, other = v
        if first is None:
            rec[name] = {'kind': 'transit', 'to': other[2], 't_other': (other[0] + other[1]) / 2}
        else:
            Rc = abs(first['R_mid'])
            rec[name] = {'kind': 'collision', 't_c': (first['lo'] + first['hi']) / 2, 'absR': Rc,
                         'angle': acot(Rc) if ty == 'a' else math.atan(Rc)}   # angle measured from the Euler point
    (rows_a if ty == 'a' else rows_b).append(rec)
json.dump({'a': rows_a, 'b': rows_b, 'TMAX': TMAX, 'na': len(a), 'nb': len(b)}, open('stage3_table.json', 'w'))
def fmt(r):
    def one(v):
        if v is None: return '   (beyond range)'
        if v['kind'] == 'transit': return ' transit -> %s zero %.6f' % (v['to'], v['t_other'])
        return ' leaves at angle %.6f (t_c=%.6f, |R|=%.5g)' % (v['angle'], v['t_c'], v['absR'])
    return '%4d %12.6f |%-52s|%-52s' % (r['n'], r['t'], one(r['Z1side']), one(r['Z2side']))
with open('table_A_zeros.txt', 'w') as f:
    f.write('# zeros gamma_n of A = 2 zeta L(chi_-20) (phi=0). Z1 side: phi in (0,pi/2) [R<0]; Z2 side: phi in (-pi/2,0) = (pi/2,pi) mod pi [R>0].\n# angle = |phi_c| = arccot|R(t_c)| at the first critical point of R met by the zero; transit = reaches the other Euler point without collision.\n')
    for r in rows_a: f.write(fmt(r) + '\n')
with open('table_B_zeros.txt', 'w') as f:
    f.write('# zeros of B = 2 L(chi_5) L(chi_-4) (phi=pi/2). angle = |phi - pi/2| at the first collision = arctan|R(t_c)|.\n')
    for r in rows_b: f.write(fmt(r) + '\n')
# ---- statistics ----
def stats(rows, T, label):
    rr = [r for r in rows if r['t'] < T]
    out = {}
    for side in ('Z1side', 'Z2side'):
        col = [r[side]['angle'] for r in rr if r[side] and r[side]['kind'] == 'collision']
        tr = sum(1 for r in rr if r[side] and r[side]['kind'] == 'transit')
        col.sort()
        q = lambda p: col[int(p * (len(col) - 1))] if col else float('nan')
        out[side] = (len(col), tr, col[0] if col else None, q(.1), q(.5), q(.9))
    return out
print('\n== collision statistics for zeros of A (angle from phi=0) and B (angle from phi=pi/2)')
print('T    | set side : #colliding  #transit  min angle  q10  median  q90')
for T in (100, 200, 264, 500, 1000, 1500, 2000):
    if T > TMAX: break
    for label, rows in (('A', rows_a), ('B', rows_b)):
        st = stats(rows, T, label)
        for side in ('Z1side', 'Z2side'):
            n, tr, mn, q1, q5, q9 = st[side]
            print('%5d| %s %s : %5d %5d  %.3e  %.4f %.4f %.4f' % (T, label, side, n, tr, mn or float('nan'), q1, q5, q9))
# first-collision angle phi_0(T): smallest |phi| at which some zero below T has left the line
print('\n== phi_0(T) = min collision angle over zeros of A below T (either side); psi_0(T) same for B (angle from pi/2)')
def running_min(rows):
    ev = []
    for r in rows:
        for side in ('Z1side', 'Z2side'):
            v = r[side]
            if v and v['kind'] == 'collision': ev.append((r['t'], v['angle'], side, v['absR']))
    ev.sort(); best = 9; recs = []
    for t, ang, side, R in ev:
        if ang < best: best = ang; recs.append((t, ang, side, R))
    return recs
recA = running_min(rows_a); recB = running_min(rows_b)
for name, rc in (('phi_0 records (A zeros)', recA), ('psi_0 records (B zeros)', recB)):
    print(name)
    for t, ang, side, R in rc: print('   gamma=%10.4f  angle=%.6e  %s  |R(t_c)|^(+-1)=%.5g   log(1/angle)/sqrt(log t * loglog t)=%.3f' % (t, ang, side, R, math.log(1 / ang) / math.sqrt(math.log(t) * math.log(math.log(t))) if t > 3 else float('nan')))
# distribution of log|R| at aa minima and bb maxima vs Selberg-type scale sqrt(2 loglog T)
print('\n== log|R| at critical points by interval type (mean, sd), window [T/2,T]; Bombieri-Hejhal/Selberg scale sqrt(2 loglog T)')
for T in (200, 500, 1000, 2000):
    if T > TMAX: break
    va = []; vb = []; vab = []
    for k in range(1, len(bounds) - 1):
        if not (T / 2 <= bounds[k][0] < T): continue
        ty = bounds[k][2] + bounds[k + 1][2]
        for c in crit_in[k]:
            x = math.log(abs(c['R_mid']))
            (va if ty == 'aa' else vb if ty == 'bb' else vab).append(x)
    ms = lambda v: (sum(v) / len(v), (sum((x - sum(v) / len(v)) ** 2 for x in v) / len(v)) ** .5) if v else (float('nan'),) * 2
    print(' T=%d: aa minima n=%d mean %.3f sd %.3f | bb maxima n=%d mean %.3f sd %.3f | extra (ab) n=%d | sqrt(2 loglog T)=%.3f' % ((T, len(va)) + ms(va) + (len(vb),) + ms(vb) + (len(vab), math.sqrt(2 * math.log(math.log(T))))))
# real-zero and off-line counts at grid angles, from the certified structure
print('\n== zeros of F_phi with 0<gamma<T: real (certified from level sets of R) vs total (argument principle, stage2)')
cnt = {}
import re
for f in ['s2_low.log', 's2_high.log', 's2_fix.log', 's2_z2fix.log']:   # later files override earlier (sign-normalised reruns)
    try:
        for line in open(f):
            mm = re.match(r'(\S+) (.*) \[([0-9.]+) \+/- \S+\] \d+', line.strip())
            if mm: cnt['%s|%s' % (mm.group(1), mm.group(2))] = float(mm.group(3))
    except FileNotFoundError: pass
# for pi/2 < phi < 3pi/4 the completed function has exactly two real zeros (sigma_phi > 1 with R(sigma_phi) = |cot phi|, and 1 - sigma_phi);
# the contour count includes them with weight 1/2 each: subtract 1.
for key in list(cnt):
    if key.split('|')[1] in ('9pi/16', '10pi/16', '11pi/16'): cnt[key] -= 1
def real_count(phi, T):
    c = -1.0 / math.tan(phi)     # level: R = c
    n = 0
    for k in range(len(bounds) - 1):
        lo = bounds[k][1]; hi = bounds[k + 1][0]
        if lo >= T: break
        if signs[k] * c <= 0: continue
        # R on (lo,hi): monotone pieces between critical points. values at ends: 0 (b), inf (a), R(0) at t=0
        def endval(e, side):
            if e[2] == 'a': return math.inf
            if e[2] == 'b': return 0.0
            return abs(float(Rat(0.0).mid()))
        pts = [(lo, endval(bounds[k], 0))] + [((x['lo'] + x['hi']) / 2, abs(x['R_mid'])) for x in crit_in[k]] + [(hi, endval(bounds[k + 1], 1))]
        for i in range(len(pts) - 1):
            (t1, v1), (t2, v2) = pts[i], pts[i + 1]
            if (v1 - abs(c)) * (v2 - abs(c)) < 0:
                if t2 < T: n += 1
                elif t1 < T:
                    # crossing located in a piece straddling T: decide by the certified value at T
                    vT = abs(float(Rat(T).mid()))
                    if (v1 - abs(c)) * (vT - abs(c)) < 0: n += 1
    return n
names = {4: 'pi/4 (Z1)', 12: '3pi/4 (Z2)'}
print('  T      phi        real   total   off-line pairs')
for T in (100.01, 200.01, 264.01, 1000.01, 2000.01):
    if T > TMAX + 1: continue
    for k in range(1, 16):
        if k == 8: continue
        nm = names.get(k, '%dpi/16' % k)
        key = '%s|%s' % (T, nm)
        tot = cnt.get(key)
        rc = real_count(math.pi * k / 16, T)
        print('  %-8s %-11s %5d  %s  %s' % (T, nm, rc, '%5d' % round(tot) if tot is not None else '  n/a', (round(tot) - rc) / 2 if tot is not None else ''))

# ---- small-angle law: P(angle < eps) ~ eps^(1/2) (independent superposition => no repulsion between zeros of the two factors)
print('\n== small-angle counts: number of colliding zeros with angle < eps (all T<=%g); ratio per decade (sqrt(10)=3.16 predicted by the eps^(1/2) law)' % TMAX)
for label, rows in (('A', rows_a), ('B', rows_b)):
    for side in ('Z1side', 'Z2side'):
        col = [r[side]['angle'] for r in rows if r[side] and r[side]['kind'] == 'collision']
        cs = [sum(1 for x in col if x < 10.0 ** (-e)) for e in range(1, 8)]
        print('  %s %s n=%d: ' % (label, side, len(col)) + ' '.join('1e-%d:%d' % (e, c) for e, c in zip(range(1, 8), cs)) + '   ratios ' + ' '.join('%.2f' % (cs[i] / cs[i + 1]) if cs[i + 1] else '-' for i in range(len(cs) - 1)))
print('\n== phi_0(T) against the count n(T) of colliding A-zeros below T: phi_0 * n^2 (constant under the eps^(1/2) law)')
ev = sorted((r['t'], r[side]['angle']) for r in rows_a for side in ('Z1side', 'Z2side') if r[side] and r[side]['kind'] == 'collision')
best = 9
for T in (25, 50, 100, 200, 400, 800, 1200, 1600, 2000):
    sub = [x for x in ev if x[0] < T]
    if not sub: continue
    mn = min(x[1] for x in sub)
    print('  T=%5d  n=%5d  phi_0=%.3e  phi_0*n^2=%.3f   phi_0*T^2=%.3f' % (T, len(sub), mn, mn * len(sub) ** 2, mn * T * T))
# which factor do the two colliding zeros belong to, for the record small-angle events
print('\n== the 12 smallest collision angles of A-zeros: factor of each partner (zeta or L(chi_-20)), gap delta')
ev2 = []
for r in rows_a:
    for side in ('Z1side', 'Z2side'):
        v = r[side]
        if v and v['kind'] == 'collision': ev2.append((v['angle'], v['t_c'], side))
ev2 = sorted(set((round(x[0], 14), round(x[1], 8), x[2]) for x in ev2))[:12]
az = [(l + h) / 2 for l, h in a]
def fac(t):
    z = abs(complex(acb(0.5, t).zeta())); l = abs(complex(CHI_M20.l(acb(0.5, t))))
    return 'zeta' if z < l else 'L(chi_-20)'
for ang, tc, side in ev2:
    i = bisect.bisect_left(az, tc)
    g1, g2 = az[i - 1], az[i]
    print('  angle=%.3e  t_c=%.6f  %s  zeros %.6f (%s), %.6f (%s)  delta=%.3e  angle/delta^2=%.3f' % (ang, tc, side, g1, fac(g1), g2, fac(g2), g2 - g1, ang / (g2 - g1) ** 2))
# pair-count identity K(c) = #{aa: m > c} - #{bb: M > c} on each side vs argument-principle count
print('\n== first 200 zeros of A: see table_A_zeros.txt (rows 1-200).  gamma_200 = %.6f' % rows_a[199]['t'])
