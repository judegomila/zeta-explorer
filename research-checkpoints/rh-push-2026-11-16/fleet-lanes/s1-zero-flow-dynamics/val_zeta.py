import numpy as np, mpmath as mp, sys
g=np.load(sys.argv[1]); mp.mp.dps=25
for n in [650,700,1000,5000,10000,15000,len(g)]:
    print(n, g[n-1], float(mp.zetazero(n).imag)-g[n-1])
d=np.diff(g); i=d.argmin(); print('min gap',d.min(),'at',i, g[i]); print('tc pair N=1e4', d[:9999].min()**2/8, '(node: 1.776e-4)')
