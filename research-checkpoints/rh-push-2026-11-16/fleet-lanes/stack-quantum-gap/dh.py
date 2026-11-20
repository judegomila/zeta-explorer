# DH control. (1) poles of S_DH near the four off-line zeros to height 200, quanta, Blaschke factors, alpha-sweep.
# (2) windowed Lawson approximation: DH (floor predicted by the window theorem) versus zeta (no floor).
# (3) Poisson-L1 averages of |S_DH - h| at the pole for simple h.   MEASURED.
import sys, numpy as np, mpmath as mp
from multiprocessing import Pool
from common import L_dh, L_z, Ldh_axis, Lz_axis
mp.mp.dps = 20
OFF = [(0.808517, 85.699348), (0.650830, 114.163343), (0.574356, 166.479306), (0.724258, 176.702461)]
def pole(alpha, guess):
    # damped Newton on 1 + alpha L(z) = 0 (L' by a central difference); step capped at 0.02
    z = mp.mpc(guess); h = mp.mpf('1e-7')
    for _ in range(200):
        f = 1+alpha*L_dh(z); d = alpha*(L_dh(z+h)-L_dh(z-h))/(2*h)
        dz = f/d
        if abs(dz) > 0.02: dz = dz/abs(dz)*mp.mpf('0.02')
        z = z - dz
        if abs(dz) < 1e-14: break
    else:
        raise RuntimeError("no convergence")
    if z.real <= 0: raise RuntimeError("left the half-plane")
    r = 2/(alpha*(L_dh(z+h)-L_dh(z-h))/(2*h))
    return complex(z), complex(r)
def L_dh_shift(a):
    t, sg = a
    return complex(L_dh(mp.mpc(sg, t)))
def lawson(target, wt, th, K, iters=300):
    A = np.exp(1j*np.outer(th, np.arange(K)))*wt[:, None]; b = target*wt
    w = np.ones(len(th))/len(th); best = (9, None)
    for it in range(iters):
        sw = np.sqrt(w)
        c = np.linalg.lstsq(A*sw[:, None], b*sw, rcond=None)[0]
        e = np.abs(b - A@c)
        if e.max() < best[0]: best = (e.max(), c)
        w = w*e; w /= w.sum()
    return best
if __name__ == "__main__":
    print("== 1. DH poles of S in Re z>0, local quantum |r|/(2 Re z), alpha sweep (Lam_DH = 0.5 log(5T/2pi))")
    alphas = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 100, 1000]
    table = {}
    for (sg, g) in OFF:
        beta = sg-0.5; Lam = 0.5*np.log(5*g/(2*np.pi))
        print(f"   zero {sg}+{g}i  beta={beta:.6f}  Lam={Lam:.4f}  beta*Lam={beta*Lam:.4f}")
        guess = mp.mpc(beta - 0.008, g)
        for al in alphas:
            try:
                z, r = pole(mp.mpf(al), guess); guess = mp.mpc(z)
                q = abs(r)/(2*z.real); table[(g, al)] = (z, r, q)
                a = al/(1+al*Lam)
                print(f"      alpha={al:<6} z_j={z.real:.8f}+{z.imag:.6f}i  |r_j|={abs(r):.6e}  quantum={q:.6f}   isolated-pair alpha/sqrt(alpha^2+beta^2)={al/np.hypot(al,beta):.6f}   mean-field={al/((1+al*Lam)**2*np.hypot(beta,a)):.6f}")
            except Exception as ex:
                print(f"      alpha={al}: root-finding failed ({ex})"); break
        sys.stdout.flush()
    print("== 1b. Blaschke factor over the other known poles (4 zeros and conjugates), per alpha")
    for al in (0.3, 1):
        zs = [table[(g, al)][0] for (_, g) in OFF if (g, al) in table]; zs = zs + [np.conj(z) for z in zs]
        for j in range(len(zs)//2):
            bl = np.prod([abs((zs[j]-zk)/(zs[j]+np.conj(zk))) for k, zk in enumerate(zs) if k != j])
            q = table[(OFF[j][1], al)][2]
            print(f"      alpha={al} pole {j}: quantum {q:.6f} x Blaschke {bl:.8f} = {q*bl:.6f}")
    # ---------- 2. windowed Lawson ----------
    y0, a, N, half = 85.72, 5.0, 4096, 5.0
    th = 2*np.pi*(np.arange(N)+0.5)/N; t = y0 + a/np.tan(th/2)
    inner = np.abs(t-y0) <= half
    with Pool(8) as pool:
        Ldh = np.array(pool.map(Ldh_axis, [float(x) for x in t[inner]], chunksize=16))
        Lz = np.array(pool.map(Lz_axis, [float(x) for x in t[inner]], chunksize=16))
    np.save("dh_L_axis.npy", np.vstack([t[inner], Ldh, Lz]))
    print(f"== 2. windowed approximation on I' = [{y0-half}, {y0+half}]: minimise max( sup_I' |S-h| , lam * sup_outside |h| ), h polynomial of degree <K in ((z-iy0)-a)/((z-iy0)+a), a={a}")
    for al in (1.0, 0.3):
        z1, r1, q1 = table[(OFF[0][1], al if al != 1.0 else 1)]
        om = (np.arctan((y0+half-z1.imag)/z1.real) - np.arctan((y0-half-z1.imag)/z1.real))/np.pi
        for lam in (0.1, 0.3):
            floor = (q1 - (1-om))/(om + (1-om)/lam)
            print(f"   alpha={al} lam={lam}: DH pole {z1.real:.6f}+{z1.imag:.6f}i quantum {q1:.6f}, harmonic measure of I' = {om:.6f}; window-theorem floor for the objective = {floor:.6f}")
            for name, LL in (("DH", Ldh), ("zeta", Lz)):
                S = (1-al*LL)/(1+al*LL)
                target = np.zeros(N, complex); target[inner] = S
                wt = np.where(inner, 1.0, lam)
                for K in (50, 100, 200, 400):
                    E, c = lawson(target, wt, th, K)
                    h = np.exp(1j*np.outer(th, np.arange(K)))@c
                    Ein = np.abs(S-h[inner]).max(); M = np.abs(h).max()
                    # Poisson-L1 at the DH pole location (window part only)
                    kern = (z1.real/np.pi)/((t-z1.imag)**2+z1.real**2); dt = a/(2*np.sin(th/2)**2)*(2*np.pi/N)
                    pin = (np.abs(S-h[inner])*kern[inner]*dt[inner]).sum()
                    print(f"      {name:<5} K={K:<4} objective={E:.6f}  sup_I'|S-h|={Ein:.6f}  sup_axis|h|={M:.4f}  Poisson-L1 over I' at DH pole={pin:.6f}  [necessary: Ein*om+(1+M)(1-om) = {Ein*om+(1+M)*(1-om):.6f} >= q]")
                    sys.stdout.flush()
    print("== 3. Poisson-L1 average over I' of |S_DH - h| at the pole, simple candidates (alpha=1)")
    al = 1.0; z1, r1, q1 = table[(OFF[0][1], 1)]
    S = (1-al*Ldh)/(1+al*Ldh); ti = t[inner]
    kern = (z1.real/np.pi)/((ti-z1.imag)**2+z1.real**2); dt = (a/(2*np.sin(th/2)**2)*(2*np.pi/N))[inner]
    with Pool(8) as pool:
        for sgm in (0.7, 0.3, 0.05):
            Lsh = np.array(pool.map(L_dh_shift, [(float(x), sgm) for x in ti], chunksize=16))
            h = (1-al*Lsh)/(1+al*Lsh)
            print(f"      h=S_DH(z+{sgm}) : sup_I'|S-h|={np.abs(S-h).max():.4f}  Poisson-L1={ (np.abs(S-h)*kern*dt).sum():.6f}  (quantum {q1:.6f}; H^inf iff sigma>0.6204)")
    print(f"      h=0 : Poisson-L1={(np.abs(S)*kern*dt).sum():.6f}")
