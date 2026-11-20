# postprocess: theta = eig(B G_N), B = 2[[0,1,0,0],[1,0,0,0],[0,0,0,-1],[0,0,-1,0]];  phi = theta/(1-theta) = eig(J_rest^{-1} Q_off)
import json, sys
from mpmath import mp, mpf, matrix, eig
mp.dps = 40
d = json.load(open(sys.argv[1]))
B = matrix([[0, 2, 0, 0], [2, 0, 0, 0], [0, 0, 0, -2], [0, 0, -2, 0]])
for sec in ('odd', 'even'):
    print(sec, 'signs', d[sec+'_signs'].count('+'), '/', len(d[sec+'_signs']))
    for N, g in enumerate(d[sec+'_G'], 1):
        if N % int(sys.argv[2]) and N != len(d[sec+'_G']): continue
        vals = [mpf(x.split()[0].strip('[]').replace('+/-', '')) if not x.startswith('[+/-') else mpf(0) for x in g]
        G = matrix(4, 4)
        for i in range(4):
            for j in range(4): G[i, j] = vals[4*i+j]
        ev = eig(B*G, left=False, right=False)
        th = sorted([e.real for e in ev])
        phi = [t/(1-t) for t in th]
        print('  N=%3d theta: %s   phi_min=%s  phi_max=%s' % (N, [mp.nstr(t, 6) for t in th], mp.nstr(phi[0], 8), mp.nstr(max(phi), 8)))
