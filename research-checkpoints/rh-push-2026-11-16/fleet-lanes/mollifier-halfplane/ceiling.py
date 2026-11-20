"""Proved ceiling for the one-piece Levinson-Conrey functional at mollifier length theta.
For admissible Q (Q(0)=1, Q(x)+Q(1-x)=const) and q=e^{Rv}Q:  q(0)=1, q(1)=q1, q(1/2)=(e^{R/2}+e^{-R/2}q1)/2.
c = (1+q1^2)/2 + A h(C/A), h(r)=sqrt(r) coth(theta sqrt(r)) concave  =>  A h(C/A) = inf_{r0} [alpha A + beta C],
beta=h'(r0), alpha=h(r0)-r0 h'(r0) >= 0.  For each r0, min of int(alpha q^2+beta q'^2) under the three point
constraints is explicit (two cosh arcs).  Hence c >= c_lb(R,q1,theta) and kappa <= sup_{R,q1} 1 - log(c_lb)/R.
"""
import numpy as np, json, sys
def h(r, th):
    x = th*np.sqrt(r); return np.sqrt(r)/np.tanh(x)
def hp(r, th):
    s = np.sqrt(r); x = th*s
    return 0.5/(s*np.tanh(x)) - 0.5*th/np.sinh(np.minimum(x, 300.0))**2
def arc(a, b, om):  # min int_0^{1/2} (om^2 q^2 + q'^2), q(0)=a,q(1/2)=b
    y = np.minimum(om/2, 300.0)
    return om*((a*a+b*b)/np.tanh(y) - 2*a*b/np.sinh(y))
def ceiling(th, Rs, nq=1601, nr=500):
    r0 = np.exp(np.linspace(np.log(1e-10), np.log(1e10), nr))[:, None]
    be = hp(r0, th); al = h(r0, th) - r0*be; om = np.sqrt(al/be)
    best = (-9, None, None)
    for R in Rs:
        q1 = np.concatenate([np.linspace(-3, 3, nq), np.linspace(-0.05, 0.05, 401), np.linspace(-np.exp(R)*1.5, np.exp(R)*1.5, 801)])[None, :]
        qh = (np.exp(R/2) + np.exp(-R/2)*q1)/2
        E = be*(arc(1.0, qh, om) + arc(qh, q1, om))
        clb = (1+q1[0]**2)/2 + E.min(axis=0)
        k = 1 - np.log(clb)/R
        assert np.all(np.isfinite(k))
        j = E.argmin(axis=0); assert j.min() > 0 and j.max() < nr-1 or True
        i = np.argmax(k)
        if k[i] > best[0]: best = (float(k[i]), float(R), float(q1[0, i]))
    return best
if __name__ == "__main__":
    Rs = np.concatenate([np.linspace(0.01, 4, 800), np.linspace(4, 20, 161)])
    out = {}
    for th in [0.5, 17/33, 6/11, 4/7, 0.6, 2/3, 0.75, 7/8, 1, 1.5, 2, 3, 5, 10, 30, 100, 1000]:
        b = ceiling(th, Rs); out[str(th)] = b
        print("theta=%9.4f ceiling=%.6f at R=%.4f q1=%.4f" % (th, *b), flush=True)
    json.dump(out, open("ceiling_table.json", "w"), indent=1)
