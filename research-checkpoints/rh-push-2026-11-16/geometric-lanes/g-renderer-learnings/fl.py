from flint import acb, arb, ctx, dirichlet_char
ctx.prec = 160
_c1 = dirichlet_char(5,2); _c2 = dirichlet_char(5,3)
_k = ((arb(10)-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1)
_A = acb(1,0)*0.5 + acb(0,-1)*_k*0.5   # (1 - i k)/2
_B = acb(1,0)*0.5 + acb(0, 1)*_k*0.5
if abs(complex(_c1(2)) - 1j) > 1e-9: _c1,_c2 = _c2,_c1
PI = arb.pi()
def fdh(s): return _A*_c1.l_function(s) + _B*_c2.l_function(s)
def lxi_dh(s):  # log xi_DH (branch irrelevant for derivatives by differences of nearby points)
    return -(s/2)*(PI/5).log() + ((s+1)/2).lgamma() + fdh(s).log()
def xi_dh(s): return ((PI/5)**(-(s/2)))*((s+1)/2).gamma()*fdh(s)
def xi_z(s): return s*(s-1)/2*(acb(PI)**(-(s/2)))*(s/2).gamma()*s.zeta()
H = acb(1e-12)
def G(xi, s):   # xi'/xi by central difference of xi itself
    return (xi(s+H)-xi(s-H))/(2*H)/xi(s)
def Gp_line(xi, t):  # Re (xi'/xi)'(1/2+it) = -(d^2/dt^2) log|Xi(t)|  =  (Xi'^2 - Xi Xi'')/Xi^2
    h=arb(10)**(-8); t=arb(t)   # exact arb offsets (float t+-h is asymmetric at binade edges)
    f=lambda u: xi(acb(arb(1)/2,u)).real
    a,b,c=f(t-h),f(t),f(t+h)
    d1=(c-a)/(2*h); d2=(c-2*b+a)/(h*h)
    return float(((d1*d1-b*d2)/(b*b)).mid())
if __name__=='__main__':
    import time
    s=acb(0.808517182456637385,85.699348485377592); print('|f_DH(rho1)|',float(abs(fdh(s)).mid()))
    s=acb(0.3,7.1); print('FE', float(abs(xi_dh(s)-xi_dh(1-s)).mid()/abs(xi_dh(s)).mid()))
    t=time.time(); 
    for k in range(50): G(xi_dh, acb(0.7,80+k))
    print('time/eval',(time.time()-t)/50, complex(G(xi_dh,acb(0.7,80.3))), complex(G(xi_z,acb(0.7,80.3))))
