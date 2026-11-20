import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import numpy as np, explib, mpmath as mp
mx = 0
for z in (0.3 + 0.2j, 3.9 - 1j, 4.1 + 0.5j, -2 + 30j, 5 + 100j, -0.02 + 7j, 1.5 - 400j):
    ex = mp.quad(lambda x: mp.mpf(35) / 32 * (1 - x * x) ** 3 * mp.exp(mp.mpc(z) * x), mp.linspace(-1, 1, 400 if abs(z) > 50 else 40))
    got = explib.betahat(np.array([z]))[0]
    mx = max(mx, abs(got - complex(ex)) / abs(complex(ex)))
    print(z, got, complex(ex))
print('max rel err', mx)
