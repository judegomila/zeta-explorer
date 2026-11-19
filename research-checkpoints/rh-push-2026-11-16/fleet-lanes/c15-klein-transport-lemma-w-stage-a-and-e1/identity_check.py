# Check: int_0^inf omega_{a,h}(r) C_a(t,r) dr = Re(F' conj F)(1/2+h+it)/h, C = Im(conj U(t-r) U(t+r))/(2 a r).
import json, os, mpmath as mp
HERE = os.path.dirname(os.path.abspath(__file__)); mp.mp.dps = 25
def omega(r, a, h):
    beta = mp.pi*h/a; q = mp.e**(-mp.pi*r/a)
    return 2*mp.pi*r*mp.sin(beta)/(a*h)*q*(1-q*q)/(1+2*q*mp.cos(beta)+q*q)**2
def xi(s): return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
out = []
def run(name, F, a, h, t, rmax):
    U = lambda v: F(mp.mpc(0.5+a, v))
    C = lambda r: mp.im(mp.conj(U(t-r))*U(t+r))/(2*a*r)
    pts = [0] + [a*k/2 for k in range(1, int(2*rmax/a)+1)]
    lhs = mp.quad(lambda r: omega(r, a, h)*C(r), pts)
    mass = mp.quad(lambda r: omega(r, a, h), pts)
    s = mp.mpc(0.5+h, t)
    rhs = mp.re(mp.diff(F, s)*mp.conj(F(s)))/h
    out.append(dict(case=name, a=a, h=h, t=t, mass=float(mass), lhs=float(lhs), rhs=float(rhs), rel=float(abs(lhs-rhs)/abs(rhs))))
    print(out[-1], flush=True)
d = mp.mpf('0.4')
run('poly delta=0.4', lambda s: (s-0.5)**2 - d*d, 1.0, 0.2, 0.0, 40)
run('poly delta=0.4', lambda s: (s-0.5)**2 - d*d, 1.0, 0.7, 1.3, 40)
run('xi', xi, 1.0, 0.5, 20.0, 30)
run('xi', xi, 0.6, 0.3, 100.0, 20)
run('xi', xi, 0.3, 0.15, 14.2, 12)
run('xi', xi, 0.3, 0.05, 14.134725, 12)
json.dump(out, open(os.path.join(HERE, 'identity_check.json'), 'w'), indent=1)
