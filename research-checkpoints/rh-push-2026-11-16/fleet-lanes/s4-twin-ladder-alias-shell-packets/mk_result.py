"""mk_result.py -- assemble RESULT.md from the hand-written parts and the generated tables"""
parts = ["part_head.md", "part_defs.md", "part_valid.md", "part_why.md", "part_sizes.md"]
out = "\n".join(open(p).read().rstrip() + "\n" for p in parts)
out += "\n### T1. Combination 1: sign of E_y(N, A, c); counts are (number of N with Re E > 0) / (number with Re E < 0) / (sign changes along increasing N)\n\nNatural A: prod_{p <= y}(1 - a_F(p)/p) (for T-NR the density ratio). SGNy_s: hash signs on the sieving primes only, seed s. UNIy: hash phases on the sieving primes (y = 97 only, N <= 1e12).\n" + open("an1.md").read()
out += "\n### T2. Combination 2\n\n" + open("an2.md").read()
out += "\n### T3. Combination 3 (and the OU tail energy of combination 4)\n" + open("an3.md").read()
out += "\n### T4. Combination 4\n\n" + open("an4.md").read()
out += "\n## 6. Files\n\nCode: `s4.c` (engine), `s4lib.py`, `run1.py`, `run2.py`, `run3.py`, `run4.py`, `g_fft.py`, `cov4.py`, `validate.py`, `an3_check.py`, `check2.py`, `synth3.py`, analysis `an1.py` .. `an4.py`, `merge_sieve.py`, `mk_result.py`. Data: `c1A_*.json`, `c1_sieve.npz`, `c1_fft.json`, `c1_fft20.json`, `c2.json`, `c2b.json`, `c2m.json`, `c3_p0.pkl`, `c3_p1.pkl`, `c4.pkl`, `c4_cov.json`; summaries `an1.json` .. `an4.json`, `validate.json`, `validate_server.json`, `validate_cap.json`, `check2.json`, `synth3.json`.\n"
open("RESULT.md", "w").write(out); print(len(out))
