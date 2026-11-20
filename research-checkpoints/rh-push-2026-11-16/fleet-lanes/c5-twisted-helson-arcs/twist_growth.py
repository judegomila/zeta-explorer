"""Growth of the twisted-sum error max_a |T(x;a/q) - c_q x| across checkpoints; c_q fitted from prediction."""
import sys, json, math, cmath
pre = sys.argv[1]; d = json.load(open(pre + ".json")); c = d["c"]; b = d["b"]
mode = d.get("mode", "greedy")
rows = {}
for line in open(pre + "_twist.txt"):
    f = line.split(); x = int(f[0]); q = int(f[1]); R = [int(v) for v in f[2:]]
    Ts = [sum(R[r] * cmath.exp(2j * math.pi * a * r / q) for r in range(q)) for a in range(1, q) if math.gcd(a, q) == 1]
    rows.setdefault(q, []).append((x, Ts))
Sset = set(d.get("S_small", []))
def cq(q):
    v = c; n = q; p = 2
    while n > 1:
        if n % p == 0:
            k = 0
            while n % p == 0: n //= p; k += 1
            if p not in Sset: return 0.0
            v *= (2 * (-1) ** k * p ** (-k) / (1 + 1 / p)) / ((p - 1) / (p + 1))
        p += 1
    return v
print(f"{pre}: b={b}; columns: x, max_a|T - c_q x|, then slope between successive checkpoints")
for q, lst in rows.items():
    pred = cq(q); prev = None; out = []
    for x, Ts in lst:
        dev = max(abs(T - pred * x) for T in Ts)
        s = "" if prev is None else f"[{math.log(dev/prev[1])/math.log(x/prev[0]):.2f}]"
        out.append(f"{x:.0e}:{dev:.3g}{s}"); prev = (x, dev)
    print(f" q={q:3d} c_q={pred:+.6f} " + " ".join(out))
