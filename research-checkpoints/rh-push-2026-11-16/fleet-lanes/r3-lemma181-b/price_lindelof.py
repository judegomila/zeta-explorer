"""MODEL: 'Lindelof on the class' read literally: sum_B |L(1/2+theta, psi_u)| << U^{R+eps} for every theta >= 0
(no extra U^{-theta/2}).  Then theta = 0 is optimal (slope h - ly > 0) and K = R.
bypass-78's row 'K = R' also keeps the saving U^{-theta/2}; this script prices the literal reading.
Float LP of ../bypass-78/scalar_system.py, free geometry, no region constraint, gates not imposed."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bypass-78"))
import numpy as np
from scalar_system import solve, bisect
LEN = [(np.array([-1.0, 0.0, 1.0]), 0.0), (np.array([0.0, -1.0, 1.0]), 0.0)]
for region in ("A", "B", None):
    f = lambda B: solve(B, ["av_0"], region, Kmode="lindelof", extra_rows=LEN, nd=97, nx=33)
    Bs = bisect(f, 0.70, 0.95, it=45); t, v = f(Bs)
    print(f"literal Lindelof on the class (theta=0, K=R), region {region}: B={Bs:.7f} lx={v[0]:.4f} ly={v[1]:.4f} l={v[2]:.4f}")
