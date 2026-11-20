import sys, json, numpy as np, flint, math
import lsample as Ls
t0,h,Z1,Z2,im = Ls.sample(1.0, 400.0, 0.5)
print('imres', im)
t = t0 + h*np.arange(len(Z1))
flint.ctx.prec = 80
chi = flint.dirichlet_char(5,2); chib = flint.dirichlet_char(5,3)
err=0
for j in range(0,len(t),97):
    a=float(chi.hardy_z(flint.acb(float(t[j]))).real); b=float(chib.hardy_z(flint.acb(float(t[j]))).real)
    err=max(err, abs(abs(a)-abs(Z1[j])), abs(abs(b)-abs(Z2[j])))
    if j<300: print(t[j], a, Z1[j], b, Z2[j])
print('max abs diff of |Z| vs flint hardy_z', err)
ZD = Z1+Z2
sc = np.where(ZD[:-1]*ZD[1:]<0)[0]
r = t[sc] - ZD[sc]*h/(ZD[sc+1]-ZD[sc])
d=json.load(open(sys.argv[1]))
on=np.array([float(x) for x in d['online']]); on=on[(on>1.2)&(on<399.8)]
print('DH online from samples', len(r), 'battery', len(on))
if len(r)==len(on): print('max |diff| (linear interp)', np.abs(r-on).max())
ZA = Z1-Z2; print('alt sign changes', int((ZA[:-1]*ZA[1:]<0).sum()))
