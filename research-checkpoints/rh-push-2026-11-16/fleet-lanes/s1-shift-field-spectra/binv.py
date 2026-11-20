import numpy as np, sfs, math
y=100000
b=sfs.dirichlet_inverse(sfs.periodic(sfs.DHC,y))
mu=sfs.mobius(y)*sfs.periodic(sfs.CHI5,y)
n=np.arange(y+1)
for Y in (10,100,1000,10000,100000):
    print(Y,'max|b|',np.abs(b[1:Y+1]).max(),'sum b^2/n',(b[1:Y+1]**2/n[1:Y+1]).sum(),'muchi',(mu[1:Y+1]**2/n[1:Y+1]).sum(), 'frac |b|>1', (np.abs(b[1:Y+1])>1).mean(), flush=True)
print(b[1:13])
