# Test A: exact window-local Landau-Gonek identity on real zeros.
# S_w(u) = sum_gamma w((gamma-T)/H) e^{i u gamma}  vs  -(H/2pi) sum_n Lambda(n) n^{-1/2} e^{-i(log n-u)T} what(H(log n-u))
import numpy as np, json
from lib import *
g=np.load('zeros40000.npy'); res=[]
xi=np.linspace(-1,1,4001); wh=what(xi); wh0=float(what(0.0)[0])
def whi(q): return np.interp(q,xi,wh,left=0,right=0)
for T in (1000.0,10000.0):
  for H in (8.0,30.0,100.0):
    sel=np.abs(g-T)<60*H; gg=g[sel]; ww=w((gg-T)/H).real
    Nmax=int(6*H); Lam=mangoldt(2*Nmax+10); n=np.arange(1,2*Nmax+10)
    worst_in=0; worst_out=0; rows=[]
    for n0 in range(2,Nmax+1):
        u=np.log(n0)
        S=np.sum(ww*np.exp(1j*u*gg))
        P=-(H/(2*np.pi))*np.sum(Lam[n]/np.sqrt(n)*np.exp(-1j*(np.log(n)-u)*T)*whi(H*(np.log(n)-u)))
        e=abs(S-P)
        if n0+1<H: worst_in=max(worst_in,e)
        else: worst_out=max(worst_out,e)
        if n0 in (2,3,4,5,6,7,10,12): rows.append((n0,S.real,S.imag,(-(H*wh0/(2*np.pi))*Lam[n0]/np.sqrt(n0))))
    res.append(dict(T=T,H=H,zeros_in_band=int(sel.sum()),max_abs_err_single_term_regime=worst_in,max_abs_err_multi_term_regime=worst_out,samples=rows))
    print(T,H,int(sel.sum()),'err single',worst_in,'err multi',worst_out)
    for r in rows[:0]: print('   n=%d S=%.6f%+.6fi  predicted single term %.6f'%r)
json.dump(dict(what0=wh0,results=res),open('testA.json','w'),indent=1)
