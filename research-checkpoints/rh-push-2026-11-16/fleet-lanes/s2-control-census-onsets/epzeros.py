# First off-line zero of an Epstein zeta function by ball arithmetic (python-flint), Chowla-Selberg expansion.
#   E*(tau,s) = pi^{-s} Gamma(s) (1/2) sum' y^s/|m + n tau|^{2s}
#            = xi*(2s) y^s + xi*(2s-1) y^{1-s} + 4 sqrt(y) sum_{n>=1} [sum_{d|n} (n/d^2)^{s-1/2}] K_{s-1/2}(2 pi n y) cos(2 pi n x),
#   xi*(w) = pi^{-w/2} Gamma(w/2) zeta(w);  Lambda_Q(s) = (sqrt|D|/2pi)^s Gamma(s) Z_Q(s) = 2 E*(tau,s), tau = (b + i sqrt|D|)/(2a).
# g(s) = E*(tau,s)/(xi*(2s) y^s) -> 1 for Re s -> +inf. N_off(T) = number of zeros of g in {1/2+dl < Re s < sR, t0 < Im s < T} by winding.
import math, cmath, sys, time
from flint import acb, arb, ctx

DIVS = {}
def divisors(n):
    if n not in DIVS: DIVS[n] = [d for d in range(1, n + 1) if n % d == 0]
    return DIVS[n]

class Ep:
    def __init__(self, form):
        self.a, self.b, self.c = form; self.D = self.b**2 - 4*self.a*self.c
        self.nev = 0
    def setprec(self, t):
        ctx.prec = int(90 + 2.4*abs(t))
        self.y = arb(-self.D).sqrt()/(2*self.a); self.x = arb(self.b)/(2*self.a); self.pi = arb.pi()
    def K(self, n, nu, tol):
        p0 = ctx.prec; p = p0; zf = 2*math.pi*n*math.sqrt(-self.D)/(2*self.a)
        try:
            while True:
                ctx.prec = p
                z = 2*arb.pi()*n*arb(-self.D).sqrt()/(2*self.a)
                k = acb(z).bessel_k(nu)
                if max(float(k.real.rad()), float(k.imag.rad())) < tol or p > p0 + 8000: return k
                p += max(64, int(1.5*zf))
        finally: ctx.prec = p0
    def xi(self, w): return self.pi**(-w/2)*(w/2).gamma()*w.zeta()
    def parts(self, sig, t):
        """returns (main, total) as acb; main = xi*(2s) y^s."""
        self.setprec(t); self.nev += 1
        s = acb(sig, t); y = self.y
        main = self.xi(2*s)*y**s
        tot = main + self.xi(2*s - 1)*y**(1 - s)
        nu = s - acb(0.5)
        yf = float(y.mid()); nmax = int((abs(t) + 0.75*ctx.prec*0.6931 + 20)/(2*math.pi*yf)) + 2
        pw = [None] + [acb(m)**nu for m in range(1, nmax + 1)]
        tol = 10.0**(-(0.69*abs(t) + 20))
        ipw = [None] + [1/p for p in pw[1:]]
        acc = acb(0)
        for n in range(1, nmax + 1):
            cs = (2*self.pi*n*self.x).cos()
            sg = acb(0)
            for d in divisors(n): sg += pw[n//d]*ipw[d]
            acc += sg*self.K(n, nu, tol)*cs
        tot += 4*y.sqrt()*acc
        return main, tot
    def g(self, sig, t):
        m, tt = self.parts(sig, t); z = tt/m
        return complex(float(z.real.mid()), float(z.imag.mid()))
    def estar(self, sig, t):
        return self.parts(sig, t)[1]

def seg_arg(f, p0, p1, hmax, hmin=1e-6, f0=None):
    """continuous change of arg f along the straight segment p0 -> p1 (complex numbers), adaptive."""
    L = abs(p1 - p0); u = (p1 - p0)/L; pos = 0.0; h = min(hmax, L); tot = 0.0
    v0 = f(p0) if f0 is None else f0
    while pos < L - 1e-13:
        h = min(h, L - pos)
        while True:
            v1 = f(p0 + u*(pos + h)); d = cmath.phase(v1/v0)
            if abs(d) < 0.9 or h <= hmin: break
            h /= 2
        tot += d; pos += h; v0 = v1
        if abs(d) < 0.3: h = min(hmax, 1.7*h)
    return tot, v0

def sigma_right(form, margin=0.3):
    """sigma with sum_{m>amin} (r(m)/r(amin)) (m/amin)^{-sigma} < 0.9 (no zeros of Z_Q to the right)."""
    import objs, numpy as np
    a = form[0]; D = form[1]**2 - 4*form[0]*form[2]
    M = 400*a + 4000; r = objs.rep_counts(form, M); m = np.nonzero(r)[0]; m = m[m > a]; b = r[m]/r[a]; ratio = m/a
    sg = 1.6
    while True:
        tail = (2*math.pi/math.sqrt(-D))*a/r[a]*(M/a)**(1 - sg)/(sg - 1)*1.3
        if float(np.sum(b*ratio**(-sg))) + tail < 0.9: return sg + margin
        sg += 0.1

def real_zeros(form, n=60):
    """real zeros of E*(tau, sigma), 1/2 < sigma < 1 (sign changes on a grid, bisection)."""
    E = Ep(form); f = lambda sg: float(E.parts(sg, 0.0)[1].real.mid())
    xs = [0.5 + 0.5*(k + 0.5)/n for k in range(n)]; vs = [f(x) for x in xs]; out = []
    for i in range(n - 1):
        if vs[i]*vs[i + 1] < 0:
            lo, hi, flo = xs[i], xs[i + 1], vs[i]
            for _ in range(45):
                mid = 0.5*(lo + hi); fm = f(mid)
                if fm*flo > 0: lo, flo = mid, fm
                else: hi = mid
            out.append(0.5*(lo + hi))
    return out

def first_offline(form, Tmax=60.0, dT=2.0, dl=0.02, t0=0.25, budget=600.0, verbose=False, more=True, skip_if_real=False):
    """off-line zeros (Re s > 1/2 + dl) in order of height: the first one, then all up to max(1.25 gamma_1, gamma_1 + 4) (capped by Tmax)."""
    E = Ep(form); f = lambda p: E.g(p.real, p.imag)
    sL = 0.5 + dl; sR = sigma_right(form); st = time.time()
    hmax_h = 0.25
    Abot, _ = seg_arg(f, complex(sL, t0), complex(sR, t0), hmax_h)
    gR0 = cmath.phase(f(complex(sR, t0)))
    Aleft = 0.0; T = t0; vL = None; prevN = 0; Tstop = Tmax
    out = dict(form=list(form), sR=sR, dl=dl, zeros=[], multi=0)
    try: out['real'] = real_zeros(form)
    except Exception as e: out['real_err'] = repr(e)
    if skip_if_real and out.get('real'):
        out.update(T_scanned=0.0, evals=E.nev, secs=round(time.time() - st, 1), skipped_complex=True); return out
    while T < Tstop:
        Tn = min(T + dT, Tstop)
        dA, vLn = seg_arg(f, complex(sL, T), complex(sL, Tn), 0.15, f0=vL)
        Atop, vR = seg_arg(f, complex(sL, Tn), complex(sR, Tn), hmax_h, f0=vLn)
        N = (Abot + (cmath.phase(vR) - gR0) - Atop - (Aleft + dA))/(2*math.pi)
        if verbose: print('T=%.2f N=%.4f evals=%d %.1fs' % (Tn, N, E.nev, time.time() - st), flush=True)
        if abs(N - round(N)) > 0.2: out['warn'] = 'non-integer winding %.3f at T=%.2f' % (N, Tn)
        if round(N) > prevN:
            if round(N) > prevN + 1: out['multi'] += 1
            tlo, thi = T, Tn; base_left = Aleft
            for _ in range(7):
                tm = 0.5*(tlo + thi)
                dAm, vm = seg_arg(f, complex(sL, tlo), complex(sL, tm), 0.08)
                Atm, vRm = seg_arg(f, complex(sL, tm), complex(sR, tm), hmax_h, f0=vm)
                Nm = (Abot + (cmath.phase(vRm) - gR0) - Atm - (base_left + dAm))/(2*math.pi)
                if round(Nm) >= prevN + 1: thi = tm
                else: tlo = tm; base_left += dAm
            best = None
            for k in range(0, int((sR - sL)/0.02) + 1):
                sg = sL + 0.02*k
                for tt in (tlo, 0.5*(tlo + thi), thi):
                    v = abs(f(complex(sg, tt)))
                    if best is None or v < best[0]: best = (v, sg, tt)
            z = complex(best[1], best[2])
            for _ in range(40):
                hh = 1e-6; f0v = f(z); d = (f(z + hh) - f(z - hh))/(2*hh)
                if d == 0: break
                step = f0v/d
                if abs(step) > 0.05: step *= 0.05/abs(step)
                z -= step
                if abs(step) < 1e-10: break
            out['zeros'].append([z.real, z.imag, abs(f(z)), tlo, thi])
            if len(out['zeros']) == 1:
                Tstop = min(Tmax, max(1.25*z.imag, z.imag + 4.0)) if more else Tn
        prevN = round(N); Aleft += dA; vL = vLn; T = Tn
        if time.time() - st > budget: out['timeout'] = True; break
    out.update(T_scanned=T, evals=E.nev, secs=round(time.time() - st, 1))
    return out

if __name__ == '__main__':
    form = tuple(int(v) for v in sys.argv[1:4])
    E = Ep(form)
    # validation: Chowla-Selberg against direct lattice summation at s = 3 + 2i
    from flint import acb
    a, b, c = form; s = acb(3, 2); ctx.prec = 150
    S = acb(0); R = 400
    for m in range(-R, R + 1):
        for n in range(-R, R + 1):
            if m == 0 and n == 0: continue
            S += acb(a*m*m + b*m*n + c*n*n)**(-s)
    D = b*b - 4*a*c
    lam_direct = (acb(-D).sqrt()/(2*acb.pi()))**s*s.gamma()*S
    lam_cs = 2*E.estar(3, 2)
    print('direct', lam_direct.mid() if hasattr(lam_direct, 'mid') else lam_direct, 'CS', lam_cs)
    t0 = time.time(); print(first_offline(form, Tmax=float(sys.argv[4]) if len(sys.argv) > 4 else 30, verbose=True)); print(time.time() - t0)
