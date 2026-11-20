"""Float64 screen (not a verdict): indicator-vector sub-device for E_a = zeta(s+a) zeta(s-a) on the prime side,
no lattice model. Vector h = e^(ist) 1_[0,u]/sqrt(u), u = theta log T. Device inequality (pole terms dropped):
  S_a(t) := 2 sum_{n < e^u} Lambda(n) n^(-1/2) (n^a + n^-a) (1 - log n/u) cos(t log n)  <=  2 log(t/2 pi) + 2M.
Reports max of S_a over t in [T-45, T+45] (step 0.01) and the fraction of t violating at M = 0."""
import numpy as np, math, json
T = 1e6
def mangoldt(N):
    lam = np.zeros(N + 1); sv = np.ones(N + 1, bool); sv[:2] = False
    for p in range(2, N + 1):
        if sv[p]:
            sv[p * p::p] = False
            q = p
            while q <= N:
                lam[q] = math.log(p); q *= p
    return lam
out = []
t = T + np.arange(-45, 45, 0.01)
for theta in (0.5, 0.8):
    u = theta * math.log(T); P = int(math.exp(u))
    lam = mangoldt(P); n = np.nonzero(lam)[0].astype(float); L = lam[lam > 0]; ln = np.log(n)
    print("theta", theta, "P", P, "terms", len(n), "planned array", len(n) * len(t) * 8 / 1e9, "GB", flush=True)
    C = np.cos(np.outer(t, ln))
    for a in (0.0, 0.05, 0.1, 0.2, 0.24, 0.28, 0.3, 0.45):
        w = 2 * L * n ** -0.5 * (n ** a + n ** -a) * (1 - ln / u)
        S = C @ w
        rhs = 2 * math.log(T / (2 * math.pi))
        rms_pred = math.sqrt(0.5 * np.sum(w ** 2))
        rec = dict(theta=theta, a=a, max_S=float(S.max()), min_S=float(S.min()), rms=float(S.std()), rms_pred=rms_pred, reserve_2Lg=rhs, frac_violating_M0=float((S > rhs).mean()))
        out.append(rec); print(json.dumps(rec), flush=True)
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
