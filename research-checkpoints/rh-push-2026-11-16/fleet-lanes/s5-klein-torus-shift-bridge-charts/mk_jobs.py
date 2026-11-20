"""Writes the job lists of the server run (one shell command per line)."""
import math
c2 = []; c3 = []
def bits(n, heavy=1.0): return int(10 * n * heavy + 1000)
def P(code, a, rect, n, b, out, kerns, nw):
    return 'RH_WORKERS=%d python pick.py %s %s %s %s %s %s %d %d out/%s.json %s > logs/%s.log 2>&1' % (nw, code, a, rect[0], rect[1], rect[2], rect[3], n, b, out, ' '.join(kerns), out)
# ---- combination (2): strip kernels.  geometry = (tag, control, gamma_off, b, a, Y list)
geos = [
 ('gDH', 'DH', 85.6993484853776, 0.3085, '0.1', [43, 60, 73, 81, 85.4, 90, 100, 110, 130, 170], 300, ['ZETA', 'LCHI4', 'LCHI5']),
 ('gTNR', 'TNR', 2.8596008673801268, 0.4038, '0.1', [1.43, 2.0, 2.3, 2.45, 2.6, 2.86, 3.0, 3.2, 3.6, 4.5, 6], 300, ['ZETA']),
 ('gEA', 'EA:1/8', 14.134725141734693, 0.125, '0.05', [7, 10, 12, 13.5, 14.0, 14.13, 14.5, 15, 16, 18, 22], 300, ['ZETA']),
 ('gTNRQ', 'TNRQ', 0.2273960095952982, 0.0321, '0.01', [0.068, 0.114, 0.16, 0.19, 0.2, 0.215, 0.2274, 0.24, 0.26, 0.3, 0.4], 300, ['ZETA']),
 ('gHEAT', 'HEAT:-0.5', 111.69422767246392, 0.243, '0.1', [34, 56, 78, 95, 106, 111.4, 116, 123, 134, 160], 200, ['ZETA']),
]
for tag, ctl, g, b, a, Ys, n, comps in geos:
    rect = ('0.01', '2', repr(-0.25 * g), repr(0.25 * g))
    kern = ['sinh:%s' % y for y in Ys] + ['lin']
    for code in [ctl] + comps:
        c2.append(P(code, a, rect, n, bits(n), 'c2_%s_%s' % (tag, code.replace(':', '').replace('/', '_')), kern, 8))
# ---- combination (3): linear kernel = de Branges kernel of E_a up to a diagonal congruence; test sets in the upper half-plane
for code, Ts, As in (('ZETA', (50, 200, 2000), ('0.4', '0.2', '0.1', '0.05', '0.02')), ('LCHI4', (50, 2000), ('0.4', '0.1', '0.02')), ('LCHI5', (50, 2000), ('0.4', '0.1', '0.02'))):
    for T in Ts:
        for a in As:
            n = 400; b = {50: 5000, 200: 4000, 2000: 2400}[T]
            if code == 'ZETA' and T == 2000: n = 600; b = 2400
            if code != 'ZETA':
                if T == 2000 and a != '0.1': continue
                n = 300 if T == 50 else 200; b = 4000 if T == 50 else 1600
            c3.append(P(code, a, ('0.05', '1', '0', str(T)), n, b, 'c3_%s_T%d_a%s' % (code, T, a), ['lin'], 1))
ctl = [('DH', 85.6993484853776, ('0.1', '0.4')), ('TNR', 2.8596008673801268, ('0.1', '0.02', '0.45')), ('EA:1/8', 14.134725141734693, ('0.05', '0.02', '0.2')),
       ('TNRQ', 0.2273960095952982, ('0.01', '0.02', '0.05')), ('HEAT:-0.5', 111.69422767246392, ('0.1',))]
for code, g, As in ctl:
    for fr in (0.5, 0.9, 1.1):
        for a in As:
            n = 200 if code.startswith('HEAT') else 300
            c3.append(P(code, a, ('0.05', '1', '0', repr(fr * g)), n, bits(n), 'c3_%s_f%s_a%s' % (code.replace(':', '').replace('/', '_'), fr, a), ['lin'], 1))
open('jobs_c2.txt', 'w').write('\n'.join(c2) + '\n'); open('jobs_c3.txt', 'w').write('\n'.join(c3) + '\n')
print(len(c2), len(c3))
