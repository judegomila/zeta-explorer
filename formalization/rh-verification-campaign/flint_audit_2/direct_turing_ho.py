import sys
from fractions import Fraction as Fr
src = open('direct_turing.py').read().split("if __name__ == '__main__':")[0]
exec(src)
iv = load('../runs/HO_fix_t1_p128')
T = Fr(3000175332800); c = 12363153437138
print("zero ...138 interval:", float(iv[c][0]), float(iv[c][1]), " zero ...139 interval:", float(iv[c+1][0]), float(iv[c+1][1]))
s, zval = zsign(T)
print("sign Z(3000175332800) =", s, zval, " parity consistent with N = 12363153437138:", s == (1 if (c - 1) % 2 == 0 else -1))
for H in (10, 20, 40):
    m = certify(iv, c, T, H)
    print(f"H={H}: [refute N>=c+2] {m['up+2'].str(5,radius=False)}  [refute N<=c-2] {m['low-2'].str(5,radius=False)}   no parity: {m['up+1'].str(5,radius=False)}, {m['low-1'].str(5,radius=False)}")
