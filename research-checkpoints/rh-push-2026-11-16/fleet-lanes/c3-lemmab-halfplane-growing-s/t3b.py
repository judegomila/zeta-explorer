"""c3 t3: sizes of (zeta'/zeta)^(j)(sigma0+it), j = 0,1,2, on four height bands up to 2e4, against the shape
 (log t)^(8(1-sigma0)) (loglog t)^(j+1) from zero-freeness in Re s > 7/8 (Lemma 1).  MEASURED, mpmath 15 digits."""
import mpmath as mp, math, json, sys
mp.mp.dps = 15
bands = [(1000, 1030), (19970, 20000)]; step = 0.05
out = []
for s0 in [1.0, 0.95, 0.9]:
    for (a, b) in bands:
        mx = [0.0, 0.0, 0.0]; arg = [0, 0, 0]; t = a
        while t < b:
            s = mp.mpc(s0, t); z = mp.zeta(s); z1 = mp.zeta(s, derivative=1); z2 = mp.zeta(s, derivative=2); z3 = mp.zeta(s, derivative=3)
            l0 = z1 / z; l1 = z2 / z - l0 ** 2; l2 = z3 / z - 3 * z1 * z2 / z ** 2 + 2 * l0 ** 3
            for j, v in enumerate((l0, l1, l2)):
                if abs(v) > mx[j]: mx[j] = float(abs(v)); arg[j] = t
            t += step
        tm = 0.5 * (a + b); L = math.log(tm); LL = math.log(L); th = 8 * (1 - s0) if s0 <= 1 else 0.0
        shape = [L ** th * LL ** (j + 1) for j in range(3)]
        r = dict(sigma0=s0, band=[a, b], max=mx, argmax=arg, shape=shape, ratio=[mx[j] / (math.factorial(j) * shape[j]) for j in range(3)], logt=L)
        out.append(r); print(r, flush=True)
json.dump(out, open('t3b.json', 'w'), indent=1)
