# second task lists for the large Gram runs.  Sensitivity needs n hv >= about 4.5 (measured: heat tau = -0.2 fails first
# at n hv = 4.44), so the largest runs use hu_inv = 2048 (Nyquist abscissa 3217, height 1608) with n = 16384 (n hv = 8).
import json
json.dump([['gram', 'zeta', '0', 1, 16384, 2048], ['scan', 'zeta', '-0.1', 1700.0, 0.1, 1024]], open('gram_tasks_big.json', 'w'))
json.dump([['gram', 'zeta', '-0.05', 1, 16384, 2048], ['gram', 'zeta', '-0.1', 1, 8192, 1024], ['gram', 'zeta', '-0.2', 1, 8192, 1024],
           ['gram', 'dh', '0', 1, 8192, 1024], ['gram', 'chi-3', '0', 1, 8192, 1024], ['gram', 'zeta', '0', 1, 8192, 1024]], open('gram_tasks_mid.json', 'w'))
