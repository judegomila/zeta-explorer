"""E_a stage with the correct heat time 1/(4 log M) (stage_controls.py used 1/(8 log M), which puts the reference line at 1/4;
those two rows are superseded). Sites (1+p^{-s-a})(1+p^{-s+a}), weights exp(-a l_{n1} + a l_{n2} + (l_{n1}+l_{n2})^2/(4L))."""
import numpy as np, itertools, json, importlib.util
spec = importlib.util.spec_from_file_location("sc", "stage_lib.py"); sc = importlib.util.module_from_spec(spec); spec.loader.exec_module(sc)
out = {}
for pr in ([2, 3, 5, 7, 11], [2, 3, 5, 7, 11, 13, 17]):
    l5 = np.log(np.array(pr, float)); L5 = l5.sum(); k = len(pr)
    o2 = np.array(list(itertools.product([0, 1], repeat=2 * k)), float); n1 = o2[:, :k] @ l5; n2 = o2[:, k:] @ l5
    for a in (0.2, 0.3, 0.4):
        print("de Bruijn pass range a^2 <= 1/(2L):", a * a, "<=", 1 / (2 * L5), a * a <= 1 / (2 * L5))
        out[f"Ea_{a}_P{pr[-1]}"], _ = sc.zeros_box(np.exp(-a * n1 + a * n2 + (n1 + n2) ** 2 / (4 * L5)), n1 + n2, label=f"E_a stage a={a}, primes<={pr[-1]}")
json.dump(out, open("ea_fix.json", "w"), indent=1)
