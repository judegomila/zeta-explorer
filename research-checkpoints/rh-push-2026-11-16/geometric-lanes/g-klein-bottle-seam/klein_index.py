# Klein index theorem checks on Davenport-Heilbronn (DH) and zeta, with the heat flow.
# h_tau(z) = F_tau(1/2 + i z),  z = t - i x,  x = Re s - 1/2,  d/dtau F = F''/4  <=>  d/dtau h = -h_zz/4.
import sys, json
from mpmath import mp, mpf, mpc, pi, sqrt, exp, cos, sin, gamma, zeta, arg, findroot, im, re, sign, log
mp.dps = 60
kap = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
A5 = [0, 1, kap, -kap, -1]

def gl(a, b, n):
    xs, ws = [], []
    from mpmath.calculus.quadrature import GaussLegendre
    # build nodes by mp.legendre roots via quad rule
    q = GaussLegendre(mp); nodes = q.calc_nodes(6, mp.prec)   # degree 6 -> 3*2^5=96 nodes on [-1,1]
    for x, w in nodes:
        xs.append((b-a)/2*x+(a+b)/2); ws.append((b-a)/2*w)
    return xs, ws

def build(kind, U=mpf('3.2'), panels=10):
    us, Ws = [], []
    for p in range(panels):
        a, b = U*p/panels, U*(p+1)/panels
        xs, ws = gl(a, b, 0)
        for u, w in zip(xs, ws):
            x = exp(2*u)
            if kind == 'dh':
                psi = sum(A5[n % 5]*n*exp(-pi*n*n*x/5) for n in range(1, 60))
                Phi = 2*sqrt(pi/5)*exp(3*u/2)*psi
            else:  # zeta: xi(1/2+iz) = int Phi(u) e^{izu} du, x=e^{2u}
                Phi = 2*sum((2*pi**2*n**4*exp(9*u/2)-3*pi*n*n*exp(5*u/2))*exp(-pi*n*n*x) for n in range(1, 40))
            us.append(u); Ws.append(w*Phi)
    return us, Ws

class Field:
    def __init__(s, kind):
        s.kind = kind; s.us, s.W0 = build(kind); s.set_tau(0)
    def set_tau(s, tau):
        s.tau = mpf(tau); s.W = [w*exp(s.tau*u*u/4) for u, w in zip(s.us, s.W0)]
    def h(s, z):
        return 2*sum(w*cos(z*u) for u, w in zip(s.us, s.W))
    def hz(s, z):
        return -2*sum(w*u*sin(z*u) for u, w in zip(s.us, s.W))
    def hzz(s, z):
        return -2*sum(w*u*u*cos(z*u) for u, w in zip(s.us, s.W))

def direct(kind, z):
    s = mpf(1)/2 + 1j*z
    if kind == 'dh':
        f = 5**(-s)*(zeta(s, mpf(1)/5)+kap*zeta(s, mpf(2)/5)-kap*zeta(s, mpf(3)/5)-zeta(s, mpf(4)/5))
        return (5/pi)**(s/2)*gamma((s+1)/2)*f
    return s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s)

def winding(F, t1, t2, X, step=mpf('0.02')):
    # zeros of h in rectangle t1<Re z<t2, |Im z|<X  (counterclockwise in z)
    pts = []
    def seg(a, b):
        n = int(abs(b-a)/step)+1
        return [a+(b-a)*k/n for k in range(n)]
    c = [mpc(t1, -X), mpc(t2, -X), mpc(t2, X), mpc(t1, X)]
    for i in range(4): pts += seg(c[i], c[(i+1) % 4])
    vals = [F.h(p) for p in pts]; vals.append(vals[0])
    tot = mpf(0); mx = 0
    for a, b in zip(vals, vals[1:]):
        d = arg(b/a); tot += d; mx = max(mx, abs(d))
    return tot/(2*pi), mx

def online(F, t1, t2, step=mpf('0.01')):
    n = int((t2-t1)/step); ts = [t1+(t2-t1)*k/n for k in range(n+1)]
    v = [re(F.h(t)) for t in ts]
    roots = []
    for i in range(n):
        if v[i]*v[i+1] < 0:
            roots.append(findroot(lambda t: re(F.h(t)), (ts[i], ts[i+1]), solver='anderson'))
    return roots, int(sign(v[0])), int(sign(v[-1])), min(abs(x) for x in v)/max(abs(x) for x in v)

out = {}
def report(F, t1, t2, X, tag):
    N, mx = winding(F, t1, t2, X)
    roots, s1, s2, _ = online(F, t1, t2)
    Non = len(roots)
    rec = dict(tau=float(F.tau), N_K=float(N), max_step=float(mx), N_on=Non, sign_t1=s1, sign_t2=s2,
               Z2_class=(1 if s1*s2 < 0 else 0), N_pairs=(round(float(N))-Non)/2,
               online=[float(r) for r in roots])
    print(tag, json.dumps(rec)); sys.stdout.flush()
    out.setdefault(tag, []).append(rec)
    return rec

if __name__ == '__main__':
    # --- validation of the integral representation
    D = Field('dh')
    for z in [mpc(3, 0), mpc(85, 0), mpc('85.699348', '-0.308517'), mpc(88, 1.2)]:
        a, b = D.h(z), direct('dh', z)
        print('DH check z=', complex(z), 'rel err', float(abs(a-b)/max(abs(b), mpf(10)**-200)), 'direct=', complex(b*mpf(10)**28))
    Zf = Field('zeta')
    for z in [mpc(3, 0), mpc(85, 0), mpc(88, 1.2)]:
        a, b = Zf.h(z), direct('zeta', z)
        print('zeta check z=', complex(z), 'rel err', float(abs(a-b)/abs(b)))
    t1, t2, X = mpf(81), mpf(89), mpf('1.5')
    # --- zeta control at tau=0
    report(Zf, t1, t2, X, 'zeta')
    # --- DH at tau=0 and off-line zero
    report(D, t1, t2, X, 'dh')
    z0 = findroot(D.h, mpc('85.699348', '-0.308517'))
    print('DH off-line zero z=', z0, ' => s =', mpf(1)/2 - im(z0), '+ i', re(z0))
    # --- heat flow: track the pair forward in tau until it lands on the line
    track = []; z = z0; tau = mpf(0); dt = mpf('0.01'); tc = None
    while tau < 2:
        tau += dt; D.set_tau(tau)
        try:
            zn = findroot(D.h, z, tol=mpf(10)**-45, maxsteps=60)
        except Exception as e:
            print('track fail', float(tau), e); break
        z = zn; track.append((float(tau), float(re(z)), float(-im(z))))
        if abs(im(z)) < mpf(10)**-12:
            tc = tau; break
    print('track (tau, t, x):', track[::max(1, len(track)//12)], track[-1])
    out['track'] = track
    # refine collision time: solve h=h_z=0 in real (t,tau)
    if tc is not None:
        def G(t, tau):
            D.set_tau(tau); return re(D.h(t)), re(D.hz(t))
        tprev = track[-2]
        sol = findroot(G, (mpf(track[-1][1]), mpf(track[-2][0])), tol=mpf(10)**-25, maxsteps=80)
        tcol, taucol = sol[0], sol[1]
        D.set_tau(taucol); hzz = re(D.hzz(tcol))
        # Jacobian of (t,tau)->(h,h_t): det[[h_t,h_tau],[h_tt,h_ttau]] = -h_tau*h_tt = h_tt^2/4
        print('collision t*=', tcol, 'tau*=', taucol, ' h=', float(re(D.h(tcol))/abs(hzz)), ' h_t=', float(re(D.hz(tcol))/abs(hzz)), ' Jacobian (h_tt^2/4)>0; atlas order (tau,t): index -1')
        out['collision'] = dict(t=float(tcol), tau=float(taucol))
        for tau in [taucol/2, taucol*mpf('0.95'), taucol*mpf('1.05'), taucol*2]:
            D.set_tau(tau); report(D, t1, t2, X, 'dh')
    json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'klein_index_out.json', 'w'), indent=1)
