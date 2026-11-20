# Local sanity check of Lemma S (scalar collapse of the archimedean operator in a window) and of the
# polarisation identity for candidate (M). float64, numpy only. Run: scripts/memcap.sh 8 python3.14 check_collapse.py
import numpy as np, json, os, math
HERE = os.path.dirname(os.path.abspath(__file__))

def psi(z):
    z = np.asarray(z, dtype=complex); acc = np.zeros_like(z)
    for k in range(12):
        acc -= 1.0/(z + k)
    w = z + 12
    return acc + np.log(w) - 1/(2*w) - 1/(12*w**2) + 1/(120*w**4) - 1/(252*w**6) + 1/(240*w**8)

def G(x):  # G(1/2 + ix), G(s) = psi(s/2)/2 - log(pi)/2 ; Re G = theta'(x)
    return 0.5*psi(0.25 + 0.5j*np.asarray(x, dtype=float)) - 0.5*math.log(math.pi)

def prime_powers(P):
    out = []
    sieve = np.ones(P+1, dtype=bool); sieve[:2] = False
    for p in range(2, int(P**0.5)+1):
        if sieve[p]: sieve[p*p::p] = False
    for p in np.nonzero(sieve)[0]:
        q = int(p)
        while q < P:
            out.append((q, math.log(p))); q *= int(p)
    return out

def run(t, thp, tau, N=4096, pad=16):
    P = int(math.floor(t**thp)); u = math.log(P)
    ds = u/N; s = np.arange(N)*ds; M = N*pad
    print(f"planned allocation: {M} complex128 x ~6 arrays = {M*16*6/1e6:.1f} MB")
    h0f = lambda x: np.where((x >= 0) & (x <= u), np.sin(np.pi*np.clip(x, 0, u)/u)**4*np.exp(1j*tau*x), 0)
    h0 = h0f(s)
    buf = np.zeros(M, dtype=complex); buf[:N] = h0
    y = 2*np.pi*np.fft.fftfreq(M, d=ds)
    g0 = np.fft.fft(buf)*ds
    def mult(m):
        return (np.fft.ifft(m*g0)/ds)[:N]
    Gy = G(t + y)
    arch = mult(2*Gy.real); gcs = mult(np.conj(Gy))       # Arch h and Gamma_c^* h, demodulated, on [0,u]
    Ah = np.zeros(N, dtype=complex); nrmA = 0.0
    for n, lam in prime_powers(P):
        ln = math.log(n); c = lam/math.sqrt(n); nrmA += c
        Ah += c*np.exp(-1j*t*ln)*h0f(s - ln)
    ip = lambda a, b: np.sum(np.conj(a)*b)*ds
    n2 = ip(h0, h0).real
    hp = math.sqrt((np.sum(y**2*np.abs(g0)**2)*(y[1]-y[0])/(2*np.pi)).real)
    L = math.log(t/(2*np.pi)); Gt = complex(G(np.array([t]))[0])
    hAh = ip(h0, Ah)
    D1 = ip(arch, Ah) - L*hAh
    D2 = ip(gcs, Ah) - Gt*hAh
    D3 = ip(arch, arch).real - L*L*n2
    lhs = ip(arch - Ah, arch - Ah).real - ip(Ah, Ah).real
    rhs = L*(L*n2 - 2*hAh.real)
    eps = math.log(t)/t*hp
    bound = eps*(2*L + 4.2*math.sqrt(P))*math.sqrt(n2) + eps*eps
    return dict(t=t, theta=thp, tau=tau, P=P, u=u, Lg=L, G_t=[Gt.real, Gt.imag], norm2=n2, norm_h0prime=hp,
                sum_coeff=nrmA, hAh=[hAh.real, hAh.imag], normAh2=ip(Ah, Ah).real,
                first_order_form=(L*n2 - 2*hAh.real)/n2,
                D1=abs(D1), D2=abs(D2), D3=abs(D3), M_minus_Lg_first_order=lhs - rhs,
                bound_c1_eq_1=bound, ratio=abs(lhs - rhs)/bound)

rows = []
for t in (1e2, 1e3, 1e4, 1e5, 1e6):
    for thp in (0.5, 0.75, 0.95):
        for tau in (0.0, 3.0):
            r = run(t, thp, tau); rows.append(r)
            print({k: (f"{v:.4g}" if isinstance(v, float) else v) for k, v in r.items() if k not in ("G_t", "hAh")})
json.dump(rows, open(os.path.join(HERE, "check_collapse.json"), "w"), indent=1)
