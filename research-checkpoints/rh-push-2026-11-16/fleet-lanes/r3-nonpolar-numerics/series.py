import json, sys, numpy as np
J = json.load(open(sys.argv[1])); F = J['fam']
keys = ['F1 order 2','F1 order 3','F1 order 6','F1 order 4,12','F1 other orders','F3 primes j=1,5','F3 primes j=2,4','F3 primes j=3','F2 alpha^k N^iv','F2r k!=0','Steinhaus','iid']
for tag in ['loo/all','band/all','loo/p6','loo/np6']:
    print('==', tag)
    print(f"{'row a t':34s}", ' '.join(f"{F[str(k)][tag]['row a (trivial target) t']:6.3f}" for k in range(11)))
    for g in keys:
        m = [F[str(k)][tag][g]['mean'] for k in range(11)]; s = [F[str(k)][tag][g]['se'] for k in range(11)]
        w = 1/np.array(s)**2; pm = (w*np.array(m)).sum()/w.sum()
        print(f"{g:34s}", ' '.join(f"{x:6.3f}" for x in m), f" | se~{np.mean(s):.3f} pooled {pm:.4f} +- {1/np.sqrt(w.sum()):.4f} (if indep.)")
        if g.startswith('F1 order'):
            m = [F[str(k)][tag][g+' (shuffled)']['mean'] for k in range(11)]
            print(f"{'   shuffled':34s}", ' '.join(f"{x:6.3f}" for x in m))
tag='loo/all'
print('F2 by |k| (k=10):', ' '.join(f"{x:.3f}" for x in F['10'][tag]['F2 by |k|']))
print('F2 k=0 by j -10..10 (k=10):', ' '.join(f"{x:.2f}" for x in F['10'][tag]['F2 k=0 by |j|<=10']))
for k in (0,4,7,10):
    print(k, 'F2r(0,0) loo/all', round(F[str(k)]['loo/all']['F2r (0,0)'],1), 'F2r k!=0 loo', round(F[str(k)]['loo/all']['F2r k!=0']['mean'],4), 'band', round(F[str(k)]['band/all']['F2r k!=0']['mean'],4), 'np6 loo', round(F[str(k)]['loo/np6']['F2r k!=0']['mean'],4),'p6 loo', round(F[str(k)]['loo/p6']['F2r k!=0']['mean'],4), 'rnull', round(F[str(k)]['loo/all']['rnull_rms'],5), round(F[str(k)]['loo/all']['inv_sqrt_rows'],5))
