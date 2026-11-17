"""Z(w,s) = int_0^inf (theta(t^2)^w - 1) t^(s-1) dt, theta(x)=sum_{n in Z} exp(-pi n^2 x).
Evaluated on the rotated ray t = exp(x + i*phi), phi = pi/4 - delta/2, composite Gauss-Legendre in x.
F(w,s) = Z(w,s)/w ; F(0,s) = G(s) = Mellin transform of log theta(t^2)."""
from flint import acb, arb, ctx
import math

class ZF:
    def __init__(self, prec=400, delta=0.3, h=0.1, n=72, xmax=2.8):
        ctx.prec = prec
        self.prec = prec
        self.phi = arb.pi()/4 - arb(delta)/2
        self.iphi = acb(0, self.phi)
        self.c = self.iphi.exp()
        npan = int(round(xmax/h))
        gl = [arb.legendre_p_root(n, k, weight=True) for k in range(n)]
        self.ell = []; self.W = []; self.L = []
        hh = arb(h)
        print(f"# nodes planned: {npan*n} (acb, prec {prec} bits) ~ {npan*n*5*prec//8/1e6:.2f} MB", flush=True)
        for p in range(npan):
            a = hh*p
            for (r, wt) in gl:
                x = a + hh*(r+1)/2
                l = acb(x, self.phi)
                self.ell.append(l); self.W.append(wt*hh/2)
                self.L.append(self.logtheta(l))
        self.N = len(self.ell)
        self.ellc = [l.conjugate() for l in self.ell]
        self.Lc = [l.conjugate() for l in self.L]
        self._w = None

    def logtheta(self, l):
        t2 = (2*l).exp()
        q = (-acb.pi()*t2).exp()       # nome: theta_3 = sum q^(n^2)
        aq = float(abs(q).upper()) if hasattr(abs(q), 'upper') else float(abs(q))
        if aq == 0.0:
            return acb(0)
        nmax = int(self.prec*math.log(2)/(-math.log(aq))) + 5
        s = acb(0); qp = q  # q^(2n-1) starts at q
        q2 = q*q
        for _ in range(nmax):
            s += 2*(1+qp).log()          # (1+q^(2n-1))^2
            qp = qp*q
            s += (1-qp).log()            # (1-q^(2n))
            qp = qp*q
            if abs(qp) < arb(2)**(-self.prec-10):
                break
        return s

    def setw(self, w):
        w = arb(w)
        if self._w is not None and (self._w - w).is_zero():
            return
        self._w = w
        if w.is_zero():
            self.A = [self.W[j]*self.L[j] for j in range(self.N)]
        else:
            self.A = [self.W[j]*((w*self.L[j]).exp()-1)/w for j in range(self.N)]
        self.Ac = [a.conjugate() for a in self.A]

    def F(self, w, s, deriv=False):
        """returns F (and dF/ds)"""
        self.setw(w); w = self._w
        s = acb(s); s2 = w - s
        tot = acb(0); dtot = acb(0)
        ell = self.ell; ellc = self.ellc; A = self.A; Ac = self.Ac
        if deriv:
            for j in range(self.N):
                u = A[j]*(s*ell[j]).exp(); v = Ac[j]*(s2*ellc[j]).exp()
                tot += u + v; dtot += u*ell[j] - v*ellc[j]
        else:
            for j in range(self.N):
                tot += A[j]*(s*ell[j]).exp() + Ac[j]*(s2*ellc[j]).exp()
        ip = self.iphi
        cs = (s*ip).exp()
        if w.is_zero():
            pol = cs*(1/(s*s) - ip/s)
            dpol = cs*(ip/(s*s) - ip*ip/s - 2/(s*s*s) + ip/(s*s))
        else:
            csw = ((s-w)*ip).exp()
            pol = (csw/(s-w) - cs/s)/w
            dpol = (csw*(ip/(s-w) - 1/((s-w)*(s-w))) - cs*(ip/s - 1/(s*s)))/w
        if deriv:
            return tot+pol, dtot+dpol
        return tot+pol

    def H(self, w, t, deriv=False):
        """real function on the line: F(w, w/2+it); deriv -> dH/dt = Re(i dF/ds)"""
        self.setw(w)
        s = acb(self._w/2, arb(t))
        if deriv:
            f, d = self.F(w, s, True)
            return f.real, (acb(0,1)*d).real
        return self.F(w, s).real

def zstar(u):
    u = acb(u)
    return (acb.pi()**(-u/2))*(u/2).gamma()*u.zeta()

def Gclosed(s):
    u = acb(s)/2
    return -(1-acb(2)**(1+u))*(1-acb(2)**(1-u))*zstar(u)*zstar(-u)/4
