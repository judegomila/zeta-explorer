import numpy as np, json
u=np.linspace(-8,8,160001)
def g0(u):
    x=np.exp(u); return (2*np.pi**2*x**2.25-3*np.pi*x**1.25)*np.exp(-np.pi*x)
k=sum(g0(np.abs(u)+2*np.log(n))/np.sqrt(n) for n in range(1,60))
w=k**2; m=(w*u).sum()/w.sum(); s=np.sqrt((w*(u-m)**2).sum()/w.sum())
print('sigma_kappa',s)
r=json.load(open('tmp/research-2026-11-16/push/c1-shear-hecke-fricke/defect.json'))
for p in ['2','3','7','23','47']:
    print(p, r['zeta'][p]['row']['0.01']['d1']/0.01, np.log(int(p))/4*s)
