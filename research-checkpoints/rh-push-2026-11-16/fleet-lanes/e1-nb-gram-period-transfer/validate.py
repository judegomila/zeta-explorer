import numpy as np, math, sys
N=60
def load(m): return np.fromfile(f'g60_{m}.bin',dtype=np.complex128).reshape(N,N)
# brute force: integrate piecewise exactly up to U, tail estimate
def brute_zeta(a,b,U=200000):
    # int_0^U {u/a}{u/b} du/u^2 by fine exact pieces: on each piece both are linear: (u/a-i)(u/b-j)/u^2
    pts=sorted(set([a*i for i in range(0,U//a+1)]+[b*j for j in range(0,U//b+1)]))
    tot=0.0
    for u0,u1 in zip(pts[:-1],pts[1:]):
        i=u0//a; j=u0//b
        # integrand = 1/(ab) - (i/b + j/a)/u + i j/u^2
        tot+= (u1-u0)/(a*b) - (i/b+j/a)*(math.log(u1/u0) if u0>0 else 0) + (i*j*(1/u0-1/u1) if u0>0 else 0)
    return tot + 0.25/pts[-1]   # tail: mean of {x}{y} is 1/4
def brute_per(a,b,c,q,U=400000):
    P=np.concatenate([[0],np.cumsum(c[1:q])]) ; P=np.append(P,0)[:q]
    S=lambda t: P[int(t)%q]
    pts=sorted(set([a*i for i in range(1,U//a+1)]+[b*j for j in range(1,U//b+1)]))
    tot=0
    for u0,u1 in zip(pts[:-1],pts[1:]):
        tot+= S(u0//a)*np.conj(S(u0//b))*(1/u0-1/u1)
    return tot
k=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
cs={1:(3,[0,1,-1]),2:(4,[0,1,0,-1]),3:(5,[0,1,1j,-1j,-1]),4:(5,[0,1,-1,-1,1]),5:(5,[0,1,k,-k,-1])}
G=load(0)
for a,b in [(1,1),(1,2),(2,3),(3,7),(5,12),(11,7)]:
    print('zeta',a,b,G[a-1,b-1].real,brute_zeta(a,b))
for m,(q,c) in cs.items():
    G=load(m); c=np.array(c,dtype=complex)
    for a,b in [(1,1),(1,2),(2,3),(3,7),(7,3),(5,12)]:
        print('mode',m,a,b,np.round(G[a-1,b-1],7),np.round(brute_per(a,b,c,q),7))
