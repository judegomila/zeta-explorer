# Second referee of Lemma H: ball test (python-flint arb), own code.
# Heat member of a kernel K without polar terms: K_tau(u) = exp(tau u^2/4) K(u), tau < 0.
# Monomial M = prod_i K_{X_i}(u_i)^{e_i}; S = sum e_i u_i^2.  Claim under test (hypothesis M_0 <= lam):
#   M_tau <= lam for all tau<0  iff  lam*S >= 0 or M_0*lam <= 0 ; otherwise exactly for |tau| <= 4|log(lam/M_0)|/|S|.
import json, random, sys
from flint import arb, acb, ctx
ctx.prec = 128
PI = arb.pi()
def tailcheck(r):
    assert r < arb("0.5")
def phie(u, N=12):
    # Phi is even (theta functional equation, CLASSICAL): evaluate at -u when Re u < 0 so that the series converges fast
    return phi(-u, N) if acb(u).real < 0 else phi(u, N)
def phi(u, N=30):
    # zeta kernel: sum (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}); u may be acb
    e4 = (4*u).exp(); s = 0*u
    for n in range(1, N+1):
        s += (2*PI*PI*n**4*(9*u).exp() - 3*PI*n*n*(5*u).exp())*(-PI*n*n*e4).exp()
    # tail n > N: bounded by 2 * 2 pi^2 (N+1)^4 |e^{9u}| exp(-pi (N+1)^2 Re e^{4u}) when the term ratio is < 1/2
    re4 = acb(e4).real; x = PI*re4
    if not (x > 0) or not (arb((N+2)/(N+1))**4*(-(2*N+3)*x).exp() < arb("0.5")):
        return acb(arb(0, float("inf")), arb(0, float("inf")))   # ball too wide for the tail bound: the integrator bisects
    t = 4*PI*PI*(N+1)**4*acb((9*u).exp()).abs_upper()*(-(N+1)**2*x).exp()
    rad = arb(0, float(t.upper())*1.0000001 if t.upper() > 0 else 0)
    return s + (acb(rad, rad) if isinstance(u, acb) else rad)
CH7 = {1:0, 2:2, 3:1, 4:1, 5:2, 6:0}  # cubic even character mod 7: chi(3)=w, 3 generates; chi(n)=w^{ind(n)}, ind mod 3
def kchi(u, N=60):
    w = (acb(0, 2)*acb.pi()/3).exp()
    e2 = (2*u).exp(); s = acb(0)
    for n in range(1, N+1):
        if n % 7: s += w**CH7[n % 7]*(-PI*n*n*e2/7).exp()
    x = PI*e2/7
    tailcheck((-(2*N+3)*x).exp())
    t = 2*(-(N+1)**2*x).exp(); r = float(t.upper())*1.0000001
    return (s + acb(arb(0, r), arb(0, r)))*(u/2).exp()
_ea = {}
def kEa(u, a=arb("0.2")):
    # kernel of xi(s+a) xi(s-a) up to a constant: int Phi(v) Phi(u-v) e^{2a(2v-u)} dv over [-3,3] (+ tail ball)
    key = str(u)
    if key in _ea: return _ea[key]
    f = lambda v, an: phie(v)*phie(u-v)*(2*a*(2*v-u)).exp()
    val = acb.integral(f, -1.6, 1.6, rel_tol=arb(2)**-70).real
    # tail |v|>1.6 (integrand below 1e-800 there; nodes |u|<=0.6); original note for 3: Phi even (classical), Phi(v) <= 4 pi^2 e^{9|v|} exp(-pi e^{4|v|}) there, Phi <= Phi(0) < 1: < 1e-10000
    val = val + arb(0, 1e-300)
    _ea[key] = val; return val
KERN = {"zeta": lambda u: phi(u), "chi7_re": lambda u: kchi(u).real, "chi7_im": lambda u: kchi(u).imag, "Ea": kEa}
def member(name, u, tau):
    return (tau*u*u/4).exp()*KERN[name](u)
def mono(names, us, es, tau):
    M = arb(1)
    for nm, u, e in zip(names, us, es):
        v = member(nm, u, tau)
        M *= (v**int(e)) if float(e).is_integer() else (v.log()*arb(e)).exp()
    return M
def decide(M, lam):
    if M <= lam: return True
    if M > lam: return False
    return None
def run(kind, seed, npts=20, flip=False):
    rnd = random.Random(seed); rows = []; cases = {}
    for p in range(npts):
        k = rnd.choice([2, 3, 4])
        us = [arb(rnd.randint(-60, 60))/100 for _ in range(k)]
        if kind == "chi7":
            names = [rnd.choice(["chi7_re", "chi7_im"]) for _ in range(k)]
            es = [rnd.choice([-3, -2, -1, 1, 2, 3]) for _ in range(k)]
            us = [u if not (u == 0) else arb("0.17") for u in us]
        else:
            names = [kind]*k
            es = [rnd.choice([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3]) for _ in range(k)]
        if flip: es = [-e for e in es]
        S = sum((arb(e)*u*u for e, u in zip(es, us)), arb(0))
        M0 = mono(names, us, es, arb(0))
        if not (M0 != 0) or not (S != 0): continue
        # lam: four designs, cycled so every case of the rule occurs
        d = p % 4
        if d == 0: lam = M0 + abs(M0)*arb(rnd.choice([0.05, 0.5, 3.0]))       # same sign side or crossing
        elif d == 1: lam = M0*arb(rnd.choice([0.3, 0.9])) if M0 < 0 else M0*arb(rnd.choice([1.1, 4.0]))
        elif d == 2: lam = abs(M0)*arb(rnd.choice([0.5, 2.0])) if M0 < 0 else M0*arb(1.0000001)
        else: lam = M0*0 if M0 < 0 else M0*arb(2.5)
        assert M0 <= lam
        allt = bool(lam*S >= 0) or bool(M0*lam <= 0)
        und = not allt and not ((lam*S < 0) and (M0*lam > 0))
        assert not und
        taus = [arb(t) for t in (-0.003, -0.02, -0.3, -2, -15, -120)]
        tstar = None
        if not allt:
            tstar = 4*abs((lam/M0).log())/abs(S)
            taus += [-tstar*arb(f) for f in (0.5, 0.99, 0.999999, 1.000001, 1.01, 2, 50)]
        ok = 0; bad = 0; undec = 0; fails = 0
        for tau in taus:
            got = decide(mono(names, us, es, tau), lam)
            pred = True if allt else bool(abs(tau) <= tstar) if (abs(tau) <= tstar or abs(tau) > tstar) else None
            if got is None or pred is None: undec += 1
            elif got == pred: ok += 1; fails += (not got)
            else: bad += 1
        case = ("S>0" if S > 0 else "S<0") + (",M>0" if M0 > 0 else ",M<0") + (",lam>0" if lam > 0 else ",lam<0" if lam < 0 else ",lam=0")
        cases[case] = cases.get(case, 0) + 1
        rows.append(dict(point=p, names=names, u=[float(u.mid()) for u in us], e=es, S=float(S.mid()), M0=M0.str(12), lam=lam.str(12),
                         case=case, rule="all tau" if allt else "threshold", tau_star=None if tstar is None else tstar.str(15),
                         n_tau=len(taus), agree=ok, disagree=bad, undecided=undec, certified_failures=fails))
        print(kind, p, case, "all" if allt else "thr %s" % tstar.str(8), ok, bad, undec, fails, flush=True)
    return rows, cases
def defcheck():
    # heat member of zeta from the function side: H_tau(z) = int exp(tau u^2/4) Phi(u) e^{izu} du must equal the
    # Gaussian average  int Xi(z-y) exp(-y^2/|tau|) dy / sqrt(pi |tau|),  Xi(z) = xi(1/2 + i z/2)/4.
    tau = arb("-0.3"); z = arb("3.7"); at = -tau
    def xi(s): return s*(s-1)/2*(acb.pi()**(-s/2))*(s/2).gamma()*s.zeta()
    Xi = lambda x: xi(acb(0.5) + acb(0, 1)*x/2)/4
    lhs = acb.integral(lambda u, an: (tau*u*u/4).exp()*phie(u)*(acb(0, 1)*z*u).exp(), -3, 3, rel_tol=arb(2)**-60)
    Y = 12
    rhs = acb.integral(lambda y, an: Xi(z-y)*(-y*y/at).exp()/(PI*at).sqrt(), -Y, Y, rel_tol=arb(2)**-60)
    xi0 = acb.integral(lambda u, an: phie(u), -3, 3, rel_tol=arb(2)**-60)
    return dict(tau=-0.3, z=3.7, kernel_side=lhs.real.str(25), gaussian_average_of_Xi=rhs.real.str(25),
                diff=(lhs-rhs).abs_upper().str(5), Xi0_integral=xi0.real.str(25), Xi0_formula=Xi(acb(0)).real.str(25),
                note="tails beyond |u|>3 (below 1e-10000) and |y|>12 (below Xi(0) erfc(12/sqrt 0.3) < 1e-200) not inside the balls")
if __name__ == "__main__":
    import time
    which = sys.argv[1:]
    out = {}
    for kind, seed, flip in (("zeta", 11, False), ("chi7", 12, False), ("chi7flip", 12, True), ("Ea", 13, False), ("def", 0, False)):
        if kind not in which: continue
        t0 = time.time()
        if kind == "def":
            out["definition_check"] = defcheck(); print(out["definition_check"], time.time()-t0, flush=True); continue
        rows, cases = run(kind.replace("flip", ""), seed, flip=flip)
        out[kind] = dict(rows=rows, cases=cases, points=len(rows), agree=sum(r["agree"] for r in rows),
                         disagree=sum(r["disagree"] for r in rows), undecided=sum(r["undecided"] for r in rows),
                         certified_failures=sum(r["certified_failures"] for r in rows), seconds=time.time()-t0)
        print(kind, {k: v for k, v in out[kind].items() if k != "rows"}, flush=True)
    json.dump(out, open("lemh_%s.json" % "_".join(which), "w"), indent=1)
