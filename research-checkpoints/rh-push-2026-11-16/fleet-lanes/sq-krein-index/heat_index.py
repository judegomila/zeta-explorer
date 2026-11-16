# Control 2 (backward heat) and the index kappa(t) along the de Bruijn-Newman flow.
# F_t(z) = int_0^inf e^{t u^2} Phi(u) cosh(2 z u) du  (= H_t(x) with x = -2 i z; F_0(z) = xi(1/2+z)/8), zeros of F_0 at z = i*gamma.
# For each t: N = zeros of F_t in |Re z|<X, T1<Im z<T2 (argument principle), N0 = sign changes on the axis,
# Z_D(alpha) = zeros of F_t + alpha F_t' in 0<Re z<X (argument principle), axis winding of D.
import mpmath as mp, sys, time
mp.mp.dps = 45
hq = mp.mpf(1)/260; NU = 300
us = [hq*j for j in range(NU+1)]
def Phi(u):
    s = mp.mpf(0)
    for n in range(1, 8):
        s += (2*mp.pi**2*n**4*mp.exp(9*u) - 3*mp.pi*n**2*mp.exp(5*u))*mp.exp(-mp.pi*n*n*mp.exp(4*u))
    return s
PH = [Phi(u) for u in us]
def make(t):
    wt = [hq*mp.exp(t*u*u)*p for u,p in zip(us,PH)]; wt[0] /= 2
    def FdF(z):
        F = mp.mpc(0); dF = mp.mpc(0)
        e1 = mp.exp(2*z*hq); e2 = 1/e1; a = mp.mpc(1); b = mp.mpc(1)
        for j in range(NU+1):
            F += wt[j]*(a+b)/2; dF += wt[j]*us[j]*(a-b)
            a *= e1; b *= e2
        return F, dF
    return FdF
def winding(vals):
    tot = mp.mpf(0); big = 0
    for i in range(len(vals)-1):
        d = mp.arg(vals[i+1]/vals[i]); tot += d
        if abs(d) > 1.3: big += 1
    return tot/(2*mp.pi), big
def path(c, n):
    out=[]
    for k in range(len(c)-1):
        a,b = c[k], c[k+1]; m = max(8, int(n*abs(b-a)))
        out += [a+(b-a)*mp.mpf(j)/m for j in range(m)]
    out.append(c[-1]); return out
T1, T2, X = mp.mpf(5), mp.mpf(sys.argv[2]) if len(sys.argv)>2 else mp.mpf('51.4'), mp.mpf(sys.argv[3]) if len(sys.argv)>3 else mp.mpf(4)
dens = 14
print("check: 8*F_0(0) =", mp.nstr(8*make(0)(mp.mpc(0))[0], 20), " xi(1/2) = 0.49712077818831410991")
for t in [mp.mpf(x) for x in sys.argv[1].split(',')]:
    t0 = time.time(); FdF = make(t)
    nax = int((T2-T1)*40); ax = [mp.mpc(0, T1+(T2-T1)*mp.mpf(j)/nax) for j in range(nax+1)]
    axv = [FdF(z) for z in ax]
    N0 = sum(1 for i in range(nax) if axv[i][0].real*axv[i+1][0].real < 0)
    right = path([mp.mpc(0,T2), mp.mpc(0,T1), mp.mpc(X,T1), mp.mpc(X,T2), mp.mpc(0,T2)], dens)   # axis part re-sampled coarsely is avoided below
    # build right-box boundary: bottom, right, top edges coarse; axis edge from the fine samples
    edge = path([mp.mpc(0,T1), mp.mpc(X,T1), mp.mpc(X,T2), mp.mpc(0,T2)], dens)
    ev = [FdF(z) for z in edge]
    # by symmetry F(-conj z) = conj F(z): zeros in |Re z|<X = 2*(right box count with axis zeros counted 1/2) -> use N = N0 + 2*kappa_F,
    # where kappa_F = zeros of F in the open right box, from winding of F along edge + axis indented: computed instead from L-count below.
    line = "t=%-6s N0=%2d" % (mp.nstr(t,4), N0)
    for al in ('0.3','2','20'):
        al = mp.mpf(al)
        vals = [v[0]+al*v[1] for v in ev] + [v[0]+al*v[1] for v in reversed(axv)]
        ZD, big = winding(vals)
        wax, _ = winding([v[0]+al*v[1] for v in axv])
        line += " | a=%s: Z_D=%s axisarg/pi=%s%s" % (mp.nstr(al,3), mp.nstr(ZD,6), mp.nstr(2*wax,6), "!" if big else "")
    # total zeros of F in the symmetric box via winding on Re z = +-X edges (F has no zeros there) : full rectangle
    full = path([mp.mpc(-X,T1), mp.mpc(X,T1), mp.mpc(X,T2), mp.mpc(-X,T2), mp.mpc(-X,T1)], dens)
    NF, big = winding([FdF(z)[0] for z in full])
    line += " | N(box)=%s%s  (N-N0)/2=%s  (%.0fs)" % (mp.nstr(NF,6), "!" if big else "", mp.nstr((NF-N0)/2,6), time.time()-t0)
    print(line); sys.stdout.flush()
