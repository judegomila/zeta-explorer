"""F_b(x) = sum_{k<=x} mu(k) r_b(x/k) for x <= N via the exact identity
   F_b(x) = psi_b(x) - c x m(x)  (a = 0),  m(x) = sum_{k<=x} mu(k)/k,
and the control analogues.  Segmented sieve.  Extremes are taken at x = n and x -> n^- ."""
import sys, math, json, time
import numpy as np, mpmath as mp
N = int(float(sys.argv[1])) if len(sys.argv) > 1 else 10**8
SEG = 10**7
A = 0.2
print(f"N={N} SEG={SEG}")
plan = N*(1+4+8+8)/1e9 + SEG*8*14/1e9
print(f"planned memory: mu int8 {N/1e9:.2f} GB, M int32 {4*N/1e9:.2f} GB, m float64 {8*N/1e9:.2f} GB, "
      f"m_odd float64 {8*N/1e9:.2f} GB, segment temporaries {SEG*8*14/1e9:.2f} GB; head/tail is chunked; peak total {plan:.2f} GB", flush=True)
P = int(N**0.5)+1
sv = np.ones(P+1, bool); sv[:2] = False
for i in range(2, int(P**0.5)+1):
    if sv[i]: sv[i*i::i] = False
primes = np.nonzero(sv)[0].tolist()
MU = np.zeros(N+1, np.int8); MC = np.zeros(N+1, np.int32)
m_all = np.zeros(N+1); modd = np.zeros(N+1)
z14 = float(mp.zeta(1+2*A)); z06 = float(mp.zeta(1-2*A)); zh = float(mp.zeta(0.5))
Cp = z14/(1+A); Cm = z06/(1-A)
edges = [10**(2+i/4) for i in range(0, 4*int(round(math.log10(N)))-8+1)]
names = ['b1_delta1', 'b2_pow2', 'b3_dt_over_t', 'V=x m(x)', 'E_a', 'Liouville_lin', 'Liouville_res', 'Beurling_2to2.5']
ext = {nm: [[-np.inf, np.inf] for _ in edges] for nm in names}
def upd(nm, x, v):
    idx = np.searchsorted(edges, x, side='right') - 1
    ok = idx >= 0
    idx = idx[ok]; v = v[ok]
    if len(v) == 0: return
    # blocks are contiguous in x
    b0, b1 = idx[0], idx[-1]
    for b in range(b0, b1+1):
        s = np.searchsorted(idx, b, 'left'); e = np.searchsorted(idx, b, 'right')
        if e > s:
            ext[nm][b][0] = max(ext[nm][b][0], float(v[s:e].max())); ext[nm][b][1] = min(ext[nm][b][1], float(v[s:e].min()))
carry = dict(m=0.0, M=0, mo=0.0, Pp=0.0, Pm=0.0, Q=0.0)
t0 = time.time()
for lo in range(1, N+1, SEG):
    hi = min(lo+SEG, N+1); L = hi-lo
    n = np.arange(lo, hi, dtype=np.int64); rem = n.copy()
    mu = np.ones(L, np.int8); val = np.ones(L)
    for p in primes:
        if p*p > hi: break
        g = -(p**A + p**(-A))
        s = (-lo) % p
        mu[s::p] *= -1; val[s::p] *= g; rem[s::p] //= p
        q = p*p; s = (-lo) % q
        mu[s::q] = 0; val[s::q] /= g; rem[s::q] //= p
        q = p*p*p; s = (-lo) % q
        val[s::q] = 0
    big = rem > 1
    mu[big] *= -1
    rb = rem[big].astype(float)
    val[big] *= -(rb**A + rb**(-A))
    del rem, big, rb
    x = n.astype(float)
    def cs(terms, key):
        c = np.cumsum(terms); c += carry[key]
        carry[key] += math.fsum(terms)
        prev = np.empty_like(c); prev[1:] = c[:-1]; prev[0] = c[0]-terms[0]
        return c, prev
    muf = mu.astype(float)
    m, mprev = cs(muf/x, 'm')
    Mc = np.cumsum(mu.astype(np.int64)) + carry['M']; carry['M'] = int(Mc[-1])
    mo, _ = cs(np.where(n % 2 == 1, muf/x, 0.0), 'mo')
    MU[lo:hi] = mu; MC[lo:hi] = Mc; m_all[lo:hi] = m; modd[lo:hi] = mo
    V = x*m; Vm = x*mprev            # x m(x) at x=n and x->n^-
    upd('V=x m(x)', x, V); upd('V=x m(x)', x, Vm)
    upd('b1_delta1', x, 1-V); upd('b1_delta1', x, 1-Vm)
    psi2 = np.floor(np.log2(x))+1; psi2m = np.floor(np.log2(x-0.5))+1
    upd('b2_pow2', x, psi2-2*V); upd('b2_pow2', x, psi2m-2*Vm)
    lx = np.log(x)
    upd('b3_dt_over_t', x, lx-V); upd('b3_dt_over_t', x, lx-Vm)
    # E_a: F = 1 - Cp x^{1+a} P+(x) - Cm x^{1-a} P-(x)
    Pp, Ppp = cs(val*x**(-(1+A)), 'Pp'); Pm, Pmp = cs(val*x**(-(1-A)), 'Pm')
    xp = x**(1+A); xm = x**(1-A)
    upd('E_a', x, 1-Cp*xp*Pp-Cm*xm*Pm); upd('E_a', x, 1-Cp*xp*Ppp-Cm*xm*Pmp)
    # Liouville: inverse mu^2, target sqrt(Y)/zeta(1/2)
    Q, Qp = cs(np.abs(muf)/np.sqrt(x), 'Q')
    sx = np.sqrt(x)
    FL = 1 - sx*Q/zh; FLp = 1 - sx*Qp/zh
    upd('Liouville_lin', x, FL/x); upd('Liouville_lin', x, FLp/x)
    lin = -(12/math.pi**2)/zh
    upd('Liouville_res', x, FL-lin*x); upd('Liouville_res', x, FLp-lin*x)
    # Beurling: odd integers and the generalised prime 2.5 ; F = 1 - rho x [m_odd(x) - m_odd(x/2.5)/2.5]
    j = (n*2)//5
    VB = x*(mo - modd[j]/2.5)
    upd('Beurling_2to2.5', x, 1-(5/6)*VB)
    print(f"segment to {hi-1}: M={carry['M']} m={carry['m']:.3e} t={time.time()-t0:.0f}s", flush=True)
print("check: M(N) =", carry['M'], " N*m(N) =", N*carry['m'], " P+(N), P-(N) =", carry['Pp'], carry['Pm'])
# ---- fits
out = {'N': N, 'edges': edges, 'ext': ext}
def fit(xs, ys):
    xs = np.array(xs); ys = np.array(ys); ok = ys > 0
    if ok.sum() < 4: return None
    return float(np.polyfit(np.log(xs[ok]), np.log(ys[ok]), 1)[0])
print("\nblock extremes (block = [10^(e), 10^(e+1/4)))")
res = {}
for nm in names:
    hiE = [edges[i+1] if i+1 < len(edges) else N for i in range(len(edges))]
    mx = [e[0] for e in ext[nm]]; mn = [-e[1] for e in ext[nm]]
    start = 4  # from x >= 1e3
    xs = hiE[start:-1]; a_up = fit(xs, mx[start:-1]); a_dn = fit(xs, mn[start:-1])
    env_up = np.maximum.accumulate(np.array(mx[:-1])); env_dn = np.maximum.accumulate(np.array(mn[:-1]))
    e_up = fit(xs, env_up[start:]); e_dn = fit(xs, env_dn[start:])
    res[nm] = dict(block_up=a_up, block_dn=a_dn, env_up=e_up, env_dn=e_dn)
    print(f"\n{nm}: exponent of max F: block fit {a_up}, envelope fit {e_up}; exponent of -min F: block fit {a_dn}, envelope fit {e_dn}")
    for i in range(0, len(edges)-1, 2):
        print(f"   x<{hiE[i]:.3g}: max {mx[i]:+.4f}  min {-mn[i]:+.4f}   max/sqrt {mx[i]/hiE[i]**0.5:+.4f}  min/sqrt {-mn[i]/hiE[i]**0.5:+.4f}")
out['fits'] = res
# ---- head / tail for b1 at x = N and x = N - 12345
print("\nhead/tail, b1 = delta_1, r = -{Y}:  F = H_K + tail_K ;  tail_K = -sum_{j<=x/K}(M(x/j)-M(K)) ... check")
ht = []
for X in (N, N-12345):
    Ks = [2**e for e in range(4, int(math.log2(X))+1, 2)]
    Hd = {}; acc = 0.0
    for c0 in range(1, X+1, SEG):       # chunked: temporaries SEG*8*3 bytes
        c1 = min(c0+SEG, X+1)
        k = np.arange(c0, c1, dtype=np.int64)
        fr = (X % k).astype(float); fr /= k; fr *= MU[c0:c1]
        hcc = np.cumsum(fr)
        for K in Ks:
            if c0 <= K < c1: Hd[K] = -(acc + float(hcc[K-c0]))
        acc += math.fsum(fr)
    hc_last = -acc
    F = hc_last; Fid = 1 - X*float(m_all[X])
    print(f" x={X}: direct F = {F:.6f}, identity 1 - x m(x) = {Fid:.6f}")
    for e in range(4, int(math.log2(X))+1, 2):
        K = 2**e
        H = Hd[K]; tail = F-H
        J = X//K
        jj = np.arange(1, J+1, dtype=np.int64)
        tsum = int((MC[X//jj].astype(np.int64) - int(MC[K])).sum())   # = sum_{K<k<=x} mu(k) floor(x/k)
        tail_id = tsum - X*(float(m_all[X])-float(m_all[K]))
        ht.append(dict(x=X, K=K, head=H, tail=tail, tail_id=tail_id, MK=int(MC[K]), sumM=tsum))
        print(f"   K=2^{e:<2d} head {H:+12.4f} tail {tail:+12.4f} tail via M-sum {tail_id:+12.4f}  [floor part {tsum:+d}, smooth part {-X*(float(m_all[X])-float(m_all[K])):+.4f}]")
out['headtail'] = ht
json.dump(out, open(f'main_{N:.0e}.json', 'w'))
