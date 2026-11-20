"""Independent symbolic checks of the stage-3 / stage-4 identities."""
import sympy as sp
x, u, v, a = sp.symbols('x u v a', positive=True)
L = sp.Function('L')
h = L(sp.sqrt(u)) / sp.sqrt(u)
j = u * h
def sub(e):
    e = e.subs(u, x**2).doit()
    return sp.simplify(e)
hp, hpp, hppp = [sp.diff(h, u, k) for k in (1, 2, 3)]
Lx = L(x); A = x*sp.diff(Lx, x); B = x**2*sp.diff(Lx, x, 2); C = x**3*sp.diff(Lx, x, 3)
# stage 3 (3.2),(3.3)
calA = Lx**2 + x*Lx*sp.diff(Lx,x) + x**2*Lx*sp.diff(Lx,x,2) - 2*x**2*sp.diff(Lx,x)**2
calB = Lx - x*sp.diff(Lx,x) - x**2*sp.diff(Lx,x,2)
print("3.2:", sp.simplify(sub(h*hpp - 2*hp**2) - calA/(4*x**6)))
print("3.3:", sp.simplify(sub(u*hpp + 2*hp) + calB/(4*x**3)))
# stage 4 (21),(22)
Eh = 3*Lx**2 - 2*Lx*(C+3*B+3*A) + 2*A*C - 3*B**2 + 6*A*B + 3*A**2
Ej = 3*Lx**2 + 2*Lx*(C+3*B+3*A) + 2*A*C - 3*B**2 - 6*A*B - 9*A**2
jp, jpp, jppp = [sp.diff(j, u, k) for k in (1, 2, 3)]
print("21:", sp.simplify(sp.expand(16*x**10*sub(2*hp*hppp - 3*hpp**2) - Eh)))
print("22:", sp.simplify(sp.expand(16*x**6*sub(2*jp*jppp - 3*jpp**2) - Ej)))
# Pick kernel = j[x^2,y^2] - x y h[x^2,y^2]  (generic function)
y = sp.symbols('y', positive=True)
Lf = sp.Function('M')
hh = lambda w: Lf(sp.sqrt(w))/sp.sqrt(w)
K = (Lf(x)+Lf(y))/(x+y)
rhs = (x**2*hh(x**2) - y**2*hh(y**2))/(x**2-y**2) - x*y*(hh(x**2)-hh(y**2))/(x**2-y**2)
print("29:", sp.simplify(K - rhs))
# Schur congruence (2.6) of stage-3 note
p = sp.symbols('p', positive=True)
Lfx, Lfy, La = sp.symbols('Lx Ly La')
PL = lambda X, Y, LX, LY: (LX+LY)/(X+Y)
S = PL(x,y,Lfx,Lfy) - a/p*PL(x,a,Lfx,p)*PL(a,y,p,Lfy)
R = lambda X, LX: (X*LX - a*p)/(X*p - a*LX)
rhs = (x*p-a*Lfx)*(y*p-a*Lfy)/(p*(x+a)*(y+a)) * (R(x,Lfx)+R(y,Lfy))/(x+y)
print("2.6:", sp.simplify(S - rhs))
