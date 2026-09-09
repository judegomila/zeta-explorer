#!/usr/bin/env python3
"""
imp-95205 G1 spot-audit: replay the Lane-A dd evaluator's E97 / 25-defect
telescope at representative points of the N=690988 window in mpmath at
>= 160/192/256 bits, and compare against ./gate2 point output.

Two variants per point:
  ddmatch — chart constants (sigmaB, sigmaA, gamma) rounded to the exact
            doubles the C evaluator uses (isolates phase/summation error)
  exact   — chart constants computed at full working precision (measures
            the total numeric error of the dd lane against the real-number
            convention)
"""
import json, subprocess, sys, time
from mpmath import mp, mpf, mpc, cos, sin, exp, ln, sqrt, pi, floor, fabs

GATE2 = "/Users/USER/Documents/GitHub/mathexplorer/native/gate2-lane-a/gate2"
N = 690988
PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]

def build_cls(nmax):
    cls = bytearray(nmax + 1)  # 0 = coprime to all p<=97
    for i, p in enumerate(PRIMES):  # ascending -> smallest prime factor wins
        c = 25 - i
        for m in range(p, nmax + 1, p):
            if cls[m] == 0:
                cls[m] = c
    cls[1] = 0
    return cls

CLS = build_cls(N + 2)

def eval_point(w_num, w_den, side, dps, variant):
    mp.dps = dps
    t0 = mpf(24727519) / mpf(200000000)
    y = mpf(1809) / mpf(10000)
    M = N + side
    # window x (window of N=690988 regardless of chart side)
    q = mpf(N) ** 2 - t0 / 16 + (mpf(w_num) / mpf(w_den)) * (2 * N + 1)
    x = 4 * pi * q
    # chart M constants (frozen at landmark)
    qM = mpf(M) ** 2 - t0 / 16
    xM = 4 * pi * qM
    lnq = ln(qM)
    h = 1 - 3 * y + 4 * y * (1 + y) / xM ** 2
    sB = (1 + y) / 2 + (t0 / 4) * lnq - (t0 * h / (2 * xM ** 2) if h > 0 else 0)
    sA = sB - y
    gam = exp(mpf("0.02") * y - (y / 2) * lnq)
    if variant == "ddmatch":
        sB = mpf(float(sB)); sA = mpf(float(sA)); gam = mpf(float(gam))
    t04 = t0 / 4
    Y = x / (4 * pi)
    twopi = 2 * pi
    F = mpc(0); C = mpc(0)
    Sc = [mpc(0)] * 26
    for n in range(1, M + 1):
        if n == 1:
            cre = 1 + gam; cim = mpf(0)
        else:
            L = ln(n)
            fr = Y * L
            fr = fr - floor(fr)
            th = twopi * fr
            aB = exp((t04 * L - sB) * L)
            gA = gam * exp((t04 * L - sA) * L)
            cs = cos(th); sn = sin(th)
            cre = (aB + gA) * cs
            cim = (gA - aB) * sn
        c = mpc(cre, cim)
        F += c
        k = CLS[n]
        Sc[k] = Sc[k] + c
        if k == 0:
            C += c
    # A97 product
    A = mpc(1)
    ampP = {}
    for p in PRIMES:
        L = ln(p)
        fr = Y * L; fr = fr - floor(fr)
        th = twopi * fr
        amp = exp((t04 * L - sB) * L)
        ampP[p] = (amp, th)
        A *= (1 - amp * mpc(cos(th), -sin(th)))
    E = C - A * F
    # 25-defect telescope, descending primes 97..2
    G = Sc[0]
    ap = mpc(1)
    pil = mpf(0); tel = mpc(0)
    D = []
    for j in range(1, 26):
        p = PRIMES[25 - j]
        amp, th = ampP[p]
        qc = amp * mpc(cos(th), -sin(th))
        G = G + Sc[j]
        d = ap * (qc * G - Sc[j])
        pil += abs(d)
        tel += d
        D.append(d)
        ap = ap * (1 - qc)
    telErr = abs(tel - E)
    return {
        "absE97": abs(E), "E97": E, "pilot": pil, "telErr": telErr, "D": D,
        "sigmaB": sB, "sigmaA": sA, "gamma": gam,
    }

def c_point(w, side):
    out = subprocess.run([GATE2, "point", repr(w), str(side)],
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def audit(w_num, w_den, side, dps_list):
    w = w_num / w_den
    c = c_point(w, side)
    cE = mpf(c["E97"]["abs"]); cP = mpf(c["pilot"])
    print(f"== point w={w_num}/{w_den} side={side} (chart {N+side}) ==")
    print(f"   C(dd lane): |E97|={c['E97']['abs']:.17e} pilot={c['pilot']:.17e} telErr={c['telescopeErr']:.3e}")
    for dps in dps_list:
        for variant in ("ddmatch", "exact"):
            t0c = time.time()
            r = eval_point(w_num, w_den, side, dps, variant)
            dt = time.time() - t0c
            dE = abs(r["absE97"] - cE); dP = abs(r["pilot"] - cP)
            # max per-defect |D_j| deviation vs C
            maxD = mpf(0)
            for j in range(25):
                dre = abs(r["D"][j].real - mpf(c["D"][j][0]))
                dim = abs(r["D"][j].imag - mpf(c["D"][j][1]))
                maxD = max(maxD, dre, dim)
            bits = int(dps * 3.3219281)
            print(f"   mp dps={dps} (~{bits} bits) {variant:8s}: |E97|={mp.nstr(r['absE97'],20)} "
                  f"pilot={mp.nstr(r['pilot'],20)} telErr={mp.nstr(r['telErr'],3)} "
                  f"| dd-diff |E97|:{mp.nstr(dE,3)} pilot:{mp.nstr(dP,3)} maxD:{mp.nstr(maxD,3)} [{dt:.0f}s]")
    print()

if __name__ == "__main__":
    # G1 asks 160/192/256 bits: dps 50/60/80 at the first representative point,
    # dps 50 at the others.
    audit(0, 1, 0, [50, 60, 80])   # w=0 (x = x_N), own chart
    audit(1, 2, 0, [50])           # w=1/2 window center, own chart
    audit(1, 1, 1, [50])           # w=1 seam x_{N+1}, cross chart 690989
