from pell import *
n = emp = 0; ex = []
for h in range(1, 81):
    for N1 in range(0, min(h, 40)+1):
        P = [[1], [N1-1, -1], [h-N1, 2-N1], [0, N1-1, -1], [0, 0, 1]]
        comps, Gy, crit = I_C(P, 2); n += 1
        if not comps and not I_C.iso:
            emp += 1
            if len(ex) < 6 and N1 >= 1: ex.append((N1, h))
print("formal genus-2 class data with 0<=N1<=min(h,40), 1<=h<=80:", n, "; empty I_C:", emp, "; examples:", ex)
