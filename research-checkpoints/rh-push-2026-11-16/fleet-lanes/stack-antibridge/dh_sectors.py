# Ball arithmetic (python-flint/Arb). First order at which P, K_e=P+B, K_o=P-B lose positive definiteness
# on the nested family A (van der Corput in log x on [0.01,0.5]) for xi and for Davenport-Heilbronn.
# A pivot is reported negative/positive only when its ball excludes 0.
from flint import arb, acb, acb_series, ctx, fmpq
import sys, json, time
def kappa():
    s5 = arb(5).sqrt(); return ((10-2*s5).sqrt()-2)/(s5-1)
def jets_xi(x):
    s = acb(arb(1)/2 + x)
    z = acb_series([s, 1], prec=3).zeta()
    z0,z1,z2 = z[0],z[1],2*z[2]
    L = 1/s + 1/(s-1) - arb.pi().log()/2 + (s/2).digamma()/2 + z1/z0
    dL = -1/(s*s) - 1/((s-1)*(s-1)) + acb(2).polygamma(s/2)/4 if False else None
    # derivative of digamma(s/2)/2 = polygamma(1,s/2)/4 ; use series of lgamma instead
    lg = acb_series([s/2, acb(1)/2], prec=4).lgamma()   # lgamma(s/2) as series in h
    dig = lg[1]; ddig = 2*lg[2]                           # d/ds lgamma(s/2) = psi(s/2)/2 ; d2 = psi'(s/2)/4
    L = 1/s + 1/(s-1) - arb.pi().log()/2 + dig + z1/z0
    dL = -1/(s*s) - 1/((s-1)*(s-1)) + ddig + z2/z0 - (z1/z0)**2
    return L.real, dL.real
def jets_dh(x):
    s = acb(arb(1)/2 + x); k = kappa()
    S = acb_series([s, 1], prec=3)
    t0=acb(0); t1=acb(0); t2=acb(0)
    for a, c in ((1, arb(1)), (2, k), (3, -k), (4, arb(-1))):
        h = S.zeta(acb(arb(a)/5)); t0 += c*h[0]; t1 += c*h[1]; t2 += 2*c*h[2]
    l5 = arb(5).log()
    # f = 5^-s T ; f'/f = T'/T - l5 ; (f'/f)' = T''/T - (T'/T)^2
    r = t1/t0; dr = t2/t0 - r*r
    lg = acb_series([(s+1)/2, acb(1)/2], prec=4).lgamma()
    L = (arb(5)/arb.pi()).log()/2 + lg[1] + r - l5
    dL = 2*lg[2] + dr
    return L.real, dL.real
def vdc(j):
    num, den = 0, 1
    while j: den *= 2; num = num*2 + (j & 1); j >>= 1
    return fmpq(num, den)
def nodes(N, lo, hi):
    a, b = arb(lo), arb(hi)
    return [(a.log() + arb(vdc(j))*(b.log()-a.log())).exp() for j in range(1, N+1)]
def pivots(A):
    N = len(A); Lm = [[None]*N for _ in range(N)]; d = [None]*N
    for i in range(N):
        for j in range(i):
            s = A[i][j]
            for k in range(j): s -= Lm[i][k]*Lm[j][k]*d[k]
            Lm[i][j] = s/d[j]
        s = A[i][i]
        for k in range(i): s -= Lm[i][k]*Lm[i][k]*d[k]
        d[i] = s
        if not (s > 0):   # stop at first pivot that is not certified positive
            return d[:i+1]
    return d
def status(d):
    last = d[-1]
    if last > 0: return None, "all %d pivots certified positive"%len(d)
    if last < 0: return len(d), "pivot %d certified negative: %s"%(len(d), last.str(8))
    return len(d), "pivot %d UNDECIDED (ball contains 0): %s"%(len(d), last.str(8))
if __name__ == "__main__":
    which, N, bits, lo, hi = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], sys.argv[5]
    ctx.prec = bits; t=time.time()
    xs = nodes(N, lo, hi); J = [(jets_dh if which=="dh" else jets_xi)(x) for x in xs]
    Lv=[j[0] for j in J]; dLv=[j[1] for j in J]
    P=[[ (Lv[i]+Lv[j])/(xs[i]+xs[j]) for j in range(N)] for i in range(N)]
    B=[[ (-dLv[i] if i==j else -(Lv[i]-Lv[j])/(xs[i]-xs[j])) for j in range(N)] for i in range(N)]
    out={"which":which,"N":N,"bits":bits,"interval":[lo,hi]}
    if which=="xi" and len(sys.argv) > 8:      # planted "move" twins: on-line pair at gamma_n -> quartet +-d +- i gamma_n
        d0 = arb(sys.argv[7]); out["twins"]=[]
        for nz in [int(v) for v in sys.argv[8].split(',')]:
            g = acb.zeta_zero(nz).imag; Lt=[]; dLt=[]
            for x,l,dl in zip(xs,Lv,dLv):
                v = l - 2*x/(x*x+g*g); dv = dl - 2*(g*g-x*x)/(x*x+g*g)**2
                for e in (d0,-d0):
                    y = x-e; v += 2*y/(y*y+g*g); dv += 2*(g*g-y*y)/(y*y+g*g)**2
                Lt.append(v); dLt.append(dv)
            Pt=[[ (Lt[i]+Lt[j])/(xs[i]+xs[j]) for j in range(N)] for i in range(N)]
            Bt=[[ (-dLt[i] if i==j else -(Lt[i]-Lt[j])/(xs[i]-xs[j])) for j in range(N)] for i in range(N)]
            r={"n":nz,"gamma":g.str(10),"delta":sys.argv[7]}
            for nm,K in (("P",Pt),("Ke",[[Pt[i][j]+Bt[i][j] for j in range(N)] for i in range(N)]),("Ko",[[Pt[i][j]-Bt[i][j] for j in range(N)] for i in range(N)])):
                f, msg = status(pivots(K)); r[nm]=f; r[nm+"_msg"]=msg
            print("twin", {k:v for k,v in r.items() if not k.endswith("_msg")}, "t=%.0fs"%(time.time()-t), flush=True); out["twins"].append(r)
    for nm,K in (("P",P),("Ke",[[P[i][j]+B[i][j] for j in range(N)] for i in range(N)]),("Ko",[[P[i][j]-B[i][j] for j in range(N)] for i in range(N)])):
        d = pivots(K); f, msg = status(d); out[nm]={"first_not_positive":f,"msg":msg}
        print(which, nm, msg, "t=%.0fs"%(time.time()-t), flush=True)
    json.dump(out, open(sys.argv[6],"w"), indent=1)
