from pathlib import Path
exec((Path(__file__).parent/'probe_conditioning.py').read_text().split('def calc')[0])
from scipy.optimize import brentq
up=u[u>0];wp=wt[u>0];profile=psi[0,u>0]*np.exp(up**2)
f=lambda t:np.dot(wp,profile*np.cos(t*up))
ts=np.linspace(0,30,601);zeros=[]
for l,r in zip(ts[:-1],ts[1:]):
 if f(l)*f(r)<0:zeros.append(brentq(f,l,r))
print(json.dumps(dict(scope='Floating terminal zeros, not certified',zeros=zeros),indent=2))
