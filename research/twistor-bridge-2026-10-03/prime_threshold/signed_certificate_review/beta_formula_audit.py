from pathlib import Path
import mpmath as m,json
ROOT=Path(__file__).resolve().parent
m.mp.dps=55;a=m.mpf(1)/4;V=2*m.log(m.mpf(3)/2);C=2*m.pi**a/m.gamma(a)

def beta_form(T,w):
 p=a-m.mpf('.5')+1j*w;r=(m.mpf('2.5')-a+1j*w)/2;Q=1-m.exp(-2*T)
 return C*((m.mpf('.5')-a/p)*m.betainc(a,r,0,Q)+(a/p)*m.exp(-p*T)*m.betainc(a,m.mpf('1.5')-a,0,Q))

def greg(t):
 if not t:return C*2**(a-1)
 q=-m.expm1(-2*t);ratio=q/t;S=m.betainc(a,m.mpf('1.5')-a,0,q)/q**a
 return C*(m.exp(-(2-a)*t)*ratio**(a-1)-a*m.exp(-(a-1)*t)*t*ratio**a*S)

def direct(T,w):
 def fun(x):
  t=T*x**4
  return 4*T**a*m.exp(-(m.mpf('.5')+1j*w)*t)*greg(t)
 return m.quad(fun,[m.mpf(j)/8 for j in range(9)])
rows=[]
for k in [0,1,16]:
 w=m.pi*k/V;b=m.mpf(0);d=m.mpf(0)
 for n,rho in [(1,m.mpf(1)),(2,(2**a-2**(-a))/m.sqrt(2))]:
  shift=m.log(n);T=V-shift
  b+=rho*m.exp(-1j*w*shift)*beta_form(T,w)
  d+=rho*m.exp(-1j*w*shift)*direct(T,w)
 row={'k':k,'closed_beta_real':str(m.re(b)),'closed_beta_imag':str(m.im(b)),'direct_regularized_error':str(abs(b-d))};rows.append(row);print(row,flush=True)
(ROOT/'beta_formula_audit.json').write_text(json.dumps(rows,indent=2))
