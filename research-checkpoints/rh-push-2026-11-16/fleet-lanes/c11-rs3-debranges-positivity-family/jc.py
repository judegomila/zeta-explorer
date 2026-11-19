# Julia-Caratheodory check of the Theorem-2 condition Re{xi(s)/xi(s+h)} >= 0 on Re s > 1/2 near the first zeros.
from mpmath import mp, mpf, mpc, zeta, loggamma, exp, log, pi, zetazero, im, re, diff, arg
import json
mp.dps=25
def gfac(s): return s*(s-1)*exp(-s/2*log(pi)+loggamma(s/2))
def xi(s): return gfac(s)*zeta(s)
def gam(s): return gfac(s)+gfac(1-s)
out=[]
for n in (1,2,3):
    g=im(zetazero(n)); rho=mpc(0.5,g)
    for h in (mpf('0.1'),mpf(1)):
        c=diff(xi,rho)/xi(rho+h)
        row={'n':n,'h':float(h),'arg_c':float(arg(c)),'pts':[]}
        for d in (mpc('0.001','-0.05'),mpc('0.001','0.05'),mpc('0.01','-0.3'),mpc('0.01','0.3')):
            s=rho+d; v=xi(s)/xi(s+h)
            row['pts'].append([str(d),float(re(v)),float(re(v)/abs(v))])
        out.append(row); print(row)
# sup over Re s = 1/2+0.001 of -Re/|.| near first zero is sin(|arg c|) in the limit
json.dump(out,open(__file__.replace('jc.py','jc.json'),'w'),indent=1)
