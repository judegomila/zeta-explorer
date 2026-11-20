import mpmath as mp
mp.mp.dps=40
X=mp.mpf(6000000185827); N=690988; Tw=mp.mpf(41)/250
L=mp.log(X/(4*mp.pi)); logN=mp.log(N)
def alpha(s): return 1/(2*s)+1/(s-1)+mp.log(s/(2*mp.pi))/2
# d_alpha check on y in [0,1], both branches
worst=0
for k in range(0,11):
    y=mp.mpf(k)/10
    for s,lead in [(mp.mpc((1+y)/2,-X/2), L/2-1j*mp.pi/4),(mp.mpc((1-y)/2,X/2), L/2+1j*mp.pi/4)]:
        worst=max(worst, abs(alpha(s)-lead)*X)
print('max X*|alpha - lead| on y in [0,1]:', mp.nstr(worst,8), '(paper uses 5)')
da=5/X; A=L/2+1
es=Tw*da*logN/2; eg=Tw*da*(A+da/2)+(5+Tw*A)/X
Eid=2*mp.sqrt(N)*(mp.expm1(es)+mp.expm1(es+eg))
z=(Tw**2*L**2/16+mp.mpf(313)/500)/(X-mp.mpf(333)/50)
heated=(1+mp.exp(mp.mpf(21)/1000))*mp.mpf(1000001)/1000000*4*mp.sqrt(N)*z
print('E_id',mp.nstr(Eid,6),' E_AB',mp.nstr(heated,6))
# exact e_A+e_B bound of Polymath (eab-bound) at worst t=Tw, y in {0,1}
for y in [0,1]:
  for t in [mp.mpf(0),Tw]:
    gam=mp.exp(0.02*y)*mp.exp(-y*L/2); kap=t*y/(2*(X-6))
    res=mp.mpf(1+y)/2+t*L/4-t/(2*X**2)*max(1-3*y+4*y*(1+y)/X**2,0)
    S=mp.mpf(0)
    for n in range(1,N+1,1):
        v=mp.log(n) if n<2000 or n%997==0 else None
        if v is None: continue
    # coarse: bound by formula used in paper instead of full sum (full sum done below in float)
    import math
    Lf=float(L); tf=float(t); s=0.0
    for n in range(1,N+1):
        v=math.log(n)
        s+=(1+float(gam)*N**float(kap)*n**y)*math.exp(tf*v*v/4-float(res)*v)*math.expm1((tf*tf/16*(Lf-2*v)**2+0.626)/(float(X)-6.66))
    eC0=mp.exp(-(1+y)*L/4-t*L**2/16+(3*abs(L+1j*mp.pi/2)+mp.mpf('3.58'))/(X-mp.mpf('8.52')))*(1+mp.mpf('1.24')*(3**y+mp.mpf(3)**(-y))/(N-mp.mpf('0.125'))+mp.mpf('6.92')/(X-12))
    print('y',y,'t',mp.nstr(t,4),'Polymath e_A+e_B bound (float sum)',s,' Polymath e_C0 bound',mp.nstr(eC0,10),' paper E_C',mp.nstr(4*mp.exp(-L/4-t*L**2/16+mp.mpf(1)/10),10))
print('2/369',mp.nstr(mp.mpf(2)/369,10),' 4e^{.1}(X/4pi)^(-1/4)',mp.nstr(4*mp.exp(mp.mpf(1)/10-L/4),10))
print('X/2',X/2,' PT clearance from X/2:',mp.mpf(3000175332800)-X/2, ' X/2 > 3e12:', X/2>3*mp.mpf(10)**12)
print('floor',mp.mpf(79)/100-mp.mpf(1)/100-mp.mpf(1)/180, mp.mpf(697)/900)
