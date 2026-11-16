# Planted twin: Xi_tw(s) = xi(s) * Q(s)/P(s), P = on-line pair at gamma, Q = quadruple 1/2 +- delta +- i gamma.
# L_tw(x) = L_zeta(x) - 2x/(x^2+g^2) + 2(x-d)/((x-d)^2+g^2) + 2(x+d)/((x+d)^2+g^2)
import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_zeta, nodes, ldl_min
def make(g, d):
    g = mp.mpf(g); d = mp.mpf(d)
    return lambda x: L_zeta(x) - 2*x/(x**2+g**2) + 2*(x-d)/((x-d)**2+g**2) + 2*(x+d)/((x+d)**2+g**2)
def first_fail(L, a, b, Nlo, Nhi):
    for N in range(Nlo, Nhi+1):
        mp.mp.dps = 40 + 3*N
        fail, _ = ldl_min(nodes(N,mp.mpf(a),mp.mpf(b)), L)
        if fail: return N
    return None
if __name__=="__main__":
    a, b = sys.argv[1], sys.argv[2]
    Nhi = int(sys.argv[3])
    for g, d in [(14.134725,0.3),(100,0.3),(1e3,0.3),(1e4,0.3),(1e6,0.3),(100,0.1),(100,0.03),(1e4,0.03)]:
        # note: for g not a zeta zero the "pair" removed is fictitious; the twin then is xi*Q/P with P not dividing xi.
        # that is still an FE-symmetric meromorphic comparison; we use it only for detection-order scaling.
        print("g=%g d=%g  N*=%s"%(g,d,first_fail(make(g,d),a,b,4,Nhi)), flush=True)
