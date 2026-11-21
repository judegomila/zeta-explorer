# REFEREE: gaussian-proxy (second pass, 2026-11-21)

Verdict on the first reviewer: not faulted on the main call (confirmed-weaker-statement, known, importance 1).
Three corrections: (1) literature "not found verbatim" is wrong, the identity is in Polymath15 as stated;
(2) "counts agree" for the Z-proxy is window-contingent, shown below; (3) "merger times right" is right to 1.3e-3, not exactly.

## What I ran (all through scripts/memcap.sh 8; about 2 min total; scripts in referee/)
The first reviewer's t1/t2 were their own scripts, not a replay of repository code, so that pass was already independent of the repo.
Mine differ from theirs in method:

r1.py (mpmath 30 digits, Gauss-Legendre quad instead of trapezoid table)
- First merger located as a double zero by 2-D Newton on (H, H_x) = 0 in (x, t):
  t_c = -1.87790907297254, x_c = 99.3284693055758 (gamma 49.66423), residuals 2.6e-39, 7.4e-41.
  First reviewer -1.8779 (grid bisection): agrees. Repo headline -1.8837 off by 0.0058; repo census -1.8782 and tLand -1.87842 off by 3e-4 and 5e-4.
- xi-side Gaussian convolution (zeta/gamma route, no Phi) evaluated at that double zero with tau = -t_c:
  value/ref = 4.8e-22, x-derivative/ref = 5.7e-21. The convolution has the double zero at the same point.
- Identity at new points: tau=0.47,x=99.26 rel err 5.2e-22; tau=3,x=45: 0.0; tau=8,x=80: 8.3e-27. Wrong sign H_{+tau}: 3.33, 0.76, 0.38.
- Complex zero at t=-2.1: 99.51494 + 0.67387i (repo 99.514 + 0.6757i). de Bruijn bound t0 + Im^2/2 = -1.87295 >= t_c. Consistent.
- Z-proxy merger by extremum-sign bisection: tau_c = 0.46915, -4 tau_c = -1.87662; differs from exact by +0.00129 (first reviewer -1.8766). Merger position offset -0.7022 gamma vs predicted -0.7039.
- Boundary counterexample: first zero 27.980187 (t=0.5), 27.692039 (t=1). Window [27.70, 28.70] loses its zero. Confirmed.

r2c.py (50 digits; r2.py and r2b.py are superseded: float-rounded quadrature nodes broke trapezoid accuracy above gamma ~ 58; kept for the record, do not cite)
Z-proxy vs exact H_{-4 tau} real zeros, gamma in [8,80], tau up to 5 (first reviewer stopped at tau=2, window [10,52] only):
- window [10,52]: exact/proxy = 10/10, 6/6, 4/4, 4/4, 2/2 at tau = 0.25, 1, 2, 3, 5.
- window [10,80]: 21/21, 11/11, 6/7, 6/7, 4/5. Counts differ at tau >= 2.
- Zeros correspond one-to-one with proxy shift about -1.45 tau (tau=5: 20.30->13.75, 46.60->39.20, 60.35->52.85, 64.10->56.55).
- The [10,52] agreement is contingent: at tau = 2, 3, 5 a proxy zero sits at 52.50, 52.45, 52.85. Upper edge 53 instead of 52 gives proxy 5/5/3 against exact 4/4/2.
  So the module's "Z-convolution ladder MATCHES the exact count at every tested point" is a property of the chosen window, not of the proxy.

## Literature (own searches: 4 searches, 2 fetches)
- Polymath15, arXiv:1904.12438, Theorem 3.2 states the strip result and cites de Bruijn "[5, Theorem 13]" (read from the ar5iv text through a summarising fetch; a 2026 arXiv preprint also cites (y^2)' <= -2 as de Bruijn Theorem 13). The first reviewer's open item (5) is closed: the number is right.
- Same paper, section 4: H_t(z) = int H_0(z - 2 i sqrt(t) v) e^{-v^2}/sqrt(pi) dv, described in the introduction as "a convolution of H_0 with a gaussian heat kernel". For t = -tau < 0 the shift 2 i sqrt(t) is real and this is exactly the claim. So the identity is in the literature in this form; "did not find a source phrasing it" should be dropped.
- Rodgers-Tao arXiv:1801.05914 and Csordas-Smith-Varga: zero dynamics under the backward heat equation, including zeros leaving the real line as t decreases.
- Nothing found, or expected, on the Z-function variant; it is an implementation detail.

## Scores
- verification: confirmed-weaker-statement (unchanged). The listed sentence is false for the implemented proxy; true for convolution of H_0.
- novelty: known (unchanged, now with a direct source).
- arbitrariness: 2 (unchanged). Identity is canonical (1 on its own); window, Z-for-Xi, factor 4 are choices, and the window choice is what makes proxy counts match.
- importance: 1 (unchanged). An expert would shrug: Polymath15 section 4 read at negative t. No constraint on Lambda or RH.
- status label: numerical evidence kept. The identity is a proved classical fact, but everything the repository adds (proxy counts, merger times) is numerical.

## One-line (corrected)
Gaussian smoothing of H_0 with variance 2 tau equals the de Bruijn function H_{-tau} (the Polymath15 heat-kernel formula at negative t); the site's Z-based smoothing has the same real zeros shifted by about 1.45 tau in the tested range, so its window counts match the exact flow only when no shifted zero crosses a window edge.
