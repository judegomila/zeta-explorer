"""Check of the wall-height law (s-coordinates):  d/dtau log|W_k| = F_ss/(4F)(c_k) = (1/4) sum_rho 1/(y_c - gamma)^2  on the line."""
from mpmath import mp, mpf, zetazero, findroot, diff, zeta, gamma, pi, log, quad, mpc
mp.dps = 30
def xi(s): return s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s)
def X(y): return xi(mpc(0.5, y)).real
NZ = 400
gs = [zetazero(k).imag for k in range(1, NZ+1)]
T = (gs[-1]+zetazero(NZ+1).imag)/2
for k in (1, 2, 5, 9):
    yc = findroot(lambda y: diff(X, y), (gs[k-1]+gs[k])/2)
    W = X(yc); Xyy = diff(X, yc, 2)
    lhs = -Xyy/(4*W)          # F_ss = -X_yy
    s = sum(1/(yc-g)**2+1/(yc+g)**2 for g in gs)
    tail = quad(lambda g: (1/(yc-g)**2+1/(yc+g)**2)*log(g/(2*pi))/(2*pi), [T, 10*T, mp.inf])
    print(k, "y_c", mp.nstr(yc, 12), "W", mp.nstr(W, 8), "F_ss/(4F)", mp.nstr(lhs, 12), "(1/4)sum", mp.nstr((s+tail)/4, 12),
          "lower bound 2/g^2", mp.nstr(2/(gs[k]-gs[k-1])**2, 6))
