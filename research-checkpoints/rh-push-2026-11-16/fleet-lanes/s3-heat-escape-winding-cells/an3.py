import json, math, numpy as np, sys
D='out_server/'
def show(f):
    d=json.load(open(D+f))
    print(f, 'n=%d'%d['nzeros'], 'Delta', d['Delta'], 'kappa_inf %.5f at x=%.2f  bound %.4f'%(d['kappa_inf'], d['x_at_kappa_inf'], d['bound_at_kappa_inf']))
    for r in d['decades']:
        print('  x in [%.3g, %.3g): kappa_min %.4f (x=%.2f) ratio_min %.4f (x=%.2f) ratio_mean %.5f std %.4f | bound above x_lo %.5f'%(r['x_lo'], r['x_hi'], r['kappa_min'], r['x_kappa_min'], r['ratio_min'], r['x_ratio_min'], r['ratio_mean'], r['ratio_std'], r['bound_above_x_lo']))
    return d
for f in sys.argv[1:]: show(f)
# adjacency of DH minima to off-line pairs (table to gamma = 2000 -> x < 4000)
try:
    d=json.load(open(D+'poisson_dh.json')); off=np.array(sorted(2*float(g) for b,g,_ in json.load(open('zeros_DH.json'))['offline']))
    low=d['lowest_below_4000']
    dist=[min(abs(off-x)) for x,r in low]
    sp=lambda x: 4*math.pi/math.log(5*x/(4*math.pi))
    print('DH: 60 lowest ratio minima below x=4000: within 1 mean spacing of an off-line pair: %d; within 2: %d; median dist/spacing %.2f'%(sum(dv<sp(x) for dv,(x,r) in zip(dist,low)), sum(dv<2*sp(x) for dv,(x,r) in zip(dist,low)), float(np.median([dv/sp(x) for dv,(x,r) in zip(dist,low)]))))
    print('   first 12:', [(round(x,1), round(r,3), round(dv,2)) for (x,r),dv in zip(low[:12],dist[:12])])
    # converse: ratio at each off-line pair abscissa
    P=np.load(D+'poisson_dh_low.npy'); X,K=P
    rat=K/(math.pi*np.log(5*X/(4*math.pi))/(4*math.pi))
    at=[float(rat[np.argmin(abs(X-o))]) for o in off]
    print('   ratio at the 84 off-line abscissae: mean %.3f min %.3f max %.3f ; overall mean below 4000: %.3f'%(np.mean(at), min(at), max(at), rat[X>100].mean()))
    # random control: fraction of x in [100,4000] within 1 spacing of an off-line pair
    xs=X[X>100]; dd=np.min(abs(xs[:,None]-off[None,:]),axis=1); print('   fraction of all x within 1 spacing of an off-line pair: %.3f'%np.mean(dd<np.array([sp(x) for x in xs])))
except Exception as e: print('dh adjacency skipped', e)
