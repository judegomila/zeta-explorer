# Referee recomputation (mpmath, 40 digits; separate code path): the band form through complex exponentials
#   conj(h(s)) h(s-a) = (2/u) sum_{j,k} conj(c_j) c_k sin(al_j s) sin(al_k (s-a)),  sin A sin B = -(1/4) sum_{e,f=+-1} e f exp(i(eA + fB)),
#   int_a^u exp(i(e al_j s + f al_k (s-a))) ds = exp(-i f al_k a) (exp(i lam u) - exp(i lam a))/(i lam),  lam = e al_j + f al_k  (u - a if lam = 0).
# Own sieve and own copy of the greedy rule; sets compared by sha256 with the lane's record. Usage: python ref_u4.py ball.json out.json [max windows]
import sys, json, math, hashlib, time
import mpmath as mp
mp.mp.dps = 40
D = json.load(open(sys.argv[1])); OUT = sys.argv[2]; MAXW = int(sys.argv[3]) if len(sys.argv) > 3 else 99
def primes_upto(N):
    flags = [True]*(N+1); flags[0] = flags[1] = False; out = []
    for i in range(2, N+1):
        if flags[i]:
            out.append(i)
            for j in range(i*i, N+1, i): flags[j] = False
    return out
def greedy_set(PR, b, half):
    acc = 0.0; prev = 2.0; cnt = 0; S = []
    for p in PR[1:]:
        x0 = prev; x1 = float(p); h = (x1-x0)/8
        acc += sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(8))*h; prev = x1
        tgt = math.floor(acc/2) if half else math.floor(acc)
        if tgt > cnt: cnt += 1; S.append(p)
    return S
PAR = {'DEL b=0.55': (0.55, False, 0), 'DEL b=0.75': (0.75, False, 0), 'DEL b=0.9': (0.9, False, 0), 'THIN b=0.75': (0.75, True, -1)}
res = []
wins = D['windows'][:MAXW]
PMAX = max(w['P'] for w in wins) + 100
PR = primes_upto(PMAX)
SETS = {}
for w in wins:
    t0 = time.time(); nm = w['family']
    t = mp.mpf(float(w['t'])) if w.get('t_as_float64') else mp.mpf(w['t'])
    P = int(mp.floor(t**(mp.mpf(3)/4))); assert P == w['P']
    if nm != 'zeta' and nm not in SETS:
        S = greedy_set(PR, PAR[nm][0], PAR[nm][1]); SETS[nm] = set(S)
    S = SETS.get(nm, set()); sg = PAR[nm][2] if nm != 'zeta' else 0
    u = mp.log(P); Lg = mp.log(t/(2*mp.pi)); K = 6
    c = [mp.mpc(x, y) for x, y in w['vec']]; nrm = sum(abs(z)**2 for z in c)
    al = [(k+1)*mp.pi/u for k in range(K)]
    Bz = mp.mpc(0); Bc = mp.mpc(0)
    Eu = {(e, k): mp.expj(e*al[k]*u) for e in (1, -1) for k in range(K)}
    for p in PR:
        if p >= P: break
        n = p; m = 1
        while n < P:
            a = mp.log(n)
            Ea = {}
            for k in range(K):
                z = mp.expj(al[k]*a); Ea[(1, k)] = z; Ea[(-1, k)] = mp.conj(z)
            tot = mp.mpc(0)
            for j in range(K):
                for k in range(K):
                    cc = mp.conj(c[j])*c[k]
                    if cc == 0: continue
                    sub = mp.mpc(0)
                    for e in (1, -1):
                        for f in (1, -1):
                            lam = e*al[j] + f*al[k]
                            if j == k and e == -f: val = (u - a)
                            else: val = (Eu[(e, j)]*Eu[(f, k)] - Ea[(e, j)]*Ea[(f, k)])/(1j*lam)
                            sub += e*f*Ea[(-f, k)]*val
                    tot += cc*(-sub/4)*(2/u)
            term = mp.log(p)/mp.sqrt(n)*mp.expj(-t*a)*tot
            Bz += term
            if p in S:
                if sg != 0: Bc += term*(-1)**m
            else: Bc += term
            n *= p; m += 1
    Qz = Lg - 2*(Bz/nrm).real; Qc = Lg - 2*(Bc/nrm).real
    r = dict(family=nm, t=w['t'], t_as_float64=bool(w.get('t_as_float64')), P=P, Q_ctl_ref=mp.nstr(Qc, 30), Q_zeta_ref=mp.nstr(Qz, 30), Q_ctl_lane=w['Q_ctl'], Q_zeta_lane=w['Q_zeta'],
             diff_ctl=float(abs(Qc - mp.mpf(w['Q_ctl_mid']))), diff_zeta=float(abs(Qz - mp.mpf(w['Q_zeta_mid']))),
             primes_of_S_below_P=sum(1 for p in S if p < P), seconds=time.time() - t0)
    print(json.dumps(r), flush=True); res.append(r)
rec = {nm: hashlib.sha256((','.join(map(str, sorted(S)))).encode()).hexdigest() for nm, S in SETS.items()}
json.dump(dict(dps=40, windows=res, sets_sha256_prefix_upto=PMAX, sets_sha256=rec), open(OUT, 'w'), indent=1)
print('DONE')
