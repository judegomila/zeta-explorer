"""Backward zero flow with regularised pairs (lane s6-field-channel-omitted-zero-kernel).

Flow (source convention): dz_k/dt = -2 sum_{j != k} 1/(z_k - z_j), complex z allowed (conjugate pairs = zeros off the line).
A set of disjoint pairs (i, j) per system is carried as (c, u) = ((z_i + z_j)/2, (z_j - z_i)^2):
   dc/dt = -2 sum_b (c - b)/((c - b)^2 - u/4),      du/dt = -8 + 4 u sum_b 1/((c - b)^2 - u/4),      b over all other particles,
which is regular through u = 0 (collision of the pair; afterwards u < 0 and the pair is conjugate).  No square root enters a derivative.
Far zeros enter as a frozen linear field per particle: velocity F0 + F1 (z - zref),  F0 = -2 sum 1/(zref - y), F1 = 2 sum 1/(zref - y)^2;
for a pair: dc += F0 + F1 (c - cref), du += 2 F1 u.
Arrays carry a leading batch axis B.  State S = [zs (B, ns) | c (B, npair) | u (B, npair)], complex128."""
import numpy as np

class RegFlow:
    def __init__(self, Z0, pairs, F0=None, F1=None, xp=np):
        """Z0 (B, n) complex positions; pairs (B, npair, 2) int indices (disjoint per system)."""
        self.xp = xp
        Z0 = xp.asarray(Z0, dtype=xp.complex128); self.B, self.n = Z0.shape
        self.P = xp.asarray(pairs, dtype=xp.int64); self.npair = self.P.shape[1]
        mask = xp.ones((self.B, self.n), bool)
        if self.npair:
            xp.put_along_axis(mask, self.P.reshape(self.B, -1), False, axis=1)
        self.ns = self.n - 2 * self.npair
        self.Sidx = xp.argsort(~mask, axis=1, kind='stable')[:, :self.ns]          # indices of the singles
        zs = xp.take_along_axis(Z0, self.Sidx, axis=1)
        zi = xp.take_along_axis(Z0, self.P[:, :, 0], axis=1); zj = xp.take_along_axis(Z0, self.P[:, :, 1], axis=1)
        self.S = xp.concatenate([zs, 0.5 * (zi + zj), (zj - zi) ** 2], axis=1)
        self.zref_s = zs.copy(); self.cref = 0.5 * (zi + zj)
        self.F0 = None
        if F0 is not None:
            F0 = xp.asarray(F0, dtype=xp.complex128); F1 = xp.asarray(F1, dtype=xp.complex128)
            self.F0s = xp.take_along_axis(F0, self.Sidx, axis=1); self.F1s = xp.take_along_axis(F1, self.Sidx, axis=1)
            # pair: field linearised at the pair centre (mean of the two members' values)
            self.F0p = 0.5 * (xp.take_along_axis(F0, self.P[:, :, 0], axis=1) + xp.take_along_axis(F0, self.P[:, :, 1], axis=1))
            self.F1p = 0.5 * (xp.take_along_axis(F1, self.P[:, :, 0], axis=1) + xp.take_along_axis(F1, self.P[:, :, 1], axis=1))
            self.F0 = True
        self.t = 0.0; self.nev = 0
        ar = xp.arange(self.n)
        self.eye = (ar[None, :] == ar[:, None])[None, :, :]
        own = xp.zeros((self.B, max(self.npair, 1), self.n), bool)
        if self.npair:
            xp.put_along_axis(own, self.P, True, axis=2)
        self.own = own[:, :self.npair]

    def split(self, S): return S[:, :self.ns], S[:, self.ns:self.ns + self.npair], S[:, self.ns + self.npair:]

    def positions(self, S):
        xp = self.xp; zs, c, u = self.split(S)
        Z = xp.empty((self.B, self.n), dtype=xp.complex128)
        xp.put_along_axis(Z, self.Sidx, zs, axis=1)
        if self.npair:
            q = xp.sqrt(u) / 2
            xp.put_along_axis(Z, self.P[:, :, 0], c - q, axis=1); xp.put_along_axis(Z, self.P[:, :, 1], c + q, axis=1)
        return Z

    def rhs(self, S):
        xp = self.xp; self.nev += 1
        zs, c, u = self.split(S); Z = self.positions(S)
        out = xp.empty_like(S)
        if self.ns:
            D = zs[:, :, None] - Z[:, None, :]
            self_mask = (self.Sidx[:, :, None] == xp.arange(self.n)[None, None, :])
            D = xp.where(self_mask, xp.inf, D)
            v = -2 * (1 / D).sum(2)
            if self.F0: v = v + self.F0s + self.F1s * (zs - self.zref_s)
            out[:, :self.ns] = v
        if self.npair:
            Dc = c[:, :, None] - Z[:, None, :]
            den = Dc * Dc - u[:, :, None] / 4
            inv = xp.where(self.own, 0, 1 / xp.where(self.own, 1, den))
            dc = -2 * (Dc * inv).sum(2); du = -8 + 4 * u * inv.sum(2)
            if self.F0: dc = dc + self.F0p + self.F1p * (c - self.cref); du = du + 2 * self.F1p * u
            out[:, self.ns:self.ns + self.npair] = dc; out[:, self.ns + self.npair:] = du
        return out

    def rk4(self, h, S=None):
        S = self.S if S is None else S
        k1 = self.rhs(S); k2 = self.rhs(S + 0.5 * h * k1); k3 = self.rhs(S + 0.5 * h * k2); k4 = self.rhs(S + h * k3)
        return S + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4)

    # Dormand-Prince 5(4), one common step for the batch
    A = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
         [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]]
    B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0]
    B4 = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40]

    def run_until_collision(self, tmax, rtol=1e-11, scale=1.0, dt0=None, maxsteps=20000, stop_pairs=None):
        """B = 1.  Integrates until the first regularised pair with real u > 0 reaches u = 0.  Returns (t_c, pair index) or (None, None)."""
        xp = self.xp; S = self.S; t = 0.0; dt = dt0 or tmax / 50
        k1 = self.rhs(S); iu = slice(self.ns + self.npair, None); nst = 0
        while t < tmax and nst < maxsteps:
            h = min(dt, tmax - t); ks = [k1]
            for i in range(1, 7):
                ks.append(self.rhs(S + h * sum(a * k for a, k in zip(self.A[i], ks) if a != 0)))
            S5 = S + h * sum(b * k for b, k in zip(self.B5, ks) if b != 0)
            e = h * sum((b5 - b4) * k for b5, b4, k in zip(self.B5, self.B4, ks))
            sc = rtol * xp.maximum(xp.abs(S), xp.abs(S5)); sc[:, :self.ns + self.npair] = rtol * scale
            sc[:, self.ns + self.npair:] = xp.maximum(sc[:, self.ns + self.npair:], rtol * 1e-3 * abs(self.S[:, iu]).max())
            err = float(xp.max(xp.abs(e) / sc))
            if not np.isfinite(err): err = 1e9
            if err <= 1.0:
                u0 = S[0, iu].real; u1 = S5[0, iu].real; cross = (u0 > 0) & (u1 <= 0)
                if stop_pairs is not None: cross = cross & xp.asarray(stop_pairs)
                if bool(cross.any()):
                    best = None
                    for p in np.nonzero(np.asarray(cross))[0]:
                        a0 = float(u0[p]); a1 = float(u1[p]); d0 = float(k1[0, iu][p].real); d1 = float(ks[6][0, iu][p].real)
                        th = a0 / (a0 - a1)
                        for _ in range(40):
                            h00 = 2 * th ** 3 - 3 * th ** 2 + 1; h10 = th ** 3 - 2 * th ** 2 + th; h01 = -2 * th ** 3 + 3 * th ** 2; h11 = th ** 3 - th ** 2
                            f = h00 * a0 + h10 * h * d0 + h01 * a1 + h11 * h * d1
                            fp = (6 * th ** 2 - 6 * th) * a0 + (3 * th ** 2 - 4 * th + 1) * h * d0 + (-6 * th ** 2 + 6 * th) * a1 + (3 * th ** 2 - 2 * th) * h * d1
                            th = min(1.0, max(0.0, th - f / fp))
                        if best is None or t + h * th < best[0]: best = (t + h * th, int(p))
                    self.S = S5; self.t = t + h; self.steps = nst
                    return best
                t += h; S = S5; k1 = ks[6]; nst += 1
            dt = h * min(5.0, max(0.2, 0.9 * (1.0 / max(err, 1e-10)) ** 0.2))
        self.S = S; self.t = t; self.steps = nst
        return None, None

def greedy_pairs(x, npair, must=None, gmax=None):
    """indices of npair disjoint adjacent pairs of the sorted real array x, smallest gaps first; `must` (index l of pair (l, l+1)) is taken first.
    gmax: only gaps below gmax (besides `must`)."""
    d = np.diff(x); order = list(np.argsort(d)); used = set(); out = []
    if must is not None: order = [must] + [o for o in order if o != must]
    for l in order:
        if l in used or (l + 1) in used: continue
        if gmax is not None and l != must and d[l] >= gmax: break
        out.append((int(l), int(l) + 1)); used.add(l); used.add(l + 1)
        if len(out) == npair: break
    return out
