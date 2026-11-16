# DH function via python-flint (ball arithmetic) and mpmath cross-check.
import flint, time
from flint import acb, arb, ctx, dirichlet_char
def setup(prec=80):
    ctx.prec = prec
def chars():
    G = [dirichlet_char(5,k) for k in range(1,5)]
    # pick chi with chi(2)=i
    for c in G:
        v = c(2)
        if abs(complex(v) - 1j) < 1e-9: chi = c
        if abs(complex(v) + 1j) < 1e-9: chib = c
    return chi, chib
CHI, CHIB = None, None
def kap():
    return ((10-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1)
def f(s):
    global CHI, CHIB
    if CHI is None: CHI, CHIB = chars()
    k = kap(); I = acb(0,1)
    return ((1-I*k)/2)*CHI.l(s) + ((1+I*k)/2)*CHIB.l(s)
if __name__ == "__main__":
    setup(100)
    s = acb("0.808517","85.699348")
    print(f(s))
    t0=time.time()
    for t in range(100): f(acb(0.9, 5000+t*0.1))
    print("per eval at t=5000:", (time.time()-t0)/100)
    t0=time.time()
    for t in range(20): f(acb(0.9, 50000+t*0.1))
    print("per eval at t=5e4:", (time.time()-t0)/20)
