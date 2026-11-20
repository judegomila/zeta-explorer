# Theorem A bracket for zeta, for unimodular twists and for the DH coefficient sequence, on a family of two-delay lossless h.
#   zeta:      H(0) + conj H(2^-1/2, 3^-1/2)                       real part >= Re H(0) > 0   (point evaluation inside the bidisc)
#   twist a_p: H(0) + conj H(conj(a_2) 2^-1/2, conj(a_3) 3^-1/2)    same sign control
#   DH:        H(0) + c1 conj H(chibar) + c2 conj H(chi)            not a point evaluation; sign not controlled
import cmath, math, json
kap = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1); c1, c2 = (1-1j*kap)/2, (1+1j*kap)/2
def b(w1, w2): return (2*w1*w2 - w1 - w2)/(2 - w1 - w2)
def H(w1, w2, phi, psi1, psi2):       # rotate the inner function's arguments as well
    u = cmath.exp(1j*phi)*b(cmath.exp(1j*psi1)*w1, cmath.exp(1j*psi2)*w2); return (1+u)/(1-u)
r2, r3 = 2**-0.5, 3**-0.5
best = {'zeta': (9, None), 'DH': (9, None)}
N = 60
for i in range(N):
    for j in range(N):
        for k in range(N):
            phi, p1, p2 = 2*math.pi*i/N, 2*math.pi*j/N, 2*math.pi*k/N
            h0 = H(0, 0, phi, p1, p2)
            z = (h0 + H(r2, r3, phi, p1, p2).conjugate()).real/h0.real
            d = (h0 + c1*H(-1j*r2, 1j*r3, phi, p1, p2).conjugate() + c2*H(1j*r2, -1j*r3, phi, p1, p2).conjugate()).real/h0.real
            if z < best['zeta'][0]: best['zeta'] = (z, (phi, p1, p2))
            if d < best['DH'][0]: best['DH'] = (d, (phi, p1, p2))
print(best); json.dump(best, open('test5.json', 'w'))
