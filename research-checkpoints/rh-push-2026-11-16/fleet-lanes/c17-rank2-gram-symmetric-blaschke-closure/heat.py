# Backward heat control. H_t(x) = int_0^inf e^{t v^2} Phi(v) cos(x v) dv,  Phi(v) = sum_n (2 pi^2 n^4 e^{9v} - 3 pi n^2 e^{5v}) exp(-pi n^2 e^{4v}).
# H_0(x) = xi_R(1/2 + i x/2)/8, xi_R(s) = s(s-1)/2 pi^{-s/2} Gamma(s/2) zeta(s).  f_t(s) := H_t(-2i(s - 1/2)) = int e^{t v^2} Phi(v) cosh(2(s-1/2)v) dv ; f_t(s) = f_t(1-s).
# M_t(u) = f_t(u)/f_t(u+1).  For t = 0: M_0(u) = M_zeta(u) (u-1)/(u+1).
# Fixed Gauss-Legendre rule in mpmath (non-rigorous: quadrature error is not enclosed; MEASURED only).
import mpmath as mp
class Heat:
    def __init__(self, t, dps=60, deg=5, V=1.4):
        mp.mp.dps = dps
        self.t = mp.mpf(t)
        nodes = []
        pieces = 8
        from mpmath.calculus.quadrature import GaussLegendre
        gl = GaussLegendre(mp.mp)
        base = gl.calc_nodes(deg, mp.mp.prec)        # nodes on [-1,1]
        for k in range(pieces):
            a = V*k/mp.mpf(pieces); b = V*(k+1)/mp.mpf(pieces)
            for (x, w) in base:
                v = (a+b)/2 + (b-a)/2*x
                nodes.append((v, w*(b-a)/2*self.phi(v)*mp.exp(self.t*v*v)))
        self.nodes = nodes
    @staticmethod
    def phi(v):
        s = mp.mpf(0)
        for n in range(1, 30):
            term = (2*mp.pi**2*n**4*mp.exp(9*v) - 3*mp.pi*n**2*mp.exp(5*v))*mp.exp(-mp.pi*n*n*mp.exp(4*v))
            s += term
            if abs(term) < mp.mpf(10)**(-mp.mp.dps-10) and n > 2: break
        return s
    def f(self, s):
        z = 2*(s-mp.mpf(1)/2)
        return sum(w*mp.cosh(z*v) for (v, w) in self.nodes)
    def M(self, u):
        return self.f(u)/self.f(u+1)
if __name__ == '__main__':
    import sys
    h0 = Heat(0)
    s = mp.mpc(0.3, 7.7)
    xiR = s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
    print('t=0 check f_0(s) vs xi_R(s)/8:', mp.nstr(abs(h0.f(s) - xiR/8)/abs(xiR/8), 5), 'nodes', len(h0.nodes))
    # count sign changes of f_t(1/2 + i y) for y in [0, 60]; zeta has 13 zeros there
    for t in (0, -1, -5, -10, -20, -40):
        h = Heat(t, dps=40)
        ys = [mp.mpf(k)/20 for k in range(0, 1201)]
        vals = [h.f(mp.mpc(0.5, y)).real for y in ys]
        sc = [float(ys[i]) for i in range(len(ys)-1) if vals[i]*vals[i+1] < 0]
        print('t =', t, 'real zeros of f_t(1/2+iy), 0<y<60:', len(sc), [round(x, 2) for x in sc]); sys.stdout.flush()
