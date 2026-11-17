# Rigorous zero counts by the argument principle (ball arithmetic).
# N_phi(T) = #zeros of F_phi with 0 < Im s < T (all real parts) = (theta(T) + Delta arg)/pi + pole term.
import sys, json, math
from lib import *
ctx.prec = 128
S0 = 8.0

def AB1(s):
    """(A, A', B, B') at acb s (possibly a wide ball), derivative in s."""
    x = acb_series([s, acb(1)], prec=2)
    z = x.zeta(); l20 = acb_series.dirichlet_l(x, CHI_M20); l5 = acb_series.dirichlet_l(x, CHI_5); l4 = acb_series.dirichlet_l(x, CHI_M4)
    A = (2 * z * l20).coeffs(); B = (2 * l5 * l4).coeffs()
    A += [acb(0)] * (2 - len(A)); B += [acb(0)] * (2 - len(B))   # exact zeros only if the true coefficient list is short
    return A[0], A[1], B[0], B[1]

def Fphi(s, c, sn, shift2=False, deriv=False):
    A, A1, B, B1 = AB1(s)
    v = A * c + B * sn; v1 = A1 * c + B1 * sn
    if shift2:
        e = (acb(2) ** s) / 2
        v1 = (v1 + v * arb(2).log()) * e; v = v * e
    return (v, v1) if deriv else v

def track(F, T):
    """continuous change of arg F along the segment from S0+iT to 1/2+iT, rigorous (mean-value enclosures)."""
    Tb = arb(T)
    total = arb(0); stack = [(S0, 0.5)]; npieces = 0
    while stack:
        hi, lo = stack.pop()
        mid = (hi + lo) / 2; rad = (hi - lo) / 2
        _, d = F(acb(arb(mid, rad * (1 + 1e-12)), Tb), True)
        vm = F(acb(arb(mid), Tb))
        v = vm + d * arb(0, rad * (1 + 1e-12))      # encloses F on the piece
        if not d.is_finite() or v.contains(0) or not (abs(v.mid()) > 4 * (v.real.rad() + v.imag.rad())):
            if hi - lo < 1e-12: raise RuntimeError('zero on path?')
            stack.append((mid, lo)); stack.append((hi, mid)); continue
        q = F(acb(arb(lo), Tb)) / F(acb(arb(hi), Tb))
        total += q.arg(); npieces += 1
    return total, npieces

def theta(T):
    s = acb(0.5, T)
    return (s.lgamma() + s * (arb(20).sqrt() / (2 * arb.pi())).log()).imag

def count(T, phi_name, c, sn, pole, shift2=False):
    sg = -1 if (not shift2 and (c + sn) < 0) else 1   # normalise the leading Dirichlet coefficient to be positive
    c = c * sg; sn = sn * sg
    F = lambda s, deriv=False: Fphi(s, c, sn, shift2, deriv)
    # start: arg F(S0+iT) principal (|F/lead - 1| < 1 on Re s = S0, checked crudely below)
    a0 = F(acb(S0, T)).arg()
    d, npc = track(F, T)
    tot = theta(T) + a0 + d
    if shift2: tot = tot - arb(T) * arb(2).log()   # arg of 2^{-s} factor removed above
    N = tot / arb.pi() + pole
    return N, npc

if __name__ == '__main__':
    out = {}
    Ts = [float(x) for x in sys.argv[1].split(',')]
    pi = arb.pi()
    cases = [('0 (A)', arb(1), arb(0), 1, False), ('pi/2 (B)', arb(0), arb(1), 0, False),
             ('pi/4 (Z1)', arb(1), arb(1), 1, False), ('3pi/4 (Z2)', arb(1), arb(-1), 1, True)]
    ks = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else range(1, 16)
    if len(sys.argv) > 3: cases = []
    for k in ks:
        if k in (4, 8, 12): continue
        ph = pi * k / 16
        cases.append(('%dpi/16' % k, ph.cos(), ph.sin(), 1, False))
    for T in Ts:
        for name, c, sn, pole, sh in cases:
            N, npc = count(T, name, c, sn, pole, sh)
            print(T, name, N.str(12), npc, flush=True)
            out['%s|%s' % (T, name)] = float(N.mid())
    json.dump(out, open('stage2_counts_%s.json' % sys.argv[2], 'w'), indent=1)
