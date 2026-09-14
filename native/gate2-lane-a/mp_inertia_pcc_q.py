#!/usr/bin/env python3
"""
imp-95217 — INERTIA x PAIR-CORRELATION Q measurement (mpmath reference lane).

Reads the 21 seam-point defect vectors produced by `./gate2 point w side N`
(imp-95217-points.json) and computes, at 50 dps:

  * the 18-mode moment system: orthonormal basis of span{1, u, ..., u^17}
    restricted to the 25 prime nodes u_j = ln(p_j)/ln(97), counting measure
    (the 18-moment carrier basis of imp-95008/imp-95012; the span is
    basis-independent, so power basis at 50 dps is exact enough here);
  * the Christoffel diagonal K(u_j) = sum_i phi_i(u_j)^2 (trace must be 18;
    each K(u_j) <= 1 because K is the diagonal of the orthogonal projection
    in R^25 onto the 18-dim moment span — the discrete-picture ceiling);
  * per seam point x_k: the compressed Weil-form analog
        A_k = Phi diag(Re D(x_k)) Phi^T   (18x18 real symmetric),
    i.e. the compression of the signed defect form
        <f,g>_k = sum_j Re(D_j(x_k)) f(u_j) g(u_j)
    onto the 18-moment span; its Sylvester inertia signature (n-, n0, n+)
    (frozen-rung negIndex machinery: n- >= 1 <=> the compressed detector
    fires, Kernels.lean one_le_negIndex_gram_of_modulus_gt_one pattern);
  * the mode coefficients c_k = Phi D(x_k) (complex 18-vector), the
    per-point attained pointwise constant
        qPure_k = max_j |<phi(u_j), c_k/||c_k||>|  (<= sqrt(max K) <= 1),
  * the ensemble mode density rho = sum_k c_k c_k^dagger / sum_k ||c_k||^2
    (PSD, trace 1) and its lambda_max — THE number imp-95020 Lemma H named
    as the one unmeasured arithmetic quantity;
  * the trace-inequality quotients against the imp-95008 Theorem G
    allowance 1.4326672 (closure of the pointwise step iff Q < allowance
    at unit unidentified weld constants C*sqrt(K)*||f||):
        qCS  = sqrt(max_j K(u_j))          (Cauchy-Schwarz ceiling)
        qVN  = sqrt(lambda_max(rho) * max_j K(u_j))   (von Neumann refined)
        qPure_k                            (per-seam-point attained value).

Measurement only. NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
"""
import json
import sys
from mpmath import mp, mpf, mpc, matrix, sqrt, log, eigsy, eighe, fabs

mp.dps = 50

PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
          53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
NP = 25
NM = 18
Q_ALLOWANCE = mpf('1.4326672')  # imp-95008 Theorem G: target / sqrt(S_bar) at p=97

def orthonormal_moment_system():
    """Two-pass Gram-Schmidt on the power basis {u^0..u^17} over the 25 nodes."""
    ln97 = log(97)
    us = [log(p) / ln97 for p in PRIMES]
    cols = [[u ** i for u in us] for i in range(NM)]  # NM x NP
    phis = []
    for i in range(NM):
        v = list(cols[i])
        for _ in range(2):
            for q in phis:
                s = sum(q[j] * v[j] for j in range(NP))
                v = [v[j] - s * q[j] for j in range(NP)]
        nrm = sqrt(sum(x * x for x in v))
        phis.append([x / nrm for x in v])
    # orthonormality residual
    gerr = mpf(0)
    for a in range(NM):
        for b in range(NM):
            g = sum(phis[a][j] * phis[b][j] for j in range(NP))
            gerr = max(gerr, fabs(g - (1 if a == b else 0)))
    return us, phis, gerr

def main():
    with open(sys.argv[1] if len(sys.argv) > 1 else 'imp-95217-points.json') as f:
        points = json.load(f)

    us, phis, gerr = orthonormal_moment_system()
    K = [sum(phis[i][j] ** 2 for i in range(NM)) for j in range(NP)]
    Ktrace = sum(K)
    Kmax = max(K)
    jmax = K.index(Kmax)

    # per-point analysis
    recs = []
    cs = []
    for p in points:
        # gate2 D[k] is in DESCENDING prime order 97..2; reorder ascending
        D = [mpc(p['D'][24 - j][0], p['D'][24 - j][1]) for j in range(NP)]
        # compressed Weil-form analog on the Hermitian (real) part
        A = matrix(NM, NM)
        for a in range(NM):
            for b in range(a, NM):
                s = sum(D[j].real * phis[a][j] * phis[b][j] for j in range(NP))
                A[a, b] = s
                A[b, a] = s
        ev = eigsy(A, eigvals_only=True)
        emax = max(fabs(e) for e in ev)
        tol = emax * mpf('1e-25')
        nneg = sum(1 for e in ev if e < -tol)
        npos = sum(1 for e in ev if e > tol)
        nzero = NM - nneg - npos
        # imaginary-part compression scale (honesty about the Hermitian split)
        Ai = matrix(NM, NM)
        for a in range(NM):
            for b in range(a, NM):
                s = sum(D[j].imag * phis[a][j] * phis[b][j] for j in range(NP))
                Ai[a, b] = s
                Ai[b, a] = s
        evi = eigsy(Ai, eigvals_only=True)
        eimax = max(fabs(e) for e in evi)
        # mode coefficients c = Phi D (complex 18-vector)
        c = [sum(D[j] * phis[i][j] for j in range(NP)) for i in range(NM)]
        cn2 = sum((x.real ** 2 + x.imag ** 2) for x in c)
        cn = sqrt(cn2)
        # per-point attained pointwise constant over the 25 nodes
        qpure = mpf(0)
        qj = -1
        for j in range(NP):
            ip = sum(c[i].conjugate() * phis[i][j] for i in range(NM))
            v = fabs(ip) / cn
            if v > qpure:
                qpure = v
                qj = j
        cs.append(c)
        recs.append({
            'N': p['N'], 'w': p['w'], 'side': p['side'],
            'absE97': p['E97']['abs'], 'pilot': p['pilot'],
            'inertia': [int(nneg), int(nzero), int(npos)],
            'eigMin': float(min(ev)), 'eigMax': float(max(ev)),
            'imagCompressionMax': float(eimax),
            'cNorm': float(cn), 'qPure': float(qpure),
            'qPureNode': PRIMES[qj],
            'evs': [float(e) for e in ev],
        })

    # ensemble mode density rho = sum c c^dagger / sum ||c||^2
    tot = sum(sum((x.real ** 2 + x.imag ** 2) for x in c) for c in cs)
    rho = matrix(NM, NM)
    for c in cs:
        for a in range(NM):
            for b in range(NM):
                rho[a, b] += c[a] * c[b].conjugate() / tot
    evr, _ = eighe(rho)
    lam = [evr[i].real for i in range(NM)]
    lam_max = max(lam)
    rho_trace = sum(lam)

    qCS = sqrt(Kmax)
    qVN = sqrt(lam_max * Kmax)
    worst_qpure = max(r['qPure'] for r in recs)

    out = {
        'gramErr': float(gerr),
        'nodes': [float(u) for u in us],
        'christoffel': {
            'diag': [float(k) for k in K],
            'trace': float(Ktrace),
            'max': float(Kmax),
            'argmaxPrime': PRIMES[jmax],
            'avg': float(Ktrace / NP),
            'concentration': float(Kmax / (Ktrace / NP)),
        },
        'rho': {
            'trace': float(rho_trace),
            'lambdaMax': float(lam_max),
            'spectrum': sorted([float(x) for x in lam], reverse=True),
        },
        'Q': {
            'allowance': float(Q_ALLOWANCE),
            'qCS': float(qCS),
            'qVN': float(qVN),
            'worstQPure': float(worst_qpure),
            'marginFactorCS': float(Q_ALLOWANCE / qCS),
            'marginFactorVN': float(Q_ALLOWANCE / qVN),
        },
        'points': recs,
    }
    print(json.dumps(out, indent=1))

if __name__ == '__main__':
    main()
