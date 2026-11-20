"""build_table.py -- all squarefree primary n of O coprime to 6 with N(n) <= X, with exact gamma_1, gamma_2, gamma_3.

n = pi_1 ... pi_k (primes in increasing table order); gamma_j(m pi) = (chi_m(pi) chi_pi(m))^j gamma_j(m) gamma_j(pi)
(CRT, paper proof of (4.7)); chi_m(pi) = R(pi, m) chi_pi(m) (Lemma 4.4, checked in selftest T4). A random subset is
re-checked against the direct product prod_{pi' | m} chi_pi'(pi).

Output npz: na, nb, N, g1, g2, g3, mu, m4, m9, parent, last, depth  (node 0 is n = 1).
Usage: python build_table.py X out.npz split1.bin [split2.bin ...] --inert inert.bin
"""
import sys, os, time, random
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z

def main():
    args = sys.argv[1:]
    X = int(float(args[0])); out = args[1]
    i = args.index('--inert'); splits = args[2:i]; inerts = args[i + 1:]
    t0 = time.time()
    PT = Z.PrimeTable(splits, inerts, X)
    objs = PT.prime_objs()
    q = [int(x) for x in PT.q]
    g = {j: PT.G[j] for j in (1, 2, 3)}
    print(f"primes: {PT.n} (inert {int(PT.inert.sum())}), {time.time() - t0:.1f}s", flush=True)
    na = [1]; nb = [0]; NN = [1]; parent = [-1]; last = [-1]; depth = [0]
    G1 = [1 + 0j]; G2 = [1 + 0j]; G3 = [1 + 0j]
    z6 = [complex(v) for v in Z.ZETA6]
    sq = Z._SQ
    stack = [0]
    nprime = PT.n
    while stack:
        node = stack.pop()
        a, b, N = na[node], nb[node], NN[node]
        sqn = sq[(a % 4, b % 4)]
        k = last[node] + 1
        while k < nprime and N * q[k] <= X:
            P = objs[k]
            if node == 0:
                c = 0
            else:
                kk = P.chi((a, b))
                if kk is None:            # cannot happen for distinct primes (inert q appears once)
                    k += 1; continue
                Rv = Z.r_bichar(sq[(P.pi[0] % 4, P.pi[1] % 4)], sqn)
                c = (2 * kk + (3 if Rv < 0 else 0)) % 6
            pa, pb = P.pi
            ca, cb = a * pa - b * pb, a * pb + b * pa - b * pb
            idx = len(na)
            na.append(ca); nb.append(cb); NN.append(N * q[k]); parent.append(node); last.append(k); depth.append(depth[node] + 1)
            G1.append(z6[c] * G1[node] * complex(g[1][k]))
            G2.append(z6[(2 * c) % 6] * G2[node] * complex(g[2][k]))
            G3.append(z6[(3 * c) % 6] * G3[node] * complex(g[3][k]))
            stack.append(idx)
            k += 1
    n = len(na)
    print(f"squarefree moduli: {n}, {time.time() - t0:.1f}s", flush=True)
    na = np.array(na, dtype=np.int64); nb = np.array(nb, dtype=np.int64)
    depth = np.array(depth, dtype=np.int8)
    m4 = np.array([Z._MOD4[(x % 4, y % 4)] for x, y in zip(na.tolist(), nb.tolist())], dtype=np.int8)
    m9 = (((na % 9 - 1) // 3) % 3 * 3 + ((nb % 9) // 3) % 3).astype(np.int8)
    assert ((na % 3 == 1) & (nb % 3 == 0)).all()
    # spot check of reciprocity-based cross symbol against direct products on random nodes
    random.seed(7); bad = 0; checked = 0
    par = parent; lst = last
    for node in random.sample(range(1, n), min(3000, n - 1)):
        pnode = par[node]
        if pnode == 0: continue
        P = objs[lst[node]]
        # factors of parent
        facs = []; t = pnode
        while t > 0:
            facs.append(objs[lst[t]]); t = par[t]
        kdirect = Z.chi_composite(facs, P.pi)
        krec = (P.chi((int(na[pnode]), int(nb[pnode]))) + (3 if Z.Rrec(P.pi, (int(na[pnode]), int(nb[pnode]))) < 0 else 0)) % 6
        bad += (kdirect != krec); checked += 1
    print(f"cross-symbol spot check: {checked} nodes, mismatches {bad}", flush=True)
    assert bad == 0
    np.savez(out, na=na, nb=nb, N=np.array(NN, dtype=np.int64), g1=np.array(G1), g2=np.array(G2), g3=np.array(G3),
             mu=((-1) ** depth).astype(np.int8), m4=m4, m9=m9, parent=np.array(parent, dtype=np.int32),
             last=np.array(last, dtype=np.int32), depth=depth, X=X,
             pa=PT.a, pb=PT.b, pp=PT.p, pq=PT.q, pinert=PT.inert, pw=PT.w, pg1=PT.G[1], pg2=PT.G[2], pg3=PT.G[3])
    print(f"saved {out}, {time.time() - t0:.1f}s", flush=True)

if __name__ == '__main__':
    main()
