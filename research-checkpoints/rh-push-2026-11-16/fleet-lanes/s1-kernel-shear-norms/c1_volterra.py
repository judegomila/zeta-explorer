# Combination 1: Volterra shear norm ||V_{a,Phi_F}|| for zeta, real chi, DH, 440 twins, heat-deformed.
# (V f)(t) = int_0^t Phi(t)Phi(s) sinh(a(t-s)) f(s) ds on L^2(0,inf).
# b-volterra-norm T1: G(a)/2 <= ||V|| <= G(a), G^2 = (E_+ E_- - I^2)/4, E_pm = int_0^inf Phi^2 e^{+-2at}.
import sys, json, math, os
import numpy as np
import klib

NGL = int(os.environ.get('NGL', 6000)); TMAX = 3.2
t, w = klib.gl_nodes(NGL, 0.0, TMAX)

def G_of(phi2):
    I = float(np.sum(w*phi2))
    def G(a):
        Ep = float(np.sum(w*phi2*np.exp(2*a*t))); Em = float(np.sum(w*phi2*np.exp(-2*a*t)))
        return 0.5*math.sqrt(max(Ep*Em - I*I, 0.0))
    return G

def cross(G, level, lo=1e-3, hi=110.0):
    if G(hi) < level: return None
    if G(lo) > level: return lo
    for _ in range(80):
        mid = 0.5*(lo + hi)
        if G(mid) < level: lo = mid
        else: hi = mid
    return 0.5*(lo + hi)

def nystrom_norm(phi_fn, a, n=1500, T=None):
    """top singular value of the Volterra operator, Gauss-Legendre Nystrom on [0,T]."""
    if T is None: T = TMAX
    tt, ww = klib.gl_nodes(n, 0.0, T)
    ph = phi_fn(tt)
    P = ph*np.exp(a*tt); Q = ph*np.exp(-a*tt)
    K = 0.5*(np.outer(P, Q) - np.outer(Q, P))
    K = np.tril(K, -1)
    sw = np.sqrt(ww)
    M = sw[:, None]*K*sw[None, :]
    return float(np.linalg.norm(M, 2))

def nystrom_cross(phi_fn, lo, hi, n=1500, T=None):
    for _ in range(24):
        mid = 0.5*(lo + hi)
        if nystrom_norm(phi_fn, mid, n, T) < 1: lo = mid
        else: hi = mid
    return 0.5*(lo + hi)

out = {'NGL': NGL, 'TMAX': TMAX, 'objects': [], 'twins': []}

def record(name, phi_fn, extra=None, nyst=False):
    ph = phi_fn(t); G = G_of(ph*ph)
    r = {'name': name, 'G_at_0.5': G(0.5), 'a_G1': cross(G, 1.0), 'a_G2': cross(G, 2.0)}
    if nyst:
        r['norm_at_0.5_nystrom'] = nystrom_norm(phi_fn, 0.5)
        r['a_norm1_nystrom'] = nystrom_cross(phi_fn, r['a_G1'], r['a_G2'])
    if extra: r.update(extra)
    return r

# validation and named objects
z = record('zeta', klib.phi_zeta_np, nyst=True)
print('VALIDATE zeta: G(0.5)=%.10e (b-volterra-norm 4.673660098e-4)  ||V||(0.5)=%.6e (4.57567e-4)  a_G1=%.6f (certified bracket 31.6213..31.6214)  a_norm1=%.6f (Nystrom 31.621366)  a_G2=%.5f (34.05578)'
      % (z['G_at_0.5'], z['norm_at_0.5_nystrom'], z['a_G1'], z['a_norm1_nystrom'], z['a_G2']), flush=True)
out['objects'].append(z)
for q in (3, 4, 5, 7, 8, 11, 13):
    b, d = klib.real_char(q)
    out['objects'].append(record('chi_real_q%d' % q, lambda u, b=b, q=q, d=d: klib.phi_F_np(u, b, q, d), {'q': q, 'delta': d}, nyst=True))
out['objects'].append(record('DH', lambda u: klib.phi_F_np(u, klib.DH_B, 5, 1), {'q': 5, 'delta': 1}, nyst=True))
# single-term surrogate of DH (n = 1 term only): what a coefficient-blind statistic would give
out['objects'].append(record('DH_n1_only', lambda u: 4*np.exp(3*u)*np.exp(-math.pi*np.exp(4*u)/5), {'q': 5, 'delta': 1}, nyst=True))
# sign-gauge control of b-volterra-norm T2: eps*Phi with a sign flip at t0 (same Phi^2)
out['objects'].append(record('zeta_signflip_t0=0.3', lambda u: klib.phi_zeta_np(u)*np.where(u > 0.3, -1.0, 1.0), nyst=True))
# backward / forward heat: e^{tau u^2} Phi
for tau in (-4.0, -1.0, -0.25, 0.25, 1.0):
    out['objects'].append(record('zeta_heat_tau=%g' % tau, lambda u, tau=tau: klib.phi_zeta_np(u)*np.exp(tau*u*u), {'tau': tau}, nyst=True))
for r in out['objects']:
    print(json.dumps(r), flush=True)

# all twins
ons = {x['key']: x for x in json.load(open(os.path.join(klib.HERE, 'twin_onsets.json')))}
tw = klib.twin_table()
print('twins', len(tw), flush=True)
for T in tw:
    q, d, b = T['q'], T['delta'], T['b']
    ph = klib.phi_F_np(t, b, q, d); G = G_of(ph*ph)
    T['_mom'] = ph*ph
    ph1 = 4*np.exp((1 + 2*d)*t)*b[1]*np.exp(-math.pi*np.exp(4*t)/q); G1 = G_of(ph1*ph1)
    o = ons.get(T['key'], {})
    out['twins'].append({'key': T['key'], 'q': q, 'delta': d, 'a1': b[1], 'a_G1': cross(G, 1.0), 'a_G2': cross(G, 2.0),
                         'a_G1_n1only': cross(G1, 1.0), 'a_neg': o.get('a_neg'), 'A_cert': o.get('A_cert'),
                         'g1': o.get('g1'), 'b1': o.get('b1')})
# normalised twins (leading coefficient 1): G scales by 1/a1^2
for T, r in zip(tw, out['twins']):
    Gn = G_of(T['_mom']/T['b'][1]**2); r['a_G1_normalised_a1=1'] = cross(Gn, 1.0)
# Euler arms: |Phi_chi|^2 = Phi_{T+}^2 + Phi_{T-}^2 (the two twins are the real and imaginary parts of e^{i theta} Phi_chi)
arms = []
for i in range(0, len(tw), 2):
    Tp, Tm = tw[i], tw[i + 1]
    assert Tp['key'][:-2] == Tm['key'][:-2]
    Ga = G_of(Tp['_mom'] + Tm['_mom'])
    arms.append({'key': Tp['key'][:-3] + '.L', 'a_G1_arm': cross(Ga, 1.0), 'a_G1_T+': out['twins'][i]['a_G1'], 'a_G1_T-': out['twins'][i + 1]['a_G1']})
out['arms'] = arms
out['arm_summary'] = {'n_pairs': len(arms), 'n_arm_crosses_before_both_twins': sum(1 for x in arms if x['a_G1_arm'] < min(x['a_G1_T+'], x['a_G1_T-'])),
                      'arm_a_G1_range': [min(x['a_G1_arm'] for x in arms), max(x['a_G1_arm'] for x in arms)]}
print(json.dumps(out['arm_summary']), flush=True)
# Nystrom confirmation on a sample of twins
import random
random.seed(1)
samp = random.sample(range(len(tw)), int(os.environ.get('NSAMP', 24)))
for i in samp:
    T = tw[i]; r = out['twins'][i]
    f = lambda u, T=T: klib.phi_F_np(u, T['b'], T['q'], T['delta'])
    r['a_norm1_nystrom'] = nystrom_cross(f, r['a_G1'], r['a_G2'], n=1200)
    print(T['key'], 'a_G1 %.5f a_norm1 %.5f a_G2 %.5f' % (r['a_G1'], r['a_norm1_nystrom'], r['a_G2']), flush=True)

# statistics
def rank(x):
    o = np.argsort(x); r = np.empty(len(x)); r[o] = np.arange(len(x)); return r
def corr(x, y): return float(np.corrcoef(x, y)[0, 1])
tw_r = out['twins']
aV = np.array([r['a_G1'] for r in tw_r]); aV1 = np.array([r['a_G1_n1only'] for r in tw_r])
st = {'n_twins': len(tw_r), 'a_G1_min': float(aV.min()), 'a_G1_max': float(aV.max()),
      'max_abs_diff_full_vs_n1only': float(np.max(np.abs(aV - aV1))),
      'n_twins_with_a_G1_below_3.6': int(np.sum(aV < 3.6))}
for fld in ('a_neg', 'A_cert'):
    m = np.array([r[fld] is not None for r in tw_r])
    y = np.array([r[fld] for r in tw_r if r[fld] is not None], dtype=float)
    st['n_' + fld] = int(m.sum())
    st['pearson_aG1_vs_' + fld] = corr(aV[m], y); st['spearman_aG1_vs_' + fld] = corr(rank(aV[m]), rank(y))
    # residual of a_G1 after removing the coefficient-blind predictor (n=1 term): correlation with onset
    res = (aV - aV1)[m]
    st['spearman_residual_vs_' + fld] = corr(rank(res), rank(y)) if np.ptp(res) > 0 else None
    # partial: regress a_G1 on (log q, log|a1|, delta), then correlate residual with onset
    X = np.array([[1.0, math.log(r['q']), math.log(abs(r['a1'])), r['delta']] for r in tw_r])[m]
    beta, *_ = np.linalg.lstsq(X, aV[m], rcond=None)
    st['lin_fit_logq_log|a1|_delta'] = [float(x) for x in beta]
    rr = aV[m] - X@beta
    st['fit_rms_' + fld] = float(np.sqrt(np.mean(rr**2)))
    st['spearman_fitresidual_vs_' + fld] = corr(rank(rr), rank(y))
    # onset regressed on same blind predictors: how much of onset do they explain
    b2, *_ = np.linalg.lstsq(X, y, rcond=None)
    st['R2_onset_from_blind_predictors_' + fld] = float(1 - np.sum((y - X@b2)**2)/np.sum((y - y.mean())**2))
aVn = np.array([r['a_G1_normalised_a1=1'] if r['a_G1_normalised_a1=1'] is not None else np.nan for r in tw_r])
m = np.array([r['a_neg'] is not None for r in tw_r]) & np.isfinite(aVn)
y = np.array([r['a_neg'] for r in tw_r], dtype=float)[m]
st['normalised_a1=1: spearman_aG1_vs_a_neg'] = corr(rank(aVn[m]), rank(y))
X = np.array([[1.0, math.log(r['q']), r['delta']] for r in tw_r])[m]
beta, *_ = np.linalg.lstsq(X, aVn[m], rcond=None); rr = aVn[m] - X@beta
st['normalised_a1=1: spearman_residual_after_(logq,delta)_vs_a_neg'] = corr(rank(rr), rank(y))
st['normalised_a1=1: range'] = [float(np.nanmin(aVn)), float(np.nanmax(aVn))]
cens = np.array([r['a_neg'] is None for r in tw_r])
st['a_G1_mean_censored(blind to 3.6)'] = float(aV[cens].mean()); st['a_G1_mean_with_onset'] = float(aV[~cens].mean())
out['stats'] = st
print(json.dumps(st, indent=1))
for T in tw: T.pop('_mom', None)
json.dump(out, open(os.path.join(klib.HERE, sys.argv[1] if len(sys.argv) > 1 else 'c1_volterra.json'), 'w'), indent=0)
