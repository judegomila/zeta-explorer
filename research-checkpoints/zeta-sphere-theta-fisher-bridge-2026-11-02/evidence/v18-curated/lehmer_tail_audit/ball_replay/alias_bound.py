import sys,json
from pathlib import Path
P=Path(__file__).resolve().parent
sys.path.insert(0,str(P.parent.parent/'ball_dependencies'))
from flint import arb,ctx
ctx.prec=100
t=arb('7005.081715');delta=2/t;y=arb.pi()/4-delta;r=4*delta/5
period=arb(24);N=2**20;m=2*N;B=arb(2)
c0=(2*y).cos();cr=(2*(y+r)).cos()
M0=200*c0**(-arb(5)/2);Mr=200*(t*r).exp()*cr**(-arb(5)/2)
q=(-2*arb.pi()*r/period).exp();E=4*Mr*q**N/(1-q)
Econv=period*E*(2*M0+E)
weighted=(arb(4).exp()*B**3/12)*Econv
out={k:str(v) for k,v in locals().copy().items() if k in ['delta','r','c0','cr','M0','Mr','E','Econv','weighted']}
print(json.dumps(out,indent=2));(P/'alias_bound.json').write_text(json.dumps(out,indent=2))
assert weighted<arb('1e8')
# Explicit truncation/periodization checks, independent of finite theta truncation.
zL=arb.pi()*arb(12).exp()
def S6(c):return 8*arb(3).exp()*(2*zL*zL+3*zL)*(-c*zL).exp()
Sreal=S6(c0);Sstrip=S6(cr)
assert 2*cr*zL-arb('4.5')>100
assert 2*c0*zL-arb('4.5')>500
assert Sstrip<1
assert Sreal<arb('1e-100')
# Other period images on either strip sum below1, so the factor2 in M0/Mr is safe.
assert 2*Sstrip*arb(-600).exp()/(1-arb(-2400).exp())<1
Esample=4*m*Sreal
Etotal=E+Esample
Eperiod=4*(12*(M0/2)+1)*Sreal*arb(-2500).exp()/(1-arb(-6000).exp())
error=(arb(4).exp()*B**3/12)*(period*Etotal*(2*M0+Etotal)+Eperiod)
assert error<13000
out.update({k:str(v) for k,v in locals().copy().items() if k in ['Sreal','Sstrip','Esample','Eperiod','error']})
(P/'alias_bound.json').write_text(json.dumps(out,indent=2));print('TOTAL ANALYTIC ERROR',error)
