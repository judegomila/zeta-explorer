import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_zeta, nodes, ldl_min
def quad(x,g,d): return 2*(x-d)/((x-d)**2+g**2) + 2*(x+d)/((x+d)**2+g**2)
def addtw(g,d):
    g=mp.mpf(g); d=mp.mpf(d); return lambda x: L_zeta(x) + quad(x,g,d)
def movetw(g,d):
    g=mp.mpf(g); d=mp.mpf(d); return lambda x: L_zeta(x) - 2*x/(x**2+g**2) + quad(x,g,d)
def first_fail(L, a, b, Nlo, Nhi):
    for N in range(Nlo, Nhi+1):
        mp.mp.dps = 40 + 8*N
        fail, _ = ldl_min(nodes(N,mp.mpf(a),mp.mpf(b)), L)
        if fail: return N
    return None
if __name__=="__main__":
    a, b, Nhi, mode = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
    mp.mp.dps=30
    if mode=="add":
        cases=[(g,d) for g in (14.0,100.0,1e3,1e4,1e6,1e9,1e12) for d in (0.3,0.03)]
    else:
        cases=[(mp.im(mp.zetazero(k)),d) for k in (1,10,100,1000) for d in (0.3,0.03)]
    for g,d in cases:
        print(mode,"g=%.6g d=%g  N*=%s"%(g,d,first_fail((addtw if mode=="add" else movetw)(g,d),a,b,4,Nhi)), flush=True)
