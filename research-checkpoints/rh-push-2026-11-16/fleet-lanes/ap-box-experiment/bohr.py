"""Bohr lifts (multivariate objects) and their stability test.  Float64 (numpy/scipy): MEASURED, not certified.

Lift.  Replace p^{-it} by an independent unimodular z_p = exp(-i th_p).  For a completely multiplicative input
    M(sigma, t; th) = G(sigma+it) E(sigma, th) + G(1-sigma-it) E~(sigma, th),
    E  = prod_p (1 - eps_p p^{-sigma} e^{-i th_p})^{-1},     E~ = prod_p (1 - eps_p p^{sigma-1} e^{+i th_p})^{-1}
(kind 'euler'), or the same with Dirichlet polynomials D = sum_{n<=N} a_n n^{-sigma} e^{-i v(n).th},
D~ = sum a_n n^{sigma-1} e^{+i v(n).th} (kind 'dirichlet').  The specialisation th_p = t log p is the univariate
object of scheme 'euler' / 'afe'.  Lee-Yang stability at height t on (1/2, s1]:  M != 0 for all th, i.e.
    R(sigma,t) * m(sigma) > 1,   R = |G(sigma+it)/G(1-sigma+it)|,   m(sigma) = min_th |E/E~|  (resp. |D/D~|).
For 'euler', m has the closed form prod_p (1-|eps_p| p^{sigma-1})/(1-|eps_p| p^{-sigma}) (attained at
z_p = sign eps_p); it depends on |eps_p| only.  The numerical minimiser is run as a check of the closed form.
"""
import math
import numpy as np
from scipy.special import loggamma, digamma
from scipy.optimize import minimize, brentq
import lylib as L


def logR(sig, t):
    return (-(2 * sig - 1) / 2 * math.log(math.pi) + loggamma((sig + 1j * t) / 2).real
            - loggamma((1 - sig + 1j * t) / 2).real)


def _eps(inp, ps):
    return np.array([float(L.eps_p(inp, p).mid()) for p in ps])


def euler_logm(inp, ps, sig):
    e = np.abs(_eps(inp, ps))
    p = np.array(ps, float)
    return float(np.sum(np.log1p(-e * p ** (sig - 1)) - np.log1p(-e * p ** (-sig))))


def euler_logratio(inp, ps, sig, th):
    e = _eps(inp, ps)
    p = np.array(ps, float)
    z = np.exp(-1j * th)
    return float(np.sum(np.log(np.abs(1 - e * p ** (sig - 1) * np.conj(z))) - np.log(np.abs(1 - e * p ** (-sig) * z))))


def dirichlet_setup(inp, N):
    ps = L.primes_upto(N)
    a, V = [], []
    for n in range(1, N + 1):
        c = float(L.coef(inp, n).mid())
        if c == 0.0:
            continue
        f = L._factor(n)
        a.append((n, c))
        V.append([f.get(p, 0) for p in ps])
    return ps, np.array([x[0] for x in a], float), np.array([x[1] for x in a]), np.array(V, float).reshape(len(a), len(ps))


def dirichlet_logratio(setup, sig, th):
    ps, n, a, V = setup
    ph = np.exp(-1j * (V @ th))
    D = np.sum(a * n ** (-sig) * ph)
    Dt = np.sum(a * n ** (sig - 1) * np.conj(ph))
    return math.log(abs(D) + 1e-300) - math.log(abs(Dt) + 1e-300)


def min_logratio(fun, nvar, rng, starts=24):
    """Adversarial minimisation over the torus: structured starts (th_p in {0, pi}) and random starts."""
    best, arg = math.inf, None
    cand = [np.zeros(nvar), np.full(nvar, math.pi)] + [rng.uniform(0, 2 * math.pi, nvar) for _ in range(starts)]
    for k in range(min(nvar, 6)):
        v = np.zeros(nvar)
        v[k] = math.pi
        cand.append(v)
    for x0 in cand:
        if nvar == 0:
            return fun(x0), x0
        r = minimize(fun, x0, method='L-BFGS-B')
        if r.fun < best:
            best, arg = float(r.fun), r.x
    return best, arg


def t_stab(logm_by_sig):
    """Smallest height above which R m > 1 at each sigma of the grid (R is increasing in t for t >= 8)."""
    worst = 8.0
    for sig, lm in logm_by_sig:
        if lm < -600:
            return math.inf
        f = lambda lt: logR(sig, math.exp(lt)) + lm
        if f(math.log(8.0)) > 0:
            continue
        hi = math.log(8.0)
        while f(hi) <= 0:
            hi += 5
            if hi > 700:
                return math.inf
        worst = max(worst, math.exp(brentq(f, math.log(8.0), hi)))
    return worst


def run(task):
    inp, size, kind = task['input'], task['size'], task.get('kind', 'euler')
    sgrid = task.get('sigmas', [0.5001, 0.51, 0.55, 0.6, 0.7, 0.75])
    T0 = task.get('T0', 14.0)
    rng = np.random.default_rng(task.get('seed', 1))
    out = {'kind': kind, 'sigmas': sgrid, 'T0': T0, 'certified': False}
    if kind == 'euler':
        ps = L.primes_upto(size)
        closed = [(s, euler_logm(inp, ps, s)) for s in sgrid]
        found = []
        for s in sgrid:
            v, _ = min_logratio(lambda th: euler_logratio(inp, ps, s, th), len(ps), rng)
            found.append(v)
        out['logm_closed'] = [c[1] for c in closed]
        out['logm_adversarial'] = found
        out['closed_vs_adversarial_maxdiff'] = max(abs(a - b[1]) for a, b in zip(found, closed))
        # random points never beat the closed-form minimum
        rnd = min(euler_logratio(inp, ps, s, rng.uniform(0, 2 * math.pi, len(ps))) - c
                  for s, c in closed for _ in range(200))
        out['random_minus_closed_min'] = rnd
        e = np.abs(_eps(inp, ps))
        p = np.array(ps, float)
        slope = float(2 * np.sum(e * np.log(p) / (np.sqrt(p) - e)))
        out['slope_at_half'] = slope
        g = lambda lt: digamma(0.25 + 0.5j * math.exp(lt)).real - math.log(math.pi) - slope
        if g(0.0) >= 0:
            out['t_line'], out['log10_t_line'] = 1.0, 0.0
        elif slope > 650:                                   # beyond float range: log t = slope + log(2 pi) + o(1)
            out['t_line'], out['log10_t_line'] = math.inf, (slope + math.log(2 * math.pi)) / math.log(10)
        else:
            lt = brentq(g, 0.0, slope + 10.0)
            out['t_line'], out['log10_t_line'] = math.exp(lt), lt / math.log(10)
        logm = closed
    else:
        setup = dirichlet_setup(inp, size)
        logm = []
        for s in sgrid:
            v, _ = min_logratio(lambda th: dirichlet_logratio(setup, s, th), len(setup[0]), rng)
            logm.append((s, v))
        out['logm_adversarial'] = [v for _, v in logm]
        out['nvars'] = len(setup[0])
    out['t_stab'] = t_stab(logm)
    margin = min(logR(s, T0) + lm for s, lm in logm)
    out['min_log_margin_at_T0'] = margin
    out['verdict'] = 'PASS' if margin > 0 else 'FAIL'
    return out
