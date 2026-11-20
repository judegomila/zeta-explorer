"""Price list: abscissa of the refined (averaged-numerator) comparison system when ONE input is
hypothetically strengthened.  Every row except the first is a MODEL value (hypothetical input),
not a bound.  Float LP + bisection, region A (ly >= h/2), free geometry, kappa = 2B-1 (limit chain),
length conditions lx >= l, ly >= l kept.  Small-delta (<1/8) classes and the gates of
Liu Remark 14.1(2),(4) are NOT imposed (optimistic)."""
import numpy as np
import scalar_system
from scalar_system import solve, bisect, count_R, worst_class

LEN = [(np.array([-1.0, 0.0, 1.0]), 0.0), (np.array([0.0, -1.0, 1.0]), 0.0)]  # l<=lx, l<=ly

def make_low(eta=0.0, gram3=True, klist=(0, 1, 2, 3)):
    """G = max(0,(1-eta) b/12, [b-ly/2 if gram3]); k = max over chosen branches."""
    def low(B):
        rows = []
        Gs = [(np.zeros(3), 0.0), ((1 - eta) * np.array([-1/12, 1/12, 0.0]), 0.0)]
        if gram3: Gs.append((np.array([-1.0, 0.5, 0.0]), 0.0))
        kall = [(np.zeros(3), 0.0), (np.array([-0.5, -0.5, 0.75]), 0.25),
                (np.array([1.0, 1.0, 1.0]), -1.0), (np.array([0.0, 0.0, 1.5]), -0.5)]
        base = np.array([1/6, 0.0, -1/6])
        for gc, g0 in Gs:
            for i in klist:
                kc, k0 = kall[i]
                rows.append((base + gc + 0.5*kc, B - (5/6 + g0 + 0.5*k0)))
        return rows
    return low

def run(name, lowfun=None, Kmode="fourth", alpha=5/6, dR=0.0, kappa=None, kinds=("av_max",), region="A", lmax=0.5, dh=False):
    lowfun = lowfun or make_low()
    Rf = (lambda d, x, k: 1.0 - d) if dh else (lambda d, x, k: count_R(d, x, k, alpha) - dR)
    f = lambda B: solve(B, list(kinds), region, kappa=kappa, Rfun=Rf, Kmode=Kmode, extra_rows=LEN, lowfun=lowfun, lmax=lmax, nd=97, nx=33)
    try:
        Bs = bisect(f, 0.70, 0.95, it=45)
    except AssertionError:
        print(f"{name:62s} infeasible at 0.95"); return
    t, v = f(Bs)
    print(f"{name:62s} B={Bs:.7f}  lx={v[0]:.4f} ly={v[1]:.4f} l={v[2]:.4f} M+l={v.sum():.4f}")
    return Bs

if __name__ == "__main__":
    b0 = run("0  refined system as is (expect B_flat = 0.8748866)")
    run("1a TRO6 eta=0.0219 (Gram b/12 -> (1-eta) b/12)", make_low(eta=0.0219))
    run("1b TRO6 eta=0.1", make_low(eta=0.1))
    run("1c TRO6 eta=1 (P_a^{1/6} term absent), P_a^2/Y' kept", make_low(eta=1.0))
    run("1d eta=1 and P_a^2/Y' absent (G=0)", make_low(eta=1.0, gram3=False))
    run("2a reflected energy without range losses (k=0)", make_low(klist=(0,)))
    run("2b only M+l<=1 loss dropped", make_low(klist=(0, 1, 3)))
    run("2c only (1+3l-2M)/4 loss dropped", make_low(klist=(0, 2, 3)))
    run("3  numerator: Lindelof on the class (K=R)", Kmode="lindelof")
    run("4a amplification exponent alpha=4/5", alpha=0.8)
    run("4b amplification exponent alpha=3/4", alpha=0.75)
    run("5a uniform count saving 1/120  ((H)-type)", dR=1/120)
    run("5b uniform count saving 1/20", dR=0.05)
    run("6a kappa=13/18 without licence", kappa=13/18)
    run("6b kappa=1/2 (GRH-size prime sums, formula extrapolated)", kappa=0.5)
    run("7a count = density-hypothesis value R=1-delta", dh=True)
    run("7b R=1-delta and Lindelof on class", dh=True, Kmode="lindelof")
    run("7c pointwise system as is (w=1-a) (expect 0.8749570)", kinds=("pt_left",))
    run("7d pointwise system with R=1-delta", kinds=("pt_left",), dh=True)
    scalar_system.THETA_SCALE = 2.0
    run("3b numerator shift capacity doubled (theta <= 2g/(6k))")
    scalar_system.THETA_SCALE = 1e9
    run("3c numerator shift up to the zero line (theta = delta/2), 4th-moment K")
    scalar_system.THETA_SCALE = 1.0
    run("8  all of 1d+2a+3 together", make_low(eta=1.0, gram3=False, klist=(0,)), Kmode="lindelof")
    run("9  low side only, as is (no high constraints)", kinds=("av_max",), kappa=None, dR=5.0)
    run("9' low side only with eta=1,G=0", make_low(eta=1.0, gram3=False), dR=5.0)
