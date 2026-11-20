# 30-digit re-evaluation (mpmath; not ball arithmetic) of the windows selected by the server scan u4_scan.py.
# Usage: python u4_confirm.py scan.json out.json
import json, math, os, sys
import mpmath as mp
mp.mp.dps = 30
scan = json.load(open(sys.argv[1])); OUT = os.path.abspath(sys.argv[2])
THETA = mp.mpf(3)/4; K = scan['K']
def sieve(N):
    s = bytearray([1])*(N+1); s[0] = s[1] = 0
    for i in range(2, int(N**0.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
PR = sieve(int(scan['range'][1]**0.75) + 100)
def greedy(b, half):
    Lval = 0.0; prev = 2.0; c = 0; S = set()
    def seg(x0, x1, n=8):
        h = (x1-x0)/n; return sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(n))*h
    for p in PR[1:]:
        Lval += seg(prev, float(p)); prev = float(p)
        tgt = math.floor(Lval/2) if half else math.floor(Lval)
        if tgt > c: c += 1; S.add(p)
    return S
SETS = {'DEL b=0.55': (greedy(0.55, False), 0), 'DEL b=0.75': (greedy(0.75, False), 0), 'DEL b=0.9': (greedy(0.9, False), 0), 'THIN b=0.75': (greedy(0.75, True), -1), 'zeta': (set(), 0)}
def overlap(a, u, jj, kk):
    al, be = jj*mp.pi/u, kk*mp.pi/u
    if a >= u: return mp.mpf(0)
    t1 = (u - a)*mp.cos(be*a) if jj == kk else (mp.sin((al-be)*u + be*a) - mp.sin((al-be)*a + be*a))/(al-be)
    t2 = (mp.sin((al+be)*u - be*a) - mp.sin((al+be)*a - be*a))/(al+be)
    return (t1 - t2)/u
def errK(t, P, nprime):
    Lg = math.log(t/(2*math.pi)); u = math.log(P); eps = 16*math.log(t)/t*nprime
    EM = eps*(2*Lg + 4.2*math.sqrt(P)) + eps**2 + 10*Lg/t**2
    E0 = 16*(math.log(t)/t)*(3*Lg + 4.2*math.sqrt(P)) + 4*u*math.sqrt(P)*t**-2*Lg*nprime
    return (EM + E0*nprime)/Lg
out = {}
for nm, (S, sg) in SETS.items():
    rows = []
    for cand in scan['top'][nm][:2]:
        tm = mp.mpf(cand['t']); Pm = int(mp.floor(tm**THETA)); um = mp.log(Pm)
        cm = [mp.mpc(x, y) for x, y in cand['vec']]; nrm = sum(abs(x)**2 for x in cm)
        npr = mp.sqrt(sum(abs(x)**2*((k+1)*mp.pi/um)**2 for k, x in enumerate(cm))/nrm)
        Bz = mp.mpc(0); Bc = mp.mpc(0); nS = 0
        for p in PR:
            if p >= Pm: break
            n = p; k = 1
            while n < Pm:
                a = mp.log(n); wz = mp.log(p)/mp.sqrt(n)
                wc = wz*((0 if sg == 0 else (-1)**k) if p in S else 1)
                qf = mp.mpc(0)
                for j in range(K):
                    for kk in range(K): qf += mp.conj(cm[j])*cm[kk]*overlap(a, um, j+1, kk+1)
                ph = mp.expj(-tm*a); Bz += wz*ph*qf; Bc += wc*ph*qf
                n *= p; k += 1
            if p in S: nS += 1
        Lgm = mp.log(tm/(2*mp.pi)); Qz = Lgm - 2*(Bz/nrm).real; Qc = Lgm - 2*(Bc/nrm).real
        e = errK(float(tm), Pm, float(npr))
        rows.append({'t': mp.nstr(tm, 15), 'P': Pm, 'u/Lg': mp.nstr(um/Lgm, 6), 'primes of S below P': nS, 'float64 lambda_min from the scan': cand['lam'],
                     'form value, control (30 digits)': mp.nstr(Qc, 15), 'form value, zeta, same vector': mp.nstr(Qz, 15), 'Lg': mp.nstr(Lgm, 10),
                     "norm(h_0')/norm(h_0)": mp.nstr(npr, 8), 'error bound for this vector': e, 'control below -error': bool(Qc < -e), 'zeta above +error': bool(Qz > e),
                     'c_k': cand['vec']})
        print(nm, json.dumps({k: v for k, v in rows[-1].items() if k != 'c_k'}), flush=True)
    out[nm] = rows
json.dump({'agg': scan['agg'], 'range': scan['range'], 'step': scan['step'], 'confirm': out, 'sets_first': scan.get('sets_first'), 'seconds_scan': scan.get('seconds')}, open(OUT, 'w'), indent=1)
