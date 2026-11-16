# Alignment deficit for a probe measure w (symmetric pairs (h_i, +-x_i), weights w_i) at t = 0:
#   sum_i w_i S_i >= L W - (1/2) sum_n Lambda(n) |what(n)| + (1/2) Def_w(gamma),  Def_w = sum_{p<=p_k} a_p (1 - cos(gamma log p - phi_p)),
#   a_p = log p * p^{-1/2} |sum_i w_i p^{-h_i/2} cos((x_i/2) log p)|,  phi_p = 0 if the inner sum is > 0, pi otherwise.
import sys, json, mpmath as mp
from align2 import run, primes, Bguess
mp.mp.dps = 80
def joint(probes, k, target, fac, tsec=3000):
    X = mp.mpf(6000000185827); G0 = (X - 8)/2; G1 = (X*mp.e**fac + 8)/2
    ps = primes(k); a = []; sh = []
    for p in ps:
        v = sum(mp.mpf(w)*mp.mpf(p)**(-mp.mpf(h)/2)*mp.cos(mp.mpf(x)/2*mp.log(p)) for h, x, w in probes)
        a.append(mp.log(p)*mp.mpf(p)**(-mp.mpf(1)/2)*abs(v)); sh.append(0.0 if v > 0 else 0.5)
    B = Bguess(a, k, G0, G1, target)
    r = run(a, ps, G0, G1, B, tsec=tsec, shift=sh); r.update(fac=fac, target=target, probes=probes, nshift=int(sum(1 for s in sh if s)))
    return r
if __name__ == '__main__':
    probes = json.loads(sys.argv[1]); k = int(sys.argv[2]); target = float(sys.argv[3]); fac = float(sys.argv[4])
    print(json.dumps(joint(probes, k, target, fac)), flush=True)
