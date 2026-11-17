"""Symbolic M_u(m) = prod (m - m_i), m_i = 1+u-t_i = |1-alpha_i|^2, for g=2,3,4 with generic class data b_{n,k}."""
import sympy as sp
u, T, m, y, h = sp.symbols('u T m y h')
def build(g):
    # generic b_{n,k}, n<=g-1, k>=1 (k <= n/2+1 by Clifford); b_{n,0}=h-sum
    b = {}
    syms = []
    for n in range(g):
        row = {}
        for k in range(1, n//2 + 2):
            if n == 0: row[1] = sp.Integer(1); continue
            s = sp.Symbol(f'b{n}_{k}'); syms.append(s); row[k] = s
        row[0] = h - sum(row.values()); b[n] = row
    for n in range(g-1, 2*g-1):
        b[n] = {k + n + 1 - g: v for k, v in b[2*g-2-n].items()}
    kk = lambda k: sum(u**i for i in range(k))
    Z = sum(sum(v*kk(k) for k, v in b[n].items())*T**n for n in range(2*g-1))
    Z += h*T**(2*g-1)*sum(kk(n+1-g)*T**(n-2*g+1) for n in range(2*g-1, 2*g+4))
    P = sp.expand((1-T)*(1-u*T)*Z)
    P = sum(P.coeff(T, n)*T**n for n in range(2*g+1))
    # G(y): P(T) = T^g G(1/T + uT)
    Dk = [sp.Integer(2), y]
    for k in range(2, g+1): Dk.append(sp.expand(y*Dk[-1] - u*Dk[-2]))
    G = P.coeff(T, g) + sum(P.coeff(T, g-k)*Dk[k] for k in range(1, g+1))
    Mm = sp.expand((-1)**g * G.subs(y, 1+u-m))
    return sp.Poly(Mm, m), syms
for g in (2, 3, 4):
    Mp, syms = build(g)
    print(f"g={g}")
    for i, c in enumerate(Mp.all_coeffs()[::-1]):
        print(f"   m^{i}: ", sp.factor(c))
    print("   dM/du =", sp.factor(sp.diff(Mp.as_expr(), u)), "  deg_u =", sp.degree(Mp.as_expr(), u))
