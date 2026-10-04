import sys
sys.argv = ['x', '../runs/V1_fix_t1_p128_m2500_b520']
src = open('direct_turing.py').read().split("if __name__ == '__main__':")[0]
exec(src)
iv = load(sys.argv[1])
for (c, nm) in [(33328427938873, 'b_{...873} (just below zero ...874)'), (33328427960538, 'b_{...538} (top of original window)')]:
    T = iv[c][1]
    assert iv[c+1][0] >= T
    s, zval = zsign(T)
    par_ok = (s == (1 if (c - 1) % 2 == 0 else -1))
    m = certify(iv, c, T, 10)
    print(f"T = {float(T):.10f} [{nm}]  claimed N(T) = {c}  sign Z = {s:+d}  parity consistent: {par_ok}  H=10 margins: "
          f"[N>=c+2] {m['up+2'].str(5,radius=False)}  [N<=c-2] {m['low-2'].str(5,radius=False)}  (no parity: {m['up+1'].str(5,radius=False)}, {m['low-1'].str(5,radius=False)})")
