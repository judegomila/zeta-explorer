import numpy as np, math, json
TWO_PI = 2 * math.pi
def FN(s, N):
    ln = np.log(np.arange(1, N + 1)); E = np.exp(-np.outer(s, ln)); return E @ np.ones(N), -(E @ ln)
rows = []
for g0, g1 in ((7005.0629, 7005.1006), (17143.786, 17143.822)):
    tm = 0.5 * (g0 + g1); N = int(math.sqrt(tm / TWO_PI)); L = math.log(N)
    S = np.array([complex(0.5 + x, tm + y) for x in np.linspace(-2.5 / L, 2.5 / L, 21) for y in np.linspace(-1.5, 1.5, 121)])
    for it in range(40):
        F, Fp = FN(S, N); d = F / Fp; big = np.abs(d) > 0.3 / L; d[big] *= 0.3 / L / np.abs(d[big]); S = S - d
    F, Fp = FN(S, N); ok = np.abs(F / Fp) < 1e-11; Z = np.unique(np.round(S[ok], 8)); Z = Z[np.abs(Z.imag - tm) < 1.5]
    tt = np.linspace(g0 - 0.3, g1 + 0.3, 4001); F, Fp = FN(0.5 + 1j * tt, N); D = 0.5 * np.log(tt / TWO_PI) + (Fp / F).real
    rows.append(dict(pair=[g0, g1], N=N, zeros_FN_within_1p5=[[round(float(z.real - 0.5), 6), round(float(z.imag), 5)] for z in Z], min_D_near_pair=float(D.min()), frac_D_neg_near_pair=float((D < 0).mean())))
    print(rows[-1])
json.dump(rows, open('lehmer.json', 'w'), indent=1)
