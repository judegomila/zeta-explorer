"""twzeros.py: zeros of Z_{Gamma(2)}(1/2 + i r, chi_{a,b}) on 0 < r < R (transfer operator of sel.py, float64 determinant
of Arb-evaluated entries; MEASURED). Hardy form: Zh(r) = Z(1/2+ir) exp(-i theta(r)), theta(r) = -pi int_0^r y tanh(pi y) dy + r log c,
c = prod_j 2 sin(pi alpha_j) (functional equation of the e1 lane); Im Zh / |Zh| is printed as a check of the functional equation.
usage: twzeros.py a b R step out.json"""
import sys, json, math, os
import numpy as np
import sel
a, b, R, step = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
al = [x % 1.0 for x in (a, b, a - b)]
logc = sum(math.log(2 * math.sin(math.pi * x)) for x in al)
def theta(r):
    from scipy.integrate import quad
    return -math.pi * quad(lambda y: y * math.tanh(math.pi * y), 0, r)[0] + r * logc
def Zh(r, K=36):
    z = sel.Ztw(0.5 + 1j * r, a, b, K=K, prec=800)
    w = z * complex(math.cos(-theta(r)), math.sin(-theta(r)))
    return (r, w.real, w.imag)
if __name__ == '__main__':
    import multiprocessing as mp, warnings
    warnings.simplefilter('ignore')
    rs = [step * (i + 1) for i in range(int(R / step))]
    nproc = int(os.environ.get('RH_WORKERS', '1'))
    print(f'a={a} b={b} points={len(rs)} nproc={nproc}; planned memory per process < 0.5 GB', flush=True)
    with mp.Pool(nproc) as pool: vals = pool.map(Zh, rs, chunksize=4)
    zeros = []
    for (r0, v0, i0), (r1, v1, i1) in zip(vals, vals[1:]):
        if v0 * v1 < 0:
            lo, hi, flo = r0, r1, v0
            for _ in range(30):
                mid = (lo + hi) / 2; fm = Zh(mid)[1]
                if fm * flo < 0: hi = mid
                else: lo, flo = mid, fm
            zeros.append((lo + hi) / 2)
    imrat = max(abs(i) / (abs(v) + abs(i) + 1e-300) for r, v, i in vals)
    json.dump(dict(a=a, b=b, R=R, step=step, logc=logc, zeros=zeros, max_im_ratio=imrat, vals=vals), open(sys.argv[5], 'w'))
    print('zeros', len(zeros), zeros, 'max Im/|.|', imrat, flush=True)
