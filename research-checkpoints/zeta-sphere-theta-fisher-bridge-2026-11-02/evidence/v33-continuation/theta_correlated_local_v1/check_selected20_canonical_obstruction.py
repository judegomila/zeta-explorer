"""Owned full-theta falsification of uncorrected canonical pointwise positivity.
Uses only existing integrated moments0..19. No degree20 target integral input.
"""
import sys,json,math,hashlib
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,arb_mat,ctx
ctx.prec=512;ctx.cap=41
base=Path(__file__).parent
ip=base.parent/'full_split_audit/actual_total_certificate.json'
raw=json.loads(ip.read_text())['moments']
m=[(arb(a).union(arb(b))+arb(0,(arb('1e-90')*(1+abs(arb(a))+abs(arb(b)))).upper()))/arb(400)**j for j,(a,b) in enumerate(raw)]
P=[[arb(s) for s in row] for row in json.loads((base/'selected20_candidate_basis.json').read_text())]
N=10
assert all(P[i][i].lower()>0 for i in range(N))
assert all(P[i][j].is_zero() for i in range(N) for j in range(i))
def conv(a,b):
 return [sum((a[i]*b[k-i] for i in range(len(a)) if 0<=k-i<len(b)),arb(0)) for k in range(len(a)+len(b)-1)]
def dot(a,b):return sum((x*y for x,y in zip(a,b)),arb(0))
cols=[[P[i][j] for i in range(N)] for j in range(N)]
G=arb_mat([[dot(conv(cols[i],cols[j]),m) for j in range(N)] for i in range(N)])
deviation=max(abs(G[i,j]-int(i==j)).upper() for i in range(N) for j in range(N))
assert N*deviation<1
Po=[[arb(s) for s in row] for row in json.loads((base/'selected20_odd_prefix_candidate_basis.json').read_text())]
assert all(Po[i][i].lower()>0 for i in range(N))
assert all(Po[i][j].is_zero() for i in range(N) for j in range(i))
colso=[[Po[i][j] for i in range(N)] for j in range(N)]
Go=arb_mat([[dot(conv(colso[i],colso[j]),m[1:]) for j in range(N)] for i in range(N)])
odeviation=max(abs(Go[i,j]-int(i==j)).upper() for i in range(N) for j in range(N))
assert N*odeviation<1
b=arb_mat([[dot(cols[i],m[N:N+N])] for i in range(N)])
y=-G.inv()*b
ym=[arb(y[i,0].mid().str(140,radius=False)) for i in range(N)]
dy=[y[i,0]-ym[i] for i in range(N)]
c0=[sum((P[i][j]*ym[j] for j in range(N)),arb(0)) for i in range(N)]+[arb(1)]
u=arb(14)/25;pi=arb.pi();z=pi*(2*u).exp();h=arb_series([0,1],41);Z=z*(2*h).exp()
C=2**42*math.factorial(40)*4**40
assert (arb(1)/2)*(1-arb(3)/(2*pi))**-41<2**40
assert 3*arb(2)**40/pi<2**40
assert (arb(18)/17)**84*(-35*pi).exp()<arb(1)/2
r=arb_series([0],41)
for n in range(2,17):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
eps=2*C*17**84*z**40*(-288*z).exp()
r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(41)],41)
ell=h/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
ex=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(41)],41).exp()
g=[(-1)**j*math.factorial(2*j)*ex[2*j]/arb(400)**j for j in range(21)]
f0=dot(conv(c0,c0),g)
grad=[dot(conv(col,c0),g) for col in cols]
H=[[dot(conv(cols[i],cols[j]),g) for j in range(N)] for i in range(N)]
linear=2*dot(dy,grad)
quad=sum((dy[i]*H[i][j]*dy[j] for i in range(N) for j in range(N)),arb(0))
f=f0+linear+quad
def bounds(x):return {'lo':str(x.lower()),'hi':str(x.upper())}
out={'status':'NEGATIVE' if f.upper()<0 else 'INCONCLUSIVE','point':'u=14/25','degree':20,'input_sha256':hashlib.sha256(ip.read_bytes()).hexdigest(),'basis_sha256':hashlib.sha256((base/'selected20_candidate_basis.json').read_bytes()).hexdigest(),'old_relative_deviation':bounds(deviation),'odd_old_relative_eigen_lower':str((1-N*odeviation).lower()),'odd_basis_sha256':hashlib.sha256((base/'selected20_odd_prefix_candidate_basis.json').read_bytes()).hexdigest(),'old_relative_eigen_lower':str((1-N*deviation).lower()),'omitted_orbit_derivative_error':str(eps.upper()),'f_mid':bounds(f0),'linear_error':bounds(linear),'quadratic_error':bounds(quad),'actual_selected_canonical_factor':bounds(f),'scope':'Only original normalized a=0 degree20 residual selected by actual positive lower prefix. Full theta local factor evaluated, no target M20 integral or sign input. Negative canonical factor does NOT refute optimized supporting-plane margin or integrated pivot.'}
print(json.dumps(out,indent=2))
