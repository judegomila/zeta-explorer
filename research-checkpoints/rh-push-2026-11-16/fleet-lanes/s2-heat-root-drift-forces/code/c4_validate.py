"""validation of combo4 against the source table (flow-criticality-grading.md sec 6): lambda_min(P_S(eps)) for S = {1,2,4}"""
import numpy as np, math
from flint import arb, acb, ctx
import heatlib
ctx.prec = 400
H = heatlib.Heat(400, 8.0)
for S in ([1, 2], [1, 2, 4]):
    for eps in (0.0, 1.0, 100.0):
        phi = []
        for zk in S:
            f, d = H.F(-eps, acb(zk), True); phi.append(float((d / f).real.mid()))
        P = np.array([[(phi[i] + phi[j]) / (S[i] + S[j]) for j in range(len(S))] for i in range(len(S))])
        C = np.array([[1.0 / (S[i] + S[j]) for j in range(len(S))] for i in range(len(S))])
        import scipy.linalg as sl
        # candidates: nodes are nu = z (s = 1/2 + nu) or a = 2z
        phi2 = []
        for zk in S:
            f, d = H.F(-eps, acb(zk) / 2, True); phi2.append(float((d / f).real.mid()))
        P2 = np.array([[(phi2[i] + phi2[j]) / (S[i] + S[j]) for j in range(len(S))] for i in range(len(S))])
        print(S, eps, 'z=nu: plain %.4e cauchy %.4e | z=nu/2: plain %.4e cauchy %.4e' % (np.linalg.eigvalsh(P)[0], sl.eigh(P, C, eigvals_only=True)[0], np.linalg.eigvalsh(P2)[0], sl.eigh(P2, C, eigvals_only=True)[0]))
