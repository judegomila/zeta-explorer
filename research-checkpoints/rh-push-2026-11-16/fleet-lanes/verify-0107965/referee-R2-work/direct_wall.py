# Direct test of the wall: H_t(X+iy)/B_t(X+iy) from mpmath zeta (heat kernel quadrature in the
# imaginary direction) against the Polymath model f_t and the dephased ideal model F_id.
import sys, json, time
import mpmath as mp
from flint import arb, acb, ctx
mp.mp.dps = 45; ctx.prec = 220
X = 6000000185827; N = 690988
Xm = mp.mpf(X); Lm = mp.log(Xm/(4*mp.pi))
def logM0(s):
    return mp.log(s)+mp.log(s-1)-(s/2)*mp.log(mp.pi)+mp.log(mp.sqrt(2*mp.pi)/16)+(s/2-mp.mpf(1)/2)*mp.log(s/2)-s/2
def alpha(s):
    return 1/(2*s)+1/(s-1)+mp.log(s/(2*mp.pi))/2
def logMt(s,t): return logM0(s)+t*alpha(s)**2/4
def logpref(s):   # log of (1/8)(s(s-1)/2) pi^{-s/2} Gamma(s/2)
    return mp.log(s)+mp.log(s-1)-mp.log(16)-(s/2)*mp.log(mp.pi)+mp.loggamma(s/2)
H = mp.mpf(1)/10      # grid step in y'
YMAX = 9
t0=time.time()
# cache: G(y') = log-prefactor and zeta at s=(1+y'-iX)/2, y'>=0 ; H_0(X+iy') = pref*zeta
cache = {}
for k in range(0, int(YMAX/H)+1):
    yp = k*H
    s = mp.mpc((1+yp)/2, -Xm/2)
    cache[k] = (logpref(s), mp.zeta(s))
    if k%10==0: print('zeta', k, time.time()-t0, flush=True)
def H0_over(k, logden):   # H_0(X + i k H)/exp(logden), any integer k
    if k >= 0:
        lp, z = cache[k]; return mp.exp(lp-logden)*z
    lp, z = cache[-k]     # H_0(X - i y') = conj(H_0(X + i y'))  -> divide conj: use conj trick
    return mp.conj(mp.exp(lp-mp.conj(logden))*z)
# model sums in flint
def A(m): return arb(mp.nstr(m, 60))
def AC(c): return acb(A(c.real), A(c.imag))
logs = [arb(n).log() for n in range(1, N+1)]
def model(t, y):
    sB = mp.mpc((1+y)/2, -Xm/2); sA = 1-sB
    eB = sB + t*alpha(sB)/2; eA = sA + t*alpha(sA)/2
    lg = logMt(sA,t)-logMt(sB,t)
    eBf, eAf, tf = AC(eB), AC(eA), A(mp.mpf(t))
    S1 = acb(0); S2 = acb(0)
    for v in logs:
        b = tf*v*v/4
        S1 += (b - eBf*v).exp(); S2 += (b - eAf*v).exp()
    def tomp(z): return mp.mpc(mp.mpf(z.real.mid().str(50,radius=False)), mp.mpf(z.imag.mid().str(50,radius=False)))
    S1, S2 = tomp(S1), tomp(S2)
    f = S1 + mp.exp(lg)*S2
    # ideal dephased model
    th0 = mp.arg(mp.exp(1j*mp.fmod(2*mp.im(logM0(mp.mpc(mp.mpf(1)/2, Xm/2))), 2*mp.pi)))
    phi = th0/2 + mp.pi*t*Lm/16
    Lf = A(Lm); yf = A(mp.mpf(y)); Xf = arb(X); th0f = A(th0); pif = arb.pi()
    F = acb(0)
    for n, v in enumerate(logs, start=1):
        psi = Xf*v/2 - th0f/2 - pif*tf*(Lf-2*v)/16
        amp = (-tf*v*(Lf-v)/4 - v/2).exp()
        e = acb(0, psi).exp()
        F += amp*((-yf*v/2).exp()*e + (-yf*(Lf-v)/2).exp()/e)
    F = tomp(F)
    return f, F, phi, lg, th0
res = []
for t in [mp.mpf(0), mp.mpf(1)/100, mp.mpf(41)/1000, mp.mpf(82)/1000, mp.mpf(41)/250]:
    for y in [mp.mpf(0), mp.mpf(3)/10, mp.mpf(1)]:
        sB = mp.mpc((1+y)/2, -Xm/2); logden = logMt(sB, t)
        k0 = int(mp.nint(y/H))
        if t == 0:
            q = H0_over(k0, logden)
        else:
            c = 2*mp.sqrt(t); h = H/c; acc = mp.mpc(0); used = 0
            for k in range(-int(YMAX/H), int(YMAX/H)+1):
                r = (k-k0)*H/c
                if r < -9 or r > 16: continue
                acc += mp.exp(-r*r)*H0_over(k, logden); used += 1
            q = acc*h/mp.sqrt(mp.pi)
            # edge terms (truncation indicator)
            rmax = (int(YMAX/H)-k0)*H/c
            edge = abs(mp.exp(-rmax*rmax)*H0_over(int(YMAX/H), logden))
        f, F, phi, lg, th0 = model(t, y)
        eC0 = mp.exp(-(1+y)*Lm/4 - t*Lm**2/16)
        row = dict(t=mp.nstr(t,6), y=mp.nstr(y,4),
                   absHoverB=mp.nstr(abs(q),12), Re_dephased=mp.nstr(mp.re(mp.exp(-1j*phi)*q),12),
                   ReFid=mp.nstr(mp.re(F),12),
                   err_H_minus_f=mp.nstr(abs(q-f),6), polymath_eC0_leading=mp.nstr(eC0,6),
                   paper_EC=mp.nstr(4*mp.exp(mp.mpf(1)/10)*eC0,6),
                   err_f_minus_ideal=mp.nstr(abs(f-mp.exp(1j*phi)*F),6),
                   log_gamma_minus_lead=mp.nstr(abs(lg-(-y*Lm/2+1j*(th0+mp.pi*t*Lm/8)) - 2j*mp.pi*mp.nint(mp.im(lg-1j*(th0+mp.pi*t*Lm/8))/(2*mp.pi))),6),
                   quad_step_r=(mp.nstr(h,5) if t>0 else None), edge=(mp.nstr(edge,3) if t>0 else None),
                   wall_ok=bool(abs(q) > mp.mpf(697)/900))
        res.append(row); print(json.dumps(row), flush=True)
json.dump(res, open(sys.argv[1],'w'), indent=1)
print('seconds', time.time()-t0)
