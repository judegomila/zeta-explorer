# theta relation for ZQ (pair 2,3; eta = 0.1) printed with both sides; also what the relation gives if r/2 is replaced by 1/2 (zeta's value)
import json, mpmath as mp
exec(open("ref_check.py").read().split("out = {}")[0])
mp.mp.dps = 25
m, poles = setup("ZQ", 2, mp.mpf('0.1')); r = mp.re(m(1))
def Theta(y, X=40):
    s = mp.fsum(mp.exp(-mp.pi*n*n*y) for n in range(1, X))
    return s + mp.fsum(mp.quad(lambda x: mp.exp(-mp.pi*x*x*y)*A_of(poles, x), [n, n+half, n+1]) for n in range(1, X))
res = []
for y in ["0.5", "0.7", "1.6", "3.1"]:
    y = mp.mpf(y); a = Theta(y) + r/2; b = (Theta(1/y) + r/2)/mp.sqrt(y)
    dens = Theta(y) - mp.fsum(mp.exp(-mp.pi*n*n*y) for n in range(1, 40))
    res.append({"y": float(y), "lhs": mp.nstr(a, 22), "rhs": mp.nstr(b, 22), "defect": mp.nstr(abs(a-b), 5), "density_part_of_Theta": mp.nstr(dens, 10),
                "defect_if_r_were_1": mp.nstr(abs(Theta(y) + half - (Theta(1/y) + half)/mp.sqrt(y)), 5)})
json.dump({"r": mp.nstr(r, 20), "rows": res}, open("ref_theta.json", "w"), indent=1); print(json.dumps(res, indent=1))
