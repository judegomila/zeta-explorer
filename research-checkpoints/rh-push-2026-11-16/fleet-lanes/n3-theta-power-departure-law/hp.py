# independent high-precision (python-flint acb, 75 digits working) evaluation of Z(w,s), eps = 0.1
from flint import arb, acb, ctx
import sys, time, json, math
ctx.prec = 250
EPS = arb('0.1'); DELTA = arb.pi()/4 - EPS
def build(tmax=160, ng=48, digits=62):
    U2 = (digits*math.log(10))/(math.pi*math.sin(0.2)); U = math.sqrt(U2)
    ppu = int(math.ceil((U2 + tmax/(2*math.pi))/4.0))
    npan = int(math.ceil(ppu*math.log(U)))
    gl = [arb.legendre_p_root(ng, k, weight=True) for k in range(ng)]
    rot = (acb(0, 2)*DELTA).exp()
    nodes = []
    for p in range(npan):
        a = (arb(p)/npan*arb(math.log(U))).exp(); b = (arb(p+1)/npan*arb(math.log(U))).exp()
        for x, wt in gl:
            u = (a+b)/2 + (b-a)/2*x; W = (b-a)/2*wt
            q = (-arb.pi()*rot*u*u).exp()
            aq = float(abs(q).mid())
            N = int(math.ceil(-(digits+5)*math.log(10)/math.log(aq)))+1
            L = acb(0); qn = acb(1)
            for n in range(1, N+1):
                qn = qn*q
                L += (1-qn).log() if n % 2 == 0 else 2*(1+qn).log()
            nodes.append((u.log(), W, L))
    return nodes
def Zs(nodes, w, x, tau):
    """e^{delta tau} Z(w, w/2+x+i tau)"""
    w = arb(w); x = arb(x); tau = arb(tau)
    s = acb(w/2+x, tau); s2 = acb(w/2-x, -tau)
    J = acb(0); Jb = acb(0)
    for lu, W, L in nodes:
        f = (L*w).exp()-1
        J += W*f*((s-1)*lu).exp()
        Jb += W*f.conjugate()*((s2-1)*lu).exp()
    return (acb(0, 1)*DELTA*(w/2+x)).exp()*(J-1/s) + (acb(0, -1)*DELTA*(w/2-x)).exp()*(Jb-1/s2)
if __name__ == '__main__':
    t0 = time.time(); tmax = float(sys.argv[1]); nodes = build(tmax)
    print('hp nodes', len(nodes), 'build s', round(time.time()-t0, 1), flush=True)
    # check 1: w=1 against zeta at 60 digits
    for tau in ('30.5', str(min(tmax, 150.25))):
        z = Zs(nodes, 1, 0, tau); s = acb(arb('0.5'), arb(tau))
        ex = (arb.pi()**(-s/2))*(s/2).gamma()*s.zeta()*(DELTA*arb(tau)).exp()
        print('w=1 tau', tau, 'rel err vs pi^{-s/2}Gamma(s/2)zeta(s):', (abs(z-ex)/abs(ex)).str(5), flush=True)
    job = json.load(open(sys.argv[2])); out = []
    for item in job:
        z = Zs(nodes, item['w'], item.get('x', '0'), item['tau'])
        out.append(dict(item, re=z.real.str(30), im=z.imag.str(30)))
    json.dump(out, open(sys.argv[3], 'w'), indent=0)
    print('done', len(job), 'points', round(time.time()-t0, 1))
