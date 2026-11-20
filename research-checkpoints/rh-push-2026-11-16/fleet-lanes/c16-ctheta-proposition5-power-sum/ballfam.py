"""Tapered lattice rows alone at large A = u b_max, built and evaluated entirely in ball arithmetic (python-flint, 600 bits).
u_max = 1, u in {1/2, ..., 1} (7 values); pairs at gamma_j = j * 2 pi / kappa, offsets b_j = A cos^(2p)(pi x_j / 2) / max, x_j = j / ((n+1)/2).
The first two ball batches of ballcheck.py built gamma_j in float64: at A >= 80 the float rounding of the positions (relative 1e-16)
is larger than the tolerance e^(-A) of the cancellation, and those rows failed for that reason (see RESULT section 4.5). Here positions are balls.
With argument 'perturb' each position is moved by a seeded amount of size eps (reported), to measure the tolerance."""
import sys, os, json, math, random
from flint import acb, arb, ctx
ctx.prec = 600
HERE = os.path.dirname(os.path.abspath(__file__))
def run(a):
    A, n, kappa, p, eps = a
    pi = arb.pi()
    d = 2 * pi / arb(kappa)
    rnd = random.Random(12345)
    js = [arb(2 * j - (n - 1)) / 2 for j in range(n)]
    xs = [j / (arb(n + 1) / 2) for j in js]
    prof = [((pi * x / 2).cos()) ** (2 * p) for x in xs]
    mx = max(prof, key=lambda v: float(v.mid()))
    g = [j * d + (arb(rnd.uniform(-1, 1)) * arb(eps) if eps else 0) for j in js]
    b = [arb(A) * q / mx for q in prof]
    ext = float((g[-1]).mid()); pad = 60.0; h = 0.26
    us = [arb(1) / 2 + arb(k) / 12 for k in range(7)]
    lo = None; arg = None; maxrad = 0.0; npts = 0
    y = -ext - pad + 0.37 * h
    zs = [acb(-gj, bj) for gj, bj in zip(g, b)]
    while y < ext + pad:
        ya = arb(y)
        for u in us:
            tot = arb(0)
            for z0 in zs:
                z = z0 + ya
                tot += 2 * ((1 - (u * z).cos()) / (u * z * z)).real
            l = float((tot.mid() - tot.rad()).mid()); maxrad = max(maxrad, float(tot.rad().mid())); npts += 1
            if lo is None or l < lo: lo, arg = l, (y, float(u.mid()))
        y += h
    res = dict(A=A, n=n, kappa=kappa, p=p, position_perturbation=eps, grid_points=npts, ball_lower_min=lo, argmin=arg, max_radius=maxrad, value_2pi_over_d=kappa)
    print(json.dumps(res), flush=True)
    return res
if __name__ == "__main__":
    from multiprocessing import Pool
    if len(sys.argv) > 1 and sys.argv[1] == "perturb":
        tasks = [(20, 44, 2.0, 1, e) for e in (0.0, 1e-12, 1e-10, 1e-9, 1e-8, 1e-7, 1e-6)] + [(40, 88, 2.0, 1, e) for e in (0.0, 1e-20, 1e-18, 1e-17, 1e-16, 1e-14)]
        name = "out_ballfam_perturb.json"
    else:
        tasks = [(20, 40, 2.0, 1, 0.0), (40, 80, 2.0, 1, 0.0), (40, 88, 2.0, 1, 0.0), (80, 160, 2.0, 1, 0.0), (80, 176, 2.0, 1, 0.0), (80, 200, 2.0, 1, 0.0),
                 (160, 352, 2.0, 1, 0.0), (160, 400, 2.0, 1, 0.0), (160, 480, 2.5, 1, 0.0)]
        name = "out_ballfam.json"
    tasks.sort(key=lambda t: -t[1])
    with Pool(int(os.environ.get("RH_WORKERS", "2"))) as pool:
        out = pool.map(run, tasks, chunksize=1)
    json.dump(out, open(os.path.join(HERE, name), "w"))
    print("done")
