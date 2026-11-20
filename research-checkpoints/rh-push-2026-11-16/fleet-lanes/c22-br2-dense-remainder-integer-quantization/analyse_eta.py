import json, math
d = json.load(open('out/eta_b1_plus.json'))
js = d['js']; L2 = math.log(2)
print('eps_k first 12:', ['%.3e' % e for e in d['eps_first'][:12]])
def row(i):
    h = d['heights'][i]; r = d['rows'][i]
    y = {j: r[k][0] for k, j in enumerate(js)}; rad = max(x[1] for x in r)
    global CORR; CORR = {j: r[k][3] for k, j in enumerate(js)}
    return h, y, rad
print('--- rational heights t = 2 pi a/b: y*delta*6 b^2/pi^2 (prediction -1) and n_eff = dy/dlog(delta) at j = 20, 40, 60')
for i in range(25, 50):
    h, y, rad = row(i); a, b = h[1], h[2]
    f = lambda j: y[j] * 2.0**-j * 6 * b * b / math.pi**2
    n = lambda j: (y[j] - y[j-1]) / (-L2)
    pred = lambda j: -math.pi**2 / (6*b*b) * 2.0**j + 0.5*math.log(2*math.pi*2.0**j / b)
    print(h[1:], ' ratio %.6f %.6f %.6f' % (f(20), f(40), f(60)), ' n_eff %.3e %.3e %.3e' % (n(20), n(40), n(60)),
          ' log|rho| %.3f %.3f %.3f (log^2(1/delta)/2 = %.0f %.0f %.0f)' % (CORR[20], CORR[40], CORR[60], (20*L2)**2/2, (40*L2)**2/2, (60*L2)**2/2), ' maxrad %.1e' % rad)
NE45=[]; NE60=[]; SL=[]
print('--- pole points t = 2 pi n/log q_i: y at j=10,20,30,40,50,60 and n_eff at 60')
for i in range(0, 25):
    h, y, rad = row(i)
    print(h[1:], ' '.join('%11.3f' % y[j] for j in (10, 20, 30, 40, 50, 60)), ' n_eff(60) %.3f  n_eff(45) %.3f' % ((y[60]-y[59])/(-L2), (y[45]-y[44])/(-L2)))
    NE45.append((y[45]-y[44])/(-L2)); NE60.append((y[60]-y[59])/(-L2)); SL.append((y[60]-y[30])/(-30*L2))
import statistics
print('pole n_eff(45): median %.3f, in [0.5,0.9]: %d of 25; n_eff(60): median %.3f min %.3f max %.3f; slope j=30..60: median %.3f min %.3f max %.3f' % (statistics.median(NE45), sum(1 for v in NE45 if 0.5<=v<=0.9), statistics.median(NE60), min(NE60), max(NE60), statistics.median(SL), min(SL), max(SL)))
print('--- generic: y at j=10,20,30,40,50,60; n_eff 60; max|y| over j')
import statistics
ne = []
for i in range(50, 100):
    h, y, rad = row(i)
    ne.append((y[60]-y[59])/(-L2))
    if i < 62: print('%.4f' % h[1], ' '.join('%11.3f' % y[j] for j in (10, 20, 30, 40, 50, 60)), ' n_eff(60) %.3f' % ne[-1], ' max|y| %.1f' % max(abs(v) for v in y.values()))
sl=[(row(i)[1][60]-row(i)[1][30])/(-30*L2) for i in range(50,100)]
print('generic slope j=30..60: median %.4f min %.3f max %.3f' % (statistics.median(sl), min(sl), max(sl)))
print('generic n_eff(60): min %.3f median %.3f max %.3f' % (min(ne), statistics.median(ne), max(ne)))
for j in (10, 20, 30, 40, 50, 60):
    ys = [row(i)[1][j] for i in range(50, 100)]
    print('generic j=%d: min %.2f median %.2f max %.2f sd %.2f' % (j, min(ys), statistics.median(ys), max(ys), statistics.pstdev(ys)))
c = json.load(open('out/cyc.json'))
print('--- CYC: y at j=10,30,60; n_eff at 60')
for r in c['rows']:
    y = [v[0] for v in r['y']]; jj = c['js']
    print(r['h'], '%.4f %.4f %.4f' % (y[jj.index(10)], y[jj.index(30)], y[jj.index(60)]), ' n_eff %.6f' % ((y[-1]-y[-2])/(-L2)))
t = json.load(open('out/thin.json'))
print('--- DEL / THIN on S_1: y at j=2, 60 (bounded = exponent 0)')
for r in t['rows']:
    print(r['h'], 'DEL %.6f %.6f  THIN %.6f %.6f' % (r['DEL'][0], r['DEL'][-1], r['THIN'][0], r['THIN'][-1]))
