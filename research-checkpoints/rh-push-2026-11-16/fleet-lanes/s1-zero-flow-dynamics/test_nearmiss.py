"""unit test of the close-pair finder: shift a block of Z by constants that turn a small positive local maximum into a pair of zeros of
prescribed tiny gap (the two zeros flanking the maximum move together)."""
import os; os.environ['RH_BACKEND'] = 'cpu'
import numpy as np, math, zl
R = zl.R
T0 = 1000000; h = 2 * math.pi / math.log(T0 / (2 * math.pi)) / 4
d = h * np.arange(40000); S = zl.sample_Z(T0, d)
rc0, nh0, _ = zl.roots_of_samples(S)
t = np.linspace(R.W + 2, len(S) - R.W - 2, 4000001); v = R.interp(S, t)
i = np.nonzero((v[1:-1] > 0) & (v[1:-1] > v[:-2]) & (v[1:-1] >= v[2:]))[0] + 1
print('zeros', len(rc0), 'hidden', nh0, 'positive local maxima', len(i), 'smallest', np.sort(v[i])[:3])
for k in i[np.argsort(v[i])[:3]]:
    tt = np.linspace(t[k - 1], t[k + 1], 20001); vv = R.interp(S, tt); m0 = vv.max(); tm = tt[vv.argmax()]
    e = 1e-3; curv = (R.interp(S, np.array([tm + e]))[0] - 2 * R.interp(S, np.array([tm]))[0] + R.interp(S, np.array([tm - e]))[0]) / e ** 2 / 2
    for gap in (1e-1, 1e-2, 1e-3, 1e-4):          # gap in coarse steps (1 coarse step = 1/4 mean spacing)
        eps = -curv * (gap / 2) ** 2
        S2 = S - (m0 - eps)
        rc, nh, bad = zl.roots_of_samples(S2)
        near = rc[np.abs(rc - tm) < 0.5]
        print('  maximum %.4f: imposed gap %.1e coarse steps -> zeros found near it: %d, measured gap %s ; %s' % (m0, gap, len(near), ('%.3e' % (near[1] - near[0])) if len(near) == 2 else '-', zl.roots_of_samples.last))
