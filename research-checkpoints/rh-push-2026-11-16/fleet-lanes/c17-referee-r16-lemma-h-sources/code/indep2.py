# Second referee, u6g lane: form (*), E_a row (Lemma R at the two poles), single real zero (first referee's E1).
import mpmath as mp, json, random
mp.mp.dps = 30
out = {}
def xi(u): return mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
def Mz(u): return xi(u)/xi(u+1)
def orbit(M, z1, z2):
    z3 = z1+z2
    return [((z1, z2), 1), ((-z1, z3), M(z1)), ((z3, -z2), M(z2)), ((z2, -z3), M(z1)*M(z3)), ((-z3, z1), M(z2)*M(z3)), ((-z2, -z1), M(z1)*M(z2)*M(z3))]
def K(M, lam, T):
    o = orbit(M, *lam); s = 0
    for (n1, n2), c in o:
        for (m1, m2), cc in o:
            v1 = n1+mp.conj(m1); v2 = n2+mp.conj(m2)
            s += c*mp.conj(cc)*mp.exp((2*v1*T[0]+v1*T[1]+v2*T[0]+2*v2*T[1])/3)/(v1*v2)
    return s
# form (*): control = zeta times Blaschke with zeros a, b = 1 - conj a and conjugates
rows = []
for eta, g, T in ((mp.mpf('0.2'), mp.mpf('2.5'), (0.3, 0.7)), (mp.mpf('0.05'), mp.mpf('9'), (0, 0)), (mp.mpf('0.4'), mp.mpf('1.2'), (1.1, 0.2))):
    a = mp.mpc(0.5-eta, g); b = 1-mp.conj(a); zs = [a, mp.conj(a), b, mp.conj(b)]
    def M(u, zs=zs):
        v = Mz(u)
        for w in zs: v *= (u-w)/(u+mp.conj(w))
        return v
    x = 2*eta; val = K(M, (a, x+mp.mpf(10)**-11*mp.mpc(1, 1)), T)
    Mx = M(x); dM = mp.diff(M, x)
    Q = mp.exp(2*eta*T[1])/(4*eta*(1-2*eta))-Mx**2*mp.exp(-2*eta*T[1])/(4*eta*(1+2*eta))-dM+(1+T[1])*Mx
    pred = mp.exp((2*T[0]+T[1])/3)*Q
    rows.append(dict(eta=str(eta), g=str(g), T=T, K=mp.nstr(val, 12), E0Q=mp.nstr(pred, 12), rel=mp.nstr(abs(val-pred)/abs(pred), 3)))
out['star'] = rows; print(rows, flush=True)
# E_a: residues at 1-a and 1+a, Lemma R limit at both poles for the zero rho - a
aa = mp.mpf('0.2'); rho = mp.zetazero(1)
def Ma(u): return xi(u+aa)*xi(u-aa)/(xi(u+1+aa)*xi(u+1-aa))
rows = []
for p in (1-aa, 1+aa):
    r = (xi(1-2*aa)/(xi(2)*xi(2-2*aa)) if p < 1 else xi(1+2*aa)/(xi(2+2*aa)*xi(2)))   # exact residue (residue of xi at 1 is 1)
    zero = rho-aa; A = zero.real
    for T in ((0, 0), (0, 2.0), (1.0, 0.5)):
        eps = mp.mpf(10)**-9*mp.mpc(1, 0.7)
        val = abs(eps)**2*K(Ma, (p-zero+eps, zero), T)
        pred = r*abs(Ma(p-zero))**2*mp.exp((2*(2*A-p)*T[0]+(2*A-p)*T[1])/3)*(1/(2*A-p)-r*mp.exp(-p*T[1])/(4*A*p))
        rows.append(dict(p=mp.nstr(p, 4), residue=mp.nstr(r, 8), T=T, value=mp.nstr(val.real, 10), predicted=mp.nstr(pred.real, 10)))
out['Ea_lemmaR'] = rows; print(rows, flush=True)
# single real zero (u - a)/(u + a), a = 0.75 and conjugate pair 0.75 +- 0.3i: diagonal values at T = 0 on random points
rnd = random.Random(5); res = {}
pts = [(mp.mpc(rnd.uniform(0.05, 2), rnd.uniform(-6, 6)), mp.mpc(rnd.uniform(0.05, 2), rnd.uniform(-6, 6))) for _ in range(150)]
for name, zs in (('zeta', []), ('real 0.75', [mp.mpf('0.75')]), ('pair 0.75+-0.3i', [mp.mpc(0.75, 0.3), mp.mpc(0.75, -0.3)]), ('real 0.55', [mp.mpf('0.55')])):
    def M(u, zs=zs):
        v = Mz(u)
        for w in zs: v *= (u-w)/(u+mp.conj(w))
        return v
    neg = sum(1 for lam in pts if K(M, lam, (0, 0)).real < 0)
    res[name] = neg
out['diag_negative_of_150_at_T0'] = res; print(res, flush=True)
json.dump(out, open('indep2.json', 'w'), indent=1, default=str)
